// CODEX DRAFT — NOT CANON. Register authored pixels; never fill missing paint.
// Run with Node 24: --manifest manifest.json --dest DIR, or --selftest.
// Manifest: an array (or {assets:[...]}) of {source,stem,width,height,x,y}.
// Optional clipAlpha: PNG path, target-sized; only its alpha=0 cuts pixels.
// Optional chromaMatte: "no-violet", only for an explicitly non-violet palette.
// Axes contain [output, source] pixel-centre coordinates: 0 is the first
// pixel, size-1 the last. Both coordinates strictly increase. Endpoints must
// cover the output; no extrapolation. Source coordinates outside its canvas
// are transparent. Relative sources resolve beside the manifest, not cwd.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import {
  CUT_ALPHA, KEY_RGB, KEY_TOL, magentaness, keyFringe, keySpecks,
  stripKeyFringe, stripKeySpecks,
} from "../../scripts/key-fringe.mjs";

const SELF = fileURLToPath(import.meta.url);
const SOFT_TOL = 110; // Same soft alpha ramp as import-codex-sheet.mjs.
const MATTE_MAX_MAGENTA = 0; // Only the explicit wood/olive/cream palette contract.
const REPORT = "import-ch01-buecherwelt.report.json";
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const image = (png) => ({ w: png.width, h: png.height, px: png.data });

export function alphaBounds(png, threshold = 0) {
  let minX = png.width, minY = png.height, maxX = -1, maxY = -1, pixels = 0;
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
    if (png.data[(y * png.width + x) * 4 + 3] <= threshold) continue;
    minX = Math.min(minX, x); minY = Math.min(minY, y);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); pixels++;
  }
  return pixels ? { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1, pixels } : null;
}

export function validateAxis(points, size, name = "axis") {
  if (!Number.isSafeInteger(size) || size < 1) throw Error(`${name}: positive integer size required`);
  if (!Array.isArray(points) || points.length < 2) throw Error(`${name}: at least two pass points required`);
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (!Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite)) {
      throw Error(`${name}[${i}]: finite [output, source] pair required`);
    }
    if (i && (p[0] <= points[i - 1][0] || p[1] <= points[i - 1][1])) {
      throw Error(`${name}[${i}]: output AND source coordinates must strictly increase`);
    }
    if (i && (!Number.isFinite(p[0] - points[i - 1][0]) || !Number.isFinite(p[1] - points[i - 1][1]))) {
      throw Error(`${name}[${i}]: coordinate interval overflows`);
    }
  }
  if (points[0][0] > 0 || points.at(-1)[0] < size - 1) {
    throw Error(`${name}: pass points must cover output pixel centres 0…${size - 1}`);
  }
}

function coordinates(points, size) {
  const out = new Float64Array(size);
  let segment = 0;
  for (let x = 0; x < size; x++) {
    while (segment < points.length - 2 && x > points[segment + 1][0]) segment++;
    const [o0, s0] = points[segment], [o1, s1] = points[segment + 1];
    // The convex form avoids subtraction overflow for distant source points.
    const t = (x - o0) / (o1 - o0);
    out[x] = t === 0 ? s0 : t === 1 ? s1 : s0 * (1 - t) + s1 * t;
    if (!Number.isFinite(out[x])) throw Error("axis: non-finite mapped coordinate");
  }
  return out;
}

/** Existing key ramp, multiplied by actual alpha (never replacing it). */
export function removeKey(png) {
  let cut = 0, softened = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const a = png.data[i + 3];
    const d = Math.hypot(png.data[i] - KEY_RGB[0], png.data[i + 1] - KEY_RGB[1], png.data[i + 2] - KEY_RGB[2]);
    const keep = Math.max(0, Math.min(1, (d - KEY_TOL) / (SOFT_TOL - KEY_TOL)));
    const next = Math.round(a * keep);
    if (a && !next) cut++;
    else if (next < a) softened++;
    png.data[i + 3] = next;
    if (!next) png.data.fill(0, i, i + 4); // Invisible RGB cannot seed a later blend.
  }
  return { cut, softened, keyRgb: KEY_RGB, tolerance: KEY_TOL, softTolerance: SOFT_TOL };
}

