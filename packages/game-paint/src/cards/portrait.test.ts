// R5-W4 · D3 · F-14 · R54 — WHAT THE CAGE PORTRAIT SHOWS.
//
// Koki, replay of 15 August: „beim Käfig zeigt das Bild immer noch die
// Schultasche, nicht die Musikanlage … das Bild soll zeigen, was drin ist."
//
// All four object cages in ch01 wear the one `satchel` shell, and all four
// rescue cards declare that shell as their stimulus — so the sound system, the
// tablet, the chair and the class photo were the same picture. The world has
// not had that problem since A5: each cage carries a `captive` key and the
// occupant is drawn behind the bars. The card simply never asked.
//
// This suite runs against the SHIPPED level and the SHIPPED art directory, not
// against a fixture, because the failure this packet is closing was precisely a
// card whose picture and whose data disagreed — a fixture would have agreed
// with either one of them.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { KLASSENFOTO_STEM, cageCellFor, freeCellsFor } from "./CardShell.tsx";
import { classmateFreeStem, classmateStem } from "../artManifest.ts";
import { domArtStems } from "../artScope.ts";

const ROOT = path.resolve(__dirname, "../../../..");
type Ent = { id: string; role: string; skin: string; params?: Record<string, unknown> };
type Phase = { entities: Ent[] };
const level = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"), "utf8"),
) as { phases: Phase[]; arena?: Phase; bonus?: Phase };

const artDir = path.join(ROOT, "apps/web/public/art/g1/paint/ch01");
const onDisk = new Set(fs.readdirSync(artDir).filter((f) => f.endsWith(".png")).map((f) => f.replace(/\.png$/, "")));

// EVERY phase, the way `PaintGame.allPhasesOf` counts them: the class-photo cage
// stands in the arena, not in `phases`, and a sweep that reads only `phases`
// reports four cages and misses the fifth. (It did, on this suite's first run.)
const allPhases: Phase[] = [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])];
const cages = allPhases.flatMap((p) => p.entities).filter((e) => e.role === "cage");

describe("R5-W4 · D3 · the cage portrait names its occupant", () => {
  it("the chapter still has the five cages this packet was written against", () => {
    // an absence claim is worth nothing without the count beside it
    expect(cages.length).toBe(5);
    expect(cages.filter((c) => c.params?.classmate !== undefined).length).toBe(1);
    expect(cages.filter((c) => typeof c.params?.captive === "string").length).toBe(4);
  });

  it("every thing-cage resolves to a captive sheet that is actually on disk", () => {
    const things = cages.filter((c) => c.params?.classmate === undefined);
    expect(things.length).toBe(4);
    for (const c of things) {
      const stem = cageCellFor(c.params?.captive as string | undefined);
      expect(stem, `${c.id} has no captive key`).toBeDefined();
      expect(onDisk.has(stem!), `${c.id} names ${stem}, which is not painted`).toBe(true);
    }
    // and they are four DIFFERENT pictures — the whole point of the finding
    const stems = new Set(things.map((c) => cageCellFor(c.params?.captive as string | undefined)));
    expect(stems.size).toBe(4);
  });

  it("the person-cage resolves to her caged pose, not to a captive sheet", () => {
    const person = cages.find((c) => c.params?.classmate !== undefined)!;
    const stem = cageCellFor(person.params?.classmate as string, true);
    expect(stem).toBe("merle_caged0");
    expect(onDisk.has(stem!)).toBe(true);
    // L0 · D7 · WAS DIESEN FALL FRÜHER TRUG UND JETZT NICHT MEHR: bis zur
    // Level-Welle stand hier `expect(CAPTIVE_KEYS).not.toContain("merle")` —
    // die Person war eine Person, WEIL ihr Name nicht in einer geschlossenen
    // Vierer-Liste stand. Diese Liste ist jetzt offen (jedes Kapitel bringt
    // eigene Insassen mit), also trägt den Fall das, was ihn immer getragen
    // hat: das FELD, in dem der Name steht. Der Käfig, der `classmate` führt,
    // führt kein `captive` — und genau das prüft die Zeile hier.
    expect(person.params?.captive).toBeUndefined();
    // …und die Gegenprobe: ohne das Flag ginge sie durch den Ding-Pfad, was
    // die Karte auf ein Blatt schicken würde, das es nicht gibt.
    expect(cageCellFor(person.params?.classmate as string)).toBe("captive_merle");
    expect(onDisk.has("captive_merle")).toBe(false);
  });

  it("names nothing when there is nothing to name", () => {
    expect(cageCellFor(undefined)).toBeUndefined();
    expect(cageCellFor("")).toBeUndefined();
  });

  // ── R5-W5 · C4 · D-228 · ONE SOURCE FOR THE PERSON-CAGE CELL ───────────────
  //
  // The person half of this helper used to be a bare `${name}_caged0` template
  // typed here — the only written copy of a convention the SCENE needs the
  // moment the person-cage grows its occupant layer (PaintScene, C3's measured
  // stop at `buildEntityImgs`). Two spellings of one naming law are two laws:
  // W3 proved it on `BANNED_DE`, where the two copies had already drifted apart
  // by a whole entry (D-123/D-251). So the law lives in artManifest now, and
  // these two cases keep it there — the second one reads this file's SOURCE,
  // because a literal that comes back is not something a value test can see.
  it("the person-cage cell comes from artManifest, not from a second spelling", () => {
    expect(cageCellFor("merle", true)).toBe(classmateStem("merle"));
    expect(cageCellFor("aardvark", true)).toBe(classmateStem("aardvark"));
  });

  it("CardShell spells no cage-cell convention of its own", () => {
    const src = fs.readFileSync(path.join(__dirname, "CardShell.tsx"), "utf8");
    // comments explain the law; only CODE may not re-state it
    const code = src
      .split("\n")
      .filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l))
      .join("\n");
    // the tamper this guard was built against: `${name}_caged0` back in the body
    expect(code, "a `_caged0` literal is back in CardShell — D-228 says the stem convention lives in artManifest.classmateStem")
      .not.toMatch(/_caged\d/);
    // …and the guard must be able to SEE such a literal: the same search finds
    // the one this file itself writes, so a silently-empty read cannot pass.
    expect(fs.readFileSync(__filename, "utf8")).toMatch(/merle_caged0/);
  });

  it("R5-W6b · D4 · D-285 · CardShell spells no FREE-cell convention of its own either", () => {
    const src = fs.readFileSync(path.join(__dirname, "CardShell.tsx"), "utf8");
    const code = src
      .split("\n")
      .filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l))
      .join("\n");
    // die Klasse, die D-228 für die KÄFIG-Zelle geschlossen hat, eine Zeile weiter:
    // `${name}_a` stand bis heute im Rumpf von `freeCellsFor`. Der Tamper, gegen den
    // dieser Wächter gebaut ist, ist genau diese Schablone zurück im Code.
    expect(code, "eine `${name}_a`-Schablone ist zurück in CardShell — die Konvention lebt in artManifest.classmateFreeStem")
      .not.toMatch(/\$\{name\}_a/);
    expect(freeCellsFor("merle", true)).toEqual([classmateFreeStem("merle")]);
    // …und der Wächter kann so eine Schablone auch SEHEN: die Zeile hier drüber
    // steht als Text in dieser Datei, ein stiller Leerlauf käme nicht durch.
    expect(fs.readFileSync(__filename, "utf8")).toMatch(/\$\{name\}_a/);
  });

  it("a key the art has not landed for still resolves — presence is asked later", () => {
    // the keen-art law: this helper answers WHICH cell, never WHETHER it exists,
    // so a chapter whose art is still in the oven degrades at the art map and
    // not here (the card falls back to the bare shell).
    expect(cageCellFor("aardvark", true)).toBe("aardvark_caged0");
    expect(onDisk.has("aardvark_caged0")).toBe(false);
  });
});

