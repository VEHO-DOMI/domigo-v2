# Zweiter W0-Lesedurchgang · Zusammenführung nach Nachtrag 12

**CODEX DRAFT — NOT CANON · Inhalts-/Muster-/Serienfreigabe NEIN.**

030 = CODEX cgo-030, 031 = CODEX cgo-031. Beide vollständigen Berichte und
Antwortdateien wurden erst nach beiden abgeschlossenen unabhängigen Rückgaben
zusammengeführt. Die Leser lösten jeweils alle 20 Grundansichten plus p008-Folge
bei 390 × 844 aus dem öffentlichen Paket. Sie kannten keine Schlüssel; ihre
Lösbarkeitsurteile sind keine technische Antwortbewertung oder Buchquellenprüfung.
Dieses Dokument ist für Autor/GG, niemals neues Material für kalte Leser.

| Urteil | Genaue Reichweite / Konsequenz |
|---|---|
| 030: **Nein** zur unveränderten Musterübernahme | p017 ist als Gruppierung lösbar, führt aber die angekündigte Verbformwahl nicht aus. Keine Behauptung insgesamt unlösbarer Aufgaben. |
| 031: **begrenztes Ja** als schlüsselfreies Inhaltsmuster | Alle Ansichten lösbar, vier SHOULD-FIX-Befunde, Schlüsselannahme UNVERIFIZIERT. Das Ja betrifft diese eigene enge Lesart; keine Merge-/Serien-/Koki-/Speicherfreigabe. |
| GG-Nachtrag 12 | Gleicher p017-Befund selbst an öffentlicher Ansicht bestätigt und vor unveränderter Musterübernahme **sperrend**. Kein Verrechnen des Nein und begrenzten Ja zu einem Gesamt-Ja. |
| W0-Disposition | Ehrlich gesperrter diagnostischer Bestand. Jahrgangsaufträge cgo-033–036 entwickeln die vollständige Spezifikation, cgo-025 bewahrt Herkunft. Diese Dokumentation ändert weder deren Plan noch Aufgaben, Produktkeys oder öffentliches Paket. |

## Fassung, Annahme und bisherige Belege

Paket `853165922030fb01941fd97e5d56f420bd3851ce417b2fae0097afb0972ea28e`,
erzeugt am Kopf `fcbfee51ed3a0f0043a21c2540cc141943c2244f`, Basis
`269ee986ccdc1ae7c3b070cbed7014f20e532365`.
Der nur dokumentarisch erweiterte Eingangskopf dieses Abgleichs ist
`e39aad02bbfcaffaa30b5676b6a44624b1e1dbe8`.
Darstellungscode-Prüfsumme unverändert:
`b934874bca63ad4315beb61a6dae7a765f347791d5f8ba7ee8743d6a6ec0e26d`.

Nach beiden Rückgaben wurden hier **41 Kandidaten von 030 und 36 von 031** mit
`grade-candidates.mjs` und dem tatsächlichen Bewerter verglichen, beide Läufe
Exit 0. Paket/aktuelle Darstellung/private Zuordnung wurden vor Bewertung
geprüft. Private Zuordnungs-Prüfsumme:
`8ca8c8f624913754ef105c5d730c1ae5e2bf8d2d7cb1e741755766da9cee8448`.
Das ist ein leichter Autorabgleich ohne Datenbank, keine Produktbatterie oder
weitere unabhängige Lesung. Alle 77 Kandidaten stehen unten in Originalreihenfolge.
`correct` heißt technisch voll angenommen, `close` teilweise, `wrong` abgewiesen;
diese Wörter sind **keine fachlichen Urteile**.

030 hat bei acht, 031 bei sechs Aufgaben mindestens einen nicht voll angenommenen
Kandidaten. Das bedeutet weder acht/sechs unlösbare Aufgaben noch ebenso viele
bewiesene Schlüsseldefekte. Die Kandidatenmengen unterscheiden sich bei
p010/p011/p014/p020; zusätzlich unterscheidet sich bei p010 die Reihenfolge.
Das unterschiedliche Führen plausibler Alternativen ist kein Beweis, dass der
andere Leser sie falsch fände. Notizen und Urteil werden mitgelesen.

Die frühere [6941…-Runde](BEFUNDE.md) mit 74 Kandidaten und zweimal Nein bleibt
unverändert samt damaliger technischer Annahme. Ihre [Quellen- und Reviewgeschichte](BEFUNDWEG.md)
gilt nur für unveränderte tatsächlich geprüfte Eigenschaften. Insbesondere
p007-Einführung, p012-Definition, p015-Zeitrahmen und p020-Voraussetzung werden durch
neue Lösbarkeit nicht still erledigt. [N11-Anforderungen](ANFORDERUNGSLUECKEN.md)
einschließlich Kokis Nein und fehlender Originalbuch-Bildsicht gelten weiter.