function cleanFringe(png) {
  const img = image(png);
  const specks = stripKeySpecks(img);
  const fringe = stripKeyFringe(img);
  // Fringe healing can split a formerly connected pink component into small
  // islands (measured on hall-background-source.png). Classify those once with
  // the existing speck rule; never loop or relax either detector's threshold.
  const finalSpecks = stripKeySpecks(img);
  for (let i = 0; i < png.data.length; i += 4) if (!png.data[i + 3]) png.data.fill(0, i, i + 4);
  const remaining = { fringe: keyFringe(img).length, specks: keySpecks(img).length };
  if (remaining.fringe || remaining.specks) throw Error(`key cleanup incomplete: ${JSON.stringify(remaining)}`);
  return { specks, fringe, finalSpecks, remaining };
}

/** Explicit palette contract, not a general colour-key heuristic. This is
 * colour-only decontamination AFTER normal import: alpha is never touched.
 * Copy the nearest already-painted non-pink RGB within 24 pixels, using a
 * snapshot so repaired pixels cannot seed further repairs. If no such sample
 * exists, reject rather than delete paint or invent a replacement colour. */
export function decontaminateMatte(png, mode) {
  if (mode === undefined) return null;
  if (mode !== "no-violet") throw Error("chromaMatte: only explicit no-violet is supported");
  const src = Buffer.from(png.data), radius = 24;
  const alpha = (data) => Buffer.from(data.filter((_, i) => i % 4 === 3));
  const alphaBefore = sha(alpha(src));
  let recoloured = 0, maxDistanceSquared = 0;
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
    const i = (y * png.width + x) * 4;
    if (!src[i + 3] || magentaness(src[i], src[i + 1], src[i + 2]) <= MATTE_MAX_MAGENTA) continue;
    let nearest = null;
    for (let ring = 1; ring <= radius; ring++) {
      for (let dy = -ring; dy <= ring; dy++) for (let dx = -ring; dx <= ring; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
        const xx = x + dx, yy = y + dy, distanceSquared = dx * dx + dy * dy;
        if (xx < 0 || yy < 0 || xx >= png.width || yy >= png.height || distanceSquared > radius * radius) continue;
        if (nearest && distanceSquared >= nearest.distanceSquared) continue;
        const j = (yy * png.width + xx) * 4;
        if (src[j + 3] < CUT_ALPHA || magentaness(src[j], src[j + 1], src[j + 2]) > MATTE_MAX_MAGENTA) continue;
        nearest = { j, distanceSquared };
      }
      // Every unvisited ring is at least ring+1 pixels away.
      if (nearest && (ring + 1) ** 2 > nearest.distanceSquared) break;
    }
    if (!nearest) throw Error(`chromaMatte: no non-violet painted neighbour within ${radius}px at (${x},${y})`);
    src.copy(png.data, i, nearest.j, nearest.j + 3);
    recoloured++; maxDistanceSquared = Math.max(maxDistanceSquared, nearest.distanceSquared);
  }
  const alphaAfter = sha(alpha(png.data));
  if (alphaBefore !== alphaAfter) throw Error("chromaMatte changed alpha");
  const remaining = { fringe: keyFringe(image(png)).length, specks: keySpecks(image(png)).length };
  if (remaining.fringe || remaining.specks) throw Error(`chromaMatte cleanup incomplete: ${JSON.stringify(remaining)}`);
  return { mode, recoloured, threshold: MATTE_MAX_MAGENTA, radius, maxDistanceSquared, alphaBefore, alphaAfter, remaining };
}

