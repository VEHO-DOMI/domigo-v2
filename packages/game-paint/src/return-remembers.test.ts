// R5-W4 · B4 · F-23 / D-4 — DIE RÜCKKEHR VERGISST NICHTS MEHR.
//
// Koki, 15.08.2026: „Wenn man aus dem Bonuslevel zurückkommt, sind die
// Buchstaben respawned, aber man kann sie nicht mehr einsammeln — einfach nur
// mehr da, stale. Und die Motte oben kann man wieder triggern. Das ist eine
// Kodieraufgabe: die Sachen bleiben erfasst."
//
// Zwei verschiedene Fehler mit demselben Gesicht:
//   · die Buchstaben waren ein RENDERER-Fehler — die Sim hat die geholten Zellen
//     immer schon übersprungen, der Szenen-Aufbau las das rohe Grid;
//   · die Falter waren ein LEDGER-Loch — es gab schlicht keine Liste für Wesen,
//     also war die bezahlte Tür ein Reset-Knopf (D-4).
//
// Jeder Test hier fährt die Rückkehr als das, was sie ist: die Welt wird
// komplett neu gebaut, und nur was im Hauptbuch steht, gilt danach noch.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { Sim, type SimEvent } from "./sim.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { COLOUR_FLOOD_TICKS } from "./anim.ts";
import type { PaintLevel } from "./level.ts";

const LEVEL_PATH = path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const level = JSON.parse(fs.readFileSync(LEVEL_PATH, "utf8")) as PaintLevel;

/** A mount of p2, exactly the way PaintGame builds one. */
const mount = (ledger: { resolved?: string[]; takenCells?: string[] } = {}): Sim =>
  new Sim({
    level,
    phaseId: "p2",
    grantedAbilities: () => ["jump", "run"],
    freedCageIds: () => [],
    resolvedEntityIds: () => ledger.resolved ?? [],
    letterLedger: () => ({ takenCells: ledger.takenCells ?? [], purse: 0, found: 0 }),
  });

const MOTH = "p2-moths-1";
const DESK = "p2-obj-desk";
const entOf = (sim: Sim, id: string) => sim.world.entities.find((e) => e.id === id)!;

/** Walk the child onto a being and collect what the sim says about it. */
const askAt = (sim: Sim, id: string, ticks = 400): SimEvent[] => {
  const e = entOf(sim, id);
  sim.warp(Math.round(e.x / 256 / 16), Math.round(e.y / 256 / 16));
  const pad: Pad = { ...IDLE_PAD };
  const all: SimEvent[] = [];
  for (let i = 0; i < ticks; i++) all.push(...sim.step(pad));
  return all;
};

describe("F-23 · die Buchstaben stehen nicht mehr stale herum", () => {
  it("die Sim hat es immer schon gewusst — sie spawnt eine geholte Zelle nicht", () => {
    // The baseline the renderer bug hid behind: this was never broken.
    const fresh = mount();
    const taken = [...fresh.letterCells][0]!;
    const back = mount({ takenCells: [taken] });
    expect(fresh.letterCells.has(taken)).toBe(true);
    expect(back.letterCells.has(taken), "eine geholte Zelle kommt nicht zurück").toBe(false);
    expect(back.lettersTotal, "…sie zählt aber weiter zum Nenner").toBe(fresh.lettersTotal);
  });

  it("★ der Szenen-Aufbau fragt jetzt die Sim statt des Grids", () => {
    // The one-line fix, policed at its source. `buildProps` walks the raw grid,
    // so without this guard it paints every letter the level ever had — which is
    // precisely what Koki saw: letters back, none of them collectable, because
    // the sprites only disappear on a LIVE `letterTaken` a remount never replays.
    const src = fs.readFileSync(path.resolve(__dirname, "PaintScene.ts"), "utf8");
    expect(src).toContain("if (!this.sim.letterCells.has(`${c},${r}`)) continue;");
    // vacuity: the guard must sit INSIDE the `*` arm, not somewhere harmless
    const star = src.slice(src.indexOf('} else if (g === "*") {'), src.indexOf('} else if (g === "X"'));
    expect(star).toContain("this.sim.letterCells.has");
    expect(star).toContain("this.letterImgs.set");
  });
});

