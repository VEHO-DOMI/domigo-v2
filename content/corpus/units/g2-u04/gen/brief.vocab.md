# Vocab generation brief — g2-u04 (MORE! 2, Unit 4)

<!-- domigo:gen vocab g2-u04 bank=072502363e27 prompt=346902f9f0f1 -->

<!-- domigo:prompt shared-rules v=1 -->
# Shared content rules (every generator and fixer reads these)

You are authoring practice items for Austrian AHS students (10–14, EFL, MORE! textbooks,
A1→A2). A broken item in front of a child is the failure that matters most. The v1 app
died on content quality — these rules are the law:

1. **The textbook is the source of truth.** Carrier sentences come from the textbook
   FIRST: the master list's example sentence (`exampleSb`), then a sentence from the
   SB/WB transcript (verbatim or minimally adapted), invention is the LAST resort.
   Record honestly in `sSource`/`sbRef`: `masterlist` | `sb` | `wb` | `invented`.
2. **The cumulative word bank is the level gate.** Every English word a student sees
   (carriers, definitions, distractors, options, pair sides, group members) must be
   taught at or below this unit — the brief lists the allowed vocabulary. Anything
   above level MUST carry an inline gloss recorded in the item's `gloss[]` array and
   appear in the text exactly as written. Glossing is the exception, not the routine:
   prefer rephrasing with taught words. A deterministic validator REJECTS any unglossed
   unknown token — do not gamble.
3. **Answer sets are forgiving and correct.** Accept EVERY variant that is correct in
   the sentence (tier `full`); near-synonyms / reasonable-but-imperfect alternatives go
   in as tier `partial`. Never demand a citation form that makes the sentence
   ungrammatical. Spelling tolerance (`close`) is computed by the grader — never author
   misspellings.
4. **German is informal du-form, always.** Never "Sie/Ihnen/Ihr" as address. Natural,
   age-appropriate German (Austrian standard; ß/ä/ö/ü correct — never ASCII "ue").
5. **Zero meta-talk in student-facing carriers.** No grammar terminology in prompts,
   carriers, answers, distractors, options ("past simple", "modal verb", …) — the task
   shows, it never lectures. Instruction text lives in the renderer, NOT in your prompt
   text. EXCEPTION: `hintDe`/`explainDe` MAY use the light German grammar vocabulary the
   textbook itself uses (Grundform, Vergangenheit, Verneinung …) — English grammar
   jargon is banned even there.
6. **v1 seeds are UNTRUSTED.** The brief includes v1 items as idea material. Known v1
   defect classes: invented above-level carrier words, out-of-bank MC distractors,
   over-strict answer sets, meta-talk. Mine them; never copy unverified.
7. **Distractors are real words from the bank**, plausible but unambiguously wrong in
   context, never lemma-variants of an accepted answer.
8. **Pairs and groups are English↔English** (sentence halves, question↔answer,
   category sorting). German belongs in translation surfaces only.
9. **Difficulty is honest:** 1 = recognition/single-token, 2 = guided production,
   3 = free production / multi-step. Spread items across difficulties.
10. **Blanks** are `___` (3+ underscores). Multi-blank answers join per-blank fills
    with ` | ` in blank order.

<!-- domigo:prompt gen-vocab v=1 -->
# Vocab item generation

Produce EXACTLY ONE vocab item per word-bank entry listed in the brief (no more, no
fewer). Each item exercises one word across all its surfaces:

- `d` — an English definition in taught-only words that does NOT contain the headword
  or any inflection of it. Simple, concrete, age-appropriate.
- `s` — the carrier sentence with exactly one `___` blank where the headword (or one of
  its forms) fits. Textbook sentences first (rule 1). The sentence must make the word
  unambiguous (a sentence where five other bank words also fit is a bad carrier).
- `sAnswers` — every form of the headword that is correct in the blank (tier full);
  defensible alternatives as partial. The blank-substituted sentence must be
  grammatical for every full answer (watch a/an, singular/plural, capitalization).
- `dAnswers` — accepted answers when the student produces the word from the definition
  (headword + natural variants).
- `translation.deToEn` — the German prompt is the bank's German; answers = every correct
  English rendering (full) + near-misses (partial).
- `translation.enToDe` — answers = every natural German rendering (full) + acceptable
  variants (partial). Both directions must be INDEPENDENTLY correct.
- `mc` — exactly 3 distractors, in-bank, same word class where possible, plausible but
  clearly wrong for the definition/sentence.
- `gameMeta.distractorPool` — ≥4 in-bank wrong options for game encounters (may extend
  `mc`); `chipBudget` null unless chip-input makes sense; `minOptions` 4.
- `hintDe` — one short du-form German nudge (meaning hint, not the answer).
- `gloss` — ONLY if the carrier/definition truly needs an above-level word (rule 2).
- `difficulty` — 1–3 honestly (frequency + abstractness + production load).

Quality bar: a teacher reading any single item should find nothing to fix.

## Word bank (one item per row — this is your work list)

