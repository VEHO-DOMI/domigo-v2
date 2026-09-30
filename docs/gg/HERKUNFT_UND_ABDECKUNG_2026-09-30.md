# Herkunft und Abdeckung · sichtbarer Nachtrag zu PR 470

**CODEX DRAFT — NOT CANON · cgo-025 · 30.09.2026**

**Urteil: Nein zur vollständigen inhaltlichen Abdeckung.** Alle 247 Eingänge sind identifiziert, klassifiziert und einer Weiterbehandlung zugeordnet. Das bedeutet nicht, dass sämtliche Einzelzusagen aus 35.038 Quellenzeilen abgeschlossen geprüft wurden. Insbesondere fehlen Herkunftsbelege, der Abschluss des Einzelabgleichs über den gesamten Katalog und die endgültige W0-Annahme. Diese Grenzen werden nicht durch eine grüne Kennungsprüfung aufgehoben. Die folgende Zuordnung erhält die Juli-Zusagen und vorhandene Facharbeit; sie erteilt keine neue Schülerfreigabe.

Produktstand dieses Nachtrags: `269ee986ccdc1ae7c3b070cbed7014f20e532365`, eigener Zweig `codex/cgo-025`, PR-Ziel `codex/main`. Historischer Quellenkatalog: `df258ae8952cf5e5747e7507759d4d7b61e094b5`. Spätere Arbeit anderer Karten gilt erst nach benanntem Abgleich. PR 470, seine Messungen und sein damaliges Urteil bleiben historische Aussagen ihrer Sitzung.

## 1. Was erfasst ist und was damit entschieden wurde

Ein Fingerabdruck bezeichnet hier einen aus Dateiinhalten berechneten Vergleichswert. Gleiche Werte belegen gleiche geprüfte Bytes, keine didaktische Qualität. Die Dateien unter [coverage](coverage/) enthalten fachliche Herkunfts- und Dispositionsdaten; Prüfprogramme und Rohprotokolle bleiben außerhalb des Repos unter `~/Code/_codex/cgo-025-evidence/`.

Begriffe: PR = Änderungsvorschlag; Commit/Pin = eindeutig festgehaltener Dateistand; Repo = Projektablage; Pool = Auswahl einer Abrufform; Queue = automatische Wiederholungsliste; Vault = freiwillige private Wortsammlung; Renderer = Programm, das die Aufgabe anzeigt; Overlay = nachgelagerte Inhaltskorrektur; Schema = vorgeschriebene Datenform; Gate = Abnahmetor; Donor = fremdes Projekt als geprüfte Musterquelle. MD5/SHA sind Verfahren für Fingerabdrücke, keine Qualitätsnoten.

| Register | Inhalt und Gültigkeitsgrenze |
|---|---|
| [sources.json](coverage/sources.json) | S001–S247: konkreter Pfad, Fassung, MD5, Klasse, Geltungsbereich, Ziel und offene Abnahme. 247/247 Eingangsbytes stimmen mit dem GG-Katalog überein. Keine pauschale semantische Vollprüfung behauptet. |
| [supplemental-sources.json](coverage/supplemental-sources.json) | X001–X007, X009–X011: Orders mit ihren unterschiedlichen Fassungen, Rulings, alter GG-Stand, heutige Charta/Parallelregel/Rückmeldeweg. Historische Rechte sind keine heutige Erlaubnis. |
| [version-chains.json](coverage/version-chains.json) | 14 ausdrücklich begrenzte Vorgänger-/Nachfolgerbeziehungen. Unterschiedliche Fassungen bleiben erhalten. |
| [commitments.json](coverage/commitments.json) | 41 vertieft zugeordnete Zusagen: 23 Unterzusagen der zehn Juli-Arbeitsstränge und 18 weitere Erhaltungsaufträge. Kein erschöpfender Ersatz der Originaldokumente. |
| [review-lineage.json](coverage/review-lineage.json) | 57 Einheiten, Vergleich der vorhandenen Zeilenregister und vier konkrete Y1/Y3-Fälle; Inhalt, Antwortschlüssel, Ansicht und Integration getrennt. |
| [legacy-cards.json](coverage/legacy-cards.json) | Alle 35 Altkarten aus Inventar §9 gegen Boardstand `a2de5ff614240f0b0a3b5f6880611bddda1089d5`; bisherige Disposition erhalten, keine Karte dadurch geschlossen. |
| [source-gaps.json](coverage/source-gaps.json) | Fünf einzelne fehlende Quellen und die gesonderte Plan-PR-Lücke: zitierende Quelle, behaupteter Lieferstand, tatsächlich durchsuchter Raum und fehlender Nachweis. GG bestätigt ihren offenen Status in Nachtrag 2. |
| [review-drift-groups.json](coverage/review-drift-groups.json) | Alle 934 Abweichungen nach tatsächlich betroffenen Feldern, mit alter/neuer Zelle und historischem Vergleichsstand; keine pauschale Artikelkorrektur-Freigabe. |
| [learning-paths.json](coverage/learning-paths.json) | Vier exemplarische Lernwege und ihre konkreten Speicher-/Kontextgrenzen als fachliche Dispositionsdaten. |
| [removed-clothing-tasks.json](coverage/removed-clothing-tasks.json) | Neue Git-Rekonstruktion der neun entfernten Kleideraufgaben, ihrer alten Antwortvarianten und heutigen Wort-/Bildanschlüsse; ausdrücklich kein Ersatz der verlorenen S136-Originale. |
| [filed-lineage.json](coverage/filed-lineage.json) | Alle 385 einzelnen Posten aus S047–S050, einschließlich Nichtprüfungen und bloßer Zuweisungen: eigene Quelladresse, historischer Wortlaut des Urteils, heutige Registerfundstellen und Zielvorschlag. Keine behauptete heutige Erledigung. |
| [blueprint-lineage.json](coverage/blueprint-lineage.json) | 84 benannte Arbeitsaufträge aus S001/S002 mit eigener Abschnittsadresse und vorhandenen exakt referenzierten Dateien. D-/W-/A-Nummern verschiedener Abschnitte werden nicht verwechselt. Dateipräsenz ist kein Abschluss; verschachtelte Unterkriterien bleiben an die Quelle gebunden. |
| [requirements/](coverage/requirements/) | 2.167 Einzelstellen der sechs priorisierten Quellen S001/S002/S046/S217/S218/S219, mit ungekürzten Unterkriterien, konkreten Auflösungsbedingungen und getrenntem historischem/heutigem Zustand. Nicht als 2.167 eigenständige Produktzusagen zählen: enthalten sind auch Belege, Regeln und Adressumrechnungen. |
| [requirement-dispositions.json](coverage/requirement-dispositions.json) · [current-evidence.json](coverage/current-evidence.json) | 72 fachliche Vertragsprofile und 14 begrenzte aktuelle Codebelege. Jeder Beleg nennt Datei, festen Git-Dateistand und gelesenen Ausschnitt; kein frischer Produktlauf und kein unabhängiges Urteil. |

