# CODEX DRAFT — NOT CANON

## Ergebnis

Das interne Merkseitenarchiv bleibt nach einem tatsächlichen Neuladen zugänglich. Es zeigt die bereits gespeicherten sowie die in der laufenden Runde gefundenen Seiten dieses Kapitels ohne Doppelung. Sein HUD-Knopf zählt den dauerhaften Archivbestand. Der Rundenzähler, das Verzeichnis der eingesammelten Weltobjekte und die Schlussbilanz bleiben davon getrennt und beginnen bei einem neuen Lauf bei null.

## Umsetzung

`apps/web/lib/regelbuch.ts`: `chapterRegelSeiten(level, entries)` ordnet ausschließlich bereits gespeicherte Funde den tatsächlichen aktuellen Regelseiten des geladenen Kapitels zu. Identität oder enge historische Titelaliase beweisen den Fund; der aktuelle Leveltext liefert die korrigierte Erklärung und Beispiele. Die drei im Browser noch nicht gefundenen Seiten werden dadurch nicht freigeschaltet. Fremde Kapitel und nicht mehr zum aktuellen Level gehörende gespeicherte Seiten werden im bestehenden Speicher nicht gelöscht. `refreshChapterRegelbuch(level)` aktualisiert gefundene Seiten beim Kapitel-Mount auch im dauerhaften Bestand, sodass Hub und internes Archiv nicht mit zwei verschiedenen Lehrtexten arbeiten. Die vorherige Beschränkung „Korrektur erst beim Wiederfund“ gilt damit für die beiden echten Alttitel nicht mehr. Der bestehende Speicher bleibt v3.

Eine schmale lokale Benachrichtigung verbindet Schreibvorgänge mit der bereits vorhandenen React-Speicherabfrage. Abonnements werden beim Schließen entfernt; unveränderte Snapshots bleiben stabil und erzeugen keine Renderschleife. Blockierter Browserspeicher lässt das Spiel weiterhin laufen.

`BuchClient.tsx`: liest die Sammlung mit `useSyncExternalStore`, aktualisiert den Altbestand beim Mount außerhalb des Renderns und reicht `archivedTips` an PaintGame. Die vorhandene Meldung eines neuen Regelfunds bleibt erhalten.

`PaintGame.tsx`: neue optionale `archivedTips` nur als Archivquelle. Gespeicherte und aktuelle Seiten werden über ihre tatsächliche Regelkennung zu einer Liste zusammengeführt; ein Wiederfund aktualisiert den vorhandenen Platz. Die Liste geht an den bestehenden Merkseitenrenderer und dessen HUD-Knopf. Keine gespeicherte Seite wird in `tipsTakenRef`, `tipsCount` oder die Simulation eingetragen. Die Bilanz liest weiter `tips: tipsCount` und nicht die Archivgröße. Keine neue kind-sichtbare Formulierung oder neue Aufgabe.

## Speicher- und Negativprüfungen

`regelbuch.test.ts` erweitert die bisherigen acht Prüfungen um zwei echte Verträge: aktueller Archivtext für alte gespeicherte Fundidentitäten einschließlich beider Titelaliase, Doppelungsbereinigung, Erhalt anderer Kapitel/retirierter Daten, keine Freischaltung unbekannter Seiten und stabiler Wiederbesuch; außerdem tatsächliche Benachrichtigung desselben Browserfensters, unveränderter Snapshot und vollständige Abmeldung. Ergebnis 10/10 grün (`rulebook-archive-tests.log`). Web-Typprüfung Exit 0 (`rulebook-archive-typecheck.log`).

Getrennte Quellkopien: unveränderte Kopie grün, zwölf echte Fehlerproben rot. Vier neue Proben schalten alle unbekannten Seiten frei, entfernen die Mount-Aktualisierung, verlieren die Benachrichtigung oder behalten abgemeldete Listener. Die acht früheren Alias-/Identitäts-/Speicherproben wurden gegen die endgültige erweiterte Modulquelle wiederholt und bleiben rot. `rulebook-archive-tampers.py`, `rulebook-archive-tampers/results.json` und die Einzelprotokolle dokumentieren dies. Keine Fehlervariante im Produkt.

## Tatsächlicher Browserdurchlauf

