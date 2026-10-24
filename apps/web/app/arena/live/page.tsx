import { redirect } from "next/navigation";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { liveEnabled } from "@/lib/arena/live-server";
import TrainerShell from "@/app/home/TrainerShell";
import LiveScreen from "@/app/arena/LiveScreen";
import "@/app/arena/arena.css";
import "@/app/arena/live.css";
export const dynamic = "force-dynamic";
export default async function LivePage({ searchParams }: {
    searchParams: Promise<{
        jahrgang?: string;
    }>;
}) {
    const view = await resolveStudentView((await searchParams).jahrgang);
    if (!view)
        redirect("/signin");
    const grade = trainerGrade(view);
    if (grade === null)
        redirect("/home");
    const preview = view.kind === "preview";
    return <TrainerShell grade={grade} preview={preview} screen="arena"><LiveScreen key={`${preview ? "preview" : view.player.userId}-${grade}`} grade={grade} preview={preview} ownerId={preview ? null : view.player.userId} enabled={liveEnabled()}/></TrainerShell>;
}
