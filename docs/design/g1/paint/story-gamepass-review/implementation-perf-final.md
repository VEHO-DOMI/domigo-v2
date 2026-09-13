# CODEX DRAFT — NOT CANON

## Abschließender Produktionsvergleich

### PERF-WÄCHTER

Unmittelbar nacheinander, je drei Läufe aller fünf Abschnitte.

Bau: 7161948936faabc5eab2fd51457e90616599424d · Quelle: /api/version — der gemessene Server hat es selbst gesagt (GEPRÜFT)

Bau: 1fd980c5f1b8d19e07bf90b952eccccc635c3f6c · Quelle: /api/version — der gemessene Server hat es selbst gesagt (GEPRÜFT)

| Phase | laden (ms) | bau+aufbau (ms) | Erstbild GPU (ms) | eingeschwungen (ms) | fps |
|---|---|---|---|---|---|
| p1 vorher / nachher | 615.7 / 402.2 | 83.6 / 120.8 | 1.3 / 2.1 | 1.0 / 1.1 | 60.3 / 60.2 |
| p2 vorher / nachher | 445.3 / 643.8 | 78.0 / 131.4 | 2.0 / 2.6 | 0.8 / 1.0 | 60.3 / 60.4 |
| p3 vorher / nachher | 521.8 / 394.7 | 83.5 / 100.4 | 2.5 / 2.9 | 0.9 / 1.0 | 60.4 / 60.4 |
| p4 vorher / nachher | 335.1 / 412.0 | 36.6 / 43.3 | 0.8 / 1.4 | 0.4 / 1.6 | 60.2 / 60.2 |
| p9 vorher / nachher | 441.5 / 211.8 | 91.3 / 45.5 | 1.1 / 1.6 | 1.1 / 0.8 | 60.3 / 60.3 |

Gemessen auf demselben Mac mit separatem Chrome und eigener leerer Profilablage, `headless=new`, `visibilityState=visible`, `hidden=false`, Produktionsbau und warm=1. Kontrollseiten 61.00 / 61.05 fps, Schwelle58. Instrument unverändert, SHA256 `3135559c7ef770a588d444d9baabcbffba4aa7d8ac08cb9594659fba9df4b7ad`. Beide Server melden ihre tatsächliche abweichende Commitkennung. Alle15+15 Läufe vollständig, keine verworfenen Versuche.

**Leistungsgrenze bleibt offen:** Grafikarbeit je Bild liegt in dieser unmittelbar gepaarten Reihe in allen Räumen unter4ms, Erstbild unter35ms, Bildrate60,2–60,4fps. `create()` liegt jedoch in p1 bei116,6ms und p2 bei125,0ms über dem100-ms-Ziel; p3/p4/p9 bei96,1/42,2/41,6ms. Das ist keine vollständige Budgetfreigabe. Die vorhandenen Aufbaukosten-Schulden D-534/D-535 bleiben offen; die neuen Bilder erhöhen insbesondere die Verarbeitung der Figuren und Tintenfläche. Kein Verschieben von Arbeit aus dem Messbereich, kein geänderter Grenzwert.

**Messmakel und Wiederholung:** Die zunächst getrennt gemessenen Reihen stehen unverändert unter `perf-baseline/`, `perf-final/` und `perf-final-1fd980c5/`. In letzterer überschritten p3/p9 mit7,18/8,78ms die eingeschwungene Grenze; der frühere Zwischenkopf überschritt sie in p1/p2. Deshalb wurde genau diese kontrollierte, unmittelbar gepaarte Reihe durchgeführt, nicht der schönste Einzelraum ausgewählt. Ihr Vorher-Lauf hatte Lastmittel3,59→13,99, Nachher11,10→6,77; beide melden fremde Server3350 sowie den jeweils anderen Vergleichsserver. Die Bildrate ist belegt, kleine Timingunterschiede sind kein kausaler Geschwindigkeitsgewinn. Rohausgaben und fünf Szenenabbilder je Fassung unter `CH01_STORY_SPIELPASS/perf-paired/before` und `after`. Die einmalige Bildverzeichnis-Erzeugung wurde vor dem finalen Kopf separat committet. Beide finale Produktionsbauten Exit0; tatsächlicher Code-/Bildbestand danach sauber.


Die gepaarte Reihe wurde erst nach einem tatsächlich fehlschlagenden Timingbefund angeordnet. Die früheren roten Raumzeiten werden weder gelöscht noch durch Nullwerte ersetzt. Ihre unterschiedlich betroffenen Räume, einschließlich des praktisch unveränderten Bonusraums, waren der konkrete Anlass für einen unmittelbar aufeinanderfolgenden Vergleich. Beide Vergleichsserver sind anhand ihres tatsächlichen Arbeitsordners identifiziert und nachher beendet;3350 bleibt unangetastet.

`session-records.json` und `server-stop.json` halten echte Sitzungsausgänge fest. Beide letzten Messreihen haben jeweils genau drei Versuche je Raum, keine Lücken, sichtbare Seiten und grüne Kontrollmessungen. Dies belegt die gemessenen Bildraten und diese unmittelbar gepaarte Reihe, keine allgemeine Garantie unter jeder Rechnerlast.
