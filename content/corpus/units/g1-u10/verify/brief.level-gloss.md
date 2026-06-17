# Verify lens — level-gloss — g1-u10 (round 1)

<!-- domigo:verify level-gloss g1-u10 items=5c0bbc31ed04 prompt=aefb997bf664 round=1 -->

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
- **g1-u08**: cap, mask, jacket, sweater, blouse, trousers, hoodie, cape, pyjamas, tights, shoes, boots, trainers, belt, hole, anything, to borrow, to fit, to try on, to wear, to hurt, poem, to tickle, somebody, backwards, exciting, tonight, horse, building, Let's get out of here.
- **g1-u09**: owl, budgie, elephant, spider, bat, shark, zebra, camel, pony, guinea pig, fish, pig, rabbit, lizard, rat, mouse, tortoise, box, tank, cage, terrarium, unusual, mouse (pl mice), (...) a day, once, twice, across (Britain), dangerous, farm, man (pl men), near, newspaper, (...) a week, basket, daughter, to drive, everybody, far away, grandpa, mother, noise, to stay, cuddly toy, to visit, to be interested in, fur, personal, owner, aunty, dear, letter, to bite, beginning, to begin, best wishes, ending, to need
- **g1-u10**: 20 twenty, 30 thirty, 40 forty, 50 fifty, 60 sixty, 70 seventy, 80 eighty, 90 ninety, 100 one hundred, 1000 one thousand, how much is/are ..., price, these, those, Anything else?, Can I help you?, computer game, headphones, key ring, magazine, mobile phone, scooter, sweets (pl), tin, Congratulations!, rule, customer, everything, expensive, to fall asleep, Goodbye., I'd like ..., No wonder., suddenly, town, to walk away, changing room, No problem., over there, drawer, That's better., What can I do for you?, Be careful., Just a minute.

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alphabet, Anderson, Anger, Annie, Arbeit, Archie, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chester, Chloe, Christie, Clare, Classroom, Clothes, Clown, Come, Complimenting, Dan, Dana, Daniel, Dave, David, Davis, Debbie, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, Emma, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Hmm, Holmes, Homework, Hook, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Jenny, Jessica, Jill, John, Jolly, Julia, Jun, Kitty, Leah, Leo, Lethabo, Lewis, London, Lucy, Mail, Manchester, Mandy, Manson, Mark, Marple, Mary, Matt, Mike, Miss, Mr, Mrs, Mum, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Palace, Pardon, Paws, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Prepositions, Present, Priestly, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Steve, Sue, Tamar, Tamara, Tammy, Text, Think, Tick, Toby, Tock, Tom, Tony, True, Um, Walker, Wall, Watson, Welcome, Well, White, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (44)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u10.w.100-one-hundred | It is ten times ten. | The mobile phone is over ___ pounds. It is very expensive. | one thousand ; ninety ; ten | one thousand ; ninety ; ten ; thirty | — |
| g1u10.w.1000-one-thousand | It is ten times a hundred. | This mobile phone is over ___ pounds! That is a lot of money. | one hundred ; ninety ; fifty | one hundred ; ninety ; fifty ; thirty | — |
| g1u10.w.20-twenty | The number after 19 and before 21. It is two times ten. | Look at the price tag: the headphones are ___ pounds. | thirty ; fifty ; ten | thirty ; fifty ; ten ; forty | price tag (= Preisschild) |
| g1u10.w.30-thirty | The number after 29 and before 31. It is three times ten. | Look at the price tag. The book is ___ pounds. | twenty ; forty ; ten | twenty ; forty ; ten ; fifty | price tag (= Preisschild) |
| g1u10.w.40-forty | The number after 39 and before 41. It is four times ten. | I'd like ___ kilos of beans, please. I love beans! | fifty ; twenty ; thirty | fifty ; twenty ; thirty ; ten | kilos (= Kilo) |
| g1u10.w.50-fifty | The number after 49 and before 51. It is five times ten. | Trainers for ___ pounds! Come and see them in the window. | forty ; sixty ; twenty | forty ; sixty ; twenty ; thirty | see (= sehen) |
| g1u10.w.60-sixty | The number after 59 and before 61. It is six times ten. | How much is the magazine? It's ___ pence. | fifty ; seventy ; twenty | fifty ; seventy ; twenty ; thirty | pence (= Pence (Cent in Großbritannien)) |
| g1u10.w.70-seventy | The number after 69 and before 71. It is seven times ten. | The price of the shoes in the window is ___ pounds. | sixty ; eighty ; twenty | sixty ; eighty ; twenty ; thirty | — |
| g1u10.w.80-eighty | The number after 79 and before 81. It is eight times ten. | A jacket for ___ pounds! Look at the price tag. | seventy ; ninety ; twenty | seventy ; ninety ; twenty ; thirty | price tag (= Preisschild) |
| g1u10.w.90-ninety | The number after 89 and before 91. Ten more and you have one hundred. | Three sweaters for ___ pounds! That's a good price. | eighty ; seventy ; one hundred | eighty ; seventy ; one hundred ; thirty | — |
| g1u10.w.anything-else | In a shop, you ask this to find out if the customer wants more. | Here are your three key rings. ___ — No, thank you. | No problem. ; Goodbye. ; That's better. | No problem. ; Goodbye. ; That's better. ; thirty | shop (= Geschäft, Laden) |
| g1u10.w.be-careful | You want a friend to look out, so they are not hurt. | The floor is wet over there. ___ Don't fall down! | No problem. ; Goodbye. ; Just a minute. | No problem. ; Goodbye. ; Just a minute. ; thirty | floor (= Boden) ; wet (= nass) ; fall (= fallen) |
| g1u10.w.can-i-help-you | In a shop, you ask this when a customer comes in. | ___ — Yes, please. How much is this magazine? | What can I do for you? ; Anything else? ; No wonder. | What can I do for you? ; Anything else? ; No wonder. ; thirty | shop (= Geschäft, Laden) ; comes (= kommt) |
| g1u10.w.changing-room | In a shop, you go in here to try on clothes. | You can't try the trousers on here. Go to the ___, please. | drawer ; town ; window | drawer ; town ; window ; thirty | shop (= Geschäft, Laden) ; try (= anprobieren) |
| g1u10.w.computer-game | Something fun you play on a screen. | How much is this ___? — It's 34 pounds. | magazine ; scooter ; headphones | magazine ; scooter ; headphones ; thirty | screen (= Bildschirm) ; something (= etwas) |
| g1u10.w.congratulations | You are very happy for a friend who did something very well. | You are the best in the class! ___ Well done! | No wonder. ; Be careful. ; Goodbye. | No wonder. ; Be careful. ; Goodbye. ; thirty | something (= etwas) |
| g1u10.w.customer | Somebody who comes to a shop and gives money for food and clothes. | Mr Anderson is nice to every ___ in his shop. | price ; town ; rule | price ; town ; rule ; thirty | shop (= Geschäft, Laden) ; every (= jede/r) ; comes (= kommt) |
| g1u10.w.drawer | A box in a desk that you pull open. Your socks or pens are in it. | All my socks are in the ___ — I pull it open to get them. | window ; door ; changing room | window ; door ; changing room ; thirty | get (= holen) |
| g1u10.w.everything | All of it, with nothing forgotten. | Have you got ___ for the trip — your bag, your shoes and your hat? | nothing ; those ; these | nothing ; those ; these ; thirty | trip (= Ausflug) ; bag (= Tasche) ; forgotten (= vergessen) |
| g1u10.w.expensive | It is a lot of money. You need a lot of money to get it. | Everything in this shop is very ___. I can't get it all. | happy ; free ; small | happy ; free ; small ; thirty | shop (= Geschäft, Laden) ; get (= bekommen) |
| g1u10.w.goodbye | A nice bye, when you go away or leave. | Thank you for your money. Here are your sweets. ___ | Hello. ; No wonder. ; Anything else? | Hello. ; No wonder. ; Anything else? ; thirty | — |
| g1u10.w.headphones | You put them over your two ears so you can listen to music. | She can't listen to you now. She has ___ on for her music. | sunglasses ; magazine ; scooter | sunglasses ; magazine ; scooter ; thirty | music (= Musik) |
| g1u10.w.how-much-is-are | You ask this in a shop when you want to find out the price of something. | ___ the trainers? — They're 69 pounds. | Anything else? ; No problem. ; That's better. | Anything else? ; No problem. ; That's better. ; thirty | shop (= Geschäft, Laden) ; something (= etwas) |
| g1u10.w.i-d-like | You want something in a shop, so you ask for it. | ___ 20 kilos of rice, please. And then some carrots. | No problem. ; Be careful. ; Anything else? | No problem. ; Be careful. ; Anything else? ; thirty | shop (= Geschäft, Laden) ; kilos (= Kilo) ; something (= etwas) |
| g1u10.w.just-a-minute | You ask a friend to wait a very short time. | ___ I want to find my keys before we go out. | No wonder. ; Be careful. ; That's better. | No wonder. ; Be careful. ; That's better. ; thirty | keys (= Schlüssel) |
| g1u10.w.key-ring | You open your door with what is on it. Then you don't lose it. | I put my door key on my ___ so I don't lose it. | magazine ; tin ; scooter | magazine ; tin ; scooter ; thirty | lose (= verlieren) |
| g1u10.w.magazine | A thin book with lots of pictures and short stories. You read it for fun. | Can I have this ___, please? I want to read it on the train. | computer game ; headphones ; tin | computer game ; headphones ; tin ; thirty | thin (= dünn) |
| g1u10.w.mobile-phone | A small thing you take with you. You can call your friends and read messages on it. | I'd like a ___, please. I want to call my friends with it. | computer game ; scooter ; magazine | computer game ; scooter ; magazine ; thirty | messages (= Nachrichten) ; take (= mitnehmen) |
| g1u10.w.no-problem | It is all good. You are happy to help. | I don't like the jeans. — ___ What about the trousers over there? | No wonder. ; Be careful. ; Anything else? | No wonder. ; Be careful. ; Anything else? ; thirty | jeans (= Jeans) ; help (= helfen) |
| g1u10.w.no-wonder | You understand why it happens. It is not a big surprise. | Everything here is so expensive! ___ I can't get it all. | No problem. ; Be careful. ; That's better. | No problem. ; Be careful. ; That's better. ; thirty | surprise (= Überraschung) ; get (= bekommen) |
| g1u10.w.over-there | Not near you. It is far away, but you can still see it. | How much are those socks ___ in the window? | over here ; next to ; in front of | over here ; next to ; in front of ; thirty | see (= sehen) |
| g1u10.w.price | How much money you give for something. You can see it on the tag. | There's no ___ on the key ring, so I can't see how much it is. | rule ; town ; drawer | rule ; town ; drawer ; thirty | tag (= Schildchen, Etikett) ; something (= etwas) ; see (= sehen) |
| g1u10.w.rule | Something that you must do or must not do. In class you cannot break it. | One ___ in our shop is: be nice to every customer. | price ; town ; drawer | price ; town ; drawer ; thirty | shop (= Geschäft, Laden) ; something (= etwas) ; every (= jede/r) |
| g1u10.w.scooter | You stand on it and push with one foot. It has two small wheels. | I ride my ___ to school every morning. | computer game ; headphones ; magazine | computer game ; headphones ; magazine ; thirty | push (= stoßen, schieben) ; wheels (= Räder) ; ride (= fahren) ; every (= jede/r) |
| g1u10.w.suddenly | When something happens all at once. You do not understand it before. | Mr Anderson is asleep. ___, a horse comes into the shop! | always ; usually ; often | always ; usually ; often ; thirty | shop (= Geschäft, Laden) ; something (= etwas) ; asleep (= schlafend) ; comes (= kommt) |
| g1u10.w.sweets | You eat them and they have a lot of sugar. They are very nice, but bad for your teeth. | The ___ are one pound 99. Don't eat too many! | headphones ; tin ; magazine | headphones ; tin ; magazine ; thirty | — |
| g1u10.w.that-s-better | Something is good now, but it was not good before. | Put the sweater in the drawer. ___ Now it looks nice. | No wonder. ; Be careful. ; No problem. | No wonder. ; Be careful. ; No problem. ; thirty | something (= etwas) |
| g1u10.w.these | When there is more than one and it is here, close to you. | I'd like ___ shoes here in front of me, please. | those ; that ; everything | those ; that ; everything ; thirty | — |
| g1u10.w.those | When there is more than one and it is over there, far from you. | I'd like ___ trainers over there in the window. | these ; this ; everything | these ; this ; everything ; thirty | far (= weit) |
| g1u10.w.tin | There is food in it. You open it to get the chicken soup out. | A ___ of chicken soup, please. We can have it for dinner. | scooter ; headphones ; magazine | scooter ; headphones ; magazine ; thirty | get (= holen) |
| g1u10.w.to-fall-asleep | To go to sleep. You are tired and then your eyes close. | There are no customers, so Mr Anderson sits on his chair and ___. | walk away ; sit down ; stand up | walk away ; sit down ; stand up ; thirty | sits (= sitzt) |
| g1u10.w.to-walk-away | To leave a room on your feet. | The horse picks up the food and ___ from the shop. | come back ; fall asleep ; stand up | come back ; fall asleep ; stand up ; thirty | shop (= Geschäft, Laden) ; picks (= nimmt) |
| g1u10.w.town | A small city with streets, houses and shops. Many families live here. | There's a small shop in our ___ on Baker Street. | city ; park ; river | city ; park ; river ; thirty | houses (= Häuser) ; shops (= Geschäfte, Läden) ; shop (= Geschäft, Laden) |
| g1u10.w.what-can-i-do-for-you | In a shop, you ask a customer this to find out how to help. | Good morning! ___ — Yes, I'd like a magazine, please. | Can I help you? ; Anything else? ; No wonder. | Can I help you? ; Anything else? ; No wonder. ; thirty | shop (= Geschäft, Laden) ; help (= helfen) |

