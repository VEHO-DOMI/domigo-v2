// PB-C1 · THE LETTER TRAIL — doc 36 §3: "letters render their REAL glyphs".
//
// Until now every collectible drew the one painted stem `prop_letter`, which
// is a painted gold capital **A** — so a trail of eight letters spelled AAAA
// AAAA. The stem is retired from the letter face; the engine now draws the
// character itself in that stem's key (warm gold, amber contour, soft shadow).
//
// WHERE THE CHARACTERS COME FROM. The ch01 design sheet's currency row is the
// law: "trails are sentences: each breadcrumb run spells a REAL u01 word
// (P-E-N-C-I-L → the trail's end holds that thing)". A phase that names its
// words in the composition manifest spells them, in traversal order. A phase
// that names none falls back to a deterministic A→Z walk — still a real,
// DISTINCT character per collectible, never the repeated A.

// ── R5-W6 · L1 · EINE QUELLE FUER DAS GOLD (R146) ───────────────────────────
// Bis heute stand dieselbe Farbe dreimal im Repo: hier als CSS-Zeichenkette,
// in PaintScene als `PULL_COLOUR = 0xf7c93f` fuer den Magnet-Streifen, und in
// der Prosa des AQ10-Importeurs als »Gold 0xf0c040« — letzteres schon falsch.
// Jetzt steht die ZAHL einmal, und die Zeichenkette wird daraus gerechnet.
const css = (n: number): string => `#${n.toString(16).padStart(6, "0")}`;

/** Das Gold der Sammelbuchstaben. **Kanon (R41)** — es wird nicht veraendert;
 *  die Trennung von der Wand entsteht am Rand, nicht an der Fuellung. */
export const LETTER_GOLD = 0xf7c93f;
/** Der tiefere Ton am unteren Ende des Fuell-Verlaufs. */
export const LETTER_GOLD_DEEP = 0xe0a021;
/** Die bernsteinfarbene Kontur, die das Gold seit jeher traegt. */
export const LETTER_AMBER = 0xa2560f;
/** Die Tinte des Buches (`cue.ts CUE_INK`, `LETTER_STYLE.shadow`) — KEINE neue
 *  Farbe: das Malbuch schreibt, zeichnet und umrandet in genau diesem Blau. */
export const LETTER_INK = 0x243048;
/** Die warme Kreide, in der das Buch seine Lichter setzt (PaintScene
 *  LETTER_HALO_COLOUR). Ebenfalls Bestand. */
export const LETTER_CREAM = 0xfff4cf;
/** Das Kreide-Weiss des Buches (`cue.ts CUE_CORE`) — der Rand im dunklen Raum.
 *  Die WARME Kreide taugt dafuer nicht: gegen das Gold steht sie bei ΔL 43 und
 *  ΔH 1°, also unter dem Kriterium — ein Rand, den man vom Buchstaben nicht
 *  unterscheiden kann, ist kein Rand. Gemessen, nicht geschaetzt. */
export const LETTER_CHALK = 0xfffdf6;

/** The painted stem's own key, matched by the engine-drawn glyph. */
export const LETTER_STYLE = {
  fill: css(LETTER_GOLD),
  fillDeep: css(LETTER_GOLD_DEEP),
  stroke: css(LETTER_AMBER),
  strokeWidth: 3,
  shadow: "rgba(36,48,72,0.45)",
  font: "bold 96px Georgia, 'Times New Roman', serif",
} as const;

