# Chapter 1 · ein Wort und eine Kurzform

**CODEX DRAFT — NOT CANON · cgo-032 · Lehrer-Muster.**

Dieses Muster ersetzt die didaktisch abgelehnte Fassung von cgo-007. Deutsch führt durch die Aufgabe; Englisch wird gezielt eingeführt und verwendet. Ein Buchbild trägt die Wortbedeutung und den Farbkontext. Erst Wortkarte, dann freie Worteingabe, danach ein erklärtes Satzbeispiel und eine eigene Kurzformauswahl. Das ist ein begrenzter Lernweg, keine Prüfung und keine Serienvorlage.

## Lokal starten

Node 24 genügt; keine Installation erforderlich. Ausgabe immer außerhalb des Produktrepos. Den Port vorher auf freie Belegung prüfen; fremde Prozesse nicht beenden.

```sh
node docs/gg/mockup/build.mjs --out /Users/veho/Code/_codex/cgo-032-evidence/preview
node docs/gg/mockup/serve.mjs --no-build --out /Users/veho/Code/_codex/cgo-032-evidence/preview --port 4198
```

Danach `http://127.0.0.1:4198`. Der Server bindet ausschließlich an diesen Rechner. Beenden mit Strg+C. Nach Quelländerung neu bauen und Server neu starten. Die alte GG-Vorschau auf 4197 bleibt unberührt. Ein lokaler Link allein ist keine Musterübergabe: GG liest den fertigen Weg und stellt ihn erst nach den unabhängigen Prüfungen für Koki bereit.

## Inhalt und Quellen

[Quellenpass und Lernvertrag](../pedagogy/chapter-1-sources.md) dokumentiert 18 selbst gesehene Originalseiten, Bildfunktion, Sprachvoraussetzungen, Varianten und Herkunft. [DomiLingo-Lehren](../pedagogy/domilingo-lessons.md) trennt historische Befunde von neuen Prüfungen. [Anforderungszuordnung](../pedagogy/requirements.md) benennt Umsetzung, Prüfung und verbleibende Grenzen.

Die Originalitems `g1u01.w.book` Revision 2 und `g1u01.gi.contractions.mc.006` Revision 1 sowie ihre vollständigen Schlüssel sind unverändert. Die neue freie Bild-/Übersetzungseingabe und die kontextgestützte Kurzformauswahl haben eigene Musterkennungen. Sie sind keine still geänderten Originalrevisionen. Die Auswahlwerte der Grammatik bleiben vollständig erhalten. Der lokale Bewerter ist ausdrücklich kein neuer Produktbewerter.

Wortkarte und Satzbeispiel zeigen Antworten **absichtlich zum Lernen**. Die Hilfsfolge ist eine aufrufbare Bedeutungsstütze, Anfangsbuchstabe, Wortlänge, danach bewusst aufgerufene Wortkarte. Sie ist nur für diesen Lernweg gebaut, nicht für Checkups oder Prüfungen. Fehler lassen die Eingabe sichtbar; die Hilfe öffnet einen erneuten Eingabeversuch. Es gibt keine Punkte oder automatische Behauptung langfristigen Könnens.

## Texte und Zustände prüfen

```sh
node docs/gg/mockup/inventory.mjs --write
MOCKUP_CHECK_PORT=4199 node docs/gg/mockup/check.mjs --no-build --out /Users/veho/Code/_codex/cgo-032-evidence/preview
```

`copy.mjs` enthält die verfassten Texte mit Sprachfunktion und Buchbezug. `render.mjs` erzeugt dieselben Ansichten für Browser und Prüfskript. `inventory.mjs` sammelt die tatsächlich in diesen Renderwegen verwendeten Texte, ergänzt Browser-/Rahmenzustände und Originaloptionen und schreibt [student-texts.json](../pedagogy/student-texts.json). Das Prüfskript verlangt die byteinhaltliche Übereinstimmung dieser dauerhaften Liste mit dem aktuellen Code. Benutzerantworten/Notizen sind variable Nutzereingaben und keine Autoren-Schülertexte.

