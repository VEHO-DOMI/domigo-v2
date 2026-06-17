# Verify lens — answers — g3-u04 (round 1)

<!-- domigo:verify answers g3-u04 items=c6b91f93f1fd prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (46)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u04.w.adorable | adorable | So cute that you love it at once. | People love a young seal, but their parents are not so ___. | adorable (full) | adorable (full) | aggressive ; poisonous ; deadly |
| g3u04.w.aggressive | aggressive | This animal likes to fight or hurt people. | Swans can be very ___ when you come too close to their young. | aggressive (full) | aggressive (full) | cuddly ; adorable ; elegant |
| g3u04.w.audience | audience | The people who watch or listen to a show or talk. | There is more than one good way to reach an ___ and tell them the news. | audience (full) ; audiences (partial) | audience (full) ; audiences (full) | politician ; victim ; scuba diver |
| g3u04.w.bite | bite | When an animal closes its teeth on you. | One ___ from this little animal can hurt you very much and could end your life. | bite (full) ; bites (partial) | bite (full) ; bites (full) | injury ; shape ; death |
| g3u04.w.cub | cub | The young of a wild animal like a lion. | The ___ stayed very close to its big mother all day. | cub (full) ; cubs (partial) | cub (full) ; cubs (full) | adult ; guide ; owner |
| g3u04.w.cuddly | cuddly | Nice to hold close. | What could be so dangerous about this ___ young animal? | cuddly (full) | cuddly (full) | aggressive ; poisonous ; deadly |
| g3u04.w.cute | cute | Pretty and nice to look at, often small. | This young animal is the ___ animal in the world, with its big eyes. | cutest (full) ; cute (partial) | cute (full) | aggressive ; poisonous ; deadly |
| g3u04.w.dangerous | dangerous | This can hurt you very much. | This sea animal can be very ___, and it can hurt humans too. | dangerous (full) | dangerous (full) | cuddly ; adorable ; cute |
| g3u04.w.deadly | deadly | So bad that it can end your life. | The bite of this sea animal can end your life, so it is very ___. | deadly (full) | deadly (full) | cuddly ; elegant ; cute |
| g3u04.w.death | death | The end of a life, when a living thing dies. | A great white shark watches its victims bleed to ___ before eating. | death (full) | death (full) | injury ; shape ; poison |
| g3u04.w.elegant | elegant | Very beautiful and lovely to look at. | The swan looked very ___ on the lake. | elegant (full) | elegant (full) | aggressive ; poisonous ; deadly |
| g3u04.w.environment | environment | The world we live in, with its land, sea and sky. | Foxes are a part of our ___, so we must care for them too. | environment (full) | environment (full) | audience ; victim ; shape |
| g3u04.w.furry | furry | Covered with lots of thick hair. | Young seals are white and ___, so people love them. | furry (full) | furry (full) | aggressive ; poisonous ; deadly |
| g3u04.w.good-luck | Good luck! | You call this out to a friend before a big day to hope all is well. | Your big day is tomorrow? ___! I really hope you do well. | Good luck (full) ; Good luck! (full) | Good luck (full) ; Good luck! (full) | Good for you! ; Have fun! ; Well done. |
| g3u04.w.hands-off | Hands off! | You call this out so people do not touch a thing. | ___ That big chocolate cake on the table is for tonight! | Hands off (full) ; Hands off! (full) | Hands off (full) ; Hands off! (full) | Good luck! ; Have fun! ; Well done. |
| g3u04.w.immediately | immediately | At once, with no waiting. | Why didn't they go back to the café ___ after the shark came? | immediately (full) | immediately (full) | on average ; Hands off ; Good luck |
| g3u04.w.injury | injury | A hurt and bad place on you, often after an accident. | His daughter had a bad ___ on her leg after the shark bite. | injury (full) ; injuries (partial) | injury (full) ; injuries (full) | death ; shape ; poison |
| g3u04.w.lizard | lizard | A small animal with four legs, a long tail and cold blood. | Dave has a new ___, and it can bite your finger. | lizard (full) ; lizards (partial) | lizard (full) ; lizards (full) | swan ; seal ; spider |
| g3u04.w.on-average | on average | The middle number over a long time. | Sharks hurt a small number of people every year ___. | on average (full) | on average (full) | immediately ; Hands off ; Good luck |
| g3u04.w.poison | poison | A thing that can make you very ill or end your life. | This sea animal makes a ___ to keep a big animal away from its young. | poison (full) ; poisons (partial) | poison (full) | injury ; shape ; death |
| g3u04.w.poisonous | poisonous | This can make you very ill if you eat or touch it. | This tiny sea animal is very ___, so do not touch it. | poisonous (full) | poisonous (full) | cuddly ; furry ; elegant |
| g3u04.w.polar-bear | polar bear | A big white animal that lives where it is very cold. | There are about 3,000 ___ on the Svalbard Islands in Norway. | polar bears (full) ; polar bear (partial) | polar bear (full) ; polar bears (full) | seal ; swan ; lizard |
| g3u04.w.politician | politician | Somebody whose job is to make new rules for the country. | They are asking the local ___ to keep the foxes away from the streets. | politicians (full) ; politician (partial) | politician (full) ; politicians (full) | audience ; victim ; scuba diver |
| g3u04.w.rabies | rabies | A very dangerous thing an animal can give you when it bites you. | Chipmunks are sweet, but they are famous for spreading ___. | rabies (full) | rabies (full) | injury ; death ; poison |
| g3u04.w.scuba-diver | scuba diver | Somebody who explores under the sea with breathing equipment. | A ___ looks at the fish under the sea. | scuba diver (full) ; scuba divers (partial) | scuba diver (full) ; scuba divers (full) | politician ; audience ; victim |
| g3u04.w.seal | seal | A sea animal with short fur that lives where the sea is cold. | People love a young ___, because they are white and furry. | seal (full) ; seals (partial) | seal (full) ; seals (full) | swan ; lizard ; spider |
| g3u04.w.shape | shape | The way a thing looks on the outside. | From below, the ___ of a swimmer can look like a seal to a shark. | shape (full) ; shapes (partial) | shape (full) ; shapes (full) | injury ; death ; poison |
| g3u04.w.stunning | stunning | So beautiful that it surprises you. | This tiny sea animal is ___ and looks beautiful. | stunning (full) | stunning (full) | aggressive ; poisonous ; dangerous |
| g3u04.w.swan | swan | A big white animal with a long neck that lives on lakes and rivers. | A ___ often lives on lakes and rivers in Europe. | swan (full) ; swans (partial) | swan (full) ; swans (full) | seal ; lizard ; spider |
| g3u04.w.to-accept | to accept | To be ok with how a thing is and take it. | Now Paige can ___ her new life, and she is happy again. | accept (full) ; accepts (partial) ; accepted (partial) | accept (full) ; to accept (full) ; accepted (full) | complain ; inform ; defend |
| g3u04.w.to-advise-against-sth | to advise (sb.) against sth. | To tell somebody not to do a thing that is bad for them. | The expert would ___ against surfing or swimming out into the sea. | advise (full) | advise against (full) ; to advise against (full) ; advised against (full) ; advise (full) | accept ; inform ; defend |
| g3u04.w.to-bite | to bite (off) | To close your teeth on a thing to hurt it or take a piece. | Dave has a new lizard, and it can ___ your finger off! | bite (full) ; bite off (full) | bite (full) ; to bite (full) ; bite off (full) ; to bite off (full) | lift ; accept ; inform |
| g3u04.w.to-bleed | to bleed | To lose blood. | Her leg can ___ very much from a shark bite. | bleed (full) ; bled (partial) | bleed (full) ; to bleed (full) ; bled (full) | accept ; inform ; lift |
| g3u04.w.to-cause | to cause | To make a bad thing happen. | One bite from this little animal can ___ a lot of pain. | cause (full) ; caused (partial) | cause (full) ; to cause (full) ; caused (full) | accept ; defend ; inform |
| g3u04.w.to-chase-away | to chase away | To run after an animal so it leaves. | Charlie wanted to ___ the big fish away from his daughter. | chase (full) | chase away (full) ; to chase away (full) ; chased away (full) | accept ; inform ; complain |
| g3u04.w.to-communicate | to communicate | To talk to people and give them the news. | In the story, they find out that the animal can ___ with one another. | communicate (full) ; communicated (partial) | communicate (full) ; to communicate (full) ; communicated (full) | accept ; inform ; defend |
| g3u04.w.to-complain | to complain | To tell people that you are not happy about a thing. | Paige was happy with her new life and she never ___. | complained (full) ; complains (partial) ; complain (partial) | complain (full) ; to complain (full) ; complained (full) | accept ; inform ; defend |
| g3u04.w.to-defend | to defend | To fight to protect an animal or a place. | A mother will ___ her young from a big animal. | defend (full) ; defended (partial) | defend (full) ; to defend (full) ; defended (full) | accept ; inform ; complain |
| g3u04.w.to-inform | to inform | To tell people what is happening. | You need to ___ the public about the news. | inform (full) ; informed (partial) | inform (full) ; to inform (full) ; informed (full) | accept ; defend ; complain |
| g3u04.w.to-lift | to lift | To bring a thing up high from the ground. | Charlie wanted to ___ the girl out of the sea before the shark could bite her. | lift (full) ; lifted (partial) | lift (full) ; to lift (full) ; lifted (full) | accept ; inform ; defend |
| g3u04.w.to-lock-sb-up | to lock sb. up | To put somebody in a room or cage and close the door. | You must ___ up the chickens at night to keep them away from the foxes. | lock (full) | lock up (full) ; to lock up (full) ; locked up (full) ; locks up (full) | accept ; inform ; defend |
| g3u04.w.to-mistake-sth-for-sth | to mistake sth. for sth. | To think one animal is a seal when it is really not. | Sharks bite people when they ___ them for seals or sea lions. | mistake (full) | mistake for (full) ; to mistake for (full) ; mistook for (full) ; mistake (full) | accept ; inform ; defend |
| g3u04.w.to-pull-down | to pull down | To take somebody or a thing down towards the ground. | There was a big shark, and it was ___ Paige down into the sea. | pulling (full) | pull down (full) ; to pull down (full) ; pulled down (full) | lift ; accept ; inform |
| g3u04.w.to-suppose | to suppose | To think that a thing is probably true. | Are sharks really bad? I ___ so. | suppose (full) ; supposed (partial) | suppose (full) ; to suppose (full) ; supposed (full) | accept ; inform ; defend |
| g3u04.w.to-take-care | to take care | To be careful so that nothing bad happens to you. | People must ___ care when they go swimming in the sea. | take (full) | take care (full) ; to take care (full) ; took care (full) | accept ; inform ; complain |
| g3u04.w.victim | victim | The one that a shark hurts. | A great white shark watches its ___ bleed before it eats. | victims (full) ; victim (partial) | victim (full) ; victims (full) | politician ; audience ; scuba diver |

