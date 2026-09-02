// THE VARIETY LAWS (R5-W2 · G1) — layers 13–17 of the card gate.
//
// WHY THIS FILE EXISTS. Koki played chapter 1 and found the cards „repeat in
// form and feel". Measured against the shipped files, that verdict had two
// mechanical halves:
//
//   1. THE SERVER WAS UNFAIR. 18 of 62 field cards could never be served at all
//      — the retired anti-repeat skip advanced the cursor past the card it
//      skipped, and three phase-keyed door cursors all started at zero. Fixed in
//      ./routing.ts; law 15 is what keeps it fixed.
//   2. THE BATTERY WAS TEMPLATED. The exact string „What is it?" sat on 15 cards
//      and „What do you say?" on 13 — 28 of 69, 41 %.
//
// The laws below are the machine form of "curated per level". They exist because
// vigilance decays and structure does not: every one of them is a defect this
// session found by hand, turned into something that hard-fails.
//
// THE TENSION THEY RESOLVE, because a naive reading breaks the game: Koki's own
// B12 (doc 45 §B) demands that a being ask ONE kind of thing — he was annoyed by
// the paintbox alternating between naming and greeting. The variety mandate
// demands the child not meet the same ask over and over. Those pull opposite
// ways only if you look at the wrong unit. The resolution:
//
//   · WITHIN one being the ask is FIXED and only the content varies (law 14).
//   · ACROSS the phase's roster the asks must differ (law 14b/14d).
//   · IN THE SERVED SEQUENCE no ask lands twice running (law 15c).
//
// And the small fact that makes B12 satisfiable at all: three of the nine forms
// are REFERENT-FIXED — their answer is the asker's own identity, so a pool of two
// such cards must repeat itself. That is why today's content drifts. The pencil's
// voice was „name-it", so its second and third cards HAD to become something
// else. B12 was not broken by carelessness; on a referent-fixed voice it was
// unsatisfiable (law 14c).
//
// WHAT IS IMPORTED RATHER THAN RESTATED, following this repo's own precedent
// (the gate imports `timerClassFor` from the runtime so gate and game cannot
// drift): the ROUTER ITSELF. Law 15 does not model the serve, it runs it. If
// routing.ts changes, this law changes with it or goes red.
import { REFERENT_FIXED_FORMS, type GameTaskV2, type TaskForm, seededShuffle } from "@domigo/content-schema";
import type { PaintLevel } from "../level.ts";
import { initRoute, nextTask, resolvePool } from "./routing.ts";
import { HOSTILE_ROLES, allPhasesOf, serveContextsOf } from "./serving.ts";

/** The pools a being raises OUT IN THE WORLD — where these laws apply. The boss
 *  and finale battery is a scripted ritual owned by another session (doc 41 §1's
 *  exemption, STORY_SPINE_CH01 §5's assignment), so it is not asked for a form. */
// R5-W5 · G4: `pickupset` belongs in here. The uniform's naming cards are not a
// scripted ritual like the boss battery — they are ordinary field work: the child
// picked something up out in the world and is asked what it is called. Being a
// field use costs them the field obligations (13a a form, 13c named `exercises`,
// 13e those items really answerable on the card) and earns the chapter the thing
// this whole session exists for: law 17a counts their words as ANSWERED, which is
// what finally discharges the nine dated exceptions.
export const FIELD_USES: ReadonlySet<string> = new Set(["encounter", "quickfire", "door", "rescue", "pickupset"]);

/** L0 · D10 · DIE FELD-FORMEN EINES KAPITELS KOMMEN JETZT MIT DEM KAPITEL.
 *
 *  Hier stand eine Tabelle mit einem Eintrag (`ch01`) und dem Satz »so wächst
 *  sie Kapitel für Kapitel«. Genau daran hätten sich fünf gleichzeitig laufende
 *  Kapitel-Bahnen gestossen: eine gemeinsame Zeile im Motor-Code, in die alle
 *  hineinschreiben. Die Liste steht jetzt in `chNN.policy.json` neben den
 *  Karten und reist als `fieldForms` in dieser Eingabe mit.
 *
 *  Ein Kapitel ohne Liste ist wie bisher »noch nicht entschieden« und wird in
 *  Ruhe gelassen. `use-it` (was TUT es) fehlte ch01 mit Absicht — sein Ensemble
 *  hat keinen Frager, dessen Funktions-Frage mehr als eine wahre Antwort hat. */

export interface VarietyFailure {
  /** the numbered layer + sub-letter, e.g. "15a" — the id an exemption names */
  law: string;
  where: string;
  detail: string;
}

// ── the policy file's shape (scripts/game-tasks-variety-policy.json) ──────────
export interface VarietyFamily {
  id: string;
  match: { use?: string; kind?: string; skins?: string[] };
  exempts: string[];
  reason: string;
  doc?: string;
  obliges?: {
    distinctColourAsk?: boolean;
    distinctStoryDe?: boolean;
    distinctAnswers?: boolean;
    minForms?: number;
  };
}
/** A tuning number is never bare: the reason travels with it, so changing a
 *  threshold is a reviewed diff and not a silent loosening. */
