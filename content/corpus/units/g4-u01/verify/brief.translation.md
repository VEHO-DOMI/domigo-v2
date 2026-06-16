# Verify lens — translation — g4-u01 (round 2)

<!-- domigo:verify translation g4-u01 items=f7dea74c414b prompt=c6328b13b073 round=2 -->

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

## Vocab items (36)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u01.w.admire | admire | bewundern | admire (full) ; to admire (full) | bewundern (full) |
| g4u01.w.be-aware-of-sth | be aware of sth | sich etw. bewusst sein | be aware of sth (full) ; be aware of something (full) ; to know about something (partial) | sich etw. bewusst sein (full) ; sich einer Sache bewusst sein (full) ; über etw. Bescheid wissen (partial) |
| g4u01.w.be-terrified | be terrified | fürchterliche Angst haben | be terrified (full) ; terrified (full) | fürchterliche Angst haben (full) ; schreckliche Angst haben (full) |
| g4u01.w.catholic | Catholic | katholisch | Catholic (full) ; a Catholic (full) | katholisch (full) ; Katholik (full) ; Katholikin (full) ; Katholik/in (full) |
| g4u01.w.cattle | cattle | Rinder | cattle (full) | Rinder (full) ; Vieh (full) |
| g4u01.w.cheer | cheer | jubeln | cheer (full) ; to cheer (full) | jubeln (full) ; anfeuern (partial) |
| g4u01.w.crop | crop | Ernte | crop (full) | Ernte (full) |
| g4u01.w.famine | famine | Hungersnot | famine (full) | Hungersnot (full) |
| g4u01.w.fluent | fluent | fließend | fluent (full) | fließend (full) |
| g4u01.w.foreigner | foreigner | Ausländer/-in | foreigner (full) | Ausländer (full) ; Ausländerin (full) ; Ausländer/-in (full) |
| g4u01.w.found | found | gründen | found (full) ; to found (full) ; set up (partial) | gründen (full) |
| g4u01.w.free-state | free state | Freistaat | free state (full) | Freistaat (full) |
| g4u01.w.fungus | fungus | Pilz | fungus (full) | Pilz (full) |
| g4u01.w.government | government | Regierung | government (full) | Regierung (full) |
| g4u01.w.grain | grain | Getreide | grain (full) | Getreide (full) |
| g4u01.w.guess | Guess! | Rate! | Guess! (full) ; Guess (full) | Rate! (full) ; Rate mal! (full) |
| g4u01.w.hiking | hiking | Wandern | hiking (full) | Wandern (full) |
| g4u01.w.i-d-rather | I'd rather | Ich möchte eher | I'd rather (full) ; I would rather (full) | Ich möchte eher (full) ; Ich würde lieber (full) |
| g4u01.w.improve | improve | verbessern | improve (full) ; to improve (full) ; get better (partial) | verbessern (full) ; besser machen (partial) |
| g4u01.w.incident | incident | Zwischenfall | incident (full) | Zwischenfall (full) ; Vorfall (partial) |
| g4u01.w.independent | independent | unabhängig | independent (full) | unabhängig (full) ; selbstständig (partial) |
| g4u01.w.intention | intention | Absicht | intention (full) | Absicht (full) ; Vorhaben (full) |
| g4u01.w.interfere | interfere | sich einmischen | interfere (full) ; to interfere (full) ; get involved (partial) | sich einmischen (full) ; in Konflikt geraten (full) ; sich einschalten (partial) |
| g4u01.w.landlord | landlord | Grundbesitzer | landlord (full) | Grundbesitzer (full) ; Vermieter (full) |
| g4u01.w.leading | leading | führend | leading (full) | führend (full) |
| g4u01.w.majority | majority | Mehrheit | majority (full) | Mehrheit (full) |
| g4u01.w.member | member | Mitglied | member (full) | Mitglied (full) |
| g4u01.w.nonsense | nonsense | Unsinn | nonsense (full) | Unsinn (full) ; Quatsch (full) |
| g4u01.w.primary-school | primary school | Volksschule | primary school (full) | Volksschule (full) ; Grundschule (partial) |
| g4u01.w.proper | proper | richtig | proper (full) | richtig (full) ; angemessen (full) ; ordentlich (partial) |
| g4u01.w.put-down | put down | niederschlagen | put down (full) | niederschlagen (full) |
| g4u01.w.shake-hands | shake hands | Hände schütteln | shake hands (full) | Hände schütteln (full) ; die Hand geben (partial) |
| g4u01.w.starve | starve | verhungern | starve (full) ; to starve (full) | verhungern (full) |
| g4u01.w.tax | tax | Steuer | tax (full) ; taxes (full) | Steuer (full) ; Steuern (full) |
| g4u01.w.thunder | thunder | Donner | thunder (full) | Donner (full) |
| g4u01.w.unconscious | unconscious | bewusstlos | unconscious (full) | bewusstlos (full) ; unbewusst (full) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u01.gi.past-continuous-revision.tr.002 | translation | Die Sonne schien und die Kinder spielten im Garten, als ein Hund hereinkam. [de] | The sun was shining and the children were playing in the garden when a dog came in. (full) ; The sun was shining and the children were playing in the garden when a dog came. (full) | deToEn |
| g4u01.gi.past-continuous-revision.tr.003 | translation | Während ich lernte, rief mein Freund an. [de] | While I was studying, my friend called. (full) ; My friend called while I was studying. (full) ; While I was studying, my friend called me. (full) ; While I was learning, my friend called. (full) ; My friend called while I was learning. (full) | deToEn |

## Output contract

Write `content/corpus/units/g4-u01/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u01",
  "lens": "translation",
  "itemsHash": "f7dea74c414b",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 38, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
