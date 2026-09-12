# CODEX DRAFT — NOT CANON

# Wortbank Unit 2 — echte Trial-Wiederprüfung

CODEX-TRIAL round 2: independent lenses A and B/C read all 52 rows; nine forms fields / eleven additions accepted with source and grammar evidence. See wordbank.trial-round2.md. Ten historical Fable flag verdicts retained verbatim; no new Fable or human approval asserted. Canonical master reconstruction byte-identical with persisted forms overlays. Existing unchanged item approval carried forward separately; no new item assessment.

Die erste vollständige Batterie B1 (a897fc96) fand die fehlende Wiederprüfung mit V-A. Das Tor bleibt unverändert. Das alte Ingest-Werkzeug schreibt den Prüfernamen fest als Fable und verliert frühere Urteile; deshalb wurde diese eng begrenzte Datenrunde mit einem bewachten Trial-Skript dokumentiert. Keine fremde Unit und kein Pipeline-Code wurden geändert. Der Abschluss gilt nur zusammen mit den aktuellen grünen Validierungen und der vollständigen PR-Batterie.

## Nachweise

### lens-a

CODEX DRAFT — NOT CANON

# CODEX-TRIAL Runde 2 — unabhängige Wortbank-Linse A

Status: DOKUMENT / Quellentreue geprüft; keine Gesamtfreigabe der Unit.
Arbeitsweise: vollständiger Textabschnitt und sämtliche 52 Wortbankzeilen direkt gelesen, anschließend unabhängig mechanisch gegengeprüft. Keine frühere Parseprüfung dieser Wortbank durch diesen Prüfer; keine Repositoryänderung.

## Genaues Urteil

**Linse A: ok für Quellentreue und Vollständigkeit der englischen Einträge, deutschen Bedeutungen und Beispielsätze, mit ausdrücklich fortgeführter historischer Korrektur des ticket-Beispiels. Kein neuer fix/drop/add-Befund dieser Linse.**

52/52 Quelleinträge vorhanden, ohne Ergänzung, Auslassung oder Umordnung: 14 im Abschnitt „Word File“ (Textzeilen 84–97) und 38 im Abschnitt „Words and Phrases“ (101–138). Die Abschnittsgrenzen liegen bei „Unit 2“ in Zeile 81 und „Unit 3“ in Zeile 140. Die vier doppelt vorkommenden Stichwörter behind, in front of, next to und under sind jeweils einmal als Word-File-Eintrag und einmal mit Beispielsatz vorhanden; das bildet die Quelle ab.

Alle 52 englischen Felder und alle 52 deutschen Rohtexte entsprechen der Quelle genau. Von den 52 Beispielfeldern entsprechen 51 einschließlich leerer Felder genau der Quelle. Einzige Abweichung: Quelle Zeile 121 enthält „Adults tickets are €14.40.“; Wortbankzeile 35 enthält „Adult tickets are €14.40.“. Diese Grammatikberichtigung ist bereits in content/overlays/parse-fixes.json:5 und im historischen wordbank.flags.json:81 ausdrücklich dokumentiert; sie ist gegenüber HEAD^ unverändert. Daher nicht „52/52 wortwörtlich“ behaupten.

Die aufgeteilten deutschen Bedeutungen bewahren den Inhalt: guide → Führer/Führerin ; Guide (Z. 90), beautiful → schön ; hübsch (102), at → bei ; an ; in (111; das Quelllabel „hier:“ bleibt im Rohtext erhalten), ticket → Eintrittskarte ; Ticket (121), year → Jahr ; Jahrgangsstufe (124), to talk → sprechen ; sich unterhalten (127), happy → glücklich ; fröhlich ; zufrieden (131). Schrägstriche in Führer/Führerin und Erwachsene/r sowie die Klammer in (mit-)bringen bleiben erhalten. Die übrigen Bedeutungen sind Einzelwerte.

## Änderung gegenüber HEAD^

Exakt neun geänderte Felder, sämtlich forms; insgesamt elf Formen ergänzt. Keine Änderung an Eintragszahl, Reihenfolge, Kennungen, en, de, deRaw, exampleSb, cf oder source. forms bezeichnet die zusätzlich erkannten Wort- und Ausdrucksformen.

