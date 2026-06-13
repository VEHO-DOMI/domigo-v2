# Verify lens — level-gloss — g2-u09 (round 2)

<!-- domigo:verify level-gloss g2-u09 items=701ca1d81149 prompt=aefb997bf664 round=2 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Amherst, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, South, Square, States, Station, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (56)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u09.w.actor-actress | a man or woman who is in a play or a show | My favourite ___ is in a new show this summer. | singer ; guide ; teacher | singer ; guide ; teacher ; drummer ; waiter | — |
| g2u09.w.apple-juice | a drink that you make with green or red food from a tree | Can I have a glass of ___, please? | mineral water ; soup ; cheese | mineral water ; soup ; cheese ; milk ; tea | — |
| g2u09.w.beef | a kind of meat that you eat with chips and carrots | We had ___ with chips and carrots for our main course. | chicken ; lamb ; turkey | chicken ; lamb ; turkey ; ham ; fish | — |
| g2u09.w.cabbage | a big green vegetable with many leaves | We had turkey with potatoes and ___ for our main course. | onions ; peppers ; mushrooms | onions ; peppers ; mushrooms ; potato ; tomato | — |
| g2u09.w.certain | You really, really think it is true. | Are you ___ that today is a holiday? | happy ; tired ; hungry | happy ; tired ; hungry ; scared ; proud | — |
| g2u09.w.cheesecake | You eat this white food at the end of dinner, and it is really delicious. | I had a slice of ___ with strawberries after dinner. | pancakes ; pumpkin pie ; rice pudding | pancakes ; pumpkin pie ; rice pudding ; chocolate ice cream ; soup | — |
| g2u09.w.chef | the man or woman who cooks the food in a restaurant | The ___ cooked a delicious pizza in the kitchen. | waiter ; guide ; teacher | waiter ; guide ; teacher ; customer ; guest | — |
| g2u09.w.chicken | the white meat that you put in a soup or eat with rice | Mum is making ___ soup with carrots and rice for lunch. | beef ; lamb ; turkey | beef ; lamb ; turkey ; ham ; fish | — |
| g2u09.w.chocolate-ice-cream | a cold brown food that you eat after dinner | I always have ___ at the restaurant. It is cold and brown. | cheesecake ; pancakes ; rice pudding | cheesecake ; pancakes ; rice pudding ; pumpkin pie ; apple juice | — |
| g2u09.w.cloche | a cover for a plate that keeps the food hot in a restaurant | The waiter put the ___ over my food at the restaurant. | plate ; menu ; recipe | plate ; menu ; recipe ; box ; bottle | — |
| g2u09.w.completely | all of it, with nothing more | The room was ___ dark. | really ; usually ; always | really ; usually ; always ; sometimes ; straightaway | — |
| g2u09.w.consumer | a man or woman who pays money for food at the supermarket | When you pay money for your food at the supermarket, you are a ___. | waiter ; guest ; chef | waiter ; guest ; chef ; guide ; traveller | — |
| g2u09.w.crane | a very tall machine that can hold a heavy thing up high | A big ___ holds the restaurant platform high in the sky. | building ; ship ; train | building ; ship ; train ; platform ; statue | — |
| g2u09.w.delivery | when food or a new thing comes to your door | I am waiting for my pizza ___. | menu ; recipe ; ticket | menu ; recipe ; ticket ; letter ; refund | — |
| g2u09.w.fridge | the cold machine in the kitchen where you keep food | There's nothing in the ___. Let's go to the supermarket. | kitchen ; table ; drawer | kitchen ; table ; drawer ; box ; tank | — |
| g2u09.w.glasses | you wear these on your eyes when you want to read a book or look at the board | I need my ___ to read the board at school. | sunglasses ; hat ; shoes | sunglasses ; hat ; shoes ; hairband ; shirt | — |
| g2u09.w.grapes | small green or purple food; you eat a lot of them at once | I had some green ___ with my lunch. They were small and very nice. | plums ; olives ; peppers | plums ; olives ; peppers ; pears ; peaches | — |
| g2u09.w.gym | a big room or building where people do exercise | We play basketball in the school ___ on Fridays. | library ; kitchen ; garden | library ; kitchen ; garden ; garage ; hall | — |
| g2u09.w.ham | meat from a pig that you eat in a sandwich | I'd like a ___ and cheese sandwich, please. | cheese ; beef ; chicken | cheese ; beef ; chicken ; sausages ; turkey | — |
| g2u09.w.lamb | the meat from a young sheep | The woman had the ___ for her main course. | beef ; chicken ; turkey | beef ; chicken ; turkey ; ham ; fish | — |
| g2u09.w.main-course | the food you eat after the starter, like meat or fish with vegetables | After the soup, we had chicken with rice for the ___. | starter ; soup ; menu | starter ; soup ; menu ; stew ; slice | — |
| g2u09.w.menu | you read this and then you order your food in a restaurant | Can I have the ___, please? I want to order some food. | recipe ; ticket ; letter | recipe ; ticket ; letter ; story ; picture | — |
| g2u09.w.mineral-water | a drink in a bottle that has no sugar | I'd like a bottle of ___, please. | apple juice ; soup ; tea | apple juice ; soup ; tea ; milk ; cheese | — |
| g2u09.w.mushrooms | a small food that you can put on a pizza or eat with meat | I'd like a pizza with ham, ___ and green peppers. | onions ; peppers ; olives | onions ; peppers ; olives ; tomato ; cabbage | — |
| g2u09.w.olives | a small green or black food that you put on a pizza or in a salad | Would you like ___ on your pizza? They are small, green or black. | mushrooms ; peppers ; onions | mushrooms ; peppers ; onions ; tomato ; grapes | — |
| g2u09.w.onions | a white vegetable that makes you cry when you cook it | I don't want any ___ on my pizza, please. | peppers ; mushrooms ; olives | peppers ; mushrooms ; olives ; tomato ; cabbage | — |
| g2u09.w.pancakes | food that you eat for breakfast, cooked from eggs | We had ___ for breakfast this morning. | cheesecake ; pumpkin pie ; rice pudding | cheesecake ; pumpkin pie ; rice pudding ; chocolate ice cream ; bread | — |
| g2u09.w.peaches | food from a tree with a stone in the middle, that you eat in summer | Are there any plums and ___ in the fridge? | plums ; pears ; grapes | plums ; pears ; grapes ; strawberries ; olives | — |
| g2u09.w.pears | green food from a tree that you eat after lunch | Dad, are there any ___ in the fridge? They are green and you eat them. | plums ; peaches ; grapes | plums ; peaches ; grapes ; strawberries ; olives | — |
| g2u09.w.peppers | a red or green vegetable that you put on a pizza | I'd like a pizza with ham, mushrooms and green ___. | onions ; mushrooms ; olives | onions ; mushrooms ; olives ; tomato ; cabbage | — |
| g2u09.w.platform | a high place where people can stand on it | There's a restaurant on a ___ in the sky. | building ; machine ; river | building ; machine ; river ; garden ; crane | — |
| g2u09.w.plums | small purple food with a stone in the middle | Dad, are there any ___ and peaches in the fridge? | pears ; peaches ; grapes | pears ; peaches ; grapes ; strawberries ; olives | — |
| g2u09.w.potato | a brown vegetable that you eat hot with butter | They had turkey with ___ and cabbage. | cabbage ; onions ; peppers | cabbage ; onions ; peppers ; mushrooms ; tomato | — |
| g2u09.w.pumpkin-pie | an orange cake that people eat in October | My grandma makes the best ___ every October. | cheesecake ; pancakes ; rice pudding | cheesecake ; pancakes ; rice pudding ; chocolate ice cream ; cabbage | — |
| g2u09.w.recipe | you read this and then you can make a cake or a soup | Grandma writes her ___ for chocolate cake so I can make it too. | menu ; ticket ; letter | menu ; ticket ; letter ; story ; picture | — |
| g2u09.w.refund | the money you get back when a new thing does not work | The shoes were too small, so I asked for a ___. | menu ; ticket ; delivery | menu ; ticket ; delivery ; price ; recipe | — |
| g2u09.w.rice-pudding | a white food cooked in milk that you eat hot after dinner | We had hot ___ after dinner. It was white. | cheesecake ; pancakes ; pumpkin pie | cheesecake ; pancakes ; pumpkin pie ; chocolate ice cream ; soup | — |
| g2u09.w.sausages | long meat that you cook and eat, often for breakfast or dinner | For me a pizza with ham, ___ and cheese. | ham ; cheese ; beef | ham ; cheese ; beef ; chicken ; olives | — |
| g2u09.w.several | more than two, but not very many | There are ___ restaurants in my town. | many ; any ; some | many ; any ; some ; more ; much | — |
| g2u09.w.slice | a piece of bread or cake that is not very big | Can I have a ___ of your pizza? | plate ; bottle ; glass | plate ; bottle ; glass ; menu ; box | — |
| g2u09.w.soup | a hot food of vegetables or meat that you eat from a plate | I'd like the onion ___ for starters, please. | stew ; salad ; bread | stew ; salad ; bread ; cheese ; rice | — |
| g2u09.w.starter | you eat this small food first, before the chicken or fish | We had onion soup for ___. | main course ; soup ; menu | main course ; soup ; menu ; stew ; slice | — |
| g2u09.w.stew | a hot food of meat and vegetables cooked for a long time | Can I have the cabbage ___, please? | soup ; salad ; bread | soup ; salad ; bread ; cheese ; rice | — |
| g2u09.w.straightaway | at once, very fast | Don't wait — bring the soup ___. | always ; never ; sometimes | always ; never ; sometimes ; usually ; completely | — |
| g2u09.w.strawberries | small red food that you eat in summer | Here, have some red ___. | grapes ; plums ; peaches | grapes ; plums ; peaches ; pears ; tomato | — |
| g2u09.w.to-change-one-s-mind | to want a new thing now, not the thing from before | I wanted pizza, but I ___ and asked for pasta after all. | take it easy ; tidy your room ; go for a walk | take it easy ; tidy your room ; go for a walk ; do nothing ; have a party | — |
| g2u09.w.to-complain | to tell people that you are not happy about your food | The food was cold, so the man wants to ___ to the waiter. | enjoy ; love ; thank | enjoy ; love ; thank ; laugh ; serve | — |
| g2u09.w.to-download | to put new music on your tablet | Yesterday I ___ the new Dua Lipa music to my tablet. | play ; read ; watch | play ; read ; watch ; listen ; stream | — |
| g2u09.w.to-drop | to not hold a thing well, so it falls down | Hold the plate well — don't ___ it! | hold ; wash ; eat | hold ; wash ; eat ; carry ; catch | — |
| g2u09.w.to-entertain | to do a fun show so that people enjoy it and laugh | The clown dances to ___ the children. | dance ; watch ; enjoy | dance ; watch ; enjoy ; laugh ; serve | — |
| g2u09.w.to-miss | to be too slow and not catch the train | Hurry up — I don't want to ___ the train! | catch ; find ; watch | catch ; find ; watch ; wait ; drive | — |
| g2u09.w.to-pour | to make a drink go from a bottle into a glass | Can you ___ some apple juice into my glass? | drink ; eat ; open | drink ; eat ; open ; cook ; serve | — |
| g2u09.w.to-serve | to bring food or drinks to people at a table | The waiters ___ the food to the guests. | pour ; cook ; drop | pour ; cook ; drop ; eat ; drink | — |
| g2u09.w.tomato | a red food that you put in a salad or on a pizza | I'd like a pizza with ham, cheese and red ___. | onions ; mushrooms ; peppers | onions ; mushrooms ; peppers ; olives ; cabbage | — |
| g2u09.w.turkey | a big farm food that families eat for a holiday dinner | In America, families eat ___ for a big holiday dinner. | chicken ; beef ; lamb | chicken ; beef ; lamb ; ham ; sausages | — |
| g2u09.w.waiter | the man or woman who brings your food to your table in a restaurant | The ___ brings us the menu and some food. | chef ; guide ; teacher | chef ; guide ; teacher ; customer ; guest | — |

