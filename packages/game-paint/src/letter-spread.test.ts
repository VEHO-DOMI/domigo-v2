// R5-W4 · B4 · R45 — DER TRAIL DARF NICHT STOTTERN.
//
// Koki, 15.08.2026, über p1: »Zwei O direkt nebeneinander — nicht gut geplant.«
// Sein Bild 07.18.30 zeigt beide plus ein L in einem Blick.
//
// Jeder Tamper hier greift über den INDEX in die Zeile, nie über eine Textsuche
// (eine Suche nach »*« träfe irgendeinen Stern), und jeder prüft zuerst, dass er
// die Zelle wirklich verändert hat. Ein Tamper, der nichts bewegt, beweist
// nichts — er beweist nur, dass der Test blind ist.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { LETTER_MIN_SEPARATION, checkLevelLaws, type PaintLevel, parsePaintLevel } from "./level.ts";
import { letterGlyphs } from "./letters.ts";
import { compositionFor } from "./composition.ts";

const LEVEL_PATH = path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const shipped = (): PaintLevel => JSON.parse(fs.readFileSync(LEVEL_PATH, "utf8")) as PaintLevel;
const allPhasesOf = (l: PaintLevel) => [...l.phases, ...(l.arena ? [l.arena] : []), ...(l.bonus ? [l.bonus] : [])];
const spreadFails = (l: PaintLevel): string[] =>
  checkLevelLaws(parsePaintLevel(l)).filter((f) => f.law === "letter-spread").map((f) => f.detail);

/** Set one cell by INDEX and prove the write landed. */
const poke = (l: PaintLevel, phaseId: string, c: number, r: number, glyph: string): void => {
  const ph = allPhasesOf(l).find((p) => p.id === phaseId);
  if (!ph) throw new Error(`no phase ${phaseId}`);
  const before = ph.rows[r]![c];
  if (before === glyph) throw new Error(`tamper at ${phaseId} (${c},${r}) changes nothing — it already reads "${glyph}"`);
  ph.rows[r] = ph.rows[r]!.slice(0, c) + glyph + ph.rows[r]!.slice(c + 1);
  if (ph.rows[r]![c] !== glyph) throw new Error("tamper did not land");
};

describe("R45 · das ausgelieferte ch01", () => {
  it("stottert nirgends mehr", () => {
    expect(spreadFails(shipped())).toEqual([]);
  });

  it("ein Wort DARF einen Buchstaben zweimal benutzen — nur nicht in einem Atemzug", () => {
    // p9 spells SCHOOLTHINGS: two H, two S, two O. The law must be silent about
    // the far pairs, or it would forbid the word rather than the mistake.
    const p9 = allPhasesOf(shipped()).find((p) => p.id === "p9")!;
    const trail = letterGlyphs(p9.rows, compositionFor("ch01", "p9")?.words);
    const sep = (ch: string): number => {
      const g = trail.filter((x) => x.char === ch);
      expect(g.length, `p9 trägt zwei „${ch}"`).toBe(2);
      return Math.max(Math.abs(g[0]!.c - g[1]!.c), Math.abs(g[0]!.r - g[1]!.r));
    };
    expect(sep("H")).toBe(11);
    expect(sep("S")).toBe(26);
    expect(spreadFails(shipped())).toEqual([]);
  });
});

describe("R45 · die Tamper — Kokis eigene Zellen zurückgelegt", () => {
  it("p1: das O zurück auf die Stufe (29,14) macht das Gesetz rot", () => {
    const l = shipped();
    poke(l, "p1", 24, 16, "."); // lift today's O off the hall floor …
    poke(l, "p1", 29, 14, "*"); // … and put Koki's back on the step
    const f = spreadFails(l);
    expect(f.length, "genau ein Paar, genau das beanstandete").toBe(1);
    expect(f[0]).toMatch(/two „O" sit at \(29,14\) and \(31,11\) — 3 tile\(s\) apart/);
  });

  it("p9: die beiden O zurück auf eine Reihe (18,8)/(20,8) macht das Gesetz rot", () => {
    const l = shipped();
    poke(l, "p9", 17, 6, ".");
    poke(l, "p9", 21, 8, ".");
    poke(l, "p9", 18, 8, "*");
    poke(l, "p9", 20, 8, "*");
    const f = spreadFails(l);
    expect(f.length).toBe(1);
    expect(f[0]).toMatch(/two „O" sit at \(18,8\) and \(20,8\) — 2 tile\(s\) apart/);
  });

  it("DISKRIMINIERT: derselbe Griff eine Spalte weiter bleibt grün", () => {
    // The point of this one: the tamper above must be red because of the
    // DISTANCE, not because the test pokes holes in grids. Same two writes, one
    // column further apart, and the law goes quiet again.
    const l = shipped();
    poke(l, "p9", 17, 6, ".");
    poke(l, "p9", 21, 8, ".");
    poke(l, "p9", 17, 8, "*");
    poke(l, "p9", 21, 6, "*");
    expect(spreadFails(l), "Δc 4 ist erlaubt, Δc 2 nicht").toEqual([]);
  });
});

describe("R45 · die Schwelle ist gemessen, nicht gewählt", () => {
  it("liegt bei 4", () => {
    expect(LETTER_MIN_SEPARATION).toBe(4);
  });

  it("p1 hat Luft, p9 sitzt genau auf der Schwelle (die gefilte Schuld)", () => {
    // p9's Kleckskammer window is five columns wide, so 4 is all it can hold.
    // If a later re-cut widens that crest, this expectation is what will notice.
    const sepOf = (pid: string, ch: string): number => {
      const ph = allPhasesOf(shipped()).find((p) => p.id === pid)!;
      const g = letterGlyphs(ph.rows, compositionFor("ch01", pid)?.words).filter((x) => x.char === ch);
      return Math.max(Math.abs(g[0]!.c - g[1]!.c), Math.abs(g[0]!.r - g[1]!.r));
    };
    expect(sepOf("p1", "O")).toBe(7);
    expect(sepOf("p9", "O")).toBe(LETTER_MIN_SEPARATION);
  });

  it("VAKUITÄT: das Gesetz hat wirklich Buchstaben gesehen", () => {
    // Without this, every green above would also be green on a chapter with no
    // `*` at all, or on a law that silently read an empty trail.
    const counts = allPhasesOf(shipped())
      .map((ph) => letterGlyphs(ph.rows, compositionFor("ch01", ph.id)?.words).length)
      .filter((n) => n > 0);
    expect(counts).toEqual([9, 9, 9, 12]); // p1, p2, p3, p9 — p4 carries none
  });

  it("liest die Zeichen aus derselben Quelle wie der Renderer", () => {
    // A law that re-derived the characters would police a trail nobody plays.
    const src = fs.readFileSync(path.resolve(__dirname, "level.ts"), "utf8");
    expect(src).toContain("const trail = letterGlyphs(ph.rows, trailWordsFor(level, ph.id));");
  });
});
