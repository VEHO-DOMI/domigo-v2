#!/usr/bin/env node
// R5-W3 · A5 · A PLANE'S VALUE IS A NUMBER, SO CHANGING IT IS A SCRIPT.
//
// Koki, replaying the arena: „Ohrensessel statt Schulstühle." The empty school
// chairs are the room's whole premise — the story bible's „Reihen leerer Stühle
// … die Klasse fehlt, und das Loch ist die Erzählung" — and they were standing
// BEHIND the blue armchairs, because as the near furniture row they measured
// 22.26 % against a band that ends at 21.0 % (check-composition.mjs audit 1,
// `bandsFor(K)` at K = 28). H1 parked them in the far row rather than bend a
// measured law, and said so in composition.ts. This is the round that pays it.
//
// ── WHY A SCRIPT AND NOT AN EDITED PNG ───────────────────────────────────────
//  · REPRODUCIBLE. The target is DECLARED here, next to the reason. Anyone can
//    re-derive the shipped sheet instead of taking a binary diff on faith.
//  · REBASE-SAFE. Art bytes conflict badly, and E5's lossless recompression
//    lands before this branch. A conflict is resolved by re-running, not by
//    merging pixels.
//  · IDEMPOTENT. A sheet already inside tolerance is left untouched, byte for
//    byte, so running twice is running once.
//  · HONEST. The audits measure the SOURCE pixels, not the drawn result. A
//    runtime tint would move what the room looks like without moving what the
//    gate reads — the two would drift apart, which is the exact failure mode
//    audit 10c exists to prevent. So the sheet itself changes.
//
// ── THE OPERATION ────────────────────────────────────────────────────────────
// One multiplicative factor on R, G and B; alpha untouched. Chosen because
// relative luminance is LINEAR in the channels, so a factor k moves the mean
// by exactly k and nothing else has to be guessed — and because (max − min) /
// max is scale-invariant, HSV saturation comes out unchanged. This is a VALUE
// pass in the painter's sense: the same painting, at a different key. Hue and
// chroma stay the artist's.
//
// ── R5-W8 · W7 · R209f/D-554 · DER PIN-WAECHTER ──────────────────────────────
//
// H5 hat es GEMESSEN, nicht vermutet: wer dieses Skript heute fuer
// `band_p4_audience` faehrt, skaliert die Kanaele um 0,9629 — und die 8-Bit-
// Rundung hebt die Rauhheit von 0,29924 auf 0,30027, ueber die BESTELLTE
// Obergrenze 0,30. Die erklaerte Reparatur wuerde also eine Decke reissen, die
// der Wareneingang genau an diesen Pixeln gemessen und angenommen hat.
//
// Das Muster hier drueber („der Zielwert ist DEKLARIERT, also ist das Blatt
// nachrechenbar") ist richtig — solange das Blatt aus dem Repo stammt. Fuer ein
// ANGENOMMENES Blatt ist es falsch herum: dort ist die Lieferung die Wahrheit
// und das Ziel eine aeltere Absicht. Ein Skript, das eine angenommene Lieferung
// stillschweigend ueberschreibt, ist eine Falle — und zwar eine, die erst beim
// naechsten Tor-Lauf auffaellt, wenn niemand mehr weiss, wer die Pixel bewegt hat.
//
// ★ DER PIN SITZT AUF DEN BYTES, NIE AUF DEM NAMEN. Genau wie `SPERR_BUEHNEN`
//   und `OVERLAY_MASSE_FREI` in `docs/art/import-batch-aq13.mjs`: eine Ausnahme
//   auf einem NAMEN wuerde jedes spaetere, falsche Blatt gleichen Namens
//   mitdecken. Gemessen wird sha256 ueber die rohen RGB-Bytes — dieselbe
//   Groesse, mit der die Bestellungen ihre Pins fuehren.
//
// ★ …UND WARUM RGB UND NICHT DIE DATEI. Der Wareneingang misst die BILDPUNKTE.
//   Zwischen Labor und Repo liegen Chroma-Key, Saum und verlustfreie
//   Nachverdichtung: die Datei-Pruefsumme aendert sich dabei, der Alphakanal
//   auch — die RGB-Bytes nicht. GEMESSEN am 22.08.: die Labor-Datei
//   `~/Code/codex-art-lab/batch-aq13c4/band_p4_audience.png` und das
//   ausgelieferte `apps/web/public/art/g1/paint/ch01/band_p4_audience.png`
//   haben verschiedene Datei-SHAs (ca60cf45… / 7257fafc…) und DENSELBEN
//   RGB-Hash ce96a06c…. Deshalb traegt der Pin durch den Import hindurch — und
//   deshalb ueberlebt der Selbsttest-Fall unten auch F9s Band-Rueckbau.
//
// Run: node scripts/set-plane-value.mjs [--dry]
//      node scripts/set-plane-value.mjs --selftest
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const R = process.cwd();
const ART = path.join(R, "apps/web/public/art/g1/paint");

