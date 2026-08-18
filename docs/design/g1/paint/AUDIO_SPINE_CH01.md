# AUDIO-SPINE ch01 — wie das Malbuch klingt, und woran jeder Klang hängt

_R5 · S1, 2026-08-17. Kanon für den Ton des Gemalten Buches, Kapitel 1. Er sagt, **was** klingt,
**wie** es klingt, **woran** es hängt und **was gemessen** wird. Er sagt nicht, wie es sich anfühlt —
das entscheidet Kokis Ohr an der Hörbank (`docs/audio/hoerbank.html`, R128)._

**Bindende Nachbarn:** `docs/BLUEPRINT.md` §VII.0 (Doktrin, besonders `:371`) · `STORY_SPINE_CH01.md` §3
(die fünf Räume) · `docs/PERF_WAECHTER.md` (Budgets) · `docs/audio/prompts.ch01.json` (dieselben
Tabellen als Daten — `scripts/check-audio.mjs` erzwingt, dass beide dieselben Stems nennen).

---

## §0 · Das Kanon-Amendment R124 (Koki, 2026-08-17)

Der Blueprint sagt seit 2026-07-06: „sound = synthesized WebAudio (zero asset bytes), opt-in,
**default OFF**" (`:369`, `:374`). Für das Gemalte Buch ist das **abgelöst**:

> **R124 (Koki, 2026-08-17).** Das Malbuch bekommt **erzeugte Klang-Assets** (ElevenLabs: Musik und
> Effekte), **Ton standardmäßig AN, leise**, mit **sichtbarem Stumm-Knopf**; die Wahl wird pro Gerät
> gespeichert. `@domigo/game-feel` (Synth, default OFF) bleibt unverändert für die anderen Spiele.

**Was NICHT abgelöst ist — und diesen ganzen Kanon regiert:**

