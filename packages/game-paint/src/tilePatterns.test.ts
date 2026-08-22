import { describe, expect, it } from "vitest";
import { buildOncePerKey, PatternLedger } from "./tilePatterns.ts";

/**
 * R5-W3 · E5 · D-32 + R5-W7 · E8 · D-431. Der Fehler, gegen den diese Gesetze
 * stehen: Phaser gibt JEDER TileSprite ihre eigene Zweierpotenz-Kopie ihrer
 * Quelle auf der Grafikkarte — p2 schneidet 331 Stücke aus einer Handvoll
 * Blättern. E5 hat die Kopien zurückgegeben (Speicher), E8 baut sie gar nicht
 * erst (Bauzeit: E7 maß 30–107 ms je Raum allein für dieses Bauen).
 *
 * Das sind die Buchhaltungs-Gesetze — sie brauchen keine Grafikkarte, genau
 * deshalb laufen sie in CI. Die Ersparnis selbst wird im Browser gemessen und
 * mit dem Lauf berichtet; ein Test sieht keinen VRAM.
 */
describe("tile pattern ledger (D-32 · D-431)", () => {
  it("hält das erste Muster eines Blattes und bedient jedes spätere daraus", () => {
    const led = new PatternLedger<{ id: number }>();
    const first = { id: 1 };

    expect(led.serve("mass_body_a")).toBeNull(); // nichts da ⇒ der Aufrufer baut
    led.keep("mass_body_a", first);

    expect(led.serve("mass_body_a")).toBe(first);
    expect(led.serve("mass_body_a")).toBe(first);
    expect(led.kept).toBe(1);
    expect(led.served).toBe(2);
  });

  it("hält eins PRO Blatt — verschiedene Bilder teilen nie", () => {
    const led = new PatternLedger<string>();
    led.keep("mass_body_a", "A");
    led.keep("mass_crust", "B");

    expect(led.serve("mass_body_a")).toBe("A");
    expect(led.serve("mass_crust")).toBe("B");
    expect(led.kept).toBe(2);
    expect(led.owned().sort()).toEqual(["A", "B"]);
  });

  it("weist ein zweites keep für dasselbe Blatt LAUT ab", () => {
    // ein zweites keep würde die erste Textur verwaisen lassen: die Szene
    // schuldet sie dem Renderer weiter, kennt sie aber nicht mehr
    const led = new PatternLedger<string>();
    led.keep("a", "erste");

    expect(() => led.keep("a", "zweite")).toThrow(/already kept/);
    expect(led.owned()).toEqual(["erste"]);
  });

  it("besitzt genau das, was beim Herunterfahren gelöscht werden muss", () => {
    const led = new PatternLedger<string>();
    for (const k of ["a", "b", "c"]) led.keep(k, `${k}-muster`);
    for (const k of ["a", "a", "b", "a", "c", "c"]) led.serve(k);

    expect(led.owned()).toHaveLength(3);
    expect(led.kept + led.served).toBe(3 + 6);
  });

  it("clear() gibt den Ledger frei, ein wiederbetretener Raum fängt sauber an", () => {
    const led = new PatternLedger<string>();
    led.keep("a", "x");
    led.serve("a");
    led.clear();

    expect(led.kept).toBe(0);
    expect(led.served).toBe(0);
    // nach einem clear muss das nächste Sprite BAUEN, nicht still auf eine
    // Textur zeigen, die die Szene schon zurückgegeben hat — das zeichnete aus
    // freigegebenem Speicher
    expect(led.serve("a")).toBeNull();
  });
});

/**
 * R5-W7 · E8 · D-431 — das Gesetz, um das es dieser Bahn geht, an der Funktion
 * gefahren, die auch im Browser läuft (`PaintScene#patchTileBuild` ruft
 * dieselbe): das ZWEITE Stück eines Blattes baut NICHTS.
 */
describe("buildOncePerKey (D-431)", () => {
  /** ein Lauf über eine Sprite-Liste; zählt, was wirklich gebaut wurde */
  const lauf = (blaetter: readonly string[], led = new PatternLedger<string>()): {
    gebaut: number; geteilt: number; gezeichnetMit: string[];
  } => {
    let gebaut = 0;
    let geteilt = 0;
    const gezeichnetMit: string[] = [];
    for (const [i, blatt] of blaetter.entries()) {
      let muster: string | null = null;
      buildOncePerKey(
        led,
        blatt,
        () => { gebaut += 1; muster = `${blatt}#${i}`; return muster; },
        (geerbt) => { geteilt += 1; muster = geerbt; },
      );
      gezeichnetMit.push(muster ?? "NICHTS");
    }
    return { gebaut, geteilt, gezeichnetMit };
  };

  it("der p2-Fall: 331 Stücke aus sechs Blättern ⇒ SECHS Bauten, nicht 331", () => {
    const blaetter = ["mass_body_a", "mass_body_b", "mass_crust", "mass_fade", "mass_sediment", "plank_loop"];
    const alle = Array.from({ length: 331 }, (_, i) => blaetter[i % blaetter.length] ?? "");

    const { gebaut, geteilt } = lauf(alle);

    expect(gebaut).toBe(6);
    expect(geteilt).toBe(325);
  });

  it("jedes Stück zeichnet mit dem Muster SEINES Blattes", () => {
    // die Ersparnis wäre wertlos, wenn ein Stück das falsche Bild bekäme
    const { gezeichnetMit } = lauf(["a", "b", "a", "c", "b"]);

    expect(gezeichnetMit).toEqual(["a#0", "b#1", "a#0", "c#3", "b#1"]);
  });

  it("TAMPER: fällt die Frage vor dem Bau weg, baut jedes Stück wieder selbst", () => {
    // Der Beweis, dass die zwei Zusicherungen oben ÜBERHAUPT rot werden können.
    // Nachgestellt wird der Ausfall, der in der Szene wirklich droht: die
    // Prototyp-Umhängung liegt nicht (mehr) oben, also sieht der Ledger nie
    // einen Treffer. Ein Ledger, dessen `serve` immer `null` sagt, ist genau das.
    const blind = new PatternLedger<string>();
    Object.defineProperty(blind, "serve", { value: () => null });
    Object.defineProperty(blind, "keep", { value: () => undefined });
    const blaetter = ["a", "b", "a", "c", "b"];

    const { gebaut, geteilt, gezeichnetMit } = lauf(blaetter, blind);

    expect(gebaut).toBe(5); // statt 3
    expect(geteilt).toBe(0); // statt 2
    expect(gezeichnetMit).toEqual(["a#0", "b#1", "a#2", "c#3", "b#4"]); // jedes sein eigenes
  });
});
