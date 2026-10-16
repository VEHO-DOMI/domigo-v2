# PRUEFER-DOMIGO-507 · Blinder Code-Leser (Sonnet 5.5) · 2026-10-09

**PR 507** »cgo-108: OG-Parität W1 — Kinder-Startseite /home, Modus-Wahl /modi, Profil /profil mit 50 Avataren, Fortschritt /fortschritt, Daily Challenge, Smart Review; Migration 0022 student_profile«
**Kopf-sha:** 47a0f54d51172b5cfa5e2f111ef600b2e11a0e74 · **merge-base:** 1197a30bc9a4f4814b47285af9a53c695db4bb46 · **origin/main beim Lesen:** 8c8acd81520e6ea9b4709804258bb3133cbf0f24 (enthält 0020/0021 = PR 490/498, siehe F6)
**Diff:** 87 Dateien (50 Avatar-PNGs neu, 21 A + 16 M sonstige); Worktrees: ~/Code/_gg/domigo-review-507-leser (Tore), …-mut (Mutanten), Logs: ~/Code/_gg/domigo-review-507-leser-logs

## Zählung
Funde: **0 SPERRE · 4 SOLLTE · 7 HINWEIS**. Tore: **97/97 CI-Einzeiler Exit 0** + web 912/912 + db 599 grün (1 übersprungen, schon im Bestand) + drizzle-kit »No schema changes«. Mutanten: **45 gefahren, 41 rot, 4 grün** (m, m2, t = Funde F1/F2; z4 = nur Kommentar, kein Fund). Alle Mutanten: md5 vor/nach `git checkout` gleich.

## Vertrag V1–V8

**V1 ✓ Betrachter auf dem Server / Vorschau ohne Kinderstand.** Alle vier Seiten: `resolveStudentView(...)`, `trainerGrade(view)`, `acting = view.kind === "student" ? view.player : null` (home/page.tsx:15-20, modi/page.tsx:11-15, profil/page.tsx:11-16, fortschritt/page.tsx:12-17). `trainerGrade` (lib/student-view.ts:99-103): Kind = genau ein eigener Jahrgang, sonst `null` (Seite meldet Fehler/Redirect, wählt nie einen fremden Jahrgang; Test avatar.test.ts:19-30). Kinderstand nur hinter `acting`: Daily-Zähler home/page.tsx:26, Due-Counts modi/page.tsx:17, Fortschritt fortschritt/page.tsx:20; Avatar/XP/Streak: home/trainer-data.ts:9 gibt in der Vorschau vor `auth()` feste Platzhalter zurück. Vorschau schreibt nichts: AvatarPicker.tsx:18 (`if (preview)` vor dem einzigen `fetch`, :22), PracticeSession über `attemptSender(preview, …)` (stumm), Wächter `OG W1 surfaces` play-access-map.test.ts:527-531 (alle vier Seiten) + :533-546. Mutanten a1–a4, p, v, y rot.

**V2 ✓ Schreibwege.** Genau ein neuer: POST /api/profil (api/profil/route.ts:8-21): `getActingUser` (Lehrkraft hat classId=null ⇒ 401, lib/identity.ts:73-78), Origin-Gleichheit (:11, sonst 403), `ownerId === acting.userId` (:13), `validAvatar` 1..50 ganzzahlig (student-profile-service.ts:10-12), dann `setStudentAvatar` mit Klasse/Konto aus der Sitzung, nie aus dem Body (:15). Scope-Wand + Rolle in EINER Anweisung: INSERT…SELECT mit `inArray(classScope)`, `classId`, `id = userId`, `role = student` (service:64-75), `changed.length === 0` ⇒ Forbidden. Daily läuft über den bestehenden Weg: PracticeSession.tsx:52 `mode: runMode === "daily" ? "daily" : "practice"` → /api/attempts (unverändert, Neugradierung server-seitig, Einheit aus itemId). Kein XP-Schreiben außer `recordAttempt`. Mutanten b1, b2, b3(Gate), c, d1, d2, o, q rot.

