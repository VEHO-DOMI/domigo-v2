# FILED, NOT ACTED ON — die Welle 5 in einer Tabelle (Stand 2026-08-18, K5)

Acht Sessions haben die Welle 5 gebaut (**K4 · C4 · G4 · B4b · F6 · E6 · W4 · S1**) und je einen
Report geschrieben, zusammen 2 234 Zeilen. Was darin steht und **keine Bahn erledigt hat**, stand
danach nur noch in acht Dateien in der iCloud — dort liest es niemand wieder. Hier steht es einmal,
vollständig, mit Adresse.

**Quelle sind die Reports selbst** (`PLATFORM MASTER/SESSION-PROMPTS/REPORTS/`), **alle acht ganz
gelesen** — nicht nur die Abschnitte, die »Filed, not acted on« heißen.

**★ Warum diese Liste anders geerntet ist als ihre Vorgängerin.** Die Welle-4b-Liste hatte im
ersten Entwurf 41 Zeilen und erntete genau die gleichnamigen Abschnitte; ein blinder
Vollständigkeits-Prüfer fand **41 weitere** offene Posten außerhalb davon. Die Lehre steht als
**PB-90**, und **R131** hat sie zur Regel jeder Kanon-Runde gemacht: *jeder offene Posten, gleich
unter welcher Überschrift.* Diese Liste ist deshalb in fünf Teile geschnitten — **A** die
»Filed«-Abschnitte, **B** alles, was außerhalb davon offen ist (Fragen an den Architekten,
Empfehlungen, Abweichungen, Prosa), **C** was die Welle ausdrücklich NICHT geprüft hat, **D** was
die Kanon-Prüfung dieser Runde am Blatt gefunden hat, **E** was ein blinder
Vollständigkeits-Prüfer nachträglich gefunden hat — **und er hat wieder etwas gefunden** (zwölf
Posten, darunter Kokis drei älteste Tore; Teil E sagt es im Einzelnen).
**Zwei der acht Reports (G4 und B4b) haben überhaupt keinen »Filed«-Abschnitt** — ihre offenen
Posten stehen ausschließlich in Teil B. Genau das ist der Grund für die Regel.

**Wie die Spalte »Wohin« zu lesen ist.** Sie nennt den heutigen Stand, nicht den des Reports: wo
ein Ruling (R131–R152) den Posten entschieden hat, steht das Ruling; wo eine Bahn der Welle 6/6b
ihn übernimmt, steht die Bahn; wo die ursprüngliche Zuweisung **nicht** erledigt wurde, steht das
ausdrücklich dabei. **✓ heißt erledigt** — durch eine Bahn, durch ein Ruling oder in dieser Runde.
Eine bloße Schuld-Nummer ist **kein** ✓.

---

## A · Die »Filed«-Abschnitte von sechs der acht Reports

