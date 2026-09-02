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
 * ★ DIE ABFRAGE REIST MIT — und das ist gemessen, nicht vorsichtshalber.
 *
 * Die erste Fassung leitete auf `/play/1/buch/ch01` um und liess die Abfrage
 * fallen. Jedes Tor blieb grün: die Route antwortet, die Seite rendert, die
 * Tests laufen. Gefallen ist erst der PERF-Vertrag — sein Werkzeug ruft
 * `?phase=p2&perf=1` auf, und alle fünf Phasen meldeten »die Szene wurde nie
 * fertig geladen (Lehrer-Tür zu?)«. Dieselben Parameter sind die ganze
 * Lehrer-Debug-Tür (`phase` · `grid` · `perf` · `karten` · `karte` · `warm`);
 * eine Weiterleitung, die sie verschluckt, nimmt jedem gespeicherten Link
 * genau das, wofür er gespeichert wurde.
 *
 * Bewusst FEST auf ch01 und nicht auf „das erste Kapitel der Liste": diese
 * Adresse hat immer das erste Kapitel des Buchs gemeint, und ein Entwurf, der
 * alphabetisch davor landete, würde sonst still zum neuen Ziel.
 */
import { redirect } from "next/navigation";

export default async function BuchIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ grade: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { grade } = await params;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(await searchParams)) {
    if (typeof v === "string") q.append(k, v);
    else if (Array.isArray(v)) for (const one of v) q.append(k, one);
  }
  const rest = q.toString();
  redirect(`/play/${grade}/buch/ch01${rest === "" ? "" : `?${rest}`}`);
}
