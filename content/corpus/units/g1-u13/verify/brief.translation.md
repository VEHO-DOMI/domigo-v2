# Verify lens — translation — g1-u13 (round 1)

<!-- domigo:verify translation g1-u13 items=8c52fe76eab1 prompt=c6328b13b073 round=1 -->

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

## Vocab items (58)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u13.w.accident | accident | Unfall | accident (full) | Unfall (full) |
| g1u13.w.adventure | adventure | Abenteuer | adventure (full) | Abenteuer (full) ; Erlebnis (full) |
| g1u13.w.alone | alone | allein | alone (full) | allein (full) ; alleine (full) |
| g1u13.w.ambulance | ambulance | Rettungswagen | ambulance (full) | Rettungswagen (full) ; Krankenwagen (full) |
| g1u13.w.backpack | backpack | Rucksack | backpack (full) | Rucksack (full) |
| g1u13.w.button | button | Knopf | button (full) | Knopf (full) ; Schalter (full) ; Taste (partial) |
| g1u13.w.character | character | Figur | character (full) | Figur (full) ; Person (full) ; Charakter (partial) |
| g1u13.w.class-speaker | class speaker | Klassensprecher/Klassensprecherin | class speaker (full) | Klassensprecher (full) ; Klassensprecherin (full) |
| g1u13.w.cloud | cloud | Wolke | cloud (full) | Wolke (full) |
| g1u13.w.coastguard | coastguard | Küstenwache | coastguard (full) | Küstenwache (full) |
| g1u13.w.country | country | Land | country (full) | Land (full) ; Staat (full) |
| g1u13.w.crime | crime | Verbrechen | crime (full) | Verbrechen (full) |
| g1u13.w.dark | dark | dunkel | dark (full) | dunkel (full) ; finster (partial) |
| g1u13.w.democracy | democracy | Demokratie | democracy (full) | Demokratie (full) |
| g1u13.w.earth | Earth | Erde | Earth (full) | Erde (full) |
| g1u13.w.fire | fire | Feuer | fire (full) | Feuer (full) |
| g1u13.w.fire-brigade | fire brigade | Feuerwehr | fire brigade (full) | Feuerwehr (full) |
| g1u13.w.forest | forest | Wald | forest (full) | Wald (full) |
| g1u13.w.guess-what | Guess what? | Du wirst es nicht glauben. | Guess what? (full) | Du wirst es nicht glauben. (full) ; Rate mal! (partial) |
| g1u13.w.helicopter | helicopter | Hubschrauber | helicopter (full) | Hubschrauber (full) ; Heli (partial) |
| g1u13.w.introduction | introduction | Einleitung | introduction (full) | Einleitung (full) |
| g1u13.w.jetpack | jetpack | Jetpack | jetpack (full) | Jetpack (full) ; Raketenrucksack (full) |
| g1u13.w.mayor | mayor | Bürgermeister/Bürgermeisterin | mayor (full) | Bürgermeister (full) ; Bürgermeisterin (full) |
| g1u13.w.medicine | medicine | Medikament | medicine (full) | Medikament (full) ; Medizin (full) ; Arznei (partial) |
| g1u13.w.mountain-rescue | mountain rescue | Bergrettung | mountain rescue (full) | Bergrettung (full) |
| g1u13.w.police | police | Polizei | police (full) | Polizei (full) |
| g1u13.w.political | political | politisch | political (full) | politisch (full) |
| g1u13.w.rescue-team | rescue team | Rettungsteam | rescue team (full) | Rettungsteam (full) ; Rettungsmannschaft (partial) |
| g1u13.w.rock | rock | Stein | rock (full) | Stein (full) ; Fels (partial) ; Felsen (partial) |
| g1u13.w.screen | screen | Bildschirm | screen (full) | Bildschirm (full) |
| g1u13.w.sky | sky | Himmel | sky (full) | Himmel (full) |
| g1u13.w.space | space | Weltall | space (full) | Weltall (full) ; Weltraum (full) ; All (partial) |
| g1u13.w.storm | storm | Sturm | storm (full) | Sturm (full) ; Unwetter (partial) |
| g1u13.w.storm-2 | storm | Sturm | storm (full) | Sturm (full) ; Unwetter (partial) |
| g1u13.w.sunny | sunny | sonnig | sunny (full) | sonnig (full) |
| g1u13.w.tell-me-more | Tell me more. | Erzähl mir mehr. | Tell me more. (full) | Erzähl mir mehr. (full) |
| g1u13.w.to-arrive | to arrive | (an-)kommen | arrive (full) ; to arrive (full) | ankommen (full) ; kommen (partial) |
| g1u13.w.to-be-in-danger | to be in danger | in Gefahr sein | to be in danger (full) ; be in danger (full) | in Gefahr sein (full) |
| g1u13.w.to-be-lucky | to be lucky | Glück haben | to be lucky (full) ; be lucky (full) | Glück haben (full) |
| g1u13.w.to-be-safe | to be safe | in Sicherheit sein | to be safe (full) ; be safe (full) | in Sicherheit sein (full) |
| g1u13.w.to-break | to break | brechen | break (full) ; to break (full) | brechen (full) ; kaputt machen (partial) |
| g1u13.w.to-chase | to chase | verfolgen | chase (full) ; to chase (full) | verfolgen (full) ; jagen (full) ; nachlaufen (partial) |
| g1u13.w.to-die | to die | sterben | die (full) ; to die (full) | sterben (full) |
| g1u13.w.to-dream | to dream | träumen | dream (full) ; to dream (full) | träumen (full) |
| g1u13.w.to-fall-down | to fall down | (hinunter-)fallen | fall down (full) ; to fall down (full) | hinunterfallen (full) ; hinfallen (full) ; umfallen (partial) |
| g1u13.w.to-fly-up-the-mountain | to fly up the mountain | den Berg hinauffliegen | fly up the mountain (full) ; to fly up the mountain (full) | den Berg hinauffliegen (full) |
| g1u13.w.to-happen | to happen | passieren | happen (full) ; to happen (full) | passieren (full) ; geschehen (partial) |
| g1u13.w.to-land | to land | landen | land (full) ; to land (full) | landen (full) |
| g1u13.w.to-notice | to notice | bemerken | notice (full) ; to notice (full) | bemerken (full) ; wahrnehmen (partial) |
| g1u13.w.to-press | to press | drücken | press (full) ; to press (full) | drücken (full) |
| g1u13.w.to-radio | to radio | (an-)funken | radio (full) ; to radio (full) | anfunken (full) ; funken (full) ; über Funk rufen (partial) |
| g1u13.w.to-shout-for-help | to shout for help | um Hilfe rufen | shout for help (full) ; to shout for help (full) | um Hilfe rufen (full) ; um Hilfe schreien (partial) |
| g1u13.w.to-shout-for-help-2 | to shout for help | um Hilfe rufen | shout for help (full) ; to shout for help (full) | um Hilfe rufen (full) ; um Hilfe schreien (partial) |
| g1u13.w.to-slip | to slip | ausrutschen | slip (full) ; to slip (full) | ausrutschen (full) |
| g1u13.w.to-vote | to vote | wählen | vote (full) ; to vote (full) | wählen (full) ; abstimmen (partial) |
| g1u13.w.wet | wet | nass | wet (full) | nass (full) |
| g1u13.w.windy | windy | windig | windy (full) | windig (full) |
| g1u13.w.young | young | jung | young (full) | jung (full) |

## Grammar items (5 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u13.gi.linking-words.tr.001 | translation | Er war müde, aber er spielte weiter. [de] | He was tired but he played on. (full) ; He was tired but he played football. (partial) | deToEn |
| g1u13.gi.linking-words.tr.002 | translation | Ich bin traurig, weil mein Hund krank ist. [de] | I am sad because my dog is ill. (full) ; I'm sad because my dog is ill. (full) | deToEn |
| g1u13.gi.linking-words.tr.003 | translation | Ich mag den Sommer, weil es sonnig ist. [de] | I like summer because it is sunny. (full) ; I like summer because it's sunny. (full) | deToEn |
| g1u13.gi.past-simple-regular.tr.001 | translation | Gestern hat sie ihre Oma besucht. [de] | Yesterday she visited her grandma. (full) ; She visited her grandma yesterday. (full) | deToEn |
| g1u13.gi.past-simple-regular.tr.002 | translation | Der Rettungsmann landete neben mir und half mir. [de] | The rescue man landed next to me and helped me. (full) ; The man landed next to me and helped me. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g1-u13/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u13",
  "lens": "translation",
  "itemsHash": "8c52fe76eab1",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 63, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
