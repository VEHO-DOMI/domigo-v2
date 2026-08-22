#!/usr/bin/env node
/**
 * import-batch-aq17 — R5-W6b · D4 + R5-W7 · D5 · DAS GEMALTE KARTEN-MATERIAL:
 * das Papier der Karte, die Knopf-Zellen und die PLAKETTEN unter den Chips.
 * Imports batch AQ17/AQ17C into apps/web/public/art/g1/cards/.
 *
 *   node docs/art/import-batch-aq17.mjs [--dry]
 *   node docs/art/import-batch-aq17.mjs --selftest      (ohne Labor, ohne Repo-Kunst)
 *
 * ── WARUM DIESE BLÄTTER NICHT UNTER art/g1/paint/ LANDEN ─────────────────────
 * Dieselbe Begründung wie bei AQ11 (import-batch-aq11.mjs): `check-paint-art`
 * zählt jedes PNG unter `paint/**`, das weder Phaser noch `artScope.domArtStems`
 * lädt, als TOTE Kunst. Ein Karten-Untergrund lädt aber der BROWSER über
 * `background-image`, nicht die Engine — er wäre also auf ewig eine tote Zeile
 * in einer Liste, die genau dann nützlich ist, wenn sie stimmt. Deshalb der
 * eigene Ordner neben dem Kunstbaum, in dem schon `card_edge_a.png` liegt.
 * Die Decke DEAD_ART_CEILING bleibt davon unberührt: 53 vorher, 53 nachher
 * (D-452, Register-Zeile).
 *
 * ── WAS AUS WELCHER LIEFERUNG KOMMT (Wareneingänge R168 · R189 · D5 20./21.08.)
 *
 *   AQ17   ANGENOMMEN  card_paper.png    beidachsig kachelbar, undurchsichtig
 *   AQ17   ANGENOMMEN  card_buttons.png  vier 512er Zellen: Ruhe · gedrückt ·
 *                                        Ghost · Reserve
 *   AQ17   ZURÜCK      card_frame.png / card_frame_inner.png — der Wiederhol-
 *               streifen trägt seine Lücke an EINER festen Stelle, also kehrt
 *               sie bei jeder Kachel wieder (8,59× statt ≤ 1,5×). Dasselbe wie
 *               bei AQ11, nicht durch Zahlen im Stylesheet zu heilen.
 *   AQ17   ZURÜCK      card_plaques.png — einheitlicher Eckradius, wo die Karte
 *               vier verschiedene trägt. Nachbestellt als AQ17b.
 *   AQ17C  ANGENOMMEN  card_plaques.png Z0 + Z1 — die Nachbestellung sitzt: die
 *               vier Radien stimmen auf den Bildpunkt mit dem, was das
 *               Stylesheet zeichnet (dieses Skript liest sie DORT, nicht hier).
 *               Zellweise angenommen (R132): Z2/Z3 bleiben im Labor.
 *   AQ17C  GEHALTEN    card_buttons_9slice.png — GEMESSENER Befund, siehe
 *               `probeNineSlice` unten. Kurz: alle vier Ecken tragen denselben
 *               Radius (33 px), in allen vier Zellen. Das ist genau der Fehler,
 *               für den AQ17s Plaketten zurückgingen — und dieselbe Lieferung
 *               beweist mit ihren Plaketten, dass der Maler die vier Radien
 *               kann. Die Stauchung (D-365/R172) bleibt damit offen.
 *   AQ17C  ZURÜCK      card_paper.png (NEU) — Rauhheit 0,324, Streifen. Das
 *               ALTE Papier aus AQ17 bleibt im Spiel.
 *
 * ── WAS DIESE DATEI NACHMISST STATT ES ZU GLAUBEN ────────────────────────────
 * Der Lieferschein nennt Zahlen; ein Lieferschein ist keine Messung (R202: auch
 * ein »pass: true« ist keiner). Geprüft wird hier alles, worauf das Stylesheet
 * sich verlässt: Format, Undurchsichtigkeit des Papiers, die Kachelgrenzen in
 * BEIDEN Achsen, die vier Zellenkästen des Knopfblattes, die vier Eckradien der
 * Plaketten gegen das Stylesheet und die Kontraste gegen das gemessene Papier.
 * Ein Blatt, das hier durchfällt, wird nicht importiert — auch nicht »vorläufig«.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/cards");
const CSS = path.join(process.cwd(), "packages/game-paint/src/cards/overlay-css.ts");
const DRY = process.argv.includes("--dry");

const read = (p) => PNG.sync.read(fs.readFileSync(p));
const at = (png, x, y) => {
  const i = (y * png.width + x) * 4;
  return [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]];
};

/** relative Helligkeit nach WCAG — dieselbe Rechnung wie in den Farb-Toren */
const lum = ([r, g, b]) => {
  const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const [hi, lo] = lum(a) >= lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
  return (hi + 0.05) / (lo + 0.05);
};

