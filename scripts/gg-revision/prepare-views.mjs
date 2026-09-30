// CODEX DRAFT — NOT CANON. No Next route, product file, DB or release changes.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { pilotData } from './pilot-data.mjs';
import { PilotView } from './PilotView.tsx';
import { PAINT_OVERLAY_CSS } from '../../packages/game-paint/src/cards/overlay-css.ts';
import { ROOT, outside, paintArt, rendererFingerprint } from './census.mjs';
import { sha256, digest, solverHtmlErrors } from './core.mjs';
const req = createRequire(path.join(ROOT, 'node_modules/.pnpm/node_modules/esbuild/package.json'));
const esbuild = req('./lib/main.js');
const postcss = req(path.join(ROOT, 'node_modules/.pnpm/node_modules/postcss'));
const tailwind = createRequire(path.join(ROOT, 'apps/web/package.json'))('@tailwindcss/postcss');
const out = outside(process.argv[2] ?? '');
if (!process.argv[2]) throw new Error('External output directory required');
fs.mkdirSync(out,{recursive:true});
const entries=pilotData(), art=Object.fromEntries([...new Set(entries.filter(e=>e.kind==='paint').map(e=>e.chapter))].map(ch=>[ch,paintArt(ch)]));
const cssPath=path.join(ROOT,'apps/web/app/globals.css');
const compiled=await postcss([tailwind({base:ROOT})]).process(fs.readFileSync(cssPath,'utf8'),{from:cssPath});
const fonts=`@font-face{font-family:Inter;src:url('/fonts/inter-var-latin.woff2')}@font-face{font-family:Fredoka;src:url('/fonts/fredoka-var-latin.woff2')}@font-face{font-family:Quicksand;src:url('/fonts/quicksand-var-latin.woff2')}:root{--font-body:Inter,sans-serif;--font-display:Fredoka,sans-serif;--font-label:Quicksand,sans-serif}body{margin:0}`;
const css=compiled.css+'\n'+PAINT_OVERLAY_CSS+'\n'+fonts;
fs.writeFileSync(path.join(out,'style.css'),css);
fs.writeFileSync(path.join(out,'private-data.json'),JSON.stringify({entries,art}));
await esbuild.build({entryPoints:[path.join(ROOT,'scripts/gg-revision/browser.tsx')],bundle:true,format:'esm',platform:'browser',jsx:'automatic',outfile:path.join(out,'browser.js'),nodePaths:[path.join(ROOT,'apps/web/node_modules'),path.join(ROOT,'node_modules/.pnpm/node_modules')],logLevel:'warning'});
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const shell=(body,script='')=>`<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CODEX DRAFT — NOT CANON · Revision W0</title><link rel="stylesheet" href="/style.css"><body>${body}${script}</body></html>`;
fs.writeFileSync(path.join(out,'index.html'),shell('<div id="root"></div>','<script type="module" src="/browser.js"></script>'));
const solver=path.join(out,'solver');fs.mkdirSync(solver,{recursive:true});
fs.writeFileSync(path.join(solver,'style.css'),css.replaceAll("url('/fonts/","url('fonts/"));
const manifest=[],renderer=rendererFingerprint(),assets=new Map();
for(const entry of entries){
  const html=renderToStaticMarkup(createElement(PilotView,{entry,art:art[entry.chapter]}));
  const errors=solverHtmlErrors(html);if(errors.length)throw new Error(`${entry.itemId}: ${errors}`);
  let body=html;
  for(const match of html.matchAll(/(?:src|href)="(\/art\/[^"?]+)(?:\?[^\"]*)?"/g)){
    const url=match[1],source=path.join(ROOT,'apps/web/public',url),relative=url.slice(1);
    const bytes=fs.readFileSync(source);assets.set(relative,sha256(bytes));
    fs.mkdirSync(path.dirname(path.join(solver,relative)),{recursive:true});fs.writeFileSync(path.join(solver,relative),bytes);
    body=body.replaceAll(match[0],match[0].replace(/"\/art\//,'"art/'));
  }
  const name=entry.itemId+'.html';const page=shell(body).replace('href="/style.css"','href="style.css"');
  fs.writeFileSync(path.join(solver,name),page);
  manifest.push({itemId:entry.itemId,unit:entry.unit,kind:entry.kind,pool:entry.pool??null,file:name,htmlSha256:sha256(page),componentHtmlSha256:sha256(html),contentSha256:digest(entry.item),contextSha256:digest(entry.context),pairSha256:digest(entry.pair??null)});
}
for(const name of ['inter-var-latin.woff2','fredoka-var-latin.woff2','quicksand-var-latin.woff2']){
 const bytes=fs.readFileSync(path.join(ROOT,'apps/web/app/fonts',name));const file='fonts/'+name;
 assets.set(file,sha256(bytes));fs.mkdirSync(path.join(solver,'fonts'),{recursive:true});fs.writeFileSync(path.join(solver,file),bytes);
}
// Solver manifest deliberately contains no keyed content or answer hashes.
const publicManifest={label:'CODEX DRAFT — NOT CANON',schema:'revision-solver-packet@1',basis:'df258ae8952cf5e5747e7507759d4d7b61e094b5',cssSha256:sha256(fs.readFileSync(path.join(solver,'style.css'))),rendererSha256:digest(renderer),views:manifest.map(({itemId,unit,kind,pool,file,htmlSha256})=>({itemId,unit,kind,pool,file,htmlSha256})),states:[],assets:[...assets].map(([file,sha256])=>({file,sha256}))};
fs.writeFileSync(path.join(solver,'manifest.json'),JSON.stringify(publicManifest,null,2)+'\n');
fs.writeFileSync(path.join(solver,'index.html'),shell('<main style="max-width:720px;margin:32px auto;padding:16px"><p>CODEX DRAFT — NOT CANON</p><h1>Zwei kleine Kalibriersätze</h1><p>Originale Aufgabenansichten. Die Prüftasten sind in diesen eingefrorenen Ansichten ohne Funktion. Antworten bitte getrennt notieren; auch weitere plausible Antworten nennen.</p>'+manifest.map((m,i)=>`<p><a href="${escape(m.file)}">${i+1}. ${m.unit} · ${m.kind}${m.pool?' · '+m.pool:''}</a></p>`).join('')+'</main>').replace('href="/style.css"','href="style.css"'));
fs.writeFileSync(path.join(out,'private-view-manifest.json'),JSON.stringify({manifest,renderer,solverPacketSha256:digest(publicManifest)},null,2)+'\n');
console.log(JSON.stringify({cases:entries.length,solverPacketSha256:digest(publicManifest),assets:assets.size,out}));
