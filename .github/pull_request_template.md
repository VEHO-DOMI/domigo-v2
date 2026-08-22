<!-- Alles unter dieser Zeile darf gelöscht werden, AUSSER der Wächter-Tabelle,
     wenn dieser PR Rendering, Assets, Entities oder den Karten-DOM anfasst.
     Der Job `perf-contract` prüft das. Warum: docs/PERF_WAECHTER.md -->

## Was sich ändert

<!-- Ein Absatz in Kokis Sprache: was ist jetzt anders, und warum ist das gut. -->

## PERF-WÄCHTER

<!-- PFLICHT, sobald packages/game-paint/**, packages/game-2d/**,
     apps/web/public/art/** oder cards/** berührt sind.
     So gemessen (R5-W7 · W6 · R183 — der Server sagt selbst, welchen Bau er zeigt):
       pnpm build && (cd apps/web && VERCEL_GIT_COMMIT_SHA=$(git rev-parse HEAD) npx next start -p <dein Port>)
       node --experimental-strip-types scripts/perf-visible.mjs --port <dein Port> --runs 3 --json vorher.json
       … umbauen, neu bauen, neu starten …
       node --experimental-strip-types scripts/perf-visible.mjs --port <dein Port> --runs 3 --baseline vorher.json
     Die Zeilen »Bau: … · Quelle: …«, die das Werkzeug druckt, GEHÖREN MIT IN DIESEN TEXT:
     ohne sie kann niemand sagen, welche zwei Bauten die Tabelle vergleicht, und zwei
     GLEICHE Bau-Angaben färbt `check-perf-table` rot.
     ⚠ Die Phasen-Zeilen müssen mit »| p1« … »| p9« beginnen — kein Fettdruck vor der
     Phase, sonst findet das Tor die Zeile nicht (H5 ist genau darüber gestolpert).
     Budgets: docs/PERF_WAECHTER.md -->

| Phase | laden (ms) | bau+aufbau (ms) | Erstbild GPU (ms) | eingeschwungen (ms) | fps |
|---|---|---|---|---|---|
| p1 vorher / nachher |  |  |  |  |  |
| p2 vorher / nachher |  |  |  |  |  |
| p3 vorher / nachher |  |  |  |  |  |
| p4 vorher / nachher |  |  |  |  |  |
| p9 vorher / nachher |  |  |  |  |  |

Gemessen auf: <!-- Gerät · Browser · Produktions-Build? · sichtbarer oder verborgener Tab -->

## Prüf-Tore

<!-- Echte Exit-Codes, getrennt geholt: cmd > log 2>&1; echo "EXIT=$?" (P-60) -->

## Was ich NICHT beweisen konnte

<!-- Die ehrliche Liste. Eine Behauptung ohne Beleg ist ein Mangel, kein Fortschritt. -->