| # | Befund | Report | Wohin — Stand 2026-08-18 |
|---|---|---|---|
| 1 | Das Design-Blatt-Tor verbietet Wörter als nackte Teilkette (`schrei` traf `schreibt`) | K4 | **D-278** · **✓ erledigt (W4-Postzug)**: Regex mit Wortgrenze, Wortliste stand außerdem zweimal im Skript und steht jetzt einmal. **Die Klasse ist NICHT zu** — »Geist« verbietet weiterhin den Kanon-Begriff *Tinten-Geister* (doc 44 §1.6/§2) und ist in dieser Runde rot geworden → **D-424 · W5** |
| 2 | Zwei Code-Kommentare erzählen die Tot-Kunst-Reihe weiter mit 61 | K4 | **D-271** · **offen**, beide selbst nachgesehen: `check-paint-art.mjs` (Ratschen-Kommentar) und `perfBudget.ts` (`because`-Feld). Zugewiesen war **W4/E6**, keiner hat sie angefasst → **W5 / E7**. Die dritte Prosa-Stelle (`UNIFORM_SAMMELN_DESIGN.md`) ist eine datierte »war:«-Zeile und bleibt richtig so |
| 3 | Die Käfig-Zahlen des Blattes stimmen nicht mit dem Level (4 cage + 1 classmate + 6 drained) | K4 | **D-279** · **offen**. Zugewiesen war **B4b**; dort nicht angefasst → **B5** |
| 4 | Vier Design-Fragen des ch01-Blattes | K4 | **D-274 · D-275 · D-276** · **✓ als Tor-Vorlage gebaut (K5)**: `ch01.md` **§9**, je eine Frage + Beispiele + Empfehlung. **Entschieden ist nichts** — das Tor gehört Koki. **D-279** blieb bewusst draußen (Messung, keine Entscheidung) |
| 5 | Die annotierte Tot-Kunst-Liste ist der Stand vom 14.08. und gehört neu gemessen | K4 | `DEAD_ART_2026-08-14.md` · **offen** · Kunst-Bahn. Der Titel trägt seit dem Hotfix 53 / 36,2 MB; die **Liste** darunter ist unverändert vom 14.08. |
| 6 | `STORY_SPINE_CH01.md` — aus der Welle 4b kam nichts Neues hinein | K4 | **✓ geprüft, nichts zu tun.** Aus der Welle 5 ebenfalls nichts (K5 nachgesehen) |
| 7 | Die 55 offenen Posten der Welle 4b | K4 | `FILED_WELLE4B_2026-08-16.md` · dort einzeln adressiert (74 Zeilen) |
| 8 | `CardShell#freeCellsFor` hält `${name}_a` weiter als Literal (Klasse D-228) | C4 | **D-285** · **offen** · **D4** (Karten-Bahn, Welle 6b) |
| 9 | Perf-Tabelle vom Dev-Server ist zwischen Läufen nicht vergleichbar | C4 | **D-286** · **✓ beantwortet (E6/W4)**: `perf-visible.mjs` mit Kontroll-Abbruch, und die Streuungs-Warnung steht in `docs/PERF_WAECHTER.md` (**D-335**). Die Lehre ist **PB-92** |
| 10 | `obj-gluestick`-Hinweis nennt gar kein Farbwort (»der Uhu-Stick«) — vom neuen Tor erlaubt, C4 hält es für die bessere Form | C4 | **offen als Frage**, keine Schuldzeile · Copy-Bahn. Niemand hat sie seither aufgegriffen |
| 11 | **AQ12g** (Radiergummi heller) und **AQ15c** (Pennal-Fenster) waren nicht geliefert | C4 | **offen** · Codex. Stand 18.08.: beide **weiterhin nicht geliefert** (BOOT-SHEET). AQ15c blockiert außerdem die Insassen-Schicht (C4 §3) |
| 12 | Der von C3 gemeldete `shoot-world`-`overlay`-Defekt ist in C4s Runde nicht nachgeprüft worden | C4 | **✓ erledigt (W4)**: das Foto-Werkzeug fragte an drei Stellen die Spielschleife statt den Kartenzustand |
| 13 | Die Sammel-Buchstaben **S/C** haben fast keinen Kontrast zur Wand (zwei Panel-Prüfer, hohe Sicherheit) | F6 | **D-311** · **✓ zugewiesen (R138)**: eigene Bahn **L1**, Welle 6, Merge-Position 7 |
| 14 | Der ↑-Pfeil selbst ist weiß auf blassgelb (Verdeckung behoben, Kontrast nicht) | F6 | **D-312** · **L1** (R138, dieselbe Bahn) |
| 15 | Die übrigen Bodenzustände der Tafel (`sink`, `sad`, `settle`, `window`, `consoled`) sind von der Wisch-Klammer NICHT erfasst | F6 | **D-313** · **offen** · **H4** (Guardian-Bahn, Welle 6b) |
| 16 | `anim.ts` Guardian-Kommentar war doppelt geroutet (BOOT-SHEET an F6, Zeile liegt im Guardian-Tabu) | F6 | **D-317** · **✓ aufgelöst (R145)**: gehört **H4** |
| 17 | `artScope.ts`: der Regel-Seiten-Stem ist `:109`, nicht `:107` | F6 | **D-319** · **✓ aufgelöst (R145)**: die Rahmen-Karte der Welle 6 trägt `:109` |
| 18 | Der p4-Kartenfrost hält den Takt an, wenn man die Arena über den Debug-Griff fährt | F6 | **D-318** · **offen** · **W5**. W4 hat den `overlay`-Vergleich repariert, den Kartenfrost nicht |
| 19 | `measure-create.mjs` und `harvest-perf.mjs` messen unter Last Unsinn | F6 | **✓ erledigt (E6)**: `perf-visible.mjs` bricht unter 58 fps Kontrollrate ab — in E6s eigenem Lauf einmal wirklich passiert (52,7 fps) |
| 20 | `buildTerrain`: eine volle Gitter-Schleife, die fast jede Iteration verwirft, plus bis zu sieben weitere volle Gitter-Läufe | E6 | **D-323** · **✓ zugewiesen (R139)**: **E7** (Welle 6b) |
| 21 | `MassKit.rampUp`/`rampDown` bleiben Pflichtfelder, obwohl sie niemand mehr lädt | E6 | **D-324** · **A7** (R139) |
| 22 | D-118 (Sonden-Wettlauf) ist gemildert, nicht behoben | E6 | **D-327** · **offen** · E-Familie |
| 23 | `harvest-perf` / `perf-visible` / `measure-create` überschneiden sich stark; Zusammenlegen wäre eine eigene Runde | E6 | **✓ zugewiesen (R139)**: **W5** |
| 24 | Der graue Keil auf Kokis Bild `07.29.42` ist **nicht** `mass_ramp_up` — er bleibt unidentifiziert | E6 | **D-270** · **offen** · **Koki** (eine Frage beim nächsten Spielen; blind sucht man Stunden) |
| 25 | Die benannte Zeile für die Boss-Sonde konnte sie nicht tragen | W4 | **D-330** · **✓ geschlossen (W4)**, Lehre als **PB-107** und Ruling **R145** |
| 26 | Kanten-Kontrast der Tafel: **+41,1** gegen Ziel **+50** | W4 | **D-331** · **offen** · **H4** (R140). Erste echte Messung überhaupt — vorher war die Zahl gerechnet |
| 27 | Für das Größenverhältnis Kind/Tafel fehlt die Sonde am Kind | W4 | **D-332** · **offen** · **F7** (R140) |
| 28 | Die Bühne des Bosses läuft bei `--settle 240` über ihr Ende hinaus | W4 | **D-333** · **offen** · **H4** (R140) |
| 29 | Ein Prüfsatz, der eine verschobene Schwelle zudeckt | W4 | **D-334** · **✓ geschlossen (W4)**, Lehre als **PB-106** |
| 30 | Die Perf-Streuung zwischen zwei Läufen desselben Baums | W4 | **D-335** · **✓ dokumentiert** in `docs/PERF_WAECHTER.md` · Lehre **PB-92** · Ruling **R143** |
| 31 | K4s Verweis auf ein Symbol, das es nicht gibt | W4 | **D-336** · **✓ erledigt (W4-Postzug, ein Wort)** |
| 32 | Die Korrelations-Zahl bleibt am Anschlag ihres Suchbereichs — »eine Zahl am Anschlag ist keine Messung« | W4 | **D-337** · **offen** · **W5** |
| 33 | **ch01 vergibt die Faust nie**, obwohl vier Dokumente »ch01-mid« sagen | S1 | **D-422** (neu) · **B5** entscheidet · dokumentiert in doc 44 §4 ch01 (Fußnote) und doc 45 (Anhang). ⚠ **Die Prämisse war umgekehrt:** doc 44 sagt »none granted« — die vier stalen Stellen sind doc 31s Tabelle, `AUDIO_SPINE_CH01.md`, `prompts.ch01.json` und die Replay-Docs 35/37/38 |
| 34 | Der Torschluss hat kein eigenes SimEvent — zwei Klänge hängen an einem Toast-TEXT | S1 | **✓ zugewiesen (R141)**: Sim-Bahn der Welle 6. Bis dahin hält `check-audio` die Bindung maschinell · Lehre **PB-109** |
| 35 | `suspendAudio()` in `@domigo/game-feel` wird nirgends aufgerufen | S1 | **offen** · game-feel-Bahn (kein Malbuch-Code) |
| 36 | Zwei Ton-Schalter für ein Kind sind einer zu viel (`domigo:pb:audio:v1` AN · `domigo:feel:v1` AUS) | S1 | **Koki-Tor T13** · Empfehlung ja · gebaut von **S2** (R141) |
| 37 | Sprache (Aussprache, Figurenstimmen) — Pipeline ist kapitelfähig, Familie `voice` reserviert | S1 | **✓ zugewiesen (R129)**: eigene spätere Lane (WS-AU-TTS) |
| 38 | Haptik — game-feel hat sie, das Malbuch nicht | S1 | **offen** · eigene Entscheidung, kein Eigentümer |
| 39 | Die verdrehte Messvorschrift-Klammer stand wörtlich im Passover und wäre weitergewandert | S1 | **✓ korrigiert (R141)**: künftige Passover zitieren die AUDIO_SPINE-Fassung (`c3 ≥ 0,9·c1` **und** kein durchgehendes Absinken) |

