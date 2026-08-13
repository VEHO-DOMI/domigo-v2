/**
 * gameTasks@2 — the Painted-Book in-game task contract (PB-T6, Opus build lane).
 *
 * Supersedes the inline gameTasks@1 (choice|typed only, in apps/web/lib/
 * paint-content.ts). Lives in @domigo/content-schema — SHARED, not server-only —
 * so the client card kit (packages/game-paint/src/cards) imports these types and
 * the pure projection without a server-only cycle; the server loader imports the
 * zod schema for load-time validation.
 *
 * Design (frozen: docs/design/g1/paint/ch01-dossiers/tasks.md + README G1–G13):
 *  - kind is a DISCRIMINATED UNION. ch01 uses: choice · wheel · spell · order ·
 *    oddone · mistake · typed · memory · restore. match/sort/slider are deferred
 *    to ch02/03/04 (G12) and join the union when those chapters build.
 *  - PK-R3b · R3-15: `restore` is ch01's CORE mechanic (doc 41 §2) — the
 *    two-step colour card. Which chapter may serve which kinds IN THE FIELD is
 *    the distribution map (doc 41 §1), enforced by scripts/check-game-tasks.mjs.
 *  - stimulus is REQUIRED (F22/G10): every card must state what on screen carries
 *    the answer — a story line, a painted image, or the encountered creature.
 *  - firstLetter/length are DERIVED from answer at render (deriveGapHints), never
 *    authored — killing the v1 drift class.
 *  - cross-field laws live ONCE in taskInvariantErrors(), reused by the zod
 *    superRefine AND scripts/check-game-tasks.mjs (guardrails by construction).
 */
import { z } from "zod";

// ── stimulus: the on-screen carrier of the answer (the F22/G10 law) ──────────
export const TaskStimulus = z.discriminatedUnion("type", [
  // the German story line (storyDe) is the whole context
  z.object({ type: z.literal("text") }),
  // a painted picture is the context (stem = the pb-* art stem; altDe describes it
  // for the blind-solve projection + accessibility)
  z.object({ type: z.literal("image"), stem: z.string().min(1), altDe: z.string().min(1) }),
  // the encountered creature displays a datum (e.g. the moth carrying its number)
  //
  // PK-R6 · C · THE PORTRAIT BINDING (doc 44 §3.1.5). `art` names the painted
  // stem the card wears as the asker's face — WHICH CELL of the being is doing
  // the talking, which is an authoring decision (the Tafel's telegraph pose asks
  // a boss window; her idle asks an encounter), not something an engine may
  // guess. It is optional in the SCHEMA because art lands batch by batch and a
  // card must render before its being is painted; it is mandatory in the GATE
  // (scripts/check-game-tasks.mjs layer 11) the moment the asker's art exists,
  // so „silent text fallback where art exists" cannot ship.
  z.object({ type: z.literal("entity"), showsDe: z.string().min(1), art: z.string().min(1).optional() }),
]);
export type TaskStimulus = z.infer<typeof TaskStimulus>;

export const TaskHints = z.object({
  deDesc: z.string().optional(), // shown at wrong-attempt 1 (the German description)
  deWord: z.string().optional(), // shown at wrong-attempt 2 (the German word/tip)
});
export type TaskHints = z.infer<typeof TaskHints>;

export const TASK_USES = ["quickfire", "encounter", "door", "rescue", "boss", "finale", "bonus"] as const;

