# Lehrerbereich · Erhaltung und Schnittstellen

CODEX DRAFT — NOT CANON · cgo-041 · Ausgang `269ee986ccdc1ae7c3b070cbed7014f20e532365`.

Dies ist der Bauvertrag, keine Laufzeitfreigabe. Quellen und bisherige Zustände wurden vor dem Bau gelesen. Die unabhängige Prüfung und der angemeldete Produktdurchlauf stehen aus. Keine neue Lernaufgabe, kein didaktisches Muster und deshalb kein behauptetes Buch-/Bildstudium für eine Lernstrecke.

## Bestands- und Erhaltungsmatrix

Alle relativen Quellen liegen unter `apps/web/`, sofern nicht anders angegeben. „Eigene“ verlangt sowohl den erlaubten Klassenumfang aus der Sitzung als auch den Eigentümerfilter; Großmeisterrechte erweitern diese Liste nicht.

| Bestehender Einstieg / URL | Berechtigung und Zweck | Neue Position / tatsächliches Ziel | Bisheriger Datenleser | Laden / Fehler / leer im Bestand |
|---|---|---|---|---|
| `/admin` | Lehrkraft; Start | „Meine Klassen“ als erster Inhalt | `auth`, `scopedClassIds`, vier `getUnitMastery`-Abfragen | Warten auf Server; Fehler je Jahrgang zu `[]`; leere Story-Blöcke |
| `/admin/classes` | Lehrkraft, eigene erlaubte Klassen | „Klassen verwalten“; Liste und Beitrittscodes bleiben unter gleicher URL | `listClassesForTeacher`, `listArchivedClassesForTeacher` | Kein eigener Ladehinweis; beide Fehler zu `[]`; „Noch keine Klasse“ |
| `/admin/classes/{id}` | Eigene Klasse; ausdrücklich getrennter Großmeisterzugriff in Zielseite | Primärlink jeder Klasse „Klasse öffnen“ | `getClassForTeacher`; Detail: `listRoster`, `holeKlassenliste`, Lern-/Spiel-/Fehlerleser | Besitzfehler → Klassenliste; getrennte Detailfehler; bestehende leere Abschnitte |
| `/admin/classes/{id}/roster` | Eigentümer oder geprüfter Großmeister | Je Klasse „Klassenliste“ | `getClassForTeacher`, `listRoster`, `holeKlassenliste`, `mergeKlassenliste` | Server wartet; örtlich abgefangene Fehler; leere Liste. Zielseite unverändert |
| `/admin/classes/{id}/schreiben` | Eigentümer oder geprüfter Großmeister | Navigation „Schreiben“ → eigene Klasse wählen; je Klasse direkter Schreiblink | `listSubmissionsForClass`, `listStudentsForClass` | Vorhandene Fehler-/Leeranzeige in Zielseite bleibt |
| `/admin/classes/{id}/hoeren` | Eigentümer oder geprüfter Großmeister | Je Klasse „Hören“ | `listClassRecordings` in Zielseite | Vorhandene Fehler-/Leeranzeige bleibt; Downloads unverändert |
| `/admin/assignments` | Lehrkraft; eigene erstellte Aufträge | Erste Navigation „Aufgaben“ | `listAssignmentsByCreator`, `listClasses` bzw. explizit `listClassesInScope` für Großmeister | Vorhandene catches/Leeranzeige bleiben; außerhalb des Zauns |
| `/admin/assignments/new` | Lehrkraft; Übungen/Checkups/Schularbeitsproben bauen | Über bestehende Aufgabenliste, zusätzlich in Verwaltung | Vorhandener `AssignmentBuilder` | Ziel unverändert |
| `/admin/assignments/{id}` | Vorhandene Auftragsberechtigung | Über Aufgabenliste, vorhandene Ergebnistür | Bestehende Auftrags-/Ergebnisleser | Ziel unverändert |
| `/admin/studio`, `/admin/studio/new`, `/admin/studio/{slug}` | Lehrkraft; Aufgaben bearbeiten/erstellen | Verwaltung → „Aufgaben im Studio bearbeiten“; Unterwege im bestehenden Studio | Korpus + bestehende Studio-Leser | Ziel unverändert; kein Veröffentlichungsversprechen auf Start |
| `/admin/settings` | Lehrkraft; Kontoeinstellungen | Verwaltung → „Kontoeinstellungen“ | `getTeacherForPage` | Kein Klassenleser; Ziel unverändert |
| `/admin/hilfe` | Lehrkraft über bestehende Zugangskontrolle | Ständig erreichbarer Link „Hilfe“ | Statischer Inhalt | Keine Datenfehler; **alte englische Knopfnamen im Hilfetext außerhalb des Zauns**, im Abschluss an GG melden |
| Konto `/lehrerraum/lehrgruppen` | Zentraler Kontovertrag | Verwaltung und Klassenverwaltung → „Zum Lehrerzimmer“ | `kontoBaseUrl` bildet bestehenden Link | Keine lokale Klassenanlage/-umbenennung/-archivierung |
| `/admin` bisher: jahrgangsweite Spielstatistik | Lehrkraft; bisheriger Klassenumfang, Großmeisterumfang unverändert | Verwaltung → „Spielstand nach Chapter“, `/admin?bereich=spielstand` | `listReleasedStories`, `getUnitMastery` | Bisher catch → leer; neu eigener Fehlerzustand statt Null/leer; keine Erweiterung der Leserberechtigung |
| `/play/1/world` | Bestehende Lehrer-Spielrolle, Ziel prüft Zugang | Verwaltung → getrennte „Spiele erproben“-Tür | `getPlayerForPage`, bestehende Spielroute | Bestehender Lehrer-Spielstand kann schreiben; **keine schreibfreie Schüleransicht behaupten** |
| `/play/1/run?level=g1-{ch}&boss=1` | Bestehende Lehrer-Spielrolle | Innerhalb getrennter Erprobung, alle tatsächlich ladbaren Chapter | `loadKeenLevel` + `loadKeenBoss` | Nicht verfasste Chapter bisher ausgelassen; Verhalten erhalten |
| `/play/1/buch/{ch}` | Bestehende Lehrer-Spielrolle | Innerhalb getrennter Erprobung, jedes vorhandene Chapter | `listPaintChapters` | Dynamische vorhandene Chapter erhalten, keine hartcodierte Zahl |
| `/admin/grandmaster` | Ausschließlich `isGrandmaster`, vor Datenlesung erneut in Ziel geprüft | Verwaltung → eigene Tür „Großmeister: alle Klassen“ | `listAllClassesForGrandmaster` | Vorhandene Teilausfälle; keine fremde Klasse in „Meine Klassen“ |
| Abmelden auf alter `/admin`-Seite | Eigene Sitzung | Bestehende zentrale Kopfzeile `BrandHeader` → `abmelden` | Bestehende Konto-Abmeldung | Doppelter Seitenknopf entfällt; zentrale Funktion erhalten |
| „Next for teachers“ / Sommerplan | Keine Aktion, kein funktionierendes Ziel | Entfällt begründet: veraltete Entwicklungsprosa | Keiner | Keine Produktfunktion entfernt |