**V3 ✓ Migration 0022 additiv.** 0022_student_profile.sql: nur `CREATE TABLE IF NOT EXISTS "domigo_v2"."student_profile"` (user_id uuid PK, avatar smallint NOT NULL, updated_at timestamptz default now(), CHECK 1..50); Journal idx 22, version "7", `when` 1791464400000 > idx 19 (_journal.json:144-150; idx 20/21 fehlen auf diesem Stand, F6). Snapshot 0022 (prevId = id von 0019 ✓, einzig neue Tabelle `student_profile`, sonst Tabellen byte-gleich zu 0019, geprüft per Skript). **`drizzle-kit generate` ausgeführt (im -mut-Worktree, ohne DATABASE_URL): »No schema changes, nothing to migrate«, Exit 0, git status sauber.** Löschweg: konto-loeschung.ts:77 + Test student-profile-service.test.ts:73-81 (Mutant i rot). Register: datenschutz-spalten.ts:167-171, Test datenschutz-page.test.ts:106-146 (Mutant j rot). Test migration-additiv: service.test.ts:110-121 (Mutanten z, z2 rot).

**V4 ✓ Rückfall ohne Tabelle.** student-profile-service.ts:25-34 `assignAvailableAvatars` (Klassenreihenfolge createdAt,id; gespeicherte Wahl zuerst, dann erster freier, ab 50 → 1); :36-40 nur Code 42P01 (auch in `cause`) wird verschluckt, jeder andere Lesefehler wirft; Seite fängt: trainer-data.ts:14 `.catch(() => null)` → Avatar 1, Seite rendert. Kein Schreiben beim Lesen (Test :34-46 prüft SQL ohne insert/update/Namen). Mutanten n, n2, n3 rot. (Stabilität: F9.)

**V5 ✓ mit F4 Daily Challenge.** 10 Wörter: daily-challenge.ts:3-31: Seed aus FNV(Tag|Jahrgang), LCG-Fisher-Yates über nach id sortierte, nach Kopfwort deduplizierte Wörter des Jahrgangs (`g<grade>u…`); kein Math.random; Tag = `viennaDateKey` (wort-des-tages.ts:4-6, Europe/Vienna). Test: daily-challenge.test.ts:13-33 (je Jahrgang 10 eindeutige, Umkehr/Verdopplung des Korpus gleich, Folgetag anders; Wiener Mitternacht 22:00Z Okt → nächster Tag, 22:30Z Jan → gleicher Tag). Zähler: service:80-87 – eigene Klasse + eigenes Konto + Jahrgang + `mode='daily'` + `kind='vocab'` + itemId im Tagessatz + Wiener Tag, `count(distinct)`, Deckel 10; Anzeige home/page.tsx:40 nur hinter `acting`. Mutanten e, e2, f, g, g2, g3, w, x rot. Abweichung: Satz ist nicht in jedem Fall »gleich für alle Kinder des Jahrgangs« (F4). Der Test nennt 23:30 UTC nicht wörtlich (F9), prüft aber die Gegenseiten 22:00Z/22:30Z.

**V6 ✓ mit F3/F5 Keine toten Kacheln.** Alle href-Ziele der neuen Dateien existieren als Route: /home, /modi, /profil, /fortschritt, /woerterbuch, /review, /practice, /datenschutz, /signin, /play/<grade> (`(game)/play/[grade]/page.tsx`). Wächter play-access-map.test.ts:550-566 prüft home/page.tsx, PlayerCard.tsx, ModePicker.tsx auf Dateiexistenz und verbietet Namen (Zeile 556). Nicht vorhandene Modi (Flashcards-Modus, Memory Match, Spelling Bee, Word Hunt, Speed, Activity Game, Battle Arena, Bestenliste) sind nicht verlinkt. Aber: Beschriftung »Dictionary & Flashcards« (home/page.tsx:33) – F3. Mutanten h, h2, h3, k, k2, z5 rot (h nur durch den alten cgo-086-Wächter, F5).

