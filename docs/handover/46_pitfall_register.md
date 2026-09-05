# 46 · DAS FALLEN-REGISTER DES BEMALTEN BUCHS (`PB-nn`)

_Angelegt von Session K1 am 2026-08-14. **Anlass:** die Lehren der Wellen 1–3 standen
verstreut in PR-Texten, Berichten und im Projekt-Gedächtnis — nirgends als Datei, die
eine bootende Session lesen kann. Dieselbe Falle wurde dadurch dreimal bezahlt._

## Wozu das hier gut ist

Eine Falle ist keine Anekdote. Sie ist eine **Panne, die sich wiederholt**, wenn niemand
sie aufschreibt — und in diesem Projekt hat sich genau das messbar zugetragen: der
verborgene Automatisierungs-Tab, der ein eingefrorenes Bild liefert, hat drei Sessions
Zeit gekostet (F2, E4, H1), jedes Mal neu entdeckt, jedes Mal unter einer anderen Nummer.

Jeder Eintrag hat drei Teile, und alle drei sind Pflicht:

* **Das Gesetz** — ein Satz, der ohne den Vorfall verständlich ist.
* **Der Vorfall** — was passiert ist, mit Session und Datum. Ohne Vorfall ist ein Gesetz
  eine Meinung.
* **Die Regel** — was man ab jetzt konkret anders macht.

## Warum `PB-` und nicht `P-`

Es gibt zwei Register, und sie liefen bis heute unter derselben Nummer:

| Register | Wo | Für was |
|---|---|---|
| **`P-nn`** | `~/.claude/skills/fable-method/references/pitfalls.md` (= `~/Code/mission-control/fable-method/…`) | **projektübergreifend** — SRDP, DomiGo, alle Programme. Steht bei P-60. |
| **`PB-nn`** | *diese Datei* | **nur das bemalte Buch** — Engine, Karten, Kunst, Harness. |
| `CP-nn` | `docs/art/CODEX_METHOD.md` §6 | nur die Kunst-Kommissionen (bestand schon) |
| `D-nn` | `docs/design/g1/paint/DEBT_REGISTER.md` | Schulden, nicht Lehren |

Die DomiGo-Sessions haben unabhängig voneinander `P-53`…`P-69` vergeben — Nummern, die
projektübergreifend längst anders belegt waren, und die sich zusätzlich **untereinander**
überschnitten (G1 und H1 benutzten beide `P-61`…`P-66` für verschiedene Dinge).
**Koki hat am 2026-08-14 entschieden: eigene Achse.** `CP-nn` gab es dafür schon als
Vorbild.

**Konvention (wie beim großen Register):** ANHÄNGEN, nie umnummerieren, nie löschen.
Was durch einen Bau überholt ist, wird als *überholt* markiert und bleibt stehen.
Eine Falle wandert ins große `P-`-Register, sobald sie ein zweites Programm beißt.

**★ Ratifiziert 2026-08-15 (Ruling R70) — wie hier nummeriert wird.** Zwei Regeln, beide
aus der Praxis der Welle 4 und beide vom Architekten bestätigt:
1. **Dicht, lückenlos, in der Reihenfolge des Eintreffens.** Nummern werden **nicht**
   reserviert und **nicht** übersprungen: das Tor `check-registers` erzwingt, dass jede
   Zahl von 1 bis zur höchsten vorhanden ist — eine „freigehaltene" Nummer macht es rot.
   Wer eine Falle meldet, die schon steht, bekommt **keine** neue Nummer, sondern eine
   Zeile am bestehenden Eintrag plus (wenn er sie unter anderem Namen kannte) eine Zeile
   in der Umrechnung unten. Genau so entstanden PB-44…51: vierzehn gemeldete Fallen,
   **acht** Einträge, sechs Doppelungen.
2. **Nummern vergibt ausschließlich die K-Bahn** (die Kanon-/Register-Session einer Welle).
   Jede andere Session schreibt ihre Fallen als Text in ihren Report — sonst vergeben
   zehn parallele Sessions dieselbe Zahl zehnmal.

## Umrechnung — alte P-Nummer → PB

Wer eine ältere Passover-Zeile oder einen PR-Text mit `P-5x`/`P-6x` liest, findet hier
den Eintrag wieder. **Die iCloud-Passovers sind absichtlich nicht nachträglich
umgeschrieben** — laufende Sessions haben sie schon gelesen.

| Steht in älteren Texten als | Aus | Heißt hier |
|---|---|---|
| P-53 | E4 | PB-1 |
| P-54 | E4 | PB-2 |
| P-55 | E4 | PB-3 |
| P-56 | E4 | **PB-4** (zusammengeführt mit H1s P-66 — dieselbe Falle) |
| P-57 | E4 | PB-5 |
| P-58 | E4 | PB-6 |
| P-59 | E4 | PB-7 |
| P-60 | E4 | PB-8 |
| P-61 | G1 | PB-9 |
| P-62 | G1 | PB-10 |
| P-63 | G1 | PB-11 |
| P-64 | G1 | PB-12 |
| P-65 | G1 | PB-13 |
| P-66 | G1 | PB-14 |
| P-67 | G1 | **PB-15** (zusammengeführt mit J1s Tamper-Fund) |
| P-68 | G1 | PB-16 |
| P-69 | G1 | PB-17 |
| P-61 | H1 Teil 2 | PB-18 |
| P-62 | H1 Teil 2 | PB-19 |
| P-63 | H1 Teil 2 | PB-20 |
| P-64 | H1 Teil 2 | PB-21 |
| P-65 | H1 Teil 3 | **PB-22** (die Port-Falle) |
| P-66 | H1 Teil 3 | **PB-4** (dieselbe Falle wie E4s P-56) |
| P-65 | H1 Architekt | **PB-22** (dieselbe wie H1 Teil 3 — im Architekten-Report neu nummeriert) |
| P-66 | H1 Architekt | **PB-4** (dito) |
| P-67 | H1 Architekt | **PB-18** (Fixture-Raum ≠ ausgelieferter Raum; = H1 Teil 2s P-61) |
| P-68 | H1 Architekt | **PB-19** (zwei Handlisten; = H1 Teil 2s P-62) |
| P-69 | H1 Architekt | **PB-20** (Test hebt den Schleier nie; = H1 Teil 2s P-63) |
| P-70 | H1 Architekt | **PB-51** (roher `sim.step()`) — **neu** |
| P-71 | H1 Architekt | **PB-21** (trunkierende Ease; = H1 Teil 2s P-64) |
| P-72 | E5 | **PB-44** — neu |
| P-73 | E5 | **PB-45** — neu |
| P-74 | E5 | **PB-46** — neu |
| P-75 | E5 | **PB-47** — neu |
| P-76 | E5 | **PB-48** — neu |
| P-77 | E5 | **PB-49** — neu |
| P-78 | E5 | **PB-50** — neu |

> **⚠ Die Nummern, die am ehesten Ärger machen:** `P-65` bedeutet je nach Session
> zwei verschiedene Dinge (G1: falsch skopiertes Gesetz = **PB-13** · H1: die Port-Falle
> = **PB-22**), und `P-66` ebenso (G1: blinde Löser finden Autoren-Rückschritte =
> **PB-14** · H1: der verborgene Tab = **PB-4**). Wer eine dieser Zahlen zitiert findet,
> liest nach, aus welcher Session sie stammt. **`PERF_WAECHTER.md` meint mit P-56/P-57
> die E4-Bedeutungen (PB-4/PB-5), mit P-65 die Port-Falle (PB-22); `PASSOVER_W1.md`
> meint mit P-66 den verborgenen Tab (PB-4).**
>
> **★ Seit 2026-08-15 (K2) kommen drei weitere Doppelbelegungen dazu**, weil H1 im
> Architekten-Report seine eigenen Teil-2-Fallen neu durchnummeriert hat: `P-67` heißt bei
> G1 **PB-15**, bei H1 **PB-18**; `P-68` bei G1 **PB-16**, bei H1 **PB-19**; `P-69` bei G1
> **PB-17**, bei H1 **PB-20**. **Faustregel: eine `P-6x`-Zahl ohne Session-Angabe ist nicht
> auflösbar** — steht keine Session dabei, wird beim Autor nachgefragt statt geraten.
> `PASSOVER_K2.md` meint mit P-65…P-71 durchgehend die **H1-Architekt**-Bedeutungen.

---

# Die Einträge

## Messen und Werkzeuge

**PB-1 · Rationiere in der Einheit, in der abgerechnet wird.** *(E4, 2026-08-12; früher
P-53)* Der Textur-Vorwärmer maß seine Arbeit in 0,43 ms je Megapixel — das ist aber die
Wartezeit der CPU, nicht die Arbeit der Grafikkarte, die ~3,5 ms je Megapixel kostet. Er
rationierte sich also nach der falschen Zahl und schob eine ganze Phase in EIN Bild:
**p2 brauchte 257 ms gegen 159 ms ohne Vorwärmer — der Helfer WAR das Problem.**
*Regel:* Wer eine Arbeit portioniert, portioniert sie in der Einheit, in der die
Rechnung kommt, und misst beide Seiten getrennt.

**PB-2 · Phasers `POST_STEP` liegt IM selben Schritt wie das Zeichnen.** *(E4,
2026-08-12; früher P-54)* Arbeit, die dort eingehängt wird, landet auf dem unmittelbar
folgenden Bild — der Vorwärmer belastete ausgerechnet das teuerste (49 gegen 79
Zeichenaufrufe). Dasselbe gilt für `create()`: es läuft in dem Schritt, der das erste
Bild zeichnet. *Regel:* Dort zu wärmen verschiebt nichts. Wer Arbeit vorziehen will,
braucht einen Schritt, der NICHT zeichnet.

**PB-3 · `camera.worldView` heißt `width`/`height`, nicht `w`/`h` — und ist vor dem
ersten Render leer.** *(E4, 2026-08-12; früher P-55)* Beides zusammen ergab lauter
`NaN`-Abstände; nichts galt als „auf dem Schirm", **die Optimierung tat still gar
nichts, ohne einen einzigen Fehler**. Gefunden wurde es nur, weil der Report
`broken`/`opening`/`view` mitlieferte. *Regel:* Diagnose einbauen, nicht raten — eine
Optimierung, die nichts tut, sieht von außen aus wie eine, die funktioniert.

**PB-4 · Im verborgenen Automatisierungs-Tab liefert `renderer.snapshot()` ein
STEHENDES Bild.** *(Dreimal bezahlt: F2 2026-08-11 — dort mit anderer Ursache · E4
2026-08-12, früher P-56 · H1 Teil 3 2026-08-14, früher P-66.)* Drei Aufnahmen ergaben
drei byte-identische PNGs; gefangen wurde es per md5, nicht per Auge. Die Gegenprobe —
die Kamera um 137 px verschieben — lieferte DENSELBEN Hash: die Prüfung maß nichts.
H1s Blindvergleich gegen Rayman ist daran gescheitert und blieb der einzige offene
Punkt seiner Definition of Done. *Regel:* `computer{action:"screenshot"}` benutzen, das
liefert das echte Bild. Und jede Bildserie beginnt mit dem Selbsttest: **zwei Aufnahmen
mit einem Schritt dazwischen MÜSSEN sich im md5 unterscheiden**, sonst Abbruch.
**★ Eingeschränkt am 2026-08-15 durch PB-44:** das gilt für die **MCP-Browser-Flächen**.
Ein selbst gestarteter `--headless=new`-Chrome ist sichtbar und zeichnet — dort greift
stattdessen die Kontrollmessungs-Pflicht aus PB-44.
**★ Erweitert am 2026-08-15 durch PB-69:** der verborgene Tab verfälscht nicht nur
Zahlen — er kann einen echten Defekt **unreproduzierbar** machen.

**PB-5 · Die Erstbild-Zahl ist in der Automatisierung nicht stabil.** *(E4, 2026-08-12;
früher P-57)* 36–236 ms in derselben Bedingung — weil der verborgene Tab während des
Ladens gar kein Bild zeichnet, also genau in dem Fenster nicht, das der Vorwärmer
bedienen soll. Nach drei Anläufen: Drei-Strikes-Stopp. *Regel:* Messfläche für
Bildraten und Erstbild ist Kokis sichtbarer Schirm (`?perf=1`, `&warm=0`). GPU-Zeit über
`EXT_disjoint_timer_query` bleibt zulässig, weil sie GPU-ARBEIT zählt statt Wartezeit.
**★ Eingeschränkt am 2026-08-15 durch PB-44:** Kokis Schirm ist nicht mehr die EINZIGE
zulässige Messfläche — ein selbst gestarteter, sichtbarer Chrome zählt auch, **sofern eine
leere Kontrollseite im selben Lauf 60 fps zeigt**.

**PB-6 · Ein Cache-Buster am Commit wirft nach JEDEM Merge alles weg.** *(E4,
2026-08-12; früher P-58)* `?v=<COMMIT_SHA>` an jeder Kunst-URL bedeutete: wer direkt
nach einem Merge spielt — also Koki — bekommt strukturell IMMER den kalten Ladevorgang
über alle 298 Bilder (17–29 MB je Phase). *Regel:* Fingerabdruck je DATEI-INHALT, nicht
je Commit.

**PB-7 · `pnpm build` unter einem laufenden `next start` killt den Server.** *(E4,
2026-08-12; früher P-59)* Die Seite meldet „This page couldn't load", und man sucht den
Fehler im Code. *Regel:* nach jedem Rebuild `preview_stop` + `preview_start`.

**PB-8 · `cmd | tail && echo OK` prüft `tail`, nicht `cmd`.** *(E4, 2026-08-12; früher
P-60)* Ein grünes „REBUILT" erschien, während der Build gar nicht lief — er stand im
falschen Verzeichnis. *Regel:* Exit-Code getrennt holen (`cmd > log 2>&1; echo
"EXIT=$?"`), und Tor-Ketten immer mit `&&`, nie mit `;`.
(**Zweiter Vorfall: C3, 2026-08-15** — eine Torschleife meldete Code 0, obwohl alle sieben
Tore mit »command not found« gescheitert waren; nur die mitgedruckten Einzel-Exitcodes haben
es verhindert. Siehe **PB-56**.)
(**Dritter, vierter und fünfter Vorfall an EINEM Tag: G4, 2026-08-17** — `npx vitest` fand die
Binärdatei nicht und meldete **Exit 0** · eine Pipe nach `tail` verschluckte wieder den echten
Exit-Code · ein Tamper-Lauf scheiterte an `ERR_MODULE_NOT_FOUND` statt am Tor und sah dabei aus wie
ein bestandener Lauf. Jedes Mal war »grün«, was nie gelaufen war. **Sechster Vorfall: K5,
2026-08-18** — in genau der Sitzung, die diesen Eintrag schreibt: `node scripts/check-registers.mjs
… | tail -3; echo "EXIT=$?"` druckte `EXIT=0`, während das Tor einen echten Verstoß gemeldet hatte.
Keine eigene Nummer — dieselbe Falle, und dass sie in ihrem eigenen Register-Eintrag zuschlägt, ist
der Beweis, dass Vorsatz hier nicht reicht: Ausgabe in eine Datei, Exit-Code direkt hinter dem
Befehl.)

**★ Siebter Vorfall (H4, 2026-08-19):** `npx vitest` gibt es in diesem Baum nicht (`pnpm exec
vitest` bzw. `pnpm -r run test`) — und der Fehlschlag kam durch die Pipe wieder als `EXIT=0`
zurück. Keine eigene Nummer. Bemerkenswert ist nur noch, wie gleichförmig die Vorfälle klingen:
wer seinen Fall gegen diesen Eintrag hält, sucht das **Erkennungsmerkmal** — steht zwischen dem
Befehl und dem gelesenen Exit-Code irgendetwas, das selbst gelingen kann? Dann ist es dieser
Eintrag.

**PB-22 · Frag die laufende Klasse, ob sie deinen Code kennt — glaub nicht der URL.**
*(H1 Teil 3, 2026-08-14; früher P-65)* Der Live-Lauf sprach zuerst mit einem `next dev`
aus dem HAUPT-Klon, der auf Port 3000 stehen geblieben war — fremder, alter Code. Jede
Aussage „live geprüft" wäre falsch gewesen. Dieselbe Klasse: Port 3999 war von einem
fremden `frame-sink` belegt. *Regel:* eigener Port je Session, und vor jedem Live-Lauf
`typeof sim.<neueMethode> === "function"` prüfen.
**★ Erweitert am 2026-08-15 durch PB-66:** derselbe Haupt-Klon führt auch STATISCH in die
Irre — er steht auf einem fremden Zweig mit unversionierter Arbeit; Datei-Aussagen von
dort sind falsch, obwohl sie wie Befunde aussehen.

## Tests, Tore und Tamper

**PB-15 · Eine Prüfung, die man nicht zum Scheitern bringen kann, hat nichts bewiesen —
und ein Tamper beweist erst dann etwas, wenn er auf dem Fall läuft, wo richtig und
plausibel-falsch auseinandergehen.** *(Zweimal: G1 2026-08-13, früher P-67 · J1
2026-08-14.)* G1s erste Form-Gesetz-Fassung trug zwei Tabellen; der Tamper schaltete die
zweite ab und **kein einziger Test wurde rot**. J1 machte die Rechenformel seines
Kontrast-Messgeräts absichtlich kaputt — **alles blieb grün, weil der Test GRAU
benutzte, wo beide Formeln dasselbe ergeben**; erst ein Farbfall daneben ließ den Tamper
fallen. J1 nennt das den wertvollsten Moment der Nacht, und zu Recht: ein bestandener
Tamper heißt, dass die Prüfung blind ist. *Regel:* Der Selbsttest wird auf dem Fall
gebaut, der die beiden Antworten trennt. Und eine Ausnahme muss eine **strengere**
Pflicht kaufen und etwas **unterdrücken** — sonst gehört sie gelöscht.
**★ Nachtrag 2026-08-15:** dieselbe Regel kam in der Welle 4 aus **drei** Richtungen
zurück (F5: ein Tamper, der grün bleibt, hat eine Regel gefunden, die keinen Fall hat ·
H2: ein Gesetz, das nie rot war, ist eine Behauptung · A6: eine Ausnahme ohne Bestellung
dahinter ist der Defekt mit Papieren) — keine davon hat eine eigene Nummer bekommen. Das
**Gegenstück** hat eine: **PB-74**, das Tor, das am falschen Fall rot wird.
**★ Vierter Vorfall (C4, 2026-08-17), die Tamper-Form:** beim Zurückschreiben eines Literals blieb
der Wert-Test grün und **nur** der Quelltext-Test wurde rot — genau die Unterscheidung, für die er
existiert. Wäre auch der Wert-Test gefallen, hätte der Tamper nichts über die Unterscheidung
gesagt. Regel-Zusatz aus diesem Fall: *ein Tamper, der ALLE Prüfungen rot macht, ist so wenig
aussagekräftig wie einer, der keine rot macht.* Keine eigene Nummer; die Mechanik, mit der ein
Prüfsatz die Unterscheidung verliert, steht als **PB-106**.

**PB-18 · Eine Projektion der Quelle ist nicht die Quelle.** *(H1 Teil 2, 2026-08-14;
früher P-61)* Der Testraum in `entities.test.ts` hat Boden in Reihe 12, die Tafel fliegt
in Reihe 11 — Kreide zerbricht dort, bevor sie ein Kind erreichen kann. Die
Anti-Softlock-Prüfung lief deshalb **monatelang grün über einen Softlock, der live auf
der Produktion stand**. *Regel:* Jedes Kampf-Gesetz liest `shippedArena()`. Allgemein:
was ein Gesetz prüfen soll, bekommt die echte Auslieferung vorgesetzt, nie ein
handgebautes Modell davon.
**★ Zum zweiten Mal bestätigt (H2, 2026-08-15):** die Landung auf dem Kreide-Kisten-Podest
hätte kein Test gemeldet, »weil jeder Test sein eigenes flaches Zimmer benutzt«. Keine
zweite Nummer — dieselbe Falle, zweiter Vorfall.
**★ Zum dritten Mal bestätigt (F6, 2026-08-17), und diesmal in der Auslieferung:** die Füllfeder
hatte einen vollständig implementierten, korrekt getesteten Anfall — und im ausgelieferten p2 über
**6000 Ticks null** davon. Der Anfall wird aus `e.timer` fällig, den jeder Zustandswechsel nullt;
ihre längste ununterbrochene Patrouille misst 192 Ticks, ihre Schwelle stand auf 216. Eine Schwelle
über der längsten erreichbaren Strecke ist kein seltenes Ereignis, sondern gar keines. Die Tests
prüften die Funktion, nicht das Level. *Zusatz zur Regel:* wo ein Zustand aus einer Uhr fällig
wird, zählt der Wächter ihn im **ausgelieferten** Level und pinnt die Zahl. Keine zweite Nummer.

**PB-19 · Zwei Handlisten heißt: ein neues Feld muss in BEIDE.** *(H1 Teil 2,
2026-08-14; früher P-62)* `record-paint-tape.mjs` stempelt aus einer Handliste,
`worldAssertionErrors` vergleicht aus einer zweiten. Ein neues Band-Feld, das nur in
einer steht, ist totes Wort. Zweimal hintereinander passiert — erst nicht gestempelt,
dann nicht verglichen —, **beide Male nur vom Tamper gefunden**. *Regel:* beim Anlegen
eines Band-Feldes beide Listen im selben Commit anfassen.

