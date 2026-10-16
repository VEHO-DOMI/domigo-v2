# Blinde Prüfung Runde 2 PR 484 (Kopf ee01927e, Nachbesserung N1–N4) — Ergebnis: 0 SPERRE · 0 SOLLTE · 4 HINWEIS

Geprüft: Diff 40a7bdbb → ee01927e (4 Dateien), Autorenbericht, die geänderten Funktionen im Zusammenhang. Eigene Läufe, Logs unter /Users/veho/Code/_gg/domigo-484-leser-logs/r2/.

## Urteil je Auflage

**N1 — geschlossen.** apps/web/app/api/attempts/route.ts:
- Reihenfolge: Identität (Z. 63, sonst 401) → Body-Schema (Z. 67, sonst 400) → fehlende ownerId = 503 + `Retry-After: 60` + `{ok:false,error:"legacy_client"}` (Z. 73–75) → fremde ownerId = 409 `wrong_owner` (Z. 78–80) → erst danach Inhaltslookup/Bewertung/Buchung (Z. 82 ff., recordAttempt Z. ~178). Beide Ablehnungen liegen also nach getActingUser und vor content/grade/persist. Lehrkraft-Vorschau bleibt 401 vorher (Test "refuses a teacher session" grün).
- Retry-After ist tatsächlich gesetzt (Z. 74) und im Test per `res.headers.get("Retry-After")` geprüft ("60" bzw. null beim 409). `storageCalls === 0` und `writes.length === 0` belegen: kein Lookup, keine Buchung.
- Leerer String: Schema `ownerId: z.string().min(1)` → ein literales "" ergäbe 400 bad_request (vor dem 503). Ein alter Client schickt das Feld gar nicht (es existiert auf main nicht), der neue Client sendet nie "" (`sendAttempt` bricht bei falsy ownerId ab). Kein Risiko. Alter Client (main) wertet Status >= 500 als wiederholbar (isTransient), 503 löscht den Altbestand also nicht.
- Der Testhelfer `attempt()` macht aus "" ein weggelassenes Feld (`ownerId: ownerId || undefined`); der Testname "ownerless legacy" ist damit korrekt, der Fall "" selbst ist aber nicht getestet (HINWEIS 1).

**N2 — geschlossen.** attempt-outbox.ts:53 (DB_VERSION = 2); Test attempt-outbox.test.ts:284. Der Test schreibt die v1-Zeile über das Fake-IDB (open v1 → createObjectStore → add), lässt den Produktionscode (flushOutbox) v2 öffnen und vergleicht `JSON.stringify([...store.rows])` vorher/nachher — also serialisierte Zeichenfolge, nicht Objektidentität. Der Versandzähler bleibt 0, `store.version === 2` belegt, dass wirklich geöffnet/umgestellt wurde. Das Fake-Versionsmodell ist korrekt (open(v1) nach v2 → `VersionError` über onerror; Test erwartet `{name:"VersionError"}`). Danach wird eine eigene v2-Zeile gesendet, die Altzeile nie (`sent` enthält nur `{...body, ownerId: A}`). Mutant DB_VERSION=1 → ROT. Einschränkung: Bytes sind die des Fake-Speichers; die Browser-Prüfung mit nativem IndexedDB (10/10) ist nur Autorenangabe, von mir nicht wiederholt (HINWEIS 2).

**N3 — geschlossen.** Die Freigabe liegt im Produktcode: useOutboxFlush.ts:23 (`return () => { release(); target.removeEventListener(...) }`), vom Hook in Z. 28 unverändert als Effekt-Rückgabe verwendet (`useEffect(() => startOutboxFlush(...), [...])`). flushOutbox prüft pro Zeile `activeBinding !== binding` (attempt-outbox.ts, Schleifenkopf), sodass die laufende Antwort fertig verarbeitet wird (dequeue) und die zweite Zeile erhalten bleibt. Test attempt-outbox.test.ts:318: sends==1, rows.size==1, Rückgabe 1; danach `flushOutbox(A)` = 0 ohne Binding; erst erneutes Mounten sendet die zweite (sends==2, rows 0). Mutant "Freigabe im Cleanup entfernt" → ROT. Mutant "Hook ruft startOutboxFlush ohne den Cleanup zurückzugeben" → ROT (über den Quelltext-Regex-Test useOutboxFlush.test.ts:40, nicht über echtes Rendern — HINWEIS 3).

**N4 — geschlossen.** attempt-outbox.ts:80 `setTimeout(..., 3000)`, Z. 81 `req.onblocked = fail(...)`, Z. 84 späte Upgrade-Transaktion wird abgebrochen, Z. 90 späte Verbindung wird geschlossen (kein Leck), Z. 123 `OutboxOpenError` → `{queued:false}` ohne zweiten 3-s-Versuch. Test (Z. 348, simulierte Uhr): bei 2999 ms kein Versand, bei 3000 ms genau ein Online-Versuch, Ergebnis `{ok:false, queued:false}` (keine falsche Vormerkung), nur 1 open-Aufruf, spätes upgradeneeded → abort 1, spätes success → close 1, keine Transaktion. Blocked-Variante analog sofort. Z. 398: gespeicherte Zeilen bleiben bei blockiertem Drain byte-gleich erhalten und werden nach Entblockung mit unverändertem Inhalt gesendet.
- Frage "Server scheitert nach Timeout, Antwort verloren?": Ja — dann ist `queued:false`, die Antwort liegt nirgends. Das ist die bewusste, ehrliche Folge (kein falsches "gespeichert", der Aufrufer weiß es) und entspricht dem bisherigen Verhalten bei nicht verfügbarem Speicher; kein Rückschritt, aber ein Restrisiko (HINWEIS 4).

