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
| Audio (Platte) | ≤ 6 MB | `check-audio.mjs` — **CI** |
| Audio (decodiert, JS-Heap) | ≤ 16 MB | `check-audio.mjs` — **CI**, zur Laufzeit in `?perf=1` |

**Zur letzten Zeile (R90, R5-W4b · W3; R104, Hotfix nach dem Zug).** Die Tot-Kunst-Decke
hat seit dieser Runde **einen** Eigentümer. Vier Berichte der Welle 4 nannten drei
verschiedene Zahlen (61 / 60 / 58), weil jede Bahn, die Kunst verdrahtet oder löscht, den
Stapel senkt, ohne die Decke zu berühren — am Ende wusste niemand mehr, was sie IST.
**★ 2026-08-22 (R5-W9 · M1): 53 → 54.** Das eine Blatt ist `canopy_fringe_loop`, und es ist NICHT neu geliefert — es war verdrahtet und ist es nicht mehr. Die Hecke hing am Glyph `#` und wurde damit in allen fünf Räumen von ch01 gezeichnet, auch an der Decke des Nacht-Klassenzimmers (gemessen an der laufenden p3: EIN TileSprite über die volle Weltbreite, 1024 × 26 px). Sie hängt jetzt an einer Deklaration (`composition.ts#CANOPY_PHASES`), die für ch01 leer ist; das Blatt bleibt auf der Platte, weil der erste Raum mit echter Außenkante (ch02+) sich dort einträgt. Bis dahin ist es ehrlich tote Kunst. Siehe D-635.

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

**★ N7A2b (2026-09-03): 57 tote Blätter — die Nachmal-Bahn löscht und erzeugt keine.**
Drei Blätter wurden am selben Stem byte-für-byte ersetzt (`l2_p2`,
`body_p3_westterrasse_rutsche`, `body_p3_mittelpfeiler`), keines umbenannt, keines
neu angelegt: die Tot-Liste ist unverändert, die Decke bleibt bei 57.

Gemessene Phasen-Gewichte, mit demselben Lineal wie `artScope.test.ts`
(`bytesOf(phaseArtScope(level, ph.id, present)) / 1048576`), am Basis-Baum
`64248a75` und an dieser Bahn:
**p1 19,4 · p2 25,3 → 25,2 · p3 20,7 → 21,9 · p4 17,8 · p9 15,1 MB** (Grenze 35).
p3 wächst um 1,2 MB, weil die zwei neu gemalten Böden mehr Malerei tragen als ihre
Vorgänger (Westterrasse 1,28 → 2,29 MB, Hofmitte 0,46 → 0,71 MB); p2 wird um
0,1 MB leichter (0,67 → 0,56 MB). Das Lineal ist gegengeprüft: es reproduziert
`check-perf-budget`s eigene Ausgabe für die schwerste Phase exakt (25,3 bzw. 25,2).

⚠ **Eine Zahl aus dem N7A2-Block darunter reproduziert sich nicht.** Dort steht
„p3 20,9 → 22,6 MB"; an dem Commit, den jene Bahn hinterlassen hat (`64248a75`),
misst dasselbe Lineal **20,7 MB**. Genannt, nicht stillschweigend überschrieben —
die Zahlen dieser Bahn stehen oben und sind an zwei Bäumen gemessen.

**★ N7A2 (2026-09-02): 57 tote Blätter — unverändert, und das ist die Aussage.**
Der p3-Cutover hat vier Blätter freigegeben (`crust_p3_a/b/cap_l/cap_r`, 0,84 MB)
und alle vier sind im selben PR gelöscht: die Tot-Liste nach dieser Bahn ist
**Zeile für Zeile identisch** mit der von `origin/main`, also bleibt die Decke bei
57 und braucht keine Anhebung. Freigegeben hat sie ein Werkzeug, kein Urteil:
`scripts/retire-phase-art.mjs` prüft je Blatt zwei Bedingungen (der Stem trägt den
Raum im Namen · kein Raum und keine Karte lädt ihn noch) und verweigert im
Selbsttest ein geteiltes Blatt, ein fremdes und ein lebendes Körper-Blatt.
Die zwölf p3-Kit-Blätter, die der Cutover ebenfalls zurückzieht (`mass_body_a/b`,
`mass_fade`, `mass_sediment`, die Kanten, Ecken und die zwei Binder), sind mit
p4/p9 GETEILT und bleiben auf der Platte.

