# Verify lens — level-gloss — g2-u12 (round 2)

<!-- domigo:verify level-gloss g2-u12 items=126cf838c1fb prompt=aefb997bf664 round=2 -->

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
- **g2-u12**: headache, toothache, earache, stomach ache, pain in ankle, knee, backache, throat, bath, medicine, memory, patient, spoon, blood, lamp post, cure, to cure, dentist, to mash, to mix, taste, toothpaste, worm, smell, first aid, helpful, horrible, pupil, since, Believe me!, to injure, It doesn't matter., writer

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, America, Americans, Amherst, Ancient, Anderson, Andrew, Andy, Anger, Annie, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Asia, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Claire, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, East, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, European, Every, Excuse, Expressing, False, Faye, Feeling, Fido, Food, France, Frank, Fred, Freddy, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harry, Help, Henry, High, Hill, Hmm, Hollywood, Holmes, Homes, Homework, Hook, Hoople, Hotel, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Mott, Mr, Mrs, Ms, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Ola, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Rick, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salma, Salzburg, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Square, States, Station, Steve, Sue, Sunborn, Susan, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (33)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u12.w.backache | you have this when your back hurts | My back hurts when I stand up. I have got ___. | headache ; stomach ache ; toothache | headache ; stomach ache ; toothache ; earache ; throat | — |
| g2u12.w.bath | you wash in this when you are dirty | I have to give my dog a ___. She is very dirty. | spoon ; medicine ; memory | spoon ; medicine ; memory ; toothpaste ; blood | — |
| g2u12.w.believe-me | you said this when you want people to think a thing is true | It is true! ___ I am not telling a lie. | It doesn't matter. ; Calm down! ; Poor you! | It doesn't matter. ; Calm down! ; Poor you! ; What a shame! ; I promise. | — |
| g2u12.w.blood | this red wet thing is inside you | There is ___ on your shirt. It is all red. | taste ; smell ; medicine | taste ; smell ; medicine ; cure ; memory | — |
| g2u12.w.cure | a thing that makes you well again when you are ill | In Ancient Egypt, a dead mouse was a ___ for toothache. | smell ; taste ; memory | smell ; taste ; memory ; blood ; spoon | — |
| g2u12.w.dentist | the doctor who looks after your teeth | I want to become a ___. | patient ; writer ; pupil | patient ; writer ; pupil ; worm ; spoon | — |
| g2u12.w.earache | you have this when your ear hurts | My ear hurts, so I have got ___. | headache ; toothache ; backache | headache ; toothache ; backache ; stomach ache ; throat | — |
| g2u12.w.first-aid | the help you give somebody who is hurt, before the doctor is there | We have ___ classes at school. | medicine ; toothpaste ; bath | medicine ; toothpaste ; bath ; cure ; spoon | — |
| g2u12.w.headache | you have this when your head hurts | My head hurts. I have got a bad ___. | toothache ; earache ; backache | toothache ; earache ; backache ; stomach ache ; throat | — |
| g2u12.w.helpful | always happy to help people | She has always been a great and ___ friend. | horrible ; dead ; alive | horrible ; dead ; alive ; ill ; sick | — |
| g2u12.w.horrible | very bad and not nice at all | The accident was ___! | helpful ; dead ; alive | helpful ; dead ; alive ; ill ; sick | — |
| g2u12.w.it-doesn-t-matter | you said this to tell somebody a thing is not bad | I have lost your pen. - ___ I have one more for you. | Believe me! ; Calm down! ; Poor you! | Believe me! ; Calm down! ; Poor you! ; What a shame! ; I promise. | — |
| g2u12.w.knee | the middle of your leg that you go down on | Jacob has hurt his ___ in the middle of his leg, so he cannot play football. | throat ; shoulder ; ear | throat ; shoulder ; ear ; nose ; mouth | — |
| g2u12.w.lamp-post | a tall thing in the street with a light on it | He has just run into a ___ in the street. | spoon ; toothpaste ; bath | spoon ; toothpaste ; bath ; blood ; medicine | — |
| g2u12.w.medicine | you have this when you are ill and it makes you well again | The doctor gives me ___ when I am ill. | bath ; spoon ; toothpaste | bath ; spoon ; toothpaste ; blood ; worm | — |
| g2u12.w.memory | what you keep in your head, so you can bring days and people back | Grandma has a very good ___. She can keep lots of birthdays in her head. | medicine ; taste ; smell | medicine ; taste ; smell ; cure ; bath | — |
| g2u12.w.pain-in-ankle | you have this when the bottom of your leg, just over your foot, hurts | Emily cannot stand on her foot. She has got ___. | backache ; headache ; toothache | backache ; headache ; toothache ; earache ; stomach ache | — |
| g2u12.w.patient | somebody who is ill and that a doctor looks after | The doctor looks after every ___ at the hospital. | dentist ; writer ; pupil | dentist ; writer ; pupil ; worm ; spoon | — |
| g2u12.w.pupil | a child at school | Every ___ in our class does a text in front of the teacher. | writer ; dentist ; patient | writer ; dentist ; patient ; worm ; spoon | — |
| g2u12.w.since | from a time in the past up to now | I have been in hospital ___ last week. | helpful ; horrible ; writer | helpful ; horrible ; writer ; dead ; alive | — |
| g2u12.w.smell | what your nose finds; bad fish has a really bad one | The ___ of fish was really bad. | taste ; memory ; cure | taste ; memory ; cure ; blood ; medicine | — |
| g2u12.w.spoon | you eat your soup with this, not with a knife | I need a ___ to eat my soup. | bath ; lamp post ; toothpaste | bath ; lamp post ; toothpaste ; medicine ; blood | — |
| g2u12.w.stomach-ache | you have this when you eat too much and the middle of you hurts | Jacob has eaten too much cake, so now he has ___. | headache ; backache ; toothache | headache ; backache ; toothache ; earache ; throat | — |
| g2u12.w.taste | what a food or drink is like in your mouth, good or bad | The ___ was very good. | smell ; memory ; cure | smell ; memory ; cure ; blood ; medicine | — |
| g2u12.w.throat | the inside place that food and drink go down after your mouth | My ___ hurts when I drink cold milk. | knee ; shoulder ; nose | knee ; shoulder ; nose ; ear ; finger | — |
| g2u12.w.to-cure | to make somebody well again when they are ill | Long ago, people said worms could ___ stomach ache. | mash ; mix ; injure | mash ; mix ; injure ; smell ; taste | — |
| g2u12.w.to-injure | to hurt your arm, leg or knee in an accident | I do not want to ___ my knee again. | mix ; mash ; cure | mix ; mash ; cure ; smell ; taste | — |
| g2u12.w.to-mash | to push food down so it is not in pieces | They ___ a dead mouse and mixed it with food. | mix ; cure ; injure | mix ; cure ; injure ; smell ; taste | — |
| g2u12.w.to-mix | to put a food and a drink into one so they become one thing | I ___ the medicine into the food, so the dog eats it. | mash ; cure ; injure | mash ; cure ; injure ; smell ; taste | — |
| g2u12.w.toothache | you have this when one of your teeth hurts | One of my teeth hurts, so I have got ___. | headache ; earache ; stomach ache | headache ; earache ; stomach ache ; backache ; throat | — |
| g2u12.w.toothpaste | you clean your teeth with this every morning and night | In Ancient Rome, people did not have ___. | medicine ; spoon ; bath | medicine ; spoon ; bath ; blood ; cure | — |
| g2u12.w.worm | a long thing with no legs that lives in the ground | A ___ lives under the ground. | spoon ; dentist ; patient | spoon ; dentist ; patient ; writer ; pupil | — |
| g2u12.w.writer | somebody who makes books and stories for people to read | My favourite ___ has a new book out this week. | pupil ; dentist ; patient | pupil ; dentist ; patient ; worm ; spoon | — |

