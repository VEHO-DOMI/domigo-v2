# DomiGo — Stand und nächste Schritte

Die gesamte vorherige Datei bleibt im [Status-Archiv](handover/STATUS_ARCHIV_2026-08.md) bytegleich erhalten: Stand August samt älteren Einträgen und späteren Hinweisbannern. Dieses Blatt beschreibt den gemessenen Hauptstand; laufende Änderungen stehen ausdrücklich in Prüfung.

- **Datum:** 2026-10-08 (Europe/Vienna).
- **main-sha:** `d19c4b673c15a77cdb26cebbc1bbb9c9cab7c360` — Ausgangsstand dieser Bestandsaufnahme.
- **Gemergte PRs:** 487 insgesamt; 123 seit 2026-08-24. **Letzter Merge:** PR 497. PR bedeutet Pull Request, eine zusammengeführte Änderung; gezählt nach Merge-Zeit, nicht nach Nummernfolge.
- **LIVE:** https://eng-unterstufe.lautereinser.at — `/api/version` antwortet mit HTTP 200 und bestätigt den oben genannten Hauptstand.
- **CI-Einzeiler:** 102 `- run:`-Zeilen in `.github/workflows/ci.yml`, einschließlich 5 Installationszeilen; damit 97 lokal auszuführende Prüfzeilen. CI ist die automatische Prüfkette. Die Zahl ist kein Testergebnis.
- **Migrationen:** Repository-Journal 0000–0019; 0019 laut Kartenbrief angewendet. Der gesonderte Produktionsbeleg für 0015–0019 bleibt bei Koki offen (cgo-054). 0020 vorbereitet in PR 490, 0021 vorbereitet in PR 498, beide OPEN und noch nicht Teil dieses Hauptstands. Migration bedeutet Änderung der Datenbankstruktur; diese Sitzung hat keine Datenbank abgefragt oder verändert.

Messweg: `git rev-parse origin/main`; `gh pr list --state merged --limit 400 --json number,title,mergedAt` (Zeitfenster), für die ungekappte Gesamtzahl derselbe Befehl mit `--limit 1000`; `git log origin/main --oneline --since=2026-08-24`; `rg -c '^\s*- run:' .github/workflows/ci.yml`; `node -p 'JSON.stringify(require("./packages/db/drizzle/meta/_journal.json").entries.map(e=>e.tag))'`; `gh pr view 490 --json state` und entsprechend PR 498. Vollständige Befehle → Ausgaben, Zählgrenzen und Bildbelege stehen im PR dieser Bestandsaufnahme (cgo-097).

## In Prüfung: cgo-108 · OG-Parität W1

Noch nicht freigegeben. Vier Kinderflächen `/home`, `/modi`, `/profil`, `/fortschritt`, 50 Original-Avatare und Daily Challenge sind im eigenen PR vorbereitet; noch nicht LIVE. Migration 0022 ist additiv und wird hier nicht ausgeführt. 0020/0021 kommen aus PR 490/498; der GG vereinigt deren Journal/Snapshot-Reihenfolge vor der gemeinsamen Anwendung. Mockup-Gate: cgo-106/107 bestanden. Lokal sind 97/97 CI-Einzeiler und 28/28 absichtliche Fehlerproben bestätigt. Zwei frische Blindbetrachter erkannten alle vier Jahrgänge als unterscheidbar: 0/8 Urteile „unsicher“, visuelle Abnahme nicht bestanden. Produktionsabnahme, Migration, GG-Kette und Merge bleiben offen.

## Was LIVE ist

LIVE heißt hier: im oben bestätigten Produktionsbau vorhanden und über den vorgesehenen Zugang erreichbar. Code, Freigabedateien und Programm-Inventar belegen den Umfang; ein neuer vollständiger Durchlauf mit echten Konten wurde nicht durchgeführt. Gebautes ohne Kinderfreigabe, offene PRs und pausierter Weiterbau stehen deshalb getrennt. Ein bloßer Merge ist keine Unterrichtsabnahme.

