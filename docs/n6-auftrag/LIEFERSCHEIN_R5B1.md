# Lieferschein R5b1 · Stufe 1 (p1 + p2)

**CODEX DRAFT — NOT CANON**
Branch: `pb-w9-n6-terrain-guss`
Commits: `9a6440e8`, `b33c4ff7`, `093701a2`

## Ergebnis

Stufe 1 ist umgesetzt und verdrahtet:

- p1 und p2 besitzen phase-eigene Körper-, Fade-, Tiefen-, Kanten-, Ecken- und Unterseitenblätter.
- Zusammenhängende Massen verwenden über `massComponents` einen gemeinsamen Materialursprung; der frühere laufweise `runTileOffsetX`-Ansatz ist entfernt.
- p1/p2 verwenden `mass_depth_p1` bzw. `mass_depth_p2`; `mass_sediment` bleibt nur in den noch nicht umgemalten Phasen p3/p4/p9.
- `massGrain`, `crustGrain` und `ledgeGrain` werden für p1/p2 über `proceduralGrain: false` nicht mehr als rechteckige Overlay-Schicht gezeichnet. Formspuren bleiben in den Blättern.
- p1/p2 planen keine isolierten `capL`/`capR`-Stücke mehr; Kanten, Ecken und Unterseiten kommen aus der jeweiligen gemalten Familie.
- p2 erkennt hängende Vertikalen und bindet die zwei gelieferten Ein-Stück-Familien: 2×4 Zellen bei `(22,1)` und 2×7 Zellen bei `(55,1)`.
- p2s Möbelband wurde per deklarierter Wertpass-Anweisung auf 17,5 % Luminanz gebracht, damit der neue L3-Abstand ohne Waiver mindestens 12 Punkte bleibt.

## Umbauten und Fundstellen

| Umbau | Stelle | Wirkung |
|---|---|---|
| Gemeinsamer Massen-Verband | `packages/game-paint/src/mass.ts:945–985`, `:1503–1538` | Vier-Nachbarn-Komponenten liefern `minC/minR`; alle Körpersegmente einer Masse teilen Ursprung, Variante und Tint-Verlauf. |
| Hängende/teilhohe Vertikalen | `packages/game-paint/src/mass.ts:774–845`, `:1404–1417`; `packages/game-paint/src/composition.ts:663–673` | `columnRuns(..., { includeHanging: true })` erkennt deckenangehängte Läufe; p2 bindet kurze und lange Pfeiler als je ein Blatt. |
| Tiefenheilung | `packages/game-paint/src/composition.ts:724–737`; PNGs `mass_depth_p1/p2` | Die zwei beauftragten Phasen verwenden lesbare gemalte Tiefe statt der fast-schwarzen gemeinsamen Sedimentsäule. |
| Grain abgeklemmt | `packages/game-paint/src/composition.ts:978–995`; `packages/game-paint/src/PaintScene.ts:5658–5661` | p1/p2 setzen `proceduralGrain: false`; der Overlay-Aufbau kehrt für diese Kits sofort zurück. |
| Kanten/Ecken/Unterseiten | `packages/game-paint/src/composition.ts:912–940`; `:978–988`; `packages/game-paint/src/mass.ts:1564` | Phase-eigene Trim-/Corner-/`edgeD`-Blätter werden geladen; Cap-Ausgabe endet für p1/p2 an `integratedCrustEnds`. |
| p2 L2-Kontrast | `scripts/set-plane-value.mjs:79–88`; `apps/web/public/art/g1/paint/ch01/l2_p2.png` | Deklarierter RGB-Wertpass von 19,06 % auf 17,51 %; p2 L2↔L3 misst danach 12,5 Punkte. |
| Waiver-Abgleich | `scripts/check-composition.mjs:230–273` | p2-Waiver gelöscht und mit Messgrund dokumentiert; p4/p9 bleiben datiert bestehen. |

## Gelieferte Blätter

MD5 ist die Prüfsumme der vollständigen PNG-Datei; Maß ist Breite × Höhe in Pixeln.

