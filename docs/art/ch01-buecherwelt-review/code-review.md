# Unabhängige Codeprüfung

**CODEX DRAFT — NOT CANON · DOCUMENT · 13.09.2026**

Geprüft wurde der nicht eingecheckte Stand gegen `HEAD` `2329822e3c33e769801f0570576d7bd875dd3726` im autorisierten Trial-Lab `/Users/veho/Code/codex-lab/trial-domigo-v2`, Branch `codex/ch01-buecherwelt`. Die Prüfung entstand direkt aus Quellcode und eigenen kleinen Gegenproben, ohne andere Prüfberichte. Kein Produktcode wurde verändert.

## Befunde

### P2 · Veraltete Möbel-Erwartung blockiert den Kapiteltest

**Datei:** `packages/game-paint/src/oneBlockCutover.test.ts:301–302` · **Sicherheit:** bestätigt.

Der neue Test erwartet für die Bonuskammer weiterhin sechs alte Möbelstücke (`plat_bench_2`, `plat_bundle_1`, `plat_desk`, jeweils zweimal). Die im selben Änderungsstand neue Zusammenstellung plant vier vollständige Bücher (`terrain_dream_bundle_p9`, `terrain_dream_bundle_short_p9`, `terrain_dream_folio_p9`, `terrain_dream_folio_short_p9`). Der gezielte Testlauf endet deshalb mit **Exit 1: 27 bestanden, 1 fehlgeschlagen**. Damit bleibt die reguläre Testsperre vor Übernahme rot, obwohl die vier neuen Stücke die beabsichtigte Änderung sind.

**Kleinster Fix:** Die erwartete sortierte Liste durch genau diese vier neuen Namen ersetzen. Die getrennte Prüfung, dass der Körperumbau die Möbelplanung nicht verändert (`after === before`), beibehalten.

### P2 · Laufkantenprüfung übersieht fast vollständig transparente Laufbreite

**Datei:** `scripts/ground-plane-geometry.mjs:28–32,44,50–52` · **Sicherheit:** durch synthetische Gegenprobe bestätigt; kein behaupteter Schaden an einem gegenwärtigen Kunstblatt.

`maxWidth` zählt ausschließlich bereits bemalte Bildpunkte. Sowohl die Abdeckung als auch die zusammenhängend getragene Breite werden durch diese verkleinerte Zahl geteilt. Auch die beiden Außenbereiche beziehen sich auf die verbliebene Malerei, nicht auf die im Spiel tatsächlich begehbare Breite. Große transparente Seitenränder — Alpha ist der Durchsichtigkeitswert eines Bildpunkts — verschwinden damit aus allen Nennern.

**Gegenprobe ohne Dateiänderung:** Ein 128×64-Bild, durchsichtig außer einem 16 Pixel breiten Rechteck bei `x=56…71`, `y=8…63`; Deklaration `cells: 2`, `pxPerCell: 64`, `deck: 8/64`. Der echte Export `judgeBinding` liefert **keinen Fehler**, `coverage=1`, `reach=1`, `supportedSpan=16`, `tiltDeg=0`. Der echte `planMass` plant dasselbe Bild gleichzeitig auf **32 Weltpixel / zwei Laufzellen**. Sichtbar bemalt sind davon nur **vier Weltpixel**. Das neue Tor bestätigt somit eine Laufkante, deren begehbare Breite zu 87,5 % unsichtbar ist. Die bestehende Größenprüfung in `check-composition.mjs:1293–1295` erkennt diesen Fall ebenfalls nicht: Die Dateibreite bleibt korrekt bei 2×64 Pixeln.

**Auswirkung:** Ein fehlerhafter späterer Import mit großen transparenten Rändern kann trotz grüner Laufkantenprüfung den Spieler über unsichtbare Plattformbereiche laufen lassen. Dies betrifft die Aussagekraft des neuen Prüftors, nicht eine nachgewiesene aktuelle Spielregression.

**Kleinster Fix:** Zusätzlich zur bestehenden Konturprüfung die tragende Laufbreite gegen die deklarierte gesamte Bild-/Montagebreite prüfen und ihre beiden Enden an dieser Breite verankern; kleine Malränder ausdrücklich tolerieren. Eine Gegenprobe mit dem oben beschriebenen mittigen Rechteck muss rot werden. Das bestehende relative Maß für Konturqualität kann daneben bestehen bleiben.

## Wie geprüft

