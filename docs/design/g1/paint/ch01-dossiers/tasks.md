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

## 2 · Die Interaktions-Arten und WO sie wohnen (Vielfalts-Gesetz F20)

Tipp-zuerst überall (F17: Tippen nie dominant — Ziel ≤ 20 % getippte Antworten im Kapitel).

| Art | Interaktion | ch01-Heimat (Beat) | u01-Stoff |
|-----|-------------|--------------------|-----------|
| `choice` (3 Optionen) | Tap | Begegnungen überall; Tür-Imperative | Grüße, Objekte, Imperative |
| `wheel` (Rad rastet ein, kein OK-Knopf) | Drag/Tap-Schritte | **Zahlen-Motten an der p2-Lampe** (die Motte trägt ihre Zahl — das Rad ruft ihren Namen) | Zahlen 1–19, digit→word & word→digit |
| `spell` (Buchstaben-Tippen in Reihenfolge) | Tap | p1-Quickfire (kurze Nomen), Käfig-Rettungen | pen, book, desk, bag, ruler |
| `order` (Satz bauen) | Tap + Drag | p2 nach dem Faust-Geschenk (Sätze „bauen" passt zur neuen Kraft) | This is my…, Is it a…? |
| `match` (links↔rechts) | Tap-Paare | p3-Quickfire (Wort ↔ Objekt-Bild) | Schulsachen ↔ Bilder |
| `oddone` (was gehört nicht?) | Tap | p3-Stampfer-Zone (der Ranzen sortiert falsch ein!) | Kategorien Schulsachen/Zahlen |
| `sort` (2 Gruppen) | Tap/Drag | p2-Regal (Bücher einräumen: in die Tasche / aufs Pult) | school bag vs. desk |
| `mistake` (falsches Wort antippen + fixen) | Tap→Tap | p2/p3 fortgeschritten (die Tafel schreibt VOR — mit Fehler) | This is a pencil. (× rubber) |
| `typed` (+`accept`-Varianten) | Tastatur | SPARSAM: 1–2 Tür-Wörter, 1 Boss-Konter | imperativ „open", „hello" |
| `memory` (Paare aufdecken) | Tap | NUR Boss/Klecks-Zusatz (F20: komplex = Boss-Beat) | Zahl↔Wort-Paare |
| `slider` | Drag/Tap | ch01: NICHT (kein Skalen-Stoff in u01 — erst ch04-Gefühle) | — |

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

## 4 · Mengen-Gerüst ch01 (ersetzt die 56 Alt-Karten)

| Pool | Stück | Arten-Mix |
|------|-------|-----------|
| quickfire | 14 | wheel ×4 · spell ×4 · choice ×4 · match ×2 |
| encounter | 10 | choice ×5 · oddone ×2 · sort ×2 · mistake ×1 |
| door | 6 | choice (Imperativ) ×5 · typed ×1 („open") |
| rescue | 5 | spell ×3 · order ×2 |
| boss | 6 | mistake ×2 · order ×2 · memory ×1 · typed ×1 |
| **gesamt** | **41** | getippt: 2/41 ≈ 5 % ✓ |

(Weniger als 56, dafür jede Karte mit Beat-Zweck — Klasse statt Masse; die Rotation je
Pool bleibt deterministische Playlist mit No-Repeat-Art-Regel.)

## 5 · Exemplare (je Art eines — DRAFT, dein Sign-off = die Kalibrier-Latte)

- **wheel** (p2-Motte): Stimulus = die Motte mit „13" auf den Flügeln. DE: „Ruf ihren
  Namen, dann setzt sie sich!" EN: —. Rad: eleven · twelve · **thirteen** · fourteen ·
  sixteen. (Distraktor-Kern: -teen-Verwechsler.)
- **spell** (p1-Quickfire): Bild: der Stift-Läufer verbeugt sich. DE: „Sag ihm, was er
  ist!" EN: „What is it?" Buchstaben: P E N + Ablenker C A T → `pen`.
- **choice** (Tür p1): DE: „Die Schultür wartet auf ihr Wort!" EN: „What do you say?"
  → **Come in!** / Sit down! / Thank you!
- **order** (p2): DE: „Bau der Tafel einen Satz!" EN: Chips: [is] [This] [book] [my] [.]
  → This is my book.
- **match** (p3): links pen/ruler/bag ↔ rechts 3 gemalte Objekte (Batch-AC-Bilder).
- **oddone** (p3-Stampfer): „Was gehört NICHT in die Federtasche?" pen · pencil ·
  rubber · **chair**.
- **sort** (p2-Regal): 4 Chips in 2 Gruppen: school bag {pen, exercise book} /
  desk {board?nein—} … final kuratiert am echten Regal-Bild.
- **mistake** (Boss): Die Tafel schreibt: „This is a **rubber**." (Bild: ein Lineal.)
  → Tipp aufs falsche Wort → 3 Fix-Optionen.
- **memory** (Boss/Klecks): 4 Paare Zahl↔Wort (3/three, 7/seven, 12/twelve, 9/nine).
- **typed** (Boss-Konter): DE: „Schreib der Tafel dein Wort!" EN: „Say hello!" →
  `hello` (accept: „hello!").

## 6 · Was DU am Gate entscheidest (Zusatz-Fragen zu den vieren im README)

5. Trägt das Mengen-Gerüst (41 statt 56, Arten-Mix, ≤ 5 % getippt)?
6. Sind die 10 Exemplare die richtige Latte? (Dein Sign-off = Kalibrierung; danach wird
   der volle Satz in diesem Stil autoriert und zweischichtig verifiziert.)
