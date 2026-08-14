// R5-W3 · A5 · D-48 · THE SIZE OF A BEING IS ONE NUMBER, IN ONE PLACE.
//
// Two defects live behind this file, and they are the same defect twice.
//
// The first cost a whole visibility proof: `GUARDIAN_DISPLAY_H` was private to
// PaintScene, so `guardian-flight.test.ts` carried its own copy — 52 against a
// shipped 68 — and spent months proving a body 16 px shorter than the drawn one.
// The fix moved the constant to `anim.ts`. It did not move the TABLE, so every
// other role kept the same hazard.
//
// The second is D-48, one role down: the four `satchel` cages drew 22 px, and at
// 22 px a 347×480 painting keeps its outline and loses everything inside it —
// the sound system, the tablet, the chair and the class photo were one picture.
// Three art rounds were commissioned before anyone measured the size.
//
// So the table moved too, and these tests hold it there.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CAGE_DISPLAY_H, GUARDIAN_DISPLAY_H, entDisplayArea, entDisplayH } from "./anim.ts";
import { CAPTIVE_KEYS, captiveStem, isCaptiveKey } from "./artManifest.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../..");
const LEVEL = path.join(REPO, "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");

interface Ent { id: string; role: string; skin: string; params?: Record<string, unknown> }
const level = JSON.parse(fs.readFileSync(LEVEL, "utf8")) as {
  phases: Array<{ id: string; entities: Ent[] }>;
  arena?: { id: string; entities: Ent[] } | null;
  bonus?: { id: string; entities: Ent[] } | null;
};
// the REAL chapter, every room of it — a cage added tomorrow is covered by these
// laws without anyone remembering to add it here
const everyEntity: Ent[] = [
  ...level.phases.flatMap((p) => p.entities),
  ...(level.arena?.entities ?? []),
  ...(level.bonus?.entities ?? []),
];
const cages = everyEntity.filter((e) => e.role === "cage");

describe("D-48 · every cage is drawn at one size", () => {
  it("the chapter actually has cages (this suite cannot pass vacuously)", () => {
    expect(cages.length).toBeGreaterThanOrEqual(5);
  });

  it("every cage in the shipped chapter draws CAGE_DISPLAY_H", () => {
    for (const e of cages) expect(entDisplayH(e), `${e.id} (${e.skin})`).toBe(CAGE_DISPLAY_H);
  });

  it("a cage is never drawn smaller than the child it could hold", () => {
    // the person-cage was raised to 34 for exactly this reason (PK-R6 · H2); the
    // object-cages inherited the number rather than a second argument
    expect(CAGE_DISPLAY_H).toBeGreaterThanOrEqual(entDisplayH({ role: "classmate", skin: "merle" }));
  });

  it("the size table still answers for every role the chapter ships", () => {
    for (const e of everyEntity) expect(entDisplayH(e), `${e.id} (${e.role})`).toBeGreaterThan(0);
  });

  it("area is height × the sheet's own aspect, so a wide being outweighs a tall one", () => {
    const wide = entDisplayArea({ role: "cage", skin: "satchel" }, { w: 480, h: 240 });
    const tall = entDisplayArea({ role: "cage", skin: "satchel" }, { w: 240, h: 480 });
    expect(wide).toBeGreaterThan(tall);
    expect(wide / tall).toBeCloseTo(4, 5);
  });

  it("the guardian's height is still the one anim.ts owns", () => {
    expect(entDisplayH({ role: "guardian", skin: "tafel" })).toBe(GUARDIAN_DISPLAY_H);
  });
});

describe("D-48 · every cage says who is inside it", () => {
  // A cage holds a PERSON or a THING, never both, and the two are told apart by
  // which pointer the level declares: `classmate` for Merle, `captive` for the
  // four objects. Merle needs no silhouette — she is a being of her own, and the
  // cage she is in is the only one whose occupant walks out.
  const objectCages = cages.filter((e) => typeof e.params?.classmate !== "string");

  it("the chapter has both kinds, so neither branch is untested", () => {
    expect(objectCages.length).toBe(4);
    expect(cages.length - objectCages.length).toBe(1);
  });

  it("a cage holding a THING declares the machine key beside the German name", () => {
    for (const e of objectCages) {
      const de = e.params?.captiveDe;
      expect(typeof de, `${e.id} has no captiveDe`).toBe("string");
      expect(isCaptiveKey(e.params?.captive), `${e.id} names „${String(de)}" but declares captive=${String(e.params?.captive)}`).toBe(true);
    }
  });

  it("a cage holding a PERSON declares no captive key — she is not a silhouette", () => {
    for (const e of cages.filter((c) => typeof c.params?.classmate === "string")) {
      expect(e.params?.captive, `${e.id} holds ${String(e.params?.classmate)} and also declares a captive key`).toBeUndefined();
    }
  });

  it("no two cages in one chapter hold the same thing", () => {
    const keys = cages.map((e) => e.params?.captive).filter(isCaptiveKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("every declared captive has a stem, and every stem a key", () => {
    for (const k of CAPTIVE_KEYS) expect(captiveStem(k)).toBe(`captive_${k}`);
    // the prefix is load-bearing: `satchel_*` would be swept into every phase
    // holding a satchel cage by artScope's skin closure
    for (const k of CAPTIVE_KEYS) expect(captiveStem(k).startsWith("satchel")).toBe(false);
  });
});

describe("D-48 · the scene keeps no second copy of the table", () => {
  const src = fs.readFileSync(path.join(HERE, "PaintScene.ts"), "utf8");
  const body = src.slice(src.indexOf("private entTargetH"), src.indexOf("private entTargetH") + 400);

  it("entTargetH delegates instead of deciding", () => {
    expect(body).toContain("entDisplayH");
    expect(/return\s+\d+/.test(body), "entTargetH still returns a literal height").toBe(false);
  });

  it("the drained-height table lives in anim.ts, not in the scene", () => {
    expect(src.includes("const DRAINED_H"), "a second height table is back in PaintScene").toBe(false);
  });
});
