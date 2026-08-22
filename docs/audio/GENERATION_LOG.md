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

## Lauf 2026-08-17 20:23 — nur step-paper, jump, land-soft, card-open, letter-take

Konto vorher: creator/active, 1198/300000 ·
nachher: 1198/300000 ·
**Kontodifferenz: 0** ·
**Summe `character-cost`: 155**

> Die beiden Zahlen messen NICHT dasselbe (gemessen 17.08.2026): fuer **Musik** meldet der
> Header `character-cost` **0**, waehrend das Konto sich bewegt (45 s ≙ 1198 Credits); fuer
> **Effekte** meldet der Header einen Wert (0,5 s ≙ 5), waehrend das Konto **stehen bleibt**.
> Massgeblich ist deshalb die **Kontodifferenz**; der Header ist ein Signal je Anfrage, keine
> Summe. Weichen beide auf eine dritte Weise ab, koennte jemand anderes dasselbe Konto benutzen —
> dann gehoeren beide Zahlen mit diesem Vermerk in den Report.
Takes: 32 erzeugt/vorhanden, 0 Fehler · Musik-Sekunden: 0

| Stem | Take | Art | Sek. | Credits | Bytes | sha1 | Dauer | Verdikt |
|---|---|---|---|---|---|---|---|---|
| `step-paper` | 2 | sfx | 0.5 | 5 | 8821 | `da51eb9d24ce` | 2891 ms | erzeugt |
| `step-paper` | 3 | sfx | 0.5 | 5 | 8821 | `41f03e8b9265` | 2982 ms | erzeugt |
| `step-paper` | 4 | sfx | 0.5 | 5 | 8821 | `01f1e1800baa` | 3028 ms | erzeugt |
| `step-paper` | 6 | sfx | 0.5 | 5 | 8821 | `5f150e4ef035` | 2564 ms | erzeugt |
| `step-paper` | 5 | sfx | 0.5 | 5 | 8821 | `ad3008cccdd0` | 2889 ms | erzeugt |
| `jump` | 1 | sfx | 0.5 | 5 | 8821 | `c99e81f0303c` | 3070 ms | erzeugt |
| `jump` | 2 | sfx | 0.5 | 5 | 8821 | `c913b6e06c8f` | 2421 ms | erzeugt |
| `jump` | 3 | sfx | 0.5 | 5 | 8821 | `b6dc81b92003` | 2711 ms | erzeugt |
| `jump` | 4 | sfx | 0.5 | 5 | 8821 | `aa4b2f7df8e5` | 2402 ms | erzeugt |
| `jump` | 6 | sfx | 0.5 | 5 | 8821 | `3bab78e7c627` | 2115 ms | erzeugt |
| `land-soft` | 1 | sfx | 0.5 | 5 | 8821 | `322a26d71235` | 2392 ms | erzeugt |
| `land-soft` | 2 | sfx | 0.5 | 5 | 8821 | `d20cf2653abb` | 2290 ms | erzeugt |
| `land-soft` | 3 | sfx | 0.5 | 5 | 8821 | `5a74878c477d` | 2584 ms | erzeugt |
| `land-soft` | 4 | sfx | 0.5 | 5 | 8821 | `1fd0a5b14eb5` | 2211 ms | erzeugt |
| `land-soft` | 5 | sfx | 0.5 | 5 | 8821 | `b3de219795a2` | 2454 ms | erzeugt |
| `jump` | 5 | sfx | 0.5 | 5 | 8821 | `ad48024c1e8b` | 8899 ms | erzeugt |
| `land-soft` | 6 | sfx | 0.5 | 5 | 8821 | `d03f2c04f73c` | 2404 ms | erzeugt |
| `letter-take` | 1 | sfx | 0.5 | 5 | 8821 | `1dfbfe663e87` | 2373 ms | erzeugt |
| `letter-take` | 2 | sfx | 0.5 | 5 | 8821 | `2b11a3fe20fe` | 2243 ms | erzeugt |
| `letter-take` | 3 | sfx | 0.5 | 5 | 8821 | `f05c5b95e1f7` | 2353 ms | erzeugt |
| `letter-take` | 4 | sfx | 0.5 | 5 | 8821 | `c66f37786f01` | 2425 ms | erzeugt |
| `letter-take` | 5 | sfx | 0.5 | 5 | 8821 | `8aed699af859` | 2043 ms | erzeugt |
| `letter-take` | 6 | sfx | 0.5 | 5 | 8821 | `4dc1951b92e9` | 2119 ms | erzeugt |
| `letter-take` | 7 | sfx | 0.5 | 5 | 8821 | `d58a91095e39` | 2280 ms | erzeugt |
| `letter-take` | 8 | sfx | 0.5 | 5 | 8821 | `7ec7c40727ec` | 2287 ms | erzeugt |
| `card-open` | 1 | sfx | 0.5 | 5 | 8821 | `7df48dabfcda` | 2101 ms | erzeugt |
| `card-open` | 2 | sfx | 0.5 | 5 | 8821 | `cd6330e458fd` | 2466 ms | erzeugt |
| `card-open` | 3 | sfx | 0.5 | 5 | 8821 | `96fc86d4d570` | 2330 ms | erzeugt |
| `card-open` | 4 | sfx | 0.5 | 5 | 8821 | `736957a654e4` | 2273 ms | erzeugt |
| `card-open` | 5 | sfx | 0.5 | 5 | 8821 | `4bc6ccb1f8fb` | 2444 ms | erzeugt |
| `card-open` | 6 | sfx | 0.5 | 5 | 8821 | `44c975c0589f` | 2475 ms | erzeugt |

