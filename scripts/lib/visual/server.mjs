import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
export async function startVisualServer(root, out, port=0, mutant=null) {
  const here=path.dirname(fileURLToPath(import.meta.url)), work=fs.mkdtempSync(path.join(os.tmpdir(),'domigo-visual-app-')), web=path.join(work,'apps/web'), original=path.join(root,'apps/web');
  fs.mkdirSync(web,{recursive:true});
  for(const dir of ['app','lib','scripts'])fs.cpSync(path.join(original,dir),path.join(web,dir),{recursive:true,filter:(src)=>!(/(?:\.test\.[cm]?[jt]sx?$|\/app\/api(?:\/|$))/.test(src))});
  for(const name of ['middleware.ts','tsconfig.json','postcss.config.mjs','package.json','next-env.d.ts'])if(fs.existsSync(path.join(original,name)))fs.copyFileSync(path.join(original,name),path.join(web,name));
  fs.symlinkSync(path.join(original,'public'),path.join(web,'public'));
  fs.symlinkSync(path.join(original,'node_modules'),path.join(web,'node_modules'));
  for(const dir of ['packages','content','node_modules'])fs.symlinkSync(path.join(root,dir),path.join(work,dir));
  fs.writeFileSync(path.join(work,'package.json'),'{"private":true}');
  const adapters=path.join(web,'visual-fixtures');fs.cpSync(here,adapters,{recursive:true});
  if(mutant==='db'||mutant==='network'){const file=path.join(adapters,'db.ts'),source=fs.readFileSync(file,'utf8');const attempt=mutant==='db'?'db.select()':"await fetch('https://visual.invalid/')";fs.writeFileSync(file,source.replace('export const getStudentAvatar = async () => 1;',`export const getStudentAvatar = async () => {try{${attempt};}catch{}return 1;};`));}
  fs.writeFileSync(path.join(web,'lib/arena/server.ts'),'export async function showArenaCard(){return true;}');
  fs.writeFileSync(path.join(web,'auth.ts'),fs.readFileSync(path.join(here,'auth.ts')));
  const session=path.join(web,'app/api/auth/session');fs.mkdirSync(session,{recursive:true});fs.writeFileSync(path.join(session,'route.ts'),`import {auth} from '@/auth';export async function GET(){return Response.json(await auth());}`);
  fs.writeFileSync(path.join(web,'next.config.mjs'),`import path from 'node:path';export default {devIndicators:false,transpilePackages:${JSON.stringify(Object.keys(JSON.parse(fs.readFileSync(path.join(original,'package.json'))).dependencies).filter(n=>n.startsWith('@domigo/')))},webpack(config){config.resolve.alias['@domigo/db$']=path.resolve('visual-fixtures/db.ts');for(const n of ['scope','studypath','journey-progress','practice-access','class-progress','streak'])config.resolve.alias['@visual-db/'+n+'$']=${JSON.stringify(path.join(root,'packages/db/src'))}+'/'+n+'.ts';return config;}};`);
  const require=createRequire(path.join(web,'package.json')), logfile=path.join(out,'server.log'), fd=fs.openSync(logfile,'w');
  const child=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'dev','--webpack','--hostname','127.0.0.1','--port',String(port)],{cwd:web,env:{PATH:process.env.PATH,HOME:work,TMPDIR:os.tmpdir(),NODE_ENV:'development',NEXT_TELEMETRY_DISABLED:'1',KONTO_BASE_URL:'http://127.0.0.1:1',AUTH_URL:'http://127.0.0.1:1',NODE_OPTIONS:`--require=${path.join(here,'network-guard.cjs')}`},stdio:['ignore',fd,fd]});fs.closeSync(fd);
  let url;
  for(let i=0;i<120;i++){const log=fs.readFileSync(logfile,'utf8');if(child.exitCode!==null)throw Error('Visual server exited; see external server.log');const m=log.match(/Local:\s+(http:\/\/[^\s\u001b]+)/);if(m&&/Ready in/.test(log)){url=m[1].replace('localhost','127.0.0.1');break;}await new Promise(r=>setTimeout(r,500));}
  assert(url,'Visual server did not become ready');
  return {url,work,logfile,async stop(){child.kill('SIGTERM');await new Promise(resolve=>{if(child.exitCode!==null)return resolve();child.once('exit',resolve);setTimeout(()=>{child.kill('SIGKILL');resolve();},5000).unref();});},audit(){assert(!/VISUAL_FORBIDDEN_/.test(fs.readFileSync(logfile,'utf8')),'Unexpected database/network/write access; see server.log');}};
}