// ── THE FORM AXIS (R5-W2 · G1) ───────────────────────────────────────────────
// WHY A SECOND AXIS EXISTS AT ALL. Koki played ch01 and found the cards „repeat
// in form and feel". The kind axis cannot answer that, and not by accident: the
// distribution map (doc 41 §1) caps ch01's field at FOUR kinds on purpose — a
// six-year-old may not be handed the whole card kit in their first twenty
// minutes. So with kind as the only declared axis, „variety" is not merely
// unmeasured, it is inexpressible. `form` is what a card ASKS OF THE CHILD,
// independent of the widget it asks through.
//
// It is also the axis that reconciles the mandate with Koki's own B12 (doc 45
// §B): one being, one ask, content varying — what annoyed him was the paintbox
// alternating between naming and greeting, two different speech acts from one
// creature. B12 therefore fixes the FORM per being (./cards/variety.ts layer 14)
// and variety lives across the phase's roster and in the served rhythm. A being
// that carries both a restore card and a choice card has not changed its ask.
//
// Deriving this from the prompt string was considered and rejected on a count:
// 37 of the shipped 69 cards have no `promptEn` at all (every restore, wheel and
// oddone), so the form of the majority of the battery is in no string.
export const TASK_FORMS = [
  /** pick the being's English name as a bare label — „a pencil" */
  "name-it",
  /** produce a whole to-be sentence about it, either polarity — „It's a tablet" / „It isn't a window" */
  "state-it",
  /** three renderings of the SAME sentence, one grammatically right. The only
   *  orthography-shaped ask the grounding law permits: every option must be a
   *  real lexicon entry, which is why „It's a book. / Its a book. / It a book."
   *  passes (it · its · it's are all in the unit) and a misspelling never can. */
  "pick-correct-form",
  /** tell someone to do or not do something; the answer is an imperative, either
   *  polarity (polarity is CONTENT, like the number on a wheel — that is what
   *  keeps Merle's six rounds single-voiced) */
  "command",
  /** the routine politeness move, initiated or answered — „Hello!" / „I'm fine, thanks." */
  "social-formula",
  /** produce the QUESTION, not the answer — „What's your name?" */
  "ask-it",
  /** how many are there; the answer is a number word */
  "count-it",
  /** the being shows a number one way, the child gives the other (the direction
   *  is the wheel's own `variant` — not restated here) */
  "number-transcode",
  /** set-membership judgement against a named category (a place, or a word class) */
  "belongs-or-not",
] as const;
export type TaskForm = (typeof TASK_FORMS)[number];

// ── THE BINDING (PB-F1 / F2-1) ───────────────────────────────────────────────
// A card is SERVED for a being. `skins` names the entity skins this card may
// answer (the pencil creature's card must say "pencil"); `phases` scopes it to
// the phases where that being lives, so p3 cards can never leak into the arena
// (F2-21). Both optional: a card with NO skins is the deliberate UNBOUND
// fallback pool — and, by the binding law below, may not claim a being on
// screen. The router (game-paint/src/cards/routing.ts) is the only consumer.
const Binding = {
  skins: z.array(z.string().min(1)).min(1).optional(),
  phases: z.array(z.string().min(1)).min(1).optional(),
};

// fields shared by every kind (spread into each member — discriminatedUnion needs
// plain object members, so cross-field checks live in taskInvariantErrors, not here)
const base = {
  id: z.string().min(1),
  use: z.enum(TASK_USES),
  stimulus: TaskStimulus,
  storyDe: z.string().min(1), // the German framing / instruction line (always present)
  promptEn: z.string().optional(), // the English question, when the task asks one
  hints: TaskHints.optional(),
  grounding: z.string().optional(), // author note (which unit item this exercises)
  // ── THE FORM + EXERCISES DECLARATION (R5-W2 · G1) ──────────────────────────
  // `form` is WHAT the card asks of the child (see TASK_FORMS); `exercises` names
  // the unit items it makes the child PRODUCE — wordbank ids or a grammar
  // structureId. Both optional in the SCHEMA and mandatory in the GATE for the
  // field pools only (encounter · quickfire · door · rescue), deliberately the
  // same shape `stimulus.art` already uses: the boss and finale battery belongs
  // to another session, and a schema-level requirement would block it.
  //
  // `exercises` exists because coverage measured on prose is coverage nobody can
  // trust. The first pass at this session measured „35 of 68 taught items are
  // exercised" by substring-matching answer surfaces — which over-counts (a
  // search for „pencil" hits inside „pencil sharpener") and under-counts in
  // both directions. A declaration the gate VERIFIES against the card's own
  // answer surface is checkable; a substring sweep is an estimate wearing a
  // number's clothes.
  form: z.enum(TASK_FORMS).optional(),
  exercises: z.array(z.string().min(1)).min(1).optional(),
  // ── THE BOSS-EVIDENCE FIELD (doc 41 §4, R3-12) ────────────────────────────
  // The exact strings the guardian WRITES on its own board before the card
  // opens. Koki's 11.48.59 and 11.50.26 were unanswerable by looking: the card
  // said „die Tafel kritzelt vier Wörter auf sich" and the board was blank, so
  // the question referred to something that did not exist. A boss card of an
  // evidence kind must now put its material in the world first.
  evidence: z.array(z.string().min(1)).min(1).optional(),
  ...Binding,
};

