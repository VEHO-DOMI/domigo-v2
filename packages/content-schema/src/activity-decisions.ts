import { z } from "zod";

/** Explicit git-reviewed decisions, never authority inferred from an audit row.
 * Word/gloss snapshots stop a decision silently following a changed meaning. */
export const ActivityTeacherDecision = z.object({
  taskId: z.string().regex(/^g[1-4]u\d{2}\.w\.[a-z0-9-]+$/),
  word: z.string().refine(value => value.trim().length > 0),
  german: z.string().refine(value => value.trim().length > 0),
  mode: z.enum(["draw", "show", "explain"]),
  decidedBy: z.literal("Koki"),
  decidedAt: z.literal("2026-10-24"),
  source: z.literal("cgo-172"),
  note: z.string().refine(value => value.trim().length > 0),
}).strict();
export type ActivityTeacherDecision = z.infer<typeof ActivityTeacherDecision>;

export const ActivityTeacherDecisions = z.array(ActivityTeacherDecision).superRefine((rows, ctx) => {
  const seen = new Set<string>();
  rows.forEach((row, index) => {
    if (seen.has(row.taskId)) ctx.addIssue({ code: "custom", path: [index, "taskId"], message: "duplicate teacher decision task" });
    seen.add(row.taskId);
  });
});