export interface VarietyDial { value: number; reason: string }
export interface VarietyPolicy {
  schema: "taskVarietyPolicy@1";
  dials: {
    minFormsPerPhase: VarietyDial;
    positionBiasMaxShare: VarietyDial;
    positionBiasMinPool: VarietyDial;
    serveProbeCycles: VarietyDial;
  };
  chapters: Record<string, {
    families: VarietyFamily[];
    /** a named group of lexicon words the battery may claim to exercise —
     *  numbers and colours are taught by the unit but are not wordbank ENTRIES,
     *  so without this a wheel card could declare nothing true */
    lexiconClasses?: Record<string, { words: string[]; reason: string }>;
    vocabLedger?: Record<string, { cards: "offered" | "exempt"; reason?: string; until?: string }>;
  }>;
}

export interface WordbankEntry { id: string; en: string; forms: string[] }

export interface VarietyInput {
  chapter: string;
  items: readonly GameTaskV2[];
  level: PaintLevel;
  policy: VarietyPolicy;
  wordbank: readonly WordbankEntry[];
  /** the unit's grammar structure ids (grammar.json `structureId`, de-duped) */
  structureIds: readonly string[];
  /** the lexicon the grounding law reads — a declared lexicon class must be made
   *  of words the unit actually teaches, not words an author wished for */
  lexicon: ReadonlySet<string>;
  /** ISO date, passed IN rather than read: this module must stay pure so its
   *  tests cannot rot with the calendar (and the repo forbids Date.now in the
   *  game tree at all) */
  today: string;
  /** L0 · D10 · die Feld-Formen dieses Kapitels (`chNN.policy.json#fieldForms`).
   *  `undefined` heisst »für dieses Kapitel noch nicht entschieden« — dann
   *  schweigt Gesetz 13a, wie es das für ein Kapitel ohne Tabelleneintrag
   *  immer getan hat. */
  fieldForms?: readonly TaskForm[];
}

// ── small shared helpers ─────────────────────────────────────────────────────
const norm = (s: string) => s.toLowerCase().trim();
/** R5-W2 · H1: exported so the gate's arena-number law asks the question the
 *  same way this file does. An `order` card's answer surface is its chips
 *  JOINED, so a naive `Set.has` on it finds nothing — and a law that silently
 *  finds nothing is a law that always passes. */
export const hasWord = (haystack: string, needle: string): boolean =>
  new RegExp(`(^|[^a-z'])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z'])`, "i").test(haystack);

/** Every string the CHILD must produce or judge to answer this card. Coverage
 *  measured on a prompt would credit words the child only reads; this is the
 *  answerable surface, which is what "exercises" claims. */
export function answerSurfaceOf(t: GameTaskV2): string[] {
  switch (t.kind) {
    case "choice": return [t.answer];
    case "typed": return [t.answer, ...t.accept];
    case "spell": return [t.answer];
    case "wheel": return [t.answer, t.shown];
    case "order": return [t.orderedChips.join(" ")];
    // a belongs-or-not card is answered by understanding ALL of its items — the
    // child cannot pick the stranger without reading the family
    case "oddone": return [...t.items];
    case "mistake": return [t.fix.correction ?? "", ...t.sentence];
    case "memory": return t.pairs.map((p) => p.b);
    case "restore": return [t.name, t.colour];
  }
}

/** The strings a card puts on screen as choosable options — what an "offered"
 *  ledger entry claims. Wider than the answer surface: a distractor is offered,
 *  not answered. */
function optionSurfaceOf(t: GameTaskV2): string[] {
  switch (t.kind) {
    case "choice": return [...t.options];
    case "oddone": return [...t.items];
    case "restore": return [...t.nameOptions, ...t.colourOptions];
    case "wheel": return [...t.values, t.shown];
    case "mistake": return [...t.sentence, ...(t.correctionOptions ?? [])];
    case "order": return [...t.orderedChips];
    case "memory": return t.pairs.flatMap((p) => [p.a, p.b]);
    case "typed": return [t.answer, ...t.accept];
    case "spell": return [t.answer];
  }
}

/** The one answer string a pool-level law compares (B13: a second meeting must
 *  bring new content, and "new" is measured on what the child must produce). */
function answerKeyOf(t: GameTaskV2): string {
  switch (t.kind) {
    case "choice": case "typed": case "spell": case "wheel": return norm(t.answer);
    case "restore": return `${norm(t.name)}|${norm(t.colour)}`;
    case "oddone": return t.correct.map(norm).sort().join("|");
    case "order": return t.orderedChips.map(norm).join("|");
    case "mistake": return `${t.errorIndex}|${norm(t.fix.correction ?? t.fix.mode)}`;
    case "memory": return t.pairs.map((p) => `${norm(p.a)}=${norm(p.b)}`).sort().join("|");
  }
}

