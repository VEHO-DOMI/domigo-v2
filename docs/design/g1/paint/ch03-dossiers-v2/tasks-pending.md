# ch03 · Karten-Entwürfe OHNE Maschine (L3-T1, 2026-09-02)

_Was hier steht, ist **fertiger Inhalt ohne Motor**. Es liegt bewusst NICHT in
`ch03.tasks.v2.json`: `sort` und `match` sind im Schema noch nicht vorhanden
(`packages/content-schema/src/game-tasks.ts` — die Union kennt sie nicht, zod würde die Karte
ablehnen), und Ilvys Wiedererweckung hängt am Klassenkind, das erst die G2-Bahn ins Level stellt.
Eine Karte mit unbekanntem `kind` fällt im Schema; deshalb Daten, nicht Datei._

**Erdung:** jedes englische Wort unten läuft durch `docs/design/g1/grounding/u03-lexicon.json` —
mit demselben Skript, das die Kartendatei prüft (0 fremde Tokens, im PR belegt).
**Besitzer:** L3-T1 (diese Datei) · `pending.md` im selben Ordner gehört der G1-Bahn.

---

## A · `sort` — Schema-Entwurf für L3-M

`sort` debütiert in ch03 (doc 41 §1). Vorschlag für die Union in `game-tasks.ts`:

```jsonc
{
  "kind": "sort",
  "groups": [                     // GENAU zwei — mehr überfordert die 1. Klasse AHS
    { "labelEn": "one",  "items": ["foot", "tooth", "man"] },
    { "labelEn": "more", "items": ["feet", "teeth", "men"] }
  ],
  "shuffled": true                // die Auslage mischt seededShuffle(alle items, id)
}
```

Regeln, die die Maschine tragen muss (aus den bestehenden Gesetzen abgeleitet, nicht neu erfunden):
- genau **2 Gruppen**, je **3–4 Items**, alle Items über beide Gruppen **eindeutig**
  (sonst hat die Karte zwei richtige Antworten);
- `answerSurfaceOf` = alle Items (das Kind muss jedes lesen, um es einzuordnen) —
  dieselbe Lesart, die `oddone` schon hat;
- `optionSurfaceOf` = alle Items;
- `evidenceTokensOf` = alle Items, falls eine `sort`-Karte je ins Boss-Ritual soll
  (heute nicht: ch03s Boss-Fenster sind choice · order · mistake);
