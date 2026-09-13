# CODEX DRAFT — NOT CANON

## Tatsächlicher Bonuskauf und Bestandsvergleich (PLAN 35)

Am 13.09.2026 im unveränderten laufenden Spiel auf localhost:3350 geprüft. Eigener Chrome mit neuem, isoliertem Browserprofil, 1280 × 900. Keine vorhandenen Benutzerkonten oder Browserdaten verändert. Der vorhandene Lehrerzugang `?phase=p2` verkürzte den Einstieg. Die ausdrücklich freigegebene `warp(c,r)`-Abkürzung setzte ausschließlich die Spielfigur an echte Fundzellen; danach verarbeitete der normale Simulationsschritt die Kollision und den Fund. Keine Buchstaben-, Konten-, Kauf- oder Bestandsflags geschrieben.

Alle neun tatsächlichen p2-Fundzellen eingesammelt: (32,6), (34,7), (36,7), (55,10), (18,11), (57,13), (15,14), (12,16), (59,16). Bei der ersten Abkürzungsserie öffnete ein realer Zahlenschwarm seine Aufgabe und pausierte weitere Funde. Über den sichtbaren Später-Knopf geschlossen, dann die noch offenen Zellen tatsächlich erneut berührt. Die Rohdaten behalten auch die ergebnislosen Versuche; sie werden nicht als Funde gezählt. Ein erster Selektor für den Comic-Überspringknopf traf kein Element; der tatsächlich vorhandene Knopf wurde anschließend anhand seines sichtbaren Textes angeklickt. Keine Produktkorrektur.

| Schritt | Sichtbarer bzw. tatsächlich gelesener Zustand |
|---|---|
| Vor dem Kauf | p2; Bestand 9; Fundzähler 9; HUD 9/9 |
| Klecks-Karte | „Du hast 9 Buchstaben gesammelt.“ Preis 8; ausdrücklich 12 weitere Buchstaben dahinter; sichtbarer Knopf „8 Buchstaben abgeben“ |
| Tatsächlicher Klick | Bonusraum p9 betreten; eigener Bonusbestand beginnt mit 0/12 |
| Bonusfund | Echte Zelle (17,6) berührt; Bonusbestand 1/12 |
| Ausgang | Echte Ausgangszelle (42,15) mit normaler Eingabe ausgelöst; Ergebnisdialog 1/12 und unvollständiges Buchstabenwort sichtbar |
| Tatsächlicher Weiter-Klick | Rückkehr nach p2 an Klecks (x=1016, y=320); Bestand **1**, Fundzähler weiterhin **9**, kein offener Dialog |

Damit ist der Abzug 9 − 8 = 1 tatsächlich belegt. Der eigene Bonusfund wird als Bonusleistung geführt; er ersetzt oder erhöht den zurückgebrachten Kapitelbestand nicht. Der Kapitel-Fundzähler bleibt trotz Ausgabe unverändert bei neun. Der begrenzte Lauf behauptet weder einen vollständigen Bonusdurchgang noch eine Prüfung des Zeitablaufs.

## Belege

`bonus-browser-results.json` enthält die tatsächlich aus dem Browser gelesenen Schrittwerte und Texte. Die drei Aufnahmen wurden anschließend geöffnet und visuell geprüft:

- `bonus-before-purchase.png`: lesbare Karte mit Bestand 9, Preis 8 und 12 dahinter.
- `bonus-room-entry-and-pickup.png`: tatsächlicher Bonusraum, eigener Buchstabenzähler 1/12 und Tintenzeit.
- `bonus-returned-purse-one.png`: tatsächliche Rückkehr neben Klecks, HUD-Bestand 1/9.

Die Spielschleife wurde zwischen Messungen für ruhige Zustandsbilder angehalten; vor dem letzten Bild wieder normal weiterlaufen gelassen, damit der Übergang vollständig sichtbar war. Das verändert keine Inventarwerte. Eigener Browser und Bedienprozess sind sauber geschlossen, Exit 0. Keine Produktdateien geändert, keine zusätzlichen großen Prüfungen oder Commits ausgeführt.
