# SPEC · DAS MASSEN-KIT — was nur Pinsel heilen können

_Geschrieben in R5-W1 · Session A1 (2026-08-11), nachdem die Engine-Seite der
»Lego«-Diagnose gebaut und live bewiesen war. Der Architekt macht daraus die
Codex-Kommission **AS**. Adressat ist ein Bild-Generator im Codex-Labor —
niemals unser Repo, niemals unsere Branches (CP-15 · Clean-Room)._

**Stil-Register:** STYLE_PAINT_V1 · reiner Schlüssel `#FF00FF` · keine
Vermischung Figur ↔ Schlüssel (AM3-Lehre) · Bestand IMMER zuerst ansehen:
`apps/web/public/art/g1/paint/ch01/`.

---

## §0 · Wozu dieses Blatt existiert — und wo seine Grenze liegt

Kokis Befund am 11. August: die Terrain-Massen lesen sich als **gestapelte
Legosteine**. Die Ursache war zu 90 % die Engine, und die ist in diesem PR
behoben und gemessen (Details in §1). Was übrig bleibt, kann kein Renderer
lösen, weil es **fehlende oder falsch geschnittene Malerei** ist. Genau das
steht hier.

**AUSDRÜCKLICH NICHT in diesem Spec** — schon vergeben, nicht doppelt
kommissionieren:

| Bereits vergeben | Wo | Schuld |
|---|---|---|
| Terrassen-Kanten-Kappen, Platten-Kappen, Luken-Rahmen | Codex **Batch AQ, Blatt 5** `kanten_kit.png` | D-16 |
| Zustands-Zellen (Heft-Telegraph, Stampfer-SLAM, Radierer bockt) | Codex Batch AQ, Blatt 5 | D-16 |
| Farbvarianten der Fund-/Bedrohungs-Objekte | Codex Batch AQ, Blatt 3 | D-14 |
| Wert-Trennung / Parallaxe der Ebenen L0–L4 | bleibt maschinell unter doc 36 §1 | — |

Dieses Spec betrifft **den Körper der Masse selbst**: Laufkurs, Innenmasse,
Tiefe, Schnittkanten, Unterseiten, Setzstücke.

---

## §1 · Was die Engine seit R5-W1 · A1 garantiert (die Kommission muss es wissen)

Vor der Kommission zu verstehen, sonst wird am falschen Maßstab gemalt.

**DAS GEMALTE-MASSSTAB-GESETZ.** Eine gekachelte Fläche zog ihren Maßstab früher
aus dem *Stück*, das sie füllte. Die Innenmasse wird eine Gitterreihe hoch
geplant — also wurde ein **512 × 512-Gemälde in eine 16 × 16-Schachtel gequetscht**
und in jeder Zelle der Welt identisch neu gestempelt. Das war das Lego.

Jetzt gilt: **der Laufkurs bestimmt den Maßstab der ganzen Welt.** Seine Höhe ist
durch `CRUST_H = 17 px` festgenagelt, also ist er die einzige Fläche, deren
Maßstab nicht frei ist — und die einzige, die den Fehler nie hatte.

```
Weltpixel je Quellpixel  =  CRUST_H / Höhe des Kurs-Blatts
Periode in Zellen        =  512 · (17 / H) / 16  =  544 / H
```

Gemessen an den ausgelieferten Blättern:

| Phase | Kurs-Blatt | H (px) | Weltpx/Quellpx | Periode (Zellen) |
|---|---|---|---|---|
| p1 | `crust_p1_a` | 212 | 0.0802 | **2.57** ✓ |
| p2 | `crust_p2_a` | 211 | 0.0806 | **2.58** ✓ |
| p3 | `crust_p3_a` | 262 | 0.0649 | **2.08** ✗ gitter-verrastet |
| p4 | `crust_p4_a` | 237 | 0.0717 | **2.30** ✓ |
| p9 | `crust_p9_a` | 246 | 0.0691 | **2.21** ✓ |

**Maschinell geprüft:** `node scripts/check-composition.mjs`, Audit 10
(»painted-scale«). Es fällt hart, wenn eine Innenfläche in einem anderen Maßstab
als ihr Kurs gemalt wird, oder wenn ihre Periode ≤ 2 Zellen beträgt oder auf
einer ganzen Zellzahl landet.

---