/**
 * The declared targets. `was` is documentation of the shipped value at the time
 * the target was set — the script never asserts it, because after the first run
 * it is no longer true. Git holds the original.
 */
const TARGETS = {
  band_p4_audience: {
    // ── R5-T10 · DAS ZIEL FOLGT DER NACHT (2026-08-31) ─────────────────────
    // R15 rechnete 14,8 aus `bandsFor(28)`. Der Raum traegt seit T10 die
    // Schluesselzahl seiner eigenen Nacht (K = 19, R231), und das Blatt ist
    // nicht mehr das, das R15 gedunkelt hat: es ist die angenommene
    // AQ22-A2-Lieferung, die ihren Wert MITBRINGT.
    lum: 11.64,
    was: 14.8,
    why:
      "the arena's NEAR furniture row, re-derived for the night key (T10). "
      + "At K=19 audit 1's L2 band is [9.5, 14.25], and the ABSOLUTE L2↔L3 "
      + "separation of 12 points against a measured L3 of 27.2 % caps L2 at "
      + "15.2 — so the binding window is [9.5, 14.25]. The AQ22-A2 delivery "
      + "MEASURES 11.639 % (this file's own meanLum, 19 434 samples), 2.1 "
      + "points from the lower wall and 2.6 from the upper. The target is "
      + "therefore documentation of where the accepted sheet already sits, "
      + "not an instruction to move it — and the Wareneingangs-Pin below "
      + "refuses the move in any case.",
  },
};

/** sha256 ueber die rohen RGB-Bytes eines ganzen Blattes — die Groesse, mit der
 *  der Wareneingang seine Pins fuehrt (`import-batch-aq13.mjs#blattHash`).
 *
 *  ⚠ Das ist eine KOPIE jener Funktion, und eine Kopie driftet. Sie wird
 *  deshalb nicht geglaubt, sondern GEPRUEFT: der Selbsttest rechnet sie ueber
 *  ein echtes Blatt und vergleicht das Ergebnis mit dem gemessenen Pin unten.
 *  Weicht die Formel ab, faellt der Selbsttest — nicht der naechste Import.
 *  (Direkt importieren geht nicht: `import-batch-aq13.mjs` fuehrt beim Laden
 *  seine eigenen CLI-Zweige aus und wuerde bei `--selftest` den falschen fahren
 *  — dieselbe Falle, die chrome-hygiene.mjs im Kopf traegt.) */
const blattHash = (png) => {
  const buf = Buffer.allocUnsafe(png.width * png.height * 3);
  let k = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    buf[k++] = png.data[i];
    buf[k++] = png.data[i + 1];
    buf[k++] = png.data[i + 2];
  }
  return crypto.createHash("sha256").update(buf).digest("hex");
};

/**
 * Blaetter, die der Wareneingang ANGENOMMEN hat. Form: RGB-sha256 → Herkunft.
 * Wer hier steht, wird von diesem Skript nicht angefasst — auch dann nicht,
 * wenn sein deklarierter Zielwert etwas anderes sagt.
 */
