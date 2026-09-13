// CODEX DRAFT — NOT CANON. Rebuild recorded artwork in a new external directory.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import { importManifest, registerPixels } from '../import-ch01-buecherwelt.mjs';
const pack = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(pack, '../../..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const inventory = JSON.parse(fs.readFileSync(path.join(pack, 'inventory.json')));
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--dest') throw Error('usage: node reproduce.mjs --dest NEW_EXTERNAL_DIRECTORY');
const dest = path.resolve(args[1]);
// Resolve an existing parent to reject paths that enter the repository through a symlink.
let parent = path.dirname(dest);
assert(fs.existsSync(parent), 'destination parent must exist');
parent = fs.realpathSync(parent);
const actualDest = path.join(parent, path.basename(dest));
const actualRepo = fs.realpathSync(repo);
assert(actualDest !== actualRepo && !actualDest.startsWith(actualRepo + path.sep), 'destination must be outside the repository');
assert(!fs.existsSync(actualDest), 'destination must be new: no files are overwritten');
for (const entry of inventory.inputs) assert.equal(sha(fs.readFileSync(path.join(pack, entry.path))), entry.sha256, `input guard: ${entry.path}`);
for (const entry of inventory.manifests) assert.equal(sha(fs.readFileSync(path.join(pack, entry.path))), entry.sha256, `manifest guard: ${entry.path}`);
for (const entry of inventory.toolchain) assert.equal(sha(fs.readFileSync(path.join(repo, entry.path))), entry.sha256, `toolchain guard: ${entry.path}`);
fs.mkdirSync(actualDest);
// Historical first step: one uniform, premultiplied bilinear registration of the whole raw atlas.
// It precedes chroma-key removal. Do not replace this with per-cell resize or a keyed atlas.
const raw = PNG.sync.read(fs.readFileSync(path.join(pack, 'sources/courtyard-furniture/source-original-v2.png')));
assert.equal(raw.width, 2172); assert.equal(raw.height, 724);
const scale = raw.width / 1536;
const atlas = registerPixels(raw, { width: 1536, height: 512,
  x: [[0, scale * .5 - .5], [1535, scale * 1535.5 - .5]],
  y: [[0, scale * .5 - .5], [511, scale * 511.5 - .5]] });
const atlasBytes = PNG.sync.write(atlas);
const atlasPath = path.join(actualDest, 'atlas-3x512.png');
fs.writeFileSync(atlasPath, atlasBytes);
const storedAtlas = inventory.inputs.find(x => x.role === 'derived-atlas');
assert.equal(sha(atlasBytes), storedAtlas.sha256, 'raw→atlas byte reproduction');
const results = [];
for (const group of inventory.manifests) {
  const authored = JSON.parse(fs.readFileSync(path.join(pack, group.path)));
  const assets = authored.assets.map(asset => ({ ...asset,
    source: asset.source.endsWith('/atlas-3x512.png') ? atlasPath : path.resolve(pack, path.dirname(group.path), asset.source),
    ...(asset.clipAlpha ? { clipAlpha: path.resolve(pack, path.dirname(group.path), asset.clipAlpha) } : {}) }));
  const name = path.basename(group.path, '.json');
  const runtimeManifest = path.join(actualDest, name + '.json');
  fs.writeFileSync(runtimeManifest, JSON.stringify({ label: 'CODEX DRAFT — NOT CANON', assets }, null, 2) + '\n');
  const report = importManifest(runtimeManifest, path.join(actualDest, name));
  for (const output of inventory.outputs.filter(x => x.manifest === group.path)) {
    const bytes = fs.readFileSync(path.join(actualDest, name, output.stem + '.png'));
    const currentPublic = fs.readFileSync(path.join(repo, output.publicPath));
    const actualSha256 = sha(bytes), publicSha256 = sha(currentPublic);
    results.push({ ...output, actualSha256, publicSha256,
      byteIdentical: actualSha256 === output.sha256 && publicSha256 === output.sha256 });
  }
  console.log(`${name}: ${report.assets.length} imported`);
}
const evidence = { label: 'CODEX DRAFT — NOT CANON', node: process.version,
  atlas: { rawSha256: sha(fs.readFileSync(path.join(pack, 'sources/courtyard-furniture/source-original-v2.png'))),
    sha256: sha(atlasBytes), byteIdentical: true, width: 1536, height: 512, uniformScale: scale },
  assetCount: results.length, byteIdenticalCount: results.filter(x => x.byteIdentical).length, outputs: results };
fs.writeFileSync(path.join(actualDest, 'reproduction.json'), JSON.stringify(evidence, null, 2) + '\n');
assert(results.every(x => x.byteIdentical), 'output mismatch: inspect reproduction.json');
console.log(`PASS: ${results.length}/${results.length} PNGs byte-identical to recorded AND current public files`);
