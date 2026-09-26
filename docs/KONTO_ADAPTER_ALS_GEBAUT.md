# Der Konto-Adapter, als gebaut — dach-018

Karte dach-018 · Brief `OPUS_ADAPTER_DOMIGO_2026-09-16_V1.md` (md5 7659b0fc…) ·
Kanon `SPEC_KONTO_DIENST_2026-09-15_V1.1-FINAL.md` (md5 75b1f29f…) + Nachtrag
N-1…N-17 (a6e77afe…) und N-18…N-20.
Gebaut gegen `origin/main` 40caad44. **Seit dach-108 (Koki-Entscheid E-3/E-8,
19.09.2026) gibt es keinen Umstiegstag mehr:** angemeldet wird nur über konto,
fest, ohne Datum — siehe §0.

Dieses Blatt sagt, was jemand wissen muss, der den Adapter später anfasst: die
Auslegungen, die der Brief offen ließ, die Stellen, an denen ich anders gebaut
habe als er sagt, und was NICHT verifiziert ist.

---

## 0 · Tabula rasa — nur noch konto, ohne Datum (dach-108, 19.09.2026)

**Warum.** Nach dem versehentlichen Merge des Adapters (#448, Revert #450) stand
seit dach-074 (#451) die alte PIN-Anmeldung als **datierter Rückfall** neben dem
konto-Knopf, und an einem Stichtag (13.10.) hing ein Sammelschalter: PIN aus, alte
Cookies ungültig, fünf Türen leiten weg, Klassenpflege 405, Datenschutzseite
schaltet um, Prüf-Tor rot. Koki am 19.09.: »Die alte Anmeldung kann sofort
ausgehen — es benützt gerade kein einziger Schüler das. Tabula rasa … Kein Datum
schließt etwas von selbst.« Der Zustand, der erst ab dem Stichtag gegolten hätte,
ist jetzt der Dauerzustand — ohne Datum, ohne Uhr.

| Was | fest, seit dach-108 | wo |
|---|---|---|
| Anbieter `student`/`teacher` | **entfernt** (samt ihrem Modul) | `apps/web/auth.ts` |
| Cookie ohne `via`, Sitzung mit `via` = student/teacher | keine Sitzung (`null`) | `sitzungsRegel` in `apps/web/lib/konto/regeln.ts` |
| konto-Sitzung | 60-s-Abfrage bei konto (unverändert) | `auth.ts` |
| `ops-link` | deklarierter Rest, **ohne Ablaufdatum** (`restZulaessig`) | `apps/web/lib/konto/reste.ts`, Allowlist |
| `/signin`, `/admin/signin` | nur Knopf »Sign in with Lauter Einser« (+ Beitritts-Code → konto) | Seiten |
| `/join/<code>`, `/lehrkraft/<token>`, `/lehrkraft/pin-reset/<token>`, `/lehrkraft/pin-vergessen`, `/bootstrap` | **immer 307** zum festen Ziel (`tuerZiel`), nie 308; keine Datenbank, keine Aktion | `regeln.ts`, die fünf `page.tsx` |
| Klasse anlegen/umbenennen/archivieren/zurückholen, Klassenliste importieren | **immer 405** + Satz + Lehrer-Raum-Link; die Oberfläche zeigt statt der Knöpfe den Satz | `apps/web/lib/konto/klassen-antwort.ts` |
| PIN ändern, Wiederherstellungs-Mail, PIN-Reset durch den Verwaltungszugang, »Reset PIN« beim Kind | **entfernt** (Koki 19.09.) | — |
| Klassenwand | nur aus konto-Claims (oder Verwaltungszugang) | `apps/web/lib/identity.ts` |
| Abmelden | konto-Sitzung → konto `/logout`, alles andere → `/` (unverändert) | `apps/web/lib/konto/abmelden.ts` |

Das Tor `scripts/check-no-local-login.mjs` prüft ohne Uhr (sieben Gesetze: provider ·
formen · umleitung · klassen · datum · dev · reste); `--selftest` beweist 18 rote
Lichter. Alte PIN-Konten bleiben als Zeilen in der Datenbank (keine Migration, keine
Löschung); niemand prüft ihre PIN.

**Neustart ohne Import (Koki, 18.09.).** Das Export-Skript
(`apps/web/scripts/konto-export.ts`, `packages/db/src/konto-export.ts`, Tests,
npm-Eintrag `konto:export`) ist entfernt, nicht repariert: Koki hat entschieden,
dass konto ohne Übernahme der DomiGo-Bestände startet — Kinder und Klassen
entstehen bei konto neu und kommen über Handoff und Klassen-Push hierher
(`createKontoStudent`, `packages/db/src/konto-class-term.ts`). Ein Skript, das
niemand laufen lässt, wäre nur ein zweiter, ungeprüfter Weg in die Daten.

**Ops-Notiz (nur Variablennamen, keine Werte):**
- `KONTO_BASE_URL`, `KONTO_APP_SECRET`, `CRON_SECRET` — in Vercel (Production) setzen.
- `AUTH_URL` muss auf die öffentliche DomiGo-Adresse zeigen
  (`https://eng-unterstufe.lautereinser.at`, der `eng-us`-Eintrag in
  `apps/web/app/le-werkzeuge.json`): konto lässt als Rücksprung nur exakt diesen
  Host zu.
- `docs/runbooks/deploy.md` (Schritt 2) nennt seit dach-074 dieselbe Adresse für `AUTH_URL` und `NEXTAUTH_URL`.
- **Ops-Testweg:** ein Ops-Cookie ohne `via` (von vor #451) ist keine Sitzung mehr; ein **neuer**
  Einmal-Link (`ops-link`) wirkt — ohne Ablaufdatum der Allowlist, nur mit seinen eigenen zehn Minuten.
- `/lehrkraft/<token>` (alter Einladungs-Link für Lehrkräfte) leitet nicht kontextlos zu
  konto, sondern auf `/lehrkraft/umgezogen`: ein Satz, warum der Link nicht mehr gilt, und der Knopf
  »Sign in with Lauter Einser« (Befund GG 19.09., NEBEN-3).
- `GRANDMASTER_TEACHER_IDS` braucht nach dem Start Kokis **neue** Nutzer-id (die
  lokale id, die sein erster konto-Handoff anlegt) — sonst verliert der
  Verwaltungszugang seinen weiten Blick.

## 1 · Wo die Anmeldung jetzt herkommt

`/signin` und `/admin/signin` zeigen einen Knopf. Er führt an den Konto-Dienst,
der nach der Anmeldung auf `/api/auth/callback-konto?handoff=…` zurückkommt.
Die Route tauscht das Einmal-Token server-zu-server gegen die Claims
(`lib/konto/claims.ts`), baut daraus DomiGos eigene Sitzung und leitet auf
`/home` — die Adresse mit dem Token überlebt die Weiterleitung nicht.

Der Provider heißt `konto-handoff` (`apps/web/auth.ts`). Was er entscheidet,
steht in `lib/konto/anmeldung.ts`, und die Reihenfolge ist der Entwurf: **erst
tauschen, dann entscheiden, ob die Person hier sein darf, dann erst anlegen.**
Eine Abweisung hinterlässt so nie einen halben Nutzer.

Abgewiesen wird (alle enden auf `/zugriff-fehlt`, ohne zu verraten, welche
Prüfung es war):
- eine Lehrkraft ohne `{area:"go", role:"teacher"}` in den Claims,
- ein Kind, dessen Lehrgruppe keine Brücke nach DomiGo hat (`app_class_id`
  fehlt) oder deren Klasse es hier nicht gibt,
- eine `app_user_id`, die auf einen Nutzer zeigt, den diese Datenbank nicht hat
  (eine veraltete Brücke) — **nicht** stillschweigend ein zweiter Nutzer.

## 2 · Die Regel im Sitzungs-Callback (SPEC §4.6)

In dieser Reihenfolge, und in keiner anderen:

| `via` | was passiert |
|---|---|
| `konto-handoff` | `konto_sid` ist Pflicht; alle 60 s `GET /api/claims?sid=`. »revoked« oder 401 ⇒ die Sitzung endet. Sonst werden Ausschnitt, Rolle und Bereichs-Rolle erneuert. |
| ein Rest aus der Allowlist (ohne Ablaufdatum, dach-108) | kein Abruf; es gelten die Grenzen dieses Providers |
| alles andere | die Sitzung endet |

Die letzte Zeile ist es, die jede selbst gebaute Sitzung zurückzieht: ein altes
Kind- oder Lehrer-Cookie trägt gar kein `via` (seit dach-108 fest, ohne Datum).

**Ein unerreichbarer Konto-Dienst meldet NICHT ab.** Nur »revoked« und 401 tun
das. Eine langsame Minute darf keine Klasse mitten in der Stunde aussperren; die
Sitzung stirbt ohnehin an ihrer eigenen 30-Tage-Uhr.

## 3 · Auslegungen, die der Brief offen ließ

| Frage | Entscheidung | Warum |
|---|---|---|
| Welche Tabelle trägt einen neuen konto-Nutzer? | `domigo_v2.users` (P-1a), nie `public.users` | Der Dual-Read findet v2 zuerst; die v1-Spiegel sind erklärtermaßen nur lesbar. |
| Was ist `app_class_id` in DomiGo? | `domigo_v2.classes.id` — dieselbe uuid, die die Sitzung heute als `classId` trägt | DomiGo kennt kein Feld dieses Namens (`git grep app_class_id` = 0). |
| Was wird aus der PIN eines konto-Nutzers? | ein bcrypt-Hash über zwei zufällige uuids | Die Spalte ist NOT NULL, und nach dem Umstieg prüft sie niemand mehr. Ein zufälliger Hash kann nicht zufällig auf eine leere Eingabe passen. |
| `class_terms`? | Es gibt keine, und es entsteht keine | 0 Treffer im ganzen Repo. `school_year` und `term_started_at` kommen an, werden gelesen und wirken nichts — eine Tabelle dafür wäre eine Migration, die diese Karte nicht schreiben darf. |
| Jahrgang `null` beim Anlegen? | 422 | `classes.grade` ist `smallint NOT NULL`, und der Jahrgang steht vor jedem Kind im Inhalt. |
| Drosselung (`bumpAndCheck`) | bleibt im Paket, hat aber keinen Aufrufer mehr in `auth.ts` | Sie zählte Fehlversuche an PINs; es gibt keine mehr. Der Maschinenpfad braucht sie nicht (sein Limit ist der Einmal-Gebrauch). |
| `allocateClassCode` | bleibt, verwaist | Sein einziger Aufrufer war `createClass`. Rein lesend, ohne Weg nach außen — gemeldet, nicht gelöscht. |
| Variablen zum Streichen | `TEACHER_INVITE_TOKEN`, `TEACHER_BOOTSTRAP_TOKEN` | Ihre Seiten sind Weiterleitungen; die Werte wurden nie gelesen. |

## 4 · Wo ich anders gebaut habe als der Brief

1. **`body_sha256` am Logout.** Der Brief (§3.6) verlangt ihn. Gemessen an konto
   main 146265f signiert `lib/logout.ts:24` aber nur `{sid}`; `body_sha256` und
   `kind` tragen ausschließlich die Pushes (`lib/lehrerraum/pushes.ts:115`).
   Wörtlich gebaut wiese DomiGo **jede echte Abmeldung ab**. Gebaut ist deshalb:
   Logout an `{sid}` gebunden (wie es domi-tracker tut), Pushes an `kind` +
   `body_sha256` über die rohen Bytes.
2. **Kein `jti`-Sperrregister.** domi-tracker führt eines, weil ein
   wiederholtes Token dort eine Sitzung prägen würde. Hier sind alle vier
   Empfänger idempotent, und ein Register bräuchte eine Tabelle — diese Karte
   schreibt keine Migration (Brief §0.2).
3. **Der Verwaltungszugang als weiter Ausschnitt.** Koki hat am 17.09.
   entschieden, dass er weiter alles sieht. Gebaut ist das als **ein** weiter
   Ausschnitt (`listAllClassIds`, eine Zeile in der Ausnahme-Liste) statt als
   vier Funktionen, die gar nicht fragen. Dieselbe Sicht, eine benannte Tür —
   und die Übernahme fremder Kennungen fällt damit weg: der Verwaltungszugang
   handelt als er selbst, das Journal kann nicht mehr die falsche Hand nennen.
4. **Drei Ein-Wort-Änderungen im Spielpfad.** `apps/web/app/(game)/play/**`
   ruft `getDueRefs`; ein Pflicht-Parameter zwingt dort zu drei Änderungen
   (`acting.classId` → `acting.classScope`). Weder das `(game)`-Layout noch der
   Phaser-Chunk noch `check:bundle` sind berührt (Law 9 gewahrt), aber es
   überschreitet den Wortlaut der Scope-Mauer des Briefs. Die Alternative — ein
   optionaler Parameter — wäre genau das Loch, das `test:claim-filter` schließt.
5. **Zwei Dinge gebaut, die der Brief nicht nennt, weil ohne sie der Hauptweg
   kaputt ist:** der 60-s-Abruf erneuert auch die Bereichs-Rolle (sonst behielte
   eine Lehrkraft, der konto die Rolle entzieht, die Lehrer-Fläche bis zum
   Ablauf des Cookies — dreißig Tage), und ein Kind, das bei konto die Klasse
   wechselt, zieht in DomiGo mit (sonst meldet es sich tadellos an und steht auf
   keiner Klassenliste).

## 5 · Die Klassenwand

Gemessen an 40caad44: **27** echte `.classId`-Prädikate, **23** weitere auf
`v2Classes.id`/`.inviteCode`/`.teacherId`, die der Grep des Briefs nicht sieht,
eines in rohem SQL (`writing-review.ts` `gehoertZuLehrkraft`) und zwei
Funktionen, die `classId` nur als Parameter nehmen (`review.ts`). Die Wand sitzt
auf allen: **38 Funktionen** filtern auf den Ausschnitt, **15** stehen mit Satz
in `scripts/claim-filter-allowlist.json`.

Der Ausschnitt wird an **einer** Stelle gebaut (`apps/web/lib/identity.ts`), und
das Tor erzwingt genau das. Der Typ kann nicht beweisen, woher seine Kennungen
kommen — aber eine einzige Baustelle kann bewacht werden.

`grade-scope.ts`: ohne Klasse gibt es jetzt **keinen** Jahrgang statt aller
vier. Die alte Begründung (P-R1.5: eine leere Seite wäre tot) ist verbraucht —
ein Kind ohne Klasse bekommt seit dem Umstieg die Zugriff-fehlt-Karte.

## 6 · Was NICHT verifiziert ist

- **Der echte Tausch gegen konto.lautereinser.at.** Eine Vorschau ohne die
  `KONTO_*`-Variablen zeigt nur die Hinweisseiten. Alle Tore laufen gegen den
  Doppelgänger (`apps/web/scripts/lib/konto-stub.ts`).
- **Die Vercel-Variablen** (`KONTO_BASE_URL`, `KONTO_APP_SECRET`, `CRON_SECRET`)
  sind nicht gesetzt; Werte wurden nie gelesen.
- **Der Import-Lauf auf Neon** — entfällt seit dach-074 (Neustart ohne Import, §0).
- **dach-074 · Der Rückfall in einem echten Browser.** Geprüft sind die
  Entscheidungen (Tests mit gestellter Uhr) und die Verdrahtung (Tor); eine
  echte PIN-Anmeldung und ein echter konto-Tausch nach dem Merge sind erst auf
  der Produktion messbar.
- **Ob der 60-s-Zeitstempel aus der Edge-Middleware ins Cookie zurückgeschrieben
  wird.** Wird er es nicht, fragt die App öfter als nötig — ein Leistungs-, kein
  Sicherheitsproblem, weil der Abruf idempotent ist.
- **`GET konto/api/class-terms`** existiert noch nicht (dach-048). Der
  Nacht-Abgleich behandelt 404 als »0 Änderungen«.
- **Der Rückkanal ist bei konto noch aus** (`BACKCHANNEL.go`); bis er an ist,
  trägt der 60-s-Abruf die Abmeldung allein.

## 7 · Befunde außerhalb der Mauer dieser Karte

1. ~~`/api/admin/teacher/pin`, `/api/admin/teacher-pin/reset`~~ — mit dach-108 entfernt
   (samt `/api/admin/teacher/email` und den Formularen in Einstellungen und Verwaltungsbereich).
2. ~~`importRoster` und die Klassenlisten-Maske~~ — mit dach-108: die Route antwortet
   fest 405, und die Maske zeigt statt des Import-Kastens den Satz mit dem Link.
   Die Dienstfunktionen in `packages/db` (`importRoster`, `createClass` …) bleiben
   ungenutzt stehen.
3. `reset-tokens.ts` in `packages/db` ist seit dach-108 ohne Aufrufer (`lib/mailer.ts`
   ist entfernt).
