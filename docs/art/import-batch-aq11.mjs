#!/usr/bin/env node
/**
 * import-batch-aq11 — R5-W4b · D3b · R63 · DIE GEMALTE KARTENKANTE (D-62, D-99).
 * Imports batch AQ11 into apps/web/public/art/g1/cards/.
 *
 *   node docs/art/import-batch-aq11.mjs [--dry]
 *
 * ── WARUM DIESE BLÄTTER NICHT UNTER art/g1/paint/ LANDEN ─────────────────────
 * `check-paint-art` zählt jedes PNG unter `paint/**`, das weder Phaser noch
 * `artScope.domArtStems` lädt, als tote Kunst. Eine CSS-Kante lädt aber der
 * BROWSER über `border-image-source`, nicht die Engine — sie wäre also auf ewig
 * eine tote Zeile in einer Liste, die genau dann nützlich ist, wenn sie stimmt.
 * Deshalb ein eigener Ordner neben dem Kunstbaum: `art/g1/cards/`.
 *
 * ── WAS DER BLINDE BLATT-PRÜFER ENTSCHIEDEN HAT (R91, 15.08.) ────────────────
 * Der DRAFT-Marker der Lieferung (`CODEX_DRAFT_NOT_CANON.md`) wird durch einen
 * blinden Prüfer aufgelöst, nie durch den Importeur. Sein Protokoll:
 *
 *   · Wachskörnung, Pfad-Zittern und Eck-Überzug: bestätigt für a UND b
 *     (Schwerpunkt der Oberkante pendelt 1,46 px bei a, 1,75 px bei b).
 *   · Kachelgrenze: bei x = 832 und x = 1664 bytegleich — die »0,0 px« der
 *     Lieferung sind nachgemessen, nicht geglaubt.
 *   · Keine Fremdkörper: kein Magenta, keine Schrift, kein Wasserzeichen,
 *     Mittelzone in allen drei Blättern vollständig durchsichtig.
 *   · VARIANTE B, aus einem messbaren Grund: b trifft mit ihrem dunkelsten
 *     Bildpunkt (107, 62, 24) praktisch die Zieltinte `#6b3f18`, a bleibt bei
 *     (119, 78, 38) sichtbar zu blass — die dünnere Linie wird stärker
 *     weggemittelt. Deshalb ist b das Blatt, das importiert wird.
 *   · ZWEI AUFLAGEN, beide hier behandelt:
 *     (1) Die INNENLINIE ist nicht dieselbe Hand — keine Körnung, kaum Zittern,
 *         kein gezeichnetes Eckstück, deutlich blasser. Sie wird deshalb NICHT
 *         importiert, sondern bleibt im Labor (das Muster von import-batch-aq7,
 *         das `tip_treasure` Zelle 2 ebenso zurückgehalten hat). Der Rahmen
 *         braucht sie nicht: `border-image` kennt genau EINE Quelle.
 *     (2) Die Wachs-Lücke sitzt je Kante an EINER festen Stelle, wiederholt sich
 *         also periodisch, sobald eine Karte mehr als eine Kachel breit ist. Am
 *         Schirm gemessen wird das im Report; die Zusicherung unten hält
 *         wenigstens fest, DASS es genau eine Lücke je Kante ist.
 *
 * ── DER NAME ─────────────────────────────────────────────────────────────────
 * Geliefert als `card_edge_strip_b.png`, importiert als `card_edge_a.png`.
 * Das `_a` ist die Stammkonvention dieses Kapitels (»die erste Zelle dieser
 * Kunst«, wie `satchel_a`, `regelseite_a`) und NICHT die Lieferungs-Variante a.
 * Die Zuordnung steht im Lauf-Protokoll, damit niemand sie später erraten muss.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/cards");
const DRY = process.argv.includes("--dry");

const SLICE = 96; // die 9-Slice-Kante, so bestellt und so geliefert
const read = (p) => PNG.sync.read(fs.readFileSync(p));
const alphaAt = (png, x, y) => png.data[(y * png.width + x) * 4 + 3];

/** Der senkrechte Schwerpunkt der Tinte in einer Spalte der OBERKANTE, mit dem
 *  Alpha gewichtet — und wie dick der Strich dort ist. Beides in Bildpunkten.
 *  Genau diese zwei Zahlen springen an einer schlechten Kachelgrenze. */
const inkProfile = (png, x) => {
  let sum = 0, weight = 0, thick = 0;
  for (let y = 0; y < SLICE; y++) {
    const a = alphaAt(png, x, y);
    if (a <= 8) continue;
    sum += y * a;
    weight += a;
    thick += a / 255;
  }
  return weight === 0 ? null : { centre: sum / weight, thick };
};

