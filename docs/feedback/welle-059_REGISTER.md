# welle-059 · FOURTEEN — Feedback-Register

**CODEX DRAFT — NOT CANON · ZUR PRÜFUNG.** Grundlage: Kokis vollständige Sprachnotiz im Chat am 20.09.2026. Order MD5 `aaee68946a706a5664c4b510d31514a6`; Ausgangsstand `eeb3e4ee`. Nachtrag Koki: **“you are the architect mate – you do all this right now”**. Damit werden auch die mittleren/grossen Punkte hier umgesetzt; die Order-Regel **kein Self-Merge** bleibt. Cast-Blatt / PR 456 ist ausdrücklich ausserhalb dieser Karte.

Die Geschichte, Figurenentscheidungen, bestehende Zuschauer-Kurve und Schlusszeilen bleiben die Grundlage. „Triple-A“ ist Kokis Qualitätsziel, keine bereits bewiesene Eigenschaft. Schülerbegeisterung braucht nach der technischen Prüfung einen echten Spieldurchgang mit Koki bzw. Kindern.

| Punkt · Originalzitat | Fläche | Art | Deutung und konkrete Umsetzung | Aufwand | Risiko bei Aufnahme |
|---|---|---|---|---|---|
| K-01 · „die Story allein an sich, habe ich selber ausgedacht. Ich finde die sehr, sehr gut“ | `/play/3/ch01…ch14`; `story.json` | Inhalt/Sprache | Handlung und moralischen Bogen erhalten; nur Aufgabenrahmen präzisieren. | klein | keins |
| K-02 · „die Aufgaben … wirklich so gut einzubetten“ | ch02–14; `story.json`, `comprehension.json` | Spieldesign | Die beiden allgemeinen Script-Aufgaben je Folge werden zu handverfassten Handlungen des Drehbuchteams. | gross | prüfen: Szenenbeleg, Antwortabstand, Sprachniveau |
| K-03 · „nicht repetitive … abwechslungsreich, verschiedene Formate“ | ch02–14; dieselben Dateien, gemeinsame Aufgabenanzeige | Spieldesign | Formate passend zum Zweck wechseln; keine identische Folge aus Auswahl, Lücke und Fehlerkorrektur in jeder Episode. | gross | prüfen: echte Bedienbarkeit und eindeutige Lösungen |
| K-04 · „in der Logik der Story … Spaß … die Story voranzutreiben“ | Aufgabenrahmen, Rückmeldung, Episodenabschluss; `NovelGame.tsx` | Spieldesign | Sichtbarer Arbeitsfortschritt; eine Lösung bringt die Szene weiter; nach dem Bruch keine fingierte Veröffentlichung. | mittel | prüfen: kein Fortschritt aus ungespeicherten Erfolgsbehauptungen |
| K-05 · „die Auflösungen, die Effekte“ | Rückmeldungen, Kommentarabschnitt, Schlussbild | Spieldesign | Rückmeldung sagt, was am Text gelungen ist; Kommentare passen zur Phase, Folge 11 behauptet bei Fehlern keinen sauberen Take. Späte Folgen jubeln nicht über Bens Verletzung. | mittel | prüfen: Fehler sind kein moralisches Versagen des Kindes |
| K-06 · „die XP-Gains, wie sie in der Story funktionieren“ | `TaskTake`, `attempt-outbox.ts` | Technik/Tempo | Lernbelohnung nur aus bestätigter Serverantwort; Zuschauerzahlen nicht als berechnete Punkte ausgeben. Wartende und fehlgeschlagene Speicherung sichtbar machen. | mittel | prüfen: ein Bewertungsweg, keine neue Punkte-Währung |
| K-07 · „Likes, Shares, Comments … Views … gut getrackt“ | `economy.json`, `novel-copy.ts`, Kanalübersicht | Spieldesign | Ein gemeinsamer, fiktionaler Kanalstand pro Folge; Views/Likes/Abos nicht an Antworten koppeln. Teilen und Kommentare erhalten ausdrücklich verfasste Story-Zahlen, keine vorgetäuschten realen YouTube-Messungen. | mittel | prüfen: Zahlen nur aus einer Quelle; keine Belohnung für Grausamkeit |
| K-08 · „schön anschaulich … Visualisierungen … konsistent“ | Episodenfläche und Kanalübersicht; `packages/game-novel` | Kunst | Einheitliche Kennzahlenkarten und nachvollziehbare Veränderung zum vorigen Kanalstand; bestehende Bilder erhalten, keine Cast-Neugestaltung. | mittel | prüfen: kleines Handy, Hell/Dunkel, Lesbarkeit und Laufzeit |
| K-09 · „die Geschichte gut erzählt … Triple-A Storyline“ | Aufgabenplatzierung und Abschlüsse aller 14 Folgen | Spieldesign | Inszenierung trägt den bestehenden emotionalen Bogen: Aufbau, Unbehagen, Bruch, ehrlicher Neuanfang. Keine neuen Story-Zweige. | gross | prüfen: unabhängige Inhaltslesung; Qualitätsziel ist kein Messwert |
| K-10 · „emotional … packt und bindet … von Level zu Level weiterspielen“ | Episodenende und `/play/3` | Spieldesign | Freigegebene nächste Folge direkt erreichbar; an der Stelle stoppen können, ohne Druck, Autoplay oder künstlichen Zeit-Zwang. | mittel | prüfen: Freigabe aus tatsächlichen Release-Daten, keine Spoiler |

