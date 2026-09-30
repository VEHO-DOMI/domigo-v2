// CODEX DRAFT — NOT CANON. Local-only harness; no database or persistence API.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const root=path.resolve(import.meta.dirname,'../..'), out=path.resolve(process.argv[2]);
const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  const url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let base=out,relative=url;
  if(url.startsWith('/art/'))base=path.join(root,'apps/web/public');
  if(url.startsWith('/fonts/')){base=path.join(root,'apps/web/app');}
  if(url==='/')relative='/index.html';
  const file=path.resolve(base,'.'+relative);
  if(!file.startsWith(base+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');res.setHeader('Cache-Control','no-store');fs.createReadStream(file).pipe(res);
});
server.listen(0,'127.0.0.1',()=>console.log(`REVISION_LOCAL_PORT=${server.address().port}`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