## Grammar items (44)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u04.gi.comparative-intensifiers.ag.001 | anagram | Welches Wort fehlt? An elephant is ___ bigger than a cat. (großer Unterschied, 4 Buchstaben) [de, 1 blank(s)] | much (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.cp.001 | context-picker | Du vergleichst zwei Handys. Das eine kostet 1.200 Euro, das andere 400 Euro. Betone den großen Unterschied. [de] | This phone is much more expensive than that one. (full) | — | This phone is very more expensive than that one. ; This phone is more expensive much than that one. ; This phone is much more expensiver than that one. | — | — | false |
| g3u04.gi.comparative-intensifiers.cp.002 | context-picker | Dein Bruder ist 175 cm groß, du bist 172 cm. Der Unterschied ist klein. Sag es. [de] | My brother is a bit taller than me. (full) | — | My brother is much taller than me. ; My brother is a bit more taller than me. ; My brother is a bit taller than I. | — | — | false |
| g3u04.gi.comparative-intensifiers.cp.003 | context-picker | Im Park sind heute viel weniger Menschen als sonst. Sag es. [de] | There are fewer people in the park today. (full) | — | There are less people in the park today. ; There are fewer peoples in the park today. ; There are more less people in the park today. | — | — | true |
| g3u04.gi.comparative-intensifiers.ec.001 | error-correction | Finde und verbessere den Fehler: My dog is very bigger than yours. [de] | My dog is much bigger than yours. (full) ; My dog is a lot bigger than yours. (full) ; My dog is far bigger than yours. (full) ; much bigger (partial) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.ec.002 | error-correction | Finde und verbessere den Fehler: He is more faster than his brother. [de] | He is much faster than his brother. (full) ; He is a lot faster than his brother. (full) ; He is far faster than his brother. (full) ; He is faster than his brother. (full) ; much faster (partial) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.ec.003 | error-correction | Finde und verbessere den Fehler: Science is much more harder than art. [de] | Science is much harder than art. (full) ; much harder (partial) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.ec.004 | error-correction | Finde und verbessere den Fehler: A whale is heavier much than an elephant. [de] | A whale is much heavier than an elephant. (full) ; A whale is a lot heavier than an elephant. (full) ; A whale is far heavier than an elephant. (full) ; much heavier (partial) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.ec.005 | error-correction | Finde und verbessere den Fehler: There is less apples in this box. [de] | There are fewer apples in this box. (full) ; fewer apples (partial) | — | — | — | — | true |
| g3u04.gi.comparative-intensifiers.ec.006 | error-correction | Finde und verbessere den Fehler: I have fewer time than yesterday. [de] | I have less time than yesterday. (full) ; less time (partial) | — | — | — | — | true |
| g3u04.gi.comparative-intensifiers.gf.001 | gap-fill | An elephant is ___ bigger than a cat. [en, 1 blank(s)] | much (full) ; a lot (full) ; far (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.gf.002 | gap-fill | A cheetah is ___ faster than a human. [en, 1 blank(s)] | much (full) ; a lot (full) ; far (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.gf.003 | gap-fill | This film about sharks is ___ more exciting than the last one. [en, 1 blank(s)] | a lot (full) ; much (full) ; far (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.gf.004 | gap-fill | This test was only ___ harder than the last one. Don't worry! [en, 1 blank(s)] | a bit (full) ; a little (full) ; slightly (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.gf.005 | gap-fill | The baby seal is ___ smaller than its mother. [en, 1 blank(s)] | a bit (full) ; a little (full) ; slightly (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.gf.006 | gap-fill | Today is ___ colder than yesterday, so I need a warmer jacket. [en, 1 blank(s)] | much (full) ; a lot (full) ; far (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.gf.007 | gap-fill | There are ___ students in our class than in theirs. [en, 1 blank(s)] | fewer (full) | — | — | — | — | true |
| g3u04.gi.comparative-intensifiers.gf.008 | gap-fill | Luckily, there are ___ sharks near this beach than near the next one. [en, 1 blank(s)] | fewer (full) | — | — | — | — | true |
| g3u04.gi.comparative-intensifiers.gf.009 | gap-fill | We should drink ___ sugar in our tea. [en, 1 blank(s)] | less (full) | — | — | — | — | true |
| g3u04.gi.comparative-intensifiers.gf.010 | gap-fill | After the storm, there is ___ water in the river. [en, 1 blank(s)] | less (full) | — | — | — | — | true |
| g3u04.gi.comparative-intensifiers.gf.012 | gap-fill | The new tablet is only ___ more expensive than the old one, but it is ___ faster. [en, 2 blank(s)] | a bit \| much (full) ; a little \| much (full) ; slightly \| much (full) ; a bit \| a lot (full) ; a little \| a lot (full) ; slightly \| far (full) ; a bit \| far (full) ; a little \| far (full) ; slightly \| a lot (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.gs.001 | group-sort | Sortiere: großer oder kleiner Unterschied? [de] | — | — | — | — | much / a lot (✓✓✓): much, a lot, far \| a bit / a little (✓): a bit, a little, slightly | false |
| g3u04.gi.comparative-intensifiers.gs.002 | group-sort | Sortiere: passt fewer oder less? (zählen ✓ → fewer, zählen ✗ → less) [de] | — | — | — | — | fewer + …: people, students, cars, sweets \| less + …: water, sugar, time, homework | true |
| g3u04.gi.comparative-intensifiers.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | Summer is much hotter than winter. (full) | — | Summer is very hotter than winter. ; Summer is more hotter than winter. ; Summer is much more hotter than winter. | — | — | false |
| g3u04.gi.comparative-intensifiers.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | This book is much more exciting than that one. (full) | — | This book is very more exciting than that one. ; This book is more much exciting than that one. ; This book is much more excitinger than that one. | — | — | false |
| g3u04.gi.comparative-intensifiers.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | A lion is much more dangerous than a cat. (full) | — | A lion is dangerous much more than a cat. ; A lion is more dangerous much than a cat. ; A lion is very more dangerous than a cat. | — | — | false |
| g3u04.gi.comparative-intensifiers.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | You should eat less sugar and fewer sweets. (full) | — | You should eat fewer sugar and less sweets. ; You should eat less sugar and less sweets. ; You should eat fewer sugar and fewer sweets. | — | — | true |
| g3u04.gi.comparative-intensifiers.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | There are fewer cars on the road today. (full) | — | There are less cars on the road today. ; There are fewest cars on the road today. ; There are more fewer cars on the road today. | — | — | true |
| g3u04.gi.comparative-intensifiers.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | A baby bear is nearly as big as a dog. (full) | — | A baby bear is nearly as bigger as a dog. ; A baby bear is nearly so big as a dog. ; A baby bear is nearly as big than a dog. | — | — | true |
| g3u04.gi.comparative-intensifiers.mp.001 | matching-pairs | Welche Erklärung passt zu welchem Satz? [de] | — | — | — | A cat is not nearly as dangerous as a lion. ↔ There is a big difference. ; Tom is nearly as tall as his father. ↔ They are almost the same. ; There are fewer sharks here. ↔ You can count them. ; There is less water here. ↔ You cannot count it. | — | false |
| g3u04.gi.comparative-intensifiers.mt.001 | matching | Welches Ende passt zu welchem Anfang? [de] | — | — | — | An elephant is much ↔ bigger than a dog. ; This test was only a bit ↔ harder than the last one. ; There are fewer ↔ cars on the road today. ; We should drink less ↔ sugar in our tea. | — | false |
| g3u04.gi.comparative-intensifiers.qf.001 | question-formation | London is much bigger than Vienna. Ask about London. Start with 'Is'. [en] | Is London much bigger than Vienna? (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.qf.002 | question-formation | A blue whale is much heavier than an elephant. Ask how much heavier. Start with 'How much'. [en] | How much heavier is a blue whale than an elephant? (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.sb.001 | sentence-building | than / is / brother / much / my / taller / me [en] | My brother is much taller than me. (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.sb.002 | sentence-building | than / is / a lot / football / popular / more / tennis [en] | Football is a lot more popular than tennis. (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.sb.003 | sentence-building | people / are / fewer / there / today / in / park / the [en] | There are fewer people in the park today. (full) | — | — | — | — | true |
| g3u04.gi.comparative-intensifiers.tf.003 | transformation | Schreib um, sodass ein großer Unterschied entsteht: A cat is much less dangerous than a lion. (not nearly as ... as) [de] | A cat is not nearly as dangerous as a lion. (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.tf.004 | transformation | Schreib um, sodass es fast gleich klingt: Tom is only a little taller than his father. (nearly as ... as) [de] | Tom is nearly as tall as his father. (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.tf.005 | transformation | Vergleiche zwei Reiseziele: Croatia is ___ (much/cheap) than Switzerland, but Switzerland is ___ (a bit/beautiful). [de, 2 blank(s)] | Croatia is much cheaper than Switzerland, but Switzerland is a bit more beautiful. (partial) ; much cheaper \| a bit more beautiful (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.tf.006 | transformation | Vergleiche zwei Videospiele: Game A is only ___ (slightly/easy) than Game B, but Game B is ___ (far/exciting). [de, 2 blank(s)] | Game A is only slightly easier than Game B, but Game B is far more exciting. (partial) ; slightly easier \| far more exciting (full) | — | — | — | — | false |
| g3u04.gi.comparative-intensifiers.tr.001 | translation | Mein Bruder ist viel größer als ich. [de] | My brother is much taller than me. (full) ; My brother is a lot taller than me. (full) ; My brother is far taller than me. (full) ; My brother is much taller than I am. (full) | deToEn | — | — | — | false |
| g3u04.gi.comparative-intensifiers.tr.002 | translation | Wir haben weniger Hausaufgaben als letzte Woche. [de] | We have less homework than last week. (full) ; We've got less homework than last week. (full) | deToEn | — | — | — | true |
| g3u04.gi.comparative-intensifiers.tr.003 | translation | In unserer Klasse sind weniger Schüler als in eurer. [de] | There are fewer students in our class than in yours. (full) ; We have fewer students in our class than you. (full) | deToEn | — | — | — | true |
| g3u04.gi.comparative-intensifiers.tr.004 | translation | Das neue Videospiel ist nur ein bisschen teurer als das alte, aber es ist viel besser. [de] | The new video game is only a bit more expensive than the old one, but it is much better. (full) ; The new video game is only a little more expensive than the old one, but it is much better. (full) ; The new video game is only slightly more expensive than the old one, but it's much better. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u04/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u04",
  "lens": "answers",
  "itemsHash": "c6b91f93f1fd",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 90, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