**Zählung:** 10 Punkte: Inhalt/Sprache 1 · Spieldesign 7 · Technik/Tempo 1 · Kunst 1 · Fehler 0 · Frage zurück 0. Aufwand: klein 1 · mittel 6 · gross 3. K-01 ist die sofort verbindliche Schutzregel; die übrigen Punkte sind nach Kokis Nachtrag in derselben Karte umgesetzt.

## Architekturentscheidungen

- **Aufgaben:** Das bereits gelieferte Kapitel 1 ist das Kalibrierbeispiel: story-eigene `.ci.`-Aufgaben, gemeinsamer Renderer und gemeinsamer Bewertungsweg. Neue Aufgaben erscheinen nur im Spiel, nicht ungewollt in normalen Tests. Bekannte Grenze dieses vorhandenen Wegs: `.ci.` wird als Lesen gespeichert und schreibt keine eigene Grammatik-Wiederholungswarteschlange.
- **Belohnung:** „Writing points“ bezeichnet nur die vorhandenen Erfahrungspunkte. Keine zweite Vergabe, kein neuer Speicherpool. Views, Likes, Shares, Kommentare und Abos gehören zur verfassten Geschichte und erklären deren Reichweite, nicht die Leistung des Kindes.
- **Inszenierung:** Arbeit an einem Text, Öffentlichkeit und persönlicher Konflikt erhalten unterschiedliche Abschlüsse. Kapitel 12/13 veröffentlichen kein Video. Der Wechsel bleibt in der bestehenden Handlung.
- **Kunst:** Keine neuen Charakterbilder; das offene Cast-Blatt bleibt unberührt. Hier wird die Lesbarkeit der vorhandenen Oberfläche verbessert.
- **Überprüfung:** Aufgaben blind lösen; gültige und ungültige Antworten gegen die echte Bewertungsfunktion prüfen; alle benannten Repo-Tore, Spielprobe und Vorher/Nachher-Bilder. Nicht durchgeführte Prüfungen werden ausdrücklich UNVERIFIZIERT genannt.

## Nachweise und Abschluss

Umgesetzt: 26 neue handverfasste Aufgaben und 26 Bindungen in Folge 2–14; gemeinsame Kennzahlenanzeige, bestätigte Lernpunkte, passende Episodenabschlüsse, freigegebene Weiterführung und Wiederholungsweg. Zwei unabhängige Leser lösten alle 26 Aufgaben; ihre 63 Antworten samt Varianten bestehen die echte Bewertung. Die Spielprobe deckt alle 14 Folgen, 142 Szenen und 54 Aufgabenplätze ab. Details, Exit-Codes, Bilder und Messwerte stehen im PR und Board-Bericht; Rohbelege bleiben ausserhalb des Repos unter `~/Code/welle059-evidence/`.

UNVERIFIZIERT: dauerhafte Speicherung gegen eine echte Datenbank, physisches Schülerhandy und emotionale Wirkung im Unterricht. Die lokale Spielprobe verwendet für erfolgreiche Buchungen nachgebildete Serverantworten; ein eigener Fehlerfall verwendet die echte lokale API bei absichtlich unerreichbarer Datenbank. Alle zehn Punkte sind für die technische und gestalterische Prüfung umgesetzt, nicht als „Triple-A bewiesen“ abgenommen.
