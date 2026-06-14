# Vocab generation brief — g1-u12 (MORE! 1, Unit 12)

<!-- domigo:gen vocab g1-u12 bank=7926349cf887 prompt=346902f9f0f1 -->

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
| g1u12.w.january | January | Jänner | wordfile | — | — | — | January |
| g1u12.w.february | February | Februar | wordfile | — | — | — | February |
| g1u12.w.march | March | März | wordfile | — | — | — | March |
| g1u12.w.april | April | April | wordfile | — | — | — | April |
| g1u12.w.may | May | Mai | wordfile | — | — | — | May |
| g1u12.w.june | June | Juni | wordfile | — | — | — | June |
| g1u12.w.july | July | Juli | wordfile | — | — | — | July |
| g1u12.w.august | August | August | wordfile | — | — | — | August |
| g1u12.w.september | September | September | wordfile | — | — | — | September |
| g1u12.w.october | October | Oktober | wordfile | — | — | — | October |
| g1u12.w.november | November | November | wordfile | — | — | — | November |
| g1u12.w.december | December | Dezember | wordfile | — | — | — | December |
| g1u12.w.bedroom | bedroom | Schlafzimmer | wordfile | — | — | — | bedroom |
| g1u12.w.library | library | Bibliothek | wordfile | — | — | — | library |
| g1u12.w.living-room | living room | Wohnzimmer | wordfile | — | — | — | living room |
| g1u12.w.dining-room | dining room | Esszimmer | wordfile | — | — | — | dining room |
| g1u12.w.bathroom | bathroom | Badezimmer | wordfile | — | — | — | bathroom |
| g1u12.w.hall | hall | Flur ; Diele | wordfile | — | — | — | hall |
| g1u12.w.kitchen | kitchen | Küche | wordfile | — | — | — | kitchen |
| g1u12.w.garden | garden | Garten | wordfile | — | — | — | garden |
| g1u12.w.garage | garage | Garage | wordfile | — | — | — | garage |
| g1u12.w.1st-first | 1st first | 1. erste/r/s | wordfile | — | — | — | 1st first ; 1st ; first |
| g1u12.w.2nd-second | 2nd second | 2. zweite/r/s | wordfile | — | — | — | 2nd second ; 2nd ; second |
| g1u12.w.3rd-third | 3rd third | 3. dritte/r/s | wordfile | — | — | — | 3rd third ; 3rd ; third |
| g1u12.w.4th-fourth | 4th fourth | 4. vierte/r/s | wordfile | — | — | — | 4th fourth ; 4th ; fourth |
| g1u12.w.5th-fifth | 5th fifth | 5. fünfte/r/s | wordfile | — | — | — | 5th fifth ; 5th ; fifth |
| g1u12.w.6th-sixth | 6th sixth | 6. sechste/r/s | wordfile | — | — | — | 6th sixth ; 6th ; sixth |
| g1u12.w.7th-seventh | 7th seventh | 7. siebte/r/s | wordfile | — | — | — | 7th seventh ; 7th ; seventh |
| g1u12.w.8th-eighth | 8th eighth | 8. achte/r/s | wordfile | — | — | — | 8th eighth ; 8th ; eighth |
| g1u12.w.9th-ninth | 9th ninth | 9. neunte/r/s | wordfile | — | — | — | 9th ninth ; 9th ; ninth |
| g1u12.w.10th-tenth | 10th tenth | 10. zehnte/r/s | wordfile | — | — | — | 10th tenth ; 10th ; tenth |
| g1u12.w.11th-eleventh | 11th eleventh | 11. elfte/r/s | wordfile | — | — | — | 11th eleventh ; 11th ; eleventh |
| g1u12.w.12th-twelfth | 12th twelfth | 12. zwölfte/r/s | wordfile | — | — | — | 12th twelfth ; 12th ; twelfth |
| g1u12.w.13th-thirteenth | 13th thirteenth | 13. dreizehnte/r/s | wordfile | — | — | — | 13th thirteenth ; 13th ; thirteenth |
| g1u12.w.14th-fourteenth | 14th fourteenth | 14. vierzehnte/r/s | wordfile | — | — | — | 14th fourteenth ; 14th ; fourteenth |
| g1u12.w.15th-fifteenth | 15th fifteenth | 15. fünfzehnte/r/s | wordfile | — | — | — | 15th fifteenth ; 15th ; fifteenth |
| g1u12.w.16th-sixteenth | 16th sixteenth | 16. sechzehnte/r/s | wordfile | — | — | — | 16th sixteenth ; 16th ; sixteenth |
| g1u12.w.17th-seventeenth | 17th seventeenth | 17. siebzehnte/r/s | wordfile | — | — | — | 17th seventeenth ; 17th ; seventeenth |
| g1u12.w.18th-eighteenth | 18th eighteenth | 18. achtzehnte/r/s | wordfile | — | — | — | 18th eighteenth ; 18th ; eighteenth |
| g1u12.w.19th-nineteenth | 19th nineteenth | 19. neunzehnte/r/s | wordfile | — | — | — | 19th nineteenth ; 19th ; nineteenth |
| g1u12.w.20th-twentieth | 20th twentieth | 20. zwanzigste/r/s | wordfile | — | — | — | 20th twentieth ; 20th ; twentieth |
| g1u12.w.21st-twenty-first | 21st twenty-first | 21. einundzwanzigste/r/s | wordfile | — | — | — | 21st twenty-first ; 21st ; twenty-first |
| g1u12.w.22nd-twenty-second | 22nd twenty-second | 22. zweiundzwanzigste/r/s | wordfile | — | — | — | 22nd twenty-second ; 22nd ; twenty-second |
| g1u12.w.23rd-twenty-third | 23rd twenty-third | 23. dreiundzwanzigste/r/s | wordfile | — | — | — | 23rd twenty-third ; 23rd ; twenty-third |
| g1u12.w.24th-twenty-fourth | 24th twenty-fourth | 24. vierundzwanzigste/r/s | wordfile | — | — | — | 24th twenty-fourth ; 24th ; twenty-fourth |
| g1u12.w.25th-twenty-fifth | 25th twenty-fifth | 25. fünfundzwanzigste/r/s | wordfile | — | — | — | 25th twenty-fifth ; 25th ; twenty-fifth |
| g1u12.w.30th-thirtieth | 30th thirtieth | 30. dreißigste/r/s | wordfile | — | — | — | 30th thirtieth ; 30th ; thirtieth |
| g1u12.w.31st-thirty-first | 31st thirty-first | 31. einunddreißigste/r/s | wordfile | — | — | — | 31st thirty-first ; 31st ; thirty-first |
| g1u12.w.birthday-cake | birthday cake | Geburtstagskuchen/-torte | phrase | — | Mike's mum is making a big birthday cake for his birthday. | — | birthday cake |
| g1u12.w.eater | eater | Esser/Esserin | phrase | — | She never eats much. She's not a big eater. | — | eater |
| g1u12.w.ill | ill | krank | phrase | — | He isn't at school today because he's ill. | — | ill |
| g1u12.w.messy | messy | unordentlich ; schlampig | phrase | — | He's a messy eater. | — | messy |
| g1u12.w.piece | piece | Stück | phrase | — | Have a piece of my birthday cake! | — | piece |
| g1u12.w.cinema | cinema | Kino | phrase | — | Let's go to the cinema on Friday. | — | cinema |
| g1u12.w.excellent | excellent | ausgezeichnet | phrase | — | That's excellent work! | — | excellent |
| g1u12.w.finally | finally | endlich ; schließlich | phrase | — | Oh good! Finally we can leave! | — | finally |
| g1u12.w.match | match | Match ; Spiel | phrase | — | There's a volleyball match on Saturday. | — | match |
| g1u12.w.it-s-my-birthday | It's my birthday. | Ich habe Geburtstag. | phrase | — | — | — | It's my birthday. |
| g1u12.w.date | date | Datum | phrase | — | Today's date is Monday, July 7th. | — | date |
| g1u12.w.month | month | Monat | phrase | — | February is the second month of the year. | — | month |
| g1u12.w.how-old-are-you | How old are you? | Wie alt bist du? | phrase | — | — | — | How old are you? |
| g1u12.w.candle | candle | Kerze | phrase | — | The cake has twelve candles on it. | — | candle |
| g1u12.w.delicious | delicious | köstlich | phrase | — | The chocolate cake looks delicious. | — | delicious |
| g1u12.w.last | last | letzter/letzte/letztes | phrase | — | There was a robbery last night. | — | last |
| g1u12.w.robber | robber | Räuber/Räuberin | phrase | — | He wants to find the robber. | — | robber |
| g1u12.w.robbery | robbery | Raubüberfall | phrase | — | There was a robbery at the big house. | — | robbery |
| g1u12.w.yesterday | yesterday | gestern | phrase | — | Where were you yesterday at 9 p.m.? | — | yesterday |
| g1u12.w.alarm-clock | alarm clock | Wecker | phrase | — | The alarm clock wakes me up every morning. | — | alarm clock |
| g1u12.w.probably | probably | wahrscheinlich | phrase | — | Last night at 9 p.m. I was probably in the garden. | — | probably |
| g1u12.w.good-for-you | Good for you! | Schön für dich! | phrase | — | — | — | Good for you! |
| g1u12.w.inspector | inspector | Inspektor/Inspektorin | phrase | — | The inspector asks the questions. | — | inspector |
| g1u12.w.how-dare-you | How dare you! | Wie kannst du es wagen! | phrase | — | — | — | How dare you! |
| g1u12.w.that-was-close | That was close. | Das war knapp. | phrase | — | — | — | That was close. |
| g1u12.w.you-re-welcome | You're welcome. | Nichts zu danken. ; Keine Ursache. ; Gern geschehen. | phrase | — | — | — | You're welcome. |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alphabet, Alps, Anderson, Anger, Annie, Arbeit, Archie, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Come, Complimenting, Dad, Dan, Dana, Daniel, Darkman, Dave, David, Davis, Debbie, Dialog, Dialoge, Doctor, Doctors, Don, Dragon, Ellie, Emma, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Henry, Hmm, Holmes, Homework, Hook, Hunt, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Janet, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Just, Kate, Ken, Kitty, Leah, Leo, Lethabo, Leute, Lewis, Li, Lisa, London, Lucy, Mail, Manchester, Mandy, Manson, Mario, Mark, Marple, Mary, Matt, Mike, Miss, Mr, Mrs, Mum, New, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Past, Paws, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Prepositions, Present, Priestly, Project, Put, Rajit, Rashmi, Red, Reihenfolge, Richard, Robert, Ronald, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Sophie, Steve, Sue, Suzy, Tamar, Tamara, Tammy, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, True, Uhr, Um, Vienna, Walker, Wall, Watson, Welcome, Well, White, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u12.w.january` ← v1 `January`: d="the first month of the year" · s="The new year starts in _____." · a=[] · mc=["February","June","December"]
- `g1u12.w.february` ← v1 `February`: d="the second month of the year" · s="Valentine's Day is in _____." · a=[] · mc=["January","March","November"]
- `g1u12.w.march` ← v1 `March`: d="the third month of the year" · s="Spring often begins in _____." · a=[] · mc=["April","February","May"]
- `g1u12.w.april` ← v1 `April`: d="the fourth month of the year" · s="It often rains a lot in _____." · a=[] · mc=["March","May","June"]
- `g1u12.w.may` ← v1 `May`: d="the fifth month of the year" · s="The flowers are beautiful in _____." · a=[] · mc=["April","June","March"]
- `g1u12.w.june` ← v1 `June`: d="the sixth month of the year" · s="Summer holidays start at the end of _____." · a=[] · mc=["July","May","August"]
- `g1u12.w.july` ← v1 `July`: d="the seventh month of the year" · s="It is very hot here in _____." · a=[] · mc=["June","August","September"]
- `g1u12.w.august` ← v1 `August`: d="the eighth month of the year" · s="We always go on holiday in _____." · a=[] · mc=["July","September","June"]
- `g1u12.w.september` ← v1 `September`: d="the ninth month of the year" · s="School starts again in _____." · a=[] · mc=["October","August","November"]
- `g1u12.w.october` ← v1 `October`: d="the tenth month of the year" · s="Halloween is at the end of _____." · a=[] · mc=["September","November","December"]
- `g1u12.w.november` ← v1 `November`: d="the eleventh month of the year" · s="The days get very short in _____." · a=[] · mc=["October","December","September"]
- `g1u12.w.december` ← v1 `December`: d="the twelfth month of the year" · s="Christmas is in _____." · a=[] · mc=["November","January","October"]
- `g1u12.w.bedroom` ← v1 `bedroom`: d="the room where you sleep" · s="My soft teddy bear is on the pillow of my bed in my _____. That is where I sleep every night." · a=[] · mc=["kitchen","bathroom","garage"]
- `g1u12.w.library` ← v1 `library`: d="a place with many books to read" · s="I go to the quiet _____ with thousands of books on tall shelves to borrow a story book." · a=[] · mc=["classroom","gym","dining room"]
- `g1u12.w.living-room` ← v1 `living room`: d="the room where a family sits together" · s="The big soft sofa and the television are in the _____ where we watch films together." · a=[] · mc=["bathroom","kitchen","bedroom"]
- `g1u12.w.dining-room` ← v1 `dining room`: d="the room where you eat meals" · s="We eat breakfast together as a family at the big table in the _____ every morning." · a=[] · mc=["garage","bathroom","garden"]
- `g1u12.w.bathroom` ← v1 `bathroom`: d="the room where you wash yourself" · s="I brush my teeth and wash my face in the _____ by the sink and mirror every morning." · a=[] · mc=["bedroom","kitchen","living room"]
- `g1u12.w.hall` ← v1 `hall`: d="the area inside the front door of a house" · s="Please leave your wet shoes and coat in the _____ near the front door when you come into the house." · a=[] · mc=["kitchen","bathroom","bedroom"]
- `g1u12.w.kitchen` ← v1 `kitchen`: d="the room where you cook food" · s="Mum is making breakfast on the stove in the _____ where the fridge and cooker are." · a=[] · mc=["bathroom","bedroom","living room"]
- `g1u12.w.garden` ← v1 `garden`: d="the green area outside your house" · s="We grow fresh red tomatoes and colourful flowers in our _____ at the back of the house." · a=[] · mc=["living room","bathroom","kitchen"]
- `g1u12.w.garage` ← v1 `garage`: d="a building where you keep your car" · s="Dad parks his red car inside the _____ next to the house every evening when he comes home from work." · a=[] · mc=["living room","bedroom","kitchen"]
- `g1u12.w.1st-first` ← v1 `first`: d="number one in order" · s="Monday is the _____ day of the school week." · a=[] · mc=["second","third","last"]
- `g1u12.w.2nd-second` ← v1 `second`: d="number two in order" · s="February is the _____ month of the year." · a=[] · mc=["first","third","fourth"]
- `g1u12.w.3rd-third` ← v1 `third`: d="number three in order" · s="Wednesday is the _____ day of the school week." · a=[] · mc=["second","fourth","fifth"]
- `g1u12.w.4th-fourth` ← v1 `fourth`: d="number four in order" · s="April is the _____ month of the year." · a=[] · mc=["third","fifth","sixth"]
- `g1u12.w.5th-fifth` ← v1 `fifth`: d="number five in order" · s="Friday is the _____ day of the school week." · a=[] · mc=["fourth","sixth","third"]
- `g1u12.w.6th-sixth` ← v1 `sixth`: d="number six in order" · s="June is the _____ month of the year." · a=[] · mc=["fifth","seventh","fourth"]
- `g1u12.w.7th-seventh` ← v1 `seventh`: d="number seven in order" · s="July is the _____ month of the year." · a=[] · mc=["sixth","eighth","fifth"]
- `g1u12.w.8th-eighth` ← v1 `eighth`: d="number eight in order" · s="August is the _____ month of the year." · a=[] · mc=["seventh","ninth","sixth"]
- `g1u12.w.9th-ninth` ← v1 `ninth`: d="number nine in order" · s="September is the _____ month of the year." · a=[] · mc=["eighth","tenth","seventh"]
- `g1u12.w.10th-tenth` ← v1 `tenth`: d="number ten in order" · s="October is the _____ month of the year." · a=[] · mc=["ninth","eleventh","eighth"]
- `g1u12.w.11th-eleventh` ← v1 `eleventh`: d="number eleven in order" · s="November is the _____ month of the year." · a=[] · mc=["tenth","twelfth","ninth"]
- `g1u12.w.12th-twelfth` ← v1 `twelfth`: d="number twelve in order" · s="December is the _____ month of the year." · a=[] · mc=["eleventh","thirteenth","tenth"]
- `g1u12.w.13th-thirteenth` ← v1 `thirteenth`: d="number thirteen in order" · s="My birthday is on the _____ of May." · a=[] · mc=["twelfth","fourteenth","eleventh"]
- `g1u12.w.14th-fourteenth` ← v1 `fourteenth`: d="number fourteen in order" · s="Valentine's Day is on the _____ of February." · a=[] · mc=["thirteenth","fifteenth","twelfth"]
- `g1u12.w.15th-fifteenth` ← v1 `fifteenth`: d="number fifteen in order" · s="The test is on the _____ of March." · a=[] · mc=["fourteenth","sixteenth","thirteenth"]
- `g1u12.w.16th-sixteenth` ← v1 `sixteenth`: d="number sixteen in order" · s="Her party is on the _____ of April." · a=[] · mc=["fifteenth","seventeenth","fourteenth"]
- `g1u12.w.17th-seventeenth` ← v1 `seventeenth`: d="number seventeen in order" · s="The school trip is on the _____ of June." · a=[] · mc=["sixteenth","eighteenth","fifteenth"]
- `g1u12.w.18th-eighteenth` ← v1 `eighteenth`: d="number eighteen in order" · s="His birthday is on the _____ of October." · a=[] · mc=["seventeenth","nineteenth","sixteenth"]
- `g1u12.w.19th-nineteenth` ← v1 `nineteenth`: d="number nineteen in order" · s="The concert is on the _____ of November." · a=[] · mc=["eighteenth","twentieth","seventeenth"]
- `g1u12.w.20th-twentieth` ← v1 `twentieth`: d="number twenty in order" · s="Christmas holidays start on the _____ of December." · a=[] · mc=["nineteenth","twenty-first","thirtieth"]
- `g1u12.w.21st-twenty-first` ← v1 `twenty-first`: d="number twenty-one in order" · s="The party is on the _____ of July." · a=[] · mc=["twentieth","twenty-second","thirty-first"]
- `g1u12.w.22nd-twenty-second` ← v1 `twenty-second`: d="number twenty-two in order" · s="They arrive on the _____ of August." · a=[] · mc=["twenty-first","twenty-third","twentieth"]
- `g1u12.w.23rd-twenty-third` ← v1 `twenty-third`: d="number twenty-three in order" · s="The match is on the _____ of January." · a=[] · mc=["twenty-second","twenty-fourth","twenty-first"]
- `g1u12.w.24th-twenty-fourth` ← v1 `twenty-fourth`: d="number twenty-four in order" · s="Christmas Eve is on the _____ of December." · a=[] · mc=["twenty-third","twenty-fifth","twenty-second"]
- `g1u12.w.25th-twenty-fifth` ← v1 `twenty-fifth`: d="number twenty-five in order" · s="Christmas Day is on the _____ of December." · a=[] · mc=["twenty-fourth","twenty-sixth","thirtieth"]
- `g1u12.w.30th-thirtieth` ← v1 `thirtieth`: d="number thirty in order" · s="The last day of April is the _____." · a=[] · mc=["twentieth","thirty-first","twenty-ninth"]
- `g1u12.w.31st-thirty-first` ← v1 `thirty-first`: d="number thirty-one in order" · s="New Year's Eve is on the _____ of December." · a=[] · mc=["thirtieth","twenty-first","first"]
- `g1u12.w.birthday-cake` ← v1 `birthday cake`: d="a special cake for a birthday" · s="Mum made a big chocolate _____ with twelve candles on top for my 12th birthday party." · a=[] · mc=["dinner plate","loaf of bread","bowl of soup"]
- `g1u12.w.eater` ← v1 `eater`: d="a person who eats" · s="My little brother is a very slow _____ at the dinner table — it takes him an hour to finish his food." · a=[] · mc=["runner","singer","driver"]
- `g1u12.w.ill` ← v1 `ill`: d="not feeling well, sick" · s="Tom is _____ today with a high fever. He is staying in bed and his mum is making him soup." · a=[] · mc=["happy","excited","well"]
- `g1u12.w.messy` ← v1 `messy`: d="not clean or tidy" · s="Your bedroom is very _____ with clothes on the floor and toys everywhere. Please tidy it up now!" · a=[] · mc=["tidy","clean","neat"]
- `g1u12.w.piece` ← v1 `piece`: d="one part of something bigger" · s="Can I have a _____ of the chocolate cake, please? Just one slice is enough for me." · a=[] · mc=["bucket","bag","box"]
- `g1u12.w.cinema` ← v1 `cinema`: d="a place where you watch films" · s="Let's go to the _____ with a big screen and popcorn and see the new Marvel film tonight." · a=[] · mc=["library","gym","hospital"]
- `g1u12.w.excellent` ← v1 `excellent`: d="very, very good" · s="You got ten out of ten on the maths test with no mistakes. That is _____ work!" · a=[] · mc=["terrible","bad","wrong"]
- `g1u12.w.finally` ← v1 `finally`: d="after a long time" · s="We waited impatiently for a whole hour at the bus stop and _____ the late bus came around the corner." · a=[] · mc=["immediately","quickly","early"]
- `g1u12.w.match` ← v1 `match`: d="a game between two teams" · s="There is a big football _____ between our team and our rival team on Saturday afternoon at the stadium." · a=[] · mc=["lesson","test","song"]
- `g1u12.w.it-s-my-birthday` ← v1 `It's my birthday.`: d="a phrase to say today is your special day with cake and presents" · s="_____ Today I am eleven years old and we are having a big party with cake!" · a=[] · mc=["It's Monday.","It's lunch time.","It's cold."]
- `g1u12.w.date` ← v1 `date`: d="the day, month, and year" · s="What is today's _____? — It's March 5th, 2026." · a=[] · mc=["time","year","weather"]
- `g1u12.w.month` ← v1 `month`: d="one of twelve parts of a year" · s="There are exactly twelve _____ in one year, starting with January and ending with December." · a=["months"] · mc=["weeks","days","hours"]
- `g1u12.w.how-old-are-you` ← v1 `How old are you?`: d="asking someone's age" · s="_____ — I am eleven. My next birthday is in June." · a=[] · mc=["What day is it?","Where do you live?","What is your name?"]
- `g1u12.w.candle` ← v1 `candle`: d="a stick of wax that gives light" · s="We put exactly twelve small _____ sticks on top of the birthday cake and lit them all with a match." · a=["candles"] · mc=["flowers","strawberries","chocolates"]
- `g1u12.w.delicious` ← v1 `delicious`: d="very good to eat" · s="This homemade chocolate cake is really _____! I want to eat another big slice right now!" · a=[] · mc=["horrible","terrible","bad"]
- `g1u12.w.last` ← v1 `last`: d="the one before this one" · s="We went on holiday to London _____ summer in July 2025. This summer we are staying home." · a=[] · mc=["next","this","tomorrow"]
- `g1u12.w.robber` ← v1 `robber`: d="a person who steals things" · s="The police caught the _____ with a black mask and a bag of stolen money near the bank." · a=[] · mc=["teacher","doctor","baker"]
- `g1u12.w.robbery` ← v1 `robbery`: d="the crime of stealing from a place" · s="There was a serious _____ at the jewellery shop last night. Thieves took all the gold rings and watches." · a=[] · mc=["concert","wedding","celebration"]
- `g1u12.w.yesterday` ← v1 `yesterday`: d="the day before today" · s="I was at my grandma's house _____ — the day before today. Today I am at home." · a=[] · mc=["tomorrow","next week","in 2030"]
- `g1u12.w.alarm-clock` ← v1 `alarm clock`: d="a clock that wakes you up with noise" · s="My _____ on the bedside table rings very loudly at seven every morning to wake me up for school." · a=[] · mc=["wall clock","watch","kitchen clock"]
- `g1u12.w.probably` ← v1 `probably`: d="most likely, almost sure" · s="It is very cloudy and grey outside, so it will _____ rain later this afternoon. I should take my umbrella." · a=[] · mc=["definitely not","certainly not","never"]
- `g1u12.w.good-for-you` ← v1 `Good for you!`: d="saying you are happy for someone" · s="You won first prize in the singing competition? _____! I am so happy for your success!" · a=[] · mc=["Bad luck!","Too bad!","Sorry!"]
- `g1u12.w.inspector` ← v1 `inspector`: d="a police officer who finds answers" · s="The police _____ with a notebook asked the shopkeeper many questions about the robbery to solve the case." · a=[] · mc=["criminal","thief","robber"]
- `g1u12.w.how-dare-you` ← v1 `How dare you!`: d="showing you are angry at someone" · s="You ate my lunch without asking me first! _____ That was very rude!" · a=[] · mc=["Thank you!","Well done!","Good job!"]
- `g1u12.w.that-was-close` ← v1 `That was close.`: d="something almost went wrong" · s="The speeding car nearly hit us as we crossed the road. _____! We were almost hurt!" · a=[] · mc=["That was boring.","That was slow.","That was easy."]
- `g1u12.w.you-re-welcome` ← v1 `You're welcome.`: d="what you say after someone thanks you" · s="Thank you so much for your help with my homework! — _____. I was happy to help you." · a=[] · mc=["No thanks.","I refuse.","Go away."]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 12 The birthday cake.txt -----
UNIT 12 The birthday cake
Pages 92-93
At the end of unit 12 ...
you know
months and dates
how to use ordinal numbers
how to use time prepositions
you can
10 words for rooms in a house
how to use the past simple (was, were)
talk and ask about dates
say and ask where people were
write a dialogue in the past
SOUNDS RIGHT /θ/
1 Listen and repeat.
[IMAGE: Illustration of a birthday cake with a girl looking at it]
Birthday cake
The first piece is for Sue. The second goes to you. The third piece is for Peter. He's a messy eater. The fourth piece is for Steve. The fifth piece goes to Kate. They think the cake is great!
The sixth and seventh go to Bill. He eats them – and he's feeling ill. You're right! The eighth piece? True! The eighth piece is for you. The ninth piece is for Jeremy. The tenth piece is – for me! He, he, he, he, he!
2 Listen and repeat.
10th – the tenth 11th – the eleventh 12th – the twelfth 13th – the thirteenth
20th – the twentieth 21st – the twenty-first 22nd – the twenty-second 23rd – the twenty-third
30th – the thirtieth 31st – the thirty-first ...
LISTENING & SPEAKING Talking/Asking about dates
3 Listen and circle. When can Sue go to the cinema with her dad?
[TABLE: Calendar showing various dates and activities from SAT 11th through TUE 21st, including volleyball, Joe's party, football, tennis, Tom's birthday, Mum's birthday, basketball, concert, and Jack's party across different dates from WED 22nd through FRI 31st]
4 Cover up Sue's diary in 3. Test your memory and answer these questions.
1 The 14th is a Tuesday. What days are the 15th, the 17th, the 24th, the 31st? 2 What is on the 11th – Joe's party or a volleyball match? 3 Can Sue play tennis on the 16th? 4 On what day of the week can they go to the cinema?
Pages 94-95
READING & LISTENING
10 Listen to the beginning of Jessie's story. Then read it.
[IMAGE: Illustration showing a messy kitchen with a girl in pajamas looking distressed, surrounded by party decorations and mess]
The case of the missing cake
Yesterday was my birthday. It was a great day. My party was fun, but the best thing was my cake. A chocolate cake with twelve red candles. It was delicious.
Last night, I went* to bed at 9 p.m. There was one piece of cake left. It was on the table – perfect for my breakfast. This morning, the piece of cake wasn't there! Last night, there was a robbery in my kitchen! I want to find the robber.
VOCABULARY: *went – past simple form of go
11 Jessie is in the kitchen. She is looking for clues. Listen to part 2 of the story and answer the questions.
1 What does she find on the floor? ....................................................................................................... 2 What time is it on the clock? ............................................................................................................. 3 What time was the robbery? ............................................................................................................. 4 Who was in the house last night? ......................................................................................................
12 Look at the picture and listen to the words.
[IMAGE: Floor plan of a house showing: 1 garden, 2 living room, 3 library, 4 bathroom, 5 garage, 6 hall, 7 kitchen, 8 dining room, 9 bedroom, and another bedroom]
13 Read and listen to the interviews. Look at the picture in 12 and write the names of the people in the rooms where they were last night.
[DIALOGUE WITH IMAGES: Series of conversations between Jessie and family members]
Jessie Mum, where were you at 9:15 p.m. last night? Mum I'm not sure. Why? Jessie Just think, Mum. It's important. Mum OK, I think I was in the living room with your dad. Of course, we were. There was a good film on TV.
[IMAGE: Mum in garden]
Jessie Were you with Mum last night at 9:15 p.m.? Dad Sorry? Jessie Were you with Mum last night at 9:15 p.m.? Dad Probably ... umm ... yes, we were in the living room. Why? Jessie No reason.
[IMAGE: Dad working]
[IMAGE: Grandpa sitting]
Jessie Grandpa, were you in the kitchen last night at 9:15 p.m.? Grandpa No, I wasn't. I was in the garden. Jessie The garden? At 9:15? Grandpa Yes, there was a beautiful sunset.
Jessie Can I ask you a question, Tom? Tom What? Jessie Where were you last night at 9:15? Tom Here in my bedroom. I was online with my friends. Jessie Of course.
[IMAGE: Tom at computer]
Jessie Ellie, were you in the kitchen last night at 9:15? Ellie No, I wasn't. I was in the dining room. Jessie The dining room? Ellie Yes. I was. I remember because there was a loud noise in the kitchen. Jessie A loud noise? Ah ha!
[IMAGE: Ellie]
14 In pairs. Who do you think was the robber? Listen and check your answer.
15 Look at the picture in 10. What can you find to show that Ellie is right?
Pages 96-97
GRAMMAR CHANT was – were
16 A chant. Listen and repeat.
[IMAGE: Two children talking, one says "He was MAD!"]
A He was happy. B I was hot. A She was happy. B I was not. A Were you happy? B I was sad. A Was he happy? B He was mad.
A Was she happy? B Yes, she was. A Were they happy? B No, because ... No one was! A That's not true. I was happy. B Good for you!
SPEAKING Saying/Asking where people were
17 CHOICES
A Work in pairs. Look at the picture for a minute. Remember the names and the rooms. Close your books. Ask your partner about four people in the picture.
[IMAGE: Cross-section of house showing multiple people in different rooms with names labeled: Lucy, Daniel, Kate, Trevor, Mary, Sophie, Bob, Bill]
Where were Bob and Bill?
They were in the living room.
B Look at the picture and talk about the people. Use the words in the box.
sad happy hungry cold scared angry
[IMAGE: Cross-section of house showing different people at different times: Henry (11:45), Sue (11:15), Sally and Fred (10:30), Sandra and Tony (7:15), Kevin (4:10), Brian (5:00)]
At 5 o'clock, Brian was in the kitchen. He was hungry.
At ... Sally and Fred were ... . They were ...
18 Complete the sentences so they are true for you.
On Sunday ... 1 at 7 a.m. I was ...in bed... 2 at 9 a.m. I ....................................................................................................................................................... 3 at 12 p.m. I ..................................................................................................................................................... 4 at 3 p.m. I ....................................................................................................................................................... 5 at 8 p.m. I ....................................................................................................................................................... 6 at midnight I ...................................................................................................................................................
19 In pairs, ask and answer questions.
Where were you at 7 a.m. yesterday? I was in the kitchen.
So was I*. / I wasn't. I was in bed. Asleep!
*VOCABULARY: So was I. – Ich auch.
WRITING
20 CHOICES
A Complete the dialogue with the words from the box.
all was your where think there
Inspector Mr Clark, 1.................................... were you yesterday at 10 p.m.? Mr Clark I 2.................................... in the living room all evening. Inspector Aha, 3.................................... evening? Mr Clark Yes, 4.................................... was an interesting film on TV. Inspector Mr Clark. Is this 5.................................... pen? Mr Clark Yes, it is. Why do you ask? Inspector This pen was in the library. I 6.................................... you are the robber, Mr Clark.
[IMAGE: Illustration showing inspector questioning Mr. Clark at desk]
B Write a dialogue. Use the following ideas.
The inspector interviews a man or a woman. They say they were in a room all evening. The inspector finds something of this person in another room.
Pages 98-99
GRAMMAR
Ordinal numbers
Für Aufzählungen (der erste, der zweite, usw.) verwendest du die folgenden Wörter:
one → first | five → fifth | nine → ninth two → second | six → sixth | ten → tenth three → third | seven → seventh | eleven → eleventh four → fourth | eight → eighth | twelve → twelfth
Ordnungszahlen über 20 bildest du nach dem gleichen Prinzip:
→ twenty-first | 32. → thirty-second | 43. → forty-third | 54. → fifty-fourth (etc.)
Time prepositions
Du verwendest unterschiedliche Präpositionen (Vorwörter), um über Tage, das Datum und die Uhrzeit zu sprechen.
My birthday is on February 12th / May 28th / September 5th (etc.). The concert's on Thursday, July 15th. My sister's birthday is in December / April / June (etc.). The film starts at 7 o'clock / half past eight / 6:45 (etc.). I have maths in the morning / the afternoon. We go to bed late at night.
[IMAGE: Cartoon of person pointing at calendar showing dates 31 and 32]
Past simple (1) was – were
Du verwendest das Past simple, um etwas Vergangenes zu erzählen. Was / were werden gleich verwendet wie "ich war / du warst" usw. im Deutschen.
At 9 o'clock I was at school. Tom wasn't there. Peter and John were in their classroom. Sandra and Kate weren't there.
[IMAGE: Cartoon showing sharks with text bubble "They were not alone!"]
[TABLE: Conjugation table showing positive, negative, and question forms of was/were for all pronouns]
Now go back to page 92. Check ☑ with a partner what you know / can do.
THE STORY OF THE STONES 6
Three stones to rule the universe!
1 Look at the pictures from episode 6. Make up a story of your own.
Start like this:
[IMAGE: Three panels showing characters in Cairn Castle - first panel shows two children at a door, second shows a dark figure with a child, third shows a silhouette jumping]
The children are knocking at the door of Cairn Castle. The door opens ...
2 Watch episode 6. Then answer the questions below.
1 Where are Emma and Daniel at the beginning of the episode? 2 What does Sarah say to Emma when Darkman wants Emma's stone? 3 What does Darkman do with the stones? 4 Why does Darkman lift Daniel up? 5 Who is watching the children? 6 Where is Darkman running?
EVERYDAY ENGLISH
3 Complete the dialogues with the phrases from the box.
How dare you! You're welcome. That was close.
Darkman It's not the real stone! 1............................................................................. Daniel Phew! 2.............................................................................
Sunborn Thank you all very much. You were a great help. Emma 3.............................................................................
4 Can you find the message?
CODE: ▼ = a ☐ = e ♥ = i ⚫ = o ☐ = u ✱ = h ◉ = l ⚡ = m ◯ = n ▲ = s
[IMAGE: Coded message using symbols described above, arranged in multiple lines]