describe("D-4 · ein Falter, der schon gefragt hat, fragt nicht wieder", () => {
  it("ROT OHNE HAUPTBUCH: die frische Welt fragt (das ist der Bug)", () => {
    const sim = mount(); // no ledger — the old behaviour after a bonus trip
    expect(entOf(sim, MOTH).redeemed, "frisch gespawnt = unbeantwortet").toBe(false);
    const evs = askAt(sim, MOTH);
    expect(evs.some((e) => e.type === "task" && e.req.ctx.type === "entity" && e.req.ctx.id === MOTH)).toBe(true);
  });

  it("★ MIT HAUPTBUCH: derselbe Falter schweigt", () => {
    const sim = mount({ resolved: [MOTH] });
    expect(entOf(sim, MOTH).redeemed).toBe(true);
    const evs = askAt(sim, MOTH);
    expect(evs.some((e) => e.type === "task" && e.req.ctx.type === "entity" && e.req.ctx.id === MOTH)).toBe(false);
  });

  it("…und die Nachbar-Motte fragt sehr wohl (das Hauptbuch ist kein Stummschalter)", () => {
    const sim = mount({ resolved: [MOTH] });
    const evs = askAt(sim, "p2-moths-2");
    expect(evs.some((e) => e.type === "task" && e.req.ctx.type === "entity" && e.req.ctx.id === "p2-moths-2")).toBe(true);
  });
});

describe("D-4 · ein restauriertes Ding steht farbig, nicht noch einmal im Anlauf", () => {
  it("die Farbflut ist ABGELAUFEN, nicht neu gestartet", () => {
    // `redeemEntity` sets freedTick = 0 on purpose: the flood is the REWARD, and
    // it has already been watched. Replaying it would celebrate on arrival.
    const sim = mount({ resolved: [DESK] });
    const desk = entOf(sim, DESK);
    expect(desk.redeemed).toBe(true);
    expect(desk.freedTick, "die Flut steht am Ende, nicht am Anfang").toBe(COLOUR_FLOOD_TICKS);
  });

  it("die Ruhepose passt zur Rolle", () => {
    // A moth flies a lap of joy and settles in "rest"; a desk never leaves its
    // cell and ends "dazed". Both END states, never the opening beat.
    expect(entOf(mount({ resolved: [MOTH] }), MOTH).state).toBe("rest");
    expect(entOf(mount({ resolved: [DESK] }), DESK).state).toBe("dazed");
  });

  it("ein weggeschickter Bleistift bleibt weg", () => {
    const sim = mount({ resolved: ["p2-pen"] });
    expect(entOf(sim, "p2-pen").redeemed).toBe(true);
    const evs = askAt(sim, "p2-pen");
    expect(evs.some((e) => e.type === "task" && e.req.ctx.type === "entity" && e.req.ctx.id === "p2-pen")).toBe(false);
  });
});

