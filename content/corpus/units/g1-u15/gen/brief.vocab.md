# Vocab generation brief — g1-u15 (MORE! 1, Unit 15)

<!-- domigo:gen vocab g1-u15 bank=d2f850cdb0ab prompt=346902f9f0f1 -->

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
| g1u15.w.to-fly-to | to fly to | fliegen nach | wordfile | — | — | fly to | to fly to ; fly to |
| g1u15.w.to-go-fishing | to go fishing | angeln gehen | wordfile | — | — | go fishing | to go fishing ; go fishing |
| g1u15.w.to-stay-at-a-campsite | to stay at a campsite | auf einem Campingplatz übernachten | wordfile | — | — | stay at a campsite | to stay at a campsite ; stay at a campsite |
| g1u15.w.to-swim-in-the-sea | to swim in the sea | im Meer schwimmen | wordfile | — | — | swim in the sea | to swim in the sea ; swim in the sea |
| g1u15.w.to-play-badminton | to play badminton | Badminton spielen | wordfile | — | — | play badminton | to play badminton ; play badminton |
| g1u15.w.to-lie-in-the-sun | to lie in the sun | in der Sonne liegen | wordfile | — | — | lie in the sun | to lie in the sun ; lie in the sun |
| g1u15.w.to-write-a-postcard | to write a postcard | eine Postkarte schreiben | wordfile | — | — | write a postcard | to write a postcard ; write a postcard |
| g1u15.w.to-play-board-games | to play board games | Brettspiele spielen | wordfile | — | — | play board games | to play board games ; play board games |
| g1u15.w.to-visit-a-castle | to visit a castle | eine Burg/ein Schloss besuchen | wordfile | — | — | visit a castle | to visit a castle ; visit a castle |
| g1u15.w.aunt | aunt | Tante | phrase | — | My aunt is my mum's sister. | — | aunt |
| g1u15.w.beach | beach | Strand | phrase | — | Let's go to the beach and swim in the sea. | — | beach |
| g1u15.w.board-game | board game | Brettspiel | phrase | — | In the evening, we're going to play board games. | — | board game |
| g1u15.w.campsite | campsite | Campingplatz | phrase | — | We're going to stay at a campsite and sleep in a tent. | — | campsite |
| g1u15.w.cook | cook | Koch/Köchin | phrase | — | My grandma is a very good cook. | — | cook |
| g1u15.w.to-drive | to drive | fahren ; Fahrt | phrase | — | We're going to drive to Grandma's house. It's a long drive. | drive | to drive ; drive |
| g1u15.w.holiday | holiday | Urlaub ; Ferien | phrase | — | My mum and dad have no holiday. | — | holiday |
| g1u15.w.national-park | national park | Nationalpark | phrase | — | We're going to visit the national parks in the United States. | — | national park |
| g1u15.w.parents | parents | Eltern | phrase | — | My parents and I are going to fly to the US. | — | parents |
| g1u15.w.plane | plane | Flugzeug | phrase | — | I'm not scared of flying. I can sleep on the plane. | — | plane |
| g1u15.w.summer | summer | Sommer | phrase | — | In the summer, I'm going to go swimming. | — | summer |
| g1u15.w.hippo | hippo | Nilpferd | phrase | — | Hippos are big animals. | — | hippo |
| g1u15.w.to-join | to join | beitreten ; ein Mitglied werden | phrase | — | Let's join an Irish band. | join | to join ; join |
| g1u15.w.to-invite | to invite | einladen | phrase | — | Who are you going to invite to your party? | invite | to invite ; invite |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Darkman, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Doctor, Doctors, Don, Dragon, Elisabeth, Ellie, Emergency, Emma, Encouraging, England, English, European, Every, False, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Hammond, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Irish, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Janet, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Kate, Ken, Kinds, Kitty, Lane, Leah, Leo, Lethabo, Leute, Lewis, Li, Liam, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Michael, Mike, Mill, Miriam, Miss, Mr, Mrs, Mum, Nathan, New, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rose, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Sophie, States, Steve, Sue, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, True, Turan, Uhr, Um, United, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u15.w.to-fly-to` ← v1 `to fly to`: d="to travel somewhere by plane" · s="We are going to _____ sunny Spain this summer by aeroplane from Vienna airport." · a=[] · mc=["to drive to","to walk to","to cycle to"]
- `g1u15.w.to-go-fishing` ← v1 `to go fishing`: d="to try to catch fish" · s="Dad and I want to _____ at the river with our rods and buckets tomorrow to catch some trout." · a=[] · mc=["to go swimming","to go shopping","to go dancing"]
- `g1u15.w.to-stay-at-a-campsite` ← v1 `to stay at a campsite`: d="to sleep at a place for tents" · s="We are going to _____ in our family tent right next to the lake for the whole summer holiday." · a=[] · mc=["to stay at a luxury hotel","to stay at home","to stay with grandma"]
- `g1u15.w.to-swim-in-the-sea` ← v1 `to swim in the sea`: d="to go swimming in the ocean" · s="I love to _____ in the salty blue water on sunny days when we are on holiday at the beach." · a=[] · mc=["to swim in the school pool","to swim in the bathtub","to swim in the lake"]
- `g1u15.w.to-play-badminton` ← v1 `to play badminton`: d="to play a game with a net and a shuttlecock" · s="Let's _____ with our rackets and a light shuttlecock in the garden this afternoon." · a=[] · mc=["to play football","to play chess","to play cards"]
- `g1u15.w.to-lie-in-the-sun` ← v1 `to lie in the sun`: d="to rest outside when it is sunny" · s="Mum likes to _____ on a beach towel and read a book on holiday to get a nice suntan." · a=[] · mc=["to work in the office","to wash the dishes","to do the cleaning"]
- `g1u15.w.to-write-a-postcard` ← v1 `to write a postcard`: d="to send a card with a picture from your holiday" · s="I always _____ with a short holiday message and a picture to send to my grandma in the mail." · a=[] · mc=["to write a novel","to write a letter","to write a diary"]
- `g1u15.w.to-play-board-games` ← v1 `to play board games`: d="to play games like Monopoly on a table" · s="When it rains heavily outside, we _____ together like Monopoly and Scrabble as a family on the table." · a=[] · mc=["to play outside","to play football","to play hide and seek"]
- `g1u15.w.to-visit-a-castle` ← v1 `to visit a castle`: d="to go and see an old big building" · s="On our summer trip to the mountains, we are going to _____ with tall stone walls, towers, and old knights' armour." · a=[] · mc=["to visit a modern office","to visit a supermarket","to visit a swimming pool"]
- `g1u15.w.aunt` ← v1 `aunt`: d="the sister of your mum or dad" · s="My _____ Jane — my mum's sister — always gives me nice presents for my birthday every year." · a=[] · mc=["uncle","grandpa","cousin"]
- `g1u15.w.beach` ← v1 `beach`: d="a sandy place next to the sea" · s="We built a tall sandcastle with a moat on the sandy _____ near the blue sea on holiday." · a=[] · mc=["mountain","forest","garden"]
- `g1u15.w.board-game` ← v1 `board game`: d="a game you play on a table with pieces" · s="My favourite _____ that you play on a square board with dice is Monopoly. Four players can play." · a=[] · mc=["computer game","video game","card game"]
- `g1u15.w.campsite` ← v1 `campsite`: d="a place where people sleep in tents" · s="There were many colourful tents and campervans at the _____ near the lake where we stayed for a week." · a=[] · mc=["luxury hotel","apartment","house"]
- `g1u15.w.cook` ← v1 `cook`: d="a person who makes food" · s="My grandpa is the best _____ in our whole family. He makes delicious pasta in the kitchen." · a=[] · mc=["driver","singer","painter"]
- `g1u15.w.to-drive` ← v1 `to drive`: d="to go somewhere in a car" · s="My dad will _____ us to the airport tomorrow morning in our car so we can catch our plane." · a=[] · mc=["to fly","to walk","to cycle"]
- `g1u15.w.holiday` ← v1 `holiday`: d="a time when you do not go to school" · s="Where are you going for your long summer _____ this year when school is closed for two months?" · a=[] · mc=["homework time","test day","school trip"]
- `g1u15.w.national-park` ← v1 `national park`: d="a big area of nature that is protected" · s="We saw big brown bears and beautiful wild deer in the protected _____ where animals live freely." · a=[] · mc=["city centre","shopping mall","school playground"]
- `g1u15.w.parents` ← v1 `parents`: d="your mother and father" · s="My _____ — my mum and dad — are taking me on a trip to Italy this summer by plane." · a=[] · mc=["children","teachers","friends"]
- `g1u15.w.plane` ← v1 `plane`: d="a big machine that flies in the sky" · s="The _____ with wings and two jet engines left the airport at nine in the morning and flew up into the sky." · a=[] · mc=["train","car","boat"]
- `g1u15.w.summer` ← v1 `summer`: d="the warm time of year between spring and autumn" · s="In _____, the hot months of June, July, and August, the days are long and we play outside a lot." · a=[] · mc=["winter","autumn","spring"]
- `g1u15.w.hippo` ← v1 `hippo`: d="a very big animal that lives in rivers in Africa" · s="We saw a big grey _____ — short for hippopotamus — cooling down in the water at the zoo." · a=[] · mc=["lion","tiger","giraffe"]
- `g1u15.w.to-join` ← v1 `to join`: d="to become part of a group" · s="Would you like to _____ our football team? We need one more player for the match on Saturday." · a=[] · mc=["to leave","to avoid","to watch from outside"]
- `g1u15.w.to-invite` ← v1 `to invite`: d="to ask someone to come to a party or event" · s="I want to _____ all my best friends to come to my birthday party at my house on Saturday." · a=[] · mc=["to forget","to ignore","to exclude"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 15 What are you going to do?.txt -----
UNIT 15 What are you going to do?
Page 118 • UNIT 15
At the end of unit 15 ...
you know ☐ how to use (be) going to ☐ how to talk about future plans and holiday activities
you can ☐ talk and ask about future plans ☐ write an email about future plans
READING
1 Read the four texts. Then say what you are going to do in your holidays.
[Image of Bilal - smiling boy] Bilal
I'm going to fly to Tunisia. My grandparents live there. I've got lots of friends there. We are going to play football on the beach every day. And when we are tired we are going to swim in the sea. My grandma is a very good cook. I love the food she cooks. In the evening, we are going to watch TV or play board games. Backgammon is my favourite game.
[Image with beach ball]
[Image of Paul - boy fishing in kayak] Paul
I'm going to stay at home this summer, because my mum and dad have no holiday. They're going to work all summer. When the weather is fine, I'm going to go swimming with my friends or ride my bike. I got new roller skates for my birthday and so I'm going to learn to skate. On Saturday and Sunday I'm going to go fishing.
[Image of sailboat]
[Image of Elisabeth - smiling girl] Elisabeth
My mum, my brother and I are going to go to Croatia. We go there every
[Image of coastal town in Croatia]
year. Mum is going to drive there and we're going to stay at the same campsite. There are other children that come every year. They are from Croatia, the Netherlands, France, Germany, Great Britain and Russia. So I speak a lot of English there. I'm going to play a lot of badminton and tennis. And my friends and I are going to swim in the sea a lot. I love it there. The only thing I don't like is the long drive.
[Image of starfish]
[Image of New York City with Statue of Liberty] Julia
[Image of Julia - smiling girl]
My parents and I are going to fly to the United States. We want to see some of the National Parks. First, we are going to visit New York City. My mum's aunt lives there and she's going to show us the city. I'm so excited. I'm going to write postcards to all my friends. Later we are going to fly to California. I'm a little bit scared of flying, but I
[Image of suitcase]
hope that I can sleep on the plane most of the time. I'm really going to enjoy my trip. It's going to be great.
Page 119 • UNIT 15
4/33 🔊 2 Listen to the poem. Then read it.
When I go on holiday
When hamsters go on holiday, they go to Hungary. They really like the goulash there and all the things to see.
When hippos go on holiday, they go to Ireland. They swim in all the rivers there and join an Irish band.
When horn sharks go on holiday, they just lie in the sun and dream of fish they want to eat. That's what they do for fun.
When I go on holiday, I play it really cool. I go outside and spend the day in my own swimming pool.
[Images showing: hamsters in Hungary boat, hippos in Irish band, child with pool float, person in swimming pool]
GRAMMAR CHANT be going to
4/34 🔊 3 A chant. Listen and repeat.
It's my birthday! What are we going to do? Are we going to have some fun? Are we going to go to the zoo? Are we going to have a party? Are we going to wear something new? No – we're going to stay at home. And do nothing. Just me and you.
Just joking ... Happy birthday! Surprise!
[Image showing family in kitchen with surprise birthday setup]
SPEAKING Talking/Asking about future plans
💬 4 Work in groups. Play a chain game.
A In the holidays, I'm going to swim a lot.
B In the holidays, I'm going to swim a lot and I'm going to play football with my friends.
C In the holidays, I'm going to swim a lot, I'm going to play football with my friends and I'm going to read a book every week.
Page 120 • UNIT 15
5 CHOICES
4/35 🔊 Listen to the dialogues. Then act one of them out in class.
A DIALOGUE 1
💬 A What are you going to do in your holidays? B I'm going to lie in the garden in the sun. A What if there's no sun? B I'm going to watch a lot of series.
[Image of two girls talking outdoors]
B DIALOGUE 2
💬 A What are you going to do on Friday? B Friday? That's the last day of school. A I know. B Well, I'm going to meet my friends, we're going to have a big party. A Great.
A SONG 4 U
4/36+37 🔊 6 Listen and sing.
Hey, it's summertime
Hey, it's summertime. It's the holidays. Yeah, it's summertime and we go our ways.
Work is over, work is done. Soon we'll have a lot of fun. School is over, school is out. Here we sing and here we shout:
Hey, it's summertime ...
Going places, going far, going off in my mum's car. School is over, school is out. Here we sing and here we shout:
Hey, it's summertime ...
Meeting people, meeting friends, I hope the summer never ends. School is over, school is out. Here we sing and here we shout:
Hey, it's summertime ...
[Image of students celebrating outside school building with school bus]
Page 121 • UNIT 15
WRITING
7 CHOICES
Read Alison's email to her friends.
SUBJECT: Party
Hi, Friday is our last day at school and I'm going to have a party! We're going to meet in our garden and we're going to have a lot of fun. Mum's going to make her famous sandwiches and Dad's going to make his summer fruit drinks. I'm going to make a playlist, so please tell me what songs you want to dance to. The party starts at 2 p.m. Don't be late. Love, Alison
A Write an email answer to Alison. Write the words in the correct order to make sentences.
Alison, / Hi
great / a / idea! / What
for / Thank / inviting / you / me.
sure / great / going / party. / it's / to / I'm / a / be
sandwiches. / I / your / Mum's / love
going / bring / I'm / cupcakes. / to
help / I'm / with / not / to / music. / going / the / And / you
you're / choose / sure / to / I'm / the / songs. / best / going
B Write an email answer to Alison (70–80 words). In your email:
say thank you
say when you're going to be there
say that you're going to bring something (you decide)
say that you're going to help with the music
suggest two or three songs
GRAMMAR
▶️ (be) going to
Wenn du über Pläne für die Zukunft sprichst, verwendest du (be) going to.
What are you going to do in your holidays? Are you going to lie in the sun? I'm really going to enjoy my trip. We're going to swim in the sea a lot. She's going to show us the city. They're going to work all summer.
Bildung: Present simple von be + going to + Infinitiv:
They're going to visit their friends.
So bildest du die Verneinung: Present simple von be + not + going to + Infinitiv:
We are not (aren't) going to stay at home.
⏪ Now go back to page 118. Check ☑️ with a partner what you know / can do.


----- WB: WB Unit 15 What are you going to do.txt -----
Unit 15 What are you going to do?
Page 129
UNDERSTANDING GRAMMAR be going to
1 Choose the correct words.
1 Is / Are you going to see me next weekend? 4 She are / is not going to eat all the pizza. 2 I is / am going to watch a film with Sandra. 5 Is / Am she going to bring the music? 3 They are / is going to live with us for half a year. 6 We is / are going to stay at home.
USING GRAMMAR be going to
2 Complete the sentences. Use going to.
[Three images showing: 1. Girl writing at desk, 2. Two people swimming, 3. Person cleaning a bicycle]
1 She .................................................................................... (write) a .............................................. . 2 They .................................................................................... (swim) in the ............................................. . 3 He .................................................................................... (clean) his ............................................ .
3 Write the words in the correct order to make sentences.
1 going / help / is / John / to / you. John is going to help you. 2 email. / write / are / to / we / going / an ......................................................................... 3 going / I / home / to / am / late. / come .........................................................................
4 bike! / fall off / to / are / you / going / your ......................................................................... 5 going / is / angry. / be / Sara / to ......................................................................... 6 at eight. / going / they / to / are / arrive .........................................................................
4 Write questions and use going to.
1 what / do / at the weekend – I'm going to visit my uncle. What are you going to do at the weekend? 2 who / help / me – I'm going to help you. ......................................................................................... 3 where / John / live – He's going to live in our house. ............................................................................................................................................................... 4 what / buy / for her birthday – He's going to buy a book. ............................................................................................................................................................... 5 how / she / feel – She's going to be very sad. ................................................................................. 6 they / buy this house – No, they aren't. They haven't got the money. ...............................................................................................................................................................
Page 130
READING & WRITING Talking/Writing about future plans
5 Read the texts quickly. Who is going to celebrate ...*
☐ a birthday? ☐ an exam result*? ☐ the end of school?
1 Hey class IB! Hooray! It's nearly the ☀️ summer holidays. Let's have a party 🥳 in the park after school on Thursday to celebrate the end of the year. Let's all bring some sandwiches 🥪, biscuits* 🍪 and something to drink 🍹. We're going to take our phones and a Bluetooth speaker* so we can dance. Invite all your friends and let's have some fun! Will and Nathan ✓✓
[Image showing group of people at outdoor party]
2 Hi James, Next Saturday is my birthday 🎂 and I'm going to have a party at home! It's going to be at my house 🏠 (212 Garden Lane). It's a fancy dress party*, so wear a costume! I'm going to be Batman and my brother Ken is going to be a pirate because he's crazy about* them. There's going to be lots of food 🍕🍟🍰😊, so don't eat before you come. Dad is going to do a disco, so I know you're going to be happy because you love dancing 💃. See you Saturday. Three o'clock. Don't be late! Love, Annie ✓
3 Hey Ben, I just passed my karate exam. Now I am a brown belt 🥋 – be careful! So, to celebrate I'm going to have a small party. Well, it's not really a party. Mum says I can invite two friends to go to the cinema on Thursday afternoon, so I after to invite you and Jacob. We're going to see the new Marvel film 📽️. My sister saw it yesterday. She says it's brilliant. After the cinema we're going to the new Italian restaurant 🇮🇹. They have the best pizza 🍕 in town. Please say you can come. Janice ✓✓
VOCABULARY: *celebrate – feiern; exam result – Prüfungsergebnis; biscuit – Keks; speaker – hier: Lautsprecher; fancy dress party – Kostümparty; be crazy about – für etw. schwärmen
6 Read the texts again. How many of these tasks can you do?
Will and Nathan 1 The last day of school is Wednesday. T / F 2 There is going to be music at the party. T / F 3 Everyone can come to the party. T / F
Annie 4 Annie's address is ............................................................................................................................ . 5 Annie's brother really likes ............................................................................................................... . 6 The party starts at ........................................................................................................................... .
Janice 7 Why should Ben 'be careful'? ........................................................................................................... . 8 What are they going to do first? ...................................................................................................... . 9 Where are they going next? ............................................................................................................. .
1/48
7 Listen and check your answers.
Page 131
8 CHOICES
1/49
A Put the dialogue in the correct order. Then listen and check.
☐ A Can I come? ☐ B Of course you can. ☐ A What are you going to do ☐ B Well, I'm going to meet my friends. We're on Friday? going to have a big party. ☐ A I know. ☐ B At my house. ☐ A Where? ☐ B Friday? That's the last day of school.
B Complete the dialogue with your own ideas.
A What are you going to do in your holidays? B ................................................................................................................................................. A What if there's no sun? B ................................................................................................................................................. A What if all your friends are away on holiday? B ................................................................................................................................................. A What if your parents say you can't? B ................................................................................................................................................. A That sounds like fun. I hope you have a good time.
LISTENING & READING Talking/Asking about future plans
1/50
9 Listen and match the speakers with the place they are going to spend their holidays. There are two extra places. Draw lines.
[Image showing luggage with labels "Dana", "Liam", "Lucy" and destination labels: Austria, France, Australia, Scotland, Glasgow]
1/50
10 Listen again and tick T (True) or F (False).
1 Dana is going on holiday with her parents. T ☐ F ☐ 2 Dana is going to spend most days outdoors*. T ☐ F ☐ 3 Liam's family is going on a plane. T ☐ F ☐ 4 Liam is going to spend his holidays in a new place. T ☐ F ☐ 5 Liam thinks he is going to meet lots of new people. T ☐ F ☐ 6 Lucy's dad lives in Sydney. T ☐ F ☐ 7 Lucy is going to spend four weeks in Australia. T ☐ F ☐ 8 Lucy is looking forward to* the flight*. T ☐ F ☐
VOCABULARY: *outdoors – draußen; looking forward to – sich auf etw. freuen; flight – Flug
Page 132
11 Read the postcards of Dana, Liam and Lucy. Write the name of the person who sent each one.
1 [Image of bridge]
Hi Annie, Wow – that was a long flight, but we're here. Look at the famous bridge on this postcard. We went there yesterday. I was still really tired, but it's amazing. I'm going to send you postcards from all the places we visit on our trip up this amazing country. See you in a month! Love, ..................................
Annie Smith 49 London Road Norwich NR65 0RT
2 [Image of water park]
Dear Mum, we're here! The journey was very long and not very comfortable*, but I'm happy to be here. It's perfect. Everything is the same as it was last year. I know I'm going to make a lot of new friends. Miss you, ..................................
Matilda Webb 66 North Road Birmingham B46 9EQ
3 [Image of harbor with boats]
Hi Robin, I'm having lots of fun with my aunt and uncle. They live in a small town, but there's lots to do. Most days I go fishing with my uncle in the morning and we go for a big walk in the afternoon. See you in a few days. Love, ..................................
Robin Fernsby 57 School Lane Twickenham TW51 8CT
*VOCABULARY: comfortable – gemütlich, angenehm
WRITING Writing a postcard
12 You are on holiday. Write a postcard to your best friend. In your postcard, say:
• where you are • how you got there • what the place is like
Page 133
WORD FILE
Holiday activities
[Illustration showing beach scene with labeled activities: to fly to, to go fishing, to stay at a campsite, to swim in the sea, to play badminton, to lie in the sun, to write a postcard, to play board games, to visit a city]
MORE Words and Phrases
Number	English	Example	German
1	aunt	My aunt is my mum's sister.	Tante
	beach	Let's go to the beach and swim in the sea.	Strand
	board game	In the evening, we're going to play board games.	Brettspiel
	campsite	We're going to stay at a campsite and sleep in a tent.	Campingplatz
	cook	My grandma is a very good cook.	Koch/Köchin
	to drive	We're going to drive to Grandma's house. It's a long drive.	fahren; Fahrt
	holiday	My mum and dad have no holiday.	Urlaub; Ferien
	national park	We're going to visit the national parks in the United States.	Nationalpark
	parents	My parents and I are going to fly to the US.	Eltern
	plane	I'm not scared of flying. I can sleep on the plane most of the time.	Flugzeug
	summer	In the summer, I'm going to go swimming.	Sommer
2	hippo	Hippos are big animals.	Nilpferd
	to join	Let's join an Irish band.	beitreten, ein Mitglied werden
7	to invite	Who are you going to invite to your party?	einladen

```

## Output contract

Write `content/corpus/units/g1-u15/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u15",
  "briefBank": "d2f850cdb0ab",
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
