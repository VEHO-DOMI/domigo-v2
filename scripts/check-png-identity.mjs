#!/usr/bin/env node
// R5-W3 · E5 · „GAR KEIN QUALITÄTSVERLUST" — BEWIESEN, NICHT BEHAUPTET.
//
// Kokis Weisung vom 11.08. steht wörtlich: vor jeder Komprimierung erst alles
// verifizieren, KEIN Qualitätsverlust. Verlustfreie Nachverdichtung erfüllt das
// — aber „verlustfrei" ist die Behauptung des Werkzeugs über sich selbst, und
// ein Selbstbericht ist kein Beweis (die Lehre der I1-Sitzung, zwei Minuten
// Nachmessen).
//
// Also wird es nachgemessen: für JEDE geänderte PNG-Datei wird die Fassung aus
// git und die Fassung auf der Platte dekodiert und Bildpunkt für Bildpunkt
// verglichen — Breite, Höhe und alle vier Kanäle. Eine einzige Abweichung ist
// ein Abbruch. Verglichen werden die BILDPUNKTE, nicht die Bytes: eine kleinere
// Datei mit identischen Bildpunkten ist genau das Ziel.
//
// ── R5-W5 · W4 · D-257 + D-98: DER ECHTE LAUF IN CI ─────────────────────────
//
// In ci.yml stand von diesem Skript nur die `--selftest`-Zeile. Es hat dort auf
// jedem Lauf sein rotes Licht bewiesen und nie eine echte Datei angesehen —
// verteidigbar (im frischen Checkout ist `git diff HEAD` leer), aber es war das
// einzige Tor der Liste, dessen Rumpf in CI nie lief.
//
// Der Grund, warum ein blanker Lauf gegen die Basis NICHT geht: eine
// Import-Runde malt Blätter ABSICHTLICH neu. „Kein Bildpunkt darf sich gegenüber
// main ändern" wäre kein Tor, sondern ein Verbot von Kunst.
//
// Also läuft in CI genau die Klasse, die D-98 gemessen hat, und nur die: beim
// A5-Rebase mussten vier Blätter neu abgeleitet werden, die Skripte schrieben
// mit pngjs-Standardkompression, und `band_p4_audience` wuchs um 190.184 Bytes —
// bei IDENTISCHEN Bildpunkten. Kein Tor schlug an, weil das Budget-Tor nur die
// Summe sieht. Die Regel ist deshalb:
//
//   Bildpunkte identisch, Bytes kleiner/gleich  → ✓ Nachverdichtung bewiesen
//   Bildpunkte identisch, Bytes GRÖSSER         → ✗ ROT: ein Skript hat E5s
//                                                   Nachverdichtung still
//                                                   zurückgenommen (D-98)
//   Bildpunkte anders                           → neue Kunst; wird mit Zahlen
//                                                   gemeldet, ist kein Verstoß
//
// Damit läuft der Rumpf an echten Dateien und kann keine Import-Runde
// fälschlich rot machen.
//
// `--strict` ist der WERKBANK-Modus (der bisherige, unveränderte): dort ist
// jede Abweichung ein Abbruch, weil dort gerade nachverdichtet wurde und sich
// per Konstruktion nichts ändern darf. D-98s Regel bleibt: jedes PNG-schreibende
// Skript endet mit `art-recompress.mjs && check-png-identity.mjs --strict`.
//
// Run: node scripts/check-png-identity.mjs --strict [--ref <git-ref>]  (Werkbank)
//      node scripts/check-png-identity.mjs --ref origin/main           (CI)
//      node scripts/check-png-identity.mjs --selftest   (proves the red light works)
//
// Ohne --ref wird gegen HEAD verglichen, also gegen den letzten Commit.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const args = process.argv.slice(2);
const ref = args.includes("--ref") ? args[args.indexOf("--ref") + 1] : "HEAD";
const selftest = args.includes("--selftest");
const strict = args.includes("--strict");

/** decode a PNG buffer to {w,h,data} — throws on anything that is not one */
const decode = (buf) => {
  const png = PNG.sync.read(buf);
  return { w: png.width, h: png.height, data: png.data };
};

/** the first pixel where two decoded images differ, or null if they are identical */
const firstDifference = (a, b) => {
  if (a.w !== b.w || a.h !== b.h) return { kind: "size", was: `${a.w}×${a.h}`, now: `${b.w}×${b.h}` };
  for (let i = 0; i < a.data.length; i++) {
    if (a.data[i] !== b.data[i]) {
      const px = Math.floor(i / 4);
      const ch = ["R", "G", "B", "A"][i % 4];
      return { kind: "pixel", x: px % a.w, y: Math.floor(px / a.w), channel: ch, was: a.data[i], now: b.data[i] };
    }
  }
  return null;
};

