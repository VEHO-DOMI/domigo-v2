# Verify lens — answers — g2-u07 (round 2)

<!-- domigo:verify answers g2-u07 items=ce0bece2461f prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (30)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u07.w.communication | communication | when people talk, write and share with people | There are many kinds of ___, like text messages and group chats. | communication (full) | communication (full) | disappointment ; excuse ; truth |
| g2u07.w.disappointment | disappointment | how sad you are when a thing is not good | She showed her ___ when there were no tickets. | disappointment (full) | disappointment (full) | communication ; excuse ; truth |
| g2u07.w.excuse | excuse | a reason you give for a bad thing you did | There's no ___. You did it! | excuse (full) | excuse (full) ; excuses (full) | communication ; disappointment ; truth |
| g2u07.w.fancy-dress-party | fancy dress party | where all the people come in a costume | My friend invited me to a ___, so I need a costume. | fancy dress party (full) ; fancy dress parties (partial) | fancy dress party (full) ; fancy dress parties (full) | group chat ; communication ; ticket |
| g2u07.w.german | German | what people speak in Austria, not English | In Austria, many people speak ___. | German (full) | German (full) | English ; French ; row |
| g2u07.w.group-chat | group chat | lots of friends write here on a mobile phone | My friends and I have a ___ on our mobile phones. | group chat (full) ; group chats (partial) | group chat (full) ; group chats (full) | social media ; communication ; excuse |
| g2u07.w.honestly | honestly | when you tell the truth and do not lie | ___, that was a joke! | honestly (full) | honestly (full) | instead ; truth ; excuse |
| g2u07.w.instead | instead | in place of one thing | I don't want to do my homework. I'm going to do nothing ___. | instead (full) | instead (full) | honestly ; truth ; excuse |
| g2u07.w.row | row | the chairs that are all next to your chair at the cinema | Can we have tickets for ___ 12, please? | row (full) | row (full) | ticket ; concert ; German |
| g2u07.w.social-media | social media | where people share pictures and short posts with a lot of people | I'm writing a ___ post. | social media (full) | social media (full) | group chat ; communication ; disappointment |
| g2u07.w.sold-out | sold out | when there are no more tickets | The concert is ___. There are no more tickets. | sold out (full) | sold out (full) | expensive ; sad ; tired |
| g2u07.w.that-s-a-pity | That's a pity. | you tell a friend this when you are sorry about a thing | There is just one ticket for the 5 o'clock showing. ___ | That's a pity (full) ; That's a pity! (full) ; That is a pity (full) | That's a pity (full) ; That's a pity! (full) ; That is a pity (full) | Don't worry. ; Have fun! ; Well done. |
| g2u07.w.ticket | ticket | you show this to go into the cinema or a concert | Can I have two ___ for the cinema, please? | tickets (full) | ticket (full) ; tickets (full) | row ; concert ; German |
| g2u07.w.to-be-ashamed | to be ashamed | to feel very bad about a bad thing you did | I did a bad thing, so I was very ___. | ashamed (full) ; be ashamed (partial) | be ashamed (full) ; ashamed (full) ; to be ashamed (full) | proud ; glad ; bored |
| g2u07.w.to-be-worried | to be worried | to think a bad thing might happen | William is always ___. | worried (full) ; be worried (partial) | be worried (full) ; worried (full) ; to be worried (full) | proud ; glad ; bored |
| g2u07.w.to-come-over | to come over | to visit a friend at their place | She isn't going to ___ today because she is ill. | come over (full) ; to come over (partial) | come over (full) ; to come over (full) | to take it easy ; to do the shopping ; to get into trouble |
| g2u07.w.to-crash | to crash | to drive into a thing and have an accident | Be careful or you might ___. | crash (full) ; to crash (partial) | crash (full) ; to crash (full) | to come over ; to take it easy ; to do nothing |
| g2u07.w.to-do-nothing | to do nothing | to not do anything at all, just take a rest | I don't want to work. I'm going to ___ this afternoon. | do nothing (full) ; to do nothing (partial) | do nothing (full) ; to do nothing (full) | to do your homework ; to tidy your room ; to do the shopping |
| g2u07.w.to-do-the-shopping | to do the shopping | to go to the supermarket and buy what you need | My mum is going to ___ at the supermarket. | do the shopping (full) ; to do the shopping (partial) | do the shopping (full) ; to do the shopping (full) | to do your homework ; to watch a film ; to have a party |
| g2u07.w.to-do-your-homework | to do your homework | to do the school work your teacher gives you | First you have to ___, then you can watch TV. | do your homework (full) ; do my homework (full) ; to do your homework (partial) | do your homework (full) ; to do your homework (full) ; do my homework (full) | to do nothing ; to play basketball ; to come over |
| g2u07.w.to-get-into-trouble | to get into trouble | to do a bad thing and make the teacher angry | If you don't listen to the teacher, you might ___. | get into trouble (full) ; to get into trouble (partial) | get into trouble (full) ; to get into trouble (full) | to take it easy ; to come over ; to do the shopping |
| g2u07.w.to-have-a-party | to have a party | to ask friends to come for cake and fun | It's my birthday on Saturday, so I'm going to ___. | have a party (full) ; to have a party (partial) | have a party (full) ; to have a party (full) | to do your homework ; to tidy your room ; to do the shopping |
| g2u07.w.to-play-basketball | to play basketball | you run and jump and do this fast with friends | I'm going to ___ with my friends after school. | play basketball (full) ; to play basketball (partial) | play basketball (full) ; to play basketball (full) | to do nothing ; to watch a film ; to do the shopping |
| g2u07.w.to-stay-at-a-friend-s-house | to stay at a friend's house | to visit a boy or girl you like and sleep at their place for one night | Can I ___ on Friday night? | stay at a friend's house (full) ; to stay at a friend's house (partial) | stay at a friend's house (full) ; to stay at a friend's house (full) | to come over ; to have a party ; to do the shopping |
| g2u07.w.to-take-it-easy | to take it easy | to do nothing and be calm | I'm very tired. I'm going to ___ this afternoon. | take it easy (full) ; to take it easy (partial) | take it easy (full) ; to take it easy (full) | to come over ; to get into trouble ; to crash |
| g2u07.w.to-tell-a-lie | to tell a lie | to say a thing that is not true | Always tell the truth. Don't ___. | tell a lie (full) ; tell lies (full) ; to tell a lie (partial) | tell a lie (full) ; to tell a lie (full) ; tell lies (full) | to come over ; to take it easy ; to do nothing |
| g2u07.w.to-tidy-your-room | to tidy your room | to make a mess clean and put your clothes away | Mum is angry. I must ___ now because my clothes are all over the bed. | tidy my room (full) ; tidy your room (full) ; to tidy your room (partial) | tidy your room (full) ; to tidy your room (full) ; tidy my room (full) | to do nothing ; to play basketball ; to come over |
| g2u07.w.to-watch-a-film | to watch a film | to look at a story on a big screen at the cinema | We are going to ___ on the big screen at the cinema. | watch a film (full) ; to watch a film (partial) | watch a film (full) ; to watch a film (full) | to play basketball ; to do the shopping ; to tidy your room |
| g2u07.w.truth | truth | what is true and not a lie | I didn't tell her the ___. | truth (full) | truth (full) | excuse ; communication ; disappointment |
| g2u07.w.what-a-shame | What a shame! | you tell a friend this when a bad thing happens | The concert is sold out. ___ | What a shame (full) ; What a shame! (full) | What a shame (full) ; What a shame! (full) | Well done. ; Have fun! ; Don't worry. |

