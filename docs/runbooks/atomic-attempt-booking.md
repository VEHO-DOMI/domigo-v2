# Vollständige Buchung gewöhnlicher Lernversuche (cgo-154)

## Vertrag und gewählter Weg

Ein erfolgreich bestätigter Lernversuch umfasst Versuchszeile, gegebenenfalls
Wiederholungsqueue, Punkte und Tagesserie. Eine positive Quittung bestätigt das
Gesamte. `tier` und `xpAwarded` allein beschreiben weiterhin die Antwortbewertung;
sie sind bei `ok: false` keine Buchungsbestätigung.

Gewählt ist **Weg B mit `booked_at`**. Migration 0027 ergänzt eine nullable
Abschlussmarke und `domigo_v2.book_http_attempt`. Der bestehende HTTP-Treiber ruft
diese PostgreSQL-Funktion mit genau einer Anweisung auf. PostgreSQL führt ihre
Schreibschritte in derselben Transaktion aus: Versuch einfügen, Wiederholungsqueue
aktualisieren, Fälligkeit setzen, Fortschritt erhöhen, Abschlussmarke zuletzt
setzen. Jede Ausnahme rollt alle Änderungen dieser Anweisung zurück. Eine
interaktive Transaktion oder neue WebSocket-Verbindung ist nicht erforderlich.
Die reine Abschlussmarke ohne diese gemeinsame Transaktion wäre nicht ausreichend.

`recordHttpAttempt` übergibt Identität, erlaubte Klasse, serverseitige Bewertung,
Wiederholungsregel und Wiener Tagesgrenzen. Es übernimmt keine Abschlussmarke aus
Clientdaten. Die Funktion ist `SECURITY INVOKER` mit festem Suchpfad: Sie erhält
keine höheren Rechte als die aufrufende Datenbankrolle. Browser können sie nicht
direkt aufrufen. Duell und Live behalten ihre bestehenden Transaktionen und
Abschlussboni; ihre Zeilen benötigen diese Quittung nicht.

## Wiederholung und Altbestand

Die vorhandene Eindeutigkeit `(user_id, client_attempt_id)` serialisiert dieselbe
Antwort auch bei konkurrierenden Wiederholungen. Eine bereits markierte Zeile
liefert ihre gespeicherte Bewertung und Punktzahl; eine erneute Antwortbewertung
überschreibt sie nicht. Klasse, Aufgabe, Modus, Aufgabenart, Chapter und Jahrgang
müssen mit der ursprünglichen Identität übereinstimmen. Unterschiedliche Antworten
erhöhen Punkte und Wiederholungszahl jeweils einmal. Die SQL-Umsetzung der
Fünf-Boxen-Regel und Tagesserie wird gegen die bestehenden reinen Funktionen geprüft.

**Alte Zeilen bleiben unverändert und unmarkiert.** Sie können vollständig oder
teilweise gebucht worden sein; die vorhandenen Gesamtsummen beweisen keine einzelne
Buchung. Deshalb gibt es weder pauschale Rückdatierung noch erneute Punktevergabe.
Ein Wiederholungsversuch zu einer alten unmarkierten Zeile bleibt unbestätigt
(`attempt_unconfirmed`, nach außen `persist_failed`). Auch `getPracticeReceipt`
liefert dafür keine Quittung. Eine mögliche spätere Bestandsreparatur braucht
separat belastbare Belege und einen eigenen Auftrag. Vorhandene Versuchszeilen,
Queue-Einträge und Fortschrittswerte werden durch Migration 0027 nicht gelöscht.

Neue Ausfälle hinterlassen durch die Transaktion keine unmarkierte Teilbuchung.
Der nächste Versuch kann daher die ganze Buchung sicher einmal ausführen. Bei
verlorener HTTP-Antwort nach Commit liefert die Wiederholung dieselbe Quittung.
Weder Summe noch aktuelle Neubewertung werden dafür als Ersatzbeleg verwendet.

## Anzeige und geschlossene Zugänge

