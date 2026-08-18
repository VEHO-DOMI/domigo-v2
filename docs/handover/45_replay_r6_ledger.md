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
  **★★ GEBAUT (D3a, 2026-08-15, PR #301).** Als gebaut: die Welt steht während einer
  Karte auf **14,5 % Luminanz**, der Tether bleibt. **★ BESTÄTIGT (Koki, 2026-08-15;
  Ruling R101): 14,5 % bleiben** — ein Kritiker wollte 25–35 % („die Welt ist nicht
  zurückgetreten, sie ist gelöscht"), Kokis Entscheid ist: fürs Erste so lassen und im
  Spiel nachsehen. **★ AUSNAHME (Ruling R89, zweiter Teil): schmale Bühnen dürfen bis
  12 % ausweichen** — mit der zentrierten Karte kann das fragende Wesen sonst teilweise
  hinter der Karte liegen.
  **★ OFFEN, mit Adresse (Ruling R89, erster Teil): die Antwort-Knöpfe stehen mit
  1,07 : 1 auf ihrem eigenen Papier** (`#fffaea` auf `#fff2cd`, D3a gemessen). Ziel
  **≥ 1,3 : 1**; der Fix gehört **D3b**, und die Schuld-Nummer vergibt D3b aus seinem
  eigenen Block (D-210…219) — hier steht sie deshalb ohne Nummer, aber nicht ohne
  Eigentümer. *(Zur Vermeidung eines alten Missverständnisses: „F-30" war die interne
  Fund-Nummer aus D3s Passover, kein Eintrag dieses Ledgers.)*
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
- **G3 · DAS KARTEN-MATERIAL — die Flächen ringsum verraten den Rechner.**
  *(neu 2026-08-17, K4; Ruling R112, entschieden 2026-08-16 nach D3bs Runde.)* Sechs blinde
  Kritiker haben je eine Kartenart Seite an Seite gegen dasselbe geprüfte Referenzbild
  gestellt. Zwei Karten gewinnen (Zeremonie, Bilanz). Vier verlieren — und **vier nennen
  unabhängig dieselbe Ursache**: die gemalten MOTIVE tragen, aber die UI-Flächen ringsum
  („identische Verlaufs-Kästen mit Standard-Schlagschatten, ohne Pinselspur"; „ein klar
  digitaler UI-Rahmen, der jede Illusion einer gemalten Spielwelt sofort bricht"). Das ist
  keine Geschmacksfrage mehr, sondern eine Konvergenz — und damit eine Bestellung, keine
  Meinung. **Entschieden:** Knopf, Plakette und Papierfläche werden **gemalte Blätter**
  statt CSS-Verläufe — Codex-Kommission **AQ17**, Import durch Lane **D4** (Welle 5b), und
  die Kartenkante kommt als Teil eines Rahmens mit. **Hängt an Kokis Tor T6** (Kartenkante:
  Tuschekante lassen · Wachskante einschalten · Budget ins Karten-Material — Empfehlung das
  Dritte); vor seiner Antwort wird AQ17 nicht gestartet. Der Kanten-Versuch aus D3bs Runde
  (AQ11, gemessen, eingebaut, nach drei Anläufen wieder abgeschaltet) ist der erste Schritt
  in dieselbe Richtung gewesen — er ist an der Lieferung gescheitert, nicht an der Idee.
  Schuld-Adresse: **D-218**.
- **G4 · `syncOverlay` kopiert die SKALIERUNG, nicht die Anzeigegröße.**
  *(neu 2026-08-17, K4; Ruling R107, dabei **R92 ausdrücklich zurückgezogen**.)* Eine
  Engine-Eigenschaft, an der in einer Woche zwei Sessions unabhängig hängengeblieben sind:
  die Leinwand eines Kunstblattes IST der Slot, in den es gezeichnet wird. Wer ein
  1024²-Blatt in einen kleinen Käfig hängt, bekommt es nicht klein, sondern falsch —
  C3 maß 47 px, D3b 47,4 px für dieselbe Figur, die 34 px hoch sein sollte. **Folge für
  jede Kunst-Bestellung: sie nennt das BESTANDSMASS des Blattes, das sie ersetzt, nie
  1024².** Schuld-Adressen: **D-211** (Messung D3b), **D-212** (Bestandsmaße). Die alte
  Fassung R92 („die Engine skaliert schon") ist damit zurückgezogen.
- **G5 · Ein Wert, den die Wesen-Schleife lesen soll, gehört in `params` — nicht auf die
  Entity-Ebene.** *(neu 2026-08-18, K5; Ruling R135, Befund B4b, Schuld-Adresse **D-302**.)*
  Die zweite Engine-Eigenschaft, an der ein Rahmen-Satz und der Code auseinanderliefen: der
  Rahmen der Welle 5 wies Merles Roam-Grenzen der Entity-Ebene zu (`EntitySpec`, `PaintEntity`).
  Dort erreichen sie die Logik nicht. `stepRedeemed` sieht ausschließlich `EntityState`, und das
  trägt `params` bereits mit; ein Feld auf der Entity-Ebene hätte zusätzlich ein neues
  `EntityState`-Feld gebraucht (der eine freie Platz der Welle war vergeben) **und** wäre am
  Loader verschwunden: `PaintEntity` ist ein geschlossenes `z.object`, das unbekannte Schlüssel
  still wegwirft. Gebaut ist deshalb `params.roamMinC` / `params.roamMaxC` — mit Präzedenz auf
  derselben Entity (`cage`, `hidden`). **Sanktioniert, nicht geduldet:** künftige Rahmen und
  Dossier-Prosa nennen `params`, und wer einen Wert an die Entity-Ebene hängen will, prüft
  vorher, ob die Funktion, die ihn lesen soll, überhaupt dorthin sieht. Das Versprechen »sie
  fällt nicht« hängt weiter am Gitter: die gemalten Zahlen ersetzen die Konstante, nicht die
  Boden-Prüfung (Test: gemalt zehn Kacheln, getragen drei — der Boden gewinnt).

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
- **H5 · Der Ring der Arena — dreimal von blinden Prüfern verlangt, jetzt bestellt.**
  *(neu 2026-08-17, K4; Ruling R113.)* Zwei Runden am Wächter (H2 mit vier Kritikern, H3 mit
  sechs) haben unabhängig dieselbe dritte Forderung gestellt: der **Arena-Raum** braucht eine
  Kompositions-Runde — die dreißig Stühle stehen im Raum verteilt, statt den Ring zu bilden,
  in dem ein Boss-Kampf stattfindet. Das ist keine Engine-Frage und keine Farbfrage, sondern
  ein **Hintergrund-Blatt**: Codex-Kommission **AQ13c** (Stühle an die Wand), Import durch
  Lane **H4** (Welle 5b). Ausdrücklich **NICHT** Teil von AQ13b — das ist die
  Kontrast-Nachbestellung der Tafel (ihre Fläche liegt 1,4 Helligkeitsstufen von der Tür
  hinter ihr, ihr Rahmen 2 Grad vom Braun der Stühle; Ziel 50). Zwei Bestellungen, zwei
  Ursachen, zwei Blätter — wer sie zusammenlegt, bekommt keine von beiden.
- **H6 · Eine datierte Ausnahme bindet sich an den REPARATURPFAD, nie an einen Merge.**
  *(neu 2026-08-17, K4; Ruling R106.)* Der Naht-Wächter der Welle 4b duldete neun
  Krusten-Kacheln „bis A6b gemergt hat" — A6b hat sie dann nicht repariert (die gelieferte
  Quelle blutet selbst, kein Schnitt hilft), und die Ausnahme wäre an ihrem Stichtag ohne
  Zutun rot geworden. **Regel:** jede geduldete Ausnahme nennt die **Kommission und die
  Import-Bahn**, die sie beendet, plus einen Stichtag, und steht als Pflicht mit Eigentümer
  dort, wo Koki liest. **Heute offen: bis 2026-09-30 muss AS5b importiert sein (Lane A7)** —
  an diesem einen Tag laufen DREI Ausnahmen zugleich ab (`SEAM_ALLOW` im Naht-Wächter,
  `COHERENCE_WAIVERS` im Kompositions-Tor, `PLACEHOLDER_UNTIL` in der Komposition). Wird die
  Lieferung gerissen, braucht es einen ausdrücklichen Verlängerungs-Beschluss mit Grund —
  nie eine stille Anhebung.
  **★ Amendment 2026-08-18 (K5; Ruling R147) — der Beschluss bekommt sein eigenes, FRÜHERES
  Datum.** Ein Stichtag allein hilft nicht, wenn die Entscheidung erst am Stichtag fällt: am
  30.09. laufen drei Ausnahmen gleichzeitig ab, und ein `main`, das an einem Mittwoch von
  selbst rot wird, ist niemandes Arbeit. Deshalb entscheidet **Lane A7 bis zum 25.09.** —
  entweder ist importiert, was AS5b/AS5c bestehen, oder alle drei Ausnahmen werden **auf den
  2026-11-30 verlängert**, deklariert und datiert, mit dem Satz »AS5c bestellt am <Datum>,
  Lieferschein-Prüfung ausstehend« und A7 als Eigentümer. Der Zwischenstand vom 18.08.:
  AS5bs zweite Fassung ist geliefert, `import-batch-as.mjs --verify` sagt weiter **6/84**, die
  Krusten sind ungeprüft. Die vierte datierte Ausnahme desselben Tages ist seit dem Post-Zug
  die Zeilennummern-Liste des Register-Tors (`check-registers.mjs#LINE_REF_ALLOW`, Eigentümer
  »K4 / Kanon-Bahn«) — sie hat denselben Stichtag und denselben Mechanismus.
- **H7 · Die Pergament-Regel des Farb-Tors bleibt — und die zweite Unterscheidung baut das
  Tor, nicht die Bahn.** *(neu 2026-08-17, K4; Ruling R114.)* Das Farb-Tor verwirft Pixel
  unter einer Farbkraft-Schwelle als „Pergament" (Grundierung), damit die Papierfarbe nicht
  als Motivfarbe zählt. Es kann damit ein absichtlich gedecktes Farbfeld nicht von der
  Grundierung unterscheiden — eine echte Lücke, aber **die Regel bleibt**, weil sie an neun
  Bestandsblättern hergeleitet und dort richtig ist. Zwei Folgen: **(1) jede Kunst-Bestellung
  trägt ihre Zielzahl** (C3 hat es vorgemacht: AQ12d verlangt Farbkraft ≥ 0,53, nachdem 90 %
  der roten Masse des Vorgängers unter die Schwelle fiel). **(2) Die zweite Unterscheidung —
  der Flächenanteil eines zusammenhängenden Farbfelds — baut die Werkzeug-Bahn (W4), nie die
  Bahn, deren Kunst gerade passieren soll.** Wer sein eigenes Tor weicher macht, damit sein
  Blatt durchkommt, hat kein Tor mehr. Schuld-Adresse: **D-220**.
- **H8 · Was eine Kanon-Runde einsammelt: jeden offenen Posten, gleich unter welcher
  Überschrift.** *(neu 2026-08-18, K5; Ruling R131.)* Die »Filed«-Liste einer Welle ist die
  einzige Stelle, an der ein Befund überlebt, den keine Bahn erledigt hat — danach steht er nur
  noch in einem Report in der iCloud. Ihr erster Entwurf für die Welle 4b hatte 41 Zeilen und
  erntete genau die Abschnitte, die »Filed, not acted on« heißen; ein blinder
  Vollständigkeits-Prüfer fand **41 weitere** offene Posten, fast alle außerhalb dieser
  Abschnitte — eine ganze Kunst-Bestellung, zwei ausdrücklich »NICHT ausgeführt« gemeldete
  Aufträge, vier verlorene Kritiker-Verdikte, eine halbierte Messung —, dazu zwölf verzerrte
  Zeilen und vier falsche Zählungen. **Regel für jede K-Runde:** die Reports werden GANZ
  gelesen, gesucht wird auch unter »nicht verifiziert«, »als Nächstes«, »Frage an den
  Architekten«, »Empfehlung« und in der Prosa, und die Liste geht durch einen blinden
  Vollständigkeits-Prüfer, der die **Reports selbst** bekommt, nie die Zusammenfassung. Und:
  **eine Adresse ist keine Erledigung** — eine Schuld-Nummer zu vergeben schließt nichts.
  (Falle **PB-90**.)
- **H9 · Ein Import-Urteil braucht ZWEI Größen.** *(neu 2026-08-18, K5; Rulings R133 · R152,
  Befund C4.)* Ein Kunstblatt wird zweimal beurteilt, von verschiedenen frischen Prüfern:
  **(1)** am 3- bis 6-fach vergrößerten AUSSCHNITT — das ist die Größe, an der Handwerk
  sichtbar ist und an der eine Runde einen zerhackten Gitterstab übersehen hat, weil sie das
  ganze Blatt statt eines Ausschnitts ansah; **(2)** in der **echten Anzeigegröße** (die Karte
  zeichnet ein Blatt 132 Punkte hoch) — das ist die Größe, in der entschieden wird, ob das Kind
  den Befund überhaupt sieht. Ein Befund, der bei 5× vernichtend ist, kann hier unsichtbar sein;
  dann wäre »zurück« die falsche Entscheidung. Wer nur eine Größe misst, entscheidet entweder
  über unsichtbare Fehler oder übersieht sichtbare. **Gilt für jede Codex-Lieferung**, ohne
  Ausnahme, vor jedem Import (R91/R110 unverändert: der blinde Blatt-Prüfer löst den
  DRAFT-Marker des Lieferscheins auf).
- **H10 · Eine Rückgabe ist eine Bestellung — im selben Review, mit Zahlen.** *(neu
  2026-08-18, K5; Ruling R132; Kokis Codex-Offensive vom 18.08. schreibt es fort.)* Die Welle 5
  hat zwei Blätter zurückgeschickt, die **jede bestellte Zahl trafen** und dabei das Gemalte
  verloren (Buchdeckel: lokale Struktur 10,0 → 2,95, −71 %; Stoff: 1 337 unveränderte
  Creme-Pixel mit achsparallelen Kanten). Das ist »Wahrheit vor Varietät« plus AAA — und es ist
  richtig, aber es ist eine **Wellen-Entscheidung**: die Welle bringt dann keine neue Farbe.
  Damit das kein Verlust ist, gilt: **jede Rückgabe bekommt ihre Nachbestellung mit den
  gemessenen Zahlen im selben Review** (AQ12d2: Struktur ≥ 8,0 · 0 kühle Restpixel · S·V ≥ 0,53;
  AQ12f2: 0 unveränderte Creme-Pixel im Stoffkörper · Körnung · S·V ≥ 0,53 — die gelieferten
  0,525 lagen DARUNTER, die Prosa »jede Zahl getroffen« war falsch). Und die Zahl muss das
  Material messen, nicht die Farbe: eine Rekolorierung, die die Helligkeits-Modulation des
  Bestands zerstört, erfüllt jede Farbvorgabe und ist trotzdem eine Posterisierung
  (AQ16: eindeutige Farben −95 %/−98 %, Struktur-Energie −69 %/−82 %).
- **H11 · Eine benannte Zeile ist eine Hypothese, bis der Kontrollfluss sie bestätigt.**
  *(neu 2026-08-18, K5; Ruling R145, Befunde G4 · W4 · F6, Familie **P-67**.)* Vier Zeilen-
  Angaben der Welle-5-Passover trafen den richtigen Bereich und die falsche Konstruktion:
  eine Aufruf-Zeile lag IN einer Schleife (sie wäre je Eintrag einmal gelaufen), eine
  Methoden-Einfügung mitten im Doc-Kommentar der nächsten Funktion, ein Kommentar-Auftrag im
  Tabu-Block einer fremden Bahn — und die benannte Zeile für die Boss-Sonde lag in einem Zweig,
  **in den der Boss per Konstruktion nie läuft**: wörtlich befolgt wäre der Auftrag als
  »erledigt« abgehakt worden, ohne dass je ein Kasten gemessen worden wäre. **Regel:** wer eine
  Zeile zugewiesen bekommt, öffnet sie am Code und prüft, ob der Kontrollfluss dort ankommt;
  wer eine Zeile zuweist, nennt zusätzlich das Symbol. Zeilen wandern, Symbole nicht —
  deshalb verlangt das Register-Tor `datei#symbol` und verbietet `datei` + Doppelpunkt + Zahl.

---

## Anhang · Asset-Bedarfs-Kandidaten (R5 schreibt die Prompts; nichts davon blockiert)

Regel-Seiten-Schatz-Design (Pickup + Voll-Ansicht) · Plattform-Kanten-Kit (gegen B2) ·
Rampe (B3) · Stachel-Ersatz, lesbar (B4) · Farbvarianten der Objekt-Wesen (B9) ·
Motten-Schwarm-Zellen (B10) · Allianz-/Versammlungs-Visuals (D7) · Naive-Design-
Kartenhaut (G2, nach Richtungs-Entscheid) · Boss-Drop-Miniaturen (F4) ·
„Klappernder-Deckel"-Zustandszellen u. ä. Karten-Fiktion-in-Welt-Zellen (B12).

## Anhang · Offene Kanon-Widersprüche (K5, 2026-08-18 — dokumentiert, nicht entschieden)

- **Die Faust in ch01: das Gebaute und der Kanon sind einig, vier zweite Hände sind es nicht.**
  *(Ruling R141, Befund S1; entschieden wird in Lane **B5**, nicht hier.)* `ch01.level.json`
  gibt `"abilities": ["jump","run"]` und enthält kein `powerup`-Entity; `entities.ts` sagt es
  selbst (»opens a cage in a chapter with **no fist**«); doc 44 §4 ch01 sagt »none granted«.
  Weiter »ch01-mid« sagen: doc 31s Fähigkeiten-Tabelle (die Zeile `| thrown fist | ch01 mid |`,
  obwohl doc 31s eigener Amendment-Kopf sie zurückzieht) · `AUDIO_SPINE_CH01.md` in der Spalte
  »Frei ab« · `docs/audio/prompts.ch01.json` in vier `unlockedIn`-Feldern · die Replay-Docs
  35/37/38 mit »a cage the fist can open« (historisch, dürfen so bleiben). **Die Frage, die
  offen ist:** bekommt ch01 den Mittel-Kapitel-Zuwachs zurück (dann braucht das Level ein
  `powerup`-Entity und der Käfig-Hinweis sein Verb), oder werden die vier Stellen auf ch02
  nachgezogen? Fußnote mit derselben Liste steht in doc 44 §4 ch01. *(Der Auftrag dieser Runde
  nannte den Widerspruch andersherum — »doc 44 sagt ch01-mid« —; die Liste oben ist am Code und
  an den Dateien nachgemessen.)*

## Anhang · Kokis offene Tore aus dieser Runde

D6 Namens-Runde · ~~D8 Bonusbücher-Ruling~~ (entschieden 2026-08-15, R53) · ~~G1
Engagement-Modus-Richtung~~ (entschieden 2026-08-15, R52) · (aus #249
fortbestehend: F22/G10-Klammer · 3 zählbare Räder · Timeout-Kosten · E6/M5/S4-Uhren ·
Boss-Memory-Uhr · Lehrerin-Kanon + Boss-Swap-Vetos).

**★ Stand der nummerierten Tore am 2026-08-18 (K5, aus dem BOOT-SHEET nachgeführt — hier steht,
was offen ist; die Frage im Wortlaut steht dort):**

| Tor | Worum es geht | Stand |
|---|---|---|
| **T6** | Kartenkante: Tuschekante lassen · Wachskante einschalten · Budget ins Karten-Material (Empf. das Dritte) | **offen** — AQ17 startet erst danach (G3) |
| **T7** | Reihenfolge der fünf Regel-Seiten | **offen** — Schweigen heißt: die heutige bleibt |
| **T8** | wo die stillen Anker stehen | **✓ beantwortet und gebaut** (p1 near c43 · p2 far c58 · p3 near c29; doc 44 §4 ch01 (a)) |
| **T9** | C4-Buch: rot-flach jetzt einbauen oder Bestand blau bis AQ12d2? | **offen**, Empf. Bestand — hinfällig, sobald AQ12d2 besteht |
| **T10** | p3-Flieger (D-300): 80 px hinter der Presse gegen eine Schranke von 346 | **offen** (R136), Empf. versetzen in Lane B5; das p3-Band wird danach neu aufgenommen |
| **T11** | ElevenLabs-Lizenz »For Individual Use Only« bei ~110 Kindern | **offen** (R141), Empf. weiter, Plan beim nächsten Abo-Wechsel; die echte Schranke ist die 62-Minuten-Monatsgrenze, nicht das Guthaben |
| **T12** | Hörbank hören (~20 min) | **offen** — blockiert nichts; ohne Antwort gilt S1s Vorwahl |
| **T13** | ein Dach-Schalter für allen Ton | **offen** (R141), Empf. ja, gebaut von Lane S2 — die zwei internen Schlüssel bleiben |
| — | der graue Keil auf `07.29.42` (**D-270**) | **offen** — braucht Kokis Finger, keine weitere Analyse (dass er kein Rampen-Blatt ist, hat E6 bewiesen) |

**Neu aus Welle 4 (2026-08-15) — fünf Tore, Empfehlungen im BOOT-SHEET:** ~~R41 Farb-Palette
(die Ziel-Palette für die Codex-Bestellung AQ12: Buch rot · Uhu-Stick orange · Füllfeder
gelb · Heft grün · Spitzer blau · Radiergummi rosa · Schultasche+Tisch braun · Schere
orange)~~ · R51 Reihenfolge der fünf Regel-Seiten · ~~R44 stille Anker (Checkpoints ohne
Zeremonie — statt „ganz weg")~~ · ~~Teeter-Pose: das RAUS ist entschieden (R46), offen ist
allein, ob AAA-Balance-Zellen NEU bestellt werden~~ · W2s Kriterien für den geprüften
Rayman-Referenzsatz (v1 wird ausgeführt, Koki ergänzt).

**★ Vier davon sind zu, eines steht noch offen (Stand 2026-08-15 abends, Rulings R67–R103):**

* **Teeter/Balance — ZU (Ruling R68): NICHT nachbestellen.** Der Grund ist Material, nicht
  Geschmack: W2s geprüfter Referenzsatz enthält **kein einziges Rayman-Balance-Bild**, die
  Auftrags-Voraussetzung („Rayman hat Balance-Zellen") war also falsch. Ein Vorbild, das es
  nicht gibt, kann man nicht treffen. Das RAUS aus R46 bleibt; drei Tore, die dieselbe
  Frage stellten (W2-Tor 3 = F5-Tor 4 = Boot-Sheet-Tor 4), sind damit **ein** geschlossenes.
* **Farb-Palette — ZU (Ruling R79): AQ12 ist neu zugeschnitten.** Importiert werden **Buch
  rot · Radiergummi rosa · Stift gelb**; das **Heft NICHT** (es war schon grün), der
  **Spitzer bleibt blau**. Nachgeschoben als **AQ12b** (Füllfeder als echte Füllfeder,
  Schultasche braun) und **AQ12c** (die Schultasche des p3-Crushers hat einen eigenen
  Blatt-Namen). Wer die Farbe einer Karte ändert, ändert das Blatt zuerst — die Karte folgt
  dem gemessenen Blatt (R41).
* **Stille Anker — ZU (Rulings R44 · R83):** Checkpoints sind stille Anker, und zwar in
  **allen** Kapiteln; das Gesetz steht ab jetzt in doc 44 **§1.11**. Die **Neu-Platzierung**
  der Anker ist ausdrücklich NICHT mitentschieden — sie bleibt ein Gespräch mit Koki.
* **Regel-Seiten — ZU an der Zahl (Ruling R98): fünf bleiben fünf**, die Plural-Seite wird
  nicht geteilt (eine sechste nur, wenn Koki es nach dem Spielen will → I2b, eigener PR).
  **Offen bleibt allein die REIHENFOLGE der fünf Seiten (R51)** — das ist das eine Tor
  dieses Blocks, das noch auf dich wartet.
* **Regel-Seiten-Kontrast — ZU als Bestellung (Ruling R85):** der Kontrast-Loop steht bei
  Strike 3, und der Grund ist Material, nicht Code — also **AQ16** („Regel-Seite in
  gesättigter, kühler Eigenfarbe") statt einer vierten Glow-Runde. Merles Roam-Felder und
  die Sims-Frage gehen in Welle 5; der Anfall gilt für **beide** Läufer (Bleistift p1,
  Füllfeder p2).

**Quelle:** Kokis Wortlaut-Transkript liegt der R5-Session bei (Scratchpad-Kopie; der
blinde Abdeckungs-Check lief gegen den Wortlaut). Screenshots: Kokis Aufnahmen vom
2026-08-10, 14:52–16:40.
