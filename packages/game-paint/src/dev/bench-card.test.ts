// R5-W6b · W5 · DIE BANK ZEIGT DIE KARTE, DIE BESTELLT WURDE (C5).
//
// Die Flaechen der Bank suchen ihre Karte per ART (`byKind`) und bekommen damit
// immer die ERSTE ihrer Art: bei `restore` den Radiergummi. Eine C-Bahn, die
// ein umgefaerbtes BUCH abnimmt, konnte es in der Karte, in der das Kind es
// sieht, nie fotografieren — C5s Befund, und der Grund fuer `?karte=<id>`
// (`shoot-card-bench --card`).
//
// Zwei Gesetze halten das Loch zu, das dabei aufgehen kann, und beide sind
// Wiederholungen von D-206: die Bank darf NIE still ein anderes Ding zeigen,
// als angefordert wurde. Also ist eine unbekannte id ein Fehler, und eine
// mehrdeutige auch — kein Zufallstreffer, kein Rueckfall.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { waehleKarte } from "./CardGallery.tsx";
import type { GameTaskV2 } from "@domigo/content-schema";

const root = path.resolve(__dirname, "../../../..");
const tasks = (JSON.parse(fs.readFileSync(
  path.join(root, "content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json"), "utf8",
)) as { items: GameTaskV2[] }).items;

describe("die Kartenbank zeigt die Karte, die bestellt wurde", () => {
  it("findet ueberhaupt Karten zum Pruefen (Vakuitaet)", () => {
    expect(tasks.length).toBeGreaterThan(20);
    expect(tasks.filter((t) => t.kind === "restore").length).toBeGreaterThan(3);
  });

  it("ohne Bestellung waehlt sie nichts — die Flaeche nimmt weiter die erste ihrer Art", () => {
    expect(waehleKarte(tasks, undefined)).toEqual({ gewaehlt: undefined, kartenFehler: null });
  });

  it("das Ende der id genuegt: »obj-book.r1« findet genau das Buch", () => {
    const { gewaehlt, kartenFehler } = waehleKarte(tasks, "obj-book.r1");
    expect(kartenFehler).toBeNull();
    expect(gewaehlt?.id).toBe("g1.paint.ch01.enc.obj-book.r1");
    expect(gewaehlt?.kind).toBe("restore");
  });

  it("…und die volle id auch", () => {
    expect(waehleKarte(tasks, "g1.paint.ch01.enc.obj-book.r1").gewaehlt?.id)
      .toBe("g1.paint.ch01.enc.obj-book.r1");
  });

  it("die erste Karte ihrer Art ist NICHT mehr die einzige erreichbare", () => {
    // genau C5s Befund: `byKind("restore")` gibt den Radiergummi, und das Buch
    // war damit unfotografierbar. Beide muessen namentlich erreichbar sein.
    expect(waehleKarte(tasks, "eraser.r1").gewaehlt?.id).toBe("g1.paint.ch01.enc.eraser.r1");
    expect(waehleKarte(tasks, "obj-schoolbag.r1").gewaehlt?.id).toBe("g1.paint.ch01.enc.obj-schoolbag.r1");
  });

  it("eine unbekannte id ist ein FEHLER, kein Rueckfall auf die erste Karte", () => {
    const { gewaehlt, kartenFehler } = waehleKarte(tasks, "gibtsnicht");
    expect(gewaehlt).toBeUndefined();
    expect(kartenFehler).toContain("keine Karte");
  });

  it("eine mehrdeutige id ist ein FEHLER, kein Zufallstreffer", () => {
    // »r1« endet auf mehreren Karten — der stille Treffer waere hier D-206.
    const { gewaehlt, kartenFehler } = waehleKarte(tasks, "r1");
    expect(gewaehlt).toBeUndefined();
    expect(kartenFehler).toContain("trifft");
  });
});

describe("das Werkzeug kann nachsehen, ob die bestellte Karte wirklich gezeigt wurde", () => {
  // Ohne diesen Handschlag haette ein Tippfehler in `--card` 27 Fehlzeilen
  // fotografiert und Exit 0 gemeldet. Der Vertrag ist ein data-Attribut auf der
  // Buehne — von Hand gehalten, also mit Tor (dieselbe Bauform wie
  // bench-surfaces.test.ts).
  const gallery = fs.readFileSync(path.join(root, "packages/game-paint/src/dev/CardGallery.tsx"), "utf8");
  const bench = fs.readFileSync(path.join(root, "scripts/shoot-card-bench.mjs"), "utf8");

  it("die Buehne schreibt die gewaehlte id an sich selbst", () => {
    expect(gallery).toContain("data-karte=");
  });

  it("…und das Werkzeug liest genau dieses Attribut, bevor es ausloest", () => {
    expect(bench).toContain("dataset.karte");
    expect(bench).toContain("--card");
  });
});
