/**
 * R7/N7 · DAS GESETZ DES BERECHNETEN CUTOVERS.
 *
 * Ein Raum, dessen Sicht-Körper jede solide Zelle besitzen, lädt sein Kit nicht
 * mehr. Das ist billig zu behaupten und teuer, wenn es falsch ist: ein Raum, der
 * ein Blatt ZEICHNET, das er nicht mehr LÄDT, zeigt dem Kind ein Loch — und die
 * Blätter werden im selben PR gelöscht, also gäbe es kein Zurück.
 *
 * Diese Tests messen deshalb beides an der echten Welt: dass kein Raum je einen
 * Stem zeichnet, den er nicht lädt, und dass die Rechnung in BEIDE Richtungen
 * kippt — fällt ein Körper weg, ist das Kit sofort wieder Pflicht.
 */
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { COMPOSITION, compositionStems } from "./composition.ts";
import { massKitUsable, phaseIsOneBlock, planMass } from "./mass.ts";

const level = JSON.parse(fs.readFileSync(
  new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json", import.meta.url),
  "utf8",
)) as { chapter: string; phases: Array<{ id: string; rows: string[] }>; arena?: { id: string; rows: string[] }; bonus?: { id: string; rows: string[] } };

const phases = [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])];

/** Die Kit-Stems einer Phase: was die Ein-Block-Rechnung wegnimmt. */
const kitStems = (phaseId: string): string[] => {
  const spec = COMPOSITION.ch01?.[phaseId];
  if (spec === undefined) return [];
  const mit = compositionStems(spec, false);
  const ohne = new Set(compositionStems(spec, true));
  return mit.filter((s) => !ohne.has(s));
};

describe("der berechnete Cutover (N7A1)", () => {
  it("keine Phase zeichnet einen Stem, den sie nicht lädt", () => {
    for (const ph of phases) {
      const spec = COMPOSITION.ch01?.[ph.id];
      if (spec === undefined) continue;
      const geladen = new Set(compositionStems(spec, phaseIsOneBlock(ph.rows, spec.mass)));
      const gezeichnet = new Set(planMass(ph.rows, spec.mass)
        .map((p) => (p as { stem?: unknown }).stem)
        .filter((s): s is string => typeof s === "string"));
      expect({ phase: ph.id, ungeladen: [...gezeichnet].filter((s) => !geladen.has(s)) })
        .toEqual({ phase: ph.id, ungeladen: [] });
    }
  });

  it("eine Ein-Block-Phase plant kein einziges Kit-Stück", () => {
    const einBlock = phases.filter((ph) => {
      const spec = COMPOSITION.ch01?.[ph.id];
      return spec !== undefined && phaseIsOneBlock(ph.rows, spec.mass);
    });
    // Wenn hier nie eine Phase steht, prüft der Test nichts — das wäre still.
    expect(einBlock.length).toBeGreaterThan(0);
    for (const ph of einBlock) {
      const spec = COMPOSITION.ch01?.[ph.id];
      if (spec === undefined) continue;
      const kit = new Set(kitStems(ph.id));
      const geplant = planMass(ph.rows, spec.mass)
        .map((p) => (p as { stem?: unknown }).stem)
        .filter((s): s is string => typeof s === "string" && kit.has(s));
      expect({ phase: ph.id, kitStuecke: geplant }).toEqual({ phase: ph.id, kitStuecke: [] });
      expect(compositionStems(spec, true).some((s) => kit.has(s))).toBe(false);
    }
  });

  it("fällt ein Körper weg, ist das Kit sofort wieder Pflicht", () => {
    const ph = phases.find((p) => {
      const spec = COMPOSITION.ch01?.[p.id];
      return spec !== undefined && phaseIsOneBlock(p.rows, spec.mass);
    });
    expect(ph).toBeDefined();
    if (ph === undefined) return;
    const spec = COMPOSITION.ch01?.[ph.id];
    if (spec === undefined) return;
    const bodies = spec.mass.bodies ?? [];
    expect(bodies.length).toBeGreaterThan(0);
    const ohneEinen = { ...spec.mass, bodies: bodies.slice(1) };
    expect(phaseIsOneBlock(ph.rows, ohneEinen)).toBe(false);
    // …und die Kit-Blätter, die der Cutover löscht, werden wieder verlangt.
    const kit = kitStems(ph.id);
    expect(kit.length).toBeGreaterThan(0);
    const wiederVerlangt = compositionStems(spec, phaseIsOneBlock(ph.rows, ohneEinen));
    for (const stem of kit) expect(wiederVerlangt).toContain(stem);
  });

  it("eine Phase ohne deklarierte Körper ist nie eine Ein-Block-Welt", () => {
    const ph = phases.find((p) => (COMPOSITION.ch01?.[p.id]?.mass.bodies ?? []).length === 0);
    expect(ph).toBeDefined();
    if (ph === undefined) return;
    const spec = COMPOSITION.ch01?.[ph.id];
    if (spec === undefined) return;
    expect(phaseIsOneBlock(ph.rows, spec.mass)).toBe(false);
  });
});