Gemessene Phasen-Gewichte, mit dem Lineal von `check-perf-budget` (ganzer Baum
unter `apps/web/public/art/g1/paint`):
**p1 19,4 · p2 25,3 · p3 20,9 → 22,6 MB · p4 18,0 → 17,8 · p9 15,1 MB** (Grenze
35 MB). p3 wächst um 1,7 MB und verliert dabei zehn Blätter (101 → 91): sechs
durchgehend gemalte Körper wiegen mehr als das Kachel-Kit, das sie ersetzen.
p4 wird um 0,2 MB LEICHTER, ohne dass diese Bahn p4-Kunst angefasst hätte — es
deklariert zwei der drei Hof-Möbel mit (zeichnet sie nie, gemessen null
Plattform-Läufe), und die neuen Blätter sind auf der Auflösungs-Stufe des
Kapitels kleiner (943→256 px und 372→64 px).

**★ N7A1 (2026-09-02): 57 tote Blätter — die erste Runde, in der die Zahl SINKT.**
Der Cutover der Ein-Block-Welt hat 42 Blätter gelöscht (9,3 MB): das komplette Kit
von p1 und p2, das absorbierte `terrain_atlas_podest_p1` und das längst tote
`band_p1_hallway`. Freigegeben hat sie keine Aufräumaktion, sondern eine
Rechnung: `mass.ts#phaseIsOneBlock` fragt das Raster, ob die Sicht-Körper einer
Phase jede solide Zelle besitzen, die nicht einem Möbel gehört. Trifft das zu,
listet `massStems` das Kit nicht mehr. Gemessene Phasen-Gewichte danach, mit dem Lineal, das
`check-perf-budget` selbst benutzt (der ganze Baum unter `apps/web/public/art/g1/paint`,
nicht nur der ch01-Ordner — die Helden-Figur und die geteilten Blätter zählen mit):
**p1 21,5 → 19,4 MB · p2 28,3 → 25,3 MB · p3 20,9 · p4 18,0 · p9 15,1 MB**
(Grenze bleibt 35 MB) — p3/p4/p9 unverändert, kein Blatt dieser Räume war in der
Differenz. ⚠ Ein zweites, engeres Lineal (nur der ch01-Ordner) misst dieselben Räume
1,4–2,1 MB leichter; wer eine Zahl vergleicht, nennt das Verfahren dazu.

**★ Runde 4 (2026-08-31): 58 tote Blätter.** Die 17 neuen Ein-Stück-Terrainblätter
werden von p1/p2 geladen und zählen daher nicht als tote Kunst. Der aktuelle Checkout
enthält zugleich vier weitere tote Altstände; die Decke wurde auf den gemessenen Stand
58 nachgezogen, mit null Luft und mit der Begründung in `perfBudget.ts`.

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

## 3b · Wie man die Tabelle nimmt (R115) — R5-W5 · E6, ergänzt R5-W6b · E7

### ★ Die drei Zeilen VOR jeder Zahl (D-421 · D-339 · D-349 · R164)

**Ohne diese drei Lesungen ist jede Zahl unten wertlos. Sie stehen hier, weil
die teuerste Lehre der Welle 6 bis heute nur im Schulden-Register stand — und
niemand liest das Register, bevor er misst.**

```
node scripts/chrome-hygiene.mjs --lastlesung   # ⇒ „frei" ODER die Liste dessen,
                                               # was gerade misst — mit Erzeuger
sysctl -n vm.loadavg          # < 5, sonst warten
pgrep -x oxipng               # 0 — ein `art-recompress` der Nachbar-Sitzung läuft
                              # mit bis zu 500 % CPU (D-349)
```

Alle drei Werte gehören in den Beipackzettel und in den PR-Text, neben die
Kontroll-fps. `pgrep -x`, nicht `pgrep -f`: ein `-f` findet die eigene
Warteschleife und meldet ewig „läuft noch".

### ⚠ R5-W7 · W6 · Warum die erste Zeile nicht mehr `pgrep -fl "headless=new"` ist

Sie war **doppelt falsch**, und beides ist am 22.08. gemessen worden:

