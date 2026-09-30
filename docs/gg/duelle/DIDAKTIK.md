# Buchbezug, Schülersprache und Prüfgrenzen

**CODEX DRAFT — NOT CANON · GEPLANT · cgo-018.**
Verbindliche Grundlage ist GG-Nachtrag 5 und `SCHUELERSPRACHE_UND_DIDAKTIK_2026-09-30.md`.
Das technisch übernommene Muster cgo-007/PR473 wurde von Koki sprachlich und didaktisch **nicht angenommen**. Der hier überarbeitete Zweipersonenentwurf ist ebenfalls noch kein vorlagefertiges oder angenommenes Muster. Eigene Quellenlesung ersetzt keine unabhängige Prüfung.

## Welche Originalseiten tatsächlich gelesen wurden

Quelle sind die lokalen MORE! 1-PDFs unter `Code/Transcipts Books /English/MORE 1 to 4/MORE 1/` in Domi Gym. Die Titel- und Impressumsseiten nennen Helbling, Puchta / Holzmann / Lewis-Jones / Biggs / Jory, Erstveröffentlichung 2023 und vierten Druck 2025; Lehrplan 2023. SB bedeutet Student’s Book, WB bedeutet Workbook. Die Datei-Prüfsumme bindet diese konkrete Kopie; sie beweist keine rechtliche oder fachliche Freigabe.

| Original | MD5 der vollständigen Datei | Tatsächlicher eigener Sichtumfang |
|---|---|---|
| `MORE 1 SB PDF.pdf`, 146 PDF-Seiten | `3f44482a1ff4169a4fd5c0b3d3c1e116` | Titel/Impressum PDF 1–2; gesamtes Chapter-1-Material gedruckt S. 8–15 = PDF 6–13; zusätzlich S. 16–17 = PDF 14–15 zur Abgrenzung des folgenden Kapitels |
| `MORE 1 WB PDF.pdf`, 144 PDF-Seiten | `b8b3a0d81b3e402122ac4939e165c062` | Impressum PDF 2; gesamtes Chapter-1-Material gedruckt S. 4–13 = PDF 6–15, einschließlich Bilder, Wortverzeichnis und Aufgabenfolge |

Die Quellenüberschrift lautet wörtlich „Unit 1 · Time for school“. Das Modell nennt dieselbe Strecke sichtbar **Chapter 1 · Kapitel 1: Aufforderungen**. Originaltitel und interne Kennungen bleiben erhalten. Die Audios und das Video wurden nicht abgespielt; Hörverständlichkeit, Aussprachemodell und zeitliche Führung sind **UNVERIFIZIERT**. Die PDF-Seiten enthalten Bilder statt einer verwendbaren Textebene; die Sichtung erfolgte an gerenderten Originalseiten, nicht an einer Textextraktion. Buchbilder werden nicht ins Produktrepo kopiert.

## Was die Folge der Buchaufgaben verlangt

