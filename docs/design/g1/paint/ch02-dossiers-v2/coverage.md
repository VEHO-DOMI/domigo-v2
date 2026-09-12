# CODEX DRAFT — NOT CANON
# ch02 · Abdeckung und Reserveplätze

**Status: 72 Karten ausgeschrieben; 56 Pflichtkarten und 16 Varianten. Die zwei Pflichtplätze je Ziel sind zwei verschiedene Karten-IDs. Die aktuelle reine Inhaltswiedergabe bestätigt alle 63 Ziele mit je zwei verschiedenen beantworteten Pflichtkarten.**

Grundlage ist R0 `COVERAGE_PLAN.md`; diese Fassung zieht die dortigen zwei Pflichtplätze unverändert in die gebauten Karten nach. Nenner: **52 Masterlisten-IDs (=48 verschiedene Einträge) plus elf Ergänzungsziele**. Die Wortbank-Quelle bleibt `content/corpus/units/g1-u02/wordbank.json`; Buchstellen stehen in `grounding` der jeweiligen Karte und im unabhängigen Quellenbericht des Labors.

Jedes Ziel erhält **drei Abrufplätze: zwei Pflicht + eine freiwillige Reserve**. Eine Reserve ist ein ausdrücklich benannter späterer Abruf an ihrem ursprünglichen Sprecher, kein 73. Kartentyp. Wo eine dritte geeignete Karte existiert, benutzt sie diese. Wo der 72er-Plan genau zwei Antwortkarten vorsieht, bietet sie eine davon erneut an (mit **↻** markiert). Diese Wiederholung zählt niemals als dritte verschiedene Anwendung und niemals zur Zwei-mal-Pflicht. So bleiben die 72 beauftragten Sprechakte erhalten, ohne eine falsche dritte Antwortkarte zu behaupten. Die Reserven sind als `taskSequenceV2.reserveSlots` im Level gebunden; ihr freiwilliger Aufruf ist seit PR #422 implementiert. 79 isolierte Motorfälle sind grün: alle 63 Reserveplätze einschließlich 21 bewusster Wiederholungen sowie 16 Varianten. Geprüft wurden tatsächlicher Abruf, Kontext/Szenenbindung, Schlüsselannahme, einmaliger Abschluss und Cursorfortschritt ohne zusätzliche Pflicht-ID. Diese Fälle sind keine vollständig gelaufenen freiwilligen Raumwege. Vollständige freiwillige Raumwege bleiben offen (D-1001).

`exercises` beansprucht nur beantworteten Wortgebrauch; ein falscher Ablenker zählt nicht. Bei Zuordnungskarten zählen beide gelesenen Spalten, aber nicht als freie Wortproduktion. `at` wird nicht aus At last, `in` nicht bloß aus Year 7 und `on` nicht bloß aus go on gutgeschrieben. Die vier doppelten Ortswort-IDs bleiben transparent doppelt geführt.

