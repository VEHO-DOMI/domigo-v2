// CODEX DRAFT — NOT CANON · shared authored cell names, without renderer dependencies.
export const ZOO_CELLS: Readonly<Record<string, readonly string[]>> = {
  waertereimer: ["a","b","telegraph0","telegraph1","act0","act1","joy","rest"],
  pinguin_rutscher: ["a","b","brace","slide0","slide1","pop","joy","rest"],
  pinguin: ["a","walk0","walk1","look","joy","rest"],
  hund: ["a","walk0","walk1","walk2","walk3","look","joy","rest"],
  buddy: ["a","walk0","walk1","walk2","walk3","listen","parrot_support0","parrot_support1"],
  papagei: ["a","flap0","flap1","flap2","flap3","land","look","rest"],
  papagei_auto: ["a","flap0","flap1","flap2","flap3","land","look","rest","crouch"],
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
export const ZOO_LION_CELLS = ["walk0", "walk1", "walk2", "walk3", "mark0", "mark1", "cast0", "cast1", "returned", "watch", "listen", "release0", "release1", "follow", "lonely0", "lonely1", "welcome", "lie0", "lie1", "sleep"] as const;
export const zooActorSkin = (skin: string): string => ({ affe:"bus_affe", frosch:"bus_frosch", katze:"bus_katze", aileen:"besucherin_aileen" }[skin] ?? skin);
export const zooActorPoseCells = (skin: string): readonly string[] => skin === "loewe" ? ZOO_LION_CELLS : ZOO_CELLS[zooActorSkin(skin)] ?? ["a"];
