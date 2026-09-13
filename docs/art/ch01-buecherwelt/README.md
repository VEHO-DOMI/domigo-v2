# CODEX DRAFT — NOT CANON

Dieses Quellenpaket hält die **40 tatsächlich eingebauten Bilder** der Bücherwelt-Neufassung fest. Zehn finale Importmanifeste verwenden 28 originale gemalte PNGs, einen daraus abgeleiteten Hofmöbel-Atlas und 17 Alphamasken. Es enthält keine verworfenen Rohbilder. Der final überarbeitete westliche Bücherkörper der Nachtklasse und die vier vollständigen Bonusbuch-Plattformen sind nun enthalten. Die obsoleten Ziele `plat_desk`, `plat_bench_2` und `plat_bundle_1` sowie die beiden ausschließlich dafür benötigten Bonus-Rohquellen wurden entfernt.

Der tatsächliche erneute Import mit Node **v24.20.0** hat **40/40 PNGs bytegleich** zur aufgezeichneten Prüfsumme **und** zum gleichzeitig vorhandenen öffentlichen Bildbestand erzeugt. Auch der vorgeschaltete Hofmöbel-Atlas wurde aus seiner Rohquelle bytegleich rekonstruiert. Belege: [reproduction.json](evidence/reproduction.json), [run.json](evidence/run.json), die zehn aktuellen `evidence/*-import.json` und [inventory.json](inventory.json). Eine SHA-256-Prüfsumme ist der Fingerabdruck sämtlicher Dateibytes; hier wurde keine bloße optische Ähnlichkeit als Gleichheit gewertet.

| Finales Manifest | Bilder | Inhalt |
|---|---:|---|
| [hall](manifests/hall.json) | 7 | Fünf Hallenmöbel, Hallenboden, Hintergrund |
| [east-platform](manifests/east-platform.json) | 1 | Östliches Hallenpodest |
| [courtyard-bodies](manifests/courtyard-bodies.json) | 3 | Hofterrasse, Ostmauer, Mittelpfeiler |
| [night-classroom](manifests/night-classroom.json) | 12 | Sechs zusammenhängende Körper und sechs Möbel |
| [courtyard-furniture](manifests/courtyard-furniture.json) | 3 | Bank, Fenstersims, Säule |
| [courtyard-plants](manifests/courtyard-plants.json) | 1 | Hofpflanzenband |
| [arena-bonus](manifests/arena-bonus.json) | 5 | Fünf zusammenhängende Körper |
| [arena-background](manifests/arena-background.json) | 3 | Zwei Hallenwände und Stuhlband |
| [bonus-refinement](manifests/bonus-refinement.json) | 4 | Ganzes Folio und Bücherstapel, jeweils zwei und drei Zellen breit |
| [night-west-refinement](manifests/night-west-refinement.json) | 1 | Finaler westlicher Bücherkörper der Nachtklasse |
| **Summe** | **40** | **40 unterschiedliche Dateistems, keine Alias-Doppelzählung** |

## Wiederholen

Vom Repository-Wurzelverzeichnis aus, mit vorhandenen Projektabhängigkeiten:

```sh
export PATH=/opt/homebrew/opt/node\@24/bin:$PATH
node -v
nice -n 15 node docs/art/ch01-buecherwelt/reproduce.mjs --dest /private/tmp/ch01-buecherwelt-repro-new
```

Der Zielordner muss neu sein und sein Elternordner bereits existieren. Das Skript lehnt vorhandene Ziele sowie Ziele innerhalb des Repositorys auch nach Auflösung eines symbolischen Verweises ab. Es schreibt deshalb weder öffentliche Bilder noch Quellen um. Für einen zweiten Lauf einen weiteren neuen Zielnamen verwenden.

Vor dem Import werden Quellen, Masken, Manifeste und die aufgezeichnete Werkzeugkette gegen ihre Prüfsummen geprüft. Der Import verwendet den vorhandenen [Importer](../import-ch01-buecherwelt.mjs) und dessen bestehende Saumbereinigung in `scripts/key-fringe.mjs`; es gibt keine zweite, abweichende Bildpipeline im Pack. PNGjs und die Projektabhängigkeiten werden aus dem Repository geladen. Änderungen an der festgehaltenen Werkzeugkette führen absichtlich zu einer Guard-Meldung; ihre Auswirkungen müssen zuerst geprüft werden.

Die zehn gespeicherten Manifeste enthalten nur relative Quellen- und Maskenpfade. Der Wiederholer erstellt seine ausführbaren Zwischenmanifeste ausschließlich im externen Zielordner. Einzelmanifeste lassen sich auch direkt mit `docs/art/import-ch01-buecherwelt.mjs --manifest … --dest …` importieren; die vollständige Rohquellenprüfung einschließlich Atlas-Vorschritt und öffentlicher Hashgegenprobe übernimmt jedoch `reproduce.mjs`.

## Registrierung und Quellenentscheidung

Passpunkte ordnen Zielpixeln vorhandene Quellpixel zu. Zwischen ihnen verwendet der Importer seine unveränderte monotone, stückweise lineare Abbildung und eine alpha-gewichtete bilineare Abtastung. Dies ist eine dokumentierte Größenregistrierung vorhandener Malerei, keine Erzeugung neuer gemalter Gegenstände. Stellen außerhalb der Quelle bleiben transparent. Masken können Deckkraft ausschließlich auf null reduzieren; sie füllen keine Löcher.

