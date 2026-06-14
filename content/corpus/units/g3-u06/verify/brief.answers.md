# Verify lens — answers — g3-u06 (round 1)

<!-- domigo:verify answers g3-u06 items=ffe3bb58c674 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (45)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u06.w.approximately | approximately | close to a number, more or less | There are ___ 200 children at our school. | approximately (full) | approximately (full) | thrilling ; spectacular ; cruel |
| g3u06.w.art-gallery | art gallery | a place where you can look at famous pictures on the walls | We looked at famous pictures in the ___ in the city centre. | art gallery (full) | art gallery (full) ; art galleries (full) | theatre ; stadium ; shop |
| g3u06.w.bridge | bridge | a way over a river or road that you can cross | We crossed the river on a stone ___ near the town centre. | bridge (full) | bridge (full) ; bridges (full) | tower ; path ; river |
| g3u06.w.building | building | a place with walls and a roof where people live or work | There is a tall new ___ in our town with many windows. | building (full) | building (full) ; buildings (full) | river ; park ; street |
| g3u06.w.collection | collection | all the art that an art gallery keeps and shows | This art gallery has a famous ___ of modern art. | collection (full) | collection (full) ; collections (full) | government ; view ; play |
| g3u06.w.contract | contract | what two people sign when they agree to a thing | Before you begin the new job, you need to sign a ___ with the owner. | contract (full) | contract (full) ; contracts (full) | collection ; government ; view |
| g3u06.w.cruel | cruel | when you hurt people and feel happy about it | It is very ___ to hurt people for no reason. | cruel (full) | cruel (full) | empty ; thrilling ; multicultural |
| g3u06.w.district | district | one area of a city or town | There are many shops and restaurants in this ___ of the city. | district (full) | district (full) ; districts (full) | square ; tower ; bridge |
| g3u06.w.empty | empty | with nothing or no one inside | The fridge is completely ___ — there is no milk and no food. | empty (full) | empty (full) | cruel ; thrilling ; spectacular |
| g3u06.w.fever | fever | when you feel very hot because you are ill | She stayed in bed because she had a high ___ of 39 degrees. | fever (full) | fever (full) ; fevers (full) | traffic ; collection ; view |
| g3u06.w.government | government | the people who lead a country. | The ___ meets at the Houses of Parliament in London. | government (full) | government (full) ; governments (full) | collection ; visitor ; contract |
| g3u06.w.in-advance | in advance | early, before a thing happens | You can book your tickets ___ so you do not have to wait in the queue. | in advance (full) | in advance (full) | approximately ; empty ; thrilling |
| g3u06.w.multicultural | multicultural | with people from many countries in one place | London is a very ___ city with people from all over the world. | multicultural (full) | multicultural (full) | empty ; cruel ; thrilling |
| g3u06.w.park | park | a big open area with trees where you can play and have a picnic | Let's meet at the ___ near the trees and play football. | park (full) | park (full) ; parks (full) | square ; shop ; building |
| g3u06.w.path | path | a small road for people on foot | There's a long ___, a lake and lots of trees. | path (full) | path (full) ; paths (full) | bridge ; tower ; square |
| g3u06.w.play | play | a story that people show on a stage | You can watch a Shakespeare ___ at the Globe. | play (full) | play (full) ; plays (full) | view ; collection ; shop |
| g3u06.w.prison | prison | a place where bad people stay after they do a crime | It was a castle first, and then for many years it was a ___. | prison (full) | prison (full) ; prisons (full) | theatre ; art gallery ; shop |
| g3u06.w.raven | raven | a big black animal that can fly | The black ___ live at the Tower of London and never leave. | ravens (full) | raven (full) ; ravens (full) | visitor ; path ; view |
| g3u06.w.river | river | a long wide way where ships travel down to the sea | The ___ here is very wide, so we cannot cross it on foot. | river (full) | river (full) ; rivers (full) | bridge ; path ; tower |
| g3u06.w.shop | shop | a place where you can pay money for sweets, food and clothes | There are many small ___ on this street that sell sweets and books. | shops (full) | shop (full) ; shops (full) | park ; tower ; river |
| g3u06.w.shopping-centre | shopping centre | a big building with lots of shops in it | This big ___ centre has 100 shops under one roof. | shopping (full) | shopping centre (full) ; shopping center (full) ; shopping centres (full) | art gallery ; tower ; bridge |
| g3u06.w.spectacular | spectacular | very nice and amazing to look at | What I loved most was the ___ light show. | spectacular (full) | spectacular (full) | empty ; cruel ; multicultural |
| g3u06.w.square | square | a big open place in the middle of a town | There is a big fountain in the middle of the town ___. | square (full) | square (full) ; squares (full) | park ; bridge ; river |
| g3u06.w.stadium | stadium | a big building where many people watch a match | This big ___ can hold more than 50,000 people. | stadium (full) | stadium (full) ; stadiums (full) | theatre ; art gallery ; shop |
| g3u06.w.street | street | a road in a city or town with houses and shops | There is a lot of traffic on the ___, so it is very noisy. | street (full) | street (full) ; streets (full) | park ; tower ; bridge |
| g3u06.w.sugar | sugar | a sweet white food you put in tea, cakes and sweets | I want to eat less ___ because it is not healthy. | sugar (full) | sugar (full) | traffic ; fever ; path |
| g3u06.w.the-houses-of-parliament | the Houses of Parliament | the building in London where the British government meets | We can take a picture of ___ in London. | the Houses of Parliament (full) ; Houses of Parliament (full) | the Houses of Parliament (full) ; Houses of Parliament (full) | tower ; stadium ; art gallery |
| g3u06.w.theatre | theatre | a building where you watch plays and shows | We are going to the ___ tonight to watch a play. | theatre (full) | theatre (full) ; theater (partial) ; theatres (full) | stadium ; art gallery ; shop |
| g3u06.w.thrilling | thrilling | very exciting, but also scary | The ghost show was really ___. | thrilling (full) | thrilling (full) | empty ; cruel ; multicultural |
| g3u06.w.to-burn-down | to burn down | to be destroyed in a fire | The Globe Theatre ___ a long time ago, but now there is a new one. | burned down (full) ; burnt down (full) | burn down (full) ; burnt down (full) ; burned down (full) | to raise ; to report ; to experience |
| g3u06.w.to-cough | to cough (up) | to make a noise from your throat because you have a cold | He ___ all night because he had a bad cold. | coughed (full) | cough (full) ; coughed (full) ; coughing (full) | to report ; to raise ; to experience |
| g3u06.w.to-earn | to earn (money) | to be paid for the work that you do. | My after-school job ___ me ten pounds a week. | earns (full) | earn (full) ; earns (full) ; earned (full) | to sign ; to report ; to experience |
| g3u06.w.to-experience | to experience | to do or feel a new thing for the first time | On the farm you can ___ farm life for three days. | experience (full) | experience (full) ; experienced (full) | to report ; to raise ; to sign |
| g3u06.w.to-lead | to lead | to be the head of a country or a group of people | The guide will ___ the group along the river. | lead (full) | lead (full) ; led (full) | to report ; to sign ; to experience |
| g3u06.w.to-photograph | to photograph | to take a picture of a place or a thing | A lot of people ___ these famous places in London. | photograph (full) | photograph (full) ; photographs (full) ; photographed (full) | to raise ; to report ; to sign |
| g3u06.w.to-raise | to raise | to put a thing up high | They ___ the bridge so that big ships can go under it. | raise (full) | raise (full) ; raised (full) | to report ; to sign ; to lead |
| g3u06.w.to-report | to report | to tell the police or a teacher about a thing that happened | If a bad thing happens at school, please ___ it to a teacher. | report (full) | report (full) ; reported (full) | to photograph ; to raise ; to sign |
| g3u06.w.to-save-up-for | to save up for | to keep your money so you can pay for a big thing you want | I want to ___ a new mobile phone, so I do not spend my pocket money. | save up for (full) | save up for (full) ; saved up for (full) ; saving up for (full) | to sign ; to report ; to lead |
| g3u06.w.to-sign | to sign | to write at the end of a letter to show you agree to it | He read the contract and then ___ it. | signed (full) | sign (full) ; signed (full) | to report ; to raise ; to experience |
| g3u06.w.to-take-a-walk | to take a walk | to go on foot for fun, not in a hurry | Let's ___ along the river — the weather is great today. | take a walk (full) | take a walk (full) ; took a walk (full) | to photograph ; to report ; to sign |
| g3u06.w.tourist-attraction | tourist attraction | a popular place that many people visit on holiday | The castle on the hill is the most popular ___ in our town. | tourist attraction (full) | tourist attraction (full) ; tourist attractions (full) | collection ; government ; contract |
| g3u06.w.tower | tower | a tall building with a clock that is very high | The tall church ___ with a clock is very high. | tower (full) | tower (full) ; towers (full) | bridge ; shop ; park |
| g3u06.w.traffic | traffic | all the cars on a road | There's a lot of ___ on the street. It's very noisy. | traffic (full) | traffic (full) | collection ; fever ; view |
| g3u06.w.view | view | the nice land or town you can look at from a high place | On the wheel you have the best ___ of the whole city. | view (full) | view (full) ; views (full) | path ; collection ; play |
| g3u06.w.visitor | visitor | somebody who comes to look at a place or to meet somebody | The history museum has many ___ from all over the world every year. | visitors (full) | visitor (full) ; visitors (full) | government ; collection ; raven |

