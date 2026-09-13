# CODEX DRAFT — NOT CANON

## Tor036: aktuelle Importreferenzen, unveränderte alte Lieferung

Der Schablonen-Selbsttest in `scripts/make-body-stencils.mjs` vergleicht die drei tatsächlich geänderten Körper jetzt mit ihren tatsächlich verwendeten Importmasken: P2-Ostdecke, P2-Ostboden und zusätzlich P3-Ostmauersims. Die beiden P2-Körper sind37 statt17Spalten breit; im P3-Körper entfällt das einzelne Türpodest. Die übrigen vier P2-Referenzen bleiben bei der historischen N6-Lieferung. Deren PNGs und die Masken des früheren Bücherwelt-Quellenpakets wurden nicht überschrieben.

Die drei aktuellen Referenzen müssen exakt im tatsächlichen Importmanifest als Clipmasken gebunden sein. Ihre PNG-Prüfsummen müssen zudem den tatsächlichen Importbelegen entsprechen. Der Test bindet somit registrierte Dateien, statt irgendeine neu erzeugte Vergleichsdatei als Wahrheit zu akzeptieren.

**Die vorhandene99%-Grenze für vollständige RGBA-Pixelgleichheit bleibt unverändert.** Für die drei aktuellen Raumkonturen gilt zusätzlich die präzise Geometrieanforderung: Kein Pflichtmaterialpixel darf Luft werden und kein Luftpixel darf Material werden. Dieser separate binäre Konturvergleich ist nötig, weil das einzelne verbotene P3-Podest die Bildgleichheit nur auf99,6126% senkt und somit durch die alte Farbpixeltoleranz unbemerkt passieren würde. Ein Grenzwert wurde nicht gelockert. Der bisherige interne Gegenversuch an der Pultreihe bleibt erhalten und fällt weiterhin auf96,522%.

## Wirkliche Prüfungen

`final-gate-stencil-positive.log`: offizieller Selbsttest Exit0; alle sieben Schablonen zu100,000% gleich, vorhandener interner Manipulationsversuch erkannt. Keine Neugenerierung oder Reimporte von Spielbildern.

`final-gate-stencil-tamper.py` baut eine getrennte Quellkopie mit eigenen Maskendateien. Keine Negativmutation berührt das Produkt:

| Fall | Ergebnis |
|---|---|
| Unveränderte Kopie |Exit0, alle7Referenzen grün |
| Aktuelle Ostdecken-Referenz durch echte alte1088px-Maske ersetzt |Exit1: aktuelle Maske stimmt nicht mit Importbeleg überein |
| Tatsächliche P3-Körperdeklaration um das entfernte Podest(60,14) erweitert |Exit1: Pflichtkontur weicht um4096Materie-/Luftpixel ab |
| Änderungen in der Kopie zurückgenommen |Exit0, alle7Referenzen wieder grün |

Einzelprotokolle und maschinenlesbare Ergebnisse stehen unter `final-gate-stencil-tamper/`. Der Podestfehler besteht aus einem echten geänderten Zeichen in der Körpermaske, bei unverändertem Blattmaß. Er wird daher nicht durch einen Dateifehler oder eine Dimensionsabweichung künstlich rot. `git diff --check` für die geänderte Skriptdatei ist grün.

## PR-Absatz

Der Schablonentest verwendete für zwei verbreiterte Raumkörper noch die archivierten alten Masken. Er prüft jetzt genau die drei geänderten Körper gegen ihre registrierten aktuellen Importmasken und erhält die vier unveränderten historischen Referenzen. Zusätzlich erkennt ein exakter Material-/Luftvergleich das entfernte einzelne Türpodest, das unter der unveränderten99%-Bildtoleranz sonst unbemerkt bliebe. Alle sieben Referenzen stimmen zu100% überein; zwei isolierte echte Rückfälle auf alte Referenz beziehungsweise altes Podest werden erkannt. Historische Lieferbilder und normale Spielbilder bleiben unverändert.