Die 247 Eingänge bestehen aus fünf Wurzeldokumenten, 33 Kunst-, 131 Design-, vier Feedback-, 56 Handover-, einem Plan- und elf Runbook-Dokumenten sowie sechs externen Eingängen. Klassen: 30 Plan, 19 Review, 136 Bau-/Kunstspezifikation, 14 Urteil, 43 Beleg, fünf exakte Duplikate. Es gibt 242 unterschiedliche MD5-Werte. Nur die fünf bytegleichen Paare sind zusammengeführt; die zweite Kennung bleibt erreichbar. Insbesondere sind Blueprint-Fassungen, Juli-Programm/Passover/S3 und alte/aktuelle DomiLingo-Fassung **keine** Duplikate.

Die 41 vertieften Zusagen sind 13-mal teilgebaut, 25-mal offen, einmal hinsichtlich der benannten Quelle unverifiziert und zweimal geparkt. Keine ist als vollständig gebaut, unabhängig verifiziert oder pauschal ersetzt verbucht. Gebaute **Teilfunktionen** stehen jeweils separat als Codebeleg. Dazu kommen zwölf ergänzende Quellen-/Paketdatensätze; die 25 Donor- und 23 vorläufigen W0-Dateien wurden bytegleich gegen ihre GG-Pins geprüft.

Alle Quellen sind administrativ zugeordnet. Der ergänzte Einzelpass der sechs priorisierten Quellen erfasst die Unterkriterien; der noch notwendige Katalogabgleich bleibt davon getrennt. „Zugeordnet“ bedeutet nicht „Produkt fertig“: 848 unterschiedliche Schuldadressen in S046 behalten ihre konkrete Auflösungsbedingung, und die 173 PB-Regeln in S219 bleiben wiederverwendbare Kontrollen. Sie werden nicht als 173 erneut zu bauende Funktionen behandelt. Die historische Adressumrechnung bleibt zusätzlich erhalten. Ein alter Rotbefund wird weder automatisch aktuell noch automatisch erledigt.

Die vier Filed-Listen wurden zusätzlich vollständig durchgegangen: 74 + 96 + 106 + 109 = **385 Einzelposten**. Ihr eigener historischer Warnhinweis ist zentral: „zugewiesen“, „dokumentiert“ und „entschieden“ sind unterschiedliche Zustände; ein Häkchen beweist nicht überall gebauten Code. Beispielsweise bleibt die Klang-/Aussprachefrage aus S048:34 erhalten, obwohl spätere Quellen bereits ein Audiosystem belegen; S049:45 trennt einen vorhandenen Rotationsschlüssel vom damals fehlenden Sitzungszufall; S050:P10 ist eine historische Datumsverlängerung, keine heutige Erlaubnis für Datumstore. Die Zuordnung führt diese Widersprüche zu ihren konkreten Registeradressen weiter. Sie prüft nicht rückwirkend die 385 zugrunde liegenden Bau-/Bildbelege neu.

### Was der ergänzte Einzelpass konkret geändert hat

- **Bewertung:** Die Abschriftsperre und der Strict-Zweig sind im heutigen Grader belegt. Strict unterbindet unscharfe Ersatzbewertung, erlaubt aber ausdrücklich verfasste Teilantworten. Die alte vereinfachte Formel wird nicht als heutiger Code ausgegeben.
- **Wiederholung:** Listening bleibt im maßgeblichen Speicherpfad ausgeschlossen, auch mit Audiodatei. Die allgemeine Wiederholungsliste ersetzt diesen geplanten Weg nicht. Ein abgeschlossener Journey-Pool belegt wiederum Versuche aller Items, nicht Beherrschung aller Wortformate.
- **Plattform:** Schreibabgabe und Lehrerwertung existieren; Fotoeingabe, OCR, KI-Korrektur, Telemetrie und Schülerfreigabe bleiben eigene Unterverträge. Das Web-App-Manifest ist vorhanden, Offline-Seiten und Service Worker sind damit nicht bewiesen. Studio-Erstellen/Ersetzen und Entfernen haben bewusst unterschiedliche Prüfwege.
- **Spiele:** Die Parkung von Lost for Words erhält die unabhängigen Flag-/Boss-/Hilfsmechaniken. Alle 15 Paint-Dossiers behalten ihre jeweils eigene Handlung, Grammatik, Fähigkeit, Boss-, Figuren-, Kunst- und Übergangsanforderung. Vorhandene Entwurfsdaten von Kapitel 2–6 sind keine Auslieferungsfreigabe.
- **Spätere Entscheide:** R241 hebt die blockierende Wartezeit nach einer richtigen Paint-Antwort auf, nicht deren Weltwirkung. S218/R179 setzt den zweiten Anker auf `near`. D-270/D-491 sind durch R209a historisch geschlossen und der achromatische Faktor ist heute belegt. D-482 schließt nur den Audio-Unterteil der Faustverschiebung. Die späteren D-1070–1072 behalten konkrete offene Bedingungen ohne alte Kalenderfrist.

Die sechs Einzelregister unterscheiden aktuelle Codebestätigung, erhaltenen historischen Entscheid und präzise fehlenden Abschluss. Bei D-418/D-470 bleibt der widersprüchliche Zuordnungsstand sichtbar: eine spätere Schließmeldung der ersten Adresse beantwortet nicht ohne belegte Verbindung die noch offene Entscheidung der zweiten. Es wird deshalb keine bereits zurückgewiesene Parameterreparatur neu bestellt.

### Eingänge mit festen Prüfsummen

| Eingang | MD5 |
|---|---|
| GG-Katalog mit 247 Eingängen | `bb6b1c384b1b55f81e079f6d01ff3d9d` |
| GG-Inventar der Reviewregister | `ee528496718dde3c5159a05be697ddee` |
| Originaltrainer-Pins | `2a8f520b179a08f2181da122dcdd8562` |
| S242 Juli-Programm | `c5795818b11270b058dd60c1ec0ad9f0` |
| S243 Juli-Passover v2 | `9ec68b354d9958e5c5d36936ee0d9568` |
| S244 S3-Prototypenauftrag | `b8359df98ba6cadcab57eb7d7d868e71` |
| S245 Vorgänger-Roadmap | `57cc32f622e3d9f0c7edda6a1d111fbf` |
| Vorläufige W0-Referenzliste, Kopf `9d78767323ea207bc56ba72212953a3163418c0e` | `95d4546a2d68e9e8a2c31e7f5dffa790` |
| Aktueller DomiLingo-Donor, Kopf `e0c8b32d47d7abe4780835c0dd69e234dbba1005` | `c6dbca5647c28917eb25ce4367fdfaa9` |

