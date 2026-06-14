# Verify lens — level-gloss — g2-u08 (round 2)

<!-- domigo:verify level-gloss g2-u08 items=60f1cbb5b841 prompt=aefb997bf664 round=2 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Amherst, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Centre, Chamber, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Earthlings, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Hungary, Hunt, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, South, Square, States, Station, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (32)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u08.w.aeroplane | a big thing with wings that carries people high in the sky | Yesterday, I saw a huge ___ in the sky. | spaceship ; statue ; machine | spaceship ; statue ; machine ; cable ; key | wings (= Flügel, Tragflächen) |
| g2u08.w.alien | a living thing that is not from Earth | A green ___ came to Earth from space. | commander ; traveller ; visitor | commander ; traveller ; visitor ; expert ; boss | — |
| g2u08.w.boss | the man or woman you work for | My mum has a new ___ at the office. | visitor ; traveller ; expert | visitor ; traveller ; expert ; commander ; crew | — |
| g2u08.w.cable | a long thing that connects two machines | Benson connected a ___ to his spacesuit. | key ; machine ; statue | key ; machine ; statue ; spacesuit ; photograph | — |
| g2u08.w.calm-down | you call this out to a friend who is too excited or scared | ___! There is nothing to be afraid of. | Go away! ; Hurry up. ; Be careful. | Go away! ; Hurry up. ; Be careful. ; Don't worry. ; Come on! | — |
| g2u08.w.capital | the city of a country where the king or queen lives | Vienna is the ___ of Austria. | space centre ; statue ; key | space centre ; statue ; key ; machine ; photograph | — |
| g2u08.w.comfortable | nice to be on and you are not tired | The chair was very ___ and I did not want to get up. | nervous ; dangerous ; famous | nervous ; dangerous ; famous ; noisy ; scary | — |
| g2u08.w.commander | the boss of a spaceship who gives the crew their jobs | The ___ told the crew what to do. | visitor ; traveller ; expert | visitor ; traveller ; expert ; alien ; crew | — |
| g2u08.w.crew | all the people who work on a ship or a plane | Benson wants to help his ___ on the spaceship. | commander ; visitor ; expert | commander ; visitor ; expert ; traveller ; boss | — |
| g2u08.w.expert | a man or woman who is very good at one thing | She studied space for many years, so she is an ___. | visitor ; traveller ; crew | visitor ; traveller ; crew ; commander ; boss | — |
| g2u08.w.hero-heroine | a great man people love and thank for what he did | Commander Benson is our ___ - we all love and thank him. | commander ; visitor ; expert | commander ; visitor ; expert ; traveller ; boss | — |
| g2u08.w.hoax | a false story that people are told is true | The news isn't true. It's a ___. | investigation ; photograph ; machine | investigation ; photograph ; machine ; statue ; cable | — |
| g2u08.w.in-that-case | if that is so, then | You don't like fish? ___, let's have chicken. | Calm down! ; Don't worry. ; No problem. | Calm down! ; Don't worry. ; No problem. ; Well done. ; Come on! | — |
| g2u08.w.investigation | the work the police do to find out what really happened | The police did an ___ to find out what happened. | photograph ; hoax ; statue | photograph ; hoax ; statue ; machine ; cable | — |
| g2u08.w.key | a small thing that opens a door or a car | He put the ___ in the door and opened it. | cable ; machine ; statue | cable ; machine ; statue ; photograph ; spacesuit | — |
| g2u08.w.machine | a thing that does a job for you, like washing clothes | Benson used a ___ to talk to the alien. | cable ; key ; statue | cable ; key ; statue ; spaceship ; photograph | — |
| g2u08.w.nonsense | talk that is mad and not true | You're talking ___! That story can't be true. | hoax ; investigation ; statue | hoax ; investigation ; statue ; machine ; crew | — |
| g2u08.w.photograph | a picture you take to keep | My grandma showed me a ___ of her sister. | statue ; machine ; cable | statue ; machine ; cable ; key ; investigation | — |
| g2u08.w.planet | a big thing in space where people or aliens can live, like Earth or Mars | Earth is the ___ where we all live. | spaceship ; statue ; machine | spaceship ; statue ; machine ; cable ; key | — |
| g2u08.w.space | everything far away from Earth, where the stars and planets are | There are lots of stars and planets out there in ___. | capital ; crew ; key | capital ; crew ; key ; statue ; machine | — |
| g2u08.w.space-centre | the place on Earth where people work on spaceships | We visited the ___ and looked at the spaceships. | spaceship ; spacesuit ; statue | spaceship ; spacesuit ; statue ; capital ; machine | — |
| g2u08.w.spaceship | a ship that travels in space | A ___ is a ship that travels in space. | aeroplane ; spacesuit ; planet | aeroplane ; spacesuit ; planet ; statue ; machine | — |
| g2u08.w.spacesuit | the clothes you wear out in space | Benson wears a ___ outside the spaceship. | spaceship ; cable ; machine | spaceship ; cable ; machine ; statue ; key | — |
| g2u08.w.statue | a big thing made of stone that looks like a famous man | There's a ___ of Lord Nelson at Trafalgar Square. | machine ; cable ; key | machine ; cable ; key ; photograph ; spaceship | — |
| g2u08.w.to-connect | to join two machines with a cable | You have to ___ the cable to the spacesuit. | to repair ; to destroy ; to kidnap | to repair ; to destroy ; to kidnap ; to take over ; to clean | — |
| g2u08.w.to-destroy | to break a place so much that nothing is there | In the story, aliens want to ___ the town and all the buildings. | to repair ; to connect ; to kidnap | to repair ; to connect ; to kidnap ; to take over ; to clean | — |
| g2u08.w.to-kidnap | to take people away and keep them, often for money | I think aliens want to ___ people from Earth. | to repair ; to connect ; to destroy | to repair ; to connect ; to destroy ; to take over ; to clean | — |
| g2u08.w.to-repair | to make a thing work again after it breaks | Benson went outside to ___ the spaceship. | to connect ; to destroy ; to kidnap | to connect ; to destroy ; to kidnap ; to take over ; to clean | — |
| g2u08.w.to-take-over | to become the new boss of a place and rule it | The aliens want to ___ the Earth. | to repair ; to connect ; to destroy | to repair ; to connect ; to destroy ; to kidnap ; to clean | — |
| g2u08.w.traveller | a man or woman who travels from place to place | I'm a ___ from planet Arconia. | commander ; expert ; boss | commander ; expert ; boss ; visitor ; crew | — |
| g2u08.w.ufo | a thing in the sky that some people think is from space | We saw a ___ in the sky last night, but nobody knew what it was. | aeroplane ; statue ; cable | aeroplane ; statue ; cable ; key ; machine | — |
| g2u08.w.visitor | a man or woman who comes to a place to see it | Today we had a ___ from England who told us about London. | commander ; expert ; boss | commander ; expert ; boss ; traveller ; crew | — |

