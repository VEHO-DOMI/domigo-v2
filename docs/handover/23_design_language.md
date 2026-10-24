# 23 · The DomiGo Design Language — D-1 (Fable-authored, mockup-gated)

*Fable 5, 2026-07-13. Mockup-Gate **BESTANDEN**: Kalibrier-Exemplar cgo-106, Kokis Freigabe cgo-107 am 08.10.2026, 13:05 (»looks fire«, Fragen 1–5 ja). Die W1-Implementierung cgo-108 ist CODEX DRAFT — NOT CANON bis GG-Review und Merge. Source of truth: `design-study-og-trainers.md` (same folder — the full
source extraction of all four OG trainers: verbatim hexes, ladders, XP economy) + my eyes-on
tour (2nd-grade landing, inside the 4th-grade app) + the v2 inventory (globals.css:84-105
accent-only theming; unused leaderboard tokens :53-63; hidden `user_progress.xp`;
`paintPlayerSprite(seed)`).*

**The thesis:** the OG trainers already ARE a design system — one codebase re-skinned by a
~30-token sheet per grade. v2 ported the four accent hexes and stopped. D-1 finishes the
port: the FULL token sheet per grade, the OG's dark "aurora glass" as v2's dark mode, the
proven XP/title machinery on v2's primitives, and one new layer the OG never had — a
**master identity** for the all-grades surfaces. Student-friendly and fancy, never generic:
every choice below traces to a thing his kids already loved.

---

## 1 · Token architecture (mechanism unchanged, coverage completed)

Keep v2's `[data-grade]` cascade exactly as-is; expand each grade block from ~6 overrides to
the full sheet (from the study, verbatim where possible):

- **Light theme per grade:** pastel-wash page bg (OG: accent at ~6% over warm white), white
  cards `--radius-lg: 24px`, controls `--radius: 16px`, gradient primary buttons
  (accent→accent-deep 135° + glow + inner highlight, hover-lift 2px), 3px gradient strip
  atop profile/hero cards, accent-soft tinted chips.
- **Dark theme per grade (the OG signature, currently absent in v2):** fixed 3-ellipse
  radial **aurora** in the grade hue over near-black, cards = accent-tinted glass
  (`backdrop-filter: blur(20px)`, low-alpha borders); g3/g4 get the amber "embers" accents.
  v2 has `.dark` tokens but NO toggle — **D-2 adds the ThemeToggle (v1 has one to port) +
  per-device persistence via the existing game-feel store pattern.**
- **Grade hues stay canon:** g1 `#16a34a` · g2 `#dc2626` · g3 `#2563eb` · g4 `#7c3aed`.
  Wordmark gradients per OG: g1/g2 monochrome accent; **g3/g4 end in gold `#d4943a`.**
- **Grade personality beyond hue** (from the study §12, folded into surface copy + texture):
  g1 German-first, soft/gentle (storybook motif carried from the hub skin) · g2 warm cream
  accents (`#FFF8F0`), burnt-orange for "wrong" (never collides with the red accent) ·
  g3 dark-first studio/episodes energy · g4 dark-first journal/portal energy.

## 2 · The MASTER identity (new — the all-grades layer Koki asked for)

For surfaces that belong to no grade (landing, /signin, /join, /admin, checkup print views):
**derive from the wordmark itself** — the blue→gold spectrum (`#2563eb → #d4943a`) that
already IS the brand's only cross-grade artifact. Neutral slate inks, warm-white surfaces,
the gradient reserved for the wordmark + one primary action per screen; admin gets the
calmest treatment (editorial: more whitespace, no glow). This makes shared pages feel like
DomiGo without feeling like any one grade — and the moment you enter a grade context,
`[data-grade]` takes over.

## 3 · XP, levels, titles (adopt the proven machinery, v2-native)

- **Curve: OG verbatim** — L1 0 → L20 30,000 (50/120/220/350/500/700/950/1250/1600/2000/
  2700/3500/5000/6500/8000/11000/15000/20000/30000) + 5 prestige tiers to 120,000 (⭐).
  Zones bronze/silver/gold/diamond/prestige — **v2's dead tokens `globals.css:53-63` finally
  light up** on level pills.
- **Four ladders, mapped to primitives v2 already tracks:** vocab (`user_progress.xp`) ·
  grammar (`grammar_xp`) · **overall = sum** (First Steps → English GOAT) · **class ladder**
  (collective, Study Group → World Class) = the weekly-goal surface.
- **Title ladders: keep BOTH registers** — g1 gets the gentle ladder (Wordling → Word
  Collector → … → Grandmaster), g2–4 the gamer ladder (Spell Rookie, Letter Looter, Vocab
  Raider, Grammar Ghost, Vocab Titan, Grandmaster) with the vibe lines ("just spawned in").
- **Economy: OG XP_TABLE adopted** — typed 7–10 XP, MC 3–5, combo tiers to 3× (g1 gentler
  2/4/7), perfect-session +20, day-streak bonus min(streak,7)×5. Wire into the existing
  `xpForTier`/`recordAttempt` path. **Checkups/mocks/assignments stay 0 XP (unchanged —
  test integrity).**
- **Where it shows:** home profile card (see §5), session-end screens (already show
  per-session XP — gain a level-progress bar), the hub.

### Übungsmodi · W2 (cgo-109, CODEX DRAFT — NOT CANON)

Die fünf Original-Modi verwenden die Jahrgangsfarben und Hell-/Dunkelwerte aus W1:
Flashcards mit Richtungswahl, großer Wendekarte, Wischgesten und zwei Knöpfen;
Memory mit vier Spalten, EN-/DE-Karten, Zug- und Zeitzähler; Spelling mit
Buchstabenfeldern, gemischten Kacheln, festen Phrasenteilen und Hinweis;
Word Hunt mit Chapter-Frage, Wortkacheln und Rundenergebnis; Speed mit
60-Sekunden-Balken, Übersetzungsfeld und Ergebnis der beantworteten Wörter.

Entscheidungen mit Original-Beleg (`design-study-og-trainers.md` §6 und
Labor `cgo-106/og/<grade>/index.html`):

- Memory: 8/12/10/12 Paare in Jahrgang 1/2/3/4, bei kleinerem freigegebenem
  Wortbestand entsprechend weniger. Acht entsprechen dem aktuellen
  `1st/startMemoryMatchRound`; 12/10/12 dem ausdrücklichen W2-Auftrag und §6.
  Die aktuellen Originaldateien begrenzen auch Jahrgang 2–4 auf acht;
  hier hat die beauftragte Paarzahl Vorrang. Fehlpaare zählen als Zug,
  nur gefundene Paare als Wortversuch, wie im Original.
- Spelling: bis 18 Wörter laut W2-Auftrag/§6 (aktueller 4th-Quelltext: 15).
  Die Engine liefert die festen Phrasenteile (`to/a/an/the`, Klammern,
  `sth./sb.`); die eingegebenen Buchstaben werden unverändert zur vollständigen
  Antwort zusammengesetzt. Der bestehende Server-Grader entscheidet auch
  über Tippfehler. Ein Textfeld ergänzt die Original-Kacheln für Tastaturbedienung.