## §2 · DIE KURS-HÖHEN-REGEL (ein echter Befund, hier gefiled)

**Befund (Audit 10, live):** `crust_p3_a` und `crust_p3_b` sind 262 px hoch. Das
ergibt eine Periode von **2.076 Zellen** — praktisch genau zwei. Die Wiederholung
des Gemäldes sitzt damit für immer *in Phase* mit dem Zellgitter, den
Brett-Fugen und den Kanten-Trims. Das ist derselbe Defekt wie das ursprüngliche
Lego, nur eine Oktave höher, und keine Wert- oder Korn-Variation kann ihn
verstecken — sie variiert ja im selben Takt.

Die Engine kann das nicht heilen: der Kurs ist ein **Band von genau einer
Kurshöhe** und muss `CRUST_H` exakt ausfüllen. Sein Maßstab ist keine Wahl.
(Die Innenmasse, deren Maßstab frei ist, wird per `mass.bodyScaleOf`
deterministisch vom Gitter weggeschoben — nur der Kurs bleibt gefangen.)

> **GESETZ FÜR JEDES NEUE KURS-BLATT:** Schnitthöhe H so wählen, dass
> `544 / H` zwischen **2.15 und 2.85** liegt — also **H zwischen 191 und 253 px**
> — und niemals innerhalb von 0.08 einer ganzen Zahl. **272 px ist verboten**
> (exakt 2.0), **262 px ist verboten** (2.08).
>
> Bequemer Zielwert: **H = 212 px** wie p1 → 2.57 Zellen.

**Auftrag:** `crust_p3_a` und `crust_p3_b` (und ihre `cap_l`/`cap_r`) auf
**212 px Höhe** neu schneiden — gleiche Malerei, anderer vertikaler Beschnitt,
oder neu gemalt mit derselben Palette. Bis dahin meldet Audit 10 es als
⚠-Notiz statt als Fehler, und der Eintrag steht im DEBT_REGISTER.

---

## §3 · DIE INNENMASSE — pro Phase ein eigenes Papier (heute teilen sich alle fünf eines)

**Bestand:** `mass_body_a.png`, `mass_body_b.png` (je 512 × 512) bedienen
**alle fünf Phasen**. Die Nachtklasse trägt dieselben Bücher wie die
Morgenhalle; nur der Kurs darüber ist je Raum verschieden.

**Auftrag — Blatt `mass_body_<phase>.png`, 2048 × 1024, 4 × 2 Zellen à 512²,
UNGEKEYT (voll deckend), je Phase ein Blatt:**

- Reihe 1, Zellen 0–3: **vier nahtlos kachelbare Varianten** des Raum-Papiers.
  Nahtlos heißt hier: links↔rechts UND oben↔unten mit sich selbst UND mit den
  drei Geschwistern. Die Engine legt sie in unregelmäßigen Segmenten aus.
- Reihe 2, Zellen 4–7: dieselben vier, **eine Blende tiefer** (siehe §4).

Pro Phase (Palettenkarte aus doc 36 §1 / `composition.ts`):

| Phase | Raum | Papier |
|---|---|---|
| p1 | Eingangshalle, morgenwarm (K 88) | liegende Bücher, Honig/Eiche, Messingglanz |
| p2 | Klassenzimmer bei Nacht (K 30) | dieselben Bücher, mondkühl entsättigt, violette Schatten |
| p3 | Schulhof-Garten, nachmittagsweich (K 86) | gepresstes Papier-Steinwerk, Sandputz, Teal-Akzente |
| p4 | Tafel-Bühne, Bühnendämmer (K 28) | dunkles Holz, Bühnenbretter, Messing |
| p9 | Kleckskammer, Tinten-Traum (K 14) | Tintenpapier, Indigo, blasse Papier-Glimmer |

**Wichtig:** Reihe 1 muss **46 ± 4 % mittlere Leuchtdichte** halten (der heutige
Bestand liegt bei 46.2 %). Audit 1 misst L3 aus genau diesen Blättern, und die
L2↔L3-Trennung ist das einzige absolute Lesbarkeitsgesetz der Datei.

---

## §4 · DIE TIEFE — das dunkelste Papier ist das wichtigste, und es ist heute ein Loch

