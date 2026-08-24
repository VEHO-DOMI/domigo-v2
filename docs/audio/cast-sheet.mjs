#!/usr/bin/env node
// K4c · Das Leseblatt des Ensembles — ERZEUGT aus docs/audio/cast.json.
// Zwei handgepflegte Fassungen derselben Wahrheit wären genau die Drift,
// gegen die V-LC7 an anderer Stelle schon gebaut werden musste. Also gibt es
// eine Quelle (die JSON) und ein abgeleitetes Blatt (CAST.md) — plus ein Tor,
// das Abweichung rot macht.
//
//   node docs/audio/cast-sheet.mjs           schreibt docs/audio/CAST.md
//   node docs/audio/cast-sheet.mjs --check   Exit 1, wenn das Blatt veraltet ist
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CAST = path.join(ROOT, "docs/audio/cast.json");
const SHEET = path.join(ROOT, "docs/audio/CAST.md");

const render = (cast) => {
  const rows = cast.figures.map((f) =>
    `| **${f.name}** | \`${f.key}\` | ${f.role} | ${f.gender} | ${f.voiceName} | \`${f.voiceId}\` | ${f.speed} | ${(f.unitsSoFar ?? []).join(", ") || "—"} |`);
  return `# Der Cast — wer in DomiGo spricht

<!-- ERZEUGT aus docs/audio/cast.json durch docs/audio/cast-sheet.mjs.
     NICHT von Hand ändern: \`node docs/audio/cast-sheet.mjs --check\` schlägt sonst an. -->

_Entschieden: ${cast.decidedBy}_

Jede Figur hat **eine** Stimme, und sie behält sie. Das ist der Unterschied zu vorher:
bis Staffel 1 bekam jede Aufnahme irgendeine Stimme, und dieselbe Lisa war einmal ein
Schulkind und einmal eine erwachsene Camp-Leiterin. Ab jetzt liest der Erzeuger diese
Liste — und kennt er eine Figur nicht, bricht er ab, statt still jemand anderen sprechen
zu lassen.

| Figur | Schlüssel | Rolle | Geschlecht | Stimme | Stimm-Id | Tempo | bisher in |
|---|---|---|---|---|---|---|---|
${rows.join("\n")}

**Tempo** ist der Regler der Sprachmaschine: 1,0 ist die Normalgeschwindigkeit der Stimme,
0,9 ist spürbar ruhiger. Er ist eine Eigenschaft der *sprechenden Figur* — ein Stück darf
ihn überstimmen, wenn ein einzelner Text ruhiger laufen soll.

**Wie ein Hör-Stück eine Figur bestellt** (in \`docs/audio/listening-voices.json\`):

\`\`\`json
{ "unit": "g2-u02", "taskKey": "museum", "cast": "leonie" }
{ "unit": "g2-u02", "taskKey": "museum", "castByTurn": ["leonie", "david", "leonie"] }
\`\`\`

${cast.note}
`;
};

const cast = JSON.parse(fs.readFileSync(CAST, "utf8"));
const want = render(cast);
if (process.argv.includes("--check")) {
  const have = fs.existsSync(SHEET) ? fs.readFileSync(SHEET, "utf8") : "";
  if (have !== want) {
    console.error("✗ docs/audio/CAST.md ist nicht mehr die Ableitung von docs/audio/cast.json.");
    console.error("  Reparatur: node docs/audio/cast-sheet.mjs");
    process.exit(1);
  }
  console.log(`✓ CAST.md stimmt mit cast.json überein (${cast.figures.length} Figur(en)).`);
} else {
  fs.writeFileSync(SHEET, want);
  console.log(`✓ docs/audio/CAST.md geschrieben (${cast.figures.length} Figur(en)).`);
}
