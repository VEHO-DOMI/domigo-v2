/**
 * POST /api/writing-submission — capture a mock-test writing answer (B2).
 *
 * Writing is teacher-graded (no auto-score); this only stores the submission +
 * a server-derived word count. Server authority: the promptId must be a writing
 * section of this unit's test. Teacher review + rubric scoring is deferred (B2b).
 * Best-effort persistence (never 500). Mirrors /api/study-path.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { UnitSlug } from "@domigo/content-schema";
import { loadTest } from "@domigo/content-loader";
import { getDb, recordWritingSubmission } from "@domigo/db";
import { getActingUser } from "@/lib/identity";

export const runtime = "nodejs"; // content-loader uses node:fs → not edge
export const dynamic = "force-dynamic";

const Body = z.object({
  unitSlug: UnitSlug,
  testId: z.string().min(1).max(60),
  promptId: z.string().regex(/^g[1-4]u\d{2}\.ti\.wr\.\d{3}$/),
  text: z.string().min(1).max(8000),
});

export async function POST(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { unitSlug, testId, promptId, text } = parsed.data;

  // Server authority: the promptId must be a writing section in this unit's test.
  let valid = false;
  try {
    const file = loadTest(unitSlug);
    valid = file?.test.sections.some((s) => s.kind === "writing" && s.promptId === promptId) ?? false;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!valid) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  try {
    await recordWritingSubmission(getDb(), {
      userId: acting.userId,
      classId: acting.classId,
      unitSlug,
      testId,
      promptId,
      text,
      wordCount,
    });
    return NextResponse.json({ ok: true, wordCount });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed", wordCount });
  }
}
