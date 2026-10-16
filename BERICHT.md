# Blinde Prüfung domigo-v2 PR 483 (cgo-075, Kopf 09a30c5d) — Ergebnis: 0 SPERRE · 0 SOLLTE · 6 HINWEIS

Prüfer blind: nur Diff, PR-Text, Karte, Code. Arbeitsbaum /Users/veho/Code/_gg/domigo-483-leser (Kopf 09a30c5d auf main 7d1a66c3). Logs: /Users/veho/Code/_gg/domigo-483-leser-logs/.

## Gelesen / Gelaufen
Gelesen: diff.patch, pr.md, karte.md (Entscheid 1, Nachträge 1+2); ganz: scripts/check-ci-gates.mjs (Kopf, Parser, analyse, Selbsttest), scripts/check-vercel-ignore-build.mjs, apps/web/scripts/vercel-ignore-build.sh, apps/web/vercel.json, .github/workflows/ci.yml, package.json (scripts), CONTRIBUTING.md-Abschnitt, die drei Handover-Diffs, beide Archiv-Docs.
Vergleichslauf: main 7d1a66c3 per `git archive` in Scratchpad entpackt (nur scripts, .github, package.json, docs/art, DEBT_REGISTER; node_modules verlinkt), dort check-ci-gates gefahren.

## Messungen
| Befehl | Exit |
|---|---:|
| node scripts/check-ci-gates.mjs --selftest | 0 (22 Fälle, 20 rot, 2 grün) |
| node scripts/check-ci-gates.mjs | 0 (34 Tore · 13 Werkzeuge · 1 kein Tor · 6 Importeure) |
| node scripts/check-vercel-ignore-build.mjs --selftest | 0 (9 PASS) |
| node scripts/check-vercel-ignore-build.mjs | 0 (main→1, codex/beispiel→0, beide PASS) |
| pnpm test:vercel-ignore-build | 0 |
| node scripts/check-registers.mjs | 0 |
| pnpm lint (12 s) | 0 |
| (typecheck/build/Vollbatterie: bewusst nicht gefahren, läuft in der GG-Kette) | – |
Stand main 7d1a66c3 (Vergleich): check-ci-gates Exit 0, Selbsttest 16 Fälle/14 rot, 34 Tore · 13 · 1 · 6.