## Grammar items (48)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u09.gi.one-ones.ag.003 | anagram | Dieses kurze Wort steht für ein einzelnes Ding, damit du das Wort nicht wiederholst: "the red ___". [de, 1 blank(s)] | one (full) | — | — | — | — |
| g2u09.gi.one-ones.ag.004 | anagram | Dieses Wort steht für mehrere Dinge, damit du das Wort nicht wiederholst: "the green ___". [de, 1 blank(s)] | ones (full) | — | — | — | — |
| g2u09.gi.one-ones.cp.001 | context-picker | The waiter asks which grapes you want. You like the green grapes. [en] | I'd like the green ones, please. (full) | I'd like the green one, please. ; I'd like the green, please. ; I'd like the green grapes ones, please. | — | — | — |
| g2u09.gi.one-ones.cp.002 | context-picker | The waiter asks which glass is for the apple juice. You tell him. [en] | That's the one for the apple juice. (full) | That's the ones for the apple juice. ; That's the for the apple juice. ; That's the glass one for the apple juice. | — | — | — |
| g2u09.gi.one-ones.ec.001 | error-correction | Which hat do you want? — I like the red ones. [en] | Which hat do you want? — I like the red one. (full) ; the red one (partial) ; one (partial) | — | — | — | — |
| g2u09.gi.one-ones.ec.002 | error-correction | These plums are good, but the one on that plate are nicer. [en] | These plums are good, but the ones on that plate are nicer. (full) ; the ones on that plate (partial) ; ones (partial) | — | — | — | — |
| g2u09.gi.one-ones.ff.001 | free-form | There are two pizzas on the menu: a ham one and a cheese one. Tell the waiter which one you want and why. [en] | I'd like the ham one, please. I really like ham. (full) ; Can I have the cheese one? I don't like ham. (full) ; I'd like the cheese one. (partial) | — | — | — | — |
| g2u09.gi.one-ones.gf.001 | gap-fill | I don't want this menu. Can I have the new ___? [en, 1 blank(s)] | one (full) | — | — | — | — |
| g2u09.gi.one-ones.gf.002 | gap-fill | These glasses are too small. I need bigger ___. [en, 1 blank(s)] | ones (full) | — | — | — | — |
| g2u09.gi.one-ones.gf.003 | gap-fill | Which cake do you want? — The chocolate ___. [en, 1 blank(s)] | one (full) | — | — | — | — |
| g2u09.gi.one-ones.gf.004 | gap-fill | Those are the glasses for the apple juice. These are the ___ for the soup. [en, 1 blank(s)] | ones (full) | — | — | — | — |
| g2u09.gi.one-ones.gf.005 | gap-fill | There are two soups. Do you want the tomato ___ or the onion ___? [en, 2 blank(s)] | one \| one (full) | — | — | — | — |
| g2u09.gi.one-ones.gf.006 | gap-fill | I like these peaches, but the ___ on that plate look nicer. [en, 1 blank(s)] | ones (full) | — | — | — | — |
| g2u09.gi.one-ones.gs.001 | group-sort | Put them into the one group or the ones group. [en] | — | — | — | one: the chocolate cake, the tomato soup, the cheese pizza \| ones: the green grapes, the red peppers, the small plums | — |
| g2u09.gi.one-ones.mc.001 | multiple-choice | Which pizza is yours? — The small ___, please. [en, 1 blank(s)] | one (full) | ones ; it ; that | — | — | — |
| g2u09.gi.one-ones.mc.002 | multiple-choice | I'd like two of those pears, please. — The green ___? [en, 1 blank(s)] | ones (full) | one ; them ; those | — | — | — |
| g2u09.gi.one-ones.mt.001 | matching | Match the cake and pizza replies. [en] | — | — | Which cake do you want? ↔ The chocolate one, please. ; Which pears do you want? ↔ The green ones, please. ; Which pizza is yours? ↔ The big one. ; Which glasses are for the soup? ↔ The small ones. | — | — |
| g2u09.gi.one-ones.qf.001 | question-formation | Ask your friend which cake they want. [en] | Which one do you want? (full) ; Which one would you like? (full) | — | — | — | — |
| g2u09.gi.one-ones.sb.001 | sentence-building | like / the / I / small / one [en] | I like the small one. (full) ; I like the small one (full) | — | — | — | — |
| g2u09.gi.one-ones.sb.002 | sentence-building | want / the / red / I / ones [en] | I want the red ones. (full) ; I want the red ones (full) | — | — | — | — |
| g2u09.gi.one-ones.tf.001 | transformation | I don't want the red tomato. I want the green tomato. (one) [en] | I don't want the red one. I want the green one. (full) | — | — | — | — |
| g2u09.gi.one-ones.tf.002 | transformation | Which glasses do you want? (the new …) [en] | I'd like the new ones. (full) ; The new ones. (full) | — | — | — | — |
| g2u09.gi.one-ones.tr.001 | translation | Welche Suppe möchtest du? — Die Tomatensuppe. [de] | Which soup do you want? — The tomato one. (full) ; Which soup would you like? — The tomato one. (full) ; Which soup do you want? The tomato one. (full) | — | — | — | — |
| g2u09.gi.one-ones.tr.002 | translation | Ich mag die grünen nicht. Ich mag die roten. (Trauben) [de] | I don't like the green ones. I like the red ones. (full) ; I do not like the green ones. I like the red ones. (full) | — | — | — | — |
| g2u09.gi.some-any.ag.003 | anagram | Dieses Wort sagt, dass ein bisschen von etwas da ist (auch bei Angeboten): "There are ___ plums." [de, 1 blank(s)] | some (full) | — | — | — | — |
| g2u09.gi.some-any.ag.004 | anagram | Dieses Wort verwendest du, wenn du fragst oder wenn etwas nicht da ist: "Are there ___ peaches?" [de, 1 blank(s)] | any (full) | — | — | — | — |
| g2u09.gi.some-any.cp.001 | context-picker | You look in the fridge for your dad. Tell him there are no pears. [en] | There aren't any pears in the fridge. (full) | There aren't some pears in the fridge. ; There are any pears in the fridge. ; There aren't no pears in the fridge. | — | — | — |
| g2u09.gi.some-any.ec.001 | error-correction | I don't have some money. [en] | I don't have any money. (full) ; any (partial) | — | — | — | — |
| g2u09.gi.some-any.ec.002 | error-correction | Would you like any tea? [en] | Would you like some tea? (full) ; some (partial) | — | — | — | — |
| g2u09.gi.some-any.ec.003 | error-correction | There's any cheese in the fridge. [en] | There's some cheese in the fridge. (full) ; There is some cheese in the fridge. (full) ; some (partial) | — | — | — | — |
| g2u09.gi.some-any.ff.001 | free-form | Your dad is making a salad. Look in the fridge and tell him what there is and what there isn't. [en] | There are some grapes, but there aren't any peaches. (full) ; There are some plums and some pears, but there aren't any strawberries. (full) ; There are some grapes. (partial) | — | — | — | — |
| g2u09.gi.some-any.gf.001 | gap-fill | There are ___ grapes in the fridge. [en, 1 blank(s)] | some (full) | — | — | — | — |
| g2u09.gi.some-any.gf.002 | gap-fill | We don't have ___ peaches. [en, 1 blank(s)] | any (full) | — | — | — | — |
| g2u09.gi.some-any.gf.003 | gap-fill | Are there ___ strawberries in the fridge? [en, 1 blank(s)] | any (full) | — | — | — | — |
| g2u09.gi.some-any.gf.004 | gap-fill | Would you like ___ cheesecake? [en, 1 blank(s)] | some (full) | — | — | — | — |
| g2u09.gi.some-any.gf.005 | gap-fill | There isn't ___ soup, but there is ___ stew. [en, 2 blank(s)] | any \| some (full) | — | — | — | — |
| g2u09.gi.some-any.gf.006 | gap-fill | Can I have ___ mineral water, please? — Sorry, there isn't ___ mineral water. [en, 2 blank(s)] | some \| any (full) | — | — | — | — |
| g2u09.gi.some-any.gs.001 | group-sort | Put them into the some group or the any group. [en] | — | — | — | some: There are ___ grapes., Would you like ___ cake?, Can I have ___ soup, please? \| any: Are there ___ pears?, We don't have ___ beef., There isn't ___ stew. | — |
| g2u09.gi.some-any.mc.001 | multiple-choice | There ___ some olives, but there aren't any mushrooms. [en, 1 blank(s)] | are (full) | is ; have ; has | — | — | — |
| g2u09.gi.some-any.mc.002 | multiple-choice | Offer your guest some soup. [en] | Would you like some soup? (full) | Would you like any soup? ; Do you like any soup? ; Would you like the some soup? | — | — | — |
| g2u09.gi.some-any.mt.002 | matching | Match the food and drink replies. [en] | — | — | Would you like some apple juice? ↔ Yes, please. I love it. ; Have you got any olives? ↔ No, sorry. There aren't any. ; Is there any cheesecake? ↔ Yes, there's some in the fridge. ; Can I have some mineral water? ↔ OK. Here you are. | — | — |
| g2u09.gi.some-any.qf.001 | question-formation | Ask if there is beef in the fridge. [en] | Is there any beef in the fridge? (full) | — | — | — | — |
| g2u09.gi.some-any.sb.001 | sentence-building | any / have / don't / I / pears [en] | I don't have any pears. (full) ; I don't have any pears (full) | — | — | — | — |
| g2u09.gi.some-any.sb.002 | sentence-building | some / there / strawberries / are [en] | There are some strawberries. (full) ; There are some strawberries (full) | — | — | — | — |
| g2u09.gi.some-any.tf.001 | transformation | Ask if there are any pancakes: 'There are some pancakes.' [en] | Are there any pancakes? (full) | — | — | — | — |
| g2u09.gi.some-any.tf.002 | transformation | Now there are no peppers: 'There are some peppers.' [en] | There aren't any peppers. (full) ; There are not any peppers. (full) | — | — | — | — |
| g2u09.gi.some-any.tr.002 | translation | Gibt es noch Trauben? — Nein, es gibt keine Trauben mehr. [de] | Are there any grapes? — No, there aren't any grapes. (full) ; Are there any grapes? No, there aren't any grapes. (full) ; Are there any grapes? — No, there aren't any. (full) | — | — | — | — |
| g2u09.gi.some-any.tr.003 | translation | Möchtest du etwas Kuchen? [de] | Would you like some cake? (full) ; Do you want some cake? (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u09/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u09",
  "lens": "level-gloss",
  "itemsHash": "701ca1d81149",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 104, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
