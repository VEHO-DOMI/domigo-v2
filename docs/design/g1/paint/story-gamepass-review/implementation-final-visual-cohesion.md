# CODEX DRAFT — NOT CANON

# Kapitel 1: abschließende Bildkohärenz

Stand: 2026-09-13. Begrenzte Implementierungsbahn; kein Ersatz für die vollständige Tor-Batterie und den unabhängigen blinden Leser vor dem Pull Request.

## Ergebnis

Das Klassenfoto erscheint jetzt als das tatsächliche Bild mit den 15 Mitschülern in einem eigens gemalten Fotokäfig. Einfache Holzleisten, zwei dünne Stäbe und ein kleines Schloss ersetzen die alte Schultasche mit Riemen. Nach dem Öffnen bleibt das vollständige Foto in derselben Weltposition sichtbar. Die Tinte nutzt ihre gemalte Textur bis zum jeweiligen Beckenboden. Im letzten Comicbild schweben tatsächlich goldene A/B/C. Alle sieben Comicbilder einschließlich Verwandlung sind geladen. Merles nach ihrer Rettung benötigte Bilder werden vorab ehrlich in der Bildmengenprüfung gezählt. Das tatsächlich eingetippte Hello sitzt auf der neuen unteren grünen Schreibfläche der Tafel.

## Geänderte Verbindungen

- `PaintScene.ts`: registrierte Fotoebene und geschlossener/offener Rahmen; übernommene zentrale Höhe 54 aus Roots `anim.ts`; keine Spiegelung der Gesichter; passende Ursprünge auch beim Schatten. Volltiefe Tinte und kontinuierliche Texturkoordinaten. Merle-Bilder über den regulären Bildumfang statt heimlicher Nachladung. Gift-Anker benutzt dasselbe Schreibflächenmaß wie die Finale-Karte; keine gelbe Farbfläche über Kapitel-1-Tafelgesicht.
- `artScope.ts`: Rahmenzustände, tatsächliches Klassenfoto, alle sieben Comicbilder und maximal erreichbare Merle-Animationen registriert. Laufzeit lädt Merle in späteren Räumen erst nach tatsächlicher Rettung; der Standard für Prüfungen zählt den maximal erreichbaren Zustand.
- `StoryComic.tsx`: drei echte Textglyphen im Stil der Sammelbuchstaben, auf Bildkoordinaten verankert. Bild und Buchstaben bewegen sich gemeinsam; reduzierte Bewegung hält sie still. Keine Rastermalerei durch Code.
- `story/picture-windows.ts`: gemessene Bildfenster und Rahmenursprünge.
- `story/ink-paint.ts`: reine Berechnung aller Flüssigkeitsrechtecke und gemeinsamer Texturkoordinaten, ohne Physikänderung.
- `story/final-visual-cohesion.test.ts`, `artScope.test.ts`: tatsächliche Dateien, Transparenz, Pflichtbilder, gestufte Flüssigkeit und Budgetzustände geprüft. Die zusätzliche Comic-Erwartung wurde ausdrücklich genehmigt; bestehende Erwartungen bleiben erhalten.
- Level: ausschließlich zusätzliches `p4-cage5.params.shellArt = "photo_frame_cage"` innerhalb dieser Bahn. Andere vorhandene Änderungen stammen aus den koordinierten Aufgabenbahnen.

## Neue gemalte Rahmen und Import

Quelle: `docs/art/ch01-story-gamepass/photo-cage/`. Dort liegen Original, exakter Prompt, Importmanifest, Importbericht, Messdatei und README. Der bestehende registrierte Importer blieb unverändert. Er schneidet die zwei vollständigen Bildzustände aus, entfernt die vereinbarte magenta Schlüsselfarbe und vereinheitlicht deren Außenmaße; keine neu programmierten Bildpixel, keine Verzerrung.

Original 1536 × 1024, SHA-256 `88be2e248e0c9b73629c651857979e5c26742c2175fba5cd817b9b529ee11ffe`.

| Laufzeitbild | Maße | Bytes | SHA-256 |
| --- | --- | --- | --- |
| photo_frame_cage_a.png | 768 × 674 | 302401 | b5ebc910b4ec73cb511e86cc2ba5340c2187ee5cf3d197981e27d0a30238195f |
| photo_frame_cage_open.png | 768 × 674 | 351466 | 67e738318e61ae0f1436a758a8de1e5b1d7cfc15188d340d05a14a7ce9221a8c |