## Suchpunkte
**a) Abschwächung — nichts gefunden.** Zeilen-Diff der Ausgabe main↔PR: genau zwei Zeilen unterscheiden sich (`test-vercel-ignore-build.mjs — pnpm test:vercel-ignore-build` weg, `check-vercel-ignore-build.mjs — echter Lauf (direkt) + Selbsttest` neu) plus Bilanzzahlen (80→82 run-node-Zeilen, 33→34 check-*.mjs; „0 Testdateien“ auf main ist ein Artefakt meiner Teilkopie). Kein Tor fällt heraus, keines kommt unbegründet hinzu; die Zahlen 34/13/1/6 sind gleich, weil ein Tor tauscht. `yaml.load` der drei `run: |`-Blöcke (ci.yml:172 D-98, :216 ffmpeg, :283 perf-contract): Zeilen werden einzeln gelesen, Kommentarzeilen entfallen; M9 (png-identity im Block) wird erkannt. Neu und positiv: Kommentare, die „--selftest“ oder einen Gate-Pfad nennen, zählen nicht mehr (früher konnte ein Kommentar eine echte Zeile als Selbsttest-Zeile tarnen oder ein Tor „verdrahten“). Gesetz 4 (check-ci-gates.mjs:453) nutzt jetzt `usage.has(file)` statt `ciText.includes` — strenger, kein Rückschritt.
**b) `|| true`-Erkennung.** Regex check-ci-gates.mjs:328. Rot (gemessen): `|| true # cgo` (M2a/M2b), `||true` (M3/M3b), `|| true;`, `||  true  `, `&>/dev/null || true`, auch auf der Mehrzeilen-Zeile im D-98-Block (M9). GRÜN (Lücke, HINWEIS H1): `|| exit 0`, `|| echo ok`, `|| :;`, `; true`, `|| TRUE`, `|| /bin/true`, `| cat`, `continue-on-error: true`, `if: false`, Fortsetzungszeile `\` + `|| true` auf eigener Zeile, `echo node scripts/…`.
**c) Kommentar-Regex** (:327): alle 8 `#`-Stellen in run-Zeilen/Blöcken von ci.yml sind echte Kommentare, 0 mit `#` in Anführungszeichen/`$#`. Kein heutiger Schaden. Theoretisch kappt `echo "a #b"` den Rest — harmlos für die Zählung. `git fetch … || true` (ci.yml:292) wird absichtlich nicht gezählt, enthält kein Tor.
**d) Neues Tor ohne Flag.** Semantik korrekt (Vercel: Exit 1 = bauen, 0 = überspringen; main→1, codex/beispiel→0). cwd wird aus der Datei-URL abgeleitet (apps/web), nicht aus process.cwd() — unabhängig vom Aufrufort. Fehlt vercel.json oder Skript: kein sauberer Assert, sondern unbehandelter Fehler mit Stack (M6, M7c), Exit 1 — also rot, nur unschön (H4). ignoreCommand-Änderung (M6c) und Entfernen (M6) rot.
**e) selftestGates.** READS_SELFTEST_FLAG (check-ci-gates.mjs:150) erfasst `includes("--selftest")` und `=== "--selftest"`. Gemessen über alle scripts/check-*.mjs: kein Skript erwähnt `--selftest`, ohne dass die Regex es erfasst; zwei Skripte (check-game-bundle, check-level-candidate) haben keinen Selbsttest. Die reale Konfiguration ist grün (Messung oben), keine neue Ausnahme nötig. Die neue Pflicht ist notwendig und wirksam: M8b (Gesetz abgeschaltet) macht genau die drei „Selbsttest …“-Fälle blind.
**f) Doku.** Satz „seit 02.10. baut Vercel automatisch nur main“ deckt sich mit dem Skript-Kopf (`F3 (2026-10-02): codex/main retired; only main`) und vercel-ignore-build.sh `main) exit 1`. Handovers: die „Historical v1“-Etikettierung ist durch PASSOVER_PROMPT (`gh repo clone VEHO-DOMI/domigo`, „for v2 …“) gestützt. Archiv-Docs: Banner ersetzt, alle FREIGABE-Zeilen „Historische FREIGABE (29./30.09.2026)“, Mockup-Pfad als „nicht im Repo vorhanden“ gekennzeichnet — stimmt (`ls docs/gg`: nur die zwei Dateien; grep `docs/gg/mockup`: nur diese Stelle). Kein Verweis auf den alten Pfad apps/web/scripts/test-vercel-ignore-build.mjs bleibt (repoweiter grep leer). Nicht prüfbar offline: Wortlaut/Existenz der Vercel-Checkbox „Use project's Ignore Build Step“ beim Redeploy und Root Directory = apps/web (H5).
**g) Kinder/Kosten.** `git diff 7d1a66c3 09a30c5d --name-only` unter apps/ packages/ content/ data/: einzig apps/web/scripts/vercel-ignore-build.sh (nur zwei Kommentarzeilen, Logik byte-gleich) — nichts, was ein Kind sieht oder speichert; keine Sackgassen, kein Verlust, keine Schülersprache berührt. apps/web/vercel.json unverändert (0 Diffzeilen): ignoreCommand, Crons (zwei konto-sync) unverändert; main baut weiter (Exit 1), alle anderen Zweige bleiben übersprungen. Spielseite page.tsx nicht im Diff.
**h) Weiteres:** siehe Funde.

