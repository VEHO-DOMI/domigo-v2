import { notFound, redirect } from "next/navigation";
import { getDb, getSolvedGameItemIds } from "@domigo/db";
import { schoolAccess } from "@/lib/school-access";
import { loadSchoolBattery } from "@/lib/school-content";
import { schoolView } from "@/lib/school-contract";
import SchoolClient from "./SchoolClient";
export const dynamic = "force-dynamic";
export default async function SchoolPage({ params }: { params: Promise<{ grade: string }> }) {
  if ((await params).grade !== "2") notFound();
  const access = await schoolAccess();
  if (!access) redirect("/play/2");
  const battery = loadSchoolBattery();
  const ids = access.preview ? new Set<string>() : await getSolvedGameItemIds(getDb(), access.player.userId, 2, true);
  const solved = battery.cards.filter((c) => ids.has(c.item.id)).map((c) => c.station);
  return <SchoolClient initial={schoolView(battery, solved, access.preview)} playerKey={access.player.userId} />;
}
