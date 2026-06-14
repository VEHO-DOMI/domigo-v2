# Verify lens — translation — g3-u08 (round 1)

<!-- domigo:verify translation g3-u08 items=58382b23fcb2 prompt=c6328b13b073 round=1 -->

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

## Vocab items (47)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u08.w.automatically | automatically | automatisch | automatically (full) | automatisch (full) |
| g3u08.w.bacon | bacon | Speck | bacon (full) | Speck (full) |
| g3u08.w.collar | collar | Kragen | collar (full) | Kragen (full) ; Halsband (partial) |
| g3u08.w.computer-science | computer science | Informatik | computer science (full) | Informatik (full) |
| g3u08.w.confident | confident | (selbst)sicher | confident (full) | selbstsicher (full) ; sicher (full) ; zuversichtlich (full) |
| g3u08.w.crowd | crowd | Menschenmenge | crowd (full) | Menschenmenge (full) ; Publikum (full) |
| g3u08.w.crutches | crutches | Krücken | crutches (full) | Krücken (full) |
| g3u08.w.current | current | (elektrischer) Strom | current (full) | Strom (full) ; elektrischer Strom (full) |
| g3u08.w.device | device | Gerät | device (full) | Gerät (full) |
| g3u08.w.dish | dish | Gericht | dish (full) | Gericht (full) ; Speise (partial) |
| g3u08.w.electric | electric (motor) | elektrisch | electric (full) | elektrisch (full) |
| g3u08.w.energy | energy | Energie | energy (full) | Energie (full) ; Strom (partial) |
| g3u08.w.engineer | engineer | Techniker/Technikerin | engineer (full) | Techniker (full) ; Technikerin (full) |
| g3u08.w.fat | fat | Fett | fat (full) | Fett (full) |
| g3u08.w.glove | glove | Handschuh | glove (full) | Handschuh (full) |
| g3u08.w.housework | housework | Hausarbeit | housework (full) | Hausarbeit (full) |
| g3u08.w.illness | illness | Krankheit | illness (full) | Krankheit (full) |
| g3u08.w.influence | influence | Einfluss | influence (full) | Einfluss (full) |
| g3u08.w.inspiration | inspiration | Inspiration | inspiration (full) | Inspiration (full) |
| g3u08.w.invention | invention | Erfindung | invention (full) | Erfindung (full) |
| g3u08.w.inventor | inventor | Erfinder/Erfinderin | inventor (full) | Erfinder (full) ; Erfinderin (full) |
| g3u08.w.perhaps | perhaps | vielleicht | perhaps (full) | vielleicht (full) ; eventuell (full) |
| g3u08.w.product | product | Produkt | product (full) | Produkt (full) |
| g3u08.w.ramp | ramp | Rampe | ramp (full) | Rampe (full) |
| g3u08.w.remarkable | remarkable | bemerkenswert | remarkable (full) | bemerkenswert (full) |
| g3u08.w.soap | soap | Seife | soap (full) | Seife (full) |
| g3u08.w.to-adapt | to adapt | anpassen | adapt (full) ; to adapt (full) | anpassen (full) ; sich anpassen (full) |
| g3u08.w.to-attach | to attach | anhängen | attach (full) ; to attach (full) | anhängen (full) ; anfügen (full) |
| g3u08.w.to-be-responsible-for | to be responsible for | für etw. verantwortlich sein | be responsible for (full) ; to be responsible for (full) ; responsible for (full) | für etwas verantwortlich sein (full) ; verantwortlich sein für (full) |
| g3u08.w.to-decorate | to decorate | dekorieren | decorate (full) ; to decorate (full) | dekorieren (full) |
| g3u08.w.to-design | to design | entwerfen | design (full) ; to design (full) | entwerfen (full) ; gestalten (full) |
| g3u08.w.to-develop | to develop | entwickeln | develop (full) ; to develop (full) | entwickeln (full) |
| g3u08.w.to-discover | to discover | entdecken | discover (full) ; to discover (full) | entdecken (full) |
| g3u08.w.to-experiment | to experiment | experimentieren | experiment (full) ; to experiment (full) | experimentieren (full) |
| g3u08.w.to-impress | to impress | beeindrucken | impress (full) ; to impress (full) | beeindrucken (full) |
| g3u08.w.to-improve | to improve | verbessern | improve (full) ; to improve (full) | verbessern (full) |
| g3u08.w.to-invent | to invent | erfinden | invent (full) ; to invent (full) | erfinden (full) |
| g3u08.w.to-invest | to invest | investieren | invest (full) ; to invest (full) | investieren (full) |
| g3u08.w.to-produce | to produce | produzieren | produce (full) ; to produce (full) | produzieren (full) ; herstellen (full) |
| g3u08.w.to-repair | to repair | reparieren | repair (full) ; to repair (full) | reparieren (full) |
| g3u08.w.to-research | to research | erforschen | research (full) ; to research (full) | erforschen (full) ; recherchieren (full) |
| g3u08.w.to-shoot | to shoot | schießen | shoot (full) ; to shoot (full) | schießen (full) |
| g3u08.w.to-support | to support | unterstützen | support (full) ; to support (full) | unterstützen (full) |
| g3u08.w.to-try-out | to try out | ausprobieren | try out (full) ; to try out (full) | ausprobieren (full) |
| g3u08.w.to-work-sth-out | to work sth. out | etw. herausfinden | work out (full) ; to work sth. out (full) ; work it out (full) | etwas herausfinden (full) ; herausfinden (full) ; lösen (partial) |
| g3u08.w.wheelchair | wheelchair | Rollstuhl | wheelchair (full) | Rollstuhl (full) |
| g3u08.w.wrist | wrist | Handgelenk | wrist (full) | Handgelenk (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u08.gi.past-simple-vs-present-perfect.tr.001 | translation | Ich habe diesen Film schon gesehen. [de] | I have already seen this film. (full) ; I've already seen this film. (partial) | deToEn |
| g3u08.gi.past-simple-vs-present-perfect.tr.002 | translation | Warst du schon einmal in England? [de] | Have you ever been to England? (full) | deToEn |
| g3u08.gi.past-simple-vs-present-perfect.tr.003 | translation | Wir sind letzten Sommer nach Italien gefahren. [de] | We went to Italy last summer. (full) | deToEn |
| g3u08.gi.past-simple-vs-present-perfect.tr.004 | translation | Ich habe gerade mein Zimmer aufgeräumt. [de] | I have just tidied my room. (full) ; I've just tidied my room. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g3-u08/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u08",
  "lens": "translation",
  "itemsHash": "58382b23fcb2",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 51, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