Geschlossener Ursprung (378/768, 550/674), offener Ursprung (307/768, 550/674). Registrierte Innenfenster geschlossen (157,155,442,316), offen (86,155,442,316), jeweils 6 Pixel Innenabstand. Das vollständige Foto wird proportional eingepasst: Breite 430, Höhe 296.8466, links geschlossen 163/offen 92, oben 168.1534. Beide Zustände besitzen damit denselben Mittelpunkt in der Welt. Von 127280 gemessenen Fotopixeln sind geschlossen 114256 vollständig frei (89.7674 %), offen alle 127280 (100 %). Die geschlossenen dünnen Stäbe dürfen Teile bedecken; kein Gesicht wird aus der Fotodatei ausgeschnitten. Die geöffnete Klappe liegt neben dem Bild.

## Tinte und Bildmengen

Das aktuelle zweite Becken umfasst Spalten 24–54, Zeilen 20–25. Der Code verarbeitet zusätzlich unterschiedliche Spaltentiefen und voneinander getrennte Becken; jede Flüssigkeitszelle erhält genau eine vollständig deckende gemalte Fläche. Das tatsächliche `ink_liquid.png` besitzt in jedem Pixel Alpha 255. Die frühere flache violette Körperfüllung wird bei verfügbarer Kapitel-1-Malerei nicht mehr angelegt. Die Oberfläche bleibt darüber separat sichtbar. Benachbarte Teilflächen teilen dieselben Weltkoordinaten, damit ihre Textur nicht springt. Pausen halten den Simulationstakt an; reduzierte Bewegung hält den Texturversatz an.

Merles zusätzliche Bilddateien belegen zusammen 5.136.187 komprimierte Bytes. Die Prüfung zählt sie überall, wo die gerettete Begleiterin später sichtbar werden kann. Beim Messstand vor Roots abschließender Tür-Neumalerei ergaben sich:

| Phase | Laufzeit noch nicht gerettet | Laufzeit gerettet / Prüfmaximum |
| --- | ---: | ---: |
| p1 | 25117871 | 30254058 |
| p2 | 36059075 | 36059075 |
| p3 | 26905604 | 32041791 |
| p4 | 24159865 | 29296052 |
| p9 | 13507687 | 18643874 |

Die vorhandenen Bildbudgets bestanden damit. Diese Tabelle dokumentiert Dateimengen, keinen gemessenen GPU-Speicherverbrauch.

## Echte Browserbelege

Alle nachstehenden Screenshots wurden tatsächlich geöffnet und visuell geprüft. Eigene isolierte Browserprofile; sämtliche dazu gestarteten Browser sind geschlossen.

- `cohesion-browser.json`, `cohesion-prologue.log`, `cohesion-browser-1.png` bis `cohesion-browser-7.png`: sieben normale Comicseiten, alle Bilder naturalWidth 1536, erreichbare Fußzeile, Verwandlung sichtbar. Im siebten Bild schweben A/B/C im Bildraum, ohne Gesicht zu verdecken.
- `cohesion-world-p2.png`, `.json`, `.log`: tatsächliche Spielansicht des vollständig gemalten Tintenbeckens. Die öffentliche Prüf-Warpfunktion diente dem Kamerazugang; dies ist ein Darstellungsbeleg und kein vollständiger Spielpfad.
- `cohesion-world-photo-closed.png`: neues geschlossenes Fotokäfigstück in der tatsächlichen Szene.
- `cohesion-world-photo-open.png`: tatsächlich gelöste Fotofrage und geöffneter Käfig, vollständiges Klassenfoto bleibt sichtbar.
- `cohesion-earned-class-photo.png`: tatsächlich ausgelöste Klassenfotoübersicht mit den 15 Namen und Gesichtern.
- `cohesion-world-hello-name.png`, `cohesion-world-hello.png`: tatsächlich eingegebenes Hello auf Karte und Welt-Tafel, keine gelbe Fläche über dem Gesicht.
- `cohesion-earned-world.json`: Messwerte und Prüfmethodik des verdienten Endzustands.
- `art-photo-cage/photo-frame-browser.png`: zusätzliche maßstäbliche Registrierungsansicht beider Rahmenzustände; ausdrücklich kein Gameplaybeleg.

