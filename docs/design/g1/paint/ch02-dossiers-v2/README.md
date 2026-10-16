# CODEX DRAFT — NOT CANON
# ch02 · Kapitel-Bilanz R1a

**Status: fünf Räume gebaut und aufgezeichnet, 72 Karten ausgeschrieben und lokal committet. Karten-, Sprach-, Register- und Dossiertore grün. Gesamtsuite: 1692 bestanden, 1 Rampenprüftest rot. Draft-Probe: 1700 bestanden, 2 Rampenprüftests rot; Entwurfsstatus exakt wiederhergestellt. Kunsttor im Entwurf grün. Die vollständige Lernfolge und Löwen-Choreografie bleiben Motorauftrag.**

Grundlage: R0-Memo §2 im Werkstatt-Labor; R1a baut Inhalt und kompatible Daten. Ausgänge sind mit dem bestehenden Motor erreicht. Keine Kunst- oder Oberflächenabnahme; alle Bilder bleiben Platzhalter. Dieses Dokument ist eine unabhängige Laborfassung für Fables Übernahme, kein Produktionsstand.

## §Käfig-Zensus

| Phase | Wesen / Anker | Inhalt | Bauzustand |
|---|---|---|---|
| p1 | Ticket-Käfig `p1-cage2` (11,10) | Ticket | Befreit im Band; A15/A16 bestellt |
| p2 | Zug-Käfig `p2-cage-zug` (32,10) | Gemalte Zugvignette | Befreit im Band; B18/B19 und Übergabe zum Fahrkörper bestellt |
| p3 | Stein-Käfig `p3-cage-stein` (39,17) | Stein | Befreit im Band; C13/C14 bestellt |
| p2 | Fenn-Käfig `p2-cage-fenn` (50,17), Fenn (51,17) | Einziges Klassenkind | Sechs Runden abgeschlossen; Fenn ist farbig und geht herum |
| p1 | Versiegelte Nische c29–32/r6–8 | Nur eine spätere Bildandeutung | Kein Wesen, kein Käfigzähler, kein Pflichtweg |
| p3 | Versiegelte Nische c35–37/r4–6 | Baum-Setzling als spätere Bildandeutung | Kein Wesen, kein Käfigzähler, kein Pflichtweg |

**3 Sachkäfige + 1 Personenkäfig = 4 echte Käfige.** Arena-Tiergruppen sind Bühnenakteure, keine zusätzlichen Käfige. Im Fenn-Band ist `awakenStep:6`, `redeemed:true`, `state:roam` gemessen. Der alte Zähler `classmatesAwake` meldet dort 0, weil er den gültigen Gehzustand übersieht; das ist unter L2-W als D-neu offen.

## §Abdeckung

| Raum | Karten | Pflicht | Varianten | Sammlung im letzten Band |
|---|---:|---:|---:|---:|
| p1 · Die Spur über den Gehegen | 20 | 14 | 6 | 21/21 Federn |
| p2 · Der Bus voller falscher Plätze | 25 | 18 | 7 | 23/24 Federn |
| p3 · Über den Köpfen des Zoos | 18 | 15 | 3 | 18/22 Federn |
| p4 · Der Löwe, bei dem alle bleiben sollen | 9 | 9 | 0 | 0/0 |
| p9 · Die Blasen im Aquarium | 0 | 0 | 0 | 12/12 Blasenplätze |
| Gesamt | **72** | **56** | **16** | **79 Sammelstellen im Kapitelentwurf** |

`claims.json` klassifiziert ausschließlich die 14 Word-File-Einträge: acht Parkwörter (davon fünf Tierwörter) und sechs Ortswörter. Das vollständige Zielregister steht in [coverage.md](coverage.md): **52 Masterlisten-IDs plus elf Zusatzlernziele, je zwei verschiedene Pflichtkarten und ein benannter Reserveabruf**. 21 Reserveabrufe verwenden bewusst eine der zwei Karten erneut; keine dritte verschiedene Anwendung behauptet. Die 72 Karten tragen echte Texte, Schlüssel, Hilfen und Quellenbezug; keine ungelösten Karten-Platzhalter.

