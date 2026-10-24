#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import {sha256,visualContract,verifyReference} from './lib/visual/reference.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),args=process.argv.slice(2),option=n=>args.includes(n)?args[args.indexOf(n)+1]:null;
if(args.includes('--selftest')){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'reference-selftest-')),baseline=path.join(dir,'reference'),index=path.join(dir,'reference.sha256'),contract=sha256('synthetic contract');fs.mkdirSync(baseline);
 const files=[360,1280].flatMap(w=>['light','dark'].flatMap(t=>[...['home','practice','learn','review','assignments'].flatMap(r=>[1,2,3,4].map(g=>`${w}-${t}/${r}-g${g}.png`)),...['admin','signin','game'].map(r=>`${w}-${t}/${r}.png`)]));
 for(const f of files){fs.mkdirSync(path.dirname(path.join(baseline,f)),{recursive:true});fs.writeFileSync(path.join(baseline,f),'synthetic '+f);}
 fs.writeFileSync(path.join(baseline,'manifest.json'),JSON.stringify({environment:{contract},files:files.map(p=>({path:p,sha256:sha256(fs.readFileSync(path.join(baseline,p)))}))}));
 const original=`# version: synthetic-only\n# capture-contract: ${contract}\n# compare-contract: ${contract}\n`+[...files,'manifest.json'].map(f=>`${sha256(fs.readFileSync(path.join(baseline,f)))}  ${f}`).join('\n')+'\n';fs.writeFileSync(index,original);
 verifyReference(baseline,index,contract);
 const first=path.join(baseline,files[0]),bytes=fs.readFileSync(first);
 fs.unlinkSync(first);assert.throws(()=>verifyReference(baseline,index,contract),/ENOENT/);fs.writeFileSync(first,bytes);console.log('KILLED missing-reference');
 fs.writeFileSync(first,'changed');assert.throws(()=>verifyReference(baseline,index,contract),/REFERENCE_HASH/);fs.writeFileSync(first,bytes);console.log('KILLED changed-reference');
 fs.writeFileSync(index,original.replace(sha256(bytes),'0'.repeat(64)));assert.throws(()=>verifyReference(baseline,index,contract),/REFERENCE_HASH/);fs.writeFileSync(index,original);console.log('KILLED changed-hash');
 fs.writeFileSync(index,original.replace(files[0],'../../escape.png'));assert.throws(()=>verifyReference(baseline,index,contract),/REFERENCE_MATRIX/);fs.writeFileSync(index,original);console.log('KILLED path-escape');
 assert.throws(()=>verifyReference(baseline,index,sha256('changed contract')),/REFERENCE_COMPARE_CONTRACT/);console.log('KILLED changed-comparison-contract');
 fs.unlinkSync(first);fs.symlinkSync(path.join(baseline,files[1]),first);assert.throws(()=>verifyReference(baseline,index,contract),/REFERENCE_SYMLINK/);fs.unlinkSync(first);fs.writeFileSync(first,bytes);console.log('KILLED symlink-reference');
 verifyReference(baseline,index,contract);console.log('check-visual-reference: six rejection probes; restored control passes');
}else{
 assert(option('--baseline'),'REFERENCE_MISSING: --baseline must name the downloaded, versioned package');
 verifyReference(path.resolve(option('--baseline')),path.resolve(option('--index')??path.join(root,'apps/web/e2e/visual-baselines.sha256')),visualContract(root));console.log('check-visual-reference: 92 pinned images and manifest verified');
}
