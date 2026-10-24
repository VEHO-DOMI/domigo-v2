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
  // Follow static, dynamic and re-exported local modules with TypeScript's
  // common .js-to-.ts source convention. Type-only imports carry no runtime.
  const add=(file,spec)=>{
    const base=spec.startsWith('@/')?'apps/web/'+spec.slice(2):spec.startsWith('.')?path.posix.normalize(path.posix.join(path.posix.dirname(file),spec)):null;
    if(!base)return;
    const stem=base.replace(/\.[cm]?jsx?$/,'');
    const target=[base,...['.ts','.tsx','.js','.jsx','.mts','.cts','/index.ts','/index.tsx'].map(ext=>base+ext),...['.ts','.tsx','.mts','.cts'].map(ext=>stem+ext)].find(p=>asts.has(p));
    if(target)clients.add(target);
  };
  for(const file of clients){
    const imports=node=>{
      if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&!node.importClause?.isTypeOnly&&!node.isTypeOnly)add(file,node.moduleSpecifier.text);
      if(ts.isCallExpression(node)&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||(ts.isIdentifier(node.expression)&&node.expression.text==='require'))&&node.arguments[0]&&ts.isStringLiteralLike(node.arguments[0]))add(file,node.arguments[0].text);
      ts.forEachChild(node,imports);
    };imports(asts.get(file));
  }
  const comparisons=new Set([ts.SyntaxKind.GreaterThanToken,ts.SyntaxKind.GreaterThanEqualsToken,ts.SyntaxKind.LessThanToken,ts.SyntaxKind.LessThanEqualsToken,ts.SyntaxKind.EqualsEqualsToken,ts.SyntaxKind.EqualsEqualsEqualsToken,ts.SyntaxKind.ExclamationEqualsToken,ts.SyntaxKind.ExclamationEqualsEqualsToken]);
  for(const file of clients){
    const ast=asts.get(file),scopes=new Map();
    const transparent=node=>{while(ts.isParenthesizedExpression(node)||ts.isAsExpression(node)||ts.isTypeAssertionExpression(node)||ts.isNonNullExpression(node)||ts.isSatisfiesExpression(node))node=node.expression;return node;};
    const scopeOf=node=>{for(let p=node.parent;p;p=p.parent)if(ts.isBlock(p)||ts.isSourceFile(p))return p;};
    const declarations=node=>{
      if(ts.isVariableDeclaration(node)&&ts.isIdentifier(node.name)&&ts.isVariableDeclarationList(node.parent)&&(node.parent.flags&ts.NodeFlags.Const)){
        const scope=scopeOf(node);if(!scopes.has(scope))scopes.set(scope,new Map());scopes.get(scope).set(node.name.text,node.initializer);
      }
      ts.forEachChild(node,declarations);
    };declarations(ast);
    const numeric=(raw,seen=new Set())=>{
      const node=transparent(raw);if(ts.isNumericLiteral(node))return Number(node.text);
      if(!ts.isIdentifier(node)||seen.has(node))return undefined;seen.add(node);
      for(let parent=node.parent;parent;parent=parent.parent){
        if(scopes.get(parent)?.has(node.text)){const value=scopes.get(parent).get(node.text);return value?numeric(value,seen):undefined;}
        if(ts.isFunctionLike(parent)&&parent.parameters.some(p=>ts.isIdentifier(p.name)&&p.name.text===node.text))return undefined;
      }
      return undefined;
    };
    const walk=node=>{
      if(ts.isBinaryExpression(node)&&comparisons.has(node.operatorToken.kind)){
        const operands=[node.left,node.right],numbers=operands.map(n=>numeric(n)).filter(n=>n!==undefined);
        const text=operands.map(n=>n.getText(ast)).join(' ');
        const prestige=numbers.some(n=>[30000,45000,65000].includes(n));
        const streak=/\b(?:streak|streakDays|currentStreak)\b/i.test(text)&&numbers.some(n=>[3,7].includes(n));
        const duel=/\b(?:wins|duelWins|completedDuels)\b/i.test(text)&&numbers.includes(5);
        const daily=/\b(?:daily|dailyCount|dailyCompleted)\b/i.test(text)&&numbers.some(n=>[0,1].includes(n));
        assert(!(prestige||streak||duel||daily),'BADGE_CLIENT_TREE: '+file+': '+node.getText(ast));
      }
      if(ts.isConditionalExpression(node)||(ts.isBinaryExpression(node)&&[ts.SyntaxKind.AmpersandAmpersandToken,ts.SyntaxKind.BarBarToken].includes(node.operatorToken.kind))){
        const text=node.getText(ast);
        assert(!(/\bdaily(?:Count|Completed)?\b/i.test(text)&&/['"]daily-first['"]/.test(text)),'BADGE_CLIENT_TREE: '+file+': '+text);
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
  for(const expression of ['xp >= 30000','xp >= 45000','xp >= 65000','streak >= 3','streak >= 7','wins >= 5','daily > 0','xp >= (30000)','streakDays >= 3',"daily ? ['daily-first'] : []"]){
    const mutant={...source,'apps/web/app/__badge_probe/Other.tsx':`'use client'; export const earned=(${expression});`};
    assert.throws(()=>check(mutant),/BADGE_CLIENT_TREE/);console.log('KILLED new client '+expression);
  }
  const helper={...source,'apps/web/app/__badge_probe/Other.tsx':`'use client'; export {earned} from './helper';`,'apps/web/app/__badge_probe/helper.ts':'export const earned = streak >= 3;'};
  assert.throws(()=>check(helper),/BADGE_CLIENT_TREE/);console.log('KILLED transitive client helper');
  for(const statement of ["export const load=()=>import('./helper');","export {earned} from './helper.js';"]){
    const mutant={...helper,'apps/web/app/__badge_probe/Other.tsx':`'use client'; ${statement}`};
    assert.throws(()=>check(mutant),/BADGE_CLIENT_TREE/);console.log('KILLED runtime import '+statement);
  }
  const named={...source,'apps/web/app/__badge_probe/Other.tsx':"'use client'; const PRESTIGE=30000; const LIMIT=(PRESTIGE); export const earned=(xp:number)=>xp >= LIMIT;"};
  assert.throws(()=>check(named),/BADGE_CLIENT_TREE/);console.log('KILLED named constant threshold');
  for(const[file,from,to,marker]of mutations){assert(source[file].includes(from));const mutant={...source,[file]:source[file].replace(from,to)};assert.throws(()=>check(mutant),new RegExp(marker==='BADGE_CLIENT_DERIVATION'?'BADGE_CLIENT_(DERIVATION|TREE)':marker));console.log('KILLED '+marker);}
}
console.log(`check-badges: ${Object.keys(source).length} web files inventoried, ${checkClientTree(source)} client modules; seven display-only badges, server owner and preview checked`);
