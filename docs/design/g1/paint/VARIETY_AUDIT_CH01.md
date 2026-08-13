# VARIETÄTS-AUDIT ch01 — was gemessen wurde, was daraus folgte

**Status: BEFUND + Nachweis (R5-Welle-2, Session G1, 2026-08-13).** Kokis Befund war
»die Aufgaben wiederholen sich in Form und Gefühl«. Dieses Dokument hält fest, was
davon MESSBAR war, mit welchem Werkzeug, und was der Messung folgte. Jede Tabelle
hier ist maschinell erzeugt — keine Zahl ist von Hand gezählt.

**Das Werkzeug:** `packages/game-paint/src/cards/variety.ts`, Schichten 13–17 von
`scripts/check-game-tasks.mjs`. Schicht 15 MODELLIERT die Ausgabe nicht, sie FÜHRT
den echten Router aus (`cards/routing.ts`, importiert) — dieselbe Disziplin, mit der
das Gate schon `timerClassFor` importiert statt nachzuschreiben.

---

## §1 · Der Befund: der Server war die halbe Ursache

Die Wortwahl war die eine Hälfte. Die andere steckte in `cards/nextTask`, und sie
war grösser:

| Gemessen am ausgelieferten Stand | Zahl |
|---|---|
| Feld-Karten (encounter · quickfire · door · rescue) | 62 |
| davon je **erreichbar** | **44** |
| davon **nie servierbar** | **18** |

Zwei getrennte Ursachen:

1. **Der Anti-Wiederholungs-Sprung schob den Zeiger AN der übersprungenen Karte
   VORBEI.** Wo er jede zweite Ausgabe zündete, rückte der Zeiger um zwei und
   besuchte für immer nur eine Parität. Betroffen: `door.d2/d4/d6/d8/d10` ·
   `qf.moths.w2` · `qf.moths.p1w2` · `enc.pencil.c2` · `enc.heft.w2` ·
   `enc.ranzen.q2`. Fünf von zehn Tür-Karten waren damit toter Inhalt — was
   **Gesetz M-E** (doc 41 §1: die Tür-Serie deckt ALLE Imperative, Fragen und
   Negationen der Unit) still aufhob.
2. **Die acht ungebundenen `qf.free.*`-Karten waren bauartbedingt unerreichbar.**
   `quickfire` wird in ch01 nur von einem `swarm` gehoben (`sim.ts:634`), der einzige
   Schwarm sind die p2-Falter, und die haben eigene gebundene Karten — also gewinnt
   Schritt 3 der Auflösung immer vor Schritt 4. Der Fallback in `PaintGame.tsx:224`
   feuert nur bei LEEREM Pool, und Abdeckungs-Gesetz 5 verbietet genau das für jeden
   Frager.

Dazu der Zeiger-Schlüssel `use|phase|skin`: die Tür-Karten deklarierten keine
`phases`, also lagen drei Zeiger auf DENSELBEN zehn Karten, alle bei 0 — **jeder
Ausgang des Kapitels fragte Platz eins der gleichen Serie.**

**Und die Wortwahl, gezählt:** der exakte String »What is it?« stand auf **15**
Karten, »What do you say?« auf **13** — 28 von 69, **41 %**.

---

## §2 · Widersprüche, die das Audit nebenbei fand

- **`enc.heft.w1/w2` waren Zahlen-Räder in p3** — gegen G9 und gegen `p3.md:116`,
  wo das Profil des Flatterers `choice` ist. Die Räder gehören den p2-Faltern.
- **Das Heft trug vier Arten** (choice · oddone · wheel ×2 · restore), wo B12 eine
  verlangt.
- **Der Sprung zerstörte B10 aktiv:** der Falter-Korridor war als »3–4
  Rad-Aufgaben in Folge« entworfen, und der Sprung zwang eine `choice`-Karte
  zwischen jedes Rad.
- **★ Die Farb-Karte stand bei den drei doppelzuständlichen Wesen NICHT an
  Pool-Position 1** (Radierer, Füller, Heft). `sim.ts` erlöst ein Wesen bei JEDER
  gelösten Karte — die zuerst servierte gab also die Farbe zurück, OHNE dass die
  Farbe je gefragt wurde. In der Kern-Mechanik des Kapitels (doc 41 §2), an drei von
  neun Restore-Karten. Kein struktureller Check konnte das sehen; Gesetz 14e sieht es.
- **★ Merles sechs Runden legten 4 von 6 Antworten auf dieselbe
  Bildschirm-Position** (nach dem echten `seededShuffle`): ein Kind, das immer die
  Mitte antippt, hatte zu 67 % recht.

---

## §3 · Was zwei BLINDE LÖSER fanden, die nur sahen, was das Kind sieht

Zwei frische Kontexte, ohne Schlüssel, ohne einander, ohne meine Begründung. Was
beide unabhängig sagten, ist damit Tatsache und nicht Meinung:

