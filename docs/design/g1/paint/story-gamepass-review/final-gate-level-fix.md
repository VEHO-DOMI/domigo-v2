# CODEX DRAFT — NOT CANON · finale Level-Design-Korrektur

Stand 2026-09-13. Enger Auftrag nach Abschluss der ersten 74er-Batterie (65 grün, 9 rot), kein Commit, keine Runtime-/Karten-/Policy-/Geländeänderung in dieser Korrektur. Kokis ausdrücklich gewünschte passive Kleiderfunde werden im Designvertrag ehrlich abgebildet.

## Ursache und früheres Grün

Die Batterie 018/019 scheiterte an neun entfernten `uni.*`-Benennkarten in den alten Kleidungsansprüchen sowie neun veralteten Manifestankern für den breiteren Rettungsboden und den Stuhl-/Türumbau. Die Diagnose steht vollständig in `final-gate-level-diagnosis.md`. Das frühere gezielte Grün war `parsePaintLevel` plus `checkLevelLaws`: Es prüfte reale Geometrie und Erreichbarkeit, nicht den vollständigen Dossierabgleich von `check-level-design.mjs`. Es war kein früheres grünes Ergebnis desselben Kommandos, keine Last-/Cache-/Timeoutabweichung. Diese Unterscheidung bleibt Teil des Abschlusses.

## Präziser Vertrag

`passivePickup` ist ein ausdrücklich zusätzlich gewählter Anspruch ausschließlich für Kapitel eins. Er verlangt eine echte Kapitel-eins-Policy mit `passiveCoverage`; genau eine dortige Wort-ID-/Phase-/Entity-Bindung muss identisch sein, der beanspruchte Einzelstem muss zum realen Körper gehören. Karten- und Ausnahmefelder sind bei diesem Anspruch verboten. Die existierende echte `varietyErrors`-Prüfung liefert unverändert ihre Gesetze 17p und 17q: Wortbanklabel, sichtbare originale Kleidung, keine Bonusdoppelung, echte Erreichbarkeit und begründete Policy. Der Designchecker ruft diesen Validator auf; er implementiert keinen abgeschwächten Parallelprüfer. Andere Varietygesetze bleiben im bestehenden `check-game-tasks`-Tor. Keine Änderung an deren Code, Schwellwerten oder Policy.

Der alte `pickup`-Typ verlangt unverändert **Objekt UND genaue Benennkarte**. `cards`, Ausnahmefristen, Ankervergleich B11, Checkpointabstände und sonstige Grenzen bleiben unverändert. Die neun neuen Ansprüche erfinden keine Ersatzkarte und werden nicht als Architektur oder Schuld umgebucht.

Die neun tatsächlichen Ansprüche: hairband, sunglasses, hat in p1; shirt, school tie, sweater in p2; skirt, socks, shoe in p3. Sie verweisen jeweils auf die wirkliche Policy-Entity und das gelehrte Wort. Der Sweater liegt jetzt (81,19); die anderen Fundpositionen bleiben unangetastet.

## Dokumentabgleich

`claims.json` ersetzt nur die neun alten Quizbehauptungen durch feste passive Bindungen und datiert die Autorisierung. `README.md` erklärt den neuen Vertrag, vier wirkliche Schlösser, gewöhnlichen gelben Stuhl und tatsächliche zehn Farbziele; die unmittelbar widersprechenden Tabellenzeilen für Stuhl, Geräte, Foto, Schere und Zahlenschwarm sind nachgeführt. p2 erhält den realen 92-Spalten-Rettungsboden, Anker für Schere/Farbkasten/Penal/Merle/Pullover/Tür/Klecks, sichere örtliche Merlezone und belegtes Folgen. Der alte Vierer-Sims- und Hochpult-/Schussbahntext ist ausdrücklich historisch, nicht Beweis der neuen Geometrie; die alte Fernanker-Angabe im Lochsprung ist berichtigt. p3 beschreibt den Stuhl bei (51,17) ohne Käfig und die auf dem Boden stehende Tür bei (60,14); die unmittelbar widersprechenden Käfigsprung-/Kunst-/Raumrhythmusbehauptungen sind ersetzt. Bestehende historische Mover-/Geländeschulden werden damit nicht als erledigt erklärt. Kein neuer Schülertext.

## Tatsächlich ausgeführte Prüfungen

Alle Shells: Node 24.20.0 über den verlangten PATH, Prozesse mit `nice -n 15`.

- `node scripts/check-level-design.mjs --selftest`: Exit 0, **58 Fälle**. Rohlog `level-design-fix-selftest.log`.
- `node scripts/check-level-design.mjs`: Exit 0; 6 Kapitel einschließlich 5 Entwürfen, 48 einmalige Wesen-Stems, 112 klassifizierte Vokabeln, 30 Phasen mit deckungsgleichen Ankern. Rohlog `level-design-fix-full.log`. Bestehende Hinweise zu angebotenen Ausnahmen in anderen Entwurfskapiteln bleiben sichtbar; sie werden nicht als neue behobene Befunde verkauft.
- `git diff --check -- scripts/check-level-design.mjs docs/design/g1/paint/ch01-dossiers-v2`: Exit 0.

