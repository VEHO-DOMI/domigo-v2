import { z } from "zod";
import type { GameTaskV2 } from "./game-tasks.ts";

/** Opt-in: older chapters do not acquire a new coverage promise. */
export const PaintCoveragePolicy = z.object({
  minDistinctAnsweredCards: z.number().int().min(2),
  requireWorldEvidence: z.boolean(),
  requireCompleteRoute: z.boolean(),
}).strict();
export type PaintCoveragePolicy = z.infer<typeof PaintCoveragePolicy>;

const Source = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("wordbank"), path: z.string().min(1), entryId: z.string().min(1) }).strict(),
  z.object({ kind: z.literal("quotation"), path: z.string().min(1), quote: z.string().min(1) }).strict(),
]);
export const PaintCoveragePlan = z.object({
  schema: z.literal("paintCoverage@1"), chapter: z.string().regex(/^ch\d{2}$/),
  note: z.string().optional(),
  targets: z.array(z.object({
    id: z.string().min(1), term: z.string().min(1),
    kind: z.enum(["wordbank", "semantic"]),
    /** Forms are author-declared only for extra semantic goals. Wordbank forms
     * always come from the actual unit, never from this coverage ledger. */
    forms: z.array(z.string().min(1)).min(1).optional(),
    requiredTaskIds: z.array(z.string().min(1)).min(2), source: Source,
    /** A substring that has a different meaning is explicitly excluded. */
    excludePhrases: z.array(z.string().min(1)).optional(),
  }).strict()).min(1),
}).strict();
export type PaintCoveragePlan = z.infer<typeof PaintCoveragePlan>;

export interface CoverageWord { id: string; en: string; forms?: readonly string[] }
export interface CoverageEntity {
  id: string; role: string; skin?: string; c: number; r: number;
  params?: {
    taskSequenceV2?: { requiredIds: readonly string[]; variantIds: readonly string[];
      reserveSlots?: readonly { taskId: string; countsAsRequired: false }[] };
    stageV2?: {
      actors: readonly { id: string; skin: string }[];
      props: readonly { id: string; skin: string }[];
      beats: readonly { id: string; viewId: string; taskIds: readonly string[];
        targetPositions: readonly { actorId: string; x: number; y: number }[];
        relations?: readonly { actorId: string; propId: string }[] }[];
    };
  };
}
export interface CoveragePhase { id: string; entities: readonly CoverageEntity[]; rows?: readonly string[] }
export interface CoveragePlayedPhase {
  phaseId: string; solvedTaskIds: readonly string[]; sceneBeatsSeen: readonly string[];
  exited: boolean;
}
export interface PaintCoverageInput {
  chapter: string; policy?: unknown; plan: unknown;
  wordbank: readonly CoverageWord[]; items: readonly GameTaskV2[];
  phases: readonly CoveragePhase[];
  /** Actual replayer output, never copied TapeExpect declarations. */
  played: readonly CoveragePlayedPhase[];
  /** Exact input documents, loaded by the caller. The pure checker does no I/O. */
  sources: Readonly<Record<string, string>>;
  /** Engine-owned role/use table, injected to avoid duplicating the router. */
  usesForEntity: (entity: CoverageEntity) => readonly string[];
}
export interface CoverageTargetResult {
  id: string; planned: string[]; served: string[]; answered: string[];
  worldConfirmed: string[];
}
export interface PaintCoverageResult { errors: string[]; targets: CoverageTargetResult[]; requiredTaskIds: string[] }

/** The child's successful answer surface, deliberately excluding distractors,
 * prompts, exercises and art-order prose. A match includes both sorted sides. */
export function coverageAnswerWords(task: GameTaskV2): string[] {
  switch (task.kind) {
    case "choice": case "spell": case "wheel": return [task.answer];
    case "typed": return [task.answer, ...(task.accept ?? [])];
    case "oddone": return [...task.correct];
    case "order": return [task.orderedChips.join(" ")];
    case "mistake": {
      // The resolved sign is the answer, including the sentence the child
      // verifies against the picture. This is comprehension, not free recall
      // of every word (the same explicit distinction as the two match sides).
      const words = [...task.sentence];
      if (task.fix.mode === "replace") words[task.errorIndex] = task.fix.correction ?? "";
      else if (task.fix.mode === "remove") words.splice(task.errorIndex, 1);
      else words.splice((task.fix.insertAfter ?? task.errorIndex) + 1, 0, task.fix.correction ?? "");
      return [words.join(" ")];
    }
    case "memory": return task.pairs.flatMap(p => [p.a, p.b]);
    case "match": return task.pairs.flatMap(p => [p.left, p.right]);
    case "restore": return [task.name, task.colour];
  }
}

const normal = (s: string): string => s.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").replace(/\s+([?!.,;:])/g, "$1").trim();
const escaped = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasForm = (s: string, form: string): boolean =>
  new RegExp(`(^|[^a-z'])${escaped(normal(form))}($|[^a-z'])`, "i").test(s);
