# Spielpass: Quellenstand und offene Bedienbelege

**CODEX DRAFT — NOT CANON · DOCUMENT · cgo-018.** Alle Quellenangaben beziehen sich auf `269ee986ccdc1ae7c3b070cbed7014f20e532365`. Grundlage ist Inventur §4. CODE bedeutet selbst gelesener Quelltext; BEDIENT verlangt einen wirklichen Zustandsdurchlauf; UNTERRICHT verlangt einen eigenen Unterrichtsbeleg. Aktuell wird nur CODE behauptet.

## Tatsächliche Einstiege

Die acht `page.tsx` unter `apps/web/app/(game)/play/` wurden aus der vollständigen Git-Dateiliste erfasst. Ein Router ist hier der Code, der eine Adresse oder Begegnung dem passenden Spiel zuordnet. Die komplette Liste steht in `quellen.json`; Abweichungen sperren die Vollständigkeitsbehauptung.

| Adresse / Weg | Tatsächliche Auswahl und Schranke | Zu prüfen im Spielpass |
|---|---|---|
| `/play` | Anmeldung; Schülerjahrgang steuert Weiterleitung, sonst freigegebene Storyauswahl | Schüler/Lehrer, falscher Jahrgang, Rückkehr |
| `/play/[grade]` | Storyübersicht; Karte mit Weltplan führt in Zonen, sonst Kapitel mit Detective/Novel/Trip; Schülerjahrgang begrenzt | alle tatsächlich angebotenen Links; gesperrtes Kapitel |
| `/play/[grade]/[zone]` | Schüleridentität; `map !== null` wählt Weltspiel, sonst jahrgangsspezifische Story; Freigabe des Kapitels wird geprüft | Weltbegegnung, Dialog, Storyaufgabe und Entscheidung getrennt |
| `/play/1/buch` | Weiterleitung nach `buch/ch01`, bekannte Abfrageparameter bleiben erhalten | echter Weiterleitungspfad, keine zweite Spielimplementierung |
| `/play/1/buch/[chapter]` | Kapitelname und Bestand geprüft; in Produktion nur Lehrer; `draft:true` überall nur Lehrer; `phase` nur für Lehrer; Kartenbank nur Lehrer außerhalb Produktionsbau | Begegnung, Wiederherstellung, Rettung, Tür, Zeremonie, Quickfire, Arena, Finale; Bank ist kein Welt-Spielpass |
| `/play/[grade]/run` | in Produktion Lehrervorschau; `level=g1-chNN` bindet Kapitel und Aufgaben; `boss=1` nur Lehrer und vorhandener Boss | allgemeiner Lauf, Kapitel-Lauf, direkte Bossvorschau, normales Betreten der Boss-Tür |
| `/play/1/world` | Keen-Welt, in Produktion Lehrer; andere Jahrgänge werden umgeleitet | Weltkarte → Kapitel → Rückkehr; nicht mit Paint-Buch verwechseln |
| `/play/2/school` | Jahrgang 2; geteilte Zugangsentscheidung prüft Schülerfreigabe und Jahrgang; Lehrer sehen Vorschau | zusätzliche Schulstationen gesondert erfassen; kein Beleg eines sozialen Duells |

Quellstellen: jeweilige `page.tsx`; insbesondere `buch/[chapter]/page.tsx:35–119`, `[zone]/page.tsx:80–205`, `run/page.tsx:31–124`, `world/page.tsx:64–88`, `apps/web/lib/school-access.ts`. Der Schülerweg einer Story kann nicht durch eine Lehrervorschau als geprüft gelten.

## Modi und Lernhandlungen