| id | en | de | kind | theme | exampleSb | cf | forms |
|---|---|---|---|---|---|---|---|
| g2u04.w.mosquito | mosquito | Moskito ; Stechmücke | wordfile | Animals | — | — | mosquito |
| g2u04.w.pigeon | pigeon | Taube | wordfile | Animals | — | — | pigeon |
| g2u04.w.parrot | parrot | Papagei | wordfile | Animals | — | — | parrot |
| g2u04.w.ostrich | ostrich | Strauß | wordfile | Animals | — | — | ostrich |
| g2u04.w.chimpanzee | chimpanzee | Schimpanse | wordfile | Animals | — | — | chimpanzee |
| g2u04.w.antelope | antelope | Antilope | wordfile | Animals | — | — | antelope |
| g2u04.w.bat | bat | Fledermaus | wordfile | Animals | — | — | bat |
| g2u04.w.giraffe | giraffe | Giraffe | wordfile | Animals | — | — | giraffe |
| g2u04.w.rhino | rhino | Nashorn | wordfile | Animals | — | — | rhino |
| g2u04.w.cheetah | cheetah | Gepard | wordfile | Animals | — | — | cheetah |
| g2u04.w.anaconda | anaconda | Anakonda | wordfile | Animals | — | — | anaconda |
| g2u04.w.crocodile | crocodile | Krokodil | wordfile | Animals | — | — | crocodile |
| g2u04.w.dolphin | dolphin | Delfin | wordfile | Animals | — | — | dolphin |
| g2u04.w.whale | whale | Wal | wordfile | Animals | — | — | whale |
| g2u04.w.shark | shark | Hai | wordfile | Animals | — | — | shark |
| g2u04.w.ago | (two days) ago | vor (zwei Tagen) | phrase | — | Two days ago, I saw a crocodile. | — | ago ; ago two days |
| g2u04.w.farmer | farmer | Bauer/Bäuerin | phrase | — | A farmer saw a huge crocodile. | — | farmer |
| g2u04.w.human | human | Mensch | phrase | — | I wanted to show the animal that not all humans are bad. | — | human |
| g2u04.w.incredible | incredible | unglaublich | phrase | — | That's an incredible but true story. | — | incredible |
| g2u04.w.dangerous | dangerous | gefährlich | phrase | — | The taipan snake can be very dangerous. | — | dangerous |
| g2u04.w.hairy | hairy | haarig ; stark behaart | phrase | — | My pet rat has got lots of fur. It's very hairy. | — | hairy |
| g2u04.w.heavy | heavy | schwer | phrase | — | This bag is too heavy. I can't carry it. | — | heavy |
| g2u04.w.strong | strong | stark | phrase | — | I'm not as strong as my best friend. | — | strong |
| g2u04.w.climate-change | climate change | Klimawandel | phrase | — | Many animals die because of climate change. | — | climate change |
| g2u04.w.fast | fast | schnell | phrase | — | Cheetahs can run very fast. | — | fast |
| g2u04.w.female | female | weiblich ; Weibchen (Tierwelt) | phrase | — | The female is dark green. | — | female |
| g2u04.w.male | male | männlich | phrase | — | The male toad is golden red. | — | male |
| g2u04.w.nobody | nobody | niemand | phrase | — | Nobody knows why the paradise parrot became extinct. | — | nobody |
| g2u04.w.scientist | scientist | Wissenschaftler/Wissenschaftlerin | phrase | — | I want to become a scientist and study animals. | — | scientist |
| g2u04.w.to-die-out | to die out | aussterben | phrase | — | Many animals are dying out. | die out | to die out ; die out |
| g2u04.w.less | less | weniger | phrase | — | The rhino was fast, but less than 60 km/h. | — | less |
| g2u04.w.to-carry | to carry | tragen ; übertragen | phrase | — | Mosquitos can carry malaria. | carry | to carry ; carry |
| g2u04.w.centimetre | centimetre | Zentimeter | phrase | — | One centimetre is 10 millimetres. | — | centimetre |
| g2u04.w.desert | desert | Wüste | phrase | — | There are no deserts in England. | — | desert |
| g2u04.w.to-die | to die | sterben | phrase | — | Millions of people die from malaria. | die | to die ; die |
| g2u04.w.mammal | mammal | Säugetier | phrase | — | Elephants and lions are mammals. | — | mammal |
| g2u04.w.ton | ton | Tonne (1000 kg) | phrase | — | One ton is 1000 kg. | — | ton |
| g2u04.w.venomous | venomous | giftig | phrase | — | A venomous animal produces poison to kill other animals. | — | venomous |
| g2u04.w.to-weigh | to weigh | wiegen | phrase | — | A python can weigh up to 100 kg. | weigh | to weigh ; weigh |
| g2u04.w.length | length | Länge | phrase | — | The maximum length is 6 m. | — | length |
| g2u04.w.speed | speed | Geschwindigkeit ; Tempo | phrase | — | Their speed on land is 8 km/h. | — | speed |
| g2u04.w.intelligent | intelligent | intelligent | phrase | — | Dolphins are very intelligent animals. | — | intelligent |
| g2u04.w.reason | reason | Grund | phrase | — | Is there a reason why you don't want to come over? | — | reason |
| g2u04.w.to-share | to share | teilen ; zeigen | phrase | — | Share your notes with a partner. | share | to share ; share |
| g2u04.w.luck | luck | Glück | phrase | — | What animal can bring us luck? | — | luck |
| g2u04.w.powerful | powerful | mächtig ; kräftig | phrase | — | Rhinos are very powerful animals. | — | powerful |
| g2u04.w.smart | smart | schlau | phrase | — | Cats are very smart animals. | — | smart |
| g2u04.w.truck | truck | Lastwagen | phrase | — | A rhino can be bigger than a truck. | — | truck |
| g2u04.w.forever | forever | für immer | phrase | — | We want to be best friends forever. | — | forever |
| g2u04.w.to-protect | to protect | (be-)schützen | phrase | — | Our stones can protect you. | protect | to protect ; protect |

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

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g2u04.w.mosquito` ← v1 `mosquito`: d="A tiny flying insect that bites you and makes you itch" · s="A _____ bit me on the arm last night." · a=["mosquitos","mosquitoes"] · mc=["fly","bee","wasp"]
- `g2u04.w.pigeon` ← v1 `pigeon`: d="A grey bird you often see in cities and parks" · s="There are many _____ in the town square." · a=["pigeon","pigeons"] · mc=["sparrow","parrot","eagle"]
- `g2u04.w.parrot` ← v1 `parrot`: d="A bright bird that can copy what people say" · s="The _____ in the zoo can say 'hello' and 'goodbye'." · a=["parrots"] · mc=["pigeon","peacock","canary"]
- `g2u04.w.ostrich` ← v1 `ostrich`: d="A very big bird that cannot fly but runs fast" · s="An _____ is taller than most people." · a=["ostriches"] · mc=["eagle","flamingo","penguin"]
- `g2u04.w.chimpanzee` ← v1 `chimpanzee`: d="An animal like a monkey that is very smart" · s="The _____ at the zoo likes to eat bananas." · a=["chimpanzees","chimp","chimps"] · mc=["gorilla","monkey","orangutan"]
- `g2u04.w.antelope` ← v1 `antelope`: d="A fast animal with long legs that lives in Africa" · s="We saw an _____ running very fast across the African plain. It had long legs and small horns." · a=["antelopes"] · mc=["deer","gazelle","zebra"]
- `g2u04.w.bat` ← v1 `bat`: d="A small animal that flies at night and sleeps upside down" · s="A _____ flew out of the old barn when it got dark." · a=["bats"] · mc=["owl","eagle","moth"]
- `g2u04.w.giraffe` ← v1 `giraffe`: d="A very tall animal with a long neck and spots" · s="The _____ is the tallest animal in the world." · a=["giraffes"] · mc=["elephant","zebra","camel"]
- `g2u04.w.rhino` ← v1 `rhino`: d="A big grey animal with a horn on its nose" · s="A _____ looks slow but can run very fast." · a=["rhinos"] · mc=["hippo","elephant","buffalo"]
- `g2u04.w.cheetah` ← v1 `cheetah`: d="A spotted cat that is the fastest land animal" · s="The _____ can run faster than any other animal." · a=["cheetahs"] · mc=["leopard","tiger","lion"]
- `g2u04.w.anaconda` ← v1 `anaconda`: d="A very long and heavy snake that lives near water" · s="The _____ in the river was as long as a car." · a=["anacondas"] · mc=["cobra","python","crocodile"]
- `g2u04.w.crocodile` ← v1 `crocodile`: d="A big reptile with a long mouth full of sharp teeth" · s="The _____ was lying in the sun next to the river." · a=["crocodiles"] · mc=["alligator","lizard","turtle"]
- `g2u04.w.dolphin` ← v1 `dolphin`: d="A friendly sea animal that jumps out of the water" · s="We saw a _____ jump out of the sea on holiday." · a=["dolphins"] · mc=["whale","shark","seal"]
- `g2u04.w.whale` ← v1 `whale`: d="The biggest animal in the sea" · s="A blue _____ is the largest animal on Earth." · a=["whales"] · mc=["dolphin","shark","walrus"]
- `g2u04.w.shark` ← v1 `shark`: d="A big fish with sharp teeth that lives in the sea" · s="Some people are afraid of swimming because of _____." · a=["shark","sharks"] · mc=["whale","dolphin","swordfish"]
- `g2u04.w.ago` ← v1 `(two days) ago`: d="In the past, before now" · s="I started reading this book three days _____." · a=["ago"] · mc=["before","later","since"]
- `g2u04.w.farmer` ← v1 `farmer`: d="A person who grows food or keeps animals on a farm" · s="The _____ gets up early to feed the cows." · a=["farmers"] · mc=["gardener","shepherd","hunter"]
- `g2u04.w.human` ← v1 `human`: d="A person, a man, woman, or child" · s="Every _____ needs food, water, and sleep — we are all born the same way." · a=["humans"] · mc=["plant","robot","rock"]
- `g2u04.w.incredible` ← v1 `incredible`: d="Very hard to believe because it is so amazing" · s="The view from the mountain was _____." · a=["incredibly"] · mc=["boring","ordinary","normal"]
- `g2u04.w.dangerous` ← v1 `dangerous`: d="Something that can hurt you" · s="Playing near the road is very _____." · a=[] · mc=["safe","fun","boring"]
- `g2u04.w.hairy` ← v1 `hairy`: d="Having a lot of hair or fur on the body" · s="My uncle never shaves his _____ arms." · a=["hairier","hairiest"] · mc=["thin","smooth","fluffy"]
- `g2u04.w.heavy` ← v1 `heavy`: d="Hard to pick up because it has a lot of weight" · s="My school bag is too _____ today — I have 5 thick books inside and my shoulder hurts." · a=["heavier","heaviest"] · mc=["light","empty","small"]
- `g2u04.w.strong` ← v1 `strong`: d="Having a lot of power in your body" · s="My dad is very _____. He can carry big heavy boxes up the stairs without help." · a=["stronger","strongest"] · mc=["weak","tired","small"]
- `g2u04.w.climate-change` ← v1 `climate change`: d="When the weather of the world slowly becomes different" · s="_____ is a big problem for animals in cold places." · a=["climate change"] · mc=["breakfast","pollution","natural disaster"]
- `g2u04.w.fast` ← v1 `fast`: d="Moving with a lot of speed, not slow" · s="She is a very _____ runner — she finishes the 100 metres in only 12 seconds and always wins." · a=["faster","fastest"] · mc=["slow","tired","young"]
- `g2u04.w.female` ← v1 `female`: d="A girl or woman, or an animal that can have babies" · s="The _____ lion is the one that hunts food for the family, not the male." · a=["females"] · mc=["male","young","adult"]
- `g2u04.w.male` ← v1 `male`: d="A boy or man, or a father animal" · s="The _____ peacock has beautiful colourful feathers, but the female does not." · a=["males"] · mc=["female","young","adult"]
- `g2u04.w.nobody` ← v1 `nobody`: d="Not any person, no one" · s="I looked around but _____ was in the room." · a=["no one"] · mc=["somebody","anybody","everyone"]
- `g2u04.w.scientist` ← v1 `scientist`: d="A person who studies how the world works" · s="The _____ discovered a new type of fish in the sea." · a=["scientists"] · mc=["researcher","professor","inventor"]
- `g2u04.w.to-die-out` ← v1 `to die out`: d="When the last of a kind of animal or plant is gone forever" · s="Dinosaurs _____ millions of years before us — now they are all gone forever." · a=["die out","died out","dies out","dying out"] · mc=["to live","to grow","to return"]
- `g2u04.w.less` ← v1 `less`: d="A smaller amount, not as much" · s="I eat _____ sugar now because I want to be healthy." · a=[] · mc=["more","much","most"]
- `g2u04.w.to-carry` ← v1 `to carry`: d="To hold something and take it somewhere" · s="Can you help me _____ these bags to the car?" · a=["carry","carries","carried"] · mc=["to lift","to hold","to drag"]
- `g2u04.w.centimetre` ← v1 `centimetre`: d="A small unit to measure how long something is" · s="This pencil is about 15 _____ long." · a=["centimetre","centimetres","centimeter","centimeters"] · mc=["millimetre","metre","inch"]
- `g2u04.w.desert` ← v1 `desert`: d="A very dry and hot place with sand and almost no rain" · s="It is very hot in the _____ during the day." · a=["deserts"] · mc=["jungle","forest","ocean"]
- `g2u04.w.to-die` ← v1 `to die`: d="To stop living" · s="The flowers _____ when they do not get water." · a=["die","dies","died"] · mc=["to survive","to die out","to live"]
- `g2u04.w.mammal` ← v1 `mammal`: d="An animal that drinks milk from its mother when it is a baby" · s="A dog is a _____ because it feeds its babies with milk." · a=["mammals"] · mc=["reptile","insect","bird"]
- `g2u04.w.ton` ← v1 `ton`: d="A very heavy weight, the same as 1000 kilograms" · s="An elephant can weigh more than five _____." · a=["ton","tons","tonnes"] · mc=["kilogram","pound","gram"]
- `g2u04.w.venomous` ← v1 `venomous`: d="Having poison that can make you very sick or kill you" · s="Some snakes are _____ — their bite contains a dangerous liquid that can kill you." · a=[] · mc=["friendly","harmless","small"]
- `g2u04.w.to-weigh` ← v1 `to weigh`: d="To find out how heavy something is" · s="The baby _____ four kilograms when she was born." · a=["weigh","weighs","weighed"] · mc=["to measure","to count","to lift"]
- `g2u04.w.length` ← v1 `length`: d="How long something is from one end to the other" · s="The _____ of the classroom is about ten metres." · a=["lengths"] · mc=["height","width","weight"]
- `g2u04.w.speed` ← v1 `speed`: d="How fast something moves" · s="The car was going at a very high _____." · a=["speeds"] · mc=["distance","direction","height"]
- `g2u04.w.intelligent` ← v1 `intelligent`: d="Very good at thinking and learning new things" · s="Dolphins are very _____ animals. Scientists say they can solve problems and think like humans." · a=[] · mc=["lazy","slow","wild"]
- `g2u04.w.reason` ← v1 `reason`: d="Why something happens or why you do something" · s="What is the _____ you are late for school?" · a=["reasons"] · mc=["colour","name","result"]
- `g2u04.w.to-share` ← v1 `to share`: d="To give part of what you have to someone else" · s="My sister _____ her chocolate with me every day — she gives me half." · a=["share","shares","shared"] · mc=["to hide","to eat","to steal"]
- `g2u04.w.luck` ← v1 `luck`: d="When good things happen to you by chance" · s="Good _____ on your test tomorrow! I hope you pass." · a=[] · mc=["chance","hope","success"]
- `g2u04.w.powerful` ← v1 `powerful`: d="Very strong and full of energy" · s="Elephants are very _____ — they can push over big trees with just their trunks." · a=[] · mc=["weak","small","gentle"]
- `g2u04.w.smart` ← v1 `smart`: d="Good at thinking and learning quickly" · s="Our new puppy is very _____. He learned his name and three tricks on the very first day!" · a=["smarter","smartest"] · mc=["naughty","lazy","hungry"]
- `g2u04.w.truck` ← v1 `truck`: d="A very big vehicle used to move heavy things" · s="A big _____ with six wheels brought new furniture to our school." · a=["trucks"] · mc=["bicycle","car","motorbike"]
- `g2u04.w.forever` ← v1 `forever`: d="For all time, never ending" · s="Best friends stay together _____ and never stop caring." · a=[] · mc=["nowhere","never","sometimes"]
- `g2u04.w.to-protect` ← v1 `to protect`: d="To keep someone or something safe from danger" · s="We must _____ wild animals and their homes from hunters and pollution." · a=["protect","protects","protected"] · mc=["to hunt","to hurt","to destroy"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 2 SB Unit 4.txt -----
Unit 4  What an animal!
Page 32–33
At the end of unit 4 ...
 you know
 ☑ adjectives to describe animals
 ☑ 14 words for animals
 ☑ how to use the comparative and superlative
 ☑ how to use as ... as
you can
 ☑ understand a newspaper article about a friendship with an animal
 ☑ describe animals and compare them
 ☑ understand facts and stories about animals
 ☑ understand and take part in a group discussion
 ☑ find out information online and take notes
 ☑ write a magazine article about an extinct animal
 ☑ write about animals and compare them
READING
1 Read through the story quickly and answer the questions.
What was the problem with the crocodile when the man found it?
What did he do to help it?
How a fisherman saved a crocodile from dying
 The incredible, but true story of a friendship between a man and a crocodile
More than 30 years ago, a farmer in Costa Rica saw a huge crocodile trying to get to one of his cows. The man went back to the farmhouse, came back with a gun and shot the crocodile in its head.
The next day, a fisherman named Chito found the croc on the bank of the river near his house. He saw that the animal was bigger than all the other crocodiles in that area, but it was almost dead.
This week, an amazing film comes to the cinema. It’s called The Man Who Swims With Crocodiles. We sent a reporter to find out more about the story. “When I first saw the crocodile, I wanted to show the animal that not all humans are bad,” Chito told us. “So I gave it food and I stayed with it and spoke to it. I was happy to see that the next day the animal was already a little stronger than it was the day before. I gave it a name too, Pocho.”
A few weeks later, the crocodile was much healthier. It went to the river. Then it started to swim. It went into a part of the river where the water was deeper. “I was a little sad when it was gone. But the next day, the crocodile was back. It was on my veranda when I opened the door in the morning!”
The man and the dangerous animal became friends, and soon they started swimming in the river together. “When we went into the water, it opened its big mouth. As soon as I got near, it closed it. I was a little scared first, but I felt better when I saw that. I knew it liked me,” Chito said. “And I never felt scared again when the animal was near me.”
2 Read the text again. How many of these tasks can you do?
The story happened last year. T / F
A farmer shot the crocodile because it wanted to eat his cow. T / F
There is now a film about the fisherman and the crocodile. T / F
Chito gave the crocodile ............................... : Pocho.
He gave the croc food and the next day it was ............................... .
More than a month later, the crocodile was ............................... than the day before.
What happened when the crocodile went into the river one day?
Was the man ever scared of the crocodile? Why (not)?
How did the man feel in different parts of the story, and why?
3 Check your answers with a partner.
VOCABULARY
 Adjectives
4 Match the pictures with the adjectives. Write the numbers.
☐ small
 ☐ hairy
 ☐ heavy
 ☐ dangerous
 ☐ strong
 ☐ clever
 ☐ big
(Image description: Seven animals are pictured and numbered: 1 a small green frog, 2 a large elephant, 3 a hairy orangutan, 4 a dangerous-looking crocodile, 5 a clever-looking monkey, 6 a strong ox, 7 a heavy hippopotamus.)
SPEAKING
 Comparing animals
5 Choose one of the animals. Make sentences using comparatives. Your partner guesses what animal it is. Use the words in the box in 4 to help you.
A: It’s bigger than a mouse.
 B: Is it a guinea pig?
 A: No, it’s heavier than a guinea pig.
 B: Is it a rabbit?
 A: That’s right.
(Image description: Illustrations of a mouse, a guinea pig, and a rabbit in conversation bubbles.)
READING
 Understanding facts about animals
6 Read the facts about animals that became extinct in the last two hundred years.
PARADISE PARROT
 The paradise parrot lived in parts of Australia and became extinct in 1927. It was more colourful than most other birds in the area, but why was it darker green? People don’t know. Nobody knows exactly why it became extinct?
 Nobody knows. But wildfires killed many of the beautiful birds.
GOLDEN TOADS
 Golden toads were as big as the frogs you can see in our gardens. But they were more colourful. The male was golden red, the female was dark green. People liked the bright colour.
 Scientists think that golden toads died out because of climate change.
PASSENGER PIGEONS
 About 150 years ago, there were a lot more passenger pigeons than there were pigeons in Europe. Many people ate them! But people also hunted them because of their meat. Only a few birds stayed alive.
 After a while, the birds became extinct.
WESTERN BLACK RHINO
 Western black rhinos were amazing animals. They could run very fast. Females can’t run at 40 km/h.
 Western black rhino was faster – up to 55 km/h. But people hunted them for their horns. People killed them, and they became extinct in 2011.
VOCABULARY: extinct = ausgestorben
7 Read the facts again and circle T (True) or F (False).
Most other Australian birds were more colourful than the paradise parrot. T / F
The frogs we have in our gardens are not bigger than the golden toad. T / F
The golden toad was not as colourful as the frogs are today. T / F
The golden toad died out earlier than the paradise parrot. T / F
Before 1900, people in North America saw as many passenger pigeons as other birds. T / F
In about 50 years, people killed billions of pigeons. T / F
Elephants cannot run as fast as the western black rhino. T / F
The western black rhino ran fast, but less than 60 km/h. T / F
Page 34–35
8 Read the magazine article. Complete it with the numbers from the box. Then listen and check.
 [Box: 150 2 8 3 110 1]
The most INCREDIBLE ANIMALS in the world
(Image description: Several animal photographs with labels and fact boxes: a taipan snake, bumblebee bat, mosquito, estuarine crocodile, cheetah, and blue whale.)
The world’s most venomous snake is the TAIPAN.* It lives in the deserts of Australia. It can be more than 3 metres long.
The BUMBLEBEE BAT from Thailand is the smallest mammal in the world. It is 3 centimetres long and weighs 2 grams.
The most dangerous animal in the world is the MOSQUITO. It can carry malaria. Every year, more than 1 million people worldwide die from malaria.
The fastest land animal in the world is the CHEETAH. It can run very fast – more than 110 km/h.
The ESTUARINE CROCODILES of South East Asia are the longest crocodiles in the world. They can be 8 metres long – as long as two cars together!
The biggest animal on land or in the sea is the BLUE WHALE. It’s also the heaviest. It weighs 150 tons.
VOCABULARY: venomous = giftig
9 Look at the fact file. Write six sentences comparing the snakes. Use superlatives and comparatives. Use adjectives from the box.
[Box: long heavy fast dangerous venomous]
Fact file
	Anaconda	Boa constrictor	Python
maximum length	6 m	2.4 m	6 m
maximum weight	227 kg	15 kg	75 kg
speed on land	8 km/h	2 km/h	8 km/h
venomous	yes	no	no

10 SOUNDS RIGHT /dʒ/ /tʃ/
Listen and repeat.
His name’s Jim, I’m more beautiful than him.
 He’s a chimpanzee, and he’s as big as me.
(Image description: A girl and a chimpanzee lie on the grass side-by-side.)
VOCABULARY Animals
11 Match the eyes and the animals.
[Options: antelope giraffe rhino ostrich chimpanzee dolphin]
Whose eye is it?
(Image description: Six close-up photographs of different animal eyes, labelled 1 to 6.)
Girl: I think number ... is the ostrich’s eye.
12 Listen and check.
SPEAKING Describing animals
13 Put the animals in order. Write 1, 2 and 3 in the boxes.
THE ANIMAL QUIZ
Which is the tallest?
  a ☐ giraffe
  b ☐ an ostrich
  c ☐ an elephant
(Image: A large giraffe head and neck)
Which is the longest?
  a ☐ an anaconda
  b ☐ a whale shark
  c ☐ a crocodile
(Image: Whale shark)
Which is the fastest?
  a ☐ a lion
  b ☐ a rabbit
  c ☐ an antelope
(Image: Lion)
Which is the heaviest?
  a ☐ a rhino
  b ☐ a blue whale
  c ☐ an elephant
(Image: Elephant)
Which is the most intelligent?
  a ☐ a dolphin
  b ☐ a pig
  c ☐ a chimpanzee
(Image: Chimpanzee)
14 Discuss your answers with a partner. Then listen and check.
Boy: I think the elephant is the tallest.
 Girl: I don’t think so. I think the …
Page 36–37
SPEAKING & LISTENING Taking part in a group discussion
15 Read and match. Then listen and check.
1 cheetah 2 fox 3 lion 4 leopard 5 ladybird 6 antelope 7 dolphin 8 owl
(Image descriptions:
 A: Antelope standing in the desert.
 B: Leopard walking through dry grass.
 C: Dolphin jumping in the water.
 D: Cheetah climbing a tree.
 E: Owl sitting on a tree branch.
 F: Lion standing in the savanna.
 G: Fox in a snowy forest.
 H: Ladybird on a leaf.)
16 Read through the useful language for a group discussion:
Making suggestions and giving reasons:
 I think the … would be a good mascot because …
 It is …er than a …
 It isn’t as … as …
 Let’s choose …
 Do you know what I think?
Asking for repetition:
 Sorry?
 Can you say that again, please?
Asking to give reasons:
 Can you say why you think so?
 Are you sure about that?
 Why do you think so?
Making simple remarks to show that you follow:
 I see.
 I see what you mean.
 OK.
 I understand.
 Good point.
Inviting others to speak:
 What do you think, (Tom)?
 Do you agree, (Tina)?
(Image description: Three children talking in a group.)
17 Listen to the group discussion and answer the questions.
What are they talking about? What suggestions do they make and why?
Listen again. Which of the language suggestions in 16 do they use in the discussion?
Take notes. Share your notes with a partner.
18 a Work in groups. Imagine your class needs to decide on an animal as a mascot for the school volleyball team. Use the language in 16.
b Think about your discussion. What was easy or difficult? How can you make it even better?
c Work in groups again. Imagine your class needs to decide on an animal as a mascot for the school football team. You can suggest other animals too.
A SONG 4 U
19 Listen and sing.
A mascot for the school team
We need a mascot for the school team
 that’s as brilliant as we are.
 What animal can bring us luck
 in races near and far? (x2)
Why don’t we choose a dolphin?
 Dolphins are so cool.
 They are the smartest animals.
 Ideal for our school!
We need a mascot for the school team
 that’s as brilliant as we are.
 What animal can bring us luck
 in races near and far? (x2)
I’d say let’s pick a rhino,
 bigger than a truck.
 Rhinos are so powerful,
 rhinos don’t get stuck.
We need a mascot for the school team
 that’s as brilliant as we are.
 What animal can bring us luck
 in races near and far? (x2)
The mascot for the dream team
 that helps us all the time.
 Should really be a ladybird.
 A ladybird? That’s fine!
We’ve got our mascot for the school team.
 It’s as brilliant as we are.
 It’s a ladybird that brings us luck
 in races near and far! (x2)
(Image description: Cartoon of a dolphin, a rhino, and a ladybird dressed as athletes, cheering and playing sports.)
WRITING
20 CHOICES
Do an internet search. Find an animal that became extinct. Take notes about:
• the animal’s name
 • where and when it lived
 • what it looked like
 • why it became extinct
A Use your notes to write four sentences about the animal.
B You have been invited to write a short article of 80–100 words for your online school magazine about an animal that became extinct. Include the following information:
• the place where and the time when the animal lived
 • what the animal looked like (use one comparative and one superlative)
 • the reason(s) why the animal became extinct
Page 38–39
GRAMMAR
Comparatives
Wenn du zwei Dinge vergleichst, die verschieden sind, dann verwendest du das Wort than. An die Adjektive mit einer Silbe (fast, slow, deep, old, …) hängst du -er an.
He’s older than me.
She’s faster than me.
An die Adjektive mit zwei Silben, die auf -y, -le und -ow enden (happy, simple, …) hängst du ebenfalls -er an.
hot → It’s hotter today than yesterday.
big → The whale is bigger than a dolphin.
fat → A rhino is fatter than a cheetah.
heavy → An elephant is heavier than a mouse.
angry → My mum was angrier than my dad.
hungry → I was hungrier than my sister.
Wenn das Adjektiv mehr als zwei Silben hat (dangerous, difficult, interesting, …), dann verwendest du
 more + adjective + than.
The book is more interesting than the film.
Ausnahmen:
good → better
  He was better than Jeff.
bad → worse
  I’m bad at football, but he’s worse than me!
as … as
Wenn du sagen willst, dass sich zwei Dinge/Tiere/Personen in irgendeiner Weise gleichen (z. B. gleich groß, klein usw. sind), dann verwendest du as … as:
It was as small as a mouse.
It was as dangerous as a snake.
Wenn sie sich nicht gleichen, verwendest du not as … as:
The female golden toad is not as colourful as the male animal.
Superlatives
Wenn du ausdrücken willst, dass etwas am größten, schwersten, schnellsten usw. ist, verwendest du das the und hängst -est an das Adjektiv an:
fast, slow, deep, old, etc. → The cheetah is the fastest mammal in the world.
Bei einigen Adjektiven ändert sich die Schreibweise:
hot → This is the hottest day of the year.
big → The blue whale is the biggest animal in the world.
fat → This is the fattest snake in the zoo.
heavy → The blue whale is the heaviest animal in the world.
angry → He is the angriest person I know.
hungry → I was the hungriest one on our school trip.
Bei Adjektiven, die aus drei oder mehr Silben bestehen (dangerous, difficult, interesting, …) verwendest du
 the most + adjective:
The mosquito is the most dangerous animal in the world.
Ausnahmen:
good → the best
  She’s the best player in the team.
bad → the worst
  It’s the worst restaurant in town.
Now go back to page 32. Check ✅ with a partner what you know / can do.
THE STORY OF THE STONES 2
 We’re all in danger
1 Look at the pictures from episode 1 and put them in the correct order.
(Image descriptions:
 Four cartoon panels showing characters from the story.
 1: Girl talking to a woman in a bedroom.
 2: Girl with concerned look lying on bed.
 3: Girl and two others discussing.
 4: Girl holding a glowing object.)
2 Can you remember who morphs into each of these animals? Write the names.
(Images left to right:
 1: Cartoon of a black mouse
 2: Cartoon of an eagle
 3: Cartoon of a tiger)
1 ________
 2 ________
 3 ________
3 Watch episode 2 and answer the questions. Circle a, b or c.
Who is Darkman’s master?
 a The Black Knight
 b Demon Eyes
 c The Lord of the Fire
What does Darkman’s master want?
 a the belt and stones
 b a spaceship
 c the three stones
Which Lord wanted all the stones?
 a The Lord of the Earth
 b The Lord of the Fire
 c The Lord of the Water
Who is trying to find the stones?
 a Sunborn
 b Darkman
 c The Lords
EVERYDAY ENGLISH
4 Watch episode 2 again. Complete the sentences and match them with the person who said them.
Here you are  get it  How can that be?
________ , he’s dead, isn’t he?
Only your stones can protect you now. ___________________________
But I still don’t ___________________________ . Why didn’t Darkman die?
☐ Emma
 ☐ Sarah
 ☐ Sunborn


----- WB: More 2 WB Unit 4.txt -----
UNIT 4 What an animal!
Page 29
UNDERSTANDING VOCABULARY
Animals & adjectives
1 Match the words with the pictures.
Word List:
pig
dolphin
antelope
mosquito
anaconda
chimpanzee
giraffe
cheetah
whale
rhino
ostrich
crocodile
Image descriptions with numbers:
A large bird with long neck and legs — ostrich
A small flying insect — mosquito
A sea animal with a curved mouth and fins — dolphin
A tall animal with a long neck and spots — giraffe
A pink farm animal — pig
A fast spotted wild cat — cheetah
A large animal with thick skin and a horn — rhino
A graceful animal with horns — antelope
A small ape — chimpanzee
A green reptile with a long tail and teeth — crocodile
A large blue sea animal — whale
A large green snake — anaconda
2 Circle the correct word.
Image 1: Two children standing outside, smiling at each other.
 Options: friendly / dangerous
Image 2: A girl writing complex math on a whiteboard.
 Options: clever / big
Image 3: A hippo standing on a scale.
 Options: heavy / small
Image 4: A mosquito under a magnifying glass.
 Options: small / heavy
Image 5: A giraffe with a small animal.
 Options: hairy / big
Image 6: A crocodile with its mouth open.
 Options: dangerous / friendly
Image 7: A girl lifting dumbbells.
 Options: clever / strong
Image 8: A hand with a lot of hair.
 Options: heavy / hairy
Page 30–31
USING VOCABULARY
Animals & adjectives
3 Do the crossword puzzle and find the mystery word.
Someone who is 93 is really …
I can’t carry this bag. It’s too …
Everyone likes them because they’re very …
The opposite of small.
The opposite of stupid.
With lots of hair on the body.
She can carry three suitcases. She’s quite …
The opposite of old.
It’s difficult to see the animal because it’s so …
(Crossword puzzle grid present, 9-across forms the mystery word.)
4 Write down some of the animals from 1.
These animals are very fast: ..........................................................
These animals are very tall: ..........................................................
These animals are very dangerous: ..................................................
These animals are very heavy: .........................................................
These animals are very long: ..........................................................
UNDERSTANDING GRAMMAR
Comparatives
5 Match the sentences and the pictures. There are two extra pictures.
(Images show comparative situations: temperatures, children measuring height, two pizzas, race running, etc.)
The pizza at Tony’s is better than the pizza at Little Italy.
It’s hotter today than yesterday.
My bag is heavier than your bag.
Tom is faster than George.
My brother is five years older than me.
USING GRAMMAR
Comparatives
6 Write sentences comparing the animals. Use some of the adjectives in the box.
Use a different adjective for each picture.
Word Box:
hairy
strong
fast
big
funny
dangerous
scary
small
long
Elephants are bigger than rhinos.
...............................................................
...............................................................
...............................................................
...............................................................
...............................................................
(Images show animal pairs: elephant and rhino, lion and tiger, monkey and cat, etc.)
UNDERSTANDING GRAMMAR
as ... as
7 Read the sentences. Tick the ones you think are true. Listen and check.
The Eiffel Tower isn’t as tall as the Empire State Building.
The River Nile isn’t as long as the River Amazon.
There aren’t as many people in Belgium* as in Austria.
There aren’t as many lakes in Finland as in Germany.
The blue-ringed octopus isn’t as dangerous as the mosquito.
The Estuarine crocodile isn’t as long as the taipan snake.
Elephants aren’t as heavy as blue whales.
Austria isn’t as big as Hungary.
*VOCABULARY: Belgium – Belgien
USING GRAMMAR
as ... as
8 Complete B’s answers. Use the same adjective as A and as ... as.
1
 A I don’t think squash is exciting.
 B Really? I think it’s as exciting as tennis.
2
 A I don’t think rabbits are interesting.
 B Really? I think .................................................... hamsters.
3
 A I don’t think spiders are scary.
 B Really? I think .................................................... snakes.
4
 A I don’t think your dog is clever.
 B Really? I think .................................................... your cat!
5
 A I don’t think this film is good.
 B Really? I think .................................................... the other one.
6
 A I don’t think you’re very strong.
 B Really? I think .................................................... you!
Page 32–33
9 Complete the text. Use as ... as or comparative adjectives.
Lin: I see you’ve got all the Harry Potter books. What do you think of them?
 Ciara: I really like all the Harry Potter books but I think that The Chamber of Secrets is a 1. ......................................................... (good) book than The Order of the Phoenix.
The Chamber of Secrets is 2. ......................................................... (interesting) and
 3. ......................................................... (exciting) than The Order of the Phoenix. And
 The Order of the Phoenix is much 4. ......................................................... (long).
Lin: What do you think of the films?
 Ciara: Well, The Philosopher’s Stone film isn’t as 5. ......................................................... (good) the book. I really like the books much 6. ......................................................... (good) than the films.
Lin: Tell me more about the books.
 Ciara: Well, The Goblet of Fire was 7. ......................................................... (good) than The Chamber of Secrets. And The Chamber of Secrets was 8. ......................................................... (exciting) than The Prisoner of Azkaban.
Lin: So what should I read?
 Ciara: Start at the beginning with The Philosopher’s Stone, of course.
10 Write five sentences comparing Ronnie and Reggie. Use as ... as or comparative adjectives.
	date of birth	weight	height*	school report	running 100m
Ronnie	March 22nd 2012	50kg	1.56m	A+	18 seconds
Reggie	March 22nd 2012	52kg	1.56m	C-	16 seconds

1 .................................................................................... (old)
 2 .................................................................................... (heavy)
 3 .................................................................................... (tall)
 4 .................................................................................... (clever)
 5 .................................................................................... (fast)
VOCABULARY: height – Größe
UNDERSTANDING GRAMMAR
Superlatives
11 Circle the correct word.
Ostriches are faster / fastest than people.
The taipan is the venomous / most venomous snake in the world.
The anaconda is one of the longer / longest snakes in the world.
This book about animals is the best / better.
Gorillas are bigger / biggest than chimpanzees.
Cheetahs are faster / fast than rhinos.
Spike was the ugliest / uglier dog in the dog show.
The cat is the most popular / popular pet in the UK.
USING GRAMMAR
Superlatives
12 Harry, Larry and Barry are brothers – triplets! Look at the picture and the table and write sentences using superlatives. Use the adjectives in the box.
	date of birth	school report	weight	running 100m
Harry	02/02/12, 10.20 a.m.	All ‘C’s	47kg	12.5 seconds
Barry	02/02/12, 10.50 a.m.	All ‘B’s	43kg	18 seconds
Larry	02/02/12, 11.40 a.m.	All ‘A’s	53kg	14.6 seconds

Adjective box:
tall
old
heavy
slow
intelligent
short
young
fast
Larry is the tallest ...................................................................................
 .................................................................................................................
 .................................................................................................................
VOCABULARY: triplets – Drillinge
13 Answer the questions for you.
Who is the tallest person in your family?
What is the best thing in your bedroom?
What is the heaviest thing in your house or flat?
What is the most expensive thing in your house or flat?
What is the most interesting animal in the world?
What is your best subject at school?
LISTENING
14 a Listen to the story and write the names.
Names: Rosey, Debbie, Lily
(Image description: A girl, a woman, and a golden retriever dog standing at the beach.)
1 _________________________
 2 _________________________
 3 _________________________
b Listen again and tick T (True) or F (False).
Lily was eight years old.
   ☐ T  ☐ F
Lily was a better swimmer than Rosey.
   ☐ T  ☐ F
Debbie got out of the river to get the food.
   ☐ T  ☐ F
The water was deep in the middle of the river.
   ☐ T  ☐ F
Debbie got to Lily before Rosey.
   ☐ T  ☐ F
Lily was smaller than her dog.
   ☐ T  ☐ F
Page 34–35
READING
Understanding a story about animals
15 Read the text. How many of the tasks below can you do?
Ricky’s Blog
 My safari trip
PHOTO of Ricky with a safari background
 PHOTO of rhinos and birds on a back
DECEMBER 9TH, 10:15 A.M.
Last year, we went on safari to Kenya. It was great – we saw lots of brilliant birds and I really liked them. We also saw a rhino one day. It was very big (about 1.5 metres high) and I’m sure it was really heavy too. The guide said that sometimes a rhino can weigh 2,000 kilograms!! But I wasn’t scared. My dad told me that rhinos normally aren’t very dangerous animals. Rhinos are almost blind and so they can’t see well. There were lots of small grey and white birds on the rhinoceros’ back. I think the birds eat very small insects from the rhino’s skin.
Later the same day, we saw some baboons*. There was a big family of them. I thought they looked nice and friendly, but we didn’t go very close. You have to be careful, because male baboons are strong and they aren’t very friendly! Some people think baboons are very intelligent, too. I don’t know about that, but I’m sure they’re more intelligent than rhinos! At the end of the day, when we went back to the hotel – guess what? In my parents’ room there was a big, black, hairy tarantula! My dad was really scared, but my mum just picked it up and put it outside. My mum’s really cool!
VOCABULARY: baboon – Pavian
Comprehension Questions:
Ricky really liked the birds.
   ☐ T  ☐ F
The rhino was more than 2 metres tall.
   ☐ T  ☐ F
Rhinos aren’t usually very dangerous.
   ☐ T  ☐ F
What was not on the rhino’s back?
 ☐ birds  ☐ insects  ☐ small mice
What was the second animal Ricky saw?
 ☐ rhinos  ☐ baboons  ☐ spiders
Why is it not a good idea to go close to baboons?
 ☐ they take your food  ☐ they are shy  ☐ they are dangerous
Who does Ricky believe to be more intelligent than rhinos?
 ........................................................................................................
Where was the spider?
 ........................................................................................................
What did Ricky’s mum do with the spider?
 ........................................................................................................
16 Listen and check your answers.
LISTENING & DIALOGUE WORK
Describing and comparing animals
17 CHOICES
A Put the lines in the correct order to make a dialogue. Then listen and check.
Jill: Are you sure about that? I think dogs are more intelligent.
 Jill: Why do you think that?
 Jill: What animal do you think would make the best pet?
 Will: I think a cat would be great.
 Will: No way. Cats are more intelligent than dogs.
 Will: Because cats are very intelligent.
8 Complete the dialogue with the sentences in the box. There are three extra sentences.
Then listen and check.
Sentence box:
Why not?
I don’t like animals.
But they are hairy, too – and dogs are friendlier than cats.
OK, so what do you want?
Hamsters are so cute.
If you want an easy pet, let’s get a fish.
Let’s ask Mum and Dad.
Great idea. Let’s get a dog.
Dialogue:
Tom: Let’s choose a pet for our house.
 Ruby: 1 ..............................................................
 Tom: A dog? No way!
 Ruby: 2 ..............................................................
 Tom: Dogs are too hairy. They leave hair all over the house.
 Ruby: 3 ..............................................................
 Tom: A cat, of course, cats are really cool.
 Ruby: 4 ..............................................................
 Tom: Yes, but dogs need a lot of time. Cats are easier to look after.
 Ruby: 5 ..............................................................
 Tom: A fish. That’s a good idea!
WRITING
Writing about animals and comparing them
18 CHOICES
A Write a short text (50 words) about an animal you like. Use at least one comparative and one superlative.
 Write about:
 • what the animal looks like (colour, size)
 • why you like the animal
B Choose two animals to compare and write about which one you would like most as a pet (80–100 words).
 Think about:
 • what each animal is like
 • why one animal is better than the other
WORD FILE
Animals (illustrated section)
Animals are grouped by type with images and labels:
INSECTS
mosquito
BIRDS
pigeon
parrot
ostrich
MAMMALS
chimpanzee
antelope
bat
giraffe
rhino
cheetah
REPTILES
anaconda
crocodile
SEA ANIMALS
dolphin
whale
shark
(Image shows a colorful scene with cartoon-style animals labelled as above.)
Page 36
MORE Words and Phrases
🔢	English word or phrase	Example sentence	German translation
1	(two days) ago	Two days ago, I saw a crocodile.	vor (zwei Tagen)
	farmer	A farmer saw a huge crocodile.	Bauer/Bäuerin
	human	I wanted to show the animal that not all humans are bad.	Mensch
	incredible	That’s an incredible but true story.	unglaublich
4	dangerous	The taipan snake can be very dangerous.	gefährlich
	hairy	My pet rat has got lots of fur. It’s very hairy.	haarig, stark behaart
	heavy	This bag is too heavy. I can’t carry it.	schwer
	strong	I’m not as strong as my best friend.	stark
6	climate change	Many animals die because of climate change.	Klimawandel
	fast	Cheetahs can run very fast.	schnell
	female	The female is dark green.	weiblich; Weibchen (Tierwelt)
	male	The male toad is golden red.	männlich
	nobody	Nobody knows why the paradise parrot became extinct.	niemand
	scientist	I want to become a scientist and study animals.	Wissenschaftler/Wissenschaftlerin
7	to die out	Many animals are dying out.	aussterben
	less	The rhino was fast, but less than 60 km/h.	weniger
8	to carry	Mosquitos can carry malaria.	tragen; hier: übertragen
	centimetre	One centimetre is 10 millimetres.	Zentimeter
	desert	There are no deserts in England.	Wüste
	to die	Millions of people die from malaria.	sterben
	mammal	Elephants and lions are mammals.	Säugetier
	ton	One ton is 1000 kg.	Tonne (1000 kg)
	venomous	A venomous animal produces poison to kill other animals.	giftig
	to weigh	A python can weigh up to 100 kg.	wiegen
9	length	The maximum length is 6 m.	Länge
	speed	Their speed on land is 8 km/h.	Geschwindigkeit, Tempo
13	intelligent	Dolphins are very intelligent animals.	intelligent
16	reason	Is there a reason why you don’t want to come over?	Grund
17	to share	Share your notes with a partner.	teilen; zeigen
19	luck	What animal can bring us luck?	Glück
	powerful	Rhinos are very powerful animals.	mächtig, kräftig
	smart	Cats are very smart animals.	schlau
	truck	A rhino can be bigger than a truck.	Lastwagen
S2	forever	We want to be best friends forever.	für immer
	to protect	Our stones can protect you.	(be-)schützen

```

## Output contract

Write `content/corpus/units/g2-u04/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g2-u04",
  "briefBank": "072502363e27",
  "briefPrompt": "346902f9f0f1",
  "items": [
    {
      "wordId": "g2u03.w.witch",        // the bank id this item teaches (EVERY bank row exactly once)
      "w": "witch",                     // == bank en, verbatim
      "g": "Hexe",                      // one of the bank's de values (the primary sense)
      "d": "…", "s": "… ___ …", "sSource": "masterlist|sb|wb|invented",
      "sAnswers": [{ "text": "…", "tier": "full|partial" }],
      "dAnswers": [{ "text": "…", "tier": "full" }],
      "translation": { "deToEn": [{ "text": "…", "tier": "full" }], "enToDe": [{ "text": "…", "tier": "full" }] },
      "gloss": [],                      // [{ "word": "…", "de": "…", "scope": "s"|"d"|null }]
      "mc": ["…", "…", "…"],
      "hintDe": "…",
      "difficulty": 1,
      "gameMeta": { "distractorPool": ["…", "…", "…", "…"], "chipBudget": null, "minOptions": 4 },
      "seedV1": null, "sbRef": null, "note": null
    }
  ]
}
```
