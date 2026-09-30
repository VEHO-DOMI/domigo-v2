# cgo-032 · Umsetzung und Prüfbarkeit

**CODEX DRAFT — NOT CANON.** Diese Zuordnung beschreibt, wo Anforderungen geprüft werden. Bestanden/fehlgeschlagen steht mit Kopf, Exitcode und Bildbeleg im tatsächlichen PR-/Boardbericht; ein Plan oder eine Selbstprüfung ist keine unabhängige Freigabe.

| Regel | Umsetzung | Eigene Prüfung / wirksame Gegenprobe | Grenze |
|---|---|---|---|
| A1 / G1 Quellen zuerst | `chapter-1-sources.md`: 18 Bildseiten, Druck/PDF getrennt, Reihenfolge und Sprachstützen | Original-PDF/PNG-MD5, eigene Sichtnotizen; Quellenpin-Abweichung verweigert den Musterbau | Audio/Video nicht konsumiert; keine anderen Chapter/Jahrgänge |
| A2 deutscher, eigenständiger Lernweg | `copy.mjs`, `render.mjs`, deutsche Rahmen-/Fehler-/Bedientexte; Chapter 1 | vollständige Texte aus Renderwegen, Browserdurchlauf Einstieg bis Wiederholung | natürlicher Stil und Altersangemessenheit bleiben fachlich zu lesen |
| A3 Format und Herkunft | `build.mjs` kopiert volle Originale unverändert; zwei neue Musterkennungen; Schreiben versus Auswahl in `render.mjs` | `check.mjs`: Original-/Schlüsselgleichheit, Wortvarianten und alle vier Grammatikwerte; schlüsselfreie Pakete getrennt | lokale Musterbewertung, kein Produktbewerter; zwei Beispiele sind keine Formatvollabnahme |
| A4 vollständige Wege | leere Eingabe, falsche Antwort, Hilfen, Variante, Prüfungsfehler, Wiederholen, Zurück, Einstieg, Warten/Fehler/Erfolg und Notizentwurf | Zustandsinventur plus tatsächliche Browserbilder, Tastatur, Wiederöffnen; fehlender Text und unterbrochene Speicherung als Gegenproben | Browserwarnungen sind geräteabhängig; Simulation ist keine Lernspur |
| A5 Funktion des Bildes und Gestaltung | gepinntes blaues Buch für Bedeutung/Farbe; Klecks an Erklärung; Heft und Fredoka | Bild selbst gelesen, PNG-Abmessungen; Sichtprüfung 390/1440, hell/dunkel/reduzierte Bewegung; überlange Überschrift muss Geometrieprobe stören | kein Koki-Lookurteil, kein neuer Bildauftrag, keine echte Touchhardware |
| A6 dauerhaftes Autoren-/Prüfmuster | Quellenmatrix, DomiLingo-Matrix, `student-texts.json`, diese Zuordnung | Register wird aus aktuellem Renderer gewonnen und gegen die gespeicherte Datei verglichen | Maschinen zählen Bindung/Abdeckung, nicht Sprachqualität |
| G2 Bau und Kopien | externer Build, feste öffentliche Dateiliste, private Antworten, Implementierungs-/Datei-Fingerprints | Quelländerung, öffentliche Reizänderung, fehlender Zustandstext, Schlüssel-Auslieferung; ausschließlich eigene gesicherte Bytes zurücknehmen | keine sichere Prüfungsumgebung im Lehrersimulator |
| G3 Schülerpass | reales Browserfenster, beide Breiten; Szenenauswahl aus tatsächlichem Modell; eigener normaler Weg zusätzlich | jede Modellansicht, sichtbarer Fokus, Buttons, Antworterhalt; Bildschirmbilder und MD5 extern | keine Gleichsetzung von nachgestelltem Zustand und selbst erspieltem Weg |
| G4 fachliche Selbstprüfung | deutsches Wortziel vor Kenntnis der Lösung verständlich; Buchbild, blue-Einführung, klare Ersetzung it is; konkrete Varianten | Text für Text, Frage/Reiz/Bild/Antwort/Hilfe zusammen; Wortpaket vor Grammatikpaket, um Vorwegnahme zu vermeiden | frischer Quellenleser und unabhängiger Löser werden erst vom GG beauftragt |
| G5 Pflichtbatterie | Liste aus package.json genau des fertigen Kopfs | nur nach ausdrücklich gebundener GG-Zuteilung; Installation, build/typecheck/lint/test und alle check:*/test:*; erster unerwarteter Nichtnull stoppt | technische Null ersetzt keine didaktische Annahme |
| G6 Übergabe | ein PR gegen codex/main, vollständige Pins und Belege | Dateizaun und Kopf frisch prüfen; danach Board review + eine direkte GG-Nachricht | Autor mergt nicht; keine neue Koki-Vorlage vor GG-/Leserpass |

## Fachliche Selbstprüfung des Entwurfs

- Ein Anfänger muss kein englisches Menü verstehen. Wortkarte erklärt **book**, Satzkarte erklärt **blue**, das Satzpaar und den Apostroph vor der Anwendung.
- Die Abrufseite nennt „Buch“ und zeigt dieselbe Bedeutung; sie druckt kein englisches Zielwort, auch nicht im Alternativtext. Sie fordert das gelernte einfache Wort. Das dekorative Buch wird nicht als exercise book bezeichnet.
- Bei `a book` und `the book` wird das richtige Wort anerkannt. Bei `books` wird die Mehrzahl erklärt. `textbook`/`English book`/`exercise book`/`notebook` werden als verwandte Benennung gewürdigt, jedoch nicht als Erinnerung an das gelernte einfache Wort gezählt. Andere freie Synonyme werden nicht umfassend klassifiziert: konkrete offene Prüflücke für den unabhängigen Löser.
- `That's a book.` wäre ein grammatischer Satz. Der Auftrag verlangt daher ausdrücklich die Kurzform **von It is**, nicht irgendeinen passenden Satzanfang. Die Rückmeldung benennt diesen Unterschied. Auswahl weist Erkennen/gestütztes Übertragen nach, keine freie Satzproduktion.
- Erste Wortkarte und Satzbeispiel sind absichtlich gelöst. Aufgerufene Hilfen zählen als Hilfe. Der gesamte Weg ist Lernen; eine spätere Prüfung braucht einen eigenen Vertrag.
- Keine Aussagen „beherrscht“, „gelernt für immer“ oder echte Lernpunkte. Wiederholung beginnt mit dem selbst geschriebenen Wort. Sie weist keine zeitlich verteilte Wiederholung nach.
