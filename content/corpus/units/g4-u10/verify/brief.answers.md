# Verify lens — answers — g4-u10 (round 1)

<!-- domigo:verify answers g4-u10 items=2a4426bd419e prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (37)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u10.w.agreement | agreement | A decision that two or more people or groups are all happy with. | Fair Trade is an ___ that gives farmers a fair price. | agreement (full) | agreement (full) ; agreements (full) | recognition ; ignorance ; harmony |
| g4u10.w.angry | angry | Feeling very upset about a thing that is not fair. | The passengers were ___ about the long wait. | angry (full) | angry (full) | proud ; shocked ; surprised |
| g4u10.w.annoy | annoy | To make people feel a little angry. | Please stop, you really ___ me when you do that. | annoy (full) | annoy (full) | hurt ; defeat ; select |
| g4u10.w.bicycle | bicycle | A two-wheel machine that you ride and move with your feet. | He likes to ride his ___ in the park. | bicycle (full) ; bike (partial) | bicycle (full) ; bike (full) | oil ; introduction ; agreement |
| g4u10.w.brother-in-law | brother-in-law | The man who is married to your sister. | The man who married my sister is my ___. | brother-in-law (full) | brother-in-law (full) | son-in-law ; human being ; farmer |
| g4u10.w.claim | claim | To tell people that a thing is true when you cannot prove it. | She ___ she can speak five tongues, but she cannot prove it. | claims (full) | claim (full) ; claims (full) | defeat ; select ; increase |
| g4u10.w.defeat | defeat | To be stronger than the people you fight and take the victory. | He wants to ___ the best boxer in the world. | defeat (full) | defeat (full) ; defeated (full) | overcome ; increase ; select |
| g4u10.w.fair-trade | Fair Trade | A way of selling that pays people in countries with little money a just price for what they make and sell. | The ___ project gives farmers more money for their products. | Fair Trade (full) | Fair Trade (full) | agreement ; recognition ; harmony |
| g4u10.w.fairness | fairness | Treating all people in a just and honest way. | We want ___ for all people, both rich and not rich. | fairness (full) | fairness (full) | recognition ; agreement ; harmony |
| g4u10.w.farmer | farmer | A man or woman who owns or works on land where food and animal life are raised. | My uncle is a ___ and he owns a farm with horses. | farmer (full) | farmer (full) ; farmers (full) | human being ; son-in-law ; brother-in-law |
| g4u10.w.harmony | harmony | A way of living in which people are at one and do not fight. | People of all races can live in ___. | harmony (full) | harmony (full) | ignorance ; recognition ; slavery |
| g4u10.w.hell | hell | A very bad place where some people think bad people go when they are dead. | ___ is the opposite of a happy place after death. | Hell (full) ; hell (full) | hell (full) | harmony ; fairness ; recognition |
| g4u10.w.helpless | helpless | Weak and with no way to stop a bad thing. | Without his glasses he was completely ___. | helpless (full) | helpless (full) | angry ; proud ; shocked |
| g4u10.w.human-being | human being | A man, woman or child; one of the people who live on Earth. | In the end, we are all just ___. | human beings (full) | human being (full) ; human beings (full) | farmer ; racist ; brother-in-law |
| g4u10.w.hurt | hurt | To make people feel bad, in the body or inside. | It ___ me to think that he would lie. | hurt (full) | hurt (full) | annoy ; defeat ; claim |
| g4u10.w.hurtful | hurtful | That makes people feel sad inside. | He is horrible and he likes to make ___ comments. | hurtful (full) | hurtful (full) | painful ; helpless ; racist |
| g4u10.w.ignorance | ignorance | When you know very little about people or the world. | We can defeat racism, but first we must defeat ___. | ignorance (full) | ignorance (full) | recognition ; harmony ; slavery |
| g4u10.w.increase | increase | To become more in number; to go up. | The price of food can ___ from one year to the next. | increase (full) ; increases (partial) | increase (full) ; increases (full) | select ; defeat ; claim |
| g4u10.w.introduction | introduction | The opening of a book or speech that shows what it will be about. | He writes a short ___ at the start of his book. | introduction (full) | introduction (full) | agreement ; recognition ; rate |
| g4u10.w.make-a-living | make a living | To earn the money you need to pay for food, clothes and a home. | He could not ___ from his small farm. | make a living (full) | make a living (full) | increase ; select ; defeat |
| g4u10.w.misunderstood | misunderstood | When people do not really know what you are like. | She often feels ___ because people do not really know her. | misunderstood (full) | misunderstood (full) | surprised ; shocked ; proud |
| g4u10.w.oil | oil | A thick dark wet from under the ground that we burn to run cars, planes and machines. | ___ is very precious in our society. | Oil (full) ; oil (full) | oil (full) | pollution ; rate ; harmony |
| g4u10.w.overcome | overcome | To be stronger than a fear or a bad thing in the end. | I want to ___ my fear of flying. | overcome (full) | overcome (full) | defeat ; increase ; select |
| g4u10.w.painful | painful | Making the body or the feeling inside hurt. | Losing a good friend can be very ___. | painful (full) | painful (full) | hurtful ; helpless ; angry |
| g4u10.w.pay-rise | pay rise | More money than before for the work you do. | After two years of good work, she asked her boss for a ___. | pay rise (full) | pay rise (full) ; pay raise (partial) | agreement ; recognition ; rate |
| g4u10.w.pesticide | pesticide | A thing that farmers put on their plants to stop fungus and small bugs. | A ___ is used to stop fungus and to protect the crops. | pesticide (full) ; pesticides (partial) | pesticide (full) ; pesticides (full) | oil ; agreement ; rate |
| g4u10.w.pollution | pollution | Dirty land, rivers and sky that is bad for people, plants and animal life. | ___ of the environment is bad for trees and rivers. | Pollution (full) ; pollution (full) | pollution (full) | slavery ; racism ; ignorance |
| g4u10.w.proud | proud | Feeling very happy about a good thing you or your family have done. | My parents were ___ of me when I did well at school. | proud (full) | proud (full) | angry ; shocked ; helpless |
| g4u10.w.racism | racism | When people are treated in a cruel way just because of where they or their family come from. | Long ago, black people in America had to live with ___ every day. | racism (full) | racism (full) | slavery ; ignorance ; pollution |
| g4u10.w.racist | racist | Showing hate to people because of their skin or the land they come from. | He had to leave the band for making ___ comments. | racist (full) | racist (full) | hurtful ; helpless ; proud |
| g4u10.w.rate | rate | How fast a thing happens, or how much of it there is in some time. | The number of crimes is rising at a fast ___. | rate (full) | rate (full) ; rates (full) | agreement ; recognition ; oil |
| g4u10.w.recognition | recognition | When people notice and thank you for the good work you have done. | The farmers want more money and more ___ for their work. | recognition (full) | recognition (full) | agreement ; ignorance ; harmony |
| g4u10.w.select | select | To take the best ones from a bigger group. | The company will ___ the best beans and dry them. | select (full) | select (full) ; selected (full) | increase ; defeat ; overcome |
| g4u10.w.shocked | shocked | Feeling very upset because of a bad thing you did not think would happen. | She was ___ when she read about the accident. | shocked (full) | shocked (full) | surprised ; proud ; angry |
| g4u10.w.slavery | slavery | When people are owned and have to work for no pay and are not free. | For two hundred years, black people in America had to live in ___. | slavery (full) | slavery (full) | racism ; ignorance ; pollution |
| g4u10.w.son-in-law | son-in-law | The man who is married to your daughter. | Your ___ is the man who married your daughter. | son-in-law (full) | son-in-law (full) | brother-in-law ; human being ; farmer |
| g4u10.w.surprised | surprised | Feeling that a thing happened that you did not think would happen. | I was really ___ to find a cake at school. | surprised (full) | surprised (full) | shocked ; proud ; angry |

