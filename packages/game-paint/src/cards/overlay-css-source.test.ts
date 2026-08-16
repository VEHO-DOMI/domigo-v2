// R5-W4b · D3b · DER BACKTICK-WÄCHTER — und warum er eine EIGENE Datei ist.
//
// `overlay-css.ts` ist EIN Template-Literal von rund 1500 Zeilen. Ein Backtick
// in einem Kommentar darin beendet das Literal, die Datei hört auf zu parsen,
// und der Fehler, den esbuild wirft, zeigt auf eine Zeile deutscher Prosa —
// er liest sich nach allem außer nach seiner Ursache. Die Falle hat in D3a
// zweimal und in D3b dreimal zugeschlagen; die Hausregel (»…« statt Backticks
// in dieser Datei) stand nach dem zweiten Mal geschrieben und wurde danach
// dreimal gebrochen. Eine Regel ohne Prüfung ist ein Wunsch.
//
// ⚠ DIESE DATEI IMPORTIERT `overlay-css.ts` MIT ABSICHT NICHT.
// Der erste Anlauf hat den Wächter in `overlay-css.test.ts` gelegt — und der
// Tamper hat bewiesen, dass er dort nutzlos ist: die Suite importiert das
// Stylesheet, also scheitert schon der Import, und der Wächter kommt nie zum
// Zug. Er liest die Datei deshalb als TEXT und läuft auch dann, wenn nichts
// anderes in diesem Paket mehr übersetzt.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("R5-W4b · D3b · das Stylesheet bleibt ein einziges Template-Literal", () => {
  it("kein unmaskierter Backtick zwischen den beiden Begrenzern", () => {
    const src = fs.readFileSync(path.join(__dirname, "overlay-css.ts"), "utf8");
    const marker = "export const PAINT_OVERLAY_CSS = `";
    const open = src.indexOf(marker);
    // Vakuität: findet der Wächter den Anfang nicht, prüft er nichts und muss
    // rot werden statt still grün zu bleiben.
    expect(open, "die Öffnungs-Begrenzung ist verschoben — der Wächter wäre blind").toBeGreaterThan(0);
    const body = src.slice(open + marker.length);
    const close = body.lastIndexOf("`");
    expect(close, "die Schluss-Begrenzung fehlt").toBeGreaterThan(0);
    const offenders: string[] = [];
    body.slice(0, close).split("\n").forEach((line, i) => {
      if (/(^|[^\\])`/.test(line)) offenders.push(`${i + 1}: ${line.trim().slice(0, 70)}`);
    });
    expect(
      offenders,
      `unmaskierte Backticks im Stylesheet — »…« benutzen:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});
