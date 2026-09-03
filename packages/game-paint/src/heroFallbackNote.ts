// L0d · R263 · EIN RUECKFALL, DER EIN ANDERES BILD ZEIGT ALS DAS BESTELLTE,
// MELDET SICH.
//
// Der Full-Pose-Zweig in `PaintScene` steht seit PK-R6 so da:
//
//     const full = fullCell !== null && this.textures.exists(...) ? fullCell : null;
//
// Als SCHUTZ ist das richtig: fehlt ein Blatt, zeichnet der zusammengesetzte
// Teile-Baukasten weiter, und das Spiel wird nie schwarz (das Keen-Kunst-Gesetz
// — Kunst landet stapelweise). Als SCHWEIGEN ist es falsch, und es hat teuer
// bezahlt: die 14 hero2-Zellen lagen im Kapitel-Ordner von ch01, also fand sie
// ausser ch01 kein Kapitel, und vier Kapitel-Bahnen haben Raeume gebaut und
// begutachtet, in denen die Figur die alte war. Kein Tor hat es gesagt, kein
// Log, nichts. Gefunden hat es Koki mit dem Auge.
//
// Der Unterschied, auf den es ankommt: ein Blatt, das NIEMAND bestellt hat,
// fehlt zu Recht still (Platzhalter-Doktrin). Ein Blatt, das der Code
// NAMENTLICH verlangt, fehlt nie zu Recht still.
//
// Einmal je Kapitel und Stem, nicht je Bild: der Zweig laeuft 60-mal in der
// Sekunde. Und nur im Entwicklungs-Bau — in der Produktion ist der Zweig tot
// (dasselbe Muster wie `paint.ts` und `DRAW_PROBE` in `PaintScene`), weil eine
// Konsolen-Zeile beim Kind niemandem hilft und die Meldung fuer die Bahn ist,
// die das Kapitel baut.

/** Kapitel/Stem-Paare, die schon gemeldet wurden. Modul-weit, weil die Szene
 *  bei jedem Raumwechsel neu gebaut wird (`PaintGame` stoppt und entfernt sie)
 *  — ein Gedaechtnis in der Szene faenge bei jedem Raum von vorne an und die
 *  Meldung waere wieder eine pro Raum statt eine pro Kapitel. */
const gemeldet = new Set<string>();

/**
 * Die Meldung fuer einen Rueckfall auf den Teile-Baukasten — oder `null`, wenn
 * nichts zu sagen ist (Produktion, oder dieses Paar wurde schon gemeldet).
 *
 * @param stem   die Zelle, die `heroFullCell` NAMENTLICH verlangt hat
 * @param chapter das Kapitel, dessen Kunst-Karte sie nicht auflösen konnte
 */
export const heroFallbackNote = (stem: string, chapter: string): string | null => {
  if (process.env.NODE_ENV === "production") return null;
  const schluessel = `${chapter}/${stem}`;
  if (gemeldet.has(schluessel)) return null;
  gemeldet.add(schluessel);
  return `[DomiGo] Kapitel ${chapter}: die Helden-Zelle "${stem}" fehlt in seiner Kunst-Karte — `
    + `gezeichnet wird der alte Teile-Baukasten. Die hero2-Blaetter gehoeren nach `
    + `apps/web/public/art/g1/paint/hero/ (geteilt), nicht in einen Kapitel-Ordner (L0d · R263).`;
};

/** Nur fuer Tests: das Gedaechtnis leeren. */
export const resetHeroFallbackNotes = (): void => {
  gemeldet.clear();
};
