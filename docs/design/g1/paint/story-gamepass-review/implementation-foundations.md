# CODEX DRAFT — NOT CANON

# Kapitel 1 · Grundlagen für Laufvarianten und Spielprofil

13.09.2026. Implementiert, noch nicht durch diese Bahn in die Oberfläche eingebunden. Keine Commits. Root besitzt Einbau und vollständige Prüfserie.

## Geänderte Dateien

- `packages/game-paint/src/cards/routing.ts`
- `packages/game-paint/src/cards/run-variants.ts` (neu)
- `packages/game-paint/src/cards/run-variants.test.ts` (neu)
- `apps/web/lib/paint-story-profile.ts` (neu)
- `apps/web/lib/paint-story-profile.test.ts` (neu)

Alle Pfade im Trial-Klon `/Users/veho/Code/codex-lab/trial-domigo-v2`. Keine anderen Repo-Dateien bearbeitet.

## Einbauvertrag für Root

### Laufstart und Karten

`initRoute(seed?: string)` erhält optional einen Lauf-Startwert. Ohne Argument ist der alte Zustand exakt `{cursors:{}}`; bestehende ungesäte Auswahl einschließlich fester Startposition bleibt erhalten. Mit Seed werden ausschließlich `use="boss"` und `use="quickfire", skin="moths"` gemischt. Jeder komplette Durchgang eines Pools enthält jede Karte genau einmal. Der nächste Durchgang bekommt eine neue deterministisch gemischte Reihenfolge. Unabhängige Pools behalten unabhängige Cursor. Keine zusätzliche übersprungene Karte, keine Umordnung von `orderedTask` oder direkter `requestedTask`-Bindung.

Root legt den Seed einmal in BuchClient beim tatsächlichen neuen Lauf an, hält ihn über Phasen-/Bonuswechsel und reicht ihn an PaintGame. `routeRef` wird einmal mit `initRoute(runSeed)` aufgebaut. Kein erneutes Initialisieren bei einem Antwortversuch oder einem Overlaywechsel. Bei Wiederholung eines aufgezeichneten Laufs kommt der aufgezeichnete Seed hinein; das Erzeugen wird dann übersprungen.

`numberWheelForEncounter(template, seed, scope, encounterIndex)` produziert eine komplette Radkarte. `scope` z.B. `ch01:p2:moths`; `encounterIndex` ist der stabile Index der Entität in der geplanten Begegnungsliste, kein Versuchs-/Renderzähler. Die ersten25 Positionen verwenden jede Zahl 1–25 genau einmal; damit auch die drei Falter unterschiedliche Zahlen. Derselbe Seed/Scope/Index erzeugt dieselbe Karte nach einem Fehler oder Wiedereinstieg. `runNumberAt` liefert die Zahl separat, falls die Weltbeschriftung sie braucht; `numberWheelVariant(template,value)` erlaubt die direkte Ausformung einer bekannten Zahl. `RUN_NUMBER_WORDS` ist die gemeinsame Zahlworttabelle.

Die Vorlagen müssen nummernneutrale Bilder, `storyDe`, `stimulus.showsDe` und `grounding` tragen. Der Generator ersetzt `shown`, `answer`, `values` und `hints` zusammen und entfernt optionalen `promptEn`/`evidence`, damit dort kein alter Zahlenwert mitwandert. Er kann keine in ein Bild gemalte13 automatisch austauschen. Root speichert/gehaltene Overlaykarte verwenden, Szene und Bildhinweis aus derselben gewählten Zahl erzeugen. Die neuen Hinweise sind Zahl-/Wort-Zählhinweise ohne ausgeschriebene Zielantwort. Inhaltlicher Sprachpass dieser zwei neuen deutschen Zeilen bleibt Pflicht.

### Spielprofil

`PaintProfileContext = {playerKey, allowedClassmateIds, storage?}`. `playerKey` muss eine stabile Konto-/Spielerkennung sein. Niemals für alle Konten die Konstante `player` verwenden. Das Modul bildet einen getrennten Schlüssel je Spieler, bei leerem/zu langem Schlüssel wird nicht gespeichert. `allowedClassmateIds` stammt aus Roots geprüftem Klassenverzeichnis; das Modul erfindet keine Kanon-Namen und verwirft unbekannte IDs. `storage` kann ein Testadapter oder `null` sein, sonst wird Browser-localStorage versucht.

