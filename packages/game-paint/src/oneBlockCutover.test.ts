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
import { claimedPlatformCells, massKitUsable, phaseIsOneBlock, planMass } from "./mass.ts";
import { isSlope, isSolid } from "./collide.ts";
import { P3_WAVE_BODIES, bodyCells, bodyPartitionErrors, bodySlopeCells } from "./visualBodies.ts";

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

/**
 * ★ N7A2c · DIE KREIDE-RUTSCHE IST GEMALT.
 *
 * N7A2 hielt die Schraege frei, weil kein Gesetz sie verlangte; N7A2c malt sie,
 * weil fuenf zusammengesetzte Eckstuecke in einer Ein-Block-Welt als Fremdkoerper
 * lesen (Kokis Befund 03.09., R264). Die Tests dieses Blocks behaupteten bis
 * gestern das Gegenteil — sie sind UMGEDREHT, nicht geloescht: ein Test, der eine
 * Uebergangs-Entscheidung festnagelt, wird zur Behauptung ueber die Zukunft, und
 * die Geschichte gehoert an dieselbe Stelle wie die Zusicherung.
 *
 * Was NICHT gekippt ist: `z` bleibt eine Schraege, nicht solide. Die Kollision ist
 * unveraendert, das Kind rutscht wie zuvor, und `fullyPainted` fragt weiterhin nur
 * nach soliden Zellen (493 + 17 Moebel = 510). Neu ist allein, dass das BILD die
 * Rampe traegt — und dass der Motor in p3 kein Bausatz-Teil mehr zeichnet.
 */
describe("die Kreide-Rutsche und der p3-Cutover (N7A2c)", () => {
  const p3 = phases.find((p) => p.id === "p3");
  const zZellen = (rows: readonly string[]): string[] => {
    const out: string[] = [];
    rows.forEach((row, r) => { for (let c = 0; c < row.length; c++) if (row[c] === "z") out.push(`${c},${r}`); });
    return out;
  };

  it("`z` ist eine Schraege und keine solide Zelle — der Cutover verlangt sie nie", () => {
    expect(isSolid("z")).toBe(false);
    expect(isSlope("z")).toBe(true);
  });

  it("die sechs Koerper partitionieren p3: 493 solide + 17 Moebel = 510, dazu 5 gemalte Schraegen", () => {
    expect(p3).toBeDefined();
    if (p3 === undefined) return;
    const moebel = claimedPlatformCells(p3.rows, [], new Set());
    const koerper = P3_WAVE_BODIES.reduce((n, b) => n + bodyCells(b).length, 0);
    const schraegen = P3_WAVE_BODIES.reduce((n, b) => n + bodySlopeCells(b).length, 0);
    const solide = p3.rows.join("").split("").filter((g) => isSolid(g)).length;
    expect({ solide, koerper, schraegen, moebel: moebel.size }).toEqual({ solide: 510, koerper: 493, schraegen: 5, moebel: 17 });
    expect(bodyPartitionErrors(p3.rows, P3_WAVE_BODIES, { fullyPainted: true, otherClaimed: moebel })).toEqual([]);
  });

  it("die fuenf z-Zellen gehoeren der WESTTERRASSE — frueher gehoerten sie keinem Koerper", () => {
    expect(p3).toBeDefined();
    if (p3 === undefined) return;
    const west = P3_WAVE_BODIES.find((b) => b.id === "p3_westterrasse_rutsche");
    expect(west).toBeDefined();
    if (west === undefined) return;
    const besitz = new Set(bodySlopeCells(west).map(({ c, r }) => `${c},${r}`));
    const zs = zZellen(p3.rows);
    expect(zs).toHaveLength(5);
    expect(zs.filter((k) => !besitz.has(k))).toEqual([]);
    // …und jede von ihnen traegt in der Maske GENAU ihr Grid-Glyph, nicht bloss
    // irgendeine Schraege: das ist die Haelfte des Gesetzes, die Drift faengt.
    expect(bodySlopeCells(west).map((s) => s.glyph)).toEqual(["z", "z", "z", "z", "z"]);
  });

  it("TAMPER: eine Masken-Zelle ueber LUFT ist weiterhin rot", () => {
    expect(p3).toBeDefined();
    if (p3 === undefined) return;
    const west = P3_WAVE_BODIES.find((b) => b.id === "p3_westterrasse_rutsche");
    expect(west).toBeDefined();
    if (west === undefined) return;
    // Die Zelle rechts der obersten Stufe ist im Gitter Luft. Sie als solide
    // Pflicht-Zelle zu beanspruchen muss dieselbe Meldung geben wie vorher —
    // das neue Gesetz macht die Maske breiter, nicht laxer.
    const kaputt = { ...west, rows: west.rows.map((row, i) => i === 0 ? `${row.slice(0, 11)}#${row.slice(12)}` : row) };
    const fehler = bodyPartitionErrors(p3.rows, [kaputt], {});
    expect(fehler.some((e) => e.includes("(11,15) ist im Grid nicht solide"))).toBe(true);
  });

  it("TAMPER: eine Schraegen-Zelle ueber einer SOLIDEN Zelle ist rot", () => {
    expect(p3).toBeDefined();
    if (p3 === undefined) return;
    const west = P3_WAVE_BODIES.find((b) => b.id === "p3_westterrasse_rutsche");
    expect(west).toBeDefined();
    if (west === undefined) return;
    // Die Gegenrichtung: die Maske behauptet eine Rampe, wo das Gitter Masse hat.
    // Ohne diesen Fall koennte die Maske Schraegen erfinden, wo keine sind.
    const kaputt = { ...west, rows: west.rows.map((row, i) => i === 0 ? `z${row.slice(1)}` : row) };
    const fehler = bodyPartitionErrors(p3.rows, [kaputt], {});
    expect(fehler.some((e) => e.includes(`(0,15) ist in der Maske die Schräge "z", im Grid aber "#"`))).toBe(true);
  });

  it("der Bausatz ist in Rente — kein Raum fuehrt noch ein slide_*-Blatt", () => {
    for (const [phaseId, spec] of Object.entries(COMPOSITION.ch01 ?? {})) {
      expect(spec.mass.slide, `${phaseId} deklariert noch ein Rutschen-Kit`).toBeUndefined();
      const geladen = compositionStems(spec, phaseIsOneBlock(phases.find((p) => p.id === phaseId)?.rows ?? [], spec.mass));
      for (const stem of ["slide_top", "slide_mid", "slide_foot", "slide_under"]) {
        expect(geladen, `${phaseId} laedt ${stem}`).not.toContain(stem);
      }
    }
  });

  it("der Motor zeichnet in p3 KEIN Rutschen-Modul mehr (frueher fuenf)", () => {
    const spec = COMPOSITION.ch01?.p3;
    expect(p3).toBeDefined();
    expect(spec).toBeDefined();
    if (p3 === undefined || spec === undefined) return;
    const module = planMass(p3.rows, spec.mass)
      .filter((p) => p.kind === "slideTop" || p.kind === "slideMid" || p.kind === "slideFoot" || p.kind === "slideUnder");
    expect(module.length).toBe(0);
  });
});

