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

---

## §10 · DAS MASSEN-KIT p2 · p3 · p4 · p9 — die Bestellung AS5

_Geschrieben in R5-W4 · Session A6 (2026-08-15), nachdem p1s Kanten importiert und
verdrahtet waren und das neue Kohärenz-Gesetz (`scripts/check-composition.mjs`
Audit 11) zum ersten Mal gemessen hat, woran die vier übrigen Räume scheitern.
Jede Zahl unten ist eine Messung dieser Session, keine Schätzung. **Ohne Maße
keine Bestellung** — das ist der Grund, warum dieser Abschnitt existiert._

### 10.0 · Was AS5 kaufen muss, in einem Satz

Vier Räume ziehen heute **denselben warmen Bücherkörper** (`mass_body_a/b`) unter
einem Laufkurs, der für ihren Raum gemalt ist. Audit 11 misst den Bruch:

| Raum | Laufkurs (gemessen) | ΔFarbton Kurs↔Körper | ΔSättigung | Befund |
|---|---|---|---|---|
| p2 Klassenzimmer bei Nacht | 26,17 % · H 258,9° · S 58,5 % | **138°** | 4,8 | violetter Kurs auf warmem Papier |
| p3 Schulhof-Garten | 52,03 % · H 28,6° · S 37,9 % | 16° | **40,8** | Kurs 40,8 Punkte flacher als sein Papier |
| p4 Tafel-Bühne | 18,49 % · H 338,7° · S 74,4 % | **56°** | 13,1 | Bühnenrot auf Honigbraun |
| p9 Kleckskammer | 22,27 % · H 260,2° · S 34,6 % | **137°** | 16,7 | tintiger Kurs auf warmem Papier |

Kein Tint erreicht ein Körper-Blatt. **Nur Malerei schließt das.** Bis dahin
tragen die vier Räume eine datierte Ausnahme (`COHERENCE_WAIVERS`, Ablauf
**2026-09-30**), die maschinell verfällt.

### 10.1 · Je Phase drei Blätter — Maße, Zellen, Stems

Die Stem-Namen folgen §9.1 wörtlich; die Import-Runde weist jeden einzelnen nach (§9.5).

| Blatt | Maße | Raster | Zellen → Stems |
|---|---|---|---|
| `mass_body_<phase>.png` | **2048 × 1024** | 4 × 2 à 512² | R1 Z0–3 → `mass_body_<phase>_a…_d` · R2 Z4–7 → `mass_bodydeep_<phase>_a…_d` |
| `mass_deep_<phase>.png` | **2048 × 512** | 4 × 1 à 512² | Z0–1 → `mass_fade_<phase>_a` · `_b` · Z2 Sediment · Z3 Reserve |
| `mass_edges_<phase>.png` | **2048 × 1024** | 4 × 2 à 512² | s. 10.3 — **acht Zellen, neu belegt** |

**UNGEKEYT** (voll deckend): `mass_body`, `mass_deep`. **GEKEYT `#FF00FF`**: `mass_edges`.

**★ UND ZWEI BLÄTTER FÜR p1 (nachgetragen R5-W4b · A6b).** p1 ist der einzige
Raum mit gemaltem Innenleben, hat aber **keine eigenen Kanten und keine eigene
Rampe** — die Kanten sind mit dem AS3-Rückzug entfallen (§10.3), die Rampen wurden
nie bestellt (§10.3, zweites Blatt). Beide gehören in dieselbe Lieferung, sonst
bleibt der eine fertige Raum der einzige mit Platzhalter-Leisten:

| Blatt | Maße | Raster | Zellen → Stems |
|---|---|---|---|
| `mass_edges_p1.png` | **2048 × 1024** | 4 × 2 à 512² | wie §10.3, **Motivgesetz bindend** |
| ~~`mass_ramps_p1.png`~~ | — | — | **ZURÜCKGEZOGEN (R109, 2026-08-17).** *War:* „2048 × 512, 4 × 1 à 512², Z0/Z1 → `mass_ramp_p1_up` / `_down`, Z2/Z3 Reserve". ch01 trägt über alle fünf Flächen **null** Steigungs-Glyphen (D-267) — ein Rampen-Blatt hätte nichts zu zeichnen |

