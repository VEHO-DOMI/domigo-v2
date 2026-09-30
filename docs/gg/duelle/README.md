# Duelle: Bestandsaufnahme und Unterrichtsmuster

**CODEX DRAFT — NOT CANON · GEPLANT / Arbeitsstand cgo-018.**
Quellstand: `269ee986ccdc1ae7c3b070cbed7014f20e532365`, ausschließlich Ziel `codex/main`.
Dieser Entwurf verändert keine Spielroute, Bewertung, Konten oder Datenbank.

## Was hier entschieden werden kann

Das bevorzugte kleinste Muster ist **gemeinsam gegen die Aufgabe: zwei Lernende an einem Gerät**. Beide lesen, beraten und wechseln zwischen Eingeben und Erklären. Es gibt keinen Sieger nach Geschwindigkeit und keine neue Punktewährung. Die soziale Lernhandlung kann Koki an einem kurzen lokalen Ablauf beurteilen; ein Mehrspieler-Dienst wäre dafür zusätzliche, hier nicht beauftragte Produktarbeit.

Das ist eine bewusste Eingrenzung des Wortes „Duell“: vorhandene Begegnungen mit Spielfiguren sind keine belegten Wettkämpfe zwischen Kindern. Das gemeinsame Muster bietet eine freiwillige soziale Form; die beiden anderen sozialen Formen sind vollständig als spätere Verträge beschrieben, nicht als bereits gebaut.

- [index.html](index.html): bedienbares **GEPLANTES Textmodell** mit Vorbereitung, Einzelzustimmung, Rollenwechsel, Quellvergleich, Pause und Abbruch.
- [BESTAND.md](BESTAND.md): tatsächliche Einstiege, Aufgabenverteilung, Fehler-/Zeitverhalten und noch offene Spielbelege.
- [SPIELPASS.md](SPIELPASS.md): noch auszuführender Produkt- und Modellpass, mit Gegenproben je Weg.
- [UNTERRICHT.md](UNTERRICHT.md): drei Abläufe, Rechte, Abbruch und fachliche Abnahme.
- [quellen.json](quellen.json): vollständige Kennungen der acht Spiel-Seitentypen, 199 Paint- und 59 Keen-Karten sowie sechs Entscheidungsszenen aus allen gefundenen Storydateien. Enthaltene Wege sind nicht pauschal veröffentlicht oder gespielt.

## Grenzen und offene Abnahme

**UNVERIFIZIERT:** tatsächliche Bedienung der Produktwege, deren Bilderfolge, Smartphone/Touch, dauerhafte Speicherung, Verhalten im Klassenunterricht und Gestaltung durch Koki. GG hat in Nachtrag 2 ausschließlich neue lokale synthetische Schüler-/Lehreridentitäten freigegeben. Der dafür beauftragte echte lokale SQL-Speicherprüfstand aus cgo-009 ist noch nicht als fester Helferstand übergeben. Getrennte Rollenläufe und eigene Datenwurzel sind Pflicht; dies belegt keine echte Konto-Anmeldung. Installation, Build (Erzeugen der ausführbaren App), Pflichtbatterie (vollständiger Satz vorgeschriebener Prüfungen) und große Browsermatrix (systematischer Gerätedurchlauf) warten auf ausdrückliche Zuteilung des schweren Prüfplatzes. Es gibt noch keine Review-Freigabe.

Die eingefrorenen W0-Dateien aus `9d78767323ea207bc56ba72212953a3163418c0e` sind vorläufige Referenz. Die beiden Leser beanstandeten p019; daraus folgt keine Annahme des gesamten Satzes. Vor Übernahme muss GG das **dann aktuelle** Ergebnis der Musterprüfung (cgo-006), die Herkunftsmatrix (cgo-025) und das tatsächliche Lookurteil abgleichen. Die Quellenprüfsummen bestätigen nur Dateigleichheit. Sie ersetzen weder Fachurteil noch Unterrichtserprobung. Der bereits integrierte FOURTEEN-Code ist kein Koki-Look-Ja.

Alte Reviewkorrekturen und Lernhandlungen bleiben erhalten. Persönliche Sammlung, Wortindex, Hilfen und Lernstandsbezug gehören weiter zum Gesamtprogramm; dieses Dokument implementiert sie nicht und erklärt sie nicht für erledigt.

## Lokales Modell öffnen

**Erst nach GG-Prüfplatzzuteilung (Nachtrag 2 untersagt vorher auch Serverstart).** Vom Projektordner: `python3 -m http.server 8418 --bind 127.0.0.1 --directory docs/gg/duelle`, dann `http://127.0.0.1:8418/` öffnen. Nur die Dokumente werden ausgeliefert; kein Produktserver, keine Datenbank, kein Installieren. Mit Strg+C beenden. Die Ansicht lädt zwei unveränderte Originalkarten aus `muster-daten.json`. Originale Reize werden als Text beschrieben; fehlende Weltbilder sind eine ausdrücklich benannte Grenze. Das Modell zeigt die Quelllösung zum gemeinsamen Vergleich und führt keine eigene automatische Sprachbewertung aus.

`modell.mjs` enthält ausschließlich den lokalen Ablauf und seine Eintrittsbedingungen. Asynchrone Teilnahme und zwei vernetzte Geräte sind dort nicht simuliert. Alle Zustände liegen nur im Arbeitsspeicher des Browserfensters; weder Neuladen noch ein zweites Fenster setzen die Übung fort.
