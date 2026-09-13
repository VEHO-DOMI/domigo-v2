# CODEX DRAFT — NOT CANON

# Zehn Gegenstandsfarben: registrierter Import und offene Neutralmasken

13.09.2026. Keine Commits. Schreibumfang: Objekt-/Rock-PNGs in Kapitel1, eigener Quellenordner und Farb-Lesarten in `scripts/check-colour-truth.mjs`. Keine Engine-, Aufgaben- oder Schemadatei verändert.

## Tatsächlich eingebaut

**44 PNG-Stems**, davon23 bestehende ersetzt und21 hinzugefügt. Grundlage sind22 verschiedene gemalte Einzelzellen. Kein synthetisches Zwischenbild. Der vorhandene Importer `docs/art/import-ch01-buecherwelt.mjs` wurde unverändert benutzt, mit seinem bestehenden Schlüsselfarben- und Fransenverfahren. Kein `chromaMatte`, kein Farbfilter, keine Schwellenlockerung.

| Stems | Tatsächliche Vorlage / Bedeutung |
|---|---|
| obj_book_a | Neues **liegendes** blaues geschlossenes Buch, vertrauter Einband mit Goldwinkeln. |
| obj_schoolbag_a | Braune Schultasche, Petrolkante/Schnallen/Bücher bewahrt, kein Gesicht. |
| obj_desk_a | Grün gestrichener Tisch einschließlich Gestell. |
| obj_chair_a und obj_chair | Derselbe gewöhnliche gelbe Schulstuhl; beide derzeitigen Bindungsformen. |
| cloth_skirt_a | Deutlich längerer Faltenrock, vertrauter graubrauner Stoff. |
| pen_a/b/dazed, eraser_a/b/dazed, heft_a/b/dazed, obj_scissors_a/b/dazed, obj_gluestick_a/b/dazed, obj_sharpener_a/b/dazed | Jeweils gleiche genehmigte Grundfassung. Statische Wiederholung ausdrücklich gewollt, keine erfundene Ruheanimation. |
| Jeweils *_telegraph für die sechs Angreifer | Gezeichnete Ausholpose. |
| Jeweils *_act und *_run für Füllfeder/Radiergummi/Heft/Klebestift/Spitzer | Gezeichnete kurze Angriffsbewegung nach links. |
| obj_scissors_act und obj_scissors_run | **Grundfassung**, weil geschlossene Schnapppose rot ist. Keine falsche Schere eingespielt. |
| eraser_squash | Niedrige gezeichnete Aushol-/Stauchpose. |
| heft_bank | Gezeichnete nach links kippende Flug-/Angriffsansicht. |

Der Klebestift wurde nach Root-Befund neu als **echter zylindrischer Klebestift mit flacher Kappe und geriffeltem Drehfuß** in drei Posen gemalt. Die alte Flüssigkleberflasche mit Tülle wurde in keiner neuen Spielbindung verwendet. Alle tatsächlich vorhandenen alten Varianten der sechs Figuren wurden ersetzt; fehlende rest/turn-Zellen fallen auf dieselbe neue Grundfassung zurück.

Die endgültigen Bildausschnitte folgen der tatsächlich gemalten Figur. Ein Buch, das auf dem Rohblatt im freien Zwischenraum über eine nominale Zellgrenze reicht, wurde vollständig ausgewählt. Kleine Teile einer darüberliegenden Scherenzelle im nominellen Federfeld wurden durch den korrekten räumlichen Ausschnitt ausgeschlossen. Keine Figur wurde an einem Blattraster abgeschnitten.

## Prüfung der eingebauten bunten Bilder

Unveränderte Buntmessung, sieben Lesarten aktualisiert; Quellenhash und Bildbegründung jeweils mitgeführt:

| Gegenstand / Wort | Gemessene Familie | Anteil / Warmwinkel |
|---|---|---|
| Buch / blue | blue | 78.30%, Verhältnis3.61 |
| Tasche / brown | warm | 80.52%,30.476°; Petrol-/Buchakzente bleiben |
| Tisch / green | green | 79.03%, Verhältnis3.77 |
| Stuhl / yellow | warm | 99.995%,40.769° |
| Echter Klebestift / orange | warm | 100%,28.193° |
| Spitzer / red | warm | 99.995%,2.714° |
| Radiergummi / pink | pink | 99.216% |

Dies ist Autoren-/Instrumentenbefund, keine vorgetäuschte blinde Kinderakzeptanz. Die genaue Messreihe liegt im Quellenpaket. Die bunte Messfunktion ist byteidentisch, SHA256 `3df2b297b3e935f45a00af36fc37fbdff7e4ac60b59ce23092ea2e5e9a063ccc`.

