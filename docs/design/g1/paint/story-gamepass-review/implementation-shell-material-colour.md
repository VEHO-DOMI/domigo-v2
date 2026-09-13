# CODEX DRAFT — NOT CANON

Die ausdrücklich als Foto- und Geräteverschluss registrierten Rahmen bleiben nun schon geschlossen in ihren gemalten Materialfarben. `washAlphaFor` gibt ausschließlich für `role=cage` mit exakt `shellArt=photo_frame_cage` oder `device_locker` null zurück. Ein Schloss wird geöffnet; die Handlung behauptet keine Farbrestaurierung dieser Rahmen. Gewöhnliche alte Käfige behalten ihren bisherigen Grauschleier, ebenso Merles schrittweise verblassender Personenfluch. Keine PNG- oder Geometrieänderung.

`locked-shell-material.test.ts` prüft beide Zustände, reduzierte Bewegung, mehrere Zeitpunkte und präzisen Opt-in; falscher Rollenname/Schlüssel darf die Regel nicht auslösen. `locked-shell-material-tests.log`: vier Materialtests plus drei Merle-Tests grün, ein Worker. `shell-material-tamper/` enthält isolierte Kopie, grüne Baseline und echten Rückfall: Entfernen der Opt-in-Zeile führt zu zwei roten Prüfungen mit tatsächlichem Grauwert0,72 statt0. Produktquelle blieb während der Gegenprobe unverändert.

## Tatsächlicher Weltbeleg

- `shell-photo-material-closed-world.png`: geschlossener goldener Holzrahmen, keine graue Metallwirkung; angesehen.
- `shell-photo-material-open-world.png`: derselbe Materialcharakter nach tatsächlichem Aufsperren, alle15 Gesichter sichtbar; angesehen. Daneben steht das tatsächlich eingegebene Hello auf der Tafel.
- `shell-photo-hint-dismissed.json`, `shell-photo-open-world.json`: tatsächliche Rahmenzustände und Weltkoordinaten. Der Grauschleier ist im Renderobjekt in beiden Fällen unsichtbar (`visible:false`); dessen unbenutztes gespeichertes alpha1 ist keine sichtbare Auflage.
- Zugang über vorhandenen Entwickler-Raumeinstieg/warp, echte drei Wischfortschritte durch vorhandenen Kampf-Treiber mit aktuellem Eingabeband (`shell-photo-fight-access.json`), tatsächliches Hello und Name über Eingabefelder, echte Fotofrage und Weiter. Keine HP- oder Rettungsflags verändert.
- Die erste Datei `shell-material-photo-closed.png` zeigt noch eine Bossaufgabe; sie ist kein erfolgreicher Weltbeleg. Maßgeblich sind die beiden oben genannten Dateien mit `material-…-world`.

Der eigene Chrome mit getrenntem Profil wurde danach vollständig geschlossen. Die Materialregel für das Gerätefach ist durch denselben präzisen Opt-in und den Test belegt; in dieser letzten Runde entstand kein zusätzlicher Gerätefach-Screenshot.

**PR-Absatz:** Foto- und Geräteverschlüsse behalten vor und nach dem Aufsperren ihre gemalten Materialfarben. Dadurch wird der goldene Holzrahmen nicht mehr vorübergehend als grauer Metallkäfig dargestellt. Die Änderung gilt nur für die beiden registrierten Verschlussarten; andere Grauschleier und Merles Fluch bleiben erhalten. Präzise Zustandsprüfungen, ein tatsächlicher Fehlerrückfall und ein geschlossener/offener Fotovergleich im Spiel belegen die Korrektur.