### Welche Ablösungen tatsächlich belegt sind

Blueprint V2 (S002, Part I) ersetzt den alten Zeitplan mit Fristen und Kürzungsreihenfolge. Nicht genannte Spezifikationen aus Blueprint I bleiben ausdrücklich erhalten: Fachprüfung, Hör-/Testwellen, Audio, Didaktik, Lehrkraft, Veröffentlichung und Gleichwertigkeit mit den Originaltrainern. Studio-Erstellung und die Y4-Erzählrichtung wurden ausdrücklich neu entschieden; daraus folgt keine Löschung alter Aufgaben oder Versuche.

Syntaxia → Lost for Words → FOURTEEN LIVE betrifft die Y4-Kampagne. Die geparkte Geschichte und ihre mechanischen Verträge sind Erbe. Keen → Painted Book verändert Y1-Spielgestalt; Story-Refoundation, Unit-Magic und brauchbare Bedienideen bleiben gemäß den Nachfolgern erhalten. Kapitel-1-Dossiers v2 ersetzen benannte Raumfassungen, nicht sämtliche Altauflagen.

S245 → S242/S243 ersetzt die geplante erneute Texterkennung aus Bildern durch bereits vorhandene Kurswort-Transkriptionen. Es ersetzt nicht Wortindex, Sammlung oder Lernstand. S244 verändert die historische Ausführungsreihenfolge zu „erst alle Prototypen, dann Replikationsbrief v3“. Die fachlichen Tore bleiben ausdrücklich bestehen. Heutige Rollen-, Merge- und Prüfplatzregeln kommen ausschließlich aus der aktuellen Programmkarte.

Bei den September-Orders sind Fassung 1 und aktuelle Fassung getrennt gepinnt. Besonders Y3: Der frühere Auftrag, zehn Buchplätze story-eigen zu ersetzen, darf nicht gegen die spätere Entscheidung ausgespielt werden, diese zehn Plätze zu erhalten und die Lernspur samt Szene sauber zu entwerfen (X004/S170/heutiger Plan). Ein Dokumentkommentar allein begründet keine neue fachliche Ablösung.

**S136-Rekonstruktion:** Der Vergleich `7161948936faabc5eab2fd51457e90616599424d` → `08122e1edac911555770a3b8d0eadcb05c0a8573` bestätigt 70 → 61 Karten durch Entfernung von genau neun `pickupset`-Aufgaben: hairband, hat, school tie, shirt, shoe, skirt, socks, sunglasses, sweater. Sechs waren Auswahl-, drei Schreibaufgaben; `shoe` akzeptierte auch `one shoe`/`a shoe`, `skirt` auch `a skirt`. Alle neun Wörter existieren heute an Kleidungsentitäten; die Fundübersicht in `PaintGame.tsx` zeigt Bild und englisches Wort. Dieser Lesekontakt ist **kein belegter Ersatz aktiver Wortproduktion**. cgo-010 muss die Lernabdeckung ausdrücklich beurteilen. Die Rekonstruktion erhält entfernte Themen/Varianten, behauptet aber weder den Text der verlorenen Anhänge noch deren damaliges Reviewerurteil.

## 2. Vorhandene Facharbeit bleibt gültig in ihrem tatsächlichen Umfang

Die 57 Aufgabenregister enthalten 5.898 Zeilen-Fingerabdrücke, die 57 Wortbankregister 2.446. Der eigene leichte Vergleich nutzt die unveränderten Zeilenfunktionen aus `packages/content-pipeline/src/review-items.ts` und `review-wordbank.ts` sowie die tatsächliche Korrekturauflösung aus `packages/content-loader/src/index.ts`. Er ergibt **4.964 gleiche Aufgabenzeilen, 934 abweichende und 2.446 gleiche Wortbankzeilen**. Das ist keine neue Sinnprüfung und kein Ersatz der vollständigen Schema-Prüfung.

| Fall | Altes Register → heutiger Zeilenhash | Was erhalten bleibt / was neu geprüft werden muss |
|---|---|---|
| Y1 `g1u01.gi.imperatives.cp.002` | `35828f0dde61` → identisch | Inhalt der erfassten Zeile unverändert, Runde 2. Auswahl „Close the window!“ samt Situation/Distraktoren bleibt belegt. Neue Schüleransicht und Integration sind davon nicht gedeckt. |
| Y1 `g1u01.w.book` | `a93918ae224f` → `6edaf3ccaf22` | Nur erfasste Übersetzungszelle ergänzt: `Buch` → `Buch ; das Buch`. Historischer Inhalt unter `d6150c5ffe54d460df7df9809ad2203f3d238b8b` reproduziert alten Hash; Artikelkorrektur PR133. Nicht wieder auf den alten engeren Schlüssel zurücksetzen. |
| Y3 `g3u01.w.brave` | `78c3394d64ce` → identisch | Runde 1; erfasste Zeile unverändert. Kein pauschales Wiederöffnen der ganzen Unit. |
| Y3 `g3u01.w.audition` | `c6393ca53a60` → `8f5fe7e394bc` | Übersetzung ergänzt `das Vorsingen ; das Vorsprechen` zu `Vorsingen ; Vorsprechen`, PR136. Vorherige Zelle unter `80b590e4a4cd9c62e262dfc8790ba8c547623da4` reproduziert alten Hash. Änderung verlangt passende Variantenprüfung, nicht Neuverfassen der gesamten Aufgabe. |

Die vollständigen Vergleichszellen und historischen Köpfe stehen im fachlichen Reviewregister. Ein passender Zeilenhash deckt nur die tatsächlich einbezogenen Felder: nicht jedes Erklärungsfeld, keinen veränderten Renderer, keine Speicherung. Eine neue Antwortmenge oder Schüleransicht kann daher trotz unverändertem alten Register eine gezielte neue Prüfung verlangen. Die übrigen 932 Abweichungen sind mit diesem Vier-Fälle-Nachweis **nicht** semantisch abgenommen.