Neue Ladeanzeige innerhalb der autorisierten Seiten mit React `Suspense`; kein zusätzliches Admin-Layout, das `/admin/signin` sperren könnte. Der Linkvergleich muss jede alte konkrete URL einschließlich dynamischer Spieltüren und alle neuen Klassenaktionen erfassen. Eine entfernte Navigationsverknüpfung muss die Prüfung scheitern lassen.

## Datenzustände und nicht vorhandene Fähigkeiten

1. Aktive und archivierte Listen werden unabhängig gelesen. `ready` mit null Zeilen ist leer; `error` hat keine ersatzweise leeren Zeilen. Ein synchroner Fehler beim Bereitstellen des Datenbankzugangs ist ebenfalls `error`.
2. Die zwei bestehenden Listenleser in `packages/db/src/class-service.ts` geben Abfragefehler bereits weiter. Deshalb ist zunächst **keine Änderung dieses gemeinsamen Moduls nötig**. Eigentümer-, Umfangs- und Archivfilter bleiben dort unverändert.
3. `studentCount` zählt lokale Konten ohne die künftigen Testfilter. Gemäß GG-Nachtrag 2 wird dieser Wert im Darstellungsvertrag entfernt und auf Start-/Klassenübersicht nicht gezeigt. Keine neue Kinderzahl, kein testbereinigter Klassenzähler. Bestehende Detailstatistiken bleiben über ihre unveränderten Seiten erreichbar.
4. Am Ausgang fehlen Schuljahr und Klassen-Testmarker in `v2Classes`; `konto-class-term.ts:10–14` verwirft Schuljahr ausdrücklich. Keine Ableitung aus Datum, Namen oder Jahrgang. GG-Nachtrag 2 bestätigt: intern `schoolYear: null` und `testStatus: "unknown"`; auf Klassenkacheln weder technischer Warntext noch Schuljahr/Test-Badge. Synthetische Komponenten dürfen bestätigte Werte prüfen. Echte Testmarker bleiben cgo-029; eine künftige Schuljahresanbindung muss GG vor cgo-042 gesondert entscheiden und ist hier nicht mitbeauftragt.
5. „Als Schüler ansehen“, „Mein Klassenzugang“ und `/wechsel` werden nicht angeboten: cgo-029/cgo-042 besitzen diesen Vertrag. Die alten Erprobungswege sind gespeicherte Lehrer-Spielwege und werden entsprechend benannt.
6. Klassenanlage, Rollenwechsel, Testmarker und Lernspeicherung gehören nicht zu dieser Karte. 1A/2A/3A/4A sind ausschließlich Testdaten, niemals Ersatzwerte einer produktiven Liste.
7. Zusätzlicher Integrationsrest (GG-Frage N4, Entscheidung N5): Der vorgelagerte Großmeister-/Entwicklungsumfang aus `identity.ts:40–43/121–137` verwendet `listAllClassIds` (`packages/db/src/class-service.ts:578–592`), das Fehler selbst als leere/partielle Menge zurückgibt. Das ist nicht einer der zwei eigenen Klassenleser aus N2 und liegt außerhalb des erlaubten Änderungsbereichs. GG hat die Korrektur/Prüfung ausdrücklich an009/GG vor Gesamtannahme, Messzugang und Pilot gebunden.041 behandelt tatsächlich geworfene Identitätsausnahmen als sichtbaren Zugangsfehler; eine leere Liste wird nie heuristisch als Fehler umgedeutet. **Dieser PR braucht den geprüften009-Vertrag für ein Gesamt-Ja; Komponentenprüfungen erledigen diese Abhängigkeit nicht.**