## Echte Kopienproben

Reproduzierer `level-design-fix-tampers.mjs`; endgültige Ergebnisse **`level-design-fix-tampers/results.json`**. Beide Kontrollläufe müssen grün sein. Skripte, Inhalt und Dossiers werden kopiert; Packages/Apps/Art sind nur lesend verlinkt und werden von keiner Mutation beschrieben. Keine Probe verändert das Produkt.

| Probe | Exit | Tatsächlicher Nachweis |
|---|---:|---|
| control | 0 | vollständiges Tor grün |
| control-selftest | 0 | 58 Fälle grün |
| missing-pickup | 1 | 17p meldet fehlenden p1-cloth-hat; zusätzlich echter B11-Fehler |
| wrong-word | 1 | 17p verwirft pencil statt hat |
| old-quiz-claim | 1 | alter pickup meldet fehlende Benenn-Karte g1.paint.ch01.uni.hat |
| false-anchor | 1 | B11: Scherenanker (63,19) ≠ Level (68,19) |
| validator-disconnected | 1 | Selbsttest rot bei falschem Wort, Rolle, verborgenem Fund, Bonusdoppelung und unerreichbarem Fund |

Die 14 ergänzten Selbsttestfälle umfassen zusätzlich fehlende Policy, fremdes Kapitel, andere Policy-Entity, falschen Stem, doppelte Policy-Bindung und unerlaubten zusätzlichen Quizanspruch. Die Abkopplungsprobe beweist, dass diese Prüfung nicht bloß dieselbe neue Datenform abnickt: ohne tatsächliche Varietyanbindung werden fünf ihrer negativen Fälle fälschlich leer und lassen den Selbsttest scheitern.

## Eigener PR-Absatz für das geänderte Tor samt integriertem Selbsttest

**`scripts/check-level-design.mjs` (inklusive `--selftest`):** Kokis gewünschte neun reine Kleidungsfunde hatten noch alte Pflichtquiz-Ansprüche; der vollständige Dossiercheck lehnte deren entfernte Karten korrekt ab. Der neue ausdrücklich gewählte Kapitel-eins-Typ `passivePickup` bindet Wortbank, tatsächliche Policy, feste Phase/Entity und Körperstem und verwendet die bestehende strenge 17p/17q-Fundprüfung einschließlich Sichtbarkeit und Erreichbarkeit. Der alte `pickup`-Doppelvertrag und alle Ankergrenzen bleiben bestehen. 58 Selbsttests und der Gesamtcheck sind grün. In isolierten Quellenkopien bleiben fehlender Fund, falsches Wort, alter Quizanspruch und falscher Manifestanker jeweils rot; die bewusste Abkopplung des Validators macht den Selbsttest rot. Die grüne Kontrolle und alle fünf roten Proben stehen in `level-design-fix-tampers/results.json`; Bericht `final-gate-level-fix.md`. Die frühere gezielte Geometrieprüfung war ausdrücklich kein grüner vollständiger Dossiercheck.

Es wurde keine separate Testdatei geändert: Die 14 neuen Fälle gehören zum vorhandenen Selbsttest dieses einen Gates. Neue komplette Batterie und Performancevergleich liegen bei Root; dieser Bericht behauptet dafür kein Ergebnis.

## Eingefrorene Quelldateien

- `scripts/check-level-design.mjs` — SHA-256 `f1fb6ea05b9b1c0fc21685040d79638ecd56828f8d1982366734772cf13f4239`
- `docs/design/g1/paint/ch01-dossiers-v2/claims.json` — SHA-256 `b4cc35228098410c196e03a7e35a32e783a07fe98a34eae802ea18d22bc8ffba`
- `docs/design/g1/paint/ch01-dossiers-v2/README.md` — SHA-256 `f592de63cf9388452c6492bc0ec4bbf98790824980d9fa51e3b9a949f8123f05`
- `docs/design/g1/paint/ch01-dossiers-v2/p2.md` — SHA-256 `c9a215168e4f51a1fd8ce085f0df6fe224c8ca8ef1d0d49f6814d30259c614d5`
- `docs/design/g1/paint/ch01-dossiers-v2/p3.md` — SHA-256 `37c554f359369901cd4076a1153b7a1beafe4a7a7a3ba714e670f8a94eb8f335`

Endgültiger Kopienordner: `/Users/veho/Code/codex-lab/trial-berichte/CH01_STORY_SPIELPASS/level-design-fix-tampers/sandbox-fZsjuh`. Alle erwarteten Meldungen wurden zusätzlich zur Exitnummer geprüft.