## Grammar items (34)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u07.gi.going-to-negative.cp.001 | context-picker | Mia has a lot of work for school, so she isn't going to visit Grandma. [en] | I'm not going to come along. (full) | — | I don't going to come along. ; I'm not going come along. ; I'm not going to does come along. | — | — | false |
| g2u07.gi.going-to-negative.ec.001 | error-correction | I don't going to do my homework tonight. [en] | I'm not going to do my homework tonight. (full) ; I am not going to do my homework tonight. (full) ; I'm not going to (partial) | — | — | — | — | true |
| g2u07.gi.going-to-negative.ec.002 | error-correction | I'm not going tidy your room. [en] | I'm not going to tidy your room. (full) ; I am not going to tidy your room. (full) ; going to tidy your room (partial) | — | — | — | — | true |
| g2u07.gi.going-to-negative.gf.003 | gap-fill | I'm tired. I'm ___ ___ ___ tidy your room today. [en, 3 blank(s)] | not \| going \| to (full) | — | — | — | — | false |
| g2u07.gi.going-to-negative.gf.004 | gap-fill | She ___ ___ to come over today. She is ill. [en, 2 blank(s)] | isn't \| going (full) ; is not \| going (full) | — | — | — | — | true |
| g2u07.gi.going-to-negative.mc.001 | multiple-choice | Tom has a lot of work for school today. [en] | He isn't going to play basketball today. (full) | — | He doesn't going to play basketball today. ; He isn't going to plays basketball today. ; He isn't going play basketball today. | — | — | false |
| g2u07.gi.going-to-negative.sb.001 | sentence-building | not / going / I'm / to / do / homework / my [en] | I'm not going to do my homework. (full) ; I'm not going to do my homework (full) | — | don't ; to do | — | — | false |
| g2u07.gi.going-to-negative.tf.001 | transformation | He ___ do the shopping today. He's at school all day. [en, 1 blank(s)] | isn't going to (full) ; is not going to (full) ; He isn't going to do the shopping today. (full) | — | — | — | — | true |
| g2u07.gi.going-to-negative.tr.001 | translation | Ich werde meine Hausaufgaben heute nicht machen. [de] | I'm not going to do my homework today. (full) ; I am not going to do my homework today. (full) ; I'm not going to do my homework today (full) | deToEn | — | — | — | true |
| g2u07.gi.might.ag.002 | anagram | Welches Wort bedeutet "möglich, aber nicht sicher"? (z. B. ... come over am Samstag) [de] | might (full) | — | — | — | — | false |
| g2u07.gi.might.cp.003 | context-picker | This afternoon she is free. It's possible: play basketball. [en] | I might play basketball this afternoon. (full) | — | I might to play basketball this afternoon. ; I might played basketball this afternoon. ; I might plays basketball this afternoon. | — | — | false |
| g2u07.gi.might.cp.004 | context-picker | Mia is ill. It's possible she isn't going to come over. [en] | She might not come over today. (full) | — | She doesn't might come over today. ; She might not comes over today. ; She might not to come over today. | — | — | false |
| g2u07.gi.might.ec.001 | error-correction | He might plays basketball after school. [en] | He might play basketball after school. (full) ; might play (partial) | — | — | — | — | true |
| g2u07.gi.might.ec.002 | error-correction | She might to come over today. [en] | She might come over today. (full) ; might come (partial) | — | — | — | — | true |
| g2u07.gi.might.ec.003 | error-correction | He might watched a film tonight. [en] | He might watch a film tonight. (full) ; might watch (partial) | — | — | — | — | true |
| g2u07.gi.might.gf.001 | gap-fill | Be careful — it ___ snow today. [en, 1 blank(s)] | might (full) | — | might to ; might snows ; might does | — | — | false |
| g2u07.gi.might.gf.002 | gap-fill | We ___ play basketball on Saturday. [en, 1 blank(s)] | might (full) | — | might to ; might plays ; might does | — | — | false |
| g2u07.gi.might.gf.003 | gap-fill | She ___ come over today. [en, 1 blank(s)] | might (full) | — | might to ; might does ; doesn't | — | — | false |
| g2u07.gi.might.gf.004 | gap-fill | Tom ___ play basketball tomorrow. His leg hurts. [en, 1 blank(s)] | might not (full) | — | might not to ; might nots ; might not does | — | — | false |
| g2u07.gi.might.gf.005 | gap-fill | On Sunday we ___ stay at home or we ___ go to the park. [en, 2 blank(s)] | might \| might (full) | — | — | — | — | false |
| g2u07.gi.might.gf.007 | gap-fill | We ___ have a party on Saturday. I haven't asked Mum. [en, 1 blank(s)] | might (full) | — | might to ; might has ; might does | — | — | false |
| g2u07.gi.might.gf.008 | gap-fill | We ___ stay at a friend's house on Saturday. [en, 1 blank(s)] | might (full) | — | might to ; might stays ; might does | — | — | false |
| g2u07.gi.might.gf.010 | gap-fill | He ___ (not / help) us today. He has a lot of homework. [en, 1 blank(s)] | might not help (full) | — | — | — | — | false |
| g2u07.gi.might.gs.001 | group-sort | might or going to? [en] | — | — | — | — | It's possible (might): I might play basketball., We might have a party., She might come over today., It might snow. \| It's going to happen (going to): I'm going to do my homework., We're going to do the shopping., She's going to stay at a friend's house., He's going to watch a film. | false |
| g2u07.gi.might.mc.002 | multiple-choice | It's possible: no snow today. [en] | It might not snow. (full) | — | It might not snows. ; It might not to snow. ; It might snow not. | — | — | false |
| g2u07.gi.might.mc.003 | multiple-choice | Emma is free tomorrow. [en] | She might visit us tomorrow. (full) | — | She might visits us tomorrow. ; She might to visit us tomorrow. ; She might visited us tomorrow. | — | — | false |
| g2u07.gi.might.mp.001 | matching-pairs | What might happen? [en] | — | — | — | We have free time on Saturday. ↔ We might play basketball. ; Mia is ill. ↔ She might not come over. ; It's very cold today. ↔ It might snow today. ; I haven't asked Mum. ↔ We might have a party. | — | false |
| g2u07.gi.might.mt.001 | matching | Why not? What might happen? [en] | — | — | — | I'm not going to ride a bike. ↔ I might crash. ; I'm not going to do the shopping. ↔ It might be sold out. ; I'm not going near that dog. ↔ It might bite. ; I'm not going to do that. ↔ I might get into trouble. | — | false |
| g2u07.gi.might.sb.001 | sentence-building | we / the park / might / to / go [en] | We might go to the park. (full) ; We might go to the park (full) | — | does ; plays | — | — | false |
| g2u07.gi.might.sb.002 | sentence-building | might / she / come / over / not [en] | She might not come over. (full) ; She might not come over (full) | — | to ; does | — | — | false |
| g2u07.gi.might.tf.001 | transformation | I ___ (might / do the shopping) for Mum on Saturday. [en, 1 blank(s)] | might do the shopping (full) ; I might do the shopping for Mum on Saturday. (full) | — | — | — | — | true |
| g2u07.gi.might.tf.003 | transformation | Emma ___ (not / come) to school tomorrow. She is ill. [en, 1 blank(s)] | might not come (full) ; Emma might not come to school tomorrow. (full) | — | — | — | — | true |
| g2u07.gi.might.tr.001 | translation | Wir gehen vielleicht morgen ins Kino. [de] | We might go to the cinema tomorrow. (full) ; We might go to the cinema tomorrow (full) | deToEn | — | — | — | true |
| g2u07.gi.might.tr.003 | translation | Er kommt heute vielleicht nicht vorbei. Es geht ihm nicht gut. [de] | He might not come over today. He is ill. (full) ; He might not come over today. He is ill (full) ; He might not come over today. He isn't well. (partial) ; He might not come over today. He's not well. (partial) ; He might not come over today. He's not feeling well. (partial) | deToEn | — | — | — | true |

## Output contract

Write `content/corpus/units/g2-u07/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u07",
  "lens": "answers",
  "itemsHash": "ce0bece2461f",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 64, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
