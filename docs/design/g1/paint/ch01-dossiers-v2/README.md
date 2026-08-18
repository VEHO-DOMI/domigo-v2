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
  p1 (38,17)→**(43,17)** · p2 (20,10)→**(58,14)** · p3 (26,21)→**(29,16)**;
  p4/p9 kreuzen keine Tinte und tragen darum weiterhin keinen.
  **★ Nachtrag 2026-08-15 (R44): Checkpoints sind STILLE ANKER.** Kein Krakel, keine
  Staffelei, keine Zeremonie, kein Toast — das `C`-Glyph, das Warp-Ziel und die vier
  Gesetze oben bleiben unverändert.
  **★ Nachtrag 2026-08-18 (K5, Schuld D-307, nach Kokis Entscheid vom 17.08. — Ruling R135):
  die Neu-Platzierung IST entschieden, und die Seite steht jetzt je Phase im Level.**
  `checkpointSide` ist Pflicht, wo ein `C` steht: **p1 `near` (c43)** · **p2 `far` (c58,
  unverändert)** · **p3 `near` (c29)**. Die Zahlen oben sind entsprechend nachgezogen
  *(war: p1 (47,17) · p3 (40,20) — der Stand vor Kokis Entscheid; die Zeile darunter sagte
  außerdem, eine Neu-Platzierung sei »ausdrücklich NICHT entschieden«)*. Warum gemischt:
  p2 behält die ferne Seite, weil sein Tintenbecken 31 Spalten breit ist — ein Anker davor
  ließe jeden späten Fehltritt den ganzen Motten-Lauf wiederholen; p1 und p3 nehmen die nahe
  Seite, weil ein Kind, das nie hinübergekommen ist, den fernen Anker nie berührt hat
  (gemessen: 41 bzw. 26 Spalten Rückweg je Fehlversuch). Kokis Tor **T8** ist damit
  beantwortet und gebaut; das Gesetz `checkpoint-placement` prüft beide Seiten
  spiegelbildlich.

- **★ DIE LEVEL-DATEI WIRD CHIRURGISCH EDITIERT (K2, 2026-08-15 — nachgemessen).**
  `ch01.level.json` steht im Format `json.dumps(indent=1, ensure_ascii=False)`: **ein
  Leerzeichen Einrückung je Ebene, Umlaute als echte UTF-8-Zeichen, KEIN End-Newline**
  (die letzten zwei Bytes sind `"` und `}`).
  **★ Neu gemessen 2026-08-15 (K3, Commit `3daaf47`; Ruling R73): die Datei ist heute
  byte-identisch zu ihrem eigenen Dump** — 18 053 Bytes, 624 Zeilen, kein End-Newline,
  md5 `94b94950918d92c5ef74476daaa0f1f5`. ~~Die elf abweichenden Zeilen (113–116, 306–308,
  435–438)~~ waren die von Hand nachgetragenen Felder in den `regelseite`-Objekten, und
  **Session I2 hat genau diese Felder entfernt**; es gibt keine abweichende Zeile mehr.
  *Regel:* **trotzdem nie neu formatieren, nur chirurgisch editieren** — die Regel hängt am
  fehlenden End-Newline, an der Ein-Leerzeichen-Einrückung, an den echten Umlauten und
  daran, dass ein neu geschriebenes JSON in einer Parallel-Welle in jeder Zeile kollidiert
  statt in der einen, die man geändert hat. Byte-identisch heute heißt nicht dumpbar
  morgen: das erste von Hand nachgetragene Feld bricht es wieder. Messbefehl und
  ausführliche Begründung in `CONTRIBUTING.md`. (Gilt für die Level-Dateien;
  `ch01.tasks.v2.json` endet dagegen MIT einem Zeilenende — es ist keine Repo-weite
  JSON-Regel.)

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