/** mittlere Farbe eines Rechtecks, nur über SICHTBARE Punkte */
const meanOf = (png, x0, y0, x1, y1) => {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const [pr, pg, pb, pa] = at(png, x, y);
      if (pa <= 8) continue;
      r += pr; g += pg; b += pb; n++;
    }
  }
  return n === 0 ? null : [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
};

/** Mittlerer Farbabstand zweier Bildpunkt-Reihen. An der Kachelgrenze steht
 *  der Sprung von der letzten zur ersten Spalte gegen den Sprung, den die
 *  Textur mit sich selbst macht — eine Naht ist nur dann eine, wenn sie
 *  DEUTLICHER ist als das eigene Rauschen. */
const rowStep = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (Math.abs(a[i][0] - b[i][0]) + Math.abs(a[i][1] - b[i][1]) + Math.abs(a[i][2] - b[i][2])) / 3;
  return s / a.length;
};

const SEAM_MAX = 1.5;   // Naht darf höchstens 1,5× so laut sein wie die Textur selbst
const CONTRAST_MIN = 1.3; // Kokis Zahl für „das Ding hebt sich vom Papier ab"
const RADIUS_TOL = 2;   // ±2 px, wie die Bestellung es sagt

/** Sichtbares Magenta — die Schlüsselfarbe darf im fertigen Blatt nicht stehen. */
const magentaCount = (png) => {
  let n = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const [r, g, b, a] = [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]];
    if (a > 8 && r > 200 && b > 200 && g < 60) n++;
  }
  return n;
};

/** Der Kasten der Malerei in einer Zelle: was NICHT durchsichtig ist. */
const boxOf = (png, cx, cw, ch) => {
  let x0 = cw, x1 = -1, y0 = ch, y1 = -1;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      if (at(png, cx * cw + x, y)[3] <= 8) continue;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  return x1 < 0 ? null : { x0, x1, y0, y1 };
};

/** Die vier Eckradien einer Malerei, von der Alpha-Maske ABGELESEN.
 *
 *  Wie: an der obersten Zeile des Kastens sagt der erste sichtbare Punkt, wie
 *  weit die linke obere Ecke eingezogen ist — das IST der waagrechte Radius
 *  eines abgerundeten Rechtecks. Dasselbe an der linken Spalte für den
 *  senkrechten. Vier Ecken, je zwei Zahlen; die Reihenfolge ist die des
 *  Stylesheets (oben-links, oben-rechts, unten-rechts, unten-links). */
const cornerRadii = (png, cx, cw, box) => {
  const A = (x, y) => at(png, cx * cw + x, y)[3] > 8;
  const scanX = (y, from, dir) => { for (let x = from; x >= box.x0 && x <= box.x1; x += dir) if (A(x, y)) return Math.abs(x - from); return null; };
  const scanY = (x, from, dir) => { for (let y = from; y >= box.y0 && y <= box.y1; y += dir) if (A(x, y)) return Math.abs(y - from); return null; };
  return {
    tl: [scanX(box.y0, box.x0, 1), scanY(box.x0, box.y0, 1)],
    tr: [scanX(box.y0, box.x1, -1), scanY(box.x1, box.y0, 1)],
    br: [scanX(box.y1, box.x1, -1), scanY(box.x1, box.y1, -1)],
    bl: [scanX(box.y1, box.x0, 1), scanY(box.x0, box.y1, -1)],
  };
};

/** Die vier Eckradien, die die KARTE zeichnet — aus dem Stylesheet gelesen und
 *  nicht hier getippt. Eine Plakette, die unter einem Chip liegt, muss die
 *  Ecken dieses Chips haben; welche das sind, weiß nur das Stylesheet. */
const chipRadii = (cssText) => {
  const m = /--pb-chip-r:\s*([^;]+);/.exec(cssText);
  if (m === null) return null;
  const [h, v] = m[1].split("/").map((s) => s.trim().split(/\s+/).map((t) => Number(t.replace("px", ""))));
  if (h === undefined || v === undefined || h.length !== 4 || v.length !== 4) return null;
  // CSS zählt oben-links, oben-rechts, unten-rechts, unten-links
  return { tl: [h[0], v[0]], tr: [h[1], v[1]], br: [h[2], v[2]], bl: [h[3], v[3]] };
};

// ── DIE PROBEN, je als reine Funktion (damit der Selbsttest sie füttern kann) ─

