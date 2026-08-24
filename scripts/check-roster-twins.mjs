#!/usr/bin/env node
/**
 * K9b · Hält die beiden Hälften der Roster-Parse-Regel byte-gleich.
 *
 * WARUM ES DAS GIBT: `@domigo/db` ist server-only und darf nicht ins Browser-Bündel,
 * also lebt die Parse-Regel zweimal — einmal autoritativ im Server-Dienst, einmal für
 * die Prüfliste im Client. Ein Zwilling, den niemand vergleicht, ist eine Kopie, die
 * auf ihre Drift wartet: driftet er, zeigt die Prüfliste eine andere Zahl, als der
 * Server anlegt, und genau diese Zahl ist der ganze Zweck des Prüfschritts.
 *
 * WAS GEPRÜFT WIRD, zwei Dinge:
 *   1. der TWIN BLOCK (zwischen den Markern) ist in beiden Quelldateien byte-gleich;
 *   2. die gemeinsame FIXTURE-LISTE ist in beiden Testdateien byte-gleich.
 *
 * Lauf:  node scripts/check-roster-twins.mjs
 * Probe: node scripts/check-roster-twins.mjs --selftest
 *        (verbiegt je eine Kopie IM SPEICHER und weist nach, dass die Prüfung dann
 *         rot wird — eine Prüfung, der nie jemand beim Scheitern zugesehen hat, ist
 *         nicht als funktionierend nachgewiesen.)
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const REPO = fileURLToPath(new URL("../", import.meta.url));

const PAARE = [
  {
    was: "TWIN BLOCK (die Parse-Regel)",
    von: "// ─── TWIN BLOCK START",
    bis: "// ─── TWIN BLOCK END",
    dateien: ["packages/db/src/roster-service.ts", "apps/web/lib/roster-parse.ts"],
  },
  {
    was: "FIXTURE-LISTE (die gemeinsamen Fälle)",
    von: " * ── THE SHARED FIXTURE LIST",
    bis: "];",
    dateien: ["packages/db/src/roster-service.test.ts", "apps/web/lib/roster-parse.test.ts"],
  },
];

/** Den Abschnitt zwischen zwei Markern herausschneiden — inklusive beider Marker. */
function abschnitt(inhalt, von, bis, wo) {
  const a = inhalt.indexOf(von);
  if (a === -1) throw new Error(`${wo}: Anfangsmarke fehlt (${von.trim()})`);
  const b = inhalt.indexOf(bis, a + von.length);
  if (b === -1) throw new Error(`${wo}: Endmarke fehlt (${bis.trim()})`);
  return inhalt.slice(a, b + bis.length);
}

const md5 = (t) => createHash("md5").update(t, "utf8").digest("hex");

/** Erste abweichende Zeile benennen — ein md5-Unterschied allein hilft niemandem. */
function ersteAbweichung(a, b) {
  const za = a.split("\n");
  const zb = b.split("\n");
  for (let i = 0; i < Math.max(za.length, zb.length); i += 1) {
    if (za[i] !== zb[i]) {
      return `  erste abweichende Zeile (${i + 1} des Abschnitts):\n    A: ${JSON.stringify(za[i] ?? "<Abschnitt zu Ende>")}\n    B: ${JSON.stringify(zb[i] ?? "<Abschnitt zu Ende>")}`;
    }
  }
  return "  (gleich lang, gleiche Zeilen — Unterschied nur in unsichtbaren Zeichen)";
}

/** Gibt eine Liste von Befundtexten zurück; leer = alles gleich. */
function pruefe(leser) {
  const befunde = [];
  for (const paar of PAARE) {
    const [dateiA, dateiB] = paar.dateien;
    const a = abschnitt(leser(dateiA), paar.von, paar.bis, dateiA);
    const b = abschnitt(leser(dateiB), paar.von, paar.bis, dateiB);
    if (md5(a) === md5(b)) {
      console.log(`  OK  ${paar.was}: ${md5(a)}  (${a.split("\n").length} Zeilen)`);
    } else {
      befunde.push(
        `${paar.was} ist GEDRIFTET\n  A: ${dateiA}  ${md5(a)}\n  B: ${dateiB}  ${md5(b)}\n${ersteAbweichung(a, b)}`,
      );
    }
  }
  return befunde;
}

const vonPlatte = (rel) => readFileSync(REPO + rel, "utf8");

if (process.argv.includes("--selftest")) {
  console.log("SELBSTTEST · zuerst die echten Dateien, dann je eine verbogene Kopie\n");
  console.log("1 · echte Dateien — erwartet: keine Befunde");
  const echt = pruefe(vonPlatte);
  if (echt.length > 0) {
    console.error("\nFEHLGESCHLAGEN: die echten Dateien sind bereits gedriftet:\n" + echt.join("\n"));
    process.exit(1);
  }

  let schritt = 2;
  for (const paar of PAARE) {
    const opfer = paar.dateien[1];
    // Eine einzige Zeichenänderung im Speicher — die Platte wird NICHT angefasst.
    const verbogen = (rel) => {
      const inhalt = vonPlatte(rel);
      if (rel !== opfer) return inhalt;
      const a = inhalt.indexOf(paar.von);
      return inhalt.slice(0, a) + inhalt.slice(a).replace("Anna", "Annb");
    };
    console.log(`\n${schritt} · ${opfer} im Speicher verbogen — erwartet: ROT`);
    const befunde = pruefe(verbogen);
    if (befunde.length === 0) {
      console.error(`\nFEHLGESCHLAGEN: die Manipulation an »${paar.was}« blieb unbemerkt — die Prüfung sieht nicht, was sie behauptet zu sehen.`);
      process.exit(1);
    }
    console.log("  ROT wie erwartet:\n" + befunde.join("\n").split("\n").map((z) => "    " + z).join("\n"));
    schritt += 1;
  }
  console.log("\nSelbsttest bestanden: die Prüfung ist grün an den echten Dateien und rot an jeder verbogenen Kopie.");
  process.exit(0);
}

console.log("Roster-Zwillinge:");
const befunde = pruefe(vonPlatte);
if (befunde.length > 0) {
  console.error(
    "\nROSTER-ZWILLINGE GEDRIFTET — die Prüfliste würde eine andere Zahl zeigen,\n" +
      "als der Server anlegt. Beide Hälften tragen denselben Abschnitt, byte-gleich.\n\n" +
      befunde.join("\n\n"),
  );
  process.exit(1);
}
console.log("Beide Hälften sind byte-gleich.");