---

## B · Alles Offene AUSSERHALB der »Filed«-Abschnitte (R131)

| # | Befund | Report · Fundstelle | Wohin — Stand 2026-08-18 |
|---|---|---|---|
| 40 | **G4 hat keinen »Filed«-Abschnitt** — seine sieben offenen Posten stehen unter »Für den Architekten« | G4 §8 | die Zeilen 41–47 |
| 41 | Die p9-Abstandsregel des Designs ist geometrisch unmöglich (44 Spalten, neun Teile à ≥ 6 brauchen 49) | G4 §8.1 | **✓ entschieden (R134)**: Regel = **≥ 4 in p9**, gebaut als `level.ts#CLOTH_P9_MIN_SEPARATION`. Prosa in doc 44 §4 ch01 (c) **✓ K5**; die Design-Blatt-Zeile in `UNIFORM_SAMMELN_DESIGN.md` gehört **G5** (nicht von K5 angefasst — abgesprochen) |
| 42 | `projector` konnte nicht eingelöst werden: kein Kleidungsstück, kein Sammelobjekt, keine Karte; die Ausnahme steht mit »Zuhause offen« | G4 §8.2 | **D-294** · **✓ entschieden (R148)**: aus dem ch01-Uniform-Anspruch **streichen**, Eigentümer **G5** (Welle 6, Position 3) |
| 43 | **AQ10b** präzise bestellbar (Hut rot · Rock braun · Socken weiß-schwarz · Schuh schwarz ohne Goldschnalle · Kontaktschatten/Fall-Winkel/gebrochene Symmetrie) | G4 §8.3 | **✓ bestellt und am 18.08. geliefert** → **G5** importiert nach blindem Prüfer in **zwei Größen** (R152) |
| 44 | Die Buchstaben-Präsenz ist der eigentliche AAA-Befund (2/5 gegen 5/5, zwei Kritiker) — Bestand, nicht G4s Bahn | G4 §8.4 | **D-311** · **L1** (R138). ⚠ G4 nennt `S` = RGB (240,186,52); die Farbe existiert im Repo **nicht** (`letters.ts` hat `#f7c93f` = 247,201,63) — es ist ein Messwert vom Schirm, kein Quellwert (Rahmen Welle 6). **★ Und das Buchstaben-Gold ist VIERFACH kopiert, nicht dreifach** (K5 selbst nachgesehen, für R146): `letters.ts` `#f7c93f` = Kanon · `PaintScene#PULL_COLOUR` `0xf7c93f` · die Prosa in `import-batch-aq10.mjs` `0xf0c040` (stale) · **und drei Ersatz-Texturen in `PaintScene#buildFallbackTextures` malen `0xf0c040`** — die vierte Stelle nennt der Rahmen der Welle 6 nicht |
| 45 | Ein echter Lauf-Seed für die Karten-Rotation braucht eine `PaintGameProps`-Prop und **bricht jedes Beweisband** — nicht gebaut | G4 §8.5 | **offen**, kein Eigentümer · Karten-Bahn. D-195 ist mit dem Pool-Schlüssel gelöst, der Zufall je Sitzung nicht |
| 46 | PERF-Vorher-Spalte fehlt in G4s Tabelle (ein zweiter Dev-Build war nicht drin) | G4 §8.6 | **✓ nachgeholt (W4-Postzug)**: der Nachher-Lauf der Welle steht mit gültiger Kontrollmessung |
| 47 | Pipeline-Fallen D-140…146: keine ist zugeschlagen (die Wortbank brauchte keinen Lauf) | G4 §8.7 | **✓ geprüft, nichts zu tun** |
| 48 | Sieben Dateien, die G4 anfassen musste, sind in der Eigentums-Karte **niemandem** zugewiesen (`game-tasks-variety-policy.json` · `serving.ts` · `tape.ts` · `PaintedIcons.tsx` · `u01-lexicon.json` · zwei Testdateien) | G4 §7 | **offen** · **Architekt**: die Rahmen-Karte der nächsten Welle sollte sie benennen, sonst ist jede Berührung wieder eine deklarierte Abweichung |
| 49 | Ein CI-**Re-Run** spielt die alte Ereignis-Nutzlast erneut ab und sieht den bearbeiteten PR-Text nicht — nur ein neuer Push löst einen Lauf mit neuem Text aus | G4 §9 | **offen als Werkzeug-Wissen** · **W5** (gehört in `CONTRIBUTING.md` oder das Perf-Dokument, beide nicht G4s) |
| 50 | **B4b hat keinen »Filed«-Abschnitt** — seine offenen Posten stehen unter »Für den Architekten« und »Was ich NICHT geprüft habe« | B4b | die Zeilen 51–57 |
| 51 | In p3 verschluckt die Unverwundbarkeit den Flieger ganz (Presse c47, Flieger c52 = 80 px gegen eine Schranke von 346) | B4b §4 | **D-300** · **Koki-Tor T10** (R136) · Empfehlung: in **B5** um ≥ 346 px versetzen; das p3-Band wird danach neu aufgenommen. p3 hat nur **eine** garantierte Karte — zu dünn |
| 52 | Der Rahmen nannte fünf Anker-Bereiche; gemessen tragen nur p1/p2/p3 ein `C` | B4b §3 | **✓ Rahmen-Korrektur (R135)** · das p9-`rows`-Tabu hat die Anker-Arbeit faktisch nicht eingeschränkt |
| 53 | Das echte **Spielgefühl** des 26-Tick-Kamera-Halts ist ein Urteil am Bildschirm | B4b §NICHT geprüft | **offen** · **Koki** (nichts zu bauen; die Zahl ist die Lebensdauer des Spritzers) |
| 54 | Merle im laufenden Spiel am Schirm — kein Bild von ihr beim Gehen | B4b §NICHT geprüft | **offen, geringfügig**: die Zone ist am Gitter und über 1200 Ticks in der Maschine geprüft; ein Bild fehlt |
| 55 | Die `?grid=1`-Bilder als Dateien: `shoot-world.mjs` baut seine URL fest ein und kann das Gitter nicht einschalten | B4b §NICHT geprüft | **offen** · **W5** (die Datei gehört der Werkzeug-Bahn) |
| 56 | Zwei Tore laufen auf dieser Maschine gar nicht (`pnpm content validate`, `check-paint-art` hängen beim Start) — Ursache sehr wahrscheinlich **Node v22.23.1 gegen die geforderte ≥ 24** | B4b §NICHT geprüft | **offen als Umgebungsschuld** · **W5** · beide laufen in CI, der Beweis ist ein unberührter Checkout mit identischem Verhalten |
| 57 | Produktion: alles lokal, Lehrer-Tür, kein Touch, kein Ton | B4b · F6 · E6 §NICHT geprüft | **offen** — gilt für die ganze Welle, siehe Teil C |
| 58 | AQ12d (rotes Buch) und AQ12f (braune Schultasche) gehen **zurück** — jede Zahl getroffen, das Gemalte verloren (Struktur −71 % / −25 %, 1 337 hartkantige Creme-Flicken) | C4 §1 | **✓ entschieden (R132)**, Nachbestellungen **AQ12d2 / AQ12f2** am 18.08. geliefert → **C5** (Position 2). **D-221** (Buch will rot) und **D-130** (Schultasche ohne sattes Braun) bleiben bis dahin **offen** |
| 59 | **AQ12c ist technisch kaputt**: kein Transparenz-Kanal, 41 192 magentafarbene Pixel als gemalte Fläche | C4 §1 | **offen/tot** · Codex-Bahn: die Bestands-Schablone im Importer hätte es gefangen — das Blatt ist nicht importierbar |
| 60 | Zwei Kartenflächen zeigen 614 bzw. 273 Pixel mit Median-Abweichung 1/255, verstreut auf Papierkorn und Zierrand — keiner Quellzeile zuzuordnen | C4 §4 | **offen, geringfügig** · Karten-/Kunst-Bahn. C4 nennt sie ausdrücklich, statt sie wegzulassen |
| 61 | Die Welle 5 bringt **keine neue Farbe** — das ist eine Wellen-Entscheidung, keine Bahn-Entscheidung | C4 §Fragen 2 | **✓ ratifiziert (R132)** und in doc 45 **H10** als Doktrin festgeschrieben |
| 62 | Der Anfall-Zähler: die Füllfeder kommt **einmal in 6000 Ticks** zum Schreiben; mehr ist ohne ein Feld, das eine Wende überlebt, nicht zu haben | F6 §7.1 | **D-310** · **✓ zugewiesen (R137/R151)**: `fitTick` an `EntityState`, Bahn **F7**, Test pinnt die Anfallzahl im ausgelieferten Level |
| 63 | **AQ16b** und **AQ15b-hop** — die zwei Bestell-Absätze mit Zahlen (Struktur-Energie ≥ 80 % des Bestands, ≥ 10 000 Farben; echte Aufsetz-Zelle, kein Fragment ≥ 20 px) | F6 §6 | **✓ bestellt und am 18.08. geliefert** → **F7** nach blindem Prüfer in zwei Größen (R150/R152). Bis zum Import bleibt `HOP_CELL = "joy"` |
| 64 | Die »halb wache« Käfig-Zelle ist ein zweites Auge über dem ersten (196 Bildpunkte) — **Rücknahme**, keine Nachbestellung | F6 §6 | **✓ entschieden (R137)**: wenn die Geste gewollt ist, gehört sie in eine eigene Zeichnung |
| 65 | Skit 4 (D-244): F6 empfahl »der Held winkt **Krakel selbst** zu«, weil `krakel_a` weiterhin gezeichnet werde | F6 §7.3 | **✓ widerlegt und ersetzt (K5, R137)**: `krakel_*` wird in ch01 **nirgends** gezeichnet (D-305) — neues Ziel ist ein **entfärbtes Ding**, Bild als Beweis |
| 66 | `create()` reißt die 100 ms in **allen fünf** Phasen (436–915 ms), auch nach der Reparatur | E6 §6 | **D-322** · **✓ ehrlich stehen gelassen (R139)**: Budget bleibt 100, der Ladebildschirm deckt es (Kokis Trade). Kein stiller Anstieg |
| 67 | Zwei Anti-Rezepte, gemessen und verworfen: der native `grayscale(1)`-Filter ist nicht bildpunktgleich · dieselbe Ein-Upload-Reparatur in `letterTex` ist ein 25- bis 60-facher Rückschritt | E6 §2 | **D-325 · D-326** · **✓ dokumentiert** (Kommentar an der Fundstelle, damit es niemand zweimal baut) · Lehre **PB-105** |
| 68 | Drei Zeilen in `PaintGame.tsx` und ein Kommentar knapp vor der eigenen Region — zwei deklarierte Abweichungen | E6 §Berührte Dateien | **✓ deklariert**, kein Konflikt eingetreten |
| 69 | Der Boss ist zum ersten Mal überhaupt **vermessen** worden — und die Rahmen-Anweisung hätte, wörtlich befolgt, toten Code erzeugt | W4 §6 | **✓ gebaut** · Lehre **PB-107**, Ruling **R145** |
| 70 | Neun geduldete Krusten-Kacheln (`SEAM_ALLOW`), unverändert, **Frist 30.09.** | W4-Postzug | **✓ geprüft, nicht still verlängert** · **A7** entscheidet bis **25.09.** (R147) |
| 71 | Der beauftragte Einzeiler an `harvest-perf` wurde **nicht** gemacht: die Diagnose war falsch (Chrome schreibt die Datei doch; Ursache = belegter fester Anschluss) | W4-Postzug | **D-338** · **✓ widerlegt und dokumentiert**; der Umbau hätte eine Sicherung zurückgenommen |
| 72 | Ein Perf-Lauf war Müll und steht trotzdem im Bericht (8199 statt 661 ms) — die **Kontrollmessung war blind** dagegen | W4-Postzug | **D-339** · **✓ als Falle aufgeschrieben (PB-93)**; im Perf-Dokument fehlt sie noch → **D-421 · S2/W5** |
| 73 | Die halbe Klang-Liste erreicht `sim.ts` nie: die Zuordnung läuft über **drei** Unionen (15 SimEvents + 8 PlayerEvents + 16 EntityEvents = 39 Arten) | S1 §B-1 | **✓ eingebaut**: jeder Stem trägt seine Anschlussstelle (`sim` · `entity` · `scene` · `shell`) — **S2** klemmt danach an |
| 74 | Ein Dutzend Effekte **kann** in ch01 nicht feuern (keine Faust, kein `powerup`, keine Feder/Ring/Eis-Glyphen) → `reserved`, keine Datei erzeugt | S1 §B-2 | **✓ so gebaut** (keine Bytes, keine toten Klänge, Pipeline bleibt kapitelfähig) |
| 75 | Die Lizenz hat eine zweite Grenze: **62 Musik-Minuten je Monat** (diese Runde ≈ 12) und »For Individual Use Only« bei ~110 Kindern | S1 §B-3 | **Koki-Tor T11** (R141) · Empfehlung: weiter, Plan beim nächsten Abo-Wechsel |
| 76 | `stamped()` kann im Browser nicht laufen (`node:fs`) → der sha1 wandert beim Mastern in ein generiertes `audioFiles.ts` | S1 §B-4 | **✓ deklarierte Abweichung**, gleiche Wirkung ohne Dateisystem |
| 77 | Die Hörbank wartet auf Kokis Ohr (208 Takes, Vorwahl mit Grund) | S1 §10 | **Koki-Tor T12** · blockiert nichts: ohne Antwort gilt S1s Vorwahl (R128) |
| 78 | Die CI-Toleranz für die Dauer musste von 0,02 s auf 0,08 s (drei MP3-Rahmen), weil derselbe Take auf Mac und ubuntu-latest verschieden lang misst | S1 §6 | **✓ mit der Messung als Begründung im Code** — die anderen Toleranzen waren richtig geraten, diese eine nicht |
| 79 | K4s eigene Einschränkung: die Kunst- und Farb-Urteile seiner Filed-Liste sind aus den Reports übernommen, **nicht nachgemessen** | K4 §5 | **offen als Vorbehalt** · Kunst-Bahnen. Gilt sinngemäß auch für diese Liste (siehe Teil C) |
| 80 | K4s zweite Einschränkung: über die sechs Reports der Welle 4b ist **keine dritte Runde** gedreht worden — »wer eine vierte Lücke sucht, sucht dort« | K4 §5 | **offen als Vorbehalt** · nächste Kanon-Runde |