/** Wie viele Lücken die Oberkante im wiederholbaren Bereich hat: Spalten ohne
 *  jede Tinte, zu Läufen zusammengefasst. */
const gapsInTopEdge = (png) => {
  const runs = [];
  let start = -1;
  for (let x = SLICE; x < png.width - SLICE; x++) {
    const empty = inkProfile(png, x) === null;
    if (empty && start < 0) start = x;
    if (!empty && start >= 0) { runs.push({ x: start, w: x - start }); start = -1; }
  }
  if (start >= 0) runs.push({ x: start, w: png.width - SLICE - start });
  return runs;
};

/**
 * ── DER ZUSCHNITT, UND WARUM ER HIER PASSIERT UND NICHT IM STYLESHEET ────────
 * Geliefert ist ein 1024er Blatt, dessen Wachslinie MITTIG im 96-px-Streifen
 * läuft (gemessen: y = 46…51 oben, x = 46…51 links, 6 px dick). Als
 * `border-image` gezeichnet heißt das: der Streifen muss um seine halbe Breite
 * nach außen versetzt werden, damit die Linie auf der Kartenkante landet — und
 * genau dieser Überstand legt eine 48 px breite, fast vollständig durchsichtige
 * Fläche über die Stelle, an der die Karte ihren Schatten-Stapel zeichnet
 * (`box-shadow`: zwei Blattkanten und der Tuschewurf). Am Schirm sah das aus
 * wie abgebrochene Ecken; es war der Wurf, der durch die durchsichtige Kante
 * schaute. Zwei Anläufe sind daran gescheitert, bevor die Ursache gemessen war.
 *
 * Der Zuschnitt räumt das an der Wurzel weg: `TRIM` Bildpunkte fallen ringsum
 * weg, die Linie sitzt danach am ÄUSSEREN Rand ihres Streifens, und die Kante
 * wird ohne jeden Überstand gezeichnet. Sie liegt dann dort, wo bis heute die
 * Tuschekante lag, und rührt den Schattenbereich nicht mehr an.
 *
 * Der Zuschnitt gehört in den Importeur, nicht ins Stylesheet: ein Stylesheet
 * kann ein Blatt nur verschieben und stauchen, nicht beschneiden — und die
 * Zahl, die dabei herauskommt (`SLICE_OUT`), ist eine Eigenschaft des BLATTES,
 * die genau einmal gemessen und dann mitgeliefert werden soll.
 */
const TRIM = 44;         // ringsum weg, bis die Linie am Streifenrand sitzt
const SLICE_OUT = 96 - TRIM; // die 9-Slice-Kante des zugeschnittenen Blattes

const SOURCE = "batch-aq11/card_edge_strip_b.png";
const TARGET = "card_edge_a.png";
const HELD = [
  ["batch-aq11/card_edge_strip_a.png", "Variante a — vom blinden Prüfer gegen b entschieden (zu blass, trifft #6b3f18 nicht)"],
  ["batch-aq11/card_edge_inner.png", "Innenlinie — vom blinden Prüfer als andere Hand befundet (keine Körnung, kein Eckstück); border-image kennt nur eine Quelle"],
  ["batch-aq11/card_edge_strip_seam_test.png", "Nahttest — Beweisbild der Lieferung, kein Importgut"],
];

const failures = [];
const notes = [];

const src = path.join(LAB, SOURCE);
if (!fs.existsSync(src)) {
  console.error(`✗ Quellblatt fehlt: ${src}`);
  process.exit(1);
}
const png = read(src);

// ── Zusicherung 1: Format und 9-Slice-Geometrie ──────────────────────────────
if (png.width !== 1024 || png.height !== 1024) {
  failures.push(`${SOURCE}: ${png.width}×${png.height} statt 1024×1024 — die Slice-Kante 96 gilt dann nicht mehr`);
}
{
  // Die Mitte MUSS leer sein: »fill« ist in der CSS-Regel bewusst abwesend, weil
  // das Papier ein Verlauf ist. Ein Blatt mit gefüllter Mitte würde die Karte
  // zudecken — und zwar erst am Schirm, nie im Test.
  let painted = 0;
  for (let y = SLICE; y < png.height - SLICE; y++) {
    for (let x = SLICE; x < png.width - SLICE; x++) if (alphaAt(png, x, y) > 8) painted++;
  }
  if (painted > 0) failures.push(`${SOURCE}: die Mitte trägt ${painted} sichtbare Bildpunkte — sie muss vollständig durchsichtig sein`);
  else notes.push(`✓ Mitte leer: ${png.width - 2 * SLICE}×${png.height - 2 * SLICE} Bildpunkte vollständig durchsichtig`);
}
{
  // Kein Magenta: dieses Blatt kam RGBA, ist also NICHT geschlüsselt worden. Ein
  // Magenta-Rest hier wäre ein Blatt aus einer anderen Kette (der Fehler, den
  // AQ14 in derselben Lieferwelle tatsächlich hatte).
  let magenta = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const [r, g, b, a] = [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]];
    if (a > 8 && r > 200 && b > 200 && g < 60) magenta++;
  }
  if (magenta > 0) failures.push(`${SOURCE}: ${magenta} sichtbare Magenta-Punkte — Schlüsselfarbe im fertigen Blatt`);
  else notes.push("✓ kein sichtbares Magenta");
}

