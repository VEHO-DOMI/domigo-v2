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
Fünf Runden × drei Fragen nach Kartenbrief (OG-Quelltext derzeit fünf Fragen).
Jahrgang 1 deutsche Führung, 2–4 englisch; sichtbare Gliederung Chapter.
Bestenlisten-Schalter A öffnet Arena nur innerhalb der eigenen Klasse; Vorschau
zeigt ausschließlich Beispiele. Original-Boni 100/50/25 und Zusatz 8 × Treffer
entfallen: XP nur aus bewerteten Antworten, Siege nur Statistik. Grammatik-Duell
benannt verschoben. Eine zusätzliche Tabelle 0024, noch nicht angewendet.

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
