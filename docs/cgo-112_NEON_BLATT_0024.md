# CODEX DRAFT — NOT CANON · cgo-112 · Neon-Blatt 0024

**IN PRÜFUNG — nicht angewendet, nicht LIVE.** Basis: PR 510, `3600a6a9eb7dccfb9598e9e1fe64cfd2439412ba` (W1–W4). Eine additive Migration, also ausschließlich eine zusätzliche Datenbankstruktur: [0024_word_duels.sql](../packages/db/drizzle/0024_word_duels.sql). Journal und Snapshot wurden lokal mit `drizzle-kit generate --name=word_duels` erzeugt. Anwendung nur durch Koki über die freigegebene Chrome-Karte, nach 0022/0023. Codex hat keine Verbindung zu Neon hergestellt und keine Migration gegen Neon ausgeführt.

## Umfang und Freigabe

Eine Tabelle `domigo_v2.duels`, ohne Namen oder fremde Klassenfreigabe. Spalten: `id`, `class_id`, `grade`, `p1`, `p2`, `mode`, `status`, `rounds`, `p1_score`, `p2_score`, `winner`, `created_at`, `updated_at`. Vier Indizes: Klasse/Status, Teilnehmer 1, Teilnehmer 2 und ein eindeutiges aktives Paar unabhängig von der Reihenfolge der Teilnehmer. Prüfbedingungen begrenzen Jahrgang, Modus, Status, verschiedene Teilnehmer, Scores 0–15, Sieger und höchstens fünf Runden. Keine Änderung an vorhandenen Tabellen, keine zweite Migration, keine Statistik-Spalten, keine Fremdschlüssel.

`rounds` enthält je Runde den Chapter-Schlüssel, drei Aufgabenkennungen mit je vier Optionen und je Teilnehmer nur eine Folge von richtig/falsch. Der Antwortschlüssel bleibt im Aufgabenbestand. Angezeigte Namen werden ausschließlich aus den derzeit angemeldeten Teilnehmern der eigenen Klasse abgeleitet, nach der bestehenden Regel erster Vorname plus Spitzname. Die Auswahl verwendet laufende Nummern und einen Bestands-Fingerabdruck; verschiebt sich die Liste, muss das Kind neu laden. Nutzer-UUIDs stehen nicht in der Gegnerliste.

Arena-Zugang folgt ausschließlich dem bestehenden Klassen-Bestenlisten-Schalter A. Beide Kinder müssen angemeldet, aktuell derselben Klasse und demselben Jahrgang zugeordnet sein; Testklassen und archivierte Klassen sind ausgeschlossen. Ein breiterer Klassen-Ausschnitt erlaubt kein Duell außerhalb der eigenen Klasse. Keine neue Lehrer-Einstellung, Großmeister-Fremdansicht bleibt lesend.

## Anwendung durch Koki — Nachzug 1

Im freigegebenen Neon-Projekt und Branch arbeiten; keine Verbindungswerte kopieren. **Der Chrome-Agent führt genau EINE SQL-Anweisung je Lauf aus.** Die fünf CREATE-Anweisungen verwenden `IF NOT EXISTS`: eine bereits erfolgreich ausgeführte Anweisung darf wiederholt werden, ohne Tabelle oder Daten neu anzulegen. Das repariert keine abweichende vorhandene Struktur; bei abweichender Nachprüfung an den GG zurückgeben, nichts löschen.

**Lauf 1 — Kennprüfung vor der ersten Anwendung:** beide 0023-Spalten müssen vorhanden sein (`spalten_0023 = 2`), die neue Tabelle muss noch fehlen (`duels_fehlt = true`). Bei einer Wiederaufnahme kann die Tabelle schon vorhanden sein; dann die wiederholbaren Schritte fortsetzen und nachprüfen.

