# LEXIKON_AT — das österreichische Wortverzeichnis für alle deutschen Spielzeilen

**Status: KANON v1 (R5-Welle 4, Session K2, 2026-08-15).** Verbindlich für **jede sichtbare
deutsche Zeile** des bemalten Buchs. C2 verfeinert die Liste und baut daraus das
Maschinen-Tor (`scripts/lexikon-at.json` + `check-copy-register.mjs`) — **diese Datei ist die
Prosa-Quelle, die Maschinen-Liste ist ihre Abschrift.**

## Wozu das hier gut ist

Das Kapitel spielt in einer österreichischen Schule und wird von österreichischen Kindern
gelesen. Bis heute stand nirgends, welches Wort gilt — und das Ergebnis steht im
ausgelieferten Spiel: die Karten sagen **„Füller"**, die Wortbank sagt **„Kugelschreiber"**,
das Keen-Spiel sagt **„Federpennal"**, der Korpus sagt **„Federmäppchen"**. Drei Register
nebeneinander, keines falsch, keines abgestimmt.

**Das eine Gesetz:** *Was das Kind liest, ist österreichisches Deutsch.* Was der Korpus als
Lernwort führt, bleibt davon unberührt (siehe §3) — das Lexikon regelt die **Erzählstimme**,
nicht das Schulbuch.

---

## §1 · Die Liste

