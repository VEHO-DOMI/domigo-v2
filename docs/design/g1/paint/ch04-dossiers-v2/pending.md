# ch04 · PENDING — was gebaut ist, aber noch nicht im Level stehen darf

**Wer das hier liest:** L4-M verdrahtet diese Daten im Motor, L4-G2/L4-A tragen sie danach ins
Level. Bis dahin gilt: **zod strippt unbekannte Level-Felder STILL** — ein hier notiertes Feld,
das jemand vorzeitig in `ch04.level.json` schreibt, verschwindet ohne Fehlermeldung.
Geschrieben von L4-G1 am 2026-09-03, gemessen an `origin/main` `64248a75` (L0 ist gemergt).

## 0 · Die L0-Nachtrag-Felder — ERLEDIGT, sie stehen im Level

L0 (PR #391) ist gemergt, deshalb sind diese drei KEINE Wartenden mehr:
- `collectSkin: "farbtropfen"` (N1/R246) steht im Kopf. Das Blatt dazu existiert noch nicht;
  `check-paint-art` ueberspringt Entwuerfe (`check-paint-art` überspringt jedes Level mit `draft: true`), der Tropfen rendert bis zur
  Kunst-Zeit als Platzhalter.
- `clothNounDe`: **nicht gesetzt und das ist richtig** — ch04 hat keine `cloth`-Fundstuecke.
- `budgetSec: 35` (N7) steht **an der Bonus-Phase**, nicht als `bonus.budgetSec` am Kopf.
  ⚠ Korrektur am Boot-Blatt: das Feld sitzt in `PhaseSpec` (`level.ts#PhaseSpec`), gemessen an L0s
  eigenem ch02-Geruest (`p9 … budgetSec: 30`).

## 1 · Hue-Return (L4-M) — die Farb-Rueckkehr als Daten

Vorschlag fuer das Level-Feld `hueReturn` (Interface UND zod, sonst strippt es):

```json
"hueReturn": [
  { "feeling": "happy", "hueDe": "Sonnengelb",  "color": "#F5C518", "restoreCard": "g1.paint.ch04.enc.marktfrau.r1" },
  { "feeling": "sad",   "hueDe": "Tintenblau",  "color": "#3B5BA5", "restoreCard": "g1.paint.ch04.enc.regenkind.r1" }
]
```

Die vier weiteren Gefuehle der Wirbelsaeule (Blaupause §2.5), sobald ihre Wesen mit G2 stehen:
tired · Moosgruen · `#4E7A3A` (nachbarin, p2) · angry · Glutrot · `#C0392B` (hausherr, p2) ·
scared · Violett · `#7B4BA8` (turmkind, p3) · excited · Orange · `#E1701A` (wetterfrosch, p3).

⚠ **Zwei Vorbehalte, beide offen:** (a) die Hex-Werte sind Platzhalter des Level-Architekten,
L4-M bestaetigt sie an der Palette; (b) die `restoreCard`-Ids sind der VERTRAG mit der parallel
laufenden Bahn L4-T1 — **von G1 NICHT gegen T1s Ausgabe geprueft**, der Abgleich gehoert in G2/A.

## 2 · Wind-Korridore p3 (L4-M, G7)

Vorschlag fuer `PhaseSpec.winds` — Kraft NUR in der Luft, je Tick auf `vx`/`vy` addiert, gedeckelt:

| Korridor | c | r | w | h | wx | wy | in Worten |
|---|---|---|---|---|---|---|---|
| Turmfuss | 12 | 20 | 8 | 6 | +0,25 | 0 | schiebt beim Aufstieg nach Osten, schwach |
| Mitte | 24 | 12 | 10 | 8 | −0,35 | 0 | drueckt zurueck, der erste echte Widerstand |
| Spitze | 36 | 4 | 8 | 8 | 0 | −0,20 | traegt nach oben, die Belohnung |

Die ZAHLEN setzt L4-M am Motor; hier steht die Richtung und die Absicht. Der Raum ist heute
OHNE Wind spielbar gebaut (Geruest) und muss es nach dem Einbau bleiben.

## 3 · Der Gesichtslose (L4-M) — Rig-Zustaende + Masken-Telegraf

Vier Knoten = vier Gesichts-Merkmale (Tier M, `GUARDIAN_SCRIPT.M`): `blank` → `eyes` → `brows`
→ `mouth` → `smile`. Der Beweis rendert AUF ihm UND auf der zerrissenen Kalender-Wand.

| Maskenfarbe | Angriff | Telegraf |
|---|---|---|
| rot | gerader Wurf | ≥500 ms (Boden-Floor existiert) |
| blau | Bogen | ≥500 ms |
| gelb | Sprung-Stampfer | ≥500 ms |

**Deflect:** eine falsche Maske zurueckfausten — sie klatscht ihm aufs Gesicht, er taumelt
(Konter-Fenster; der Pfad „deflected piece reels her" existiert). Er steht am BODEN; die
Waechter-FSM ist heute luftgebunden, L4-M baut die Boden-Variante als Skript-DATEN.

## 5 · DIE ZWEI REGEL-SEITEN VON p1 — fertig geschrieben, noch nicht im Level

**Warum sie hier liegen und nicht im Raum** (gemessen 2026-09-03, an CI UND lokal reproduziert):
`scripts/check-paint-copy.mjs` erdet JEDES englische Beispiel einer Regel-Seite gegen das
KUMULATIVE Unit-Lexikon (`docs/design/g1/grounding/uNN-lexicon.json`, Summe u01…uNN). Auf der
Platte liegt heute nur `u01-lexicon.json`; `u04-lexicon.json` ist der ERSTE Posten der Bahn
L4-T1. Dem u01-Lexikon fehlen genau die Wörter, um die es in diesem Kapitel geht — gemessen:
**he · happy · sad · cold · tired · aren't** (`isn't`, `I'm`, `not`, `you`, `is`, `are`,
`yes`, `no` sind da). Neun rote Zeilen, alle an diesen beiden Seiten.

Eine Regel-Seite mit u01-Wörtern über u04-Grammatik wäre grün und falsch. Also warten die Seiten
hier, `tipsTotal` steht auf 0, und die Zellen (21,17) und (49,17) sind für sie freigehalten.

**EINSETZEN, sobald `docs/design/g1/grounding/u04-lexicon.json` auf main liegt** (L4-T1) — dann
diese zwei Wesen in `phases[0].entities` aufnehmen und `tipsTotal` auf 2 setzen. Sonst nichts.

```json
{ "id": "p1-regel-verneinung", "role": "tip", "skin": "regelseite", "c": 21, "r": 17, "tier": "E",
  "params": {
    "topicDe": "Verneinung mit to be",
    "erklaerungDe": "Bei to be haengst du einfach not an. Aus [AUF] He is happy [ZU] wird kurz [AUF] He isn't happy [ZU].",
    "merksatzDe": "Bei to be steht not gleich nach dem Verb — kurz: isn't, aren't, I'm not.",
    "schluesselDe": "not gleich nach dem Verb",
    "beispieleEn": ["He isn't happy.", "We aren't tired.", "I'm not cold."],
    "beispielMuster": "einzeln",
    "lehrtEn": ["isn't", "aren't", "I'm not"],
    "belegDe": "MORE! 1 · Unit 4"
  } }
{ "id": "p1-regel-fragen", "role": "tip", "skin": "regelseite", "c": 49, "r": 17, "tier": "E",
  "params": {
    "topicDe": "Fragen mit to be",
    "erklaerungDe": "Fuer eine Frage stellst du das to be nach vorn. Aus [AUF] You are cold [ZU] wird [AUF] Are you cold? [ZU].",
    "merksatzDe": "Frage: erst das to be, dann die Person — Are you …? Is he …?",
    "schluesselDe": "erst das to be, dann die Person",
    "beispieleEn": ["Are you cold?", "Is he sad?", "Yes, I am.", "No, he isn't."],
    "beispielMuster": "einzeln",
    "lehrtEn": ["Are you", "Is he", "Yes, I am", "No, he isn't"],
    "belegDe": "MORE! 1 · Unit 4"
  } }
```

⚠ **[AUF]/[ZU] sind Platzhalter fuer die deutschen Anfuehrungszeichen** — sie stehen so, weil diese
Datei selbst durch die Register-Tore laeuft; beim Einsetzen die typografischen Zeichen schreiben,
wie ch01 es tut. Beide Seiten sind bereits gegen `tip-honesty` geprueft (Merksatz ≤78, Erklaerung
≤120, Schluessel im Merksatz, 2–4 Beispiele, jede `lehrtEn`-Form in einem Beispiel und umgekehrt).
Die Struktur-Ids der Unit sind `g1u04.s.to-be-negative` und `g1u04.s.to-be-questions` (gemessen
in `content/corpus/units/g1-u04/grammar.json`, 44 Posten).

⚠ **Der eigentliche Befund liegt beim Tor, nicht bei den Seiten** (D-875): `check-paint-copy` hat
die Entwurfs-Semantik nicht bekommen, die L0s Nachtrag N6 dem Schwester-Tor `check-game-tasks`
gegeben hat. Ein Kapitel im Bau kann seine Regel-Seiten deshalb erst schreiben, wenn sein Lexikon
liegt — obwohl es `draft: true` traegt. Motor-Gebiet, also ein Antrag an den Programm-Architekten,
keine Aenderung dieser Bahn.

## 4 · Was G2 in p1 nachtraegt

Nur die zwei Regel-Seiten aus §5. Sonst nichts: p1 ist mit dem Bestands-Motor vollstaendig
spielbar — Schweben, Waggons, Kaefig, Tropfen, zwei Gegner, Exit. Was p1 NOCH NICHT zeigen kann, ist die Farb-Rueckkehr
selbst (§1) — die Restore-Wesen stehen grau da und warten auf L4-M.