Wiederholen und Lernpfad beginnen jede Antwort mit 0 sichtbaren Punkten.
`useBookedRound` übernimmt ausschließlich eine erfolgreiche Serverquittung für
eine noch offene Antwortkennung dieser Runde. Die Kennung wird beim Übernehmen
verbraucht; sofortige Antwort und spätere Warteschlangenwiederholung können sie
nicht doppelt zählen. Lokale Korrektheitsrückmeldung bleibt verfügbar.

Der Rundenschlüssel umfasst Person, Vorschau, Wiener Datum und Aufgabeninhalt;
im Lernpfad zusätzlich Chapter, Knoten und Modus. Ein Wechsel ersetzt die Runde
und verwirft ihre offenen Anzeigen. Abgemeldete Runden übernehmen auch verspätete
Antworten nicht. Vorschauen schreiben keine Antworten und zeigen 0 Punkte.
Die gespeicherte Warteschlange bleibt wie bisher an die angemeldete Person gebunden.

Kann die Journey-Seite die für Prüfungen reservierten Aufgaben nicht feststellen,
bleiben alle Knoten geschlossen. Der direkte Knoten-Link prüft dieselbe Bedingung
und führt zur Übersicht zurück. Eine unbekannte Reservierung wird nie als leere
Reservierung behandelt. Die Lehrervorschau benötigt weiterhin keine Klassendaten.

## Einführung und Grenzen

0027 ist ein **Migrationsartefakt für GG/Koki**, keine ausgeführte
Produktionsmigration. Die Veröffentlichung muss mit dem vorangehenden Stapel
und dessen Migrationen 0024–0026 abgestimmt werden. 0027 muss vor dem neuen Code
angewandt sein: Die aktuelle Tabellenbeschreibung erwartet die Spalte auch bei
bereits bestehenden Duell-/Live-Schreibungen. Die Funktion verlangt keine neue
Bibliothek, Verbindungsart, Umgebungsvariable oder geheimen Schlüssel.

Eine alte Programmversion kann die additive Spalte ignorieren; ihre neu
entstehenden Zeilen bleiben dann unmarkiert. Während einer Rücknahme des Codes
darf deshalb keine nachträgliche Markierung erfunden werden. Die Spalte und
Funktion sollten bei einer Code-Rücknahme bestehen bleiben, um bestätigte
Buchungsbelege zu erhalten. Entfernen oder Rückdatieren gehört nicht zu diesem PR.

`booked_at` ist in der Datenschutz-Spaltenklassifikation als personenbezogener
Aktivitätszeitpunkt erfasst. Die Änderung fügt keine Identität, Antwortkopie oder
externe Übertragung hinzu.

Die lokalen PostgreSQL-Prüfungen verwenden PGlite mit erfundenen Identitäten;
sie belegen SQL-Rollback und Wiederholung, aber keinen Belastungstest über mehrere
echte Neon-Verbindungen. Die Trigger zur Fehlerinjektion existieren nur in Tests.
Der Browservergleich verwendet die echte Antwort-Route, Warteschlange und
Lernansicht mit synthetischer Anmeldung. Die vollständige Veröffentlichungsbatterie
und Produktionsfreigabe bleiben bei GG. **Vollbatterie: UNVERIFIZIERT, läuft in der
GG-Kette.**

Der Auftrag betrifft die gewöhnliche Buchung über `/api/attempts`.
`/api/school` und `/api/assignments/attempt` verwenden weiterhin den bisherigen
`recordAttempt`-Weg und erhalten hier keine neue Quittung. Deren Umstellung ist
nicht Bestandteil dieser Karte; die Reparatur behauptet keine Vollständigkeit
für alle Schreibwege der Plattform. Die bereits transaktionalen Duell-/Live-Wege
bleiben davon getrennt.

Wort-Hilfe, persönliche Sammlung, Bilder und Activity-Regeln werden durch diese
Reparatur nicht freigegeben. Die offene Bestandsklärung aus cgo-153 bleibt offen.
