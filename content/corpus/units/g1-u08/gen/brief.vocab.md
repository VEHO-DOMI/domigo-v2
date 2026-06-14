# Vocab generation brief — g1-u08 (MORE! 1, Unit 8)

<!-- domigo:gen vocab g1-u08 bank=9dd0f200363c prompt=346902f9f0f1 -->

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
| g1u08.w.cap | cap | Kappe ; Mütze | wordfile | — | — | — | cap |
| g1u08.w.mask | mask | Maske | wordfile | — | — | — | mask |
| g1u08.w.jacket | jacket | Jacke | wordfile | — | — | — | jacket |
| g1u08.w.sweater | sweater | Pullover | wordfile | — | — | — | sweater |
| g1u08.w.blouse | blouse | Bluse | wordfile | — | — | — | blouse |
| g1u08.w.trousers | trousers | Hose | wordfile | — | — | — | trousers |
| g1u08.w.hoodie | hoodie | Hoodie ; Kapuzenpulli | wordfile | — | — | — | hoodie |
| g1u08.w.cape | cape | Umhang | wordfile | — | — | — | cape |
| g1u08.w.pyjamas | pyjamas | Pyjama ; Schlafanzug | wordfile | — | — | — | pyjamas |
| g1u08.w.tights | tights | Strumpfhose | wordfile | — | — | — | tights |
| g1u08.w.shoes | shoes | Schuhe | wordfile | — | — | — | shoes |
| g1u08.w.boots | boots | Stiefel | wordfile | — | — | — | boots |
| g1u08.w.trainers | trainers | Turnschuhe ; Sneakers | wordfile | — | — | — | trainers |
| g1u08.w.belt | belt | Gürtel | wordfile | — | — | — | belt |
| g1u08.w.hole | hole | Loch | phrase | — | Have your jeans got holes in them? | — | hole |
| g1u08.w.anything | anything | (irgend)etwas | phrase | — | Is there anything in the box? | — | anything |
| g1u08.w.to-borrow | to borrow | (sich) ausleihen | phrase | — | Can I borrow your sweater tomorrow? | borrow | to borrow ; borrow |
| g1u08.w.to-fit | to fit | passen | phrase | — | These jeans don't fit. | fit | to fit ; fit |
| g1u08.w.to-try-on | to try on | anprobieren | phrase | — | Can I try these trousers on? | try on | to try on ; try on |
| g1u08.w.to-wear | to wear | tragen (Kleidung) | phrase | — | I always wear jeans. | wear | to wear ; wear |
| g1u08.w.to-hurt | to hurt | wehtun ; schmerzen | phrase | — | My head hurts! | hurt | to hurt ; hurt |
| g1u08.w.poem | poem | Gedicht | phrase | — | He likes to write poems. | — | poem |
| g1u08.w.to-tickle | to tickle | kitzeln | phrase | — | Please don't tickle me! | tickle | to tickle ; tickle |
| g1u08.w.somebody | somebody | jemand | phrase | — | There's somebody behind the bushes. | — | somebody |
| g1u08.w.backwards | backwards | rückwärts | phrase | — | I can spell the word backwards too. | — | backwards |
| g1u08.w.exciting | exciting | aufregend | phrase | — | It's a very exciting costume. | — | exciting |
| g1u08.w.tonight | tonight | heute Abend | phrase | — | They all want to win the big prize tonight. | — | tonight |
| g1u08.w.horse | horse | Pferd | phrase | — | She rides her horse at weekends. | — | horse |
| g1u08.w.building | building | Gebäude | phrase | — | The children go into the building. | — | building |
| g1u08.w.let-s-get-out-of-here | Let's get out of here. | Lass(t) uns verschwinden. | phrase | — | — | — | Let's get out of here. |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alphabet, Anger, Annie, Arbeit, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chloe, Christie, Classroom, Clothes, Clown, Come, Dan, Dana, Daniel, Dave, David, Davis, Debbie, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, Emma, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Hmm, Holmes, Homework, Hook, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jenny, Jessica, Jill, John, Julia, Jun, Kitty, Leah, Leo, Lethabo, Lewis, London, Lucy, Mail, Manchester, Mark, Marple, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Paws, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Present, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Sally, Saying, School, Sherlock, Sophia, Steve, Sue, Tamar, Tamara, Text, Think, Tick, Toby, Tock, Tom, True, Walker, Wall, Watson, Welcome, Well, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u08.w.cap` ← v1 `cap`: d="a hat with a flat part at the front" · s="He wears a blue baseball _____ on his head with a stiff peak at the front to keep the sun off his eyes." · a=[] · mc=["sock","glove","scarf"]
- `g1u08.w.mask` ← v1 `mask`: d="something you wear over your face" · s="The masked superhero wears a black cloth _____ over his eyes and nose to hide his identity." · a=[] · mc=["glove","belt","boot"]
- `g1u08.w.jacket` ← v1 `jacket`: d="a short coat you wear outside" · s="Put on your warm waterproof _____ with a zip because it is cold and windy outside." · a=[] · mc=["T-shirt","shorts","swimsuit"]
- `g1u08.w.blouse` ← v1 `blouse`: d="a nice shirt for girls or women" · s="She wears a smart white _____ for girls with small buttons and a soft fabric to school." · a=[] · mc=["T-shirt","football shirt","dress"]
- `g1u08.w.trousers` ← v1 `trousers`: d="clothes that cover both legs" · s="My new long _____ that cover my legs to my ankles are too long for me." · a=["pants"] · mc=["cap","gloves","hat"]
- `g1u08.w.hoodie` ← v1 `hoodie`: d="a top with a hood you pull over your head" · s="He always wears his favourite grey _____ with a hood at the back that he can pull up over his head." · a=[] · mc=["T-shirt","shirt","blouse"]
- `g1u08.w.cape` ← v1 `cape`: d="a long piece of cloth you wear on your back" · s="The comic book superhero flies through the sky with a long red _____ flowing behind his back." · a=[] · mc=["hat","belt","bag"]
- `g1u08.w.pyjamas` ← v1 `pyjamas`: d="soft clothes you wear in bed" · s="I put on my cotton _____ — a top and trousers for sleeping — before I go to bed at night." · a=["pajamas"] · mc=["school uniform","party dress","football kit"]
- `g1u08.w.tights` ← v1 `tights`: d="thin clothes that cover your legs and feet" · s="She wears warm grey _____ covering her legs from her feet to her waist under her skirt in winter." · a=[] · mc=["shoes","gloves","hat"]
- `g1u08.w.shoes` ← v1 `shoes`: d="things you wear on your feet outside" · s="I need new black school _____ because my old ones are too small and my toes are hurting." · a=[] · mc=["hats","gloves","belts"]
- `g1u08.w.boots` ← v1 `boots`: d="strong shoes that cover your ankles" · s="When it rains heavily, I wear my tall waterproof rubber _____ so my feet stay dry." · a=[] · mc=["slippers","sandals","trainers"]
- `g1u08.w.trainers` ← v1 `trainers`: d="soft shoes for running and sports" · s="You need sporty _____ with rubber soles for PE class today so you can run." · a=["sneakers"] · mc=["high heels","slippers","flip-flops"]
- `g1u08.w.belt` ← v1 `belt`: d="a long band you wear around your waist" · s="His trousers are too big and keep falling down, so he needs a leather _____ around his waist." · a=[] · mc=["hat","glove","scarf"]
- `g1u08.w.hole` ← v1 `hole`: d="an opening or empty space in something" · s="There is a big _____ in my left sock and my big toe comes out through it." · a=[] · mc=["button","pocket","zip"]
- `g1u08.w.anything` ← v1 `anything`: d="any thing, used in questions" · s="Is there _____ at all in your empty pockets? Let me check." · a=[] · mc=["nothing","a lot","many things"]
- `g1u08.w.to-borrow` ← v1 `to borrow`: d="to take something and give it back later" · s="Can I _____ your warm jacket for a few minutes? I am cold and I will give it back later." · a=[] · mc=["to throw away","to burn","to tear up"]
- `g1u08.w.to-fit` ← v1 `to fit`: d="to be the right size for someone" · s="These shoes don't _____ me at all; they are two sizes too small and my toes hurt." · a=[] · mc=["to fall","to shine","to cost"]
- `g1u08.w.to-try-on` ← v1 `to try on`: d="to put on clothes to see if they fit" · s="Can I _____ this jacket in the shop before I decide to buy it?" · a=[] · mc=["to throw away","to burn","to tear"]
- `g1u08.w.to-wear` ← v1 `to wear`: d="to have clothes on your body" · s="What kind of clothes do you like to _____ to school every day?" · a=[] · mc=["to eat","to drink","to read"]
- `g1u08.w.to-hurt` ← v1 `to hurt`: d="to feel pain in your body" · s="My new leather shoes _____ my feet and now I have painful red blisters on my toes." · a=[] · mc=["to help","to heal","to cool"]
- `g1u08.w.poem` ← v1 `poem`: d="a short text with rhythm and feeling" · s="She reads a short rhyming _____ about a cat and a bat to the whole class." · a=[] · mc=["recipe","menu","map"]
- `g1u08.w.to-tickle` ← v1 `to tickle`: d="to touch someone so they laugh" · s="Don't _____ me under my arms! I can't stop laughing!" · a=[] · mc=["to hit","to kick","to push"]
- `g1u08.w.somebody` ← v1 `somebody`: d="a person, but you don't know who" · s="_____ — we don't know who — left a black jacket behind in the classroom after the lesson." · a=["someone"] · mc=["nobody","everyone","a jacket"]
- `g1u08.w.backwards` ← v1 `backwards`: d="in the opposite direction, from end to start" · s="Can you say the alphabet _____, from Z to A, without making any mistakes?" · a=[] · mc=["sideways","upwards","inside out"]
- `g1u08.w.exciting` ← v1 `exciting`: d="making you feel happy and full of energy" · s="The school trip to the zoo was really _____! We saw lions, elephants, and even a baby giraffe!" · a=[] · mc=["boring","dull","tiring"]
- `g1u08.w.tonight` ← v1 `tonight`: d="this evening, this night" · s="We are going to a big birthday party _____ after dinner — in about three hours from now." · a=[] · mc=["yesterday","last week","next year"]
- `g1u08.w.horse` ← v1 `horse`: d="a big animal people can ride" · s="The brown _____ with a mane runs fast across the green grassy field in the countryside." · a=[] · mc=["fish","rabbit","mouse"]
- `g1u08.w.building` ← v1 `building`: d="a house, school, or other structure" · s="Our school is the biggest tall _____ in the street, with four floors and many windows." · a=[] · mc=["car","tree","park"]
- `g1u08.w.let-s-get-out-of-here` ← v1 `Let's get out of here.`: d="let us leave this place quickly" · s="This place is dark and scary. _____ I don't want to stay a second longer!" · a=[] · mc=["Let's sit down.","Let's go to sleep.","Let's look around."]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 8- Clothes.txt -----
Page 60
Unit 8: Clothes
At the end of unit 8 ...
you know ☐ 17 words for clothes ☐ how to use questions in the present simple
you can ☐ talk about your and other people's clothes ☐ ask and understand what other people are wearing ☐ write a short text about your clothes ☐ create a mind map
VOCABULARY Clothes
1 Look at the picture. Remember the clothes and their colours.
[Image description: Illustration of a bedroom showing various clothing items labeled: hoodie, cape, dress, cap, (a pair of) trainers, jacket, tights, mask, skirt, boots, (a pair of) shoes, belt, (a pair of) trousers, T-shirt, blouse, pyjamas, sweater]
2 A memory test. Close your books. In pairs, ask and answer questions.
A What colour is the dress? B It's blue.
A What colour are the boots? B They're ...
SPEAKING Talking about clothes
👥 3 Work in pairs. Find out about your partner's clothes.
Do you buy your own clothes? Do you get clothes for your birthday? Do you wear T-shirts with animals on them? Do you wear pink clothes? Do you wear jeans with holes? Do you wear caps? Do you wear a ring? Do you like red / blue / ... ?
[Image description: Photo of two students talking]
Yes, I do. / No, I don't.
🔵 WB p. 67, 68 🌐 CYBER Homework 22 (Revision)
Page 61
READING
📖 4 Read the story.
The birthday party
Sophia Come in. Debbie Hi, Sophia. There's a birthday party this afternoon. Sophia That's great. Debbie No, it isn't. Sophia It isn't? Debbie No, I haven't got anything to wear. Sophia Come on. You've got lots of clothes. Debbie No, I haven't. Sophia, can I borrow your red sweater? Sophia No, you can't. Debbie Sophia, please. Sophia OK, you can borrow my red sweater. Debbie Alright. Can I borrow your green jeans, too? Sophia No, you've got lots of jeans. Debbie Only three pairs. Black jeans, red jeans and blue jeans. Sophia What's wrong with the red jeans? Debbie Come on, Sophia. They're old. Sophia, please. You're my favourite sister. Sophia OK. Here you are. Debbie Can I try them on? Sophia OK.
[Image description: Illustration of two girls by a wardrobe]
Two minutes later.
Sophia Do they fit you? Debbie Yes, they do. They fit! Hooray! Can I borrow your yellow trainers, too? Sophia No. What about your pink trainers? Debbie I don't like the colour. Sophia I think pink is nice. Debbie Please, Sophia. Can I borrow your yellow trainers? Sophia OK, OK. Try them on. Debbie They fit. Sophia Let me see. Debbie They're perfect.
Thirty minutes later.
Debbie How do I look? Sophia You look great, Debbie. Debbie I'm ready to go. Sophia Have you got your invitation? Debbie Yes, here it is. Sophia Let me see. Errm ... Debbie. There's a problem. Debbie A problem? What problem? Sophia This invitation says Saturday. Debbie So what? Today is Saturday. Sophia Yes, Saturday the 14th. The invitation says "Saturday the 7th"! Debbie Oh, no!
[Image description: Illustrations showing the girls trying on clothes and checking the invitation]
5 How many of these tasks can you do?
1 Sophia / Debbie has got a party invitation. 2 Debbie wants to borrow Sophia's red / blue sweater. 3 Debbie's red jeans are old / new. 4 Do Sophia's jeans fit Debbie? ............................................................................................. 5 Does Debbie like her pink trainers? ............................................................................................. 6 Does Debbie like the yellow trainers? ............................................................................................. 7 Sophia thinks Debbie looks good. T / F 8 Debbie can't find her invitation. T / F 9 The party is next week. T / F
2/27+28 🔊 6 Check your answers with a partner. Then listen to the story.
🔵 WB p. 72 🌐 CYBER Homework 23
Page 62
GRAMMAR CHANT Present simple questions
2/29 🔊 7 A chant. Listen and repeat.
[Image description: Illustration of two characters named Sue and Jack]
Sue and Jack. Blue and black. Jack and Sue. Black and blue.
What does Sue wear? What does Jack wear? Listen to the chant. They're a funny pair.
Does he wear a grey cap? No, he doesn't. Does he wear a red shirt? No, no, no! Don't you know, his name is Jack. His name is Jack and he only wears black.
Does she wear a black skirt? No, she doesn't. Does she wear a pink shirt? No, no, no! Don't you know, her name is Sue. Her name is Sue and she only wears blue.
SOUNDS RIGHT /ɜː/
2/30 🔊 8 Listen to the poem. Then repeat it.
Does Bert wear a shirt? Does Bert wear a skirt? He does. They're from Scotland, and they tickle and they hurt.
[Image description: Illustration of a boy in Scottish attire with sheep]
SPEAKING Asking what other people are wearing
9 C H O I C E S
👥 A Think of somebody in class. Your partner asks questions.
A Is his/her T-shirt blue? Has he/she got long hair? Are his/her jeans black?
B No, it isn't. / Yes, it is. No, he/she hasn't. / Yes, he/she has. No, they aren't. / Yes, they are.
👥 B Think of somebody in class. Work with a partner. Ask and answer questions.
Example: A Does he sometimes wear blue jeans? B Yes, he does. A Does he often wear brown shoes? B No, he doesn't. A Does he always wear T-shirts? B Yes, he does. A Is it John? B Yes, it is.
🔵 WB p. 68, 69, 70, 71
Page 63
LISTENING & SPEAKING
2/31 🔊 10 Listen to part 1 of the radio play and write the names under the superheroes. There are two extra names.
THE SUPERHERO OF THE YEAR
Wall Walker The Number Boy The Anger Exciter Alphabet Girl
[Image description: Illustration showing three superhero characters on pedestals numbered 1, 2, and 3, with a host holding a microphone labeled "THE HOST"]
VOCABULARY: *ceiling – (Zimmer-)Decke; costume – Kostüm; lift up – hochheben; throw – werfen
2/31 🔊 11 Listen again and answer the questions.
1 Does the host like Wall Walker's costume? .....Yes, he does................................. 2 Do the people like her superpower? ................................................................................... 3 Does Alphabet Girl always wear blue? ................................................................................... 4 Does the host like her costume? ................................................................................... 5 Does The Anger buy his own clothes? ................................................................................... 6 Does he show his superpower? ...................................................................................
12 In pairs. Answer the questions.
1 What is Wall Walker's superpower? 2 What is Alphabet Girl's superpower? He/She can ... 3 What is The Anger's superpower?
2/32 🔊 13 Who is the best? Choose a winner. Then listen to part 2 and check.
👤 14 Draw a superhero – don't show your partner. Describe your superhero and what he/she wears and can/can't do. Your partner draws your superhero.
🔵 WB p. 73
Page 64
WRITING
15 Look at Jessica's mind map and read her text. Find the two differences.
[Image description: Mind map centered on "Me and my clothes" with branches showing: grey socks, trainers, blue and white, picture of horse, often, favourite sweater, blue jeans, wear, green, like, don't like, jeans, skirts, trousers]
Hi, I'm Jessica. I often wear blue jeans, blue socks and blue and white trainers. My favourite sweater is pink. There is a picture of a horse on it. I like jeans, but I don't like skirts or trousers.
16 Cover up the text. Look at the mind map and talk about Jessica.
Jessica often wears ... She likes ... She doesn't like ... Her favourite ...
17 Create your own mind map and write a text about yourself.
GRAMMAR
▶️ Present simple | questions
So bildest du Ja/Nein-Fragen im Present simple:
Do you buy your own clothes? Yes, I do. No, I don't. Does he like T-shirts with animals? Yes, he does. No, he doesn't. Does she wear yellow trainers? Yes, she does. No, she doesn't. Do they wear blue jeans? Yes, they do. No, they don't.
[Image description: Cartoon of two people and a spotted dog with speech bubble "Do you buy your own clothes?"]
What colour is your dress? It's green. What colour is your new T-shirt? It's pink. What colour are your trainers? They're red and white. What colour are your jeans? They're blue.
⏪ Now go back to page 60. Check ☑ with a partner what you know / can do.
🔵 WB p. 68, 69, 70, 71, 73 🌐 CYBER Homework 24
Page 65
THE STORY OF THE STONES 4
▶️ Rats!
1 Read and answer before you watch episode 4.
1 The children get a message. Who is it from? ......................................................................... 2 Can you guess the message?
Come to the big ............................... in ............................... at .............................. o'clock.
▶️ 2 Watch episode 4. Put the pictures in the correct order.
[Image description: Six images labeled A-F showing various scenes from the episode]
3 Complete the sentences with the words from the box.
net scared morph get out building
1 Sarah, Emma, and Daniel go into the ..................................... . 2 Suddenly, they are in a big ....................................... . 3 They can't get out and they are very ....................................... . 4 Sarah and Emma ....................................... , but they can't help. 5 Finally Daniel morphs and the children ....................................... of the net.
EVERYDAY ENGLISH
4 Complete the dialogue.
Let's get out of here Good idea Rats
Emma I've got an idea. You morph and then you free us. Sarah ¹................................................................................................................ . Daniel Quick. ²..................................................................................................... ! Sarah Well done, Daniel! Darkman ³................................................................................................................ !


----- WB: WB Unit 8 Clothes.txt -----
Unit 8 Clothes
Pages 67–68
UNDERSTANDING VOCABULARY Clothes
1 Write the words from the box under the pictures.
blouse
trousers
trainers
cape
boots
shoes
sweater
mask
pyjamas
cap
belt
jacket
hoodie
tights
1 ........................................
2 ........................................
3 ........................................
4 ........................................
5 ........................................
6 ........................................
7 ........................................
8 ........................................
9 ........................................
10 ........................................
11 ........................................
12 ........................................
13 ........................................
14 ........................................
USING VOCABULARY Clothes
2 Write sentences about Sandy’s and Adam’s clothes.
Sandy’s eye mask is ..............................................................
......................................................................................
......................................................................................
......................................................................................
......................................................................................
......................................................................................
......................................................................................
......................................................................................
......................................................................................
......................................................................................
......................................................................................
3 Look at the pictures and write sentences.
Maria’s room
Tom’s room
In Maria’s room, there are two caps.
......................................................................................
......................................................................................
......................................................................................
UNDERSTANDING GRAMMAR Present simple questions
4 Match the questions and answers.
1 Does he like pizza?
2 Do you speak Spanish?
3 Does the shop always close at four?
4 Do they go to your school?
5 Does your cat like cat food?
6 Do you know his name?
□ Yes, they do. They’re my friends.
□ No, it doesn’t. It hates it!
□ Yes, he does. He loves it!
□ No, I don’t. Let’s ask!
□ No, it doesn’t. Only on Saturdays!
□ Yes, I do. And Italian, too!
Pages 69–70
5 Look at the pictures and circle the correct options.
1 Do / Does Michael speak French*?
Yes, he does. / No, he doesn’t.
2 Do / Does they like spaghetti?
Yes, they do. / No, they don’t.
3 Do / Does Sara eat meat?
Yes, she does. / No, she doesn’t.
4 Do / Does they know the way?
Yes, they do. / No, they don’t.
5 Do / Does they like football?
Yes, they do. / No, they don’t.
6 Do / Does you like cats?
Yes, I do. / No, I don’t.
VOCABULARY: *French – französisch
USING GRAMMAR Present simple questions
6 What’s true for you? Answer the questions.
1 Do you like football?
Yes, I do. / No, I don’t.
2 Do you eat meat?
......................................................................................
3 Do your mum and dad like sport?
......................................................................................
4 Does your English teacher give you a lot of homework?
......................................................................................
5 Does your best friend speak English?
......................................................................................
6 Do you wear pink clothes?
......................................................................................
7 Do you play an instrument?
......................................................................................
8 Do you like vegetables?
......................................................................................
7 Complete the dialogue with do, don’t or does.
John That boy next to George, is he new?
Sam Yes, he is. He’s from Austria.
John 1 ........................................ you know his name?
Sam No, I 2 ........................................ .
John 3 ........................................ he speak English?
Sam Yes, he 4 ........................................ . His English is very good.
John 5 ........................................ he play football?
Sam I 6 ........................................ know. Let’s ask.
John Hi, I’m John. What’s your name?
Peter I’m Peter.
John 7 ........................................ you play football, Peter?
Peter Yes, I 8 ........................................ . I love football.
John Great. Can you play tomorrow afternoon?
Peter When 9 ........................................ you play?
John At four.
Peter OK. Tomorrow at four.
8 Listen and check.
9 Read the dialogue in 7 again. Then tick T (True) or F (False).
1 There’s a new boy at John’s school. T ☐ F ☐
2 John is in Austria. T ☐ F ☐
3 Sam knows the boy’s name. T ☐ F ☐
4 The new boy’s name is Sam. T ☐ F ☐
5 Peter likes football. T ☐ F ☐
6 The football match is at four the next day. T ☐ F ☐
10 Write the words in the correct order to make questions.
1 buy / clothes / do / own / you / your
......................................................................................
2 holes / wear / you / jeans / do / with
......................................................................................
3 boots / like / pink / do / you / my
......................................................................................
4 clothes / do / wear / orange / you
......................................................................................
5 birthday / do / clothes / get / you / for / your
......................................................................................
6 animals / wear / you / with / do / T-shirts / pictures of
......................................................................................
Pages 71–72
11 Write the questions for the answers.
1 Does Kevin speak Italian?
No, he doesn’t. Kevin doesn’t speak a word of Italian.
2 ...................................................................................... Vienna?
No, I don’t. I live in Liverpool.
3 ...................................................................................... ?
Yes, they do. They like all sports.
4 ...................................................................................... ?
No, we don’t. Mum buys our clothes.
5 ...................................................................................... ?
No, she doesn’t. She never wears jeans.
6 ...................................................................................... sweets?
No, I don’t. I like vegetables.
READING & WRITING What other people are wearing / Your clothes
12 CHOICES
A Put the dialogue in the correct order. Then listen and check.
□ A Does Pat often wear jeans with holes?
□ A What colour are they?
□ A So she has got lots of jeans with holes, right?
□ B Yes, she has.
□ B Pink, blue and black.
□ B Yes, she loves jeans with holes.
B Complete the dialogue with the sentences from the box. Then listen and check.
And what does she wear with these jeans?
And shoes?
Does she wear jeans then?
No, she doesn’t.
Green.
A Does your sister often wear skirts?
B 1 ......................................................................................
A 2 ......................................................................................
B Yes, she does.
A What colour are her favourite jeans?
B 3 ......................................................................................
A 4 ......................................................................................
B Usually yellow T-shirts.
A 5 ......................................................................................
B She has only got red shoes.
A Oh dear!
13 Read the texts. How many of the tasks below can you do?
The clothes I like wearing
Sandra (14, London)
From Monday to Friday, I wear school uniform. It’s OK, but I don’t like it a lot – it’s a green skirt and a white blouse, with brown shoes. In the evenings, at home, I usually wear jeans and a T-shirt. It’s comfortable*! When I go to a party or when I go out with my friends, I often wear a dress, tights and black boots. My favourite dress is black, with two or three yellow stars. I love it!
Steve (14, Plymouth)
It’s great – at my school, we haven’t got a uniform. I usually wear jeans, a brown belt and a white shirt. I think that’s cool. I also wear a pair of black shoes or trainers. I wear T-shirts at home. At the weekend, I go out with my friends and I wear trousers and a jacket. My jacket is my favourite thing; it’s brown leather* and I love it! And I often wear my yellow shirt – I like it a lot.
Mandy (12, Basingstoke)
My favourite clothes are my white dress and my pink shoes – they’re great together. But I only wear them to parties, of course, or on special days. In the week, at school, I wear the school uniform. It’s not bad – it’s a grey skirt and a white shirt with black shoes. I think it’s OK. I like white shirts, they’re cool! And the grey skirt is OK too. At home, in the evening and at the weekend, I usually wear my jeans and a hoodie.
VOCABULARY: *comfortable – bequem; leather – Leder; made of – gemacht aus
1 Sandra really likes her school uniform. T / F
2 She wears jeans to school. T / F
3 The dress she likes best is black and yellow. T / F
4 Steve doesn’t ........................................ a school uniform.
5 On ........................................ and ........................................ he wears a jacket and trousers.
6 His jacket is made of* ........................................ .
7 When does Mandy wear her favourite clothes?
......................................................................................
8 What clothes does she wear to school?
......................................................................................
9 What does she usually wear around the house?
......................................................................................
14 Listen and check your answers.
Pages 73–74
15 Answer the questions about yourself.
1 What clothes do you wear to school?
......................................................................................
2 What clothes do you wear at home?
......................................................................................
3 What clothes do you wear to parties?
......................................................................................
16 Use your answers in 15 to write a paragraph about your clothes.
......................................................................................
......................................................................................
......................................................................................
......................................................................................
......................................................................................
LISTENING Talking about other people’s clothes
17 Listen and write the correct names under the pictures. There is one extra picture.
1 ........................................
2 ........................................
3 ........................................
18 Listen again and tick T (True) or F (False).
1 Jane never wears white shirts. T ☐ F ☐
2 Jane’s leather jacket is cool and new. T ☐ F ☐
3 Jane doesn’t like her trainers. T ☐ F ☐
4 Jane never wears T-shirts. T ☐ F ☐
5 Anna has got lots of clothes and shoes. T ☐ F ☐
6 Her favourite skirt is blue and pink. T ☐ F ☐
7 At the weekends, she usually wears jeans. T ☐ F ☐
8 On Saturdays, Anna always wears her dress. T ☐ F ☐
WORD FILE Clothes
(cap)
(mask)
(jacket)
(sweater)
(blouse)
(trousers)
(hoodie)
(cape)
(pyjamas)
(tights)
(shoes)
(boots)
(trainers)
(belt)
MORE Words and Phrases
hole – Have your jeans got holes in them? – Loch
anything – Is there anything in the box? – (irgend)etwas
to borrow – Can I borrow your sweater tomorrow? – (sich) ausleihen
to fit – These jeans don’t fit. – passen
to try on – Can I try these trousers on? – anprobieren
to hurt – My head hurts! – wehtun, schmerzen
poem – He likes to write poems. – Gedicht
to tickle – Please don’t tickle me! – kitzeln
somebody – There’s somebody behind the bushes. – jemand
backwards – I can spell the word backwards too. – rückwärts
exciting – It’s a very exciting costume. – aufregend
tonight – They all want to win the big prize tonight. – heute Abend
horse – She rides her horse at weekends. – Pferd
building – The children go into the building. – Gebäude
Let’s get out of here. – Lass(t) uns verschwinden.

```

## Output contract

Write `content/corpus/units/g1-u08/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u08",
  "briefBank": "9dd0f200363c",
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