| Stichwort | Quellzeile | Vorher | Jetzt |
|---|---:|---|---|
| tree | 84 | tree | tree ; trees |
| monkey | 85 | monkey | monkey ; monkeys |
| giraffe | 87 | giraffe | giraffe ; giraffes |
| train | 88 | train | train ; trains |
| penguin | 89 | penguin | penguin ; penguins |
| guide | 90 | guide | guide ; guides |
| lion | 91 | lion | lion ; lions |
| to let somebody out | 132 | to let somebody out ; let somebody out | to let somebody out ; let somebody out ; let us out ; let me out |
| At last. | 135 | At last. | At last. ; At last ; At last! |

Quellenabgrenzung: Die sieben regelmäßigen Mehrzahlformen stehen nicht als eigene Zeilen im U2-Mastertext. „Let us out!“ steht wörtlich in Zeile 132; „let me out“ steht dort nicht wörtlich. „At last.“ steht in Zeile 135; die Varianten ohne Satzzeichen bzw. mit Rufzeichen sind abgeleitete Varianten. Das sind keine erfundenen neuen Stichwörter, aber auch keine elf wörtlichen Quellenzitate. Ihre Formen- und Quellenfreigabe liegt zusätzlich bei Linse B/C; Linse A bestätigt die unveränderten Ausgangseinträge und benennt diese Grenze.

## Vollständiger Zeilenabgleich

Die Tabelle dokumentiert die aktuelle Wortbank gegen die vollständig gelesene Textquelle. „leer“ bedeutet kein Beispielsatz in der Quelle. Die einzige nicht wortwörtliche Beispielzelle ist ausdrücklich markiert.

| Bankzeile | Textzeile | Englisch | Deutscher Rohtext | Beispiel in der Wortbank | Befund |
|---:|---:|---|---|---|---|
| 1 | 84 | tree | Baum | leer | identisch |
| 2 | 85 | monkey | Affe | leer | identisch |
| 3 | 86 | parrot | Papagei | leer | identisch |
| 4 | 87 | giraffe | Giraffe | leer | identisch |
| 5 | 88 | train | Zug | leer | identisch |
| 6 | 89 | penguin | Pinguin | leer | identisch |
| 7 | 90 | guide | Führer/Führerin, Guide | leer | identisch |
| 8 | 91 | lion | Löwe | leer | identisch |
| 9 | 92 | next to | neben | leer | identisch |
| 10 | 93 | in | in | leer | identisch |
| 11 | 94 | behind | hinter | leer | identisch |
| 12 | 95 | under | unter | leer | identisch |
| 13 | 96 | on | auf | leer | identisch |
| 14 | 97 | in front of | vor | leer | identisch |
| 15 | 101 | zoo | Zoo | There are many animals in the zoo. | identisch |
| 16 | 102 | beautiful | schön, hübsch | The parrot is blue and yellow. It's beautiful. | identisch |
| 17 | 103 | behind | hinter | The chair is behind the desk. | identisch |
| 18 | 104 | big | groß | There's a big giraffe. | identisch |
| 19 | 105 | in front of | vor | The tree is in front of you. | identisch |
| 20 | 106 | next to | neben | The monkey is next to the parrot. | identisch |
| 21 | 107 | under | unter | The bag is under the desk. | identisch |
| 22 | 108 | where | wo | Where is Polly? | identisch |
| 23 | 109 | small | klein | The monkey isn't big. It's small. | identisch |
| 24 | 110 | adult | Erwachsene/r | Adults are €14.40. | identisch |
| 25 | 111 | at | bei; an; hier: in | The children are at the zoo. | identisch |
| 26 | 112 | to bring | (mit-)bringen | Can I bring my dog, Buddy? | identisch |
| 27 | 113 | but | aber | Dogs are welcome. But they can't run around. | identisch |
| 28 | 114 | child (pl children) | Kind | Child €4.90. | identisch |
| 29 | 115 | dog | Hund | Buddy is a dog. | identisch |
| 30 | 116 | family | Familie | Buddy's family is at the zoo. | identisch |
| 31 | 117 | free | kostenlos | Parking is free. | identisch |
| 32 | 118 | Grandma | Oma | Say hi to Grandma! | identisch |
| 33 | 119 | group | Gruppe | A group ticket is €8.90. | identisch |
| 34 | 120 | long | lang | The giraffe has a long neck. | identisch |
| 35 | 121 | ticket | Eintrittskarte; Ticket | Adult tickets are €14.40. | historische ticket-Korrektur |
| 36 | 122 | to want | wollen | I want a lion. | identisch |
| 37 | 123 | from | aus | They are from California. | identisch |
| 38 | 124 | year | Jahr; Jahrgangsstufe | I'm in Year 7. | identisch |
| 39 | 125 | he | er | He likes animals. | identisch |
| 40 | 126 | she | sie | She is from England. | identisch |
| 41 | 127 | to talk | sprechen, sich unterhalten | Talk about the boys and girls. | identisch |
| 42 | 128 | they | sie | Rahim and Sue are 11. They are from Manchester. | identisch |
| 43 | 129 | we | wir | We are from Austria. | identisch |
| 44 | 130 | for | für | Here's a chant for you. | identisch |
| 45 | 131 | happy | glücklich, fröhlich; zufrieden | Buddy is happy. | identisch |
| 46 | 132 | to let somebody out | jemanden herauslassen | Let us out! | identisch |
| 47 | 133 | us | uns | Can you see us? | identisch |
| 48 | 134 | car | Auto | The parrot is in the car. | identisch |
| 49 | 135 | At last. | Endlich. | leer | identisch |
| 50 | 136 | How strange! | Wie komisch! | leer | identisch |
| 51 | 137 | Let me see. | Lass mich mal schauen. | leer | identisch |
| 52 | 138 | stone | Stein | Colour your stone. | identisch |

