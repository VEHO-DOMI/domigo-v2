# ch06 · Karten, die heute noch DATEN sind (L6-T1)

_Was hier steht, kann `ch06.tasks.v2.json` nicht tragen: das Schema kennt die Maschinen noch
nicht, und `zod` streift unbekannte Schlüssel still ab — eine Karte, die man trotzdem hineinlegt,
verschwindet lautlos statt rot zu werden. Deshalb liegt sie hier, in der Form, in der die
A-Bahn sie später einträgt. Besitzer der Einträge: **L6-T2** (Karten) und **L6-M** (Motor)._

## §1 · Drei Maschinen fehlen noch

Gemessen am Schema (`packages/content-schema/src/game-tasks.ts#GameTaskUnion`): die Union führt
neun Arten — `choice · typed · spell · order · oddone · mistake · wheel · memory · restore`.
**`match`, `sort` und `slider` fehlen** und sind im Kopf derselben Datei als *deferred* vermerkt;
sie kommen mit den Motor-Bahnen der Kapitel 2/3/4. `ch06.policy.json` nennt sie trotzdem unter
`fieldKinds` — die Politik sagt, was das Kapitel fragen darf, das Schema, was es heute kann.

⚠ Auch die **Form** fehlt jeweils: `TASK_FORMS` kennt seit R247 `fix-it` (mistake) und `pair-it`
(memory), aber **kein `match-it`**. Wer die match-Maschine baut, ergänzt Form *und* die Zeile in
`FORM_KINDS`, sonst kann keine Feld-Karte dieser Art ihre Form deklarieren (Gesetz 13a).

### `match` — die Schilder zeigen falsch (p1)

```json
{
  "id": "g1.paint.ch06.enc.marktwagen.ma1",
  "use": "encounter", "kind": "match", "form": "match-it",
  "exercises": ["g1u06.w.park", "g1u06.w.street", "g1u06.w.river", "g1u06.w.tree"],
  "stimulus": { "type": "entity", "showsDe": "Vier Schilder hängen verdreht am Wagen." },
  "storyDe": "Häng jedes Schild an den richtigen Ort!",
  "pairs": [
    { "left": "park",   "right": "Park" },
    { "left": "street", "right": "Straße" },
    { "left": "river",  "right": "Fluss" },
    { "left": "tree",   "right": "Baum" }
  ],
  "skins": ["marktwagen"], "phases": ["p1"]
}
```

### `sort` — der Amts-Stempel sortiert die Verben (p2)

```json
{
  "id": "g1.paint.ch06.enc.amtsstempel.so1",
  "use": "encounter", "kind": "sort", "form": "belongs-or-not",
  "exercises": ["g1u06.s.present-simple"],
  "stimulus": { "type": "entity", "showsDe": "Der Stempel wirft die Verben durcheinander." },
  "storyDe": "Sortiere: mit -s oder ohne?",
  "groups": [
    { "labelDe": "er, sie, es", "items": ["goes", "watches", "catches", "carries"] },
    { "labelDe": "wir, sie",    "items": ["go", "watch", "catch", "carry"] }
  ],
  "skins": ["amtsstempel"], "phases": ["p2"]
}
```

### `slider` — wie viele Äpfel? (p1)

```json
{
  "id": "g1.paint.ch06.enc.obststand.sl1",
  "use": "encounter", "kind": "slider", "form": "count-it",
  "exercises": ["g1u06.w.a-lot-of-lots-of", "g1u06.s.a-lot-of"],
  "stimulus": { "type": "entity", "showsDe": "Der Obststand füllt die Kiste vor deinen Augen." },
  "storyDe": "Schieb, bis es passt: wie viele Äpfel?",
  "left": "one apple", "right": "a lot of apples", "steps": 5, "answer": 5,
  "skins": ["obststand"], "phases": ["p1"]
}
```

## §2 · Die Ausruf-Serie (Tür-Gesetz, Besitzer L6-M)

Fünf Ausrufe, jeder **genau einmal** als `answer` einer `door`-Karte des Kapitels. Als Option
dürfen sie mehrfach vorkommen. Die Liste gehört **nicht** in `ch06.policy.json`: das Politik-Schema
kennt kein Feld `exclamations`, und `zod` würde es still abstreifen. L6-M führt das Feld ein und
baut die Schicht dazu (jeder Ausruf genau einmal, Tamper: Ausruf doppelt ⇒ rot).

```json
{
  "exclamations": ["Come on!", "Help me!", "Go on.", "But it's true!", "Well done."]
}
```

| Ausruf | Wortbank-Id | Wo er die Antwort ist | Stand |
|---|---|---|---|
| Come on! | `g1u06.w.come-on` | p1-Ausgangstür | **gebaut** (`door.p1.exit`) |
| Help me! | `g1u06.w.help-me` | Mos Bürotür (p2, `seal`) | L6-T2 |
| Go on. | `g1u06.w.go-on` | p2-Ausgangstür | L6-T2 |
| But it's true! | `g1u06.w.but-it-s-true` | Arena-Tür (p3-Ausgang) | L6-T2 |
| Well done. | `g1u06.w.well-done` | Finale-Stempel — **keine Tür**, die `typed`-Karte der Arena | L6-T2 |

## §3 · Was das Kalibrier-Set bewusst auslässt

- **`spell`** bekommt kein Exemplar. Grund gemessen, nicht geschätzt: `FORM_KINDS` führt `spell`
  ausschließlich unter `name-it`, und `name-it` ist eine referent-feste Form. Ein Feind mit einer
  spell-Karte hätte damit `name-it` als seine eine Stimme (Gesetz 14a) und dürfte wegen 14c keine
  zweite `name-it`-Karte tragen, während die Deckung genau die verlangt. Eine spell-Karte gehört
  deshalb an einen Träger ohne Stimmpflicht — eine Tür oder ein Käfig. ch01 trägt das Muster.
- **`restore`** nutzt ch06 nicht (kein Wesen ist zugleich im Weg und entfärbt).
- **`typed`** ist der Finale-Stempel `WELL DONE` und gehört zur Arena-Welle (T2).
- **`bonuspay`** ist kein Schema-`use`: die Klecks-Tür ist eine Zeremonie ohne Karte.

## §4 · Eine Familie, die die Welle braucht (Besitzer L6-T2)

Die neun Schnipsel-Karten (`use: "pickupset"`) fragen alle dasselbe — den Namen des gefundenen
Wortes. Bei **einem** Exemplar beißt das nicht; bei neun schlagen die Gesetze 14c, 15d und 14d zu.
ch01 löst das mit einer erklärten Familie (`uniform-naming`), die genau diese drei befreit und
dafür verschiedene Antworten und verschiedene deutsche Zeilen schuldet. ch06 braucht die
Entsprechung, sobald die zweite Schnipsel-Karte entsteht — vorgemerkt, damit die Welle sie
einplant, statt sie zu bezahlen.