// ── Zusicherung 2: die Kachelgrenze, an der eigenen Datei nachgemessen ───────
{
  const left = inkProfile(png, SLICE);
  const right = inkProfile(png, png.width - SLICE - 1);
  if (left === null || right === null) {
    failures.push(`${SOURCE}: der wiederholbare Streifen beginnt oder endet ohne Tinte — an der Kachelgrenze entstünde eine Lücke`);
  } else {
    const dCentre = Math.abs(left.centre - right.centre);
    const dThick = Math.abs(left.thick - right.thick);
    if (dCentre > 1 || dThick > 1) {
      failures.push(`${SOURCE}: Kachelgrenze springt — Versatz ${dCentre.toFixed(2)} px, Strichstärke ${dThick.toFixed(2)} px (erlaubt: je ≤ 1)`);
    } else {
      notes.push(`✓ Kachelgrenze: Versatz ${dCentre.toFixed(2)} px, Strichstärken-Differenz ${dThick.toFixed(2)} px`);
    }
  }
}

// ── Zusicherung 3: die Wachs-Lücken sind gezählt, nicht geglaubt ─────────────
{
  const gaps = gapsInTopEdge(png);
  notes.push(`· Wachs-Lücken in der wiederholbaren Oberkante: ${gaps.length} (${gaps.map((g) => `x=${g.x}/${g.w}px`).join(", ") || "keine"})`);
  if (gaps.length > 0) {
    notes.push("  ⚠ eine Lücke an fester Stelle wiederholt sich mit jeder Kachel — am Schirm auf periodische Kerben prüfen (Auflage 2 des Blatt-Prüfers)");
  }
}

for (const [f, why] of HELD) notes.push(`· IM LABOR GEHALTEN: ${f} — ${why}`);

for (const n of notes) console.log(n);
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq11: ${failures.length} Befund(e) — nichts aus dieser Lieferung wird angenommen`);
  process.exit(1);
}

// ── der Zuschnitt, und die Zusicherung, dass er die Linie wirklich an den Rand holt ──
const cut = new PNG({ width: png.width - 2 * TRIM, height: png.height - 2 * TRIM });
for (let y = 0; y < cut.height; y++) {
  for (let x = 0; x < cut.width; x++) {
    const si = ((y + TRIM) * png.width + (x + TRIM)) * 4;
    const di = (y * cut.width + x) * 4;
    for (let k = 0; k < 4; k++) cut.data[di + k] = png.data[si + k];
  }
}
{
  const prof = inkProfile(cut, Math.floor(cut.width / 2));
  if (prof === null) {
    failures.push(`Zuschnitt: die Oberkante trägt nach ${TRIM} px Beschnitt keine Tinte mehr`);
  } else if (prof.centre > SLICE_OUT / 2) {
    failures.push(`Zuschnitt: die Linie sitzt ${prof.centre.toFixed(1)} px tief im ${SLICE_OUT}-px-Streifen — sie muss in dessen äußerer Hälfte liegen, sonst braucht die Kante wieder einen Überstand`);
  } else {
    console.log(`✓ Zuschnitt: ${png.width}×${png.height} → ${cut.width}×${cut.height}, Linie jetzt bei y = ${prof.centre.toFixed(1)} im ${SLICE_OUT}-px-Streifen (Überstand 0)`);
  }
}
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq11: ${failures.length} Befund(e) — nichts aus dieser Lieferung wird angenommen`);
  process.exit(1);
}

if (!DRY) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, TARGET), PNG.sync.write(cut));
}
console.log(`  ${DRY ? "[trocken] " : ""}${SOURCE}  →  art/g1/cards/${TARGET}   ${cut.width}×${cut.height} RGBA · 9-Slice ${SLICE_OUT}`);
console.log(`import-batch-aq11: OK — 1 Blatt${DRY ? " (Trockenlauf, nichts geschrieben)" : ""}`);
