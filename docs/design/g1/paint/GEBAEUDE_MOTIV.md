# DAS GEBÄUDE-MOTIV — das Schulhaus im Spiel ist ein echtes Haus

**Kanon-Entscheid (Koki, 2026-08-13).** Das Schulgebäude im gemalten Buch bekommt als
Motiv **das echte Gebäude der Schule**, für die dieses Spiel gebaut wird — „sodass es
nicht generisch KI generiert wird und etwas authentischer wirkt". Gilt ab Kapitel 1 und
für jede spätere Kulisse, die das Haus zeigt.

## Die Schule

**Gymnasium und wirtschaftskundliches Realgymnasium des Schulvereins der
Dominikanerinnen**, Schlossberggasse 17, 1130 Wien (Hacking, Bezirk Hietzing).

## Was belegt ist (recherchiert 2026-08-13, Quellen unten)

| Bau | Belegte Merkmale |
|---|---|
| **Klosterkirche „Maria, Königin des hl. Rosenkranzes"** (1885–86; Pläne Richard Jordan, Baumeister Josef Schmalzhofer) | **neugotisch** · **Sichtziegelbau** · **„starke Doppelturmfassade"** · **„mächtiger Dreiecksgiebel"** zur Schlossberggasse · wirkt „mehr an eine Kirche als an eine Kapelle" |
| **Zweite Schulkapelle** | vorhanden, **ohne** Türme |
| **Schulhaus** (1896/97–1904), Seuttergasse | **„dreigeschoßiger Sichtziegelbau mit mittlerem Giebelaufsatz"** |
| **Internatsbau** (1964–66, **Gustav Peichl**) | moderner Nachkriegsbau neben den Ziegelbauten; heute Volksschule, Hort, Küche, Speisesaal, Turnsaal, Festsaal |
| **Gelände** | Gartengelände mit **großem Rasenspielfeld**; Campus am Hang, Bauten mehrerer Epochen nebeneinander |

## ★ DAS MOTIV — aus KOKIS FOTO der Vorderseite (2026-08-13)

**Korrektur der ersten Fassung:** die Text-Recherche hatte die **Doppeltürme** als
Leitmotiv gesetzt. Die gehören zur **Kirche** — ein anderes Haus auf demselben Areal.
Kokis Foto zeigt die **Schulfassade von vorn**, und die trägt ein ganz anderes und viel
charakteristischeres Zeichen. **Das Foto schlägt die Textquelle** (es zeigt, was ist;
die Beschreibungen ließen genau diese Merkmale aus).

**Die vier Merkmale, die die Wiedererkennung tragen:**

1. **★ Eine Reihe kleiner spitzer Dachtürmchen** mit Spitzenknäufen entlang der
   Dachkante — das auffälligste Zeichen der Silhouette, in keiner Textquelle erwähnt.
2. **★ Helle, fast cremefarbene Fenstereinfassungen und waagrechte Bänder gegen roten
   Sichtziegel** — die eigentliche Farbsignatur des Hauses. „Ziegel" allein reicht nicht;
   es ist der KONTRAST hell-auf-rot, der das Haus ausmacht.
3. **Ein langer, hoher Ziegelbau am Hang** — vier sichtbare Geschosse, die Fassade zieht
   sich in die Länge, die Straße liegt unterhalb, Bäume stehen davor.
4. **Eine helle Figur hoch an der Fassade**, über einem Giebel — eine Heiligenfigur.

**Ebenfalls auf dem Foto, Entscheidung offen:** die Fassade trägt **große Buchstaben im
Ziegel** („SCHULEN DER …"). Ob das Spiel die Schrift zeigt, ist Kokis Entscheidung
(→ offene Zeile unten), weil es die Schule namentlich sichtbar macht.

**Links im Bild** ein heller, moderner, flach gedeckter Anbau — vermutlich Peichls
Nachkriegsbau; er ist bewusst NICHT Teil des Motivs.

Diese vier zusammen SIND das Motiv. Alles andere darf schief, weich und handgemalt sein
(der naive Look, doc 45 §G2, entschieden am selben Tag).

**Die Kirche bleibt ein EIGENES Motiv** (Doppelturmfassade + Dreiecksgiebel,
Sichtziegel, neugotisch) — für Kulissen, die sie zeigen, nicht für das Schulhaus.

## Was NICHT belegt ist — und deshalb nicht behauptet wird

Die Quellen beschreiben **nicht**: die genaue Ziegelfarbe, die Fensterformen (Spitzbogen,
Rundbogen, rechteckig), die Dachform im Detail, die Hofaufteilung. Ergänzungen dort
folgen dem Stil der belegten Merkmale (ein neugotischer Wiener Sichtziegelbau der 1880er
trägt üblicherweise rot-braunen Ziegel und Spitzbogenfenster), **aber markante
Einzelheiten werden nicht erfunden** — kein Uhrturm, keine Rosette, keine Freitreppe,
keine Kuppel. Im Zweifel weglassen: wer die Schule kennt, soll nicken; niemand soll
etwas sehen, das es nicht gibt.

**Durch Kokis Foto (2026-08-13) beantwortet:** Ziegelfarbe = warmes Rot-Braun; die
Fenster sind hoch und rechteckig mit HELLEN Einfassungen; die Dachlandschaft trägt die
Türmchen-Reihe. Das Foto liegt als Referenz im Kunst-Lab
(`~/Code/codex-art-lab/reference/schulhaus_vorderseite.jpg`).

**Noch offen:** die genaue Fensterform im obersten Geschoß (rund- oder spitzbogig?) —
und ob die Fassaden-Schrift im Spiel auftauchen soll.

## Grenzen

Eine **gemalte Hommage, keine Fotografie** — Gouache im naiven Stil. Keine Menschen,
keine Schrift, kein Schul-Logo, kein Wappen auf den Blättern.

## Umsetzung

Bestellt in `~/Code/codex-art-lab/CODEX_MASTER_PROMPT_AQ8_KAPITEL_AUFTAKT.md` (Blatt 3
`schulhaus_ch01.png`: Areal in Farbe · dasselbe entfärbt · Ziegelgiebel-Nahaufnahme).
Verdrahtet in Session **J1**.
⚠ Import-Falle: rot-brauner Sichtziegel darf nicht ins Magenta kippen — der Vordergrund
hält ≥ 150 RGB-Summenabstand zu `#FF00FF` (AQ7 erreichte 243–295, das ist die Messlatte).

## Quellen

* `https://de.wikipedia.org/wiki/Dominikanerinnenkonvent_(Wien)`
* `https://www.dominikanerinnen.at/ahs/ueber-uns/geschichte`
* `https://hietzing.at/kunst-kultur/page-geschichte.php?id=71`
