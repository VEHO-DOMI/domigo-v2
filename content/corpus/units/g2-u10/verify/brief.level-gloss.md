# Verify lens — level-gloss — g2-u10 (round 2)

<!-- domigo:verify level-gloss g2-u10 items=4a29b0e5ca4a prompt=aefb997bf664 round=2 -->

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
- **g2-u03**: witch, ghost, pumpkin bucket, vampire, trick or treat, apple bobbing, mask, tradition, to fear, to cut off, front window, to keep, to be proud (of), stairs, sticker, sweets, Trick or treat!, knife (pl knives), century, costume, couldn't, cute, dress, graveyard, myself, shall, sick, superheroine, wild, to scare, cycle helmet, guys, to lose, picnic
- **g2-u04**: mosquito, pigeon, parrot, ostrich, chimpanzee, antelope, bat, giraffe, rhino, cheetah, anaconda, crocodile, dolphin, whale, shark, (two days) ago, farmer, human, incredible, dangerous, hairy, heavy, strong, climate change, fast, female, male, nobody, scientist, to die out, less, to carry, centimetre, desert, to die, mammal, ton, venomous, to weigh, length, speed, intelligent, reason, to share, luck, powerful, smart, truck, forever, to protect
- **g2-u05**: cinema, church, bank, restaurant, railway station, chemist's, tourist office, music shop, post office, supermarket, hospital, police station, to go past, to go straight ahead, to cross the street, to turn left, to take the second right, round the corner, as far as, opposite, next to, to cross, map, second, to go straight on, airport, to change trains, most of the time, pocket, slow, somewhere, underground, market square, simply, comment, to comment, feedback, guest, to offer, opening, positive, review, the worst, to bother, bus stop, fountain, to interrupt, politely, traffic lights
- **g2-u06**: sun, sea, beach, town, motorway, road, river, village, field, hill, valley, lake, forest, mountains, stars, moon, to build a tree house, camp, life jacket, guide, campfire, picnic, canoe, canoeing, waterfall, rock climbing, bottom, left-hand, middle, right-hand, anorak, hard hat, absolutely, actually, adventure camp, to be afraid (of), although, to care, drive, gate, to be good at sth., once upon a time, sheep (pl sheep), shepherd, to trust, while, to wash up, alive, cry, I'm off now., Poor you!
- **g2-u07**: to do nothing, to play basketball, to stay at a friend's house, to tidy your room, to have a party, to do the shopping, to do your homework, to watch a film, honestly, instead, to take it easy, to be ashamed, to come over, communication, excuse, group chat, social media, to tell a lie, truth, to be worried, to crash, to get into trouble, fancy dress party, disappointment, German, row, sold out, That's a pity., ticket, What a shame!
- **g2-u08**: spaceship, commander, spacesuit, alien, UFO, space centre, planet, boss, cable, capital, to connect, hero, heroine, machine, to repair, space, statue, to take over, traveller, visitor, key, crew, aeroplane, expert, hoax, investigation, photograph, to destroy, to kidnap, nonsense, comfortable, Calm down!, in that case
- **g2-u09**: grapes, plums, pumpkin pie, rice pudding, chocolate ice cream, turkey, ham, beef, chicken, apple juice, cheesecake, pancakes, mineral water, tomato (pl tomatoes), cabbage, sausages, lamb, pears, peppers, onions, olives, mushrooms, potato (pl potatoes), peaches, strawberries, chef, recipe, waiter, cloche, menu, slice, actor, actress, main course, to pour, soup, starter, straightaway, completely, crane, to drop, to entertain, glasses (pl), platform, to serve, several, stew, fridge, to complain, consumer, delivery, to download, refund, certain, to change one's mind, gym, to miss
- **g2-u10**: auntie, calm, girlfriend, to be proud of, sense of humour, ugly, virus, to breathe, to burn, foreign language, to panic, tractor, tool, divorced, to be related to, to delete, file, to print out, public, ice skating, fault, hopefully

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Americans, Amherst, Anderson, Andrew, Andy, Anger, Annie, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Claire, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, Eric, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Hanna, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Rick, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salzburg, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Square, States, Station, Steve, Sue, Sunborn, Susan, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (22)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u10.w.auntie | your mum's or dad's sister. | My ___ arrived first and she had a big present for me. | uncle ; grandma ; grandpa | uncle ; grandma ; grandpa ; sister ; mother | — |
| g2u10.w.calm | not nervous and not scared; you stay nice and still. | It's difficult for me to stay ___ when so many people are here. | nervous ; angry ; scared | nervous ; angry ; scared ; proud ; sad | — |
| g2u10.w.divorced | when a mum and dad are not a family any more, and the dad lives in a new place. | Rick's parents are ___ and he lives with his mum. | calm ; proud ; ugly | calm ; proud ; ugly ; public ; nervous | — |
| g2u10.w.fault | when a bad thing happens because of you. | It's not my ___! I did nothing bad. | virus ; tool ; file | virus ; tool ; file ; tractor ; girlfriend | — |
| g2u10.w.file | a place on your tablet where you keep your work. | I keep my homework in this ___ and open it on my tablet. | tool ; virus ; fault | tool ; virus ; fault ; tractor ; girlfriend | — |
| g2u10.w.foreign-language | English or French for you, if you speak German at school and with your family. | She doesn't speak a ___; she just speaks German. | sense of humour ; virus ; tractor | sense of humour ; virus ; tractor ; tool ; file | — |
| g2u10.w.girlfriend | a girl or woman that a boy or man loves. | My dad has a new ___ and she is very nice. | boyfriend ; sister ; aunt | boyfriend ; sister ; aunt ; grandma ; mother | — |
| g2u10.w.hopefully | you want a good thing to happen tomorrow. | ___ it is sunny tomorrow, so we can play outside. | honestly ; actually ; completely | honestly ; actually ; completely ; simply ; absolutely | — |
| g2u10.w.ice-skating | you do this on skates when it is very cold. | I don't like ___, because I always fall down. | tool ; tractor ; fault | tool ; tractor ; fault ; virus ; file | — |
| g2u10.w.public | open for all the people, not just for you. | A library is a ___ place — anyone can go in. | calm ; ugly ; divorced | calm ; ugly ; divorced ; proud ; nervous | — |
| g2u10.w.sense-of-humour | when you can be funny and make people laugh. | My dad is so funny. He has a great ___. | virus ; file ; fault | virus ; file ; fault ; tool ; tractor | — |
| g2u10.w.to-be-proud-of | to be very happy about what you or your family did. | I am very ___ myself for my good work today. | scared ; calm ; nervous | scared ; calm ; nervous ; angry ; divorced | — |
| g2u10.w.to-be-related-to | to be in one family with people like your aunt and uncle. | Talk about the people in your family and how they are ___ you. | proud of ; divorced ; public | proud of ; divorced ; public ; calm ; ugly | — |
| g2u10.w.to-breathe | you do this with your nose and mouth all day, in and out. | When you run very fast, it is difficult to ___. | burn ; panic ; delete | burn ; panic ; delete ; print out ; tool | — |
| g2u10.w.to-burn | when fire makes a thing hot and black. | Be careful with the fire — you can ___ your fingers! | breathe ; delete ; panic | breathe ; delete ; panic ; print out ; file | — |
| g2u10.w.to-delete | to make a file go away on your tablet, so it is not there any more. | Don't ___ my homework — I need it! | print out ; breathe ; burn | print out ; breathe ; burn ; panic ; public | — |
| g2u10.w.to-panic | to be so scared that you do not stay calm. | Stay calm and don't ___! I am here to help you. | breathe ; burn ; delete | breathe ; burn ; delete ; print out ; public | — |
| g2u10.w.to-print-out | to make your work come out of the tablet so you can hold it and read it. | Can you ___ this story for me, so I can read it on my desk? | delete ; breathe ; burn | delete ; breathe ; burn ; panic ; file | — |
| g2u10.w.tool | a thing like a hammer; you hold it to make or open a box. | I need a ___ to make this chair. A hammer is one. | tractor ; virus ; file | tractor ; virus ; file ; fault ; girlfriend | — |
| g2u10.w.tractor | a big machine a farmer uses to work in the fields. | The farmer has a big ___ on his farm. | tool ; virus ; file | tool ; virus ; file ; fault ; girlfriend | — |
| g2u10.w.ugly | not nice to look at. | Your hat's so ___! I really don't like it. | pretty ; beautiful ; nice | pretty ; beautiful ; nice ; calm ; proud | — |
| g2u10.w.virus | a very small living thing that can make you sick. | I'm not well today. I've got this ___ and I must stay in bed. | file ; tool ; fault | file ; tool ; fault ; tractor ; girlfriend | — |

