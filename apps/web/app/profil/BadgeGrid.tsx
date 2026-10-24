"use client";
import type { StudentBadgeId } from "@domigo/db";
import { useTrainerLanguage } from "@/lib/trainer/preferences";
import { STUDENT_BADGES } from "@/lib/trainer/badges";
import styles from "./BadgeGrid.module.css";

/** Display server verdicts only. Preview never inherits an account's badges. */
export default function BadgeGrid({ earned, grade, preview }: { earned: readonly StudentBadgeId[] | null; grade: number; preview: boolean }) {
  const de = useTrainerLanguage(grade) === "de";
  const confirmed = preview ? [] : earned;
  return <section className={styles.section} aria-labelledby="badge-title">
    <h2 id="badge-title">{de ? "Deine Abzeichen" : "Your badges"}</h2>
    <p>{preview ? (de ? "Vorschau — noch keine Abzeichen verdient." : "Preview — no badges earned.") : confirmed === null ? (de ? "Deine Abzeichen konnten gerade nicht geladen werden." : "Your badges could not be loaded right now.") : (de ? `${confirmed.length} von 7 verdient` : `${confirmed.length} of 7 earned`)}</p>
    <ul className={styles.grid}>{STUDENT_BADGES.map(badge => {
      const has = confirmed?.includes(badge.id) === true;
      return <li key={badge.id} className={styles.badge} data-badge-id={badge.id} data-earned={has}>
        <span className={styles.icon} aria-hidden="true">{badge.icon}</span>
        <strong>{de ? badge.de : badge.en}</strong>
        <span className={styles.status}>{confirmed === null ? (de ? "Nicht geladen" : "Not loaded") : has ? (de ? "Verdient" : "Earned") : (de ? "Noch offen" : "Not yet earned")}</span>
        <p>{de ? badge.whyDe : badge.whyEn}</p>
      </li>;
    })}</ul>
  </section>;
}
