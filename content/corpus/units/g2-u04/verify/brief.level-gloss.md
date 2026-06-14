# Verify lens — level-gloss — g2-u04 (round 2)

<!-- domigo:verify level-gloss g2-u04 items=b34faed5561b prompt=aefb997bf664 round=2 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Carla, Castle, Chamber, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Disneyland, Doctor, Doctors, Don, Dragon, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Leah, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lisa, London, Lord, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Mayan, Mei, Mexico, Michael, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Nibbs, Nice, Nick, Nomen, North, Number, Numbers, Object, Objekte, Oliver, Olivia, Omar, Order, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, States, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, Trick, True, Turan, Uhr, Um, United, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (50)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u04.w.ago | Before now; not happening now. | Long ___, there were many crocodiles in this river. | forever ; nobody ; less | forever ; nobody ; less ; fast | — |
| g2u04.w.anaconda | A very long heavy snake. It lives near rivers and can be as long as a car. | The ___ in the river was as long as a car. | crocodile ; dolphin ; antelope | crocodile ; dolphin ; antelope ; whale | snake (= Schlange) |
| g2u04.w.antelope | A fast wild mammal with long legs. It lives in hot places and runs from lions. | The ___ has got long legs and runs very fast from lions. | dolphin ; crocodile ; shark | dolphin ; crocodile ; shark ; whale | — |
| g2u04.w.bat | A small dark mammal that can fly at night. It is not a bird. | A ___ can fly in the dark at night. | pigeon ; ostrich ; parrot | pigeon ; ostrich ; parrot ; mosquito | fly (= fliegen) ; bird (= Vogel) |
| g2u04.w.centimetre | A small unit for how long a thing is. | My pencil is about 15 ___ long. | ton ; speed ; length | ton ; speed ; length ; desert | unit (= Einheit) |
| g2u04.w.cheetah | A wild cat with spots. It is the fastest mammal on land. | The ___ can run faster than any car on land. | giraffe ; whale ; crocodile | giraffe ; whale ; crocodile ; rhino | cat (= Katze) |
| g2u04.w.chimpanzee | A very clever mammal, like a big monkey. | The ___ at the zoo is as clever as a small child. | giraffe ; dolphin ; antelope | giraffe ; dolphin ; antelope ; rhino | — |
| g2u04.w.climate-change | When the weather of the world becomes warmer. | Many animals die because of ___. | luck ; speed ; reason | luck ; speed ; length ; reason | animals (= Tiere) ; world (= Welt) ; warmer (= wärmer) |
| g2u04.w.crocodile | A big green reptile with long teeth. It lives near rivers in hot places. | The big green ___ was next to the river with its mouth open. | dolphin ; ostrich ; antelope | dolphin ; ostrich ; antelope ; giraffe | reptile (= Reptil) |
| g2u04.w.dangerous | This can hurt you or make you ill. | Playing on the road is very ___. | hairy ; intelligent ; female | hairy ; intelligent ; female ; smart | — |
| g2u04.w.desert | A very hot place with a lot of sand and almost no rain. | There are no ___ in England. | centimetres ; tons ; trucks | centimetres ; tons ; trucks ; reasons | sand (= Sand) ; almost (= fast) ; rain (= Regen) |
| g2u04.w.dolphin | A clever sea mammal that jumps up out of the water. | The clever ___ jumped up out of the river. | antelope ; giraffe ; rhino | antelope ; giraffe ; rhino ; crocodile | sea (= Meer) ; water (= Wasser) |
| g2u04.w.farmer | A man or a woman who keeps pigs and horses. | A ___ near the river had a big farm. | scientist ; human ; truck | scientist ; human ; truck ; mammal | — |
| g2u04.w.fast | Going at a great speed. | Cheetahs can run very ___. They are faster than a car. | heavy ; hairy ; venomous | heavy ; hairy ; venomous ; female | — |
| g2u04.w.female | A girl or a woman; the mother animal in a family. | The ___ toad is dark green; the male toad is golden red. | incredible ; hairy ; smart | incredible ; hairy ; smart ; powerful | toad (= Kröte) ; golden (= golden) ; animal (= Tier) |
| g2u04.w.forever | For all time; with no end. | We want to be best friends ___. | ago ; nobody ; less | ago ; nobody ; less ; fast | — |
| g2u04.w.giraffe | The tallest mammal on Earth. It has got a very long neck and spots. | The ___ is the tallest animal in the world. | ostrich ; antelope ; rhino | ostrich ; antelope ; rhino ; chimpanzee | neck (= Hals) ; animal (= Tier) ; world (= Welt) |
| g2u04.w.hairy | With a lot of hair or fur on it. | My dog has got lots of fur. It is very ___. | heavy ; venomous ; dangerous | heavy ; venomous ; dangerous ; strong | — |
| g2u04.w.heavy | It weighs so much that you cannot carry it. | My school bag is too ___ to carry today. | hairy ; fast ; smart | hairy ; fast ; smart ; strong | — |
| g2u04.w.human | A man, a woman or a child. | I wanted to show the crocodile that not all ___ are bad. | mammals ; farmers ; scientists | mammals ; farmers ; scientists ; rhinos | — |
| g2u04.w.incredible | Very, very good or very surprising. | That's an ___ but true story. | dangerous ; hairy ; venomous | dangerous ; hairy ; venomous ; heavy | — |
| g2u04.w.intelligent | Very good at thinking and learning. | Dolphins are very ___ animals. They can think very well. | hairy ; heavy ; venomous | hairy ; heavy ; venomous ; female | thinking (= Denken) ; learning (= Lernen) ; animals (= Tiere) |
| g2u04.w.length | How long a thing is from end to end. | An anaconda can be six metres long. That is a very big ___. | speed ; ton ; reason | speed ; ton ; reason ; luck | metres (= Meter) |
| g2u04.w.less | A smaller number; not as much. | I eat ___ sugar now because I want to be healthy. | forever ; ago ; nobody | forever ; ago ; nobody ; fast | — |
| g2u04.w.luck | When good things happen to you by chance. | What animal can bring us ___? | speed ; reason ; length | speed ; reason ; length ; ton | animal (= Tier) ; things (= Dinge) ; by (= durch) ; chance (= Zufall) |
| g2u04.w.male | A boy or a man; the father animal in a family. | The ___ toad is golden red; the female toad is dark green. | incredible ; venomous ; heavy | incredible ; venomous ; heavy ; hairy | toad (= Kröte) ; golden (= golden) ; father (= Vater) ; animal (= Tier) |
| g2u04.w.mammal | An animal that drinks milk from its mother when it is a baby. | Elephants and lions are ___. They give milk to their young. | deserts ; tons ; trucks | deserts ; tons ; trucks ; reasons | animal (= Tier) ; baby (= Baby) |
| g2u04.w.mosquito | A tiny insect that bites you. It can carry malaria. | A tiny ___ can carry malaria when it bites you. | bat ; pigeon ; parrot | bat ; pigeon ; parrot ; shark | insect (= Insekt) ; malaria (= Malaria) |
| g2u04.w.nobody | No one at all. | There was ___ in the park, so I played alone. | forever ; ago ; less | forever ; ago ; less ; fast | — |
| g2u04.w.ostrich | A very big bird that cannot fly. It runs fast on its long legs. | An ___ is taller than a man. | giraffe ; pigeon ; antelope | giraffe ; pigeon ; antelope ; cheetah | bird (= Vogel) ; fly (= fliegen) |
| g2u04.w.parrot | A colourful bird that can talk like you. | The ___ at the zoo can talk just like us. | pigeon ; ostrich ; giraffe | pigeon ; ostrich ; giraffe ; dolphin | bird (= Vogel) |
| g2u04.w.pigeon | A small grey bird that lives in a city. There are many in the park. | There are many grey ___ in the city. | parrot ; ostrich ; bat | parrot ; ostrich ; bat ; mosquito | bird (= Vogel) |
| g2u04.w.powerful | Very strong; you can push over a big tree. | Rhinos are very ___. They can push over a tree. | hairy ; venomous ; female | hairy ; venomous ; female ; incredible | — |
| g2u04.w.reason | Why a thing happens, or why you do a thing. | Is there a ___ why you don't want to come? | speed ; length ; luck | speed ; length ; luck ; ton | — |
| g2u04.w.rhino | A big strong grey mammal with a horn on its nose. | A ___ can be bigger than a truck. | dolphin ; antelope ; bat | dolphin ; antelope ; bat ; ostrich | horn (= Horn) |
| g2u04.w.scientist | A man or a woman who studies animals and nature. | I want to study animals one day, so I want to be a ___. | farmer ; human ; truck | farmer ; human ; truck ; mammal | animals (= Tiere) ; nature (= Natur) |
| g2u04.w.shark | A big fish with long teeth that lives in the sea. | Some people are scared of swimming in the sea because of ___. | dolphin ; antelope ; giraffe | dolphin ; antelope ; giraffe ; rhino | sea (= Meer) |
| g2u04.w.smart | Good at learning and thinking quickly. | Our new dog is very ___. He understands every word I say. | hairy ; heavy ; venomous | hairy ; heavy ; venomous ; female | learning (= Lernen) ; thinking (= Denken) ; quickly (= schnell) ; word (= Wort) ; say (= sagen) |
| g2u04.w.speed | How fast a thing can go. | A cheetah can run at a very fast ___. | length ; ton ; reason | length ; ton ; reason ; luck | — |
| g2u04.w.strong | With a lot of power; you can carry heavy boxes. | I'm not as ___ as my best friend. He can carry big boxes. | heavy ; hairy ; fast | heavy ; hairy ; fast ; dangerous | — |
| g2u04.w.to-carry | To hold a thing and bring it to a new place. | Mosquitos can ___ malaria. | weigh ; protect ; share | weigh ; protect ; share ; die | malaria (= Malaria) |
| g2u04.w.to-die | To stop living; to come to the end of life. | Many people ___ from malaria every year. | carry ; weigh ; share | carry ; weigh ; share ; protect | stop (= aufhören) ; malaria (= Malaria) |
| g2u04.w.to-die-out | When the last one of a kind is gone forever. | These crocodiles could ___ out one day if we don't help them. | carry ; weigh ; protect | carry ; weigh ; protect ; share | kind (= Art) ; gone (= weg, verschwunden) |
| g2u04.w.to-protect | To keep a friend or a thing safe from danger. | We must ___ wild animals and keep them safe. | carry ; weigh ; share | carry ; weigh ; share ; die | safe (= sicher) ; danger (= Gefahr) ; animals (= Tiere) |
| g2u04.w.to-share | To give some of what you have to a friend. | Please ___ your sweets with your sister. | carry ; weigh ; protect | carry ; weigh ; protect ; die | — |
| g2u04.w.to-weigh | To find out how heavy a thing is. | A big shark can ___ more than two tons. | carry ; share ; protect | carry ; share ; protect ; die | — |
| g2u04.w.ton | A very heavy unit of weight: one thousand kilograms. | A whale can weigh 150 ___. | centimetres ; deserts ; lengths | centimetres ; deserts ; lengths ; speeds | unit (= Einheit) ; weight (= Gewicht) ; kilograms (= Kilogramm) |
| g2u04.w.truck | A very big thing for the road that can bring heavy boxes from place to place. | A rhino can be bigger than a ___. | desert ; mammal ; scientist | desert ; mammal ; scientist ; farmer | — |
| g2u04.w.venomous | Having poison in its bite that can make you very ill. | A ___ snake has got poison in its bite. | hairy ; heavy ; female | hairy ; heavy ; female ; incredible | poison (= Gift) ; snake (= Schlange) |
| g2u04.w.whale | The biggest mammal on Earth. It lives in the sea. | The ___ is the biggest and heaviest mammal of all. | antelope ; giraffe ; ostrich | antelope ; giraffe ; ostrich ; cheetah | sea (= Meer) |

