// PB-T6 · THE gameTasks@2 AUTHORING GATE (run: node --experimental-strip-types
// scripts/check-game-tasks.mjs; exit 1 on any violation; CI-runnable).
//
// Eighteen layers over every content/corpus/stories/*/paint/*.tasks.v2.json:
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
//  10. DESATURATION LAW (doc 41 §2, R3-15) — a card may not name a colour on a
//      being that renders GREY until it is restored.
//  11. PORTRAIT LAW (doc 44 §3.1.5, PK-R6 · C) — a card whose asker has been
//      PAINTED must declare which of its cells is talking; the declared stem
//      must exist and must belong to that being.
//  12. TIMER POLICY (doc 44 §2.9, PK-R6 · C) — the content may not contradict
//      the chalk clock's own map (game-paint/src/cards/timer.ts, imported).
//  13-17. THE VARIETY LAWS (R5-W2 · G1) — form, voice, rhythm, distinctness and
//      the coverage ledger, all computed by game-paint/src/cards/variety.ts,
//      IMPORTED so the gate and the game share one definition of "what a child
//      actually meets". Layer 15 does not model the serve, it RUNS the router.
//      Their exemptions live in scripts/game-tasks-variety-policy.json, where an
//      exemption must buy a stricter obligation (0d) and must suppress something
//      real (0k) or it is deleted.
//  18. THE GIVEAWAY CLASS (R5-W3 · G2, R25) — layer 3's giveaway rule reached
//      five of nine kinds and two of six student-visible fields. It now reaches
//      ALL of them, through one projection per card instead of nine hand-written
//      call sites, and it can read across languages. Sub-laws: 18a same-language
//      leak · 18b the GERMAN equivalent of the answer (the wordbank's own de[]
//      plus the number/colour table in scripts/game-tasks-giveaway-policy.json)
//      · 18c/18d the declared exception, policed in both directions · 18e the
//      guardian's board (evidence) — the chalk may not carry the solution.
//
// (Beifang, R5-W2 · G1: this header said "Seven layers" while the file enforced
// twelve, and it skipped straight from 9 to 11 although layer 10 — the
// DESATURATION LAW, line 189 — has been in the body all along. A header that
// undercounts its own file is how a law goes unreviewed, so it is corrected here
// rather than left as a curiosity.)
// The grounding/register helpers mirror scripts/check-story-grounding.mjs
// (same lexicon, same law) — kept compact and local on purpose.
import fs from "node:fs";
import path from "node:path";
import { GameTasksFileV2, MAX_LINE_DE, registerErrorsDe, seededShuffle } from "../packages/content-schema/src/game-tasks.ts";
import { CALM_DE, TIMED_USES, URGENCY_DE, spokenDeOf, timerClassFor } from "../packages/game-paint/src/cards/timer.ts";
// PK-R6 · D: the reawakening's length is a LAW, not a number this file may
// restate — imported from the engine that plays it (doc 44 §3.3's six rounds).
import { AWAKEN_ROUNDS, GUARDIAN_SCRIPT } from "../packages/game-paint/src/entities.ts";
// R5-W2 · H1 · the arena's number promise is checked by RUNNING the router for
// as many windows as the fight really opens (the layer-15 precedent).
import { initRoute, nextTask } from "../packages/game-paint/src/cards/routing.ts";
import { answerSurfaceOf, hasWord } from "../packages/game-paint/src/cards/variety.ts";
// R5-W2 · G1 · WHO RAISES WHICH POOL. These tables used to be copied into this
// file under the comment "these two tables mirror sim.ts and must move with it".
// The variety laws would have been the third copy, so they moved to the engine
// and everybody imports them — a rule with two copies is a rule with one
// enforced copy (PK-R3b).
import { HOSTILE_ROLES, allPhasesOf, askerUsesOf, raisedUsesOf } from "../packages/game-paint/src/cards/serving.ts";
import { varietyErrors } from "../packages/game-paint/src/cards/variety.ts";

const STORIES = "content/corpus/stories";
const lex = JSON.parse(fs.readFileSync("docs/design/g1/grounding/u01-lexicon.json", "utf8"));
// layers 13-17 read the unit the chapter teaches, plus the declared exemptions
const POLICY_FILE = "scripts/game-tasks-variety-policy.json";
const policy = JSON.parse(fs.readFileSync(POLICY_FILE, "utf8"));
const wordbank = JSON.parse(fs.readFileSync("content/corpus/units/g1-u01/wordbank.json", "utf8")).entries;
const structureIds = [...new Set(JSON.parse(fs.readFileSync("content/corpus/units/g1-u01/grammar.json", "utf8")).items.map((i) => i.structureId))];
// the ledger's expiry dates are compared against a date the CHECKER supplies —
// variety.ts stays pure so its tests cannot rot with the calendar.
const TODAY = new Date().toISOString().slice(0, 10);

// ── the painted stems that exist on disk (mirrors check-paint-art's walk) ────
// Layer 11 needs to know what has been COMMISSIONED, which is a fact about the
// art tree, not about the content — so it is read from the tree.
const PAINT_ART_ROOT = "apps/web/public/art/g1/paint";
const paintedStems = new Set();
const walkArt = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walkArt(path.join(dir, e.name));
    else if (e.name.endsWith(".png")) paintedStems.add(e.name.replace(/\.png$/, ""));
  }
};
walkArt(PAINT_ART_ROOT);

