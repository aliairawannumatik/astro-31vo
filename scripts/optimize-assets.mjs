import { readdir, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const inputRoot = path.resolve(root, process.argv[2] ?? "artifacts/numatik/public/assets");
const outputRoot = path.resolve(root, process.argv[3] ?? "artifacts/numatik/public/assets-optimized");
const compression = process.argv[4] ?? "meshopt";

if (!["meshopt", "draco", "quantize"].includes(compression)) {
  throw new Error("Compression must be one of: meshopt, draco, quantize");
}

const findGlbs = async (directory) => {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findGlbs(fullPath);
    return entry.isFile() && entry.name.toLowerCase().endsWith(".glb") ? [fullPath] : [];
  }));
  return nested.flat();
};

const inputs = await findGlbs(inputRoot);
if (inputs.length === 0) {
  console.log(`No GLB assets found in ${path.relative(root, inputRoot)}.`);
  process.exit(0);
}

for (const input of inputs) {
  const relativePath = path.relative(inputRoot, input);
  const output = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(output), { recursive: true });
  await new Promise((resolve, reject) => {
    const child = spawn("pnpm", [
      "--filter", "@workspace/numatik", "exec", "gltf-transform", "optimize", input, output,
      "--compress", compression,
      "--texture-compress", "ktx2",
      "--texture-size", "2048",
    ], { cwd: root, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`gltf-transform exited with code ${code} for ${relativePath}`));
    });
  });
  console.log(`${path.relative(root, input)} -> ${path.relative(root, output)}`);
}