## Grammar items (66)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u04.gi.as-as.cp.001 | context-picker | You and a friend look at two rats. They are both very big. [en] | My rat is as big as your rat. (full) | My rat is so big as your rat. ; My rat is as bigger as your rat. ; My rat is as big like your rat. | — | — | — |
| g2u04.gi.as-as.ec.001 | error-correction | An anaconda is so long as a crocodile. [en] | An anaconda is as long as a crocodile. (full) ; as long as (partial) | — | — | — | — |
| g2u04.gi.as-as.ec.002 | error-correction | A rhino is as stronger as a hippo. [en] | A rhino is as strong as a hippo. (full) ; as strong as (partial) | — | — | — | — |
| g2u04.gi.as-as.ec.003 | error-correction | A dolphin is as smart like a chimpanzee. [en] | A dolphin is as smart as a chimpanzee. (full) ; as smart as (partial) | — | — | — | — |
| g2u04.gi.as-as.gf.001 | gap-fill | A chimpanzee is ___ a child. They are both clever. [en, 1 blank(s)] | as clever as (full) | so clever as ; as cleverer as ; as clever like | — | — | — |
| g2u04.gi.as-as.gf.002 | gap-fill | The boy is ___ the chimpanzee. They are both very big. [en, 1 blank(s)] | as big as (full) | so big as ; as bigger as ; as big like | — | — | — |
| g2u04.gi.as-as.gf.003 | gap-fill | An anaconda is ___ a crocodile. They are both very long. [en, 1 blank(s)] | as long as (full) | so long as ; as longer as ; as long like | — | — | — |
| g2u04.gi.as-as.gf.004 | gap-fill | An antelope is fast, but it is ___ a cheetah. The cheetah is faster. [en, 1 blank(s)] | not as fast as (full) | not so fast as ; not as faster as ; as not fast as | — | — | — |
| g2u04.gi.as-as.gf.005 | gap-fill | A dolphin is ___ a shark. The shark is more dangerous. [en, 1 blank(s)] | not as dangerous as (full) | not so dangerous as ; as not dangerous as ; not as more dangerous as | — | — | — |
| g2u04.gi.as-as.gf.006 | gap-fill | A pigeon is ___ a parrot. They are both quite small. [en, 1 blank(s)] | as small as (full) | so small as ; as smaller as ; as small like | — | — | — |
| g2u04.gi.as-as.gf.007 | gap-fill | I am ___ my best friend. We are both quite strong. [en, 1 blank(s)] | as strong as (full) | so strong as ; as stronger as ; as strong like | — | — | — |
| g2u04.gi.as-as.gs.002 | group-sort | How big? How fast? [en] | — | — | — | as … as: An anaconda is as long as a crocodile., A chimpanzee is as clever as a dolphin. \| not as … as: An antelope is not as fast as a cheetah., A dolphin is not as dangerous as a shark. | — |
| g2u04.gi.as-as.mc.001 | multiple-choice | A chimpanzee and a dolphin are both clever. [en] | A chimpanzee is as clever as a dolphin. (full) | A chimpanzee is so clever as a dolphin. ; A chimpanzee is as cleverer as a dolphin. ; A chimpanzee is as clever like a dolphin. | — | — | — |
| g2u04.gi.as-as.mc.002 | multiple-choice | An elephant weighs much more than an antelope. [en] | An antelope is not as heavy as an elephant. (full) | An antelope is not so heavy as an elephant. ; An antelope is as not heavy as an elephant. ; An antelope is not as heavier as an elephant. | — | — | — |
| g2u04.gi.as-as.mt.001 | matching | as ... as [en] | — | — | A chimpanzee is as clever ↔ as a dolphin. ; A pigeon is not as big ↔ as an ostrich. ; An anaconda is as long ↔ as a crocodile. ; An antelope is not as fast ↔ as a cheetah. | — | — |
| g2u04.gi.as-as.qf.001 | question-formation | a cheetah / fast / an antelope [en] | Is a cheetah as fast as an antelope? (full) ; Is a cheetah as fast as an antelope (full) ; Is an antelope as fast as a cheetah? (partial) | — | — | — | — |
| g2u04.gi.as-as.sb.001 | sentence-building | as / is / a / dolphin / as / a / chimpanzee / smart [en] | A dolphin is as smart as a chimpanzee. (full) ; A dolphin is as smart as a chimpanzee (full) | like | — | — | — |
| g2u04.gi.as-as.tf.001 | transformation | A dog is faster than a tortoise. (not as ... as) A tortoise is ___. [en, 1 blank(s)] | not as fast as a dog (full) ; a tortoise is not as fast as a dog (partial) | — | — | — | — |
| g2u04.gi.as-as.tf.002 | transformation | Your room is smaller than my room. (not as ... as) Your room is ___. [en, 1 blank(s)] | not as big as my room (full) ; your room is not as big as my room (partial) | — | — | — | — |
| g2u04.gi.as-as.tr.001 | translation | Ich bin so groß wie mein Papa. [de] | I am as tall as my dad. (full) ; I am as tall as my dad (full) ; I'm as tall as my dad. (full) ; I'm as tall as my dad (full) | — | — | — | — |
| g2u04.gi.as-as.tr.002 | translation | Ein Delfin ist nicht so gefährlich wie ein Hai. [de] | A dolphin is not as dangerous as a shark. (full) ; A dolphin is not as dangerous as a shark (full) ; A dolphin isn't as dangerous as a shark. (full) ; A dolphin isn't as dangerous as a shark (full) | — | — | — | — |
| g2u04.gi.comparatives.ag.001 | anagram | An antelope is ___ than an elephant. [en, 1 blank(s)] | faster (full) | — | — | — | — |
| g2u04.gi.comparatives.ag.002 | anagram | An elephant is ___ than a mouse. [en, 1 blank(s)] | heavier (full) | — | — | — | — |
| g2u04.gi.comparatives.cp.001 | context-picker | A cheetah's speed is 110. A rhino's speed is 55. [en] | The cheetah is faster than the rhino. (full) | The cheetah is more fast than the rhino. ; The cheetah is faster as the rhino. ; The cheetah is more faster than the rhino. | — | — | — |
| g2u04.gi.comparatives.ec.001 | error-correction | A cheetah is more fast than a tortoise. [en] | A cheetah is faster than a tortoise. (full) ; faster (partial) | — | — | — | — |
| g2u04.gi.comparatives.ec.002 | error-correction | A giraffe is more bigger than a chimpanzee. [en] | A giraffe is bigger than a chimpanzee. (full) ; bigger (partial) | — | — | — | — |
| g2u04.gi.comparatives.ec.003 | error-correction | An ostrich is more good at running than a pigeon. [en] | An ostrich is better at running than a pigeon. (full) ; better (partial) | — | — | — | — |
| g2u04.gi.comparatives.gf.001 | gap-fill | A cheetah is ___ (fast) than a rhino. [en, 1 blank(s)] | faster (full) | more fast ; fastest ; more faster | — | — | — |
| g2u04.gi.comparatives.gf.002 | gap-fill | A giraffe is ___ (tall) than an ostrich. [en, 1 blank(s)] | taller (full) | more tall ; tallest ; more taller | — | — | — |
| g2u04.gi.comparatives.gf.003 | gap-fill | An anaconda is ___ (heavy) than a crocodile. [en, 1 blank(s)] | heavier (full) | more heavy ; the most heavy ; more heavier | — | — | — |
| g2u04.gi.comparatives.gf.004 | gap-fill | An elephant is ___ (big) than a rhino. [en, 1 blank(s)] | bigger (full) | biger ; more big ; more bigger | — | — | — |
| g2u04.gi.comparatives.gf.005 | gap-fill | A dolphin is ___ (intelligent) than a pigeon. [en, 1 blank(s)] | more intelligent (full) | intelligenter ; most intelligent ; more intelligenter | — | — | — |
| g2u04.gi.comparatives.gf.006 | gap-fill | A rabbit is bad at climbing, but a pig is ___ (bad) than a rabbit. [en, 1 blank(s)] | worse (full) | badder ; more bad ; the worst | — | — | — |
| g2u04.gi.comparatives.gf.007 | gap-fill | My rat is ___ (hairy) than your dog, and it is ___ (small) too. [en, 2 blank(s)] | hairier \| smaller (full) | — | — | — | — |
| g2u04.gi.comparatives.gs.002 | group-sort | Which is bigger? [en] | — | — | — | big → bigger: fast, tall, strong, small \| difficult → more difficult: dangerous, intelligent, powerful, beautiful | — |
| g2u04.gi.comparatives.mc.001 | multiple-choice | Look at a dog and a mouse. [en] | A dog is bigger than a mouse. (full) | A dog is more bigger than a mouse. ; A dog is biger than a mouse. ; A dog is big than a mouse. | — | — | — |
| g2u04.gi.comparatives.mc.002 | multiple-choice | It is a cold, wet morning. [en] | The weather is worse today than yesterday. (full) | The weather is more bad today than yesterday. ; The weather is more worse today than yesterday. ; The weather is the worse today than yesterday. | — | — | — |
| g2u04.gi.comparatives.mc.003 | multiple-choice | A mosquito is ___ (small) than a bat. [en, 1 blank(s)] | smaller (full) | more small ; smallest ; more smaller | — | — | — |
| g2u04.gi.comparatives.mt.001 | matching | big, bigger, biggest [en] | — | — | good ↔ better ; big ↔ bigger ; happy ↔ happier ; dangerous ↔ more dangerous ; bad ↔ worse | — | — |
| g2u04.gi.comparatives.qf.001 | question-formation | a rhino / heavy / a hippo [en] | Is a rhino heavier than a hippo? (full) ; Is a rhino heavier than a hippo (full) | — | — | — | — |
| g2u04.gi.comparatives.sb.002 | sentence-building | is / a / shark / than / dolphin / a / more dangerous [en] | A shark is more dangerous than a dolphin. (full) ; A shark is more dangerous than a dolphin (full) | as ; the | — | — | — |
| g2u04.gi.comparatives.tf.001 | transformation | An elephant is heavy. A mouse is light. (heavy) An elephant is ___. [en, 1 blank(s)] | heavier than a mouse (full) ; an elephant is heavier than a mouse (partial) | — | — | — | — |
| g2u04.gi.comparatives.tf.002 | transformation | Maths is difficult. English is not. (difficult) Maths is ___. [en, 1 blank(s)] | more difficult than English (full) ; maths is more difficult than English (partial) | — | — | — | — |
| g2u04.gi.comparatives.tr.001 | translation | Mein Hund ist größer als deine Maus. [de] | My dog is bigger than your mouse. (full) ; My dog is bigger than your mouse (full) | — | — | — | — |
| g2u04.gi.comparatives.tr.002 | translation | Ein Wal ist schwerer als ein Delfin. [de] | A whale is heavier than a dolphin. (full) ; A whale is heavier than a dolphin (full) | — | — | — | — |
| g2u04.gi.superlatives.ag.001 | anagram | The whale is the ___ mammal. [en, 1 blank(s)] | heaviest (full) | — | — | — | — |
| g2u04.gi.superlatives.cp.001 | context-picker | The giraffe is taller than the ostrich and the elephant. [en] | The giraffe is the tallest. (full) | The giraffe is tallest. ; The giraffe is the most tall. ; The giraffe is the most tallest. | — | — | — |
| g2u04.gi.superlatives.ec.001 | error-correction | The whale is the most biggest mammal. [en] | The whale is the biggest mammal. (full) ; the biggest (partial) | — | — | — | — |
| g2u04.gi.superlatives.ec.002 | error-correction | The cheetah is fastest land mammal. [en] | The cheetah is the fastest land mammal. (full) ; the fastest (partial) | — | — | — | — |
| g2u04.gi.superlatives.ec.003 | error-correction | This is the most good book about mammals I have read. [en] | This is the best book about mammals I have read. (full) ; the best (partial) | — | — | — | — |
| g2u04.gi.superlatives.gf.001 | gap-fill | The cheetah is ___ (fast) land mammal. [en, 1 blank(s)] | the fastest (full) | fastest ; the most fast ; the faster | — | — | — |
| g2u04.gi.superlatives.gf.002 | gap-fill | The whale is ___ (heavy) mammal of all. [en, 1 blank(s)] | the heaviest (full) | the most heavy ; heaviest ; the more heavy | — | — | — |
| g2u04.gi.superlatives.gf.003 | gap-fill | A crocodile can be ___ (long) of all crocodiles. [en, 1 blank(s)] | the longest (full) | the most long ; longest ; the longer | — | — | — |
| g2u04.gi.superlatives.gf.004 | gap-fill | The mosquito is ___ (dangerous) for people of all. [en, 1 blank(s)] | the most dangerous (full) | the dangerousest ; most dangerous ; the more dangerous | — | — | — |
| g2u04.gi.superlatives.gf.005 | gap-fill | I think the dolphin is ___ (intelligent) mammal of all. [en, 1 blank(s)] | the most intelligent (full) | the intelligentest ; most intelligent ; the more intelligent | — | — | — |
| g2u04.gi.superlatives.gf.006 | gap-fill | A pig is bad at climbing, but a hippo is ___ (bad) at it. [en, 1 blank(s)] | the worst (full) | the baddest ; the most bad ; worst | — | — | — |
| g2u04.gi.superlatives.gf.007 | gap-fill | The anaconda is one of ___ (long) of all. [en, 1 blank(s)] | the longest (full) | the longer ; longest ; the most long | — | — | — |
| g2u04.gi.superlatives.gs.002 | group-sort | Which is the biggest? [en] | — | — | — | the biggest: tall, long, heavy, fast \| the most difficult: dangerous, intelligent, venomous, powerful | — |
| g2u04.gi.superlatives.mc.001 | multiple-choice | Sam runs faster than anyone in the class. [en] | Sam is the fastest runner in our class. (full) | Sam is the most fastest runner in our class. ; Sam is the faster runner in our class. ; Sam is fastest runner in our class. | — | — | — |
| g2u04.gi.superlatives.mc.002 | multiple-choice | No mammal is more powerful than the whale. [en] | The whale is the most powerful mammal of all. (full) | The whale is the powerfulest mammal of all. ; The whale is most powerful mammal of all. ; The whale is the more powerful mammal of all. | — | — | — |
| g2u04.gi.superlatives.mt.001 | matching | big and the biggest [en] | — | — | good ↔ the best ; bad ↔ the worst ; happy ↔ the happiest ; beautiful ↔ the most beautiful ; big ↔ the biggest | — | — |
| g2u04.gi.superlatives.qf.001 | question-formation | which / tall / a giraffe / an ostrich / an elephant [en] | Which is the tallest? (full) ; Which is the tallest (full) ; Which is the tallest, a giraffe, an ostrich or an elephant? (partial) | — | — | — | — |
| g2u04.gi.superlatives.sb.001 | sentence-building | the / is / cheetah / land mammal / the / fastest [en] | The cheetah is the fastest land mammal. (full) ; The cheetah is the fastest land mammal (full) | most | — | — | — |
| g2u04.gi.superlatives.tf.001 | transformation | The bat is small. No mammal is smaller. (small) The bat is ___. [en, 1 blank(s)] | the smallest mammal (full) ; the bat is the smallest mammal (partial) ; the smallest (partial) | — | — | — | — |
| g2u04.gi.superlatives.tr.001 | translation | Der Wal ist das größte Säugetier. [de] | The whale is the biggest mammal. (full) ; The whale is the biggest mammal (full) | — | — | — | — |
| g2u04.gi.superlatives.tr.002 | translation | Mathe ist das schwierigste Fach. [de] | Maths is the most difficult subject. (full) ; Maths is the most difficult subject (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u04/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u04",
  "lens": "level-gloss",
  "itemsHash": "b34faed5561b",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 116, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
