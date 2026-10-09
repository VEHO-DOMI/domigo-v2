# cgo-111 · Neon-Blatt 0023 · Bestenlisten-Freigaben

CODEX DRAFT — NOT CANON. Diese Sitzung wendet keine Migration auf Neon an.

Migration bedeutet hier: zwei Einstellungsspalten ergänzen. Basis ist PR 509 (`49eec3ebd2b5ea758f4afaef057555481424aa3f`), gestapelt auf W1–W3. Journal und Snapshot folgen auf 0022; `drizzle-kit generate` hat 0023 erzeugt. Nur Koki wendet die freigegebene Datei über seine Chrome-Karte an. Die eingefrorene Datenschutzseite wird durch den GG separat aktualisiert; bis dahin bleibt die Bestenliste ausgeschaltet.

## Vorprüfung: nur Struktur

```sql
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'domigo_v2'
  AND table_name IN ('class_settings', 'student_profile')
ORDER BY table_name, ordinal_position;
```

Erwartet: `class_settings` aus 0021 und `student_profile` aus 0022 vorhanden. Die beiden neuen Spalten fehlen oder entsprechen bereits exakt der Nachprüfung. Bei abweichender Struktur stoppen und den GG informieren. Keine Kinder- oder Klassenzeilen abfragen.

## Anzuwendende Datei

[`packages/db/drizzle/0023_class_leaderboard.sql`](../packages/db/drizzle/0023_class_leaderboard.sql):

```sql
ALTER TABLE "domigo_v2"."class_settings" ADD COLUMN IF NOT EXISTS "leaderboard" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "domigo_v2"."class_settings" ADD COLUMN IF NOT EXISTS "grade_board_opt_in" boolean DEFAULT false NOT NULL;
```

Beide Werte sind `boolean NOT NULL DEFAULT false`. `leaderboard` erlaubt A (eigene Klasse); `grade_board_opt_in` erlaubt B (gemeinsame Jahrgangsansicht) nur zusammen mit A. `IF NOT EXISTS` macht Wiederholung möglich, repariert aber keine abweichenden vorhandenen Spalten. Kein UPDATE, keine neue Tabelle, keine Änderung an Konto-Spiegeltabellen.

## Nachprüfung: nur Struktur

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'domigo_v2' AND table_name = 'class_settings'
  AND column_name IN ('leaderboard', 'grade_board_opt_in')
ORDER BY column_name;
```

Erwartet: genau zwei Zeilen, jeweils `boolean`, `NO`, `false`. Danach bestätigt der GG mit ausdrücklich freigegebenen Testkonten, dass A und B erst nach Lehrkraft-Freigabe sichtbar werden; B benötigt vor dem Einschalten den Bestätigungsdialog. Das Ausschalten von A setzt auch B auf aus. Testklassen und archivierte Klassen bleiben ausgeschlossen. Der Schreibweg prüft Klassenanspruch, Besitz und reguläre aktive Klasse in einer SQL-Anweisung; der Großmeister darf ausschließlich den Besitz innerhalb seines eigenen Sitzungsanspruchs übergehen.

## Ohne Migration, Protokoll und Löschweg

Fehlende Spalten oder fehlende Lesbarkeit ergeben beide Freigaben aus, ohne Identitäten oder Fehlerdetails zu protokollieren. Ein gescheiterter Schreibversuch wird als nicht gespeichert gemeldet. Der bestehende Testklassen-Schalter verwendet weiterhin ausschließlich die drei Spalten aus 0021 und bleibt vor 0023 schreibbar. Dafür beschreibt der Dienst eine Drei-Spalten-Projektion derselben bestehenden Tabelle; es wird keine weitere Tabelle angelegt. 0023 vor dem produktiven Merge anwenden.

Eine erfolgreiche Freigabe schreibt die Server-Journalzeile `[class-leaderboard] settings_saved` mit ausschließlich den zwei booleschen Einstellungen. Sie enthält keine Namen, Kontokennungen oder Klassenkennungen. Sie erweitert nicht das personenbezogene Roster-Journal.

Die beiden Spalten stehen im Datenschutz-Spaltenregister als Einstellungen der Lehrkraft, keine Kinderdaten. Bestandsprüfung: `konto-loeschung.ts` löscht Personen und ihre Lern-/Profildaten, nicht Klassen. `class-service.ts` archiviert Klassen; ein hartes Löschen von `class_settings` ist im geprüften Bestand nicht implementiert, obwohl das frühere Neon-Blatt „mit der Klasse“ als Löschweg nennt. Das ist ein an den GG gemeldeter Bestandsbefund. W4 fügt keine personenbezogene Tabelle hinzu und ändert diesen Weg nicht; archivierte Klassen sind durch beide Abfragegrenzen ausgeschlossen. `konto-loeschung.ts` bleibt bytegleich. Schüler-Anfragen können keinen fremden Klassenparameter wählen. Die Vorschau verwendet fünf feste Beispielzeilen und ruft den Kinderdienst nicht auf.

Kein DROP durch Codex. Bei Rücknahme des PR bleiben die additiven Spalten zunächst erhalten; ihre Entfernung braucht eine eigene Freigabe.
