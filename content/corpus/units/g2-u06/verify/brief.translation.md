# Verify lens — translation — g2-u06 (round 2)

<!-- domigo:verify translation g2-u06 items=294d10cc9c5d prompt=c6328b13b073 round=2 -->

<!-- domigo:prompt verify-translation v=1 -->
# Lens 3 — translation, both directions (adversarial)

You are an independent, adversarial verifier and a bilingual DE/EN speaker (Austrian
German). You did NOT write these items. For every translation surface (vocab items'
`translation.deToEn` AND `translation.enToDe`; grammar items with format
`translation`):

1. **Meaning:** does each full-tier answer actually translate the prompt — register,
   number, tense, particles included? ("(sich) fürchten (vor)" ↔ "to fear", not
   "to frighten".)
2. **Direction:** is the language of prompt and answers consistent with the declared
   direction? (kind `translation-direction`)
3. **Completeness in BOTH directions:** German has synonyms too — would a student's
   natural "Ich habe Angst vor…" be accepted where defensible (partial), or wrongly
   marked wrong? English side likewise.
4. **Naturalness:** stilted or word-by-word renderings that no Austrian teenager would
   say = `translation-unnatural` (usually warn; fix when actively misteaching).
5. **du-form:** German prompts/answers address the student informally.

Flag kind menu: `translation-meaning`, `translation-direction`,
`translation-unnatural`. Severity `fix` when a correct student answer would be
rejected or a wrong meaning taught; `warn` otherwise. Cite the exact text in every
note.

