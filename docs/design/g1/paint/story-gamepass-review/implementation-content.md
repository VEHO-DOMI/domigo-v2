# CODEX DRAFT — NOT CANON

# Kapitel 1 – ausgeführte Kartenredaktion

13.09.2026. Freigegebener Schreibbereich ausschließlich `content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json`. Keine andere Repositorydatei geändert, keine Boardänderung, kein Commit. Die Regeln, das Spielverhalten, Bilder, Schließfachdarstellung, Name und Prolog werden von Root integriert. Diese Redaktion ist kein blinder Leserpass.

## Umgesetzt

- Aktiver Kartenbestand **70 → 61**. Die neun `pickupset`-Fragen entfernt. Wort/Bild/Fundstatus bleiben Aufgaben der bereits vorhandenen Kleidungsentitäten und der vom Elternteam angepassten Fundübersicht.
- **Alle 61 verbleibenden Karten einzeln redigiert**, einschließlich vorher nicht gemeldeter Varianten. 231 aktuell deutsche Sicht-/Aufgaben-/Farb-/Hinweiszeilen, sämtliche Zeilen höchstens 56 Zeichen.
- **Zehn Wiederherstellkarten, zehn Zielfarben**. Der bisherige Stuhl im Käfig wird unter stabiler ID `g1.paint.ch01.rsc.chair.r1` zur `use:encounter`, `kind:restore`, `skins:[obj_chair]`, `stimulus.art:obj_chair_a`, p3. Seine vier Namen sind chair / desk / school bag / pencil case. Ziel yellow. Die stabile ID ist absichtlich historisch rsc, ihr tatsächlicher Verwendungstyp ist jetzt encounter.
- Wiederherstellungen fragen zuerst „Sag den Namen auf Englisch.“. Die zweite Frage gibt den konkreten Gegenstand, seine Farbe und „Gib ihm/ihr die Farbe zurück.“ an. Die männliche/neutrale Form ist ihm, die weibliche ihr; kein „seine/ihre Farbe zurück“ in dieser Aufforderung. Hints enthalten keine alten falschen Farben.
- Der Bleistift will ins Heft kritzeln und bekommt ein klares Verbot. Keine doppelte Beschreibung desselben neuen Hefts.
- Die Füllfeder übersetzt die konkrete Frage „Wie geht es dir?“. Die nächste Variante fragt nach einer Wohnadresse; die falsche E-Mail-Situation wurde entfernt. Bestehende englische Antwort `What's your address?` bleibt.
- Alle neun Türfragen haben eine sinnvolle soziale/übersetzende Aufgabe. Die Tür redet nicht, hat keinen Namen und kein Befinden. Der letzte Übergang nennt die Tafelbühne, kein Gartentor.
- Drei Schultaschen-/Malkasten-/Boss-Außenseitergruppen nutzen nähere Gegenstände statt dreimal chair. Malkasten pen/pencil/exercise book/**watercolours**; Federpennal pen/pencil/rubber/**exercise book**; Boss pen/pencil/**rubber**. Die markierte Antwort ist jeweils eindeutig aus der Funktion/üblichen Aufbewahrung ableitbar. `exercises` und vorhandene `evidence` angepasst. Watercolours ist im aktiven Unit-1-Lexikon, besitzt aber keinen eigenständigen Wortbankeintrag; keine falsche neue Übungs-ID erfunden.
- Vier Zahlenradvorlagen beschreiben schwebende Zahlen/Wörter. Die festen Zahlhinweise dreizehn/sieben/einundzwanzig/vier entfernt, damit pro Durchgang neue Ziele keine falschen Hinweise erben. Die vorhandenen `shown`, `answer`, `values`, `variant` bilden zunächst weiterhin vier intakte Vorlagen. Die neue Wahl beim Durchgangsstart ist Root-Aufgabe.
- Alle sechs Merle-Aufgaben bilden eine verständliche Handlungskette. „Verwunschen“ entfernt. Bücher sind jetzt **noch in der Schultasche**; die Aufforderung lautet „Fordere sie auf, ihre Bücher herauszunehmen.“. Antwort `Take out your books!` bleibt. Noch kein gesprochenes Merle-Erfolgsfeld in dieser Datei; es steht im gemeinsamen Programmcode.
- Musikanlage und Tablet stehen/liegen im verschlossenen Schließfach. Ihre Karten stellen keine Befreiung eines sprechenden Gegenstandes dar. Das Klassenfoto bleibt die finale verschlossene Erinnerung und fragt weiterhin den bestehenden Satz `It's a picture.`; die Kartenmetadaten benennen die anschließende Klassenübersicht als Darstellungsbedingung.
- Alle 13 Bosskarten gestrafft, ohne den Formenmix zu verlieren. Insbesondere `boss.k5` fragt korrekt nach der nächsten Zahl; das prominente sachlich falsche `promptEn:How many?` und seine falsche Übungszuordnung wurden entfernt. Die Korrekturen/Räder/Reihenfolgen bleiben autorisierte, nachprüfbare Aufgaben.
- Finale „Schreib Hallo auf Englisch auf die Tafel.“; bisherige akzeptierte Antworten hello!/hi/hi! bleiben erhalten. Die spätere Schrift muss deshalb die tatsächliche akzeptierte Eingabe anzeigen, nicht immer hart Hello.

## Farbplan, exakt wie im Gesamtplan

| Karte | Ziel |
|---|---|
| enc.obj-book.r1 | blue |
| enc.obj-schoolbag.r1 | brown |
| enc.obj-desk.r1 | green |
| enc.obj-scissors.r1 | grey |
| enc.obj-gluestick.r1 | orange |
| enc.obj-sharpener.r1 | red |
| enc.eraser.r1 | pink |
| enc.pen.r1 | black |
| enc.heft.r1 | white |
| rsc.chair.r1 | yellow |

Alle zehn Wörter wurden gegen `docs/design/g1/grounding/u01-lexicon.json` geprüft. Neutralfarbige Objekte brauchen die unabhängig sichtbare Tintenverhexung aus dem Gesamtplan. Die Bildmessung des alten Bestands gilt ausdrücklich **nicht** als Nachweis der neuen Zielfarben.

## Prüfung und aktuell erwartete rote Voraussetzungen

JSON lässt sich lesen. Direkter Aufruf von `GameTasksFileV2.safeParse` auf genau diese Datei ergab **Exit 1**, mit **genau einem** Schemaproblem:

```
items[55]
restore may not offer grey — grey is the drained state the card undoes, not a colour to give back
```

Es ist die Scherenkarte. Das entspricht der von Root ausdrücklich übernommenen Änderung des Farb-/Verhexungsvertrags; keine Prüfung wurde von mir abgeschwächt. Der genaue Rohbefund ist [content-schema-result.json](content-schema-result.json). Alle 231 deutschen Zeilen bestehen die reine Längenprüfung, keine Zeile über 56 Zeichen. Das ist noch keine sprachliche oder didaktische Freigabe.

Folgende weitere Fehler sind vor der Integration **zu erwarten**, wurden nicht als bereits grün behauptet:

1. Alte Welt hält den Stuhl noch als `cage/satchel`, nicht `drained/obj_chair`; Bindung, Insassenzahl, Aufgabentyp und Beweisbänder müssen folgen.
2. Neue neutrale Farbwörter sind im alten Messverfahren nicht als einzelne Wiederherstellziele zulässig; grey fehlt auch in der aktiven Farblernklasse. Root besitzt Schema, Policy, Materialmessung und neue Kunst.
3. Weißes Heft, schwarze Feder, roter Spitzer, grüner Tisch und gelber Stuhl passen noch nicht zu den alten Bildern. Die Schere muss nach dem Zauber grau und vorher sichtbar mit Tinte verhexter Gegner sein. Die Tasche braucht eindeutig braunen Stoff.
4. `nounDe.pairs` braucht die neue `obj_chair`-Bindung; die bisherige `nounDe.captives.rsc.chair.r1` und Rettungsfamilie dürfen keine alte Rolle erzwingen. Andere feldspezifische Nomen-/Hinweisregeln müssen die natürliche zweite Frage gegen die neue Autorentscheidung prüfen.
5. Alte Kleidungspolicy erwartet neun Quizkarten und zählt sie in aktive Varietät. Root entfernt den Dritt-Fund-Quiztrigger und weist Lernkontakt über die wirklich gesammelten Wörter nach. Keinen leeren Aufgabenbestand als gelernt zählen.
6. Text `Sag den Namen` wird im derzeitigen CardShell auch noch im Farbschritt unter der Farbfrage gezeigt. Root sollte diesen Namensauftrag im zweiten Schritt ausblenden oder die Stufen getrennt darstellen.
7. Der neue Begriff Tintengeist wird vom bisherigen Mantel-/Identitätsgesetz eventuell nicht als zulässige Beschreibung erkannt. Geheimhaltung des Namens/der Person muss erhalten bleiben, der ausdrücklich gewünschte Beschreibungstausch darf nicht künstlich in unnatürliches Deutsch zurückgedreht werden.

## Bild- und Interaktionsbedingungen der neuen Texte

- Merle `merle_act_books1` zeigt Bücher in der Tasche, bevor die Aufgabe gelöst ist. Vorherige Bücher-am-Boden-Pose passt nicht mehr.
- Die Scherenkarte sagt „Die Schere schnappt nach dir.“, Klebstift und Spitzer „… kommt auf dich zu.“. Diese drei verlangten Angriffe müssen vor Aufruf ihrer Karten wirklich stattfinden.
- Geräteportraits sind Geräte im Schließfach, keine zufällige Tasche/Käfiggrafik. Alte Stimulus-Stems satchel bleiben bis zur gemeinsamen Bildbindung technische Übergänge und müssen in der integrierten Grafikschicht korrekt ersetzt/aufgelöst werden.
- Türkarten mit Schild/Fragekarte benötigen sichtbare Schilder. p3.d1 nennt ein Geräusch hinter der Tür; falls der neue Sound-/Bühnenübergang das nicht trägt, diese Zeile zu „An der Tür wartet eine Aufgabe auf dich.“ ändern. Nicht heimlich ein Geräusch behaupten.
- Zahlenkorridor zeigt Zahlen/Zahlwörter statt einzelner Falterhandlungen. Keine Karte sagt, ein Falter setze sich auf die Schulter.
- Heftkarten `n1/n2` zeigen die zählbaren drei Punkte bzw. zwei Bücher. Der vorhandene Text wird erst zum vollständigen Bildnachweis, wenn die Karte sie sichtbar trägt.
- Boss `k1` beschreibt eine noch vollgekritzelte Tafel. Diese Karte muss vor dem vollständigen Säubern ausgeliefert werden. `k4` stellt eine geschenkte Kreide als Situation dar; ihre Illustration sollte das Geschenk zeigen, nicht dieselbe unbeteiligte Tafelpose.
- Klassenfoto zeigt wirklich die Mitschülerliste der Erzählung. Die anschließende Namensfrage und Fotoübersicht entstehen außerhalb der Aufgabenkarte.

## Redaktionelle Belege

- [content-author-changes.json](content-author-changes.json): **285 Feldänderungen/Entfernungen**, jeweils Karte, Feld, exakter vorheriger und neuer Wert.
- [child-lines-authored-tasks.json](child-lines-authored-tasks.json): alle **231** jetzt sichtbaren deutschen Kartenzeilen mit Quelle und Länge; für das Elternteam zum Zusammenführen mit neuen Regeln/Prolog/Programmtexten vor dem echten frischen Leserpass.
- [literal-content-inventory.md](literal-content-inventory.md): alle 70 ursprünglichen Karten wörtlich, einschließlich entfernter Kleiderfragen.
- [audit-content.md](audit-content.md): umfassender Ursachenaudit, Regel-/Programmsprache und übertragbare Grundsätze.

Keine Behauptung über grüne vollständige Batterie, blinde Leser, fertige Kunst, sichtbare Spielerpfade oder Merge. Fertig ist die beauftragte Kartenredaktion; die genannten Integrationsvoraussetzungen sind bewusst offen.