**V7 ✓ mit F1.** Kein »Unit« in neuen Dateien (grep + Gate check-chapter-copy 117/118 grün; Mutanten s, s2 rot). Keine Motivationsformeln im Bestand (grep über alle Plus-Zeilen leer), aber kein Wächter auf den neuen Seiten (F1). Keine Schülernamen in Code/Test (nur synthetische `test-child`; angezeigt wird nur der eigene Name des Kindes, trainer-data.ts:12). levels.ts im Diff nicht vorhanden (unverändert), public/art nicht im Diff; Mutante z6 (Schwelle) rot, z4 (Kommentar) grün = nur Info. Avatare: genau 50 PNGs `apps/web/public/avatars/01..50.png`, alle A (neu), 128×128 RGBA, zusammen 815.736 Byte, 50 eindeutige Namen (avatar.ts), Test avatar.test.ts:5-14. PNG-Identitäts-Tor: `check-png-identity.mjs --ref origin/main` und `--ref <merge-base>` beide Exit 0 (»0 identisch, 0 neu gemalt, 50 neu«), Selftest 170 Exit 0. Bündelgrenze: `pnpm build` + `pnpm check:bundle` Exit 0.

**V8 ✓ Tore** – siehe Tor-Tabelle: alle genannten und alle übrigen 97 einzeiligen `- run:`-Zeilen (ohne die 5 pnpm-install-Zeilen) Exit 0.

## Funde

**SPERRE:** keine.

**F1 SOLLTE – Motivationsformeln auf den neuen Seiten ungeschützt (V7).** Mutanten m (»Super gemacht! Weiter so!« auf /home) und m2 (»Du schaffst das!« im ModePicker) bleiben in allen Tests und Gates grün. Die einzige Formel-Sperre (play-access-map.test.ts:473) betrifft eine andere Seite. Vorschlag: in `OG W1 surfaces` (play-access-map.test.ts:527) je Seite `assert.doesNotMatch(src, /Super|Weiter so|Gut gemacht|Du schaffst das/)` plus für ModePicker/PlayerCard/TrainerShell.

**F2 SOLLTE – Matcher der Middleware nicht festgenagelt.** Mutant t (middleware.ts:60 ohne »/profil«) grün; für /woerterbuch gibt es einen Pin (play-access-map.test.ts:183-185), für die vier neuen Routen nicht. Folge bei Verlust: ausgeloggte Besucher werden nicht mit `from` zu /signin geschickt, sondern erst von der Seite (`redirect("/signin")`) – kein Datenleck. Vorschlag: einen Regex-Pin für /modi, /profil, /fortschritt.

**F3 SOLLTE – Kachel »Dictionary & Flashcards« verspricht einen Modus, den es nicht gibt (V6).** home/page.tsx:33 (Ziel /woerterbuch, real). Der Wächter-Regex (play-access-map.test.ts:556) kennt »Flashcards« nicht. Vorschlag: Beschriftung »Dictionary« und »Flashcards« in die Verbotsliste aufnehmen.

**F4 SOLLTE – Daily-Satz nicht in jedem Fall gleich für alle Kinder eines Jahrgangs (V5).** `loadPracticeWords` filtert die klassenweise Reserve (listReservedForClass, load-practice.ts:14, :17) heraus, BEVOR `selectDailyChallenge` mischt (daily-challenge.ts:17-30). Ein einziges reserviertes Wort in einer Klasse ändert die ganze Permutation für diese Klasse; die Vorschau (leere Reserve) zeigt einen anderen Satz als ein Kind; auch ein Ausfall des Entwurfs-Overlays (`loadUnitWithOverrides` fällt auf Kanon zurück) kann den Satz verschieben. Gleichzeitig ist die Sperre der Reserve richtig (Prüfungsaufgaben). Vorschlag: Permutation aus dem NICHT gefilterten Jahrgangskorpus ziehen und reservierte Wörter überspringen (nächstes der Permutation) – dann weicht eine Klasse nur an der reservierten Stelle ab; Test: zwei Klassen mit/ohne Reserve teilen ≥ 9 Wörter.

