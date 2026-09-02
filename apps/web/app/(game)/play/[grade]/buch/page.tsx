/**
 * /play/[grade]/buch — L0 · D1 · DER ALTE EINGANG.
 *
 * Bis zur Level-Welle war DIES die Spielseite, und sie lud „ch01" als festen
 * Text. Das Kapitel ist jetzt ein eigenes Adress-Segment (`buch/[chapter]`),
 * und diese Datei bleibt als Weiterleitung stehen, damit jeder bestehende Link
 * weiter trägt: Kokis Lesezeichen, die Karten im Admin-Bereich, die Rezepte in
 * `docs/PERF_WAECHTER.md` und jede Perf-Messung, die auf einer älteren Zeile
 * steht. Ein 404 an dieser Stelle wäre ein selbstgemachter Bruch.
 *
 * Bewusst FEST auf ch01 und nicht auf „das erste Kapitel der Liste": diese
 * Adresse hat immer das erste Kapitel des Buchs gemeint, und ein Entwurf, der
 * alphabetisch davor landete, würde sonst still zum neuen Ziel.
 */
import { redirect } from "next/navigation";

export default async function BuchIndexPage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade } = await params;
  redirect(`/play/${grade}/buch/ch01`);
}
