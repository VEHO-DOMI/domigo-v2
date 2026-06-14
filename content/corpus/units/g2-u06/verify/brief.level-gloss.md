# Verify lens — level-gloss — g2-u06 (round 2)

<!-- domigo:verify level-gloss g2-u06 items=294d10cc9c5d prompt=aefb997bf664 round=2 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Amherst, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Chamber, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, Excuse, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Hungary, Hunt, Imagine, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lisa, London, Lord, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mary, Matt, Mayan, Mei, Mexico, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, South, Square, States, Station, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, Trick, True, Turan, Uhr, Um, United, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (51)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u06.w.absolutely | more than very | The guides were ___ angry when Bob jumped in the lake. | actually ; although ; while | actually ; although ; while ; alive | — |
| g2u06.w.actually | really, when it is a surprise | The rest of the day was ___ fun. | absolutely ; although ; while | absolutely ; although ; while ; alive | rest (= Rest) |
| g2u06.w.adventure-camp | a holiday place where children climb and have fun outside | We are going to spend three days at the ___ in the mountains. | campfire ; picnic ; waterfall | campfire ; picnic ; waterfall ; canoe ; guide | — |
| g2u06.w.alive | not dead, still living | The boy was hurt, but he was still ___. | actually ; absolutely ; while | actually ; absolutely ; while ; although | — |
| g2u06.w.although | this is like 'but still' | I enjoyed it, ___ I wasn't very good at it. | actually ; absolutely ; while | actually ; absolutely ; while ; alive | — |
| g2u06.w.anorak | a jacket you wear on cold and wet days | Wear an ___ near the waterfall. | hard hat ; life jacket ; canoe | hard hat ; life jacket ; canoe ; campfire ; guide | — |
| g2u06.w.beach | the place where the land meets the sea and you can play | We can play on the ___ next to the sea all day. | forest ; mountains ; field | forest ; mountains ; field ; village ; hill | — |
| g2u06.w.bottom | the place down at the end of a thing | The lake is at the ___ of the picture. | middle ; left-hand ; right-hand | middle ; left-hand ; right-hand ; forest ; field | — |
| g2u06.w.camp | a place where children stay outside on holiday | We played in the sea all day on our summer ___. | picnic ; campfire ; guide | picnic ; campfire ; guide ; canoe ; waterfall | — |
| g2u06.w.campfire | you make this outside at night and tell scary stories in the dark | In the dark forest there was a ___, and we had fun in the light of the fire. | picnic ; canoe ; guide | picnic ; canoe ; guide ; waterfall ; camp | — |
| g2u06.w.canoe | a small light thing you go down the river in | The children can go down the river in a small ___. | campfire ; picnic ; anorak | campfire ; picnic ; anorak ; life jacket ; hard hat | — |
| g2u06.w.canoeing | going down a river in a small canoe | ___ down the river in a canoe is great fun at camp. | rock climbing ; picnic ; campfire | rock climbing ; picnic ; campfire ; waterfall ; guide | — |
| g2u06.w.cry | a call for help when you are hurt or scared | There was a ___ for help from the river. | picnic ; gate ; drive | picnic ; gate ; drive ; camp | — |
| g2u06.w.drive | a long time going somewhere in a car | It was a long ___ in the car to the camp. | road ; gate ; while | road ; gate ; while ; camp | — |
| g2u06.w.field | the big open green land on a farm | Sheep eat in the big green ___ next to the farm. | forest ; village ; road | forest ; village ; road ; hill ; valley | — |
| g2u06.w.forest | a big place with lots of trees | There are lots of tall trees in the dark ___ near the camp. | valley ; river ; village | valley ; river ; village ; field ; hill | — |
| g2u06.w.gate | A big door you open to go into a field or garden. | There was a huge ___ with a big sign on it. | road ; drive ; camp | road ; drive ; camp ; forest | sign (= Schild) |
| g2u06.w.guide | the man or woman who looks after a group at the camp | The ___ showed the group the canoe. | shepherd ; canoe ; picnic | shepherd ; canoe ; picnic ; campfire ; guests | — |
| g2u06.w.hard-hat | a strong thing you put on to build a tree house or climb | When you build a tree house, you have to wear a ___. | anorak ; life jacket ; canoe | anorak ; life jacket ; canoe ; campfire ; guide | — |
| g2u06.w.hill | high green land smaller than the mountains | We can run up the small green ___ and look at the town down there. | valley ; river ; forest | valley ; river ; forest ; field ; village | — |
| g2u06.w.i-m-off-now | what you tell people when you go | ___ Bye! I need to catch my train. | Poor you! ; Once upon a time ; Absolutely | Poor you! ; Once upon a time ; Absolutely ; Actually | — |
| g2u06.w.lake | a big area of water, smaller than the sea | We can go canoeing on the ___ in the mountains; it is cold up there! | river ; mountains ; forest | river ; mountains ; forest ; field ; hill | water (= Wasser) |
| g2u06.w.left-hand | The side that is not the right one. | On the ___ side there's a lake. | right-hand ; middle ; bottom | right-hand ; middle ; bottom ; forest ; field | side (= Seite) |
| g2u06.w.life-jacket | you wear this in a canoe so you do not go under | You have to wear a ___ in the canoe all the time. | anorak ; hard hat ; canoe | anorak ; hard hat ; canoe ; campfire ; guide | — |
| g2u06.w.middle | the inside place of a thing, not at the end | In the ___ of the forest there was a campfire. | bottom ; left-hand ; right-hand | bottom ; left-hand ; right-hand ; forest ; field | — |
| g2u06.w.moon | the big light in the sky at night | At night the ___ was big and bright in the dark sky. | sun ; stars ; sea | sun ; stars ; sea ; lake ; river | bright (= hell) |
| g2u06.w.motorway | a very big road where cars and trucks go very fast | The cars go fast on the big ___ to Vienna. | road ; river ; valley | road ; river ; valley ; village ; field | — |
| g2u06.w.mountains | the very high land you climb up with snow on it | There was white snow high on the ___. | hill ; valley ; forest | hill ; valley ; forest ; field ; river | — |
| g2u06.w.once-upon-a-time | the first thing you read in a story about long ago | ___, there was a young shepherd boy who lived in the forest. | poor you ; i'm off now ; absolutely | poor you ; i'm off now ; absolutely ; actually ; although | — |
| g2u06.w.picnic | food and drink you bring to eat outside | We had a ___ near the river with sandwiches and orange juice. | campfire ; canoe ; guide | campfire ; canoe ; guide ; waterfall ; camp | — |
| g2u06.w.poor-you | what you tell a friend who is sad or hurt | ___! You look very hungry and sad. | I'm off now. ; Once upon a time ; Actually | I'm off now. ; Once upon a time ; Actually ; Absolutely | — |
| g2u06.w.right-hand | The side that is not the left one. | On the ___ side there's a waterfall. | left-hand ; middle ; bottom | left-hand ; middle ; bottom ; forest ; field | side (= Seite) |
| g2u06.w.river | the long thing that fish live in and runs to the sea | There are lots of fish in the ___ that runs down to the sea. | road ; forest ; mountains | road ; forest ; mountains ; hill ; field | — |
| g2u06.w.road | the long thing that cars and trucks drive on | Cars and trucks drive on the new ___ from our village. | motorway ; river ; forest | motorway ; river ; forest ; field ; hill | — |
| g2u06.w.rock-climbing | Going up very high places for fun. | You can do ___ on the high rocks at the camp, but be careful! | canoeing ; picnic ; campfire | canoeing ; picnic ; campfire ; waterfall ; canoe | — |
| g2u06.w.sea | the big place fish live in, next to the beach | We played in the ___ all day on our holiday at the beach. | forest ; mountains ; village | forest ; mountains ; village ; river ; lake | — |
| g2u06.w.sheep | the white farm thing a shepherd looks after on the hill | There were lots of ___ in the green fields. | shepherd ; guide ; camp | shepherd ; guide ; camp ; picnic ; canoe | — |
| g2u06.w.shepherd | the boy or girl who looks after sheep on a hill | The ___ boy looked after the sheep on the hill. | guide ; sheep ; camp | guide ; sheep ; camp ; picnic ; canoe | — |
| g2u06.w.stars | small lights high in the sky at night | At night we looked at the ___ and the moon in the dark sky. | moon ; sun ; lake | moon ; sun ; lake ; sea ; river | — |
| g2u06.w.sun | the big thing in the sky that gives us light in the day | The ___ was very hot, so we had a lot of orange juice. | moon ; stars ; lake | moon ; stars ; lake ; sea ; river | — |
| g2u06.w.to-be-afraid | to be scared of a thing that can hurt you | The shepherd boy was not ___ of the dark forest. | good at ; alive ; actually | good at ; alive ; actually ; although ; while | — |
| g2u06.w.to-be-good-at-sth | to do a thing really well | I wasn't very ___ building a tree house. | alive ; actually ; while | alive ; actually ; while ; although ; absolutely | — |
| g2u06.w.to-build-a-tree-house | to make a small room up high in the leaves | My dad helped me ___ in the big tree. | rock climbing ; canoeing ; picnic | rock climbing ; canoeing ; picnic ; campfire ; canoe | — |
| g2u06.w.to-care | to look after a thing or a friend because you love them | The boy didn't ___ about the rules. | trust ; build a tree house ; wash up | trust ; build a tree house ; wash up ; be afraid ; good at | — |
| g2u06.w.to-trust | to think a friend is good and tell them your secrets | You have to ___ me. I am your friend. | care ; wash up ; build a tree house | care ; wash up ; build a tree house ; be afraid ; good at | — |
| g2u06.w.to-wash-up | to clean the plates after dinner | We don't have to ___ the dirty plates after dinner. | care ; trust ; build a tree house | care ; trust ; build a tree house ; be afraid ; good at | — |
| g2u06.w.town | a place where many people live, bigger than a village | Our ___ is bigger than a village, with lots of streets and people. | village ; forest ; valley | village ; forest ; valley ; field ; hill | — |
| g2u06.w.valley | the green land down in the middle of the mountains | A river runs down the green ___ in the middle of the mountains. | hill ; mountains ; town | hill ; mountains ; town ; forest ; field | — |
| g2u06.w.village | a very small place in the country, smaller than a town | My grandma lives in a small ___ in the mountains, not a big town. | town ; forest ; valley | town ; forest ; valley ; field ; hill | — |
| g2u06.w.waterfall | white river going down high rocks | We can visit a ___ in the forest near the camp. | forest ; river ; mountains | forest ; river ; mountains ; lake ; campfire | — |
| g2u06.w.while | a short time, not long | We waited for a ___ and then the train arrived. | drive ; gate ; camp | drive ; gate ; camp ; road | — |

