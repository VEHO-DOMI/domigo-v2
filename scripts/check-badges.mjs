#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),req=createRequire(path.join(root,'apps/web/package.json')),ts=req('typescript');
const client='apps/web/app/profil/BadgeGrid.tsx',catalog='apps/web/lib/trainer/badges.ts',page='apps/web/app/profil/page.tsx';
const ids=['streak-3','streak-7','prestige-1','prestige-2','prestige-3','duo-champion','daily-first'];
function collect(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>{
  if(['node_modules','.next','.git'].includes(e.name))return [];
  const file=dir+'/'+e.name;
  return e.isDirectory()?collect(file):/\.[cm]?[jt]sx?$/.test(e.name)&&!e.name.endsWith('.d.ts')?[file]:[];
});}
const source=Object.fromEntries(collect('apps/web').map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
function checkClientTree(files){
  const asts=new Map(Object.entries(files).map(([file,text])=>[file,ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX)]));
  const clients=new Set([...asts].filter(([,ast])=>ast.statements.some(s=>ts.isExpressionStatement(s)&&ts.isStringLiteral(s.expression)&&s.expression.text==='use client')).map(([file])=>file));
  // Follow local imports/re-exports: an unmarked helper is still browser code.
  for(const file of clients)for(const st of asts.get(file).statements){
    if(!(ts.isImportDeclaration(st)||ts.isExportDeclaration(st))||!st.moduleSpecifier||st.importClause?.isTypeOnly||st.isTypeOnly)continue;
    const spec=st.moduleSpecifier.text;
    const base=spec.startsWith('@/')?'apps/web/'+spec.slice(2):spec.startsWith('.')?path.posix.normalize(path.posix.join(path.posix.dirname(file),spec)):null;
    if(!base)continue;
    const target=[base,...['.ts','.tsx','.js','.jsx','/index.ts','/index.tsx'].map(ext=>base+ext)].find(p=>asts.has(p));
    if(target)clients.add(target);
  }
  const comparisons=new Set([ts.SyntaxKind.GreaterThanToken,ts.SyntaxKind.GreaterThanEqualsToken,ts.SyntaxKind.LessThanToken,ts.SyntaxKind.LessThanEqualsToken,ts.SyntaxKind.EqualsEqualsToken,ts.SyntaxKind.EqualsEqualsEqualsToken,ts.SyntaxKind.ExclamationEqualsToken,ts.SyntaxKind.ExclamationEqualsEqualsToken]);
  for(const file of clients){
    const ast=asts.get(file);
    const walk=node=>{
      if(ts.isBinaryExpression(node)&&comparisons.has(node.operatorToken.kind)){
        const operands=[node.left,node.right],numbers=operands.filter(ts.isNumericLiteral).map(n=>Number(n.text));
        const text=operands.map(n=>n.getText(ast)).join(' ');
        const prestige=numbers.some(n=>[30000,45000,65000].includes(n));
        const streak=/\bstreak\b/i.test(text)&&numbers.some(n=>[3,7].includes(n));
        const duel=/\b(?:wins|duelWins|completedDuels)\b/i.test(text)&&numbers.includes(5);
        const daily=/\b(?:daily|dailyCount|dailyCompleted)\b/i.test(text)&&numbers.some(n=>[0,1].includes(n));
        assert(!(prestige||streak||duel||daily),'BADGE_CLIENT_TREE: '+file+': '+node.getText(ast));
      }
      ts.forEachChild(node,walk);
    };walk(ast);
  }
  return clients.size;
}
function check(files){
  checkClientTree(files);
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
  for(const expression of ['xp >= 30000','xp >= 45000','xp >= 65000','streak >= 3','streak >= 7','wins >= 5','daily > 0']){
    const mutant={...source,'apps/web/app/__badge_probe/Other.tsx':`'use client'; export const earned=(${expression});`};
    assert.throws(()=>check(mutant),/BADGE_CLIENT_TREE/);console.log('KILLED new client '+expression);
  }
  const helper={...source,'apps/web/app/__badge_probe/Other.tsx':`'use client'; export {earned} from './helper';`,'apps/web/app/__badge_probe/helper.ts':'export const earned = streak >= 3;'};
  assert.throws(()=>check(helper),/BADGE_CLIENT_TREE/);console.log('KILLED transitive client helper');
  for(const[file,from,to,marker]of mutations){assert(source[file].includes(from));const mutant={...source,[file]:source[file].replace(from,to)};assert.throws(()=>check(mutant),new RegExp(marker==='BADGE_CLIENT_DERIVATION'?'BADGE_CLIENT_(DERIVATION|TREE)':marker));console.log('KILLED '+marker);}
}
console.log(`check-badges: ${Object.keys(source).length} web files inventoried, ${checkClientTree(source)} client modules; seven display-only badges, server owner and preview checked`);
