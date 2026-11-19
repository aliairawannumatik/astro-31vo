import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { CITY_CONFIG } from "./city.config.mjs";

const parseBbox = (value) => {
  if (!value) return CITY_CONFIG.bbox;
  const parsed = value.split(",").map(Number);
  if (parsed.length !== 4 || parsed.some((item) => !Number.isFinite(item))) {
    throw new Error("CITY_BBOX must be south,west,north,east.");
  }
  const [south, west, north, east] = parsed;
  if (south >= north || west >= east) throw new Error("CITY_BBOX bounds are invalid.");
  return parsed;
};

const bbox = parseBbox(process.env.CITY_BBOX);
const [south, west, north, east] = bbox;
const centerLat = (south + north) / 2;
const centerLon = (west + east) / 2;
const metersPerDegreeLon = 111320 * Math.cos(centerLat * Math.PI / 180);
const toLocal = ({ lat, lon }) => ({
  x: (lon - centerLon) * metersPerDegreeLon,
  z: (centerLat - lat) * 111320,
});
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const simplify = (points, tolerance = 3) => {
  if (points.length <= 2) return points;
  const result = [points[0]];
  let last = points[0];
  for (let index = 1; index < points.length - 1; index += 1) {
    if (distance(last, points[index]) >= tolerance) {
      result.push(points[index]);
      last = points[index];
    }
  }
  result.push(points.at(-1));
  return result;
};

const kindForTags = (tags = {}) => {
  if (tags.highway) return "roads";
  if (tags.building) return "buildings";
  if (tags.leisure === "park" || tags.landuse === "grass" || tags.landuse === "recreation_ground") return "parks";
  if (tags.waterway || tags.natural === "water" || tags.water) return "water";
  if (tags.railway) return "railways";
  return null;
};

const chunkFor = (x, z) => ({
  cx: Math.floor(x / CITY_CONFIG.chunkSize),
  cz: Math.floor(z / CITY_CONFIG.chunkSize),
});

const collectWays = (elements) => {
  const chunks = new Map();
  for (const element of elements) {
    if (!Array.isArray(element.geometry) || !element.tags) continue;
    const kind = kindForTags(element.tags);
    if (!kind) continue;
    const points = simplify(element.geometry.map(({ lat, lon }) => toLocal({ lat, lon })));
    if (points.length < 2) continue;
    const center = points[Math.floor(points.length / 2)];
    const { cx, cz } = chunkFor(center.x, center.z);
    const key = `${cx}_${cz}`;
    if (!chunks.has(key)) chunks.set(key, { cx, cz, roads: [], buildings: [], parks: [], water: [], railways: [] });
    const chunk = chunks.get(key);
    const offsetX = cx * CITY_CONFIG.chunkSize;
    const offsetZ = cz * CITY_CONFIG.chunkSize;
    const feature = {
      id: element.id,
      tags: element.tags,
      points: points.map((point) => [Number((point.x - offsetX).toFixed(1)), Number((point.z - offsetZ).toFixed(1))]),
    };
    chunk[kind].push(feature);
  }
  return chunks;
};