| Ziel-ID / Zusatz | Pflichtplatz 1 | Pflichtplatz 2 | Reserveplatz → Karte | Abruf bei |
|---|---|---|---|---|
| `g1u02.w.tree` | A13 | C06 | `r-tree` → D01 | `p4-guardian` |
| `g1u02.w.monkey` | B06 | D03 | `r-monkey` → B02 | `p2-affe` |
| `g1u02.w.parrot` | A07 | D02 | `r-parrot` → A11 | `p1-buehne-papagei` |
| `g1u02.w.giraffe` | B06 | C02 | `r-giraffe` → B09 | `p2-parkgruppe` |
| `g1u02.w.train` | B18 | C09 | `r-train` → A03 | `p1-schubkarre` |
| `g1u02.w.penguin` | A06 | B06 | `r-penguin` → A02 | `p1-schubkarre` |
| `g1u02.w.guide` | A01 | C09 | `r-guide` → A18 | `p1-drehkreuz` |
| `g1u02.w.lion` | C09 | D01 | `r-lion` → B03 | `p2-affe` |
| `g1u02.w.next-to` | A07 | B06 | `r-next-to` → A07 ↻ | `p1-buehne-papagei` |
| `g1u02.w.in` | A08 | B06 | `r-in` → A08 ↻ | `p1-buehne-papagei` |
| `g1u02.w.behind` | A13 | B07 | `r-behind` → A11 | `p1-buehne-papagei` |
| `g1u02.w.under` | A09 | B07 | `r-under` → D04 | `p4-guardian` |
| `g1u02.w.on` | A10 | B06 | `r-on` → A14 | `p1-buehne-buddy` |
| `g1u02.w.in-front-of` | A12 | B07 | `r-in-front-of` → A12 ↻ | `p1-buehne-papagei` |
| `g1u02.w.zoo` | A01 | B08 | `r-zoo` → C04 | `p3-papagei` |
| `g1u02.w.beautiful` | C14 | D02 | `r-beautiful` → C14 ↻ | `p3-cage-stein` |
| `g1u02.w.behind-2` | A13 | B07 | `r-behind-2` → A11 | `p1-buehne-papagei` |
| `g1u02.w.big` | C02 | C06 | `r-big` → C10 | `p3-baumhaus-gruppe` |
| `g1u02.w.in-front-of-2` | A12 | B07 | `r-in-front-of-2` → A12 ↻ | `p1-buehne-papagei` |
| `g1u02.w.next-to-2` | A07 | B06 | `r-next-to-2` → A07 ↻ | `p1-buehne-papagei` |
| `g1u02.w.under-2` | A09 | B07 | `r-under-2` → D04 | `p4-guardian` |
| `g1u02.w.where` | C02 | D05 | `r-where` → A18 | `p1-drehkreuz` |
| `g1u02.w.small` | C07 | D05 | `r-small` → C10 | `p3-baumhaus-gruppe` |
| `g1u02.w.adult` | A19 | B08 | `r-adult` → A19 ↻ | `p1-drehkreuz` |
| `g1u02.w.at` | A01 | B08 | `r-at` → A16 | `p1-cage2` |
| `g1u02.w.to-bring` | B23 | C04 | `r-to-bring` → B23 ↻ | `p2-schaffner` |
| `g1u02.w.but` | B08 | D08 | `r-but` → B25 | `p2-schaffner` |
| `g1u02.w.child` | A16 | B08 | `r-child` → B24 | `p2-schaffner` |
| `g1u02.w.dog` | A13 | B07 | `r-dog` → A14 | `p1-buehne-buddy` |
| `g1u02.w.family` | B08 | C04 | `r-family` → B09 | `p2-parkgruppe` |
| `g1u02.w.free` | B09 | B25 | `r-free` → B09 ↻ | `p2-parkgruppe` |
| `g1u02.w.grandma` | B08 | C09 | `r-grandma` → C10 | `p3-baumhaus-gruppe` |
| `g1u02.w.group` | B09 | B16 | `r-group` → B25 | `p2-schaffner` |
| `g1u02.w.long` | B19 | C05 | `r-long` → B19 ↻ | `p2-cage-zug` |
| `g1u02.w.ticket` | A15 | B09 | `r-ticket` → A16 | `p1-cage2` |
| `g1u02.w.to-want` | C08 | D08 | `r-to-want` → B11 | `p2-gehege` |
| `g1u02.w.from` | B14 | C11 | `r-from` → B21 | `p2-schaffner` |
| `g1u02.w.year` | B15 | C12 | `r-year` → B24 | `p2-schaffner` |
| `g1u02.w.he` | B08 | C09 | `r-he` → C10 | `p3-baumhaus-gruppe` |
| `g1u02.w.she` | B08 | C11 | `r-she` → C10 | `p3-baumhaus-gruppe` |
| `g1u02.w.to-talk` | C08 | D08 | `r-to-talk` → C08 ↻ | `p3-baumhaus-gruppe` |
| `g1u02.w.they` | B08 | C12 | `r-they` → B20 | `p2-schaffner` |
| `g1u02.w.we` | B16 | C08 | `r-we` → B11 | `p2-gehege` |
| `g1u02.w.for` | A16 | A19 | `r-for` → A16 ↻ | `p1-cage2` |
| `g1u02.w.happy` | B13 | C09 | `r-happy` → C10 | `p3-baumhaus-gruppe` |
| `g1u02.w.to-let-somebody-out` | B10 | C17 | `r-to-let-somebody-out` → B10 ↻ | `p2-gehege` |
| `g1u02.w.us` | B10 | C17 | `r-us` → C03 | `p3-papagei` |
| `g1u02.w.car` | A07 | A08 | `r-car` → A11 | `p1-buehne-papagei` |
| `g1u02.w.at-last` | A17 | C16 | `r-at-last` → A17 ↻ | `p1-drehkreuz` |
| `g1u02.w.how-strange` | B22 | D07 | `r-how-strange` → B22 ↻ | `p2-schaffner` |
| `g1u02.w.let-me-see` | A20 | C15 | `r-let-me-see` → A20 ↻ | `p1-drehkreuz` |
| `g1u02.w.stone` | C13 | C14 | `r-stone` → C07 | `p3-buehne-stein` |
| `wildlife park` | A16 | A19 | `r-wildlife-park` → A16 ↻ | `p1-cage2` |
| `now` | A14 | C02 | `r-now` → B20 | `p2-schaffner` |
| `feed` | B09 | C09 | `r-feed` → B09 ↻ | `p2-parkgruppe` |
| `see` | C09 | D02 | `r-see` → C03 | `p3-papagei` |
| `go on` | B09 | C09 | `r-go-on` → B11 | `p2-gehege` |
| `run around` | B08 | B25 | `r-run-around` → B08 ↻ | `p2-parkgruppe` |
| `welcome` | B08 | D09 | `r-welcome` → B25 | `p2-schaffner` |
| `to` | C04 | D09 | `r-to` → C04 ↻ | `p3-papagei` |
| `What is it?` | C01 | D06 | `r-what-is-it` → C01 ↻ | `p3-papagei` |
| `there is` | A01 | C06 | `r-there-is` → A03 | `p1-schubkarre` |
| `there are` | B01 | D03 | `r-there-are` → A02 | `p1-schubkarre` |