Der Anker für p1 ist sein **eigener**, bereits abgenommener Körper (46 %), nicht
ein absoluter Zielwert: alle Trims Körper + 6 … + 12 (§10.2). Die Kommission liegt
in `~/Code/codex-art-lab/CODEX_MASTER_PROMPT_AS5_MASSEN_KIT.md`.

### 10.2 · Die Werte je Phase (Vorgabe, nicht Vorschlag)

Mittlere Leuchtdichte über die **gemalten** Pixel, Rec-709, wie `check-composition`
und der Importer sie messen. Der Körper ist der Anker: alles andere steht relativ zu ihm.

| Zelle | Zielwert | Woher |
|---|---|---|
| `body` (R1) | **46 ± 4 %** | §3, unverändert — Audit 1 misst L3 hieraus |
| `bodydeep` (R2) | **26 – 38 %** | die Fenster, die p1s Lieferung besteht (gemessen 28,3–31,6) |
| `fade` | **12 – 18 %** | §4, unverändert (p1 misst 13,8/13,8) |
| Sediment | **7 – 10 %**, Sättigung ≥ 12 % | §4 + Kokis AUFHELLEN-Ruling |
| **alle Trims** | **Körper + 6 … + 12 Punkte** | §5 — und jetzt als VORZEICHEN-Fenster maschinell gehalten (Audit 11 `carve`) |

**★ NEU UND BINDEND — das Kohärenz-Gesetz (Audit 11).** Zusätzlich zu den Werten
gilt für jedes gelieferte Kit, gemessen NACH den Multiplikationen der Engine:

- **Farbton:** jede Fuge (Kurs↔Körper, Kurs↔Seite, Seite↔Körper, Ecke↔Seite)
  ≤ **25°**.
- **Sättigung:** dieselben Fugen ≤ **25 Punkte**.
- **Schnittkante:** Trim − Körper zwischen **+2 und +14** Punkten. Unter dem
  Körper ist es eine Rille, weit darüber eine Schiene — beides ist gefallen.
- **Gleiches Licht:** Ecke gegen Seite ≤ **10 Punkte** Leuchtdichte.

Die Palettenkarte je Raum (CP-14, in JEDE Kommissionskarte):

| Phase | Raum | Papier | Farbfamilie, gemessen am eigenen Laufkurs |
|---|---|---|---|
| p2 | Klassenzimmer bei Nacht (K 30) | dieselben Bücher, mondkühl entsättigt | **H 259° ± 25**, S 58 % ± 25 |
| p3 | Schulhof-Garten (K 86) | gepresstes Papier-Steinwerk, Sandputz | **H 29° ± 25**, S 38 % ± 25 |
| p4 | Tafel-Bühne (K 28) | dunkles Holz, Bühnenbretter, Messing | **H 339° ± 25**, S 74 % ± 25 |
| p9 | Kleckskammer (K 14) | Tintenpapier, Indigo, blasse Papier-Glimmer | **H 260° ± 25**, S 35 % ± 25 |

### 10.3 · Das Kanten-Blatt, neu belegt — und die drei Lehren aus AS3

**★ ALS-GEBAUT-STAND (nachgetragen in R5-W4b · A6b, 2026-08-15).** Der Absatz, der
hier stand, beschrieb einen Zwischenstand von wenigen Stunden: A6 hatte das
AS3-Kanten-Blatt importiert und sechs seiner acht Zellen angenommen. **Noch in
derselben Session wurde der Import zurückgezogen** — zwei frische, blinde
Kritiker bekamen die Bilder in entgegengesetzter Reihenfolge und reihten die neue
Flanke beide unabhängig als LETZTE von vier, unter den Platzhalter, den sie
ersetzen sollte. Der Grund steht als Motivgesetz unten in diesem Abschnitt.

