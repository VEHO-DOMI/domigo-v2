// Dev harness (Build-D2): swap a candidate phase into ch01 and run the REAL
// level laws + a reachability map, so grids are authored green, not guessed.
//   node --experimental-strip-types scripts/check-level-candidate.mjs <candidate.json>
// candidate.json = a full PhaseSpec ({id,nameDe,surface,plates,rows,entities,links,exit}).
// It replaces the matching phase (or arena/bonus by id) in the live level.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parsePaintLevel, checkLevelLaws, reachableCells, findGlyph, standable } from "../packages/game-paint/src/level.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LEVEL = path.join(HERE, "..", "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const candPath = process.argv[2];
if (!candPath) { console.error("usage: check-level-candidate <candidate.json>"); process.exit(2); }

const level = JSON.parse(fs.readFileSync(LEVEL, "utf8"));
const cand = JSON.parse(fs.readFileSync(candPath, "utf8"));

// splice the candidate in by id
const pi = level.phases.findIndex((p) => p.id === cand.id);
if (pi >= 0) level.phases[pi] = cand;
else if (level.arena?.id === cand.id) level.arena = cand;
else if (level.bonus?.id === cand.id) level.bonus = cand;
else { console.error(`no phase/arena/bonus with id ${cand.id}`); process.exit(2); }

// parse (shape/semantics) then laws
try { parsePaintLevel(level); }
catch (e) { console.error("PARSE FAIL:", e.message); process.exit(1); }

const failures = checkLevelLaws(level);
const mine = failures.filter((f) => f.phase === cand.id || f.phase === "*");

// reachability map for the candidate
const reach = reachableCells(cand.rows, level.abilities, cand.entities);
const rset = new Set(reach);
const need = []; // required cells: exit, letters, cages, powerups
const ex = findGlyph(cand.rows, "X") ?? findGlyph(cand.rows, "B");
if (ex) need.push(["exit", ex.c, ex.r]);
cand.rows.forEach((row, r) => [...row].forEach((g, c) => { if (g === "*") need.push(["letter", c, r]); }));
for (const e of cand.entities ?? []) if (e.role === "cage" || e.role === "powerup") need.push([e.role + ":" + e.id, e.c, e.r]);
// match the REAL law envelopes exactly: exit+letters (1,1,3), cages+powerups (2,2,4)
const nearReachE = (c, r, dc, up, down) => {
  for (let dr = -up; dr <= down; dr++) for (let d = -dc; d <= dc; d++) if (rset.has(`${c + d},${r + dr}`)) return true;
  return false;
};
const nearReach = (c, r, kind) =>
  kind === "cage" || kind === "powerup" ? nearReachE(c, r, 2, 2, 4) : nearReachE(c, r, 1, 1, 3);

console.log(`\n═══ ${cand.id} (${cand.nameDe}) — ${cand.rows.length}×${cand.rows[0].length} ═══`);
// render: reachable standable cell = '+', start 'S', required-reachable '*/X/o', required-UNreachable '!'
const kindOf = (name) => (name.startsWith("cage") ? "cage" : name.startsWith("powerup") ? "powerup" : "letter");
const nc = new Map(need.map(([name, c, r]) => [`${c},${r}`, kindOf(name)]));
for (let r = 0; r < cand.rows.length; r++) {
  let line = "";
  for (let c = 0; c < cand.rows[r].length; c++) {
    const g = cand.rows[r][c];
    const std = standable(cand.rows, c, r);
    if (nc.has(`${c},${r}`)) line += nearReach(c, r, nc.get(`${c},${r}`)) ? g : "!";
    else if (g !== "." && g !== "#") line += g;
    else if (std && rset.has(`${c},${r}`)) line += "+";
    else line += g === "#" ? "█" : "·";
  }
  console.log(String(r).padStart(2) + " " + line);
}
console.log("\nReachability of REQUIRED cells:");
for (const [name, c, r] of need) console.log(`  ${nearReach(c, r, kindOf(name)) ? "✓" : "✗ UNREACHABLE"}  ${name} @(${c},${r})`);
console.log("\nLaw failures for this phase:", mine.length === 0 ? "NONE ✓" : "");
for (const f of mine) console.log(`  ✗ [${f.law}] ${f.detail}`);
process.exit(mine.length === 0 && need.every(([name, c, r]) => nearReach(c, r, kindOf(name))) ? 0 : 1);
