import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getClassForTeacher, getDb } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import { liveEnabled } from "@/lib/arena/live-server";
import TrainerShell from "@/app/home/TrainerShell";
import LiveScreen from "@/app/arena/LiveScreen";
import "@/app/arena/arena.css";
import "@/app/arena/live.css";
export const dynamic = "force-dynamic";
export default async function QuizPage({ params, searchParams }: {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        room?: string;
    }>;
}) {
    if ((await auth())?.user?.role !== "teacher")
        redirect("/admin/signin");
    const teacher = await getTeacherForPage();
    if (!teacher)
        redirect("/admin/signin");
    const { id } = await params;
    const cls = await getClassForTeacher(getDb(), teacher.classScope, id, teacher.userId).catch(() => null);
    if (!cls || cls.grade < 1 || cls.grade > 4)
        return <main><Link href="/admin/classes">Zur Klassenübersicht</Link><p>Dieses Quiz ist gerade nicht erreichbar.</p></main>;
    const room = (await searchParams).room;
    return <TrainerShell grade={cls.grade} preview={false} screen="arena"><LiveScreen key={`${id}-${room ?? "lobby"}`} grade={cls.grade} preview={false} ownerId={teacher.userId} classId={id} id={room} enabled={liveEnabled()}/></TrainerShell>;
}