- Kanonische Fable-Methode samt Prüferhinweisen und lokale `AGENTS.md` gelesen; Node **v24.20.0** bei jedem Shellstart bestätigt.
- Vollständige Änderungen gelesen: `composition.ts`, `visualBodies.ts`, `oneBlockCutover.test.ts`, `check-composition.mjs`, `check-ground-plane.mjs`; zusätzlich neue `ground-plane-geometry.mjs`, `ground-plane-contacts.mjs`, `ground-plane-selftest.mjs` und `docs/art/import-ch01-buecherwelt.mjs`. Relevante Planungs- und Größenprüfpfade in `mass.ts` und `check-composition.mjs` verfolgt.
- `nice -n 15 pnpm --filter @domigo/game-paint exec vitest run src/oneBlockCutover.test.ts`: **Exit 1**, 27/28 bestanden; Fehler wie oben.
- `nice -n 15 node scripts/check-ground-plane.mjs --selftest`: **Exit 0**, vorhandene positive/negative Geometrie-, Auswahl- und Duldungsfälle bestehen.
- `nice -n 15 node docs/art/import-ch01-buecherwelt.mjs --selftest`: **Exit 0**, 14 Prüfgruppen bestehen, darunter Bildregistrierung, Transparenzbehandlung, Eingabeprüfung und unveränderte frühere Ausgaben bei einem späteren Dekodierfehler.
- Eigene Gegenprobe für transparente Plattformränder direkt gegen `judgeBinding` und `planMass`: reproduzierbar grün trotz 87,5 % fehlender sichtbarer Laufbreite.

Keine weiteren belastbaren P1/P2/P3-Befunde innerhalb dieses Prüfauftrags. Das ist keine vollständige Produktfreigabe: kein Browserlauf, keine Leistungsprüfung, kein großer Testlauf, keine gesamte Typprüfung und keine Bewertung des parallel aktualisierten Kunstquellenpakets oder der Bildästhetik. Die Änderungen im Arbeitsverzeichnis können nach dem genannten Testlauf weitergehen; die Befunde beziehen sich auf den hier dokumentierten gelesenen Stand.

## Nächste Schritte

Der Auftraggeber übernimmt oder verwirft die zwei Befunde anhand der konkreten Gegenproben. Nach Korrekturen den kleinen Kapiteltest und die Geometrie-Selbsttests erneut ausführen; der neue transparente-Ränder-Fall gehört dabei in die dauerhafte Prüfung. Von Koki ist für diesen Prüfbericht nichts erforderlich. Produktionsflächen und Mission Control bleiben unberührt.

## Unabhängige Nachprüfung der Korrekturen · 13.09.2026, 09:12 Uhr

**Ergebnis: Beide oben dokumentierten P2-Befunde sind im nachgeprüften Arbeitsstand behoben.** Die ursprünglichen Befunde bleiben als Verlauf und Begründung der Gegenproben erhalten.

- Die erwartete Bonus-Möbelliste enthält jetzt genau die vier tatsächlich geplanten neuen Bücher. Eigener erneuter Lauf von `nice -n 15 pnpm --filter @domigo/game-paint exec vitest run src/oneBlockCutover.test.ts`: **Exit 0, 28/28 bestanden**.
- `measureDeck` prüft zusätzlich die gemalte Breite gegen die gesamte PNG-Breite; auch die zusammenhängend getragene Spanne verwendet diesen vollständigen Bildrahmen. Meine ursprüngliche eigene 16-von-128-Pixel-Gegenprobe wurde unverändert erneut ausgeführt: **jetzt zwei Fehler**, beide ausdrücklich wegen nur **12,5 %** des montierten Bildrahmens. Die bisherige relative Konturprüfung bleibt ergänzend bestehen. Der neue dauerhafte Gegenfall ruft den echten `judgeBinding`-Pfad auf.
- Eigener erneuter Lauf von `nice -n 15 node scripts/check-ground-plane.mjs --selftest`: **Exit 0**, einschließlich des neuen Gegenfalls sowie der bisherigen gültigen Tisch-/Pult-/Pigmentlochfälle.
- Eigener erneuter Lauf von `nice -n 15 node scripts/check-ground-plane.mjs` mit den realen Bildern: **Exit 0, 16 aktive Bilder bestanden, 0 Duldungen**. Ihre gemalte Breite an der Laufkante beträgt **87,5–97,4 %** des vollständigen Bildrahmens. Damit erzeugt die neue 80-%-Grenze beim aktuellen Bestand keinen fälschlich roten Befund.

Keine weitere belastbare Nebenwirkung dieser beiden Korrekturen gefunden. Die 80-%-Grenze bleibt eine erklärte Bildtoleranz, kein Nachweis, dass jeder einzelne begehbare Pixel bemalt ist. Nicht erneut geprüft wurden unveränderte Importerfunktionen; Browser, Leistung und Gesamtbatterie bleiben außerhalb dieser Nachprüfung. Keine Produktänderungen durch den Prüfer. Nächster Schritt ist die reguläre Gesamtprüfung durch die ausführende Hauptaufgabe; von Koki ist für diese Nachprüfung nichts erforderlich.
