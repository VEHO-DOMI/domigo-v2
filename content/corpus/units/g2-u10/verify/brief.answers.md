# Verify lens — answers — g2-u10 (round 2)

<!-- domigo:verify answers g2-u10 items=4a29b0e5ca4a prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (22)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u10.w.auntie | auntie | your mum's or dad's sister. | My ___ arrived first and she had a big present for me. | auntie (full) ; aunty (partial) ; aunt (partial) | auntie (full) ; aunty (partial) ; aunties (partial) | uncle ; grandma ; grandpa |
| g2u10.w.calm | calm | not nervous and not scared; you stay nice and still. | It's difficult for me to stay ___ when so many people are here. | calm (full) | calm (full) | nervous ; angry ; scared |
| g2u10.w.divorced | divorced | when a mum and dad are not a family any more, and the dad lives in a new place. | Rick's parents are ___ and he lives with his mum. | divorced (full) | divorced (full) | calm ; proud ; ugly |
| g2u10.w.fault | fault | when a bad thing happens because of you. | It's not my ___! I did nothing bad. | fault (full) | fault (full) ; faults (partial) | virus ; tool ; file |
| g2u10.w.file | file | a place on your tablet where you keep your work. | I keep my homework in this ___ and open it on my tablet. | file (full) | file (full) ; files (partial) | tool ; virus ; fault |
| g2u10.w.foreign-language | foreign language | English or French for you, if you speak German at school and with your family. | She doesn't speak a ___; she just speaks German. | foreign language (full) | foreign language (full) ; foreign languages (partial) | sense of humour ; virus ; tractor |
| g2u10.w.girlfriend | girlfriend | a girl or woman that a boy or man loves. | My dad has a new ___ and she is very nice. | girlfriend (full) | girlfriend (full) ; girlfriends (partial) | boyfriend ; sister ; aunt |
| g2u10.w.hopefully | hopefully | you want a good thing to happen tomorrow. | ___ it is sunny tomorrow, so we can play outside. | hopefully (full) | hopefully (full) | honestly ; actually ; completely |
| g2u10.w.ice-skating | ice skating | you do this on skates when it is very cold. | I don't like ___, because I always fall down. | ice skating (full) | ice skating (full) | tool ; tractor ; fault |
| g2u10.w.public | public | open for all the people, not just for you. | A library is a ___ place — anyone can go in. | public (full) | public (full) | calm ; ugly ; divorced |
| g2u10.w.sense-of-humour | sense of humour | when you can be funny and make people laugh. | My dad is so funny. He has a great ___. | sense of humour (full) ; sense of humor (partial) | sense of humour (full) ; sense of humor (partial) | virus ; file ; fault |
| g2u10.w.to-be-proud-of | to be proud of | to be very happy about what you or your family did. | I am very ___ myself for my good work today. | proud of (full) | to be proud of (full) ; be proud of (full) ; proud of (full) ; proud (partial) | scared ; calm ; nervous |
| g2u10.w.to-be-related-to | to be related to | to be in one family with people like your aunt and uncle. | Talk about the people in your family and how they are ___ you. | related to (full) ; related (partial) | to be related to (full) ; be related to (full) ; related to (full) ; related (partial) | proud of ; divorced ; public |
| g2u10.w.to-breathe | to breathe | you do this with your nose and mouth all day, in and out. | When you run very fast, it is difficult to ___. | breathe (full) | to breathe (full) ; breathe (full) ; breathes (partial) ; breathed (partial) | burn ; panic ; delete |
| g2u10.w.to-burn | to burn | when fire makes a thing hot and black. | Be careful with the fire — you can ___ your fingers! | burn (full) | to burn (full) ; burn (full) ; burns (partial) ; burned (partial) ; burnt (partial) | breathe ; delete ; panic |
| g2u10.w.to-delete | to delete | to make a file go away on your tablet, so it is not there any more. | Don't ___ my homework — I need it! | delete (full) | to delete (full) ; delete (full) ; deletes (partial) ; deleted (partial) | print out ; breathe ; burn |
| g2u10.w.to-panic | to panic | to be so scared that you do not stay calm. | Stay calm and don't ___! I am here to help you. | panic (full) | to panic (full) ; panic (full) ; panics (partial) ; panicked (partial) | breathe ; burn ; delete |
| g2u10.w.to-print-out | to print out | to make your work come out of the tablet so you can hold it and read it. | Can you ___ this story for me, so I can read it on my desk? | print out (full) | to print out (full) ; print out (full) ; prints out (partial) ; printed out (partial) | delete ; breathe ; burn |
| g2u10.w.tool | tool | a thing like a hammer; you hold it to make or open a box. | I need a ___ to make this chair. A hammer is one. | tool (full) | tool (full) ; tools (partial) | tractor ; virus ; file |
| g2u10.w.tractor | tractor | a big machine a farmer uses to work in the fields. | The farmer has a big ___ on his farm. | tractor (full) | tractor (full) ; tractors (partial) | tool ; virus ; file |
| g2u10.w.ugly | ugly | not nice to look at. | Your hat's so ___! I really don't like it. | ugly (full) | ugly (full) | pretty ; beautiful ; nice |
| g2u10.w.virus | virus | a very small living thing that can make you sick. | I'm not well today. I've got this ___ and I must stay in bed. | virus (full) | virus (full) ; viruses (partial) | file ; tool ; fault |