// ── the kinds ────────────────────────────────────────────────────────────────
const ChoiceTask = z.object({
  ...base,
  kind: z.literal("choice"),
  options: z.array(z.string().min(1)).length(3), // exactly 3, A1 load
  answer: z.string().min(1), // must be one of options (taskInvariantErrors)
});
const TypedTask = z.object({
  ...base,
  kind: z.literal("typed"),
  answer: z.string().min(1),
  accept: z.array(z.string().min(1)).default([]), // declared variants (rubber/eraser)
});
const SpellTask = z.object({
  ...base,
  kind: z.literal("spell"),
  answer: z.string().min(1), // a single token (no spaces)
  extraLetters: z.string().default(""), // distractor letters mixed into the tray
});
const OrderTask = z.object({
  ...base,
  kind: z.literal("order"),
  orderedChips: z.array(z.string().min(1)).min(2), // the answer IS this order
});
const OddOneTask = z.object({
  ...base,
  kind: z.literal("oddone"),
  select: z.enum(["odd", "all"]).default("odd"), // odd-one-out vs find-all-that-belong
  items: z.array(z.string().min(1)).min(3),
  correct: z.array(z.string().min(1)).min(1), // ⊆ items
});
const MistakeTask = z.object({
  ...base,
  kind: z.literal("mistake"),
  sentence: z.array(z.string().min(1)).min(2), // words/tokens, each tappable
  errorIndex: z.number().int().nonnegative(), // the wrong word's index
  fix: z.object({
    mode: z.enum(["replace", "remove", "add"]),
    correction: z.string().optional(), // required for replace/add
    insertAfter: z.number().int().optional(), // for add: insert after this index
  }),
  correctionOptions: z.array(z.string().min(1)).length(3).optional(), // the quick fix choices
});
const WheelTask = z.object({
  ...base,
  kind: z.literal("wheel"),
  variant: z.enum(["digit-to-word", "word-to-digit"]),
  shown: z.string().min(1), // the datum on the creature (the digit "13", or the word)
  values: z.array(z.string().min(1)).min(3), // the ring the student spins
  answer: z.string().min(1), // ∈ values
});
const MemoryTask = z.object({
  ...base,
  kind: z.literal("memory"),
  pairs: z.array(z.object({ a: z.string().min(1), b: z.string().min(1) })).min(3).max(8),
});
// ── PK-R3b · R3-15 · RESTORE — ch01's core mechanic (doc 41 §2) ──────────────
// OSWIN rained the colour out of every being he bewitched: a grey creature has
// lost its NAME and its COLOUR, and the child gives both back. Two steps on the
// `mistake` machine's proven pattern:
//
//   step 1  NAME it   — four names, one of them the being standing there.
//                       Answerable by LOOKING: greyed art still has its shape.
//   step 2  COLOUR it — the being says IN GERMAN which colour it lost
//                       (`colourAskDe`), and the child gives that colour in
//                       ENGLISH. This is why the German ask is a REQUIRED field
//                       rather than flavour: without it the second step would be
//                       unanswerable by looking — nothing on a grey sprite can
//                       tell a six-year-old what colour it used to be, and an
//                       unanswerable card is exactly the class R3-12 removed
//                       from the boss.
const RestoreTask = z.object({
  ...base,
  kind: z.literal("restore"),
  nameOptions: z.array(z.string().min(1)).length(4), // doc 41 §2: „among 4"
  name: z.string().min(1), // ∈ nameOptions
  colourAskDe: z.string().min(1), // the German line the being says at step 2
  colourOptions: z.array(z.string().min(1)).length(3), // the unit's colour words
  colour: z.string().min(1), // ∈ colourOptions
});

