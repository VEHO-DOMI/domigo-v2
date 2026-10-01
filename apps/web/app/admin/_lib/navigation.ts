/** Existing destinations only. Role switching belongs to cgo-029/cgo-042. */
export const teacherNavigation = [
  { id: "classes", label: "Meine Klassen", href: "/admin" },
  { id: "assignments", label: "Aufgaben", href: "/admin/assignments" },
  { id: "writing", label: "Schreiben", href: "/admin?bereich=schreiben" },
  { id: "management", label: "Verwaltung", href: "/admin?bereich=verwaltung" },
] as const;

export const managementNavigation = [
  { id: "class-management", label: "Klassen verwalten", href: "/admin/classes", description: "Klassenlisten, Beitrittscodes und Archiv öffnen." },
  { id: "assignment-builder", label: "Aufgaben zusammenstellen", href: "/admin/assignments/new", description: "Übungen, Checkups und Schularbeitsproben vorbereiten." },
  { id: "studio", label: "Aufgaben im Studio bearbeiten", href: "/admin/studio", description: "Vorhandene Aufgaben bearbeiten oder eine neue Aufgabe anlegen." },
  { id: "settings", label: "Kontoeinstellungen", href: "/admin/settings", description: "Die Angaben zu deinem Konto nachsehen." },
] as const;

export const additionalNavigation = [
  { id: "mastery", label: "Spielstand nach Chapter", href: "/admin?bereich=spielstand" },
  { id: "try-games", label: "Spiele erproben", href: "/admin?bereich=erproben" },
] as const;

export const helpNavigation = { id: "help", label: "Hilfe", href: "/admin/hilfe" } as const;
export const grandmasterNavigation = { id: "grandmaster", label: "Großmeister: alle Klassen", href: "/admin/grandmaster" } as const;

export type TeacherArea = "classes" | "writing" | "management" | "mastery" | "try-games";
export function teacherArea(value: string | string[] | undefined): TeacherArea {
  switch (value) {
    case "schreiben": return "writing";
    case "verwaltung": return "management";
    case "spielstand": return "mastery";
    case "erproben": return "try-games";
    default: return "classes";
  }
}
