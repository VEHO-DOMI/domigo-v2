# Verify lens — answers — g1-u04 (round 1)

<!-- domigo:verify answers g1-u04 items=22d315a2d185 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (61)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u04.w.a-day-in-the-life-of | a day in the life of | from morning to night for one boy or girl | The story is about ___ Richard. | a day in the life of (full) | a day in the life of (full) | no one else ; Are you OK? ; Oh dear! |
| g1u04.w.after | after | it is later in time, not before | ___ school I meet my friends. | after (full) | after (full) | into ; still ; early |
| g1u04.w.afternoon | afternoon | it is the time after lunchtime, before the evening | It's ___. It is not cold now. Richard is hot. | afternoon (full) | afternoon (full) | morning ; evening ; night |
| g1u04.w.angry | angry | you are very mad, not happy | No, no, no, Mike. Now Harry is ___. He isn't happy! | angry (full) ; mad (partial) | angry (full) ; mad (partial) | happy ; proud ; excited |
| g1u04.w.are-you-ok | Are you OK? | ask a friend this when they look sad, is everything fine | You look sad. ___ Why? | Are you OK (full) ; Are you OK? (full) | Are you OK (full) ; Are you OK? (full) | What's happening? ; Try it! ; Let go! |
| g1u04.w.bad | bad | it is not good | Thursday and Friday aren't ___. | bad (full) | bad (full) | happy ; proud ; excited |
| g1u04.w.be-yourself | Be yourself. | you want a friend to be who they are, not a new boy or girl | ___ and no one else. | Be yourself (full) ; Be yourself. (full) | Be yourself (full) ; Be yourself. (full) | Let go! ; Try it! ; Go away! |
| g1u04.w.because | because | you give the why for it with this | I'm happy ___ it's the weekend. | because (full) | because (full) | after ; still ; today |
| g1u04.w.birthday | birthday | it is your big day in the year, with a cake | Happy ___, David! | birthday (full) | birthday (full) | day ; end ; show |
| g1u04.w.bored | bored | you have no work and no fun to do, so the time is long | It's evening. Is Richard tired? No, he's ___. | bored (full) | bored (full) | excited ; happy ; hungry |
| g1u04.w.bottle | bottle | you can put water in it and drink from it | The feelings are in the magic ___. | bottle (full) | bottle (full) | room ; story ; show |
| g1u04.w.cold | cold | it is not hot | It is early morning. Richard is ___. | cold (full) | cold (full) | hot ; happy ; tired |
| g1u04.w.day | day | it has morning, afternoon and night in it; Monday is one | On the big ___, Mike is nervous. | day (full) | day (full) | night ; end ; story |
| g1u04.w.don-t-be-late | Don't be late. | you want a friend here on time, not after the time | Tomorrow's Monday – ___ | Don't be late (full) ; Don't be late. (full) | Don't be late (full) ; Don't be late. (full) | Be yourself. ; Let go! ; Try it! |
| g1u04.w.early | early | it is at the start of the day, when it is still morning | It's ___. He's still in bed. | early (full) | early (full) | today ; still ; after |
| g1u04.w.end | end | it is at the back of a story or a show, not at the start | At the ___ of the play, Mike is very happy. | end (full) | end (full) | day ; room ; story |
| g1u04.w.evening | evening | it is the time after the afternoon, before night | It's ___. Is Richard tired? No, he's bored. | evening (full) | evening (full) | morning ; afternoon ; night |
| g1u04.w.excited | excited | a good thing is here now and you want it now | Tomorrow is the school show. I'm in it! Mike is ___. | excited (full) | excited (full) | bored ; tired ; sad |
| g1u04.w.friday | Friday | it is the day before Saturday | Thursday, ___ – no more school! | Friday (full) | Friday (full) | Thursday ; Saturday ; Wednesday |
| g1u04.w.friend | friend | a boy or girl you like and play with | Tom is his ___. | friend (full) | friend (full) | story ; room ; day |
| g1u04.w.fun | fun | it is a thing you enjoy, not work | It's a lot of work, but it's ___. | fun (full) | fun (full) | story ; room ; show |
| g1u04.w.go-away | Go away! | you want a friend to go from here, not to be next to you | Please, ___! I don't want you here. | Go away (full) ; go away (full) | Go away (full) ; go away (full) | Try it! ; Let go! ; Be yourself. |
| g1u04.w.happy | happy | you are glad and not sad. | Mike is ___. He is not sad. | happy (full) | happy (full) | sad ; angry ; bored |
| g1u04.w.homework | homework (no pl) | it is school work you do for class, but not in class | We have got a big ___ for school today. | homework (full) | homework (full) | fun ; story ; room |
| g1u04.w.hot | hot | it is not cold | It's afternoon. Richard isn't cold now. He's ___! | hot (full) | hot (full) | cold ; bored ; sad |
| g1u04.w.hungry | hungry | you want to eat now | It's lunchtime. Richard isn't happy. He wants to eat. He's ___. | hungry (full) | hungry (full) | tired ; cold ; proud |
| g1u04.w.into | into | you go in, you do not go out | Go ___ the classroom! | into (full) | into (full) | after ; still ; early |
| g1u04.w.it-s-me | It's me. | a friend is at the door, and the one there is you. | Who is at the door? — ___ Open the door! | It's me (full) ; It's me. (full) | It's me (full) ; It's me. (full) | Try it! ; Let go! ; Go away! |
| g1u04.w.let-go | Let go! | you want a friend to open the hand and not hold your arm. | You are holding my arm too tight! ___ | Let go (full) ; Let go! (full) | Let go (full) ; Let go! (full) | Try it! ; Go away! ; Be yourself. |
| g1u04.w.life | life | all your time, from when you are small to when you are big | The story is about a day in the ___ of Richard. | life (full) | life (full) | day ; story ; end |
| g1u04.w.lunchtime | lunchtime | it is the time in the day when you eat | It's ___ and the children eat at school. | lunchtime (full) ; lunch time (partial) | lunchtime (full) ; lunch time (partial) | morning ; evening ; night |
| g1u04.w.mad | mad | you are very, very angry. | I am good, Bob is bad. I am nice, Bob is ___. | mad (full) ; angry (partial) | mad (full) ; angry (partial) | happy ; proud ; excited |
| g1u04.w.magic | magic | you find it in stories; it can do what is not for real | This is a ___ bottle. | magic (full) ; magical (partial) | magic (full) ; magical (partial) | bad ; cold ; hot |
| g1u04.w.monday | Monday | it is the day after the weekend, before Tuesday | The day after Sunday is ___. | Monday (full) | Monday (full) | Tuesday ; Sunday ; Wednesday |
| g1u04.w.morning | morning | it is the time of the day when you open your eyes in bed | It's early ___. Richard's cold. | morning (full) | morning (full) | evening ; night ; afternoon |
| g1u04.w.nervous | nervous | a big day is here and you can't be still | There are a lot of girls and boys here! Mike is ___. | nervous (full) | nervous (full) | proud ; happy ; cold |
| g1u04.w.night | night | it is the dark time when you go to bed | It's late at ___ and we are in bed. | night (full) | night (full) | morning ; afternoon ; lunchtime |
| g1u04.w.no-one-else | no one else | you, and not a boy or a girl is with you. | Be yourself and ___. | no one else (full) | no one else (full) | Go away! ; Try it! ; Let go! |
| g1u04.w.oh-dear | Oh dear! | a thing is bad, not good, and you are not happy | ___ Why? I'm not very happy. | Oh dear (full) ; Oh dear! (full) | Oh dear (full) ; Oh dear! (full) | Try it! ; Let go! ; Go away! |
| g1u04.w.proud | proud | you do good work and it is very good for you | Mum is very ___ of me today. | proud (full) | proud (full) | sad ; scared ; bored |
| g1u04.w.room | room | it has a door and a window; you go to bed in it | There's a dog in our ___. | room (full) | room (full) | story ; show ; day |
| g1u04.w.sad | sad | you are not happy; you want to cry. | No, no, no, Mike. Harry isn't happy now. He's ___! | sad (full) | sad (full) | happy ; excited ; proud |
| g1u04.w.saturday | Saturday | it is the day after Friday, with no school | ___ and Sunday – great! | Saturday (full) | Saturday (full) | Sunday ; Friday ; Monday |
| g1u04.w.scared | scared | a big dog can do this to you, so you don't want it here | We're very ___. There's a dog in our room. | scared (full) | scared (full) ; afraid (partial) | happy ; proud ; hot |
| g1u04.w.show | show | you go and look at it, with boys and girls in it at school | At the end of the ___, she's proud. | show (full) | show (full) | story ; room ; bottle |
| g1u04.w.still | still | it is now and it is not over, it goes on | It's early. He's ___ in bed. | still (full) | still (full) | today ; early ; after |
| g1u04.w.story | story | you read it or Mum tells it to you in bed | It's a ___ about a boy in a school play. | story (full) | story (full) | show ; room ; day |
| g1u04.w.sunday | Sunday | it is the day after Saturday, before Monday | Saturday and ___ – great! | Sunday (full) | Sunday (full) | Saturday ; Monday ; Friday |
| g1u04.w.thursday | Thursday | it is the day after Wednesday | ___, Friday – no more school! | Thursday (full) | Thursday (full) | Wednesday ; Friday ; Tuesday |
| g1u04.w.tired | tired | you want to go to bed and close your eyes | It's Monday. Gina is ___. | tired (full) | tired (full) | excited ; happy ; hot |
| g1u04.w.to-be-asleep | to be asleep | you are in bed and your eyes are not open | Richard is in bed. He's ___. | asleep (full) | be asleep (full) ; to be asleep (full) ; asleep (full) | to break ; to get back ; to happen |
| g1u04.w.to-break | to break | to put it into two or more, so it is not one | I must ___ the bottle. | break (full) | break (full) ; to break (full) | to happen ; to get back ; to go to sleep |
| g1u04.w.to-get-back | to get back | to have it with you one more time | I am Jill and I will ___ the feelings. | get back (full) | get back (full) ; to get back (full) | to break ; to happen ; to go to sleep |
| g1u04.w.to-go-to-sleep | to go to sleep | to close your eyes in bed at night | It's late. Go back to ___. | sleep (full) ; go to sleep (full) | go to sleep (full) ; to go to sleep (full) | to break ; to happen ; to get back |
| g1u04.w.to-happen | to happen | to go on, when you ask what is here now | What's ___? Is it OK? | happening (full) | happen (full) ; to happen (full) ; happening (full) | to break ; to get back ; to go to sleep |
| g1u04.w.today | today | it is this day, now, not tomorrow | It is not tomorrow; it is ___. | Today (full) ; today (full) | today (full) | tomorrow ; morning ; evening |
| g1u04.w.tomorrow | tomorrow | it is the day after today | It is not today. The day after today is ___. | Tomorrow (full) ; tomorrow (full) | tomorrow (full) | today ; morning ; night |
| g1u04.w.try-it | Try it! | you want a friend to do a new thing one time | This birthday cake is very good. ___ You will love it! | Try it (full) ; Try it! (full) | Try it (full) ; Try it! (full) | Let go! ; Go away! ; Be yourself. |
| g1u04.w.tuesday | Tuesday | it is the day after Monday | The day after Monday is ___. | Tuesday (full) | Tuesday (full) | Monday ; Wednesday ; Thursday |
| g1u04.w.wednesday | Wednesday | it is the day after Tuesday | Monday, Tuesday, ___ – no more school! | Wednesday (full) | Wednesday (full) | Tuesday ; Thursday ; Friday |
| g1u04.w.what-s-happening | What's happening? | you ask about a thing that is here now; you cannot look at it. | I can hear it. ___ Is it OK? | What's happening (full) ; What's happening? (full) ; What is happening? (full) | What's happening (full) ; What's happening? (full) ; What is happening? (full) | Try it! ; Let go! ; Go away! |

