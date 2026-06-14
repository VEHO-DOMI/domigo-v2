# Verify lens — answers — g1-u05 (round 1)

<!-- domigo:verify answers g1-u05 items=a49a2dd842a9 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (44)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u05.w.boyfriend | boyfriend | a boy who is more than a friend to a girl | Jack is her ___. | boyfriend (full) | boyfriend (full) | sister ; uncle ; teacher |
| g1u05.w.can | can | you drink from this small thing | Look, he carries fifteen ___. | cans (full) | can (full) ; tin (partial) | bottle ; box ; table |
| g1u05.w.can-cannot-can-t | can, cannot / can't | to be able to do a thing | Pete ___ play the guitar, but he can carry it. | can't (full) ; cannot (full) | can (full) | must ; to play ; to drink |
| g1u05.w.concert | concert | a big show where people play music | Let's go to the ___ tomorrow. | concert (full) | concert (full) | job ; hospital ; table |
| g1u05.w.don-t-worry | Don't worry. | all is OK; a friend is not scared. | Don't be scared. ___ It is all OK. | Don't worry. (full) ; Don't worry (full) | Don't worry. (full) ; Don't worry (full) | Sorry? ; Is that so? ; This is me. |
| g1u05.w.drummer | drummer | the player of the drums | Jessica plays the drums. She is the ___. | drummer (full) | drummer (full) | singer ; keyboard player ; guitarist |
| g1u05.w.drums | drums | You play this and hit it with two sticks. | Jessica plays the ___ with two sticks. | drums (full) | drums (full) | guitar ; keyboard ; saxophone |
| g1u05.w.economy | economy | the world of money and work | The ___ is the world of money. | economy (full) | economy (full) | hospital ; concert ; table |
| g1u05.w.guitar | guitar | a long thing you play with your fingers | Dan and Steve play the ___. | guitar (full) | guitar (full) | drums ; keyboard ; saxophone |
| g1u05.w.guitarist | guitarist | the player of the guitar | Dan plays the guitar. He is a ___. | guitarist (full) | guitarist (full) ; guitar player (partial) | drummer ; singer ; keyboard player |
| g1u05.w.hospital | hospital | you go here when you are very ill | Grandma is very ill, so she is in the ___. | hospital (full) | hospital (full) | concert ; table ; economy |
| g1u05.w.hundred | hundred | the number 100 | There are one ___ children in our school. | hundred (full) | hundred (full) | ten ; two ; five |
| g1u05.w.in-one-go | in one go | all at one time, you do not stop | Can you drink five cans ___? | in one go (full) | in one go (full) | tomorrow ; today ; here |
| g1u05.w.is-that-so | Is that so? | you ask this when you do not believe a thing | I can drink ten bottles! — ___ | Is that so? (full) | Is that so? (full) | Sorry? ; This is me. ; Don't worry. |
| g1u05.w.its | its | for a thing or an animal, not a boy or girl | The dog can wiggle ___ ears. | its (full) | its (full) | his ; her ; their |
| g1u05.w.job | job | work that you do for money | She has a good ___ at the hospital. | job (full) | job (full) | concert ; table ; hospital |
| g1u05.w.keyboard | keyboard | You sit down and play this big thing with your fingers. | Ellie plays the ___ with her fingers. | keyboard (full) | keyboard (full) | guitar ; drums ; saxophone |
| g1u05.w.keyboard-player | keyboard player | the one in the band who plays the keys | Ellie is the ___. She plays the keyboard. | keyboard player (full) | keyboard player (full) | drummer ; singer ; guitarist |
| g1u05.w.money | (pocket) money | the euros your mum and uncle give you | My mum gives me ___ every week. | money (full) ; pocket money (partial) | money (full) ; pocket money (full) | profit ; pound ; job |
| g1u05.w.nothing | nothing | not one thing, zero | There's ___ in the garden. | nothing (full) | nothing (full) | more ; here ; again |
| g1u05.w.perfect | perfect | very very good, the best it can be | The job is ___ for you! | perfect (full) | perfect (full) | happy ; tired ; scared |
| g1u05.w.pound | pound | the money in England | In England, a book is ten ___. | pounds (full) | pound (full) ; pounds (full) | profit ; money ; concert |
| g1u05.w.profit | profit | the money you have after you sell a thing | It's 120 pounds. That's my ___. | profit (full) | profit (full) | money ; pound ; job |
| g1u05.w.saxophone | saxophone | You play this long thing with your mouth. | Jack plays the ___ with his mouth. | saxophone (full) | saxophone (full) | guitar ; drums ; keyboard |
| g1u05.w.saxophone-player | saxophone player | the one in the band who plays a long gold thing | Jack plays the saxophone. He is the ___. | saxophone player (full) | saxophone player (full) | drummer ; singer ; guitarist |
| g1u05.w.school-canteen | school canteen | the room where you eat at lunchtime | We eat our lunch in the ___ at school. | school canteen (full) | school canteen (full) ; canteen (partial) | hospital ; concert ; table |
| g1u05.w.singer | singer | This is the one who uses a mouth, not the guitar or drums. | James is the ___. He uses his mouth, not a guitar. | singer (full) | singer (full) | drummer ; guitarist ; keyboard player |
| g1u05.w.sister | sister | a girl in your family who is not your mum | Jessica is my ___. | sister (full) | sister (full) | uncle ; teacher ; boyfriend |
| g1u05.w.sorry | Sorry? | you ask this when you do not understand and want it again | ___ I don't understand. Can you do it again? | Sorry? (full) | Sorry? (full) | Is that so? ; This is me. ; Don't worry. |
| g1u05.w.table | table | a thing with four legs, you put plates on it to eat | I put a ___ in our playground. | table (full) | table (full) | chair ; bottle ; box |
| g1u05.w.teacher | teacher | this man or woman gives you homework at school | Mr Davis is my ___ at school. | teacher (full) | teacher (full) | uncle ; sister ; boyfriend |
| g1u05.w.this-is-me | This is me. | you show who you are in a picture | Look at my photo from school. ___ | This is me. (full) | This is me. (full) | Is that so? ; Sorry? ; Don't worry. |
| g1u05.w.to-carry | to carry | to hold a thing and go with it | Can you ___ my guitar? It is very big. | carry (full) | carry (full) ; to carry (full) | touch ; wash ; drink |
| g1u05.w.to-dance | to dance | You do this to music with your feet. | Let's ___ to the music! | dance (full) | dance (full) ; to dance (full) | eat ; wash ; carry |
| g1u05.w.to-drink | to drink | you do this with a cup of water in your mouth | I can't ___ fifteen cans. | drink (full) | drink (full) ; to drink (full) | eat ; wash ; carry |
| g1u05.w.to-laugh | to laugh | you do this when a thing is very funny: ha ha ha | The clown is funny and we all ___. | laugh (full) | laugh (full) ; to laugh (full) | eat ; wash ; drink |
| g1u05.w.to-play | to play | to do this with a guitar, or to have fun with a toy | Can you ___ the guitar? | play (full) | play (full) ; to play (full) | eat ; wash ; carry |
| g1u05.w.to-stand-on | to stand on | to be up on a thing with your feet | Look! Pete can ___ his head. | stand on (full) | stand on (full) ; to stand on (full) | walk on ; touch ; carry |
| g1u05.w.to-touch | to touch | to put your fingers on a thing | Please don't ___ my guitar. | touch (full) | touch (full) ; to touch (full) | carry ; wash ; drink |
| g1u05.w.to-walk-on | to walk on | to go on your feet over a thing | Can you ___ your hands? | walk on (full) | walk on (full) ; to walk on (full) | stand on ; touch ; carry |
| g1u05.w.to-wash | to wash | to make a thing clean with water | I ___ my mum's car with water. | wash (full) | wash (full) ; to wash (full) | clean ; carry ; touch |
| g1u05.w.to-wiggle | to wiggle | to move a thing fast, here and there, again and again | He can ___ his ears up and down. | wiggle (full) | wiggle (full) ; to wiggle (full) | touch ; carry ; walk on |
| g1u05.w.tongue | tongue | the thing in your mouth; you speak with it. | He can touch his nose with his ___. | tongue (full) | tongue (full) | nose ; ear ; eye |
| g1u05.w.uncle | uncle | the brother of your mum or your dad | My ___ is my mum's brother. | uncle (full) | uncle (full) | sister ; teacher ; boyfriend |