## Lauf 2026-08-17 20:48 — nur music-p1

Konto vorher: creator/active, 1353/300000 ·
nachher: 1353/300000 ·
**Kontodifferenz: 0** ·
**Summe `character-cost`: 0**

> Die beiden Zahlen messen NICHT dasselbe (gemessen 17.08.2026): fuer **Musik** meldet der
> Header `character-cost` **0**, waehrend das Konto sich bewegt (45 s ≙ 1198 Credits); fuer
> **Effekte** meldet der Header einen Wert (0,5 s ≙ 5), waehrend das Konto **stehen bleibt**.
> Massgeblich ist deshalb die **Kontodifferenz**; der Header ist ein Signal je Anfrage, keine
> Summe. Weichen beide auf eine dritte Weise ab, koennte jemand anderes dasselbe Konto benutzen —
> dann gehoeren beide Zahlen mit diesem Vermerk in den Report.
Takes: 3 erzeugt/vorhanden, 0 Fehler · Musik-Sekunden: 135

| Stem | Take | Art | Sek. | Credits | Bytes | sha1 | Dauer | Verdikt |
|---|---|---|---|---|---|---|---|---|
| `music-p1` | 2 | music | 45 | 0 | 720606 | `dd0826929f56` | 12133 ms | erzeugt |
| `music-p1` | 3 | music | 45 | 0 | 720606 | `bee30e0795d6` | 13236 ms | erzeugt |

## Lauf 2026-08-17 21:02

Konto vorher: creator/active, 3739/300000 ·
nachher: 20273/300000 ·
**Kontodifferenz: 16534** ·
**Summe `character-cost`: 1342**

> Die beiden Zahlen messen NICHT dasselbe (gemessen 17.08.2026): fuer **Musik** meldet der
> Header `character-cost` **0**, waehrend das Konto sich bewegt (45 s ≙ 1198 Credits); fuer
> **Effekte** meldet der Header einen Wert (0,5 s ≙ 5), waehrend das Konto **stehen bleibt**.
> Massgeblich ist deshalb die **Kontodifferenz**; der Header ist ein Signal je Anfrage, keine
> Summe. Weichen beide auf eine dritte Weise ab, koennte jemand anderes dasselbe Konto benutzen —
> dann gehoeren beide Zahlen mit diesem Vermerk in den Report.
Takes: 219 erzeugt/vorhanden, 0 Fehler · Musik-Sekunden: 708