## Grammar items (44)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u04.gi.to-be-negative.ag.001 | anagram | Richard ist nicht glücklich, er ist … (das Gegenteil von happy) [de] | sad (full) | — | — | — | — | false |
| g1u04.gi.to-be-negative.cp.001 | context-picker | Du sprichst über Mike. Er ist nicht glücklich. Welcher Satz ist richtig? [de] | He isn't happy. (full) | — | He aren't happy. ; He not is happy. ; He doesn't happy. | — | — | false |
| g1u04.gi.to-be-negative.cp.002 | context-picker | Du sprichst über dich und deinen Freund. Ihr seid nicht müde. Welcher Satz ist richtig? [de] | We aren't tired. (full) | — | We isn't tired. ; We aren't tired not. ; We don't tired. | — | — | false |
| g1u04.gi.to-be-negative.ec.001 | error-correction | Finde und verbessere den Fehler: She aren't sad. [de] | She isn't sad. (full) ; isn't (partial) | — | — | — | — | true |
| g1u04.gi.to-be-negative.ec.002 | error-correction | Finde und verbessere den Fehler: They isn't hungry. [de] | They aren't hungry. (full) ; aren't (partial) | — | — | — | — | true |
| g1u04.gi.to-be-negative.ec.003 | error-correction | Finde und verbessere den Fehler: I amn't cold. [de] | I'm not cold. (full) ; I am not cold. (full) ; I'm not (partial) | — | — | — | — | true |
| g1u04.gi.to-be-negative.gf.007 | gap-fill | I ___ happy. I'm sad. (–) [de, 1 blank(s)] | am not (full) ; I'm not happy. (partial) | — | — | — | — | true |
| g1u04.gi.to-be-negative.gf.008 | gap-fill | He ___ cold. He's hot. (–) [de, 1 blank(s)] | isn't (full) ; is not (full) | — | — | — | — | true |
| g1u04.gi.to-be-negative.gf.009 | gap-fill | They ___ angry. They're happy. (–) [de, 1 blank(s)] | aren't (full) ; are not (full) | — | — | — | — | true |
| g1u04.gi.to-be-negative.gf.010 | gap-fill | Richard ___ happy. He's hungry. (–) [de, 1 blank(s)] | isn't (full) ; is not (full) | — | — | — | — | true |
| g1u04.gi.to-be-negative.gf.011 | gap-fill | We ___ hungry. We're hot. (–) [de, 1 blank(s)] | aren't (full) ; are not (full) | — | — | — | — | true |
| g1u04.gi.to-be-negative.gf.012 | gap-fill | Mike ___ happy. He's scared. The girls ___ scared. They're excited. (–) [de, 2 blank(s)] | isn't \| aren't (full) ; is not \| are not (full) | — | — | — | — | true |
| g1u04.gi.to-be-negative.gs.002 | group-sort | isn't oder aren't? Sortiere die Wörter. [de] | — | — | — | — | isn't: he, she, it \| aren't: you, we, they | false |
| g1u04.gi.to-be-negative.mc.001 | multiple-choice | She ___ sad. She's happy. [en, 1 blank(s)] | isn't (full) | — | aren't ; am not ; don't | — | — | true |
| g1u04.gi.to-be-negative.mc.002 | multiple-choice | The dogs ___ hungry. They're bored. [en, 1 blank(s)] | aren't (full) | — | isn't ; am not ; doesn't | — | — | true |
| g1u04.gi.to-be-negative.mc.003 | multiple-choice | I ___ nervous. I'm excited. [en, 1 blank(s)] | am not (full) | — | isn't ; aren't ; doesn't | — | — | true |
| g1u04.gi.to-be-negative.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | We aren't hungry. (full) | — | We isn't hungry. ; We not are hungry. ; We don't hungry. | — | — | false |
| g1u04.gi.to-be-negative.mp.001 | matching-pairs | Welche Sätze passen zusammen? [de] | — | — | — | I am happy. ↔ I'm not happy. ; He is cold. ↔ He isn't cold. ; We are hungry. ↔ We aren't hungry. ; They are angry. ↔ They aren't angry. | — | false |
| g1u04.gi.to-be-negative.mt.001 | matching | Was passt zusammen? [de] | — | — | — | Is he cold? ↔ No, he isn't. ; Are you hungry? ↔ No, I'm not. ; Are they happy? ↔ No, they aren't. ; Is she sad? ↔ No, she isn't sad. She's happy. | — | false |
| g1u04.gi.to-be-negative.sb.001 | sentence-building | isn't / He / cold / . [en] | He isn't cold. (full) | — | — | — | — | false |
| g1u04.gi.to-be-negative.sb.002 | sentence-building | aren't / We / hungry / . [en] | We aren't hungry. (full) | — | — | — | — | false |
| g1u04.gi.to-be-negative.tf.001 | transformation | He is cold. → He ___ cold. (–) [en, 1 blank(s)] | isn't (full) ; is not (full) ; He isn't cold. (partial) | — | — | — | — | true |
| g1u04.gi.to-be-negative.tf.002 | transformation | They are bored. → They ___ bored. (–) [en, 1 blank(s)] | aren't (full) ; are not (full) ; They aren't bored. (partial) | — | — | — | — | true |
| g1u04.gi.to-be-negative.tf.003 | transformation | I am hungry. → I ___ hungry. (–) [en, 1 blank(s)] | am not (full) ; I'm not hungry. (full) ; I am not hungry. (full) | — | — | — | — | true |
| g1u04.gi.to-be-negative.tr.001 | translation | Ich bin nicht müde. [de] | I'm not tired. (full) ; I am not tired. (full) | deToEn | — | — | — | false |
| g1u04.gi.to-be-negative.tr.002 | translation | Sie sind nicht wütend. Sie sind glücklich. [de] | They aren't angry. They're happy. (full) ; They are not angry. They are happy. (full) | deToEn | — | — | — | false |
| g1u04.gi.to-be-questions.ag.001 | anagram | Is she …? Wie geht es ihr, wenn sie lacht? (Gefühl) [de] | happy (full) | — | — | — | — | false |
| g1u04.gi.to-be-questions.cp.001 | context-picker | Du willst deine Freundin fragen, ob sie glücklich ist. Welcher Satz ist richtig? [de] | Are you happy? (full) | — | Do you happy? ; You are happy? ; Are happy you? | — | — | false |
| g1u04.gi.to-be-questions.cp.003 | context-picker | Tom ist nicht glücklich, er ist traurig. Du fragst und gibst die richtige Antwort. Welche Zeile ist richtig? [de] | Is he happy? — No, he isn't. (full) | — | Is he happy? — No, he aren't. ; Is he happy? — No, he not. ; Are he happy? — No, he isn't. | — | — | true |
| g1u04.gi.to-be-questions.ec.001 | error-correction | Do you are happy? [en] | Are you happy? (full) ; Are you happy (partial) | — | — | — | — | false |
| g1u04.gi.to-be-questions.ec.002 | error-correction | Are you hungry? — Yes, I'm. [en] | Are you hungry? — Yes, I am. (full) ; Yes, I am. (partial) ; Yes, I am (partial) | — | — | — | — | true |
| g1u04.gi.to-be-questions.gf.001 | gap-fill | ___ you happy? [en, 1 blank(s)] | Are (full) | — | — | — | — | false |
| g1u04.gi.to-be-questions.gf.002 | gap-fill | ___ he cold? [en, 1 blank(s)] | Is (full) | — | — | — | — | false |
| g1u04.gi.to-be-questions.gf.003 | gap-fill | ___ she sad? — Yes, she ___. [en, 2 blank(s)] | Is \| is (full) | — | — | — | — | true |
| g1u04.gi.to-be-questions.gs.001 | group-sort | Sortiere die Fragen nach ihrem ersten Wort. [de] | — | — | — | — | Is …?: Is he cold?, Is she happy?, Is it hot? \| Are …?: Are you sad?, Are they tired?, Are we hungry? | false |
| g1u04.gi.to-be-questions.mc.001 | multiple-choice | ___ they hungry? [en, 1 blank(s)] | Are (full) | — | Is ; Am ; Do | — | — | false |
| g1u04.gi.to-be-questions.mc.002 | multiple-choice | Are you cold? — ___ [en, 1 blank(s)] | Yes, I am. (full) | — | Yes, I'm. ; Yes, you are. ; Yes, he is. | — | — | true |
| g1u04.gi.to-be-questions.mt.002 | matching | Frage und passende Antwort verbinden. [de] | — | — | — | Are you happy? ↔ Yes, I am. ; Is he sad? ↔ No, he isn't. ; Are they cold? ↔ Yes, they are. ; Is she tired? ↔ No, she isn't. | — | false |
| g1u04.gi.to-be-questions.qf.001 | question-formation | she / is / nervous [en] | Is she nervous? (full) | — | — | — | — | false |
| g1u04.gi.to-be-questions.qf.002 | question-formation | the dog / hungry / is [en] | Is the dog hungry? (full) | — | — | — | — | false |
| g1u04.gi.to-be-questions.sb.001 | sentence-building | are / they / excited / ? [en] | Are they excited? (full) | — | — | — | — | false |
| g1u04.gi.to-be-questions.tf.001 | transformation | He is sad. → ? [en] | Is he sad? (full) | — | — | — | — | false |
| g1u04.gi.to-be-questions.tf.002 | transformation | They are scared. → ? [en] | Are they scared? (full) | — | — | — | — | false |
| g1u04.gi.to-be-questions.tr.001 | translation | Bist du müde? [de] | Are you tired? (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u04/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u04",
  "lens": "answers",
  "itemsHash": "22d315a2d185",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 105, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
