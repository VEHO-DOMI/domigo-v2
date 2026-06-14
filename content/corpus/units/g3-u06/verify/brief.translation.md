# Verify lens — translation — g3-u06 (round 1)

<!-- domigo:verify translation g3-u06 items=ffe3bb58c674 prompt=c6328b13b073 round=1 -->

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

## Vocab items (45)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u06.w.approximately | approximately | ungefähr | approximately (full) ; about (partial) | ungefähr (full) ; etwa (full) |
| g3u06.w.art-gallery | art gallery | Kunstgalerie | art gallery (full) | Kunstgalerie (full) |
| g3u06.w.bridge | bridge | Brücke | bridge (full) | Brücke (full) |
| g3u06.w.building | building | Gebäude | building (full) | Gebäude (full) |
| g3u06.w.collection | collection | Sammlung | collection (full) | Sammlung (full) |
| g3u06.w.contract | contract | Vertrag | contract (full) | Vertrag (full) |
| g3u06.w.cruel | cruel | grausam | cruel (full) | grausam (full) ; gemein (partial) |
| g3u06.w.district | district | Bezirk | district (full) ; area (partial) | Bezirk (full) ; Viertel (full) |
| g3u06.w.empty | empty | leer | empty (full) | leer (full) |
| g3u06.w.fever | fever | Fieber | fever (full) | Fieber (full) |
| g3u06.w.government | government | Regierung | government (full) | Regierung (full) |
| g3u06.w.in-advance | in advance | im Voraus | in advance (full) | im Voraus (full) |
| g3u06.w.multicultural | multicultural | multikulturell | multicultural (full) | multikulturell (full) |
| g3u06.w.park | park | Park | park (full) | Park (full) |
| g3u06.w.path | path | Weg | path (full) | Weg (full) ; Pfad (full) |
| g3u06.w.play | play | Theaterstück | play (full) | Theaterstück (full) |
| g3u06.w.prison | prison | Gefängnis | prison (full) | Gefängnis (full) |
| g3u06.w.raven | raven | Rabe | raven (full) | Rabe (full) |
| g3u06.w.river | river | Fluss | river (full) | Fluss (full) |
| g3u06.w.shop | shop | Geschäft | shop (full) ; store (partial) | Geschäft (full) ; Laden (full) |
| g3u06.w.shopping-centre | shopping centre | Einkaufszentrum | shopping centre (full) | Einkaufszentrum (full) |
| g3u06.w.spectacular | spectacular | spektakulär | spectacular (full) ; amazing (partial) | spektakulär (full) ; beeindruckend (full) |
| g3u06.w.square | square | Platz | square (full) | Platz (full) |
| g3u06.w.stadium | stadium | Stadion | stadium (full) | Stadion (full) |
| g3u06.w.street | street | Straße | street (full) | Straße (full) |
| g3u06.w.sugar | sugar | Zucker | sugar (full) | Zucker (full) |
| g3u06.w.the-houses-of-parliament | the Houses of Parliament | das Parlament (von Großbritannien) | the Houses of Parliament (full) | das Parlament (full) |
| g3u06.w.theatre | theatre | Theater | theatre (full) | Theater (full) |
| g3u06.w.thrilling | thrilling | aufregend | thrilling (full) ; exciting (partial) | aufregend (full) ; spannend (full) |
| g3u06.w.to-burn-down | to burn down | niederbrennen | to burn down (full) | niederbrennen (full) |
| g3u06.w.to-cough | to cough (up) | (aus-)husten | to cough (full) | husten (full) |
| g3u06.w.to-earn | to earn (money) | (Geld) verdienen | to earn (full) | verdienen (full) |
| g3u06.w.to-experience | to experience | erleben | to experience (full) | erleben (full) ; erfahren (full) |
| g3u06.w.to-lead | to lead | leiten | to lead (full) ; to guide (partial) | leiten (full) ; führen (full) |
| g3u06.w.to-photograph | to photograph | fotografieren | to photograph (full) | fotografieren (full) |
| g3u06.w.to-raise | to raise | anheben | to raise (full) ; to lift (partial) | anheben (full) ; erhöhen (full) ; hochheben (full) |
| g3u06.w.to-report | to report | berichten | to report (full) | berichten (full) ; melden (full) |
| g3u06.w.to-save-up-for | to save up for | ansparen | to save up for (full) | ansparen (full) ; sparen für (full) |
| g3u06.w.to-sign | to sign | unterschreiben | to sign (full) | unterschreiben (full) |
| g3u06.w.to-take-a-walk | to take a walk | einen Spaziergang machen | to take a walk (full) | einen Spaziergang machen (full) |
| g3u06.w.tourist-attraction | tourist attraction | Sehenswürdigkeit | tourist attraction (full) | Sehenswürdigkeit (full) |
| g3u06.w.tower | tower | Turm | tower (full) | Turm (full) |
| g3u06.w.traffic | traffic | Verkehr | traffic (full) | Verkehr (full) |
| g3u06.w.view | view | Ausblick | view (full) | Ausblick (full) ; Aussicht (full) |
| g3u06.w.visitor | visitor | Besucher/Besucherin | visitor (full) | Besucher (full) ; Besucherin (full) |

## Grammar items (5 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u06.gi.relative-clauses.tr.001 | translation | Das Mädchen, das neben mir sitzt, ist sehr nett. [de] | The girl who sits next to me is very nice. (full) ; The girl that sits next to me is very nice. (full) | deToEn |
| g3u06.gi.relative-clauses.tr.002 | translation | Das ist der Turm, den du vom Park aus sehen kannst. [de] | That's the tower which you can see from the park. (full) ; That's the tower that you can see from the park. (full) ; That is the tower which you can see from the park. (full) ; That is the tower that you can see from the park. (full) | deToEn |
| g3u06.gi.relative-clauses.tr.003 | translation | Das ist der Junge, dessen Vater Pilot ist. [de] | That's the boy whose father is a pilot. (full) ; That is the boy whose father is a pilot. (full) | deToEn |
| g3u06.gi.relative-clauses.tr.004 | translation | Sieh dir die Männer an, deren Aufgabe es ist, die Kronjuwelen zu schützen. [de] | Look at the men whose job is to protect the Crown Jewels. (full) | deToEn |
| g3u06.gi.relative-clauses.tr.005 | translation | London ist eine Stadt, die ich liebe. [de] | London is a city which I love. (full) ; London is a city that I love. (full) | deToEn |

## Output contract

Write `content/corpus/units/g3-u06/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u06",
  "lens": "translation",
  "itemsHash": "ffe3bb58c674",
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
