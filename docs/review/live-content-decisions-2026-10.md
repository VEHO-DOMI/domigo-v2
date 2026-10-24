# CODEX DRAFT — NOT CANON

# Live-Inhaltsbank: Entscheidungsblatt Oktober 2026

**Status: DOCUMENT — Vorschlag für GG und Koki; keine Inhalts-, Freitext-, Merge- oder Live-Freigabe.**

Karte cgo-158. Festgelegte Ausgangsversion: `ae9454b1398d7cb1c16c057d707440d4793107d9` (PR 532). Änderungen ausschließlich an diesem Blatt und der [maschinenlesbaren Begleitdatei](live-content-decisions-2026-10.json). Ein Antwortpool ist die Liste der Antworten, die die Anwendung voll oder teilweise anerkennt. Die hier vorgeschlagenen Pools ändern diese Listen noch nicht.

## Was entschieden werden soll

Die Live-Bank enthält 2.550 früher einzeln beurteilte Frage-/Pool-Kombinationen. 493 erhielten ein positives, 2.057 ein negatives Urteil. Die drei früheren Leser prüften getrennte Mengen von 855, 840 und 855 Fragen: genau ein Urteil je Frage, keine dreifache Übereinstimmung. 65 positive Fragen sind Lückensätze. Ihre frühere Freigabe genügt für freie Eingabe nicht; diese 65 bleiben im vorangehenden Formatfilter vom Duell ausgeschlossen. Dieses Blatt verändert weder diesen Filter noch die 493 Quiz-/428 Duell-Bindungen.

Die Verbindung zu jeder Quelle besteht aus einer stabilen Wortkennung plus Antwortpool, nicht allein aus einer laufenden Nummer. Alle 2.550 Frage-/Vollantwort-/Teilantwort-Sätze wurden mit dem aktuellen Korpus abgeglichen: **0 Abweichungen**. Die neun eigentlichen Eingabedateien (drei Lernersichten, drei Schlüssel, drei Einzelurteile) und ergänzende Journale tragen in der JSON-Datei SHA-256-Prüfsummen — Fingerabdrücke der gelesenen Dateibytes. Diese neue Bindungsprüfung bestätigt Datenidentität, keine fachliche Vollfreigabe.

## A1 · Die 2.057 Ablehnungen ordnen

Die Zahlen zählen Hinweise aus den vorhandenen Einzelurteilen, keine 2.057 neu bestätigten Produktfehler. Jeder JSON-Datensatz bewahrt die ursprüngliche Begründung unverändert und nennt deren Datei/Position sowie die aktuelle Korpuszeile. Die Zuordnung wurde zunächst regelgestützt vorgeordnet. Nach dem Leserbefund wurden alle 1.387 zunächst unter c stehenden Originalbegründungen auf die Klassenpriorität durchgesehen: „fehlt“ allein unterscheidet keine fehlende Antwort von fehlendem Aufgabeninhalt. Gemischte Fälle und der Grenzfall 16 wurden nach der folgenden Vorrangregel einzeln berichtigt. Eine regelgestützte Zuordnung ist keine neue sprachliche Vollprüfung aller Fragen.

Es gibt genau eine Hauptklasse je Fall. Bei Überschneidungen hat ein ausdrücklich falscher oder grammatisch unvollständiger akzeptierter Schlüssel beziehungsweise ein eigenständiger Fehler in der Aufgabenbeschreibung Vorrang; reine Schreibformen werden nur dann d, wenn kein zusätzlicher Bedeutungsfehler genannt wird. Explizit unbelegte Sachannahmen stehen unter e. Mehrere bereits angebotene richtige Auswahlantworten sowie ausdrücklich fehlende Unterscheidungsmerkmale oder Satz-/Buchbezüge stehen unter b. Diese Aufgabenbefunde gehen einer zusätzlich genannten fehlenden oder teilgewerteten Schreibantwort vor. Ein reiner Formhinweis ohne konkret benannte fehlende volle Antwort steht ebenfalls unter b. Schwache falsche Auswahlalternativen allein sind dagegen kein falscher akzeptierter Schlüssel: Nennt das Urteil zusätzlich eine passende fehlende volle Schreibantwort, bleibt diese unter c, sofern keiner der zuvor genannten vorrangigen Befunde vorliegt. Eine zusätzliche stilistische Schwäche allein wird nicht zum bestätigten Schlüsseldefekt erklärt. Diese Klassen dienen verschiedenen Folgearbeiten und sind keine Schweregrade. Kategorie c ist insbesondere keine Anweisung, jedes genannte Synonym einzuspielen. Kategorie d behauptet keinen tatsächlich gemessenen Bewertungsfehler: Normalisierung durch den echten Bewerter wurde hier nicht geprüft.

Drei Biosphere-Fälle sind nach dem konkreten Buchabgleich unter b eingeordnet, obwohl die ursprünglichen Urteile einen Begriffsdefekt behaupteten. Das Originalurteil bleibt erhalten; die abweichende Quellenauflösung steht im Dossier. Es wurde keine Begründung stillschweigend ersetzt.

| Klasse | Bedeutung | Fälle |
|---|---|---:|
| a | Hinweis auf fachlichen Aufgaben-/Schlüsseldefekt | 189 |
| b | Isolierte Aufgabe ohne hinreichenden Bedeutungs-/Buchkontext | 569 |
| c | Benannte zulässige Variante fehlt oder erhält nur Teilwertung | 1271 |
| d | Ausschließlich Schreibform | 20 |
| e | Sachunsicherheit / unbelegte Sachannahme im Leserurteil | 8 |
| **Gesamt** | | **2057** |

Zählung nach Jahrgang und Aufgabenformat; jede Zeile zählt nur abgelehnte Fragen.

| Jahrgang | Format | a | b | c | d | e | Summe |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | Übersetzung | 4 | 10 | 114 | 3 | 0 | 131 |
| 1 | Definition | 20 | 48 | 95 | 1 | 0 | 164 |
| 1 | Lückensatz | 4 | 125 | 72 | 0 | 0 | 201 |
| 2 | Übersetzung | 8 | 18 | 101 | 5 | 0 | 132 |
| 2 | Definition | 36 | 58 | 104 | 2 | 0 | 200 |
| 2 | Lückensatz | 6 | 98 | 101 | 1 | 4 | 210 |
| 3 | Übersetzung | 6 | 15 | 132 | 2 | 0 | 155 |
| 3 | Definition | 32 | 25 | 121 | 1 | 0 | 179 |
| 3 | Lückensatz | 17 | 80 | 99 | 1 | 3 | 200 |
| 4 | Übersetzung | 5 | 16 | 122 | 2 | 0 | 145 |
| 4 | Definition | 34 | 28 | 103 | 1 | 0 | 166 |
| 4 | Lückensatz | 17 | 48 | 107 | 1 | 1 | 174 |

Die vollständigen 2.057 Gründe stehen unter `rejections` in der [JSON-Begleitdatei](live-content-decisions-2026-10.json); `stableId` ist die dauerhafte Zuordnung, `number` nur die Nummer des alten Prüfsatzes. `classificationBasis` dokumentiert die Zuordnungsregel oder Einzelentscheidung. Gemischte Gründe bleiben vollständig lesbar, auch wenn die Zählung nur die Hauptklasse verwendet.

## A2 · Acht Kernfälle und zwei zusätzliche Begriffsgruppen

Die folgenden zehn Dossiers decken zwölf Banknummern ab: acht beauftragte Kernfälle, Artist/Autograph und drei Biosphere-Pools. Seiten-/Übungsangaben stammen aus den versionierten Buchtranskripten. Die Originalscans wurden für diese Dokumentkarte nicht neu angesehen. Ein Buchwortbeleg ist kein Beweis, dass ein erzeugter Plattform-Lückensatz wörtlich im Buch steht. Satzherkunft und aktuelle Einsetzung werden deshalb getrennt beschrieben.

### case-78 · Offene Tierlücke (Nr. 78)