Der anschließende vollständige **mechanische Feldabgleich aller 934 Abweichungen** findet fünf Gruppen: 783 nur Übersetzung, 109 nur Antwortmenge, acht nur Prompt, 29 nur veränderten Hashumfang und fünf Übersetzung plus veränderten Hashumfang. Die letzten beiden Gruppen gehören ausschließlich zum g2-u03-Piloten. Dessen ursprüngliche Prüffunktion am Kopf `56d98945c1eeb20c5a7a640db99af3eb95f07378` erfasste `hintDe` noch nicht; PR14 (`9e54b782d8aa36f070ab7713babe5346fb7f84d1`) ergänzte die Spalte. Mit der damaligen Funktion lassen sich alle 34 alten Hashes reproduzieren. Die 34 Hinttexte selbst sind gegenüber dem Pilotstand unverändert. **29 Hashabweichungen sind deshalb kein nachgewiesener Inhaltswechsel.** Die neue Hilfenfrage bleibt trotzdem eine neue Prüfgrenze.

Die 788 Übersetzungsänderungen ergänzen jeweils deutsche Vollantworten; neun stufen dabei Artikelantworten von Teil- zu Vollanerkennung hoch. Sie sind daher nicht pauschal nur zusätzliche Schreibweisen. Die 109 Antwortmengen betreffen unter anderem vollständige Kontraktionsvarianten. Die acht Prompts betreffen sieben Satzplättchen-Aufträge in g3-u05 und den fehlenden zweiten Artikel im Plättchensatz `g4u08.gi.tense-time-expression-review.sb.003`. Jede einzelne Zeile samt Vorher/Nachher und reproduzierendem historischem Kopf steht in `review-drift-groups.json`. Geänderte Schlüssel brauchen passende Varianten-/Bewertungsprüfung; geänderte Prompts einen neuen Sicht-/Lösungsraumabgleich. Unveränderte andere Zellen behalten ihren begrenzten früheren Nachweis.

Frühere negative Urteile bleiben sichtbar: Der g2-u03-Pilot (S237, Juni) korrigierte unter anderem `shall`/`will`, die Bewertung `sick`/`ill` und die volle Anerkennung der Bindestrichform `trick-or-treat`; erst danach wurde der damalige Durchgang angenommen. Die A5-Regeln (S236) erhalten vollständige Antwortarrays, zulässige deutsche Artikelvarianten und begrenzte Kontraktionssymmetrie. Sie sind kein Freibrief für beliebige Synonyme.

Der Juni-Pilot bestand mit 61 Aufgaben, davon 34 Vokabeln und 27 Grammatikaufgaben. Kokis spätere Juli-Kritik an der kalten Lösbarkeit derselben Vokabeleinheit ist eine zusätzliche Qualitätsfrage. Sie widerlegt nicht rückwirkend jede frühere Schlüsselprüfung. Umgekehrt beweist „damals approved“ nicht, dass ein Kind ohne Wortliste heute alle Aufgaben versteht.

## 3. Alle zehn Juli-Arbeitsstränge und ihre heutigen Grenzen

Die Kennungen H1–U1 in `commitments.json` zerlegen die folgenden Zeilen in überprüfbare Unterzusagen. „Teilgebaut“ bedeutet vorhandene Bausteine, nicht erfülltes Endziel. Keine der zehn Bahnen ist durch diesen Nachtrag vollständig verifiziert.

| Arbeitsstrang | Erhaltene Zusage | Heutiger Befund und Weiterbehandlung |
|---|---|---|
| WS-HINT | Bedeutung → erster Buchstabe → Anzahl → Antwort; aktiv abrufbar, Üben/Review; beide Sichtbarkeitsvarianten; Hilfestufe aufzeichnen; Tests ohne Leck | `task-ui` zeigt nach Fehlversuchen statische `hintDe`. Arcade und Painted Book haben echte eigene Leitern (`game-2d/ArcadeGame.tsx`, `game-paint/cards/hint.ts`/`CardShell.tsx`), mit anderer Reihenfolge/Bedienung. Practice/Review senden `hintUsed:false`. Allgemeine Juli-Leiter mit Kontextaufzeichnung und P1-Entscheid offen → V1. |
| WS-METHOD | Kalter Schüler, Denkbelastung, Antwortvarianten, Distraktoren, sichtbare Lecks; Methode verweist auf echte Prüfer und Exemplar | Content-Pipeline und Curation-Standard wiederverwenden. Genannter kanonischer Methodenskill nicht nachgewiesen; GG-Frage → V1. |
| WS-CAL | Alle 34 g2-u03-Wörter; easy/medium/hard, Phrasen/unregelmäßige Formen/nahe Distraktoren; Wiederholungsbudget und Formatmix; echtes P1-Urteil | Alte Juni-Freigabe und negative Juli-Fälle guys/wild/shall/keep/apple-bobbing nebeneinander erhalten. Vier Pools ersetzen Budget/kalte Verständlichkeit nicht. W0 Y1/Y3 ersetzt P1 nicht ohne Entscheidung → V1. |
| WS-COLD | Getrennter Durchgang ohne Wortliste/Hilfe und Durchgang mit jeder Leiterstufe; Uneinigkeit führt zur Aufgabenüberarbeitung | Historisch je drei frische Löser gefordert; heutige zwei W0-Leser sind anderer Prüfgegenstand. Kein eigener Agentenstart auf dieser Karte. Große Welle erst nach Exemplar und GG-Entscheid → V1/V6. |
| WS-INTRO | Gruppierte „Meet the words“-Szene, Gruppenbild, schrittweise Karten, Suche; eigenes erstes Szenenurteil | `vocab-intro`-Lernpfadknoten ist vorhanden. Er beweist keine fertige illustrierte Szene; cgo-007 ersetzt ihr menschliches Gate nicht → V4. |
| WS-INDEX | Vorhandene Transkriptionen aller vier Jahrgänge; jede Zeile abgleichen; stabile Wortkennung, erste Buchstelle und spätere Vorkommen | Wortbanken vorhanden; vollständiger Erstvorkommensindex mit Konfliktbericht nicht belegt. P0-Abgleich vor Schema-Freeze, keine neue OCR → V2. |
| WS-VAULT | Wortkarte mit Übersetzung/Definition/erster Stelle/„Später üben“; private Sammlung; offline sichere Speicherung; anderer Abrufpool | `practice_attempts` und `review_queue` sind keine persönliche Sammlung. Kein vollständiger `student_word_vault`-Weg belegt. Vier Pools aus PR128 sind wiederverwendbarer Baustein → V3. |
| WS-PROG | Statische Unterrichtsprogression × echter Lernstand; Hilfen nur bei belegtem Lernziel auslassen | `study_path_progress` speichert Knotenabschluss/Sterne. Das ist kein Beweis beherrschter Wörter oder aller Aufgabenformen. OG-Absicht erhalten, synthetische Hochrechnung verwerfen → V5. |
| WS-GRAMMAR | Später Grammatikindex mit erster Lernstelle und verständlicher Erklärung | Strukturkatalog wiederverwenden; nach bewiesenem Index/Vault weiterführen, nicht versehentlich löschen → V5 später. |
| WS-UNKNOWN | Später private, isolierte Behandlung unbekannter Wörter unter Qualitäts-/Datenschutz-/Kostengate | Geparkt; keine ungeprüfte Einspeisung in gemeinsamen Korpus und kein heutiger Generierungsauftrag → V6 später. |

