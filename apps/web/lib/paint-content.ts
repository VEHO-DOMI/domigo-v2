import "server-only";
/**
 * paint-content — loaders for THE PAINTED BOOK bundle
 * (content/corpus/stories/<storyId>/paint/): per-chapter levels
 * (chNN.level.json; later chNN.boss.json + chNN.tasks.json).
 *
 * Same laws as keen-content: BUILD-TIME-AUTHORED files, so every loader throws
 * LOUD on a missing file or shape error (loud beats tolerant — a bad file must
 * fail the page, never serve a half-level). Shape gate ONLY: the semantic laws
 * (glyph legality, exit chains, reachability, cage rules) live in
 * @domigo/game-paint's parsePaintLevel/checkLevelLaws, which the page runs at
 * the boundary. Root resolution + module-scope caching mirror content-loader.
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { GameTasksFileV2, type GameTaskV2 } from "@domigo/content-schema";
import { REPO_ROOT } from "@domigo/content-loader";

const STORY_ID = /^g[1-4]\.st\.[a-z0-9-]+$/;
const CHAPTER_ID = /^ch\d{2}$/;

// Entity params stay OPEN — every role brings its own knobs — but the fields the
// level laws read are shape-checked here, mirroring game-paint's EntityParams.
// PB-R1: `price` (R3-2, the letter economy) and `essential` (R3-3, the pickup
// gate) both drive machine laws AND rendered card copy; a string "8" or a
// truthy "false" would slip past an open record and reach a child's screen.
const PaintParams = z.record(z.string(), z.unknown()).check((ctx) => {
  const p = ctx.value;
  if ("price" in p && (typeof p.price !== "number" || !Number.isInteger(p.price) || p.price <= 0)) {
    ctx.issues.push({ code: "custom", input: p, path: ["price"], message: "params.price must be a whole number ≥ 1" });
  }
  if ("essential" in p && typeof p.essential !== "boolean") {
    ctx.issues.push({ code: "custom", input: p, path: ["essential"], message: "params.essential must be a boolean" });
  }
  if ("grants" in p && typeof p.grants !== "string") {
    ctx.issues.push({ code: "custom", input: p, path: ["grants"], message: "params.grants must be a string" });
  }
  // PK-R3b · R3-16: a Regel-Seite's payload is RENDERED to a six-year-old, so
  // its two authored strings are shape-checked here for the same reason `price`
  // is — a number or a stray null would reach the page as the rule itself.
  // PK-R6 · D: `cage` is the classmate's pointer at the cage she was locked in.
  // The `classmate-pair` law resolves it by id, so a number or an empty string
  // would leave the chapter's one rescue pointing at nobody.
  if ("cage" in p && (typeof p.cage !== "string" || p.cage.trim() === "")) {
    ctx.issues.push({ code: "custom", input: p, path: ["cage"], message: "params.cage must be a non-empty entity id" });
  }
  // R5-W2 · I1: the same guard for the fields the reading card added.
  // `params` is an OPEN record, so these arrive whether or not they are named
  // here — which is exactly why they are named here: unchecked, a null or a
  // number would be rendered as the rule, the key or the quotation itself.
  // R5-W4 · I2: `erklaerungDe` joins; `beispielEn` becomes the ARRAY
  // `beispieleEn`, and `lehrtEn` arrives beside it. The four J1-D fields
  // (`ausspracheDe`, `ankerEn`, `falscheFormEn`, `richtigeFormEn`) are gone and
  // are kept out by `tip-honesty`'s typo gate, which is role-aware and can say
  // „a rule page does not carry this" — something this record cannot, because
  // here every role's params look alike.
  for (const k of ["topicDe", "erklaerungDe", "merksatzDe", "schluesselDe", "belegDe"] as const) {
    if (k in p && (typeof p[k] !== "string" || p[k].trim() === "")) {
      ctx.issues.push({ code: "custom", input: p, path: [k], message: `params.${k} must be a non-empty string` });
    }
  }
  // …and the two arrays. Same reason, one level deeper: an array holding a
  // number reaches the card as a line set in the accent ink that says „42".
  for (const k of ["beispieleEn", "lehrtEn"] as const) {
    if (!(k in p)) continue;
    const v = p[k];
    if (!Array.isArray(v) || v.length === 0 || v.some((x) => typeof x !== "string" || x.trim() === "")) {
      ctx.issues.push({ code: "custom", input: p, path: [k], message: `params.${k} must be a non-empty array of non-empty strings` });
    }
  }
  // R5-W5 · B4b · R85: the freed classmate's roam window (`entities.roamZone`).
  // These live in `params` rather than on the entity itself for a reason worth
  // writing down: `PaintEntity` below is a CLOSED z.object, so an unknown field
  // there is stripped in silence and the level would ship a room nobody reads —
  // whereas this record is open and passes new keys through. That openness is
  // also why they are shape-checked HERE: the engine turns them into a loop
  // bound, and a string "63" would become NaN, which ends every loop on its
  // first step. She would simply stand still, and no gate would say why.
  for (const k of ["roamMinC", "roamMaxC"] as const) {
    if (k in p && (typeof p[k] !== "number" || !Number.isInteger(p[k]) || (p[k] as number) < 0)) {
      ctx.issues.push({ code: "custom", input: p, path: [k], message: `params.${k} must be a whole column index ≥ 0` });
    }
  }
  // …and the pair has to describe a window, not an inside-out one. West of east
  // is a typo the grid probe would absorb without complaint (both caps clamp to
  // 0, so she stands) — silent-but-wrong is exactly what a loader is for.
  if (typeof p.roamMinC === "number" && typeof p.roamMaxC === "number" && p.roamMinC > p.roamMaxC) {
    ctx.issues.push({ code: "custom", input: p, path: ["roamMinC"], message: `params.roamMinC (${p.roamMinC}) must not lie east of params.roamMaxC (${p.roamMaxC})` });
  }
});

const PaintEntity = z.object({
  id: z.string().min(1),
  role: z.enum([
    "chaser", "gunner", "flyer", "bouncer", "crusher", "swarm",
    "platform.move", "platform.fall", "platform.swing",
    "cage", "powerup", "door.trigger", "guardian",
    "tip", "book", // PK-R3b · R3-16: the two static-state collectibles
    // PK-R6 · C: `drained` — the grey classroom object stage B spread across
    // the field. It was added to game-paint's own level contract but not to
    // THIS one, and the two are separate copies: the level parsed by the engine
    // and failed at the door, so /play/1/buch answered 500 on the shipped
    // chapter. (Filed: the two copies should become one — the loader ought to
    // import the role list rather than restate it.)
    "drained",
    // PK-R6 · D: `classmate` — the bewitched person who steps out of the
    // person-cage and is restored over six reawakening rounds (doc 44 §3.3).
    // Added HERE in the same edit as game-paint's role list, on the standing
    // lesson above: a role the engine knows and this copy does not is a 500 on
    // the shipped chapter, not a type error.
    "classmate",
  ]),
  skin: z.string().min(1),
  c: z.number().int().nonnegative(),
  r: z.number().int().nonnegative(),
  tier: z.enum(["E", "M", "S"]),
  params: PaintParams.optional(),
});

const PaintLink = z.object({
  trigger: z.string().min(1),
  on: z.enum(["redeemed", "opened", "collected", "pressed"]),
  action: z.enum(["spawn", "open", "reveal"]),
  targets: z.array(z.string().min(1)).min(1),
});

const PaintPhase = z.object({
  id: z.string().regex(/^p\d$/),
  nameDe: z.string().min(1),
  surface: z.enum(["normal", "slippery"]),
  // R5-W5 · B4b · which bank of the ink carries the anchor (level.ts PhaseSpec,
  // Kokis Entscheid 2026-08-17). Named here for the same reason `inkReturns`
  // is, twenty lines down: this object STRIPS what it does not list, so an
  // unlisted field would pass the laws at authoring time and be gone at
  // runtime — and `checkpoint-placement` would then fail the shipped chapter
  // for a declaration the file actually makes.
  checkpointSide: z.enum(["near", "far"]).optional(),
  plates: z
    .object({
      sky: z.string().optional(),
      far: z.string().optional(),
      mid: z.string().optional(),
      near: z.string().optional(),
      fg: z.string().optional(),
    })
    .default({}),
  rows: z.array(z.string().min(8)).min(8),
  entities: z.array(PaintEntity).default([]),
  links: z.array(PaintLink).default([]),
  exit: z.object({ to: z.string().min(1) }),
  // B1 · W0-F3 v2 · the declared ink return (level.ts InkReturnSpec). MUST be
  // named here: this object STRIPS what it does not list, so an unlisted field
  // reaches checkLevelLaws at authoring time and vanishes at runtime — the
  // level would pass the gate on disk and lose its declaration in the browser.
  inkReturns: z
    .array(z.object({ c: z.number().int().nonnegative(), r: z.number().int().nonnegative(), whyDe: z.string().min(1) }))
    .optional(),
});

const PaintLevelFile = z.object({
  schema: z.literal("paintLevel@1"),
  id: z.string().min(1),
  chapter: z.string().regex(CHAPTER_ID),
  draft: z.boolean().optional(),
  name: z.string().min(1),
  /** PK-R6 · C (doc 44 §2.6): the objective screen's painted title plate. It
   *  must be listed HERE too — this schema strips what it does not name, so an
   *  unlisted field would reach the client as `undefined` and the goal card
   *  would silently fall back to its plain page with nothing to show for it. */
  goalPlate: z.string().min(1).optional(),
  scorePlate: z.string().min(1).optional(),
  doorPlate: z.string().min(1).optional(),
  rulePlate: z.string().min(1).optional(),
  goalDe: z.string().min(1),
  whyDe: z.string().min(1),
  hintsDe: z.array(z.string().min(1)),
  collectNounDe: z.string().min(1),
  /** PK-R3b · R3-16: how many Regel-Seiten the chapter hides (doc 41 §5). The
   *  `tip-honesty` law proves this against what the phases actually place. */
  tipsTotal: z.number().int().positive().optional(),
  /** R5-W4 · B4 · R44: how the chapter's checkpoints show themselves —
   *  `"silent"` draws nothing, `"krakel"` plays the easel ceremony. It has to be
   *  named HERE as well as in the level model: this schema strips what it does
   *  not list, so a field declared only on the disk side passes every authoring
   *  gate and then reaches the browser as `undefined` — the anchors would go on
   *  drawing, and the level file would look configured (B1's lesson, and the
   *  same reason goalPlate is spelled out above). */
  checkpointStyle: z.enum(["silent", "krakel"]).optional(),
  abilities: z.array(z.enum(["jump", "punch", "hang", "swing", "hover", "run"])),
  phases: z.array(PaintPhase).min(1),
  arena: PaintPhase.optional(),
  bonus: PaintPhase.optional(),
});