**F5 HINWEIS – Kachel-Wächter schneidet Pfade an der ersten Ziffer ab.** Regex `(\/[a-z][a-z/-]*)` (play-access-map.test.ts:557) macht aus `/play/1/world` nur `/play/`; Unterrouten werden nicht geprüft (Mutant h im PR-Wächter grün, rot nur durch den älteren cgo-086-Wächter, der genau »/play/<n>/world oder /run« nennt; `/play/1/nowhere` würde auch auf einer echten Route [zone] nur zum Hub zurückspringen). Tote Pfade mit Ziffer im Segment (h3) werden dagegen am Präfix erkannt.

**F6 HINWEIS – Merge-Reife: Stand ist hinter main.** origin/main (8c8acd81) hat 0020 (PR 490) und 0021 (PR 498); `git merge-tree` meldet Konflikte in packages/db/drizzle/meta/_journal.json, packages/db/src/schema.ts, scripts/claim-filter-required.json. Snapshot 0022 baut auf 0019 (prevId bc9b7466…); nach der Zusammenführung muss er kumulativ neu erzeugt und `drizzle-kit generate` erneut »No schema changes« melden. Das Neon-Blatt (docs/cgo-108_NEON_BLATT_0022.md) sagt genau das; Aufgabe des GG, nicht Fehler des PR.

**F7 HINWEIS – Reihenfolge Migration vor Deploy erzwungen durch den Löschweg.** konto-loeschung.ts:77 löscht student_profile ZUERST; fehlt die Tabelle (Deploy vor Migration), wirft `weg()` und die gesamte Konto-Löschung bricht (500, konto wiederholt) – auch practice_attempts bleiben bis dahin stehen. Das Neon-Blatt nennt »Migration vor Auslieferung«; der Kommentar im `weg()` (:65-68) behauptet das Gegenteil, der Code wirft. Für die GG-Kette: Migration 0022 zuerst, dann Merge-Deploy.

**F8 HINWEIS – Ersatz-Avatar ungespeicherter Kinder ist nicht stabil.** assignAvailableAvatars (service:25-34): wählt ein Kind weiter vorn in der Klassenreihenfolge eine Nummer, verschiebt sich die angezeigte Nummer nachfolgender Kinder ohne eigene Wahl. Bewusste Folge von »kein Schreiben beim Lesen« (Neon-Blatt); für das Kind aber sichtbar.

**F9 HINWEIS – Tageswechsel-Test und Mischer.** daily-challenge.test.ts:26-29 prüft 22:00:00Z (Okt, Mitternacht Wien) und 22:30Z (Jan); die im Vertrag genannte Lage 23:30Z und eine Sekunde vor der Grenze fehlen (Mutant e2 wird trotzdem rot). Der LCG zieht `state % (i+1)` aus den niedrigen Bits (daily-challenge.ts:27) – für 10 Wörter aus ~200 unkritisch.

**F10 HINWEIS – STATUS-Eigenaussage.** docs/STATUS_AND_ROADMAP.md:14-16 nennt »visuelle Abnahme nicht bestanden« neben »0/8 Urteile unsicher«; die Zahl »28/28 absichtliche Fehlerproben« ist von mir UNVERIFIZIERT (»97/97 CI-Einzeiler« habe ich bestätigt). Entscheid über die visuelle Abnahme liegt beim GG.

