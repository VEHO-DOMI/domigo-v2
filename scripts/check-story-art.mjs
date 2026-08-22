// CI gate for the story-art manifests: the runtime contract and the prompt library
// must agree, in both directions.
//
//   node scripts/check-story-art.mjs
//   node scripts/check-story-art.mjs --selftest   (proves the red light works)
//
// Checks, per story that has a prompt library:
//   1. the library's own gates pass (build-g3-prompts.mjs --check)
//   2. art.json is not stale (build-g3-art-json.mjs --check)
//   3. every stem art.json names exists in the library  → no permanently blank slot
//   4. every stem the library defines is named by art.json, or is a `<char>_neutral`
//      fallback → no prompt for a picture the game can never ask for
//
// Deliberately NOT checked: whether the image files exist on disk. The whole point of
// this pipeline is that the manifest can name all 235 pictures while none of them have
// been drawn yet — each absent one falls back to the procedural drawing. (Contrast
// check-paint-art.mjs, which DOES gate on disk presence, because that art ships today.)
//
// ── R5-W7 · W6 · D-454: DIESES TOR KANN JETZT ZEIGEN, DASS ES NOCH MISST ─────
// W5 fand vier Standing Gates ohne Selbsttest. Sie liefen in CI an echten
// Dateien, waren also keine Werkzeug-Faelle nach D-257 — aber keines konnte
// beweisen, dass sein rotes Licht ueberhaupt noch erreichbar ist. Ein Tor, das
// nur gruen kann, ist von einem kaputten Tor nicht zu unterscheiden.
// Das Urteil (Gesetz 3 + 4) ist dafuer eine REINE FUNKTION ueber die zwei
// Manifeste geworden. Der Selbsttest reicht ihr die ECHTEN Manifeste mit genau
// EINER Verfaelschung herein (P-71: Tamper gegen den Messwert, nie gegen eine
// erfundene Konfiguration) und prueft, dass GENAU der eingespeiste Fehler
// gemeldet wird — ein Selbsttest, der irgendein rotes Licht sieht, beweist
// nichts (E5-Lehre). Der letzte Fall ist der wichtigste: der ECHTE Stand muss
// gruen sein.
// EHRLICHE GRENZE: Gesetz 1 + 2 (die zwei Kind-Prozesse `build-g3-*.mjs --check`)
// liegen ausserhalb der reinen Funktion und damit ausserhalb des Selbsttests —
// sie starten Prozesse und haben ihre eigenen Tore. Gedeckt ist die
// Mengenlogik, und nur die.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const ART_PATH = join(REPO, "content/corpus/stories/g3.st.fourteen/art.json");
const LIB_PATH = join(REPO, "docs/art/g3-art-files.json");

const run = (script) => {
  try {
    execFileSync(process.execPath, [join(REPO, script), "--check"], { stdio: "pipe" });
    return null;
  } catch (e) {
    return `${script} failed:\n${(e.stdout ?? "") + (e.stderr ?? "")}`.trim();
  }
};

/** Every stem `art.json` places — the same derivation the game uses. */
export const namedStems = (art) => {
  const named = new Set([art.cover, art.endCard]);
  for (const c of Object.values(art.chapters)) for (const v of Object.values(c)) named.add(v);
  for (const m of [art.portraits, art.beats, art.clues]) for (const v of Object.values(m)) named.add(v);
  return named;
};

/**
 * Gesetz 3 + 4 als reine Funktion: passen die zwei Manifeste in BEIDE
 * Richtungen zusammen? Rein, damit der Selbsttest ihr echte Manifeste mit
 * genau einer Verfaelschung reichen kann.
 */
export const analyse = ({ art, lib }) => {
  const failures = [];
  const have = new Set(lib.stems.map((s) => s.stem));
  const named = namedStems(art);

  for (const stem of named) {
    if (stem && !have.has(stem)) {
      failures.push(`art.json names '${stem}', which no prompt in the library produces — that slot `
        + `could never be filled.`);
    }
  }
  for (const s of lib.stems) {
    if (!named.has(s.stem) && !/_neutral$/.test(s.stem)) {
      failures.push(`the library defines '${s.stem}', which art.json never names — generating it `
        + `would produce an image the game cannot display.`);
    }
  }
  return { failures, named, have };
};

