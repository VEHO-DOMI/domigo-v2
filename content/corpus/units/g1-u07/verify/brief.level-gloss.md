# Verify lens — level-gloss — g1-u07 (round 1)

<!-- domigo:verify level-gloss g1-u07 items=ca45f99fa37b prompt=aefb997bf664 round=1 -->

<!-- domigo:prompt verify-level-gloss v=1 -->
# Lens 1 — level + gloss (adversarial)

You are an independent, adversarial verifier. You did NOT write these items; assume
they are wrong until the text proves otherwise. Your single question, for every
student-facing English string of every item (carriers, definitions, options,
distractors, pair sides, group members, answers):

**Could a student at exactly this point in the book read this?**

- The brief lists the allowed vocabulary (cumulative bank + closed-class allowlist +
  harvested proper nouns + numbers). A deterministic gate already checks token
  membership — your job is what the machine cannot see:
  - words that are technically in the bank but used in an UNTAUGHT meaning or idiom
    ("treat" taught only inside "trick or treat" but used as "a special treat");
  - phrases whose individual words are taught but whose combination is opaque;
  - glosses that are present but WRONG (German doesn't match the meaning in context),
    unidiomatic, or attached to the wrong word;
  - glosses for words that are actually taught (gloss-unneeded — it teaches students
    to distrust glosses);
  - definitions (`d`) above the reading level even when every token is technically
    taught (syntax too complex, relative clauses stacked, …).
- Flag kind menu: `above-level`, `gloss-missing`, `gloss-wrong`, `gloss-unneeded`.
- Severity: `fix` = a student would be blocked or mistaught; `warn` = defensible but
  worth a human look.

Be precise: every flag names the exact token/phrase and where it occurs. Do not flag
style preferences. Do not re-litigate the deterministic gate's allowlist decisions.

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?
- **g1-u05**: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar, boyfriend, its, to play, sister, can, cannot / can't, concert, to dance, Don't worry., job, perfect, to carry, to stand on, tongue, to touch, to walk on, to wiggle, can, to drink, hundred, in one go, Is that so?, This is me., economy, hospital, to laugh, (pocket) money, pound, profit, school canteen, table, teacher, uncle, to wash, nothing, Sorry?
- **g1-u06**: city, park, street, market, supermarket, river, woods, tree, to jump into the river, to look out the window, to pick something up, to sit in a tree, to fall out of the tree, to bump into a tree, to go to the park, to pull, to climb up a tree, to leave the office, to look in the mirror, to climb, to jump, to leave, mirror, to put on, away, (world's) best, detective, Help me!, office, to run, to find, to pull, to catch, clever, to come to, to live, nice, a lot of / lots of, to call, Come on!, to solve, to wait, to watch, street, to get up, to become, But it's true!, Go on., Well done.
- **g1-u07**: ice cream, chillies, fish, chicken, milk, butter, cheese, orange juice, tea, cucumber, sausages, beans, broccoli, carrot, onion, peas, an apple, mineral water, grapes, an orange, tomato (pl tomatoes), red pepper, kiwi, spinach, strawberry, sugar, bread, rice, egg, pasta, pizza, fries, chips, hamburger, chocolate, cake, breakfast, lunch, dinner, restaurant, always, usually, often, sometimes, never, meat, ham, healthy, to like, That's nice., any, to drink, to make, money, sandwich, some, vegetable, waiter, Have you got …?, I've got …, junk food, menu, Mum, plate, salad, soup, glass

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Annie, Arbeit, Articles, Bacon, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chloe, Christie, Classroom, Clown, Dan, Dana, Daniel, Dave, David, Davis, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Hmm, Holmes, Homework, Hook, Imperatives, Irregular, Jack, Jacob, James, Jamie, Jenny, Jessica, Jill, Julia, Jun, Kitty, Leah, Leo, Lethabo, Lewis, London, Lucy, Mail, Manchester, Mark, Marple, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Paws, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Present, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Sally, Saying, School, Sherlock, Steve, Sue, Tamar, Tamara, Text, Tick, Toby, Tock, Tom, True, Watson, Welcome, Well, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (67)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u07.w.always | at all times | We ___ drink tea. | never ; sometimes ; often | never ; sometimes ; often ; usually | — |
| g1u07.w.an-apple | a red food you eat for a snack | I sometimes have ___ for breakfast. | an orange ; cheese ; egg | an orange ; cheese ; egg ; ham | snack (= kleine Zwischenmahlzeit) |
| g1u07.w.an-orange | a round fruit you make juice from | Tom likes an apple, but he doesn't like ___. | an apple ; kiwi ; strawberry | an apple ; kiwi ; strawberry ; grapes | round (= rund) ; fruit (= Obst; Frucht) ; juice (= Saft) |
| g1u07.w.any | you put this word in a question, like 'Have you got …?' | Have you got ___ tomatoes? | some ; always ; never | some ; always ; never ; often | word (= Wort) ; question (= Frage) |
| g1u07.w.beans | small vegetables you can eat hot in soup | My mum likes carrots, but she doesn't like ___. | peas ; grapes ; chillies | peas ; grapes ; chillies ; onion | — |
| g1u07.w.bread | food you put butter and cheese on | For breakfast we have ___ and eggs and tomatoes. | rice ; milk ; tea | rice ; milk ; tea ; soup | — |
| g1u07.w.breakfast | the food you eat in the morning | I always have tea for ___. | lunch ; dinner ; restaurant | lunch ; dinner ; restaurant ; menu | — |
| g1u07.w.broccoli | a green vegetable like a small tree | My mum likes carrots, but she doesn't like ___. | spinach ; onion ; carrot | spinach ; onion ; carrot ; cucumber | green (= grün) |
| g1u07.w.butter | a yellow food from milk that you put on bread | He has milk, bread and ___. | sugar ; tea ; rice | sugar ; tea ; rice ; milk | yellow (= gelb) |
| g1u07.w.cake | a sweet food you make for a birthday | Mum makes a big birthday ___ with strawberries on it. | soup ; salad ; sandwich | soup ; salad ; sandwich ; pizza | sweet (= süß) |
| g1u07.w.carrot | a long orange vegetable, rabbits love it | My mum likes ___, but she doesn't like beans. | onion ; cucumber ; broccoli | onion ; cucumber ; broccoli ; spinach | rabbits (= Hasen) ; orange (= orange (Farbe)) |
| g1u07.w.cheese | a yellow food from milk that you put on pizza | My favourite food is bread with ___ in it. | butter ; sugar ; ham | butter ; sugar ; ham ; milk | yellow (= gelb) |
| g1u07.w.chicken | a bird that gives us eggs and meat | For dinner we have ___ with rice. | fish ; ham ; cheese | fish ; ham ; cheese ; meat | bird (= Vogel) |
| g1u07.w.chillies | small red food that makes your soup very hot | My mum and I always put ___ into the soup, but I don't like them. | grapes ; peas ; beans | grapes ; peas ; beans ; onion | — |
| g1u07.w.chips | food you eat hot with fish | My favourite food is fish and ___. | grapes ; beans ; peas | sausages ; grapes ; beans ; peas | — |
| g1u07.w.chocolate | a sweet brown food you love | She has a big box of ___ for her birthday. | bread ; cheese ; butter | bread ; cheese ; butter ; ham | sweet (= süß) ; brown (= braun) |
| g1u07.w.cucumber | a long vegetable you put in a salad | I like red peppers, but I don't like ___. | onion ; broccoli ; carrot | onion ; broccoli ; carrot ; spinach | — |
| g1u07.w.dinner | the food you eat in the evening | We sometimes have pizza for ___. | breakfast ; lunch ; restaurant | breakfast ; lunch ; restaurant ; menu | — |
| g1u07.w.egg | a small white ball that comes from a chicken | I sometimes have an ___ for breakfast. | cheese ; ham ; fish | cheese ; ham ; fish ; butter | white (= weiß) ; ball (= Kugel; Ball) ; comes (= kommt) |
| g1u07.w.fish | an animal that lives in water | We have ___ and chips for dinner on Friday. | chicken ; ham ; meat | chicken ; ham ; meat ; egg | animal (= Tier) ; water (= Wasser) |
| g1u07.w.fries | long hot potato that you eat with a hamburger | I always have ___ with my hamburger. | soup ; salad ; cake | soup ; salad ; cake ; rice | potato (= Kartoffel) |
| g1u07.w.glass | you drink water or juice from it | Would you like a ___ of orange juice? | plate ; menu ; waiter | plate ; menu ; waiter ; restaurant | water (= Wasser) ; juice (= Saft) |
| g1u07.w.grapes | small sweet fruits, you eat many of them | I love small green ___ from the market. | peas ; beans ; chillies | peas ; beans ; chillies ; strawberry | sweet (= süß) ; fruits (= Früchte) ; green (= grün) |
| g1u07.w.ham | pink meat from a pig that you put in a sandwich | On Sunday, I sometimes have ___ and eggs for breakfast. | fish ; egg ; cheese | fish ; egg ; cheese ; meat | pink (= rosa) ; pig (= Schwein) |
| g1u07.w.hamburger | meat in bread that you eat with fries | We often go to the ___ restaurant for lunch. | sandwich ; soup ; salad | sandwich ; soup ; salad ; pizza | — |
| g1u07.w.have-you-got | you say this to ask if a person has a thing | ___ any chips? | I've got … ; That's nice. ; to like | I've got … ; That's nice. ; to like ; to make | say (= sagen; sagst) ; person (= Person; jemand) |
| g1u07.w.healthy | good for your body | A lot of junk food isn't ___. | junk food ; sugar ; chocolate | junk food ; sugar ; chocolate ; cake | body (= Körper) |
| g1u07.w.i-ve-got | you say this when you have a thing | Yes, ___ four bags of chips. | Have you got …? ; That's nice. ; to like | Have you got …? ; That's nice. ; to like ; to make | say (= sagen; sagst) ; bags (= Tüten; Beutel) |
| g1u07.w.ice-cream | a cold food you love on a hot day | On a hot day I love a cold ___. | soup ; bread ; rice | soup ; bread ; rice ; cheese | — |
| g1u07.w.junk-food | what you eat that is bad for your body, like chips | A lot of ___ isn't healthy. | breakfast ; vegetable ; salad | breakfast ; vegetable ; salad ; soup | body (= Körper) |
| g1u07.w.kiwi | a small brown fruit, green inside | Jenny doesn't like an apple, but she likes ___. | an apple ; an orange ; strawberry | an apple ; an orange ; strawberry ; grapes | brown (= braun) ; fruit (= Obst; Frucht) ; green (= grün) ; inside (= innen; drinnen) |
| g1u07.w.lunch | the food you eat at lunchtime | For ___ we often have pizza. | breakfast ; dinner ; restaurant | breakfast ; dinner ; restaurant ; menu | — |
| g1u07.w.meat | food from a cow or a pig | I am vegetarian. I never eat ___. | bread ; rice ; cheese | bread ; rice ; cheese ; milk | cow (= Kuh) ; pig (= Schwein) ; vegetarian (= vegetarisch; isst kein Fleisch) |
| g1u07.w.menu | it shows you the food in a restaurant | Can I have the ___, please? | plate ; glass ; waiter | plate ; glass ; waiter ; restaurant | — |
| g1u07.w.milk | a white drink from a cow | I never drink ___ for breakfast. | tea ; bread ; cheese | tea ; bread ; cheese ; butter | white (= weiß) ; cow (= Kuh) |
| g1u07.w.mineral-water | a clean drink from a bottle, with no sugar in it | I like ___, but I don't like tea. | orange juice ; tea ; milk | orange juice ; tea ; milk ; soup | — |
| g1u07.w.money | you give this for food in a restaurant | How much ___ have you got? | bread ; menu ; plate | bread ; menu ; plate ; glass | — |
| g1u07.w.mum | the word for your mother | My ___ makes breakfast. | waiter ; menu ; plate | waiter ; menu ; plate ; glass | word (= Wort) ; mother (= Mutter) |
| g1u07.w.never | not at any time | She is vegetarian. She ___ eats meat. | always ; usually ; often | always ; usually ; often ; sometimes | vegetarian (= vegetarisch; isst kein Fleisch) |
| g1u07.w.often | many times, but not always | In my family we ___ eat rice. | never ; always ; usually | never ; always ; usually ; sometimes | — |
| g1u07.w.onion | a round vegetable, it makes you cry when you cut it | I put ___ in the soup, and it makes me cry. | carrot ; broccoli ; cucumber | carrot ; broccoli ; cucumber ; spinach | round (= rund) ; cry (= weinen) ; cut (= schneiden) |
| g1u07.w.orange-juice | a drink you make from a round fruit | I like ___ , but I don't like milk. | mineral water ; tea ; milk | mineral water ; tea ; milk ; soup | round (= rund) ; fruit (= Obst) |
| g1u07.w.pasta | food you eat hot, often with tomatoes | For lunch we often have ___. | rice ; bread ; cheese | rice ; bread ; cheese ; soup | — |
| g1u07.w.peas | small green vegetables you eat in your soup | There are small green ___ in my soup. | beans ; grapes ; chillies | beans ; grapes ; chillies ; onion | green (= grün) |
| g1u07.w.pizza | a hot food with cheese and tomatoes on it | We sometimes have ___ for lunch or dinner. | soup ; salad ; sandwich | soup ; salad ; sandwich ; cake | — |
| g1u07.w.plate | you put your food on it and then you eat | Can I have a clean ___? | glass ; menu ; waiter | glass ; menu ; waiter ; restaurant | — |
| g1u07.w.red-pepper | a big vegetable you eat in a salad | He likes ___, but he doesn't like carrots. | cucumber ; onion ; broccoli | cucumber ; onion ; broccoli ; carrot | — |
| g1u07.w.restaurant | you go there to eat, and a waiter brings the food | We sometimes go to a ___ on Sunday. | breakfast ; menu ; waiter | breakfast ; menu ; waiter ; plate | — |
| g1u07.w.rice | small white food you eat with meat and vegetables | For lunch or dinner we have a lot of ___. | bread ; cheese ; milk | bread ; cheese ; milk ; pasta | white (= weiß) |
| g1u07.w.salad | a cold food with tomatoes and cucumber | I want to make a ___. | soup ; cake ; sandwich | soup ; cake ; sandwich ; pizza | — |
| g1u07.w.sandwich | bread with cheese or ham in it | I have a cheese ___ for lunch. | soup ; salad ; cake | soup ; salad ; cake ; pizza | — |
| g1u07.w.sausages | long meat that you eat hot | My sister is vegetarian. She never eats meat or ___. | beans ; grapes ; peas | beans ; grapes ; peas ; chips | vegetarian (= vegetarisch; isst kein Fleisch) |
| g1u07.w.some | a little, not a lot | I need ___ cheese. | any ; always ; never | any ; always ; never ; often | little (= wenig) ; lot (= viel; eine Menge) ; need (= brauche; brauchst) |
| g1u07.w.sometimes | not always, but now and then | I ___ have an egg for breakfast. | always ; never ; usually | always ; never ; usually ; often | — |
| g1u07.w.soup | a hot food you eat when it is cold | Can I have a ___, please? | salad ; cake ; sandwich | salad ; cake ; sandwich ; pizza | — |
| g1u07.w.spinach | a green vegetable with big leaves | I like fish with rice or vegetables — tomatoes or ___. | broccoli ; carrot ; onion | broccoli ; carrot ; onion ; cucumber | green (= grün) |
| g1u07.w.strawberry | a small red fruit you put on a cake | Mum makes a big birthday cake with one red ___ on it. | an apple ; an orange ; kiwi | an apple ; an orange ; kiwi ; grapes | fruit (= Obst; Frucht) |
| g1u07.w.sugar | a sweet white thing you put in your tea | Do you want one or two spoons of ___ in your tea? | butter ; milk ; tea | butter ; milk ; tea ; rice | sweet (= süß) ; white (= weiß) ; spoons (= Löffel) |
| g1u07.w.tea | a hot drink, grandma drinks it with sugar | I always drink ___ for breakfast. | milk ; bread ; rice | milk ; bread ; rice ; soup | — |
| g1u07.w.that-s-nice | you say this when you hear good news | I love chicken, eggs and cheese. — ___ | Have you got …? ; I've got … ; to like | Have you got …? ; I've got … ; to like ; to make | say (= sagen; sagst) ; hear (= hören; hörst) ; news (= Neuigkeit(en)) |
| g1u07.w.to-drink | to have water, tea or milk in your mouth | Would you like something to ___? | to make ; to like ; Have you got …? | to make ; to like ; Have you got …? ; I've got … | water (= Wasser) ; something (= etwas) |
| g1u07.w.to-like | to think a food is good or nice | I ___ orange juice, but I don't like milk. | to make ; to drink ; Have you got …? | to make ; to drink ; Have you got …? ; I've got … | think (= denken; finden) |
| g1u07.w.to-make | you do this with food when you cook it | I want to ___ a salad. | to drink ; to like ; Have you got …? | to drink ; to like ; Have you got …? ; I've got … | cook (= kochen) |
| g1u07.w.tomato | a red vegetable you eat in a salad | For breakfast we often have bread and eggs and ___. | onion ; cucumber ; broccoli | onion ; cucumber ; broccoli ; carrot | — |
| g1u07.w.usually | almost always, but not at all times | In the morning, we ___ have a soup with meat. | never ; sometimes ; always | never ; sometimes ; always ; often | almost (= fast) |
| g1u07.w.vegetable | broccoli, a carrot or an onion is this | Broccoli is a green ___. | cake ; soup ; sandwich | cake ; soup ; sandwich ; menu | green (= grün) |
| g1u07.w.waiter | the man who brings the food in a restaurant | The ___ brings the food to your table. | menu ; plate ; restaurant | menu ; plate ; restaurant ; glass | — |

## Grammar items (78)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u07.gi.adverbs-frequency.ag.001 | anagram | manchmal (etwa 50%) [de] | sometimes (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.ag.002 | anagram | nie (0%) [de] | never (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.cp.001 | context-picker | Your friend asks about breakfast. You eat breakfast 100% of the time. [en] | I always eat breakfast. (full) | I eat always breakfast. ; Always I eat breakfast. ; I eat breakfast always. | — | — | — |
| g1u07.gi.adverbs-frequency.cp.002 | context-picker | Your friend asks about your sister. She is hungry all the time. [en] | She is always hungry. (full) | She always is hungry. ; She is hungry always. ; Always she is hungry. | — | — | — |
| g1u07.gi.adverbs-frequency.ec.001 | error-correction | I eat always breakfast. [en] | I always eat breakfast. (full) ; always eat (partial) | — | — | — | — |
| g1u07.gi.adverbs-frequency.ec.002 | error-correction | She always is happy. [en] | She is always happy. (full) ; is always (partial) | — | — | — | — |
| g1u07.gi.adverbs-frequency.ec.003 | error-correction | He drinks never milk. [en] | He never drinks milk. (full) ; never drinks (partial) | — | — | — | — |
| g1u07.gi.adverbs-frequency.gf.001 | gap-fill | I ___ eat breakfast before school. [en, 1 blank(s)] | always (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.gf.002 | gap-fill | I ___ drink milk. I don't like it. (0%) [en, 1 blank(s)] | never (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.gf.003 | gap-fill | She ___ eats cheese for lunch. (80%) [en, 1 blank(s)] | usually (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.gf.004 | gap-fill | We ___ have pizza for dinner. (50%) [en, 1 blank(s)] | sometimes (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.gf.005 | gap-fill | I'm ___ hungry in the morning. (100%) [en, 1 blank(s)] | always (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.gf.006 | gap-fill | He ___ eats rice, and his sister is ___ hungry. (often / always) [en, 2 blank(s)] | often \| always (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.gs.002 | group-sort | Wie oft? Sortiere von 0% bis 100%. [de] | — | — | — | 0%: I never eat fish., She never drinks milk. \| 50%: We sometimes have pizza., He sometimes eats cake. \| 100%: I always eat breakfast., They always drink tea. | — |
| g1u07.gi.adverbs-frequency.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | She always eats cheese. (full) | She eats always cheese. ; Always she eats cheese. ; She eats cheese always. | — | — | — |
| g1u07.gi.adverbs-frequency.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | He is always hungry. (full) | He always is hungry. ; Always he is hungry. ; He is hungry always. | — | — | — |
| g1u07.gi.adverbs-frequency.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | I never eat fish. (full) | I eat never fish. ; I don't never eat fish. ; Never I eat fish. | — | — | — |
| g1u07.gi.adverbs-frequency.mp.002 | matching-pairs | Was passt zusammen? [de] | — | — | I always eat breakfast ↔ in the morning. ; We sometimes have pizza ↔ for lunch. ; She never drinks milk ↔ at school. ; He often has soup ↔ for dinner. | — | — |
| g1u07.gi.adverbs-frequency.mt.002 | matching | Wie oft? Bilde die Sätze. [de] | — | — | I never ↔ eat fish. ; She usually ↔ drinks tea. ; We often ↔ have rice. ; He sometimes ↔ eats cake. | — | — |
| g1u07.gi.adverbs-frequency.sb.001 | sentence-building | always / I / eat / breakfast [en] | I always eat breakfast. (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.sb.002 | sentence-building | is / She / always / hungry [en] | She is always hungry. (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.sb.003 | sentence-building | never / We / drink / milk [en] | We never drink milk. (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.tf.001 | transformation | I drink tea. (usually) [en] | I usually drink tea. (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.tf.002 | transformation | They are happy. (often) [en] | They are often happy. (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.tf.003 | transformation | She eats meat. (never) [en] | She never eats meat. (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.tr.001 | translation | Ich esse immer Frühstück. [de] | I always eat breakfast. (full) ; I always have breakfast. (full) | — | — | — | — |
| g1u07.gi.adverbs-frequency.tr.002 | translation | Sie ist manchmal hungrig. [de] | She is sometimes hungry. (full) ; Sometimes she is hungry. (full) ; She's sometimes hungry. (full) | — | — | — | — |
| g1u07.gi.articles-a-an.cp.001 | context-picker | Du zeigst auf den Nachtisch und sagst, was du willst. Welcher Satz ist richtig? [de] | I want an ice cream. (full) | I want a ice cream. ; I want the ice cream. ; I want ice cream. | — | — | — |
| g1u07.gi.articles-a-an.cp.002 | context-picker | Du sagst dem Kellner, was du möchtest. Welcher Satz ist richtig? [de] | I want a hamburger. (full) | I want an hamburger. ; I want the hamburger. ; I want hamburger. | — | — | — |
| g1u07.gi.articles-a-an.ec.001 | error-correction | Finde den Fehler und verbessere ihn: It is a onion. [de] | It is an onion. (full) ; an onion (partial) | — | — | — | — |
| g1u07.gi.articles-a-an.ec.002 | error-correction | Finde den Fehler und verbessere ihn: She has an pizza. [de] | She has a pizza. (full) ; a pizza (partial) | — | — | — | — |
| g1u07.gi.articles-a-an.ec.003 | error-correction | Finde den Fehler und verbessere ihn: I want a egg for breakfast. [de] | I want an egg for breakfast. (full) ; an egg (partial) | — | — | — | — |
| g1u07.gi.articles-a-an.gf.001 | gap-fill | He wants ___ egg for breakfast. [en, 1 blank(s)] | an (full) | — | — | — | — |
| g1u07.gi.articles-a-an.gf.002 | gap-fill | I eat ___ hot dog. [en, 1 blank(s)] | a (full) | — | — | — | — |
| g1u07.gi.articles-a-an.gf.003 | gap-fill | She has ___ pizza for lunch. [en, 1 blank(s)] | a (full) | — | — | — | — |
| g1u07.gi.articles-a-an.gf.004 | gap-fill | It is ___ onion. [en, 1 blank(s)] | an (full) | — | — | — | — |
| g1u07.gi.articles-a-an.gf.005 | gap-fill | Do you want ___ ice cream? [en, 1 blank(s)] | an (full) | — | — | — | — |
| g1u07.gi.articles-a-an.gf.006 | gap-fill | I want ___ egg and ___ hot dog. [en, 2 blank(s)] | an \| a (full) | — | — | — | — |
| g1u07.gi.articles-a-an.gf.007 | gap-fill | She has ___ tomato and ___ onion. [en, 2 blank(s)] | a \| an (full) | — | — | — | — |
| g1u07.gi.articles-a-an.gs.001 | group-sort | a oder an? Sortiere die Wörter. [de] | — | — | — | a: a hot dog, a pizza, a tomato, a carrot, a sandwich \| an: an egg, an apple, an orange, an onion, an ice cream | — |
| g1u07.gi.articles-a-an.mc.001 | multiple-choice | Welches Wort passt vor egg? [de] | an (full) | a ; the ; some | — | — | — |
| g1u07.gi.articles-a-an.mc.002 | multiple-choice | Welches Wort passt vor pizza? [de] | a (full) | an ; the ; some | — | — | — |
| g1u07.gi.articles-a-an.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | He wants an egg. (full) | He wants a egg. ; He wants the egg. ; He wants egg. | — | — | — |
| g1u07.gi.articles-a-an.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | It is an onion. (full) | It is a onion. ; It is the onion. ; It is onion. | — | — | — |
| g1u07.gi.articles-a-an.mp.001 | matching-pairs | Finde die Paare: Wort und richtige Form. [de] | — | — | onion ↔ an onion ; tomato ↔ a tomato ; egg ↔ an egg ; sandwich ↔ a sandwich ; ice cream ↔ an ice cream ; carrot ↔ a carrot | — | — |
| g1u07.gi.articles-a-an.mt.001 | matching | Verbinde das Wort mit der richtigen Form. [de] | — | — | egg ↔ an egg ; hot dog ↔ a hot dog ; onion ↔ an onion ; pizza ↔ a pizza | — | — |
| g1u07.gi.articles-a-an.sb.001 | sentence-building | an / egg / want / I [en] | I want an egg. (full) | — | — | — | — |
| g1u07.gi.articles-a-an.sb.002 | sentence-building | a / hot / dog / wants / He [en] | He wants a hot dog. (full) | — | — | — | — |
| g1u07.gi.articles-a-an.sb.003 | sentence-building | an / and / a / want / hot / dog / I / egg [en] | I want an egg and a hot dog. (full) | — | — | — | — |
| g1u07.gi.articles-a-an.tf.001 | transformation | Setze a oder an ein: I eat ___ ice cream. [de, 1 blank(s)] | I eat an ice cream. (full) ; an (partial) | — | — | — | — |
| g1u07.gi.articles-a-an.tf.002 | transformation | Setze a oder an ein: She wants ___ carrot. [de, 1 blank(s)] | She wants a carrot. (full) ; a (partial) | — | — | — | — |
| g1u07.gi.articles-a-an.tr.001 | translation | Ich möchte einen Apfel. [de] | I want an apple. (full) ; I would like an apple. (partial) | — | — | — | — |
| g1u07.gi.articles-a-an.tr.002 | translation | Sie isst eine Pizza. [de] | She eats a pizza. (full) ; She has a pizza. (partial) | — | — | — | — |
| g1u07.gi.present-simple-negative.ag.002 | anagram | das Wort für nicht (mit do) bei he/she/it (kurze Form von does not): [de] | doesn't (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.cp.001 | context-picker | Ein Mädchen isst kein Fleisch. Welcher Satz stimmt? [de] | She doesn't eat meat. (full) | She don't eat meat. ; She doesn't eats meat. ; She not eat meat. | — | — | — |
| g1u07.gi.present-simple-negative.cp.002 | context-picker | Du und deine Freunde mögt keinen Reis. Welcher Satz stimmt? [de] | We don't like rice. (full) | We doesn't like rice. ; We don't likes rice. ; We not like rice. | — | — | — |
| g1u07.gi.present-simple-negative.ec.001 | error-correction | He don't like vegetables. [en] | He doesn't like vegetables. (full) ; He does not like vegetables. (full) ; doesn't (partial) ; does not (partial) | — | — | — | — |
| g1u07.gi.present-simple-negative.ec.002 | error-correction | She doesn't eats broccoli. [en] | She doesn't eat broccoli. (full) ; She does not eat broccoli. (full) ; eat (partial) | — | — | — | — |
| g1u07.gi.present-simple-negative.ec.003 | error-correction | The dog don't like grapes. [en] | The dog doesn't like grapes. (full) ; The dog does not like grapes. (full) ; doesn't (partial) | — | — | — | — |
| g1u07.gi.present-simple-negative.gf.001 | gap-fill | I ___ like rice. [en, 1 blank(s)] | don't (full) ; do not (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.gf.002 | gap-fill | He ___ like carrots. [en, 1 blank(s)] | doesn't (full) ; does not (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.gf.003 | gap-fill | She ___ (not / eat) meat. [en, 1 blank(s)] | doesn't eat (full) ; does not eat (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.gf.004 | gap-fill | They ___ (not / like) fish. [en, 1 blank(s)] | don't like (full) ; do not like (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.gf.005 | gap-fill | Tom ___ (not / eat) broccoli and his friends ___ (not / eat) it. [en, 2 blank(s)] | doesn't eat \| don't eat (full) ; does not eat \| do not eat (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.gf.006 | gap-fill | My sister ___ (not / drink) milk. [en, 1 blank(s)] | doesn't drink (full) ; does not drink (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.gs.001 | group-sort | Sortiere: braucht der Satz don't oder doesn't? [de] | — | — | — | don't: I, you, we, they \| doesn't: he, she, it | — |
| g1u07.gi.present-simple-negative.gs.002 | group-sort | Welche Sätze sind richtig (yes), welche falsch (no)? [de] | — | — | — | yes: He doesn't like rice., We don't eat meat., She doesn't drink milk. \| no: He don't like rice., We doesn't eat meat., She doesn't drinks milk. | — |
| g1u07.gi.present-simple-negative.mc.001 | multiple-choice | Tom ___ tea in the morning. [en, 1 blank(s)] | doesn't drink (full) | don't drink ; doesn't drinks ; drinks not | — | — | — |
| g1u07.gi.present-simple-negative.mc.002 | multiple-choice | We ___ vegetables for breakfast. [en, 1 blank(s)] | don't eat (full) | doesn't eat ; don't eats ; eat not | — | — | — |
| g1u07.gi.present-simple-negative.mc.003 | multiple-choice | My friend ___ tomatoes. [en, 1 blank(s)] | doesn't like (full) | don't like ; doesn't likes ; like not | — | — | — |
| g1u07.gi.present-simple-negative.mt.002 | matching | Was passt zusammen? [de] | — | — | I ↔ don't eat meat ; He ↔ doesn't like rice ; She ↔ doesn't drink milk ; They ↔ don't eat fish | — | — |
| g1u07.gi.present-simple-negative.sb.001 | sentence-building | eat / doesn't / She / meat [en] | She doesn't eat meat. (full) ; She does not eat meat. (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.sb.002 | sentence-building | like / don't / We / carrots [en] | We don't like carrots. (full) ; We do not like carrots. (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.tf.001 | transformation | I like spinach. → I ___ spinach. [en, 1 blank(s)] | don't like (full) ; do not like (full) ; I don't like spinach. (full) ; I do not like spinach. (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.tf.002 | transformation | He likes peas. → He ___ peas. [en, 1 blank(s)] | doesn't like (full) ; does not like (full) ; He doesn't like peas. (full) ; He does not like peas. (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.tr.001 | translation | Ich mag keinen Fisch. [de] | I don't like fish. (full) ; I do not like fish. (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.tr.002 | translation | Meine Schwester mag keinen Reis. [de] | My sister doesn't like rice. (full) ; My sister does not like rice. (full) | — | — | — | — |
| g1u07.gi.present-simple-negative.tr.003 | translation | I don't like soup. [en] | Ich mag keine Suppe. (full) ; Ich mag Suppe nicht. (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u07/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u07",
  "lens": "level-gloss",
  "itemsHash": "ca45f99fa37b",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 145, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
