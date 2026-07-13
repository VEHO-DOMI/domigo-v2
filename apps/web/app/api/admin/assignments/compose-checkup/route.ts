/**
 * POST /api/admin/assignments/compose-checkup — the builder's "Automatisch
 * füllen" (C-1, doc 21 §4b mode 1). Teacher-only. Composes a /20 checkup from
 * one unit with the grade preset (or the teacher's edited points), excluding
 * the class's reserved items (J-1). Deterministic per seed: the response echoes
 * the seed so a re-render composes identically; a fresh call without a seed
 * gets a new one (crypto, never Math.random) for a re-roll. The teacher
 * reviews/edits the result in the builder — nothing publishes from here.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, listReservedForClass } from "@domigo/db";
import { composeCheckup, GRADE_STRUCTURES } from "@/lib/checkup";
import { getTeacher } from "@/lib/teacher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  classId: z.string().min(1),
  unitSlug: z.string().regex(/^g[1-4]-u\d{2}$/),
  seed: z.string().min(1).max(80).optional(),
  /** teacher-edited preset points (optional; §4 defaults otherwise) */
  presets: z
    .array(
      z.object({
        checkupKind: z.enum(["words-phrases", "translations", "definitions", "grammar"]),
        points: z.number().int().min(1),
        mask: z.enum(["first-letter"]).nullable().optional(),
        direction: z.enum(["mixed", "deToEn", "enToDe"]).optional(),
      }),
    )
    .max(8)
    .optional(),
});

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { classId, unitSlug, presets } = parsed.data;

  const grade = Number(unitSlug[1]) as 1 | 2 | 3 | 4;
  const seed = parsed.data.seed ?? crypto.randomUUID();
  const reserved = await listReservedForClass(getDb(), classId).catch(() => new Set<string>());

  const result = composeCheckup(unitSlug, grade, seed, {
    reservedIds: reserved,
    presets: presets?.map((p) => ({ ...p, mask: p.mask ?? undefined })) ?? GRADE_STRUCTURES[grade],
  });
  if (!result.ok) return NextResponse.json({ ok: false, error: "shortfall", errors: result.errors }, { status: 422 });
  return NextResponse.json({ ok: true, seed, sections: result.sections });
}
