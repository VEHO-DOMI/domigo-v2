# Verify lens — level-gloss — g2-u11 (round 2)

<!-- domigo:verify level-gloss g2-u11 items=0d6edd9ab760 prompt=aefb997bf664 round=2 -->

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
- **g2-u11**: wardrobe, bed, bedside table, carpet, fridge, cooker, curtain, sink, cupboard, table, chair, sofa, armchair, lamp, radiator, rug, roof, wall, window, staircase, cellar, trailer (American English), tree house, stilts, reed, island, ground, ours, theirs, mine, hers, his, yours, furniture, whose, American, cellar, Central Asia, electricity, to float, moveable, underneath, to transport, hammock, cotton, leather, material, metal, pattern, plain, plastic, pond, seat, spotted, strap, striped

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Albu, Alison, Alphabet, Alps, America, Americans, Amherst, Anderson, Andrew, Andy, Anger, Annie, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Asia, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Claire, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, East, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Hanna, Hannah, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homes, Homework, Hook, Hoople, Hotel, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Mott, Mr, Mrs, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Ola, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Rick, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salzburg, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Square, States, Station, Steve, Sue, Sunborn, Susan, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (56)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u11.w.american | A man or woman from America is ___. | My mum is from America, so she is ___. | Mongolian ; moveable ; plain | Mongolian ; moveable ; plain ; striped ; spotted | — |
| g2u11.w.armchair | Grandpa likes to read in this big comfortable seat for just one. | Grandpa sits down in his big comfortable ___ and reads the newspaper. | sofa ; chair ; bed | sofa ; chair ; bed ; table ; cupboard | — |
| g2u11.w.bed | At night you lie down on this and close your eyes. | I go to ___ at nine o'clock every night. | chair ; sofa ; table | chair ; sofa ; table ; armchair ; rug | — |
| g2u11.w.bedside-table | This small thing is next to where you lie down at night, for your lamp. | I put my book and my lamp on the ___ next to my bed. | wardrobe ; cupboard ; radiator | wardrobe ; cupboard ; radiator ; sink ; sofa | — |
| g2u11.w.carpet | This big thing covers the ground of a room, and you walk on it. | There is a big red ___ on the ground in my living room. | rug ; lamp ; curtain | rug ; lamp ; curtain ; sofa ; armchair | — |
| g2u11.w.cellar | This dark room is under a building. | We keep old boxes down in the dark ___ under the building. | roof ; staircase ; wall | roof ; staircase ; wall ; window ; garden | old (= alt) |
| g2u11.w.cellar-2 | This dark room is underneath a building. | There is a big ___ underneath our building, and it is dark and cold down there. | staircase ; roof ; ground | staircase ; roof ; ground ; wall ; window | — |
| g2u11.w.central-asia | This is a big area in the middle of the biggest land. | The Mongolian people in ___ move their homes a lot. | America ; Mongolian ; ground | America ; Mongolian ; ground ; island ; pond | move (= ziehen, umziehen) ; lot (= (a lot = viel, oft)) |
| g2u11.w.chair | You sit down on this thing, and it has a back and four legs. | Sit down on this ___ and have your dinner. | table ; bed ; sofa | table ; bed ; sofa ; armchair ; lamp | — |
| g2u11.w.cooker | You make your hot dinner on this thing in the kitchen. | Mum makes hot food on the ___ in the kitchen. | fridge ; sink ; table | fridge ; sink ; table ; cupboard ; radiator | — |
| g2u11.w.cotton | This white material is good for shirts and shoes. | My white shirt is made of ___, so it is good in hot weather. | leather ; metal ; plastic | leather ; metal ; plastic ; material ; reed | made (= gemacht (made of = aus)) |
| g2u11.w.cupboard | This thing in the kitchen has doors, and you keep plates and glasses in it. | We keep the plates and glasses in this ___ in the kitchen. | wardrobe ; fridge ; sink | wardrobe ; fridge ; sink ; cooker ; bedside table | — |
| g2u11.w.curtain | You pull this in front of the window to keep the light out. | Close the ___ so the sun is not in my eyes. | carpet ; lamp ; window | carpet ; lamp ; window ; rug ; wall | — |
| g2u11.w.electricity | This power makes your lights and your fridge work. | We had no ___ in the storm, so the lights and the fridge did not work. | material ; furniture ; pattern | material ; furniture ; pattern ; metal ; ground | — |
| g2u11.w.fridge | This cold machine in the kitchen keeps your food cold. | We keep the milk and the cheese cold in the ___. | cooker ; sink ; cupboard | cooker ; sink ; cupboard ; wardrobe ; radiator | — |
| g2u11.w.furniture | A sofa, a table, beds and chairs are all ___. | In our building, there is a lot of ___: a sofa, a table and chairs. | material ; electricity ; pattern | material ; electricity ; pattern ; ground ; seat | — |
| g2u11.w.ground | This is what you walk on when you are outside. | Some homes are high up on stilts, not on the ___. | roof ; island ; wall | roof ; island ; wall ; reed ; stilts | — |
| g2u11.w.hammock | You hang this up and lie in it in the garden. | I have a new ___. I like to lie in it in the garden. | sofa ; armchair ; bed | sofa ; armchair ; bed ; rug ; seat | hang (= hängen) |
| g2u11.w.hers | A thing that is a girl's or a woman's. | This is not my jacket. It is Mum's, so it is ___. | his ; mine ; yours | his ; mine ; yours ; ours ; theirs | — |
| g2u11.w.his | A thing that is a boy's or a man's. | Tom has a green cap. This green cap is ___. | hers ; theirs ; ours | hers ; theirs ; ours ; mine ; yours | — |
| g2u11.w.island | This is land with water all around it. | There is a small ___ in the middle of the lake. | ground ; reed ; stilts | ground ; reed ; stilts ; trailer ; pond | water (= Wasser) ; around (= rundherum) |
| g2u11.w.lamp | When it is dark, you put this on and it gives you light. | Put the ___ on so I can read my book in the dark. | radiator ; curtain ; sink | radiator ; curtain ; sink ; carpet ; window | — |
| g2u11.w.leather | This material is from animal skin, and we make shoes from it. | She does not wear ___ shoes because she wants to help animals. | cotton ; metal ; plastic | cotton ; metal ; plastic ; material ; reed | animal (= Tier) |
| g2u11.w.material | This is what a thing is made of, like cotton or metal. | What ___ is your school bag made of: cotton, metal or plastic? | pattern ; furniture ; electricity | pattern ; furniture ; electricity ; metal ; seat | made (= gemacht (made of = aus)) |
| g2u11.w.metal | Keys and a fridge are this heavy, cold material. | My keys and the fridge are this cold, heavy ___. | plastic ; leather ; cotton | plastic ; leather ; cotton ; material ; reed | — |
| g2u11.w.mine | It is my thing. | This pen is my pen, so it is ___. | yours ; hers ; his | yours ; hers ; his ; ours ; theirs | — |
| g2u11.w.moveable | When a thing is ___, you can move it from place to place. | The desk has wheels, so you can move it. It is very ___. | plain ; heavy ; American | plain ; heavy ; American ; striped ; spotted | move (= bewegen) ; wheels (= Räder) |
| g2u11.w.ours | A thing that is for us. | This is the dog of our family, so it is ___. | theirs ; yours ; mine | theirs ; yours ; mine ; hers ; his | — |
| g2u11.w.pattern | This is the spots, the stripes or the shapes on a thing. | My new dress has a ___ of red spots on it. | material ; metal ; seat | material ; metal ; seat ; furniture ; electricity | stripes (= Streifen) ; shapes (= Formen) |
| g2u11.w.plain | It has nothing on it — no spots and no stripes. | It is ___ white, with no spots and no stripes on it. | striped ; spotted ; moveable | striped ; spotted ; moveable ; American ; leather | stripes (= Streifen) |
| g2u11.w.plastic | Many bottles are this light material, and so are lots of toys. | This bottle is light because it is made of ___. | metal ; leather ; cotton | metal ; leather ; cotton ; material ; reed | toys (= Spielsachen) ; made (= gemacht (made of = aus)) |
| g2u11.w.pond | Frogs live in this small water in a garden, smaller than a lake. | There are frogs in the small ___ in our garden. | island ; ground ; reed | island ; ground ; reed ; stilts ; pattern | frogs (= Frösche) ; water (= Wasser) |
| g2u11.w.radiator | This metal thing on the wall makes your room hot in the cold days. | My room is hot because the ___ on the wall is on. | lamp ; fridge ; window | lamp ; fridge ; window ; cooker ; sink | — |
| g2u11.w.reed | The Uros people make their homes from this tall, strong grass. | Fifty homes of ___ float on the lake. | stilts ; island ; ground | stilts ; island ; ground ; trailer ; tree house | grass (= Gras) |
| g2u11.w.roof | The ___ of a building keeps out the rain. | Our building has a ___, walls, windows and doors. | wall ; window ; staircase | wall ; window ; staircase ; cellar ; ground | rain (= Regen) |
| g2u11.w.rug | This small thing on the ground is smaller than a carpet, and you walk on it. | There is a small ___ on the ground in front of my bed. | carpet ; curtain ; lamp | carpet ; curtain ; lamp ; sofa ; cupboard | — |
| g2u11.w.seat | This is a place where you sit down, like a chair. | There is one free ___ next to me on the sofa. | pond ; ground ; pattern | pond ; ground ; pattern ; material ; reed | — |
| g2u11.w.sink | The place in the kitchen where you wash the plates and glasses. | We wash the dirty plates and glasses in the kitchen ___. | fridge ; cooker ; cupboard | fridge ; cooker ; cupboard ; wardrobe ; radiator | — |
| g2u11.w.sofa | A long seat for two or three people in the living room. | My family sits down on the big ___ to watch a film in the living room. | armchair ; chair ; bed | armchair ; chair ; bed ; table ; rug | — |
| g2u11.w.spotted | It has many small spots on it. | Her dress has small spots on it, so it is ___. | striped ; plain ; moveable | striped ; plain ; moveable ; American ; leather | — |
| g2u11.w.staircase | You go up and down these steps inside a building. | Go up the ___ to the bedrooms. | roof ; wall ; cellar | roof ; wall ; cellar ; window ; ground | steps (= Stufen) |
| g2u11.w.stilts | These are long, strong legs that hold homes up high over the ground. | Some homes are high up on ___, over the water. | reed ; ground ; island | reed ; ground ; island ; trailer ; tree house | water (= Wasser) |
| g2u11.w.strap | This holds your watch on you, and it can be leather, plastic or metal. | I've got a watch with a green ___. | pattern ; material ; seat | pattern ; material ; seat ; metal ; reed | — |
| g2u11.w.striped | It has long stripes on it. | His shirt has long stripes on it, so it is ___. | spotted ; plain ; moveable | spotted ; plain ; moveable ; American ; leather | stripes (= Streifen) |
| g2u11.w.table | This thing has four legs, and you eat your dinner at it. | We have our dinner at the ___ in the kitchen. | chair ; bed ; sofa | chair ; bed ; sofa ; armchair ; cupboard | — |
| g2u11.w.theirs | A thing that is for them. | These books are for Mum and Dad, so they are ___. | ours ; yours ; hers | ours ; yours ; hers ; mine ; his | — |
| g2u11.w.to-float | When a thing can ___, it stays on the water and does not go down. | Fifty islands of reed can ___ on the lake. | transport ; carry ; pull | transport ; carry ; pull ; give ; find | water (= Wasser) |
| g2u11.w.to-transport | To ___ a thing is to move it from one place to another. | They can ___ their homes to new places. | float ; pull ; burn | float ; carry ; pull ; give ; find | move (= bewegen) ; another (= ein anderer) |
| g2u11.w.trailer | A car can pull this small home on wheels along the road. | Some people live in a ___ with wheels and pull it from park to park with a car. | tree house ; island ; hammock | tree house ; island ; hammock ; stilts ; reed | home (= Zuhause) ; wheels (= Räder) |
| g2u11.w.tree-house | Children play up high in this small room over the ground. | We read our books up in our ___ in the big tree. | trailer ; island ; hammock | trailer ; island ; hammock ; stilts ; reed | — |
| g2u11.w.underneath | When a thing is under another thing, it is ___ it. | Our dog likes to lie ___ the table. | underground ; opposite ; behind | underground ; opposite ; behind ; along ; across | another (= ein anderes) |
| g2u11.w.wall | This is the side of a room, and you can put a picture on it. | There is a poster of my favourite singer on my bedroom ___. | roof ; window ; ground | roof ; window ; ground ; staircase ; cellar | side (= Seite) |
| g2u11.w.wardrobe | A big thing in your bedroom where you keep your clothes. | I keep all my clothes in the big ___ in my bedroom. | cupboard ; fridge ; curtain | cupboard ; fridge ; curtain ; armchair ; sink | — |
| g2u11.w.whose | You ask this when you want to find who a thing is for. | ___ pen is this? Is it yours or mine? | mine ; yours ; ours | mine ; yours ; ours ; hers ; theirs | — |
| g2u11.w.window | You look out of this to look at the garden. | Open the ___, please. It is too hot in here. | wall ; roof ; curtain | wall ; roof ; curtain ; staircase ; cellar | — |
| g2u11.w.yours | A thing that is for you, not for me. | This book is for you, so it is ___. | mine ; ours ; theirs | mine ; ours ; theirs ; hers ; his | — |