Die Inventur zählt technische Textabdeckung, **nicht** Verständlichkeit oder natürlichen Stil. Auch seltene Fehler- und Speicherzustände gehören zum Browserpass. Die tatsächlichen Ergebnisse, Bildschirmbilder, Fingerprints und Gegenproben werden am finalen Kopf im PR und auf der Karte belegt, niemals als Rohlogs im Repo.

## Unabhängige Aufgabenprüfung

Der Build erzeugt zwei getrennte Dateien außerhalb der HTTP-Auslieferung:

1. `solver-word.public.json`: nur freie Wortaufgabe mit neutraler Kennung plus neutrales `assets/object.png`; keine vorangegangene Wortkarte.
2. `solver-grammar.public.json`: nur Kurzformaufgabe mit allen unmarkierten Auswahlwerten.

**Zuerst das Wortpaket lösen und Antwort festhalten, danach das Grammatikpaket geben.** Der spätere Satz enthält das Wort book; ein gemeinsames Paket würde die Wortantwort verraten. Die Löser erhalten weder diese README, Schülertextinventur, Code, privates Paket noch Autorbewertung vor ihrer Lösung. GG organisiert die unabhängigen Sitzungen. Dieser Lösetest kann die beiden Formulierungen prüfen, aber keine Wirkung der vorherigen Lerneinführung belegen. Dafür ist ein eigener vollständiger didaktischer Quellen-/Ansichtspass nötig.

Die Lehrer-Vorschau ist keine sichere Prüfungsumgebung: Lehrerschalter können absichtlich Lösungen darstellen, Beispiele zeigen die Lernziele. Das private Paket, Schlüssel, Quellen und Löserdateien werden vom statischen Server trotzdem nicht ausgeliefert. Öffentliche Dateinamen stehen in einer festen Positivliste; veränderte Builddateien werden abgewiesen.

## Speicherung und Wiederöffnen

Ansicht, Eingabe, ausdrücklich gespeicherte Notiz und unbestätigter Notizentwurf liegen nur im Speicher dieses Browsers. Ein anderer Port/Browser ist ein anderer Speicherort. Entwurf und bestätigte Notiz bleiben unterscheidbar. Bei ungespeicherter Notiz oder lokalem Fehler wird `beforeunload` angefordert; Browser, insbesondere Mobilgeräte, können den Dialog unterdrücken. Der Entwurf ist deshalb zusätzlich wiederherstellbar. Vorhandene Antworten werden beim Wiederöffnen neu bewertet, gespeicherte Richtig-/Falsch-Markierungen nicht geglaubt.

Der Lehrerschalter für Lernspeichern stellt Warten/Fehler/Erfolg nach und ist davon unabhängig. Keine Datenbank, kein Konto und keine Produkt-Lernspur. Beim Warten keine aktive Abschluss-/Wiederholungsaktion. Notizfehler- und Antwortprüfungsfehler-Schalter sind ausdrücklich gekennzeichnete Bedienproben.

## Erhalten und bewusst geändert

Heftblatt, Rand, eine Aufgabenkarte, Fredoka für Bedienung, das unveränderte Buch und Klecks bleiben erhalten. Das Buch hat 631 × 471 PNG-Pixel; HTML-Abmessungen ersetzen keinen Bildnachweis. Georgia bleibt Systemersatz für die im Repo fehlende Literata. Keine neue Kunst und keine neuen Abhängigkeiten.

Geändert: deutsche Orientierung, sichtbares Chapter 1, konkrete Ziele, Einführung vor Abruf, freie Worteingabe statt zweier Auswahlaufgaben, aufgabenspezifische Fehlertexte, ausdrückliche Variantenbehandlung und vollständige Text-/Quellenbindung. Klecks begleitet nur die Erklärung; das Buch erklärt den Gegenstand. Die vier Produkt-Vokabelpools und anderen Grammatikformate bleiben unangetastet. Persönliche Sammlung, Wortindex, Langzeitwiederholung und andere Jahrgänge bleiben außerhalb des Zauns.

Keine neuen Paint-Spielphasen, kein Produkt-Renderer geändert. Dateigewichte und tatsächliche Musterbilder sind messbar; Spiel-fps, Klassenlast, reale Touchgeräte, Aussprache/Hören und produktive Speicherung werden hier nicht behauptet. Unabhängige fachliche Prüfung, technische Integration und Kokis Urteil sind getrennte Schritte.
