#!/usr/bin/env node
/**
 * R5-W4b · C3 · IMPORT BATCH AQ15 — die richtige Merle im Käfig.
 *
 * Koki hat im Federpennal-Käfig »das alte Mädchen« gesehen. Die Vermutung war,
 * die Insassen-Zellen `merle_caged0/1` zeigten eine ältere Figur. Codex hat beim
 * Bauen von AQ15 nachgesehen und das WIDERLEGT: die beiden Zellen zeigen längst
 * Merle mit Zöpfen und grünem Kleid — das alte dunkelhaarige Gesicht steckt in
 * `pencilcase_a.png`, hinter das Gitter GEMALT, als Teil der Käfig-Kunst (R93).
 * Nicht der Insasse ist alt; das Fenster des Pennals malt einen.
 *
 * Dieser Import bringt daher NUR die gedämpften Gefangenen-Zellen. Das Leeren des
 * Fensters (AQ15b) ist durchgefallen — siehe unten.
 *
 *   · `merle_caged0` ← AQ15 `merle_caged_v2.png` Zelle 1 (Bestandsmaß 268×383)
 *   · `merle_caged1` ← AQ15 `merle_caged_v2.png` Zelle 2 (Bestandsmaß 265×389)
 *
 * NICHT importiert:
 *   · Zelle 3 (»halb wach«, ein Auge offen) und `merle_hop.png` (Absprung,
 *     Scheitel, Landung, Nachfedern). Beides ist Animation und Feel, also
 *     F-Lane-Arbeit (RAHMEN §5) — F6 in Welle 5. Ein importiertes Blatt, das
 *     nichts lädt, wäre totes Gewicht, das die Kunst-Prüfung mitschleppt
 *     (DEAD_ART steht bei 57/61 und die Decke gehört W3, R90). Geliefert und
 *     unverdrahtet, im Report benannt. D-226.
 *
 *   · `pencilcase_a` und `pencilcase_shake` ← AQ15b, BEIDE DURCHGEFALLEN.
 *     Ein blinder Prüfer hat bei acht- bis zehnfacher Vergrößerung beide Zellen
 *     als defekt gelesen, und eine eigene Nachprüfung bei dreifacher
 *     Vergrößerung bestätigt es: der obere Querstab franst zu einer gepunkteten
 *     1-Pixel-Spur aus und verschwindet vor dem rechten Fensterrand, der untere
 *     Querstab fehlt ganz, vereinzelte dunkle Sprenkel schweben in der leeren
 *     Fläche, und die Innenkante des Rahmens ist ausgefranst.
 *
 *     Messtechnisch war die Lieferung sonst tadellos — außerhalb des Fensters
 *     weicht Zelle 1 in ZWEI Pixeln vom Bestand ab, und es wurde KEIN einziger
 *     Pixel hinzugemalt (nur 24 424 im Fenster entfernt). Der Fehler liegt allein
 *     darin, WAS mitentfernt wurde: Codex hat nach FARBE geschlüsselt, und die
 *     Stäbe sind im Bestand fast reines Schwarz — genau wie Teile der alten
 *     Gesichtskontur. Eine Farbauswahl kann die beiden nicht trennen.
 *
 *     ★ LEHRE, die den Prüf-Aufbau selbst betrifft: diese Session hatte Zelle 1
 *     zunächst als sauber durchgewunken — geprüft auf BLATTGRÖSSE (2048×512),
 *     wo das Pennal 480×275 misst und ein einen Pixel breiter, ausgefranster Stab
 *     schlicht nicht darstellbar ist. Der blinde Prüfer hat am Ausschnitt
 *     gearbeitet und behielt recht. Ein Kritiker kann nur beurteilen, was das
 *     Bild bei beurteilbarer Größe hergibt. AQ15c ist mit beiden Zellen und mit
 *     einer Stab-Vollständigkeitsprüfung neu bestellt. D-224, D-225.
 *
 * ★ AQ15c (R5-W6b · C6, 19.08.): der dritte Anlauf — BEIDE Zellen wieder zurück,
 *   und diesmal nicht wegen der Farbe. Zelle 1 nimmt sauber nur weg (0 hinzugemalt,
 *   0 umgefärbt, Maß und Schlüssel tadellos), schneidet den drei senkrechten Stäben
 *   aber den FUSS ab (je 11–12 px, `y211–222` · `y217–227` · `y223–233`), sodass sie
 *   frei über dem Stoffwulst enden; Zelle 2 verliert ~90 px beider Querstäbe. Ursache
 *   in beiden Fällen: die Öffnung wurde als gerades Viereck über ein Fenster gelegt,
 *   das gemalt und schief ist. Beide blinden Prüfer (Handwerk 3× und Spielgröße)
 *   haben es unabhängig gesehen. D-460/D-461/D-462. Die Fenster-Abnahme unten ist
 *   die Antwort darauf.
 *
 * ── DER BLINDE BLATT-PRÜFER (R91) ────────────────────────────────────────────
 *   MERLE — ANGENOMMEN. »A und B zeigen dieselbe Person in derselben Pose, nur
 *   anders eingefärbt — JA.« Der Prüfer bekam die neue und die alte Zelle ohne zu
 *   wissen, welche welche ist, und beschrieb beide unabhängig als dasselbe
 *   Mädchen: »zwei braune Zöpfe mit Pony, dasselbe olivgrüne Kleid mit
 *   cremefarbenem Kragen und goldenem Medaillon, dieselbe müde-besorgte Mimik,
 *   dieselben weißen Handschuhe, dasselbe bunte Armband in der linken Hand,
 *   dieselben braunen Schnürschuhe.« Silhouette deckungsgleich bis auf 16
 *   Randpixel Antialiasing. Und er hat die verlangte Dämpfung unabhängig
 *   GEMESSEN, an jeder Fläche gleich gerichtet — Kleid 67 % → 38 % Sättigung,
 *   Haar 82 % → 55 %, Haut 94 % → 57 %, Schuh 79–87 % → 53–59 %: »ein
 *   gleichmäßiger, globaler Dämpfungs-Effekt über die ganze Figur … bewusste
 *   Gestaltung, nicht ein Fehler.«
 *
 *   Das ist der Grund, warum die Insassen-Schicht (R103) ohne eine einzige Zeile
 *   Abdunkelungs-Code auskommt: die Dämpfung steckt im Blatt, so wie sie bei den
 *   `captive_*`-Blättern auch im Blatt steckt.
 *
 * Maschinerie und Begründungen der Zusatzprüfungen: siehe `import-batch-aq12.mjs`
 * (Größen-Vertrag von der Platte, Bestands-Schablone gegen Alpha-Geister,
 * Schlüssel-Reinheit, defringe-Prädikat wörtlich wie aq7).
 *
 * ⚠ KEIN gemeinsamer Zuschnittkasten. `merle_caged0` (268×383) und
 *   `merle_caged1` (265×389) sind NICHT maßgleich und haben keinen
 *   Kongruenz-Vertrag — anders als ein Kreuzblend-Paar. Jede Zelle wird auf
 *   ihrem eigenen Inhaltskasten getrimmt und einzeln gegen ihr Bestandsmaß
 *   gehalten. Der gemeinsame Kasten aus aq7 wäre hier ein Fehler.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const DRY = process.argv.includes("--dry");

const TOL = 40;
const read = (p) => PNG.sync.read(fs.readFileSync(p));
const isMagenta = (r, g, b, tol = TOL) => Math.hypot(r - 255, g, b - 255) < tol;

function crop(src, x0, y0, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((y0 + y) * src.width + (x0 + x)) * 4;
      const di = (y * w + x) * 4;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function chromaKey(png, tol = TOL) {
  for (let i = 0; i < png.data.length; i += 4) {
    if (isMagenta(png.data[i], png.data[i + 1], png.data[i + 2], tol)) png.data[i + 3] = 0;
  }
  return png;
}

/** VERBATIM aus aq7 — das Prädikat liegt als Kopie in `scripts/key-fringe.mjs`. */
function defringe(png, passes = 3) {
  const { width: W, height: H, data } = png;
  let killed = 0;
  for (let p = 0; p < passes; p++) {
    const kill = [];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (data[i + 3] === 0) continue;
        let edge = false;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) { edge = true; continue; }
          if (data[(ny * W + nx) * 4 + 3] === 0) edge = true;
        }
        if (!edge) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 120 && b > 120 && r - g > 55 && b - g > 55) kill.push(i);
      }
    }
    for (const i of kill) data[i + 3] = 0;
    killed += kill.length;
    if (kill.length === 0) break;
  }
  return killed;
}