| Stelle | Tatsächliche Lernhandlung und Bildfunktion | Konsequenz für den Entwurf |
|---|---|---|
| SB S. 8–9 | Lied mit Aufforderungen; anschließend Alphabet, Modellgespräch, eigenes Partnergespräch. Ein Liedwort ist noch kein Beherrschungsbeleg. | „Come on!“ braucht eine Bedeutungsstütze. Erklären und Sprechen als eigene Handlungen benennen; eine Auswahl allein beweist sie nicht. |
| SB S. 10–11 | Zahlen zunächst mit Wortbank; Bildmengen zählen und berichtigen. Die illustrierte Tiergeschichte verbindet Bild/Text mit verschiedenen Verständnisaufträgen. | Keine Gleichsetzung von Bildsehen, Wiedererkennen, Berichtigen und freiem Formulieren. |
| SB S. 12–13 | Dinge zeigen/benennen und zuordnen; Farben über Bild/Lied; Schulkleidung aus Modell und Bildern, später selbst gestalten. | Personifizierte Schulsachen passen thematisch, sind aber keine originalgetreue Übernahme einer Buchbildhandlung. |
| SB S. 14, Aufgaben 15–16 | Aufforderungen hören, nummerierte Handlungsbilder zuordnen, anschließend Sprechblasen den Bildern zuordnen. Pfeile zeigen etwa Hinsetzen; rote Kreuze unterscheiden verneinte Handlungen. | Wortlaut, Richtung und Verneinung müssen zusammen verständlich sein. Die beiden Musterkarten üben nur positive Aufforderungen; sie decken weder Negation noch den Hörschritt ab. |
| SB S. 15 | Deutsche Grammatikerklärung zu positiven/verneinten Aufforderungen mit Beispielen und Rückverweis auf Aufgabe 16; daneben weitere Kapitelinhalte. | Deutsche Orientierung ist quellenangemessen. Englisch bleibt hier der Lerngegenstand. |
| WB S. 4–6 | Deutsche Arbeitsaufträge; Wörter zuordnen und schreiben, Gegenstände ausmalen, Bildmengen prüfen, Pluralformen schreiben. | Keine pauschale englische Bedienoberfläche für Anfänger; Schreiben nicht still durch Auswahl ersetzen. |
| WB S. 7, Aufgaben 9–11 | Bild/Aufforderung zuordnen; prüfen, ob die gezeichnete Handlung die Anweisung befolgt; fehlende Verben selbst schreiben. | Der sichtbare Auftrag entscheidet, was ein Bild bedeutet. Eine Figur, die rennt, legt für sich allein keine bestimmte Aufforderung fest. |
| WB S. 8, Aufgaben 12–13 | Vorgegebene Wörter ordnen und vollständige Aufforderungen schreiben; danach aus Handlungsbildern selbst Aufforderungen schreiben. | Spätere produktive Anwendung bleibt ein eigener Lernschritt. Zwei Auswahlkarten erfüllen ihn nicht. |
| WB S. 9–11 | Geschichte mit Sprechblasen, Dialog ergänzen/ordnen, gestützte und offenere Gesprächsvarianten; Wortschatz-Selbsteinschätzung. | Rückmeldung und Selbstauskunft sind kein unabhängiger Nachweis selbstständigen Könnens. |
| WB S. 12–13 | Beschriftete Bildwortfelder und englische Einträge mit Beispielen/deutschen Bedeutungen. | Konkrete Bedeutungshilfe ist begründbar; die Zugehörigkeit zum Kapitel allein genügt nicht als Vorwissen. |

## Die beiden Musterkarten: enger Zweck und bekannte Grenzen

Die Originalkarten `g1.paint.ch01.enc.pencil.k1` und `g1.paint.ch01.enc.pencil.k2` bleiben in `muster-daten.json` vollständig unverändert. Produktquelle: `content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json` am Startpin `269ee986ccdc1ae7c3b070cbed7014f20e532365`, MD5 `879ee7cfc187b8f64aa9968383ffc8e5`.

Das Muster übt **eine englische Aufforderung aus drei Möglichkeiten passend zum deutschen Handlungsauftrag auswählen** und ihre Bedeutung gemeinsam erklären. Die Originalanweisung „Sag ihm …“ enthält kein technisches Versprechen einer Sprachaufnahme: Der ergänzte sichtbare Arbeitsauftrag sagt ausdrücklich, dass ausgewählt wird. Aussprache und selbstständige Formulierung werden nicht gemessen. Auch das mündliche Erklären wird nicht automatisch als gelungen verbucht.

Die Beschreibungen eines kritzelnden bzw. heranrennenden Bleistifts sind Produktreize. Sie werden als Text gezeigt; die Weltbilder fehlen. Kritzelnder Bleistift → zuhören und rennender Bleistift → hinsetzen sind **nur durch den vollständigen deutschen Auftrag eindeutig**. Ohne diesen Auftrag wären andere Aufforderungen wie Anhalten plausibel. Den Auftrag wegzulassen, um die Oberfläche kürzer zu machen, würde die Aufgabe beschädigen. Für eine spätere bildgestützte Fassung braucht es einen eigenen Bild-/Auftragspass; Buchbilder können diese Produktbilder nicht nachträglich freigeben.

