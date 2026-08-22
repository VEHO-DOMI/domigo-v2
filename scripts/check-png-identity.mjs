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

/** Ist der Alphakanal überall undurchsichtig? (Auf der DEKODIERTEN Fassung —
 *  siehe die Warnung an `wastedAlpha` direkt darunter.) */
const fullyOpaque = (img) => {
  for (let i = 3; i < img.data.length; i += 4) if (img.data[i] !== 255) return false;
  return true;
};

// ── R5-W7 · W6 · D4s Befund 3: PNGJS LIEFERT IMMER VIER KANÄLE ──────────────
//
// Die Meldung darunter sagt „vollständig undurchsichtig und trotzdem RGBA" und
// las dafür `img.data` — den DEKODIERTEN Puffer. Der hat bei pngjs IMMER vier
// Kanäle, ganz gleich, was in der Datei steht: ein Palettenblatt wird beim
// Dekodieren zu RGBA aufgeblasen und dann als RGBA gemeldet, obwohl auf der
// Platte kein einziges Alpha-Byte liegt. D4 hat es an `card_paper.png`
// gefunden; gemessen über die ganze ausgelieferte Kunst waren es 129
// Palettenblätter und 64 reine RGB-Blätter, die diese Meldung hätte treffen
// können — für jedes davon wäre der empfohlene Fix (`art-recompress`) ein
// Vorschlag ohne Gegenstand gewesen.
//
// Gelesen wird deshalb der FARBTYP AUS DEM DATEIKOPF: Byte 25, das neunte Byte
// des IHDR-Blocks. Das ist die Wahrheit über die Datei, nicht über den Decoder.
/** Der PNG-Farbtyp aus dem IHDR-Kopf, oder null, wenn die Datei gar kein PNG
 *  ist (die gibt es: `apps/web/public/art/g2/lena_ref.png` ist ein JPEG). */
export const pngColourType = (buf) => {
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.length < 26 || !buf.subarray(0, 8).equals(SIG)) return null;
  if (buf.toString("latin1", 12, 16) !== "IHDR") return null;
  return buf.readUInt8(25);
};

export const COLOUR_TYPE_NAME = { 0: "Grau", 2: "RGB", 3: "Palette", 4: "Grau+Alpha", 6: "RGBA" };

/** Der Hebel, den E5 gemessen hat, und nur er: ein Blatt, das auf der PLATTE
 *  einen Alphakanal trägt (Farbtyp 6 = RGBA oder 4 = Grau+Alpha) und ihn
 *  überall auf 255 stehen hat. Palette (3) und reines RGB (2) haben gar keinen
 *  Kanal zum Wegnehmen und werden nicht gemeldet.
 *  @returns den Farbtyp, wenn die Meldung zutrifft, sonst null. */
