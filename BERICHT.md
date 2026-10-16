# Blinde Prüfung domigo-v2 PR 484 (cgo-062, Kopf 40a7bdbb) — Ergebnis: 0 SPERRE · 5 SOLLTE · 7 HINWEIS

Prüfer blind: nur Diff, PR-Text, Karte, Code. Arbeitsbaum `/Users/veho/Code/_gg/domigo-484-leser` (Kopf 40a7bdbb, Basis b811995b). Logs: `/Users/veho/Code/_gg/domigo-484-leser-logs/`.

## Gelesen / Gelaufen

Gelesen ganz: diff.patch (1307 Zeilen), pr.md, karte.md, `lib/attempt-outbox.ts`, `lib/useOutboxFlush.ts`, `lib/preview-attempt.ts`, `app/api/attempts/route.ts`, `lib/identity.ts`, `lib/student-view.ts` (Auszug), die Tests `attempt-outbox`, `useOutboxFlush`, `attempts-route`, `play-access-map`, `preview-attempt`, Aufrufer PracticeSession, NovelClient, GameClient, ReviewSession, TestSession, ListeningSession, PathPracticeNode und die Seiten `[zone]/page.tsx`, `practice/[slug]/page.tsx`, `learn/.../page.tsx`, `listening|tests|review/.../page.tsx`.

## Messungen (alle aus eigenen Läufen)

| Tor | Exit | Ergebnis |
|---|---:|---|
| gezielte 5 Testdateien (Befehl aus PR-Text) | 0 | 75/75 grün, 0 fail, 0 cancelled |
| `node scripts/check-claim-filter.mjs` | 0 | OK, 42 Funktionen, 0 Bestand ohne Ausschnitt |
| `node scripts/check-no-local-login.mjs` | 0 | OK |
| `node scripts/check-datenschutz-claims.mjs` | 0 | OK, 790 Dateien |
| `pnpm --filter web lint` | 0 | 0 Fehler, 5 Warnungen (alle in unberührten Dateien, z. B. regelbuch.ts) |
| `node scripts/check-perf-table.mjs` (PR-Text als PR_BODY, 28 Dateien) | 1 | bestätigt die offene Frage aus dem PR: pfadbedingt (`app/(game)`), keine Phasentabelle; Entscheid beim GG |
| `git diff --name-only b811995b..HEAD` | — | genau 28 Dateien = Liste der Karte; `packages/`, `middleware.ts`, `auth.ts`, `identity.ts`, `scripts/`, `.github/`: 0 Änderungen |
| Echt-IndexedDB-Lauf (Browser, siehe c) | — | 7 Szenarien, Ergebnis unten |

Nicht gefahren (laut Auftrag): build, voller Test, typecheck.

## Suchpunkte a–i

**a) Wand am Server — dicht.** `route.ts:73`: `parsed.data.ownerId !== acting.userId`; `acting` kommt aus `getActingUser(req)` (Zeile 63) = NextAuth-Sitzung (`identity.ts:77-79`), nicht aus dem Request. Der Client kann nur seine eigene Kennung behaupten (= die der Sitzung, also kein Gewinn) oder eine fremde (→ 409). Weglassen: `optional()` im Schema, danach `undefined !== userId` → 409 (Test „ownerless legacy", Mutant M1b rot). Leer `""`: `min(1)` → 400 bad_request, nicht 409, in jedem Fall keine Buchung (der Routentest sendet `ownerId: undefined`, da `"" || undefined`; der Fall `""` selbst ist nicht getestet — HINWEIS). Lehrkraft: `getActingUser` verlangt `classId`, Lehrkraft hat keins → 401 schon in Zeile 64, vor dem Vergleich; es gibt kein Vorschau-Flag im Server, das den Vergleich lockern könnte. Dev-Fallback (Header `x-dev-user-id`) nur außerhalb Produktion. Reihenfolge: Identität (63) → Schema (67) → **Besitzer (73)** → Inhalt laden/Bewerten (79–161) → `recordAttempt` (173). Der Test nutzt absichtlich ein nicht existierendes Item (sonst käme 400), d. h. er beweist „vor Inhalt/Bewertung/Buchung"; Mutanten M2b/M2c bestätigen.

**b) Verlust — dicht, mit Auflagen.** Alle Löschstellen: (1) `dequeue` in `sendAttempt` (`attempt-outbox.ts:~170`), nur wenn `confirmed(res,data)` = `res.ok === true && data.ok === true`; (2) `dequeue` in `flushOutbox` (~Zeile 190), gleiche Bedingung. Sonst gibt es keine `delete`/`clear`-Stelle (grep). Es gibt kein `clear()`, also auch kein Löschen fremder Einträge; der Schlüssel enthält den Besitzer (`JSON.stringify([ownerId, id])`) und `flushOutbox` überspringt Einträge anderer Besitzer. 401/403/409/Netz/ok:false/unlesbar: Eintrag bleibt (Tests je Status 401, 403, 409, 400, 429, 500; Mutanten M3, M3b, M3c rot). Bei 401/403/409/Netzfehler bricht der Lauf ab, bei 400/429/5xx geht er zum nächsten Eintrag weiter. Folge siehe SOLLTE-5.

