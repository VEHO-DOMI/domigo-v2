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
| Audio (Platte) | ≤ 6 MB | `check-audio.mjs` — **CI** |
| Audio (decodiert, JS-Heap) | ≤ 16 MB | `check-audio.mjs` — **CI**, zur Laufzeit in `?perf=1` |

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

**Verweis (K4, 2026-08-17):** die drei Regeln, die aus diesem Vorfall geworden sind, stehen
als Rulings **R104** (der Post-Zug-Schritt gehört dem Eigentümer, nie einer parallelen Bahn)
· **R105** (keine Ratsche für die Decke, D-253 bleibt zu — Warnung plus Post-Zug-Schritt) ·
**R115** (jede Perf-Tabelle wird aus **sichtbarem** Chrome gemessen, mit einer Kontrollseite,
die 60 fps zeigen MUSS; leere ms-Spalten oder eine fehlende Vorher-Spalte sind kein
Erfüllen) — und die Merge-Pflichten, die daran hängen, stehen in der Merge-Tabelle des
BOOT-SHEETs, wo Koki sie liest, nicht nur im Text eines PRs.

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

## 3b · Wie man die Tabelle nimmt (R115) — R5-W5 · E6

**Es gibt ab jetzt genau EIN Rezept, und es ist ein Skript:**

```
pnpm build && (cd apps/web && npx next start -p <dein Port>)
node --experimental-strip-types scripts/perf-visible.mjs --port <dein Port> --runs 3 --json vorher.json
# … deine Arbeit …
node --experimental-strip-types scripts/perf-visible.mjs --port <dein Port> --runs 3 --baseline vorher.json
```

Der zweite Lauf druckt die fertige Wächter-Tabelle mit »vorher / nachher« in
jeder Zelle — genau in der Form, die `check-perf-table.mjs` im PR-Text verlangt —
plus die Aufschlüsselung von `create()` je Bauschritt.

**Warum ein Skript und nicht eine Anleitung.** Zwei Sessions der Welle 4b lieferten
leere ms-Spalten, eine dritte gar keine Vorher-Werte, und jede maß anders. Eine
Zahl ohne ihr Rezept ist eine Behauptung (PB-78). Drei Dinge macht das Skript
deshalb selbst:

1. **Die Kontrollmessung ist ein TOR, kein Hinweis.** Vor jeder Zahl über das
   Spiel misst es eine leere Seite im selben Browser. Unter **58 fps bricht es ab**
   und druckt nichts. Ohne diese Kontrolle sind »das Spiel läuft mit 9 fps« und
   »mein Instrument sieht keine 60« dieselbe Beobachtung (P-61). Der Vorgänger
   `harvest-perf.mjs` hatte dafür nur eine weiche Marke und schrieb sonst »n/b«.
2. **Es misst `bau + aufbau`, nie `aufbau` allein.** Der Szenen-Konstruktor (Sim,
   Gitter, Kunst-Umfang) läuft VOR `create()`; wer Arbeit dorthin schiebt,
   verbessert `createMs` und die Wartezeit des Kindes um keine Millisekunde
   (P-77). Der Konstruktor wird in Node gemessen, weil kein Browser hineinsieht.
3. **Eine Lücke wird nie zu einer Null.** Der Erstbild-Rekorder verpasst je Lauf
   etwa eine von fünf Phasen (D-118); das Skript lädt eine unvollständige Phase
   bis zu dreimal neu und schreibt sonst »—«.

`--port` ist **Pflicht** — ein Standard-Port misst in einem Haus mit sieben
parallelen Sessions irgendwann den Server des Nachbarn (P-65).

Der Selbsttest (`node scripts/perf-visible.mjs --selftest`, eine Zeile in `ci.yml`)
läuft **ohne Browser und ohne Server**: die CI-Maschine hat keinen Chrome. Er
prüft, dass die Kontrollschwelle in beide Richtungen funktioniert — der Tamper
biegt die Schwelle über den GEMESSENEN Wert, nie gegen die Konfiguration (P-71).
Das Skript ist damit ausdrücklich **Werkzeug, kein Tor**.

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

## 6 · Audio (R5 · S1, 2026-08-17)