/** D-98 · was ein Bildpunkt-gleiches Paar über die Kompression verrät. */
export const recompressionVerdict = ({ pixelsIdentical, bytesBefore, bytesAfter }) => {
  if (!pixelsIdentical) return "repaint";
  return bytesAfter > bytesBefore ? "grown" : "proven";
};

/** Ist der Alphakanal überall undurchsichtig? Dann liegt ein Viertel der Datei
 *  ungenutzt auf der Platte (E5s gemessener Hebel: die zehn größten Blätter,
 *  36,4 MB, sind vollständig undurchsichtig und trotzdem RGBA). Kein rotes
 *  Licht in dieser Runde — eine Meldung, damit die Zahl sichtbar ist. */
const fullyOpaque = (img) => {
  for (let i = 3; i < img.data.length; i += 4) if (img.data[i] !== 255) return false;
  return true;
};

if (selftest) {
  // THE CHECK MUST BE ABLE TO GO RED. Build two images that differ in exactly
  // one channel of one pixel — the smallest defect a recompressor could
  // possibly introduce — and prove the comparison finds it and names it.
  const make = (tweak) => {
    const p = new PNG({ width: 4, height: 4 });
    for (let i = 0; i < p.data.length; i += 4) {
      p.data[i] = 10; p.data[i + 1] = 20; p.data[i + 2] = 30; p.data[i + 3] = 255;
    }
    if (tweak) p.data[4 * (4 * 2 + 1) + 1] = 21; // one green channel, pixel (1,2)
    return decode(PNG.sync.write(p));
  };
  const same = firstDifference(make(false), make(false));
  const diff = firstDifference(make(false), make(true));
  let bad = 0;
  if (same !== null) { bad++; console.error("✗ identical images reported as different:", same); }
  if (diff === null) { bad++; console.error("✗ a one-channel difference went UNDETECTED — this check proves nothing"); }
  else if (!(diff.x === 1 && diff.y === 2 && diff.channel === "G" && diff.was === 20 && diff.now === 21)) {
    bad++; console.error("✗ the difference was found but misdescribed:", diff);
  }
  // and a size change must be caught too, not silently compared channel-wise
  const small = decode(PNG.sync.write(new PNG({ width: 2, height: 2 })));
  if (firstDifference(make(false), small)?.kind !== "size") { bad++; console.error("✗ a size change went undetected"); }

  // ── W4/D-98 · das Urteil über die Nachverdichtung, alle drei Zweige ────────
  // Der mittlere Fall ist der, der main gekostet hat: gleiche Bildpunkte,
  // größere Datei. Ein Selbsttest, der nur „anders/gleich" prüft, sieht ihn nie.
  const V = [
    ["gleiche Bildpunkte, kleinere Datei", { pixelsIdentical: true, bytesBefore: 500, bytesAfter: 300 }, "proven"],
    ["gleiche Bildpunkte, gleich groß", { pixelsIdentical: true, bytesBefore: 500, bytesAfter: 500 }, "proven"],
    ["gleiche Bildpunkte, GRÖSSERE Datei (D-98)", { pixelsIdentical: true, bytesBefore: 500, bytesAfter: 690 }, "grown"],
    ["andere Bildpunkte = neue Kunst", { pixelsIdentical: false, bytesBefore: 500, bytesAfter: 900 }, "repaint"],
  ];
  for (const [name, input, want] of V) {
    const got = recompressionVerdict(input);
    if (got === want) console.log(`  ✓ ${name} → ${got}`);
    else { bad++; console.error(`  ✗ ${name}: erwartet ${want}, bekommen ${got}`); }
  }
  // …und der Alphakanal-Hebel muss beide Antworten geben können
  const opaque = make(false);
  const clear = decode(PNG.sync.write(new PNG({ width: 2, height: 2 }))); // pngjs füllt mit Alpha 0
  if (!fullyOpaque(opaque)) { bad++; console.error("✗ ein vollständig undurchsichtiges Bild wurde nicht als solches gelesen"); }
  if (fullyOpaque(clear)) { bad++; console.error("✗ ein durchsichtiges Bild wurde als undurchsichtig gelesen"); }

  if (bad > 0) { console.error("check-png-identity selftest: FAILED"); process.exit(1); }
  console.log("✓ selftest: one changed channel in one pixel is found and named; a size change is found; "
    + "identical images pass; die drei Nachverdichtungs-Urteile stimmen (D-98).");
  process.exit(0);
}

// Neu importierte Blätter (`A`) sah dieses Skript per Konstruktion nie — D-257
// nennt das ausdrücklich. Sie kommen jetzt mit, für die Zahlen; verglichen
// werden kann bei ihnen naturgemäß nichts.
const listed = (filter) => {
  try {
    return execFileSync("git", ["diff", "--name-only", `--diff-filter=${filter}`, ref, "--", "*.png"], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    }).split("\n").map((s) => s.trim()).filter(Boolean);
  } catch (e) {
    console.error(`check-png-identity: git diff gegen »${ref}« ist fehlgeschlagen — ist die Referenz da?`);
    console.error(String(e.stderr ?? e.message).trim());
    process.exit(1);
  }
};