## §Abdeckung — die Vokabel-Vergabe des Kapitels (B8; **Maschinen-Check LIVE:** `scripts/check-level-design.mjs` Block 2)

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
| ~~glue stick · sharpener~~ | Entfärbte Dinge `obj_gluestick`/`obj_sharpener` — **die OBJEKTE stehen im Level, die WÖRTER sind kein Unit-Wortschatz** | p3 | ✓ (Kunst da, Anspruch gestrichen) |
| **chair** | **Käfig-#4-Insasse (Karte B20 „It's a chair")** | p3 | Wesen-Kunst **D-13** |
| school bag (2./3. Rolle) | Schaukel + Stampfer | p3 | ✓ (Farb-Trennung D-14) |
| board | DIE FLIEGENDE TAFEL (Guardian) | p4 | ✓ |
| door / window | Welt-Architektur (Türen-Serie G11 / p2-Fenster-Ein-und-Ausstieg) | überall | ✓ |
| **picture** (wordbank g1u01.w.picture) | Käfig-#5-Insasse (Arena, B20-Karte) | p4 | obj_picture **D-21** |
| **sound system** | Käfig-#1-Insasse (Empfehlung, B20-Klasse — PR-Nick) | p1 | Wesen **D-18** |
| **tablet** | Käfig-#2-Insasse (Empfehlung — PR-Nick) | p2 | Wesen **D-19** |
| projector | **Welt-Architektur** (`kind:"architecture"`, wie door/window): der Projektor-Turm steht als solides Gelände in p2, Spalten 55–56 über die Reihen 1–7, und sein Kegel stiftet den Zahlen-Grund des Spießrutenlaufs; Trail-Wort PROJECTOR. Kein Sammelobjekt, keine Antwort-Karte — **die datierte Ausnahme ist damit aufgelöst, nicht verlängert** (R5-W6 · G5, R148) | p2 | Turm-Kunst **D-19** |
| **Uniform-Neun** (hairband · sunglasses · hat · school tie · shirt · sweater · skirt · socks · shoe) | **AB WELLE 5: neun Sammelobjekte, 3/3/3 über p1–p3, plus drei Benenn-Karten** (`UNIFORM_SAMMELN_DESIGN.md`). Heute: sieben davon nur ABLENKER auf `enc.ranzen.q3/q4` (`shoe` seit der Pluralform `shoes`), zwei stehen auf gar keiner Karte → **deklarierte Ausnahme bis 2026-12-31, Besitzer Welle 5 / Uniform** | p1–p3 (ab W5) | Codex **AQ10** |

**★★ EHRLICHKEITS-NACHZUG (R5-W4 · G3, 2026-08-15 — D-77, Kokis Befund).** Diese
Tabelle behauptete Abdeckung, die niemand nachgemessen hatte. Zwei Klassen von
Lüge sind jetzt maschinell ausgeschlossen:
1. **`kind:"cards"` prüfte nichts.** Gemessen an der Antwortfläche aller 54
   Karten produziert ein Kind **keines** der zehn oben deklarierten Wörter. Sechs
   der Uniform-Neun stehen als ABLENKER auf `enc.ranzen.q3/q4` — ein Ablenker
   wird gelesen, nicht erworben. `hairband`, `sunglasses`, `shoe` und `projector`
   stehen auf gar keiner Karte. Ab jetzt muss ein `cards`-Anspruch eine echte
   Antwort-Karte haben ODER eine Ausnahme mit `why` + `expires` + `owner` tragen;
   nach Ablauf wird das Tor rot. (Diese Lesart ist schärfer als Gesetz 17a in
   `variety.ts`, das ein Wort schon dann als beantwortet zählt, wenn seine ID in
   irgendeinem `exercises`-Array steht — eine Behauptung, keine Messung.)
