import { TrainerText } from "@/lib/trainer/preferences";
import Link from "next/link";
import { redirect } from "next/navigation";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import TrainerShell from "../home/TrainerShell";
import PlayerCard from "../home/PlayerCard";
import { readTrainerProfile } from "../home/trainer-data";
import { getDb, getStudentBadges } from "@domigo/db";
import BadgeGrid from "./BadgeGrid";
import AvatarPicker from "./AvatarPicker";

export const dynamic = "force-dynamic";
export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ jahrgang?: string }> }) {
  const view = await resolveStudentView((await searchParams).jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const preview = view.kind === "preview";
  const acting = view.kind === "student" ? view.player : null;
  const profile = await readTrainerProfile(view);
  const badges = preview ? [] : acting ? await getStudentBadges(getDb(), acting.classScope, acting.classId, acting.userId).catch(() => null) : null;
  return <TrainerShell grade={grade} preview={preview} screen="profil">
    <main className="og-screen">
      <Link className="og-back" href={`/home${preview ? `?jahrgang=${grade}` : ""}`}>← <TrainerText grade={grade} de="Zurück" en="Back" /></Link>
      <PlayerCard profile={profile} grade={grade} preview={preview} />
      <p className="og-streak">🔥 <TrainerText grade={grade} de="Serie" en="Streak" />: {profile.streak ?? "—"}</p>
      <BadgeGrid earned={badges} grade={grade} preview={preview} />
      <AvatarPicker key={acting?.userId ?? "preview"} initialAvatar={profile.avatar} ownerId={acting?.userId ?? null} preview={preview} grade={grade} />
    </main>
  </TrainerShell>;
}