**c) Migration v1 → v2 — funktioniert, aber nicht im Repo bewiesen; Altbestand dauerhaft eingefroren.** Echt-IndexedDB-Lauf (Chrome im Browserbereich, die echte `attempt-outbox.ts` per `transpileModule`, daneben die echte alte Fassung von b811995b):
- T1–T3: v1-Altzeile angelegt, neue Seite öffnet → DB-Version 2, Altzeile **byte-identisch**, neue Zeile daneben (Schlüssel `["A","2222…"]`); Flush von A sendet **nur** die A-Zeile (`ownerId:A`), Altzeile bleibt; zweiter Flush sendet nichts (Altzeile wird **nie** gesendet).
- T4: alte Seite öffnet danach v1 → `VersionError`.
- T5: alte Seite offline → `{ok:false, queued:false}` (Antwort nicht vorgemerkt); T5b alte Seite online gegen neuen Server → 409 → `{ok:false, queued:false}` (nicht gebucht, nicht vorgemerkt).
- T6: **DB noch v1 mit Altzeile, alte Seite (ohne neue Seite geöffnet) flusht gegen 409 → Altzeile GELÖSCHT** („rows left 0"). Die v2-Sperre schützt nur, wenn vorher eine neue Seite die DB auf v2 gehoben hat.
- T7: alte Verbindung bleibt offen (ohne `onversionchange`): neues `sendAttempt` hängt („PENDING after 2s"), läuft nach Schließen der alten Verbindung durch. Kein `onblocked`-Handler, aber nicht dauerhaft blockiert, weil alter Code seine Verbindung nach jeder Transaktion schließt.
- Im Repo ist nichts davon abgesichert: die Fake-IDB ignoriert die Version (Mutanten M9 und M9b grün).

**d) Doppelbuchung — Server hält, Client verlässt sich darauf.** Idempotenz ist serverseitig: Unique-Index `(user_id, client_attempt_id)` (`schema.ts:65`) + `onConflictDoNothing` (`persist.ts:67`), Antwort `duplicate:true`. Client: gleiche UUID bei Wiederholung (Mutant M8 rot), erste Nutzlast unveränderlich (`add` statt `put`, Test „snapshot… retries keep first payload"), zwei parallele Flushes werden pro Bindung zu einem Lauf zusammengefasst (Mutant M10 rot). Der Test „lost receipt" modelliert die Gegenstelle mit einer Menge `ownerId/clientAttemptId`, das ist ein Spiegel der Server-Eindeutigkeit, kein Servertest; der echte Index ist unverändert (kein Diff in `packages/db`). Randfall siehe HINWEIS-4.

**e) Kontowechsel — dicht.** A offline → B angemeldet: B-Bindung ⇒ `flushOutbox("B")` filtert auf `ownerId === B`; A-Zeilen werden nie gesendet; gesendet wird stets mit dem im Eintrag gespeicherten Besitzer. Nachzügler-Antwort von A: `isCurrent()` falsch ⇒ `{ok:false, queued:false}`, die Seite von B bekommt keine Belohnung/Serie (Mutant M5d rot). A → Lehrkraft → A: Vorschau sendet nichts — erzwungen im **Client** (`attemptSender(true…)` stumm, Hook bindet `null`, kein Listener) und im **Server** (Lehrkraft 401); beides getestet (Mutant M7 rot, M5f rot). Fremdes Fenster: Tab von A bleibt offen, B meldet sich im anderen Tab an → A-Tab sendet mit Besitzer A, Server sieht B → 409, Antwort bleibt vorgemerkt (kein Verlust, keine Fremdbuchung).

**f) UI/Kind.** Die meisten Flächen zeigen sofort ihre eigene Rückmeldung (PracticeSession etc. rechnen XP lokal, `streak` kommt nur bei Bestätigung). Sichtbar ändert sich nur `NovelGame`: bei `queued:true` steht „Saved on this device. Points follow when you are online. (= Hier gespeichert. Punkte folgen, sobald du online bist.)" (`packages/game-novel/src/NovelGame.tsx:88`, unverändert, zweisprachig, kein Meta/Werbesprache). Neu ist, dass jetzt auch 400/401/403/409 `queued:true` ergeben, also dieselbe Meldung erscheint, obwohl der Grund ein falsches Konto oder eine dauerhaft unbuchbare Antwort ist (SOLLTE-5). Reload: vorgemerkte Zeilen bleiben, werden beim Mount des richtigen Kindes nachgesendet; Altzeilen nie.