let failures = 0;
/** When the selftest is driving, failures are COLLECTED instead of printed: a
 *  deliberate red light on stderr reads exactly like a real one, and the cases
 *  have to assert on the message anyway (E5's rebase lesson — a selftest that
 *  only counts failures passes when the wrong law fires). */
let captured = null;
const fail = (where, msg) => {
  failures += 1;
  if (captured !== null) { captured.push(`${where}: ${msg}`); return; }
  console.error(`✗ ${where}: ${msg}`);
};

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
// ── 18 · THE GIVEAWAY CLASS (R5-W3 · G2 · R25) ───────────────────────────────
// A giveaway is an UNINTENDED reveal (doc 29 §4.3): the card already contains
// its own answer, so the child practises nothing. The rule existed; its REACH
// did not. Until this layer it was nine hand-written call sites, and four kinds
// — order, oddone, mistake, memory — had simply never been given one. Those four
// are exactly the boss battery: all six boss cards were ungated, and so were the
// six oddone cards out in the field (12 of 54).
//
// Three things make the difference between a law and a nuisance here, and all
// three were measured on the shipped chapter before a line of this was written:
//
//  1. ONLY THE DISCRIMINATING WORDS COUNT. A word the card also puts in a
//     distractor cannot spoil anything — "Zwei davon" is harmless next to the
//     options `two books / one books / two book`, because "two" does not choose.
//     (The refinement is not new: scripts/check-story-grounding.mjs argued it for
//     v1 and it never reached v2.) A blunt sweep flags 51 places on this chapter;
//     with this rule and the next, 13 remain — and those 13 are real.
//  2. ONLY THE FIRST SIGHT COUNTS. The hint ladder (deDesc/deWord) exists to
//     reveal, one rung at a time, AFTER a wrong attempt. Policing it as a leak
//     would make the ladder unauthorable. Koki's ruling, 2026-08-14: the gate is
//     hard on what the child sees BEFORE answering, and the hints stay free.
//  3. THE ANSWER HAS A GERMAN SIDE. `checkGiveaway` compared spellings, so
//     "Die Tafel schreibt einen Satz über sich selbst" next to the answer
//     `board` was invisible — on every boss window of the chapter. The German
//     side comes from the corpus itself (wordbank de[]), not from a table
//     invented here; only what the corpus cannot know (numbers, colours — they
//     are lexiconClasses, not wordbank entries) is authored, with its reason.
const GIVEAWAY_POLICY_FILE = "scripts/game-tasks-giveaway-policy.json";
const givePolicy = JSON.parse(fs.readFileSync(GIVEAWAY_POLICY_FILE, "utf8"));

/** Closed-class words carry no lexical load: "it", "is", "a" in an answer
 *  discriminate nothing, and the old `length > 2` filter was a proxy for this
 *  that also threw away `red`, `two`, `ten` — three of the words this chapter
 *  most wants to protect. */
const CLOSED = new Set(["the", "a", "an", "is", "are", "am", "it", "it's", "i", "i'm", "you", "your", "my", "to", "in", "on", "at", "and", "or", "not", "what", "this", "that", "of", "he", "she", "they", "we"]);
const contentToks = (s) => tokens(s).filter((t) => !CLOSED.has(t) && !FREE.has(t));

/** deutsch → englisch. The wordbank speaks first (it is the corpus), the policy
 *  file only fills what the wordbank structurally cannot carry. */
function buildDeGloss() {
  const map = new Map();
  const add = (de, en) => {
    const key = String(de).toLowerCase().trim();
    if (key.length === 0) return;
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(String(en).toLowerCase().trim());
  };
  for (const e of wordbank) for (const de of e.de ?? []) add(de, e.en);
  for (const [cls, block] of Object.entries(givePolicy.deGloss ?? {})) {
    for (const [de, ens] of Object.entries(block.pairs ?? {})) {
      for (const en of ens) {
        add(de, en);
        // 18f · the English side is a claim about the unit. A gloss pointing at a
        // word this unit never teaches would quietly widen the law past the corpus.
        for (const tok of tokens(en)) {
          if (!grounded(tok, new Set())) fail(`giveaway-policy:${cls}`, `18f · glosses "${de}" as "${en}", but "${tok}" is not in MORE! 1 Unit 1`);
        }
      }
    }
    if (!block.reason) fail(`giveaway-policy:${cls}`, "18f · a gloss block must say WHY it exists (the reason is the review surface)");
  }
  return map;
}

/** What the card OFFERS the child to choose between — the surface a distractor
 *  lives on. Wider than the answer: this is what makes a shared word harmless. */
function offeredOf(t) {
  switch (t.kind) {
    case "choice": return t.options;
    case "typed": return [t.answer, ...(t.accept ?? [])];
    case "spell": return [t.answer];
    case "wheel": return [...t.values, t.shown];
    case "order": return t.orderedChips;
    case "oddone": return t.items;
    case "mistake": return [...t.sentence, ...(t.correctionOptions ?? [])];
    case "memory": return t.pairs.flatMap((p) => [p.a, p.b]);
    case "restore": return [...t.nameOptions, ...t.colourOptions];
    default: return [];
  }
}