const contentBox = (png) => {
  const { width: W, height: H, data } = png;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
};

const keyDistance = (png) => {
  let euclid = Infinity, manhattan = Infinity;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] <= 8) continue;
    const dr = png.data[i] - 255, dg = png.data[i + 1], db = png.data[i + 2] - 255;
    const e = Math.hypot(dr, dg, db);
    const m = Math.abs(dr) + Math.abs(dg) + Math.abs(db);
    if (e < euclid) euclid = e;
    if (m < manhattan) manhattan = m;
  }
  return { euclid, manhattan };
};

const impureKey = (png) => {
  let n = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    if (!isMagenta(r, g, b)) continue;
    if (r !== 255 || g !== 0 || b !== 255) n++;
  }
  return n;
};

function stencil(out, incumbent) {
  let ghosts = 0, holes = 0;
  for (let i = 0; i < out.data.length; i += 4) {
    const here = out.data[i + 3] > 8;
    const there = incumbent.data[i + 3] > 8;
    if (here && !there) { out.data[i + 3] = 0; ghosts++; }
    else if (!here && there) holes++;
  }
  return { ghosts, holes };
}

/** Wie stark ein Blatt entsättigt ist — die Zahl, an der die »Dämpfung« hängt.
 *  Sie wird gedruckt, weil R103 sich darauf verlässt, dass das BLATT die
 *  Dämpfung trägt und kein Code sie nachreichen muss. */