## Gepinnte Rückgaben

| Eingang | MD5 | SHA-256 |
|---|---|---|
| cgo-030 / antworten.json | `841fab274d0f69d4f8ef1d03f960655b` | `c186da1b0d67107da5df1d5d02bee65725da1417833d531bedb9578e4f81d4fa` |
| cgo-030 / bericht.md | `2e7fa8d76e04bd23318c0d172ca634a5` | `5250206106d1c33678851c938a6b71672c921b2c4fc9c517f451fdfa9ecd6668` |
| cgo-031 / antworten.json | `99078bf262be54c78be3697984ffe644` | `c97c3e19f2855ab7540dcdfc45bc57258cd3e5dc860375e22772872ed59daf47` |
| cgo-031 / bericht.md | `dc41c6594101da8aed05a408c423b2a0` | `bfc8c99f6cfea912da1c41103fb40872d969f3b1b3138ed9c1faa108a9682f21` |

Die Berichte dokumentieren Integrität vor/nach Lesen und je drei erfolgreiche
Abwehrproben (Stil verändert, Datei fehlt, Datei umbenannt). Das sind ihre
Prüfbelege, keine hier neu ausgeführte Browserprüfung. Geschlossene Hilfen,
Live-Bewertung und Speicherung wurden von ihnen nicht geprüft. Ihre Originale
bleiben außerhalb des Repos; keine kompletten fremden Berichte übernommen.

Das GG-Leserarchiv hat SHA-256
`e1f5d58d87ae6815318f8da99ac291ceb2920afb162f163f2b0061c9cd3c122d`,
MD5 `669cf40090053fe425fbf82c9a939f87`.
Es liegt im ZIP direkt an der Wurzel; das frühere Autorenarchiv enthält den
Präfix `solver/`. Deshalb unterschiedliche Archiv-Prüfsummen trotz **32 identischer
öffentlicher Dateien/Bytes**. Der strikte Autoren-Archivprüfer scheiterte am GG-ZIP
mit Exit 1 am erwarteten Präfix. Der anschließende eigene exakte Abgleich der
vorhandenen Wurzelstruktur, ohne doppelte/zusätzliche Dateien, und aller Bytes
gegen den Leserordner ergab Exit 0; Leserordner gegen Autorenordner ebenfalls
32/32 bytegleich. Kein Paketinhalt geändert, kein Integritätsfehler verdeckt.


## p001 · Keine neue Einzelsperre

- **030:** `"book"` → correct.
- **031:** `"book"` → correct.

**Disposition:** Beide bevorzugen book und vermerken story book gegenüber storybook. Die getrennte Ziellücke bleibt lösbar; daraus kein neuer Orthografie- oder Buchfreigabestempel. Bestehende Quellen-/Reviewgrenzen erhalten.

## p002 · Sprache offen

- **030:** `"pencil"` → correct.
- **031:** `"pencil"` → correct.

**Disposition:** Beide finden clean it als unklaren Rückverweis auf den Bleistift statt dessen Spuren. pencil wird korrekt angenommen; technische Annahme beseitigt den Sprachbefund nicht. Folgefassung muss Radieren der Schrift/Striche natürlich und mit eingeführter Sprache ausdrücken; Varianten nicht bloß in einen Schlüssel schreiben.

## p003 · Antwortumfang offen

- **030:** `"rubber"` → correct; `"eraser"` → wrong.
- **031:** `"rubber"` → correct; `"eraser"` → wrong.

**Disposition:** rubber und eraser bezeichnen dasselbe Objekt ohne sichtbare Varietätsvorgabe. eraser bleibt im geprüften Deutsch→Englisch-Pool abgewiesen. Bestehende fachliche Variantendisposition erhalten; spätere ausdrücklich beauftragte Poolkorrektur, keine pauschale Änderung aller vier Pools.

## p004 · Kein neuer Einzelbefund

- **030:** `"Stuhl"` → correct; `"Sessel"` → correct.
- **031:** `"Stuhl"` → correct; `"Sessel"` → correct.

**Disposition:** Stuhl und österreichisches Sessel werden beide angenommen. Diese beobachtete Eigenschaft bleibt erhalten; kein pauschales neues Register-/Seriensiegel.

## p005 · Kein neuer Einzelbefund

- **030:** `"Close the window!"` → correct.
- **031:** `"Close the window!"` → correct.