/** The words that actually CHOOSE — the answer minus everything a distractor
 *  also says. An exhaustive switch on the discriminated union, so a tenth kind
 *  cannot slip past this layer the way four kinds slipped past the old one. */
function decidingWordsOf(t) {
  const only = (answer, alternatives) => {
    const shared = new Set(alternatives.flatMap((a) => contentToks(a)));
    return contentToks(answer).filter((w) => !shared.has(w));
  };
  switch (t.kind) {
    case "choice": return only(t.answer, t.options.filter((o) => o !== t.answer));
    case "typed": return [...new Set([t.answer, ...(t.accept ?? [])].flatMap((a) => contentToks(a)))];
    case "spell": return contentToks(t.answer);
    case "wheel": return only(t.answer, t.values.filter((v) => v !== t.answer));
    // an order card is answered by a SEQUENCE, not by a word — no word of it can
    // be given away, and the leak lives on the board instead (18e)
    case "order": return [];
    case "oddone": return [...new Set(t.correct.flatMap((c) => only(c, t.items.filter((i) => !t.correct.includes(i)))))];
    case "mistake": return only(t.fix.correction ?? "", (t.correctionOptions ?? []).filter((o) => o !== t.fix.correction));
    // every English word on a memory board is half of a pair the child must find
    case "memory": return [...new Set(t.pairs.flatMap((p) => contentToks(p.b)))];
    case "restore": return [
      ...only(t.name, t.nameOptions.filter((o) => o !== t.name)),
      ...only(t.colour, t.colourOptions.filter((o) => o !== t.colour)),
    ];
    default: return [];
  }
}

/** What the child reads BEFORE answering. `de` marks the fields the cross-language
 *  law may read — a German needle hunted through English prose would fire on every
 *  word the two languages share. */
function firstSightOf(t) {
  const out = [];
  if (t.promptEn) out.push({ field: "promptEn", text: t.promptEn, de: false });
  out.push({ field: "storyDe", text: t.storyDe, de: true });
  if (t.stimulus?.type === "entity") out.push({ field: "showsDe", text: t.stimulus.showsDe, de: true });
  if (t.stimulus?.type === "image") out.push({ field: "altDe", text: t.stimulus.altDe, de: true });
  if (t.kind === "restore") out.push({ field: "colourAskDe", text: t.colourAskDe, de: true });
  return out;
}

/** What the guardian's chalk may legitimately show (PaintScene.writeEvidence).
 *  Deliberately NARROWER than `offeredOf`: a mistake card offers its corrections
 *  as buttons, but the board shows only her false sentence. */
function boardAllowanceOf(t) {
  switch (t.kind) {
    case "oddone": return t.items;
    case "order": return t.orderedChips;
    case "mistake": return t.sentence;
    case "memory": return t.pairs.map((p) => p.a);
    default: return offeredOf(t);
  }
}

/** WHERE THE GERMAN IS ALLOWED TO SAY IT — derived, not declared.
 *
 * Two of this chapter's card FORMS are built on a German scaffold, and for them
 * a cross-language match is the pedagogy rather than a leak. Both are read off
 * the content's own declared axes, so nobody has to maintain a list:
 *
 *  · `form: "command"` — the form IS "tell someone to do or not do something"
 *    (TASK_FORMS, content-schema). „Sag ihm, er soll ZUHÖREN!" names the deed in
 *    German so the child can produce it in English; strip the German and there is
 *    no task left. The obligation this exemption buys is already banked and
 *    already enforced: a card only HAS a form because layer 13 made it declare
 *    one, and layers 14–16 hold that declaration to voice, rhythm and coverage.
 *  · `use: "rescue"` — the cage cards. The portrait on these is the CAGE
 *    (`satchel_*`), never the inmate: the being behind the bars has no painted
 *    cell, so the German line is the only thing that says who is in there
 *    (D-34, verbatim: „Die Rettungs-Karten NENNEN ihn deshalb").
 *
 * Everything else stays under the law — including `form: "name-it"`, where the
 * being stands painted and desaturated on screen and the ask is literally "pick
 * its English name". Six of that form's nine cards already describe instead of
 * naming („ein kleiner Kasten", „eine graue Tasche", „ein flacher Bildschirm");
 * the three that named it were the finding, not the norm. */
const scaffoldFieldsOf = (t) => new Set([
  ...(t.form === "command" ? ["storyDe"] : []),
  ...(t.use === "rescue" ? ["showsDe"] : []),
]);

/** Layer 18 for ONE card. Returns failures instead of printing them, so the
 *  selftest can run the real law over a prepared traitor card, and so 18c can
 *  run it twice — once with the family honoured, once bare. */