## Anforderungszuordnung und Prüfplan

| Kartenpunkt | Umsetzung / Beleg | Verbleibendes Tor |
|---|---|---|
| 1 · Erhaltung | Diese Matrix plus zentrale Navigationsdefinition | Alte URLs gegen neue Verknüpfungen; echte Entfernen-Gegenprobe; gerenderte Klickprüfung |
| 2 · Eigene Klassen / Fehler | Bestehende autorisierte Leser, getrenntes Ergebnis je Liste | 0/1/4, Archiv/Test, beide Teilausfälle, Vollausfall, leerer Umfang; echte SQL-Fehlerprobe nach 009; Fremdklasse-Gegenprobe |
| 3 · Gestaltung / Sprache | Eigene seitengebundene Papierfläche; vorhandene LauterEinser-Farben, Fredoka/Inter/Quicksand; Deutsch, Chapter; Quelltextregister `TEXTE.md` | Gerenderten Wortlaut gegen vollständiges Register prüfen; 390×844/1440×900, Hell/Dunkel, Tastatur/Fokus/Kontrast/reduzierte Bewegung; gerenderter Vorher/Nachher-Vergleich |
| 4 · Verträge / Aktionen | Reale Routen in obiger Matrix, Spezialzugänge fehlen bewusst | Unbekannte/unerlaubte Aktion als tatsächliche Gegenprobe; jede Zielroute öffnen |
| 5 · Produktweg | Später isolierter synthetischer, persistenter 009-Prüfstand | Erst nach angenommener Infrastruktur und eigener schwerer Zuteilung; keine Speicherung aus Komponententests behaupten |
| 6 · Pflichtprüfung | Befehlsplan wird aus den tatsächlichen Paketdateien des fertigen Kopfes erzeugt | Installation, Bau, Typen, Lint, Tests, alle check:/test:-Befehle und vier Inhaltsprüfungen; erster unerwarteter Fehler stoppt |