1. **Sie sieht einen SICHTBAREN Lauf nicht.** `shoot-world --visible` lässt genau
   dieses Flag weg. Seit F8s Falle 2 wird jeder gemeldete Stillstand mit
   `--visible` wiederholt — sichtbare Läufe sind also Alltag, und die
   vorgeschriebene Lesung ist gegen sie blind. Genau das war der Fall: eine
   fremde Sitzung fuhr einen sichtbaren `shoot-world`-Chrome, und `pgrep -f
   headless=new` meldete ihn nicht.
2. **Sie findet dafür Dinge, die keine Browser sind.** Dieselbe Lesung meldete
   „2" — beides eigene `zsh`-Warteschleifen, deren Kommandozeile das Wort
   `headless=new` enthielt. Das ist die `pgrep -f`-Falle (W5-Falle 2) in der
   Lastlesung selbst.

`--lastlesung` liest stattdessen die **Prozesstabelle** und filtert auf zwei
Dinge zugleich: die Zeile muss mit dem Chrome-Programm beginnen UND ein
`--user-data-dir` mit einem der drei Mess-Präfixe tragen. Sie sagt zusätzlich,
ob der Erzeuger noch lebt (`ppid`) — ein Browser mit lebendem Elternprozess ist
eine LAUFENDE fremde Messung, auf die man wartet; einer mit `ppid 1` ist eine
Leiche, die geräumt gehört (W5-Falle 1).

**Und der Grund, warum das ein Gesetz und keine Politur ist:** ein fremder
Browser fälscht die Zahl (D-339: 8199 ms gegen 661 ms). Eine Lastlesung, die ihn
nicht sieht, ist schlimmer als keine — sie sagt „frei" und meint „ich habe nicht
hingesehen".

**Und warum die Kontrollseite das NICHT ersetzt.** Sie beweist, dass das
Instrument 60 Bilder je Sekunde sehen kann — mehr nicht. **Eine LEERE Seite
schafft 60 fps auch unter voller Last**, also meldet sie grün, während das Spiel
daneben das Dreifache braucht. Gemessen (A7, 18.08.): derselbe Bau, derselbe
Port, beide Kontrollen grün (61,4 und 60,4 fps) — und `create()` für p2 einmal
833 ms, einmal **1394 ms**. Der Unterschied war die Maschine, nicht der Code:
sechs parallele Sitzungen, Lastmittel zwischen 36 und 350. **Eine Zahl über
Budget wird IMMER nachgemessen**, nachdem diese drei Zeilen sauber sind.

**Es gibt genau EIN Rezept, und es ist ein Skript:**

```
pnpm build && (cd apps/web && VERCEL_GIT_COMMIT_SHA=$(git rev-parse HEAD) npx next start -p <dein Port>)
node --experimental-strip-types scripts/perf-visible.mjs --port <dein Port> --runs 3 --json vorher.json
# … deine Arbeit … (Server NEU BAUEN und NEU STARTEN, siehe D-443 unten)
node --experimental-strip-types scripts/perf-visible.mjs --port <dein Port> --runs 3 --baseline vorher.json
```

### ★ R183 · Die Zeile, die sagt, WELCHEN Bau du gemessen hast (R5-W7 · W6)

Das `VERCEL_GIT_COMMIT_SHA=` im Startbefehl ist kein Zierat. Bis zur Welle 7
schrieb `perf-visible` als `commit` den HEAD **seines eigenen Verzeichnisses** —
B5s und D4s Vorher/Nachher-JSON trugen deshalb denselben Hash, obwohl zwischen
den beiden Messungen gemergt worden war, und an der Datei war es nicht zu sehen.
Eine Vorher/Nachher-Tabelle, deren beide Hälften nachweislich am selben Bau
entstanden sind, sagt über die Änderung nichts.

Mit der Umgebungsvariable meldet `/api/version` den Commit des Prozesses, der
gerade gemessen wird — die einzige **geprüfte** Quelle, weil sie aus dem
gemessenen Server selbst kommt. `perf-visible` liest sie und druckt:

```
Gemessener Bau: <commit> · Quelle: /api/version — der gemessene Server hat es selbst gesagt (GEPRÜFT)
```

**Diese Zeile gehört in den PR-Text, einmal für vorher und einmal für nachher.**
`check-perf-table.mjs` liest sie: zwei identische Angaben sind ROT.
Zwei Ausweichwege, beide ERKLÄRT statt geprüft, beide im Beipackzettel benannt:
`--worktree <pfad>` (der Aufrufer behauptet, dass dort der gemessene Server
läuft) und `--build-label "<text>"` (wenn es keinen Commit gibt). Ohne eine
dieser drei Angaben **bricht der Lauf ab** — der stille Rückfall auf das eigene
Verzeichnis ist entfernt, nicht umbenannt.