----- WB: WB Unit 12 The birthday cake.txt -----
Unit 12 The birthday cake
Pages 102-103
UNDERSTANDING VOCABULARY Months / Ordinal numbers / Rooms in a house
1 Find the 12 months in the word snake and write them in the correct order.
[Image of a word snake containing the months: aprilaugustdecemberfebruaryJanuaryJulyJunemarchmaynovemberoctoberseptember]
1 ................................. 4 April 7 ................................. 10 ................................ 2 ................................. 5 ................................. 8 ................................. 11 ................................ 3 ................................. 6 ................................. 9 ................................. 12 ................................
2 Find out what day the children's birthdays are and write down the numbers.
[Diagram showing names connected to ordinal numbers:] Alan, Harry, Grace, Sophie, Mia, Tom connected to: twenty-fourth, twenty-first, thirtieth, eighth, twenty-second, twelfth
Birthdays this month:
........... Alan's birthday is on the 22nd ........... ................................................................................ ................................................................................ ................................................................................ ................................................................................ ................................................................................
3 Find and circle the seven rooms of the house in the wordsearch (↓→).
[Word search grid:] B E D R O O M B F L L D U J O L T U B A V I C I N O O P D F I J F B T N A F B V H H A L L R P I E J K I T C H E N A S N M L M V A V P V X R O G R A E F P T J U C Y S R Z W B A T H R O O M T O F X O N N T W H G I T O B I L I V I N G R O O M
................................................................ ................................................................ ................................................................ ................................................................ ................................................................ ................................................................ ................................................................
Pages 103-104
USING VOCABULARY Ordinal numbers / Rooms in a house
4 Make these numbers into ordinals.
12 the twelfth (12th) 46 ............................................... 33 ............................................... 72 ............................................... 99 ............................................... 13 ............................................... 40 ............................................... 30 ............................................... 21 ............................................... 14 ............................................... 8 ............................................... 82 ...............................................
5 Put the poem in the correct order. Write 1–6.
☐ The fourth piece is for Steve. The fifth piece goes to Kate. They think the cake is great!
☐ The ninth piece is for Jeremy The tenth piece is — for me!
☐ The sixth and seventh go to Jill. He eats them — and he's feeling ill.
☐ The first piece is for Sue. The second goes to you.
☐ You're right! The eighth piece? True! The eighth piece is for you.
☐ The third piece is for Peter. He's a messy eater.
6 Write the names of the rooms.
1 We cook there. ....................................................................................... 2 We watch TV there. ....................................................................................... 3 We sleep there. ....................................................................................... 4 We eat dinner there. ....................................................................................... 5 We read our books there. ....................................................................................... 6 We wash our hands there. ....................................................................................... 7 We put our jackets there. .......................................................................................
7 What else do you do in these rooms? Write different things to 6.
[Six images showing different rooms: kitchen, living room, hallway/entrance, bathroom, bedroom, and another room]
................................................ ................................................ .................................................................... ................................................ ................................................ ....................................................................
Pages 104-105
UNDERSTANDING GRAMMAR Time prepositions
8 Complete the sentences with the words from the box.
at in in in on at
1 My birthday's ....................................... April 12th. 2 My mum's birthday is ...................................... May. 3 I get up ...................................... the morning and bake* a cake for her. 4 ....................................... the evening we have a party. 5 We go to bed late ...................................... night. 6 I get up ...................................... six o'clock again, but it's OK.
*VOCABULARY: bake – backen
UNDERSTANDING GRAMMAR Past simple (1) was – were
9 Complete the sentences with was or were.
1 I ................................. at school from eight to three yesterday. 2 Jane and Nick ................................. at the shopping centre this morning. 3 You ................................. not at home. 4 She ................................. my sister's best friend. 5 Our teacher ................................. angry. 6 We ................................. late for school this morning.
10 Circle the correct words.
1 I wasn't / weren't in the library at 9 p.m. 2 Daniel wasn't / weren't at school today. 3 My friends weren't / wasn't angry with me. 4 They wasn't / weren't alone in the house. 5 He weren't / wasn't hungry. 6 We wasn't / weren't at John's birthday party.
USING GRAMMAR Time prepositions
11 Complete the dialogues with the correct prepositions of time.
1 A When's your birthday, Hanna? 4 A When's Ashley's birthday? B It's .......... on .......... November 3rd. B I'm not sure. I think it's ....................... July or August. 2 A What day is Tom's birthday this year? B It's next Monday, but he's having a big 5 A It's Lisa's birthday ....................... birthday party ....................... Saturday. Sunday. 3 A Can you come and see me B Oh, really? I must buy her a present ....................... 10 a.m.? then. B No, I can't see you ....................... the 6 A When does your school start? morning. I'm busy. B It starts ....................... eight o'clock.
Pages 105-106
USING GRAMMAR Past simple (1) was – were
12 Write dialogues in your exercise book.
A Where was/were ... at ... ? B He/She was at the ... / They were at the ...
[Six images showing different locations and times:]
Paul / 4 p.m. / shopping centre [Image: person at shopping center]
Debbie / 3:30 p.m. / park [Image: person at park]
Sue and John / 7:45 p.m. / cinema [Image: people at cinema]
Dawn / 9:10 a.m. / bus stop [Image: person at bus stop]
Kevin / 5 p.m. / sports centre [Image: person at sports center]
Tim and Sharon / 5:50 p.m. / train station* [Image: people at train station]
*VOCABULARY: train station – Bahnhof
13 Look at the picture and read the text. Write sentences in your exercise book to correct the text.
[Large illustration showing a cross-section of a house with multiple rooms and people labeled: Lynne, Henry, Tom, Sue, Tony, John, Ken. Each person is in a different room doing different activities.]
Last night at 9 p.m., John, Tom and Sue, Henry, Lynne, Tony and Ken were all at home. John was in the hall. He was very cold. Tom and Sue were in the bathroom. They were very happy. Henry was in the dining room. He was sad. Lynne was in the living room. She was scared. Tony was in the kitchen. He was hungry. And Ken was in the bedroom. He was angry.
John wasn't in the hall. He was in the kitchen. He was very hungry.
Pages 106-107
LISTENING Saying/Asking where people were
1/39
14 Last night there was a robbery at Buckingham Hall – someone stole an expensive painting from the library. Inspector Clewdup is interviewing everyone who was in the house. Listen and write the room they say they were in.**
WHO? WHERE? Lady Brown Henry Brown Mrs Black Mr White Miss Green
[Illustration showing an inspector interviewing someone in a library]
*VOCABULARY: stole – past form of steal; painting – Bild, Gemälde
1/39
15 Listen again and answer the questions.
1 Who was Lady Brown with? .............................................................................................................. 2 Where does she think her son* was? ............................................................................................... 3 Where does Henry Brown say his parents were? ............................................................................ 4 Why was Mrs Black in the kitchen? .................................................................................................. 5 Who was Mr White with? .................................................................................................................. 6 Who is telling a lie*? Who do you think is the robber? ....................................................................
*VOCABULARY: husband – Ehemann; prepare – vorbereiten; son – Sohn; tell a lie – lügen
READING & WRITING Talking about dates / Writing about the past
16 CHOICES
1/40
A Put the dialogue in the correct order. Then listen and check.
☐ A What day is it this year? ☐ B On November 17th. ☐ A How old are you, Michael? ☐ B It's a Saturday, I think. ☐ A Saturday. That's a great day for ☐ B I know, but I don't really like parties. a party. ☐ B I'm thirteen. ☐ A And when's your birthday?
B Complete the dialogue with your own ideas.
Interviewer ¹................................................................................................................................ Alan I'm 14. Interviewer ²................................................................................................................................ Alan March 22nd. Interviewer ³................................................................................................................................ Alan This year? It's on a Monday, I think.
Pages 107-108
17 Read the story. How many of the tasks below can you do?
Mario's birthday
(In Tom and Janet's house.) Janet Today's April 15th. It's Mario's birthday. Let's give him a birthday cake and sing "Happy birthday". Tom You can sing, not me! Let me go and buy the birthday cake, and then you phone him. Tell him to come to our place. (In the cake shop.) Tom Have you got birthday cakes? Man Yes. Is this one OK? Tom Fine. How much is it? Man £13.50. Tom Here you are. (Back at Tom and Janet's house. They phone Mario.) Janet Mario, come over to our place! Mario I can't right now. I'm helping my dad with the car. Janet But we've got a problem. We need your help! Mario OK, give me 30 minutes.
(30 minutes later. Knock, knock. Tom opens the door.) Mario Where's Janet? Tom She's lighting* the candles. Mario Lighting the candles? Why? What's the problem? Tom Come with me! (They go into the living room.) Tom See? The candles are burning*! Happy birthday, Mario! (Janet sings.) Janet Happy birthday to you, happy birthday to you! Happy birthday, dear Mario, happy birthday to you! Mario Well, thanks you two. But ... Tom But what? Mario Today isn't my birthday. My birthday's next month – May 15th!
[Illustration showing three people around a birthday cake with candles]
VOCABULARY: *light – anzünden; burn – brennen; confused – verwirrt
1 Tom doesn't want to sing. T / F 2 Tom buys a birthday cake. T / F 3 The cake is £15.30. T / F
4 Who is Mario helping? ☐ his mum ☐ his dad ☐ a friend
5 How long does Mario need? ☐ 10 minutes ☐ 20 minutes ☐ 30 minutes
6 Where is Janet? ☐ in the bedroom ☐ in the kitchen ☐ in the living room
7 Who sings for Mario? ....................................................................................................................... 8 Why is Mario confused*? ................................................................................................................. 9 When is Mario's birthday? ...............................................................................................................
1/41
18 Listen and check your answers.
19 Complete the sentences so they are true for you.
1 This morning at 6 a.m., I ................................................................................................................... . 2 This morning at 8 a.m., I ................................................................................................................... . 3 Yesterday at 8 p.m., I ........................................................................................................................ . 4 Yesterday at 1 p.m., I ........................................................................................................................ . 5 Last Sunday at 5 p.m., I .................................................................................................................... . 6 Last Saturday at 10 a.m., I ................................................................................................................ .
Pages 108-109
WORD FILE
Months
[Images showing the twelve months with seasonal activities: JANUARY (snowman), FEBRUARY (skiing), MARCH (cycling in rain), APRIL (rain), MAY (flowers), JUNE (sunshine), JULY (beach), AUGUST (hiking), SEPTEMBER (fall leaves), OCTOBER (leaves falling), NOVEMBER (rain), DECEMBER (Christmas tree)]
Rooms in a house
[Floor plan illustration showing labeled rooms: bedroom, library, living room, dining room, bathroom, hall, kitchen, garden, garage]
Page 109
Ordinal numbers
1st first 11th eleventh 21st twenty-first 2nd second 12th twelfth 22nd twenty-second 3rd third 13th thirteenth 23rd twenty-third 4th fourth 14th fourteenth 24th twenty-fourth 5th fifth 15th fifteenth 29th twenty-ninth 6th sixth 16th sixteenth 30th thirtieth 7th seventh 17th seventeenth 31st thirty-first 8th eighth 18th eighteenth 9th ninth 19th nineteenth 10th tenth 20th twentieth
[Illustration of three people on podiums showing 1st, 2nd, and 3rd place]
MORE Words and Phrases
	English	Example	German
	birthday cake	Mike's mum is making a big birthday cake for his birthday.	Geburtstagskuchen/-torte
