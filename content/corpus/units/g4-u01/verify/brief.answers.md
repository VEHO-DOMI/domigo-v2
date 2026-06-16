# Verify lens — answers — g4-u01 (round 2)

<!-- domigo:verify answers g4-u01 items=f7dea74c414b prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (36)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u01.w.admire | admire | to think somebody is very good and look up to them | They all ___ the brave singer. | admired (full) | admire (full) ; admired (full) | improve ; interfere ; cheer |
| g4u01.w.be-aware-of-sth | be aware of sth | to know that a thing is happening or true | I wasn't ___ of that. | aware (full) ; aware of (partial) | be aware of sth (full) ; be aware of something (full) ; be aware of (full) ; aware (full) | independent ; fluent ; proper |
| g4u01.w.be-terrified | be terrified | to be very, very scared | Scared? I was absolutely ___! | terrified (full) | be terrified (full) ; terrified (full) | fluent ; independent ; proper |
| g4u01.w.catholic | Catholic | belonging to the church that has its head in Rome | Most people in the Republic of Ireland are ___. | Catholics (full) ; Catholic (partial) | Catholic (full) ; Catholics (full) | independent ; fluent ; leading |
| g4u01.w.cattle | cattle | what a farmer keeps in the fields to give us milk and meat | He keeps horses and ___ on his farm. | cattle (full) | cattle (full) | crop ; grain ; fungus |
| g4u01.w.cheer | cheer | to make a happy noise for a group you like | The crowd will ___ when the band comes on stage. | cheer (full) | cheer (full) ; cheered (full) | admire ; improve ; interfere |
| g4u01.w.crop | crop | the food a farmer brings in from the fields in one year | In 1845, the potato ___ in Ireland was destroyed. | crop (full) | crop (full) ; crops (full) | grain ; cattle ; famine |
| g4u01.w.famine | famine | a time when many people have no food and die | In a ___, people die because they have nothing to eat. | famine (full) | famine (full) | incident ; crop ; fungus |
| g4u01.w.fluent | fluent | good at speaking a foreign language very well | She speaks ___ English. | fluent (full) | fluent (full) | independent ; leading ; proper |
| g4u01.w.foreigner | foreigner | somebody who is from a far away country | Our city is home to many ___ from far away. | foreigners (full) ; foreigner (partial) | foreigner (full) ; foreigners (full) | member ; landlord ; government |
| g4u01.w.found | found | to begin a new country, group or city | The Irish Republic was ___ in 1922. | founded (full) | found (full) ; founded (full) | improve ; interfere ; admire |
| g4u01.w.free-state | free state | a land that rules its own people and makes its own laws | Ireland was now a ___, free to rule its own land. | free state (full) | free state (full) | government ; primary school ; majority |
| g4u01.w.fungus | fungus | a small living thing that can destroy a crop | A ___ destroyed all the potatoes in Ireland. | fungus (full) | fungus (full) ; fungi (full) | crop ; grain ; cattle |
| g4u01.w.government | government | the people who control a country and make its laws | The ___ makes the laws for the whole country. | government (full) | government (full) | majority ; member ; free state |
| g4u01.w.grain | grain | food like rice from the fields that we make bread from | You can make bread from ___. | grain (full) | grain (full) ; grains (full) | crop ; cattle ; fungus |
| g4u01.w.guess | Guess! | to find out a thing on your own, with no help | I have a secret. ___ what it is! | Guess (full) | Guess (full) ; guess (full) | cheer ; admire ; improve |
| g4u01.w.hiking | hiking | going on a long walk in the hills or mountains for fun | National Parks are always great places for ___. | hiking (full) | hiking (full) | improve ; admire ; cheer |
| g4u01.w.i-d-rather | I'd rather | used when you like one thing more than the second one | ___ stay at home than go on holiday this year. | I'd rather (full) | I'd rather (full) | Guess! ; improve ; admire |
| g4u01.w.improve | improve | to make your work or English good when it was not good before | He reads English books to ___ his English. | improve (full) | improve (full) | admire ; interfere ; found |
| g4u01.w.incident | incident | a thing that happens, usually a bad one | There was a serious ___ at school today. | incident (full) | incident (full) ; incidents (full) | famine ; intention ; majority |
| g4u01.w.independent | independent | free; a country that rules its own land | The Republic of Ireland is an ___ country. | independent (full) | independent (full) | fluent ; leading ; proper |
| g4u01.w.intention | intention | the thing you want to do | It was never my ___ to hurt you. | intention (full) | intention (full) ; intentions (full) | incident ; majority ; government |
| g4u01.w.interfere | interfere | to take part in a thing that is not yours, where you are not wanted | Please don't ___ when I am talking to my friends. | interfere (full) | interfere (full) | admire ; improve ; found |
| g4u01.w.landlord | landlord | a man who owns land or a house and rents it to people | Our ___ owns the house where we live. | landlord (full) | landlord (full) ; landlords (full) | foreigner ; member ; government |
| g4u01.w.leading | leading | the biggest and best in a job or group | She is one of the ___ singers of her time. | leading (full) | leading (full) | fluent ; independent ; proper |
| g4u01.w.majority | majority | the most people in a group | Most of the people in the north were Protestant. They were the ___. | majority (full) | majority (full) | member ; government ; foreigner |
| g4u01.w.member | member | somebody who belongs to a group or band | She is a ___ of our band. | member (full) | member (full) ; members (full) | foreigner ; landlord ; government |
| g4u01.w.nonsense | nonsense | rubbish that is not true at all | That is just ___! It is not true at all. | nonsense (full) | nonsense (full) | intention ; incident ; majority |
| g4u01.w.primary-school | primary school | the place where the youngest children read and write | Children from six to ten years old go to ___. | primary school (full) | primary school (full) | government ; free state ; landlord |
| g4u01.w.proper | proper | good and right for what you need | That's not a ___ job. Do it again! | proper (full) | proper (full) | fluent ; independent ; leading |
| g4u01.w.put-down | put down | to use the army to stop a rebellion | The army ___ the rebellion in the capital. | put down (full) | put down (full) | interfere ; found ; admire |
| g4u01.w.shake-hands | shake hands | to hold and move somebody's fingers up and down when you meet | When you meet, it is good to ___. | shake hands (full) | shake hands (full) | interfere ; cheer ; admire |
| g4u01.w.starve | starve | to be very ill or die because you have no food | The people had nothing to eat. They were ___. | starving (full) | starve (full) ; starving (full) | interfere ; improve ; cheer |
| g4u01.w.tax | tax | money that people must pay to the government | Everyone in the country has to pay ___ to the government. | taxes (full) ; tax (partial) | tax (full) ; taxes (full) | crop ; grain ; majority |
| g4u01.w.thunder | thunder | the big noise in the sky in a storm, after the flash of light | After the flash of light came the ___. | thunder (full) | thunder (full) | fungus ; incident ; famine |
| g4u01.w.unconscious | unconscious | not awake, like after an accident | She was ___ for three days after the accident. | unconscious (full) | unconscious (full) | fluent ; independent ; proper |