const GameTaskUnion = z.discriminatedUnion("kind", [
  ChoiceTask, TypedTask, SpellTask, OrderTask, OddOneTask, MistakeTask, WheelTask, MemoryTask, RestoreTask,
]);
export type GameTaskV2 = z.infer<typeof GameTaskUnion>;
export type TaskKind = GameTaskV2["kind"];

/** The task schema — the discriminated union PLUS the cross-field invariants
 *  (taskInvariantErrors), so a single task self-validates, not only in a file. */
export const GameTaskV2 = GameTaskUnion.superRefine((t, ctx) => {
  for (const msg of taskInvariantErrors(t)) ctx.addIssue({ code: "custom", message: msg });
});

// ── the FORM ↔ KIND tables (R5-W2 · G1) ──────────────────────────────────────
/** Which widgets can express each ask. Both directions matter, so both are
 *  declared: this table catches a form asked through a kind that cannot carry it
 *  (an `oddone` claiming to be „name-it"), and KIND_FIXED_FORM below catches the
 *  reverse (a `wheel` claiming to ask anything other than its transcode). */
export const FORM_KINDS: Readonly<Record<TaskForm, readonly TaskKind[]>> = {
  "name-it": ["choice", "restore", "typed", "spell"],
  "state-it": ["choice", "typed"],
  "pick-correct-form": ["choice"],
  command: ["choice", "typed"],
  "social-formula": ["choice", "typed"],
  "ask-it": ["choice", "order", "typed"],
  "count-it": ["choice", "typed"],
  "number-transcode": ["wheel"],
  "belongs-or-not": ["oddone"],
};

/**
 * Some kinds have their ask fixed by their own MACHINE rather than by the author:
 * a `restore` always asks the being's name and then its colour (the being states
 * the colour itself in German, so step two is not a second question —
 * STORY_SPINE_CH01 §5), a `wheel` can only transcode a number, an `oddone` can
 * only judge membership.
 *
 * This is DERIVED from FORM_KINDS rather than declared beside it, and that is a
 * finding of this session rather than a preference: the first version was a
 * second table plus its own guard clause, and the tamper proved the guard could
 * be deleted without a single test going red — because only `name-it` lists
 * `restore`, only `number-transcode` lists `wheel`, and only `belongs-or-not`
 * lists `oddone`, so FORM_KINDS already forbade every other pairing. An
 * untestable check is exactly the class this session exists to remove, so the
 * duplicate table became this function: one source of truth, and the useful
 * question ("is this kind's ask its author's choice at all?") still answerable.
 */
export function fixedFormOf(kind: TaskKind): TaskForm | undefined {
  const forms = (Object.keys(FORM_KINDS) as TaskForm[]).filter((f) => FORM_KINDS[f].includes(kind));
  return forms.length === 1 ? forms[0] : undefined;
}

/** Forms whose ANSWER IS THE ASKER'S OWN IDENTITY. This is the small fact that
 *  makes B12 satisfiable instead of contradictory. A being met more than once
 *  cannot keep a referent-fixed voice — a second card of the same form would
 *  have to repeat the same answer — so it must take a content-variable form.
 *  That is why today's content drifts: the pencil's voice was „name-it", so its
 *  second and third cards HAD to become something else. B12 was not broken by
 *  carelessness; on a referent-fixed voice it was unsatisfiable. */