const artOnDisk = JSON.parse(readFileSync(ART_PATH, "utf8"));
const libOnDisk = JSON.parse(readFileSync(LIB_PATH, "utf8"));

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  // Die Verfaelschungen sitzen auf einer KOPIE der echten Manifeste, und jeder
  // Fall nennt die Zeichenfolge, die in der Meldung stehen MUSS. Damit faellt
  // ein Fall auch dann auf, wenn er zufaellig aus einem anderen Grund rot wird.
  const klon = (o) => JSON.parse(JSON.stringify(o));
  // ein echter Stem, den art.json wirklich platziert — nicht geraten
  const echterStem = [...namedStems(artOnDisk)].find((s) => typeof s === "string" && s.length > 0);
  // ein echter Bibliotheks-Stem, der KEIN _neutral-Rueckfall ist
  const echterLibStem = libOnDisk.stems.find((s) => !/_neutral$/.test(s.stem)).stem;

  const faelle = [
    ["art.json nennt einen Stem, den die Bibliothek nicht herstellt", () => {
      const lib = klon(libOnDisk);
      lib.stems = lib.stems.filter((s) => s.stem !== echterStem);
      return analyse({ art: artOnDisk, lib });
    }, `no prompt in the library produces`, `'${echterStem}'`],

    ["die Bibliothek definiert einen Stem, den art.json nie nennt", () => {
      const art = klon(artOnDisk);
      // den Stem aus JEDER Stelle entfernen, an der art.json ihn platziert
      const weg = (m) => { for (const [k, v] of Object.entries(m)) if (v === echterLibStem) delete m[k]; };
      if (art.cover === echterLibStem) art.cover = "";
      if (art.endCard === echterLibStem) art.endCard = "";
      for (const c of Object.values(art.chapters)) weg(c);
      for (const m of [art.portraits, art.beats, art.clues]) weg(m);
      return analyse({ art, lib: libOnDisk });
    }, `which art.json never names`, `'${echterLibStem}'`],

    ["der _neutral-Rueckfall bleibt erlaubt (kein Fehlalarm)", () => {
      const lib = klon(libOnDisk);
      lib.stems = [...lib.stems, { stem: "erfunden_neutral", file: "erfunden_neutral.png" }];
      return analyse({ art: artOnDisk, lib });
    }, null, null],

    ["NICHT-TAMPER: der echte Stand ist gruen", () => analyse({ art: artOnDisk, lib: libOnDisk }), null, null],
  ];

  let schlecht = 0;
  for (const [name, lauf, muss, mussAuch] of faelle) {
    const { failures } = lauf();
    const rot = failures.length > 0;
    const sollRot = muss !== null;
    if (rot !== sollRot) {
      schlecht++;
      console.error(sollRot
        ? `  ✗ ${name} — KEIN rotes Licht, das Gesetz ist blind`
        : `  ✗ ${name} — der Stand ist rot, obwohl er gruen sein muss: ${failures.join(" | ")}`);
      continue;
    }
    if (sollRot) {
      // E5-Lehre: es muss GENAU der eingespeiste Fehler sein, nicht irgendeiner.
      const treffer = failures.filter((f) => f.includes(muss) && f.includes(mussAuch));
      if (treffer.length !== 1) {
        schlecht++;
        console.error(`  ✗ ${name} — rot, aber nicht an der eingespeisten Stelle `
          + `(${treffer.length} passende von ${failures.length}); erwartet: ${muss} + ${mussAuch}`);
        continue;
      }
      console.log(`  ✓ ${name} — rot, und genau der eingespeiste Fehler (${failures.length} Meldung/en)`);
    } else {
      console.log(`  ✓ ${name} — gruen`);
    }
  }
  if (schlecht > 0) { console.error("check-story-art --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log(`check-story-art --selftest: OK — ${faelle.length} Faelle, zwei rote Lichter an der `
    + `eingespeisten Stelle, der echte Stand gruen`);
  process.exit(0);
}

// ── ECHTER LAUF ──────────────────────────────────────────────────────────────
const fail = [];
for (const s of ["docs/art/build-g3-prompts.mjs", "docs/art/build-g3-art-json.mjs"]) {
  const err = run(s);
  if (err) fail.push(err);
}

const { failures, named } = analyse({ art: artOnDisk, lib: libOnDisk });
fail.push(...failures);

if (fail.length) {
  console.error(`✗ check-story-art: ${fail.length} problem(s)\n`);
  for (const m of fail) console.error("  - " + m + "\n");
  process.exit(1);
}
console.log(`✓ check-story-art: g3 manifest and prompt library agree `
  + `(${named.size} stems placed, ${libOnDisk.stems.length} defined)`);