### ★ D-443 · Der Server liefert das ALTE Level (R5-W7 · W6)

B5 hat es bezahlt: nach einer Level-Änderung zeigten **zwei** Bildreihen still
die alte Zelle. Der Dev-Server hielt `ch01.level.json` in seinem
Zwischenspeicher; nichts war rot, die Bilder waren einfach falsch.

**Nach JEDER Level-Änderung: Server beenden und neu starten.** Und danach
nachsehen, statt zu hoffen — `shoot-world` tut es ab sofort selbst, VOR dem
ersten Bild:

```
node scripts/shoot-world.mjs <out> --phase p1 --port <port> …
#   → "D-443: der Server liefert die Zeilen-Landkarte, die auf der Platte liegt."
#   → oder Exit 1 mit Grund, und KEIN Bild wird geschrieben
```

Es gibt keine `…/level.json`-Adresse zum Curlen: das Level wird serverseitig
gelesen (`apps/web/lib/paint-content.ts`) und als Prop in die Seite gereicht.
Geprüft wird deshalb die **ausgelieferte Seite** — die Zeilen-Landkarte jeder
Phase steht dort als JSON-Array, und eine einzige geänderte Zelle ändert sie.
(Am 22.08. am lebenden Fall nachgemessen: eine Zelle geändert, Server nicht neu
gestartet ⇒ Exit 1.)

### ★ D-438 · Die Lastlesung darf nicht den eigenen Browser mitzählen (R5-W7 · W6)

`chrome.kill()` schickt ein Signal und kehrt zurück; das Ende des Prozesses
passiert danach. E7s Lastlesung sah deshalb den eigenen, gerade beendeten
Browser (`pgrep -f headless=new` meldete erst **2**, dann **0**).

`perf-visible` und `shoot-world` warten jetzt selbst auf das PROZESS-ENDE — erst
das `exit`-Ereignis des eigenen Kindes, dann die Prozesstabelle, bis kein
Prozess mit dem eigenen Profil mehr steht — und drucken die Wartezeit:

```
Eigener Chrome beendet nach 184 ms (D-438).
```

**Erst ab dieser Zeile misst `pgrep -x`/`sysctl -n vm.loadavg` die Maschine und
nicht diesen Lauf.** Beide Werkzeuge räumen ausserdem beim START verwaiste
EIGENE Profile weg und sagen es (W5s Falle 1: ein abgebrochener Lauf lässt seinen
Chrome am Leben, und der Folgelauf hängt daran). Fremde Browser werden nie
angefasst — sie sind Last, die gemeldet gehört, nicht Müll (D-339).

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
3. **Eine Lücke wird nie zu einer Null — und seit E7 ist sie ein ROTES LICHT.**
   Der Erstbild-Rekorder verpasste je Lauf etwa eine von fünf Phasen (D-118);
   das Skript lädt eine unvollständige Phase bis zu dreimal neu und schreibt
   sonst »—«. Neu (D-327): die Sonde sammelt die Antworten der Grafikkarte in
   Scheiben ein, statt genau einmal hinzusehen — eine Antwort, die im falschen
   Augenblick noch unterwegs war, war vorher ununterscheidbar von „diese Karte
   kann keine Zeitmessung". Was dann noch fehlt, meldet sie **namentlich und mit
   Grund** (`gaps`), das Skript druckt diese Gründe unter der Tabelle, **und es
   endet mit Exit 1**. Eine Tabelle mit drei Strichen sah für jeden Aufrufer wie
   ein Erfolg aus; sie ist keiner.
4. **Die Aufschlüsselung nennt Kinder als Kinder.** `terrain` und `props` zeigen
   ihre Unterschritte (`· gitter`, `· planMass`, `· platzieren`, `· koernung`,
   `· letterTex` …) eingerückt. Kinder werden in KEINE Summe genommen und sind
   untereinander disjunkt — eine Aufschlüsselung, deren Summe größer ist als die
   Zahl, die sie aufschlüsselt, ist keine (E6 hat genau die einmal gedruckt).

`--port` ist **Pflicht** — ein Standard-Port misst in einem Haus mit sieben
parallelen Sessions irgendwann den Server des Nachbarn (P-65).