```sql
SELECT
  (SELECT count(*) FROM information_schema.columns
   WHERE table_schema = 'domigo_v2' AND table_name = 'class_settings'
     AND column_name IN ('leaderboard', 'grade_board_opt_in')) AS spalten_0023,
  to_regclass('domigo_v2.duels') IS NULL AS duels_fehlt;
```

**Lauf 2 — Tabelle:**

```sql
CREATE TABLE IF NOT EXISTS "domigo_v2"."duels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"grade" smallint NOT NULL,
	"p1" uuid NOT NULL,
	"p2" uuid NOT NULL,
	"mode" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"rounds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"p1_score" integer DEFAULT 0 NOT NULL,
	"p2_score" integer DEFAULT 0 NOT NULL,
	"winner" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "duels_mode_check" CHECK ("domigo_v2"."duels"."mode" in ('vocab', 'grammar')),
	CONSTRAINT "duels_status_check" CHECK ("domigo_v2"."duels"."status" in ('active', 'complete', 'expired')),
	CONSTRAINT "duels_grade_check" CHECK ("domigo_v2"."duels"."grade" between 1 and 4),
	CONSTRAINT "duels_pair_check" CHECK ("domigo_v2"."duels"."p1" <> "domigo_v2"."duels"."p2"),
	CONSTRAINT "duels_scores_check" CHECK ("domigo_v2"."duels"."p1_score" between 0 and 15 and "domigo_v2"."duels"."p2_score" between 0 and 15),
	CONSTRAINT "duels_winner_check" CHECK ("domigo_v2"."duels"."winner" is null or ("domigo_v2"."duels"."status" = 'complete' and "domigo_v2"."duels"."winner" in ("domigo_v2"."duels"."p1", "domigo_v2"."duels"."p2"))),
	CONSTRAINT "duels_rounds_check" CHECK (jsonb_typeof("domigo_v2"."duels"."rounds") = 'array' and jsonb_array_length("domigo_v2"."duels"."rounds") <= 5)
);
```

**Lauf 3 — Klasse/Status-Index:**

```sql
CREATE INDEX IF NOT EXISTS "duels_class_status_idx" ON "domigo_v2"."duels" USING btree ("class_id","status");
```

**Lauf 4 — Teilnehmer-1-Index:**

```sql
CREATE INDEX IF NOT EXISTS "duels_p1_idx" ON "domigo_v2"."duels" USING btree ("p1");
```

**Lauf 5 — Teilnehmer-2-Index:**

```sql
CREATE INDEX IF NOT EXISTS "duels_p2_idx" ON "domigo_v2"."duels" USING btree ("p2");
```

**Lauf 6 — eindeutiges aktives Paar:**

```sql
CREATE UNIQUE INDEX IF NOT EXISTS "duels_active_pair_unique" ON "domigo_v2"."duels" USING btree (least("p1", "p2"),greatest("p1", "p2")) WHERE "domigo_v2"."duels"."status" = 'active';
```

**Lauf 7 — Nachprüfung, ausschließlich Struktur und Anzahl:** Erwartung nach Erstinstallation `spalten = 13`, `indizes = 4`, `zeilen = 0`. Die Indexzählung über `pg_indexes` schließt den automatisch erzeugten Primärschlüssel-Index `duels_pkey` ausdrücklich aus; einschließlich dieses Indexes gibt es fünf. Bei Wiederholung nach Nutzung darf die Zeilenzahl höher sein; keine Daten löschen, um Null herzustellen.

```sql
SELECT
  (SELECT count(*) FROM information_schema.columns
   WHERE table_schema = 'domigo_v2' AND table_name = 'duels') AS spalten,
  (SELECT count(*) FROM pg_indexes
   WHERE schemaname = 'domigo_v2' AND tablename = 'duels'
     AND indexname <> 'duels_pkey') AS indizes,
  (SELECT count(*) FROM domigo_v2.duels) AS zeilen;
```

Anwendung/Uhrzeit und Strukturbeleg an GG-DomiGo zurückgeben. Kein `DROP`, keine Bestandsänderung und keine Löschung zum Testen. Codex führt keinen dieser Läufe gegen Neon aus.