export function probePaper(paper) {
  const fail = [], notes = [];
  if (paper.width !== 512 || paper.height !== 512) {
    fail.push(`card_paper.png: ${paper.width}×${paper.height} statt 512×512`);
    return { fail, notes };
  }
  let clear = 0;
  for (let i = 3; i < paper.data.length; i += 4) if (paper.data[i] < 255) clear++;
  if (clear > 0) fail.push(`card_paper.png: ${clear} Punkte sind nicht voll deckend — der Untergrund einer Karte muss decken`);
  else notes.push("✓ Papier deckt vollständig (kein einziger halbdurchsichtiger Punkt)");
  const mag = magentaCount(paper);
  if (mag > 0) fail.push(`card_paper.png: ${mag} sichtbare Magenta-Punkte — Schlüsselfarbe im fertigen Blatt`);
  else notes.push("✓ kein sichtbares Magenta im Papier");

  const col = (x) => Array.from({ length: paper.height }, (_, y) => at(paper, x, y));
  const row = (y) => Array.from({ length: paper.width }, (_, x) => at(paper, x, y));
  const hR = rowStep(col(paper.width - 1), col(0)) / rowStep(col(0), col(1));
  const vR = rowStep(row(paper.height - 1), row(0)) / rowStep(row(0), row(1));
  if (hR > SEAM_MAX || vR > SEAM_MAX) {
    fail.push(`card_paper.png: Kachelgrenze sichtbar — waagrecht ${hR.toFixed(2)}×, senkrecht ${vR.toFixed(2)}× (erlaubt ≤ ${SEAM_MAX}×)`);
  } else {
    notes.push(`✓ Kachelgrenzen: waagrecht ${hR.toFixed(2)}× · senkrecht ${vR.toFixed(2)}× der eigenen Textur (≤ ${SEAM_MAX}×)`);
  }
  const mean = meanOf(paper, 0, 0, paper.width - 1, paper.height - 1);
  notes.push(`· Papier-Mittel: rgb(${mean.join(", ")}) — das Stylesheet-Papier --pb-paper ist #fff2cd = rgb(255, 242, 205)`);
  return { fail, notes, mean };
}

export function probeButtons(buttons, paperMean) {
  const fail = [], notes = [], CELL = 512;
  if (buttons.width !== 4 * CELL || buttons.height !== CELL) {
    fail.push(`card_buttons.png: ${buttons.width}×${buttons.height} statt ${4 * CELL}×${CELL} — die Zellenrechnung im CSS gilt dann nicht mehr`);
    return { fail, notes };
  }
  const boxes = [];
  for (let c = 0; c < 4; c++) {
    const b = boxOf(buttons, c, CELL, CELL);
    if (b === null) { fail.push(`card_buttons.png: Zelle ${c} ist vollständig leer`); continue; }
    boxes.push({ c, ...b });
    notes.push(`· Zelle ${c}: gemalter Kasten x ${b.x0}–${b.x1} · y ${b.y0}–${b.y1} (${b.x1 - b.x0 + 1}×${b.y1 - b.y0 + 1})`);
  }
  for (const b of boxes) {
    if (b.x0 < 8 || b.x1 > CELL - 9) fail.push(`card_buttons.png: Zelle ${b.c} reicht bis an ihren Zellenrand (x ${b.x0}–${b.x1}) — beim Verschieben blutet die Nachbarzelle herein`);
  }
  const used = boxes.filter((b) => b.c < 3);
  const widths = used.map((b) => b.x1 - b.x0 + 1);
  if (widths.length > 0 && Math.max(...widths) - Math.min(...widths) > 4) {
    fail.push(`card_buttons.png: die drei Zustände sind verschieden breit (${widths.join(" / ")}) — der Knopf würde beim Drücken die Breite wechseln`);
  } else if (widths.length > 0) {
    notes.push(`✓ die drei Zustände sind gleich breit (${widths.join(" / ")} px, Abweichung ≤ 4)`);
  }
  for (const b of used) {
    const inner = meanOf(buttons, b.c * CELL + b.x0 + 40, b.y0 + 40, b.c * CELL + b.x1 - 40, b.y1 - 40);
    const k = contrast(inner, paperMean);
    if (k < CONTRAST_MIN) fail.push(`card_buttons.png: Zelle ${b.c} steht nur ${k.toFixed(3)} : 1 gegen das Papier (gefordert ≥ ${CONTRAST_MIN} : 1)`);
    else notes.push(`✓ Zelle ${b.c} gegen Papier: ${k.toFixed(3)} : 1 — rgb(${inner.join(", ")})`);
  }
  const mag = magentaCount(buttons);
  if (mag > 0) fail.push(`card_buttons.png: ${mag} sichtbare Magenta-Punkte`);
  else notes.push("✓ kein sichtbares Magenta im Knopfblatt");
  return { fail, notes };
}