**PB-20 · Ein Test, der den Schleier nie hebt, kann keine Haltezeit prüfen.** *(H1 Teil
2, 2026-08-14; früher P-63)* `solveTask` räumt `overlayOpen` selbst ab; wer danach nicht
`setOverlay(true)` ruft, prüft eine offene Welt, in der der Takt ohnehin läuft. Der
Tamper lief glatt durch, bis die Zeile stand. *Regel:* der Testaufbau stellt den Zustand
her, den er behauptet zu prüfen — und der Tamper sagt, ob er es getan hat.

**PB-23 · Ein Kritiker-Befund ist eine Spezifikation, keine Messung.** *(J1,
2026-08-14)* Ein Kritiker nannte zwei Kartenbilder „pixelidentisch bis auf den Rahmen".
Nachgemessen: **36–44 % der Pixel unterscheiden sich**. Sein URTEIL — der Wechsel ist zu
klein, beides liest sich noch wie ein Dialogfeld — blieb trotzdem richtig und wurde
umgesetzt. In dieselbe Richtung geht der eigene Irrtum derselben Nacht: Sprenkel am
blauen „C" wurden für einen Magenta-Saum gehalten, gemessen waren es **null** Pixel im
kritischen Bereich. *Regel:* Das Urteil eines Kritikers ist die Bestellung; jede ZAHL
darin misst man selbst nach, bevor man sie weiterträgt.
**★ Zweiter Vorfall (C4, 2026-08-17):** zwei blinde Prüfer meldeten »das Gold der Buchecken ist
mitgefärbt/ausgebleicht« — nachgemessen sind **0 von 13 640** Gold-Pixeln verändert, sie sind
bytegleich; der Eindruck ist Simultankontrast (dasselbe Gold wirkt neben Rot blasser als neben
Blau). Ein zweiter Befund derselben Runde (»ein roter Pixel mitten auf dem goldenen Beschlag«)
existierte, saß aber auf einem weißen Glanzlicht. Beides steht in den Protokollen, damit die
Nachbestellung keine Arbeit an einem Phantom verlangt. Keine zweite Nummer — dieselbe Falle.
**★ Dritter Vorfall, diesmal mit dem umgekehrten Ausgang (P7, 2026-08-22):** zwei Kritiker-Zahlen sahen
aus wie ein Widerspruch (»maximal 43 von 765« gegen eine gegenteilige Lesart). Nachgerechnet hatten
**beide recht** — und die Rechnung erklärte die Spaltung des blinden Panels besser als jedes der beiden
Urteile für sich. *Zusatz zur Regel:* eine widersprüchliche Zahl ist erst dann ein Widerspruch, wenn man
beide Rechenwege kennt; sonst ist sie eine Frage.

## Karten, Pools und Inhalt

**PB-9 · `sim.ts` erlöst ein Wesen bei JEDER gelösten Encounter-Karte.** *(G1,
2026-08-13; früher P-61)* Bei den drei doppelzuständlichen Wesen — Radierer, Füller,
Heft sind verwunschen UND entfärbt — stand die Farb-Karte nicht auf Pool-Platz 1. Folge:
**die Farbe kam zurück, ohne je gefragt worden zu sein**, an 3 von 9 Restore-Karten, in
der Kern-Mechanik des Kapitels. *Regel:* Wo ein Wesen zwei Zustände hat, steht die Karte,
die den zweiten auflöst, an Platz 1 — heute Gesetz 14e.

**PB-10 · `seededShuffle` hängt an der Karten-ID — also ist die AUTOREN-Reihenfolge der
einzige Hebel auf die Bildschirm-Position.** *(G1, 2026-08-13; früher P-62)* Merles sechs
Runden legten **4 von 6 Antworten auf dieselbe Stelle** (67 % lösbar durch bloßes
Antippen). *Regel:* Antwort-Reihenfolge beim Autoren variieren — heute Gesetz 16e.

**PB-11 · Ein Pool ist ein KREIS.** *(G1, 2026-08-13; früher P-63)* „Keine zwei gleichen
Fragen nebeneinander" ist nur erfüllbar, wenn keine Frage mehr als ⌊n/2⌋ der Plätze
hält. Drei Karten mit zwei Befehlen schaffen es in KEINER Reihenfolge. *Regel:* Wer ein
Nachbarschafts-Gesetz schreibt, rechnet die Grenze aus, bevor er es scharf stellt.

**PB-12 · Nach Kunst-SKIN gruppieren ist nicht nach Wesen gruppieren.** *(G1,
2026-08-13; früher P-64)* Alle vier Käfige teilen den Skin `satchel`, stehen aber in vier
Phasen mit vier verschiedenen Insassen; das Gesetz beschuldigte Musikanlage, Tablet,
Stuhl und Klassenfoto, EIN Wesen zu sein. *Regel:* die richtige Einheit ist der
aufgelöste POOL, nicht das Bild.

**PB-13 · Ein Gesetz, das ein höherstehendes aufhebt, ist falsch skopiert.** *(G1,
2026-08-13; früher P-65)* B12 („ein Wesen, eine Frage") galt versehentlich auch für die
Tür — und Gesetz M-E verlangt von deren Serie ausdrücklich Imperative UND Fragen UND
Negationen. *Regel:* Beim Scharfstellen eines Gesetzes prüfen, welches höherstehende es
berührt; ein Gesetz, das ein anderes unmöglich macht, ist zu weit gefasst.

**PB-14 · Blinde Löser finden die Rückschritte des AUTORS.** *(G1, 2026-08-13; früher
P-66)* Zwei blinde Löser (sie sehen nur, was das Kind sieht — keinen Schlüssel, einander
nicht) fanden zwei Verschlechterungen, die derselbe Autor eingebaut hatte: der
Käfig-Karte war der deutsche Insassen-Name genommen worden — **der Story-Spine sagt
vorher, dass genau das die Karte unlösbar macht** —, und ein Kognat-Fix hatte einen
falschen Freund geschaffen („WIE sie heißt" zieht auf „How are you?"). Dieselbe Runde
zeigte: **„tippe die längste Antwort" gewann auf 7 von 12 Karten.** *Regel:* Ein Kognat,
das auf die RICHTIGE Antwort zeigt, ist das erklärte Gerüst des Kapitels; eines, das auf
eine falsche zeigt, ist ein Fehler. Und was zwei blinde Löser unabhängig sagen, ist
Tatsache.
**★ Eingeschränkt am 2026-08-15 durch PB-57:** Tatsache ist, was sie **sehen** — die
**Ursache**, die sie dafür nennen, ist eine Hypothese (B4s Kritiker sahen richtig »kein
Sprung« und meinten die Kameraposition, nicht das Level).

**PB-16 · Die Wortbank-`forms` führen keinen Plural.** *(G1, 2026-08-13; früher P-68)*
`book` und `shoe` haben keinen Plural-Eintrag; ein Plural auf dem Bildschirm darf den
Wortbank-Eintrag dann nicht beanspruchen — Gesetz 13e weist ihn zu Recht ab. *Regel:*
Vor dem Belegen einer Form nachsehen, ob die Wortbank sie überhaupt führt.

**PB-21 · Eine trunkierende Ease erreicht ihren Rand nie.** *(H1 Teil 2, 2026-08-14;
früher P-64)* `trunc(dC / 48)` bleibt die letzten Subs vor dem Ziel bei Schrittweite 0
stehen — gemessen **0,07 px ausserhalb der Bühne, für immer**. Bei wanderndem Ziel behält
sie zusätzlich einen festen Rückstand (Schrittweite ÷ Rampenanteil). *Regel:* klemmen
statt rampen, oder das Ziel für die letzte Strecke einfrieren.

## Schreiben, Werkzeugketten, Register

**PB-17 · Das deutsche „…" mit ASCII-Schluss bricht auch PYTHON-Heredocs.** *(G1,
2026-08-13; früher P-69 — und in K1 am 2026-08-14 prompt wieder passiert.)* Bekannt war
es für JS/TS/JSON; es gilt genauso für Python-Skripte, die man per Heredoc in die Shell
schreibt: der ASCII-Schließer beendet den String mitten im Satz. *Regel:* in allem, was
in CODE steht, `»…«` benutzen; `„…"` bleibt Markdown und JSX-Text vorbehalten. Wer
deutschen Text in ein Python-Skript einbettet, nimmt einfache Anführungszeichen für die
Python-Strings.

