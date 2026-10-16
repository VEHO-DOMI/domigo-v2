# Blinde Prüfung domigo-v2 PR 476 (cgo-017/067, Kopf 088e6c79, gefaltet c8e23ac4) — Ergebnis: 0 SPERRE · 1 SOLLTE · 8 HINWEIS

Prüfer blind: gesehen nur Diff (4970 Zeilen), PR-Text, Karten cgo-017/067, Code im Baum `/Users/veho/Code/_gg/domigo-476-leser` (HEAD c8e23ac400352bb96b911352bd8136298ba4132c). Logs: `/Users/veho/Code/_gg/domigo-476-leser-logs/`. Alle Zahlen aus eigenen Läufen.

## 1 · Gelesen / Gelaufen

Gelesen ganz: `scripts/check-registers.mjs`, `scripts/paint-art-claims.mjs`, `scripts/gg-gate-policy/{clock,register.test,adapters.test}.mjs`, der Diff aller 19 Dateien. Gelesen in den geänderten Bereichen plus gezieltem grep auf alle Datums-Pfade (Dateien zu groß für Vollziehen): `check-paint-art.mjs`, `check-level-design.mjs`, `check-ground-plane.mjs`, `check-game-tasks.mjs`, `variety.ts` (+ `variety.test.ts` im Diff), `check-ci-gates.mjs` (Kopf, Zählregel), `ci.yml` (Zeilen 53–146, 255–262; alle Aufrufzeilen der Tore). Register: alle 202 neuen Zeilen maschinell, 10 per Stichprobe gelesen. Die 19 Dateien: nur `scripts/`, `packages/game-paint/src/cards/variety*`, `content/…/paint/ch0X.policy.json` (5), `docs/design/g1/paint/` (Register + 2 claims.json). Nichts unter `apps/`, `packages/db`, `ci.yml`.

## 2 · Messungen (Exit je Befehl, Tree sauber vor/nach)

| # | Befehl | Exit | Beleg |
|---|---|---:|---|
| 1 | `node scripts/check-registers.mjs --selftest` | 0 | 25 Fälle: 20 rot gesehen, 5× echter Stand grün |
| 2 | `node scripts/check-registers.mjs` | 0 | 1050 D-Nummern eindeutig, 48 Zeilenverweise geduldet |
| 3 | `node scripts/check-ci-gates.mjs` | 0 | 34 Tore laufen in CI an echten Dateien |
| 4 | `check-paint-art.mjs --selftest` | 0 | 16 Fälle, u. a. »KALENDER 2099«, »FREILISTE falscher Befund« |
| 5 | `check-paint-art.mjs` | 0 | 161 Stems, 92 s |
| 6 | `check-level-design.mjs --selftest` | 0 | |
| 7 | `check-level-design.mjs` | 0 | 6 Kapitel; Hinweis »12 Hauptbuch-Ausnahmen, deren Wort eine Karte schon antworten lässt« (nie rot) |
| 8 | `check-ground-plane.mjs --selftest` | 0 | |
| 9 | `check-ground-plane.mjs` | 0 | 13 Steh-Blätter, 0 Duldungen |
| 10 | `check-game-tasks.mjs --selftest` | 0 | |
| 11 | `check-game-tasks.mjs` | 0 | 199 Karten, 6 Dateien |
| 12 | `node --test scripts/gg-gate-policy/register.test.mjs` | 0 | 2/2 |
| 13 | `node scripts/gg-gate-policy/adapters.test.mjs` (Belege außerhalb des Repos) | 0 | 20 echte Torläufe, 178 s, Originalbytes wiederhergestellt; 10 Datumspaare grün, 9 Gegenproben Exit 1, `restored-register` 0 |
| 14 | `pnpm --filter @domigo/game-paint test` | 0 | 131 Dateien, 2029 Tests |
| 15 | `vitest run src/cards/variety.test.ts` | 0 | 49/49 |
| 16 | `pnpm content validate` (Zusatz) | 0 | 57 Units |

