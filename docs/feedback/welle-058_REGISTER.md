# welle-058 · Kokis Spielpass durch Kapitel eins

**CODEX DRAFT — NOT CANON · Arbeitsregister, 20.09.2026.**

Quelle: die vollständig angehängte Sprachnotiz im Auftrag dieser Sitzung. Die Überschrift „SPRACHNOTIZ:“ fehlt, die Abschrift selbst ist vorhanden; ihr Inhalt wird nicht durch eine erfundene Year-2-Runde ergänzt. Verbindliche Order: `ORDER_DOMIGO_SPIELFEEDBACK_2026-09-20.md`, MD5 `aaee68946a706a5664c4b510d31514a6`. Geprüfte Ausgangsbasis: `facedcdb` auf `origin/main`. Zitate sind kurze, unveränderte Ausschnitte; Selbstkorrekturen werden ausdrücklich berücksichtigt.

## Zuordnung und Ausführung

Alle konkreten Spielbeobachtungen betreffen **Year 1, Das gemalte Buch, Kapitel eins**, Route `/play/1/buch/ch01`, Unit `g1-u01`. „Nächstes Kapitel“ mitten im Durchlauf meint den nächsten Raum desselben Kapitels: Eingangshalle `p1`, Klassenzimmer bei Nacht `p2`, Schulhof `p3`, Tafelbühne `p4`. Die alte Year-1-Fassung unter `/play/1/[zone]` bleibt unverändert. Year 2 und Year 1 Kapitel zwei bekommen laut Schluss der Sprachnotiz später eigenes Feedback. Der Kunstwunsch zur wirklichen Schulwelt hat eine **geplante** Year-2-Fortwirkung; er ist kein Spielbericht zu PR #452.

Eigene Arbeitskopie: `~/Code/domigo-v2-welle058`, Branch `codex/welle-058-spielfeedback`. Ein PR für dieses Register, kleine Textkorrekturen und die zugehörigen Pläne. Kein Self-Merge. Offener Motor-PR #452 wurde beim Start festgestellt: Die übernommene lokale `AGENTS.md` §3 untersagt einen weiteren PR mit Änderungen unter `packages/**` oder `apps/web/lib/**`. Deshalb erhalten selbst kleine dort liegende Änderungen Risiko **prüfen** und einen konkreten Plan. Inhaltsdateien können unabhängig bearbeitet werden.

Status **GEBAUT** bezeichnet die lokal umgesetzte und auf den acht Spielkarten geprüfte Textänderung; **PLAN** ist ausdrücklich nicht umgesetzt; **BEIBEHALTEN** ist eine positive Rückmeldung oder ein zurückgenommener Änderungswunsch. Technisch vorhandene Funktionen werden nicht mit im Browser bestätigter Bedienbarkeit gleichgesetzt. Laufzeitfehler aus der Sprachnotiz bleiben bis zur Wiederholung **UNVERIFIZIERT**.

Dateischlüssel, jeweils im aktuellen Repository:

- **T**: `content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json` — handgeschriebene Spielkarten, `items`; Kartenkürzel unten haben den Vorsatz `g1.paint.ch01.`.
- **L**: `content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json` — Räume, Gegenstände und Aufgabenfolgen.
- **G**: `packages/game-paint/src/PaintGame.tsx` — Spieloberfläche und Kartenwechsel.
- **S**: `packages/game-paint/src/story/ch01-story.ts` — Prolog, Kapitelauftakt und feste fiktive Klasse.
- **P**: `packages/game-paint/src/PaintScene.ts` — sichtbare Welt und Figurenbewegung.
- **C**: `packages/game-paint/src/story/ClassPhoto.tsx` — Klassenfoto.
- **B**: `apps/web/app/(game)/play/[grade]/buch/[chapter]/BuchClient.tsx` und `apps/web/lib/paint-story-profile.ts` — lokal gespeicherter Spielname und Prologstand.
- **A**: `apps/web/public/art/g1/paint/ch01/` — Kapitelbilder; gemeinsame Heldendarstellung zusätzlich im Nachbarordner `hero/`.

## Einzelpunkte