Die Vorbereitung zeigt alle fünf Aufforderungen mit deutschen Bedeutungen, **keine Zuordnung von Musterkarte zu Lösung**. Anschließend wählen die Lernenden selbst. Dieselbe Hilfe ist während jeder Aufgabe aufklappbar und enthält die Bedeutungen aller Optionen gleichwertig. Hilfegebrauch ist erlaubt und ungewertet. Damit ist dies eine angeleitete Bedeutungsübung, kein unabhängiger Leistungstest. Ein späterer Rückblick auf bereits aufgedeckte Antworten wird auch nicht als Erstlösung ausgegeben.

### Jedes englische Element hat einen angegebenen Lernstatus

| Englisch | Buchbeleg und Voraussetzung | Hilfe im Muster / Funktion |
|---|---|---|
| `Listen!` | SB S. 8 und Höranweisungen; WB S. 13 `to listen`, außerdem Aufforderung beim Eintrag `to speak`. Buchkontakt vorhanden, individuelles Können nicht unterstellt. | **Bewusst gestützt:** „Hör zu!“; vom Hinschauen unterscheiden. |
| `Look!` | SB S. 10/11 Arbeitsaufträge und WB S. 13 `to look`. | **Bewusst gestützt:** „Schau hin!“; konkreter Ablenker zur ersten Karte. |
| `Come on!` | SB S. 8 im Lied, kein eigener Eintrag im geprüften WB-Wortverzeichnis S. 13. Liedkontakt allein reicht nicht. | **Neues Lernziel, bewusst gestützt:** „Komm! / Los!“; in diesem Handlungskontext zum Mitkommen oder Beginnen auffordern. Die beiden Bedeutungen nicht als zwei konkurrierende Antworten bewerten. Andere pragmatische Verwendungen werden nicht geprüft. |
| `Sit down!` | SB S. 14 Bildhandlung/Sprechblasen; WB S. 7–8 Aufgaben 9–13 sowie S. 13. | **Bewusst gestützt:** „Setz dich!“; Richtung der Handlung unterscheiden. |
| `Stand up!` | SB S. 15 positive Grammatikerklärung, WB S. 7–8 und S. 13. | **Bewusst gestützt:** „Steh auf!“; positive Form, keine versteckt verlangte Negation. |
| `Chapter 1` | Vorgeschriebene sichtbare Gliederung, kein getesteter Wortschatz. | Direkt daneben „Kapitel 1: Aufforderungen“. |
| `CODEX DRAFT — NOT CANON` | Autorenkennzeichnung, kein Arbeitsauftrag an Kinder. | Erwachsene sehen zusätzlich die deutsche Mustergrenze; keine englische Fachanweisung für die Aufgabenbedienung. |

Die fünf Bedeutungen sind ausdrücklich vom Autor ergänzte Hilfen, keine behaupteten wörtlichen Buchübersetzungen. Neue unbekannte Optionen sperren die Quellen-/Textprüfung, bis ihre Lernfunktion, Voraussetzung und Hilfe eingeordnet sind. Das Muster weist **keinem Kind** den Status „bereits beherrscht“ zu.

## Texte und Rückmeldung vollständig fassen

`texte.mjs` ist der gemeinsame Katalog aller selbst verfassten sichtbaren Texte. Jeder Eintrag hat Zustand, Lern-/Bedienfunktion, Sprache, Zielgruppe und Status. Die Originalsituationen/-aufträge werden zusätzlich aus `muster-daten.json` erfasst. Die maschinelle Textliste wird außerhalb des Repos erzeugt; sie ist eine Quellliste und ausdrücklich **noch kein vollständiger Nachweis der gerenderten Schüleransicht**.

