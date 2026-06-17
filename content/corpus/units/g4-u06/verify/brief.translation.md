# Verify lens — translation — g4-u06 (round 1)

<!-- domigo:verify translation g4-u06 items=cc5e46d741cb prompt=c6328b13b073 round=1 -->

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

## Vocab items (18)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u06.w.achieve | achieve | erreichen | achieve (full) ; to achieve (full) ; achieved (partial) ; reach (partial) | erreichen (full) ; schaffen (partial) ; erlangen (partial) |
| g4u06.w.community | community | Gemeinschaft | community (full) ; communities (partial) | Gemeinschaft (full) ; die Gemeinschaft (full) ; Gemeinde (partial) |
| g4u06.w.donate | donate | spenden | donate (full) ; to donate (full) ; donated (partial) ; give (partial) | spenden (full) ; stiften (partial) |
| g4u06.w.drop-out | drop out (of school) | (die Schule) abbrechen | drop out (full) ; drop out of school (full) ; to drop out of school (full) ; leave school early (partial) | die Schule abbrechen (full) ; abbrechen (full) ; die Schule vorzeitig verlassen (partial) |
| g4u06.w.encouragement | encouragement | Ermutigung | encouragement (full) | Ermutigung (full) ; Förderung (full) ; Zuspruch (partial) |
| g4u06.w.exceed | exceed | übertreffen | exceed (full) ; to exceed (full) ; exceeded (partial) ; go over (partial) | übertreffen (full) ; überschreiten (full) ; übersteigen (partial) |
| g4u06.w.frustrated | frustrated | frustriert | frustrated (full) | frustriert (full) ; enttäuscht (partial) |
| g4u06.w.goal | goal | Ziel | goal (full) ; goals (partial) ; aim (partial) | Ziel (full) ; das Ziel (full) ; Vorhaben (partial) |
| g4u06.w.grateful | grateful | dankbar | grateful (full) ; thankful (partial) | dankbar (full) |
| g4u06.w.in-particular | in particular | besonders | in particular (full) | besonders (full) ; im Speziellen (full) ; vor allem (partial) |
| g4u06.w.income | income | Einkommen | income (full) ; an income (full) | Einkommen (full) ; das Einkommen (full) ; Verdienst (partial) |
| g4u06.w.inspire | inspire | inspirieren | inspire (full) ; to inspire (full) ; inspired (partial) | inspirieren (full) ; anregen (partial) ; begeistern (partial) |
| g4u06.w.learn-a-lesson | learn a lesson | eine Lehre aus etw. ziehen | learn a lesson (full) ; to learn a lesson (full) ; learned a lesson (partial) | eine Lehre aus etwas ziehen (full) ; aus etwas lernen (full) ; seine Lektion lernen (partial) |
| g4u06.w.range-of | range of | eine Reihe von | range of (full) ; a range of (full) | eine Reihe von (full) ; zahlreiche (full) ; eine Vielzahl von (partial) |
| g4u06.w.relate-to | relate to | sich mit jdm./etw. identifizieren | relate to (full) ; to relate to (full) | sich mit jemandem identifizieren (full) ; nachempfinden (full) ; sich hineinversetzen (partial) |
| g4u06.w.small-wonder | Small wonder | Kein Wunder | small wonder (full) ; no wonder (partial) | Kein Wunder (full) ; Wen wundert es (partial) |
| g4u06.w.support | support | unterstützen | support (full) ; to support (full) ; supported (partial) ; help (partial) | unterstützen (full) ; helfen (partial) |
| g4u06.w.transmit | transmit | senden | transmit (full) ; to transmit (full) ; transmitted (partial) | senden (full) ; übermitteln (full) ; übertragen (partial) |

## Grammar items (9 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u06.gi.adverbs-of-manner.tr.001 | translation | Er spricht sehr leise. [de] | He speaks very quietly. (full) ; He talks very quietly. (full) | deToEn |
| g4u06.gi.adverbs-of-manner.tr.004 | translation | Das Essen schmeckt schrecklich. [de] | The food tastes awful. (full) ; The food tastes terrible. (partial) | deToEn |
| g4u06.gi.adverbs-of-manner.tr.005 | translation | Speak quietly, please. [en] | Sprich bitte leise. (full) ; Bitte sprich leise. (full) ; Sprich leise, bitte. (partial) | enToDe |
| g4u06.gi.adverbs-of-manner.tr.006 | translation | Mia spielt die Gitarre sehr gut. [de] | Mia plays the guitar very well. (full) ; Mia plays guitar very well. (partial) | deToEn |
| g4u06.gi.adverbs-of-manner.tr.007 | translation | Sue liest die Regeln richtig. [de] | Sue reads the rules correctly. (full) | deToEn |
| g4u06.gi.question-tags.tr.001 | translation | Er ist nett, oder? [de] | He is nice, isn't he? (full) ; He's nice, isn't he? (full) | deToEn |
| g4u06.gi.question-tags.tr.002 | translation | Du magst Schokolade, oder? [de] | You like chocolate, don't you? (full) | deToEn |
| g4u06.gi.question-tags.tr.003 | translation | Niemand war dort, oder? [de] | Nobody was there, were they? (full) ; No one was there, were they? (full) | deToEn |
| g4u06.gi.question-tags.tr.005 | translation | Mia can drive, can't she? [en] | Mia kann Auto fahren, oder? (full) ; Mia kann fahren, oder? (full) ; Mia kann Auto fahren, nicht wahr? (full) | enToDe |

## Output contract

Write `content/corpus/units/g4-u06/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u06",
  "lens": "translation",
  "itemsHash": "cc5e46d741cb",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 27, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
