# Mitarbeiten an DomiGo v2

## Performance ist paramount

Kokis Regel, unverhandelbar: das Spiel „builds and falls" mit Smoothness. Die
Budgets, wer sie erzwingt und was headless überhaupt messbar ist, stehen in
**[docs/PERF_WAECHTER.md](docs/PERF_WAECHTER.md)**. Zwei Sätze daraus, weil sie
jede Sitzung betreffen:

* **Kein PR ohne die Wächter-Tabelle**, wenn er Rendering, Assets, Entities oder
  den Karten-DOM anfasst. Die Vorlage steht im PR-Formular, der CI-Job
  `perf-contract` prüft es.
* **Lieber ein kleiner Ladebildschirm als je ein Stottern zur Laufzeit.**

### Das Messritual (so misst Koki, in zwei Klicks)

1. Das Kapitel mit **`?perf=1`** aufrufen — eine Lehrer-Tür wie `?grid=1`. Unten
   links erscheinen drei Zeilen:

   ```
   p2  laden 2768 ms (137 Bilder)  ·  aufbau 427 ms
   ERSTES BILD  GPU 11.7 ms  ·  danach 1.9 ms  ·  6 Zeichenaufrufe
   vorgewärmt 137 (offen 0, Shader ja)
   ```

   *laden* = wie lange die Bilder brauchten (hängt am Netz, nicht am Build).
   *aufbau* = `create()`, der Moment, in dem die Phase gebaut wird.
   **Die interessante Zahl ist die dritte Zeile, erster Wert** — was das erste
   Bild die Grafikkarte gekostet hat.

2. Dieselbe Seite noch einmal mit **`&warm=0`**. Das schaltet den Vorwärmer ab.
   **Der Vergleich der beiden IST die Messung:** ein Build misst sich gegen sich
   selbst, also kann kein anderer Unterschied dazwischenkommen.

### Und so misst eine Sitzung (headless, mit Kontrolle)

```bash
pnpm build
(cd apps/web && npx next start -p 4056)          # eigener Port je Sitzung (P-65)
node --experimental-strip-types scripts/measure-create.mjs --port 4056
```

Das Skript meldet je Phase `bau` (der Konstruktor, in Node gemessen), `aufbau`
(`create()`, im echten Browser) und `laden`. **Nur `bau + aufbau` zählt als
Verbesserung** — `aufbau` allein lässt sich verbessern, indem man Arbeit eine
Funktion früher schiebt, und das Kind wartet danach genauso lang.

**Wenn du eine Bildrate behauptest, miss im selben Lauf eine leere Seite.** Ein
selbst gestarteter `--headless=new`-Chrome zeichnet wirklich (E5 hat das gegen
P-56/P-57 nachgemessen), aber ohne Kontrollmessung weiß niemand, ob eine
niedrige Zahl das Spiel oder das Werkzeug beschreibt.

## Die Tore

Alle laufen in CI (`.github/workflows/ci.yml`), und `check-ci-gates.mjs` sorgt
dafür, dass keines still herausfallen kann. Lokal:

```bash
pnpm typecheck && pnpm lint && pnpm test
node --experimental-strip-types scripts/check-perf-budget.mjs
node scripts/check-fonts.mjs
```

**Exit-Codes getrennt holen** — `cmd | tail && echo OK` prüft `tail`, nicht `cmd`
(P-60):

```bash
cmd > log 2>&1; echo "EXIT=$?"
```

**Jede neue Prüfung braucht ihren Selbsttest.** Ein Tor, das nie rot werden kann,
hat nichts bewiesen; deshalb trägt jedes `--selftest` und CI läuft beide Seiten.

## Schriften

Die drei Familien liegen als Dateien im Repo (`apps/web/app/fonts/`) und werden
über `next/font/local` geladen. **Nie wieder `next/font/google`** — das lud die
Schriften beim BAUEN aus dem Netz und machte grüne Builds von der Erreichbarkeit
eines Dritten abhängig (D-79). `scripts/check-fonts.mjs` hält die Tür zu.

## Die Level-Datei wird chirurgisch editiert, nie neu geschrieben

`content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json` hat ein Format, das
kein Werkzeug wiederherstellen kann: **ein Leerzeichen Einrückung je Ebene, Umlaute als
echte UTF-8-Zeichen (nicht in der Backslash-u-Schreibweise), und KEIN abschließendes
Zeilenende** — die letzten zwei Bytes sind `"` und `}`. Das entspricht
Python-`json.dump(..., ensure_ascii=False, indent=1)`, wie es die Skripte unter
`scripts/story/` benutzen.

**Es ist aber nicht reproduzierbar, und das ist der Grund für diese Regel.** Gegen einen
frischen Dump weichen **elf Zeilen** ab (113–116, 306–308, 435–438): sie tragen fünf statt
sechs Leerzeichen — von Hand nachgetragene `ausspracheDe`/`ankerEn`/`falscheFormEn`/
`richtigeFormEn`-Felder in den `regelseite`-Objekten. Wer die Datei neu dumpt, schreibt
diese elf Zeilen still um und erzeugt einen Diff, der mit der eigenen Änderung nichts zu
tun hat.

**Also: in der Datei editieren, nicht sie erzeugen.** Nachmessen, wenn du unsicher bist:

```bash
git show origin/main:content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json | tail -c 4 | xxd
```

Das gilt für die Level-Dateien. `ch01.tasks.v2.json` endet dagegen **mit** einem
Zeilenende — es ist keine Repo-weite JSON-Regel, sondern eine Eigenschaft dieser Dateien.

## Zwei Regeln, die diese Codebasis teuer gelernt hat

* **Eine Zahl, die sich nicht bewegt, wenn man ihre angebliche Ursache entfernt,
  misst etwas anderes.** Prüfe eine Hypothese, indem du die Ursache wegnimmst —
  nicht, indem du die Zahl noch einmal liest.
* **Grün heißt nicht richtig.** Ein Tor prüft Zitate, keine Behauptungen. Frag
  bei jedem Artefakt: was könnte hier selbstbewusst erfunden werden, das keine
  Strukturprüfung sieht? — und bau die Prüfung genau dafür.