const changed = listed("M");
const added = listed("A");

if (changed.length === 0 && added.length === 0) {
  console.log(`check-png-identity: keine geänderten oder neuen PNGs gegen ${ref} — nichts zu beweisen.`);
  process.exit(0);
}

let failures = 0;
let bytesBefore = 0;
let bytesAfter = 0;
let proven = 0;
const repaints = [];
const opaqueRgba = [];

for (const file of changed) {
  let before;
  try {
    before = execFileSync("git", ["show", `${ref}:${file}`], { maxBuffer: 64 * 1024 * 1024 });
  } catch {
    console.error(`✗ ${file}: cannot read the ${ref} version`);
    failures++;
    continue;
  }
  const after = fs.readFileSync(path.resolve(file));
  bytesBefore += before.length;
  bytesAfter += after.length;
  const imgAfter = decode(after);
  const d = firstDifference(decode(before), imgAfter);

  if (d !== null && strict) {
    failures++;
    console.error(
      d.kind === "size"
        ? `✗ ${file}: the image CHANGED SIZE ${d.was} → ${d.now}`
        : `✗ ${file}: pixel (${d.x},${d.y}) channel ${d.channel} was ${d.was}, is now ${d.now} — this is not a lossless recompression`,
    );
    continue;
  }

  const verdict = recompressionVerdict({
    pixelsIdentical: d === null, bytesBefore: before.length, bytesAfter: after.length,
  });
  if (verdict === "grown") {
    failures++;
    console.error(`✗ ${file}: JEDER BILDPUNKT IST GLEICH, die Datei ist aber um `
      + `${(after.length - before.length).toLocaleString("de-AT")} Bytes GEWACHSEN `
      + `(${before.length.toLocaleString("de-AT")} → ${after.length.toLocaleString("de-AT")}). `
      + "Das ist D-98: ein PNG-schreibendes Skript hat E5s verlustfreie Nachverdichtung still "
      + "zurückgenommen. Reparatur: `node scripts/art-recompress.mjs && node scripts/check-png-identity.mjs --strict`.");
    continue;
  }
  if (verdict === "repaint") { repaints.push({ file, before: before.length, after: after.length, d }); continue; }
  proven++;
  if (fullyOpaque(imgAfter)) opaqueRgba.push(file);
}

for (const file of added) {
  const buf = fs.readFileSync(path.resolve(file));
  bytesAfter += buf.length;
  if (fullyOpaque(decode(buf))) opaqueRgba.push(file);
}

const MB = 1048576;
const kb = (n) => `${(n / 1024).toFixed(0)} kB`;

if (repaints.length > 0) {
  console.log(`  ${repaints.length} Blatt/Blätter sind NEU GEMALT (kein Verstoß — Kunst darf sich ändern):`);
  for (const r of repaints) console.log(`    · ${r.file} — ${kb(r.before)} → ${kb(r.after)}`);
}
if (added.length > 0) {
  console.log(`  ${added.length} Blatt/Blätter sind NEU (gegen ${ref} nicht vergleichbar):`);
  for (const f of added) console.log(`    · ${f} — ${kb(fs.statSync(path.resolve(f)).size)}`);
}
if (opaqueRgba.length > 0) {
  console.log(`  ⚠ ${opaqueRgba.length} Blatt/Blätter sind vollständig UNDURCHSICHTIG und liegen trotzdem als RGBA `
    + "auf der Platte — ein Viertel jeder Datei ist ein Alphakanal, der überall 255 ist (E5s Hebel). "
    + "`node scripts/art-recompress.mjs` holt das verlustfrei heraus. Kein rotes Licht in dieser Runde:");
  for (const f of opaqueRgba.slice(0, 8)) console.log(`    · ${f}`);
  if (opaqueRgba.length > 8) console.log(`    · … (+${opaqueRgba.length - 8} weitere)`);
}

if (failures > 0) {
  console.error(`\ncheck-png-identity: ${failures} von ${changed.length} geänderten Blättern verletzen die Regel`);
  process.exit(1);
}
const delta = bytesBefore > 0 ? ((bytesAfter - bytesBefore) / bytesBefore) * 100 : 0;
const trend = `${delta <= 0 ? "−" : "+"}${Math.abs(delta).toFixed(1)} %`;
console.log(
  `check-png-identity: OK — ${proven} Blatt/Blätter Bildpunkt für Bildpunkt identisch zu ${ref} und nicht gewachsen, `
  + `${repaints.length} neu gemalt, ${added.length} neu. `
  + `${(bytesBefore / MB).toFixed(1)} MB → ${(bytesAfter / MB).toFixed(1)} MB (${trend}).`,
);