## Historische Befunde und Freigabegrenze

Der vorhandene historische Flagbericht enthält zehn Einzelurteile. Sie wurden für diese Linse weder neu erfunden noch ersetzt; der ticket-Hinweis dient als belegte fortgeführte Ausnahme. Diese neue Linse ist als CODEX-TRIAL Runde 2 zu kennzeichnen, nicht als nachträglich von Fable vergebenes Urteil.

Nach docs/runbooks/content-review-loop.md darf eine Unit bei roter Validierung oder nicht abgeklärter Quellenänderung nicht freigegeben werden. Dieser Bericht führt keine Gesamtvalidierung aus und setzt keinen Unit-Status. Eine abschließende unit: ok-Entscheidung braucht die aktuellen grünen Prüfungen sowie Linse B/C; das Quellentreue-Urteil oben ersetzt diese Bedingungen nicht.

## Gelesener Stand

Lab: /Users/veho/Code/codex-lab/trial-domigo-v2
HEAD: a897fc96a400a21f885f54b033e31fa8144eaa46
Vergleichsbasis HEAD^: 161dda056184692763dba8c22fcf8a6d5552f172
Wortbank SHA-256: 973a4178320a03dadcd69c6538980d2d9b53f85c280a93e2d46d70ec00390e0a
Mastertext SHA-256: 188b3e9b01103e4e8000bfbda7577506f589e96b476b0887b20bafbf84d2c6f7
source-Metadaten der Wortbank gegenüber HEAD^ identisch.

Verifikation: vollständige direkte Lektüre, tabulatorgenauer unabhängiger Vergleich von en/deRaw/exampleSb/kind, Prüfung der 52 geordneten Einträge, Feldvergleich gegen HEAD^ und Sichtung der belegten ticket-Ausnahme. Nicht geprüft: Original-Worddatei/Buchbilder, vollständige Validatoren, abschließende Formen-/Quellenentscheidung der anderen Linsen.


### lens-bc

# CODEX DRAFT — NOT CANON

## Tatsächliche Linsen B/C — Wortbank g1-u02, Runde 2

