# GENERATION_LOG — jeder Take, sein Preis, sein Fingerabdruck

_Angelegt von `docs/audio/gen-elevenlabs.mjs` (R5 · S1). Die Prompts stehen woertlich in
`docs/audio/prompts.ch01.json`; hier steht, was daraus wurde. **Der Schluessel kommt in dieser
Datei nie vor** — `scripts/check-secrets.mjs` prueft das._


## Lauf 2026-08-17 16:55 — nur music-p1, step-paper

Konto vorher: creator/active, 0/300000 ·
nachher: 0/300000 ·
**Kontodifferenz: 0** ·
**Summe `character-cost`: 5** ⚠ die beiden Zahlen weichen ab (fremde Nutzung des Kontos moeglich) — beide stehen im Report
Takes: 1 erzeugt/vorhanden, 1 Fehler · Musik-Sekunden: 45

| Stem | Take | Art | Sek. | Credits | Bytes | sha1 | Dauer | Verdikt |
|---|---|---|---|---|---|---|---|---|
| `music-p1` | 1 | music | 45 | 0 | 0 | `—` | 0 ms | FEHLER: music-p1#1: HTTP 422 — {"detail":{"type":"unprocessable_entity","code":"unprocessable_entity","message":"`seed` cannot b |
| `step-paper` | 1 | sfx | 0.5 | 5 | 8821 | `2379a1fb8cd2` | 2503 ms | erzeugt |

## Lauf 2026-08-17 16:56 — nur music-p1

Konto vorher: creator/active, 0/300000 ·
nachher: 1198/300000 ·
**Kontodifferenz: 1198** ·
**Summe `character-cost`: 0** ⚠ die beiden Zahlen weichen ab (fremde Nutzung des Kontos moeglich) — beide stehen im Report
Takes: 1 erzeugt/vorhanden, 0 Fehler · Musik-Sekunden: 45

| Stem | Take | Art | Sek. | Credits | Bytes | sha1 | Dauer | Verdikt |
|---|---|---|---|---|---|---|---|---|
| `music-p1` | 1 | music | 45 | 0 | 720606 | `1424e88c3ffb` | 11254 ms | erzeugt |
