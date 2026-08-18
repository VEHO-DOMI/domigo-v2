import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  KEY_TOL,
  RULE_FIXTURE,
  importerWouldDelete,
  isKeyPixel,
} from "../../../scripts/key-fringe.mjs";

// R5-W5 · W4 · EINE FRAGE, EINE ANTWORT — ODER EIN ROTES LICHT.
//
// „Ist dieser Bildpunkt Schlüsselfarbe?" wird im Repo an fünf Stellen
// beantwortet: einmal in scripts/key-fringe.mjs und je einmal in den vier
// Import-Skripten. H3 hat gemeldet, was daraus folgt — nach der Importer-Regel
// sauber, nach der Tor-Regel rot (424 / 180 / 50 px).
//
// Die Importer gehören anderen Bahnen (C4 / A7 / H4), also fasst diese Runde
// sie NICHT an. Was sie stattdessen baut, ist der Wächter über die Kopien: er
// liest die Regel jedes Importers AUS SEINER QUELLE, jagt denselben Prüfsatz
// durch sie und durch das Modul, und wird rot, sobald eine Kopie etwas anderes
// sagt. Der Umstieg auf das gemeinsame Modul ist als Auftrag im W4-Report
// notiert; bis er passiert, hält dieser Test die fünf Antworten deckungsgleich.
//
// ★ STAND 2026-08-18 (R5-W6 · A7): eine der vier Kopien ist eingelöst —
// `import-batch-as.mjs` importiert die Saum-Regel jetzt aus dem Modul, statt sie
// zu wiederholen. Der Leser unten erkennt diese Form ausdrücklich an; für die
// drei übrigen Importer (C4 · H4) gilt der Wächter unverändert weiter.
//
// Warum aus der QUELLE gelesen und nicht importiert: die Importer sind
// Kommandozeilen-Skripte, die beim Import losliefen. Und die Behauptung, die
// hier geprüft werden soll, ist ohnehin eine über den Quelltext — „in dieser
// Datei steht dieselbe Regel". Findet der Leser eine Regel NICHT, ist das ein
// Fehlschlag und kein stilles Überspringen: eine Kopie, die ihre Form ändert,
// muss angesehen werden, nicht durchgewunken.

const ROOT = path.resolve(__dirname, "../../..");

/** Die vier Import-Skripte und wo ihre Regeln heute stehen (Zeilen 2026-08-17,
 *  nur zur Orientierung im Report — gefunden wird per Muster, nicht per Zeile). */
const IMPORTERS = [
  { file: "docs/art/import-batch-aq12.mjs", lane: "C4" },
  { file: "docs/art/import-batch-aq15.mjs", lane: "C4" },
  { file: "docs/art/import-batch-aq13.mjs", lane: "H4" },
  { file: "docs/art/import-batch-as.mjs", lane: "A7" },
] as const;

type Rule = (r: number, g: number, b: number) => boolean;

const src = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

/** Baut aus einem herausgelesenen Ausdruck eine echte Funktion — mit `TOL` als
 *  geschlossener Variable, damit ein Vorgabewert `tol = TOL` weiter greift. */
const compile = (params: string, expr: string, tol: number): Rule =>
  new Function("TOL", `return (${params}) => (${expr});`)(tol) as Rule;

const findTol = (text: string): number => {
  const m = /^const TOL = (\d+);/m.exec(text);
  expect(m, "kein `const TOL = …` gefunden — die Regel hat ihre Form geändert").not.toBeNull();
  return Number(m![1]!);
};

const findKeyRule = (text: string, tol: number): Rule => {
  const m = /^const isMagenta = \(([^)]*)\) =>\s*(.+?);\s*$/m.exec(text);
  expect(m, "kein `const isMagenta = …` gefunden — die Regel hat ihre Form geändert").not.toBeNull();
  return compile(m![1]!, m![2]!, tol);
};

const findFringeRule = (text: string, tol: number): Rule => {
  // ── DIE STÄRKSTE FORM: die Datei KOPIERT die Regel nicht, sie IMPORTIERT sie ─
  //
  // R5-W6 · A7 hat `import-batch-as.mjs` auf `scripts/key-fringe.mjs` umgestellt
  // — genau der Umstieg, den der Kopf dieses Tests als W4-Auftrag notiert. Dann
  // gibt es keinen Ausdruck mehr zu lesen und auch keinen, der driften könnte:
  // die Datei RUFT das Modul. Das ist Übereinstimmung durch Konstruktion, und
  // sie ist stärker als jede Textgleichheit, die dieser Leser prüfen kann.
  //
  // Erkannt nur, wenn BEIDE Hälften dastehen — der Import UND die Bindung an den
  // Namen, den alle Leser darunter erwarten. Damit schlägt der Blindheits-Tamper
  // unten unverändert an: er löscht die `const isFringe`-Zeile, und dann ist der
  // Beweis unvollständig und dieser Leser fällt wie vorher durch.
  const importsModule = /import \{[^}]*\bimporterWouldDelete\b[^}]*\} from "[^"]*key-fringe\.mjs";/.test(text);
  const aliasesModule = /^const isFringe = importerWouldDelete;$/m.test(text);
  if (importsModule && aliasesModule) return importerWouldDelete;

  const named = /^const isFringe = \(([^)]*)\) =>\s*(.+?);\s*$/m.exec(text);
  if (named !== null) return compile(named[1]!, named[2]!, tol);
  // …und die drei, die dieselbe Regel ohne Namen in eine `if`-Zeile getippt haben
  const inline = /if \((r > \d+ && b > \d+ && r - g > \d+ && b - g > \d+)\)/.exec(text);
  expect(
    inline,
    "weder `const isFringe = …` noch die eingetippte Saum-Bedingung gefunden — "
      + "die Regel hat ihre Form geändert und muss angesehen werden",
  ).not.toBeNull();
  return compile("r, g, b", inline![1]!, tol);
};

