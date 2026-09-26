import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, getSolvedGameItemIds, recordAttempt } from "@domigo/db";
import { xpForTier } from "@domigo/engine";
import { schoolAccess } from "@/lib/school-access";
import { loadSchoolBattery } from "@/lib/school-content";
import { schoolAttempt } from "@/lib/school-attempt";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const Body = z.object({ station: z.string().max(30), value: z.string().max(2000), clientAttemptId: z.uuid(),
  previewSolved: z.array(z.string().max(30)).max(14).default([]) });
export async function POST(req: Request) {
  let access: Awaited<ReturnType<typeof schoolAccess>>;
  try {
    access = await schoolAccess(req);
  } catch {
    // Failure to resolve a class is retryable; a resolved denial below is not.
    return NextResponse.json({ error: "retry" }, { status: 503 });
  }
  if (!access) return NextResponse.json({ error: "not_available" }, { status: 403 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const b = loadSchoolBattery();
  const card = b.cards.find((c) => c.station === parsed.data.station);
  if (!card) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    const outcome = await schoolAttempt(b, parsed.data, access.preview, {
      solvedIds: () => getSolvedGameItemIds(getDb(), access.player.userId, 2, true),
      save: async (card, result) => {
        if (access.preview) throw new Error("preview cannot write");
        const player = access.player;
        await recordAttempt(getDb(), player.classScope, {
          userId: player.userId, classId: player.classId, itemId: card.item.id,
          kind: "grammar", unitSlug: b.unit, grade: 2, mode: "game:g2", tier: result.tier,
          xpAwarded: xpForTier(card.item.difficulty * 10, result.tier),
          clientAttemptId: parsed.data.clientAttemptId, reviewContext: "story",
          context: { story: b.story, chapter: b.chapter, station: card.station },
        });
      },
    });
    return outcome ? NextResponse.json(outcome) : NextResponse.json({ error: "not_available" }, { status: 409 });
  } catch {
    // A transient storage failure never pretends that an attempt was saved.
    // The client keeps the same UUID and raw answer so retry is idempotent.
    return NextResponse.json({ error: "retry" }, { status: 503 });
  }
}
