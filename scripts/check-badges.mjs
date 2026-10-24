#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),req=createRequire(path.join(root,'apps/web/package.json')),ts=req('typescript');
const client='apps/web/app/profil/BadgeGrid.tsx',catalog='apps/web/lib/trainer/badges.ts',page='apps/web/app/profil/page.tsx';
const ids=['streak-3','streak-7','prestige-1','prestige-2','prestige-3','duo-champion','daily-first'];
const source=Object.fromEntries([client,catalog,page].map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
function check(files){
  assert.deepEqual([...files[catalog].matchAll(/id: "([^"]+)"/g)].map(m=>m[1]),ids,'BADGE_CATALOG');
  for(const file of[client,catalog]){
    const ast=ts.createSourceFile(file,files[file],ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    const walk=node=>{
      if(ts.isImportDeclaration(node))assert(node.importClause?.isTypeOnly||['@/lib/trainer/preferences','@/lib/trainer/badges','./BadgeGrid.module.css'].includes(node.moduleSpecifier.text),'BADGE_CLIENT_IMPORT');
      if(ts.isIdentifier(node))assert(!['xp','streak','wins','daily','getStudentBadges','getDb','localStorage','sessionStorage','fetch','eval','Function'].includes(node.text),'BADGE_CLIENT_DERIVATION');
      if(ts.isBinaryExpression(node))assert(![ts.SyntaxKind.GreaterThanToken,ts.SyntaxKind.GreaterThanEqualsToken,ts.SyntaxKind.LessThanToken,ts.SyntaxKind.LessThanEqualsToken,ts.SyntaxKind.PlusToken,ts.SyntaxKind.MinusToken,ts.SyntaxKind.AsteriskToken,ts.SyntaxKind.SlashToken].includes(node.operatorToken.kind),'BADGE_CLIENT_DERIVATION');
      ts.forEachChild(node,walk);
    };walk(ast);
  }
  assert(!files[page].startsWith('"use client"'),'BADGE_SERVER_PAGE');
  assert.match(files[page],/preview \? \[\] : acting \? await getStudentBadges\(getDb\(\), acting\.classScope, acting\.classId, acting\.userId\)/,'BADGE_SERVER_OWNER');
  assert.match(files[client],/const confirmed = preview \? \[\] : earned;/,'BADGE_PREVIEW');
}
check(source);
if(process.argv.includes('--selftest')){
  const mutations=[
    [client,'const de =','const xp = 30000; const fake = xp >= 30000; const de =','BADGE_CLIENT_DERIVATION'],
    [client,'const de =','const fake = 30000 >= 30000; const de =','BADGE_CLIENT_DERIVATION'],
    [client,'import type { StudentBadgeId }','import { getStudentBadges, type StudentBadgeId }','BADGE_CLIENT_IMPORT'],
    [client,'preview ? [] : earned','earned','BADGE_PREVIEW'],
    [catalog,'id: "streak-3"','id: "first-session"','BADGE_CATALOG'],
    [page,'acting.classScope','[]','BADGE_SERVER_OWNER'],
  ];
  for(const[file,from,to,marker]of mutations){assert(source[file].includes(from));const mutant={...source,[file]:source[file].replace(from,to)};assert.throws(()=>check(mutant),new RegExp(marker));console.log('KILLED '+marker);}
}
console.log('check-badges: seven display-only badges; server owner and preview boundary checked');