Das gemalte Kapitel hat seit dieser Runde erzeugte Klang-Assets (Ruling R124). Klang kostet
an drei Stellen, und nur eine davon ist die Platte:

| Wo | Wie viel | Warum die Zahl |
|---|---|---|
| Platte, gesamt | **≤ 6 MB** | fünf Musik-Schleifen und rund siebzig Effekt-Dateien in MP3 mono 96 kbps; gemessen gut 3 MB. Die Musik einer Phase wird erst **nach** `create()` geholt, das 100-ms-Tor bleibt also unberührt |
| Platte, Effekt-Bank | ≤ 1,5 MB | die Bank wird als GANZES decodiert und bleibt es |
| Platte, Musik je Phase | ≤ 1 MB | eine Phase hält genau ein Stück |
| **JS-Heap, decodiert** | **≤ 16 MB** | ganze Effekt-Bank (~27 s ≙ 5,2 MB) plus die Musik EINER Phase (~38 s ≙ 7,3 MB). Deterministisch gerechnet: Sekunden × Kanäle × 48 000 × 4 Byte |
| Musik-Decode je Phasenwechsel | ≤ 300 ms | Laufzeit-Messung, **nicht** maschinell erzwungen — dieselbe ehrliche Einschränkung wie beim Erstbild |

**Decodiertes Audio liegt im JS-Heap, nicht im Texturbudget.** Deshalb heisst die Zahl
`AUDIO_DECODED_MB` und steht neben den 35 MB `PHASE_ART_MB`, nicht darin. Wer beide addiert,
addiert zwei verschiedene Speicher.

### R5-W6 · S2 — was seit der Verdrahtung gilt

Die Zahlen oben sind unverändert; drei Sätze kommen dazu, weil der Klang jetzt wirklich läuft.

**Eine Quelle, drei Leser — und jetzt maschinell gebunden.** Die vier Platten-/Heap-Decken stehen
in `packages/game-paint/src/audio/audioBudget.ts`; `scripts/check-audio.mjs` liest sie von dort und
vergleicht sie mit den eigenen (Gesetz 10), und dieselbe Prüfung sucht die zwei Zeilen der Tabelle
oben in diesem Dokument. Wer eine der drei Stellen ändert und die anderen vergisst, bekommt ein
rotes Licht statt einer stillen Abweichung. **`perfBudget.ts` bleibt davon unberührt** — Klang-Decken
gehören nicht in die Bild-Budgets, und zwei Bahnen in einer Datei kosten mehr Konflikt-Runden, als
eine zweite Datei kostet.

**Die decodierte Spitze ist zur Laufzeit ablesbar.** `?perf=1` trägt seit dieser Runde eine vierte
Zeile: `TON  <kHz> · <MB> von 16 MB decodiert · <n> Dateien · Musik <Stück>`. Sie beantwortet die
eine Frage, die das Tor nicht beantworten kann — es rechnet die Spitze deterministisch aus den
Dauern, aber ob im Betrieb wirklich nur EINE Phase gleichzeitig im Speicher steht, sieht man erst
am laufenden Spiel. Steht dort ein Strich, gibt es keinen Ton (kein WebAudio oder keine Dateien);
auch das ist Information.

**`create()` bleibt unberührt.** Die Effekt-Bank und die Musik der Phase werden **nach** dem letzten
Bau-Schritt geholt (`PaintScene#create`, hinter `finishWarming`), nicht im `preload`: der Loader hält
das erste Bild an, und ein Kapitel, das später anfängt, damit ein Schritt klingen kann, hat den
Tausch verloren. Der Aufruf gibt sofort zurück und ist bewusst **nicht** `timed` — ein Zeitnehmer
dort misst eine Null und behauptete damit, es koste nichts.

Die Zahlen stehen einmal in `packages/game-paint/src/audio/audioBudget.ts` (je mit ihrem Beleg)
und werden von `scripts/check-audio.mjs` erzwungen; das Tor prüft ausserdem, dass diese Tabelle
hier dieselben Grenzwerte nennt. Kanon: `docs/design/g1/paint/AUDIO_SPINE_CH01.md`.