**g) Zaun — eingehalten.** Siehe Messungen. 19 Aufrufer geändert (11 Clients + 8 Seiten), kein Bewerter, keine Punktelogik, keine Auth/Middleware/DB-Änderung.

**h) Tests — überwiegend Verhaltenstests, mit drei Schwächen.** Outbox-Tests laufen die echte Outbox-Logik gegen eine Fake-IDB (nur `add/get/getAll/delete`, Schreiben erst bei Transaktionsende, `abort` modelliert). Routentests nutzen die echte Route + echte Identität + echten Inhalt/Bewerter (Sitzung und Speicher ersetzt). Schwächen: (1) Fake-IDB kennt keine Versionen/`put` (Migration ungeprüft, M8b ungültig, weil `put` fehlt); (2) die Aufrufer-Tests sind Quelltext-Muster (Regex/AST), keine Verhaltenstests, fangen aber alle 10 Aufrufer-Mutanten; (3) kein Test fährt Client-Outbox gegen die echte Route; die Fake-Antworten für 401/403/409 sind `Response.json({ok:true},{status})`, absichtlich irreführend, nicht der echte Körper `{ok:false,error:"wrong_owner"}`.

**i)** Siehe Funde.

## Mutanten (alle mit `git checkout -- <datei>` zurückgenommen; Protokolle `mut-*.log`)

Prüfung = die 5 gezielten Testdateien, Basis 75/75.

