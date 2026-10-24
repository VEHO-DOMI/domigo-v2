#!/usr/bin/env node
/** V-1: full Next routes, external immutable references, explicit candidate capture. */
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';import {createHash}from'node:crypto';import {createRequire}from'node:module';import {fileURLToPath}from'node:url';import {spawn}from'node:child_process';
import { visualContract, verifyReference } from './lib/visual/reference.mjs';
import { startVisualServer } from './lib/visual/server.mjs';
import { freezeSources, verifySources } from './lib/visual/source-snapshot.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),args=process.argv.slice(2),option=n=>args.includes(n)?args[args.indexOf(n)+1]:null;
const out=path.resolve(option('--out')??fs.mkdtempSync(path.join(os.tmpdir(),'verify-design-'))),capture=args.includes('--capture'),external=option('--url'),baseline=path.resolve(option('--baseline')??path.join(out,'reference'));
assert(out!==root&&!out.startsWith(root+path.sep),'Evidence must stay outside repository');assert(!baseline.startsWith(root+path.sep),'Images must stay outside repository');
assert(capture||option('--baseline'),'Comparison requires --baseline; it never creates its own reference');
assert(!(capture&&fs.existsSync(baseline)),'Candidate capture requires a new directory; references are never overwritten');
if(external){const u=new URL(external);assert(['http:','https:'].includes(u.protocol)&&!u.username&&!u.password,'Invalid URL');assert(option('--accounts'),'External routes require --accounts with synthetic test storage states');}
if(option('--accounts')){const a=JSON.parse(fs.readFileSync(option('--accounts'),'utf8'));assert(a.synthetic===true&&[1,2,3,4].every(g=>a.states?.[`student-${g}`])&&a.states.teacher,'Only an explicit complete synthetic-account manifest is accepted');}
fs.mkdirSync(out,{recursive:true});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function files(dir){return fs.readdirSync(dir,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()&&e.name.endsWith('.png')).map(e=>path.relative(dir,path.join(e.parentPath,e.name))).sort();}
// Evidence binds to source bytes, including uncommitted authoring work. It is
// deliberately separate from reference approval and does not rewrite a baseline.
const sourceSnapshot=freezeSources(root);
fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({status:'CODEX DRAFT — NOT CANON',...sourceSnapshot},null,2));
const req=createRequire(path.join(root,'package.json')), {chromium}=req('playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined});const environment={platform:process.platform,arch:process.arch,browser:browser.version(),contract:visualContract(root)};await browser.close();
if(!capture){const pinned=option('--reference-index');const manifest=pinned?verifyReference(baseline,path.resolve(pinned),environment.contract):JSON.parse(fs.readFileSync(path.join(baseline,'manifest.json'),'utf8'));const expectedEnvironment=pinned?{...manifest.environment,contract:environment.contract}:manifest.environment;assert.deepEqual(expectedEnvironment,environment,'Different capture environment');assert.equal(manifest.files.length,92,'Incomplete V-1 reference matrix');for(const f of manifest.files){assert(!path.isAbsolute(f.path)&&!f.path.split(/[\\/]/).includes('..'),'Invalid reference path');assert.equal(hash(fs.readFileSync(path.join(baseline,f.path))),f.sha256,'Reference changed: '+f.path);}}
let server;
try{
 if(!external)server=await startVisualServer(root,out,0,option('--mutant'));
 const url=external??server.url;
 const env={...process.env,VISUAL_URL:url,VISUAL_OUT:out,VISUAL_BASELINE:baseline,VISUAL_CAPTURE:capture?'1':'0',VISUAL_FIXTURE:external?'0':'1',VISUAL_ACCOUNTS:option('--accounts')??'',VISUAL_MUTANT:option('--mutant')??''};
 const command=[path.join(path.dirname(req.resolve('playwright/package.json')),'cli.js'),'test','--config',path.join(root,'apps/web/playwright.config.ts')];if(option('--grep'))command.push('--grep',option('--grep'));if(option('--project'))command.push('--project',option('--project'));
 const child=spawn(process.execPath,command,{cwd:root,env,stdio:'inherit'});const code=await new Promise(resolve=>child.once('exit',resolve));
 verifySources(root,sourceSnapshot);if(server)server.audit();assert.equal(code,0,'V-1 failed; see external evidence');
 if(capture){const list=files(baseline);assert.equal(list.length,92,'Incomplete V-1 reference matrix');fs.writeFileSync(path.join(baseline,'manifest.json'),JSON.stringify({status:'CODEX DRAFT — NOT CANON; candidate, not Koki-approved',environment,files:list.map(p=>({path:p,sha256:hash(fs.readFileSync(path.join(baseline,p)))}))},null,2));console.log('Captured 92 candidate references; approval and comparison remain separate.');}
 else console.log(option('--grep')||option('--project')?'Selected V-1 cases passed; partial verification only.':'V-1 reference comparison passed: 92 cases, zero differing pixels.');
}finally{if(server)await server.stop();}