**Disposition:** Die angebotene situationspassende Aufforderung wird angenommen. Beide lösen den Auswahlauftrag; daraus weder freie Produktion noch gesicherter Einführungsstand aller Wörter ableiten.

## p006 · Kein neuer Einzelbefund

- **030:** `"pens"` → correct.
- **031:** `"pens"` → correct.

**Disposition:** Beide geben den regulären Plural pens ein. Formenbildung in dieser Lücke erhalten; Originalbuch-Bildsicht und tatsächlicher Unterrichtsstand bleiben gesondert erforderlich.

## p007 · Voraussetzung weiterhin offen

- **030:** `{"child":"children","fish":"fish","box":"boxes","desk":"desks","pen":"pens","class":"classes"}` → correct.
- **031:** `{"child":"children","fish":"fish","box":"boxes","desk":"desks","pen":"pens","class":"classes"}` → correct.

**Disposition:** Beide lösen die sichtbare Zuordnung korrekt. Sie hatten keine Buchquellen: Ihr Lösbarkeitsurteil schließt den älteren Quellenbefund nicht, dass boxes/classes mit -es durch SB1 Unit1 S.15 allein nicht belegt sind. Einführung oder gezielte Stütze in der Jahrgangsarchitektur nachweisen; kein fishes-Zusatz ohne Artenkontext.

## p008 · Handlung erhalten; Wirkung begrenzt

- **030:** `{"name":"rubber","colour":"pink"}` → correct.
- **031:** `{"name":"rubber","colour":"pink"}` → correct.

**Disposition:** Beide hielten rubber vor Öffnen des Folgeschritts fest und wählen danach pink. Farbe ist bereits sichtbar und wird genannt: Wort-/Farbzuordnung, kein verdeckter Gedächtnistest. Zwei Schritte erhalten; statische Leserprüfung beweist weder Farbklickabschluss noch Speicherung, N8-Endquittungsgrenze bleibt.

## p009 · Kein neuer Einzelbefund

- **030:** `"Don't write!"` → correct.
- **031:** `"Don't write!"` → correct.

**Disposition:** Beide wählen das zur sichtbaren Bleistifthandlung passende Verbot. Unterschied zur freien Produktion p010 erhalten; Bild-/Textverständnis ersetzt keine gesamte Buch-/Sprachprüfung.

## p010 · Gezielte Transferkorrektur bestätigt; Grenze erhalten

- **030:** `"Don't talk!"` → correct; `"Don't speak!"` → correct; `"Do not talk!"` → correct; `"Do not speak!"` → correct; `"Please don't talk!"` → correct; `"Please don't speak!"` → correct; `"Stop talking!"` → wrong.
- **031:** `"Don't talk!"` → correct; `"Don't speak!"` → correct; `"Please don't talk!"` → correct; `"Please don't speak!"` → correct; `"Do not talk!"` → correct; `"Do not speak!"` → correct.

**Disposition:** Die sechs von beiden genannten Don't/do not-/please-Formen werden voll angenommen. 030 führt zusätzlich Stop talking! als kommunikativ passende, aber ausdrücklich nicht dieselbe Regel belegende Antwort; 031 erwähnt sie in der Notiz und lässt sie aus dieser Kandidatenliste. Das ist kein fachlicher Widerspruch. Vorhandene Ablehnung ist kein Beleg schlechten Englischs; keine automatische volle Regelwertung. Alle zwölf vorher implementierten Varianten wurden durch diese kalte Auswahl nicht einzeln geprüft.

## p011 · Begriffsreiz offen

- **030:** `"audition"` → correct; `"tryout"` → wrong; `"performance"` → wrong.
- **031:** `"audition"` → correct; `"performance"` → wrong.

**Disposition:** Beide bevorzugen audition und bemängeln den fehlenden Auswahlzweck; performance passt zur breiten Vorführungsbeschreibung, ist aber kein bloßes Synonym einer Auswahlveranstaltung. Nur 030 führt tryout als plausible US-Variante. Technisch werden beide Zusätze abgewiesen. Auswahlbegriff/Schulsituation zuerst präzisieren, tryout kontextuell als Variante prüfen; performance nicht zum Erzwingen von Übereinstimmung hinzufügen. critics kommt im früher gegengelesenen SB3-TV-Talentshowkontext vor; dieser Befund macht das Buchwort nicht falsch, stützt aber nicht automatisch den erfundenen Schulkontext.

## p012 · Definitions-/Antwortumfangskonflikt erhalten

