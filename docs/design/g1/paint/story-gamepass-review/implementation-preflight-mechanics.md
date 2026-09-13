# CODEX DRAFT — NOT CANON

## Tatsächlicher Fehler und enge Motoränderung

Die neue schmalere Tafel benötigt 41 px Berührungsweite, andere Guardians weiterhin 45 px. Der vorhandene Kontaktprüfer unterschied bereits nach Bildkörper, die Körperklammer in Sim benutzte jedoch die auf 41 gesenkte Konstante global. Damit konnten andere Bossfiguren vier Pixel tiefer betreten werden. Root gab genau diese Sim-Korrektur nach Quellbefund frei.

`entities.ts`: `guardianWipeReachPx(skin)` vereinigt die bestehende Auswahl (tafel 41, sonst 45). Sowohl `inWipeReach` als auch `sim.ts:clampOutOfWipe` verwenden dieselbe Auswahl; die Klammer liegt unverändert einen Pixel innerhalb der Kontaktweite. Keine Geschwindigkeit, Wartezeit, Schadensmechanik oder Spielaufzeichnung geändert. `player.ts` blieb unverändert.

## Teständerung: dismiss-resumes.test.ts

Der bisher als Trefferzähler bezeichnete Wert zählte ausschließlich Nicht-Guardian-Aufgabenkarten. Kokis neuer Vertrag entfernt genau solche erzwungenen Kreide-Karten in ch01, deshalb war der Zähler null trotz realen Rückstoßes. Die aktualisierte Vorrichtung misst einen tatsächlichen Anstieg der Kontrollsperre am Spielerzustand direkt nach dem Simulationstick und prüft zusätzlich die seitliche Rückstoßgeschwindigkeit. Aufgabenereignisse werden getrennt gezählt; der Regressionstest verlangt reale Treffer größer null und erzwungene Trefferkarten genau null. Die bestehenden Gewinn-/Nichtfeststeck-Prüfungen und ihre 20000 Ticks bleiben unverändert.

Echte isolierte Negativproben: `chalk-no-recoil` entfernt den Kreiderückstoß, `chalk-forces-card` bringt die verbotene Kreidekarte zurück. Beide werden rot. Der unveränderte Originaltest wäre beim fehlenden Rückstoß weiterhin auf eine Kartenanzahl angewiesen gewesen; der neue prüft die tatsächliche Mechanik.

## Teständerung: player.test.ts

Die bisherige Weggeh-Vorrichtung startete 96 px vor der Tafel und kam nach ihren 40 Ticks nur auf 43,375 px Abstand. Ihre alte Erwartung unter 46 px war grün, ohne die ursprüngliche 44-px-Klammer überhaupt erreicht zu haben. Bei der neuen 40-px-Klammer wurde dieser blinde Fleck sichtbar. Der Spieler startet jetzt eine Kachel vor der echten Kontaktweite; die 40 Ticks sowie 20 Weggeh-Ticks bleiben unverändert. Keine Toleranz oder Wartezeit erweitert.

Zwei zusätzliche konkrete Regressionen setzen einen sich bewegenden Spieler knapp innerhalb der Körperkante der Tafel und des tatsächlich in Kapitel zwei vorkommenden Löwen. Ein echter Simulationstick muss ihn auf genau 40 bzw. 44 px begrenzen, die Geschwindigkeit nach innen entfernen und zugleich den tatsächlichen Wischzustand erreichen. Kein reiner Test der Hilfsfunktion.

Echte isolierte Negativproben: fehlender Klammeraufruf, global 40 px auch beim Löwen, sowie eine Klammer, die selbst beim Weggehen festhält. Alle werden rot. Damit werden Eindringen, Crosschapter-Auswahl und sicherer Rückweg getrennt geschützt.

## Teständerung: entities.test.ts

Zwei alte Merle-Prüfungen erwarteten noch den entfernten Sims c63–66. Der aktuelle verbreiterte Rettungsraum deklariert c73–79 als sicheren örtlichen Wartebereich. Die erste Prüfung verlangt diese echten Daten, ihre tatsächliche Begrenzung innerhalb der automatisch ermittelten tragfähigen Zone und sieben vollständige Bodenfelder. Die zweite fährt weiter 1200 reale Wesen-Ticks, verlangt Bewegung und hält ihre Position im deklarierten Bereich. Sie prüft weiterhin den örtlichen Ersatzmodus ohne Heldenpfad; die bereits vorhandenen Begleiterprüfungen tragen separat das Folgen durch die Kapitelräume. Keine Behauptung, diese alte Roam-Prüfung allein beweise den neuen Begleiter.

Echte isolierte Negativproben: Entfernen der tatsächlich ausgewerteten Roam-Grenzen und ein Loch im tatsächlichen Boden unter c73. Beide werden rot; eine weitere Zahlenliste ohne physische Bodenprüfung wäre kein gleichwertiger Ersatz gewesen.

## Teständerung: f5-feel.test.ts

Die Läuferprüfung umfasst jetzt zusätzlich die vom Nutzer verlangte angreifende Schere samt tatsächlichem Bewegungsmuster. Die bestehenden unterschiedlichen Muster von Bleistift und Füllfeder bleiben geprüft. Die nackte geometrische Merle-Zonenprüfung liest den breiteren Boden: ohne deklarierte Grenzen gilt unverändert die automatische Begrenzung auf sechs Felder je Seite, daher c70–82. Dreizehn zugehörige Bodenfelder müssen tatsächlich vorhanden sein. Keine Änderung der Raumdaten oder der Bewegungsbegrenzung.

Echte isolierte Negativproben: Die Schere zu einem passiven Gegenstand gemacht sowie das Bodenloch unter c73. Beide werden rot. Der erste Zwischenlauf erwartete irrtümlich rechts c83; die unveränderte echte Sechs-Felder-Begrenzung zeigte den Fehler. Die Erwartung wurde anhand der vorhandenen Funktion korrigiert, nicht der Motor passend gemacht.

## Prüfbelege

Vier fokussierte Dateien: 138/138 grün (`preflight-mechanic-focused-final.log`). Anschließend zwei reine Typkorrekturen an den neuen Bodenassertionen: fehlende Zeile führt über optionalen Zugriff weiterhin zu einer fehlgeschlagenen Bodenassertion statt einem Zugriffsfehler. Die endgültige isolierte unveränderte Quellkopie besteht ebenfalls alle 138 Prüfungen (`preflight-mechanic-tamper-control.log`).

Acht abschließende echte Fehlervarianten alle rot, unveränderte Kopie grün. `preflight-mechanic-tampers.mjs`, `preflight-mechanic-tampers.json` und die einzelnen `preflight-mechanic-tamper-*.log` enthalten Ablauf, Pfad des isolierten Labors und Ergebnisse. Ausschließlich Kopien wurden absichtlich beschädigt; keine Tamper-Version im Produkt.

Alle zehn bestehenden Ausgangs- und Weltzustandsaufzeichnungen aus ch01 und ch02 erfolgreich wiedergegeben (`preflight-mechanic-tapes.log`, gezielt zehn einschlägige Fälle gewählt). Keine Aufzeichnung, Erwartung oder Laufstrecke geändert.

Game-paint-Typprüfung endgültig Exit 0 (`preflight-mechanic-typecheck-final.log`). Der erste Typdurchlauf fand die beiden optionalen Bodenzeilen; sie sind korrigiert. Keine Commits. Andere im umfassenden Vorlauf fehlgeschlagene Tests sind Besitz des Root bzw. anderer Agenten; dieser Bericht behauptet nicht, die gesamte Batterie bereits grün gesehen zu haben.