describe("die Schlüsselfarb-Regeln stehen im Repo nur EINMAL (H3 · W4)", () => {
  it("der Prüfsatz taugt: er trennt die Schlüssel-Regel von der Saum-Regel", () => {
    // Ein Satz, auf dem beide Regeln überall dasselbe sagen, könnte eine
    // vertauschte Regel nicht bemerken — er würde nur bestätigen, nie prüfen.
    const divergent = RULE_FIXTURE.filter(
      ({ rgb }) => isKeyPixel(rgb[0], rgb[1], rgb[2]) !== importerWouldDelete(rgb[0], rgb[1], rgb[2]),
    );
    expect(divergent.length).toBeGreaterThan(0);
    // …und beide Antworten müssen im Satz vorkommen, sonst prüft er nur eine Richtung.
    expect(RULE_FIXTURE.some(({ rgb }) => isKeyPixel(rgb[0], rgb[1], rgb[2]))).toBe(true);
    expect(RULE_FIXTURE.some(({ rgb }) => !isKeyPixel(rgb[0], rgb[1], rgb[2]))).toBe(true);
    expect(RULE_FIXTURE.some(({ rgb }) => importerWouldDelete(rgb[0], rgb[1], rgb[2]))).toBe(true);
    expect(RULE_FIXTURE.some(({ rgb }) => !importerWouldDelete(rgb[0], rgb[1], rgb[2]))).toBe(true);
  });

  it.each(IMPORTERS)("$file trägt dieselbe Toleranz wie das Modul", ({ file }) => {
    expect(findTol(src(file))).toBe(KEY_TOL);
  });

  it.each(IMPORTERS)("$file beantwortet »ist das der Schlüssel?« wie das Modul", ({ file }) => {
    const text = src(file);
    const theirs = findKeyRule(text, findTol(text));
    for (const { rgb, was } of RULE_FIXTURE) {
      const [r, g, b] = rgb;
      expect(theirs(r, g, b), `${file} · rgb(${rgb.join(",")}) — ${was}`).toBe(isKeyPixel(r, g, b));
    }
  });

  it.each(IMPORTERS)("$file beantwortet »ist das ein Saum?« wie das Modul", ({ file }) => {
    const text = src(file);
    const theirs = findFringeRule(text, findTol(text));
    for (const { rgb, was } of RULE_FIXTURE) {
      const [r, g, b] = rgb;
      expect(theirs(r, g, b), `${file} · rgb(${rgb.join(",")}) — ${was}`).toBe(importerWouldDelete(r, g, b));
    }
  });

  it("der Leser ist nicht blind: eine geänderte Regel wird ERKANNT, nicht übersprungen", () => {
    // Der gefährliche Fehlschlag dieses Tests wäre, eine Regel nicht zu finden
    // und still grün zu bleiben. Also einmal beweisen, dass beide Leser an einer
    // veränderten Quelle wirklich anschlagen — der Tamper trifft den TEXT, den
    // sie lesen, nicht ihre Konfiguration.
    const text = src("docs/art/import-batch-as.mjs");
    const ohneSchluessel = text.replace(/^const isMagenta = .+$/m, "// weg");
    expect(() => findKeyRule(ohneSchluessel, KEY_TOL)).toThrow();
    const ohneSaum = text
      .replace(/^const isFringe = .+$/m, "// weg")
      .replace(/if \(r > \d+ && b > \d+ && r - g > \d+ && b - g > \d+\)/g, "if (false)");
    expect(() => findFringeRule(ohneSaum, KEY_TOL)).toThrow();

    // …und eine Regel, die ANDERS antwortet, muss auffallen. Nicht an EINER
    // verschobenen Schwelle, sondern an JEDER der vier — sonst deckt eine
    // Bedingung die Drift einer anderen zu. Genau das ist am 17.08. passiert:
    // ein Tamper auf `r − g > 54` lief grün durch, weil jeder Prüfton dieselbe
    // Zahl in r−g und b−g trug und die zweite Bedingung ihn abfing.
    const SAUM = "r > 120 && b > 120 && r - g > 55 && b - g > 55";
    const SCHWELLEN = ["r > 120", "b > 120", "r - g > 55", "b - g > 55"] as const;
    for (const schwelle of SCHWELLEN) {
      const [links, zahl] = [schwelle.slice(0, schwelle.lastIndexOf(">") + 1), Number(schwelle.split("> ")[1])];
      const verschoben = compile("r, g, b", SAUM.replace(schwelle, `${links} ${zahl - 1}`), KEY_TOL);
      const abweichend = RULE_FIXTURE.filter(
        ({ rgb }) => verschoben(rgb[0], rgb[1], rgb[2]) !== importerWouldDelete(rgb[0], rgb[1], rgb[2]),
      );
      expect(
        abweichend.length,
        `der Prüfsatz merkt nicht, wenn »${schwelle}« um EINS verschoben wird — `
          + "er braucht einen Ton, der genau an dieser Schwelle kippt",
      ).toBeGreaterThan(0);
    }
  });
});