/** Bilinear sampling in premultiplied alpha; hidden RGB has zero weight. */
export function registerPixels(source, spec) {
  validateAxis(spec.x, spec.width, "x"); validateAxis(spec.y, spec.height, "y");
  if (!Number.isSafeInteger(spec.width * spec.height * 4)) throw Error("unsafe canvas byte count");
  const xs = coordinates(spec.x, spec.width), ys = coordinates(spec.y, spec.height);
  const target = new PNG({ width: spec.width, height: spec.height });
  for (let y = 0; y < spec.height; y++) for (let x = 0; x < spec.width; x++) {
    const sx = xs[x], sy = ys[y];
    if (sx < 0 || sy < 0 || sx > source.width - 1 || sy > source.height - 1) continue;
    const x0 = Math.floor(sx), y0 = Math.floor(sy), fx = sx - x0, fy = sy - y0;
    let a = 0, r = 0, g = 0, b = 0;
    for (let dy = 0; dy <= 1; dy++) for (let dx = 0; dx <= 1; dx++) {
      const xx = x0 + dx, yy = y0 + dy;
      if (xx >= source.width || yy >= source.height) continue;
      const w = (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy);
      const i = (yy * source.width + xx) * 4, wa = w * source.data[i + 3];
      a += wa;
      r += source.data[i] * wa; g += source.data[i + 1] * wa; b += source.data[i + 2] * wa;
    }
    const i = (y * spec.width + x) * 4, alpha = Math.round(a);
    if (!alpha) continue;
    target.data[i] = Math.round(r / a); target.data[i + 1] = Math.round(g / a);
    target.data[i + 2] = Math.round(b / a); target.data[i + 3] = alpha;
  }
  return target;
}

/** Optional registered cut mask: alpha 0 removes, every other alpha leaves
 * the sampled RGBA unchanged. A mask never supplies paint or opacity. */
export function clipAlpha(target, mask) {
  if (target.width !== mask.width || target.height !== mask.height) {
    throw Error(`clipAlpha: expected ${target.width}×${target.height}, got ${mask.width}×${mask.height}`);
  }
  let cut = 0;
  for (let i = 0; i < target.data.length; i += 4) {
    if (mask.data[i + 3] !== 0) continue;
    if (target.data[i + 3] > 0) cut++;
    target.data.fill(0, i, i + 4);
  }
  return { cut, rule: "mask alpha=0 cuts; all nonzero mask alpha leaves source alpha unchanged" };
}