/**
 * DIE PLAKETTEN (R5-W7 · D5). Zellweise: angenommen wird, was seine Ecken hat.
 *
 * Warum die Ecken hier alles entscheiden: eine Plakette IST die Rückseite eines
 * Chips. Die Karte zeichnet ihre Chips mit vier VERSCHIEDENEN Radien (das ist
 * Kokis »schiefe Chips«-Tor G2), und genau daran ist AQ17s erste Plaketten-
 * lieferung gescheitert. Die Sollwerte stehen deshalb nicht in dieser Datei,
 * sondern werden aus dem Stylesheet gelesen: was die Karte zeichnet, ist das
 * Maß — nicht, was ein Importeur einmal abgeschrieben hat.
 */
export function probePlaques(plaques, paperMean, want, accept = [0, 1]) {
  const fail = [], notes = [], CELL = 512, cells = [];
  if (want === null) { fail.push("card_plaques.png: --pb-chip-r ist im Stylesheet nicht lesbar — ohne Sollradien keine Abnahme"); return { fail, notes, cells }; }
  if (plaques.width !== 4 * CELL || plaques.height !== CELL) {
    fail.push(`card_plaques.png: ${plaques.width}×${plaques.height} statt ${4 * CELL}×${CELL}`);
    return { fail, notes, cells };
  }
  const mag = magentaCount(plaques);
  if (mag > 0) fail.push(`card_plaques.png: ${mag} sichtbare Magenta-Punkte`);
  else notes.push("✓ kein sichtbares Magenta im Plakettenblatt");

  for (const c of accept) {
    const box = boxOf(plaques, c, CELL, CELL);
    if (box === null) { fail.push(`card_plaques.png: Zelle ${c} ist vollständig leer`); continue; }
    if (box.x0 < 8 || box.x1 > CELL - 9 || box.y0 < 8 || box.y1 > CELL - 9) {
      fail.push(`card_plaques.png: Zelle ${c} reicht bis an ihren Zellenrand — beim Zuschnitt blutet die Nachbarzelle herein`);
    }
    const r = cornerRadii(plaques, c, CELL, box);
    const w = box.x1 - box.x0 + 1, h = box.y1 - box.y0 + 1;
    notes.push(`· Zelle ${c}: Kasten x ${box.x0}–${box.x1} · y ${box.y0}–${box.y1} (${w}×${h}), Ecken oben-links ${r.tl.join("/")} · oben-rechts ${r.tr.join("/")} · unten-rechts ${r.br.join("/")} · unten-links ${r.bl.join("/")}`);
    let ok = true;
    for (const k of ["tl", "tr", "br", "bl"]) {
      for (let i = 0; i < 2; i++) {
        const got = r[k][i], soll = want[k][i];
        if (got === null || Math.abs(got - soll) > RADIUS_TOL) {
          fail.push(`card_plaques.png: Zelle ${c}, Ecke ${k}, ${i === 0 ? "waagrecht" : "senkrecht"} ${got} statt ${soll} (±${RADIUS_TOL}) — die Plakette hat nicht die Ecken, die die Karte zeichnet`);
          ok = false;
        }
      }
    }
    if (ok) notes.push(`✓ Zelle ${c}: alle acht Radien treffen --pb-chip-r auf ±${RADIUS_TOL} px`);
    const inner = meanOf(plaques, c * CELL + box.x0 + 30, box.y0 + 30, c * CELL + box.x1 - 30, box.y1 - 30);
    const k = contrast(inner, paperMean);
    if (k < CONTRAST_MIN) fail.push(`card_plaques.png: Zelle ${c} steht nur ${k.toFixed(3)} : 1 gegen das Papier (gefordert ≥ ${CONTRAST_MIN} : 1)`);
    else notes.push(`✓ Zelle ${c} gegen Papier: ${k.toFixed(3)} : 1 — rgb(${inner.join(", ")})`);
    cells.push({ c, box, radii: r, contrast: k, size: [w, h] });
  }
  return { fail, notes, cells };
}

/**
 * DAS 9-SLICE-KNOPFBLATT (AQ17C, R172) — GEMESSEN UND GEHALTEN.
 *
 * R172 wollte den Knopf als 9-Slice, weil der heutige gemalte Knopf EINE Zelle
 * ist, die auf die Knopfbreite gezogen wird (D-365: senkrechte Striche werden
 * dadurch dicker als waagrechte). Die Lieferung tut das — und verliert dabei
 * genau das, wofür in derselben Lieferung die Plaketten nachbestellt wurden:
 * alle vier Ecken tragen EINEN Radius. Ein 9-Slice muss seine Ecken gerade
 * NICHT strecken, könnte die vier also tragen; dass er es nicht tut, ist kein
 * Verfahrenszwang, sondern eine Auslassung — die Plaketten im selben Ordner
 * beweisen, dass der Maler sie kann.
 *
 * Deshalb ist diese Funktion KEINE Abnahme, sondern eine Haltung mit Zahl. Und
 * sie hat ein rotes Licht in die andere Richtung: erfüllt eine spätere Lieferung
 * die Bestellung doch, wird die Haltung selbst zum Fehler und dieses Skript
 * bricht ab — eine Haltung, die ihren Grund überlebt, ist eine Lüge im Kopf.
 */
