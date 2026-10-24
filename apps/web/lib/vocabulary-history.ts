/** Completed-card observations. They never alter grading, XP or review scheduling. */
import { createHash } from "node:crypto";
import { z } from "zod";
import type { VocabItem } from "@domigo/content-schema";
import { vocabularyContentSnapshot, type Tier, type VocabPool } from "@domigo/engine";

export const VocabularyCheckReport = z.object({
  reportedTier: z.enum(["correct", "partial", "close", "wrong"]),
  helpShown: z.array(z.enum(["hint", "retry-hint", "gloss", "word-bank", "first-letter-mask"])).max(5),
}).strict();
export const VocabularyHistoryInput = z.object({
  schema: z.literal("vocabulary-completion@1"),
  visitId: z.uuid().optional(),
  itemRevision: z.number().int().positive(),
  displayedContentSha256: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
  maxChecks: z.union([z.literal(1), z.literal(3)]),
  checks: z.array(VocabularyCheckReport).min(1).max(3),
}).strict().superRefine((history, ctx) => {
  if (history.checks.length > history.maxChecks
    || history.checks.slice(0, -1).some(check => check.reportedTier !== "wrong")
    || (history.checks.at(-1)?.reportedTier === "wrong" && history.checks.length !== history.maxChecks)
    || history.checks.some(check => new Set(check.helpShown).size !== check.helpShown.length)) {
    ctx.addIssue({ code: "custom", message: "invalid completed-card observation" });
  }
});
export type VocabularyHistoryInput = z.infer<typeof VocabularyHistoryInput>;

export const supportsVocabularyHistory = (mode: string): boolean =>
  ["practice", "daily", "review"].includes(mode) || /^(study|journey):/.test(mode);

export function vocabularyHistoryContext(item: VocabItem, pool: VocabPool, tier: Tier, observation?: VocabularyHistoryInput) {
  const sha256 = createHash("sha256").update(vocabularyContentSnapshot(item)).digest("hex");
  return {
    schema: "vocabulary-learning-history@1" as const,
    coverage: "completed-card-only" as const,
    pool,
    gradedContent: { revision: item.rev, sha256 },
    displayedContent: observation ? { revision: observation.itemRevision, sha256: observation.displayedContentSha256 } : null,
    contentMatch: observation?.displayedContentSha256 ? observation.displayedContentSha256 === sha256 : null,
    // Earlier answers are deliberately not retained. Only the final tier below
    // is server-graded; client observations must not become mastery evidence.
    clientObservation: observation ? { visitId: observation.visitId ?? null, maxChecks: observation.maxChecks, checks: observation.checks } : null,
    checkTierEvidence: observation ? "client-reported" as const : null,
    finalServerTier: tier,
    helpShown: observation ? [...new Set(observation.checks.flatMap(check => check.helpShown))] : null,
  };
}