export type PaintLevelFileT = z.infer<typeof PaintLevelFile>;

const paintDir = (storyId: string): string => {
  if (!STORY_ID.test(storyId)) throw new Error(`paint-content: bad story id ${storyId}`);
  return path.join(REPO_ROOT, "content", "corpus", "stories", storyId, "paint");
};

const levelCache = new Map<string, PaintLevelFileT>();

/** Loud loader: a missing or malformed level fails the page. */
export const loadPaintLevel = (storyId: string, chapter: string): PaintLevelFileT => {
  if (!CHAPTER_ID.test(chapter)) throw new Error(`paint-content: bad chapter ${chapter}`);
  const cacheKey = `${storyId}/${chapter}`;
  const hit = levelCache.get(cacheKey);
  if (hit) return hit;
  const file = path.join(paintDir(storyId), `${chapter}.level.json`);
  const parsed = PaintLevelFile.parse(JSON.parse(fs.readFileSync(file, "utf8")));
  levelCache.set(cacheKey, parsed);
  return parsed;
};

const GameTask = z.object({
  id: z.string().min(1),
  use: z.enum(["quickfire", "encounter", "door", "rescue", "boss", "bonus"]),
  kind: z.enum(["choice", "typed"]),
  storyDe: z.string().min(1),
  promptEn: z.string().min(1),
  options: z.array(z.string().min(1)).length(3).optional(),
  answer: z.string().min(1),
  hints: z.object({
    deDesc: z.string().optional(),
    deWord: z.string().optional(),
    firstLetter: z.string().optional(),
    length: z.number().int().optional(),
  }),
  grounding: z.string().optional(),
});

