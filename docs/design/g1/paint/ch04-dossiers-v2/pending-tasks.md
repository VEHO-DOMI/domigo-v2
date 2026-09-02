# ch04 · Karten, die auf eine Maschine warten (ENTWURF, angelegt von L4-T1)

_Diese Datei hält Karten fest, die das Kapitel BRAUCHT, deren Maschine der Motor aber noch nicht hat.
Sie sind Daten, keine Karten: `packages/content-schema/src/game-tasks.ts#GameTaskUnion` führt `match`, `sort` und
`slider` als „deferred", und zod wirft jede Datei zurück, die eine unbekannte `kind` trägt. Wer die
Maschine baut, holt die Karten von hier ab und trägt sie in `ch04.tasks.v2.json` ein._

**Besitz:** L4-T1 hat diese Datei angelegt; die Welle **L4-T2** schreibt die restlichen slider-/sort-Karten
hier hinein, **L4-A** trägt sie nach L3-M (sort) und L4-M (slider) in die Kartendatei um. Alle anderen
Dateien in diesem Ordner (`pending.md`, `README.md`, `p1.md`, `claims.json` …) gehören der G-Bahn.

---

## 1 · `slider` — die Maschine fehlt (L4-M baut sie)

Die Blaupause §6 sieht sechs slider-Karten vor: „Wie stark ist das Gefühl?" Der Motor kennt die Art nicht,
das Schema kennt sie nicht, der Router kennt sie nicht.

### 1.1 Schema-Entwurf (Vorschlag an L4-M — die Maschine entscheidet, nicht dieser Entwurf)

```jsonc
{
  "kind": "slider",
  "promptEn": "How happy is he?",   // die englische Frage, wie bei choice
  "left":  "not happy",             // der linke Pol   — ein Wort/eine Wendung AUS DEM LEXIKON
  "right": "very happy",            // der rechte Pol
  "steps": 3,                       // Rasterpunkte auf der Bahn (3 = links · Mitte · rechts)
  "answer": "very happy",           // ∈ {left, Mitte, right}; die Mitte trägt das nackte Adjektiv
  "stimulus": { "type": "entity", "showsDe": "…" }
}
```

**Gemessener Befund zu den Polen (D-869).** Das Boot-Blatt schlug „a little" / „very" vor. `little` steht in
KEINER Quelle dieses Kapitels — nicht in `g1-u04/wordbank.json`, nicht in der SB/WB-Abschrift, nicht in der
Kumulativ-Bank u01–u03; das Erdungs-Tor würde die Karte rot färben. Die Unit hat ihre eigene Skala, und sie
ist besser: **`not …` ← → `very …`**, mit dem nackten Adjektiv in der Mitte.
Belege: SB S. 31 „He's very happy." · SB S. 32 „He's really hot!" · SB S. 34 (Lied) „I am happy. I'm not
sad." · WB S. 33 „I'm not very happy." Damit ist der Regler dieselbe Grammatik, die das Kapitel ohnehin
lehrt (to be + Verneinung), nur als Menge statt als Ja/Nein.

### 1.2 Zwei Beispielkarten (Daten — beim Einbau Ids und `exercises` prüfen)

```jsonc
{
  "id": "g1.paint.ch04.enc.turmkind.s1",
  "use": "encounter", "kind": "slider", "form": "state-it",
  "exercises": ["g1u04.w.scared"],
  "stimulus": { "type": "entity", "showsDe": "Das Turmkind klammert sich grau an das Geländer." },
  "storyDe": "Schieb den Regler dorthin, wo sein Gefühl steht!",
  "promptEn": "How scared is she?",
  "left": "not scared", "right": "very scared", "steps": 3, "answer": "very scared",
  "skins": ["turmkind"], "phases": ["p3"],
  "hints": { "deDesc": "Sie schaut nach unten und hält sich mit beiden Händen fest." }
}
```

```jsonc
{
  "id": "g1.paint.ch04.enc.hausherr.s1",
  "use": "encounter", "kind": "slider", "form": "state-it",
  "exercises": ["g1u04.w.angry"],
  "stimulus": { "type": "entity", "showsDe": "Sieben Wecker klingeln um den Hausherrn herum." },
  "storyDe": "Schieb den Regler dorthin, wo sein Gefühl steht!",
  "promptEn": "How angry is he?",
  "left": "not angry", "right": "very angry", "steps": 3, "answer": "very angry",
  "skins": ["hausherr"], "phases": ["p2"],
  "hints": { "deDesc": "Er hält sich die Ohren zu und stampft." }
}
```

⚠ Beim Einbau: `slider` braucht einen Eintrag in `TASK_KINDS`, eine Zeile in `FORM_KINDS` (welche Formen
ein Regler ausdrücken kann — `state-it` ist der Vorschlag), einen Eintrag in `answerSurfaceOf` und
`optionSurfaceOf` (`cards/variety.ts`) und eine Zeile im Verrats-Gesetz (`decidingWordsOf`,
`scripts/check-game-tasks.mjs`). Fehlt eine davon, ist die neue Art in genau der Schicht blind — dieselbe
Klasse, die vier Kartenarten jahrelang ohne Verrats-Prüfung ließ (Kommentar Schicht 18).

---

## 2 · `sort` — die Maschine fehlt (L3-M baut sie, ch04 konsumiert sie)

Vier sort-Karten stehen in der Blaupause §6 (die Wochentage in die richtige Reihenfolge bringen — das Haus
der Tage ist die Fiktion dazu). Die Karten schreibt die Welle **L4-T2**, sobald L3-M die Maschine gemergt
hat; bis dahin ist der Platz hier reserviert, damit die Zahl (4) nicht still verschwindet.
Bis dahin trägt die `order`-Maschine dieselbe Aufgabe im Boss-Ritual (Blaupause §5, Fenster 2).

---

## 3 · Was NICHT mehr hier wartet

**Die memory-Karte ist gebaut.** Das eingefrorene Boot-Blatt führte sie als Daten, weil `FORM_KINDS` keine
Form für `memory` trug. Der L0-Nachtrag **N3 / R247** hat `pair-it` geliefert, und L0 ist gemergt
(`134bd608`, PR #391) — die Karte steht damit als elftes Exemplar in `ch04.tasks.v2.json`
(`g1.paint.ch04.enc.fensterladen.me1`, Gefühl ↔ Gegenteil, gebunden an den Fensterladen-Klapper in p1).
Koki hat das am 2026-09-03 freigegeben.

---

## 4 · Zwei Dinge, die die Welle T2 wissen muss

1. **`stimulus.art` bleibt weg, solange kein Blatt existiert.** Schicht 11 (`checkPortraits`) färbt eine
   Karte ROT, die ein `art` nennt, das nicht gemalt ist — nicht erst dann, wenn die Kunst kommt. Solange
   kein Wesen des Kapitels ein Blatt hat, ist das Feld wegzulassen; die A-Bahn trägt die Portraits nach.
2. **`ch04.policy.json#vocabLedger` IST die Arbeitsliste von T2.** Jeder der 51 Einträge ist ein
   Unit-4-Wort, das noch keine Karte beantwortet (Gesetz 17a verlangt für jedes Wortbank-Wort entweder
   eine Karte oder einen Eintrag mit Grund und Ablaufdatum). Wer eine Karte baut, die ein Wort beantwortet,
   LÖSCHT dessen Eintrag — sonst meldet Gesetz 17c den veralteten Eintrag.