Nicht gelaufen (laut Auftrag): typecheck, build, voller `pnpm test`, lint.

Eigene Zusatzprüfungen: Register-Vergleich alt gegen neu (Python, `74ffc9bc` gegen Kopf): 848 alte Zeilen, nach Entfernen der Statusspalte **0 Abweichungen**; Status-Verteilung 731 historisch ungeklärt · 116 historisch: … · 1 historisch geschlossen · 202 offen. 202 `offen`-Einträge in den 7 Quelldateien (33+19+52+32+44 Wortschatz = 180, 8+14 Claims = 22); kein `until`/`expires` mehr in diesen Dateien.

## 3 · Suchpunkte a–g

**a) Lockerung — nichts gefunden.** Jedes Tor fängt nach dem PR mindestens, was es vorher fing, und mehr: `check-paint-art.mjs` prüft die Hygiene jetzt für JEDEN Allowlist-Eintrag (vorher nur für fehlende Stems) und hat `!present.has` aus »needed by nothing« entfernt (strenger); `waiverHygiene` verlangt Grund plus Befund; `claimFails` meldet unnötige Ausnahmen auf Nicht-`cards`-Ansprüchen; Platzhalter-Stems sind jetzt IMMER rot (vorher nur nach dem Stichtag).
Ergebnis der Ausnahme-Varianten (Mutanten M1–M4, M12, M13, M18, M19): ohne Befund-Nummer ROT · erfundene D-9999 ROT · gestrichener/geschlossener Befund (D-52, Zeile auf `geschlossen`) ROT · Nummer entfernt aus dem Register ROT · fremder Befund (Scope eines anderen Worts) ROT · doppelte Registerzeile ROT · zusätzlich `until` ROT. **Markierung:** das Tor liest Spalte 2 des Registers und verlangt exakt `offen` (`paint-art-claims.mjs:52-58`), zusätzlich exakt passenden Scope, genau eine Zeile mit der Nummer und nichtleere Zellen. »offen, erledigt« in der Statusspalte ist ROT (`registerStatusLaw`). Nur die **Existenz der Zeile** reicht also nicht. Lücke: der Inhalt der Zellen wird nicht beurteilt (H1).

**b) Zeit — kein Pfad gefunden, auf dem ein Datum ein geändertes Tor schaltet.** grep auf `Date|today|TODAY|until|expires|Kalender|deadline` in den sieben Torbereichen: übrig sind nur nicht lesende Parameter (`today`) und die Abwehr (`hasExpiry`, `until !== undefined` → rot). M5: alle vier schnellen Tore (registers, level-design, game-tasks, ground-plane) mit vorgeladener Uhr 2000-01-01 / 2030-06-01 / 2099-12-31 → Exit und md5 von Stdout+Stderr **identisch** zum Lauf ohne Uhr; `check-paint-art` mit 2000-01-01 und 2099-12-31 ebenfalls identisch. M5b: `clock.mjs` im Code auf 2030 festgelegt → registers/game-tasks/level-design Exit 0, md5 gleich. `clock.mjs` wird in CI nirgends geladen (nur `adapters.test.mjs` per `--import`), setzt UTC-Mittag und wirft ohne Variable; lokal und CI können sich daher nicht unterscheiden. Andere Tore außerhalb des PR (`check-composition.mjs:317`, `check-colour-truth.mjs:993`, `check-png-seams.mjs:326`) haben noch Datumsformen, aber keine lebende datierte Ausnahme (ART_DEBT `{}`, SEAM_ALLOW `[]`, DEPTH/SEPARATION_WAIVERS `{}`); das ist nicht Gegenstand von cgo-017.

