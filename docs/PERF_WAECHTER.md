# DER PERF-WÄCHTER

_Kokis Regel, unverhandelbar: **Performance ist paramount.** Das Spiel „builds and
falls" mit Smoothness. PS1-Maßstab: 60 fps überall, nie Zeitlupe, nie Ruckler.
**Kokis Trade steht: lieber ein kleiner Ladebildschirm als je ein Stottern zur
Laufzeit.**_

Dieses Dokument stand bis zum 14.08.2026 nur in iCloud
(`PLATFORM MASTER/SESSION-PROMPTS/R5-OPUS-WAVE-2026-08-11/PERF_WAECHTER.md`).
Es liegt jetzt **im Repo**, weil eine Maschine es lesen können muss:
`scripts/check-perf-budget.mjs` prüft bei jedem CI-Lauf, dass die Zahlen hier und
die Zahlen in `packages/game-paint/src/perfBudget.ts` dasselbe sagen. Die iCloud-
Fassung bleibt der Aushang; **kanonisch ist ab jetzt diese hier.**

## 1 · Die Tabellen-Pflicht

Jede Session, die **Rendering, Assets, Entities oder den Karten-DOM** anfasst,
schreibt die `?perf=1`-Zahlen für ALLE fünf Phasen **vorher/nachher** in ihren PR.
**Kein PR ohne diese Tabelle** — der CI-Job `perf-contract` prüft es, und
`.github/pull_request_template.md` liefert sie ausgefüllt zum Eintragen.

## 2 · Die Budgets

| Zahl | Grenze | Wer erzwingt sie |
|---|---|---|
| eingeschwungen (GPU je Bild) | ≤ 4 ms | `scripts/measure-create.mjs` (Hand) |
| Erstbild (GPU) | ≤ 35 ms | nur ein sichtbarer Schirm (Koki) |
| `create()` | ≤ 100 ms | `scripts/measure-create.mjs` (Hand) |
| Phase-Assets (artScope) | ≤ 35 MB | `artScope.test.ts` — **CI** |
| Bundle (je Nicht-Phaser-Brocken, gzip) | ≤ 150 KB | `check-game-bundle.mjs` — **CI** |
| Phaser in EINEM faulen Brocken (gzip) | ≤ 400 KB | `check-game-bundle.mjs` — **CI** |
| Kunst, die niemand lädt | ≤ 57 Blätter | `check-paint-art.mjs` — **CI** |

**Zur letzten Zeile (R90, R5-W4b · W3).** Die Tot-Kunst-Decke hat seit dieser Runde
**einen** Eigentümer. Vier Berichte der Welle 4 nannten drei verschiedene Zahlen
(61 / 60 / 58), weil jede Bahn, die Kunst verdrahtet oder löscht, den Stapel senkt,
ohne die Decke zu berühren — am Ende wusste niemand mehr, was sie IST.
**Gemessen 2026-08-16 nach Welle 4b: 57 Blätter / 37,2 MB** (`check-perf-budget.mjs`,
Stand `3daaf47`). Die Decke steht auf dem Messwert, **ohne Luft**: eine Decke über der
Wirklichkeit verliert genau die Warnung, für die sie gebaut wurde (D-193). Wer Blätter
hinzufügt, hebt sie **im selben PR, mit einem Grund, den ein Prüfer liest**; wer
Blätter verdrahtet oder löscht, **senkt sie im selben PR** — jeder Lauf sagt die
verbliebene Luft laut an.

Budget gerissen → **erst optimieren**; geht es nicht ohne Qualitätsverlust →
**LADEBILDSCHIRM, nie Ruckler**. Der Ladebildschirm existiert seit R5-W3 · E5
(`.pb-building`, `PaintCallbacks.onReady`).

## 3 · Was headless messbar ist — und was nicht

**Korrektur vom 14.08.2026 (E5), gemessen statt geglaubt.** Die Regel „ein
Automatisierungs-Tab ist verborgen, dort gibt es keine Bildrate" (P-56/P-57) gilt
für die **MCP-Browser-Flächen**. Für einen **selbst gestarteten
`--headless=new`-Chrome** gilt sie NICHT: dort meldet die Seite
`document.hidden === false`, `visibilityState === "visible"`, und eine leere
Kontrollseite im selben Browser liefert **60,2 fps**. Bildraten sind dort also
messbar — und die Kontrollmessung ist Pflicht, sonst weiß niemand, ob eine
niedrige Zahl das Spiel oder das Werkzeug beschreibt.

Trotzdem bleibt zweierlei wahr:
* **Die Erstbild-Zahl schwankt** in derselben Bedingung stark (36–236 ms, E4) —
  sie gehört auf einen echten Schirm.
* **GPU-Zeit** über `EXT_disjoint_timer_query` ist zulässig und zählt echte
  GPU-Arbeit statt Wartezeit.

## 4 · Das Messritual (so misst Koki)

1. Kapitel mit **`?perf=1`** aufrufen (Lehrer-Tür, wie `?grid=1`). Unten links
   stehen drei Zeilen: Laden · Aufbau (`create()`) · Erstbild-GPU · eingeschwungen.
2. Dieselbe Seite noch einmal mit **`&warm=0`** — das schaltet den Vorwärmer ab.
   **Der Vergleich der beiden IST die Messung**; ein Build misst sich gegen sich
   selbst, also kann kein anderer Unterschied dazwischenkommen.
3. Die interessante Zahl ist die dritte Zeile, erster Wert.

## 5 · Hygiene

* Eigener Port je Session (P-65) · vor Live-Läufen
  `typeof sim.<neueMethode> === "function"` prüfen.
* `pnpm build` killt einen laufenden `next start` (P-59) → danach neu starten.
* Exit-Codes separat prüfen: `cmd > log 2>&1; echo "EXIT=$?"` — `cmd | tail && echo OK`
  prüft `tail` (P-60).
* **Rationiere in der Einheit der Abrechnung** (P-53): CPU-Millisekunden messen
  keine GPU-Arbeit.
* **Eine Zahl, die sich nicht bewegt, wenn man ihre angebliche Ursache entfernt,
  misst etwas anderes.** Diese Regel hat in E5 zweimal zugeschlagen — einmal gegen
  eine Hypothese, einmal gegen ein Instrument.