/**
 * ★ N7A2c · DAS GESETZ AUS R264, MASCHINELL.
 *
 * „Ein Raum ist erst Ein-Block, wenn KEIN Bausatz-Teil mehr in ihm gezeichnet
 * wird." Der berechnete Cutover allein sagt das NICHT: er fragt, ob die
 * Sicht-Koerper jede PFLICHTZELLE decken — Schraegen sind keine Pflichtzellen,
 * also blieb der Vierteile-Rutschen-Bausatz im fertig gemalten Raum stehen, und
 * kein Tor hat es gesagt. Silhouetten-Tor, Aufstands-Tor, Naht-Tor, Wert-Vertrag
 * und zwei blinde Pruefungen waren gruen; gefunden hat es ein Blick auf den
 * Bildschirm. Diese zwei Tests sind der Ersatz fuer diesen Blick.
 */
describe("eine Ein-Block-Welt zeichnet keine Bausteine (R264)", () => {
  /** Was ein fertig gemalter Raum zeichnen darf: sein Gemaelde und seine Moebel. */
  const ERLAUBT = new Set(["bodyMount", "platform"]);

  it("keine Ein-Block-Phase plant ein Bausatz-Stueck", () => {
    const geprueft: string[] = [];
    for (const ph of phases) {
      const spec = COMPOSITION.ch01?.[ph.id];
      if (spec === undefined || !phaseIsOneBlock(ph.rows, spec.mass)) continue;
      geprueft.push(ph.id);
      const fremd = [...new Set(planMass(ph.rows, spec.mass).map((p) => p.kind))].filter((k) => !ERLAUBT.has(k));
      expect(fremd, `${ph.id} zeichnet Bausatz-Teile`).toEqual([]);
    }
    // Der Fall darf nicht still auf einer leeren Menge laufen (P-56).
    expect(geprueft).toEqual(["p1", "p2", "p3"]);
  });

  it("in einer Ein-Block-Phase gehoert jede Schraegen-Zelle einem Koerper", () => {
    for (const ph of phases) {
      const spec = COMPOSITION.ch01?.[ph.id];
      if (spec === undefined || !phaseIsOneBlock(ph.rows, spec.mass)) continue;
      const gemalt = new Set((spec.mass.bodies ?? []).flatMap((b) => bodySlopeCells(b).map(({ c, r }) => `${c},${r}`)));
      const offen: string[] = [];
      ph.rows.forEach((row, r) => {
        for (let c = 0; c < row.length; c++) {
          const g = row[c] ?? ".";
          if (isSlope(g) && !gemalt.has(`${c},${r}`)) offen.push(`${ph.id} (${c},${r}) "${g}"`);
        }
      });
      // Ohne diesen Test ist ein Loch dort von KEINEM Tor sichtbar: `uncoveredSolids`
      // fragt nur nach soliden Zellen, und eine Schraege ist keine.
      expect(offen, "Schraegen-Zellen ohne Bild").toEqual([]);
    }
  });
});