Prüfer: unabhängiger CODEX-TRIAL-Unteragent repo_ground_truth. Auftrag: deutsche Bedeutungen, Formen, Unicode-Normalisierung, Klassenstufe und Gegenprüfung der neuen sowie historischen Flags. Keine Autorenschaft am ursprünglichen Wortbank-Parse; keine Repoänderung oder Pipeline-Freigabe.

Gelesener Stand: /Users/veho/Code/codex-lab/trial-domigo-v2/content/corpus/units/g1-u02/wordbank.json, entriesContentHash **f663b08cf1e80c30f36caf660945c364a58f8f6a2e0a7cbf746b92ec1f36481b**. Alte Basis:8964a98699d24edafa76bb136656807c292cf515f5073d371b7b9439ab326327. Alle52 aktuellen Zeilen wurden mit en/de/forms/cf/example gelesen, nicht nur die neun Änderungen. Genau9 forms-Felder mit11 Ergänzungen; alle übrigen Felder und43 übrigen Einträge unverändert. Der automatisierte reine Zeichenvergleich fand keine Nicht-NFC-Zeichenfolge und keine identische doppelte Form in einem forms-Array. NFC bezeichnet hier die einheitliche Unicode-Schreibweise zusammengesetzter Zeichen.

**Linsenurteil:** neun neue changed-since-review-Flags jeweils **ok**; alle zehn historischen **ok**-Urteile sind unverändert weitertragbar. Kein neuer fachlicher fix-Befund aus B/C. Das ist keine pauschale Unit-/Pipeline-Freigabe: V-A bleibt bis zur korrekt dokumentierten Metadatenrunde rot; unabhängige Linse A, historische Provenienz, Regenerierbarkeit und übrige Tore bleiben gesondert.

## Quellenkürzel (jeweils tatsächlich gelesen)

- **M:** /Users/veho/Code/codex-lab/trial-domigo-v2/content/build/transcripts/g1/master-vocabulary-list.txt:81–138, vollständiger Unit2-Abschnitt.
- **S:** /Users/veho/Code/codex-lab/trial-domigo-v2/content/build/transcripts/g1/sb/SB Unit 2- At the zoo.txt:1–115, SB-Seiten16–21 einschließlich Grammatik und Chant.
- **W:** /Users/veho/Code/codex-lab/trial-domigo-v2/content/build/transcripts/g1/wb/WB Unit 2 At the zoo.txt:43–80 und190–247, WB-Grammatik/Ortsaufgaben und Wortschatzteil.
- **G:** /Users/veho/Code/codex-lab/trial-domigo-v2/content/build/transcripts/g1/sb/SB Grammar Appendix.txt:155–178, regelmäßige Mehrzahl:162–163.
- **H:** /Users/veho/Code/codex-lab/trial-domigo-v2/content/corpus/units/g1-u02/review/wordbank.flags.json, vollständiger bestehender Zehner-Flagsatz der Fable-Runde1.

Seiten-/Zeilenbelege verweisen auf gespeicherte Transkripte. Eine Bildbeschreibung im Transkript wird unten ausdrücklich als solche bezeichnet und nicht zu einem gedruckten englischen Schülersatz umgedeutet.

## Vollständige 52-Zeilen-Lesung: Deutsch und Formen

Alle IDs tragen den Präfix g1u02.w.; die Tabelle nennt den restlichen Schlüssel. „ok“ beurteilt das vorhandene Wörterbuchfeld und seine begrenzte Rolle, nicht jeden denkbaren Einsatz der Übersetzung in einem Satz.

