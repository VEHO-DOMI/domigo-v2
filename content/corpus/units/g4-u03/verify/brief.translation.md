# Verify lens — translation — g4-u03 (round 1)

<!-- domigo:verify translation g4-u03 items=369ba6e44c94 prompt=c6328b13b073 round=1 -->

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

## Vocab items (32)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u03.w.announcement | announcement | Durchsage | announcement (full) | Durchsage (full) ; Ankündigung (full) ; Ansage (partial) |
| g4u03.w.be-in-trouble | be in trouble | in Schwierigkeiten sein | be in trouble (full) ; to be in trouble (full) | in Schwierigkeiten sein (full) ; Ärger bekommen (partial) |
| g4u03.w.become-desperate | become desperate | verzweifeln | become desperate (full) ; to become desperate (full) | verzweifeln (full) ; verzweifelt werden (full) |
| g4u03.w.blow-up | blow up | explodieren | blow up (full) ; explode (full) | explodieren (full) ; in die Luft fliegen (partial) |
| g4u03.w.bravery | bravery | Mut | bravery (full) ; courage (partial) | Mut (full) ; Tapferkeit (full) |
| g4u03.w.busy | busy | belebt | busy (full) ; lively (partial) | belebt (full) ; hektisch (full) ; geschäftig (partial) |
| g4u03.w.campaign | campaign | Kampagne | campaign (full) | Kampagne (full) ; Aktion (full) |
| g4u03.w.charge | charge | verlangen | charge (full) | verlangen (full) ; berechnen (full) ; kosten (partial) |
| g4u03.w.collide | collide | zusammenstoßen | collide (full) ; crash (partial) | zusammenstoßen (full) ; kollidieren (full) |
| g4u03.w.critic | critic | Kritiker/in | critic (full) ; reviewer (partial) | Kritiker (full) ; Kritikerin (full) |
| g4u03.w.crowd-funding | crowd-funding | Gruppenfinanzierung | crowd-funding (full) ; crowdfunding (full) | Gruppenfinanzierung (full) ; Schwarmfinanzierung (partial) |
| g4u03.w.cuisine | cuisine | Küche | cuisine (full) ; cooking (partial) ; food (partial) | Küche (full) ; Kulinarik (full) ; Kochkunst (partial) |
| g4u03.w.elevator | elevator (AE) | Aufzug | elevator (full) ; lift (full) | Aufzug (full) ; Fahrstuhl (full) ; Lift (partial) |
| g4u03.w.emergency-landing | emergency landing | Notlandung | emergency landing (full) | Notlandung (full) |
| g4u03.w.evacuate | evacuate | evakuieren | evacuate (full) | evakuieren (full) ; in Sicherheit bringen (partial) ; räumen (partial) |
| g4u03.w.explode | explode | explodieren | explode (full) ; blow up (partial) | explodieren (full) ; in die Luft fliegen (partial) |
| g4u03.w.flock-of-birds | flock of birds | Vogelschwarm | flock of birds (full) | Vogelschwarm (full) ; Schwarm von Vögeln (partial) |
| g4u03.w.glide-down | glide down | hinuntergleiten | glide down (full) | hinuntergleiten (full) ; herabgleiten (partial) |
| g4u03.w.immigrant | immigrant | Einwanderer/Einwanderin | immigrant (full) ; immigrants (full) | Einwanderer (full) ; Einwanderin (full) ; Zuwanderer (partial) |
| g4u03.w.miracle | miracle | Wunder | miracle (full) ; wonder (partial) | Wunder (full) |
| g4u03.w.native | native | einheimisch | native (full) ; local (partial) | einheimisch (full) ; ursprünglich (full) |
| g4u03.w.nearby | nearby | in der Nähe | nearby (full) ; close by (full) ; near (partial) | in der Nähe (full) ; ganz nah (partial) |
| g4u03.w.on-duty | on duty | im Dienst | on duty (full) | im Dienst (full) ; im Einsatz (partial) |
| g4u03.w.origin | origin | Herkunft | origin (full) ; background (partial) | Herkunft (full) ; Ursprung (full) |
| g4u03.w.politics | politics | Politik | politics (full) | Politik (full) |
| g4u03.w.rescue-boat | rescue boat | Rettungsboot | rescue boat (full) | Rettungsboot (full) |
| g4u03.w.reward-sb | reward sb | jemanden prämieren | reward sb (full) ; to reward someone (full) ; reward (partial) | jemanden belohnen (full) ; jemanden prämieren (full) |
| g4u03.w.runway | runway | Landebahn | runway (full) | Landebahn (full) ; Startbahn (partial) ; Rollbahn (partial) |
| g4u03.w.statement | statement | Aussage | statement (full) | Aussage (full) ; Erklärung (partial) |
| g4u03.w.takeoff | takeoff | Abflug | takeoff (full) ; take-off (full) | Abflug (full) ; Start (full) |
| g4u03.w.treatment | treatment | Behandlung | treatment (full) | Behandlung (full) |
| g4u03.w.wing | wing | Flügel | wing (full) | Flügel (full) ; Tragfläche (partial) |

## Grammar items (5 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u03.gi.reported-speech-statements.tr.001 | translation | Er sagte, dass er müde war. [de] | He said that he was tired. (full) ; He said he was tired. (full) | deToEn |
| g4u03.gi.reported-speech-statements.tr.004 | translation | Er erzählte uns, dass er am Tag davor sein Buch verloren hatte. [de] | He told us that he had lost his book the day before. (full) ; He told us he had lost his book the day before. (full) | deToEn |
| g4u03.gi.reported-speech-statements.tr.005 | translation | Er sagte mir, dass er die Hausübung gemacht hatte. [de] | He told me that he had done his homework. (full) ; He told me he had done his homework. (full) | deToEn |
| g4u03.gi.reported-speech-statements.tr.006 | translation | Sue sagte, dass sie Kopfschmerzen hatte. [de] | Sue said that she had a headache. (full) ; Sue said she had a headache. (full) | deToEn |
| g4u03.gi.reported-speech-statements.tr.007 | translation | Mia erzählte mir, dass sie am Tag danach nach Wien fahren würde. [de] | Mia told me that she would go to Vienna the day after. (full) ; Mia told me she would go to Vienna the day after. (full) ; Mia told me that she would travel to Vienna the day after. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g4-u03/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u03",
  "lens": "translation",
  "itemsHash": "369ba6e44c94",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 37, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
