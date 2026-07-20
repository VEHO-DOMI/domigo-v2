// Production-sheet truth checker (doc 28 §9): every corpus id referenced in
// docs/design/g1/*.md must exist — scene anchors, task item ids, structure ids,
// vocab words. Run: node scripts/check-design-sheets.mjs   (exit 1 on drift)
import fs from "node:fs";
import path from "node:path";

const R = path.resolve(process.cwd());
const story = JSON.parse(fs.readFileSync(`${R}/content/corpus/stories/g1.st.lost-pages/story.json`));
const sheetsDir = `${R}/docs/design/g1`;

const sceneIds = new Set();
for (const ch of story.chapters) for (const s of ch.scenes) sceneIds.add(s.id); // full ids
const chapters = new Map(story.chapters.map((c) => [c.id.split(".").pop(), c]));

let failures = 0;
const fail = (file, msg) => { failures += 1; console.error(`✗ ${file}: ${msg}`); };

const isSheet = (x) => /^ch\d+\.md$/.test(x); // chapter sheets only — templates/notes in this dir are not sheets
for (const f of fs.readdirSync(sheetsDir).filter(isSheet)) {
  const chId = f.replace(".md", "");
  const text = fs.readFileSync(`${sheetsDir}/${f}`, "utf8");
  const ch = chapters.get(chId);
  if (!ch) { fail(f, `no story chapter ${chId}`); continue; }
  const unitNum = String(ch.unit).padStart(2, "0");
  const unitDir = `${R}/content/corpus/units/g1-u${unitNum}`;

  // scene anchors like s001 (scoped to this chapter)
  const chScenes = new Set(ch.scenes.map((s) => s.id.split(".").pop()));
  for (const m of text.matchAll(/`(s\d{3})`/g)) {
    if (!chScenes.has(m[1])) fail(f, `scene anchor ${m[1]} not in ${chId} (has ${[...chScenes].at(0)}…${[...chScenes].at(-1)})`);
  }

  // structure ids g1uNN.s.*
  let structures = new Set();
  let vocabIds = new Set();
  let grammarIds = new Set();
  let compIds = new Set();
  try {
    const g = JSON.parse(fs.readFileSync(`${unitDir}/grammar.json`));
    for (const it of g.items) { structures.add(it.structureId); grammarIds.add(it.id); }
    const v = JSON.parse(fs.readFileSync(`${unitDir}/vocab.json`));
    for (const it of v.items) vocabIds.add(it.id);
  } catch { fail(f, `unit corpus missing at ${unitDir}`); continue; }
  try {
    const c = JSON.parse(fs.readFileSync(`${unitDir}/comprehension.json`));
    for (const it of c.items ?? []) compIds.add(it.id);
  } catch { /* comprehension ids are validated via story taskSlots below instead */ }

  // every scene's ACTUAL taskSlot ids double as ground truth for beat rows
  const beatTaskIds = new Set();
  for (const s of ch.scenes) for (const t of s.taskSlots ?? []) beatTaskIds.add(typeof t.itemId === "string" ? t.itemId : JSON.stringify(t.itemId));

  for (const m of text.matchAll(/`(g1u\d{2}\.[a-z]+\.[A-Za-z0-9.\-]+)`/g)) {
    const id = m[1];
    const ok =
      structures.has(id) || vocabIds.has(id) || grammarIds.has(id) || compIds.has(id) ||
      beatTaskIds.has(id) || [...beatTaskIds].some((b) => b.includes(id));
    if (!ok) fail(f, `corpus id not found: ${id}`);
  }

  // section skeleton (the frozen format)
  for (const sec of ["## 1 · Identity", "## 2 · Story spine", "## 3 · CLT block", "## 4 · Level design", "## 5 ·", "## 6 · Assets", "## 7 · Beats staging", "Warum-Zeile"]) {
    if (!text.includes(sec)) fail(f, `missing section marker "${sec}"`);
  }

  // register law (German threat-word ban) — check German-looking lines only
  for (const banned of ["Monster", "Geist", "Blut", "böse", "Bösewicht", "schrei", "sterben", "tot "]) {
    if (text.includes(banned)) fail(f, `register-law violation: "${banned}"`);
  }
}

// ── PAINT sheets (docs/design/g1/paint/chNN.md, sheet v4) ────────────────────
// Same corpus-id truth + register law; NO scene anchors (Keen-story artifacts)
// and the v4 section skeleton instead of the Keen one.
const paintDir = `${sheetsDir}/paint`;
if (fs.existsSync(paintDir)) {
  for (const f of fs.readdirSync(paintDir).filter(isSheet)) {
    const chId = f.replace(".md", "");
    const text = fs.readFileSync(`${paintDir}/${f}`, "utf8");
    const ch = chapters.get(chId);
    if (!ch) { fail(`paint/${f}`, `no story chapter ${chId}`); continue; }
    const unitNum = String(ch.unit).padStart(2, "0");
    const unitDir = `${R}/content/corpus/units/g1-u${unitNum}`;
    let ids = new Set();
    try {
      const g = JSON.parse(fs.readFileSync(`${unitDir}/grammar.json`));
      for (const it of g.items) { ids.add(it.structureId); ids.add(it.id); }
      const v = JSON.parse(fs.readFileSync(`${unitDir}/vocab.json`));
      for (const it of v.items) ids.add(it.id);
    } catch { fail(`paint/${f}`, `unit corpus missing at ${unitDir}`); continue; }
    try {
      const c = JSON.parse(fs.readFileSync(`${unitDir}/comprehension.json`));
      for (const it of c.items ?? []) ids.add(it.id);
    } catch { /* optional */ }
    for (const m of text.matchAll(/`(g1u\d{2}\.[a-z]+\.[A-Za-z0-9.\-]+)`/g)) {
      if (![...ids].some((k) => k === m[1] || k.startsWith(m[1]) || m[1].startsWith(k))) fail(`paint/${f}`, `corpus id not found: ${m[1]}`);
    }
    for (const sec of ["## §1 · Identity + palette card", "## §2 · Unit audit", "## §3 · Bewitchment concept", "## §4 · Role casting table", "## §5 · Phase-chain layout", "## §6 · Guardian", "## §7 · Task set", "## §8 · Asset list + gates", "goalDe", "whyDe"]) {
      if (!text.includes(sec)) fail(`paint/${f}`, `missing v4 section marker "${sec}"`);
    }
    for (const banned of ["Monster", "Geist", "Blut", "böse", "Bösewicht", "schrei", "sterben", "tot "]) {
      if (text.includes(banned)) fail(`paint/${f}`, `register-law violation: "${banned}"`);
    }
  }
}

const paintCount = fs.existsSync(paintDir) ? fs.readdirSync(paintDir).filter(isSheet).length : 0;
if (failures === 0) console.log(`check-design-sheets: OK — ${fs.readdirSync(sheetsDir).filter(isSheet).length} keen + ${paintCount} paint sheets, all corpus ids + sections + register green`);
else { console.error(`check-design-sheets: ${failures} failure(s)`); process.exit(1); }