---

## C · Was die Welle 5 ausdrücklich NICHT geprüft hat

| # | Was | Wer sagt es | Wohin |
|---|---|---|---|
| 81 | **Kokis Schirm.** Alle Zahlen dieser Welle stammen aus selbst gestarteten Browsern auf einer Entwickler-Maschine — kein echter Compositor, kein echtes Gerät | E6 · W4 · S1 · G4 · **F6** (»das echte 60-fps-Gefühl gehört Kokis Replay«) | **Koki** (R102: sein Perf-Lauf ist willkommen, nie Vorbedingung) |
| 82 | **Das Erstbild** schwankt in der Automatisierung stark (36–236 ms) und gehört auf einen echten Schirm | E6 · W4 | `docs/PERF_WAECHTER.md` §3 sagt es selbst |
| 83 | **Ein gedrosseltes Gerät** und die echte Vercel-Adresse | E6 | **offen** |
| 84 | **iPad-Verhalten** des Tons (Sperrbildschirm, Siri, `interrupted`-Resume, Entsperren per Berührung) | S1 §7 | **S2**, nur auf echtem Gerät prüfbar |
| 85 | **Wie es klingt.** Messwerte sind die Vorbedingung, nie der Ersatz | S1 §7 | **Koki** (R128, Hörbank = T12) |
| 86 | **Dass die Verdrahtung des Tons funktioniert** — das Modul hat in S1 keinen Aufrufer (Absicht, bewiesen: Bundle byte-identisch) | S1 §7 | **S2** |
| 87 | **Ein Live-Bild der Wisch-Klammer** — drei Anläufe, alle am Werkzeug gescheitert (Drei-Strikes ⇒ Stopp). Der Beweis ist Test + zwei Tamper | F6 §11 | **offen** · das Werkzeug-Hindernis ist Zeile 18 (**D-318**) |
| 88 | **Ein Live-Bild des Füllfeder-Anfalls** — 214 Aufnahmen über drei Läufe, kein Anfall darin (er liegt bei Tick 126, vor dem ersten Fenster) | F6 §11 | **F7** (mit `fitTick` wird er wiederholbar) |
| 89 | **Die Kunst- und Farb-Urteile dieser Liste** sind aus den Reports übernommen, nicht nachgemessen (Zeilen 43 · 58 · 59 · 60 · 63 · 64) | K5 | Kunst-Bahnen **C5 · G5 · F7** |
| 90 | **Nichts am Bildschirm in dieser Runde** — kein Rendering, kein Port, kein Bild. Der Perf-Wächter fordert hier keine Tabelle: kein überwachter Pfad ist berührt. **DEAD_ART 53 → 53** | K5 | — |

