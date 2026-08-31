**STAND: V1 · 2026-08-31.**

# CODEX DRAFT — NOT CANON

## N6 · Terrain aus einem Guss

Dieser Lieferschein dokumentiert einen ehrlichen Zwischenstand auf `pb-w9-n6-terrain-guss`. Die Bild- und Planänderung ist vorbereitet und statisch geprüft; die verpflichtende Sichtprüfung im laufenden Spiel konnte wegen fehlender lokaler Abhängigkeiten nicht abgeschlossen werden.

## Gezeichnet

| Blatt | Maß | Verwendung |
| --- | --- | --- |
| `terrain_join_bookbinder.png` | 320 × 220 px, RGBA | Ein gemalter Buchbinder-/Sattelverbinder an den äußeren Enden eines zusammenhängenden Plattform-Objektlaufs; links gespiegelt, rechts ungespiegelt. |

Das Blatt liegt unter `apps/web/public/art/g1/paint/ch01/terrain_join_bookbinder.png`. Es wurde als flache Chroma-Key-Vorlage erzeugt, danach wurde der Hintergrund transparent entfernt und die Kante mit einem 1-Pixel-Edge-Contract (ein Randverfahren, das Farbsäume aus transparenten Pixeln zurückzieht) bereinigt. Eigene Messung: `partial=1468`, `green-fringe=0`, `magenta-in-alpha0=0`.

## Implementiert

- `artManifest.ts`: Stem (der eindeutige Bildname im Art-Manifest) `terrain_join_bookbinder` registriert.
- `composition.ts`: `MassKit.joint`, Aufnahme in `massStems`, und Verdrahtung in `sharedMass` für die ch01-Phasen.
- `mass.ts`: neues visuelles `joint`-Teil; `platformJoinPieces` setzt je zwei Verbinder an die Außenenden zusammenhängender Plattformgruppen; `planMass` ruft den Plan nach der Plattformbelegung auf.
- `PaintScene.ts`: `flipX` wird beim Bild-Teil berücksichtigt, damit linker und rechter Anschluss dieselbe Grafik spiegelbildlich nutzen.
- `composition.test.ts`: prüft zwei Außenverbinder, keine Innennaht, korrekte Spiegelung und Skalierung.

Keine Levelzeile, Simulations- oder Kollisionslogik wurde geändert. Die Walkability bleibt deshalb daten- und code-seitig unverändert.

Eigene kopflose Planprüfung (ohne Browser):

| Phase | geplante Verbinder |
| --- | ---: |
| p1 | 18 |
| p2 | 14 |
| p3 | 14 |
| p4 | 0 |
| p9 | 8 |

## Beweisbilder

Vorher liegt als Kopie der beiden gelieferten Belege vor:

- `beweis/vorher_p1.png`
- `beweis/vorher_p1_detail_1.png`
- `beweis/vorher_p1_detail_2.png`
- `beweis/vorher_p2.png`
- `beweis/vorher_p2_detail_1.png`
- `beweis/vorher_p2_detail_2.png`

`nachher_p1.png`, `nachher_p2.png` und die vier Nachher-Detailausschnitte fehlen noch. Ohne laufendes Spiel wäre jede solche Datei eine Behauptung statt eines Belegs.

## Tore

Die gespeicherten Ausgaben liegen unter `docs/n6-auftrag/tore/`. Ein Exit-Code (die Zahl, mit der ein Kommando seinen Erfolg oder Fehlschlag meldet) von `0` bedeutet bestanden.

| Gate | Exit | Ergebnis |
| --- | ---: | --- |
| `pnpm typecheck` | 1 | blockiert durch nicht auflösbare Installation/Registry; Node meldet zusätzlich Engine-Anforderung `>=24`, lokal ist `v22.23.1` aktiv |
| `pnpm lint` | 1 | blockiert durch dieselbe nicht auflösbare Installation |
| `pnpm test` | 1 | blockiert durch dieselbe nicht auflösbare Installation |
| `node scripts/check-paint-art.mjs` | 1 | `ERR_MODULE_NOT_FOUND`: Paket `pngjs` fehlt, weil die Installation nicht fertig wurde |
| `node scripts/check-png-seams.mjs` | 1 | `ERR_MODULE_NOT_FOUND`: Paket `pngjs` fehlt |
| `node scripts/check-composition.mjs` | 1 | `ERR_MODULE_NOT_FOUND`: Paket `pngjs` fehlt |
| `node scripts/perf-visible.mjs --selftest` | 0 | Selbsttest bestanden; keine Laufzeitmessung |

