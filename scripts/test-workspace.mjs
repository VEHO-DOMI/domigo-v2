import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Use the pnpm that invoked this script, including its pinned version in CI.
const pnpm = process.env.npm_execpath;
const command = pnpm ? process.execPath : "pnpm";
const prefix = pnpm ? [pnpm] : [];
const run = (args, options = {}) =>
  spawnSync(command, [...prefix, ...args], { cwd: root, ...options });

// Ask pnpm for the workspace inventory so new packages cannot be forgotten.
const inventory = run(["-r", "list", "--depth", "-1", "--json"], {
  encoding: "utf8",
});
if (inventory.error || inventory.status !== 0) {
  console.error(inventory.error ?? inventory.stderr);
  process.exit(inventory.status ?? 1);
}
const packages = JSON.parse(inventory.stdout).filter(
  (pkg) => resolve(pkg.path) !== root,
);
if (packages.length === 0) throw new Error("No workspace packages found");

const results = [];
for (const pkg of packages) {
  const label = `${pkg.name} (${relative(root, pkg.path)})`;
  const manifest = JSON.parse(readFileSync(join(pkg.path, "package.json"), "utf8"));
  if (!manifest.scripts?.test) {
    results.push(`${label}: SKIP (no test script; exit n/a)`);
    continue;
  }
  console.log(`\n=== Test: ${label} ===`);
  // Serial packages keep their worker pools from competing for the same CPU.
  // Do not stop on failure: the final summary must include every package.
  const result = run(["run", "test", ...process.argv.slice(2)], {
    cwd: pkg.path,
    stdio: "inherit",
  });
  const code = result.status ?? 1;
  if (result.error) console.error(result.error);
  results.push(`${label}: exit ${code}${result.signal ? ` (signal ${result.signal})` : ""}`);
  if (code !== 0) process.exitCode = 1;
}
console.log(`\n=== Workspace test summary ===\n${results.join("\n")}`);