S3 verlangt ferner ein vollständiges Prototypenpaket, zwei menschliche Gates und danach einen Replikationsbrief v3. Ein solcher Abschluss ist bisher nicht nachgewiesen. Die erinnerte Plan-PR bleibt **UNVERIFIZIERT**: PR117 archiviert den Juli10-Vorläufer, PR128 baut vier Pools; keine davon darf zur erfundenen Juli15-Programm-PR werden. Git-/PR-Suche ist ein Suchbeleg, kein Beweis, dass es die gesuchte PR nie gab.

## 4. Erhaltung über den gesamten Lernweg

„Maßgebliche Bewertung“ meint die Bewertung, die tatsächlich über dauerhafte Lernpunkte entscheidet. Eine sofortige Browseranzeige ist davon zu unterscheiden. Alle nachfolgenden Codebefunde sind statische Quellenanalyse am Startpin, **kein neuer Browser-, Konto- oder Datenbanknachweis**.

| Teil des Lernwegs | Originale / Zusage | Heutiger belegter Anschluss | Offener Erhaltungsauftrag |
|---|---|---|---|
| Vokabelhandlung | Kontext ergänzen, Definition erschließen, übersetzen, Wortpartner erkennen | `task-ui/src/vocab-pool.ts`: carrier, definition, deToEn, enToDe; PR128 | Vier Pools decken nicht automatisch Wortpartner/Collocations. Beide Übersetzungsrichtungen ausdrücklich prüfen. |
| Sichtbarer Auftrag | Aufgabe muss ohne heimlichen Schlüssel oder verborgene Hilfe verständlich sein | `VocabItemView`/`GrammarItemView`, Paint CardShell, Novel TaskTake | Ursprung des Kontextes, Ton, Wortniveau und echte Bedienansicht binden; ein verborgenes OG-Prompt ist kein Vorbild. |
| Hilfe | OG erster Buchstabe/Länge; Juli gezielte semantische Leiter | Mehrere lokale Leiter-/Retry-Verfahren vorhanden | Genaue Reihenfolge, Leckschutz, sichtbare Hilfen und gespeicherte Hilfestufe zusammen abnehmen. Alte XP-Abzüge/Combo-Regeln nicht ungeprüft übertragen. |
| Bewertung | Ein Bewertungsweg; vollständige plausible Varianten | Server `/api/attempts` lädt aktuelle Inhalte/Overlays und bewertet mit `packages/engine` erneut | OG weiche Teilstring-Annahme ist kein Qualitätsvorbild. Antwortmenge und Urteil am echten Prompt prüfen. |
| Speichern | Erfolg erst behaupten, wenn passender Speicherweg bestätigt ist | `persist.recordAttempt`, eindeutige Nutzer-/Versuchskennung gegen Doppelbuchung; `attempt-outbox` wiederholt vorübergehende Fehler | Mehrere nacheinander geschriebene Tabellen nicht als atomare Transaktion ausgeben. Teilfehler nach erstem Insert gesondert prüfen. |
| Wiederholen | Fällige Aufgaben, richtiger Kontext und anderer Abruf | `db/review.ts`: fünf Stufen, Reservierungsausschluss nach Klasse; ReviewSession | Automatische Queue ≠ freiwillige Sammlung; `.ci`/Story-Kontext nicht auslösen oder verlieren, um eine falsche Grammatikspur zu erzeugen. |
| Lernstand | Tatsächlich gelöste Formate zeigen Breite der Beherrschung | `studypath.ts`: Knoten, Schwierigkeit, Checkpoint, beste Sterne | OG `migrateWordProgress` erzeugt Formate aus alten Erfolgszahlen. Diese synthetischen Werte nicht als echte Abrufbelege übernehmen. |
| Lehrkraft | Fortschritt, Aufgabenvergabe, reservierte Tests, passende Rolle | Vorhandene Plattformdienste, Klassenfilter und Reservierungen | Zugriff und sinnvolle Lernzielanzeige cgo-009/018; Inventar ersetzt kein angemeldetes Lehrkraftszenario. |
| Auth/Klasse | Identität und Klassenumfang begrenzen jeden Schreib-/Lesepfad | `/api/attempts` verlangt `getActingUser`; `assertWritableScope`/`inScope`; `getDueRefs` zieht Reservierungen ab | Donor-Login nicht blind kopieren; Konto-/Klassen-/Rollenmatrix bleibt eigenes Tor. |
| Story/Spiel | Handlung, Aufgabe und Konsequenz gehören zusammen | Paint-Raum-/Kartenkontext; Novel Szene, erzählte Kanalzahlen und echte Lernpunkte getrennt | cgo-010/011 müssen Kontext zum Ziel und späteren Wiederholen erhalten. Kosmetik ist kein Lernpunkt. |
| Offline/Fehler/Wiedereinstieg | Keine erfundene Erfolgsmeldung, wiederholbare Übermittlung ohne Doppelpunkt | Outbox queued/ok; Novel TaskTake saving/saved/queued/failed; kosmetischer Spielstand eigener Weg | Practice/Review ignorieren sichtbare Speicherbestätigung; Novel-Pause behauptet kosmetisches Saved trotz best-effort PUT. Als Grenze führen, hier nicht reparieren. |
| Betrieb/Kosten | Kein ungeprüfter Laufzeitgenerator, kontrollierter Datenwechsel und Aufbewahrung | Historische Deploy-/Import-/Rollover-Runbooks; cgo-005 begrenzter Kostenauftrag erledigt | Keine Preis-/Produktions- oder Lastmessung aus dieser Dokumentkarte ableiten; unbekannte Wörter erst nach eigenem Kostengate. |

### Tatsächliche Aufgabenarten sind keine Spielmodi

Die v2-Grammatikformen aus `content-schema/src/index.ts` sind: gap-fill (Lücke), multiple-choice/context-picker (Auswahl), translation, error-correction, transformation, question-formation und free-form (Texteingabe), sentence-building (Satzplättchen), matching (Paare zuordnen), anagram (Buchstaben), group-sort (Gruppen), matching-pairs (Paarspiel). S181 beschreibt deren Daten- und Bewertungsverträge einschließlich Teilbewertung. Vollrunde, Sprint, Flashcards, Memory, Spelling oder Story sind dagegen Sitzungs-/Spielmodi; sie belegen allein keine Abdeckung dieser Handlungen.