## Grammar items (30)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u08.gi.past-time-markers.ag.003 | anagram | Dieses Wort steht am Ende und zeigt, dass die Geschichte vorbei ist. [de] | Finally (full) | — | — | — | — |
| g2u08.gi.past-time-markers.ag.004 | anagram | Kleines Wort, das zeigt, wie lange etwas her ist (z. B. two days …). [de] | ago (full) | — | — | — | — |
| g2u08.gi.past-time-markers.cp.001 | context-picker | Here is a story about a UFO. [en] | First, we saw a light. Then, a spaceship landed. (full) | First, we see a light. Then, a spaceship lands. ; First, we saw a light. Then, a spaceship lands. ; First, we saw a light. Then, a spaceship is landing. | — | — | — |
| g2u08.gi.past-time-markers.cp.002 | context-picker | Here is a story about a spaceship. [en] | Last night, the commander heard a noise. (full) | The commander last night heard a noise. ; Last night, heard the commander a noise. ; The commander heard last night a noise. | — | — | — |
| g2u08.gi.past-time-markers.ec.001 | error-correction | First, we went to the park. Then we play football. [en] | First, we went to the park. Then we played football. (full) ; played (partial) | — | — | — | — |
| g2u08.gi.past-time-markers.ec.002 | error-correction | First, the alien came out. Then it look at Benson. [en] | First, the alien came out. Then it looked at Benson. (full) ; looked (partial) | — | — | — | — |
| g2u08.gi.past-time-markers.ec.003 | error-correction | Then went the commander outside. [en] | Then the commander went outside. (full) | — | — | — | — |
| g2u08.gi.past-time-markers.ec.004 | error-correction | She didn't took a photograph of the UFO. [en] | She didn't take a photograph of the UFO. (full) | — | — | — | — |
| g2u08.gi.past-time-markers.ec.005 | error-correction | He goed back to the spaceship. [en] | He went back to the spaceship. (full) | — | — | — | — |
| g2u08.gi.past-time-markers.gf.001 | gap-fill | ___, the spaceship landed. Then, an alien came out. [en, 1 blank(s)] | First (full) | — | — | — | — |
| g2u08.gi.past-time-markers.gf.002 | gap-fill | First, the cable broke. ___, everything went black. [en, 1 blank(s)] | Then (full) ; After that (full) | — | — | — | — |
| g2u08.gi.past-time-markers.gf.003 | gap-fill | First, the crew repaired the machine. Then, the spaceship landed. ___, they came back to Earth. [en, 1 blank(s)] | Finally (full) | — | — | — | — |
| g2u08.gi.past-time-markers.gf.004 | gap-fill | I saw that UFO two days ___. [en, 1 blank(s)] | ago (full) | — | — | — | — |
| g2u08.gi.past-time-markers.gf.005 | gap-fill | ___ night, a spaceship landed in our garden. [en, 1 blank(s)] | Last (full) | — | — | — | — |
| g2u08.gi.past-time-markers.gf.006 | gap-fill | First, we visited the space centre. Then, we saw the spaceship. ___, we went inside. ___, we landed on the planet! [en, 2 blank(s)] | After that \| Finally (full) | — | — | — | — |
| g2u08.gi.past-time-markers.gf.007 | gap-fill | ___ 2013, there was a big investigation ___ the photograph. [en, 2 blank(s)] | In \| into (full) | — | — | — | — |
| g2u08.gi.past-time-markers.gs.003 | group-sort | Open or close a story? [en] | — | — | — | opens a story: First, One day, Last night \| in the middle or at the end: After that, Then, Finally | — |
| g2u08.gi.past-time-markers.mc.002 | multiple-choice | Then ___ to the door. [en, 1 blank(s)] | she ran (full) | ran she ; she runs ; she run | — | — | — |
| g2u08.gi.past-time-markers.mc.003 | multiple-choice | Benson told the class a story. [en] | After that, the commander went outside. (full) | After that, went the commander outside. ; After that, the commander going outside. ; After that, the commander go outside. | — | — | — |
| g2u08.gi.past-time-markers.mc.004 | multiple-choice | Put the story in order. [en] | First, the cable broke. Then, Benson woke up on a spaceship. After that, an alien came out. Finally, they took him back to Earth. (full) | Finally, the cable broke. Then, Benson woke up on a spaceship. First, an alien came out. After that, they took him back to Earth. ; After that, the cable broke. First, Benson woke up on a spaceship. Finally, an alien came out. Then, they took him back to Earth. ; Then, the cable broke. After that, Benson woke up on a spaceship. Finally, an alien came out. First, they took him back to Earth. | — | — | — |
| g2u08.gi.past-time-markers.mc.005 | multiple-choice | First, we saw a light. ___, the spaceship landed. Finally, an alien came out. [en, 1 blank(s)] | Then (full) ; After that (full) | First ; Finally ; Half an hour ago | — | — | — |
| g2u08.gi.past-time-markers.mp.001 | matching-pairs | Match the opener with what came after. [en] | — | — | First, the cable broke. ↔ Then, Benson was lost in space. ; Half an hour ago, we heard a noise. ↔ After that, we saw a UFO. ; One day, an alien came to Earth. ↔ Finally, it took Benson back to Earth. ; In 2013, there was a big investigation. ↔ Then, the experts studied the photograph. | — | — |
| g2u08.gi.past-time-markers.sb.001 | sentence-building | Then / he / ran / outside [en] | Then he ran outside. (full) ; Then he ran outside (full) | — | — | — | — |
| g2u08.gi.past-time-markers.sb.002 | sentence-building | After that, / an / alien / came / out [en] | After that, an alien came out. (full) ; After that, an alien came out (full) | — | — | — | — |
| g2u08.gi.past-time-markers.sb.003 | sentence-building | Last night, / a / UFO / landed [en] | Last night, a UFO landed. (full) ; Last night, a UFO landed (full) | — | — | — | — |
| g2u08.gi.past-time-markers.tf.001 | transformation | Put in order: 'We saw a light. A spaceship landed.' (First … Then …) [en] | First, we saw a light. Then, a spaceship landed. (full) ; First we saw a light. Then a spaceship landed. (full) | — | — | — | — |
| g2u08.gi.past-time-markers.tf.002 | transformation | We went to the space centre. We see a statue. (make it past and join: First … Then …) [en] | First, we went to the space centre. Then, we saw a statue. (full) ; First we went to the space centre. Then we saw a statue. (full) | — | — | — | — |
| g2u08.gi.past-time-markers.tf.003 | transformation | A spaceship landed in our garden last night. (begin with the time) [en] | Last night, a spaceship landed in our garden. (full) | — | — | — | — |
| g2u08.gi.past-time-markers.tr.001 | translation | Letzte Nacht landete ein Raumschiff in unserem Garten. [de] | Last night, a spaceship landed in our garden. (full) ; Last night a spaceship landed in our garden. (full) ; Last night, a spaceship landed in our garden (full) | — | — | — | — |
| g2u08.gi.past-time-markers.tr.002 | translation | Dann ging er zum Raumfahrtzentrum. [de] | Then he went to the space centre. (full) ; Then, he went to the space centre. (full) ; Then he went to the space centre (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u08/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u08",
  "lens": "level-gloss",
  "itemsHash": "60f1cbb5b841",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 62, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
