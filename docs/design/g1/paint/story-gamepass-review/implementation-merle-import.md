# CODEX DRAFT — NOT CANON

# Merle-Import mit deklariertem vollständigem Quellausschnitt

13.09.2026. Die unabhängige Diagnose in `import-diagnosis.md` wurde vor Änderung gelesen. Die ausgesparte Ecke ist kein Teil einer verwendeten Figur; violette echte Fransen innerhalb einer Pose werden weiterhin geprüft und nur mit vorhandener Nachbarfarbe gemäß bestehendem ausdrücklichem Vertrag behandelt.

## Ergebnis

**36 Spiel-PNG-Stems installiert,20 verschiedene vollständige Zeichnungen aus5 freigegebenen Originalen.** Roots vorhandenes Manifest enthielt28Stems. Acht vorhandene ältere Auffangdateien wurden zusätzlich auf freigegebene neue Zustandsbilder gebunden: merle_c/d→Ruhe, merle_run→Gehpose, pencilcase_burst/open0/open1/open2→offenes leeres Penal, pencilcase_shake→geschlossenes leeres Penal. Diese Wiederholungen sind statische Bindungen, keine erfundenen Animationsbilder. Die Bildidentität bleibt in allen vorhandenen Merle-/Penal-Dateien konsistent.

Alle20 einzigartigen Ausgaben auf dem Kontaktbogen angesehen; Merles Grundfassung, Singen, Bücher-in-Tasche und offenes Penal zusätzlich groß geprüft. Konturen, Hände, Zöpfe und Möbelteile vollständig; offene Fenster transparent. Keine UI-/Engine-/Anim-Datei geändert, keine Commits.

## Enger Importervertrag

`sourceCrop` deklariert x/y/width/height sowie die **vollständigen foregroundBounds**. Alle Rechtecke müssen ganzzahlig, positiv und im Original liegen; der Crop muss die deklarierte vollständige Figur enthalten. Für Merle stammen die Grenzen direkt aus dem bereits vorliegenden `originals.manifest.json`, erweitert um6Quellpixel, nicht nach roten Pixelbefunden verengt. `source-crop-provenance.json` bindet alle36Stems an Originalhash und Regions-ID.

Der Importer verwendet sein bestehendes `registerPixels` für den1:1Quellausschnitt VOR Hintergrund-/Fransenprüfung. Die Manifestachsen bleiben im Originalkoordinatensystem. Originale Abtastkoordinaten werden zuerst berechnet, dann um den Cropursprung verschoben; dadurch bleiben auch halbe/interpolierte Pixelwerte bytegleich. Außerhalb des Crop liegende Samples bleiben transparent.

Original-PNG-Hash und Original-RGBA-Hash, Originalmaße, Cropgrenzen, Crop-RGBA-Hash/maße, verschobene Achsen und finale Ausgabehashes werden getrennt protokolliert. `sourceChromaMatte` wird jetzt wie die vorhandene Ausgabeoption vorab validiert. Keine Deckkraft-, Suchradius-, Farbfamilien- oder Fransenregel geändert; das bestehende Alpha1-Selbsttestpixel bleibt ausdrücklich erhalten.

## Beweise

- Importer-Selbsttest **17Gruppen grün**: bisherige Verträge plus vollständige Cropgeometrie, Ganzzahl-/Bruchsample-Gleichheit, transparente Außensamples, Out-of-bounds, angeschnittene deklarierte Figur, entfernte Alpha3-Ecke und Vorvalidierung falscher Palette.
- Echte Manipulationsprobe in Laborkopie: vollständige Figurencontainment-Sicherung ausgeschaltet; Selbsttest wird mit „Missing expected exception“ rot, Exit1. Echter Importer nicht manipuliert.
- Tatsächlicher Import grün. **0 verbleibende Quell-/Ausgabefransen und Specks** in allen36Ausgaben.
- Alle5 verwendeten Original-PNGs weiterhin bytegleich zu ihrer bestehenden Quellliste.
- Alle28 wiederholten ersten Ausgaben trotz Manifestergänzung byteidentisch.
- Bei jeder deklarierten Quellfarbsaumbehandlung bleibt die komplette Alpha-Prüfsumme gleich.

Rohprotokolle im Berichtordner: `merle-import-selftest.log`, `merle-crop-tamper.log`, `merle-source-crop-import.log`. Repo-Belege unter `docs/art/ch01-story-gamepass/merle/`: `import-report.json`, `installed-stems.json`, `source-crop-provenance.json`, `state-aliases.json` und Kontaktübersicht.

## Federpenal-Fenster in finalen PNG-Pixeln

Beide Zustände haben **744×440Pixel**. Geschlossen enthalten die zwölf durch Stäbe getrennten transparenten Fensterflächen zusammen die Hüllbox **x122,y115,w435,h217**. Offen liegt das Hauptfenster in **x101,y113,w424,h215**. Diese Hüllboxen enthalten gerundete Ecken; sie sind keine Behauptung, jeder Boxpixel sei transparent. Offene Türlöcher liegen rechts außerhalb des Hauptfensters. Exakte Alpha-Komponenten in `merle-case-window-geometry.json`.

Die Werte sind lokale PNG-Koordinaten. Root setzt die Mitschülerin hinter die gemalten Stäbe, berücksichtigt diese Fenstergeometrie und übernimmt die Welt-/UI-Skalierung. Art-Katalog und sichtbare Spielintegration sind durch diese Importbahn nicht abschließend geprüft.

