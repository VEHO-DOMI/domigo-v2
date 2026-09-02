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

## UPDATE-2 R233-Runde 3 · Pfosten-Anschlüsse und Innenmasse

**STAND: V1 · 2026-08-31.**

Die zwei vom Architekten offen gelassenen Klassen sind statisch umgesetzt:

- Neues gemaltes Blatt `terrain_post_saddle.png`, 320 × 265 px, RGBA: ein ochre-/cremefarbener Buchbinder-Sattel mit tintenblauer Klammer und Holzpfosten. Es wird unter Plattform-Lippen und an freiliegenden oberen Seiten erhöhter Stapelmassen eingesetzt. Der Alpha-Farbrand wurde mit dem Repo-Werkzeug bereinigt; `check-paint-art` bestätigt den Stem ohne Magenta-/Grünsaum.
- `artManifest.ts` registriert `terrain_post_saddle`; `composition.ts` führt `MassKit.postJoin` und `massStems`; `mass.ts` führt den visuellen `postJoin`-Typ und `postJoinPieces` ein. Plattformgruppen erhalten nur Außenstützen; Innenobjektgrenzen bekommen keine Doppelstütze. Die Anschlüsse beanspruchen keine Rasterzelle.
- Die Innenmasse erhält pro zusammenhängendem Lauf einen deterministischen Quellpixel-Versatz (`tileOffsetX`). Alle Segmente desselben Laufs bleiben kontinuierlich; getrennte Läufe beginnen an unterschiedlichen Stellen desselben unveränderten Blatts. Kein p1-Familienblatt wurde transformiert oder übermalt.
- `composition.test.ts` prüft Plattform-/Massen-Sättel und den Lauf-Versatz; fokussiert 107/107 Tests bestanden. Der headless Plan weist aus: p1 `joints=18, posts=23`, p2 `joints=14, posts=21`, p3 `joints=14, posts=29`.

Keine Levelzeile, Simulations-, Kollisions- oder Gameplay-Logik wurde geändert.

### Tore Runde 3

Alle statischen Pflichtgates bestanden mit Exit 0; die vollständigen Roh-Ausgaben liegen unter `docs/n6-auftrag/tore/`:

| Gate | Exit | Beleg |
| --- | ---: | --- |
| `pnpm typecheck` | 0 | `typecheck-r3.out` / `.exit` |
| `pnpm lint` | 0 | `lint-r3.out` / `.exit` |
| `pnpm test` | 0 | `test-r3.out` / `.exit` |
| `pnpm check:paint-art` | 0 | `check-paint-art-r3.out` / `.exit` |
| `node scripts/check-png-seams.mjs` | 0 | `check-png-seams-r3.out` / `.exit` |
| `node scripts/check-composition.mjs` | 0 | `check-composition-r3.out` / `.exit` |
| `pnpm build` | 0 | `build-r3.out` / `.exit` |
| headless Planprüfung | 0 | `headless-plan-r3.out` / `.exit` |

`pnpm install` war zuvor erfolgreich; die Engine-Warnung Node `>=24` bei lokalem Node `v22.23.1` wurde wie beauftragt toleriert.

### Sicht- und Performance-Belege Runde 3

Die Repo-Standbildläufe wurden erneut ausgeführt:

- p1: `shoot-world-r3-p1.out` / `.exit`, Exit 1
- p2: `shoot-world-r3-p2.out` / `.exit`, Exit 1

Beide Läufe scheitern vor dem ersten Bild mit `Chrome hat seinen Debug-Port nie geöffnet`; die Ursache ist im Tail als Chrome-`SIGABRT` dokumentiert. Deshalb liegen weiterhin keine `nachher_p1.png`, `nachher_p2.png` oder Nachher-Detail-Crops vor. Der Host-Sichtbeweis bleibt beim Architekten.

Der aktuelle Produktions-Perf-Lauf liegt in `perf-visible-r3.out` / `.exit` und endet ebenfalls mit Chrome-`SIGABRT` vor der Messung. `perf_vorher.json` und `perf_nachher.json` bleiben deshalb ehrlich `NOT_MEASURED` ohne Zahlen.

Der Commit folgt nach diesem UPDATE-2-Block auf `pb-w9-n6-terrain-guss`; es erfolgt kein Push.
