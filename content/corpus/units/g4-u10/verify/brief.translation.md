# Verify lens — translation — g4-u10 (round 1)

<!-- domigo:verify translation g4-u10 items=2a4426bd419e prompt=c6328b13b073 round=1 -->

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

## Vocab items (37)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u10.w.agreement | agreement | Vereinbarung | agreement (full) | Vereinbarung (full) ; Abmachung (full) ; eine Vereinbarung (full) |
| g4u10.w.angry | angry | wütend | angry (full) | wütend (full) ; verärgert (full) ; böse (partial) |
| g4u10.w.annoy | annoy | verärgern | annoy (full) | verärgern (full) ; ärgern (full) ; nerven (full) |
| g4u10.w.bicycle | bicycle | Fahrrad | bicycle (full) ; bike (partial) | Fahrrad (full) ; das Fahrrad (full) ; Rad (full) |
| g4u10.w.brother-in-law | brother-in-law | Schwager | brother-in-law (full) | Schwager (full) ; der Schwager (full) |
| g4u10.w.claim | claim | behaupten | claim (full) | behaupten (full) |
| g4u10.w.defeat | defeat | besiegen | defeat (full) | besiegen (full) ; überwältigen (full) ; schlagen (full) |
| g4u10.w.fair-trade | Fair Trade | eine Organisation | Fair Trade (full) | Fair Trade (full) ; fairer Handel (partial) |
| g4u10.w.fairness | fairness | Gerechtigkeit | fairness (full) | Gerechtigkeit (full) ; Fairness (full) ; die Fairness (full) |
| g4u10.w.farmer | farmer | Landwirt/in | farmer (full) | Landwirt (full) ; Landwirtin (full) ; Bauer (full) ; Bäuerin (full) |
| g4u10.w.harmony | harmony | Harmonie | harmony (full) | Harmonie (full) ; Eintracht (partial) |
| g4u10.w.hell | hell | Hölle | hell (full) | Hölle (full) ; die Hölle (full) |
| g4u10.w.helpless | helpless | hilflos | helpless (full) | hilflos (full) |
| g4u10.w.human-being | human being | Mensch | human being (full) ; human beings (full) | Mensch (full) ; Menschen (full) ; ein Mensch (full) |
| g4u10.w.hurt | hurt | verletzen | hurt (full) | verletzen (full) ; wehtun (full) ; kränken (partial) |
| g4u10.w.hurtful | hurtful | verletzend | hurtful (full) | verletzend (full) ; kränkend (full) |
| g4u10.w.ignorance | ignorance | Ignoranz | ignorance (full) | Ignoranz (full) ; Unwissenheit (full) |
| g4u10.w.increase | increase | steigen | increase (full) | steigen (full) ; erhöhen (full) ; ansteigen (full) ; zunehmen (full) |
| g4u10.w.introduction | introduction | Einleitung | introduction (full) | Einleitung (full) ; die Einleitung (full) |
| g4u10.w.make-a-living | make a living | den Lebensunterhalt verdienen | make a living (full) | den Lebensunterhalt verdienen (full) ; seinen Lebensunterhalt verdienen (full) ; genug Geld zum Leben verdienen (partial) |
| g4u10.w.misunderstood | misunderstood | missverstanden | misunderstood (full) | missverstanden (full) |
| g4u10.w.oil | oil | Öl | oil (full) | Öl (full) ; das Öl (full) |
| g4u10.w.overcome | overcome | überwinden | overcome (full) | überwinden (full) ; besiegen (full) ; bewältigen (full) |
| g4u10.w.painful | painful | schmerzhaft | painful (full) | schmerzhaft (full) ; schmerzvoll (full) |
| g4u10.w.pay-rise | pay rise | Gehaltserhöhung | pay rise (full) | Gehaltserhöhung (full) ; Lohnerhöhung (full) ; eine Gehaltserhöhung (full) |
| g4u10.w.pesticide | pesticide | Pestizid | pesticide (full) | Pestizid (full) ; Insektenbekämpfungsmittel (full) ; Schädlingsbekämpfungsmittel (partial) |
| g4u10.w.pollution | pollution | Verschmutzung | pollution (full) | Verschmutzung (full) ; die Verschmutzung (full) ; Umweltverschmutzung (full) |
| g4u10.w.proud | proud | stolz | proud (full) | stolz (full) |
| g4u10.w.racism | racism | Rassismus | racism (full) | Rassismus (full) ; der Rassismus (full) |
| g4u10.w.racist | racist | rassistisch | racist (full) | rassistisch (full) |
| g4u10.w.rate | rate | Rate | rate (full) | Rate (full) ; die Rate (full) |
| g4u10.w.recognition | recognition | Anerkennung | recognition (full) | Anerkennung (full) ; Bestätigung (full) ; die Anerkennung (full) |
| g4u10.w.select | select | auswählen | select (full) | auswählen (full) ; aussuchen (full) |
| g4u10.w.shocked | shocked | schockiert | shocked (full) | schockiert (full) ; geschockt (full) |
| g4u10.w.slavery | slavery | Sklaverei | slavery (full) | Sklaverei (full) ; die Sklaverei (full) |
| g4u10.w.son-in-law | son-in-law | Schwiegersohn | son-in-law (full) | Schwiegersohn (full) ; der Schwiegersohn (full) |
| g4u10.w.surprised | surprised | überrascht | surprised (full) | überrascht (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u10.gi.third-conditional.tr.001 | translation | Wenn ich das gewusst hätte, hätte ich dir geholfen. [de] | If I had known that, I would have helped you. (full) ; If I had known, I would have helped you. (full) ; If I'd known that, I would've helped you. (partial) ; I would have helped you if I had known that. (partial) | deToEn |
| g4u10.gi.third-conditional.tr.002 | translation | Wenn sie früher losgefahren wären, wären sie pünktlich angekommen. [de] | If they had left earlier, they would have arrived on time. (full) ; If they had set off earlier, they would have arrived on time. (full) ; They would have arrived on time if they had left earlier. (partial) | deToEn |
| g4u10.gi.third-conditional.tr.003 | translation | Wenn es morgen regnet, bleiben wir zu Hause. [de] | If it rains tomorrow, we will stay at home. (full) ; If it rains tomorrow, we'll stay at home. (partial) ; We will stay at home if it rains tomorrow. (partial) | deToEn |
| g4u10.gi.third-conditional.tr.004 | translation | Wenn ich reich wäre, würde ich um die Welt reisen. [de] | If I were rich, I would travel around the world. (full) ; If I was rich, I would travel around the world. (partial) ; I would travel around the world if I were rich. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g4-u10/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u10",
  "lens": "translation",
  "itemsHash": "2a4426bd419e",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 41, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