| Nr. | Schlüssel | B-Urteil und konkreter Grund |
|---:|---|---|
|1|tree|ok — Baum stimmt; tree/trees regelmäßige Einzahl/Mehrzahl, neue Form siehe Flag.|
|2|monkey|ok — Affe stimmt; monkey/monkeys, Vokal vor y, daher kein monkeys→monkies-Fehler.|
|3|parrot|ok — Papagei, unveränderte Grundform; keine falsche zusätzliche Form.|
|4|giraffe|ok — Giraffe; giraffe/giraffes, regelmäßiges angehängtes s.|
|5|train|ok — Zug; train/trains im Unit2-Grammatikbeispiel.|
|6|penguin|ok — Pinguin; penguin/penguins im selben Grammatikabschnitt.|
|7|guide|ok — Führer/Führerin und Guide bezeichnen hier die Person im Zoo; guides regelmäßiger Plural.|
|8|lion|ok — Löwe; lion/lions, Unit2-WB nennt die Mehrzahl ausdrücklich.|
|9|next-to|ok — neben ist die gelehrte Ortsbeziehung; zusammenhängende Form next to erhalten.|
|10|in|ok — in, unveränderte Ortspräposition.|
|11|behind|ok — hinter; Word-File-Eintrag darf neben der zweiten Quellenzeile bestehen.|
|12|under|ok — unter; korrekte räumliche Grundbedeutung.|
|13|on|ok — auf; korrekte gelehrte Ortsbedeutung.|
|14|in-front-of|ok — vor; die englische Mehrwortform bleibt zusammen.|
|15|zoo|ok — Zoo; Großschreibung im Deutschen richtig.|
|16|beautiful|ok — schön/hübsch sind sinnvolle getrennte Synonyme; keine Bedeutungsaufspaltung in falsche Wortklassen.|
|17|behind-2|ok — hinter; zweiter, beispieltragender Quelleneintrag, keine versehentliche neue Bedeutung.|
|18|big|ok — groß, orthografisch korrekt; big als Grundform.|
|19|in-front-of-2|ok — vor; zweite belegte Quellenzeile mit Beispiel.|
|20|next-to-2|ok — neben; zweite belegte Quellenzeile mit Beispiel.|
|21|under-2|ok — unter; zweite belegte Quellenzeile mit Beispiel.|
|22|where|ok — wo, passend zu Where is Polly?; kein wohin-Fehler.|
|23|small|ok — klein; Gegensatz zu big bleibt korrekt.|
|24|adult|ok — Erwachsene/r ist vorhandene Wörterbuchkurzform; kein neues Kind-Dialogfeld. Singularlemma trotz pluralischem Beispiel korrekt.|
|25|at|ok — bei/an/in sind getrennte kontextabhängige Bedeutungen; in deckt hier at the zoo. Nicht als beliebig austauschbare Ortsantworten zu lesen.|
|26|to-bring|ok — (mit-)bringen bildet die Quellenbedeutung ab; Infinitiv to bring und cf/Grundform bring konsistent.|
|27|but|ok — aber; keine Zusatzformen nötig für diese Konjunktion.|
|28|child|ok — Kind; child/children bildet den ausdrücklich notierten unregelmäßigen Plural ab, nicht childs.|
|29|dog|ok — Hund; unveränderte Grundform, keine falsche Flexion.|
|30|family|ok — Familie; familienbezogenes Beispiel passt, vorhandene Formen unverändert.|
|31|free|ok — kostenlos ist ausdrücklich die Park-/Preis-Bedeutung, keine stillschweigende Freigabe für befreit.|
|32|grandma|ok — Oma; Grandma als anredeähnlicher Familienname im Beispiel vertretbar, unveränderte Großschreibung.|
|33|group|ok — Gruppe, passend zum Gruppenticket; kein grammatischer Klassenbegriff hinzugefügt.|
|34|long|ok — lang beim Giraffenhals; keine Verwechslung mit groß.|
|35|ticket|ok — Eintrittskarte/Ticket getrennte Synonyme; korrigiertes Adult tickets ist grammatisch richtig und historisch belegt.|
|36|to-want|ok — wollen; to want/want und cf passen zusammen.|
|37|from|ok — aus im Herkunftskontext California; keine falsche neue Form.|
|38|year|ok — Jahr/Jahrgangsstufe sind im Year7-Beispiel sinnvoll getrennt.|
|39|he|ok — er; Subjektpronomen passend zur Unit2-Personenbeschreibung.|
|40|she|ok — sie, weibliche Einzahl; eigene ID verhindert Zusammenwerfen mit they.|
|41|to-talk|ok — sprechen/sich unterhalten; to talk/talk und cf passen, beide deutsche Bedeutungen idiomatisch.|
|42|they|ok — sie in der Mehrzahl; Beispiel benennt zwei Personen.|
|43|we|ok — wir; korrektes Subjektpronomen.|
|44|for|ok — für im Chant-Kontext; keine neue Satzstruktur ergänzt.|
|45|happy|ok — glücklich/fröhlich/zufrieden sind sinnvolle Quellenbedeutungen, sauber getrennt.|
|46|to-let-somebody-out|ok — jemanden herauslassen; konkrete me/us-Ergänzungen wörtlich im Unit2-Chant. Kein neuer Verbtyp.|
|47|us|ok — uns, Objektform; nicht mit we vertauscht.|
|48|car|ok — Auto; unverändertes Lemma, passend zur Ortsaufgabe.|
|49|at-last|ok — Endlich.; Punkt, Ausruf und satzzeichenlose Form behalten dieselbe Phrase.|
|50|how-strange|ok — Wie komisch! ist idiomatische Entsprechung; unveränderte Interpunktion.|
|51|let-me-see|ok — Lass mich mal schauen. ist idiomatisch; bestehende Phrase nicht mit herauslassen verwechselt.|
|52|stone|ok — Stein; Colour your stone passt zur Unit2-Geschichte.|