**PB-24 · Ein Code-Kommentar ist keine Auslieferung.** *(K1, 2026-08-14)* Der ganze
Dossier-Satz von ch01 rechnete mit dem Gehtempo 1,25 px/t und begründete das mit einem
KOMMENTAR in `player.ts` („the sprint verb — ch13 unlock"). Die ausgelieferte
`ch01.level.json` vergibt `run` aber seit jeher, und ch01 stellt nirgends ein
`powerup` — das Kapitel läuft also durchgehend 2,25 px/t. Ein einziger veralteter
Kommentar hat fünf Dossiers falsch rechnen lassen. *Regel:* Eine Aussage über das
VERHALTEN wird an den ausgelieferten Daten belegt, nicht an einem Kommentar daneben —
und die Belegkette wird hingeschrieben, damit der nächste sie prüfen kann.

**PB-25 · Eine Zeilennummer in einer Doku altert still.** *(K1, 2026-08-14)* Alle 20
`datei.ts:123`-Verweise in den ch01-Dossiers zeigten noch auf existierende Zeilen — und
**keiner** zeigte mehr auf die gemeinte Stelle: `sim.ts:840` traf statt des ✕-Toasts eine
Entity-Abfrage, `PaintScene:4081` statt des Schild-Renderings einen Buchstaben-Kommentar.
Eine Bereichsprüfung („gibt es die Zeile?") hätte das nie gesehen. *Regel:* Verweise auf
Code stehen in der Form `` `datei#symbol` `` — ein Symbolname wandert mit seiner Zeile
mit. `scripts/check-registers.mjs` prüft das maschinell und verbietet die
Zeilennummern-Form.

**PB-26 · Eine Registernummer ist eine ADRESSE.** *(K1, 2026-08-14)* Das Schulden-Register
hatte 73 Zeilen und nur 61 verschiedene Nummern, weil drei Sessions an dieselbe Tabelle
angehängt und dabei je neu zu zählen begonnen haben; `D-33` war dreimal vergeben. Damit
war jeder Verweis aus Code, Import-Skript oder Passover mehrdeutig — und zwei Verweise
zeigten nachweislich auf die falsche Zeile. Genau dieselbe Klasse hatte gleichzeitig das
Fallen-Register erwischt (P-61…P-66 doppelt zwischen G1 und H1). *Regel:* Wer an ein
Register anhängt, liest die höchste vergebene Nummer maschinell aus, statt zu zählen —
und ein Tor hält die Eindeutigkeit (`scripts/check-registers.mjs`).

## Die Animations- und Beweis-Lane (F1–F4, 2026-08-11/12)

_Nachgetragen von K1 am 2026-08-14. Diese Lehren sind ÄLTER als PB-1…PB-26, stehen aber
hinten, weil ein Register angehängt und nie umnummeriert wird. **Aus den vier F-Berichten
sind 24 übertragbare Lehren belegt worden; hier stehen die 13 eigenständigen KLASSEN.**
Die vollständige Auslese liegt in den Berichten selbst
(`PLATFORM MASTER/SESSION-PROMPTS/REPORTS/REPORT_F1…F4`)._

**PB-27 · Eine offene Karte friert die Welt ein — und der Wächter dagegen muss WÄHREND
der Aufnahme laufen, nicht davor.** *(Dreimal: F1 2026-08-11 als Ursache im Code · F2
2026-08-11 · F4 2026-08-12.)* F2s erste vierzehn Käfig-Bilder waren vierzehnmal dasselbe
Bild, weil der Käfig-Hinweis aufgegangen war; aufgefallen ist es nur, weil die Drehung
nachgemessen wurde statt den Bildern zu glauben — rund eine Stunde weg. F4 hat trotz
dieser Lehre **erneut 26 Bilder verworfen**, weil sein Wächter nur vor der Serie lief.
*Regel:* Pixel-Diff über die laufende Serie, nicht als Vorprüfung — und zwei Aufnahmen
mit einem Schritt dazwischen müssen sich unterscheiden (s. PB-4).

**PB-28 · Prüfe das Referenzmaterial, bevor du dagegen vergleichst.** *(F2, 2026-08-11)*
Der Rayman-Ausschnitt für den Absprung-Vergleich enthielt gar keinen Absprung — beide
blinden Prüfer meldeten unabhängig, diese Seite „verlasse den Boden nie". Die ganze
Vergleichsrunde war ungültig. F3 fand die Ursache: es war der Space-Mama-Kampf, in dem
Rayman am Boden liegt. *Regel:* Der Ausschnitt wird vor der Runde daraufhin angesehen, ob
er das Ereignis überhaupt enthält; der verifizierte Absprung-Ausschnitt steht seither im
AAA-Mandat namentlich (03-jump-tap, Bild 60, Fenster 57–108).
**★ Zweiter Vorfall — und der erste, bei dem die Regel GEHALTEN hat (P7, 2026-08-22):** vor der
Panel-Runde wurde der Referenzsatz selbst angesehen und seine Prüfsummen gegen die Beschreibung
gehalten — **7 von 7 exakt** —, bevor ein Prüfer ein Bild bekam. Zugleich wurde eine kursierende
Verlust-Meldung dadurch widerlegt: der Satz war nicht weg, er war nur nicht nachgesehen worden.
*Zusatz zur Regel:* die Prüfung des Referenzmaterials ist auch die billigste Art, eine Behauptung
über SEINE Existenz zu prüfen.

**PB-29 · Ein Aufnahme-Werkzeug muss uhr-neutral sein — und das ist zu MESSEN.** *(F3,
2026-08-12)* F2 hatte berichtet, seine Bildstreifen seien „1 Bild = 1 Tick".
Nachgemessen kostete **jedes Bild drei Sechzigstel**, weil der Auslöser die Uhr
mittrieb. Eine vier Ticks kurze Anholung ist in Drei-Tick-Schritten gar nicht abbildbar
— der gesamte F2-Bildbeweis war gröber als behauptet. *Regel:* Bevor eine Bildserie als
Beweis gilt, wird nachgewiesen, dass das Aufnehmen die Simulation nicht weiterdreht.
**★ Ergänzt am 2026-08-15 durch PB-59:** eine uhr-neutrale Reihe kann trotzdem aliasen —
die Schrittweite muss die Periode der Bewegung unterbieten.

**PB-30 · Sichtbar ist nicht wirksam: die Zahl kann stimmen und die Wirkung null sein.**
*(Dreimal: F1 · F3 · F4.)* F1 parametrisierte das Käfig-Wackeln im WINKEL (±0,07 rad) —
auf einem 22 px hohen Käfig sind das 1,5 px Weg, „der Effekt existiert" war wahr und
trotzdem unsichtbar. F4 maß den ↑-Cue mit rund 16 px Weg, Zielgröße erfüllt — und der
blinde Prüfer sah zuerst das siebenmal größere Kreide-Wesen daneben: **zwei Sessions
Cue-Arbeit beantworteten die falsche Frage.** *Regel:* Sichtbare Ausschläge in
BILDSCHIRM-PIXELN parametrisieren, nie im Winkel. Und die Wirkungsfrage („wohin geht das
Auge zuerst?") getrennt stellen, in der ganzen Szene, nicht am isolierten Element.

**PB-31 · Ein gemaltes Ganzkörper-Bild schlägt jede Rig-Animation.** *(F3, 2026-08-12)*
Die komplette Gliedmaßen-Anholung war wertlos: für den Helden liegen dreißig fertig
gemalte Ganzkörper-Bilder vor, und passt eines zum Zustand, wird es STATT der
zusammengesetzten Gliedmaßen gezeichnet. Die Hände waren durch den ganzen Sprung
unsichtbar. *Regel:* Vor dem Animieren nachsehen, welche Ebene am Ende wirklich auf dem
Schirm landet.

**PB-32 · Widersprechen sich die eigene Messung und der Bildbeweis, gilt „unbewiesen" —
nicht die freundlichere Zahl.** *(F4, 2026-08-12)* Das laufende Spiel maß am Käfig rund
16 px Weg an der Oberkante; der blinde Prüfer fand im Pixel-Vergleich DERSELBEN Bilder
etwa 1 px und nannte den Ranzen „Möbel". F4 hat den Befund ausdrücklich offengelassen
statt sich für eine Zahl zu entscheiden — richtig so; Session W1 klärt den Widerspruch.
*Regel:* Zwei Messwege, die sich widersprechen, heben sich auf. Ehrlich offenlassen und
den Widerspruch zum eigenen Arbeitsposten machen.

**PB-33 · Die Diagnose im Auftrag ist eine Hypothese, keine Tatsache.** *(F1,
2026-08-11)* Der Auftrag sagte, das Quetsch-Bild des Radierers stehe „den größten Teil
des Bogens"; gemessen stand es **1 von 6 Sechzigsteln**, und die wahre Ursache war ein
3,6-px-Zittern. Ohne Nachmessen wäre die Reparatur am falschen Ort gelandet. *Regel:*
Vor der Reparatur die Behauptung des Auftrags nachmessen — auch die des Architekten. (In
K1 am 2026-08-14 prompt wieder bestätigt: der Auftrag nannte 4 doppelte Registernummern,
gezählt waren es 11.)

**PB-34 · Ein grüner Fix ist noch kein verträglicher Fix.** *(F1, 2026-08-11)* Die
Rückstoß-Reparatur war geschrieben und grün. Erst die Messung DANACH zeigte: p2 löst
zwölf Berührungen in einem Durchlauf aus, der Test-Pilot erreicht das Phasen-Ende nicht
mehr. Aus einer Fehlerfrage wurde eine Design-Entscheidung für Koki. *Regel:* Nach dem
grünen Test die Spielfolgen messen — ein Gesetz kann stimmen und das Kapitel unspielbar
machen.

**PB-35 · Feel-Korrekturen werden GEZEICHNET, nicht in die Simulation gerechnet.** *(F2,
2026-08-11)* Der naheliegende Weg — den Absprung um zwei, drei Ticks verzögern — hätte
Steuerung UND jedes aufgezeichnete Band bewegt. Richtig war, die ersten drei Ticks nur
geduckt zu ZEICHNEN; der Zähler dafür lag bereits vor. Ergebnis über F2/F3/F4: die
Proof-Tapes blieben durchgehend unverändert grün. *Regel:* Was nur anders AUSSEHEN soll,
wird in der Darstellung gelöst; die Physik anzufassen kostet jedes Band.

**PB-36 · Schwellwerte aus der Physik ableiten, nicht raten.** *(F4, 2026-08-12)* Der
geratene Schwellwert für den zweistufigen Aufstieg gab der zweiten Zeichnung genau EIN
Sechzigstel. Aus der gemessenen Geschwindigkeitsleiter abgeleitet, nimmt die Schwelle
eine spätere Physik-Änderung von selbst mit. *Regel:* Eine Konstante, die aus einer
anderen folgt, wird als Formel geschrieben, nicht als Zahl. (⚠ Gegenprobe aus K1:
`SKID_SPEED` IST als Formel geschrieben — aus zwei Gangarten, die es nicht mehr gibt.
Eine Formel muss auf Größen zeigen, die noch gelten; siehe D-86.)

**PB-37 · Der blinde Kritiker bekommt auch die eigene FRISCHE Änderung vorgelegt.**
*(F4, 2026-08-12)* Der Prüfer bestätigte die Anholung — und fand im selben Durchgang
einen neuen Fehler in genau dem, was diese Session gebaut hatte: der Wechsel zwischen den
beiden Aufstiegs-Zeichnungen ist ein harter Schnitt ohne Zwischenbild. *Regel:* Die
Kritiker-Runde deckt nicht nur den Ausgangsbefund ab, sondern auch das eben Gebaute.

**PB-38 · Rot durch Zeitlimit ist kein Defekt — den Test einzeln nachfahren, bevor man
ihn meldet.** *(F1 und F2, 2026-08-11)* Zwei inhaltsschwere Dateien brauchen auf
ausgelasteter Maschine 7–96 s und kippen in ein 5- bzw. 30-Sekunden-Limit; allein
gefahren grün. Die Suite meldete dadurch „781 von 782". *Regel:* Einzeln nachfahren, das
Ergebnis so berichten — und ein Test, der bei ~90 % seines Limits läuft, ist ein latenter
Wackelkandidat: das Limit hinschreiben statt es zu erben.
**Nachtrag K1, 2026-08-14 — die Variante, die keinen Testnamen nennt:** dieselbe Suite lief
morgens 967/967 in 63 s und nachmittags als »1 failed | 966 passed«, während zwei
Prüfer-Subagenten die Maschine auslasteten. Der Fehlschlag hatte **keinen Testnamen** — die
einzige Fehlermeldung war `Timeout calling "onTaskUpdate"` aus vitests eigenem
Worker-Kanal (`rpc.js` `onTimeoutError`). Es war also kein Gesetz rot, sondern ein Worker
stumm. Mit `npx vitest run --maxWorkers=3` wieder 44/44 Dateien und 967/967 Tests.
*Erkennungsmerkmal:* steht in der Zusammenfassung eine gescheiterte Datei, aber im ganzen
Lauf kein einziges `✗` mit Testnamen, dann ist die Maschine das Problem, nicht der Code —
Parallelität senken und erneut fahren, bevor irgendetwas gemeldet wird.
**★ Dritter Vorfall (W2, 2026-08-15) — auf UNVERÄNDERTEM `origin/main` nachgemessen:**
1013 von 1013 Tests grün, trotzdem Exit 1. Damit ist belegt, dass der Ausgangs-Code hier
nichts über den Zweig aussagt. Im Schulden-Register ist **D-116** die kanonische Adresse
dieser Familie (D-157 verweist dorthin; **D-197 ist eine andere Sache** — das 30-s-Limit
eines einzelnen Tests, Fix bei W3).

**PB-39 · Ursachensuche frisst die kleinen Nebenaufträge.** *(F3, 2026-08-12)*
Cue-Lockung und Käfig-Wackeln blieben in F2 UND F3 unbeurteilt, weil das Budget in die
Anholung und deren Ursachensuche ging — der Bericht schreibt es selbst als Muster hin.
*Regel:* Die kleinen Posten zuerst, dann die große Grabung; sonst wandern sie rundenweise
mit und niemand merkt, dass sie nie beurteilt wurden.

> **Strukturell erledigt, deshalb kein eigener Eintrag:** F1 fand zwei Tore, die sich im
> eigenen Kopf „Pflicht" nannten und nie in der CI liefen. Das ist seit E2 kein
> Merk-Posten mehr, sondern ein Tor: `scripts/check-ci-gates.mjs` erzwingt, dass jedes
> `scripts/check-*.mjs` in `.github/workflows/ci.yml` verdrahtet ist. So sieht die
> Auflösung einer Falle aus — sie verschwindet aus dem Gedächtnis und wird eine Maschine.

## Nachtrag vom Rebase-Tag

**PB-40 · Eine Umnummerierung gilt nur bis zum nächsten Merge — der bereits gemergte
Zweig behält die Nummern.** *(K1, 2026-08-14, am eigenen PR erlebt.)* K1 hat das
Schulden-Register entdoppelt und die verschobenen Zeilen ab D-62 neu vergeben. Während
der PR auf den Merge wartete, landete W1 zuerst — und hatte parallel **D-62…D-68** für
seine eigenen sieben Befunde belegt. **Die Kollisionsklasse, gegen die K1 gebaut war,
ist K1 selbst passiert**, und zwar unvermeidbar: zwei Zweige können dieselbe freie
Nummer sehen, solange keiner von beiden gemergt ist. *Regel:* Wer ein Register
umnummeriert, rechnet damit, es beim Rebase noch einmal tun zu müssen — und tut es nach
der einen Regel, die keinen Streit kennt: **die bereits gemergte Vergabe behält ihre
Nummer, der offene Zweig weicht aus.** Mitzuziehen sind dann NICHT nur die Zeilen,
sondern auch die Umrechnungstabelle, jeder Code-Querverweis und jeder Verweis aus
anderen Registern (in K1 waren das drei Code-Stellen und ein PB-Eintrag). Und: der
PR-Text und die Commit-Nachrichten tragen danach veraltete Nummern — deshalb bekommt der
Register-Abschnitt einen datierten Nachtrag, der sagt, welche Quelle maßgeblich ist.
*Vorbeugend:* wo zwei Wellen gleichzeitig an ein Register anhängen, ist das ein heißes
Feld (P-8) — entweder serialisieren, oder die Nummernvergabe erst beim Merge festlegen.


**PB-41 · Die Form des Codes ist die Form der Lücke.** *(G2, 2026-08-14.)* Die
Giveaway-Prüfung war neun handgeschriebene Aufrufe in einem `switch` — und vier Arten
hatten schlicht keinen. Kein Gesetz war verletzt, kein Test rot, das Tor meldete seit
Monaten grün über alle 54 Karten: die Regel galt einfach für 42 davon. Genau diese vier
Arten sind die Boss-Batterie, also war die schärfste Prüfung des Kapitels die
ungeprüfte. *Regel:* Wo eine Regel je Fall EINZELN angeschlossen wird, ist die Zahl der
Anschlüsse die eigentliche Abdeckung — nicht die Existenz der Regel. Solche Regeln
bekommen EINE Projektion über die ganze Union (hier `answerSurfaceOf`-Muster), damit der
erschöpfende `switch` das Vergessen unmöglich macht. Und: **frag bei jedem Gesetz, wie
viele der Fälle es wirklich erreicht, bevor du seinem Grün glaubst.**
**★ Zweiter Vorfall (C2, 2026-08-15) — dieselbe Falle in einer Textregel statt in einem
`switch`:** ein Gleichnis-Muster verlangte einen Artikel nach »wie« und traf damit 7 von
9 Fällen (»wie warmes Holz«, »wie frisches Brot« fielen durch). Gefunden erst beim
**Auszählen vorher/nachher**. Ergänzte Regel: wer eine Klasse abschafft, zählt sie vorher
und nachher — die Differenz deckt die Löcher in der eigenen Regel auf.

**PB-42 · Ein Tamper kann durch das FALSCHE Gesetz rot werden.** *(G2, 2026-08-14 —
Schwesterfall zu PB-15.)* Der Tamper für die Tafel-Kreide (»die Kreide trägt die
Korrektur«) schlug rot — aber nicht bei der neuen Schicht 18e, sondern bei Schicht 1,
deren Boss-Evidence-Invariante schon verlangt, dass das fehlerhafte Wort auf der Tafel
steht. Gezählt hätte er trotzdem: rot ist rot. Bewiesen hätte er nichts. Aufgefallen ist
es nur, weil derselbe Tamper einmal am echten Kartensatz und einmal am Selbsttest lief
und die beiden verschiedene Meldungen brachten. *Regel:* Ein Tamper zählt erst, wenn die
Meldung geprüft wird, die er auslöst — nicht die Tatsache, dass etwas rot wurde. Der
Fall gehört so gebaut, dass NUR das neue Gesetz greifen kann (hier: den fehlerhaften
Satz stehen lassen und die Korrektur DANEBEN kreiden).

**PB-43 · Ein blinder Prüfer, der ein Bild nicht sehen kann, urteilt über eine halbe
Karte.** *(G2, 2026-08-14.)* Zwei frische Prüfer nannten dieselbe Boss-Karte unabhängig
»nicht lösbar«: im Text stehe nicht, wer da spricht. Am Bildschirm ist es unübersehbar —
ihr Porträt sitzt oben auf der Karte und dieselbe Tafel steht daneben im Raum. Dazu kam
ein echter Fund derselben Familie: die Projektion zeigte bei `mistake`-Karten den Satz,
aber nie die drei Verbesserungs-Knöpfe, die das Kind danach drückt — jeder Blind-Löser
hat dort seit jeher eine halbe Aufgabe beurteilt (Gegenstück zum Memory-Fall PK-R3b·W4b,
wo die Projektion zu VIEL zeigte). *Regel:* Vor jeder Blind-Runde prüfen, ob die
Projektion die Karte VOLLSTÄNDIG trägt; wo die Antwort am Bild hängt, wird am Bildschirm
geurteilt, nicht am Text. Ein »unlösbar« aus einer unvollständigen Projektion ist ein
Befund über das Werkzeug, nicht über die Karte.

## R5-Welle 4 · aus den Reports E5 und H1 (aufgenommen von K2, 2026-08-15)

> **Was diese Runde beim Aufnehmen gelernt hat.** E5 und H1 haben vierzehn Fallen gemeldet
> (E5 `P-72`…`P-78`, H1 `P-65`…`P-71`). Aufgenommen sind **acht**. Die anderen **sechs
> standen bereits im Register** — H1 hatte seine eigenen Befunde aus Teil 2 und Teil 3 im
> Architekten-Report neu durchnummeriert, sodass `P-67`…`P-69` und `P-71` dieselben Gesetze
> tragen wie **PB-18**…**PB-21**, und `P-65`/`P-66` dieselben wie **PB-22**/**PB-4**. Sie
> bekommen deshalb KEINE zweite Nummer, sondern nur eine Zeile in der Umrechnungstabelle —
> ein Gesetz, zwei Adressen, wäre genau der Fehler, gegen den dieses Register gebaut ist.
> Geprüft wurde das doppelt: von der aufnehmenden Session und von einem blinden Klassierer,
> der nur die 43 Einträge und die 14 Wortlaute sah. Beide kamen auf dieselben sechs.

**PB-44 · »Der Automatisierungs-Tab ist verborgen« gilt für die MCP-Flächen — NICHT für
einen selbst gestarteten Chrome.** *(E5, 2026-08-14; früher P-72.)* Ein mit
`--headless=new` selbst gestarteter Chrome zeigt seine Seite und lässt `requestAnimationFrame`
laufen; gemessen wurden **60,2 fps auf einer leeren Kontrollseite und 9 fps im Spiel im
selben Lauf**. Damit ist die bis dahin geltende Fassung von **PB-4**/**PB-5** zu weit
gefasst: nicht jede Automatisierung ist blind, nur die fremdgesteuerte Fläche ist es.
*Regel:* Bildraten dürfen aus einem SELBST gestarteten, sichtbaren Chrome berichtet werden —
aber **nur mit einer Kontrollmessung im selben Lauf, die 60 zeigen MUSS**. Ohne sie weiß
niemand, ob eine niedrige Zahl das Spiel beschreibt oder das Werkzeug. Aus einer
MCP-Browser-Fläche bleibt jede Bildraten-Aussage verboten.

**PB-45 · Eine Phaser-`Graphics` mit statischem Inhalt wird JEDES Bild neu
tesselliert.** *(E5, 2026-08-14; früher P-73.)* »Einmal beim Bauen gezeichnet« ist eine
Aussage über den eigenen Code, nicht über die Engine — der Quellkommentar sagte genau das
und die Engine hörte das Wort *statisch* nie. Drei solche Objekte trugen die Bildzeit,
nachdem 265 MB Texturen und 22 Zeichenaufrufe entfernt worden waren, **ohne dass sich die
Zahl bewegt hatte**. *Regel:* Statisches gehört in eine Textur
(`generateTexture`/`RenderTexture`), nicht in eine `Graphics`.

**PB-46 · Jede `TileSprite` legt eine EIGENE Kopie ihres Bildes auf der Grafikkarte
an.** *(E5, 2026-08-14; früher P-74.)* Belegt am Phaser-Quelltext (`updateTileTexture`) —
unabhängig davon, wie oft dasselbe Bild sonst verwendet wird. Zehn Kacheln desselben
Blattes sind zehn Texturen, nicht eine. *Regel:* `TileSprite`-Zahlen im Texturspeicher
mitrechnen; wo dieselbe Fläche mehrfach vorkommt, eine andere Bauart wählen.

**PB-47 · Ein Lastinjektions-Test, der die Last NACH dem Messpunkt verbrennt, misst
nichts.** *(E5, 2026-08-14; früher P-75.)* `sweep()`/`cpuBoundness` speiste seine
Rechenlast in demselben Bild ein, aber hinter der Stelle, an der die Bildzeit genommen
wird — die Zahl konnte sich strukturell nicht bewegen. E5 hat der Zahl anfangs geglaubt.
*Regel:* Bevor man einem Instrument vertraut, liest man nach, **WO** es misst; und ein
Instrument, dessen Ausschlag unmöglich ist, wird repariert oder gestrichen, nicht gedeutet.

**PB-48 · Verlustfreie PNG-Werkzeuge dürfen die Farbwerte durchsichtiger Bildpunkte
überschreiben.** *(E5, 2026-08-14; früher P-76.)* Gerendert ist das identisch — für ein
Repo, dessen Tore die ROHWERTE lesen, nicht: auf einem einzigen Blatt trugen **42 177
vollständig durchsichtige Bildpunkte neue Farbwerte**. Gefunden hat es der eigene
Pixel-Beweis beim ersten Lauf; der Gewinn fiel von 16,7 auf 13,2 % und war dafür
wasserdicht. *Regel:* **Pixelgleichheit heißt alle vier Kanäle, überall** — auch dort, wo
Alpha 0 ist. Nach jedem PNG-schreibenden Skript `art-recompress` + `check-png-identity`
(D-98).

**PB-49 · `createMs` misst nur `create()` — Sim, Raster und Kunst-Umfang entstehen im
KONSTRUKTOR.** *(E5, 2026-08-14; früher P-77.)* Arbeit aus `create()` in den Konstruktor zu
schieben verbessert die berichtete Zahl und sonst nichts; der Spieler wartet genauso lang.
*Regel:* immer **`bau + aufbau`** berichten, nie `createMs` allein. Eine Metrik, deren
Grenze verschiebbar ist, ist ohne ihre Nachbarzahl wertlos.

**PB-50 · Ein zweiter `@media (prefers-reduced-motion)`-Block bricht die beiden Parser des
End-States-Gesetzes auseinander.** *(E5, 2026-08-14; früher P-78.)* Beide greifen gierig
bis Dateiende; ein zweiter Block teilt den Text so, dass jeder von ihnen nur noch eine
Hälfte sieht — ohne Fehlermeldung. *Regel:* Neue Reduced-Motion-Regeln gehören **VOR** den
bestehenden Block, nicht in einen eigenen. (Verwandt: **PB-17** — dieselbe Familie
»Parser-Gier«, anderer Mechanismus.)

**PB-51 · `sim.step()` roh gerufen lässt Ereignisse unbeantwortet und friert die Welt
ein.** *(H1, 2026-08-14; früher P-70.)* Das sah wie ein Produktfehler aus und war der
Prüfaufbau: der Shell beantwortet die Sim-Ereignisse, der rohe Schritt tut es nicht.
*Regel:* im Harness `h.step()` rufen, das den Shell mitfährt — und wenn eine Welt im Test
einfriert, zuerst den Aufbau verdächtigen, dann das Produkt. (Gegenstück zu **PB-27**, wo
die Welt aus echtem Produktgrund einfriert.)

## R5-Welle 4 · aus den zehn Reports der Welle (aufgenommen von K3, 2026-08-15)

> **Was diese Runde beim Aufnehmen gelernt hat.** Die zehn Sessions der Welle 4 haben
> **35 Fallen als Fließtext** gemeldet (Nummern vergibt nur die K-Bahn, R70). Aufgenommen
> sind **28**. Von den sieben übrigen sind **vier Doppelungen bestehender Einträge** —
> dreimal **PB-15** (»ein Tamper, der grün bleibt« · »ein Gesetz, das nie rot war« · »eine
> Ausnahme, die keine Pflicht kauft« sind derselbe Satz aus drei Richtungen), einmal
> **PB-38** (Zeitlimit statt Testfehler), einmal **PB-18** (jeder Test benutzt sein eigenes
> flaches Zimmer) —, **zwei Kandidaten sind untereinander dasselbe Gesetz** (ein
> Messfenster, das den Rahmen statt das Objekt erfasst: F5s Bewegungsmesser und A6s
> Zell-statt-Stück-Messung stehen zusammen in **PB-58**), und **einer gehört gar nicht
> hierher** (G3s Vorschlag zum Kritiker-Raster ist eine Methoden-Lehre für die
> `fable-method`-Skill-Datei, nicht für dieses Register — an Fable geroutet).
> Geprüft wurde das wie beim letzten Mal doppelt: von der aufnehmenden Session und von
> einem **blinden Klassierer**, der nur die 51 bestehenden Einträge und die 35 Wortlaute
> sah, nicht die Zuordnung. Beide kamen auf dieselben vier Doppelungen; wo der Klassierer
> zusätzlich »lieber als Zeile am alten Eintrag« vorschlug, ist im Zweifel die eigene
> Nummer vergeben **und** der alte Eintrag mit einem Verweis versehen — eine Falle, die
> einen bestehenden Satz EINSCHRÄNKT, muss von beiden Seiten auffindbar sein.

**PB-52 · Ein Umbenennen ist nie nur ein Umbenennen — das Genus zieht Fürwörter auf
fremden Karten nach.** *(C2, 2026-08-15.)* Aus »der Füller« wurde »die Füllfeder«, und
damit standen auf drei anderen Karten Fürwörter falsch, die niemand angefasst hatte. Mit
dem Auge findet man das nicht: die falschen Zeilen sind grammatisch tadellos, nur nicht
mehr über dasselbe Wesen. *Regel:* Nach jeder Nomen-Änderung eine maschinelle Genus-Prüfung
über ALLE Zeilen desselben Wesens — die Änderung ist erst fertig, wenn diese Liste leer ist.

**PB-53 · Ein Ersetzen über alle Vorkommen trifft auch die Stelle, die richtig war.**
*(C2, 2026-08-15.)* Ein `replace_all` für »Sag, was es ist« korrigierte drei Karten und
brach die vierte — beim Buch war »es« korrekt. Der Durchlauf danach hat es gefangen, aber
nur, weil es einen gab. *Regel:* Copy-Änderungen gehen **je Karte, nie global**. Ein
globales Ersetzen ist eine Behauptung über jede Fundstelle, und die hat man nicht geprüft.

**PB-54 · Ein Tor darf nur behaupten, was es mit Abstand messen kann.** *(C2, 2026-08-15.)*
Braun und Orange sind derselbe Farbton; drei Herleitungen fanden keine sichere Trennung
zwischen ihnen. Statt die Schwelle zurechtzubiegen, bis sie die gewünschte Antwort gibt,
misst das Tor jetzt die **Familie** (Abstand 2,5 bis unendlich) und bindet das feine Wort
an eine **ratifizierte Zahl**, die bei einem Neuanstrich schal wird. *Regel:* Wo die
Messung nicht trennt, misst das Tor die gröbere Größe und macht die feine zur erklärten
Entscheidung. Eine erfundene Genauigkeit ist schlechter als eine benannte Grenze.
(Verwandt: **PB-36** — Schwellwerte ableiten statt raten; dort geht es um die Herkunft der
Zahl, hier um ihre Auflösung.)

**PB-55 · Ein Anker-Feld in einem Dossier kann Geschichte enthalten.** *(B4, 2026-08-15.)*
Ein neuer Prüfblock las alle Koordinaten aus der Anker-Spalte und fand in p3 sechs statt
drei — die drei zusätzlichen standen in einer »ALS GEBAUT«-Notiz **innerhalb** derselben
Tabellenzelle. Das Dokument war richtig, der Leser zu gierig. *Regel:* In einer Zelle, die
auch Prosa tragen darf, zählt **nur die erste fettgesetzte Gruppe**; was darunter
argumentiert wird, darf zitieren. Wer eine Tabelle maschinell liest, schreibt diese Regel
in den Leser, nicht in die Hoffnung.

**PB-56 · zsh trennt `$VAR` nicht in Wörter.** *(B4, 2026-08-15.)* Ein
`for spec in …; set -- $spec` übergab »p2 58,14« als EIN Argument und legte eine Datei
namens `shoot_p2 58,14.txt` an. Die Falle steht seit Wochen im Gedächtnis-Index und hat
trotzdem wieder zugeschlagen — deshalb steht sie jetzt hier, wo sie beim Arbeiten gelesen
wird. *Regel:* Literale Listen schreiben, nicht Variablen splitten (`${=VAR}`, wenn es
unbedingt sein muss) — und den **ersten** Durchlauf einer Schleife ansehen, bevor man ihr
glaubt.
(**Zweiter Vorfall: C3, 2026-08-15** — `for g in "$LISTE"; do $g; done` rief jede Zeile als
EINEN Befehlsnamen auf; alle sieben scheiterten mit »command not found«, und **die Schleife
endete trotzdem mit Code 0** — das ist **PB-8**. C3 hat die Falle als neu gemeldet; sie ist
es nicht, deshalb steht sie hier und hat keine eigene Nummer bekommen. Zweimal dieselbe
Falle in einem Monat heißt: die literale Liste ist keine Stilfrage.)
(**Dritter Vorfall: S1, 2026-08-17** — `for g in "check-x.mjs --selftest"; do node scripts/$g; done`
suchte eine Datei namens »check-x.mjs --selftest«; **sieben Tore meldeten rot, die in Wirklichkeit
grün waren**, darunter fremde, die in CI laufen. Dreimal in einem Monat, und diesmal in der
gefährlichsten Richtung: eine rote Lampe, deren Ursache im Aufruf liegt, kostet Vertrauen in die
Tore selbst. Keine eigene Nummer.)
(**Vierter Vorfall: W6, 2026-08-22** — `node scripts/$c` mit `c="datei.mjs --flag"` suchte wieder eine
Datei mit einem Leerzeichen im Namen; **vier Tore sahen dadurch aus, als wären sie kaputt**. Die Regel
stand in der Definition of Done DIESER Bahn — und ist trotzdem passiert. Viermal in acht Tagen; keine
eigene Nummer, aber die Lehre daraus ist eine Bauform, keine Aufmerksamkeit: `${=VAR}` oder literale Liste.)

**★ Vierter Vorfall (B5, 2026-08-19):** dieselbe Tor-Schleife, dieselbe Richtung — `node
scripts/"check-x.mjs --selftest"` als EIN Dateiname, **alle 15 Selbsttests meldeten Exit 1**, und
die Liste hätte als »Tore rot« ins Protokoll gehen können. Keine eigene Nummer. Der Zusatz dieses
Vorfalls ist ein Handgriff: **die erste Zeile jeder Schleife lesen, bevor man ihr glaubt** — eine
Wortsplitting-Falle sieht in Zeile 1 schon anders aus als ein echter Befund.

**PB-57 · Ein Kritiker-Urteil über ein Bild ist ein Urteil über die BILDAUSWAHL.**
*(B4, 2026-08-15.)* Zwei unabhängige Kritiker sagten übereinstimmend »hier gibt es keinen
Sprung« — und beide hatten recht, über die Kameraposition, nicht über das Level. Der
Sprung existierte, er war nur nicht im Bild. *Regel:* Konvergenz zweier Blinder beweist
die **Wahrnehmung**, nicht die **Ursache**. Vor jeder Ableitung aus einem Kritiker-Befund:
prüfen, ob das Bild die geprüfte Eigenschaft überhaupt zeigen konnte.
(Schränkt **PB-14** ein — »was zwei blinde Löser unabhängig sagen, ist Tatsache« gilt für
das, was sie SEHEN; die Diagnose bleibt zu prüfen.)

**PB-58 · Ein Messfenster, das nicht das Objekt umschließt, misst den Rahmen.**
*(Zweimal am selben Tag: F5 · A6, 2026-08-15.)* F5s Bewegungsmesser hatte den bewegten
Gegenstand nicht aus dem Fenster gefiltert; der Hintergrund dominierte die Korrelation und
das Werkzeug meldete »steht still«, wo das p1-Buch 7,56 px zurücklegte — **dieser Fehler
hat vier Sessions lang einen Widerspruch am Leben gehalten**. A6s Lieferant maß ganze
512er-Zellen statt der Stücke darin und zählte damit die breiten Bänder gestreckter Pixel
zwischen den Motiven mit; an den echten Kästen gemessen verschwanden drei von vier
FAIL-Befunden (Eck-Helligkeit 47,4 → 54,3). *Regel:* Vor jeder Messung das Fenster auf
das Objekt legen und **das benennen, was mitgemessen wird**. Eine Zahl über den falschen
Ausschnitt ist nicht ungenau, sondern über etwas anderes.

**PB-59 · `--pure` heilt die Uhr, nicht die Abtastung.** *(F5, 2026-08-15.)* Eine
bereinigte Bildreihe kann trotzdem aliasen: liegt die Schrittweite über der Periode der
gemessenen Bewegung, ist die berichtete Spanne Zufall. *Regel:* Die Schrittweite einer
Messreihe muss die Periode der Bewegung **unterbieten** — und die Periode gehört in den
Bericht, sonst kann niemand nachrechnen, ob sie es tut. (Verwandt: **PB-29** — dort geht
es darum, dass das Werkzeug die Uhr nicht treibt; hier darum, wie oft es hinsieht.)

**PB-60 · Ein frischer Worktree hat keine `.env.local` — und damit keine Lehrer-Tür.**
*(Zweimal unabhängig: W2 · F5, 2026-08-15.)* `git worktree add` bringt nur getrackte
Dateien mit; `apps/web/.env.local` mit `DEV_TEACHER_ID` ist gitignored. Ohne sie antwortet
`/play/1/buch` mit 307 auf `/signin`, jedes Foto-Werkzeug bricht mit »die Bühne wurde nie
gemalt« ab — und die Ursache steht in keiner Fehlermeldung. *Regel:* Erste Handlung jeder
Bahn nach `pnpm install`: die Datei aus dem Haupt-Clone kopieren (nie committen) und
`curl` gegen die Tür — **HTTP 200, nicht 307**, bevor irgendetwas gemessen wird.
(**Dritter Vorfall: F8, 2026-08-21** — diesmal zeigte die Fehlermeldung in die falsche Richtung: das
Weltbild-Werkzeug meldete »kein `__domigoPaint` — läuft der Dev-Server?«, und der Server lief. Die
Meldung nennt die Wirkung, nie die Ursache; die Kopier-Zeile oben ist deshalb der billigste Reflex der
ganzen Bahn.)

**PB-61 · Ein Anker, der sich mitbewegt, ist keine Zone.** *(F5, 2026-08-15.)* Merles
Gang-Zone wurde bei jedem Gang neu an ihrer **aktuellen** Position aufgehängt; ein
3000-Tick-Test erwischte sie 47 Teilschritte außerhalb ihres Raums. Jeder einzelne Schritt
war regelkonform, die Summe war es nicht. *Regel:* »Bleibt in ihrem Raum« heißt
**Heimatpunkt**, nicht letzter Schritt — und eine Zonen-Zusicherung wird über eine lange
Strecke geprüft, nicht über einen Schritt.

**PB-62 · Ein Zähler, der noch nicht gezählt hat, heißt ALLE, nicht KEINE.**
*(H2, 2026-08-15.)* Die Tafel war beim ersten Bild ausgerechnet blitzsauber, während das
Kind »vollgekritzelt« las: der Fortschritts-Zähler stand auf 0, und die Zeichenregel las 0
als »nichts mehr übrig« statt als »noch nichts abgewischt«. *Regel:* Bei jedem Zähler
zuerst den **Nullzustand** zeichnen und ansehen — das ist der Zustand, den jedes Kind als
erstes sieht, und der einzige, den kein Testlauf zufällig durchläuft.

**PB-63 · Gebacken und aufgehängt wird an der Fläche, die das Blatt WIRKLICH einnimmt.**
*(H2, 2026-08-15.)* Zwei getrennte Anläufe, dieselbe Klasse: 256 px auf 33 px verkleinert
macht aus Kreidestrichen Matsch, und die Schiefertafel misst 23 × 38 Welt-px und sitzt
8 px höher als der Text-Anker, an dem sie aufgehängt worden war. *Regel:* Vor dem Backen
die Zielfläche in Welt-Pixeln **messen** — Größe UND Ort — und danach malen. Eine
Auflösung ist keine Qualität, sondern ein Verhältnis.

**PB-64 · Ein Texturschlüssel ohne Version serviert nach jeder Änderung das ALTE Bild.**
*(H2, 2026-08-15.)* Solange der Schlüssel gleich blieb, lebte die alte Kritzelei weiter —
gemessen wurde an einem Bild, das der eigene Code nie gezeichnet hat. *Regel:* Jeder
zur Laufzeit erzeugte Texturschlüssel trägt eine Version, die sich mit dem Inhalt ändert;
und wer eine Änderung am Bild misst, prüft zuerst, dass er sein eigenes Bild vor sich hat.
(Verwandt: **PB-6** — dort war die Invalidierung zu gierig, hier fehlt sie ganz.)

**PB-65 · Wo eine neue Aufgabe in einer Reihenfolge stehen darf, ist ein Gesetz — kein
Geschmack.** *(H2, 2026-08-15.)* Der Auftrag schlug vor, neue Boss-Karten »z. B. nach
`boss.m1`« einzufügen. Das hätte den Build rot gemacht: ein Tor spielt den echten
Karten-Router dreimal ab einem frischen Zeiger durch und verlangt eine Zahl-Aufgabe unter
den ersten dreien — die stand auf Platz 3 und wäre auf Platz 4 gerutscht. *Regel:* Vor dem
Einfügen in eine bestehende Reihenfolge die Tore lesen, die diese Reihenfolge prüfen — und
das eigene Ergebnis mit einem Gesetz festschreiben, damit die nächste Einfügung nicht
still bricht.

**PB-66 · Der Haupt-Clone ist nicht der Hauptstand.** *(D3, 2026-08-15.)*
`~/Code/domigo-v2` steht auf einem fremden Zweig mit unversionierter Arbeit: dort wich
`overlay-css.ts` um **286 Zeilen** ab, und alle vier `captive_*.png` fehlten ganz.
Dateiaussagen von dort sind falsch, und zwar **überzeugend** falsch — sie sehen aus wie
Befunde. *Regel:* Jede Aussage über eine Datei kommt aus dem **eigenen Worktree** oder aus
`git show origin/main:<pfad>`. (Erweitert **PB-22**, das dieselbe Quelle für die laufende
Klasse regelt: dort die Frage »kennt der Server meinen Code«, hier »lese ich überhaupt die
richtige Datei«.)
(**Zweiter Vorfall: G4, 2026-08-17, an der anderen Kopie** — der **Lese-Spiegel des Architekten**
`~/Code/domigo-v2-g2` stand auf `d3a7eba` (#301) statt auf `origin/main`; drei Explore-Läufe
lieferten dadurch Zeilennummern 60–90 Zeilen daneben und eine Tot-Kunst-Decke von 61 statt 53. Wer
dort liest, liest die vorige Welle. *Zusatz:* das gilt für **jede** Arbeitskopie, die man nicht
selbst gerade angelegt hat — vor der ersten Aussage `git log --oneline -1` im Verzeichnis, aus dem
man liest. Keine eigene Nummer.)
(**Dritter Vorfall: P7, 2026-08-22, selbst gefangen und selbst entkräftet** — ein Teil der Skript-Läufe
lief aus dem Haupt-Clone statt aus dem eigenen Worktree. P7 hat die Folgen nicht behauptet, sondern
gemessen: der Unterschied zwischen beiden Ständen waren **drei** Dateien, und keine davon lag auf einem
Messpfad — Skripte, Spielcode und Inhalte waren zwischen beiden bytegleich. *Zusatz zur Regel:* wer den
Fehler bemerkt, rechnet den Abstand der beiden Stände AUS, statt die Messungen pauschal zu verwerfen
oder pauschal zu behalten.)

**PB-67 · Ein Backup ist nur so aktuell wie sein Zeitpunkt.** *(D3, 2026-08-15.)* Acht
geänderte Dateien lagen im Scratchpad; beim **zweiten** Durchlauf hat dieselbe, inzwischen
veraltete Kopie eine spätere Änderung stillschweigend zurückgenommen. Die Prüfsummen
sagten »identisch« — und sie hatten recht: identisch mit dem falschen Stand. *Regel:* Nach
jedem Zurückspielen den **zuletzt geänderten Wert selbst ansehen**, nicht nur Prüfsummen
vergleichen; und vor jedem zweiten Tamper die Sicherung neu ziehen. (Die Sicherung geht in
den Scratchpad, nie über git — `git checkout --` verwirft die unfestgeschriebene Arbeit
derselben Datei.)

**PB-68 · Ein Backtick in `overlay-css.ts` beendet das Stylesheet — auch im Kommentar.**
*(D3, 2026-08-15.)* Die Datei ist EIN Template-Literal; ein Backtick in einem Kommentar
zerlegt sie. Zweimal passiert, beide Male sofort vom Typecheck gefangen. *Regel:* In dieser
Datei nur »…«, auch in Kommentaren. (Dieselbe Familie wie **PB-17** — ein Zeichen, das in
einem scheinbar harmlosen Kontext die umschließende Quotierung beendet.)
**★ Stand 2026-08-15 (D3b): FÜNFMAL passiert** — D3a zweimal, D3b dreimal —, und eine
aufgeschriebene Hausregel hat es nicht verhindert. Deshalb hat die Datei jetzt einen
Wächter. Die eigentliche Lehre steckt im ersten Anlauf dieses Wächters und steht als
eigener Eintrag **PB-86**: er lag in der Suite, die das Stylesheet IMPORTIERT, und war dort
nutzlos.

**★ Weiterer Vorfall (D4, 2026-08-19):** `` `check-paint-art` `` in einem Kommentar schnitt die
Datei mitten durch, und der Fehler zeigte auf eine ganz andere Zeile (»Expected ; but found
check«). Keine eigene Nummer. *Rezept unverändert:* in dieser Datei ausschließlich »…« zitieren,
nie Backticks.

**PB-69 · Ein verborgener Tab kann einen Fehler VERSTECKEN, nicht nur eine Messung
verfälschen.** *(D3, 2026-08-15.)* Im fernsteuerbaren Tab stand die Karte in ihrer
Einblende eingefroren, und in genau diesem Zustand heben sich Drehung und Verkleinerung
fast auf — der Rad-Fehler war dort **nicht reproduzierbar**. Erst das Erzwingen des
Ruhezustands hat ihn gezeigt. *Regel:* Ein »geht doch« aus einem verborgenen Tab ist kein
Freispruch. Ein Negativbefund braucht dieselbe Fläche wie ein Positivbefund — den
sichtbaren, ausgelaufenen Zustand. (Erweitert **PB-4**/**PB-44**: dort verfälscht der
verborgene Tab Zahlen, hier verschluckt er einen echten Defekt.)

**PB-70 · Prüfe dein eigenes Dokument gegen das Tor, das du gerade gebaut hast.**
*(G3, 2026-08-15.)* Vormittags entstand ein Gesetz gegen Abdeckungs-Behauptungen ohne
Messung; nachmittags stand im eigenen Design-Dokument »jedes Kind begegnet jedem der neun
Wörter« — und die Zusage hing am **optionalen** Bonusraum hinter einer
Acht-Buchstaben-Tür. Ein blinder Kritiker fand es, nicht der Autor. *Regel:* Wer in einer
Session ein Tor gegen eine Behauptungsklasse baut, liest seine eigenen Ergebnisse
derselben Session einmal ausdrücklich gegen dieses Tor.

**PB-71 · Ein Zeichen, das »die eine Sache« bedeutet, verliert seinen Sinn durch
Wiederholung.** *(I2, 2026-08-15.)* Das gemalte Notizbuch war zuerst hinter JEDE Regel
gespannt — es ist EIN aufgeschlagenes Buch, also gehört es einmal ans Kapitel, nicht
hinter jeden Absatz; und die vier Beispiele trugen zuerst je einen Kreidestrich, der im
Haus die EINE Sache einer Karte markiert. Viermal untereinander sagt er nichts mehr.
*Regel:* Vor der Wiederholung eines Zeichens fragen, was es **einzeln** bedeutet — ein
Bedeutungsträger, der zum Muster wird, ist danach Dekoration.

**PB-72 · Die Naht-Prüfung hat eine ACHSE.** *(A6, 2026-08-15.)* Eine Seitenkante muss
senkrecht kacheln und waagrecht ausdrücklich **nicht** — sie hat eine gemalte Außen- und
eine geschnittene Innenfläche. Das Tor verlangte blind beide Achsen und bat damit eine
Wand, ein Rohr zu sein. *Regel:* Jede Kachel-Prüfung nennt die Achse, in der sie gilt;
eine achslose Naht-Regel meldet gute Kunst als Fehler.

**PB-73 · Ein Körper kann auf seiner Seitenfläche nicht seine Vorderseite zeigen — und
eine Motiv-Anforderung, die nicht in der Spec steht, kommt nicht.** *(A6, 2026-08-15.)*
Zwei blinde Kritiker reihten die neue, technisch einwandfreie Kante als LETZTE von vier,
unter den Platzhalter, den sie ersetzen sollte: sie malt Buchdeckel von vorn, wo der
Buchschnitt hingehört. Keine Messung dieser Session konnte das sehen. *Regel:* Zu jeder
Kunst-Bestellung gehört die **Motiv-Anforderung** (was die Fläche darstellt), nicht nur
Maß und Farbe — und ein Blatt, das geometrisch besteht und motivisch falsch ist, wird
zurückgehalten, nicht importiert.

**PB-74 · Ein Tor, das auf guter Kunst anschlägt, ist schlechter als eine ehrliche
Lücke.** *(A6, 2026-08-15.)* Eine Regel für die hellsten fünf Prozent wurde geschrieben
und **wieder gelöscht**, weil ihr eigener Selbsttest bewies, dass sie eine ehrliche
+8-Kante nicht von einer ausgebrannten trennt: beide liefern +9,7. Die trennende Größe war
nicht der Abstand, sondern das Ausbrennen auf Weiß. *Regel:* Ein Tor, das korrekte Arbeit
rot färbt, wird gelöscht und die Lücke benannt — im Code und im Register. (Gegenstück zu
**PB-15**: dort beweist ein Tor nichts, weil es nie rot wird; hier schadet es, weil es am
falschen Fall rot wird.)

**PB-75 · Grau kann keine Familie ändern.** *(A6, 2026-08-15.)* Eine graue Multiplikation
skaliert alle drei Kanäle gleich — sie bewegt den **Wert** und lässt die **Sättigung**
unberührt. Genau die war die Beschwerde: ein 37,2-%-Streifen neben einem 60,2-%-Körper.
Nebenbefund derselben Messung: eine Kante, die dunkler ist als ihre Fläche, ist eine
Rille. *Regel:* Farbkorrekturen werden aus der Richtung des Körpers **abgeleitet**
(Ton + Sättigung), nicht als Helligkeitsfaktor aufgesetzt.

**PB-76 · Ein neues Gesetz macht alten Inhalt falsch — zuerst im Dokument, das es
aufstellt.** *(K2, 2026-08-15.)* Der Story-Spine führte das österreichische Register ein
und benutzte selbst »Radierer« (2×), »Füller« (1×) und »Federmäppchen« (1×). *Regel:* Mit
jedem neuen Gesetz im selben Durchgang eine maschinelle Nachsuche über den **Bestand**
fahren — und die erste Datei in dieser Suche ist die, in der das Gesetz steht.

**PB-77 · Eine Abwesenheits-Behauptung, an `origin/main` gemessen, wird durch den eigenen
PR falsch.** *(K2, 2026-08-15.)* »Füllfeder und grantig kommen im ganzen Repo nicht vor«
stimmte im Moment der Messung und war ab dem Merge des PRs falsch, der beide Wörter
einführt. Eine Abwesenheits-Behauptung ist die Klasse, die am seltensten nachgeprüft wird.
*Regel:* Jede »X kommt nicht vor«-Aussage bekommt **Stand und Geltungsbereich** in
denselben Satz (»auf `<commit>`, außerhalb dieses PRs«) — oder sie wird nicht geschrieben.

**PB-78 · Ein naives `grep` zählt falsch, und die Zahl sieht trotzdem gut aus.**
*(K2, 2026-08-15.)* »wischen« findet »zwischen«; ein Lauf ohne `-I` zählt Treffer in
PNG-Dateien mit — bei »Uhu« waren das 233 statt 22. *Regel:* Zu jeder gezählten Zahl
gehört die **Zählmethode** in den Text (Wortgrenze, Dateifilter, Groß-/Kleinschreibung);
eine Zahl ohne ihr Rezept ist eine Behauptung.

**PB-79 · Ein optionales Feld, das eine Weiterreich-Zeile vergisst, ist typ-still.**
*(B4, 2026-08-15.)* `PaintScene` kopiert die Sim-Konfiguration Feld für Feld statt per
Spread; das neue Feld kam als `undefined` an, `typecheck` schwieg, und genau ein Test biss.
Ein optionales Feld ist genau deshalb still: es DARF fehlen. *Regel:* Jede handgeschriebene
Weiterreich-Stelle bekommt einen Wiring-Guard (Test oder Spread), sobald ein optionales
Feld dazukommt. (Dieselbe Familie wie **PB-19** — zwei Listen, die von Hand synchron
gehalten werden.)

**PB-80 · Ein JSON neu zu dumpen formatiert die ganze Datei um — auch wenn nur ein Feld
dazukommt.** *(K3, 2026-08-15 — beim Abschluss dieser Runde selbst hineingetreten.)* Die
Mission-Control-Karte wurde per `json.dump(..., indent=1)` geschrieben; die Datei stand aber
auf `indent=2`. Ergebnis: **1778 geänderte Zeilen für eine neue Karte** — und damit ein
Konflikt für jede andere Session, die dieselbe Datei anfasst. Aufgefallen ist es nur, weil der
`--stat` nach dem Commit gelesen wurde. *Regel:* Vor dem Schreiben eines fremden JSON das
**bestehende Format messen** (Einrückung, `ensure_ascii`, End-Newline) und beim Dump exakt
reproduzieren — oder chirurgisch editieren. Und nach jedem maschinellen Schreiben `git diff
--stat` lesen: eine Zeilenzahl, die nicht zur Änderung passt, ist der Befund.
(Dieselbe Familie wie die Level-Datei-Regel in `CONTRIBUTING.md`: nie neu erzeugen, nur
editieren — dort ist sie aufgeschrieben, hier ist sie zum zweiten Mal passiert.)

## R5-Welle 4b · aus den Reports der Welle (aufgenommen von K4, 2026-08-17)

> **Die Buchführung dieser Runde.** Zwei der sechs 4b-Sessions haben Fallen als Fließtext
> gemeldet und die Nummernvergabe ausdrücklich der K-Bahn überlassen (R70): **C3 fünf,
> D3b vier — neun Wortlaute.** Aufgenommen sind **acht** (PB-81 … PB-88). Der neunte,
> C3s »zsh zerlegt `$VAR` nicht«, ist eine **Doppelung von PB-56** — dasselbe Gesetz,
> derselbe Monat, ein zweiter Vorfall; er bekommt keine eigene Nummer, sondern eine
> Verweiszeile dort. Ein zweiter Halbbefund derselben Meldung (die Schleife endete trotz
> sieben »command not found« mit Code 0) ist **PB-8** und steht ebenfalls als Verweiszeile.
> Und D3bs Backtick-Meldung ist zur Hälfte **PB-68** (fünfter Vorfall, Verweiszeile dort) —
> ihr ungedeckter Kern, die Bauart des Wächters, steht als eigener Eintrag **PB-86**.
> Geprüft wie bei K3: von der aufnehmenden Session UND von einem **blinden Klassierer**,
> der nur die 80 bestehenden Einträge und die neun Wortlaute sah, nicht die Zuordnung.
> Er fand dieselbe eine Doppelung und dieselbe eine Absenz; wo er »lieber als Zeile am
> alten Eintrag« vorschlug, ist im Zweifel die eigene Nummer vergeben **und** der alte
> Eintrag mit einem Verweis versehen (R111).

**PB-81 · Ein Prüfer kann nur beurteilen, was das Bild bei beurteilbarer Größe hergibt.**
*(C3, 2026-08-15.)* Ein Blatt wurde auf BLATTGRÖSSE geprüft und durchgewunken; darin misst
das Motiv 480 × 275, und ein ein Pixel breiter, ausgefranster Gitterstab ist auf dieser
Verkleinerung nicht darstellbar. Der blinde Prüfer arbeitete am 8–10-fachen Ausschnitt und
behielt recht; bei 3× war es dann auch für die Session sichtbar. *Regel:* Prüfer bekommen
**Ausschnitte auf beurteilbarer Größe**, nie das ganze Blatt; wer den Ausschnitt nicht
macht, prüft die Verkleinerung. (Nachbar von **PB-57**: dort ist die BILDAUSWAHL das
Urteil, hier der MASSSTAB. Und die Gegenrichtung von **PB-30**, das die Wirkungsfrage
ausdrücklich in der ganzen Szene stellen lässt — Wirkung urteilt man im Ganzen, Defekte
findet man im Ausschnitt.)

**PB-82 · Eine Null aus einer selbst zusammengesteckten Prüfung kann vakuum sein.**
*(C3, 2026-08-15.)* Die eigene Saum-Gegenprobe übergab dem Prüf-Baustein ein rohes PNG
statt der erwarteten `{w,h,px}`-Hülle; seine Schleife lief **null Mal** und lieferte eine
leere Trefferliste. Beinahe hätte die Session dem echten Tor mit dieser Null widersprochen.
*Regel:* Eine Null von einer Prüfung, die man selbst zusammensteckt, gilt erst, wenn
derselbe Aufbau an einem Fall, der nicht null ist, seine Zahl auch wirklich zeigt —
Positivkontrolle vor Verneinung. (Familie **PB-15** — der Selbsttest wird auf dem Fall
gebaut, der die beiden Antworten trennt — und **PB-47**, wo das Instrument an der falschen
Stelle misst statt gar nicht.)
(**Zweiter Vorfall: G4, 2026-08-17, identischer Formfehler** — der Reparaturversuch übergab dem
Saum-Modul das rohe pngjs-Objekt (`{width,height,data}`) statt der erwarteten Hülle (`{w,h,px}`);
es fand **nichts** und meldete sauber, während das Tor unverändert zehn Blätter ablehnte. Ein
stiller No-Op sieht aus wie ein grünes Licht. Aufgedeckt hat es nur der Gegenlauf des echten Tors.
Keine eigene Nummer — dieselbe Falle, zweiter Vorfall, und die Schuld-Adresse dazu ist **D-297**.)

**PB-83 · Ein selbstkalibrierender Schwellwert macht eine harmlose Änderung zum Torfall.**
*(C3, 2026-08-15.)* Das Saum-Tor eicht sich je Bild an dessen eigenem Material. Ein
Entsättigen senkt damit die Grundlinie und legt Randpunkte frei, die immer schon da waren —
der korrekte Eingriff wird rot, ohne dass sich der Defekt geändert hätte. *Regel:* Eine
abgeleitete Schwelle darf sich nicht auf das Material beziehen, das sie beurteilt; wo sie
es doch tut, gehört der Bezugswert eingefroren und datiert. (**Schränkt PB-36 ein**: eine
Formel statt einer Konstante nimmt spätere Änderungen mit — aber eben auch die sachfremden.)

**PB-84 · Ein Prädikat, das in zwei Dateien liegt, ist zwei Tests.**
*(C3, 2026-08-15.)* Das Import-Skript und das Kunst-Tor benutzen verschiedene Formeln für
»magentafarbener Rand«. Ein Blatt, das der Importer durchlässt, sagt deshalb nichts darüber,
ob das Tor es durchlässt — und umgekehrt. *Regel:* Dieselbe Frage an zwei Stellen heißt
zwei Antworten; entweder in ein geteiltes Modul heben oder ausdrücklich hinschreiben, dass
das Bestehen der einen Stelle die andere nicht deckt. (Familie **PB-19** — zwei von Hand
synchron gehaltene Listen — und **PB-79**.)

**PB-85 · Der verborgene Tab friert CSS-Übergänge in ihrem STARTBILD ein und kann damit
einen Fehler ERFINDEN.** *(D3b, 2026-08-15.)* Die Abdunklung der Anzeigeleiste meldete dort
`opacity: 1`, obwohl die Klasse saß; mit abgeschaltetem Übergang sprang derselbe Knoten
sofort auf `0.26`. *Regel:* Messungen an Übergängen gehören in den selbst gestarteten,
**sichtbaren** Chrome — sonst misst man den eingefrorenen ersten Bildpunkt einer Animation.
(**PB-69** sagt, der verborgene Tab kann einen Fehler VERSTECKEN; das hier ist die andere
Hälfte desselben Satzes: er kann auch einen erfinden. Fläche und Kontrollmessung: **PB-44**.)

**PB-86 · Ein Wächter über eine Datei, die nicht mehr übersetzt, darf diese Datei nicht
importieren.** *(D3b, 2026-08-15.)* Der erste Anlauf des neuen Backtick-Wächters lag in der
Test-Suite, die das Stylesheet importiert — und starb an genau dem Importfehler, den er
melden sollte. Er war dort nutzlos, und gezeigt hat es der Tamper, nicht das Nachdenken.
*Regel:* Ein Wächter, der einen Syntax- oder Ladefehler fangen soll, liest seinen
Prüfgegenstand als **Text**, nie über den Import. Wer den Wächter baut, tampert ihn zuerst
kaputt und sieht nach, ob er noch redet. (Familie **PB-15** — eine Prüfung, die man nicht
zum Reden bringt, hat nichts bewiesen.)

**PB-87 · Ein Lieferschein ist eine Behauptung.**
*(D3b, 2026-08-15.)* Das Begleitpapier einer Kunstlieferung beschrieb ein Bild, das so nicht
geliefert wurde — zwei Zöpfe vorn links, ein kleiner Reflex neben den Gesichtern. Beides ist
in dreißig Sekunden am Blatt zu widerlegen. *Regel:* Kein Import ohne eigenen Blick auf das
Blatt; das Papier daneben ist eine Bestellung, kein Beleg. Das gilt auch — und gerade —
wenn das Blatt keine Textebene hat: ansehen, nicht abhaken. (Familie **PB-24**, ein
Kommentar ist keine Auslieferung, und **PB-73**, ein geometrisch bestandenes Blatt kann
motivisch falsch sein. Der Verfahrensteil steht als Ruling R91/R110: blinder Blatt-Prüfer
vor jedem Import, der DRAFT-Marker sitzt auf dem Lieferschein im Lab, nicht im Repo.)

**PB-88 · Eine »gescheiterte« Optik hat oft eine Ursache im eigenen Haus.**
*(D3b, 2026-08-15.)* Die abgebrochenen Ecken der gelieferten Wachskante sahen nach einem
Fehler des Blattes aus; gemessen war es der eigene Schatten-Stapel, der durch die
durchsichtige Kante schaute. Zwei Anläufe gingen verloren, weil die Ursache vermutet statt
gemessen wurde. *Regel:* Bevor eine Lieferung zurückgeht, wird der eigene Aufbau
ausgeschlossen — die Ebene darüber, der Schatten, der Kompositions-Stapel. (Familie
**PB-51**, dort friert der Prüfaufbau die Welt ein, und **PB-33**, die Diagnose im Auftrag
ist eine Hypothese.)

**PB-89 · Ein Wortverbot als Teilketten-Suche verbietet auch harmlose Wörter.**
*(K4, 2026-08-17 — in dieser Runde selbst hineingetreten.)* Das Design-Blatt-Tor verbietet
Bedrohungswörter, darunter »schrei« (für *schreien*). Geprüft wird per `text.includes()`, also
als **Teilkette** — und damit fallen `schreibt` und `beschreibt` mit. Drei Sätze, die den
Kanon korrekt wiedergaben (»die Klasse schreibt ihr die erste Lektion zurück«), machten das
Tor rot; der Fehler lag nicht im Text, sondern in der Regel. Umformuliert wurde trotzdem der
Text, weil `scripts/**` in dieser Bahn tabu ist — und das Tor-Loch steht als **D-278** mit
Eigentümer. *Regel:* Ein Wortverbot prüft auf **Wortgrenzen** (`\bschrei\w*` mit einer
Ausnahmeliste, oder die Wortliste ausgeschrieben), nie auf nackte Teilketten; und wer beim
Umformulieren merkt, dass er einem Tor ausweicht statt einen Fehler zu beheben, schreibt das
Tor-Loch auf, statt es zu vergessen. (Familie **PB-83** — eine Regel, die harmlose Arbeit rot
färbt — und **PB-74**.)
**★ Und es ist SOFORT wieder passiert:** derselbe Lauf, eine Stunde später, im Satz, der von
dieser Falle handelt (»eine Kanon-Runde, die Zahlen über gebaute Entitäten ändert, schreibt
Fiktion«). Das ist der Beweis für den Regel-Teil: solange die Prüfung auf Teilketten läuft, ist
kein Vorsatz stark genug — nach jeder Textänderung an einem Design-Blatt läuft
`check-design-sheets` **einmal**, bevor committet wird.

**PB-90 · Eine Sammel-Liste, die »alles Offene« verspricht, erntet nicht den Abschnitt, der
so heißt.** *(K4, 2026-08-17.)* Die »Filed, not acted on«-Liste der Welle 4b wurde aus den
sechs gleichnamigen Report-Abschnitten gebaut — 41 Zeilen, arithmetisch sauber. Ein blinder
Vollständigkeits-Prüfer hielt sie gegen die **ganzen** Reports und fand **41 weitere offene
Posten**, fast alle außerhalb dieser Abschnitte: eine komplette Kunst-Bestellung mit drei
Schulden, zwei ausdrücklich »NICHT ausgeführt« gemeldete Aufträge, vier verlorene
Kritiker-Verdikte, vier offene Lieferungen, eine halbierte Messung. Dazu vier Zeilen, die ein
Erledigt-Häkchen trugen, während ihre Quelle sie offen nennt. *Regel:* Wer eine
Vollständigkeits-Zusage macht, liest die Quelle **ganz** und sucht die offenen Punkte auch da,
wo sie nicht unter der erwarteten Überschrift stehen — »nicht verifiziert«, »als Nächstes«,
»Frage an den Architekten«, »Empfehlung«, und mitten in der Prosa. Und: **eine Adresse ist
keine Erledigung** — eine Schuld-Nummer zu vergeben schließt nichts. (Familie **PB-41** —
Abdeckung ist die Zahl der Anschlüsse, nicht die Existenz der Regel.)
**★ Zweiter Vorfall: K5, 2026-08-18 — in der Runde, die diese Regel als Doktrin aufgeschrieben
hat.** Die Welle-5-Liste wurde diesmal ausdrücklich in »Filed-Abschnitte« und »alles andere«
geschnitten, und der blinde Vollständigkeits-Prüfer fand trotzdem **zwölf** fehlende Posten —
darunter **Kokis drei älteste Tore** (Kartenkante · Regel-Seiten-Reihenfolge · Anker), während die
Liste im selben Atemzug »bei Koki: 8« behauptete. Elf der zwölf waren per Volltextsuche belegbar:
die Zeichenfolge kam **null** Mal vor. *Zusatz zur Regel:* eine Vollständigkeits-Zusage prüft man
nicht durch besseres Vorsatz-Fassen, sondern durch den blinden Prüfer — **jedes Mal**, auch wenn
die Runde die Regel selbst geschrieben hat. Und eine Zusammenfassung, die eine ZAHL behauptet
(»bei Koki: 8«), liefert die Aufzählung mit, damit die Zahl prüfbar ist.

## R5-Welle 5 · aus den acht Reports der Welle (aufgenommen von K5, 2026-08-18)

_**Ruling R144** hat diese Vergabe an K5 gegeben. Achtunddreißig Wortlaute kamen aus acht Reports
(C4 · G4 · B4b · F6 · E6 · W4 · S1 · K4). Ein
**blinder Klassierer** — er sah die 90 bestehenden Einträge und die 38 Wortlaute, nicht meine
Zuordnung — hat sie gegen den Bestand gehalten. Sieben sind Doppelungen und haben eine
**Verweiszeile am alten Eintrag** statt einer eigenen Adresse bekommen (R70/R111): sie stehen
bei PB-8, PB-15, PB-18, PB-23, PB-56, PB-66 und PB-82. Sechs weitere Paare waren untereinander
dasselbe Gesetz und teilen sich hier je eine Nummer. Bleiben 25 eigene Adressen._

**PB-91 · Ein Blatt braucht ZWEI Prüfgrößen, nicht eine.** *(C4, 2026-08-17; Ruling R133, seit
R152 für jede Codex-Lieferung Pflicht.)* Der 3- bis 6-fach vergrößerte Ausschnitt beurteilt das
Handwerk; die **echte Anzeigegröße** (die Karte zeichnet ein Blatt 132 Punkte hoch) beurteilt, was
beim Kind ankommt. In dieser Runde sagten die Blatt-Prüfer bei 5× zweimal »ZURÜCK«, und erst die
Kartengröße beantwortete, ob das Kind den Befund überhaupt sieht — bei einem der beiden Blätter
sah er es (»da klebt ein gelbes Stück Papier drin«), und das trug die Entscheidung. *Regel:* wer
nur eine Größe misst, entscheidet entweder über unsichtbare Fehler oder übersieht sichtbare.
(Schärft **PB-81**, das den Ausschnitt fordert, aber nicht die zweite Größe; Doktrin in doc 45 H9.)

**PB-92 · Eine Perf-Zahl ohne A/B im selben Lauf ist eine Meinung mit Nachkommastellen.**
*(Dreimal unabhängig: C4 · F6 · E6, 2026-08-17; Ruling R143.)* Derselbe Baum, zweimal gemessen,
unterscheidet sich stärker als die beiden Zweige voneinander: CPU 7,5 gegen 2,2 ms, GL-Texturen
191 gegen 613, ein Bauschritt streute über das Zehnfache (43,8 · 143,4 · 364,8 · 580,0 ms), und ein
`vorher`-Ausreißer hätte als »+17 fps« in einer Tabelle gestanden. *Regel:* belastbar ist nur der
A/B-Vergleich im selben Lauf, und die billigste Prüfung dagegen ist eine **unveränderte Größe als
Maßstab neben der veränderten** (»`terrain` und `props` hat dieser PR nicht angefasst — ihre
Streuung IST der Rauschpegel«). Wer eine Einzelzahl über Budget findet, misst nach, statt zu
melden. (Familie **PB-44**; die Speicher-Spalten-Fassung steht in `docs/PERF_WAECHTER.md`, D-335.)

**PB-93 · Die Kontrollmessung ist gegen genau die Störung blind, die den Lauf entwertet.**
*(W4-Postzug, 2026-08-18; D-339.)* Zwei Minuten Abstand, derselbe Code, dieselbe Methode,
**dieselbe gültige Kontrollmessung** — und eine Phase baute 8199 statt 661 ms bei 30 statt 60 fps.
Die Ursache war ein kopfloser Test-Browser aus einer Sitzung vom **Vortag**, der noch auf der
Grafikkarte saß. Die Kontrollseite hat es nicht gemerkt, weil sie eine **leere** Seite misst — und
eine leere Seite schafft auch unter Last 60 Bilder. *Regel:* die Kontrollmessung bleibt Pflicht,
aber sie ist kein Freibrief: vor jeder Messreihe `pgrep -fl headless` (und ein Blick auf die
Systemlast), und eine Zahl über Budget wird nachgemessen, nie gemeldet. (Verschärft **PB-44**, das
die Kontrollmessung eingeführt hat.)

**PB-94 · Ein Wortverbot ohne seinen Grund ist beim nächsten Zusammenlegen unentscheidbar.**
*(C4, 2026-08-17; D-251.)* »Monster« steht auf der Liste, weil es Angst macht; »verheddert«, weil
das Kapitel kapitelweit ein anderes Wort benutzt (der Knoten, den der Wächter knüpft, und das Wort
auf der Karte sollen dasselbe Bild sein). Wer den Grund nicht dazuschreibt, kann eine Liste, die
in zwei Dateien auseinandergedriftet ist, nicht mehr zusammenführen — genau der Zustand, aus dem
D-251 kam. *Regel:* jede Zeile einer Verbotsliste trägt ihren Grund, und beim Zusammenlegen
entscheidet der Grund, nicht die Mehrheit der Kopien. (Nachbar von **PB-89**, das den MECHANISMUS
eines Wortverbots regelt.)

**PB-95 · Die Reparatur gehört an die Quelle, nicht ans Reparaturwerkzeug.** *(G4, 2026-08-17;
D-290.)* Zehn frisch importierte Blätter passierten die eigene Kantenreinigung des Importers (feste
Schwelle) und fielen dann beim Kunst-Tor durch: **12 525 Magenta-Randpixel**, weil das Tor gegen
das eigene Bildinnere kalibriert und vier Pixel tief schaut. Repariert wurde nicht mit einem
Nachlauf, sondern indem der Importer mit **derselben Funktion abschließt, nach der das Tor
urteilt**. *Regel:* wo Erzeuger und Tor dieselbe Frage beantworten, benutzen sie dieselbe
Implementierung — sonst hat man zwei Wahrheiten und repariert die falsche. (Schärft **PB-84**, das
das Auseinanderdriften meldet, aber die Richtung der Reparatur nicht nennt.)

**PB-96 · Eine Hilfsrechnung kann den Sonderfall mitzählen, den das Gesetz ausschließt.**
*(G4, 2026-08-17.)* Das Abstandsgesetz fiel auf dem echten Kapitel mit Höhen »9, 5, 3«, obwohl die
Objekte flach lagen: die **Oberfläche eines Tintenteichs** besteht die Stand-Prüfung (fester Grund
darunter, Kopffreiheit darüber), also maß die Laufzeilen-Hilfe den Teichgrund als Boden. Eine
Laufzeile ist aber, wo ein Kind stehen KANN, und Tinte ist der eine Ort, wo es das nicht kann.
*Regel:* wer eine Bezugslinie selbst berechnet, prüft zuerst, welche Zellen das Gesetz daneben
ausdrücklich ausschließt — und pinnt den Fall mit einem Test.

**PB-97 · Eine Klammer, die NACH dem Schritt läuft, den sie schützen soll, schützt ihn nicht —
und ein Fix, der nur auf dem Auslöse-Tick geprüft wird, ist nicht geprüft.** *(Zweimal in einer
Welle: F6 und B4b, 2026-08-17.)* F6: die Wisch-Klammer stand hinter dem Wesen-Schritt, der damit
die UNGEKLAMMERTE Lage des Ticks sah — der Tamper (Grenzwert 44 → 45) blieb **grün**, der Test
hatte nichts unterschieden; nach vorn gezogen wurde derselbe Tamper rot. B4b: der Kamera-Halt war
in drei Unit-Tests grün und im echten Lauf kaputt, weil die Bildschirm-Klammer eine Zeile VOR dem
auslösenden Ereignis läuft — auf dem Auslöse-Tick stimmt der Wert auch im kaputten Zustand.
*Regel:* bei jedem Eingriff in eine Reihenfolge wird der Tick DANACH mitgeprüft, und wer einen
Grenzwert »um eins nach innen« setzt, muss zeigen, dass der Wert eins daneben rot wird.

**PB-98 · Ein `undefined` an einem Parameter mit Vorgabewert prüft das Gegenteil.** *(B4b,
2026-08-17.)* `f(x = "near")` mit `f(undefined)` ergibt `"near"` — der Test »ohne Deklaration muss
es rot werden« war deshalb grün und prüfte die Vorgabe statt die Abwesenheit. *Regel:* wer die
ABWESENHEIT eines Feldes prüft, **löscht das Feld** (`delete obj.k` oder ein Objekt ohne den
Schlüssel), statt `undefined` zu übergeben.

**PB-99 · Ein Vollauf der Suite, der VOR der letzten Änderung liegt, ist keine Aussage über den
Stand — auch wenn die Zahl echt gemessen ist.** *(B4b, 2026-08-17.)* »1161/1161« war beim Messen
wahr und beim Hinschreiben veraltet: dazwischen war ein **Pflicht**-Feld dazugekommen, das sechs
FREMDE Fixtures rot machte. Gefegt worden waren nur die eigenen. *Regel:* wer ein Gesetz
verpflichtend macht, fegt im selben Zug **per Maschine über alle** Fixtures, nicht nur über seine;
und der Vollauf ist der **letzte** Schritt vor dem Push, nie ein früherer. (Zeitfalle wie
**PB-77**, dort für Abwesenheits-Behauptungen.)

**PB-100 · Ein zweites Fenster mit derselben URL ist nicht dieselbe Phase.** *(B4b, 2026-08-17.)*
Ein `location.reload()` verlor den `?phase=p2`-Parameter; zwei Messreihen liefen darauf in p1, wo
die gemessene Stelle gar keine Tinte hat, und meldeten folgerichtig »kein Platsch«. *Regel:* vor
jeder Messung den Zustand an der Maschine gegenlesen (`harness.phase()`), nie der URL glauben —
auch nicht der eigenen. (**P-65** in neuem Gewand.)

**PB-101 · Ein hochskalierter Ausschnitt erzeugt Befunde, die es nicht gibt.** *(F6, 2026-08-17.)*
Zwei unabhängige Prüfer meldeten übereinstimmend eine »Doppelbelichtung über dem ganzen Bild« mit
hoher Sicherheit; am 1:1-Ausschnitt derselben Aufnahme ist keine da. Ursache war die eigene
Vorrichtung: ein 760-px-Ausschnitt, auf 960 px hochgerechnet. *Regel:* was einem Prüfer vorgelegt
wird, steht selbst unter Prüfung — Ausschnitte in **Originalgröße** plus separate Vergrößerung, nie
ein resampeltes Gesamtbild. (Konvergenz zweier Prüfer beweist die Projektion, nicht das Spiel.)

**PB-102 · Ein Blindpanel mit zwei Ordnern, in denen beide Bilder unter getauschten Namen liegen,
liefert leicht dasselbe Bild zweimal.** *(F6, 2026-08-17.)* Jeder Prüfer bekam je eine Datei aus
BEIDEN Ordnern und sah dadurch dasselbe Bild zweimal; beide meldeten es unabhängig (per
md5-Vergleich) und verweigerten das Urteil. *Regel:* jeder Prüfer liest **beide** Dateien aus
**seinem** Ordner; sonst hängt die Gültigkeit des Panels an einer Pfad-Zeile im Brief. Und: dass
die Prüfer es gemeldet haben, ist Glück, kein Verfahren.

**PB-103 · Ein »fertig«-Signal, das nicht die Fertigkeit misst, startet den nächsten Schritt zu
früh.** *(Zwei Spielarten in einer Welle: F6 und E6, 2026-08-17.)* F6: `next build` schreibt
»✓ Compiled successfully« und arbeitet danach weiter (Typprüfung, Seiten-Daten) — `next start` fand
kein `BUILD_ID` und starb. E6: die eigene Bereitschafts-Prüfung wartete auf `.next/BUILD_ID`, das
der **vorige** Lauf hinterlassen hatte, und sprang an, während der neue Build noch lief. *Regel:*
auf den **Exit-Code** warten, nie auf eine Log-Zeile; und wenn eine Datei das Signal ist, muss sie
etwas sein, das **nur der neue Lauf** erzeugen kann (vorher löschen, oder auf eine Kennung warten).

**PB-104 · Eine Leinwand-Textur, die zweimal zur Grafikkarte fährt, kostet mehr als die Rechnung,
die sie füllt.** *(E6, 2026-08-17; D-320.)* `textures.createCanvas(key, w, h)` meldet eine **leere**
Textur an — und lädt sie hoch —, `refresh()` lädt sie nach dem Malen ein zweites Mal hoch: gemessen
**475 von 580 ms**, während die verdächtigte Bildpunkt-Schleife 75,5 ms kostete. *Regel:* erst auf
einer Leinwand fertig malen, die der Renderer nie gesehen hat, dann **einmal** anmelden
(`addCanvas`). Und: die naheliegende Verdächtige zuerst messen, nicht zuerst optimieren.

**PB-105 · Eine Klassen-Reparatur ist eine Hypothese über jede Fundstelle, bis jede Fundstelle
gemessen ist.** *(E6, 2026-08-17; D-326.)* Dieselbe Ein-Upload-Reparatur war an einer Stelle
4,7-mal schneller und an der nächsten **60-mal langsamer** (`props` p1 53 → 3250 ms); nur die eine
Phase ohne Buchstaben blieb unverändert und hat es bewiesen. *Regel:* das Gesetz »eine Panne
repariert man als Klasse« bleibt — aber die Klassen-Reparatur wird an **jeder** Fundstelle
gemessen, bevor sie steht, und eine zurückgenommene Fundstelle bekommt einen Kommentar an Ort und
Stelle, sonst baut die nächste Sitzung sie noch einmal.

**PB-106 · Ein Prüfsatz, dessen Fälle in zwei Bedingungen dieselbe Zahl tragen, verdeckt eine
verschobene Schwelle.** *(W4, 2026-08-17; D-334.)* Eine absichtlich um **eins** verschobene
Schwelle in einem Importer wurde vom neuen Vergleichs-Test **nicht** bemerkt, weil alle Prüffarben
in zwei Bedingungen denselben Wert trugen und die eine die andere zudeckte; nach der Reparatur fand
dieselbe Selbstprüfung sofort eine **zweite** blinde Stelle. *Regel:* Prüffälle ziehen die
Bedingungen auseinander (je Bedingung ein Fall, der nur sie verletzt) — ein Tamper, der besteht,
widerlegt den Prüfsatz, nicht die Regel. (Mechanik zu **PB-15**.)

**PB-107 · Eine benannte Einfügezeile gehört am Kontrollfluss geprüft, nicht am Zeilenbild.**
*(W4 · G4 · F6, 2026-08-17; Ruling R145, D-295/D-317/D-330.)* Die für eine Boss-Sonde benannte
Zeile liegt in einem Zweig, in den der Boss **per Konstruktion nie läuft** — wörtlich befolgt wäre
der Auftrag als »erledigt« abgehakt worden, ohne dass je ein Kasten gemessen worden wäre. Dieselbe
Woche: eine Aufruf-Zeile lag IN einer Schleife (sie wäre je Eintrag einmal gelaufen), eine
Methoden-Einfügung mitten im Doc-Kommentar der nächsten Funktion, ein Kommentar-Auftrag im
Tabu-Block einer fremden Bahn. *Regel:* wer eine Zeile zugewiesen bekommt, öffnet sie am Code und
prüft, ob der Kontrollfluss dort ankommt; wer eine Zeile zuweist, nennt zusätzlich das Symbol.
(**P-67**; Doktrin in doc 45 H11.)

**PB-108 · Eine Ausnahmeliste muss in BEIDE Richtungen scharf sein.** *(W4, 2026-08-17; D-242.)*
Eine geduldete Ausnahme, die nur »neu« und »häufiger« rot färbt, überlebt ihren Gegenstand: ein
Eintrag, dessen Verweis **verschwunden** ist, wird sonst nie bemerkt, und die Liste wächst als
Ratsche in die falsche Richtung. Gebaut ist deshalb: neuer Verweis rot · häufiger als deklariert
rot · **verschwunden ebenfalls rot (»schal«)** — plus Datum und Eigentümer je Zeile. *Regel:* eine
Ausnahme darf einen bekannten Zustand **dulden**, sie darf ihn nicht **überleben**. (R106 in
Werkzeugform; dieselbe Mechanik in `check-png-seams` und `check-ci-gates`.)

**PB-109 · Ein Klang (oder eine Wirkung), der an einem Copy-TEXT hängt, ist eine stille
Zeitbombe.** *(S1, 2026-08-17.)* Zwei Klänge hingen an einem Toast-**Text**, und die Copy-Bahn darf
jeden Satz umformulieren — der Klang wäre lautlos verschwunden, ohne dass ein Tor etwas sagt.
*Regel:* wo eine Wirkung an Copy gebunden ist, prüft ein Tor die Bindung an der Quelle (hier:
`check-audio` hält jedes `toastMatch` gegen das Literal in `sim.ts`); wo das nicht geht, bekommt
die Wirkung ein eigenes Ereignis.

**PB-110 · Die Reihenfolge in einer Signalkette ist keine Stilfrage.** *(S1, 2026-08-17.)*
Normalisieren-dann-kappen und kappen-dann-normalisieren unterscheiden sich um **fünf Dezibel**: die
Messung sah eine halbe Sekunde, ausgeliefert wurde eine Drittelsekunde (−17,9 bis −22,9 statt −20;
nach der Umstellung −20,3 bis −20,45). Aufgefallen ist es an der **Musterung des
Kalibrierungs-Exemplars**, vor der Serie. *Regel:* eine Verarbeitungskette wird an echtem Material
gemustert, bevor sie auf 219 Dateien läuft — und die Kette misst am Ende, was sie ausliefert, nicht
was sie in der Mitte hatte.

**PB-111 · Eine ausgedachte Schwelle misst oft etwas anderes als gemeint.** *(S1, 2026-08-17.)*
»Naht-Sprung < −40 dBFS« misst die **Helligkeit** der Musik, nicht die Naht: nach einem Crossfade
grenzen dort zwei benachbarte Abtastwerte aneinander. Ersetzt durch ein Verhältnis gegen die
**eigene** Datei (Sprung geteilt durch das 99. Perzentil der Sprünge derselben Datei). *Regel:*
eine Schwelle wird gegen das Material normiert, das sie beurteilen soll, und ihr Name muss die
gemessene Größe nennen. **Gegenspannung, bewusst:** **PB-83** warnt vor selbstkalibrierenden
Schwellen, weil sie harmlose Änderungen rot färben — die Auflösung ist, dass eine relative Schwelle
das RICHTIGE misst und deshalb eine erklärte Toleranz braucht, keine absolute Zahl aus der Luft.

**PB-112 · Die Doku eines Anbieters ist eine Behauptung — Parameter, Preis und Zähler werden am
ersten Take gemessen.** *(S1, 2026-08-17; zwei Vorfälle.)* (a) Ein Parameter, den die Doku als
»best effort« erlaubt, verbietet die API hart: `seed` + `prompt` → **HTTP 422**, Musik-Takes sind
damit nicht reproduzierbar. (b) Der Verbrauchszähler **hinkt nach**: ein Lauf meldete Differenz 0,
Sekunden später standen 2541 Credits mehr da — wer sofort abfragt, schreibt eine Null ins
Protokoll, die nach einer Ersparnis aussieht. Dazu: der Kosten-Header meldet für Musik 0, während
das Konto sich bewegt, und für Effekte einen Wert, während das Konto steht. *Regel:* ein
Trockenlauf mit EINEM Take findet all das für den Preis eines Takes; maßgeblich ist die
**Kontodifferenz**, gemessen mit Wartezeit.

**PB-113 · Ein Befehl, der ein Skript zweimal aufruft, startet zwei Läufe in dieselben Dateien.**
*(S1, 2026-08-17.)* Einmal für `tail`, einmal für `grep` — zwei parallele Läufe desselben
Erzeugers schrieben in dieselben Ausgabedateien. *Regel:* lange Läufe genau einmal starten, Ausgabe
in eine Datei, und danach lesen (`cmd > log 2>&1; echo "EXIT=$?"` statt `cmd | tee | grep`).

**PB-114 · Eine Warteschleife, die den Text ihres eigenen Befehls mitzählt, wartet für immer.**
*(S1, 2026-08-17.)* `until [ "$(ps aux | grep -c '[m]aster.mjs')" -le 1 ]` enthält selbst
»master.mjs« und zählt sich mit; drei Schleifen hingen gleichzeitig und hielten die Kette an,
obwohl die Arbeit längst fertig war. *Regel:* auf eine **Fertig-Markierung** warten, die das Skript
am Ende selbst schreibt (`touch …/x.done`), nie auf eine Prozesszählung — und die erste Runde einer
Warteschleife ansehen, bevor man ihr glaubt.

**PB-115 · Ein Messgerät kann zu langsam sein, um benutzt zu werden — und ein Tor, das zu lange
braucht, wird übersprungen.** *(S1, 2026-08-17.)* Die direkte Fourier-Summe kostete zwei Millionen
Sinus-Aufrufe je Fenster; die Musterung schaffte 31 Dateien in einer Viertelstunde, und dieselbe
Rechnung sollte im CI-Tor laufen. Eine FFT liefert dasselbe Ergebnis (nachgemessen: **0,0000 %**
Abweichung) in einem Bruchteil. *Regel:* bei einem Tor ist Geschwindigkeit eine
**Korrektheitsfrage** — was zu lange braucht, wird abgeschaltet, und ein abgeschaltetes Tor ist
kein Tor. (Familie **PB-41**: Abdeckung ist die Zahl der Anschlüsse, die wirklich laufen.)

## R5-Welle 6b · aus den sechs Reports der Welle (aufgenommen von K6, 2026-08-21)

_**Ruling R170/R191** hat diese Vergabe an K6 gegeben. Dreißig Wortlaute kamen aus sechs Reports
(C6 5 · D4 5 · H4 4 · B5 4 · E7 5 · W5 7). Ein **blinder Klassierer** — er sah die 115 bestehenden
Einträge und die 30 Wortlaute, nicht meine Zuordnung — hat sie gegen den Bestand gehalten.
**Drei sind Doppelungen** und haben eine Verweiszeile am alten Eintrag statt einer eigenen Adresse
bekommen (R70/R111): sie stehen bei PB-8, PB-56 und PB-68. **Drei weitere tragen untereinander
dasselbe Gesetz** und teilen sich hier eine Nummer (PB-121). **Sieben sind Verschärfungen** — die
alte Falle bleibt, der Kandidat fügt eine Bedingung hinzu, die sie nicht abdeckte; sie bekommen
eine eigene Nummer und nennen ihre Familie. Bleiben 25 Adressen aus den Reports, dazu **sechs
Lehren aus der Kreuzprüfung und den zwei Wareneingängen** (PB-141 … PB-146), deren Wortlaut aus
dem Architekten-Protokoll im `BOOT-SHEET.md` stammt — das Labor selbst lag auf dem Gerät dieser
Sitzung in einem älteren Stand und war nicht lesbar (im Report ausgewiesen)._

**PB-116 · Eine Abnahme, die die Maske des Lieferanten benutzt, kann den Fehler IN dieser Maske
per Bauart nicht sehen.** *(C6, 2026-08-19.)* Codex' Lieferschein meldete für beide Pennal-Zellen
»0 Fremdpixel im Fenster« und »Stabpixel Bestand → neu identisch« — beides wahr und beides relativ
zu SEINER Öffnung. Lag die Öffnung zu weit, zählte jede abgeschnittene Stabspitze als Fenster und
fiel aus der Rechnung heraus; drei Gitterstäbe endeten frei in der Luft, und die Zahlen blieben
grün. *Regel:* eine Abnahme stellt ihre **Bezugsfläche selbst her** — hier aus dem Diff gegen den
Bestand (was verschwunden ist, WAR Fenster). Wer mit dem Lineal des Geprüften misst, misst dessen
Selbstbild. (Verwandt, aber nicht dasselbe: **PB-58** misst das falsche Instrument, hier ist der
Prüfrahmen selbst die Fehlerquelle.)

**PB-117 · »Alle Stäbe ununterbrochen« sind ZWEI verschiedene Fragen.** *(C6, 2026-08-19.)*
»Innerhalb der Öffnung lückenlos« ist etwas anderes als »von Kante zu Kante durchlaufend«. Die
Lieferung erfüllte die erste Frage vollständig und riss an der zweiten: die Stabfüße waren
abgeschnitten, aber eben außerhalb des Fensters, das gemessen wurde. *Regel:* eine
Anforderungs-Formel, die eine Ausdehnung nicht nennt, ist zwei Formeln — bei einer Bestellung
gehört die Bezugsstrecke ausgeschrieben in den Text, nicht in die Vorstellung des Lesers.

**PB-118 · Eine achsenparallele Projektion ist das falsche Instrument für ein perspektivisch
gemaltes Gitter.** *(C6, 2026-08-19.)* Bei 50 % Schwelle zerfielen die geneigten Querstäbe in
Scheinbänder; erst 25 % der Öffnungsausdehnung findet einen geneigten Stab als **eine** Achse.
*Regel:* eine Schwelle wird am Material geeicht, bevor sie urteilt — sonst misst das Werkzeug
Bänder, die es nicht gibt, und die Zahl sieht dabei präzise aus. (Familie **PB-116**: dort ist die
Bezugsfläche geraten, hier die Auflösung.)

**PB-119 · Ein Wareneingangs-Urteil ist ein Messwert, keine Erlaubnis.** *(C6, 2026-08-19.)* Die
Freigabe »importfähig« war ehrlich gemessen und trotzdem falsch; der Auftrag verlangte zusätzlich
einen eigenen Prüfer in zwei Größen. Wer die Freigabe als erledigt behandelt hätte, hätte ein
sichtbar kaputtes Gitter ausgeliefert. *Regel:* eine Freigabe sagt, was jemand gemessen hat — sie
sagt nicht, dass die eigene Abnahme entfällt. (Familie **PB-90**: eine Adresse ist keine
Erledigung; hier: eine Messung ist keine Autorisierung.)

**PB-120 · Zwei Prüfgrößen können sich auch EINIG sein — und dann ist die Sache entschieden.**
*(C6, 2026-08-19; Verschärfung von **PB-91**.)* PB-91 sagt, ein Blatt braucht zwei Prüfgrößen,
weil sie auseinandergehen können: beim Buch (C5/**D-380**) lehnte das Handwerk ab und die
Kartengröße sah den Mangel nicht mehr. Hier stimmten beide überein — Handwerksgröße 3× und
Spielgröße (Käfig 34 Welt-px × Zoom 3, danach 4× nachvergrößert) nannten unabhängig denselben frei
endenden Stab. *Neu an dieser Zeile:* stimmen die zwei Größen überein, ist der Befund **über** der
Wahrnehmungsschwelle und die Sache ist entschieden — es braucht keine Geschmacksfrage nach oben.
Der Doppelbefund spart die Eskalation, er verdoppelt sie nicht.

**PB-121 · Ein textscannender Wächter kann einen Kommentar nicht von echtem Code unterscheiden.**
*(DREI Vorfälle in einer Welle: D4 · W5 · W5, 2026-08-19.)* **(1)** `overlay-css.test.ts` sucht
nach einer zweiten Deklaration eines Look-Knopfes (`--pb-ink:`) außerhalb der Karte und fand dabei
PROSA: zwei Kommentare (»--pb-chip-r: 18/9/20/11«, »statt --pb-ink: zwei Kanten«) machten den Test
rot, obwohl im Code nichts deklariert war. **(2)** `art-recompress --selftest` prüft, dass das
Skript nicht `pgrep -f` ruft — und wurde rot am **Kommentar**, der erklärt, warum `-f` falsch ist.
**(3)** `check-ci-gates` liest `ci.yml` **zeilenweise** und hält jede Zeile mit `--selftest` für
eine Selbsttest-Zeile; Ordnungs-Kommentare mit dem Text »KEIN `--selftest`« legten dadurch **vier
Tore** still (sie galten als »läuft nie an einer echten Datei«). *Regel:* in allen drei Fällen
hatte der Wächter recht und die PROSA wurde umgeschrieben, nie das Gesetz — aber wer ein Tor
baut, das Quelltext liest, prüft den **Aufruf** (`/exec\w*Sync\(\s*"pgrep -f/`) statt der Datei
als Text, und wer Kommentare schreibt, nennt einen verbotenen Token ohne seine Syntax
(»--pb-chip-r, die 18/9/20/11«). (Verwandt, aber anders: **PB-89** verbietet ein WORT als nackte
Teilkette, **PB-68** bricht die Quotierung; hier verwechselt der Wächter Kommentar und Code.)

**PB-122 · Zwei Vergleichsbilder gehören auf denselben Maßstab, sonst beurteilt der Kritiker die
Kamera.** *(D4, 2026-08-19.)* Zwei Bank-Ausschnitte hatten 3,17× und 3,00×; ein blinder Prüfer las
daraus ein »überzeugenderes Eselsohr« in der einen Fassung, wo nur der Maßstab anders war. *Regel:*
in einem blinden Seite-an-Seite ist jede Ungleichheit außer der geprüften ein Tell — Maßstab,
Zuschnitt, Kompression und Reihenfolge werden gleichgezogen, bevor gefragt wird.

**PB-123 · Ein Prop, das durch eine Zwischen-Komponente muss, ist ZWEI Prop-Deklarationen.**
*(D4, 2026-08-19; Verschärfung von **PB-79**.)* `PaintGame` reicht die Wertung nicht direkt an
`CardHost`, sondern über `Overlay` — und `Overlay` bekommt ein strukturell getipptes Bündel, in dem
ein vergessenes PFLICHT-Prop **kein Typfehler** ist, sondern zur Laufzeit »ist keine Funktion«.
PB-79 kennt das stille optionale Feld; *neu ist die Zwischenstation:* die Weiterreich-Zeile ist ein
zweiter Ort, den der Typprüfer nicht zusammenführt, und der Preis ist ein Absturz statt eines
`undefined`. *Regel:* Pflicht-Props durch eine Zwischenstation werden **optional mit Vorgabe**
deklariert, wie `onBack` es seit J1-B vormacht.

**PB-124 · Eine Register-Zeile ist keine Messung — sie ist eine Behauptung.** *(D4, 2026-08-19.)*
D-362 (»`--pb-paper-lit` gestrichen«) stand zwanzig Minuten als Tatsache im Schulden-Register,
bevor der Token wirklich gestrichen war; alle Tore waren grün, und **nichts** hätte es gemeldet.
Aufgefallen ist es beim eigenen Nachlesen der Definition of Done. *Regel:* jede Register-Zeile, die
eine Änderung BEHAUPTET, bekommt vor dem PR einen `grep` als Gegenprobe — dieselbe Regel, die für
Fortschrittsmeldungen gilt, gilt für Registerzeilen. *(Der Architekt hat dieselbe Lehre am 19.08.
als **P-68** in die Methode gehoben; hier steht sie, weil dieses Register die Bahn ist, die sie
bezahlt hat, und weil eine Register-Regel dort stehen muss, wo Register geführt werden.)*

**PB-125 · Eine Kennzahl, die ein Handwerk beweisen soll, wird von ihrem Zerrbild maximiert.**
*(H4, 2026-08-19.)* `MIN_TEXTURE` sollte »gemalt« beweisen — und wird von **Rauschen**
übererfüllt: die zurückgewiesene Tafel bestand die Textur-Zahl mit Salz-und-Pfeffer-Körnung, wo ein
gemaltes Blatt 0,109–0,127 misst. *Regel:* wer eine Qualitätszahl einführt, baut im selben Zug den
Selbsttest-Fall, **in dem die Zahl besteht und die Sache kaputt ist**. Eine Zahl ohne ihr Zerrbild
ist eine Einladung. (Familie **PB-42**: ein Tamper trifft die Klasse, in der richtig und
plausibel-falsch auseinandergehen.)

**PB-126 · Ein Prüfer, der auf einer geratenen Maske steht, misst nichts.** *(H4, 2026-08-19.)*
Das aus dem Bestand gerechnete Schiefer-Fenster lag **58 px** daneben, weil die Lieferung eine
andere Zell-Konvention benutzt; ungeprüft hätte die Abnahme 20 Fehlbefunde erzeugt und eine
brauchbare Lieferung zurückgewiesen. *Regel:* vor dem ersten Urteil das Prüfstück gegen das
prüfen, was es zeigen soll — die Konvention der Lieferung ist eine **Messung**, keine Annahme.
Seither steht die Zell-Konvention (»der Importeur schneidet ZENTRIERT«) in jeder Zellen-Bestellung
(**D-354**, Ruling R182).

**PB-127 · Zwei unabhängige Zahlen für dieselbe Größe sind billiger als eine.** *(H4, 2026-08-19.)*
Alle drei eigenen Messfehler dieser Sitzung fielen auf, weil die eigene Zahl von Codex' Zahl
abwich — nicht, weil jemand nachgerechnet hätte. *Regel:* **eine Abweichung ist eine Frage, kein
Befund** — und sie ist der billigste Fehlerfang, den es gibt. Wer nur eine Zahl hat, hat keinen.
(Anders als **PB-92**, das den A/B-Vergleich im selben Lauf verlangt: hier geht es um zwei
unabhängige RECHENWEGE zur selben Größe.)

**PB-128 · Der Dev-Server hält die Level-Datei fest.** *(B5, 2026-08-19.)* Zwei ganze Bildreihen
zeigten die ALTE Zelle, obwohl die Datei die neue trug; erst ein Neustart des Servers zeigte die
Änderung. *Regel:* nach jeder Level-Änderung den Dev-Server neu starten **und** die Zelle aus der
Server-Antwort gegenlesen, bevor ein Bild als Beweis gilt. (**PB-65** in neuem Gewand: nie der
Oberfläche glauben, auch nicht der eigenen.) Das Rezept dafür ist Werkzeug-Schuld **D-443**.

**PB-129 · Eine Sonde kann am Ereignis vorbeimessen, das sie sucht.** *(B5, 2026-08-19;
Verschärfung von **PB-82**.)* Die erste Begegnungs-Sonde lauschte auf `encounter` und meldete
»keine Begegnung« — dabei wird `encounter` im Sim in eine Karten-Anfrage übersetzt und verlässt
ihn nie. PB-82 kennt die Null aus einer selbst zusammengesteckten Prüfung; *neu ist die
Übersetzung:* das Ereignis existiert, trägt aber unterwegs einen anderen Namen. Sichtbar wurde es
an einem **Widerspruch** — das Wesen stand im selben Lauf auf »freut sich«, was es nur nach einer
gelösten Karte tut. *Regel:* wenn eine Sonde »nichts« meldet, den Zustand suchen, den ein Treffer
hinterlassen HÄTTE.

**PB-130 · Eine Positionsänderung kann eine Karte still entfernen — das Beweisband ist der Ort, an
dem man es sieht.** *(B5, 2026-08-19.)* Der Flieger auf der ersten Zielzelle bestand jedes Gesetz
und jedes Tor; nur die Erwartungszeile des p3-Bandes fiel von zwei gelösten Karten auf eine. *Regel:*
nach dem Versetzen eines Kontakt-Wesens nicht nur die Gesetze prüfen, sondern die **Karten-Bilanz
des Bandes** — die Gesetze beschreiben die Welt, das Band beschreibt den Durchlauf.

**PB-131 · Ein Vergleich, dessen eigener Rauschpegel nicht gemessen ist, produziert Befunde aus dem
Nichts.** *(E7, 2026-08-19; Verschärfung von **PB-92**.)* Der Anzeigelisten-Vergleich meldete
**806 von 1269** Objekten als abweichend; derselbe Bau gegen sich selbst gemessen zeigte, dass
**791** davon eine je Lauf neu erfundene UUID waren. PB-92 verlangt A/B im selben Lauf für
Perf-Zahlen; *neu ist die Reichweite:* die Regel gilt für **jedes** Diff-Werkzeug — vor jedem A/B
eine Kontrolle **A gegen A**, sonst ist der Ausgabewert die Summe aus Befund und Eigenrauschen.

**PB-132 · Eine Aufschlüsselung, die nach dem Schrittnamen allein schlüsselt, verliert Zeilen
lautlos.** *(E7, 2026-08-19.)* `terrain` und `props` haben beide ein Kind `· gitter`; das eine
schluckte das andere, und in der Tabelle fehlte nichts **Sichtbares** — die Summe stimmte weiter.
*Regel:* Schlüssel = Eltern **plus** Name. Ein Verlust, den keine Zeile anzeigt, ist der teuerste,
weil niemand nach ihm sucht.

**PB-133 · Eine Konstante, die nach ihrer Benutzung deklariert wird, überlebt jeden Selbsttest.**
*(E7, 2026-08-19.)* `CDP_TIMEOUT_DEFAULT_MS` stand 100 Zeilen unter seiner Verwendung; `node
--check` ist dafür blind, und der Selbsttest beendet sich vorher. Nur ein **echter Lauf** hätte es
gefunden. *Regel:* ein Selbsttest, der den Pfad nicht betritt, auf dem die Konstante gelesen wird,
beweist über sie nichts — Syntaxprüfung ist keine Ausführung.

**PB-134 · Ein behobener Befund ist nicht dieselbe Frage wie ein gemessener.** *(E7, 2026-08-19.)*
Der teuerste Posten der ganzen Welle stand seit dem 2026-08-14 in einem Kommentar, den **zwei**
Sitzungen gelesen haben — als **Speicher**-Befund. Dass derselbe Mechanismus (der
TileSprite-Konstruktor) auch die **Bauzeit** dominiert, hat niemand gemessen, weil niemand
`create()` fein genug aufgeschlüsselt hatte. *Regel:* »behoben« gilt für die Dimension, in der
gemessen wurde. Wer einen Mechanismus repariert, notiert, **welche** Kosten er gemessen hat — und
welche nicht.

**PB-135 · Jede Änderung der Leinwand-Maße rastert die Kantenglättung anders.** *(E7, 2026-08-19.)*
Weder ein Zuschnitt in beiden Achsen noch einer nur in der Höhe kam bildgleich zurück; nur ein
Blech mit **unveränderten** Maßen ist auf dem Bildpunkt-Zähler identisch. *Regel:* Bildgleichheit
ist gegenüber jeder Dimensionsänderung fragil — wer ein Blatt zuschneidet, kann keine
Bildgleichheit versprechen, sondern muss den Unterschied beziffern (Deckkraft, Punktzahl, Fläche).

**PB-136 · Der eigene abgewürgte Browser hängt den nächsten Lauf auf.** *(W5, 2026-08-19;
Verschärfung von **PB-93**, dritte Gestalt von **D-339**.)* Ein `shoot-world`-Lauf lief in ein
7-Minuten-Zeitlimit; sein Chrome (Profil `shoot-world-chrome-…`, Fernsteuer-Port 9380) lief weiter,
und der Folgelauf kam nie zurück. Die Familie hat damit drei Gestalten: **(1)** ein fremder Browser
vom Vortag · **(2)** der eigene nicht beendete `oxipng` · **(3)** der eigene abgewürgte Browser aus
**derselben** Sitzung. *Regel:* nach jedem Abbruch `ps ax | grep "[s]hoot-world-chrome"` lesen,
**melden**, dann töten — und erst danach neu messen. Was PB-93 als Mess-VERFÄLSCHUNG kennt, ist hier
ein **Hänger**: die Last wird nicht falsch gemessen, sie blockiert.

**PB-137 · Ein Tamper darf nur EINE Größe bewegen.** *(W5, 2026-08-19; Verschärfung von **PB-42**.)*
Der Korridor-Fall von `check-sheet-colours` hellte ein Blatt **multiplikativ** auf — was die
Farbzahl mitstaucht (6 349 → 1 590), also wurde der Fall am **falschen** Gesetz rot und hätte über
den Korridor nichts bewiesen. Ein reiner **Versatz** bewegt die Helligkeit und lässt die Farbzahl
weitgehend stehen. PB-42 kennt den Tamper, der am falschen Gesetz rot wird; *neu ist die Vorschrift:*
ein Tamper-Fall bewegt genau **eine** Größe, sonst ist sein rotes Licht mehrdeutig. Gefunden hat es
der Selbsttest, nicht ein Review.

**PB-138 · Ein Bestätigungs-Signal muss an die Sache gebunden sein, nicht an die Bestellung.**
*(W5, 2026-08-19.)* `data-karte` stand an der Bühne, sobald eine Karte namentlich **gewählt** war —
auch auf den elf Zeremonien-Panels, die gar keine Karte zeigen. `--only goal --card obj-book.r1`
hätte Exit 0 gemeldet und ein Bild geschrieben, dessen **Dateiname** eine Karte trägt, die darauf
nicht zu sehen ist. *Regel:* ein Vertrag, der »ja« sagen kann, ohne die Frage verstanden zu haben,
ist kein Vertrag — das Signal wird an das gebunden, was tatsächlich gezeichnet wurde.

**PB-139 · Wer ein rotes Tor sieht, liest zuerst, WORAN es gescheitert ist — nicht, was es prüfen
sollte.** *(W5, 2026-08-19; Verschärfung von **PB-38**.)* `perf-contract` meldete `fail`, und die
PERF-Tabelle stand vollständig im PR-Text: der Schritt holt die Basis mit `--depth=1`, und ein flach
geholter Ref hat keine Eltern — also gibt es für `origin/main...HEAD` keinen gemeinsamen Vorfahren
(`fatal: no merge base`, Exit 128). Sichtbar wird das **erst in einem Merge-Zug, ab der zweiten
Bahn**. PB-38 kennt das Rot durch Zeitlimit; *neu ist die Infrastruktur-Ursache:* ein Tor kann an
seiner eigenen Beschaffung scheitern und dabei über seinen Gegenstand nichts sagen. Behoben
(**D-455**).

**PB-140 · Eine Materialklasse aus einem fremden Tor kann dort richtig und hier falsch sein.**
*(W5, 2026-08-19.)* `PAPER_S` (Sättigung < 0,38 = »Papier«) ist für das Farb-Tor richtig, filet aber
den entsättigten blauen **Glanz** eines blauen Buchdeckels unter »Papier« — weshalb der Rest-Zähler
zuerst **0** meldete, wo eine Handzählung **124** fand. *Regel:* der Ausweg war keine neue Schwelle,
sondern **nach Material getrennt berichten, statt eine Klasse zu wählen**. Eine Schwelle wandert nie
allein — sie bringt die Frage mit, für die sie geeicht wurde.

**PB-141 · Eine Route an eine LAUFENDE Bahn ist keine Route.** *(Kreuzprüfer der Welle 6b,
2026-08-19; Ruling **R187a**.)* Drei Befunde von D4 wurden an W5 gefiled, **während W5 lief** —
`check-png-identity` RGBA · Kartenbank `AnswerHome` · Knopf-Zuschnitt. W5 hat gemergt, ohne sie je
zu sehen, und die drei Posten liefen ins Leere; gefunden hat sie erst die Kreuzprüfung nach der
Welle. *Regel:* Ziel einer Route ist die **NÄCHSTE** Nummer des Kürzels (hier W6) oder der
Architekt — nie die Bahn, die gerade arbeitet. Eine Adresse, die niemand mehr liest, ist eine
verlorene Zeile, und sie sieht wie erledigte Arbeit aus.

**PB-142 · Ein Rebase zieht auch die BEGRÜNDUNGEN nach, nicht nur den Code.** *(Kreuzprüfer der
Welle 6b, 2026-08-19; Ruling **R187b**.)* W5s Waiver trug als Kollisionsfreigabe die Sätze »H4 ist
nicht gebootet« und »E7 nicht gebootet«. Am Schlussstand war beides falsch — H4 war gebootet und
hatte gemessen. Das **Ergebnis** blieb richtig (der Waiver bleibt, R182), die **Beweiskette** nicht.
*Regel:* nach `git rebase origin/main` wird jede Begründung, die auf den Stand der anderen Bahnen
zeigt, neu gelesen — ein Satz über die Welt altert schneller als eine Codezeile.

**PB-143 · Ein Generator-Raster lässt eine LEERE Fläche gemalt aussehen.** *(Wareneingang
2026-08-19, Lieferung AS5c; Protokoll im `BOOT-SHEET.md`.)* 92 von 100 Zellen bestanden das Tor —
und dann maß der Prüfer eine **leere** Fläche mit einer Textur-Kennzahl von **5,455**: das feine
Raster, das die Erzeuger-Funktion `finish()` über jede Zelle legt, erfüllt die Kennzahl von selbst.
*Regel:* dieselbe Klasse wie **PB-125**, aber eine Ebene früher — nicht das gelieferte Motiv
überlistet die Zahl, sondern ein **Verfahrensschritt des Erzeugers**. Wer eine Handwerks-Kennzahl
bestellt, misst sie zuerst an einer leeren Fläche desselben Erzeugers.

**PB-144 · Ein Prüffenster, das eine Lieferung kennt, kann sie umgehen.** *(Wareneingang
2026-08-19, Lieferung AQ17b Kante/Innenlinie; Protokoll im `BOOT-SHEET.md`.)* Die Randspalten waren
vom **Gegenrand gespiegelt** und um **+2 Rot** verschoben — genau so viel, dass der Fugen-Wächter
keinen Sprung sah, und genau dort, wo er hinsah; die Strichdicke stand als **Array-Literal** im
Bauskript statt aus dem Blatt gemessen zu werden. *Regel:* wo ein Prüffenster in der Bestellung
steht, wird auch geprüft, **welche Fenster das Tor NICHT abdeckt** — und ein Wert, der im Bauskript
als Konstante steht, ist keine Messung, sondern eine Behauptung mit Nachkommastellen.

**PB-145 · Eine Materialklasse, die nur die Fläche beschreibt, verurteilt ihren eigenen Schatten.**
*(Wareneingang 2026-08-19, Lieferung AQ12f3; Protokoll im `BOOT-SHEET.md`.)* Die Petrol-Naht galt an
rund **230** Stellen als angefressen, weil der **Schattenanteil** mit 125–144° außerhalb des
bestellten Farbfensters lag — die Klasse war am beleuchteten Stoff geeicht und kannte seinen eigenen
Schatten nicht. *Regel:* ein Farbfenster in einer Bestellung nennt die Spanne, die das Material über
seine **Beleuchtung** durchläuft, nicht den Farbton seiner hellsten Fläche. (Schwester von
PB-140 — dort wandert eine Schwelle in ein fremdes Tor, hier ist sie im eigenen zu eng.)

**PB-146 · Ein Zellenraster wird am Blatt GEMESSEN, nicht aus der Breite geteilt.** *(Eigener
Architekten-Fehler, Wareneingang 2026-08-19; vom Prüfer widerlegt.)* `merle_hop.png` wurde in
**fünf Spalten à 409 px** geteilt, weil die Bildbreite das nahelegte; das Blatt trägt in Wahrheit
**vier mal zwei Zellen à 512 px**. Der blinde Prüfer hat die Teilung **widerlegt**, bevor sie ein
Urteil trug. *Regel:* die Zellgeometrie kommt aus dem Lieferschein oder aus einer Messung am Blatt
(Trennlinien, Leerspalten, Wiederholung) — eine Division der Bildbreite durch die erwartete
Zellenzahl ist eine Vermutung, die jede folgende Zahl mitreißt.

## R5-Welle 7 · aus den fünf Reports der Welle (aufgenommen von K7, 2026-08-22)

_**Ruling R210** hat diese Vergabe an K7 gegeben. **Dreiunddreißig** rohe Wortlaute kamen aus fünf
Reports (F8 · D5 · W6 samt Schluss-Pass · H5 · P7). Ein **blinder Klassierer** (frischer Sonnet-5-Prüfer,
er sah nur das vollständige Register und die rohen Wortlaute, nie meine Zuordnung) hat sie gegen jeden
bestehenden Eintrag gehalten. Sein Befund, von mir Zeile für Zeile am Register nachgelesen, bevor er
hier gilt: **fünf Doppelungen nach außen** (sie bekommen ihren Vorfall an der bestehenden Nummer, keine
neue) · **null Doppelungen nach innen** · **fünf Routen und Einzelfälle** (sie stehen im Report, nicht
hier — eine Aufgabe ist keine Falle). Bei einem sechsten Kandidaten habe ich ihn **überstimmt**: die
veraltete PR-Vorlage hielt er für eine erledigte Aufgabe; sie steht unten als PB-169, weil ihre Lehre
bei jeder Werkzeug-Umbenennung wieder greift. Bleiben **dreiundzwanzig** neue Nummern._

**PB-147 · `beat()` ist innerhalb einer synchronen JS-Runde blind.** *(F8, 2026-08-21.)* Das Werkzeug
liest React-Refs; ohne Atempause rendert React nie. Zwölf Aufgaben-Runden später meldete es weiter
dieselbe alte Karte — und eine Sitzung hat damit einen Befund als »ausgeschlossen« geführt, der nicht
ausgeschlossen war. *Regel:* wer einen Zustand über Refs abfragt, gibt der Runde vorher eine Atempause;
ein Ausschluss aus einer synchronen Schleife ist kein Ausschluss.

**PB-148 · Headless-Chrome drosselt die ZEITGEBER — auch wenn es zeichnet.** *(F8, 2026-08-21.)*
Derselbe Befehl liefert headless »die Welt steht« und sichtbar »34 von 34 grün«. Betroffen ist jede
Karte, die über einen Zeitgeber aufgeht. *Regel:* wer einen Stillstand meldet, wiederholt ihn zuerst
sichtbar. Das **schärft PB-44**: dort steht, dass ein selbst gestarteter headless-Chrome *zeichnet* —
das heißt nicht, dass seine *Uhren* laufen.

**PB-149 · Ein Messgerät kann sich an seiner eigenen Näherung verschlucken.** *(F8, 2026-08-21.)* Das
Präsenz-Werkzeug warnt »Kind höher?«, weil es die Kindhöhe mit 35 px annimmt: bei einem Käfig (34 px)
ist die Warnung ein Fehlalarm, bei einem Buch (24 px) misst der Kasten wirklich Haare. In der Tabelle
sehen beide Fälle gleich aus. *Regel:* eine Warnung, die aus einer angenommenen Konstanten entsteht,
wird am Ausschnitt entschieden, nie an der Tabelle.

**PB-150 · Ein Auswahlkriterium aus Größe, Bereich und Rang findet das größere fremde Ding.** *(F8,
2026-08-21, selbst gefangen.)* Der Schuh-Sucher nahm »2500–5500 px, unteres Viertel, die zwei größten«
— Merles Perlenkette (5372 px) erfüllt alle drei Bedingungen und ist größer als jeder Schuh. Gefunden
beim Nachrechnen (66,1 statt 59,4 px²), korrigiert auf »die zwei tiefsten in einem engen Band«, **beide
Messungen danach neu gefahren**. *Regel:* ein solches Kriterium wird gegen das größte NICHT gemeinte
Objekt geprüft, bevor es eine Zahl liefert.

**PB-151 · Wer seine eigene Reparatur ansieht, sieht sie freundlich an.** *(F8, 2026-08-21.)* Das
Ring-Banding galt nach zwölf Schichten als behoben; der blinde Prüfer sah weiter »fast wie eine
Zielscheibe«, Störwert 4 von 5. *Regel:* der Ausschnitt schlägt die Zahl — und der fremde Blick schlägt
den eigenen Ausschnitt.

**PB-152 · Eine Hintergrund-FARBE kann kein Bild überdecken, sie liegt darunter.** *(D5, 2026-08-21.)*
Ein deckendes `background-image` macht jede `background-color` am selben Element wirkungslos, auch die
halbdurchsichtige »Wäsche«, mit der ein Aufrufer den Knopf leiser stellen wollte. Der Fehler sieht wie
ein Deckkraft-Problem aus und ist mit keiner Zahl zu beheben (0,5 wie 0,83 ergaben denselben Bildpunkt).
*Regel:* eine Wäsche, die ÜBER einem Blatt liegen soll, ist ein Verlauf aus einer einzigen Farbe als
oberste Lage. Wenn keine Zahl hilft, ist es kein Zahlen-, sondern ein Reihenfolge-Fehler.

**PB-153 · `img { max-width: 100% }` klemmt jede Vergrößerung still ab.** *(D5, 2026-08-21.)* Ein Bild,
das absichtlich über sein Fenster hinausragen soll, braucht `max-width: none` — sonst ist die
Breitenangabe eine Behauptung, das Vorher/Nachher-Foto ist bytegleich, und **nichts wird rot**.
*Regel:* eine Größenangabe, die eine Umgebungsregel überstimmen muss, wird zusammen mit der Regel
geschrieben, die sie aushebelt.

**PB-154 · Ein Import-Skript, das jedes Mal ALLES neu kopiert, macht den Bildpunkt-Beweis blind.**
*(D5, 2026-08-21.)* Zwischen zwei Läufen liegt die Nachverdichtung; die Kopie bringt die größeren
Labor-Bytes zurück, und zwei Blätter, die diese Runde gar nicht importiert wurden, stehen als angefasst
im Diff. *Regel:* das BILD vergleichen, nicht die Datei.

**PB-155 · Die Kartenbank kann keinen Takt fotografieren, den ihre Flächenliste nicht kennt — und ihre
Attrappe zeigt stumm einen von zwei Zuständen.** *(D5, 2026-08-21.)* Ein fehlendes Feld in der Attrappe
wird zu `undefined` und damit zu »nichts gefunden«; der Prüfer beurteilt dann die halbe Wahrheit, ohne
dass ihm etwas fehlt. *Regel:* wer eine Karte um einen Zustand erweitert, prüft die Attrappe der Bank im
selben Zug.

**PB-156 · Ein Verhältnis schlägt eine Pixelzahl, sobald das Element mitwächst.** *(D5, 2026-08-21.)*
Der Knopf ist zwischen 94 und 380 px breit; ein fester Eckradius trifft die gemalte Ecke bei genau
einer Breite, Prozente treffen sie bei allen. *Regel:* Maße an einer mitwachsenden Fläche werden
relativ geschrieben.

**PB-157 · Ein Profil-Präfix identifiziert das WERKZEUG, nicht den BESITZER.** *(W6, 2026-08-22, am
lebenden Fall gegen eine fremde Bahn geprüft — nichts passiert, weil die Lastlesung vor der Messung
stand.)* Zwei Sitzungen auf demselben Rechner, die dasselbe Skript fahren, teilen das Präfix; eine
»räume verwaiste Profile«-Routine schießt dann eine fremde, LAUFENDE Messung ab. *Regel:* verwaist
heißt `ppid = 1` — der Erzeuger ist weg. Aufräum-Routinen erkennen ihre eigenen Kinder am Erzeuger, nie
am Namen. (Familie **PB-136**, Browser-Prozess-Hygiene.)

**PB-158 · Ein Drift-Wächter, der eine LISTE von Meldern kennt, ist gegen den nächsten Melder blind.**
*(W6, 2026-08-22.)* Er meldet dann die richtige Beobachtung mit der falschen Ursache — das Teuerste,
was ein Wächter tun kann, weil die Suche in die falsche Richtung läuft. *Regel:* gelesen wird der
Aufzählungs-KÖRPER, nicht eine Namensliste. (Familie **PB-18** — eine Namensliste ist ein handgebautes
Modell der echten Aufrufer. Eigene Nummer, weil die Bedingung neu ist: nicht der Prüfling ist hier ein
Modell, sondern der MELDER-KREIS. Der blinde Klassierer hat genau diese Grenze benannt und offen
gelassen; die Entscheidung ist meine.)

**PB-159 · Eine Bibliothek, die auf oberster Ebene die Aufrufzeile liest, kapert den Selbsttest ihres
Importeurs.** *(W6, 2026-08-22.)* `process.argv.includes("--selftest")` im Modulrumpf feuert auch dann,
wenn ein ganz anderes Werkzeug die Bibliothek nur einbindet. *Regel:* zusätzlich prüfen, ob die eigene
Datei das Einstiegsmodul ist.

**PB-160 · Ein Selbsttest, der einen WORTLAUT zitiert, wird von der nächsten Umbenennung entwertet.**
*(W6, 2026-08-22 — im selben Commit passiert, in dem die Umbenennung stand.)* Er meldet dann »das
Gesetz ist blind«, obwohl nur sein Anker verrottet ist. *Regel:* Anker als MUSTER schreiben, und laut
abbrechen, wenn die Verfälschung nichts verändert hat — ein Tamper, der nichts bewegt, ist kein Beweis,
sondern eine offene Frage. (Familie **PB-25** und **PB-15**.)

**PB-161 · Backticks in einer doppelt gequoteten Commit-Meldung sind Kommando-Ersetzung.** *(W6,
2026-08-22; die Meldung war schon geschrieben, als es auffiel.)* `zsh` versucht den Inhalt auszuführen
(»permission denied«) und setzt eine LEERE Zeichenfolge ein — die Meldung verliert stillschweigend
ihren Inhalt, und der Commit sieht danach aus wie ein Flüchtigkeitsfehler des Autors. *Regel:*
Commit-Meldungen über eine Datei (`-F`) oder in einfachen Anführungszeichen. (Verwandt **PB-68** und
**PB-17** — dort sprengt das Sonderzeichen ein Stylesheet, hier eine Meldung.)

**PB-162 · `pngjs` liefert IMMER vier Kanäle.** *(D4 fand die Instanz; W6 hat am 2026-08-22 die Klasse
gemessen: **193 von 624** Blättern wären falsch gemeldet worden.)* Wer aus dem dekodierten Puffer auf
das Dateiformat schließt, urteilt über den Decoder, nicht über die Datei. *Regel:* der Farbtyp steht in
Byte 25 der IHDR-Kopfdaten und wird dort gelesen.

**PB-163 · `timeout` gibt es auf macOS nicht.** *(W6, 2026-08-22 — ⚠ der Quell-Report nennt diese Regel
unter den Fallen der Runde, ohne einen Vorfall auszuschreiben; K7 hat keinen erfunden, sondern die
Tatsache am Sitz-Rechner selbst nachgemessen: weder `timeout` noch `gtimeout` sind vorhanden, Darwin
26.5.2, 2026-08-22.)* Es kommt aus den GNU-Coreutils; in CI (ubuntu) ist es da, auf dem Arbeitsgerät
nicht. *Regel:* Sitzungs-Skripte bauen nicht darauf — ein Befehl, der in CI existiert, existiert damit
nicht hier.

**PB-164 · Eine Ratsche, deren Auslöser ein FREMDER Merge ist, wird auf `main` rot statt im PR.**
*(W6-Schluss-Pass, 2026-08-22, an der eigenen Ratsche bezahlt.)* »Verschmilzt sauber« (`MERGEABLE` /
`CLEAN`) heißt: die Dateien vertragen sich. Es heißt **nicht**: das Ergebnis ist noch richtig. *Regel:*
die letzte Bahn eines Zuges rebased **vor** dem Merge — und wer eine Ratsche baut, deren Auslöser
außerhalb seines eigenen Diffs liegt, schreibt diese Pflicht in die Merge-Tabelle.

**PB-165 · Ein Prüfskript über Merge-Commits findet bei SQUASH-Merges null Bahnen — und meldet »nichts
verloren«.** *(W6-Schluss-Pass, 2026-08-22.)* Die Historie enthält die gesuchten Mitglieder gar nicht
mehr; die Null ist dann keine Antwort, sondern eine Abwesenheit der Frage. *Regel:* jeder
Mengen-Vergleich braucht eine Vakuum-Sperre gegen die **erwartete Mitgliedschaft**, nicht gegen eine
geratene Zahl. (Familie **PB-82**; eigene Nummer, weil die Null hier nicht aus einer falsch
verdrahteten Prüfung kommt, sondern aus der Form der Daten selbst.)

**PB-166 · Ein frisch gestarteter Server misst seinen ersten Lauf falsch.** *(W6-Schluss-Pass,
2026-08-22.)* Kaltstart gemessen: die erste Fläche 187,3 → 124,2 ms, das Laden 964 → 516 ms. *Regel:*
die erste Zahl nach dem Serverstart ist kein Messwert; ein Aufwärmlauf gehört ins Rezept und in den
Beipackzettel.

**PB-167 · Ein Anker, der eine Tabellenzelle sucht, findet sie nicht, wenn sie fett gesetzt ist.**
*(H5, 2026-08-22; kostete zwei rote Läufe an einer Tabelle, die vollständig ausgefüllt war.)* Der
Wächter suchte die Phasen-Zelle als Wortanfang hinter einem Strich; die fett gesetzte Fassung mit
Sternchen schlägt fehl. *Regel:* wer Text prüft, den Menschen schreiben, prüft ihn gegen die
Auszeichnungen, die Menschen benutzen — sonst ist das rote Licht eine Aussage über die Formatierung,
nicht über den Inhalt.

**PB-168 · Ein Wiederholungslauf liest den ALTEN PR-Text.** *(H5, 2026-08-22.)* Der PR-Text steckt in
der Auslöse-Nutzlast des Laufs; wer ihn repariert und dann »rerun« drückt, misst dieselbe Fassung noch
einmal und hält das Tor für kaputt. *Regel:* nur ein neuer Push färbt ein Tor grün, das den PR-Text
liest.

**PB-169 · Eine Vorlage ist Anleitung ohne Tor — sie veraltet mit dem Werkzeug, das sie nennt.** *(H5,
2026-08-22.)* Die PR-Vorlage schickte zum Mess-Werkzeug der vorigen Welle; gemessen wird seit W6 mit
einem anderen, und ohne die Bau-Angabe beim Serverstart kann der Bau sich nicht selbst nennen.
*Regel:* wer ein Werkzeug ersetzt, sucht seinen Namen in den Vorlagen — kein Tor tut das für ihn.
(⚠ Der blinde Klassierer hielt diesen Kandidaten für eine erledigte Aufgabe statt für eine Falle. K7
hat überstimmt: die Aufgabe ist erledigt, die Lehre greift bei jeder Umbenennung wieder.)

## Level-Welle · L0 · Mehrkapitel-Fundament (2026-09-02)

**PB-170 · EIN SCHEMA, DAS STRIPPT, LÖSCHT NEUE FELDER STILL — die Datei besteht jedes Tor
und verliert ihre Aussage im Browser.** *(L0, 2026-09-02; die Klasse ist alt, die Instanz ist
neu, und sie steht als Warnung schon zweimal im Lader selbst.)* `apps/web/lib/paint-content.ts`
parst jede Level-Datei mit zod, und ein `z.object` **entfernt**, was es nicht aufzählt — es
wirft nicht. Ein neues Level-Feld, das nur im TypeScript-Interface steht, überlebt also den
Weg von der Platte in die Szene nicht: `checkLevelLaws` sieht es beim Autorieren (die Gesetze
lesen die rohe Datei), jedes Tor bleibt grün, und im laufenden Spiel ist es `undefined`.

*Die Instanz, an der L0 es festgehalten hat:* das Feld `words` (die Wörter, die ein
Buchstaben-Trail buchstabiert, D5). Ohne die zod-Zeile hätte ein Kapitel sein Wort deklariert,
jedes Tor hätte es geprüft — und der Raum hätte im Spiel A → Z durchgezählt. Dasselbe gilt für
`auftaktPlates` (D6). Beide stehen jetzt in Interface UND zod.

*Regel:* ein neues Feld auf `PhaseSpec` oder `PaintLevel` ist erst fertig, wenn es an DREI
Stellen steht — Interface (`level.ts`), zod (`paint-content.ts`) und einem Test, der es nach
dem LADEN liest, nicht vor dem Laden. Der Lader trägt diese Warnung im Klartext bei
`inkReturns` und `goalPlate`; sie wurde zweimal geschrieben, weil sie zweimal bezahlt wurde.

**PB-171 · Zwei Häuser, die dasselbe Feld prüfen, können sich widersprechen — und das
strengere gewinnt erst beim Kind.** *(L0, 2026-09-02, beim Bau des ch02-Exemplars selbst
getroffen; D-790.)* `tipsTotal: 0` ist für die Motor-Gesetze in Ordnung (`tip-honesty` prüft
nur, dass Zahl und gesetzte Regel-Seiten übereinstimmen — 0 und 0 stimmen überein), für das
zod des Laders aber nicht (`z.number().int().positive()`). Ergebnis: ein Kapitel, das jedes
Tor besteht und die Seite mit einem 500 fällt, sobald jemand sie öffnet.

*Regel:* wo ein Feld ZWEI Prüfer hat (Gesetz und Schema), wird die Aussage beider einmal
nebeneinander gelesen, bevor man sich auf eine verlässt. Und ein Test, der den echten LADER
fährt (nicht nur die Gesetze), ist die einzige Stelle, an der so ein Widerspruch vor dem Kind
auffällt — `apps/web/lib/paint-content.test.ts` existiert genau dafür und hat diesen Fall im
ersten Lauf gefunden.

**PB-172 · Eine geschlossene Liste kann heimlich ein UNTERSCHEIDER sein — wer sie öffnet,
nimmt jemand anderem das Messgerät weg.** *(L0, 2026-09-02.)* `isCaptiveKey` prüfte die
Mitgliedschaft in einer Vierer-Liste aus Kapitel 1. Zwei Kartenstellen benutzten genau das,
um Ding-Käfig von Personen-Käfig zu unterscheiden: »merle« stand nicht in der Liste, also war
merle eine Person. Mit offener Liste hätte Merles Käfigbild auf ein Blatt gezeigt, das es
nicht gibt — kein Absturz, nur ein leeres Bild.

*Regel:* vor dem Öffnen einer geschlossenen Liste wird JEDE Aufrufstelle gelesen und gefragt,
ob sie die Mitgliedschaft prüft oder die GESCHLOSSENHEIT ausnutzt. Die zweite Sorte braucht
einen echten Unterscheider aus den DATEN (hier: aus welchem Feld der Name kam), bevor die
Liste aufgeht.

**PB-173 · EIN TOR MIT EIGENEM DATEI-LAUF IST EIN TOR MIT EIGENER MEINUNG — und die eine, die es sich nicht leisten kann, ist »was ist ein Kapitel«.** *(Farb-Tor-Bahn, 2026-09-04.)*

**Was passierte.** `check-colour-truth.mjs` sammelte seine Kartendateien selbst (`readdirSync` über `content/corpus/stories`) statt `scripts/paint-chapters.mjs` zu fragen. Der eigene Lauf kennt keine `draft`-Flagge, also konnte ein Kapitel, dessen Kunst noch nicht gemalt ist, dieses Tor mit einer einzigen `restore`-Karte gar nicht bestehen — zwei Fehlermeldungen hintereinander, keine davon reparierbar, solange die Kunst fehlt. Sechs Karten in drei offenen PRs standen davor, und die Ursache lag in keinem der drei.

**Warum.** Der Kopf von `paint-chapters.mjs` hat genau diese Klasse schon einmal bezahlt und benannt: „Acht Skripte, acht Meinungen darüber, was ein Kapitel ist — und keines davon hätte je bemerkt, dass ein zweites existiert.“ Drei Tore wurden damals umgestellt, dieses nicht. Ein Tor, das seine eigene Welt-Sicht mitbringt, erbt keine einzige Lehre, die an der geteilten Sicht gelernt wird — hier die Entwurfs-Doktrin und die Ratsche aus D-792, beide fertig vorhanden und beide ungenutzt.

**Der Check, der es künftig fängt.** Für dieses Tor: es fragt jetzt `paintChapters()`, und `orphanTaskFiles()` steht daneben, damit der Umbau nicht eine Blindheit gegen eine andere tauscht. Allgemein, und das ist der eigentliche Ertrag: **wer ein neues `scripts/check-*.mjs` schreibt oder ein altes anfasst, prüft zuerst `git grep -l paint-chapters scripts/` — steht das Tor nicht auf der Liste und liest es Kapitel-Dateien, ist das der Befund, bevor irgendein Gesetz geschrieben wird.** Erkennungszeichen im Diff: ein `readdirSync` über `content/corpus` oder ein fest verdrahteter `chNN`-Pfad.


**L2-M-a (2026-09-05): Ein Prüfstand, dessen Ergebniszeile das KOMMANDO enthält, erfindet rote Tore.** *(Motor-Bahn ch02.)*

**Was passierte.** Die Vorher-Batterie schrieb je Zeile `<exit>\t<kommando>` in eine Sammel-Datei. Zwei der 69 CI-Kommandos sind mehrzeilige `run: |`-Blöcke; ihre Zeilenumbrüche landeten damit MITTEN in der Ergebnis-Datei. Die Auswertung (`awk -F'\t'`) las die Fortsetzungszeilen als eigene Ergebnisse und meldete vierzehn rote Tore — darunter `check-ci-gates`, `check-audio` und `shoot-card-bench`. Einzeln nachgefahren war jedes davon grün. Die Bahn hätte fast eine Stunde damit verbracht, Fehler zu suchen, die es nicht gab.

**Warum.** Ein Ausgabeformat, das ein FREMDES Feld als Schlüssel benutzt, hält nur, solange dieses Feld die Trennzeichen des Formats nicht enthält. Ein Kommando aus einer YAML-Datei kann alles enthalten. Dieselbe Klasse wie „Kommentar-Zahlen driften": die Datei sah vollständig aus, und niemand zählte ihre Zeilen (81 statt 72 — die Zahl stand da und wurde überlesen).

**Der Check, der es künftig fängt.** Die Ergebniszeile ist INDEX-geschlüsselt (`<i> <exit>`), das Kommando steht nur im Protokoll; und die Auswertung vergleicht die Zeilenzahl der Ergebnis-Datei mit der Zahl der bestellten Kommandos, bevor sie irgendetwas über rot oder grün sagt.

**L2-M-a (2026-09-05): Die CI-Datei enthält Kommandos, die man lokal nicht fahren DARF — einer davon ist ein flacher Fetch.** *(Motor-Bahn ch02.)*

**Was passierte.** Dieselbe Batterie zog ihre Liste aus `ci.yml` und fuhr sie vollständig. Darin steht `git fetch --no-tags --depth=1 origin "${{ github.base_ref }}"`. Lokal ist `${{ github.base_ref }}` kein Ref, der Befehl scheiterte — aber nur deshalb. Ein FLACHER Fetch auf diesen Klon hätte `.git/shallow` angelegt und, wie am 04.09. bezahlt, jede `git diff main...branch`-Messung in ALLEN Worktrees des Hauses zerstört; zwölf Sitzungen teilen ihn.

**Warum.** Die Regel „zieh die Tor-Liste aus `ci.yml`, nie aus dem Gedächtnis" (L2-P1) ist richtig und unvollständig: die Datei beschreibt einen CI-LÄUFER, nicht eine Arbeitskopie. Ihre Umgebungs-Aufbauschritte (Fetch-Tiefe, `apt-get`, Cache) sind keine Tore und gehören nicht in eine lokale Batterie.

**Der Check, der es künftig fängt.** Die Extraktion nimmt nur die EINZEILIGEN `run:`-Kommandos; die mehrzeiligen `run: |`-Blöcke werden ausgelassen und im Report namentlich als ausgelassen benannt. Kontrolle danach: `git rev-parse --is-shallow-repository` muss `false` sagen.

**L2-M-a (2026-09-05): Eine Sonde, die fragt „kommt das Kind hinauf?", schreibt dem neuen Verb gut, was der alte Sprung schon konnte.** *(Motor-Bahn ch02.)*

**Was passierte.** Die Hangel-Sonde maß, welche Mauer das Kind MIT `hang` erklimmt: acht Zeilen. Daraus wäre `HANG_ROWS = 4` geworden. Die Eichung gegen eine bekannte Größe zeigte den Fehler: ein reiner Halte-Sprung hebt die Füße schon 6,06 Zeilen, und bei den Mauern 4 bis 6 hat das Kind kein einziges Mal gegriffen (Griffe = 0). Das Hangeln kauft in Wahrheit ZWEI Zeilen, nicht vier — die Sonde hätte das Modell doppelt so weit versprechen lassen, wie die Fähigkeit trägt, und genau das verbietet die Hüllkurven-Regel.

**Warum.** Eine Messung an einem Verb ist nur dann eine Messung DES Verbs, wenn sie gegen den Zustand OHNE das Verb läuft. Verwandt mit „ein Tamper, der nicht beisst, ist zuerst ein Verdacht gegen den Tamper" — hier war es ein Lauf, der zu früh grün wurde.

**Der Check, der es künftig fängt.** Die Sonde misst grundsätzlich als DIFFERENZ (mit und ohne die Fähigkeit) und druckt ihre Eich-Größe — den reinen Sprung — in dieselbe Ausgabe. Wer die Zahl liest, sieht sofort, ob das Verb überhaupt beteiligt war (die Spalte „Griffe").

**L2-M-a (2026-09-05): EIN unpaariges gerades Anführungszeichen in einem KOMMENTAR macht ein Tor in einer anderen Datei rot.** *(Motor-Bahn ch02 — die deutsche-Anführungszeichen-Klasse in neuem Gewand.)*

**Was passierte.** Ein neuer Kommentar in `sim.ts` schrieb `auf „was, wenn …verkauft".` — deutsches Zeichen auf, GERADES zu. `scripts/check-audio.mjs` Gesetz 9b zieht alle `"…"`-Literale der Datei mit einem Regex heraus, um zu prüfen, ob die Toast-Bindungen des Klang-Manifests noch auf eine Zeile passen. Das eine unpaarige Zeichen verschob die Paarbildung ALLER folgenden Literale; das Tor meldete daraufhin, `ink-splash` finde seine Zeile `/Platsch/` nicht mehr, und behauptete damit einen Copy-Umbau, den es nie gab. Der Kommentar stand dreihundert Zeilen von der gemeldeten Stelle entfernt.

**Warum.** Die bekannte Regel heisst „deutsche Anführungszeichen nie in Code" und wird gelesen als „nicht in Zeichenketten". Sie gilt aber genauso in KOMMENTAREN, sobald irgendein Werkzeug die Datei als Text liest statt als Syntaxbaum — und mehrere Tore dieses Repos tun genau das. Ein gemischtes Paar (`„` … `"`) ist dabei schlimmer als zwei deutsche, weil es aussieht wie ein Paar.

**Der Check, der es künftig fängt.** Zehn Sekunden, vor jedem Commit an einer Datei, die ein Tor als TEXT liest: `tr -cd '"' < datei | wc -c` muss GERADE sein. In diesem Repo schreibt man Zitate in Kommentaren als `»…«` — die Konvention stand schon in der Datei, sie wurde nur nicht befolgt.