export const wastedAlpha = ({ buf, img }) => {
  const ct = pngColourType(buf);
  if (ct !== 4 && ct !== 6) return null;
  return fullyOpaque(img) ? ct : null;
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

  // ── R5-W7 · W6 · DER FARBTYP KOMMT AUS DEM KOPF, NICHT AUS DEM DECODER ────
  // Fixtures sind ECHTE Blätter aus der ausgelieferten Kunst (P-71: gemessen,
  // nicht erfunden) — genau das Palettenblatt, an dem D4 die Falschmeldung
  // gefunden hat, und ein echtes RGBA-Blatt daneben. Fehlt eines, sagt der
  // Selbsttest das laut, statt den Fall stillschweigend zu überspringen: ein
  // übersprungener Fall ist ein Fall, der nichts beweist.
  const FIXTURES = [
    ["apps/web/public/art/g1/cards/card_paper.png", 3, false, "Palette — hat gar keinen Alphakanal zum Wegnehmen (D4s Fall)"],
    ["apps/web/public/art/g1/keen/_style_key_cutscene.png", 2, false, "reines RGB — dasselbe Argument"],
    ["apps/web/public/art/g1/cards/card_buttons.png", 6, false, "echtes RGBA mit echter Durchsichtigkeit — keine Meldung, und das ist richtig"],
  ];
  for (const [file, wantCt, wantMeldung, warum] of FIXTURES) {
    if (!fs.existsSync(file)) {
      bad++; console.error(`  ✗ Fixture fehlt: ${file} — der Farbtyp-Fall beweist ohne echtes Blatt nichts`);
      continue;
    }
    const buf = fs.readFileSync(file);
    const ct = pngColourType(buf);
    if (ct !== wantCt) {
      bad++; console.error(`  ✗ ${file}: Farbtyp aus dem Kopf ist ${ct}, erwartet ${wantCt} — Fixture verrottet`);
      continue;
    }
    const gemeldet = wastedAlpha({ buf, img: decode(buf) }) !== null;
    // Die ALTE Rechnung liest den dekodierten Puffer und hätte hier
    // fälschlich gemeldet — genau das ist der Beweis, dass sich etwas
    // geändert hat.
    const alteRechnung = fullyOpaque(decode(buf));
    if (wantMeldung !== null && gemeldet !== wantMeldung) {
      bad++;
      console.error(`  ✗ ${file} (${COLOUR_TYPE_NAME[ct]}): Meldung=${gemeldet}, erwartet ${wantMeldung}`);
      continue;
    }
    const alt = ct !== 4 && ct !== 6 && alteRechnung ? " — die alte Rechnung hätte hier FÄLSCHLICH »RGBA« gemeldet" : "";
    console.log(`  ✓ ${file}: Farbtyp ${ct} = ${COLOUR_TYPE_NAME[ct]}, Meldung=${gemeldet} (${warum})${alt}`);
  }
  // DER JA-FALL. Gemessen: von 624 ausgelieferten Blättern ist HEUTE kein
  // einziges »RGBA und überall undurchsichtig« — E5s Hebel ist abgeräumt
  // (129 Palette · 64 RGB · 431 RGBA, alle mit echter Durchsichtigkeit). Ein
  // Selbsttest, der deshalb nur Nein-Fälle prüft, könnte eine Meldung nicht von
  // einer stummgeschalteten unterscheiden — also wird ein Blatt der Klasse
  // GEBAUT: pngjs schreibt Farbtyp 6, und dieses hier hat Alpha 255 überall.
  {
    const rgbaOpakBuf = (() => {
      const q = new PNG({ width: 4, height: 4 });
      for (let i = 0; i < q.data.length; i += 4) { q.data[i] = 10; q.data[i + 1] = 20; q.data[i + 2] = 30; q.data[i + 3] = 255; }
      return PNG.sync.write(q);
    })();
    const ct = pngColourType(rgbaOpakBuf);
    const gemeldet = wastedAlpha({ buf: rgbaOpakBuf, img: decode(rgbaOpakBuf) }) !== null;
    if (ct !== 6 || !gemeldet) {
      bad++;
      console.error(`  ✗ ein RGBA-Blatt mit Alpha 255 überall wurde NICHT gemeldet (Farbtyp ${ct}, Meldung ${gemeldet}) `
        + "— die Meldung wäre damit stumm, nicht genauer");
    } else {
      console.log("  ✓ gebautes RGBA-Blatt, Alpha überall 255: Farbtyp 6, Meldung=true — das rote Licht ist erreichbar");
    }
  }

  // …und ein Nicht-PNG darf keinen Farbtyp erfinden
  if (pngColourType(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])) !== null) {
    bad++; console.error("✗ ein JPEG-Kopf hat einen PNG-Farbtyp geliefert");
  }

  if (bad > 0) { console.error("check-png-identity selftest: FAILED"); process.exit(1); }
  console.log("✓ selftest: one changed channel in one pixel is found and named; a size change is found; "
    + "identical images pass; die drei Nachverdichtungs-Urteile stimmen (D-98); "
    + "der Farbtyp kommt aus dem IHDR-Kopf, also meldet ein Palettenblatt sich nicht mehr als RGBA.");
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
  const ct = wastedAlpha({ buf: after, img: imgAfter });
  if (ct !== null) opaqueRgba.push({ file, ct });
}

for (const file of added) {
  const buf = fs.readFileSync(path.resolve(file));
  bytesAfter += buf.length;
  const ct = wastedAlpha({ buf, img: decode(buf) });
  if (ct !== null) opaqueRgba.push({ file, ct });
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
  for (const o of opaqueRgba.slice(0, 8)) console.log(`    · ${o.file} (Farbtyp ${o.ct} = ${COLOUR_TYPE_NAME[o.ct]})`);
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
