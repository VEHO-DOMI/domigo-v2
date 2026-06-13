# Verify lens — answers — g2-u01 (round 6)

<!-- domigo:verify answers g2-u01 items=015265583952 prompt=70fa2d8cdf22 round=6 -->

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

## Vocab items (48)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u01.w.along | along | From one end of a thing to the end of it. | We go ___ the long street to school. | along (full) | along (full) | across ; under ; into |
| g2u01.w.area | area | a place in a town or city | There is a lot of rubbish in this ___ of the town. | area (full) ; areas (partial) | area (full) ; areas (full) | country ; garden ; river |
| g2u01.w.art | art | The subject where you paint and make pictures. | I painted a picture of my dog in ___. | art (full) | art (full) | music ; science ; maths |
| g2u01.w.as-soon-as | as soon as | At once, just after one thing happens. | I have breakfast ___ I get up in the morning. | as soon as (full) ; after (partial) | as soon as (full) | because ; before ; but |
| g2u01.w.bicycle-lane | bicycle lane | It is on the road, but cars do not go on it. | There is a new ___ in my town now. | bicycle lane (full) ; bicycle lanes (partial) ; bike lane (partial) | bicycle lane (full) ; bicycle lanes (full) ; bike lane (partial) | timetable ; calendar ; shadow |
| g2u01.w.break | break | A short time to play and eat after a lesson at school. | In the ___ we go outside and play. | break (full) | break (full) ; breaks (full) | lesson ; subject ; timetable |
| g2u01.w.calendar | calendar | A thing that shows you all the days and months of a year. | It shows all the days of the year. It is like a big ___. | calendar (full) | calendar (full) ; calendars (full) | timetable ; webpage ; ticket |
| g2u01.w.colourful | colourful | A thing with red, purple, white and many more in it. | There are many ___ parrots at the zoo. | colourful (full) ; colorful (partial) | colourful (full) ; colorful (partial) | scary ; popular ; noisy |
| g2u01.w.daily | daily | Happening every day. | I get up at seven o'clock every day. It is my ___ life. | daily (full) | daily (full) | early ; free ; scary |
| g2u01.w.design-and-technology | design and technology | The school subject where you make and paint a box or a car. | In ___ we make and paint a small box. | design and technology (full) | design and technology (full) | art ; music ; science |
| g2u01.w.english | English | The subject where you read and write stories from Britain. | We have ___ and read stories from Britain. | English (full) | English (full) | French ; music ; geography |
| g2u01.w.french | French | The subject you study to talk to people in France. | My sister studies ___ so she can talk to people in France. | French (full) | French (full) | English ; music ; science |
| g2u01.w.geography | geography | The subject about countries, cities and rivers. | In ___ we read about countries, cities and rivers. | geography (full) | geography (full) | history ; science ; maths |
| g2u01.w.glad | glad | Very happy about a good thing. | I was ___ to stay at home with my family. | glad (full) | glad (full) ; happy (partial) | sad ; angry ; tired |
| g2u01.w.grandmother | grandmother | the mother of your mum or dad | My ___ lives in Mexico. | grandmother (full) ; grandmothers (partial) | grandmother (full) ; grandmothers (full) | mother ; aunt ; daughter |
| g2u01.w.history | history | The school subject about kings, queens and famous people from the past. | In ___ we read about famous people from the past. | history (full) | history (full) | geography ; science ; maths |
| g2u01.w.information-technology | information technology (IT) | The school subject where you work on computer games and webpages. | In ___ we play computer games and make a webpage. | information technology (full) ; IT (full) | information technology (full) ; IT (full) | science ; geography ; art |
| g2u01.w.joke | joke | a short story you tell to make people laugh | We all laughed at Tom's good ___. | joke (full) ; jokes (partial) | joke (full) ; jokes (full) | poem ; letter ; picture |
| g2u01.w.kilometre | kilometre | How long a road is. A road can be one, two or many of them. | My new school is one ___ from the park. | kilometre (full) ; kilometer (partial) | kilometre (full) ; kilometres (full) ; kilometer (partial) ; kilometers (partial) | area ; shadow ; calendar |
| g2u01.w.king | king | A man who can make the rules. | A ___ can make the rules. | king (full) ; kings (partial) | king (full) ; kings (full) | queen ; guide ; captain |
| g2u01.w.lesson | lesson | A time at school when you study one subject. | Our first ___ begins in the morning, at seven o'clock. | lesson (full) | lesson (full) ; lessons (full) | break ; timetable ; subject |
| g2u01.w.maths | maths | The subject where you work with numbers. | I like ___ because I am good with numbers. | maths (full) ; math (partial) | maths (full) ; math (partial) | science ; geography ; history |
| g2u01.w.music | music | The subject where you play the guitar. | We play the guitar in our ___ lesson. | music (full) | music (full) | art ; maths ; geography |
| g2u01.w.noisy | noisy | Making a lot of noise. | I do not like ___ people. | noisy (full) | noisy (full) | scary ; colourful ; popular |
| g2u01.w.online-safety | online safety | How to be careful with a tablet or mobile phone. | Our teacher talked about ___ in class today. | online safety (full) | online safety (full) | opinion ; timetable ; calendar |
| g2u01.w.opinion | opinion | What you think about a thing. | In my ___, this is the best book. | opinion (full) ; opinions (partial) | opinion (full) ; opinions (full) | joke ; calendar ; area |
| g2u01.w.physical-education | physical education (PE) | The subject where you run, jump and play outside. | In ___ we run, jump and play outside. | PE (full) ; physical education (full) | PE (full) ; physical education (full) | art ; music ; history |
| g2u01.w.popular | popular | that many people like very much | Maths is a ___ subject at our school. | popular (full) | popular (full) | expensive ; dangerous ; noisy |
| g2u01.w.queen | queen | A woman who can make the rules. | A ___ can make the rules. | queen (full) ; queens (partial) | queen (full) ; queens (full) | king ; guide ; captain |
| g2u01.w.rubbish | rubbish | Food, bottles and boxes that you do not want any more. | There is too much ___ in the street. | rubbish (full) | rubbish (full) | area ; shadow ; calendar |
| g2u01.w.scary | scary | It makes you scared. | The story was very ___ and I was scared. | scary (full) | scary (full) | pretty ; sunny ; colourful |
| g2u01.w.science | science | The subject where you study light, space and the Earth. | We study light and space in ___. | science (full) | science (full) ; sciences (partial) | geography ; maths ; history |
| g2u01.w.shadow | shadow | a dark place on the wall behind a thing in the light | Look — there is a dark ___ behind me on the wall. | shadow (full) ; shadows (partial) | shadow (full) ; shadows (full) | light ; mirror ; cloud |
| g2u01.w.spring | spring | the time of year after the cold months and before summer | My birthday is in ___, in May. | spring (full) | spring (full) | summer ; evening ; weekend |
| g2u01.w.subject | (school) subject | Maths, art, music and history are all kinds of these. | English is my favourite ___ of all. | subject (full) ; school subject (partial) | subject (full) ; subjects (full) ; school subject (full) | lesson ; break ; timetable |
| g2u01.w.supper | supper | The food you eat in the evening. | In the evening we eat ___. | supper (full) ; dinner (partial) | supper (full) | breakfast ; lunch ; lesson |
| g2u01.w.timetable | timetable | It shows you what lessons you have on every day of the week. | She has four English lessons in her ___. | timetable (full) | timetable (full) ; timetables (full) | calendar ; lesson ; subject |
| g2u01.w.to-book | to book | to pay for a place or ticket before you go | You can ___ your holiday today. | book (full) ; to book (partial) ; books (partial) ; booked (partial) | book (full) ; to book (full) | sell ; visit ; clean |
| g2u01.w.to-crawl | to crawl | To go like a lizard, near the road and under stones. | Lizards ___ across the road and under the stones. | crawl (full) ; crawled (full) ; crawls (partial) | crawl (full) ; to crawl (full) ; crawls (full) ; crawled (full) | to travel ; to book ; to prepare |
| g2u01.w.to-get-dressed | to get dressed | To put your clothes on. | I wash, ___ and have breakfast with my mum and dad. | get dressed (full) ; got dressed (partial) | to get dressed (full) ; get dressed (full) | to put on ; to get up ; to wash |
| g2u01.w.to-go-for-a-walk | to go for a walk | To spend time outside on your feet, often with your dog. | After school, I ___ with my dog. | go for a walk (full) ; went for a walk (partial) | to go for a walk (full) ; go for a walk (full) | to take a rest ; to stay at home ; to travel |
| g2u01.w.to-prepare | to prepare | To make food before you eat it. | I help my mum to ___ food for our supper. | prepare (full) ; cook (partial) ; make (partial) | to prepare (full) ; prepare (full) | to clean ; to travel ; to visit |
| g2u01.w.to-put-on | to put on | To wear clothes like a jacket or a hat. | After breakfast, I ___ my school clothes. | put on (full) | to put on (full) ; put on (full) | to take out ; to clean ; to carry |
| g2u01.w.to-stay-at-home | to stay at home | To not go out, but to be in with your family all day. | It is cold, so we want to ___ today. | stay at home (full) | stay at home (full) ; to stay at home (full) | to travel ; to go for a walk ; to take a rest |
| g2u01.w.to-take-a-rest | to take a rest | To sit down and be still for a short time when you are tired. | After a long day at school, I ___ before I do my homework. | take a rest (full) ; took a rest (partial) ; takes a rest (partial) | take a rest (full) ; to take a rest (full) ; takes a rest (full) | to travel ; to book ; to prepare |
| g2u01.w.to-travel | to travel | To go to new places, often on a plane or a train. | My family and I ___ to many countries every summer. | travel (full) ; travelled (partial) ; traveled (partial) | travel (full) ; to travel (full) | to stay at home ; to visit ; to book |
| g2u01.w.to-visit | to visit | To go to a place or to people and be there for a time. | In the holidays we ___ our grandmother in Mexico. | visit (full) ; visited (full) | visit (full) ; to visit (full) ; visits (full) ; visited (full) | to travel ; to book ; to prepare |
| g2u01.w.webpage | webpage | You read it on a tablet or mobile phone. | Open the school ___ and read it on your tablet. | webpage (full) ; webpages (partial) ; web page (partial) | webpage (full) ; webpages (full) ; web page (partial) | calendar ; timetable ; joke |