**c) variety.ts — kein Verhalten für Kinder.** `grep` über `apps/` und `packages/`: `variety.ts` wird nur von `scripts/check-game-tasks.mjs`, `scripts/check-level-design.mjs` und `variety.test.ts` importiert; es steht nicht in den `exports` von `@domigo/game-paint`. Die Änderung ersetzt in Gesetz 17e/17f die Datumsprüfung (`until < today`) durch Befundbindung (`openFindings.get(id) === scope`); fehlt `openFindings`, schlägt es zu (geschlossen). Tests sind echte Verhaltenstests (49/49): leere Map, fremder Scope, D-0 und `until` neben `offen` müssen 17e/17f auslösen, Jahr 2099 muss gleiches Ergebnis liefern. M7a/M7b/M7c (Bedingung umgedreht bzw. entschärft) → `variety.test.ts` ROT.

**d) Attrappe ≠ Verdrahtung.** `ci.yml:119-120` ruft `check-registers.mjs --selftest` und ohne auf (Job `content-validate`, vom PR unverändert); ebenso `115-118` (game-tasks, level-design), `131-132` (paint-art), `145-146` (ground-plane). Es gibt kein neues `check-*.mjs`, daher nichts Neues für `check-ci-gates` zu sehen: M6 (echte registers-Zeile entfernt) → check-ci-gates ROT; M6c (level-design) ROT; M6b (nur die `--selftest`-Zeile entfernt) → GRÜN (H8). **`register.test.mjs`, `adapters.test.mjs`, `clock.mjs` führt niemand aus** (kein Eintrag in `ci.yml`, `package.json`, `scripts/test-workspace.mjs`; einziger Verweis auf das Verzeichnis steht in `adapters.test.mjs` selbst) → S1.

**e) Register-Prosa.** 202 Zeilen D-1073…D-1274 lückenlos, keine Doppelnummer (Tor: 1050 eindeutig). Keine Platzhalter: der Grund ist der ursprüngliche Ausnahmetext (112 verschiedene Texte, kürzester 49 Zeichen), Bindung ist die genaue Quelle. Aber die Spalten Ablösebedingung (2 Varianten für 202 Zeilen), Verantwortung (7 Varianten) und Prüfung (2 Varianten) sind Schablonen. Kollision mit R307 (»nächste freie D-1070«): D-1070…1072 sind bereits dach-108 (auf main); das Register-Kopf-Ruling nennt das ausdrücklich, kein Konflikt. Zehn Stichproben (Spalten Nr · Bindung · Grund, gekürzt):
1. D-1073 · ch01 `vocabLedger/g1u01.w.board` · »Steht als Ablenker auf einer Karte im Bild: das Kind LIEST das Wort …«
2. D-1075 · ch01 `…w.class` · »Kein Anker in der WELT dieses Kapitels …«
3. D-1095 · ch01 `…w.to-enjoy` · »Die Befehls-Plaetze des Kapitels sind vergeben (Bleistift 3 · Merle 6 · Tueren 3) …«
4. D-1115 · ch03 `…w.him` · »T2-Welle: die 16 Exemplare kalibrieren den Maßstab … die Ausnahme ist eine Buchung mit Datum, keine Lücke.«
5. D-1135 · ch04 `…w.day` · »ENTWURF · L4-T1 liefert elf Exemplar-Karten … ›day‹ wird von der Welle T2 beantwortet«
6. D-1155 · ch04 `…w.night` · gleiche Schablone
7. D-1195 · ch05 `…w.sister` · »Wirbelsaeulen-Wort des Kapitels … KALIBRIERSTUECK mit zehn Karten«
8. D-1215 · ch06 `…w.go-on` · »Das Kalibrier-Set stellt eine Karte je Maschine, nicht je Vokabel …«
9. D-1255 · ch04 `claims/hungry` · »die Karte dazu schreibt L4-T2 (Blaupause L4 v5 §6 …)«
10. D-1262 · ch06 `claims/to bump into a tree` · »Verb-Phrase der Unit; die Karte kommt von L6-T2«
Lesbar und echt, mit zwei Mängeln (H2).

