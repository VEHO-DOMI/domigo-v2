import { notFound } from "next/navigation";
import { assignPool, listApprovedUnits } from "@domigo/content-loader";
import { getDb, listReservedForClass } from "@domigo/db";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { getActingUserForPage } from "@/lib/identity";
import PracticeSession from "./PracticeSession";

export const dynamic = "force-dynamic";

export default async function UnitPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!listApprovedUnits().includes(slug)) notFound();
  const unit = await loadUnitWithOverrides(slug);

  // J-1 (F2): free practice EXCLUDES the class's reserved items (the `mock` pool),
  // so a teacher's held-out assessment items never surface in self-study — the
  // same reserve integrity Smart Review + game encounters enforce.
  const acting = await getActingUserForPage();
  const reserved = acting ? await listReservedForClass(getDb(), acting.classId).catch(() => new Set<string>()) : new Set<string>();
  const vocab = unit.vocab.filter((v) => assignPool(v.id, reserved) !== "mock");
  const grammar = unit.grammar.filter((g) => assignPool(g.id, reserved) !== "mock");

  // Vienna-day (YYYY-MM-DD) computed server-side so the deterministic vocab-pool
  // rotation is identical across SSR + hydration (no client Date, no mismatch).
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna" }).format(new Date());
  return <PracticeSession slug={slug} vocab={vocab} grammar={grammar} today={today} />;
}
