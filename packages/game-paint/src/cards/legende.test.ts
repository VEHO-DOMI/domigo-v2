// ── R5-W8 · D6 · DAS GESETZ DER SAMMEL-LEGENDE ──────────────────────────────
//
// WOHER DIESES BLATT KOMMT. P7 (End-Urteil III, 22.08.) hat den Auftragsschirm
// gemessen: alle neun deutschen Wörter standen im STARTZUSTAND — also genau
// dann, wenn ein Kind sie zum ersten Mal liest — bei 1,96 : 1 gegen das Papier,
// bei 11,5 px. Der übliche Boden für Fließtext ist 4,5 : 1. Ursache war EIN
// Ausdruck: `opacity: c.found ? 1 : 0.46`. Die Karte wurde lesbar, nachdem man
// gefunden hatte, was auf ihr steht.
//
// Dazu der Nebenbefund, der schwerer wog: drei unabhängige Prüfer meldeten
// ungefragt, ein Teil der Wörter sei blasser — und JEDER nannte andere.
// Gemessen standen alle neun exakt gleich. Eine Abstufung, die im Startzustand
// nichts unterscheidet, kostet nur Kontrast und wird als Rauschen gelesen.
//
// WAS HIER GEPRÜFT WIRD, UND WARUM SO. Drei Gesetze, und das dritte ist das
// eigentliche: nicht »die Zeile sieht richtig aus«, sondern »die Farben, die
// das Stylesheet für diese Zeile bereithält, ERGEBEN einen lesbaren Kontrast«.
// Deshalb rechnet dieses Blatt selbst — und weist sich vorher an drei bekannten
// Paaren aus, damit ein Lineal, das nicht misst, nicht schweigend durchgeht.
//
// Dazu kommt der zweite Befund derselben Messung (P7 §2.4): bei kleinem Fenster
// lag nicht nur die halbe Legende unter der Kante, sondern auch der EINZIGE
// Knopf, der weiterführt. Die Bauart, die das verhindert, steht am Ende dieses
// Blattes — sie ist STRUKTURELL (der Fuß liegt neben dem rollenden Blatt) und
// deshalb hier zu prüfen und nicht im Stylesheet.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { PAINT_OVERLAY_CSS } from "./overlay-css.ts";

const PAINT_GAME = path.resolve(__dirname, "../PaintGame.tsx");
const src = fs.readFileSync(PAINT_GAME, "utf8");

/** Kommentare erklären, WAS entfernt wurde — sie zitieren also genau die
 *  Ausdrücke, die hier verboten sind. Geurteilt wird über Code. */
const codeOnly = (s: string): string =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const code = codeOnly(src);

