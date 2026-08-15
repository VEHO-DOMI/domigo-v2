// R5-P1 · CHECK-LEVEL-DESIGN — die Maschinen-Checks der Design-Gesetze (doc 45 B8/B11).
//
// Fünf Prüfungen gegen das shipped Level + die v2-Dossiers (4 und 5 kamen mit
// B1 dazu, aus Kokis Replay-Entscheid vom 2026-08-11):
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
//  4. SCHWELLEN-ANKER (B1): jede gekreuzte Tinten-Passage ist im §10-Bau-
//     Vertrag als `- THRESHOLD …`-Zeile BENANNT, mit ihrem Checkpoint, und
//     zwar in beiden Richtungen — die Physik hält level.ts, die ABSICHT hier.
//  5. ZWECK-PFLICHT (B11): jede Entity nennt in ihrer Manifest-Zeile eine
//     FIKTION und eine MECHANIK. Block 3 beweist nur, dass die Zeile da ist;
//     ob sie etwas SAGT, prüft erst dieser Block. »Jedes Element braucht
//     seinen Zweck« (Koki, 2026-08-11).
//
// Rot ist rot: der Check ist Teil der Standing Gates (package.json) und läuft
// seit B1 auch in CI — samt `--selftest`, damit sein rotes Licht bewiesen ist.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LEVEL = path.join(ROOT, "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const DOSSIERS = path.join(ROOT, "docs/design/g1/paint/ch01-dossiers-v2");
const WORDBANK = path.join(ROOT, "content/corpus/units/g1-u01/wordbank.json");
// R5-W4 · G3: block 2 stopped believing `kind:"cards"` and started measuring it.
const TASKS = path.join(ROOT, "content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json");

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
//
// R5-W4 · G3 (D-77, Kokis Befund vom 15.08.: „alle Assets in terms of vocabulary
// … sind NIRGENDS im Level"). Bis heute war dieser Block in zwei Richtungen
// blind:
//   · `kind:"cards"` prüfte NICHTS. Neun Kleidungswörter und `projector` trugen
//     diese Klasse und hießen damit abgedeckt — gemessen an der Antwortfläche
//     aller 54 Karten produziert ein Kind kein einziges davon. Sechs stehen als
//     ABLENKER auf zwei oddone-Karten, vier stehen überhaupt nicht auf dem
//     Schirm. Ein Ablenker ist kein Wortschatz-Erwerb; ihn als Abdeckung zu
//     zählen ist genau die Behauptung, die dieser Block prüfen soll.
//   · Ein Schlüssel, der keinen Wortbank-Eintrag trifft, war stiller toter Code.
//     `"glue stick"` und `"sharpener"` standen hier, ohne dass die Unit die
//     Wörter lehrt (die Master-Vokabelliste kennt sie nicht — die Level-Objekte
//     `obj_gluestick`/`obj_sharpener` gibt es, das WORT nicht). Beide Schlüssel
//     konnten nie feuern und nie auffallen.
//
// Ab jetzt ist jeder Anspruch entweder WAHR oder eine DEKLARIERTE, DATIERTE
// Ausnahme mit Besitzer — Form und Bedeutung übernommen vom `vocabLedger` der
// Varietäts-Policy (Gesetz 17), damit das Projekt nicht zwei Ausnahme-Sprachen
// spricht. Die Ausnahme läuft ab und kommt dann als rotes Tor zurück.
//
// „Servierbar" wird hier nicht nachgebaut: check-game-tasks Gesetz 15a/15b macht
// eine Karte, die kein Kind je erreichen kann, zum harten Fehler. Solange dieses
// Tor grün ist, ist jede Karte der Datei servierbar — Prüfung durch Konstruktion
// statt durch eine zweite, driftende Kopie des Routers.
// Exportiert, damit ein Tamper die Tabelle per SCHLÜSSEL verfälschen kann statt
// per Textsuche — ein Tamper, der die falsche Stelle trifft, beweist nichts.
export const CLAIMS = {
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
  "door": { kind: "architecture" },
  "window": { kind: "architecture" },
  "tablet": { kind: "cards" },
  "sound system": { kind: "cards" },
  // Die Uniform-Zehn (WB p. 12 „Cool clothes" + der Projektor): heute ohne
  // Antwort-Karte, ab Welle 5 Sammelobjekte im Level
  // (docs/design/g1/paint/UNIFORM_SAMMELN_DESIGN.md, Anspruchstyp `pickup`).
  ...Object.fromEntries(
    [
      ["hairband", "steht auf keiner Karte — weder als Antwort noch als Ablenker"],
      ["sunglasses", "steht auf keiner Karte — weder als Antwort noch als Ablenker"],
      ["shoe", "steht auf keiner Karte — weder als Antwort noch als Ablenker"],
      ["projector", "steht auf keiner Karte — trägt heute nur die Fiktion des Zahlen-Turms in p2"],
      ["hat", "nur Ablenker (oddone), nie Antwort"],
      ["school tie", "nur Ablenker auf enc.ranzen.q3, nie Antwort"],
      ["shirt", "nur Ablenker auf enc.ranzen.q3, nie Antwort"],
      ["sweater", "nur Ablenker auf enc.ranzen.q4, nie Antwort"],
      ["skirt", "nur Ablenker auf enc.ranzen.q4, nie Antwort"],
      ["socks", "nur Ablenker auf enc.ranzen.q3, nie Antwort"],
    ].map(([en, why]) => [en, {
      kind: "cards",
      exception: {
        why: `${why}. Kokis Befund vom 15.08.: der Uniform-Wortschatz kommt im Kapitel nicht vor. Welle 5 legt die neun Teile als Sammelobjekte ins Level und benennt sie in drei Karten (3/3/3, je Phase eine); bis dahin ist die Lücke deklariert statt behauptet.`,
        expires: "2026-12-31",
        owner: "Welle 5 / Uniform",
      },
    }]),
  ),
};
const wordbank = JSON.parse(fs.readFileSync(WORDBANK, "utf8"));
const allSkins = new Set(phases.flatMap((ph) => ph.entities.map((e) => e.skin)));