function giveawayFailures(t, deGloss, declaredFields) {
  const out = [];
  const deciding = decidingWordsOf(t);
  const scaffold = scaffoldFieldsOf(t);
  for (const { field, text, de } of firstSightOf(t)) {
    if (!text) continue;
    if (declaredFields.has(field)) continue;
    // 18a · the same-language leak
    for (const w of deciding) {
      if (hasWord(text, w)) out.push({ law: "18a", field, detail: `giveaway: the deciding answer word "${w}" already stands in ${field} — "${text}"` });
    }
    if (!de || scaffold.has(field)) continue;
    // 18b · the German equivalent of the answer
    const decidingSet = new Set(deciding);
    for (const [deWord, ens] of deGloss) {
      if (!hasWord(text, deWord)) continue;
      for (const en of ens) {
        const enToks = contentToks(en);
        if (enToks.length > 0 && enToks.every((x) => decidingSet.has(x))) {
          out.push({ law: "18b", field, detail: `giveaway across languages: ${field} says "${deWord}", which is the German for the answer "${en}" — "${text}"` });
        }
      }
    }
  }
  // 18e · the guardian's board
  if (t.evidence) {
    const allowed = new Set(boardAllowanceOf(t).flatMap((s) => tokens(s)));
    for (const line of t.evidence) {
      for (const w of tokens(line)) {
        if (!allowed.has(w)) out.push({ law: "18e", field: "evidence", detail: `the board chalks "${w}", which this card never puts in front of the child — the chalk may only show what the card itself offers ("${line}")` });
      }
    }
    if (t.kind === "order") {
      const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
      const sorted = (a) => [...a].sort();
      if (!same(sorted(t.evidence), sorted(t.orderedChips))) {
        out.push({ law: "18e", field: "evidence", detail: `the board shows [${t.evidence.join(" ")}] but the chips are [${t.orderedChips.join(" ")}] — the child reorders what she reads, so the board must carry exactly those chips` });
      } else if (same(t.evidence, t.orderedChips)) {
        out.push({ law: "18e", field: "evidence", detail: `the board already shows the SOLVED order [${t.evidence.join(" ")}] — the child only has to copy it` });
      } else {
        const shuffled = seededShuffle(t.orderedChips, t.id);
        if (!same(t.evidence, shuffled)) {
          out.push({ law: "18e", field: "evidence", detail: `the board shows [${t.evidence.join(" ")}] while the card deals the chips as [${shuffled.join(" ")}] — two different scrambles of one puzzle; the board is the deal (boss.o1's own grounding line states this)` });
        }
      }
    }
  }
  return out;
}

const DE_GLOSS = buildDeGloss();

// ── 18c/18d · THE DECLARED EXCEPTION ─────────────────────────────────────────
// Where the reveal cannot be derived from a form (above), it is DECLARED — the
// house shape twice over: doc 29 §4.3's identityAnswer/identityNote (declare the
// intended reveal, then police the declaration) and the variety policy's family
// device (match + reason + doc + a STRICTER obligation bought in return).
//
// Policed in both directions, because a one-way exception rots into a blanket
// pass. A family must match a card that exists, name a field that card really
// shows, carry a reason in prose, and buy an obligation (18d) — and it must
// actually suppress a failure (18c, the 0k device): an exemption nobody needs
// reads as a considered relaxation and is really dead text.
const FAMILIES = givePolicy.families ?? [];
const familyMatches = (f, t) =>
  (f.match?.kind === undefined || f.match.kind === t.kind) &&
  (f.match?.use === undefined || f.match.use === t.use) &&
  (f.match?.form === undefined || f.match.form === t.form);
const declaredFieldsFor = (t) => {
  const out = new Set();
  for (const f of FAMILIES) if (familyMatches(f, t)) for (const field of f.fields ?? []) out.add(field);
  return out;
};

/** The obligations a family buys. Each is ENFORCED, not merely declared —
 *  an obligation nobody checks is a sentence, not a duty. */
const OBLIGATIONS = {
  // a colour ask must carry a picture, never a bare demand
  simileDe: (t, field, text) => (/\bwie\b/i.test(text) ? null : `obliges "simileDe", but ${field} names the colour without a comparison — "${text}"`),
};