| Stem | Take | Art | Sek. | Credits | Bytes | sha1 | Dauer | Verdikt |
|---|---|---|---|---|---|---|---|---|
| `step-garden` | 1 | sfx | 0.5 | 5 | 8821 | `bc5f3276a670` | 2264 ms | erzeugt |
| `step-garden` | 3 | sfx | 0.5 | 5 | 8821 | `8dcd49ecec3c` | 2650 ms | erzeugt |
| `step-garden` | 2 | sfx | 0.5 | 5 | 8821 | `3e35799b0d81` | 2687 ms | erzeugt |
| `step-garden` | 4 | sfx | 0.5 | 5 | 8821 | `8c18320775bd` | 2582 ms | erzeugt |
| `step-garden` | 5 | sfx | 0.5 | 5 | 8821 | `827379848d39` | 2419 ms | erzeugt |
| `step-garden` | 6 | sfx | 0.5 | 5 | 8821 | `fe4c4a04e073` | 2512 ms | erzeugt |
| `step-board` | 1 | sfx | 0.5 | 5 | 8821 | `f6ff921947fc` | 2530 ms | erzeugt |
| `step-board` | 2 | sfx | 0.5 | 5 | 8821 | `12e38caccd44` | 3267 ms | erzeugt |
| `step-board` | 3 | sfx | 0.5 | 5 | 8821 | `a11692c43ce2` | 3786 ms | erzeugt |
| `step-board` | 4 | sfx | 0.5 | 5 | 8821 | `daf8508dc23c` | 2670 ms | erzeugt |
| `step-board` | 6 | sfx | 0.5 | 5 | 8821 | `b4eee02a1334` | 2190 ms | erzeugt |
| `step-board` | 5 | sfx | 0.5 | 5 | 8821 | `2027355e2976` | 2727 ms | erzeugt |
| `land-hard` | 1 | sfx | 0.6 | 6 | 10493 | `87bac02ec676` | 2184 ms | erzeugt |
| `land-hard` | 2 | sfx | 0.6 | 6 | 10493 | `b9045a8981a6` | 1801 ms | erzeugt |
| `land-hard` | 3 | sfx | 0.6 | 6 | 10493 | `21fe4a3bbaf6` | 2692 ms | erzeugt |
| `land-hard` | 4 | sfx | 0.6 | 6 | 10493 | `0673fc7ce2c0` | 1938 ms | erzeugt |
| `land-hard` | 5 | sfx | 0.6 | 6 | 10493 | `35468af9cc5b` | 1823 ms | erzeugt |
| `land-hard` | 6 | sfx | 0.6 | 6 | 10493 | `f569cdb76902` | 2086 ms | erzeugt |
| `slide` | 1 | sfx | 0.8 | 8 | 13836 | `bcf1c573777f` | 1961 ms | erzeugt |
| `slide` | 2 | sfx | 0.8 | 8 | 13836 | `b4955a5510da` | 2097 ms | erzeugt |
| `slide` | 3 | sfx | 0.8 | 8 | 13836 | `9b04458db7e2` | 1922 ms | erzeugt |
| `slide` | 4 | sfx | 0.8 | 8 | 13836 | `8d531101b8d2` | 2064 ms | erzeugt |
| `slide` | 5 | sfx | 0.8 | 8 | 13836 | `1e98fa2c689e` | 1964 ms | erzeugt |
| `slide` | 6 | sfx | 0.8 | 8 | 13836 | `558333f9bc9d` | 2138 ms | erzeugt |
| `cage-open` | 1 | sfx | 0.8 | 8 | 13836 | `8b6e3fbc5e21` | 1960 ms | erzeugt |
| `cage-open` | 2 | sfx | 0.8 | 8 | 13836 | `3c4024002843` | 1921 ms | erzeugt |
| `cage-open` | 4 | sfx | 0.8 | 8 | 13836 | `a0a18dce3b58` | 2199 ms | erzeugt |
| `cage-open` | 5 | sfx | 0.8 | 8 | 13836 | `ca00ba9aa09c` | 1991 ms | erzeugt |
| `cage-open` | 3 | sfx | 0.8 | 8 | 13836 | `a7fe5f4d1743` | 3632 ms | erzeugt |
| `cage-open` | 6 | sfx | 0.8 | 8 | 13836 | `39adb7416248` | 1784 ms | erzeugt |
| `cage-locked` | 1 | sfx | 0.5 | 5 | 8821 | `9076be150309` | 2095 ms | erzeugt |
| `cage-locked` | 2 | sfx | 0.5 | 5 | 8821 | `fdf426d6d667` | 1890 ms | erzeugt |
| `cage-locked` | 3 | sfx | 0.5 | 5 | 8821 | `484c1a584d40` | 1801 ms | erzeugt |
| `cage-locked` | 4 | sfx | 0.5 | 5 | 8821 | `e0edec661aa7` | 1765 ms | erzeugt |
| `cage-locked` | 5 | sfx | 0.5 | 5 | 8821 | `2e1e725eb124` | 1802 ms | erzeugt |
| `cage-locked` | 6 | sfx | 0.5 | 5 | 8821 | `bffdf6e4565b` | 2030 ms | erzeugt |
| `cage-free` | 1 | sfx | 1.8 | 18 | 29301 | `664c7d66fe10` | 2104 ms | erzeugt |
| `cage-free` | 2 | sfx | 1.8 | 18 | 29301 | `be52762a768f` | 2363 ms | erzeugt |
| `cage-free` | 3 | sfx | 1.8 | 18 | 29301 | `f4851ce944bc` | 1965 ms | erzeugt |
| `cage-free` | 4 | sfx | 1.8 | 18 | 29301 | `c9a6ea1b0a9b` | 2069 ms | erzeugt |
| `cage-free` | 5 | sfx | 1.8 | 18 | 29301 | `3be7585901e2` | 1996 ms | erzeugt |
| `cage-free` | 6 | sfx | 1.8 | 18 | 29301 | `7a8bd18772b9` | 2021 ms | erzeugt |
| `door-open` | 1 | sfx | 0.8 | 8 | 13836 | `c43279090432` | 2044 ms | erzeugt |
| `door-open` | 2 | sfx | 0.8 | 8 | 13836 | `e04b6d46c922` | 2237 ms | erzeugt |
| `door-open` | 3 | sfx | 0.8 | 8 | 13836 | `a2dfb15656c2` | 1857 ms | erzeugt |
| `door-open` | 4 | sfx | 0.8 | 8 | 13836 | `e0261279245f` | 1840 ms | erzeugt |
| `door-open` | 5 | sfx | 0.8 | 8 | 13836 | `332509b9ac7d` | 2040 ms | erzeugt |
| `door-open` | 6 | sfx | 0.8 | 8 | 13836 | `cbf972e8f066` | 2024 ms | erzeugt |
| `gate-waits` | 1 | sfx | 0.5 | 5 | 8821 | `32e69173c5fc` | 2419 ms | erzeugt |
| `gate-waits` | 2 | sfx | 0.5 | 5 | 8821 | `7084b5eae13b` | 2304 ms | erzeugt |
| `gate-waits` | 3 | sfx | 0.5 | 5 | 8821 | `bad64e7fcd22` | 2128 ms | erzeugt |
| `gate-waits` | 4 | sfx | 0.5 | 5 | 8821 | `ec25661a4a41` | 2132 ms | erzeugt |
| `gate-waits` | 5 | sfx | 0.5 | 5 | 8821 | `f269120ad539` | 2079 ms | erzeugt |
| `gate-waits` | 6 | sfx | 0.5 | 5 | 8821 | `6c318e09ee9f` | 2157 ms | erzeugt |
| `letters-all` | 1 | sfx | 1.8 | 18 | 29301 | `ffa21fda184b` | 2007 ms | erzeugt |
| `letters-all` | 2 | sfx | 1.8 | 18 | 29301 | `a04a1b7f794c` | 2035 ms | erzeugt |
| `letters-all` | 3 | sfx | 1.8 | 18 | 29301 | `28199fe85abc` | 2017 ms | erzeugt |
| `letters-all` | 4 | sfx | 1.8 | 18 | 29301 | `e031fcd02ba7` | 2057 ms | erzeugt |
| `letters-all` | 5 | sfx | 1.8 | 18 | 29301 | `4be2481e7fb3` | 2034 ms | erzeugt |
| `letters-all` | 6 | sfx | 1.8 | 18 | 29301 | `58b0ffa2aacd` | 1948 ms | erzeugt |
| `page-take` | 1 | sfx | 0.6 | 6 | 10493 | `b63bb0dc39db` | 2184 ms | erzeugt |
| `page-take` | 2 | sfx | 0.6 | 6 | 10493 | `a2deac2b0197` | 2304 ms | erzeugt |
| `page-take` | 3 | sfx | 0.6 | 6 | 10493 | `300d3a9a58c7` | 2606 ms | erzeugt |
| `page-take` | 4 | sfx | 0.6 | 6 | 10493 | `ab7d66c28b62` | 2140 ms | erzeugt |
| `page-take` | 5 | sfx | 0.6 | 6 | 10493 | `b5352c2c6135` | 2746 ms | erzeugt |
| `page-take` | 6 | sfx | 0.6 | 6 | 10493 | `64f9c955b68b` | 2634 ms | erzeugt |
| `wipe` | 1 | sfx | 0.7 | 7 | 12164 | `0658b153d988` | 2200 ms | erzeugt |
| `wipe` | 2 | sfx | 0.7 | 7 | 12164 | `015d2d098fe2` | 2444 ms | erzeugt |
| `wipe` | 3 | sfx | 0.7 | 7 | 12164 | `33a4311ea26f` | 2574 ms | erzeugt |
| `wipe` | 4 | sfx | 0.7 | 7 | 12164 | `6f8980055b97` | 2562 ms | erzeugt |
| `wipe` | 5 | sfx | 0.7 | 7 | 12164 | `76271718d594` | 2173 ms | erzeugt |
| `wipe` | 6 | sfx | 0.7 | 7 | 12164 | `a56b9bd1a051` | 2183 ms | erzeugt |
| `board-bloom` | 1 | sfx | 2 | 20 | 33062 | `764bf78599f6` | 1929 ms | erzeugt |
| `board-bloom` | 2 | sfx | 2 | 20 | 33062 | `0014558a5d04` | 2140 ms | erzeugt |
| `board-bloom` | 4 | sfx | 2 | 20 | 33062 | `6898177ed69d` | 1979 ms | erzeugt |
| `board-bloom` | 3 | sfx | 2 | 20 | 33062 | `a04707b7ab93` | 2125 ms | erzeugt |
| `board-bloom` | 5 | sfx | 2 | 20 | 33062 | `9ac409229846` | 2398 ms | erzeugt |
| `board-bloom` | 6 | sfx | 2 | 20 | 33062 | `e845ceadb8f3` | 2453 ms | erzeugt |
| `board-bloom` | 7 | sfx | 2 | 20 | 33062 | `6a8f8a32efa2` | 2415 ms | erzeugt |
| `board-bloom` | 8 | sfx | 2 | 20 | 33062 | `f943ded01397` | 2264 ms | erzeugt |
| `arena-brief` | 1 | sfx | 1.8 | 18 | 29301 | `52d1e9b0f876` | 2276 ms | erzeugt |
| `arena-brief` | 2 | sfx | 1.8 | 18 | 29301 | `2b2368e60087` | 2263 ms | erzeugt |
| `arena-brief` | 3 | sfx | 1.8 | 18 | 29301 | `03d5a8dc99f8` | 2302 ms | erzeugt |
| `arena-brief` | 4 | sfx | 1.8 | 18 | 29301 | `99bc3432af3b` | 2430 ms | erzeugt |
| `arena-brief` | 5 | sfx | 1.8 | 18 | 29301 | `acd1a35f77b0` | 2397 ms | erzeugt |
| `boss-window` | 1 | sfx | 0.7 | 7 | 12164 | `a2707237bbfd` | 2160 ms | erzeugt |
| `arena-brief` | 6 | sfx | 1.8 | 18 | 29301 | `3f8926f3151f` | 2466 ms | erzeugt |
| `boss-window` | 2 | sfx | 0.7 | 7 | 12164 | `2187298a4630` | 2319 ms | erzeugt |
| `boss-window` | 5 | sfx | 0.7 | 7 | 12164 | `41014bf09205` | 2021 ms | erzeugt |
| `boss-window` | 3 | sfx | 0.7 | 7 | 12164 | `70f195487263` | 2440 ms | erzeugt |
| `boss-window` | 4 | sfx | 0.7 | 7 | 12164 | `b81fb8fa8185` | 2549 ms | erzeugt |
| `boss-window` | 6 | sfx | 0.7 | 7 | 12164 | `c3757a2282bd` | 2151 ms | erzeugt |
| `ink-splash` | 1 | sfx | 0.5 | 5 | 8821 | `47375b0aabc0` | 2196 ms | erzeugt |
| `ink-splash` | 2 | sfx | 0.5 | 5 | 8821 | `a3b7c060bb4c` | 2286 ms | erzeugt |
| `ink-splash` | 3 | sfx | 0.5 | 5 | 8821 | `31ccaf8c7298` | 2155 ms | erzeugt |
| `ink-splash` | 4 | sfx | 0.5 | 5 | 8821 | `ebd14d991eb2` | 1995 ms | erzeugt |
| `ink-splash` | 5 | sfx | 0.5 | 5 | 8821 | `ccad04402fea` | 3511 ms | erzeugt |
| `ink-splash` | 6 | sfx | 0.5 | 5 | 8821 | `ab3f657a08fd` | 1922 ms | erzeugt |
| `ink-splash` | 7 | sfx | 0.5 | 5 | 8821 | `c754a02b2f5c` | 2143 ms | erzeugt |
| `ink-splash` | 8 | sfx | 0.5 | 5 | 8821 | `f3f9fc4eadd5` | 2366 ms | erzeugt |
| `bump` | 1 | sfx | 0.5 | 5 | 8821 | `7738be16a009` | 2488 ms | erzeugt |
| `bump` | 2 | sfx | 0.5 | 5 | 8821 | `76b17ee8dc3c` | 2871 ms | erzeugt |
| `bump` | 4 | sfx | 0.5 | 5 | 8821 | `cd3b6287038a` | 3032 ms | erzeugt |
| `bump` | 3 | sfx | 0.5 | 5 | 8821 | `046527a0d9f3` | 3167 ms | erzeugt |
| `bump` | 5 | sfx | 0.5 | 5 | 8821 | `ef3a107b2561` | 2467 ms | erzeugt |
| `bump` | 6 | sfx | 0.5 | 5 | 8821 | `ffbb5013a681` | 2593 ms | erzeugt |
| `shoo` | 2 | sfx | 0.5 | 5 | 8821 | `5a6ecce6eb77` | 2650 ms | erzeugt |
| `shoo` | 1 | sfx | 0.5 | 5 | 8821 | `589298554ccc` | 4122 ms | erzeugt |
| `shoo` | 3 | sfx | 0.5 | 5 | 8821 | `aefafc8e51e2` | 2267 ms | erzeugt |
| `shoo` | 4 | sfx | 0.5 | 5 | 8821 | `4bb91fa57de1` | 2328 ms | erzeugt |
| `shoo` | 5 | sfx | 0.5 | 5 | 8821 | `b161b949ddee` | 3010 ms | erzeugt |
| `shoo` | 6 | sfx | 0.5 | 5 | 8821 | `36e2730d8c9a` | 2446 ms | erzeugt |
| `puff-chalk` | 1 | sfx | 0.5 | 5 | 8821 | `b672830db2dc` | 2438 ms | erzeugt |
| `puff-chalk` | 4 | sfx | 0.5 | 5 | 8821 | `e5834780081f` | 2307 ms | erzeugt |
| `puff-chalk` | 2 | sfx | 0.5 | 5 | 8821 | `9bbb5960c8d8` | 2718 ms | erzeugt |
| `puff-chalk` | 3 | sfx | 0.5 | 5 | 8821 | `49f78c34d986` | 2592 ms | erzeugt |
| `being-answered` | 1 | sfx | 1 | 10 | 17180 | `b824c89d924e` | 2376 ms | erzeugt |
| `puff-chalk` | 5 | sfx | 0.5 | 5 | 8821 | `7ead44f61198` | 2720 ms | erzeugt |
| `puff-chalk` | 6 | sfx | 0.5 | 5 | 8821 | `2a86ff71cb09` | 2770 ms | erzeugt |
| `being-answered` | 2 | sfx | 1 | 10 | 17180 | `475179e33d0d` | 1938 ms | erzeugt |
| `being-answered` | 3 | sfx | 1 | 10 | 17180 | `e9873d062ea2` | 2021 ms | erzeugt |
| `being-answered` | 4 | sfx | 1 | 10 | 17180 | `5e36f7e5d352` | 2046 ms | erzeugt |
| `being-answered` | 6 | sfx | 1 | 10 | 17180 | `ebefea28c61b` | 1873 ms | erzeugt |
| `merle-round` | 1 | sfx | 0.8 | 8 | 13836 | `27b404b48fb5` | 1845 ms | erzeugt |
| `being-answered` | 5 | sfx | 1 | 10 | 17180 | `de4c2a6fdfd4` | 2202 ms | erzeugt |
| `merle-round` | 2 | sfx | 0.8 | 8 | 13836 | `367f9e9fb3cc` | 1998 ms | erzeugt |
| `merle-round` | 3 | sfx | 0.8 | 8 | 13836 | `bf3e4082a90b` | 2021 ms | erzeugt |
| `merle-round` | 4 | sfx | 0.8 | 8 | 13836 | `3c561097cbd4` | 1939 ms | erzeugt |
| `merle-round` | 5 | sfx | 0.8 | 8 | 13836 | `4e9d5bf5c7c1` | 2051 ms | erzeugt |
| `merle-round` | 6 | sfx | 0.8 | 8 | 13836 | `fb31a36eb7b0` | 2055 ms | erzeugt |
| `merle-round` | 7 | sfx | 0.8 | 8 | 13836 | `2d1bab723dfc` | 2268 ms | erzeugt |
| `merle-round` | 8 | sfx | 0.8 | 8 | 13836 | `50a0062c470f` | 1998 ms | erzeugt |
| `card-close` | 1 | sfx | 0.5 | 5 | 8821 | `f93e0f1d68db` | 2108 ms | erzeugt |
| `card-close` | 2 | sfx | 0.5 | 5 | 8821 | `76069ecec690` | 2115 ms | erzeugt |
| `card-close` | 3 | sfx | 0.5 | 5 | 8821 | `b292529fca62` | 2114 ms | erzeugt |
| `card-close` | 4 | sfx | 0.5 | 5 | 8821 | `2005e67d910b` | 2097 ms | erzeugt |
| `card-close` | 5 | sfx | 0.5 | 5 | 8821 | `34d2e5fa51cb` | 2133 ms | erzeugt |
| `card-close` | 6 | sfx | 0.5 | 5 | 8821 | `bf76ea89dddf` | 2468 ms | erzeugt |
| `page-turn` | 1 | sfx | 0.6 | 6 | 10493 | `024ad474c47d` | 2417 ms | erzeugt |
| `page-turn` | 2 | sfx | 0.6 | 6 | 10493 | `3931bd3c71a2` | 2102 ms | erzeugt |
| `page-turn` | 3 | sfx | 0.6 | 6 | 10493 | `af71b61fce32` | 2457 ms | erzeugt |
| `page-turn` | 4 | sfx | 0.6 | 6 | 10493 | `7ec36ff35811` | 2352 ms | erzeugt |
| `page-turn` | 5 | sfx | 0.6 | 6 | 10493 | `ae4ad8b4e8a6` | 2277 ms | erzeugt |
| `page-turn` | 6 | sfx | 0.6 | 6 | 10493 | `908e904c7243` | 2297 ms | erzeugt |
| `toast` | 2 | sfx | 0.5 | 5 | 8821 | `497ff26cafd2` | 2317 ms | erzeugt |
| `toast` | 1 | sfx | 0.5 | 5 | 8821 | `cbd7902c34ce` | 2490 ms | erzeugt |
| `toast` | 3 | sfx | 0.5 | 5 | 8821 | `9db7dd2e4fb6` | 2186 ms | erzeugt |
| `toast` | 4 | sfx | 0.5 | 5 | 8821 | `ac946f7fe5c0` | 2146 ms | erzeugt |
| `toast` | 5 | sfx | 0.5 | 5 | 8821 | `52711e9c68c8` | 2215 ms | erzeugt |
| `solve-ok` | 1 | sfx | 0.6 | 6 | 10493 | `c9ea1b28521b` | 2846 ms | erzeugt |
| `solve-ok` | 2 | sfx | 0.6 | 6 | 10493 | `93ce192c417b` | 3522 ms | erzeugt |
| `toast` | 6 | sfx | 0.5 | 5 | 8821 | `f3dcead29bba` | 4189 ms | erzeugt |
| `solve-ok` | 3 | sfx | 0.6 | 6 | 10493 | `6f705fa23221` | 3321 ms | erzeugt |
| `solve-ok` | 5 | sfx | 0.6 | 6 | 10493 | `b684c094ac6a` | 3193 ms | erzeugt |
| `solve-ok` | 4 | sfx | 0.6 | 6 | 10493 | `94cde2049e9e` | 3870 ms | erzeugt |
| `solve-ok` | 6 | sfx | 0.6 | 6 | 10493 | `f9d3eb296f4d` | 3117 ms | erzeugt |
| `solve-ok` | 7 | sfx | 0.6 | 6 | 10493 | `26003a1a7a11` | 2452 ms | erzeugt |
| `solve-ok` | 8 | sfx | 0.6 | 6 | 10493 | `53e1ac3e5d97` | 2836 ms | erzeugt |
| `solve-thud` | 1 | sfx | 0.5 | 5 | 8821 | `005dd8ec4a85` | 2107 ms | erzeugt |
| `solve-thud` | 3 | sfx | 0.5 | 5 | 8821 | `80de9aad0264` | 1790 ms | erzeugt |
| `solve-thud` | 2 | sfx | 0.5 | 5 | 8821 | `5d76eb8b8e15` | 2488 ms | erzeugt |
| `solve-thud` | 4 | sfx | 0.5 | 5 | 8821 | `2cc7033a2e6d` | 2162 ms | erzeugt |
| `solve-thud` | 5 | sfx | 0.5 | 5 | 8821 | `be76d36abac7` | 2288 ms | erzeugt |
| `solve-thud` | 6 | sfx | 0.5 | 5 | 8821 | `e8b4b9b572d5` | 2274 ms | erzeugt |
| `solve-thud` | 7 | sfx | 0.5 | 5 | 8821 | `f129721c3570` | 2200 ms | erzeugt |
| `solve-thud` | 8 | sfx | 0.5 | 5 | 8821 | `c787217e7f19` | 2084 ms | erzeugt |
| `music-p2` | 1 | music | 45 | 0 | 720606 | `d14c19ed37ea` | 12240 ms | erzeugt |
| `music-p2` | 2 | music | 45 | 0 | 719770 | `32972771ec4a` | 11489 ms | erzeugt |
| `music-p2` | 3 | music | 45 | 0 | 720606 | `ba9dcf29b526` | 11925 ms | erzeugt |
| `music-p3` | 2 | music | 45 | 0 | 720606 | `247b20092f5b` | 12255 ms | erzeugt |
| `music-p3` | 3 | music | 45 | 0 | 720606 | `f5ca0f1173c2` | 12420 ms | erzeugt |
| `music-p3` | 1 | music | 45 | 0 | 720606 | `78b0882471f8` | 12927 ms | erzeugt |
| `music-p9` | 1 | music | 45 | 0 | 720606 | `e91ee2fd43ab` | 11867 ms | erzeugt |
| `music-p9` | 2 | music | 45 | 0 | 720606 | `2cc5de4cd63b` | 11781 ms | erzeugt |
| `music-p9` | 3 | music | 45 | 0 | 720606 | `6cda05f19ce3` | 10133 ms | erzeugt |
| `music-p4` | 2 | music | 45 | 0 | 720606 | `6ea409ec2c33` | 12211 ms | erzeugt |
| `music-p4` | 1 | music | 45 | 0 | 719770 | `09b6d467a0d7` | 14670 ms | erzeugt |
| `music-p4` | 3 | music | 45 | 0 | 720606 | `21f2edfe9182` | 11418 ms | erzeugt |
| `music-title` | 1 | music | 8 | 0 | 128358 | `83154b1f0a3c` | 7193 ms | erzeugt |
| `music-title` | 2 | music | 8 | 0 | 128358 | `18e9d75c087f` | 5872 ms | erzeugt |
| `music-title` | 3 | music | 8 | 0 | 128358 | `18fb8ae699fe` | 7350 ms | erzeugt |
| `music-win` | 2 | music | 3 | 0 | 48946 | `1eb54f0483a5` | 5926 ms | erzeugt |
| `music-win` | 1 | music | 3 | 0 | 48946 | `4793a9caebf0` | 6840 ms | erzeugt |
| `music-win` | 3 | music | 3 | 0 | 48946 | `dbd3ea3121f8` | 5867 ms | erzeugt |

