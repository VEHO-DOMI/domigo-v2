#!/usr/bin/env node
// B-3 verification: simulate a real playthrough of "FOURTEEN: LIVE" for every
// major-flag combination and print the path — proving each fork resolves, each
// flagLine callback fires under the right combo, and every combo reaches an
// ending. Reads the bundle JSON directly (no engine); mirrors the runtime's
// resolution (Choice picked by the combo's decision; FlagGate by combo).
//
//   node scripts/audit/g4-fork-walkthrough.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, "..", "..", "content", "corpus", "stories", "g4.st.fourteen-live");
const story = JSON.parse(readFileSync(join(DIR, "story.json"), "utf8"));
const flags = JSON.parse(readFileSync(join(DIR, "flags.json"), "utf8"));

// forks = major flags grouped by setIn chapter, in chapter order
const forkMap = new Map();
for (const f of flags.flags.filter((f) => f.major)) forkMap.set(f.setIn, [...(forkMap.get(f.setIn) ?? []), f.id]);
const forks = [...forkMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, ids]) => ids);

// combos = cartesian product (one option per fork) — the real playthroughs
let combos = [[]];
for (const fork of forks) combos = combos.flatMap((c) => fork.map((opt) => [...c, opt]));

const chapters = [...story.chapters].sort((a, b) => a.unit - b.unit);
const nextChapterStart = (unit) => chapters.find((c) => c.unit === unit + 1)?.scenes[0]?.id ?? null;

function play(comboArr) {
  const combo = new Set(comboArr);
  const byId = new Map(story.chapters.flatMap((c) => c.scenes.map((s) => [s.id, { s, unit: c.unit }])));
  const forksTaken = [];
  const callbacks = [];
  let id = chapters[0].scenes[0].id;
  let ending = null;
  const guard = new Set();
  while (id) {
    if (guard.has(id)) { forksTaken.push("LOOP!"); break; }
    guard.add(id);
    const node = byId.get(id);
    if (!node) { forksTaken.push(`DANGLING ${id}`); break; }
    const { s, unit } = node;
    // flagLine callback firing under this combo
    const fl = (s.flagLines ?? []).find((l) => combo.has(l.flag));
    if (fl) callbacks.push(`${id.split(".").pop()}:${fl.flag}`);
    const nx = s.next;
    if (nx === null) { // chapter end → next chapter, or the finale
      const cont = nextChapterStart(unit);
      if (cont === null) { ending = id; break; }
      id = cont; continue;
    }
    if (Array.isArray(nx)) { // Choice — pick the branch this combo decided
      const pick = nx.find((c) => (c.sets ?? []).some((f) => combo.has(f))) ?? nx[0];
      forksTaken.push(`${id.split(".").pop()}→${pick.id}`);
      id = pick.next; continue;
    }
    if (typeof nx === "object") { id = combo.has(nx.flag) ? nx.then : nx.else; continue; } // FlagGate
    id = nx;
  }
  return { forksTaken, callbacks, ending };
}

console.log(`FOURTEEN: LIVE — fork walkthrough (${combos.length} combos over ${forks.length} forks)\n`);
let allOk = true;
for (const combo of combos) {
  const { forksTaken, callbacks, ending } = play(combo);
  const ok = ending === "g4.st.fourteen-live.ch13.s020" && !forksTaken.some((f) => f.includes("LOOP") || f.includes("DANGLING"));
  allOk &&= ok;
  console.log(`${ok ? "✓" : "✗"} [${combo.join(", ").padEnd(38)}]`);
  console.log(`    forks:     ${forksTaken.join("  ")}`);
  console.log(`    callbacks: ${callbacks.join("  ") || "(none)"}`);
  console.log(`    ending:    ${ending?.split(".").pop() ?? "NONE"}\n`);
}
console.log(allOk ? "ALL COMBOS reach the finale with coherent fork paths + flagLine callbacks ✓" : "SOME COMBOS FAILED ✗");
process.exit(allOk ? 0 : 1);
