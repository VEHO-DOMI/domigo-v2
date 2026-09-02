// N7B · DIE RICHTIGE ANTWORT DARF NICHT WARTEN (Kokis Walk, 02.09.2026).
//
// Der Satz, der diese Datei erzwungen hat: „nach diesen Dingen ist noch immer
// ein delay mit dem Danke-Screen und danach ist man in der freeze pose für
// einen kurzen Augenblick … es sollte genauso seamless und instant sein wie bei
// den Regel-Seiten."
//
// Gemessen war der Schwanz einer gelösten Karte: die Antwort flog heim
// (`flightMs`, je nach Länge 0,6–1,0 s) → die Karte nahm den Hut ab und die
// Welt änderte sich unter einem ANGEHALTENEN Bild (`RESTORE_HOLD_MS`, 600 ms)
// → die Karte feierte (`VERDICT_MS`, 720 ms). Erst danach kam die Welt zurück.
// Zusammen rund zwei Sekunden Zusehen nach jeder richtigen Antwort.
//
// Der Wächter liest die QUELLE, nicht das Verhalten: dieses Paket hat kein
// React-Testbett (keine jsdom-Umgebung, keine Testing-Library), und ein Gesetz
// ohne Prüfung ist ein Wunsch — dieselbe Begründung, aus der der Backtick-
// Wächter nebenan (`overlay-css-source.test.ts`) die Datei als Text liest.
// Er prüft genau eine Sache: im Zweig der richtigen Antwort steht keine Uhr.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/** Der Zweig `if (g === "correct") { … }` als Text — von der Marke bis zum
 *  nächsten Zweig, damit der Wächter nicht versehentlich die ganze Datei liest
 *  und dann an der Karten-Uhr hängen bleibt (die DARF eine Uhr sein). */
const correctBranch = (src: string): string => {
  const open = src.indexOf('if (g === "correct") {');
  const end = src.indexOf('if (g === "wrong") {', open);
  return open < 0 || end < 0 ? "" : src.slice(open, end);
};

describe("N7B · der Karten-Schwanz ist weg", () => {
  const src = fs.readFileSync(path.join(__dirname, "CardHost.tsx"), "utf8");
  const branch = correctBranch(src);

  it("der Wächter findet den Zweig überhaupt (sonst prüft er nichts)", () => {
    // Vakuität: verschiebt jemand die Marken, muss dieser Test rot werden statt
    // still grün zu bleiben.
    expect(branch.length, "der Zweig der richtigen Antwort ist nicht auffindbar").toBeGreaterThan(80);
    expect(branch, "…und er muss die Welt ändern").toContain("onWorldChange");
    expect(branch, "…und die Karte schliessen").toContain("onResolve");
  });

  it("zwischen der richtigen Antwort und der zurückgegebenen Welt steht keine Uhr", () => {
    const uhren = ["after(", "setTimeout", "setBeat(", "requestAnimationFrame"]
      .filter((needle) => branch.includes(needle));
    expect(
      uhren,
      "eine Uhr im Zweig der richtigen Antwort heisst: das Kind wartet wieder zu, "
      + `statt zu spielen (gefunden: ${uhren.join(", ")})`,
    ).toEqual([]);
  });

  it("…und die Welt kommt im selben Zug zurück, in der richtigen Reihenfolge", () => {
    // erst die Änderung, dann das Schliessen — sonst räumt der Rückgabe-Ort die
    // Karte weg, bevor die Welt weiss, was das Kind geantwortet hat.
    expect(branch.indexOf("onWorldChange")).toBeLessThan(branch.indexOf("onResolve"));
  });
});
