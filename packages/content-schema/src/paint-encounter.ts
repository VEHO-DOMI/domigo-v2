/** A self-contained, untimed learning encounter, outside the world-task router. */
import { z } from "zod";
import { GameTaskV2 } from "./game-tasks.ts";

const text = z.string().trim().min(1);
const sceneId = z.string().regex(/^s\d{2}$/);
const taskFields = {
  id: text,
  use: z.literal("encounter"),
  form: z.literal("state-it"),
  stimulus: z.object({ type: z.literal("image"), stem: sceneId, altDe: text }).strict(),
  storyDe: text,
  promptEn: text,
  answer: text,
  exercises: z.array(text).min(1),
  corpusItem: z.string().regex(/^g[1-4]u\d{2}\.gi\.[a-z0-9.-]+$/),
  phase: z.enum(["guided", "independent", "transfer"]),
  scene: sceneId,
  titleDe: text,
  contextDe: text,
  helpFocusDe: text,
  explanationDe: text,
  /** Committed only by the explicit Continue action, never by grading. */
  worldEffects: z.array(z.enum(["recover_book", "pack_book"])),
};

export const PaintEncounterTask = z.discriminatedUnion("kind", [
  z.object({ ...taskFields, kind: z.literal("choice"), options: z.array(text).length(3) }).strict(),
  z.object({ ...taskFields, kind: z.literal("typed"), accept: z.array(text) }).strict(),
]).superRefine((task, ctx) => {
  const base = GameTaskV2.safeParse(task);
  if (!base.success) for (const issue of base.error.issues) ctx.addIssue({ code: "custom", path: issue.path, message: issue.message });
  if (task.stimulus.stem !== task.scene) {
    ctx.addIssue({ code: "custom", path: ["stimulus", "stem"], message: "Image stimulus must name the task scene" });
  }
  if ((task.promptEn.match(/_{3,}/g) ?? []).length !== 1) {
    ctx.addIssue({ code: "custom", path: ["promptEn"], message: "Encounter tasks need exactly one answer gap" });
  }
  if (new Set(task.worldEffects).size !== task.worldEffects.length) {
    ctx.addIssue({ code: "custom", path: ["worldEffects"], message: "Duplicate world effect" });
  }
});
export type PaintEncounterTask = z.infer<typeof PaintEncounterTask>;

export const PaintEncounter = z.object({
  schema: z.literal("paintEncounter@1"),
  id: text,
  revision: text,
  chapter: z.string().regex(/^ch\d{2}$/),
  unit: z.string().regex(/^g[1-4]-u\d{2}$/),
  title: text,
  intro: z.object({
    story: text, goal: text, orientation: text,
    wordSupport: z.array(z.object({ en: text, de: text }).strict()).min(1),
  }).strict(),
  models: z.array(z.object({ scene: sceneId, sentence: text, explanationDe: text }).strict()).length(3),
  scenes: z.array(z.object({
    id: sceneId,
    asset: z.string().regex(/^\/art\/g[1-4]\/paint\/ch\d{2}\/encounter\/s\d{2}\.svg$/),
    altDe: text,
  }).strict()).min(1),
  tasks: z.array(PaintEncounterTask).min(1),
  completion: z.object({ title: text, story: text, learning: text, continueLabel: text, revisitLabel: text }).strict(),
}).strict().superRefine((encounter, ctx) => {
  const sceneIds = new Set(encounter.scenes.map(scene => scene.id));
  if (sceneIds.size !== encounter.scenes.length) {
    ctx.addIssue({ code: "custom", path: ["scenes"], message: "Duplicate scene id" });
  }
  if (new Set(encounter.tasks.map(task => task.id)).size !== encounter.tasks.length) {
    ctx.addIssue({ code: "custom", path: ["tasks"], message: "Duplicate task id" });
  }
  for (const [index, scene] of encounter.scenes.entries()) {
    const expected = `/art/${encounter.unit.split("-")[0]}/paint/${encounter.chapter}/encounter/${scene.id}.svg`;
    if (scene.asset !== expected) ctx.addIssue({ code: "custom", path: ["scenes", index, "asset"], message: "Scene asset must belong to this chapter and scene" });
  }
  for (const [index, model] of encounter.models.entries()) {
    if (!sceneIds.has(model.scene)) ctx.addIssue({ code: "custom", path: ["models", index, "scene"], message: "Unknown model scene" });
  }
  for (const [index, task] of encounter.tasks.entries()) {
    const scene = encounter.scenes.find(candidate => candidate.id === task.scene);
    if (!scene) ctx.addIssue({ code: "custom", path: ["tasks", index, "scene"], message: "Unknown task scene" });
    else if (scene.altDe !== task.stimulus.altDe) ctx.addIssue({ code: "custom", path: ["tasks", index, "stimulus", "altDe"], message: "Task image description must match its scene" });
    if (!task.corpusItem.startsWith(`${encounter.unit.replace("-", "")}.`)) {
      ctx.addIssue({ code: "custom", path: ["tasks", index, "corpusItem"], message: "Corpus item must belong to the encounter unit" });
    }
  }
});
export type PaintEncounter = z.infer<typeof PaintEncounter>;
