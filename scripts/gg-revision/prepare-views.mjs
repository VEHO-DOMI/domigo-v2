// CODEX DRAFT — NOT CANON. Real renderers; only neutral identifiers reach solvers.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { pilotData, selection } from './pilot-data.mjs';
import { PilotView } from './PilotView.tsx';
import { PAINT_OVERLAY_CSS } from '../../packages/game-paint/src/cards/overlay-css.ts';
import { ROOT, outside, paintArt, rendererFingerprint } from './census.mjs';
import { sha256, digest, solverHtmlErrors } from './core.mjs';
import { publicId, pageShell, neutralizeAssets, finalizePacket } from './solver-packet.mjs';
const req = createRequire(path.join(ROOT, 'node_modules/.pnpm/node_modules/esbuild/package.json'));
const esbuild = req('./lib/main.js');
const postcss = req(path.join(ROOT, 'node_modules/.pnpm/node_modules/postcss'));
const tailwind = createRequire(path.join(ROOT, 'apps/web/package.json'))('@tailwindcss/postcss');
if (!process.argv[2]) throw new Error('External output directory required');
const out = outside(process.argv[2]);
if (process.argv[3]) throw new Error('Fresh transition observation required; state reuse is no longer accepted');
// Refuse stale files: an old speaking filename must never survive a new export.
if (fs.existsSync(path.join(out,'solver'))) throw new Error('Use a fresh export directory');
fs.mkdirSync(out,{recursive:true});
const entries=pilotData(), art=Object.fromEntries([...new Set(entries.filter(e=>e.kind==='paint').map(e=>e.chapter))].map(ch=>[ch,paintArt(ch)]));
const cssPath=path.join(ROOT,'apps/web/app/globals.css');
const compiled=await postcss([tailwind({base:ROOT})]).process(fs.readFileSync(cssPath,'utf8'),{from:cssPath});
const fonts=`@font-face{font-family:Inter;src:url('/fonts/inter-var-latin.woff2')}@font-face{font-family:Fredoka;src:url('/fonts/fredoka-var-latin.woff2')}@font-face{font-family:Quicksand;src:url('/fonts/quicksand-var-latin.woff2')}:root{--font-body:Inter,sans-serif;--font-display:Fredoka,sans-serif;--font-label:Quicksand,sans-serif}body{margin:0}`;
const css=compiled.css+'\n'+PAINT_OVERLAY_CSS+'\n'+fonts;
fs.writeFileSync(path.join(out,'style.css'),css);
fs.writeFileSync(path.join(out,'private-data.json'),JSON.stringify({entries,art}));
await esbuild.build({entryPoints:[path.join(ROOT,'scripts/gg-revision/browser.tsx')],bundle:true,format:'esm',platform:'browser',jsx:'automatic',outfile:path.join(out,'browser.js'),nodePaths:[path.join(ROOT,'apps/web/node_modules'),path.join(ROOT,'node_modules/.pnpm/node_modules')],logLevel:'warning'});
fs.writeFileSync(path.join(out,'index.html'),pageShell('<div id="root"></div><script type="module" src="/browser.js"></script>'));
const solver=path.join(out,'solver');fs.mkdirSync(path.join(solver,'assets'),{recursive:true});
const views=[],privateViews=[],renderer=rendererFingerprint(),assets=[];
function asset(sourceUrl, source) {
  if (assets.some(a=>a.sourceUrl===sourceUrl)) return;
  const bytes=fs.readFileSync(source),file=`assets/a${String(assets.length+1).padStart(3,'0')}${path.extname(source)}`;
  assets.push({file,sourceUrl,sha256:sha256(bytes)});fs.writeFileSync(path.join(solver,file),bytes);
}
for(const [i,entry] of entries.entries()){
  const html=renderToStaticMarkup(createElement(PilotView,{entry,art:art[entry.chapter]}));
  assert.deepEqual(solverHtmlErrors(html),[]);
  for(const match of html.matchAll(/(?:src|href)="(\/art\/[^"?]+)(?:\?[^\"]*)?"/g)) asset(match[1],path.join(ROOT,'apps/web/public',match[1]));
  const file=publicId(i)+'.html',page=pageShell(neutralizeAssets(html,assets));
  fs.writeFileSync(path.join(solver,file),page);
  views.push({publicId:publicId(i),unit:entry.unit,kind:entry.kind,pool:entry.pool??null,file,htmlSha256:sha256(page)});
  privateViews.push({itemId:entry.itemId,publicId:publicId(i),componentHtmlSha256:sha256(html),contentSha256:digest(entry.item),contextSha256:digest(entry.context),pairSha256:digest(entry.pair??null)});
}
for(const name of ['inter-var-latin.woff2','fredoka-var-latin.woff2','quicksand-var-latin.woff2']) asset('/fonts/'+name,path.join(ROOT,'apps/web/app/fonts',name));
for(const match of css.matchAll(/url\(['"]?(\/art\/[^)'"\s]+)['"]?\)/g)) asset(match[1],path.join(ROOT,'apps/web/public',match[1]));
let publicCss=css;for(const a of assets)publicCss=publicCss.replaceAll(a.sourceUrl,a.file);
fs.writeFileSync(path.join(solver,'style.css'),publicCss);
const manifest={label:'CODEX DRAFT — NOT CANON',schema:'revision-solver-packet@2',basis:selection.basis,cssSha256:sha256(publicCss),indexSha256:'',rendererSha256:digest(renderer),views,states:[],assets:assets.map(({file,sha256})=>({file,sha256}))};
fs.writeFileSync(path.join(solver,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(out,'private-asset-map.json'),JSON.stringify(assets,null,2)+'\n');
const packet=finalizePacket(out,entries,assets),reuseReceipt=null;
fs.writeFileSync(path.join(out,'private-view-manifest.json'),JSON.stringify({manifest:privateViews,renderer,solverPacketSha256:digest(packet.manifest),privateMappingSha256:digest(packet.mapping),reuseReceipt},null,2)+'\n');
console.log(JSON.stringify({cases:entries.length,solverPacketSha256:digest(packet.manifest),privateMappingSha256:digest(packet.mapping),states:packet.manifest.states.length,assets:assets.length,out}));