/* ── DER RECHNER (WCAG 2.x relative Leuchtdichte) ─────────────────────────── */
const kanal = (c: number): number => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const leucht = ([r, g, b]: number[]): number => 0.2126 * kanal(r!) + 0.7152 * kanal(g!) + 0.0722 * kanal(b!);
const kontrast = (a: number[], b: number[]): number => {
  const [x, y] = [leucht(a), leucht(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
};
/** Deckkraft ist eine Ebene, kein Farbwert: was auf dem Papier steht, ist die
 *  Mischung aus Schrift und Untergrund im Verhältnis der Deckkraft. */
const ueber = (fg: number[], bg: number[], a: number): number[] => fg.map((v, i) => a * v + (1 - a) * bg[i]!);

const hex = (h: string): number[] => {
  const m = /^#?([0-9a-f]{6})$/i.exec(h.trim());
  if (m === null) throw new Error(`kein Sechserton: ${h}`);
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Der Wert eines Tokens, aus dem AUSGELIEFERTEN Stylesheet gelesen — nicht
 *  getippt. Ändert jemand `--pb-quiet-ink`, misst dieses Blatt den neuen Ton. */
const token = (name: string): string => {
  const m = new RegExp(`--${name}:\\s*([^;]+);`).exec(PAINT_OVERLAY_CSS);
  if (m === null) throw new Error(`Token --${name} steht nicht im Stylesheet`);
  return m[1]!.trim();
};

/** Der Farbwert einer Klassenregel, ebenfalls aus dem Stylesheet. */
const klassenFarbe = (klasse: string): string => {
  const m = new RegExp(`\\.${klasse}\\s*\\{([^}]*)\\}`).exec(PAINT_OVERLAY_CSS);
  if (m === null) throw new Error(`.${klasse} steht nicht im Stylesheet`);
  const f = /color:\s*([^;]+);/.exec(m[1]!);
  if (f === null) throw new Error(`.${klasse} setzt keine Schriftfarbe`);
  return f[1]!.trim();
};

describe("der Rechner dieses Blattes ist geeicht", () => {
  // Ohne das misst der Rest nichts: ein kaputter Rechner liefert Zahlen, die
  // alle Schwellen bestehen, und dieses Blatt wäre grün und blind.
  it("trifft drei bekannte Paare exakt", () => {
    expect(kontrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21.0, 2);
    expect(kontrast([255, 255, 255], [255, 255, 255])).toBeCloseTo(1.0, 5);
    expect(kontrast([118, 118, 118], [255, 255, 255])).toBeCloseTo(4.54, 2);
  });

  it("rechnet Deckkraft als Ebene und trifft damit P7s gemessene 1,96 : 1", () => {
    // Der Beweis, dass dieses Blatt genau den Defekt sieht, für den es gebaut
    // wurde: dieselbe Rechnung, dieselben Farben, die alte Deckkraft.
    const papier = hex(token("pb-paper"));
    const tinte = hex(token("pb-quiet-ink"));
    expect(kontrast(ueber(tinte, papier, 0.46), papier)).toBeCloseTo(1.96, 2);
  });
});

describe("die Sammel-Legende ist lesbar, solange sie gebraucht wird", () => {
  it("liest die Datei, die sie beurteilt (nicht vakuum-grün)", () => {
    expect(src.length).toBeGreaterThan(1000);
    expect(code).toContain("uniformLegend(");
    expect(code).toContain("LEGENDE_NEIGUNG");
  });

  // ── GESETZ 1 · KEINE DÄMPFUNG DES UNGEFUNDENEN ────────────────────────────
  it("dämpft nichts mehr danach, ob es gefunden ist", () => {
    const treffer = [...code.matchAll(/opacity:\s*[^,}\n]*\bfound\b[^,}\n]*/g)].map((m) => m[0]);
    expect(treffer,
      "die Deckkraft hängt wieder am Fund — genau der Ausdruck, den P7 §2.2 gemessen hat").toEqual([]);
  });

  // ── GESETZ 2 · ZWEI SIGNALE FÜR DEN FUND ──────────────────────────────────
  it("markiert den Fund mit Marke UND Schrift, nicht mit einem einzigen Signal", () => {
    expect(code, "der gemalte Haken fehlt").toContain("<FoundMark");
    expect(code, "der Schriftwechsel gefunden/offen fehlt")
      .toMatch(/c\.found\s*\?\s*"pb-key-bit"\s*:\s*"pb-quiet"/);
    // …und die Marke hängt am Fund, steht also nicht einfach immer da
    expect(code).toMatch(/c\.found\s*&&\s*\(/);
  });

  // ── GESETZ 3 · DAS EIGENTLICHE · BEIDE ZUSTÄNDE ÜBER DEM BODEN ────────────
  //
  // Gemessen wird nicht der Quelltext, sondern was die zwei Klassen, die die
  // Legende benutzt, auf dem Papier dieses Hauses ERGEBEN. Der Boden ist der
  // für Fließtext (4,5 : 1) und nicht der für große Schrift (3 : 1): die Wörter
  // stehen bei 11,5 px.
  const BODEN = 4.5;
  it("stellt das OFFENE Wort über den Boden für Fließtext", () => {
    const papier = hex(token("pb-paper"));
    const tinte = hex(token("pb-quiet-ink"));
    const k = kontrast(tinte, papier);
    expect(k, `.pb-quiet steht bei ${k.toFixed(2)} : 1 auf dem Papier`).toBeGreaterThanOrEqual(BODEN);
  });

  it("stellt das GEFUNDENE Wort über den Boden — und deutlich über das offene", () => {
    const papier = hex(token("pb-paper"));
    const offen = kontrast(hex(token("pb-quiet-ink")), papier);
    const gefunden = kontrast(hex(klassenFarbe("pb-key-bit")), papier);
    expect(gefunden).toBeGreaterThanOrEqual(BODEN);
    // Der Abstand ist das zweite Signal. Er darf nicht auf »ein bisschen
    // dunkler« zusammenschrumpfen — genau das war die Abstufung, die drei
    // Leser als Rauschen gelesen haben.
    expect(gefunden / offen,
      `gefunden ${gefunden.toFixed(2)} : 1 gegen offen ${offen.toFixed(2)} : 1 — zu nah beieinander`)
      .toBeGreaterThanOrEqual(1.5);
  });

  it("hält die Schriftgröße, an der diese Zahlen hängen", () => {
    // Ein Boden von 4,5 : 1 gilt für Fließtext. Wüchse die Schrift auf über
    // 18,66 px (bzw. 14 px fett), dürfte sie auf 3 : 1 fallen — dann müsste
    // dieses Blatt neu geschrieben werden, statt still weiterzugelten.
    expect(code, "die 11,5 px der Legende stehen nicht mehr im Code").toContain("fontSize: 11.5");
  });
});

// ── R5-W8 · D6 · P7 §2.4 · DER WEG NACH VORN LIEGT NEBEN DEM BLATT ──────────
describe("eine Karte verliert ihren Weg nach vorn nicht unter der Kante", () => {
  it("liest die Datei, die sie beurteilt (nicht vakuum-grün)", () => {
    expect(code).toContain("pb-card-scroll");
    expect(code).toContain("auftaktFoot");
  });

  it("gibt `staged` einen dritten Platz NEBEN dem rollenden Blatt", () => {
    // Die Karte ist eine Flex-Spalte: das Blatt nimmt, was übrig bleibt, der Fuß
    // behält seine Zeilenhöhe. Läge er im Blatt, rollte er bei kleinem Fenster
    // mit hinaus — gemessen bei 760 x 700: Inhalt 484 gegen 406 sichtbare
    // Punkte, der Knopf bei y 553 in einem Blatt, das bei y 523 endet.
    expect(code, "`staged` nimmt keinen Fuß mehr entgegen")
      .toMatch(/const staged = \([^)]*foot: React\.ReactNode/);
    expect(code, "der Fuß wird nicht neben dem Blatt gezeichnet")
      .toMatch(/<div className="pb-card-scroll">\{children\}<\/div>\s*\{foot\}/);
  });

  it("legt keinen Fuß mehr INS Blatt", () => {
    // ein Fuß, der wieder im Kinder-Baum landet, ist genau der Rückfall
    const drin = [...code.matchAll(/\{auftaktFoot\(/g)].map((m) => m[0]);
    expect(drin, "eine Fußzeile steht wieder im rollenden Blatt (JSX-Kind statt Fuß-Platz)").toEqual([]);
    // …und es gibt überhaupt noch Füße (sonst wäre das oben vakuum-grün)
    expect([...code.matchAll(/^\s*auftaktFoot\("/gm)].length,
      "es wird gar keine Fußzeile mehr übergeben").toBeGreaterThanOrEqual(4);
  });

  it("hält die Fußzeilen an EINER Klasse, damit das Stylesheet sie erreicht", () => {
    expect([...code.matchAll(/className="pb-card-foot"/g)].length,
      "die Arena-Fußzeile trägt die Klasse nicht mehr").toBeGreaterThanOrEqual(2);
  });
});

// ── R5-W8 · D6 · P7 §3 · DIE ZWEI HANDLINIEN DER KARTE ──────────────────────
//
// Innenlinie und Außenkante lasen zwei blinde Prüfer 2 : 0 als »vom Rechner«.
// Beide sind jetzt EIN eingebetteter Strichzug in ».pb-card::before« — gestreckt
// statt gekachelt, weil der gekachelte Weg hier schon einmal blind verloren hat
// (D3b: »ein Stempel, kein Zufall«).
//
// Drei Dinge müssen halten, und alle drei sind Klassen, keine Instanzen:
// determiniert · die vier Seiten bleiben ungleich schwer · die vier inneren
// Radien stehen an zwei Stellen und dürfen nicht auseinanderlaufen.
describe("die zwei Handlinien der Karte", () => {
  const vorher = /\.pb-card::before\s*\{([\s\S]*?)\n\}/.exec(PAINT_OVERLAY_CSS)?.[1] ?? "";

  it("liest die Regel, die sie beurteilt (nicht vakuum-grün)", () => {
    expect(vorher.length, ".pb-card::before nicht gefunden").toBeGreaterThan(200);
    expect(vorher).toContain("data:image/svg+xml");
  });

  it("ist deterministisch — keine Zufallszahl und keine Uhr im Strich", () => {
    // Kokis Auflage 1 (22.08.): zwei Läufe müssen dasselbe Bild ergeben, sonst
    // rauschen Kartenbank-Vergleiche und der nächste Prüfer beurteilt die Kamera.
    expect(vorher).not.toMatch(/random|Math\.|Date|now\(/i);
  });

  it("hält acht Strichzüge — vier je Linie, damit die vier Seiten ungleich bleiben", () => {
    const zuege = [...vorher.matchAll(/stroke-width='([0-9.]+)'/g)].map((m) => Number(m[1]));
    expect(zuege.length, "die Linien sind wieder zu EINEM Zug zusammengefallen").toBe(8);
    // Dass sich gegenüberliegende Seiten zu ihrer Grundzahl summieren (die Hand
    // verteilt Gewicht um und fügt keines hinzu), ist R21s Gesetz und wird an
    // seinem angestammten Ort geprüft: `overlay-css.test.ts`. Hier steht die
    // Frage, die DIESE Runde stellt — trägt jede Seite ein EIGENES Gewicht?
    const [, , , , iT, iR, iB, iL] = zuege as number[];
    expect(new Set([iT, iR, iB, iL]).size, "die Innenlinie trägt wieder EIN Gewicht").toBe(4);
  });

  it("hält den Lückenrhythmus unregelmäßig (keine neue Regelmäßigkeit)", () => {
    for (const m of vorher.matchAll(/stroke-dasharray='([0-9 ]+)'/g)) {
      const werte = m[1]!.trim().split(/\s+/).map(Number);
      expect(werte.length, `ein Rhythmus aus ${werte.length} Werten ist wieder eine Regel`)
        .toBeGreaterThanOrEqual(6);
      expect(new Set(werte).size, "alle Lücken gleich lang — das ist die alte Regel").toBeGreaterThan(3);
    }
  });

  it("die vier inneren Radien im Strich stimmen mit --pb-card-r-in überein", () => {
    // Dieselben vier Zahlen stehen an zwei Stellen: im Token (lesbar) und in den
    // Bogen des SVG (wirksam). Das ist eine Drift-Klasse — hier ist ihr Wächter.
    const t = token("pb-card-r-in").replace(/px/g, "");
    const [waag, senk] = t.split("/").map((h) => h.trim().split(/\s+/).map(Number));
    // Bogen im SVG: A rx ry 0 0 1 …  — die vier der INNEREN Linie (die letzten vier)
    const bogen = [...vorher.matchAll(/A([0-9.]+) ([0-9.]+) 0 0 1/g)].map((m) => [Number(m[1]), Number(m[2])]);
    expect(bogen.length, "es stehen nicht acht Bogen im Strich").toBe(8);
    const innen = bogen.slice(4);
    // Reihenfolge der Züge: oben endet in Ecke oben-rechts, rechts in unten-rechts,
    // unten in unten-links, links in oben-links
    const sollRx = [waag![1], waag![2], waag![3], waag![0]];
    const sollRy = [senk![1], senk![2], senk![3], senk![0]];
    expect(innen.map((b) => b[0]), "waagrechte Radien der Innenlinie sind vom Token abgedriftet").toEqual(sollRx);
    expect(innen.map((b) => b[1]), "senkrechte Radien der Innenlinie sind vom Token abgedriftet").toEqual(sollRy);
  });
});