**f) Kinder.** Diff berührt kein `apps/`, kein `packages/db`, keine Lerntexte. Geändert in `content/` sind nur die fünf `ch0X.policy.json`, und dort nur die Zeilen `"until"` → `"offen"` (maschinell: keine andere +/−-Zeile); diese Dateien liest keine App (`grep` auf `apps/` und `packages/`: nur `variety.*` und `paint-coverage.*`, das `.coverage` liest und `vocabLedger` ignoriert). Kein Sackgassen-, Wand-, Speicher- oder Schülersprache-Pfad betroffen. `pnpm content validate` Exit 0.

**g) Weiteres:** S1 und H1–H9 unten.

## 4 · Mutanten (jeder danach per `git checkout --` zurück; Endstand `git status --short` leer außer diesem Bericht)

| # | Datei / Aufrufstelle | Prüfung | Ergebnis | Bewertung |
|---|---|---|---|---|
| M1 | `ch01.policy.json` Eintrag board `offen`→`D-9999` | registers · game-tasks | ROT · ROT | richtig |
| M2a | derselbe → `D-52` (durchgestrichen/historisch geschlossen) | registers · game-tasks | ROT · ROT | richtig |
| M2b | Register: D-1073 `offen`→`geschlossen` | registers · game-tasks | ROT · ROT | richtig |
| M3 | `offen`-Schlüssel ganz entfernt | registers · game-tasks | ROT · ROT (17f) | richtig; Meldung »Befund undefined« (H6) |
| M4 | Register: Zeile D-1073 gelöscht | registers · game-tasks | ROT · ROT | richtig |
| M5 | Uhr 2000/2030/2099 vorgeladen, 5 Tore | Exit+md5 gegen ohne Uhr | identisch (alle 5) | richtig |
| M5b | `clock.mjs` auf 2030 festgelegt | registers · game-tasks · level-design | je Exit 0, md5 gleich | richtig |
| M6 | **ci.yml**: echte registers-Zeile weg | check-ci-gates | ROT (D-257) | richtig |
| M6b | **ci.yml**: nur `--selftest`-Zeile weg | check-ci-gates | **GRÜN** | vorbestehende Regel, H8 |
| M6c | **ci.yml**: echte level-design-Zeile weg | check-ci-gates | ROT | richtig |
| M7a | `variety.ts`: Scope-Vergleich `!==`→`===` | variety.test · game-tasks | ROT · ROT | richtig |
| M7b | `variety.ts`: 17f-Bedingung gedreht | variety.test | ROT | richtig |
| M7c | `variety.ts`: Scope-Prüfung durch `false` ersetzt | variety.test · game-tasks | ROT · **GRÜN** | variety.test fängt es; game-tasks allein nicht (Doppelung durch registers, kein Fund) |
| M10 | **check-game-tasks.mjs**: `openFindings: OPEN_FINDINGS` nicht mehr übergeben | game-tasks · registers | ROT · GRÜN | fail-closed, richtig |
| M10b | **check-level-design.mjs**: Aufrufstelle `cx.chapter, OPEN_FINDINGS` ersetzt | level-design | ROT | richtig |
| M11 | **check-registers.mjs:359**: Aufruf `exceptionRegisterLaw` entfernt (Daten gut) | registers · selftest | GRÜN · GRÜN | Verdrahtung ungedeckt (H3) |
| M11+M1 | wie M11, plus D-9999 in Ausnahme | registers · selftest · game-tasks | GRÜN · ROT · ROT | CI bliebe über Selbsttest und game-tasks rot |
| M12 | `offen` plus `"until": "2099-01-01"` | registers · game-tasks | ROT · ROT | richtig |
| M13 | Register: Zeile D-1073 doppelt | registers | ROT | richtig, Meldung irreführend (H6) |
| M14 | Register: Grund-Folgezellen von D-1073 auf »x« | registers · game-tasks | **GRÜN · GRÜN** | Inhalt ungeprüft (H1) |
| M15 | **paint-art-allowlist.json**: Eintrag mit `D-9999` | registers · paint-art | ROT · ROT | richtig |
| M16 | **claims.json ch04**: `offen` einer Claim-Ausnahme entfernt | registers · level-design | ROT · ROT | richtig |
| M18 | board → `D-1074` (fremder, offener Befund) | registers · game-tasks | ROT · ROT | richtig |
| M19 | Register: Status `offen, erledigt` | registers · game-tasks | ROT · ROT | richtig |
| M21 | paint-art: Befund-Fehlermeldung der Allowlist entschärft | paint-art --selftest | ROT | Selbsttest beißt |
| M22 | ground-plane: Befundfehler in `waiverHygiene` entschärft | ground-plane --selftest | ROT | beißt |
| M23 | level-design: Befundfehler in `claimFails` entschärft | --selftest · real | ROT · GRÜN | Selbsttest beißt |
| M24 | **check-game-tasks.mjs:1236**: Befundprüfung der Portrait-Freiliste durch `true` ersetzt | --selftest · real | **GRÜN · GRÜN** | ungetestet (H3) |
| M25 | dort `geduldet.until === undefined` entfernt | --selftest · real | **GRÜN · GRÜN** | ungetestet (H3) |