| Nr | Datei | Änderung | Ergebnis | Rot geworden | Bewertung |
|---|---|---|---|---|---|
| M1 | `route.ts` | Vergleich entfernt (`if (false)`) | ROT 3 | „direct A payload cannot book as B", „refuses foreign/ownerless" | ok |
| M1b | `route.ts` | nur vergleichen, wenn Besitzer vorhanden (Altbestand toleriert) | ROT 1 | „refuses ownerless legacy" | ok |
| M2a | `route.ts` | Vergleich ganz gestrichen | ROT 3 | wie M1 | ok |
| M2b | `route.ts` | Vergleich nach Bewertung, vor Buchung | ROT 2 | „refuses … before content lookup, grading" | ok |
| M2c | `route.ts` | Vergleich nach `recordAttempt` | ROT 3 | zusätzlich „cannot book as B" | ok |
| M3 | `attempt-outbox.ts` | Flush löscht bei 409 | ROT 1 | „HTTP 409 preserves unconfirmed rows" | ok |
| M3b | `attempt-outbox.ts` | Flush löscht bei 401/403/409 | ROT 3 | je Status | ok |
| M3c | `attempt-outbox.ts` | jeder 4xx gilt als bestätigt | ROT 6 | 400/401/403/409/429/500 | ok |
| M4 | `attempt-outbox.ts` | Flush sendet alle Besitzer | ROT 4 | A/B, gleiche UUID, Nachzügler, Wechsel | ok |
| M4b | `attempt-outbox.ts` | nur Schlüssel-Gleichheitsprüfung entfernt | **GRÜN** | — | HINWEIS-1 |
| M5 | `attempt-outbox.ts` | laufender Flush prüft Wechsel nicht mehr | ROT 2 | „switch during delayed flush", „unmount and remount" | ok |
| M5b | `useOutboxFlush.ts` | Aufräumen gibt Bindung nicht frei | **GRÜN** | — | SOLLTE-3 |
| M5c | `attempt-outbox.ts` | `sendAttempt` prüft vor POST nicht auf aktuelle Bindung | ROT 1 | „late answer callback…" | ok |
| M5d | `attempt-outbox.ts` | Nachzügler-Beleg prüft nicht auf Wechsel | ROT 1 | „late direct receipt…" | ok |
| M5e | `useOutboxFlush.ts` | Effekt ohne `[enabled, ownerId]` | ROT 2 | Hook-Quelltest | ok (Regex) |
| M5f | `useOutboxFlush.ts` | Vorschau-Schalter ignoriert | ROT 2 | „disabled…", „A / teacher / A" | ok |
| M6a | `PracticeSession.tsx` | `attemptSender(preview, null)` | ROT 1 | „PracticeSession: attempts and the outbox" | ok (Quelltext) |
| M6b | `PracticeSession.tsx` | `useOutboxFlush(!preview, null)` | ROT 1 | dito | ok |
| M6c | `NovelClient.tsx` | `attemptSender(preview, null)` | ROT 1 | „client guards" | ok |
| M6d | `ReviewSession.tsx` | `sendAttempt(…, null)` | ROT 1 | „…carry the same owner" | ok |
| M6e | `practice/[slug]/page.tsx` | Schlüssel `key=` entfernt | ROT 1 | „answer owners travel…" | ok |
| M6f | `listening/[slug]/page.tsx` | Besitzer `undefined` | ROT 1 | dito | ok |
| M6g | `GameClient.tsx` | Besitzer `undefined` | ROT 1 | „client guards" | ok |
| M6h | `WorldClient.tsx` | `useOutboxFlush(!preview, null)` | ROT 1 | dito | ok |
| M6i | `NovelClient.tsx` | `flushOutbox(null)` im Sichtbarkeits-Handler | ROT 1 | dito | ok |
| M6j | `TestSession.tsx` | `sendAttempt(…, "x")` | ROT 1 | „…carry the same owner" | ok |
| M7 | `preview-attempt.ts` | Vorschau sendet doch | ROT 2 | „calls no endpoint", „A / teacher / A" | ok |
| M8 | `attempt-outbox.ts` | frische UUID je POST (Idempotenz-Schlüssel weg) | ROT 2 | „lost receipt…", „A offline/B online" | ok |
| M8b | `attempt-outbox.ts` | `add` → `put` | ROT 16 (ungültig) | Fake-IDB kennt kein `put` | nicht aussagekräftig, siehe HINWEIS-5 |
| M8c | `attempt-outbox.ts` | Schlüssel ohne Besitzer | ROT 2 | „identical attempt UUIDs…", „ownerless legacy…" | ok |
| M9 | `attempt-outbox.ts` | `DB_VERSION = 1` | **GRÜN** | — | SOLLTE-2 |
| M9b | `attempt-outbox.ts` | `onversionchange`-Schließen entfernt | **GRÜN** | — | SOLLTE-2 |
| M10 | `attempt-outbox.ts` | parallele Flushes nicht zusammengefasst | ROT 1 | „A / teacher / A" | ok (indirekt) |

33 Mutanten: 28 rot, 4 grün (M4b, M5b, M9, M9b), 1 ungültig (M8b). Pflichtmutanten M1–M9 des Auftrags: M1, M2, M3, M4, M5, M6, M7, M8 rot, M9 grün. Aufrufer-Mutanten: 10, alle rot (nur durch Quelltext-Muster).

## Funde

### SOLLTE