- Word Hunt: acht Runden mit 8–10 Wörtern. Der v2-Wortbestand besitzt kein
  Themenfeld, deshalb Chapters statt erfundener Themen; mindestens zwei
  ausgewählte Chapters mit genügend verfügbaren Wörtern sind nötig.
  Auswahl wird gesammelt und dann geprüft, entsprechend dem W2-Mehrfachauswahlauftrag.
  Die Fragen werden nach dem Reservefilter gebaut. **Nachzug 1:** Nur angetippte
  Zielwörter buchen einen Versuch gegen genau ihr eigenes Item. Tarnwörter
  tragen keine Speicherreferenz und geben ausschließlich sichtbares Falsch-Feedback;
  nicht angetippte Zielwörter bleiben ungebucht. Beleg: Im Original markiert
  `2nd/wordHuntFinishRound` ausgelassene Wörter nur als `missed`, ohne Wortversuch.
  So verändert eine Chapter-Fehlwahl keinen fremden Leitner-Eintrag (Gesetz 6).
- Flashcards: Selbstauskunft „Got it“ sendet die freigegebene richtige Antwort,
  „Again“ eine leere Antwort. Beide verwenden dieselbe Leitner-Queue,
  Flashcards serverseitig 0 XP. „Again“ wird mit dem vorhandenen Abstand der
  ersten Box nach zehn Minuten fällig. Jede Karte kommt einmal pro Lauf.
- Speed: Wie `2nd/startSpeedRound` übernimmt die Zeitrunde die gewählte
  Aufgabenart (Satzlücke, Definition, beide Übersetzungsrichtungen). Mix
  durchläuft alle vier; laufender Punktestand zählt bestätigte richtige Antworten.
  Die Erste-Buchstabe-Hilfe setzt `hintUsed`, ohne lokalen Punkteabzug.
  Start erst auf Knopfdruck, mit signierter und an das Kind gebundener
  Serverzeit. Ab 60 Sekunden werden auch verzögerte Offline-Antworten abgewiesen.
  Die bestehende Outbox bewahrt unbestätigte Antworten weiter auf; eine
  gesonderte Bereinigung abgelaufener Versuche liegt außerhalb dieses Zauns.
- Punkte: Nur bestätigte Serverantworten werden summiert. **Original-Abweichung,
  Koki-Ruling (GG 09.10.):** Paar-/Tempo-/Streak-Boni, Spelling-Hinweis-Halbierung und Speed-Hinweis-Abzug
  fehlen in W2. Die Hinweise versprechen deshalb die bestehenden 10–30 XP
  für eine richtige Antwort; Flashcards 0. Kein Speed-Demon-Badge (W7).

Die Modus-Wahl folgt der Original-Reihenfolge (Full, Sprint, Speed, MC,
Flashcards, Memory, Spelling, Word Hunt), danach der bestehenden Grammatik-
und Story-Kachel. Die Verknüpfung zum Wörterbuch heißt dort
„Dictionary & Flashcards“. Die Startseiten-Kachel bleibt wegen des W2-Zauns
unverändert. Die zusätzliche Grammar-Memory-Variante des 1st-Originals ist
nicht Teil dieser fünf Vokabelmodi.

## 4 · Leaderboard (Koki-gated: yes, teacher-toggleable)

**W4 · CODEX DRAFT — NOT CANON, in Prüfung (cgo-111).** Kokis Urteil vom 08.10.: A nur eigene Klasse; B nur Klassen desselben Jahrgangs, deren Lehrkräfte jeweils zugestimmt haben. Die eigene Klasse braucht selbst B, bevor sie fremde freigegebene Klassen sieht. Testklassen und archivierte Klassen sind ausgeschlossen.

Wochen-XP beginnen Montag 00:00 Europe/Vienna; Woche ist Standard, Gesamt ist umschaltbar. Beide Werte kommen aus bestätigten Lernleistungen; Gesamt = Vocab-XP + Grammar-XP einschließlich Lehrkraft-Gutschriften aus user_progress; Woche = nur bewertete Versuche. Zuweisungen einschließlich Check-ups geben 0 XP und sind zusätzlich aus der Wochen-Summe ausgeschlossen. Tabs: Meine Klasse / Alle Klassen (nur bei B und vorhandenen fremden Klassenzeilen) / Wochenziel. Jahrgang 1 deutsch, 2–4 englisch. Wochenziel: 5.000 Klassen-XP, darunter die kollektive Klassen-Leiter aus Original §3e. Die eigene Tages-Challenge bleibt ein separater Abschnitt; Battle folgt W5, Badges W7 oder eigener Karte.

Zeile: Medaille/Rang · Avatar 34 px · Vorname (Spitzname; keine doppelte Ausgabe bei Gleichheit) · farbige Titel-Pille mit Prestige-Sternen · Klassen-Chip in B · eigener Pfeil und .me · bestätigte XP. Aktive Lernserie wird angezeigt. Die Gesamt-Leiter auf Fortschritt verwendet `overallLevelFor` unverändert aus levels.ts.

Zwei Schalter auf der Lehrer-Klassenseite: Bestenliste in der Klasse und Jahrgangs-Bestenliste. **Beide standardmäßig AUS** (0023); die eingefrorene Datenschutzseite wird separat vom GG korrigiert, bevor Koki Klassen freigibt. B öffnet vorher einen widerrufbaren, beidseitigen Datenaustausch erklärenden Dialog. A aus widerruft B. Testklassen gesperrt; Großmeister-Fremdübersicht nur lesend. AUS zeigt einen ruhigen Hinweis, die Home-Kachel bleibt erreichbar. Vorschau: nur Beispiel 1–5 in Jahrgang 1, Example 1–5 in 2–4, keine Kinderlesung und kein Schreibweg.

Nachzug 2 (GG-Entscheid): Nur angemeldete Kinder (`claimed_at` gesetzt), erster Vorname plus Spitzname; Nutzer-Kennungen werden serverseitig durch laufende Zeilennummern ersetzt. Titel-Pille aus Vokabel-XP wie auf der Spielerkarte. Tages-Challenge zählt unterschiedliche Wörter, maximal zehn. Störungen heißen „gerade nicht erreichbar“. Profil bleibt als dritte Startseiten-Kachel erhalten. Dialog benennt Lern-Serie und Klassenname; Wechsel zur Testklasse widerruft A/B.

## 5 · Avatars & unlockables (v2's own trick beats the OG's 50 PNGs)

The OG shipped 50 avatar PNGs, class-unique. v2 already has something better: the
**per-student procedural sprite** (`paintPlayerSprite(seed)`) — every child already owns a
unique character that walks through G1's world. D-4 promotes it to THE identity:
- Profile avatar = the sprite rendered in the OG composition (circular 64px, accent halo,
  gradient ring at prestige).
