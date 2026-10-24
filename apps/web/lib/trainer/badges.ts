import type { StudentBadgeId } from "@domigo/db";

/** Original seven identities; descriptions follow GG's cgo-156 ruling. No scoring here. */
export const STUDENT_BADGES: readonly { id: StudentBadgeId; icon: string; de: string; en: string; whyDe: string; whyEn: string }[] = [
  { id: "streak-3", icon: "📅", de: "3-Tage-Serie", en: "3-Day Streak", whyDe: "Für eine Lernserie von mindestens 3 Tagen.", whyEn: "For a recorded learning streak of at least 3 days." },
  { id: "streak-7", icon: "⚡", de: "Wochenserie", en: "Weekly Warrior", whyDe: "Für eine Lernserie von mindestens 7 Tagen.", whyEn: "For a recorded learning streak of at least 7 days." },
  { id: "prestige-1", icon: "⭐", de: "Prestige I", en: "Prestige I", whyDe: "Für mindestens 30.000 gesammelte Vokabel-XP.", whyEn: "For at least 30,000 vocabulary XP earned." },
  { id: "prestige-2", icon: "⭐⭐", de: "Prestige II", en: "Prestige II", whyDe: "Für mindestens 45.000 gesammelte Vokabel-XP.", whyEn: "For at least 45,000 vocabulary XP earned." },
  { id: "prestige-3", icon: "⭐⭐⭐", de: "Prestige III", en: "Prestige III", whyDe: "Für mindestens 65.000 gesammelte Vokabel-XP.", whyEn: "For at least 65,000 vocabulary XP earned." },
  { id: "duo-champion", icon: "🏅", de: "Duell-Champion", en: "Duo Champion", whyDe: "Für mindestens 5 gewonnene Wortduelle.", whyEn: "For at least 5 Word Duels won." },
  { id: "daily-first", icon: "🌅", de: "Tagesstarter", en: "Daily Challenger", whyDe: "Für deinen ersten gespeicherten Versuch in der täglichen Challenge.", whyEn: "For your first submitted and saved attempt in the daily challenge." },
];
