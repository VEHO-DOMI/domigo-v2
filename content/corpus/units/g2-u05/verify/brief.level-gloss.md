# Verify lens — level-gloss — g2-u05 (round 2)

<!-- domigo:verify level-gloss g2-u05 items=3621d84f92f0 prompt=aefb997bf664 round=2 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Amherst, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Chamber, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, Excuse, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Lauriston, Leah, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lisa, London, Lord, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mary, Matt, Mayan, Mei, Mexico, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, South, Square, States, Station, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, Trick, True, Turan, Uhr, Um, United, Vasile, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (49)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u05.w.airport | A place where planes go up into the sky and land again. | We have to be at the ___ very early to catch our plane. | railway station ; bus stop ; supermarket | railway station ; bus stop ; supermarket ; market square | — |
| g2u05.w.as-far-as | Right up to a place, and not past it. | Cross the street and go ___ the cinema. The bank is right beside it. | as soon as ; next to ; opposite | as soon as ; next to ; opposite ; round the corner | — |
| g2u05.w.bank | A place where you can keep your money. | I don't have any money left. I need a ___. | post office ; supermarket ; tourist office | post office ; supermarket ; tourist office ; cinema | — |
| g2u05.w.bus-stop | A place on the road where people wait to travel into town. | I waited a long time at the ___. | railway station ; airport ; market square | railway station ; airport ; market square ; fountain | — |
| g2u05.w.chemist-s | A place that sells medicine for when you have a cold. | I've got a cold. Can you go to the ___ for me? | hospital ; supermarket ; post office | hospital ; supermarket ; post office ; bank | — |
| g2u05.w.church | A building with a tall tower and a cross. | He's going to the ___ on the corner. It has a tall tower with a cross. | bank ; restaurant ; supermarket | bank ; restaurant ; supermarket ; cinema | tower (= Turm) |
| g2u05.w.cinema | A place where you watch a new film on a big screen. | I want to watch the latest film. Let's go to the ___. | restaurant ; church ; supermarket | restaurant ; church ; supermarket ; music shop | film (= Film) |
| g2u05.w.comment | What you write under a posting to show what you think. | I read a nice ___ on Mickey's Place. | review ; feedback ; guest | review ; feedback ; guest ; opening | — |
| g2u05.w.feedback | When people tell you what they think about your work. | Tell me what you think about my project. I want your ___. | comment ; review ; opening | comment ; review ; opening ; guest | — |
| g2u05.w.fountain | Water that jumps up high in an open place in a town. | There's a big ___ at market square. | bus stop ; market square ; guest | bus stop ; market square ; guest ; comment | water (= Wasser) |
| g2u05.w.guest | A friend or family that you ask to come to dinner. | She invited ten ___ to dinner. | comment ; fountain ; review | comment ; fountain ; review ; opening | — |
| g2u05.w.hospital | A place where doctors help you when you are sick or hurt. | When you are very sick, the ambulance drives you to the ___. | chemist's ; supermarket ; police station | chemist's ; supermarket ; police station ; bank | — |
| g2u05.w.map | A picture that shows you where places are in a town. | We used a ___ to find the hotel. | comment ; review ; feedback | comment ; review ; feedback ; fountain | — |
| g2u05.w.market-square | An open place in a town where people sell food. | There is a big market on ___ every Saturday. | bus stop ; airport ; music shop | bus stop ; airport ; music shop ; fountain | — |
| g2u05.w.most-of-the-time | On most days, but not every day. | In summer it is sunny ___. | next to ; as far as ; round the corner | next to ; as far as ; round the corner ; opposite | — |
| g2u05.w.music-shop | A place where you can find a guitar or a keyboard to play. | I want a new guitar. Let's go to the ___. | supermarket ; chemist's ; post office | supermarket ; chemist's ; post office ; bank | — |
| g2u05.w.next-to | Right beside it, very close to it. | Go past the bank. The post office is ___ it. | opposite ; behind ; in front of | opposite ; behind ; in front of ; round the corner | — |
| g2u05.w.opening | When a new place opens for the first time. | There is a big ___ of a new restaurant today! | review ; comment ; feedback | review ; comment ; feedback ; guest | — |
| g2u05.w.opposite | Right across the road from it, looking at it. | The restaurant is ___ the church, across the road. | next to ; behind ; in front of | next to ; behind ; in front of ; round the corner | — |
| g2u05.w.pocket | A small place in your clothes for your money or your pen. | He keeps his money in his jacket ___. | map ; fountain ; guest | map ; fountain ; guest ; comment | — |
| g2u05.w.police-station | A building where you go to tell about a crime. | Help! A robber! Where is the nearest ___? | post office ; hospital ; supermarket | post office ; hospital ; supermarket ; tourist office | — |
| g2u05.w.politely | When you ask with a please and a thank you. | She asks ___, with a please and a thank you. | simply ; somewhere ; slow | simply ; somewhere ; slow ; positive | — |
| g2u05.w.positive | Good and nice, the opposite of bad. | Write a ___ comment about the new book and tell people it is good. | slow ; simply ; the worst | slow ; simply ; the worst ; politely | — |
| g2u05.w.post-office | A place where you go when you want to send a letter. | I need some stamps. Is there a ___ near here? | police station ; bank ; tourist office | police station ; bank ; tourist office ; supermarket | stamps (= Briefmarken) ; send (= schicken) |
| g2u05.w.railway-station | A place where you wait for your train. | I don't have a car. Let's go to the ___ and catch the train to York. | bus stop ; airport ; supermarket | bus stop ; airport ; supermarket ; music shop | — |
| g2u05.w.restaurant | A place where you eat your dinner and a waiter brings it to you. | I don't want to cook today. Let's go to the ___. | bank ; church ; hospital | bank ; church ; hospital ; post office | — |
| g2u05.w.review | When you write what you think about a book or a place. | Read a ___ of the new book before you read it. | comment ; feedback ; opening | comment ; feedback ; opening ; guest | — |
| g2u05.w.round-the-corner | Very near, just past the place where two streets meet. | The bank is just ___, very near the post office. | next to ; opposite ; as far as | next to ; opposite ; as far as ; go past | — |
| g2u05.w.second | Right after the first one. | Don't turn into the first street. Go to the ___ one, just after the bank. | first ; third ; next to | first ; third ; next to ; opposite | — |
| g2u05.w.simply | When you can do it with no problem. | Don't worry. ___ go straight on and you are there. | politely ; somewhere ; slow | politely ; somewhere ; slow ; positive | — |
| g2u05.w.slow | Not fast; a long time to go from here to there. | A tortoise is very ___. | fast ; positive ; cold | fast ; positive ; cold ; wild | — |
| g2u05.w.somewhere | In a place, but you cannot point to it. | I left my pencil case ___ in school, but I cannot find it. | simply ; politely ; slow | simply ; politely ; slow ; positive | — |
| g2u05.w.supermarket | A big place where you can buy your food. | We don't have any food. Please go to the ___. | bank ; church ; police station | bank ; church ; police station ; music shop | buy (= kaufen) |
| g2u05.w.the-worst | The most bad; the opposite of the best. | Of all the pizzas in town, that one was ___. I really hated it. | the best ; positive ; slow | the best ; positive ; slow ; simply | — |
| g2u05.w.to-bother | To talk to somebody when they have no time for you. | I'm sorry to ___ you, but can you help me find the railway station? | interrupt ; offer ; comment | interrupt ; offer ; comment ; cross | — |
| g2u05.w.to-change-trains | To get off one and get on a new one at the railway station. | We have to ___ at Waterloo Station. | cross the street ; go past ; turn left | cross the street ; go past ; turn left ; go straight on | get on (= einsteigen) ; get off (= aussteigen) |
| g2u05.w.to-comment | To write under a posting to show what you think about it. | You can ___ on the postings and write what you think. | offer ; interrupt ; bother | offer ; interrupt ; bother ; cross | — |
| g2u05.w.to-cross | To go over a street or a river. | We have to ___ the street. The supermarket is over there. | turn ; offer ; interrupt | turn ; offer ; interrupt ; bother | — |
| g2u05.w.to-cross-the-street | To go over the road on foot. | Look left and right before you ___. | go past ; turn left ; go straight on | go past ; turn left ; go straight on ; take the second right | — |
| g2u05.w.to-go-past | To come up to a place and keep going, not in. | Go straight ahead. ___ the supermarket and then turn left. | turn left ; cross the street ; go straight on | turn left ; cross the street ; go straight on ; take the second right | — |
| g2u05.w.to-go-straight-ahead | To go on and not turn left or right. | Don't turn here. ___ to the traffic lights. | turn left ; go past ; cross the street | turn left ; go past ; cross the street ; take the second right | — |
| g2u05.w.to-go-straight-on | To keep going on and not turn left or right. | Don't turn here. ___, then turn left. | turn left ; go past ; cross the street | turn left ; go past ; cross the street ; take the second right | — |
| g2u05.w.to-interrupt | To begin talking when somebody is still talking. | Please don't ___ me. I want to talk first. | bother ; offer ; comment | bother ; offer ; comment ; cross | — |
| g2u05.w.to-offer | To tell somebody that you want to give them a thing. | We ___ you three nights for the price of two. | bother ; interrupt ; cross | bother ; interrupt ; cross ; comment | — |
| g2u05.w.to-take-the-second-right | The road after the first one, not the one on your left. | Go past that bus stop and ___. Then go straight ahead. | turn left ; go past ; cross the street | turn left ; go past ; cross the street ; go straight on | — |
| g2u05.w.to-turn-left | At a corner, do not go straight on or to the right. | Go straight ahead and ___ at the traffic lights. The station is at the end of the road. | go past ; cross the street ; take the second right | go past ; cross the street ; take the second right ; go straight on | — |
| g2u05.w.tourist-office | A place where you can ask for a map and find out about a town. | We want a map of this town. Let's ask at the ___. | post office ; police station ; supermarket | post office ; police station ; supermarket ; bank | — |
| g2u05.w.traffic-lights | The red and green thing at a corner: red for wait, green for go. | Turn left at the ___ and then go straight ahead. | bus stop ; fountain ; market square | bus stop ; fountain ; market square ; airport | — |
| g2u05.w.underground | A fast train that runs under a big city. | In London the ___ runs under the city. | airport ; bus stop ; market square | airport ; bus stop ; market square ; fountain | — |