Auf `main` gilt deshalb: **KEINE Zelle von AS3 ist angenommen**, der Import-Block
in `docs/art/import-batch-as.mjs` ist auskommentiert, und p1 zieht weiterhin die
geteilten Platzhalter-Leisten (in seiner eigenen Farbe, `TRIM_SHADE_BY_PHASE`).
Was von A6 **live geblieben ist**, ist die Geometrie-Arbeit und nur sie: die neu
gemessenen `EDGE_BOXES`, die Achsen-Trennung der Naht-Prüfung und der
Selbsttest, der beide Kasten-Zeilen festnagelt. Der Neuschnitt ist dadurch billig.

Die Zellen-Belegung unten bleibt der Vertrag für jede künftige Lieferung:

- **Zelle 0/1 · Seitenkante links / rechts.** Senkrecht (oben↔unten) nahtlos
  kachelbar. **Waagrecht ausdrücklich NICHT** — eine Seitenkante hat eine gemalte
  Außen- und eine geschnittene Innenfläche. AS3 besteht das achtfach (Stoß 2,63
  gegen einen Texturschritt von 12,96), und genau diese Achsen-Trennung ist neu
  im Prüfer (`opt.tiles: "v" | "h" | true`).
- **Zelle 2/3 · Unterseiten-Kante links / rechts — ABGELEHNT bei AS3, neu bestellt.**
  Sie muss **waagrecht (links↔rechts) nahtlos kacheln**, denn die Engine wiederholt
  sie entlang einer Unterseite. AS3s Fassung stößt bei **75,73 bzw. 75,40** gegen
  einen Texturschritt von 5,58 — das Dreizehnfache — und **kein waagrechtes
  Teilfenster von 120 px Breite aufwärts, an keiner Position, kachelt**. Es sind
  Einzelstücke mit einem fertigen Ende, gemalt wie eine Kappe statt wie ein Band.
  ⚠ **Ohne diese Zelle bleibt D-27 offen und die Unterseite jeder Masse ein roher
  waagrechter Schnitt.** Sie ist die einzige Kante ohne Anatomie.
  **★ ALS GEBAUT (R5-W7 · A8, 2026-08-22): der Motor-Haken liegt, die Kunst fehlt
  weiter.** `MassKit.edgeD` (optionales Feld, Varianten `_l`/`_r`), `MassKind
  "edgeD"`, `mass.ts#undersideRuns` und der Planungs-Abschnitt 3b in `planMass`
  sind gebaut; die Stems heißen `mass_edgeD_<phase>_l` / `_r`, genau wie
  `import-batch-as.mjs` sie schon schreibt. Der ganze Zweig steht hinter
  `kit.edgeD !== undefined`, und kein Kit auf `main` deklariert es
  (`PAINTED_UNDERSIDE_PHASES` ist leer, `sharedTrims` hat keine Unterseite) —
  ohne Blatt wird also **kein** Stück geplant: Anzeigeliste unverändert
  (236 · 481 · 331 · 103 · 118 Objekte, gemessen), `check-paint-art` 53/53,
  kein Platzhalter. §9.4 ist damit beantwortet, nicht gebrochen: verboten ist
  ein Haken, der ohne Kunst **zeichnet**. Zahlen für die Bestellung, an ch01
  gemessen: **24 Läufe, 352 Zellen, längster 64 Zellen = 1024 Weltpixel**
  (p1 1/64 · p2 18/137 · p3 2/66 · p4 1/36 · p9 2/49) — die Zelle muss also
  waagrecht **mit sich selbst** kacheln, und sie wird segmentiert und mit
  wechselnden Varianten gelegt (wie die Kruste), nie als ein Streifen.
- **Zelle 4/5 · Außenecken unten links / rechts.** Einzelstücke, werden gestreckt
  gezeichnet, **keine Kachel-Anforderung**. (AS3s Prüfzettel hat sie als
  Kachel-Fehler gemeldet — er hat eine Ecke gefragt, eine Tapete zu sein.)
