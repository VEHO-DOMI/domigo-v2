# arena »Die Tafel-Bühne« — Design-Dossier v2.1 (R5-P1, GEGATED NACH FIX-WELLE)

**Status: GEGATED NACH FIX-WELLE.** Beide Kritiker-Verdikte (Design REWORK ·
Bau REWORK-klein) sind vollständig eingearbeitet — die Fixes sind die Rezepte der
Kritiker; die gebauten Grids werden ohnehin maschinen-/tape-/screenshot-geprüft.
Das Boss-VERHALTEN (F1–F6: Eskalation, Drop-Mechanik, Aufgaben-Vielfalt,
Arena-Anleitung, Score-Dimension) ist das **P4-Paket** und wird hier
ausschließlich als deklarierte »P4-Paket«-Zeilen geführt.
Vertrag: doc 45 §B/§F-LOB · doc 44 §2/§4-ch01 (faustlos: walk/jump/Halte-Sprung/↑ —
kein run als Pflicht [README §Kanon-Klärung], keine Faust, kein Deflect) · README
§Kanon/§Zensus/§Abdeckung · Cookbook §1 (»Boss set-pieces are tuned to ONE screen«),
§8/§9. Vorgänger `../ch01-dossiers/arena.md` = Ideen-Mine; dessen Deflect-Kette
(Zweck-Tabelle #2/#4) ist mit der Faust SUPERSEDED.

**ENGINE-ANKER (Konvention für ALLE Zahlen):**
- Zellen 16 px; Entity (c,r): Zentrum x=c·16+8, Füße y=(r+1)·16.
- Terrain-Notation: **„Boden ab rK"** = Voll-Säule Reihen K…25, Steh-Reihe K−1,
  Fußlinie K·16. **„Platte rK"** = EIN-Reihen-Platte in Reihe K (darunter frei),
  Steh-Reihe K−1, Fußlinie K·16.
- Spieler: **Bodentempo 2,25 px/t (`PAINT.runMax`) — ch01 ist ein Ein-Tempo-Kapitel,
  README §Kanon 2026-08-14; HISTORISCH stand hier »walk 1,25 / run 2,25 px/t«** ·
  Tap-Apex 45–50 / Halte-Apex 101 (P0-Messung) ·
  **Gravitations-UHR: +1 px/t nur jeden 3. Luft-Tick** (fallend sofort zählend) ·
  Körper 12×30, Kopf = Füße−30.
- Fähre: Deck-Fußlinie = PlattformY−6 = **282**; Attach NUR im Fallen (`!grounded`),
  Fenster |Δx|≤20 UND |Füße−282| ≤ max(vy+2, 4).
- Flyer: Sweep ±40 um Zentrum, Bob ±6 px, Patrol-Füße = (r+1)·16; Trigger |Δx|<24 &
  Spieler unter ihm; Sturz 2,2 px/t max 40 t (endet an Spieler-Fußhöhe); Telegraph 30 t (x friert);
  Kontaktbox |Δx|<14.
- Crusher: getriggert (|Δx|<16, Spieler unter ihm) → Telegraph 28 t → Slam 4 px/t bis
  zum ersten Grid-Boden → Ruhe 45 t → Aufstieg 1 px/t; Entities sind NIE solide
  (Kontakt = Karte + Knockback + 120 t iframes — D-17: Rückstoß derzeit No-op).
- Magnet 25,6 px, Sammel-Anker Füße−10.

*Arena-Zusatz zum Anker (nachgelesen, nicht behauptet):* das Arena-Grid hat **20
Reihen** (r0–19) — „Boden ab rK" heißt hier Voll-Säule K…19. Boss-Konstanten aus
`entities.ts` (Block »THE FLYING TAFEL«): home-Füße 192 (r11) · **Flug-Band ±26 px →
Füße 166–218** · KNOT_SPAN ±78/92/104 px · Perioden 300/260/220 t · Telegraph-Boden
30 t (500 ms) · Zentrum trackt das Kind (/48, ≤0,6 px/t; Bestand: WELT-Clamp mit
Rand-Marge 24 px — **wird per stageClamp-Vorleistung §10 auf die Bühne c5–30
gebunden**) · GUARDIAN_SCRIPT E: 3 Knoten. **Zwei Körper-Lesarten (A6, deklariert):**
Physik/Test rechnen 52 px (entities-Kommentar + Test-Hardcode), PaintScene ZEICHNET
GUARDIAN_DISPLAY_H = 68 — der Test-Kommentar „PaintScene.entTargetH for a guardian"
ist gegen die Szene gedriftet = **DEBT-Register-Kandidat** (vorbestehende
Engine-Drift, blockt hier nichts: alle Decken-/Band-Aussagen unten in BEIDEN
Lesarten wahr). Kamera: View 22×14 Zellen (352×224); **y-Schloss bei 96** mit Kind
am Boden (PaintScene:314, von `guardian-flight.test.ts` aus camera.ts
NACHGERECHNET) → sichtbar Reihen 6–19.

## 1 · Auftrag & Raum-Idee

Das Examen (VL 1.11): die Bühne prüft, was die Phasen lehrten — sie lehrt selbst
NICHTS Neues (Tap-Sprung genügt für jede Kante; kein Halte-Sprung).
**Amendment R8, 2026-08-14:** hier stand zusätzlich „kein run als PFLICHT". Der Satz
ist gegenstandslos geworden — ch01 hat nur EIN Bodentempo, und das ist Run (README
§Kanon). Die Absicht dahinter gilt unverändert weiter und steht schon im Satz davor:
**das Examen verlangt keine Fähigkeit über den Tap-Sprung hinaus.** ⚠ Diese Zeile war
zitierte Begründung einer Engine-Konstante (`entities.ts#SKID_SPEED`) — s. §Amendments. Die EINE Raum-Idee: **die symmetrische Prüfungs-Bühne vor leerem
Saal** — Auftritt aus der Seitenbühne WEST (Kulisse), flache Bretter-Bühne mit zwei
Kreide-Kisten-Podesten unter dem Flugband der Tafel, Seitenbühne OST als
**Sieg-Trakt** (Käfig #5 + ✕-Schild hinter dem Vorhang). Das Publikum: leere
Stühle in der Fern-Silhouette — **die Klasse FEHLT, sie steckt in Käfigen**; genau
dieses Loch zahlt der Sieg aus: hinter der Bühne hängt das gefangene
**KLASSENFOTO** (Käfig #5), das erste Bild der fehlenden Klasse — und nach der
Befreiung **antwortet der Saal** (§5: Foto lehnt farbig in der Welt, warmes Licht
überm Stuhl-Band).
**Die gelobte Chalk-Choreografie (doc 45 F-LOB) ist der Fixpunkt dieses Dossiers:**
jede Geometrie-Zahl hier hält die Engine-Vorleistungen der Flugbahnen unverändert
(Podest-Oberkanten bleiben r14, Boden bleibt r16 — Wörtlichkeits-Status präzise in
§10); der stageClamp (§10) schmälert NUR den Zentrums-Korridor, Band/Knoten/
Perioden bleiben identisch.

**EXAMENS-LEDGER (Design-Befund 5 — die Behauptung „prüft, was die Phasen
lehrten" wird zur Tabelle):**

| Gelehrt (Phase) | Arena-Prüfung | Status |
|---|---|---|
| p1 · walk + Tap-Sprung an Kanten | Podest-Aufstieg 32 px (Tap 45–50 ≫ 32) · Ausweichen ist GEHEN (128 t ≫ Telegraph 30 t) | Bühne, dieses Dossier ✓ |
| p2 · Telegraph-Lesen (Schütze board) | Telegraph-Boden 30 t der Tafel lesen und Position wählen | Bühne ✓ · Wurf-Tuning F3 = P4 |
| p2 · Rad/Zahlen-Serie (B10-Heimat) + **p3-Regel-Seite „Zahlen 1–25"** („Thema zahlt in der Arena" — p3 §3) | **ÜBERGABE ANGENOMMEN (vertraglich):** die Boss-Karten-Fenster fahren Zahlen-Aufgaben (order/memory mit 1–25 = Kandidaten) — die Arena nimmt das p3-Versprechen hiermit ausdrücklich an | Umsetzung F5 = **P4-Paket**, Vertrag HIER |
| p3 · Halte-Sprung (Pier 48 px, Loch-Hopser) | **optionaler Halte-Schnörkel** (§3-Podeste): Luft-Fang der F4-Drops per Halte-Sprung vom Podest — opt-in, NIE Pflicht (Fairness des Examens bleibt) | Schnittstelle an P4/F4 |
| p3 · „Wait — then step!" (Timing) | Wurf-Zyklen abwarten, dann queren (Scherben-Fenster) | Eskalations-Feinschliff F3 = P4 |

**P4-Paket (deklariert, NICHT Teil dieses Dossiers):** F1 Knoten-Erklärung ·
F2 Arena-Objective-Inhalt · F3 Eskalationskurve · F4 Drop-Mechanik (Sammeln als
Sieg-Teil) · F5 Aufgaben-Vielfalt (inkl. Zahlen-Übergabe, Ledger oben) · F6/B15
Befreiungs-Score · ✕-Schild-ERSCHEINEN nach Sieg (heute ab Tick 1 sichtbar, Tor nur
simseitig) · Sieg-Licht-Inszenierung = **Saal-Antwort** (warmes Licht überm
Stuhl-Band, §5) · Gate-Toast-COPY des Käfig-Gates (§10) · **Musik-/Licht-Wechsel
beim Auftritt** (v1-Beat „Eintritt, Schloss (Musik-Wechsel)" — wieder geführt, nicht
ersatzlos verloren; Design-Befund 8) · G6-Namens-Erweiterung der Konsole ·
Kontakt-Tuning Boss↔Podest-Steher.

## 2 · Raum-Rhythmus (B1) — 36 Spalten = 1 Raum (1,64 View-Breiten, ehrlich)

```
Seitenbühne W (c0–4)   BÜHNE (c5–30, symmetrisch um c17,5)      Seitenbühne O (c31–35)
S-Tasche, Vorhang      Podest W c5–7 · Freifläche c8–27 ·       Käfig #5 (31,15) ·
AUFTRITT = RUHE        Podest O c28–30; Tafel-Flugband darüber   ✕ (33,15) — SIEG-TRAKT
```
**Ein-Screen-Gesetz, ehrlich benannt:** vertikal EXAKT (Kamera-y-Schloss 96, alles
Spielbare in Reihen 6–19 sichtbar); horizontal ist der Raum 1,64 View-Breiten —
das Ein-Raum-Gefühl tragen (a) das y-Schloss, (b) das Kind-trackende Flug-Zentrum —
**vertikal testbewiesen; horizontal NUR ein Tracking-Argument (0,6 < 1,25 px/t —
das Kind kann das Zentrum abhängen), ungeprüft: Horizontal-Assertion = P1-Vorleistung
§10** —, (c) Null Sub-Ziele außerhalb des Sieg-Trakts.
Dichte: EIN Wesen (Guardian) + EIN Käfig = deklariertes Set-Piece (README-Regler
0,5–0,75/Screen gilt für Phasen; die Arena ist per Cookbook §1 EIN Pattern).
**Anti-Cluster-Prädikat:** ≥6 Spalten ODER deklarierte Raum-Trennung;
Ausnahmen-Liste: {Sieg-Trakt: Käfig (31,15) ↔ ✕ (33,15), Δc2 — EIN Ort hinter dem
Vorhang, Reihenfolge Sieg→Foto→Tor ist die Aussage}.

## 3 · Begründungs-Manifest (B11) — Anker identisch mit §10

| id | Was | Anker | Fiktion | Mechanik | Gesetz | Kunst |
|---|---|---|---|---|---|---|
| (Gelände) | **Decke** | Reihe r0 c0–35 (Bestand) | Proszenium-Sturz | Raumdeckel überm Flugband — nie berührt, **in BEIDEN Körper-Lesarten (A6):** 52-px-Körper → Band-Kopf min. 114; gezeichnet (68) → Ober-Kante min. 98; beide ≫ r0-Unterkante 16 ✓; 98 liegt 2 px unter der y-Schloss-Kante 96 (knapp — windup via guardianKeepIn, Bestand) | VL 1.11 | Vorhang-Kit D-19 |
| (Gelände) | **Seitenbühne WEST** + Spawn | Boden ab r16 c0–4 · **S (3,15)** (Bestand) | Auftritt aus der Kulisse | RUHE-Zone, **statisch UND dynamisch wahr:** statisch nächstes Entity = Tafel c17, Δc14 (E6-Klasse geprüft); dynamisch bindet der **stageClamp (P1-Vorleistung §10)** die Bahn-Westkante an x80 = Bühnenrand — die Kulisse (x<80) wird NIE überflogen, das Kind kann am Auftritt stehen und den Raum lesen. Arena trägt keine Regel-Seite | **Anti 2** (A8: Anti 5 gestrichen — deckt Damage-Chains, nicht Ruhe) · E6-Klasse | Seitenvorhang D-19 |
| (Gelände) | **Podest WEST** | **Boden ab r14 c5–7** (Voll-Säule, Fußlinie 224) | gestapelte Kreide-Kisten am Bühnenrand | Wahl-Insel **mit AUSZAHLUNG (Design-Fix 2 — die hohle Nähe-Begründung der v2.0 ist gestrichen):** (a) **Scherben-Zuflucht** — die Eskalation legt den Boden-Scherben-Teppich, die +32-px-Inseln sind die deklarierte Zuflucht = Bühnen-Schnittstelle an P4/F3 (**Korrektur 2026-08-14:** hier stand „§1 nennt den Boden wörtlich so" — §1 sagt „Scherben-FENSTER", nicht Scherben-Teppich; der Selbstverweis ging ins Leere. Gebaut ist der Teppich inzwischen: s. §Amendments); (b) **Drop-Fang** — F4-Drops fallen durchs Flugband, Höhe = Fang-Vorteil = Schnittstelle an P4/F4; (c) **optionaler Halte-Schnörkel** — Halte-Sprung vom Podest (Apex 101: Füße bis 123, Sammel-Anker bis ~113, quer durchs Band 166–218) fängt Drops in der Luft, opt-in, nie Pflicht. Gegenpreis: Band-Überlapp-Risiko (§6). Tap-Sprung 32<45 ✓. **B2-Fix an der eigenen Vergangenheit: die Bestands-Podeste waren Platten r14 mit 16-px-Spalt darüber dem Boden — Körper 30 px passt nie durch, der Spalt war tote Schein-Passage (exakt die B2/B4-Klasse). Voll-Säulen erden die Kisten.** | VL 1.11 · B2/B4 · Cookbook-Gebot 8 (»a bent path always pays« — jetzt zahlt er) | podium_chalkcrate ✓ · crust_p4_a/b+caps ✓ |
| (Gelände) | **Podest OST** | **Boden ab r14 c28–30** (Spiegel: 35−c von WEST) | dito, Gegenseite | **Symmetrie EXAKT um c17,5** (Bestand c25–27 war um 3 Spalten schief — VL-1.11-Verstoß der v1); Auszahlung dito WEST (Zuflucht/Fang/Schnörkel); zugleich die Stufe in den Sieg-Trakt (Überquerung Tap-Sprung, §6) | VL 1.11 | dito |
| tafel | ★ Guardian **DIE FLIEGENDE TAFEL** | **home (17,11)** (Bestand; Zentrum x 280, 8 px westlich der Raummitte 288 — irrelevant, das Flug-Zentrum trackt ohnehin das Kind) | das verzauberte Herz des Klassenzimmers, wird ERLÖST — **das Examen gehört aufs Podium, die Kulissen sind heilig** | Bühne liefert, was die Choreografie braucht (F-LOB bleibt): flacher Boden r16 als Scherben-Teppich-Fläche, Freifläche c8–27 = 320 px Ausweich-Bahn ≫ max. Pfad-Schatten 208 px, Flugband 166–218 kollisionsfrei (§6). **stageClamp (P1-Vorleistung §10) bindet das Flug-Zentrum an die Bühne c5–30** — Zentrum [184–392] bei Spann 104 statt Welt-Clamp [128–448]; Band ±26, KNOT_SPAN, Perioden IDENTISCH → F-LOB-Choreografie unangetastet. **Alles Verhaltens-artige (Wurf-Raten, Eskalation, Drops, Karten) = P4-Paket** | doc 44 §4-C4 · G4 · B12 (Zustands-Zellen live) | tafel_* ≥25 Zellen ✓ + fx_chalk/chalk_* ✓ |
| p4-objective | **Objective-Beat-PLATZHALTER** | Karten-Ebene; **räumlich verortet (Design-Befund 8): feuert an der Bühnen-Schwelle c5** (Übertritt Kulisse→Bühne) | »Dein Auftrag«-Rahmen vor dem Examen | Slot hier DEKLARIERT, damit der Bau ihn verdrahtet; **Inhalt/Copy = F2 = P4-Paket · Musik-/Licht-Wechsel beim Betreten = P4-Paket** (v1-Beat wieder geführt) | doc 44 §2.6 · G12 | plate_ch01_goal ✓ |
| p4-cage5 | ★ Käfig #5 — **DAS KLASSENFOTO** | **(31,15)** auf dem Boden hinter dem Ost-Vorhang | hinter der Bühne lehnt das gerahmte Foto der Klasse — grau, gefangen; die leeren Stühle im Saal sind SEIN Loch | ↑ öffnet (faustlos-Bestand) NACH dem Sieg; **vor dem Sieg: Käfig-Gate (P1-Vorleistung §10) — ↑ feuert die Toast-Klasse des ✕ (`sim.ts#gateToastCooldown`-Muster; Copy = P4) statt der Öffnung → der Foto-Beat, der zweitgrößte Gefühls-Beat des Kapitels, feuert NIE unter schwebendem Boss.** Kein physisches Tor (ehrlich, kein Fake-Gate). Karte = Picker der B20-Klasse **„It's a picture"** (README-Tor: gleiche Änderungsklasse wie der Stuhl-Picker — steht unter DEMSELBEN Koki-Nick); **Karten-Bild-Lücke deklariert (H3, Design-Befund 7): bis obj_picture (D-18) landet, fährt die B20-Karte text-only** — p3 wählte den Stuhl, WEIL obj_chair existiert; die Arena deklariert die Lücke, statt sie zu verschweigen | Konv. 5 · B8 · B20-Klasse · C6 · Cookbook-Käfig 6 | Hülle satchel ✓ (D-2: open-Zellen fehlen der Klasse) · Foto **D-18** |
| p4-exit | Exit-Glyph **✕** | **(33,15)** (Bestand) | das Schild zur Abschluss-Seite | sim-Tor Bestand bestätigt: vor dem Sieg feuert `sim.ts#gateToastCooldown` den Toast „Die Tafel möchte noch reden!" — **das ERSCHEINEN erst nach Sieg (Vorgänger-Beat #8) ist NICHT gebaut (`PaintScene.ts#prop_exit` rendert ab Load) = P4-Paket-Zeile** | G11-Folge | prop_exit ✓ |
| (Konsole) | **G6-Namens-Konsole — Bestand bestätigt** | Finale-Karte (Karten-Ebene) | die Klasse schreibt der Tafel das erste liebe Wort | **Bestand (belegt):** `fin.t1` typed „hello" (accept hi/hi!/hello!) in `ch01.tasks.v2.json` + `chalkTheGift` (PaintScene:1776) schreibt DAS KIND-WORT auf ihre Tafel + Sonnenblumen-Bloom. **Frankenstein-Rest an P2 übergeben (Design-Befund 6): der `fin.t1`-Stimulus „Die Tafel weint Kreide-Tränen" widerspricht doc 44 §2.2 / entities.ts („she rests rather than cries") — Fix = P2-Skript-Scope, hier aktenkundig.** Nicht gebaut: Namens-Eingabe/-Speicherung (Vorgänger #7 ★); `nameconsole_empty/line.png` existieren, sind aber CODE-UNREFERENZIERT (artManifest 0 Treffer) = **P4-Paket** | G6 · Candy | nameconsole_* ✓ (unverdrahtet) |
| (Streichungen) | keine Buchstaben · keine Regel-Seite · kein Bonus-Buch · keine Stacheln · kein zweiter Gegner | — | die Prüfung hat keine Requisiten-Streu | Trail-Gesetz (B21) zahlt in den Phasen; Regel-Budget 3 = p1–p3 (README §Zensus, bestätigt); Sammel-Drops in der Arena sind F4 = P4-Paket; Stachel-/Zweitwesen-Absenz im Bestand ENUMERIERT (Arena-Entities = 1: tafel) | B1 · B8 · Anti 8 | — |

## 4 · Vokabel-Abdeckung (Kapitel: README §Abdeckung)

**board** = DIE FLIEGENDE TAFEL (Guardian) — Bestands-Zeile der README-Tabelle ✓.
**NEU BEANTRAGT: picture** (wordfile `g1u01.w.picture` — nachgeschlagen) als
Käfig-#5-Insasse DAS KLASSENFOTO. Das ist ein **README-Amendment an ZWEI Stellen
(Design-Befund 8):** (1) §Abdeckung-Tabelle (picture-Zeile — die Tabelle führt
picture bisher nicht) und (2) **§Käfig-Zensus Zeile 5**: Insasse „(Welle
definiert)" → **DAS KLASSENFOTO (picture)**. B8-positiv (ein bisher unbezahltes
Kernwort bekommt einen Welt-Slot), Dedup-sauber (Stem neu; Hülle satchel ist als
Käfig-HÜLLE exempt). Geprüfte Alternativen: *sound system* / *projector*
(Bühnen-Fiktion gut, aber README stellt sie explizit auf NUR-Karten-Ebene) ·
*light* (Scheinwerfer; schwächere Karten-Zeile). **REC: picture** — nur das Foto
zahlt die Leeres-Publikum-Erzählung aus. Architekt/Koki entscheiden im PR.
Trail-Wort: keines (Arena trail-frei, §3-Streichungen). Regel-Seite: keine.

## 5 · Entdeckungs-Inszenierung (B7 — selbsttragend)

Die Arena hat KEINE entfärbten Funde (Prüfungsraum) — B7 zahlt am Käfig #5:
**hinter dem Ost-Vorhang** (D-19) lehnt der Käfig im Licht-Schaft, davor hängt der
Vorhang HALB — die graue Foto-Silhouette (D-18) ist das Versprechen (Cookbook-Käfig
5: geteasert, nie unsichtbar). **Kamera-ehrlich (A7 — gegen camera.ts NEU
gerechnet, schärfer als die zentrierte Kritiker-Schätzung: `cameraTargetX = x −
(176 − Blick·64)`, Look-ahead 4 Zellen):** ostblickend endet der Frame bei
Kind-x+240 → der Käfig (x 496–512) taucht ab Kind ≈ x 256 (≈ Bühnenmitte) auf;
westblickend erst ab x 384; die camX-Klemme 224 greift ab x 336 (ost) / 464
(west) — **der Teaser wirkt auf jedem Ost-Blick ab Bühnenmitte, im West-Blick
nie: blickrichtungs-abhängig, nicht durchgehend.** Der ECHTE Engage-Cue
(cue.ts-Bestand): **Kreide-Pfeil + Halo in ↑-Reichweite, kontinuierlicher Bob —
KEIN Erstsicht-Puls** (der stand hier fabriziert; »Erfasst!«-Klasse, Welle-weit
getilgt — A1). Reihenfolge als Raum-Erzählung, **jetzt mechanisch gehalten**
(Käfig-Gate + stageClamp, §10): Sieg → am Podest OST vorbei in den Trakt → Foto
befreien (die Klasse bekommt Gesichter) → ✕.
**DER SAAL ANTWORTET (Design-Fix 3):** nach der Befreiung lehnt das Foto **FARBIG
in der Welt** (D-18-Welt-Zelle „geöffnet") und **warmes Licht fällt aufs
Stuhl-Band** (D-19-/P4-Schnittstelle: Sieg-Licht-Inszenierung, §1-P4-Liste) — die
leeren Stühle bleiben nicht die einzige Behauptung, die der Raum nie einlöst;
`fin.t1`s „die Klasse schreibt ihr das erste Wort" bekommt seinen Welt-Anker.
Silhouetten-Klasse weiterhin adressiert: der geöffnete Käfig trägt die
Gefangenen-Silhouette NICHT weiter — sie liegt auf einem eigenen Blatt, das
`cageOpens` mit der Öffnung fallen lässt (D-18-Spez; Klassen-Schuld D-2).

## 6 · Bewegungs-Geometrie (aus den Ankern; Gravitations-Uhr berücksichtigt)

> **★ HISTORISCH-MARKE (R8, Architekt 2026-08-14).** Jede Rechnung in diesem
> Abschnitt, die „bei walk" rechnet oder 1,25 px/t einsetzt, beschreibt ein Tempo,
> das ch01 nie benutzt hat (README §Kanon: Bodentempo = 2,25 px/t, `PAINT.runMax`).
> Die Rechnungen bleiben stehen, weil sie zeigen, unter welcher Annahme der Raum
> geschnitten wurde — sie tragen aber **keine neue Geometrie** mehr. Was daraus
> folgt, ist zweierlei und nicht dasselbe:
>
> * **Weiten-Nachweise („Flugweite ≥ nötig") halten erst recht.** Mehr Tempo heißt
>   mehr horizontale Flugweite; jede Marge wird größer, keine kleiner.
> * **Lande-Genauigkeit ist eine NEUE Frage.** Wo eine kleine Plattform getroffen
>   werden muss, kann mehr Tempo über das Ziel hinaustragen. Kein Nachweis in
>   diesem Abschnitt deckt das ab — als Schuld gefiled, nicht hier entschieden.

- **Podest-Aufstieg:** Boden-Füße 256 → Podest-Füße 224 = 32 px; Tap-Apex 45–50 ≫ 32 ✓
  — **kein Halte-Sprung nötig, die Prüfung verlangt nichts Ungelehrtes** (Kopffreiheit:
  Podest-Kopf 194, Decke endet 16 — frei). Der Halte-Sprung existiert nur als
  opt-in-Schnörkel (§3-Podeste/Ledger §1), nie als Pflicht.
- **Podest-Abtritt:** 32-px-Fall mit Mod-3-Uhr: kumulativ 1·2·3·5·7·9·12·15·18·22·26·
  30·35 → Landung Tick 13, vy 5 — sanft, kein Risiko.
- **Flugband vs. Köpfe (Engine-nachgerechnet):** Tafel-Füße 166–218. Boden-Steher
  Kopf 226 → **8 px frei, der Boden ist die sichere Lese-Linie** ✓ (deckungsgleich
  mit der `FLIGHT_BAND_PX`-Herleitung). Podest-Steher Kopf 194 → Band-Überlapp
  194–218 = 24 px: **das Podest ist die Zuflucht-/Fang-Wahl (§3-Auszahlung) mit
  Berührungs-Risiko** (Kontakt = Karte + iframes, nie Sturz/Tod — deklarierte
  Lektion, keine Falle; Feinabstimmung = P4-Paket).
- **Ausweich-Bahn:** Freifläche c8–27 = 320 px ≫ max. KNOT_SPAN-Schatten 208 px —
  es gibt zu jedem Zeitpunkt Boden außerhalb der Pfad-Projektion; walk 1,25 px/t
  quert die halbe Bahn (160 px) in 128 t ≫ Telegraph-Boden 30 t: Ausweichen ist
  Gehen, nie Sprinten (kein run als Pflicht ✓). Gilt unverändert unter stageClamp
  (Zentrum [184–392] liegt im Welt-Korridor [128–448] — nur enger).
- **Sieg-Trakt:** Podest OST überqueren (Tap-Sprung 32, 3 Zellen, Abtritt 32) →
  Käfig (31,15) → ✕ (33,15). **„Nichts Feindliches östlich der Bühne" ist erst mit
  der stageClamp-Vorleistung (§10) mechanisch wahr** (Bahn-Ostkante ≤ x496; Käfig
  ab x496): bis sie gebaut ist, gilt ehrlich — **der Trakt liegt vor dem Sieg im
  Wurf-Schatten (A4)**; den Gefühls-Beat hält unabhängig davon das Käfig-Gate
  (§10). Erstsicht des Trakts nach Sieg gefahrlos — Anti 2 ✓.
- **Kamera:** y-Schloss 96 hält Podeste (Fuß 224), Boden (256), Flugband (114–218)
  und Sieg-Trakt gleichzeitig im Bild — **vertikal testbewiesen**
  (`guardian-flight.test.ts`: head ≥ seenTop, feet ≤ seenBottom, aus camera.ts
  nachgerechnet). **Horizontal ist die Tafel-Sichtbarkeit NUR ein
  Tracking-Argument (Zentrum-Kappe 0,6 < walk 1,25 px/t — das Kind kann das
  Zentrum abhängen), ungeprüft (A3); Horizontal-Assertion + stageClamp = 
  P1-Vorleistung §10, löst es final.**

## 7 · Bild-Behandlung

Streng SYMMETRISCHES Proszenium (VL 1.11): Vorhang-Kit D-19 an beiden Flanken,
Bühnen-Bretter-Boden (crust_p4-Familie ✓), Kreide-Kisten-Podeste (podium_chalkcrate ✓).
**Leeres Publikum:** `band_p4_audience` (Stem ✓; vom Bau-Kritiker GESICHTET: trägt
leere Stühle ✓) als mid-Plate; far-Plate ist heute `plate_p2_nightwall`
(p2-Wiederverwendung, deklariert — eigener p4-Prospekt = D-19-Kandidat, blockiert
nichts, H3). **Sieg-Zustand (§5):** warmes Licht überm Stuhl-Band + farbig
lehnendes Foto = D-18/D-19-Schnittstelle, Inszenierung P4. Squint-Pflicht (B14):
Foto-Silhouette muss auf Spielgröße als BILD lesen (D-18-Spez: Rahmen-Kontur +
helle Passepartout-Fläche). Naive-Look (G2) = offenes Koki-Tor, hier nur
vorgemerkt. Kreidestaub-fx ✓ Bestand.

## 8 · Kunst-Bedarf (→ Codex aq; Register-VORSCHLÄGE — Architekt vergibt final)

- **D-18 (VORSCHLAG): Klassenfoto-Set** — obj_picture drained/farbig (Karten-Bild +
  Welt-Zelle) + **Welt-Zelle „Foto lehnt farbig" (Sieg-Zustand, §5)** +
  Käfig-Grau-Silhouette als EIGENES Blatt (fällt mit der Öffnung; Klassen-Schuld
  D-2). Platzhalter bis dahin: satchel-Hülle + Licht-Schaft ohne Silhouette;
  **B20-Karte text-only (H3, §3-Zeile p4-cage5)**.
- **D-19 (VORSCHLAG): Proszenium-Kit** — Seitenvorhang West/Ost (Auftritt/Sieg-Trakt,
  §5) + Warm-Licht-Overlay überm Stuhl-Band (Sieg-Zustand) + optional eigener
  p4-far-Prospekt (statt plate_p2_nightwall). Platzhalter: Bestand ohne Vorhänge —
  Layout funktioniert, nur die Rahmung fehlt (H3).
- Zitiert, nicht neu: **D-2** (Käfig-open-Zellen der satchel-Klasse) ·
  Sieg-Licht-INSZENIERUNG (Timing/Musik) = P4-Paket (dort ggf. eigene D-Nummer) ·
  **DEBT-Kandidat A6:** Test-Kommentar-Drift Guardian-Körper 52 (Test) vs. 68
  (PaintScene GUARDIAN_DISPLAY_H) → DEBT_REGISTER.

## 9 · Task-Beats (G12)

| Beat | Pool | Art | Status |
|---|---|---|---|
| Arena-Objective | objective | PLATZHALTER (feuert an Schwelle c5, §3) | Slot deklariert — Inhalt F2 = **P4-Paket** |
| Boss-Fenster ×N | boss | **Bestand: mistake ×2 · order ×2 · oddone ×1 · memory ×1 — KEIN choice** (A2-Korrektur; v2.0 behauptete choice/oddone-Rotation) | Vielfalt F5 = **P4-Paket** (Zahlen-Übergabe: Ledger §1) |
| Käfig KLASSENFOTO | rescue | choice, B20-Klasse („It's a picture", Bild obj_picture D-18 — bis dahin text-only, H3) | dieses Dossier; Koki-Tor = B20-Nick |
| Finale-Konsole | finale | typed („hello", fin.t1) | **Bestand ✓** (chalkTheGift verdrahtet; Kreide-Tränen-Stimulus = P2-Übergabe, §3) |
| Namens-Runde | finale+ | typed (Name) | **P4-Paket** (G6-Erweiterung, nameconsole_* liegen bereit) |

**G12-Klärungs-Zeile (A2-Beifang, deklariert):** `mistake` ist eine echte
Karten-Maschine (`cards/machines.test.ts#mistakeMachine`), fehlt aber in der README-G12-Artenliste
für ch01 (choice·wheel·spell·order·oddone·memory·typed) — README-Liste und
Task-Bestand widersprechen sich. **README-Klärung als Amendment beantragt:**
Artenliste um `mistake` ergänzen ODER den Boss-Pool begründet umbauen — Entscheid
im PR (F5 = P4 bleibt davon unberührt).

## 10 · Grid-Schnitt-Vorgaben (Bau-Vertrag — Endwerte, Notation §Anker; Grid 36×20)

**Decke:** Reihe r0 c0–35 (Bestand, unverändert).
**Boden-Profil (lückenlos c0–35):** Boden ab r16 c0–4 · **Boden ab r14 c5–7** ·
Boden ab r16 c8–27 · **Boden ab r14 c28–30** · Boden ab r16 c31–35.
**Platten: KEINE.** (Die Bestands-Platten r14 c5–7 + c25–27 werden zu Voll-Säulen;
der Ost-Block wandert nach c28–30 — Spiegel-Symmetrie. Notiert: Platte→Voll-Säule
ist die B2-Entscheidung dieses Dossiers, §3.)
**Entities/Glyphen:** S (3,15) · Tafel guardian skin tafel **(17,11)**, tier E,
knots 3 (alles Bestand) · **Käfig p4-cage5, role cage, skin satchel, (31,15)** ·
✕ (33,15) (Bestand). Plates far `plate_p2_nightwall` / mid `band_p4_audience`
(Bestand, §7-Deklaration), exit → done (Bestand).
**Engine-Vorleistungen, die dieser Schnitt NICHT verletzen darf (nachgeprüft,
Wörtlichkeit A5-präzise):** Podest-OBERKANTEN bleiben r14 — „row-14 podium tops
(224)" steht WÖRTLICH in der `FLIGHT_BAND_PX`-Herleitung (entities.ts); der Boden
bleibt r16 — dort nur IMPLIZIT („child on the arena floor", Kopf 226). Die
floorRow-Erkennung des Flug-Tests ist KEIN Voll-Reihen-Check, sondern
`startsWith("####################")` (20 führende #) — ihr Ergebnis bleibt unter
dem neuen Profil r16 (die Podest-Reihen r14/r15 beginnen `.....###`, matchen nie) ✓.

**P1-ENGINE-VORLEISTUNGEN (deklariert — werden im Grid-Schnitt gebaut):**
1. **stageClamp (Level-Param):** Flug-Zentrum-Clamp auf die Bühne c5–30 statt auf
   die Welt — Zentrum ∈ [80+Spann, 496−Spann]: Spann 78 → [158, 418] · 92 →
   [172, 404] · 104 → [184, 392] (Welt-Clamp-Bestand zum Vergleich: [102, 474] /
   [116, 460] / [128, 448]; die Welt-Marge 24 bleibt als äußerer Boden bestehen,
   mathematisch inaktiv). Wirkung: Bahn-Westkante ≥ x80 → **AUFTRITT-RUHE
   mechanisch wahr**; Bahn-Ostkante ≤ x496 → **Sieg-Trakt (Käfig x 496–512, ✕)
   nie überflogen**. F-LOB unangetastet: Band ±26, KNOT_SPAN, Perioden identisch —
   nur der Zentrums-Korridor wird schmaler.
2. **Käfig-Gate vor Sieg (sim-Zeile):** ↑ am Käfig #5 vor dem Guardian-Sieg feuert
   die Toast-Klasse des ✕ (`sim.ts#gateToastCooldown`-Muster; Copy = P4-Paket) statt der
   Öffnung — der Foto-Beat feuert nie mitten im Kampf. Kein physisches Tor.
3. **Horizontal-Assertion** in `guardian-flight.test.ts`: Tafel-x bleibt unter
   stageClamp im Kamera-Frame (schließt A3 final; vertikal ist bereits bewiesen).

**Folgen des Schnitts (deklariert):** Arena-Proof-Tape NEU aufnehmen (Ost-Podest
versetzt; `ch01.proof.json`) · grids-v2-Spiegel = D-8-Regime des P1-Pakets ·
README-Amendments (§4: picture-Zeile + Zensus Zeile 5 · §9: G12-mistake-Klärung)
im PR sichtbar.

## §Amendments (K1, 2026-08-14) — was die Bühne inzwischen wirklich tut

### A1 · DER SCHERBEN-TEPPICH IST GEBAUT (R27)

Das Dossier hat den Teppich als Absicht geführt („F3s Eskalation legt den
Boden-Scherben-Teppich"). H1 Teil 3 hat ihn gebaut, und zwar so:

* Jede gelandete Kreide hinterlässt ihre Scherbe auf den Brettern — das gab es schon.
* **Neu: ab dem dritten Knoten rutscht die liegende Scherbe** (`entities.ts#SKID_FROM_KNOT`,
  0-basiert `= 2`) in der Richtung weiter, in die ihr Stück ohnehin flog
  (`entities.ts#SKID_SPEED`). Der Boden wird damit über den Kampf hinweg voller, statt
  nur bestreut zu sein — die +32-px-Podest-Inseln sind die Zuflucht, als die das Dossier
  sie deklariert hat. Die Zuflucht ist also eingelöst, nicht mehr versprochen.
* Die liegende Scherbe ist eine GEFAHR mit langsamem Puls, kein Deko-Fleck
  (`PaintScene.ts#a lying shard is smaller than the stick it came off`).

### A2 · ⚠ EIN BEFUND, DEN K1 NICHT SELBST HEILEN DARF: die Rutsch-Geschwindigkeit

`SKID_SPEED` ist ausdrücklich **„als Mitte der beiden Gangarten des Kindes"** abgeleitet —
„schneller als Gehen, damit Weggehen aufhört, die ganze Antwort zu sein — langsamer als
Laufen, weil das Examen nie eine Fähigkeit VERLANGT, die es als Kür gelehrt hat
(arena.md §1: kein run als Pflicht)". Die Formel lautet
`(PAINT.walkMax + PAINT.runMax) / 2 / 2` = 224 Subs = **0,875 px/t**.

Beide Hälften dieser Begründung hängen am Zwei-Tempo-Bild:

1. Die zitierte §1-Zeile („kein run als Pflicht") gibt es seit dem Ein-Tempo-Kanon
   nicht mehr — sie ist oben als historisch markiert.
2. Schwerer: Das Kind läuft 2,25 px/t, die Scherbe rutscht 0,875 px/t. **Sie ist damit
   deutlich langsamer als die einzige Gangart, die das Kapitel hat — „Weggehen" IST
   wieder die ganze Antwort**, also genau das, was der Takt verhindern sollte.

Das ist ein GEFÜHLS-Entscheid (wie schnell darf eine Scherbe ein Kind jagen?) und
gehört dem Architekten und Koki, nicht einem Register. **Als Schuld gefiled, hier nicht
geändert.** Wer ihn anfasst, ändert eine Zahl im Kampf und braucht die Feel-Runde dazu.

### A3 · Verweise stehen jetzt auf Symbolen, nicht auf Zeilennummern

Alle Verweise dieses Dossiers, die auf eine ZEILENNUMMER zeigten, waren verrutscht:
sim.ts Zeile 840 traf nicht mehr den ✕-Toast, PaintScene Zeile 4081 nicht mehr das
Erscheinen des Schilds. Die Zeilen gab es alle noch — nur zeigte keine mehr auf das
Gemeinte, und genau das sieht eine Bereichsprüfung nie.
Sie sind auf die Form `` `datei#symbol` `` umgestellt und werden von
`scripts/check-registers.mjs` maschinell geprüft. **Neue Verweise bitte nur in dieser
Form** — eine Zeilennummer altert still, ein Symbolname nicht.