## Messungen

| Tor | Exit | Ergebnis |
|---|---:|---|
| gezielte Tests (attempt-outbox, useOutboxFlush, attempts-route, preview-attempt, play-access-map) | 0 | 80/80 pass, 0 fail, 0 skipped (gezielt.log) |
| node scripts/check-claim-filter.mjs | 0 | OK (claim.log) |
| node scripts/check-datenschutz-claims.mjs | 0 | OK (ds.log) |

## Mutanten (je eine Stelle, danach `git checkout -- <datei>`)

| # | Mutant | Prüfung | Ergebnis | Bewertung |
|---|---|---|---|---|
| M1 | route.ts: fehlend → 409 wrong_owner statt 503 | attempts-route.test | ROT (1 fail) | wirksam |
| M2 | route.ts: Retry-After entfernt | attempts-route.test | ROT | wirksam |
| M3 | attempt-outbox.ts: DB_VERSION=1 | attempt-outbox.test | ROT ("v1 upgrade …") | wirksam |
| M4a | Zeitgrenze 3000 → 0 | attempt-outbox.test | ROT ("IDB timeout") | wirksam |
| M4b | Zeitgrenze/Timer entfernt | attempt-outbox.test | ROT | wirksam |
| M4c | Zeitgrenze 3000 → 30000 | attempt-outbox.test | ROT | wirksam (Grenze pinnt den Wert) |
| M5 | onblocked-Handler entfernt | attempt-outbox.test | ROT ("IDB blocked") | wirksam |
| M6 | Unmount-Freigabe (`release()`) im Cleanup entfernt | attempt-outbox + useOutboxFlush | ROT ("hook unmount releases …") | wirksam |
| M6b | Hook gibt Cleanup nicht zurück (`{ startOutboxFlush(...); }`) | useOutboxFlush.test | ROT (Quelltext-Regex) | wirksam, aber nur textuell |
| M7 | 503-Zweig NACH grade, vor recordAttempt verschoben | attempts-route.test | ROT | wirksam (Reihenfolge gepinnt) |
| M8 | 409-Vergleich abgeschaltet | attempts-route.test | ROT (2 fail) | wirksam |
| M9 | späte Verbindung nicht schließen (Leck) | attempt-outbox.test | ROT (2 fail) | wirksam |
| M10 | Besitzer-/Schlüsselfilter im Drain entfernt (Altzeile würde gesendet) | attempt-outbox.test | ROT (4 fail) | wirksam |
| M11 | Öffnungsfehler → queued:true (falsche Vormerkung) | attempt-outbox.test | ROT (2 fail) | wirksam |

Alle 14 Mutanten ROT, alle Failures sind ERR_ASSERTION (keine Syntax-/Ladefehler). Alle Mutanten zurückgenommen; Arbeitsbaum sauber.

## Funde

- HINWEIS 1 (attempts-route.test.ts, `attempt()`): Der Fall "ownerId = '' " wird zu "Feld fehlt" umgesetzt; ein literales "" (→ 400 per min(1)) ist ungetestet. Folgenlos, weil kein Client es sendet.
- HINWEIS 2: Nativer-IndexedDB-/Browser-Nachweis (10/10, Bilddatei) stammt vom Autor; ich habe ihn nicht wiederholt. Die Repo-Tests belegen Bytegleichheit nur am Fake-Speicher.
- HINWEIS 3: Die Verdrahtung `useEffect(() => startOutboxFlush(...))` ist nur per Quelltext-Regex gepinnt, nicht durch echtes Rendern/Unmounten (React-Test fehlt). Wirksam gegen die genannten Mutanten.
- HINWEIS 4 (N4): Hängt IndexedDB und scheitert danach auch der Online-Versand, ist die Antwort verloren (`queued:false`, ehrlich gemeldet). Bei Hängen ohne onblocked verzögert jede Abgabe um bis zu 3 s vor dem Online-Versand. Bekannte, vertretbare Abwägung; kein Rückschritt gegenüber vorher.

## Nicht geprüft

Kein build/typecheck/lint/Volltest (Maschine belastet, laut Auftrag). Kein echter Browser/natives IndexedDB. perf-contract und komplette GG-Kette. Die übrigen 24 Dateien des PR (Aufrufer-Clients, page.tsx) nur soweit der Diff N1–N4 sie nicht berührt — nicht Teil dieser Runde.

FREIGABE für Merge PR 484: ja — Beleg: N1–N4 geschlossen, 80/80 gezielte Tests, beide Tore 0, 14/14 Mutanten ROT; offen nur 4 HINWEIS, Vollbatterie/build/perf-Tabelle liegen laut Karte beim GG.

— Prüfer PR 484 (blind, Runde 2)
