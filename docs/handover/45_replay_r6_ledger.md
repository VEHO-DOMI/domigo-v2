# 45 · DAS REPLAY-VERDIKT — der R5-Ledger (Kokis Durchlauf des gemergten PK-R6)

**Status: GOVERNING für die R5-Runde („die AAA-Runde"). Kokis Replay des deployten
Kapitels nach dem Merge von #249, 2026-08-10, ~40 Screenshots mit Zeitstempeln.
Dieser Ledger ist der VOLLSTÄNDIGKEITS-VERTRAG (das doc-44-Muster): jede Aussage des
Verdikts steht hier nummeriert; ein unabhängiger blinder Abdeckungs-Check hat Ledger
gegen Wortlaut geprüft, bevor dieser PR öffnete. Ausführung: die R5-Session bootet über
`PLATFORM MASTER/SESSION-PROMPTS/PASSOVER_PB_R5_AAA_2026-08-10.md`.**

Kokis Gesamturteil: „In terms of game physics and the playability and the way it all
looks and feels, it's much closer to the vision I initially had" — aber der Build trägt
Frankenstein-Reste, und der Anspruch bleibt AAA. Die Chalk-Choreografie des Bosses und
Merles Erwachens-Runden wurden ausdrücklich gelobt („much, much improved", „quite nice").

Jeder Eintrag: **[Zeitstempel] Befund → Disposition** (BUG · DESIGN-GESETZ · COPY ·
LORE · ASSET · KOKI-TOR). Wo diese Session die Ursache schon lokalisiert hat, steht sie
dabei — die R5-Session verifiziert am Code, nie blind übernehmen (Specs rotten).

---

## A · Engine-/Physik-Bugs

- **A1 · Die Fall-Pose im Stehen/Fahren** [14:52:58, 14:53:07, 14:55:25, 14:59:58,
  15:00:00 (Lauf nach links), 15:00:56, 15:00:59, 15:02:02 (Klippenkante), „a couple
  of times further as well"]. Der Held trägt die
  Fall-Animation, während er auf Plattformen steht oder fährt. **URSACHE (Mover-Fall)
  LOKALISIERT:** `sim.ts` ruft `stepPlayer` (Pose-Ableitung, `player.ts:439/:449`,
  rohes `grounded`, keine Hysterese) VOR dem Ride-Block (~`sim.ts:548–570`), der
  `grounded=true` setzt — die Pose erfährt es nie; nächster Tick liest das Grid allein.
  Fix-Fläche: Pose nach dem Ride-Block neu ableiten ODER ein Ride-Flag durch
  `stepPlayer` tragen. **Die statischen Fälle (14:52) getrennt diagnostizieren** —
  Setzstücke gründen per Gesetz exakt wie Tiles (doc 41 §6, `mass.ts:414`), dort ist es
  vermutlich Kanten-/Naht-Flackern ohne Pose-Hysterese. → BUG.
- **A2 · Die Kleckskammer frisst Fortschritt** [14:55:25]. Rückkehr aus dem Bonusraum
  teleportiert an den PHASEN-ANFANG statt an die Eintrittsstelle, und die gesammelten
  Buchstaben der Wirts-Phase resetten. **URSACHE LOKALISIERT:** `PaintGame.tsx:559`
  remountet die Phase frisch (Spawn bei S); `:547–:550` überspringt das Banking und
  nullt `phaseLettersRef` — nur Tips/Bücher überleben (`:414`). → BUG.
- **A3 · Der Hopper clippt aus dem Bild** [14:55:50]. Der anspringende Gegner
  verschwindet nach oben aus dem Screen, wenn man ausweicht — statt an der Kante
  umzudrehen und pendelnd wieder anzugreifen („I think we had this issue before").
  → BUG (Kanten-Vertrag der Gegner prüfen; der Walker-Edge-Contract existiert seit
  PB-T1 — warum greift er hier nicht?).
- **A4 · Die zwei Mover in p3** [15:00:48]. Der obere glitcht sichtbar; der untere
  fährt nicht weit genug nach links, um verlässlich aufzuspringen — man fällt fast
  jedes Mal. → BUG + DESIGN (Fahrweg neu denken).
- **A5 · Der Flyer trifft nie** [15:01:15]. Das Buch über dem oberen Mover schießt
  immer zu weit nach rechts — es kann den fahrenden Spieler strukturell nicht treffen.
  Dazu B11: es gibt keinen Grund, überhaupt hinaufzuspringen. → BUG + DESIGN.
- **A6 · Die Schein-Lücke** [14:59:58, 15:00:00]. Beim Lauf nach links sieht der Boden
  aus, als könne man durch eine Lücke fallen, wo keine ist — Kollision und Bild
  erzählen Verschiedenes. → BUG/ART (Naht).
- **A7 · Der unerreichbare Buchstabe G** [15:00:11-Umfeld]. Links liegt ein G, das
  nicht erreichbar ist. Das Reachability-Gesetz war grün — prüfen, warum Maschine
  „erreichbar" sagt, wo ein Mensch scheitert (BFS-Annahmen vs. reale Sprungphysik?).
  → BUG/GESETZ (der Checker selbst ist verdächtig).
- **A8 · Die befreite Merle wirkt noch gefangen** [14:59:27]. „You can see her free,
  but she's just standing there and there's still like, it looks as if there's like a
  girl still trapped inside of there" — der offene Käfig daneben zeigt weiterhin eine
  Gefangenen-Silhouette (Käfig-Kunst/Zell-Wahl nach der Befreiung prüfen: welches
  Blatt rendert der geöffnete Käfig, und trägt es noch das Kind hinter den Stäben?).
  → BUG/ART.

## B · Level-Design (das Herz der Runde — „rethink from start to finish")

- **B1 · Kein Zusammenpferchen** [14:54:21, 14:57:02]. Wasserfarben + Checkpoint +
  Bleistift auf einem Fleck; „everything crammed into one place". Räumlicher Rhythmus,
  bewusste Verteilung — „not the first best thing that comes to mind, really think
  this through from a clever game level design". → DESIGN-GESETZ.
- **B2 · Frankenstein-Plattformen** [14:53:07 (zoom), 14:59:27, mehrfach]. Generierte
  Plattform oben, fremdes Kanten-Stück darunter; „random edges", „looks like a
  Frankenstein monster". Plattform-Baukasten vereinheitlichen. → DESIGN + ASSET
  (Kanten-Kit).
- **B3 · Die hässliche Rampe** [15:00:11]. Das Rutschen selbst ist fein; die Kisten +
  die improvisierte Rampe darüber sind „just ugly. Not what we understand as AAA."
  → DESIGN + ASSET.
- **B4 · Die schwebenden Stachel-Blöcke** [14:57:02]. Unlesbar, was sie darstellen
  sollen; vermutlich Keen-Carryover; schweben in der Luft. Ersetzen/neu generieren,
  lesbar machen. → DESIGN + ASSET.
- **B5 · Die zufällige Tür oben** [14:56:28, 16:34:45]. Tür auf hoher Plattform mit
  „Die Tür ist zu … ‚Come in'" — fiktional wie mechanisch grundlos. Türen brauchen
  Ort-Logik. → DESIGN.
- **B6 · Der zufällige Tisch** [16:34-Umfeld]. Steht grundlos herum. → DESIGN.
- **B7 · Entfärbte Dinge als ENTDECKUNGEN inszenieren** [15:02:02 (die Schultasche
  „just standing there, not really moving, not really doing anything"), 16:32:48].
  Nicht „mitten random am Weg, dass man eh drüber stolpert", sondern schön verteilt,
  erreichbar gemacht als kleine Ziele; nicht träge herumstehend ohne Engagement-Cue;
  der ↑-Pfeil markanter/einladender; beim Wiederherstellen UNMITTELBARES Feedback
  (XP/Collectible/irgendein Reward). → DESIGN-GESETZ + C-Reward.
- **B8 · Keine Duplikate — volle Vokabel-Abdeckung** [16:32:00 „zwei Bleistifte —
  warum nicht zwei unterschiedliche Dinge? Vergeudet"]. Alle Kern-Vokabeln der Unit
  sollen als Wesen/Dinge im Level vorkommen; Duplikat-Slots sind verschenkt.
  → DESIGN-GESETZ + Maschinen-Check (Vokabel-Abdeckung pro Level).
- **B9 · Farbvielfalt der Dinge** [15:02:02, 16:32-Umfeld]. Nicht alles braun/gelb/
  grün — „if that needs a regeneration, then that needs a regeneration". → ASSET.
- **B10 · Der Motten-SCHWARM als Hindernis** [16:34:31, 16:34:45]. Eine einzelne Biene/
  Motte hoch oben, kein Grund zu engagen. Gedacht war: ein Schwarm, durch den man
  MUSS (unvermeidbar), mehrere hintereinander — 3–4 Rad-Aufgaben in Folge. → DESIGN.
- **B11 · Jede Platzierung braucht einen GRUND** [15:01:15 u. a.]. Fiktional UND
  mechanisch — das Buch, zu dem niemand muss; die Tür im Nichts; der Tisch. → GESETZ.
- **B12 · Aufgaben-Zuordnung statt Zufalls-Wechsel** [14:54:21, 14:57:14]. Der
  Farbkasten wechselt zwischen Benennen und Begrüßen; Vorschlag: pro Wesen(styp)
  feste Aufgaben-Profile („two sets of enemies that spawn different tasks") statt
  wechselnder Zufälligkeit. Und: **die Karten-Fiktion muss in der WELT sichtbar sein**
  — „Klappert wütend mit dem Deckel" gehört in die Animation; das Farben-Werfen viel
  sichtbarer, nicht eins alle paar Sekunden. → DESIGN + Animations-Kopplung.
- **B13 · Wiederholte Begegnungen variieren die Inhalte** [16:38:28]. Beim erneuten
  Antreffen (Respawn/Replay) neue Zahlen, nicht dieselben. → DESIGN/CONTENT.
- **B14 · Objekt-LESBARKEIT auf Distanz** [15:00-Umfeld: „ein kleiner Stift — I don't
  know … ob das ein Stift ist. Something I cannot quite make out"; 15:02:02: der
  Spitzer „is just standing there … it's not really clear what it is"]. Ein Wesen/Ding,
  das der Spieler nicht identifizieren kann, kann er nicht benennen wollen — Silhouette
  + Größe + Farbe müssen die Identität auf Spielgröße tragen (Squint-Test pro Objekt;
  Regeneration wo nötig, s. B9). → DESIGN + ASSET.
- **B15 · Befreiungs-Zählung gilt LEVELWEIT** [15:01–15:02-Umfeld, VOR der Arena
  ausgesprochen]. Alle verwunschenen Unit-Dinge im Level sind keine Gegner — „we're
  doing them a favor by restoring them"; wie viele im LEVEL befreit wurden, gehört in
  Score/Bilanz (F6 ist derselbe Gedanke in der Arena; der Geltungsbereich ist das
  ganze Kapitel). → DESIGN (Bilanz).

## C · Copy-/Content-Schulden

- **C1 · „Zurückgeholt!" ist ein Lost-Pages-Carryover.** Die Auflösungs-Zeile passt
  nicht zur Befreiungs-Fiktion — ALLE Lösungs-Botschaften kontext-treu neu denken/
  schreiben. → COPY (Klasse, nicht Instanz).
- **C2 · Merles Kommandos müssen skalpell-genau scaffolden** [14:57:44–14:59:11].
  „Sit down" für Stehen-auf-dem-Tisch ist nicht die korrekteste Instruktion — „get
  down / get off the table" wäre es („I'm not being nitpicky — these are A1 learners,
  and they rely on every type of scaffold"). *(Architekten-Zusatz, nicht Kokis
  Wortlaut: der Korpus-Zwang bleibt bindend — hat die Wordbank das Kommando nicht,
  wird die FALSCH-AKTION umgerahmt, nie Englisch erfunden.)* Die Runden-Mechanik
  selbst + die Posen-Bilder: ausdrücklich gut. → COPY/CONTENT.
- **C3 · Das Warum der Kommandos** — sie ist noch halb verwunschen; du befreist sie
  SCHRITTWEISE durch dein Zurechtweisen; diese Fiktion muss die Runden rahmen, nichts
  darf „just random" wirken. → COPY + LORE.
- **C4 · Der Namens-Leak auf der Auftrags-Karte** [16:16:26]. „OSWINs Tinte…" — Koki:
  sollten wir den Verursacher an diesem Punkt überhaupt kennen? **KANON SAGT NEIN**
  (doc 31 §6 Cloak-Regel: das ganze Jahr nur die vermummte Tinten-Silhouette; Unmask =
  ch15; ch01 trägt nur die erste anonyme Notiz, doc 44 §4). Der Leak ist ein
  Kanon-Verstoß dieser Copy-Zeile. Mysteriöser, packender formulieren. → COPY (+ D6).
- **C5 · „…kann das Buch wieder malen"** — Logik unklar (warum MALT das Buch neu,
  statt dass die Farbe zurückkehrt/die Unit restauriert wird?). → COPY.
- **C6 · „Sechs graue Dinge" — ‚Dinge' ist ein Platzhalter,** „der schleunigst
  ausgetauscht werden muss". Und die ZWEI FAMILIEN klar trennen: (1) entfärbte
  Objekte, die man BENENNT (Farbe kehrt zurück) vs. (2) verwunschene Wesen, die
  ANGREIFEN und durch Aufgaben BEFREIT werden — keine Überschneidungen. → COPY +
  DESIGN-Begriffsarbeit.
- **C7 · „Zeit für die Schule — das bemalte Schulhaus"** — als Titel storytelling-
  unklar (bemalt? entfärbt? verwunschen?). → COPY.
- **C8 · Die Fibel-Reste** [15:06:02 „sagt Fibel"]. Kokis Frage: Remnant? **JA:**
  Fibel ist nur ein Name im Buchwesen-Pool (doc 31 §6), aus ch01 korrekt entfernt
  (kein Fibel-Entity, keine Faust); Reste: `PaintGame.tsx:1213` (Bilanz-Zeile „sagt
  Fibel — Die Seite ist wieder voll", kontextlos) + `:957` (tote Faust-Schenk-Karte —
  zugleich die EINZIGE Prosa, die je Knoten erklärte, unerreichbar). Entfernen/
  ersetzen. → COPY-BUG.
- **C9 · Das „Lager am Rand der Seite"** [15:49:11, 16:40:46]. Nie definiert, nirgends
  sichtbar. **KANON: doc 44 §1.4 hat das abstrakte Lager BEREITS ABGESCHAFFT** —
  Befreite versammeln sich in den restaurierten Orten ihrer Kapitel. Die Copy
  (`PaintGame.tsx:1039/:1060/:1063/:1214`) verkauft das tote Konzept. Neu schreiben
  auf Allianz-in-restaurierten-Orten — UND SICHTBAR machen (D7). → COPY + LORE.
- **C10 · Bilanz-Zeilen erklären sich nicht** [15:06:02]. „Bonusbücher" gesammelt —
  wozu? (E/D8); „Regelseiten gefunden" — s. E-Programm. → COPY + Programm.
- **C11 · Festgehalten, o. B.:** die klemmende Tür („Die Tür klemmt fest und wackelt,
  sage, sie soll aufgehen" [16:34:01]) quittierte Koki mit „okay" — keine Beanstandung;
  hier notiert, damit nichts stillschweigend fehlt.

## D · Lore-/Story-Programm

- **D1 · DAS VOLL-SKRIPT VOR DEN VISUALS.** Bevor Prolog/Epilog/Interludes gebaut
  werden: das komplette ch01-Story-Skript als Dokument — jede Botschaft geprüft gegen
  den WISSENSSTAND des Kindes an diesem Punkt („does the student at this point have
  enough information, context, lore?"). Muster für alle Kapitel. → LORE-PROGRAMM
  (Vorstufe zu doc 44 E8/A12/A13).
- **D2 · Story IM Level erzählen** — mit stützenden Visuals, nicht Textblöcken; die
  Stakes relevant machen; jederzeit spürbar: DU bist im Buch gefangen und willst raus.
  → LORE + DESIGN.
- **D3 · Nebenfiguren als kleine Begleiter.** Kritzel (zeichnet dein Porträt am
  Checkpoint), Klecks (Bonusraum-Tor) u. a. stellen sich per Pop-up vor — „small
  little companions", keine Voll-Mentoren. → LORE.
  **★ TEILWEISE ERLEDIGT (2026-08-15): Kritzel entfällt.** R44 macht die Checkpoints zu
  **stillen Ankern** — kein Krakel, keine Staffelei, keine Zeremonie, kein Toast; das
  `C`-Glyph, das Warp-Ziel und das Gesetz bleiben. Damit gibt es die Figur nicht mehr, die
  sich am Checkpoint vorstellen sollte. **Offen bleibt allein die Klecks-Vorstellung** —
  sie baut Session C2 (Copy). → LORE (Rest: C2).
- **D4 · Der Bonusraum gehört in die Lore** [12 Collectibles, 14:55:25]. Warum gibt es
  die Kleckskammer, was bedeutet sie im Buch? → LORE.
- **D5 · Orts-Übergänge begründen** [Schulhofgarten, 16:36:27]. Der Spieler soll
  wissen, warum er JETZT in diesem Gebiet ist. → LORE.
- **D6 · DIE NAMENS-RUNDE (KOKI-TOR).** Koki widerruft sein OSWIN-Gefallen („I don't
  like this name at all"): keine gewollt-schrägen Kunstnamen; stattdessen „something
  clever like English wordplays or something indicative of the story and setting".
  R5 liefert eine Options-Runde (+ Empfehlung); bis zur Entscheidung bleibt der Name
  ohnehin UNSICHTBAR (Cloak-Regel, C4). Naming-Gesetz doc 31 §5 wird entsprechend
  amendiert. → KOKI-TOR.
- **D7 · Die Allianz sichtbar machen** — wohin gehen Befreite? (Kanon: in die
  restaurierten Orte.) Merle winkt am Käfig (gebaut) — aber die Sammel-Erzählung
  fehlt; ihre Ziel-Copy lügt (C9). Sichtbares Allianz-Konzept pro Kapitel. → DESIGN +
  LORE (+ ASSET evtl.).
- **D8 · Bonusbücher-RULING (KOKI-TOR).** Kanon-Fund: doc 41 §5 nennt sie Score-
  Pickups; doc 27 §5s kanonische Ökonomie kennt sie NICHT — unversöhnt. Optionen:
  in die XP-Schicht falten (PK-R7), umfiktionalisieren, oder streichen. → KOKI-TOR.
  **★ ENTSCHIEDEN (Koki, 2026-08-15; Ruling R53): RAUS AUS ch01.** Die
  **neun Uniform-Sammelobjekte der Unit 1** (WB p. 12 „Cool clothes") nehmen ihren Platz
  ein — gebaut wird das in **Welle 5**. Das Kanon-Gesetz steht in doc 44 §2.7 (Amendment
  2026-08-15) samt Abgrenzung gegen ch08; das ch01-Budget in doc 44 §4 ch01 sagt jetzt
  **Bonusbücher: 0**. Für die übrigen Kapitel ist damit nichts entschieden. ⚠ Nebenwirkung:
  die Kunst-Allowlist für `bonusbuch_a` (doc 44 §5.4, läuft 2026-09-30 ab) wird für ch01
  gegenstandslos — als Schuld gefiled (K2-Abschnitt im Schulden-Register).
- **D9 · Prämissen-Checks beantwortet** (Kokis „correct me if I'm wrong"): OSWIN war
  approved (doc 31 §6, 2026-07-19) — Widerruf jetzt aktenkundig (D6); die Identität
  sollte dem SPIELER laut Kanon ohnehin verborgen sein (C4); Fibel = Pool-Name,
  Reste = echte Remnants (C8); Lager = totes Konzept (C9). → ERLEDIGT (hier
  dokumentiert).

## E · Regel-Seiten- & Collectible-Programm

- **E1 · Regel-Seiten = PRESTIGE-COLLECTIBLES.** „Really beautiful, presentable …
  looks actually like a treasure." Gemaltes Schatz-Design (Codex-Asset), nicht das
  blande Pickup neben dem K [14:53:07]. → ASSET + DESIGN.
- **E2 · Inhalt aus dem ECHTEN BUCH.** Die drei Texte sind „ein Alibi" („nur to be,
  bin, bist, ist" / „one, two, three… half ten" [16:33:54, 16:36:27]) — ins
  MORE!-1-Buch/die Transkripte schauen (`content/build/transcripts/g1/`), echte
  Lernseiten authoren. → CONTENT.
- **E3 · Zweifach nutzbar:** im Spiel sammeln UND später im Spiel-Menü als
  Referenz-/Lernseiten wiederauffindbar („it's twofold"). → FEATURE (Menü-Bibliothek).
- **E4 · N-Check:** reichen 3 für die Unit? (Kanon doc 41 §5: N = Grammatik-Themen;
  gegen das Buch prüfen.) → CONTENT-Check.
  **★ BEANTWORTET (2026-08-15, Ruling R51): NEIN — es sind FÜNF.** Kurzformen · Befehle ·
  Fragen/Begrüßen · Zahlen · Plural, verteilt p1/p1/p2/p2/p3. Die Seiten tragen keinen
  sichtbaren Buchbeleg, keine Aussprache und keine Falsch-Beispiele, und je Seite stehen
  **≥2 Beispiele wörtlich aus dem Buch**. ⚠ Die WELT zieht erst mit Session I2 nach
  (heute 3 `tip`-Entities, `tipsTotal: 3`) — bis dahin ist 5 Kanon, aber noch keine
  Weltsache. → gebaut in I2.
- **E5 · Merkseite + Reward wiren.** Doc 41 §5 versprach „collect all N = Merkseite
  completes + reward" — nie gebaut; nur eine Bilanz-Zahl. → FEATURE.
- **E6 · Spawn-Kollision** [16:36:27]: p3 spawnt DIREKT in eine Regel-Seite und
  triggert sie sofort — Platzierung. → BUG/DESIGN.
- **E7 · Restore-Reward** (=B7): unmittelbares Feedback beim Wiederherstellen (XP/
  Collectible). → FEATURE (Vorgriff auf PK-R7-Ökonomie).

## F · Boss-Redesign

- **F1 · Die Knoten sind unerklärt.** „Why do we have knots? What is the idea again?"
  Kanon spezifiziert die Mechanik (doc 44 §3.2/§4: 3 Knoten × E/M/S-Fenster), aber
  KEINE In-Game-Zeile erklärt sie (einzige Prosa: die tote Fibel-Karte, C8). Entweder
  in-fiktional scaffolden — oder das Sieg-Konzept ersetzen. → DESIGN + COPY.
  **★ GESCHLOSSEN (2026-08-15) durch R50 — das Konzept ist ersetzt, nicht erklärt.** Die
  Tafel ist **vollgekritzelt**, und die drei Stufen sind **Kritzel-Schichten, die das Kind
  WEGWISCHT** („Clean the board!"). Eine Tafel sauber zu machen braucht keine Erklärzeile —
  damit ist die Frage „warum Knoten?" gegenstandslos statt beantwortet. Mechanik unverändert
  (doc 44 §4 ch01, Amendment 2026-08-15). ⚠ Beim Nachlesen: die Quellenangabe oben nennt
  „doc 44 §3.2/§4" — **§3.2 enthält kein Knoten-Wort**; die Mechanik stand nur in dem einen
  Satz in §4 ch01.
- **F2 · Klare Arena-Anleitung.** Wie besiegt man den Boss? Muss instruiert und
  gescaffoldet sein (eigene Objective-Beat für die Arena). → DESIGN + COPY.
- **F3 · Eskalationskurve.** Erst EINE Kreide, progressiv mehr, am Ende fast
  bodendeckend — unausweichlich werdend. → DESIGN.
- **F4 · Die Doppel-Mechanik.** Der Boss WIRFT (ausweichen → unvermeidbare Aufgaben)
  UND LÄSST FALLEN (sammeln: z. B. herausgerissene Seiten / Unit-Vokabel-Miniaturen);
  genug gesammelt = Teil des Siegs. „You cannot avoid them all" ist Design-Absicht.
  → DESIGN.
- **F5 · Viel mehr, viel variablere Boss-Aufgaben.** Die jetzigen sind repetitiv;
  „way more tasks". → CONTENT.
- **F6 · Befreite als Score-Dimension (Arena-Instanz von B15).** Die Wesen sind keine
  Gegner — „we're doing them a favor by restoring them"; wie viele befreit = Teil des
  Scores/der Bilanz. Geltungsbereich laut Koki: das GANZE Level (B15), nicht nur die
  Arena. → DESIGN (Bilanz-Erweiterung).
- **F-LOB (festgehalten):** Chalk-Wurf-Choreografie und Animationen „much, much
  improved — I can really tell you took your time to test it all out". Die BASIS
  bleibt; F1–F5 bauen DARAUF.

## G · Engagement-Modus & Karten-Look (Explorationen)

- **G1 · Der Voll-Bildschirm-Engagement-Modus.** Statt Karte-über-Level (rechts wird
  es „somewhat messy"): eine eingelockte Arena-Ansicht — „you're locked in there" —
  mit den Charakter-Animationen, die die Veränderungen ZEIGEN (bes. Merles Runden).
  Design-Exploration durch die Kritiker-Schleife; Richtungs-Entscheid = KOKI-TOR.
  **★ ENTSCHIEDEN (Koki, 2026-08-15; Ruling R52): KEEN-STIL-FOKUS.** Die Welt wird stark
  abgeblendet, die Karte steht im Zentrum — **kein** eigener Voll-Bildschirm-Modus und
  keine zweite Ansicht. Der Tether zur Weltstelle **bleibt**, damit das Kind weiß, wer
  gerade fragt. Damit ist das Tor zu.
- **G2 · NAIVE DESIGN fürs Spiel.** Farben/Look der Karten kinder-freundlicher, nicht
  „corporate"; „it can be a bit messy — think of naive design"; das Spiel darf davon
  am meisten tragen; die Plattform folgt SPÄTER (eigenes Vorhaben, hier nur
  vorgemerkt). Font bleibt gelobt. → DESIGN-Richtung (+ evtl. ASSET).
  **★ ENTSCHIEDEN (Koki, 2026-08-13): VARIANTE 2 »naiv«** — schief gesetzt,
  Wachsmalstift-Kanten, gestrichelte Innenlinie, dickere Knöpfe. Entschieden an
  Bildern, nicht an Adjektiven: `scripts/shoot-naive-samples.mjs` legte drei Muster
  derselben Karte vor (Belege lokal in `docs/Rayman X DomiGo Screenshots/I1b
  Naiv-Varianten 2026-08-13/`, CP-15).
  **★★ GEBAUT (J1, 2026-08-14, PR #277).** Der Look ist kein Wegwerf-Stylesheet mehr:
  zwanzig benannte Werte (Papier, Tinte, Kantenstärken, drei Radien, vier Neigungen)
  stehen als Custom Properties **im Regelblock `.pb-card` selbst** —
  `packages/game-paint/src/cards/overlay-css.ts`. Das ist die Scope-Wand als Mechanik
  statt als Disziplin: alles, was den Look trägt, ist ein Nachfahre der Karte, also
  **kann** die HUD-Leiste außerhalb des Schleiers ihn ebensowenig erben wie die
  Plattform. Die hier vermerkte Vertagung der Plattform kostet damit nichts mehr.
  Vier eingearbeitete Nähte, die kein Standbild zeigt (die Landung trägt die Neigung
  mit · die umgeschlagene Ecke erbt den Radius · der Chip-Druck wächst mit seiner
  Lippe · die Neigung sitzt auf dem Tafel-RAHMEN, nicht auf der Tafel), und eine
  bewusste Nicht-Übernahme (`font-size: 18px`, weil fast jeder Chip seine Größe inline
  setzt). Das Regelwerk mit der Begründung je Wert:
  `docs/design/g1/paint/AUFTAKT_UND_NAIV_LOOK.md`.
  Zwei blinde Kritiker, Reihenfolge getauscht, wählten unabhängig den neuen Look —
  und nannten beide denselben verbleibenden Abstand zum Maßstab: unter der
  Papiertextur ist es weiterhin ein regelmäßiges Vektor-Baukastensystem. **Offenes
  Tor: eine Geometrie-Runde** (unregelmäßige Strichstärken, je Ecke ein anderer
  Radius, auf allen Elementen) — sie berührt R5-W1 · D2 und ist deshalb Kokis.

## H · Prozess-Doktrin (re-ratifiziert + amendiert — bindend für R5)

- **H1 · Der One-Shot-Harness in voller Intensität:** Subagenten pro Aspekt auf
  Opus-5-Niveau, **xhigh/max Denk-Kapazität für die schwersten Aufgaben**; je ein
  SEPARATER, wirklich harter Kritiker, der Screenshots BLIND Seite-an-Seite gegen
  Vision + echtes Rayman legt und sagt, was besser aussieht; **loopen bis „utterly
  wowed"**; so viele Subagenten wie nötig; ultracode.
- **H2 · ARCHITEKT PRÜFT SELBST.** Nie nur Agenten-Reports glauben — selber
  nachspielen, selber nachprüfen, Dinge selbst bauen, wenn nötig (Kokis ausdrückliche
  Direktive; deckt sich mit dem Befund dieser Runde, dass zwei „grüne" Reports Dinge
  übersahen, die ein Mensch in Minuten sah).
- **H3 · Codex-Assets: fordern, nie warten.** ALLE nötigen Asset-Prompts werden
  geschrieben und abgelegt; aber kein Umbau wartet darauf — Platzhalter/vorhandene
  Assets, und JEDE Ersetzungs-Stelle wird EXPLIZIT als Schuld registriert („was später
  noch wie geändert werden kann"), sodass beim Asset-Eintreffen nichts gesucht werden
  muss. (Hintergrund: Codex-Quote aktuell unsicher.) → das DEBT-REGISTER wird Teil
  von R5s Doku-Pflicht.
- **H4 · Kein Frankenstein-Patchen.** Nicht Instanzen flicken — in Schleifen neu
  denken; Selbst-Widersprüche gegen frühere Pläne aktiv gegenprüfen („if I'm saying
  anything that contradicts something I said before, double-check against previous
  PRs and plans"). *(Architekten-Zusatz als Mechanik-Vorschlag: pro Phase ein
  Level-Design-Dossier durch die Kritiker-Schleife VOR dem Umbau — Kokis Wortlaut
  ist „rethink in loops"; das Dossier ist die gewählte Umsetzungsform.)*

---

## Anhang · Asset-Bedarfs-Kandidaten (R5 schreibt die Prompts; nichts davon blockiert)

Regel-Seiten-Schatz-Design (Pickup + Voll-Ansicht) · Plattform-Kanten-Kit (gegen B2) ·
Rampe (B3) · Stachel-Ersatz, lesbar (B4) · Farbvarianten der Objekt-Wesen (B9) ·
Motten-Schwarm-Zellen (B10) · Allianz-/Versammlungs-Visuals (D7) · Naive-Design-
Kartenhaut (G2, nach Richtungs-Entscheid) · Boss-Drop-Miniaturen (F4) ·
„Klappernder-Deckel"-Zustandszellen u. ä. Karten-Fiktion-in-Welt-Zellen (B12).

## Anhang · Kokis offene Tore aus dieser Runde

D6 Namens-Runde · ~~D8 Bonusbücher-Ruling~~ (entschieden 2026-08-15, R53) · ~~G1
Engagement-Modus-Richtung~~ (entschieden 2026-08-15, R52) · (aus #249
fortbestehend: F22/G10-Klammer · 3 zählbare Räder · Timeout-Kosten · E6/M5/S4-Uhren ·
Boss-Memory-Uhr · Lehrerin-Kanon + Boss-Swap-Vetos).

**Neu aus Welle 4 (2026-08-15) — fünf Tore, Empfehlungen im BOOT-SHEET:** R41 Farb-Palette
(die Ziel-Palette für die Codex-Bestellung AQ12: Buch rot · Uhu-Stick orange · Füllfeder
gelb · Heft grün · Spitzer blau · Radiergummi rosa · Schultasche+Tisch braun · Schere
orange) · R51 Reihenfolge der fünf Regel-Seiten · R44 stille Anker (Checkpoints ohne
Zeremonie — statt „ganz weg") · Teeter-Pose: das RAUS ist entschieden (R46), offen ist
allein, ob AAA-Balance-Zellen NEU bestellt werden · W2s Kriterien für den geprüften
Rayman-Referenzsatz (v1 wird ausgeführt, Koki ergänzt).

**Quelle:** Kokis Wortlaut-Transkript liegt der R5-Session bei (Scratchpad-Kopie; der
blinde Abdeckungs-Check lief gegen den Wortlaut). Screenshots: Kokis Aufnahmen vom
2026-08-10, 14:52–16:40.