/**
 * DIE WACHE, DIE FAST EIN KAPUTTES SPIEL AUSGELIEFERT HÄTTE.
 *
 * `PaintScene#massKit` fragte nach den KERN-Blättern des Kits und warf die ganze
 * Masse weg, wenn eines fehlte — nach dem Cutover fehlen sie alle, also hätte die
 * Szene p1 UND p2 auf den Platzhalter-Pfad geworfen und AUCH die Körper nicht mehr
 * gezeichnet. Jedes Tor blieb grün: sie messen den Plan, nicht die Wache. Gesehen
 * hat es erst ein Standbild aus dem laufenden Spiel. Diese Tests stellen die Frage
 * jetzt ohne Browser.
 */
describe("massKitUsable — die Wache vor der Masse (N7A1)", () => {
  const einBlockPhase = () => {
    const ph = phases.find((p) => {
      const spec = COMPOSITION.ch01?.[p.id];
      return spec !== undefined && phaseIsOneBlock(p.rows, spec.mass);
    });
    if (ph === undefined) throw new Error("keine Ein-Block-Phase im Kapitel");
    const spec = COMPOSITION.ch01?.[ph.id];
    if (spec === undefined) throw new Error("Phase ohne Manifest");
    return { ph, spec };
  };
  const koerperStems = (spec: { mass: { bodies?: readonly { stem: string; slices?: readonly { stem: string }[] }[] } }): string[] =>
    (spec.mass.bodies ?? []).flatMap((b) => ((b.slices ?? []).length > 0 ? (b.slices ?? []).map((s) => s.stem) : [b.stem]));

  it("★ eine Ein-Block-Welt bleibt benutzbar, obwohl ihr Kit GELÖSCHT ist", () => {
    const { ph, spec } = einBlockPhase();
    const nurKoerper = new Set(koerperStems(spec));
    expect(massKitUsable(ph.rows, spec.mass, (s) => nurKoerper.has(s))).toBe(true);
  });

  it("fehlt ein Körper-Blatt, verweigert die Wache — auch in einer Ein-Block-Welt", () => {
    const { ph, spec } = einBlockPhase();
    const stems = koerperStems(spec);
    expect(stems.length).toBeGreaterThan(0);
    const ohneEines = new Set(stems.slice(1));
    expect(massKitUsable(ph.rows, spec.mass, (s) => ohneEines.has(s))).toBe(false);
  });

  it("eine Kit-Phase wird weiter an ihren Kern-Blättern gemessen", () => {
    const ph = phases.find((p) => {
      const spec = COMPOSITION.ch01?.[p.id];
      return spec !== undefined && !phaseIsOneBlock(p.rows, spec.mass);
    });
    expect(ph).toBeDefined();
    if (ph === undefined) return;
    const spec = COMPOSITION.ch01?.[ph.id];
    if (spec === undefined) return;
    const kern = [spec.mass.crust[0], spec.mass.body[0], spec.mass.fade[0], spec.mass.sediment]
      .filter((s): s is string => s !== undefined);
    expect(massKitUsable(ph.rows, spec.mass, (s) => kern.includes(s))).toBe(true);
    expect(massKitUsable(ph.rows, spec.mass, (s) => kern.slice(1).includes(s))).toBe(false);
  });
});