28 Mutanten (plus die Uhrenreihe M5), davon 8 an Aufrufstellen (M6, M6b, M6c, M10, M10b, M11, M15, M16); Eingabemutanten an `policy.json`, `claims.json`, Allowlist und Register-Zeilen. Fünf blieben ungefangen: M6b, M11, M14, M24, M25 (H8, H3, H1, H3, H3); alle anderen 23 wie erwartet.

## 5 · Funde

### S1 · SOLLTE · Die Beweistests des PR laufen in keiner Prüfkette
- Dateien: `scripts/gg-gate-policy/register.test.mjs:1`, `adapters.test.mjs:1-2`, `clock.mjs:1`.
- Messung: `grep -rIl gg-gate-policy` über den Baum ohne `node_modules` findet nur `adapters.test.mjs` selbst; `ci.yml` (nicht im Diff) hat keine Zeile; `package.json` kein Skript; `scripts/test-workspace.mjs` iteriert nur pnpm-Pakete (`scripts/` ist keines); `check-ci-gates` überwacht nur `scripts/check-*.mjs`. Ich habe beide Dateien von Hand gefahren (Exit 0, 2/2 bzw. 20 Torläufe/178 s).
- Folge: Der einzige Test, der die **Verdrahtung** der fünf Tore an das Register (echte Aufrufe, Jahr 2099, geschlossen/fremd/fehlend) beweist, ist ein Handlauf. Der pure Parser-Test (0,3 s) fehlt in CI ebenfalls. Mutanten M11 und M24/M25 zeigen, was nur dieser Handlauf sehen würde (M11 sieht auch `adapters.test`: `register-omitted-entry`/`register-unknown`).
- Erwartung: mindestens `register.test.mjs` als `- run: node --test scripts/gg-gate-policy/register.test.mjs` neben `ci.yml:120`; `adapters.test.mjs` (178 s, mutiert Dateien im Arbeitsbaum) bewusst als Handtest dokumentieren oder in einen eigenen Job.
- Konfidenz: hoch.

### H1 · HINWEIS · Das Tor prüft Existenz, Status und Scope — nicht den Sachgehalt der Registerzeile; keine Mengen-Ratsche
- `scripts/paint-art-claims.mjs:52-58`: eine Zeile zählt, wenn Status exakt `offen`, Scope passt, genau eine Zeile mit der Nummer und die vier Folgezellen nichtleer sind. M14 (alle vier Zellen »x«) → registers und game-tasks GRÜN. Neue Ausnahme = eine selbst geschriebene Zeile; nichts begrenzt die Anzahl (202 sind nirgends festgenagelt, bewusst: »keine Zahl aus Prosa abgeleitet«). Vor dem PR genügte ein beliebiges `until`-Datum; die Schutzwirkung ist gleich, der Zwang zur Wiedervorlage fällt nach Kokis Regel weg.
- Behebung (optional): Mindestlänge/Verbot von Einzelzeichen-Zellen; oder Anzahl pro Datei als Ratsche (nur sinkend).
- Konfidenz: hoch.