- **Unlockables = seeded accessories + palettes** at level milestones (L3 cap, L5 palette
  pack, L8 companion pixel-pet, L12 background scene, prestige = golden outline …) —
  deterministic from (seed, unlocked-set), zero image assets, and the same sprite appears
  in-game and on the leaderboard. Perks beyond cosmetics: streak shield (1/week, keeps a
  missed day), hub confetti, custom vibe line at L10 (from a curated list — level-gate holds).
- Storage: one additive jsonb on `user_progress` (`cosmetics`), teacher never manages it.

## 6 · D-3 · Student preview (the spec — closes the session-collision pain)

Teacher-session, zero impersonation: a `?preview=<studentId|anon>` mode on student routes,
honored ONLY when the session role is teacher AND the student belongs to their class
(server-checked). Renders the real student components read-only with a fixed top banner
("👁 Schüler-Vorschau — nichts wird gespeichert"): attempts POST disabled at the API by the
same check (server refuses writes in preview → zero rows, verifiable). Entry points:
every class roster row ("Ansehen als…"), every assignment/checkup card ("Als Schüler
ansehen"), the builder (upgrade the static outline to the REAL task-ui render). No session
switching, no second cookie, teacher stays signed in.

## 7 · Scope fences (so D-2..4 stay shippable)

**Word Duel + Battle history: gebaut, IN PRÜFUNG (cgo-112, CODEX DRAFT — NOT CANON).**
W5 übernimmt die volle Home-Karte unter Dictionary/Story, Gegnerwahl, Zug-Pillen,
fünf Rundenzeilen, vier vertikale Antwortoptionen und die Ergebnis-Emojis 🏆/🤝/💪
aus der Originalstudie §5b/5d. Stats und Verlauf liegen zusammen im Arena-Hub.
Fünf Runden × drei Fragen folgen dem Kartenbrief und der Design-Studie §5b.
Der lesende Original-Snapshot aller vier Jahrgänge fordert dagegen fünf Fragen
je Runde an (`onDuelUnitPicked`); `generateDuelQuestions` begrenzt auf den
verfügbaren Bestand. Beleg 4th: Zeilen 9046 und 9317–9320, Abschluss nach fünf
Runden in Zeile 9228. Das ergibt im Snapshot maximal 25 richtige Antworten; W5
behält gemäß Auftrag maximal 15. Studie und Quelltext sind hier nicht identisch.
Jahrgang 1 deutsche Führung, 2–4 englisch; sichtbare Gliederung Chapter.
Bestenlisten-Schalter A öffnet Arena nur innerhalb der eigenen Klasse; Vorschau
zeigt ausschließlich Beispiele. Original-Boni (2nd–4th: 100/50/25 plus
8 × Treffer; 1st eigene Abschlussbuchung: 200/100/50 plus 20 × Treffer,
Gegnerbuchung weiterhin 100/50/25 plus 8 × Treffer) entfallen: XP nur aus bewerteten Antworten, Siege nur Statistik. Grammatik-Duell
benannt verschoben. Eine zusätzliche Tabelle 0024, noch nicht angewendet.

**Arena-Transaktionen (Nachzug 1):** Die erste interaktive Datenbanktransaktion
der Plattform läuft ausschließlich im Arena-Pfad: Duell anlegen, Runde öffnen
und `duel:`-Antwort in `/api/attempts`. Eine Transaktion speichert die betroffenen
Änderungen gemeinsam oder nimmt sie bei einem Fehler vollständig zurück. Dafür
öffnet der vorhandene Neon-WebSocket-Client eine Verbindung je Anfrage; andere
Antwortmodi und Leser bleiben beim HTTP-Zugriff. Verbindungsnamen sind
`DATABASE_URL` und ersatzweise `POSTGRES_URL`; Werte werden nicht ausgegeben.
Kaltstart-Kosten ≈ ein Verbindungsaufbau je Zug, zusätzlich zur normalen
Abfragearbeit; keine Latenz- oder Preiszahl wurde gemessen. Alle drei Schreibrouten
tragen ausdrücklich `export const runtime = "nodejs"`. `finally` schließt den
Client nach Erfolg oder Fehler/Rücknahme; reale Neon-Verbindung und Betrieb
bleiben bis zur GG-/Koki-Abnahme ungetestet.

**Nachzug 2 (PR 511):** Aufgabenkennungen bleiben im Server, weil ihr Wortende
häufig die Übersetzung verrät. Eine offene Frage liefert ausschließlich
`{round, question, prompt, options}`. Duell-Antworten müssen `itemId` weglassen;
ein mitgesendetes Feld wird mit 400 abgelehnt. Die Bewertungsroute löst die
Kennung aus den Duell-Koordinaten auf und prüft Zug, Option und Klassenreserve;
beim Speichern erfolgt die zweite Prüfung unter `FOR UPDATE` (Zeilensperre).
Der vorhandene deutsche Korpustext bleibt unverändert, auch bei Lehnwörtern,
deren deutsche und englische Schreibweise übereinstimmt.
Offene Partien werden vollständig und getrennt von der abgeschlossenen Historie geladen,
damit 50 neuere Ergebnisse keinen noch offenen Zug verdrängen. Die historische
Listenabfrage lädt höchstens 50 Partien, der sichtbare Verlauf zeigt höchstens 20;
die einzelne Detailabfrage lädt höchstens eine Partie.
Eine gesonderte Datenbankaggregation hält Played/Won/Win rate/XP über die gesamte
berechtigte Historie vollständig. Lesen und Neuanlegen speichern den Ablauf
nach sieben Tagen. Ausgetretene oder wieder unangemeldete Teilnehmer lassen
auch bereits abgeschlossene betroffene Partien ohne Sieger ablaufen; sie sind
bis zur erneuten Klassenzugehörigkeit weiterhin unsichtbar. Die Ablaufmeldung
nennt deshalb nur den fehlenden Sieger, keinen ungesicherten Ablaufgrund.
Fehler im Arena-Pfad werden ausschließlich als `[arena] read_failed`,
`[arena] write_failed` oder `[arena] connection_error` protokolliert. Der
Verbindungs-Client hat einen Fehler-Listener, damit ein asynchroner Fehler
nicht als unbehandeltes Ereignis den Prozess beendet. Lokale Tests prüfen die
Kennungsfreiheit über alle 57 Einheiten/2.446 Vokabeln, tatsächliche SQL-Sperren,
Antwortverteilung, beide Löschrichtungen und die Klassen-/Modus-/Art-Bindung.

**F7-Nachprüfung 23.10. (PR 511):** Die Arena verwendet benannte lokale Größen-
und Farbrollen auf dem gemeinsamen Heft-Raster. Links und Schaltflächen sind
mindestens 44 × 44 Pixel groß; kleine Texte und Statusmarkierungen verwenden
kontraststarke Farben. `pnpm check:arena-a11y --out /absoluter/belegordner`
kompiliert die aktuellen Styles und stellt die tatsächlichen Komponenten mit
synthetischen Beispielen in vier Jahrgängen, neun Zuständen, zwei Breiten und
zwei Themen dar. `--selftest` prüft zusätzlich absichtlich verletzte Grenzen.
Das ist eine lokale Darstellungsprüfung, kein angemeldetes End-to-End-Duell.

**Live Battle und Class Quiz = eigene künftige Spur**, Ruling cgo-120 zu Kosten
und Echtzeit-Betrieb noch offen. Keine Kachel und kein Ankündigungssatz auf der
Kinderseite. Der ursprüngliche Sammelaufschub der Arena gilt damit nur noch für
diese synchronen Teile; Word Duel benötigt keine Echtzeit-Infrastruktur.
28-badge system bleibt später (W7/eigene Karte). Andere Flächen behalten ihren
jeweils dokumentierten Prüf-/Freigabestand.

## 8 · The mockup gate (next Fable session — the D-1 exit)

Per Koki's standing amendment (SRDP skins): **full conviction per mockup, every disclosure
implemented.** Deliverables: 5 rendered HTML mockups — g1/g2 light (their register), g3/g4
dark-aurora (theirs), master (signin + admin header) — each showing: home with profile card
(sprite avatar, dual XP bars, title pill, streak), one practice card, the leaderboard, and
the grade wordmark treatment. Gate = Koki's verdict on the mockups; then D-2 implements
token-sheet-first (one PR: tokens + toggle), then surface waves, each screenshot-checked
against its mockup (10A).

## 9 · Execution order (inside the approved amendment-d plan)

D-1 mockups (Fable, next session) → **mockup gate** → D-2 tokens+dark-mode+toggle (Opus) →
D-2 surface waves (Opus, per grade) → D-3 preview (Opus) → D-4 XP/titles/leaderboard/
cosmetics (Opus; one additive migration) — all interleaved with the C-1→B-2 lanes per the
plan. Every wave: standing gate + screenshot-vs-mockup + the no-second-grader / 0-XP-tests /
level-gate invariants re-asserted in tests.

### Grammar Mode · OG-Parität W3 (cgo-110, in Prüfung)

`/modi/grammar` nutzt die Trainerfläche mit den vorhandenen vier Jahrgangsakzenten und Hell/Dunkel. Die Reihenfolge ist Chapter → Struktur → Format oder Mix → Runde → Ergebnis. Namen kommen aus dem Struktur-Katalog (`loadUnitStructures`, `nameDe` in Jahrgang 1, sonst `name`); ein fehlender Name wird als Chapter-Nummer plus vorhandener Schlüssel angezeigt. Angeboten werden ausschließlich Formate mit verfügbaren, nicht reservierten Aufgaben. Zehn Aufgaben bilden eine Runde; die Originalauswahl bietet dafür „Sprint (10 random)“.

Alle 13 vorhandenen Grammatikformate verwenden die bestehende Bewertung über `/api/attempts`, Modus `grammar`. Jede abgegebene Antwort erreicht diese Bewertung, auch Wiederholungsversuche. Die Anzeige summiert ausschließlich bestätigte XP. Hinweise und Erklärungen stammen unverändert aus den Aufgaben; nach dem zweiten Fehler erscheint der Hinweis, nach dem dritten die Auflösung. Die Vorschau bewertet ohne Schreibanfrage und speichert auch keinen Gerätemodus.

Nachzug 1: Worterklärungen sind vor dem Hinweis nur sichtbar, wenn ihr Wort im Aufgabentext vorkommt oder die Aufgabe eine Übersetzung ist. Dadurch verraten unaufgeforderte Lösungswörter nicht vorzeitig die Antwort. Gewählte Struktur-Kacheln verwenden für Titel und Aufgabenanzahl dunkle Schrift auf dem Jahrgangsakzent; alle acht Kombinationen aus Jahrgang und Hell/Dunkel halten mindestens 4,5:1 Kontrast. Verhaltensprüfungen sichern Abgabe, Memory-Zuordnung, Reserve/Jahrgang, Hinweis-/Erklärungszeitpunkt, Umschalter und bestätigte Ergebniszähler.

Grammar Memory Match ist nur in Jahrgang 1 verfügbar. Die Themenwahl bietet vorhandene `matching-pairs`-Aufgaben mit zwei bis acht eindeutigen Paaren. Karten aufdecken, A und B zuordnen, dann den vollständigen Satz gemeinsam prüfen: Diese Anpassung wahrt die vorhandene Alles-oder-nichts-Bewertung des Formats. Keine erfundenen Formen-Paare, kein lokales Richtig/Falsch und keine lokalen Punkte. Der Vocab/Grammar-Umschalter merkt ausschließlich die Moduswahl pro Jahrgang auf dem Gerät; die Grammatik-Leiter bleibt die vorhandene `levels.ts`-Leiter mit dem Jahrgangsregister.


### Activity Game · OG-Parität W6 (cgo-113, CODEX DRAFT — NOT CANON, in Prüfung)

`/activity` übernimmt den Gruppenablauf aus den eingefrorenen `og/<grade>/activity/index.html`-Originalen: Einrichtung → Gruppenwechsel/Punktetafel → Wortkarte mit Zeitmesser → Rundenrückblick → Endstand. Home zeigt die volle Activity-Karte vor Battle Arena. Zwei bis acht Gruppen, 30/60/90 Sekunden, 3/5/8 oder unbegrenzte Runden, Draw/Show/Explain einzeln oder gemischt, Chapter-Auswahl, Richtig/Weiter, letzte Antwort zurücknehmen und vollständige Runde zurücknehmen. Gleichstand wird nach den Originalregeln Punkte → richtige Wörter → wenigste übersprungene Wörter aufgelöst; gleiche Datensätze teilen denselben Rang.

Die 2.435 Zuordnungen in `lib/activity/categories.json` stammen aus den vier Original-Wortlisten (Quellprüfsummen in der Datei), verknüpft über Jahrgang, Chapter und unverändertes Wort. Angezeigt werden die aktuellen freigegebenen Wörter/Übersetzungen, nach Klassenreserve gefiltert. Doppelte Wörter pro Chapter werden zusammengefasst: 777/603/599/442 eindeutige Wörter in Jahrgang 1/2/3/4 vor Reserve. Elf Einträge ohne passende Originalzuordnung bleiben aus; neue oder geänderte Wörter werden nicht automatisch kategorisiert. Reserveausfall schließt die Seite; Vorschau liest nur den lokalen Korpus, keine Klasse oder Datenbank.

Alle Gruppennamen, Antworten, Spielstände und Einstellungen bleiben ausschließlich im Arbeitsspeicher des geöffneten Bildschirms. Anders als das Original kein gespeicherter Verlauf, keine Browserablage und kein Spiel-Schreibweg; eine neue Sitzung beginnt leer. Gruppenpunkte und optionaler +1-Zeitbonus sind nur Spielpunkte und berühren keine XP, Lernversuche, Rangliste oder Kinderstatistik. Der Zeitbonus verlangt tatsächlich alle übrigen Wörter richtig vor Ablauf; reines Überspringen erhält ihn nicht. Ein Runden-Neustart nimmt auch deren Wortverbrauch zurück, statt Wörter ohne Punkte verschwinden zu lassen. Der Timer verwendet eine feste Frist statt heruntergezählter Intervalle; Hintergrund-Tabs verlängern die Runde nicht.

Jahrgang 1 hat deutsche Führung, 2–4 englische. Bestehende Trainerpaletten/Schriften, benannte Activity-Gestaltungswerte, 44-Pixel-Bedienziele, Hell/Dunkel. Rücksetz-/Enddialoge sind native modale Dialoge mit Abbrechen, Escape und Fokusführung. Lokale Töne sind abschaltbar; fehlende Audiofreigabe blockiert das Spiel nicht. Kein neuer Server, keine Migration, keine Fremddaten.

`check:activity-display` bündelt die tatsächlichen React-Komponenten isoliert und bedient sie im Browser mit synthetischen Daten. Es prüft vollständige Gruppenrunden, Timer/Rücknahme, Speicherfreiheit, Text-/Bedienkontrast und Größen in 128 Ansichten (vier Jahrgänge, zwei Breiten, zwei Themen, acht Zustände). Der Selbsttest injiziert Größen-, Farb- und Tokenfehler; beide Läufe sind in CI verdrahtet. Bilder prüfen keine echte Anmeldung, Live-Klassenreserve nach Laden oder formale Screenreader-Konformität. Produktionsabnahme bleibt beim GG.

Activity-Nachzug aus unabhängiger Prüfung (PR 512): Jahrgangslinks der Lehrervorschau erhalten ebenfalls 44×44-Ziele und sichtbaren Tastaturfokus. Der Messlauf enthält Preview-Setup für alle 16 Jahrgang/Breite/Theme-Kombinationen (insgesamt 144 Ansichten); Verkleinerung dieser Links ist eine eigene Fehlerprobe. Der Activity-Tokenwächter prüft auch Werte abgeleiteter Variablen; nur die sechs benannten Grundwerte für Haarlinie und Schriftmaß sind explizit erlaubte Literale, Farben und abgeleitete Maße kommen weiter aus gemeinsamen Variablen. Die Statusseite bleibt im vorhandenen Format »In Prüfung, noch nicht LIVE«; Entwurfskennzeichnung steht in der externen Codex-Abgabe.

Linux-Browsernachweis: Im hellen Jahrgang-3-Aufbau erreichte der 90-s-Rand zunächst nur 2,888:1. Activity nutzt deshalb den vorhandenen Textsekundärwert direkt statt einer aufgehellten 70%-Mischung für Ränder. Schwellen und Messpunkte bleiben gleich; der Dialog erhält margin:auto gegen den globalen Null-Margin-Grundstil.

### Jahrgangsregister · W7 (cgo-114, Teilstand in Prüfung)

Die Trainerhülle startet Jahrgang 1/2 hell und 3/4 dunkel, unabhängig vom Betriebssystem. Jahrgang 1 erhält Deutsch/English mit Deutsch als Anfangssprache. Die Wahl gilt für Home, Moduswahl, die fünf neuen Vokabelmodi, Grammar Mode, Fortschritt, Bestenliste, Profil, Arena und Activity. Jahrgang 2 behält das Übergangsregister mit „Karteikarten“, 3/4 bleiben englisch. Sprach- und Darstellungswahl bleiben nur im Speicher der geöffneten Anwendung; sie überleben deren interne Navigation, keinen vollständigen Neustart. Keine neue Browserablage, Anfrage, Lernpunktequelle oder Inhaltsübersetzung. Kapitelwörter und Bewertungsregeln bleiben unverändert.

`home/trainer.css` verwendet die bestehenden Jahrgangspaletten und benannte Maße. Lesetexte erhalten einen dunkleren beziehungsweise helleren Vordergrund, kleine Navigationsziele mindestens 44×44. Hauptaktionen behalten den Akzent→Akzent-tief-Verlauf mit einer aus der Textfarbe abgeleiteten Kontrastkorrektur. Die fünf ursprünglichen Bronze-/Silber-/Gold-/Diamant-/Prestige-Verläufe bleiben einzeln erhalten; eine aus dem Seitenhintergrund abgeleitete Tönung macht ihre Schrift lesbar. Level/Zone und Fortschrittsbalken bleiben bestehen. Die sichtbare Kontrastkorrektur ist ein Abnahmegegenstand, keine behauptete neue Designfreigabe.

`check:trainer-display` ruft die tatsächlichen vier Serverseiten mit ausschließlich synthetischen externen Daten auf und montiert deren echte React-Komponenten im Browser. Die Moduswahl wird nicht als nachgebauter Bildschirm geprüft. Vier Jahrgänge × zwei Breiten × zwei Darstellungen ergeben 64 Ansichten je Persona; die zweite Sprache in Jahrgang 1 ergänzt je 16. Vorschau und synthetisch angemeldeter Nutzer ergeben zusammen 160 Ansichten, einschließlich Abmelden und Tagesfortschritt. Acht separate Fünf-Rang-Proben prüfen alle Zonen in jedem Jahrgang und beiden Darstellungen. Der Lauf prüft Texte, Sprachwechsel über Komponentenwechsel, die jahrgangsweisen Startdarstellungen, Überlauf, Zielgrößen, Sprachschalter-Ränder und benannte neue Gestaltungswerte. `--baseline <externer Ordner>` vergleicht Bildmaße und Pixel; maximal 3/255 je Farbkanal toleriert Browser-Rundung, keine Positionsverschiebung. Der Selbsttest verkleinert unter anderem den Abmeldeknopf, entfernt Hauptaktions-/Rangverläufe und verändert Textfarbe, freie Gestaltungswerte und eine Position um einen Pixel. Er läuft wie die normale Prüfung in CI. Vergleichsbilder werden außerhalb des Repos abgelegt. Der erneute lokale Vergleich des Kandidaten ist noch nicht als stabile Referenz freigegeben: 153/160 Bilder identisch innerhalb der 3/255-Toleranz, sieben Bilder mit jeweils 1–13 abweichenden Pixeln (überwiegend gekrümmter Avatar-Rand; gleiche Zielmaße). Die Prüfung meldet diese Unterschiede weiterhin rot; keine höhere Toleranz und kein CI-Baseline-Bestehen behauptet. Die Activity-Messung berücksichtigt nun sichtbare Bedienelemente und Dokumentkoordinaten nach Scrollen; geschlossene Dialogknöpfe dürfen keine falschen Kontrastproben bei Position 0,0 erzeugen.

Quellenabgleich für §8 der ursprünglichen Studie:

| Achse | Stand / maßgebliche Quelle |
|---|---|
| Heller/dunkler Start | W7 wie §8; eingefrorenes Oktober-Original von Jahrgang 3 startet dagegen hell. Die Abweichung wird nicht als Original-Gleichheit bezeichnet. |
| UI-Sprache | W7 für die oben genannten Trainerflächen; die älteren eigenständigen Seiten Practice/Dictionary/Review und die gemeinsame Aufgabenanzeige sind noch nicht vollständig zweisprachig. |
| Vokabel-Leiter und Grammatik-Level 1 | Vorhandene `levels.ts`-Register bleiben: sanfte Leiter in Jahrgang 1, Gamer-Leiter in 2–4, Rule Rookie/Rule Noob. |
| Combo-Schwellen / XP-Multiplikatoren | Kein Wiederaufbau. Der GG-Entscheid vom 09.10. 01:05 ordnet Original-Boni ausdrücklich hinter das eine serverseitige Bewertungsgehirn ein. Eine gewünschte Änderung braucht die separate Bonusentscheidung; W7 bucht keine Punkte. |
| Geschichten | Aktueller Freigabeschalter und veröffentlichte v2-Geschichten bleiben maßgeblich; die alten §8-Kampagnen werden nicht zurückgebracht. |
| Memory / Spelling | W2-Auftrag und die obige Abweichungstabelle bleiben maßgeblich: 8/12/10/12 Paare, Grammatik-Memory nur Jahrgang 1, vorhandene Jahrgangstexte, bis 18 Spelling-Runden. |
| Tagline / Wortmarke / Aurora | Vorhandene Größen und Jahrgangsverläufe bleiben. W7 korrigiert Textkontrast, keine neue Wortmarke. |
| Schulzeile | In v2 weiterhin nicht vorhanden. Die Marken-/Kopfzeilen sind laut Dauerauftrag kein freier Änderungsbereich. |
| Battle-Modal | Word Duel aus W5 und dessen Paletten; Live Battle/Class Quiz bleibt eigene Karte cgo-123. |
| Daily-Tönung | Vorhandene v2-Jahrgangstönung bleibt; die orange/amberfarbene §8-Fläche ist nicht pixelidentisch übernommen. |
| Schwierigkeitssprache | Vorhandene Jahrgang-3-Phrasen-/Jahrgang-4-B1-Texte; Aufgaben und Niveau nicht geändert. |

**Noch kein Abschluss von W7/V-1/GO-1.** Die vier isolierten Seiten sind eine reproduzierbare Vergleichsbasis, kein Vergleich mit Produktion und keine vollständige V-1-Routenmatrix. Der Blueprint nennt zusätzlich Practice, Learn, Review, Assignments, Admin, Sign-in und eine Spielhülle sowie eine echte Testkonten-/Anmeldematrix. Dafür müssen GG und Koki freigegebene synthetische Testkonten, den konkreten ausgelieferten Stand und die Baseline-Abnahme bereitstellen; Codex greift nicht auf reale Kinderlisten zu. Die Vier-Personas-Abnahme bleibt eine konkrete Folgearbeit mit Koki. Die ältere Sprachführung, noch offene visuelle §8-Abweichungen und Badges werden separat auf dem Board weitergeführt, nicht als durch diese Prüfung erledigt gezählt.


### W7-Fortsetzung · cgo-129 (Teilstand in Prüfung)

Die ältere Sprachlücke oben wird für Practice, Dictionary, Review, Assignments und
Learn durch eine gemeinsame Lernhülle geschlossen. Sie übernimmt die vorhandene
Jahrgangssprache und die bestehende flüchtige Hell-/Dunkelwahl. Bedienführung wird
übersetzt; Aufgaben, Antwortschlüssel, feste deutsche Bewertungswörter und
inhaltliche Hilfen bleiben Original. Ein Sprachwechsel setzt weder Eingabe noch
abgeschlossene Bewertung zurück. Die Vorschau unterbindet zusätzlich Antwortklänge,
damit deren Sound-Einstellung keinen Gerätespeicher liest.

Die Namen aller 50 nummerierten Avatarbilder wurden gegen die wirklichen Bilder
abgeglichen: 46 Beschriftungen korrigiert, vier bereits passend. Bildnummern bleiben
stabil; Auswahlknopf und Alternativtext verwenden denselben zweisprachigen Katalog.

Die Lernprüfung zählt 240 Ansichten mit allen vier Antwortstufen und 40 zusätzliche
Verhaltensproben. Das neue V-1-Werkzeug erreicht die acht echten Next-Routenfamilien
mit 92 Routenkombinationen. Befehle, Grenzen, Fehlerproben und die Unterscheidung
zwischen Referenzkandidat und freigegebener Referenz stehen in
[visual-checks.md](../testing/visual-checks.md). Laufbelege und unabhängige Prüfung
gehören zum PR-Bericht, nicht als Bilder ins Repo.

**Weiter offen:** Der Quellenabgleich findet 48 verschiedene Originalabzeichen und
172 explizite Jahrgangseinträge (112 Vokabel-/60 Grammatik), widersprüchliche Kriterien,
niemals erhöhte Zähler und eine fehlende Grammatikdefinition für Jahrgang4.
Bewertete Einzelantworten belegen noch keine vollständigen Übungsrunden.
Karte133 verlangt daher einen verbindlichen Kriterien-/Datenerfassungsentscheid;
129 führt weder Ersatzkriterien noch neue Punktequellen ein. Geräteweites Speichern
bleibt ebenfalls bis133 aus. Die verbindliche Referenzablage, Kokis Bildurteil und
der produktive Vergleich fehlen weiterhin (133/128). Die Sperren der vorgelagerten
PRs515/516 bleiben bestehen. W7 insgesamt ist nicht abgeschlossen.


Nachzug zur unabhängigen Prüfung von cgo-129: Die Aufgabenübersicht verwendet
interne Next-Links, damit Sprache und Darstellung beim Seitenwechsel erhalten
bleiben. Auf den neu aufgenommenen Lernseiten erhalten die vorhandenen Kopfknöpfe
44-Pixel-Ziele; Markeninhalt und -palette bleiben gleich. Verfügbare Lernpfadzeilen
bleiben vollständig breit und nutzen lesbare Aktionsschrift. Echte Routenprüfungen
und gezielte Gegenproben sichern diese zuvor übersehenen Zustände ab. Der frühere
isolierte Trainervergleich besteht mit festgelegter Browserzeichnung 160/160;
seine bestehende 3/255-Toleranz wurde nicht erhöht. W7-/Referenzfreigaben bleiben offen.


### W7 · GG-Entscheide und Umsetzung cgo-156

**CODEX DRAFT — NOT CANON · IN REVIEW.** Umsetzung der GG-Entscheide
cgo-133/134, ausdrücklich beauftragt durch cgo-156. Kokis Bildurteil (cgo-128)
und die Freigabe des gesamten PR-Stapels bleiben offen.

Das Profil unter `/profil`, erreichbar über den Avatar, zeigt genau sieben
Abzeichen. Die vorhandene Figurenauswahl öffnet zuerst; nach „Fertig“ erscheint
die Profilfläche. Eine serverseitige Leseabfrage prüft die aktuelle beanspruchte
Schüleridentität, die eigene Klasse und den Sitzungs-Klassenausschnitt. Sie liest
keine Namen und schreibt nichts. Der Browser erhält nur bestätigte Abzeichen-IDs.

| Abzeichen | Verbindliches Kriterium |
|---|---|
| `streak-3`, `streak-7` | Gespeichertes `user_progress.streak` mindestens 3 / 7. Allgemeine Lernserie; ausdrücklich keine rekonstruierte Folge abgeschlossener Vokabelrunden. |
| `prestige-1/2/3` | Vorhandenes `user_progress.xp` mindestens 30.000 / 45.000 / 65.000. |
| `duo-champion` | Fünf abgeschlossene eigene Siege in `duels` derselben Klasse; beide vorhandenen Duellmodi zählen wie im Original. |
| `daily-first` | Mindestens ein eigener Versuch mit `mode=daily` und nichtleerem `booked_at` derselben Klasse. Auch ein falscher, aber vollständig gespeicherter Versuch zählt. |

„Daily Challenger“ beschreibt deshalb einen gespeicherten Versuch, keinen
vollständig abgeschlossenen Tagesdurchgang. Vorschau: 0 verdient, kein Abfragen
eines fremden Kontos. Lesefehler: „Nicht geladen“ statt erfundener Nullleistung.
Es gibt keine neue Abzeichentabelle, keine Rückbefüllung und keine dauerhaft
verliehenen Auszeichnungen: Die Anzeige spiegelt jeweils die vorhandenen
Serverwerte. Sinkende/zurückgesetzte Werte können ein Abzeichen wieder sperren.
Alte unbestätigte Versuche erzeugen kein Daily-Abzeichen; die vorgelagerte
Buchungs-/Merge-Sperre cgo-154 bleibt bestehen. Die Abfrage setzt die bereits
im vorgelagerten Entwurf enthaltene Migration 0027 (`booked_at`) voraus;
diese Karte führt sie nicht aus. Fehlt die Spalte, erscheint der ehrliche
Ladefehlerzustand statt einer erfundenen Auszeichnung.

Hell-/Dunkelwahl bleibt ausschließlich im Arbeitsspeicher bis zum Neuladen.
Kein localStorage, Cookie oder Servereintrag. Dauerhaftes Speichern bleibt bei
daten-029/GG-Plattform. Die Gerätewahl wird hier nicht vorweggenommen.

#### W7-Nachprüfung cgo-163 (Entwurf)

| Prüfung | Umsetzung und Grenze |
|---|---|
| Referenzbezug | Festes GitHub-Release `visual-reference-cgo156-v1`, Asset `cgo156-0df56205-linux-x64-chromium155.zip`. Archiv-Prüfsumme `1971dfcf4015ad30eb4546ae84a5934c43c7f2a239ac9c2b307aef82759ff6a8` und alle 92 Bildprüfsummen bleiben unverändert. `artifact-head` bezeichnet weiterhin die Herkunft; Download und Archivhash scheitern geschlossen. |
| K5 im synthetischen `--url`-Modus | Gültige UUID-Aufgabe, ausdrücklich gewählte Aufgabe, klares Fehlziel und Pixelvergleich bleiben Prüfgegenstand. Der Historienwächter ist dort kein Abnahmekriterium: synthetische Testseiten belegen keinen realen Verlauf des ausgelieferten Produkts. Im lokalen Router-Test bleibt er erhalten. Echte Zurück-Navigation prüft Koki auf dem ausgelieferten Stand (cgo-128). Eine zusätzliche isolierte Entwicklungs-/Produktionssonde protokolliert den Verlauf getrennt. |
| Datum | Nur die kopierte Kalenderfunktion der Test-App wird auf 24.10.2026 gesetzt; Browserzeit ist für die Gegenprobe verstellbar. Die Uhr des Next-/Webpack-Prozesses bleibt real, damit Dateizeitstempel korrekt verarbeitet werden. Tagesworttext bleibt wie im vorhandenen Vergleich maskiert; keine neue Bildfläche wird verdeckt. |
| Abzeichen im Browser | Alle Web-Quelldateien werden inventarisiert; ausdrücklich markierte Client-Module und ihre lokalen Importe werden auf Abzeichenschwellen geprüft. Die enge Prüfung der Anzeige und die Bindung an die angemeldete Person bleiben zusätzlich bestehen. |
| Tagesabzeichen A5 | Noch offen: Die Zuordnung zum tatsächlichen Tageswortsatz braucht die Verbindung des Datenbanklesers mit der vorhandenen serverseitigen Tagesauswahl. Der bisherige `mode=daily`-Nachweis oben ist dafür nicht ausreichend. Kein geändertes Produktverhalten und keine A5-Freigabe in diesem Teilstand. Umfangsfrage auf der eigenen Karte an GG. |

Die Datumsgleichheit auf demselben Rechner ist ein Wiederholungsnachweis, keine
Freigabe des Erscheinungsbildes. Der feste Linux-Referenzvergleich wird durch
GitHub separat geprüft. Die Buchungssperre cgo-162 bleibt davon unabhängig.

#### W7-Abweichungstabelle: alle 41 zurückgestellten Abzeichen

Alle folgenden Einträge bleiben auf GG-Entscheid geparkt. Sie erscheinen weder
als Kacheln noch als „bald“-Platzhalter. Wiederaufnahme erst durch eine eigene
beauftragte Karte nach der Plattform-Spur und dem serverseitigen Rundenmodell;
auch bereits teilweise ableitbare Kriterien sind keine zusätzliche Freigabe.

| Geparkte ID | Originalname | Grund / Abweichung |
|---|---|---|
| `first-session` | First Steps | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `ten-sessions` | On Fire | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `fifty-sessions` | Unstoppable | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `mastered-10` | Quick Learner | Original-Mastery und gültige Kategorienmenge sind nicht freigegeben; bestätigte Einzelantworten oder Wiederholungsboxen ersetzen diesen Entscheid nicht. |
| `mastered-50` | Word Collector | Original-Mastery und gültige Kategorienmenge sind nicht freigegeben; bestätigte Einzelantworten oder Wiederholungsboxen ersetzen diesen Entscheid nicht. |
| `mastered-100` | Vocabulary Champion | Original-Mastery und gültige Kategorienmenge sind nicht freigegeben; bestätigte Einzelantworten oder Wiederholungsboxen ersetzen diesen Entscheid nicht. |
| `mastered-all` | Master of All | Original-Mastery und gültige Kategorienmenge sind nicht freigegeben; bestätigte Einzelantworten oder Wiederholungsboxen ersetzen diesen Entscheid nicht. |
| `perfect-round` | Flawless | Vollständige Rundenzugehörigkeit und Abschluss fehlen; Einzelantworten verschiedener Durchgänge dürfen keine perfekte Runde bilden. |
| `all-types` | Explorer | Die ursprünglichen fünf Übungstypen samt Tages-/Sitzungsgrenzen sind nicht als neue Abzeichenregel freigegeben. |
| `daily-perfect` | Daily Genius | Kein bestätigter vollständiger Tagesdurchgang mit festem Aufgabenbestand und Ergebnisquote. |
| `speed-demon` | Speed Demon | Signierte Zeitspanne allein beweist weder vollständige Runde noch eindeutige Aufgabenfolge. |
| `sprinter` | Sprinter | Keine serverseitig bestätigte Identität und Abschlusszählung für zehn Sprintrunden. |
| `sharp-eye` | Sharp Eye | Originalfehler: bestMCStreak wird nie erhöht; weder Lebenszeitsumme noch Serie darf stillschweigend Ersatz werden. |
| `context-ace` | Context Ace | Vollständige Rundenzugehörigkeit und Abschluss fehlen; Einzelantworten verschiedener Durchgänge dürfen keine perfekte Runde bilden. |
| `definition-master` | Definition Master | Vollständige Rundenzugehörigkeit und Abschluss fehlen; Einzelantworten verschiedener Durchgänge dürfen keine perfekte Runde bilden. |
| `giant-killer` | Giant Killer | Rang oder XP beider Seiten zum Duellbeginn ist nicht historisch festgehalten. |
| `variety-pack` | Variety Pack | Die ursprünglichen fünf Übungstypen samt Tages-/Sitzungsgrenzen sind nicht als neue Abzeichenregel freigegeben. |
| `comeback-kid` | Comeback Kid | Fehlerauswahl, zugehörige Ursprungsrunde und abgeschlossener Wiederholungsdurchgang fehlen. |
| `review-warrior` | Review Warrior | Original zählt den Start, beschreibt aber den Abschluss; freigegebene Rundengrenze fehlt. |
| `full-sweep` | Full Sweep | Original zählt ausgewählte Quell-Units beim Start; heutige beantwortete Chapters sind kein identischer Nachweis. |
| `flash-scholar` | Flash Scholar | Original zählt eindeutige Got-it-Karten am Sitzungsende; Again oder einzelne Aufrufe dürfen nicht mitgezählt werden. |
| `g-first-session` | Grammar Rookie | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `g-ten-sessions` | Grammar Grinder | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `g-fifty-sessions` | Grammar Machine | Kein serverseitig bestätigter Abschluss einer vollständigen Trainerrunde mit festem Fragenbestand. |
| `g-perfect-10` | Perfect 10 | Vollständige Rundenzugehörigkeit und Abschluss fehlen; Einzelantworten verschiedener Durchgänge dürfen keine perfekte Runde bilden. |
| `g-streak-3` | 3-Day Grammar Streak | Die gespeicherte allgemeine Lernserie ist keine eigene Serie abgeschlossener Grammatikrunden. |
| `g-streak-7` | Grammar Week | Die gespeicherte allgemeine Lernserie ist keine eigene Serie abgeschlossener Grammatikrunden. |
| `g-mastered-5` | Rule Learner | Original zählt 5 beherrschte Grammatikstrukturen (je mindestens 90 % Richtigkeit und 15 Antworten). Die Übernahme dieses Kriteriums bleibt auf GG-Entscheid geparkt; keine zusätzliche Abzeichenfreigabe. |
| `g-mastered-15` | Grammar Scholar | Original zählt 15 beherrschte Grammatikstrukturen (je mindestens 90 % Richtigkeit und 15 Antworten). Die Übernahme dieses Kriteriums bleibt auf GG-Entscheid geparkt; keine zusätzliche Abzeichenfreigabe. |
| `g-mastered-all` | Grammar Crown | Originalfehler: Grammar Crown 34 gegenüber 35 Strukturen in Jahrgang 1; 22 gegenüber 28 heutigen Strukturen in Jahrgang 2; kein stiller neuer Nenner. |
| `g-accuracy-80` | Sharpshooter | Einzelantworten existieren, aber ursprünglicher Rundenausschnitt und Abschluss sind nicht freigegeben; keine Umdeutung aller Grammatikversuche. |
| `g-accuracy-95` | Precision Master | Einzelantworten existieren, aber ursprünglicher Rundenausschnitt und Abschluss sind nicht freigegeben; keine Umdeutung aller Grammatikversuche. |
| `g-tense-tamer` | Tense Tamer | Originalfehler: veraltete Zeitform-IDs; ähnlich benannte Strukturen sind kein genehmigter Ersatz. |
| `g-error-hunter` | Error Hunter | Originalfehler: grammarEcStreak und grammarTrStreak haben keine Aktualisierung; Rücksetz- und Rundengrenzen sind unbestimmt. |
| `g-translator` | Translator | Originalfehler: grammarEcStreak und grammarTrStreak haben keine Aktualisierung; Rücksetz- und Rundengrenzen sind unbestimmt. |
| `g-all-units` | Grammar Explorer | Original-Unit-Nenner widersprechen eingebetteten Quellen; Auswahl eines neuen Nenners braucht einen eigenen Entscheid. |
| `g-100-answers` | Century | Einzelantworten existieren, aber ursprünglicher Rundenausschnitt und Abschluss sind nicht freigegeben; keine Umdeutung aller Grammatikversuche. |
| `g-500-answers` | Grammar Athlete | Einzelantworten existieren, aber ursprünglicher Rundenausschnitt und Abschluss sind nicht freigegeben; keine Umdeutung aller Grammatikversuche. |
| `g-prestige-1` | Grammar Prestige I | GG gibt ausdrücklich nur sieben Abzeichen frei; grammarXp enthält auch Hör-/Lese-XP und belegt kein reines Grammatik-Prestige. |
| `g-daily-first` | Daily Grammar Challenger | Kein freigegebener Grammatik-Tagesrundenvertrag; allgemeiner daily-Versuch ist kein Grammatik-Tagesabschluss. |
| `g-daily-perfect` | Daily Grammar Genius | Kein freigegebener Grammatik-Tagesrundenvertrag; allgemeiner daily-Versuch ist kein Grammatik-Tagesabschluss. |

Weitere Originalfehler: Im vierten Trainer fehlt `GRAMMAR_BADGE_DEFS`; das
wird nicht durch erfundene Definitionen aufgefüllt. Die nie erhöhten MC-Zähler,
Grammar-Crown-Zahlen 34/35 und 22/28 sowie veraltete Zeitform-IDs sind
Quellenfehler und keine nachzubauenden Regeln.

Quellenstand: `REPORTS-codex/cgo-129-20261024-astra/badge-source/REPORT.md`
und `badge-inventory.json` (48 eindeutige IDs, 172 Jahrgangseinträge; SHA-256
`8ac89dc7f49113bec01b1d6615bb5add0b435d6fac388e7c8c4fefeccf3ebd59`). Kriterienänderungen folgen
ausschließlich cgo-156, nicht einer stillen Korrektur dieses älteren Inventars.
Der Repo-Spiegel dieser Entscheidung steht in [ENTSCHEIDE.md](ENTSCHEIDE.md).

Referenzablage, unveränderliche Prüfsummen und externer Aufgabenvertrag stehen
in [visual-checks.md](../testing/visual-checks.md). Bildpakete und Rohbelege
bleiben außerhalb des Repos. Referenzfixierung bedeutet keine Bildfreigabe
durch Koki. Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette.