- **`door.p1.d2` war echt AMBIG.** »Sie will ein höfliches Wort hören« mit
  Sorry! / Thanks! / Please! — alle drei SIND höfliches Englisch. Ein Kind konnte
  richtig antworten und falsch liegen.
- **»Tippe die LÄNGSTE Antwort« gewann auf 7 von 12 Karten.** Beide zählten es
  getrennt aus. Behoben als KLASSE, nicht als Instanz: Gesetz **16f** zählt es
  kapitelweit; `pick-correct-form` ist bauartbedingt ausgenommen, weil das
  Apostroph, das »It's a book.« richtig macht, es auch am längsten macht.
- **Zwei Karten fielen auf »tippe das Apostroph«** (Radierer k1/k2) — die richtige
  Antwort war die einzige mit einem UND der einzige ganze Satz.
- **★ Ein Rückschritt von mir selbst:** ich hatte der Käfig-Karte den deutschen
  Namen des Insassen genommen (»eine graue Kiste«), und beide Kritiker nannten sie
  einen Münzwurf. `STORY_SPINE_CH01` §4b sagt das VORHER: der Insassen-Name ist der
  einzige faire Hinweis, wer ihn wegnimmt, macht die Karte unlösbar.
- **★ Und eine Verschlimmerung durch meinen eigenen Fix:** um das Kognat
  Namen→name zu umgehen schrieb ich »Frag sie, WIE SIE HEISST!«. Der Nachlauf fand
  einen falschen Freund — wie→How zieht das Kind auf »How are you?«. Ein Kognat, das
  auf die RICHTIGE Antwort zeigt, ist das erklärte Gerüst des Kapitels (Deutsch
  rahmt, Englisch antwortet); ein falscher Freund, der auf eine FALSCHE zeigt, ist
  ein Fehler. Das Kognat ist bewusst zurück.

Ein »gelangweiltes Kind«-Kritiker urteilte parallel **BORED** über den alten Stand,
mit einer Begründung, die ins Level-Design zeigt und nicht in die Karten: »kein
einziger Moment, wo ich einfach nur springe, ohne Quiz.« Das steht in der
Filed-Liste des Reports — es ist eine Platzierungs-Frage, keine Karten-Frage.

---

## §4 · Drei Gesetzes-Korrekturen, die das Autoren erzwungen hat

Jede davon ist eine Stelle, an der mein eigenes Gesetz Unmögliches verlangte. Sie
stehen hier, weil ein Gesetz, dessen Grenzen niemand aufschreibt, beim nächsten Mal
still umgangen wird.

1. **15c feuerte auf jedes Paar eines EIN-STIMMEN-Pools** und war damit unvereinbar
   mit 14a: B12 fixiert eine Frage pro Wesen, also MUSS ein Wesen mit zwei Karten
   sie zweimal hintereinander stellen. Der naheliegende Patch (»nur Pools mit ≥2
   Fragen«) war auch falsch: ein Pool ist ein **Kreis**, und eine Anordnung ohne
   gleiche Nachbarn existiert nur, wenn keine Frage mehr als ⌊n/2⌋ der Plätze hält.
   Drei Karten mit zwei Befehlen können es in KEINER Reihenfolge.
2. **14c gruppierte nach SKIN statt nach Pool.** Alle vier Käfige teilen die Kunst
   `satchel`, stehen aber in vier Phasen mit vier Insassen — das Gesetz beschuldigte
   Musikanlage, Tablet, Stuhl und Klassenfoto, EIN Wesen zu sein, das dreimal
   dasselbe fragt.
3. **14a galt auch für die TÜR** — und Gesetz M-E verlangt von ihrer Serie
   ausdrücklich Imperative UND Fragen UND Negationen. Ein Gesetz, das ein
   höherstehendes aufhebt, ist falsch skopiert.

Dazu ein Tamper-Befund gegen mich: die erste Fassung des Form-Gesetzes trug ZWEI
Tabellen (`FORM_KINDS` + ein `KIND_FIXED_FORM` mit eigener Wächter-Zeile). Der Tamper
schaltete die Wächter-Zeile ab und **kein einziger Test wurde rot** — `FORM_KINDS`
verbot jede andere Paarung längst. Eine Prüfung, die man nicht zum Scheitern bringen
kann, hat nichts bewiesen; aus der Doppel-Tabelle wurde `fixedFormOf(kind)`.

---

## §5 · Nachher — maschinell erzeugt

### Bestand nach der Welle

- Karten insgesamt: **54** — davon **47** Feld-Karten (encounter · quickfire · door · rescue) und **7** Boss-/Finale-Karten, die Session H1 gehoeren.
- Arten: choice 28 · oddone 6 · restore 9 · wheel 4
- Formen: ask-it 5 · belongs-or-not 6 · command 12 · count-it 2 · name-it 9 · number-transcode 4 · pick-correct-form 2 · social-formula 3 · state-it 4

### Stimme je Wesen (B12) — eine Frage, wechselnder Inhalt