// ── R5-W4b · D3b · R54 · …AND WHAT THE CEREMONY SHOWS ────────────────────────
//
// Koki, same replay: „Merle-Erfolgskarte: altes Bild, sie sitzt noch im Käfig —
// wir haben sie doch befreit." The rescue panel drew `${skin}_a`, i.e. the cage
// SHELL, so every one of the five rescues celebrated with a picture of a closed
// bag. The mirror of `cageCellFor` answers the other half of the same question,
// and these laws are what keep the two halves from drifting apart again.
describe("R5-W4b · D3b · the ceremony shows the occupant WITHOUT its cage", () => {
  it("every thing-cage has a free cell that is painted and is NOT the caged one", () => {
    const things = cages.filter((c) => c.params?.classmate === undefined);
    expect(things.length).toBe(4);
    for (const c of things) {
      const key = c.params?.captive as string;
      const free = freeCellsFor(key);
      expect(free.length, `${c.id} names no free cell`).toBeGreaterThan(0);
      // at least one candidate is on disk — otherwise the ceremony would fall
      // back to the grey captive sheet and Koki's finding would stand
      expect(free.some((s) => onDisk.has(s)), `${c.id}: none of ${free.join(" / ")} is painted`).toBe(true);
      // and it is a DIFFERENT picture from the cage portrait's
      expect(free).not.toContain(cageCellFor(key));
    }
  });

  it("the classmate is celebrated FREE — merle_a, never merle_caged0", () => {
    const person = cages.find((c) => c.params?.classmate !== undefined)!;
    const free = freeCellsFor(person.params?.classmate as string, true);
    expect(free).toEqual(["merle_a"]);
    expect(onDisk.has("merle_a")).toBe(true);
    // the exact confusion this law exists to prevent
    expect(free).not.toContain(cageCellFor(person.params?.classmate as string, true));
  });

  it("the class photo asks for its own sheet first and falls back to the world's", () => {
    // `klassenfoto_a` is the AQ14 delivery, sent back to the painter this
    // session by a blind sheet check; `obj_picture` is the photo the chapter
    // already has and is what draws until the repaint lands. Order matters: the
    // day the new sheet arrives it must win without a code change.
    expect(freeCellsFor("picture")).toEqual([KLASSENFOTO_STEM, "obj_picture"]);
    expect(freeCellsFor("picture").some((s) => onDisk.has(s))).toBe(true);
  });

  it("names nothing when there is nothing to name", () => {
    expect(freeCellsFor(undefined)).toEqual([]);
    expect(freeCellsFor("")).toEqual([]);
  });

  it("every free cell the ceremony can draw is CLAIMED, so the art audit stays honest", () => {
    // The audit counts a painted sheet that nothing loads as dead art. Three of
    // these were on that list („bezahlt, unverdrahtet") until this packet drew
    // them; a claim that lags the wiring makes the count lie in the safe
    // direction, which is still a lie.
    const claimed = domArtStems(level as never);
    const drawn = cages.flatMap((c) =>
      freeCellsFor((c.params?.classmate ?? c.params?.captive) as string | undefined,
        c.params?.classmate !== undefined));
    for (const s of drawn) {
      if (!onDisk.has(s)) continue; // not landed yet — nothing to claim
      expect(claimed.has(s), `${s} is drawn on a card but not claimed in domArtStems`).toBe(true);
    }
  });
});