**SOLLTE-1 · Verlust im Deploy-Fenster durch alte Seiten (Konfidenz hoch: gemessen).** `route.ts:73` + alter Client. Messung c/T5b: eine vor dem Deploy geladene Seite sendet ohne Besitzer → 409 → Antwort weder gebucht noch vorgemerkt (`queued:false`) — die Seite meldet dem Kind danach „failed", bis es neu lädt. T6: eine alte Seite, die als erste die DB öffnet (noch v1), **löscht beim Flush gegen 409 vorgemerkte Altzeilen** (die v2-Sperre greift erst nach einer neuen Seite). Erwartung: Kein stiller Verlust von Kinderantworten beim Ausrollen. Behebung (eine davon): Skew-Schutz/Neuladen erzwingen und im Merge-Plan festhalten, wann gemergt wird (Unterricht vermeiden); oder Server antwortet besitzerlos mit einem Status, den der alte Client als „vorübergehend" behält (z. B. 503) — das widerspräche aber der Karte (409). UNVERIFIZIERT: ob in diesem Vercel-Projekt Skew Protection aktiv ist (`vercel.json` enthält nichts dazu). Wenn nicht, würde ich es als Sperre werten; die Entscheidung liegt beim GG.

**SOLLTE-2 · Migration nicht im Repo bewiesen; Altbestand dauerhaft eingefroren (hoch: gemessen).** `attempt-outbox.ts:53` (`DB_VERSION`), `:76` (`onversionchange`). Mutanten M9, M9b grün; die Fake-IDB kennt keine Version. Der PR belegt sie nur durch einen Browserlauf außerhalb des Repos (`~/Code/_codex/cgo-062-evidence/`). Außerdem (T3b): Altzeilen werden **nie** gesendet, es gibt keinen Weg, sie dem richtigen Kind zuzuordnen — „erhalten", aber faktisch abgeschrieben. Behebung: einen Test mit Versionsmodell in die Fake-IDB (oder einen kleinen Browser-/Node-Test mit echter IndexedDB) für „v1-Zeile bleibt unverändert, v1-Öffnen schlägt nach v2 fehl"; und eine Folgekarte „Altzeilen einmalig sichten/entsorgen" ins Board schreiben, damit „erhalten" nicht als „zugestellt" gelesen wird.

**SOLLTE-3 · „Unmount widerruft" nicht über den Hook bewiesen (hoch: gemessen).** `useOutboxFlush.ts:~22` (`release()` im Aufräumen). M5b grün: Der Test „unmount and same-owner remount" ruft `bindOutboxOwner` direkt, nicht das Aufräumen des Hooks. Folge im Ernstfall klein (ein neuer Seitenaufbau überschreibt die Bindung; nur ohne Nachfolgeseite bleibt die Bindung hängen und ein Nachzügler darf noch senden, der Server prüft weiter). Behebung: Test, der `startOutboxFlush(...)`-Rückgabe aufruft und danach `flushOutbox(A)` → 0 und `sendAttempt` ohne POST erwartet.

**SOLLTE-4 · Der Online-Pfad hängt jetzt an IndexedDB (mittel: gemessen T7, Code gelesen).** `attempt-outbox.ts` `sendAttempt`: erst `await remember(owned)`, dann POST. Vorher ging der POST zuerst und IndexedDB wurde nur bei Fehlschlag berührt. Bei hängendem/gesperrtem `indexedDB.open` (kein `onblocked`, keine Zeitgrenze) wird eine Online-Antwort nicht gesendet, bis die DB wieder frei ist (T7: blockiert, läuft nach Freigabe durch). Der Lehrer-/Kind-Bildschirm friert nicht ein (Aufrufer `void`), aber Belohnung/Serie kommen verspätet oder nie. Behebung: `remember` mit Zeitgrenze (z. B. 1,5 s → mit `queued:false` weiter zum POST), `onblocked` behandeln.