export const REFERENT_FIXED_FORMS: ReadonlySet<TaskForm> = new Set<TaskForm>(["name-it", "state-it"]);

// ── the cross-field content laws (ONE source of truth) ───────────────────────
/** The kinds whose question is ABOUT written material, and which therefore owe
 *  the world that material (doc 41 §4). `choice`/`wheel`/`spell`/`typed` ask
 *  about the being itself or a spoken word — they need no board. */
export const EVIDENCE_KINDS = new Set<TaskKind>(["mistake", "oddone", "order", "memory"]);

/** Every token a card's question depends on — what the guardian must have
 *  written for the card to be answerable by LOOKING. */
export function evidenceTokensOf(t: GameTaskV2): string[] {
  switch (t.kind) {
    case "mistake": return t.sentence;
    case "oddone": return t.items;
    case "order": return t.orderedChips;
    case "memory": return t.pairs.map((p) => p.a);
    default: return [];
  }
}

/** Semantic invariants zod's shape check can't express. Returns human-readable
 *  error strings (empty = clean). Called by the file superRefine AND the CLI. */
export function taskInvariantErrors(t: GameTaskV2): string[] {
  const errs: string[] = [];
  const dup = (a: readonly string[]): boolean => new Set(a).size !== a.length;
  // ── THE BINDING LAW (PB-F1, from Koki's REPLAY 1 verdict F2-1) ────────────
  // An `entity` stimulus is a CLAIM that a being is on screen carrying the
  // answer. A card that makes that claim must say WHICH being (skins), or the
  // router can serve it for anything — which is exactly how a pencil came to
  // ask about a rubber. Conversely an unbound card lives in the fallback pool
  // and may fire at a spike or an unmatched being, so it may not claim a
  // being at all. Structural, so no future card can regress it.
  if (t.stimulus.type === "entity" && t.skins === undefined) {
    errs.push("binding: an entity stimulus must declare skins (it claims a being is on screen)");
  }
  if (t.stimulus.type !== "entity" && t.skins !== undefined) {
    errs.push("binding: skins are declared but the stimulus is not an entity (bind the card to what it shows)");
  }
  if (t.skins && dup(t.skins)) errs.push("duplicate skin");
  if (t.phases && dup(t.phases)) errs.push("duplicate phase");
  // ── THE FORM LAW (R5-W2 · G1), both directions ────────────────────────────
  // A declared ask that its own widget cannot express is worse than no
  // declaration: the variety laws compute on `form`, so a wrong one buys a
  // green check for a battery that repeats itself.
  if (t.form !== undefined && !FORM_KINDS[t.form].includes(t.kind)) {
    errs.push(`form: "${t.form}" cannot be asked as a ${t.kind} card (that ask is expressible as: ${FORM_KINDS[t.form].join(" · ")})`);
  }
  if (t.exercises && dup(t.exercises)) errs.push("duplicate exercises id");
  // ── THE BOSS-EVIDENCE LAW (doc 41 §4, R3-12) ──────────────────────────────
  // A boss card whose kind asks about MATERIAL (a sentence, four words, a set of
  // chips, a row of numbers) must render that material on the guardian — and
  // every token it asks about has to be in what the guardian writes. That is
  // the machine form of "the card asks about the world, never about itself".
  if (EVIDENCE_KINDS.has(t.kind)) {
    if (t.use === "boss" && t.evidence === undefined) {
      errs.push(`boss card of kind ${t.kind} must carry evidence (the guardian has to show what the card asks about)`);
    }
    if (t.evidence) {
      const written = t.evidence.join(" ");
      for (const token of evidenceTokensOf(t)) {
        if (!written.includes(token)) errs.push(`evidence does not show "${token}" — the card asks about something the guardian never writes`);
      }
    }
  } else if (t.evidence !== undefined) {
    errs.push(`kind ${t.kind} carries evidence but asks about no written material`);
  }
  if (t.evidence !== undefined && t.stimulus.type !== "entity") {
    errs.push("evidence is written ON a being — the stimulus must be an entity");
  }
  switch (t.kind) {
    case "choice":
      if (!t.options.includes(t.answer)) errs.push("answer is not among the 3 options");
      if (dup(t.options)) errs.push("duplicate option");
      break;
    case "wheel":
      if (!t.values.includes(t.answer)) errs.push("answer is not on the wheel");
      if (dup(t.values)) errs.push("duplicate wheel value");
      break;
    case "spell":
      if (/\s/.test(t.answer)) errs.push("spell answer must be a single token (no spaces)");
      if (t.extraLetters.replace(/\s/g, "").length < 1) errs.push("spell needs ≥1 distractor letter");
      break;
    case "order":
      if (new Set(t.orderedChips).size < 2) errs.push("order needs ≥2 distinct chips");
      break;
    case "oddone":
      for (const c of t.correct) if (!t.items.includes(c)) errs.push(`correct "${c}" is not among items`);
      if (t.select === "odd" && t.correct.length !== 1) errs.push("select=odd needs exactly one correct");
      if (dup(t.items)) errs.push("duplicate item");
      break;
    case "mistake":
      if (t.errorIndex < 0 || t.errorIndex >= t.sentence.length) errs.push("errorIndex out of range");
      if ((t.fix.mode === "replace" || t.fix.mode === "add") && !t.fix.correction) errs.push(`fix.mode ${t.fix.mode} needs a correction`);
      if (t.fix.mode === "remove" && t.fix.correction) errs.push("fix.mode remove must not carry a correction");
      if (t.correctionOptions && t.fix.correction && !t.correctionOptions.includes(t.fix.correction)) errs.push("correctionOptions must include the correction");
      break;
    case "memory": {
      const as = t.pairs.map((p) => p.a);
      const bs = t.pairs.map((p) => p.b);
      if (dup(as) || dup(bs)) errs.push("memory pairs must be unique on both sides");
      break;
    }
    case "restore":
      // A restore card GIVES A BEING back what OSWIN took, so it must be bound
      // to that being — the binding law above then forces `skins` too. An
      // unbound restore card would be a colour handed to nobody.
      if (t.stimulus.type !== "entity") errs.push("restore is about a being on screen — the stimulus must be an entity");
      if (!t.nameOptions.includes(t.name)) errs.push("name is not among the 4 name options");
      if (dup(t.nameOptions)) errs.push("duplicate name option");
      if (!t.colourOptions.includes(t.colour)) errs.push("colour is not among the colour options");
      if (dup(t.colourOptions)) errs.push("duplicate colour option");
      // GREY IS THE WOUND, NOT A CURE. A restore card exists because OSWIN
      // rained the colour OUT of the being — grey is the state on screen while
      // the card is open, so offering it back as an answer reads to a literal
      // six-year-old as „leave it as it is". Found by a blind verifier on the
      // first authored set (the exercise book was offered grey); made
      // structural here so no future chapter can re-author it.
      if (t.colourOptions.some((c) => /^gr[ea]y$/i.test(c.trim()))) {
        errs.push("restore may not offer grey — grey is the drained state the card undoes, not a colour to give back");
      }
      break;
    case "typed":
      break;
  }
  return errs;
}

