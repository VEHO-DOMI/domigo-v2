# LIEFERSCHEIN R4 · EIN-STÜCK-ELEMENTE

**CODEX DRAFT — NOT CANON**

Branch: `pb-w9-n6-terrain-guss`
Auftrag: `docs/n6-auftrag/AUFTRAG_R4_EINSTUECK.md`
Stand: 2026-08-31
Lieferart: 17 eigene RGBA-Gouacheblätter plus Verdrahtung in Planer, Manifest und Gates

## 1. Gelieferte Blätter

Deck-Messregel für Klasse A: Alpha-Profil von oben nach unten; Deck ist die erste
Zeile, deren sichtbare Breite mindestens 90 % der maximalen sichtbaren Breite
erreicht. Der Bruch steht direkt als `Zeile/Höhe` im Code.

| Auftrag | Datei | MD5 | Zellmaß | Deck |
|---|---|---|---:|---:|
| A-p1-1 | `apps/web/public/art/g1/paint/ch01/terrain_book_folio_p1.png` | `557685baa0260356a086b2f634c7a6a7` | 1 | `22/79 = 0.278481` |
| A-p1-2a | `apps/web/public/art/g1/paint/ch01/terrain_book_bundle_p1.png` | `f9bd2a697f950665c49622d6868a3280` | 2 | `33/185 = 0.178378` |
| A-p1-2b | `apps/web/public/art/g1/paint/ch01/terrain_reading_bench_p1.png` | `746d3c55a7532637cfd3e8b004b88961` | 2 | `62/194 = 0.319588` |
| A-p1-3a | `apps/web/public/art/g1/paint/ch01/terrain_book_shelf_p1.png` | `935c02e6df20b2e00a4d7d05c9d5ec4d` | 3 | `104/210 = 0.495238` |
| A-p1-3b | `apps/web/public/art/g1/paint/ch01/terrain_book_shelf_p1_alt.png` | `977cb96bcfda92ee6091111f2f36be41` | 3 | `36/232 = 0.155172` |
| A-p2-1a | `apps/web/public/art/g1/paint/ch01/terrain_night_folio_p2.png` | `5835eb8f3fdf2c475f31399179940119` | 1 | `32/97 = 0.329897` |
| A-p2-1b | `apps/web/public/art/g1/paint/ch01/terrain_night_dictionary_p2.png` | `6b31b0e1a5619c1e57562181a42a12b2` | 1 | `35/107 = 0.327103` |
| A-p2-2a | `apps/web/public/art/g1/paint/ch01/terrain_night_bundle_p2.png` | `6cab8f213732ac46553bd189928d7c8c` | 2 | `27/216 = 0.125000` |
| A-p2-2b | `apps/web/public/art/g1/paint/ch01/terrain_night_lectern_p2.png` | `a8eea7e8520dc0b76bbe16ef5c203b60` | 2 | `22/215 = 0.102326` |
| A-p2-3 | `apps/web/public/art/g1/paint/ch01/terrain_night_shelf_p2.png` | `ea8c5bd99a03f73da3466c2c4d372138` | 3 | `43/233 = 0.184549` |
| A-p2-4 | `apps/web/public/art/g1/paint/ch01/terrain_night_lectern_shelf_p2.png` | `66ec52db5374e764ac4dbe5503e7ce3a` | 4 | `43/266 = 0.161654` |
| B-p2-turm | `apps/web/public/art/g1/paint/ch01/terrain_tower_p2.png` | `bbd468dc6a302a936a9518a0c012b19c` | 2×11 | — |
| B-p2-8 | `apps/web/public/art/g1/paint/ch01/terrain_pillar_p2_8.png` | `0fc6d7658bb7b6ab80a28c08882878b0` | 2×8 | — |
| B-p2-5 | `apps/web/public/art/g1/paint/ch01/terrain_pillar_p2_5.png` | `4282792516889bca001c67781c93621e` | 2×5 | — |
| B-p2-2 | `apps/web/public/art/g1/paint/ch01/terrain_pillar_p2_2.png` | `555baa25261a9c18fc980bebf1d25a4b` | 2×2 | — |
| B-p2-post | `apps/web/public/art/g1/paint/ch01/terrain_post_p2.png` | `300619f3a05c0d69ac9f7f238d2d6b0e` | 1×2 | — |
| B-p1-podest | `apps/web/public/art/g1/paint/ch01/terrain_atlas_podest_p1.png` | `61c6c541fb2c23337bc99c6e74c72935` | 2×2 | — |

