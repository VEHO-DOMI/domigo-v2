# CODEX DRAFT — NOT CANON

Die drei feindlichen Gegenstände Radiergummi, Füllfeder und Heft haben nun je eine verbindliche bestehende `taskSequenceV2`. Auf die passende erste Karte (eraser.k1, pen.k1, heft.n1) folgt jeweils die tatsächliche r1-Farbrückgabe. Die verbleibende Karte k2/k2/n2 ist danach wiederholbar und optional. Der Radiergummi fordert die Satzwahl, die Füllfeder „Wie geht es dir?“, das Heft die vorhandene Zahlenaufgabe. Änderungen ausschließlich in den drei params-Blöcken der ch01.level.json; restorationDe und alle fremden Änderungen erhalten. Keine Sim-/Entity-/Scene-/PaintGame-Änderung erforderlich.

Nach der ersten Antwort ist die Figur freundlich, jedoch weder `redeemed` noch `completedSequences`; kein `entityResolved` wird ausgelöst. Die zweite Ansprache bietet die unverändert vollständige Name-und-Farbe-Karte. Später und ein serialisierter Ausflug in die Bonusphase erhalten den offenen Farbschritt. Erst dessen tatsächliche Lösung löst das Objekt einmalig auf. Ein erneuter Aufruf der ersten oder zweiten Antwort kann die Sequenz nicht überspringen oder doppelt abschließen. Anschließende Varianten führen zu keinem weiteren `entityResolved`.

## Eigener Testvertrag

`packages/game-paint/src/ch01-restore-sequence.test.ts` enthält sechs neue Tests. Drei benutzen die vollständige echte Kapitel-Sim mit einem ausdrücklich benannten Warp-Zugang zum jeweiligen Gegenstand, danach echte Pfeil-nach-oben-Anfragen und den gebundenen Kartenrouter samt Kartenmaschine. Sie prüfen die zwei Schritte, gefälschte/redundante Antworten, Später, serialisierten Raumwechsel und zweimalige optionale Wiederholung. Drei weitere spielen ausschließlich die tatsächlichen aufgezeichneten Tastenbänder ab und verlangen die beiden konkreten Karten-IDs in der richtigen Reihenfolge; keine Warp-Verwendung in diesen drei Prüfungen. Somit ersetzt der bequeme Zugang im isolierten Wiederholungsfall keinen Erreichbarkeitsbeweis.

Negative Proben in einer isolierten Kopie: jede der drei Sequenzen einzeln entfernen, Farbschritt optional machen, zusätzliche Variante vor den Farbschritt schieben, vorzeitiges redeemed im echten Sim setzen, Lernzustandsübernahme entfernen. Sieben von sieben werden rot; unmodifizierte Kopie grün. Skript und Ergebnisse `restore-tampers.mjs`, `restore-tamper.json`, Einzelprotokolle. Die Negativproben verändern keine Arbeitsdateien. Die ersten neuen Bandtests waren vor Anpassung der Tastenschritte dreimal rot (`restore-sequence-first.log`).

## Tastenbänder

`ch01.pilots.mjs` nutzt ausschließlich bestehende Befehle. p1 spricht nach der Grubenlandung bei Spalte 47,1 den Radiergummi ein zweites Mal an. p2 hält schon bei Spalte 9 an und spricht die Füllfeder vor der Landung erneut an. p3 kehrt nach dem unteren Abstieg zehn Takte nach links zurück und spricht das Heft zweimal an. Ein erster Versuch hatte p2 außerhalb der Reichweite angesprochen und p3 gegen die Wand laufen lassen; die verworfenen Aufnahmen bleiben als `restore-trace-talk1.log` nachvollziehbar. Die finale Aufnahme benötigt keine solche Wartezeit.

Alle fünf Bänder mit dem echten Recorder neu aufgenommen und durch denselben offenen Replay-Pfad wie CI grün geprüft. `ch01.proof.json` enthält die gemessenen Antworten; keine Mindestanforderung gesenkt. Finale Werte:

| Phase | Takte | Aufgaben | Buchstaben |
| --- | ---: | ---: | ---: |
| p1 | 706 | 4 | 9/9 |
| p2 | 992 | 14 | 9/9 |
| p3 | 704 | 4 | 9/9 |
| p4 | 3533 | 5 | 0/0 |
| p9 | 498 | 0 | 12/12 |

Merle wacht weiterhin in p2 auf; alle sieben vorhandenen Story-/Begleiterprüfungen und die vier bestehenden Zoo-Sequenztests bestehen. `restore-sequence-final.log`: 17/17 Tests, Exit 0. `restore-tapes-final.log`: fünf grüne Bänder, Exit 0. `restore-typecheck-final.log`: Pakettypprüfung Exit 0 nach expliziter Typverengung der Entity-Testanfrage; erste Typprüfung hat den zu allgemeinen Test-Helfertyp korrekt abgelehnt.

Gesamtes Aufgabentor separat geprüft: Exit 1, ausschließlich zwei parallel neu eingeführte Geräte-Portraitfehler (`device_locker_a` zu satchel bei soundsystem/tablet); Root gemeldet. Keine durch diese Sequenzen verursachten Inhaltsfehler. Bericht `restore-game-tasks.log`. UI- und Grafikprüfung ist ausdrücklich eine getrennte noch folgende Bahn. Keine Commits.

Nachtrag zur neuen Tafelgrafik: Root hat die tatsächlich sichtbare Wischreichweite von 45 auf 41 Pixel korrigiert. p4 darauf neu aufgezeichnet, unverändertes Pilotprogramm: 3535 Takte, weiterhin fünf Aufgaben, alle Wächter- und Fotobelege grün. `restore-p4-new-slate-reach.log`, aktueller Proof enthält diese Aufnahme.