export function probeNineSlice(nine, want) {
  const fail = [], notes = [], CW = 384, CH = 192;
  if (want === null) return { fail, notes, uniform: false };
  if (nine.width !== 4 * CW || nine.height !== CH) {
    notes.push(`· card_buttons_9slice.png: ${nine.width}×${nine.height} statt ${4 * CW}×${CH} — im Labor gehalten, Maß nicht wie bestellt`);
    return { fail, notes, uniform: false };
  }
  let alleGleich = true, alleWieBestellt = true;
  for (let c = 0; c < 4; c++) {
    const box = boxOf(nine, c, CW, CH);
    if (box === null) { notes.push(`· 9-Slice-Zelle ${c} ist leer`); continue; }
    const r = cornerRadii(nine, c, CW, box);
    const flach = [r.tl, r.tr, r.br, r.bl].flat();
    const gleich = flach.every((v) => v === flach[0]);
    const wieBestellt = ["tl", "tr", "br", "bl"].every((k) =>
      [0, 1].every((i) => r[k][i] !== null && Math.abs(r[k][i] - want[k][i]) <= RADIUS_TOL));
    if (!gleich) alleGleich = false;
    if (!wieBestellt) alleWieBestellt = false;
    notes.push(`· 9-Slice-Zelle ${c}: Kasten ${box.x1 - box.x0 + 1}×${box.y1 - box.y0 + 1}, Ecken ${r.tl.join("/")} · ${r.tr.join("/")} · ${r.br.join("/")} · ${r.bl.join("/")}${gleich ? "  ⟵ EIN Radius auf allen vier Ecken" : ""}`);
  }
  if (alleWieBestellt) {
    fail.push("card_buttons_9slice.png: das Blatt trägt JETZT die vier Radien der Karte — die Haltung in diesem Skript ist überholt. Neu entscheiden und den Text hier ändern, nicht das rote Licht wegdrücken.");
  } else if (alleGleich) {
    notes.push(`· IM LABOR GEHALTEN: card_buttons_9slice.png — ein einheitlicher Eckradius auf allen vier Ecken jeder Zelle, wo die Karte vier verschiedene zeichnet (--pb-chip-r: oben-links ${want.tl.join("/")}, oben-rechts ${want.tr.join("/")}, unten-rechts ${want.br.join("/")}, unten-links ${want.bl.join("/")}). Genau dafür ging AQ17s Plakettenblatt zurück; die Stauchung D-365/R172 bleibt offen.`);
  } else {
    notes.push("· IM LABOR GEHALTEN: card_buttons_9slice.png — die Ecken treffen weder einen einheitlichen Radius noch die vier der Karte");
  }
  return { fail, notes, uniform: alleGleich };
}