- **Zelle 6/7 · Innenecken links / rechts.** Wie 4/5.

**★ Motivgesetz.** Eine Kante zeigt die FLÄCHE, die an dieser Stelle wirklich
sichtbar wäre: Seitenkanten = der SCHNITT durch das Material (bei Büchern der
cremefarbene, waagrecht gestreifte Buchschnitt — nie ein Buchdeckel von vorn, nie
Rücken/Prägung/Glanz); Unterseiten = die Unterseite des Stapels; Ecken = derselbe
Schnitt, der um die Ecke geht. AS3 fiel genau daran (zwei blinde Kritiker,
entgegengesetzte Reihenfolge, beide reihten die Flanke als Letzte).

**★★ ZURÜCKGEZOGEN — DIE NÄCHSTE KOMMISSION BESTELLT KEINE RAMPEN (Ruling R109,
eingetragen von K4, 2026-08-17).**

*Hier stand:* „**ZWEITES BLATT, NEU: `mass_ramps_<phase>.png`, 2048 × 512, 4 × 1 à 512²,
GEKEYT.** Zellen 0/1 → `mass_ramp_<phase>_up` / `_down`, Zellen 2/3 Reserve. **Grund:** §5
hat Rampen nie bestellt, alle acht Kanten-Zellen sind belegt, und deshalb ziehen ALLE fünf
Räume — p1 eingeschlossen — weiterhin den geteilten Platzhalter `mass_ramp_up/_down`. Das
ist der graue Keil links unten im Schulhof-Garten auf Kokis Bild `07.29.42`. Werte wie die
übrigen Trims (Körper + 6…12)."

**Was daran nicht mehr stimmt.** A6b hat danach über alle fünf Flächen von ch01 gezählt, wie
viele Steigungen es überhaupt gibt: **null.** Die Engine legt ein Rampen-Stück nur für die
Glyphen `/ \ 1 2 3 4` an, und keine Fläche trägt einen davon. Ein bestelltes Rampen-Blatt
hätte also nichts zu zeichnen — es wäre bezahlte tote Kunst am Tag seiner Lieferung. Auch die
Begründung ist widerlegt: der graue Keil auf Kokis Bild **kann** nicht der Rampen-Platzhalter
sein, und was er stattdessen ist, weiß bis heute niemand (**D-270**). Die Platzhalter selbst
liegen trotzdem in allen fünf Phasen-Scopes und kosten Texturspeicher für nichts — das ist
eine Perf-Frage, keine Kunst-Bestellung, und sie gehört der E-Bahn (**D-267**). Die Frage
„warum hat ch01 eigentlich keine einzige Steigung?" ist eine Level-Frage und gehört der
B-Bahn.

**Was die nächste Kommission (AS5b) stattdessen enthält — R109 im Wortlaut:**
1. **Keine Rampen.**
2. **Die Krusten für p2 / p3 / p4 / p9** in derselben Bestellung (D-265: zwölf von zwanzig
   Krusten-Blättern bluten Schlüsselfarbe, und die Ursache liegt in der gelieferten Quelle,
   nicht in unserem Import — Übermalen ist verboten, also hilft nur Neulieferung).
3. **EINE Naht-Metrik, und zwar die des Wächters** (`importerWouldDelete` je Kachel) — nicht
   die des Lieferscheins. Drei Zählweisen für denselben Sachverhalt haben in Welle 4b drei
   verschiedene Zahlen produziert.
4. **`--verify` als Lauf-Anweisung**, damit Codex seine Lieferung vor dem Absenden durch
   dasselbe Tor fährt, das der Import anwendet — **als Anweisung, nicht als Skript im
   Codex-Repo** (Containment).
5. Die **16 bestandenen Ecken** bleiben liegen und kommen mit ihren Kanten; der
   `edgeD`-Motor-Haken (D-27) geht mit AS5b in **einem** Commit (Lane A7).

