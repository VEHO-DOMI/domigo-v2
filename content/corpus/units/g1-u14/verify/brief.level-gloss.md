# Verify lens — level-gloss — g1-u14 (round 2)

<!-- domigo:verify level-gloss g1-u14 items=1e4d4c2a2d9c prompt=aefb997bf664 round=2 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Dad, Dan, Dana, Daniel, Darkman, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Doctor, Doctors, Don, Dragon, Ellie, Emergency, Emma, Encouraging, England, English, European, Every, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Hammond, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hunt, Imperatives, Interviewer, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Janet, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Kate, Ken, Kinds, Kitty, Leah, Leo, Lethabo, Leute, Lewis, Li, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Michael, Mike, Mill, Miriam, Miss, Mr, Mrs, Mum, New, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Past, Paula, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rose, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Sophie, Steve, Sue, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, True, Turan, Uhr, Um, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (59)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u14.w.adventure | an exciting thing that happens, often in a faraway place. | My favourite books are ___ stories about clever children. | friendship ; cover ; poem | friendship ; cover ; poem ; headline | faraway (= weit entfernt) |
| g1u14.w.adventure-story | A book or film about children who do exciting things in faraway places. | The ___ was about children who go to an island to find gold. | romantic story ; detective story ; horror story | romantic story ; detective story ; horror story ; fantasy story | things (= Dinge) ; faraway (= weit entfernt) ; island (= Insel) ; gold (= Gold) |
| g1u14.w.cartoon | a show with drawn people and animals that move. | My ___ are my favourite programme, with funny drawn animals. | the news ; quiz show ; nature programme | the news ; quiz show ; nature programme ; reality show | drawn (= gezeichnet) ; animals (= Tiere) ; move (= sich bewegen) ; funny (= lustig) |
| g1u14.w.comedy | a funny show that makes you laugh. | We watched a funny ___ and we all had to laugh and laugh. | episode ; headline ; power | episode ; headline ; power ; voice | funny (= lustig) |
| g1u14.w.cover | the part on the outside of a book with a picture on it. | Look at the ___ of this book: it has a big dragon on it. | headline ; poem ; spot | headline ; poem ; spot ; voice | part (= Teil) |
| g1u14.w.dead | not alive any more. | The snake fell into the water and now it is ___. | weak ; huge ; tiny | weak ; huge ; tiny ; wide | alive (= lebendig) ; snake (= Schlange) ; fell (= fiel) ; water (= Wasser) |
| g1u14.w.detective-story | A book or film where a clever man or woman finds out who did a crime. | In the ___, a clever inspector finds out who did the robbery. | romantic story ; fantasy story ; adventure story | romantic story ; fantasy story ; adventure story ; horror story | — |
| g1u14.w.drama-series | a show with many parts about the lives of a family. | The new ___ has many parts about one big family. | music video ; cartoon ; the news | music video ; cartoon ; the news ; quiz show | parts (= Teile) |
| g1u14.w.episode | one part of a show that has many parts. | I watched the first ___ and now I want to watch all the others. | headline ; comedy ; cover | headline ; comedy ; cover ; spot | part (= Teil) ; parts (= Teile) ; others (= anderen) |
| g1u14.w.fantasy-film | a show with magic and things that are not real, like dragons. | We watched a ___ with a young magician and a big dragon. | sports programme ; the news ; reality show | sports programme ; the news ; reality show ; quiz show | things (= Dinge) ; real (= echt, wirklich) ; dragons (= Drachen) ; magician (= Zauberer) |
| g1u14.w.fantasy-story | A book or film with magic and things that are not real. | I am reading a ___ about a school for young magicians. | detective story ; horror story ; adventure story | detective story ; horror story ; adventure story ; romantic story | real (= echt, wirklich) ; magicians (= Zauberer) |
| g1u14.w.friendship | when two people are good friends and like each other very much. | Is this a story about ___ between two best friends? | adventure ; cover ; poem | adventure ; cover ; poem ; power | each (= einander (each other)) ; other (= einander (each other)) ; between (= zwischen) |
| g1u14.w.gamer | a child or grown-up who plays computer games very much. | My big sister is a ___ and plays computer games for many hours. | shopkeeper ; neighbour ; detective | shopkeeper ; neighbour ; detective ; singer | grown-up (= Erwachsener) ; hours (= Stunden) |
| g1u14.w.headline | the big words over a news story that tell you what it is about. | What is the news ___ today over the big story? | episode ; cover ; voice | episode ; cover ; voice ; poem | words (= Wörter) ; news (= Nachrichten) |
| g1u14.w.horror-story | A book or film that is made to make you very scared. | The ___ about the dark castle was so scary that I was scared all night. | romantic story ; adventure story ; fantasy story | romantic story ; adventure story ; fantasy story ; detective story | scary (= gruselig) |
| g1u14.w.huge | very, very big. | An elephant is a ___ animal, much bigger than a dog. | tiny ; weak ; wide | tiny ; weak ; wide ; dead | animal (= Tier) |
| g1u14.w.inside | in something, not out in the open. | It was raining, so we stayed ___ all afternoon. | huge ; wide ; tiny | huge ; wide ; tiny ; weak | something (= etwas) ; raining (= regnen) |
| g1u14.w.kind-of | a type of, a sort of. | What ___ music do you like, pop or rock? | quite ; latest ; inside | quite ; latest ; inside ; huge | type (= Art, Sorte) ; sort (= Sorte) ; music (= Musik) ; pop (= Pop) |
| g1u14.w.lake | a very big place with a lot of water and land all around it. | One day a giraffe came to the ___ to drink some water. | river ; leaf ; skin | river ; leaf ; skin ; spot | water (= Wasser) ; around (= herum) ; came (= kam) |
| g1u14.w.latest | the most new, the one that is from today and not from before. | Have you heard their ___ song? It is their most new one. | huge ; tiny ; wide | huge ; tiny ; wide ; weak | heard (= gehört) |
| g1u14.w.leaf | a flat green thing that grows on a tree. | The giraffe gives the leopard some magic ___ from the tree. | lake ; skin ; spot | lake ; skin ; spot ; cover | flat (= flach) ; green (= grün) ; grows (= wächst) ; leopard (= Leopard) |
| g1u14.w.music-video | a short show for a song, with the singer and the band. | Have you watched the new ___ with the singer and her band? | the news ; quiz show ; nature programme | the news ; quiz show ; nature programme ; reality show | — |
| g1u14.w.nature-programme | a show about animals and the places where they live. | I love that ___ with real lions and elephants in Africa. | quiz show ; music video ; the news | quiz show ; music video ; the news ; cartoon | animals (= Tiere) ; real (= echt, wirklich) ; Africa (= Afrika) |
| g1u14.w.neighbour | somebody who lives next to you or very near you. | Our ___ next door has a big dog that barks at night. | shopkeeper ; gamer ; detective | shopkeeper ; gamer ; detective ; singer | next (= neben (next to)) ; barks (= bellt) |
| g1u14.w.once-upon-a-time | the first words of many fairy tales, before the story begins. | ___, in a land far away, there was a big lion. | one day ; weekend ; midnight | one day ; weekend ; midnight ; tonight | words (= Wörter) ; fairy (= Märchen- (fairy tale)) ; tales (= Geschichten, Märchen) |
| g1u14.w.one-day | At some time long ago, in a book. | ___, a giraffe came to the lake near the big wood. | once upon a time ; weekend ; tonight | once upon a time ; weekend ; tonight ; midnight | came (= kam) ; wood (= Wald) ; ago (= vor langer Zeit) |
| g1u14.w.poem | a short text with lines that often sound nice. | I read a ___ about watching TV with my mum and dad. | cover ; headline ; adventure | cover ; headline ; adventure ; friendship | lines (= Zeilen) ; sound (= klingen) ; TV (= Fernsehen) |
| g1u14.w.power | a special, magic thing that lets you do what others cannot do. | The remote control has a special ___ and can make people stop. | voice ; skin ; cover | voice ; skin ; cover ; spot | special (= besonders) ; lets (= lässt) ; others (= andere) ; stop (= anhalten, stehen bleiben) |
| g1u14.w.quite | more than a little, but not very. | I ___ like detective stories, but I love nature programmes more. | latest ; inside ; huge | latest ; inside ; huge ; wide | little (= wenig, ein bisschen) |
| g1u14.w.quiz-show | On TV, people answer questions here and can win money. | She is on a TV ___ and gives the answer to win a lot of money. | nature programme ; romantic film ; music video | nature programme ; romantic film ; music video ; the news | answer (= Antwort) ; questions (= Fragen) ; win (= gewinnen) ; TV (= Fernsehen) |
| g1u14.w.reality-show | On TV, real people, not famous ones, do things and you watch them. | My sister watches a ___ with real people in one big house. | nature programme ; the news ; cartoon | nature programme ; the news ; cartoon ; quiz show | real (= echt, wirklich) ; things (= Dinge) ; house (= Haus) |
| g1u14.w.remote-control | a small thing you use to change the programme on TV. | You use a ___ to change the programme on TV from the sofa. | headline ; screen ; cover | headline ; screen ; cover ; power | use (= benutzen) ; change (= wechseln) ; TV (= Fernsehen) ; sofa (= Sofa) |
| g1u14.w.romantic-film | a show about a girl and a boy who are very much in love. | My mum likes a ___ about a girl and a boy who are very much in love. | horror story ; sports programme ; the news | horror story ; sports programme ; the news ; quiz show | — |
| g1u14.w.romantic-story | A book or film about two people who are very much in love. | She likes a ___ about a prince and a girl who are in love. | horror story ; detective story ; adventure story | horror story ; detective story ; adventure story ; fantasy story | prince (= Prinz) |
| g1u14.w.science-fiction-film | a show about robots, about space, or about life a long time from now. | The ___ was about people who go to space and meet robots. | nature programme ; the news ; romantic film | nature programme ; the news ; romantic film ; quiz show | robots (= Roboter) |
| g1u14.w.screen-time | the hours you spend looking at a phone, a tablet or a TV. | Every day we spend three hours of ___ on a tablet or a phone. | screen ; remote control ; headline | screen ; remote control ; headline ; weekend | hours (= Stunden) ; phone (= Handy) ; TV (= Fernsehen) |
| g1u14.w.shopkeeper | somebody who has a small shop and sells things in it. | The ___ behind the desk helped me find a good book. | neighbour ; gamer ; detective | neighbour ; gamer ; detective ; singer | shop (= Laden, Geschäft) ; things (= Dinge) |
| g1u14.w.skin | the part on the outside of your body that the sun can make red. | The lion has yellow ___, and the giraffe has black spots. | voice ; spot ; power | voice ; spot ; power ; cover | part (= Teil) ; body (= Körper) ; sun (= Sonne) ; yellow (= gelb) |
| g1u14.w.sports-programme | a show about football, tennis and more games. | We watched the big football match on the ___ on TV. | the news ; cartoon ; romantic film | the news ; cartoon ; romantic film ; quiz show | football (= Fußball) ; tennis (= Tennis) ; games (= Spiele) ; TV (= Fernsehen) |
| g1u14.w.spot | a small round mark on a thing. | The giraffe has black ___ all over its yellow skin. | skin ; voice ; cover | skin ; voice ; cover ; power | round (= rund) ; yellow (= gelb) |
| g1u14.w.the-news | a programme that tells you about today in your country and all over the world. | My dad watches ___ at eight to hear about today in the world. | cartoon ; music video ; quiz show | cartoon ; music video ; quiz show ; reality show | tells (= erzählt) ; hear (= hören) ; world (= Welt) |
| g1u14.w.tiny | very, very small. | An ant is a ___ animal, much smaller than a dog. | huge ; wide ; weak | huge ; wide ; weak ; dead | ant (= Ameise) ; animal (= Tier) |
| g1u14.w.to-bend-down | to move the top of your body down low. | I have to ___ low to look under my bed. | to hug ; to hold ; to lie | to hug ; to hold ; to lie ; to fight | move (= bewegen) ; top (= oberer Teil) ; body (= Körper) ; low (= tief, nach unten) |
| g1u14.w.to-disappear | to go away so that nobody can find you. | Andrew turned the magic ring three times and started to ___. | to fight ; to hug ; to sell | to fight ; to hug ; to sell ; to lie | nobody (= niemand) ; turned (= drehte) ; ring (= Ring) ; started (= begann) |
| g1u14.w.to-fight | to use your hands hard, like two angry people who both want one thing. | The two boys want to ___ over the last cake on the plate. | hold ; sell ; pay | hold ; sell ; pay ; freeze | use (= benutzen) ; hands (= Hände) ; hard (= fest, heftig) |
| g1u14.w.to-freeze | to stop and stand very still, like a picture that does not move. | If you press the button, the people on the screen ___ and cannot move. | sell ; pay ; hold | sell ; pay ; hold ; fight | stop (= aufhören) ; stand (= stehen) ; move (= sich bewegen) |
| g1u14.w.to-hold | to have a thing in your hand and not let it go. | Can you ___ this book in your hand for me, please? | sell ; pay ; fight | sell ; pay ; fight ; freeze | hand (= Hand) ; let (= lassen) |
| g1u14.w.to-hug | to put your arms around somebody to show you like them. | The weak leopard asked the giraffe to ___ him. | to fight ; to hold ; to sell | to fight ; to hold ; to sell ; to bend down | arms (= Arme) ; around (= herum) ; leopard (= Leopard) |
| g1u14.w.to-lie | to have your body flat and still, like on a bed. | After the long day, I want to ___ on the sofa and read a book. | to hug ; to hold ; to bend down | to hug ; to hold ; to bend down ; to fight | body (= Körper) ; flat (= flach, ausgestreckt) ; sofa (= Sofa) |
| g1u14.w.to-pay | to give money for a thing you want to have. | I want to ___ three pounds for this book at the shop. | sell ; hold ; freeze | sell ; hold ; freeze ; fight | shop (= Laden, Geschäft) |
| g1u14.w.to-point-to | to show where a thing is with your finger. | She used her finger to ___ the small button with a star on it. | to hold ; to hug ; to sell | to hold ; to hug ; to sell ; to reply | star (= Stern) |
| g1u14.w.to-reply | to say a thing back to somebody who asked you. | I asked Tom, but he did not ___ all day. | to sell ; to hold ; to pay | to sell ; to hold ; to pay ; to spend | say (= sagen) |
| g1u14.w.to-sell | to give a thing to somebody for money. | He wants to ___ his car for a lot of money. | pay ; hold ; freeze | pay ; hold ; freeze ; fight | — |
| g1u14.w.to-spend | to use your time doing a thing. | We ___ a lot of time watching shows on TV. | to stream ; to reply ; to hold | to stream ; to reply ; to hold ; to sell | use (= benutzen, nutzen) ; TV (= Fernsehen) |
| g1u14.w.to-stream | to watch a show on the internet. | We sometimes ___ a new show on our tablet at the weekend. | to sell ; to pay ; to reply | to sell ; to pay ; to reply ; to spend | internet (= Internet) |
| g1u14.w.voice | the sound you make when you talk or sing. | She is a great singer with a beautiful ___. | skin ; power ; spot | skin ; power ; spot ; cover | sound (= Geräusch, Klang) ; sing (= singen) |
| g1u14.w.weak | not strong. | After a week in bed, the leopard was very tired and ___. | huge ; tiny ; wide | huge ; tiny ; wide ; dead | leopard (= Leopard) |
| g1u14.w.weekend | Saturday and Sunday, the days with no school. | Saturday and Sunday are the ___, so we have no school. | bedtime ; midnight ; midday | bedtime ; midnight ; midday ; break | — |
| g1u14.w.wide | big from one side to the other side. | There is a very ___ road near our school, with room for many cars. | huge ; tiny ; weak | huge ; tiny ; weak ; dead | side (= Seite) ; other (= andere) |