---

## D · Was der blinde Kanon-Leser dieser Runde zusätzlich gefunden hat

Nicht aus den acht Reports, sondern aus der Prüfung des nachgezogenen Kapitel-Blattes gegen den
Spielkanon und die **gebaute Welt**. Alle drei sind selbst nachgemessen (Skript über
`ch01.level.json`), keiner stand in einem Report.

| # | Befund | Wohin |
|---|---|---|
| 91 | **Die Bonustür von ch01 steht gebaut** — Raum `p9` mit neun Kleidungsstück-Wiederholungen, Bezahlstelle `p2-klecks` für acht Buchstaben. Am 17.08. war sie an fünf Stellen des Blattes gestrichen worden, weil doc 44 »Bonusbücher: 0« sagt — das zählt die BÜCHER | **D-426** · Blatt **✓ K5** (fünf Stellen, je mit »war:«-Zeile) · das Ökonomie-Modell (Uhr? Preis? Perfekt?) bleibt offen für **B5 / Karten-Bahn** |
| 92 | **Keiner der vier Posten der Design-Frage 1 ist gebaut** — null Ring-Glyphen über alle fünf Flächen, keine Rutschfläche, keine Sprung-Plattform. **D-274 behauptet das Gegenteil** und wurde in der ersten Fassung von §9 wörtlich übernommen | **D-425** · Blatt **✓ K5** · die D-274-Zeile gehört K4s Abschnitt → **Architekt** |
| 93 | **Die Käfig-Zahl ist fünf** (4 × `satchel` + 1 × `pencilcase`), dazu eine `classmate`-Entität und sechs `drained`. Doc 44 §2.3 sagt sieben, `ch01.md` §8 sagt »5 satchel cages«, **D-279 sagt vier** — alle drei falsch | **D-427** (mit **D-279**) · **B5**. Die Messung liegt bei, damit niemand zweimal zählt |