## Vocab items (51)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u06.w.absolutely | absolutely | völlig | absolutely (full) | völlig (full) ; absolut (full) ; total (partial) |
| g2u06.w.actually | actually | eigentlich | actually (full) | eigentlich (full) ; tatsächlich (full) ; in Wirklichkeit (partial) |
| g2u06.w.adventure-camp | adventure camp | Abenteuercamp | adventure camp (full) | Abenteuercamp (full) ; das Abenteuercamp (full) |
| g2u06.w.alive | alive | lebendig | alive (full) | lebendig (full) ; am Leben (full) |
| g2u06.w.although | although | obwohl | although (full) | obwohl (full) |
| g2u06.w.anorak | anorak | Anorak | anorak (full) | Anorak (full) ; der Anorak (full) |
| g2u06.w.beach | beach | Strand | beach (full) | Strand (full) ; der Strand (full) |
| g2u06.w.bottom | bottom | unten | bottom (full) | unten (full) ; der untere Teil (partial) ; unterer (partial) |
| g2u06.w.camp | camp | Lager | camp (full) | Lager (full) ; Camp (full) ; das Camp (full) |
| g2u06.w.campfire | campfire | Lagerfeuer | campfire (full) | Lagerfeuer (full) ; das Lagerfeuer (full) |
| g2u06.w.canoe | canoe | Kanu | canoe (full) | Kanu (full) ; das Kanu (full) |
| g2u06.w.canoeing | canoeing | Kanufahren | canoeing (full) | Kanufahren (full) ; das Kanufahren (full) |
| g2u06.w.cry | cry | Schrei | cry (full) ; shout (partial) | Schrei (full) ; der Schrei (full) ; Hilferuf (partial) |
| g2u06.w.drive | drive | Fahrt | drive (full) ; car ride (partial) | Fahrt (full) ; die Fahrt (full) ; Autofahrt (partial) |
| g2u06.w.field | field | Feld | field (full) ; fields (full) | Feld (full) ; das Feld (full) ; Felder (full) |
| g2u06.w.forest | forest | Wald | forest (full) ; woods (partial) | Wald (full) ; der Wald (full) |
| g2u06.w.gate | gate | Tor | gate (full) | Tor (full) ; das Tor (full) ; Gatter (partial) |
| g2u06.w.guide | guide | Führer/in | guide (full) | Führer (full) ; Führerin (full) ; Guide (full) |
| g2u06.w.hard-hat | hard hat | Schutzhelm | hard hat (full) | Schutzhelm (full) ; der Schutzhelm (full) ; Helm (partial) |
| g2u06.w.hill | hill | Hügel | hill (full) ; hills (full) | Hügel (full) ; der Hügel (full) |
| g2u06.w.i-m-off-now | I'm off now. | Ich bin jetzt weg. | I'm off now. (full) ; I'm off now (full) | Ich bin jetzt weg. (full) ; Ich gehe jetzt. (full) |
| g2u06.w.lake | lake | See | lake (full) | See (full) ; der See (full) |
| g2u06.w.left-hand | left-hand | linker/linke/linkes | left-hand (full) ; left (partial) | linke (full) ; linker (full) ; linkes (full) |
| g2u06.w.life-jacket | life jacket | Schwimmweste | life jacket (full) | Schwimmweste (full) ; die Schwimmweste (full) |
| g2u06.w.middle | middle | Mitte | middle (full) | Mitte (full) ; die Mitte (full) |
| g2u06.w.moon | moon | Mond | moon (full) | Mond (full) ; der Mond (full) |
| g2u06.w.motorway | motorway | Autobahn | motorway (full) | Autobahn (full) ; die Autobahn (full) |
| g2u06.w.mountains | mountains | Berge | mountains (full) ; mountain (partial) | Berge (full) ; die Berge (full) ; Berg (partial) |
| g2u06.w.once-upon-a-time | once upon a time | es war einmal | once upon a time (full) | es war einmal (full) |
| g2u06.w.picnic | picnic | Picknick | picnic (full) | Picknick (full) ; das Picknick (full) |
| g2u06.w.poor-you | Poor you! | Du Armer!/Arme! | Poor you! (full) ; Poor you (full) | Du Armer! (full) ; Du Arme! (full) ; Du Armer/Arme! (full) |
| g2u06.w.right-hand | right-hand | rechter/rechte/rechtes | right-hand (full) ; right (partial) | rechte (full) ; rechter (full) ; rechtes (full) |
| g2u06.w.river | river | Fluss | river (full) | Fluss (full) ; der Fluss (full) |
| g2u06.w.road | road | Straße | road (full) ; street (partial) | Straße (full) ; die Straße (full) |
| g2u06.w.rock-climbing | rock climbing | Klettern | rock climbing (full) | Klettern (full) ; das Klettern (full) ; Felsklettern (partial) |
| g2u06.w.sea | sea | Meer | sea (full) | Meer (full) ; das Meer (full) ; See (partial) |
| g2u06.w.sheep | sheep (pl sheep) | Schaf | sheep (full) | Schaf (full) ; das Schaf (full) ; Schafe (full) |
| g2u06.w.shepherd | shepherd | Schäfer/Schäferin | shepherd (full) | Schäfer (full) ; Schäferin (full) ; Hirte (partial) |
| g2u06.w.stars | stars | Sterne | stars (full) ; star (partial) | Sterne (full) ; die Sterne (full) ; Stern (partial) |
| g2u06.w.sun | sun | Sonne | sun (full) | Sonne (full) ; die Sonne (full) |
| g2u06.w.to-be-afraid | to be afraid (of) | Angst haben (vor) | be afraid (full) ; to be afraid of (full) ; afraid (partial) | Angst haben (full) ; Angst haben vor (full) ; sich fürchten (partial) |
| g2u06.w.to-be-good-at-sth | to be good at sth. | etw. gut können | be good at (full) ; to be good at sth (full) ; good at (partial) | etwas gut können (full) ; gut in etwas sein (full) ; gut können (partial) |
| g2u06.w.to-build-a-tree-house | to build a tree house | ein Baumhaus bauen | build a tree house (full) ; to build a tree house (full) | ein Baumhaus bauen (full) ; ein Baumhaus bauen gehen (partial) |
| g2u06.w.to-care | to care | sich kümmern | care (full) ; to care (full) ; care about (partial) | sich kümmern (full) ; kümmern (full) ; sich sorgen (partial) |
| g2u06.w.to-trust | to trust | vertrauen | trust (full) ; to trust (full) | vertrauen (full) ; jemandem vertrauen (full) |
| g2u06.w.to-wash-up | to wash up | abspülen | wash up (full) ; to wash up (full) | abspülen (full) ; abwaschen (full) ; Geschirr spülen (partial) |
| g2u06.w.town | town | Stadt | town (full) | Stadt (full) ; die Stadt (full) |
| g2u06.w.valley | valley | Tal | valley (full) | Tal (full) ; das Tal (full) |
| g2u06.w.village | village | Dorf | village (full) | Dorf (full) ; das Dorf (full) |
| g2u06.w.waterfall | waterfall | Wasserfall | waterfall (full) | Wasserfall (full) ; der Wasserfall (full) |
| g2u06.w.while | while | Weile | while (full) | Weile (full) ; eine Weile (full) ; kurze Zeit (partial) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u06.gi.have-to.tr.001 | translation | Du musst eine Schwimmweste im Kanu tragen. [de] | You have to wear a life jacket in the canoe. (full) ; You have to wear a life jacket in the canoe (full) | deToEn |
| g2u06.gi.have-to.tr.002 | translation | Du musst nicht abwaschen. Die Anleiter machen das. [de] | You don't have to wash up. The guides do it. (full) ; You don't have to wash up. The guides do it (full) ; You do not have to wash up. The guides do it. (full) ; You don't have to wash up. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g2-u06/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u06",
  "lens": "translation",
  "itemsHash": "294d10cc9c5d",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 53, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
