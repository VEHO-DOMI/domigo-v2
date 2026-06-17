# Verify lens — answers — g1-u11 (round 2)

<!-- domigo:verify answers g1-u11 items=e2b0f58f9867 prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (58)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u11.w.9-a-m | 9 a.m. | The time early in the morning when many children go to school. | School begins at ___ in the morning, so we go in. | 9 a.m. (full) | 9 a.m. (full) | 9 p.m. ; midday ; midnight |
| g1u11.w.9-o-clock | 9 o'clock | The time when the clock shows the small number and no minutes. | The clock shows ___, with no minutes more. | 9 o'clock (full) | 9 o'clock (full) | half past nine ; (a) quarter to ten ; midday |
| g1u11.w.9-p-m | 9 p.m. | The time late in the evening when many children go to bed. | My favourite programme is on at ___ in the evening. | 9 p.m. (full) | 9 p.m. (full) | 9 a.m. ; midday ; midnight |
| g1u11.w.amazing | amazing | Very, very good — so good that you go wow! | Tim has got something ___ for Suzy in the park. | amazing (full) | amazing (full) | daily ; outside ; free time |
| g1u11.w.bedtime | bedtime | The time at night when you go to sleep. | It's 9 o'clock at night, so it is ___ for the children. | bedtime (full) | bedtime (full) | break ; free time ; midday |
| g1u11.w.break | break | A short time in school when you eat and play. | At a quarter to nine we have a ___ and eat something. | break (full) | break (full) | bedtime ; clock ; exercise |
| g1u11.w.bush | bush | A small plant with many leaves, smaller than a tree. | The dog is hiding behind the big ___ in the park. | bush (full) | bush (full) | road ; clock ; surprise |
| g1u11.w.clock | clock | A thing on the wall that shows you the time. | I look at the ___ on the wall to get the time. | clock (full) | clock (full) | road ; bush ; knock |
| g1u11.w.clue | clue | A little help so you can find the answer. | I can't find the answer. Please give me a ___! | clue (full) | clue (full) | clock ; knock ; surprise |
| g1u11.w.daily | daily | Happening every day. | At a quarter to ten we do our ___ exercise outside. | daily (full) | daily (full) | amazing ; outside ; free time |
| g1u11.w.excuse-me | Excuse me. | Nice words for somebody before you ask them something. | ___ What time is it, please? | Excuse me. (full) ; Excuse me (partial) | Excuse me. (full) ; Excuse me (full) | Have fun! ; See you soon. ; Hurry up. |
| g1u11.w.exercise | exercise | When you run and jump to make your body healthy. | Running and jumping outside are good ___ for you. | exercise (full) | exercise (full) | break ; clock ; weather |
| g1u11.w.free-time | free time | When you have no school and can do what you like. | In my ___ I like to read a book or ride my bike. | free time (full) | free time (full) | bedtime ; break ; exercise |
| g1u11.w.half-an-hour | half an hour | 30 minutes. | The train comes in ___, so we wait 30 minutes. | half an hour (full) | half an hour (full) | midday ; bedtime ; free time |
| g1u11.w.half-past-nine | half past nine | 30 minutes after the clock shows 9. | I have my breakfast at ___, 30 minutes after 9. | half past nine (full) | half past nine (full) | (a) quarter past nine ; (a) quarter to ten ; 9 o'clock |
| g1u11.w.have-fun | Have fun! | Nice words for somebody who is going to do something good. | You're going to the park? ___ See you soon! | Have fun! (full) ; Have fun (partial) | Have fun! (full) ; Have fun (full) | See you soon. ; Excuse me. ; Hurry up. |
| g1u11.w.hurry-up | Hurry up. | Words for somebody who must be fast. | ___ The train leaves in five minutes! | Hurry up. (full) ; Hurry up (partial) | Hurry up. (full) ; Hurry up (full) | See you soon. ; Have fun! ; Excuse me. |
| g1u11.w.it-s-10-a-m | It's 10 a.m. | Words for the time when the clock shows ten in the morning. | ___ in the morning, and our English class begins now. | It's 10 a.m. (full) ; It's 10 a.m (partial) | It's 10 a.m. (full) ; It's 10 a.m (full) | It's 8 p.m. ; What time is it? ; See you soon. |
| g1u11.w.it-s-8-p-m | It's 8 p.m. | Words for the time when the clock shows eight in the evening. | ___ in the evening, and it is night outside now. | It's 8 p.m. (full) ; It's 8 p.m (partial) | It's 8 p.m. (full) ; It's 8 p.m (full) | It's 10 a.m. ; What's the time? ; Excuse me. |
| g1u11.w.knock | knock | The noise when somebody puts a hand on a door again and again. | There's a ___ at the door. Somebody is here. | knock (full) | knock (full) | surprise ; clock ; road |
| g1u11.w.living-room | living room | The place where you sit and watch TV with the family. | Mum is watching TV in the ___. | living room (full) | living room (full) | road ; place ; bush |
| g1u11.w.midday | midday | The time in the day when the clock shows 12 and we often have lunch. | We have lunch at ___, when the clock shows 12. | midday (full) | midday (full) | midnight ; bedtime ; 9 p.m. |
| g1u11.w.midnight | midnight | The time when the clock shows 12 late at night. | It is very late at night. The clock shows ___. | midnight (full) | midnight (full) | midday ; 9 a.m. ; bedtime |
| g1u11.w.outside | outside | Not in a room, but in the open air. | It is a nice day. Let's play ___ in the park! | outside (full) | outside (full) | daily ; amazing ; free time |
| g1u11.w.place | place | The home where somebody lives. | Can you come to my ___ after school today? | place (full) | place (full) | road ; clock ; weather |
| g1u11.w.programme | programme | A show that you watch on TV. | There is a great ___ on TV at 7 o'clock. | programme (full) | programme (full) | text message ; clock ; road |
| g1u11.w.quarter-past-nine | (a) quarter past nine | 15 minutes after the clock shows 9. | It is ___, so it is 15 minutes after 9. | quarter past nine (full) ; a quarter past nine (full) | quarter past nine (full) ; a quarter past nine (full) | half past nine ; (a) quarter to ten ; 9 o'clock |
| g1u11.w.quarter-to-ten | (a) quarter to ten | 15 minutes before the clock shows 10. | It is ___, 15 minutes before 10. Let's hurry! | quarter to ten (full) ; a quarter to ten (full) | quarter to ten (full) ; a quarter to ten (full) | (a) quarter past nine ; half past nine ; 9 o'clock |
| g1u11.w.road | road | A long way where cars go from place to place. | I'm walking down the ___ to the park. | road (full) | road (full) | clock ; bush ; place |
| g1u11.w.see-you-soon | See you soon. | Nice words for a friend at the end, before going away. | I have to go now. ___ Call me tomorrow! | See you soon. (full) ; See you soon (partial) | See you soon. (full) ; See you soon (full) | Have fun! ; Excuse me. ; Hurry up. |
| g1u11.w.surprise | surprise | Something nice that you did not get before. | Tim has got a ___ for Suzy. She is happy! | surprise (full) | surprise (full) | knock ; clock ; weather |
| g1u11.w.text-message | text message | A short note that you get on your phone. | I got a ___ from my friend on my phone. | text message (full) | text message (full) | programme ; clock ; weather |
| g1u11.w.to-answer-the-door | to answer the door | To go and open up when somebody knocks. | Somebody is at the door. Can you ___, please? | answer the door (full) ; to answer the door (partial) | answer the door (full) ; to answer the door (full) | to hide ; to push ; to look after |
| g1u11.w.to-cook | to cook | To make food on the hot stove. | My dad likes to ___ pizza for dinner. | cook (full) ; to cook (partial) | cook (full) ; to cook (full) | to watch TV ; to skate ; to play football |
| g1u11.w.to-cook-2 | to cook | To make a hot dinner for the family to eat. | My mum likes to ___ a big dinner for the family. | cook (full) ; to cook (partial) | cook (full) ; to cook (full) | to study ; to push ; to hide |
| g1u11.w.to-go-to-bed | to go to bed | To get in and sleep at night. | I always ___ at nine o'clock at night. | go to bed (full) ; to go to bed (partial) | go to bed (full) ; to go to bed (full) | to go to school ; to wake somebody up ; to study |
| g1u11.w.to-go-to-school | to go to school | To walk in the morning to your class and study. | Mary likes to ___ at a quarter to eight every day. | go to school (full) ; to go to school (partial) | go to school (full) ; to go to school (full) | to go to bed ; to study ; to hurry |
| g1u11.w.to-hide | to hide | To go behind a tree or a bush so your friends can't find you. | Let's ___ behind the big tree in the park. | hide (full) ; to hide (partial) | hide (full) ; to hide (full) | to push ; to study ; to cook |
| g1u11.w.to-hurry | to hurry | To do something very fast. | We are late! Let's ___ to school. | hurry (full) ; to hurry (partial) | hurry (full) ; to hurry (full) | to study ; to hide ; to cook |
| g1u11.w.to-look-after | to look after | To give food and help to a pet or a child. | Can you ___ my dog for a week? I am away. | look after (full) ; to look after (partial) | look after (full) ; to look after (full) | to push ; to hide ; to hurry |
| g1u11.w.to-play-computer-games | to play computer games | To have fun on a screen in your free time. | My friend likes to ___ on his computer in the evening. | play computer games (full) ; to play computer games (partial) | play computer games (full) ; to play computer games (full) | to play football ; to watch TV ; to skate |
| g1u11.w.to-play-football | to play football | To kick a ball with your feet in a team game. | The boys like to ___ in the park after school. | play football (full) ; to play football (partial) | play football (full) ; to play football (full) | to play the piano ; to watch TV ; to cook |
| g1u11.w.to-play-the-piano | to play the piano | To make music on a big thing with white and black keys. | She can ___ very well. The music is great! | play the piano (full) ; to play the piano (partial) | play the piano (full) ; to play the piano (full) | to play football ; to ride a bike ; to cook |
| g1u11.w.to-push | to push | To move something away from you with your hands. | ___ the big door with both hands to open it. | Push (full) ; push (full) ; to push (partial) | push (full) ; to push (full) | to hide ; to cook ; to study |
| g1u11.w.to-ride-a-bike | to ride a bike | To go on a thing with two wheels that you push with your feet. | In my free time I like to ___ in the park. | ride a bike (full) ; to ride a bike (partial) | ride a bike (full) ; to ride a bike (full) | to ride a horse ; to ride a scooter ; to skate |
| g1u11.w.to-ride-a-horse | to ride a horse | To sit on a big farm animal and go on it. | My sister goes to the farm to ___ every Sunday. | ride a horse (full) ; to ride a horse (partial) | ride a horse (full) ; to ride a horse (full) | to ride a bike ; to ride a scooter ; to ski |
| g1u11.w.to-ride-a-scooter | to ride a scooter | To go on a thing with two small wheels, with one foot down. | She likes to ___ to the park on two small wheels. | ride a scooter (full) ; to ride a scooter (partial) | ride a scooter (full) ; to ride a scooter (full) | to ride a bike ; to ride a horse ; to skateboard |
| g1u11.w.to-skate | to skate | To go on the ice with special shoes on your feet. | When it is cold we go on the ice to ___ with our friends. | skate (full) ; to skate (partial) | skate (full) ; to skate (full) | to ski ; to snowboard ; to skateboard |
| g1u11.w.to-skateboard | to skateboard | To go on a small board with four wheels under it. | Tim likes to ___ in the park with his friends. | skateboard (full) ; to skateboard (partial) | skateboard (full) ; to skateboard (full) | to skate ; to ski ; to snowboard |
| g1u11.w.to-ski | to ski | To go down the snow on two long boards on your feet. | When it snows, Mum and Dad like to ___ down the snow. | ski (full) ; to ski (partial) | ski (full) ; to ski (full) | to snowboard ; to skate ; to skateboard |
| g1u11.w.to-snow | to snow | When soft white ice comes down from the sky. | Look! It is cold and it is ___. | snowing (full) ; snow (partial) ; to snow (partial) | snow (full) ; to snow (full) ; snowing (full) | to ski ; to skate ; to hide |
| g1u11.w.to-snowboard | to snowboard | To go down the snow on one wide board, with both feet on it. | Jack likes to ___ down the snow on one big board. | snowboard (full) ; to snowboard (partial) | snowboard (full) ; to snowboard (full) | to ski ; to skate ; to skateboard |
| g1u11.w.to-study | to study | To read a lot for a test at school. | I need to ___ for my big English test tomorrow. | study (full) ; to study (partial) | study (full) ; to study (full) | to hurry ; to cook ; to hide |
| g1u11.w.to-wake-somebody-up | to wake somebody up | To make a sleeping child or adult open their eyes. | Mum has to ___ in the morning because I sleep a lot. | wake somebody up (full) ; to wake somebody up (partial) ; wake me up (partial) | wake somebody up (full) ; to wake somebody up (full) | to go to bed ; to go to school ; to study |
| g1u11.w.to-watch-tv | to watch TV | To look at programmes on the big screen at your place. | After dinner we like to ___ in the living room. | watch TV (full) ; to watch TV (partial) | watch TV (full) ; to watch TV (full) | to play football ; to cook ; to study |
| g1u11.w.weather | weather | If it is cold, nice, or it snows outside. | The ___ is nice today, so let's go to the park. | weather (full) | weather (full) | clock ; road ; programme |
| g1u11.w.what-s-the-time | What's the time? | You ask this to find out how late it is. | ___ — It's half past nine now. | What's the time? (full) ; What's the time (partial) | What's the time? (full) ; What's the time (full) | What time is it? ; Excuse me. ; Have fun! |
| g1u11.w.what-time-is-it | What time is it? | You ask this to get the hour from a clock right now. | ___ I don't want to be late! | What time is it? (full) ; What time is it (partial) | What time is it? (full) ; What time is it (full) | What's the time? ; Excuse me. ; Have fun! |