| Schülerzustand | Konkrete Funktion |
|---|---|
| Einstieg/Navigation | Kapitel, zwei Aufgaben, Rollen, Zusammen-/Alleinwahl und Verlust beim Neuladen vor Start erklären. |
| Vorbereitung/Hilfe | Die fünf Bedeutungen klären; Vergleich der Bedeutungen anleiten. Keine vorab an die Karte angehängte Lösung. |
| Bereitschaft | Freiwillige Zustimmung und Selbstauskunft je Person. „Allein üben“ bleibt auch nach Beginn der Paarvorbereitung zugänglich. Eine Bestätigung ist kein Sprachtest. |
| Aufgabe/leere Auswahl | Vollständigen Originalauftrag und die Auswahlhandlung zeigen. Ohne Auswahl bleibt Vergleichen gesperrt; der Text nennt den nötigen nächsten Schritt. |
| Antwort/Fehler | Tatsächlich ausgewählte Aufforderung mit ihrer Bedeutung zeigen; anschließend passende Aufforderung mit Bedeutung. Die Lernenden vergleichen den Auftrag. Kein pauschales Lob und kein zweiter automatischer Bewerter. |
| Erneuter Versuch | Dieselbe Auswahl nach dem Aufdecken ändern dürfen. Dieser Durchgang ist Wiederholung mit Kenntnis der Lösung. |
| Rollenwechsel/Rückschau | Wer jetzt anklickt und wer erklärt, ausdrücklich sagen; beide Antworten besprechen. Keine Behauptung eines individuellen Tests. |
| Pause/Abbruch | Lokalen Erhalt und Verlust beim Neuladen unterscheiden; Beenden bestätigen; keine Punktstrafe. |
| Warten/Ladefehler | Laden benennen; bei fehlenden Daten Hilfe einer erwachsenen Person zum Öffnen der Ansicht nennen. Kein scheinbarer Lernerfolg. |
| Speichern | Keine Speicherfunktion eingebaut. Alle Aussagen bleiben auf das geöffnete Fenster begrenzt; keine Speicherung nachgestellt. |

Für die drei sozialen Verträge gilt derselbe Grundsatz: Frühes Jahr 1 erhält deutsche Einladungen, Aufträge, Absagen, Verbindungs-/Warte- und Speicherhinweise. Englische Partnerantworten bleiben Lerninhalte mit eigener Voraussetzung. Die geplanten Formen B/C besitzen noch keine fertige Oberfläche oder vollständige Textliste; diese wäre vor ihrem Bau/Urteil neu zu liefern. Für ältere Jahrgänge ist ein eigener belegter Sprachstand nötig.

## Originaltrainer und frühere Prüfungen erhalten

Die vier vom GG festgelegten `index.html`-Kopien wurden erneut lesend am jeweiligen Commit beschafft und stimmen mit den eingefrorenen MD5s überein. Der eigene Umfang ist hier **gezielte Quellcodelektüre**, kein neuer Live- oder vollständiger Formatgleichheitstest:

| Jahrgang / Original-Commit | Eigene Fundstelle und Konsequenz |
|---|---|
| 1 · `c003d72494adaf01babea84b56c9fbd60e5075c8` | `useVocabHint`, Z. 9389–9408: gestufte Hilfe, auch mit Kosten-/Serienregeln. Hilfe als unterscheidbare Funktion bewahren; deren Kosten nicht ungeprüft in die ungewertete soziale Anfängerübung übernehmen. |
| 2 · `75f1b0ba8151326ba91fcbbe0ada76d00c3896a8` | `renderGrammarItem`, Z. 12048–12096: getrennte Darstellungen etwa für Lücke, Fehlerkorrektur, Umformung, Satzbau und Zuordnung. Sozialmodus darf diese Handlungen nicht zu Auswahl vereinheitlichen. |
| 3 · `a28da7fab6af996a0ffa9314011ff25a79bf757b` | `checkSentenceBuilding`, Z. 13004–13019: zusammengesetzte Plättchenfolge gegen mehrere erlaubte Lösungen. Eigenständige Satzkonstruktion erhalten; das hiesige Auswahlmodell ersetzt sie nicht. |
| 4 · `21118fff93486d6ab0c2e9316a8ebc74579f13da` | `checkGrammarTyped`, Z. 11017–11040: getippte Antwort, Varianten, zusätzlich Teilantwortregel. Funktionalität als Referenz lesen; die Teilantwortregel nicht pauschal als aktuelle didaktische Abnahme übernehmen. |