Die zugelassene Feldpalette ist choice/restore/spell/match/order. mistake und typed bleiben Boss/Finale. Neun erklärte Familien ersetzen die alte großzügige Ausnahmenliste; jede fordert eigene Aufträge/Antworten oder eigene Farbzeilen. `vocabLedger` ist leer: alle 52 IDs stehen auf beantwortbaren Feldkarten. Das Kartentor prüft diese deklarierte Antwortabdeckung; erst M-6 kann die tatsächlichen Lösungen eines vollständigen Laufs zählen.

## §Regel-Seiten-Budget

| Seite | Phase / Anker | Sichtbarer Inhalt | Reihenfolge |
|---|---|---|---|
| Park-Plakat | p1 (5,17) | there is / there are; vier Parkbeispiele | Vor A01 und den Zählbildern |
| Ortswörter | p2 (5,17) | Alle sechs Ortswörter in drei Bildgegenüberstellungen | Vor B06/B07; p1 bestellt eigene Lehransichten je Auto-Halt |
| Kurzformen | p2 (41,17) | I'm / you're / he's / she's / it's / we're / they're in vier Vergleichszeilen | A08/B08 vorher Vollformen; Pflicht-Kurzformen erst B12/B16/C07/C09/C11/C12/D09 |
| Pronomen | p3 (6,10) | he / she / it / they / we, vier Beispielzeilen | Vor C09/C11/C12; Fenns Ich-/Wir-Sprecher schon über Pass und Gruppenbild gebunden |

**4 echte Seiten, `tipsTotal:4`.** `lehrtEn` nennt je höchstens vier exemplarische Formen, wie das bestehende Datenformat verlangt. Alle sechs Ortswörter und sieben Kurzformen stehen trotzdem vollständig in den sichtbaren Beispielen. Die kleinen Lehransichten vor den Autoaufgaben sind Teil der Bühne, keine fünfte Regelseite. Ihr Leser gehört zu M-1 und ist noch nicht gebaut.

## §Anker und Bewegung

| Phase | Schwelle | Sicherer Anker | Nachgewiesene Bewegung |
|---|---|---|---|
| p1 | Tinte c59–60 | C (58,17) | Drei echte Griffe, anschließend 77 Wagentakte |
| p2 | Tinte c45–46 | C (44,17) | Griff, Dachsteg, trockener Unterweg, zwei 45°-Rampen, 113 Wagentakte |
| p3 | Tinte c48–49 | C (47,17) | Beide Äste, beide Fallschilder, trockene Fangwege, zwei Schlussgriffe |
| p4 | Keine Tinte | Kein C | Zwei Podeste, vier Fenster des Bestandswächters, Ausgang done |
| p9 | Keine Tinte | Kein C | Zwei Sprungbögen, fünf Plattformen, 12/12 in 462 Takten |

Alle fünf Aufnahmen enden ohne Tintenberührung oder Zurücksetzen. Der p2-Rampenprüfer ist **BLOCKIERT**: Er misst die Pflichtdecke statt der lokalen Bodenanschlüsse. Die Geometrie behält beide Rampen und die Decke. Die unabhängige Gegenprobe und drei Fehlversuche stehen im R1a-Journal.

## §Status und Übergabe

Die Dossiers [p1](p1.md), [p2](p2.md), [p3](p3.md), [Arena](arena.md), [Aquarium](p9.md) tragen jeweils §3-Manifest und §10-Bauvertrag mit THRESHOLD-Zeilen. [pending.md](pending.md) nennt den verbleibenden Motor-/Kunstauftrag. Die Laborlieferung enthält `KETTE_R1A.md`, `ENGINE_BEDARF.md`, `BAUBERICHT_R1A.md`, Prüfberichte und den Patch gegen `baseline`. Fable übernimmt über seine eigene Prüfung; Codex verändert keine Produktionsoberfläche.

Kapitel 1: alle fünf Ausgänge erneut grün; Originalband bytegleich erhalten. Die Neuaufnahme hat zwei bekannte Laufdauer-Abweichungen (D-851); ihr Diff liegt separat im Labor. Aquarium-Timeout genau einmal bei Takt 1919 (32 Sekunden einschließlich Nachsicht); Rückkehr über gespeicherte IDs erhält Fenn mit sechs abgeschlossenen Runden sowie Hund/Affe. Das ist eine Motorprobe, kein gerenderter Rundgang durch die Oberfläche.
