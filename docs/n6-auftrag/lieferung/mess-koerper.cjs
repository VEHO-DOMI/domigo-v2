// Wareneingang fuer ein KOERPER-Blatt. Die Maske wird aus visualBodies.ts GELESEN,
// nicht abgeschrieben — eine abgeschriebene Maske driftet.
// Formeln zeichengleich mit check-body-silhouette.mjs (EDGE_G 12, innere 80 %,
// Alpha >= 128) und check-composition.mjs (Luminanz/Saettigung, 3-px-Schritt).
// Selbstbeweis: die Ostmauer misst 34,0 % Luminanz / 67,5 % Saettigung /
// Kanten-Median 36,3 % / Steh-Zellen 32,1 % — weicht ein Lauf davon ab, ist das
// Mass gedriftet und nicht das Blatt.
//
//   node docs/n6-auftrag/lieferung/mess-koerper.cjs <blatt.png> <koerper-id>
const fs=require("fs"),{PNG}=require("pngjs");
const path=require("path");
const SRC=path.resolve(__dirname,"../../../packages/game-paint/src/visualBodies.ts");
const sheet=process.argv[2], wantId=process.argv[3];

const src=fs.readFileSync(SRC,"utf8");
const i=src.indexOf(`id: "${wantId}"`);
if(i<0){console.error("Koerper nicht in visualBodies.ts: "+wantId);process.exit(2);}
const blk=src.slice(i, src.indexOf("},", src.indexOf("pxPerCell", i)));
const rows=[...blk.matchAll(/"([#.]+)"/g)].map(m=>m[1]);
const px=Number((blk.match(/pxPerCell:\s*(\d+)/)||[])[1]);
const op=blk.match(/overpaint:\s*\{\s*l:\s*(\d+),\s*r:\s*(\d+),\s*t:\s*(\d+),\s*b:\s*(\d+)/);
const [opl,opr,opt,opb]=[+op[1],+op[2],+op[3],+op[4]];
if(!rows.length||!px){console.error("Maske/pxPerCell nicht lesbar");process.exit(2);}

const p=PNG.sync.read(fs.readFileSync(sheet));
const A=(x,y)=>p.data[((y*p.width+x)*4)+3]??0;
const Lg=(x,y)=>{const k=(y*p.width+x)*4;return 0.299*(p.data[k]??0)+0.587*(p.data[k+1]??0)+0.114*(p.data[k+2]??0);};
const lumOf=(r,g,b)=>(0.2126*r+0.7152*g+0.0722*b)/255;
const satOf=(r,g,b)=>{const M=Math.max(r,g,b);return M===0?0:(M-Math.min(r,g,b))/M;};
const W=Math.max(...rows.map(r=>r.length));
const sollW=W*px+opl+opr, sollH=rows.length*px+opt+opb;

const dichte=(dc,dr)=>{const x0=opl+dc*px,y0=opt+dr*px,m=Math.round(px*0.1);let k=0,n=0;
 for(let y=y0+m;y<y0+px-m;y++)for(let x=x0+m;x<x0+px-m;x++){
  if(A(x,y)<128||A(x+1,y)<128||A(x,y+1)<128)continue;n++;
  if(Math.hypot(Lg(x+1,y)-Lg(x,y),Lg(x,y+1)-Lg(x,y))>12)k++;}
 return n===0?null:k/n*100;};
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};

let alle=[],steh=[],karte=[];
for(let dr=0;dr<rows.length;dr++){let z="";
 for(let dc=0;dc<W;dc++){ if(rows[dr][dc]!=="#"){z+=".";continue;}
  const d=dichte(dc,dr); if(d!==null)alle.push(d);
  z+= d===null?"?":(d>=95?"X":String(Math.min(9,Math.floor(d/10))));}
 karte.push(z);}
for(let dc=0;dc<W;dc++)for(let dr=0;dr<rows.length;dr++)
 if(rows[dr][dc]==="#"){const d=dichte(dc,dr);if(d!==null)steh.push(d);break;}

let n=0,L=0,S=0,r=0,g=0,b=0;
for(let y=0;y<p.height;y+=3)for(let x=0;x<p.width;x+=3){const k=(p.width*y+x)<<2;
 if(p.data[k+3]<128)continue;
 L+=lumOf(p.data[k],p.data[k+1],p.data[k+2]);S+=satOf(p.data[k],p.data[k+1],p.data[k+2]);
 r+=p.data[k];g+=p.data[k+1];b+=p.data[k+2];n++;}

console.log(`Blatt        : ${sheet}`);
console.log(`Koerper      : ${wantId}  (Maske aus visualBodies.ts: ${rows.length} Zeilen x ${W} Spalten, ${alle.length} Pflicht-Zellen)`);
console.log(`Mass         : ${p.width}x${p.height}   ${p.width===sollW&&p.height===sollH?"OK":"✗ SOLL "+sollW+"x"+sollH}`);
console.log(`Wert-Vertrag : Luminanz ${(L/n*100).toFixed(1)} % (30-38, Ziel 34) · Saettigung ${(S/n*100).toFixed(1)} % (>=45) · rgb ${Math.round(r/n)},${Math.round(g/n)},${Math.round(b/n)} (Anker 115,88,52)`);
console.log(`Gesetz 5     : Kanten-Median ganzes Blatt ${med(alle).toFixed(1)} %  (Decke 80; 76-84 => Mensch)`);
const sm=med(steh), smin=Math.min(...steh);
console.log(`★ Steh-Zellen: ${steh.length} Stueck · Median ${sm.toFixed(1)} % · schwaechste ${smin.toFixed(1)} %`
 + `   ${sm>=20&&smin>=4?"OK":"✗ Ziel: Median >=20 (Ostmauer 32,1 / Exemplar 27,4), schwaechste >=4"}`);
console.log("Kanten-Dichte je Zelle (Zehntel):");
karte.forEach((z,i)=>console.log("   "+String(i).padStart(2)+"  "+z));
