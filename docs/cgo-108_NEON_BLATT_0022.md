# cgo-108 · Neon-Blatt 0022 · Avatar-Einstellung

CODEX DRAFT — NOT CANON. Keine Datenbank wurde durch diese Sitzung verändert.

Migration bedeutet hier: eine neue Tabelle ergänzen. Die Konto-Spiegeltabellen bleiben unverändert. Der GG legt Kokis Chrome-Karte an; nur dort wird die freigegebene Migration ausgeführt.

## Reihenfolge und Zusammenführung

Basis dieses PR: `1197a30bc9a4f4814b47285af9a53c695db4bb46`, Journal 0000–0019. 0020 (PR 490) und 0021 (PR 498) waren beim Boot noch offen. Deshalb enthält dieser PR ausschließlich den eigenen Journal-Eintrag 22 und einen Snapshot auf Basis 0019. **Vor Anwendung vereinigt der GG die Einträge 20, 21, 22 in dieser Reihenfolge und erzeugt den kumulativen Snapshot 0022 auf dem integrierten Schema neu.** Keine fremde Migration wird hier vorweggenommen. GG-Nachtrag 1 auf cgo-108 bestätigt die gemeinsame Anwendung.

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

`deleteUserData` entfernt die Avatar-Zeile vor der Identität; der GG hat genau diese Erweiterung in Nachtrag 1 freigegeben. Ein entfernter Löschaufruf muss den Verhaltenstest rot machen. Bei fehlender Tabelle bleibt der bisherige Löschvertrag streng: Fehler und Wiederholung durch konto statt eines falschen Erfolgs. Daher Migration vor Auslieferung anwenden.

Die Avatar-Nummer beschreibt nur ein festes Bild. Die Konto-ID ist eine personenbezogene Kennung und steht im Datenschutz-Spaltenregister. Keine Uploads, Namenkopien oder neuen Tracking-Daten.

## Rückweg

Kein DROP und kein Datenlöschen durch Codex. Bei Fehlern den neuen Schreibweg durch Rücknahme des PR stilllegen; die additive Tabelle bleibt zunächst bestehen. Ein späteres Löschen bedarf einer eigenen Freigabe.
