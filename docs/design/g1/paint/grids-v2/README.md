# ch01 phase grids — STILLGELEGT (R5-P1, D-8-Auflösung)

Dieses Verzeichnis hielt eine Hand-Kopie der fünf Phasen-Grids und behauptete
Deep-Equal mit dem shipped Level. P0 fand die Kopie GEDRIFTET (alte Copy,
andere Arena, fehlende Buchstaben — D-8): eine dritte Ablage ohne Konsument
und ohne Maschinen-Check IST eine Drift-Maschine.

**Das R5-P1-Regime ersetzt den Spiegel durch eine geprüfte Zwei-Ablagen-Ordnung:**

- **Design-Kanon:** `../ch01-dossiers-v2/` — je Phase ein gegatetes Dossier;
  §10 ist der Bau-Vertrag (Endwerte, Zelle für Zelle). Als-gebaut-Abweichungen
  stehen MARKIERT im Dossier selbst.
- **Bau-Wahrheit:** `content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json`
  — das eine File, das die Engine lädt.
- **Die Bindung ist maschinell:** `pnpm check:level-design` prüft Manifest-Anker
  Dossier↔Level in beide Richtungen (plus Stem-Dedup und Vokabel-Abdeckung);
  `checkLevelLaws` + Proof-Tapes prüfen die Bau-Wahrheit selbst.

Es gibt nichts mehr, das hier synchron zu halten wäre — genau das ist der Fix
der Klasse, nicht der Instanz.
