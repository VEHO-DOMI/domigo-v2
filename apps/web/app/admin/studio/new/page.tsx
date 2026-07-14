export const dynamic = "force-dynamic";

/**
 * S-2 · Studio — create a NEW task (/admin/studio/new). Teacher-gated. The form
 * authors a full vocab item; on publish, the sandbox blind-solve gate (S-2b)
 * runs — a capable model must solve the task correctly through the real engine
 * before it can go live.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { listApprovedUnits } from "@domigo/content-loader";
import { getTeacherForPage } from "@/lib/identity";
import { NewItemForm } from "./NewItemForm";

export default async function NewItemPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const units = listApprovedUnits();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 25, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Neue Aufgabe</h1>
        <Link href="/admin/studio" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Studio</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0, lineHeight: 1.5 }}>
        Erstelle eine neue <strong>Vokabel-Aufgabe</strong>. Beim Veröffentlichen löst eine KI deine Aufgabe
        zuerst <strong>blind</strong> durch die echte Bewertungs-Engine — sie geht nur live, wenn die KI
        richtig löst. So kann keine Aufgabe mit falschem Lösungsschlüssel online gehen.
      </p>
      <NewItemForm units={units} />
    </main>
  );
}
