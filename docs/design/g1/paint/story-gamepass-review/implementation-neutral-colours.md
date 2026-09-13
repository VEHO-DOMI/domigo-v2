# CODEX DRAFT — NOT CANON

# Zehn echte Farben einschließlich Schwarz, Weiß und Grau

13.09.2026. Umsetzung des begrenzten Folgeauftrags. Keine Commits. Neue Bilder werden nicht vorweg als richtig bestätigt.

## Geänderter Vertrag

Eine Wiederherstellkarte mit einzelnem Ziel **black, white oder grey** benötigt jetzt ausdrücklich `curseVisual: "violet-ink"`. Dasselbe gilt, wenn grey unter den anderen Farboptionen vorkommt. Eine graue Schere kann wiederhergestellt werden, weil die violette Tintenverhexung sichtbar verschwindet; ihr vorheriger Zustand darf nicht bloß dieselbe graue Grundzeichnung ohne Unterschied sein. Root hat die Welt- und Kartenbindung dieses Feldes übernommen. Das Schema bewahrt den Wert beim Laden; ein unbekannter Wert wie `grey-wash` wird abgelehnt.

Der normale bunte Wiederherstellvorgang bleibt unverändert. Auch `black and white` im Pinguin durchläuft weiterhin seinen bestehenden Zweifarbenvertrag; die neue Prüfung wird nur für einzelne neutrale Zielfarben aufgerufen.

## Änderungen je Datei und eigene Gegenprobe

### packages/content-schema/src/game-tasks.ts

`RestoreTask` bewahrt das neue optionale Literal-Feld. `taskInvariantErrors` ersetzt das pauschale Grau-Verbot durch die gezielte Pflicht zum unabhängigen Tintenmerkmal. Der fehlende Wert bei jedem neutralen Ziel wird rot, der richtige bleibt beim Parsen erhalten. Die Aufgaben pen/heft/scissors tragen ihn.

**Echte Gegenprobe am Prüfer:** In einer Laborkopie wurde die neue Bedingung mit `false` ausgeschaltet. Der fokussierte Testsatz fiel mit Exit1 und „black without an independent cue is visually ambiguous“. Der echte Quelltext wurde nicht manipuliert. Rohdateien `neutral-schema-tamper.ts`, `neutral-schema-tamper.test.ts`, `neutral-schema-tamper.log` im Berichtordner.

### packages/content-schema/src/test/game-tasks.test.ts

Ein fokussierter neuer Test prüft gültige Schwarz-/Weiß-/Grau-Karten und fehlende Cue-Werte, das tatsächliche Überleben des Feldes durch das geschlossene Schema, Grau als Ablenker, ungültiges Cue-Literal, unveränderte bunte Karte und unveränderte Zweifarbenkarte. Gesamter vorhandener Testdateilauf **12/12 grün**, Exit0. `neutral-schema-tests.log`.

### content/corpus/stories/g1.st.lost-pages/paint/ch01.policy.json

Farbklasse jetzt alle zehn nachgewiesenen Unit-Wörter einschließlich grey. Begründung nennt den sichtbaren unabhängigen Tintenvertrag statt „Grau ist nie eine Antwort“. Zusätzlich neue Körperbindung `nounDe.pairs.obj_chair: Stuhl`, alte `nounDe.captives.rsc.chair.r1` entfernt, weil der Stuhl nun gewöhnliche Wiederherstell-Entität ist. Keine neue Wörterbuchvokabel erfunden. Alle zehn Wörter existieren im Unit-Lexikon und in der bestehenden Korpusklasse.

**Gegenprobe der Bedeutung:** Die neutrale Aufgabe ohne ihren Vertrag wird vom Schema rot. Der Welt-/Nomenbindungsnachweis des neuen Stuhls ist noch Teil der Root-Integration; kein neuer Ausnahmeblock verdeckt den bisherigen Käfig.

### content/corpus/units/g1-u01/lexicon-classes.json

Nur die ausdrücklich freigegebene stale Prosa `classes.g1u01.x.colours.narrowedByPolicy` geändert. Die Wortliste war bereits vollständig und blieb unverändert. Sie belegt wörtlich die zehn Farben aus SB p.12. Keine anderen Lexeme geändert.

### content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json

In diesem Folgeauftrag ausschließlich `curseVisual: "violet-ink"` an `enc.pen.r1`, `enc.heft.r1`, `enc.obj-scissors.r1` hinzugefügt. Alle 61 Aufgaben parsen jetzt mit dem neuen Schema, **Exit0**, keine Schemaprobleme. `neutral-schema-current.json`.

### scripts/check-colour-truth.mjs

