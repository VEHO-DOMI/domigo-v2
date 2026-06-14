# Vocab generation brief — g1-u14 (MORE! 1, Unit 14)

<!-- domigo:gen vocab g1-u14 bank=001680d0f49a prompt=346902f9f0f1 -->

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
| g1u14.w.nature-programme | nature programme | Naturdokumentation | wordfile | — | — | — | nature programme |
| g1u14.w.fantasy-film | fantasy film | Fantasyfilm | wordfile | — | — | — | fantasy film |
| g1u14.w.reality-show | reality show | Reality-Show | wordfile | — | — | — | reality show |
| g1u14.w.fantasy-story | fantasy story | Fantasygeschichte | wordfile | — | — | — | fantasy story |
| g1u14.w.quiz-show | quiz show | Quizshow | wordfile | — | — | — | quiz show |
| g1u14.w.science-fiction-film | science fiction film | Science-Fiction-Film | wordfile | — | — | — | science fiction film |
| g1u14.w.the-news | the news | die Nachrichten | wordfile | — | — | — | the news |
| g1u14.w.detective-story | detective story | Kriminalgeschichte ; Krimi | wordfile | — | — | — | detective story |
| g1u14.w.romantic-film | romantic film | Liebesfilm | wordfile | — | — | — | romantic film |
| g1u14.w.sports-programme | sports programme | Sportsendung | wordfile | — | — | — | sports programme |
| g1u14.w.horror-story | horror story | Horrorgeschichte | wordfile | — | — | — | horror story |
| g1u14.w.drama-series | drama series | Dramaserie | wordfile | — | — | — | drama series |
| g1u14.w.adventure-story | adventure story | Abenteuergeschichte | wordfile | — | — | — | adventure story |
| g1u14.w.music-video | music video | Musikvideo | wordfile | — | — | — | music video |
| g1u14.w.romantic-story | romantic story | Liebesgeschichte | wordfile | — | — | — | romantic story |
| g1u14.w.cartoon | cartoon | Zeichentrick(-film/-serie) | phrase | — | Cartoons are my favourite programme. | — | cartoon |
| g1u14.w.screen-time | screen time | Zeit vor einem Bildschirm | phrase | — | Every day we have three hours of screen time. | — | screen time |
| g1u14.w.headline | headline | Schlagzeile | phrase | — | What's the news headline today? | — | headline |
| g1u14.w.latest | latest | neuester/neueste/neuestes | phrase | — | This is their latest song. | — | latest |
| g1u14.w.comedy | comedy | Komödie | phrase | — | We also watch comedy series. | — | comedy |
| g1u14.w.episode | episode | Episode ; Folge | phrase | — | I watch three episodes a day. | — | episode |
| g1u14.w.gamer | gamer | Spieler/Spielerin ; Zocker/Zockerin | phrase | — | I watch the gamers. | — | gamer |
| g1u14.w.kind-of | kind of | eine Art von | phrase | — | I usually watch some kind of series. | — | kind of |
| g1u14.w.quite | quite | ziemlich | phrase | — | I quite like detective films. | — | quite |
| g1u14.w.to-stream | to stream | streamen | phrase | — | We sometimes stream a film. | stream | to stream ; stream |
| g1u14.w.weekend | weekend | Wochenende | phrase | — | Saturday and Sunday are the weekend. | — | weekend |
| g1u14.w.to-freeze | to freeze (froze) | erstarren ; anhalten | phrase | — | The film stopped and the people in the picture froze. | freeze | to freeze ; freeze ; to freeze froze ; freeze froze |
| g1u14.w.huge | huge | riesig | phrase | — | An elephant is a huge animal. | — | huge |
| g1u14.w.inside | inside | in ; innerhalb | phrase | — | Inside the car, there were four people. | — | inside |
| g1u14.w.to-pay | to pay (paid) | (be-)zahlen | phrase | — | I paid three pounds for my hamburger. | pay | to pay ; pay ; to pay paid ; pay paid |
| g1u14.w.to-point-to | to point to | zeigen auf | phrase | — | She pointed to the clock inside the bank. | point to | to point to ; point to |
| g1u14.w.power | power | Kraft | phrase | — | It has special powers. | — | power |
| g1u14.w.remote-control | remote control | Fernbedienung | phrase | — | You use a remote control to change the programme. | — | remote control |
| g1u14.w.to-reply | to reply (replied) | antworten | phrase | — | I replied to your email this morning. | reply | to reply ; reply ; to reply replied ; reply replied |
| g1u14.w.to-sell | to sell (sold) | verkaufen | phrase | — | He wants to sell his old car. | sell | to sell ; sell ; to sell sold ; sell sold |
| g1u14.w.tiny | tiny | winzig | phrase | — | An ant is a tiny insect. | — | tiny |
| g1u14.w.voice | voice | Stimme | phrase | — | She's a great singer with a beautiful voice. | — | voice |
| g1u14.w.wide | wide | breit ; weit | phrase | — | There's a very wide road near our house. | — | wide |
| g1u14.w.to-fight | to fight (fought) | kämpfen (mit) | phrase | — | He fought his sister to get the control. | fight | to fight ; fight ; to fight fought ; fight fought |
| g1u14.w.shopkeeper | shopkeeper | Ladenbesitzer/Ladenbesitzerin | phrase | — | The shopkeeper wasn't there. | — | shopkeeper |
| g1u14.w.to-disappear | to disappear | verschwinden | phrase | — | He turned the ring and disappeared. | disappear | to disappear ; disappear |
| g1u14.w.to-hold | to hold (held) | halten | phrase | — | The robber held a gun in his hand. | hold | to hold ; hold ; to hold held ; hold held |
| g1u14.w.to-spend | to spend | verbringen (mit) | phrase | — | We spend a lot of time watching shows. | spend | to spend ; spend |
| g1u14.w.to-bend-down | to bend down (bent down) | (sich) hinunterbeugen | phrase | — | Bend down and hug me. | bend down | to bend down ; bend down ; to bend down bent down ; bend down bent down |
| g1u14.w.to-hug | to hug | umarmen | phrase | — | Can I hug you? | hug | to hug ; hug |
| g1u14.w.lake | lake | See | phrase | — | The giraffe went to the lake. | — | lake |
| g1u14.w.leaf | leaf (pl leaves) | Blatt (Blätter) | phrase | — | It only eats leaves. | — | leaf ; leaves |
| g1u14.w.to-lie | to lie | liegen | phrase | — | I want to lie in the sun. | lie | to lie ; lie |
| g1u14.w.skin | skin | Haut | phrase | — | The lion's skin is yellow. | — | skin |
| g1u14.w.spot | spot | Punkt | phrase | — | The giraffe has black spots. | — | spot |
| g1u14.w.weak | weak | schwach | phrase | — | I feel so weak today. | — | weak |
| g1u14.w.dead | dead | tot | phrase | — | Maybe I'm dead tomorrow. | — | dead |
| g1u14.w.once-upon-a-time | once upon a time | es war einmal | phrase | — | Once upon a time, there was a lion. | — | once upon a time |
| g1u14.w.one-day | one day | eines Tages | phrase | — | One day, the giraffe went to the lake. | — | one day |
| g1u14.w.adventure | adventure | Abenteuer | phrase | — | My favourite books are adventure stories. | — | adventure |
| g1u14.w.cover | cover | (Buch-)Umschlag | phrase | — | Look at the book covers. | — | cover |
| g1u14.w.friendship | friendship | Freundschaft | phrase | — | Is this a story about friendship? | — | friendship |
| g1u14.w.poem | poem | Gedicht | phrase | — | I read a poem every day. | — | poem |
| g1u14.w.neighbour | neighbour | Nachbar/Nachbarin | phrase | — | The neighbour's kid is nice. | — | neighbour |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Dad, Dan, Dana, Daniel, Darkman, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Doctor, Doctors, Don, Dragon, Ellie, Emergency, Emma, Encouraging, England, English, European, Every, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Hammond, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hunt, Imperatives, Interviewer, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Janet, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Kate, Ken, Kinds, Kitty, Leah, Leo, Lethabo, Leute, Lewis, Li, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Michael, Mike, Mill, Miriam, Miss, Mr, Mrs, Mum, New, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Past, Paula, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rose, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Sophie, Steve, Sue, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, True, Turan, Uhr, Um, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u14.w.nature-programme` ← v1 `nature programme`: d="a TV show about animals and nature" · s="We watched an interesting _____ with real footage of wild lions hunting in Africa." · a=[] · mc=["cooking show","game show","music programme"]
- `g1u14.w.fantasy-film` ← v1 `fantasy film`: d="a film with magic and unreal things" · s="The magical _____ had wizards casting spells, fire-breathing dragons, and a talking unicorn." · a=[] · mc=["war film","documentary","news programme"]
- `g1u14.w.reality-show` ← v1 `reality show`: d="a TV show with real people, not actors" · s="My sister loves watching that _____ with real people living together in a house every Friday." · a=[] · mc=["animated cartoon","news programme","nature documentary"]
- `g1u14.w.fantasy-story` ← v1 `fantasy story`: d="a story with magic and unreal things" · s="I am reading a _____ about a magic school for young wizards who ride broomsticks." · a=[] · mc=["history book","newspaper","recipe book"]
- `g1u14.w.quiz-show` ← v1 `quiz show`: d="a TV show where people answer questions" · s="He won 10,000 euros on the TV _____ by answering 20 general knowledge questions correctly." · a=[] · mc=["music concert","sports match","news bulletin"]
- `g1u14.w.science-fiction-film` ← v1 `science fiction film`: d="a film about the future or space" · s="The _____ was about a future year 3000 where robots took over Earth with laser guns." · a=[] · mc=["history film","cooking show","news programme"]
- `g1u14.w.the-news` ← v1 `the news`: d="a programme that tells you what happened today" · s="My dad always watches _____ on TV at eight o'clock to hear about politics and the world." · a=[] · mc=["cartoons","cooking","music"]
- `g1u14.w.detective-story` ← v1 `detective story`: d="a story about solving a crime" · s="In the _____, the clever police inspector found fingerprints and solved who robbed the bank." · a=[] · mc=["love story","bedtime story","cookbook"]
- `g1u14.w.romantic-film` ← v1 `romantic film`: d="a film about people falling in love" · s="My mum likes to watch a _____ with a girl meeting a boy and falling in love on Saturday evenings." · a=[] · mc=["horror film","war film","action film"]
- `g1u14.w.sports-programme` ← v1 `sports programme`: d="a TV show about sport" · s="We watched the live football World Cup game between Germany and Brazil on the _____." · a=[] · mc=["cooking show","cartoon","news programme"]
- `g1u14.w.horror-story` ← v1 `horror story`: d="a scary story" · s="The _____ with ghosts, vampires, and a haunted house was so scary that I could not sleep all night." · a=[] · mc=["romance","comedy","history book"]
- `g1u14.w.drama-series` ← v1 `drama series`: d="a serious TV show with many episodes" · s="The new _____ on TV with eight episodes about a family hospital is really exciting." · a=[] · mc=["cartoon","music video","news"]
- `g1u14.w.adventure-story` ← v1 `adventure story`: d="a story about exciting things happening" · s="The _____ was about a group of children searching for buried treasure on a tropical island." · a=[] · mc=["love story","cookbook","science textbook"]
- `g1u14.w.music-video` ← v1 `music video`: d="a short film made for a song" · s="Have you seen the new _____ with the singer dancing in a colourful background and her band?" · a=[] · mc=["silent film","textbook","painting"]
- `g1u14.w.romantic-story` ← v1 `romantic story`: d="a story about people falling in love" · s="She wrote a _____ about a handsome prince who fell in love with a beautiful princess." · a=[] · mc=["war story","crime story","ghost story"]
- `g1u14.w.cartoon` ← v1 `cartoon`: d="a film or show with drawn characters" · s="My little brother watches a colourful animated _____ with talking animals every morning on TV." · a=[] · mc=["documentary","news","quiz show"]
- `g1u14.w.screen-time` ← v1 `screen time`: d="time you spend looking at a screen" · s="My parents say I have too much _____ on my phone and tablet and should go outside more." · a=[] · mc=["study time","sleep time","meal time"]
- `g1u14.w.headline` ← v1 `headline`: d="the title of a news story" · s="The big bold _____ at the top of the newspaper front page said: BIG STORM HITS CITY." · a=[] · mc=["footnote","signature","page number"]
- `g1u14.w.latest` ← v1 `latest`: d="the most new, the most recent" · s="Have you heard their _____ song that came out yesterday? It is their newest hit." · a=[] · mc=["first ever","oldest","original"]
- `g1u14.w.comedy` ← v1 `comedy`: d="a funny film or show that makes you laugh" · s="We watched a funny _____ and laughed out loud the whole time until our stomachs hurt." · a=[] · mc=["tragedy","horror","documentary"]
- `g1u14.w.episode` ← v1 `episode`: d="one part of a TV series" · s="I watched the first _____ of the new show and now I want to see all the other 9 episodes." · a=[] · mc=["page","chapter","paragraph"]
- `g1u14.w.gamer` ← v1 `gamer`: d="a person who plays video games a lot" · s="My older brother is a passionate _____ and plays video games for hours every day after school." · a=[] · mc=["reader","writer","cook"]
- `g1u14.w.kind-of` ← v1 `kind of`: d="a type of, a sort of" · s="What _____ of music do you like — pop, rock, jazz, or classical?" · a=[] · mc=["number of","size of","weight of"]
- `g1u14.w.quite` ← v1 `quite`: d="a little, more than a bit" · s="The maths test was _____ easy — a bit tricky but not very hard. I got most right." · a=[] · mc=["extremely","super","totally"]
- `g1u14.w.to-stream` ← v1 `to stream`: d="to watch a film or show on the internet" · s="We can _____ the new film tonight on our tablet on Netflix without downloading it." · a=[] · mc=["to print","to record on DVD","to buy in a shop"]
- `g1u14.w.weekend` ← v1 `weekend`: d="Saturday and Sunday" · s="What are you doing at the _____ on Saturday and Sunday when there is no school?" · a=[] · mc=["weekday","school day","working day"]
- `g1u14.w.to-freeze` ← v1 `to freeze`: d="to stop moving, to become very still" · s="When the music suddenly stopped in the game, everybody had to _____ and not move a single muscle." · a=[] · mc=["to dance","to run","to jump"]
- `g1u14.w.huge` ← v1 `huge`: d="very, very big" · s="We saw a _____ blue whale — the biggest animal in the world, 30 metres long — in the deep ocean." · a=[] · mc=["tiny","microscopic","miniature"]
- `g1u14.w.inside` ← v1 `inside`: d="in something, not outside" · s="It was pouring with rain outside, so we stayed and played board games _____ the warm house." · a=[] · mc=["outside","above","behind"]
- `g1u14.w.to-pay` ← v1 `to pay`: d="to give money for something" · s="How much money did you _____ for that book at the shop? It looks expensive." · a=[] · mc=["to read","to draw","to hide"]
- `g1u14.w.to-point-to` ← v1 `to point to`: d="to show where something is with your finger" · s="She raised her hand and used her finger to _____ the country Spain on the big wall map." · a=[] · mc=["to hide","to close eyes at","to ignore"]
- `g1u14.w.power` ← v1 `power`: d="a strong force or special ability" · s="The superhero had the magical _____ to become invisible and walk through solid walls." · a=[] · mc=["weakness","problem","fear"]
- `g1u14.w.remote-control` ← v1 `remote control`: d="a small thing you use to control your TV" · s="I can not find the _____ for the TV. I want to change the channel to the news." · a=[] · mc=["keyboard","pen","phone"]
- `g1u14.w.to-reply` ← v1 `to reply`: d="to answer someone" · s="I sent her a text message this morning but she did not _____ all day. Maybe her phone is off." · a=[] · mc=["to send","to forget","to write"]
- `g1u14.w.to-sell` ← v1 `to sell`: d="to give something for money" · s="They want to _____ their old car for 2000 euros and then buy a new one with the money." · a=[] · mc=["to buy","to keep","to hide"]
- `g1u14.w.tiny` ← v1 `tiny`: d="very, very small" · s="The baby bird was so _____ — only 2 centimetres long — that it fit in the palm of my hand." · a=[] · mc=["huge","massive","giant"]
- `g1u14.w.voice` ← v1 `voice`: d="the sound you make when you talk or sing" · s="The female singer had a beautiful high _____ and everyone in the audience loved her." · a=[] · mc=["face","hair","dress"]
- `g1u14.w.wide` ← v1 `wide`: d="big from one side to the other" · s="The big brown river was very _____ — about 100 metres — and we could not swim across to the other side." · a=[] · mc=["narrow","thin","short"]
- `g1u14.w.to-fight` ← v1 `to fight`: d="to try hard against someone or something" · s="The two angry boys started to _____ with their fists over the last chocolate cookie on the plate." · a=[] · mc=["to hug","to kiss","to sing to"]
- `g1u14.w.shopkeeper` ← v1 `shopkeeper`: d="a person who has a shop" · s="The friendly _____ behind the counter helped me find the right book in her small bookshop." · a=[] · mc=["customer","teacher","doctor"]
- `g1u14.w.to-disappear` ← v1 `to disappear`: d="to go away so nobody can see you" · s="The magician said 'abracadabra' and made the white rabbit _____ from the top hat into thin air." · a=[] · mc=["to grow bigger","to stay","to appear"]
- `g1u14.w.to-hold` ← v1 `to hold`: d="to have something in your hand" · s="Can you _____ my heavy shopping bag in your hands for a moment, please? I need to tie my shoelace." · a=[] · mc=["to drop","to throw","to kick"]
- `g1u14.w.to-spend` ← v1 `to spend`: d="to use time doing something" · s="We _____ every Saturday afternoon at our grandma's cosy house drinking tea and eating cake." · a=[] · mc=["to avoid","to skip","to miss"]
- `g1u14.w.to-bend-down` ← v1 `to bend down`: d="to move the top of your body down" · s="She had to _____ from standing up to pick up the shiny gold coin from the floor." · a=[] · mc=["to stand up","to sit down","to lie down"]
- `g1u14.w.to-hug` ← v1 `to hug`: d="to put your arms around someone" · s="I always _____ my mum and wrap my arms around her when I get home from school." · a=[] · mc=["to push away","to ignore","to run from"]
- `g1u14.w.lake` ← v1 `lake`: d="a big area of water with land around it" · s="We went swimming in the large clear _____ of still water surrounded by mountains on a hot summer day." · a=[] · mc=["bathtub","puddle","swimming pool"]
- `g1u14.w.leaf` ← v1 `leaf`: d="a flat green thing that grows on a tree" · s="In autumn, every single green _____ on the maple tree turns yellow, orange, and red before falling off." · a=[] · mc=["flower","fruit","root"]
- `g1u14.w.to-lie` ← v1 `to lie`: d="to be flat, for example on a bed" · s="I like to _____ flat on the soft sofa and read a good book in the afternoon." · a=[] · mc=["to stand","to jump","to run"]
- `g1u14.w.skin` ← v1 `skin`: d="the outside part of your body" · s="The sun was very hot and my _____ on my arms and face turned red and sore." · a=[] · mc=["hair","teeth","nails"]
- `g1u14.w.spot` ← v1 `spot`: d="a small round mark on something" · s="The ladybird has shiny red wings with small round black _____ — 7 dots on each side." · a=[] · mc=["stripe","line","square"]
- `g1u14.w.weak` ← v1 `weak`: d="not strong" · s="After being sick in bed with a fever for a whole week, I felt very tired and _____." · a=[] · mc=["strong","powerful","healthy"]
- `g1u14.w.dead` ← v1 `dead`: d="not alive any more" · s="We found a _____ bird in the garden. It was not moving and its body was cold." · a=[] · mc=["alive","healthy","flying"]
- `g1u14.w.once-upon-a-time` ← v1 `once upon a time`: d="how many fairy tales begin" · s="_____, in a land far away, there lived a beautiful princess in a big tall castle with a tower." · a=[] · mc=["Last Monday","Yesterday","In 2025"]
- `g1u14.w.one-day` ← v1 `one day`: d="at some time in the past or future" · s="_____, a very strange mysterious letter arrived at our front door in a black envelope." · a=[] · mc=["Every day","Never","Twice a week"]
- `g1u14.w.cover` ← v1 `cover`: d="the outside part of a book" · s="The front _____ of this new fantasy book has a big colourful picture of a dragon breathing fire." · a=[] · mc=["page 50","index","table of contents"]
- `g1u14.w.friendship` ← v1 `friendship`: d="when two people are friends" · s="Their long _____ started on the very first day of school in Year 1 and they are still friends today." · a=[] · mc=["fight","argument","race"]
- `g1u14.w.neighbour` ← v1 `neighbour`: d="a person who lives next to you" · s="Our _____ who lives right next door to us has a big brown dog that barks a lot at night." · a=[] · mc=["teacher","cousin","pen pal"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 14 It's my favourite.txt -----
UNIT 14 It's my favourite
Page 110 • UNIT 14
At the end of unit 14 ...
you know ☐ 12 words for TV programmes ☐ 8 words for kinds of books and stories ☐ how to use the past simple (negative) ☐ some irregular past forms
you can ☐ talk about your screen time ☐ understand a story in the past ☐ talk about books and reading ☐ tell a story ☐ write a picture story
VOCABULARY Screen time
4/23 🔊 1 Look at the pictures and number the words below. Then listen and check.
[Images of 12 different TV screens showing: 1-cartoon (Totoro), 2-nature programme (toucan), 3-reality show (people kayaking), 4-science fiction film (UFO/spaceship), 5-fantasy film (dragons), 6-romantic film (silhouette of couple), 7-music show (concert), 8-detective film (man in office), 9-sports programme (racing car), 10-the news (news anchor), 11-game show (game show set with $10,000), 12-quiz show (people at podiums)]
[1] cartoon ☐ game show ☐ reality show ☐ nature programme ☐ the news ☐ science fiction film ☐ quiz show ☐ romantic film ☐ fantasy film ☐ music show ☐ detective film ☐ sports programme
4/24 🔊 2 What are they watching? Listen and write the numbers.
1 David TV1 5 George and Freda ......... 9 Jack ......... 2 Andrew ......... 6 Jane ......... 10 Emily and Holly ......... 3 Joanna ......... 7 Veronica ......... 11 Alexandra ......... 4 Linda and Stephen ......... 8 Paul ......... 12 James and Charles .........
3 Check with a partner.
David's watching a cartoon on TV1. That's right. / I think he's watching a ...
Page 111 • UNIT 14
LISTENING & SPEAKING Talking about screen time
4/25 🔊 4 Listen to Paula and Michael talk about what they watch. Tick True or False.
[Photo of Paula - young woman with glasses and red hair] Paula
1 She spends two hours a day looking at screens. True ☐ False ☐ 2 She always watches TV in the morning and at the weekend. True ☐ False ☐ 3 She likes cartoons, nature programmes and reality shows. True ☐ False ☐ 4 Her favourite cartoons are Henry Danger, Teen Titans Go! and Spongebob. True ☐ False ☐ 5 The family often watches the news together. True ☐ False ☐ 6 Her dad loves cartoons. True ☐ False ☐
[Photo of Michael - young boy with dark hair] Michael
1 He watches TV for about two hours every day. True ☐ False ☐ 2 He never watches it in the evening before he goes to bed. True ☐ False ☐ 3 He streams five detective films every week. True ☐ False ☐ 4 Every day he watches two or three episodes of Angelo Rules on his computer. True ☐ False ☐ 5 He watches gamers on his mobile phone. True ☐ False ☐
💬 5 In groups, talk about your screen time. Use the sentences to help you.
I | watch films or series for about | one two three | hour(s) a day.
I | always usually sometimes never | watch my favourite programmes | in the morning. in the afternoon. in the evening. at the weekends.
I | usually | stream films watch YouTube channels watch programmes | on my laptop. with my family. on TV.
I really like (love) I don't like (hate) | cartoons. nature programmes. detective films. sports programmes. the news. ...
My favourite programmes are ... .
My | mum's dad's brother's sister's | favourite programme is ... .
[Image of young woman sitting on couch with laptop]
Page 112 • UNIT 14
READING
📄 6 Read the story.
The remote control*
[Image of old woman and girl with remote control]
The shop in Mill Street sold lots of things. In the window I saw a TV remote control. I went into the shop because I needed a new one. There was an old woman behind the desk. I picked up the remote control and she looked up at me.
"Be careful," said the old woman. "This is not a normal TV remote control because it has special powers."
"Special powers?" I laughed.
"Yes," she replied. "Use it carefully and never ever press this button here." She pointed to a small button with a star on it.
"OK," I said. I paid and walked home.
"What a strange lady," I thought.
My brother Tom was in the living room. The TV was on. It was a film about dinosaurs, but I wanted to watch a cartoon.
"Can we watch a cartoon?" I asked.
"No," he replied.
I took out the remote control and pointed it at the TV. I pressed a button, but nothing happened. I did it again. Still nothing.
"What's that?" Tom asked.
"A new TV remote control," I replied.
"It doesn't work," he laughed.
[Image of children watching TV together]
[Text box on right side:] I pointed the remote control at him and pressed a button. Tom froze*. What! I looked at the button. It was the pause button. I pressed it again. He was normal again. I pressed the rewind button*.
My brother started talking backwards.
I pressed the fast forward button*. He started moving really fast.
The TV remote control controlled my brother. This was fantastic, but then I remembered the old lady and her words: "Use it carefully." So I stopped.
"Let me look at the remote control," Tom asked.
"No," I replied.
He jumped up and tried to take the remote control from me. My finger pressed a button. I looked at the remote control. My finger was on the star button. Where was Tom?
And then I heard a noise. It was Tom's voice, but it was tiny.
"Help me! Help!"
I looked at the TV.
"Help me, Annie! Please, help me!"
There was Tom. He was inside the TV screen. And behind him was a huge T-Rex with its mouth wide open.
[Image of girl looking worried at TV screen with "Help me, Annie! Please, help me!" text]
VOCABULARY *remote control – Fernbedienung; freeze/froze – erstarren/erstarrte; rewind button – Rückspultaste; fast forward button – Vorspultaste
Page 113 • UNIT 14
7 How many of these tasks can you do?
1 The girl saw a ............................................. in the shop window. 2 The shopkeeper was an old ............................................. . 3 At home there was a film about ............................................. on TV. 4 The shop in Mill Street was a TV shop. T / F 5 The girl wanted to watch a cartoon. T / F 6 Tom fought his sister to get the control. T / F 7 Why is the remote control different? ........................................................................... 8 What button does the woman say never to press? ........................................................................... 9 What happens when you press that button? ...........................................................................
4/26+27 🔊 8 Check your answers with a partner. Then listen to the story.
9 Look at the story again. Write the past forms of the verbs.
do ........................... pay ........................... take ........................... think ........................... hear ........................... say ........................... sell ........................... freeze ........................... go ........................... is ........................... see ...........................
10 Complete the texts with the verbs from the box.
held put ran caught left didn't see
1 The robber ........................... into the bank. He ........................... a gun in his hand. He ........................... a lot of money into his bag. He ........................... the police car outside the bank. He ........................... the bank and the police ........................... him.
[Image of robber running from bank with money bag]
gave told said didn't think found sat
2 Jill ........................... on a park bench. There, she ........................... a ring. She ........................... it to her friend Andrew. Jill ........................... to him it was a magic ring. Andrew ........................... it was a magic ring. Jill ........................... him to turn it three times. Andrew did that – and disappeared*.
[Image of two children on park bench with dandelion]
VOCABULARY: *disappear – verschwinden
4/28 🔊 11 Listen to the poem. Then read it.
[Image of family watching TV together]
Watching TV
Mum and Dad and me, we often watch TV. We spend a lot of time on quiz shows, news and crime. We often have our tea in front of the TV. But sometimes I say no and leave them and I go into my room. I need a thrilling* book to read.
*VOCABULARY: thrilling – aufregend, spannend
Say what you think: How much screen time is too much for a boy/girl your age?
Page 114 • UNIT 14
VOCABULARY
4/29 🔊 12 Listen and look at the pictures. Then number the words.
[Images showing: 1-person reading, 2-animal spots pattern, 3-person with skateboard, 4-person painting, 5-campfire, 6-person lying under tree, 7-lake with trees, 8-tiger/cat, 9-elephant and hunter]
☐ weak ☐ spots ☐ skin ☐ hug ☐ lying under ☐ leaves a tree ☐ bend down ☐ lake ☐ hunt
LISTENING
4/30 🔊 13 Listen to the story. Then put the pictures in the correct order.
The leopard and the giraffe
[9 images showing sequence of story with leopard and giraffe]
☐ The giraffe was too fast. ☐ The leopard wanted an animal to come near him so that he could eat it. ☐ One day a giraffe came to the lake.
☐ The weak leopard asked the giraffe to hug him. ☐ The giraffe got the leopard some magic leaves. ☐ The leopard said, "The skin and the spots show that we are family."
☐ The leopard said, "Aren't you the daughter of my old friend?" ☐ The leopard became strong again. ☐ The strong leopard tried to catch the giraffe.
Page 115 • UNIT 14
VOCABULARY Kinds of books and stories
14 Match the book covers with the kinds of stories.
☐ animal story ☐ adventure story ☐ fantasy story ☐ detective story ☐ horror story ☐ story about friendship ☐ comic book ☐ poems
[Images of 8 book covers: 1-Horrorland, 2-Gangsta Granny, 3-Harry Potter, 4-The Tale of Despereaux, 5-Pirates!, 6-Eleanor & Park, 7-A Poem For Every Day Of The Year, 8-Action Comics]
LISTENING & SPEAKING Talking about books and reading
4/31 🔊 15 Listen to the interview. Circle T (True) or F (False).
1 Mike reads a lot. T / F 2 He doesn't read fantasy stories. T / F 3 When he was six, his favourite book was The Tale of Despereaux. T / F 4 When he was a child, his grandpa read to him. T / F 5 Alison reads a lot. T / F 6 Alison likes stories about friendship and family. T / F 7 Alison hasn't got a favourite book. T / F 8 When she was six, her favourite book was The Gruffalo. T / F
💬 16 Study the language. Then complete the sentences so they are true for you.
[Photos of two young people]
I read a lot. I read a lot of ... stories. My favourite book is ... . When I was six, my favourite book was ... . My ... read stories to me.
I don't read a lot. I like ... stories, but I don't like ... stories. My favourite book is ... . When I was six, my favourite book was ... . My ... didn't read stories to me.
Page 116 • UNIT 14
SPEAKING Telling a story
17 Look at the pictures. Say what happened. Use the verbs from the box in the past simple.
put saw ran ate ate put died were
[8 numbered images showing sequence of chicken and snake story]
There 1........................ four eggs in the chicken's nest. The chicken 2........................ the snake.
It was scared. The chicken 3........................ away. The snake 4........................ three eggs and
went away. The chicken went back and 5........................ the last egg under leaves. The chicken
6........................ a white stone in the nest. The snake came back and 7........................ the stone.
The snake 8........................ .
WRITING
18 CHOICES
A Look at 17 again. Write the story.
There were four eggs in the chicken's nest. The chicken saw the snake. It was ...
B Look at the pictures below. Write the story.
A fox looked ...
[6 numbered images showing sequence of fox and chicken story]
Page 117 • UNIT 14
SOUNDS RIGHT Stress time
4/32 🔊 19 Listen and repeat.
A I didn't do it. B Who did? B You didn't? You didn't? A The neighbour's bad kid. A I didn't.
[Image showing children and adult in conflict situation]
GRAMMAR
▶️ Past simple (3) Verneinung mit didn't
Die Verneinung im Past simple ist für alle Personen gleich. So bildest du die Verneinung:
Person + didn't (did not) + Infinitiv (Nennform des Verbs)
I didn't read the book. She didn't read the Sherlock Holmes stories. We didn't like the film. You didn't tell me. It didn't catch the giraffe. You didn't listen to Mum. He didn't catch the snake. They didn't run away.
Past simple (4) irregular verbs
have – had I had milk and bread for breakfast. sell – sold The shop sold lots of things. go – went I went into the shop. say – said "Be careful," said the old woman.
pay – paid I paid and walked home. take – took I took out the control and pointed it at the TV.
do – did I did it again. freeze – froze Tom froze. hear – heard Then I heard a noise. hold – held The robber held a gun in his hand.
meet – met Yesterday I met Carol's sister.
[Image of alien saying "They held hands because they were scared."]
read – read When he was a child, his grandpa read to him. run – ran They ran out of the classroom. put – put I put on my blue cap. think – thought "What a lovely cat," she thought. see – saw She saw a remote control in the window.
Past simple (5) more irregular verbs
eat – ate become – became bend (down) – bent (down) come – came catch – caught die – died find – found fight – fought sit – sat give – gave tell – told get – got leave – left
⏪ Now go back to page 110. Check ☑️ with a partner what you know / can do.


----- WB: WB Unit 14 It_s my favourite.txt -----
Unit 14 It's my favourite
Pages 119-120
UNDERSTANDING VOCABULARY TV programmes / Books and stories
1 Write the names of the TV programmes under the pictures.
fantasy film cartoon quiz show reality show sports programme detective film game show science fiction film music show romantic film the news nature programme
[12 TV screen images showing different types of programs:
Music show with singer
Game show with contestant
Reality show with people celebrating
Fantasy film with dragon
Cartoon with rabbit character
Detective film with investigators
Romantic film with couple
Quiz show with contestant
Nature programme with tropical scene
Nature programme with insect
News broadcast
Science fiction film with spaceship]
1 ..................................................... 2 ..................................................... 3 ..................................................... 4 ..................................................... 5 ..................................................... 6 ..................................................... 7 ..................................................... 8 ..................................................... 9 ..................................................... 10 ..................................................... 11 ..................................................... 12 .....................................................
Pages 120-121
2 Write the words from the box under the book covers.
animal story fantasy story detective story story about friendship poems adventure story comic book horror story
[Image showing a bookshelf with 8 books displayed:
"BEST SELLERS" banner
"INSPECTOR CLUE: CALL IT MURDER"
"THE SUPERHERO'S WEEK"
"TERROR PLANET 10"
"THE RACE AROUND THE WORLD"
"THE LION AND THE MOUSE"
"BEST FRIENDS 4ever"
"A POEM A DAY"
"DRAGON SLAYER"]
1 ......................................... 2 ......................................... 3 ......................................... 4 ......................................... 5 ......................................... 6 ......................................... 7 ......................................... 8 .........................................
USING VOCABULARY TV programmes / Books and stories
3 Look at 1 again. Read the speech bubbles and match them to the types of programmes.
☐ reality show ☐ music show ☐ romantic film ☐ quiz show ☐ the news ☐ detective film ☐ sports programme ☐ science-fiction film ☐ nature programme
*VOCABULARY: goal – Tor
1 Welcome to Animals in Australia. Today we are looking at kangaroos.
2 Ten people left on an island for 20 days with only bread and water.
3 The President of the USA arrived in London early this morning ...
4 OK, now. Next question. Who was the first American president?
5 Oh, Rebecca, I love you so much.
6 It's the police. Let's run.
7 Captain Turan, Captain Turan, a strange spaceship is arriving!
8 And now it's Ed Sheeran with his new song ...
9 It's a goal*! With ten seconds to go. And what a goal!
Pages 121-122
4 Read the short texts about books. Look at 2 again and write what type of book each one is.
[6 book descriptions with covers:]
Colin Coldeye is a police officer* with Scotland Yard. He loves football and his favourite team is Manchester City. One day, he watches a match on TV and sees a famous robber in the stadium. Colin Coldeye starts his hunt for the famous robber – and becomes very famous.
Andrew and William go to the same class, but they hate each other and they don't talk to each other. One day, William gets into trouble. Andrew helps him out of the situation. William and Andrew become best friends.
There's a castle in a dark, dark wood. Every night at midnight spooky* things happen. Adriana, a 12-year-old girl from the village*, wants to find out about the castle, and she sees terrible things.
Simon is 13 years old. One day, he finds an old book in a box behind his house. In the box there is also an old map*. Simon hopes to find a big bag of gold. He gets into lots of difficult situations, but at last he finds the gold.
Kate and her horse Diamond are best friends. One day, Kate rides into the woods, but she has an accident. She falls off the horse and breaks her leg. Diamond runs back to the village and gets help.
Five children want to find the world of the Magic Rose, but a bad magician* wants to stop them. The children are very clever, and with the help of the president of the garden gnomes they find their way to the Magic Rose world.
*VOCABULARY: police officer – Polizist/Polizistin; spooky – gespenstisch; village – Dorf; map – (Land-)Karte; magician – Zauberer/Zauberin
5 Think of an interesting title for each of the books in 4.
1 ............................................................................................................................................................... 2 ............................................................................................................................................................... 3 ............................................................................................................................................................... 4 ............................................................................................................................................................... 5 ............................................................................................................................................................... 6 ...............................................................................................................................................................
Pages 122-123
UNDERSTANDING GRAMMAR Past simple (3) Verneinung mit didn't
6 Read the sentences and look at the pictures. Then number the pictures.
1 Paul didn't like his presents. 2 Paul liked his presents. 3 Mary didn't go to school. 4 Mary went to school. 5 Liam didn't do his homework. 6 Liam did his homework.
[6 images showing different scenarios of Paul, Mary, and Liam in various situations]
UNDERSTANDING GRAMMAR Past simple (4) irregular verbs
7 Put the forms of the verbs in the correct box.
send do thought Present tense Past tense did was say heard held had ..send........................... ..did............................... went met took ............................................. ............................................. sat think tell ............................................. ............................................. found said told ............................................. ............................................. hear leave sit ............................................. ............................................. hold run is ............................................. ............................................. go meet ran ............................................. ............................................. have take get ............................................. .............................................
8 Find and circle ten verbs in the past form in the wordsearch (↓→).
N T O L D G K R R P F T A N V P A T U A S A I D F N O T L X N J C R M O Y W K X J M E T K B E L Z W P A I G Z N H Q H E L D N J T A K R A E G K I E D Y P S A W M
............................................................ ............................................................ ............................................................ ............................................................ ............................................................ ............................................................ ............................................................ ............................................................ ............................................................ ............................................................
Pages 123-124
USING GRAMMAR Past simple (3) Verneinung mit didn't
9 Write Present or Past.
1 She doesn't like milk. .......Present....... 6 Debbie didn't help me. ............................. 2 I don't understand you. ............................. 7 We don't want that. ............................. 3 You don't know her. ............................. 8 They didn't answer 4 She didn't call me. ............................. my email. ............................. 5 Tom doesn't play tennis. .............................
10 Complete with the past simple negative of the verbs in brackets.
My friends ¹.... didn't come .... (come) to my birthday party. They ²......................................... (phone) me. They ³......................................... (give) me presents. They ⁴......................................... (send) me birthday cards. They ⁵......................................... (write) me emails. They ⁶......................................... (bring) a cake and they ⁷......................................... (sing) a song for me. What a terrible dream!
11 Complete with the past simple form of the verbs in brackets.
1 I ....... didn't write ............. you an email 4 My old camera ........................................ so because my computer ................................ . I ........................................ a new one. (not write / not work) (not work / want)
2 I ........................................ at six because 5 Sandra ........................................ a cold*, so Dad ........................................ me she ........................................ to the party. ........................................ . (not get up / (have / not go) not wake ... up) 6 I ........................................ a lot of 3 She ........................................ to James money, so I ........................................ the because she ........................................ him. headphones. (not have / not buy) (not talk / not see) *VOCABULARY: cold – hier: Erkältung
USING GRAMMAR Past simple (4) irregular verbs
12 Complete the table with the missing forms.
Present tense Past tense Present tense Past tense
¹............................. held see ⁹............................... ²............................. sat ¹⁰............................. sold tell ³............................. ¹¹............................. sent ⁴............................. left take ¹²............................... go ⁵............................. put ¹³............................... say ⁶............................. ¹⁴............................. read ⁷............................. gave run ¹⁵............................... hear ⁸............................. meet ¹⁶...............................
Pages 124-125
13 Complete the text with the past forms of the verbs in brackets.
Andy and Miriam ¹......................................... (want) to go to the cinema, but it was too hot. So they ²......................................... (go) to the park. They ³......................................... (sit) down under a tree and Miriam ⁴......................................... (read) Andy a story about penguins in the Antarctic. Then she ⁵......................................... (say), "Let's go and get an ice cream."
[Image of two people sitting under a tree reading]
"Oh, no," Andy ⁶......................................... (answer), "after that story I'm much too cold for an ice cream." So Miriam ⁷......................................... (give) him a very big piece of chocolate. He ⁸......................................... (take) it and ⁹......................................... (put) it into his mouth. "Thanks," he ¹⁰......................................... (say), "now I'm OK again."
14 Complete with the past form of the verbs in the box.
sit take give meet go read run put
[Three sequential images showing a boy entering house, getting football, and running to park]
The boy ¹................................. into the house and ²................................. his football. He ³................................ it in his bag and then he ⁴................................ to the park.
[Three more sequential images showing boy meeting friends and reading]
They ⁵................................ in the park. He ⁶................................ her a kiss and they ⁷................................ on the grass and ⁸................................ Harry Potter and the Half-Blood Prince.
Pages 125-126
READING & WRITING Understanding/Writing a story in the past
15 Read the story. How many of the tasks below can you do?
The little fox and the lion
Once upon a time, there was a big lion. He was very dangerous and he ate three animals every day. All the animals of the wood were very scared, and so they had a meeting under a big tree.
"We must do something," said the giraffe. "The lion is eating three animals a day!"
"You're right," said the owl, "but we're not strong." The animals didn't know what to do.
"I've got an idea. Let's kill the lion!" said the little fox.
"Kill the lion? Ha ha ha ha!" the other animals laughed. "How can we kill the lion? He's so strong!"
The fox didn't say a word and went to the place where the lion lived. When the fox was near the lion's place, he started to shout for help.
"Be quiet!" the lion said. "I'm coming to eat you now!" "Help! Help!" shouted the fox again. "Quiet!" the lion shouted back. "I'm so scared!" answered the fox. "Of course you're scared of me! I'm coming to eat you!" said the lion.
"Scared of you? I'm not scared of you," said the little fox. "I'm scared of the big, strong lion!"
"The big, strong lion?" asked the lion.
"Yes, there's a big, strong lion on the other side of the village. He eats ten animals a day. I'm so scared!" When the lion heard this, he became very angry.
"Show me that lion!" he said. "I want to kill him!" "Alright. Come with me," said the little fox.
The little fox started to walk and the lion followed him. They walked around the village, and then they came to the deep lake on the other side of the village.
"Shh!" said the little fox. "There's the other lion. And he is very big and very strong!"
"I'm not scared!" the lion shouted. When he looked down, he saw the face of a very strong and very big lion! "I'm coming to kill you!" he shouted.
[Image showing lion looking at reflection in water]
Then he jumped into the water and died. When the other animals saw this, they were very happy. "The little fox tricked* the lion!" they all shouted.
VOCABULARY: *trick – austricksen; himself – sich selbst
1 The lion ate ten animals a day. T / F 2 The animals had a meeting because they wanted to kill the lion. T / F 3 The other animals thought the fox's plan was good. T / F
4 Who went to the lion's place? ..........................................................................................................
5 What happened when he arrived at the lion's place? ...............................................................................................................................................................
6 How many animals did the big, strong lion on the other side of the village eat every day? ...............................................................................................................................................................
7 When he heard about the big, strong lion, the lion ☐ was angry with the fox. ☐ was scared. ☐ wanted to see him.
8 In the water, the lion saw ☐ another lion. ☐ himself*. ☐ the fox.
9 The lion jumped into the water because ☐ he was hot. ☐ he wanted to drink the water. ☐ he wanted to kill the other lion.
1/45
16 Listen and check your answers.
Pages 126-127
17 Match the questions and answers.
1 How many hours do you watch TV a day? ☐ They love nature films. 2 When do you watch TV? ☐ I don't like the news and romantic films. 3 What kind of programmes do you like? ☐ It's The Simpsons. 4 What kind of programmes do you not like? ☐ I usually watch TV in the evening. 5 What's your favourite programme? ☐ I watch TV for about two hours a day. 6 What's your mum and dad's favourite ☐ Cartoons and fantasy films. programme?
18 Remember the story The remote control on page 112 in the Student's Book. What happened to Tom in the TV? Write a short text (120 words) in your exercise book. Use some of the verbs in the box.
go meet run see read do hold take freeze hear say know sit
19 CHOICES
A Read the story The remote control on page 112 in the Student's Book again and put the sentences in the correct order.
☐ Annie pointed the remote control at Tom and ☐ Annie saw a TV remote pressed the pause button. control in a shop window.
☐ The woman said, "This is a special remote control!" ☐ Later, Tom tried to get the remote control from Annie. ☐ But not Tom. He wanted to watch the dinosaur film. ☐ Tom froze. ☐ Annie wanted to watch a cartoon. ☐ Annie pressed the star ☐ At home, Tom was on the sofa in front of the TV. button.
☐ Tom was inside the TV.
B Look at the pictures and write the story. Use past tense forms.
[9 sequential images showing a story about a person watching TV, encountering police, and reading a book]
Pages 127-128
LISTENING & DIALOGUE WORK Talking about screen time
1/46
20 Listen and write which programmes Karen and Simon like / don't like.
1 Karen likes the news, and on her computer she often watches ..................................................... ...............................................................................................................................................................
2 She doesn't like ................................................................................................................................. and ..................................................................................................................................................... .
3 Simon likes Sherlock Holmes and ................................................................................................. .
4 He never watches ............................................................................................................................. .............................................................................................................................................................. .
1/47
21 Complete the interview. Then listen and check.
Interviewer ¹............................... many hours do Interviewer ⁸............................... kind of you ²............................... TV a day? ⁹............................... do you Ranjit About three. not ¹⁰............................... ? Interviewer ³............................... do you watch TV? Ranjit Romantic films, the news Ranjit I usually watch it ⁴............................... and quiz shows. the afternoon and sometimes I watch Interviewer ¹¹................................'s it ⁵............................... the morning. your ¹².............................. Interviewer ⁶............................... kind of programme? ⁷.......................................... do you like? Ranjit Match of the Day. Ranjit Cartoons, sports programmes and nature programmes.
WORD FILE
On TV Kinds of stories
[TV screen showing different programme types:] [Book covers showing:] nature programme fantasy film reality show fantasy story quiz show science fiction film the news detective story romantic film sports programme game show horror story music show detective film cartoon comic book
Page 128
MORE Words and Phrases
Number	English	Example	German
1	cartoon	Cartoons are my favourite programme.	Zeichentrick(-film/-serie)
	screen time	Every day we have three hours of screen time.	Zeit vor einem Bildschirm
2	headline	What's the news headline today?	Schlagzeile
	latest	This is their latest song.	neuester/neueste/neuestes
4	comedy	We also watch comedy series.	Komödie
	episode	I watch three episodes a day.	Episode, Folge
	gamer	I watch the gamers.	Spieler/Spielerin; Zocker/Zockerin
	kind of	I usually watch some kind of series.	eine Art von
	quite	I quite like detective films.	ziemlich
	to stream	We sometimes stream a film.	streamen
	weekend	Saturday and Sunday are the weekend.	Wochenende
6	to freeze (froze)	The film stopped and the people in the picture froze.	erstarren, anhalten
	huge	An elephant is a huge animal.	riesig
	inside	Inside the car, there were four people.	in, innerhalb
	to pay (paid)	I paid three pounds for my hamburger.	(be-)zahlen
	to point to	She pointed to the clock inside the bank.	zeigen auf
	power	It has special powers.	Kraft
	remote control	You use a remote control to change the programme.	Fernbedienung
	to reply (replied)	I replied to your email this morning.	antworten
	to sell (sold)	He wants to sell his old car.	verkaufen
	tiny	An ant is a tiny insect.	winzig
	voice	She's a great singer with a beautiful voice.	Stimme
	wide	There's a very wide road near our house.	breit; weit
7	to fight (fought)	He fought his sister to get the control.	kämpfen (mit)
	shopkeeper	The shopkeeper wasn't there.	Ladenbesitzer/Ladenbesitzerin
10	to disappear	He turned the ring and disappeared.	verschwinden
	to hold (held)	The robber held a gun in his hand.	halten
11	to spend	We spend a lot of time watching shows.	verbringen (mit)
12	to bend down (bent down)	Bend down and hug me.	(sich) hinunterbeugen
	to hug	Can I hug you?	umarmen
	lake	The giraffe went to the lake.	See
	leaf (pl leaves)	It only eats leaves.	Blatt (Blätter)
	to lie	I want to lie in the sun.	liegen
	skin	The lion's skin is yellow.	Haut
	spot	The giraffe has black spots.	Punkt
	weak	I feel so weak today.	schwach
13	dead	Maybe I'm dead tomorrow.	tot
	once upon a time	Once upon a time, there was a lion.	es war einmal
	one day	One day, the giraffe went to the lake.	eines Tages
14	adventure	My favourite books are adventure stories.	Abenteuer
	cover	Look at the book covers.	(Buch-)Umschlag
	friendship	Is this a story about friendship?	Freundschaft
	poem	I read a poem every day.	Gedicht
19	neighbour	The neighbour's kid is nice.	Nachbar/Nachbarin

```

## Output contract

Write `content/corpus/units/g1-u14/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u14",
  "briefBank": "001680d0f49a",
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