export const WARENEINGANGS_PINS = new Map([
  ["ce96a06c7b7275f2231ec3cc09243186f253fe06a05cec50ee4529435168945f",
    "band_p4_audience aus AQ13c4 — Wareneingang H5, 22.08.2026 (Ring-Abnahme bestanden, "
    + "Rauhheit 0,29924 gegen die bestellte Decke 0,30, Reserve 0,00076)"],
  // ── R5-T10 · DAS BLATT, DAS HEUTE IM SPIEL LIEGT (2026-08-31) ────────────
  // Der Eintrag darueber schuetzt die c4-Lieferung — und die liegt seit T10
  // NICHT MEHR im Spiel; sie lebt nur noch als Fixture, an der der Selbsttest
  // die Hash-Formel misst. Ohne diese zweite Zeile waere die ausgelieferte
  // Nacht-Malerei ungeschuetzt: ein Lauf dieses Skripts wuerde sie auf ein
  // Ziel skalieren, das der Wareneingang nie bestellt hat.
  //
  // ⚠ DER PIN IST DER DER AUSLIEFERUNG, NICHT DER DER LIEFERUNG — und der
  //   Unterschied ist an dieser Bahn bezahlt worden. Chroma-Key, Saum und
  //   Nachverdichtung lassen die RGB-Bytes tatsaechlich unberuehrt (gemessen:
  //   Lieferung und erste Auslieferung trugen beide 7694c48b…). Was sie BEWEGT,
  //   ist `strip-key-fringe.mjs`: der Importeur hinterliess 30 magenta Pixel auf
  //   der Schnittkante, `check-paint-art` faerbte rot, und die Reparatur heilte
  //   sie — womit der eben gesetzte Pin ins Leere zeigte und die Sperre STILL
  //   aufhoerte zu sperren (das Skript lief danach nur noch deshalb nicht, weil
  //   es den Zielwert zufaellig schon getroffen sah). Gesetz: ein Pin auf
  //   ausgeliefertem Blatt wird NACH der letzten Byte-Bewegung gemessen, und die
  //   Saum-Reparatur ist eine.
  ["4971df7c54d13d51fd6b50f4b978651f57fe6d0e6a6f8092d6488dab166a8593",
    "band_p4_audience aus AQ22 Amendment A2 — Wareneingang 30.08.2026 (Panel 2:0 mit "
    + "gehaltenem Reihenfolgen-Tausch, lum 11,639 % im bestellten Fenster [10,0–12,5], "
    + "sat 24,17, Magenta 0, frisch gemalt r=0,08 gegen den Bestand); ausgeliefert nach "
    + "Import + strip-key-fringe + Nachverdichtung. Lieferungs-RGB-sha war 7694c48b…"],
]);

/** Der Satz, mit dem verweigert wird. Als Konstante, damit der Selbsttest auf
 *  DEN Wortlaut prueft und nicht auf ein Stueck davon. */
export const PIN_VERWEIGERUNG =
  "angenommene Lieferung — das Wareneingangs-Mass ersetzt das R15-Ziel; "
  + "Aenderung nur ueber neue Lieferung + Wareneingang";

/**
 * Das Urteil ueber ein Blatt, bevor ein Byte bewegt wird. Rein, damit der
 * Selbsttest beide Richtungen sehen kann — eine Sperre, die nie greift, ist
 * Dekoration; eine, die immer greift, macht das Skript nutzlos.
 */
export const pinUrteil = (hash, pins = WARENEINGANGS_PINS) => {
  const herkunft = pins.get(hash);
  if (herkunft === undefined) return { gesperrt: false, hash, herkunft: null };
  return {
    gesperrt: true,
    hash,
    herkunft,
    meldung: `${PIN_VERWEIGERUNG}. Pin ${hash.slice(0, 16)}… — ${herkunft}. `
      + "Der Wareneingang hat GENAU DIESE Bildpunkte gemessen und angenommen; ein Wertepass "
      + "darueber wuerde eine bestellte Decke reissen (D-554: Rauhheit 0,29924 → 0,30027 bei Ziel 14,8 %).",
  };
};

/** Tolerance in luminance points. Tight enough to pin the sheet, loose enough
 *  that 8-bit rounding over ~20k samples is never the reason for a rewrite. */
const TOL = 0.05;

// The measure is check-composition.mjs's, character for character: same three
// coefficients, same 3-px stride, same alpha ≥ 128 visibility rule. One measure,
// two tools — a repair that measured differently from the gate would be a repair
// aimed at the wrong number.
const lumOf = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const meanLum = (png) => {
  let n = 0;
  let lum = 0;
  for (let y = 0; y < png.height; y += 3) {
    for (let x = 0; x < png.width; x += 3) {
      const i = (png.width * y + x) << 2;
      if (png.data[i + 3] < 128) continue;
      lum += lumOf(png.data[i], png.data[i + 1], png.data[i + 2]);
      n++;
    }
  }
  return n === 0 ? null : (lum / n) * 100;
};

const scaled = (png, k) => {
  const out = new PNG({ width: png.width, height: png.height });
  for (let i = 0; i < png.data.length; i += 4) {
    out.data[i] = Math.min(255, Math.round(png.data[i] * k));
    out.data[i + 1] = Math.min(255, Math.round(png.data[i + 1] * k));
    out.data[i + 2] = Math.min(255, Math.round(png.data[i + 2] * k));
    out.data[i + 3] = png.data[i + 3];
  }
  return out;
};

/** Solve for the factor that lands the mean on `target`. Rounding to 8 bits
 *  makes one division an estimate rather than an answer, so it is refined —
 *  always from the ORIGINAL pixels, never by stacking passes, because stacking
 *  would make the result depend on how many times the script had been run. */