2. **Tote Ansprüche.** `glue stick` und `sharpener` standen in der Tabelle und in
   `CLAIMS`, ohne dass Unit 1 die Wörter lehrt: die Master-Vokabelliste kennt sie
   nicht (nachgezählt — 26 Word-File-Einträge, beide nicht dabei), nur die
   buch­eigene Wortliste führt sie unter `U1/11`. Die Level-OBJEKTE bleiben, der
   Anspruch ist gestrichen, und ein neues Gesetz verbietet jeden Anspruch auf ein
   Wort, das die Wortbank nicht führt. → Aufnahme in die Wortbank ist ein
   Pipeline-Auftrag an den Architekten (der `add`-Pfad kann heute nur
   v1-Wörter).

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

## §Regel-Seiten-Budget (R51: ~~3~~ **5** Seiten = die Grammatik der Unit)

~~p1 = »Kurzformen« · p2 = »Begrüßen/Verabschieden« · p3 = »Zahlen«.~~

**★ ENTSCHIEDEN (Koki, 2026-08-15; Ruling R51): FÜNF Seiten, verteilt p1/p1/p2/p2/p3.**
»Kurzformen« · »Befehle« · »Fragen/Begrüßen« · »Zahlen« · »Plural«. Damit ist auch doc 45
**E4** („reichen 3 für die Unit?") beantwortet: nein. Vorgaben je Seite — **kein sichtbarer
Buchbeleg, keine Aussprache, keine Falsch-Beispiele** ~~und ≥2 Beispiele wörtlich aus dem
Buch~~.

**★ DIE ZITAT-VORGABE IST ÜBERHOLT (Koki, 2026-08-15, Ruling K-1 — D-150):** »nicht die
exakt selben sätze aus dem buch (wir schreiben immer unsere eigenen beispiele – die
natürlich aber zum kontext und level passen)«. Die Beispiele sind seit I2 UNSERE Sätze;
gebunden bleiben sie durch das u01-Lexikon (jedes Wort) und neu durch `lehrtEn`
(ABDECKUNG: jede Form, die der Titel nennt, steht in einem Beispiel · RELEVANZ: kein
Beispiel am Thema vorbei). Datiert überholt, nicht still gelöscht.

**ALS GEBAUT IN R5-W4 I2 (2026-08-15):**

p1 = »Kurzformen« **+ »Befehle«** · p2 = »Fragen und Begrüßen« **+ »Zahlen«** ·
p3 = **»Plural«**.

Warum fünf: MORE! 1 Unit 1 druckt auf S. 15 drei Grammatik-Kästen — **Plural +
unregelmäßige Plurale**, **Questions**, **Imperatives** — dazu die vier Note-Kästen der
Kurzformen (S. 11/13/14) und die Zahlen 1–25 (S. 8/10). Von diesen fünf trugen die alten
drei Seiten eine ganze (Kurzformen), eine halbe (Fragen, als »Begrüßen/Verabschieden«)
und eine Randnotiz (Zahlen); **Plural und Imperative fehlten ganz.** Kokis Wort dafür:
»ein Kuratierungsproblem«. Das Level trägt jetzt fünf `tip`-Entities und `tipsTotal: 5`;
`tip-honesty` beweist die Zahl gegen die Welt. Die REIHENFOLGE der fünf bleibt ein
offenes Koki-Tor (Tabelle im I2-Report).

**★ ENTSCHIEDEN (Koki, 2026-08-15; Ruling R98): es bleiben FÜNF — die Plural-Seite wird
NICHT geteilt.** I2s blinder Leser hatte gemeldet, die Plural-Seite lehre zwei Dinge
(regelmäßig **-s/-ies** und *child–children*), und eine Teilung auf sechs Seiten
vorgeschlagen. Kokis Entscheid: erst spielen, dann entscheiden. Eine sechste Seite kommt
nur auf seinen Wunsch und dann als eigener kleiner PR (I2b) — nicht nebenbei in einer
anderen Runde, weil jede Änderung an der Seitenzahl die Auftrags-Karte, `tipsTotal` und
das Gesetz `tip-honesty` gemeinsam bewegt.

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