### Schülerseite

| Posten | Stand | Beleg |
|---|---|---|
| Startseite, Lauter-Einser-Kopf, Jahrgangsbindung, Profil sowie Level und Lernpunkte | LIVE | [Startseite](../apps/web/app/home/page.tsx); PR 354, 365, 371, 434 |
| Üben: Vokabelrichtungen, Fehlerleiter und Feedback-Karte; sichtbare Chapter-Beschriftung | LIVE | [Üben](../apps/web/app/practice/page.tsx); PR 128, 494 |
| Wiederholung nach dem Leitner-Prinzip: schwierige Aufgaben kommen wieder | LIVE | [Wiederholung](../apps/web/app/review/page.tsx); PR 19–24; Story-Grammatik siehe Spiele |
| Lernpfad: Ablauf gebaut, ein redaktionell verfasster Pilot für g2-u03; weitere Inhalte fehlen | LIVE | [Lernpfad](../apps/web/app/learn/page.tsx); PR 172, 173; `pnpm content validate-journeys` |
| Tests, Aufgaben und Checkups mit /20-Wertung; Schreibabgabe mit Lehrerbewertung | LIVE | [Tests](../apps/web/app/tests/page.tsx), [Aufgaben](../apps/web/app/assignments/page.tsx); PR 153, 373 |
| Hören: 7 Chapter mit Audio; übriger Ausbau wartet | LIVE | [Hören](../apps/web/app/listening/page.tsx); PR 372, 380, 384; `pnpm content validate-listening` |
| Antworten offline zwischenspeichern und für denselben Besitzer nachsenden; Rückmeldung ans Buch | LIVE | [Outbox](../apps/web/lib/attempt-outbox.ts); PR 484, 497 |
| Als App installierbar, mit Manifest und Startsymbol | LIVE | [Manifest](../apps/web/app/manifest.ts); PR 370; Grenze ohne Service Worker siehe Entscheide |

### Spiele Y1–Y4