const makeFallbackChunks = () => {
  const chunks = new Map();
  const chunkCount = Math.ceil(3000 / CITY_CONFIG.chunkSize);
  const firstChunk = -Math.floor(chunkCount / 2);
  for (let cx = firstChunk; cx < firstChunk + chunkCount; cx += 1) {
    for (let cz = firstChunk; cz < firstChunk + chunkCount; cz += 1) {
      const chunk = { cx, cz, roads: [], buildings: [], parks: [], water: [], railways: [] };
      for (let local = 8; local < CITY_CONFIG.chunkSize; local += 40) {
        chunk.roads.push({ id: `grid-x-${local}`, tags: { highway: "residential" }, points: [[local, 0], [local, CITY_CONFIG.chunkSize]] });
        chunk.roads.push({ id: `grid-z-${local}`, tags: { highway: "residential" }, points: [[0, local], [CITY_CONFIG.chunkSize, local]] });
      }
      const seed = (cx * 17 + cz * 31) % 7;
      if (seed === 0) chunk.parks.push({ id: `park-${cx}-${cz}`, tags: { leisure: "park" }, points: [[18, 18], [110, 18], [110, 110], [18, 110], [18, 18]] });
      if (cx === 0) chunk.water.push({ id: `river-${cz}`, tags: { waterway: "river" }, points: [[0, 0], [0, CITY_CONFIG.chunkSize]] });
      if (cz === 8) chunk.railways.push({ id: `rail-${cx}`, tags: { railway: "rail" }, points: [[0, 94], [CITY_CONFIG.chunkSize, 94]] });
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 3; col += 1) {
          if ((cx * 3 + cz * 5 + row + col) % 5 === 0) continue;
          const x = 20 + col * 38;
          const z = 20 + row * 38;
          chunk.buildings.push({
            id: `building-${cx}-${cz}-${row}-${col}`,
            tags: { building: "yes", height: String(7 + ((cx + cz + row * 3 + col) % 8) * 3) },
            points: [[x, z], [x + 18, z], [x + 18, z + 18], [x, z + 18], [x, z]],
          });
        }
      }
      chunks.set(`${cx}_${cz}`, chunk);
    }
  }
  return chunks;
};

const outputDirectory = process.env.CITY_OUTPUT_DIRECTORY
  ? fileURLToPath(new URL(process.env.CITY_OUTPUT_DIRECTORY, import.meta.url))
  : fileURLToPath(CITY_CONFIG.outputDirectory);
await mkdir(outputDirectory, { recursive: true });

let chunks;
let dataSource = "procedural-fallback";
if (process.env.CITY_OFFLINE !== "1") {
  const [bboxSouth, bboxWest, bboxNorth, bboxEast] = bbox;
  const query = `[out:json][timeout:25];(way["highway"](${bboxSouth},${bboxWest},${bboxNorth},${bboxEast});way["building"](${bboxSouth},${bboxWest},${bboxNorth},${bboxEast});way["leisure"="park"](${bboxSouth},${bboxWest},${bboxNorth},${bboxEast});way["landuse"~"grass|recreation_ground"](${bboxSouth},${bboxWest},${bboxNorth},${bboxEast});way["natural"="water"](${bboxSouth},${bboxWest},${bboxNorth},${bboxEast});way["waterway"](${bboxSouth},${bboxWest},${bboxNorth},${bboxEast});way["railway"](${bboxSouth},${bboxWest},${bboxNorth},${bboxEast}););out body geom;`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CITY_CONFIG.requestTimeoutMs);
  try {
    const response = await fetch(CITY_CONFIG.overpassUrl, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`OpenStreetMap Overpass returned HTTP ${response.status}.`);
    const payload = await response.json();
    if (!Array.isArray(payload.elements)) throw new Error("OpenStreetMap response did not contain map elements.");
    chunks = collectWays(payload.elements);
    if (!chunks.size) throw new Error("OpenStreetMap returned no city features for this bounding box.");
    dataSource = "openstreetmap";
  } catch (error) {
    console.warn(`OpenStreetMap data unavailable; building a procedural city: ${error instanceof Error ? error.message : String(error)}`);
    chunks = makeFallbackChunks();
  } finally {
    clearTimeout(timeout);
  }
} else {
  chunks = makeFallbackChunks();
}

for (const [key, chunk] of chunks) {
  await writeFile(`${outputDirectory}/${key}.json`, `${JSON.stringify(chunk)}\n`);
}
await writeFile(`${outputDirectory}/manifest.json`, `${JSON.stringify({
  attribution: dataSource === "openstreetmap" ? "© OpenStreetMap contributors" : null,
  license: dataSource === "openstreetmap" ? "ODbL-1.0" : "procedural",
  source: dataSource,
  bbox,
  chunkSize: CITY_CONFIG.chunkSize,
  chunkCount: chunks.size,
})}\n`);
console.log(`Built ${chunks.size} city chunks from ${dataSource} in ${outputDirectory}`);