// ── SELBSTTEST (R187c/C10) ───────────────────────────────────────────────────
// Ohne Labor und ohne Repo-Kunst, damit er in CI läuft. Gebaut wird jeweils der
// Fall, in dem RICHTIG und PLAUSIBEL-FALSCH auseinandergehen — und getampert
// wird gegen den MESSWERT, nie gegen die Konfiguration (P-71).
if (process.argv.includes("--selftest")) {
  const CELL = 512;
  /** ein 4×512²-Blatt mit einer abgerundeten Plakette je Zelle */
  const plaqueSheet = (radii, colour = [225, 184, 102]) => {
    const png = new PNG({ width: 4 * CELL, height: CELL });
    const bx0 = 83, by0 = 172, bx1 = 428, by1 = 332;
    for (let c = 0; c < 4; c++) {
      for (let y = by0; y <= by1; y++) {
        for (let x = bx0; x <= bx1; x++) {
          // in welcher Ecke liegen wir, und ist der Punkt innerhalb der Ellipse?
          const links = x - bx0, rechts = bx1 - x, oben = y - by0, unten = by1 - y;
          const ecke = oben < unten
            ? (links < rechts ? ["tl", links, oben] : ["tr", rechts, oben])
            : (links < rechts ? ["bl", links, unten] : ["br", rechts, unten]);
          const [k, dx, dy] = ecke;
          const [rx, ry] = radii[k];
          if (dx < rx && dy < ry) {
            const u = (rx - dx) / rx, v = (ry - dy) / ry;
            if (u * u + v * v > 1) continue; // draußen: durchsichtig
          }
          const i = ((y) * 4 * CELL + (c * CELL + x)) * 4;
          png.data[i] = colour[0]; png.data[i + 1] = colour[1]; png.data[i + 2] = colour[2]; png.data[i + 3] = 255;
        }
      }
    }
    return png;
  };
  const paperSheet = (magenta = false) => {
    const png = new PNG({ width: 512, height: 512 });
    for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4;
      // die Perioden TEILEN 512, sonst ist das Probe-Papier selbst nicht
      // kachelbar und der positive Kontrollfall fiele an der eigenen Naht
      const n = 6 * Math.sin((2 * Math.PI * 7 * x) / 512) * Math.cos((2 * Math.PI * 5 * y) / 512);
      const rot = magenta && x > 100 && x < 140 && y > 100 && y < 140;
      png.data[i] = rot ? 255 : 254 + Math.round(n) - 4;
      png.data[i + 1] = rot ? 0 : 242 + Math.round(n) - 4;
      png.data[i + 2] = rot ? 255 : 205 + Math.round(n) - 4;
      png.data[i + 3] = 255;
    }
    return png;
  };

  const soll = chipRadii(fs.readFileSync(CSS, "utf8"));
  const paper = paperSheet();
  const paperMean = meanOf(paper, 0, 0, 511, 511);
  const rund = { tl: [33, 33], tr: [33, 33], br: [33, 33], bl: [33, 33] };

  const faelle = [
    ["Plakette mit den Radien der Karte besteht",
      () => probePlaques(plaqueSheet(soll), paperMean, soll).fail,
      (f) => f.length === 0],
    ["Plakette mit EINEM Eckradius fällt an den Ecken — das rote Licht von AQ17",
      () => probePlaques(plaqueSheet(rund), paperMean, soll).fail,
      (f) => f.some((m) => /Ecke .*statt/.test(m))],
    ["Papier mit Magenta fällt an der Schlüsselfarbe",
      () => probePaper(paperSheet(true)).fail,
      (f) => f.some((m) => /Magenta/.test(m))],
    ["sauberes Papier besteht",
      () => probePaper(paperSheet()).fail,
      (f) => f.length === 0],
    ["ein 9-Slice, der die vier Radien DOCH trägt, macht die Haltung rot",
      () => probeNineSlice((() => {
        // dasselbe Rezept, nur im 9-Slice-Maß 4 × 384×192
        const png = new PNG({ width: 4 * 384, height: 192 });
        const bx0 = 8, by0 = 24, bx1 = 375, by1 = 160;
        for (let c = 0; c < 4; c++) for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
          const links = x - bx0, rechts = bx1 - x, oben = y - by0, unten = by1 - y;
          const ecke = oben < unten ? (links < rechts ? ["tl", links, oben] : ["tr", rechts, oben])
                                    : (links < rechts ? ["bl", links, unten] : ["br", rechts, unten]);
          const [k, dx, dy] = ecke; const [rx, ry] = soll[k];
          if (dx < rx && dy < ry) { const u = (rx - dx) / rx, v = (ry - dy) / ry; if (u * u + v * v > 1) continue; }
          const i = (y * 4 * 384 + (c * 384 + x)) * 4;
          png.data[i] = 233; png.data[i + 1] = 202; png.data[i + 2] = 128; png.data[i + 3] = 255;
        }
        return png;
      })(), soll).fail,
      (f) => f.some((m) => /Haltung .*überholt/.test(m))],
  ];

  let schlecht = 0;
  for (const [name, run, ok] of faelle) {
    const f = run();
    const bestanden = ok(f);
    if (!bestanden) schlecht++;
    console.log(`  ${bestanden ? "✓" : "✗"} ${name}${f.length > 0 ? `  →  ${f[0]}` : ""}`);
  }
  if (schlecht > 0) {
    console.error(`\nimport-batch-aq17 --selftest: ${schlecht} Fall/Fälle nicht wie erwartet`);
    process.exit(1);
  }
  console.log("\nimport-batch-aq17 --selftest: OK — die Abnahme sieht ihr rotes Licht am einheitlichen Eckradius und am Magenta, und die Haltung des 9-Slice hat selbst ein rotes Licht");
  process.exit(0);
}

// ── DER LAUF ─────────────────────────────────────────────────────────────────
const src = (batch, f) => {
  const p = path.join(LAB, batch, f);
  if (!fs.existsSync(p)) { console.error(`✗ Quellblatt fehlt: ${p}`); process.exit(1); }
  return p;
};