Bestehende Wörterbuchnotationen in guide/adult/to-bring enthalten Schrägstrich bzw. Klammern. Sie wurden hier nicht neu eingeführt oder als gesprochene Spielhilfe freigegeben. Die Runde verändert ausschließlich englische forms. Keine davon überschreitet für ihren beauftragten Unit2-Zweck das Niveau: regelmäßige Plurale werden in derselben Unit gebraucht, und die beiden Imperativformulierungen sind Bestandteil ihres Chants.

## Neun neue changed-since-review-Urteile

Die folgenden Schlüssel und Notizen können als tatsächliche B/C-Urteile dieser Runde übernommen werden; Urheber bleibt CODEX-TRIAL-Linse B/C, keine Fable-Unterschrift.

| Flag-Schlüssel | Urteil | Konkrete Notiz mit Quelle |
|---|---|---|
|changed-since-review:g1u02.w.tree|ok|tree→trees ist die regelmäßige -s-Mehrzahl des bereits gelehrten tree (M:84; G:162–163). W:49 nennt trees nur in einer Bildbeschreibung; die Freigabe beruht auf transparenter grammatischer Ableitung, nicht auf einer erfundenen gedruckten Pluralzeile.|
|changed-since-review:g1u02.w.monkey|ok|monkeys ist wörtlich S:10/15/51 und W:65/75 belegt; die Schreibweise bewahrt y nach Vokal. Bedeutung Affe und alle anderen Felder unverändert.|
|changed-since-review:g1u02.w.giraffe|ok|giraffes steht wörtlich S:10/27/34; regelmäßiger Plural des vorhandenen Lemmas M:87. Keine neue Bedeutung oder Wortklasse.|
|changed-since-review:g1u02.w.train|ok|S:86 kontrastiert ausdrücklich a train/two trains; trains ist somit unmittelbar in der Unit2-Grammatik gelehrt.|
|changed-since-review:g1u02.w.penguin|ok|S:28/34/86 sowie W:68 führen penguins; S:86 kontrastiert Singular/Plural. Pinguin bleibt die passende deutsche Bedeutung.|
|changed-since-review:g1u02.w.guide|ok|guides ist regelmäßige -s-Mehrzahl des Unit2-Personenworts guide (M:90; W:222). G:162–163 begründet die Bildung; S:86 zeigt den Pluralgebrauch dieser Lernstufe. Keine wörtliche Unit2-guides-Stelle gefunden, daher ausdrücklich morphologische Ableitung.|
|changed-since-review:g1u02.w.lion|ok|lions ist wörtlich W:51 und73 belegt; regelmäßige Mehrzahl des vorhandenen lion (M:91), deutsche Bedeutung Löwe unverändert.|
|changed-since-review:g1u02.w.to-let-somebody-out|ok|S:53 enthält Let me out.; S:57 Let us out.; M:132 und W:239 zusätzlich Let us out!. Formen ohne Satzschlusspunkt/-rufzeichen dienen derselben Phrase. Konkrete Objekte me/us sind gelehrt, keine frei erfundene Erweiterung des Ziels.|
|changed-since-review:g1u02.w.at-last|ok|M:135 und W:244 führen At last.; S:110 At last!. At last ohne Satzschluss ist dieselbe Phrase als Formenwert. Alle Varianten bedeuten weiterhin Endlich.; kein neuer Ausdruck.|