## Grammar items (38)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u11.gi.present-continuous.ag.001 | anagram | Die -ing-Form von 'cook': [de] | cooking (full) | — | — | — | — | false |
| g1u11.gi.present-continuous.ag.002 | anagram | Die -ing-Form von 'ride': [de] | riding (full) | — | — | — | — | false |
| g1u11.gi.present-continuous.ag.003 | anagram | Die kurze Form von 'is not': [de] | isn't (full) | — | — | — | — | false |
| g1u11.gi.present-continuous.cp.001 | context-picker | Deine Freunde sind gerade im Park. Welcher Satz ist richtig? [de] | They are playing football right now. (full) | — | They play football right now. ; They playing football right now. ; They are play football right now. | — | — | false |
| g1u11.gi.present-continuous.cp.002 | context-picker | Suzy sitzt im Wohnzimmer und spielt mit ihrem Handy. Welcher Satz passt? [de] | Suzy is playing with her phone. (full) | — | Suzy plays with her phone. ; Suzy playing with her phone. ; Suzy is play with her phone. | — | — | false |
| g1u11.gi.present-continuous.cp.003 | context-picker | Du riechst etwas Gutes aus der Küche. Du fragst nach deinem Papa. Welche Frage ist richtig? [de] | Is he cooking dinner? (full) | — | Does he cooking dinner? ; Is he cook dinner? ; He is cooking dinner? | — | — | false |
| g1u11.gi.present-continuous.ec.001 | error-correction | She playing football right now. [en] | She is playing football right now. (full) ; She's playing football right now. (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.ec.002 | error-correction | Do you playing computer games? [en] | Are you playing computer games? (full) | — | — | — | — | false |
| g1u11.gi.present-continuous.ec.003 | error-correction | She doesn't reading a book. [en] | She isn't reading a book. (full) ; She is not reading a book. (full) ; She's not reading a book. (partial) | — | — | — | — | true |
| g1u11.gi.present-continuous.ec.004 | error-correction | He are watching TV. [en] | He is watching TV. (full) ; He's watching TV. (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.gf.001 | gap-fill | Look! Dana ___ TV right now. [en, 1 blank(s)] | is watching (full) ; 's watching (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.gf.003 | gap-fill | They ___ football right now. [en, 1 blank(s)] | are playing (full) ; 're playing (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.gf.004 | gap-fill | He ___ his bike to school today. [en, 1 blank(s)] | is riding (full) ; 's riding (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.gf.005 | gap-fill | We ___ dinner now. We aren't eating pizza. [en, 1 blank(s)] | are cooking (full) ; 're cooking (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.gf.006 | gap-fill | She ___ to music right now. (not) [en, 1 blank(s)] | isn't listening (full) ; is not listening (full) ; 's not listening (partial) | — | — | — | — | true |
| g1u11.gi.present-continuous.gf.008 | gap-fill | It's very cold outside and it ___. (snow) [en, 1 blank(s)] | is snowing (full) ; 's snowing (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.gf.009 | gap-fill | What ___ you ___ right now? [en, 2 blank(s)] | are \| doing (full) | — | — | — | — | false |
| g1u11.gi.present-continuous.gf.010 | gap-fill | Jack ___ and Mum and Dad ___. (snowboard / ski) [en, 2 blank(s)] | is snowboarding \| are skiing (full) ; 's snowboarding \| are skiing (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.gf.011 | gap-fill | I ___ a book right now. [en, 1 blank(s)] | am reading (full) ; 'm reading (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.gf.013 | gap-fill | Peter ___ the piano right now. [en, 1 blank(s)] | is playing (full) ; 's playing (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.gs.001 | group-sort | Welche kurze Form von be passt? Sortiere die Sätze. [de] | — | — | — | — | is: She ___ cooking dinner., He ___ riding his bike., Dana ___ watching TV., Peter ___ playing football. \| are: They ___ playing the piano., We ___ cooking dinner., You ___ watching TV., Mum and Dad ___ skiing. | false |
| g1u11.gi.present-continuous.gs.002 | group-sort | Sortiere: sagt der Satz ja oder nein? [de] | — | — | — | — | Yes (+): She is watching TV., They are playing football., He is cooking dinner. \| No (–): She isn't watching TV., They aren't playing football., He isn't cooking dinner. | false |
| g1u11.gi.present-continuous.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | She is cooking an egg. (full) | — | She cooking an egg. ; She do cooking an egg. ; She cook an egg. | — | — | false |
| g1u11.gi.present-continuous.mc.002 | multiple-choice | Welche Frage ist richtig? [de] | Are you playing computer games? (full) | — | Do you playing computer games? ; You are playing computer games? ; Is you playing computer games? | — | — | false |
| g1u11.gi.present-continuous.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | They are riding their bikes. (full) | — | They riding their bikes. ; They is riding their bikes. ; They are rideing their bikes. | — | — | false |
| g1u11.gi.present-continuous.mc.004 | multiple-choice | Look! Dana ___ a book. [en, 1 blank(s)] | is reading (full) | — | reading ; are reading ; read | — | — | false |
| g1u11.gi.present-continuous.mp.002 | matching-pairs | Was passt zusammen? [de] | — | — | — | play ↔ playing ; ride ↔ riding ; cook ↔ cooking ; watch ↔ watching ; study ↔ studying ; skate ↔ skating | — | false |
| g1u11.gi.present-continuous.mt.001 | matching | Frage und passende Kurzantwort [de] | — | — | — | Are you playing a computer game? ↔ Yes, I am. ; Is Peter doing his homework? ↔ No, he isn't. ; Are Jennifer and Christine reading? ↔ Yes, they are. ; Is Dana watching TV? ↔ No, she isn't. | — | false |
| g1u11.gi.present-continuous.qf.001 | question-formation | She is reading a book. → Stell eine Ja/Nein-Frage. [de] | Is she reading a book? (full) ; Is she reading? (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.qf.002 | question-formation | Peter is doing his homework. → Stell eine Ja/Nein-Frage. [de] | Is Peter doing his homework? (full) ; Is Peter doing homework? (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.sb.001 | sentence-building | she / is / her / doing / homework [en] | She is doing her homework. (full) ; She's doing her homework. (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.sb.002 | sentence-building | they / are / football / playing [en] | They are playing football. (full) ; They're playing football. (partial) | — | — | — | — | false |
| g1u11.gi.present-continuous.sb.003 | sentence-building | you / are / a / playing / game / computer [en] | Are you playing a computer game? (full) | — | — | — | — | false |
| g1u11.gi.present-continuous.tf.001 | transformation | They are playing football. → Mach den Satz verneint: They ___ football. [de, 1 blank(s)] | aren't playing (full) ; are not playing (full) ; 're not playing (partial) | — | — | — | — | true |
| g1u11.gi.present-continuous.tf.002 | transformation | He is cooking dinner. → Mach eine Frage daraus: ___ he ___ dinner? [de, 2 blank(s)] | Is \| cooking (full) | — | — | — | — | false |
| g1u11.gi.present-continuous.tf.003 | transformation | She is watching TV. → Mach den Satz verneint: She ___ TV. [de, 1 blank(s)] | isn't watching (full) ; is not watching (full) ; 's not watching (partial) | — | — | — | — | true |
| g1u11.gi.present-continuous.tr.001 | translation | Sie spielt gerade Klavier. [de] | She is playing the piano. (full) ; She's playing the piano. (partial) | deToEn | — | — | — | false |
| g1u11.gi.present-continuous.tr.002 | translation | Schläfst du gerade? – Nein. [de] | Are you sleeping? – No, I'm not. (full) ; Are you sleeping? No, I am not. (full) ; Are you sleeping? No, I'm not. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u11/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u11",
  "lens": "answers",
  "itemsHash": "e2b0f58f9867",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 96, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