const meanSaturation = (png) => {
  let n = 0, s = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < 200) continue;
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    s += mx === 0 ? 0 : (mx - mn) / mx;
    n++;
  }
  return n === 0 ? 0 : s / n;
};


/* ─────────────────────────────────────────────────────────────────────────────
 * DIE FENSTER-ABNAHME (R5-W6b · C6)
 *
 * Eine Lieferung, die ein FENSTER LEERT, ist kein normaler Neuanstrich: sie darf
 * ausschliesslich WEGNEHMEN, und sie darf dabei nur das wegnehmen, was hinter dem
 * Gitter lag — nie das Gitter selbst. Zwei Anlaeufe sind daran gescheitert, dass
 * nach FARBE geschluesselt wurde (die Staebe sind fast reines Schwarz, genau wie
 * Teile der alten Gesichtskontur), ein dritter daran, dass die Oeffnung als
 * gerades Viereck ueber ein Fenster gelegt wurde, das keins ist.
 *
 * ★ WARUM DIESE PRUEFUNG NICHT MIT DER OEFFNUNGSMASKE DES LIEFERANTEN MISST
 *   (C5s Lehre aus den zwei Linealen, D-382): wer mit dem Werkzeug des
 *   Lieferanten misst, misst dessen Annahme mit. Codex' Lieferschein meldet
 *   "0 Fremdpixel im Fenster" und "Stabpixel Bestand → neu identisch" — beides
 *   wahr, beides RELATIV zu seiner eigenen Oeffnung. Liegt diese Oeffnung falsch,
 *   zaehlt jede abgeschnittene Stabspitze als "Fenster" und faellt aus der
 *   Rechnung heraus. Diese Abnahme leitet die Oeffnung deshalb aus dem DIFF
 *   gegen den Bestand ab (was verschwunden ist, war Fenster) und prueft die
 *   Staebe an eigenen, aus dem Blatt selbst gefundenen Achsen.
 *
 * Die vier Regeln:
 *   1 NUR WEGNEHMEN — kein hinzugemalter, kein umgefaerbter Bildpunkt. Damit ist
 *     "Diff ausserhalb des Fensters = 0" in seiner schaerfsten Form geprueft,
 *     ohne dass man wissen muss, wo das Fenster aufhoert.
 *   2 KEIN STAB ENDET IN DER LUFT — jede der fuenf Achsen traegt Tinte am ERSTEN
 *     und am LETZTEN Punkt der Oeffnung. Ein Gitterstab, der vor dem Rahmen
 *     aufhoert, ist der Fehler, den ein Kind als "kaputt" liest.
 *   3 KEINE LOECHER — hoechstens ein Bildpunkt Unterbrechung innerhalb einer
 *     Achse (Kantenglaettung), nie mehr.
 *   4 KEIN FREMDPIXEL — was im Fenster noch steht, haengt am Gitter. Ein Rest
 *     der alten Figur haengt an nichts.
 *
 * Aufruf:
 *   node docs/art/import-batch-aq15.mjs --abnahme <stem> <blatt.png> <zelle 0-3>
 *   node docs/art/import-batch-aq15.mjs --selftest
 */