## Zehn historische Flags: einzeln gegengeprüft

Die ursprünglichen Fable-Notizen in H unverändert erhalten; diese Tabelle ist die neue Bestätigung ihres Fortbestehens, kein Ersatz der damaligen Autorenschaft.

| Historischer Flag-Schlüssel | Urteil für Weiterführung | Neu geprüfte Begründung |
|---|---|---|
|duplicate-headword:g1u02.w.behind-2|ok, unverändert weitertragen|M:94 führt behind im Word File, M:103 führt hinter mit Beispiel erneut. Beide aktuellen Einträge unverändert.|
|duplicate-headword:g1u02.w.in-front-of-2|ok, unverändert weitertragen|M:97 und105 enthalten getrennte Word-File-/Beispielzeilen; beide aktuellen Einträge unverändert.|
|duplicate-headword:g1u02.w.next-to-2|ok, unverändert weitertragen|M:92 und106 enthalten die zwei Quellenrollen. Keine neue Dublette durch die Formenrunde.|
|duplicate-headword:g1u02.w.under-2|ok, unverändert weitertragen|M:95 und107 belegen beide Zeilen. Aktuelles under-2 einschließlich Beispiel unverändert.|
|not-in-transcript:g1u02.w.family|ok, unverändert weitertragen|M:116 führt family/Familie samt Zoo-Beispiel ausdrücklich. Die historische SB/WB-Heuristik begründet keinen Wegfall eines kanonischen Masterlistenworts; aktuelle Zeile unverändert.|
|not-in-transcript:g1u02.w.free|ok, unverändert weitertragen|M:117 führt free/kostenlos und Parking is free. Die Preisbedeutung ist klar; es wird keine neue befreit-Bedeutung hinzugenommen. Zeile unverändert.|
|not-in-transcript:g1u02.w.grandma|ok, unverändert weitertragen|M:118 führt Grandma/Oma mit Say hi to Grandma!. Wort und Bedeutung unverändert, historische kanonische Quellenbegründung bleibt gültig.|
|not-in-transcript:g1u02.w.group|ok, unverändert weitertragen|M:119 führt group/Gruppe und Gruppenticket-Beispiel. Aktuelle Zeile unverändert.|
|not-in-transcript:g1u02.w.ticket|ok, unverändert weitertragen|M:121 belegt ticket und Übersetzungen; sein Adults tickets-Tippfehler wurde bereits historisch nachvollziehbar zu Adult tickets korrigiert. Aktueller Wert und bestehender parse-fixes-Patch bewahren genau diese Korrektur; kein neuer unerklärter Eingriff.|
|not-in-transcript:g1u02.w.to-want|ok, unverändert weitertragen|M:122 führt to want/wollen und I want a lion.; current to want/want sowie cf sind unverändert korrekt.|

## Zusätzliche Befunde und Grenzen

Keine neue fachliche fix-Forderung aus dieser vollständigen B-Lesung und der C-Gegenprüfung. Keine NFC-Abweichung, keine doppelte identische Form, keine neue Bedeutung, kein unzulässiger unregelmäßiger Plural gefunden. Nicht behauptet wird eine vollständige Flexionssammlung aller52 Wörter: unveränderte Singular-only-Einträge müssen durch diese begrenzte Ergänzung nicht automatisch erweitert werden.

