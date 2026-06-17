# Verify lens — translation — g3-u04 (round 1)

<!-- domigo:verify translation g3-u04 items=c6b91f93f1fd prompt=c6328b13b073 round=1 -->

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

## Vocab items (46)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u04.w.adorable | adorable | bezaubernd | adorable (full) | bezaubernd (full) ; liebenswert (full) |
| g3u04.w.aggressive | aggressive | aggressiv | aggressive (full) | aggressiv (full) |
| g3u04.w.audience | audience | Publikum | audience (full) | Publikum (full) |
| g3u04.w.bite | bite | Biss | bite (full) | Biss (full) |
| g3u04.w.cub | cub | (Bären-)Junges | cub (full) | Junges (full) ; Bärenjunges (full) |
| g3u04.w.cuddly | cuddly | kuschelig | cuddly (full) | kuschelig (full) |
| g3u04.w.cute | cute | niedlich | cute (full) | niedlich (full) ; süß (full) |
| g3u04.w.dangerous | dangerous | gefährlich | dangerous (full) | gefährlich (full) |
| g3u04.w.deadly | deadly | tödlich | deadly (full) | tödlich (full) |
| g3u04.w.death | death | Tod | death (full) | Tod (full) |
| g3u04.w.elegant | elegant | elegant | elegant (full) | elegant (full) |
| g3u04.w.environment | environment | Umwelt | environment (full) | Umwelt (full) |
| g3u04.w.furry | furry | pelzig | furry (full) | pelzig (full) ; flauschig (full) |
| g3u04.w.good-luck | Good luck! | Viel Glück! | Good luck (full) | Viel Glück (full) |
| g3u04.w.hands-off | Hands off! | Finger weg! | Hands off (full) | Finger weg (full) |
| g3u04.w.immediately | immediately | sofort | immediately (full) | sofort (full) |
| g3u04.w.injury | injury | Verletzung | injury (full) | Verletzung (full) |
| g3u04.w.lizard | lizard | Eidechse | lizard (full) | Eidechse (full) |
| g3u04.w.on-average | on average | durchschnittlich | on average (full) | durchschnittlich (full) ; im Durchschnitt (full) |
| g3u04.w.poison | poison | Gift | poison (full) | Gift (full) |
| g3u04.w.poisonous | poisonous | giftig | poisonous (full) | giftig (full) |
| g3u04.w.polar-bear | polar bear | Eisbär | polar bear (full) | Eisbär (full) |
| g3u04.w.politician | politician | Politiker/Politikerin | politician (full) | Politiker (full) ; Politikerin (full) |
| g3u04.w.rabies | rabies | Tollwut | rabies (full) | Tollwut (full) |
| g3u04.w.scuba-diver | scuba diver | Sporttaucher/Sporttaucherin | scuba diver (full) | Sporttaucher (full) ; Taucher (full) |
| g3u04.w.seal | seal | Robbe | seal (full) | Robbe (full) |
| g3u04.w.shape | shape | Form | shape (full) | Form (full) |
| g3u04.w.stunning | stunning | atemberaubend | stunning (full) ; amazing (partial) | atemberaubend (full) ; umwerfend (full) |
| g3u04.w.swan | swan | Schwan | swan (full) | Schwan (full) |
| g3u04.w.to-accept | to accept | akzeptieren | accept (full) ; to accept (full) | akzeptieren (full) ; annehmen (full) |
| g3u04.w.to-advise-against-sth | to advise (sb.) against sth. | (jdn.) von etw. abraten | advise against (full) ; to advise against (full) | abraten (full) ; von etwas abraten (full) ; warnen (partial) |
| g3u04.w.to-bite | to bite (off) | (ab-)beißen | bite (full) ; to bite (full) ; bite off (full) | beißen (full) ; abbeißen (full) |
| g3u04.w.to-bleed | to bleed | bluten | bleed (full) ; to bleed (full) | bluten (full) |
| g3u04.w.to-cause | to cause | verursachen | cause (full) ; to cause (full) | verursachen (full) |
| g3u04.w.to-chase-away | to chase away | verjagen | chase away (full) ; to chase away (full) | verjagen (full) ; vertreiben (full) |
| g3u04.w.to-communicate | to communicate | kommunizieren | communicate (full) ; to communicate (full) | kommunizieren (full) ; sich verständigen (full) |
| g3u04.w.to-complain | to complain | sich beschweren | complain (full) ; to complain (full) | sich beschweren (full) |
| g3u04.w.to-defend | to defend | verteidigen | defend (full) ; to defend (full) | verteidigen (full) |
| g3u04.w.to-inform | to inform | informieren | inform (full) ; to inform (full) | informieren (full) |
| g3u04.w.to-lift | to lift | aufheben | lift (full) ; to lift (full) | aufheben (full) ; hochheben (full) |
| g3u04.w.to-lock-sb-up | to lock sb. up | jdn. einsperren | lock up (full) ; to lock up (full) | einsperren (full) ; wegsperren (full) |
| g3u04.w.to-mistake-sth-for-sth | to mistake sth. for sth. | etw. mit etw. verwechseln | mistake for (full) ; to mistake for (full) | verwechseln (full) ; mit etwas verwechseln (full) |
| g3u04.w.to-pull-down | to pull down | hinunterziehen | pull down (full) ; to pull down (full) | hinunterziehen (full) ; herunterziehen (full) |
| g3u04.w.to-suppose | to suppose | vermuten | suppose (full) ; to suppose (full) | vermuten (full) ; annehmen (full) |
| g3u04.w.to-take-care | to take care | aufpassen | take care (full) ; to take care (full) | aufpassen (full) ; sich hüten (partial) |
| g3u04.w.victim | victim | Opfer | victim (full) | Opfer (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u04.gi.comparative-intensifiers.tr.001 | translation | Mein Bruder ist viel größer als ich. [de] | My brother is much taller than me. (full) ; My brother is a lot taller than me. (full) ; My brother is far taller than me. (full) ; My brother is much taller than I am. (full) | deToEn |
| g3u04.gi.comparative-intensifiers.tr.002 | translation | Wir haben weniger Hausaufgaben als letzte Woche. [de] | We have less homework than last week. (full) ; We've got less homework than last week. (full) | deToEn |
| g3u04.gi.comparative-intensifiers.tr.003 | translation | In unserer Klasse sind weniger Schüler als in eurer. [de] | There are fewer students in our class than in yours. (full) ; We have fewer students in our class than you. (full) | deToEn |
| g3u04.gi.comparative-intensifiers.tr.004 | translation | Das neue Videospiel ist nur ein bisschen teurer als das alte, aber es ist viel besser. [de] | The new video game is only a bit more expensive than the old one, but it is much better. (full) ; The new video game is only a little more expensive than the old one, but it is much better. (full) ; The new video game is only slightly more expensive than the old one, but it's much better. (full) | deToEn |

## Output contract

Write `content/corpus/units/g3-u04/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u04",
  "lens": "translation",
  "itemsHash": "c6b91f93f1fd",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 50, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
