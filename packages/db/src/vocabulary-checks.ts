/** History-only vocabulary checks: no practice_attempts, review or reward writes. */
import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type { Tier, VocabPool, VocabularyHelp } from "@domigo/engine";
import type { Db } from "./index.ts";
import { vocabularyChecks, vocabularyVisits } from "./schema.ts";
import { assertWritableScope, inScope, type ClassScope } from "./scope.ts";

export interface VocabularyCheckEvidence {
  schema: "vocabulary-check-record@1";
  reportedTier: Tier;
  serverTier: Tier;
  reportedComplete: boolean;
  helpShown: VocabularyHelp[];
  displayedContent: { revision: number; sha256: string | null };
  gradedContent: { revision: number; sha256: string };
  contentMatch: boolean | null;
}
export interface VocabularyCheckKey {
  userId: string; classId: string; clientEventId: string;
  visitId: string; checkNumber: number; requestSha256: string;
}
export interface RecordVocabularyCheckInput extends VocabularyCheckKey {
  maxChecks: 1 | 3; itemId: string; unitSlug: string; grade: number;
  sourceMode: string; pool: VocabPool; evidence: VocabularyCheckEvidence;
  clientCheckedAt: Date | null; receivedAt: Date;
}
export interface VocabularyCheckReceipt { clientEventId: string; recordedAt: Date; duplicate: boolean }
export class VocabularyCheckConflict extends Error { constructor() { super("vocabulary_check_conflict"); } }

/** A replay can be acknowledged even after the content has changed or gone away.
 * Compare the original request fingerprint, never a freshly regraded payload. */
export async function findVocabularyCheck(db: Db, classScope: ClassScope, key: VocabularyCheckKey): Promise<VocabularyCheckReceipt | null> {
  const rows = await db.select({ clientEventId: vocabularyChecks.clientEventId,
    requestSha256: vocabularyChecks.requestSha256, recordedAt: vocabularyChecks.recordedAt,
  }).from(vocabularyChecks).where(and(
    inArray(vocabularyChecks.classId, [...classScope]), eq(vocabularyChecks.classId, key.classId),
    eq(vocabularyChecks.userId, key.userId), or(eq(vocabularyChecks.clientEventId, key.clientEventId),
      and(eq(vocabularyChecks.visitId, key.visitId), eq(vocabularyChecks.checkNumber, key.checkNumber))),
  )).limit(2);
  if (rows.length === 0) return null;
  if (rows.length !== 1 || rows[0]!.requestSha256 !== key.requestSha256) throw new VocabularyCheckConflict();
  return { clientEventId: rows[0]!.clientEventId, recordedAt: rows[0]!.recordedAt, duplicate: true };
}

export async function recordVocabularyCheck(db: Db, classScope: ClassScope, a: RecordVocabularyCheckInput): Promise<VocabularyCheckReceipt> {
  assertWritableScope(classScope, "recordVocabularyCheck");
  if (!inScope(classScope, a.classId)) throw Error("vocabulary_check_scope");
  // One conditional upsert serializes concurrent checks' visit identities.
  // The first header stays immutable, including an unknown initial hash. Later
  // per-check fingerprints remain separate claims; unknown never certifies a match.
  // If the event insert then fails, the header is provisional, never a saved check.
  const displayed = a.evidence.displayedContent;
  const visits = await db.insert(vocabularyVisits).values({
    userId: a.userId, classId: a.classId, visitId: a.visitId, itemId: a.itemId,
    pool: a.pool, sourceMode: a.sourceMode, maxChecks: a.maxChecks,
    displayedRevision: displayed.revision, displayedSha256: displayed.sha256,
  }).onConflictDoUpdate({ target: [vocabularyVisits.userId, vocabularyVisits.visitId],
    set: { displayedSha256: vocabularyVisits.displayedSha256 },
    setWhere: and(inArray(vocabularyVisits.classId, [...classScope]), eq(vocabularyVisits.classId, a.classId),
      eq(vocabularyVisits.itemId, a.itemId), eq(vocabularyVisits.pool, a.pool),
      eq(vocabularyVisits.sourceMode, a.sourceMode), eq(vocabularyVisits.maxChecks, a.maxChecks),
      eq(vocabularyVisits.displayedRevision, displayed.revision),
      displayed.sha256 === null ? sql`true` : or(isNull(vocabularyVisits.displayedSha256), eq(vocabularyVisits.displayedSha256, displayed.sha256))),
  }).returning({ visitId: vocabularyVisits.visitId });
  if (visits.length !== 1) throw new VocabularyCheckConflict();
  const rows = await db.insert(vocabularyChecks).values({
    userId: a.userId, classId: a.classId, clientEventId: a.clientEventId,
    visitId: a.visitId, checkNumber: a.checkNumber, maxChecks: a.maxChecks,
    itemId: a.itemId, unitSlug: a.unitSlug, grade: a.grade, sourceMode: a.sourceMode, pool: a.pool,
    requestSha256: a.requestSha256, evidence: a.evidence,
    clientCheckedAt: a.clientCheckedAt, receivedAt: a.receivedAt,
  }).onConflictDoNothing().returning({ clientEventId: vocabularyChecks.clientEventId, recordedAt: vocabularyChecks.recordedAt });
  if (rows[0]) return { ...rows[0], duplicate: false };
  // Another request may have inserted between the route's lookup and this write.
  const previous = await findVocabularyCheck(db, classScope, a);
  if (!previous) throw new VocabularyCheckConflict();
  return previous;
}
