# Verify lens — answers — g2-u08 (round 2)

<!-- domigo:verify answers g2-u08 items=60f1cbb5b841 prompt=70fa2d8cdf22 round=2 -->

<!-- domigo:prompt verify-answers v=1 -->
# Lens 2 — answer-set completeness + in-sentence grammaticality (adversarial)

You are an independent, adversarial verifier. You did NOT write these items. For every
item, attack the answer machinery:

1. **Completeness:** put yourself in the student's seat and enumerate every answer a
   competent student could legitimately give. Is each one in the answer set at the
   right tier? A CORRECT answer marked wrong is the single worst failure this app can
   ship (it is exactly how v1 died). Check especially: contractions (we should not /
   we shouldn't), British/American variants, optional subjects, word-order variants,
   plural/singular both fitting, synonyms within the bank.
2. **Grammaticality:** substitute EVERY full-tier answer into the blank/carrier and
   read the whole sentence aloud. Wrong a/an, broken agreement, double words,
   capitalization mismatches at sentence start — all `fix`.
3. **Distractor safety:** for choice formats, could any distractor be defended as
   correct in this exact context? A defensible distractor = `fix`
   (kind `distractor-plausible-correct`). Distractors must be unambiguously wrong.
4. **Blank arity:** the declared blanks, the `___` markers, and the per-blank pipe
   segments in answers must agree (the machine checks counts; you check SENSE — does
   each segment actually fit its blank?).
5. **strict flag:** items where fuzzy matching would wrongly accept near-misses
   (minimal pairs like "should/shouldn't"!) need `strict: true` — flag if missing
   (kind `answer-incomplete`, say so in the note).

Flag kind menu: `answer-incomplete`, `answer-ungrammatical`,
`distractor-plausible-correct`. Severity `fix` for anything that would mis-grade a
real student; `warn` for defensible-but-improvable.

## Vocab items (32)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u08.w.aeroplane | aeroplane | a big thing with wings that carries people high in the sky | Yesterday, I saw a huge ___ in the sky. | aeroplane (full) ; airplane (partial) | aeroplane (full) ; airplane (partial) ; aeroplanes (full) ; airplanes (partial) | spaceship ; statue ; machine |
| g2u08.w.alien | alien | a living thing that is not from Earth | A green ___ came to Earth from space. | alien (full) | alien (full) ; aliens (full) | commander ; traveller ; visitor |
| g2u08.w.boss | boss | the man or woman you work for | My mum has a new ___ at the office. | boss (full) | boss (full) ; bosses (full) | visitor ; traveller ; expert |
| g2u08.w.cable | cable | a long thing that connects two machines | Benson connected a ___ to his spacesuit. | cable (full) | cable (full) ; cables (full) | key ; machine ; statue |
| g2u08.w.calm-down | Calm down! | you call this out to a friend who is too excited or scared | ___! There is nothing to be afraid of. | Calm down (full) ; Calm down! (full) | Calm down (full) ; Calm down! (full) | Go away! ; Hurry up. ; Be careful. |
| g2u08.w.capital | capital | the city of a country where the king or queen lives | Vienna is the ___ of Austria. | capital (full) | capital (full) ; capitals (full) | space centre ; statue ; key |
| g2u08.w.comfortable | comfortable | nice to be on and you are not tired | The chair was very ___ and I did not want to get up. | comfortable (full) | comfortable (full) | nervous ; dangerous ; famous |
| g2u08.w.commander | commander | the boss of a spaceship who gives the crew their jobs | The ___ told the crew what to do. | commander (full) | commander (full) ; commanders (full) | visitor ; traveller ; expert |
| g2u08.w.crew | crew | all the people who work on a ship or a plane | Benson wants to help his ___ on the spaceship. | crew (full) | crew (full) ; crews (full) | commander ; visitor ; expert |
| g2u08.w.expert | expert | a man or woman who is very good at one thing | She studied space for many years, so she is an ___. | expert (full) | expert (full) ; experts (full) | visitor ; traveller ; crew |
| g2u08.w.hero-heroine | hero, heroine | a great man people love and thank for what he did | Commander Benson is our ___ - we all love and thank him. | hero (full) ; heroine (partial) | hero (full) ; heroine (full) ; heroes (partial) ; heroines (partial) | commander ; visitor ; expert |
| g2u08.w.hoax | hoax | a false story that people are told is true | The news isn't true. It's a ___. | hoax (full) | hoax (full) ; hoaxes (full) | investigation ; photograph ; machine |
| g2u08.w.in-that-case | in that case | if that is so, then | You don't like fish? ___, let's have chicken. | in that case (full) ; In that case (full) | in that case (full) ; In that case (full) | Calm down! ; Don't worry. ; No problem. |
| g2u08.w.investigation | investigation | the work the police do to find out what really happened | The police did an ___ to find out what happened. | investigation (full) | investigation (full) ; investigations (full) | photograph ; hoax ; statue |
| g2u08.w.key | key | a small thing that opens a door or a car | He put the ___ in the door and opened it. | key (full) | key (full) ; keys (full) | cable ; machine ; statue |
| g2u08.w.machine | machine | a thing that does a job for you, like washing clothes | Benson used a ___ to talk to the alien. | machine (full) | machine (full) ; machines (full) | cable ; key ; statue |
| g2u08.w.nonsense | nonsense | talk that is mad and not true | You're talking ___! That story can't be true. | nonsense (full) | nonsense (full) | hoax ; investigation ; statue |
| g2u08.w.photograph | photograph | a picture you take to keep | My grandma showed me a ___ of her sister. | photograph (full) | photograph (full) ; photo (partial) ; photographs (full) ; photos (partial) | statue ; machine ; cable |
| g2u08.w.planet | planet | a big thing in space where people or aliens can live, like Earth or Mars | Earth is the ___ where we all live. | planet (full) | planet (full) ; planets (full) | spaceship ; statue ; machine |
| g2u08.w.space | space | everything far away from Earth, where the stars and planets are | There are lots of stars and planets out there in ___. | space (full) | space (full) | capital ; crew ; key |
| g2u08.w.space-centre | space centre | the place on Earth where people work on spaceships | We visited the ___ and looked at the spaceships. | space centre (full) ; space center (partial) | space centre (full) ; space center (partial) ; space centres (full) | spaceship ; spacesuit ; statue |
| g2u08.w.spaceship | spaceship | a ship that travels in space | A ___ is a ship that travels in space. | spaceship (full) | spaceship (full) ; spaceships (full) | aeroplane ; spacesuit ; planet |
| g2u08.w.spacesuit | spacesuit | the clothes you wear out in space | Benson wears a ___ outside the spaceship. | spacesuit (full) | spacesuit (full) ; spacesuits (full) | spaceship ; cable ; machine |
| g2u08.w.statue | statue | a big thing made of stone that looks like a famous man | There's a ___ of Lord Nelson at Trafalgar Square. | statue (full) | statue (full) ; statues (full) | machine ; cable ; key |
| g2u08.w.to-connect | to connect | to join two machines with a cable | You have to ___ the cable to the spacesuit. | connect (full) | connect (full) ; to connect (full) ; connects (full) ; connected (full) | to repair ; to destroy ; to kidnap |
| g2u08.w.to-destroy | to destroy | to break a place so much that nothing is there | In the story, aliens want to ___ the town and all the buildings. | destroy (full) | destroy (full) ; to destroy (full) ; destroys (full) ; destroyed (full) | to repair ; to connect ; to kidnap |
| g2u08.w.to-kidnap | to kidnap | to take people away and keep them, often for money | I think aliens want to ___ people from Earth. | kidnap (full) | kidnap (full) ; to kidnap (full) ; kidnaps (full) ; kidnapped (full) | to repair ; to connect ; to destroy |
| g2u08.w.to-repair | to repair | to make a thing work again after it breaks | Benson went outside to ___ the spaceship. | repair (full) | repair (full) ; to repair (full) ; repairs (full) ; repaired (full) | to connect ; to destroy ; to kidnap |
| g2u08.w.to-take-over | to take over | to become the new boss of a place and rule it | The aliens want to ___ the Earth. | take over (full) | take over (full) ; to take over (full) ; takes over (full) ; took over (full) | to repair ; to connect ; to destroy |
| g2u08.w.traveller | traveller | a man or woman who travels from place to place | I'm a ___ from planet Arconia. | traveller (full) ; traveler (partial) | traveller (full) ; traveler (partial) ; travellers (full) ; travelers (partial) | commander ; expert ; boss |
| g2u08.w.ufo | UFO | a thing in the sky that some people think is from space | We saw a ___ in the sky last night, but nobody knew what it was. | UFO (full) | UFO (full) ; UFOs (full) | aeroplane ; statue ; cable |
| g2u08.w.visitor | visitor | a man or woman who comes to a place to see it | Today we had a ___ from England who told us about London. | visitor (full) | visitor (full) ; visitors (full) | commander ; expert ; boss |

## Grammar items (30)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u08.gi.past-time-markers.ag.003 | anagram | Dieses Wort steht am Ende und zeigt, dass die Geschichte vorbei ist. [de] | Finally (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.ag.004 | anagram | Kleines Wort, das zeigt, wie lange etwas her ist (z. B. two days …). [de] | ago (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.cp.001 | context-picker | Here is a story about a UFO. [en] | First, we saw a light. Then, a spaceship landed. (full) | — | First, we see a light. Then, a spaceship lands. ; First, we saw a light. Then, a spaceship lands. ; First, we saw a light. Then, a spaceship is landing. | — | — | false |
| g2u08.gi.past-time-markers.cp.002 | context-picker | Here is a story about a spaceship. [en] | Last night, the commander heard a noise. (full) | — | The commander last night heard a noise. ; Last night, heard the commander a noise. ; The commander heard last night a noise. | — | — | false |
| g2u08.gi.past-time-markers.ec.001 | error-correction | First, we went to the park. Then we play football. [en] | First, we went to the park. Then we played football. (full) ; played (partial) | — | — | — | — | false |
| g2u08.gi.past-time-markers.ec.002 | error-correction | First, the alien came out. Then it look at Benson. [en] | First, the alien came out. Then it looked at Benson. (full) ; looked (partial) | — | — | — | — | false |
| g2u08.gi.past-time-markers.ec.003 | error-correction | Then went the commander outside. [en] | Then the commander went outside. (full) | — | — | — | — | true |
| g2u08.gi.past-time-markers.ec.004 | error-correction | She didn't took a photograph of the UFO. [en] | She didn't take a photograph of the UFO. (full) | — | — | — | — | true |
| g2u08.gi.past-time-markers.ec.005 | error-correction | He goed back to the spaceship. [en] | He went back to the spaceship. (full) | — | — | — | — | true |
| g2u08.gi.past-time-markers.gf.001 | gap-fill | ___, the spaceship landed. Then, an alien came out. [en, 1 blank(s)] | First (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.gf.002 | gap-fill | First, the cable broke. ___, everything went black. [en, 1 blank(s)] | Then (full) ; After that (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.gf.003 | gap-fill | First, the crew repaired the machine. Then, the spaceship landed. ___, they came back to Earth. [en, 1 blank(s)] | Finally (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.gf.004 | gap-fill | I saw that UFO two days ___. [en, 1 blank(s)] | ago (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.gf.005 | gap-fill | ___ night, a spaceship landed in our garden. [en, 1 blank(s)] | Last (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.gf.006 | gap-fill | First, we visited the space centre. Then, we saw the spaceship. ___, we went inside. ___, we landed on the planet! [en, 2 blank(s)] | After that \| Finally (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.gf.007 | gap-fill | ___ 2013, there was a big investigation ___ the photograph. [en, 2 blank(s)] | In \| into (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.gs.003 | group-sort | Open or close a story? [en] | — | — | — | — | opens a story: First, One day, Last night \| in the middle or at the end: After that, Then, Finally | false |
| g2u08.gi.past-time-markers.mc.002 | multiple-choice | Then ___ to the door. [en, 1 blank(s)] | she ran (full) | — | ran she ; she runs ; she run | — | — | false |
| g2u08.gi.past-time-markers.mc.003 | multiple-choice | Benson told the class a story. [en] | After that, the commander went outside. (full) | — | After that, went the commander outside. ; After that, the commander going outside. ; After that, the commander go outside. | — | — | false |
| g2u08.gi.past-time-markers.mc.004 | multiple-choice | Put the story in order. [en] | First, the cable broke. Then, Benson woke up on a spaceship. After that, an alien came out. Finally, they took him back to Earth. (full) | — | Finally, the cable broke. Then, Benson woke up on a spaceship. First, an alien came out. After that, they took him back to Earth. ; After that, the cable broke. First, Benson woke up on a spaceship. Finally, an alien came out. Then, they took him back to Earth. ; Then, the cable broke. After that, Benson woke up on a spaceship. Finally, an alien came out. First, they took him back to Earth. | — | — | false |
| g2u08.gi.past-time-markers.mc.005 | multiple-choice | First, we saw a light. ___, the spaceship landed. Finally, an alien came out. [en, 1 blank(s)] | Then (full) ; After that (full) | — | First ; Finally ; Half an hour ago | — | — | false |
| g2u08.gi.past-time-markers.mp.001 | matching-pairs | Match the opener with what came after. [en] | — | — | — | First, the cable broke. ↔ Then, Benson was lost in space. ; Half an hour ago, we heard a noise. ↔ After that, we saw a UFO. ; One day, an alien came to Earth. ↔ Finally, it took Benson back to Earth. ; In 2013, there was a big investigation. ↔ Then, the experts studied the photograph. | — | false |
| g2u08.gi.past-time-markers.sb.001 | sentence-building | Then / he / ran / outside [en] | Then he ran outside. (full) ; Then he ran outside (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.sb.002 | sentence-building | After that, / an / alien / came / out [en] | After that, an alien came out. (full) ; After that, an alien came out (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.sb.003 | sentence-building | Last night, / a / UFO / landed [en] | Last night, a UFO landed. (full) ; Last night, a UFO landed (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.tf.001 | transformation | Put in order: 'We saw a light. A spaceship landed.' (First … Then …) [en] | First, we saw a light. Then, a spaceship landed. (full) ; First we saw a light. Then a spaceship landed. (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.tf.002 | transformation | We went to the space centre. We see a statue. (make it past and join: First … Then …) [en] | First, we went to the space centre. Then, we saw a statue. (full) ; First we went to the space centre. Then we saw a statue. (full) | — | — | — | — | true |
| g2u08.gi.past-time-markers.tf.003 | transformation | A spaceship landed in our garden last night. (begin with the time) [en] | Last night, a spaceship landed in our garden. (full) | — | — | — | — | false |
| g2u08.gi.past-time-markers.tr.001 | translation | Letzte Nacht landete ein Raumschiff in unserem Garten. [de] | Last night, a spaceship landed in our garden. (full) ; Last night a spaceship landed in our garden. (full) ; Last night, a spaceship landed in our garden (full) | deToEn | — | — | — | false |
| g2u08.gi.past-time-markers.tr.002 | translation | Dann ging er zum Raumfahrtzentrum. [de] | Then he went to the space centre. (full) ; Then, he went to the space centre. (full) ; Then he went to the space centre (full) | deToEn | — | — | — | true |

## Output contract

Write `content/corpus/units/g2-u08/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u08",
  "lens": "answers",
  "itemsHash": "60f1cbb5b841",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 62, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