`ORIGINALVERGLEICH.md` und `ERBE.md` aus W0-Kopf `9d78767323ea207bc56ba72212953a3163418c0e` führen ältere Korrekturen, Tabellenprüfungen und Programmzusagen weiter. Deren Messzahlen werden hier **nicht** als eigene neue Messung übernommen. Unveränderte alte Prüfgegenstände bleiben gültig in ihrem Umfang; die frühere Kritik am unklaren Antwortumfang p019 wird nicht gelöscht. Vollständiger aktueller Herkunfts-/Formatabgleich bleibt bei cgo-025 und ist Abnahmetor.

## DomiLingo: Fehler, übersehener Grund und wirksame Prüflehre

Primärdateien gelesen am festen DomiLingo-Kopf `e0c8b32d47d7abe4780835c0dd69e234dbba1005`; dies ist eine Verfahrensreferenz, kein Übernehmen von Matura-Schwellen in Jahr 1.

| Belegter Fehler / Risiko | Warum die frühere Prüfung nicht reichte | Nachgewiesene Korrektur im Spender und Anwendung hier |
|---|---|---|
| `scripts/review/stem-overlap.mjs`, Kopf: srdp-175/avocado_boom Item 8 übernahm den Textsatz fast wörtlich; lösbar durch Wortsuche. | Das betreffende Kriterium wurde nicht gemessen; offene Formate waren nur stichprobenweise blind gelöst. Später übersah die längste gemeinsame Wortfolge noch mehrere zusammengesetzte Textstücke. | Spender misst neben längster Folge auch den Anteil aus kurzen gemeinsamen Folgen und ergänzt fachliche Prüfung. Hier wird geprüft, **welche geistige Handlung** die Aufgabe tatsächlich verlangt. Bedeutungsabgleich kurzer Anfängerbefehle darf wörtlich sein; weder Vierwortschwelle noch eine Paraphrasepflicht für „Sit down!“ werden übernommen. |
| Derselbe Dateikopf: falsches Quellfeld oder leeres Aufgabenfeld ergab irreführende Messwerte; verbundene Absätze erfanden Wortfolgen. | Gedrucktes Hör-Arbeitsblatt ist nicht das Hörtranskript; manche Formate tragen Aufgaben in einer anderen Liste. Ein scheinbarer Nullbefund bedeutete fehlende Erfassung. | Die Quellfeldzuordnung ist im Code vorhanden. **Die behauptete Absatzgrenzensicherung besteht den eigenen kleinen Gegenversuch nicht:** Der Trenner wird beim Zerlegen entfernt; vier Wörter über zwei Absätze werden als eine Folge gezählt, erwartet wären höchstens zwei. Dieser Schutz wird daher nicht als wirksam übernommen. Hier: Originalbuchbild, deutscher Produktauftrag, englische Option, Storywahl und Sprachbewertung nicht vermengen. Acht Routen, sämtliche Kartenkennungen und Entscheidungen werden unabhängig aus dem festen Baum erhoben. |
| `docs/revision/README.md`, Abschnitt Pakete: live neu berechnete offene Menge verschiebt nach einer Verwerfung die folgenden Arbeitspakete. | Prüfung gegen eine bereits veränderte Arbeitsmenge lässt Einträge aus oder zählt sie doppelt. | Feste Pakete mit vollständiger Nachfolgerzuordnung. Hier feste vollständige Kennungsliste; eine absichtlich entfernte Route/Karte muss scheitern. Eine spätere Produktbasis benötigt einen neuen Abgleich. |
| `lib/revision-stempel.ts`, `pruefeStempelDatei`: ein alter Prüfvermerk kann auf geänderten Dateiinhalt zeigen. | Ein Statusname sagt nichts darüber, ob noch dieselben Eingaben vorliegen. | Spender vergleicht exakten Datei-Fingerabdruck und sperrt die Freigabe bei Abweichung; `test-revision-stempel.ts` §6b enthält den gezielten Driftfall. Hier Kopf und Quelldateien binden; fehlende/falsche Quelle und alter Urteilspin scheitern in eigenen Gegenproben. Kein altes Urteil für den neuen Textkatalog. |
| `docs/revision/README.md`, ausdrücklich angenommene Grenzen: echtes Begründungszitat aus falschem Absatz und in einer Antwortzeile gebündelte Varianten können formale Regeln umgehen. | Vorhandensein einer Textfolge prüft keine semantische Begründung; Zählen von Einträgen prüft keine wirklichen Antwortmöglichkeiten. | Menschliche Itemprüfung bleibt nötig. Hier Auftrag/Option/Handlung und plausible mündliche Variante einzeln abgleichen; reine Quellgleichheit beweist keine passende Aufgabe. Keine Matura-Grenze für Varianten übernehmen. |