- **030:** `"song"` → wrong; `"tune"` → correct; `"melody"` → wrong.
- **031:** `"song"` → wrong; `"tune"` → correct; `"melody"` → wrong.

**Disposition:** Beide bevorzugen song und nennen tune/melody; nur tune wird angenommen. Leser031 hält den offenen Bedeutungsraum bei offener Annahme für vertretbar, hatte den engen realen Schlüssel aber nicht gesehen. Diese Bedingung ist im vorhandenen Pool nicht erfüllt. Zielbegriff und sichtbare Definition fachlich klären; song bezeichnet das ganze Lied, melody dessen melodischen Verlauf. Keine automatische Dreifach-Schlüsselergänzung.

## p013 · Antwortumfang offen

- **030:** `"lyrics"` → correct; `"song lyrics"` → wrong; `"the words of a song"` → wrong.
- **031:** `"lyrics"` → correct; `"song lyrics"` → wrong; `"the words of a song"` → wrong.

**Disposition:** Beide geben lyrics, song lyrics und the words of a song als vollständige Übersetzungen an. Nur lyrics wird technisch angenommen; kein sichtbares Einwortgebot. Frühere Disposition zum semantisch zulässigen Mehrwortraum erhalten; keine Änderung durch diese Dokumentation.

## p014 · Kontextuelle Variantenprüfung offen

- **030:** `"mutig"` → correct; `"tapfer"` → wrong; `"couragiert"` → wrong; `"beherzt"` → wrong; `"unerschrocken"` → wrong.
- **031:** `"mutig"` → correct; `"tapfer"` → wrong; `"couragiert"` → wrong.

**Disposition:** Beide nennen mutig/tapfer/couragiert; nur mutig wird angenommen. 030 nennt zusätzlich beherzt und unerschrocken, beide technisch wrong. In der kontextfreien Adjektivübersetzung sind diese plausible Annäherungen: beherzt betont entschlossenes Handeln, unerschrocken Furchtlosigkeit; brave kann auch Mut trotz Angst ausdrücken. Kein universeller Austausch in jedem Satz. Für den hier offenen Reiz nicht pauschal als schlechtes Deutsch werten; Buchziel und gewünschte Bedeutungsbreite vor künftiger Poolkorrektur entscheiden. Weniger häufige deutsche Wörter müssen nicht als Lernvoraussetzung allen zugeschrieben werden.

## p015 · Frühere Zeitrahmenfrage bleibt sichtbar

- **030:** `"plays | sings"` → correct.
- **031:** `"plays | sings"` → correct.

**Disposition:** Beide neuen Leser bevorzugen ausschließlich plays | sings; beide Formen werden angenommen. Das tilgt den früher von 028 genannten played | sang-Zeitrahmen nicht. Gegenwart ist naheliegend, Kontext für Vergangenheit wäre zusätzlich nötig; keinen historischen Kandidaten löschen und keinen neuen pauschalen Vergangenheits-Schlüssel daraus ableiten.

## p016 · Kein neuer Einzelbefund

- **030:** `{"Do you like pop music?":"Yes, I do.","Does she write her own lyrics?":"Yes, she does.","Do your friends play the guitar?":"No, they don't.","Does he sing along?":"No, he doesn't."}` → correct.
- **031:** `{"Do you like pop music?":"Yes, I do.","Does she write her own lyrics?":"Yes, she does.","Do your friends play the guitar?":"No, they don't.","Does he sing along?":"No, he doesn't."}` → correct.

**Disposition:** Beide lösen die vorgegebenen Frage-/Kurzantwortpaare. Person und Hilfsverb unterscheiden die Angebote; keine echten Vorlieben der Figuren abgefragt. Vorwissen Fragebildung bleibt Teil der Quellen-/Didaktikprüfung.

## p017 · SPERRE vor unveränderter Musterübernahme

- **030:** `{"She ___ great lyrics.":"She / He / It","I ___ great lyrics.":"I / You / We / They","My friends ___ the guitar.":"I / You / We / They","He ___ in a concert tonight.":"She / He / It","Tom ___ the guitar.":"She / He / It","You ___ in a concert tonight.":"I / You / We / They"}` → correct.
- **031:** `{"She ___ great lyrics.":"She / He / It","I ___ great lyrics.":"I / You / We / They","My friends ___ the guitar.":"I / You / We / They","He ___ in a concert tonight.":"She / He / It","Tom ___ the guitar.":"She / He / It","You ___ in a concert tonight.":"I / You / We / They"}` → correct.

