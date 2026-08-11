// R5-P1 · CHECK-LEVEL-DESIGN — die Maschinen-Checks der Design-Gesetze (doc 45 B8/B11).
//
// Drei Prüfungen gegen das shipped Level + die v2-Dossiers:
//  1. STEM-DEDUP (B8): kein Asset-Stem zweimal unter den WESEN-Rollen
//     {chaser,gunner,flyer,bouncer,crusher,guardian} ∪ drained — Kapitel-weit.
//     (Kokis „zwei Bleistifte — warum nicht zwei unterschiedliche Dinge?")
//  2. VOKABEL-ABDECKUNG (B8): jede wordfile-Vokabel der Unit ist klassifiziert
//     (being/thing/architecture/cards/debt) und jede being/thing-Behauptung
//     löst sich in ≥1 Level-Entity auf. Die Claims-Tabelle unten SPIEGELT
//     docs/design/g1/paint/ch01-dossiers-v2/README.md §Abdeckung — Drift
//     zwischen beiden ist selbst ein Befund.
//  3. MANIFEST-ANKER (B11): jede Entity einer Phase hat eine Manifest-Zeile im
//     v2-Dossier (per id) mit übereinstimmender (c,r)-Koordinate — und
//     umgekehrt. „Jede Platzierung braucht einen Grund" wird damit hart.
//
// Rot ist rot: der Check ist Teil der Standing Gates (package.json).

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LEVEL = path.join(ROOT, "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const DOSSIERS = path.join(ROOT, "docs/design/g1/paint/ch01-dossiers-v2");
const WORDBANK = path.join(ROOT, "content/corpus/units/g1-u01/wordbank.json");

const level = JSON.parse(fs.readFileSync(LEVEL, "utf8"));
const phases = [...level.phases, ...(level.bonus ? [level.bonus] : []), ...(level.arena ? [level.arena] : [])];
const fails = [];

// ── 1 · STEM-DEDUP ───────────────────────────────────────────────────────────
const BEING_ROLES = new Set(["chaser", "gunner", "flyer", "bouncer", "crusher", "guardian", "drained"]);
const seenStems = new Map();
for (const ph of phases) {
  for (const e of ph.entities) {
    if (!BEING_ROLES.has(e.role)) continue;
    const prev = seenStems.get(e.skin);
    if (prev) fails.push(`dedup: Stem "${e.skin}" doppelt — ${prev} UND ${ph.id}/${e.id} (B8)`);
    else seenStems.set(e.skin, `${ph.id}/${e.id}`);
  }
}

// ── 2 · VOKABEL-ABDECKUNG ────────────────────────────────────────────────────
// Spiegel von README §Abdeckung (Vokabel → Klasse [+ erwartete Stems]).
const CLAIMS = {
  "pencil": { kind: "being", stems: ["pencil"] },
  "rubber": { kind: "being", stems: ["eraser"] },
  "school bag": { kind: "being", stems: ["obj_schoolbag", "ranzen", "satchelswing"] },
  "book": { kind: "thing", stems: ["obj_book"] },
  "pen": { kind: "being", stems: ["pen"] },
  "board": { kind: "being", stems: ["paintbox", "tafel"] },
  "desk": { kind: "thing", stems: ["obj_desk"] },
  "pencil case": { kind: "architecture", stems: ["pencilcase"] }, // Merles Person-Käfig
  "ruler": { kind: "architecture", stems: ["ruler"] }, // Fähre (Plattform)
  "exercise book": { kind: "being", stems: ["heft"] },
  "scissors": { kind: "debt" }, // D-13 (Platzhalter obj_pencil bis Codex)
  "chair": { kind: "debt" }, // D-13 (Käfig-Insasse, B20-Karte)
  "glue stick": { kind: "thing", stems: ["obj_gluestick"] },
  "sharpener": { kind: "thing", stems: ["obj_sharpener"] },
  "door": { kind: "architecture" },
  "window": { kind: "architecture" },
  "tablet": { kind: "cards" },
  "projector": { kind: "cards" },
  "sound system": { kind: "cards" },
  // Kleidungs-Neun = u08-Kapitel, nur Karten-Ebene (README-Entscheid):
  "hairband": { kind: "cards" }, "sunglasses": { kind: "cards" }, "hat": { kind: "cards" },
  "school tie": { kind: "cards" }, "shirt": { kind: "cards" }, "sweater": { kind: "cards" },
  "skirt": { kind: "cards" }, "socks": { kind: "cards" }, "shoe": { kind: "cards" },
};
const wordbank = JSON.parse(fs.readFileSync(WORDBANK, "utf8"));
const allSkins = new Set(phases.flatMap((ph) => ph.entities.map((e) => e.skin)));
for (const entry of wordbank.entries) {
  if (entry.kind !== "wordfile") continue;
  const claim = CLAIMS[entry.en];
  if (!claim) { fails.push(`abdeckung: wordfile "${entry.en}" ist unklassifiziert (README §Abdeckung nachziehen)`); continue; }
  if ((claim.kind === "being" || claim.kind === "thing") && !claim.stems.some((s) => allSkins.has(s))) {
    fails.push(`abdeckung: "${entry.en}" behauptet ${claim.kind} [${claim.stems.join("|")}], aber kein Stem im Level (B8)`);
  }
}

// ── 3 · MANIFEST-ANKER ───────────────────────────────────────────────────────
const DOSSIER_OF = { p1: "p1.md", p2: "p2.md", p3: "p3.md", p9: "p9.md", p4: "arena.md" };
for (const ph of phases) {
  const df = DOSSIER_OF[ph.id];
  if (!df) { fails.push(`manifest: Phase ${ph.id} hat keine Dossier-Zuordnung`); continue; }
  const dp = path.join(DOSSIERS, df);
  if (!fs.existsSync(dp)) { fails.push(`manifest: ${df} fehlt für Phase ${ph.id}`); continue; }
  const text = fs.readFileSync(dp, "utf8");
  // Manifest-Zeilen: | <id> | <Was> | <Anker> | … — id aus Spalte 1, die
  // (c,r)-Anker aus der ANKER-Spalte (Spalte 3; die Was-Spalte nennt oft
  // fremde Zellen wie den Exit-Glyph). Sammelzeilen "name-1/2/3" tragen ihre
  // Anker in Reihenfolge in derselben Zelle.
  const anchors = new Map();
  for (const line of text.split("\n")) {
    const cells = line.split("|");
    if (cells.length < 4) continue;
    const idm = (cells[1] ?? "").trim().match(/^([a-z0-9-]+(?:\/\d+)*)/i);
    if (!idm || !idm[1].includes("-")) continue;
    const pairs = [...(cells[3] ?? "").matchAll(/\(\s*(\d+)\s*,\s*(\d+)\s*\)/g)]
      .map((m) => ({ c: Number(m[1]), r: Number(m[2]) }));
    if (pairs.length === 0) continue;
    const multi = idm[1].match(/^([a-z0-9-]+-)(\d+)((?:\/\d+)+)$/i);
    if (multi) {
      const nums = [multi[2], ...multi[3].split("/").filter(Boolean)];
      nums.forEach((n, i) => { if (pairs[i]) anchors.set(`${multi[1]}${n}`, pairs[i]); });
    } else {
      anchors.set(idm[1], pairs[0]);
    }
  }
  for (const e of ph.entities) {
    const a = anchors.get(e.id);
    if (!a) {
      // Zweit-Träger einer fremden Zeile (z. B. »merle hidden (65,13)« in der
      // Käfig-Zeile) oder ein §10-Eintrag außerhalb der Tabelle (tafel):
      // genügt, wenn IRGENDEINE Dossier-Zeile id UND exakten Anker trägt.
      const carried = text.split("\n").some((l) => l.includes(e.id) && l.includes(`(${e.c},${e.r})`));
      if (!carried) fails.push(`manifest: ${ph.id}/${e.id} hat keine Manifest-Zeile mit Anker in ${df} (B11)`);
      continue;
    }
    if (a.c !== e.c || a.r !== e.r) {
      fails.push(`manifest: ${ph.id}/${e.id} Anker (${a.c},${a.r}) ≠ Level (${e.c},${e.r}) (B11)`);
    }
  }
  for (const [id, a] of anchors) {
    if (ph.entities.some((e) => e.id === id)) continue;
    // Glyph-Zeilen (Krakel-Checkpoint, Exit): der Anker muss im Grid als
    // Marker-Glyph stehen — verifiziert, nicht verziehen.
    const glyph = ph.rows[a.r]?.[a.c] ?? ".";
    if ("SCXB*".includes(glyph)) continue;
    fails.push(`manifest: ${df}-Zeile "${id}" existiert nicht im Level (B11)`);
  }
}

// ── 4 · SCHWELLEN-ANKER (B1 · Checkpoint-Doktrin, Koki 2026-08-11) ───────────
// level.ts hält die PHYSIK (Checkpoint steht hinter der Tinten-Passage, dicht,
// auf Steh-Boden). Hier wird die ABSICHT gehalten: jede schwere Stelle muss im
// §10-Bau-Vertrag BENANNT sein, in einer Zeile, die die Maschine liest —
// »jedes Element braucht seinen Zweck« gilt auch für die Schwierigkeit selbst.
// Format (eine Zeile je Passage, in §10):
//   - THRESHOLD <id> | cols <west>–<east> | checkpoint (<c>,<r>) | <Begründung>
// Geprüft in BEIDEN Richtungen, wie die Manifest-Anker darüber.
export const thresholdFails = (lvl, dossierDir) => {
  const out = [];
  const phs = [...lvl.phases, ...(lvl.bonus ? [lvl.bonus] : []), ...(lvl.arena ? [lvl.arena] : [])];
  const TH = /^-\s+THRESHOLD\s+([a-z0-9-]+)\s*\|\s*cols\s+(\d+)\s*[–-]\s*(\d+)\s*\|\s*checkpoint\s+\((\d+)\s*,\s*(\d+)\)\s*\|\s*(.+?)\s*$/i;
  for (const ph of phs) {
    const df = DOSSIER_OF[ph.id];
    if (!df) continue;
    const dp = path.join(dossierDir, df);
    if (!fs.existsSync(dp)) continue;
    const text = fs.readFileSync(dp, "utf8");

    const w = ph.rows[0]?.length ?? 0;
    const inkCol = (c) => ph.rows.some((row) => row[c] === "w");
    const runs = [];
    for (let c = 0, from = null; c <= w; c++) {
      if (c < w && inkCol(c)) { if (from === null) from = c; }
      else if (from !== null) { runs.push({ west: from, east: c - 1 }); from = null; }
    }
    const find = (g) => { for (const [r, row] of ph.rows.entries()) { const c = row.indexOf(g); if (c >= 0) return { c, r }; } return null; };
    const S = find("S"); const X = find("X") ?? find("B");
    if (!S || !X) continue;
    const eastward = X.c > S.c;
    const crossings = runs.filter((p) => (eastward ? S.c < p.west && X.c > p.east : S.c > p.east && X.c < p.west));

    const declared = [];
    for (const line of text.split("\n")) {
      const m = line.trim().match(TH);
      if (m) declared.push({ id: m[1], west: Number(m[2]), east: Number(m[3]), c: Number(m[4]), r: Number(m[5]), why: m[6] });
    }
    // a) jede echte Passage ist benannt
    for (const p of crossings) {
      const hit = declared.filter((d) => d.west === p.west && d.east === p.east);
      if (hit.length === 0) { out.push(`schwelle: ${ph.id} kreuzt Tinte c${p.west}–${p.east} ohne THRESHOLD-Zeile in ${df} §10 (B1)`); continue; }
      if (hit.length > 1) out.push(`schwelle: ${ph.id} nennt c${p.west}–${p.east} ${hit.length}× in ${df} (B1)`);
      const d = hit[0];
      const glyph = ph.rows[d.r]?.[d.c] ?? ".";
      if (glyph !== "C") out.push(`schwelle: ${df}-Zeile "${d.id}" deklariert Krakel (${d.c},${d.r}), das Grid trägt dort "${glyph}" (B1)`);
    }
    // b) …und keine Zeile erfindet eine Passage, die es nicht gibt
    for (const d of declared) {
      if (!crossings.some((p) => p.west === d.west && p.east === d.east)) {
        out.push(`schwelle: ${df}-Zeile "${d.id}" nennt c${d.west}–${d.east}, dort kreuzt ${ph.id} keine Tinte (B1)`);
      }
    }
  }
  return out;
};

// ── SELBSTTEST (`--selftest`) ────────────────────────────────────────────────
// Bis heute hatte dieses Gate als EINZIGES dieser Spur keinen Tamper-Beweis.
// Ein Check, dessen rotes Licht nie jemand gesehen hat, ist eine Behauptung.
// Geprüft wird beides: die LOGIK und der Markdown-PARSER — an einem
// Regex-über-Markdown stirbt ein Gate lautlos.
if (process.argv.includes("--selftest")) {
  const os = await import("node:os");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cld-selftest-"));
  const rows = ["####################", ...Array.from({ length: 17 }, () => "....................")];
  rows.push("..S.........C.X.....", `${"#".repeat(8)}www${"#".repeat(9)}`, `${"#".repeat(8)}www${"#".repeat(9)}`);
  const lvl = { phases: [{ id: "p1", rows, entities: [] }] };
  const GOOD = "- THRESHOLD p1-becken | cols 8–10 | checkpoint (12,18) | die eine Tinte der Phase\n";
  const write = (body) => { fs.writeFileSync(path.join(tmp, "p1.md"), body); return thresholdFails(lvl, tmp); };
  const cases = [
    ["die wahre Zeile ist grün", write(GOOD), (f) => f.length === 0],
    ["THRESHOLD-Zeile gelöscht", write("kein Vertrag hier\n"), (f) => f.some((x) => /ohne THRESHOLD-Zeile/.test(x))],
    ["Spalten um eine verschoben", write("- THRESHOLD p1-becken | cols 8–11 | checkpoint (12,18) | x\n"), (f) => f.length === 2],
    ["Checkpoint zeigt auf eine leere Zelle", write("- THRESHOLD p1-becken | cols 8–10 | checkpoint (13,18) | x\n"), (f) => f.some((x) => /das Grid trägt dort/.test(x))],
    ["erfundene Passage", write(`${GOOD}- THRESHOLD p1-geist | cols 2–3 | checkpoint (12,18) | x\n`), (f) => f.some((x) => /kreuzt \w+ keine Tinte/.test(x))],
    ["Zeile doppelt", write(GOOD + GOOD), (f) => f.some((x) => /2×/.test(x))],
    ["Prosa fehlt → Zeile zählt NICHT als Deklaration", write("- THRESHOLD p1-becken | cols 8–10 | checkpoint (12,18) |\n"), (f) => f.some((x) => /ohne THRESHOLD-Zeile/.test(x))],
  ];
  let bad = 0;
  for (const [name, got, ok] of cases) {
    const pass = ok(got);
    if (!pass) bad++;
    console.log(`  ${pass ? "✓" : "✗"} ${name}${pass ? "" : ` → ${JSON.stringify(got)}`}`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(bad ? `check-level-design --selftest: ${bad} Fälle bissen NICHT` : `check-level-design --selftest: OK — ${cases.length} Fälle, jedes rote Licht gesehen`);
  process.exit(bad ? 1 : 0);
}

fails.push(...thresholdFails(level, DOSSIERS));

if (fails.length) {
  console.error(`check-level-design: ${fails.length} Verstöße`);
  for (const f of fails) console.error("  ✗ " + f);
  process.exit(1);
}
console.log(`check-level-design: OK — Dedup (${seenStems.size} Wesen-Stems einmalig), Abdeckung (${wordbank.entries.filter((e) => e.kind === "wordfile").length} Vokabeln klassifiziert), Manifest-Anker deckungsgleich über ${phases.length} Phasen, Schwellen benannt`);
