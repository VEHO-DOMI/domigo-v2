# Kapitel 1: unabhängige verbleibende Implementierungslücken

**CODEX DRAFT — NOT CANON** · 2026-09-13  
Quellinspektion des laufenden gemeinsamen Arbeitsstands auf Basis `f45963c5`; keine Repository-Änderung, kein abschließender blinder Releasecheck. Root implementiert während dieser Prüfung weiter. Die zuerst gemeldeten Finale-/Referenz-/Bilanzbefunde werden bereits von Root bearbeitet; sie sind hier als tatsächliche Befunde und Nachprüfaufträge erhalten, nicht als Behauptung, spätere Korrekturen seien noch falsch.

## 1. Finale kann nach „Später“ nicht von selbst wieder angeboten werden

**Plan 47/48, hoher funktionaler Befund.** Nach Roots erster Korrektur führt „Später“ aus der Finale-Karte zurück in die Welt. Im aktuellen Sim-Vertrag existiert aber kein erneuter Zugang zur Hello-Aufgabe. `entities.ts:1949` emittiert `guardianDown` ausschließlich beim Ende des letzten Wischens. Danach wird `sink → sad → consoled` erreicht (`entities.ts:798`); `consoled` beendet jeden weiteren Guardian-Tick ohne Aktion (`:1897`). `Sim.dismissTask` (`sim.ts:1376–1392`) reaktiviert nur eine Tafel im Zustand `window`, nicht die bereits beruhigte Tafel. Ausschließlich `PaintGame.onGuardianDown` (`PaintGame.tsx:1342–1357` zum Inspektionszeitpunkt) erstellt den `use: finale`-Auftrag.

Es liegt kein verborgenes `consoleSeen`-Flag vor, sondern ein einmaliges Sieg-Ereignis. Erforderlich ist ein sichtbarer Wiederaufnahmeweg, der die noch ausstehende Finale-Karte öffnet, ohne Sieg, Wischen oder Foto-Fund erneut zu emittieren. Root hat einen HUD-Zugang „Den Gruß schreiben“ als nächste Korrektur angekündigt; dessen tatsächlicher Browserablauf ist noch separat zu prüfen.

**Zuvor belegter und von Root bereits korrigierter Textfehler:** `dismissCard` ging bei Finale-Abbruch direkt zur Erfolgskonsole, die auch bei leerem `typed` „Dein Gruß steht darauf“ behauptete. Root hat die Finale-Abbruchbehandlung und die kapitelbezogene Konsole nach Meldung geändert. Die anfängliche Stelle wird deshalb nicht zusätzlich als weiterhin offen geführt.

## 2. Nachschlagen setzt eine angefangene Aufgabenkarte zurück

**Plan 02/53, hoher funktionaler Befund.** `PaintGame.openReference` (`:680–685`) bewahrt nur `OverlayState`. Beim Wechsel zu Comic/Foto/Merkseite verschwindet der vorherige `CardHost` aus dem React-Baum. Der Kartenfortschritt lebt jedoch in `CardHost.tsx:126–127` als `useState(() => m.init(task))` und eigener Versuchszähler. Zurückgeben desselben Task-Objekts stellt daher nur dieselbe Aufgabenidentität wieder her; die Eingabe bzw. der bereits gelöste erste Restore-Schritt sind neu initialisiert. Das widerspricht dem Kommentar „return to the same unfinished card“ und macht das Nachschlagen während einer Aufgabe verlustbehaftet.

Erforderlich sind Erhalt der eigentlichen Karteninstanz oder explizite Sicherung ihres Maschinenzustands sowie eine angehaltene Kartenzeit während des Nachschlagens. Root hat die weiter gemountete, verborgene Aufgaben-Unterlage samt `suspended`-Signal angekündigt. Echte Restore-Eingabe, zweiter Schritt, Wartezeit, Referenzwechsel und Rückkehr müssen anschließend im Browser geprüft werden.

## 3. Die Abschlussbilanz unterschlägt sechs der zehn Farbaufgaben

**Plan 19/51, konkreter falscher Vollständigkeitsvertrag.** `chapterDrainedIds` (`PaintGame.tsx:390–396`) erfasst ausschließlich Entitäten mit `role === "drained"`; `bilanz.drainedTotal` verwendet denselben Rollenfilter (`:1744`), und `onEntityResolved` zählt nur diese IDs (`:1155–1164`). Tatsächlich sind in der aktuellen Kapiteldatei nur Buch, Tasche, Tisch und Stuhl `drained`. Die anderen sechs Restore-Ziele — Radiergummi, Füllfeder, Heft, Schere, Klebestift, Spitzer — sind Bouncer, Chaser oder Flyer.

