import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
/** Bundles the actual client and shell for isolated browser tests. Network is
 * supplied by the caller; never starts Next or reads an account/database. */
export async function liveFixture(root) {
  const req = createRequire(path.join(root, 'apps/web/package.json'));
  const postcss = createRequire(req.resolve('@tailwindcss/postcss'))('postcss');
  const globalPath = path.join(root, 'apps/web/app/globals.css');
  const compiled = await postcss([req('@tailwindcss/postcss')({ base: path.join(root, 'apps/web') })]).process(fs.readFileSync(globalPath, 'utf8'), { from: globalPath });
  const css = compiled.css + fs.readFileSync(path.join(root, 'apps/web/app/arena/arena.css'), 'utf8') + fs.readFileSync(path.join(root, 'apps/web/app/arena/live.css'), 'utf8');
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';import Shell from '@/app/home/TrainerShell';import Screen from '@/app/arena/LiveScreen';import {chooseTrainerTheme} from '@/lib/trainer/preferences';const props=window.__fixtureProps;chooseTrainerTheme(props.grade,window.__fixtureTheme);createRoot(document.getElementById('root')).render(<Shell grade={props.grade} preview={props.preview} screen="arena"><Screen {...props}/></Shell>);`;
  const bundled = await build({ stdin: { contents: entry, resolveDir: path.join(root, 'apps/web'), loader: 'tsx' }, bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'isolated-framework', setup(b) {
    b.onResolve({ filter: /^next\/link$/ }, () => ({ path: 'link', namespace: 'fixture' }));
    b.onLoad({ filter: /^link$/, namespace: 'fixture' }, () => ({ contents: 'export default "a";' }));
    b.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: 'nav', namespace: 'fixture' }));
    b.onLoad({ filter: /^nav$/, namespace: 'fixture' }, () => ({ contents: 'export const useRouter=()=>({push:href=>{window.__destination=href;window.location.href=href;}});' }));
    b.onResolve({ filter: /^@\// }, a => { const base = path.join(root, 'apps/web', a.path.slice(2)); return { path: ['.ts', '.tsx', ''].map(ext => base + ext).find(f => fs.existsSync(f)) }; });
  } }] });
  const script = bundled.outputFiles[0].text;
  const fonts = ['inter', 'fredoka', 'quicksand'].map(n => `@font-face{font-family:${n};src:url(/font/${n});font-weight:300 900}:root{--font-${n}:${n}}`).join('');
  return { script, html: (props, theme='light') => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${fonts}${css}</style></head><body><div id="root"></div><script>window.__fixtureProps=${JSON.stringify(props)};window.__fixtureTheme=${JSON.stringify(theme)};</script><script src="/fixture.js"></script></body></html>` };
}
