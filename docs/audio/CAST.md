# Der Cast — wer in DomiGo spricht

<!-- ERZEUGT aus docs/audio/cast.json durch docs/audio/cast-sheet.mjs.
     NICHT von Hand ändern: `node docs/audio/cast-sheet.mjs --check` schlägt sonst an. -->

_Entschieden: PROVISORISCH — wartet auf Kokis Ohr-Tor 1 (Bahn K4c). Bis dahin stehen hier die Amtsinhaber aus K5a/K4b._

Jede Figur hat **eine** Stimme, und sie behält sie. Das ist der Unterschied zu vorher:
bis Staffel 1 bekam jede Aufnahme irgendeine Stimme, und dieselbe Lisa war einmal ein
Schulkind und einmal eine erwachsene Camp-Leiterin. Ab jetzt liest der Erzeuger diese
Liste — und kennt er eine Figur nicht, bricht er ab, statt still jemand anderen sprechen
zu lassen.

| Figur | Schlüssel | Rolle | Geschlecht | Stimme | Stimm-Id | Tempo | bisher in |
|---|---|---|---|---|---|---|---|
| **Leonie** | `leonie` | Schülerin, 13 — Erzählerin der Museums-Einheit | weiblich | Amelia — young and enthusiastic | `ZF6FPAbjXT4488VcRRnw` | 0.9 | g2-u02 |
| **David** | `david` | Schüler, 13 — Leonies bester Freund | männlich | Archie — English teen youth | `kmSVBPu7loj4ayNinwWM` | 0.9 | g2-u02 |

**Tempo** ist der Regler der Sprachmaschine: 1,0 ist die Normalgeschwindigkeit der Stimme,
0,9 ist spürbar ruhiger. Er ist eine Eigenschaft der *sprechenden Figur* — ein Stück darf
ihn überstimmen, wenn ein einzelner Text ruhiger laufen soll.

**Wie ein Hör-Stück eine Figur bestellt** (in `docs/audio/listening-voices.json`):

```json
{ "unit": "g2-u02", "taskKey": "museum", "cast": "leonie" }
{ "unit": "g2-u02", "taskKey": "museum", "castByTurn": ["leonie", "david", "leonie"] }
```

DAS ENSEMBLE (P-R13 Punkt 8). Wiederkehrende Figuren mit fest gepinnter Stimme — statt Zufalls-Stimmen je Aufnahme. Der Erzeuger (gen-listening-voice.mjs) liest diese Datei: ein Stück nennt `cast: "leonie"` oder `castByTurn: ["leonie", "david", …]` und bekommt die Stimme daraus. Eine Figur, die hier fehlt, bricht den Lauf HART ab — eine still eingesetzte Ersatzstimme wäre die schlimmste Variante. Das Leseblatt CAST.md wird AUS dieser Datei erzeugt (docs/audio/cast-sheet.mjs); zwei handgepflegte Fassungen wären genau die Drift, gegen die V-LC7 gebaut wurde.
