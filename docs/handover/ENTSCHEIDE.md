# ENTSCHEIDE · Repo-Spiegel für W7

CODEX DRAFT — NOT CANON · IN REVIEW. Dieser gezielte Repo-Spiegel hält die
bereits von GG entschiedenen Grenzen der Karte cgo-156 fest. Er ersetzt kein
externes Entscheidungsbuch und erteilt keine neue Produktfreigabe.


## Entscheidung vom 24.10.2026

**CODEX DRAFT — NOT CANON · IN REVIEW.** Umsetzung der GG-Entscheide
cgo-133/134, ausdrücklich beauftragt durch cgo-156. Kokis Bildurteil (cgo-128)
und die Freigabe des gesamten PR-Stapels bleiben offen.

Das Profil unter `/profil`, erreichbar über den Avatar, zeigt genau sieben
Abzeichen. Die vorhandene Figurenauswahl öffnet zuerst; nach „Fertig“ erscheint
die Profilfläche. Eine serverseitige Leseabfrage prüft die aktuelle beanspruchte
Schüleridentität, die eigene Klasse und den Sitzungs-Klassenausschnitt. Sie liest
keine Namen und schreibt nichts. Der Browser erhält nur bestätigte Abzeichen-IDs.

| Abzeichen | Verbindliches Kriterium |
|---|---|
| `streak-3`, `streak-7` | Gespeichertes `user_progress.streak` mindestens 3 / 7. Allgemeine Lernserie; ausdrücklich keine rekonstruierte Folge abgeschlossener Vokabelrunden. |
| `prestige-1/2/3` | Vorhandenes `user_progress.xp` mindestens 30.000 / 45.000 / 65.000. |
| `duo-champion` | Fünf abgeschlossene eigene Siege in `duels` derselben Klasse; beide vorhandenen Duellmodi zählen wie im Original. |
| `daily-first` | Mindestens ein eigener Versuch mit `mode=daily` und nichtleerem `booked_at` derselben Klasse. Auch ein falscher, aber vollständig gespeicherter Versuch zählt. |

„Daily Challenger“ beschreibt deshalb einen gespeicherten Versuch, keinen
vollständig abgeschlossenen Tagesdurchgang. Vorschau: 0 verdient, kein Abfragen
eines fremden Kontos. Lesefehler: „Nicht geladen“ statt erfundener Nullleistung.
Es gibt keine neue Abzeichentabelle, keine Rückbefüllung und keine dauerhaft
verliehenen Auszeichnungen: Die Anzeige spiegelt jeweils die vorhandenen
Serverwerte. Sinkende/zurückgesetzte Werte können ein Abzeichen wieder sperren.
Alte unbestätigte Versuche erzeugen kein Daily-Abzeichen; die vorgelagerte
Buchungs-/Merge-Sperre cgo-154 bleibt bestehen. Die Abfrage setzt die bereits
im vorgelagerten Entwurf enthaltene Migration 0027 (`booked_at`) voraus;
diese Karte führt sie nicht aus. Fehlt die Spalte, erscheint der ehrliche
Ladefehlerzustand statt einer erfundenen Auszeichnung.

Hell-/Dunkelwahl bleibt ausschließlich im Arbeitsspeicher bis zum Neuladen.
Kein localStorage, Cookie oder Servereintrag. Dauerhaftes Speichern bleibt bei
daten-029/GG-Plattform. Die Gerätewahl wird hier nicht vorweggenommen.

#### W7-Abweichungstabelle: alle 41 zurückgestellten Abzeichen

Alle folgenden Einträge bleiben auf GG-Entscheid geparkt. Sie erscheinen weder
als Kacheln noch als „bald“-Platzhalter. Wiederaufnahme erst durch eine eigene
beauftragte Karte nach der Plattform-Spur und dem serverseitigen Rundenmodell;
auch bereits teilweise ableitbare Kriterien sind keine zusätzliche Freigabe.