const OPEN_EDGE_TOL = 3;   // Kantenglaettung am Rahmen: die letzten 3 px zaehlen als "am Rand"
const HOLE_TOL = 1;        // eine Achse darf einen einzelnen Punkt Aussetzer haben

/** Konvexe Huelle (Andrew) — die Oeffnung, aus dem Diff abgeleitet. */
function hullOf(pts) {
  if (pts.length < 3) return pts;
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const p of s) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  for (let i = s.length - 1; i >= 0; i--) { const p = s[i]; while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

export function windowAcceptance(incumbent, delivery) {
  const lines = [];
  const fail = [];
  if (delivery.width !== incumbent.width || delivery.height !== incumbent.height) {
    fail.push(`Mass ${delivery.width}x${delivery.height}, der Bestand ist ${incumbent.width}x${incumbent.height}`);
    return { lines, fail };
  }
  const W = delivery.width, H = delivery.height;
  const ink = (p, x, y) => p.data[(y * W + x) * 4 + 3] > 8;

  // 1 · nur wegnehmen
  const rem = new Uint8Array(W * H);
  let removed = 0, added = 0, recoloured = 0;
  const addedAt = [], recolAt = [];
  const pts = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const a0 = incumbent.data[i + 3] > 8, a1 = delivery.data[i + 3] > 8;
    if (a0 && !a1) { rem[y * W + x] = 1; removed++; pts.push([x, y]); }
    else if (!a0 && a1) { added++; if (addedAt.length < 6) addedAt.push(`${x},${y}`); }
    else if (a0 && a1) {
      let same = true;
      for (let k = 0; k < 4; k++) if (incumbent.data[i + k] !== delivery.data[i + k]) { same = false; break; }
      if (!same) { recoloured++; if (recolAt.length < 6) recolAt.push(`${x},${y}`); }
    }
  }
  lines.push(`  entfernt ${removed}  ·  hinzugemalt ${added}${addedAt.length ? " @ " + addedAt.join(" ") : ""}  ·  umgefaerbt ${recoloured}${recolAt.length ? " @ " + recolAt.join(" ") : ""}`);
  if (added > 0) fail.push(`${added} hinzugemalte Bildpunkte — eine Fenster-Lieferung darf nur wegnehmen`);
  if (recoloured > 0) fail.push(`${recoloured} umgefaerbte Bildpunkte — eine Fenster-Lieferung darf nur wegnehmen`);
  if (removed === 0) { fail.push("nichts entfernt — das Fenster ist unveraendert"); return { lines, fail }; }

  // Oeffnung aus dem Diff
  const hull = hullOf(pts);
  const crossH = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const inHull = (x, y) => { for (let k = 0; k < hull.length; k++) if (crossH(hull[k], hull[(k + 1) % hull.length], [x, y]) < 0) return false; return true; };
  let hx0 = W, hx1 = -1, hy0 = H, hy1 = -1;
  for (const p of hull) { if (p[0] < hx0) hx0 = p[0]; if (p[0] > hx1) hx1 = p[0]; if (p[1] < hy0) hy0 = p[1]; if (p[1] > hy1) hy1 = p[1]; }
  const inO = new Uint8Array(W * H);
  let openPx = 0;
  for (let y = hy0; y <= hy1; y++) for (let x = hx0; x <= hx1; x++) if (inHull(x, y)) { inO[y * W + x] = 1; openPx++; }
  // Ausdehnung der Oeffnung je Achse: wo ueberhaupt geleert wurde
  const colOpen = new Uint8Array(W), rowOpen = new Uint8Array(H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (rem[y * W + x]) { colOpen[x] = 1; rowOpen[y] = 1; }
  const extent = (arr, a, b) => { let f = -1, l = -1; for (let t = a; t <= b; t++) if (arr[t]) { if (f < 0) f = t; l = t; } return [f, l]; };
  const [ox0, ox1] = extent(colOpen, 0, W - 1);
  const [oy0, oy1] = extent(rowOpen, 0, H - 1);
  lines.push(`  Oeffnung ${openPx} px  ·  x${ox0}..${ox1}  y${oy0}..${oy1}`);

  // 2/3 · die fuenf Achsen, aus dem Blatt selbst gefunden
  const rowSum = new Int32Array(H), colSum = new Int32Array(W);
  let barPx = 0;
  for (let y = hy0; y <= hy1; y++) for (let x = hx0; x <= hx1; x++) {
    if (!inO[y * W + x] || !ink(delivery, x, y)) continue;
    rowSum[y]++; colSum[x]++; barPx++;
  }
  const bands = (arr, a, b, thr) => {
    const out = []; let s = -1;
    for (let i = a; i <= b; i++) { const on = arr[i] >= thr; if (on && s < 0) s = i; if ((!on || i === b) && s >= 0) { out.push([s, on ? i : i - 1]); s = -1; } }
    return out;
  };
  // Rahmenkanten liegen AUF der Oeffnungsgrenze — die ersten/letzten OPEN_EDGE_TOL
  // Reihen zaehlen nicht als Stab, sonst zaehlt man den Rahmen als sechsten Stab mit.
  const inner = (b, lo, hi) => b[0] > lo + OPEN_EDGE_TOL && b[1] < hi - OPEN_EDGE_TOL;
  const hBands = bands(rowSum, oy0, oy1, (ox1 - ox0) * 0.25).filter((b) => inner(b, oy0, oy1));
  const vBands = bands(colSum, ox0, ox1, (oy1 - oy0) * 0.25).filter((b) => inner(b, ox0, ox1));
  lines.push(`  Achsen gefunden: ${hBands.length} waagrecht ${hBands.map((b) => `y${b[0]}..${b[1]}`).join(" ")}  ·  ${vBands.length} senkrecht ${vBands.map((b) => `x${b[0]}..${b[1]}`).join(" ")}  ·  Stabpixel ${barPx}`);
  if (hBands.length + vBands.length !== 5) {
    fail.push(`${hBands.length + vBands.length} Gitterachsen statt 5 — entweder fehlt ein Stab ganz, oder einer ist so zerrissen, dass er nicht mehr als Achse lesbar ist`);
  }
  const walk = (band, horizontal) => {
    const [a, b] = band;
    const lo = horizontal ? ox0 : oy0, hi = horizontal ? ox1 : oy1;
    const open = horizontal ? colOpen : rowOpen;
    const has = (t) => { for (let u = a; u <= b; u++) if (horizontal ? ink(delivery, t, u) : ink(delivery, u, t)) return true; return false; };
    const holes = [];
    for (let t = lo; t <= hi; t++) if (open[t] && !has(t)) holes.push(t);
    const runs = [];
    for (const t of holes) { const r = runs[runs.length - 1]; if (r && t === r[1] + 1) r[1] = t; else runs.push([t, t]); }
    let head = 0, tail = 0;
    for (let t = lo; t <= hi; t++) { if (!open[t]) continue; if (has(t)) break; head++; }
    for (let t = hi; t >= lo; t--) { if (!open[t]) continue; if (has(t)) break; tail++; }
    const interior = runs.filter((r) => r[0] > lo + head && r[1] < hi - tail);
    const worst = interior.reduce((m, r) => Math.max(m, r[1] - r[0] + 1), 0);
    const name = `${horizontal ? "waagrecht" : "senkrecht"} ${a}..${b}`;
    lines.push(`    ${name.padEnd(22)} Rand vorne ${String(head).padStart(3)}  Rand hinten ${String(tail).padStart(3)}  innere Loecher ${interior.length} (laengstes ${worst})`);
    if (head > OPEN_EDGE_TOL) fail.push(`${name}: der Stab beginnt erst ${head} px hinter der Oeffnungskante — er endet frei in der Luft`);
    if (tail > OPEN_EDGE_TOL) fail.push(`${name}: der Stab hoert ${tail} px vor der Oeffnungskante auf — er endet frei in der Luft`);
    if (worst > HOLE_TOL) fail.push(`${name}: Loch von ${worst} px im Stab`);
  };
  for (const b of hBands) walk(b, true);
  for (const b of vBands) walk(b, false);

  // 4 · Fremdpixel: was im Fenster steht und nicht am Gitter haengt
  const lab = new Int32Array(W * H).fill(-1);
  const sizes = [];
  for (let y = hy0; y <= hy1; y++) for (let x = hx0; x <= hx1; x++) {
    const p = y * W + x;
    if (!inO[p] || !ink(delivery, x, y) || lab[p] >= 0) continue;
    const id = sizes.length; const st = [p]; lab[p] = id; let n = 0;
    while (st.length > 0) {
      const q = st.pop(); n++;
      const qx = q % W, qy = (q - qx) / W;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = qx + dx, ny = qy + dy;
        if (nx < hx0 || ny < hy0 || nx > hx1 || ny > hy1) continue;
        const r = ny * W + nx;
        if (inO[r] && ink(delivery, nx, ny) && lab[r] < 0) { lab[r] = id; st.push(r); }
      }
    }
    sizes.push(n);
  }
  const main = sizes.indexOf(Math.max(...sizes));
  let foreign = 0;
  for (let y = hy0; y <= hy1; y++) for (let x = hx0; x <= hx1; x++) {
    const p = y * W + x;
    if (lab[p] >= 0 && lab[p] !== main) foreign++;
  }
  lines.push(`  Fremdpixel im Fenster (haengt nicht am Gitter): ${foreign} in ${sizes.length - 1} Inseln`);
  if (foreign > 0) fail.push(`${foreign} Bildpunkte stehen im Fenster, ohne am Gitter zu haengen — Rest der alten Figur oder Sprenkel`);

  return { lines, fail };
}