Die OG-Y2-Ansicht enthält zusätzlich `verb-table`. Das v2-Schema kommentiert ausdrücklich dessen Auslassung; S181 führt die Form nicht auf. Ein begründetes fachliches Ablösungsurteil ist damit noch nicht belegt. Empfehlung an GG: erhaltenes Format gezielt einordnen oder seine Ablösung ausdrücklich entscheiden; kein stiller Verlust durch Zählung „13 Formate vorhanden“.

Auch erzählte Entscheidungen und tatsächlich wählbare Zweige sind verschieden. Eigene Prüfung der `next`-Felder: Y3 FOURTEEN hat 142 Szenen und keinen verfassten Auswahlzweig; Y4 FOURTEEN LIVE hat 185 Szenen, drei Auswahlstellen (ch06.s009, ch10.s009, ch13.s005) und eine zusätzliche bedingte Weiche. Das Y4-Strangmanifest S229 hält N1 ausdrücklich geplant und die drei Hauptgabeln gebaut; seine noch fehlenden Recaps bleiben offen. Eine Dialogzeile „This is his choice“ in Y3 macht daraus keine anklickbare Wahl. Y4 bleibt trotzdem unter seinem eigenen Hold.

Originalpins: Y1 `c003d72494adaf01babea84b56c9fbd60e5075c8`, Y2 `75f1b0ba8151326ba91fcbbe0ada76d00c3896a8`, Y3 `a28da7fab6af996a0ffa9314011ff25a79bf757b`, Y4 `21118fff93486d6ab0c2e9316a8ebc74579f13da`. Ihre vier HTML-Dateien sind zusätzliche Referenzen, kein Rückbauauftrag. Fundstellen: Y1 `getTypeCategory`/`isWordMastered`/`migrateWordProgress`/`saveSessionResults`; Y2 Grammatik-Renderer `verb-table`; Y3 `checkGrammarTyped`/`saveGrammarProgress`; entsprechende Y4 Speicher-/Hilfefunktionen. OG-Speichern nutzt mehrere aufeinanderfolgende Firestore-Schritte; ein abgefangener Fehler oder nur Konsoleneintrag ist keine bestätigte Speicherung.

### Exemplarische Datenwege — kein fehlendes Glied wird ergänzt

| Beispiel | Quelle → Schülerhandlung → maßgebliche Bewertung | Speicherung → passende Wiederholung | Urteil / Ziel |
|---|---|---|---|
| Y1 `book`, allgemeines Üben | Unit-vocab + Overlay → gewählter Pool im VocabItemView → Server lädt erneut und `gradeVocab` bewertet | `recordAttempt` → Queue für reguläre Vokabel; Outbox liefert ok/queued. PracticeSession zeigt zunächst lokale XP, verbraucht sichtbar nur Streak-Rückgabe. | Codeweg vorhanden; bestätigter End-to-End-Lauf und sichtbare Quittung UNVERIFIZIERT. WS-HINT/VAULT zusätzlich offen. |
| Y3 unveränderte Buch-Grammatik | Unit-grammar + Overlay → GrammarItemView → serverseitiger Engine-Grader | Attempt → reguläre Grammar-Queue → ReviewSession; Ansicht meldet `hintUsed:false` | Alte Fachprüfung wiederverwenden; Ansicht, Varianten und Speicherung cgo-006/018 gezielt prüfen. |
| Y3 Bens story-eigene Zeile | Story `.ci` + Szene → Novel TaskTake → `/api/attempts` bewertet Storyaufgabe | Antwort wird als reading erfasst; TaskTake zeigt gespeicherte/queued/fehlgeschlagene Antwort. Passende Grammatik-Wiederholung nicht daraus ableitbar; `reviewItems` bleibt ungenutzte Übergabe. | Lernspurentwurf cgo-011; Szene und Ziel bewahren, keine rückwirkenden Punkte erfinden. |
| Y1 Paint Wiederherstellung | `ch01.tasks.v2.json` + sichtbares Objekt → Name, dann Farbe → lokaler Karten-/Spielvertrag | PaintGame stellt Ereignisse bereit, BuchClient verwahrt Spielprofil/Merkseiten. Kein regulärer sprachlicher Attempt-Pfad daraus nachgewiesen. | cgo-010: erst entwerfen, wie Auftrag, Ziel, Urteil und bestätigte Lernspur zusammengehen. Spielprofil nicht als Lernnachweis zählen. |
| Geplantes „Später üben“ | Wortindex → Wortkarte → freiwilliges Speichern | Private Vault-Speicherung und Abruf in anderem Pool fehlen als vollständiger Weg | Geplant V2/V3; vorhandene Review-Queue ist kein Ersatz. |

DomiLingo am gefrorenen Kopf `e0c8…1005` liefert zwei brauchbare Muster: `lib/vocab-review.ts` bündelt Wiederholungsplanung pro Nutzer/Wortliste/Wort; `docs/revision/README.md` bindet Urteile an geprüfte Inhalte und dokumentierte Bedingungen. Für DomiGo sind Quelle, Antwortmenge, Ansicht und Integration separat zu binden. DomiLingos stille Fehlerpfade (`catch` ohne Meldung, leeres Ergebnis bei Fehler) werden ausdrücklich **nicht** übernommen. Auch ein dortiger gültiger Stempel prüft nicht automatisch Quellenrelevanz oder die Vollständigkeit akzeptierter Antworten.

## 5. Konkrete Empfehlungen an GG, keine neu angelegten Karten

