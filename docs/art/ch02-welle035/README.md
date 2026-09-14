# ch02 · welle-035 · Vorderseite Auto/Bus und c02 entzerrt

Nach-Prüfung ch02 (K1, K3). Kokis Entscheid 14.09.: Vorderseite malen, Wörter in front of/behind bleiben.

## Was entstand
- **Auto** (`auto_front.png`): großer, warm leuchtender Scheinwerfer mit Chromring, kleiner Kühlergrill, Stoßstange; Rücklicht klar rot.
- **Bus** (`bus_front.png`): großer runder Scheinwerfer, Grill, Chrom-Stoßstange; Rücklichter klar rot. Windschutzscheibe NICHT eingefärbt (sie liegt in `bus_base`, und Beat b06 setzt Pinguine in den Bus — eine undurchsichtige Scheibe hätte sie verdecken können).
- **c02** (`papagei_sturz_c02_missing_big_giraffe.png`): Altersballon »8« entfernt; es bleibt ein Vergleich (oben klein und groß, unten jetzt klein und leer).

## Wie
1. Referenz = die bestehenden Ebenen auf Magenta (Auto/Bus 1024², c02 im Original) → Codex-CLI `codex exec` mit dem eingebauten Bildwerkzeug im Bearbeiten-Modus (`prompt_*.txt`). Quellen und Prüfsummen: `sources.txt`.
2. `align.py`: das Ergebnis auf 512² bzw. 485×495 zurückskaliert und gegen die unveränderte Karosserie ausgerichtet — gemessen Maßstab 1,0, Versatz 0/0 (Masken-Abweichung 0,12 % Auto, 0,09 % Bus).
3. `composite.py`: NUR die Zonen übernommen, 8 px weich überblendet — Auto Nase x≥440/y≥328 und Heck x≤62/y≥330; Bus Nase x≥455/y≥362 und Heck x≤48/y≥362. Alles außerhalb bleibt Bildpunkt für Bildpunkt die alte Ebene. c02: nur die Ballon-Zone (x 357–463, y 55–224).
4. `strip-key-fringe --specks` (290 bzw. 123 Magenta-Randpixel repariert), `oxipng -o 4 --strip none`, Registrierungs-Trim nachgezogen (Breite +3 px durch den größeren Scheinwerfer/Stoßstange), `paint-art-manifest.json` neu erzeugt.

Geänderte sichtbare Bildpunkte: Auto 12 587 · Bus 6 605 · c02 9 302.
Positionen, Beats, Bänder: unverändert.

CODEX-BILDWERKZEUG · Übernahme EXEC welle-035 · Stilurteil bleibt bei Koki (welle-014/027).
