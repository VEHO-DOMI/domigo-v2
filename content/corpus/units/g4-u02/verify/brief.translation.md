# Verify lens — translation — g4-u02 (round 1)

<!-- domigo:verify translation g4-u02 items=b209f975f67d prompt=c6328b13b073 round=1 -->

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
| g4u02.w.attractive | attractive | attraktiv | attractive (full) ; good-looking (partial) | attraktiv (full) ; hübsch (partial) |
| g4u02.w.besides | besides | außerdem | besides (full) | außerdem (full) ; im Übrigen (full) ; ohnehin (partial) |
| g4u02.w.blackmail | blackmail | Erpressung | blackmail (full) | Erpressung (full) |
| g4u02.w.chest | chest | Brust | chest (full) | Brust (full) ; Brustkorb (partial) |
| g4u02.w.commit | commit | begehen | commit (full) ; to commit (full) | begehen (full) ; verüben (partial) |
| g4u02.w.common | common | häufig | common (full) | häufig (full) ; gewöhnlich (full) |
| g4u02.w.conclusion | conclusion | Schlussfolgerung | conclusion (full) ; a conclusion (full) | Schlussfolgerung (full) ; Schluss (partial) |
| g4u02.w.confusion | confusion | Verwirrung | confusion (full) | Verwirrung (full) ; Durcheinander (partial) |
| g4u02.w.consider | consider | erwägen | consider (full) ; to consider (full) ; to think about (partial) | erwägen (full) ; überlegen (full) ; in Betracht ziehen (partial) |
| g4u02.w.crime-scene | crime scene | Tatort | crime scene (full) ; the crime scene (full) | Tatort (full) |
| g4u02.w.criminal | criminal | Verbrecher/in | criminal (full) ; a criminal (full) | Verbrecher (full) ; Verbrecherin (full) ; Verbrecher/in (full) |
| g4u02.w.employee | employee | Angestellte/r | employee (full) ; an employee (full) | Angestellte (full) ; Angestellter (full) ; Angestellte/r (full) ; Mitarbeiter (partial) |
| g4u02.w.escape | escape | entkommen | escape (full) ; to escape (full) | entkommen (full) ; flüchten (full) ; entfliehen (partial) |
| g4u02.w.evidence | evidence | Beweis | evidence (full) ; proof (partial) | Beweis (full) ; Beweise (full) ; Beweismaterial (partial) |
| g4u02.w.excellent | excellent | hervorragend | excellent (full) ; really good (partial) | hervorragend (full) ; großartig (full) ; ausgezeichnet (full) |
| g4u02.w.expect | expect | erwarten | expect (full) ; to expect (full) | erwarten (full) ; rechnen mit (partial) |
| g4u02.w.get-hold-of-sth | get hold of sth | an etwas gelangen | get hold of sth (full) ; get hold of something (full) | an etwas gelangen (full) ; etwas bekommen (full) ; etwas auftreiben (partial) |
| g4u02.w.handkerchief | handkerchief | Taschentuch | handkerchief (full) ; a handkerchief (full) | Taschentuch (full) |
| g4u02.w.historical | historical | historisch | historical (full) | historisch (full) ; geschichtlich (full) |
| g4u02.w.illegal | illegal | illegal | illegal (full) ; against the law (partial) | illegal (full) ; rechtswidrig (full) ; verboten (partial) |
| g4u02.w.investigation | investigation | Untersuchung | investigation (full) ; an investigation (full) | Untersuchung (full) ; Ermittlung (full) |
| g4u02.w.keep-an-eye-on | keep an eye on | aufpassen auf | keep an eye on (full) ; to keep an eye on (full) ; to watch (partial) | aufpassen auf (full) ; ein Auge haben auf (full) ; im Auge behalten (partial) |
| g4u02.w.likely | likely | wahrscheinlich | likely (full) ; probable (partial) | wahrscheinlich (full) |
| g4u02.w.mention | mention | erwähnen | mention (full) ; to mention (full) | erwähnen (full) |
| g4u02.w.murder | murder | Mord | murder (full) | Mord (full) |
| g4u02.w.mystery | mystery | Rätsel | mystery (full) ; a mystery (full) | Rätsel (full) ; Geheimnis (full) |
| g4u02.w.nephew | nephew | Neffe | nephew (full) ; a nephew (full) | Neffe (full) |
| g4u02.w.never-mind | Never mind. | Macht nichts. | Never mind (full) ; never mind (full) | Macht nichts. (full) ; Egal. (full) ; Schon gut. (partial) |
| g4u02.w.office-clerk | office clerk | Büroangestellte/r | office clerk (full) ; an office clerk (full) | Büroangestellte (full) ; Büroangestellter (full) ; Büroangestellte/r (full) |
| g4u02.w.personal | personal | persönlich | personal (full) ; private (partial) | persönlich (full) ; privat (partial) |
| g4u02.w.prove | prove | beweisen | prove (full) ; to prove (full) | beweisen (full) ; nachweisen (partial) |
| g4u02.w.realise | realise | erkennen | realise (full) ; to realise (full) ; realize (full) | erkennen (full) ; begreifen (full) ; merken (partial) |
| g4u02.w.relative | relative | Verwandte/r | relative (full) ; a relative (full) | Verwandte (full) ; Verwandter (full) ; Verwandte/r (full) |
| g4u02.w.report | report | Bericht | report (full) ; a report (full) | Bericht (full) |
| g4u02.w.retire | retire | in Pension gehen | retire (full) ; to retire (full) | in Pension gehen (full) ; in Rente gehen (full) ; mit der Arbeit aufhören (partial) |
| g4u02.w.right-away | right away | sofort | right away (full) ; at once (full) ; immediately (partial) | sofort (full) ; gleich (partial) |
| g4u02.w.suspect | suspect | Verdächtige/r | suspect (full) ; a suspect (full) | Verdächtige (full) ; Verdächtiger (full) ; Verdächtige/r (full) |
| g4u02.w.suspicion | suspicion | Verdacht | suspicion (full) ; a suspicion (full) | Verdacht (full) |
| g4u02.w.take-over | take over | übernehmen | take over (full) ; to take over (full) | übernehmen (full) |
| g4u02.w.to-steal | to steal | stehlen | to steal (full) ; steal (full) | stehlen (full) ; klauen (partial) |
| g4u02.w.unlock | unlock | aufschließen | unlock (full) ; to unlock (full) | aufschließen (full) ; aufsperren (full) |
| g4u02.w.upset | upset | verstört | upset (full) ; sad (partial) | verstört (full) ; aufgewühlt (full) ; traurig (partial) |
| g4u02.w.victim | victim | Opfer | victim (full) ; a victim (full) | Opfer (full) |
| g4u02.w.wastepaper-bin | wastepaper bin | Papierkorb | wastepaper bin (full) ; a wastepaper bin (full) | Papierkorb (full) |
| g4u02.w.weapon | weapon | Waffe | weapon (full) ; a weapon (full) | Waffe (full) |
| g4u02.w.witness | witness | Zeuge/Zeugin | witness (full) ; a witness (full) | Zeuge (full) ; Zeugin (full) ; Zeuge/Zeugin (full) |