- Aktuelle Aufgabe 78: [content/corpus/units/g1-u02/vocab.json:1274](../../content/corpus/units/g1-u02/vocab.json#L1274); `g1u02.w.giraffe#carrier`. Sichtbar: „There's a big ___.“; volle Antworten: `giraffe`.
- Buchfundstelle: **MORE! 1 SB S.16, Übung 1; Übung 2.1**; [content/build/transcripts/g1/sb/SB Unit 2- At the zoo.txt:10](../../content/build/transcripts/g1/sb/SB%20Unit%202-%20At%20the%20zoo.txt#L10).
- Quellenbefund: Die Quelle enthält eine Giraffe im Dialog und Bild. Der isolierte Ausschnitt entfernt diese Zuordnung; Größe allein entscheidet kein Tier.
- Vorschlag für die spätere Baukarte: Buchkontext oder ein geprüftes eindeutiges Tiermerkmal ergänzen; keine vier Tiernamen als dauerhaften Ersatz für fehlenden Kontext freigeben.
- Stand: Quelle vorhanden; Eindeutigkeit geht beim isolierten Lückensatz verloren. Koki-/GG-Entscheid ausstehend.

### case-123 · Zusätzliches of (Nr. 123)

- Aktuelle Aufgabe 123: [content/corpus/units/g1-u03/vocab.json:2850](../../content/corpus/units/g1-u03/vocab.json#L2850); `g1u03.w.to-be-scared#carrier`. Sichtbar: „Greybeard is big and strong. Tamara is ___ of him.“; volle Antworten: `scared`, `scared of`.
- Buchfundstelle: **MORE! 1 SB S.22, Übung 1, Absatz 1**; [content/build/transcripts/g1/sb/SB Unit 3- Pirates.txt:8](../../content/build/transcripts/g1/sb/SB%20Unit%203-%20Pirates.txt#L8).
- Quellenbefund: Der Buchbeleg trägt scared of; im aktuellen Lückenrahmen steht of him bereits hinter der Lücke. Scared of einzusetzen verdoppelt of. Der aktuelle Satz ist eine Umarbeitung, kein identisches Buchzitat.
- Vorschlag für die spätere Baukarte: Im vorhandenen Rahmen scared of aus voller Wertung entfernen; scared, afraid und frightened nur nach fachlichem Ruling als passende Kandidaten prüfen.
- Stand: Mechanischer Einsetzfehler am aktuellen Pool bestätigt. Koki-/GG-Entscheid ausstehend.

### case-204 · Profit ohne Kosten (Nr. 204)

- Aktuelle Aufgabe 204: [content/corpus/units/g1-u05/vocab.json:1702](../../content/corpus/units/g1-u05/vocab.json#L1702); `g1u05.w.profit#definition`. Sichtbar: „the money you have after you sell a thing“; volle Antworten: `profit`.
- Buchfundstelle: **MORE! 1 SB S.43, Our Young World 2, Übung 2**; [content/build/transcripts/g1/sb/SB Unit 5- This is our band.txt:107](../../content/build/transcripts/g1/sb/SB%20Unit%205-%20This%20is%20our%20band.txt#L107).
- Quellenbefund: Das Buch stellt Einkauf und Verkauf von Saft gegenüber. Die erzeugte Definition nennt nur Geld nach dem Verkauf; sie ist nicht die Buchdefinition und lässt den Kostenabzug aus.
- Vorschlag für die spätere Baukarte: Definition mit Erlös minus Kosten erklären; für Jahrgang 1 deutsche Hilfe und ein kleines Zahlenbeispiel vorsehen. Keinen Antwortpool durch pauschale Gleichsetzung von money/revenue/profit erweitern.
- Stand: Begriffsabgrenzung im Plattformtext unvollständig; kein neues Rechenergebnis des Buchvideos behauptet. Koki-/GG-Entscheid ausstehend.

### case-467 · Zwei richtige Zeitfragen (Nr. 467)

- Aktuelle Aufgabe 467: [content/corpus/units/g1-u11/vocab.json:4517](../../content/corpus/units/g1-u11/vocab.json#L4517); `g1u11.w.what-s-the-time#definition`. Sichtbar: „You ask this to find out how late it is.“; volle Antworten: `What's the time?`, `What's the time`.
- Buchfundstelle: **MORE! 1 SB S.83, Kasten Asking for the time (bei Übung 4)**; [content/build/transcripts/g1/sb/SB Unit 11- What's the time?.txt:27](../../content/build/transcripts/g1/sb/SB%20Unit%2011-%20What%27s%20the%20time%3F.txt#L27).
- Quellenbefund: Der Buchkasten nennt beide Zeitfragen ausdrücklich. Die Plattform bietet beide an, wertet aber nur eine voll.
- Vorschlag für die spätere Baukarte: Bei freier Eingabe beide Zeitfragen berücksichtigen; in einer Frage mit genau einer richtigen Auswahl eine der beiden richtigen Optionen durch einen echten Ablenker ersetzen.
- Stand: Fehlende zulässige Variante bestätigt; kein bloßes Schreibformproblem. Koki-/GG-Entscheid ausstehend.

### case-1293 · Doppeltes part (Nr. 1293)

- Aktuelle Aufgabe 1293: [content/corpus/units/g2-u14/vocab.json:2844](../../content/corpus/units/g2-u14/vocab.json#L2844); `g2u14.w.to-take-part#carrier`. Sichtbar: „Do you want to ___ part in the running competition?“; volle Antworten: `take`, `take part`.
- Buchfundstelle: **MORE! 2 WB S.124, MORE Words and Phrases, to take part (in); ergänzend SB S.110–111, Übung 8**; [content/build/transcripts/g2/wb/More 2 WB Unit 14.txt:255](../../content/build/transcripts/g2/wb/More%202%20WB%20Unit%2014.txt#L255).
- Quellenbefund: Der Wortlistenbeleg enthält take part in. Der Plattformrahmen enthält part in bereits. Der WB-Seitenanker ist 124; das Transkript trennt eine mögliche Folgeseite nicht eigens. Der SB-Beleg bestätigt die Wendung zusätzlich.
- Vorschlag für die spätere Baukarte: Im bestehenden Rahmen nur take als volle Einsetzung der Zielwendung zulassen; take part und take part in ergeben Dopplungen und dürfen dort keine positive Teilwertung erhalten.
- Stand: Einsetzfehler bestätigt; Seitennennung folgt dem Transkriptanker, kein Scanabgleich behauptet. Koki-/GG-Entscheid ausstehend.

### case-1416 · Falscher Platz für leave alone (Nr. 1416)

- Aktuelle Aufgabe 1416: [content/corpus/units/g3-u02/vocab.json:2232](../../content/corpus/units/g3-u02/vocab.json#L2232); `g3u02.w.to-leave-sb-alone#carrier`. Sichtbar: „Lucas, please ___ your sister! She wants to read her book.“; volle Antworten: `leave alone`, `leave her alone`.
- Buchfundstelle: **MORE! 3 SB S.18–19, Übung 9, The lost phone**; [content/build/transcripts/g3/sb/More 3 SB Unit 2.txt:94](../../content/build/transcripts/g3/sb/More%203%20SB%20Unit%202.txt#L94).
- Quellenbefund: Das Buch setzt das Objekt zwischen leaving und alone. Die Plattform setzt die gesamte Wendung vor your sister; beide vollen Poolformen passen so nicht idiomatisch.
- Vorschlag für die spätere Baukarte: Rahmen in please ___ your sister alone ändern und leave prüfen, oder eine Lücke wählen, die leave your sister alone vollständig aufnimmt. Vor Umsetzung die Wortidentität to leave sb. alone beibehalten und neu bewerten.
- Stand: Rahmen-/Schlüsseldefekt bestätigt; kein blindes Entfernen nur einer Variante. Koki-/GG-Entscheid ausstehend.

### case-1510 · Doppeltes off (Nr. 1510)

- Aktuelle Aufgabe 1510: [content/corpus/units/g3-u04/vocab.json:2326](../../content/corpus/units/g3-u04/vocab.json#L2326); `g3u04.w.to-bite#carrier`. Sichtbar: „Dave has a new lizard, and it can ___ your finger off!“; volle Antworten: `bite`, `bite off`.
- Buchfundstelle: **MORE! 3 SB S.34–35, Übung 5, Dialog 1**; [content/build/transcripts/g3/sb/More 3 SB Unit 4.txt:63](../../content/build/transcripts/g3/sb/More%203%20SB%20Unit%204.txt#L63).
- Quellenbefund: Das Buch trennt bite und off durch my finger. Die Plattform enthält off bereits nach your finger; bite off im Pool verdoppelt die Partikel.
- Vorschlag für die spätere Baukarte: Im unveränderten Rahmen bite als volle Einsetzung verwenden; bite off entfernen. Satz und Wortfamilie weiterhin an to bite (off) binden.
- Stand: Einsetzfehler bestätigt. Koki-/GG-Entscheid ausstehend.

### case-1687 · Doppeltes to (Nr. 1687)

- Aktuelle Aufgabe 1687: [content/corpus/units/g3-u08/vocab.json:3022](../../content/corpus/units/g3-u08/vocab.json#L3022); `g3u08.w.to-research#carrier`. Sichtbar: „He decided to ___ underwater sounds and how they travel.“; volle Antworten: `research`, `to research`.
- Buchfundstelle: **MORE! 3 WB S.72–73, MORE Words and Phrases, to research**; [content/build/transcripts/g3/wb/More 3 WB Unit 8.txt:277](../../content/build/transcripts/g3/wb/More%203%20WB%20Unit%208.txt#L277).
- Quellenbefund: Die Wortliste enthält decided to research. Im Plattformrahmen steht decided to bereits; to research verdoppelt den Infinitivmarker. Die vorhandene Provenienz nennt dagegen pauschal SB Unit 8 word file, obwohl der genaue Beleg im WB liegt.
- Vorschlag für die spätere Baukarte: To research aus dem vollen Kontextpool entfernen; research bleibt. Study/investigate als sprachliche Kandidaten separat entscheiden. Provenienz in einer späteren Baukarte auf den konkreten WB-Beleg berichtigen.
- Stand: Einsetzfehler und konkrete Provenienzabweichung bestätigt. Koki-/GG-Entscheid ausstehend.

### case-2549 · Artist und autograph verwechselt (Nr. 2549)

- Aktuelle Aufgabe 2549: [content/corpus/units/g4-u13/vocab.json:115](../../content/corpus/units/g4-u13/vocab.json#L115); `g4u13.w.artist#carrier`. Sichtbar: „After the concert, people waited to ask the singer for an ___.“; volle Antworten: `artist`, `autograph`.
- Buchfundstelle: **MORE! 4 SB S.107–108, Übung 2; S.109–110, Übung 3.3**; [content/build/transcripts/g4/sb/More 4 SB Unit 13.txt:35](../../content/build/transcripts/g4/sb/More%204%20SB%20Unit%2013.txt#L35).
- Quellenbefund: Das Buch unterscheidet Künstler und Autogramme. Der Plattform-Satz ist laut sSource invented eigens erzeugt. Er fragt nach autograph, ist aber an artist gebunden; die Antwortliste enthält beides, die Auswahl nicht autograph.
- Vorschlag für die spätere Baukarte: Die artist-Kennung nicht in autograph umdeuten: neuen passenden artist-Kontext entwerfen. Einen Autogrammsatz gegebenenfalls dem vorhandenen eigenen autograph-Eintrag zuordnen und getrennt prüfen.
- Stand: Kein Originalbuch-Ursprung des erzeugten Satzes behauptet; Begriff und stabile Wortkennung sind falsch gekoppelt. Koki-/GG-Entscheid ausstehend.

### case-2469 · Biosphere zwischen Allgemeinbegriff und Buchkontext (Nr. 2469, 2484, 2499)

- Aktuelle Aufgabe 2469: [content/corpus/units/g4-u12/vocab.json:483](../../content/corpus/units/g4-u12/vocab.json#L483); `g4u12.w.biosphere#deToEn`. Sichtbar: „Lebensraum“; volle Antworten: `biosphere`, `a biosphere`.
- Aktuelle Aufgabe 2484: [content/corpus/units/g4-u12/vocab.json:484](../../content/corpus/units/g4-u12/vocab.json#L484); `g4u12.w.biosphere#definition`. Sichtbar: „The closed place on a planet where plants and people can live and breathe.“; volle Antworten: `biosphere`, `biospheres`.
- Aktuelle Aufgabe 2499: [content/corpus/units/g4-u12/vocab.json:485](../../content/corpus/units/g4-u12/vocab.json#L485); `g4u12.w.biosphere#carrier`. Sichtbar: „A ___ is a closed place where plants and people can live and breathe, like on a planet.“; volle Antworten: `biosphere`.
- Buchfundstelle: **MORE! 4 SB S.102–103, Übung 9, Absatz über kuppelförmige Städte; Übung 10.4**; [content/build/transcripts/g4/sb/More 4 SB Unit 12.txt:121](../../content/build/transcripts/g4/sb/More%204%20SB%20Unit%2012.txt#L121).
- Quellenbefund: Der Buchtext nennt abgeschlossene Wohnstädte ausdrücklich biospheres; die Wortliste beschreibt dagegen den Lebensbereich eines Planeten und führt Lebensraum/Biosphäre. Das ursprüngliche Leserurteil gegen jede geschlossene Bedeutung ist durch diesen Buchkontext nicht tragfähig. Die isolierte Übersetzung Lebensraum bleibt mehrdeutig.
- Vorschlag für die spätere Baukarte: Koki entscheidet den Ziel-Sinn: Buchszenario ausdrücklich anzeigen oder allgemeine Biosphäre erklären. Habitat nicht pauschal als Ersatz einspielen. Die drei Ablehnungsgründe bleiben wortgetreu erhalten; die abschließende Routingklasse ist b wegen des fehlenden Sinnkontexts.
- Stand: Quellenkonflikt aufgelöst als kontextabhängiger Bedeutungsentscheid; keine pauschale Schlüsselkorrektur freigegeben. Koki-/GG-Entscheid ausstehend.

Ergänzender Buchbeleg zu Biosphere zwischen Allgemeinbegriff und Buchkontext: **MORE! 4 WB Unit 12, MORE Words & Phrases, Wortlistenzeile biosphere; letzter Seitenanker S.98–99, feinere Blattseite ohne Scan nicht bestätigt**; [content/build/transcripts/g4/wb/More 4 WB Unit 12.txt:190](../../content/build/transcripts/g4/wb/More%204%20WB%20Unit%2012.txt#L190). Der Seitenmarker steht in Zeile 132; keine genauere Scanprüfung behauptet.

## A3 · Freitext-Entscheid je positiver Lückenfrage

**Eine gemeinsame Entscheidung:** Soll die Aufgabe das bestimmte gelernte Wort prüfen oder jede sprachlich und sachlich passende freie Ergänzung akzeptieren? Die 65 Einzelfälle unten machen den Unterschied konkret. Empfehlung: Bedeutung und Antwortformat je Frage sichtbar festlegen; keine pauschale Synonymerweiterung. Gerade in Jahrgang 1 braucht ein neuer Kontext einfache Wörter und deutsche Führung. Zwei kurze Sätze sind zulässig, wenn sie die Bedeutung besser eingrenzen.

A belässt die Auswahlfrage und ihre bestehende Freitextsperre. B nennt einen individuell formulierten, begrenzten Poolvorschlag zur Entscheidung. C verlangt eine Kontext-/Zielüberarbeitung und eine neue fachliche Prüfung. Jede Option ist ein Vorschlag, keine Freigabe. Die B-Listen nennen konkrete passende Kandidaten, behaupten aber keine vollständige Aufzählung jeder möglichen Paraphrase. Auch Empfehlungen B sind **nicht freigeschaltet**; Koki muss den Bewertungsmaßstab entscheiden, danach folgt ein echter Bewertungs- und Auswahllauf. Seltene oder höhere Wörter in einem vorgeschlagenen Pool sind mögliche richtige Schülereingaben, keine Empfehlung, sie ungeprüft in einfache Definitionen einzubauen.

Alle ursprünglichen positiven Urteile und aktuellen Voll-/Teilantworten stehen in der JSON-Datei neben den Vorschlägen. Eine frühere Auswahlfreigabe wird hier nicht in ein positives Freitexturteil umbenannt. Bei C verbleibt die Frage gesperrt, bis ein neuer sichtbarer Kontext samt Pool geprüft wurde.

### Freitext 41 · Jahrgang 1, Chapter 1

> Our teacher turns on the ___ and we look at the film on the wall.

Quelle: [content/corpus/units/g1-u01/vocab.json:2517](../../content/corpus/units/g1-u01/vocab.json#L2517); `g1u01.w.projector#carrier`. Bisher volle Wertung: `projector`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `projector`, `video projector`, `data projector`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Filmprojektion an der Wand und das gesuchte Gerät ausdrücklich erhalten.

**Empfehlung B:** Die Projektion an die Wand grenzt das Gerät ein; die längeren Gerätebezeichnungen sind volle Antworten. Entscheid: **offen**.

### Freitext 42 · Jahrgang 1, Chapter 1

> What ___ is it now? It's midnight.

Quelle: [content/corpus/units/g1-u01/vocab.json:4062](../../content/corpus/units/g1-u01/vocab.json#L4062); `g1u01.w.time#carrier`. Bisher volle Wertung: `time`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `time`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Frage und Antwort gemeinsam anzeigen.

**Empfehlung B:** Die Antwort midnight macht die Zeitfrage klar. Entscheid: **offen**.

### Freitext 44 · Jahrgang 1, Chapter 1

> Do you want a pen ___ a pencil? Take one.

Quelle: [content/corpus/units/g1-u01/vocab.json:1978](../../content/corpus/units/g1-u01/vocab.json#L1978); `g1u01.w.or#carrier`. Bisher volle Wertung: `or`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `or`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Die Aufforderung Take one darf nicht fehlen.

**Empfehlung B:** Take one begrenzt die Auswahl auf eine Alternative. Entscheid: **offen**.

### Freitext 128 · Jahrgang 1, Chapter 3

> You eat and talk with your ___.

Quelle: [content/corpus/units/g1-u03/vocab.json:1860](../../content/corpus/units/g1-u03/vocab.json#L1860); `g1u03.w.mouth#carrier`. Bisher volle Wertung: `mouth`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `mouth`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Bei Umbau beide Funktionen erhalten, Jahrgang 1 deutsch führen.

**Empfehlung B:** Essen und Sprechen führen zur alltäglichen Körperteilbezeichnung; kein zusätzlicher Synonymbedarf im üblichen Lernkontext festgestellt. Entscheid: **offen**.

### Freitext 130 · Jahrgang 1, Chapter 3

> You have got one big ___, and you smell with it.

Quelle: [content/corpus/units/g1-u03/vocab.json:1929](../../content/corpus/units/g1-u03/vocab.json#L1929); `g1u03.w.nose#carrier`. Bisher volle Wertung: `nose`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `nose`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Zahl und Geruchsfunktion erhalten.

**Empfehlung B:** One und smell engen Zahl und Funktion ein. Entscheid: **offen**.

### Freitext 171 · Jahrgang 1, Chapter 4

> The story is about a day in the ___ of Richard.

Quelle: [content/corpus/units/g1-u04/vocab.json:2165](../../content/corpus/units/g1-u04/vocab.json#L2165); `g1u04.w.life#carrier`. Bisher volle Wertung: `life`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `life`, `childhood`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Die Lebensgeschichte in einem zweiten einfachen Satz erklären; Zielwort life sichtbar eingrenzen.

**Empfehlung C:** Der nicht gezeigte Geschichteninhalt entscheidet, ob ein Lebenstag oder Kindheitstag gemeint ist. Entscheid: **offen**.

### Freitext 212 · Jahrgang 1, Chapter 5

> In England, a book is ten ___.

Quelle: [content/corpus/units/g1-u05/vocab.json:1600](../../content/corpus/units/g1-u05/vocab.json#L1600); `g1u05.w.pound#carrier`. Bisher volle Wertung: `pounds`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `pounds`, `quid`, `pence`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Preis mit £10 sichtbar nennen und deutsche Geldhilfe geben.

**Empfehlung C:** England allein belegt den konkreten Buchpreis nicht; auch eine andere Preisangabe ergibt einen Satz. Entscheid: **offen**.

### Freitext 213 · Jahrgang 1, Chapter 5

> Grandma is very ill, so she is in the ___.

Quelle: [content/corpus/units/g1-u05/vocab.json:760](../../content/corpus/units/g1-u05/vocab.json#L760); `g1u05.w.hospital#carrier`. Bisher volle Wertung: `hospital`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `hospital`, `clinic`, `hospice`, `intensive care unit`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Krankenhauskontext ergänzen; keine Erkrankung als eindeutigen Ortsbeweis behandeln.

**Empfehlung C:** Krankheit legt den konkreten Behandlungsort nicht eindeutig fest. Entscheid: **offen**.

### Freitext 223 · Jahrgang 1, Chapter 5

> Jessica plays the drums. She is the ___.

Quelle: [content/corpus/units/g1-u05/vocab.json:395](../../content/corpus/units/g1-u05/vocab.json#L395); `g1u05.w.drummer#carrier`. Bisher volle Wertung: `drummer`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `drummer`, `percussionist`, `musician`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Wenn ausschließlich drummer geprüft werden soll, Zielbedeutung Schlagzeugspieler/in sichtbar eingrenzen.

**Empfehlung B:** Alle drei Personenbezeichnungen passen zum Schlagzeugspielen; drummer ist die spezifische Zielbezeichnung. Entscheid: **offen**.

### Freitext 310 · Jahrgang 1, Chapter 7

> A lot of ___ isn't healthy.

Quelle: [content/corpus/units/g1-u07/vocab.json:2248](../../content/corpus/units/g1-u07/vocab.json#L2248); `g1u07.w.junk-food#carrier`. Bisher volle Wertung: `junk food`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `junk food`, `sugar`, `salt`, `stress`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Konkrete Essenssituation statt beliebigem ungesunden Stoff ergänzen; einfache deutsche Hilfe.

**Empfehlung C:** Die gesundheitliche Aussage ist ohne Stoff oder Verhalten offen. Entscheid: **offen**.

### Freitext 356 · Jahrgang 1, Chapter 8

> The clown wears a ___ over his eyes and nose.

Quelle: [content/corpus/units/g1-u08/vocab.json:980](../../content/corpus/units/g1-u08/vocab.json#L980); `g1u08.w.mask#carrier`. Bisher volle Wertung: `mask`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `mask`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Ein quellengebundenes Kostümmerkmal ergänzen; Bild erst in gesondert freigegebener Arbeit.

**Empfehlung C:** Die bisherige Auswahl stützt mask. Eine darüber hinausgehende Kostümvariante wurde hier nicht durch eine Quelle gesichert; Bild-/Satzbezug vor einer freien Bewertung klären. Entscheid: **offen**.

### Freitext 391 · Jahrgang 1, Chapter 9

> I am ___ in dogs and books.

Quelle: [content/corpus/units/g1-u09/vocab.json:3735](../../content/corpus/units/g1-u09/vocab.json#L3735); `g1u09.w.to-be-interested-in#carrier`. Bisher volle Wertung: `interested`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `interested`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Den Gegenstand persönlicher Interessen explizit erhalten.

**Empfehlung B:** Interested in ist die naheliegende Konstruktion für Interessen an beiden genannten Dingen. Entscheid: **offen**.

### Freitext 397 · Jahrgang 1, Chapter 9

> The ___ is grey and looks like a big mouse.

Quelle: [content/corpus/units/g1-u09/vocab.json:3337](../../content/corpus/units/g1-u09/vocab.json#L3337); `g1u09.w.rat#carrier`. Bisher volle Wertung: `rat`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `rat`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Artkennzeichen aus geprüfter Quelle ergänzen; nicht die Farbe allein verwenden.

**Empfehlung C:** Die ursprüngliche Auswahl stützt rat. Die Merkmale grau und große Maus sind für einen offenen Artvergleich zu prüfen; keine zusätzlichen Tierarten ohne neuen Quellenbeleg als voll richtig ausweisen. Entscheid: **offen**.

### Freitext 526 · Jahrgang 1, Chapter 12

> We can ski in the white snow in ___, the first month of the year.

Quelle: [content/corpus/units/g1-u12/vocab.json:4332](../../content/corpus/units/g1-u12/vocab.json#L4332); `g1u12.w.january#carrier`. Bisher volle Wertung: `January`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `January`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Den Monatsrang als Beleg behalten, Schnee als lokale Situation markieren.

**Empfehlung B:** First month of the year legt den Monat fest; die Wetterhälfte ist kein weltweiter Gültigkeitsbeweis. Entscheid: **offen**.

### Freitext 528 · Jahrgang 1, Chapter 12

> There was a robbery here ___ night, before today.

Quelle: [content/corpus/units/g1-u12/vocab.json:4641](../../content/corpus/units/g1-u12/vocab.json#L4641); `g1u12.w.last#carrier`. Bisher volle Wertung: `last`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `last`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Explizit die unmittelbar vergangene Nacht kennzeichnen; Standardform last night lehren, Variantenentscheidung gesondert treffen.

**Empfehlung C:** Last night ist die idiomatische Standardlösung. Before today allein begrenzt die Zeit nicht sicher auf die unmittelbar vergangene Nacht; keine pauschale Zulassung von yesterday night. Entscheid: **offen**.

### Freitext 530 · Jahrgang 1, Chapter 12

> Wednesday is the ___ day of the school week.

Quelle: [content/corpus/units/g1-u12/vocab.json:1792](../../content/corpus/units/g1-u12/vocab.json#L1792); `g1u12.w.3rd-third#carrier`. Bisher volle Wertung: `third`, `3rd`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `third`, `3rd`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Montag als ersten Schultag ausdrücklich nennen.

**Empfehlung C:** Eine am Montag beginnende Schulwoche ist vorausgesetzt; das ist kein weltweit einheitlicher Kalender. Entscheid: **offen**.

### Freitext 534 · Jahrgang 1, Chapter 12

> The last day of April is the ___.

Quelle: [content/corpus/units/g1-u12/vocab.json:1616](../../content/corpus/units/g1-u12/vocab.json#L1616); `g1u12.w.30th-thirtieth#carrier`. Bisher volle Wertung: `thirtieth`, `30th`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `thirtieth`, `30th`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Monat und Frage nach letztem Kalendertag erhalten.

**Empfehlung B:** April hat 30 Tage; beide vorhandenen Ordinalformen passen. Entscheid: **offen**.

### Freitext 536 · Jahrgang 1, Chapter 12

> We put up a tree with many lights in ___, the last month of the year.

Quelle: [content/corpus/units/g1-u12/vocab.json:3110](../../content/corpus/units/g1-u12/vocab.json#L3110); `g1u12.w.december#carrier`. Bisher volle Wertung: `December`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `December`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Den Monatsrang beibehalten, Baumschmücken nicht als universellen Brauch behaupten.

**Empfehlung B:** Last month of the year legt den Monat fest; der Baum ist nur eine zusätzliche lokale Tradition. Entscheid: **offen**.

### Freitext 538 · Jahrgang 1, Chapter 12

> The last day of the year is the ___ of December.

Quelle: [content/corpus/units/g1-u12/vocab.json:1704](../../content/corpus/units/g1-u12/vocab.json#L1704); `g1u12.w.31st-thirty-first#carrier`. Bisher volle Wertung: `thirty-first`, `31st`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `thirty-first`, `31st`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Beide vorhandenen Ordinalformen erhalten.

**Empfehlung B:** Letzter Tag des Jahres und of December bestimmen den Kalendertag. Entscheid: **offen**.

### Freitext 539 · Jahrgang 1, Chapter 12

> Where were you ___, the day before today?

Quelle: [content/corpus/units/g1-u12/vocab.json:5910](../../content/corpus/units/g1-u12/vocab.json#L5910); `g1u12.w.yesterday#carrier`. Bisher volle Wertung: `yesterday`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `yesterday`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Die erläuternde zweite Satzhälfte erhalten.

**Empfehlung B:** Day before today definiert die gesuchte relative Tagesangabe. Entscheid: **offen**.

### Freitext 571 · Jahrgang 1, Chapter 13

> There were no people on the mountain with me. I was all ___.

Quelle: [content/corpus/units/g1-u13/vocab.json:184](../../content/corpus/units/g1-u13/vocab.json#L184); `g1u13.w.alone#carrier`. Bisher volle Wertung: `alone`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `alone`, `by myself`, `on my own`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Wenn das Einzelwort alone geprüft wird, Wortzahl oder Zielbedeutung offen sichtbar vorgeben.

**Empfehlung B:** All alone, all by myself und all on my own passen vollständig zum sichtbaren Satz. Entscheid: **offen**.

### Freitext 581 · Jahrgang 1, Chapter 13

> It is night and there is no light, so the forest is very ___.

Quelle: [content/corpus/units/g1-u13/vocab.json:1024](../../content/corpus/units/g1-u13/vocab.json#L1024); `g1u13.w.dark#carrier`. Bisher volle Wertung: `dark`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `dark`, `black`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Sichtbarkeit statt bloßer Farbwahrnehmung in einem zweiten Satz verdeutlichen.

**Empfehlung C:** Fehlendes Licht begründet dark; black kann denselben sichtbaren Eindruck beschreiben. Entscheid: **offen**.

### Freitext 617 · Jahrgang 1, Chapter 14

> Saturday and Sunday are the ___, so we have no school.

Quelle: [content/corpus/units/g1-u14/vocab.json:4812](../../content/corpus/units/g1-u14/vocab.json#L4812); `g1u14.w.weekend#carrier`. Bisher volle Wertung: `weekend`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `weekend`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Den Zweitagesbezug erhalten, deutsche Hilfe Wochenende für Jahrgang 1 prüfen.

**Empfehlung B:** Saturday and Sunday together ist die gemeinte Kalendergruppe; schulfrei ist lokal, nicht universell. Entscheid: **offen**.

### Freitext 623 · Jahrgang 1, Chapter 14

> Every day we spend three hours of ___ on a tablet or a phone.

Quelle: [content/corpus/units/g1-u14/vocab.json:2852](../../content/corpus/units/g1-u14/vocab.json#L2852); `g1u14.w.screen-time#carrier`. Bisher volle Wertung: `screen time`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `screen time`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Die gesamte Bildschirmdauer ausdrücken und den vollständigen Satzrahmen idiomatisch überarbeiten; anschließend jeden vorgeschlagenen Einsatz neu lesen.

**Empfehlung C:** Die Empfehlung C bleibt: Bedeutung und Idiomatik des gesamten Rahmens spend three hours of ... müssen zusammen geprüft werden. Tätigkeitswörter wie gaming, reading oder work werden hier nicht als bereits geprüfte Einsetzungen ausgegeben. Entscheid: **offen**.

### Freitext 804 · Jahrgang 2, Chapter 3

> She was dressed like a girl from the 19th ___.

Quelle: [content/corpus/units/g2-u03/vocab.json:86](../../content/corpus/units/g2-u03/vocab.json#L86); `g2u03.w.century#carrier`. Bisher volle Wertung: `century`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `century`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Zeitliche Einordnung und ausgeschriebenes Ziel Jahrhundert sichtbar halten.

**Empfehlung B:** 19th mit historischer Kleidung ist die naheliegende Jahrhundertangabe. Entscheid: **offen**.

### Freitext 844 · Jahrgang 2, Chapter 4

> The ___ at the zoo can talk just like us.

Quelle: [content/corpus/units/g2-u04/vocab.json:2587](../../content/corpus/units/g2-u04/vocab.json#L2587); `g2u04.w.parrot#carrier`. Bisher volle Wertung: `parrot`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `parrot`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Tierart durch zusätzliche Merkmale oder sichtbare Wortauswahl eingrenzen; Nachahmen statt menschliches Gespräch formulieren.

**Empfehlung C:** Die ursprüngliche Auswahl stützt parrot. Vor einer freien Bewertung Tierart und Aussage just like us sachlich präzisieren; weitere Arten wurden in dieser Dokumentprüfung nicht neu belegt. Entscheid: **offen**.

### Freitext 851 · Jahrgang 2, Chapter 4

> Is there a ___ why you don't want to come?

Quelle: [content/corpus/units/g2-u04/vocab.json:2835](../../content/corpus/units/g2-u04/vocab.json#L2835); `g2u04.w.reason#carrier`. Bisher volle Wertung: `reason`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `reason`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Wenn explanation zugelassen werden soll, Artikel und sichtbaren Satzrahmen zuerst gesondert überarbeiten und vollständig neu prüfen.

**Empfehlung B:** Reason passt in den unveränderten Rahmen a ... why. Explanation benötigt hier an und ist deshalb kein gültiger Einsatz im vorgeschlagenen Pool. Entscheid: **offen**.

### Freitext 852 · Jahrgang 2, Chapter 4

> A tiny ___ can carry malaria when it bites you.

Quelle: [content/corpus/units/g2-u04/vocab.json:2301](../../content/corpus/units/g2-u04/vocab.json#L2301); `g2u04.w.mosquito#carrier`. Bisher volle Wertung: `mosquito`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `mosquito`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Vor neuer Veröffentlichung die Sachquelle des bestehenden Satzes mitführen.

**Empfehlung B:** Mosquito bleibt der bisherige Zielbegriff. Ob der allgemeinere Begriff insect ebenfalls voll gelten soll, hängt vom Bewertungsziel ab und bleibt ausdrücklich offen; diese Dokumentprüfung enthält keine neue medizinische Tatsachenprüfung. Entscheid: **offen**.

### Freitext 892 · Jahrgang 2, Chapter 5

> I left my pencil case ___ in school, but I cannot find it.

Quelle: [content/corpus/units/g2-u05/vocab.json:2513](../../content/corpus/units/g2-u05/vocab.json#L2513); `g2u05.w.somewhere#carrier`. Bisher volle Wertung: `somewhere`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `somewhere`, `behind`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Unbekannten Ort ausdrücklich betonen, falls somewhere das Ziel ist.

**Empfehlung C:** Left somewhere und left behind ergeben beide sinnvolle Aussagen über den verlorenen Gegenstand. Entscheid: **offen**.

### Freitext 893 · Jahrgang 2, Chapter 5

> We have to ___ the street. The supermarket is over there.

Quelle: [content/corpus/units/g2-u05/vocab.json:3034](../../content/corpus/units/g2-u05/vocab.json#L3034); `g2u05.w.to-cross#carrier`. Bisher volle Wertung: `cross`; Teilwertung: `crosses`, `crossed`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `cross`, `walk across`, `run across`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Sichere Straßenquerung und das gesuchte Verb eingrenzen; keine Bewegungsgeschwindigkeit erraten lassen.

**Empfehlung C:** Alle drei Bewegungsangaben passen zum Geschäft auf der anderen Straßenseite. Entscheid: **offen**.

### Freitext 933 · Jahrgang 2, Chapter 6

> Wear an ___ near the waterfall.

Quelle: [content/corpus/units/g2-u06/vocab.json:363](../../content/corpus/units/g2-u06/vocab.json#L363); `g2u06.w.anorak#carrier`. Bisher volle Wertung: `anorak`; Teilwertung: `anoraks`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `anorak`, `overcoat`, `oilskin`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Wasserschutz und konkrete Kleidungsart quellengebunden ergänzen.

**Empfehlung C:** An entscheidet nur über den Lautanfang; verschiedene Kleidungsstücke passen am Wasserfall. Entscheid: **offen**.

### Freitext 1201 · Jahrgang 2, Chapter 12

> Jacob has hurt his ___ in the middle of his leg, so he cannot play football.

Quelle: [content/corpus/units/g2-u12/vocab.json:1036](../../content/corpus/units/g2-u12/vocab.json#L1036); `g2u12.w.knee#carrier`. Bisher volle Wertung: `knee`; Teilwertung: `knees`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `knee`, `kneecap`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Gelenkfunktion ergänzen, falls anatomische Mitte zu ungenau ist.

**Empfehlung B:** Knee und kneecap ergeben im vorhandenen Satz natürliche Verletzungsangaben. Ein ausschließliches Lernziel knee müsste sichtbar eingegrenzt werden; knees passt nicht zur einzelnen Stelle in einem Bein. Entscheid: **offen**.

### Freitext 1248 · Jahrgang 2, Chapter 13

> The clouds in the morning will ___ to sun in the afternoon.

Quelle: [content/corpus/units/g2-u13/vocab.json:3261](../../content/corpus/units/g2-u13/vocab.json#L3261); `g2u13.w.to-give-way#carrier`. Bisher volle Wertung: `give way`; Teilwertung: `gives way`, `gave way`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `give way`, `give place`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Wetterwechsel als Übergang beschreiben; für Einzelziel give way sichtbare Eingrenzung nutzen.

**Empfehlung B:** Beide Wendungen ergeben einen Übergang zu Sonne; ihre Häufigkeit allein entscheidet nicht über Richtigkeit. Entscheid: **offen**.

### Freitext 1327 · Jahrgang 2, Chapter 15

> The ___ is the biggest penguin of all and it lives where it is very cold.

Quelle: [content/corpus/units/g2-u15/vocab.json:156](../../content/corpus/units/g2-u15/vocab.json#L156); `g2u15.w.emperor-penguin#carrier`. Bisher volle Wertung: `emperor penguin`; Teilwertung: `emperor penguins`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `emperor penguin`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Aktuelle fachliche Quelle vor Veröffentlichung bestätigen.

**Empfehlung B:** Der Größenvergleich legt die gemeinte Pinguinart fest; keine neue zoologische Quellenprüfung in dieser Dokumentkarte. Entscheid: **offen**.

### Freitext 1465 · Jahrgang 3, Chapter 3

> It was very dark outside, but the children were still wide ___.

Quelle: [content/corpus/units/g3-u03/vocab.json:76](../../content/corpus/units/g3-u03/vocab.json#L76); `g3u03.w.awake#carrier`. Bisher volle Wertung: `awake`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `awake`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Wide und den Wachkontext zusammen erhalten.

**Empfehlung B:** Wide awake ist die feststehende Kombination im gegebenen Wach-/Dunkelkontext. Entscheid: **offen**.

### Freitext 1780 · Jahrgang 3, Chapter 10

> Every child in the world has the ___ to go to school.

Quelle: [content/corpus/units/g3-u10/vocab.json:2015](../../content/corpus/units/g3-u10/vocab.json#L2015); `g3u10.w.right#carrier`. Bisher volle Wertung: `right`; Teilwertung: `rights`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `right`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Recht und tatsächliche Möglichkeit ausdrücklich unterscheiden.

**Empfehlung B:** Has the right to bezeichnet den Anspruch; nicht das tatsächliche Vorhandensein eines Schulplatzes. Entscheid: **offen**.

### Freitext 1816 · Jahrgang 3, Chapter 11

> These giant redwood trees can reach a ___ of more than 100 metres.

Quelle: [content/corpus/units/g3-u11/vocab.json:1446](../../content/corpus/units/g3-u11/vocab.json#L1446); `g3u11.w.height#carrier`. Bisher volle Wertung: `height`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `height`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Baumhöhe und Maßeinheit erhalten; Messbehauptung separat quellenprüfen.

**Empfehlung B:** A height of plus Längenmaß und Bäume grenzt die Messgröße ein. Entscheid: **offen**.

### Freitext 1825 · Jahrgang 3, Chapter 11

> His internet ___ in the old hotel was so slow that the videos would not play.

Quelle: [content/corpus/units/g3-u11/vocab.json:359](../../content/corpus/units/g3-u11/vocab.json#L359); `g3u11.w.connection#carrier`. Bisher volle Wertung: `connection`; Teilwertung: `connections`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `connection`, `service`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Falls connection das Ziel bleibt, Verbindung zwischen Gerät und Netz erklären.

**Empfehlung B:** Internet connection und internet service passen zu langsamen Videos. Entscheid: **offen**.

### Freitext 1861 · Jahrgang 3, Chapter 12

> After the heavy rain there was a ___ and many homes were flooded for days.

Quelle: [content/corpus/units/g3-u12/vocab.json:1066](../../content/corpus/units/g3-u12/vocab.json#L1066); `g3u12.w.flood#carrier`. Bisher volle Wertung: `flood`; Teilwertung: `floods`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `flood`, `storm`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Ansteigendes Wasser als Ereignis selbst erklären, nicht nur die Folgen.

**Empfehlung C:** Überflutete Häuser können einer Flut oder einem Sturm folgen; die Folge benennt das Ereignis nicht eindeutig. Entscheid: **offen**.

### Freitext 1872 · Jahrgang 3, Chapter 12

> Last year there was a long ___ and many plants died because there was no rain for months.

Quelle: [content/corpus/units/g3-u12/vocab.json:613](../../content/corpus/units/g3-u12/vocab.json#L613); `g3u12.w.drought#carrier`. Bisher volle Wertung: `drought`; Teilwertung: `droughts`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `drought`, `dry spell`, `dry period`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Dauer und fehlenden Regen erhalten; Zielwort drought gegebenenfalls sichtbar markieren.

**Empfehlung B:** Monatelang fehlender Regen und abgestorbene Pflanzen tragen alle drei Bezeichnungen. Entscheid: **offen**.

### Freitext 1907 · Jahrgang 3, Chapter 13

> If you didn't tell the teacher anything, you'd probably get ___.

Quelle: [content/corpus/units/g3-u13/vocab.json:158](../../content/corpus/units/g3-u13/vocab.json#L158); `g3u13.w.detention#carrier`. Bisher volle Wertung: `detention`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `detention`, `suspended`, `expelled`, `punished`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Konkrete Schulregel oder Nachsitzen-Situation nennen; keine Strafe aus Schweigen ableiten.

**Empfehlung C:** Nichtmelden bestimmt die Schulfolge nicht; alle genannten Ergänzungen passen nach get. Entscheid: **offen**.

### Freitext 1910 · Jahrgang 3, Chapter 13

> I'm not going to ___ on my friend.

Quelle: [content/corpus/units/g3-u13/vocab.json:2687](../../content/corpus/units/g3-u13/vocab.json#L2687); `g3u13.w.to-tell-on-sb#carrier`. Bisher volle Wertung: `tell`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `tell`, `give up`, `spy`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Beabsichtigtes Melden eines Fehlverhaltens in zusätzlichem Kontext festlegen.

**Empfehlung C:** Tell on, give up on und spy on ergeben unterschiedliche, vollständig mögliche Aussagen. Entscheid: **offen**.

### Freitext 1958 · Jahrgang 3, Chapter 14

> My dog loves to ___ big holes in the garden ground with his paws.

Quelle: [content/corpus/units/g3-u14/vocab.json:1723](../../content/corpus/units/g3-u14/vocab.json#L1723); `g3u14.w.to-dig#carrier`. Bisher volle Wertung: `dig`; Teilwertung: `to dig`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `dig`, `excavate`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Pfoten und Erde erhalten; to dig würde nach loves to einen zusätzlichen Marker erzeugen und wird hier nicht in full vorgeschlagen.

**Empfehlung B:** Beide Verben bezeichnen das Ausheben der Löcher; dig ist die natürliche alltagssprachliche Wahl. Entscheid: **offen**.

### Freitext 1961 · Jahrgang 3, Chapter 14

> The man had a small ___ on his finger from the knife.

Quelle: [content/corpus/units/g3-u14/vocab.json:652](../../content/corpus/units/g3-u14/vocab.json#L652); `g3u14.w.cut#carrier`. Bisher volle Wertung: `cut`; Teilwertung: `cuts`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `cut`, `wound`, `scratch`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Für das spezifische Ziel cut die Art der Verletzung genauer beschreiben.

**Empfehlung B:** Ein Messer kann eine Schnittverletzung, Wunde oder einen Kratzer hinterlassen. Entscheid: **offen**.

### Freitext 2000 · Jahrgang 4, Chapter 1

> I wasn't ___ of that.

Quelle: [content/corpus/units/g4-u01/vocab.json:81](../../content/corpus/units/g4-u01/vocab.json#L81); `g4u01.w.be-aware-of-sth#carrier`. Bisher volle Wertung: `aware`; Teilwertung: `aware of`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `aware`, `conscious`, `ignorant`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Ob fehlendes Wissen oder vorhandenes Wissen gemeint ist, in zweitem Satz klären.

**Empfehlung C:** Aware/conscious sind gleichgerichtet; ignorant ergibt die gegenteilige, aber vom isolierten Satz nicht ausgeschlossene Aussage. Entscheid: **offen**.

### Freitext 2002 · Jahrgang 4, Chapter 1

> Most of the people in the north were Protestant. They were the ___.

Quelle: [content/corpus/units/g4-u01/vocab.json:1917](../../content/corpus/units/g4-u01/vocab.json#L1917); `g4u01.w.majority#carrier`. Bisher volle Wertung: `majority`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `majority`, `largest religious group`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Land, Zeitraum und Bezugsgruppe aus der Buchquelle nennen.

**Empfehlung C:** Most belegt die Mehrheit innerhalb der genannten Gruppe; the north bleibt ohne Buchkontext unbestimmt. Entscheid: **offen**.

### Freitext 2010 · Jahrgang 4, Chapter 1

> In a ___, people die because they have nothing to eat.

Quelle: [content/corpus/units/g4-u01/vocab.json:571](../../content/corpus/units/g4-u01/vocab.json#L571); `g4u01.w.famine#carrier`. Bisher volle Wertung: `famine`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `famine`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Bevölkerungsbezogene, anhaltende Nahrungsknappheit klarer erklären.

**Empfehlung B:** Das Fehlen von Nahrung und viele Todesfälle passen zur gemeinten Hungersnot; keine neue Geschichts-/Sachquelle behauptet. Entscheid: **offen**.

### Freitext 2049 · Jahrgang 4, Chapter 2

> A thief came in the night to ___ money from the shop.

Quelle: [content/corpus/units/g4-u02/vocab.json:3104](../../content/corpus/units/g4-u02/vocab.json#L3104); `g4u02.w.to-steal#carrier`. Bisher volle Wertung: `steal`; Teilwertung: `to steal`.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `steal`, `take`, `get`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Unerlaubtes Nehmen als Zielbedeutung sichtbar eingrenzen.

**Empfehlung C:** Der Dieb und nächtliche Einbruch machen steal plausibel; take/get ergeben dennoch vollständige Sätze. Entscheid: **offen**.

### Freitext 2097 · Jahrgang 4, Chapter 3

> The police have to ___ the building when there is a fire inside.

Quelle: [content/corpus/units/g4-u03/vocab.json:1146](../../content/corpus/units/g4-u03/vocab.json#L1146); `g4u03.w.evacuate#carrier`. Bisher volle Wertung: `evacuate`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `evacuate`, `enter`, `search`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Menschen aus der Gefahrenzone bringen als Zweck ergänzen.

**Empfehlung C:** Die Polizei kann das brennende Gebäude räumen, betreten oder durchsuchen; die Situation allein bestimmt die Handlung nicht. Entscheid: **offen**.

### Freitext 2133 · Jahrgang 4, Chapter 4

> We called an ___ to repair the broken lights in the kitchen.

Quelle: [content/corpus/units/g4-u04/vocab.json:1456](../../content/corpus/units/g4-u04/vocab.json#L1456); `g4u04.w.electrician#carrier`. Bisher volle Wertung: `electrician`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `electrician`, `electrical contractor`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Für das Einzelwort electrician das gesuchte Berufsprofil transparent vorgeben.

**Empfehlung B:** Beide Berufsbezeichnungen passen zur Reparatur elektrischer Beleuchtung. Entscheid: **offen**.

### Freitext 2142 · Jahrgang 4, Chapter 4

> I took my car to the ___ because the engine was making a strange noise.

Quelle: [content/corpus/units/g4-u04/vocab.json:2729](../../content/corpus/units/g4-u04/vocab.json#L2729); `g4u04.w.mechanic#carrier`. Bisher volle Wertung: `mechanic`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `mechanic`, `garage`, `repair shop`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Explizit nach der Person fragen, falls mechanic das Lernziel ist.

**Empfehlung C:** To the erlaubt Person und Werkstatt als Ziel. Entscheid: **offen**.

### Freitext 2180 · Jahrgang 4, Chapter 5

> I ___ my best friend with all my secrets.

Quelle: [content/corpus/units/g4-u05/vocab.json:2149](../../content/corpus/units/g4-u05/vocab.json#L2149); `g4u05.w.trust#carrier`. Bisher volle Wertung: `trust`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `trust`, `entrust`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Vertrauen beziehungsweise Anvertrauen als beabsichtigte Bedeutung erhalten.

**Empfehlung B:** Beide Verben passen mit Objekt plus with all my secrets; der vorhandene Pool erkennt entrust nicht voll an. Entscheid: **offen**.

### Freitext 2270 · Jahrgang 4, Chapter 7

> It is very hot and dry in the Australian ___.

Quelle: [content/corpus/units/g4-u07/vocab.json:1801](../../content/corpus/units/g4-u07/vocab.json#L1801); `g4u07.w.outback#carrier`. Bisher volle Wertung: `outback`, `the outback`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `outback`, `desert`, `interior`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Bei spezifischem Kulturwort outback die Bedeutung des dünn besiedelten Binnenlands erklären.

**Empfehlung B:** Alle drei Ortsbezeichnungen können die trockene Hitze tragen; the outback würde hinter Australian einen zusätzlichen Artikel erzeugen. Entscheid: **offen**.

### Freitext 2274 · Jahrgang 4, Chapter 7

> When you write a letter, you put it in an ___.

Quelle: [content/corpus/units/g4-u07/vocab.json:1062](../../content/corpus/units/g4-u07/vocab.json#L1062); `g4u07.w.envelope#carrier`. Bisher volle Wertung: `envelope`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `envelope`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Postversand und Briefverpackung zusammenhalten.

**Empfehlung B:** An envelope ist die naheliegende Verpackung eines Briefes. Entscheid: **offen**.

### Freitext 2277 · Jahrgang 4, Chapter 7

> There was an accident, so we called an ___ right away.

Quelle: [content/corpus/units/g4-u07/vocab.json:267](../../content/corpus/units/g4-u07/vocab.json#L267); `g4u07.w.ambulance#carrier`. Bisher volle Wertung: `ambulance`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `ambulance`, `officer`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Verletzte mit medizinischem Transportbedarf nennen.

**Empfehlung C:** Ein Unfall erzwingt keinen Rettungswagen; ein officer ist ebenfalls eine mögliche gerufene Hilfe. Entscheid: **offen**.

### Freitext 2313 · Jahrgang 4, Chapter 8

> At an ___ you can pay a lot of money for a very old painting.

Quelle: [content/corpus/units/g4-u08/vocab.json:154](../../content/corpus/units/g4-u08/vocab.json#L154); `g4u08.w.auction#carrier`. Bisher volle Wertung: `auction`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `auction`, `art gallery`, `antique shop`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Bieten und Zuschlag als entscheidende Merkmale einer Auktion ergänzen.

**Empfehlung C:** An plus Ort/Veranstaltung und hoher Preis lassen mehrere Kaufgelegenheiten zu. Entscheid: **offen**.

### Freitext 2315 · Jahrgang 4, Chapter 8

> He plays on his screen all night and cannot stop. Everybody calls him a screen ___.

Quelle: [content/corpus/units/g4-u08/vocab.json:8](../../content/corpus/units/g4-u08/vocab.json#L8); `g4u08.w.addict#carrier`. Bisher volle Wertung: `addict`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `addict`, `junkie`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Verhaltensbeschreibung ohne Etikettierung vorziehen; sensible Bezeichnung durch Koki entscheiden lassen.

**Empfehlung C:** Beide Benennungen sind sprachlich möglich; junkie ist abwertend, die Aufgabe übernimmt zudem eine Fremdetikettierung. Entscheid: **offen**.

### Freitext 2320 · Jahrgang 4, Chapter 8

> She has an amazing ___ of old cars at home.

Quelle: [content/corpus/units/g4-u08/vocab.json:466](../../content/corpus/units/g4-u08/vocab.json#L466); `g4u08.w.collection#carrier`. Bisher volle Wertung: `collection`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `collection`, `selection`, `assortment`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Gezieltes Sammeln über längere Zeit ergänzen, falls collection geprüft werden soll.

**Empfehlung B:** Alle drei Wörter beschreiben die vorhandene Gruppe alter Autos. Entscheid: **offen**.

### Freitext 2323 · Jahrgang 4, Chapter 8

> The ___ gives the murderer ten years in prison.

Quelle: [content/corpus/units/g4-u08/vocab.json:1061](../../content/corpus/units/g4-u08/vocab.json#L1061); `g4u08.w.judge#carrier`. Bisher volle Wertung: `judge`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `judge`, `court`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Person als Urteilende ausdrücklich nennen, falls judge das Ziel bleibt.

**Empfehlung B:** Richter und Gericht können sprachlich das Urteil verhängen; das bestehende Einzelziel ist zu eng. Entscheid: **offen**.

### Freitext 2401 · Jahrgang 4, Chapter 10

> ___ is the opposite of a happy place after death.

Quelle: [content/corpus/units/g4-u10/vocab.json:827](../../content/corpus/units/g4-u10/vocab.json#L827); `g4u10.w.hell#carrier`. Bisher volle Wertung: `Hell`, `hell`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `Hell`, `hell`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Als Begriff innerhalb eines benannten Glaubens-/Erzählkontexts formulieren, nicht als unmarkierte Tatsache.

**Empfehlung C:** Die Gegensetzung setzt einen bestimmten religiösen Vorstellungsrahmen voraus. Entscheid: **offen**.

### Freitext 2413 · Jahrgang 4, Chapter 10

> My parents were ___ of me when I did well at school.

Quelle: [content/corpus/units/g4-u10/vocab.json:2015](../../content/corpus/units/g4-u10/vocab.json#L2015); `g4u10.w.proud#carrier`. Bisher volle Wertung: `proud`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `proud`, `supportive`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Gefühl des Stolzes durch eine zusätzliche Reaktion erläutern.

**Empfehlung C:** Proud und supportive passen beide nach were ... of; gute Leistung macht die Reaktion nicht eindeutig. Entscheid: **offen**.

### Freitext 2415 · Jahrgang 4, Chapter 10

> The man who married my sister is my ___.

Quelle: [content/corpus/units/g4-u10/vocab.json:316](../../content/corpus/units/g4-u10/vocab.json#L316); `g4u10.w.brother-in-law#carrier`. Bisher volle Wertung: `brother-in-law`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `brother-in-law`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Beziehung erhalten; alternative Familienkonstellationen nicht abwerten.

**Empfehlung B:** Die genannte Heiratsbeziehung bestimmt den üblichen Verwandtschaftsbegriff. Entscheid: **offen**.

### Freitext 2456 · Jahrgang 4, Chapter 11

> Famous old books that people still love to read are called ___.

Quelle: [content/corpus/units/g4-u11/vocab.json:413](../../content/corpus/units/g4-u11/vocab.json#L413); `g4u11.w.classics#carrier`. Bisher volle Wertung: `Classics`, `classics`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `Classics`, `classics`, `masterpieces`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Kulturelle Anerkennung über Generationen erklären, falls classics gemeint ist.

**Empfehlung C:** Beliebte alte Bücher können Klassiker oder Meisterwerke genannt werden; anhaltende Beliebtheit allein definiert den Kanon nicht. Entscheid: **offen**.

### Freitext 2497 · Jahrgang 4, Chapter 12

> Mars has a very thin ___, so humans could not breathe there.

Quelle: [content/corpus/units/g4-u12/vocab.json:366](../../content/corpus/units/g4-u12/vocab.json#L366); `g4u12.w.atmosphere#carrier`. Bisher volle Wertung: `atmosphere`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `atmosphere`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Sachquelle bei einer späteren Veröffentlichung bestätigen; keinen neuen Forschungsbefund behaupten.

**Empfehlung B:** Thin und breathe grenzen die Lufthülle ein; der Satz selbst liefert noch keine neue geprüfte Marsquelle. Entscheid: **offen**.

### Freitext 2541 · Jahrgang 4, Chapter 13

> If you want the job, you have to ___ for it right away.

Quelle: [content/corpus/units/g4-u13/vocab.json:8](../../content/corpus/units/g4-u13/vocab.json#L8); `g4u13.w.apply#carrier`. Bisher volle Wertung: `apply`; Teilwertung: keine.

- **A — Auswahlfrage behalten:** keine Zulassung zur freien Eingabe.
- **B — Poolvorschlag prüfen:** `apply`, `ask`. Kein Eintrag wird automatisch übernommen.
- **C — Kontext überarbeiten:** Ein formelles Bewerbungsverfahren sichtbar machen, falls ausschließlich apply geprüft werden soll.

**Empfehlung B:** Apply for it und ask for it sind im sichtbaren Satz natürliche Ergänzungen. Für das engere Lernziel Bewerbung braucht es eine sichtbare Bedeutungsbegrenzung; right away leistet diese nicht. Entscheid: **offen**.

## A4 · Messziel und Übergabe

**Historischer Ausgangspunkt, kein neu geprüfter Live-Stand:** Von 171 Chapter-/Modus-Kombinationen hatten 37 mindestens fünf Fragen, 31 waren leer. Die spätere Bauarbeit soll diese Zahlen erneut aus der tatsächlich für das jeweilige Antwortformat freigegebenen Bank messen und die leeren/zu kleinen Kombinationen verringern. Dieses Blatt behauptet weder neue Abdeckung noch die Zulässigkeit aller alten Kombinationen im Duell.

GG schneidet aus diesem Blatt die Koki-Entscheidung und anschließend getrennte Baukarten: zuerst bestätigte Rahmen-/Schlüsseldefekte, dann kontextgebundene Fragen und einzeln entschiedene Varianten. Die Schreibformfälle benötigen zunächst einen Lauf durch den echten Bewerter. Die acht Sachunsicherheiten benötigen Quellenklärung. Wortkennungen und Einheitenzuordnungen bleiben bei jeder späteren Reparatur nachvollziehbar; insbesondere wird artist nicht heimlich zu autograph.

**Prüfung dieses Dokuments:** Zahlen-/Identitäts-/Linkkontrolle und zwei unabhängige Leser werden im zugehörigen Änderungsvorschlag mit tatsächlichen Ergebnissen dokumentiert. Keine Produktdatei geändert; keine Vollprüfung der 2.057 fachlichen Urteile oder Behauptung vollständiger freier Antwortmengen. Keine neue Quellenfreigabe für Wort-Hilfe, persönliche Sammlung, Bilder oder Activity-Regeln.

**Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette.** Die geerbten Sperren zum Klassenfilter (cgo-154), zur externen Navigation und dauerhaften Referenzhaltung (cgo-156) bleiben getrennt bestehen. Keine Produktionsmigration, kein Merge, keine Freigabe zur Veröffentlichung.