**Disposition:** Beide ordnen alle sechs Subjekte richtig zu, Bewerter correct. 030 sperrt die Formwahl-Diskrepanz, 031 nennt denselben Befund SHOULD-FIX. GG hat das öffentliche Original selbst gegengelesen und die Sperre in N12 bestätigt. Gruppenwahl belegt keine gebildete Verbform; das technische correct hebt die Sperre nicht auf. Vor Folgefassung Lernziel festlegen: bestehende Subjektgruppierung präzise anweisen; ein anderes Verbformziel verlangt konkret dazu passendes Wortmaterial und einen gesondert geprüften Auftrag. tonight bleibt hinsichtlich des Zeitrahmens offen. Keine Umwandlung aller Formate zu Auswahl und keine versteckte Auftragsänderung im Paket.

## p018 · Handlung erhalten

- **030:** `"plays"` → correct.
- **031:** `"plays"` → correct.

**Disposition:** Beide bilden plays aus den sichtbaren Buchstaben. Das ist gestützte Formen-/Schreibfestigung, kein Beweis einer freien Satzproduktion. Alternative Tippeingabe und vollständiger Hilfeweg von den Lesern nicht bedient.

## p019 · Eingabeumfang offen; frühere Sperre erhalten

- **030:** `"And this is Leah. She always sings along!"` → correct; `"She always sings along!"` → correct; `"sings"` → wrong.
- **031:** `"And this is Leah. She always sings along!"` → correct; `"She always sings along!"` → correct; `"sings"` → wrong.

**Disposition:** Beide nennen vollständiges Zitat, korrigierten zweiten Satz und sings. Die Satzfassungen werden angenommen, das Wort abgewiesen. Grammatikfehler ist eindeutig, Eingabeumfang nicht. Kandidaten belegen Formatunsicherheit, nicht drei verschiedene Zielregeln. Frühere Empfehlung aus BEFUNDWEG.md für Korrektur des fehlerhaften Satzes bleibt Vorschlag für neue Fassung; kein Hinweis in die eingefrorene Ansicht. Ein bloßer Schlüsselzusatz würde den fehlenden Auftrag nicht reparieren.

## p020 · Fragehaltung und Voraussetzung offen

- **030:** `"Does | write"` → correct; `"Doesn't | write"` → close.
- **031:** `"Does | write"` → correct.

**Disposition:** Beide bevorzugen Does | write (correct). Nur 030 führt Doesn't | write als Kandidat; technische Wertung close. 031 erwähnt die negative Erwartungsfrage als weniger naheliegend im neutralen Kontext. Grammatisch mögliche Erwartung/Überraschung ist nicht bedeutungsgleich mit neutraler Informationssuche. Keine pauschale Schlüsselergänzung und keine Behauptung, die negative Frage sei ungrammatisch. Die gezeigte Verneinungsregel erklärt die Fragewortstellung nicht; do/does-Fragen müssen eingeführt oder bewusst gestützt sein.

## Übergabe und offener technischer Rest

Die fachliche Konsequenz von p017 ist vor unveränderter Musterübernahme sperrend.
Auch ein technisch als correct gewerteter Gruppierungsversuch schließt diese
Lücke nicht. Die neuen Rückgaben bestätigen gezielte Eigenschaften der vorhandenen
Fassung, kein pauschales neues Inhalts-/Seriensiegel. Jede folgende Text-/Auftrags-
oder Antwortänderung braucht eine passende neue Prüfung; keine verlorenen
Altbefunde, keine automatischen Schlüsselergänzungen zur Übereinstimmung.

N9 ist gemäß **Nachtrag 12 ausdrücklich ausgesetzt**. Der alte Kopf ist keine
Startfreigabe mehr. Erst fertiger Dokumentkopf, Paketgleichheit, leichte Prüfungen
und Rest gehen an GG; ausschließlich eine neue ausdrückliche Zuteilung erlaubt
den schweren Restversuch. Kein neuer Lastlauf oder Versuch in diesem Auftrag.
N8-Rot bleibt: test Exit 1, paint-art abgebrochen, 22 Resttore ungestartet;
vier grüne Tore am damaligen Kopf sind historische Belege, keine frische Batterie.

Externe Belege unter `cgo-006-evidence`: `n12-reader-pins.json`,
`n12-cgo-030-mechanical.json`, `n12-cgo-031-mechanical.json`,
`n12-mechanical-runs.json`, `n12-author-reader-bytes.json`,
`n12-gg-archive-check.json` sowie zugehörige Logs. Der dokumentarische Abschluss
ist Autorenselbstprüfung. Technische unabhängige Prüfung, GG-Integration, vollständige
Quellen-/Didaktikarbeit und Kokis Muster-/Registerurteil bleiben offen.