## DomiLingo: belegte Lehren und Grenzen

Referenz: 13 eingefrorene Dateien an `ff8b7123d663b0df89634c183798d75ef5c52cb9`; alle MD5/SHA256 selbst bestätigt. Kein Donor-Code kopiert oder geändert.

| Alter Fehler / Quelle | Warum die vorige Prüfung nicht reichte | Wirksame Kontrolle / Anwendung hier |
|---|---|---|
| Klassenstart ohne erreichbare Schreibkorrektur, `app/admin/page.tsx` Kommentar F1 | Funktionsseite vorhanden, aber kein Eingang | Schreiben ausdrücklich in die erste Navigation und in jeden Klassenweg aufnehmen; Entfernen eines Wegs muss rot werden |
| Fehlgeschlagener Meldungsleser als Null, ebenda srdp-329 S3 | Ein Ersatzwert sah wie ein echter Zähler aus | Unterschiedliche Ergebnistypen und tatsächlich verworfene Abfragen; keine „leer“-Botschaft bei Ausfall |
| Gefälschte Vorschau über Session-Update, `lib/student-preview.ts` a2 / PR545 | Eigentümerprüfung nur in einer Serveraktion, anderer Aufrufpfad blieb offen | Bestehende serverseitige Klassenabfrage samt Eigentümerbindung verwenden; UI-Ausblenden ist kein Berechtigungstest |
| Vorschau versus persönlicher Zugang nur im Tooltip, `app/admin/page.tsx` srdp-156 | Auf Touch-Geräten blieb entscheidender Hinweis verborgen | Keine unbekannte Fähigkeit anbieten; alte Spielwege sichtbar von künftiger schreibfreier Vorschau unterscheiden |
| Prüfungen ohne Datenbank, `scripts/test-klassen-zugang.ts:31–41` | Speicherattrappe und Quellzensus beweisen weder Persistenz noch echte Aggregate | Pure Tests ehrlich als solche ausweisen; SQL-/Neustart-/Anmeldeprüfung warten auf angenommenen Prüfstand |
| Leerlaufendes Quellen-Tor, `scripts/test-student-preview.ts` RULE ZERO | Nicht gefundener Schreibweg wurde früher leicht übersehen | Fehlende erwartete Route/Quelle ist rot, nicht „nicht anwendbar“; Gegenproben müssen den beabsichtigten Fehler treffen |
| Heftlinien durch Schrift, `lib/heft-raster.ts` und `app/heft-raster.css` | Beliebige Zeilenhöhen auf globalem Linienhintergrund | Deckendes Papier unter Text, Linien nur in freiem Rand; später echte geladene Schrift und Bild prüfen, kein kopiertes Layoutsystem |

Die Herkunftsinventur cgo-025 an `ba54d6e4` ist eine noch nicht angenommene Referenz. Ihre offenen Speicher-, Quellen- und Lehrkraftszenarien bleiben offen. Diese Karte vergibt keinerlei neue Inhaltsfreigabe für einen Jahrgang.
