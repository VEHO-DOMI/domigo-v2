// PB-T6 · THE gameTasks@2 AUTHORING GATE (run: node --experimental-strip-types
// scripts/check-game-tasks.mjs; exit 1 on any violation; CI-runnable).
//
// Seven layers over every content/corpus/stories/*/paint/*.tasks.v2.json:
//   1. SCHEMA + cross-field invariants — GameTasksFileV2 (content-schema),
//      which now also carries the BINDING LAW (entity stimulus ⟺ skins).
//   2. GROUNDING — every student-visible English token is in the unit lexicon.
//   3. GIVEAWAY + REGISTER — an answer token never leaks into its own prompt/
//      story; German fields carry no threat vocabulary.
//   4. BINDING vs THE LEVEL (PB-F1) — every declared skin is a being that
//      really exists in this chapter, in the phases the card declares.
//   5. COVERAGE (PB-F1) — every being that can raise a card HAS cards of its
//      own in the pool its events serve, so the fallback is never the answer
//      to a creature standing right there (Koki's REPLAY 1, F2-1).
//   6. LENGTH (PB-F1/F2-2) — one short clause + the ask, read-aloud-able by a
//      six-year-old in about five seconds.
//   7. TWINS (PB-F1) — no two cards present the same answerable surface.
//   8. SPEAKER LAW (doc 41 §3, R3-11) — every card's `use` is raised by a
//      visible asker that really stands in this chapter; a pool nobody can
//      raise is dead content (and hazards raise nothing at all any more).
//   9. DISTRIBUTION MAP (doc 41 §1, R3-13) — a chapter's FIELD may only serve
//      the kinds its palette allows, so ch01 stays a tutorial; and the
//      non-repetition floor is what the phase actually spawns, not a flat 2.
// The grounding/register helpers mirror scripts/check-story-grounding.mjs
// (same lexicon, same law) — kept compact and local on purpose.
import fs from "node:fs";
import path from "node:path";
import { GameTasksFileV2, MAX_LINE_DE, registerErrorsDe } from "../packages/content-schema/src/game-tasks.ts";

const STORIES = "content/corpus/stories";
const lex = JSON.parse(fs.readFileSync("docs/design/g1/grounding/u01-lexicon.json", "utf8"));

let failures = 0;
const fail = (where, msg) => { failures += 1; console.error(`✗ ${where}: ${msg}`); };

