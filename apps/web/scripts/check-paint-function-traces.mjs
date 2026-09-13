import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Inspect actual Next function file lists, not a prediction from source imports. */
export function checkPaintFunctionTraces(appRoot) {
  const root = path.join(appRoot, ".next/server/app");
  const paint = path.join(appRoot, "public/art/g1/paint") + path.sep;
  const traces = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith(".nft.json")) traces.push(file);
    }
  };
  walk(root);
  if (!traces.length) throw new Error("No built app function traces found");
  let largest = 0;
  for (const trace of traces) {
    const files = new Set(JSON.parse(fs.readFileSync(trace, "utf8")).files);
    let bytes = 0;
    for (const rel of files) {
      const file = path.resolve(path.dirname(trace), rel);
      if (file.startsWith(paint)) throw new Error(`Paint asset in server function: ${file}`);
      bytes += fs.statSync(file).size;
    }
    if (bytes > 250 * 1024 * 1024) throw new Error(`Function trace exceeds 250 MiB: ${trace} (${bytes} bytes)`);
    largest = Math.max(largest, bytes);
  }
  return { traces: traces.length, largestBytes: largest, paintFiles: 0 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log("Paint function traces:", JSON.stringify(checkPaintFunctionTraces(process.cwd())));
}