/** Was ein Kind auf dieser Karte PRODUZIEREN muss. Bewusst schärfer als
 *  variety.ts `answerSurfaceOf`: dort zählt eine oddone-Karte ALLE ihre Items
 *  (wer den Fremden findet, hat die Familie gelesen) — hier zählt nur `correct`.
 *  Für „Verstehen im Vorbeigehen" ist die weite Lesart richtig; für die Frage
 *  »ist dieses Wort im Kapitel überhaupt erworben worden?« ist sie es nicht.
 *  Die Doppelung ist Absicht und liegt fest: check-level-design läuft in CI als
 *  reines `node` (ci.yml) und kann die TypeScript-Engine nicht importieren.
 *  Der Selbsttest unten pinnt genau die Stelle, an der beide Lesarten
 *  auseinandergehen. */
export const answerWordsOf = (t) => {
  switch (t.kind) {
    case "choice": case "spell": return [t.answer];
    case "typed": return [t.answer, ...(t.accept ?? [])];
    case "wheel": return [t.answer]; // `shown` ist der Anlass, nicht die Antwort
    case "oddone": return [...t.correct];
    case "order": return [...t.orderedChips];
    case "mistake": return [t.fix?.correction ?? ""];
    case "memory": return t.pairs.flatMap((p) => [p.a, p.b]);
    case "restore": return [t.name, t.colour];
    default: return [];
  }
};

/** Wortgrenzen-Treffer (dieselbe Frage, die variety.ts `hasWord` stellt). */
const saysWord = (haystack, needle) =>
  new RegExp(`(^|[^a-z'])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z'])`, "i").test(haystack);

/** Der eine Block, den auch der Selbsttest fährt: Ansprüche gegen Level UND
 *  Karten, plus die Hygiene der Ausnahmen selbst. */
export const claimFails = (claims, entries, skins, items, today) => {
  const out = [];
  const answerBlob = items.flatMap((t) => answerWordsOf(t)).join(" | ");
  const byEn = new Map(entries.filter((e) => e.kind === "wordfile").map((e) => [e.en, e]));

  // a) kein Schlüssel ohne Wortbank-Eintrag — ein Anspruch auf ein Wort, das die
  //    Unit nicht lehrt, konnte bisher nie feuern und nie auffallen (D-77).
  for (const en of Object.keys(claims)) {
    if (!byEn.has(en)) {
      out.push(`abdeckung: Anspruch "${en}" trifft keinen wordfile-Eintrag der Unit — toter Schlüssel (D-77)`);
    }
  }

  for (const entry of entries) {
    if (entry.kind !== "wordfile") continue;
    const claim = claims[entry.en];
    if (!claim) { out.push(`abdeckung: wordfile "${entry.en}" ist unklassifiziert (README §Abdeckung nachziehen)`); continue; }
    if ((claim.kind === "being" || claim.kind === "thing") && !claim.stems.some((s) => skins.has(s))) {
      out.push(`abdeckung: "${entry.en}" behauptet ${claim.kind} [${claim.stems.join("|")}], aber kein Stem im Level (B8)`);
    }
    if (claim.kind !== "cards") continue;

    const answered = [entry.en, ...(entry.forms ?? [])].some((f) => saysWord(answerBlob, f.toLowerCase()));
    const ex = claim.exception;
    if (ex === undefined) {
      if (!answered) {
        out.push(`abdeckung: "${entry.en}" behauptet Karten-Abdeckung, aber keine Karte lässt es ANTWORTEN (Ablenker zählt nicht) — beantworten oder mit { why, expires, owner } deklarieren (D-77)`);
      }
      continue;
    }
    // b) eine Ausnahme, die niemand mehr braucht, versteckt die nächste Lücke
    if (answered) {
      out.push(`abdeckung: "${entry.en}" trägt eine Ausnahme, wird aber inzwischen von einer Karte beantwortet — Ausnahme entfernen (D-77)`);
      continue;
    }
    if (!ex.why || !ex.expires || !ex.owner) {
      out.push(`abdeckung: die Ausnahme für "${entry.en}" braucht why, expires UND owner — eine Lücke ohne Termin und ohne Namen ist keine Entscheidung (D-77)`);
    } else if (ex.expires < today) {
      out.push(`abdeckung: die Ausnahme für "${entry.en}" ist am ${ex.expires} abgelaufen (Besitzer: ${ex.owner}) — beantworten oder mit frischem Grund erneuern (D-77)`);
    }
  }
  return out;
};

