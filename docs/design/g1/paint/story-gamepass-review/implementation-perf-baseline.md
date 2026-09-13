# CODEX DRAFT — NOT CANON

## Frische Produktionsbasis für den Story-Spielpass

Gemessene Basis: **7161948936faabc5eab2fd51457e90616599424d**, vom tatsächlich gestarteten Produktionsserver über `/api/version` bestätigt. Der Vergleich mit f45963c5 enthält ausschließlich die zusätzliche CLAUDE.md; der Runtime-Quellstand ist identisch. Es wurden keine früheren PR-425-Messwerte wiederverwendet und keine neue Story-Spielpass-Fassung gemessen.

| Phase | Laden ms | Konstruktion + Aufbau ms | Erstbild GPU ms | Eingeschwungen GPU ms | fps |
|---|---:|---:|---:|---:|---:|
| p1 | 612.5 | 126.8 | 2.8 | 1.0 | 60.1 |
| p2 | 853.4 | 96.0 | 1.9 | 1.2 | 60.4 |
| p3 | 597.3 | 112.6 | 0.7 | 0.9 | 60.1 |
| p4 | 774.1 | 46.3 | 0.8 | 0.6 | 60.5 |
| p9 | 952.0 | 131.2 | 0.6 | 2.5 | 60.1 |

Alle fünf Zeilen stammen aus jeweils drei frischen vollständigen Läufen des unveränderten `scripts/perf-visible.mjs` der Basis. Jede Phase brauchte genau drei Versuche, keine fehlenden Messfelder. Die Ausgabe bildet Mediane; Konstruktion wird wie im vorhandenen Rezept separat in Node gemessen und zur medianen Aufbauzeit addiert. Das bestehende Instrument speichert Medianzeilen und die Aufbauschritte des ersten Laufs, nicht sämtliche Einzelwerte seiner drei Durchläufe. `perf-ch01.json` und das ungekürzte `perf-ch01.log` sind genau diese unveränderte Instrumentausgabe. Zusätzlich liegen fünf echte Szenenabbilder `scene.p*.json` vor.

Kontrollseite: **61.08 fps**, Mindestwert 58, `hidden=false`, `visibilityState=visible`, warm=1. Node v24.20.0; eigener Chrome mit eigenem Profil und headless=new. Vor und nach der Reihe null fremde Messbrowser; eigener Chrome am Ende vollständig beendet. Der bestehende Entwicklungsserver 3350 wurde ausschließlich als fremder Server protokolliert und nicht verändert.

**Maschinenmakel:** Lastmittel vorher 5,43 / 5,38 / 7,05, nachher 26,35 / 10,52 / 8,78. Die Kontrollseite bestätigt ein gültiges Instrument, aber die Messung fand unter steigender Rechnerlast statt. Insbesondere Aufbauzeiten von 123,2 ms in p1, 107,0 ms in p3 und 125,7 ms in p9 werden nicht versteckt oder als Eigenschaft einer neuen Fassung gedeutet. Für einen späteren Vergleich muss dieser Makel mit angegeben werden; kleine Unterschiede belegen keinen kausalen Geschwindigkeitseffekt. Es wurde weder eine gute Messung ausgewählt noch ein schlechter Lauf verworfen.

## Isolierter Bau und Abhängigkeiten

Quellordner: `/Users/veho/Code/codex-lab/perf-baseline-71619489-story`. Exaktes `git archive` der oben genannten SHA, kein neuer Commit und kein Git-Arbeitsbaum. Alle **4.461** archivierten Dateien wurden gegen ihre Git-Blobkennungen und SHA256-Fingerabdrücke geprüft. Nach Produktionsbau und Messung sind **null getrackte Quelldateien geändert**. Dadurch liest auch die lokale Konstruktionsmessung den echten Basisstand.

Vorinstallierte Abhängigkeiten wurden mit dem bereits bewährten lokalen `cp -cR`-Verfahren kopiert; der Lockfile-Inhalt stimmt bytegenau mit dem installierten Bestand überein. **1.675** symbolische Verweise und **496** Paket-Exportauflösungen wurden geprüft: kein Verweis außerhalb des isolierten Basisordners, alle @domigo-Auflösungen in dessen eigenen packages/. Kein Installationslauf und keine Laufzeitverknüpfung in den bearbeiteten Root. `.env.local` wurde ausschließlich kopiert und auf Dateimodus 0600 gesetzt, weder gelesen ausgegeben noch in einen Bericht übernommen.

Produktionsbau: `next build`, Exit 0. Der Ausgangscode meldete bestehende Turbopack-Hinweise zur Dateipfadauflösung; der vollständige Bau-Log bleibt erhalten. Commitkennung beim Bau und Start war dieselbe tatsächliche Archivkennung. Port 3352 war vor Start frei. Der Server lieferte für alle fünf Levelabschnitte passende Kartenzeilen, Phase, Perf-Instrument und Baukennung; Beleg in `server-preflight.json`, dazu private rohe HTML-Antworten. Nach der Messung wurde nur der anhand seines Arbeitsordners identifizierte eigene Basisserver beendet. Port 3352 ist wieder frei; 3350/3344/3345 wurden nicht bedient.

Instrument-SHA256: `3135559c7ef770a588d444d9baabcbffba4aa7d8ac08cb9594659fba9df4b7ad`. Keine Anpassung des Instrumentes, keine neue Messbibliothek. Vorbereitung und Quellhashprüfung lehnen sich an `CH02_BILDBAU_BELEGE/codex-trial-after-perf-5c658cd/prepare.mjs` und `server-preflight.mjs` an; das aktuelle Messrezept folgt dem PERF-WÄCHTER-Abschnitt in 425_BERICHT.md.

## Reproduktion und Rohbelege

Alle Shells begannen mit `export PATH=/opt/homebrew/opt/node\@24/bin:$PATH && node -v`; rechenintensive Prozesse liefen mit `nice -n 15`. Exakte Befehle und Sitzungsausgänge: `build-command.json`, `server-command.json`, `perf-command.json`. Der Messbefehl lautet:

```sh
nice -n 15 node --experimental-strip-types scripts/perf-visible.mjs --port 3352 --phases p1,p2,p3,p4,p9 --runs 3 --floor 58 --scene-dump /Users/veho/Code/codex-lab/trial-berichte/CH01_STORY_SPIELPASS/perf-baseline/scene --json /Users/veho/Code/codex-lab/trial-berichte/CH01_STORY_SPIELPASS/perf-baseline/perf-ch01.json --label baseline-71619489-ch01-warm1
```

Weitere Belege unter `CH01_STORY_SPIELPASS/perf-baseline`: prepare.mjs/log/result, source.tar, source-manifest.json, source-after-build.json, dependency-isolation.json, build.log, server.log, server-preflight.mjs/log/json, perf-ch01.log/json, fünf Szenenabbilder und server-stop.json. Der vollständig gebaute Basisordner bleibt zur Wiederholung erhalten. Kein Commit, Push oder Eingriff in die neue Fassung.
