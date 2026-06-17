# Verify lens — level-gloss — g1-u15 (round 2)

<!-- domigo:verify level-gloss g1-u15 items=5a2e302029f4 prompt=aefb997bf664 round=2 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Darkman, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Doctor, Doctors, Don, Dragon, Elisabeth, Ellie, Emergency, Emma, Encouraging, England, English, European, Every, False, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Hammond, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Irish, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Janet, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Kate, Ken, Kinds, Kitty, Lane, Leah, Leo, Lethabo, Leute, Lewis, Li, Liam, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Michael, Mike, Mill, Miriam, Miss, Mr, Mrs, Mum, Nathan, New, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rose, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Sophie, States, Steve, Sue, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, True, Turan, Uhr, Um, United, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (23)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u15.w.aunt | the sister of your mum or dad. | My ___ Jane is my mum's sister and she lives in New York. | cook ; parents ; hippo | cook ; parents ; hippo ; campsite | — |
| g1u15.w.beach | the place next to the sea where you can play and swim. | Let's go to the ___ and swim in the sea. | campsite ; national park ; plane | campsite ; national park ; plane ; summer | — |
| g1u15.w.board-game | something like Monopoly that you sit and do at the table with small pieces. | In the evening, we're going to play a ___ like Monopoly. | plane ; beach ; campsite | plane ; beach ; campsite ; national park | Monopoly (= ein Brettspiel) ; Monopoly (= ein Brettspiel) ; something (= etwas) ; sit (= sitzen) |
| g1u15.w.campsite | a place where people sleep in tents. | We're going to stay at a ___ and sleep in a tent. | beach ; national park ; plane | beach ; national park ; plane ; board game | tents (= Zelte) ; tent (= Zelt) ; sleep (= schlafen) |
| g1u15.w.cook | somebody who can make good food in the kitchen. | My grandma is a very good ___ . I love her food. | aunt ; parents ; hippo | aunt ; parents ; hippo ; campsite | — |
| g1u15.w.hippo | a very big grey animal that lives in the river. | At the zoo there is a big grey ___ in the water. | cook ; aunt ; parents | cook ; aunt ; parents ; campsite | animal (= Tier) ; water (= Wasser) |
| g1u15.w.holiday | a time when you do not go to school and you can have a lot of fun. | Where are you going for your summer ___ this year? | summer ; beach ; national park | summer ; beach ; national park ; campsite | — |
| g1u15.w.national-park | a very big place in nature where wild animals can live free. | In the United States we are going to visit a ___ . | beach ; campsite ; plane | beach ; campsite ; plane ; board game | wild (= wild) ; animals (= Tiere) ; nature (= Natur) |
| g1u15.w.parents | your mum and your dad. | My ___ and I are going to fly to the United States. | aunt ; cook ; hippo | aunt ; cook ; hippo ; campsite | — |
| g1u15.w.plane | you sit in it and it flies up in the sky to a far country. | I'm not scared of flying. I can sleep on the ___ . | beach ; campsite ; national park | beach ; campsite ; national park ; board game | far (= weit) ; flies (= fliegt) ; sit (= sitzen) ; sleep (= schlafen) |
| g1u15.w.summer | the hot time of the year with the long school holiday. | In the ___ , I'm going to swim every day. | holiday ; beach ; plane | holiday ; beach ; plane ; campsite | — |
| g1u15.w.to-drive | to take people to a place in a car. | My dad is going to ___ us to the lake in our car. | to fly to ; to join ; to invite | to fly to ; to join ; to invite ; to go fishing | take (= bringen) |
| g1u15.w.to-fly-to | to go to a far country, up in the sky. | This summer we are going to ___ Croatia and stay there for two weeks. | to drive ; to swim in the sea ; to go fishing | to drive ; to swim in the sea ; to go fishing ; to visit a castle | far (= weit) |
| g1u15.w.to-go-fishing | You sit near the water and try to catch your dinner. | On Saturday I'm going to ___ at the lake with my uncle. | to swim in the sea ; to play badminton ; to fly to | to swim in the sea ; to play badminton ; to fly to ; to lie in the sun | sit (= sitzen) ; water (= Wasser) ; try (= versuchen) |
| g1u15.w.to-invite | to ask a friend to come and do something nice with you. | Who are you going to ___ to your birthday party? | to join ; to drive ; to visit a castle | to join ; to drive ; to visit a castle ; to fly to | party (= Party) ; something (= etwas) |
| g1u15.w.to-join | to go into a group and do something nice with them. | Let's ___ the music group at school. | to invite ; to drive ; to fly to | to invite ; to drive ; to fly to ; to go fishing | music (= Musik) ; something (= etwas) |
| g1u15.w.to-lie-in-the-sun | to be outside when it is hot and sunny, and do nothing. | What are you going to do? I'm going to ___ in the garden. | to go fishing ; to play badminton ; to write a postcard | to go fishing ; to play badminton ; to write a postcard ; to visit a castle | — |
| g1u15.w.to-play-badminton | a game over a tall net, with a small, light ball. | In Croatia my friends and I are going to ___ in the garden. | to play board games ; to go fishing ; to swim in the sea | to play board games ; to go fishing ; to swim in the sea ; to lie in the sun | net (= Netz) ; ball (= Ball) ; game (= Spiel) |
| g1u15.w.to-play-board-games | to sit at the table and have fun with something like Monopoly. | In the evening, we are going to ___ like Monopoly. | to play badminton ; to swim in the sea ; to go fishing | to play badminton ; to swim in the sea ; to go fishing ; to write a postcard | Monopoly (= ein Brettspiel) ; Monopoly (= ein Brettspiel) ; sit (= sitzen) ; something (= etwas) |
| g1u15.w.to-stay-at-a-campsite | to sleep at a place where you put up a tent. | We are going to ___ near the lake and sleep in our tent. | to fly to ; to visit a castle ; to go fishing | to fly to ; to visit a castle ; to go fishing ; to swim in the sea | tent (= Zelt) ; sleep (= schlafen) |
| g1u15.w.to-swim-in-the-sea | to play in the big water at the beach when it is hot. | When we are hot, we are going to ___ at the beach. | to go fishing ; to lie in the sun ; to play board games | to go fishing ; to lie in the sun ; to play board games ; to fly to | water (= Wasser) |
| g1u15.w.to-visit-a-castle | to go and see a very big, old building with tall stone walls. | On holiday we are going to ___ in the mountains. | to go fishing ; to play badminton ; to swim in the sea | to go fishing ; to play badminton ; to swim in the sea ; to fly to | mountains (= Berge) ; old (= alt) ; see (= sehen) ; walls (= Mauern) |
| g1u15.w.to-write-a-postcard | a short holiday message on a card with a picture, for your friends. | On holiday I'm going to ___ to all my friends. | to play board games ; to lie in the sun ; to go fishing | to play board games ; to lie in the sun ; to go fishing ; to swim in the sea | card (= Karte) ; message (= Nachricht) |