## Grammar items (45)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u10.gi.like-ing.ag.001 | anagram | tanzen, mit -ing [de] | dancing (full) | — | — | — | — |
| g2u10.gi.like-ing.ag.002 | anagram | Das macht jemand gern, der in der Küche Essen zubereitet (mit -ing). [de] | cooking (full) | — | — | — | — |
| g2u10.gi.like-ing.cp.001 | context-picker | Your dad never enjoys running when it is cold. [en] | My dad doesn't like running. (full) | My dad doesn't like run. ; My dad doesn't likes running. ; My dad don't like running. | — | — | — |
| g2u10.gi.like-ing.ec.001 | error-correction | I like read in bed. [en] | I like reading in bed. (full) ; reading (partial) | — | — | — | — |
| g2u10.gi.like-ing.ec.002 | error-correction | He like playing computer games. [en] | He likes playing computer games. (full) ; likes (partial) | — | — | — | — |
| g2u10.gi.like-ing.ec.003 | error-correction | She likes to cooking pasta. [en] | She likes cooking pasta. (full) ; cooking (partial) | — | — | — | — |
| g2u10.gi.like-ing.ff.001 | free-form | Tell your new pen friend about one thing you like doing in your free time. [en] | I like reading. (full) ; I like playing computer games. (full) ; I like cooking. (partial) | — | — | — | — |
| g2u10.gi.like-ing.gf.001 | gap-fill | I like ___ books before bedtime. [en, 1 blank(s)] | reading (full) | — | — | — | — |
| g2u10.gi.like-ing.gf.002 | gap-fill | She likes ___ in the kitchen. [en, 1 blank(s)] | cooking (full) | — | — | — | — |
| g2u10.gi.like-ing.gf.003 | gap-fill | My uncle likes ___ pictures of the mountains. [en, 1 blank(s)] | painting (full) | — | — | — | — |
| g2u10.gi.like-ing.gf.004 | gap-fill | We don't like ___ early at the weekend. [en, 1 blank(s)] | getting up (full) | — | — | — | — |
| g2u10.gi.like-ing.gf.005 | gap-fill | My grandpa likes ___ a fire and ___ it. [en, 2 blank(s)] | making \| watching (full) | — | — | — | — |
| g2u10.gi.like-ing.mc.001 | multiple-choice | Lucy loves music. [en] | Lucy likes dancing. (full) | Lucy likes dance. ; Lucy like dancing. ; Lucy likes to dancing. | — | — | — |
| g2u10.gi.like-ing.mc.002 | multiple-choice | You want to ask a friend about cooking. [en] | Do you like cooking? (full) | Do you like cook? ; Does you like cooking? ; Do you likes cooking? | — | — | — |
| g2u10.gi.like-ing.mc.003 | multiple-choice | A friend asks about your free time. [en] | I like playing computer games. (full) | I like play computer games. ; I like to playing computer games. ; I am like playing computer games. | — | — | — |
| g2u10.gi.like-ing.mp.001 | matching-pairs | Free time fun. [en] | — | — | I like cooking ↔ in the kitchen. ; She likes reading ↔ with a good book. ; He likes painting ↔ with his pictures. ; We like dancing ↔ to the music. | — | — |
| g2u10.gi.like-ing.mt.001 | matching | What they like doing. [en] | — | — | I ↔ like reading. ; She ↔ likes cooking. ; We don't ↔ like dancing. ; Does he ↔ like painting? | — | — |
| g2u10.gi.like-ing.qf.001 | question-formation | they / like / play computer games [en] | Do they like playing computer games? (full) | — | — | — | — |
| g2u10.gi.like-ing.sb.001 | sentence-building | she / likes / her / reading / books [en] | She likes reading her books. (full) | — | — | — | — |
| g2u10.gi.like-ing.sb.002 | sentence-building | doesn't / he / like / up / washing [en] | He doesn't like washing up. (full) | — | — | — | — |
| g2u10.gi.like-ing.tf.001 | transformation | I / like / paint pictures → [en] | I like painting pictures. (full) | — | — | — | — |
| g2u10.gi.like-ing.tf.003 | transformation | He ___ (not like / watch) the news. [en, 1 blank(s)] | He doesn't like watching the news. (full) ; He does not like watching the news. (full) ; doesn't like watching (partial) ; does not like watching (partial) | — | — | — | — |
| g2u10.gi.like-ing.tr.001 | translation | Ich spiele gern Gitarre. [de] | I like playing the guitar. (full) ; I like playing guitar. (partial) | — | — | — | — |
| g2u10.gi.like-ing.tr.002 | translation | Meine Schwester kocht nicht gern. [de] | My sister doesn't like cooking. (full) ; My sister does not like cooking. (full) | — | — | — | — |
| g2u10.gi.must.ag.001 | anagram | nicht dürfen (kurz, mit Apostroph) [de] | mustn't (full) | — | — | — | — |
| g2u10.gi.must.cp.001 | context-picker | At the camp you all wear a hard hat. [en] | You must wear a hard hat. (full) | You mustn't wear a hard hat. ; You don't have to wear a hard hat. ; You must to wear a hard hat. | — | — | — |
| g2u10.gi.must.ec.001 | error-correction | You must to wear a life jacket in the canoe. [en] | You must wear a life jacket in the canoe. (full) ; must wear (partial) | — | — | — | — |
| g2u10.gi.must.ec.002 | error-correction | You don't must open the cage. [en] | You mustn't open the cage. (full) ; You must not open the cage. (full) ; mustn't (partial) | — | — | — | — |
| g2u10.gi.must.ec.003 | error-correction | She musts clean the kitchen after dinner. [en] | She must clean the kitchen after dinner. (full) ; must clean (partial) | — | — | — | — |
| g2u10.gi.must.ec.004 | error-correction | It's the weekend. We mustn't go to school. [en] | We don't have to go to school. (full) ; We do not have to go to school. (full) ; don't have to (partial) | — | — | — | — |
| g2u10.gi.must.ff.002 | free-form | A family lives on a spaceship. Write one rule with mustn't for them. [en] | You mustn't open the door. (full) ; You mustn't touch the tools. (full) ; You mustn't go in there. (partial) | — | — | — | — |
| g2u10.gi.must.gf.001 | gap-fill | You ___ do your homework before you play outside. [en, 1 blank(s)] | must (full) | — | — | — | — |
| g2u10.gi.must.gf.002 | gap-fill | You ___ delete the file. Dad needs it! [en, 1 blank(s)] | mustn't (full) ; must not (full) | — | — | — | — |
| g2u10.gi.must.gf.003 | gap-fill | She ___ wear a cycle helmet at the adventure camp. [en, 1 blank(s)] | must (full) | — | — | — | — |
| g2u10.gi.must.gf.004 | gap-fill | You ___ touch the tools at the adventure camp. It is dangerous. [en, 1 blank(s)] | mustn't (full) ; must not (full) | — | — | — | — |
| g2u10.gi.must.gf.006 | gap-fill | In the museum you ___ run, but you ___ stay with the guide all the time. [en, 2 blank(s)] | mustn't \| must (full) ; must not \| must (full) | — | — | — | — |
| g2u10.gi.must.gs.001 | group-sort | Must, mustn't or not? [en] | — | — | — | must: You must close the door., You must clean the kitchen. \| mustn't: You mustn't climb that tree., You mustn't tell a lie. \| don't have to: You don't have to wear school shoes., You don't have to print out the file. | — |
| g2u10.gi.must.mc.001 | multiple-choice | You are in the museum and you want to run. [en] | You mustn't run in the museum. (full) | You don't have to run in the museum. ; You don't must run in the museum. ; You must run in the museum. | — | — | — |
| g2u10.gi.must.mc.002 | multiple-choice | It is Saturday and there is no school. [en] | We don't have to get up early today. (full) | We mustn't get up early today. ; We must get up early today. ; We don't must get up early today. | — | — | — |
| g2u10.gi.must.mt.001 | matching | What you must and mustn't do. [en] | — | — | It is the weekend. ↔ You don't have to get up early. ; The kitchen is dirty. ↔ You must clean it. ; The teacher is talking. ↔ You mustn't talk. ; The cage is open. ↔ You must close it. | — | — |
| g2u10.gi.must.sb.001 | sentence-building | mustn't / the / you / delete / file [en] | You mustn't delete the file. (full) | — | — | — | — |
| g2u10.gi.must.tf.001 | transformation | She ___ (clean) the kitchen. [en, 1 blank(s)] | She must clean the kitchen. (full) ; must clean the kitchen (partial) | — | — | — | — |
| g2u10.gi.must.tf.002 | transformation | It is a rule at the camp. You ___ (touch) the tools here. [en, 1 blank(s)] | You mustn't touch the tools here. (full) ; You must not touch the tools here. (full) ; mustn't touch (partial) | — | — | — | — |
| g2u10.gi.must.tr.001 | translation | Du musst ruhig bleiben. [de] | You must stay calm. (full) ; You have to stay calm. (partial) | — | — | — | — |
| g2u10.gi.must.tr.002 | translation | Du darfst hier nicht laufen. [de] | You mustn't run here. (full) ; You must not run here. (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u10/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u10",
  "lens": "level-gloss",
  "itemsHash": "4a29b0e5ca4a",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 67, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
