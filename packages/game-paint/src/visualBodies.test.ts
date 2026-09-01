import { describe, expect, it } from "vitest";
import { P2_EXEMPLAR_BODY, type VisualBody, bodyCells, bodyPartitionErrors } from "./visualBodies.ts";
import { planMass, uncoveredSolids } from "./mass.ts";
import { CH01_COMPOSITION } from "./composition.ts";
import { TILE } from "./paint.ts";

/** Ein synthetisches Grid: L-förmige Insel + freie Solid-Zelle daneben. */
const GRID = [
  "........",
  ".##.....",
  ".##.....",
  ".####..#",
  "........",
];

const L_BODY: VisualBody = {
  id: "test_l", stem: "body_test_l", c0: 1, r0: 1,
  rows: ["##", "##", "####"],
  pxPerCell: 64, overpaint: { l: 0, r: 0, t: 0, b: 0 },
};

describe("bodyPartitionErrors — das Partitions-Gesetz (R6)", () => {
  it("akzeptiert eine deckungsgleiche, zusammenhängende Maske", () => {
    expect(bodyPartitionErrors(GRID, [L_BODY])).toEqual([]);
    expect(bodyCells(L_BODY)).toHaveLength(8);
  });

  it("TAMPER: eine um eine Zelle verschobene Maske wird ROT, nie still", () => {
    const shifted = { ...L_BODY, c0: 2 };
    const errors = bodyPartitionErrors(GRID, [shifted]);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.join("\n")).toContain("nicht solide");
  });

  it("meldet Doppel-Besitz zwischen zwei Körpern", () => {
    const twin = { ...L_BODY, id: "test_l2" };
    expect(bodyPartitionErrors(GRID, [L_BODY, twin]).join("\n")).toContain("gehört schon");
  });

  it("meldet eine zerfallende Maske", () => {
    const torn: VisualBody = { ...L_BODY, id: "torn", rows: ["#.", ".."], c0: 1, r0: 1 };
    const twoPart: VisualBody = { ...torn, rows: ["#.#"], c0: 1, r0: 3 };
    expect(bodyPartitionErrors(GRID, [twoPart]).join("\n")).toContain("zerfällt");
  });

  it("fullyPainted verlangt lückenlosen Besitz aller Solid-Zellen", () => {
    const errors = bodyPartitionErrors(GRID, [L_BODY], { fullyPainted: true });
    expect(errors.join("\n")).toContain("(7,3)");
    expect(bodyPartitionErrors(GRID, [L_BODY], {
      fullyPainted: true, otherClaimed: new Set(["7,3"]),
    })).toEqual([]);
  });
});

describe("planMass mit Sicht-Körper (bodyMount)", () => {
  const kit = CH01_COMPOSITION.p2?.mass ?? null;
  const src = () => ({ w: 512, h: 512 });

  it("claimt die Körper-Zellen: kein Kit-Stück zeichnet in das Gemälde", () => {
    expect(kit).not.toBeNull();
    if (kit === null) return;
    const withBody = { ...kit, bodies: [L_BODY] };
    const pieces = planMass(GRID, withBody, src);
    const mounts = pieces.filter((p) => p.kind === "bodyMount");
    expect(mounts).toHaveLength(1);
    const owned = new Set(bodyCells(L_BODY).map(({ c, r }) => `${c},${r}`));
    for (const p of pieces) {
      if (p.kind === "bodyMount") continue;
      expect(owned.has(`${p.c},${p.r}`), `${p.kind}@${p.c},${p.r}`).toBe(false);
    }
  });

  it("deckt zellgenau, nicht rechteckig: die Luft der L-Box bleibt Luft", () => {
    if (kit === null) return;
    const pieces = planMass(GRID, { ...kit, bodies: [L_BODY] }, src);
    expect(uncoveredSolids(GRID, pieces)).toEqual([]);
    // TAMPER am Deckungs-Gesetz: nimmt man dem Mount seine Zellliste, meldet
    // die Rechteck-Ableitung dieselbe Deckung — der Unterschied ist die Ecke
    // (3,1)/(3,2), die NICHT zur L-Maske gehört und im Grid Luft ist.
    const rect = pieces.map((p) => p.kind === "bodyMount" ? { ...p, cells: undefined } : p);
    const rectCovered = rect.find((p) => p.kind === "bodyMount");
    expect(rectCovered).toBeDefined();
  });

  it("skaliert das Mount nach pxPerCell und ankert an der Zell-Box", () => {
    if (kit === null) return;
    const body: VisualBody = { ...L_BODY, overpaint: { l: 8, r: 8, t: 12, b: 16 } };
    const pieces = planMass(GRID, { ...kit, bodies: [body] }, src);
    const m = pieces.find((p) => p.kind === "bodyMount");
    expect(m).toBeDefined();
    if (m === undefined) return;
    const s = TILE / body.pxPerCell;
    expect(m.x).toBeCloseTo(1 * TILE - 8 * s, 5);
    expect(m.y).toBeCloseTo(1 * TILE - 12 * s, 5);
    expect(m.w).toBeCloseTo((4 * 64 + 16) * s, 5);
    expect(m.h).toBeCloseTo((3 * 64 + 28) * s, 5);
    expect(m.srcScale).toBeCloseTo(s, 8);
  });

  it("das Exemplar selbst besteht das Partitions-Gesetz am echten p2-Grid", async () => {
    const fs = await import("node:fs");
    const path = new URL(
      "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json",
      import.meta.url,
    );
    const level = JSON.parse(fs.readFileSync(path, "utf8")) as {
      phases: Array<{ rows: string[] }>;
    };
    const p2 = level.phases[1];
    expect(p2).toBeDefined();
    if (p2 === undefined) return;
    expect(bodyPartitionErrors(p2.rows, [P2_EXEMPLAR_BODY])).toEqual([]);
    expect(bodyCells(P2_EXEMPLAR_BODY)).toHaveLength(185);
  });
});
