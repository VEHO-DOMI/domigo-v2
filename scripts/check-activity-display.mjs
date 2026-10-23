#!/usr/bin/env node
/** cgo-113: actual interactive React Activity with synthetic props. No server,
 * session or database. Captures real user transitions and checks rendered text,
 * borders, tap sizes, overflow and named design values. Not an authentication,
 * native checkbox rendering or formal screen-reader conformance audit.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), selftest = args.includes('--selftest'), smoke = args.includes('--smoke');
const index = args.indexOf('--out');
assert(index < 0 || args[index + 1], '--out requires a path');
const out = index < 0 ? fs.mkdtempSync(path.join(os.tmpdir(), 'activity-display-')) : path.resolve(args[index + 1]);
assert(out !== root && !out.startsWith(root + path.sep), 'Evidence must stay outside the repository');fs.mkdirSync(out, { recursive: true });
const req = createRequire(path.join(root, 'apps/web/package.json'));
const postcss = createRequire(req.resolve('@tailwindcss/postcss'))('postcss');
const sourceCss = fs.readFileSync(path.join(root, 'apps/web/app/activity/activity.css'), 'utf8');
const globalPath = path.join(root, 'apps/web/app/globals.css');
const compiled = await postcss([req('@tailwindcss/postcss')({ base: path.join(root, 'apps/web') })]).process(fs.readFileSync(globalPath, 'utf8'), { from: globalPath });
const css = compiled.css + '\n' + sourceCss;
const fonts = ['inter', 'fredoka', 'quicksand'].map(n => `@font-face{font-family:${n};src:url(/font/${n});font-weight:300 900}:root{--font-${n}:${n}}`).join('');
const entry = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import ActivityScreen from './app/activity/ActivityScreen';
import TrainerShell from './app/home/TrainerShell';
const q = new URLSearchParams(location.search), grade = Number(q.get('grade'));
const words = ['chair','book','run','read','table','bag','jump','write','door','pen','sing','eat'].map((word,i)=>({id:'synthetic-'+i,chapter:Math.floor(i/4)+1,word,german:'Beispielwort '+(i+1),mode:['draw','show','explain'][i%3]}));
createRoot(document.getElementById('root')).render(<TrainerShell grade={grade} preview={q.has('preview')} screen="activity" wordmark={false}><ActivityScreen grade={grade} preview={q.has('preview')} words={q.has('empty')?[]:words} unavailable={q.has('unavailable')}/></TrainerShell>);
`;
const bundled = await build({ stdin: { contents: entry, resolveDir: path.join(root, 'apps/web'), loader: 'tsx' }, bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'isolated-links', setup(b) {
  b.onResolve({ filter: /^next\/link$/ }, () => ({ path: 'link', namespace: 'fixture' }));
  b.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `import React from 'react';export default function Link({href,...props}){return React.createElement('a',{href,...props});}`, resolveDir: path.join(root, 'apps/web'), loader: 'js' }));
  b.onResolve({ filter: /^@\// }, a => { const base = path.join(root, 'apps/web', a.path.slice(2));return { path: ['.ts','.tsx',''].map(ext=>base+ext).find(f=>fs.existsSync(f)) }; });
}}] });
const bundle = bundled.outputFiles[0].text;
async function tokenViolations(text, page) {
  const bad = [], identifiers = [];
  postcss.parse(text).walkDecls(d => {
    if (d.prop.startsWith('--')) {
      if (d.parent.type !== 'rule' || d.parent.selector !== '.og-root[data-screen="activity"][data-grade]' || !/^(--activity-[a-z-]+|--muted)$/.test(d.prop)) bad.push('local token: ' + d.prop);
      return;
    }
    if (/(?:\d|\.)(?:\d*\.)?\d*(?:px|rem)\b|#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i.test(d.value)) bad.push(d.prop + ': ' + d.value);
    // Ask the browser whether a bare identifier is a colour. This includes CSS
    // names such as rebeccapurple, without maintaining a second colour registry.
    for (const word of d.value.replace(/var\([^)]*\)/g, '').match(/[a-z]+/gi) ?? []) identifiers.push({ prop: d.prop, word });
  });
  const colours = await page.evaluate(ids => ids.filter(({word}) => !/^(transparent|currentcolor|inherit|initial|unset|revert|layer)$/i.test(word) && CSS.supports('color',word)), identifiers);
  return [...bad, ...colours.map(({prop,word}) => prop + ': ' + word)];
}
function luminance(rgb) {
  return rgb.map(n => { n /= 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; }).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
}
async function measure(page) {
  const geometry = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const text = [], excluded = [];
    const modal = document.querySelector('dialog[open]');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      const e = node.parentElement, cs = getComputedStyle(e), label = node.textContent.trim();
      if ((modal && !modal.contains(e)) || !label || !e.getClientRects().length || cs.visibility === 'hidden' || parseFloat(cs.fontSize) === 0 || e.closest('[aria-hidden="true"],.activity-sr')) continue;
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
    const controls = [...document.querySelectorAll('.activity-button:not(:disabled),.activity-group input')].filter(e => !modal || modal.contains(e)).map(e => { const r = e.getBoundingClientRect(); const style = getComputedStyle(e); ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = style.borderTopColor; ctx.fillRect(0, 0, 1, 1); const stroke = Array.from(ctx.getImageData(0, 0, 1, 1).data); if (!parseFloat(style.borderTopWidth)) stroke[3] = 0; return { kind: e.matches('.arena-block') ? 'graphic' : 'control', label: e.textContent.trim() || e.getAttribute('aria-label'), x: r.x + r.width / 2, y: r.y, stroke }; });
    return { controls, overflow: document.documentElement.scrollWidth > innerWidth, targets: [...document.querySelectorAll('button,a,input')].filter(e => e.getClientRects().length && (!modal || modal.contains(e))).map(e => { const r = e.getBoundingClientRect(); return { label: e.textContent.trim(), width: r.width, height: r.height }; }), text, excluded };
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
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN || (fs.existsSync(localChrome) ? localChrome : undefined), args: ['--disable-background-networking'] });
const records = [], mutants = [], network = [], errors = [];
const labels = grade => grade === 1 ? { start: 'Spiel starten', round: 'Runde starten →', correct: '✓ Richtig', skip: 'Weiter →', undo: '↶ Letztes Wort zurück', backRound: '↶ Runde zurücknehmen', next: 'Nächste Gruppe →', end: 'Spiel beenden', confirm: 'Bestätigen' } : { start: 'Start game', round: 'Start round →', correct: '✓ Correct', skip: 'Skip →', undo: '↶ Undo last', backRound: '↶ Undo round', next: 'Next turn →', end: 'End game', confirm: 'Confirm' };
try {
  for (const width of selftest || smoke ? [375] : [375,1400]) for (const theme of selftest ? ['light'] : smoke ? ['dark'] : ['light','dark']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, deviceScaleFactor: 1 });
    await context.addInitScript(() => {
      window.activityIO = [];
      for (const method of ['setItem','getItem','removeItem','clear']) Storage.prototype[method] = function(){ window.activityIO.push('storage:'+method);throw Error('Activity storage forbidden'); };
      window.fetch = async () => { window.activityIO.push('fetch');throw Error('Activity fetch forbidden'); };
      Math.random = () => .314159;
    });
    await context.route('**/*', route => {
      const u = new URL(route.request().url());
      if (u.hostname !== 'activity-fixture.test') { network.push(route.request().url());return route.abort(); }
      if (/^\/font\/(inter|fredoka|quicksand)$/.test(u.pathname)) return route.fulfill({body:fs.readFileSync(path.join(root,'apps/web/app/fonts',u.pathname.split('/').pop()+'-var-latin.woff2')),contentType:'font/woff2'});
      if (u.pathname === '/app.js') return route.fulfill({body:bundle,contentType:'application/javascript'});
      return route.fulfill({body:`<!doctype html><html lang="${u.searchParams.get('grade')==='1'?'de':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${fonts}${css}</style></head><body><div id="root"></div><script src="/app.js"></script></body></html>`,contentType:'text/html'});
    });
    const page = await context.newPage();page.on('pageerror', e=>errors.push(e.message));page.on('dialog', d=>d.accept());
    await page.clock.install();await page.clock.pauseAt(new Date());
    const click = name => page.getByRole('button',{name,exact:true}).click();
    async function open(grade, flags='') {
      await page.goto(`http://activity-fixture.test/?grade=${grade}${flags}`);
      await page.locator('.activity-screen').waitFor();await page.evaluate(()=>document.fonts.ready);
      const actual = await page.locator('.og-root').getAttribute('data-theme');
      if (actual !== 'system' && actual !== theme) await page.locator('.og-footer button').click();
    }
    async function capture(grade,state) {
      const file=`g${grade}-${state}-${width}-${theme}.png`;
      await page.screenshot({path:path.join(out,file),fullPage:true,animations:'disabled'});
      const record={grade,state,width,theme,file,...await measure(page)};record.violations=violations(record);records.push(record);
      assert.deepEqual(await page.evaluate(()=>window.activityIO),[],'No device storage or application request');
    }
    for (const grade of selftest ? [1] : smoke ? [4] : [1,2,3,4]) {
      const t=labels(grade);await open(grade);assert.deepEqual(await tokenViolations(sourceCss,page),[],'Named Activity design values');
      if (!selftest) await capture(grade,'setup');
      await click(t.start);if (!selftest) await capture(grade,'ready');
      await click(t.round);await capture(grade,'play');
      if (selftest) {
        for(const [name,css,expected] of [
          ['small-target','.activity-play-actions button {min-height:0;height:20px;padding:0}', 'target'],
          ['pale-text','.activity-word h2 {color:#aaa;background:#fff}', 'contrast'],
          ['pale-border','.activity-button:not(.activity-primary) {border-color:transparent!important}', 'control'],
        ]) { const node=await page.addStyleTag({content:css});const failures=violations(await measure(page));assert(failures.some(f=>f.startsWith(expected)),name+' must fail');mutants.push({name,failures});await node.evaluate(e=>e.remove()); }
        for(const value of ['padding:19px','color:#aaa','color:rgb(1,2,3)','color:hsl(0,50%,50%)','color:rebeccapurple','border-color:red','--local-size:19px;padding:var(--local-size)']) {
          const failures=await tokenViolations(sourceCss+`\n.activity-word {${value}}`,page);assert(failures.length>0,value+' must fail');mutants.push({name:'raw-value',failures});
        }
      } else {
        await click(t.correct);await page.clock.fastForward(61000);await capture(grade,'summary');await click(t.next);await click(t.end);await capture(grade,'confirm');await click(t.confirm);await capture(grade,'final');
        await open(grade,'&unavailable');await capture(grade,'unavailable');await open(grade,'&empty');await capture(grade,'empty');
      }
    }
    // Actual event handlers, complete 2-group/3-round game, timer and undo.
    if (width===375 && (theme==='light' || smoke)) {
      await open(2,'&preview');const t=labels(2);await click('⏱ 30 s');await page.getByRole('button',{name:'3 Rounds per group',exact:true}).click();
      await page.locator('#activity-group-0').fill('Example A');await page.locator('#activity-group-1').fill('Example B');await click(t.start);await click(t.round);
      const first=await page.locator('.activity-word h2').textContent();await click(t.correct);await click(t.undo);assert.equal(await page.locator('.activity-word h2').textContent(),first);
      await click(t.skip);await page.clock.fastForward(31000);await click(t.backRound);assert.deepEqual(await page.locator('.activity-scoreboard li strong').allTextContents(),['0','0']);
      for(let turn=0;turn<6;turn++){await click(t.round);await click(t.correct);await page.clock.fastForward(31000);await click(t.next);}
      assert.equal(await page.locator('.activity-screen').getAttribute('data-phase'),'final');assert.deepEqual(await page.locator('.activity-final li > strong').allTextContents(),['3','3']);
      assert.equal(await page.getByText('Tie',{exact:true}).count(),2);assert.deepEqual(await page.evaluate(()=>window.activityIO),[]);
      // Reloaded game contains no team names or results, even in preview.
      await open(2,'&preview');assert.equal(await page.locator('.activity-screen').getAttribute('data-phase'),'setup');assert.equal(await page.locator('#activity-group-0').inputValue(),'');
    }
    await context.close();
  }
} finally { await browser.close(); }
const failures=records.filter(r=>r.violations.length);
fs.writeFileSync(path.join(out,'measurements.json'),JSON.stringify({records,mutants,network,errors},null,2)+'\n');
console.log(JSON.stringify({views:records.length,failedViews:failures.length,mutants:mutants.length,network:network.length,errors,out}));
assert.deepEqual(network,[]);assert.deepEqual(errors,[]);
if(failures.length){console.error(JSON.stringify(failures.map(({file,violations})=>({file,violations})),null,2));process.exitCode=1;}
