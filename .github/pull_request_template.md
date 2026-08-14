<!-- Alles unter dieser Zeile darf gelöscht werden, AUSSER der Wächter-Tabelle,
     wenn dieser PR Rendering, Assets, Entities oder den Karten-DOM anfasst.
     Der Job `perf-contract` prüft das. Warum: docs/PERF_WAECHTER.md -->

## Was sich ändert

<!-- Ein Absatz in Kokis Sprache: was ist jetzt anders, und warum ist das gut. -->

## PERF-WÄCHTER

<!-- PFLICHT, sobald packages/game-paint/**, packages/game-2d/**,
     apps/web/public/art/** oder cards/** berührt sind.
     So gemessen:  pnpm build && (cd apps/web && npx next start -p <dein Port>)
                   node --experimental-strip-types scripts/measure-create.mjs --port <dein Port>
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
