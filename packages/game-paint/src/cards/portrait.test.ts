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
import { cageCellFor } from "./CardShell.tsx";
import { CAPTIVE_KEYS } from "../artManifest.ts";

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
    const stem = cageCellFor(person.params?.classmate as string);
    expect(stem).toBe("merle_caged0");
    expect(onDisk.has(stem!)).toBe(true);
    // she must NOT be routed through the thing-path: `merle` is not a captive key
    expect(CAPTIVE_KEYS as readonly string[]).not.toContain("merle");
  });

  it("names nothing when there is nothing to name", () => {
    expect(cageCellFor(undefined)).toBeUndefined();
    expect(cageCellFor("")).toBeUndefined();
  });

  it("a key the art has not landed for still resolves — presence is asked later", () => {
    // the keen-art law: this helper answers WHICH cell, never WHETHER it exists,
    // so a chapter whose art is still in the oven degrades at the art map and
    // not here (the card falls back to the bare shell).
    expect(cageCellFor("aardvark")).toBe("aardvark_caged0");
    expect(onDisk.has("aardvark_caged0")).toBe(false);
  });
});