Folge: „Farbe zurückgegeben“ kann 4/4 zeigen, obwohl sechs angebotene Farbaufgaben fehlen. `ScorePage` leitet aus diesen Zeilen anschließend „Du hast hier alles gefunden“ ab (`:2859`, Text wenige Zeilen darunter). Die zehn tatsächlichen Restore-Karten stehen in `content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json` (`items`); die Bilanz muss den erfüllten Restore-Auftrag, nicht bloß eine Bewegungsrolle zählen. Root bearbeitet diesen gemeldeten Befund.

Zusätzlich fehlt in der aktuellen `ch01.level.json` ein `restorationDe.freedLabel`; `ScorePage` fällt deshalb auf „Schulsachen befreit“ zurück (`PaintGame.tsx:2839`, inzwischen durch Paralleländerungen leicht verschoben). Damit bleibt die alte Personenformulierung gerade in der Abschlussbilanz für Geräte und Klassenfoto bestehen (Plan 14/51/54). Root ebenfalls gemeldet.

## 4. Gespeicherte Regeltexte bleiben nach sprachlicher Überarbeitung dauerhaft alt

**Plan 08/53, tatsächlich erreichbarer Rückfall.** `BuchClient` speichert gefundene Regeln weiterhin über `rememberRegelSeite`. Diese Funktion in `apps/web/lib/regelbuch.ts:142–153` prüft nur `(chapter, topicDe)` und behält bei einem vorhandenen Eintrag unverändert `have`. Eine erneut gefundene gleichnamige Regel aktualisiert deshalb weder Apostropherklärung noch andere überarbeitete Beispiel-/Formulierungsfelder. `RegelbuchBoard` liest genau diese gespeicherten Einträge (`apps/web/app/(game)/play/[grade]/RegelbuchBoard.tsx:290–293`). Ein Bestandsbrowser kann somit im Hub weiterhin die fachlich kritisierte alte Erklärung sehen, auch nachdem die neue Regel im Spiel erneut eingesammelt wurde.

Erforderlich ist eine ausdrücklich kompatible Aktualisierung der vorhandenen Regel-Inhalte bei derselben Fundidentität oder eine inhaltliche Versionsbindung. Bereits erworbene Regeln dürfen dabei nicht gelöscht werden. Dieses Problem existiert unabhängig davon, dass das neue Foto-/Namensprofil korrekt kontogetrennt ist.

**Abgrenzung:** Regelbuchzugang ist nicht komplett fehlend. Der Spiel-HUD öffnet `merkseite` (`PaintGame.tsx:1851–1854`); das Archiv im Spiel liest die in diesem Lauf gesammelten Regeln (`:2450–2460`). Der Hub enthält für den vorgesehenen Lehrer-Vorschauzugang ein gespeichertes Regelbuch (`apps/web/app/(game)/play/[grade]/page.tsx:307`). Nach einem Spiel-Neuladen wird das interne Archiv allerdings wieder aus leerem `collectedTips` aufgebaut (`PaintGame.tsx:584–585`), während das Hub-Archiv den Speicher liest. Diese beiden Zugänge besitzen derzeit unterschiedliche Bestände; ein direktes Ende-/Menü-Angebot für die dauerhafte Sammlung wäre eindeutiger. Das ist ein konkreter Datenflussunterschied, kein behaupteter vollständiger Verlust der gespeicherten Seiten.

## 5. Die neun passiven Kleidungswörter haben im neuen Kapitelstart kein Wiederleseregister

**Plan 40.** Das Abschalten der Sammelquiz ist implementiert. Das sichtbare Wiederleseangebot der Wörter wurde dabei aber nicht neu zugänglich gemacht: `uniformLegend(...)` wird ausschließlich in der alten Auftaktkarte `sammeln` gerendert (`PaintGame.tsx:2282`). Kapitel 1 startet jetzt über Comic und `chapter-intro`, nicht mehr über diese Auftaktkette. Der Kleidungs-HUD bei `:1858` ist ein reiner Zähler ohne `onClick`; auch die Abschlusszeile zeigt nur eine Anzahl (`:2858`). Die vorhandene Wortliste `clothWordsRef` wird gespeichert im laufenden Kapitelzustand, aber kein aktueller Menüweg öffnet die entsprechende Bild-/Wortlegende.

