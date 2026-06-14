# Vocab generation brief — g1-u02 (MORE! 1, Unit 2)

<!-- domigo:gen vocab g1-u02 bank=8964a98699d2 prompt=346902f9f0f1 -->

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
| g1u02.w.tree | tree | Baum | wordfile | — | — | — | tree |
| g1u02.w.monkey | monkey | Affe | wordfile | — | — | — | monkey |
| g1u02.w.parrot | parrot | Papagei | wordfile | — | — | — | parrot |
| g1u02.w.giraffe | giraffe | Giraffe | wordfile | — | — | — | giraffe |
| g1u02.w.train | train | Zug | wordfile | — | — | — | train |
| g1u02.w.penguin | penguin | Pinguin | wordfile | — | — | — | penguin |
| g1u02.w.guide | guide | Führer/Führerin ; Guide | wordfile | — | — | — | guide |
| g1u02.w.lion | lion | Löwe | wordfile | — | — | — | lion |
| g1u02.w.next-to | next to | neben | wordfile | — | — | — | next to |
| g1u02.w.in | in | in | wordfile | — | — | — | in |
| g1u02.w.behind | behind | hinter | wordfile | — | — | — | behind |
| g1u02.w.under | under | unter | wordfile | — | — | — | under |
| g1u02.w.on | on | auf | wordfile | — | — | — | on |
| g1u02.w.in-front-of | in front of | vor | wordfile | — | — | — | in front of |
| g1u02.w.zoo | zoo | Zoo | phrase | — | There are many animals in the zoo. | — | zoo |
| g1u02.w.beautiful | beautiful | schön ; hübsch | phrase | — | The parrot is blue and yellow. It's beautiful. | — | beautiful |
| g1u02.w.behind-2 | behind | hinter | phrase | — | The chair is behind the desk. | — | behind |
| g1u02.w.big | big | groß | phrase | — | There's a big giraffe. | — | big |
| g1u02.w.in-front-of-2 | in front of | vor | phrase | — | The tree is in front of you. | — | in front of |
| g1u02.w.next-to-2 | next to | neben | phrase | — | The monkey is next to the parrot. | — | next to |
| g1u02.w.under-2 | under | unter | phrase | — | The bag is under the desk. | — | under |
| g1u02.w.where | where | wo | phrase | — | Where is Polly? | — | where |
| g1u02.w.small | small | klein | phrase | — | The monkey isn't big. It's small. | — | small |
| g1u02.w.adult | adult | Erwachsene/r | phrase | — | Adults are €14.40. | — | adult |
| g1u02.w.at | at | bei ; an ; in | phrase | — | The children are at the zoo. | — | at |
| g1u02.w.to-bring | to bring | (mit-)bringen | phrase | — | Can I bring my dog, Buddy? | bring | to bring ; bring |
| g1u02.w.but | but | aber | phrase | — | Dogs are welcome. But they can't run around. | — | but |
| g1u02.w.child | child (pl children) | Kind | phrase | — | Child €4.90. | — | child ; children |
| g1u02.w.dog | dog | Hund | phrase | — | Buddy is a dog. | — | dog |
| g1u02.w.family | family | Familie | phrase | — | Buddy's family is at the zoo. | — | family |
| g1u02.w.free | free | kostenlos | phrase | — | Parking is free. | — | free |
| g1u02.w.grandma | Grandma | Oma | phrase | — | Say hi to Grandma! | — | Grandma |
| g1u02.w.group | group | Gruppe | phrase | — | A group ticket is €8.90. | — | group |
| g1u02.w.long | long | lang | phrase | — | The giraffe has a long neck. | — | long |
| g1u02.w.ticket | ticket | Eintrittskarte ; Ticket | phrase | — | Adult tickets are €14.40. | — | ticket |
| g1u02.w.to-want | to want | wollen | phrase | — | I want a lion. | want | to want ; want |
| g1u02.w.from | from | aus | phrase | — | They are from California. | — | from |
| g1u02.w.year | year | Jahr ; Jahrgangsstufe | phrase | — | I'm in Year 7. | — | year |
| g1u02.w.he | he | er | phrase | — | He likes animals. | — | he |
| g1u02.w.she | she | sie | phrase | — | She is from England. | — | she |
| g1u02.w.to-talk | to talk | sprechen ; sich unterhalten | phrase | — | Talk about the boys and girls. | talk | to talk ; talk |
| g1u02.w.they | they | sie | phrase | — | Rahim and Sue are 11. They are from Manchester. | — | they |
| g1u02.w.we | we | wir | phrase | — | We are from Austria. | — | we |
| g1u02.w.for | for | für | phrase | — | Here's a chant for you. | — | for |
| g1u02.w.happy | happy | glücklich ; fröhlich ; zufrieden | phrase | — | Buddy is happy. | — | happy |
| g1u02.w.to-let-somebody-out | to let somebody out | jemanden herauslassen | phrase | — | Let us out! | let somebody out | to let somebody out ; let somebody out |
| g1u02.w.us | us | uns | phrase | — | Can you see us? | — | us |
| g1u02.w.car | car | Auto | phrase | — | The parrot is in the car. | — | car |
| g1u02.w.at-last | At last. | Endlich. | phrase | — | — | — | At last. |
| g1u02.w.how-strange | How strange! | Wie komisch! | phrase | — | — | — | How strange! |
| g1u02.w.let-me-see | Let me see. | Lass mich mal schauen. | phrase | — | — | — | Let me see. |
| g1u02.w.stone | stone | Stein | phrase | — | Colour your stone. | — | stone |

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Befehlsformen, Betty, Bild, Box, Buddy, California, Cambridge, Carina, Carl, Chloe, Classroom, Dave, Dialog, Don, England, English, False, Freddy, Gordon, Homework, Imperatives, Irregular, Jenny, Julia, Leah, London, Mail, Manchester, Mike, Nice, Nomen, Number, Numbers, Omar, Plural, Prepositions, Rajit, Reihenfolge, Saying, School, Sue, Text, True, Welcome, Well, Work, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u02.w.tree` ← v1 `tree`: d="a big plant with a trunk and leaves" · s="The cat is sitting high up in the _____ on a strong branch." · a=[] · mc=["bush","flower","nest"]
- `g1u02.w.monkey` ← v1 `monkey`: d="an animal that climbs trees and eats bananas" · s="The _____ with long arms is eating a banana high up in the tree." · a=[] · mc=["snake","fish","crocodile"]
- `g1u02.w.parrot` ← v1 `parrot`: d="a colourful bird that can talk" · s="The colourful _____ can say 'hello' and 'goodbye' like a human." · a=[] · mc=["fish","cat","rabbit"]
- `g1u02.w.giraffe` ← v1 `giraffe`: d="a very tall animal with a long neck" · s="The _____ with the very long neck is so tall it can eat leaves from high trees." · a=[] · mc=["mouse","rabbit","dog"]
- `g1u02.w.train` ← v1 `train`: d="it goes on tracks and carries people" · s="We took the _____ on the tracks from London to Manchester with 20 carriages." · a=[] · mc=["car","bicycle","boat"]
- `g1u02.w.penguin` ← v1 `penguin`: d="a black and white bird that cannot fly" · s="The black and white _____ cannot fly but swims in the cold icy water of Antarctica." · a=[] · mc=["eagle","sparrow","chicken"]
- `g1u02.w.guide` ← v1 `guide`: d="a person who shows you around a place" · s="The friendly _____ at the zoo walked with us and told us about all the animals." · a=[] · mc=["child","visitor","parent"]
- `g1u02.w.lion` ← v1 `lion`: d="a big wild cat, the king of animals" · s="The big _____ has a huge brown mane of hair around its head like a crown." · a=[] · mc=["tiger","bear","wolf"]
- `g1u02.w.next-to` ← v1 `next to`: d="very close to the side of something" · s="My house is right _____ the school, sharing a wall with it." · a=[] · mc=["far from","behind","above"]
- `g1u02.w.in` ← v1 `in`: d="inside something" · s="The new pencils are _____ the small wooden box with the lid closed." · a=[] · mc=["above","below","around"]
- `g1u02.w.behind` ← v1 `behind`: d="at the back of something" · s="The scared cat is hiding _____ the big sofa where nobody can see her." · a=[] · mc=["in front of","above","under"]
- `g1u02.w.under` ← v1 `under`: d="below something" · s="The ball rolled _____ the table and is now on the floor between the four legs." · a=[] · mc=["above","over","around"]
- `g1u02.w.on` ← v1 `on`: d="on top of something" · s="The open book is _____ the desk, lying flat on the top surface." · a=[] · mc=["under","inside","below"]
- `g1u02.w.in-front-of` ← v1 `in front of`: d="before something, facing it" · s="The yellow school bus stopped _____ the school gate, facing the entrance." · a=[] · mc=["behind","far from","above"]
- `g1u02.w.zoo` ← v1 `zoo`: d="a place where you can see many animals" · s="We saw elephants, lions and monkeys in their cages at the _____." · a=[] · mc=["shop","hospital","library"]
- `g1u02.w.beautiful` ← v1 `beautiful`: d="very nice to look at" · s="Look at the pink sunset over the sea! The view is so _____ I want to take a photo." · a=["pretty"] · mc=["ugly","dirty","dark"]
- `g1u02.w.behind-2` ← v1 `behind`: d="at the back of something" · s="The scared cat is hiding _____ the big sofa where nobody can see her." · a=[] · mc=["in front of","above","under"]
- `g1u02.w.big` ← v1 `big`: d="not small, large" · s="An adult elephant is a very _____ animal — much larger than a car." · a=["large"] · mc=["small","tiny","little"]
- `g1u02.w.in-front-of-2` ← v1 `in front of`: d="before something, facing it" · s="The yellow school bus stopped _____ the school gate, facing the entrance." · a=[] · mc=["behind","far from","above"]
- `g1u02.w.next-to-2` ← v1 `next to`: d="very close to the side of something" · s="My house is right _____ the school, sharing a wall with it." · a=[] · mc=["far from","behind","above"]
- `g1u02.w.under-2` ← v1 `under`: d="below something" · s="The ball rolled _____ the table and is now on the floor between the four legs." · a=[] · mc=["above","over","around"]
- `g1u02.w.where` ← v1 `where`: d="asking about a place" · s="_____ is the bathroom, please? I can't find the door." · a=[] · mc=["when","who","why"]
- `g1u02.w.small` ← v1 `small`: d="not big, little" · s="A baby mouse is a very _____ animal. You can hold it in the palm of your hand." · a=["little","tiny"] · mc=["big","huge","enormous"]
- `g1u02.w.adult` ← v1 `adult`: d="a person who is not a child" · s="One _____ ticket for someone over 18 costs fourteen euros at the cinema." · a=["grown-up"] · mc=["child","baby","toddler"]
- `g1u02.w.at` ← v1 `at`: d="a word to say where someone is" · s="The children are _____ school right now in their classroom until 1 pm." · a=[] · mc=["with","from","by"]
- `g1u02.w.to-bring` ← v1 `to bring`: d="to carry something to a place" · s="Please _____ your packed lunch with you to school tomorrow for the trip." · a=[] · mc=["to leave","to forget","to lose"]
- `g1u02.w.but` ← v1 `but`: d="a word that shows a different idea" · s="I like cats _____ my brother likes dogs. We cannot agree." · a=[] · mc=["and","or","so"]
- `g1u02.w.dog` ← v1 `dog`: d="a pet animal that barks" · s="My pet _____ named Rex likes to play fetch and run fast in the park." · a=[] · mc=["goldfish","rabbit","tortoise"]
- `g1u02.w.family` ← v1 `family`: d="your mother, father, brothers, and sisters" · s="My _____ has four people: my mum, my dad, my little sister, and me." · a=[] · mc=["class","team","group"]
- `g1u02.w.free` ← v1 `free`: d="you do not have to pay" · s="The water at the school drinking fountain is _____. You don't pay for it." · a=[] · mc=["expensive","cheap","wet"]
- `g1u02.w.grandma` ← v1 `Grandma`: d="your mother's or father's mother" · s="We visit _____ — my mum's mother — every Sunday for lunch at her house." · a=["Grandmother","Granny"] · mc=["Grandpa","Uncle","Dad"]
- `g1u02.w.group` ← v1 `group`: d="some people together" · s="Our _____ has five children working on the same project together." · a=[] · mc=["family","class","team"]
- `g1u02.w.long` ← v1 `long`: d="not short, having a big length" · s="The snake has a very _____ body, about three metres from head to tail." · a=[] · mc=["short","round","small"]
- `g1u02.w.ticket` ← v1 `ticket`: d="a piece of paper that lets you go in" · s="You need a _____ to enter the zoo. You buy one at the entrance and show it at the gate." · a=[] · mc=["map","photo","bag"]
- `g1u02.w.to-want` ← v1 `to want`: d="to wish for something" · s="I _____ to go swimming today because it is very hot outside. Can we?" · a=[] · mc=["to refuse","to hate","to fear"]
- `g1u02.w.from` ← v1 `from`: d="showing where someone comes from" · s="She is _____ Austria. She was born in Vienna and speaks German." · a=[] · mc=["to","at","with"]
- `g1u02.w.year` ← v1 `year`: d="twelve months, or a school grade" · s="I am ten _____ old. My next birthday is in June." · a=["years"] · mc=["months","weeks","days"]
- `g1u02.w.he` ← v1 `he`: d="a word for a boy or man" · s="_____ is my older brother. His name is Tom and he is 14." · a=[] · mc=["she","it","they"]
- `g1u02.w.she` ← v1 `she`: d="a word for a girl or woman" · s="_____ is my younger sister. Her name is Anna and she is 8." · a=[] · mc=["he","it","they"]
- `g1u02.w.to-talk` ← v1 `to talk`: d="to say words to someone" · s="I like to _____ to my friends about football and video games during the break." · a=[] · mc=["to sleep","to sing","to read"]
- `g1u02.w.they` ← v1 `they`: d="a word for more than one person" · s="Tom and Anna are my friends. _____ always play together at break time." · a=[] · mc=["we","he","she"]
- `g1u02.w.we` ← v1 `we`: d="a word for me and other people" · s="_____ are all in class 1A together. There are twenty of us in the room." · a=[] · mc=["they","he","she"]
- `g1u02.w.for` ← v1 `for`: d="showing who gets something" · s="This birthday present is _____ you. I bought it at the toyshop yesterday." · a=[] · mc=["from","with","against"]
- `g1u02.w.happy` ← v1 `happy`: d="feeling good, not sad" · s="She is very _____ because it is her birthday party today and she has many presents." · a=["glad"] · mc=["sad","angry","tired"]
- `g1u02.w.to-let-somebody-out` ← v1 `to let somebody out`: d="to allow someone to go outside" · s="The bird is stuck in the cage. Please open the door and _____ it _____ so it can fly free." · a=[] · mc=["to keep somebody in","to trap somebody","to lock somebody up"]
- `g1u02.w.us` ← v1 `us`: d="a word for me and other people (object)" · s="The teacher told _____ a funny story. All twenty of us in the class listened and laughed." · a=[] · mc=["them","him","her"]
- `g1u02.w.car` ← v1 `car`: d="a vehicle with four wheels for driving" · s="Dad drives his red _____ with four wheels and a steering wheel to work every day." · a=[] · mc=["bicycle","boat","plane"]
- `g1u02.w.at-last` ← v1 `At last.`: d="finally, after a long wait" · s="We waited at the bus stop for one hour in the cold! _____ the late bus finally came." · a=["Finally"] · mc=["Oh no!","Not yet.","Once again."]
- `g1u02.w.how-strange` ← v1 `How strange!`: d="that is very unusual" · s="Look — my old cat is swimming in the pool! _____ Cats usually hate water." · a=[] · mc=["How nice!","How funny!","How sad!"]
- `g1u02.w.let-me-see` ← v1 `Let me see.`: d="I want to look at it" · s="You found something interesting in the garden? _____ Show it to me now!" · a=[] · mc=["Let me go.","Let me try.","Let me think."]
- `g1u02.w.stone` ← v1 `stone`: d="a hard piece of rock on the ground" · s="He picked up a small hard _____ from the ground and threw it into the water with a splash." · a=["rock"] · mc=["flower","leaf","feather"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 2- At the zoo.txt -----
Page 16
Unit 2: At the zoo
At the end of unit 2 ...
you know ☐ the verb to be ☐ how to use prepositions of place ☐ how to use there is / there are ☐ 11 words for animals and things in a wildlife park
you can ☐ talk and write about yourself and others ☐ understand others talking about themselves ☐ understand, ask and say where things are ☐ write about school things and objects
READING
📖 1 Read the story.
Note [Image: Simple illustrations showing prepositions] next to behind on under in front of
Where's the parrot?
Maria Hey, David, look! There's a big giraffe. David Cool! And ... there's a parrot under the giraffe! Maria Where? David There! The parrot is blue and yellow. It's beautiful. Maria Oh, yes. Buddy, you like giraffes! Buddy WOOF! David Look – there are three monkeys. They're behind the tree. Maria The tree? David Yes, the tree in front of you! Maria Oh, yes! And there's the parrot! David Where? Maria It's next to the brown monkey. I like monkeys! Buddy WOOF, WOOF, WOOF! Maria What is it, Buddy? David The parrot! Maria Where? David It's on Buddy now! Buddy WOOF?!
[Image description: Illustrations showing a giraffe, tree with children and dog at a zoo]
Note where's = where is there's = there is they're = they are
2 How many of these tasks can you do?
Choose the correct answer. 1 The giraffe is big / small. 2 The parrot is blue and yellow / green and yellow.
Circle T (True) or F (False). 3 There are two monkeys. T / F 4 The tree is behind Maria. T / F
Answer the questions. 5 Where is the brown monkey? ..................................................... 6 Where is the parrot now? .....................................................
1/16+17 🔊 3 Check your answers with a partner. Then listen to the story.
🔵 WB p. 14, 15, 18 🌐 CYBER Homework 4 (Revision)
Page 17
LISTENING & SPEAKING Understanding/Saying where animals are
1/18 🔊 4 a Look at the poster. Where is this?
☐ in England ☐ in Italy
b Listen to the guide. What is the order of the sentences? Write the numbers.
[Image description: A colorful poster for "WELCOME TO COTSWOLD WILDLIFE PARK AND GARDENS!" featuring a guide, a train, a lion, giraffes, penguins, and a dog. Various activities are labeled with speech bubbles:]
See a lion.
Go on a train.
Feed the giraffes.
Feed the penguins.
Bring your dog.
Adults £14.40
Children £9.90
Fact box Dogs are welcome at Cotswold Wildlife Park and Gardens! But they can't run around!
👥 5 Look at the pictures in 4 and say.
There is | a train. There are | penguins. | giraffes. | ...
You can | go on ... . | see ... . | ...
🔵 WB p. 14, 19
Page 18
LISTENING & SPEAKING Talking about yourself and others
1/19 🔊 6 Listen and tick what the children say.
1 ☐ I'm Rebecca. ☐ I'm from Oxford. ☐ I'm 11. ☐ I'm in Year 7. ☐ I'm Veronica. ☐ I'm from Cambridge. ☐ I'm 12. ☐ I'm in Year 8.
2 ☐ I'm Robert. ☐ I'm from York. ☐ I'm 12. ☐ I'm in Year 7. ☐ I'm Roger. ☐ I'm from Cork. ☐ I'm 13. ☐ I'm in Year 8.
3 ☐ We're Sam and Catherine. ☐ We're from London. ☐ We're 13. ☐ We're in Year 8. ☐ We're Karen and Benny. ☐ We're from Liverpool. ☐ We're 14. ☐ We're in Year 9.
👤 7 Talk about the boys and girls in 6.
1 Veronica's from ... . She's ... . She's in ... . 2 ... from ... . He's ... . He's in ... . 3 ... and ... are from ... . They're ... . They're in ... .
Note I'm = I am you're = you are he's / she's = he is / she is we're = we are they're = they are
👤 8 In pairs, talk about yourself. Listen and then talk about your partner.
[Image description: Two student photos with speech bubbles] I'm ... | I'm from ... | I'm ... | I'm in ...
You're ... | You're from ... | You're ... | You're in ...
GRAMMAR CHANT to be
1/20 🔊 9 A chant. Listen and repeat.
Monkeys, monkeys, monkeys in the zoo. Monkeys, monkeys – here's a chant for you.
[Image description: Illustration of City Zoo with people looking at monkeys in a cage]
I am in. You are out. I'm not happy. Let me out.
Monkeys, monkeys ...
Ken is in. Lucy's out. Ken's not happy. Let Ken out.
Monkeys, monkeys ...
We are in. They are out. We're not happy. Let us out.
Monkeys, monkeys ...
🔵 WB p. 17, 18 🌐 CYBER Homework 5
Page 19
SPEAKING Asking/Saying where things are
1/21 🔊 10 Where's the parrot? Complete with in / on / under / in front of / behind / next to. Then listen and check.
Note it's = it is
[Image description: Six panels showing a parrot in different positions relative to a car]
1 It's ........................... the car. 2 It's ........................... the car. 3 It's ........................... the car.
4 It's ........................... the car. 5 It's ........................... the car. 6 It's ........................... the car.
11 C H O I C E S
[Image description: Illustration of a bedroom/study with desk, chair, computer, cat, dog, plant, and school bag]
👥 A Work in pairs. Look at the things in the picture. Ask and answer.
Where's the chair? Where's the frog? Where's the cat? Where's the dog? Where's the banana?
It's | in | under | behind | on | next to | in front of
the desk. the school bag. the chair. the computer.
👥 B Work in pairs. Look at the things in the picture. Ask about the following things: desk, window, school bag, book.
🔵 WB p. 15, 16, 17
Page 20
WRITING
12 C H O I C E S
A Write what's in your pencil case.
In my pencil case there is a ... , there are ... , there is a ... and ...
B Look at the picture and write.
There is a book on the desk. Next to ...
[Image description: Illustration of a desk with books, pencils, and a school bag underneath]
GRAMMAR
▶️ there is / there are
So kannst du ausdrücken, dass etwas vorhanden ist:
There is a train. | There are two trains. There is a penguin. | There are two penguins.
▶️ Prepositions of place
So fragst du, wo sich etwas befindet: So antwortest du:
Where's the frog? It's in the shoe.
[Image description: Illustrations of a frog in different positions relative to a shoe, labeled: behind, under, in, on, next to, in front of]
▶️ to be (affirmative)
Das Verb „sein" (ich bin, du bist, er ist, ...) hat im Englischen die folgenden Formen:
I'm fine. (I am fine.) | We're from York. (We are from York.) You're nice. (You are nice.) | You're happy. (You are happy.) He's in class 4A. (He is in class 4A.) | They're from London. (They are from London.) She's 11. (She is 11.) It's yellow. (It is yellow.)
⏪ Now go back to page 16. Check ☑ with a partner what you know / can do.
🔵 WB p. 16, 17, 19 🌐 CYBER Homework 6
Page 21
THE STORY OF THE STONES 1
▶️ They're here!
1 Look and say.
☐ I think it's a fantasy story. ☐ I think it's a real story.
▶️ 2 Watch episode 1. Write the names.
[Image description: Three character portraits labeled 1, 2, and 3 with blank lines below for names]
1/22 🔊 3 Listen and complete the rhyme. Then choose a colour. Draw your face or stick in a photo. Complete the sentence and colour your stone.
[Image description: Scenic landscape with water and mountains at sunset/sunrise]
One stone is ...................................... . One stone is ...................................... . One stone is ...................................... . Watch our story. Here's what they can do!
My stone is ...................................... .
[Image: Empty frame with a stone outline at the bottom]
EVERYDAY ENGLISH
4 Match the pictures with the phrases.
1 Let me see. 2 How strange! 3 At last!
[Image description: Three comic-style panels showing characters in different scenes]
5 Can you do the puzzle?
CODE: ♦ = P ⚙ = W ⭕ = E ⬜ = S
♦ ⚙ ⭕ ⬜ ⭕ ⬜


----- WB: WB Unit 2 At the zoo.txt -----
Unit 2 At the zoo
Page 14–15
UNDERSTANDING VOCABULARY
At the wildlife park / Prepositions of place
1 Schreib die Wörter in das Bild.
giraffe
parrot
tree
monkey
dog
train
penguin
guide
[Image description: A large illustration of a wildlife park. On the left, three visitors stand next to a guide wearing a hat and pointing. Behind them is a small train with people inside. In the foreground, a giraffe bends its long neck toward a penguin near water. A monkey is sitting in a tree on the right, and a colourful parrot is perched on a branch. A dog is barking near the tree. Numbered blank labels (1–8) are placed near objects and animals in the picture to be filled in with the words.]
2 Verbinde die Wörter mit den Bildern.
in
on
under
behind
in front of
next to
[Image description: Six small pictures of a hamster and a cage, each numbered 1–6. The hamster is shown in different positions: in the cage, on the cage, under the cage, behind the cage, in front of the cage, and next to the cage.]
3 Wo sind alle? Schreib die Zahlen in die Bilder.
1 She’s under a tree.
2 It’s behind the tree.
3 He’s next to a giraffe.
4 They’re on a car.
5 It’s in the water.
6 She’s on the chair.
[Image description: Six pictures labelled A–F.
A: A crocodile partly in the water near grass.
B: A girl sitting on a chair.
C: A girl sitting under a tree.
D: A boy standing next to a giraffe.
E: Two frogs sitting on top of a red car.
F: A monkey behind a tree.]
USING VOCABULARY
At the wildlife park / Prepositions of place
4 Vervollständige die Dialoge. Verwende behind / in / on / under.
1
There’s a monkey over there.
Where?
It’s _____________________________.
[Image description: Two children looking through binoculars. In the picture on the right, a monkey is sitting in a tree.]
2
There’s a giraffe over there.
Where?
_____________________________.
[Image description: Two children with binoculars. A giraffe is standing behind trees in the distance.]
3
There are lions over there.
Where?
_____________________________.
[Image description: Lions sitting under a tree while children watch from nearby.]
4
There’s a parrot …
Where?
_____________________________ cap.
WOW!
[Image description: A parrot sitting on a boy’s cap.]
Page 16–17
UNDERSTANDING GRAMMAR
there is / there are
5 Schau dir das Bild an und hake T (True/richtig) oder F (False/falsch) an.
1 There are four monkeys. T ☐ F ☐
2 There are two frogs. T ☐ F ☐
3 There are five dogs. T ☐ F ☐
4 There are nine penguins. T ☐ F ☐
5 There is one lion. T ☐ F ☐
6 There are two cats. T ☐ F ☐
[Image description: Many animals shown together: monkeys, lions, dogs, penguins, frogs, cats, and other animals.]
6 Schreib is oder are in die Lücken.
1 There ______________ six lions in the wildlife park.
2 There ______________ a blue and yellow parrot.
3 There ______________ three monkeys in the tree.
4 There ______________ a train.
5 There ______________ four children.
6 There ______________ a dog.
UNDERSTANDING GRAMMAR
there is / there are + prepositions of place
7 Schau dir das Bild genau an. Lies die Sätze und trage die sechs richtigen Zahlen ein.
☐ There’s a cat behind the desk.
☐ There’s a frog on the board.
☐ There’s a dog under the desk.
☐ There’s a tablet in front of the books.
☐ There are three cats in the desk.
☐ There’s a lion next to the door.
[Image description: A classroom scene with numbered animals and objects: frogs on a board, cats in and under desks, a lion next to a door, a dog under a desk, books and a tablet on a table.]
8 Schau dir das Bild in 7 nochmal an und vervollständige die Sätze. Dann trage die richtigen Zahlen ein.
☐ There are two frogs _______________________________.
☐ There’s a penguin _______________________________.
☐ There’s a pencil _______________________________.
☐ There are three books _______________________________.
Page 18–19
USING GRAMMAR
to be
9 Ergänze die Sätze.
1 ______________ ten.
2 ______________ not happy.
3 ______________ happy.
4 ______________ fifteen and ten.
5 ______________ black and white.
6 ______________ fine.
[Image description: Children holding signs with numbers, smiling or talking, and a girl holding a black-and-white dog.]
USING GRAMMAR
Prepositions of place
10 Schau dir das Bild an und vervollständige die Sätze.
1 Where is the frog?
It’s __________________ the bus.
2 Where are the penguins?
They’re __________________ the bus.
3 Where are the monkeys?
They’re __________________ the bus.
4 Where is the giraffe?
It’s __________________ the bus.
5 Where is the dog?
It’s __________________ the bus.
6 Where are the cats?
They’re __________________ the bus.
[Image description: A red bus driving through a park. Monkeys are on top of the bus, penguins are inside, a frog is under the bus, a giraffe is next to the bus, cats are in front of the bus, and a dog is behind the bus.]
READING & WRITING
Where things are / About yourself and others
11 Schreib Sätze über die Kinder.
Aileen
11 / Cambridge / 7A
Aileen is eleven. She is from Cambridge. She is in class 7A.
Mark
10 / Manchester / 6B
Mark ______________________________________________
Kylie
13 / London / 9B
Kylie _____________________________________________
Jenny and Omar
12 / Liverpool / 8C
Jenny and Omar ____________________________________
Amrita and Rajit
11 / Bradford / 7C
Amrita and Rajit ___________________________________
12 Schreib einen Text über dich.
I’m ____________________________ . (name)
I’m ____________________________ . (how old)
I’m from ________________________ .
I’m in __________________________ . (your class)
VOCABULARY: how old – wie alt
13 Bring den Dialog in die richtige Reihenfolge. Setze die Zahlen 1–6 ein. Höre dir den Dialog an und überprüfe deine Arbeit.
☐ Aaaah! A cat! Help!
☐ And there’s a cat behind you.
☐ There’s a frog on the sofa.
☐ Cool. I love dogs.
☐ Great. I love frogs.
☐ There’s a dog next to the chair.
14 Bring den Dialog in die richtige Reihenfolge. Setze die Zahlen 1–7 ein. Höre dir den Dialog an und überprüfe deine Arbeit.
☐ A OK.
☐ B Next to the giraffe?
☐ A There’s a frog on the giraffe!
☐ B I can’t see a frog on the giraffe. Where is it?
☐ A Yes … Ah, now it’s behind the giraffe.
☐ A Now it’s next to the giraffe.
☐ B I can’t see it. Let’s go and see the lions.
Page 20–21
15 Schau dir das Bild an. Schreib so viele Sätze mit there is / there are wie du kannst. Schreib auch, wo sich die Gegenstände/Tiere befinden.
[Image description: A classroom with desks, children, backpacks, books, scissors, a computer, a teacher at the door, and animals hidden under desks.]
16 Schau dich in deinem Zimmer um. Versuche so viele Sätze wie nur möglich über dein Zimmer zu schreiben, die mit There is / There are beginnen.
LISTENING
Understanding others talking about themselves
17 Höre dir den Text an und ergänze die Sätze.
1 Ellie is from _______________________________.
2 She is _______________________________ years old.
3 She is at the _______________________________.
VOCABULARY: lots – viel/e; funny – lustig
18 Höre dir den Text nochmal an und hake T (True/richtig) oder F (False/falsch) an.
1 Ellie’s brother likes the train. T ☐ F ☐
2 Ellie’s favourite animals are the monkeys. T ☐ F ☐
3 Ellie has a dog. T ☐ F ☐
4 Ellie’s mother likes the giraffes. T ☐ F ☐
5 Ellie’s father likes the parrots. T ☐ F ☐
6 There are yellow birds at the wildlife park. T ☐ F ☐
Page 20–21
WORD FILE
At the wildlife park
tree
monkey
parrot
giraffe
train
penguin
guide
lion
[Image description: A big picture of a wildlife park. A monkey is on a tree branch with a large parrot behind it. A giraffe stands in the background. A blue train with people inside is driving along tracks. Penguins are near icy rocks and water. A guide stands with two children. A lion is lying in the front.]
Prepositions of place
next to
in
behind
under
on
in front of
[Image description: Six small pictures show a cat and a bowl of red yarn balls to demonstrate prepositions: the cat is next to the bowl, in the bowl, behind the bowl, under the bowl, on the bowl, and in front of the bowl.]
MORE Words and Phrases
zoo — There are many animals in the zoo. — Zoo
1
beautiful — The parrot is blue and yellow. It’s beautiful. — schön, hübsch
behind — The chair is behind the desk. — hinter
big — There’s a big giraffe. — groß
in front of — The tree is in front of you. — vor
next to — The parrot is next to the monkeys. — neben
now — Where is it now? — jetzt
on — Look! The parrot is on Buddy now. — auf
there is (there’s) — There’s a book on my desk. — es gibt, da ist
there are — There are three books on my desk. — es gibt, da sind
tree — The monkeys are behind the tree. — Baum
under — There’s a book under my desk. — unter
What is it? — — Was ist los?
where — Where is it? — wo
2
small — The monkey isn’t big. It’s small. — klein
4
adult — Adults are €14.40. — Erwachsene/r
at — The children are at the zoo. — bei; an; hier: in
to bring — Can I bring my dog, Buddy? — (mit-)bringen
but — Dogs are welcome. But they can’t run around. — aber
to feed — Let’s go and feed the penguins. — füttern
guide — Listen to the guide. — (Reise-)Führer/in
to run around — Dogs are welcome, but they can’t run around. — herumlaufen
train — Let’s go on a train. — Zug
to — Welcome to the wildlife park! — zu; bis; vor; hier: in
welcome — Welcome to London. — willkommen
6
from — They are from California. — aus
year — I’m in Year 7. — Jahr; Jahrgangsstufe
7
he — He likes animals. — er
she — She is from England. — sie
to talk — Talk about the boys and girls. — sprechen, sich unterhalten
they — Rahim and Sue are 11. They are from Manchester. — sie
we — We’re Sophie and John. — wir
9
for — Here’s a chant for you. — für
happy — Buddy is happy. — glücklich, fröhlich; zufrieden
to let somebody out — Let us out! — jemanden herauslassen
us — Can you see us? — uns
10
car — The parrot is in the car. — Auto
S1
At last. — — Endlich.
How strange! — — Wie komisch!
Let me see. — — Lass mich mal schauen.
stone — Colour your stone. — Stein

```

## Output contract

Write `content/corpus/units/g1-u02/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u02",
  "briefBank": "8964a98699d2",
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