Eigener Chrome mit frischem temporärem Profil, 1280×900, localhost:3350. Keine Benutzertabs oder bestehenden lokalen Daten berührt. Der vorhandene Entwicklungszugang versetzte den Helden zu den wirklichen Regelobjekten; die echte Simulation löste den Fund aus, der tatsächliche React-Rückruf speicherte ihn. Die sichtbaren Knöpfe „Seite aufschlagen“, „Ins Buch kleben“, Archivknopf und „Weiterspielen“ wurden betätigt. Das ist ein gezielter Archiv-/Persistenzbeweis, kein neuer Beweis für den räumlichen Weg zu diesen Gegenständen.

1. Befehlsseite tatsächlich gefunden und gelesen: ein Archivplatz, ein Rundenfund, ein gespeicherter Eintrag.
2. Echter Seitenreload: derselbe sichtbare Archivplatz und gespeicherte Eintrag, aber Rundenzähler null. Screenshot `rulebook-archive-after-reload.png`.
3. Dieselbe Regelseite tatsächlich erneut eingesammelt: weiterhin genau ein Archivplatz und ein gespeicherter Eintrag, Rundenzähler eins. Kein Zusammenwerfen früherer mit aktuellen Funden.
4. Über die bestehende Lehrerroute p3 geöffnet und auch die wirkliche Pluralseite eingesammelt. Zwei echte Regelfunde lagen anschließend im Browser-Speicher.
5. Ausschließlich diese eigenen zwei Funde wurden als ausdrücklich künstlicher historischer Testdatensatz gespeichert: alte Titel, fehlende feste Kennungen, sichtbarer Alttextmarker und ein zusätzlicher doppelter Befehlsseiten-Eintrag. Kein neuer Fund wurde für diesen Test erfunden. Nach erneutem echten Reload zeigten Archiv und Speicher genau zwei Seiten mit aktuellen Titeln, aktuellen Erklärungen und festen Kennungen; drei fehlende Seiten blieben Platzhalter. Der neue Rundenzähler war null. Screenshot `rulebook-archive-both-aliases-reloaded.png`.

`rulebook-archive-browser-results.json` hält die tatsächlichen beobachteten Werte und sichtbaren Texte fest. Alle drei Screenshots wurden anschließend visuell geöffnet. Das bestehende Buchlayout zeigt die Texte und eine interne Scrollleiste; bei längerer Sammlung liegen weitere Beispiele und der Rückkehrknopf weiter unten. Keine Behauptung einer neuen Layout-Neugestaltung.

Eine zu lange erste Prüfeingabe überschritt den Zeilenpuffer des interaktiven Terminals und wurde nicht ausgeführt. Der Puffer wurde geleert und der unveränderte Zweierbestand kontrolliert; erst die danach erfolgreichen kürzeren Eingaben erzeugten den historischen Testdatensatz. Das war eine Harness-Begrenzung, kein Produktfehler und kein als erfolgreich gewerteter Versuch.

## Persönlicher Gruß im Folgekapitel

Das echte Lesen des Prologs hatte bereits das eigene isolierte Story-Profil angelegt. Darin wurde „Probe Merle“ als ausdrücklich benannter lokaler Testdatensatz eingesetzt. Die tatsächliche Eingabe dieses Namens und seine Speicherung nach Hello wurden zuvor bereits im gesonderten UI-Durchlauf bewiesen; hier wird das nicht nochmals behauptet.

Anschließend die tatsächliche Route `/play/1/buch/ch02` geöffnet. Sichtbar gerendert: „Weiter geht’s, Probe Merle!“ auf der Kapitelstartkarte. Der Kapitel-zwei-Regelzähler war null von vier; die zwei gespeicherten Kapitel-eins-Seiten blieben im gemeinsamen Regelarchiv erhalten und wurden nicht als neue Kapitel-zwei-Funde ausgegeben. Screenshot `chapter-two-persisted-name-greeting.png` und letzter Datensatz im Browserprotokoll.

Eigener Chrome und eigener Node-Harness sind sauber geschlossen, Exit 0. Die Grafikbahn bekam danach ihr Schreibfenster zurück. Keine Commits oder Datenbankänderungen. Die vorhandene Regelsammlung bleibt an Browser/Gerät und ihren bestehenden lokalen Schlüssel gebunden; die davon getrennte neue Namens-/Storysammlung behält ihre vorhandene Spielertrennung.
