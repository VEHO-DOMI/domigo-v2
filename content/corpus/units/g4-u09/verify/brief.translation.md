# Verify lens — translation — g4-u09 (round 1)

<!-- domigo:verify translation g4-u09 items=aadd09d9825e prompt=c6328b13b073 round=1 -->

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

## Vocab items (43)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u09.w.border | border | Grenze | border (full) | Grenze (full) |
| g4u09.w.bride | bride | Braut | bride (full) | Braut (full) |
| g4u09.w.bridegroom | bridegroom | Bräutigam | bridegroom (full) ; groom (partial) | Bräutigam (full) |
| g4u09.w.bridesmaid | bridesmaid | Brautjungfer | bridesmaid (full) | Brautjungfer (full) |
| g4u09.w.bury | bury | begraben | bury (full) | begraben (full) |
| g4u09.w.ceremony | ceremony | Zeremonie | ceremony (full) | Zeremonie (full) |
| g4u09.w.communicate | communicate | kommunizieren | communicate (full) | kommunizieren (full) |
| g4u09.w.confused | confused | verwirrt | confused (full) | verwirrt (full) |
| g4u09.w.decent-looking | decent-looking | gut aussehend | decent-looking (full) | gut aussehend (full) |
| g4u09.w.devil | devil | Teufel | devil (full) | Teufel (full) |
| g4u09.w.embarrassed | embarrassed | verlegen | embarrassed (full) | verlegen (full) |
| g4u09.w.far-east | Far East | Ferner Osten | Far East (full) | Ferner Osten (full) |
| g4u09.w.fashionable | fashionable | in Mode | fashionable (full) | in Mode (full) ; modisch (full) |
| g4u09.w.firstly | firstly | erstens | firstly (full) | erstens (full) |
| g4u09.w.funeral | funeral | Begräbnis | funeral (full) | Begräbnis (full) |
| g4u09.w.gesture | gesture | Geste | gesture (full) | Geste (full) |
| g4u09.w.giggle | giggle | kichern | giggle (full) | kichern (full) |
| g4u09.w.goth | goth | Grufti | goth (full) | Grufti (full) |
| g4u09.w.greet | greet | begrüßen | greet (full) | begrüßen (full) |
| g4u09.w.hastily | hastily | hastig | hastily (full) | hastig (full) |
| g4u09.w.health-risk | health risk | Gesundheitsrisiko | health risk (full) | Gesundheitsrisiko (full) |
| g4u09.w.ignore | ignore | ignorieren | ignore (full) | ignorieren (full) |
| g4u09.w.in-common | in common | gemeinsam | in common (full) | gemeinsam (full) ; gemein (full) |
| g4u09.w.index-finger | index finger | Zeigefinger | index finger (full) | Zeigefinger (full) |
| g4u09.w.insult | insult | beleidigen | insult (full) | beleidigen (full) |
| g4u09.w.needle | needle | Nadel | needle (full) | Nadel (full) |
| g4u09.w.nod-the-head | nod the head | mit dem Kopf nicken | nod the head (full) ; nod your head (full) | mit dem Kopf nicken (full) ; nicken (full) |
| g4u09.w.palm | palm | Handfläche | palm (full) | Handfläche (full) |
| g4u09.w.pass-something-on | pass something on | etwas weitergeben | pass something on (full) | etwas weitergeben (full) ; weitergeben (full) |
| g4u09.w.permanent | permanent | dauerhaft | permanent (full) | dauerhaft (full) ; endgültig (full) |
| g4u09.w.pierced | pierced | durchstochen | pierced (full) | durchstochen (full) ; gepierct (full) |
| g4u09.w.possibility | possibility | Möglichkeit | possibility (full) | Möglichkeit (full) |
| g4u09.w.rebellious | rebellious | rebellisch | rebellious (full) | rebellisch (full) |
| g4u09.w.religious | religious | religiös | religious (full) | religiös (full) |
| g4u09.w.scare-off | scare off | verschrecken | scare off (full) | verschrecken (full) ; verscheuchen (full) |
| g4u09.w.sigh | sigh | seufzen | sigh (full) | seufzen (full) |
| g4u09.w.sitting-room | sitting room | Wohnzimmer | sitting room (full) ; living room (partial) | Wohnzimmer (full) |
| g4u09.w.sleeve | sleeve | Ärmel | sleeve (full) | Ärmel (full) |
| g4u09.w.thumb | thumb | Daumen | thumb (full) | Daumen (full) |
| g4u09.w.victory | victory | Sieg | victory (full) | Sieg (full) |
| g4u09.w.wedding-dress | wedding dress | Brautkleid | wedding dress (full) | Brautkleid (full) |
| g4u09.w.wedding-suit | wedding suit | Hochzeitsanzug | wedding suit (full) | Hochzeitsanzug (full) |
| g4u09.w.zero | zero | null | zero (full) | null (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u09.gi.modals-possibility.tr.001 | translation | Es könnte heute regnen. [de] | It might rain today. (full) ; It may rain today. (full) ; It could rain today. (full) | deToEn |
| g4u09.gi.modals-possibility.tr.003 | translation | Er kommt vielleicht morgen. [de] | He might come tomorrow. (full) ; He may come tomorrow. (full) ; He could come tomorrow. (full) | deToEn |
| g4u09.gi.modals-possibility.tr.005 | translation | Mia ist vielleicht zu Hause. [de] | Mia might be at home. (full) ; Mia may be at home. (full) ; Mia could be at home. (full) | deToEn |
| g4u09.gi.modals-possibility.tr.007 | translation | Die Gäste kommen vielleicht nicht. [de] | They might not come. (full) ; They may not come. (full) ; The guests might not come. (full) ; The guests may not come. (full) | deToEn |

## Output contract

Write `content/corpus/units/g4-u09/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u09",
  "lens": "translation",
  "itemsHash": "aadd09d9825e",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 47, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
