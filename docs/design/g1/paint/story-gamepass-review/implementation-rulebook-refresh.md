# CODEX DRAFT — NOT CANON

## Ergebnis

Die dauerhafte Regelseiten-Sammlung aktualisiert beim erneuten Finden die tatsächliche Regel statt eine zusätzliche Seite mit korrigiertem Titel anzulegen. Die optionale feste Kennung `ruleId` entspricht der bereits vorhandenen Level-Entitätskennung `tip.id`. Das bestehende Speicherformat v3 und der Schlüssel `domigo:regelbuch:g1` bleiben erhalten; keine Sammlung wird wegen dieser Ergänzung verworfen.

## Konkrete Änderungen

`apps/web/lib/regelbuch.ts`: `RegelbuchEntry.ruleId?: string`; `ruleIdentity` und `sameRule` vergleichen innerhalb desselben Kapitels vorrangig feste Kennungen. Fehlen sie in Altdaten, bleibt der vorhandene Vergleich gleicher Titel samt Aktualisierung korrigierter Texte erhalten. Zwei eng begrenzte historische Titelpaare werden ausschließlich in ch01 ihrer echten Regel zugeordnet: „Befehle — ohne you vor dem Verb“ / „Befehle auf Englisch“ → `p1-regel-befehle`; „Plural: aus einem werden viele“ / „Ein Buch und viele Bücher“ → `p3-regel-plural`. Eine ausdrücklich gespeicherte andere Kennung hat Vorrang vor diesen Aliasnamen und wird nicht überschrieben.

`rememberRegelSeite` ersetzt die wiedergefundene Regel an der ersten bisherigen Position. Bereits vorhandene alte/neue Doppelungen genau dieser Regel werden zusammengeführt; alle übrigen Einträge behalten ihren Inhalt und ihre Reihenfolge. Ein älterer Aufrufer ohne Kennung verliert eine bereits gespeicherte Kennung nicht. Dieselbe erneute Eintragung schreibt nichts zusätzlich. Fehler beim Lesen oder Schreiben des Browserspeichers bleiben abgefangen.

`apps/web/app/(game)/play/[grade]/buch/[chapter]/BuchClient.tsx`: In dieser Lane ausschließlich `ruleId: tip.id` im bestehenden Regelseiten-Eintrag ergänzt. Andere bereits vorhandene Änderungen dieser gemeinsam bearbeiteten Datei stammen aus früheren Bahnen und wurden bewahrt. Keine kind-sichtbare Formulierung geändert.

## Neue Tests und Rotproben

`apps/web/lib/regelbuch.test.ts`: Acht gezielte Tests lesen die echten aktuellen Regelseiten aus ch01.level.json. Sie prüfen beide alten Titel, vollständigen korrigierten Inhalt nach Wiederfund und erneutem Speicherlesen, zusammengeführte Doppelungen, den bisherigen gleichen-Titel-Vertrag, zukünftige Titelkorrekturen über feste Kennung, Bewahrung der Kennung bei einem älteren Aufrufer, unveränderte fremde Kapitel/Regeln, wiederholte Eintragung ohne weiteren Schreibvorgang, unveränderte andere Speicherschlüssel sowie blockierten Speicher. Ein gescheiterter Schreibvorgang behauptet keine dauerhafte Speicherung. Ergebnis: 8/8 grün (`rulebook-refresh-tests.log`). Keine bestehenden Tests oder Schwellen geändert.

Echte getrennte Rotproben unter `rulebook-refresh-tampers/` benutzen Kopien von Modul und Test; die Testdaten bleiben die tatsächlichen aktuellen Leveldaten. Unveränderte Kopie: grün. Acht gezielt fehlerhafte Modulvarianten: jeweils rot — Befehlsalias entfernt, Pluralalias entfernt, Alias auf andere Kapitel ausgedehnt, Kapiteltrennung entfernt, Doppelungen behalten, alte Erklärung behalten, ausdrückliche Identität ignoriert, Speicherfehler wieder geworfen. `rulebook-refresh-tampers.py` dokumentiert das Verfahren, `results.json` die Ausgänge und den Quellhash; jeder Unterordner enthält sein vollständiges Testprotokoll. Keine negative Variante wurde ins Produkt geschrieben.

## Typprüfung und Grenzen

`nice -n 15 pnpm --filter web typecheck`: Exit 0, `rulebook-refresh-typecheck.log`. Node v24.20.0. Keine Commits, Datenbankzugriffe, Remote-Schreibvorgänge oder Browser-Speichermutationen auf einem Benutzerkonto.

Die Korrektur geschieht beim erneuten Finden, nicht beim bloßen Öffnen einer älteren Sammlung: Ohne Wiederfund wird kein aktueller Lehrtext aus anderen Quellen geraten. Der vorhandene Regelseiten-Speicher ist weiterhin an dieses Gerät bzw. Browserprofil gebunden und verwendet weiterhin seinen vorhandenen gemeinsamen Schlüssel; Accounttrennung oder Servermigration dieser älteren Sammlung waren nicht Teil dieses Auftrags. Das getrennte neue Story-Profil bleibt unverändert nach Spieler getrennt.
