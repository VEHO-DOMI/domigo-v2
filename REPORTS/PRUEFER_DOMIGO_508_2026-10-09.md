# PRUEFER-508 · blinder Code-Leser · PR 508 »cgo-109: OG-Parität W2« · 2026-10-09

- PR: VEHO-DOMI/domigo-v2 #508 · Kopf-sha: 91db46fdc709cf173a7305430322ae8751e8db79 (`fix: use submit event time for the client deadline check`)
- Basis = PR-507-Kopf: db3baa69ae01024c8fc499f16e90b05844227b7b · geprüft: `git diff refs/pr/507..refs/pr/508` (31 Dateien, +911/−8; packages/db unverändert)
- Worktree: ~/Code/_gg/domigo-review-508-leser (sauber, Build-Artefakte ignoriert) · Mutanten: ~/Code/_gg/domigo-review-508-leser-mut · Logs: ~/Code/_gg/domigo-review-508-leser-logs
- Methode: nur Code gelesen, Tore und Mutanten selbst gelaufen; keine Berichte des Autors, kein Neon/.env.

## Ergebnis in Kürze
V1–V8 alle ✓. Funde: 0 SPERRE · 3 SOLLTE · 7 HINWEIS. 97 CI-Tor-Zeilen + `pnpm --filter web test` (1044/1044) grün. Mutanten: 23 Patches + 1 Sonde, 20 rot, 3 grün (b, l, o — siehe Funde F2/F3), jeder Patch zurückgesetzt, md5 vorher = nachher.

## Vertrag V1–V8