| Empfehlung | Vollständiger Arbeitsumfang | Voraussetzung und Abnahme |
|---|---|---|
| V1 · Didaktisches Kalibrierpaket | Juli-Quellen/Methode klären; alle 34 g2-u03-Wörter mit Wiederholungsbudget und Formatmix; zwei Hilfevarianten; kalter und Leiter-Durchgang; Hilfen korrekt aufzeichnen | Alten Juni-Review erhalten. GG entscheidet ausdrücklich Beziehung zum W0-Paket und historische menschliche Tore. Kein Volumen vor gerendertem P1-Urteil. |
| V2 · Erstvorkommensindex | Vier vorhandene Transkriptionen lesen, jede Zeile zu Wortbank/Item verbinden, Duplikate/Konflikte/fehlende Treffer klären, Erst- und Folgevorkommen getrennt | Keine neue OCR. Indexschema erst nach vollständigem Abgleich; negative Probe mit fehlender Wortzeile. |
| V3 · Wortkarte und persönliche Sammlung | Berührbare Wortkarte, private Speicherung, klare Fehler-/Offlinezustände, wiederholte Sendung ohne Doppelbuchung, Abruf in anderem Pool | V2 und geeignete V1-Pools; eigene geprüfte Datenänderung später. Ein echter Schülerweg vom Speichern bis Abruf, einschließlich Fehler und Wiedereinstieg. |
| V4 · Einführung und Kunst | Gruppierte Wortszene mit Karten/Suche, eigenständige naive DomiGo-Kunst im LauterEinser-Rahmen | Erstes gerendertes Szenenurteil vor Menge; cgo-007 nur Ausgangsmuster. |
| V5 · Lernzielbezogener Fortschritt | Reale Wort-/Format-/Strukturbelege mit Unterrichtsprogression verbinden, hilfenabhängige Aussage klar benennen; später Grammatikindex | Keine OG-Hochrechnung nie gelöster Formate. Wort bekannt ≠ Unit berührt; Storykontext gemäß cgo-010/011 erhalten. |
| V6 · Replikation und spätere Bahnen | Nach angenommenen Prototypen v3-Brief mit Exemplaren/Fehlern/kleinen Wellen; getrennte Kaltwelle, Journeys-Freigabe und UNKNOWN-Entscheidung | Historische Journeys-Pause bleibt bis ausdrücklichem Urteil; unbekannte Wörter nur nach Qualitäts-/Privatheits-/Kostengate. |
| H1 · Herkunftslücken schließen | S3-Original, Methodenskill, Replikation v3, S136-Anhänge und erinnerte Plan-PR suchen/liefern oder präzise fehlend bestätigen | Boardfrage cgo-025 vom 30.09.; Spiegel bleiben nutzbar. Fehlender Beleg ist kein Widerruf. |
| H2 · Restliche Einzelzusagen | 247 Quellenabschlussfelder anhand der erhaltenen Originale und heutigen Einzelbelege auflösen, besonders Großregister/Filed/Blueprint-Rest | Konkrete alte Kennung → Zustand → Code/Urteil → Ziel; keine Summenfreigabe. cgo-017 nicht mit cgo-025 gleichsetzen. |
| H3 · Format-/Kontextentscheidungen | `verb-table`, Wortpartner und Story-Wiederholung ausdrücklich erhalten/ersetzen; begründetes Urteil statt Omission | GG-Entscheid vor Vollständigkeits-Ja. Keine Produktänderung durch diesen Nachtrag. |

Die 35 Altkarten bleiben zusätzlich vollständig in `legacy-cards.json` erreichbar. B1/B2/C/F → cgo-008/014/015/016, Y1/Y3-Lernspur → cgo-010/011, Y3 Vorschau/Kunst/Reife → cgo-012/013/019, Registerhygiene → cgo-017, Zugang → cgo-009. Kapitel 3–6, Klang, spätere Plattformarbeiten und Y4-Hold verschwinden nicht hinter der aktuellen Y1/Y3-Fokussierung. Neue Karten oder Planprioritäten legt ausschließlich GG fest.

## 6. W0-Abgleich und Nachweisgrenzen

Der aktuelle feste Boardabgleich ist in [w0-reconciliation.json](coverage/w0-reconciliation.json) gebunden; cgo-006 steht auf review mit Hold, nicht done. Die 35 Altkarten wurden am selben Boardpin erneut gelesen: keine Zustandsänderung gegenüber der ersten eigenen Aufnahme.

Die anfänglich gelieferten 23 W0-Dateien am Kopf `9d787…8c0e` waren ausdrücklich vorläufig. Die damaligen kalten Leser cgo-027 und cgo-028 meldeten **Nein** zum unklaren Antwortumfang von p019. Das ist kein rückwirkendes Nein zum gesamten alten Korpus.

Zwischenabgleich mit PR472 am 30.09.: neuer Kopf `fcbfee51ed3a0f0043a21c2540cc141943c2244f`, Basis identisch mit dieser Karte. Der Autorenbericht meldet einen neu gebundenen Export und weiterhin fehlende frische unabhängige Annahme. Die schwere Batterie endete mit `pnpm test` Exit 1 wegen eines unbehandelten Vitest-Rückmeldungs-Timeouts; weitere Prüfungen wurden abgebrochen/nicht gestartet. Ursache offen. Weder alte Leserantworten noch alte grüne Batterie gelten dadurch am neuen Paket. Der Schlussabgleich mit dem endgültigen cgo-006-Ergebnis steht noch aus und bleibt ein Übergabehindernis, falls GG keinen ausdrücklich begrenzten Reviewstand festlegt.

**UNVERIFIZIERT:** vollständige Einzelzusagenabnahme der 247 Quellen; fehlende Original-/Nachfolgerquellen und erinnerte Plan-PR; übrige Itemdrift; menschliche Juli-Gates; finale W0-Annahme; echte Speicherung/Offline/Wiedereinstieg mit Konten; gesamte Originalformat-Parität; vollständige Lehrkraft-/Klassenansicht; neue visuelle oder Leistungsmessung. Dieser Nachtrag erzeugt keine Bilder und ändert keine Produktlogik.

Die leichte Prüfung muss Herkunftskennungen/Hashes/Dateizaun sowie absichtlich beschädigte Kopien kontrollieren: fehlendes S3, unentschieden als ersetzt, alte Freigabe trotz geänderter Ansicht/Antwortmenge, Queue als Vault, erfundene Speicherbestätigung und verlorene Storyszene. Das Bestehen dieser Gegenproben beweist die jeweiligen Sperren im Dokumentabgleich, **keine neue semantische Vollprüfung**. Frische Befehle/Exit-Codes stehen im PR und Boardbericht. Historische Befehle in Inventar §10 bleiben unverändert historische Belege.

## 7. Auftragspunkt für Auftragspunkt