const want = chipRadii(fs.readFileSync(CSS, "utf8"));
const paper = read(src("batch-aq17", "card_paper.png"));
const rPaper = probePaper(paper);
const buttons = read(src("batch-aq17", "card_buttons.png"));
const rButtons = probeButtons(buttons, rPaper.mean ?? [254, 242, 205]);
// Z0/Z1 sind in batch-aq17b und batch-aq17c BYTEGLEICH (in dieser Sitzung
// nachgemessen, SHA-256 je Zelle über die RGBA-Bytes: Z0 8ae23c72… · Z1
// 435fd6a9…). Gelesen wird aus aq17c, weil dort auch das 9-Slice-Blatt liegt,
// das mitgemessen und begründet gehalten wird.
const plaques = read(src("batch-aq17c", "card_plaques.png"));
const rPlaques = probePlaques(plaques, rPaper.mean ?? [254, 242, 205], want);
const nine = read(src("batch-aq17c", "card_buttons_9slice.png"));
const rNine = probeNineSlice(nine, want);

const HELD = [
  ["batch-aq17/card_frame.png", "Rahmen — die Wiederhol-Naht des Kantenstücks springt bei »border-image-repeat: round« auf das 8,59-fache der eigenen Textur (genau EINE feste Lücke je Seite, der Kernfehler von AQ11)"],
  ["batch-aq17/card_frame_inner.png", "Innenlinie zum obigen Rahmen — dieselbe Lieferung, dieselbe Naht"],
  ["batch-aq17/card_frame_seam_test.png", "Nahttest des Rahmens — Beweisbild der Lieferung, kein Importgut"],
  ["batch-aq17/card_paper_seam_test.png", "Nahttest des Papiers — Beweisbild der Lieferung, kein Importgut"],
  ["batch-aq17c/card_paper.png", "Papier NEU — Rauhheit 0,324 und Streifen (Wareneingang 20.08.); das ALTE Papier aus AQ17 bleibt im Spiel"],
  ["batch-aq17c/card_frame.png · card_frame_inner.png", "Randzone = konstant +8 verschobene Spiegelkopie, sichtbarer Pfosten (Wareneingang 20.08.) — zurück als AQ17D"],
  ["batch-aq17c/card_plaques.png Z2/Z3", "zwei weitere Farbvarianten ohne Rolle — die Bestellung nennt sie »Reserve«, die Karte hat für sie keinen Zustand (R132: zellweise, was eine Rolle hat)"],
];

const notes = [...rPaper.notes, ...rButtons.notes, ...rPlaques.notes, ...rNine.notes];
const failures = [...rPaper.fail, ...rButtons.fail, ...rPlaques.fail, ...rNine.fail];
for (const [f, why] of HELD) notes.push(`· IM LABOR GEHALTEN: ${f} — ${why}`);

