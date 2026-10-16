# CODEX DRAFT — NOT CANON
# p4 · Der Löwe, bei dem alle bleiben sollen

**Status: GEBAUT im Labor; bestehender Wächter erreicht guardianDown, Boden-Löwe M-3 ist Datenauftrag.**

## 1 · Auftrag und Raum-Idee

Der Löwe hält die anderen Tiere bei sich, weil er Gesellschaft sucht. Vier Freigaben lösen die Szene; zuletzt lädt das Kind ihn ein. Der Konflikt ist eine Spielableitung aus Löwe und Käfigstäben der Buchseiten, keine zoologische Aussage.

## 2 · Raum-Rhythmus

36 × 20. Hauptbewegung deflect — eine geworfene Stab-Platte mit der Faust zurücklenken. Zwei sichere Seiten und ein zentraler Kampfplatz; keine Tinte oder Sammelpflicht. Der heutige Ersatzlauf benutzt noch die Bewegungs- und Wischfenster des alten Wächters.

Anker beginnen bei 0. (c,r) bezeichnet Spalte und Steh-Reihe; Füße bei (r+1)·16 Pixel. Bei schwingenden Plattformen ist es die Aufhängung. Terrainoberfläche rK trägt Füße bei K·16.

## 3 · Begründungs-Manifest

| id | Was | Anker | Fiktion | Mechanik | Gesetz | Kunst |
|---|---|---|---|---|---|---|
| p4-guardian | Löwe am Tierzaun | **(18,17)** | Er möchte, dass alle bei ihm bleiben. | guardian tier M mit bestehendem Flugautomat; zoo-lion-Runden, Schild, Stabplatten und Finale vollständig als V2-Daten bestellt | guardian-script / exit-reachable | Platzhalter `loewe`; Kunst noch offen |
| spawn-s | Start | **(3,17)** | Das Kind betritt den Raum. | S-Zelle | Erreichbarkeit | Engine |
| exit-x | Ausgang | **(33,17)** | Die Geschichte geht weiter. | X-Zelle | Erreichbarkeit | Engine |

## 4 · Karten und Abdeckung

Acht Boss-Plätze plus Finale, alle Pflicht: D01/D02 Papagei, D03/D04 Affen, D05/D06 Pinguin, D07/D08 Giraffe, D09 Einladung. Formen state-it, fix-it, ask-it und social-formula. Vier verschiedene Bildhandlungen; nur nach je zwei richtigen Karten geht ein Tier heim. Die vollständigen Karten stehen in `ch02.tasks.v2.json`, die Zielverteilung in `coverage.md`. Karten-IDs beginnen mit `g1.paint.ch02.`; im Dossier stehen die lesbaren Plätze A01 usw.

## 5 · Entdeckung und Wirkung

Das linke Podest bietet zuerst eine sichere Sicht. Der Löwe, die Warnung und mindestens eine Reaktionsfläche müssen gemeinsam sichtbar sein; der Raum ist breiter als der Bildschirm. Platte 3 erhält einen Rücklauf nach Bodenkontakt, Platte 4 einen sichtbaren freien Rückwurfkanal mit nur einer aktiven Platte.

## 6 · Bewegungsbeweis

Kandidat und erste Aufnahme Exit 0. Band: 2531 Takte, vier Wächterfenster, neun automatisch gelöste Aufgabenereignisse, guardianDown true, Ausgang done und Schlussseite. Das Band zeigt weiterhin einen Flugweg und zwölf Telegraphen des Bestandswächters. Diese Zahlen sind kein Beweis für acht bestimmte Karten oder vier Löwen-Heimläufe.

Das gespeicherte Band weist 0/0 Sammelstellen, 9 automatisch gelöste Aufgabenereignisse, 0 befreite Käfige und 0 Regelseiten nach. Es endet bei `done`. Die exakte Taktzahl steht im zugehörigen Recorder-Log unter `werkstatt/out/R1/logs/`; rohe Pad-Läufe sind keine gelösten Karten-IDs.

## 7 · Bildbehandlung

Platzhalter sind im Entwurf legal. Die Bildbeschreibungen und stageV2-Daten sind Kunst- und Motorverträge; graue Kästen beweisen weder Tierlagen noch Besucheridentität. Keine visuelle Schülerabnahme behauptet.

## 8 · Offene Motor-Erweiterungen

M-3: Bodenmodus zoo-lion mit vier Platten, eigenem Schildanker, vier Runden zu zwei Karten, festen Tier-Heimwegen, Rücklauf der dritten Platte und einmaliger Einladung. Warnung 60/45/45/45 Takte, Gehen 120 Takte mit 0,6 Pixel/Takt, Platte 2 Pixel/Takt. M-1/M-2 liefern Bilder und gebundene Aufgaben; M-6 die tatsächliche Ereignisfolge. Der Löwen-Skin allein baut diese Funktionen nicht. Die vollständige Feldliste, Typen, Leser und das jeweilige Bestandsverhalten stehen im Labor in `ENGINE_BEDARF.md`.

## 9 · Spielweg für Fable

Start (3,17), rechts vor das erste Podest, SPACE zum Podest c6–8. In den zentralen Raum c10–25 treten; mit dem heutigen Motor den Würfen ausweichen und nach jedem gelösten Fenster den Wächter berühren. Nach guardianDown über das rechte Podest c27–29 springen, X (33,17). Fable prüft in R1b stattdessen vier wirkliche Rückwürfe, je zwei genaue Karten, je einen Heimlauf, D09 und das einmalige Ende.

## 10 · Bau-Vertrag

36 × 20, Decke r0, Boden ab r18. S (3,17), X (33,17). Podeste c6–8 und c27–29 haben Oberfläche r16, stehen also zwei Reihen höher als der Kampfplatz. Löwenanker (18,17), zentraler Bereich c10–25. Vier gemalte Tierhalte sind V2-Bildakteure, keine Zusatzkäfige. Separate Schildfläche loewenschild bei (18,13), Quellmaß 112 × 64 Pixel mit Innenrechteck (8,8,96,48).

THRESHOLD: Keine Tinte, kein Checkpoint, keine Federpflicht. Einziger guardian; vier nummerierte Runden und Finale als Daten. Der Bestandslauf muss guardianDown und done erreichen; der Bodenmodus bleibt bis zum M-3-Ereignisbeweis offen.

Links feuern ausschließlich auf `opened` oder `redeemed`. Keine Links; die Runden-/Heimlaufsteuerung ist im Guardian-Vertrag bestellt.

**Wie geprüft:** echter Raumkandidat und Aufnahme mit anschließender Wiedergabe im bestehenden Motor. Log/Exit/Laufzeit im R1a-Befehlsjournal. Kein Dev-Server, keine neue Kunst, keine Aussage über bereits gebaute Mehrfachszenen oder den späteren Lernfortschrittsnachweis.