describe("D-4 · die Kette trägt bis zur Hülle", () => {
  it("das Lösen meldet die ID — vorher war es nur ein „Danke!“", () => {
    const sim = mount();
    const evs = sim.solveTask({ type: "entity", id: MOTH, skin: "moths" });
    const resolved = evs.find((e) => e.type === "entityResolved");
    expect(resolved, "ohne dieses Ereignis erfährt die Hülle nie davon").toBeDefined();
    expect(resolved).toMatchObject({ id: MOTH, role: "swarm" });
  });

  it("ein Wächter wird NICHT ins Hauptbuch geschrieben", () => {
    // The guardian branch is deliberately inert (a chalk hit unties nothing), so
    // it must not leak an id either — a ledgered boss would arrive already beaten.
    const arena = level.arena!;
    const g = arena.entities.find((e) => e.role === "guardian");
    if (!g) return;
    const asim = new Sim({ level, phaseId: arena.id, grantedAbilities: () => ["jump", "run"], freedCageIds: () => [] });
    const evs = asim.solveTask({ type: "entity", id: g.id, skin: g.skin });
    expect(evs.some((e) => e.type === "entityResolved")).toBe(false);
  });

  it("★ DIE GANZE RUNDREISE: p2 → Kammer → p2, und nichts ist zurückgesetzt", () => {
    // The end-to-end shape of Koki's complaint, driven through the SAME ledger
    // the shell keeps — a tiny stand-in for PaintGame's refs, with its callbacks
    // copied verbatim in spirit. This is the D-23 return band as an engine test;
    // the proof-FILE still carries one tape per phase, which stays open.
    const shell = { resolved: [] as string[], taken: new Map<string, string[]>() };
    const mountP2 = (): Sim =>
      new Sim({
        level,
        phaseId: "p2",
        grantedAbilities: () => ["jump", "run"],
        freedCageIds: () => [],
        resolvedEntityIds: () => shell.resolved,
        letterLedger: () => ({ takenCells: shell.taken.get("p2") ?? [], purse: 0, found: 0 }),
      });
    const record = (evs: SimEvent[]): void => {
      for (const ev of evs) {
        if (ev.type === "entityResolved" && !shell.resolved.includes(ev.id)) shell.resolved.push(ev.id);
        if (ev.type === "letterTaken") {
          const cur = shell.taken.get("p2") ?? [];
          const key = `${ev.c},${ev.r}`;
          if (!cur.includes(key)) shell.taken.set("p2", [...cur, key]);
        }
      }
    };

    // ── leg 1: the child answers two beings and takes a letter ──────────────
    const before = mountP2();
    const lettersAtStart = before.letterCells.size;
    for (const id of [MOTH, DESK]) record(before.solveTask({ type: "entity", id, skin: "x" }));
    const cell = [...before.letterCells][0]!;
    record([{ type: "letterTaken", c: Number(cell.split(",")[0]), r: Number(cell.split(",")[1]) }]);

    expect(shell.resolved).toEqual([MOTH, DESK]);
    expect(shell.taken.get("p2")).toEqual([cell]);

    // ── leg 2: pay Klecks, play the chamber, come back ──────────────────────
    // The bonus room deliberately serves its OWN letters again (D-5 = Option A),
    // so it may not disturb the host phase's books.
    const chamber = new Sim({
      level, phaseId: "p9", grantedAbilities: () => ["jump", "run"], freedCageIds: () => [],
      resolvedEntityIds: () => shell.resolved,
      letterLedger: () => ({ takenCells: shell.taken.get("p9") ?? [], purse: 0, found: 0 }),
    });
    expect(chamber.letterCells.size, "die Kleckskammer serviert ihre zwölf immer neu").toBe(12);

    const after = mountP2();

    // ── the verdict: everything the child did is still done ─────────────────
    expect(entOf(after, MOTH).redeemed, "der Falter fragt nicht wieder").toBe(true);
    expect(entOf(after, DESK).redeemed, "das Ding bleibt restauriert").toBe(true);
    expect(entOf(after, DESK).freedTick, "…und feiert es nicht noch einmal").toBe(COLOUR_FLOOD_TICKS);
    expect(after.letterCells.has(cell), "der geholte Buchstabe kommt nicht zurück").toBe(false);
    expect(after.letterCells.size, "genau einer weniger, kein Kahlschlag").toBe(lettersAtStart - 1);
    expect(after.lettersTotal, "der Nenner bleibt der Nenner").toBe(before.lettersTotal);
    // …and what the child did NOT do is still waiting for them
    expect(entOf(after, "p2-moths-2").redeemed, "die unbeantwortete Motte wartet weiter").toBe(false);
  });

  it("alle vier Glieder sind verdrahtet (die Weiterreich-Zeile ist die stille Falle)", () => {
    const scene = fs.readFileSync(path.resolve(__dirname, "PaintScene.ts"), "utf8");
    const shell = fs.readFileSync(path.resolve(__dirname, "PaintGame.tsx"), "utf8");
    expect(scene).toContain("resolvedEntityIds?: () => readonly string[];");
    expect(scene).toContain("resolvedEntityIds: cfg.resolvedEntityIds,"); // ← the one that fails silently
    expect(scene).toContain('case "entityResolved": cb.onEntityResolved?.(ev.id, ev.role); break;');
    expect(shell).toContain("resolvedEntityIds: () => resolvedEntitiesRef.current,");
    expect(shell).toContain("onEntityResolved: (id) => {");
  });
});