Jede Zeile enthält genau einen prüfbaren Wunsch beziehungsweise eine bewusste Beibehaltung. Für als PLAN markierte Punkte stehen die Entwurfsseiten in [welle-058_PLAN.md](welle-058_PLAN.md), jeweils unter derselben K-Nummer. Aufwand meint Umsetzung einschließlich Prüfung, keine zugesagte Frist.

| Punkt | Kokis Wortlaut | Fläche / Datei | Art | Deutung und Vorschlag | Aufwand | Risiko | Status |
|---|---|---|---|---|---|---|---|
| K-01 | „the prologue to be viewable, like when you start the level“ | Auftakt; G `openReference`, S; `StoryComic.tsx` | Spieldesign | Prolog direkt am Kapitelstart wieder zugänglich machen. Der vorhandene Knopf „Geschichte“ ist kein Beleg guter Auffindbarkeit. | klein | prüfen | PLAN |
| K-02 | „a bunch of old things in there from, like, previous builds“ | Übersicht `/play/1`; `apps/web/app/(game)/play/[grade]/page.tsx` | Spieldesign | Aktuelle Buchfassung und archivierte Fassungen eindeutig auseinanderhalten; keine alten Spiele löschen. | mittel | prüfen | PLAN |
| K-03 | „develop different styles for them“ | Prolog und Klassenfoto; S, C, A | Kunst | Individuelle Silhouetten, Gesichter, Haare, Kleidung und Gestik der festen Klasse als Identitätsblatt entwerfen. | gross | prüfen | PLAN |
| K-04 | „the realism then gets lost when we are swallowed by the book“ | Vorher-/Nachherbilder; S, A; Year-2-Anschluss | Kunst | Schulwelt glaubwürdig gezeichnet, Buchwelt deutlich fantastischer; dieselben Kinder bleiben erkennbar. | gross | prüfen | PLAN |
| K-05 | „some worry in their face, some uncertainty“ | Prolog `fall`; S, A `story_fall` | Kunst | Unterschiedliche besorgte Reaktionen statt identischer Ausflugsmimik; kein Horror. | mittel | prüfen | PLAN |
| K-06 | „they have just been trapped by an bewitched book“ | Prolog; S `CH01_COMIC` | Inhalt/Sprache | Gefangenschaft, Suche nach der Klasse und Englisch als Hilfe verständlich verbinden. | mittel | prüfen | PLAN |
| K-07 | „das ganze Klassenzimmer voller Tinte“ | Prolog `book`, `fall`; S, A | Kunst | Sichtbare Ursache in einer zusammenhängenden Bildfolge: Tinte läuft aus, erfasst Raum und Kinder, zieht sie ins Buch. | gross | prüfen | PLAN |
| K-08 | „Die Farbe wird noch aufgetragen. Out of context“ | Ladefläche; G `.pb-building-quiet` | Inhalt/Sprache | Metatext durch „Gleich geht es im Buch weiter.“ ersetzen; erst nach Aufhebung der Motor-Sperre. | klein | prüfen | PLAN |
| K-09 | „a bit more on brand … animated“ | Ladefläche; G | Kunst | Buchseite mit lebendigem Klecks und stabilen Textflächen als Ladeentwurf; ruhige Alternative ohne Bewegung. | mittel | prüfen | PLAN |
| K-10 | „the loading times when an event gets triggered are not yet optimal“ | Ereignis-/Raumwechsel; G (lazy CardHost), P, `warm.ts` | Technik/Tempo | Erst Kartenöffnung, Bildladen und Raumwechsel getrennt messen; den tatsächlich langsamen Abschnitt gezielt verkürzen. | gross | prüfen | PLAN |
| K-11 | „cards in the beginning … while the background is loading“ | Startablauf; G, S | Technik/Tempo | Intro lesen lassen, während benötigte Weltbilder laden; Startknopf erst bei echter Bereitschaft. | mittel | prüfen | PLAN |
| K-12 | „super child appropriate, super artsy“ | Überschriften, Karten, Knöpfe; G, `cards/`, `StoryComic.tsx`, C | Kunst | Ein zusammenhängendes Schrift-/Farbmuster auf kleiner und großer Ansicht entwerfen, ausgehend von vorhandenen lokalen Schriften. | gross | prüfen | PLAN |
| K-13 | „die verhexte Schule. Nein, lassen wir so.“ | Auftakt; S `CH01_BOOT.titleDe` | Inhalt/Sprache | Die letzte Selbstkorrektur gilt: „Die verhexte Schule“ bleibt. | klein | keins | BEIBEHALTEN |
| K-14 | „der verhexte Zoo … das verhexte Piratenschiff“ | künftige Kapitelüberschriften; `paint/ch02.level.json`, `ch03.level.json` | Inhalt/Sprache | Als Titelrichtung vormerken; keine Umbenennung fremder Kapitel ohne deren Spielpass. | mittel | prüfen | PLAN |
| K-15 | „eine Sprechblase … der sollte animiert sein“ | Klecks auf Auftaktkarte; G, `story/KlecksSpeaker.tsx` | Kunst | Klecks als sprechenden, hüpfenden Begleiter ins Kartenlayout einbinden, ohne den Text zu verdecken. | mittel | prüfen | PLAN |
| K-16 | „zu dem Zeitpunkt wissen wir den Namen noch nicht“ | Kapitelauftakt; G `chapter-intro`, B | Fehler | Gespeicherten Namen vor der Tafel-Namensszene nicht aussprechen; Kontoname und innerhalb der Geschichte bekannter Name sind getrennt. | klein | prüfen | PLAN |
| K-17 | „warum sagt der Typ jetzt: Schön, dass du da bist?“ | Auftakt; G | Inhalt/Sprache | Unpassende Willkommenszeile entfernen; Klecks erkennt die Lage an. | klein | prüfen | PLAN |
| K-18 | „den Kontext für das gesamte Level“ | Auftakt; S `CH01_BOOT.linesDe`, L `goalDe` | Inhalt/Sprache | Den Gesamtauftrag erklären; erste Buchaufgabe erhält ihren Hinweis erst vor Ort. | mittel | prüfen | PLAN |
| K-19 | „Ich habe mich befreit“ | Klecks-Herkunft; S | Inhalt/Sprache | Bestehende Loslösung vom Tintengeist verständlich mit Klecks’ Hilfe verbinden; nicht die spätere Identität des Gegenspielers verraten. | mittel | prüfen | PLAN |
| K-20 | „sammel alle Gegenstände … und alle Regelseiten“ | Gesamtziel und Bilanz; L, G | Spieldesign | Befreite Schulsachen und eingesammelte Regelseiten korrekt unterscheiden; keine unsichtbare Inventaraufnahme behaupten. | mittel | prüfen | PLAN |
| K-21 | „wenn man da vorbeispringt … immer prominenter“ | erstes Buch; L `p1`, P Hinweise | Spieldesign | Hinweis bei übersehenem Buch stärker machen, ohne den Weg unsichtbar zu sperren. | mittel | prüfen | PLAN |
| K-22 | „rauf und runter … hin und her zappelt“ | entfärbte Gegenstände; P, `anim.ts` | Kunst | Deutliche, begrenzte Rufbewegung und Glühaura; keine konkurrierenden Dauerblitze. | mittel | prüfen | PLAN |
| K-23 | „Das Buch muss farblos sein“ | Weltbuch und weitere Gegenstände; P, `anim.ts`, A | Fehler | Vollständige Entfärbung vor der Aufgabe prüfen und als Zustandsdarstellung korrigieren. | mittel | prüfen | PLAN |
| K-24 | „auch im Bild in dieser Karte muss es farblos sein“ | Namens-/Farbkarte; `cards/CardHost.tsx`, `cards/CardShell.tsx`, `cards/skins.tsx` | Fehler | Kartenbild und Weltzustand über dieselben Schritte grau → Farbe führen. | mittel | prüfen | PLAN |
| K-25 | „Dieser Gegenstand hat seine Farbe, seinen Namen und seine Farbe verloren.“ | T `enc.obj-book.r1` | Inhalt/Sprache | Beim ersten Buch vor der Namensfrage „Dieser Gegenstand hat Namen und Farbe verloren.“ verwenden; passt in die Grenze von 56 Zeichen. | klein | keins | GEBAUT |
| K-26 | „klickt man … Buch … Blau … wird das auch blau danach“ | T `enc.obj-book.r1` | Spieldesign | Vorhandene Wahlfolge book → blue erhalten; Darstellungsfehler separat unter K-23/24. | klein | keins | BEIBEHALTEN |
| K-27 | „Der Bleistift ist verhext und will in dein Heft kritzeln“ | T `enc.pencil.k3` | Inhalt/Sprache | Den vorhandenen konkreten Schreibauftrag um „verhext“ ergänzen; Schlüssel bleibt „Don't write!“. | klein | keins | GEBAUT |
| K-28 | „dann klickt man an Don't write“ | Bleistift-Auswahl; L `p1-pencil1`, T `enc.pencil.*` | Spieldesign | Klären und planen, ob Schreibverbot der feste erste Kontakt wird; vorhandene Varianten nicht unbemerkt aus der Lernabdeckung entfernen. | mittel | prüfen | PLAN |
| K-29 | „sag den Namen … gib ihm die Farbe zurück … dann kommt erst die Aufgabe“ | Radiergummi; L `p1-eraser`, T `enc.eraser.*` | Spieldesign | Reihenfolge vollständig umstellen: Benennen, Rosa zurückgeben, Satz reparieren; Zwischenzustand bleibt verhext. | mittel | prüfen | PLAN |
| K-30 | „wieder happy … nicht mehr verhext“ | befreite Gegenstände; P, `entities.ts`, A | Kunst | Farbig-verhext und farbig-befreit müssen an Mimik/Bewegung unterscheidbar werden. | mittel | prüfen | PLAN |
| K-31 | „dieses Pop-up beim Schließfach … sparen“ | Näherung an Geräteschließfach; G `cagehint`, `sim.ts` | Spieldesign | Automatische Unterbrechung beim bloßen Vorbeigehen entfernen; bewusste Interaktion zum Öffnen behalten. | mittel | prüfen | PLAN |
| K-32 | „es sei denn, es ist ein Key-Gegenstand“ | Hinweise auf neue Kräfte; G `grant`, `story/ability-lore.ts` | Spieldesign | Einführung wirklich neuer Kräfte erhalten; keine Faust oder Feder neu in Kapitel eins vergeben. | klein | keins | BEIBEHALTEN |
| K-33 | „Der Titengeist hat Gegenstände weggesperrt“ | T `rsc.soundsystem.r1`, `rsc.tablet.r1` | Inhalt/Sprache | Die zwei Gerätekarten nennen den eingeführten Tintengeist als Ursache des verschlossenen Fachs. | klein | keins | GEBAUT |
| K-34 | „Die Türaufgabe finde ich soweit gut“ | T `door.p1.d2` | Inhalt/Sprache | Höfliche Bitte mit „Please!“ unverändert erhalten. | klein | keins | BEIBEHALTEN |
| K-35 | „Die verhexte Füllfeder möchte eine Frage aufschreiben“ | T `enc.pen.k1` | Inhalt/Sprache | „verhexte“ ergänzen; Frage nach „Wie geht es dir?“ bleibt. | klein | keins | GEBAUT |
| K-36 | „nachdem man … die verhexte Füllfeder wieder zurückholt“ | Füllfeder; L `p2`, T `enc.pen.*` | Spieldesign | Wie beim Radiergummi zuerst Namen und Farbe, danach die gestellte Frage; erst dann vollständig befreit. | mittel | prüfen | PLAN |
| K-37 | „Punkte sammeln für die Gegenstände“ | Belohnung; G, `cards/machines.ts`, `packages/engine/` | Spieldesign | Sichtbare Belohnung entwerfen, die bereits verdiente Lernpunkte abbildet und keine zweite Lernwährung schafft. | gross | Zielkonflikt mit §2 / 9 Laws | PLAN |
| K-38 | „goodies daneben platziert“ | Wege zu optionalen Gegenständen; L | Spieldesign | Vorhandene Buchstaben als kurze Spur zum Fund einsetzen; nur nach Prüfung der Geometrie und Zählungen. | mittel | prüfen | PLAN |
| K-39 | „eine Wolke, die aus Ziffern besteht“ | Zahlenbegegnung `p2`; P, `story/number-swarm.ts`, A `moths_*` | Kunst | Ziffern bilden eine klar erkennbare Wolke; Aufgabe wird durch sichtbare Wolke motiviert. | mittel | prüfen | PLAN |
| K-40 | „die Zahlen tun quasi davon flattern und lösen sich dann auf“ | Abschluss Zahlenbegegnung; P, `sim.ts` | Kunst | Nach richtiger Antwort fliegen Ziffern auseinander, Weg wird frei; Bewegung läuft weiter. | mittel | prüfen | PLAN |
| K-41 | „dass immer ein anderes ist, das passt“ | Zahlenauswahl; `story/number-swarm.ts`, T `qf.moths.*` | Spieldesign | Variation erhalten; Wiederholung derselben offenen Aufgabe bleibt stabil. | klein | keins | BEIBEHALTEN |
| K-42 | „Info gibt über das Level, was denn so passiert, was er so herausgefunden hat“; „er hat einen extra Raum gefunden“ | Klecks vor Bonusraum; G `bonuspay`, L `bonus` | Inhalt/Sprache | Klecks berichtet zuerst vom Levelgeschehen und seinen Entdeckungen, dann von der Kammer und ihren tatsächlichen Funden. | mittel | prüfen | PLAN |
| K-43 | „mehr Sinn ergeben, warum man sie quasi hergeben muss“ | Buchstabenpreis; G `bonuspay`, L Bonusdaten | Spieldesign | Den Preis sichtbar in die Türhandlung einbauen; keine neue erfundene Währung. | mittel | prüfen | PLAN |
| K-44 | „Die Schere schnappt nach dir, also wieder die verhexte Schere“ | T `enc.obj-scissors.r1` | Inhalt/Sprache | „verhexte“ ergänzen, bestehende Namens-/Farbfrage behalten. | klein | keins | GEBAUT |
| K-45 | „Merle wie frozen, bewegt sich nicht mehr mit“ | nach Schere und im Schulhof; P, `sim.ts`, `companion.ts` | Fehler | Beide Symptome gemeinsam reproduzieren: Karte schließen und Raumwechsel dürfen Merles Folgen nicht dauerhaft stoppen. Ursache derzeit UNVERIFIZIERT. | mittel | prüfen | PLAN |
| K-46 | „beim Kleber, bei der Spitze … so benannt werden“ | T `enc.obj-gluestick.r1`, `enc.obj-sharpener.r1` | Inhalt/Sprache | Beide bereits angreifenden Gegenstände als verhext bezeichnen; österreichische Nomen Klebestift und Spitzer erhalten. | klein | keins | GEBAUT |
| K-47 | „dieses Heft … ein bisschen wilder herumfliegen“ | Heft im Schulhof; P, `entities.ts`, L | Spieldesign | Gut lesbare Flugschleife verstärken, mit erkennbarer Angriffsvorbereitung und sicherer Ausweichlinie. | mittel | prüfen | PLAN |
| K-48 | „diese Aufgabe macht keinen Sinn … nur befreien müssen“ | T `enc.heft.n1/n2/r1`, L Heft-Folge | Spieldesign | Zusatzfragen am Heft entfernen, Namens-/Farbrückgabe behalten; vorher prüfen, wo die bisher abgedeckten Lernziele verbleiben. | mittel | prüfen | PLAN |
| K-49 | „oberhalb könnte zum Beispiel der Kleber sein“ | Schultasche und Klebestift im Schulhof; L | Spieldesign | Zweistufige Begegnung entwerfen: obere Bedrohung kündigt Ausweichentscheidung an, Tasche unten kündigt ihren Fall sichtbar an. | mittel | prüfen | PLAN |
| K-50 | „Die Schultasche, was ist denn das, welche Farbe hat sie“ | angreifende Tasche; L `ranzen`, T `enc.ranzen.*` | Spieldesign | Angreifende Tasche bekommt eigene Namens-/Farbrückgabe; nicht mit bereits vorhandenem ruhendem Taschenfund verwechseln. | mittel | prüfen | PLAN |
| K-51 | „nicht unbedingt leicht ausweichen … Incentive“ | Levelwege, optionale Befreiungen; L | Spieldesign | Attraktive Begegnungen und erkennbare Ziele priorisieren; verpflichtende Sperren gesondert auf Spielfreiheit und Frust prüfen. | gross | prüfen | PLAN |
| K-52 | „welches Wort ist keine Farbe? … ein bisschen schwach“ | T `boss.q1`; Tafel-Aufgabenplan | Inhalt/Sprache | Passende anspruchsvollere, weiterhin Unit-1-gerechte Tafelhandlung entwerfen; keine beliebige schwierigere Vokabel einsetzen. | mittel | prüfen | PLAN |
| K-53 | „das gefällt mir, dieses Memory“ | T `boss.me1`, Tafelbewegung | Spieldesign | Zahlen-/Zahlwortpaare und gelobten Rhythmus aus Ausweichen, Landung, Frage und Wischen erhalten. | klein | keins | BEIBEHALTEN |
| K-54 | „schon quasi übernommen von dem Spitznamen … man kann ihn ändern“ | Namensszene nach Hallo; B, `story/StoryName.tsx` | Spieldesign | Kontospitznamen dort als editierbaren Vorschlag übergeben; bisher ist die Vorbelegung nur der lokale Spielname. | mittel | prüfen | PLAN |
| K-55 | „diese Schrift … nicht so im Gameplay-Design“ | Klassenfoto; C | Kunst | Foto als aufgeschlagene Buchseite mit lesbarer Beschriftung im gewählten Schriftmuster gestalten. | mittel | prüfen | PLAN |
| K-56 | „Mitschüler und Mitschülerinnen sollte es auch heißen“ | Prolog und Foto; S, C | Inhalt/Sprache | Sichtbare Texte und Bildbeschreibungen inklusiv formulieren, ohne die feste Zahl fünfzehn zu verändern. | klein | prüfen | PLAN |
| K-57 | „im Buch gefangen … als Vorschau … durchblättern“ | Klassenfoto und Kapitelausblick; C, S | Spieldesign | Fehlende Kinder mit tatsächlichem Kapitelziel verbinden; Vorschauen dürfen keine noch nicht spielbaren Kapitel als verfügbar anbieten. | mittel | prüfen | PLAN |
| K-58 | „Year Two … später … Year One Level Two“ | Auftragsscope | Inhalt/Sprache | Year 2 und weitere Year-1-Kapitel bekommen später neue Sprachnotizen. Hier keine Inhalte dazu erfinden; K-04/14 sind nur Anschlusspläne. | klein | keins | BEIBEHALTEN |

