# CODEX DRAFT — NOT CANON

## Abschließende Bildvorgaben

Diese redaktionell zusammengeführten Vorgaben beschreiben die tatsächlich gewählte Richtung der von Root bestellten Bilder. Sie sind **keine wortgetreue Abschrift** sämtlicher historischer Bildaufrufe. Die separat erhaltenen Originalprompts der Mitwirkenden stehen unter `prompts/`. Alle neuen Rohbilder wurden mit dem eingebauten ImageGen-Werkzeug erzeugt; der API-/CLI-Ausweichweg wurde nicht verwendet.

### Gemeinsame Bildsprache

Gemalte, seitlich betrachtete Bücherwelt für das erste Kapitel eines Grundschulspiels. Eigene Gouache-Referenzen aus der bestehenden Bücherwelt und dem Kunstlabor (batch-z), warmes abgenutztes Leder in Ocker, gedecktem Rot, Blau und Salbeigrün, erkennbare Papierlagen. Große lesbare Bücher statt winziger Buchrücken als Tapete. Ruhige helle Standkanten, zurückhaltende Ornamente, weiches Licht von oben links, keine weißen Auswahlkonturen. Keine Schrift, Beschriftung, Zeichenanweisung oder fremde Figur im Bild. Figuren und Gegenstände des vorhandenen Spiels bleiben eigenständige, erkennbare Motive.

Die technische Bestellung verwendet Magenta als Freistellfarbe außerhalb der gemalten Gegenstände. Die Malerei muss die später benötigte Form vollständig überdecken; transparente Stellen werden beim Import niemals gefüllt. Die finale Registrierung auf 64 Bildpunkte je Spielzelle sowie Passpunkte und ausschließlich abschneidende Masken stehen in den Manifesten. Diese Verarbeitung ist getrennt vom generativen Malauftrag nachvollziehbar.

### Eingangshalle

- `hallenboden-source.png`: Ein zusammenhängender langer Unterbau aus großen horizontalen geschlossenen Büchern; unterschiedliche Längen und Einbandfarben, lesbare Seitenblöcke und kleine Gebrauchsspuren. Eine durchgehende ruhige Oberfläche trägt den Weg. Keine kleinteilige Archivfassade, Schubladen oder aufgeklebten Bodenleisten.
- `platforms-hall-source-v2.png`: Einzelne freigestellte Gegenstände: geschlossene Lesetruhe, verschnürter Bücherstapel, zwei verschieden gebaute Bücherregale, kleines Folio und Schreibtisch. Frontale waagrechte Oberkanten. Bei geschlossenen Gegenständen volle Sockel; beim Schreibtisch zwei vollständige Füße. Breite und Höhe folgen dem jeweiligen echten Plattformlauf. Keine schrägen Sockel, überbreiten Füße oder unmotivierten Pfeile.
- `hall-background-source-v3.png`: Helle, zurückhaltende Garderoben- und Pflanzenkulisse, einzelne lesbare Gegenstände mit Luft dazwischen. Gouache, weichere Konturen und geringere Detailkonkurrenz als der Vordergrund. Kein großer graugrüner Schrankblock. Außerhalb der Pflanzen und Garderoben reines Freistellmagenta, keine violetten Gegenstände. Die gewählte dritte Fassung hält den gemessenen Helligkeitsabstand zum Boden ein.
- `ostpodest-source.png`: Große zusammenhängende Bücherwand mit erhöhtem östlichem Podest; gleiches Material und ähnlicher Buchmaßstab wie der Hallenboden. Alle benötigten Bildbereiche bereits gemalt, besonders der früher schwarze Keil am Anschluss. Kontur und Stufen aus den vorgegebenen Lauf- und Kollisionsflächen übernehmen; keine neue Lücke oder falsche Landefläche erfinden.

### Schulhof

- Westterrasse: gestaffelte große Bücher mit sichtbar abgeriebenen schrägen Einbandkanten an den vorhandenen kurzen Rutschstellen. Die vier getrennten Rutschläufe bleiben als solche lesbar. Keine erfundene durchgehende Rutsche, Holzkeile oder wiederholten aufgesetzten Rampenbauteile.
- Mittelpfeiler: ein vollständig gemalter Körper aus deutlich erkennbaren Büchern und Papierseiten. Die schmale Säule und die unteren Massen gehören zur selben Materialfamilie; keine glatte unbestimmte Braunfüllung.
- Ostmauer: große gestaffelte Bücher mit warmen, ruhigen Oberkanten. Stufen und Sims folgen der echten Form. Die vorherige harte weiße Umrandung entfällt; Einband und Papier erzeugen die Kante selbst.

Die vollständigen Dateizuordnungen, finalen Rohbilder und Passpunkte stehen in `inventory.json` und den Manifesten. Das wiederholbare Ergebnis beginnt bei diesen gespeicherten PNG-Quellen; eine erneute generative Bestellung verspricht keine identischen Bildbytes.