function cellOf(sheetPng, pos, cols = 4, rows = 1) {
  const cw = sheetPng.width / cols, chh = sheetPng.height / rows;
  const img = crop(sheetPng, (pos % cols) * cw, Math.floor(pos / cols) * chh, cw, chh);
  chromaKey(img);
  defringe(img);
  const box = contentBox(img);
  if (box === null) return null;
  return crop(img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);
}

/** Der Selbsttest baut den Fall, in dem RICHTIG und PLAUSIBEL-FALSCH auseinandergehen:
 *  ein senkrechter Stab vor einer Figur. Die richtige Leerung nimmt die Figur und
 *  laesst den Stab; die plausibel-falsche legt ein gerades Viereck ueber das Fenster
 *  und schneidet dem Stab den Fuss ab. Beide sehen "sauber geleert" aus. */
function selftest() {
  const W = 100, H = 80;
  const mk = (fn) => { const p = new PNG({ width: W, height: H }); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) fn(p, x, y, (y * W + x) * 4); return p; };
  const set = (p, i, r, g, b, a) => { p.data[i] = r; p.data[i + 1] = g; p.data[i + 2] = b; p.data[i + 3] = a; };
  const frame = (x, y) => x < 8 || x > 91 || y < 8 || y > 71;
  const vbar = (x) => (x >= 28 && x <= 32) || (x >= 48 && x <= 52) || (x >= 68 && x <= 72);
  const hbar = (y) => (y >= 28 && y <= 32) || (y >= 50 && y <= 54);
  const grid = (x, y) => vbar(x) || hbar(y);
  const paint = (p, i, what) => {
    if (what === "frame") set(p, i, 90, 95, 100, 255);
    else if (what === "bar") set(p, i, 70, 78, 84, 255);
    else if (what === "figure") set(p, i, 210, 170, 120, 255);
    else set(p, i, 0, 0, 0, 0);
  };
  const build = (rule) => mk((p, x, y, i) => paint(p, i, rule(x, y)));
  const stock = build((x, y) => frame(x, y) ? "frame" : grid(x, y) ? "bar" : "figure");
  const right = build((x, y) => frame(x, y) ? "frame" : grid(x, y) ? "bar" : "nichts");
  // plausibel-falsch: die Oeffnung wird als GERADES Viereck gedacht, dessen untere
  // Kante 10 px zu hoch liegt — die drei Stabfuesse fallen mit heraus. Genau der
  // Fehler, den eine Abnahme uebersieht, die mit der Oeffnungsmaske des
  // Lieferanten misst: innerhalb SEINER Oeffnung ist alles korrekt.
  const wrong = build((x, y) => frame(x, y) ? "frame" : (vbar(x) && y >= 62) ? "nichts" : grid(x, y) ? "bar" : "nichts");
  // und: ein Rest der alten Figur bleibt in einer Ecke stehen
  const leftover = build((x, y) => frame(x, y) ? "frame" : grid(x, y) ? "bar"
    : (x >= 76 && x <= 88 && y >= 58 && y <= 68) ? "figure" : "nichts");
  const cases = [
    ["richtig geleert (Figur weg, alle fuenf Staebe ganz)", right, false],
    ["drei Stabfuesse mit abgeschnitten (gerades Viereck)", wrong, true],
    ["Rest der Figur in der Ecke", leftover, true],
  ];
  let bad = 0;
  for (const [name, png, shouldFail] of cases) {
    const { lines, fail } = windowAcceptance(stock, png);
    const red = fail.length > 0;
    console.log(`  ${red ? "ROT  " : "GRUEN"}  ${name}`);
    for (const l of lines) console.log(`     ${l}`);
    for (const f of fail) console.log(`     x ${f}`);
    if (red !== shouldFail) { bad++; console.error(`  x erwartet war ${shouldFail ? "ROT" : "GRUEN"}`); }
  }
  if (bad > 0) {
    console.error(`\nimport-batch-aq15 --selftest: ${bad} Fall/Faelle nicht wie erwartet`);
    process.exit(1);
  }
  console.log("\nimport-batch-aq15 --selftest: OK — die Abnahme sieht ihr rotes Licht am abgeschnittenen Stabfuss UND am Figurenrest, und laesst die ehrliche Leerung durch");
  process.exit(0);
}