// ── the German REGISTER LAW (one list, three call sites) ─────────────────────
/** Words a chapter for six-year-olds does not use. „schrei" is boundary-aware so
 *  it catches schreien/Schrei (scream) but NOT „schreiben"/„Schreiber" (to write
 *  / writer), which are core school vocabulary — the naive-substring pitfall.
 *
 *  PK-R3b: this list used to live only in scripts/check-game-tasks.mjs, which
 *  reads task files. The Regel-Seiten (doc 41 §5) put authored German in the
 *  LEVEL file, where that checker never looks, so the list moved here — the one
 *  place both the task gate and game-paint's level laws can import it. A rule
 *  with two copies is a rule with one enforced copy. */
export const BANNED_DE: readonly RegExp[] = [/Monster/, /Blut/, /böse/, /Bösewicht/, /schrei(?!b)/, /sterben/, /tot /];

/** Register violations in a German string (empty = clean). */
export function registerErrorsDe(text: string | undefined): string[] {
  if (text === undefined) return [];
  return BANNED_DE.filter((re) => re.test(text)).map((re) => `register-law: ${re} in "${text}"`);
}

/** The kurzweilig law (F2-2): a card line is one short clause + the ask,
 *  read-aloud-able by a six-year-old in about five seconds. Shared with the
 *  Regel-Seiten Merksatz law, which is read aloud in exactly the same breath. */