**V1 Gesetz 5 ✓.** Kein `xpForTier` und keine XP-Arithmetik in apps/web/app/modi/** (grep + C03 mit AST-Prüfung, contract.test.ts:30-47). Einzige Summe: ModeSession.tsx:79 addiert nur Server-Quittungen (`receipt.xpAwarded`), Duplikate zählen 0 (attempt-outbox.ts attemptResult). Jede gewertete Eingabe: ModeSession.tsx:54 `attemptSender(preview, ownerId)(body)`; die fünf Spiele rufen nur `submit` (Flashcards.tsx:22, Memory.tsx:23, Spelling.tsx:27, WordHunt.tsx:21, Speed.tsx:36). Vorschau: ModeSession.tsx:35 `useOutboxFlush(!preview, ownerId)`, attemptSender liefert in der Vorschau `Promise.resolve` (preview-attempt.ts:22) ⇒ 0 POST; Speed holt in der Vorschau keinen Start (ModeSession.tsx:64 `!preview`). Wächter: play-access-map.test.ts C17/C18 (Zeilen 30-50) für alle fünf page.tsx + ModeSession; Mutanten f, f2, p rot.

**V2 /api/attempts minimal und getestet ✓.** route.ts-Diff = 6 Zeilen: Import ×2, Zeile 84 `validModeInput` (400), Zeile 85 Speed-Tor (410), Zeile 183 `flashcards ⇒ xpAwarded = 0`. Bewertung (gradeVocab/gradeGrammar, route.ts:121-132) unverändert. mode-Tags: attempt-policy.ts:5-8 (flashcards|memory|spelling|wordhunt|speed gelten nur für Vokabel-ids `g1-4 u n .w.` und feste Eingabeart/Pool), Tests C09/C16. Speed-Deadline: speed-session.ts:11-27, Startzeit vom Server (`/modi/speed/start/route.ts:10`, HMAC über Besitzer+Start+Nonce), `now` = `Date.now()` des Servers, Ablauf exakt bei 60 000 ms (`now >= start+60s` ⇒ falsch), 410 vor Bewertung/Speicherung; Client-Feld `clientNow` wird ignoriert (Probe: 410). Tests C12/C13. Idempotenz über clientAttemptId liegt unverändert in recordAttempt (PR fasst db nicht an); der Web-Pfad erzeugt je Versuch `crypto.randomUUID()` (ModeSession.tsx:47) — dafür fehlt ein Test (Fund F3).

**V3 Flashcards ✓.** »Got it« sendet die freigegebene Antwort (`fullAnswer(word, direction)`), »Again« einen leeren Wert (Flashcards.tsx:22) ⇒ Server-Tier correct/wrong; recordAttempt aktualisiert die Leitner-Queue für jeden Versuch (packages/db/src/review.ts:43 »for EVERY attempt, any mode«). Keine eigene Tabelle, kein Schema, packages/db 0 Zeilen Diff. XP 0 serverseitig (route.ts:183); Tests C11 (correct und wrong, `xpAwarded 0`, mode/tier in der Schreibzeile). Mutanten d, m rot.

**V4 Spelling Bee ✓.** Normalisierung in der Engine: packages/engine/src/spelling.ts `spellingLayout` (to/a/an/the, Klammern, sth./sb./s.o./s.th., Nicht-Buchstaben fest) und `spellingAnswer` (verfälscht/kürzt nie, auch Überlänge bleibt); Engine-Test spelling.test.ts. Der Client sendet nur die zusammengesetzte Eingabe (Spelling.tsx:27); bewertet wird auf dem Server (C15, Tier + XP = difficulty×10). Hinweis: Spelling.tsx:27 gibt `hint` als 3. Argument ⇒ `hintUsed` im Body (ModeSession.tsx:51); C15 prüft `hintUsed` in der Schreibzeile; Mutante k rot. Einziger Client-Bewerter ist der Vorschau-Zweig ModeSession.tsx:56 (`gradeVocab`), der nichts sendet/belohnt (HINWEIS H6).

**V5 Memory / Word Hunt ✓ mit Vorbehalt F1.** Memory: nur ein Paar `a.pair === b.pair && a.side !== b.side` bucht (`choice`, `fullAnswer(word)`, id = Wort-id, Memory.tsx:21-23); Fehlpaare: Zug, kein Versuch (Memory.tsx:27; C05 zählt `await submit(` = 1; Mutante o2 rot). Word Hunt: richtige Wahl = `choice` mit Ziel-id und Zielwort (WordHunt.tsx:21, decks.ts:56). Reserve: ModePage.tsx:20 `loadPracticeWords` filtert `assignPool !== "mock"` (load-practice.ts:17) VOR `huntRounds` (ModePage.tsx:21); Wörter, Tarnwörter und Ziel-Namen kommen alle aus dieser gefilterten Liste (decks.ts:41-50). C02 + Mutante g rot. Vorbehalt F1: falsche Wortwahl in Hunt erzeugt sehr wohl einen Versuch (wrong) — gegen ein fremdes Zielwort.

**V6 Keine toten Kacheln ✓.** /modi: 10 Kacheln (ModePicker.tsx:17-22) + Story + Smart Review + Dictionary & Flashcards. Alle fünf neuen Ziele haben page.tsx (flashcards|memory|spelling|wordhunt|speed); /practice, /review, /woerterbuch, /home, /play/[grade] existieren. Bestehender Wächter »all declared tile destinations are real routes« + C01. Mutante h (Battle Arena) rot. Middleware: middleware.ts:78 `"/modi/:path*"` (C17; Mutante p rot) — deckt auch /modi/speed/start.

**V7 Sprache ✓.** `check-chapter-copy`: 76 Dateien, 0 Verstöße (+Selbsttest 0); überall »Chapter« (ModePicker.tsx:30, Speed.tsx:52, WordHunt.tsx:28, ModeSession.tsx:88). Wächter »modi: no motivational formulas in source« rot bei »Super! Well done!« (Mutante j). Keine Schülernamen. Dunkelmodus: modes.css nutzt durchgängig W1-Tokens (`--card`, `--accent`, `--wrong` …); Ausnahmen H5.

**V8 Tore ✓.** Siehe Tor-Tabelle: alle 97 einzeiligen `- run:`-Zeilen außer `pnpm install` Exit 0, darunter `pnpm typecheck`, `pnpm lint` (0 Fehler, 7 Warnungen in fremden Dateien paint-content.test/regelbuch/studio-solve-sandbox), `pnpm test` (Workspace), check-chapter-copy ±selftest, check-claim-filter ±selftest, `pnpm build`, `pnpm check:bundle`. Zusätzlich einzeln: `pnpm --filter web test` = 1044 pass / 0 fail (enthält status-doc.test.ts = STATUS-Wächter und contract/route/play-access-map C01-C21); Engine-Tests 138 pass inkl. spelling.test.ts. Mehrzeilige `run: |`-Blöcke (ci.yml Zeilen 178/222/289) bewusst nicht gelaufen (Auftrag: nur einzeilige).

## Funde

**SPERRE: keine.**

**SOLLTE**
- **F1 Word Hunt: Tarnwort-Wahl bucht einen falschen Versuch gegen ein unbeteiligtes Zielwort.** decks.ts:50-54 hängt jedes Tarnwort an das erste Ziel, gegen das es »wrong« bewertet (`anchor`); WordHunt.tsx:21 sendet dann `submit(tile.item /*Anker*/, choice, value: Tarnwort)`. Folge: Leitner-Box 1 und »wrong«-Eintrag für ein Wort, das das Kind gar nicht angeklickt hat — bis zu 5 falsche Versuche je Runde auf demselben Anker. V5 verlangt »kein Versuch (oder begründet)«; weder decks.ts-Kommentar noch das Design-Blatt begründen die Nebenwirkung auf die Wiederholungsqueue. Fix-Vorschlag: falsche Wahl nur anzeigen, nicht buchen (Test: C07 zählt `submit`-Aufrufe für Tarnwörter), oder Wort-Eigenversuch ausdrücklich im Blatt begründen und Anker je Tarnwort zufällig statt immer das erste Ziel.
- **F2 Ungepinnt: Speed-Zeit aus dem Client (Mutante b grün).** Ein Patch, der `context.clientNow` statt `Date.now()` benutzt (speed-session.ts), lässt die ganze Suite grün; der Ist-Code ist korrekt (Probe: 410 trotz `clientNow`). Test fehlt: POST mit abgelaufenem Token + frisch behauptetem `clientNow` muss 410 liefern (route.test.ts, 1 Zeile).
- **F3 Ungepinnt: gleiche clientAttemptId je Versuch (Mutante l grün).** Setzt man ModeSession.tsx:47 auf eine Konstante, bleibt alles grün — die Doppelbuchung/Verlust-Klasse (zweite Antwort gilt als Duplikat, XP 0) hat im Web-Pfad keinen Test. Fix: Test, dass ModeSession `crypto.randomUUID()` je `submit` aufruft (Quellmuster wie C20) oder Verhaltenstest mit zwei submits.

**HINWEIS**
- H1 Mode-Tag ist freie Zeichenkette (route.ts:46; attempt-policy.ts:5 `return true` für unbekannte Tags). Probe: `mode:"foo"` ⇒ 200 mit voller XP (20). Das war schon vor W2 so (»andere Modi behalten ihren Vertrag«) und Flashcards-XP-0 bzw. Speed-Frist lassen sich so umgehen; da die Alt-Modi ohnehin XP geben, kein neuer Schaden. Zur Kenntnis für die Gesamtkette (Allow-Liste statt Regex wäre eine Folgekarte).
- H2 Outbox behält abgewiesene Zeilen: 410 (`speed_expired`) und 400 (`bad_mode_input`) werden nie gelöscht (attempt-outbox.ts:177-180 »Only a successful, explicit receipt«) und bei jedem Seitenaufruf/»online« neu gepostet. Ein verspätetes Duplikat nach Sekunde 60 bekommt 410 statt der gespeicherten Quittung, weil die Frist (route.ts:85) vor der Idempotenz-Suche greift. design_language.md benennt die Bereinigung ausdrücklich als »außerhalb dieses Zauns« — Folgekarte nötig.
- H3 Ein Speed-Token erlaubt beliebig viele Antworten in den 60 s (Probe: 50 × 200). Kein neues Loch (XP-Farming ist über jeden Modus mit neuen UUIDs möglich), aber die Frist begrenzt nur die Dauer, nicht die Zahl.
- H4 Speed-Signatur braucht AUTH_SECRET/NEXTAUTH_SECRET (speed-session.ts:5-8). Fehlt die Variable, antwortet /modi/speed/start 503 und jede Speed-Antwort 410 (Fehler wird in `speedSessionValid` verschluckt). Vor Produktion bestätigen, dass die Variable im Zielbau gesetzt ist (Wert nicht gelesen). Außerdem landet das Token (Signatur+Nonce) im `context`-jsonb jeder Speed-Zeile (route.ts:`contextWithTrap`) — nach 60 s wertlos, aber unnötige Speicherung.
- H5 modes.css:27 hat feste Farben `#f87171` (Speed-Timer, überschreibt `--accent`) und `#fff` (Z.17); `#f87171` auf hellem Grund ≈ 2,8:1 (unter 3:1 für große Schrift). Kopf Z.1 trägt »CODEX DRAFT — NOT CANON« (so auch im Design-Blatt gewollt). Dunkelmodus sonst über Tokens.
- H6 Vorschau bewertet im Client (`gradeVocab`, ModeSession.tsx:56) nur zur Anzeige, ohne Request/Belohnung; für Schüler gilt das nie (preview ⇒ kein POST). Konform mit Gesetz 5, aber der einzige Client-Bewerter im Modul.
- H7 Teststärke: etwa die Hälfte der Verträge (C01-C10, C19-C21) sind Quelltext-Regex-Pins. Alle 20 roten Mutanten wurden damit tatsächlich gefangen, aber `void submit(…)` statt `await submit(…)` in Memory (Mutante o) rutscht durch den Zähler C05 (`await submit\(` = 1).