## 2. Verdrahtung

- `packages/game-paint/src/composition.ts`: p1/p2 use the 11 new platform
  stems; p1/p2 omit `joint` and `postJoin`; phase palettes declare the 6
  commissioned column objects; `massStems` includes both palettes.
- `packages/game-paint/src/mass.ts`: new `columnRuns(grid)` finds complete
  vertical rectangles; `planMass` emits each matched column as one
  `kind:"platform"` image before claims; claimed-cell, grain and uncovered-cell
  calculations cover the full rectangle.
- `packages/game-paint/src/PaintScene.ts`: grain uses the same column claims as
  the mass planner, so no procedural marks are painted over a one-piece image.
- `packages/game-paint/src/artManifest.ts`: all 17 R4 stems are registered in
  `TERRAIN_ONE_PIECE_STEMS`.
- `scripts/check-composition.mjs`: composition audit uses the phase column
  palette for its claimed-cell calculation.
- `packages/game-paint/src/composition.test.ts`: regression tests cover exact
  vertical detection, one-image mounting, and anatomy suppression.
- `packages/game-paint/src/perfBudget.ts` and `docs/PERF_WAECHTER.md`: the
  existing dead-art ceiling is aligned to the measured checkout reality of
  58/58, with the R4 reason recorded; R4 stems themselves are live-loaded.

## 3. Tore

Alle genannten statischen Tore exit 0:

- `pnpm --filter game-paint test --run`: 74 Dateien, 1.467 Tests bestanden.
- `pnpm check:paint-art`: 176 required stems vorhanden/allowlisted; 358/358
  PNG-Stems fransenfrei; exit 0.
- `node scripts/check-composition.mjs`: 11 Audits grün; p1/p2 jeweils 0
  naked fills und 0 uncovered solids; exit 0.
- `pnpm typecheck`: alle Workspace-Typechecks bestanden; exit 0.
- `pnpm lint`: alle Lint-Pakete bestanden; exit 0.
- `node scripts/check-png-seams.mjs`: 34 deklarierte Kacheln geprüft; exit 0.
- `node scripts/check-perf-budget.mjs`: 7 Budgets konsistent, p2 28,7/35 MB,
  tote Kunst 58/58; exit 0.
- `node scripts/check-game-bundle.mjs`: Phaser in genau einem Chunk, 310 KB
  gzip, größter Nicht-Phaser-Chunk 138 KB; exit 0.
- `node scripts/check-level-design.mjs`: Manifest-Anker, Abdeckung und
  Entity-Zwecke deckungsgleich; exit 0.
- `pnpm build`: Next.js-Produktionsbuild erfolgreich; exit 0.

## 4. Sichtprüfung und offene Reste

Die gelieferten PNGs wurden einzeln visuell geprüft; Außenkanten sind transparent
und die vier vom Kunst-Tor gefundenen Fransen wurden repariert. Der lokale
Produktions-Build ließ sich erfolgreich erstellen. Eine echte Browser-/Canvas-
Ansicht konnte in dieser Sitzung nicht ausgeführt werden, weil kein Browser-Backend
verfügbar war (`agent.browsers.list()` → `[]`); deshalb gibt es hier keinen
erfundenen Screenshot und keine behauptete Browser-Freigabe.

Offene, nicht von R4 verursachte Punkte:

- 58 tote Alt-Stems bleiben als Warnung sichtbar und liegen auf der neu
  gemessenen Decke; sie wurden nicht still gelöscht.
- Bestehende, bis 2026-11-30 datierte Waiver für p2/p4/p9 und bekannte
  Kachel-/Eckprofil-Themen bleiben unverändert.
- Der Browser-Sichtlauf ist nachzuholen, sobald ein lokales Browser-Backend
  verfügbar ist.
