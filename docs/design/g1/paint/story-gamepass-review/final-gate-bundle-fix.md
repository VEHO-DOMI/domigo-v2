# CODEX DRAFT — NOT CANON

## Tatsächlicher Engpass und enger Modulschnitt

Die finale Batterie meldete im unveränderten Bundle-Tor einen zu großen gemeinsamen Browserblock: `3gewpw4tptjus.js`, 153.853 Byte gzip bei unveränderter Grenze 153.600. Die Ausgabe rundete beide Werte auf 150 KB, wodurch der kleine, aber reale Überhang unsichtbar blieb. Entscheidend ist die Messung mit demselben Node-zlib-gzipSync wie im Tor; Python-gzip liefert leicht andere Kompressionsgrößen und wurde deshalb nicht als Grenzbeleg verwendet.

Der Comic lag tatsächlich in einem anderen, etwa 95,8-KB-gzip-Block. Er wurde daher nicht prophylaktisch ausgelagert. Die Untersuchung der tatsächlichen Modulgruppen fand im übergroßen Block unter anderem Datenprüfschema/Zod, Simulationsfunktionen, Karten-CSS und den Aufgabenrenderer. Die jeweiligen Einzelkompressionen sind eine Zuordnungshilfe, keine addierbare Gesamtgröße.

Nur `packages/game-paint/src/PaintGame.tsx` geändert: `CardHost` wird jetzt über React.lazy bei der ersten wirklichen Aufgabenanzeige geladen. Die benötigte Eingabeoberfläche und ihre Maschinen erhalten damit einen eigenen Ladezeitpunkt. Der Name bleibt CardHost; alle bisherigen Eigenschaften einschließlich `suspended`, Aufgabenschlüssel und Rückmeldungen bleiben identisch. Die Deklaration liegt außerhalb der Komponente, damit ihre Identität bei erneutem Rendern erhalten bleibt. Die vorhandene Aufgabenposition wird mit Suspense umgeben; als kurzfristiger Ladehinweis wird der bereits gelesene Satz „Wir öffnen das Kapitel …“ wiederverwendet. Keine neue deutsche Zeile, keine Textkürzung, kein Budget- oder Gatewechsel.

## Tatsächlicher Produktionsbau

Ein mit Root abgestimmter, einzelner `pnpm --filter web build` lief ohne parallelen Root-Bau vollständig durch, inklusive Funktionsdateiprüfung. Danach unverändertes `pnpm check:bundle`: Exit 0.

- Vorher: größter Nicht-Phaser-Block **153.853 Byte gzip**, tatsächlicher alter Batterielauf rot.
- Nachher: größter Nicht-Phaser-Block **150.276 Byte gzip**, 3.324 Byte unter unveränderter Grenze 153.600.
- Phaser bleibt genau ein Block mit **315.903 Byte gzip**; keine Duplikation.
- 44 Browserblöcke statt 43.

Logs: `final-lazy-card-build.log`, `final-lazy-card-bundle.log`; exakte Werte: `final-lazy-card-bundle-measurements.json`. Der dokumentierte vorherige reale Produktionsbau ist die rote Gegenprobe für die nicht getrennte Aufgabenoberfläche. Kein weiterer künstlicher Rückbau der Produktdatei vorgenommen.

## Erstladen und Zustand im echten Browser

Eigener isolierter Chrome auf dem laufenden Entwicklungsserver 3350. Erstes Kapitel neu geöffnet, Prolog über sichtbaren Knopf übersprungen, Startkarte bestätigt. Nur die bereits freigegebene Positionsabkürzung zur echten Buchentität verwendet; Aufgabe über normale Eingabe geöffnet. Die erstmals benötigte Kartenoberfläche erschien korrekt. Echte Namensauswahl `book` führte in den Farbschritt.

Anschließend Geschichte und Merkseite jeweils über ihre tatsächlichen Knöpfe geöffnet und wieder geschlossen. Der Farbschritt blieb erhalten, sein roter Auswahlknopf war exakt dasselbe DOM-Element; vorheriger und nachheriger Simulationstick beide 67. Damit verursacht die neue Ladegrenze keinen zusätzlichen Karten-Neustart bei diesem relevanten Rückkehrpfad. Dies ist ein gezielter Erstlade-/Zustandsbeleg, kein neuer vollständiger Level- oder Schnellkarten-Uhrtest.

`lazy-card-browser-results.json` enthält die tatsächlichen Texte/Werte. `lazy-card-reference-return.png` wurde geöffnet und visuell geprüft. Browser und Bedienprozess sind sauber geschlossen, Exit 0. Web-Typprüfung ebenfalls Exit 0. Der Produktionsbau belegt die wirkliche Dateitrennung; der Browserlauf belegt die Oberflächenfunktion im Entwicklungsspiel, nicht dessen Produktionsnetzwerkanfragen.

## Sprachstand und Grenzen

Der erneuerte vollständige Sprachauszug bleibt bytegleich bei 255 Zeilen, SHA-256 `5e50db4cbe12636cd3d141758cef3fc0aa9540a49a5f0c9f0c4ab0a00f022ae2`. Die Quellinventur bleibt jetzt ausdrücklich an der schon vorher geprüften gemeinsamen Basis `7161948936faabc5eab2fd51457e90616599424d` verankert; ein zwischenzeitlicher Root-Commit darf die vorangegangenen neuen Spieltexte nicht aus dem Auszug verschwinden lassen. Zuletzt geändert hat nur Root das Bildmanifest; dafür wurden die Quellenpins nochmals erneuert. Maßgeblich ist `blind-language/pin-verification.json`.

Kein Commit durch diese Lane. Root führt die nächste gemeinsame eingefrorene Messrunde durch; dieses Ergebnis beansprucht keine vollständige grüne Gesamtbatterie.