| Phase | Wesen | Rolle | Stimme | Karten |
|---|---|---|---|---|
| p1 | pencil | chaser | command | 3 |
| p1 | eraser | bouncer | name-it + pick-correct-form | 3 |
| p1 | satchel | cage | state-it | 1 |
| p1 | door | door.trigger | ask-it + command + social-formula | 3 |
| p1 | obj_book | drained | name-it | 1 |
| p1 | obj_schoolbag | drained | name-it | 1 |
| p2 | pen | chaser | ask-it + name-it | 3 |
| p2 | paintbox | gunner | belongs-or-not | 2 |
| p2 | moths | swarm | number-transcode | 4 |
| p2 | satchel | cage | state-it | 1 |
| p2 | merle | classmate | command | 6 |
| p2 | door | door.trigger | ask-it + command + social-formula | 3 |
| p2 | obj_desk | drained | name-it | 1 |
| p2 | obj_scissors | drained | name-it | 1 |
| p3 | ranzen | crusher | belongs-or-not | 4 |
| p3 | heft | flyer | count-it + name-it | 3 |
| p3 | satchel | cage | state-it | 1 |
| p3 | door | door.trigger | ask-it + command + social-formula | 3 |
| p3 | obj_gluestick | drained | name-it | 1 |
| p3 | obj_sharpener | drained | name-it | 1 |
| p4 | satchel | cage | state-it | 1 |

### Fragen je Raum

| Phase | Feld-Karten | verschiedene Fragen |
|---|---|---|
| p1 | 12 | 6 — ask-it · command · name-it · pick-correct-form · social-formula · state-it |
| p2 | 21 | 7 — ask-it · belongs-or-not · command · name-it · number-transcode · social-formula · state-it |
| p3 | 13 | 7 — ask-it · belongs-or-not · command · count-it · name-it · social-formula · state-it |
| p4 | 1 | 1 — state-it |

### Wiederholte Zeilen (was uebrig bleibt, und warum es bleiben darf)

| Zeile | Karten | Warum erlaubt |
|---|---|---|
| „What do you say?“ | 6 | Familie `merle-ceremony` — Kokis C2: sechs Versuche an EINER Faehigkeit; zahlt mit sechs eigenen Zeilen und sechs eigenen Antworten |
| „Sag, was es ist — dann gib ihm die Farbe!“ | 3 | Familie `restore-gesture` — dito |
| „Sag, wer er ist — dann gib ihm die Farbe!“ | 2 | Familie `restore-gesture` — EINE lernbare Geste; zahlt mit je eigenem Bild-Gleichnis |

### Erreichbarkeit

| | vorher | nachher |
|---|---|---|
| Feld-Karten | 62 | **47** |
| davon erreichbar | 44 | **47** |
| nie servierbar | **18** | **0** |
| Karten mit »What is it?« | **15** | **0** |

Die Datei wird KLEINER und der servierte Inhalt grösser — das ist der Punkt. Was
verschwunden ist, war nicht Inhalt, sondern Inhalt, den kein Kind erreichen konnte.

### Abdeckungs-Ledger (B8) — 68 gelehrte Vokabeln, drei Zustände

| Zustand | Anzahl | Bedeutung |
|---|---|---|
| **produziert** | 31 | eine Karte lässt das Kind das Wort selbst geben (gegen die Antwortfläche geprüft, Gesetz 13e) |
| **angeboten** | 9 | steht als Ablenker auf dem Bildschirm; das Kind liest es (Gesetz 17b weist die Behauptung ab, wenn es auf keiner Karte steht) |
| **deklariert** | 28 | mit Grund und Ablaufdatum ausgenommen — kein Welt-Anker, Funktionswort, oder ein Verb, für das in ch01 niemand etwas Sichtbares tut |

Die früheren »35 von 68« waren eine Teilstring-Schätzung, die Ablenker mitzählte und
»pencil« in »pencil sharpener« traf. Die 31 hier sind geprüft. Alle **vier**
Grammatik-Strukturen der Unit werden geübt (Imperative · Kontraktionen · Plural ·
Personen-Fragen) — damit ist Gesetz M-E erstmals messbar erfüllt.

---

## §Quellen

Kokis Replay-Befunde: doc 45 §B8 (keine Duplikate, volle Vokabel-Abdeckung) · §B10
(Falter-Korridor: 3–4 Räder in Folge) · §B12 (feste Profile je Wesenstyp) · §B13
(Zweit-Treffen bringt neuen Inhalt) · §C2 (Merles Scaffolding-Genauigkeit) ·
§F5 (Boss-Varietät — gehört H1). Gesetze: doc 41 §1 (Verteilungskarte, M-E) und §2
(Farb-Mechanik) · doc 44 §2.9 (Uhren-Politik) · `STORY_SPINE_CH01.md` §2/§4/§5 ·
`ch01-dossiers-v2/p1|p2|p3.md` §9.