| Geparkte ID | Originalname | Grund / Abweichung |
|---|---|---|
| `first-session` | First Steps | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `ten-sessions` | On Fire | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `fifty-sessions` | Unstoppable | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `mastered-10` | Quick Learner | Original-Mastery und gültige Kategorienmenge sind nicht freigegeben; bestätigte Einzelantworten oder Wiederholungsboxen ersetzen diesen Entscheid nicht. |
| `mastered-50` | Word Collector | Original-Mastery und gültige Kategorienmenge sind nicht freigegeben; bestätigte Einzelantworten oder Wiederholungsboxen ersetzen diesen Entscheid nicht. |
| `mastered-100` | Vocabulary Champion | Original-Mastery und gültige Kategorienmenge sind nicht freigegeben; bestätigte Einzelantworten oder Wiederholungsboxen ersetzen diesen Entscheid nicht. |
| `mastered-all` | Master of All | Original-Mastery und gültige Kategorienmenge sind nicht freigegeben; bestätigte Einzelantworten oder Wiederholungsboxen ersetzen diesen Entscheid nicht. |
| `perfect-round` | Flawless | Vollständige Rundenzugehörigkeit und Abschluss fehlen; Einzelantworten verschiedener Durchgänge dürfen keine perfekte Runde bilden. |
| `all-types` | Explorer | Die ursprünglichen fünf Übungstypen samt Tages-/Sitzungsgrenzen sind nicht als neue Abzeichenregel freigegeben. |
| `daily-perfect` | Daily Genius | Kein bestätigter vollständiger Tagesdurchgang mit festem Aufgabenbestand und Ergebnisquote. |
| `speed-demon` | Speed Demon | Signierte Zeitspanne allein beweist weder vollständige Runde noch eindeutige Aufgabenfolge. |
| `sprinter` | Sprinter | Keine serverseitig bestätigte Identität und Abschlusszählung für zehn Sprintrunden. |
| `sharp-eye` | Sharp Eye | Originalfehler: bestMCStreak wird nie erhöht; weder Lebenszeitsumme noch Serie darf stillschweigend Ersatz werden. |
| `context-ace` | Context Ace | Vollständige Rundenzugehörigkeit und Abschluss fehlen; Einzelantworten verschiedener Durchgänge dürfen keine perfekte Runde bilden. |
| `definition-master` | Definition Master | Vollständige Rundenzugehörigkeit und Abschluss fehlen; Einzelantworten verschiedener Durchgänge dürfen keine perfekte Runde bilden. |
| `giant-killer` | Giant Killer | Rang oder XP beider Seiten zum Duellbeginn ist nicht historisch festgehalten. |
| `variety-pack` | Variety Pack | Die ursprünglichen fünf Übungstypen samt Tages-/Sitzungsgrenzen sind nicht als neue Abzeichenregel freigegeben. |
| `comeback-kid` | Comeback Kid | Fehlerauswahl, zugehörige Ursprungsrunde und abgeschlossener Wiederholungsdurchgang fehlen. |
| `review-warrior` | Review Warrior | Original zählt den Start, beschreibt aber den Abschluss; freigegebene Rundengrenze fehlt. |
| `full-sweep` | Full Sweep | Original zählt ausgewählte Quell-Units beim Start; heutige beantwortete Chapters sind kein identischer Nachweis. |
| `flash-scholar` | Flash Scholar | Original zählt eindeutige Got-it-Karten am Sitzungsende; Again oder einzelne Aufrufe dürfen nicht mitgezählt werden. |
| `g-first-session` | Grammar Rookie | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `g-ten-sessions` | Grammar Grinder | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `g-fifty-sessions` | Grammar Machine | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `g-perfect-10` | Perfect 10 | Vollständige Rundenzugehörigkeit und Abschluss fehlen; Einzelantworten verschiedener Durchgänge dürfen keine perfekte Runde bilden. |
| `g-streak-3` | 3-Day Grammar Streak | Die gespeicherte allgemeine Lernserie ist keine eigene Serie abgeschlossener Grammatikrunden. |
| `g-streak-7` | Grammar Week | Die gespeicherte allgemeine Lernserie ist keine eigene Serie abgeschlossener Grammatikrunden. |
| `g-mastered-5` | Rule Learner | Original zählt gespeicherte Grammatikrunden; deren Umfang und Abschluss sind nicht aus beliebigen Einzelantworten rekonstruierbar. |
| `g-mastered-15` | Grammar Scholar | Original zählt gespeicherte Grammatikrunden; deren Umfang und Abschluss sind nicht aus beliebigen Einzelantworten rekonstruierbar. |
| `g-mastered-all` | Grammar Crown | Originalfehler: Grammar Crown 34 gegenüber 35 Strukturen in Jahrgang 1; 22 gegenüber 28 heutigen Strukturen in Jahrgang 2; kein stiller neuer Nenner. |
| `g-accuracy-80` | Sharpshooter | Einzelantworten existieren, aber ursprünglicher Rundenausschnitt und Abschluss sind nicht freigegeben; keine Umdeutung aller Grammatikversuche. |
| `g-accuracy-95` | Precision Master | Einzelantworten existieren, aber ursprünglicher Rundenausschnitt und Abschluss sind nicht freigegeben; keine Umdeutung aller Grammatikversuche. |
| `g-tense-tamer` | Tense Tamer | Originalfehler: veraltete Zeitform-IDs; ähnlich benannte Strukturen sind kein genehmigter Ersatz. |
| `g-error-hunter` | Error Hunter | Originalfehler: grammarEcStreak und grammarTrStreak haben keine Aktualisierung; Rücksetz- und Rundengrenzen sind unbestimmt. |
| `g-translator` | Translator | Originalfehler: grammarEcStreak und grammarTrStreak haben keine Aktualisierung; Rücksetz- und Rundengrenzen sind unbestimmt. |
| `g-all-units` | Grammar Explorer | Original-Unit-Nenner widersprechen eingebetteten Quellen; Auswahl eines neuen Nenners braucht einen eigenen Entscheid. |
| `g-100-answers` | Century | Einzelantworten existieren, aber ursprünglicher Rundenausschnitt und Abschluss sind nicht freigegeben; keine Umdeutung aller Grammatikversuche. |
| `g-500-answers` | Grammar Athlete | Einzelantworten existieren, aber ursprünglicher Rundenausschnitt und Abschluss sind nicht freigegeben; keine Umdeutung aller Grammatikversuche. |
| `g-prestige-1` | Grammar Prestige I | GG gibt ausdrücklich nur sieben Abzeichen frei; grammarXp enthält auch Hör-/Lese-XP und belegt kein reines Grammatik-Prestige. |
| `g-daily-first` | Daily Grammar Challenger | Kein freigegebener Grammatik-Tagesrundenvertrag; allgemeiner daily-Versuch ist kein Grammatik-Tagesabschluss. |
| `g-daily-perfect` | Daily Grammar Genius | Kein freigegebener Grammatik-Tagesrundenvertrag; allgemeiner daily-Versuch ist kein Grammatik-Tagesabschluss. |

Weitere Originalfehler: Im vierten Trainer fehlt `GRAMMAR_BADGE_DEFS`; das
wird nicht durch erfundene Definitionen aufgefüllt. Die nie erhöhten MC-Zähler,
Grammar-Crown-Zahlen 34/35 und 22/28 sowie veraltete Zeitform-IDs sind
Quellenfehler und keine nachzubauenden Regeln.

Quellenstand: `REPORTS-codex/cgo-129-20261024-astra/badge-source/REPORT.md`
und `badge-inventory.json` (48 eindeutige IDs, 172 Jahrgangseinträge; SHA-256
`8ac89dc7f49113bec01b1d6615bb5add0b435d6fac388e7c8c4fefeccf3ebd59`). Kriterienänderungen folgen
ausschließlich cgo-156, nicht einer stillen Korrektur dieses älteren Inventars.
Die W7-Abweichungstabelle steht ebenfalls in [23_design_language.md](23_design_language.md).

Referenzablage, unveränderliche Prüfsummen und externer Aufgabenvertrag stehen
in [visual-checks.md](../testing/visual-checks.md). Bildpakete und Rohbelege
bleiben außerhalb des Repos. Referenzfixierung bedeutet keine Bildfreigabe
durch Koki. Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette.
