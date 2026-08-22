// R5-W2 · I1 · THE BENCH SEES EVERY CARD.
//
// `scripts/shoot-card-bench.mjs` carries the surface list that the blind critics
// are photographed from, and its own comment says it is "kept in step with
// dev/CardGallery.tsx" — by hand. That is a drift class, not a drift risk: a
// surface added to the gallery and not to the list is simply never shot, and it
// fails SILENTLY, as a card that quietly stops being reviewed. This packet added
// one (the reading card's second beat) and hit exactly that, so the class gets a
// gate rather than the instance getting a fix.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../../../..");
const gallery = fs.readFileSync(path.join(root, "packages/game-paint/src/dev/CardGallery.tsx"), "utf8");
const bench = fs.readFileSync(path.join(root, "scripts/shoot-card-bench.mjs"), "utf8");

// ── R5-W7 · W6 · DIE LISTE DER MELDER WAR SELBST EINE DRIFT-KLASSE ──────────
//
// Die Suche oben kannte GENAU ZWEI Melder (`card` und `ceremony`) und war damit
// gegen einen DRITTEN blind: W6 hat `answerHome` fuer den Verdikt-Takt gebaut,
// und dieser Wächter meldete daraufhin nicht »eine Fläche fehlt«, sondern
// »der Schütze nennt eine Fläche, die es in der Galerie nicht gibt« — die
// richtige Beobachtung mit der falschen Ursache. Genau das Muster, gegen das
// dieser Test gebaut wurde, eine Ebene höher.
//
// Gelesen wird deshalb der ARRAY-KÖRPER und nicht die Datei: jeder Aufruf auf
// der obersten Ebene von `const surfaces: Surface[] = [ … ]` ist ein Melder,
// wie immer er heisst. Trägt einer keine id als erstes Argument, ist DAS der
// Befund — statt dass er stillschweigend aus der Menge fällt.
const surfacesBlock = (): string => {
  const m = /const surfaces: Surface\[\] = \[([\s\S]*?)\n  \];/.exec(gallery);
  if (m === null) throw new Error("das surfaces-Array nicht gefunden — die Suche ist blind, nicht grün");
  return m[1]!;
};

/** jeder Melder-Aufruf auf der obersten Ebene des Arrays: [name, id|null] */
const gallerySurfaceCalls = (): { name: string; id: string | null }[] =>
  [...surfacesBlock().matchAll(/^ {4}([A-Za-z][A-Za-z0-9_]*)\(\s*(?:"([a-z0-9-]+)")?/gm)]
    .map((m) => ({ name: m[1]!, id: m[2] ?? null }));

/** every id the gallery registers, whatever the registrar is called. */
const gallerySurfaces = (): string[] =>
  gallerySurfaceCalls().map((c) => c.id).filter((id): id is string => id !== null);

/** the exported list the shooter walks. */
const benchSurfaces = (): string[] => {
  const block = /export const SURFACES = \[([\s\S]*?)\];/.exec(bench);
  if (block === null) throw new Error("SURFACES list not found — the scan is blind, not green");
  return [...block[1]!.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]!);
};

describe("the card bench and the shooter agree", () => {
  it("finds enough surfaces to be worth checking (vacuity)", () => {
    // a regex that matched nothing would make both assertions below pass forever
    expect(gallerySurfaces().length).toBeGreaterThan(15);
    expect(benchSurfaces().length).toBeGreaterThan(15);
  });

  it("every gallery surface is one the shooter photographs", () => {
    const shot = new Set(benchSurfaces());
    expect(gallerySurfaces().filter((s) => !shot.has(s))).toEqual([]);
  });

  it("the shooter names no surface the gallery does not have", () => {
    const have = new Set(gallerySurfaces());
    expect(benchSurfaces().filter((s) => !have.has(s))).toEqual([]);
  });

  // R5-W7 · W6: …und kein Melder faellt still aus der Menge. Ein Aufruf im
  // Array ohne id als erstes Argument waere eine Flaeche, die dieser Waechter
  // nicht sieht — und damit die Luecke, die er schliessen soll.
  it("every registrar in the array yields an id (no silent third registrar)", () => {
    expect(gallerySurfaceCalls().filter((c) => c.id === null)).toEqual([]);
  });
});
