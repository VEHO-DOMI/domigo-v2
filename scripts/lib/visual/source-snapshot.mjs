import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
export const SOURCE_ROOTS = ['apps/web/app','apps/web/lib','apps/web/public','apps/web/e2e','apps/web/scripts','packages','content','scripts/lib','scripts/verify-design.mjs','apps/web/auth.ts','apps/web/middleware.ts','apps/web/playwright.config.ts','apps/web/next.config.ts','apps/web/tsconfig.json','apps/web/postcss.config.mjs','apps/web/package.json','package.json','pnpm-lock.yaml'];
const ignored = new Set(['node_modules','.git','.next','dist','coverage','.turbo']);
function inventory(root, roots) {
  const files=[];
  function visit(relative) {
    const full=path.join(root,relative), stat=fs.lstatSync(full);
    if(stat.isDirectory()) { for(const name of fs.readdirSync(full).sort()) if(!ignored.has(name)&&!name.endsWith('.tsbuildinfo')&&!name.startsWith('.env'))visit(path.join(relative,name)); }
    else {
      assert(!stat.isSymbolicLink(),'Source symlinks need explicit snapshot support: '+relative);
      files.push({path:relative,sha256:createHash('sha256').update(fs.readFileSync(full)).digest('hex')});
    }
  }
  roots.forEach(visit);return files.sort((a,b)=>a.path.localeCompare(b.path));
}
export function freezeSources(root, roots=SOURCE_ROOTS) { return {roots:[...roots],files:inventory(root,roots)}; }
export function verifySources(root, snapshot) {
  assert.deepEqual(inventory(root,snapshot.roots),snapshot.files,'Examined source changed during the run');
}
if(process.argv.includes('--selftest')) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'source-snapshot-'));
  const probes=['app/page.tsx','packages/game/theme.css','packages/engine/index.ts','content/unit.json','public/avatar.png','app/fonts/font.woff2'];
  for(const file of probes){fs.mkdirSync(path.dirname(path.join(dir,file)),{recursive:true});fs.writeFileSync(path.join(dir,file),'original');}
  const roots=['app','packages','content','public'],frozen=freezeSources(dir,roots);verifySources(dir,frozen);
  for(const file of probes){fs.writeFileSync(path.join(dir,file),'changed');assert.throws(()=>verifySources(dir,frozen),/Examined source changed/);fs.writeFileSync(path.join(dir,file),'original');console.log('KILLED source-change: '+file);}
  fs.writeFileSync(path.join(dir,'app/new.css'),'new');assert.throws(()=>verifySources(dir,frozen),/Examined source changed/);fs.unlinkSync(path.join(dir,'app/new.css'));
  fs.unlinkSync(path.join(dir,probes[0]));assert.throws(()=>verifySources(dir,frozen),/Examined source changed/);
  console.log('KILLED source-addition and source-deletion; 8 controls');
}