## Grammar items (28)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u06.gi.have-to.ag.001 | anagram | Welche Form von have brauchst du bei he, she, it? (er/sie/es muss) [de] | has (full) | — | — | — | — |
| g2u06.gi.have-to.cp.001 | context-picker | It's a camp rule: every child in a canoe wears a life jacket. [en] | You have to wear a life jacket. (full) | You don't have to wear a life jacket. ; You have wear a life jacket. ; You has to wear a life jacket. | — | — | — |
| g2u06.gi.have-to.cp.002 | context-picker | Sam writes to her mum: at this camp the guides do the washing up. [en] | We don't have to wash up. (full) | We have to wash up. ; We haven't to wash up. ; We doesn't have to wash up. | — | — | — |
| g2u06.gi.have-to.ec.001 | error-correction | She have to wear a life jacket in the canoe. [en] | She has to wear a life jacket in the canoe. (full) ; has to (partial) | — | — | — | — |
| g2u06.gi.have-to.ec.002 | error-correction | You haven't to wash up at the camp. [en] | You don't have to wash up at the camp. (full) ; You do not have to wash up at the camp. (full) ; don't have to (partial) | — | — | — | — |
| g2u06.gi.have-to.ec.003 | error-correction | He hasn't to get up early on the free camp day. [en] | He doesn't have to get up early on the free camp day. (full) ; He does not have to get up early on the free camp day. (full) ; doesn't have to (partial) | — | — | — | — |
| g2u06.gi.have-to.ec.004 | error-correction | You have wear a hard hat to build a tree house. [en] | You have to wear a hard hat to build a tree house. (full) ; have to (partial) | — | — | — | — |
| g2u06.gi.have-to.ec.005 | error-correction | Do you have wash up after dinner? [en] | Do you have to wash up after dinner? (full) ; have to (partial) | — | — | — | — |
| g2u06.gi.have-to.gf.001 | gap-fill | You ___ wear a life jacket in the canoe. [en, 1 blank(s)] | have to (full) | has to ; have ; must to | — | — | — |
| g2u06.gi.have-to.gf.002 | gap-fill | She ___ get up early. The camp day is at 7. [en, 1 blank(s)] | has to (full) | have to ; has ; haves to | — | — | — |
| g2u06.gi.have-to.gf.003 | gap-fill | You ___ wash up. The guides do it at this camp. [en, 1 blank(s)] | don't have to (full) ; do not have to (full) | doesn't have to ; haven't to ; hasn't to | — | — | — |
| g2u06.gi.have-to.gf.004 | gap-fill | He ___ wear an anorak today. The sun is out. [en, 1 blank(s)] | doesn't have to (full) ; does not have to (full) | don't have to ; hasn't to ; haven't to | — | — | — |
| g2u06.gi.have-to.gf.005 | gap-fill | ___ you have to wear a hard hat to build a tree house? [en, 1 blank(s)] | Do (full) | Does ; Have ; Are | — | — | — |
| g2u06.gi.have-to.gf.006 | gap-fill | ___ Dana have to do all the camp jobs every day? [en, 1 blank(s)] | Does (full) | Do ; Has ; Is | — | — | — |
| g2u06.gi.have-to.gs.001 | group-sort | camp rules: have to or don't have to? [en] | — | — | — | You have to (it is a rule): wear a life jacket in the canoe, wear a hard hat to build a tree house, be at the gate at 8 a.m., read the camp guide \| You don't have to (not a rule): wash up after dinner, do all the camp jobs, bring food, come canoeing with us | — |
| g2u06.gi.have-to.mc.001 | multiple-choice | It is a camp rule: every child wears a life jacket in the canoe. [en] | She has to wear a life jacket. (full) | She have to wear a life jacket. ; She has wear a life jacket. ; She haves to wear a life jacket. | — | — | — |
| g2u06.gi.have-to.mc.002 | multiple-choice | At this camp the guides wash up, so it isn't your job. [en] | You don't have to wash up. (full) | You haven't to wash up. ; You hasn't to wash up. ; You don't have wash up. | — | — | — |
| g2u06.gi.have-to.mt.001 | matching | camp jobs: which rule fits? [en] | — | — | You are going out in a canoe. ↔ You have to wear a life jacket. ; The guides do the washing up. ↔ You don't have to wash up. ; You are building a tree house. ↔ You have to wear a hard hat. ; The camp food is free for you. ↔ You don't have to bring food. | — | — |
| g2u06.gi.have-to.qf.001 | question-formation | She has to wear a life jacket. Ask about the rule. [en] | Does she have to wear a life jacket? (full) | — | — | — | — |
| g2u06.gi.have-to.qf.002 | question-formation | You want the camp rules for tonight. Ask your guide: you / get up early tomorrow. [en] | Do we have to get up early tomorrow? (full) ; Do I have to get up early tomorrow? (full) | — | — | — | — |
| g2u06.gi.have-to.sb.001 | sentence-building | to / have / you / a life jacket / wear [en] | You have to wear a life jacket. (full) ; You have to wear a life jacket (full) | has ; must | — | — | — |
| g2u06.gi.have-to.sb.002 | sentence-building | to / has / she / early / get up [en] | She has to get up early. (full) ; She has to get up early (full) | have ; must | — | — | — |
| g2u06.gi.have-to.sb.003 | sentence-building | have / does / to / she / a hard hat / wear [en] | Does she have to wear a hard hat? (full) ; Does she have to wear a hard hat (full) | do ; has | — | — | — |
| g2u06.gi.have-to.tf.001 | transformation | Your friend doesn't want to do the camp jobs. Tell her: 'You ___ (not / wash up) — the guides do it.' [en, 1 blank(s)] | don't have to wash up (full) ; do not have to wash up (full) | — | — | — | — |
| g2u06.gi.have-to.tf.002 | transformation | A new girl asks about the camp rules. Tell her: 'You ___ (wear) a life jacket in the canoe.' [en, 1 blank(s)] | have to wear (full) | — | — | — | — |
| g2u06.gi.have-to.tf.003 | transformation | Tell the new boy about Dana: 'She ___ (get up) early because the canoe group leaves at 7.' [en, 1 blank(s)] | has to get up (full) | — | — | — | — |
| g2u06.gi.have-to.tr.001 | translation | Du musst eine Schwimmweste im Kanu tragen. [de] | You have to wear a life jacket in the canoe. (full) ; You have to wear a life jacket in the canoe (full) | — | — | — | — |
| g2u06.gi.have-to.tr.002 | translation | Du musst nicht abwaschen. Die Anleiter machen das. [de] | You don't have to wash up. The guides do it. (full) ; You don't have to wash up. The guides do it (full) ; You do not have to wash up. The guides do it. (full) ; You don't have to wash up. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u06/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u06",
  "lens": "level-gloss",
  "itemsHash": "294d10cc9c5d",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 79, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
