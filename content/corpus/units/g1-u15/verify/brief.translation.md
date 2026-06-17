# Verify lens — translation — g1-u15 (round 2)

<!-- domigo:verify translation g1-u15 items=5a2e302029f4 prompt=c6328b13b073 round=2 -->

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

## Vocab items (23)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u15.w.aunt | aunt | Tante | aunt (full) ; aunty (partial) | Tante (full) |
| g1u15.w.beach | beach | Strand | beach (full) | Strand (full) |
| g1u15.w.board-game | board game | Brettspiel | board game (full) | Brettspiel (full) |
| g1u15.w.campsite | campsite | Campingplatz | campsite (full) | Campingplatz (full) |
| g1u15.w.cook | cook | Koch/Köchin | cook (full) | Koch (full) ; Köchin (full) |
| g1u15.w.hippo | hippo | Nilpferd | hippo (full) | Nilpferd (full) |
| g1u15.w.holiday | holiday | Urlaub | holiday (full) ; holidays (full) | Urlaub (full) ; Ferien (full) |
| g1u15.w.national-park | national park | Nationalpark | national park (full) | Nationalpark (full) |
| g1u15.w.parents | parents | Eltern | parents (full) | Eltern (full) |
| g1u15.w.plane | plane | Flugzeug | plane (full) | Flugzeug (full) |
| g1u15.w.summer | summer | Sommer | summer (full) | Sommer (full) |
| g1u15.w.to-drive | to drive | fahren | to drive (full) ; drive (full) | fahren (full) |
| g1u15.w.to-fly-to | to fly to | fliegen nach | to fly to (full) ; fly to (full) | fliegen nach (full) |
| g1u15.w.to-go-fishing | to go fishing | angeln gehen | to go fishing (full) ; go fishing (full) | angeln gehen (full) |
| g1u15.w.to-invite | to invite | einladen | to invite (full) ; invite (full) | einladen (full) |
| g1u15.w.to-join | to join | beitreten | to join (full) ; join (full) | beitreten (full) ; ein Mitglied werden (full) ; mitmachen (partial) |
| g1u15.w.to-lie-in-the-sun | to lie in the sun | in der Sonne liegen | to lie in the sun (full) ; lie in the sun (full) | in der Sonne liegen (full) |
| g1u15.w.to-play-badminton | to play badminton | Badminton spielen | to play badminton (full) ; play badminton (full) | Badminton spielen (full) |
| g1u15.w.to-play-board-games | to play board games | Brettspiele spielen | to play board games (full) ; play board games (full) | Brettspiele spielen (full) |
| g1u15.w.to-stay-at-a-campsite | to stay at a campsite | auf einem Campingplatz übernachten | to stay at a campsite (full) ; stay at a campsite (full) | auf einem Campingplatz übernachten (full) |
| g1u15.w.to-swim-in-the-sea | to swim in the sea | im Meer schwimmen | to swim in the sea (full) ; swim in the sea (full) | im Meer schwimmen (full) |
| g1u15.w.to-visit-a-castle | to visit a castle | eine Burg/ein Schloss besuchen | to visit a castle (full) ; visit a castle (full) | eine Burg besuchen (full) ; ein Schloss besuchen (full) |
| g1u15.w.to-write-a-postcard | to write a postcard | eine Postkarte schreiben | to write a postcard (full) ; write a postcard (full) | eine Postkarte schreiben (full) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u15.gi.going-to.tr.002 | translation | Wirst du in der Sonne liegen? – Ja. [de] | Are you going to lie in the sun? Yes, I am. (full) ; Are you going to lie in the sun? - Yes, I am. (full) ; Are you going to lie in the sun? Yes, I am (full) | deToEn |
| g1u15.gi.going-to.tr.003 | translation | Wir werden im Meer schwimmen. [de] | We are going to swim in the sea. (full) ; We're going to swim in the sea. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g1-u15/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u15",
  "lens": "translation",
  "itemsHash": "5a2e302029f4",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 25, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
