# Ein Siegel je Item · Entwurf

**CODEX DRAFT — NOT CANON.** Ein Item ist eine einzeln identifizierte Aufgabe.
Ein Siegel ist hier eine an ihre genaue Fassung gebundene Prüfakte. W0 erzeugt
nur `draft` und besitzt keinen Schreibweg für Veröffentlichung oder Datenbank.

## Ein gebundener Gegenstand

`makeBinding` in `scripts/gg-revision/core.mjs` bildet eine einzige Hülle:

| Teil | Bindung |
|---|---|
| Identität | Schemafassung und Item-Kennung |
| Quelle | Dateipfad, Originalprüfsumme, Fundstelle/Kandidat und fachlicher Quellstatus |
| Inhalt | vollständiges geladenes Item einschließlich Aufgabenauftrag |
| Antworten | alle vier Vokabelpools bzw. Lösungen, Paare/Gruppen und Paint-Schlüssel |
| Schüleransicht | tatsächliche Komponentenansichten; eingefrorenes HTML, explizite Folgezustände, ursprünglicher Storykontext, Beispielpaar, CSS und Bild-/Schriftdateien |
| Darstellungscode | Prüfsummen der verwendeten Komponenten, Abhängigkeitssperrdatei und W0-Werkzeuge |

SHA-256 bezeichnet die dabei verwendete Prüfsumme. Objektfelder werden in eine
feste Reihenfolge gebracht; Array-Reihenfolge bleibt erhalten. Die Hülle bindet
**deklarierte** Ansichten: Aus einer initialen Ansicht folgt keine Behauptung über
ungeprüfte Hilfe, Fehlerstufen, komplette Geschichten oder Live-Szenen.

Jede Abweichung von Quelle, Inhalt, Antworten, Ansicht oder Darstellungscode
blockiert die Verwendung eines alten Freigabeurteils. Geprüft wird nicht nur die
Anzahl der Aufgaben: fehlende, ersetzte und doppelte Kennungen scheitern ebenfalls.
Bei der zweistufigen Restore-Aufgabe muss die Farbansicht vorhanden sein.

`approvalErrors` verlangt zwei verschiedene fremde Sitzungskürzel, jeweils ein
Ja zur aktuellen Bindung, einen bestätigten Quellstatus und Kokis Ja zu genau
dieser Bindung. Sitzungskürzel sind keine digitale Unterschrift: Der GG muss die
tatsächlich getrennten Board-Urteile prüfen. Der Autor kann Unabhängigkeit nicht
durch einen anderen Textwert erzeugen. Selbst ein leeres Fehlerergebnis publiziert
in W0 nichts; der Zustand bleibt Entwurf.

## DomiLingo als gepinnte Vergleichsquelle

Nur gelesen wurde Stand `b61bcbb729f7a6ba447d91a1b213c77ef5eda496`:

| Datei | md5 | Übernommene Unterscheidung |
|---|---|---|
| `docs/revision/README.md` | `6b5aef54f26e5098b2f637faa07751c1` | Ein Stempel behauptet ein konkretes Urteil für eine konkrete Datei; Muster ist keine Schreibfreigabe. |
| `lib/revision-stempel.ts` | `ff676e632fdf48c4cac5ea1714411dec` | Ein gemeinsamer reiner Prüfer erkennt fehlende Daten, Dubletten und veränderte Aufgaben. |
| `scripts/test-quality-sidecars.ts` | `5237a85756b8ae364dd200eea0b34d9a` | Abweichung eines Ranking-Belegs bedeutet `unranked`, nicht automatisch kaputte Aufgabe. |

Dies ist ausdrücklich nicht als heutiger DomiLingo-Laufzeitstand ausgegeben.
W0 kopiert weder Datenbankschreibwege noch die dortigen Freigabestati. Der
DomiGo-Entwurf erweitert die Bindung um Quellen, Richtungen und echte Ansichten.

**Ranking-Drift** bedeutet: Eine alte Rangbewertung passt nicht mehr; sie wird
unbenutzt (`unranked`). **Freigabe-Drift** bedeutet: Ein altes Ja beschreibt nicht
die aktuelle Aufgabe; es darf nicht freigeben. Keine dieser Regeln darf gültige
unveränderte historische Einzelbelege pauschal löschen.

## Gegenproben und verbleibende menschliche Prüfung

Die ausführbaren Prüfungen beschädigen Kopien im Speicher, nie Produktdateien:
Quellfingerabdruck ändern, Antwort ändern, eine Antwort in den tatsächlichen
Aufgabenrenderer einschmuggeln, Quelle als ungeprüft setzen, Kennung auslassen,
zweiten Paint-Zustand entfernen und alte Leserurteile auf geänderte Bindung
anwenden. Die jeweilige Sperre muss anschlagen.

Der HTML-Wächter verbietet Skripte, Ereignishandler, Schlüssel-Metadaten und
vorausgefüllte Eingaben. Er erkennt nicht jede denkbare sprachliche Lösungshilfe.
Eine schon vor dem Einfrieren versehentlich verratene Antwort muss durch
schlüsselfreies Gegenlesen erkannt werden. Die Antwort-Einschmuggel-Gegenprobe
beweist konkret, dass eine **nachträglich veränderte** Ansicht ihr altes Siegel
verliert; sie ist kein allgemeiner semantischer Leckdetektor.

Alle Mechanikprüfungen mit bekannten Schlüsseln heißen Selbstprüfung. Die beiden
unabhängigen Löser sehen nur die eingefrorenen Schülerseiten. Ihre Abweichungen
werden zuerst gegen Quelle und Auftragsverständnis untersucht. Ein Schlüssel
wird niemals bloß so angepasst, dass Löser und Maschine zufällig übereinstimmen.
