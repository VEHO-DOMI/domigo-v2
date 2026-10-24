import { createHash } from "node:crypto";
import { z } from "zod";
import { VocabularyCheckReport, supportsVocabularyHistory } from "./vocabulary-history.ts";
import { knownAttemptMode } from "./modi/attempt-policy.ts";
import type { VocabPool } from "@domigo/engine";

/** An individual check may be nonterminal. Earlier checks need not have arrived. */
export const VocabularyCheckInput = VocabularyCheckReport.extend({
  schema: z.literal("vocabulary-check@1"), visitId: z.uuid(),
  checkNumber: z.number().int().min(1).max(3), maxChecks: z.union([z.literal(1), z.literal(3)]),
  itemRevision: z.number().int().positive(), displayedContentSha256: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
  sourceMode: z.string().max(41).refine(mode => supportsVocabularyHistory(mode) && knownAttemptMode(mode)),
  checkedAt: z.iso.datetime().nullable(),
}).strict().superRefine((check, ctx) => {
  if (check.checkNumber > check.maxChecks || new Set(check.helpShown).size !== check.helpShown.length)
    ctx.addIssue({ code: "custom", message: "invalid vocabulary check" });
});
export type VocabularyCheckInput = z.infer<typeof VocabularyCheckInput>;

/** Fingerprint the original request, not current content or receipt time. Raw
 * input is used for this comparison and grading, never retained in the ledger. */
export function vocabularyCheckFingerprint(itemId: string, value: string, pool: VocabPool, c: VocabularyCheckInput): string {
  return createHash("sha256").update(JSON.stringify({ itemId, value, pool,
    schema: c.schema, visitId: c.visitId, checkNumber: c.checkNumber, maxChecks: c.maxChecks,
    itemRevision: c.itemRevision, displayedContentSha256: c.displayedContentSha256,
    sourceMode: c.sourceMode, checkedAt: c.checkedAt, reportedTier: c.reportedTier, helpShown: [...c.helpShown].sort(),
  })).digest("hex");
}