## Grammar items (50)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u05.gi.can.cp.001 | context-picker | Du erzählst, dass Ellie nicht tanzen kann. Welcher Satz ist richtig? [de] | She can't dance. (full) | — | She doesn't can dance. ; She can't dances. ; She no can dance. | — | — | false |
| g1u05.gi.can.cp.003 | context-picker | Du möchtest wissen, ob Pete singen kann. Was ist richtig? [de] | Can you play the guitar? (full) | — | Do you can play the guitar? ; Can you plays the guitar? ; You can play the guitar? | — | — | false |
| g1u05.gi.can.ec.001 | error-correction | Finde und verbessere den Fehler: He cans wiggle his ears. [de] | He can wiggle his ears. (full) ; can (partial) | — | — | — | — | true |
| g1u05.gi.can.ec.002 | error-correction | Finde und verbessere den Fehler: I can to speak English. [de] | I can speak English. (full) ; can speak (partial) | — | — | — | — | false |
| g1u05.gi.can.ec.003 | error-correction | Finde und verbessere den Fehler: She don't can play the drums. [de] | She can't play the drums. (full) ; She cannot play the drums. (full) ; can't (partial) ; cannot (partial) | — | — | — | — | true |
| g1u05.gi.can.ff.001 | free-form | Dein Freund fragt: "Can you play the guitar?" Du kannst es. Antworte mit einem ganzen Satz. [de] | Yes, I can. (full) ; Yes, I can play the guitar. (full) ; I can play the guitar. (partial) | — | — | — | — | false |
| g1u05.gi.can.gf.001 | gap-fill | James ___ play the guitar. [en, 1 blank(s)] | can (full) | — | — | — | — | true |
| g1u05.gi.can.gf.002 | gap-fill | The dog ___ dance. It can sit down. (–) [en, 1 blank(s)] | can't (full) ; cannot (full) | — | — | — | — | true |
| g1u05.gi.can.gf.003 | gap-fill | She ___ (can / play) the drums very well. [en, 1 blank(s)] | can play (full) | — | — | — | — | false |
| g1u05.gi.can.gf.004 | gap-fill | Pete ___ (not / can / carry) the guitar. It's too big! (–) [en, 1 blank(s)] | can't carry (full) ; cannot carry (full) | — | — | — | — | false |
| g1u05.gi.can.gf.005 | gap-fill | Dan ___ (can / play) the guitar, but he ___ (not / can / dance). (+/–) [en, 2 blank(s)] | can play \| can't dance (full) ; can play \| cannot dance (full) | — | — | — | — | true |
| g1u05.gi.can.gf.006 | gap-fill | ___ your sister ___ (can / play) the keyboard? (?) [en, 2 blank(s)] | Can \| play (full) | — | — | — | — | false |
| g1u05.gi.can.gs.002 | group-sort | Was kann ich, was kann ich nicht? Sortiere die Sätze. [de] | — | — | — | — | I can: play the guitar, wiggle my ears, speak English, walk on my feet \| I can't: carry the drums, touch my nose with my tongue | false |
| g1u05.gi.can.mc.001 | multiple-choice | She ___ play the keyboard. [en, 1 blank(s)] | can (full) | — | cans ; can to ; is can | — | — | false |
| g1u05.gi.can.mc.002 | multiple-choice | He ___ play the saxophone. [en, 1 blank(s)] | can (full) | — | cans ; can to ; doesn't can | — | — | false |
| g1u05.gi.can.mc.003 | multiple-choice | ___ they play the drums? (?) [en, 1 blank(s)] | Can (full) | — | Do ; Are ; Can't | — | — | false |
| g1u05.gi.can.mp.001 | matching-pairs | Welche Sätze bedeuten das Gegenteil? [de] | — | — | — | I can dance. ↔ I can't dance. ; She can play the guitar. ↔ She can't play the guitar. ; He can wiggle his ears. ↔ He can't wiggle his ears. ; They can carry the drums. ↔ They can't carry the drums. | — | false |
| g1u05.gi.can.mt.002 | matching | Was passt zusammen? [de] | — | — | — | Can you play the guitar? ↔ Yes, I can. ; Can Bacon dance? ↔ No, he can't. ; Can Dan and Steve play the drums? ↔ Yes, they can. ; Can Ellie carry the saxophone? ↔ No, she can't. | — | false |
| g1u05.gi.can.qf.001 | question-formation | you / play / the saxophone [en] | Can you play the saxophone? (full) | — | — | — | — | false |
| g1u05.gi.can.sb.001 | sentence-building | play / she / the drums / can [en] | She can play the drums. (full) | — | — | — | — | false |
| g1u05.gi.can.sb.002 | sentence-building | wiggle / can't / his ears / he [en] | He can't wiggle his ears. (full) | — | — | — | — | false |
| g1u05.gi.can.tf.001 | transformation | I can dance. → I ___. (–) [en, 1 blank(s)] | can't dance (full) ; cannot dance (full) ; I can't dance. (partial) ; I cannot dance. (partial) | — | — | — | — | true |
| g1u05.gi.can.tf.002 | transformation | Steve can play the guitar. → ___ Steve ___ the guitar? (?) [en, 2 blank(s)] | Can \| play (full) ; Can Steve play the guitar? (partial) | — | — | — | — | false |
| g1u05.gi.can.tr.001 | translation | Meine Schwester kann Schlagzeug spielen. [de] | My sister can play the drums. (full) | deToEn | — | — | — | false |
| g1u05.gi.can.tr.002 | translation | Kannst du Keyboard spielen? [de] | Can you play the keyboard? (full) | deToEn | — | — | — | false |
| g1u05.gi.possessives.ag.001 | anagram | Wem gehört es? Bilde das Wort für „ihr" (mehrere Personen). Es beginnt mit t und gehört zu they. [de] | their (full) | — | — | — | — | false |
| g1u05.gi.possessives.cp.001 | context-picker | Ellie plays the keyboard. [en] | Her keyboard is great. (full) | — | She keyboard is great. ; His keyboard is great. ; Their keyboard is great. | — | — | false |
| g1u05.gi.possessives.ec.002 | error-correction | The dog can wiggle it's ears. [en] | The dog can wiggle its ears. (full) ; its (partial) | — | — | — | — | true |
| g1u05.gi.possessives.ec.003 | error-correction | We love we teacher very much. [en] | We love our teacher very much. (full) ; our (partial) | — | — | — | — | false |
| g1u05.gi.possessives.ec.004 | error-correction | Dan and Steve love they dog Bacon. [en] | Dan and Steve love their dog Bacon. (full) ; their (partial) | — | — | — | — | false |
| g1u05.gi.possessives.ec.005 | error-correction | She loves he dog very much. [en] | She loves his dog very much. (full) ; his (partial) ; She loves her dog very much. (full) | — | — | — | — | false |
| g1u05.gi.possessives.gf.001 | gap-fill | James loves ___ (he) saxophone. [en, 1 blank(s)] | his (full) | — | he ; him ; her | — | — | false |
| g1u05.gi.possessives.gf.002 | gap-fill | Ellie loves ___ (she) keyboard. [en, 1 blank(s)] | her (full) | — | she ; his ; their | — | — | false |
| g1u05.gi.possessives.gf.003 | gap-fill | We love ___ (we) school. [en, 1 blank(s)] | our (full) | — | we ; us ; their | — | — | false |
| g1u05.gi.possessives.gf.004 | gap-fill | Dan and Steve play ___ (they) guitars at the concert. [en, 1 blank(s)] | their (full) | — | they ; them ; there | — | — | false |
| g1u05.gi.possessives.gf.005 | gap-fill | Look at Bacon. ___ ears are very big. [en, 1 blank(s)] | Its (full) | — | It's ; His ; Their | — | — | true |
| g1u05.gi.possessives.gf.006 | gap-fill | This is ___ (I) sister Jessica. [en, 1 blank(s)] | my (full) | — | I ; me ; your | — | — | false |
| g1u05.gi.possessives.gf.007 | gap-fill | Tom plays the drums and Ellie plays the keyboard. ___ (he) drums are big and ___ (she) keyboard is great. [en, 2 blank(s)] | His \| her (full) | — | — | — | — | false |
| g1u05.gi.possessives.gs.003 | group-sort | Sortiere die Wörter. [de] | — | — | — | — | She plays.: I, he, we, they \| Her guitar.: my, his, our, their | false |
| g1u05.gi.possessives.mc.001 | multiple-choice | Jessica is the drummer. ___ drums are big. [en, 1 blank(s)] | Her (full) | — | She ; His ; Their | — | — | false |
| g1u05.gi.possessives.mc.002 | multiple-choice | Dan and Steve are here. ___ guitars are great. [en, 1 blank(s)] | Their (full) | — | They ; There ; His | — | — | false |
| g1u05.gi.possessives.mc.003 | multiple-choice | This is James. ___ saxophone is here. [en, 1 blank(s)] | His (full) | — | He ; Him ; Her | — | — | false |
| g1u05.gi.possessives.mp.002 | matching-pairs | Finde die Paare. [de] | — | — | — | I ↔ my ; you ↔ your ; he ↔ his ; she ↔ her ; it ↔ its ; we ↔ our | — | false |
| g1u05.gi.possessives.mt.002 | matching | Welche Wörter passen zusammen? [de] | — | — | — | I ↔ my ; he ↔ his ; she ↔ her ; we ↔ our ; they ↔ their | — | false |
| g1u05.gi.possessives.sb.001 | sentence-building | is / her / This / saxophone [en] | This is her saxophone. (full) | — | — | — | — | false |
| g1u05.gi.possessives.sb.002 | sentence-building | are / great / Dan / guitars / their / and / Steve [en] | Dan and Steve guitars are great. (partial) ; Dan and Steve, their guitars are great. (full) | — | — | — | — | false |
| g1u05.gi.possessives.tf.001 | transformation | This guitar is Ellie's. → It is ___ guitar. [en, 1 blank(s)] | her (full) ; It is her guitar. (full) | — | — | — | — | false |
| g1u05.gi.possessives.tf.002 | transformation | The guitars are for Dan and me. → They are ___ guitars. [en, 1 blank(s)] | our (full) ; They are our guitars. (full) | — | — | — | — | false |
| g1u05.gi.possessives.tr.001 | translation | Das ist meine Schwester. [de] | This is my sister. (full) ; That is my sister. (partial) | deToEn | — | — | — | false |
| g1u05.gi.possessives.tr.004 | translation | Ihr Hund ist Bacon. [de] | Their dog is Bacon. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u05/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u05",
  "lens": "answers",
  "itemsHash": "a49a2dd842a9",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 94, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