**SOLLTE-5 · Nie auslaufende Zeilen und irreführende Kindermeldung (mittel: gemessen/gelesen).** `flushOutbox` löscht nur bei Bestätigung; 400 (z. B. entferntes Item), 429, 5xx bleiben für immer und werden bei **jedem** Seitenaufbau und jedem `online` neu gepostet (bei 400/429/5xx läuft die Schleife weiter, 401/403/409 brechen ab). Kein Limit, kein Ablauf, keine Anzeige. Zudem bleiben A-Zeilen auf dem Gerät, wenn A nie zurückkehrt (Kinderantworten ohne Aufbewahrungsfrist auf einem geteilten Gerät — Datenschutzfrage für den GG). Im Kinder-Bild (`NovelGame`, Zeile 88) liest sich jede dieser Zeilen als „Hier gespeichert. Punkte folgen, sobald du online bist", auch bei dauerhaftem 400 oder fremdem Konto. Behebung: Obergrenze/Alter (z. B. 14 Tage, 200 Zeilen) und für 400 eine „dauerhaft abgelehnt"-Kennzeichnung ohne Neu-Post; Meldung für `409` getrennt halten.

### HINWEIS

1. `attempt-outbox.ts` (Flush-Schleife): die Bedingung `entry.clientAttemptId !== storageKey(body)` ist ohne Test (M4b grün); reine Abwehr gegen verfälschte Zeilen, folgenlos.
2. `route.ts:41` / Routentest: Besitzer `""` ergibt 400, nicht 409 — kein Risiko (keine Buchung), aber das PR-Wort „besitzerlos → 409" gilt nur für fehlend. Der Test `""` ruft in Wahrheit „fehlend" auf (`"" || undefined`).
3. Aufrufer-Tests sind Quelltext-Muster. Sie fangen alle 10 Aufrufer-Mutanten (M6a–j), erkennen aber nicht, dass ein anders benannter Wert (z. B. `session.user.classId`) als `ownerId` durchgereicht würde, sofern der Text passt.
4. Randfall (nur gelesen, UNVERIFIZIERT als Lauf): Weil jede Antwort vor dem POST in der Outbox liegt, kann ein parallel laufender Flush dieselbe Zeile sehen und zuerst senden; die direkte Absendung bekommt dann `duplicate:true` und `xpAwarded: 0`. Gebucht wird richtig (einmal), nur die Anzeige des Kindes für diese Antwort wäre 0. Nach einem Seitenwechsel zwischen `remember` und POST bleibt die Zeile bis zum nächsten Auslöser liegen (verzögert, nicht verloren).
5. M8b: `add`→`put` ist mit der Fake-IDB nicht messbar (Fake hat kein `put`); die Unveränderlichkeit der ersten Nutzlast ist nur über den `ConstraintError`-Pfad bewiesen.
6. Kein Test fährt `sendAttempt` gegen die echte Route; die 409-Fake-Antworten tragen `{ok:true}` statt `{ok:false,error:"wrong_owner"}`. Beides getrennt getestet, die Naht zwischen beiden nicht.
7. Formatierung: `app/(game)/play/[grade]/world/page.tsx` — `key=`/`ownerId=` mit 8 statt 6 Leerzeichen eingerückt; `PathPracticeNode.tsx` Signaturzeile mit eingeschobenem `ownerId: string;` (lesbar machen). Außerdem: `check-perf-table.mjs` Exit 1 (pfadbedingt) bleibt offen, GG-Entscheid.

## Nicht geprüft

Produktiv-Login, echte DB-Buchung, build/bundle, typecheck, voller Test, GPU/FPS (laut Auftrag nicht oder UNVERIFIZIERT), echte Mehr-Tab-Läufe mit zwei Konten, Verhalten von Safari/iOS-IndexedDB (nur Chrome), ob Vercel Skew Protection aktiv ist, `@domigo/db`-Tests.

FREIGABE für Merge PR 484: ja — Beleg: 75/75 gezielte Tests, 3 Skripttore und Lint Exit 0, 0 Änderungen außerhalb des Zauns, Serverwand und Löschpfade dicht (28 von 33 Mutanten rot, die 4 grünen sind Beweisnetz-Lücken, kein gemessener Verhaltensfehler); Auflage: SOLLTE-1 (Ausrollfenster, Skew-Schutz) vor dem Merge klären, SOLLTE-2 bis -5 als Nachbesserung oder Folgekarte; `check-perf-table` (Exit 1) ist GG-Entscheid.

— Prüfer PR 484 (blind)