## Grammatik, Form und Reihenfolge

Die sechs Ortslagen erscheinen bei Papagei/Auto, Buddy und Bus. Die vier Regelseiten sind im Kapitel-README bilanziert. Kurzformen erst nach p2 (41,17): B12 I'm; B16 We're; C07 It's; C09 He's; C11 She's; C12 They're; D09 You're. A08/B08 verwenden vorher die Vollformen. C11 nutzt Aileens gedruckte Herkunft Cambridge; C12 unterscheidet die Mehrzahlform, nicht eine ungedruckte Behauptung über ihre Schulklasse. Fenns Name/Oxford/Year 7 sind erklärte Spielpassdaten.

Alle 72 Slots behalten id/use/kind/form/Anker/Phase des CARD_PLAN. Die Datei mischt die Reihenfolge einiger Karten innerhalb des Bestands-Pools, damit der bestehende Router die Formen abwechselt. Die gewünschte Lernfolge steht unabhängig davon in `taskSequenceV2.requiredIds` und `stageV2`; R1b muss genau diese IDs servieren und protokollieren. Die numerische Bestandsfolge `taskSequence` bindet lediglich erreichbare einfache Bühnenstationen an `sceneRef.station`.

Die Familienausnahmen in `ch02.policy.json` kaufen jeweils verschiedene Aufträge und Antworten: wechselnde Parkausschnitte, sechs Autoansichten, zwei Buddyereignisse, zwei Busbilder, zwei Besucherbilder, Fenns sechs Sprechakte, Giraffenmaß/Kulisse, verschiedene Löwenrunden. Nur bei konstantem Zuordnungs-/Ortsritual bleibt dieselbe englische Frage. Die Restore-Geste behält ihre bestehende Pflicht zur deutschen Identitäts- und Farbzeile. Keine neue pauschale Verrats-Ausnahme.

## Wortformen und Beweisgrenze

Ergänzt wurden die tatsächlich benötigten regelmäßigen Plurale tree/monkey/penguin/giraffe/train/lion/guide und die belegten Formen let us out/let me out sowie die Satzzeichenvarianten von At last. Keine neuen Ziel-IDs oder erweiterten Lexikonklassen. Das alte Ausnahmen-Ledger ist leer, weil alle 52 Einträge auf Feldkarten beantwortet werden.

Das Kartentor prüft Daten und Antwortschlüssel. Der zusätzliche automatische Paint-Schlüsseltest liest auch tatsächliche Szenen aus der Bandwiedergabe und protokolliert einen eigenen Fingerabdruck seiner Eingabedateien. Er verwendet die vorhandenen Antworten und ist deshalb keine unabhängige Schülerlösung. Die aktuellen unabhängigen Textlesungen liegen vor, enthalten aber noch Resturteile und gelten nur für ihre jeweilige Textfassung. Die Schülerbildprüfung bleibt separat. Bildaufträge sind noch keine Bilder (D-1003).