const shortId = (id: string) => id.replace(/^g1\.paint\.ch\d\d\./, "");

/**
 * THE LAWS. One pure pass, so the gate, the audit and the tests all compute the
 * same numbers from the same code.
 *
 * Runs the law set TWICE: once honouring the policy's exemptions, once ignoring
 * them. The difference is law 0k — AN EXEMPTION MUST BE LOAD-BEARING. Law 0d
 * already refuses a family that obliges nothing; 0k refuses a family that
 * SUPPRESSES nothing, which is the quieter failure: it reads as a considered
 * relaxation and is really just a sentence nobody has needed since the day it was
 * written. (Its limit, stated rather than hidden: attribution is per law, so if
 * two families exempt the same law and only one is doing work, both pass.)
 */
export function varietyErrors(input: VarietyInput): VarietyFailure[] {
  const honoured = lawsOf(input, true);
  const chap = input.policy.chapters[input.chapter];
  if (chap === undefined) return honoured;
  const bare = lawsOf(input, false);
  const countOf = (list: VarietyFailure[], law: string) => list.filter((e) => e.law === law).length;
  const out = [...honoured];
  for (const f of chap.families) {
    for (const law of f.exempts) {
      if (countOf(bare, law) - countOf(honoured, law) === 0) {
        out.push({
          law: "0k",
          where: `policy:${f.id}`,
          detail: `exempts "${law}", but that law does not fire on this chapter with or without the exemption — an exemption nobody needs reads as a considered relaxation and is really dead text. Delete it, or delete the family`,
        });
      }
    }
  }
  return out;
}