## Grammar items (45)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u10.gi.like-ing.ag.001 | anagram | tanzen, mit -ing [de] | dancing (full) | — | — | — | — | false |
| g2u10.gi.like-ing.ag.002 | anagram | Das macht jemand gern, der in der Küche Essen zubereitet (mit -ing). [de] | cooking (full) | — | — | — | — | false |
| g2u10.gi.like-ing.cp.001 | context-picker | Your dad never enjoys running when it is cold. [en] | My dad doesn't like running. (full) | — | My dad doesn't like run. ; My dad doesn't likes running. ; My dad don't like running. | — | — | false |
| g2u10.gi.like-ing.ec.001 | error-correction | I like read in bed. [en] | I like reading in bed. (full) ; reading (partial) | — | — | — | — | true |
| g2u10.gi.like-ing.ec.002 | error-correction | He like playing computer games. [en] | He likes playing computer games. (full) ; likes (partial) | — | — | — | — | true |
| g2u10.gi.like-ing.ec.003 | error-correction | She likes to cooking pasta. [en] | She likes cooking pasta. (full) ; cooking (partial) | — | — | — | — | true |
| g2u10.gi.like-ing.ff.001 | free-form | Tell your new pen friend about one thing you like doing in your free time. [en] | I like reading. (full) ; I like playing computer games. (full) ; I like cooking. (partial) | — | — | — | — | false |
| g2u10.gi.like-ing.gf.001 | gap-fill | I like ___ books before bedtime. [en, 1 blank(s)] | reading (full) | — | — | — | — | false |
| g2u10.gi.like-ing.gf.002 | gap-fill | She likes ___ in the kitchen. [en, 1 blank(s)] | cooking (full) | — | — | — | — | false |
| g2u10.gi.like-ing.gf.003 | gap-fill | My uncle likes ___ pictures of the mountains. [en, 1 blank(s)] | painting (full) | — | — | — | — | false |
| g2u10.gi.like-ing.gf.004 | gap-fill | We don't like ___ early at the weekend. [en, 1 blank(s)] | getting up (full) | — | — | — | — | false |
| g2u10.gi.like-ing.gf.005 | gap-fill | My grandpa likes ___ a fire and ___ it. [en, 2 blank(s)] | making \| watching (full) | — | — | — | — | false |
| g2u10.gi.like-ing.mc.001 | multiple-choice | Lucy loves music. [en] | Lucy likes dancing. (full) | — | Lucy likes dance. ; Lucy like dancing. ; Lucy likes to dancing. | — | — | false |
| g2u10.gi.like-ing.mc.002 | multiple-choice | You want to ask a friend about cooking. [en] | Do you like cooking? (full) | — | Do you like cook? ; Does you like cooking? ; Do you likes cooking? | — | — | false |
| g2u10.gi.like-ing.mc.003 | multiple-choice | A friend asks about your free time. [en] | I like playing computer games. (full) | — | I like play computer games. ; I like to playing computer games. ; I am like playing computer games. | — | — | false |
| g2u10.gi.like-ing.mp.001 | matching-pairs | Free time fun. [en] | — | — | — | I like cooking ↔ in the kitchen. ; She likes reading ↔ with a good book. ; He likes painting ↔ with his pictures. ; We like dancing ↔ to the music. | — | false |
| g2u10.gi.like-ing.mt.001 | matching | What they like doing. [en] | — | — | — | I ↔ like reading. ; She ↔ likes cooking. ; We don't ↔ like dancing. ; Does he ↔ like painting? | — | false |
| g2u10.gi.like-ing.qf.001 | question-formation | they / like / play computer games [en] | Do they like playing computer games? (full) | — | — | — | — | false |
| g2u10.gi.like-ing.sb.001 | sentence-building | she / likes / her / reading / books [en] | She likes reading her books. (full) | — | — | — | — | false |
| g2u10.gi.like-ing.sb.002 | sentence-building | doesn't / he / like / up / washing [en] | He doesn't like washing up. (full) | — | — | — | — | false |
| g2u10.gi.like-ing.tf.001 | transformation | I / like / paint pictures → [en] | I like painting pictures. (full) | — | — | — | — | false |
| g2u10.gi.like-ing.tf.003 | transformation | He ___ (not like / watch) the news. [en, 1 blank(s)] | He doesn't like watching the news. (full) ; He does not like watching the news. (full) ; doesn't like watching (partial) ; does not like watching (partial) | — | — | — | — | true |
| g2u10.gi.like-ing.tr.001 | translation | Ich spiele gern Gitarre. [de] | I like playing the guitar. (full) ; I like playing guitar. (partial) | deToEn | — | — | — | false |
| g2u10.gi.like-ing.tr.002 | translation | Meine Schwester kocht nicht gern. [de] | My sister doesn't like cooking. (full) ; My sister does not like cooking. (full) | deToEn | — | — | — | false |
| g2u10.gi.must.ag.001 | anagram | nicht dürfen (kurz, mit Apostroph) [de] | mustn't (full) | — | — | — | — | false |
| g2u10.gi.must.cp.001 | context-picker | At the camp you all wear a hard hat. [en] | You must wear a hard hat. (full) | — | You mustn't wear a hard hat. ; You don't have to wear a hard hat. ; You must to wear a hard hat. | — | — | false |
| g2u10.gi.must.ec.001 | error-correction | You must to wear a life jacket in the canoe. [en] | You must wear a life jacket in the canoe. (full) ; must wear (partial) | — | — | — | — | true |
| g2u10.gi.must.ec.002 | error-correction | You don't must open the cage. [en] | You mustn't open the cage. (full) ; You must not open the cage. (full) ; mustn't (partial) | — | — | — | — | true |
| g2u10.gi.must.ec.003 | error-correction | She musts clean the kitchen after dinner. [en] | She must clean the kitchen after dinner. (full) ; must clean (partial) | — | — | — | — | true |
| g2u10.gi.must.ec.004 | error-correction | It's the weekend. We mustn't go to school. [en] | We don't have to go to school. (full) ; We do not have to go to school. (full) ; don't have to (partial) | — | — | — | — | true |
| g2u10.gi.must.ff.002 | free-form | A family lives on a spaceship. Write one rule with mustn't for them. [en] | You mustn't open the door. (full) ; You mustn't touch the tools. (full) ; You mustn't go in there. (partial) | — | — | — | — | false |
| g2u10.gi.must.gf.001 | gap-fill | You ___ do your homework before you play outside. [en, 1 blank(s)] | must (full) | — | — | — | — | false |
| g2u10.gi.must.gf.002 | gap-fill | You ___ delete the file. Dad needs it! [en, 1 blank(s)] | mustn't (full) ; must not (full) | — | — | — | — | false |
| g2u10.gi.must.gf.003 | gap-fill | She ___ wear a cycle helmet at the adventure camp. [en, 1 blank(s)] | must (full) | — | — | — | — | false |
| g2u10.gi.must.gf.004 | gap-fill | You ___ touch the tools at the adventure camp. It is dangerous. [en, 1 blank(s)] | mustn't (full) ; must not (full) | — | — | — | — | false |
| g2u10.gi.must.gf.006 | gap-fill | In the museum you ___ run, but you ___ stay with the guide all the time. [en, 2 blank(s)] | mustn't \| must (full) ; must not \| must (full) | — | — | — | — | true |
| g2u10.gi.must.gs.001 | group-sort | Must, mustn't or not? [en] | — | — | — | — | must: You must close the door., You must clean the kitchen. \| mustn't: You mustn't climb that tree., You mustn't tell a lie. \| don't have to: You don't have to wear school shoes., You don't have to print out the file. | false |
| g2u10.gi.must.mc.001 | multiple-choice | You are in the museum and you want to run. [en] | You mustn't run in the museum. (full) | — | You don't have to run in the museum. ; You don't must run in the museum. ; You must run in the museum. | — | — | false |
| g2u10.gi.must.mc.002 | multiple-choice | It is Saturday and there is no school. [en] | We don't have to get up early today. (full) | — | We mustn't get up early today. ; We must get up early today. ; We don't must get up early today. | — | — | false |
| g2u10.gi.must.mt.001 | matching | What you must and mustn't do. [en] | — | — | — | It is the weekend. ↔ You don't have to get up early. ; The kitchen is dirty. ↔ You must clean it. ; The teacher is talking. ↔ You mustn't talk. ; The cage is open. ↔ You must close it. | — | false |
| g2u10.gi.must.sb.001 | sentence-building | mustn't / the / you / delete / file [en] | You mustn't delete the file. (full) | — | — | — | — | false |
| g2u10.gi.must.tf.001 | transformation | She ___ (clean) the kitchen. [en, 1 blank(s)] | She must clean the kitchen. (full) ; must clean the kitchen (partial) | — | — | — | — | true |
| g2u10.gi.must.tf.002 | transformation | It is a rule at the camp. You ___ (touch) the tools here. [en, 1 blank(s)] | You mustn't touch the tools here. (full) ; You must not touch the tools here. (full) ; mustn't touch (partial) | — | — | — | — | true |
| g2u10.gi.must.tr.001 | translation | Du musst ruhig bleiben. [de] | You must stay calm. (full) ; You have to stay calm. (partial) | deToEn | — | — | — | false |
| g2u10.gi.must.tr.002 | translation | Du darfst hier nicht laufen. [de] | You mustn't run here. (full) ; You must not run here. (full) | deToEn | — | — | — | true |

## Output contract

Write `content/corpus/units/g2-u10/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u10",
  "lens": "answers",
  "itemsHash": "4a29b0e5ca4a",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 67, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