**Der gemessene Befund.** Die drei Tiefenblätter liegen bei **46.2 % → 16.6 % →
4.8 %** mittlerer Leuchtdichte. Das unterste ist als *Gemälde* fast schwarz. Die
Engine hat den Verlauf in R5-W1 auf vierzehn Reihen gestreckt und multipliziert
jede Reihe auf den Wert der nächsten Blende herunter, sodass der Materialwechsel
unsichtbar wird — der Anteil der Innenzellen, die unter 6 % gezeichnet werden,
fiel dadurch von **48.2 % auf 0.9 %**. Aber wo `mass_sediment` doch gezeichnet
wird, bleibt es ein Loch, weil das Blatt selbst eines ist.

Zwei unabhängige, blinde Prüfer haben es in derselben Runde unabhängig benannt:
»die dunkelste Materie der Referenz ist immer noch erkennbar *blaues Holz*, nicht
Schwarz«.

> **★ ENTSCHIEDEN (Koki, 2026-08-11): AUFHELLEN.** Auf die Frage »wie dunkel darf
> der Grund der Welt sein?« hat er Variante **A** gewählt: das tiefste Papier
> wird neu gemalt — heller und mit klarem Farbton —, die Tiefe bleibt tief, hört
> aber auf, ein Loch zu sein. Die Werte unten sind damit **Vorgabe, nicht
> Vorschlag**; die Kommission AS geht so hinaus.

**Auftrag — Blatt `mass_deep_<phase>.png`, 2048 × 512, 4 Zellen à 512²,
UNGEKEYT:**

- Zellen 0–1: **Tiefenpapier**, mittlere Leuchtdichte **12 – 18 %** —
  das Buchmaterial bleibt bis zum letzten Buchrücken lesbar.
- Zelle 2: **Sediment**, mittlere Leuchtdichte **7 – 10 %** (NICHT 4.8 %) —
  und mit einem klaren **Farbton**: kühl, dem Raumschlüssel folgend
  (`ROOM_SHADOW_INK = 0x1a1626` ist der Hausschwarzton »der noch zu einem
  gemalten Buch gehört«). Sättigung ≥ 12 %.
- Zelle 3: Reserve / Übergangsvariante.

**Prüfregel für den Reviewer:** die Zelle auf 25 % verkleinern und schielen —
sind einzelne Buchrücken noch als Objekte zu unterscheiden? Wenn nein, ist sie
zu dunkel gemalt, egal wie stimmungsvoll sie in voller Größe wirkt.

---

## §5 · DIE SCHNITTKANTEN — sie sind eine Textur, kein Objekt (und heute zu hell)

**Bestand:** `mass_edge_l.png` / `mass_edge_r.png` (248 × 512) — ein Streifen
Buchschnitt-Kanten. **71.5 % mittlere Leuchtdichte gegen einen 46.2 %-Körper.**
25 Punkte: das ist keine Lichtkante mehr, das ist eine Schiene. Die Engine legt
sie jetzt bei 0.62 zurück und lässt sie mit der Tiefe absinken; beide Prüfer der
ersten Runde hatten sie unabhängig benannt.

**Auftrag — Blatt `mass_edges_<phase>.png`, 2048 × 1024, 4 × 2 Zellen à 512²,
GEKEYT `#FF00FF`:**

- Zelle 0/1: Kante links / rechts, **vertikal nahtlos kachelbar** (die Engine
  kachelt sie jetzt am gemalten Maßstab, nicht mehr eine Stanzung je Zelle) —
  Zielwert **52 – 58 %** Leuchtdichte, also 6 – 12 Punkte über dem Körper,
  nicht 25.
- Zelle 2/3: **Unterseiten-Kante** links/rechts — **existiert heute überhaupt
  nicht.** Wo eine Masse eine Decke oder einen Überhang bildet, endet sie an
  einem rohen waagerechten Schnitt; es gibt schlicht kein `edgeD`-Blatt. Das
  ist die letzte Kante ohne Anatomie.
- Zelle 4/5: Außenecken unten links / unten rechts (Ersatz für `mass_corner_*`,
  auf denselben neuen Wert gebracht).
- Zelle 6/7: Innenecken links / rechts (dito).

---

## §6 · DIE SETZSTÜCKE — der Weg, den doc 36 §2 v1.2 vorgibt und den noch niemand gebaut hat

