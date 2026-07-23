# ch01 Task-Design — der Full-Stack-Aufgaben-Plan (Dossier-Gate-Amendment, 2026-07-23)

**Status: DESIGN — Teil von Kokis Dossier-Gate.** Dieses Blatt macht die Aufgaben zum
gleichberechtigten Teil des Neuaufbaus: **der Review-Durchlauf nach dem Rebuild enthält
Level UND neues Aufgaben-System zusammen** (Kokis Amendment). Kanon: die F16–F24-Prinzipien
aus dem freigegebenen Plan · u01-Lexikon (Ground Truth: Schulsachen, Zahlen 1–19,
Klassenzimmer-Imperative open/close/sit/stand/listen/look/write/read, Grüße/Höflichkeit).

## 1 · Die Bau-Reihenfolge (Amendment-Folge)

Der Neuaufbau-PR wird FULL-STACK: erst landet das Aufgaben-Fundament (Schema `gameTasks@2`
mit Pflicht-`stimulus`, dann das Karten-Kit mit den neuen Interaktions-Arten), DANN der
Level-Neuaufbau, dessen Beweis-Bänder durch die NEUEN Karten laufen. Kein separater
„Aufgaben kommen später"-Durchlauf.

## 2 · Die Interaktions-Arten und WO sie wohnen (Vielfalts-Gesetz F20; ★ Gate-Verdikt G12)

Tipp-zuerst überall (F17: Tippen nie dominant — Ziel ≤ 20 % getippte Antworten im Kapitel).
**★ G12 (Koki): ch01 spielt NICHT alle Arten — `match` und `sort` sind auf ch02+
verschoben** (Arten-Vorrat für spätere Kapitel; ch02-Zoo bekommt match [Wort↔Tier-Bild],
ch03 bekommt sort). ch01-Arten: choice · wheel · spell · order · oddone · memory · typed.