Der historische Drift-Selbsttest benutzt nun seinen ausdrücklich historischen braunen Tisch mit35.7°, weil der echte Tisch jetzt grün ist. Die ursprüngliche positive/negative Warmton-Gegenprobe bleibt identisch. Echte Manipulationsprobe in einer Laborkopie: DRIFT6→100 lässt genau den negativen Orange-Ummaltest fehlschlagen, Exit1. Reales Instrument unverändert streng.

## Noch rote Neutralprüfung — wichtig

Die schon eingebauten, visuell genehmigten neutralen Figuren haben korrekte globale Farbanteile, aber keine ratifizierten vollständigen Materialmasken. Zwei geometrische Autorenentwürfe zeigten, dass breite Flächen lokal durch Metallreflexe, Gesicht oder Linierung unterteilt werden; keine dieser Masken wurde eingetragen.

Root bestellte daraufhin **einmalig** eine neue gemeinsame Materialzeichnung. Sie liegt unter `sources/neutral-material-figures.raw.png`, registriert separat in `S/imported-neutral-material/`. **Diese neue Serie ist noch NICHT in den Spiel-PNGs.** Sie muss nach Root-Messdesignprüfung ggf. über alle Zustandsfassungen konsistent übernommen werden.

Der geometrische Maskenplan für die neue Serie wurde VOR der ersten Materialmessung festgelegt; nur rein geometrische Mindestgrößen nach Herunterskalierung wurden vorher geprüft. Danach keine Anpassung anhand passender Pixel vorgenommen. Der vollständige, unveränderte Plan ist in `measurements/neutral-material-frozen-plan.json` enthalten.

| Neue Materialfigur | Global echter Zielanteil | Fester Maskenanteil | Tatsächlicher Befund |
|---|---:|---:|---|
| Schwarze Füllfeder | 81.77% | 33.04% | Alle8 lokalen Materialregionen bestehen80/70/45; Gesamtmaske kleiner als35%. |
| Weißes Heft | 80.70% | 30.36% | Eine innere Deckelkante wird durch dunkle Kontur geteilt; Gesamtmaske kleiner als35%. |
| Graue Schere | 76.33% | 30.33% | Ein schmaler geometrischer Bereich unterschreitet nach Skalierung20px; Gesamtmaske kleiner als35%. |

Für alle drei liefen die echten unveränderten `--measure-single`-CLI-Proben mit **Exit1**. Die exakten Quellenhashes, Maße, anatomischen Rechtecke und lokalen Ergebnisse sind unter `measurements/new-*-reading-proposal.json` und `measurements/new-*-actual-cli-probe.log` nachlesbar. Keine weitere Bildbestellung, keine nachträgliche Pixelwahl und keine Grenzwertänderung. Root übernimmt nun die Messdesignprüfung.

## Gesamttor und Selbsttests

- `check-colour-truth --selftest`: **52 Messfälle +11 Kopiefälle grün**.
- Normaler Farb-Gesamtlauf: **Exit1, vier Meldungen**: drei noch unratifizierte neutrale Körperlesarten plus die zugehörige Zählprüfung fehlender Lesarten. Keine weitere bunte Alt-Abweichung.
- Bestehender schwarzweißer Pinguin bleibt grün; unveränderter brauner Hund bleibt grün.
- Importberichte melden keine verbleibenden nach bestehender Regel erkannten Fransen/Specks. Keine neue Farbbereinigung aktiviert.

## Quellenpaket und noch nötige Integration

`docs/art/ch01-story-gamepass/objects/` enthält Rohquellen, alle exakten Prompts, Importmanifest, Importbericht, Quell-/Stem-Mapping, Vorher-/Nachherhashes, Messungen und Gegenproben. Rohbilder mit mehreren Zellen enthalten auch unbenutzte/verworfene Nachbarzellen; die Auswahl ist eindeutig im Manifest und in `source-to-stem.json` benannt. Das bloße Vorhandensein einer Rohzelle bedeutet keine Freigabe.

Root muss den automatisch erzeugten Art-Katalog neu bauen, damit neue Stems und Inhaltsversionen tatsächlich geladen werden, dann Weltgrößen/Bewegungszustände im Spiel ansehen. Dieser Teilauftrag hat den Katalog nicht editiert. Die neue Materialserie und neutralen Lesarten bleiben bis zur angekündigten Prüfung offen. Kein PR-/Merge-Gesamtpass behauptet.

