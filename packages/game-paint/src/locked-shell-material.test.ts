// CODEX DRAFT — NOT CANON. Locked material is not an unfinished colour task.
import { describe, expect, it } from "vitest";
import { washAlphaFor, WASH_ALPHA, GHOST_WASH } from "./anim.ts";
describe("explicit photo/device locks preserve painted material",()=>{
  it.each(["photo_frame_cage", "device_locker"])("%s stays coloured before and after unlocking",shellArt=>{
    for(const redeemed of [false,true]) for(const reduced of [false,true]) for(const freedTick of [0,1,15,60])
      expect(washAlphaFor({role:"cage",redeemed,timer:0,freedTick,params:{shellArt}},reduced)).toBe(0);
  });
  it("requires an exact opted-in cage shell; ordinary cages retain the original wash",()=>{
    for(const shellArt of [undefined,"satchel","pencilcase","photo_frame_cage_typo"])
      expect(washAlphaFor({role:"cage",redeemed:false,timer:0,params:{shellArt}})).toBe(WASH_ALPHA);
    expect(WASH_ALPHA).toBeGreaterThan(0);
    expect(washAlphaFor({role:"drained",redeemed:false,timer:0,params:{shellArt:"photo_frame_cage"}})).toBe(WASH_ALPHA);
  });
  it("does not remove the classmate's six-step curse",()=>{
    const e={role:"classmate",redeemed:false,timer:0,params:{shellArt:"photo_frame_cage"}};
    expect(washAlphaFor({...e,awakenStep:0})).toBe(GHOST_WASH);
    expect(washAlphaFor({...e,awakenStep:3})).toBeGreaterThan(0);
    expect(washAlphaFor({...e,awakenStep:3})).toBeLessThan(GHOST_WASH);
  });
});