---

## E · Nachtrag nach dem blinden Vollständigkeits-Prüfer (dieselbe Prüfung, die die 4b-Liste zerlegt hat)

Ein frischer Prüfer bekam **die acht Reports selbst** und die Fassung dieser Liste mit 93 Zeilen
und eine Frage: *welcher offene Posten fehlt, gleich unter welcher Überschrift?* Er hat **zwölf**
gefunden — elf davon per Volltextsuche nachgewiesen (die Zeichenfolge kam in der Liste **null**
Mal vor), dazu eine widersprüchliche Zählung. Alle zwölf sind hier eingearbeitet, keiner
weggewogen. **Die größte Lücke war die peinlichste:** die Liste behauptete »bei Koki: 8« und führte
Kokis drei ÄLTESTE Tore nicht.

| # | Befund | Report · Fundstelle | Wohin — Stand 2026-08-18 |
|---|---|---|---|
| 94 | **T6 · die Kartenkante.** Vier Kritiker nennen unabhängig die UI-Flächen als Ursache, dass vier von sechs Kartenarten gegen das Referenzbild verlieren | K4 §3 | **offen · Koki.** Empfehlung: das Budget ins gemalte Karten-**Material** (Knopf, Plakette, Papier als Blätter). **Vor seinem Wort startet AQ17 nicht** — und die Karten-Bahn **D4** wartet darauf |
| 95 | **T7 · die Reihenfolge der fünf Regel-Seiten** — das einzige Tor der Welle 4, das offen blieb | K4 §3 | **offen · Koki.** Sagt er nichts, bleibt die heutige Reihenfolge (R51). Blockiert nichts |
| 96 | **T8 · wo die stillen Anker stehen** | K4 §3 | **✓ beantwortet und gebaut (B4b, Kokis Entscheid 17.08., R135)**: p1 `near` c43 · p2 `far` c58 · p3 `near` c29. In doc 44 §4 ch01 (a), `ch01.md` §5 und dem Dossier-README nachgezogen (**K5**) |
| 97 | **Eine Kanon-Zeile wurde inhaltlich geändert und wartete auf Bestätigung** (doc 44 §4 ch01: die Keen-Sechs → Verweis auf den ratifizierten Dossier-Override) | K4 §6 Frage 2 | **D-272** · **✓ bestätigt (R131)**. K4s Sorge war berechtigt: eine Kanon-Zeile, die eine Liste ersetzt, ist mehr als ein Nachtrag |
| 98 | **Acht PB-Nummern statt der beauftragten neun** (eine Doppelung bekam nur eine Verweiszeile) | K4 §6 Frage 1 | **✓ bestätigt (R131)** — und in dieser Runde siebenmal wiederholt (R70/R111) |
| 99 | **Zwei ausdrückliche Aufträge an Fable** aus K4s »Was als Nächstes passiert« | K4 §4 | (a) **die elf Rulings ohne Repo-Heimat** — diese Runde hat vierzehn der zweiundzwanzig neuen verortet und **acht** als heimatlos ausgewiesen; K3s/K4s elf bleiben, wo sie ausgewiesen sind · (b) **der Naht-Messfehler in Codex' eigener Prüfkette** (`build_and_validate.py` misst die Naht genau falsch — die Lücke, durch die AS5 ging; **D-264**, bewusst nicht im Lab repariert) → **Fable**, weiter offen |
| 100 | **Rahmen-Korrektur-Bitte:** `roamMinC/MaxC` liegen in `params`, nicht auf der Entity-Ebene — »bitte im Rahmen der nächsten Welle korrigieren« | B4b §Architekt 2 | **D-302** · **✓ erledigt (K5)**: doc 45 **G5** als Engine-Eigenschaft + Nachtrag im p2-Dossier; der Rahmen der Welle 6 trägt die Korrektur bereits |
| 101 | **»Als Absicht festschreiben, nicht bauen«** — B4bs eigentliche Empfehlung zu den fehlenden Steigungen war die Dokumentation, nicht das Löschen der Blätter | B4b §5 | **D-304** · **✓ erledigt (K5)**: doc 44 §4 ch01 (b) und `ch01.md` §5 nennen die Boden-Grammatik mit Begründung; erzwungen ist sie seit E6 durch das Rampen-Gesetz |
| 102 | **Wohin `check-colour-copy` langfristig gehört** — eigene Datei nur, weil W4 in derselben Welle das Farb-Tor besaß; »nach W4 als eigenes Kapitel hineinziehen« | C4 §Fragen 1 | **D-420** (neu) · **W5**. W4 ist gemergt — der Umzug ist damit **fällig** |
| 103 | **»Jedes Import-Urteil braucht beide Größen« sollte in den Rahmen** | C4 §Fragen 3 | **✓ erledigt (R133/R152)**: als **H9** in doc 45 (Prozess-Doktrin) und als Falle **PB-91** — nicht nur als Praxis zweier Bahnen |
| 104 | **Der Lese-Spiegel des Architekten stand auf einem alten Stand** (`d3a7eba`/#301 statt `origin/main`): drei Explore-Läufe lieferten Zeilen 60–90 daneben und eine Decke von 61 statt 53 | G4 §6.5 | **✓ als Falle aufgeschrieben**: Verweiszeile bei **PB-66** (»der Haupt-Clone ist nicht der Hauptstand«), erweitert auf **jede** Arbeitskopie, die man nicht selbst angelegt hat. Der Spiegel selbst steht heute auf `2562281` (**K5 nachgesehen**) |
| 105 | **Absolute Zahlen einer Sitzung sind nicht mit denen einer anderen vergleichbar** — nicht dasselbe wie die Streuung innerhalb eines Baums | E6 §7.1 | **offen als Vorbehalt** · gehört neben **D-335** ins Perf-Dokument (**D-421**, S2/W5) |
| 106 | **`lint` und `build` nicht lokal geprüft** — CI ist der Beweis, wenn eine Runde keinen Code anfasst | K4 §5 | **✓ gilt unverändert**, auch für diese Runde (Teil C) |

---

## Die Zahlen dieser Liste

* **Acht von acht Reports ganz gelesen** (K4 249 · C4 153 · G4 201 · B4b 304 · F6 228 · E6 345 ·
  W4 379 · S1 375 = **2 234 Zeilen**).
* **106 Posten** insgesamt: **39** aus den »Filed«-Abschnitten (Teil A), **41** von außerhalb
  (Teil B), **10** ausdrückliche Nicht-Prüfungen (Teil C), **3** aus der Kanon-Prüfung dieser
  Runde (Teil D), **13** aus dem blinden Vollständigkeits-Prüfer (Teil E).
* **Der Prüfer hat 12 von 13 selbst gefunden** — elf davon per Volltextsuche belegt (die
  Zeichenfolge stand **null** Mal in der Liste), dazu eine widersprüchliche Zählung. Ohne ihn
  fehlten in dieser Liste **Kokis drei älteste Tore**.
* **Zwei der acht Reports haben gar keinen »Filed«-Abschnitt** (G4, B4b) — ihre 16 offenen Posten
  stehen ausschließlich in Teil B. Wer nur geerntet hätte, was so heißt, hätte sie alle verloren.
* **51 Zeilen tragen ein ✓, 55 nicht** — beides ausgezählt, nicht geschätzt. Das ✓ ist dabei
  **kein einheitliches »fertig«**: es steht etwa zur Hälfte für *erledigt · geschlossen · gebaut ·
  korrigiert* und zur anderen Hälfte für *entschieden · zugewiesen · bestätigt · geprüft ·
  deklariert* — dort steht die Arbeit noch aus, sie hat nur eine Bahn. Wer nur die Haken zählt,
  überschätzt den Stand — deshalb steht in jeder Zelle das Verb dabei.
* **Ohne benannte SESSION: 6** (Zeilen 10 · 35 · 38 · 45 · 59 · 60) — fünf davon nennen eine
  grobe Kategorie (Copy-Bahn · game-feel-Bahn · Karten-Bahn · Codex-Bahn · Karten-/Kunst-Bahn),
  eine (38) gar nichts. *(Der Prüfer hat zu Recht beanstandet, dass »ohne Bahn« hier zuerst stand,
  während im Zellentext eine Bahn steht: eine Kategorie ist kein Eigentümer, aber sie ist auch
  nicht nichts.)* Das sind die Posten, die beim nächsten Wellen-Schnitt zuerst verloren gehen,
  weil niemand sie bootet.
* **Bei Koki: 10** — **T6** (Kartenkante) · **T7** (Regel-Seiten-Reihenfolge) · T10 (p3-Flieger) ·
  T11 (Lizenz) · T12 (Hörbank) · T13 (Dach-Schalter) · der graue Keil · das Spielgefühl des
  Kamera-Halts · sein Schirm (Perf) · sein Ohr (Klang). *(T6 und T7 fehlten in der Fassung vor dem
  Vollständigkeits-Prüfer — die Zahl stand auf 8 und war falsch.)* **T8 ist beantwortet.**
* **Ausdrückliche Vorbehalte dieser Liste: 3** (Zeilen 79 · 80 · 89) — Urteile, die aus den
  Reports übernommen und nicht nachgemessen sind.
