# Der Konto-Adapter, als gebaut — dach-018

Karte dach-018 · Brief `OPUS_ADAPTER_DOMIGO_2026-09-16_V1.md` (md5 7659b0fc…) ·
Kanon `SPEC_KONTO_DIENST_2026-09-15_V1.1-FINAL.md` (md5 75b1f29f…) + Nachtrag
N-1…N-17 (a6e77afe…) und N-18…N-20.
Gebaut gegen `origin/main` 40caad44. **Umstiegstag: Montag, 13.10.2026** (Koki,
steu-013 Punkt 2A) — eine Konstante, `apps/web/lib/konto/umstieg.ts`.

Dieses Blatt sagt, was jemand wissen muss, der den Adapter später anfasst: die
Auslegungen, die der Brief offen ließ, die Stellen, an denen ich anders gebaut
habe als er sagt, und was NICHT verifiziert ist.

---

## 0 · Der datierte PIN-Rückfall (dach-074, 18.09.2026)

**Warum.** Am 18.09. wurde der Adapter versehentlich gemergt (#448). Er entfernte
die PIN-Anmeldung, und weil noch niemand ein mit DomiGo verknüpftes konto-Konto
hatte, kam zwei Stunden lang niemand hinein (Revert #450). Seit dach-074 darf ein
Merge niemanden mehr aussperren: der konto-Knopf ist ab dem Merge da, die alte
PIN-Tür bleibt daneben — bis **Di 13.10.2026, 00:00 Wien** (`UMSTIEGSTAG` in
`apps/web/lib/konto/umstieg.ts`). Vorbild: srdp `lib/konto/rueckfall.ts`.

**Die eine Regel** steht in `apps/web/lib/konto/rueckfall.ts`
(`rueckfallOffen(now)` = `wienerTag(now) < UMSTIEGSTAG`, **exklusiv**: der 12.10.
ist der letzte Rückfall-Tag, am 13.10. um 00:01 ist die PIN zu).

| Was | vor dem Umstiegstag | ab 00:00 Wien am Umstiegstag |
|---|---|---|
| Anbieter `student`/`teacher` (`lib/konto/pin-rueckfall.ts`) | prüfen die PIN wie main | `null`, ohne Datenbank-Ruf |
| Sitzung mit `via` = student/teacher | lebt (`restGueltig`, Eintrag `rueckfall: true`) | `null` |
| **Cookie ohne `via`** (alle Sitzungen von vor diesem PR) | gilt als PIN-Sitzung weiter | `null` |
| konto-Sitzung | wie im Adapter (60-s-Abfrage) | unverändert |
| `/signin`, `/admin/signin` | PIN-Formular **und** Knopf »Sign in with Lauter Einser« | nur Knopf + Hinweissatz (`hinweisFaellig`) |
| `/join/<code>`, `/lehrkraft/*` (3), `/bootstrap` | Seite wie main | **307** zu konto (`tuerZiel`; nie 308 — ein Browser merkt sich eine dauerhafte Weiterleitung über jeden Rückfall hinaus) |
| Klasse anlegen/umbenennen/archivieren/zurückholen, Klassenliste importieren | wie main (jetzt in der Klassenwand) | **405** + Satz »Klassen und Klassenlisten pflegst du im Lehrerzimmer von Lauter Einser.« |
| Klassenwand einer PIN-Sitzung (`lib/identity.ts`) | Kind: seine Klasse · Lehrkraft: eigene Klassen + v1 (`listClassIdsForPinTeacher`) | — (die Sitzung gibt es nicht mehr) |
| Abmelden (`app/le/konto-aktion.ts`) | konto-Sitzung → konto `/logout?return=<eng-us-Adresse>/`, PIN-Sitzung → `/` | ebenso |

Jede Server-Aktion einer alten Seite fragt das Datum selbst
(`assertRueckfallOffen`) — ein Tab, der über Mitternacht offen bleibt, schreibt
nicht mehr. Das Tor `scripts/check-no-local-login.mjs` ist **datumsabhängig**:
vor dem Tag erlaubt es genau die zwei Rückfall-Anbieter, und nur mit
Datumsprüfung; ab dem Tag ist ihr Vorhandensein rot — dann muss der Code weg.
`--selftest` stellt die Uhr auf 23:59 am Vorabend (grün) und 00:01 am Tag (rot).

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
| ein Rest aus der Allowlist, vor seinem Ablauf | kein Abruf; es gelten die Grenzen dieses Providers |
| alles andere | die Sitzung endet |

Die letzte Zeile ist es, die am Umstiegstag jede selbst gebaute Sitzung
zurückzieht: ein altes Kind- oder Lehrer-Cookie trägt gar kein `via`.

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

1. `/api/admin/teacher/pin` und `/api/admin/teacher-pin/reset` schreiben weiter
   einen bcrypt-Hash — bis zum Umstiegstag die Rückfall-PIN, danach einen, den
   niemand mehr prüft (totes Gewicht, ab dem Tag entfernen). Beide stehen benannt in
   `apps/web/konto-local-login-allowlist.json`.
2. `importRoster` und die Klassenlisten-Maske: seit dach-074 bis zum
   Umstiegstag wie main (mit `claimStudent` auf `/join`), ab dem Tag antwortet
   die Route 405 — unter konto erzeugte ein Import Doppelgänger. Die Maske
   selbst bleibt sichtbar und zeigt dann die Antwort; sie zu entfernen ist
   eine Folgekarte.
3. `reset-tokens.ts` und `lib/mailer.ts` haben bis zum Umstiegstag wieder
   Aufrufer (die PIN-Vergessen-Seiten); ab dem Tag sind sie tot.