## Mutanten
| # | Datei | Änderung | Prüfung | Ergebnis | Bewertung |
|---|---|---|---|---|---|
| M1 | ci.yml | echte Zeile gelöscht | check-ci-gates | ROT (nur Selbsttest, nie echt) | wie gewollt |
| M1b | ci.yml | Selbsttest-Zeile gelöscht | check-ci-gates | ROT (liest --selftest, kein wirksamer Selbsttest) | wie gewollt |
| M2a | ci.yml | echte Zeile `\|\| true # cgo` | check-ci-gates | ROT | OK (Erstversuch mit true im Kommentar war ein Fehlmutant, wiederholt) |
| M2b | ci.yml | Selbsttest `\|\| true # cgo` | check-ci-gates | ROT | OK |
| M3/M3b | ci.yml | `\|\|true` ohne Leerzeichen (beide Zeilen) | check-ci-gates | ROT | OK |
| M3c/f/g | ci.yml | `\|\| true;` · `&>/dev/null \|\| true` · `\|\|  true  ` | check-ci-gates | ROT | OK |
| M3d/e | ci.yml | `\|\| TRUE` · `\|\| /bin/true` | check-ci-gates | GRÜN | Lücke, HINWEIS H1 |
| M4 | ci.yml | `\|\| exit 0` | check-ci-gates | GRÜN | Lücke, HINWEIS H1 (unrealistisch genug, nicht beauftragt) |
| M4b/c/d/e | ci.yml | `\|\| echo ok` · `\|\| :;` · `; true` · `\| cat` | check-ci-gates | GRÜN | HINWEIS H1 |
| M4f/g/h | ci.yml | `continue-on-error: true` · `if: false` · `echo node …` | check-ci-gates | GRÜN | HINWEIS H1 (Nicht-Ziel des PR, schon vorher so) |
| M4i | ci.yml | Zeile als Shell-Kommentar in Anführungszeichen | check-ci-gates | ROT | OK |
| M5 | package.json | test:vercel-ignore-build → fehlende Datei | check-ci-gates / pnpm-Alias / Tor | check-ci-gates GRÜN · Alias ROT · Tor GRÜN | HINWEIS H2 |
| M6 | vercel.json | ignoreCommand entfernt | check-vercel-ignore-build (--selftest und echt) | ROT, ROT (Stack, Exit 1); check-ci-gates GRÜN (zuständig ist es nicht) | OK |
| M6b | vercel.json | Cron-Zeitplan geändert | check-vercel-ignore-build | GRÜN | bekannt (H4 des PR), HINWEIS H6 |
| M6c | vercel.json | ignoreCommand verlängert | check-vercel-ignore-build | ROT | OK |
| M7 | vercel-ignore-build.sh | `main) exit 0` | Selbsttest und echter Lauf | ROT, ROT | wie gewollt |
| M7b | Shell | `*) exit 1` (alles baut) | Selbsttest und echt | ROT, ROT | OK |
| M7c | Shell | Skript fehlt | echter Lauf | ROT (Stack) | OK, H4 |
| M7d | Shell | `main*) exit 1` | Selbsttest · echt | ROT · GRÜN | echter Lauf prüft nur 2 Zweige; Selbsttest fängt es — OK durch Arbeitsteilung |
| M8 | check-ci-gates.mjs | `\|\| true`-Filter entfernt | --selftest | ROT (beide `\|\| true`-Fälle „KEIN rotes Licht“); echter Lauf grün | wie gewollt |
| M8b | check-ci-gates.mjs | selftestGates-Gesetz abgeschaltet | --selftest | ROT (3 Selbsttest-Fälle blind) | zeigt: Gesetz ist nötig |
| M9 | ci.yml | `node scripts/check-png-identity.mjs --ref FETCH_HEAD \|\| true` im run:-Block | check-ci-gates | ROT | OK, Schutz gilt für alle Tore |
| M9b/c/d | ci.yml | `\|\| exit 0` · auskommentiert · gelöscht (png-identity) | check-ci-gates | GRÜN · ROT · ROT | exit 0 = H1 |
| M10 | ci.yml | `run: \|` mit `\` + `\|\| true` auf Folgezeile | check-ci-gates | GRÜN | H1 |
Alle Mutanten per `git checkout -- <datei>` (bzw. mv zurück) sofort zurückgenommen.

## Funde
**H1 (HINWEIS, hoch) — Umgehungen des Fehlerunterdrückungs-Schutzes bleiben grün.** scripts/check-ci-gates.mjs:328 erkennt nur `|| true` am Zeilenende. Grün bleiben `|| exit 0`, `|| echo ok`, `|| :`, `; true`, `|| TRUE`, `|| /bin/true`, `| cat`, Zeilenfortsetzung, `continue-on-error: true`, `if: false` am Schritt (Messungen M3d–M4h, M9b, M10). Erwartung laut Karte: nur `|| true`; das ist erfüllt. Behebung (optional): zusätzlich `continue-on-error`/`if` am Schritt prüfen (Daten liegen schon als `step`-Objekt vor, check-ci-gates.mjs:323ff) und `|| (exit 0|echo|:)`; kein vollständiger Shell-Interpreter — der PR räumt das selbst ein.
**H2 (HINWEIS, hoch) — Alias test:vercel-ignore-build ist unbewacht.** package.json:32. CI ruft ihn nicht mehr; Gesetz 4 (check-ci-gates.mjs:446) prüft nur Namen mit `check:`-Präfix. Zeigt der Alias auf eine fehlende Datei (M5), bleibt alles grün; nur ein Mensch merkt es. Behebung: Alias entfernen (Karte erlaubte „oder entfernen“) oder in Gesetz 4 einbeziehen.
**H3 (HINWEIS, mittel) — Selbsttest-Fälle sind an Format und Dateiname der CI-Zeilen gekettet.** check-ci-gates.mjs:563–569: `costLine` verlangt genau eine Zeile `^\s*- run: node ` je Modus und wirft sonst (`expected one CI line …`). Wird das Tor später z. B. mit `--experimental-strip-types` anders geschrieben oder als `name:`-Schritt verdrahtet, bricht der Selbsttest ab (rot, nicht still) — Wartungsfalle, kein Fehler. Der echte Lauf ist nicht betroffen.
**H4 (HINWEIS, niedrig) — fehlende Datei als Stack statt als Assert-Meldung.** scripts/check-vercel-ignore-build.mjs:9–11: `readFileSync`/`statSync` werfen ENOENT unbehandelt (M6/M7c, Exit 1). Rot bleibt es; die Meldung ist für Nicht-Ingenieure schwer lesbar. Auch läuft die Konfigurationsprüfung vor dem Flag, d. h. der „reine“ --selftest hängt ebenfalls an der echten vercel.json (beabsichtigt oder nicht, M6 fällt dort rot).
**H5 (HINWEIS, mittel) — Plattformaussagen offline unbelegt.** CONTRIBUTING.md:75–79 und Handover-Texte behaupten, bei „Redeploy“ lasse sich „Use project's Ignore Build Step“ abwählen, und die Regel setze Root Directory = apps/web voraus. Konsistent mit dem Skript-Kopf (PR 479), aber nicht prüfbar ohne Vercel-Zugang; der PR nennt es selbst UNVERIFIZIERT. Behebung: einmalig im Vercel-Dashboard bestätigen.
**H6 (HINWEIS, hoch) — bekannte, vom PR bewusst offen gelassene Lücken.** Cron-Paar und Fallliste ungeschützt (M6b grün); Fork-Zweig „main“ und Doku-Merges bauen (im Shell-Kopf als Grenze vermerkt, vercel-ignore-build.sh:4). Entspricht Hinweis H4/H5 des Vorprüfberichts, kein neuer Umfang.

## Nicht geprüft
pnpm typecheck / build / voller pnpm test / check:bundle (GG-Kette). Vercel-Dashboard (Root Directory, Redeploy-Checkbox, tatsächliches Bauverhalten, Abrechnung). Der GitHub-Lauf 37192401781 wurde nicht selbst abgerufen (PR-Text-Angabe). Keine Produktionsdaten, keine Schülernamen angefasst.

FREIGABE für Merge PR 483: ja — Beleg: 7 Tore (inkl. lint) Exit 0 am Kopf 09a30c5d; main-Vergleich ohne verlorenes Tor; die drei beauftragten Entschärfungen (löschen/auskommentieren/`|| true`) je für Selbsttest- und echte Zeile rot, 12 weitere ci.yml/Shell/vercel.json-Mutanten wie erwartet; nur apps/-Berührung ist ein Shell-Kommentar, vercel.json und Crons unverändert; 0 SPERRE.

— Prüfer PR 483 (blind)
