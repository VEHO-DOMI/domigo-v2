# ch01 Design-Dossiers v2 — Kapitel-Bilanz (R5-P1, 2026-08-10)

Neuableitung nach doc 45 §B auf der faustlosen doc-44-§4-Basis. Vorgänger:
`../ch01-dossiers/` (PB-W3, Koki-gegated — G-Amendments gelten fort, Faust-Inhalte
superseded). Pro Phase ein Dossier durch die Kritiker-Schleife VOR dem Grid-Schnitt.
Standard-Zahlen für alle Dossiers: Viewport 22 Spalten · **Bodentempo 2,25 px/t
(`PAINT.runMax`) — ch01 ist ein Ein-Tempo-Kapitel, siehe §Kanon** · Tap-Apex 50 /
Halte-Apex 101 px · JUMP_UP 4 · Magnet 25,6 px.
_(HISTORISCH: bis 2026-08-14 stand hier „walk 1,25 / run 2,25 px/t". Die 1,25 sind
`PAINT.walkMax` — ein Wert, den ch01 nie als Ziel benutzt.)_

## §Kanon — Supersessions & Tore (aktenkundig)

- **★★ EIN-TEMPO-KANON (R8, Architekt 2026-08-14; in K1 an der Quelle nachgemessen):
  ch01 ist ein Ein-Tempo-Kapitel, und das Tempo ist RUN — 2,25 px/t.**
  Belegkette, Glied für Glied: `ch01.level.json` führt `abilities: ["jump","run"]` ·
  in keiner Phase, in der Arena und im Bonusraum steht ein `powerup`-Wesen, also ist
  die Grant-Subtraktion (`level.ts` `abilitiesEnteringPhase`, `PaintGame.tsx` `grantSet`)
  leer und beide Fähigkeiten liegen ab dem Aufsetzen in der Hand · `sim.ts` reicht
  `canRun: abilities.includes("run")` durch · `player.ts` wählt daraufhin
  `PAINT.runMax` (576 Subs = 2,25 px/t) statt `PAINT.walkMax` (320 Subs = 1,25 px/t).
  Es gibt keine Geh-Taste: **jede Richtungseingabe zielt auf 2,25 px/t.** Die
  „walk"-POSE ist trotzdem kurz zu sehen — sie zeichnet, solange das Tempo unter
  `PAINT.runEngage` (448 Subs = 1,75 px/t) liegt, aus dem Stand also rund 14 Ticks
  (≈0,23 s bei `PAINT.groundAccel` 32). Pose ≠ Tempo.
  **Woher der Irrtum kam — und warum er kein Flüchtigkeitsfehler war:** p9 §Anker
  begründete „run existiert in ch01 nicht" mit einem KOMMENTAR im Spielcode
  (`player.ts`: „the sprint verb (ch13 unlock)"). Der Kommentar ist veraltet; die
  ausgelieferten Level-Daten widerlegen ihn. Ein Kommentar ist keine Auslieferung.
  **Folge für alle Dossiers:** jede Rechnung, die 1,25 px/t einsetzt, ist HISTORISCH
  markiert und darf keine neue Geometrie mehr tragen. Sie sind nicht gelöscht — sie
  zeigen, unter welcher Annahme der Raum geschnitten wurde.
- **G9 (2026-07-23):** Rad = Tap-Lock statt auto-lock — **gilt unverändert**.
  Die ZAHLEN-SPANNE derselben Zeile (»1–20«) ist dagegen **von Koki am 2026-08-13
  auf 1–25 korrigiert** (R5-W2 I1). Grund, dreifach belegt: das ausgelieferte Rad
  (`qf.moths.w1/w2/p1w1`) bietet seit jeher **25 Werte** (one … twenty-five),
  Unit 1s eigene Ziel-Liste sagt wörtlich »the numbers 1–25«, und das
  Korpus-Lexikon führt alle 25. Die 1–20 der alten Zeile beschrieb einen Zustand,
  den der Bestand nie hatte. Nicht still gelöscht, sondern hier datiert überholt.
- **G12-Artenliste gilt** (choice·wheel·spell·order·oddone·memory·typed für ch01). **KLÄRUNG (Kritiker-Fund): der shipped Boss-Pool nutzt zusätzlich `mistake` (×2)** — entweder Liste um mistake ergänzen (Empfehlung; die Maschine existiert und ist getestet) oder Pool in P4 umbauen. PR-Nick.
  **★ D-24 ENTSCHIEDEN (R11, Architekt 2026-08-14): `spell` debütiert in ch02 — die
  ch01-Palette bleibt, wie sie ist.** Damit ist der Streit um die p2-Rettungskarte
  TABLET beigelegt: sie fährt als `choice` („It's a tablet"), wie sie live steht und
  wie sie korpus-verifiziert ist. `spell` bleibt in der obigen Artenliste stehen,
  weil die Liste die MASCHINE beschreibt (die Art existiert und ist getestet) —
  ch01 vergibt sie nur an keine Karte. Was NICHT geändert wird: die Palette wird
  nicht erweitert, und die Dossier-Zeile behauptet keinen `spell`-Wunsch mehr.
- **★ KOKI-TOR (gemeinsam mit dem restoreRoom-Override) · B20-Delta:** doc 44
  formuliert den Kontraktions-Picker über ein restauriertes Objekt; v2 nutzt ihn als
  Befreiungs-Karte des gekäfigten Stuhls (obj_chair-Bild) — gleiche Änderungsklasse
  wie der Override, also gleiches Tor: gilt als Empfehlung bis zum PR-Nick.
- **B21-Versöhnung:** das Trail-Wort-Gesetz (3 Läufe je Phase entlang der
  Absichts-Linie, Wortlänge deckelt die Zahl) ist ch01s deklarierte Antwort auf
  „generously scattered" — ★ KOKI-SICHTBAR im PR.
- **★ KOKI-TOR · restoreRoom-Override:** die Keen-Sechs {desk, school bag, door,
  board, window, chair} werden ersetzt durch die Entfärbte-Dinge-Sechs
  {school bag, book, desk, scissors→D-13, glue stick, sharpener}; door/window/board
  leben als Architektur/Guardian, chair als Käfig-Insasse. Grund: B8-Vollabdeckung.
  Gilt als Empfehlung, bis Koki im PR nickt oder vetot.

- **★ ANTI 3/6 v2 — Checkpoints stehen NACH der Schwierigkeit (Koki, 2026-08-11,
  Replay-Entscheid; Anzahl-Tor am selben Tag beantwortet: EINER NACH JEDEM
  schweren Stück).** Das überschreibt das Kochbuch wörtlich: `level-cookbook-v2.md`
  §2 („≤1 pro Phase, VOR der Spitze"), §8 Gebot 6 („sit BEFORE risk spikes") und
  §9 Anti-Gesetz 3 sind im selben PR nachgezogen; alle drei Dossier-Zitate stehen
  jetzt auf „Anti 3/6 v2". Maschinell gehalten statt nur geschrieben:
  `checkpoint-count` · `checkpoint-placement` · `checkpoint-footing` ·
  `checkpoint-walk` in `level.ts`, abgeleitet über TINTEN-PASSAGEN (nur Tinte
  warpt — `sim.ts` ist glyph-genau auf `w`; Stacheln und Gegner versetzen
  niemanden, eine Regel über „Lücken" oder „Gegner-Bänder" würde also Dinge
  polizieren, die ein Checkpoint gar nicht bezahlen kann). Versetzt:
  p1 (38,17)→**(47,17)** · p2 (20,10)→**(58,14)** · p3 (26,21)→**(40,20)**;
  p4/p9 kreuzen keine Tinte und tragen darum weiterhin keinen.

## §Tor-Antworten 2026-08-11 (Koki, nach Merge #252 — RATIFIZIERT)

1. **Käfig-Insassen RATIFIZIERT:** p1 = SOUND SYSTEM · p2 = TABLET · Arena =
   KLASSENFOTO (Stuhl war Dossier-fix). Die „Empfehlung bis PR-Nick"-Vorbehalte in
   den Dossiers sind damit AUFGEHOBEN.
2. **D-5 = OPTION A:** Buchstaben respawnen im Bonusraum beim Zweitbesuch
   (Register-Zeile D-5; Guard = Session B1).
3. **restoreRoom-Override + B20-Delta:** bestätigt wie vorgemerkt — kein Einspruch.
4. **Run-Kanon-Klärung RATIFIZIERT:** „3 Schwarm-Karten garantiert" gilt für
   GEH-Tempo; ein rennendes Kind fängt S3, Minimum 2 — die ehrliche Zeile bleibt,
   Run wird NICHT gedrosselt.
   **★ ÜBERHOLT am 2026-08-14 durch den Ein-Tempo-Kanon (§Kanon oben).** Der Satz
   ist nicht falsch, aber seine Voraussetzung existiert nicht: ch01 hat kein
   Geh-Tempo, das man wählen könnte. Damit fällt die Fallunterscheidung weg und die
   ehrliche Untergrenze des Spießrutenlaufs ist **2 Karten**, nicht 3 — die zweite
   Hälfte der alten Zeile („ein rennendes Kind fängt S3, Minimum 2") ist der
   Normalfall geworden. Was daraus folgt, ist eine DESIGN-Frage (B10 will 3–4
   Rad-Aufgaben in Folge) und gehört nicht in ein Register: als Schuld gefiled,
   Entscheid beim Architekten. **Der Beschluss „Run wird NICHT gedrosselt" gilt
   unverändert weiter.**

## §Käfig-Zensus v2 (doc 44 §2.3: „restage per dossier" — hier der Restage)

| # | Phase | Hülle | Insasse | Status |
|---|---|---|---|---|
| 1 | p1 | satchel | (Welle definiert — Wesen aus §Abdeckung) | Welle |
| 2 | p2 | satchel | (Welle definiert) | Welle |
| 3 | p2 | pencilcase (PERSON) | MERLE | Bestand ✓ |
| 4 | p3 | satchel | DER STUHL (B20) | v2.2 ✓ |
| 5 | arena | satchel | DAS KLASSENFOTO (picture, B20-Karte; obj_picture → D-21) | v2.1 ✓ |
Summe v2 = 5 (statt doc-44-„7") — Dichte-Entscheid der Neuableitung, im PR sichtbar.

**★★ KÄFIG-GRÖSSE — D-48 ENTSCHIEDEN (Architekt 2026-08-14, hier als Kanon):
jeder Käfig rendert 34 px.** Bisher entschied `PaintScene.entTargetH` nach Hülle und
Inhalt: `holdsAPerson(e) ? 34 : e.skin === "pencilcase" ? 24 : 22`. Bei 22 px waren
die vier AQ6-Insassen-Zellen (Musikanlage · Tablet · Stuhl · Bild) nicht
voneinander unterscheidbar — unabhängig von einem blinden Prüfer bestätigt und im
eigenen 22-px-Render nachgestellt. 34 px ist die Größe, die ein Käfig mit Kind
schon heute nutzt; ab dort trennen sich Lautsprecher-Kegel und Tablet.
**Verdrahtet wird das in Session A5, nicht hier** — K1 schreibt nur den Kanon.

⚠ **Was A5 dabei nicht still brechen darf (in K1 gefunden):** die Wackel-Herleitung
begründet ihren Ausschlag ausdrücklich mit dem GRÖSSENUNTERSCHIED — „ein Käfig mit
einem Kind darin ist 34 px hoch, ein Ranzen 22 — bei festem Winkel wackelt der
große automatisch 1,5-mal weiter" (`anim.ts`, wortgleich in `breath.test.ts`).
Rendern alle Käfige 34 px, ist dieser Faktor 1,0 und die Begründung leer. Der Test
läuft weiter grün (er misst Pixel proportional zur Höhe), aber der KOMMENTAR wäre
dann eine Behauptung ohne Fall. A5 leitet ihn neu her oder benennt ihn als
historisch — beides ist in Ordnung, stilles Stehenlassen nicht.

## §Abdeckung — die Vokabel-Vergabe des Kapitels (B8; Maschinen-Check = P1-PAKET, Task 15 — bis dahin Hand-geprüft)

**Dedup-Prädikat (maschinenscharf, Geltungsbereich KAPITEL):** kein ASSET-STEM
erscheint zweimal in der Menge {Entities mit Rolle chaser|gunner|flyer|bouncer|
crusher|guardian} ∪ {drained-Objekte}; exempt: swarm, Käfig-HÜLLEN, Plattformen,
classmate; benannte Exemptions-Liste: LEER. (Vokabel-Mehrfachrollen sind erlaubt
und werden in DIESER Tabelle sichtbar geführt — B8s »verschenkte Slots« prüft die
Tabelle auf Vokabel-Ebene: jede Zeile muss einen eigenen Wordfile-Eintrag zahlen.) **Anti-Cluster-Prädikat:**
Abstand ≥6 Spalten ODER verschiedene Screens ODER im Dossier deklarierte
Raum-Trennung. Vergabe v2:

| Vokabel (wordfile) | Erscheint als | Phase | Kunst |
|---|---|---|---|
| pencil | Läufer (chaser) | p1 | ✓ |
| rubber | Hüpfer (bouncer) | p1 | ✓ |
| school bag | Entfärbtes Ding | p1 | ✓ obj_schoolbag |
| book | Entfärbtes Ding | p1 | ✓ obj_book |
| pen | Läufer (chaser) | p2 | ✓ |
| board („Wasserfarben" = paint box, unit-nah) | Schütze (gunner) | p2 | ✓ paintbox |
| desk | Entfärbtes Ding | p2 | ✓ obj_desk |
| pencil (Objekt) | — GESTRICHEN (Duplikat zu p1-Läufer) → Ersatz: **scissors** | p2 | **Codex D-13** (bis dahin obj_pencil, DEBT) |
| pencil case | Merles Person-Käfig | p2 | ✓ |
| (Zahlen 1–25) | Motten-SCHWARM-Spießrutenlauf, 3 Schwärme = 3–4 Rad-Aufgaben in Folge (B10-HEIMAT) | p2 Lampen-Korridor | ✓ moths |
| ruler | Fähre (Plattform) | p3 | ✓ |
| exercise book | Flatterer (flyer) | p3 | ✓ heft |
| glue stick · sharpener | Entfärbte Dinge | p3 | ✓ |
| **chair** | **Käfig-#4-Insasse (Karte B20 „It's a chair")** | p3 | Wesen-Kunst **D-13** |
| school bag (2./3. Rolle) | Schaukel + Stampfer | p3 | ✓ (Farb-Trennung D-14) |
| board | DIE FLIEGENDE TAFEL (Guardian) | p4 | ✓ |
| door / window | Welt-Architektur (Türen-Serie G11 / p2-Fenster-Ein-und-Ausstieg) | überall | ✓ |
| **picture** (wordbank g1u01.w.picture) | Käfig-#5-Insasse (Arena, B20-Karte) | p4 | obj_picture **D-21** |
| **sound system** | Käfig-#1-Insasse (Empfehlung, B20-Klasse — PR-Nick) | p1 | Wesen **D-18** |
| **tablet** | Käfig-#2-Insasse (Empfehlung — PR-Nick) | p2 | Wesen **D-19** |
| projector | Fiktions-Träger (projiziert die Schwarm-Zahlen; Trail-Wort PROJECTOR) | p2 | Turm-Kunst **D-19** |
| (Kleidungs-Neun) | NUR Karten-Ebene (u08-Kapitel) | tasks | — |

**restoreRoom-OVERRIDE (doc 44 §4 C1, hiermit ausgesprochen):** Die Keen-Sechs
(desk, school bag, door, board, window, chair) werden NICHT 1:1 restauriert. ch01-v2
restauriert {school bag, book, desk, scissors→D-13, glue stick, sharpener} als
Entfärbte-Dinge-Sechs (alle wordfile, alle mit Kunst[-Pfad]); door/window/board leben
als Architektur bzw. Guardian, chair als Käfig-Insasse. Grund: Vokabel-Vollabdeckung
(B8) schlägt Keen-Bestandsliste (doc 44 §2.5 fresh-eyes).

## §B-Karte — wo jedes B-Gesetz landet

B1 Rhythmus → jedes Dossier §2 · B2 Kanten-Kit → Codex D-16/p3 §8 · B3 → p3 (Terrassen
statt Schacht) · B4 → p3-Streichung (+ p2-Nibs bleiben boden-lesbar) · B5 Zufalls-Tür →
**p2-Dossier-Pflicht** (die 16:34-Tür bekommt Ort-Logik oder fällt) · B6 Tisch →
**p2-Dossier-Pflicht** (der Tisch wird Möbel-Gelände mit Zweck oder fällt) · B7 →
Dossiers §5 · B8 → diese Tabelle + Maschinen-Check · B9 → D-14 · B10 → **p2
Lampen-Korridor** (Pflicht-Schwarm ×3, Rad-Serie) · B11 → Manifeste §3 · B12 →
Zustands-Zellen D-16 + feste Beat-Profile §9 · B13 Wiederholungs-Variation →
tasks-v2-Paket (P2: Zahlen variieren je Respawn) · B14 Squint → Dossiers §7 + Art-QA ·
B15 levelweite Befreiungs-Bilanz → Score-Page zählt bereits x/6 kapitelweit; P4 erweitert
um die Arena-Dimension (F6).

## Screen-Lineal-Standard

64-Spalten-Phase = 2,9 Screens (c0–21 · c22–43 · c44–63); 72-Spalten (p2) = 3,3 Screens.
Dichte-Regler: 0,5–0,75 Wesen-Begegnungen je Screen (Schwarm-Gauntlet p2 = deklarierte
Ausnahme als EIN Set-Piece). Trails = Sätze (Läufe 3er), Wort pro Phase aus dem Feld.

## §Regel-Seiten-Budget (doc 44 §4: 3 Seiten = u01-Topics)

p1 = »Kurzformen« · p2 = »Begrüßen/Verabschieden« · p3 = »Zahlen«.

**Geändert in R5-W2 I1 (2026-08-13):** p1 hieß »to be« — MORE! 1 führt „the verb to be"
laut eigener Ziel-Liste erst in **Unit 2**; Unit 1 druckt stattdessen die drei Note-Kästen
`I'm = I am` · `it's = it is` · `isn't = is not`. Koki-Tor: auf »Kurzformen« gedreht.
**ENTSCHIEDEN (Koki, 2026-08-13):** die Zahlen-Spanne ist **1–25**, überall — Buch,
Rad und Regel-Seite stimmen damit überein. G9s Tap-Lock bleibt unberührt; nur seine
»1–20« ist überholt (§Kanon oben, datiert).

## Status (2026-08-11)

ALLE FÜNF DOSSIERS GEGATED: p3 v2.4 (4 Runden: 3× Konzept-PASS + Arithmetik-Liste) ·
p1/p2/p9/arena v2.1 (Welle + je 2 Kritiker + Fix-Welle nach deren Rezepten; p2 nach
2 Netz-Toden per Takeover). Bekannte Rest-Hygiene für den Grid-Schnitt-Pass:
Debt-NUMMERN-Querverweise in p9/arena teils gegen die Register-Vergabe gedriftet
(Register D-1…D-22 ist kanonisch) · deklarierte P1-Engine-Vorleistungen: reachFrom-
Sweep-Knoten (p3) · patrolMinC/MaxC (p1) · stageClamp + Käfig-Gate + Horizontal-
Assertion (arena) · composition words p9 · KEINE Sweep-Knoten für p2 (gestrichen,
Prüf-Zeile stattdessen).