### H2 · HINWEIS · Registerprosa: Schablone, 18 Widersprüche, Reste von Datumssprache
- `DEBT_REGISTER.md:1734` (D-1077 `here`): Grund »Funktionswort … gehört auf die Regel-Seiten, nicht in eine Karten-Antwort«, Ablösebedingung »Wort wird durch eine Feldkarte beantwortet; … Ausnahme dann entfernen«. Gemessen: 18 Zeilen im Block mit Funktionswort/Regel-Seiten-Grund und dieser Ablösebedingung (u. a. D-1076, 1077, 1081, 1084–1087, 1090, 1091, 1093–1095).
- `DEBT_REGISTER.md:1772` (D-1115): Grund-Text sagt noch »Buchung mit Datum«.
- 180 Zeilen mit identischer Ablösebedingung, 202 mit zwei Prüfzellen-Varianten.
- Außerdem meldet `check-level-design` weiter »12 Hauptbuch-Ausnahmen, deren Wort eine Karte schon antworten lässt« (nur Hinweis, vorbestehend D-840/D-986); diese 12 stehen jetzt als »offen« im Register, obwohl ihre Ablösebedingung nach Messung des Tors erfüllt aussieht.
- Behebung: Ablösebedingung pro Wortklasse formulieren (Funktionswort: »Wort wandert auf Regel-Seite, Ausnahme dann entfernen«), die 12 prüfen und ggf. schließen.
- Konfidenz: hoch (Zählung), mittel (die 12).

### H3 · HINWEIS · Zwei Verdrahtungsstellen ohne Testabdeckung
- `scripts/check-registers.mjs:359` (`for … exceptionRegisterLaw(debtText, declarations)`): Selbsttest ruft die Funktion direkt auf; Entfernen der Zeile (M11) bleibt grün. Schutz liegt darin, dass der Selbsttest bei schlechten echten Daten wirft und die drei anderen Tore je ihre eigene Seite prüfen (M11+M1 → selftest ROT, game-tasks ROT).
- `scripts/check-game-tasks.mjs:1236` (Portrait-Freiliste `nochGueltig`): M24 und M25 grün in Selbsttest und echtem Lauf; `paint-art-allowlist.json` ist `[]`, `check-paint-art` fängt eine schlechte Bindung ohnehin (M15).
- Behebung: je ein Selbsttest-Fall bzw. ein Fall in `adapters.test.mjs` (hängt an S1).
- Konfidenz: hoch.

### H4 · HINWEIS · Tote Datumsreste
- Nicht mehr lesende `today`-Parameter: `check-paint-art.mjs:59,127`, `check-level-design.mjs:223,292`, `check-game-tasks.mjs:147,2017`, `check-ground-plane.mjs:179`, `variety.ts:135` (`today: string`, Kommentar »Historical test input«). `composition.ts:516` exportiert weiter `PLACEHOLDER_UNTIL = "2026-09-30"` (laut PR bewusst außerhalb des Zauns, nicht mehr gelesen). `docs/design/g1/paint/story-gamepass-review/blind-language/ui-sourcehashes.json:73` hält den alten Hash von `variety.ts` (b4d27c4f…, jetzt 91f05d19…); gelesen wird die Datei von keinem Skript, nur Prosa.
- Risiko: Ein später wieder eingebauter Vergleich träfe auf bereitliegende Parameter; die 2099-Fälle (paint-art-Selbsttest, variety.test, claimFails, waiverHygiene) würden ihn fangen, für den Portrait-Pfad nur `adapters.test` (S1).
- Konfidenz: hoch.