const fitToTarget = (png, target) => {
  let k = target / meanLum(png);
  let best = null;
  for (let pass = 0; pass < 8; pass++) {
    const candidate = scaled(png, k);
    const got = meanLum(candidate);
    if (best === null || Math.abs(got - target) < Math.abs(best.got - target)) best = { png: candidate, got, k };
    if (Math.abs(got - target) <= TOL) break;
    k *= target / got;
  }
  return best;
};

const findStem = (stem) => {
  for (const dir of ["ch01", "hero"]) {
    const p = path.join(ART, dir, `${stem}.png`);
    if (fs.existsSync(p)) return p;
  }
  return null;
};

// ── selftest: the tool proves its own arithmetic before anyone trusts a number
// it printed. A repair tool that cannot demonstrate it hits a declared value is
// a repair tool nobody can defend (measure-presence.mjs's rule, borrowed).
if (process.argv.includes("--selftest")) {
  const png = new PNG({ width: 60, height: 60 });
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = 200; png.data[i + 1] = 160; png.data[i + 2] = 120; png.data[i + 3] = 255;
  }
  const before = meanLum(png);
  const fitted = fitToTarget(png, before / 2);
  const drift = Math.abs(fitted.got - before / 2);
  console.log(`selftest: ${before.toFixed(3)} % → ${fitted.got.toFixed(3)} % (target ${(before / 2).toFixed(3)} %, drift ${drift.toFixed(4)})`);
  if (drift > TOL) { console.error(`✗ selftest: missed its own target by ${drift.toFixed(4)} points`); process.exit(1); }
  // …and saturation must survive the pass, or this stopped being a value pass.
  const satOf = (r, g, b) => (Math.max(r, g, b) === 0 ? 0 : (Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(r, g, b));
  const s0 = satOf(200, 160, 120);
  const s1 = satOf(fitted.png.data[0], fitted.png.data[1], fitted.png.data[2]);
  console.log(`selftest: saturation ${(s0 * 100).toFixed(2)} % → ${(s1 * 100).toFixed(2)} %`);
  if (Math.abs(s0 - s1) > 0.01) { console.error("✗ selftest: the pass moved saturation — it is not a value pass"); process.exit(1); }
  // ── R5-W8 · W7 · R209f/D-554 · DER PIN-WAECHTER, AM GEMESSENEN FALL ──────
  // Nicht an einem synthetischen Blatt: das c4-Band ist die Lieferung, an der
  // H5 die Decke reissen sah, und die Fixture ist eine Kopie GENAU dieser Datei
  // aus `~/Code/codex-art-lab/batch-aq13c4/`. Sie liegt im Repo, weil eine
  // Pruefung, die ihre Datei nur benutzt, wenn das Labor zufaellig auf der
  // Maschine liegt, keine Pruefung ist.
  {
    const fixture = path.join(path.dirname(new URL(import.meta.url).pathname), "fixtures/band_p4_audience_aq13c4.png");
    if (!fs.existsSync(fixture)) {
      console.error(`✗ selftest: die Fixture fehlt (${fixture}) — ohne sie prueft dieser Fall nichts`);
      process.exit(1);
    }
    const blatt = PNG.sync.read(fs.readFileSync(fixture));
    const hash = blattHash(blatt);

    // 1 · die KOPIE der Hash-Formel wird gegen den gemessenen Pin gehalten.
    //     Driftet sie, faellt es hier auf und nicht beim naechsten Import.
    const PIN = "ce96a06c7b7275f2231ec3cc09243186f253fe06a05cec50ee4529435168945f";
    if (hash !== PIN) {
      console.error(`✗ selftest: die RGB-Hash-Formel liefert ${hash.slice(0, 16)}… statt des gemessenen `
        + `Wareneingangs-Pins ${PIN.slice(0, 16)}… — die Kopie aus import-batch-aq13.mjs ist gedriftet`);
      process.exit(1);
    }
    console.log(`selftest: die Fixture traegt den Wareneingangs-Pin ${PIN.slice(0, 16)}… (${blatt.width}×${blatt.height})`);

    // 2 · …und das Blatt wird VERWEIGERT, mit dem bestellten Wortlaut.
    const gesperrt = pinUrteil(hash);
    if (!gesperrt.gesperrt) { console.error("✗ selftest: das angenommene c4-Band wird NICHT blockiert"); process.exit(1); }
    if (!gesperrt.meldung.includes(PIN_VERWEIGERUNG)) {
      console.error("✗ selftest: die Verweigerung sagt nicht, was sie sagen soll");
      process.exit(1);
    }
    if (!/0,30027|0\.30027/.test(gesperrt.meldung)) {
      console.error("✗ selftest: die Verweigerung nennt die gemessene Folge nicht (D-554)");
      process.exit(1);
    }
    console.log("selftest: das angenommene Band wird verweigert — «" + PIN_VERWEIGERUNG + "»");

    // 3 · TAMPER, AUF DEM FALL SITZEND (P-82). Dasselbe Blatt, aber der Pin
    //     zeigt auf ANDERE Bytes. Die Sperre darf dann NICHT greifen — sonst
    //     sperrt sie in Wahrheit den Namen oder alles, und beides waere eine
    //     andere Regel als die geschriebene.
    const fremd = new Map([["0".repeat(64), "Selbsttest-Pin auf fremde Bytes"]]);
    if (pinUrteil(hash, fremd).gesperrt) {
      console.error("✗ TAMPER: die Sperre greift auch bei einem Pin auf fremde Bytes — sie sitzt nicht auf den Bytes");
      process.exit(1);
    }
    // …und der Gegen-Tamper: EIN Byte des Blattes geaendert ⇒ der echte Pin
    //   trifft nicht mehr. Ein Pin, der ein veraendertes Blatt noch deckt,
    //   waere ein Pin auf gar nichts.
    const kopie = PNG.sync.read(fs.readFileSync(fixture));
    kopie.data[0] = kopie.data[0] === 0 ? 1 : kopie.data[0] - 1;
    const hashKopie = blattHash(kopie);
    if (hashKopie === hash) { console.error("✗ TAMPER sass nicht: ein geaendertes Byte aenderte den Hash nicht"); process.exit(1); }
    if (pinUrteil(hashKopie).gesperrt) {
      console.error("✗ TAMPER: ein Blatt mit EINEM anderen Byte wird noch immer gedeckt");
      process.exit(1);
    }
    console.log("selftest: TAMPER — ein Pin auf fremde Bytes sperrt nicht, und EIN geaendertes Byte "
      + "faellt aus dem Pin heraus (die Sperre sitzt auf den Bytes, nicht auf dem Namen)");
  }

  console.log("✓ selftest passed");
  process.exit(0);
}