// Der Ablauf-Termin wird gegen ein Datum geprüft, das der CHECKER liefert —
// `claimFails` bleibt rein, damit sein Selbsttest nicht mit dem Kalender rottet
// (dieselbe Trennung wie variety.ts / check-game-tasks TODAY).
const TODAY = new Date().toISOString().slice(0, 10);
fails.push(
  ...claimFails(
    CLAIMS,
    wordbank.entries,
    allSkins,
    JSON.parse(fs.readFileSync(TASKS, "utf8")).items,
    TODAY,
  ),
);

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

  // ── Block 2 · die Abdeckungs-Ansprüche (R5-W4 · G3, D-77) ──────────────────
  // Bis heute prüfte `kind:"cards"` NICHTS — ein Gesetz, dessen rotes Licht
  // niemand je gesehen hat, ist eine Behauptung. Die Fälle sind bewusst PAARE:
  // dieselbe Karte, dieselbe Wortbank, nur die eine Eigenschaft bewegt sich, um
  // die es geht. Ein Tamper, der auch bei falscher Logik feuert, beweist nichts.
  const ENTRY = (en, forms = [en]) => ({ id: `x.${en}`, kind: "wordfile", en, forms });
  const NOSKINS = new Set();
  const IN_2026 = "2026-08-15";
  const askShirt = { kind: "choice", answer: "shirt" };
  // die echte Form aus enc.ranzen.q3: `shirt` ist ITEM, aber nicht `correct`
  const oddoneShirt = { kind: "oddone", items: ["school tie", "shirt", "socks", "pencil"], correct: ["pencil"] };
  const EX = { why: "w", expires: "2026-12-31", owner: "Welle 5 / Uniform" };
  const claims2 = (claims, entries, items, today = IN_2026) => claimFails(claims, entries, NOSKINS, items, today);

  cases.push(
    ["ABDECKUNG · ein `cards`-Anspruch ohne Antwort-Karte ist rot",
      claims2({ shirt: { kind: "cards" } }, [ENTRY("shirt")], []),
      (f) => f.some((x) => /keine Karte lässt es ANTWORTEN/.test(x))],
    ["ABDECKUNG · derselbe Anspruch mit Antwort-Karte ist grün",
      claims2({ shirt: { kind: "cards" } }, [ENTRY("shirt")], [askShirt]),
      (f) => f.length === 0],
    // DAS Paar, um das es geht: identische Karte bis auf `correct`
    ["ABDECKUNG · ein ABLENKER ist keine Antwort (die Stelle, an der diese Lesart von variety.ts abweicht)",
      claims2({ shirt: { kind: "cards" } }, [ENTRY("shirt")], [oddoneShirt]),
      (f) => f.some((x) => /keine Karte lässt es ANTWORTEN/.test(x))],
    ["ABDECKUNG · …und dieselbe oddone-Karte wird grün, sobald das Wort die LÖSUNG ist",
      claims2({ shirt: { kind: "cards" } }, [ENTRY("shirt")], [{ ...oddoneShirt, correct: ["shirt"] }]),
      (f) => f.length === 0],
    ["ABDECKUNG · eine deklarierte, gültige Ausnahme schweigt",
      claims2({ shirt: { kind: "cards", exception: EX } }, [ENTRY("shirt")], []),
      (f) => f.length === 0],
    ["ABDECKUNG · eine ABGELAUFENE Ausnahme ist rot",
      claims2({ shirt: { kind: "cards", exception: { ...EX, expires: "2026-01-01" } } }, [ENTRY("shirt")], []),
      (f) => f.some((x) => /abgelaufen/.test(x))],
    ["ABDECKUNG · eine Ausnahme ohne Besitzer ist rot",
      claims2({ shirt: { kind: "cards", exception: { why: "w", expires: "2026-12-31" } } }, [ENTRY("shirt")], []),
      (f) => f.some((x) => /why, expires UND owner/.test(x))],
    ["ABDECKUNG · eine Ausnahme auf einem inzwischen beantworteten Wort ist rot (sie versteckt die nächste Lücke)",
      claims2({ shirt: { kind: "cards", exception: EX } }, [ENTRY("shirt")], [askShirt]),
      (f) => f.some((x) => /inzwischen von einer Karte beantwortet/.test(x))],
    ["ABDECKUNG · ein Anspruch auf ein Wort, das die Unit nicht lehrt, ist toter Schlüssel",
      claims2({ sharpener: { kind: "thing", stems: ["obj_sharpener"] }, shirt: { kind: "cards", exception: EX } }, [ENTRY("shirt")], []),
      (f) => f.some((x) => /toter Schlüssel/.test(x))],
    ["ABDECKUNG · die Pluralform zählt als Antwort (D-75: „shoes\" beantwortet `shoe`)",
      claims2({ shoe: { kind: "cards" } }, [ENTRY("shoe", ["shoe", "shoes"])], [{ kind: "choice", answer: "shoes" }]),
      (f) => f.length === 0],
    ["NICHT-TAMPER · der echte Anspruchssatz gegen die echte Wortbank und die echten Karten bleibt still",
      claimFails(CLAIMS, wordbank.entries, allSkins, JSON.parse(fs.readFileSync(TASKS, "utf8")).items, TODAY),
      (f) => f.length === 0],
  );
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