⚠ **Datiert (R106):** AS5b muss bis **2026-09-30** importiert sein — an diesem Tag laufen
drei geduldete Ausnahmen zugleich ab.

### 10.4 · Format-Gesetze, verschärft an dem, was AS3 gekostet hat

Zusätzlich zu §7 gilt für AS5:

1. **KEIN Schmier zwischen den Motiven.** AS3s Kanten-Blatt trägt breite Bänder
   gestreckter Pixel zwischen seinen Motiven. Sie sind nicht importiert worden —
   aber sie haben den **eigenen Prüfzettel des Lieferanten auf `"state": "FAIL"`
   gesetzt**, weil er ganze 512er-Zellen gemessen hat statt der Stücke darin.
   Drei seiner vier Befunde waren der Schmier. Flächen, die nicht Motiv sind,
   sind reines `#FF00FF`.
2. **Der Schlüssel ist exakt.** Jedes Schlüsselpixel exakt `#FF00FF`
   (AS3: 1.209.297 von 1.209.297 — vorbildlich). Kein gemaltes Pixel darf die
   Saum-Regel des Importers erfüllen (`r>120 && b>120 && r−g>55 && b−g>55`);
   AS3 hat in allen acht Kästen **null** Treffer.
3. **Jede Zelle nennt ihren Kasten.** `[x0, y0, x1, y1]`, inklusive
   Blatt-Koordinaten, **am gelieferten Blatt gemessen**. Der Kasten muss die
   Malerei exakt umschließen: mehr als 2 px Schlüssel an einer Kante lässt den
   Import fallen — bei einer kachelnden Leiste wiederholt sich diese Lücke sonst
   die ganze Flanke hinunter. **Das ist D-96 in einer Regel:** AS2s Kästen an AS3
   angelegt ergaben einen Stoß von 63,35 statt 2,63, und der Fehler war die
   Tabelle, nicht die Malerei.
4. **Die Naht wird relativ gemessen, nie absolut.** Stoß ≤ **1,5 ×** dem eigenen
   mittleren Spaltenschritt des Blattes, UND der Anstieg innerhalb von 8 px
   ebenso — eine verdoppelte Randspalte liest 0,00 und springt einen Pixel weiter
   innen (die Klasse, an der AS2 gescheitert ist).
5. **Lieferschein.** AS3 kam ohne (nur mit einem Prüfzettel, der sich selbst rot
   meldete). Fable hat die Aufnahme ausnahmsweise erlaubt; **AS5 wird ohne
   Lieferschein nicht angenommen**, und seine Zahlen werden an den KÄSTEN
   gerechnet, nicht an ganzen Zellen.

### 10.5 · Abnahme (zusätzlich zu §8 und §9.5)

Ein Kit ist erst angenommen, wenn `node scripts/check-composition.mjs` seine Zeile
in Audit 11 als **coherent** druckt und der Eintrag des Raums in
`COHERENCE_WAIVERS` im selben PR **gelöscht** ist — das Tor schlägt an, wenn eine
Ausnahme stehen bleibt, die nicht mehr gebraucht wird. Dazu je Raum ein Eintrag in
`composition.ts#TRIM_SHADE_BY_PHASE`, sobald er eigene Trims hat, und die Aufnahme
in `PAINTED_MASS_PHASES` / `PAINTED_TRIM_PHASES` **im selben Commit wie die PNGs**
(§9.2).

### 10.6 · AS5b — was geliefert wurde, was daran gemessen ist, und was AS5c treffen muss

_Als-gebaut, geschrieben in R5-W6 · Session A7 (2026-08-18). Jede Zahl unten ist
mit `node docs/art/import-batch-as.mjs --verify --batch=batch-as5b` gemessen, dem
Tor, das ein Import anwenden würde. **Nichts aus AS5b ist importiert.**_

#### Das Ergebnis in einer Zeile