// ── DER RAUM ENTSCHEIDET, WELCHE FARBE DER RAND TRAEGT ───────────────────────
//
// Gemessen am Schirm (R5-W6 · L1, 18.08., `measure-presence --letters`):
//
//   Phase   Schluessel   ΔL Buchstabe↔Grund      ΔH        trennt
//   p1      88 (hell)    −14 … −16               2–5°      0 von 9
//   p3      86 (hell)    +1 … +28                0–18°     0 von 6
//   p2      30 (dunkel)  +11 … +37               44–66°    2 von 5
//   p9      14 (dunkel)  +8  … +47               8–89°     5 von 7
//
// Die HELLEN Raeume sind der Schaden, und sie sind es aus demselben Grund, aus
// dem die dunklen gutgehen: das Gold ist ein warmer, mittelheller Ton. Vor einer
// blassgelben Wand ist es Familie; vor einer tintenblauen Wand ist es ein Signal.
//
// Also folgt der Rand dem Raum, statt eine Farbe fuer alle zu sein — dieselbe
// Bauart, die `check-composition.mjs#bandsFor(K)` fuer die Wertebaender schon
// hat: EIN Gesetz, das eine sonnige Halle und einen Tintentraum beide bedient.
// Der Satz dazu: **der Buchstabe traegt das Gegenteil seines Raumes.**
// Hell ⇒ Tinte. Dunkel ⇒ Kreide. Die Fuellung bleibt in beiden Faellen Gold.
//
// Warum nicht einfach ueberall Tinte: in p9 traegt der positive ΔL die Trennung
// (+47 bei S/C/O). Eine dunkle Kontur nimmt genau davon weg — eine Reparatur
// fuer p1, die p9 kostet, ist keine Reparatur.

/** Wo ein Raum zwischen »dunkel« (0) und »hell« (1) steht. Die Schwelle liegt
 *  zwischen p2 (30) und p3 (86); die Rampe ist breit genug, dass ein Raum
 *  dazwischen keinen Sprung macht. */
export const roomBrightness = (key: number): number =>
  Math.max(0, Math.min(1, (key - 40) / 30));

/** Die Kontur unter der bernsteinfarbenen: Farbe und Breite in TEXTUR-px
 *  (`letterTex` zeichnet auf einer 128er Leinwand, der Buchstabe wird bei 14 px
 *  angezeigt — 128/14 ≈ 9,1 Textur-px je Anzeige-px). */
export interface LetterRim {
  /** 0xRRGGBB — Tinte im hellen Raum, Kreide im dunklen. */
  colour: number;
  /** Strichbreite auf der Textur; die Haelfte davon waechst nach aussen. */
  width: number;
  /** Deckkraft der Kontur (die Kreide traegt weniger, sonst frisst sie das Gold). */
  alpha: number;
}

/**
 * DIE BREITE IST EIN KOMPROMISS MIT DER LESBARKEIT, und der Grund steht hier,
 * damit ihn niemand fuer eine Bequemlichkeit haelt: die Kette BUCHSTABIERT ein
 * Wort (SCHOOLBAG, PROJECTOR, GLUESTICK), und `check-composition`s Glyphen-Tor
 * besteht darauf, dass jedes Zeichen ein echtes Zeichen ist. Bei 14 px Anzeige
 * schliesst eine zu fette Kontur die Innenraeume von O, G und C — dann ist die
 * Kontrast-Reparatur ein Lesbarkeits-Schaden. 26 Textur-px sind 13 nach aussen,
 * also rund 1,4 Anzeige-px Rand: gemessen die breiteste Kontur, bei der das O
 * seinen Innenraum behaelt.
 */
export const RIM_WIDTH_MAX = 26;

export const letterRimFor = (key: number): LetterRim => {
  const t = roomBrightness(key);
  return t >= 0.5
    ? { colour: LETTER_INK, width: RIM_WIDTH_MAX * t, alpha: 1 }
    : { colour: LETTER_CHALK, width: RIM_WIDTH_MAX * 0.62 * (1 - t), alpha: 0.85 };
};

// ── DIE ZWEITE HAELFTE: DER GRUND WIRD DUNKLER, NICHT DAS DING HELLER ────────
//
// R37, woertlich: „die Regel-Seite braucht Saettigung VOR ABGEDUNKELTER FLAECHE,
// nicht mehr Helligkeit." Der geprüfte Referenzsatz sagt dasselbe in einem Bild
// (Kriterium a): Raymans Sammelkugeln stehen vor einer BEWUSST ABGEDUNKELTEN
// Wand — nicht vor einer helleren.
//
// Und es ist die einzige Antwort, die p1 und p3 wirklich haben. Aus den Quellen
// gemessen steht das Gold der Buchstaben (Luminanz 201) gegen die L1-Wand von p1
// (199) bei ΔL +1,8 und ΔH 5°: die Wand IST die Farbe des Buchstabens. Ein Rand
// macht daraus eine lesbare Form — aber die FLAECHE, das, was ein Kind bei 14 px
// zuerst sieht, bleibt Gold auf Gold. Dagegen hilft nur, den Grund direkt hinter
// dem Buchstaben zurueckzunehmen.
//
// Im dunklen Raum entfaellt sie ersatzlos: dort traegt der positive ΔL (+35 bis
// +47 gemessen) die Trennung, und ein dunkler Hof auf dunkler Wand ist nichts
// als verlorene Fuellrate.
export interface LetterBacking {
  /** 0xRRGGBB — die Tinte des Buches. */
  colour: number;
  /** Deckkraft im aeussersten Ring; 0 = keine Hinterlegung. */
  alpha: number;
}

