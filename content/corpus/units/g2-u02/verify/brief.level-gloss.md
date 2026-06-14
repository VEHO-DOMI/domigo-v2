# Verify lens — level-gloss — g2-u02 (round 2)

<!-- domigo:verify level-gloss g2-u02 items=0316b35dcf62 prompt=aefb997bf664 round=2 -->

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
- **g1-u11**: 9 a.m., midday, 9 p.m., midnight, 9 o'clock, (a) quarter past nine, half past nine, (a) quarter to ten, to ride a bike, to watch TV, to play football, to play computer games, to play the piano, to ride a horse, to skateboard, to cook, to ride a scooter, to ski, to snowboard, to skate, daily, free time, What's the time?, Excuse me., to hurry, clock, It's 10 a.m., It's 8 p.m., What time is it?, bedtime, break, exercise, to go to bed, to go to school, outside, to study, to wake somebody up, amazing, to answer the door, bush, Have fun!, to hide, knock, living room, surprise, to push, to cook, text message, to look after, road, place, programme, clue, See you soon., to snow, weather, half an hour, Hurry up.
- **g1-u12**: January, February, March, April, May, June, July, August, September, October, November, December, bedroom, library, living room, dining room, bathroom, hall, kitchen, garden, garage, 1st first, 2nd second, 3rd third, 4th fourth, 5th fifth, 6th sixth, 7th seventh, 8th eighth, 9th ninth, 10th tenth, 11th eleventh, 12th twelfth, 13th thirteenth, 14th fourteenth, 15th fifteenth, 16th sixteenth, 17th seventeenth, 18th eighteenth, 19th nineteenth, 20th twentieth, 21st twenty-first, 22nd twenty-second, 23rd twenty-third, 24th twenty-fourth, 25th twenty-fifth, 30th thirtieth, 31st thirty-first, birthday cake, eater, ill, messy, piece, cinema, excellent, finally, match, It's my birthday., date, month, How old are you?, candle, delicious, last, robber, robbery, yesterday, alarm clock, probably, Good for you!, inspector, How dare you!, That was close., You're welcome.
- **g1-u13**: storm, jetpack, helicopter, coastguard, fire brigade, ambulance, police, mountain rescue, to shout for help, to be lucky, to break, country, crime, fire, accident, to be in danger, to fly up the mountain, to radio, rescue team, rock, to shout for help, to slip, storm, wet, to arrive, to be safe, to dream, to fall down, to land, medicine, sky, windy, dark, young, alone, backpack, to happen, to chase, sunny, class speaker, democracy, mayor, political, to vote, button, cloud, Earth, to die, forest, introduction, space, to notice, to press, screen, adventure, character, Guess what?, Tell me more.
- **g1-u14**: nature programme, fantasy film, reality show, fantasy story, quiz show, science fiction film, the news, detective story, romantic film, sports programme, horror story, drama series, adventure story, music video, romantic story, cartoon, screen time, headline, latest, comedy, episode, gamer, kind of, quite, to stream, weekend, to freeze (froze), huge, inside, to pay (paid), to point to, power, remote control, to reply (replied), to sell (sold), tiny, voice, wide, to fight (fought), shopkeeper, to disappear, to hold (held), to spend, to bend down (bent down), to hug, lake, leaf (pl leaves), to lie, skin, spot, weak, dead, once upon a time, one day, adventure, cover, friendship, poem, neighbour
- **g1-u15**: to fly to, to go fishing, to stay at a campsite, to swim in the sea, to play badminton, to lie in the sun, to write a postcard, to play board games, to visit a castle, aunt, beach, board game, campsite, cook, to drive, holiday, national park, parents, plane, summer, hippo, to join, to invite
- **g2-u01**: English, French, music, maths, geography, science, physical education (PE), art, history, information technology (IT), design and technology, glad, kilometre, to stay at home, to travel, as soon as, to get dressed, to go for a walk, lesson, to prepare, to put on, supper, daily, calendar, grandmother, joke, scary, spring, area, to book, popular, shadow, to visit, colourful, along, to crawl, to take a rest, (school) subject, break, timetable, bicycle lane, king, noisy, queen, rubbish, online safety, opinion, webpage
- **g2-u02**: to organise, surprise party, admission fee, artist, exhibition, dirty, modern, museum, to be part of, sculpture, to be worth, What's the matter?, anyone, behaviour, to contact, mess, to pass on, password, to post, posting, such, tip, possible, awesome, boring, confusing, difficult, exciting, funny, embarrassed, plate, secret, upset, to add, to fail, I promise.

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Carla, Castle, Chester, Chichen, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Disneyland, Doctor, Doctors, Don, Dragon, Elisabeth, Ellie, Emergency, Emma, Encouraging, England, English, European, Every, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Grey, Greybeard, Groans, Guess, Hammond, Harris, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Leah, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Mayan, Mei, Mexico, Michael, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Nibbs, Nice, Nick, Nomen, North, Number, Numbers, Object, Objekte, Oliver, Olivia, Omar, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rose, Rosie, Sally, Sam, Samuel, Sandra, Sara, Saying, School, Scotland, Sean, Sherlock, Sicily, Smith, Sophia, Sophie, States, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, True, Turan, Uhr, Um, United, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (36)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u02.w.admission-fee | The money you pay to go into a place. | The ___ to the museum is five pounds for adults. | museum ; sculpture ; exhibition | museum ; sculpture ; exhibition ; artist ; secret | — |
| g2u02.w.anyone | Any man, woman, or child at all. | Don't tell your password to ___. | password ; secret ; behaviour | password ; secret ; behaviour ; mess ; tip | — |
| g2u02.w.artist | Somebody who makes beautiful pictures or music. | He made this beautiful painting. He's a great ___. | museum ; exhibition ; sculpture | museum ; exhibition ; sculpture ; secret ; tip | — |
| g2u02.w.awesome | Really great and amazing. | The new computer game is ___! I really like it. | boring ; confusing ; difficult | boring ; confusing ; difficult ; dirty ; modern | — |
| g2u02.w.behaviour | How good or bad somebody is to people. | There is a lot of bad ___ on the web. | secret ; password ; mess | secret ; password ; mess ; tip ; plate | web (= Internet) |
| g2u02.w.boring | Not fun at all. It makes you tired and you want to do something else. | This show is very ___. I don't want to watch it any more. | exciting ; awesome ; funny | exciting ; awesome ; funny ; confusing ; modern | something (= etwas) ; else (= anderes) |
| g2u02.w.confusing | Hard to understand, so you do not know what is what. | I don't understand this exercise. It's very ___. | exciting ; funny ; awesome | exciting ; funny ; awesome ; boring ; modern | hard (= schwer) |
| g2u02.w.difficult | Not easy to do or to understand. | This homework is very ___. I can't do it. | modern ; dirty ; possible | modern ; dirty ; possible ; boring ; such | easy (= leicht) |
| g2u02.w.dirty | Not clean at all. | My shoes are very ___ because I played in the garden. | modern ; possible ; funny | modern ; possible ; funny ; boring ; exciting | — |
| g2u02.w.embarrassed | When you are not happy because you did a funny thing and people looked at you. | I was so ___ when I made a big mess in front of the class. | upset ; boring ; dirty | upset ; boring ; dirty ; confusing ; modern | — |
| g2u02.w.exciting | Making you very happy, so you can't wait for it. | Going to the zoo for the first time was really ___! | boring ; confusing ; dirty | boring ; confusing ; dirty ; difficult ; modern | — |
| g2u02.w.exhibition | A place where people show their art for you to look at. | There is a new art ___ at the museum. | museum ; artist ; sculpture | museum ; artist ; sculpture ; admission fee ; plate | — |
| g2u02.w.funny | Making you want to laugh. | The clown was very ___. We all laughed. | boring ; confusing ; dirty | boring ; confusing ; dirty ; difficult ; modern | — |
| g2u02.w.i-promise | You tell somebody this so they know you are going to do a thing for them. | I'll help you with your homework tomorrow. ___ | What's the matter? ; secret ; tip | What's the matter? ; secret ; tip ; mess ; behaviour | I'll (= ich werde) |
| g2u02.w.mess | When a room is not clean and nothing is where it should be. | My room is a big ___. I need to clean it. | secret ; tip ; password | secret ; tip ; password ; plate ; behaviour | should (= sollten) |
| g2u02.w.modern | New and from the time we live in now. | Their new school is very ___, with big windows and a garden. | dirty ; funny ; boring | dirty ; funny ; boring ; difficult ; awesome | — |
| g2u02.w.museum | A big building where you go to look at art and beautiful pictures. | We can look at art and beautiful pictures at the ___. | exhibition ; artist ; sculpture | exhibition ; artist ; sculpture ; admission fee ; plate | — |
| g2u02.w.password | A secret that you need so people cannot go into your account. | Never tell your ___ to anyone. | secret ; behaviour ; mess | secret ; behaviour ; mess ; tip ; posting | account (= Konto) |
| g2u02.w.plate | A thing that you put your food on when you eat. | Put the pasta on the ___ and eat it. | secret ; mess ; tip | secret ; mess ; tip ; password ; behaviour | — |
| g2u02.w.possible | A thing that can happen or that you can do. | I can't do all this homework. It's not ___. | difficult ; modern ; dirty | difficult ; modern ; dirty ; boring ; such | — |
| g2u02.w.posting | A picture or a story that you put on the web for people to look at. | Many people can look at your ___, so be careful what you put online. | password ; secret ; tip | password ; secret ; tip ; mess ; behaviour | web (= Internet) ; online (= im Internet) |
| g2u02.w.sculpture | Art that an artist makes from stone for people to look at. | There is a big stone ___ of a horse in the park. | museum ; exhibition ; artist | museum ; exhibition ; artist ; admission fee ; plate | — |
| g2u02.w.secret | A thing that you do not tell other people. | Don't tell anyone. It's a ___. | mess ; tip ; password | mess ; tip ; password ; behaviour ; plate | other (= andere) |
| g2u02.w.such | You put this before 'a' to make 'a good day' into 'a very good day'. | It was ___ a good day. We were all very happy. | possible ; difficult ; modern | possible ; difficult ; modern ; dirty ; boring | — |
| g2u02.w.surprise-party | A big fun day that friends make for you when you do not know about it before. | My friends made a ___ for me, and I did not know about it. | exhibition ; admission fee ; sculpture | exhibition ; admission fee ; sculpture ; museum ; tip | — |
| g2u02.w.tip | A good thing somebody shows you to help you do well. | Here is a good ___ to help you do well at school. | secret ; mess ; password | secret ; mess ; password ; behaviour ; plate | — |
| g2u02.w.to-add | To put more to a thing that you have. | You can ___ more sugar to your tea. | to contact ; to organise ; to pass on | to contact ; to organise ; to pass on ; to post ; to be worth | — |
| g2u02.w.to-be-part-of | To be inside a bigger thing and not alone. | The jacket was ___ a big sculpture. | to be worth ; to add ; to contact | to be worth ; to add ; to contact ; to organise ; to pass on | — |
| g2u02.w.to-be-worth | To have a price, like a lot of money. | This painting is ___ a lot of money. | to be part of ; to add ; to post | to be part of ; to add ; to post ; to contact ; to organise | — |
| g2u02.w.to-contact | To call or write to somebody. | Please ___ me if you need help. | to pass on ; to add ; to organise | to pass on ; to add ; to organise ; to post ; to be worth | — |
| g2u02.w.to-fail | To not do well at school. | I studied very much because I didn't want to ___ at school. | to add ; to contact ; to organise | to add ; to contact ; to organise ; to pass on ; to post | — |
| g2u02.w.to-organise | To make a fun day happen and do all the work for it. | We want to ___ a surprise party for our teacher. | to add ; to contact ; to post | to add ; to contact ; to post ; to pass on ; to fail | — |
| g2u02.w.to-pass-on | To give a thing or a letter to a friend. | Can you ___ this letter to your mum for me? | to contact ; to add ; to organise | to contact ; to add ; to organise ; to post ; to fail | — |
| g2u02.w.to-post | To put a picture or a story on the web for people to look at. | Think before you ___ a picture for everybody to look at. | to add ; to contact ; to organise | to add ; to contact ; to organise ; to pass on ; to be worth | web (= Internet) |
| g2u02.w.upset | When you are sad and angry because a bad thing happened. | The little girl was ___ because she had a bad day. | embarrassed ; funny ; modern | embarrassed ; funny ; modern ; boring ; dirty | little (= klein) |
| g2u02.w.what-s-the-matter | You ask this when somebody looks sad or upset. | You look sad. ___ You look upset. | I promise. ; secret ; behaviour | I promise. ; secret ; behaviour ; mess ; tip | — |