**F11 HINWEIS – Kopfleiste im Kinder-Layout klein.** globals.css:1023 `.le-kopf button { padding:2px 6px; font-size:11px; min-height:0 }` unter `.og-root` – Tap-Ziel deutlich unter 44 px (Telefon). Nicht Teil des Vertrags; nur gelesen, nicht gerendert.

## Mutanten-Tabelle (45; je `git checkout -- <datei>`, md5 gleich)
Testlauf je Mutante: `pnpm --filter web test` + `pnpm --filter @domigo/db test` + 15 Gates (claim-filter, chapter-copy, copy-register, png-identity, journal-door, roster-twins, datenschutz-claims, registers, no-local-login, level-design, design-sheets, ci-gates, fonts, umbrella-tokens, secrets).

| id | Vertragsmutant | Änderung | Ergebnis | md5 gleich |
|---|---|---|---|---|
| a1 | a | Vorschau-Rückgabe in readTrainerProfile entfernt (liest Kinderstand) | ROT (web) | ✓ |
| a2 | a | Fortschritt: Kinderstand nicht mehr hinter acting | ROT (web) | ✓ |
| a3 | a | Modi: Due-Counts nicht mehr hinter acting | ROT (web) | ✓ |
| a4 | a | Home: Daily-Zähler nicht mehr hinter acting | ROT (web) | ✓ |
| b1 | b | Avatar-Schreiben ohne Scope-Wand (inArray classScope aus der WHERE-Klausel) | ROT (db) | ✓ |
| b2 | b | Avatar-Route nimmt classId aus dem Body | ROT (web) | ✓ |
| b3 | b | assertWritableScope entfernt | ROT (check-claim-filter) | ✓ |
| c | c | Avatar-Wert 51 akzeptiert | ROT (web, db) | ✓ |
| d1 | d | Avatar-POST: getActingUser lässt Lehrkraft zu | ROT (web) | ✓ |
| d2 | d | Avatar-Schreiben ohne Rollen-Wand role=student | ROT (db) | ✓ |
| e | e | Daily-Seed aus Math.random | ROT (web) | ✓ |
| e2 | (e) | viennaDateKey in UTC statt Europe/Vienna | ROT (web) | ✓ |
| f | f | Daily-Zähler ohne userId-Filter (zählt fremde Kinder) | ROT (db) | ✓ |
| g | g | Daily-Zähler ohne mode-daily-Filter | ROT (db) | ✓ |
| g2 | (g) | Daily-Zähler zählt Wörter außerhalb des Tagessatzes (itemId-Filter weg) | ROT (db) | ✓ |
| g3 | (g) | Daily-Zähler ohne Wiener Tag (AT TIME ZONE entfernt) | ROT (db) | ✓ |
| h | h | Tote Kachel /play/1/world auf /home | ROT (web) | ✓ |
| h2 | h | Tote Kachel /spiele/lesen (Route existiert nicht) auf /home | ROT (web) | ✓ |
| h3 | h | Tote Kachel /spiele2/lesen (Ziffer im Pfad) auf /home | ROT (web) | ✓ |
| i | i | Löschweg-Zeile student_profile in konto-loeschung entfernt | ROT (db) | ✓ |
| j | j | Register-Eintrag student_profile in datenschutz-spalten entfernt | ROT (web) | ✓ |
| k | k | Modus-Kachel »Memory Match« (Name) in ModePicker | ROT (web) | ✓ |
| k2 | k | Modus-Kachel »Memory« mit Link /memory-match (Route fehlt, Name nicht gesperrt) | ROT (web) | ✓ |
| l | l | STATUS-Doku mit »CODEX DRAFT« | ROT (web) | ✓ |
| m | m | Motivationsformel auf /home | **GRÜN – FUND** | ✓ |
| m2 | m | Motivationsformel »Du schaffst das« auf /modi (ModePicker) | **GRÜN – FUND** | ✓ |
| n | (V4) | missingProfileTable ohne cause-Rekursion | ROT (db) | ✓ |
| n2 | (V4) | Lesefehler (nicht nur fehlende Tabelle) wird verschluckt NICHT: Rückfall bei jedem Fehler | ROT (db) | ✓ |
| n3 | (V4) | Rückfall ohne Tabelle: Fehler immer weitergeworfen (Seite würde brechen) | ROT (db) | ✓ |
| o | (V2) | Avatar-Route ohne Origin-Prüfung | ROT (web) | ✓ |
| p | (V1) | AvatarPicker: Vorschau-Zweig entfernt (POST auch in der Vorschau) | ROT (web) | ✓ |
| q | (V2) | PracticeSession sendet mode practice statt daily | ROT (web) | ✓ |
| s | (V7) | Modi: »Unit« statt »Chapter« | ROT (check-chapter-copy) | ✓ |
| s2 | (V7) | Fortschritt: »Unit« statt »Chapter« | ROT (check-chapter-copy) | ✓ |
| t | (V1/V6) | Middleware-Matcher ohne /profil | **GRÜN – FUND** | ✓ |
| v | (V1) | trainerGrade: Kind mit unbekanntem Jahrgang fällt auf 1 | ROT (web) | ✓ |
| w | (V5) | Daily: Wort-Dedupe entfernt | ROT (web) | ✓ |
| x | (V5) | Daily: Jahrgangsfilter (startsWith g<grade>u) entfernt | ROT (web) | ✓ |
| y | (V1) | getStudentAvatar: Roster ohne Klassenfilter | ROT (db) | ✓ |
| z | (V3) | Journal-Eintrag 0022 entfernt (idx 22 → 21) | ROT (db) | ✓ |
| z2 | (V3) | Migration 0022 mit DROP TABLE ergänzt | ROT (db) | ✓ |
| z3 | (V7) | Avatar-Katalog auf 49 Namen (letzter entfernt) | ROT (web) | ✓ |
| z4 | (V7) | levels.ts verändert (Design-Bytes) | **GRÜN – FUND** | ✓ |
| z5 | (V6) | Home: Link auf nicht freigegebenen Modus Speed Round (Name) | ROT (web) | ✓ |
| z6 | (V7) | levels.ts: LEVEL_XP-Schwelle 50 → 51 (semantisch) | ROT (web) | ✓ |

