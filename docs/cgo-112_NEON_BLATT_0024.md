# CODEX DRAFT — NOT CANON · cgo-112 · Neon-Blatt 0024

**IN PRÜFUNG — nicht angewendet, nicht LIVE.** Basis: PR 510, `3600a6a9eb7dccfb9598e9e1fe64cfd2439412ba` (W1–W4). Eine additive Migration, also ausschließlich eine zusätzliche Datenbankstruktur: [0024_word_duels.sql](../packages/db/drizzle/0024_word_duels.sql). Journal und Snapshot wurden lokal mit `drizzle-kit generate --name=word_duels` erzeugt. Anwendung nur durch Koki über die freigegebene Chrome-Karte, nach 0022/0023. Codex hat keine Verbindung zu Neon hergestellt und keine Migration gegen Neon ausgeführt.

## Umfang und Freigabe

Eine Tabelle `domigo_v2.duels`, ohne Namen oder fremde Klassenfreigabe. Spalten: `id`, `class_id`, `grade`, `p1`, `p2`, `mode`, `status`, `rounds`, `p1_score`, `p2_score`, `winner`, `created_at`, `updated_at`. Vier Indizes: Klasse/Status, Teilnehmer 1, Teilnehmer 2 und ein eindeutiges aktives Paar unabhängig von der Reihenfolge der Teilnehmer. Prüfbedingungen begrenzen Jahrgang, Modus, Status, verschiedene Teilnehmer, Scores 0–15, Sieger und höchstens fünf Runden. Keine Änderung an vorhandenen Tabellen, keine zweite Migration, keine Statistik-Spalten, keine Fremdschlüssel.

`rounds` enthält je Runde den Chapter-Schlüssel, drei Aufgabenkennungen mit je vier Optionen und je Teilnehmer nur eine Folge von richtig/falsch. Der Antwortschlüssel bleibt im Aufgabenbestand. Angezeigte Namen werden ausschließlich aus den derzeit angemeldeten Teilnehmern der eigenen Klasse abgeleitet, nach der bestehenden Regel erster Vorname plus Spitzname. Die Auswahl verwendet laufende Nummern und einen Bestands-Fingerabdruck; verschiebt sich die Liste, muss das Kind neu laden. Nutzer-UUIDs stehen nicht in der Gegnerliste.

Arena-Zugang folgt ausschließlich dem bestehenden Klassen-Bestenlisten-Schalter A. Beide Kinder müssen angemeldet, aktuell derselben Klasse und demselben Jahrgang zugeordnet sein; Testklassen und archivierte Klassen sind ausgeschlossen. Ein breiterer Klassen-Ausschnitt erlaubt kein Duell außerhalb der eigenen Klasse. Keine neue Lehrer-Einstellung, Großmeister-Fremdansicht bleibt lesend.

## Anwendung durch Koki

