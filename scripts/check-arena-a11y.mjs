#!/usr/bin/env node
/** Arena display gate. Real components + freshly compiled styles, synthetic data.
 * No server, login, database or external requests. This is not an end-to-end game.
 * Run: pnpm check:arena-a11y [--out /absolute/evidence/path] [--selftest]
 * Install Chromium with `pnpm exec playwright install chromium`, or set CHROME_BIN.
 * Text contrast uses the rendered background (including gradients), with text
 * hidden only for that measurement. Logo artwork/emoji and disabled controls are
 * explicitly excluded. Focus behaviour and interactive flows need separate tests.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
if (outIndex >= 0 && !args[outIndex + 1]) throw Error('--out needs an absolute path');
const out = outIndex >= 0 ? path.resolve(args[outIndex + 1]) : fs.mkdtempSync(path.join(os.tmpdir(), 'arena-a11y-'));
if (out === root || out.startsWith(root + path.sep)) throw Error('Evidence must stay outside the repository');
fs.mkdirSync(out, { recursive: true });
const req = createRequire(path.join(root, 'apps/web/package.json'));
const React = req('react'), jsx = req('react/jsx-runtime');
const { renderToStaticMarkup } = req('react-dom/server'), ts = req('typescript');
const postcss = createRequire(req.resolve('@tailwindcss/postcss'))('postcss');
const arenaCss = fs.readFileSync(path.join(root, 'apps/web/app/arena/arena.css'), 'utf8');

function tokenViolations(css) {
  const bad = [];
  postcss.parse(css).walkDecls(d => {
    if (d.prop.startsWith('--')) {
      if (d.parent.type !== 'rule' || d.parent.selector !== '.og-root[data-screen="arena"][data-grade]' || !/^(--arena-[a-z-]+|--muted)$/.test(d.prop)) bad.push(`token outside the Arena design layer: ${d.prop}`);
      return;
    }
    if ( /(?:\d|\.)(?:\d*\.)?\d*(?:px|rem)\b|#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i.test(d.value)) bad.push(`${d.prop}: ${d.value}`);
  });
  return bad;
}
assert.deepEqual(tokenViolations(arenaCss), [], 'Arena properties must use named size/colour tokens');
const globalPath = path.join(root, 'apps/web/app/globals.css');
const compiled = await postcss([req('@tailwindcss/postcss')({ base: path.join(root, 'apps/web') })])
  .process(fs.readFileSync(globalPath, 'utf8'), { from: globalPath });
const css = compiled.css + '\n' + arenaCss;
const fonts = ['inter', 'fredoka', 'quicksand'].map(n => `@font-face{font-family:${n};src:url(/font/${n});font-weight:300 900}:root{--font-${n}:${n}}`).join('');

function load(file, dependencies) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', code)(id => {
    if (!(id in dependencies)) throw Error('Unexpected component dependency: ' + id);
    return dependencies[id];
  }, mod, mod.exports);
  return mod.exports;
}
const copy = load('apps/web/lib/arena/copy.ts', {});
const base = { react: React, 'react/jsx-runtime': jsx, 'next/link': { default: 'a' }, 'next/navigation': { useRouter: () => ({}) }, '@/lib/arena/copy': copy };
const states = ['hub', 'picker', 'question', 'correct', 'wrong', 'chapters', 'waiting', 'result', 'unavailable'];
function html(grade, theme, state) {
  // Only local state is supplied; no event handlers or network calls are run.
  let call = 0;
  const duelState = [false, '', ['correct', 'wrong'].includes(state) ? { tier: state, xpAwarded: state === 'correct' ? 10 : 0 } : null, 'chair'];
  const react = { ...React, useState: initial => [state === 'picker' ? call++ === 0 : ['correct', 'wrong'].includes(state) ? duelState[call++] : initial, () => {}] };
  const arena = load('apps/web/app/arena/ArenaScreen.tsx', { ...base, react });
  const duel = load('apps/web/app/arena/DuelScreen.tsx', { ...base, react, './ArenaScreen': arena });
  const d = { id: '00000000-0000-4000-8000-000000000112', opponent: grade === 1 ? 'Beispiel 2' : 'Example 2', me: grade === 1 ? 'Beispiel 1' : 'Example 1', avatar: 2, myAvatar: 1, mode: 'vocab', status: 'active', myTurn: true, myScore: 2, theirScore: 2, result: null, date: '2026-10-23T10:00:00Z', xp: 20, rounds: [{ chapter: 1, mine: [true, false, true], theirs: [true, true, false] }], grade, canOpen: ['hub', 'picker', 'chapters'].includes(state), next: null };
  if (['question', 'correct', 'wrong'].includes(state)) Object.assign(d, { myScore: 0, theirScore: 2, xp: 0, rounds: [{ chapter: 1, mine: [], theirs: [true, true, false] }], next: { round: 0, question: 0, prompt: 'der Stuhl', options: ['chair', 'table', 'book', 'bag'] } });
  if (state === 'waiting') Object.assign(d, { myTurn: false, theirScore: 0, rounds: [{ chapter: 1, mine: [true, false, true], theirs: [] }] });
  if (state === 'result') Object.assign(d, { status: 'complete', result: 'win', myScore: 12, theirScore: 8, xp: 120, rounds: Array.from({ length: 5 }, (_, i) => ({ chapter: i + 1, mine: [true, i < 2, true], theirs: [false, true, i % 2 === 0] })) });
  const a = { enabled: state !== 'unavailable', unavailable: state === 'unavailable', rosterVersion: 'synthetic', peers: [{ number: 1, name: d.opponent, avatar: 2 }], active: [d], history: [{ ...d, id: '00000000-0000-4000-8000-000000000113', status: 'complete', result: 'win', myScore: 12, theirScore: 8, xp: 120 }], waiting: 1, stats: { played: 1, won: 1, winRate: 100, xp: 140 } };
  const hub = ['hub', 'picker', 'unavailable'].includes(state);
  const child = React.createElement(hub ? arena.default : duel.default, hub ? { arena: a, grade, preview: false } : { data: { duel: d, chapters: [{ key: 'synthetic-1', chapter: 1 }, { key: 'synthetic-2', chapter: 2 }] }, grade, preview: false, ownerId: 'synthetic' });
  const Shell = load('apps/web/app/home/TrainerShell.tsx', { ...base, react: { ...React, useSyncExternalStore: () => theme } }).default;
  const body = renderToStaticMarkup(React.createElement(Shell, { grade, preview: false, screen: 'arena' }, child));
  return `<!doctype html><html lang="${grade === 1 ? 'de' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${fonts}${css}</style></head><body>${body}</body></html>`;
}

function luminance(rgb) {
  return rgb.map(n => { n /= 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; }).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
}
async function measure(page) {
  const geometry = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const text = [], excluded = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      const e = node.parentElement, cs = getComputedStyle(e), label = node.textContent.trim();
      if (!label || !e.getClientRects().length || cs.visibility === 'hidden' || parseFloat(cs.fontSize) === 0 || e.closest('[aria-hidden="true"]')) continue;
      if (e.closest('.og-wordmark,button:disabled') || !/[\p{L}\p{N}✓×]/u.test(label)) { excluded.push(label); continue; }
      ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = cs.color; ctx.fillRect(0, 0, 1, 1);
      const colour = Array.from(ctx.getImageData(0, 0, 1, 1).data);
      let opacity = colour[3] / 255;
      for (let p = e; p; p = p.parentElement) opacity *= Number(getComputedStyle(p).opacity);
      const range = document.createRange(); range.selectNodeContents(node);
      const rects = [...range.getClientRects()].map(r => ({ x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }));
      const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight) || 400;
      text.push({ label, selector: e.className, colour: colour.slice(0, 3), opacity, rects, minimum: size >= 24 || size >= 18.667 && weight >= 700 ? 3 : 4.5 });
    }
    const controls = [...document.querySelectorAll('.arena-option:not(:disabled),.arena-chapter:not(:disabled),.og-back,.og-primary:not(:disabled),.arena-mini-rounds .arena-block,.arena-block.empty')].map(e => { const r = e.getBoundingClientRect(); const style = getComputedStyle(e); ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = style.borderTopColor; ctx.fillRect(0, 0, 1, 1); const stroke = Array.from(ctx.getImageData(0, 0, 1, 1).data); if (!parseFloat(style.borderTopWidth)) stroke[3] = 0; return { kind: e.matches('.arena-block') ? 'graphic' : 'control', label: e.textContent.trim() || e.getAttribute('aria-label'), x: r.x + r.width / 2, y: r.y, stroke }; });
    return { controls, overflow: document.documentElement.scrollWidth > innerWidth, targets: [...document.querySelectorAll('button,a')].filter(e => e.getClientRects().length).map(e => { const r = e.getBoundingClientRect(); return { label: e.textContent.trim(), width: r.width, height: r.height }; }), text, excluded };
  });
  const hide = await page.addStyleTag({ content: '* { color:transparent!important; -webkit-text-fill-color:transparent!important; text-shadow:none!important; } .og-wordmark { visibility:hidden!important; }' });
  const png = PNG.sync.read(await page.screenshot({ fullPage: true, animations: 'disabled' }));
  await hide.evaluate(e => e.remove());
  const contrast = geometry.text.map(t => {
    let ratio = Infinity, pixels = 0;
    for (const r of t.rects) for (let y = Math.max(0, Math.ceil(r.y)); y < Math.min(png.height, Math.floor(r.y + r.height)); y++) for (let x = Math.max(0, Math.ceil(r.x)); x < Math.min(png.width, Math.floor(r.x + r.width)); x++) {
      const at = (y * png.width + x) * 4, bg = [...png.data.subarray(at, at + 3)];
      const fg = t.colour.map((n, i) => n * t.opacity + bg[i] * (1 - t.opacity));
      const a = luminance(fg), b = luminance(bg);
      ratio = Math.min(ratio, (Math.max(a, b) + .05) / (Math.min(a, b) + .05)); pixels++;
    }
    return { label: t.label, selector: t.selector, ratio: Math.round(ratio * 1000) / 1000, minimum: t.minimum, pass: pixels > 0 && ratio >= t.minimum };
  });
  const { text: _text, ...rest } = geometry;
  const pixel = (x, y) => { const at = (Math.floor(y) * png.width + Math.floor(x)) * 4; return [...png.data.subarray(at, at + 3)]; };
  const controls = geometry.controls.map(c => {
    const outside = pixel(c.x, c.y - 2), inside = pixel(c.x, c.y + 3);
    // Use the resolved border colour, not an anti-aliased fractional pixel.
    // WCAG contrast concerns colour pairs; raster smoothing must not distort it.
    const edge = c.stroke.slice(0, 3).map((n, i) => n * c.stroke[3] / 255 + inside[i] * (1 - c.stroke[3] / 255));
    const pair = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
    const ratio = Math.max(Math.min(pair(edge, outside), pair(edge, inside)), pair(inside, outside));
    return { kind: c.kind, label: c.label, ratio: Math.round(ratio * 1000) / 1000, pass: ratio >= 3 };
  });
  return { ...rest, contrast, controls: controls.filter(c => c.kind === 'control'), graphics: controls.filter(c => c.kind === 'graphic') };
}
function violations(record) {
  return [...(record.overflow ? ['horizontal overflow'] : []), ...record.graphics.filter(c => !c.pass).map(c => `graphic ${c.label}: ${c.ratio}/3`), ...record.controls.filter(c => !c.pass).map(c => `control ${c.label}: ${c.ratio}/3`), ...record.targets.filter(t => t.width < 44 || t.height < 44).map(t => `target ${t.label}: ${t.width}×${t.height}`), ...record.contrast.filter(c => !c.pass).map(c => `contrast ${c.label}: ${c.ratio}/${c.minimum}`)];
}
const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const executablePath = process.env.CHROME_BIN || (fs.existsSync(localChrome) ? localChrome : undefined);
const browser = await chromium.launch({ headless: true, executablePath, args: ['--disable-background-networking'] });
const records = [], mutants = [];
try {
  for (const width of args.includes('--selftest') ? [375] : [375, 1400]) for (const theme of args.includes('--selftest') ? ['light'] : ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, deviceScaleFactor: 1 });
    await context.route('**/*', route => {
      const u = new URL(route.request().url());
      if (u.hostname !== 'arena-fixture.test') return route.abort();
      if (/^\/font\/(inter|fredoka|quicksand)$/.test(u.pathname)) return route.fulfill({ body: fs.readFileSync(path.join(root, 'apps/web/app/fonts', u.pathname.split('/').pop() + '-var-latin.woff2')), contentType: 'font/woff2' });
      if (/^\/avatars\/\d{2}\.png$/.test(u.pathname)) return route.fulfill({ body: fs.readFileSync(path.join(root, 'apps/web/public', u.pathname)), contentType: 'image/png' });
      return route.fulfill({ body: html(Number(u.searchParams.get('grade')), theme, u.searchParams.get('state')), contentType: 'text/html' });
    });
    const page = await context.newPage();
    for (const grade of args.includes('--selftest') ? [1] : [1, 2, 3, 4]) for (const state of args.includes('--selftest') ? ['question'] : states) {
      await page.goto(`http://arena-fixture.test/?grade=${grade}&state=${state}`); await page.evaluate(() => document.fonts.ready);
      const file = `g${grade}-${state}-${width}-${theme}.png`;
      if (['hub', 'question', 'result', 'unavailable'].includes(state)) await page.screenshot({ path: path.join(out, file), animations: 'disabled' });
      const record = { grade, state, width, theme, file, ...await measure(page) };
      record.violations = violations(record); records.push(record);
    }
    if (args.includes('--selftest') && width === 375 && theme === 'light') {
      await page.goto('http://arena-fixture.test/?grade=1&state=question'); await page.evaluate(() => document.fonts.ready);
      for (const [name, rule, expected] of [
        ['small-target', '.og-root[data-screen="arena"] .arena-option { min-width:0; min-height:0; height:20px; padding:0; }', 'target chair'],
        ['pale-border', '.arena-option { border-color:transparent!important; }', 'control chair'],
        ['pale-text', '.arena-prompt { color:#aaa!important; background:#fff!important; }', 'contrast der Stuhl'],
      ]) {
        const style = await page.addStyleTag({ content: rule });
        const failures = violations(await measure(page));
        assert(failures.some(f => f.startsWith(expected)), `Mutation not detected: ${name}`);
        mutants.push({ name, violations: failures }); await style.evaluate(e => e.remove());
      }
      await page.goto('http://arena-fixture.test/?grade=3&state=hub'); await page.evaluate(() => document.fonts.ready);
      const style = await page.addStyleTag({ content: '.arena-mini-rounds .arena-block { background:var(--card)!important; border-color:transparent!important; }' });
      const failures = violations(await measure(page));
      assert(failures.some(f => f.startsWith('graphic ')), 'Invisible round markers not detected');
      mutants.push({ name: 'invisible-rounds', violations: failures }); await style.evaluate(e => e.remove());
      for (const value of ['padding:19px', 'color:#aaa', 'color:rgb(1,2,3)', 'color:hsl(120,50%,50%)', '--local-size:19px; padding:var(--local-size)']) {
        assert(tokenViolations(arenaCss + `\n.arena-prompt { ${value}; }`).length > 0, `Raw token value not detected: ${value}`);
        mutants.push({ name: 'raw-value', violations: [value] });
      }
    }
    await context.close();
  }
} finally { await browser.close(); }
const failures = records.filter(r => r.violations.length);
fs.writeFileSync(path.join(out, 'measurements.json'), JSON.stringify({ records, mutants }, null, 2) + '\n');
console.log(JSON.stringify({ views: records.length, images: records.filter(r => ['hub', 'question', 'result', 'unavailable'].includes(r.state)).length, failedViews: failures.length, detectedMutants: mutants.length, out }));
if (failures.length) { console.error(JSON.stringify(failures.map(({ file, violations }) => ({ file, violations })), null, 2)); process.exitCode = 1; }
