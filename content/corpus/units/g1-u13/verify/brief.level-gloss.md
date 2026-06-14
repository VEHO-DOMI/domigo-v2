# Verify lens — level-gloss — g1-u13 (round 1)

<!-- domigo:verify level-gloss g1-u13 items=8c52fe76eab1 prompt=aefb997bf664 round=1 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alphabet, Alps, Anderson, Anger, Annie, Arbeit, Archie, Arousing, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Come, Complimenting, Dad, Dan, Dana, Daniel, Darkman, Dave, David, Davis, Debbie, Dialog, Dialoge, Diana, Doctor, Doctors, Don, Dragon, Ellie, Emergency, Emma, Encouraging, England, English, European, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Hammond, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hunt, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Janet, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Kate, Ken, Kitty, Leah, Leo, Lethabo, Leute, Lewis, Li, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Mike, Miss, Mr, Mrs, Mum, New, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Past, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Prepositions, Present, Priestly, Project, Put, Rajit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Sophie, Steve, Sue, Suzy, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, True, Uhr, Um, Vienna, Walker, Wall, Watson, Welcome, Well, White, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (58)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u13.w.accident | a bad thing that you do not want, like when one car hits another car. | One car hits another car on the road. There is an ___ in Bolt Street. | crime ; adventure ; fire | crime ; adventure ; fire ; storm | hits (= stößt gegen) ; another (= ein anderes) ; hits (= stößt gegen) |
| g1u13.w.adventure | an exciting time when something new and a little dangerous is there for you. | Diana and the pilot are in space. That is a great ___! | accident ; crime ; introduction | accident ; crime ; introduction ; democracy | little (= wenig, bisschen) ; pilot (= Pilot/in) ; something (= etwas) |
| g1u13.w.alone | with no people around you. | There were no people on the mountain with me. I was all ___. | young ; wet ; dark | young ; wet ; dark ; windy | around (= um dich herum) |
| g1u13.w.ambulance | the car that takes an ill or hurt person to hospital. | I think my leg is broken. Call an ___! | police ; fire brigade ; coastguard | police ; fire brigade ; coastguard ; helicopter | takes (= bringt) ; person (= Person) ; broken (= gebrochen) |
| g1u13.w.backpack | a bag that you carry on your back. | My phone was not in my hand. It was in my ___. | jetpack ; button ; screen | jetpack ; button ; screen ; medicine | hand (= Hand) ; bag (= Tasche) |
| g1u13.w.button | a small round part that you press to make a machine work. | Diana has to press the ___ to make the robot arm go. | screen ; rock ; backpack | screen ; rock ; backpack ; cloud | round (= rund) ; part (= Teil) ; machine (= Maschine, Gerät) ; robot (= Roboter) |
| g1u13.w.character | a man, woman or child in a story or a film. | In the space story, the ___ I like best is Captain Diana. | adventure ; introduction ; mayor | adventure ; introduction ; mayor ; screen | film (= Film) |
| g1u13.w.class-speaker | A child the others pick to talk to the teacher. | At the beginning of the school year, all of us want Emma to be our ___. | mayor ; democracy ; character | mayor ; democracy ; character ; rescue team | pick (= wählen) ; others (= andere) |
| g1u13.w.cloud | a white or grey thing in the sky that can bring rain. | The sky is dark because a big grey ___ is in front of the sun. | rock ; sky ; screen | rock ; sky ; screen ; forest | rain (= Regen) ; sun (= Sonne) |
| g1u13.w.coastguard | the people who help you when your boat is in danger on the sea. | Their boat is in danger on the sea, so they call the ___ for help. | police ; fire brigade ; ambulance | police ; fire brigade ; ambulance ; mountain rescue | boat (= Boot) ; sea (= Meer) |
| g1u13.w.country | a big place with its own name, like Austria or England. | Austria is a ___ in Europe, and Vienna is its big city. | forest ; space ; crime | forest ; space ; crime ; screen | own (= eigenen) ; europe (= Europa) ; name (= Name) |
| g1u13.w.crime | something very bad that you are not allowed to do. | A robbery is a ___, so you have to call the police. | accident ; adventure ; storm | accident ; adventure ; storm ; fire | allowed (= erlaubt) ; something (= etwas) |
| g1u13.w.dark | with no light, so you cannot see. | It is night and there is no light, so the forest is very ___. | sunny ; wet ; windy | sunny ; wet ; windy ; young | see (= sehen) |
| g1u13.w.democracy | a country where the people pick who is the leader. | In a ___ like Austria, the people vote for a leader. | crime ; country ; adventure | crime ; country ; adventure ; introduction | leader (= Anführer/in) ; pick (= wählen) |
| g1u13.w.earth | the place in space where all people live. | There are no more trees, and the ___ is dying in the year 3231. | space ; forest ; sky | space ; forest ; sky ; country | dying (= stirbt) |
| g1u13.w.fire | the hot, bright, red and orange light that can burn a building. | Help! There is a ___ in Hammond Street, and the building is very hot! | storm ; accident ; rock | storm ; accident ; rock ; cloud | bright (= hell) ; burn (= verbrennen) ; orange (= orange) |
| g1u13.w.fire-brigade | the people you call when a building is hot and red with flames. | Help! There is a fire in our school. Call the ___! | coastguard ; ambulance ; police | coastguard ; ambulance ; police ; mountain rescue | flames (= Flammen) |
| g1u13.w.forest | a big place with a lot of trees. | We go for a long walk in the dark ___ with all its tall trees. | country ; space ; sky | country ; space ; sky ; rock | — |
| g1u13.w.guess-what | you say this before you tell people surprising news. | ___ An amazing thing happened to me on my way to school today! | Tell me more. ; adventure ; crime | Tell me more. ; adventure ; crime ; accident | say (= sagst) ; news (= Neuigkeit) ; way (= Weg) |
| g1u13.w.helicopter | a flying machine that can go up and come down on a small place. | It is too windy, so the ___ from mountain rescue cannot land on the mountain. | jetpack ; ambulance ; backpack | jetpack ; ambulance ; backpack ; screen | flying (= fliegend) ; machine (= Maschine, Gerät) |
| g1u13.w.introduction | the first short part of a story or a book. | Read the ___ to the radio story before you read all of it. | adventure ; character ; crime | adventure ; character ; crime ; screen | part (= Teil) |
| g1u13.w.jetpack | a machine you wear on your back so you can fly up into the sky. | The man from the rescue team can put on a ___ and fly up the mountain. | backpack ; helicopter ; screen | backpack ; helicopter ; screen ; button | machine (= Maschine, Gerät) ; fly (= fliegen) |
| g1u13.w.mayor | the leader of a town or a city. | The ___ of our town can open the new park on Saturday. | class speaker ; character ; democracy | class speaker ; character ; democracy ; screen | leader (= Anführer/in, Oberhaupt) |
| g1u13.w.medicine | something you take when you are ill so that you get well. | On the mountain the rescue team can give you ___ and keep you warm. | backpack ; button ; screen | backpack ; button ; screen ; rock | keep (= halten) ; warm (= warm) ; something (= etwas) ; take (= nehmen) ; get (= bekommen) |
| g1u13.w.mountain-rescue | the team you call to help people who are in danger high up on a hill. | Two climbers are in danger on the mountain and cannot get down. Call ___! | coastguard ; fire brigade ; ambulance | coastguard ; fire brigade ; ambulance ; police | high (= hoch) ; hill (= Berg) ; climbers (= Kletterer) ; get (= bekommen) |
| g1u13.w.police | the people you call when there is a crime. | There is a crime in our street. Call the ___! | ambulance ; fire brigade ; coastguard | ambulance ; fire brigade ; coastguard ; mountain rescue | — |
| g1u13.w.political | about how leaders run a country or a town. | In class today we talk about voting and other ___ things. | young ; wet ; alone | young ; wet ; alone ; sunny | leaders (= Anführer) ; other (= andere) ; things (= Dinge, Themen) |
| g1u13.w.rescue-team | a group of people who help others in danger. | The ___ can come in a helicopter and help the girl on the mountain. | coastguard ; backpack ; screen | coastguard ; backpack ; screen ; ambulance | others (= andere) |
| g1u13.w.rock | a big, hard, heavy stone on a mountain. | It is wet on the mountain because there is a lot of rain on the big ___. | cloud ; backpack ; forest | cloud ; backpack ; forest ; button | hard (= hart) ; heavy (= schwer) ; rain (= Regen) |
| g1u13.w.screen | the flat part of a computer or a TV that you look at. | Diana and the pilot are in front of a big ___ in the spaceship. | button ; rock ; backpack | button ; rock ; backpack ; cloud | flat (= flach) ; part (= Teil) ; pilot (= Pilot/in) ; spaceship (= Raumschiff) ; computer (= Computer) ; tv (= Fernseher) |
| g1u13.w.sky | the big space over you when you look up outside. | It is night on the mountain, and the ___ is very dark. | forest ; rock ; screen | forest ; rock ; screen ; cloud | — |
| g1u13.w.space | the dark place far over the sky where the Earth and the stars are. | People are living on big spaceships in ___, far away from Earth. | forest ; country ; sky | forest ; country ; sky ; screen | stars (= Sterne) ; spaceships (= Raumschiffe) ; far (= weit) |
| g1u13.w.storm | very bad weather with a lot of strong wind and rain. | There is a big ___ tonight, so the sky is dark and it is very windy. | fire ; cloud ; accident | fire ; cloud ; accident ; rock | wind (= Wind) ; rain (= Regen) |
| g1u13.w.storm-2 | a time of bad weather when the wind is very strong and dangerous. | There is a big ___ with very strong wind, and a tree is now on the ground. | accident ; fire ; adventure | accident ; fire ; adventure ; crime | wind (= Wind) ; ground (= Boden) |
| g1u13.w.sunny | when there is a lot of light and no cloud in the sky. | There was no cloud in the sky in the morning. It was a ___ day. | windy ; wet ; dark | windy ; wet ; dark ; young | — |
| g1u13.w.tell-me-more | you say this when you want to hear more. | That is so exciting! ___ I want to hear all of it! | Guess what? ; adventure ; crime | Guess what? ; adventure ; crime ; accident | say (= sagst) ; hear (= hören) |
| g1u13.w.to-arrive | to come to a place at the end of your way. | We wait on the mountain for an hour, and then the rescue team ___. | to slip ; to dream ; to die | to slip ; to dream ; to die ; to chase | way (= Weg) |
| g1u13.w.to-be-in-danger | when you are not safe and something bad can happen to you. | Their boat is on the sea in the storm. The people on it ___. | to be safe ; to be lucky ; to dream | to be safe ; to be lucky ; to dream ; to land | boat (= Boot) ; sea (= Meer) ; something (= etwas) |
| g1u13.w.to-be-lucky | when something good is there for you, so you are very happy. | You fall on the mountain, but you ___ because you have a phone with you. | to be safe ; to be in danger ; to die | to be safe ; to be in danger ; to die ; to dream | something (= etwas) ; fall (= fallen) |
| g1u13.w.to-be-safe | when you are away from danger and nothing bad can happen to you. | The helicopter can take you home, away from the storm. Now you ___! | to be in danger ; to be lucky ; to slip | to be in danger ; to be lucky ; to slip ; to fall down | home (= nach Hause) ; take (= bringen) |
| g1u13.w.to-break | to fall on a bone so that it is in two pieces and you cannot walk. | Be careful on the wet rock or you can fall and ___ your leg. | to slip ; to chase ; to vote | to slip ; to chase ; to vote ; to land | bone (= Knochen) ; fall (= fallen) |
| g1u13.w.to-chase | to run fast after a person or an animal to catch them. | My dog can run fast and ___ the cat all around our garden. | to slip ; to land ; to vote | to slip ; to land ; to vote ; to dream | fast (= schnell) ; person (= Person) ; animal (= Tier) ; cat (= Katze) ; around (= herum) |
| g1u13.w.to-die | to stop living. | If you do not give the flower water, it will ___. | to chase ; to vote ; to land | to chase ; to vote ; to land ; to slip | stop (= aufhören) ; flower (= Blume) ; will (= wird) |
| g1u13.w.to-dream | to see a picture in your head when you are asleep at night. | A man is flying up to you with a jetpack! Are you ill, or do you ___? | to slip ; to radio ; to land | to slip ; to radio ; to land ; to vote | head (= Kopf) ; flying (= fliegend) ; see (= sehen) ; asleep (= schlafend) |
| g1u13.w.to-fall-down | to go down to the ground all of a sudden, often when you slip. | Be careful on the wet rock! You can slip and ___ and hurt your leg. | to land ; to arrive ; to vote | to land ; to arrive ; to vote ; to notice | ground (= Boden) ; sudden (= plötzlich) |
| g1u13.w.to-fly-up-the-mountain | to go up high to the top of a hill in the air, not on your feet. | The man has a jetpack, so he can ___ in only a minute. | to fall down ; to slip ; to radio | to fall down ; to slip ; to radio ; to chase | high (= hoch) ; top (= Spitze, oberster Punkt) ; hill (= Berg) ; air (= Luft) ; only (= nur) |
| g1u13.w.to-happen | when a new thing is there, and it is a big surprise. | Guess what! An amazing thing did ___ to me on my way to school. | to chase ; to vote ; to radio | to chase ; to vote ; to radio ; to notice | way (= Weg) |
| g1u13.w.to-land | to come down from the sky to the ground. | It is too windy, so it is hard for the helicopter to ___ on the mountain. | to slip ; to chase ; to die | to slip ; to chase ; to die ; to dream | ground (= Boden) ; hard (= schwer) |
| g1u13.w.to-notice | to see something new for the first time. | All of a sudden, Diana and the pilot can ___ a small spaceship. | to press ; to radio ; to chase | to press ; to radio ; to chase ; to vote | sudden (= plötzlich) ; pilot (= Pilot/in) ; spaceship (= Raumschiff) ; see (= sehen) ; something (= etwas) |
| g1u13.w.to-press | to put your finger on a button to make a machine work. | Diana has to ___ the button to make the robot arm go. | to notice ; to land ; to chase | to notice ; to land ; to chase ; to slip | machine (= Maschine, Gerät) ; robot (= Roboter) |
| g1u13.w.to-radio | to send your voice to a team that is far away with a small box. | The man can find the girl, and then he has to ___ his team for help. | to land ; to slip ; to dream | to land ; to slip ; to dream ; to notice | send (= schicken) ; voice (= Stimme) |
| g1u13.w.to-shout-for-help | to call out very loud because you are in danger and you need people. | She is alone on the mountain and very scared, so she has to ___. | to slip ; to dream ; to land | to slip ; to dream ; to land ; to chase | loud (= laut) |
| g1u13.w.to-shout-for-help-2 | to use a very loud voice so that people come to you in danger. | She has not got a phone, so all she can do is ___. | to notice ; to press ; to die | to notice ; to press ; to die ; to vote | use (= benutzen) ; loud (= laut) ; voice (= Stimme) ; got (= hat) |
| g1u13.w.to-slip | to fall down because the ground under your feet is wet. | The rock is wet. Be careful or you can ___ and fall down. | to land ; to dream ; to vote | to land ; to dream ; to vote ; to chase | ground (= Boden) |
| g1u13.w.to-vote | to pick a person from a list with your hand or a card. | All the children in our class ___ for a new class speaker. | to chase ; to slip ; to radio | to chase ; to slip ; to radio ; to notice | person (= Person) ; list (= Liste) ; hand (= Hand) ; card (= Zettel, Karte) ; pick (= wählen) |
| g1u13.w.wet | covered in water, not dry. | There is a lot of rain on the mountain, so the rock is ___. | dark ; sunny ; young | dark ; sunny ; young ; windy | covered (= bedeckt) ; dry (= trocken) ; rain (= Regen) |
| g1u13.w.windy | when there is a lot of strong wind outside. | There is a storm on the mountain, so it is very ___. | sunny ; wet ; dark | sunny ; wet ; dark ; young | wind (= Wind) |
| g1u13.w.young | not old. | She is a teenager of 15. She is still very ___. | dark ; wet ; alone | dark ; wet ; alone ; sunny | teenager (= Teenager, Jugendliche/r) ; old (= alt) |

