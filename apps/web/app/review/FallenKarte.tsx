import Link from "next/link";
import { LearningText } from "@/lib/trainer/LearningShell";
import { loadTrapRegistry } from "@domigo/content-loader";
import { trapLabel, type StudentTrapCount } from "@domigo/db";

/** The root layout's registry projection is private to task-ui's context.
 * Use the same three fields here on the server; no extra registry data ships.
 */
export default function FallenKarte({ traps }: { traps: StudentTrapCount[] }) {
  const recurring = traps.filter((trap) => trap.count >= 2).slice(0, 3);
  if (recurring.length === 0) return null;
  const known = new Map((loadTrapRegistry()?.traps ?? []).map((trap) => [trap.id, {
    nameDe: trap.nameDe, icon: trap.icon, oneLinerDe: trap.oneLinerDe,
  }]));

  return (
    <section aria-labelledby="student-traps-title" style={{ marginTop: 24, marginBottom: 28 }}>
      <h2 id="student-traps-title" style={{ fontSize: 20, fontFamily: "var(--font-display)", color: "var(--ink)" }}><LearningText de="Deine häufigsten Fallen" en="Patterns to revisit" /></h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
        {recurring.map((trap) => {
          const label = trapLabel(known, trap.trapId);
          const chapter = trap.unitSlug.match(/-u(\d+)$/)?.[1];
          return (
            <li key={trap.trapId} className="dg-tile" style={{ padding: "16px 18px", overflowWrap: "anywhere" }}>
              <h3 lang="de" style={{ margin: 0, fontSize: 17, fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                {label.icon && <span aria-hidden="true">{label.icon} </span>}{label.nameDe}
              </h3>
              <p style={{ margin: "6px 0", fontSize: 14, color: "var(--text-secondary)" }}><LearningText de={`${trap.count}-mal in den letzten 30 Tagen`} en={`${trap.count} times in the last 30 days`} /></p>
              {label.oneLinerDe && <p lang="de" style={{ margin: "8px 0", lineHeight: 1.5 }}>{label.oneLinerDe}</p>}
              <Link href={`/practice/${trap.unitSlug}`} style={{ display: "inline-block", padding: "10px 0", color: "var(--ink)", fontWeight: 600 }}>{chapter ? `Chapter ${Number(chapter)}` : "Chapter"} <LearningText de="üben →" en="practice →" /></Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