## Grammar items (55)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u01.gi.past-continuous-revision.cp.002 | context-picker | Du erzählst, was gestern um 15 Uhr im Park los war. Welcher Satz nutzt die richtige Form für die Hintergrund-Handlung? [de] | While she was reading, her dog jumped into the lake. (full) | — | While she read, her dog was jumping into the lake. ; While she was reading, her dog was jumping into the lake. ; While she read, her dog jumped into the lake. | — | — | false |
| g4u01.gi.past-continuous-revision.cp.003 | context-picker | Heute früh um 6 Uhr hast du aus dem Fenster geschaut. Die Straße war voller Schnee und ein Mann war draußen. Welcher Satz beschreibt am besten, was du gesehen hast? [de] | A man was cleaning the snow in the street. (full) | — | A man cleaned the snow in the street. ; A man cleans the snow in the street. ; A man is cleaning the snow in the street. | — | — | false |
| g4u01.gi.past-continuous-revision.ec.001 | error-correction | Ein Fehler bei was/were. Schreib den Satz richtig: The children was playing in the garden. [de] | The children were playing in the garden. (full) ; were (partial) | — | — | — | — | true |
| g4u01.gi.past-continuous-revision.ec.002 | error-correction | Ein Fehler bei was/were. Schreib den Satz richtig: She were watching the news when my mum called. [de] | She was watching the news when my mum called. (full) ; was (partial) | — | — | — | — | true |
| g4u01.gi.past-continuous-revision.ec.003 | error-correction | Hier fehlt eine Form von be. Schreib den Satz richtig: While I reading, my dad came home. [de] | While I was reading, my dad came home. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.ec.004 | error-correction | Hier fehlt eine Form von be. Schreib den Satz richtig: The people dancing in the street all night. [de] | The people were dancing in the street all night. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.ec.005 | error-correction | Falsche -ing-Form. Schreib den Satz richtig: My dad was cookking dinner when I came home. [de] | My dad was cooking dinner when I came home. (full) | — | — | — | — | true |
| g4u01.gi.past-continuous-revision.ec.006 | error-correction | Die kurze Handlung darf nicht in der -ing-Form stehen. Schreib den Satz richtig: While she was cooking dinner, the storm was coming. [de] | While she was cooking dinner, the storm came. (full) ; She was cooking dinner when the storm came. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.ec.007 | error-correction | Die längere Hintergrund-Handlung muss in die -ing-Form. Schreib den Satz richtig: While he walked to school, he dropped his book. [de] | While he was walking to school, he dropped his book. (full) ; He was walking to school when he dropped his book. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.ec.009 | error-correction | Ein Fehler bei was/were. Schreib den Satz richtig: We was having dinner when the storm came. [de] | We were having dinner when the storm came. (full) ; were (partial) | — | — | — | — | true |
| g4u01.gi.past-continuous-revision.ec.010 | error-correction | Falsche -ing-Form. Schreib den Satz richtig: We were swiming in the lake when the storm came. [de] | We were swimming in the lake when the storm came. (full) | — | — | — | — | true |
| g4u01.gi.past-continuous-revision.ec.011 | error-correction | want und like beschreiben einen Zustand und stehen nicht in der -ing-Form. Schreib den Satz richtig: I was wanting a new book for my birthday. [de] | I wanted a new book for my birthday. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.001 | gap-fill | Gestern um 8 Uhr abends ___ (read) Anna ein Buch. Setze was/were + die -ing-Form ein. [de, 1 blank(s)] | was reading (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.002 | gap-fill | The children ___ (play) in the garden when their friends arrived. Setze was/were + die -ing-Form ein. [de, 1 blank(s)] | were playing (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.003 | gap-fill | My dad ___ (cook) dinner when I came home. Setze was/were + die -ing-Form ein. [de, 1 blank(s)] | was cooking (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.004 | gap-fill | At 10 o'clock last night, we ___ (watch) a story about Ireland. Setze was/were + die -ing-Form ein. [de, 1 blank(s)] | were watching (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.005 | gap-fill | His sister ___ (listen) to music when my mum called her. Setze was/were + die -ing-Form ein. [de, 1 blank(s)] | was listening (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.006 | gap-fill | Schreib beide Lücken: While Mum ___ (cook), Dad ___ (clean) the kitchen. Beide Handlungen liefen gleichzeitig. [de, 2 blank(s)] | was cooking \| was cleaning (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.007 | gap-fill | Schreib beide Lücken: While the teacher ___ (read) the story, the children ___ (paint) a picture. [de, 2 blank(s)] | was reading \| were painting (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.008 | gap-fill | The sun ___ (shine) and the people ___ (dance) in the street. Setze beide Verben in die Form was/were + -ing. [de, 2 blank(s)] | was shining \| were dancing (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.009 | gap-fill | We ___ (have) dinner when the storm came. Setze was/were + die -ing-Form ein. [de, 1 blank(s)] | were having (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.010 | gap-fill | Tom ___ (wait) for me at the school when it ___ (snow). Setze beide Verben in die Form was/were + -ing. [de, 2 blank(s)] | was waiting \| was snowing (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.011 | gap-fill | His mum ___ (read) on the sofa when Johnny showed her a surprise. Setze was/were + die -ing-Form ein. [de, 1 blank(s)] | was reading (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.012 | gap-fill | While many poor people in Ireland ___ (starve), the landlords ___ (send) cattle to England. Setze beide Verben in die Form was/were + -ing. [de, 2 blank(s)] | were starving \| were sending (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.013 | gap-fill | Verneinung: I ___ (not / read) when the storm came. Schreib die volle Form mit was/were. [de, 1 blank(s)] | was not reading (full) ; wasn't reading (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.014 | gap-fill | Frage: ___ you ___ (wait) at home when the snow came? Schreib beide Lücken mit was/were. [de, 2 blank(s)] | Were \| waiting (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.015 | gap-fill | While Lucas ___ (talk) on his mobile, his friends ___ (listen) to the music. Setze beide Verben in die Form was/were + -ing. [de, 2 blank(s)] | was talking \| were listening (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.016 | gap-fill | Washington Otis ___ (clean) the floor while his family ___ (watch). Setze beide Verben in die Form was/were + -ing. [de, 2 blank(s)] | was cleaning \| was watching (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.017 | gap-fill | While James ___ (look) at the people in the hall, some of them ___ (dance). Setze die richtige -ing-Form ein. [de, 2 blank(s)] | was looking \| were dancing (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.018 | gap-fill | We ___ (climb) the stairs to the Blarney Stone while the wind ___ (blow). Setze die richtige -ing-Form ein. [de, 2 blank(s)] | were climbing \| was blowing (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.019 | gap-fill | It ___ (snow) when we came home from school. Setze was/were + die -ing-Form ein. [de, 1 blank(s)] | was snowing (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.020 | gap-fill | While James ___ (talk) to the people, the children ___ (come) closer. Setze beide Verben passend ein. [de, 2 blank(s)] | was talking \| came (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gf.021 | gap-fill | The band ___ (play) a song when we arrived at the concert. Setze was/were + die -ing-Form ein. [de, 1 blank(s)] | was playing (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.gs.001 | group-sort | Welche Form passt zu welchem Subjekt? [de] | — | — | — | — | was + -ing (I / he / she / it): He was reading., She was cooking., The dog was running., I was waiting. \| were + -ing (you / we / they): They were dancing., We were watching., The children were playing., You were running. | false |
| g4u01.gi.past-continuous-revision.gs.003 | group-sort | Sortiere die Sätze: richtig oder falsch? [de] | — | — | — | — | ✓: She was reading when her friends came., They were dancing all night., While I was cooking, my dad cleaned the kitchen. \| ✗: The children was playing in the garden., I was liking the song., While he played, he dropped his book. | false |
| g4u01.gi.past-continuous-revision.mc.001 | multiple-choice | Yesterday at 5 o'clock, my sister ___ her homework. Wähle die Form für etwas, das zu der Zeit gerade im Gange war. [de, 1 blank(s)] | was doing (full) | — | did ; does ; was did | — | — | false |
| g4u01.gi.past-continuous-revision.mc.002 | multiple-choice | The children ___ in the garden when their friends came. Wähle die richtige Form. [de, 1 blank(s)] | were playing (full) | — | was playing ; played ; are playing | — | — | false |
| g4u01.gi.past-continuous-revision.mc.003 | multiple-choice | Welcher Satz beschreibt richtig, dass eine längere Handlung von einer kürzeren unterbrochen wird? [de] | I was reading a book when my dad called me. (full) | — | I read a book when my dad was calling me. ; I was reading a book when my dad was calling me. ; I read a book when my dad called me. | — | — | false |
| g4u01.gi.past-continuous-revision.mc.004 | multiple-choice | Welcher Satz beschreibt richtig zwei längere Handlungen, die gleichzeitig im Gange waren? [de] | While Dad was washing the car, Mum was cleaning the kitchen. (full) | — | While Dad washed the car, Mum cleaned the kitchen. ; While Dad was washing the car, Mum cleaned the kitchen. ; While Dad washed the car, Mum was cleaning the kitchen. | — | — | false |
| g4u01.gi.past-continuous-revision.mc.005 | multiple-choice | At 9 o'clock last night, she was ___ in bed. Wähle die richtige -ing-Form. [de, 1 blank(s)] | reading (full) | — | read ; reads ; to read | — | — | false |
| g4u01.gi.past-continuous-revision.mc.007 | multiple-choice | Welcher Satz ist NICHT korrekt? Achte auf Verben, die kein was/were + -ing mögen. [de] | I was wanting a new book for my birthday. (full) | — | She was painting a picture when her friends came. ; They were having dinner when the storm came. ; We were waiting for the snow to stop. | — | — | false |
| g4u01.gi.past-continuous-revision.mc.008 | multiple-choice | Welcher Satz ist NICHT korrekt? Manche Verben beschreiben einen Zustand, kein Tun. [de] | I was liking the song very much. (full) | — | I was reading a book when my mum called. ; She was listening to music while he was cooking. ; We were dancing in the street. | — | — | false |
| g4u01.gi.past-continuous-revision.mc.009 | multiple-choice | Es war Mitternacht und die ganze Familie war im Wohnzimmer vor dem Fernseher. Welcher Satz passt am besten? [de] | The whole family was watching the news. (full) | — | The whole family watched the news. ; The whole family watches the news. ; The whole family watch the news. | — | — | false |
| g4u01.gi.past-continuous-revision.mc.010 | multiple-choice | My brother ___ to music when I came into his room. Wähle die richtige Form. [de, 1 blank(s)] | was listening (full) | — | were listening ; listened ; is listening | — | — | false |
| g4u01.gi.past-continuous-revision.mc.011 | multiple-choice | While we ___ in the garden, my dad ___ us. Wähle die richtige Kombination. [de, 2 blank(s)] | were playing \| called (full) | — | played \| called ; were playing \| was calling ; was playing \| called | — | — | false |
| g4u01.gi.past-continuous-revision.mt.002 | matching | Welcher Satzanfang passt zu welchem Ende? [de] | — | — | — | While I was reading, ↔ my mum called me. ; When the teacher came in, ↔ everyone was waiting at the tables. ; She was cooking dinner ↔ when her friends arrived. ; While they were watching the news, ↔ their dog jumped up. | — | false |
| g4u01.gi.past-continuous-revision.sb.003 | sentence-building | Bring die Wörter in die richtige Reihenfolge: at / 7 / o'clock / last / night / I / was / reading / a / book [de] | At 7 o'clock last night, I was reading a book. (full) ; At 7 o'clock last night I was reading a book. (full) ; I was reading a book at 7 o'clock last night. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.sb.004 | sentence-building | Bring die Wörter in die richtige Reihenfolge: was / she / when / reading / my / dad / came / home [de] | She was reading when my dad came home. (full) ; When my dad came home, she was reading. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.sb.005 | sentence-building | Bring die Wörter in die richtige Reihenfolge: while / were / dinner / having / they / their / friends / came [de] | While they were having dinner, their friends came. (full) ; Their friends came while they were having dinner. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.tf.001 | transformation | Mach aus den zwei Bildern einen Satz mit while: Dad → drive the car. You → listen to music. (gleichzeitig) [de] | While Dad was driving the car, I was listening to music. (full) ; I was listening to music while Dad was driving the car. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.tf.002 | transformation | Setze die Verben ein: 'I ___ (have) lunch when my friend ___ (call) me.' [de, 2 blank(s)] | was having \| called (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.tf.003 | transformation | Mach aus den zwei Sätzen einen einzigen mit when: 'I was eating lunch in the school canteen.' + 'A dog came in.' [de] | I was eating lunch in the school canteen when a dog came in. (full) ; When a dog came in, I was eating lunch in the school canteen. (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.tf.004 | transformation | Setze beide Verben ein, um die Szene zu beschreiben: 'It ___ (snow) and the children ___ (dance) in the garden.' [de, 2 blank(s)] | was snowing \| were dancing (full) | — | — | — | — | false |
| g4u01.gi.past-continuous-revision.tr.002 | translation | Die Sonne schien und die Kinder spielten im Garten, als ein Hund hereinkam. [de] | The sun was shining and the children were playing in the garden when a dog came in. (full) ; The sun was shining and the children were playing in the garden when a dog came. (full) | deToEn | — | — | — | false |
| g4u01.gi.past-continuous-revision.tr.003 | translation | Während ich lernte, rief mein Freund an. [de] | While I was studying, my friend called. (full) ; My friend called while I was studying. (full) ; While I was studying, my friend called me. (full) ; While I was learning, my friend called. (full) ; My friend called while I was learning. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u01/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u01",
  "lens": "answers",
  "itemsHash": "f7dea74c414b",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 91, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