## Lauf 2026-08-22 05:58 — nur cloth-take

Konto vorher: creator/active, 20273/300000 ·
nachher: 20273/300000 ·
**Kontodifferenz: 0** ·
**Summe `character-cost`: 0**

> Die beiden Zahlen messen NICHT dasselbe (gemessen 17.08.2026): fuer **Musik** meldet der
> Header `character-cost` **0**, waehrend das Konto sich bewegt (45 s ≙ 1198 Credits); fuer
> **Effekte** meldet der Header einen Wert (0,5 s ≙ 5), waehrend das Konto **stehen bleibt**.
> Massgeblich ist deshalb die **Kontodifferenz**; der Header ist ein Signal je Anfrage, keine
> Summe. Weichen beide auf eine dritte Weise ab, koennte jemand anderes dasselbe Konto benutzen —
> dann gehoeren beide Zahlen mit diesem Vermerk in den Report.
Takes: 0 erzeugt/vorhanden, 5 Fehler · Musik-Sekunden: 0

| Stem | Take | Art | Sek. | Credits | Bytes | sha1 | Dauer | Verdikt |
|---|---|---|---|---|---|---|---|---|
| `cloth-take` | 1 | sfx | 0.5 | 0 | 0 | `—` | 0 ms | FEHLER: cloth-take: HTTP 400 — {"detail":{"type":"validation_error","code":"text_too_long","message":"Invalid text length receiv |
| `cloth-take` | 2 | sfx | 0.5 | 0 | 0 | `—` | 0 ms | FEHLER: cloth-take: HTTP 400 — {"detail":{"type":"validation_error","code":"text_too_long","message":"Invalid text length receiv |
| `cloth-take` | 3 | sfx | 0.5 | 0 | 0 | `—` | 0 ms | FEHLER: cloth-take: HTTP 400 — {"detail":{"type":"validation_error","code":"text_too_long","message":"Invalid text length receiv |
| `cloth-take` | 4 | sfx | 0.5 | 0 | 0 | `—` | 0 ms | FEHLER: cloth-take: HTTP 400 — {"detail":{"type":"validation_error","code":"text_too_long","message":"Invalid text length receiv |
| `cloth-take` | 5 | sfx | 0.5 | 0 | 0 | `—` | 0 ms | FEHLER: cloth-take: HTTP 400 — {"detail":{"type":"validation_error","code":"text_too_long","message":"Invalid text length receiv |

## Lauf 2026-08-22 05:59 — nur cloth-take

Konto vorher: creator/active, 20273/300000 ·
nachher: 20273/300000 ·
**Kontodifferenz: 0** ·
**Summe `character-cost`: 25**

> Die beiden Zahlen messen NICHT dasselbe (gemessen 17.08.2026): fuer **Musik** meldet der
> Header `character-cost` **0**, waehrend das Konto sich bewegt (45 s ≙ 1198 Credits); fuer
> **Effekte** meldet der Header einen Wert (0,5 s ≙ 5), waehrend das Konto **stehen bleibt**.
> Massgeblich ist deshalb die **Kontodifferenz**; der Header ist ein Signal je Anfrage, keine
> Summe. Weichen beide auf eine dritte Weise ab, koennte jemand anderes dasselbe Konto benutzen —
> dann gehoeren beide Zahlen mit diesem Vermerk in den Report.
Takes: 5 erzeugt/vorhanden, 0 Fehler · Musik-Sekunden: 0

| Stem | Take | Art | Sek. | Credits | Bytes | sha1 | Dauer | Verdikt |
|---|---|---|---|---|---|---|---|---|
| `cloth-take` | 1 | sfx | 0.5 | 5 | 8821 | `b5a7f7bd1a44` | 1827 ms | erzeugt |
| `cloth-take` | 3 | sfx | 0.5 | 5 | 8821 | `b9ef9f84e65e` | 1923 ms | erzeugt |
| `cloth-take` | 2 | sfx | 0.5 | 5 | 8821 | `f4002f5b4779` | 2108 ms | erzeugt |
| `cloth-take` | 5 | sfx | 0.5 | 5 | 8821 | `ec476539650b` | 1803 ms | erzeugt |
| `cloth-take` | 4 | sfx | 0.5 | 5 | 8821 | `0e04bc31ab36` | 1970 ms | erzeugt |