export function importManifest(manifestPath, dest) {
  manifestPath = path.resolve(manifestPath); dest = path.resolve(dest);
  const manifestBytes = fs.readFileSync(manifestPath), raw = JSON.parse(manifestBytes);
  const assets = Array.isArray(raw) ? raw : raw?.assets;
  if (!Array.isArray(assets) || !assets.length) throw Error("manifest needs a nonempty assets array");
  const stems = new Set();
  // Validate every declaration before creating any output PNG.
  const plans = assets.map((a, i) => {
    if (!a || typeof a !== "object" || typeof a.stem !== "string" || !/^[a-z0-9][a-z0-9_-]*$/.test(a.stem)) {
      throw Error(`asset ${i}: safe lowercase stem without extension required`);
    }
    if (stems.has(a.stem)) throw Error(`duplicate stem: ${a.stem}`);
    stems.add(a.stem);
    if (typeof a.source !== "string" || !a.source.trim()) throw Error(`${a.stem}: source required`);
    if (a.chromaMatte !== undefined && a.chromaMatte !== "no-violet") throw Error(`${a.stem}: invalid chromaMatte declaration`);
    validateAxis(a.x, a.width, `${a.stem}.x`); validateAxis(a.y, a.height, `${a.stem}.y`);
    const source = fs.realpathSync(path.resolve(path.dirname(manifestPath), a.source));
    if (!fs.statSync(source).isFile()) throw Error(`${a.stem}: source is not a file`);
    let maskPath = null;
    if (a.clipAlpha !== undefined) {
      if (typeof a.clipAlpha !== "string" || !a.clipAlpha.trim()) throw Error(`${a.stem}: clipAlpha must be a PNG path`);
      maskPath = fs.realpathSync(path.resolve(path.dirname(manifestPath), a.clipAlpha));
      if (!fs.statSync(maskPath).isFile()) throw Error(`${a.stem}: clipAlpha is not a file`);
    }
    return { ...a, source, maskPath, target: path.join(dest, `${a.stem}.png`) };
  });
  const sources = new Set(plans.map(p => p.source));
  for (const p of plans) {
    const target = fs.existsSync(p.target) ? fs.realpathSync(p.target) : p.target;
    if (sources.has(target)) throw Error(`${p.stem}: output would overwrite an input source`);
  }
  const report = {
    label: "CODEX DRAFT — NOT CANON", schema: "ch01TerrainImport@1",
    manifestPath, manifestSha256: sha(manifestBytes), importerSha256: sha(fs.readFileSync(SELF)),
    fringeModuleSha256: sha(fs.readFileSync(new URL("../../scripts/key-fringe.mjs", import.meta.url))),
    node: process.version, pngjsVersion: JSON.parse(fs.readFileSync(new URL("../../node_modules/pngjs/package.json", import.meta.url))).version,
    convention: "pixel centres; strict monotone inverse map; no extrapolation; outside source transparent; premultiplied bilinear",
    assets: [],
  };
  fs.mkdirSync(dest, { recursive: true });
  const staging = fs.mkdtempSync(path.join(dest, ".ch01-import-"));
  try {
    for (const p of plans) {
      let step = "decode source";
      try {
        const bytes = fs.readFileSync(p.source), source = PNG.sync.read(bytes);
        const sourceBounds = alphaBounds(source), sourceRgbaSha256 = sha(source.data);
        step = "source key/fringe cleanup";
        const key = removeKey(source), sourceCleanup = cleanFringe(source);
        const keyedBounds = alphaBounds(source), keyedInkBounds = alphaBounds(source, CUT_ALPHA);
        const keyedRgbaSha256 = sha(source.data);
        step = "coordinate registration";
        const target = registerPixels(source, p), beforeClipBounds = alphaBounds(target);
        let clip = null;
        if (p.maskPath) {
          step = `clipAlpha ${p.maskPath}`;
          const maskBytes = fs.readFileSync(p.maskPath), mask = PNG.sync.read(maskBytes);
          clip = { path: p.maskPath, sha256: sha(maskBytes), rgbaSha256: sha(mask.data),
            bounds: alphaBounds(mask), ...clipAlpha(target, mask) };
        }
        step = "output fringe cleanup";
        const outputCleanup = cleanFringe(target);
        step = "declared chroma matte decontamination";
        const chromaMatte = decontaminateMatte(target, p.chromaMatte);
        const outputBounds = alphaBounds(target), outputInkBounds = alphaBounds(target, CUT_ALPHA);
        if (!outputBounds) throw Error(`${p.stem}: registered output is empty; pass points cannot manufacture paint`);
        const encoded = PNG.sync.write(target, { colorType: 6 });
        fs.writeFileSync(path.join(staging, `${p.stem}.png`), encoded);
        report.assets.push({
          stem: p.stem, source: p.source, target: p.target,
          sourceSha256: sha(bytes), sourceRgbaSha256, keyedRgbaSha256,
          previousTargetSha256: fs.existsSync(p.target) ? sha(fs.readFileSync(p.target)) : null,
          outputSha256: sha(encoded), outputRgbaSha256: sha(target.data), outputBytes: encoded.length,
          sourceCanvas: { width: source.width, height: source.height },
          outputCanvas: { width: p.width, height: p.height }, x: p.x, y: p.y,
          sourceBounds, keyedBounds, keyedInkBounds, beforeClipBounds, clip, outputBounds, outputInkBounds,
          boundsConvention: "integer origin and extent; Bounds alpha>0, InkBounds alpha>CUT_ALPHA",
          cutAlpha: CUT_ALPHA, key, sourceCleanup, outputCleanup, chromaMatte,
        });
      } catch (error) {
        throw Error(`${p.stem} [${p.source}] at ${step}: ${error.message}`, { cause: error });
      }
    }
    // A bad later source/axis leaves earlier destination PNGs untouched.
    for (const p of plans) fs.renameSync(path.join(staging, `${p.stem}.png`), p.target);
    fs.writeFileSync(path.join(dest, REPORT), `${JSON.stringify(report, null, 2)}\n`);
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
  return report;
}

export function selftest() {
  let passed = 0;
  const test = (name, fn) => { fn(); passed++; console.log(`ok ${passed} - ${name}`); };
  const pixel = (p, x, y) => [...p.data.subarray((y * p.width + x) * 4, (y * p.width + x) * 4 + 4)];
  const put = (p, x, y, rgba) => p.data.set(rgba, (y * p.width + x) * 4);
  const identity = (w, h) => ({ width: w, height: h, x: [[0, 0], [Math.max(1, w - 1), Math.max(1, w - 1)]], y: [[0, 0], [Math.max(1, h - 1), Math.max(1, h - 1)]] });
  test("undeclared matte leaves legitimate violet and every RGBA byte untouched", () => {
    const p = new PNG({ width: 2, height: 2 });
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) put(p, x, y, [180, 40, 200, 127]);
    const before = Buffer.from(p.data);
    assert.equal(decontaminateMatte(p), null); assert.deepEqual(p.data, before);
    assert.throws(() => decontaminateMatte(p, true), /only explicit no-violet/);
    assert.throws(() => decontaminateMatte(p, "no-violet"), /no non-violet painted neighbour/);
    assert.deepEqual(p.data, before);
  });
  test("declared matte only borrows existing RGB and preserves every alpha and honest pixel", () => {
    const p = new PNG({ width: 6, height: 1 });
    put(p, 0, 0, [80, 100, 30, 255]); put(p, 1, 0, [210, 40, 190, 64]);
    put(p, 2, 0, [220, 50, 180, 1]); put(p, 3, 0, [170, 100, 30, 128]);
    put(p, 4, 0, [255, 0, 255, 0]);
    put(p, 5, 0, [180, 140, 150, 64]); // Weak salmon-pink below the stock fringe threshold.
    const result = decontaminateMatte(p, "no-violet");
    assert.equal(result.recoloured, 3); assert.equal(result.alphaBefore, result.alphaAfter);
    assert.deepEqual(pixel(p, 0, 0), [80, 100, 30, 255]);
    assert.deepEqual(pixel(p, 1, 0), [80, 100, 30, 64]);
    assert.deepEqual(pixel(p, 2, 0), [170, 100, 30, 1]);
    assert.deepEqual(pixel(p, 3, 0), [170, 100, 30, 128]);
    assert.deepEqual(pixel(p, 4, 0), [255, 0, 255, 0]);
    assert.deepEqual(pixel(p, 5, 0), [170, 100, 30, 64]);
  });
  test("actual alpha survives key removal; key and hidden RGB remain empty", () => {
    const p = new PNG({ width: 3, height: 1 });
    put(p, 0, 0, [200, 100, 20, 127]); put(p, 1, 0, [255, 0, 255, 255]); put(p, 2, 0, [60, 180, 40, 0]);
    removeKey(p); cleanFringe(p);
    assert.deepEqual(pixel(p, 0, 0), [200, 100, 20, 127]);
    assert.deepEqual(pixel(p, 1, 0), [0, 0, 0, 0]); assert.deepEqual(pixel(p, 2, 0), [0, 0, 0, 0]);
    assert.deepEqual(registerPixels(p, identity(3, 1)).data, p.data);
  });
  test("fringe cleanup also heals newly separated specks without deleting paint", () => {
    const p = new PNG({ width: 32, height: 32 });
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) put(p, x, y, [200, 120, 30, 255]);
    for (let y = 12; y < 24; y++) for (let x = 12; x < 24; x++) put(p, x, y, [200, 40, 200, 255]);
    for (const [x, y] of [[0, 9], [1, 9], [0, 11], [1, 11]]) put(p, x, y, [190, 50, 190, 255]);
    put(p, 0, 10, [200, 0, 200, 255]);
    const result = cleanFringe(p);
    assert.equal(result.finalSpecks.healed, 4); assert.equal(result.finalSpecks.cut, 0);
    assert.deepEqual(result.remaining, { fringe: 0, specks: 0 });
    assert.deepEqual(pixel(p, 18, 18), [200, 40, 200, 255]);
    for (let i = 3; i < p.data.length; i += 4) assert.equal(p.data[i], 255);
  });
  test("bilinear uses both axes and premultiplied colour, never hidden blue", () => {
    const p = new PNG({ width: 2, height: 2 });
    put(p, 0, 0, [255, 0, 0, 255]); put(p, 0, 1, [0, 255, 0, 255]);
    put(p, 1, 0, [0, 0, 255, 0]); put(p, 1, 1, [0, 0, 255, 0]);
    const out = registerPixels(p, { width: 3, height: 3, x: [[0, 0], [2, 1]], y: [[0, 0], [2, 1]] });
    assert.deepEqual(pixel(out, 1, 1), [128, 128, 0, 128]);
    assert.deepEqual(pixel(out, 2, 1), [0, 0, 0, 0]);
    put(p, 0, 0, [255, 0, 0, 128]); put(p, 0, 1, [255, 0, 0, 128]);
    assert.deepEqual(pixel(registerPixels(p, { width: 3, height: 1, x: [[0, 0], [2, 1]], y: [[0, 0], [1, 1]] }), 1, 0), [255, 0, 0, 64]);
  });
  test("nonuniform x/y pass points land on their exact authored pixels", () => {
    const p = new PNG({ width: 5, height: 5 });
    for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) put(p, x, y, [x * 40, y * 40, 0, 255]);
    const out = registerPixels(p, { width: 5, height: 5, x: [[0, 0], [2, 1], [4, 4]], y: [[0, 0], [2, 3], [4, 4]] });
    assert.deepEqual(pixel(out, 2, 2), [40, 120, 0, 255]);
    assert.deepEqual(pixel(out, 3, 3), [100, 140, 0, 255]);
    assert.deepEqual(pixel(out, 4, 4), [160, 160, 0, 255]);
  });
  test("out-of-canvas mapping stays empty, including fractional coordinates", () => {
    const p = new PNG({ width: 2, height: 2 }); p.data.fill(255);
    const out = registerPixels(p, { width: 5, height: 5, x: [[0, -0.5], [2, 0.5], [4, 1.5]], y: [[0, -0.5], [2, 0.5], [4, 1.5]] });
    assert.deepEqual(alphaBounds(out), { x: 1, y: 1, width: 3, height: 3, pixels: 9 });
    assert.deepEqual(pixel(out, 0, 2), [0, 0, 0, 0]);
    assert.deepEqual(pixel(out, 2, 4), [0, 0, 0, 0]);
  });
  test("bad axes rejected: reversal, duplicates, NaN, malformed, uncovered", () => {
    for (const axis of [[], [[0, 0]], [[0, 0], [0, 1]], [[0, 0], [2, 0]], [[0, 2], [2, 1]], [[2, 0], [0, 2]], [[0, 0], [2, NaN]], [[0, 0], [2, Infinity]], [[0, 0, 0], [2, 2]], [[1, 0], [2, 2]], [[0, 0], [1, 2]]]) assert.throws(() => validateAxis(axis, 3));
    assert.throws(() => validateAxis([[0, 0], [2, 2]], 0));
    assert.throws(() => validateAxis([[-1e308, 0], [1e308, 1]], 3));
  });
  test("clip mask only removes zero-alpha pixels; partial alpha cannot boost or dim", () => {
    const p = new PNG({ width: 4, height: 1 }), mask = new PNG({ width: 4, height: 1 });
    for (let x = 0; x < 4; x++) {
      put(p, x, 0, [180, 110, 30, [0, 64, 127, 255][x]]);
      put(mask, x, 0, [255, 255, 255, [255, 255, 1, 0][x]]);
    }
    const before = Buffer.from(p.data);
    assert.equal(clipAlpha(p, mask).cut, 1);
    for (let x = 0; x < 4; x++) assert.ok(p.data[x * 4 + 3] <= before[x * 4 + 3]);
    assert.equal(pixel(p, 0, 0)[3], 0);
    assert.deepEqual(pixel(p, 1, 0), [180, 110, 30, 64]);
    assert.deepEqual(pixel(p, 2, 0), [180, 110, 30, 127]);
    assert.deepEqual(pixel(p, 3, 0), [0, 0, 0, 0]);
    assert.throws(() => clipAlpha(p, new PNG({ width: 3, height: 1 })), /expected 4×1/);
  });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ch01-terrain-selftest-"));
  try {
    const src = new PNG({ width: 3, height: 3 });
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) put(src, x, y, [255, 0, 255, 255]);
    put(src, 1, 1, [180, 110, 30, 128]);
    const source = path.join(tmp, "source.png"), manifest = path.join(tmp, "manifest.json"), dest = path.join(tmp, "out");
    fs.writeFileSync(source, PNG.sync.write(src)); const original = fs.readFileSync(source);
    const asset = { source: "source.png", stem: "test_ground", ...identity(3, 3) };
    test("manifest opt-in affects only its declared asset; genuine violet default stays intact", () => {
      const p = new PNG({ width: 32, height: 32 });
      for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) put(p, x, y, [100, 120, 30, 255]);
      for (let y = 10; y < 22; y++) for (let x = 10; x < 22; x++) put(p, x, y, [160, 40, 190, 255]);
      fs.writeFileSync(path.join(tmp, "violet.png"), PNG.sync.write(p));
      const violet = { source: "violet.png", stem: "violet_default", ...identity(32, 32) };
      fs.writeFileSync(manifest, JSON.stringify([violet, { ...violet, stem: "declared_no_violet", chromaMatte: "no-violet" }]));
      const [unchanged, treated] = importManifest(manifest, dest).assets;
      const plain = PNG.sync.read(fs.readFileSync(unchanged.target)), matte = PNG.sync.read(fs.readFileSync(treated.target));
      assert.deepEqual(plain.data, p.data); assert.equal(unchanged.chromaMatte, null);
      assert.deepEqual(pixel(matte, 16, 16), [100, 120, 30, 255]);
      assert.equal(treated.chromaMatte.recoloured, 144);
      assert.equal(treated.chromaMatte.alphaBefore, treated.chromaMatte.alphaAfter);
      fs.writeFileSync(manifest, JSON.stringify([{ ...violet, chromaMatte: true }]));
      assert.throws(() => importManifest(manifest, dest), /invalid chromaMatte/);
    });
    test("real PNG import reports bounds/hashes and repeats with identical pixels/bytes", () => {
      fs.writeFileSync(manifest, JSON.stringify({ assets: [asset] }));
      const a = importManifest(manifest, dest).assets[0], b = importManifest(manifest, dest).assets[0];
      assert.equal(a.sourceSha256, sha(original)); assert.equal(a.previousTargetSha256, null);
      assert.equal(b.previousTargetSha256, a.outputSha256); assert.equal(a.outputSha256, b.outputSha256);
      assert.equal(a.outputRgbaSha256, b.outputRgbaSha256);
      assert.deepEqual(a.outputBounds, { x: 1, y: 1, width: 1, height: 1, pixels: 1 });
      assert.deepEqual(pixel(PNG.sync.read(fs.readFileSync(path.join(dest, "test_ground.png"))), 1, 1), [180, 110, 30, 128]);
      assert.deepEqual(fs.readFileSync(source), original);
      assert.equal(a.outputCleanup.remaining.fringe, 0); assert.equal(a.outputCleanup.remaining.specks, 0);
    });
    test("duplicate/path stems and source overwrite fail before output", () => {
      for (const assets of [[asset, asset], [{ ...asset, stem: 123 }], [{ ...asset, stem: "../outside" }], [{ ...asset, stem: "source" }]]) {
        fs.writeFileSync(manifest, JSON.stringify(assets)); assert.throws(() => importManifest(manifest, tmp));
      }
      assert.deepEqual(fs.readFileSync(source), original);
    });
    test("later bad PNG cannot partially replace an existing earlier output", () => {
      const before = fs.readFileSync(path.join(dest, "test_ground.png"));
      fs.writeFileSync(path.join(tmp, "bad.png"), "not a PNG");
      fs.writeFileSync(manifest, JSON.stringify([asset, { ...asset, source: "bad.png", stem: "bad" }]));
      assert.throws(() => importManifest(manifest, dest));
      assert.deepEqual(fs.readFileSync(path.join(dest, "test_ground.png")), before);
      assert.equal(fs.existsSync(path.join(dest, "bad.png")), false);
    });
    test("manifest clip path is resolved beside manifest; mismatch rejects without replacing output", () => {
      const maskPath = path.join(tmp, "mask.png"), mask = new PNG({ width: 3, height: 3 });
      put(mask, 1, 1, [0, 0, 0, 1]); fs.writeFileSync(maskPath, PNG.sync.write(mask));
      fs.writeFileSync(manifest, JSON.stringify([{ ...asset, clipAlpha: "mask.png" }]));
      const result = importManifest(manifest, dest).assets[0];
      assert.equal(result.clip.sha256, sha(fs.readFileSync(maskPath)));
      assert.equal(pixel(PNG.sync.read(fs.readFileSync(result.target)), 1, 1)[3], 128);
      const before = fs.readFileSync(result.target);
      fs.writeFileSync(maskPath, PNG.sync.write(new PNG({ width: 2, height: 3 })));
      assert.throws(() => importManifest(manifest, dest), /clipAlpha: expected 3×3/);
      assert.deepEqual(fs.readFileSync(result.target), before);
    });
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  console.log(`import-ch01-buecherwelt --selftest: OK (${passed} groups)`);
}

function main(args) {
  if (args.length === 1 && args[0] === "--selftest") return selftest();
  const options = new Map();
  for (let i = 0; i < args.length; i += 2) {
    if (!["--manifest", "--dest"].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith("--") || options.has(args[i])) {
      throw Error("usage: --manifest FILE.json --dest DIR | --selftest");
    }
    options.set(args[i], args[i + 1]);
  }
  if (options.size !== 2) throw Error("usage: --manifest FILE.json --dest DIR | --selftest");
  const report = importManifest(options.get("--manifest"), options.get("--dest"));
  for (const a of report.assets) console.log(`${a.stem}: ${a.outputCanvas.width}×${a.outputCanvas.height}; alpha ${JSON.stringify(a.outputBounds)}; SHA256 ${a.outputSha256}`);
  console.log(`Report: ${path.resolve(options.get("--dest"), REPORT)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === SELF) {
  try {
    if (Number(process.versions.node.split(".")[0]) < 24) throw Error("Node 24 or newer required");
    main(process.argv.slice(2));
  } catch (error) { console.error(`import-ch01-buecherwelt: ${error.message}`); process.exitCode = 1; }
}
