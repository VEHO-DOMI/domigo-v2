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

## 4 · Was G2 in p1 nachtraegt (nichts davon fehlt heute)

Nichts. p1 ist mit dem Bestands-Motor vollstaendig spielbar: Schweben, Waggons, Kaefig,
Regel-Seiten, Tropfen, zwei Gegner, Exit. Was p1 NOCH NICHT zeigen kann, ist die Farb-Rueckkehr
selbst (§1) — die Restore-Wesen stehen grau da und warten auf L4-M.