## Grammar items (60)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u02.gi.irregular-verbs.ag.001 | anagram | buy (gestern) [de] | bought (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.ag.002 | anagram | know (gestern) [de] | knew (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.cp.001 | context-picker | Last week your class made a big poster. You tell a friend. [en] | We made a big poster for the project. (full) | We make a big poster for the project. ; We makes a big poster for the project. ; We bought a big poster for the project. | — | — | — |
| g2u02.gi.irregular-verbs.ec.001 | error-correction | She buy new trainers for PE last week. [en] | She bought new trainers for PE last week. (full) ; She bought new trainers for PE last week (full) ; bought (partial) | — | — | — | — |
| g2u02.gi.irregular-verbs.ec.002 | error-correction | I didn't knew the password. [en] | I didn't know the password. (full) ; I didn't know the password (full) ; know (partial) | — | — | — | — |
| g2u02.gi.irregular-verbs.ec.003 | error-correction | Tom writed a really funny story in English class. [en] | Tom wrote a really funny story in English class. (full) ; Tom wrote a really funny story in English class (full) ; wrote (partial) | — | — | — | — |
| g2u02.gi.irregular-verbs.gf.001 | gap-fill | We ___ (buy) a big box of chocolates for Mr Harris. [en, 1 blank(s)] | bought (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.gf.002 | gap-fill | Alan ___ (write) to all his friends in the class. [en, 1 blank(s)] | wrote (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.gf.003 | gap-fill | He ___ (know) it was a secret. [en, 1 blank(s)] | knew (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.gf.004 | gap-fill | Mrs Wu and Mei ___ (make) a big cake on Sunday. [en, 1 blank(s)] | made (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.gf.005 | gap-fill | My friends ___ (buy) sweets and we ___ (make) a cake. [en, 2 blank(s)] | bought \| made (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.gf.006 | gap-fill | He didn't ___ (know) where the museum was. [en, 1 blank(s)] | know (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.gf.007 | gap-fill | We didn't ___ (buy) anything at the exhibition. [en, 1 blank(s)] | buy (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.gs.001 | group-sort | play → played [en] | — | — | — | clean → cleaned: visit, open, cook, want \| buy → bought: make, write, know, buy | — |
| g2u02.gi.irregular-verbs.mc.001 | multiple-choice | Yesterday my mum ___ a new jacket. [en, 1 blank(s)] | bought (full) | buy ; knew ; wrote | — | — | — |
| g2u02.gi.irregular-verbs.mc.002 | multiple-choice | She ___ a long letter to her grandmother last week. [en, 1 blank(s)] | wrote (full) | write ; writes ; made | — | — | — |
| g2u02.gi.irregular-verbs.mc.003 | multiple-choice | Mrs Wu ___ a big cake for the children yesterday. [en, 1 blank(s)] | made (full) | make ; makes ; wrote | — | — | — |
| g2u02.gi.irregular-verbs.mc.004 | multiple-choice | I didn't ___ any chocolates for him. [en, 1 blank(s)] | buy (full) | bought ; made ; wrote | — | — | — |
| g2u02.gi.irregular-verbs.mt.001 | matching | buy, know, make, write [en] | — | — | buy ↔ bought ; know ↔ knew ; make ↔ made ; write ↔ wrote | — | — |
| g2u02.gi.irregular-verbs.sb.001 | sentence-building | wrote / she / a / long / letter / yesterday [en] | She wrote a long letter yesterday. (full) ; She wrote a long letter yesterday (full) ; Yesterday she wrote a long letter. (full) ; Yesterday she wrote a long letter (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.tf.001 | transformation | I buy a present for the teacher. (yesterday) [en] | I bought a present for the teacher yesterday. (full) ; I bought a present for the teacher yesterday (full) ; Yesterday I bought a present for the teacher. (full) ; Yesterday I bought a present for the teacher (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.tf.002 | transformation | Alan writes to his friends. (last night) [en] | Alan wrote to his friends last night. (full) ; Alan wrote to his friends last night (full) ; Last night Alan wrote to his friends. (full) ; Last night Alan wrote to his friends (full) | — | — | — | — |
| g2u02.gi.irregular-verbs.tr.001 | translation | Ich habe gestern ein Buch gekauft. [de] | I bought a book yesterday. (full) ; I bought a book yesterday (full) ; Yesterday I bought a book. (full) ; Yesterday I bought a book (full) ; I bought a new book yesterday. (partial) ; I bought a new book yesterday (partial) | — | — | — | — |
| g2u02.gi.irregular-verbs.tr.002 | translation | Er hat keinen Kuchen gemacht. [de] | He didn't make a cake. (full) ; He didn't make a cake (full) ; He did not make a cake. (full) ; He did not make a cake (full) | — | — | — | — |
| g2u02.gi.past-simple-negation.ec.001 | error-correction | I didn't listened to a thing. [en] | I didn't listen to a thing. (full) ; I didn't listen to a thing (full) ; listen (partial) | — | — | — | — |
| g2u02.gi.past-simple-negation.ec.002 | error-correction | The jacket didn't was on the screen. [en] | The jacket wasn't on the screen. (full) ; The jacket wasn't on the screen (full) ; wasn't (partial) | — | — | — | — |
| g2u02.gi.past-simple-negation.gf.001 | gap-fill | I ___ listen to the lesson. I was bored. [en, 1 blank(s)] | didn't (full) | — | — | — | — |
| g2u02.gi.past-simple-negation.gf.002 | gap-fill | The sculpture ___ dirty. [en, 1 blank(s)] | wasn't (full) | — | — | — | — |
| g2u02.gi.past-simple-negation.gs.001 | group-sort | didn't or wasn't / weren't? [en] | — | — | — | didn't: I ___ buy a present., We ___ make a cake., She ___ read the story. \| wasn't / weren't: The museum ___ open., The children ___ happy. | — |
| g2u02.gi.past-simple-negation.mc.001 | multiple-choice | We ___ make a cake — we had no time. [en, 1 blank(s)] | didn't (full) | wasn't ; weren't ; don't | — | — | — |
| g2u02.gi.past-simple-negation.tf.001 | transformation | Paul cleaned his room today. (not) [en] | Paul didn't clean his room today. (full) ; Paul didn't clean his room today (full) ; Paul did not clean his room today. (full) ; Paul did not clean his room today (full) | — | — | — | — |
| g2u02.gi.past-simple-negation.tr.001 | translation | Sie hat den Brief nicht gelesen. [de] | She didn't read the letter. (full) ; She didn't read the letter (full) ; She did not read the letter. (full) ; She did not read the letter (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.cp.001 | context-picker | Your friend talks about Saturday. You ask about Tom. [en] | Did Tom play football on Saturday? (full) | Did Tom played football on Saturday? ; Was Tom play football on Saturday? ; Tom did play football on Saturday? | — | — | — |
| g2u02.gi.past-simple-questions.ec.001 | error-correction | Did you bought a present last Friday? [en] | Did you buy a present last Friday? (full) ; Did you buy a present last Friday (full) ; buy (partial) | — | — | — | — |
| g2u02.gi.past-simple-questions.ec.002 | error-correction | Did he was tired after the match? [en] | Was he tired after the match? (full) ; Was he tired after the match (full) ; Was he (partial) | — | — | — | — |
| g2u02.gi.past-simple-questions.ec.003 | error-correction | You liked the new teacher? [en] | Did you like the new teacher? (full) ; Did you like the new teacher (full) ; Did you like (partial) | — | — | — | — |
| g2u02.gi.past-simple-questions.ff.001 | free-form | You want to ask a friend about yesterday. [en] | Did you have a good day yesterday? (full) ; Did you watch TV yesterday? (full) ; Did you do your homework yesterday? (partial) | — | — | — | — |
| g2u02.gi.past-simple-questions.gf.001 | gap-fill | ___ you enjoy the school project? — Yes, I did. [en, 1 blank(s)] | Did (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.gf.002 | gap-fill | ___ Chloe embarrassed at the table? [en, 1 blank(s)] | Was (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.gf.003 | gap-fill | Did Mei ___ (eat) the cake last night? [en, 1 blank(s)] | eat (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.gf.004 | gap-fill | ___ the children happy at the museum? [en, 1 blank(s)] | Were (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.gf.005 | gap-fill | Where ___ you on Sunday? — I was at my grandmother's. [en, 1 blank(s)] | were (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.mc.001 | multiple-choice | About yesterday: [en] | Did she visit her friend yesterday? (full) | Did she visited her friend yesterday? ; Was she visit her friend yesterday? ; She did visit her friend yesterday? | — | — | — |
| g2u02.gi.past-simple-questions.mc.002 | multiple-choice | You ask about the story. [en] | Was the story good? (full) | Did the story was good? ; Did the story good? ; Were the story good? | — | — | — |
| g2u02.gi.past-simple-questions.mc.003 | multiple-choice | Were you and Emma at the park? — No, ___. [en, 1 blank(s)] | we weren't (full) | we didn't ; we wasn't ; we aren't | — | — | — |
| g2u02.gi.past-simple-questions.mt.001 | matching | About the weekend [en] | — | — | Did you play in the garden? ↔ Yes, I did. ; Did Chloe eat her cake? ↔ No, she didn't. ; Was Jacob upset? ↔ Yes, he was. ; Were the children happy? ↔ No, they weren't. | — | — |
| g2u02.gi.past-simple-questions.qf.001 | question-formation | you / have / a good day / at school [en] | Did you have a good day at school? (full) ; Did you have a good day at school (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.qf.002 | question-formation | where / you / go / on Saturday [en] | Where did you go on Saturday? (full) ; Where did you go on Saturday (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.sb.001 | sentence-building | what / did / you / have / for lunch / ? [en] | What did you have for lunch? (full) ; What did you have for lunch (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.tf.001 | transformation | You visited the exhibition. (?) [en] | Did you visit the exhibition? (full) ; Did you visit the exhibition (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.tf.002 | transformation | The museum was open. (?) [en] | Was the museum open? (full) ; Was the museum open (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.tr.001 | translation | Hast du die Geschichte gelesen? [de] | Did you read the story? (full) ; Did you read the story (full) | — | — | — | — |
| g2u02.gi.past-simple-questions.tr.002 | translation | War Tom gestern krank? [de] | Was Tom ill yesterday? (full) ; Was Tom ill yesterday (full) | — | — | — | — |
| g2u02.gi.why-because.ec.001 | error-correction | Because art great is. [en] | Because art is great. (full) ; Because art is great (full) ; art is great (partial) | — | — | — | — |
| g2u02.gi.why-because.gf.001 | gap-fill | ___ are you upset? — Because the museum was closed. [en, 1 blank(s)] | Why (full) | — | — | — | — |
| g2u02.gi.why-because.gf.002 | gap-fill | Why do you like art? — ___ it is great. [en, 1 blank(s)] | Because (full) | — | — | — | — |
| g2u02.gi.why-because.mc.001 | multiple-choice | ___ is the garden a mess? — Because there were lots of people there. [en, 1 blank(s)] | Why (full) | Because ; What ; Where | — | — | — |
| g2u02.gi.why-because.mt.001 | matching | Why and because [en] | — | — | Why are you upset? ↔ Because the museum was closed. ; Why was Jacob happy? ↔ Because a neighbour called the police. ; Why is the garden a mess? ↔ Because there were lots of people there. ; Why do you like art? ↔ Because it is great. | — | — |
| g2u02.gi.why-because.sb.001 | sentence-building | because / I / this one / don't / like [en] | Because I don't like this one. (full) ; Because I don't like this one (full) | — | — | — | — |
| g2u02.gi.why-because.tr.001 | translation | Warum bist du so glücklich? — Weil ich einen Hund habe. [de] | Why are you so happy? — Because I have a dog. (full) ; Why are you so happy? Because I have a dog. (full) ; Why are you so happy? — Because I have got a dog. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u02/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u02",
  "lens": "level-gloss",
  "itemsHash": "0316b35dcf62",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 96, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