const dry = process.argv.includes("--dry");
let failures = 0;
let wrote = 0;

for (const [stem, spec] of Object.entries(TARGETS)) {
  const file = findStem(stem);
  if (!file) { console.error(`✗ ${stem}: not on disk`); failures++; continue; }
  const png = PNG.sync.read(fs.readFileSync(file));

  // ── R5-W8 · W7 · R209f/D-554 · ZUERST: gehoert dieses Blatt dem Wareneingang?
  // Vor dem Messen, nicht danach — und auch im `--dry`, weil ein Trockenlauf,
  // der eine Zahl druckt, die niemand fahren darf, dieselbe Falle stellt.
  const urteil = pinUrteil(blattHash(png));
  if (urteil.gesperrt) {
    console.error(`✗ ${stem}: ${urteil.meldung}`);
    console.error("   Es wird kein Byte geschrieben. Wenn das Ziel fuer diesen Stem wirklich fallen soll, "
      + "gehoert es HIER zurueckgezogen (mit Grund) — nicht ueber das Blatt hinweg.");
    failures++;
    continue;
  }

  const got = meanLum(png);
  if (got === null) { console.error(`✗ ${stem}: no visible pixels to measure`); failures++; continue; }

  if (Math.abs(got - spec.lum) <= TOL) {
    console.log(`  ${stem}: ${got.toFixed(2)} % — already at its declared ${spec.lum} % (±${TOL}), untouched`);
    continue;
  }

  const fitted = fitToTarget(png, spec.lum);
  if (Math.abs(fitted.got - spec.lum) > TOL) {
    console.error(`✗ ${stem}: could not reach ${spec.lum} % — closest ${fitted.got.toFixed(3)} % at k=${fitted.k.toFixed(5)}`);
    failures++;
    continue;
  }
  console.log(`  ${stem}: ${got.toFixed(2)} % → ${fitted.got.toFixed(2)} % (k = ${fitted.k.toFixed(4)})${dry ? "  [dry]" : ""}`);
  if (!dry) { fs.writeFileSync(file, PNG.sync.write(fitted.png)); wrote++; }
}

console.log(dry ? "\ndry run — nothing written" : `\n${wrote} sheet(s) written`);
process.exit(failures > 0 ? 1 : 0);
