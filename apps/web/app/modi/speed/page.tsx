import { resolveStudentView } from "@/lib/student-view";
import { renderModePage } from "../ModePage";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: Promise<{ jahrgang?: string; chapters?: string }> }) {
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  return renderModePage(view, query.chapters, "speed");
}