/** Die staerkste Hinterlegung, die ein Raum bekommt. Gerechnet, nicht gewaehlt:
 *  p1s Wand steht bei 199, die Tinte bei 47 — 0,28 Deckkraft schiebt den Grund
 *  auf 157 und damit das Gold auf ΔL +44 gegen seinen eigenen Hof. */
export const BACKING_ALPHA_MAX = 0.28;

/** Wie weit der Hof reicht, als Vielfaches von `PaintScene.LETTER_HALO_R` (8,5).
 *  Der Ring, gegen den `measure-presence` misst, liegt bei 0,8–1,2 Objekthoehen,
 *  also 11–17 px bei 14 px Anzeige; 2,1 × 8,5 = 17,9 px deckt ihn gerade ab.
 *  Ein Hof, der den gemessenen Ring nicht erreicht, kann dort nichts bewirken
 *  (R28: der Radius IST die Kante). */
export const BACKING_REACH = 2.1;
/** In wie vielen Schritten der Hof ausblendet. Drei (die Zahl der Licht-Ringe)
 *  waren am Bild als KREISE zu sehen — ein Hof, den man als Ring erkennt, ist
 *  ein Fleck auf der Wand statt eines Schattens. Sechs Schritte sind glatt, und
 *  sechs Fuellkreise je Buchstabe sind auf einem Bild mit neun Buchstaben
 *  54 Kreise: nichts, was ein Budget bemerkt. */
export const BACKING_STEPS = 6;

export const letterBackingFor = (key: number): LetterBacking =>
  ({ colour: LETTER_INK, alpha: BACKING_ALPHA_MAX * roomBrightness(key) });

/** Ein Grund, hinter den die Hinterlegung gelegt wurde — als Farbkanaele, damit
 *  Renderer und Tor DIESELBE Rechnung fahren. */
export const backedGround = (groundRGB: readonly [number, number, number], b: LetterBacking): [number, number, number] => {
  const ch = (v: number, shift: number): number =>
    Math.round(v * (1 - b.alpha) + ((b.colour >> shift) & 0xff) * b.alpha);
  return [ch(groundRGB[0], 16), ch(groundRGB[1], 8), ch(groundRGB[2], 0)];
};

/**
 * Wie stark der Schein HINTER dem Buchstaben traegt. Er ist warmes Licht und im
 * hellen Raum arbeitet er GEGEN die Trennung (er hellt den Ring auf, gegen den
 * gemessen wird). Also faehrt er dort zurueck und laesst die Kontur arbeiten.
 * 1 = der Bestandswert, 0 = kein Schein.
 */
export const letterGlowGain = (key: number): number => 1 - 0.72 * roomBrightness(key);

export interface LetterGlyph {
  c: number;
  r: number;
  char: string;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Every `*` cell with the character it renders, in TRAVERSAL order (left to
 * right, top to bottom on ties) — the order a player actually collects them.
 */
export const letterGlyphs = (rows: readonly string[], words?: readonly string[]): LetterGlyph[] => {
  const cells: Array<{ c: number; r: number }> = [];
  rows.forEach((row, r) => {
    [...row].forEach((g, c) => {
      if (g === "*") cells.push({ c, r });
    });
  });
  cells.sort((a, b) => a.c - b.c || a.r - b.r);

  const spelled = (words ?? []).join("").toUpperCase().replace(/[^A-Z]/g, "");
  return cells.map((cell, i) => ({
    ...cell,
    char: spelled.length > 0 ? (spelled[i % spelled.length] ?? "?") : (ALPHABET[i % ALPHABET.length] ?? "?"),
  }));
};