1. Freigabe und Anwendung von 0022/0023 bestätigen. Im Neon-SQL-Editor das bekannte Projekt und den freigegebenen Branch wählen; keine Verbindungswerte kopieren.
2. Den vollständigen Inhalt von `packages/db/drizzle/0024_word_duels.sql` aus diesem PR ausführen. Die Datei ist additiv, aber absichtlich nicht wiederholt ausführbar: bei bereits vorhandener Tabelle nicht erneut anwenden.
3. Nur Struktur und Zahlen prüfen, keine Kinderzeilen abfragen:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'domigo_v2' AND table_name = 'duels';
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'domigo_v2' AND table_name = 'duels'
ORDER BY ordinal_position;
SELECT indexname FROM pg_indexes
WHERE schemaname = 'domigo_v2' AND tablename = 'duels'
ORDER BY indexname;
```

Erwartung: eine Tabelle, 13 Spalten, fünf Indexeinträge einschließlich Primärschlüssel. Anwendung/Uhrzeit und Strukturbeleg an GG-DomiGo zurückgeben. Kein `DROP`, keine Bestandsänderung und keine Löschung zum Testen.

## Verhalten vor Anwendung und bei Fehlern

Fehlt 0024, zeigt `/arena` „Die Battle Arena ist gerade nicht erreichbar.“ (Jahrgang 1; Englisch in 2–4), ohne Teilnehmerliste oder Fehlerdetails. Schreibanfragen scheitern mit 503 und ohne bestätigte Punkte. Ohne Schalter A fehlt die Home-Karte, und der direkte Arena-Aufruf zeigt einen ruhigen Hinweis. Die Datenschutzseite bleibt eingefroren; der GG trägt ihre notwendige Produktfreigabe separat weiter.

Kontolöschung entfernt die gesamte Partie, wenn das gelöschte Kind Teilnehmer 1 oder 2 ist. Ausschließlich PostgreSQL-Fehler `42P01` (Tabelle noch nicht vorhanden) wird für `duels` toleriert; andere Fehler bleiben Fehler. Der bereits vorhandene Löschweg entfernt außerdem die eigenen Lernversuche. Kein zusätzlicher Löschweg und keine laufende Löschung durch diese Sitzung. Alle Spalten stehen im Datenschutzregister, alle Klassenabfragen im Claim-Filter-Register.

## Genau eine bewertete Antwort

Die Antwort läuft über `/api/attempts` mit `mode: duel:<id>` und `context: {duelId, round, question}`. Die Route prüft Anmeldung, gleichen Ursprung, Teilnehmer, aktive Partie, offene Frage, gewählte Option, Jahrgang und Klassenreserve vor der Bewertung. Die Bewertung verwendet die gemeinsame Vokabelbewertung mit dem Übersetzungspool Deutsch→Englisch.

Beim Schreiben sperrt der Dienst die Partie kurz für parallele Züge und prüft erneut. Der vorhandene `recordAttempt` schreibt Lernversuch, Wiederholung und Lernpunkte innerhalb derselben Transaktion wie das richtig/falsch-Ergebnis. Eine Transaktion speichert alles gemeinsam oder nimmt alle Änderungen zurück. Ein Wiederholungsversuch — auch mit neuer Versandkennung — erhält 409. Abgelaufen ergibt 410, fremder Teilnehmer oder fremde Klasse 403. Ein schon anderswo verwendeter Versuchsschlüssel kann keine Duellfrage fortschalten.

Dafür verwendet die bereits installierte Neon-Serverless-Bibliothek eine kurze, an die Anfrage gebundene Verbindung mit anschließender Schließung. Die übrigen Datenbankleser bleiben unverändert. Keine zusätzliche Infrastruktur oder Bibliothek. Die echte Neon-Verbindung ist **UNVERIFIZIERT**; lokal wurden derselbe Dienst und derselbe vorhandene Lernversuch-Schreiber gegen PostgreSQL im Arbeitsspeicher (PGlite) ausgeführt, einschließlich Rollback nach absichtlich ausgelöstem Fehler.

## Original und bewusste Entscheidungen

Belege: `docs/handover/design-study-og-trainers.md` §5b/5d und Original `og/4th/index.html` im lesenden Labor cgo-106, Funktionen `getWhoseTurn`, `showDuelUnitPicker`, `renderScoreboard`, `generateDuelQuestions`, `finishDuelTurn`. Originalansicht und Entscheidungen stehen im externen Belegordner `SEHEN-W5.md`.

- Fünf Runden mit je drei Fragen nach Kartenbrief. Der aktuelle Original-Code erzeugt tatsächlich fünf Fragen; diese Abweichung ist ausdrücklich dokumentiert. Höchstscore hier 15.
- Chapter-Wahl wechselt zwischen den Teilnehmern; zuerst offene Fragen beantworten. Fünf verschiedene Chapters, vier Optionen aus dem vorhandenen Aufgabenbestand, deterministische Auswahl, keine neuen Aufgaben.
- Nur Vokabelduelle in W5. Grammatik-Duell ist benannt verschoben und erhält keine tote Auswahl.
- Sieben Tage ohne Zug: abgelaufen, kein Sieger. Lesen verlängert die Frist nicht. Abgelaufene Partien zählen nicht als abgeschlossener Sieg/gespielter Abschluss; Punkte schon bewerteter Antworten bleiben erhalten.
- Kein Zeitlimit bei asynchronen Fragen; Fortschrittsanzeige statt Original-Timer. Unterbrochene Fragen bleiben offen, beantwortete Fragen werden nicht erneut gewertet.
- Keine Original-Boni 100/50/25 und kein Zusatz `8 × richtig`. XP entstehen ausschließlich durch Englisch-Antworten. Sieg, Played und Win rate sind abgeleitete Statistiken, ohne zusätzlichen Schreiber. Verlauf: letzte 20 beendete/abgelaufene Partien; Gesamtstatistik über alle eigenen sichtbaren Partien, XP ausschließlich aus eigenen Duell-Lernversuchen der aktuellen Klasse.
- Live Battle und Class Quiz bleiben außerhalb W5 (Ruling cgo-120); die Kinderoberfläche nennt sie nicht.

## Verifikation und verbleibende Abnahme

Lokale Verhaltenstests prüfen die echte Migration im Arbeitsspeicher, Paar-Eindeutigkeit, Klassengrenze, Platzhalterfilter, Reserve, Jahrgang, Zugfolge, doppelte/parallele Antwort, Transaktions-Rücknahme, Ablauf, 30-Antworten-Abschluss, Verlauf/Statistik und Löschweg. Web-Tests prüfen die realen Routen, Vorschau und Darstellung. Exakte Zahlen, rote Manipulationsproben, Bild-/Netzbelege und Exit-Codes stehen im PR-Bericht außerhalb des Repos.

Offen bis GG/Koki: Anwendung von 0024 in Neon, produktive Verbindungs-/Anmeldeprüfung, GG-Merge-Kette und endgültige Original-/Produktabnahme. Codex öffnet den PR gegen `main`, führt keinen Merge durch.

**Freigabehindernis im lokalen Gesamttest:** Der bestehende Test `packages/db/src/claim-filter-laufzeit.test.ts` erlaubt für die Kontolöschung noch nicht die neuen Teilnehmer-Spalten `p1` und `p2`. Diese Testdatei liegt außerhalb des Karten-Zauns und bleibt unverändert. Die genaue Ein-Zeilen-Ergänzung liegt als `GG-claim-filter.patch` im externen Belegordner. Mit ausschließlich dieser Ergänzung im Arbeitsspeicher bestehen alle 40 Tests der Datei; der unveränderte Gesamttest bleibt ausdrücklich rot. Die neuen PGlite-Tests belegen die Löschung beider Teilnehmer-Richtungen und den Erhalt fremder Partien. Freigabe erst nach der GG-Ergänzung und erneut grüner Batterie.