## Tor-Tabelle (alle einzeiligen `- run:`-Zeilen aus ci.yml ohne pnpm install = 97; Zeile = Zeilennummer in ci.yml)
Zusätzlich: `pnpm --filter web test` Exit 0 (912/912), `pnpm --filter @domigo/db test` Exit 0 (599 bestanden, 1 übersprungen), `drizzle-kit generate` Exit 0 »No schema changes«, `check-png-identity.mjs --ref origin/main` Exit 0, `--ref <merge-base>` Exit 0. STATUS-Wächter = apps/web/lib/status-doc.test.ts (in web-Suite, Mutant l rot). Migrations-Tor = Journal/Snapshot-Test student-profile-service.test.ts:110-121 + check-journal-door (ci.yml-Zeile 129/130).

| ci.yml-Zeile | Exit | Befehl |
|---|---|---|
| 26 | 0 | `pnpm typecheck` |
| 38 | 0 | `pnpm lint` |
| 50 | 0 | `node scripts/check-vercel-ignore-build.mjs --selftest` |
| 51 | 0 | `node scripts/check-vercel-ignore-build.mjs` |
| 52 | 0 | `node --test scripts/gg-gate-policy/register.test.mjs` |
| 53 | 0 | `pnpm test` |
| 65 | 0 | `pnpm content validate` |
| 66 | 0 | `pnpm content validate-story` |
| 72 | 0 | `pnpm content validate-listening` |
| 73 | 0 | `pnpm content validate-test` |
| 104 | 0 | `node --experimental-strip-types scripts/check-story-grounding.mjs --selftest` |
| 105 | 0 | `node --experimental-strip-types scripts/check-story-grounding.mjs` |
| 106 | 0 | `node --experimental-strip-types scripts/check-g3-economy.mjs --selftest` |
| 107 | 0 | `node --experimental-strip-types scripts/check-g3-economy.mjs` |
| 108 | 0 | `node --experimental-strip-types scripts/check-g3-comments.mjs --selftest` |
| 109 | 0 | `node --experimental-strip-types scripts/check-g3-comments.mjs` |
| 110 | 0 | `node scripts/check-g3-spoiler.mjs --selftest` |
| 111 | 0 | `node scripts/check-g3-spoiler.mjs` |
| 112 | 0 | `node scripts/story/apply-g3-feedback.mjs --check` |
| 113 | 0 | `node --experimental-strip-types scripts/check-paint-copy.mjs --selftest` |
| 114 | 0 | `node --experimental-strip-types scripts/check-paint-copy.mjs` |
| 115 | 0 | `node scripts/check-copy-register.mjs --selftest` |
| 116 | 0 | `node scripts/check-copy-register.mjs` |
| 117 | 0 | `node scripts/check-chapter-copy.mjs --selftest` |
| 118 | 0 | `node scripts/check-chapter-copy.mjs` |
| 119 | 0 | `node scripts/check-design-sheets.mjs --selftest` |
| 120 | 0 | `node scripts/check-design-sheets.mjs` |
| 121 | 0 | `node --experimental-strip-types scripts/check-game-tasks.mjs --selftest` |
| 122 | 0 | `node --experimental-strip-types scripts/check-game-tasks.mjs` |
| 123 | 0 | `node scripts/check-level-design.mjs --selftest` |
| 124 | 0 | `node scripts/check-level-design.mjs` |
| 125 | 0 | `node scripts/check-registers.mjs --selftest` |
| 126 | 0 | `node scripts/check-registers.mjs` |
| 127 | 0 | `node scripts/check-roster-twins.mjs --selftest` |
| 128 | 0 | `node scripts/check-roster-twins.mjs` |
| 129 | 0 | `node scripts/check-journal-door.mjs --selftest` |
| 130 | 0 | `node scripts/check-journal-door.mjs` |
| 131 | 0 | `node scripts/check-claim-filter.mjs --selftest` |
| 132 | 0 | `node scripts/check-claim-filter.mjs` |
| 133 | 0 | `node scripts/import-checkup-journal.mjs --selftest` |
| 134 | 0 | `node scripts/import-checkup-journal.mjs --out "$(mktemp -d)"` |
| 135 | 0 | `node scripts/check-no-local-login.mjs --selftest` |
| 136 | 0 | `node scripts/check-no-local-login.mjs` |
| 139 | 0 | `node --experimental-strip-types scripts/check-paint-art.mjs --selftest` |
| 140 | 0 | `node --experimental-strip-types scripts/check-paint-art.mjs` |
| 141 | 0 | `node scripts/check-story-art.mjs --selftest` |
| 142 | 0 | `node scripts/check-story-art.mjs` |
| 143 | 0 | `node scripts/check-g4-version-a.mjs --selftest` |
| 144 | 0 | `node scripts/check-g4-version-a.mjs` |
| 145 | 0 | `node scripts/check-composition.mjs --selftest` |
| 146 | 0 | `node scripts/check-composition.mjs` |
| 147 | 0 | `node --experimental-strip-types scripts/check-png-seams.mjs --selftest` |
| 148 | 0 | `node --experimental-strip-types scripts/check-png-seams.mjs` |
| 149 | 0 | `node --experimental-strip-types scripts/check-body-silhouette.mjs --selftest` |
| 150 | 0 | `node --experimental-strip-types scripts/check-body-silhouette.mjs` |
| 151 | 0 | `node --experimental-strip-types scripts/make-body-stencils.mjs --selftest` |
| 152 | 0 | `node --experimental-strip-types scripts/retire-phase-art.mjs --selftest` |
| 153 | 0 | `node --experimental-strip-types scripts/check-ground-plane.mjs --selftest` |
| 154 | 0 | `node --experimental-strip-types scripts/check-ground-plane.mjs` |
| 155 | 0 | `node scripts/check-colour-truth.mjs --selftest` |
| 156 | 0 | `node scripts/check-colour-truth.mjs` |
| 157 | 0 | `node scripts/check-sheet-colours.mjs --selftest` |
| 158 | 0 | `node scripts/check-sheet-colours.mjs` |
| 165 | 0 | `node docs/art/import-batch-aq12.mjs --selftest` |
| 166 | 0 | `node docs/art/import-batch-aq13.mjs --selftest` |
| 167 | 0 | `node docs/art/import-batch-aq15.mjs --selftest` |
| 168 | 0 | `node docs/art/import-batch-aq17.mjs --selftest` |
| 169 | 0 | `node docs/art/import-ch01-buecherwelt.mjs --selftest` |
| 170 | 0 | `node scripts/check-png-identity.mjs --selftest` |
| 183 | 0 | `node --experimental-strip-types scripts/check-perf-budget.mjs --selftest` |
| 184 | 0 | `node --experimental-strip-types scripts/check-perf-budget.mjs` |
| 185 | 0 | `node scripts/check-fonts.mjs --selftest` |
| 186 | 0 | `node scripts/check-fonts.mjs` |
| 187 | 0 | `node scripts/check-umbrella-tokens.mjs --selftest` |
| 188 | 0 | `node scripts/check-umbrella-tokens.mjs` |
| 189 | 0 | `node scripts/check-secrets.mjs --selftest` |
| 190 | 0 | `node scripts/check-secrets.mjs` |
| 191 | 0 | `node scripts/check-datenschutz-claims.mjs --selftest` |
| 192 | 0 | `node scripts/check-datenschutz-claims.mjs` |
| 232 | 0 | `node scripts/check-audio.mjs --selftest` |
| 233 | 0 | `node scripts/check-audio.mjs` |
| 253 | 0 | `node scripts/measure-presence.mjs --selftest` |
| 254 | 0 | `node scripts/measure-motion.mjs --selftest` |
| 255 | 0 | `node scripts/measure-veil.mjs --selftest` |
| 256 | 0 | `node scripts/measure-residue.mjs --selftest` |
| 258 | 0 | `node scripts/frame-sink.mjs --selftest` |
| 259 | 0 | `node scripts/shoot-world.mjs --selftest` |
| 260 | 0 | `node scripts/shoot-card-bench.mjs --selftest` |
| 262 | 0 | `node scripts/perf-visible.mjs --selftest` |
| 263 | 0 | `node scripts/chrome-hygiene.mjs --selftest` |
| 265 | 0 | `node scripts/art-recompress.mjs --selftest` |
| 266 | 0 | `node scripts/set-plane-value.mjs --selftest` |
| 269 | 0 | `node scripts/check-ci-gates.mjs --selftest` |
| 270 | 0 | `node scripts/check-ci-gates.mjs` |
| 285 | 0 | `node scripts/check-perf-table.mjs --selftest` |
| 313 | 0 | `pnpm build` |
| 314 | 0 | `pnpm check:bundle` |

## Schluss
FREIGABE für GG-Review: ja — Beleg: 0 SPERRE; alle 97 CI-Einzeiler + web 912/912 + db 599 grün auf Kopf 47a0f54d; `drizzle-kit generate` »No schema changes«; 41 von 45 Mutanten rot, die drei Fund-Mutanten (m, m2, t) sind SOLLTE-Lücken im Wächter, kein Fehler im Verhalten; vor dem Merge: F6 (Rebase auf main mit 0020/0021, Snapshot neu) und F7 (Migration 0022 vor Deploy) beachten.

— PRUEFER-507 (blinder Leser, Sonnet 5.5)