Die beiden geforderten Performance-Dateien (`perf_vorher.json`, `perf_nachher.json`) enthalten deshalb ausdrücklich `NOT_MEASURED` und keine erfundenen Zahlen.

## Offene Abweichung und Fortsetzung

**CONTINUE AT D — Laufzeitbeweis:** Abhängigkeiten installieren, Paint-Devserver starten, exakt die markierten p1-/p2-Stellen vor/nachher aufnehmen, je zwei Nachher-Details ergänzen und visuell iterieren, bis keine markierte Naht mehr sichtbar ist.

**CONTINUE AT E — Abschlussgates:** `typecheck`, `lint`, `test`, Paint-/Seam-/Composition-Gates und die Zwei-Build-Performance-Messung mit echten Zahlen erneut ausführen; danach diesen Lieferschein aktualisieren.

Dieser Stand ist ein **CODEX DRAFT — NOT CANON** und wurde nicht nach `main` gepusht.

## Commit-Hinweis

Der Commit wird nach diesem R233-Update auf `pb-w9-n6-terrain-guss` geschrieben. Ein Push nach `main` oder in ein Remote erfolgt nicht.

## UPDATE R233 · Fortsetzung ausgeführt

- `pnpm install`: **PASS**, 445 Pakete installiert; die Warnung Node `>=24` gegen lokal `v22.23.1` wurde toleriert wie beauftragt.
- `pnpm typecheck`: **PASS** (Exit 0), nach Korrektur einer echten Gruppentypisierung in `mass.ts`.
- `pnpm lint`: **PASS** (Exit 0).
- `pnpm test`: **PASS** (Exit 0) im Wiederholungslauf; vorheriger Lauf hatte 1.463 bestandene Tests plus einen Vitest-Worker-Timeout.
- `node scripts/check-paint-art.mjs`: **PASS** (Exit 0); der neue Stem ist enthalten, 340 Stems sind fringe-frei.
- `node scripts/check-png-seams.mjs`: **PASS** (Exit 0); 34 deklarierte Kacheln geprüft, 9 bestehende Ausnahmen datiert geduldet.
- `node scripts/check-composition.mjs`: **PASS** (Exit 0); 11 Audits über 5 Phasen.
- `pnpm build`: **PASS** (Exit 0).

Der Headless-Standbildversuch wurde für p1 und p2 mit dem Repo-Werkzeug ausgeführt und jeweils mit Exit 1 protokolliert: Chrome beendet sich mit `SIGABRT`, bevor der DevTools-Port geöffnet wird. Die Browser-Steuerung hatte ebenfalls keine verfügbare Browserfläche. Deshalb wurden **keine** `nachher_p1.png`/`nachher_p2.png` und keine Detail-Crops erzeugt; ein visueller Abschluss ist nicht behauptet.

Die Performance-Läufe wurden gegen Dev- und Produktionsserver versucht und jeweils vor der Messseite durch denselben Chrome-`SIGABRT` beendet. `perf_vorher.json` und `perf_nachher.json` bleiben daher korrekt `NOT_MEASURED`; es gibt keine erfundenen Vorher-/Nachher-Zahlen.

Die vollständigen Roh-Ausgaben, Exit-Codes und Tails liegen unter `docs/n6-auftrag/tore/`, einschließlich `shoot-world-p1.*`, `shoot-world-p2.*`, `perf-visible-after.*`, `perf-visible-after-build.*` und `build-after.*`.

**CONTINUE AT D/E bleibt offen:** Chrome/Browserlaufzeit muss verfügbar werden; danach Nachher-Beweise an denselben markierten Stellen, Detail-Crops und echte Zwei-Build-Perf-Zahlen erzeugen. Erst dann ist der visuelle Auftrag abgeschlossen.
