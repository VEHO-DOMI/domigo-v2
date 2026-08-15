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

**PB-22 · Frag die laufende Klasse, ob sie deinen Code kennt — glaub nicht der URL.**
*(H1 Teil 3, 2026-08-14; früher P-65)* Der Live-Lauf sprach zuerst mit einem `next dev`
aus dem HAUPT-Klon, der auf Port 3000 stehen geblieben war — fremder, alter Code. Jede
Aussage „live geprüft" wäre falsch gewesen. Dieselbe Klasse: Port 3999 war von einem
fremden `frame-sink` belegt. *Regel:* eigener Port je Session, und vor jedem Live-Lauf
`typeof sim.<neueMethode> === "function"` prüfen.

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

**PB-18 · Eine Projektion der Quelle ist nicht die Quelle.** *(H1 Teil 2, 2026-08-14;
früher P-61)* Der Testraum in `entities.test.ts` hat Boden in Reihe 12, die Tafel fliegt
in Reihe 11 — Kreide zerbricht dort, bevor sie ein Kind erreichen kann. Die
Anti-Softlock-Prüfung lief deshalb **monatelang grün über einen Softlock, der live auf
der Produktion stand**. *Regel:* Jedes Kampf-Gesetz liest `shippedArena()`. Allgemein:
was ein Gesetz prüfen soll, bekommt die echte Auslieferung vorgesetzt, nie ein
handgebautes Modell davon.

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

**PB-29 · Ein Aufnahme-Werkzeug muss uhr-neutral sein — und das ist zu MESSEN.** *(F3,
2026-08-12)* F2 hatte berichtet, seine Bildstreifen seien „1 Bild = 1 Tick".
Nachgemessen kostete **jedes Bild drei Sechzigstel**, weil der Auslöser die Uhr
mittrieb. Eine vier Ticks kurze Anholung ist in Drei-Tick-Schritten gar nicht abbildbar
— der gesamte F2-Bildbeweis war gröber als behauptet. *Regel:* Bevor eine Bildserie als
Beweis gilt, wird nachgewiesen, dass das Aufnehmen die Simulation nicht weiterdreht.

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