Damit sind die Wörter beim einmaligen Fund sichtbar, bleiben aber entgegen dem Plan nicht als neun Wiederholungswörter erreichbar. Ein lesbarer Fund-Katalog aus HUD/Abschluss würde die schon vorhandenen Daten nutzen; ein neues Quiz ist dafür nicht nötig.

## 6. Merle erweitert den echten Bildbedarf außerhalb des gemessenen Phasenvertrags

**Plan 25/31, konkreter Beweisumfang für Performance/Kunst.** `PaintScene` berechnet zuerst `phaseArtScope`, erweitert die Liste dann aber bei bereits befreiter Merle separat um **alle** verfügbaren `merle_*`-Stämme (`PaintScene.ts:1185–1187`). `scripts/check-perf-budget.mjs:156` misst ausschließlich `phaseArtScope(...)`; `scripts/check-paint-art.mjs:167` benutzt denselben statischen Rückgabewert. Die dynamisch hinzugefügten Bilder nach der Rettung in p3/p4/Bonus erscheinen daher nicht zwingend im Budget, das die Prüfroutine beglaubigt.

Das belegt keinen gemessenen Ruckler; es belegt, dass der reale Begleiterzustand und die gemessene Bildliste auseinanderliegen. Erforderlich ist ein ausdrücklicher erreichbarer Begleiterkontext im gemeinsamen Scope-Vertrag oder eine konservativ deklarierte maximale Bildliste, die Scene und Budgetprüfung gemeinsam verwenden. Nur die benötigten Lauf-/Sprung-/Stand-/Grußbilder sollten als begründete Menge beschrieben sein; ein ungeprüftes `startsWith("merle_")` lädt auch sämtliche Aktionsbilder, die dort nicht stattfinden.

**Was mechanisch bereits stimmt:** Frische Merle-Befreiung hängt eine echte Wegspur an (`sim.ts:1304–1305`), und p3/p4 übernehmen die tatsächlich verdiente Befreiung (`:591–603`). Der Helfer prüft echte Körperbewegung, Gefahren und sichere Landungen; Pause und Phasenwechsel sind explizit behandelt (`companion.ts:74–78,115–163`). Für diesen Normalpfad ist keine fehlende Implementierung festgestellt. Die sichere Wartehaltung nach einem unüberbrückbaren Checkpoint-Wechsel ist bewusst implementiert; daraus wird ohne konkreten Spielfall kein neuer Fehler abgeleitet.

**Folgekapitelprinzip:** Die automatische Begleiterintegration ist weiterhin ausdrücklich auf ch01/Merle begrenzt (`sim.ts:591,1304` und `PaintScene.ts:1186`). Die allgemeine Nutzerforderung, dass befreite Mitschüler grundsätzlich mitlaufen, ist damit noch keine gemeinsame Routine für alle späteren Kapitel (Plan 54). Das ist ein belegter Geltungsbereich, nicht die Behauptung, Merle müsse bereits vor ihrer Befreiung oder in jedem späteren Kapitel unverdient erscheinen.

## 7. Weitere konkret abgegrenzte Beobachtungen

**Tinte, Plan 10:** Die neue ganze Tintenfläche ist tatsächlich verdrahtet. `artScope.ts:213,318` fordert/lädt `ink_liquid` bei Kapitel-1-Tinte. `PaintScene.ts:5611–5634` zeichnet die neue Textur über die volle zusammenhängende Beckentiefe, nicht bloß über einen schmalen Oberflächenstreifen; `stepInk` bewegt sie nach Sim-Takt (`:1685–1691`), die Randlinie erhält kapitelbezogene dunkle Farben (`:5148–5165`). Die jetzigen p1/p2/p3-Tintenzellen sind von diesem Algorithmus abgedeckt. Aus dieser Quellprüfung folgt **kein belegtes verbleibendes „nur violetter Block“-Problem**. Die tatsächliche Naht, Wiederholung der Textur und Materialwirkung müssen visuell beurteilt werden; Quellcode allein ersetzt das nicht.

