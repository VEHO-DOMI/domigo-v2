// CODEX DRAFT — NOT CANON. Public neutral names; private, exactly bound identities.
import fs from 'node:fs';
import path from 'node:path';
import { digest, sha256, compareIds, solverHtmlErrors } from './core.mjs';

export const publicId = index => `p${String(index + 1).padStart(3, '0')}`;
export const pageShell = body => `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CODEX DRAFT — NOT CANON · Revision W0</title><link rel="stylesheet" href="style.css"><body>${body}</body></html>`;
export function expectedMapping(entries) {
  return entries.map((e, i) => ({ publicId: publicId(i), itemId: e.itemId,
    contentSha256: digest(e.item), contextSha256: digest(e.context),
    pairSha256: digest(e.pair ?? null), pool: e.pool ?? null }));
}
export function expectedStates(entries) {
  return entries.flatMap((e, i) => e.kind === 'paint' && e.item.kind === 'restore'
    ? [{ publicId: publicId(i), stateId: 's01', itemId: e.itemId, state: 'colour' }] : []);
}
export function mappingFor(manifest, entries, assets) {
  return { label: 'CODEX DRAFT — NOT CANON', schema: 'revision-private-mapping@1',
    packetSha256: digest(manifest), entries: expectedMapping(entries),
    states: expectedStates(entries), assets };
}
export function neutralizeAssets(html, assets) {
  return html.replace(/\b(src|href)="([^\"]+)"/g, (whole, attr, url) => {
    const clean = url.split('?')[0].replace(/^\.\.\//, '/').replace(/^(art|fonts)\//, '/$1/');
    const asset = assets.find(a => a.sourceUrl === clean);
    return asset ? `${attr}="${asset.file}"` : whole;
  });
}
export function packetIndex(manifest) {
  return pageShell('<main style="max-width:720px;margin:32px auto;padding:16px"><p>CODEX DRAFT — NOT CANON</p><h1>Zwei kleine Kalibriersätze</h1><p>Eingefrorene Aufgabenansichten. Prüftasten sind ohne Funktion. Antworten getrennt unter der neutralen Aufgabennummer notieren; auch weitere plausible Antworten nennen.</p>'
    + manifest.views.map(v => `<p><a href="${v.file}">${v.publicId} · ${v.unit} · ${v.kind}${v.pool ? ' · ' + v.pool : ''}</a></p>`).join('')
    + manifest.states.map(s => `<p><a href="${s.file}">${s.publicId} · ${s.stateId} · zweiter Schritt, nach dem ersten bearbeiten</a></p>`).join('') + '</main>');
}
export function finalizePacket(out, entries, assets) {
  const solver = path.join(out, 'solver'), file = path.join(solver, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  const index = packetIndex(manifest);
  manifest.indexSha256 = sha256(index);
  fs.writeFileSync(path.join(solver, 'index.html'), index);
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
  const mapping = mappingFor(manifest, entries, assets);
  fs.writeFileSync(path.join(out, 'private-mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
  return { manifest, mapping };
}
export function saveColourState(out, itemId, html, entries, assets) {
  const expected = expectedStates(entries).find(s => s.itemId === itemId);
  if (!expected) throw new Error('Unexpected state item');
  const errors = solverHtmlErrors(html); if (errors.length) throw new Error(errors.join(';'));
  const solver = path.join(out, 'solver'), file = `${expected.publicId}-${expected.stateId}.html`;
  const frozen = pageShell(neutralizeAssets(html, assets));
  fs.writeFileSync(path.join(solver, file), frozen);
  const manifestFile = path.join(solver, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  manifest.states = [...manifest.states.filter(s => s.publicId !== expected.publicId),
    { publicId: expected.publicId, stateId: expected.stateId, file, htmlSha256: sha256(frozen) }];
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  return finalizePacket(out, entries, assets);
}

const same = (a, b) => digest(a) === digest(b);
const fields = (value, allowed) => value && typeof value === 'object'
  && same(Object.keys(value).sort(), [...allowed].sort());
const decodeAttribute = value => value.replace(/&#(x[0-9a-f]+|\d+);|&(amp|quot|apos|lt|gt);/gi,
  (_, number, named) => number ? String.fromCodePoint(number[0].toLowerCase() === 'x' ? parseInt(number.slice(1),16) : Number(number))
    : ({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>'})[named.toLowerCase()]);
const attributes = html => [...html.matchAll(/\b([\w:-]+)\s*=\s*(?:"([^\"]*)"|'([^']*)'|([^\s>]+))/g)]
  .map(m => ({ name:m[1].toLowerCase(), value:decodeAttribute(m[2] ?? m[3] ?? m[4]) }));
const walk = (root, prefix = '') => fs.readdirSync(path.join(root, prefix), { withFileTypes: true }).flatMap(e => {
  const file = path.posix.join(prefix, e.name);
  if (e.isSymbolicLink()) throw new Error('SOLVER:SYMLINK ' + file);
  return e.isDirectory() ? walk(root, file) : [file];
});

/** Checks the whole public directory AND the exact private mapping against current items. */
export function packetErrors(solver, manifest, mapping, entries, rendererSha256 = manifest.rendererSha256) {
  const errors = [], fail = code => errors.push(code);
  const expected = expectedMapping(entries), states = expectedStates(entries);
  if (manifest.schema !== 'revision-solver-packet@2') fail('PACKET:SCHEMA');
  if (!fields(manifest, ['label','schema','basis','cssSha256','indexSha256','rendererSha256','views','states','assets'])) fail('PACKET:PUBLIC_FIELDS');
  if (!fields(mapping, ['label','schema','packetSha256','entries','states','assets']) || mapping.schema !== 'revision-private-mapping@1') fail('MAP:SCHEMA');
  if (mapping.packetSha256 !== digest(manifest)) fail('MAP:STALE_PACKET');
  if (!same(mapping.entries, expected)) fail('MAP:IDENTITY_OR_CONTENT');
  if (!same(mapping.states, states)) fail('MAP:STATE_IDENTITY');
  if (manifest.rendererSha256 !== rendererSha256) fail('PACKET:STALE_RENDERER');
  errors.push(...compareIds(expected.map(e => e.publicId), manifest.views.map(v => v.publicId)).map(e => 'PACKET:' + e));
  errors.push(...compareIds(states.map(s => `${s.publicId}-${s.stateId}`), manifest.states.map(s => `${s.publicId}-${s.stateId}`)).map(e => 'STATES:' + e));
  for (const [i, e] of entries.entries()) {
    const v = manifest.views.find(v => v.publicId === publicId(i));
    if (!v || !fields(v, ['publicId','unit','kind','pool','file','htmlSha256'])
      || v.unit !== e.unit || v.kind !== e.kind || v.pool !== (e.pool ?? null)
      || v.file !== `${publicId(i)}.html`) fail('PACKET:VIEW_METADATA');
  }
  for (const s of manifest.states) if (!fields(s, ['publicId','stateId','file','htmlSha256'])
    || s.file !== `${s.publicId}-${s.stateId}.html`) fail('PACKET:STATE_METADATA');
  for (const a of manifest.assets) if (!fields(a, ['file','sha256'])
    || !/^assets\/a\d{3}\.(png|woff2)$/.test(a.file)) fail('PACKET:ASSET_NAME');
  if (!same(manifest.assets, mapping.assets.map(({ file, sha256 }) => ({ file, sha256 })))) fail('MAP:ASSETS');
  const expectedFiles = ['index.html','manifest.json','style.css', ...manifest.views.map(v => v.file),
    ...manifest.states.map(s => s.file), ...manifest.assets.map(a => a.file)];
  let files;
  try { files = walk(solver); } catch (e) { return [...errors, e.message]; }
  errors.push(...compareIds(expectedFiles, files).map(e => 'FILES:' + e));
  for (const file of files) if (!/^(?:index\.html|manifest\.json|style\.css|p\d{3}(?:-s\d{2})?\.html|assets\/a\d{3}\.(?:png|woff2))$/.test(file)) fail('FILES:SPEAKING_OR_UNEXPECTED_NAME');
  const hashed = [{ file: 'index.html', sha256: manifest.indexSha256 }, { file: 'style.css', sha256: manifest.cssSha256 },
    ...manifest.views.map(v => ({ file: v.file, sha256: v.htmlSha256 })),
    ...manifest.states.map(s => ({ file: s.file, sha256: s.htmlSha256 })), ...manifest.assets];
  for (const record of hashed) {
    if (!files.includes(record.file)) continue;
    if (sha256(fs.readFileSync(path.join(solver, record.file))) !== record.sha256) fail('FILES:HASH ' + record.file);
  }
  const forbidden = entries.map(e => e.itemId);
  const sourcePaths = mapping.assets.map(a => a.sourceUrl);
  for (const file of files.filter(f => /\.(html|css|json)$/.test(f))) {
    const text = fs.readFileSync(path.join(solver, file), 'utf8');
    if (forbidden.some(id => text.includes(id)) || /g[1-4]u\d{2}\.(?:w|gi|ci)\./.test(text)) fail('PUBLIC:SOURCE_ID ' + file);
    if (sourcePaths.some(source => text.includes(source))) fail('PUBLIC:SOURCE_ASSET_PATH ' + file);
    if (file.endsWith('.html')) {
      errors.push(...solverHtmlErrors(text).map(e => file + ':' + e));
      if (!text.includes('<title>CODEX DRAFT — NOT CANON · Revision W0</title>')) fail('PUBLIC:TITLE ' + file);
      // Links, title/id/class/data/alt metadata cannot carry a typed English target.
      // Visible exercise text and legitimate choice values remain unchanged.
      const view = manifest.views.find(v => v.file === file);
      const entry = view && entries[expected.findIndex(e => e.publicId === view.publicId)];
      if (entry?.kind === 'vocab' && entry.pool !== 'enToDe') {
        const escaped = entry.item.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const term = new RegExp(`\\b${escaped}\\b`, 'i');
        const metadata = attributes(text).filter(a => /^(?:title|id|class|data-[\w-]+|alt|src|href|aria-label)$/.test(a.name)).map(a => a.value);
        if (metadata.some(value => term.test(value))) fail('PUBLIC:TARGET_IN_METADATA ' + file);
      }
      for (const a of attributes(text)) {
        if (forbidden.some(id => a.value.includes(id))) fail('PUBLIC:SOURCE_ID_METADATA ' + file);
        if (['href','src'].includes(a.name) && !files.includes(a.value)) fail('PUBLIC:LINK ' + file);
      }
    }
    if (file.endsWith('.css')) for (const m of text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
      if (!m[1].startsWith('data:') && !files.includes(m[1])) fail('PUBLIC:CSS_LINK');
    }
  }
  const actualManifest = path.join(solver, 'manifest.json');
  if (!files.includes('manifest.json') || !same(JSON.parse(fs.readFileSync(actualManifest, 'utf8')), manifest)) fail('PACKET:MANIFEST_BYTES');
  return [...new Set(errors)];
}