## Grammar items (55)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u06.gi.relative-clauses.ag.003 | anagram | Welches Wort nimmst du für Personen? Sortiere die Buchstaben: o h w [de] | who (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.ag.004 | anagram | Welches Wort zeigt Besitz (= dessen/deren)? Sortiere die Buchstaben: s e h o w [de] | whose (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.cp.001 | context-picker | Du beschreibst deinem Austausch-Freund den Jungen, der neben dir wohnt. Welcher Satz ist richtig? [de] | That's the boy who lives next door. (full) | — | That's the boy which lives next door. ; That's the boy what lives next door. ; That's the boy whose lives next door. | — | — | false |
| g3u06.gi.relative-clauses.cp.002 | context-picker | Du zeigst deiner Freundin dein neues Handy. Welcher Satz ist richtig? [de] | I have a phone which has a good camera. (full) | — | I have a phone who has a good camera. ; I have a phone what has a good camera. ; I have a phone whose has a good camera. | — | — | false |
| g3u06.gi.relative-clauses.cp.003 | context-picker | Du erzählst von einem Freund, dessen Vater Pilot ist. Welcher Satz ist richtig? [de] | He's the boy whose father is a pilot. (full) | — | He's the boy who's father is a pilot. ; He's the boy who father is a pilot. ; He's the boy which father is a pilot. | — | — | false |
| g3u06.gi.relative-clauses.ec.001 | error-correction | The man which helped me at the station was very nice. [en] | The man who helped me at the station was very nice. (full) ; The man that helped me at the station was very nice. (full) ; who (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.ec.002 | error-correction | The river who flows through London is the Thames. [en] | The river which flows through London is the Thames. (full) ; The river that flows through London is the Thames. (full) ; which (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.ec.003 | error-correction | That's the house what the king built. [en] | That's the house that the king built. (full) ; That's the house which the king built. (full) ; that (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.ec.004 | error-correction | The boy who's bag is on the floor must pick it up. [en] | The boy whose bag is on the floor must pick it up. (full) ; whose (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.ec.005 | error-correction | The Globe is a theatre who looks almost the same as the old one. [en] | The Globe is a theatre which looks almost the same as the old one. (full) ; The Globe is a theatre that looks almost the same as the old one. (full) ; which (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.ec.006 | error-correction | The girl whose I met at the party is in my class. [en] | The girl who I met at the party is in my class. (full) ; The girl that I met at the party is in my class. (full) ; who (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.ec.007 | error-correction | I know a girl who she plays the guitar very well. [en] | I know a girl who plays the guitar very well. (full) ; I know a girl that plays the guitar very well. (full) ; who plays (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.ff.001 | free-form | Beschreibe deinen besten Freund oder deine beste Freundin in einem Satz. Verwende who. [de] | My best friend is the girl who sits next to me. (full) ; My best friend is the boy who lives next door. (full) ; My best friend is the girl who plays football with me. (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.001 | gap-fill | The guide ___ showed us London was very funny. [en, 1 blank(s)] | who (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.002 | gap-fill | The tower ___ you can see from the bridge is very old. [en, 1 blank(s)] | which (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.003 | gap-fill | Hyde Park is great for people ___ like fresh air. [en, 1 blank(s)] | who (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.004 | gap-fill | That is the friend ___ father is a pilot. [en, 1 blank(s)] | whose (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.005 | gap-fill | Big Ben is the name of the great bell ___ is in the clock tower. [en, 1 blank(s)] | which (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.006 | gap-fill | Tate Modern is an art gallery ___ collection of modern art is one of the best in the world. [en, 1 blank(s)] | whose (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.007 | gap-fill | The raven ___ sits on the wall belongs to the Tower of London. [en, 1 blank(s)] | which (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.008 | gap-fill | The play ___ we watched at the Globe Theatre was thrilling. [en, 1 blank(s)] | that (full) ; which (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.009 | gap-fill | That is the girl ___ bike was stolen near the station. [en, 1 blank(s)] | whose (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.010 | gap-fill | I have a friend ___ lives in London. [en, 1 blank(s)] | who (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.011 | gap-fill | Have you seen the building ___ looks like a UFO? [en, 1 blank(s)] | which (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.012 | gap-fill | He is the man ___ dog wakes me up every morning. [en, 1 blank(s)] | whose (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.013 | gap-fill | The visitor ___ took a picture of the tower was from Austria. [en, 1 blank(s)] | who (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.014 | gap-fill | London is a city ___ has a lot of traffic and many tourist attractions. [en, 1 blank(s)] | which (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.015 | gap-fill | Hyde Park is a tourist attraction ___ I really want to see. [en, 1 blank(s)] | which (full) ; that (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gf.016 | gap-fill | Cycling is great for people ___ like fresh air, and the park ___ I go to has a lot of trees. [en, 2 blank(s)] | who \| which (full) ; that \| that (full) ; who \| that (full) ; that \| which (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.gs.001 | group-sort | Sortiere: Person oder Ding? [de] | — | — | — | — | who (✓): the guide, the woman, the visitor, the teacher \| which (✓): the bridge, the tower, the play, the collection | false |
| g3u06.gi.relative-clauses.gs.003 | group-sort | Sortiere die Sätze: Welches Wort fehlt? [de] | — | — | — | — | who: The man ___ helped me., The girl ___ made the cake., People ___ like fresh air. \| which: The phone ___ has a camera., The book ___ is about London., The cake ___ she made. \| whose: The boy ___ father is a pilot., The girl ___ bike was stolen., The man ___ dog wakes me up. | false |
| g3u06.gi.relative-clauses.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | The cat which sleeps all day is very small. (full) | — | The cat who sleeps all day is very small. ; The cat what sleeps all day is very small. ; The cat whose sleeps all day is very small. | — | — | false |
| g3u06.gi.relative-clauses.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | The woman who lives next door is a teacher. (full) | — | The woman which lives next door is a teacher. ; The woman what lives next door is a teacher. ; The woman whose lives next door is a teacher. | — | — | false |
| g3u06.gi.relative-clauses.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | The phone which I bought last week is broken. (full) | — | The phone who I bought last week is broken. ; The phone what I bought last week is broken. ; The phone whose I bought last week is broken. | — | — | false |
| g3u06.gi.relative-clauses.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | The woman whose car broke down called for help. (full) | — | The woman who's car broke down called for help. ; The woman which car broke down called for help. ; The woman who car broke down called for help. | — | — | false |
| g3u06.gi.relative-clauses.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | Beefeaters are the guards who protect the Crown Jewels. (full) | — | Beefeaters are the guards which protect the Crown Jewels. ; Beefeaters are the guards what protect the Crown Jewels. ; Beefeaters are the guards whose protect the Crown Jewels. | — | — | false |
| g3u06.gi.relative-clauses.mc.006 | multiple-choice | Welches Wort passt? The street ___ leads to the bridge is very long. [de, 1 blank(s)] | which (full) ; that (full) | — | who ; whose ; what | — | — | false |
| g3u06.gi.relative-clauses.mc.007 | multiple-choice | Welches Wort passt? The girl ___ song is my favourite is in my class. [de, 1 blank(s)] | whose (full) | — | who ; who's ; which | — | — | false |
| g3u06.gi.relative-clauses.mp.001 | matching-pairs | Verbinde die zwei Sätze zu einem mit who, which oder whose. [de] | — | — | — | That's the boy. He sits next to me. ↔ That's the boy who sits next to me. ; This is the phone. It has a great camera. ↔ This is the phone which has a great camera. ; That's the girl. Her bike was stolen. ↔ That's the girl whose bike was stolen. ; He's the man. His dog wakes me up. ↔ He's the man whose dog wakes me up. | — | false |
| g3u06.gi.relative-clauses.mt.001 | matching | Welches Ende passt zu welchem Anfang? [de] | — | — | — | The Houses of Parliament is the building ↔ where the government meets. ; Tate Modern is an art gallery ↔ which has modern art. ; The Beefeaters are the guards ↔ who protect the Crown Jewels. ; Big Ben is the bell ↔ that is in the tower. | — | false |
| g3u06.gi.relative-clauses.qf.001 | question-formation | Du willst wissen, ob dieser Bus zum Park fährt. Bring die Wörter zu einer Frage: 'to / this / goes / which / Is / the bus / the park' [de] | Is this the bus which goes to the park? (full) ; Is this the bus that goes to the park? (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.qf.002 | question-formation | Bring die Wörter in die richtige Reihenfolge zu einer Frage: 'lives / the / who / Do / girl / know / next door / you' [de] | Do you know the girl who lives next door? (full) ; Do you know the girl that lives next door? (partial) | — | — | — | — | false |
| g3u06.gi.relative-clauses.sb.002 | sentence-building | which / the / I / pizza / ordered / was / great [en] | The pizza which I ordered was great. (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.sb.003 | sentence-building | is / the / that / man / wrote / who / the / play / Shakespeare [en] | Shakespeare is the man who wrote the play. (full) ; Shakespeare is the man that wrote the play. (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.sb.004 | sentence-building | who / the / is / woman / lives / that / here [en] | That is the woman who lives here. (full) ; Who is the woman that lives here? (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.tf.006 | transformation | Mach aus den zwei Sätzen einen. Verbinde sie mit who, which oder that: 'That's the girl. She sits next to me.' [de] | That's the girl who sits next to me. (full) ; That's the girl that sits next to me. (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.tf.007 | transformation | Mach aus den zwei Sätzen einen. Verbinde sie mit who, which oder that: 'I have a tablet. It has a big screen.' [de] | I have a tablet which has a big screen. (full) ; I have a tablet that has a big screen. (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.tf.008 | transformation | Mach aus den zwei Sätzen einen. Zeig den Besitz mit whose: 'That's the boy. His dog plays in the park.' [de] | That's the boy whose dog plays in the park. (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.tf.009 | transformation | Mach aus den zwei Sätzen einen. Verbinde sie mit who, which oder that: 'The Tower of London is a building. It was a prison.' [de] | The Tower of London is a building which was a prison. (full) ; The Tower of London is a building that was a prison. (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.tf.010 | transformation | Mach aus den zwei Sätzen einen. Verbinde sie mit who, which oder that: 'The Globe is a theatre. It has no roof.' [de] | The Globe is a theatre which has no roof. (full) ; The Globe is a theatre that has no roof. (full) | — | — | — | — | false |
| g3u06.gi.relative-clauses.tr.001 | translation | Das Mädchen, das neben mir sitzt, ist sehr nett. [de] | The girl who sits next to me is very nice. (full) ; The girl that sits next to me is very nice. (full) | deToEn | — | — | — | false |
| g3u06.gi.relative-clauses.tr.002 | translation | Das ist der Turm, den du vom Park aus sehen kannst. [de] | That's the tower which you can see from the park. (full) ; That's the tower that you can see from the park. (full) ; That is the tower which you can see from the park. (full) ; That is the tower that you can see from the park. (full) | deToEn | — | — | — | false |
| g3u06.gi.relative-clauses.tr.003 | translation | Das ist der Junge, dessen Vater Pilot ist. [de] | That's the boy whose father is a pilot. (full) ; That is the boy whose father is a pilot. (full) | deToEn | — | — | — | false |
| g3u06.gi.relative-clauses.tr.004 | translation | Sieh dir die Männer an, deren Aufgabe es ist, die Kronjuwelen zu schützen. [de] | Look at the men whose job is to protect the Crown Jewels. (full) | deToEn | — | — | — | false |
| g3u06.gi.relative-clauses.tr.005 | translation | London ist eine Stadt, die ich liebe. [de] | London is a city which I love. (full) ; London is a city that I love. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u06/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u06",
  "lens": "answers",
  "itemsHash": "ffe3bb58c674",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 100, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
