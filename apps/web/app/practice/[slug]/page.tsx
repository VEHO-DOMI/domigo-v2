import { notFound } from "next/navigation";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import PracticeSession from "./PracticeSession";

export const dynamic = "force-dynamic";

export default async function UnitPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!listApprovedUnits().includes(slug)) notFound();
  const unit = loadUnit(slug);
  return <PracticeSession slug={slug} vocab={unit.vocab} grammar={unit.grammar} />;
}
