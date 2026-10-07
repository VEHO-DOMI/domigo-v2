#!/usr/bin/env node
// cgo-092: scan rendered JSX copy, never identifiers, slugs, imports or comments.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../apps/web/package.json', import.meta.url));
const ts = require('typescript');
const forbidden = /\b(?:units?|einheit(?:en)?)\b/i;
export function copyHits(source, file = 'fixture.tsx') {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const hits = new Map();
  const bindings = new Map();
  const collect = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) bindings.set(node.name.text, node.initializer);
    ts.forEachChild(node, collect);
  };
  collect(tree);
  const literal = (node) => {
    if (forbidden.test(node.text)) hits.set(node.pos, { line: tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1, text: node.text.trim() });
  };
  const expression = (node, seen = new Set()) => {
    if (!node) return;
    if (ts.isStringLiteralLike(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) literal(node);
    else if (ts.isIdentifier(node) && !seen.has(node.text) && bindings.has(node.text)) expression(bindings.get(node.text), new Set([...seen, node.text]));
    else if (ts.isTemplateExpression(node)) { expression(node.head, seen); for (const span of node.templateSpans) { expression(span.expression, seen); expression(span.literal, seen); } }
    else if (ts.isConditionalExpression(node)) { expression(node.whenTrue, seen); expression(node.whenFalse, seen); }
    else if (ts.isCallExpression(node) || ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) return; // executable IDs are not copy
    else if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) visit(node);
    else ts.forEachChild(node, (child) => expression(child, seen));
  };
  const visit = (node) => {
    if (ts.isJsxText(node)) literal(node);
    else if (ts.isJsxExpression(node)) { expression(node.expression); ts.forEachChild(node, visit); }
    else if (ts.isJsxAttribute(node)) {
      if (/^(title|label|note|placeholder|alt|aria-label)$/.test(node.name.getText(tree))) expression(node.initializer);
    } else ts.forEachChild(node, visit);
  };
  visit(tree);
  return [...hits.values()];
}
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'admin' || entry.name === 'api') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? files(full) : /\.tsx$/.test(entry.name) && !/\.test\.tsx$/.test(entry.name) ? [full] : [];
  });
}
if (process.argv.includes('--selftest')) {
  for (const bad of ['<p>Unit 1</p>', '<div>{rows.map(row => <p>Unit {row.id}</p>)}</div>', '<p>{"Units"}</p>', '<p>{`Einheit ${n}`}</p>', '<a title="Einheiten">Chapter</a>', 'const label = "all units"; const el = <p>{label}</p>']) assert.ok(copyHits(bad).length, bad);
  for (const good of ['const unitSlug = "g1-u01"; const el = <p>Chapter {unitSlug}</p>', '/* Unit */ const el = <p>{listApprovedUnits().length} Chapters</p>', '<Link href="/unit">Chapter</Link>', '<p>{scope.kind === "unit" ? "Chapter" : "Alle"}</p>']) assert.equal(copyHits(good).length, 0, good);
  console.log('check-chapter-copy selftest: 6 red / 4 green controls passed');
} else {
  const scanned = files('apps/web/app');
  const hits = scanned.flatMap((file) => copyHits(fs.readFileSync(file, 'utf8'), file).map((hit) => ({ file, ...hit })));
  for (const hit of hits) console.error(`${hit.file}:${hit.line}: ${hit.text}`);
  console.log(`check-chapter-copy: ${scanned.length} student JSX files; ${hits.length} visible-copy violations`);
  process.exitCode = hits.length ? 1 : 0;
}