1	eater	She never eats much. She's not a big eater.	Esser/Esserin
	ill	He isn't at school today because he's ill.	krank
	messy	He's a messy eater.	unordentlich, schlampig
	piece	Have a piece of my birthday cake!	Stück
3	cinema	Let's go to the cinema on Friday.	Kino
	excellent	That's excellent work!	ausgezeichnet
	finally	Oh good! Finally we can leave!	endlich; schließlich
	match	There's a volleyball match on Saturday.	Match, Spiel
5	It's my birthday.		Ich habe Geburtstag.
6	date	Today's date is Monday, July 7th.	Datum
	month	February is the second month of the year.	Monat
9	How old are you?		Wie alt bist du?
10	candle	The cake has twelve candles on it.	Kerze
	delicious	The chocolate cake looks delicious.	köstlich
	last	There was a robbery last night.	letzter/letzte/letztes
	robber	He wants to find the robber.	Räuber/Räuberin
	robbery	There was a robbery at the big house.	Raubüberfall
	yesterday	Where were you yesterday at 9 p.m.?	gestern
11	alarm clock	The alarm clock wakes me up every morning.	Wecker
13	probably	Last night at 9 p.m. I was probably in the garden.	wahrscheinlich
16	Good for you!		Schön für dich!
20	inspector	The inspector asks the questions.	Inspektor/Inspektorin
S6	How dare you!		Wie kannst du es wagen!
	That was close.		Das war knapp.
	You're welcome.		Nichts zu danken., Keine Ursache., Gern geschehen.

```

## Output contract

Write `content/corpus/units/g1-u12/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u12",
  "briefBank": "7926349cf887",
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