export const MAX_LINE_DE = 56;

// ── the CLOAK LAW (doc 31 §6, doc 44 §4; R5-C1) ──────────────────────────────
/** The year hides one face. The player meets a hooded ink silhouette for
 *  fourteen chapters and is told its name in the fifteenth — so the name may not
 *  appear in ANY string a child can read before then. It leaked once anyway
 *  (ch01's goal card opened „OSWINs Tinte…" and shipped), because the chapter's
 *  own German was the one authored surface in this repo that no gate read. The
 *  list lives beside BANNED_DE for the same stated reason: a rule with two
 *  copies is a rule with one enforced copy. */
export const CLOAKED_NAMES: readonly RegExp[] = [/\bOSWIN/i];

/** The chapter at which the unmask happens and the cloak stops applying. */
export const CLOAK_LIFTS_AT = "ch15";

/** Cloak violations in a German string (empty = clean).
 *
 *  `chapter` is compared lexicographically, which is exact for the `chNN` form.
 *  Passing NO chapter means ALWAYS CLOAKED — that is deliberate and is how the
 *  shared game shell is judged: its copy serves all fifteen chapters at once, so
 *  it may never carry the name at all. */
export function cloakErrorsDe(text: string | undefined, chapter?: string): string[] {
  if (text === undefined) return [];
  if (chapter !== undefined && chapter >= CLOAK_LIFTS_AT) return [];
  return CLOAKED_NAMES
    .filter((re) => re.test(text))
    .map((re) => `cloak-law: ${re} in "${text}" — the name is not spoken before ${CLOAK_LIFTS_AT}`);
}

// ── the file wrapper ─────────────────────────────────────────────────────────
export const GameTasksFileV2 = z
  .object({
    schema: z.literal("gameTasks@2"),
    chapter: z.string().regex(/^ch\d{2}$/),
    unit: z.string().min(1),
    note: z.string().optional(),
    items: z.array(GameTaskV2).min(1), // each item's invariants run via GameTaskV2's refine
  })
  .superRefine((file, ctx) => {
    // file-level law only: unique ids (per-item invariants already ran above)
    const ids = new Set<string>();
    file.items.forEach((it, i) => {
      if (ids.has(it.id)) ctx.addIssue({ code: "custom", message: `duplicate task id ${it.id}`, path: ["items", i] });
      ids.add(it.id);
    });
  });
export type GameTasksFileV2 = z.infer<typeof GameTasksFileV2>;

// ── derived hints (never authored — the anti-drift law) ──────────────────────
/** The gap-fill hint ladder data, derived from the answer:
 *  firstLetter (esc-1, shown IN the gap) + per-word letter counts (esc-2, the
 *  exact underline count Koki's F18 spec asks for). */
export function deriveGapHints(answer: string): { firstLetter: string; words: number[]; letters: number } {
  const trimmed = answer.trim();
  const words = trimmed.split(/\s+/).map((w) => (w.match(/\p{L}/gu) ?? []).length).filter((n) => n > 0);
  return { firstLetter: trimmed[0] ?? "", words, letters: words.reduce((a, b) => a + b, 0) };
}

// ── deterministic shuffle (shared: the projection == what the student sees) ──
/** FNV-1a-seeded Fisher–Yates. No Math.random (repo law); the card renderer and
 *  renderTaskText MUST use this same function+seed so a blind-solver sees the
 *  student's exact option order. */