## Grammar items (68)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u11.gi.possessive-pronouns.ag.001 | anagram | Es gehört mir. [de] | mine (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.ag.002 | anagram | Es gehört uns. [de] | ours (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.cp.001 | context-picker | Nick shares his room. He points to one bed for him and one bed for his sister. [en] | This is my bed, and that's hers. (full) | This is my bed, and that's her. ; This is my bed, and that's her bed hers. ; This is mine bed, and that's hers. | — | — | — |
| g2u11.gi.possessive-pronouns.cp.002 | context-picker | A camp guide holds up some books for Fred and Hannah. The books are for them. [en] | They're ours. (full) | They're our. ; They're ours books. ; They're our's. | — | — | — |
| g2u11.gi.possessive-pronouns.ec.001 | error-correction | This is mine pen. [en] | This is my pen. (full) ; my (partial) | — | — | — | — |
| g2u11.gi.possessive-pronouns.ec.002 | error-correction | This skateboard is her's. [en] | This skateboard is hers. (full) ; hers (partial) | — | — | — | — |
| g2u11.gi.possessive-pronouns.ec.003 | error-correction | That tablet is my, not your. [en] | That tablet is mine, not yours. (full) ; mine, not yours (partial) | — | — | — | — |
| g2u11.gi.possessive-pronouns.gf.001 | gap-fill | Is this your pen? — Yes, it's ___. [en, 1 blank(s)] | mine (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.gf.002 | gap-fill | That's not my rug. It's ___. [en, 1 blank(s)] | yours (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.gf.003 | gap-fill | Whose is it? Is it Mike's? — No, it isn't ___. Ask Lucy. [en, 1 blank(s)] | his (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.gf.004 | gap-fill | These books aren't mine. Whose is it? Is it Sue's? — Yes, it's ___. [en, 1 blank(s)] | hers (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.gf.005 | gap-fill | Mike and Sam have got books. We can't find ours, so can we borrow ___? [en, 1 blank(s)] | theirs (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.gf.006 | gap-fill | I like your painting, but I think ___ is nicer. We painted it. [en, 1 blank(s)] | ours (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.gs.001 | group-sort | my / mine / your / yours / our / ours / their / theirs [en] | — | — | — | my bed, your bed …: my, your, our, their \| It's mine, It's yours …: mine, yours, ours, theirs | — |
| g2u11.gi.possessive-pronouns.mc.001 | multiple-choice | This sofa is for me. — This sofa is ___. [en, 1 blank(s)] | mine (full) | my ; me ; I | — | — | — |
| g2u11.gi.possessive-pronouns.mc.002 | multiple-choice | This lamp is for me. [en] | This lamp is mine. (full) | This lamp is my. ; This is mine lamp. ; This lamp is mine's. | — | — | — |
| g2u11.gi.possessive-pronouns.mc.003 | multiple-choice | You ask if a pencil case is for you or for her. [en] | Is that pencil case yours or hers? (full) | Is that pencil case your or her? ; Is that pencil case yours or her's? ; Is that pencil case your's or hers? | — | — | — |
| g2u11.gi.possessive-pronouns.mp.001 | matching-pairs | my and mine, your and yours … [en] | — | — | my ↔ mine ; your ↔ yours ; his ↔ his ; her ↔ hers ; our ↔ ours ; their ↔ theirs | — | — |
| g2u11.gi.possessive-pronouns.qf.001 | question-formation | is / this / yours / ? [en] | Is this yours? (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.sb.001 | sentence-building | yours / is / or / this / mine / ? [en] | Is this yours or mine? (full) ; Is this mine or yours? (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.tf.001 | transformation | It's my rug. → This rug is ___. [en, 1 blank(s)] | This rug is mine. (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.tf.002 | transformation | Those are their trainers. → Are those ___? [en, 1 blank(s)] | Are those theirs? (full) | — | — | — | — |
| g2u11.gi.possessive-pronouns.tr.001 | translation | Dieses Bett gehört mir. [de] | This bed is mine. (full) ; This is my bed. (partial) | — | — | — | — |
| g2u11.gi.possessive-pronouns.tr.002 | translation | Ist dieser Rucksack deiner oder ihrer? [de] | Is this backpack yours or hers? (full) ; Is that backpack yours or hers? (full) | — | — | — | — |
| g2u11.gi.possessive-s.ag.001 | anagram | Es ist Mikes. (Antwort auf "Whose is it?") [de] | Mike's (full) | — | — | — | — |
| g2u11.gi.possessive-s.cp.001 | context-picker | Mum finds a school bag on the sofa. It is for your sister. [en] | It's my sister's. (full) | It's my sisters. ; It's my sister. ; It's my sisters'. | — | — | — |
| g2u11.gi.possessive-s.ec.001 | error-correction | This is my sisters bed. [en] | This is my sister's bed. (full) ; sister's (partial) | — | — | — | — |
| g2u11.gi.possessive-s.ec.002 | error-correction | The girls share a room. The girls room is very big. [en] | The girls' room is very big. (full) ; girls' (partial) | — | — | — | — |
| g2u11.gi.possessive-s.ec.003 | error-correction | The childrens room is here. [en] | The children's room is here. (full) ; children's (partial) | — | — | — | — |
| g2u11.gi.possessive-s.ff.001 | free-form | You find a hat. It is for Sam. Whose is it? [en] | It's Sam's. (full) ; It's Sam's hat. (full) ; This is Sam's hat. (partial) ; That's Sam's. (partial) ; Sam's. (partial) | — | — | — | — |
| g2u11.gi.possessive-s.gf.001 | gap-fill | Whose school bag is this? — It's ___. (Joanna) [en, 1 blank(s)] | Joanna's (full) | — | — | — | — |
| g2u11.gi.possessive-s.gf.002 | gap-fill | This is ___ bed. (my sister) [en, 1 blank(s)] | my sister's (full) ; sister's (partial) | — | — | — | — |
| g2u11.gi.possessive-s.gf.003 | gap-fill | Those are ___ trainers. (Mike) [en, 1 blank(s)] | Mike's (full) | — | — | — | — |
| g2u11.gi.possessive-s.gf.004 | gap-fill | This is my ___ room. (parents) [en, 1 blank(s)] | parents' (full) | — | — | — | — |
| g2u11.gi.possessive-s.gf.005 | gap-fill | It's our ___ dog. (neighbours) [en, 1 blank(s)] | neighbours' (full) | — | — | — | — |
| g2u11.gi.possessive-s.gf.006 | gap-fill | That's the ___ school. (children) [en, 1 blank(s)] | children's (full) | — | — | — | — |
| g2u11.gi.possessive-s.gs.001 | group-sort | my sister / Mike / my parents / the boys / the children / the men / the girls / our neighbours [en] | — | — | — | like sister's, Mike's: my sister, Mike, the children, the men \| like parents', boys': my parents, the boys, the girls, our neighbours | — |
| g2u11.gi.possessive-s.mc.001 | multiple-choice | My sister has got a new lamp. [en] | My sister's lamp is new. (full) | My sisters lamp is new. ; My sister lamp is new. ; My sisters' lamp is new. | — | — | — |
| g2u11.gi.possessive-s.mc.003 | multiple-choice | The women have got a room at school. [en] | The women's room is here. (full) | The womens room is here. ; The womens' room is here. ; The woman's room is here. | — | — | — |
| g2u11.gi.possessive-s.mc.005 | multiple-choice | Three boys share one room. [en] | The boys' room is very big. (full) | The boy's room is very big. ; The boys room's is very big. ; The boys' room are very big. | — | — | — |
| g2u11.gi.possessive-s.mt.001 | matching | the owner and the desk [en] | — | — | the teacher (one) ↔ the teacher's desk ; the teachers (two) ↔ the teachers' desk ; the children ↔ the children's desk ; my friend ↔ my friend's desk ; the men ↔ the men's desk | — | — |
| g2u11.gi.possessive-s.qf.001 | question-formation | the book / whose / is / it / ? [en] | Whose book is it? (full) | — | — | — | — |
| g2u11.gi.possessive-s.sb.001 | sentence-building | is / where / dad's / my / chair / ? [en] | Where is my dad's chair? (full) | — | — | — | — |
| g2u11.gi.possessive-s.tf.001 | transformation | the chair of my friend → [en] | my friend's chair (full) ; friend's chair (partial) | — | — | — | — |
| g2u11.gi.possessive-s.tf.002 | transformation | the room of the boys → [en] | the boys' room (full) ; boys' room (partial) | — | — | — | — |
| g2u11.gi.possessive-s.tr.001 | translation | Sams Bett ist neu. [de] | Sam's bed is new. (full) | — | — | — | — |
| g2u11.gi.possessive-s.tr.002 | translation | Das ist das Zimmer der Kinder. [de] | This is the children's room. (full) ; It's the children's room. (partial) | — | — | — | — |
| g2u11.gi.who-whose.ag.002 | anagram | Mit diesem Wort fragst du, wem etwas gehört. [de] | whose (full) | — | — | — | — |
| g2u11.gi.who-whose.cp.001 | context-picker | Robert's bed is in pieces. He can't find out who did it. [en] | Who broke my bed? (full) | Who did break my bed? ; Whose broke my bed? ; Who does break my bed? | — | — | — |
| g2u11.gi.who-whose.ec.001 | error-correction | Who does want ice cream? [en] | Who wants ice cream? (full) ; wants (partial) | — | — | — | — |
| g2u11.gi.who-whose.ec.002 | error-correction | Who's chair is that? [en] | Whose chair is that? (full) ; Whose (partial) | — | — | — | — |
| g2u11.gi.who-whose.ec.003 | error-correction | Who did break the lamp? [en] | Who broke the lamp? (full) ; broke (partial) | — | — | — | — |
| g2u11.gi.who-whose.gf.001 | gap-fill | ___ is your best friend? [en, 1 blank(s)] | Who (full) | — | — | — | — |
| g2u11.gi.who-whose.gf.002 | gap-fill | ___ lamp is this? [en, 1 blank(s)] | Whose (full) | — | — | — | — |
| g2u11.gi.who-whose.gf.003 | gap-fill | ___ has got a sofa in their bedroom? [en, 1 blank(s)] | Who (full) | — | — | — | — |
| g2u11.gi.who-whose.gf.004 | gap-fill | ___ trainers are those? [en, 1 blank(s)] | Whose (full) | — | — | — | — |
| g2u11.gi.who-whose.gf.005 | gap-fill | ___ broke your bed? [en, 1 blank(s)] | Who (full) | — | — | — | — |
| g2u11.gi.who-whose.gs.001 | group-sort | who did it, or whose it is [en] | — | — | — | Who did it?: Who broke the bed?, Who wants a hammock?, Who cleaned the room? \| Whose is it?: Whose lamp is this?, Whose trainers are those?, Whose is this? | — |
| g2u11.gi.who-whose.mc.001 | multiple-choice | ___ wants an ice cream machine? [en, 1 blank(s)] | Who (full) | Who does ; Whose ; Who do | — | — | — |
| g2u11.gi.who-whose.mc.002 | multiple-choice | You want to ask who lives here. [en] | Who lives here? (full) | Who does live here? ; Who do lives here? ; Whose lives here? | — | — | — |
| g2u11.gi.who-whose.mc.003 | multiple-choice | You want to ask whose chair this is. [en] | Whose chair is this? (full) | Who's chair is this? ; Who chair is this? ; Whose is chair this? | — | — | — |
| g2u11.gi.who-whose.mt.002 | matching | Who or Whose, and the ending [en] | — | — | Who broke the bed? ↔ Tom did. ; Whose trainers are those? ↔ They're Mike's. ; Who wants this lamp? ↔ I do. ; Whose room is this? ↔ It's my sister's. | — | — |
| g2u11.gi.who-whose.qf.001 | question-formation | the / painted / who / wall / ? [en] | Who painted the wall? (full) | — | — | — | — |
| g2u11.gi.who-whose.qf.002 | question-formation | Mike put the lamp on the sofa. → Ask who. [en] | Who put the lamp on the sofa? (full) | — | — | — | — |
| g2u11.gi.who-whose.sb.001 | sentence-building | is / whose / this / pen / ? [en] | Whose pen is this? (full) | — | — | — | — |
| g2u11.gi.who-whose.tf.001 | transformation | Lucy cleaned the kitchen. → Who ___? [en, 1 blank(s)] | Who cleaned the kitchen? (full) | — | — | — | — |
| g2u11.gi.who-whose.tr.001 | translation | Wessen Hund ist das? [de] | Whose dog is that? (full) ; Whose dog is this? (full) | — | — | — | — |
| g2u11.gi.who-whose.tr.002 | translation | Wer hat die Vorhänge gewaschen? [de] | Who washed the curtains? (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u11/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u11",
  "lens": "level-gloss",
  "itemsHash": "0d6edd9ab760",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 124, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
