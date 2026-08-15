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

AS3s Kanten-Blatt ist heute importiert; **sechs seiner acht Zellen sind
angenommen**, zwei nicht. Die Neubelegung schreibt beide Befunde fest:

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
- **Zelle 4/5 · Außenecken unten links / rechts.** Einzelstücke, werden gestreckt
  gezeichnet, **keine Kachel-Anforderung**. (AS3s Prüfzettel hat sie als
  Kachel-Fehler gemeldet — er hat eine Ecke gefragt, eine Tapete zu sein.)
- **Zelle 6/7 · Innenecken links / rechts.** Wie 4/5.

**★ ZWEITES BLATT, NEU: `mass_ramps_<phase>.png`, 2048 × 512, 4 × 1 à 512², GEKEYT.**
Zellen 0/1 → `mass_ramp_<phase>_up` / `_down`, Zellen 2/3 Reserve. **Grund:** §5 hat
Rampen nie bestellt, alle acht Kanten-Zellen sind belegt, und deshalb ziehen ALLE
fünf Räume — p1 eingeschlossen — weiterhin den geteilten Platzhalter
`mass_ramp_up/_down`. Das ist der graue Keil links unten im Schulhof-Garten auf
Kokis Bild `07.29.42`. Werte wie die übrigen Trims (Körper + 6…12).

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