| Kartenauftrag | Erfüllt | Teilweise / konkret noch offen |
|---|---|---|
| 1 · Quellen/Entscheidungslinie | 247 Kennungen, sechs Klassen, genaue Fassungen/MD5; fünf echte Duplikate; 14 begrenzte Versionsketten; ergänzende Orders/Rulings/Board; alle 35 Altkarten; 385 Filed-Einzelposten | Eine vollständige atomare Entscheidungslinie für jede Zusage der 247 Quellen ist nicht fertig. S001/S002/S046/S217/S218/S219 besitzen jetzt Einzelstellen einschließlich Unterkriterien und konkreter Beleglücken. Der Abgleich mit allen übrigen Quellen muss noch abgeschlossen werden; die individuelle offene Produktabnahme ist dabei kein Grund, die zugehörige Zusage auszulassen. Die fünf fehlenden Quellen und Plan-PR sind durch GG einzeln offen bestätigt. H1/H2 benennen den nötigen nächsten Schritt; kein Vollständigkeits-Ja. |
| 2 · Facharbeit erhalten | 57+57 Register, 5.898/2.446 Zeilen; je ein unveränderter/geänderter Y1/Y3-Fall; alle 934 Abweichungen mit konkreten Feldern und historischen Hashfunktionen; frühere negative Urteile und Varianten erhalten | Mechanische Herkunft ist geklärt, neue semantische Bewertung der 905 geänderten Zeilen nicht Teil dieses Nachweises. Aktuelle Ansicht und Integration sind gesondert offen; die alte Prüfwelle wird nicht zurückgesetzt. |
| 3 · Juli/S3 | Alle zehn Stränge und 23 Unterzusagen, g2-u03-Doppelurteil, Budget/Formatmix, beide Blindprüfungen, Erststelle/Vault/anderer Pool/Progression/Transkriptionen; Plan-PR ehrlich getrennt | Kein belegter historischer Abschluss von METHOD/v3/P1/Szenengate. Heutige W0-Piloten lösen diese Verpflichtungen nicht ohne GG-Entscheid ab. V1–V6 sind vollständige Empfehlungen, keine vom Autor erfundenen Baukarten. |
| 4 · Gesamtweg | Originalhandlungen/Bedienformen/Modi, Bewertung, Speicherung, Wiederholung, Rollen/Klasse, Story, Offline/Wiedereinstieg/Betrieb; DomiLingo-Codegrenzen; vier exemplarische Datenwege; neun entfernte Kleidungsthemen | Echte bestätigte Speicher-/Reviewwege mit Konten hier nicht geprüft. `verb-table`, Wortpartner und kontextgerechte Storywiederholung bleiben benannte Entscheidungen/Arbeiten. Neuer Look nicht durch Dokument oder cgo-007 vollständig abgenommen. |
| 5 · Lieferung/Prüfung | Drei angeforderte Dokumente und ausschließlich fachliche Zuordnungsdaten im Zaun; alte Dokumente als bytegleicher Präfix erhalten; eigene Gegenproben, keine eigenen Prüferagenten | Schwere Pflichtbatterie erst nach GG-Zuteilung; aktueller W0-Schlussabgleich und unabhängiger Leser offen. Dokumentreview kann diese Grenzen beurteilen; es darf sie nicht als erfüllt übernehmen. |

**FREIGABE für eine Behauptung „Inventur vollständig“: nein.** Der konkrete Rest steht in dieser Tabelle und den einzelnen Dispositionen. Ein späteres Ja benötigt die fehlenden Einzelbelege und den ausdrücklich angenommenen Schlussstand, nicht zusätzliche gleiche Kennungsprüfungen.

## Späteres Koki-Urteil: Sprache und Didaktik (Nachtrag 7)

Die technische Übernahme von cgo-007/PR473 ist **keine sprachliche oder didaktische Annahme**. Kokis späteres Urteil verlangt ein neues geprüftes Muster; Serienarbeit bleibt gesperrt. Kunst/Figuren sind nicht pauschal verworfen. [Die ergänzte Zuordnung](coverage/didactics-and-donor-history.json) erhält zwölf Anforderungsgruppen und neun konkrete DomiLingo-Fehlerketten mit Originalbeleg, wirksamer Prüfung und Übertragungsgrenze.

Sichtbar heißt es **Chapter**; interne Schlüssel bleiben erhalten. Frühes Year 1 braucht deutsche Orientierung und je englischem Text belegte Voraussetzungen. Maßgeblich sind tatsächliche Student’s-Book- und Workbook-Seiten samt Bildern und Aufgabenfolge. Für diese Dokumentkarte wurde kein neuer Lernweg entworfen und kein PDF-Sichtstudium behauptet. Der notwendige Sichtbeleg bleibt bei der Muster-/Inhaltsarbeit offen, obwohl die PDFs laut GG verfügbar sind.

DomiLingo liefert konkrete Gegenbeispiele gegen pauschale Qualitätsbehauptungen: perfect-Urteile ohne gemessenes Wort-Spotting-Kriterium, Lösungen in Schülerfeldern, abgewiesene richtige Varianten und Dateidrift nach Abnahme. Die dokumentierten Matura-Schwellen sind **keine Anfängerregel**. Die Sept28-Driftregel ersetzt die ältere folgenlose unranked-Behandlung; ein neu berechneter Hash allein ersetzt keine erneute Lektüre des geänderten Inhalts.

### Arbeitsstand der fortgesetzten Einzelzuordnung

94 Quellen enthalten jetzt 5.511 gebundene Einzelstellen; 17 konkrete Produktbeleggruppen ergänzen die Quellenurteile. Der Restkatalog wird weiter zugeordnet; dies ist weiterhin **kein Vollständigkeits-Ja**. Bei matching und group-sort fehlt die früher verlangte Teilwertung nachweislich im heutigen Bewerter (Beleg P17). Zwei Quellenstellen mit historischen Zugangsdaten bleiben nur über Fundstelle und Originalprüfsumme gebunden; die Werte werden nicht weiterveröffentlicht.

## Vier Jahrgänge: Zuständigkeiten nach Nachtrag 9

CODEX DRAFT — NOT CANON. Die globale Herkunft bleibt bei cgo-025. Die eigenständige didaktische Ausarbeitung übernehmen **cgo-033 (Jahrgang 1), cgo-034 (Jahrgang 2), cgo-035 (Jahrgang 3) und cgo-036 (Jahrgang 4)**, jeweils im eigenen Dokumentbereich. [Zuständigkeiten und sechs Lieferpflichten](coverage/grade-architecture-handoff.json) erhalten den vollständigen Auftrag einschließlich Kokis eigener Unterrichtseinführungen, Grammatik-/Vokabelmaterialien, Probeprüfungen und Checkups. Die Architekten prüfen Originale selbst; diese Inventur behauptet weder gelesene Unterrichtsoriginale noch fertige Jahrespläne.

Ein Checkup erhält einen eigenen Vertrag für Hilfen, Antwortformen, Teilpunkte und Lernstandsfolgen. Das erste Gestaltungsmuster ist keine allgemeine Schablone. Die späteren Inhaltsleser030/031 haben laut Nachtrag9 insbesondere p017 beanstandet; unveränderte Inhaltsübernahme bleibt bis zur Auswertung durch cgo-006 gesperrt.
