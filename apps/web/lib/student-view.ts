/**
 * cgo-047 · DIE SCHÜLERANSICHT — wer sieht die Kinderflächen, und als was.
 *
 * Bis hierher konnte eine Lehrkraft die Schülerseite nicht ansehen, obwohl
 * mehrere Kommentare es behaupteten: `resolveVisibleGrades` gibt seit dach-018
 * ohne Klasse `[]` zurück, also zeigte /play ihr »Nothing here yet«, /practice
 * null Einheiten, und /play/[grade]/[zone] schickte sie auf /signin. Die
 * Zuweisung dieser Datei: EIN Vertrag für jede Kinderfläche, die eine
 * Lehrkraft in echter Schülerdarstellung öffnen darf.
 *
 *   · `student` — ein angemeldetes Kind. Sieht genau den Jahrgang seiner Klasse.
 *     Alles wie bisher: Versuche, Spielstand, Wiederholung werden gespeichert.
 *   · `preview` — eine Lehrkraft ohne Kindersitzung. Sieht alle vier Jahrgänge
 *     (oder einen, über `?jahrgang=`), und es wird NICHTS gespeichert: keine
 *     Versuche, kein Spielstand, kein Leeren der Geräte-Outbox eines Kindes
 *     (lib/preview-attempt.ts). Kinderstatistik und Klassenfortschritt bleiben
 *     unberührt. Ein dauerhafter eigener Lehrertest ist eine EIGENE Spur
 *     (cgo-029: Testklassen-Marker), nicht diese Vorschau.
 *
 * Reihenfolge wie in lib/school-access.ts: das Kind zuerst (nur ein Kind ist
 * jahrgangsgebunden), dann die Lehrkraft. Eine Sitzung, die beides nicht ist,
 * bekommt `null`.
 *
 * Jahrgang des Kindes, fail-closed: eine BEKANNTE Klasse, deren Jahrgang die
 * Datenbank nicht kennt (`getClassGrade` → null), öffnet KEINEN Jahrgang —
 * dieselbe Regel wie lib/school-access.ts und wie dach-018 für die fehlende
 * Klasse. Nur ein Datenbank-Schluckauf beim Lesen bleibt bei der alten
 * Begründung aus lib/grade-scope.ts (alle vier: ein Kind, das nichts falsch
 * gemacht hat, soll keine leere Seite sehen).
 *
 * Getestet über scripts/lib/school-test-harness.mjs mit der echten Identität
 * (lib/student-view.test.ts); ersetzt sind nur Sitzung, Klassenjahrgang, Speicher.
 */
import "server-only";
import { getClassGrade, getDb } from "@domigo/db";
import { getActingUserForPage, getTeacherForPage, type ActingTeacher, type ActingUser } from "./identity";
import { ALL_GRADES } from "./grade-scope";

export type StudentView =
  | { kind: "student"; player: ActingUser; grades: number[] }
  | { kind: "preview"; teacher: ActingTeacher; grades: number[] };

/**
 * Die Jahrgänge einer Lehrer-Vorschau aus `?jahrgang=`. Fehlt der Wert oder ist
 * er kein Jahrgang 1–4, gilt die volle Ansicht — ein falscher Parameter darf
 * die Vorschau nie leer machen und nie einen erfundenen Jahrgang öffnen.
 */
export function previewGradesFrom(raw: unknown): number[] {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value === "string" && /^[1-4]$/.test(value)) return [Number(value)];
  return [...ALL_GRADES];
}

/** Die Jahrgänge eines Kindes — siehe Kopf: unbekannt ⇒ keiner, Schluckauf ⇒ alle. */
async function childGrades(classId: string): Promise<number[]> {
  let grade: number | null;
  try {
    grade = await getClassGrade(getDb(), classId);
  } catch {
    return [...ALL_GRADES];
  }
  return grade === null ? [] : [grade];
}

/**
 * Wer sieht diese Kinderfläche? `jahrgang` ist der rohe `?jahrgang=`-Wert; er
 * wirkt NUR in der Vorschau — ein Kind kann seinen Jahrgang nicht umschalten.
 */
export async function resolveStudentView(jahrgang?: unknown): Promise<StudentView | null> {
  const student = await getActingUserForPage();
  if (student) return { kind: "student", player: student, grades: await childGrades(student.classId) };
  const teacher = await getTeacherForPage();
  if (teacher) return { kind: "preview", teacher, grades: previewGradesFrom(jahrgang) };
  return null;
}

/**
 * cgo-047 Welle 2 · DIE JAHRGANGSWAND EINER SPIELSEITE, als eine Entscheidung
 * (Hub /play/[grade] und Kapitel /play/[grade]/[zone]): wohin muss dieser
 * Betrachter, bevor die Seite Jahrgang `grade` zeigt? `null` heißt: bleiben.
 *   · niemand angemeldet          → /signin
 *   · Lehrer-Vorschau             → bleiben (jeder Jahrgang)
 *   · Kind im eigenen Jahrgang    → bleiben
 *   · Kind in fremdem Jahrgang    → zum eigenen, oder /home ohne bekannten Jahrgang
 * Rein, damit lib/student-view.test.ts sie ohne Datenbank prüft; die Seiten
 * rufen nur sie (lib/play-access-map.test.ts hält das fest).
 */
export function yearRedirect(view: StudentView | null, grade: number): string | null {
  if (!view) return "/signin";
  if (view.kind === "preview" || view.grades.includes(grade)) return null;
  return view.grades.length > 0 ? `/play/${view.grades[0]}` : "/home";
}

/** Speichert diese Ansicht nichts? Nur die Lehrer-Vorschau — nie ein Kind, nie niemand. */
export function isPreview(view: StudentView | null): boolean {
  return view?.kind === "preview";
}

/** A trainer is one grade. A failed class lookup cannot choose a foreign year. */
export function trainerGrade(view: StudentView): number | null {
  const grade = view.kind === "preview" ? view.grades[0] ?? 1 : view.grades.length === 1 ? view.grades[0]! : null;
  return grade !== null && Number.isInteger(grade) && grade >= 1 && grade <= 4 ? grade : null;
}