## Grammar items (22)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u01.gi.past-simple.cp.001 | context-picker | Your friend asks what you did last weekend. [en] | Last weekend, I visited my grandmother and cooked dinner. (full) | — | Last weekend, I visit my grandmother and cook dinner. ; Last weekend, I visiting my grandmother and cooking dinner. ; Last weekend, I am visiting my grandmother and cooking dinner. | — | — | false |
| g2u01.gi.past-simple.ec.001 | error-correction | Yesterday I watch TV. [en] | Yesterday I watched TV. (full) ; watched (partial) | — | — | — | — | true |
| g2u01.gi.past-simple.ec.002 | error-correction | Last summer, my holiday is amazing. [en] | Last summer, my holiday was amazing. (full) ; was (partial) | — | — | — | — | true |
| g2u01.gi.past-simple.ff.001 | free-form | Tell your friend what you did in your last holiday. [en] | Last summer, I stayed at home and watched TV. (full) ; I visited my grandmother and we cooked dinner. (full) ; My family had a holiday in Mexico and we visited a castle. (full) ; I stayed at home. (partial) | — | — | — | — | false |
| g2u01.gi.past-simple.gf.001 | gap-fill | After dinner, I ___ a book. [en, 1 blank(s)] | read (full) | — | — | — | — | true |
| g2u01.gi.past-simple.gf.002 | gap-fill | On Sunday, I ___ my homework and ___ my room. [en, 2 blank(s)] | did \| cleaned (full) ; did \| tidied (partial) | — | — | — | — | true |
| g2u01.gi.past-simple.mc.001 | multiple-choice | Yesterday, I ___ my homework after supper. [en, 1 blank(s)] | did (full) | — | do ; does ; doing | — | — | false |
| g2u01.gi.past-simple.mc.002 | multiple-choice | Last year, my family ___ a scary holiday. [en, 1 blank(s)] | had (full) | — | have ; has ; having | — | — | false |
| g2u01.gi.past-simple.sb.001 | sentence-building | summer / I / visited / my / grandmother / last [en] | Last summer, I visited my grandmother. (full) ; I visited my grandmother last summer. (full) | — | — | — | — | false |
| g2u01.gi.past-simple.tf.001 | transformation | I visit my grandmother. (last spring) [en] | I visited my grandmother last spring. (full) ; Last spring, I visited my grandmother. (full) | — | — | — | — | true |
| g2u01.gi.past-simple.tr.001 | translation | Gestern habe ich nach dem Abendessen ferngesehen. [de] | Yesterday, I watched TV after dinner. (full) ; I watched TV after dinner yesterday. (full) ; Yesterday I watched TV after supper. (full) ; Yesterday, I watched television after dinner. (partial) | deToEn | — | — | — | false |
| g2u01.gi.present-simple.cp.001 | context-picker | It is the evening. Your sister watches TV every day, like she always does. [en] | My sister watches TV every evening. (full) | — | My sister watch TV every evening. ; My sister watching TV every evening. ; My sister doesn't watches TV every evening. | — | — | true |
| g2u01.gi.present-simple.ec.001 | error-correction | My dad cook dinner every evening. [en] | My dad cooks dinner every evening. (full) ; cooks (partial) | — | — | — | — | true |
| g2u01.gi.present-simple.ec.002 | error-correction | He don't like history. [en] | He doesn't like history. (full) ; He does not like history. (full) ; doesn't (partial) | — | — | — | — | true |
| g2u01.gi.present-simple.gf.001 | gap-fill | Every day, I ___ my homework after supper. [en, 1 blank(s)] | do (full) | — | — | — | — | true |
| g2u01.gi.present-simple.gf.002 | gap-fill | On Mondays we ___ art and music. [en, 1 blank(s)] | have (full) | — | — | — | — | true |
| g2u01.gi.present-simple.gf.003 | gap-fill | Grace gets up early. She ___ her classroom every day. [en, 1 blank(s)] | cleans (full) | — | — | — | — | true |
| g2u01.gi.present-simple.gf.004 | gap-fill | Sam likes maths, but he ___ history. [en, 1 blank(s)] | doesn't like (full) ; does not like (full) | — | — | — | — | true |
| g2u01.gi.present-simple.mc.001 | multiple-choice | My sister ___ French at school every day. [en, 1 blank(s)] | studies (full) | — | study ; watch ; go | — | — | false |
| g2u01.gi.present-simple.qf.001 | question-formation | Sam plays football every day. Ask if this is true. [en] | Does Sam play football every day? (full) | — | — | — | — | true |
| g2u01.gi.present-simple.sb.001 | sentence-building | we / music / have / on / Mondays / does / art [en] | We have music on Mondays. (full) ; We have art on Mondays. (full) | — | — | — | — | false |
| g2u01.gi.present-simple.tf.001 | transformation | I study French at school. (my sister) [en] | My sister studies French at school. (full) | — | — | — | — | true |

## Output contract

Write `content/corpus/units/g2-u01/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u01",
  "lens": "answers",
  "itemsHash": "015265583952",
  "promptHash": "70fa2d8cdf22",
  "round": 6,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 70, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