### H5 · HINWEIS · `adapters.test.mjs` schreibt in getrackte Dateien
- `adapters.test.mjs:31,40,55-71`: tauscht Register und Policy im Arbeitsbaum, stellt im `finally` aus Originalbytes her. Ein harter Abbruch (SIGKILL, Stromausfall) hinterließe einen gemutierten Baum, der wie ein echter Commit aussieht. Ausdrücklich im Dateikopf vermerkt (»owned checkout«). Bei mir sauber zurückgesetzt (`git status` leer nach dem Lauf).
- Konfidenz: hoch.

### H6 · HINWEIS · Irreführende Fehlermeldungen
- `paint-art-claims.mjs:60-62`: fehlt `offen`, steht »Befund undefined fehlt …« (M3, M16); eine doppelte Registerzeile (M13) wird als »fehlt, ist geschlossen oder passt nicht exakt« gemeldet, nicht als Duplikat.
- Konfidenz: hoch.

### H7 · HINWEIS · Zwei Bedeutungen von »offen« im selben Register
- Neue Gesetze lesen Spalte 2 (`offen`); `check-composition.mjs:307` und `check-registers.mjs` `offenLaw` (für D-1072) lesen irgendeine spätere Zelle `offen…`. D-1070…1072 tragen in Spalte 2 »historisch ungeklärt«, in Spalte 6 »offen, ohne Datum«. Heute konsistent grün; wer künftig eine Zeile auf die eine Weise schließt, schließt sie für das andere Tor nicht.
- Konfidenz: mittel.

### H8 · HINWEIS · `check-ci-gates` verlangt nur die echte Zeile
- M6b: `--selftest`-Zeile von registers aus `ci.yml` entfernt → check-ci-gates GRÜN. Vorbestehende Regel (D-257), vom PR nicht verändert; relevant, weil die sechs neuen cgo-017-Fälle nur im Selbsttest leben.
- Konfidenz: hoch.

### H9 · HINWEIS · `clock.mjs` ist nur eine Test-Attrappe
- `clock.mjs:7`: `class extends Date` — ein Aufruf `Date()` ohne `new` würde werfen; kein Tor tut das (grep). Gate-Code nutzt `new Date()`/`Date.now()`/`Date.parse`, alle werden abgedeckt (M5b). Kein Befund für CI, da die Datei dort nicht geladen wird.
- Konfidenz: hoch.

## 6 · Nicht geprüft
- `perf-contract` und alle GitHub-Checks (laut Auftrag nicht mein Thema; PR-Text hält sie offen).
- typecheck, lint, build, voller `pnpm test`, Browser/Spielrunde, Anmeldung/Datenbank, Kunstqualität.
- Die Behauptung »Batterie 29/29 am alten Kopf« und »5/5 Restbefehle am neuen«: UNVERIFIZIERT (nicht wiederholt); ich habe nur die in Abschnitt 2 genannten Befehle am gefalteten Kopf gefahren.
- `check-game-tasks.mjs`, `check-level-design.mjs`, `check-paint-art.mjs` und `check-ground-plane.mjs` nicht vollständig Zeile für Zeile gelesen, sondern die geänderten Bereiche und alle Datumspfade; vorbestehende Logik außerhalb des Diffs unbeurteilt.
- Wirkung auf gleichzeitig offene Branches (jeder Zweig, der neue `until`-Ausnahmen in Policy-Dateien anlegt, wird nach dem Merge rot): nicht untersucht.

FREIGABE für Merge PR 476: ja — Beleg: 0 SPERRE; alle 16 Messbefehle Exit 0 am gefalteten Kopf c8e23ac4, adapters.test 20 Torläufe, variety.test 49/49, game-paint 2029/2029, 23 von 28 Mutanten wie erwartet gefangen (5 ungefangene sind Beweisnetz-Lücken, keine Tor-Lockerung), 5 Tore bei Uhr 2000/2030/2099 byte-identisch, Register 848 Altzeilen bytegleich; Vorbehalt: S1 (Tests nicht in CI) und der offene `perf-contract`/GitHub-Stand liegen außerhalb dieser Prüfung.

— Prüfer PR 476 (blind)