| Art | Interaktion | ch01-Heimat (Beat) | u01-Stoff |
|-----|-------------|--------------------|-----------|
| `choice` (3 Optionen) | Tap | Begegnungen überall; Tür-/Wegsteher-Serie (G11) | Grüße, Objekte, **alle Unit-Kommandos + Fragen + Verneinungen über die Tor-Serie** |
| `wheel` (★ G9: Rad drehen, dann die Zahl ANTIPPEN = einloggen — kein Auto-Lock, kein OK-Knopf) | Drag/Flick + Tap | **Zahlen-Falter an der p2-Lampe** (der Falter trägt seine Zahl auf dem Flügel-Schild) | **NUR Unit-Zahlen (1–20, alle belegt — geprüft)**; digit→word & word→digit; Formen-Varianten (Rad mit Ziffern / Rad mit Wörtern) |
| `spell` (Buchstaben-Tippen in Reihenfolge) | Tap | p1-Quickfire (kurze Nomen), Käfig-Rettungen | pen, book, desk, bag, ruler |
| `order` (Satz bauen) | Tap + Drag | p2 nach dem Faust-Geschenk | This is my…, Is it a…? |
| `oddone` (was gehört nicht?) | Tap | p3-Stampfer-Zone | Kategorien Schulsachen/Zahlen |
| `mistake` (falsches Wort antippen + fixen) | Tap→Tap | Boss (die Tafel schreibt vor — mit Fehler) | This is a pencil. (× rubber) |
| `typed` (+`accept`) | Tastatur | 1 Tür-Wort, 1 Boss-Konter, ★ + die NAMENS-Konsole (G6: „Write your name!" — der Name wird gespeichert und trägt durchs Spiel) | „open", „hello", Eigenname |
| `memory` (Paare aufdecken) | Tap | NUR Boss/Klecks-Zusatz | Zahl↔Wort-Paare |
| ~~`match`~~ / ~~`sort`~~ / ~~`slider`~~ | — | **ch01: NICHT (G12)** — match→ch02, sort→ch03, slider→ch04 | — |

## 3 · Die Gesetze je Karte (F16/F22, unverhandelbar)

1. **Stimulus-Pflicht (F22):** jede Karte deklariert, WAS auf dem Bildschirm die Antwort
   trägt — Story-Zeile, Szenen-Bild oder das Wesen selbst (die Motte TRÄGT ihre 3). Der
   Validator lehnt Karten ohne Stimulus ab; die Blind-Löser prüfen, ob er REICHT.
2. **Distraktoren kuratiert (F16):** ähnlich-aber-klar-verschieden, lehrreich
   (three/thirteen — der klassische Zahlen-Stolperer; pen/pencil — das Paar, das man
   WIRKLICH verwechselt), nie zufällig aus der Unit gepoolt; Devil's-Advocate-Pass gegen
   Auch-richtig-Optionen.
3. **Varianten-Annahme:** getippte Antworten deklarieren `accept` (rubber/eraser;
   Artikel/Spacing normalisiert der Matcher schon).
4. **Register + Grounding:** jedes englische Wort aus u01; Giveaway-Gesetz; deutsches
   Register kindwarm (kein Drohvokabular).
5. **Zwei-Schichten-Gate vor dem Merge:** deterministischer Selbst-Löse-Sweep durch die
   ECHTEN Karten-Maschinen + 2 unabhängige Blind-Löser + Devil's Advocate auf der
   Text-Projektion — Einstimmigkeit oder Redesign.

## 4 · Mengen-Gerüst ch01 v2 (G12-Arten; ersetzt die 56 Alt-Karten)

| Pool | Stück | Arten-Mix |
|------|-------|-----------|
| quickfire | 14 | wheel ×5 (Ziffern↔Wörter beide Richtungen) · spell ×5 · choice ×4 |
| encounter | 10 | choice ×6 · oddone ×3 · mistake ×1 |
| door | 8 | ★ die KOMMANDO-SERIE (G11): choice ×7 über Türen/Wegweiser/Wegsteher — zusammen decken sie die Unit-Kommandos (open/close/sit/stand/come/listen/look) + 1 Frage-/Verneinungs-Karte ab · typed ×1 („open") |
| rescue | 5 | spell ×3 · order ×2 |
| boss | 6 | mistake ×2 · order ×2 · memory ×1 · typed ×1 (+ die Namens-Konsole als Story-Beat, zählt nicht als Aufgabe) |
| **gesamt** | **43** | getippt: 2/43 < 5 % ✓ |

(Jede Karte mit Beat-Zweck; Rotation = deterministische Playlist mit No-Repeat-Art-Regel.
★ G10-Gesetz: jede Karte MUSS ihren Stimulus aus der Spiel-Fiktion beziehen — das Wesen,
das Bild, die Tafel-Schrift — und der Prolog hat vorher erklärt, WARUM diese Wesen reden.)

## 5 · Exemplare (je Art eines — DRAFT, dein Sign-off = die Kalibrier-Latte)

- **wheel** (p2-Falter): Stimulus = der Falter mit „13" auf dem Flügel-Schild (13 ist
  in der Unit — geprüft; NUR Unit-Zahlen erlaubt). DE: „Ruf seinen Namen, dann setzt er
  sich!" Rad: eleven · twelve · **thirteen** · fourteen · sixteen (-teen-Verwechsler).
  ★ G9-Interaktion: Rad drehen (Drag/Flick oder Tap-Schritte), dann die gewählte Zahl
  ANTIPPEN = einloggen — kein Auto-Lock, kein OK-Knopf. Formen-Variante: Rad zeigt
  Wörter, der Falter die Ziffer — und umgekehrt.
- **spell** (p1-Quickfire): Bild: der Stift-Läufer verbeugt sich (Prolog hat erklärt,
  warum er redet — G10). DE: „Sag ihm, was er ist!" EN: „What is it?" Buchstaben:
  P E N + Ablenker C A T → `pen`.
- **choice/Kommando-Serie** (Tür p1, G11-Auftakt): DE: „Die Klassenzimmer-Tür wartet
  auf ihr Wort!" EN: „What do you say?" → **Come in!** / Sit down! / Thank you!
  (Die weiteren Serien-Karten decken open/close/sit/stand/listen/look + eine Frage-
  und eine Verneinungs-Form ab — jede an ihrem eigenen Tor/Wegsteher.)
- **order** (p2): DE: „Bau der Tafel einen Satz!" Chips: [is] [This] [book] [my] [.]
  → This is my book.
- **oddone** (p3-Stampfer): „Was gehört NICHT in die Federtasche?" pen · pencil ·
  rubber · **chair**.
- **mistake** (Boss): Die Tafel schreibt: „This is a **rubber**." (Bild: ein Lineal.)
  → Tipp aufs falsche Wort → 3 Fix-Optionen.
- **memory** (Boss/Klecks): 4 Paare Zahl↔Wort (3/three, 7/seven, 12/twelve, 9/nine).
- **typed** (Boss-Konter): DE: „Schreib der Tafel dein Wort!" EN: „Say hello!" →
  `hello` (accept: „hello!").
- ★ **Die Namens-Konsole** (Boss-Finale, G6 — Story-Beat, keine gewertete Aufgabe):
  „Write your name!" → freie Eingabe, wird gespeichert und trägt durchs Spiel
  (Merle ruft den Namen, HUD-Grüße nutzen ihn).
- (~~match~~/~~sort~~-Exemplare: verschoben auf ch02/ch03 — G12.)

## 6 · Was DU am Gate entscheidest (Zusatz-Fragen zu den vieren im README)

5. Trägt das Mengen-Gerüst (41 statt 56, Arten-Mix, ≤ 5 % getippt)?
6. Sind die 10 Exemplare die richtige Latte? (Dein Sign-off = Kalibrierung; danach wird
   der volle Satz in diesem Stil autoriert und zweischichtig verifiziert.)