## Grammar items (80)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u13.gi.linking-words.cp.001 | context-picker | Du sagst, warum du Hunde magst. Welcher Satz ist richtig? [de] | I like dogs because they are friendly. (full) | I like dogs because friendly they are. ; I like dogs because of they are friendly. ; I like dogs because are they friendly. | — | — | friendly (= freundlich) |
| g1u13.gi.linking-words.cp.002 | context-picker | Du erzählst von dem Sturm. Welcher Satz ist richtig? [de] | The sky was dark and it was windy. (full) | The sky was dark because it was windy. ; The sky was dark but it was windy. ; The sky was dark or it was windy. | — | — | — |
| g1u13.gi.linking-words.cp.003 | context-picker | Du erklärst, warum Sophia das Handy nehmen konnte. Welcher Satz ist richtig? [de] | She was lucky because her phone was in her backpack. (full) | She was lucky because of her phone was in her backpack. ; She was lucky because her phone in her backpack was. ; She was lucky but her phone was in her backpack. | — | — | — |
| g1u13.gi.linking-words.ec.001 | error-correction | He wanted to climb because it was too windy. [en] | He wanted to climb but it was too windy. (full) ; but (partial) | — | — | — | — |
| g1u13.gi.linking-words.ec.002 | error-correction | I like pizza because is delicious. [en] | I like pizza because it is delicious. (full) ; it (partial) | — | — | — | — |
| g1u13.gi.linking-words.ec.003 | error-correction | I like summer because sunny it is. [en] | I like summer because it is sunny. (full) ; because it is sunny (partial) | — | — | — | summer (= Sommer) |
| g1u13.gi.linking-words.ec.004 | error-correction | I am happy because of I have a dog. [en] | I am happy because I have a dog. (full) ; I'm happy because I have a dog. (full) ; because I have a dog (partial) | — | — | — | — |
| g1u13.gi.linking-words.ec.005 | error-correction | I stayed in my room but I was ill. [en] | I stayed in my room because I was ill. (full) ; I stayed in my room so I was ill. (partial) ; because (partial) | — | — | — | — |
| g1u13.gi.linking-words.ff.001 | free-form | Schreib den Satz fertig: I like summer ___. [de, 1 blank(s)] | because it is sunny (full) ; because it is hot (full) ; but I do not like winter (partial) | — | — | — | — |
| g1u13.gi.linking-words.gf.001 | gap-fill | I was hungry ___ I wanted a sandwich. [en, 1 blank(s)] | and (full) ; so (partial) | — | — | — | — |
| g1u13.gi.linking-words.gf.002 | gap-fill | He was scared ___ it was dark. [en, 1 blank(s)] | because (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.003 | gap-fill | She was tired ___ she was happy. [en, 1 blank(s)] | but (full) ; and (partial) | — | — | — | — |
| g1u13.gi.linking-words.gf.004 | gap-fill | The rocks are wet ___ there was a storm. [en, 1 blank(s)] | because (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.005 | gap-fill | He falls down ___ breaks his leg. [en, 1 blank(s)] | and (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.006 | gap-fill | You are lucky ___ you have a phone with you. [en, 1 blank(s)] | because (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.007 | gap-fill | We wanted to go to the park ___ it was windy. [en, 1 blank(s)] | but (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.008 | gap-fill | She did not go to school ___ she was ill. [en, 1 blank(s)] | because (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.009 | gap-fill | I like dogs ___ my sister likes rabbits. [en, 1 blank(s)] | but (full) ; and (partial) | — | — | — | — |
| g1u13.gi.linking-words.gf.010 | gap-fill | The man gives you medicine ___ helps you. [en, 1 blank(s)] | and (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.011 | gap-fill | I like my school ___ my friends are there. [en, 1 blank(s)] | because (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.012 | gap-fill | Diana wanted to help ___ her friends were in danger. [en, 1 blank(s)] | because (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.013 | gap-fill | It is too windy for a helicopter, ___ the rescue team can help. [en, 1 blank(s)] | but (full) | — | — | — | — |
| g1u13.gi.linking-words.gf.014 | gap-fill | Sophia was alone ___ scared on the mountain. [en, 1 blank(s)] | and (full) | — | — | — | — |
| g1u13.gi.linking-words.gs.001 | group-sort | Sortiere die Sätze: Passt and, but oder because? [de] | — | — | — | and: Tom and Lisa are friends., She slips and falls down., We climbed and played football. \| but: It is old but nice., She is tired but happy., I like dogs but not rabbits. \| because: I stayed in my room because I was ill., She is happy because it is sunny., We were scared because it was dark. | — |
| g1u13.gi.linking-words.gs.002 | group-sort | Sortiere: Welches Bindewort verbindet die beiden Teile? [de] | — | — | — | and: He radios his team and lands next to you., We climbed up and looked down. \| but: We wanted to climb but it was windy., She was scared but she was safe. \| because: You are lucky because you have a phone., He was scared because it was dark. | — |
| g1u13.gi.linking-words.mc.001 | multiple-choice | Welches Wort nennt einen Grund? [de] | because (full) | but ; and ; or | — | — | — |
| g1u13.gi.linking-words.mc.003 | multiple-choice | She slips ___ falls down. [en, 1 blank(s)] | and (full) | but ; because ; or | — | — | — |
| g1u13.gi.linking-words.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | I stayed in my room because I was tired. (full) | I stayed in my room because tired I was. ; I stayed in my room because of I was tired. ; I stayed in my room because was I tired. | — | — | — |
| g1u13.gi.linking-words.mc.005 | multiple-choice | She is happy ___. [en, 1 blank(s)] | because it is sunny (full) | because of it is sunny ; because sunny it is ; because is it sunny | — | — | — |
| g1u13.gi.linking-words.mc.006 | multiple-choice | I like dogs ___ I do not like rabbits. [en, 1 blank(s)] | but (full) | so ; because ; or | — | — | — |
| g1u13.gi.linking-words.mp.001 | matching-pairs | Was passt zusammen? Satzanfang und Grund. [de] | — | — | She stayed in her room because ↔ she was ill. ; He was scared because ↔ it was dark. ; You are lucky because ↔ you have a phone. ; We were happy because ↔ we were safe. | — | — |
| g1u13.gi.linking-words.mt.001 | matching | Welcher Grund passt zu welchem Gefühl? [de] | — | — | I am tired because ↔ I played all day. ; I am happy because ↔ it is my birthday. ; I am sad because ↔ my dog is ill. ; I am hungry because ↔ I did not eat lunch. | — | — |
| g1u13.gi.linking-words.mt.002 | matching | Welcher zweite Teil passt zum ersten? [de] | — | — | It was too windy for a helicopter, but ↔ the rescue team helped you. ; Diana wanted to help because ↔ her friends were in danger. ; He landed next to me and ↔ radioed his team. ; The rocks were wet because ↔ there was a storm. | — | — |
| g1u13.gi.linking-words.qf.001 | question-formation | Schreib den Grund als Antwort. Frage: Why is she happy? (it / be / sunny) [de] | Because it is sunny. (full) ; Because it's sunny. (full) | — | — | — | — |
| g1u13.gi.linking-words.sb.001 | sentence-building | I / like / summer / because / sunny / it / is [en] | I like summer because it is sunny. (full) | — | — | — | summer (= Sommer) |
| g1u13.gi.linking-words.sb.002 | sentence-building | I'm / happy / because / is / it / sunny [en] | I'm happy because it is sunny. (full) | — | — | — | — |
| g1u13.gi.linking-words.sb.003 | sentence-building | She / shouted / for / help / but / was / she / alone [en] | She shouted for help but she was alone. (full) | — | — | — | — |
| g1u13.gi.linking-words.tf.001 | transformation | Verbinde die Sätze mit because: I am tired. I played football. [de] | I am tired because I played football. (full) ; I'm tired because I played football. (full) | — | — | — | — |
| g1u13.gi.linking-words.tf.002 | transformation | Verbinde die Sätze mit because: She is happy. It is sunny. [de] | She is happy because it is sunny. (full) ; She's happy because it's sunny. (full) | — | — | — | — |
| g1u13.gi.linking-words.tf.003 | transformation | Verbinde die Sätze mit but: I wanted an ice cream. The shop was closed. [de] | I wanted an ice cream but the shop was closed. (full) | — | — | — | shop (= Laden, Geschäft) |
| g1u13.gi.linking-words.tf.004 | transformation | Verbinde die Sätze mit and: He lands next to me. He gives me medicine. [de] | He lands next to me and gives me medicine. (full) ; He lands next to me and he gives me medicine. (full) | — | — | — | — |
| g1u13.gi.linking-words.tr.001 | translation | Er war müde, aber er spielte weiter. [de] | He was tired but he played on. (full) ; He was tired but he played football. (partial) | — | — | — | — |
| g1u13.gi.linking-words.tr.002 | translation | Ich bin traurig, weil mein Hund krank ist. [de] | I am sad because my dog is ill. (full) ; I'm sad because my dog is ill. (full) | — | — | — | — |
| g1u13.gi.linking-words.tr.003 | translation | Ich mag den Sommer, weil es sonnig ist. [de] | I like summer because it is sunny. (full) ; I like summer because it's sunny. (full) | — | — | — | summer (= Sommer) |
| g1u13.gi.past-simple-regular.ag.001 | anagram | Die Vergangenheitsform von 'play': [de] | played (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.ag.002 | anagram | Die Vergangenheitsform von 'stop': [de] | stopped (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.ag.003 | anagram | Die Vergangenheitsform von 'carry': [de] | carried (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.cp.001 | context-picker | Sophia erzählt von gestern am Berg. Welcher Satz ist richtig? [de] | I slipped on the wet rocks. (full) | I slip on the wet rocks. ; I sliped on the wet rocks. ; I did slipped on the wet rocks. | — | — | — |
| g1u13.gi.past-simple-regular.cp.002 | context-picker | Du erzählst, was der Rettungsmann gemacht hat. Welcher Satz ist richtig? [de] | He radioed his team and helped me. (full) | He radio his team and help me. ; He radioed his team and helps me. ; He did radio his team and helped me. | — | — | — |
| g1u13.gi.past-simple-regular.ec.001 | error-correction | Yesterday I watch a great film. [en] | Yesterday I watched a great film. (full) ; watched (partial) | — | — | — | — |
| g1u13.gi.past-simple-regular.ec.002 | error-correction | He stoped the car. [en] | He stopped the car. (full) ; stopped (partial) | — | — | — | — |
| g1u13.gi.past-simple-regular.ec.003 | error-correction | The helicopter arriveed an hour later. [en] | The helicopter arrived an hour later. (full) ; arrived (partial) | — | — | — | — |
| g1u13.gi.past-simple-regular.ec.004 | error-correction | I did walked to the park yesterday. [en] | I walked to the park yesterday. (full) ; walked (partial) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.001 | gap-fill | Yesterday Sophia ___ (want) to go up a mountain. [en, 1 blank(s)] | wanted (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.002 | gap-fill | We ___ (play) football after school. [en, 1 blank(s)] | played (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.003 | gap-fill | Yesterday I ___ (walk) to the park. [en, 1 blank(s)] | walked (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.004 | gap-fill | The man with the jetpack ___ (land) next to me. [en, 1 blank(s)] | landed (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.005 | gap-fill | Diana ___ (press) a button and the front of the spaceship opened. [en, 1 blank(s)] | pressed (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.006 | gap-fill | The mountain rescue team ___ (arrive) an hour later. [en, 1 blank(s)] | arrived (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.007 | gap-fill | Suddenly they ___ (notice) a little spaceship. [en, 1 blank(s)] | noticed (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.008 | gap-fill | The bus ___ (stop) at the corner. [en, 1 blank(s)] | stopped (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.009 | gap-fill | They ___ (carry) the bags home. [en, 1 blank(s)] | carried (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.010 | gap-fill | She ___ (slip) on the wet rocks and ___ (shout) for help. [en, 2 blank(s)] | slipped \| shouted (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.011 | gap-fill | Yesterday my dog ___ (chase) our cat and the cat ___ (jump) into a tree. [en, 2 blank(s)] | chased \| jumped (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gf.012 | gap-fill | Then I ___ (notice) my phone and ___ (radio) the rescue team. [en, 2 blank(s)] | noticed \| radioed (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.gs.003 | group-sort | Wird der Konsonant verdoppelt oder nicht? Sortiere die Verben. [de] | — | — | — | like walked: walk, play, want, shout, open, happen \| like stopped: stop, slip, plan, drop | — |
| g1u13.gi.past-simple-regular.gs.004 | group-sort | Nur -d oder y wird zu -ied? Sortiere die Verben. [de] | — | — | — | like arrived: arrive, notice, chase, like, close \| like carried: carry, study | — |
| g1u13.gi.past-simple-regular.mc.001 | multiple-choice | Welche Form ist richtig geschrieben? [de] | stopped (full) | stoped ; stopd ; stoppd | — | — | — |
| g1u13.gi.past-simple-regular.mc.002 | multiple-choice | Welche Form ist richtig geschrieben? [de] | arrived (full) | arriveed ; arrivd ; arryved | — | — | — |
| g1u13.gi.past-simple-regular.mc.003 | multiple-choice | Welche Form ist richtig geschrieben? [de] | carried (full) | carryed ; carryd ; carrd | — | — | — |
| g1u13.gi.past-simple-regular.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | Yesterday I walked to school. (full) | Yesterday I walk to school. ; Yesterday I was walked to school. ; Yesterday I did walked to school. | — | — | — |
| g1u13.gi.past-simple-regular.mp.001 | matching-pairs | Was passt zusammen? [de] | — | — | walk ↔ walked ; play ↔ played ; arrive ↔ arrived ; stop ↔ stopped ; carry ↔ carried ; shout ↔ shouted | — | — |
| g1u13.gi.past-simple-regular.mp.003 | matching-pairs | Was passt zusammen? [de] | — | — | land ↔ landed ; slip ↔ slipped ; notice ↔ noticed ; press ↔ pressed ; chase ↔ chased ; happen ↔ happened | — | — |
| g1u13.gi.past-simple-regular.sb.001 | sentence-building | I / helped / my / mum / yesterday [en] | I helped my mum yesterday. (full) ; Yesterday I helped my mum. (partial) | — | — | — | — |
| g1u13.gi.past-simple-regular.sb.002 | sentence-building | the / helicopter / arrived / an / hour / later [en] | The helicopter arrived an hour later. (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.tf.001 | transformation | Schreib die Vergangenheitsform: play → ___ [de, 1 blank(s)] | played (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.tf.002 | transformation | Schreib die Vergangenheitsform: arrive → ___ [de, 1 blank(s)] | arrived (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.tf.003 | transformation | Schreib die Vergangenheitsform: slip → ___ [de, 1 blank(s)] | slipped (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.tr.001 | translation | Gestern hat sie ihre Oma besucht. [de] | Yesterday she visited her grandma. (full) ; She visited her grandma yesterday. (full) | — | — | — | — |
| g1u13.gi.past-simple-regular.tr.002 | translation | Der Rettungsmann landete neben mir und half mir. [de] | The rescue man landed next to me and helped me. (full) ; The man landed next to me and helped me. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u13/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u13",
  "lens": "level-gloss",
  "itemsHash": "8c52fe76eab1",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 138, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