export function seededShuffle<T>(arr: readonly T[], seed: string): T[] {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

// ── the blind-solve / golden text projection ─────────────────────────────────
/** A plain-text rendering of EXACTLY what a student sees at first sight — the
 *  single source consumed by the blind-solve agents, golden tests, and the
 *  authoring checker. Never leaks more than the screen shows. */
export function renderTaskText(t: GameTaskV2): string {
  const lines: string[] = [];
  if (t.stimulus.type === "image") lines.push(`[Bild: ${t.stimulus.altDe}]`);
  else if (t.stimulus.type === "entity") lines.push(`[${t.stimulus.showsDe}]`);
  // R3-12: the guardian's board is part of what the student SEES — a blind
  // solver that cannot read it is not seeing the card (P-18: frames mirror the
  // renderer, never a paraphrase of it).
  if (t.evidence) lines.push(`[auf der Tafel steht: ${t.evidence.join(" ")}]`);
  lines.push(t.storyDe);
  if (t.promptEn) lines.push(t.promptEn);
  switch (t.kind) {
    case "choice":
      lines.push("Optionen: " + seededShuffle(t.options, t.id).join(" · "));
      break;
    case "typed":
      lines.push("(tippe die Antwort)");
      break;
    case "spell": {
      const tray = [...t.answer.replace(/\s/g, ""), ...t.extraLetters.replace(/\s/g, "")];
      lines.push("Buchstaben: " + seededShuffle(tray, t.id).map((c) => c.toUpperCase()).join(" "));
      break;
    }
    case "order":
      lines.push("Chips: " + seededShuffle(t.orderedChips, t.id).map((c) => `[${c}]`).join(" "));
      break;
    case "oddone":
      lines.push((t.select === "all" ? "Wähle alle passenden: " : "Was passt NICHT? ") + seededShuffle(t.items, t.id).join(" · "));
      break;
    case "mistake":
      lines.push("Satz: " + t.sentence.map((w, i) => `${i}:${w}`).join(" "));
      break;
    case "wheel":
      lines.push(`Rad zeigt „${t.shown}" → dreh auf: ` + t.values.join(" · "));
      break;
    case "memory":
      // PK-R3b · W4b · P-18 — THE PROJECTION MUST MIRROR THE RENDERER.
      // This line used to print „Paare (verdeckt): 3↔three | …" — the answer
      // key, dressed as the student's view. Every blind solver ever pointed at a
      // memory card was therefore handed the solution, and the unanimity that
      // came back proved nothing at all. What the child actually sees is a board
      // of face-down cards: a count, and nothing else. That is what this prints
      // now, and it is why a memory card can no longer be blind-solved — which
      // is the honest outcome for a recall game, not a defect to paper over.
      lines.push(`Spielfeld: ${t.pairs.length * 2} verdeckte Karten (${t.pairs.length} Paare)`);
      break;
    case "restore":
      // Both steps, in the order the card reveals them (the skin shows step 2
      // only after step 1 is right). Step 2's German ask is printed because the
      // BEING says it on the card — without it the colour would be unanswerable,
      // and a projection that hides it would test a solver on a card no child
      // could solve either.
      // P-18 again, caught by a blind verifier reading this very projection: an
      // earlier version printed „Schritt 1 — wer bist du?", a line the skin
      // never renders. The card shows a two-dot breadcrumb and a row of names,
      // then the being's German line and a row of colour swatches — so that is
      // what this prints. A projection may not invent a question.
      lines.push("Schritt 1 · der Name — " + seededShuffle(t.nameOptions, t.id).join(" · "));
      lines.push(`Schritt 2 · die Farbe — ${t.colourAskDe}`);
      lines.push("Farben: " + seededShuffle(t.colourOptions, `${t.id}:colour`).join(" · "));
      break;
  }
  return lines.join("\n");
}
