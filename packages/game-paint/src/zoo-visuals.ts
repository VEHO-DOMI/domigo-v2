import { PAINT } from "./paint.ts";
// CODEX DRAFT — NOT CANON · one opt-in cell contract for drawing and checking.
export const ZOO_CELLS: Readonly<Record<string, readonly string[]>> = {
  waertereimer: ["a","b","telegraph0","telegraph1","act0","act1","joy","rest"],
  pinguin_rutscher: ["a","b","brace","slide0","slide1","pop","joy","rest"],
  pinguin: ["a","walk0","walk1","look","joy","rest"],
  hund: ["a","walk0","walk1","walk2","walk3","look","joy","rest"],
  buddy: ["a","walk0","walk1","walk2","walk3","listen","parrot_support0","parrot_support1"],
  papagei: ["a","flap0","flap1","flap2","flap3","land","look","rest"],
  affe: ["a","windup0","windup1","throw0","throw1","scratch0","scratch1","rest"],
  bus_affe: ["a","climb0","climb1","sit0","sit1","home"],
  bus_frosch: ["a","compress","hop0","hop1","look","rest"],
  bus_katze: ["a","walk0","walk1","walk2","walk3","sit"],
  papagei_sturz: ["a","flap0","flap1","warn0","warn1","dive","land","joy"],
  giraffe: ["a","walk0","walk1","walk2","walk3","bend","blink","rest"],
  guide: ["a","point0","point1","look","wave0","wave1","welcome","rest"],
  grandma: ["a","walk0","walk1","wave"],
  besucherkind: ["a","walk0","walk1","point"],
  besucherin_aileen: ["a","look","wave0","wave1"],
  besucher_amrita: ["a","look","wave0","wave1"],
  besucher_rajit: ["a","look","wave0","wave1"],
  fenn: ["a","b","caged0","caged1","awake_name","awake_happy","awake_from","awake_year","awake_group","awake_reunited","walk0","walk1","walk2","walk3","joy","joy1","settle0","settle1","wave0","wave1"],
  zoozug: ["a","b","wait"], ast: ["a","b"], schild: ["a","crack","fall","rest"],
  zookaefig: ["a","shake","burst","open0","open1"], loewenkaefig: ["a","shake","burst","open0","open1"],
  stein: ["a","glow"],
};
export const ZOO_DISPLAY_HEIGHTS: Readonly<Record<string,number>> = {waertereimer:24,pinguin_rutscher:22,pinguin:24,hund:24,buddy:26,papagei:16,affe:24,papagei_sturz:28,fenn:30};
export const ZOO_HERO_STEMS = ["grab","hang0","hang1","hangjump","release","charge0","charge1","charge2","throw0","throw1","catch0","catch1"].map(c=>`hero2_${c}`);
const frame = (t: number, dwell: number, names: readonly string[]): string => names[Math.floor(Math.max(0,t)/dwell)%names.length]!;
export const zooSkinStems = (skin: string): string[] => (ZOO_CELLS[skin] ?? ["a"]).map(c=>`${skin}_${c}`);
/** Aliases for the same individual; group placeholders retain their own names. */
export const zooActorSkin = (skin: string): string => ({ affe:"bus_affe", frosch:"bus_frosch", katze:"bus_katze", aileen:"besucherin_aileen" }[skin] ?? skin);
export const zooStageCell = (skin: string, state: "moving"|"observing"|"home", timer: number, emotion?: string): string => {
  const cells=ZOO_CELLS[zooActorSkin(skin)] ?? ["a"];
  if (emotion && cells.includes(emotion)) return emotion;
  if (skin==="loewe") return state==="moving" ? `walk${Math.floor(timer/12)%4}` : emotion==="lonely" || emotion==="sad" ? "lonely0" : "watch";
  if (state==="moving") {
    const moving=cells.filter(c=>/^(walk|flap|climb|hop)\d$/.test(c));
    if (moving.length) return frame(timer,/papagei/.test(skin)?6:skin==="giraffe"||skin==="pinguin"?12:9,moving);
  }
  const preferences=state==="home"?["home","rest","sit","a"]:["look","listen","sit0","sit","a"];
  return preferences.find(c=>cells.includes(c))!;
};
export interface ZooPoseInput { skin?: string; role: string; state: string; timer: number; redeemed: boolean; vy: number; bounceTick?: number; freedTick?: number; actingCell?: string; projectileReleaseTick?: number }
export const zooEntityCell = (e: ZooPoseInput): string => {
  const s=e.skin??""; const t=e.timer;
  if (s==="fenn") {
    if (e.actingCell && !e.redeemed) return e.actingCell;
    if (e.state==="roam") return frame(t,9,["walk0","walk1","walk2","walk3"]);
    if (e.state==="caged") return frame(t,24,["caged0","caged1"]);
    if (e.state==="joy") return frame(t,12,["joy","joy1"]);
    if (e.state==="settle"||e.state==="wave") return frame(t,e.state==="wave"?24:12,[`${e.state}0`,`${e.state}1`]);
    return frame(t,24,["a","b"]);
  }
  if (e.role==="cage") return e.redeemed ? e.state==="open" ? frame(t,24,["open0","open1"]) : "burst" : e.state==="shaking"?"shake":"a";
  if (s==="zoozug") return e.state==="shuttle-out"||e.state==="shuttle-back"?frame(t,9,["a","b"]):"wait";
  if (s==="ast") return frame(t,24,["a","b"]);
  if (s==="schild") return ({armed:"crack",falling:"fall",gone:"rest",rest:"rest"}[e.state]??"a");
  if (e.redeemed) {
    const cells=ZOO_CELLS[s]??["a"];
    return (e.freedTick??t)<24 && cells.includes("joy")?"joy":["rest","sit","home","a"].find(c=>cells.includes(c))!;
  }
  if (s==="waertereimer") return e.state==="telegraph"?frame(t,15,["telegraph0","telegraph1"]):e.state==="act"?frame(t,6,["act0","act1"]):e.state==="turn"?"a":frame(t,9,["a","b"]);
  if (s==="pinguin_rutscher") return (e.bounceTick??0)===0 && e.vy===0?frame(t,9,["a","b"]):e.vy>PAINT.gravity*2?"brace":Math.abs(e.vy)<=PAINT.gravity*1.5?"pop":frame(t,9,["slide0","slide1"]);
  if (s==="affe") return e.state==="telegraph"?frame(t,15,["windup0","windup1"]):e.projectileReleaseTick!==undefined&&e.projectileReleaseTick<12?frame(e.projectileReleaseTick,6,["throw0","throw1"]):frame(t,24,["scratch0","scratch1"]);
  if (s==="papagei_sturz") return e.state==="telegraph"?frame(t,15,["warn0","warn1"]):e.state==="act"?"dive":e.state==="recover"?frame(t,6,["flap0","flap1"]):e.projectileReleaseTick!==undefined&&e.projectileReleaseTick<6?"land":frame(t,6,["flap0","flap1"]);
  return zooStageCell(s,e.state==="roam"?"moving":"observing",t);
};
export const effectiveCollectSkin = (level: {collectSkin?:string}, phase: {collectSkin?:string}): string => phase.collectSkin??level.collectSkin??"letters";
export const collectStems = (skin: string, animation?: string): string[] => skin==="letters"?[]:animation==="zoo-v2"?[`collect_${skin}_a`,`collect_${skin}_b`,...(skin==="bubble"?["collect_bubble_pop"]:[])]:[`collect_${skin}`];
export const collectCell = (skin: string, animation: string|undefined, tick: number): string => animation==="zoo-v2"?`collect_${skin}_${frame(tick,18,["a","b"])}`:`collect_${skin}`;
export const bubblePopAlive = (takenAt: number, tick: number): boolean => tick-takenAt>=0 && tick-takenAt<6;
export interface HeroVisualClock { grabAt?: number; releaseAt?: number; hangJumpAt?: number; throwAt?: number; catchAt?: number }
/** undefined delegates to the old cells, null explicitly demands the parts rig. */
export const zooHeroCell = (p: {pose:string;charge:number}, tick:number, fistAway:boolean, clock:HeroVisualClock): string|null|undefined => {
  if (p.pose==="hit") return "hero2_hit";
  const age=(n:number|undefined):number=>n===undefined?Infinity:tick-n;
  if (age(clock.catchAt)<6 && !fistAway) return `hero2_catch${Math.floor(age(clock.catchAt)/3)}`;
  if (age(clock.throwAt)<6 && fistAway) return `hero2_throw${Math.floor(age(clock.throwAt)/3)}`;
  if (fistAway) return null;
  if (age(clock.hangJumpAt)<3) return "hero2_hangjump";
  if (age(clock.releaseAt)<3) return "hero2_release";
  if (p.pose==="hang") return age(clock.grabAt)<3?"hero2_grab":`hero2_hang${Math.floor(Math.max(0,(clock.grabAt===undefined?tick:age(clock.grabAt))-3)/24)%2}`;
  if (p.pose==="charge") return `hero2_charge${Math.min(2,Math.floor(p.charge/21))}`;
  return undefined;
};

/** Source sheets are whole registered canvases; every mask shares one rectangle. */
export const zooPropLayers = (skin:string): readonly {stem:string;depth:number}[] => ({
  auto:[{stem:"auto_interior",depth:1.2},{stem:"auto_base",depth:1},{stem:"auto_front",depth:3}],
  bus:[{stem:"bus_interior",depth:1.2},{stem:"bus_base",depth:1},{stem:"bus_roof",depth:3},{stem:"bus_front",depth:3.1}],
  baum:[{stem:"baum_base",depth:1},{stem:"baum_front",depth:3}],
}[skin] ?? [{stem:`${skin}_a`,depth:1}]);