## Grammar items (26)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u05.gi.prepositions-directions.cp.001 | context-picker | The bank is across the street from the supermarket. [en] | The bank is opposite the supermarket. (full) | The bank is opposite of the supermarket. ; The bank is opposite to the supermarket. ; The bank is behind of the supermarket. | — | — | — |
| g2u05.gi.prepositions-directions.cp.002 | context-picker | You are at the bus stop. The railway station is straight on, after the second corner on the right. [en] | Go straight ahead and take the second right. (full) | Go straight ahead and turn on the second right. ; Go straight ahead and turn to the second right. ; Go straight ahead and turn in the second right. | — | — | — |
| g2u05.gi.prepositions-directions.ec.001 | error-correction | The hospital is opposite of the church. [en] | The hospital is opposite the church. (full) ; opposite the church (partial) ; opposite (partial) | — | — | — | — |
| g2u05.gi.prepositions-directions.ec.002 | error-correction | Turn to the left at the church. [en] | Turn left at the church. (full) ; Turn left (partial) | — | — | — | — |
| g2u05.gi.prepositions-directions.ec.003 | error-correction | The post office is behind of the bank. [en] | The post office is behind the bank. (full) ; behind the bank (partial) | — | — | — | — |
| g2u05.gi.prepositions-directions.ec.004 | error-correction | Go past the church and turn on the right. [en] | Go past the church and turn right. (full) ; turn right (partial) | — | — | — | — |
| g2u05.gi.prepositions-directions.gf.001 | gap-fill | The post office is ___ the bank. They are very close. [en, 1 blank(s)] | beside (full) ; next to (full) | round the corner ; opposite ; over | — | — | — |
| g2u05.gi.prepositions-directions.gf.002 | gap-fill | The restaurant is ___ the church. It is across the street. [en, 1 blank(s)] | opposite (full) | behind ; beside ; round the corner | — | — | — |
| g2u05.gi.prepositions-directions.gf.003 | gap-fill | The cinema is ___ the music shop. Go past the music shop to find it. [en, 1 blank(s)] | behind (full) | opposite ; beside ; in front of | — | — | — |
| g2u05.gi.prepositions-directions.gf.004 | gap-fill | Don't turn here. Go ___ ahead and then turn right at the traffic lights. [en, 1 blank(s)] | straight (full) | left ; right ; past | — | — | — |
| g2u05.gi.prepositions-directions.gf.005 | gap-fill | Turn ___ at the church and the hospital is on your right. [en, 1 blank(s)] | left (full) | to left ; in the left ; on left | — | — | — |
| g2u05.gi.prepositions-directions.gf.006 | gap-fill | Go ___ the post office and the bank is on your right. [en, 1 blank(s)] | past (full) | over ; to ; behind | — | — | — |
| g2u05.gi.prepositions-directions.gf.007 | gap-fill | You can't find the bank from here. It is just ___, beside the supermarket. [en, 1 blank(s)] | round the corner (full) | in front of ; next to ; on the corner of | — | — | — |
| g2u05.gi.prepositions-directions.gf.008 | gap-fill | There's a park ___ you. Go straight ahead and the cinema is on the right. [en, 1 blank(s)] | in front of (full) | behind ; opposite ; beside | — | — | — |
| g2u05.gi.prepositions-directions.gf.009 | gap-fill | Go to the end of the road. There's a big bank ___ George Street. [en, 1 blank(s)] | on the corner of (full) | in the corner of ; to the corner of ; round the corner | — | — | — |
| g2u05.gi.prepositions-directions.gs.002 | group-sort | go straight ahead / turn left / opposite / behind [en] | — | — | — | How to go there: go straight ahead, turn left, go past, cross the street, take the second right \| Saying where it is: opposite, behind, next to, round the corner, in front of | — |
| g2u05.gi.prepositions-directions.mc.001 | multiple-choice | The cinema is across the street from the restaurant. [en] | The cinema is opposite the restaurant. (full) | The cinema is opposite of the restaurant. ; The cinema is opposite to the restaurant. ; The cinema is opposite from the restaurant. | — | — | — |
| g2u05.gi.prepositions-directions.mc.002 | multiple-choice | You want to go to the church. The traffic lights are in front of you. [en] | Turn left at the traffic lights. (full) | Turn to the left at the traffic lights. ; Turn in the left at the traffic lights. ; Turn on the left at the traffic lights. | — | — | — |
| g2u05.gi.prepositions-directions.mc.003 | multiple-choice | directions to the railway station [en] | Go straight ahead and turn right at the traffic lights. (full) | Go straight ahead and turn to the right at the traffic lights. ; Go straight ahead and turn in the right at the traffic lights. ; Go straight ahead and turn on the right at the traffic lights. | — | — | — |
| g2u05.gi.prepositions-directions.mt.001 | matching | places and where they are [en] | — | — | Where's the post office? ↔ It's next to the bank. ; Where's the cinema? ↔ It's opposite the restaurant. ; Where's the hospital? ↔ It's behind the church. ; Where's the bank? ↔ It's round the corner. ; Where's the tourist office? ↔ It's on the corner of the street. | — | — |
| g2u05.gi.prepositions-directions.qf.001 | question-formation | You are in town. You want to go to the railway station. Ask politely. [en] | Excuse me, where's the railway station? (full) ; Excuse me, where is the railway station? (full) ; Excuse me, can you tell me where the railway station is? (full) ; Where's the railway station? (partial) | — | — | — | — |
| g2u05.gi.prepositions-directions.sb.001 | sentence-building | traffic lights / the / turn / at / left [en] | Turn left at the traffic lights. (full) ; Turn left at the traffic lights (full) | to ; on | — | — | — |
| g2u05.gi.prepositions-directions.sb.002 | sentence-building | opposite / the / cinema / is / the / restaurant [en] | The cinema is opposite the restaurant. (full) ; The cinema is opposite the restaurant (full) | of ; to | — | — | — |
| g2u05.gi.prepositions-directions.sb.003 | sentence-building | the / past / go / and / turn / left / supermarket [en] | Go past the supermarket and turn left. (full) ; Go past the supermarket and turn left (full) | to ; on | — | — | — |
| g2u05.gi.prepositions-directions.tr.001 | translation | Das Restaurant ist gegenüber der Kirche. [de] | The restaurant is opposite the church. (full) ; The restaurant is opposite the church (full) ; The restaurant is across from the church. (partial) | — | — | — | — |
| g2u05.gi.prepositions-directions.tr.002 | translation | Geh geradeaus und biege dann rechts ab. [de] | Go straight ahead and then turn right. (full) ; Go straight ahead and then turn right (full) ; Go straight on and then turn right. (full) ; Go straight and then turn right. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u05/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u05",
  "lens": "level-gloss",
  "itemsHash": "3621d84f92f0",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 75, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