const GameTasksFile = z.object({
  schema: z.literal("gameTasks@1"),
  chapter: z.string().regex(CHAPTER_ID),
  unit: z.string().min(1),
  note: z.string().optional(),
  items: z.array(GameTask).min(1),
});

export type GameTaskT = z.infer<typeof GameTask>;

const tasksCache = new Map<string, GameTaskT[]>();

/** Loud loader for the chapter task set (choice items must carry the answer). */
export const loadPaintTasks = (storyId: string, chapter: string): GameTaskT[] => {
  const cacheKey = `${storyId}/${chapter}/tasks`;
  const hit = tasksCache.get(cacheKey);
  if (hit) return hit;
  const file = path.join(paintDir(storyId), `${chapter}.tasks.json`);
  const parsed = GameTasksFile.parse(JSON.parse(fs.readFileSync(file, "utf8")));
  for (const t of parsed.items) {
    if (t.kind === "choice" && !(t.options ?? []).includes(t.answer)) {
      throw new Error(`paint-content: ${t.id} answer not among its options`);
    }
  }
  tasksCache.set(cacheKey, parsed.items);
  return parsed.items;
};

// ── gameTasks@2 (PB-T8): the card-kit task set; validated by the shared schema ──
const tasksV2Cache = new Map<string, GameTaskV2[]>();

/** Loud loader for the chNN.tasks.v2.json set (schema + cross-field invariants
 *  run in GameTasksFileV2). Falls the page on any shape/law error. */
export const loadPaintTasksV2 = (storyId: string, chapter: string): GameTaskV2[] => {
  const cacheKey = `${storyId}/${chapter}/v2`;
  const hit = tasksV2Cache.get(cacheKey);
  if (hit) return hit;
  const file = path.join(paintDir(storyId), `${chapter}.tasks.v2.json`);
  const parsed = GameTasksFileV2.parse(JSON.parse(fs.readFileSync(file, "utf8")));
  tasksV2Cache.set(cacheKey, parsed.items);
  return parsed.items;
};

/** Which chapters have an authored paint level (the admin auto-list probe). */
export const listPaintChapters = (storyId: string): string[] => {
  const dir = paintDir(storyId);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^ch\d{2}\.level\.json$/.test(f))
    .map((f) => f.slice(0, 4))
    .sort();
};
