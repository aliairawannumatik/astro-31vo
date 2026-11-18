import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const threeRoot = path.resolve(root, "artifacts/numatik/node_modules/three");
const publicRoot = path.resolve(root, "artifacts/numatik/public/assets");
const copies = [
  ["examples/jsm/libs/draco/draco_decoder.js", "draco/draco_decoder.js"],
  ["examples/jsm/libs/draco/draco_decoder.wasm", "draco/draco_decoder.wasm"],
  ["examples/jsm/libs/draco/draco_wasm_wrapper.js", "draco/draco_wasm_wrapper.js"],
  ["examples/jsm/libs/basis/basis_transcoder.js", "basis/basis_transcoder.js"],
  ["examples/jsm/libs/basis/basis_transcoder.wasm", "basis/basis_transcoder.wasm"],
  ["LICENSE", "THREE-LICENSE.txt"],
];

for (const [source, destination] of copies) {
  const output = path.join(publicRoot, destination);
  await mkdir(path.dirname(output), { recursive: true });
  await copyFile(path.join(threeRoot, source), output);
}

console.log(`Prepared ${copies.length - 1} Three.js decoder/transcoder files in public/assets.`);