Für den Endzustand wurde der vorhandene öffentliche Entwicklungs-Prüfzugang in Phase 4 benutzt. Der Kampf lief über den vorhandenen Eingabetreiber mit drei tatsächlich beobachteten Kritzelschicht-Übergängen 3→2→1→0. Das Finale wurde über die echte Eingabe und den OK-Knopf beantwortet, der Name Bildprobe über das echte Namensfeld und die Fotofrage über den tatsächlichen Antwortknopf. Kein Setzen von Lebenspunkten, Rettungsflags oder Simulationsflags. Öffentliche Warp-Aufrufe ermöglichten den Kamerazugang. Weil der Kampf nicht beim exakten Starttakt begann, ist dies **kein** Ersatz für die exakte Eingabebandprüfung der Tor-Batterie.

Gemessene Welt-Tafel: Hello 28.1326 × 14.6875 bei (82.5215,221.2344), registrierte Schreibfläche 39.9805 × 16.6875 mit demselben Mittelpunkt. Das Wort passt vollständig in die grüne Fläche. Die Szenenberechnung benutzt die tatsächlichen Körpermaße und denselben Quellbereich (80,264,230,96 auf 384 × 512) wie die Finale-Karte. Der alte `tafel_clean`-Stamm war bereits keine aktive Auflage; diese Bahn beseitigt keinen fälschlich behaupteten aktiven Renderer.

## Abgewiesene Zwischenstände

Die alte Schultasche überdeckte mehr als die Hälfte des Fotos durch Tasche und Riemen; dieser Versuch wurde verworfen und durch das neue gemalte Fotokäfigstück ersetzt. `cohesion-world-p4.png` zeigt einen alten serverseitig zwischengespeicherten Levelstand und ist **kein Erfolgsbeleg**. Ein Neustart des Entwicklungsservers aktualisierte die Bilddateiliste und den Levelcache. Auch das zunächst fehlende Verwandlungsbild kam vom alten Dateilisten-Cache, nicht von einem tatsächlich fehlenden PNG. Die sieben Comicstämme sind inzwischen zusätzlich ausdrücklich registriert.

Ein erster Selektor für das Finale traf kein Eingabefeld; danach wurde das tatsächliche Feld gefunden und normal bedient. Erst die nachfolgende echte Eingabe wurde als Erfolg gewertet. Diese Prüfung behauptet weder eine vollständige Rettung Merles in diesem Phase-4-Direktlauf noch einen kompletten Kapitel-Durchlauf.

## Tests

`final-visual-cohesion-tests.log`: 3 Dateien, 51 bestandene Tests. Darunter sieben neue Prüfungen für Flüssigkeitszellen, Texturkontinuität, tatsächliche vollständig deckende Tinte, Foto-Sichtfenster, echten fehlenden-PNG-Test in einem isolierten Dateiverzeichnis, alle sieben Comicbilder und Merles maximales/verdientes Bildpaket. Die fehlende-PNG-Prüfung kopiert echte Rahmenbilder in ein temporäres Verzeichnis und entfernt dort tatsächlich den offenen Zustand; das Original im Repository bleibt erhalten.

`final-visual-cohesion-typecheck.log`: abschließende TypeScript-Prüfung bestanden, Prozess-Endcode 0 (`tsc --noEmit`). Die vollständige Tor-Batterie, unabhängige Blindprüfung, Commit, PR und Merge liegen bei Root.

## Absatz für den Pull Request

Das Klassenfoto erscheint im Kapitel nun in einem eigens gemalten Holzrahmen mit schmalen Gitterstäben; nach dem Öffnen bleibt das vollständige Foto aller 15 Mitschüler sichtbar. Gemalte Tinte reicht bis an jeden Beckenboden, die im Prolog angekündigten Sammelbuchstaben stehen tatsächlich im Bild und das eingetippte Hello sitzt auf der grünen Schreibfläche der Tafel. Die Bildprüfung berücksichtigt außerdem sämtliche später benötigten Merle-Animationen und alle sieben Comicbilder. 51 gezielte Tests und echte Browseransichten belegen die neuen Verbindungen; die vollständigen Kapitelprüfungen werden separat ausgewiesen.
