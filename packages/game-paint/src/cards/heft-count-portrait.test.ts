import fs from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { describe, expect, it } from "vitest";
import { CardShell } from "./CardShell.tsx";
import { GameTaskV2 } from "../../../content-schema/src/game-tasks.ts";
const require = createRequire(new URL("../../../../apps/web/package.json", import.meta.url));
const { PNG } = require("pngjs"); const { renderToStaticMarkup } = require("react-dom/server");
const tasks = JSON.parse(fs.readFileSync(new URL("../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json", import.meta.url), "utf8")).items;
const task = (end: string) => GameTaskV2.parse(tasks.find((t: {id:string}) => t.id === `g1.paint.ch01.enc.heft.${end}`));
function blueComponents(stem: string): number[] {
  const p = PNG.sync.read(fs.readFileSync(new URL(`../../../../apps/web/public/art/g1/paint/ch01/${stem}.png`, import.meta.url)));
  expect([p.width, p.height]).toEqual([512, 384]);
  const seen = new Uint8Array(p.width * p.height), counts: number[] = [];
  const blue = (i: number) => p.data[i*4+3] > 200 && p.data[i*4+2] > p.data[i*4]*1.4 && p.data[i*4+2] > p.data[i*4+1]*1.15;
  for (let i=0;i<seen.length;i++) {
    if (seen[i] || !blue(i)) continue;
    const queue=[i];seen[i]=1;
    for (let k=0;k<queue.length;k++) {
      const a=queue[k]!,x=a%p.width,y=Math.floor(a/p.width);
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]] as const) {
        const xx=x+dx,yy=y+dy,j=yy*p.width+xx;
        if(xx>=0&&xx<p.width&&yy>=0&&yy<p.height&&!seen[j]&&blue(j)){seen[j]=1;queue.push(j);}
      }
    }
    if(queue.length>1000)counts.push(queue.length);
  }
  return counts;
}
const draw=(t: GameTaskV2)=>renderToStaticMarkup(React.createElement(CardShell,{task:t,attempts:0,onDismiss:()=>{},children:null,art:{heft_count_dots_a:"/dots-page.png",heft_count_books_a:"/books-page.png",heft_a:"/ordinary-heft.png"}}));
const image=(html:string)=>html.match(/<img\b[^>]*>/g);
describe("authored notebook counting pages",()=>{
  it("has three separate painted dot regions in the actual registered PNG",()=>{
    const regions=blueComponents("heft_count_dots_a");expect(regions).toHaveLength(3);
    expect(regions.every(n=>n>3000&&n<5000)).toBe(true);
    // A different countable picture must fail the same three-dot requirement.
    expect(blueComponents("heft_count_books_a")).not.toHaveLength(3);
  });
  it("has two substantial separated blue book covers in the actual registered illustration",()=>{
    const regions=blueComponents("heft_count_books_a");expect(regions).toHaveLength(2);
    expect(regions.every(n=>n>10000)).toBe(true);
  });
  it.each(["n1","n2"])("emits the authored %s picture at readable size independently of its answer key",end=>{
    const t=task(end),html=draw(t);
    expect(html).toContain("height:180px");expect(image(html)).toHaveLength(1);
    const altered=GameTaskV2.parse({...t,answer:end==="n1"?"two":"two book"});
    expect(image(draw(altered))).toEqual(image(html));
  });
  it("does not enlarge an unrelated notebook task or declare the quantity in its caption",()=>{
    const t=task("n1"),ordinary=GameTaskV2.parse({...t,id:"g1.paint.ch01.enc.heft.other",stimulus:{...t.stimulus,art:"heft_a"}});
    expect(draw(ordinary)).not.toContain("height:180px");
    const books=task("n2");expect(books.stimulus.type).toBe("entity");
    expect(JSON.stringify(books.stimulus)).not.toMatch(/zwei|two|three|drei/i);
  });
});