- Form: **`belongs-or-not`** ist bereits im Schema und passt wörtlich
  („set-membership judgement against a named category") — `sort` müsste in
  `FORM_KINDS["belongs-or-not"]` aufgenommen werden, dann braucht ch03 keine neue Form.
  ⚠ Folge für die Politik: `fieldKinds` bekommt `sort`, `fieldForms` bekommt `belongs-or-not`.

### Die sechs `sort`-Karten (Inhalt fertig)

| Id | Gruppe A (`labelEn`) | Gruppe B (`labelEn`) | Fiktion |
|---|---|---|---|
| `g1.paint.ch03.srt.beute.s1` | `one` — foot · tooth · man | `more` — feet · teeth · men | Die Beutekiste am Pier: eins oder mehr? |
| `g1.paint.ch03.srt.beute.s2` | `one` — woman · foot · tooth | `more` — women · feet · teeth | Zweite Kiste, andere Wörter |
| `g1.paint.ch03.srt.crew.s3` | `has got` — he · she · the captain | `have got` — I · you · they | Die Musterrolle: wer bekommt welches Wort? |
| `g1.paint.ch03.srt.crew.s4` | `has got` — Polly · Blackbeard · it | `have got` — we · the pirates · you | Zweite Spalte der Musterrolle |
| `g1.paint.ch03.srt.koerper.s5` | `body` — beard · nose · shoulder | `ship` — sea · treasure · hook | Was gehört zum Piraten, was zum Schiff? |
| `g1.paint.ch03.srt.frage.s6` | `question` — Has he got a ship? · Have you got a dog? | `answer` — Yes, he has. · No, I haven't. | Der Papagei sortiert Frage und Antwort |

⚠ `s6` ist der einzige Satz-Sortierer; er löst einen Teil des M-E-Gesetzes ein (Fragen UND
Antworten der Unit). Belege: SB S. 24 Note („Answer with: Yes, she has. / No, she hasn't."),
WB Ü8/Ü9.

---

## B · Ilvys Wiedererweckung — sechs Fragen (p2, Brig)

`use: "rescue"` · `kind: "choice"` · `form: "state-it"` · `skins: ["ilvy"]` · `phases: ["p2"]`.
Kommt mit **G2** (das Klassenkind steht erst dann im Level) — doc 44 §3.3: genau **sechs**
Runden, die Pose IST der Prompt, „Frage n von 6". Beschreib-Runde am Kapitänsbild an der
Brig-Wand.

| Id | `storyDe` (Arbeitsstand) | Antwort | Ablenker | Buch-Beleg |
|---|---|---|---|---|
| `awk.ilvy.r1` | Was hat der Kapitän auf dem Kopf? | `He has got a big hat!` | `He have got a big hat!` · `He is got a big hat!` | Korpus `g1u03.gi.have-got` (»I have got a hat.«) |
| `awk.ilvy.r2` | Wie groß ist er? | `He is tall.` | `He is short.` · `He is small.` | SB S. 22 Note (long/short, tall/short) |
| `awk.ilvy.r3` | Was für eine Nase hat er? | `He has got a big nose.` | `He has got a small nose.` · `He has got a long nose.` | SB S. 25 Ü9 |
| `awk.ilvy.r4` | Wie sind seine Haare? | `He has got long hair.` | `He has got short hair.` · `He has got long feet.` | SB S. 22 Ü1 (»very long hair«) |
| `awk.ilvy.r5` | Was fehlt ihm? | `He hasn't got a beard.` | `He hasn't got a nose.` · `He hasn't got an ear.` | SB S. 25 Ü9 (»No, he hasn't got a beard.«) |
| `awk.ilvy.r6` | Und was hat er doch? | `He has got one eye.` | `He has got one ear.` · `He has got one leg.` | SB S. 25 Ü9 (»he's only got one eye«) |

⚠ **`hat` — gemessen, nicht geraten (D-830):** das Wort steht NICHT im Buchtext von Unit 3
(nur in zwei Bildbeschreibungen, und die sind kein Buchtext), aber in **drei grammar.json-Items
des Korpus** (»I have got a hat.« · »I've got a hat.«). Nach der Aufnahme-Regel des Lexikons
(Transkript UND/ODER Korpus) ist es damit geerdet, und Ilvys Blatt-Zeile bleibt wörtlich.
Will der Architekt strikt am Buchtext bleiben, ist der Tausch **eine** Zeile:
`He has got a big beard!` mit denselben zwei Ablenkern.

⚠ **Varietäts-Vorwarnung für T2:** sechs Karten EINER Form in EINEM Pool schlagen an Gesetz 14c
an (`state-it` ist referent-fest). ch01 löst das über eine Familie (`merle-ceremony`, exempts
`16c`, obliges `distinctStoryDe` + `distinctAnswers`). ch03 braucht die gleiche Familie in
`ch03.policy.json`, sobald diese sechs Karten in die Datei gehen — heute wäre sie leer und nach
Gesetz 0a selbst rot, deshalb steht sie noch nicht drin.

---

## C · `match` — vier Karten (Schema kommt aus L2-M)

Form absichtlich offen: L2-M schneidet das Schema (`match` fehlt in der Union). Inhalt fertig,
Paare Wort ↔ Beschreibung, alles aus dem u03-Lexikon:

| Id | Paare |
|---|---|
| `g1.paint.ch03.mat.koerper.m1` | `beard` ↔ Haare im Gesicht · `nose` ↔ mitten im Gesicht · `ear` ↔ zum Hören · `shoulder` ↔ dort sitzt der Papagei |
| `g1.paint.ch03.mat.plural.m2` | `foot` ↔ `feet` · `tooth` ↔ `teeth` · `man` ↔ `men` · `woman` ↔ `women` |
| `g1.paint.ch03.mat.crew.m3` | `captain` ↔ befiehlt das Schiff · `pirate` ↔ fährt zur See · `ship` ↔ fährt auf dem Wasser · `parrot` ↔ sitzt auf der Schulter |
| `g1.paint.ch03.mat.form.m4` | `I` ↔ `have got` · `he` ↔ `has got` · `they` ↔ `have got` · `she` ↔ `has got` |

⚠ `m4` hat zweimal dieselbe rechte Seite — ob die `match`-Maschine n:1-Paare erlaubt, entscheidet
L2-M. Fällt die Antwort „nein", wird `m4` zu `they` ↔ `haven't got` / `she` ↔ `hasn't got`.

---

## D · Was die Türserie in T2 noch abdecken muss (Gesetz M-E)

Gemessen an `content/corpus/units/g1-u03/grammar.json` (42 Items, zwei Strukturen) und an
Gesetz 17g (`jede` Grammatik-Struktur wird von einer Feld-Karte geübt). Die **sechs** Exemplar-Türen
(drei aus L3-T1, drei aus der L3-Fix-Bahn) decken heute: **Frage 3. Person Einzahl** (`Has she got …?`,
vier Karten), **Verneinung 3. Person Einzahl** (`He hasn't got …`) und ein **Buchstabier-Wort**.
Die drei neuen Türen bringen VOKABEL-Inhalt, keine neue Struktur — die Liste unten ist deshalb
unverändert offen. Offen für die Welle:

1. Frage 1./2. Person + Mehrzahl: `Have you got …?` · `Have they got …?` (WB Ü8)
2. Kurzantworten: `Yes, he has.` · `No, he hasn't.` · `Yes, I have.` · `No, I haven't.` (SB S. 24 Note, WB Ü9/Ü10)
3. Verneinung 1./2. Person + Mehrzahl: `I haven't got …` · `They haven't got …` (SB S. 27 Grammar)
4. Aussage Mehrzahl mit Plural-Nomen: `They have got two feet.` · `We have got five teeth.`
5. `has got` mit Eigennamen: `Blackbeard has got a ship.` (SB S. 22 Ü1)

⚠ Die Türserie ist der einzige Träger, der die Unit-Fragen SYSTEMATISCH abfahren kann — die
Feinde tragen je EINE Form (Gesetz 14a), die Türen nicht (sie sind keine `voiceSkins`).
Das ist der Grund, warum das Exemplar drei Tür-Karten hat und nicht zwei.

---

## E · Was die L3-Fix-Bahn erledigt hat (2026-09-05) — und was sie NICHT erledigt hat

**Erledigt.** Der Vokabel-Anspruch von `ch03-dossiers-v2/claims.json` ist eingelöst: alle 19
`cards`-Wörter der Unit stehen als ANTWORT auf einer Karte, keines trägt eine Ausnahme
(Kokis Entscheid 2026-09-05: einlösen statt vertagen). Zwölf neue Karten, alle an Wesen, die p1
ohnehin trägt. Der `vocabLedger` in `ch03.policy.json` ist entsprechend von 35 auf 19 Einträge
gefallen (Gesetz 17c).

**Nicht erledigt, und bewusst nicht.** Die Karten unter A, B und C oben brauchen weiter ihre
Maschine (`sort`, `match`) bzw. den Raum p2, den G2 erst schneidet. Und die Karten dieser Bahn sind
KALIBRIER-Ware, keine Welle: sie beweisen, dass jedes Unit-Wort einen ehrlichen Ort im gebauten
Raum hat — sie sind nicht die Menge, die ein Kind im fertigen Kapitel spielt.

**Zwei Grenzen, an die T2 stoßen wird — hier gemessen, nicht vermutet:**

1. **Jeder Feind hat genau EINE Frageform** (Gesetz 14a): Papagei `pick-correct-form`,
   Deckschrubber `ask-it`, Bugkanone `count-it`. Und `state-it`/`name-it` sind
   *referenz-feste* Formen (Gesetz 14c) — davon verträgt ein Pool genau eine. In der Tür-Serie
   und im Netzkäfig sind beide bereits vergeben. Wer in T2 mehr Karten will, bekommt sie über
   `ask-it`, `pick-correct-form`, `count-it` und `order` — nicht über eine zweite Nenn-Karte.
2. **Ein mehrteiliger Wortbank-Eintrag kann von einer Legekarte nicht eingelöst werden.**
   `check-level-design` verbindet die Chips einer `order`-Karte mit ` | `, aus
   `[a] [long] [right] [arm]` wird also nie die Form `right arm`. `right arm` und `left arm`
   sitzen deshalb auf Auswahlkarten mit ganzem Satz. Registriert als **D-840**.