## Mutanten-Tabelle (je Patch → `pnpm --filter web test` + check-chapter-copy + check-copy-register, Engine-Mutante → engine-Tests; danach `git checkout -- <Datei>`, md5 vorher = nachher in allen Fällen)

| Kz | Mutante | Ergebnis | Fangender Test |
|---|---|---|---|
| a | lokale XP-Addition in Memory (`const xp = matched.length * 10`) | ROT | C03 |
| b | Speed-Frist aus Client-Zeit (`context.clientNow`) | **GRÜN (Fund F2)** | — |
| c | Speed akzeptiert nach 61 s (SPEED_DURATION_MS 61 000) | ROT | C12 |
| d | Flashcards »Again« bucht correct | ROT | C04 |
| e | Spelling: Client sendet immer die Lösung | ROT | C06 |
| f | Vorschau sendet (`useOutboxFlush(true, …)`) | ROT | C18 |
| f2 | Vorschau sendet (`attemptSender(false, …)`) | ROT | C18 |
| g | reservierte Items sichtbar (Reserve-Laden mit Vorschau-View) | ROT | C02 |
| h | tote Kachel »Battle Arena« in /modi | ROT | »all declared tile destinations are real routes« + Nachzug-1-Zählung (11 statt 10 og-mode-xp) |
| i | validModeInput lässt Memory mit vocab-Eingabe durch | ROT | C09, C16 |
| i2 | Sonde: Server mit Tag »foo« | akzeptiert (200, 20 XP) | — siehe H1 |
| j | Motivationsformel »Super! Well done!« | ROT | »modi: no motivational formulas in source« |
| k | hintUsed nie gesetzt (Spelling) | ROT | C06 |
| k2 | hintUsed nie gesetzt (Speed) | ROT | C21 |
| l | clientAttemptId je Versuch gleich (Konstante) | **GRÜN (Fund F3)** | — |
| m | Flashcards-XP-0 entfernt | ROT | C11 |
| n | Speed-Frist im Server entfernt | ROT | C12, C13 |
| o | Memory bucht falsches Paar per `void submit(` | GRÜN (H7) | — |
| o2 | Memory bucht falsches Paar per `await submit(` | ROT | C05 |
| p | Middleware-Matcher `/modi/:path*` entfernt | ROT | C17 |
| q | Signatur ignoriert Besitzer | ROT | C12 |
| r | Word Hunt sendet Zielwort statt gewähltes Wort | ROT | C07 |
| s | Engine: to/a/an/the nicht mehr fest | ROT | engine spelling.test |
| t | Token-Prüfung akzeptiert fehlenden Token | ROT | C13 |

