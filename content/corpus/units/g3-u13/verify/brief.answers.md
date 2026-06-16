# Verify lens — answers — g3-u13 (round 1)

<!-- domigo:verify answers g3-u13 items=aba8b8f9dad4 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (34)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u13.w.accidentally | accidentally | When you do something by mistake, not because you wanted to. | When running down the stairs, you ___ broke a vase. | accidentally (full) | accidentally (full) | homemade ; except ; neither of |
| g3u13.w.alibi | alibi | Words that show you were somewhere else when something happened. | Your friend asks you to give her an ___ for last night. | alibi (full) | alibi (full) ; an alibi (full) | voucher ; lift ; detention |
| g3u13.w.detention | detention | A punishment at school: you must stay after class. | If you didn't tell the teacher anything, you'd probably get ___. | detention (full) | detention (full) | disappointment ; dilemma ; voucher |
| g3u13.w.dilemma | dilemma | A hard situation where you must pick one of two things. | I'm sure we'll find a way out of this ___. | dilemma (full) | dilemma (full) ; a dilemma (full) | disappointment ; decision ; voucher |
| g3u13.w.disappointment | disappointment | A sad feeling when something is not as good as you hoped. | It's a big ___ that you can't play on Saturday. | disappointment (full) | disappointment (full) ; a disappointment (full) | dilemma ; decision ; voucher |
| g3u13.w.except | except | Not counting one person or thing. | Everyone in the class knew about the trip ___ you. | except (full) | except (full) ; except for (full) | neither of ; homemade ; accidentally |
| g3u13.w.granddad | granddad | The father of your mother or your father. | We are going to visit ___ in the afternoon. | granddad (full) ; grandad (full) | granddad (full) ; grandad (full) | voucher ; lift ; alibi |
| g3u13.w.homemade | homemade | Made at home, not bought in a shop. | I could give him some ___ vouchers for his birthday. | homemade (full) | homemade (full) ; home-made (full) | accidentally ; except ; neither of |
| g3u13.w.id | ID (=identification) | A card with your photo that shows who you are. | At the door they asked to see my ___. | ID (full) ; ID card (full) | ID (full) ; ID card (full) ; identification (full) | detention ; alibi ; lift |
| g3u13.w.it-s-a-shame | It's a shame. | You say this when you feel sorry that something is not better. | She didn't win after all that hard work. ___ | It's a shame. (full) ; It's a shame (full) | It's a shame. (full) ; It's a shame (full) ; What a shame. (partial) | homemade ; accidentally ; neither of |
| g3u13.w.lift | lift | A free ride in someone's car. | Can you give me a ___ to the station in your car? | lift (full) | lift (full) ; a lift (full) | voucher ; alibi ; dilemma |
| g3u13.w.neither-of | neither of | Not one and not the other of two. | ___ us has any money for a present. | Neither of (full) ; neither of (full) | neither of (full) | except ; homemade ; accidentally |
| g3u13.w.to-argue | to argue | To fight with words because you do not agree. | I don't like to ___ with my parents. | argue (full) | argue (full) ; to argue (full) ; argued (full) | pretend ; deserve ; wrap |
| g3u13.w.to-ask-sb-out | to ask sb. out | To invite someone to go on a date. | Jim has ___ me out, but I don't want to go out with him. | asked (full) | ask sb. out (full) ; to ask sb. out (full) ; ask out (full) ; asked out (full) | keep ; reject ; wrap |
| g3u13.w.to-be-at-a-loss | to be at a loss | To have no idea at all what to say or do. | I don't know what to get Dad for his birthday. I'm really ___. | at a loss (full) | be at a loss (full) ; to be at a loss (full) ; at a loss (full) | to make up your mind ; to reach a decision ; to deserve |
| g3u13.w.to-be-in-two-minds-about-sth | to be in two minds about sth. | To be unsure because part of you wants to and part of you does not. | Jo's party is tonight, but I'm not sure. I'm ___ about it. | in two minds (full) | be in two minds (full) ; to be in two minds (full) ; in two minds (full) ; be in two minds about sth. (full) | to make up your mind ; to reach a decision ; to deserve |
| g3u13.w.to-cancel | to cancel | To say that something you planned will not happen now. | You can't just ___ the party because you want to play football. | cancel (full) | cancel (full) ; to cancel (full) ; cancelled (full) ; canceled (full) | to pretend ; to deserve ; to wrap |
| g3u13.w.to-deserve | to deserve | To get something good because of what you did. | You ___ a present after all your help at home. | deserve (full) | deserve (full) ; to deserve (full) ; deserved (full) ; deserves (full) | cancel ; move ; reject |
| g3u13.w.to-find-a-way-out-of-a-dilemma | to find a way out of a dilemma | To get a good answer to a hard problem in the end. | It's a difficult situation, but I'm sure we'll ___ in the end. | find a way out of a dilemma (full) ; find a way out (full) | find a way out of a dilemma (full) ; to find a way out of a dilemma (full) ; find a way out (full) ; found a way out (full) | to be at a loss ; to be in two minds about sth. ; to cancel |
| g3u13.w.to-have-second-thoughts-about-sth | to have second thoughts about sth. | To start to think that your first idea was not so good. | I'm not happy about the present we decided to get for Mum. I'm ___. | having second thoughts (full) | have second thoughts (full) ; to have second thoughts (full) ; having second thoughts (full) ; had second thoughts (full) | to make up your mind ; to reach a decision ; to deserve |
| g3u13.w.to-keep-quiet | to keep quiet | To say nothing about something. | I'd ___ if the teacher asked me what happened. | keep quiet (full) | keep quiet (full) ; to keep quiet (full) ; kept quiet (full) | to tell on sb. ; to argue ; to put up |
| g3u13.w.to-kick-sb-off | to kick sb. off | To make someone leave a team or a group. | My coach is going to ___ me off the football team. | kick (full) | kick sb. off (full) ; to kick sb. off (full) ; kick off (full) ; kicked off (full) | move ; deserve ; reject |
| g3u13.w.to-look-the-other-way | to look the other way | To turn your head away so you don't see something wrong. | If someone needs help, don't ___. | look the other way (full) | look the other way (full) ; to look the other way (full) ; looked the other way (full) | to keep quiet ; to pretend ; to reject |
| g3u13.w.to-make-up-your-mind | to make up your mind | To finally choose what you want to do. | Pizza or salad or both! I really can't ___. | make up my mind (full) ; make up your mind (partial) | make up your mind (full) ; to make up your mind (full) ; made up my mind (full) ; made up your mind (full) | to sleep on it ; to be at a loss ; to keep quiet |
| g3u13.w.to-move | to move | To put something at a different time or day. | They have asked me to ___ the match to Saturday. | move (full) | move (full) ; to move (full) ; moved (full) | cancel ; deserve ; wrap |
| g3u13.w.to-pretend | to pretend | To act as if something is true when it is not. | Would you ___ you weren't my friend? | pretend (full) | pretend (full) ; to pretend (full) ; pretended (full) | argue ; deserve ; reject |
| g3u13.w.to-put-up | to put up | To fix something on a wall or board so people can see it. | I ___ a note on the wall about my new band. | put up (full) | put up (full) ; to put up (full) | wrap ; reject ; argue |
| g3u13.w.to-reach-a-decision | to reach a decision | To finally agree on what to do after a long talk. | After a long talk, the two friends could ___ about the holiday. | reach a decision (full) | reach a decision (full) ; to reach a decision (full) ; reached a decision (full) | to be in two minds about sth. ; to be at a loss ; to cancel |
| g3u13.w.to-reject | to reject | To say no to something or someone. | She just ___ my idea and did the opposite. | rejected (full) | reject (full) ; to reject (full) ; rejected (full) | deserve ; argue ; wrap |
| g3u13.w.to-rethink | to rethink | To go over something in your head again so you can change your plan. | I'll have to ___ my decision. | rethink (full) | rethink (full) ; to rethink (full) | cancel ; deserve ; argue |
| g3u13.w.to-sleep-on-it | to sleep on it | To wait until the next day before you decide. | I'm not sure if I want to enter the tennis competition. Let me ___. | sleep on it (full) | sleep on it (full) ; to sleep on it (full) ; slept on it (full) | to make up your mind ; to reach a decision ; to argue |
| g3u13.w.to-tell-on-sb | to tell on sb. | To go to a teacher or parent about what someone did wrong. | I'm not going to ___ on my friend. | tell (full) | tell on sb. (full) ; to tell on sb. (full) ; tell on (full) ; told on (full) | keep ; argue ; pretend |
| g3u13.w.to-wrap | to wrap | To put paper or cloth around something. | I'll ___ the present and give it to him. | wrap (full) | wrap (full) ; to wrap (full) ; wrapped (full) | put up ; reject ; argue |
| g3u13.w.voucher | voucher | A piece of paper you can use instead of money. | I make a ___ for one free maths homework. | voucher (full) | voucher (full) ; a voucher (full) | dilemma ; detention ; lift |