| Posten | Stand | Beleg |
|---|---|---|
| Y1: gemaltes Buch, Chapter 1 einschließlich B1-Befreiungsmuster; über Lehrerzugang spielbar | GEBAUT nicht freigegeben — Kinderzugang bleibt gesperrt; Kokis HALT-Spieltest offen | [Buch-Tür](../apps/web/app/(game)/play/[grade]/buch/[chapter]/page.tsx); PR 489; cgo-021 |
| Y1: Lernspur G-1, servergezählte Lernpunkte G-2 und Rückkanal nach Offline-Versand | GEBAUT nicht freigegeben — ausgerollt, aber Lehrer-Vorschau schreibt keine Lernversuche; Kinderzugang gesperrt | PR 491, 493, 497; [BuchClient](../apps/web/app/(game)/play/[grade]/buch/[chapter]/BuchClient.tsx) |
| Y1: Zoo Chapter 2 und Entwürfe Chapter 3–6 | GEBAUT nicht freigegeben — Zoo-Ausbau erst nach dem Siegel für Chapter 1 | [Buchdaten](../content/corpus/stories/g1.st.lost-pages/paint); PR 423, 424, 487 |
| Y1: Chapter 7–15 | GEBAUT nicht freigegeben — nur Design-Dossiers, keine spielbaren Kapitel | Spielplan doc 44, Abschnitt 4; Programm-Inventar B |
| Y2: Detektivgeschichte „The Wrong Name“, 15 freigegebene Kapitel | LIVE — bisherige Kampagne bleibt erreichbar | [Freigabe](../content/corpus/stories/g2.st.wrong-name/release.json); `pnpm content validate-story` |
| Y2: Ink-Ghost-Schulhaus und erste Aufgaben; „The Spill“ als Erbe | GEBAUT nicht freigegeben — keine Freigabe als neue Kampagne | PR 452; [Schulhaus](../apps/web/app/(game)/play/[grade]/school/page.tsx); [Story-Bestand](../content/corpus/stories) |
| Y2: Kanonentscheidung, weitere Schulhaus-Kapitel und davon abhängiger Rückbau | PAUSIERT — Koki 07.10.2026: „Year 2 ruht“ | cgo-087; Programm-Entscheide vom 07.10. |
| Y3: FOURTEEN, 14 freigegebene Folgen, Kanalübersicht, Inszenierung und ehrliche Speicherzustände | LIVE — Y3-B gebaut, Kokis Spieltest bleibt offen | [Freigabe](../content/corpus/stories/g3.st.fourteen/release.json); PR 460, 495; cgo-022 |
| Y3-A: Story-Grammatik in der Originalszene wiederholen | IN REVIEW PR 499 — Entwurf, noch keine Freigabe | [PR 499](https://github.com/VEHO-DOMI/domigo-v2/pull/499); cgo-095 |
| Y4: FOURTEEN: LIVE, 13 freigegebene Kapitel | LIVE — Veröffentlichung und Weiterbau sind verschiedene Zustände | [Freigabe](../content/corpus/stories/g4.st.fourteen-live/release.json); PR 443, 444, 446 |
| Y4: weiterer Ausbau | PAUSIERT — Koki 25.09.2026: „pausiert“ | cgo-069; Programm-Inventar Bereich B |
| Keen und alte Y1-Oberwelt | VERWORFEN — Koki 02./03.10.2026: „sunset keen und anything overworld“; Aufräum-Welle 1 umgesetzt | PR 478, 488; Inhalte und an Y2 gebundene Reste bleiben als Erbe erhalten |
| „Lost for Words“ | PAUSIERT — Koki 10.07.2026: „parked“; keine freigegebenen Kapitel, Bestand weiter geprüft | [Freigabe](../content/corpus/stories/g4.st.lost-for-words/release.json); [Blueprint-Ledger](BLUEPRINT_V2.md#part-0--canonical-state--the-wave-2-decision-ledger) |
| Word-Battle / Top-down-Spielrichtung | VERWORFEN — Koki 16.07.2026: „Word-Battle/Top-down“ verworfen | [Historischer Status](handover/STATUS_ARCHIV_2026-08.md); Programm-Inventar „Verworfen/geparkt“ |
| Syntaxia | VERWORFEN — Koki 06.07.2026: Fantasy-Ansätze zurückgewiesen | [Jahrgang-4-Dokumentation](handover/grades/g4.md); [Vision-Ledger](VISION.md) |
| Fragen-Seite vor dem Zoo aus dem Laborpaket | VERWORFEN — 07.10.2026: „PR 486 vollständig zurück“ | Rücknahme PR 487; der Zoo-Level ist wieder der Spieleinstieg |

### Lehrerseite

| Posten | Stand | Beleg |
|---|---|---|
| Startseite mit eigenen Klassen, Summen und Türen zur Klassenwand, Aufgabe und Vorschau | LIVE | [Lehrerstart](../apps/web/app/admin/page.tsx); PR 496; cgo-077 Teil A |
| Klassenverwaltung, Liste aus dem Konto, Beitritt und Datei-Import mit Prüfschritt | LIVE | [Klassen](../apps/web/app/admin/classes/page.tsx); PR 142, 144, 356, 374, 463 |
| Klassenwand, Klassenfortschritt, manuelle Punkteanpassung und Aufgabenverwaltung mit begrenztem Klassen-Zugriff | LIVE — bekannter Überlauf bei 390 px; Layoutkorrektur ist diese Karte, noch nicht Hauptstand | [Klassenwand](../apps/web/app/admin/classes/[id]/page.tsx); PR 363, 365, 480, 481, 485; cgo-097 |
| Explorer: Üben, Lernpfad, Hören, Tests, Wiederholung und eigene Aufgaben aus Kindersicht ohne Lernschreiben | LIVE | [Explorer](../apps/web/app/admin/explorer/page.tsx); PR 477, 478, 494 |
| Chapter-Übungen aus der Vorschau der eigenen Klasse zuweisen | LIVE | PR 492; [Aufgaben erstellen](../apps/web/app/admin/assignments/new/page.tsx) |
| Studio: Aufgaben anlegen, bearbeiten, prüfen und als Kind ansehen; Veröffentlichung hinter automatischen Prüfungen | LIVE — Produktions-Veröffentlichen in dieser Sitzung UNVERIFIZIERT | [Studio](../apps/web/app/admin/studio/page.tsx); PR 166–171 |
| Studio-Grammatik (3 Formate), Checkup-Bündelprüfung und wiederholbare Prüfstörungen | GEBAUT nicht freigegeben — cgo-100; echter Sandbox-/DB-Lauf UNVERIFIZIERT | [Umsetzung und Grenzen](handover/21_checkup_presets.md#11--cgo-100-as-built--studio-grammar-and-the-publication-gate) |
| Schreibabgaben bewerten, Checkups konfigurieren und Hör-Transkripte lesen | LIVE | PR 153, 373, 382; [Schreibabgaben](../apps/web/app/admin/classes/[id]/schreiben/page.tsx) |
| Testklassen markieren und aus gemeinsamen Kennzahlen herausnehmen | IN REVIEW PR 498 — wartet auf Migration und GG-Kette; kein eigener Lehrer-Lernstand damit geliefert | [PR 498](https://github.com/VEHO-DOMI/domigo-v2/pull/498); cgo-094, cgo-096 |
| Story-Welten je Jahrgang freigeben oder parken | IN REVIEW PR 490 — wartet auf Migration | [PR 490](https://github.com/VEHO-DOMI/domigo-v2/pull/490); cgo-070, cgo-089 |

### Identität/Konto

| Posten | Stand | Beleg |
|---|---|---|
| Anmeldung über das Lauter-Einser-Konto, Rollen und Begrenzung auf den bestätigten Klassen-Ausschnitt | LIVE | PR 451, 457, 480, 485; [Anmeldung](../apps/web/app/signin/page.tsx) |
| Schuljahres-Neustart und lesender Zugriff auf historischen Bestand | LIVE — kein Rückschluss auf eine vollständige historische Datenübernahme | PR 359, 457; [Datenbankpaket](../packages/db/src) |
| Großmeister-, Betreiber- und Kontohilfe-Wege | LIVE — heutiger Mailversand UNVERIFIZIERT | PR 355, 367, 370; [Verwaltung](../apps/web/app/admin/grandmaster/page.tsx) |
| Datenschutzseite und Funktionsregion Frankfurt; Journal ohne Klarnamen | LIVE — Migrations-Produktionsbeleg separat offen | PR 437, 447, 465, 378; [Datenschutz](../apps/web/app/datenschutz/page.tsx) |

### Inhalte

| Posten | Stand | Beleg |
|---|---|---|
| Übungskorpus: 57 freigegebene Units, 5.898 Items, 96 Grammatikstrukturen und 18 Fehlerfallen | LIVE — technische Freigabe ersetzt keine semantische Vollrevision gegen MORE! | `pnpm content status`; `pnpm content validate`; [Korpus](../content/corpus/units) |
| Story-Bestand: 7 Bündel mit 78 Kapiteln insgesamt | GEBAUT nicht freigegeben — Gesamtbestand schließt Erbe und Entwürfe ein; spielbare Auswahl steht oben | `pnpm content validate-story`; [Story-Bestand](../content/corpus/stories) |
| Lernpfad-Inhalt: 1 Pilot; Hör-Inhalt: 7 Dateien, 38 Aufgaben, Audio für 7 von 7 Hörpaketen | LIVE — Abdeckung bleibt auf die vorhandenen Chapter begrenzt | `pnpm content validate-journeys`; `pnpm content validate-listening` |
| Kuration, versionierte Korrekturen, Lexika und Kunst-/Audio-Bestände | LIVE — Kunst und Karten späterer Buchkapitel bleiben Entwürfe | [Korrekturen](../content/overlays), [Lexika](../content/corpus); PR 110–140, 323, 398 |

### Betrieb/Qualität

| Posten | Stand | Beleg |
|---|---|---|
| Automatische Prüfkette, Nachweisbänder für Spielabläufe, Leistungswächter und Deploy-Abgleich | LIVE — konkrete Ergebnisse je Änderung im jeweiligen PR | [Prüfkette](../.github/workflows/ci.yml), [Leistungswächter](PERF_WAECHTER.md), [Deploy-Prüfung](../scripts/verify-deploy.mjs); PR 476 |
| Produktionsbauten nur vom Hauptzweig; kontrollierte Vorschauen | LIVE | PR 479, 483; [Build-Regel](../apps/web/scripts/vercel-ignore-build.sh) |
| Ausnahmen und bekannte Prüfschulden als lesbares Register ohne Kalender-Verfall | LIVE | PR 476; [Schuldenregister](design/g1/paint/DEBT_REGISTER.md) |
| Programmführung über Karte, unabhängigen Leser und GG-Merge-Kette | LIVE | [AGENTS.md](../AGENTS.md), [CLAUDE.md](../CLAUDE.md); PR 482 |

## Was offen ist

Reihenfolge aus dem freigegebenen Programm vom 07.10., abgeglichen mit den Nachzügen vom 08.10.; keine Termine und keine automatische Freigabe durch Zeitablauf.

| Spur / Reihenfolge | Nächster Schritt und Grenze | Beleg / Zuständigkeit |
|---|---|---|
| Eigene häufigste Fallen auf `/review`: bis zu drei in 30 Tagen ab zwei Fehlern, Register-Erklärung und Chapter-Tür; Vorschau ohne Kinderlesung | IN PRÜFUNG — cgo-105 | [Fallen-Karte](../apps/web/app/review/FallenKarte.tsx); [Leser](../packages/db/src/student-traps.ts) |
| Spiel · Y1 | Nach B1 erst Kokis HALT, dann **B2 → C → F → Siegel → Zoo**. Nachsorge B1 folgt dem HALT; E misst Wartezeiten, D2 bleibt Kunst im Labor. Spätere Kapitel folgen der Zoo-Abnahme. G-1/G-2 samt Rückkanal sind bereits gebaut. | cgo-021, cgo-088; welle-064/065/067/077; siegel-001…005; Programm G7–G10 |
| Spiel · Y3 | **A → K → C** weiterführen: A ist als PR 499 in Prüfung; K braucht das Cast-/Kunstblatt, C die anschließende Fertigstellung. Y3-B ist live, Kokis Spieltest bleibt ein eigenes Tor. | cgo-095, cgo-022; welle-075/071; Order Y3 und Programm |
| Plattform · Vorarbeiten | Story-Schalter und Testklassen-Marker durch Migration und Review bringen; eigener Lehrer-Lernstand bleibt offen. Meldeknopf K13 sowie Outbox-Altbestand und Kokis Kindersatz nachziehen. | PR 490/498; cgo-029, cgo-081; Programm P1/P4/P5; die alte K13-Reservierung für 0020 ist überholt |
| Plattform · Journeys | Pilot mit Koki gehen, dann Inhalte für die übrigen 56 Units in freigegebenen Wellen verfassen; Hand-Markierungen übernehmen. | Blueprint J-2; Programm P7; Rechnung 57−1 aus den Korpusprüfungen |
| Plattform · Writing | W-1 Schreibaufnahme → vorherige Foto-Datenschutzentscheidung → W-2 KI-Korrektur mit Lehrerfreigabe → W-4. Keine Freigabe von Foto- oder KI-Ausgaben durch diesen Status. | Blueprint W-1/W-2; Programm P8; daten-029/GG-Plattform |
| Plattform · v1-Parität | Wörterbuch mit lokaler Suche und Wort des Tages je Jahrgang: IN REVIEW (cgo-099), noch nicht live. Offen: Avatarwahl, Badges, tägliche Aufgabe, Tempoübungen nur mit gemeistertem Stoff, Dark Mode; Activity Game später. Rangliste bleibt Kokis Urteil. | [Wörterbuch](../apps/web/app/woerterbuch/page.tsx); VISION-Entscheid 06.07.; Programm P9; welle-073, cgo-068 |
| Plattform · Studio/Checkups | Grammatikformular und sichtbare Entwurfszustände; Checkup-Vertrag mit 30 Punkten und zusätzlicher inhaltlicher KI-Prüfung vor Veröffentlichung. | Programm P10; Checkup-Entwurf doc 21, Abschnitt 5.5 |
| Plattform · Didaktik | Kurze Erklärlektionen, Lernübersicht nach Beherrschung, Nutzen der Fehlerfallen sichtbar machen, deutsche Führung und Sprachschalter vollständig prüfen; Tagesplan. Placement bleibt vorgeschlagen, kein Baubeschluss. | Programm P11 und dessen Abschnitt „Nicht in diesem Plan“; Blueprint L-2/D-4/D-7/D-8 |
| Plattform · Betrieb | DSGVO-Inventar, Impressum/Elterninformation, Repository-Sichtbarkeit, Tor-Nachsorge, Kosten, visuelle Parität und abschließende Vier-Personas-Abnahme. Repository derzeit öffentlich; die geforderte private Stellung vor echten Schülerdaten ist nicht erfüllt. | Programm P12; gomarke-002, tore-006/018, platt-004, V-1, GO-1; `gh api repos/VEHO-DOMI/domigo-v2 --jq '{private,visibility}'` |
| Pausiert / nicht beauftragt | Y2, Y4-Weiterbau und neue Audio-Erzeugung bleiben zurückgestellt; die übrigen 50 Hör-Units folgen erst einer Wiederaufnahme. Social, Duell, Elternsicht und Placement sind keine laufenden Bauaufträge. | Koki 25.09., 02.10., 07.10.; Programm „Nicht in diesem Plan“; Rechnung 57−7 |

## Entscheide seit 07.10.

Quelle: `ENTSCHEIDE_GG_DOMIGO_2026-10.md` und `MASTERPLAN_INVENTAR_2026-10-07.md` im Programm-Ordner; hier die für den heutigen Stand wirksamen Entscheide, einschließlich ausdrücklich zurückgewiesener Wege.

| Datum | Entscheid mit Wortlaut | Folge für diesen Stand |
|---|---|---|
| 07.10.2026 | „PR 486 vollständig zurück“; Lab-Vignetten „keine Eingabe mehr“ | PR 487 hat die Fragen-Seite zurückgenommen. Die Lab-Pakete begründen keine weiteren Spieleaufträge. |
| 07.10.2026 | Keen/Overworld „sunset“, ursprünglicher Koki-Entscheid 02./03.10.; Aufräum-Welle 1 freigegeben | PR 488 entfernt freigegebene Reste. Erbe-Bündel bleiben prüfbar; weiterer Rückbau hängt an der pausierten Y2-Frage. |
| 07.10.2026 | Koki: „Year 2 ruht“ | Y2-Kanon cgo-087 und Aufräum-Welle 2 pausieren. Die frühere Nummer cgo-090 für das Y2-Ruling ist überholt. |
| 07.10.2026 | Y1 „B1 → HALT → B2 → C → F“, Zoo erst nach Siegel; Y3-A „Weg 1“ | Die Wiederholung soll in die Originalszene zurückführen; gebaute Vorleistungen überspringen kein Spieltest-Tor. |
| 07./08.10.2026 | G-2 lebt in PaintGame; offline „Punkte folgen“ | Nur Serverantworten vergeben sichtbare Lernpunkte. Der zunächst vertagte Outbox-Rückkanal ist mit PR 497 nachgezogen; der Chip zeigt eine Sitzungssumme, kein Kontoguthaben. |
| 08.10.2026 | P6 Service Worker + Offline-Seite „wird NICHT gebaut“ | Die bewusste Manifest-Grenze bleibt. Ein Service Worker wäre ein im Browser bleibender Vermittler vor Anfragen; ein neuer Auftrag bräuchte einen Vertrag für sichere Aktualisierung. Keine vollständige Offline-App behaupten. |
| 07.10.2026 | Spiel- und Plattform-Spur parallel, „Codex so viel wie möglich“ | Codex baut aus der Karte; GG prüft und führt zusammen. Jede gebaute Sache wird im Repo und im Programm-Ordner nachgeführt. |

Frühere Umstürze bleiben im [Vision-Ledger](VISION.md#koki-decision-ledger-do-not-re-litigate-append-with-dates) und im Archiv sichtbar: „Lost for Words“ geparkt, keine Deadline („wenn es fertig ist, ist es fertig“), Word-Battle verworfen. Sie werden durch neue Statuszeilen nicht wieder zu Aufträgen.

## Bei Koki offen

| Anliegen | Kartenkennung | Was das Urteil oder der Beleg freigibt |
|---|---|---|
| Produktionsbeleg für Migrationen 0015–0019 | cgo-054 | Belegt den angewendeten Stand; das Repository-Journal allein beweist keine Produktionsanwendung. |
| Migration 0020 für Story-Welten | cgo-089 → PR 490 / cgo-070 | Koki führt den vorbereiteten Datenbankschritt aus; GG darf erst danach die Änderung zusammenführen. |
| Migration 0021 für Testklassen | cgo-096 → PR 498 / cgo-094 | Anwendung und Abgleich beider neuen Journal-Einträge vor dem GG-Merge. |
| Y1-Befreiungsmuster spielen (HALT) | cgo-021; Nachsorge cgo-088 | Urteil vor B2 und den anschließenden Spielpaketen. |
| FOURTEEN spielen | cgo-022 | Inszenierung und Figuren beurteilen; Y3-B-Merge ersetzt dieses Urteil nicht. |
| Ranglisten, zunächst innerhalb der eigenen Klasse | cgo-068 | Umfang und doppelte Zustimmung entscheiden. |
| Y2-Kanon / weitere Schulhaus-Kapitel | cgo-087, steu-020 | PAUSIERT; kein Handgriff erwartet, solange Koki Y2 nicht wieder aufnimmt. |
| Y4-Weiterbau | cgo-069 | PAUSIERT; keine Wiederaufnahme durch diesen Status. |

Weitere spätere Tore stehen im Programm: Lernpfad-Pilot, Foto-Datenschutz, Kunstabnahmen und Wiederaufnahme der Audio-Erzeugung. Wo keine aktuelle Kartenkennung belegt ist, wird hier keine erfunden. Die Umbenennung liegt bei VEHO-GG.

## So wird hier gearbeitet

Die Board-Karte ist Auftrag und Freigabe. Codex baut im eigenen Klon und öffnet einen PR gegen `main`; der unabhängige Leser prüft, die GG-Kette fährt die vollständigen Tore, führt zusammen und prüft den Produktionsbau. Codex mergt nicht. Rechte und Rückweg stehen in [AGENTS.md](../AGENTS.md) und [CLAUDE.md](../CLAUDE.md).

Zwei-Flächen-Logging heißt: derselbe gebaute Stand wird **hier im Repository und im Programm-Ordner** festgehalten. Diese Karte liefert die Repo-Seite; GG übernimmt den Rückbericht in den Programm-Ordner. Beim nächsten Merge werden Hauptstand, Belege, Zustände und offene Punkte abgeglichen. Der [wöchentliche Vision-Log](BLUEPRINT_V2.md#vision-log) prüft Selbstständigkeit, Vertrauen und das eine Bewertungsgehirn. Der STATUS-Wächter prüft Form und Pflichtangaben ohne kalenderabhängigen Verfall; die Wahrheit jedes Postens bleibt Gegenstand der Quellenprüfung.