Der Selbsttest (`node scripts/perf-visible.mjs --selftest`, eine Zeile in `ci.yml`)
läuft **ohne Browser und ohne Server**: die CI-Maschine hat keinen Chrome. Er
prüft, dass die Kontrollschwelle in beide Richtungen funktioniert — der Tamper
biegt die Schwelle über den GEMESSENEN Wert, nie gegen die Konfiguration (P-71).
Das Skript ist damit ausdrücklich **Werkzeug, kein Tor**.

## 3c · Woraus `create()` heute besteht (R5-W7 · E8, 2026-08-22, as built)

Gemessen auf dem ZWEITEN Mac (der erste ist mit R204 weg; die Zahlen der Wellen 5/6
stammen von der alten Maschine und sind mit diesen **nicht** vergleichbar). Fünf
abwechselnde Paare Basis/Zweig, Median, sichtbarer Chrome, Kontrollseite 61,0–61,8 fps:

| `create()` (ms) | p1 | p2 | p3 | p4 | p9 |
|---|---|---|---|---|---|
| vor E8 | 139,2 | 282,2 | 120,3 | 72,4 | 71,8 |
| nach E8 | **124,9** | **124,1** | **108,8** | **70,5** | **70,8** |

**Der größte Posten ist jetzt der Musterbau je BLATT, und er ist nicht wegzurechnen.**
Jede `TileSprite` zeichnet ihr Blatt in eine Leinwand in Zweierpotenz-Größe und lädt
sie zur Grafikkarte. Seit E8 passiert das **einmal je Blatt** statt einmal je Stück
(p1: 17 statt 145 · p2: 11 statt 331). Was bleibt, sind 23–56 ms je Raum für diese
17/11/10/9/7 Bauten — und das Muster ist eine auf Zweierpotenz UMGERECHNETE Fassung
des Blattes (`canopy_fringe_loop` 2048×384 → 2048×512), nicht das Blatt selbst. Auf
die schon hochgeladene Quelltextur zu zeigen wäre also ein anderes Bild. Kosten je
Blatt, gemessen: **rund 1 ms fest plus 2 ms je Zweierpotenz-Megabyte** (0,5 MB → 1,3–2,6 ms ·
1 MB → 4,0–4,7 · 4 MB → 8,8–12,4).

**Die zwei nächsten Posten, beide beziffert, keiner ohne Bildfrage:** `letterTex`
14,9/13,3/16,8/0/15,9 ms (7–9 Leinwände je Raum, ~1,9 ms je Zeichen — der Rand hängt
am Raum, also kann kein Raum die Leinwände des anderen erben, D-432) und die
Graustufen-Kopien in `entityImgs` 15,0/23,4/15,0/5,0/0 ms (5/8/5/1/0 gerechnete Kopien;
was zweimal gebraucht wird, liegt beim zweiten Mal im spielweiten Texturspeicher).

**Zwei Zeilen in der Bauschritt-Tabelle sagen, ob die Teilung überhaupt greift:**
»Muster gebaut« und »Bauten gespart«. Steht dort 0 gespart, hängt die Umhängung nicht
(`PaintScene#patchTileBuild`) — die Zahl ist der Wächter, kein Schmuck.

### Wie man unter Fremdlast überhaupt noch etwas messen kann

Am 22.08. liefen sechs Sitzungen auf derselben Maschine (Lastmittel 4,7–34). **Absolute
Millisekunden sind dann nicht entscheidbar**: derselbe Bau, zweimal gemessen, ergab für
p2 216 und 386 ms. Was trägt:

1. **Paare, abwechselnd**, im selben Fenster (Basis, Zweig, Basis, Zweig …) — fünf Paare,
   Median je Seite. Nie zwei Zweige gegen ein altes Protokoll.
2. **Die Kontrolle derselben Fassung gegen sich selbst** vor jedem Urteil: sie ist der
   Rauschpegel, und ohne sie ist jedes Delta eine Erzählung.
3. **Zwischen zwei Läufen warten, bis der eigene Browser wirklich weg ist** (D-438) — sonst
   zahlt der zweite Lauf die Abbau-Rechnung des ersten.
4. **Was innerhalb EINES Laufs gezählt wird** (Stück-Zeilen, Blattzahlen), ist von der
   Maschine unabhängig und überlebt jede Last.

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