| Modus | Mechanik / Eingaben / Lernziel | Fehler und Zeit | Beleggrenze |
|---|---|---|---|
| Weltbegegnung G1/G2 | `PhaserGame` öffnet `BattleStage`; gemeinsame Vokabel-/Grammatikdarstellung; Auswahl, Texteingabe, Wortreihenfolge oder Zuordnung je Aufgabenformat. Sprache befreit ein Wort. | `BattleStage.onResult` meldet Antwort, gewonnene/verlorene Darstellung; keine Zeitwertung aus Animationsdauer ableiten. `resolveEncounterTasks` ergänzt eine kurze fällige Liste aus dem gleichen Themenbestand: **fällig bedeutet nicht, dass jede Ersatzaufgabe geübt ist**. | Quellcode; Routenfreigabe und echter Ablauf offen |
| Paint Begegnung / Tür / Rettung | Aufgaben nach `use`, Phase und Wesen; `restore` verlangt erst Benennen, dann Farbe. Zeremonie wählt die Runde nach Weltzähler, nicht nach nächster Playlistkarte. | ruhige Klassen ohne Uhr; `Später` schließt Karte, ohne Belohnung oder Einlösung. Wiederaufnahme einer Zeremonie bleibt an derselben Welt-Runde. Eingabeerhalt beim erneuten Öffnen muss bedient geprüft werden. | keine pauschale Zusage „kein Fortschrittsverlust“ ohne Durchlauf |
| Paint Quickfire / Schwarm | `quickfire`, ggf. an `moths` gebunden; Auswahl/Rad und weitere gelieferte Kartenarten. | E/M/S: 6/5/4 Sekunden **je Aktivität**, Lesepause vorher ungetaktet, Roh-Eingabe startet neu; `restore` immer ruhig, reduzierte Bewegung schaltet Uhr aus. Ablauf schließt ohne Belohnung/Strafe. Kein hier nachgewiesener Vorwissensfilter. | `cards/timer.ts`, `CardHost.tsx:139–166`; tatsächliche Touch-Ereignisse offen |
| Paint Arena | Kampfbewegung und Kartenfolge; Sichtbeleg der Welt vor sachbezogener Karte; Boss-Pool ist eigener Inhalt. | `boss` gehört zur getakteten Klasse; gleiche Ausnahmen wie oben. Angriffstempo und Sprachleistung sind unterschiedliche Vorgänge. Sieg ist kein Beherrschungsnachweis. | `PaintGame.tsx`, `cards/arena.ts`; vollständige Arena-Bildfolge offen |
| Keen Befehlsduell | eigener Zustand `duelRound`; richtige englische Aufforderung führt zur nächsten Runde, alle Runden machen den Gegner freundlich. | falsche Auswahl zeigt Fehler und bleibt in Runde; keine gemeinsame Zweipersonenpartie. | `ArcadeGame.tsx:651–674`; Bestand erhalten, kein Ausbau |
| Keen Boss / Quickfire / weitere Pools | Boss-Tür bzw. direkte Vorschau; Quickfire, Rettung, Siegel, battle, swarm, colorroom, duel, finale werden getrennt geladen. | Bossfenster besitzt Frist; falsche Antwort vereinfacht dieselbe Aufgabe, Ablauf schließt Fenster; Tod führt über Rettung zum Neustart des Duells. Quickfire-Ablauf zählt im Lauf als falscher Kontakt. Das ist **nicht** Paints Ablaufregel. | `run/page.tsx:77–90`, `ArcadeGame.tsx:510–578`; Bilder und genaue Zustandsfolgen offen |
| FOURTEEN | Story lesen; erste Aufgabe einer Szene bearbeiten; Kommentarzustand nach bestimmten Aufgaben; Story-Abzweig führt mit `go(c.next)` weiter. | Wahl ruft keinen Bewerter auf. Sprachaufgaben gehen über `onAttempt`; Kanalzahlen sind Erzählung. Kommentarreaktionen und Sprachrückmeldung separat beurteilen. | `NovelGame.tsx:148–168`; kein Look-/Unterrichts-Ja |
| Y4 journalistische Entscheidung | Text/Sprachaufgabe, dann Auswahl einer Storyfolge; Entscheidung kann erzählerische Merker setzen. | `choose` speichert Merker vor Szenenwechsel; Wahl wird nicht richtig/falsch benotet. Dauerhafte Speicherung ist damit nicht bewiesen. | `TripGame.tsx:163–171,245–254`; Produktdurchlauf offen |
| Detective / weitere Storydialoge | eigene Storyaufgaben und erzählerische Auswahl; bleibt Teil der Routenprüfung auch außerhalb des bevorzugten Prototyps. | Aufgabenbewerter und Navigation getrennt prüfen; keine Lernbewertung allein aus Erzählwahl ableiten. | `DetectiveGame.tsx`, `packages/game-2d/src/dialogue.tsx`; nicht überspringen |

## Kartenverteilung vollständig erhalten

