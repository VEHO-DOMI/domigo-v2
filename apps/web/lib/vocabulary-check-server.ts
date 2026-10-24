/** Independent history writer. This module cannot award points or schedule review. */
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getDb, getClassGrade, listReservedForClass, practiceItemDenial,
  findVocabularyCheck, recordVocabularyCheck, VocabularyCheckConflict,
  type ClassScope, type VocabularyCheckEvidence,
} from "@domigo/db";
import { gradeVocab, vocabularyContentSnapshot, type VocabPool } from "@domigo/engine";
import { parseItemRef } from "./itemRef.ts";
import { loadUnitWithOverrides } from "./content-service.ts";
import { vocabularyCheckFingerprint, type VocabularyCheckInput } from "./vocabulary-check.ts";

type Actor = { userId: string; classId: string; classScope: ClassScope };
export async function saveVocabularyCheck(actor: Actor, clientEventId: string, itemId: string, value: string, pool: VocabPool, check: VocabularyCheckInput, receivedAt: Date): Promise<Response> {
  const ref = parseItemRef(itemId);
  if (ref?.kind !== "vocab") return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const key = { userId: actor.userId, classId: actor.classId, clientEventId,
    visitId: check.visitId, checkNumber: check.checkNumber,
    requestSha256: vocabularyCheckFingerprint(itemId, value, pool, check),
  };
  try {
    const db = getDb();
    const existing = await findVocabularyCheck(db, actor.classScope, key);
    if (existing) return NextResponse.json({ ok: true, kind: "vocabulary-check", ...existing });
    const classGrade = await getClassGrade(db, actor.classId);
    const reserved = await listReservedForClass(db, actor.classScope, actor.classId);
    const denial = practiceItemDenial(itemId, classGrade, reserved);
    if (denial) return NextResponse.json({ ok: false, error: denial }, { status: 403 });
    const unit = await loadUnitWithOverrides(ref.unitSlug), item = unit.vocab.find(i => i.id === itemId);
    if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    const serverTier = gradeVocab(item, value, pool).tier;
    const sha256 = createHash("sha256").update(vocabularyContentSnapshot(item)).digest("hex");
    const evidence: VocabularyCheckEvidence = {
      schema: "vocabulary-check-record@1", reportedTier: check.reportedTier, serverTier,
      reportedComplete: check.reportedTier !== "wrong" || check.checkNumber === check.maxChecks,
      helpShown: check.helpShown,
      displayedContent: { revision: check.itemRevision, sha256: check.displayedContentSha256 },
      gradedContent: { revision: item.rev, sha256 },
      contentMatch: check.displayedContentSha256 ? check.displayedContentSha256 === sha256 : null,
    };
    const receipt = await recordVocabularyCheck(db, actor.classScope, { ...key,
      maxChecks: check.maxChecks, itemId, unitSlug: ref.unitSlug, grade: ref.grade,
      sourceMode: check.sourceMode, pool, evidence,
      clientCheckedAt: check.checkedAt ? new Date(check.checkedAt) : null, receivedAt,
    });
    return NextResponse.json({ ok: true, kind: "vocabulary-check", ...receipt });
  } catch (error) {
    if (error instanceof VocabularyCheckConflict) return NextResponse.json({ ok: false, error: "check_conflict" }, { status: 409 });
    // No SQL, raw answer or identifiers in diagnostics. Pending bytes stay queued.
    console.warn("[vocabulary-check] persistence_unavailable");
    return NextResponse.json({ ok: false, error: "persistence_unavailable" }, { status: 503 });
  }
}