if (process.argv.includes("--selftest")) selftest();

if (process.argv.includes("--abnahme")) {
  const at = process.argv.indexOf("--abnahme");
  const stem = process.argv[at + 1], file = process.argv[at + 2], pos = Number(process.argv[at + 3] ?? 0);
  if (!stem || !file) {
    console.error("usage: node docs/art/import-batch-aq15.mjs --abnahme <stem> <blatt.png> <zelle 0-3>");
    process.exit(2);
  }
  const dest = path.join(OUT, `${stem}.png`);
  if (!fs.existsSync(dest)) { console.error(`kein Bestand: ${dest}`); process.exit(2); }
  const cut = cellOf(read(file), pos);
  if (cut === null) { console.error(`Zelle ${pos} ist leer`); process.exit(2); }
  console.log(`\nFenster-Abnahme · ${stem} ← ${path.basename(file)} Zelle ${pos + 1}  (Schnitt ${cut.width}x${cut.height})`);
  const { lines, fail } = windowAcceptance(read(dest), cut);
  for (const l of lines) console.log(l);
  if (fail.length > 0) {
    console.log("");
    for (const f of fail) console.error(`  ✗ ${f}`);
    console.error(`\nAbnahme ${stem}: ${fail.length} Befund(e) — diese Zelle wird NICHT importiert`);
    process.exit(1);
  }
  console.log(`\nAbnahme ${stem}: bestanden`);
  process.exit(0);
}