Die Spender-Gesamtbatterie wurde hier nicht ausgeführt. Der gezielte Absatzgrenzen-Gegenversuch läuft ausschließlich gegen die unveränderte eingefrorene Datei und endet **Exit 1** (erwartet 2, tatsächlich 4). Er belegt eine Grenze des Spenderwerkzeugs, keine Aussage über alle dortigen Aufgaben; der fremde Code wird hier nicht repariert. Gelesene historische Befunde und eigene aktuelle Gegenproben bleiben getrennt. Die eigene Format-/Bedeutungsprüfung ist Selbstprüfung, kein kaltes Löserurteil.

## Vor dem nächsten Urteilsmuster noch tatsächlich prüfen

1. **Eigener Sichtpass nach GG-Platzfreigabe:** kompletten Paar- und Alleinweg rendern und bedienen, alle sichtbaren Texte gegen die Quellliste abgleichen, echte Bilder pro Zustand. Maus/Tastatur/Touch, leere Auswahl, Hilfe, Fokus nach Zustandswechsel, Pause und Neuladen prüfen. Keine Quellcodelektüre als Bildschirmprüfung ausgeben.
2. **Richtig / plausible Variante / Fehler:** erste Karte mit `Listen!`; zweite Karte mit `Sit down!`; erster Fehler mit `Look!` und erklärtem Unterschied. Eine mündliche Form wie `Listen, please!` ist eine plausible höfliche Variante, im Modell aber keine getippte Eingabe. Die Oberfläche darf daraus keinen Fehler oder ungerechtfertigten Lernerfolg erzeugen. Der Quellen-/Didaktikprüfer beurteilt die Variante fachlich; der Löser bekommt diese Beispiele vorher nicht.
3. **Zwei unabhängige Rollen:** ein Löser erhält ausschließlich die unveränderte Schüleransicht ohne JSON-Schlüssel, Quellenkommentar oder Autorenbegründung. Lösungen erscheinen nur am vorgesehenen Vergleichsschritt; Erstwahl vorher festhalten. Ein getrennter Quellen-/Didaktikprüfer erhält zusätzlich die Originalbuchseiten, Variantenfragen und diesen Vertrag. Beide Sitzungen werden von Koki gestartet, nicht vom Autor orchestriert.
4. **Annahme:** Pflichtbatterie, tatsächlicher Spielpass, aktuelles cgo-006-Ergebnis, cgo-025-Herkunft und GG-Abgleich; anschließend Kokis persönliches Urteil. Offene wesentliche Befunde verhindern die Vorlage als fertiges Muster und jeden Serienbau.

Aktuell: Quelllektüre und überarbeiteter Sprachvertrag vorhanden. Bildschirmprüfung, unabhängige Urteile, Wirkung im Unterricht und fachliche Gesamtannahme **UNVERIFIZIERT**. Der bestehende Laufzeit-Hold wird dadurch nicht aufgehoben.
