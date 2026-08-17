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
| Kunst, die niemand lädt | ≤ 53 Blätter | `check-paint-art.mjs` — **CI** |

**Zur letzten Zeile (R90, R5-W4b · W3; R104, Hotfix nach dem Zug).** Die Tot-Kunst-Decke
hat seit dieser Runde **einen** Eigentümer. Vier Berichte der Welle 4 nannten drei
verschiedene Zahlen (61 / 60 / 58), weil jede Bahn, die Kunst verdrahtet oder löscht, den
Stapel senkt, ohne die Decke zu berühren — am Ende wusste niemand mehr, was sie IST.
**Gemessen 2026-08-16 NACH dem letzten Merge der Welle 4b: 53 Blätter / 36,2 MB**
(`check-perf-budget.mjs`, Stand `ae0dd42`). W3 hatte auf seiner eigenen Basis `3daaf47`
57 Blätter / 37,2 MB gemessen; die fünf davor gemergten PRs senkten den Stapel um vier
(A6b löschte `krakel_b`, D3b verdrahtete `obj_chair`/`obj_soundsystem`/`obj_tablet`) —
deshalb setzt der Eigentümer die Decke **nach** dem letzten Merge einer Welle, nie
parallel dazu (R104). Die Decke steht auf dem Messwert, **ohne Luft**: eine Decke über
der Wirklichkeit verliert genau die Warnung, für die sie gebaut wurde (D-193). Wer
Blätter hinzufügt, hebt sie **im selben PR, mit einem Grund, den ein Prüfer liest**; wer
Blätter verdrahtet oder löscht, **senkt sie im selben PR um sein eigenes Delta** — jeder
Lauf sagt die verbliebene Luft laut an, und der Post-Zug-Eigentümer misst neu.

**Der Post-Zug-Handgriff (R104, W4 — dieser Absatz gehört der Werkzeug-Bahn).** Die
letzte Bahn einer Welle mergt zuletzt und macht davor drei Handgriffe, in dieser
Reihenfolge und erst, wenn alle Vorgänger auf `origin/main` stehen: (1) Tot-Kunst neu
messen und die Decke plus die Zeile in der Tabelle oben plus die Register-Zeilen auf den
**gemessenen** Wert setzen — nie auf den erinnerten; (2) die datierten Ausnahmen des
Naht-Wächters prüfen (`check-png-seams.mjs` meldet »schal« und »gesprengt« selbst) und
das Ergebnis in den PR schreiben, ohne das Datum still zu verlängern (R106); (3) den
Perf-Nachher-Lauf der Welle fahren und seine Tabelle in den PR setzen. Der Selbsttest des
Budget-Tores wird dabei **gelaufen, nicht angefasst**: er tampert seit dem Hotfix gegen
den MESSWERT, nicht gegen die Konfiguration (P-71), und genau diese Eigenschaft ist es,
die eine Bahn ihm nicht nebenbei wegnehmen darf.

**Was eine EINZELNE Perf-Messreihe nicht trägt (W4, 2026-08-17, D-335).** Drei Läufe von
`harvest-perf.mjs` mit gültiger Kontrollseite (61,8 fps, sichtbar) zeigen auf **demselben
Baum** p9 GL-Texturen 259 gegen 86, p2 75 gegen 191 und p4 Heap 94,8 gegen 167,5 MB; die
Bildrate schwankt je Phase um 5 bis 11. Der Sammler geht alle fünf Phasen in EINER
Browser-Sitzung durch, und was aus einer vorher besuchten Phase noch im Speicher liegt,
steht in der nächsten Zeile. Für **CPU je Bild** sind die Zahlen brauchbar; für
**Texturen und Heap** trägt ein Vorher/Nachher aus je einem Lauf keine Aussage, und ein
PR, der daraus ein Urteil ableitet, behauptet mehr, als er gemessen hat. Wer diese
Spalten braucht, misst je Phase in einer frischen Sitzung oder nennt die Streuung mit.

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