## Grenzen und Entscheidungen

Keine neue Rückfrage ist zum Register nötig. Die Order entscheidet bereits, wie mit größeren Änderungen umzugehen ist: konkrete Entwürfe, dann Architektenprüfung. Die Namensfrage am Ende bleibt editierbar; es werden weder Kontonamen noch reale Schülernamen in dieses Dokument übernommen. Merle und die übrigen Namen aus S sind fiktive Spielfiguren.

Die Empfehlung zur Kunst lautet ein gemeinsames Vorher-/Nachherblatt mit drei deutlich verschiedenen Kindern, anschließend ein einzelnes montiertes Prologbild. Erst nach Kokis Urteil die ganze Klasse ableiten. Für Punkte gilt die bestehende Regel: Lernpunkte entstehen durch geprüfte Sprachleistung, nicht durch bloßes Einsammeln. Für die Schultasche gilt eine lesbare Vorwarnung statt einer unvorhersehbaren Bestrafung.

**Prüfnachweis:** Quellzuordnung am Stand `facedcdb`; technische Prüfungen, Vorher-/Nachheransichten und unabhängige Textlesung werden im PR und im Boardbericht geführt, nicht als Logdateien ins Repository aufgenommen. Die Sprachnotiz ist ein Beobachtungsbericht; ein darin genannter Fehler ist damit erfasst, aber noch kein von Codex reproduzierter Fehler.

**Bilanz zur Review-Übergabe:** 58 Punkte: 4 Fehler, 22 Spieldesign, 18 Inhalt/Sprache, 12 Kunst, 2 Technik/Tempo, 0 Fragen zurück. Davon 6 GEBAUT (acht Situationssätze), 45 PLAN, 7 BEIBEHALTEN. Acht Vorher-/Nachherkarten und unabhängige Sprach-/Bildlesung liegen als PR-Belege vor. Alle 87 lokalen CI-Einzelbefehle einschließlich Produktionsbau bestanden; 2699 Tests bestanden, einer bestehend übersprungen. Der Buchsatz nutzt die bestehende bildgestützte Namensfrage gemäß D-1038; der englische Schlüssel und die zweite Hilfestufe bleiben erhalten. Vollständiger Leveldurchlauf, echte Mobilgeräte und die gemeldeten Merle-Aussetzer sind UNVERIFIZIERT.