**100 Zellen · 11 bestehen · 89 fallen.** Von den 11 hat **keine einzige eine
Kachelpflicht** — es sind wieder nur Ecken und Kappen, genau wie bei AS5. Alle
64 Zellen, die sich wiederholen müssen, fallen.

| Raum | Zellen | bestanden | was besteht |
|---|---|---|---|
| p1 | 8 | 4 | vier Ecken |
| p2 | 23 | 2 | zwei Krusten-Kappen |
| p3 | 23 | 1 | eine Krusten-Kappe |
| p4 | 23 | 2 | zwei Außenecken |
| p9 | 23 | 2 | zwei Krusten-Kappen |

#### 1 · Was AS5b RICHTIG gemacht hat — das gehört genannt

- **Die duplizierte Randzeile ist weg.** AS5s Kernfehler (Fuge 0,00, Sprung
  5–57×) kommt in keiner Zelle wieder vor.
- **Der Schlüssel ist repariert, und damit D-199 an der Wurzel.** Die vier
  gelieferten Krusten-Blätter tragen **0** Pixel, die `importerWouldDelete`
  trifft — gegen **6938** in der heute verbauten Quelle `batch-af2/mass/crust_p4.png`.
- **Die Krusten-Bandhöhen treffen den Bestand auf den Pixel:** p2 211 · p3 262 ·
  p4 237 · p9 246, Abweichung 0. Das ist die Geometrie, an der der Renderer die
  Kachel skaliert, und sie sitzt.

#### 2 · Warum trotzdem nichts importiert wurde

**Die Naht wurde geschlossen, indem das Bild entfernt wurde.** Der Lieferschein
schreibt es selbst: die Runde benutze „periodic material functions" statt der
vorherigen Technik. Gemessen heißt das:

| | Pinselschritt (mittlerer Nachbarschritt) |
|---|---|
| die 34 Kacheln, die das Spiel heute zeichnet | **1,74 – 6,90** |
| jede Zelle aus AS5b | **0,05 – 0,82** |

Die beiden Mengen überschneiden sich nicht. Angesehen bestätigt sich die Zahl:
das p1-Körperblatt auf der Platte zeigt einen gemalten Bücherstapel mit Rücken,
Goldbändern und Schnittkanten — das AS5b-Körperblatt zeigt weiche waagrechte
Streifen ohne einen einzigen Gegenstand. **Zwei frische, blinde Kritiker** haben
dasselbe Paar in entgegengesetzter Reihenfolge beurteilt und beide unabhängig
den Bestand gewählt; über die Lieferung schrieben beide, sie enthalte keine
benennbaren Objekte. Das Motivgesetz (§10.3) ist damit nicht knapp verfehlt,
sondern gar nicht erst adressiert.

#### 3 · Fünf Zellen sind Kopien anderer Zellen

Kein Wertefenster kann das sehen, deshalb prüft es das Tor jetzt (byte-identisch,
nicht statistisch — gespiegelte Kappen sind richtig und bleiben grün):

| Blatt | Kopie | | Blatt | Kopie |
|---|---|---|---|---|
| `crust_p4` | Z2 = Z0, Z3 = Z1 (beide Kappen = die Schleife) | | `mass_edges_p3` | Z3 = Z2 (zweite Unterseite) |
| `crust_p3` | Z3 = Z1 (rechte Kappe = Schleife B) | | `mass_edges_p4` | Z3 = Z2 |

AS3, AS5 und die übrigen AS5b-Blätter tragen ausschließlich verschiedene Zellen —
die Lieferung weicht ab, nicht das Gesetz.

#### 4 · ★ Der Grund, warum das Tor rot war und der Lieferschein grün: zwei Lineale

Für `mass_body_p2` Z0 druckt der Lieferschein dasselbe Nahtprofil, das unser Tor
misst (`[1.663, 4.656, …]` — Ziffer für Ziffer). Verschieden ist nur der **Nenner**:

| | „eigener Texturschritt" für dieselbe Zelle |
|---|---|
| Lieferschein (global gerechnet) | **22,25** |
| `--verify` (Nachbarpixel-Schritt) | **0,21** |

Faktor 106. Beide Seiten rechnen richtig und das Tor wird trotzdem rot — **weil
Erzeuger und Tor nicht dasselbe Lineal benutzt haben.** A6b hat `--verify` genau
dafür gebaut; AS5b ist ohne es abgeschickt worden. Das ist die erste Zeile der
nächsten Bestellung.

#### 5 · AS5c — die Bestellung, in Zahlen

1. **Fahrt unser Tor, nicht euer eigenes.**
   `node docs/art/import-batch-as.mjs --verify --batch=<batch>` muss **Exit 0**
   liefern, bevor die Lieferung abgeht. (Lauf-Anweisung, kein Skript im
   Codex-Repo — Containment, R109.4.)
2. **Der Texturschritt ist der Nachbarpixel-Schritt, nicht der Bildkontrast** —
   mittlere absolute Differenz benachbarter Spalten über alle gemalten Pixel.
   Beleg für die Verwechslung: 0,21 gegen 22,25 an derselben Zelle.
3. **Pinselschritt ≥ 1,5**, Zielband **3–6** (der Bereich der angenommenen Kunst).
   Das ist die maschinelle Fassung des Satzes „hier muss ein Bild sein".
4. **Motiv vor Naht.** Jede Zelle zeigt benennbare Dinge (§10.3 Motivgesetz):
   Körper = Bücherstapel/Material des Raums · Kruste = Laufkurs mit Planken und
   Kanten · Seitenkante = der Schnitt durch das Material. Eine nahtlose Fläche
   ohne Motiv ist ABGELEHNT, auch wenn jede Zahl passt.
5. **Kein Helligkeitsverlauf innerhalb einer Zelle** (unverändert aus AS5b-Rückgabe;
   ein Verlauf kann sich senkrecht nicht selbst fortsetzen — das Licht trägt die
   Engine, `depthTintAt`).
6. **Fuge ≤ 1,5× dem Texturschritt UND Anstieg über 8 px ≤ 1,5×.**
7. **Vier verschiedene Zellen je Blatt.** Gespiegelt ist erlaubt, byte-identisch nicht.
8. **Krusten-Bandhöhe exakt** p2 211 · p3 262 · p4 237 · p9 246 — die Höhe, aus
   der der Renderer die Kachel skaliert. (AS5b hat das getroffen; es bleibt Vorgabe.)
9. **Null Pixel mit `r>120 && b>120 && r−g>55 && b−g>55`** in der Malerei
   (`importerWouldDelete` — dieselbe Funktion, die der Naht-Wächter zählt).
   AS5b hat das erreicht; es bleibt Vorgabe, sonst kehrt D-199 zurück.
10. **Keine Rampen** (R109, unverändert).

#### 6 · Der Datums-Entscheid (Ruling R147, Eigentümer A7, 2026-08-18)

| Ausnahme | Entscheid | Grund |
|---|---|---|
| `SEAM_ALLOW` (9 Krusten) | **verlängert auf 2026-11-30** | Reparatur geliefert, aber ohne Motiv — nicht importierbar |
| `COHERENCE_WAIVERS` (p2/p3/p4/p9) | **verlängert auf 2026-11-30** | die Körper-Blätter bestehen 0 von 64 Kachel-Zellen |
| `PLACEHOLDER_UNTIL` | **unverändert 2026-09-30** | **gemessen: 0 von 69 verdrahteten Stems sind Platzhalter.** Das Datum feuert heute gar nicht (`check-paint-art.mjs#placeholders` prüft nur bei `length > 0`) — es ist eine scharfe, ruhende Waffe für das nächste Kit. Sie zu verlängern hieße, einen Wächter ohne Anlass zu schwächen |

Kein rotes `main` am 01.10.; keine stille Verlängerung.
