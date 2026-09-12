# CODEX DRAFT — NOT CANON
# p4 · Der Löwe will alle bei sich behalten

**Stand 12.09.2026:** Der Motor ist mit PR #422 gemergt (`161dda05`). Auf dem zugehörigen Prüfkopf `676f0159` waren 74/74 Tore einschließlich der Wiedergabe der eingefrorenen Zoo-Prüfdaten grün. Die neue Inhaltswiedergabe ist im aktuellen `check:level-design` grün; die vollständige PR-B-Batterie und die Bildabnahme stehen aus.

## 1 · Auftrag und Raum-Idee

Der Löwe hält die anderen Tiere bei sich, weil er Gesellschaft sucht. Vier Freigaben lösen die Szene; zuletzt lädt das Kind ihn ein. Der Konflikt ist eine Spielableitung aus Löwe und Käfigstäben der Buchseiten, keine zoologische Aussage.

## 2 · Raum-Rhythmus

36 × 20. Hauptbewegung deflect — eine geworfene Stab-Platte mit der Faust zurücklenken. Zwei sichere Seiten und ein zentraler Kampfplatz; keine Tinte oder Sammelpflicht. Der eingebaute Bodenlöwe öffnet nach einem Rückwurf das zugehörige Kartenpaar.

Anker beginnen bei 0. (c,r) bezeichnet Spalte und Steh-Reihe; Füße bei (r+1)·16 Pixel. Bei schwingenden Plattformen ist es die Aufhängung. Terrainoberfläche rK trägt Füße bei K·16.

## 3 · Begründungs-Manifest

| id | Was | Anker | Fiktion | Mechanik | Gesetz | Kunst |
|---|---|---|---|---|---|---|
| p4-guardian | Löwe am Tierzaun | **(18,17)** | Er möchte, dass alle bei ihm bleiben. | guardian tier M im eingebauten Bodenmodus zoo-lion; Runden, Schild, Stabplatten und Finale als V2-Vertrag | guardian-script / exit-reachable | Platzhalter `loewe`; Kunst noch offen |
| spawn-s | Start | **(3,17)** | Das Kind betritt den Raum. | S-Zelle | Erreichbarkeit | Engine |
| exit-x | Ausgang | **(33,17)** | Die Geschichte geht weiter. | X-Zelle | Erreichbarkeit | Engine |

## 4 · Karten und Abdeckung

Acht Boss-Plätze plus Finale, alle Pflicht: D01/D02 Papagei, D03/D04 Affen, D05/D06 Pinguin, D07/D08 Giraffe, D09 Einladung. Formen state-it, fix-it, ask-it und social-formula. Vier verschiedene Bildhandlungen; nur nach je zwei richtigen Karten geht ein Tier heim. Die vollständigen Karten stehen in `ch02.tasks.v2.json`, die Zielverteilung in `coverage.md`. Karten-IDs beginnen mit `g1.paint.ch02.`; im Dossier stehen die lesbaren Plätze A01 usw.

## 5 · Entdeckung und Wirkung

Das linke Podest bietet zuerst eine sichere Sicht. Der Löwe, die Warnung und mindestens eine Reaktionsfläche müssen gemeinsam sichtbar sein; der Raum ist breiter als der Bildschirm. Platte 3 erhält einen Rücklauf nach Bodenkontakt, Platte 4 einen sichtbaren freien Rückwurfkanal mit nur einer aktiven Platte.

## 6 · Quellband-Erwartungen und Prüfgrenze

Die folgenden Werte sind aus `ch02.proof.json` gelesen: gespeicherte Erwartungen des R1b-Quellbands. Die aktuelle Inhaltsprüfung `check:level-design` hat die Bänder am importierten Kapitel erneut abgespielt und ihre Welt- und Kartenereignisse bestätigt. Sie weist alle 63 Lernziele mit je zwei beantworteten Pflichtkarten nach. Das ist eine Motorwiedergabe mit automatischen Antworten; Browser- und Bildabnahme sind davon getrennt.

Erwartet werden **9 verschiedene Karten-IDs bei 9 Aufgabenereignissen**, 0/0 Sammelstellen, 0 befreite Käfige, 0 Regelseiten und der Ausgang `done`. Karten in Bandreihenfolge: `D01`, `D02`, `D03`, `D04`, `D05`, `D06`, `D07`, `D08`, `D09`.

Szenenbelege: 9; Heimankunftsereignisse: 4; Griffkanten: keine; abgeschlossene Fahrten: keine. Die vollständigen Szenen- und Heimanker stehen unverändert im Quellband.