function checkGiveawayFamilies(file, items) {
  for (const f of FAMILIES) {
    const where = `${file} giveaway-policy:${f.id}`;
    const covered = items.filter((t) => familyMatches(f, t));
    if (covered.length === 0) { fail(where, "18d · family matches no card any more — a stale exemption hides the next gap"); continue; }
    if (!f.reason || f.reason.trim().length === 0) fail(where, "18d · a family must say WHY (the reason is the review surface)");
    if ((f.fields ?? []).length === 0) fail(where, "18d · a family that names no field exempts nothing");
    if (Object.keys(f.obliges ?? {}).length === 0) fail(where, `18d · exempts [${(f.exempts ?? []).join(" · ")}] and obliges nothing — an exemption buys a stricter obligation, never a pass`);
    // 18c · honoured against bare: does this family suppress anything real?
    let suppressed = 0;
    for (const t of covered) {
      const bare = giveawayFailures(t, DE_GLOSS, new Set());
      suppressed += bare.filter((e) => (f.fields ?? []).includes(e.field)).length;
      // and the obligation it bought, on every card it covers
      const shown = new Map(firstSightOf(t).map((x) => [x.field, x.text]));
      for (const field of f.fields ?? []) {
        if (!shown.has(field)) { fail(`${where} ${t.id}`, `18d · exempts "${field}", which this card never shows the child`); continue; }
        for (const [name, check] of Object.entries(OBLIGATIONS)) {
          if (f.obliges?.[name] === undefined) continue;
          const msg = check(t, field, shown.get(field));
          if (msg !== null) fail(`${file} ${t.id}`, `18d · ${msg}`);
        }
      }
      for (const name of Object.keys(f.obliges ?? {})) {
        if (OBLIGATIONS[name] === undefined) fail(where, `18d · obliges "${name}", which nothing enforces — an obligation nobody checks is a sentence, not a duty`);
      }
    }
    if (suppressed === 0) fail(where, `18c · exempts ${(f.fields ?? []).join(" · ")}, but nothing on those fields is flagged with or without the family — an exemption nobody needs is dead text. Delete it`);
  }
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
  // 18 · THE GIVEAWAY CLASS — one projection for all nine kinds. This used to be
  // five `checkGiveaway(...)` calls hand-written into the switch below, which is
  // why four kinds had none: the shape of the code was the shape of the gap.
  for (const e of giveawayFailures(t, DE_GLOSS, declaredFieldsFor(t))) fail(w, `${e.law} · ${e.detail}`);
  // English surface, per kind
  checkEn(w, t.promptEn);
  switch (t.kind) {
    case "choice": t.options.forEach((o) => checkEn(w, o)); checkEn(w, t.answer); break;
    case "typed": checkEn(w, t.answer); (t.accept ?? []).forEach((a) => checkEn(w, a)); break;
    case "spell": checkEn(w, t.answer); break;
    // PK-R6 · F: `shown` is grounded too. On a word-to-digit wheel the ring is
    // digits, so `values` and `answer` carry NO English at all — the datum the
    // skin draws (skins.tsx renders `state.shown`) is then the only English on
    // the card, and until now it was the one student-visible string layer 2
    // never read. An out-of-unit number word could have shipped through a green
    // grounding check.
    case "wheel": t.values.forEach((v) => checkEn(w, v)); checkEn(w, t.answer); checkEn(w, t.shown); break;
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
      // English — the case this file used to name as knowingly out of reach
      // („gib mir mein Gelb" next to `yellow`). Layer 18b reaches it now, and
      // where the German ask IS the task the card declares it (18c/18d).
      break;
  }
}

