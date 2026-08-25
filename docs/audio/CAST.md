# Der Cast — wer in DomiGo spricht

<!-- ERZEUGT aus docs/audio/cast.json durch docs/audio/cast-sheet.mjs.
     NICHT von Hand ändern: `node docs/audio/cast-sheet.mjs --check` schlägt sonst an. -->

_Entschieden: Koki, Ohr-Tor 1 der Bahn K4c, 2026-08-25 — »alle passen exakt auf ihre Rolle«. Neun britische Kandidat:innen aus dem eigenen Konto, ein identischer Satz, gleiches Tempo, gleiche Lautheit; Reihenfolge zufällig, Wetten eingeklappt. Das Ensemble ist damit FEST: eine Figur behält ihre Stimme, bis Koki sie ändert._

Jede Figur hat **eine** Stimme, und sie behält sie. Das ist der Unterschied zu vorher:
bis Staffel 1 bekam jede Aufnahme irgendeine Stimme, und dieselbe Lisa war einmal ein
Schulkind und einmal eine erwachsene Camp-Leiterin. Ab jetzt liest der Erzeuger diese
Liste — und kennt er eine Figur nicht, bricht er ab, statt still jemand anderen sprechen
zu lassen.

| Figur | Schlüssel | Rolle | Geschlecht | Stimme | Stimm-Id | Tempo | bisher in |
|---|---|---|---|---|---|---|---|
| **Leonie** | `leonie` | Schülerin, 13 — Erzählerin der Museums-Einheit | weiblich | Amelia — young and enthusiastic | `ZF6FPAbjXT4488VcRRnw` | 0.9 | g2-u02 |
| **David** | `david` | Schüler, 13 — Leonies bester Freund | männlich | Archie — English teen youth | `kmSVBPu7loj4ayNinwWM` | 0.9 | g2-u02 |
| **Ben** | `ben` | Schüler, 13 — Erzähler der Schultags- und der Camp-Einheit | männlich | Toby — British Male | `pYDLV125o4CgqP8i49Lg` | 0.9 | g2-u01, g2-u06 |
| **Mia** | `mia` | Schülerin, 12 — Erzählerin der Markt-Einheit | weiblich | Blondie — Children's Storyteller | `XXphLKNRxvJ1Qa95KBhX` | 0.9 | g2-u03 |
| **Emma** | `emma` | Schülerin, 13 — Erzählerin der Abstimmungs-Einheit | weiblich | Amelia — young and enthusiastic | `ZF6FPAbjXT4488VcRRnw` | 0.9 | g2-u04 |
| **Lisa** | `lisa` | Schülerin, 13 — Erzählerin der Wochenend-Einheit | weiblich | Blondie — Children's Storyteller | `XXphLKNRxvJ1Qa95KBhX` | 0.9 | g2-u07 |
| **Tom** | `tom` | Schüler, 13 — Nebenfigur (Kinopläne, g2-u07) | männlich | Connor | `qJXPML3QGhCJ3NLe2sEw` | 0.9 | — |
| **Mrs Smith** | `mrs-smith` | Lehrerin — begleitet die Klasse ins Museum | weiblich | Alice — Clear, Engaging Educator | `Xb7hH8MSUJpSbSDYk0k2` | 0.9 | g2-u02 |

## Abgenommen, aber noch frei

Diese Stimmen hat Koki am selben Vorsprechen abgenommen; sie gehören noch keiner Figur.
Eine neue Figur nimmt eine davon — **ohne** dass er noch einmal hören muss.

| Stimme | Rolle | Stimm-Id | wofür |
|---|---|---|---|
| Lily — Velvety Actress | erwachsen, weiblich | `pFZP5JQG7iQjIQuC4Bku` | Am Vorsprechen von Koki abgenommen, noch keiner Figur zugeteilt — für die nächste erwachsene Frauenrolle, ohne neues Ohr-Tor. |
| George — Warm, Captivating Storyteller | erwachsen, männlich | `JBFqnCBsd6RMkjVDRZzb` | Abgenommen, frei — Vorlese-Ton, Kandidat für eine Erzählstimme. |
| Daniel — Steady Broadcaster | erwachsen, männlich | `onwK4e9ZLuTAKqWW03F9` | Abgenommen, frei — maximale Deutlichkeit, Gegenpol zu George (Ansagen, Durchsagen, Führungen). |
| Archie — English teen youth | jung, männlich | `kmSVBPu7loj4ayNinwWM` | An David gebunden; hier nur zur Vollständigkeit der abgenommenen Neun. |

**Tempo** ist der Regler der Sprachmaschine: 1,0 ist die Normalgeschwindigkeit der Stimme,
0,9 ist spürbar ruhiger. Er ist eine Eigenschaft der *sprechenden Figur* — ein Stück darf
ihn überstimmen, wenn ein einzelner Text ruhiger laufen soll.

**Wie ein Hör-Stück eine Figur bestellt** (in `docs/audio/listening-voices.json`):

```json
{ "unit": "g2-u02", "taskKey": "museum", "cast": "leonie" }
{ "unit": "g2-u02", "taskKey": "museum", "castByTurn": ["leonie", "david", "leonie"] }
```

DAS ENSEMBLE (P-R13 Punkt 8). Wiederkehrende Figuren mit fest gepinnter Stimme — statt Zufalls-Stimmen je Aufnahme. Der Erzeuger (gen-listening-voice.mjs) liest diese Datei: ein Stück nennt `cast: "leonie"` oder `castByTurn: ["leonie", "david", …]` und bekommt die Stimme daraus. Eine Figur, die hier fehlt, bricht den Lauf HART ab — eine still eingesetzte Ersatzstimme wäre die schlimmste Variante. Das Leseblatt CAST.md wird AUS dieser Datei erzeugt (docs/audio/cast-sheet.mjs); zwei handgepflegte Fassungen wären genau die Drift, gegen die V-LC7 gebaut wurde. Die Liste `freieStimmen` sind die am Vorsprechen abgenommenen Stimmen, die noch keiner Figur gehören: eine neue Figur nimmt eine davon, ohne dass Koki noch einmal hören muss.

## Offen

Das Konto trägt nur ZWEI junge weibliche britische Stimmen (amelia, blondie). Solange der Cast mehr Mädchen braucht als zwei, ist die ElevenLabs-Bibliothek die Quelle — ein Klick je Stimme in Kokis Konto, bewusst NICHT von dieser Bahn gemacht (Konto-Änderung gehört Koki).