Zählung: 23 Patch-Mutanten + 1 Sonde; 20 rot, 3 ohne roten Test (b, l, o; o2 als Ersatzform rot).

## Tor-Tabelle (alle einzeiligen `- run:` aus .github/workflows/ci.yml außer `pnpm install`; Exit-Code; Logs gate-N.log)

Zusätzlich: `pnpm --filter web test` Exit 0 (1044/1044), Reihenfolge 1-97 = Reihenfolge in ci.yml.

| Nr | Befehl | Exit |
|---|---|---|
| 1 | `pnpm typecheck` | 0 |
| 2 | `pnpm lint` | 0 |
| 3 | `node scripts/check-vercel-ignore-build.mjs --selftest` | 0 |
| 4 | `node scripts/check-vercel-ignore-build.mjs` | 0 |
| 5 | `node --test scripts/gg-gate-policy/register.test.mjs` | 0 |
| 6 | `pnpm test` | 0 |
| 7 | `pnpm content validate` | 0 |
| 8 | `pnpm content validate-story` | 0 |
| 9 | `pnpm content validate-listening` | 0 |
| 10 | `pnpm content validate-test` | 0 |
| 11 | `node --experimental-strip-types scripts/check-story-grounding.mjs --selftest` | 0 |
| 12 | `node --experimental-strip-types scripts/check-story-grounding.mjs` | 0 |
| 13 | `node --experimental-strip-types scripts/check-g3-economy.mjs --selftest` | 0 |
| 14 | `node --experimental-strip-types scripts/check-g3-economy.mjs` | 0 |
| 15 | `node --experimental-strip-types scripts/check-g3-comments.mjs --selftest` | 0 |
| 16 | `node --experimental-strip-types scripts/check-g3-comments.mjs` | 0 |
| 17 | `node scripts/check-g3-spoiler.mjs --selftest` | 0 |
| 18 | `node scripts/check-g3-spoiler.mjs` | 0 |
| 19 | `node scripts/story/apply-g3-feedback.mjs --check` | 0 |
| 20 | `node --experimental-strip-types scripts/check-paint-copy.mjs --selftest` | 0 |
| 21 | `node --experimental-strip-types scripts/check-paint-copy.mjs` | 0 |
| 22 | `node scripts/check-copy-register.mjs --selftest` | 0 |
| 23 | `node scripts/check-copy-register.mjs` | 0 |
| 24 | `node scripts/check-chapter-copy.mjs --selftest` | 0 |
| 25 | `node scripts/check-chapter-copy.mjs` | 0 |
| 26 | `node scripts/check-design-sheets.mjs --selftest` | 0 |
| 27 | `node scripts/check-design-sheets.mjs` | 0 |
| 28 | `node --experimental-strip-types scripts/check-game-tasks.mjs --selftest` | 0 |
| 29 | `node --experimental-strip-types scripts/check-game-tasks.mjs` | 0 |
| 30 | `node scripts/check-level-design.mjs --selftest` | 0 |
| 31 | `node scripts/check-level-design.mjs` | 0 |
| 32 | `node scripts/check-registers.mjs --selftest` | 0 |
| 33 | `node scripts/check-registers.mjs` | 0 |
| 34 | `node scripts/check-roster-twins.mjs --selftest` | 0 |
| 35 | `node scripts/check-roster-twins.mjs` | 0 |
| 36 | `node scripts/check-journal-door.mjs --selftest` | 0 |
| 37 | `node scripts/check-journal-door.mjs` | 0 |
| 38 | `node scripts/check-claim-filter.mjs --selftest` | 0 |
| 39 | `node scripts/check-claim-filter.mjs` | 0 |
| 40 | `node scripts/import-checkup-journal.mjs --selftest` | 0 |
| 41 | `node scripts/import-checkup-journal.mjs --out "$(mktemp -d)"` | 0 |
| 42 | `node scripts/check-no-local-login.mjs --selftest` | 0 |
| 43 | `node scripts/check-no-local-login.mjs` | 0 |
| 44 | `node --experimental-strip-types scripts/check-paint-art.mjs --selftest` | 0 |
| 45 | `node --experimental-strip-types scripts/check-paint-art.mjs` | 0 |
| 46 | `node scripts/check-story-art.mjs --selftest` | 0 |
| 47 | `node scripts/check-story-art.mjs` | 0 |
| 48 | `node scripts/check-g4-version-a.mjs --selftest` | 0 |
| 49 | `node scripts/check-g4-version-a.mjs` | 0 |
| 50 | `node scripts/check-composition.mjs --selftest` | 0 |
| 51 | `node scripts/check-composition.mjs` | 0 |
| 52 | `node --experimental-strip-types scripts/check-png-seams.mjs --selftest` | 0 |
| 53 | `node --experimental-strip-types scripts/check-png-seams.mjs` | 0 |
| 54 | `node --experimental-strip-types scripts/check-body-silhouette.mjs --selftest` | 0 |
| 55 | `node --experimental-strip-types scripts/check-body-silhouette.mjs` | 0 |
| 56 | `node --experimental-strip-types scripts/make-body-stencils.mjs --selftest` | 0 |
| 57 | `node --experimental-strip-types scripts/retire-phase-art.mjs --selftest` | 0 |
| 58 | `node --experimental-strip-types scripts/check-ground-plane.mjs --selftest` | 0 |
| 59 | `node --experimental-strip-types scripts/check-ground-plane.mjs` | 0 |
| 60 | `node scripts/check-colour-truth.mjs --selftest` | 0 |
| 61 | `node scripts/check-colour-truth.mjs` | 0 |
| 62 | `node scripts/check-sheet-colours.mjs --selftest` | 0 |
| 63 | `node scripts/check-sheet-colours.mjs` | 0 |
| 64 | `node docs/art/import-batch-aq12.mjs --selftest` | 0 |
| 65 | `node docs/art/import-batch-aq13.mjs --selftest` | 0 |
| 66 | `node docs/art/import-batch-aq15.mjs --selftest` | 0 |
| 67 | `node docs/art/import-batch-aq17.mjs --selftest` | 0 |
| 68 | `node docs/art/import-ch01-buecherwelt.mjs --selftest` | 0 |
| 69 | `node scripts/check-png-identity.mjs --selftest` | 0 |
| 70 | `node --experimental-strip-types scripts/check-perf-budget.mjs --selftest` | 0 |
| 71 | `node --experimental-strip-types scripts/check-perf-budget.mjs` | 0 |
| 72 | `node scripts/check-fonts.mjs --selftest` | 0 |
| 73 | `node scripts/check-fonts.mjs` | 0 |
| 74 | `node scripts/check-umbrella-tokens.mjs --selftest` | 0 |
| 75 | `node scripts/check-umbrella-tokens.mjs` | 0 |
| 76 | `node scripts/check-secrets.mjs --selftest` | 0 |
| 77 | `node scripts/check-secrets.mjs` | 0 |
| 78 | `node scripts/check-datenschutz-claims.mjs --selftest` | 0 |
| 79 | `node scripts/check-datenschutz-claims.mjs` | 0 |
| 80 | `node scripts/check-audio.mjs --selftest` | 0 |
| 81 | `node scripts/check-audio.mjs` | 0 |
| 82 | `node scripts/measure-presence.mjs --selftest` | 0 |
| 83 | `node scripts/measure-motion.mjs --selftest` | 0 |
| 84 | `node scripts/measure-veil.mjs --selftest` | 0 |
| 85 | `node scripts/measure-residue.mjs --selftest` | 0 |
| 86 | `node scripts/frame-sink.mjs --selftest` | 0 |
| 87 | `node scripts/shoot-world.mjs --selftest` | 0 |
| 88 | `node scripts/shoot-card-bench.mjs --selftest` | 0 |
| 89 | `node scripts/perf-visible.mjs --selftest` | 0 |
| 90 | `node scripts/chrome-hygiene.mjs --selftest` | 0 |
| 91 | `node scripts/art-recompress.mjs --selftest` | 0 |
| 92 | `node scripts/set-plane-value.mjs --selftest` | 0 |
| 93 | `node scripts/check-ci-gates.mjs --selftest` | 0 |
| 94 | `node scripts/check-ci-gates.mjs` | 0 |
| 95 | `node scripts/check-perf-table.mjs --selftest` | 0 |
| 96 | `pnpm build` | 0 |
| 97 | `pnpm check:bundle` | 0 |

Nicht-Null-Exits: 0.

## Schluss
FREIGABE für GG-Review: ja — Beleg: V1–V8 am Code mit Datei:Zeile belegt; 97/97 CI-Tore Exit 0 + web-Tests 1044/1044; 20 von 23 Patch-Mutanten rot, die 3 grünen (F2, F3, H7) sind fehlende Pins, kein Fehler im Ist-Code (Probe belegt 410 gegen clientNow); keine SPERRE. Vor Merge: F1 (Hunt-Tarnwort bucht gegen Anker) entscheiden — Fix oder begründen; F2/F3 als Test-Nachzug.

— PRUEFER-508 (Sonnet 5.5, blind)