// ── PB-F1: the card set against the LEVEL it is played in ────────────────────
// The sim decides which pool an event asks for; these two tables mirror
// packages/game-paint/src/sim.ts and must move with it.
// HOSTILE_ROLES + the role→use mapping now come from cards/serving.ts (see the
// import block). `encounterUseFor` survives as a thin local name for the ONE
// question the coverage law asks — which pool a hostile's contact raises.
const encounterUseFor = (role) => askerUsesOf({ role })[0];
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
const WASHED_ROLES_MJS = ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm", "cage", "drained", "classmate"];
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
        // PK-R6 · F · A GUARDIAN RAISES TWO POOLS, NOT THREE. This row used to
        // demand ≥2 `encounter` cards as well, from the era when a chalk hit
        // was an ordinary field encounter. Stage E changed that: sim.ts's
        // encounter handler reads `src?.role === "guardian" ? "boss" : …`, and
        // both chalk paths (entities.ts 939 · 1014) raise the event with
        // `id: p.fromId` — the guardian herself. So EVERY guardian-raised
        // encounter resolves to the boss battery, and an `encounter` card bound
        // to her skin can never be served by anything. The gate was requiring
        // three cards the engine had no path to; ch01 duly shipped three, and
        // they sat unreachable behind a green check. Knot windows (boss) and
        // the chapter's last act (finale) are the two real pools.
        for (const [use, min] of [["boss", 2], ["finale", 1]]) {
          const n = boundCards(items, use, e.skin, ph.id).length;
          if (n < min) fail(at, `coverage: guardian skin "${e.skin}" has ${n} ${use} card(s) here — needs ≥${min}`);
        }
        // ── R5-W2 · H1 · THE ARENA'S NUMBER PROMISE, KEPT BY MACHINE ─────────
        //
        // The arena dossier ACCEPTED a contract from p3 in writing: p3 places a
        // Regel-Seite for „Zahlen 1–25" and the boss windows are where the
        // child is asked to use them. It was undischarged in every real run,
        // and nothing could see that, because the promise lived in prose and
        // the pool looked fine — six cards, one of them numbers.
        //
        // The catch is the ARITHMETIC of the fight. A clean run opens exactly
        // `knots` windows (three at tier E), the pool serves in file order from
        // a fresh cursor, and the number card sat sixth. A child who never got
        // hit never saw a number. So the check replays the REAL router for as
        // many serves as the fight actually makes — the layer-15 precedent: do
        // not model the serve, run it — and asks whether a number word was on
        // any of those cards.
        const knots = GUARDIAN_SCRIPT[e.tier]?.knots ?? 0;
        const numbers = new Set(
          (policy.chapters?.[level.chapter]?.lexiconClasses?.["g1u01.x.numbers"]?.words ?? [])
            .map((w) => String(w).toLowerCase()),
        );
        if (knots > 0 && numbers.size === 0) {
          fail(at, "coverage: the numbers lexicon class is empty — the arena's promise cannot be checked");
        } else if (knots > 0) {
          let st = initRoute();
          const served = [];
          for (let i = 0; i < knots; i++) {
            const { task, next } = nextTask(items, "boss", { phase: ph.id, skin: e.skin }, st);
            if (!task) break;
            served.push(task);
            st = next;
          }
          // an `order` card's answer surface is its chips JOINED into one
          // string, so a Set lookup on it finds nothing and the law would
          // always pass — ask the same way variety.ts asks.
          const hit = served.some((t) =>
            answerSurfaceOf(t).some((s) => [...numbers].some((n) => hasWord(s, n))));
          if (!hit) {
            fail(at, `coverage: the arena promised p3's numbers 1–25, but the ${knots} window(s) a clean fight opens serve `
              + `${served.map((t) => t.id).join(", ")} — not one asks for a number`);
          }
        }
      } else if (e.role === "cage") {
        // PK-R6 · D · WHOSE POOL A PERSON-CAGE OWNS (doc 44 §3.3). A cage that
        // holds a CLASSMATE no longer asks anything itself: ↑ opens the latch,
        // she steps out, and her six-round reawakening is the rescue. So the
        // rescue cards that used to belong to the cage's skin belong to HERS —
        // and the count is exact in both directions, because five rounds would
        // leave her half-grey with the ceremony over and seven would author a
        // round the sim can never raise.
        if (e.params?.classmate !== undefined) {
          const mate = (ph.entities ?? []).find((x) => x.role === "classmate" && x.params?.cage === e.id);
          if (!mate) continue; // the level's own `classmate-pair` law owns this
          const n = boundCards(items, "rescue", mate.skin, ph.id).length;
          if (n !== AWAKEN_ROUNDS) {
            fail(at, `coverage: the reawakening of "${mate.skin}" has ${n} rescue card(s) in ${ph.id} — doc 44 §3.3 runs exactly ${AWAKEN_ROUNDS} rounds`);
          }
          // the pose IS the prompt, so two rounds may not show the same pose:
          // the child would be asked to read one picture twice and the second
          // reading would be about a wrong action they already stopped.
          const poses = boundCards(items, "rescue", mate.skin, ph.id).map((t) => t.stimulus?.art);
          const seen = new Map();
          for (const [i, p] of poses.entries()) {
            if (p === undefined) continue; // the portrait law (11) owns that case
            if (seen.has(p)) fail(at, `reawakening: rounds ${seen.get(p) + 1} and ${i + 1} both show "${p}" — each round is its own painted wrong action`);
            else seen.set(p, i);
          }
          continue;
        }
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
  // R5-W2 · G1: the role→pool mapping used to be re-written here, entity role by
  // entity role, alongside a second copy of it in the coverage law above and a
  // third in sim.ts. It is now one exported table (cards/serving.ts), and the
  // shell's universal quickfire fallback rides inside it — so this law and the
  // sim cannot disagree about who can raise what.
  //
  // Note for the reader who wonders why an unbound quickfire card still passes
  // layer 8 while layer 15b calls it unreachable: they measure different things.
  // Layer 8 asks whether the POOL has a seeable asker (it does — the fallback is
  // real machinery). Layer 15b runs the router and asks whether THIS CARD is ever
  // actually served, which in ch01 it is not, because coverage law 5 guarantees
  // every asker has bound cards of its own and step 3 wins before step 4.
  const raisedUses = raisedUsesOf(level);
  for (const t of items) {
    if (!raisedUses.has(t.use)) {
      fail(`${w}:${t.id}`, `speaker-law: use "${t.use}" is raised by no visible asker in this chapter — the card can only ever be served by nobody`);
    }
  }
}

// ── 11 · THE PORTRAIT LAW (doc 44 §3.1.5, PK-R6 · C) ─────────────────────────
// „A card whose asker has a commissioned portrait must declare it — no silent
// text fallbacks where art exists." The fallback is a real and permanent
// feature (art lands batch by batch, and a card must render before its being is
// painted), which is exactly why it needs a gate: a fallback that is allowed to
// stand in for LANDED art is how a chapter ships text placeholders over 66
// painted stems and nobody notices. So the law is conditional on the disk:
// the moment `<skin>_a` exists, the card owes a declaration.
//
// Three failures, all of them a wrong FACE rather than a missing one:
//   a · art exists for the asker and the card declares none  → silent fallback
//   b · the declared stem is not on disk                     → a broken portrait
//   c · the declared stem is not a cell of any declared skin → someone else's face
function checkPortraits(file, items) {
  const w = path.basename(file);
  for (const t of items) {
    if (t.stimulus?.type !== "entity") continue; // no asker, no portrait
    const skins = t.skins ?? [];
    const painted = skins.filter((s) => paintedStems.has(`${s}_a`));
    const stem = t.stimulus.art;
    if (stem === undefined) {
      if (painted.length > 0) {
        fail(`${w}:${t.id}`, `portrait: [${painted.join(", ")}] is painted (${painted[0]}_a exists) but this card declares no stimulus.art — it would render the text placeholder over commissioned art (doc 44 §3.1.5)`);
      }
      continue;
    }
    if (!paintedStems.has(stem)) {
      fail(`${w}:${t.id}`, `portrait: declares art "${stem}", which is not painted — the card would fall back silently to text`);
      continue;
    }
    if (!skins.some((s) => stem === s || stem.startsWith(`${s}_`))) {
      fail(`${w}:${t.id}`, `portrait: art "${stem}" is not a cell of [${skins.join(", ")}] — the card would wear another being's face`);
    }
    // one card, one face: a card bound to two painted beings can only be right
    // about one of them, and the portrait would lie to whichever one asked
    if (painted.length > 1) {
      fail(`${w}:${t.id}`, `portrait: bound to ${painted.length} painted beings [${painted.join(", ")}] but a card wears ONE face — bind it to the being it shows`);
    }
  }
}