Arena-Erwartungen: 8 Kartenfenster, 4 Runden (`p4-guardian:1:parrot`, `p4-guardian:2:monkeys`, `p4-guardian:3:penguin`, `p4-guardian:4:giraffe`), Rückwürfe `1`, `2`, `3`, `4`, vier Heimankünfte (`p4-guardian:parrot`, `p4-guardian:monkeys`, `p4-guardian:penguin`, `p4-guardian:giraffe`), `guardianDown:true` und `scorePageShown:true`. D01–D08 gehören zu den vier Kartenpaaren, D09 ist die Einladung. Null Flugwege im Quellband beschreiben den Bodenmodus; eine visuelle Heimwegabnahme folgt daraus nicht.

Historie R1a vom 05.09.2026: Die erste Aufnahme benutzte noch den alten Ersatzwächter. Dessen Flug- und Wischfenster beschreiben weder den heute eingebauten Bodenlöwen noch das aktuelle R1b-Band.

## 7 · Bildbehandlung

Platzhalter sind im Entwurf legal. Die Bildbeschreibungen und stageV2-Daten sind Kunst- und Motorverträge; graue Kästen beweisen weder Tierlagen noch Besucheridentität. Keine visuelle Schülerabnahme behauptet.

## 8 · Eingebauter Motor und verbleibende Abnahme

PR #422 baut den Bodenmodus `zoo-lion` mit vier Plattenrunden, eigenem Schild, gebundenen Kartenpaaren, Tier-Heimwegen, Rücklauf der dritten Platte und einmaliger Einladung. Die Warnzeiten 60/45/45/45 Takte, 120 Takte Gehen mit 0,6 Pixel/Takt und 2 Pixel/Takt für die Platte bleiben der Datenvertrag. Der Ausgang nennt bei gesperrtem Löwen den passenden Kapitelhinweis.

Noch am Live-Inhalt abzunehmen sind vier wirkliche Rückwürfe, je zwei zugehörige Karten, vier sichtbare Heimwege, D09, einmalige Schlussseite und der Ausgang. Die Bildprüfung muss Löwe, Warnung und mindestens eine Reaktionsfläche gemeinsam sehen können und den freien Rückwurfkanal der vierten Runde erkennen. Vorhandene Antwortschlüssel bleiben erhalten; die Grenze frei formulierter Einladungen bleibt Eingabeauftrag.

## 9 · Wegvorlage für die erneute Prüfung

Start (3,17), rechts vor das erste Podest gehen und mit SPACE auf c6–8 springen. Im zentralen Bereich c10–25 müssen Löwe, Warnung und eine Reaktionsfläche zusammen lesbar sein. Die geworfene Stabplatte mit der Faust zurücklenken. In Runde 1 D01/D02 beantworten und den Papagei heimgehen lassen; in Runde 2 D03/D04 und die Affen, in Runde 3 D05/D06 und den Pinguin, in Runde 4 D07/D08 und die Giraffe. Nach den vier Rückwürfen und Kartenpaaren folgt D09 als Einladung. Danach über das rechte Podest c27–29 zum X (33,17); Schlussseite und Ende dürfen nur einmal erscheinen. Das ist der zu prüfende Ablauf, kein neu ausgeführter Rundgang.

## 10 · Bau-Vertrag

36 × 20, Decke r0, Boden ab r18. S (3,17), X (33,17). Podeste c6–8 und c27–29 haben Oberfläche r16, stehen also zwei Reihen höher als der Kampfplatz. Löwenanker (18,17), zentraler Bereich c10–25. Vier gemalte Tierhalte sind V2-Bildakteure, keine Zusatzkäfige. Separate Schildfläche loewenschild bei (18,13), Quellmaß 112 × 64 Pixel mit Innenrechteck (8,8,96,48).

THRESHOLD: Keine Tinte, kein Checkpoint, keine Federpflicht. Einziger guardian; vier nummerierte Runden und Finale als Daten. Der neue Inhaltslauf muss guardianDown und done erreichen; vier Rückwürfe, Kartenpaare, Heimwege und Einladung bleiben am Live-Kapitel zu bestätigen.

Links feuern ausschließlich auf `opened` oder `redeemed`. Keine Links; die Runden-/Heimlaufsteuerung ist im Guardian-Vertrag bestellt.

**Wie geprüft:** Dieses Dossier wurde am 12.09.2026 mit den Namen und gespeicherten Erwartungen aus `ch02.level.json` und `ch02.proof.json` abgeglichen. PR #422 brachte den Motor auf `161dda05`; seine Batterie auf `676f0159` hatte 74/74 grüne Tore einschließlich der eingefrorenen Zoo-Wiedergaben. Die aktuelle Kartenprüfung und die erneute Inhaltswiedergabe sind grün (Trial-Bericht zum Inhalts-PR). Ein neuer Browserrundgang oder Bildtest ist hier nicht belegt. Die vollständige PR-B-Batterie und tatsächliche Bildabnahme stehen aus. R1a-Angaben sind ausschließlich datierte Historie.