## Grammar items (63)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u10.gi.how-much.ag.001 | anagram | Das Wort fehlt: How ___ is the scooter? (wie viel?) [de, 1 blank(s)] | much (full) | — | — | — | — |
| g1u10.gi.how-much.ag.002 | anagram | Das Wort fehlt: How much is the computer ___? (das Computerspiel) [de, 1 blank(s)] | game (full) | — | — | — | — |
| g1u10.gi.how-much.cp.001 | context-picker | Du stehst im Geschäft und zeigst auf einen Roller. Frag, wie viel er kostet. [de] | How much is this scooter? (full) | How much are this scooter? ; How much is these scooter? ; How much costs this scooter? | — | — | — |
| g1u10.gi.how-much.cp.002 | context-picker | Du zeigst auf Kopfhörer im Regal. Frag, wie viel sie kosten. [de] | How much are these headphones? (full) | How much is these headphones? ; How much are this headphones? ; How much costs these headphones? | — | — | — |
| g1u10.gi.how-much.ec.001 | error-correction | How much is the headphones? [en] | How much are the headphones? (full) ; are (partial) | — | — | — | — |
| g1u10.gi.how-much.ec.002 | error-correction | How much costs it? [en] | How much is it? (full) ; is (partial) | — | — | — | — |
| g1u10.gi.how-much.ec.003 | error-correction | How much are this magazine? [en] | How much is this magazine? (full) ; is (partial) | — | — | — | — |
| g1u10.gi.how-much.gf.001 | gap-fill | How much ___ the scooter? [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u10.gi.how-much.gf.002 | gap-fill | How much ___ the headphones? [en, 1 blank(s)] | are (full) | — | — | — | — |
| g1u10.gi.how-much.gf.003 | gap-fill | How much ___ the key ring? [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u10.gi.how-much.gf.004 | gap-fill | How much ___ these sweets? [en, 1 blank(s)] | are (full) | — | — | — | — |
| g1u10.gi.how-much.gf.005 | gap-fill | How much ___ this computer game? [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u10.gi.how-much.gf.006 | gap-fill | How much ___ those jeans? [en, 1 blank(s)] | are (full) | — | — | — | — |
| g1u10.gi.how-much.gf.007 | gap-fill | How much ___ the magazine? [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u10.gi.how-much.gf.008 | gap-fill | ___ ___ is the mobile phone? [en, 2 blank(s)] | How \| much (full) | — | — | — | — |
| g1u10.gi.how-much.gf.009 | gap-fill | How ___ ___ the headphones? [en, 2 blank(s)] | much \| are (full) | — | — | — | — |
| g1u10.gi.how-much.gf.010 | gap-fill | How much ___ the tin? [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u10.gi.how-much.gf.011 | gap-fill | How much ___ those headphones over there? [en, 1 blank(s)] | are (full) | — | — | — | — |
| g1u10.gi.how-much.gs.001 | group-sort | Womit fragst du nach dem Preis – mit "is" oder mit "are"? [de] | — | — | — | How much is ...?: the scooter, this magazine, the key ring, the computer game \| How much are ...?: the headphones, these sweets, the jeans, those trainers | — |
| g1u10.gi.how-much.mc.001 | multiple-choice | How much ___ the mobile phone? [en, 1 blank(s)] | is (full) | are ; do ; does | — | — | — |
| g1u10.gi.how-much.mc.002 | multiple-choice | How much ___ the sweets? [en, 1 blank(s)] | are (full) | is ; does ; do | — | — | — |
| g1u10.gi.how-much.mc.005 | multiple-choice | How much ___ the jeans? [en, 1 blank(s)] | are (full) | is ; do ; does | — | — | — |
| g1u10.gi.how-much.mc.006 | multiple-choice | Welche Frage ist richtig? [de] | How much are the headphones? (full) | How much is the headphones? ; How much costs the headphones? ; How many are the headphones? | — | — | — |
| g1u10.gi.how-much.mc.007 | multiple-choice | Welche Frage ist richtig? [de] | How much is the scooter? (full) | How much are the scooter? ; How much costs the scooter? ; How much is the scooters? | — | — | — |
| g1u10.gi.how-much.mp.001 | matching-pairs | Welches kleine Wort passt zu welchem Ding? [de] | — | — | How much ___ the scooter? ↔ is ; How much ___ the jeans? ↔ are ; How much ___ this computer game? ↔ is, please ; How much ___ these headphones? ↔ are, please | — | — |
| g1u10.gi.how-much.mt.001 | matching | Welche Frage passt zu welcher Antwort? [de] | — | — | How much is the scooter? ↔ It's €80. ; How much are the headphones? ↔ They're €30. ; How much is the magazine? ↔ It's €3. ; How much are these sweets? ↔ They're €2. | — | — |
| g1u10.gi.how-much.qf.001 | question-formation | Du möchtest wissen, was der Roller kostet. Stell die Frage. [de] | How much is the scooter? (full) ; How much is this scooter? (full) ; How much is that scooter? (full) ; How much is it? (partial) | — | — | — | — |
| g1u10.gi.how-much.qf.002 | question-formation | Du möchtest wissen, was die Kopfhörer kosten. Stell die Frage. [de] | How much are the headphones? (full) ; How much are these headphones? (full) ; How much are those headphones? (full) ; How much are they? (partial) | — | — | — | — |
| g1u10.gi.how-much.sb.001 | sentence-building | How / much / is / the / scooter [en] | How much is the scooter? (full) | are | — | — | — |
| g1u10.gi.how-much.sb.002 | sentence-building | How / much / are / these / sweets [en] | How much are these sweets? (full) | is | — | — | — |
| g1u10.gi.how-much.tf.001 | transformation | How much is the key ring? (→ key rings) [en] | How much are the key rings? (full) ; are (partial) | — | — | — | — |
| g1u10.gi.how-much.tf.002 | transformation | How much are the magazines? (→ magazine) [en] | How much is the magazine? (full) ; is (partial) | — | — | — | — |
| g1u10.gi.this-that-these-those.ag.001 | anagram | Viele Dinge, ganz nah bei dir (hier). Wie heißt das Wort? (Buchstaben: e h e s t) [de] | these (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.ag.002 | anagram | Viele Dinge, weiter weg (over there). Wie heißt das Wort? (Buchstaben: o h e s t) [de] | those (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.cp.001 | context-picker | Du hältst einen Schlüsselanhänger in der Hand. Was sagst du? [de] | This key ring is nice. (full) | These key ring is nice. ; Those key ring is nice. ; These key rings is nice. | — | — | — |
| g1u10.gi.this-that-these-those.cp.002 | context-picker | Du zeigst auf Schuhe weit weg im Schaufenster (over there). Was sagst du? [de] | Those shoes over there are big. (full) | That shoes over there are big. ; This shoes over there are big. ; These shoes over there are big. | — | — | — |
| g1u10.gi.this-that-these-those.ec.001 | error-correction | This shoes here are nice. [en] | These shoes here are nice. (full) ; These (partial) | — | — | — | — |
| g1u10.gi.this-that-these-those.ec.002 | error-correction | That headphones over there are expensive. [en] | Those headphones over there are expensive. (full) ; Those (partial) | — | — | — | — |
| g1u10.gi.this-that-these-those.ec.003 | error-correction | These computer game here is nice. [en] | This computer game here is nice. (full) ; This (partial) | — | — | — | — |
| g1u10.gi.this-that-these-those.ec.004 | error-correction | Those magazine over there is nice. [en] | That magazine over there is nice. (full) ; That (partial) | — | — | — | — |
| g1u10.gi.this-that-these-those.gf.001 | gap-fill | ___ magazine here is nice. [en, 1 blank(s)] | This (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.gf.002 | gap-fill | ___ sweets here are nice. [en, 1 blank(s)] | These (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.gf.003 | gap-fill | Look at ___ scooter over there! [en, 1 blank(s)] | that (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.gf.004 | gap-fill | ___ headphones over there are expensive. [en, 1 blank(s)] | Those (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.gf.005 | gap-fill | Can I have ___ key ring here, please? [en, 1 blank(s)] | this (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.gf.006 | gap-fill | ___ trainers over there are big. [en, 1 blank(s)] | Those (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.gf.008 | gap-fill | I'd like ___ sweets here and ___ headphones over there. [en, 2 blank(s)] | these \| those (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.gf.009 | gap-fill | ___ magazine here is nice. ___ scooter over there is expensive. [en, 2 blank(s)] | This \| That (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.gs.002 | group-sort | Near you (here), or far away (over there)? [en] | — | — | — | near you (here): this magazine, these sweets, this key ring, these shoes \| far away (over there): that scooter, those headphones, that mobile phone, those trainers | — |
| g1u10.gi.this-that-these-those.gs.003 | group-sort | Eins oder viele? [de] | — | — | — | one: this magazine, that scooter, this key ring, that mobile phone \| many: these sweets, those headphones, these shoes, those trainers | — |
| g1u10.gi.this-that-these-those.mc.001 | multiple-choice | ___ shoes here are nice. [en, 1 blank(s)] | These (full) | This ; That ; Those | — | — | — |
| g1u10.gi.this-that-these-those.mc.002 | multiple-choice | How much is ___ mobile phone over there? [en, 1 blank(s)] | that (full) | this ; these ; those | — | — | — |
| g1u10.gi.this-that-these-those.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | These sweets here are nice. (full) | This sweets here are nice. ; That sweets here are nice. ; Those sweets here are nice. | — | — | — |
| g1u10.gi.this-that-these-those.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | Those headphones over there are expensive. (full) | That headphones over there are expensive. ; This headphones over there are expensive. ; These headphones over there are expensive. | — | — | — |
| g1u10.gi.this-that-these-those.mt.003 | matching | Verbinde jedes Ding mit dem passenden Wort. [de] | — | — | one magazine, here ↔ this magazine ; many sweets, here ↔ these sweets ; one scooter, over there ↔ that scooter ; many headphones, over there ↔ those headphones | — | — |
| g1u10.gi.this-that-these-those.mt.004 | matching | Verbinde jeden „here“-Satz mit dem gleichen Satz mit „over there“. [de] | — | — | This scooter is nice. ↔ That scooter over there is nice. ; These shoes are big. ↔ Those shoes over there are big. ; This magazine is nice. ↔ That magazine over there is nice. ; These sweets are nice. ↔ Those sweets over there are nice. | — | — |
| g1u10.gi.this-that-these-those.sb.001 | sentence-building | these / shoes / nice / are [en] | These shoes are nice. (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.sb.002 | sentence-building | those / over there / are / headphones / expensive [en] | Those headphones over there are expensive. (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.tf.001 | transformation | This scooter is nice. (over there) → ___ scooter over there is nice. [en, 1 blank(s)] | That (full) ; That scooter over there is nice. (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.tf.002 | transformation | This book is nice. (many) → ___ books are nice. [en, 1 blank(s)] | These (full) ; These books are nice. (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.tf.003 | transformation | That dog over there is big. (many) → ___ dogs over there are big. [en, 1 blank(s)] | Those (full) ; Those dogs over there are big. (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.tr.001 | translation | Sag auf Englisch: Diese Süßigkeiten hier sind toll. (toll = nice) [de] | These sweets here are nice. (full) ; These sweets are nice. (full) | — | — | — | — |
| g1u10.gi.this-that-these-those.tr.002 | translation | Sag auf Englisch: Jene Kopfhörer dort drüben sind teuer. [de] | Those headphones over there are expensive. (full) ; Those headphones are expensive. (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u10/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u10",
  "lens": "level-gloss",
  "itemsHash": "5c0bbc31ed04",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 107, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