V-A ist weiterhin der berechtigte Anlass der Runde2, bis Root die echten neuen Urteile und regenerierbaren Formen sauber einträgt. Alte zehn Verdicts müssen erhalten werden; falsches automatisches reviewedBy:fable vermeiden. Dieser Bericht vergibt keine neue Item-Freigabe und keine Kunst-/Sprachpass-/Pipeline-Gesamtfreigabe. Linse A prüft Quellentreue unabhängig. Jede spätere Änderung des oben gepinnten Bankinhalts verlangt erneuten Abgleich dieses Urteils.


## Tatsächliche Rekonstruktion

```text
nice: setpriority: Operation not permitted
{
  "label": "CODEX DRAFT — NOT CANON",
  "scratch": "/private/tmp/codex-wordbank-regen-XPOpyP",
  "sourceCodeSha256": "6c367d6a0a4251d0c91db7af19ff643c8021581dfaee90a0a06ee4e01e047df7",
  "overlaySha256": "ef9eb7d51b14e8da6a8ff0008f7660b15aa55d924332611ba1f21c3e028c06ab",
  "master": {
    "path": "/Users/veho/Library/Mobile Documents/com~apple~CloudDocs/Domi Gym/Domi Gym 2025:26/1ABC (2025:26)/MORE 1 /MORE1_Master_Vocabulary_List_Units_1-15.docx",
    "sha256": "c305c9147475a30f5db0c06e920ec2fd9cadac6f0375b25071473210e29143c3",
    "matchesBankSource": true
  },
  "gradeTotals": {
    "total": 786,
    "wordfile": 303,
    "phrase": 483
  },
  "warnings": [],
  "unitEntries": 52,
  "stableIdsUnchanged": true,
  "existingOverlaysApplied": true,
  "proposedFormsPatch": {},
  "proposedPatchCount": 0,
  "entriesEqual": true,
  "bankEqual": true,
  "byteEqual": true,
  "bankSha256": "973a4178320a03dadcd69c6538980d2d9b53f85c280a93e2d46d70ec00390e0a",
  "entriesHash": "f663b08cf1e80c30f36caf660945c364a58f8f6a2e0a7cbf746b92ec1f36481b",
  "items": {
    "vocab": 52,
    "grammar": 186,
    "itemsHash": "a2e12ea514a0d840907a02f41d8e0669d2bf204dbc5fcb4c29860b3cfb28b7a4",
    "definition": "readUnitItems reads raw vocab.json/grammar.json items arrays only; itemsContentHash hashes JSON.stringify({vocab,grammar}), no implicit item-fixes overlay"
  },
  "approvedUnits": {
    "count": 57,
    "slugs": [
      "g1-u01",
      "g1-u02",
      "g1-u03",
      "g1-u04",
      "g1-u05",
      "g1-u06",
      "g1-u07",
      "g1-u08",
      "g1-u09",
      "g1-u10",
      "g1-u11",
      "g1-u12",
      "g1-u13",
      "g1-u14",
      "g1-u15",
      "g2-u01",
      "g2-u02",
      "g2-u03",
      "g2-u04",
      "g2-u05",
      "g2-u06",
      "g2-u07",
      "g2-u08",
      "g2-u09",
      "g2-u10",
      "g2-u11",
      "g2-u12",
      "g2-u13",
      "g2-u14",
      "g2-u15",
      "g3-u01",
      "g3-u02",
      "g3-u03",
      "g3-u04",
      "g3-u05",
      "g3-u06",
      "g3-u07",
      "g3-u08",
      "g3-u09",
      "g3-u10",
      "g3-u11",
      "g3-u12",
      "g3-u13",
      "g3-u14",
      "g4-u01",
      "g4-u02",
      "g4-u03",
      "g4-u04",
      "g4-u05",
      "g4-u06",
      "g4-u07",
      "g4-u08",
      "g4-u09",
      "g4-u10",
      "g4-u11",
      "g4-u12",
      "g4-u13"
    ],
    "definition": "Latest state.json transition is approved; this enumeration alone does not validate hash freshness"
  },
  "scope": "Canonical master and original parser+IDs+shape+overlay code; only g1-u02 reconstructed. Proposed forms derived from currentbank are explicit inputs, not independent linguistic verification.",
  "allUnitArtifactsUnchanged": 1445,
  "otherUnitsUnchanged": true
}

```