doc 36 §2 v1.2 (2026-07-28) sagt es bereits: wo eine Formation BESONDERS ist,
wird sie als **EIN gemaltes Stück** kommissioniert — »ein einziges volles
Gemälde in der Größe Reihen × Spalten von 512-px-Zellen, seine Massen-Anatomie
(Kurs, Kanten, Sediment) INNERHALB des Stücks gemalt, verankert an einer
deklarierten Gitterzelle oben links. Das Glyphen-Gitter behält die
Kollisions-Hoheit unverändert.« Die gekachelte Montage ist für solche
Formationen ausdrücklich **stillgelegt**.

**Der Engine-Anschluss existiert nicht.** In `mass.ts` gibt es keine
`setpiece`-Art (`MassKind`, Stand 2026-08-11). Das ist hier gefiled, nicht
gebaut — es gehört in dieselbe Welle wie das erste Setzstück-Blatt, sonst baut
man einen Anschluss für Kunst, die nicht kommt.

**Kandidaten, in dieser Reihenfolge:** der p3-Rutschen-Auslauf · die
Arena-Podeste (p4) · der Keller-Schacht in p1 · die Kleckskammer-Wand (p9).

---

## §7 · FORMAT-GESETZE (Maschinenvertrag — Verstöße lassen den Import scheitern)

- **Zellblätter:** 2048 breit, Zellen von **512 px**. Zellzahl je Reihe wird vor
  der Lieferung ausgezählt und im Dateinamen-Kommentar genannt.
- **GEKEYT** heißt: Hintergrund reines Magenta `#FF00FF`, **keine
  weichgezeichneten Magenta-Höfe** (CP-9 — der Wächter `npm run` →
  `scripts/key-fringe.mjs` fällt darüber).
- **UNGEKEYT** heißt: voll deckend, kein Alpha. Innenmassen sind immer ungekeyt;
  ein durchscheinendes Innenpixel lässt die Wäsche durch den Boden sehen und
  Audit 3 fällt.
- **Kachelbarkeit** ist eine Lieferbedingung, keine Absicht: jede Innen- und
  Kantenzelle muss mit sich selbst UND mit ihren Geschwistern nahtlos schließen
  (CP-12 — Schleifen brauchen passende Enden).
- **Palettenkarte** in JEDE Kommissionskarte (CP-14), aus der Tabelle in §3.
- Umriss-Stärke ≈ 2.5 % der Motivhöhe (CP-13).

## §8 · Abnahme

Ein Blatt ist erst angenommen, wenn:

1. `pnpm check:paint-art` grün ist (Existenz + Schlüssel-Hof-Freiheit),
2. `node scripts/check-composition.mjs` grün ist — **inklusive Audit 10**, das
   den gemalten Maßstab misst, und Audit 1, das L3 aus genau diesen Blättern
   misst,
3. die Schiel-Probe aus §4 bestanden ist,
4. und ein blinder Prüfer den Frame Seite an Seite gegen die Rayman-Frames legt
   und die Massen als EIN gemalter Körper durchgehen (die Runde, die dieses
   Spec ausgelöst hat: `REPORT_A1_2026-08-11.md`).

---

## §9 · DIE VERDRAHTUNGS-KONVENTION (R4 — Vorbedingung JEDER p2+-Bestellung)

_Nachgetragen von K1 am 2026-08-14. Bis hierher sagte das Spec, WAS zu malen ist,
und schwieg darüber, unter welchem NAMEN die Engine es findet. Genau daran ist die
p1-Lieferung fast gescheitert: Blattname und Stem-Name sind nicht dasselbe. Diese
Konvention ist aus dem lebenden Code abgeleitet (`composition.ts#paintedInterior`,
`composition.ts#crustOf`, `composition.ts#shell`), nicht erfunden._

### 9.1 · Das Namensgesetz: `<klasse>_<phase>_<zelle>`

Jeder Stem, den die Engine aus einem Massen-Blatt zieht, folgt genau diesem Muster.
`<phase>` ist `p1`…`p4` oder `p9`; `<zelle>` ist `a`, `b`, `c`, `d` (Zellen-Reihenfolge
des Blattes von links nach rechts).