// ── 12 · THE TIMER POLICY (doc 44 §2.9, Decision ④, PK-R6 · C) ───────────────
// The chalk clock survives only where urgency is the fiction. The map itself
// lives in game-paint/src/cards/timer.ts and is IMPORTED here, not restated, so
// the gate and the runtime can never drift apart — the whole reason the policy
// became a module. This layer checks the content against it:
//   a · a calm KIND authored into a timed pool. A restore card is calm by law,
//       so a quickfire restore is a card whose pool says „hurry" and whose
//       machine says „take your time" — one of the two is lying to the child.
//   b · German that PROMISES a clock on a card that will never have one — the
//       countdown-to-nothing lie, pointed the other way (a child told to hurry
//       with no ring on screen has been told something untrue).
//   c · German that promises calm on a card that IS timed.
function checkTimerPolicy(file, items) {
  const w = path.basename(file);
  for (const t of items) {
    const cls = timerClassFor(t.use, t.kind);
    if (cls === "calm" && TIMED_USES.has(t.use)) {
      fail(`${w}:${t.id}`, `timer-policy: kind "${t.kind}" is a calm class (doc 44 §2.9) but the card is authored into the timed pool "${t.use}" — the pool would tell the child to hurry through a card that is never clocked`);
    }
    for (const de of spokenDeOf(t)) {
      const urgent = URGENCY_DE.exec(de);
      if (urgent && cls === "calm") {
        fail(`${w}:${t.id}`, `timer-policy: says „${urgent[0]}" but this card carries no clock (${t.use}/${t.kind} is calm, doc 44 §2.9) — hurry with nothing to hurry against`);
      }
      const calm = CALM_DE.exec(de);
      if (calm && cls === "timed") {
        fail(`${w}:${t.id}`, `timer-policy: says „${calm[0]}" on a card the chalk clock runs out on (${t.use}/${t.kind} is timed) — the line and the ring contradict each other`);
      }
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

// ── SELFTEST (`--selftest`) — the red light of layer 18, seen once per class ──
// Until today this gate had no tamper of its own: eighteen laws and not one
// proof that any of them can go red. PB-15 is the reason the cases below look
// the way they do — a tamper only proves something when it runs on the case
// where RIGHT and PLAUSIBLY-WRONG come apart. So every traitor card here is
// paired with the honest card it is one word away from, and two of the cases
// exist purely to stay GREEN.
//
// The traitors run through the REAL law (`giveawayFailures`), not a copy of it.
if (process.argv.includes("--selftest")) {
  const card = (over) => ({ id: "self.1", use: "encounter", kind: "choice", storyDe: "Sag es ihr!", stimulus: { type: "entity", showsDe: "Ein Ding steht da" }, ...over });
  const laws = (t, fields = new Set()) => giveawayFailures(t, DE_GLOSS, fields).map((e) => e.law);
  const detail = (t) => giveawayFailures(t, DE_GLOSS, new Set()).map((e) => e.detail).join(" | ");
  /** Run the family hygiene over one restore card and hand back what it SAID —
   *  the messages, not a count. */
  const familyMsgs = (colourAskDe) => {
    captured = [];
    checkGiveawayFamilies("selftest", [card({ kind: "restore", name: "pen", nameOptions: ["pen", "book", "chair", "desk"], colour: "yellow", colourOptions: ["yellow", "red", "blue"], colourAskDe })]);
    const out = captured;
    captured = null;
    return out;
  };

  // the honest shape each traitor is one word away from
  const honestOddone = card({ kind: "oddone", storyDe: "Welches Wort ist KEINE Farbe?", items: ["green", "red", "brown", "window"], correct: ["window"], evidence: ["green", "red", "brown", "window"] });
  const honestOrder = card({ id: "boss.o1", kind: "order", storyDe: "Ordne ihre Zahlen!", orderedChips: ["nine", "ten", "eleven", "twelve"], evidence: seededShuffle(["nine", "ten", "eleven", "twelve"], "boss.o1") });
  const honestMistake = card({ kind: "mistake", sentence: ["This", "is", "a", "door", "."], errorIndex: 3, fix: { mode: "replace", correction: "board" }, correctionOptions: ["board", "floor", "chair"], evidence: ["This is a door."], stimulus: { type: "entity", showsDe: "Sie schreibt einen Satz über sich selbst" } });
  const honestMemory = card({ kind: "memory", storyDe: "Finde zu jeder Zahl das Wort!", pairs: [{ a: "3", b: "three" }, { a: "12", b: "twelve" }], evidence: ["3", "12"] });
  // merle.r4, verbatim in shape: the German DOES say „Fenster" and the answer IS
  // „Close the window!" — and it does not spoil anything, because two of the three
  // options say `window` too. The blunt rule this layer replaces flags it.
  const sharedWord = card({ storyDe: "Sag es ihr!", stimulus: { type: "entity", showsDe: "Merle hat das Fenster weit aufgerissen" }, options: ["Open the window!", "Clean the board!", "Close the window!"], answer: "Close the window!" });

  const cases = [
    // ── the four kinds that had no giveaway rule at all ──
    ["order · the board already shows the solved order", laws(card({ ...honestOrder, evidence: ["nine", "ten", "eleven", "twelve"] })), (l) => l.includes("18e") && detail(card({ ...honestOrder, evidence: ["nine", "ten", "eleven", "twelve"] })).includes("SOLVED")],
    ["order · the board carries a chip the card never deals", laws(card({ ...honestOrder, evidence: ["nine", "ten", "eleven", "thirteen"] })), (l) => l.includes("18e")],
    ["oddone · the German names the odd one out", laws(card({ ...honestOddone, storyDe: "Welches Wort ist kein Fenster?" })), (l) => l.includes("18b")],
    ["mistake · the chalk carries the correction", laws(card({ ...honestMistake, evidence: ["This is a board."] })), (l) => l.includes("18e")],
    ["memory · the German says one pair out loud", laws(card({ ...honestMemory, storyDe: "Finde die Zahl zwölf!" })), (l) => l.includes("18b")],
    // ── the leak that really shipped, reproduced (A5's rule: a tamper is worth
    //    most when it is the defect that was live) ──
    ["boss.m1 · showsDe said »Die Tafel« while the answer was `board`", laws(card({ ...honestMistake, stimulus: { type: "entity", showsDe: "Die Tafel schreibt einen Satz über sich selbst" } })), (l) => l.includes("18b")],
    // ── the same-language leak, on a kind that already had a rule ──
    ["choice · the answer word stands in the story line", laws(card({ storyDe: "Sag: Listen!", options: ["Listen!", "Look!", "Come on!"], answer: "Listen!" })), (l) => l.includes("18a")],
    // ── the exemption machinery, in both directions ──
    ["a family that suppresses nothing is dead text", familyMsgs("Ich war wie die Sonne!"), (m) => m.some((x) => x.includes("18c") && x.includes("dead text"))],
    ["an obligation nobody keeps: a bare colour demand", familyMsgs("Gib mir mein Gelb!"), (m) => m.some((x) => x.includes("18d") && x.includes("simileDe"))],
    // ── and the cases that must stay GREEN ──
    ["NON-TAMPER · the four honest boss shapes stay silent", [honestOddone, honestOrder, honestMistake, honestMemory].flatMap((t) => laws(t)), (l) => l.length === 0],
    ["NON-TAMPER · a German word two options share does not spoil", laws(sharedWord), (l) => l.length === 0],
    // ── PB-15: the pair that separates right from plausibly-wrong. Same card,
    //    same German, same answer — only the distractors change. ──
    ["…and the SAME card goes red once the distractors stop sharing it", laws(card({ ...sharedWord, options: ["Clean the board!", "Sit down!", "Close the window!"] })), (l) => l.includes("18b")],
  ];

  failures = 0;
  let bad = 0;
  for (const [name, got, ok] of cases) {
    const pass = ok(got);
    if (!pass) bad++;
    console.log(`  ${pass ? "✓" : "✗"} ${name}${pass ? "" : ` → ${JSON.stringify(got)}`}`);
  }
  // House convention (check-fonts.mjs): a selftest EXITS 0 once it has seen its
  // own red light — it must not paint CI red on every run.
  if (bad > 0) { console.error(`check-game-tasks --selftest: ${bad} case(s) did NOT bite — layer 18 cannot be trusted`); process.exit(1); }
  console.log(`check-game-tasks --selftest: OK — ${cases.length} cases, every red light seen and both green cases still green`);
  process.exit(0);
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
  const level = JSON.parse(fs.readFileSync(levelFile, "utf8"));
  checkAgainstLevel(file, level, parsed.data.items);
  checkGiveawayFamilies(file, parsed.data.items);
  checkNoTwins(file, parsed.data.items);
  checkPortraits(file, parsed.data.items);
  checkTimerPolicy(file, parsed.data.items);
  // 13-17 · THE VARIETY LAWS — one imported pass, so the gate, the audit doc and
  // the unit tests all compute the same numbers from the same code.
  for (const e of varietyErrors({
    chapter: parsed.data.chapter,
    items: parsed.data.items,
    level,
    policy,
    wordbank,
    structureIds,
    lexicon: words,
    today: TODAY,
  })) {
    fail(`${file} ${e.where}`, `${e.law} · ${e.detail}`);
  }
}

if (failures === 0) console.log(`check-game-tasks: OK — ${itemCount} tasks across ${files.length} file(s): schema, grounding, giveaway, register, binding, coverage, length, twins, portraits, timer-policy, form, voice, rhythm, distinctness, coverage-ledger, giveaway-class (all nine kinds, both languages, the board) all green`);
else { console.error(`check-game-tasks: ${failures} failure(s)`); process.exit(1); }