Die sechs Paint-Dateien enthalten **199** Karten: ch01 61, ch02 72, ch03 28, ch04 11, ch05 16, ch06 11. Keen ch01 enthält zusätzlich **59**. Diese Mengen stammen aus eigener Dateizählung, nicht aus dem alten Bericht. Die zehn Paint-Darstellungsarten im `CardHost` sind choice, typed, spell, order, oddone, wheel, mistake, memory, restore, match. `pickupset` in ch06 ist eine Verwendung, keine elfte Darstellungsart.

`cards/routing.ts` filtert zuerst Verwendung und Phase; hat das angesprochene Wesen gebundene Karten, kommen nur diese zum Zug, sonst ungebundene Karten desselben Bereichs. `PaintGame.pickTask` kann bei leerem Pool auf Quickfire im gleichen Bereich zurückfallen. Die Uhr folgt trotzdem der **angefragten** Verwendung. Boss- und Mottenfolgen können mit festem Startwert gemischt werden; alle Karten werden je Zyklus einmal bedient. Das belegt Verteilung, nicht gleiche Schwierigkeit zweier Kinder.

`requestedTask` lehnt eine fehlende/falsch gebundene Aufgabe oder einen fehlenden passenden Szenenbeleg ab. `orderedTask` hält Rettungsrunden an der Weltfolge. Diese Unterschiede müssen im Spielpass erhalten bleiben: bloße Suche nach dem Wort „duel“ würde sie übersehen.

## Protokoll je tatsächlich erreichtem Weg

Für jeden obigen Weg separat erfassen: vollständiger Kopfstand, konkrete Adresse samt nichtgeheimen Parametern, Testrolle, reales Gerät/Betriebssystem/Browser, Fenstermaß, Maus/Tastatur/Touch, Bewegungsmodus, Aufgabenkennungen, konkrete Eingaben, erwartete und beobachtete Folge. Bildfolge mindestens **Einstieg → Reiz → Eingabe/Fehler → Hilfe/Korrektur → Ergebnis → Abbruch/Wiederaufnahme**; bei Arena zusätzlich Weltbeleg, Angriffsfenster und Rückkehr. Bildpfad und MD5 gehören in den externen Bericht. Fehlender Zustand bleibt UNVERIFIZIERT; ein übersprungener Weltweg oder automatisches `solveTask` ist kein menschlich bedienter Spielpass.

**Aktuell: 0 Produktwege als BEDIENT freigegeben, 0 Unterrichtseinsätze belegt.** Kein Produktbild wird durch ein Bild des geplanten Modells ersetzt. Ein Lehrerkonto ist kein Ersatz für die Prüfung der Schülerrechte. Smartphoneansicht im Desktopbrowser wäre eine Simulation, kein reales Touchgerät.

## Tatsächlich verfasste Storyentscheidungen

Die Vollsuche in allen `story.json` findet sechs Szenen mit Auswahlfolgen: Wrong Name ch01/s007 und ch11/s003; FOURTEEN LIVE ch06/s009, ch10/s009 und ch13/s005; Lost for Words ch04/s007. Die vollständigen Kennungen und Optionenkennungen stehen in `quellen.json`. Lost for Words besitzt am Startpin **keine freigegebenen Kapitel**. Die übrigen genannten Szenen liegen in ihren jeweiligen Freigabedateien; die tatsächliche Erreichbarkeit unter Testrolle bleibt zu spielen.

**FOURTEEN Jahrgang 3 besitzt am Startpin keine solche Auswahlszene.** `NovelGame` kann Auswahlfolgen darstellen; daraus darf keine vorhandene J3-Entscheidung erfunden werden. Der konkrete J3-Pass betrifft Story-/Sprachaufgaben, Kommentare und Kanalzahlen. Y4 FOURTEEN LIVE enthält hingegen drei wirkliche Entscheidungen. Diese Trennung präzisiert die Überschrift „FOURTEEN-Entscheidung / Kommentare“ der Inventur, ohne das zentrale Dokument dieser anderen Kartenbahn zu ändern.

Zusätzliche Auslöser aus `cards/serving.ts`: `scene.stage` fragt ebenfalls Quickfire, Kleidungsstücke können `pickupset` auslösen, Bonus-Türen fragen `bonuspay`. Arena **und** Bonusraum gehören bei der Aufzählung zu den Phasen. Ein reiner Schwarm-/Boss-Suchlauf wäre daher unvollständig. Die echte reine Funktion `serveContextsOf` kann ohne Installation alle im Level verfassten Anfragekontexte aufzählen; das belegt noch nicht, dass jeder Kontext unter realer Bewegung erreicht wurde.
