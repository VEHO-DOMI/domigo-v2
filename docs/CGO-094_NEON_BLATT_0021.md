# CODEX DRAFT — NOT CANON · Migration 0021

Status: vorbereitet, nicht angewandt. **Nur Koki** führt diese Änderung per Chrome-Karte im Neon-SQL-Editor aus. Kein Sammellauf, kein `db:push`. Der GG prüft und mergt danach.

## Ziel und Reihenfolge

Laut `docs/runbooks/deploy.md`: Projekt **domigo-db**, Zweig **main**, Datenbank **neondb**, Schema **domigo_v2**. Live-Zustand UNVERIFIZIERT; hier wurde keine Verbindung zu Neon aufgebaut.

`0021_class_settings.sql` ist unabhängig von Migration 0020 (Story-Welten, PR 490). 0020 war beim Start noch nicht gemergt. Deshalb reserviert das Journal **idx 21**, ohne eine fremde idx-20-Datei oder einen Platzhalter anzulegen. Der Snapshot 0021 basiert auf dem vorhandenen Snapshot 0019 und ergänzt nur `class_settings`. Beim Zusammenführen mit PR 490 muss der GG beide Journaleinträge in Reihenfolge 19,20,21 erhalten und den jüngsten Snapshot um die dann vorhandene Story-Tabelle ergänzen. Keine der beiden SQL-Dateien verändert die andere Tabelle. `when` von 0021 liegt nach dem dokumentierten 0020-Eintrag (1791399857865).

## Änderung

Eigene Tabelle mit `class_id` (UUID, Primärschlüssel), `purpose` (`regular` oder `test`, Vorgabe `regular`) und `updated_at`. Keine Namen, keine Startzeilen, kein Eingriff in `classes`, Versuche, XP oder Jahresdaten. Kein Fremdschlüssel zum Konto-Spiegel; Zuordnung und Besitz prüft der Schreibdienst.

1. Vorher ausschließlich das Objekt prüfen:

```sql
SELECT to_regclass('domigo_v2.class_settings') AS existing_table;
```

2. Genau dieses SQL aus `packages/db/drizzle/0021_class_settings.sql` ausführen:

```sql
-- cgo-094 · Additive, independent of 0020_story_world_settings (PR 490).
-- Koki applies this file via the Neon SQL editor. No seed rows, no class changes.
CREATE TABLE IF NOT EXISTS "domigo_v2"."class_settings" (
  "class_id" uuid PRIMARY KEY NOT NULL,
  "purpose" text DEFAULT 'regular' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "class_settings_purpose_check" CHECK ("purpose" IN ('regular', 'test'))
);

```

`IF NOT EXISTS` macht einen Wiederholungslauf unschädlich, bestätigt aber nicht die Struktur einer schon vorhandenen Tabelle. Deshalb die nächste Prüfung auch dann ausführen.

3. Struktur prüfen, ohne Klassen- oder Schülerdaten zu lesen:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'domigo_v2' AND table_name = 'class_settings'
ORDER BY ordinal_position;

SELECT constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'domigo_v2' AND table_name = 'class_settings';

SELECT pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'domigo_v2.class_settings'::regclass;

SELECT count(*) AS settings_count FROM domigo_v2.class_settings;
```

Erwartung: drei Spalten, alle `NOT NULL`; UUID-Schlüssel, Textvorgabe `regular`, Zeitvorgabe `now()`, Primärschlüssel und CHECK nur für `regular`/`test`. Beim ersten Lauf 0 Einstellungen. Abweichung an GG melden; nicht löschen oder überschreiben.

## Rückweg

Im Admin unter **Klassenübersicht und Archiv → Testklasse: Aus** die betroffene Einstellung zurücksetzen. Das schreibt `regular`; Tabelle, Klassenzuordnung und Lernstand bleiben erhalten. Bei Code-Rücknahme ignoriert die vorherige Version die separate Tabelle. Keine Löschung erforderlich.

## Verhalten vor Migration und bei Ausfall

Fehlende Zeilen sind `regular`. Ist die Tabelle nicht lesbar, behandelt der Leser alle erlaubten Klassen wie bisher als `regular`; die Startseite zeigt deshalb keinen Fehler. Das ist der ausdrücklich verlangte **Kompatibilitätsrückfall**, kein statistisches Fail-closed: bei einem späteren Leseausfall können Testklassen vorübergehend wieder mitzählen. Berechtigungen bleiben geschlossen. Ein Schreibfehler liefert 503 und die Bedienung zeigt **Nicht gespeichert**; es gibt keinen vorgetäuschten Erfolg.

Markierung wirkt ab der nächsten Seitenabfrage. Großmeister-Summen und der öffentliche Mastery-Leser schließen Testklassen aus; einzelne Klassenkarten und die eigene Klassenwand behalten ihre Werte. Keine Rangliste gebaut; ihr künftiger Ausschluss ist im Dienst vorgemerkt. Die sichtbare Kennzeichnung direkt auf der Klassenwand bleibt im GG-Handoff, weil deren Datei nicht im freigegebenen Zaun liegt.