| Blatt (Bestellung) | Zellen | Ergibt die Stems | Klasse |
|---|---|---|---|
| `mass_body_<phase>.png` 2048×1024 | Reihe 1, Zellen 0–3 | `mass_body_<phase>_a` … `_d` | `body` |
| ↑ dasselbe Blatt | Reihe 2, Zellen 4–7 | `mass_bodydeep_<phase>_a` … `_d` | `bodyDeep` |
| `mass_deep_<phase>.png` 2048×512 | Zellen 0–1 | `mass_fade_<phase>_a` · `_b` | `fade` |
| ↑ dasselbe Blatt | Zelle 2 | *(Sediment — s. 9.3)* | `sediment` |
| `mass_edges_<phase>.png` 2048×1024 | 8 Zellen | *(Trims — s. 9.3)* | Trims |
| Kurs-Blatt der Phase | 2 + 2 | `crust_<phase>_a` · `_b` · `crust_<phase>_cap_l` · `_cap_r` | `crust` |
| Hüllen-Blatt der Phase | 2 | `l1_<phase>_a` · `_b` | `shell` |

**★ DIE FALLE, die diese Tabelle schließt — Blattname ≠ Stem-Name.** Das Blatt heißt
`mass_deep_<phase>.png`, die Stems daraus heißen `mass_fade_<phase>_*`. Und die zweite
Zellreihe des Body-Blattes hat einen eigenen Klassennamen (`bodydeep`), den das Spec
bisher nirgends nannte — es sagte nur „dieselben vier, eine Blende tiefer" (§3). Eine
Kommission, die das nicht mitliefert, produziert Blätter, die niemand einhängen kann.

### 9.2 · Das Phasen-Gesetz: `PAINTED_MASS_PHASES`

Welche Phase ihr eigenes Papier hat, steht als **deklarierte Liste** im Code —
`composition.ts#PAINTED_MASS_PHASES`. Stand 2026-08-14: `new Set(["p1"])`, also genau
eine gemalte Phase; alle übrigen ziehen weiter aus dem geteilten Körper
(`composition.ts#sharedInterior`).

Die Regel dazu steht im Code selbst und gilt wörtlich:

> „It has to be a DECLARED list rather than a probe, because `massStems` feeds
> `check-paint-art`, which hard-fails on a stem with no PNG (D-27) — naming a phase
> here before its sheets land reds the gate. **Add a phase on the same commit that
> adds its art, never before.**"

Für die Bestellung heißt das: **eine Phase wird nicht „schon mal vorbereitet".** Der
Eintrag und die PNGs reisen im selben Commit, sonst ist das Tor rot.

### 9.3 · Was NICHT pro Phase kommt (und warum)

* **Das Sediment bleibt geteilt** (`mass_sediment`). Der Grund ist gemessen, nicht
  vorsichtig: die Übergabe-Konstanten sind kunst-spezifisch, und über die
  ausgelieferten Grids zeichnet p1 **null** Sediment-Stücke — nur p2 erreicht das
  Sediment überhaupt (15 Stücke). Ein gemaltes p1-Sediment würde also nichts ändern,
  was ein Kind sieht, und dabei das Tiefen-Gesetz brechen. **Es wartet auf p2s Kit —
  und mit ihm die Ableitung der Übergabe-Konstanten aus den eigenen Messwerten
  (D-50).**
* **Die Trims bleiben geteilt** (`mass_edge_l/_r`, `mass_corner_bl/_br`,
  `mass_incorner_l/_r`, `mass_ramp_up/_down`). Grund: das Kanten-Blatt aus Batch AS2
  wurde zurückgehalten, weil seine Seitenkanten senkrecht nicht kacheln (D-47). Kein
  Raum hat bis heute eigene Trims.

### 9.4 · Offen geblieben: die Setzstücke (§6)

`mass.ts` hat weiterhin **keine** `setpiece`-Art. §6 ist damit unverändert eine
Bestellung ohne Anschluss — bewusst gefiled, nicht gebaut. Wer das erste Setzstück-Blatt
bestellt, baut den Anschluss im selben Zug; sonst entsteht Kunst ohne Aufhänger.

### 9.5 · Abnahme-Zusatz für p2+

Zusätzlich zu §8 gilt ab der zweiten Phase: **die Bestellkarte zitiert §9.1 wörtlich**
(Blatt → Zellen → Stems), und die Import-Runde weist nach, dass jeder in 9.1 genannte
Stem nach dem Import existiert. Ein Blatt, dessen Zellen unter anderen Namen landen,
ist nicht angenommen — auch dann nicht, wenn es schön ist.