Neue, getrennte Einzel-Neutral-Messung `measureSingleNeutral` und echte Karten-/Quellenprüfung `checkSingleNeutral`. Die alte bunte Messfunktion ist bytegleich geblieben; die bestehenden Zweifarbendateien wurden nicht geändert. Gemessene Hashbelege in `neutral-unchanged-instruments.json`:

- Bunte Messfunktion vorher/nachher identisch, SHA256 `3df2b297b3e935f45a00af36fc37fbdff7e4ac60b59ce23092ea2e5e9a063ccc`.
- `achromatic-colour.mjs` vorher/nachher identisch.
- `achromatic-readings.mjs` vorher/nachher identisch.

Der neue Zweig wird im tatsächlichen Dateilauf für einen neutralen Zielwert oder eine vorhandene neutrale Lesart eingesetzt. Er bestätigt nicht einfach den verlangten Farbwert. Ohne kapitelgebundene Lesart ist das Ergebnis **UNBELEGT und rot**, nicht null Prozent und nicht pauschal grün.

## Was das Instrument wirklich misst

Die neutrale Materiallesart besteht aus Quelle, Maßen, Farbwort, Begründung und einer **vor der Messung festgelegten anatomischen Körpermaske**. Die Maske ist die Vereinigung nicht überlappender Innenrechtecke. Sie darf nicht nachträglich nur die zufällig passenden Farbpixel auswählen. Quelle und Koordinaten werden mit SHA256 gebunden. Es geht um den Stiftkörper, Heftdeckel und Scherenkörper, nicht um Augen, Papierlicht oder Umriss.

- Pixel zählen nur bei Deckkraft mindestens200, wie im bisherigen Farbinstrument.
- Das gesamte deckende Objekt wird um zwei Pixel nach innen verkleinert. Rand, weicher Saum und bloße Kontur entscheiden dadurch nicht über die Farbe.
- Schwarz übernimmt die bestehenden sicheren Pinguin-Grenzen: maximaler RGB-Kanal105, Kanalabstand höchstens32.
- Weiß übernimmt dessen Grenzen: jeder Kanal mindestens185, Helligkeit mindestens200, Kanalabstand höchstens32. Creme und Gelb sind damit nicht Weiß.
- Grau liegt in einem getrennten mittleren Helligkeitsbereich110–185, Kanalabstand höchstens24. Diese konservative neue Zone hat Abstand zu Schwarz und Weiß; dunkles Blau oder Blau-Grau mit hohem Farbabstand ist nicht neutrales Grau.
- Jede Maskenregion ist mindestens20×20 Pixel. Mindestens80% der Region müssen deckendes inneres Zielmaterial sein, mindestens70% eine zusammenhängende Zielmasse und mindestens45% noch nach zwei Pixeln Erosion erhalten bleiben. Die drei Flächenkriterien entsprechen den vorhandenen breiten Körperregionen des Zweifarbinstruments.
- Zusätzlich deckt die anatomische Maske mindestens35% des gesamten Objektinneren ab. Ein kleines Auge kann damit nicht ein weißes Heft beweisen.
- Zusätzlich tragen mindestens60% des **gesamten deckenden Objektinneren** die verlangte neutrale Farbe. Ein neutraler Schatten unter einem farbigen Objekt ist damit keine schwarze Materiallesart. Dieser unabhängige Nenner verhindert ein passend ausgesuchtes kleines Maskenfeld.

Die beiden globalen Mindestanteile und die Grauzone sind neue klare Anforderungen an die bestellten neutralen Bilder, **keine aus den alten falschen Bildern abgeleitete Anpassung**. Die alte gelbe Feder und das grüne Heft bleiben rot. Sobald die neuen Bilder vorliegen, sind ihre tatsächlichen Werte und die sichtbare Materialwahl zu prüfen. Ein Grenzwert ist keine Behauptung menschlicher Farbakzeptanz; diese braucht den späteren blinden Bildleser.

## Neue Selbsttests und instrumentelle Gegenproben

**23 neue Einzel-Neutral-Fälle**, vier grün und neunzehn absichtlich rot. Der vollständige vorhandene Gate-Selbsttest ist jetzt **52 Messfälle + 11 Kopiefälle grün**, Exit0. `neutral-selftest.log`.