## Grammar items (32)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u13.gi.second-conditional.cp.001 | context-picker | Dein Freund sagt: 'I'm so bored at home!' Welche Antwort gibt einen guten Rat und ist richtig gebaut? [de] | If I were you, I would join a band. (full) | — | If I am you, I will join a band. ; If I would be you, I would join a band. ; If I were you, I will join a band. | — | — | false |
| g3u13.gi.second-conditional.cp.002 | context-picker | Deine Freundin sagt: 'There is a big spider in my room!' Welche Antwort ist richtig? [de] | If I were you, I would put it outside. (full) | — | If I were you, I will put it outside. ; If I am you, I would put it outside. ; If I would be you, I would put it outside. | — | — | false |
| g3u13.gi.second-conditional.ec.001 | error-correction | If I would be rich, I would help people. [de] | If I were rich, I would help people. (full) ; If I was rich, I would help people. (full) ; were (partial) | — | — | — | — | false |
| g3u13.gi.second-conditional.ec.002 | error-correction | If she studied harder, she will pass the test. [de] | If she studied harder, she would pass the test. (full) ; would (partial) | — | — | — | — | true |
| g3u13.gi.second-conditional.ec.003 | error-correction | If I have more time, I would read more books. [de] | If I had more time, I would read more books. (full) ; had (partial) | — | — | — | — | true |
| g3u13.gi.second-conditional.ec.004 | error-correction | If I was you, I would not worry so much. [de] | If I were you, I would not worry so much. (full) ; were (partial) | — | — | — | — | true |
| g3u13.gi.second-conditional.ec.005 | error-correction | If I were you, I would talked to him. [de] | If I were you, I would talk to him. (full) ; talk (partial) | — | — | — | — | true |
| g3u13.gi.second-conditional.gf.001 | gap-fill | If I ___ (have) a lot of money, I would help my friends. [de, 1 blank(s)] | had (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.gf.002 | gap-fill | If I ___ (be) you, I would talk to the teacher. [de, 1 blank(s)] | were (full) ; was (partial) | — | — | — | — | false |
| g3u13.gi.second-conditional.gf.003 | gap-fill | If I were you, I ___ (talk) to the teacher about it. [de, 1 blank(s)] | would talk (full) ; 'd talk (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.gf.004 | gap-fill | If she ___ (be) a bad coach, I ___ (find) a new one. [de, 2 blank(s)] | were \| would find (full) ; was \| would find (partial) ; were \| 'd find (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.gf.005 | gap-fill | If we ___ (not / live) so near the school, we ___ (ride) a scooter. [de, 2 blank(s)] | didn't live \| would ride (full) ; did not live \| would ride (full) ; didn't live \| 'd ride (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.gf.006 | gap-fill | What ___ you ___ (do) if you ___ (find) money on the street? [de, 3 blank(s)] | would \| do \| found (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.gf.007 | gap-fill | If I ___ (can / fly), I ___ (not / need) a car. [de, 2 blank(s)] | could fly \| wouldn't need (full) ; could fly \| would not need (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.gf.008 | gap-fill | If it ___ (be) sunny, we would go to the park. [de, 1 blank(s)] | were (full) ; was (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.gf.009 | gap-fill | If I ___ (not / be) so tired, I ___ (play) more games. [de, 2 blank(s)] | weren't \| would play (full) ; wasn't \| would play (full) ; were not \| would play (full) ; weren't \| 'd play (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.gf.010 | gap-fill | If I ___ (have) a band at school, I ___ (join) it. [de, 2 blank(s)] | had \| would join (full) ; had \| 'd join (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.gs.002 | group-sort | Welcher Satz ist richtig gebaut, welcher hat einen Fehler? [de] | — | — | — | — | ✓: If I had a dog, I would walk it every day., If I were you, I would ask the teacher., If she lived here, we would play every day. \| ✗: If I would have a dog, I would walk it., If I have a dog, I will walk it every day., If I were you, I will ask the teacher. | false |
| g3u13.gi.second-conditional.mc.001 | multiple-choice | Welcher Satz ist richtig gebaut? [de] | If I had a dog, I would take it for a walk every day. (full) | — | If I have a dog, I would take it for a walk every day. ; If I had a dog, I will take it for a walk every day. ; If I would have a dog, I would take it for a walk every day. | — | — | false |
| g3u13.gi.second-conditional.mc.002 | multiple-choice | Deine Freundin weiß nicht, welches Fach sie nehmen soll. Welcher Rat ist richtig gebaut? [de] | If I were you, I would take music. (full) | — | If I am you, I will take music. ; If I were you, I will take music. ; If I would be you, I would take music. | — | — | false |
| g3u13.gi.second-conditional.mc.003 | multiple-choice | If I ___ a bird, I would fly to Africa. [de, 1 blank(s)] | were (full) | — | am ; would be ; will be | — | — | false |
| g3u13.gi.second-conditional.mc.004 | multiple-choice | If you ___ (study) more, you would get better marks.  →  Welche Form passt? [de, 1 blank(s)] | studied (full) | — | study ; would study ; will study | — | — | false |
| g3u13.gi.second-conditional.mt.001 | matching | if-Satz und passenden Hauptsatz verbinden [de] | — | — | — | If I had more time, ↔ I would play the guitar. ; If we lived near the sea, ↔ we would go surfing every day. ; If I were you, ↔ I would talk to her. ; If it were sunny, ↔ we would walk to school. ; If I had a horse, ↔ I would ride every day. | — | false |
| g3u13.gi.second-conditional.qf.001 | question-formation | Bilde eine Frage über eine unwirkliche Situation: 'you' + 'win a lot of money'. (Beginne mit 'What would you do if …') [de] | What would you do if you won a lot of money? (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.sb.001 | sentence-building | were / if / you / I / would / I / ask / her [de] | If I were you, I would ask her. (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.sb.002 | sentence-building | could / if / I / fly / would / I / travel [de] | If I could fly, I would travel. (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.tf.001 | transformation | Echte Situation: 'I don't have a scooter, so I walk to school.' Schreib sie als unwirkliche Bedingung um (beginne mit 'If I …'). [de] | If I had a scooter, I would not walk to school. (full) ; If I had a scooter, I wouldn't walk to school. (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.tf.002 | transformation | She is ill, so she is not at school. (→ 'If she ___') [de, 1 blank(s)] | If she were not ill, she would be at school. (full) ; If she wasn't ill, she would be at school. (full) ; If she were not ill, she'd be at school. (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.tf.003 | transformation | I don't like this song, so I don't listen to it. (→ 'If I ___') [de, 1 blank(s)] | If I liked this song, I would listen to it. (full) ; If I liked this song, I'd listen to it. (full) | — | — | — | — | false |
| g3u13.gi.second-conditional.tr.001 | translation | Wenn ich ein Tier wäre, wäre ich ein Delfin. [de] | If I were an animal, I would be a dolphin. (full) ; If I was an animal, I would be a dolphin. (partial) ; If I were an animal, I'd be a dolphin. (full) | deToEn | — | — | — | false |
| g3u13.gi.second-conditional.tr.002 | translation | An deiner Stelle würde ich mir keine Sorgen machen. [de] | If I were you, I would not worry. (full) ; If I were you, I wouldn't worry. (full) ; If I were you, I'd not worry. (partial) | deToEn | — | — | — | false |
| g3u13.gi.second-conditional.tr.003 | translation | Wenn ich mehr Zeit hätte, würde ich dir helfen. [de] | If I had more time, I would help you. (full) ; If I had more time, I'd help you. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u13/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u13",
  "lens": "answers",
  "itemsHash": "aba8b8f9dad4",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 66, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