// ── 5 · ZWECK-PFLICHT (B11 · Kokis Entscheid 2026-08-11) ────────────────────
// »…und jedes Element braucht seinen Zweck.« Block 3 beweist, dass jede Entity
// eine Manifest-Zeile MIT ANKER hat — er liest aber nie, ob die Zeile etwas
// SAGT. Eine Zeile mit leerer Mechanik-Spalte ist genau das Zweck-Loch, das
// B11 verbietet, und sie kam bisher durch jedes Gate.
// Spalten des Begründungs-Manifests: | id | Was | Anker | Fiktion | Mechanik | Gesetz | Kunst |
const EMPTY_CELL = /^(|—|-|–|\?+|tbd|TBD|n\/a)$/;
for (const ph of phases) {
  const df = DOSSIER_OF[ph.id];
  if (!df) continue;
  const dp = path.join(DOSSIERS, df);
  if (!fs.existsSync(dp)) continue;
  const rowOf = new Map();
  for (const line of fs.readFileSync(dp, "utf8").split("\n")) {
    const cells = line.split("|");
    if (cells.length < 7) continue;
    const idm = (cells[1] ?? "").trim().match(/^([a-z0-9-]+)/i);
    if (!idm || !idm[1].includes("-")) continue;
    rowOf.set(idm[1], { fiktion: (cells[4] ?? "").trim(), mechanik: (cells[5] ?? "").trim() });
  }
  for (const e of ph.entities) {
    const row = rowOf.get(e.id);
    if (!row) continue; // Block 3 meldet fehlende Zeilen bereits
    if (EMPTY_CELL.test(row.mechanik)) {
      fails.push(`zweck: ${ph.id}/${e.id} nennt keinen MECHANISCHEN Zweck in ${df} §3 — jedes Element braucht seinen Zweck (B11)`);
    }
    if (EMPTY_CELL.test(row.fiktion)) {
      fails.push(`zweck: ${ph.id}/${e.id} nennt keine FIKTION in ${df} §3 — warum steht es da, in der Welt? (B11)`);
    }
  }
}

fails.push(...thresholdFails(level, DOSSIERS));

if (fails.length) {
  console.error(`check-level-design: ${fails.length} Verstöße`);
  for (const f of fails) console.error("  ✗ " + f);
  process.exit(1);
}
console.log(`check-level-design: OK — Dedup (${seenStems.size} Wesen-Stems einmalig), Abdeckung (${wordbank.entries.filter((e) => e.kind === "wordfile").length} Vokabeln klassifiziert), Manifest-Anker deckungsgleich über ${phases.length} Phasen, Schwellen benannt, jede Entity mit Zweck`);