Die negativen Bildfälle prüfen warme Creme statt Weiß, dunkles gesättigtes Blau statt Schwarz, farbiges Blau-Grau statt neutralem Grau, zu hell/zu dunkel für Grau, transparente RGB-Farbe, schwarze Kontur um bunten Körper, echten neutralen Schatten auf buntem Körper, kleines Auge statt Körpermaske, verstreute Flecken, Transparenzloch und überlappende Masken. Datenfälle prüfen Quellenänderung, falsche Maße, fehlende Maske, fehlendes Tintenmerkmal, zweite neutrale Wahl, fehlende Lesart und abweichendes Zielfarbwort. Eine kleine bunte Verzierung auf einem ausreichend großen weißen Körper bleibt grün.

Vier **echte Ausschaltproben** am Gate in Laborkopien, alle gewollt Exit1:

| Ausgeschaltete Sicherung | Tatsächlich anschlagender negativer Fall |
|---|---|
| Mindestanteil am ganzen Objektinneren | Echter schwarzer Schatten auf blauem Körper würde sonst als schwarz gelten. |
| Mindestanteil der anatomischen Maske | Kleines weißes Auge würde sonst als genügend Körpernachweis gelten. |
| Quellen-Hash | Veränderte Quelldatei würde sonst ihre alte Bestätigung behalten. |
| Chromagrenze für Grau | Blau-Grau würde sonst fälschlich als neutrales Grau gelten. |

`neutral-tamper-results.json` nennt Exitcodes und die tatsächlich rot gewordenen Selbsttests. Die echten Dateien wurden für diese Ausschaltproben nicht bearbeitet.

Zusätzlich wurde das **wirkliche alte grüne Heft** mit passendem Quellenhash, passenden Maßen und absichtlich falscher Weiß-Lesart durch dieselbe Probe geschickt. Exit1; im markierten grünen Körperfeld **0% Weiß**, global nur **0,32% Weiß**. Das ist eine negative Prüfspezifikation, keine ratifizierte Lesart. `neutral-negative-existing-green-book.json/.log`.

## Wie Root neue Kunst ratifiziert

Die Tabelle `SINGLE_NEUTRAL_READINGS` ist absichtlich leer. Für jeden tatsächlich gelieferten Gegenstand kommt eine überprüfte Zeile hinein, beispielsweise:

```js
"ch01/pen": {
  word: "black",
  sourceSha256: "SHA256 der finalen PNG-Bytes",
  width: 512,
  height: 512,
  regions: [
    { id: "barrel", x: 100, y: 100, w: 80, h: 160 }
  ],
  why: "Hier konkret Körpermaterial, ausgeschlossene Details und gemessene Werte beschreiben."
}
```

Die Beispielkoordinaten und512Maße sind **keine** Behauptung über die noch nicht gelieferte Kunst. Pro Bild messen. Eine Probe gegen exakt dasselbe Instrument ist vorhanden:

```sh
node scripts/check-colour-truth.mjs --measure-single /absolut/bild.png /absolut/lesart.json
```

Sie schreibt ausdrücklich `single-source authoring probe, not the chapter gate`. Die normale komplette Farbprüfung danach bindet zusätzlich an die **wirkliche** Karte und verwendet keine automatisch erzeugte Ersatzkarte. Eine positive Einzelprobe ersetzt deshalb weder Gesamtgate noch Bildleser.

## Ehrlicher aktueller Gesamtstatus

Der normale Farbcheck ist mit der unveränderten alten Kunst **rot, Exit1, acht Verstöße**:

- Drei neutrale Ziele haben noch keine ratifizierte neue Lesart.
- Tisch grün widerspricht bisher braunem Bild und alter Lesart.
- Spitzer rot widerspricht bisher blauem Bild und alter Lesart.
- Neues gelbes Stuhlbild `obj_chair_a.png` fehlt.

Der bestehende schwarz-weiße Pinguin bleibt im selben tatsächlichen Lauf grün mit100% deckenden Materialregionen. Die Schultasche wird vom alten Buntinstrument weiterhin als warme/braune Lesart behandelt; Root muss zusätzlich die ausdrücklich gewünschte klar braune Neuzeichnung liefern. Kein Farbtamper wurde mit einer Ausnahme verdeckt. `neutral-current-art.log`.

Nicht erledigt durch diesen Teilauftrag: endgültige Bildbestellungen, konkrete Lesartkoordinaten auf neuen PNGs, violette Tintenrenderung, Namen-/Storyzustand, Kleidungs-Lernabdeckung und vollständige lokale PR-Batterie. Diese Aufgaben bleiben beim Elternteam.

Abschließende gezielte Prüfung: `pnpm --filter @domigo/content-schema typecheck` Exit0. Die Korpusdatei wurde gegen HEAD strukturell verglichen; außer der freigegebenen `narrowedByPolicy`-Prosa ist sie unverändert. Die Policy hat exakt zehn unterschiedliche Farben, alle zehn im unveränderten Korpusbestand.
