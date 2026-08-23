# Zustands-Schnappschuss vor dem Jahres-Rollover (Etikett `2025-26`)

Sichert den Lernstand **aller** Bestandsschüler in eine eigene Tabelle, bevor das
Schuljahr 2026/27 mit frisch angelegten Klassen und Konten beginnt (Kokis Ruling
P-R1.1: „Tabula rasa **+** Schnappschuss in der Hinterhand").

**Was das ist, in einem Satz:** ein Foto des Ist-Zustands — Konto-Zähler,
Lernfortschritt, Karteikasten, Versuchs-Summen — das später einmal auf neu
angelegte Schüler *importiert* werden können soll. **Der Import ist NICHT Teil
dieses Runbooks und existiert noch nicht.** Hier wird nur gesichert.

Die Schritte gehen **der Reihe nach**; jeder hat eine Verifikation und eine
**STOPP**-Bedingung. Wer darf was:

| | Neon SQL Editor (Browser) | Repo / Terminal | Entscheidungen |
|---|---|---|---|
| **Darf es tun** | **Koki allein** (Produktion) | Koki oder eine Bausitzung (nur Entwicklungs-Zweig) | Koki |

### Haus-Regeln, die hier teuer erkauft sind

- **Eine Anweisung je Lauf.** Der Neon-Editor verschluckt die Ergebnisse eines
  Mehr-Anweisungs-Laufs. Jeder Block unten ist **genau eine** Anweisung.
- **Editor vor jedem Lauf leeren.** Ein stehengebliebener Rest läuft sonst als
  zweite Anweisung mit.
- **Nach jedem Lauf die zurückgegebene Zahl gegen die erwartete prüfen.** Ein
  „1 Zeile" beweist nichts, wenn es die Zeile des vorigen Laufs ist.
- **Keine Anweisung gibt eine Personendaten-Zeile aus.** Alles, was hier auf dem
  Bildschirm landet, sind Zählwerte und Spaltennamen. Das Befüllen bewegt die
  Namen datenbank-intern von einer Tabelle in die andere — angezeigt wird nie
  einer. (Genau darum ist es **ein** `INSERT … SELECT` und kein Export.)
- **Neon-HTTP kennt keine Transaktion über mehrere Anweisungen.** Deshalb ist das
  Befüllen bewusst eine einzige Anweisung: sie geht ganz durch oder gar nicht.

---

## Schritt 0 — Das Schema gegenmessen · *Neon SQL Editor* · **lesend**

Die Spaltenlisten, mit denen Schritt 2 rechnet, sind am **Entwicklungs**-Zweig
gemessen worden. Bevor irgendetwas geschrieben wird, wird an der **Produktion**
nachgemessen, statt es anzunehmen.

```sql
-- [R0] Gegen-Messung: hat die Produktion die Spalten, mit denen Schritt 2 rechnet?
SELECT table_schema || '.' || table_name AS tabelle,
       count(*)::int                     AS spalten,
       string_agg(column_name, ', ' ORDER BY ordinal_position) AS spaltenliste
FROM information_schema.columns
WHERE (table_schema, table_name) IN (
        ('public','users'), ('public','classes'), ('public','legacy_students'),
        ('domigo_v2','user_progress'), ('domigo_v2','review_queue'),
        ('domigo_v2','practice_attempts'), ('domigo_v2','study_path_progress'))
GROUP BY 1
ORDER BY 1;
```

**Erwartet:** sieben Zeilen. In `public.users` müssen `real_name`, `xp`,
`grammar_xp`, `level`, `grammar_level`, `streak`, `last_session_date`,
`total_sprints`, `total_flashcards`, `avatar_key`, `created_at`, `last_seen_at`
vorkommen.
**STOPP**, wenn eine Tabelle fehlt oder eine dieser Spalten nicht in der Liste
steht — dann muss Schritt 2 angepasst werden, bevor er läuft.

---

## Schritt 1 — Die Tabelle anlegen (Migration 0014) · *Neon SQL Editor* · **schreibend, additiv**

Drei Anweisungen, **je einzeln** laufen lassen. Der Text ist byte-gleich mit
`packages/db/drizzle/0014_black_agent_zero.sql` im Repo; das Probelauf-Skript
prüft diese Gleichheit maschinell.

```sql
-- [R1a] Die Schnappschuss-Tabelle. Rein additiv: legt NUR eine neue Tabelle im
-- Schema domigo_v2 an, fasst kein Bestandsobjekt an.
CREATE TABLE "domigo_v2"."rollover_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"v1_user_id" uuid NOT NULL,
	"real_name" text,
	"display_name" text NOT NULL,
	"class_name" text,
	"grade" smallint,
	"v1_stats" jsonb NOT NULL,
	"v2_progress" jsonb,
	"leitner" jsonb,
	"attempts_summary" jsonb,
	"study_path_done" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
```

```sql
-- [R1b] Die eigentliche Sicherung: pro Etikett darf jeder Schüler nur EINMAL
-- vorkommen. Ein zweiter Lauf desselben Etiketts wird dadurch konstruktiv
-- unmoeglich (Fehler 23505) statt bloss verboten.
CREATE UNIQUE INDEX "rollover_snapshots_label_user_unique" ON "domigo_v2"."rollover_snapshots" USING btree ("label","v1_user_id");
```

```sql
-- [R1c] Lese-Index fuer das spaetere Import-Feature: alle Zeilen eines Jahrgangs.
CREATE INDEX "rollover_snapshots_label_idx" ON "domigo_v2"."rollover_snapshots" USING btree ("label");
```

```sql
-- [R1v] Verifikation: 13 Spalten, 3 Indexe (Primaerschluessel + die zwei oben).
SELECT (SELECT count(*)::int FROM information_schema.columns
          WHERE table_schema = 'domigo_v2' AND table_name = 'rollover_snapshots') AS spalten,
       (SELECT count(*)::int FROM pg_indexes
          WHERE schemaname = 'domigo_v2' AND tablename = 'rollover_snapshots')    AS indexe;
```

**Erwartet:** `spalten = 13`, `indexe = 3`. **STOPP** bei jeder anderen Zahl.

---

## Schritt 2 — Vorher-Messung · *Neon SQL Editor* · **lesend**

Diese Zahlen sind der Massstab für Schritt 4. Jede hat ihre Formel danebenstehen.

```sql
-- [R2] Vorher-Messung. Nur Zaehlwerte, keine Zeile mit Namen.
SELECT
  -- Formel: Zeilen in public.users mit role = 'student'.
  (SELECT count(*)::int FROM public.users WHERE role = 'student')                  AS schueler_v1,
  -- Formel: alle Zeilen der Import-Spur des 17.05.-Umzugs.
  (SELECT count(*)::int FROM public.legacy_students)                               AS legacy_zeilen,
  -- Formel: Import-Spur-Zeilen OHNE Ziel-Konto = nie nach Neon migriert.
  (SELECT count(*)::int FROM public.legacy_students WHERE new_user_id IS NULL)     AS legacy_nie_migriert,
  -- Formel: Schueler, deren id in KEINEM legacy_students.new_user_id steht
  -- = nach dem Import direkt in Neon entstanden ("Nachzuegler").
  (SELECT count(*)::int FROM public.users u
     WHERE u.role = 'student'
       AND NOT EXISTS (SELECT 1 FROM public.legacy_students l WHERE l.new_user_id = u.id))
                                                                                   AS nachzuegler,
  -- Formel: Schueler, deren class_id in public.classes NICHT aufloest
  -- (bekommen im Schnappschuss class_name = NULL).
  (SELECT count(*)::int FROM public.users u
     LEFT JOIN public.classes c ON c.id = u.class_id
     WHERE u.role = 'student' AND c.id IS NULL)                                    AS ohne_klassenname,
  -- Formel: juengster Zeitstempel der Import-Spur.
  (SELECT max(migrated_at)::text FROM public.legacy_students)                      AS letzter_import;
```

**Notiere `schueler_v1`** — Schritt 4 muss genau diese Zahl wiederfinden.
**STOPP**, wenn `schueler_v1 = 0` (dann zeigt die Verbindung auf die falsche
Datenbank).

> **Was diese Messung NICHT sehen kann:** Konten, die nur in Firebase existieren
> und nie nach Neon importiert wurden. `legacy_nie_migriert` zählt die Zeilen, von
> denen wir *wissen*; ein Firebase-Direktbestand ohne Zeile in `legacy_students`
> ist von hier aus unsichtbar und nur in der Firebase-Konsole zählbar.
> **Offene Koki-Frage der GO-Sitzung** — kein Bau dieser Welle.
> *Zum Vergleich, gemessen am Entwicklungs-Zweig 2026-08-23:* `schueler_v1 = 2` ·
> `legacy_zeilen = 113` · `legacy_nie_migriert = 112` · `nachzuegler = 1` ·
> `ohne_klassenname = 0` · `letzter_import = 2026-05-18 16:21:18.912+00`.
> Die Zahlen sind klein, die **Formeln** sind dieselben.

---

## Schritt 3 — Der Schnappschuss · *Neon SQL Editor* · **schreibend, EINE Anweisung**

Das Herzstück. Eine einzige Anweisung, die für jeden Schüler eine Zeile schreibt
und am Ende **nur eine Zahl** zurückgibt.

```sql
-- [R3] Der Schnappschuss. EINE Anweisung (Neon-HTTP hat keine Transaktion ueber
-- mehrere), Etikett '2025-26'. Gibt ausschliesslich die Anzahl zurueck.
WITH eingefuegt AS (
  INSERT INTO domigo_v2.rollover_snapshots
    (label, v1_user_id, real_name, display_name, class_name, grade,
     v1_stats, v2_progress, leitner, attempts_summary, study_path_done)
  SELECT
    '2025-26'                                                    AS label,
    u.id                                                         AS v1_user_id,
    u.real_name,
    u.display_name,
    c.name                                                       AS class_name,
    c.grade,
    -- Die v1-Konto-Zaehler, so wie sie in diesem Moment stehen.
    jsonb_build_object(
      'xp',                u.xp,
      'grammar_xp',        u.grammar_xp,
      'level',             u.level,
      'grammar_level',     u.grammar_level,
      'streak',            u.streak,
      'last_session_date', u.last_session_date,
      'total_sprints',     u.total_sprints,
      'total_flashcards',  u.total_flashcards,
      'avatar_key',        u.avatar_key,
      'created_at',        u.created_at,
      'last_seen_at',      u.last_seen_at)                       AS v1_stats,
    -- v2-Fortschritt; NULL, wenn das Kind in domigo_v2.user_progress keine Zeile hat.
    (SELECT jsonb_build_object(
              'xp',                p.xp,
              'grammar_xp',        p.grammar_xp,
              'streak',            p.streak,
              'last_session_date', p.last_session_date,
              'hint_sparks',       p.hint_sparks,
              'updated_at',        p.updated_at)
       FROM domigo_v2.user_progress p
      WHERE p.user_id = u.id)                                    AS v2_progress,
    -- Der Karteikasten: eine Zeile je faelliger Karte, mit Fach (box) und Termin.
    -- ACHTUNG: jsonb_agg liefert ueber einer LEEREN Menge NULL, nicht [] -
    -- das coalesce macht aus "kein Kasten" einen leeren Kasten.
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
                'item_id',   r.item_id,
                'kind',      r.kind,
                'unit_slug', r.unit_slug,
                'grade',     r.grade,
                'box',       r.box,
                'due_at',    r.due_at,
                'last_tier', r.last_tier,
                'reps',      r.reps,
                'lapses',    r.lapses)
              ORDER BY r.due_at)
         FROM domigo_v2.review_queue r
        WHERE r.user_id = u.id),
      '[]'::jsonb)                                               AS leitner,
    -- SUMMEN ueber das Versuchs-Ledger, nie die Einzelversuche: die bleiben stehen.
    -- Eine Aggregat-Abfrage ueber null Zeilen liefert trotzdem eine Zeile (total = 0).
    (SELECT jsonb_build_object(
              'total',          count(*),
              'correct',        count(*) FILTER (WHERE a.correct),
              'distinct_items', count(DISTINCT a.item_id),
              'first_at',       min(a.created_at),
              'last_at',        max(a.created_at))
       FROM domigo_v2.practice_attempts a
      WHERE a.user_id = u.id)                                    AS attempts_summary,
    -- Abgeschlossene Lernpfad-Knoten.
    (SELECT count(*)::int
       FROM domigo_v2.study_path_progress s
      WHERE s.user_id = u.id)                                    AS study_path_done
  FROM public.users u
  LEFT JOIN public.classes c ON c.id = u.class_id
  WHERE u.role = 'student'
  RETURNING 1
)
SELECT count(*)::int AS eingefuegte_zeilen FROM eingefuegt;
```

**Erwartet:** `eingefuegte_zeilen` = `schueler_v1` aus Schritt 2.
**STOPP** bei jeder anderen Zahl — und bei Fehler **23505** ebenfalls: der heisst,
dass für dieses Etikett schon ein Schnappschuss steht (dann Schritt 5, dann neu).

---

## Schritt 4 — Nachher-Verifikation · *Neon SQL Editor* · **lesend**

```sql
-- [R4] Nachher-Verifikation. Ausschliesslich Zaehlwerte.
SELECT
  -- Formel: Zeilen des Etiketts. Muss schueler_v1 aus Schritt 2 sein.
  (SELECT count(*)::int FROM domigo_v2.rollover_snapshots WHERE label = '2025-26')      AS zeilen,
  -- Formel: dieselbe Quelle noch einmal gezaehlt - die Gegenprobe.
  (SELECT count(*)::int FROM public.users WHERE role = 'student')                       AS erwartet,
  -- Formel: Zeilen mit mindestens einer Karteikasten-Karte.
  (SELECT count(*)::int FROM domigo_v2.rollover_snapshots
     WHERE label = '2025-26' AND jsonb_array_length(leitner) > 0)                       AS mit_karteikasten,
  -- Formel: Zeilen, die einen v2-Fortschritt mitbekommen haben.
  (SELECT count(*)::int FROM domigo_v2.rollover_snapshots
     WHERE label = '2025-26' AND v2_progress IS NOT NULL)                               AS mit_v2_fortschritt,
  -- Formel: Summe der Versuchs-Zaehler IM Schnappschuss ...
  (SELECT COALESCE(sum((attempts_summary->>'total')::int), 0)::int
     FROM domigo_v2.rollover_snapshots WHERE label = '2025-26')                         AS versuche_im_schnappschuss,
  -- ... gegen dieselbe Summe IM Ledger. Beide muessen gleich sein.
  (SELECT count(*)::int FROM domigo_v2.practice_attempts a
     WHERE EXISTS (SELECT 1 FROM public.users u WHERE u.id = a.user_id AND u.role = 'student'))
                                                                                        AS versuche_im_ledger,
  -- Formel: Zeilen ohne aufgeloesten Klassennamen (muss ohne_klassenname aus Schritt 2 sein).
  (SELECT count(*)::int FROM domigo_v2.rollover_snapshots
     WHERE label = '2025-26' AND class_name IS NULL)                                    AS ohne_klassenname,
  -- Formel: Zeilen ohne Karteikasten-Feld ueberhaupt. MUSS 0 sein (coalesce in Schritt 3).
  (SELECT count(*)::int FROM domigo_v2.rollover_snapshots
     WHERE label = '2025-26' AND leitner IS NULL)                                       AS leitner_null;
```

**Erwartet:** `zeilen = erwartet` · `versuche_im_schnappschuss = versuche_im_ledger` ·
`ohne_klassenname` = die Zahl aus Schritt 2 · **`leitner_null = 0`**.
**STOPP** bei jeder Abweichung — dann Schritt 5 und Ursache suchen.

**Fertig** = Schritt 4 stimmt in allen vier Punkten. Der Lernstand aller
Bestandsschüler liegt damit dauerhaft in `domigo_v2.rollover_snapshots`, und das
Schuljahr darf mit leeren Klassen beginnen.

---

## Schritt 5 — Rückweg (nur wenn etwas nicht stimmt) · *Neon SQL Editor*

Löscht **nur die Zeilen dieses Etiketts**. Die Tabelle selbst bleibt stehen —
sie ist Teil des Schemas, nicht des Laufs.

```sql
-- [R5] Rueckweg. Loescht nur das Etikett, nie die Tabelle.
WITH geloescht AS (
  DELETE FROM domigo_v2.rollover_snapshots WHERE label = '2025-26' RETURNING 1
)
SELECT count(*)::int AS geloeschte_zeilen FROM geloescht;
```

**Erwartet:** dieselbe Zahl, die Schritt 3 eingefügt hat. Danach darf Schritt 3
erneut laufen.

---

## Probelauf (schon geführt)

`packages/db/scripts/snapshot-dev-proof.mjs` fährt **genau diese Blöcke** — es
liest sie aus **dieser Datei** und führt sie am Entwicklungs-Zweig aus (harte
Host-Sperre auf `ep-dry-sound-alj0davj`; gegen die Produktion kann das Skript
nicht laufen). Es prüft zusätzlich, dass die Blöcke `[R1a]`–`[R1c]` byte-gleich
mit der Migrationsdatei sind, spielt den Rückweg, fügt erneut ein und weist nach,
dass ein zweiter Lauf desselben Etiketts mit **23505** abprallt.

```bash
node packages/db/scripts/snapshot-dev-proof.mjs
```