const SHEETS = [
  {
    file: "batch-aq15/merle_caged_v2.png", cols: 4, rows: 1,
    pieces: [[0, "merle_caged0"], [1, "merle_caged1"]],
    note: "MERLE gefangen, gedämpft · Prüfer: ANGENOMMEN · Zelle 3 (halb wach) + merle_hop bleiben für F6",
  },
];

const notes = [];
const written = [];
const failures = [];

const sheetOf = (rel) => {
  const p = path.join(LAB, rel);
  return fs.existsSync(p) ? read(p) : null;
};

for (const sheet of SHEETS) {
  const png = sheetOf(sheet.file);
  if (png === null) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const cw = png.width / sheet.cols;
  const chh = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(chh)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
    continue;
  }
  notes.push(`· ${sheet.note}`);

  for (const [pos, stem] of sheet.pieces) {
    const img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * chh, cw, chh);
    const impure = impureKey(img);
    chromaKey(img);
    const fringed = defringe(img);

    const box = contentBox(img);
    if (!box) { failures.push(`${stem}: keyed to nothing`); continue; }
    const out = crop(img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);

    const dest = path.join(OUT, `${stem}.png`);
    if (!fs.existsSync(dest)) {
      failures.push(`${stem}: this import REPLACES an existing sheet, but ${dest} is not on disk`);
      continue;
    }
    const incumbent = read(dest);
    if (out.width !== incumbent.width || out.height !== incumbent.height) {
      failures.push(`${stem}: cut to ${out.width}×${out.height}, the sheet it replaces is ${incumbent.width}×${incumbent.height} — the card portrait and the world both anchor on this box`);
      continue;
    }

    const satBefore = meanSaturation(incumbent);
    const { ghosts, holes } = stencil(out, incumbent);
    const satAfter = meanSaturation(out);

    const dist = keyDistance(out);
    if (dist.euclid < 150) {
      failures.push(`${stem}: a painted pixel sits ${dist.euclid.toFixed(2)} (Euclidean) from the import colour — needs ≥150`);
      continue;
    }

    if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
    written.push(
      `overwrote ${stem}.png`.padEnd(30)
      + `${out.width}×${out.height}`.padEnd(10)
      + `key ${dist.euclid.toFixed(1)}e/${dist.manhattan}m`.padEnd(20)
      + `Saum ${String(fringed).padStart(4)}  unrein ${String(impure).padStart(4)}  `
      + `Geister ${String(ghosts).padStart(4)}  Löcher ${String(holes).padStart(4)}  `
      + `Sättigung ${satBefore.toFixed(3)} → ${satAfter.toFixed(3)}`,
    );
  }
}

for (const n of notes) console.log(n);
console.log("");
for (const w of written) console.log(`  ${DRY ? "[dry] " : ""}${w}`);
console.log("");
console.log("  Löcher = Pixel, die der Bestand malt und die Lieferung nicht — bei »pixelidentischer Silhouette« muss das 0 sein.");
console.log("  Sättigung = die Dämpfung, auf die sich R103 verlässt (das Blatt trägt sie, nicht der Code).");
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq15: ${failures.length} failure(s) — nothing about this delivery is accepted`);
  process.exit(1);
}
console.log(`import-batch-aq15: OK — ${written.length} stem(s)${DRY ? " (dry run, nothing written)" : ""}`);