- `readPaintStoryProfile(ctx)` → `{version:1,displayName,readPrologueVersions,rescuedClassmateIds}`.
- `cleanPaintDisplayName(value)` → Unicode-Normalisierung, unsichtbare Steuerzeichen entfernt, Leerraum bereinigt, maximal32 Unicode-Codepunkte. Es wird kein Kontoname geändert.
- `withPaintPrologueRead(profile, edition)` und `paintPrologueSeen(profile, edition)` → genaue Comicversion, z.B. `ch01-comic-v1`; ein neuer Comic bleibt für alte Leser neu.
- `withPaintClassmateRescued(profile,id,allowedIds)` → bekannter Name einmal, höchstens15 gerettete Figuren.
- `savePaintStoryProfile(ctx,profile)` → **`{profile,persisted}`**. Root übernimmt immer das bereinigte `profile` in React-Zustand. `persisted=false` heißt blockierter/unverfügbarer Speicher; aktueller Lauf bleibt funktional, kein falsches dauerhaft-gespeichert-Versprechen.
- `createPaintRunSeed(cryptoSource?)` →32Hexzeichen aus16Crypto-Bytes, oder `undefined` wenn Crypto nicht verfügbar ist. Aufrufen nur am App-Laufanfang. Kein Zufall in `game-paint`; kein Zeit-/Math.random-Fallback.

Namenseingabe ist unbewertet. Root muss Speicherung und spätere Anrede ausdrücklich an dieses Profil anschließen; diese Grundlage allein zeigt noch keinen Namen im Spiel. Rettungsstatus nur bei echter Rettung speichern, nicht beim Aufschließen des Pennals. Konto-Wechsel muss BuchClient/Spielprofil neu initialisieren. Lokaler Fortschritt ist noch keine geräteübergreifende Datenbankspeicherung.

## Prüfungen

- `pnpm --filter @domigo/game-paint exec vitest run src/cards/run-variants.test.ts src/cards/boss-router.test.ts` → Exit0,13/13Tests. Log `foundations-game-tests.log`.
- `node --test lib/paint-story-profile.test.ts` in `apps/web` → Exit0,6/6Tests. Übliche Node-Warnung über fehlendes package-module-Feld, kein Testfehler.
- `pnpm --filter @domigo/game-paint typecheck` → Exit0. Log `foundations-game-types.log`.
- `pnpm exec tsc --noEmit` in `apps/web` → Exit0. Log `foundations-web-types.log`.
- `pnpm exec eslint lib/paint-story-profile.ts lib/paint-story-profile.test.ts` → Exit0. Log `foundations-web-lint.log`.

Getestet: gleiche/verschiedene Seeds; vollständige wiederholte Poolzyklen; andere Aufgaben unverändert; getrennte Poolcursor; keine Mutation an gehaltenen Karten/Inputzustand; Merle-Reihenfolge; direkte Bindung+falscher Sprecher rot;25Zahlpaare in beiden Richtungen;3erste Zahlen verschieden; stabile wiederholte Expansion; ungültige Eingaben rot; getrennte Benutzer; Unicode/Bereinigung/Längenlimit; Comicversion; unbekannte/doppelte Mitschüler; kaputte JSON/falscheVersion; blockierter Speicher; Cryptoausfall.

## Reale Manipulationsproben

Isolierte Kopien der tatsächlichen Quellen unter dem in `foundations-tamper.json` protokollierten temporären Verzeichnis. Der echte Import zur vorhandenen Shufflefunktion bleibt erhalten; kein Repo-Quelltext dafür hin-/zurückgeschaltet.

| Manipulation | Kontrolle | Manipulierte Fassung | Nachweis |
|---|---|---|---|
| Gesäte Bossmischung durch Dateireihenfolge ersetzen | Exit0 | Exit1 | Verschiedene Seeds liefern keine unterschiedlichen Öffnungen mehr |
| Zahlengenerator gibt immer1 zurück | Exit0 | Exit1 | Drei Begegnungen tragen dieselbe Zahl |
| Spielprofil-Schlüssel für alle Spieler gleich machen | Exit0 | Exit1 | Name von SpielerA erscheint bei SpielerB |

Logs `tamper-routing-no-shuffle-{control,mutant}.log`, `tamper-number-constant-{control,mutant}.log`, `tamper-profile-shared-key-{control,mutant}.log`; Ergebnisübersicht `foundations-tamper.json`.

## Ehrliche Grenzen

Keine UI-, Sim-, Bild-, Bänder- oder Speicherrouten-Anbindung in dieser Teilaufgabe. Die reine Nichtmutationsprüfung ist kein echter Browserbeweis für Fehlversuche; Root muss den gehaltenen Overlayablauf zusätzlich spielen. Unterschiedliche Seeds können zufällig dieselbe erste Karte/Zahl liefern; Reproduzierbarkeit und faire Vielfalt bedeuten nicht, dass jeder neue Lauf garantiert mit einer anderen Zahl als der unmittelbar vorige beginnt. Jede25er-Zahlenrunde ist vollständig, aber an einer Rundengrenze ist eine direkte Wiederholung möglich. Für die drei geplanten Mothbegegnungen innerhalb einer Runde gibt es keine Wiederholung. Bosszyklen ebenso fair, aber ein Grenzpaar kann identisch sein. Wenn das künftig ausgeschlossen werden soll, wäre eine explizite Grenzregel erforderlich, keine heimliche Cursorüberspringung.