Genus steht dabei, weil die Karten das Nomen fast immer mit Artikel nennen („Auf Deutsch:
**der** Spitzer.").

| Begriff (AT) | Genus | Verboten / nicht verwenden | Bemerkung |
|---|---|---|---|
| die **Füllfeder** | f. | *Füller*, *Federhalter* | Das Wesen IST eine Füllfeder — am Blatt geprüft (`pen_a.png`, 2026-08-15: Schaft mit goldener Feder-Spitze und Kappe, kein Druckknopf). „Füller" ist bundesdeutsch. ⚠ **das verbotene Wort „Füller" steht heute 4× sichtbar im Spiel** (siehe §4); „Füllfeder" 0× |
| der **Uhu-Stick** | m. | — | Kokis Wort, Erstwahl in der Erzählstimme |
| der **Klebestift** | m. | — | zulässiger, neutraler Zweitname; C2 entscheidet je Zeile, welcher besser klingt |
| der **Spitzer** | m. | *Anspitzer* | „Bleistiftspitzer" nur, wo die Zeile das lange Wort verträgt |
| der **Radiergummi** | m. | **Radierer** | „Radierer" ist im Deutschen der Kupferstecher. Die Karten sagen bereits durchgehend Radiergummi — der interne Skin-Name bleibt `eraser` |
| die **Schultasche** | f. | *Ranzen*, *Schulranzen*, *Tornister* | In SICHTBAREN Zeilen. **`ranzen` bleibt interner Skin- und Blattname** (`enc.ranzen.*`, `ranzen_a.png`) — Bezeichner sind keine Spielzeilen |
| das **Federpennal** | n. | *Federmäppchen*, *Mäppchen*, *Etui* | AT-Schulsprache. Der Korpus glosst `pencil case → Federmäppchen`; das ist Korpus, nicht Spielzeile (§3) |
| das **Heft** | n. | — | „Schulheft", wo der Kontext es braucht |
| das **Buch** | n. | — | |
| die **Musikanlage** | f. | *Lautsprecher*, *Boxen* | Ratifiziert in `STORY_SPINE_CH01.md` §2 (Insassen-Tabelle). Ein Kritiker fand genau hier den schärfsten Fehler einer Runde: Lehr-Karte „die Musikanlage", Rettungs-Karte „ein Lautsprecher" |
| das **Tablet** | n. | — | |
| der **Stuhl** | m. | — | **Ratifiziert** (Spine §2) und in Karten + Level so ausgeliefert. Siehe die Spannung unten |
| der **Sessel** | m. | — | **Zulässige AT-Zweitform, kein Verbot.** Die Wortbank glosst `chair → [Stuhl, Sessel]`, `vocab.json` nimmt beide als Antwort an. Weil die Insassen-Tabelle „der Stuhl" ratifiziert hat, **bleibt Stuhl in Spine und Karten** |
| die **Tafel** | f. | *Wandtafel* als Erstnennung | Die Fliegende Tafel ist der Kapitel-Gegner; ein Wort, überall |
| das **Klassenfoto** | n. | *Klassenbild* | Insassen-Tabelle |
| die **Jause** | f. | *Pausenbrot*, *Vesper* | falls je Essen vorkommt — heute nirgends |
| **grantig** | Adj. | **böse** (maschinell verboten), *bösartig*, *gemein* | „böse" steht in `BANNED_DE` und fällt schon durch das Tor. **„grantig" ist das Wort**, das die Lücke füllt — es beschreibt schlechte Laune, nicht Bosheit, und das ist die ganze Absicht |
| **Kritzel** (Nomen) / **kritzeln** | m./Verb | — | Die Tafel ist **vollgekritzelt** (R50). Steht bereits 5× sichtbar („Die Tafel kritzelt …") |
| **wischen** | Verb | — | Was das Kind mit der Tafel tut (R50): die Kritzel-Schichten **wegwischen** |
| **löschen** | Verb | — | AT-Schulsprache für dasselbe („die Tafel löschen"). Zweitwahl neben *wischen*; nicht in Zeilen, wo es nach *Datei löschen* klingen könnte |

**Die Farbwörter** (die Farb-Zeile heißt seit R47 schlicht „Der Radiergummi war blau."):
**rot · orange · gelb · grün · blau · rosa · braun · schwarz · weiß · grau**. Kein
*pink* (bundesdeutsch/englisch) — **rosa**. Kein *lila* neben *violett*: wenn eine der
beiden Farben je gebraucht wird, gilt **violett**. Die Farbe selbst folgt R41, also dem
**gemessenen Blatt**, nicht dem Wunsch der Zeile.

---

## §2 · Was NICHT unter dieses Lexikon fällt

* **Bezeichner, Skin-Namen, Blattnamen, Code-Kommentare.** `ranzen`, `eraser`, `obj_pen`,
  `tafel` bleiben, wie sie sind. Ein Bezeichner ist kein Wort, das ein Kind liest — ihn
  umzubenennen kostet Kunst-Blätter, Tests und Tapes und bringt keinem Kind etwas.
* **Englisch.** Das regelt der Korpus (`content/corpus/units/g1-u01/`), und nur der.
* **Zitate aus dem Schulbuch.** Steht ein Wort in einer Regel-Seite wörtlich so im Buch,
  gilt das Buch — die Regel-Seite ist ein Beleg, keine Erzählstimme.

---

## §3 · Die Divergenzen — wer entscheidet was

Hier stehen die Stellen, an denen Korpus und Spielzeile auseinandergehen. **Sie gehen
absichtlich auseinander**, und deshalb braucht jede Zeile einen Zuständigen.

| Englisch | Korpus-Glosse (`wordbank.json` / `vocab.json`) | Spielzeile (dieses Lexikon) | Zuständig |
|---|---|---|---|
| `pen` | Kugelschreiber | **die Füllfeder** | Korpus: **G3** · Spielzeile: **C2** |
| `pencil case` | Federmäppchen *(akzeptiert auch: Federpennal, Mäppchen)* | **das Federpennal** | Korpus: **G3** · Spielzeile: **C2** |
| `chair` | Stuhl, Sessel *(beide)* | **der Stuhl** (ratifiziert), *Sessel* zulässig | Spine §2 ist ratifiziert — **Fable** entscheidet, falls das je gedreht wird |
| `rubber` | Radiergummi | **der Radiergummi** | deckungsgleich |
| `school bag` | Schultasche | **die Schultasche** | deckungsgleich; `ranzen` bleibt intern |
| `glue stick` | *(keine Glosse im Korpus)* | **der Uhu-Stick** / der Klebestift | ⚠ ungedeckt — die deutsche Seite dieser Karte hat **keine** Korpus-Grundlage. **G3** |
| `pencil sharpener` | *(keine Glosse im Korpus)* | **der Spitzer** | ⚠ dito. **G3** |

**Die Zuständigkeits-Regel in einem Satz:** *Der Korpus sagt, was das Kind LERNT; das Lexikon
sagt, wie die Erzählstimme es NENNT.* Wo beides dasselbe Wort meint, gewinnt der Korpus;
wo die Erzählstimme österreichisch klingen soll, gewinnt das Lexikon. **Niemand ändert die
Glossen, um dieses Lexikon zu bedienen** — die Glossen sind Lehrbuch-Abschrift.

**★ Was „⚠ ungedeckt" NICHT heißt (2026-08-15, Ruling R80 — die einzige K3-Zeile in dieser
Datei).** Die beiden letzten Zeilen der Tabelle (`glue stick`, `pencil sharpener`) tragen
kein englisches Buchwort. Das ist eine **Kennzeichnung, keine Streich-Anweisung**: der
Uhu-Stick und der Spitzer bleiben Wesen im Level. Wörtlich entschieden: *kein SB-Wort ist
kein Grund zum Streichen.* Beide tragen deutsche Erzähl- und Hinweiszeilen, und ein Wesen,
das auf Deutsch angesprochen wird und auf Deutsch antwortet, braucht keine Vokabel-Karte,
um dazuzugehören. Was die Markierung verlangt, ist Ehrlichkeit an genau einer Stelle: **auf
diesen Karten darf keine englische Antwort abgefragt werden**, für die der Korpus keine
Grundlage liefert. G3 bleibt zuständig, falls der Korpus die Wörter später doch führt.

---

## §4 · Der Bestand am 2026-08-15 (gemessen, nicht geschätzt)

**Messgrundlage:** `ch01.tasks.v2.json` und `ch01.level.json` auf `origin/main` `b487e7c` —
also der Stand **vor** dieser Runde. **Zählmethode:** `git grep -I -P -i` mit
Wortgrenze links (`(?<![\p{L}])`), Textdateien only. Die Wortgrenze ist nicht Zierde:
ein naives `grep` auf `wischen` findet `zwischen`, eines auf `Ranzen` findet `Pflanzen`,
und eines ohne `-I` zählt Bytes in PNG-Dateien mit (bei „Uhu" waren das 233 statt 22).

* **„Füller" steht 4× in sichtbaren Zeilen** — `showsDe` :613, :654, :686 und `deWord` :639
  („Auf Deutsch: der Füller — und Gelb."). **Das ist C2s erste Arbeit aus diesem Lexikon.**
* **„Ranzen" steht 12× in den Aufgaben und 2× im Level — ausnahmslos als Bezeichner,
  Skin oder Blattname**, in keiner einzigen sichtbaren Zeile. Die Regel „sichtbar
  Schultasche, intern `ranzen`" beschreibt also den Ist-Zustand korrekt; hier ist nichts
  zu reparieren.
* **„Radierer" kommt in keiner Karte vor** (0 Treffer in beiden Dateien) — die Karten sagen
  bereits Radiergummi. Nur Code und Kommentare führen das Wort.
* **„Füllfeder" und „grantig" kamen VOR dieser Runde nirgends im Repo vor** (0 Treffer über
  alle Textdateien auf `origin/main` `b487e7c`) — beides sind neue Wörter, die **dieses
  Lexikon und der Story-Spine im selben PR einführen**. Wer sie ab jetzt sucht, findet sie
  also: in `LEXIKON_AT.md`, in `STORY_SPINE_CH01.md` §2/§5 und in den Registern. Der Satz
  „kommt im Repo nicht vor" wäre ab dem Merge falsch — deshalb steht hier das Datum dabei.
* **`STORY_SPINE_CH01.md` selbst verstieß gegen die neue Regel** (Radierer ×2, Füller ×1,
  Federmäppchen ×1) und ist im selben PR mitgezogen. Das ist der Normalfall, nicht die
  Ausnahme: **ein neues Gesetz macht alten Inhalt falsch**, und derselbe Schritt, der es
  aufstellt, prüft den Bestand dagegen.

---

## §5 · Belege

Die AT-Formen sind Kokis Wortlaut (15.08.) und österreichische Schulsprache. **Ein
Abgleich mit dem Österreichischen Wörterbuch (ÖWB) hat in dieser Session nicht
stattgefunden — es gab keinen Netzzugang.** Nach der Vorgabe des Auftrags trägt deshalb
jede Zeile, die allein auf Sprachgefühl beruht, hier ihren Vermerk:

* **(unbelegt — Koki prüft):** *Uhu-Stick* als Erstwahl gegenüber *Klebestift* ·
  *Jause* (kommt heute nirgends vor) · *violett* statt *lila* · die Zweitwahl-Reihenfolge
  von *wischen* vor *löschen* · **die Begründung, „grantig" beschreibe schlechte Laune und
  nicht Bosheit** — dass „böse" verboten ist, steht maschinell fest (`BANNED_DE`); dass
  ausgerechnet „grantig" der richtige Ersatz ist, ist Sprachgefühl.
* **Belegt im Repo, nicht im ÖWB:** *Stuhl/Sessel* (Wortbank führt beide, `vocab.json`
  akzeptiert beide) · *Federpennal* (`vocab.json` akzeptiert es bereits) ·
  *Schultasche* (Wortbank-Glosse) · *Radiergummi* (Wortbank-Glosse) · *Tafel*
  (Wortbank-Glosse `board → Tafel`).
* **Belegt am Bild:** *Füllfeder* — `apps/web/public/art/g1/paint/ch01/pen_a.png`,
  selbst angesehen am 2026-08-15. ⚠ **Belegt ist damit die IDENTITÄT (Füllfeder, nicht
  Kugelschreiber), nicht die FARBE.** Der Schaft wirkt auf dieser einen Zelle oliv-grün,
  die Karte sagt „gelb" — das ist eine offene Frage unter R41 und steht als **D-127** im
  Schulden-Register. Eine Zelle ist keine Messreihe.

---

## §Quellen

`PASSOVER_K2.md` §6a/§7 (R5-Welle 4) · Kokis Replay vom 2026-08-15 · Wortbank und
`vocab.json` der Unit 1 (`content/corpus/units/g1-u01/`) · `STORY_SPINE_CH01.md` §2
(ratifizierte Insassen-Tabelle) und §5 (harte Grenzen) · `BANNED_DE` in
`packages/content-schema/src/game-tasks.ts`.