## Verhalten vor Anwendung und bei Fehlern

Fehlt 0024, zeigt `/arena` „Die Battle Arena ist gerade nicht erreichbar.“ (Jahrgang 1; Englisch in 2–4), ohne Teilnehmerliste oder Fehlerdetails. Schreibanfragen scheitern mit 503 und ohne bestätigte Punkte. Ohne Schalter A fehlt die Home-Karte, und der direkte Arena-Aufruf zeigt einen ruhigen Hinweis. Die Datenschutzseite bleibt eingefroren; der GG trägt ihre notwendige Produktfreigabe separat weiter.

Kontolöschung entfernt die gesamte Partie, wenn das gelöschte Kind Teilnehmer 1 oder 2 ist. Ausschließlich PostgreSQL-Fehler `42P01` (Tabelle noch nicht vorhanden) wird für `duels` toleriert; andere Fehler bleiben Fehler. Der bereits vorhandene Löschweg entfernt außerdem die eigenen Lernversuche. Kein zusätzlicher Löschweg und keine laufende Löschung durch diese Sitzung. Alle Spalten stehen im Datenschutzregister, alle Klassenabfragen im Claim-Filter-Register.

## Genau eine bewertete Antwort

Die Antwort läuft über `/api/attempts` mit `mode: duel:<id>` und `context: {duelId, round, question}`. Die Route prüft Anmeldung, gleichen Ursprung, Teilnehmer, aktive Partie, offene Frage, gewählte Option, Jahrgang und Klassenreserve vor der Bewertung. Die Bewertung verwendet die gemeinsame Vokabelbewertung mit dem Übersetzungspool Deutsch→Englisch.

Beim Schreiben sperrt der Dienst die Partie kurz für parallele Züge und prüft erneut. Der vorhandene `recordAttempt` schreibt Lernversuch, Wiederholung und Lernpunkte innerhalb derselben Transaktion wie das richtig/falsch-Ergebnis. Eine Transaktion speichert alles gemeinsam oder nimmt alle Änderungen zurück. Ein Wiederholungsversuch — auch mit neuer Versandkennung — erhält 409. Abgelaufen ergibt 410, fremder Teilnehmer oder fremde Klasse 403. Ein schon anderswo verwendeter Versuchsschlüssel kann keine Duellfrage fortschalten.

Dafür verwendet die bereits installierte Neon-Serverless-Bibliothek eine kurze, an die Anfrage gebundene Verbindung mit anschließender Schließung. Die übrigen Datenbankleser bleiben unverändert. Keine zusätzliche Infrastruktur oder Bibliothek. Die echte Neon-Verbindung ist **UNVERIFIZIERT**; lokal wurden derselbe Dienst und derselbe vorhandene Lernversuch-Schreiber gegen PostgreSQL im Arbeitsspeicher (PGlite) ausgeführt, einschließlich Rollback nach absichtlich ausgelöstem Fehler.

## Original und bewusste Entscheidungen

Belege: `docs/handover/design-study-og-trainers.md` §5b/5d und Original `og/4th/index.html` im lesenden Labor cgo-106, Funktionen `getWhoseTurn`, `showDuelUnitPicker`, `renderScoreboard`, `generateDuelQuestions`, `finishDuelTurn`. Originalansicht und Entscheidungen stehen im externen Belegordner `SEHEN-W5.md`.

