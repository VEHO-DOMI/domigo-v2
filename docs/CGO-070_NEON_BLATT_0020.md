# CODEX DRAFT — NOT CANON · Migration 0020

Status: **vorbereitet, nicht angewandt**. Nur Koki führt die Änderung im Neon-
SQL-Editor aus; danach darf GG-DomiGo den geprüften PR mergen. Keine Sitzung
führt diese Datei oder die Kontrollabfragen gegen Neon aus.

## Ziel

- Projekt: **domigo-db**
- Zweig: **main** (Produktion, nicht `v2-dev`)
- Datenbank: **neondb**
- Schema: **domigo_v2**

Diese Bezeichnungen stammen aus `docs/runbooks/deploy.md`, Schritt 4. Der aktuelle
Neon-Zustand ist **UNVERIFIZIERT**. Keine Verbindung, kein Kennwort und keine
Variablenwerte sind Bestandteil dieses Blatts.

## Änderung

Datei: `packages/db/drizzle/0020_story_world_settings.sql`.
Nächste freie Nummer nach Eintrag 19 in `packages/db/drizzle/meta/_journal.json`.
Eine neue Tabelle mit höchstens vier Zeilen, eine je Jahrgang:

| Spalte | Inhalt |
|---|---|
| grade | Jahrgang 1–4, eindeutiger Schlüssel, Zahlenbereich geprüft |
| is_open | offen oder geparkt |
| updated_at | Zeitpunkt der letzten Änderung |

Nur `CREATE TABLE`, keine Änderung bestehender Tabellen, keine Personennamen,
keine Personen- oder Klassenkennungen, keine Startzeilen. Ohne Eintrag greift
die bestehende Story-Freigabedatei im Korpus: Jahrgang 1 geparkt, 2–4 unverändert.
Spielstände, Versuche und Lernfortschritt bleiben unberührt.

## Anwendung durch Koki vor dem Merge

1. In Neon **domigo-db → SQL Editor** öffnen. **main / neondb** sichtbar prüfen.
2. Nur die Existenz der neuen Tabelle prüfen (keine Kinderdaten):

   ```sql
   SELECT to_regclass('domigo_v2.story_world_settings') AS existing_table;
   ```

   Erwartung vor der Erstanwendung: `NULL`. Bei bereits vorhandenem Objekt nicht
   nochmals ausführen; GG prüft zuerst dessen Struktur. Ein absichtlich lauter
   Fehler beim zweiten Lauf verhindert, dass eine falsche Altstruktur still gilt.
3. Die vollständige SQL-Datei `0020_story_world_settings.sql` im Editor ausführen.
   Keine anderen Migrationen aus einem Sammellauf starten.
4. Nur Struktur und Anzahl kontrollieren:

   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_schema = 'domigo_v2' AND table_name = 'story_world_settings'
   ORDER BY ordinal_position;

   SELECT count(*) AS settings_count FROM domigo_v2.story_world_settings;
   ```

   Erwartung: genau drei Spalten wie oben, alle `NOT NULL`; zunächst `0` Zeilen.
5. Ergebnis an GG-DomiGo geben. Erst danach folgen dessen Prüfung und Merge.

## Rücknahme ohne Datenverlust

Im Lehrer-Admin den betroffenen Jahrgang auf **Park** oder **Open** setzen.
Das ändert nur seine Sichtbarkeit. Tabelle und Spielstände werden nicht gelöscht.
Ein Zurücksetzen aller Einstellungen auf Dateivorgaben ist bewusst kein neuer
Bedienweg dieser Karte.

## Betriebsgrenzen

- Schreiben: echte Lehrkraftsitzung und mindestens eine aktive Klasse des
  Zieljahrgangs im bestätigten Klassen-Ausschnitt. Der Verwaltungszugang erhält
  seinen Ausschnitt weiterhin aus der bestehenden Identitätsfunktion.
- Wirkung: für alle Klassen des Jahrgangs, ab der nächsten Server-Anfrage.
  Bereits offene Spiele werden nicht während einer Runde beendet.
- Bei fehlender Tabelle oder Lesefehler gelten die Dateivorgaben. Die Admin-
  Oberfläche meldet dies und deaktiviert den Schalter. Ein Schreibfehler liefert
  HTTP 503 und meldet keinen Erfolg. Während eines Lesefehlers kann deshalb ein
  zuvor geparkter Jahrgang 2–4 nach Dateivorgabe wieder sichtbar sein.
- Im offenen Jahrgang erreichen Kinder ihrer eigenen Stufe die fertigen
  Buchkapitel. Entwurfskapitel bleiben in jeder Umgebung Lehrkräften vorbehalten.
  GG prüft den Kinderdurchlauf vor dem Merge unabhängig.
