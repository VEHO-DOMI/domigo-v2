/**
 * POST /api/admin/assignments — create a teacher assignment from a draft.
 * Teacher-only. The draft is re-validated server-side (never trust the client's
 * validation) against the class's reserved items before it persists.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createAssignment,
  getDb,
  listReservedForClass,
  validateAssignmentDraft,
  type AssignmentDraft,
  type SectionKind,
} from "@domigo/db";
import { getTeacher } from "@/lib/teacher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECTION_KIND = z.enum(["vocab", "grammar", "listening", "reading", "writing"]);

// C-1: the checkup section config (doc 21 §3) — validated structurally here,
// then semantically (Σ=20, one item = one point) by validateAssignmentDraft.
const SectionConfigSchema = z.object({
  checkupKind: z.enum(["words-phrases", "translations", "definitions", "grammar", "picture-mc"]),
  points: z.number().int().min(1),
  mask: z.enum(["first-letter"]).nullable().optional(),
  direction: z.enum(["mixed", "deToEn", "enToDe"]).optional(),
});

const DraftSchema = z.object({
  title: z.string(),
  descriptionDe: z.string().nullable().optional(),
  mode: z.enum(["practice", "mock_test", "checkup"]),
  classId: z.string(),
  startsAt: z.string().nullable().optional(),
  dueAt: z.string().nullable().optional(),
  sessionDurationMinutes: z.number().int().positive().nullable().optional(),
  attemptsPerTest: z.number().int(),
  notenSchluessel: z
    .object({ 1: z.number(), 2: z.number(), 3: z.number(), 4: z.number() })
    .nullable()
    .optional(),
  displayConfig: z
    .object({
      feedback: z.enum(["immediate", "on-submit", "on-release"]),
      showScore: z.enum(["on-submit", "on-release"]).optional(),
    })
    .nullable()
    .optional(),
  sections: z
    .array(
      z.object({
        position: z.number().int().nonnegative(),
        kind: SECTION_KIND,
        itemIds: z.array(z.string()),
        listeningTaskId: z.string().nullable().optional(),
        writingPromptId: z.string().nullable().optional(),
        timerMinutes: z.number().int().positive().nullable().optional(),
        weightPct: z.number().int(),
        sectionConfig: SectionConfigSchema.nullable().optional(),
      }),
    )
    .max(12),
});

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const parsed = DraftSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const draft = parsed.data as AssignmentDraft & { sections: Array<{ kind: SectionKind }> };

  // Server-authoritative validation, including the class's reserved items.
  const reserved = await listReservedForClass(getDb(), draft.classId).catch(() => new Set<string>());
  const errors = validateAssignmentDraft(draft, { reservedIds: reserved });
  if (errors.length > 0) return NextResponse.json({ ok: false, error: "invalid", errors }, { status: 422 });

  try {
    const id = await createAssignment(getDb(), draft, teacher.userId);
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