- Fünf Runden mit je drei Fragen folgen dem verbindlichen Kartenbrief und der Design-Studie §5b (Zeilen 435–441). Der lesende Original-Snapshot widerspricht der Studie: alle vier Jahrgänge rufen `generateDuelQuestions(unitKey, 5)` auf; der Generator liefert `min(5, verfügbare Wörter)`, Abschluss nach fünf Runden, damit maximal 25 richtige Antworten. Konkreter Beleg 4th: `onDuelUnitPicked` Zeile 9046, `generateDuelQuestions` Zeilen 9317–9320, `finishDuelTurn` Zeile 9228. W5 behält ausdrücklich 5 × 3 und Höchstscore 15; es behauptet keine identische Rundengröße mit diesem Original-Snapshot.
- Chapter-Wahl wechselt zwischen den Teilnehmern; zuerst offene Fragen beantworten. Fünf verschiedene Chapters, vier Optionen aus dem vorhandenen Aufgabenbestand, deterministische Auswahl, keine neuen Aufgaben.
- Nur Vokabelduelle in W5. Grammatik-Duell ist benannt verschoben und erhält keine tote Auswahl.
- Sieben Tage ohne Zug: abgelaufen, kein Sieger. Lesen verlängert die Frist nicht. Abgelaufene Partien zählen nicht als abgeschlossener Sieg/gespielter Abschluss; Punkte schon bewerteter Antworten bleiben erhalten.
- Kein Zeitlimit bei asynchronen Fragen; Fortschrittsanzeige statt Original-Timer. Unterbrochene Fragen bleiben offen, beantwortete Fragen werden nicht erneut gewertet.
- Keine Original-Boni: 2nd–4th verwenden 100/50/25 plus `8 × richtig`; 1st verwendet für die eigene Abschlussbuchung 200/100/50 plus `20 × richtig`, für den Gegner weiterhin 100/50/25 plus `8 × richtig` (Original `finishDuelTurn`, Zeilen 11870–11871 und 11915–11916). Keine dieser Zusatzbuchungen wird übernommen. XP entstehen ausschließlich durch Englisch-Antworten. Sieg, Played und Win rate sind abgeleitete Statistiken, ohne zusätzlichen Schreiber. Verlauf: letzte 20 beendete/abgelaufene Partien; Gesamtstatistik über alle eigenen sichtbaren Partien, XP ausschließlich aus eigenen Duell-Lernversuchen der aktuellen Klasse.
- Live Battle und Class Quiz bleiben außerhalb W5 (Ruling cgo-120); die Kinderoberfläche nennt sie nicht.

## Verifikation und verbleibende Abnahme

Lokale Verhaltenstests prüfen die echte Migration im Arbeitsspeicher, Paar-Eindeutigkeit, Klassengrenze, Platzhalterfilter, Reserve, Jahrgang, Zugfolge, doppelte/parallele Antwort, Transaktions-Rücknahme, Ablauf, 30-Antworten-Abschluss, Verlauf/Statistik und Löschweg. Web-Tests prüfen die realen Routen, Vorschau und Darstellung. Exakte Zahlen, rote Manipulationsproben, Bild-/Netzbelege und Exit-Codes stehen im PR-Bericht außerhalb des Repos.

Offen bis GG/Koki: Anwendung von 0024 in Neon, produktive Verbindungs-/Anmeldeprüfung, GG-Merge-Kette und endgültige Original-/Produktabnahme. Codex öffnet den PR gegen `main`, führt keinen Merge durch.

**Nachzug 1:** Der GG hat den Zaun für `packages/db/src/claim-filter-laufzeit.test.ts` geöffnet; die bestehende Kontolöschungs-Erlaubnisliste enthält jetzt `p1` und `p2`. Migration und Neon-Schritte sind wiederholbar und im Test bytegleich gegeneinander geprüft, Journal-Eintrag 24 ist festgelegt. Die lokalen PostgreSQL-Tests führen jede CREATE-Anweisung zweimal einzeln aus, vervollständigen einen unterbrochenen Lauf und bewahren vorhandene synthetische Partien. Alle Arena-Schreibrouten sind ausdrücklich `runtime = "nodejs"`; der Laufzeit-Test erfasst auch künftig ergänzte Arena-Routen. Der Transaktionstest wirft nach einem echten Datenbankschreibzug einen Fehler und belegt sowohl vollständige Rücknahme als auch Verbindungsschließung. Ergebnisse und Prüfwerte stehen im Nachzug-1-Bericht des PRs.