## Grammar items (6 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u02.gi.past-perfect.tr.001 | translation | Übersetze ins Englische: ⏎  ⏎ Als wir ankamen, hatte der Film schon angefangen. [de] | When we arrived, the film had already started. (full) ; When we arrived, the film had already begun. (full) ; The film had already started when we arrived. (full) ; When we arrived, the film had started. (partial) | deToEn |
| g4u02.gi.past-perfect.tr.002 | translation | Übersetze ins Englische: ⏎  ⏎ Er war müde, weil er nicht gut geschlafen hatte. [de] | He was tired because he hadn't slept well. (full) ; He was tired because he had not slept well. (full) | deToEn |
| g4u02.gi.past-perfect.tr.003 | translation | Übersetze ins Englische: ⏎  ⏎ Nachdem er seine Hausaufgaben gemacht hatte, ging er in den Park. [de] | After he had done his homework, he went to the park. (full) ; After he had finished his homework, he went to the park. (full) ; He went to the park after he had done his homework. (full) | deToEn |
| g4u02.gi.past-perfect.tr.004 | translation | Übersetze ins Englische: ⏎  ⏎ Die Polizei wusste, dass der Dieb durch das Fenster entkommen war. [de] | The police knew that the thief had escaped through the window. (full) ; The police knew the thief had escaped through the window. (full) | deToEn |
| g4u02.gi.past-perfect.tr.005 | translation | Übersetze ins Englische: ⏎  ⏎ Die Diebe hatten alles gestohlen. [de] | The thieves had stolen everything. (full) | deToEn |
| g4u02.gi.past-perfect.tr.006 | translation | Übersetze ins Englische: ⏎  ⏎ Der Zeuge war nervös, weil er ein Verbrechen gesehen hatte. [de] | The witness was nervous because he had seen a crime. (full) | deToEn |

## Output contract

Write `content/corpus/units/g4-u02/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u02",
  "lens": "translation",
  "itemsHash": "b209f975f67d",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 52, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