> `BLUEPRINT.md:371` — „wrong = a soft neutral thud … never shake/flash/red-pulse/**descending audio**.
> The reveal is a teaching moment, not a verdict."

Das ist kein Stilwunsch, das ist die Pädagogik des Hauses. Jeder Klang, der an einem Fehl-Ereignis
hängt, ist deshalb **`pedagogy: "neutral"`**: kurz, weich, ohne fallende Tonhöhe, ohne Moll-Kadenz,
ohne Summer, ohne Alarm — und er stellt sich nie über das Lob. §4 macht daraus eine **Messung**,
damit die Regel nicht von gutem Willen abhängt; was die Messung leisten kann und was nicht, steht
dort ausdrücklich dabei.

---

## §1 · Eine Hand — die Klang-Welt in einem Absatz

Das Kapitel spielt **in einem gemalten Schulbuch**. Alles, was klingt, ist deshalb aus **trockener
Kreide, Papier, Holz und Filz**, in einem **kleinen Klassenraum**, nah mikrofoniert, **ohne Hallfahne**.
Kein Metall, kein Synthesizer, kein Kino-Sounddesign. Ein einziger Satz steht vor **jedem** Prompt
und macht „derselbe Raum" zu einer Eigenschaft der Pipeline statt zu einer Hoffnung:

> `dry chalk, wood, paper, felt; small classroom, close mic, no reverb tail, no music, no voice`

**Ein Instrument je Familie** — so klingt das Kapitel wie eine Hand und nicht wie ein Sample-Paket:

| Familie | Das eine Instrument | Bus |
|---|---|---|
| `foot` | Filz auf Papier/Erde/Bühnenholz | sfx |
| `body` | Stoff und Papier-Luft (Sprung, Landung, Rutschen) | sfx |
| `ui` | Holz-Klick + Papierblatt | sfx |
| `positive` | **eine** Xylophon-Note, gestuft aufsteigend | sfx |
| `neutral` | weicher gedämpfter Thud auf Holz | sfx |
| `world` | Kreide, Holz, Tinte, Blech-frei | sfx |
| `music` | kleines akustisches Ensemble, mono | music |

**Busse und Lautstärken.** `master 0,25` (die Klassenraum-Decke, von `@domigo/game-feel` übernommen:
ein Tablet in der letzten Reihe darf niemanden stören) → `sfx 1,0` · `music 0,12`. Unter einer Fanfare
(`positive`, ≥ 1 s) wird die Musik auf **0,5** gezogen und über 300 ms zurückgeführt (Ducking), damit
der Moment des Kindes über der Musik steht. Schritte werden unter einer Fanfare auf **0,5** gedämpft.

**Was Rayman 1 hier beiträgt** (`docs/study/Was It Any Good - Rayman 1 (Transcript).docx`, selbst
extrahiert): der Grundton des Vorbilds ist ein „upbeat, happy-clappy soundtrack", und die Bewertung
nennt ausdrücklich „incredible audio and lovely ambience" — Freundlichkeit ist dort die Norm, nicht
die Ausnahme. Und im Sumpf-Level **wechselt die Musik** in eine bedrohliche Steigerung, während die
Effekte bleiben, was sie sind. Daraus folgt die Regel, die §0 von der anderen Seite bestätigt:
**Spannung kommt aus der Musik, nie aus dem Fehlerklang.**

---

## §2 · Woran ein Klang hängt — die vier Anschlussstellen

Der Auftrag ging davon aus, alle Effekte hingen an den 15 **SimEvents** (den Meldungen, die die
Spiel-Logik nach oben durchreicht) und den 8 **PlayerEvents**. Am Code geprüft (`sim.ts:779` und
`:845-1060`) stimmt das nur zur Hälfte, und der Unterschied ist für S2 entscheidend:

- `onPlayerEvent` beantwortet **nur zwei** der acht PlayerEvents (`fistThrown`, `encounter`); die
  anderen sechs verlassen `stepPlayer` nie.
- `onEntityEvent` **faltet** die 16 EntityEvents: `cageBurst` wird zu gar keinem SimEvent (nur zu
  einer Karte), `cageHit`/`shooed`/`cageGated` werden zu einem **Toast**, `guardianStagger` zu einer
  Boss-Karte. Als Klang-Auslöser sind sie oben nicht mehr unterscheidbar.

Deshalb trägt **jeder Stem seine Anschlussstelle**:

| Kürzel | Wo S2 den Hörer anklemmt |
|---|---|
| `sim` | `PaintScene#handleSimEvents` (`:1461`) — der Trichter, der schon existiert |
| `entity` | eine Zeile in `Sim#onEntityEvent` (`sim.ts:845`), die den Direktor mithören lässt |
| `scene` | eine Flanke im Spieler-Zustand, pro Takt gelesen — genau das, was `PaintScene#footwork` (`:2942`) für Staub schon tut |
| `shell` | die React-Hülle (`PaintGame.tsx`) — Karte auf/zu, Lösung richtig/falsch |

**Drei Zustände, kein vierter.** Jede der 39 Ereignis-Arten (15 + 8 + 16) ist genau eines:

- **`mapped`** — sie hat einen Stem, und der liegt als Datei auf der Platte;
- **`silent`** — sie bekommt bewusst keinen Klang, **mit Grund**;
- **`reserved`** — sie **kann in ch01 nicht feuern**; der Eintrag nennt das Kapitel, das sie freischaltet,
  und es wird **keine Datei erzeugt** (keine Bytes, keine toten Klänge).

### §2a · Was ch01 nicht auslösen kann — und warum (am Code geprüft, 17.08.)

`content/…/paint/ch01.level.json` gibt `abilities: ["jump", "run"]` und enthält **kein einziges
`powerup`-Entity**; die Glyphen im ganzen Kapitel sind `# * C S X w z` — keine Feder (`s`), kein
Schwungring (`o`), kein Eis (`~`), kein Einweg-Brett (`=`), keine Tintenspitze (`^`).
`entities.ts:1409` sagt es selbst: „↑ opens a cage in a chapter with **no fist**."

| Ereignis | Warum es in ch01 stumm bleibt | Frei ab |
|---|---|---|
| `fistThrown` · `projectileDeflected` · `cageHit` · `puff{kind:"hit"}` | die Faust wird nie vergeben (`canPunch` = false) | ch01-mid / ch02, sobald ein `powerup`-Entity sie gibt |
| `hoverStart` | `canHover` = false | ch04 (Federkiel-Rotor) |
| `grabbedLedge` | `canHang` = false, kein `=`-Glyph | ch02 |
| `swingStart` | kein `o`-Glyph im Kapitel | später |
| `sprung` | kein `s`-Glyph im Kapitel | später |
| `powerupTaken` · SimEvent `powerup` | kein `powerup`-Entity in ch01 | ch01-mid |
| SimEvent `book` | kein `book`-Entity in ch01 (nur 5 × `tip`) | später |
| PlayerEvent `encounter` mit `^` | kein `^`-Glyph; nur `w` (Tinte) kommt vor | später |

Diese acht Zeilen sind **`reserved`**, nicht vergessen. Die Pipeline bleibt kapitelfähig: ihre Prompts
stehen bereits in `prompts.ch01.json` unter `reserved: true` und werden **nicht** generiert.

### §2b · Die SFX-Tabelle

Spalten: **Stem** · **Familie** · **`pedagogy`** · **Anschlussstelle** (Ereignis) · **Dauer** ·
**Varianten** · **Regel**. Der Prompt ist die Zeile aus `prompts.ch01.json` (dort wörtlich, damit die
Daten die Quelle sind und nicht eine Abschrift); jeder Prompt trägt den Material-Satz aus §1 voran
und die Negativliste aus §2c hinten.

#### Bewegung — das Kind selbst

| Stem | Fam. | Päd. | Anschluss | Dauer | Var. | Regel |
|---|---|---|---|---|---|---|
| `step-paper` | foot | info | `scene` · Schrittflanke, p1 · p2 · p9 | 0,25 s | 4 | ≥ 90 ms Ratenlimit · Rotation ohne Wiederholung · Lautstärke `0,35 + 0,65·min(1,|vx|/vmax)` · ±3 % Detune |
| `step-garden` | foot | info | `scene` · Schrittflanke, p3 | 0,25 s | 4 | wie oben |
| `step-board` | foot | info | `scene` · Schrittflanke, p4 (Bühnenholz) | 0,25 s | 4 | wie oben |
| `jump` | body | info | `scene` · `jumpedAgo === 0` | 0,30 s | 3 | eine Stoff-/Papier-Luft, kein „Boing" |
| `land-soft` | body | info | `scene` · `landedAgo === 0`, `fallVy < LAND_DUST_VY·2` | 0,30 s | 2 | teilt die Schwelle mit dem Staub, damit Bild und Ton denselben Moment meinen |
| `land-hard` | body | info | `scene` · `landedAgo === 0`, `fallVy ≥ LAND_DUST_VY·2` | 0,45 s | 2 | nie härter als `arena-brief`; ein tiefer Fall ist ein Ereignis, kein Schreck |
| `slide` | body | info | `scene` · `onSlide` steigende Flanke (p3, `z`-Glyph) | 0,50 s | 2 | einmalig je Rutschbeginn, kein Loop |

#### Die Welt — was das Kind anfasst

| Stem | Fam. | Päd. | Anschluss | Dauer | Var. | Regel |
|---|---|---|---|---|---|---|
| `cage-open` | world | info | `entity` · `cageBurst` | 0,60 s | 2 | Holzriegel + Papierbersten; kein Glas, kein Metall |
| `cage-locked` | neutral | **neutral** | `entity` · `cageGated` | 0,35 s | 1 | die Absage, wenn der Wächter noch steht — **darf nicht fallen** (§4) |
| `cage-free` | positive | positive | `sim` · `cageFreed` | 1,50 s | 2 | kleine Fanfare; duckt die Musik |
| `door-open` | world | info | `sim` · `exit` | 0,60 s | 2 | **R48: die Tür freut sich nicht, sie geht auf** — ein Riegel, ein Schwung, fertig |
| `gate-waits` | neutral | **neutral** | `sim` · `toast`, Torschluss-Klasse (`toastMatch`) | 0,30 s | 1 | „Die Tür wartet auf ihr Wort!" · „Die Tafel ist noch voller Kritzel!" — das Kind steht am Ausgang und darf noch nicht. Eine Frage, kein Tadel |
| `letter-take` | positive | positive | `sim` · `letterTaken` | 0,30 s | 3 | **aufsteigend gestuft** (drei Stufen, wie game-feels Tier-Chimes); die Stufe steigt mit `got` |
| `letters-all` | positive | positive | `sim` · `letters` mit `got === total` | 1,50 s | 1 | die einzige Fanfare der Buchstaben |
| `page-take` | ui | info | `sim` · `tip` | 0,40 s | 2 | ein Blatt wird aufgehoben; die Welt friert dazu ein |
| `wipe` | world | info | `sim` · `guardianWipe` mit `layersLeft > 0` | 0,50 s | 3 | Kreide-Wisch; drei Schichten, drei Varianten in Folge |
| `board-bloom` | positive | positive | `sim` · `guardianDown` | 1,50 s | 1 | **sie blüht sonnengelb auf** — der größte Klang des Kapitels; duckt die Musik. ⚠ der Ereignis-NAME ist ein Code-Relikt: die Tafel wird nicht besiegt, sie wird sauber (R50). Hier gehört ein Aufblühen hin, kein Niederschlag |
| `arena-brief` | world | info | `sim` · `arenaBrief` | 1,50 s | 1 | Braam-lite, **kindgerecht**: warm, tief, kein Horn-Kino, kein Schreck |
| `boss-window` | world | info | `entity` · `guardianStagger` | 0,50 s | 1 | das Fenster geht auf — ein Innehalten, kein Treffer-Sound |
| `ink-splash` | neutral | **neutral** | `sim` · `toast` „Platsch!" (PlayerEvent `encounter`, `hazard === "w"`) | 0,40 s | 2 | **DER Fehlerklang des Kapitels.** Weich, nass, gedämpft; steigt oder bleibt, fällt nie |
| `bump` | neutral | **neutral** | `entity` · EntityEvent `encounter` (Wesen berührt das Kind) | 0,35 s | 2 | der Rückstoß an einem Falter, einem Jäger, der Tafel. Ein weicher Stoß gegen Stoff — **kein Treffer, kein Schmerz**; die Rücksetzung ist die Lehre, nicht der Schreck |
| `shoo` | world | info | `entity` · `shooed` | 0,35 s | 2 | „Husch!" — ein Papierflattern, nichts Getroffenes |
| `puff-chalk` | world | info | `sim` · `puff` mit `kind === "chalk"` | 0,25 s | 2 | ≥ 120 ms Ratenlimit (der Staub kommt in Fünferbüscheln) |
| `being-answered` | positive | positive | `sim` · `entityResolved` | 0,80 s | 2 | die sechs entfärbten Gegenstände und die Zahlen-Falter — `sim.ts` nennt sie selbst: „a moth that asked its number, a drained object that got its colour back". Eine Stufe unter `cage-free` |
| `merle-round` | positive | positive | `shell` · Runde gelöst am `classmate` | 0,60 s | 3 | **aufsteigend über ihre sechs Runden** (3 Stufen, je zwei Runden) — ihr Kern-Beat. Nicht ihr Gehen: Merle bewegt sich seit R49 frei in ihrem Raum, und das ist Bild, kein Klang |

#### Hülle und Karten

| Stem | Fam. | Päd. | Anschluss | Dauer | Var. | Regel |
|---|---|---|---|---|---|---|
| `card-open` | ui | info | `sim` · `task` (jede Karte kommt hier heraus) | 0,30 s | 3 | Holz-Klick + Papier. Deckt AUCH die vier Ereignisse, die nichts anderes tun, als eine Karte zu heben (§2d): `cageHint` · `engaged` · `cageAsk` · `awakenAsk` |
| `card-close` | ui | info | `shell` · Karte schließt | 0,30 s | 3 | dieselbe Hand, rückwärts gedacht |
| `page-turn` | ui | info | `shell` · Regel-Seite/Buch geblättert | 0,40 s | 2 | ein Blatt, kein Buchdeckel |
| `toast` | ui | info | `sim` · `toast` | 0,20 s | 2 | ein **leiser** Tick — Toasts kommen oft |
| `solve-ok` | positive | positive | `shell` · Lösung angenommen | 0,50 s | 3 | **aufsteigend gestuft** (nah · teilweise · richtig), Xylophon, eine Note je Stufe |
| `solve-thud` | neutral | **neutral** | `shell` · Lösung nicht angenommen | 0,30 s | 2 | **der weiche neutrale Thud von `:371`.** Kein Summer, kein Alarm, kein Fallen |

**Zahl der Dateien:** 31 Stems, 69 Varianten. Alle `neutral`-Stems: `cage-locked` · `gate-waits` ·
`ink-splash` · `bump` · `solve-thud` — fünf, und §4 misst jeden einzelnen.

**Fünf Stems hängen an der Hülle, nicht an einem der 39 Ereignisse:** `card-close` · `page-turn` ·
`solve-ok` · `solve-thud` · `merle-round`. Sie entstehen dort, wo React eine Karte schließt oder eine
Antwort bewertet — die Spiel-Logik erfährt davon nichts, und das ist richtig so.

### §2d · Der Abdeckungs-Vertrag — alle 39 Ereignis-Arten, jede mit genau einem Zustand

Diese Tabelle ist die Prüfvorschrift: `audioManifest.ts` bildet sie 1 : 1 ab, und
`audio/coverage.test.ts` leitet die 39 Arten **aus den Union-Typen** ab (nicht aus dieser Tabelle) und
verlangt für jede einen Eintrag. Eine neue Ereignis-Art im Code lässt den Test rot werden — genau dann,
wenn jemand entscheiden muss, wie sie klingt.

| # | Union | Ereignis | Zustand | Stem bzw. Grund |
|---|---|---|---|---|
| 1 | Sim | `toast` | mapped | `toast` (leiser Tick) — außer den per `toastMatch` erkannten Torschluss- und Tinten-Zeilen |
| 2 | Sim | `task` | mapped | `card-open` — **jede** Karte kommt hier heraus |
| 3 | Sim | `powerup` | **reserved** | ch01 hat kein `powerup`-Entity |
| 4 | Sim | `cageFreed` | mapped | `cage-free` |
| 5 | Sim | `guardianDown` | mapped | `board-bloom` |
| 6a | Sim | `guardianWipe`, `layersLeft > 0` | mapped | `wipe` |
| 6b | Sim | `guardianWipe`, `layersLeft === 0` | **silent** | feuert im selben Augenblick wie `guardianDown`; zwei Klänge auf einem Beat sind einer zu viel — `board-bloom` trägt ihn |
| 7 | Sim | `cageHint` | **silent** | hebt ausschließlich eine Karte (`sim.ts:1090` setzt `overlayOpen`) — `card-open` klingt bereits |
| 8 | Sim | `arenaBrief` | mapped | `arena-brief` |
| 9a | Sim | `letters`, `got === total` | mapped | `letters-all` |
| 9b | Sim | `letters`, `got < total` | **silent** | `letter-take` hat denselben Augenblick schon beklungen |
| 10 | Sim | `letterTaken` | mapped | `letter-take` (3 Stufen) |
| 11 | Sim | `entityResolved` | mapped | `being-answered` |
| 12 | Sim | `tip` | mapped | `page-take` |
| 13 | Sim | `book` | **reserved** | ch01 hat kein `book`-Entity (nur 5 × `tip`) |
| 14a | Sim | `puff`, `kind === "chalk"` | mapped | `puff-chalk` |
| 14b | Sim | `puff`, `kind === "hit"` | **reserved** | entsteht nur an der Faust |
| 15 | Sim | `exit` | mapped | `door-open` |
| 16 | Player | `jumped` | mapped | `jump` (`scene`: `jumpedAgo === 0`) |
| 17 | Player | `landed` | mapped | `land-soft` / `land-hard` (`scene`: `landedAgo === 0`, Schwelle wie beim Staub) |
| 18 | Player | `hoverStart` | **reserved** | `canHover` = false in ch01 (ch04) |
| 19 | Player | `sprung` | **reserved** | kein `s`-Glyph im Kapitel |
| 20 | Player | `fistThrown` | **reserved** | keine Faust in ch01 |
| 21a | Player | `encounter`, `hazard === "w"` | mapped | `ink-splash` |
| 21b | Player | `encounter`, `hazard === "^"` | **reserved** | kein `^`-Glyph im Kapitel |
| 22 | Player | `grabbedLedge` | **reserved** | `canHang` = false (ch02) |
| 23 | Player | `swingStart` | **reserved** | kein `o`-Glyph im Kapitel |
| 24 | Entity | `encounter` | mapped | `bump` |
| 25 | Entity | `engaged` | **silent** | hebt nur die Wiederherstellungs-Karte → `card-open` |
| 26 | Entity | `cageHit` | **reserved** | die Zwei-Schlag-Grammatik gehört der Faust (`entities.ts:1409`) |
| 27 | Entity | `cageBurst` | mapped | `cage-open` |
| 28 | Entity | `cageAsk` | **silent** | hebt nur die Karte erneut; das Bersten hat schon gespielt |
| 29 | Entity | `cageGated` | mapped | `cage-locked` |
| 30 | Entity | `awakenAsk` | **silent** | hebt nur Merles Runde erneut → `card-open` |
| 31 | Entity | `doorTouched` | **silent** | hebt die Tür-Karte → `card-open`; das Aufgehen klingt am SimEvent `exit` |
| 32 | Entity | `powerupTaken` | **reserved** | wie #3 |
| 33 | Entity | `pickupTaken` | **silent** | gefaltet — die SimEvents `tip` / `book` tragen den Klang |
| 34 | Entity | `guardianStagger` | mapped | `boss-window` |
| 35 | Entity | `guardianKnot` | **silent** | gefaltet — das SimEvent `guardianWipe` trägt den Klang |
| 36 | Entity | `guardianDown` | **silent** | gefaltet — das gleichnamige SimEvent trägt den Klang (**zwei verschiedene Ereignisse mit einem Namen**, siehe unten) |
| 37 | Entity | `projectileDeflected` | **reserved** | braucht die Faust (`entities.ts:1908`) |
| 38 | Entity | `puff` | **silent** | gefaltet — das gleichnamige SimEvent trägt den Klang |
| 39 | Entity | `shooed` | mapped | `shoo` |

**Drei Namen kommen zweimal vor, in verschiedenen Unionen mit verschiedener Bedeutung:**
`encounter` (Player = Berührung mit Tinte/Spitzen · Entity = Berührung mit einem Wesen),
`guardianDown` (Entity = sie ist unten · Sim = die Szene soll es zeigen) und `puff` (Entity → Sim,
1 : 1 weitergereicht). Das Manifest nennt deshalb bei **jedem** Eintrag die Union, nie nur den Namen —
ein Klang am falschen `encounter` wäre lautlos und niemandem aufgefallen.

**Toast-gebundene Klänge sind maschinell gebunden.** `gate-waits` und `ink-splash` hängen an einem
SimEvent `toast` mit einem bestimmten Text — die einzige Stelle, an der die Spiel-Logik diese Beats
nach oben meldet. Ein Text-Vergleich ist brüchig: die Copy-Bahn darf jeden dieser Sätze jederzeit
umformulieren. Deshalb trägt das Manifest je Stem einen `toastMatch`, und **`check-audio.mjs` prüft,
dass jedes `toastMatch` noch auf ein Literal in `sim.ts` passt.** Wird eine Zeile umformuliert, geht
das Tor rot, statt dass der Klang still verschwindet. *(Filed für Fable: sauberer wäre ein eigenes
SimEvent für den Torschluss — `sim.ts` gehört dieser Session nicht.)*

**Geprüft von zwei blinden Lesern (17.08.2026), die einander nicht kannten.** Der Kanon-Prüfer las
gegen `BLUEPRINT.md:365-400` und `STORY_SPINE_CH01.md §3`: Tür (R48), Fliegende Tafel (R50), Merle
(R49) und Kleckskammer decken sich mit dem Story-Spine; seine drei Befunde an der Messvorschrift sind
in §4 eingearbeitet. Der Abdeckungs-Prüfer leitete die 39 Arten selbst aus den Unionen ab und fand
**sieben unklassifizierte Ereignisse** und **einen Klang am falschen Codepfad** (`door-waits`, oben zu
`gate-waits` berichtigt) — beide Befunde sind hier eingearbeitet. Protokolle:
`REPORTS/REPORT_S1_2026-08-17/pruefer_kanon.md` und `pruefer_abdeckung.md`.

### §2c · Die Negativliste (steht hinten in JEDEM Prompt)

> `no descending pitch, no minor cadence, no buzzer, no alarm, no reverb, no music, no voice`

---

## §3 · Die Musik — sieben Stücke

Fünf Räume, ein Auftakt, ein Sieg. Jedes Loop-Stück ist **mono, 45 s**, beginnt und endet auf der
Tonika, **ohne Intro und ohne Ritardando**, damit Takt 1 an Takt N passt; die Naht wird beim Mastern
mit 20 ms Equal-Power-Crossfade eingebacken und als `loopStart/loopEnd` ins Manifest geschrieben
(Wiedergabe als Phaser-Marker — MP3-Encoder-Lücken sind damit gegenstandslos).

| Stem | Raum (Story-Spine §3) | Stimmung | Tempo / Tonart | Länge | Loop |
|---|---|---|---|---|---|
| `music-p1` | **Eingangshalle** — „gestrandet-hoch" | neugierig, hell, ein bisschen verloren; das Kind sieht zum ersten Mal, wo es ist | ~92 BPM, Dur | 45 s | ja |
| `music-p2` | **Klassenzimmer bei Nacht** — Mondlicht, Merle | sanft, leise, sehr wenig Instrumente; die einzige Person des Kapitels steht hier | ~72 BPM, Dur mit einer offenen Quarte | 45 s | ja |
| `music-p3` | **Schulhof-Garten** — „das terrassierte V" | spielerisch, etwas mehr Puls: rutschen, warten, aufsteigen | ~112 BPM, Dur | 45 s | ja |
| `music-p9` | **Kleckskammer** — „nichts als Buchstaben und Angeberei" | verspielt-geheimnisvoll, tropfende Tinte, augenzwinkernd | ~100 BPM, Dur mit erhöhter Quarte | 45 s | ja |
| `music-p4` | **Die Tafel-Bühne** — „Bühne vor leerem Saal" | **ernst, aber grantig, nicht böse** (Rayman-1-Ton); sie wird sauber gemacht, nicht besiegt (R50) — also entschlossen, nie bedrohlich | ~120 BPM, Dur mit gesenkter Septime | 45 s | ja |
| `music-title` | **Auftrags-Karte** — der einzige Moment, in dem das Buch selbst spricht | kurzes Titel-Motiv, warm, einladend | ~92 BPM, Dur | 8 s | nein |
| `music-win` | **Bilanz** | Sieg-Sting, kurz, ohne Nachhall | — | 3 s | nein |

Jeder Musik-Prompt endet mit `instrumental only` und läuft mit `force_instrumental: true`.
**Was die Musik nicht tut:** sie wechselt nie in eine bedrohliche Steigerung, wenn das Kind einen
Fehler macht (§1, Rayman-Lehre) — der Raum bestimmt die Musik, nicht die Leistung.

---

## §4 · Nachbearbeitung und die Fenster, in denen gemessen wird

Jeder Take läuft durch **dieselbe** Kette (`docs/audio/master.mjs`) — „derselbe Raum" ist ein
Pipeline-Ergebnis, kein Prompt-Ergebnis:

1. `-ac 1` (mono) mit L/R-Korrelationsprüfung: **Mono-RMS ≥ Stereo-RMS − 3 dB**, sonst hat das
   Zusammenlegen etwas ausgelöscht und der Take geht zurück.
2. Hochpass 80 Hz — ein Klassenraum hat keinen Subbass, und ein Tablet-Lautsprecher gibt ihn ohnehin
   nur als Verzerrung wieder.
3. Lautheit angleichen — **zwei Instrumente, nach Länge**:
   - **ab 1 s** (Musik und die Fanfaren): `loudnorm` in **zwei Durchgängen** (erst messen, dann mit
     den gemessenen Werten normalisieren — ein Durchgang trifft das Fenster nicht zuverlässig);
   - **unter 1 s** (die meisten Effekte): RMS-Normalisierung.

   **Warum zwei.** EBU R128 mittelt über 400-ms-Blöcke. Ein 0,25-Sekunden-Schritt hat keinen
   einzigen vollständigen — „−16 LUFS" ist dort keine strengere Messung, sondern gar keine.
   `audio.measured.json` schreibt bei **jeder** Datei in `method`, welches Instrument galt, und das
   Tor vergleicht gegen das passende Fenster. *(Die erste Fassung schickte alle Effekte durch die
   RMS-Normalisierung und prüfte sie dann gegen ein RMS-Fenster, obwohl das Messgerät bei den langen
   längst LUFS lieferte. Drei Stems fielen dadurch komplett durch — `board-bloom` mit allen acht
   Takes. Aufgefallen in der Musterung, nicht im Betrieb.)*
4. Stille vorn/hinten trimmen, 5 ms Fades an beiden Enden. **Das Ende wird ein zweites Mal
   getrimmt, NACH der Lautheitsangleichung** — was vorher unter der Schwelle lag, liegt nach einer
   Verstärkung darüber und umgekehrt; gemessen schleppte `music-win` so 214 ms Stille mit, `solve-ok`
   bis zu 335 ms. Das sind Bytes, die niemand hört, und beim Abspielen eine Latenz, die man fühlt.
5. Musik: **Schleifenlänge messen** (nicht aus dem Tempo rechnen — siehe unten), dann schneiden und
   20 ms Equal-Power-Crossfade Tail→Head einbacken. Die Datei IST danach die Schleife.
6. **MP3 mono, 96 kbps, 44,1 kHz.** Kein Opus, kein AAC, keine zweite Fassung.

> **★ Die Schleifenlänge wird gemessen, nicht geglaubt (17.08.2026).** Der Prompt bittet um „about
> 92 BPM"; das ist ein Wunsch, keine Vorgabe. Am ersten echten Stück gemessen lag die beste
> Selbstähnlichkeit bei **14,75 Takten** — der Dienst hatte ein anderes Tempo geliefert. Ein
> Takt-Schnitt hätte hier eine Schleife erzeugt, deren Naht auf Abtastwert-Ebene sauber ist und die
> bei jedem Durchlauf **musikalisch stolpert**: ein Fehler, den die Messung bestätigt und das Ohr
> hört. `master.mjs` sucht deshalb die Länge, bei der sich das Stück selbst am ähnlichsten ist
> (grob auf einer 10-ms-Energiehüllkurve, fein auf den Abtastwerten) — ohne jede Annahme über Tempo
> oder Taktart. Beide Werte stehen im Protokoll, damit sichtbar bleibt, wie weit der Dienst vom
> Wunsch abgewichen ist.

### Die Messfenster (`scripts/check-audio.mjs` erzwingt sie)

| Größe | Musik | SFX | Warum |
|---|---|---|---|
| Lautheit | **−18 LUFS** ± 2 LU | **≥ 1 s: −16 LUFS** ± 2 LU · **< 1 s: −20 dBFS RMS** ± 2 dB | Musik liegt unter den Effekten, damit sie trägt statt zu decken. Zwei Instrumente, weil EBU R128 über 400-ms-Blöcke misst und ein 0,25-Sekunden-Schritt keinen einzigen hat — siehe unten |
| True Peak | ≤ **−1 dBTP** | ≤ **−1 dBTP** | Kopfraum für den MP3-Decoder; sonst zerrt es genau auf billigen Lautsprechern |
| Dauer | Schleifen 15–60 s (gemessen, nicht bestellt) · Stinger ± 50 % | **Obergrenze** aus §2b, Untergrenze 40 ms | siehe unten |
| Nicht-Blatt | RMS > −40 dBFS **und** Peak > −20 dBFS | dito | eine stille Datei ist der Fehler, den niemand hört |
| `flat_factor` | 0 | 0 | ein digital abgeschnittenes Signal |
| Stille-Schwanz | ≤ 80 ms | ≤ 80 ms | Schweigen am Ende ist Latenz, die man fühlt |
| Loop-Naht | **`seamRatio` ≤ 1,5** | — | die Naht darf nicht klicken — gemessen an der Datei selbst, siehe unten |
| **Nicht-Absteigen** | — | **nur `pedagogy: "neutral"`** | siehe unten |

### Die Messung der Regel `:371` — und was sie ehrlich leisten kann

Für jeden `neutral`-Stem wird der **spektrale Schwerpunkt** (die „Helligkeit" des Klangs) in drei
gleich langen Fenstern `c1 · c2 · c3` gemessen. Es muss **beides** gelten:

- **`c3 ≥ 0,9 · c1`** — der Klang darf steigen oder bleiben; er darf am Ende **nicht unter** seinen
  Anfang fallen (10 % Messtoleranz).
- **nicht `c1 > c2 > c3`** — kein durchgehendes Absinken über alle drei Fenster.

Dazu: **Dauer ≤ 0,4 s** und **Lautheit ≤ Mittelwert der `positive`-Familie + 2 LU** (die 2 LU sind
Messtoleranz, nicht Erlaubnis: die Absicht aus §0 ist „der Fehlklang stellt sich nie über das Lob").

> **★ Korrektur, 17.08.2026 (blinder Kanon-Prüfer).** Die erste Fassung dieser Regel — auch so im
> Auftrag formuliert — lautete „letztes Fenster ≤ erstes × 1,1". Diese Ungleichung **deckelt das
> Steigen und erlaubt jedes Fallen**: ein Klang von 2000 Hz auf 500 Hz besteht sie mühelos, und ein
> korrekt aufsteigender fällt durch. Sie prüfte damit fast das Gegenteil der Regel, die sie erzwingen
> sollte — an der wichtigsten Stelle des ganzen Kanons. Die Fassung oben ist herumgedreht, und
> `check-audio.mjs --selftest` beweist es an einem absteigenden Sweep, der rot werden **muss**, und
> einem aufsteigenden, der grün bleiben **muss**.

**Was diese Messung NICHT ist.** Der spektrale Schwerpunkt misst **Klangfarbe, nicht Tonhöhe**. Für
die Klänge dieser Familie — ein gedämpfter Holz-Thud, ein weiches Tinten-Platschen, ein Holzriegel —
gibt es gar keine stabile Tonhöhe, die man verfolgen könnte; was ein Kind als „traurig fallend" hört,
ist dort der Helligkeitsverlauf. Für die wörtliche Regel „no descending **pitch**, no minor cadence"
tragen zwei andere Dinge die Last: die Negativliste in **jedem** Prompt (§2c) und **Kokis Ohr** an der
Hörbank. Die Messung ist der Wächter, der eine ganze Klasse von Fehlern automatisch abfängt — sie ist
nicht der Beweis, dass die Regel eingehalten ist.

### Die Zielzeit eines Effekts ist eine OBERGRENZE, kein Sollwert

„Ein Schritt dauert 0,25 s" heisst: er darf nicht **länger** sein. Gemessen ist ein echter
Filz-Schritt rund **50 ms** Energie und danach nichts — und das ist besser, nicht schlechter.
Die erste Fassung verlangte „Zielzeit ± 30 %" und machte damit ausgerechnet die knackigsten
Aufnahmen rot. Nach unten schützt nur eine grosszügige Schwelle (40 ms) gegen eine Datei, in der
nichts mehr steht; dass wirklich etwas drin ist, prüft ohnehin das Gesetz „kein stilles Blatt".

Das Trimmen des Endes arbeitet deshalb **relativ zur Datei**: geschnitten wird, wo 60 dB unter der
eigenen Spitze nichts mehr kommt. Eine absolute Schwelle misst dort die Lautstärke des Takes statt
sein Ende (bei −50 dBFS schrumpfte ein leiser Schritt auf 49 ms), und eine zu enge relative Schwelle
schneidet musikalische Ausklänge ab (bei −45 dB verlor eine Xylophon-Fanfare ihren Nachhall).

### Die Naht wird an der Datei selbst gemessen

Die erste Fassung verlangte „Naht-RMS-Delta < −40 dBFS" — eine Zahl aus der Luft. Am ersten echten
Stück gemessen lag der Sprung bei **−36 dB** und war trotzdem einwandfrei: nach dem Crossfade grenzen
an der Naht zwei **benachbarte** Abtastwerte des Originals aneinander, und ihr Abstand ist schlicht die
Steilheit, die das Material dort hat. Eine absolute Schwelle misst dann die Helligkeit der Musik, nicht
die Qualität der Naht — helle Stücke wären immer rot, dumpfe immer grün.

Gemessen wird deshalb **`seamRatio`**: der Sprung an der Naht geteilt durch das 99. Perzentil aller
Abtastwert-Sprünge derselben Datei. Ist er kein Ausreißer (**≤ 1,5**), ist die Naht so glatt wie das
Stück selbst. Ein Schnitt ohne Crossfade fällt sofort auf — der Tor-Selbsttest beweist es an genau
diesem Fall. (Gemessen am ersten Stück: `seamRatio` 0,27.)

### Toleranzen — warum das Tor nicht auf exakte Gleichheit prüft

`audio.measured.json` hält je Datei sha1, LUFS, True Peak, Dauer, drei Zentroide, Loop-Naht und Bytes.
Der **sha1 wird exakt** verglichen — er sagt, ob die Datei dieselbe ist. Die **Signalwerte werden mit
Toleranz** verglichen (LUFS ± 0,5 LU · TP ± 0,2 dB · Zentroid ± 5 % · Dauer ± 20 ms), weil CI auf
`ubuntu-latest` ein anderes ffmpeg fährt als der Mac, auf dem gemastert wurde, und `ebur128` in der
letzten Nachkommastelle abweicht. Ein Tor, das daran flackert, wird abgeschaltet und schützt dann gar
nichts. Die Forderung „`--measure` schreibt neu, der Diff ist leer" gilt für den **lokalen**
Wiederholungslauf — gleiche Maschine, gleiches ffmpeg.

---

## §5 · Lizenz — was der Plan erlaubt (Tabelle am 17.08.2026 selbst abgerufen)

Konto: Plan **`creator`**, aktiv (`GET /v1/user/subscription`, 17.08.2026).
Quelle: `https://elevenlabs.io/eleven-music-model-specific-terms` (HTTP 200, 17.08.2026).
Die **Music Commercial Rights table** sagt für `Self-Serve Creator` wörtlich:

| Zeile | Wert für `Creator` |
|---|---|
| Eligibility Restrictions | „For Individual Use Only" |
| Monthly Generation Limit | **62 minutes** |
| Monthly Download Limit | **250 minutes** |
| Streaming Rights | „Yes" |
| Media Rights | „All online and offline commercial use permitted, except film, TV, radio, & **Studio Games**" |

Und die Definition, auf die es ankommt (§5(g) derselben Seite):

> „**Studio Games** means video games which are commercialised (either by sale, advertising or any
> other forms of monetisation) and made available for download or use through more than one platform."

**Lesart für DomiGo.** DomiGo wird nicht verkauft, trägt keine Werbung und wird in keiner Form
monetisiert. Es erfüllt die Definition eines „Studio Game" damit **nicht**, und die Musik fällt unter
die erlaubte Nutzung.

**Zwei Punkte gehen an Fable/Koki, nicht in diese Session:**

1. Die **62-Minuten-Grenze pro Monat** ist die echte Schranke für Musik — nicht das Credit-Guthaben.
   Diese Runde braucht ≈ 17,5 min (7 Stücke × 3 Takes); der Rest ist Reserve für Neu-Würfe.
   `GENERATION_LOG.md` führt Minuten **und** Credits mit.
2. „For Individual Use Only" bei einer Plattform, die ~110 Kinder benutzen, ist eine Frage der
   Berechtigung, nicht der Medienrechte. Sie ist hier **festgehalten, nicht entschieden**.

---

## §6 · Was dieser Kanon NICHT regelt

- **Sprache.** Keine Aussprache, keine Figurenstimmen, kein Erzähler. Die Familie `voice` ist im
  Manifest **reserviert**, damit die spätere Sprach-Runde dieselbe Pipeline, dieselben Ordner und
  dasselbe Tor benutzt (Ordner `…/ch01/voice/`, Kapitel-Präfix in jedem Pfad).
- **Haptik.** Vibration ist eine eigene Entscheidung; `game-feel` hat sie, das Malbuch nicht.
- **Die Verdrahtung.** S1 baut die Fabrik und das Modul. **S2** klemmt es an, setzt `audio: { context }`
  in die Phaser-Konfiguration, baut den Stumm-Knopf und prüft das iPad.
- **Wie es klingt.** Messwerte sind die Vorbedingung, nie der Ersatz. **Kokis Ohr ist das Tor** (R128) —
  die Hörbank stellt je Zeile drei Takes nebeneinander, mit meiner Vorwahl und ihrem Grund.
