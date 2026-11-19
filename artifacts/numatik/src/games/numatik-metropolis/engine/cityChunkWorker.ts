interface ChunkRequest {
  cx: number;
  cz: number;
  size: number;
}

interface BuildingInstance {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
}

interface MapFeature {
  tags: Record<string, string>;
  points: [number, number][];
}

interface SerializedChunk {
  roads?: MapFeature[];
  buildings?: MapFeature[];
  parks?: MapFeature[];
  water?: MapFeature[];
  railways?: MapFeature[];
}

const hash = (x: number, z: number, salt: number) => {
  const value = Math.sin(x * 127.1 + z * 311.7 + salt * 74.7) * 43758.5453;
  return value - Math.floor(value);
};
let cityDataAvailable: Promise<boolean> | null = null;
const hasBuiltCityData = () => {
  cityDataAvailable ??= fetch("/city/chunks/manifest.json", { method: "HEAD" })
    .then((response) => response.ok)
    .catch(() => false);
  return cityDataAvailable;
};

self.onmessage = async (event: MessageEvent<ChunkRequest>) => {
  const { cx, cz, size } = event.data;
  const instances: BuildingInstance[] = [];
  let roads: Array<{ points: [number, number][]; width: number }> = [];
  let parks: Array<{ x: number; z: number; width: number; depth: number }> = [];
  let water: Array<{ points: [number, number][] }> = [];
  let railways: Array<{ points: [number, number][] }> = [];
  const cityCenterDistance = Math.hypot(cx, cz);
  const colors = ["#d9d3c7", "#b8c5c6", "#d0bfa5", "#9dacae", "#c5c9b9", "#c6a9a0"];
  try {
    if (await hasBuiltCityData()) {
      const response = await fetch(`/city/chunks/${cx}_${cz}.json`);
      if (!response.ok) throw new Error(`City chunk ${cx},${cz} could not be loaded.`);
      const source = await response.json() as SerializedChunk;
      roads = (source.roads ?? []).map((feature) => ({
        points: feature.points.map(([x, z]) => [x - size / 2, z - size / 2]),
        width: Math.max(4, Math.min(16, Number.parseFloat(feature.tags.width ?? "") || (feature.tags.highway === "motorway" ? 12 : 7))),
      }));
      water = (source.water ?? []).map((feature) => ({
        points: feature.points.map(([x, z]) => [x - size / 2, z - size / 2]),
      }));
      railways = (source.railways ?? []).map((feature) => ({
        points: feature.points.map(([x, z]) => [x - size / 2, z - size / 2]),
      }));
      parks = (source.parks ?? []).flatMap((feature) => {
        if (feature.points.length < 3) return [];
        const xs = feature.points.map(([x]) => x);
        const zs = feature.points.map(([, z]) => z);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minZ = Math.min(...zs);
        const maxZ = Math.max(...zs);
        return [{ x: (minX + maxX) / 2 - size / 2, z: (minZ + maxZ) / 2 - size / 2, width: maxX - minX, depth: maxZ - minZ }];
      });
      for (const building of source.buildings ?? []) {
        if (building.points.length < 3) continue;
        const xs = building.points.map(([x]) => x);
        const zs = building.points.map(([, z]) => z);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minZ = Math.min(...zs);
        const maxZ = Math.max(...zs);
        instances.push({
          x: (minX + maxX) / 2 - size / 2,
          z: (minZ + maxZ) / 2 - size / 2,
          width: Math.max(5, maxX - minX),
          depth: Math.max(5, maxZ - minZ),
          height: Math.max(5, Math.min(90, Number.parseFloat(building.tags.height ?? "") || 10)),
          color: colors[Math.floor(hash(cx, cz, instances.length + 2) * colors.length)]!,
        });
      }
    }
  } catch {
    roads = [];
    parks = [];
    water = [];
    railways = [];
    instances.length = 0;
  }
  if (!instances.length) {
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const seed = hash(cx * 3 + column, cz * 3 + row, 12);
      if (seed < 0.13) continue;
      const x = -size / 2 + 22 + column * 42 + (hash(cx, row, column) - 0.5) * 8;
      const z = -size / 2 + 22 + row * 42 + (hash(cz, column, row + 4) - 0.5) * 8;
      if (Math.abs(cx * size + x) < 20) continue;
      if (Math.abs(cz * size + z - 180) < 18) continue;
      const width = 11 + hash(cx, cz, column + row * 3) * 12;
      const depth = 11 + hash(cz, cx, row + column * 5) * 12;
      const height = 7 + hash(cx, cz, column * 7 + row) * (cityCenterDistance < 2 ? 80 : 24);
      instances.push({
        x,
        z,
        width,
        depth,
        height,
        color: colors[Math.floor(hash(cx, cz, row + column) * colors.length)]!,
      });
    }
  }
  }
  self.postMessage({ cx, cz, instances, roads, parks, water, railways });
};