for (const n of notes) console.log(n);
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq17: ${failures.length} Befund(e) — nichts aus dieser Lieferung wird angenommen`);
  process.exit(1);
}

/**
 * DIE ANGENOMMENEN ZELLEN ALS EIN BLATT — auf ihre Kästen zugeschnitten und in
 * der Reihenfolge ihrer ROLLE nebeneinander gelegt (Ruhe, dann gedrückt).
 *
 * Warum EIN Blatt und nicht zwei Dateien: das Stylesheet schaltet den Zustand
 * dann über `background-position` statt über eine zweite Adresse — das Blatt ist
 * beim ersten Antippen längst geladen, und niemand sieht einen Bildwechsel, der
 * erst beim Drücken angefragt wird. Genau so trägt D4 schon das Knopfblatt.
 *
 * Warum auf den KASTEN zugeschnitten und nicht die 512er Zelle: sonst müsste das
 * Stylesheet den Kasten mit einer Prozentrechnung wiederfinden (die Rechnung, die
 * beim Knopfblatt eine halbe Seite Kommentar kostet). Zugeschnitten ist die
 * Plakette das Blatt, und »background-size 200 % 100 %« sagt alles.
 */
const writeSheet = (png, cw, cells, file) => {
  const w = cells[0].size[0], h = cells[0].size[1];
  const out = new PNG({ width: w * cells.length, height: h });
  cells.forEach((cell, n) => {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const s = ((cell.box.y0 + y) * png.width + (cell.c * cw + cell.box.x0 + x)) * 4;
        const d = (y * w * cells.length + n * w + x) * 4;
        out.data[d] = png.data[s]; out.data[d + 1] = png.data[s + 1];
        out.data[d + 2] = png.data[s + 2]; out.data[d + 3] = png.data[s + 3];
      }
    }
  });
  const dst = path.join(OUT, file);
  let zustand = "geschrieben";
  if (fs.existsSync(dst)) {
    const b = read(dst);
    if (b.width === out.width && b.height === h && Buffer.compare(out.data, b.data) === 0) zustand = "unverändert";
  }
  if (!DRY && zustand === "geschrieben") fs.writeFileSync(dst, PNG.sync.write(out));
  return [out.width, h, zustand];
};

/** Welche Zelle welche Rolle trägt — eine ENTSCHEIDUNG dieser Sitzung, und zwar
 *  am Bild getroffen, weil der Bestelltext der Lieferung mit dem ersten Mac
 *  verloren ist (R204) und der Lieferschein für Z0/Z1 keine Rollen nennt.
 *  Z1 ist die HELLERE (1,463 : 1) und trägt exakt dieselbe Farbe wie das
 *  Knopfblatt (gemessenes Innenmittel rgb(240, 196, 115) in beiden) — ein Chip
 *  in Ruhe soll leise auf dem Papier liegen und mit den Knöpfen eine Familie
 *  bilden. Z0 ist die dunklere (1,671 : 1) und wird der gedrückte Zustand:
 *  Papier, auf das ein Finger drückt, wird dunkler, und das stützt die 4-px-Lippe,
 *  die beim Drücken ohnehin einfällt. Ein blinder Kritiker darf das umdrehen. */
const ROLLEN = [
  { c: 1, rolle: "in Ruhe (dieselbe Farbe wie das Knopfblatt)" },
  { c: 0, rolle: "gedrückt (die dunklere der beiden)" },
];

/** Ein Blatt wird nur geschrieben, wenn auf der Platte NICHT schon dasselbe BILD
 *  liegt.
 *
 *  Warum das eine eigene Regel braucht (D5, an sich selbst gelernt): nach dem
 *  Import läuft `art-recompress` (D-98) und schreibt dieselben Bildpunkte in
 *  kleinere Dateien. Ein späterer Lauf dieses Skripts kopierte bisher stumpf
 *  wieder die Labor-Fassung darüber — dieselbe Malerei, 65 % mehr Bytes, und
 *  `check-png-identity --ref FETCH_HEAD` meldet zwei Blätter als angefasst, die
 *  diese Runde gar nicht importiert. Verglichen wird deshalb das BILD und nicht
 *  die Datei; wer nichts Neues bringt, schreibt nichts. */
const writeIfNew = (srcPath, file) => {
  const dst = path.join(OUT, file);
  if (fs.existsSync(dst)) {
    const a = read(srcPath), b = read(dst);
    if (a.width === b.width && a.height === b.height && Buffer.compare(a.data, b.data) === 0) return "unverändert";
  }
  if (!DRY) fs.copyFileSync(srcPath, dst);
  return "geschrieben";
};

if (!DRY) fs.mkdirSync(OUT, { recursive: true });
const zPaper = writeIfNew(src("batch-aq17", "card_paper.png"), "card_paper.png");
const zButtons = writeIfNew(src("batch-aq17", "card_buttons.png"), "card_buttons.png");
console.log(`  ${DRY ? "[trocken] " : ""}batch-aq17/card_paper.png    →  art/g1/cards/card_paper.png     ${paper.width}×${paper.height}  (${zPaper})`);
console.log(`  ${DRY ? "[trocken] " : ""}batch-aq17/card_buttons.png  →  art/g1/cards/card_buttons.png   ${buttons.width}×${buttons.height} (4 × 512²)  (${zButtons})`);
const geordnet = ROLLEN.map((r) => rPlaques.cells.find((c) => c.c === r.c)).filter((c) => c !== undefined);
const [pw, ph, zPlaques] = geordnet.length === ROLLEN.length
  ? writeSheet(plaques, 512, geordnet, "card_plaques.png")
  : [0, 0, "nicht geschrieben"];
ROLLEN.forEach((r, n) => {
  const cell = rPlaques.cells.find((c) => c.c === r.c);
  if (cell === undefined) return;
  console.log(`  ${DRY ? "[trocken] " : ""}batch-aq17c/card_plaques.png Z${r.c}  →  card_plaques.png Zelle ${n}  ${cell.size[0]}×${cell.size[1]}  — ${r.rolle}, ${cell.contrast.toFixed(3)} : 1 gegen das Papier`);
});
console.log(`  ${DRY ? "[trocken] " : ""}                             →  art/g1/cards/card_plaques.png  ${pw}×${ph} (${ROLLEN.length} × ${ph}er Kasten)  (${zPlaques})`);
console.log(`import-batch-aq17: OK — Papier ${zPaper}, Knopfblatt ${zButtons}, ${geordnet.length} Plaketten-Zellen zu einem Blatt zugeschnitten, ${HELD.length + 1} Posten im Labor gehalten${DRY ? " (Trockenlauf, nichts geschrieben)" : ""}`);