**Comic, Plan 02:** Zurück, Weiter, Überspringen und reduzierte Bewegung sind konkret gebaut. Die Bewegung besteht derzeit ausschließlich aus einer 16-Sekunden-Skalierung des gesamten Bildes (`StoryComic.tsx`, `pb-comic-drift`), mit verschiedenen Transformationsursprüngen für `fall` und `ink`. Separate bewegte Blätter oder Tinte, wie im ausformulierten Comic-Plan beschrieben, gibt es im Komponentenbaum nicht. Dies ist eine klare, kleinere Restdifferenz zur vereinbarten Bewegungsinszenierung; das vorhandene bedienbare Comic-Lesen wird nicht als fehlend bezeichnet.

**Ladetext, Plan 03/54:** Bei der Erstinspektion stand im internen Scene-Ladeoverlay weiterhin „Das Buch schlägt eine Seite auf …“, obwohl BuchClient bereits „Wir öffnen das Kapitel …“ hatte. Root wurde informiert und hat diesen sichtbaren Alttext während der Prüfung entfernt; er ist kein weiterhin offener Fehler dieses Berichts.

**Bildidentitäten, Raumkunst, Zahlenschwarm und Tafel-Kritzelschichten:** Andere ausdrücklich zugewiesene Bahnen bearbeiten aktuell diese Flächen. Diese Quellprüfung behauptet keine blinde Bildabnahme und führt deren momentane Zwischenstände nicht als finale Mängel auf.

## Prüfgrenze

Keine Repo-Schreibvorgänge, keine neuen Spieltests oder Bildbearbeitung in dieser Auditbahn. Gemeldet wurden ausschließlich aktuelle Quellverträge, konkrete Datenflüsse und tatsächliche Planabweichungen. Die anschließend angeforderte echte UI-Regressionsprüfung für Nachschlagen und Finale-Wiederaufnahme wird separat in `ui-story-interaction-check.md` dokumentiert.

## Nachtrag: tatsächliche Restore-Folgekarten sind nach erster Lösung gesperrt

Auf Roots Rückfrage zusätzlich mit dem echten Router und der echten `Sim` im Arbeitsspeicher geprüft, ohne Repo-Schreibvorgang: Für Radiergummi, Füllfeder und Heft deklarieren die aktuellen Entitäten **keine** `taskSequenceV2` (`ch01.level.json:72–78,255–264,523–532`). Ihre Begegnungspools enthalten jeweils eine Restore- und zwei andere Karten. `nextTask` verändert Encounter-Pools auch mit neuem Runseed nicht (`cards/routing.ts`, letzter Funktionsblock).

| Entität | Normale erste Karte | Art | Nach erfolgreicher Antwort |
|---|---|---|---|
| Radiergummi | `g1.paint.ch01.enc.eraser.k1` | choice | redeemed=true, state=joy, erneut nicht ansprechbar |
| Füllfeder | `g1.paint.ch01.enc.pen.r1` | restore | redeemed=true, state=joy, erneut nicht ansprechbar |
| Heft | `g1.paint.ch01.enc.heft.r1` | restore | redeemed=true, state=joy, erneut nicht ansprechbar |

Die Auswertung rief den echten `nextTask(..., initRoute("independent-audit"))` und den echten Antwortabschluss `Sim.solveTask({type:"entity",id,skin})` auf und überprüfte anschließend `engageTargetId` genau an der Entität. Das ist eine mechanische Antwortabschlussprüfung, kein behaupteter vollständiger Browserweg bis zu diesen drei Stellen.

Ursache: Ohne deklarierte Sequenz wird `hasNextWitness` falsch, die Sim ruft `redeemEntity` und meldet `entityResolved` (`sim.ts:1243–1267`). `engageTargetId` schließt erlöste Entitäten ohne Sequenz ausdrücklich aus (`entities.ts:1307`). Der Radiergummi verliert somit bereits nach seiner Satzwahl den Zugang zum tatsächlich vorhandenen pinken Restore-Ziel. Füllfeder/Heft verlieren die anderen Begegnungskarten; wer zuvor „Später“ benutzt, kann auch dort eine andere Karte zuerst endgültig lösen und das Restore-Ziel verlieren.

Das verschärft Plan 19/51: Eine ehrliche Zehn-Farben-Bilanz kann im normalen Lauf derzeit nicht voll werden. Nötig ist ein expliziter Mehrschrittvertrag für die tatsächlichen Begegnungen, etwa über die vorhandene `taskSequenceV2`, der den Zauber erst nach den erforderlichen Handlung-/Restore-Schritten abschließt. Bloß alle Restore-Karten im Datenpool zu zählen oder Restore an erste Stelle zu schieben beweist ihre gesamte Erreichbarkeit nicht. Root wurde sofort informiert.