## Grammar items (30)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u12.gi.present-perfect.ag.001 | anagram | Englisch für 'gebrochen' (sie hat sich den Arm ...): [de] | broken (full) | — | — | — | — |
| g2u12.gi.present-perfect.ag.002 | anagram | Englisch für 'geschrieben' (er hat einen Brief ...): [de] | written (full) | — | — | — | — |
| g2u12.gi.present-perfect.cp.001 | context-picker | Your friend is holding his knee and crying. What do you tell the teacher? [en] | He has hurt his knee. (full) | He has hurted his knee. ; He have hurt his knee. ; He hurt his knee yesterday. | — | — | — |
| g2u12.gi.present-perfect.cp.002 | context-picker | There is blood on your friend's shirt. He is holding his finger. [en] | I've just hurt my finger. (full) | I've just hurted my finger. ; I just have hurt my finger. ; I has just hurt my finger. | — | — | — |
| g2u12.gi.present-perfect.ec.001 | error-correction | She have just made a cake. [en] | She has just made a cake. (full) ; She's just made a cake. (full) ; has (partial) | — | — | — | — |
| g2u12.gi.present-perfect.ec.002 | error-correction | He has writed a letter to his grandma. [en] | He has written a letter to his grandma. (full) ; He's written a letter to his grandma. (full) ; written (partial) | — | — | — | — |
| g2u12.gi.present-perfect.ec.003 | error-correction | David has fallen and he broken his arm. [en] | David has fallen and he has broken his arm. (full) ; David has fallen and he's broken his arm. (full) ; he has broken his arm (partial) | — | — | — | — |
| g2u12.gi.present-perfect.ff.001 | free-form | Your knee hurts and you want the doctor. What do you tell the teacher? [en] | I've hurt my knee. (full) ; I have hurt my knee. (full) ; I've just hurt my knee. (full) ; I have just hurt my knee. (full) ; I've hurt my leg. (partial) ; I have hurt my leg. (partial) | — | — | — | — |
| g2u12.gi.present-perfect.gf.001 | gap-fill | I ___ just hurt my knee. [en, 1 blank(s)] | have (full) | — | — | — | — |
| g2u12.gi.present-perfect.gf.002 | gap-fill | She ___ just broken her arm. [en, 1 blank(s)] | has (full) | — | — | — | — |
| g2u12.gi.present-perfect.gf.003 | gap-fill | They ___ gone to the dentist. [en, 1 blank(s)] | have (full) | — | — | — | — |
| g2u12.gi.present-perfect.gf.004 | gap-fill | The dog has ___ all the cake! (eat) [en, 1 blank(s)] | eaten (full) | — | — | — | — |
| g2u12.gi.present-perfect.gf.005 | gap-fill | She has just ___ a letter to her grandma. (write) [en, 1 blank(s)] | written (full) | — | — | — | — |
| g2u12.gi.present-perfect.gf.006 | gap-fill | Call a doctor! David ___ ___ his leg. (break) [en, 2 blank(s)] | has \| broken (full) | — | — | — | — |
| g2u12.gi.present-perfect.gs.001 | group-sort | broken / break / eaten / eat / written / write / gone / go [en] | — | — | — | after have/has: broken, eaten, written, gone \| not after have/has: break, eat, write, go | — |
| g2u12.gi.present-perfect.mc.001 | multiple-choice | Your mum made a cake just now. [en] | She has just made a cake. (full) | She has just maked a cake. ; She have just made a cake. ; She just has made a cake. | — | — | — |
| g2u12.gi.present-perfect.mc.002 | multiple-choice | You can't find your keys. [en] | I have lost my keys. (full) | I have losed my keys. ; I has lost my keys. ; I have lose my keys. | — | — | — |
| g2u12.gi.present-perfect.mp.001 | matching-pairs | I've hurt … / she has broken … / he has eaten … [en] | — | — | I've hurt ↔ my knee. ; She has broken ↔ her arm. ; They have gone ↔ to the dentist. ; He has eaten ↔ all the cake. ; I have lost ↔ my keys. | — | — |
| g2u12.gi.present-perfect.mt.001 | matching | break, eat, lose, write, find [en] | — | — | break ↔ broken ; eat ↔ eaten ; lose ↔ lost ; write ↔ written ; find ↔ found | — | — |
| g2u12.gi.present-perfect.mt.002 | matching | go, make, do, hurt, drop [en] | — | — | go ↔ gone ; make ↔ made ; do ↔ done ; hurt ↔ hurt ; drop ↔ dropped | — | — |
| g2u12.gi.present-perfect.qf.001 | question-formation | Your friend looks ill. Ask your friend about the dentist. [en] | Have you seen the dentist? (full) ; Have you been to the dentist? (full) | — | — | — | — |
| g2u12.gi.present-perfect.qf.002 | question-formation | Her head hurts. Ask about her and her medicine. [en] | Has she taken her medicine? (full) ; Has she had her medicine? (full) | — | — | — | — |
| g2u12.gi.present-perfect.sb.001 | sentence-building | just / has / her / she / arm / broken [en] | She has just broken her arm. (full) | — | — | — | — |
| g2u12.gi.present-perfect.sb.002 | sentence-building | have / I / eaten / much / just / too [en] | I have just eaten too much. (full) ; I've just eaten too much. (full) | — | — | — | — |
| g2u12.gi.present-perfect.sb.003 | sentence-building | you / the / Have / seen / doctor / ? [en] | Have you seen the doctor? (full) | — | — | — | — |
| g2u12.gi.present-perfect.tf.001 | transformation | Tom hurt his knee just now. Tell your friend: 'Tom ___ (just / hurt) his knee.' [en, 1 blank(s)] | has just hurt (full) | — | — | — | — |
| g2u12.gi.present-perfect.tf.002 | transformation | The children found a spoon just now: 'The children ___ (just / find) a spoon.' [en, 1 blank(s)] | have just found (full) | — | — | — | — |
| g2u12.gi.present-perfect.tr.001 | translation | Er hat sich gerade das Bein gebrochen. [de] | He has just broken his leg. (full) ; He's just broken his leg. (full) | — | — | — | — |
| g2u12.gi.present-perfect.tr.002 | translation | Ich habe gerade meine Schlüssel verloren. [de] | I have just lost my keys. (full) ; I've just lost my keys. (full) | — | — | — | — |
| g2u12.gi.present-perfect.tr.003 | translation | I have just eaten too much. [en] | Ich habe gerade zu viel gegessen. (full) ; Ich hab gerade zu viel gegessen. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u12/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u12",
  "lens": "level-gloss",
  "itemsHash": "126cf838c1fb",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 63, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