## Grammar items (35)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u15.gi.going-to.cp.001 | context-picker | Du erzählst von deinen Ferien. Welcher Satz ist richtig? [de] | I am going to lie in the sun. (full) | I going to lie in the sun. ; I am going to lying in the sun. ; I am go to lie in the sun. | — | — | — |
| g1u15.gi.going-to.cp.002 | context-picker | Deine Familie plant den Sommer. Welcher Satz ist richtig? [de] | We are going to stay at a campsite. (full) | We going to stay at a campsite. ; We are going to staying at a campsite. ; We are going stay at a campsite. | — | — | — |
| g1u15.gi.going-to.cp.003 | context-picker | Dein Freund fragt nach deinem Sommer. Welcher Satz ist richtig? [de] | I am going to play badminton. (full) | I am going to playing badminton. ; I going to play badminton. ; I am going to played badminton. | — | — | — |
| g1u15.gi.going-to.ec.003 | error-correction | Do you going to fly to the United States? [en] | Are you going to fly to the United States? (full) ; are (partial) | — | — | — | — |
| g1u15.gi.going-to.ec.006 | error-correction | I going to play football on the beach. [en] | I am going to play football on the beach. (full) ; I'm going to play football on the beach. (partial) ; am (partial) | — | — | — | — |
| g1u15.gi.going-to.ec.007 | error-correction | She is going to swimming in the sea. [en] | She is going to swim in the sea. (full) ; She's going to swim in the sea. (partial) ; swim (partial) | — | — | — | — |
| g1u15.gi.going-to.ec.008 | error-correction | They are going to visited a national park. [en] | They are going to visit a national park. (full) ; They're going to visit a national park. (partial) ; visit (partial) | — | — | — | — |
| g1u15.gi.going-to.ec.009 | error-correction | She are going to drive to the campsite. [en] | She is going to drive to the campsite. (full) ; She's going to drive to the campsite. (partial) ; is (partial) | — | — | — | — |
| g1u15.gi.going-to.gf.008 | gap-fill | ___ you ___ (be going to / lie) in the sun? [de, 2 blank(s)] | Are \| going to lie (full) | — | — | — | — |
| g1u15.gi.going-to.gf.009 | gap-fill | What ___ you ___ (be going to / do) in your holidays? [de, 2 blank(s)] | are \| going to do (full) | — | — | — | — |
| g1u15.gi.going-to.gf.010 | gap-fill | ___ they going to visit a castle? [de, 1 blank(s)] | Are (full) | — | — | — | — |
| g1u15.gi.going-to.gf.011 | gap-fill | Bilal ___ (be going to / fly) to Tunisia. [de, 1 blank(s)] | is going to fly (full) ; 's going to fly (partial) | — | — | — | — |
| g1u15.gi.going-to.gf.012 | gap-fill | We ___ (be going to / play) football on the beach. [de, 1 blank(s)] | are going to play (full) ; 're going to play (partial) | — | — | — | — |
| g1u15.gi.going-to.gf.013 | gap-fill | I ___ (be going to / write) postcards to my friends. [de, 1 blank(s)] | am going to write (full) ; 'm going to write (partial) | — | — | — | — |
| g1u15.gi.going-to.gf.014 | gap-fill | She ___ (be going to / show) us the city. [de, 1 blank(s)] | is going to show (full) ; 's going to show (partial) | — | — | — | — |
| g1u15.gi.going-to.gf.015 | gap-fill | They ___ (be going to / work) all summer. [de, 1 blank(s)] | are going to work (full) ; 're going to work (partial) | — | — | — | — |
| g1u15.gi.going-to.gf.016 | gap-fill | We ___ (not / be going to / stay) at home. [de, 1 blank(s)] | aren't going to stay (full) ; are not going to stay (full) ; 're not going to stay (partial) | — | — | — | — |
| g1u15.gi.going-to.gf.017 | gap-fill | He ___ (not / be going to / join) the band. [de, 1 blank(s)] | isn't going to join (full) ; is not going to join (full) ; 's not going to join (partial) | — | — | — | — |
| g1u15.gi.going-to.gs.001 | group-sort | Sortiere: richtig oder falsch geschrieben? [de] | — | — | — | ✓: I am going to swim., She is going to fly., We are going to play. \| ✗: I going to swim., She is going to flying., We are going to played. | — |
| g1u15.gi.going-to.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | They are going to visit a castle. (full) | They going to visit a castle. ; They are going to visiting a castle. ; They are going to visited a castle. | — | — | — |
| g1u15.gi.going-to.mc.002 | multiple-choice | Welche Frage ist richtig? [de] | Is she going to visit a national park? (full) | Does she going to visit a national park? ; She is going to visit a national park? ; Is she going to visiting a national park? | — | — | — |
| g1u15.gi.going-to.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | He is going to go fishing. (full) | He going to go fishing. ; He are going to go fishing. ; He is going to going fishing. | — | — | — |
| g1u15.gi.going-to.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | We are going to swim in the sea. (full) | We are going to swimming in the sea. ; We going to swim in the sea. ; We are going to swam in the sea. | — | — | — |
| g1u15.gi.going-to.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | I am not going to stay at home. (full) | I not going to stay at home. ; I am not going to staying at home. ; I am not going to stayed at home. | — | — | — |
| g1u15.gi.going-to.mp.001 | matching-pairs | Welche Kurzantwort passt zur Frage? [de] | — | — | Are you going to swim? ↔ Yes, I am. ; Is she going to drive? ↔ No, she isn't. ; Are they going to fish? ↔ Yes, they are. ; Is he going to cook? ↔ No, he isn't. | — | — |
| g1u15.gi.going-to.mt.001 | matching | Welche be-Form passt zu welchem Subjekt? [de] | — | — | I ↔ am going to ; she ↔ is going to ; they ↔ are going to | — | — |
| g1u15.gi.going-to.qf.001 | question-formation | She is going to visit a castle. → Stell eine Ja/Nein-Frage. [de] | Is she going to visit a castle? (full) | — | — | — | — |
| g1u15.gi.going-to.qf.002 | question-formation | They are going to play badminton. → Frag nach WAS (what). [de] | What are they going to play? (full) | — | — | — | — |
| g1u15.gi.going-to.sb.002 | sentence-building | you / going / to / are / a / visit / castle / ? [en] | Are you going to visit a castle? (full) | — | — | — | — |
| g1u15.gi.going-to.sb.003 | sentence-building | she / going / to / is / a / postcard / write [en] | She is going to write a postcard. (full) ; She's going to write a postcard. (partial) | — | — | — | — |
| g1u15.gi.going-to.tf.002 | transformation | Mach eine Frage daraus: He is going to fly to California. → ___ he ___ to California? [de, 2 blank(s)] | Is \| going to fly (full) | — | — | — | — |
| g1u15.gi.going-to.tf.006 | transformation | Mach den Satz mit not: They are going to stay at home. → They ___ at home. [de, 1 blank(s)] | aren't going to stay (full) ; are not going to stay (full) ; 're not going to stay (partial) ; They aren't going to stay at home. (full) ; They are not going to stay at home. (full) | — | — | — | — |
| g1u15.gi.going-to.tf.007 | transformation | Mach den Satz mit not: I am going to cook dinner. → I ___ dinner. [de, 1 blank(s)] | am not going to cook (full) ; 'm not going to cook (partial) ; I am not going to cook dinner. (full) ; I'm not going to cook dinner. (partial) | — | — | — | — |
| g1u15.gi.going-to.tr.002 | translation | Wirst du in der Sonne liegen? – Ja. [de] | Are you going to lie in the sun? Yes, I am. (full) ; Are you going to lie in the sun? - Yes, I am. (full) ; Are you going to lie in the sun? Yes, I am (full) | — | — | — | — |
| g1u15.gi.going-to.tr.003 | translation | Wir werden im Meer schwimmen. [de] | We are going to swim in the sea. (full) ; We're going to swim in the sea. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u15/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u15",
  "lens": "level-gloss",
  "itemsHash": "5a2e302029f4",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 58, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
