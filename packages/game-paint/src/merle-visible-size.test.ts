// CODEX DRAFT — NOT CANON. Verify painted body pixels, not frame equality.
import fs from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { entDisplayH } from "./anim.ts";
import { HERO2_SRC_SCALE } from "./rigSpec.ts";
const { PNG } = createRequire(import.meta.url)("pngjs");
const art = new URL("../../../apps/web/public/art/g1/paint/", import.meta.url);
const read = (name: string) => PNG.sync.read(fs.readFileSync(new URL(name + ".png", art))) as {width:number;height:number;data:Uint8Array};
const visible = (im: ReturnType<typeof read>) => {
  let top=im.height, bottom=-1, left=im.width, right=-1;
  for(let y=0;y<im.height;y++) for(let x=0;x<im.width;x++) if(im.data[(y*im.width+x)*4+3]!>16) {
    top=Math.min(top,y);bottom=Math.max(bottom,y);left=Math.min(left,x);right=Math.max(right,x);
  }
  return {top,bottom,left,right,height:bottom-top+1};
};
describe("Merle's visible body matches the hero in chapter one",()=>{
  it("matches actual alpha-covered standing height, within a hundredth of a world pixel",()=>{
    const hero=read("hero/hero2_idle"), merle=read("ch01/merle_a");
    const heroH=visible(hero).height*HERO2_SRC_SCALE;
    const merleH=visible(merle).height*entDisplayH({role:"classmate",skin:"merle"})/merle.height;
    expect(heroH).toBeGreaterThan(35);
    expect(merleH/heroH).toBeCloseTo(1,4);
    expect(Math.abs(merleH-heroH)).toBeLessThan(.01);
  });
  it("keeps the existing common pose scale and preserves complete image margins",()=>{
    const names=fs.readdirSync(new URL("ch01/",art)).filter(n=>/^merle_.+\.png$/.test(n));
    expect(names.length).toBe(28);
    const ref=read("ch01/merle_a");
    const scale=entDisplayH({role:"classmate",skin:"merle"})/ref.height;
    for(const name of names){
      const im=read("ch01/"+name.slice(0,-4)), body=visible(im);
      expect(body.top,name).toBeGreaterThanOrEqual(2);
      expect(body.left,name).toBeGreaterThanOrEqual(2);
      expect(im.width-1-body.right,name).toBeGreaterThanOrEqual(2);
      expect(im.height-1-body.bottom,name).toBeGreaterThanOrEqual(2);
      expect(body.height*scale,name).toBeGreaterThan(32);
      expect(body.height*scale,name).toBeLessThan(41);
    }
    const scene=fs.readFileSync(new URL("./PaintScene.ts",import.meta.url),"utf8");
    expect(scene).toContain('targetH / (this.refFrameHOf(e.skin) || frameH)');
  });
  it("does not resize the other chapter classmates",()=>{
    for(const skin of ["fenn","ilvy","piet","veit","tammo","enna","juno","quirin","smilla","lenz","edda","falk","fritzi","cleo"])
      expect(entDisplayH({role:"classmate",skin}),skin).toBe(30);
    expect(entDisplayH({role:"cage",skin:"pencilcase",params:{classmate:"merle"}})).toBe(54);
  });
});