function lawsOf(input: VarietyInput, honourExemptions: boolean): VarietyFailure[] {
  const { chapter, items, level, policy, wordbank, structureIds, lexicon, today } = input;
  const out: VarietyFailure[] = [];
  const fail = (law: string, where: string, detail: string) => out.push({ law, where, detail });

  const chap = policy.chapters[chapter];
  if (chap === undefined) return out; // a chapter the policy has not ruled on is left alone
  const dials = {
    minFormsPerPhase: policy.dials.minFormsPerPhase.value,
    positionBiasMaxShare: policy.dials.positionBiasMaxShare.value,
    positionBiasMinPool: policy.dials.positionBiasMinPool.value,
    serveProbeCycles: policy.dials.serveProbeCycles.value,
  };
  const { fieldForms } = input;
  const field = items.filter((t) => FIELD_USES.has(t.use));
  const phases = allPhasesOf(level);
  const contexts = serveContextsOf(level);

  // which families cover a card, and for which law
  const matches = (f: VarietyFamily, t: GameTaskV2): boolean =>
    (f.match.use === undefined || t.use === f.match.use)
    && (f.match.kind === undefined || t.kind === f.match.kind)
    && (f.match.skins === undefined || (t.skins ?? []).some((s) => f.match.skins!.includes(s)));
  const exempt = (t: GameTaskV2, law: string): boolean =>
    honourExemptions && chap.families.some((f) => f.exempts.includes(law) && matches(f, t));

  // ── 0 · POLICY HYGIENE — an exemption file that rots silences the laws ──────
  // Modelled on scripts/paint-art-allowlist.json's own discipline. The device
  // that keeps this file honest: AN EXEMPTION BUYS A STRICTER OBLIGATION, NEVER
  // A PASS. A family that relaxes a law and demands nothing back is a hole.
  for (const f of chap.families) {
    const covered = items.filter((t) => matches(f, t));
    if (covered.length === 0) fail("0a", `policy:${f.id}`, `family matches no card any more — a stale exemption hides the next gap`);
    if (f.reason.trim().length === 0) fail("0b", `policy:${f.id}`, "a family must say WHY (the reason is the review surface)");
    if (f.exempts.length === 0) fail("0c", `policy:${f.id}`, "a family that exempts nothing is not an exemption");
    const obligations = Object.keys(f.obliges ?? {}).length;
    if (obligations === 0) {
      fail("0d", `policy:${f.id}`, `exempts [${f.exempts.join(" · ")}] and obliges nothing — an exemption buys a stricter obligation, never a pass`);
    }
    // the obligations themselves
    const o = f.obliges ?? {};
    if (o.distinctStoryDe === true) {
      const seen = new Map<string, string>();
      for (const t of covered) {
        const k = norm(t.storyDe);
        const first = seen.get(k);
        if (first !== undefined) fail("0e", `policy:${f.id}`, `obliges distinct lines, but ${shortId(first)} and ${shortId(t.id)} both say „${t.storyDe}"`);
        else seen.set(k, t.id);
      }
    }
    if (o.distinctAnswers === true) {
      const seen = new Map<string, string>();
      for (const t of covered) {
        const k = answerKeyOf(t);
        const first = seen.get(k);
        if (first !== undefined) fail("0f", `policy:${f.id}`, `obliges distinct answers, but ${shortId(first)} and ${shortId(t.id)} both answer „${k}"`);
        else seen.set(k, t.id);
      }
    }
    if (o.distinctColourAsk === true) {
      const seen = new Map<string, string>();
      for (const t of covered) {
        if (t.kind !== "restore") continue;
        const k = norm(t.colourAskDe);
        const first = seen.get(k);
        if (first !== undefined) fail("0g", `policy:${f.id}`, `obliges one image-simile per being, but ${shortId(first)} and ${shortId(t.id)} both say „${t.colourAskDe}"`);
        else seen.set(k, t.id);
      }
    }
    if (o.minForms !== undefined) {
      const forms = new Set(covered.map((t) => t.form).filter((f2): f2 is TaskForm => f2 !== undefined));
      if (forms.size < o.minForms) {
        fail("0h", `policy:${f.id}`, `obliges ≥${o.minForms} distinct asks and the set makes ${forms.size} [${[...forms].join(" · ")}] — the exemption is not a pass`);
      }
    }
  }
  for (const [id, cls] of Object.entries(chap.lexiconClasses ?? {})) {
    if (cls.words.length === 0) fail("0i", `policy:${id}`, "a lexicon class with no words claims nothing");
    for (const w of cls.words) {
      if (!lexicon.has(norm(w))) fail("0j", `policy:${id}`, `claims "${w}", which the unit lexicon does not teach`);
    }
  }

  // ── 13 · THE FORM LAW — every field card declares what it asks ─────────────
  const classIds = new Set(Object.keys(chap.lexiconClasses ?? {}));
  const wbById = new Map(wordbank.map((w) => [w.id, w]));
  for (const t of field) {
    const w = `${chapter}:${shortId(t.id)}`;
    if (t.form === undefined) {
      fail("13a", w, `a "${t.use}" card is asked out in the world and must declare its form (one of: ${fieldForms?.join(" · ") ?? "—"}) — the palette caps this chapter at four kinds, so form is the only axis variety can live on (doc 41 §1)`);
    } else if (fieldForms !== undefined && !fieldForms.includes(t.form)) {
      fail("13b", w, `this chapter's field may ask [${fieldForms.join(" · ")}] — "${t.form}" is not one of them`);
    }
    if (t.exercises === undefined) {
      fail("13c", w, "a field card must name the unit items it makes the child produce (`exercises`) — coverage measured on prose is coverage nobody can trust");
      continue;
    }
    const surface = answerSurfaceOf(t).join(" ");
    for (const id of t.exercises) {
      const entry = wbById.get(id);
      const cls = chap.lexiconClasses?.[id];
      if (entry === undefined && cls === undefined && !structureIds.includes(id)) {
        fail("13d", w, `exercises "${id}", which is neither a wordbank entry, nor a grammar structure of this unit, nor a declared lexicon class`);
        continue;
      }
      // a grammar structure is a SHAPE, not a token — nothing to string-match
      if (entry === undefined && cls === undefined) continue;
      const forms = entry !== undefined ? entry.forms : cls!.words;
      if (!forms.some((f) => hasWord(surface, norm(f)))) {
        fail("13e", w, `claims "${id}" (${forms.join(" | ")}) but no accepted form of it appears in this card's own answer — the declaration would credit coverage the child never produces`);
      }
    }
  }

  // ── 14 · THE VOICE LAW (B12) — one being, one ask, content varying ─────────
  // A skin is DUAL-STATE when it is both in the way and drained (the eraser
  // hops, the pen runs, the exercise book flutters — STORY_SPINE_CH01 §2). That
  // is DERIVED from the level and the cards rather than declared, so it cannot
  // be claimed by a card that has not earned it: hostile role + a restore card.
  const hostileSkins = new Set<string>();
  for (const ph of phases) for (const e of ph.entities ?? []) if (HOSTILE_ROLES.includes(e.role)) hostileSkins.add(e.skin);
  const restoreSkins = new Set(items.filter((t) => t.kind === "restore").flatMap((t) => t.skins ?? []));
  const dualState = new Set([...hostileSkins].filter((s) => restoreSkins.has(s)));

  const bySkin = new Map<string, GameTaskV2[]>();
  for (const t of field) {
    for (const s of t.skins ?? []) {
      const list = bySkin.get(s);
      if (list === undefined) bySkin.set(s, [t]);
      else list.push(t);
    }
  }
  // 14a is B12's own scope: „pro Wesen(styp) feste Aufgaben-Profile" — the
  // CREATURES that come at the child, which is what the paintbox finding was
  // about. It deliberately does NOT govern the structural askers:
  //   · the DOOR is the chapter's recurring gate, and law M-E (doc 41 §1)
  //     positively REQUIRES its series to cover the unit's imperatives, questions
  //     and negations — one voice would repeal a law that outranks this one;
  //   · a CAGE is a container, and its four instances hold four different things.
  // Scoping this by hand would be a second table; it is read off the level's own
  // roles instead, the same way `dualState` is.
  const voiceSkins = new Set([...hostileSkins, ...restoreSkins]);
  for (const [skin, cards] of bySkin) {
    if (!voiceSkins.has(skin)) continue;
    const forms = [...new Set(cards.map((t) => t.form).filter((f): f is TaskForm => f !== undefined))];
    const allowed = dualState.has(skin) ? 2 : 1;
    if (forms.length > allowed && !cards.some((t) => exempt(t, "14a"))) {
      const extra = dualState.has(skin) ? ' (a dual-state being may add exactly one: "name-it", for its colour card)' : "";
      fail("14a", `${chapter}:${skin}`, `this being asks ${forms.length} different things [${forms.join(" · ")}] — a being has ONE voice${extra}. Vary its CONTENT, not its ask (doc 45 B12: the paintbox alternated between naming and greeting)`);
    }
    if (dualState.has(skin) && forms.length === 2 && !forms.includes("name-it")) {
      fail("14a", `${chapter}:${skin}`, `is drained as well as in the way, so its second ask must be the colour card's "name-it" — it asks [${forms.join(" · ")}]`);
    }
  }
  // 14c · a POOL may not hold two cards of the same referent-fixed ask: their
  // answer is the being's own identity, so the second one either repeats the
  // first or answers with something the being is not.
  //
  // Computed on the resolved POOL, not on the skin — a correction this session
  // needed and the shipped content exposed: all four cages share the skin
  // `satchel` (it is the cage's painted art), but they stand in four different
  // phases holding four different things, so grouping by skin accused the sound
  // system, the tablet, the chair and the class photo of being one being asking
  // three times. The pool is the unit a child actually meets.
  for (const c of contexts) {
    const { pool, key } = resolvePool(items, c.use, { phase: c.phase, skin: c.skin });
    for (const f of new Set(pool.map((t) => t.form))) {
      if (f === undefined || !REFERENT_FIXED_FORMS.has(f)) continue;
      const same = pool.filter((t) => t.form === f);
      if (same.length > 1 && !same.some((t) => exempt(t, "14c"))) {
        fail("14c", `${chapter}:${key}`, `asks "${f}" on ${same.length} cards [${same.map((t) => shortId(t.id)).join(" · ")}] — that ask is answered by the being's own identity, so a second card must either repeat the answer or name something this being is not. A being met more than once needs a content-variable ask`);
      }
    }
  }
  // 14b · the phase's ROSTER is the variety — two hostiles asking the same thing
  // is one encounter twice. Scoped to hostiles on purpose: the one-shot gestures
  // (a restore for every drained object, a cage's state-it) are deliberately uniform.
  for (const ph of phases) {
    const voice = new Map<string, string>();
    for (const e of ph.entities ?? []) {
      if (!HOSTILE_ROLES.includes(e.role)) continue;
      const cards = (bySkin.get(e.skin) ?? []).filter((t) => t.phases === undefined || t.phases.includes(ph.id));
      // a dual-state being's shared "name-it" colour card is not its voice
      const f = cards.map((t) => t.form).find((x): x is TaskForm => x !== undefined && !(dualState.has(e.skin) && x === "name-it"));
      if (f === undefined) continue;
      const other = voice.get(f);
      if (other !== undefined && other !== e.skin) {
        fail("14b", `${chapter}:${ph.id}`, `"${other}" and "${e.skin}" both ask "${f}" here — the phase's beings ARE the variety`);
      } else voice.set(f, e.skin);
    }
    // 14d · a room asks the child several different things
    // R5-W5 · G4: a declared family is filtered OUT of the room's variety tally,
    // the same way it is honoured everywhere else. Without this the uniform's
    // nine naming cards — unbound, because a piece can be found in any room —
    // counted into EVERY phase and made the Kleckskammer look like a room that
    // asks one thing nine times. The room's own asks are what this law is about;
    // a pool that a family has already justified is not part of that question.
    const here = field
      .filter((t) => t.phases === undefined || t.phases.includes(ph.id))
      .filter((t) => !exempt(t, "14d"));
    const forms = new Set(here.map((t) => t.form).filter((f): f is TaskForm => f !== undefined));
    // A room cannot ask four different things with fewer than four cards, and
    // demanding it would be a law asking for the impossible. The arena is the real
    // case: its battery is the boss ritual, which this law does not govern, so it
    // carries exactly one field card (the class-photo cage).
    if (here.length >= dials.minFormsPerPhase && forms.size < dials.minFormsPerPhase) {
      fail("14d", `${chapter}:${ph.id}`, `presents only ${forms.size} distinct ask(s) [${[...forms].join(" · ")}] across ${here.length} cards — the dial asks for ${dials.minFormsPerPhase} (scripts/game-tasks-variety-policy.json)`);
    }
  }
  // 14e · a dual-state being's colour card must be FIRST in its pool. sim.ts
  // redeems a being on ANY solved encounter card, so anything served before the
  // restore floods the colour back without the colour ever being asked.
  for (const skin of dualState) {
    for (const ph of phases) {
      const { pool } = resolvePool(items, "encounter", { phase: ph.id, skin });
      if (pool.length < 2) continue;
      const at = pool.findIndex((t) => t.kind === "restore");
      if (at > 0) {
        fail("14e", `${chapter}:encounter|${ph.id}|${skin}`, `is drained as well as in the way, so its colour card must be the FIRST of its pool (it is #${at + 1} of ${pool.length}) — sim.ts redeems the being on any solved card, so anything served before it gives the colour back unasked`);
      }
    }
  }

  // ── 15 · THE RHYTHM LAW — computed on the SERVED sequence, not the file ────
  // The router is imported and RUN, not modelled (the timer.ts precedent). If
  // routing.ts regresses, this law goes red with it.
  const firstServeAt = new Map<string, string[]>(); // card id → pool keys where it is served first
  const seenKeys = new Set<string>();
  const reachable = new Set<string>();
  for (const c of contexts) {
    const { pool, key } = resolvePool(items, c.use, { phase: c.phase, skin: c.skin });
    if (pool.length === 0 || seenKeys.has(key)) continue;
    seenKeys.add(key);
    // a ceremony is asked for BY INDEX (./routing.ts orderedTask), so every one
    // of its cards is reached by construction and it has no rhythm to check
    if (c.mode === "ordered") { for (const t of pool) reachable.add(t.id); continue; }
    let st = initRoute();
    const served: GameTaskV2[] = [];
    for (let n = 0; n < pool.length * dials.serveProbeCycles; n++) {
      const r = nextTask(items, c.use, { phase: c.phase, skin: c.skin }, st);
      st = r.next;
      if (r.task === null) break;
      served.push(r.task);
      reachable.add(r.task.id);
    }
    const stranded = pool.filter((t) => !served.some((s) => s.id === t.id)).map((t) => shortId(t.id));
    if (stranded.length > 0) {
      fail("15a", `${chapter}:${key}`, `strands ${stranded.join(", ")} — ${pool.length * dials.serveProbeCycles} requests never serve them. Authored variety that is never served is not variety`);
    }
    if (served[0] !== undefined) {
      const l = firstServeAt.get(served[0].id) ?? [];
      l.push(key);
      firstServeAt.set(served[0].id, l);
    }
    // 15c · no ask twice in a row — but only where a different ORDER could avoid
    // it. This is the law made satisfiable, in two corrections that both came out
    // of authoring p1 against it rather than out of theory:
    //
    //   1. It first fired on every consecutive pair of a SINGLE-VOICE pool, which
    //      made it mutually exclusive with law 14a — B12 fixes one ask per being,
    //      so a creature with two cards must serve that ask twice running.
    //   2. The obvious patch ("only pools with two or more asks") was still wrong.
    //      A pool is a CYCLE, and on a cycle an arrangement with no equal
    //      neighbours exists only when no single ask holds more than ⌊n/2⌋ of the
    //      places. A three-card pool of two commands and one question therefore
    //      cannot avoid an adjacency in ANY order — demanding it would only teach
    //      an author to pad the pool for the checker.
    //
    // So the law asks the honest question: is THIS adjacency avoidable? If it is,
    // the fix is a file reorder and the message says so.
    const counts = new Map<TaskForm, number>();
    for (const t of pool) if (t.form !== undefined) counts.set(t.form, (counts.get(t.form) ?? 0) + 1);
    const worst = Math.max(0, ...counts.values());
    const arrangeable = pool.length >= 2 && worst <= Math.floor(pool.length / 2);
    if (arrangeable) {
      for (let n = 1; n < served.length; n++) {
        const a = served[n - 1]!;
        const b = served[n]!;
        if (a.form !== undefined && a.form === b.form && a.id !== b.id && !exempt(b, "15c")) {
          fail("15c", `${chapter}:${key}`, `serves "${a.form}" twice running (${shortId(a.id)} → ${shortId(b.id)}) — and this pool CAN be ordered so that never happens (no ask holds more than ${Math.floor(pool.length / 2)} of its ${pool.length} places). Reorder the file`);
          break;
        }
      }
    }
    // 15d · a pool that only ever asks one thing needs a reason on the record
    const forms = new Set(pool.map((t) => t.form).filter((f): f is TaskForm => f !== undefined));
    if (pool.length > 1 && forms.size === 1 && !pool.some((t) => exempt(t, "15d"))) {
      const only = [...forms][0];
      const isOneBeingsVoice = c.skin !== undefined && HOSTILE_ROLES.includes(c.role);
      if (!isOneBeingsVoice) {
        fail("15d", `${chapter}:${key}`, `is ${pool.length} cards that all ask "${only}" and belongs to no single being's voice — declare a family in scripts/game-tasks-variety-policy.json or vary the ask`);
      }
    }
  }
  // 15b · a card nothing can ever raise. The unbound pool only wins when a
  // being has no cards of its own (routing.ts step 4), and the coverage law
  // guarantees every asker HAS its own — so an unbound card is normally
  // shadowed by construction. Dead content is exactly where an unreviewed card
  // hides, which is why the speaker law exists at all.
  for (const t of field) {
    if (reachable.has(t.id)) continue;
    if (t.skins === undefined) {
      fail("15b", `${chapter}:${shortId(t.id)}`, `this unbound "${t.use}" card can never be served — every ${t.use} asker in this chapter has bound cards of its own, so the fallback pool is shadowed (routing.ts step 3 wins before step 4). Bind it to a being or retire it`);
    } else {
      fail("15b", `${chapter}:${shortId(t.id)}`, `no being in this chapter can raise this card — it is bound to [${t.skins.join(" · ")}] for "${t.use}", and no such asker stands in ${t.phases?.join("/") ?? "any phase"}`);
    }
  }
  // 15e · the same card greeting the child at two different doors
  for (const [id, keys] of firstServeAt) {
    if (keys.length > 1) {
      fail("15e", `${chapter}:${shortId(id)}`, `is the FIRST card served at ${keys.join(" AND ")} — the child meets the identical card at each of them. Bind it to a phase, or let the pools share one cursor`);
    }
  }

  // ── 16 · THE DISTINCTNESS LAW (B13) — a second meeting brings new content ──
  for (const key of seenKeys) {
    const [use, phaseKey, skinKey] = key.split("|") as [string, string, string];
    const ph = phaseKey === "*" ? (phases[0]?.id ?? "") : phaseKey;
    const { pool } = resolvePool(items, use, { phase: ph, skin: skinKey === "*" ? undefined : skinKey });
    const answers = new Map<string, string>();
    const prompts = new Map<string, string>();
    for (const t of pool) {
      const a = answerKeyOf(t);
      const firstA = answers.get(a);
      if (firstA !== undefined && !exempt(t, "16a")) {
        fail("16a", `${chapter}:${key}`, `${shortId(firstA)} and ${shortId(t.id)} are in the same pool and both answer „${a}" — a second meeting must bring new content (doc 45 B13)`);
      } else answers.set(a, t.id);
      if (t.promptEn !== undefined && t.promptEn.trim() !== "") {
        const p = norm(t.promptEn);
        const firstP = prompts.get(p);
        if (firstP !== undefined && !exempt(t, "16c")) {
          fail("16c", `${chapter}:${key}`, `${shortId(firstP)} and ${shortId(t.id)} in one pool both ask „${t.promptEn}" — one pool, one question per card`);
        } else prompts.set(p, t.id);
      }
    }
    // 16e · the answer's ON-SCREEN position, computed with the real shuffle
    const positioned = pool.filter((t) => t.kind === "choice");
    if (positioned.length >= dials.positionBiasMinPool) {
      const at = new Map<number, number>();
      for (const t of positioned) {
        if (t.kind !== "choice") continue;
        const i = seededShuffle(t.options, t.id).indexOf(t.answer);
        at.set(i, (at.get(i) ?? 0) + 1);
      }
      for (const [pos, n] of at) {
        const share = n / positioned.length;
        if (share > dials.positionBiasMaxShare) {
          fail("16e", `${chapter}:${key}`, `${n} of ${positioned.length} cards put the answer at option ${pos + 1} ON SCREEN (the real seededShuffle of the authored order) — a child who always taps ${pos + 1} would be right ${Math.round(share * 100)} % of the time. Permute the authored options`);
        }
      }
    }
  }
  // 16f · THE LENGTH SHORTCUT (found by two independent blind solvers on the p1
  // calibration battery, R5-W2 · G1). Both reported, without seeing each other or
  // the answer key, that "tap the longest option" won on 7 of 12 cards. That is a
  // validity defect, not a nitpick: a child can clear the deck without reading the
  // English, and the one card where the habit fails punishes them for having
  // learned it. Measured CHAPTER-WIDE, because "can I beat this deck by length?"
  // is a question about the deck, not about one pool.
  //
  // `pick-correct-form` is excluded BY CONSTRUCTION, with its reason stated here
  // rather than bought as a policy exemption: what makes „It's a book." the
  // correct rendering — the apostrophe and the verb — is also what makes it the
  // longest string. The law cannot ask that card to hide its own lesson.
  const gameable = (opts: readonly string[], answer: string, pick: (a: number, b: number) => boolean): boolean => {
    const len = answer.length;
    return opts.every((o) => o === answer || pick(len, o.length));
  };
  const measurable = field.filter((t) => (t.kind === "choice" || t.kind === "restore") && t.form !== "pick-correct-form");
  if (measurable.length >= dials.positionBiasMinPool) {
    for (const [label, pick] of [["longest", (a: number, b: number) => a > b], ["shortest", (a: number, b: number) => a < b]] as const) {
      const hits = measurable.filter((t) =>
        t.kind === "choice" ? gameable(t.options, t.answer, pick)
          : t.kind === "restore" ? gameable(t.nameOptions, t.name, pick)
            : false);
      const share = hits.length / measurable.length;
      if (share > dials.positionBiasMaxShare) {
        fail("16f", `${chapter}:battery`, `on ${hits.length} of ${measurable.length} cards the right answer is simply the ${label} option — a child who always taps the ${label} one is right ${Math.round(share * 100)} % of the time without reading any English. Cards: ${hits.map((t) => shortId(t.id)).join(", ")}`);
      }
    }
  }

  // 16b/16d · chapter-wide: the line the child reads aloud is the card's face
  const lines = new Map<string, string>();
  const colourAsks = new Map<string, string>();
  for (const t of field) {
    const k = norm(t.storyDe);
    const first = lines.get(k);
    if (first !== undefined && !exempt(t, "16b")) {
      fail("16b", `${chapter}:${shortId(t.id)}`, `says the same line as ${shortId(first)}: „${t.storyDe}" — declare a uniform family in the policy or write a second line`);
    } else lines.set(k, t.id);
    if (t.kind === "restore") {
      const c = norm(t.colourAskDe);
      const firstC = colourAsks.get(c);
      if (firstC !== undefined && !exempt(t, "16d")) {
        fail("16d", `${chapter}:${shortId(t.id)}`, `repeats ${shortId(firstC)}'s colour ask „${t.colourAskDe}" — the colour ask is an image-simile, one per being (STORY_SPINE_CH01 §5)`);
      } else colourAsks.set(c, t.id);
    }
  }

  // ── 17 · THE COVERAGE LEDGER (B8, the card half) ───────────────────────────
  // Koki: „zwei Bleistifte — warum nicht zwei unterschiedliche Dinge? Vergeudet."
  // Every taught item of the unit is in exactly one state — ANSWERED by a card,
  // OFFERED as a distractor, or EXEMPT with a reason and an expiry. A gap that is
  // declared is a decision; an undeclared gap is an accident.
  const ledger = chap.vocabLedger ?? {};
  const answeredIds = new Set(field.flatMap((t) => t.exercises ?? []));
  const optionBlob = field.map((t) => optionSurfaceOf(t).join(" ")).join(" ");
  for (const entry of wordbank) {
    const declared = ledger[entry.id];
    if (answeredIds.has(entry.id)) {
      if (declared !== undefined) {
        fail("17c", `${chapter}:ledger`, `still declares "${entry.id}" (${declared.cards}), which a card now answers — remove the entry, a stale exemption hides the next gap`);
      }
      continue;
    }
    if (declared === undefined) {
      fail("17a", `${chapter}:ledger`, `unit item "${entry.en}" (${entry.id}) is exercised by no card and carries no ledger entry — every core word is answered, offered, or declared (doc 45 B8)`);
      continue;
    }
    if (declared.reason === undefined || declared.reason.trim() === "" || declared.until === undefined) {
      fail("17f", `${chapter}:ledger`, `entry "${entry.id}" needs a reason AND an until (see scripts/paint-art-allowlist.json for the form)`);
    } else if (declared.until < today) {
      fail("17e", `${chapter}:ledger`, `the entry for "${entry.id}" expired ${declared.until} — answer it or renew it with a fresh reason`);
    }
    if (declared.cards === "offered" && !entry.forms.some((f) => hasWord(optionBlob, norm(f)))) {
      fail("17b", `${chapter}:ledger`, `declares "${entry.id}" offered, but no card puts it on screen as an option at all — it is absent, not offered`);
    }
  }
  for (const id of Object.keys(ledger)) {
    if (!wbById.has(id)) fail("17d", `${chapter}:ledger`, `entry "${id}" is not a wordbank entry of this unit`);
  }
  // 17g · law M-E, where it is actually measurable: the door series was supposed
  // to carry the unit's imperatives, questions and negations. Measured on the
  // chapter's exercised STRUCTURES rather than on one pool, because a series a
  // child touches once per phase cannot carry a coverage set on its own.
  for (const sid of structureIds) {
    if (!answeredIds.has(sid)) {
      fail("17g", `${chapter}:ledger`, `grammar structure "${sid}" is exercised by no field card — the unit has ${structureIds.length} structures and the chapter drills all of them (doc 41 §1 law M-E)`);
    }
  }

  return out;
}