## Grammar items (54)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u10.gi.third-conditional.cp.001 | context-picker | Tom hat nicht gelernt und ist im Rennen Letzter geworden. Er redet jetzt darüber. Welcher Satz passt? [de] | If I had studied harder, I would have arrived first. (full) | — | If I studied harder, I would arrive first. ; If I study harder, I will arrive first. ; If I would have studied, I arrived first. | — | — | false |
| g4u10.gi.third-conditional.cp.002 | context-picker | Deine Freundin war gestern krank und ist nicht zur Party gekommen. Du findest das schade. Welcher Satz passt? [de] | If she hadn't been ill, she would have come to the party. (full) | — | If she wasn't ill, she would come to the party. ; If she isn't ill, she will come to the party. ; If she would have been ill, she had come to the party. | — | — | false |
| g4u10.gi.third-conditional.cp.003 | context-picker | Du sprichst über morgen. Es ist gut möglich, dass es regnet. Welcher Satz passt? [de] | If it rains tomorrow, we will stay at home. (full) | — | If it rained tomorrow, we would stay at home. ; If it had rained tomorrow, we would have stayed at home. ; If it rains tomorrow, we would have stayed at home. | — | — | false |
| g4u10.gi.third-conditional.ec.001 | error-correction | If I would have studied, I would have arrived first. [en] | If I had studied, I would have arrived first. (full) ; had studied (partial) | — | — | — | — | true |
| g4u10.gi.third-conditional.ec.002 | error-correction | If she had asked me, I would helped her. [en] | If she had asked me, I would have helped her. (full) ; would have helped (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.ec.003 | error-correction | If they had invited us, we would come. [en] | If they had invited us, we would have come. (full) ; would have come (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.ec.004 | error-correction | If Fair Trade would have existed, my dad would have kept the farm. [en] | If Fair Trade had existed, my dad would have kept the farm. (full) ; had existed (partial) | — | — | — | — | true |
| g4u10.gi.third-conditional.ec.005 | error-correction | If I had time yesterday, I would have visited you. [en] | If I had had time yesterday, I would have visited you. (full) ; had had (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.ec.006 | error-correction | If they had won the match, they would celebrate. [en] | If they had won the match, they would have celebrated. (full) ; would have celebrated (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.ec.007 | error-correction | If he didn't miss the bus, he would have arrived on time. [en] | If he hadn't missed the bus, he would have arrived on time. (full) ; hadn't missed (partial) ; had not missed (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.ec.008 | error-correction | If you would have asked, I would have helped. [en] | If you had asked, I would have helped. (full) ; had asked (partial) | — | — | — | — | true |
| g4u10.gi.third-conditional.gf.001 | gap-fill | If I ___ (study) harder, I would have arrived first. [en, 1 blank(s)] | had studied (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.002 | gap-fill | If they ___ (arrive) on time, they would have come with us. [en, 1 blank(s)] | had arrived (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.003 | gap-fill | If Vicente had known about Fair Trade, he ___ (join) the project earlier. [en, 1 blank(s)] | would have joined (full) ; would've joined (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.004 | gap-fill | If the company had paid a fair price, Sofia ___ (leave / not) the farm. [en, 1 blank(s)] | wouldn't have left (full) ; would not have left (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.005 | gap-fill | If she ___ (miss / not) the bus, she would have arrived on time. [en, 1 blank(s)] | hadn't missed (full) ; had not missed (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.006 | gap-fill | If we ___ (invite) Tom, he would have come to the party. [en, 1 blank(s)] | had invited (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.007 | gap-fill | If Fair Trade ___ (exist) then, my dad ___ (sell / not) his farm. [en, 2 blank(s)] | had existed \| wouldn't have sold (full) ; had existed \| would not have sold (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.008 | gap-fill | If she ___ (wash) the car, it ___ (look) clean. [en, 2 blank(s)] | had washed \| would have looked (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.009 | gap-fill | If you had asked me, I ___ (help) you with your homework. [en, 1 blank(s)] | would have helped (full) ; would've helped (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.010 | gap-fill | She ___ (call) you if she ___ (have) your number. [en, 2 blank(s)] | would have called \| had had (full) ; would've called \| had had (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.011 | gap-fill | If you buy Fair Trade products, you ___ (help) small farmers. [en, 1 blank(s)] | will help (full) ; 'll help (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.012 | gap-fill | If it rains tomorrow, we ___ (stay) at home. [en, 1 blank(s)] | will stay (full) ; 'll stay (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.013 | gap-fill | If I ___ (be) you, I would join the Fair Trade project. [en, 1 blank(s)] | were (full) ; was (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.gf.014 | gap-fill | If I had more time, I ___ (travel) around the world. [en, 1 blank(s)] | would travel (full) ; 'd travel (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.gs.001 | group-sort | Welcher Typ ist es? Ordne jeden Satz dem richtigen Muster zu. [de] | — | — | — | — | if + will: If you buy Fair Trade, you will help farmers., If I have time, I will visit you. \| if + would: If I were rich, I would buy a farm., If I had more time, I would travel. \| if + would have: If they had invited me, I would have come., If she had studied, she would have arrived first. | false |
| g4u10.gi.third-conditional.gs.002 | group-sort | Richtiger if-Satz oder falsch? [de] | — | — | — | — | if + had: If I had studied, If she had arrived, If they had asked \| if + would have: If I would have studied, If she would have arrived, If they would have asked | false |
| g4u10.gi.third-conditional.gs.004 | group-sort | Zeit von früher (vorbei) oder jetzt vorgestellt? Ordne die Hauptsätze zu. [de] | — | — | — | — | would have come: I would have helped, she would have come, we would have stayed \| would come: I would help, she would come, we would stay | false |
| g4u10.gi.third-conditional.mc.001 | multiple-choice | If we had left earlier, we ___ on time. [en, 1 blank(s)] | would have arrived (full) | — | would arrive ; had arrived ; arrived | — | — | false |
| g4u10.gi.third-conditional.mc.002 | multiple-choice | If she ___ harder, she would have come first in the race. [en, 1 blank(s)] | had studied (full) | — | would have studied ; studied ; has studied | — | — | false |
| g4u10.gi.third-conditional.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | If I had studied, I would have arrived first. (full) | — | If I would have studied, I would have arrived first. ; If I had studied, I would arrived first. ; If I studied, I would have arrived first. | — | — | false |
| g4u10.gi.third-conditional.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | If they had invited me, I would have come. (full) | — | If they had invited me, I would came. ; If they invited me, I would have come. ; If they would have invited me, I would have come. | — | — | false |
| g4u10.gi.third-conditional.mc.005 | multiple-choice | If she hadn't missed the train, she ___. [en, 1 blank(s)] | wouldn't have been late (full) | — | won't be late ; wasn't late ; wouldn't be late | — | — | false |
| g4u10.gi.third-conditional.mc.006 | multiple-choice | Es ist zu spät, es ist schon vorbei. Welcher Satz passt? [de] | If it had rained, we would have stayed at home. (full) | — | If it rains, we will stay at home. ; If it rained, we would stay at home. ; If it rains, we would have stayed at home. | — | — | false |
| g4u10.gi.third-conditional.mc.007 | multiple-choice | If I had known, I ___ you. [en, 1 blank(s)] | would have helped (full) | — | would help ; had helped ; help | — | — | false |
| g4u10.gi.third-conditional.mc.009 | multiple-choice | Welcher Satz beschreibt die Zeit von früher, die nicht passiert ist? [de] | If we had had more money, we would have bought it. (full) | — | If we had more money, we would have bought it. ; If we had had more money, we would buy it. ; If we have more money, we will buy it. | — | — | false |
| g4u10.gi.third-conditional.mt.001 | matching | Welcher Hauptsatz passt zu welchem if-Satz? [de] | — | — | — | If I had woken up earlier, ↔ I wouldn't have arrived late for school. ; If she hadn't lost the tickets, ↔ we would have come to the concert. ; If we had studied together, ↔ we would have done well in the exam. ; If Tom had listened to the teacher, ↔ he would have understood the lesson. | — | false |
| g4u10.gi.third-conditional.mt.002 | matching | Welcher zweite Teil passt? Achte auf den Typ. [de] | — | — | — | If it rains tomorrow, ↔ we will stay at home. ; If I were you, ↔ I would talk to him. ; If she had studied, ↔ she would have passed the exam. ; If you had asked, ↔ I would have helped you. | — | false |
| g4u10.gi.third-conditional.qf.001 | question-formation | Frag deine Freundin, was sie gemacht hätte, wenn sie mehr Zeit gehabt hätte. Beginne mit: What ... [de] | What would you have done if you had had more time? (full) ; What would you have done if you'd had more time? (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.qf.002 | question-formation | Frag deinen Freund, was er machen würde, wenn er reich wäre. Beginne mit: What ... [de] | What would you do if you were rich? (full) ; What would you do if you was rich? (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.sb.001 | sentence-building | if / I / had / known / , / I / would / have / helped / you [en] | If I had known, I would have helped you. (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.sb.002 | sentence-building | if / she / had / studied / , / she / would / have / arrived / first [en] | If she had studied, she would have arrived first. (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.sb.003 | sentence-building | if / they / hadn't / missed / the / train / , / they / wouldn't / have / been / late [en] | If they hadn't missed the train, they wouldn't have been late. (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.sb.004 | sentence-building | if / Vicente / had / joined / earlier / , / he / would / have / saved / money [en] | If Vicente had joined earlier, he would have saved money. (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.tf.005 | transformation | Mach aus diesem Satz den 2. Typ (vorgestellt, jetzt): If I have time, I will help you. [de] | If I had time, I would help you. (full) ; had time \| would help you (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.tf.007 | transformation | Bilde einen Satz vom 3. Typ (if + had + 3. Form → would have + 3. Form): 'She missed the train. She arrived late.' [de] | If she hadn't missed the train, she wouldn't have arrived late. (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.tf.008 | transformation | Bilde einen Satz vom 3. Typ (if + had + 3. Form → would have + 3. Form): 'Die Firma hat keinen fairen Preis gezahlt. Sofias Vater hat die Farm verkauft.' [de] | If the company had paid a fair price, Sofia's dad wouldn't have sold the farm. (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.tf.009 | transformation | Bilde einen Satz vom 3. Typ (if + had + 3. Form → would have + 3. Form): 'We didn't invite Tom. He didn't come.' [de] | If we had invited Tom, he would have come. (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.tf.010 | transformation | Mach aus diesem Satz den 3. Typ (die Zeit von früher, schon vorbei): If I were rich, I would buy a farm. [de] | If I had been rich, I would have bought a farm. (full) ; had been rich \| would have bought a farm (partial) | — | — | — | — | false |
| g4u10.gi.third-conditional.tf.011 | transformation | Du hast nicht um Hilfe gefragt und bist durchgefallen. Drücke dein Bedauern als Satz vom 3. Typ aus. [de] | If I had asked for help, I wouldn't have failed. (full) ; If I had asked for help, I would not have failed. (full) | — | — | — | — | false |
| g4u10.gi.third-conditional.tr.001 | translation | Wenn ich das gewusst hätte, hätte ich dir geholfen. [de] | If I had known that, I would have helped you. (full) ; If I had known, I would have helped you. (full) ; If I'd known that, I would've helped you. (partial) ; I would have helped you if I had known that. (partial) | deToEn | — | — | — | false |
| g4u10.gi.third-conditional.tr.002 | translation | Wenn sie früher losgefahren wären, wären sie pünktlich angekommen. [de] | If they had left earlier, they would have arrived on time. (full) ; If they had set off earlier, they would have arrived on time. (full) ; They would have arrived on time if they had left earlier. (partial) | deToEn | — | — | — | false |
| g4u10.gi.third-conditional.tr.003 | translation | Wenn es morgen regnet, bleiben wir zu Hause. [de] | If it rains tomorrow, we will stay at home. (full) ; If it rains tomorrow, we'll stay at home. (partial) ; We will stay at home if it rains tomorrow. (partial) | deToEn | — | — | — | false |
| g4u10.gi.third-conditional.tr.004 | translation | Wenn ich reich wäre, würde ich um die Welt reisen. [de] | If I were rich, I would travel around the world. (full) ; If I was rich, I would travel around the world. (partial) ; I would travel around the world if I were rich. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u10/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u10",
  "lens": "answers",
  "itemsHash": "2a4426bd419e",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 91, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
