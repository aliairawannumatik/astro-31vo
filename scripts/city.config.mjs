export const CITY_CONFIG = {
  // A roughly 3 km sample around central Yogyakarta; override with CITY_BBOX.
  bbox: [-7.812, 110.353, -7.785, 110.38],
  chunkSize: 128,
  outputDirectory: new URL("../artifacts/numatik/public/city/chunks/", import.meta.url),
  overpassUrl: "https://overpass-api.de/api/interpreter",
  requestTimeoutMs: 18000,
};