| Datei | MD5 | Maß |
|---|---|---:|
| `apps/web/public/art/g1/paint/ch01/l2_p2.png` | `e50526d0761df94cd7318ab2db46a0f7` | 2048 × 382 |
| `apps/web/public/art/g1/paint/ch01/mass_body_p2_a.png` | `ea6fc94dfd3fe7b2f8953c6d7b2565a4` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_body_p2_b.png` | `49dd9d108b9fbe994382a7714b127140` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_corner_p1_bl.png` | `154925325752761e94714735e3efc1bb` | 150 × 148 |
| `apps/web/public/art/g1/paint/ch01/mass_corner_p1_br.png` | `483fc4d76ba5965512615be24739536b` | 150 × 147 |
| `apps/web/public/art/g1/paint/ch01/mass_corner_p2_bl.png` | `60855aa96823086b0633d00e82de43ff` | 149 × 147 |
| `apps/web/public/art/g1/paint/ch01/mass_corner_p2_br.png` | `e4cf637a86592592901ceac1076eae4b` | 149 × 146 |
| `apps/web/public/art/g1/paint/ch01/mass_depth_p1.png` | `e783b8efcc033ea13d8d291eaa83c164` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_depth_p2.png` | `95718f2f66cdf7f930c8ff0d1dd17c10` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_edgeD_p1_l.png` | `6722d8d846e9f307d4663c9ae3311ba2` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_edgeD_p1_r.png` | `693b79593d750f46fe9a2636b3ee9e5f` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_edgeD_p2_l.png` | `0dbd0338d9a1482fee00e2d4aba7d16f` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_edgeD_p2_r.png` | `0adec5b265b23449d23654a867dfcc9e` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_edge_p1_l.png` | `eefaf52f6ac0462b181f07d1fe6c9b38` | 248 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_edge_p1_r.png` | `aecb601906fef2b744f1570577b1371f` | 248 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_edge_p2_l.png` | `c13935d9f077c67ac8cd5de2d7493e75` | 248 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_edge_p2_r.png` | `6e948672c0198e21ecdc93706e7abc41` | 248 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_fade_p2_a.png` | `18aae5b000327aad9cac745dd1cafe42` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_fade_p2_b.png` | `6678f00bf4a4d5d1cf9a7a68cb3a110f` | 512 × 512 |
| `apps/web/public/art/g1/paint/ch01/mass_incorner_p1_l.png` | `287cb71302be61faa8e5bdfc3518666d` | 150 × 145 |
| `apps/web/public/art/g1/paint/ch01/mass_incorner_p1_r.png` | `81d668517da9105d7e9b320a2e35348e` | 150 × 127 |
| `apps/web/public/art/g1/paint/ch01/mass_incorner_p2_l.png` | `7ba6514839cfd3491e8027de7518084f` | 149 × 144 |
| `apps/web/public/art/g1/paint/ch01/mass_incorner_p2_r.png` | `6d20782709c82c9c74355bf5513da7fb` | 149 × 126 |
| `apps/web/public/art/g1/paint/ch01/terrain_hanging_pillar_p2.png` | `345d748e0e9d10c8077782b80d7908d3` | 397 × 1389 |
| `apps/web/public/art/g1/paint/ch01/terrain_hanging_pillar_p2_short.png` | `bd5b24d5ddb41d6cc5e07559deb53597` | 397 × 794 |

## Tore

| Tor | Kommando | Ergebnis |
|---|---|---|
| Test | `pnpm test` | Exit 0; 1.470/1.470 game-paint-Tests bestanden, Volltestlauf grün |
| Paint-Art | `pnpm check:paint-art` | Exit 0; 200 benötigte Stems vorhanden, 382/382 PNGs ohne Farbschlüssel-Saum |
| Composition | `node scripts/check-composition.mjs` | Exit 0; 11 Audits grün, p2 L2↔L3 = 12,5 Punkte |
| TypeScript | `pnpm typecheck` | Exit 0 |
| Lint | `pnpm lint` | Exit 0 |
| Seams | `node scripts/check-png-seams.mjs` | Exit 0; 40 deckende Kacheln geprüft, bestehende 9 datierte Duldungen gemeldet |
| Performance | `node scripts/check-perf-budget.mjs` | Exit 0; p2 29,5/35 MB |
| Level-Design | `pnpm check:level-design` | Exit 0 |
| Build | `pnpm build` | Exit 0; Next-Produktionsbuild erstellt |

## Ehrliche offene Reste

- Die neun bestehenden, bis 2026-11-30 datierten Naht-Duldungen der älteren crust-Lieferungen bleiben bestehen; R5b1 heilt die p1/p2-Massenfamilie, nicht die alte crust-Lieferung.
- `check-paint-art` meldet weiterhin 58 ältere, ungenutzte Bildstems (37,9 MB). Sie wurden nicht stillschweigend gelöscht, weil sie außerhalb von Stufe 1 liegen.
- p3/p4/p9 verwenden weiterhin den gemeinsamen Massensatz und das prozedurale Grain; das ist die nächste Phase, nicht Teil von p1+p2.
- Die alten p1/p2-Cap-Dateien bleiben als geladene Kompatibilitätsstems im Manifest; `planMass` zeichnet für p1/p2 jedoch keine isolierten Caps mehr.
- Die interaktive Browser-Sichtprüfung konnte in dieser Umgebung nicht erneut ausgeführt werden, weil kein Browser-Backend verfügbar war. Alle headless Bild-, Kompositions- und Build-Tore sind grün.
- pnpm meldet in dieser Umgebung wiederholt die Engine-Warnung „Node >=24 erwartet, aktuell Node 22.23.1“; sie ändert keinen der Exit-Codes.
