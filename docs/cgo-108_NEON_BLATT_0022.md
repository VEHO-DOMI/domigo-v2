# cgo-108 · Neon-Blatt 0022 · Avatar-Einstellung

CODEX DRAFT — NOT CANON. Keine Datenbank wurde durch diese Sitzung verändert.

Migration bedeutet hier: eine neue Tabelle ergänzen. Die Konto-Spiegeltabellen bleiben unverändert. Der GG legt Kokis Chrome-Karte an; nur dort wird die freigegebene Migration ausgeführt.

## Reihenfolge und Zusammenführung

Boot-Basis dieses PR: `1197a30bc9a4f4814b47285af9a53c695db4bb46`. Nachzug 2 integriert `origin/main` (`8c8acd81`) einschließlich PR 490/498 durch einen Merge. Das Journal enthält jetzt 0000–0022 lückenlos; 0019, 0020 (Story-Einstellungen), 0021 (Klassen-Einstellungen), 0022 (Avatar) stehen in dieser Reihenfolge. Snapshot 0022 wurde aus dem integrierten Schema neu erzeugt und setzt Snapshot 0021 fort. Ein erneutes lokales `drizzle-kit generate` muss „No schema changes“ melden. Keine Migration wurde gegen Neon ausgeführt.

## Anzuwendende Datei

[`packages/db/drizzle/0022_student_profile.sql`](../packages/db/drizzle/0022_student_profile.sql) legt ausschließlich `domigo_v2.student_profile` an:

| Spalte | Vertrag |
|---|---|
| user_id | UUID, Primärschlüssel; genau eine Einstellung je Kinderkonto |
| avatar | smallint, erforderlich; CHECK 1 bis 50 |
| updated_at | Zeitpunkt mit Zeitzone; Standard now() |

Keine Fremdschlüssel, keine Änderungen an `users`, keine Datenübernahme, kein UPDATE/DELETE. `IF NOT EXISTS` erlaubt Wiederholung; es repariert kein abweichendes Bestandsschema. Bei abweichendem Schema stoppen und den GG informieren.

## Vorher / nachher prüfen (nur Struktur, keine Kinderzeilen)

```sql
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'domigo_v2' AND table_name = 'student_profile'
ORDER BY ordinal_position;

SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = to_regclass('domigo_v2.student_profile');
```

Vorher: keine Tabelle. Nachher: genau drei Spalten, Primärschlüssel auf user_id, CHECK avatar 1–50. Keine Kinder-/Klassennamen lesen. Im lokalen Test sind 0, 51, Bruchzahlen und fremde Konten abgewiesen; nach Anwendung bestätigt der GG die Persistenz mit einem ausdrücklich freigegebenen Testkonto.

## Verhalten und Löschweg

Ohne Tabelle bleibt die Darstellung lesbar: IDs der eigenen Klasse werden nach Erstellzeit und ID geordnet und erhalten den ersten freien Avatar. Ein Seitenaufruf schreibt nichts. Nur die eigene Avatar-Wahl schreibt über einen durch Klassenanspruch, Konto-ID und Schülerrolle begrenzten Insert/Update. Vor Migration meldet eine Wahl ehrlich „nicht gespeichert“.

`deleteUserData` entfernt die Avatar-Zeile nach allen Pflichttabellen und vor der Identität. Fehlt ausschließlich diese optionale Tabelle (PostgreSQL-Code `42P01`, auch in einer umschließenden Fehlerursache), wird `student_profile: 0` protokolliert und die fehlende Relation ausdrücklich im Löschjournal benannt; die Kontolöschung läuft weiter. Andere Fehler und fehlende Pflichttabellen bleiben Fehler und lösen die Wiederholung durch konto aus. Verhaltenstests und absichtliche Fehlerproben sichern Reihenfolge, Ausnahme und Journal. Nachzug 2 des GG autorisiert diesen Rückfall vor Migration.

Die Avatar-Nummer beschreibt nur ein festes Bild. Die Konto-ID ist eine personenbezogene Kennung und steht im Datenschutz-Spaltenregister. Keine Uploads, Namenkopien oder neuen Tracking-Daten.

## Rückweg

Kein DROP und kein Datenlöschen durch Codex. Bei Fehlern den neuen Schreibweg durch Rücknahme des PR stilllegen; die additive Tabelle bleibt zunächst bestehen. Ein späteres Löschen bedarf einer eigenen Freigabe.