## Grammar items (62)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u14.gi.past-simple-irregular.ag.008 | anagram | Wie heißt 'go' gestern? [de] | went (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.ag.009 | anagram | Wie heißt 'see' gestern? [de] | saw (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.ag.010 | anagram | Wie heißt 'take' gestern? [de] | took (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.ag.011 | anagram | Wie heißt 'think' gestern? [de] | thought (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.ag.012 | anagram | Wie heißt 'bring' gestern? [de] | brought (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.ag.013 | anagram | Wie heißt 'catch' gestern? [de] | caught (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.ag.014 | anagram | Wie heißt 'freeze' gestern? [de] | froze (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.cp.001 | context-picker | Du erzählst deiner Lehrerin von gestern. Welcher Satz ist richtig? [de] | I ate lunch at school yesterday. (full) | I eated lunch at school yesterday. ; I eat lunch at school yesterday. ; I ated lunch at school yesterday. | — | — | — |
| g1u14.gi.past-simple-irregular.cp.002 | context-picker | Du erzählst von der Geschichte mit der Fernbedienung. Welcher Satz ist richtig? [de] | Tom froze and then Annie ran away. (full) | Tom freezed and then Annie ran away. ; Tom froze and then Annie runned away. ; Tom freezed and then Annie runned away. | — | — | — |
| g1u14.gi.past-simple-irregular.ec.001 | error-correction | Annie catched the ball in the game. [en] | Annie caught the ball in the game. (full) ; caught (partial) | — | — | — | — |
| g1u14.gi.past-simple-irregular.ec.002 | error-correction | Tom thinked about it all day. [en] | Tom thought about it all day. (full) ; thought (partial) | — | — | — | — |
| g1u14.gi.past-simple-irregular.ec.003 | error-correction | Jill writed a story about her dog. [en] | Jill wrote a story about her dog. (full) ; wrote (partial) | — | — | — | — |
| g1u14.gi.past-simple-irregular.ec.004 | error-correction | The police catched the robber and holded him. [en] | The police caught the robber and held him. (full) ; caught \| held (partial) | — | — | — | — |
| g1u14.gi.past-simple-irregular.gf.001 | gap-fill | Yesterday Annie ___ (go) into the shop. [en, 1 blank(s)] | went (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.gf.002 | gap-fill | Annie ___ (see) a remote control in the window. [en, 1 blank(s)] | saw (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.gf.003 | gap-fill | We ___ (have) milk and bread for breakfast. [en, 1 blank(s)] | had (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.gf.004 | gap-fill | The robber ___ (hold) a gun in his hand. [en, 1 blank(s)] | held (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.gf.005 | gap-fill | Jill ___ (find) a ring on the park bench. [en, 1 blank(s)] | found (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.gf.006 | gap-fill | The shop ___ (sell) lots of things. [en, 1 blank(s)] | sold (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.gf.007 | gap-fill | Yesterday I ___ (take) the bus and ___ (come) to school early. [en, 2 blank(s)] | took \| came (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.gf.008 | gap-fill | Annie ___ (read) the book and then ___ (put) it on the desk. [en, 2 blank(s)] | read \| put (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.gs.003 | group-sort | Sortiere die Verben: mit -ed oder mit eigener Form? [de] | — | — | — | like walked: walk, play, want, open, watch \| like went: go, see, take, have, come, make | — |
| g1u14.gi.past-simple-irregular.gs.004 | group-sort | Sortiere nach dem Klang am Ende. [de] | — | — | — | like thought: thought, brought, caught, fought \| like told: told, sold, held | — |
| g1u14.gi.past-simple-irregular.mc.003 | multiple-choice | Welche Form ist FALSCH geschrieben? [de] | goed (full) | went ; saw ; took | — | — | — |
| g1u14.gi.past-simple-irregular.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | She made a beautiful cake. (full) | She maked a beautiful cake. ; She maded a beautiful cake. ; She makes a beautiful cake yesterday. | — | — | — |
| g1u14.gi.past-simple-irregular.mc.007 | multiple-choice | Wie heißt 'eat' gestern? [de] | ate (full) | eated ; eat ; eats | — | — | — |
| g1u14.gi.past-simple-irregular.mc.008 | multiple-choice | Wie heißt 'run' gestern? [de] | ran (full) | runned ; runs ; running | — | — | — |
| g1u14.gi.past-simple-irregular.mc.009 | multiple-choice | Wie heißt 'give' gestern? [de] | gave (full) | gived ; gives ; given | — | — | — |
| g1u14.gi.past-simple-irregular.mc.010 | multiple-choice | Wie heißt 'pay' gestern? [de] | paid (full) | payed ; pays ; paying | — | — | — |
| g1u14.gi.past-simple-irregular.mp.003 | matching-pairs | Was passt zusammen? [de] | — | — | eat ↔ ate ; drink ↔ drank ; write ↔ wrote ; give ↔ gave ; think ↔ thought ; find ↔ found | — | — |
| g1u14.gi.past-simple-irregular.mp.004 | matching-pairs | Was passt zusammen? [de] | — | — | pay ↔ paid ; sell ↔ sold ; hold ↔ held ; catch ↔ caught ; bring ↔ brought ; tell ↔ told | — | — |
| g1u14.gi.past-simple-irregular.mt.002 | matching | Was passt zusammen? [de] | — | — | go ↔ went ; see ↔ saw ; take ↔ took ; have ↔ had ; come ↔ came | — | — |
| g1u14.gi.past-simple-irregular.tf.004 | transformation | Erzähl es von gestern: I drink tea. → I ___ tea. [de, 1 blank(s)] | drank (full) ; I drank tea. (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.tf.005 | transformation | Erzähl es von gestern: Andrew gets a present. → Andrew ___ a present. [de, 1 blank(s)] | got (full) ; Andrew got a present. (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.tf.006 | transformation | Erzähl es von gestern: Jill tells Andrew a story. → Jill ___ Andrew a story. [de, 1 blank(s)] | told (full) ; Jill told Andrew a story. (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.tr.001 | translation | Ich bin gestern in die Schule gegangen. [de] | I went to school yesterday. (full) ; Yesterday I went to school. (full) | — | — | — | — |
| g1u14.gi.past-simple-irregular.tr.002 | translation | Sie sah eine Katze und nahm ein Foto. [de] | She saw a cat and took a photo. (full) ; She saw a cat and she took a photo. (full) | — | — | — | photo (= Foto) |
| g1u14.gi.past-simple-negative.cp.001 | context-picker | Du erzählst, dass du den Krimi nicht gelesen hast. Welcher Satz ist richtig? [de] | I didn't read the detective story. (full) | I didn't liked the detective story. ; I didn't watched the detective story. ; I wasn't read the detective story. | — | — | — |
| g1u14.gi.past-simple-negative.cp.002 | context-picker | Deine Freundin hat gestern nicht ferngesehen. Welcher Satz ist richtig? [de] | She didn't watch the cartoon yesterday. (full) | She didn't watched the cartoon yesterday. ; She wasn't watch the cartoon yesterday. ; She don't watch the cartoon yesterday. | — | — | — |
| g1u14.gi.past-simple-negative.ec.001 | error-correction | Finde und verbessere den Fehler: He didn't went to the cinema. [de] | He didn't go to the cinema. (full) ; He did not go to the cinema. (full) ; go (partial) | — | — | — | — |
| g1u14.gi.past-simple-negative.ec.002 | error-correction | Finde und verbessere den Fehler: She didn't liked the romantic film. [de] | She didn't like the romantic film. (full) ; She did not like the romantic film. (full) ; like (partial) | — | — | — | — |
| g1u14.gi.past-simple-negative.ec.003 | error-correction | Finde und verbessere den Fehler: She wasn't watch the sports programme. [de] | She didn't watch the sports programme. (full) ; She did not watch the sports programme. (full) ; didn't watch (partial) | — | — | — | — |
| g1u14.gi.past-simple-negative.gf.001 | gap-fill | I ___ (not/read) the detective story. [en, 1 blank(s)] | didn't read (full) ; did not read (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.gf.002 | gap-fill | She ___ (not/like) the horror film. [en, 1 blank(s)] | didn't like (full) ; did not like (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.gf.003 | gap-fill | They ___ (not/watch) the news. [en, 1 blank(s)] | didn't watch (full) ; did not watch (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.gf.004 | gap-fill | He ___ (not/go) to the cinema, so he ___ (not/see) the fantasy film. [en, 2 blank(s)] | didn't go \| didn't see (full) ; did not go \| did not see (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.gf.005 | gap-fill | We ___ (not/have) screen time, so we ___ (not/watch) a film. [en, 2 blank(s)] | didn't have \| didn't watch (full) ; did not have \| did not watch (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.gf.006 | gap-fill | Tom ___ (not/tell) me about the cartoon, and I ___ (not/find) the remote control. [en, 2 blank(s)] | didn't tell \| didn't find (full) ; did not tell \| did not find (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.gs.002 | group-sort | Welche Sätze mit didn't sind richtig, welche falsch? [de] | — | — | — | ✓: I didn't go to the cinema., She didn't see the film., We didn't watch the news., He didn't like the cartoon. \| ✗: I didn't went to the cinema., She didn't saw the film., We didn't watched the news., He didn't liked the cartoon. | — |
| g1u14.gi.past-simple-negative.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | She didn't watch the horror film. (full) | She didn't watched the horror film. ; She didn't saw the horror film. ; She wasn't watch the horror film. | — | — | — |
| g1u14.gi.past-simple-negative.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | They didn't read the detective story. (full) | They didn't told the detective story. ; They didn't liked the detective story. ; They wasn't read the detective story. | — | — | — |
| g1u14.gi.past-simple-negative.mc.004 | multiple-choice | Welcher Satz mit didn't ist richtig? He ___ to the lake. [de, 1 blank(s)] | didn't go (full) | didn't went ; didn't goed ; wasn't go | — | — | — |
| g1u14.gi.past-simple-negative.mp.001 | matching-pairs | Was passt zusammen? Falsche Form und richtige Form. [de] | — | — | didn't went ↔ didn't go ; didn't saw ↔ didn't see ; didn't ate ↔ didn't eat ; didn't liked ↔ didn't like ; didn't watched ↔ didn't watch | — | — |
| g1u14.gi.past-simple-negative.mt.001 | matching | Welcher Satzanfang passt zu welchem Ende? [de] | — | — | She didn't read ↔ the Sherlock Holmes stories. ; We didn't like ↔ the fantasy film. ; They didn't listen ↔ to Mum. ; He didn't catch ↔ the giraffe. | — | — |
| g1u14.gi.past-simple-negative.qf.001 | question-formation | Aussage: He watched the news. Frag verneint nach: Stimmt das nicht? Bilde: He ___ the news. [de, 1 blank(s)] | He didn't watch the news. (full) ; He did not watch the news. (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.sb.001 | sentence-building | She / didn't / the / film / like / romantic [en] | She didn't like the romantic film. (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.sb.002 | sentence-building | They / to / didn't / Mum / listen [en] | They didn't listen to Mum. (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.tf.001 | transformation | Mach den Satz verneint: She watched the horror film. (not) [de] | She didn't watch the horror film. (full) ; She did not watch the horror film. (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.tf.002 | transformation | Mach den Satz verneint: They ran away. (not) [de] | They didn't run away. (full) ; They did not run away. (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.tf.003 | transformation | Mach den Satz verneint: He ate all the chocolate. (not) [de] | He didn't eat all the chocolate. (full) ; He did not eat all the chocolate. (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.tr.001 | translation | Ich habe den Film nicht gesehen. [de] | I didn't see the film. (full) ; I did not see the film. (full) | — | — | — | — |
| g1u14.gi.past-simple-negative.tr.002 | translation | Sie hat das Buch nicht gelesen. [de] | She didn't read the book. (full) ; She did not read the book. (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u14/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u14",
  "lens": "level-gloss",
  "itemsHash": "1e4d4c2a2d9c",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 121, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