// ── grounding vocabulary (mirrors check-story-grounding.mjs) ──
const words = new Set(lex.words.map((w) => w.toLowerCase()));
const phrases = lex.phrases.map((p) => p.toLowerCase());
const proper = new Set(lex.properNouns.map((w) => w.toLowerCase()));
const FREE = new Set(["oh", "ssh", "psst", "wow", "hey", "but", "now", "do", "too", "yes", "no"]);
const tokens = (en) => (String(en).toLowerCase().match(/[a-zäöüß'-]+/gi) ?? []).filter((t) => t.length > 0);
function grounded(tokRaw, extra) {
  const tok = tokRaw.toLowerCase();
  if (words.has(tok) || proper.has(tok) || extra.has(tok)) return true;
  if (tok.endsWith("ies") && words.has(tok.slice(0, -3) + "y")) return true;
  if (tok.endsWith("es") && words.has(tok.slice(0, -2))) return true;
  if (tok.endsWith("s") && (words.has(tok.slice(0, -1)) || proper.has(tok.slice(0, -1)))) return true;
  return false;
}
function checkEn(where, en) {
  if (!en) return;
  const extra = new Set();
  const enLow = String(en).toLowerCase();
  for (const p of phrases) if (enLow.includes(p)) for (const t of tokens(p)) extra.add(t);
  for (const t of tokens(en)) if (!FREE.has(t) && !grounded(t, extra)) fail(where, `EN token not in MORE! 1 Unit 1: "${t}" (in "${en}")`);
}
// PK-R3b: the ban list moved into content-schema (registerErrorsDe) so the LEVEL
// laws can apply the identical rule to the Regel-Seiten' authored German — a
// register law with a second copy is a register law with one enforced copy.
function checkDe(where, de) {
  for (const msg of registerErrorsDe(de)) fail(where, msg);
}
// giveaway: a content answer-token must not appear in the task's own prompt/story
function checkGiveaway(where, answer, ...deenFields) {
  const ansToks = new Set(tokens(answer).filter((t) => t.length > 2 && !FREE.has(t)));
  for (const f of deenFields) for (const t of tokens(f)) if (ansToks.has(t)) fail(where, `giveaway: answer token "${t}" appears in a prompt/story field`);
}

// ── the English + German surface of each kind ──
function checkItem(chId, t) {
  const w = `${chId}:${t.id}`;
  // 6 · the kurzweilig law (F2-2): a card is one short clause + the ask
  const shows = t.stimulus?.type === "entity" ? t.stimulus.showsDe : "";
  if (shows.length > MAX_LINE) fail(w, `length: showsDe is ${shows.length} chars (max ${MAX_LINE}) — "${shows}"`);
  if (t.storyDe.length > MAX_LINE) fail(w, `length: storyDe is ${t.storyDe.length} chars (max ${MAX_LINE}) — "${t.storyDe}"`);
  // German fields (all kinds)
  checkDe(w, t.storyDe);
  checkDe(w, t.hints?.deDesc);
  checkDe(w, t.hints?.deWord);
  if (t.stimulus?.type === "image") checkDe(w, t.stimulus.altDe);
  if (t.stimulus?.type === "entity") checkDe(w, t.stimulus.showsDe);
  // 9 · the distribution map: is this kind allowed out in this chapter's field?
  const palette = CHAPTER_FIELD_KINDS[chId];
  if (palette && FIELD_USES.has(t.use) && !palette.has(t.kind)) {
    fail(w, `palette: ${chId}'s field is [${[...palette].join(" · ")}] — a "${t.kind}" card cannot be served as "${t.use}" here (doc 41 §1)`);
  }
  // English surface + giveaway, per kind
  checkEn(w, t.promptEn);
  switch (t.kind) {
    case "choice": t.options.forEach((o) => checkEn(w, o)); checkEn(w, t.answer); checkGiveaway(w, t.answer, t.promptEn, t.storyDe); break;
    case "typed": checkEn(w, t.answer); (t.accept ?? []).forEach((a) => checkEn(w, a)); checkGiveaway(w, t.answer, t.promptEn, t.storyDe); break;
    case "spell": checkEn(w, t.answer); checkGiveaway(w, t.answer, t.promptEn, t.storyDe); break;
    case "wheel": t.values.forEach((v) => checkEn(w, v)); checkEn(w, t.answer); checkGiveaway(w, t.answer, t.promptEn, t.storyDe); break;
    case "order": t.orderedChips.forEach((c) => checkEn(w, c)); break;
    case "oddone": t.items.forEach((i) => checkEn(w, i)); break;
    case "mistake": t.sentence.forEach((s) => checkEn(w, s)); checkEn(w, t.fix.correction); (t.correctionOptions ?? []).forEach((o) => checkEn(w, o)); break;
    case "memory": t.pairs.forEach((p) => checkEn(w, p.b)); break;
    case "restore":
      t.nameOptions.forEach((o) => checkEn(w, o));
      t.colourOptions.forEach((o) => checkEn(w, o));
      // step 2's German ask is a rendered line like any other
      checkDe(w, t.colourAskDe);
      if (t.colourAskDe.length > MAX_LINE) fail(w, `length: colourAskDe is ${t.colourAskDe.length} chars (max ${MAX_LINE}) — "${t.colourAskDe}"`);
      // BOTH answers must be earned. The colour ask is German and the answer is
      // English, so a naive token compare would never catch „gib mir mein Gelb"
      // next to „yellow" — but it does catch the real leak, an English colour
      // word written into the very line that asks for it.
      checkGiveaway(w, t.name, t.promptEn, t.storyDe, t.colourAskDe);
      checkGiveaway(w, t.colour, t.promptEn, t.storyDe, t.colourAskDe);
      break;
  }
}

// ── PB-F1: the card set against the LEVEL it is played in ────────────────────
// The sim decides which pool an event asks for; these two tables mirror
// packages/game-paint/src/sim.ts and must move with it.
const HOSTILE_ROLES = ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm"];
const encounterUseFor = (role) => (role === "swarm" ? "quickfire" : "encounter");
const MAX_LINE = MAX_LINE_DE; // the kurzweilig law (F2-2), shared with the level laws

// ── 9 · THE DISTRIBUTION MAP (doc 41 §1, R3-13) ──────────────────────────────
// Koki's principle: ch01 is the TUTORIAL — it must not hand a six-year-old the
// whole card kit in their first twenty minutes. Each chapter therefore gets a
// small FIELD palette (the kinds beings ask out in the world), +1–2 kinds debut
// per chapter, and anything complex premieres in an ARENA before it reaches the
// field. The boss ritual is exempt by design (doc 41 §1): its scripted
// mistake/order/memory/typed set at the Tafel is intentional G-era design, and
// R3-12 fixed what was actually wrong with it (unanswerable, not too complex).
/** The uses a being raises OUT IN THE WORLD — where the palette applies. */
const FIELD_USES = new Set(["encounter", "quickfire", "door", "rescue"]);
/** chapter → the kinds its FIELD may serve. A chapter with no entry is not yet
 *  ruled on and is left alone, so this table can grow one chapter at a time. */
const CHAPTER_FIELD_KINDS = {
  ch01: new Set(["choice", "wheel", "restore", "oddone"]),
};

const allPhasesOf = (level) => [
  ...(level.phases ?? []),
  ...(level.arena ? [level.arena] : []),
  ...(level.bonus ? [level.bonus] : []),
];

/** Cards of `use` this being could ever be served, honouring the phase scope —
 *  the same filter routing.ts applies at run time. */
const boundCards = (items, use, skin, phase) =>
  items.filter((t) => t.use === use && t.skins?.includes(skin) === true
    && (t.phases === undefined || t.phases.includes(phase)));

// ── 10 · THE DESATURATION LAW (doc 41 §2, R3-15) ─────────────────────────────
// A being OSWIN drained renders GREY until the child gives its colour back. So
// a card about such a being may not tell them it is „weiß" or „bunt" — the
// screen says otherwise, and a card that describes a colour the world does not
// show is the same defect R3-12 took off the boss, one layer down.
//
// Found by sweeping the shipped set after the wash landed: three cards written
// long before this mechanic existed („Ein weißer Radiergummi", „seine bunten
// Farben", „Eine braune Schultasche") became wrong the moment the grammar
// shipped. Grey/blass are of course allowed — that IS the state.
// PK-R6 · C1: `drained` is the role this law was really written for — mirrors
// game-paint/src/anim.ts WASHED_ROLES, which is the renderer's own list.
const WASHED_ROLES_MJS = ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm", "cage", "drained"];
const COLOUR_WORDS_DE = /\b(wei(ß|ss)|rot|blau|grün|gelb|braun|schwarz|rosa|orange|bunt|golden|silbern)\w*/i;

function checkDesaturation(w, items, washedSkins) {
  for (const t of items) {
    if (t.stimulus?.type !== "entity") continue;
    if (!(t.skins ?? []).some((s) => washedSkins.has(s))) continue;
    const m = COLOUR_WORDS_DE.exec(t.stimulus.showsDe);
    if (m) {
      fail(`${w}:${t.id}`, `desaturation: showsDe calls a drained being „${m[0]}", but it renders GREY until it is restored (doc 41 §2) — describe its shape, not a colour it has lost`);
    }
  }
}

function checkAgainstLevel(file, level, items) {
  const w = path.basename(file);
  const phases = allPhasesOf(level);
  const phaseIds = new Set(phases.map((p) => p.id));
  const skinPhases = new Map(); // skin → Set(phase ids it lives in)
  const washedSkins = new Set(); // R3-15: the skins the colour wash covers
  for (const ph of phases) {
    for (const e of ph.entities ?? []) {
      if (!skinPhases.has(e.skin)) skinPhases.set(e.skin, new Set());
      skinPhases.get(e.skin).add(ph.id);
      if (WASHED_ROLES_MJS.includes(e.role)) washedSkins.add(e.skin);
    }
  }
  checkDesaturation(w, items, washedSkins);

  // 4 · every declared binding points at something that exists
  for (const t of items) {
    for (const p of t.phases ?? []) {
      if (!phaseIds.has(p)) fail(`${w}:${t.id}`, `binding: phase "${p}" does not exist in this chapter`);
    }
    for (const s of t.skins ?? []) {
      if (!skinPhases.has(s)) fail(`${w}:${t.id}`, `binding: no being with skin "${s}" exists in this chapter`);
    }
    // a card scoped to a phase its being never enters can never be served
    if (t.skins && t.phases) {
      for (const p of t.phases) {
        if (!t.skins.some((s) => skinPhases.get(s)?.has(p))) {
          fail(`${w}:${t.id}`, `binding: none of [${t.skins.join(", ")}] appears in phase ${p} — this card can never be served`);
        }
      }
    }
  }

  // 5 · every being that can raise a card has cards of its own
  for (const ph of phases) {
    // 5b · NON-REPETITION (doc 41 §1, from the charter: „two pencils = two
    // distinct cards minimum"). The check used to demand a flat ≥2 for every
    // hostile skin — but p1 stands TWO pencils on the same screen, and a child
    // who meets both and is asked the identical thing twice is practising the
    // card, not the language. So the floor is now what the phase actually
    // spawns: count the same-skin beings that can be on screen together and
    // demand at least that many distinct cards for them.
    const simultaneous = new Map(); // skin → how many of it this phase holds
    for (const e of ph.entities ?? []) {
      if (HOSTILE_ROLES.includes(e.role)) simultaneous.set(e.skin, (simultaneous.get(e.skin) ?? 0) + 1);
    }
    for (const e of ph.entities ?? []) {
      const at = `${w}:${ph.id}/${e.id}`;
      if (HOSTILE_ROLES.includes(e.role)) {
        const use = encounterUseFor(e.role);
        const need = Math.max(2, simultaneous.get(e.skin) ?? 1);
        const n = boundCards(items, use, e.skin, ph.id).length;
        if (n < need) fail(at, `coverage: hostile skin "${e.skin}" has ${n} ${use} card(s) here — needs ≥${need} (${simultaneous.get(e.skin)} of them stand in ${ph.id} at once)`);
      } else if (e.role === "guardian") {
        // a guardian raises three different pools: chalk hits (encounter),
        // knot windows (boss) and the chapter's last act (finale)
        for (const [use, min] of [["encounter", 2], ["boss", 2], ["finale", 1]]) {
          const n = boundCards(items, use, e.skin, ph.id).length;
          if (n < min) fail(at, `coverage: guardian skin "${e.skin}" has ${n} ${use} card(s) here — needs ≥${min}`);
        }
      } else if (e.role === "cage") {
        const n = boundCards(items, "rescue", e.skin, ph.id).length;
        if (n < 1) fail(at, `coverage: cage skin "${e.skin}" has no rescue card here`);
      } else if (e.role === "drained") {
        // PK-R6 · C1 · THE RESTORE-PAIR LAW. A drained object is a promise
        // rendered in grey: the child walks up, presses ↑, and the world owes
        // them the two-step card that gives its name and its colour back. With
        // no bound card the router falls through to the unbound quickfire pool
        // and a drained desk asks a number question — the exact "answered by a
        // card about somebody else" defect the binding law (PB-F1) exists to
        // stop, and it would ship silently because nothing else looks here.
        const n = boundCards(items, "encounter", e.skin, ph.id)
          .filter((t) => t.kind === "restore").length;
        if (n < 1) fail(at, `coverage: drained object "${e.skin}" has no restore card in ${ph.id} — a grey thing with no way to give its colour back`);
      } else if (e.role === "door.trigger" && String(e.params?.kind ?? "exit") !== "bonus") {
        const n = boundCards(items, "door", e.skin, ph.id).length;
        if (n < 1) fail(at, `coverage: door skin "${e.skin}" has no door card here`);
      }
    }
  }

  // 8 · THE SPEAKER LAW (doc 41 §3, R3-11) — every card is asked by someone the
  // child can SEE. This check used to say the opposite: it DEMANDED an unbound
  // quickfire card "because spikes and ink would have nothing to serve". Spikes
  // and ink no longer serve anything (sim.ts dropped the hazard TaskRequest and
  // the ctx union has no `hazard` member), so the law inverts — a card sitting
  // in a pool no visible asker can raise is dead content, and dead content is
  // exactly where an un-reviewed card hides.
  const raisedUses = new Set();
  for (const ph of phases) {
    for (const e of ph.entities ?? []) {
      if (HOSTILE_ROLES.includes(e.role)) raisedUses.add(encounterUseFor(e.role));
      // PK-R6 · C1: a drained object is a visible asker too — it raises its own
      // card on the ↑ press (sim.ts `engaged` → use "encounter").
      else if (e.role === "drained") raisedUses.add("encounter");
      else if (e.role === "guardian") { raisedUses.add("encounter"); raisedUses.add("boss"); raisedUses.add("finale"); }
      else if (e.role === "cage") raisedUses.add("rescue");
      else if (e.role === "door.trigger") raisedUses.add(String(e.params?.kind ?? "exit") === "bonus" ? "bonuspay" : "door");
    }
  }
  // the shell's universal fallback: when a being's own pool runs dry it is
  // answered from the unbound quickfire cards — still a seeable asker, so
  // quickfire stays reachable wherever any being can raise a card at all.
  if (raisedUses.size > 0) raisedUses.add("quickfire");
  for (const t of items) {
    if (!raisedUses.has(t.use)) {
      fail(`${w}:${t.id}`, `speaker-law: use "${t.use}" is raised by no visible asker in this chapter — the card can only ever be served by nobody`);
    }
  }
}

/** 7 · NO TWO CARDS ARE THE SAME ITEM (PB-F1, from the blind-solve round). A
 *  child who meets the same three options or builds the same sentence twice is
 *  practising recall of the card, not of the language — and it reads as a bug.
 *  Same-shape is judged on the ANSWERABLE surface, not on the flavour text. */
function checkNoTwins(file, items) {
  const w = path.basename(file);
  const shapes = new Map(); // signature → first id that used it
  const sig = (t) => {
    if (t.kind === "choice") return `choice:${[...t.options].sort().join("|")}`;
    if (t.kind === "order") return `order:${t.orderedChips.join("|")}`;
    if (t.kind === "mistake") return `mistake:${t.sentence.join("|")}`;
    if (t.kind === "oddone") return `oddone:${[...t.items].sort().join("|")}`;
    // R3-15: two restore cards offering the same four names ARE the same item —
    // the colour step is a second question about the same choice, not a new one.
    if (t.kind === "restore") return `restore:${[...t.nameOptions].sort().join("|")}`;
    return null;
  };
  for (const t of items) {
    const s = sig(t);
    if (s === null) continue;
    const first = shapes.get(s);
    if (first !== undefined) fail(`${w}:${t.id}`, `twin: same ${t.kind} surface as ${first} — a child meets the identical item twice`);
    else shapes.set(s, t.id);
  }
}

// ── walk every *.tasks.v2.json ──
const files = [];
if (fs.existsSync(STORIES)) {
  for (const story of fs.readdirSync(STORIES)) {
    const dir = path.join(STORIES, story, "paint");
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".tasks.v2.json"))) files.push(path.join(dir, f));
  }
}
if (files.length === 0) { console.log("check-game-tasks: no gameTasks@2 files yet — nothing to check"); process.exit(0); }

let itemCount = 0;
for (const file of files) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const parsed = GameTasksFileV2.safeParse(raw);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) fail(file, `schema: ${issue.path.join(".")} — ${issue.message}`);
    continue;
  }
  for (const t of parsed.data.items) { checkItem(parsed.data.chapter, t); itemCount++; }
  // the level this set is played in — bindings and coverage are cross-file laws
  const levelFile = file.replace(".tasks.v2.json", ".level.json");
  if (!fs.existsSync(levelFile)) {
    fail(file, `no sibling ${path.basename(levelFile)} — bindings cannot be checked against a world`);
    continue;
  }
  checkAgainstLevel(file, JSON.parse(fs.readFileSync(levelFile, "utf8")), parsed.data.items);
  checkNoTwins(file, parsed.data.items);
}

if (failures === 0) console.log(`check-game-tasks: OK — ${itemCount} tasks across ${files.length} file(s): schema, grounding, giveaway, register, binding, coverage, length, twins all green`);
else { console.error(`check-game-tasks: ${failures} failure(s)`); process.exit(1); }