const expanded = (s: string): string => normal(s)
  .replace(/\b(he|she|it|there|where)'s\b/g, "$1 is")
  .replace(/\b(we|they|you)'re\b/g, "$1 are").replace(/\bi'm\b/g, "i am");
const distinct = (ids: readonly string[]): string[] => [...new Set(ids)];

/** Checks declarations, reachability bindings and the actually replayed route
 * separately. Two occurrences on one card remain exactly one application. */
export function checkPaintCoverage(input: PaintCoverageInput): PaintCoverageResult {
  const result: PaintCoverageResult = { errors: [], targets: [], requiredTaskIds: [] };
  if (input.policy === undefined) return result;
  const pol = PaintCoveragePolicy.safeParse(input.policy);
  const plan = PaintCoveragePlan.safeParse(input.plan);
  if (!pol.success) result.errors.push(`coverage policy: ${pol.error.message}`);
  if (!plan.success) result.errors.push(`coverage plan: ${plan.error.message}`);
  if (!pol.success || !plan.success) return result;
  const { errors } = result;
  if (plan.data.chapter !== input.chapter) errors.push(`coverage: plan chapter ${plan.data.chapter} is not ${input.chapter}`);
  const bank = new Map(input.wordbank.map(w => [w.id, w]));
  const cards = new Map(input.items.map(t => [t.id, t]));
  if (cards.size !== input.items.length) errors.push("coverage: duplicate task IDs");
  const targets = new Set<string>();
  const required = new Set<string>();
  const bindings = new Map<string, { entity: CoverageEntity; phase: CoveragePhase; required: boolean }[]>();
  for (const phase of input.phases) for (const entity of phase.entities) {
    const sequence = entity.params?.taskSequenceV2;
    if (!sequence) continue;
    for (const id of sequence.requiredIds) required.add(id);
    for (const id of distinct([...sequence.requiredIds, ...sequence.variantIds, ...(sequence.reserveSlots ?? []).map(r => r.taskId)])) {
      const list = bindings.get(id) ?? [];
      list.push({ entity, phase, required: sequence.requiredIds.includes(id) }); bindings.set(id, list);
    }
  }
  result.requiredTaskIds = [...required];
  const playedByPhase = new Map(input.played.map(p => [p.phaseId, p]));
  const solved = new Set(input.played.flatMap(p => [...p.solvedTaskIds]));
  const servable = (id: string): boolean => {
    const card = cards.get(id), candidates = bindings.get(id) ?? [];
    return !!card && candidates.length === 1 && candidates.some(({ entity, phase }) =>
      card.skins?.includes(entity.skin ?? "") && (!card.phases?.length || card.phases.includes(phase.id))
      && input.usesForEntity(entity).includes(card.use)
      && (!card.sceneRef || card.sceneRef.entityId === entity.id));
  };
  const worldErrors = new Map<string, string>();
  const worldConfirmed = (id: string): boolean => {
    const card = cards.get(id), binding = bindings.get(id)?.[0];
    if (!card || !binding || !servable(id)) return false;
    const { entity, phase } = binding;
    const fail = (why: string): false => { worldErrors.set(id, why); return false; };
    if (!Number.isInteger(entity.c) || !Number.isInteger(entity.r) || !entity.skin) return fail("no positioned world speaker");
    if (phase.rows && !(entity.r >= 0 && entity.r < phase.rows.length && entity.c >= 0 && entity.c < (phase.rows[entity.r]?.length ?? 0))) return fail("speaker lies outside the world");
    if (!playedByPhase.get(phase.id)?.solvedTaskIds.includes(id)) return fail("speaker was not successfully addressed in its own phase");
    if (card.stimulus.type === "text") return fail("text alone has no world picture");
    if (!card.sceneRef) return true; // bound world speaker; placeholder art is legal
    const ref = card.sceneRef;
    if (!ref.beatId || !ref.viewId) return fail("scene has no exact beat/view binding");
    if (!playedByPhase.get(phase.id)?.sceneBeatsSeen.includes(`${entity.id}:${ref.beatId}:${ref.viewId}`)) return fail("scene snapshot was never seen");
    // Classmates use the engine's six live acting poses instead of stageV2.
    if (entity.role === "classmate") return true;
    const stage = entity.params?.stageV2;
    const beat = stage?.beats.find(b => b.id === ref.beatId && b.viewId === ref.viewId && b.taskIds.includes(id));
    if (!stage || !beat || !stage.actors.length || !beat.targetPositions.length) return fail("scene has no built actors/beat");
    const actors = new Set(stage.actors.filter(a => a.skin).map(a => a.id));
    const props = new Set([...stage.props.filter(p => p.skin).map(p => p.id), ...actors]);
    if (beat.targetPositions.some(p => !actors.has(p.actorId) || !Number.isFinite(p.x) || !Number.isFinite(p.y))) return fail("scene position has no visible actor");
    if (beat.relations?.some(r => !actors.has(r.actorId) || !props.has(r.propId))) return fail("relation has no actual actor/prop");
    return true;
  };
  for (const id of required) {
    if (!servable(id)) errors.push(`coverage: required task ${id} is not servable by its declared speaker/use/phase`);
    if (pol.data.requireCompleteRoute && !solved.has(id)) errors.push(`coverage: required task ${id} was not solved`);
  }
  if (pol.data.requireCompleteRoute) {
    for (const phase of input.phases.filter(p => p.entities.some(e => e.params?.taskSequenceV2?.requiredIds.length))) {
      if (!playedByPhase.get(phase.id)?.exited) errors.push(`coverage: required phase ${phase.id} did not complete its route`);
    }
    for (const played of input.played) for (const id of played.solvedTaskIds) {
      if (!servable(id) || !(bindings.get(id) ?? []).some(b => b.phase.id === played.phaseId)) errors.push(`coverage: recorded task ${id} has no servable binding in ${played.phaseId}`);
    }
  }
  for (const target of plan.data.targets) {
    if (targets.has(target.id)) errors.push(`coverage: duplicate target ${target.id}`);
    targets.add(target.id);
    const word = bank.get(target.id);
    let forms: readonly string[] = [];
    if (target.kind === "wordbank") {
      if (!word) errors.push(`coverage: ${target.id} is not a wordbank entry`);
      if (target.forms) errors.push(`coverage: ${target.id} cannot replace the wordbank's accepted forms`);
      forms = word ? [word.en, ...(word.forms ?? [])] : [];
    } else {
      if (!target.id.startsWith("semantic:") || bank.has(target.id)) errors.push(`coverage: semantic goal ${target.id} must remain separate from wordbank IDs`);
      forms = target.forms ?? [target.term];
    }
    const source = target.source;
    const sourceText = input.sources[source.path];
    if (sourceText === undefined) errors.push(`coverage: source missing for ${target.id}: ${target.source.path}`);
    else if (source.kind === "wordbank") {
      let sourceEntry: CoverageWord | undefined;
      try { const parsed = JSON.parse(sourceText) as { entries?: CoverageWord[] }; sourceEntry = parsed.entries?.find(w => w.id === source.entryId); } catch { /* reported below */ }
      if (target.kind !== "wordbank" || source.entryId !== target.id || !sourceEntry || sourceEntry.en !== word?.en
        || JSON.stringify(sourceEntry.forms ?? []) !== JSON.stringify(word?.forms ?? [])) errors.push(`coverage: wordbank source does not support ${target.id}`);
    } else {
      // Image-description prose is a transcriber's interpretation, not a printed source.
      const printed = sourceText.split("\n").filter(line => !/^\s*\[(?:Image|Bild)/i.test(line)).join("\n");
      if (target.kind !== "semantic" || !normal(printed).includes(normal(source.quote))
        || !forms.some(f => hasForm(expanded(source.quote), f))) errors.push(`coverage: printed source does not support ${target.id}`);
    }
    const answersTarget = (id: string): boolean => {
      const card = cards.get(id); if (!card) return false;
      return coverageAnswerWords(card).some(surface => {
        let text = expanded(surface);
        for (const phrase of target.excludePhrases ?? []) text = text.replace(new RegExp(escaped(normal(phrase)), "gi"), " ");
        return forms.some(form => hasForm(text, form));
      });
    };
    const planned = distinct(target.requiredTaskIds);
    for (const id of planned) {
      if (!required.has(id)) errors.push(`coverage: ${target.id} counts optional/reserve/unbound ${id} as required`);
      if (!answersTarget(id)) errors.push(`coverage: ${target.id} is absent from ${id}'s accepted answer surface`);
    }
    const served = planned.filter(id => required.has(id) && servable(id) && answersTarget(id));
    const answered = served.filter(id => solved.has(id));
    const world = answered.filter(worldConfirmed);
    result.targets.push({ id: target.id, planned, served, answered, worldConfirmed: world });
    const min = pol.data.minDistinctAnsweredCards;
    if (served.length < min) errors.push(`coverage: ${target.id} has ${served.length}/${min} distinct required answer cards`);
    if (pol.data.requireCompleteRoute && answered.length < min) errors.push(`coverage: ${target.id} has ${answered.length}/${min} distinct solved answer cards`);
    if (pol.data.requireWorldEvidence && world.length < min) errors.push(`coverage: ${target.id} has ${world.length}/${min} distinct cards with world evidence`);
  }
  for (const id of bank.keys()) if (!targets.has(id)) errors.push(`coverage: wordbank target ${id} is missing from the plan`);
  if (pol.data.requireWorldEvidence) for (const [id, why] of worldErrors) errors.push(`coverage: ${id} world evidence: ${why}`);
  return result;
}