- Hallenhintergrund: **`hall-background-source-v3.png`**, finale Passpunkte und explizites `chromaMatte: "no-violet"`. Die frühere v2-Hintergrundquelle ist nicht enthalten. Hallenmöbel verwenden dagegen ausdrücklich die tatsächlich finale `platforms-hall-source-v2.png`.
- Die zwölf ursprünglichen Nachtklassenbilder: `registration-manifest.json` als Provenienz; finaler separater Folio-v2-Entwurf sowie die zuletzt korrigierten Mittelbahn- und Pultpasspunkte. Der gemeinsame Möbelatlas bleibt erforderlich für die übrigen fünf Möbel.
- Hofmöbel: `source-original-v2.png` (2172×724) wird **vor** der Freistellung vollständig gleichförmig auf 1536×512 registriert. Die Pixelzentren-Abbildung ist im Wiederholer explizit gespeichert. Ihr Ergebnis muss exakt der gespeicherten `atlas-3x512.png` entsprechen. Erst danach gelten die drei finalen Ausschnitte.
- Hofpflanzen: `source-final.png`; keine verworfene erste Quelle. Arena: Podestquelle v2, frische zweite Wand `wall-b-fresh.png`, tatsächlich verwendetes Stuhlbild `chairs-edit2.png`.
- `no-violet` ist nur bei den sechs entsprechend deklarierten nichtvioletten Motiven aktiviert: Hallenhintergrund, drei Hofmöbel, Pflanzenband und Stuhlband. Es ist keine globale Lockerung des Saumprüfers. Die einzelnen Importberichte führen tatsächliche Farbkorrekturen und Alpha-Prüfsummen auf.

`inventory.json` dokumentiert je Eingabe Herkunft relativ zum ursprünglichen Laborpaket, Größe und Prüfsumme. Alle notwendigen Masken liegen eigenständig unter `masks/`; keine iCloud- oder Laborverknüpfung ist zum Import erforderlich. Die Berichtsdateien verwenden `pack`, `repository` und `reproduction` als lesbare Ortspräfixe, statt maschinenspezifische absolute Quellpfade zu verlangen.

Die ergänzte P2-West-Lieferung verwendet ausschließlich `p2-west-refinement/manifest.json` (bytegleich zur finalen `manifest-v2.json`), die tatsächlich verwendete `edit-v2.png` und die Alpha des alten Originalbildes als Clipmaske. Der Originalrahmen bleibt 2048×1116. Ziel-SHA: `145fb9613dbb5952263a064328266f111deacc514284e0da228465ca8fe0ab62`. Die Kopie des alten Bildes dient ausschließlich als deckkraftreduzierende Maske, nicht als zu übernehmende Malerei.

Die Bonusmanifeste enthalten zwei rohe v2-Motive und vier Ausgaben. Die 128px-Versionen sind in Breite und Höhe exakt zwei Drittel der 192px-Versionen; beide Größen werden unmittelbar aus derselben Rohquelle abgetastet. Keine alten Einzellzell-Bündel oder Bankstücke bleiben als aktive Packziele übrig.

`evidence/history-38/` bewahrt den vorangehenden, inzwischen überholten 38-Bilder-Nachweis samt damaligem Inventar. Seine Hashes und Dateiverweise sind historische Belege und kein aktueller Importauftrag; die dazu obsoleten Bildquellen werden nicht weiter mitgeliefert. Maßgeblich sind ausschließlich das Wurzelinventar, die zehn aktuellen Manifeste und der aktuelle 40/40-Nachweis.

## Promptvorgaben

[ROOT_PROMPTS.md](ROOT_PROMPTS.md) enthält Roots **Promptvorgaben** als abschließende Arbeitsvorgaben. Sie sind ausdrücklich von nachweislich gespeicherten Originalaufrufen zu unterscheiden. Die tatsächlich erhaltenen Agentenprompts liegen unter `prompts/`, unverändert kopiert und in `inventory.json` gehasht. Bei finalen Bildbearbeitungen sind die erforderlichen vorangehenden Prompttexte mit enthalten, ohne deren verworfene Bildzwischenstände mitzuliefern. Historische absolute Bildpfade in solchen Originalprotokollen sind Quellenmetadaten, keine Importabhängigkeit.

Das deterministische Versprechen beginnt bei den gespeicherten Roh-PNGs: Ein erneuter generativer Bildaufruf muss nicht dieselben Bildbytes ergeben. Stilreferenzen oder verworfene Varianten werden deshalb nicht als notwendige Importquellen ausgegeben.

## Umfang und Beleggrenze

- 28 rohe PNGs: **46.200.653 Bytes**.
- Zusätzlich ein deterministisch abgeleiteter Atlas: **856.675 Bytes**; der komplette Ordner `sources/` umfasst damit **47.057.328 Bytes**.
- 17 Clipmasken: **1.758.912 Bytes**.
- Größte einzelne Rohquelle: `sources/east-platform/ostpodest-source.png`, **2.535.957 Bytes**.
- Der genaue vollständige Paketumfang ohne Roots separat verwalteten Promptkatalog steht in `evidence/package-size.json`.

Dieser Nachweis prüft Quellenherkunft, Registrierung und bytegleiche Bildausgabe. Er ersetzt keine Spielansicht, Bildlesung, Silhouettenprüfung oder Leistungsmessung und verändert deren Ergebnisse nicht. Öffentliche PNGs, Kompositionsdaten, Level, Prüfer und Bildimporter wurden durch die Erstellung dieses Quellenpakets nicht verändert.
