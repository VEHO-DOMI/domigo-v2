# AUFTRAG N6 — „Terrain aus einem Guss" (Codex-Duo-Pilot · Welle 9 · R232)

**STAND: V1 · 2026-08-31.** Deine Selbstauskunft zitiert diese Stand-Zeile in Zeile 1.
Du arbeitest ERSTMALS direkt im Repo (Kokis Entscheid R232): du zeichnest die Kunst,
baust sie selbst ein, SIEHST dein Ergebnis im laufenden Spiel und iterierst, bis es
ein Guss ist. Arbeitswurzel = dieser Worktree (Branch `pb-w9-n6-terrain-guss`,
Basis origin/main `08469bb6`). Du committest NUR auf diesen Branch, nie main, kein Push.

## Der Befund (Kokis rot markierte Screenshots — liegen NEBEN dieser Datei)
`Screenshot 2026-08-23 at 15.22.55.png` (Phase p1) und `…15.26.01.png` (Phase p2):
Das Kapitel-Terrain liest als ZUSAMMENGESETZT, nicht gemalt-als-eines. Die Markierungen
zeigen die Klassen: (a) Holzpfosten stoßen ohne Verbindungsstück in Buchstapel/Platten,
(b) Plattenkanten/Bretter enden im Nichts (keine Kappen/Auflager), (c) Textur-SCHNITTE
mitten im Buchstapel-Fill (Kachelwechsel sichtbar), (d) Platten-Lippen (violette Decks)
treffen Pfosten/Stapel ohne Fuge. Ziel-Satz von Koki: **„wie aus einem Guss —
gezeichnet UND implementiert."**

## Wo alles wohnt (Landkarte, verifiziert)
Assembler `packages/game-paint/src/PaintScene.ts` → `buildTerrain()` (~5200) · Planer
`packages/game-paint/src/mass.ts` (`planMass`) · Kit-Definitionen
`packages/game-paint/src/composition.ts` (`CH01_COMPOSITION`, `massStems`, `crustOf`,
`paintedTrims`, `paintedUnderside`, `PLAT_OBJECTS`) · Glyph→Blatt
`packages/game-paint/src/artManifest.ts#GLYPH_STEMS` · Grids
`content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json` (`phases[].rows`) ·
Kunst-Blätter `apps/web/public/art/g1/paint/ch01/` (mass_body_*, crust_*, plank_loop,
plat_bookpile_*, plat_column2_1 [Pfosten existiert heute NUR p3/p4], mass_edge/corner_*).

## Die Gesetze (unverhandelbar)
1. **STYLE_PAINT_V1** (docs/handover/31 §2): Gouache-Bilderbuch, Papier-Creme-Licht,
   Tinten-Blau-Linien; **G-F: MALEN, NICHT RECHNEN** (keine prozeduralen Filter als
   „Kunst") · **G-A:** saubere AA-Alpha-Kanten, null Magenta in α=0.
2. Neue/geänderte Blätter registrieren sich in `artManifest.ts` und bestehen
   `node scripts/check-paint-art.mjs`; Format-Kette wie Bestand (Recompress-Muster).
3. Du änderst KEIN Gameplay-Verhalten: Kollisions-Grids (`rows`) nur dort anfassen, wo
   ein Verbindungs-Objekt es rein VISUELL verlangt und die Begehbarkeit identisch
   bleibt (`pnpm test` beweist es).
4. **Selbst sehen ist Pflicht:** `pnpm install`, dann nutze die Repo-Werkzeuge
   (package.json: Standbild-/Tape-Skripte der `scripts/`-Familie bzw. dev-Server), um
   GENAU die markierten Stellen VORHER und NACHHER als PNG zu erfassen —
   `docs/n6-auftrag/beweis/` mit `vorher_p1.png / nachher_p1.png / vorher_p2.png /
   nachher_p2.png` + je 2 weiteren Detail-Crops. Iteriere, bis KEIN markierter
   Naht-Typ mehr sichtbar ist.
5. Tore vor Abschluss (Ausgabe in Dateien unter `docs/n6-auftrag/tore/`, je exit+tail):
   `pnpm typecheck` · `pnpm lint` · `pnpm test` · `node scripts/check-paint-art.mjs` ·
   Kompositions-/Seam-Checks der Batterie. ⚠ `&&` nie `;` · keine Pipes auf
   Tor-Erzeugern.
6. **PERF-Vertrag:** jede Berührung von `packages/game-paint/` verlangt im PR-Text die
   Vorher/Nachher-Tabelle an ZWEI Bauten — lege deine Perf-Läufe als Dateien ab
   (`perf_vorher.json`/`perf_nachher.json`, Skripte der scripts/-Familie); den PR öffnet
   der Architekt nach Review, du lieferst die Zahlen.

## Abgabe
Committe in sinnvollen Schritten auf den Branch. Schreibe
`docs/n6-auftrag/LIEFERSCHEIN.md`: Zeile 1 zitiert die Stand-Zeile; dann WAS gezeichnet
(je Blatt: Stem-Name, Maß, wofür), WAS verdrahtet (Dateien+Symbole), Beweis-Bilder-Liste,
Tor-Ergebnisse (echte Ausgaben), »Offene Abweichungen« ehrlich. KEINE Behauptung ohne
eigene Messung. Ende erst, wenn Lieferschein + Beweise + Tore auf der Platte liegen.
Bei Werkzeug-Limit: `CONTINUE AT <Posten>` in den Lieferschein und sauber stoppen.
