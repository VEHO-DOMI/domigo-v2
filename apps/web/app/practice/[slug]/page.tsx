import { notFound } from "next/navigation";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import PracticeSession from "./PracticeSession";

export const dynamic = "force-dynamic";

export default async function UnitPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!listApprovedUnits().includes(slug)) notFound();
  const unit = loadUnit(slug);
  // Vienna-day (YYYY-MM-DD) computed server-side so the deterministic vocab-pool
  // rotation is identical across SSR + hydration (no client Date, no mismatch).
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna" }).format(new Date());
  return <PracticeSession slug={slug} vocab={unit.vocab} grammar={unit.grammar} today={today} />;
}
