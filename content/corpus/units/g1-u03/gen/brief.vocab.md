# Vocab generation brief — g1-u03 (MORE! 1, Unit 3)

<!-- domigo:gen vocab g1-u03 bank=4c3046921b06 prompt=346902f9f0f1 -->

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
| g1u03.w.finger | finger | Finger | wordfile | — | — | — | finger |
| g1u03.w.ear | ear | Ohr | wordfile | — | — | — | ear |
| g1u03.w.nose | nose | Nase | wordfile | — | — | — | nose |
| g1u03.w.hair | hair | Haar(e) | wordfile | — | — | — | hair |
| g1u03.w.eye | eye | Auge | wordfile | — | — | — | eye |
| g1u03.w.mouth | mouth | Mund | wordfile | — | — | — | mouth |
| g1u03.w.beard | beard | Bart | wordfile | — | — | — | beard |
| g1u03.w.right-arm | right arm | rechter Arm | wordfile | — | — | — | right arm |
| g1u03.w.left-arm | left arm | linker Arm | wordfile | — | — | — | left arm |
| g1u03.w.shoulder | shoulder | Schulter | wordfile | — | — | — | shoulder |
| g1u03.w.leg | leg | Bein | wordfile | — | — | — | leg |
| g1u03.w.foot | foot | Fuß | wordfile | — | — | — | foot |
| g1u03.w.feet | feet | Füße | wordfile | — | — | — | feet |
| g1u03.w.tooth | tooth | Zahn | wordfile | — | — | — | tooth |
| g1u03.w.teeth | teeth | Zähne | wordfile | — | — | — | teeth |
| g1u03.w.tall | tall | groß | wordfile | — | — | — | tall |
| g1u03.w.short | short | kurz ; klein | wordfile | — | — | — | short |
| g1u03.w.big | big | groß | wordfile | — | — | — | big |
| g1u03.w.small | small | klein | wordfile | — | — | — | small |
| g1u03.w.long | long | lang | wordfile | — | — | — | long |
| g1u03.w.also | also | auch | phrase | — | Tamara is also a pirate. | — | also |
| g1u03.w.famous | famous | berühmt | phrase | — | Greybeard is a famous pirate. | — | famous |
| g1u03.w.him | him | ihn | phrase | — | Peter is nice. We like him. | — | him |
| g1u03.w.his | his | sein/e | phrase | — | His pirate name is Blackbeard. | — | his |
| g1u03.w.ship | ship | Schiff | phrase | — | Greybeard has got a big ship. | — | ship |
| g1u03.w.to-be-scared | to be scared (of) | Angst haben (vor) | phrase | — | Tamara is scared of Greybeard. | be scared | to be scared ; be scared ; to be scared of ; be scared of |
| g1u03.w.strong | strong | stark | phrase | — | Greybeard hasn't got a strong left leg. | — | strong |
| g1u03.w.captain | captain | Kapitän/Kapitänin | phrase | — | The captain has got a blue ship. | — | captain |
| g1u03.w.have-got-has-got | have got / has got | haben | phrase | — | I have got brown hair. Tamara has got red hair. | — | have got / has got ; have got ; has got |
| g1u03.w.pretty | pretty | hübsch | phrase | — | Polly is a pretty pirate. | — | pretty |
| g1u03.w.purple | purple | lila ; violett | phrase | — | The parrot is purple. | — | purple |
| g1u03.w.week | week | Woche | phrase | — | Seven days is one week. | — | week |
| g1u03.w.again | again | wieder | phrase | — | Hooray! We won again. | — | again |
| g1u03.w.back | back | zurück | phrase | — | When are they back? | — | back |
| g1u03.w.to-paint | to paint | malen | phrase | — | Let's paint a pirate. | paint | to paint ; paint |
| g1u03.w.sister | sister | Schwester | phrase | — | My sister has got brown hair. | — | sister |
| g1u03.w.boy | boy | Junge ; Bub | phrase | — | The boy has got brown hair. | — | boy |
| g1u03.w.girl | girl | Mädchen | phrase | — | The girl has got blond hair. | — | girl |
| g1u03.w.man | man (pl men) | Mann | phrase | — | The man has got a red beard. | — | man ; men |
| g1u03.w.woman | woman (pl women) | Frau | phrase | — | The woman has got brown hair. | — | woman ; women |
| g1u03.w.her-name-is | Her name is … | Sie heißt … | phrase | — | Her name is Annabelle. | — | Her name is … |
| g1u03.w.his-name-is | His name is … | Er heißt … | phrase | — | His name is Paul. | — | His name is … |

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Box, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Classroom, Dana, Dave, Dialog, Dialoge, Don, England, English, False, Fido, Frank, Fred, Freddy, Good, Gordon, Greybeard, Guess, Homework, Hook, Imperatives, Irregular, Jenny, Julia, Leah, Leo, London, Lucy, Mail, Manchester, Mary, Mike, Nice, Nomen, Number, Numbers, Omar, Peter, Pirates, Plural, Polly, Prepositions, Rajit, Reihenfolge, Ronald, Saying, School, Sue, Tamara, Text, Tick, Tock, True, Welcome, Well, Work, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u03.w.finger` ← v1 `finger`: d="you have ten of them on your hands" · s="She wore a silver ring on her _____, just above her hand." · a=[] · mc=["neck","arm","leg"]
- `g1u03.w.ear` ← v1 `ear`: d="you hear with it" · s="The music is too loud. I cover my _____ with my hands to protect my hearing." · a=["ears"] · mc=["eye","mouth","foot"]
- `g1u03.w.nose` ← v1 `nose`: d="you smell with it" · s="The clown has a big red _____ in the middle of his face that he can honk." · a=[] · mc=["elbow","knee","toe"]
- `g1u03.w.hair` ← v1 `hair`: d="it grows on your head" · s="She has long brown curly _____ down to her shoulders." · a=[] · mc=["nails","teeth","skin"]
- `g1u03.w.eye` ← v1 `eye`: d="you see with it" · s="She has one blue _____ and one green one, and she uses them to see colours." · a=[] · mc=["knee","elbow","finger"]
- `g1u03.w.mouth` ← v1 `mouth`: d="you eat and talk with it" · s="Open your _____ wide and say 'aah' so the doctor can see your throat." · a=[] · mc=["hand","foot","ear"]
- `g1u03.w.beard` ← v1 `beard`: d="hair on a man's chin and cheeks" · s="My grandpa has a long grey _____ on his chin because he never shaves." · a=[] · mc=["wig","scarf","tie"]
- `g1u03.w.right-arm` ← v1 `right arm`: d="the arm on the same side as your right hand" · s="He broke his _____ last week and has a cast from his shoulder to his hand — the one he writes with." · a=[] · mc=["right foot","right knee","right ear"]
- `g1u03.w.left-arm` ← v1 `left arm`: d="the arm on the same side as your left hand" · s="She wears her silver watch on her _____, on the side opposite from her writing hand." · a=[] · mc=["left foot","left ear","left eye"]
- `g1u03.w.shoulder` ← v1 `shoulder`: d="the body part between your neck and arm" · s="The parrot sat on the pirate's _____ just next to his neck and under his ear." · a=[] · mc=["head","knee","finger"]
- `g1u03.w.leg` ← v1 `leg`: d="the body part you walk and stand with" · s="He hurt his _____ in football practice and cannot run today, but he can still walk slowly." · a=[] · mc=["ear","nose","mouth"]
- `g1u03.w.foot` ← v1 `foot`: d="the body part at the end of your leg" · s="I have a brown shoe on my left _____. The other shoe is missing." · a=[] · mc=["ear","nose","eye"]
- `g1u03.w.feet` ← v1 `feet`: d="the plural of foot" · s="My _____ are freezing cold. I need to put on warm woolly socks and slippers." · a=[] · mc=["hands","ears","arms"]
- `g1u03.w.tooth` ← v1 `tooth`: d="a hard white thing in your mouth" · s="My baby sister just got her first white _____ in her lower gum. It is small and sharp." · a=[] · mc=["hair","finger","toe"]
- `g1u03.w.teeth` ← v1 `teeth`: d="the plural of tooth, in your mouth" · s="Brush your _____ every morning and evening with a toothbrush and toothpaste." · a=[] · mc=["hair","ears","nails"]
- `g1u03.w.tall` ← v1 `tall`: d="high, not short, for people" · s="The basketball player is very _____ — about two metres from his feet to his head." · a=[] · mc=["short","thin","wide"]
- `g1u03.w.short` ← v1 `short`: d="not long or not tall" · s="She has _____ hair that only reaches her ears, because she cut it last week." · a=[] · mc=["long","thin","curly"]
- `g1u03.w.also` ← v1 `also`: d="too, as well" · s="Tom can sing very well, and he can _____ play the guitar at the same time." · a=["too"] · mc=["never","only","hardly"]
- `g1u03.w.famous` ← v1 `famous`: d="known by many people" · s="This pop singer is very _____. Millions of people know her name and her songs." · a=[] · mc=["unknown","quiet","secret"]
- `g1u03.w.him` ← v1 `him`: d="a word for a boy or man (object)" · s="Tom is my best friend. I like _____ very much because he is kind to everyone." · a=[] · mc=["her","it","us"]
- `g1u03.w.his` ← v1 `his`: d="belonging to a boy or man" · s="That big brown dog is _____. The boy over there loves his pet very much." · a=[] · mc=["her","my","their"]
- `g1u03.w.ship` ← v1 `ship`: d="a big boat on the sea" · s="The big _____ with white sails sailed across the deep blue sea to America." · a=["boat"] · mc=["train","car","bicycle"]
- `g1u03.w.strong` ← v1 `strong`: d="having a lot of power in your body" · s="He is very _____ and can lift the heavy box with both hands above his head." · a=[] · mc=["weak","small","young"]
- `g1u03.w.captain` ← v1 `captain`: d="the leader of a ship" · s="The _____ of the ship told all the sailors to turn the boat to the left toward the island." · a=[] · mc=["sailor","passenger","cook"]
- `g1u03.w.have-got-has-got` ← v1 `have got`: d="to own or to have something" · s="I _____ two older sisters and one baby brother in my family." · a=["have"] · mc=["don't have","want","need"]
- `g1u03.w.pretty` ← v1 `pretty`: d="nice to look at" · s="What a _____ pink summer dress you are wearing! I love the flower pattern." · a=["beautiful","lovely"] · mc=["ugly","dirty","old"]
- `g1u03.w.purple` ← v1 `purple`: d="a colour, a mix of red and blue" · s="She painted the flowers _____ — the colour you get when you mix red and blue." · a=["violet"] · mc=["yellow","green","orange"]
- `g1u03.w.week` ← v1 `week`: d="seven days" · s="There are seven days — Monday to Sunday — in one _____." · a=[] · mc=["year","month","hour"]
- `g1u03.w.again` ← v1 `again`: d="one more time" · s="I did not hear you clearly. Please say it _____, one more time." · a=[] · mc=["never","once","first"]
- `g1u03.w.back` ← v1 `back`: d="to the place where you were before" · s="School is over for the day. Let's go _____ home to eat dinner." · a=[] · mc=["away","forward","up"]
- `g1u03.w.to-paint` ← v1 `to paint`: d="to make a picture with colours" · s="I like to _____ big pictures of animals with my brush and colours." · a=["draw"] · mc=["to erase","to crumple","to tear"]
- `g1u03.w.sister` ← v1 `sister`: d="a girl who has the same parents as you" · s="My older _____ is twelve years old and she is a girl. We share a bedroom." · a=[] · mc=["brother","father","grandpa"]
- `g1u03.w.boy` ← v1 `boy`: d="a young male person" · s="That _____ over there in the blue T-shirt is my best male friend Tom from class 1A." · a=[] · mc=["girl","woman","grandmother"]
- `g1u03.w.girl` ← v1 `girl`: d="a young female person" · s="That _____ over there with the red hair in pigtails is called Anna. She is in my class." · a=[] · mc=["boy","man","grandfather"]
- `g1u03.w.man` ← v1 `man`: d="an adult male person" · s="The _____ in the blue shirt with short hair and a tie is our male teacher Mr. Smith." · a=[] · mc=["woman","girl","baby"]
- `g1u03.w.woman` ← v1 `woman`: d="an adult female person" · s="The _____ with the long brown hair is my mother. She is about 40 years old." · a=[] · mc=["man","boy","baby"]
- `g1u03.w.her-name-is` ← v1 `Her name is`: d="a phrase telling who a girl or woman is" · s="This is my younger sister. _____ Anna and she is 7 years old." · a=[] · mc=["His name is","My name is","Your name is"]
- `g1u03.w.his-name-is` ← v1 `His name is`: d="a phrase telling who a boy or man is" · s="This is my older brother. _____ Tom and he is 12 years old." · a=[] · mc=["Her name is","My name is","Your name is"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 3- Pirates.txt -----
Page 22
Unit 3: Pirates
At the end of unit 3 ...
you know ☐ 14 words for parts of the body ☐ how to use have got – haven't got ☐ a few irregular plural forms
you can ☐ understand descriptions of people ☐ describe yourself and other people ☐ understand what other people have or haven't got ☐ say what you and other people have or haven't got ☐ use a mind map to write a description of somebody
1 Read and number the pictures.
Pirates of the Caribbean
1 This is Eduard Teach. He's a pirate. His pirate name is Blackbeard. People are very scared of him.
2 Blackbeard has got a ship. It's called Queen Anne's Revenge. It's a big ship. It's 32 metres long. It has got 40 cannons.
3 There is a famous series of pirate films called Pirates of the Caribbean. Blackbeard is also in the films. In the film, Blackbeard has got very long hair.
[Image description: Illustrations showing a Pirates of the Caribbean movie poster, a pirate figure resembling Blackbeard, and a large sailing ship]
VOCABULARY Parts of the body
1/23 🔊 2 Listen and point. Then number the words.
☐ beard ☐ left arm ☐ right leg ☐ fingers ☐ mouth ☐ eyes ☐ nose ☐ tooth/teeth ☐ wooden leg ☐ ear ☐ left foot ☐ feet ☐ left shoulder ☐ hair
[Image description: Illustration of two pirates on a ship deck with numbered body parts 1-14]
Note [Image description: Illustrations showing the difference between long/short and tall/short] long short tall short
Note 1 tooth – 2 teeth 1 foot – 2 feet
🔵 WB p. 22, 23 🌐 CYBER Homework 7 (Revision)
Page 23
LISTENING & SPEAKING Talking about what you have got / haven't got
1/24 🔊 3 Listen to the pirate and tick the correct picture.
Note I've got = I have got
[Image description: Three pirate illustrations numbered 1, 2, and 3 showing different pirate characters with various features]
👥 4 Work in pairs. One of you is Captain Tick and one of you is Captain Tock. Tell your partner what you have got / haven't got.
Captain Tick
I haven't got a red ship. I've got a blue ship.
Captain Tock
[Image description: Maze puzzle connecting Captain Tick and Captain Tock with various pirate-related items including ships, parrot, cat, and dog]
SOUNDS RIGHT /p/
1/25 🔊 5 Listen and repeat.
Purple hair and pink eyes, Polly Pym – the pretty pirate.
[Image description: Illustration of a female pirate character with purple hair]
🔵 WB p. 24, 28 🌐 CYBER Homework 8
Page 24
READING
1/26 🔊 6 a Look and tick.
Dana is ☐ a pirate. ☐ a girl.
b Read the story. Then listen to it.
Dana, the pirate
[Image description: Story panels showing Dana in various pirate-related scenes]
1 This is Dana. Dana loves pirates. She's got a lot of books about pirates.
2 Lots of books.
Zzzzz
3 Dana is in bed now. She is tired. She is very tired.
4 Dana is a pirate. She's got a parrot on her shoulder and she's got a golden tooth in her mouth. And she's got a ship. A big ship.
5 But Dana hasn't got friends. And the pirates haven't got a ship.
Don't look down.
6 Oh, no ...! Dana hasn't got a ship now.
7 [continues scene]
8 It's a dream!
9 Just a dream ...
7 Look at the pictures and answer the questions.
[Image description: Four numbered panels showing key moments from the story]
Note Answer with: Yes, she has. / No, she hasn't.
1 Has Dana got a book? 3 Has Dana got a pirate ship? ................................................. .................................................
2 Has Dana got a wooden leg? 4 Has Dana got a pirate ship? ................................................. .................................................
🔵 WB p. 25, 26, 28
Page 25
LISTENING & SPEAKING Saying what another person has got / hasn't got
1/27 🔊 8 Listen to Matt and Anna play "Guess my pirate". Complete.
1 Matt's pirate is ........................................... . 2 Anna's pirate is ........................................... .
[Image description: Grid of 15 pirate character portraits labeled with names: Alf, Bob, Chris, Dave, Ed, Fred, Greg, Harry, Ian, John, Kev, Liam, Nigel, Mark, Owen]
9 Read and complete.
Boy OK. Has your pirate got a big nose? Girl A big nose? Yes, he's got a big nose. Boy Has he got black hair? Girl No, he hasn't got black hair. He's got grey hair. Boy Has he got a beard? Girl No, he hasn't got a beard. Boy Has he got blue eyes?
Girl His eyes are brown, but he's only got one eye. Boy OK, he's got a big nose. He's got grey hair. He hasn't got a beard and he's got one brown eye. Is your pirate ........................................... ? Girl Yes, he is!
👥 10 In pairs, play "Guess my pirate". Ask questions to find your partner's pirate.
Has your pirate got ...? Yes, he's got ... / No, he hasn't got ... Is your pirate ...? He's got a ... Yes, he is. / No, he isn't.
🔵 WB p. 25
Page 26
11 C H O I C E S
A Read and look at the picture to find the two mistakes. Say what's wrong.
This is Tamara the Terrible. She is tall. She has got red hair. She hasn't got a big nose. She has got blue eyes. She has got a pelican, Trevor. Trevor hasn't got a real left leg. He has got a wooden left leg.
[Image description: Illustration of a female pirate character with a pelican]
B Read the texts and look at the pictures. How many mistakes can you find?
This is Greybeard the Great. He is short. He has got a black beard. He has got grey hair. He has got one green eye. He hasn't got a left ear. He hasn't got a strong left leg. He has got a wooden left leg. He has got a small blue nose. He has got a dog.
[Image description: Illustration of a pirate character labeled Greybeard]
Fred and Frank are brothers. Fred has got a pelican on his right shoulder, and Frank has got a pelican on his left shoulder. Fred has got a brown beard. Frank hasn't got a beard. They've got blonde hair. Frank has got a small nose. Fred has got a wooden leg.
[Image description: Illustration of two pirates labeled Fred and Frank with pelicans]
A SONG 4 U
1/28+29 🔊 12 Listen and sing.
The pirate song
[Image description: Comic-style illustrations of pirates and pirate-related imagery]
Ho, ho, hey, hey! Ho, ho, hey, hey! Hey, ho, this is the pirate song. Hey, ho, and here we go:
A cutlass* swings. A pirate sings. Ho, ho, hey, hey! Ho, ho, hey, hey! We're pirates – yes! The very best. Ho, ho, hey, hey! Ho, ho, hey, hey!
We're ready for action. Let's go on a trip. We're ready for action. Let's board the ship.
Ho, ho, hey, hey! Ho, ho, hey, hey! A cannonball*. The pirates call. Ho, ho, hey, hey! Ho, ho, hey, hey! We're pirates true. And we want you! Ho, ho, hey, hey! Ho, ho, hey, hey!
We're ready for action. Let's go on a trip. We're ready for action. Let's board the ship.
Ho, ho, hey, hey! Ho, ho, hey, hey! Hey, ho, this is the pirate song. Hey, ho, and here we go.
VOCABULARY: *cutlass – Piratensäbel; cannonball – Kanonenkugel
🔵 WB p. 26, 27
Page 27
WRITING
13 Look at the mind map. Use it to write a short text about a pirate (40–50 words).
[Image description: Mind map showing "Captain Hook" in the center with connected bubbles: "very strong" - "is" - "hasn't got" - "a cat"; "a big nose" - "has got" - "a hook" - "left arm" - "a wooden leg"; "brown hair" - "brown eyes" - "a dog" - "a cutlass"]
This is Captain Hook, the pirate. He has got brown hair and brown eyes ...
GRAMMAR
▶️ have got – haven't got
[THIS IS TABLE: Three-column table showing positive, negative, and question forms of "have got"] + | – | ? I/You have got a cat. | I/You haven't got a cat. | Have I/you got ...? He/She/It has got a small nose. | He/She/It hasn't got a small nose. | Has he/she/it got ...? We/You/They have got a big ship. | We/You/They haven't got a big ship. | Have we/you/they got ...?
🔍 Setze I haven't got oder I've got ein:
Mithilfe von ¹...................................................... sagst du, dass du etwas hast. Mithilfe von ²...................................................... sagst du, dass du etwas nicht hast.
Note: He has got a cat. = He's got a cat. They have got strong arms. = They've got strong arms. I have not got blue eyes. = I haven't got blue eyes. He has not got a dog. = He hasn't got a dog.
Ooh! You've got strong arms!
[Image description: Cartoon of a pirate flexing muscles]
▶️ Irregular plurals (2)
one foot → two feet one tooth → five teeth
MORE FUN WITH FIDO!
[Image description: Comic strip showing pirates discovering Captain Fido's treasure with speech bubble "Woof! Captain Fido's treasure!"]
⏪ Now go back to page 22. Check ☑ with a partner what you know / can do.
🔵 WB p. 24, 25 🌐 CYBER Homework 9
Page 28
THE TWINS 1
▶️ Feeling bored?
Developing speaking competencies
Language function | Speaking strategy ☐ I can make suggestions (Vorschläge machen) | ☐ I can respond (auf Vorschläge antworten)
VOCABULARY Activities
1/30 🔊 1 Write the activities under the pictures. Then listen and check.
go to the cinema go shopping go bowling go swimming go skateboarding go to the theme park
[Image description: Six photographs showing different activities numbered 1-6]
1 ..................................................... 2 ..................................................... 3 .....................................................
4 ..................................................... 5 ..................................................... 6 .....................................................
1/31 🔊 2 Watch or listen to the dialogue. Then read it. What activities does Lucy suggest?
▶️
Leo I'm bored. Lucy Me too. Let's do something. Leo Good idea. But what? Lucy Let's go swimming. Leo Swimming? No, I hate swimming. Lucy OK, we could go shopping. Leo Boring. Lucy OK, no swimming, no shopping. I know! Let's go to the cinema. Leo The cinema?
[Image description: Photograph showing two people in a bedroom setting]
Lucy Yes, there's a great new pirate film at the Odeon. Leo No, I hate pirates. Lucy I give up!
Page 29
3 Read and circle T (True) or F (False).
[Image description: Two photographs of children labeled Lucy and Leo with speech bubbles]
1 I'm bored. T / F
2 Let's go to the cinema. T / F
3 Swimming is a bad idea. T / F
4 A pirate film? No, thanks! T / F
USEFUL PHRASES Making suggestions
4 Write the words in the correct order to make sentences.
1 shopping / we / go / could We could go shopping. 2 swimming / go / let's .....................................................................................................
? What do you think? Complete the sentence.
Lucy and Leo go .......................................................................................................................................
MOBILE HOMEWORK
▶️ Watch part 2 of the video and check your answer.
SPEAKING STRATEGY Responding
5 Look at the responses. Draw ☺ or ☹ next to each one.
Boring. ☐ Good idea! ☐ I love swimming. ☐ I hate swimming. ☐
6 C H O I C E S
👥 A Work in pairs.
A Suggest an activity from 1. → B Respond.
A Let's go swimming. B Good idea!
👥 B ROLE PLAY: Work in pairs. Look at your role card and act out.
Student A You are bored. Tell student B and suggest: • go to the cinema • go to the theme park • go skateboarding • go shopping • go swimming • go bowling
Student B You are bored. Listen to student A's suggestions and respond: • the cinema – • skateboarding – • swimming – • bowling – • the theme park – • shopping –
🔵 WB p. 28


----- WB: WB Unit 3 Pirates.txt -----
Unit 3 Pirates
Page 22–23
UNDERSTANDING VOCABULARY
Parts of the body / Pirates
1 Kreise die restlichen 12 Wörter für die Körperteile ein (→). Dann schreib sie auf.
L E G H B E A R D D
D N M H U L F I M F
S H O U L D E R Y O
O L U O A F H Y W O
A D T T T X F E E T
R A H H O W D P A A
M E T N O S E J R Y
N Y Q H T Y M F P F
T E E T H S H A I R
……………………………… leg
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
2 Kreise die Wörter ein und schreib sie auf.
hookshippiratewoodenlegtreasuresea
[Image description: A cartoon pirate with a hook for a hand stands on a beach. He has a parrot on his shoulder. A pirate ship with a skull flag is in the sea behind him. A treasure chest full of gold is open on the sand. Numbers 1–6 point to different objects.]
1 …………………………
2 …………………………
3 …………………………
4 …………………………
5 …………………………
6 …………………………
3 Schau dir das Bild an und schreib die Zahlen in die Kästchen.
□ big
□ small
□ tall
□ short
□ long
□ short
[Image description: Two cartoon pirates of different sizes. Numbers 1–6 are placed next to body parts and animals to compare size and length.]
USING VOCABULARY
Parts of the body
4 Schreib die richtigen Wörter.
[Image description: A pirate girl stands on an island holding a map. Numbers 1–11 point to parts of her body.]
1 …………………………
2 …………………………
3 …………………………
4 …………………………
5 …………………………
6 …………………………
7 …………………………
8 …………………………
9 …………………………
10 …………………………
11 …………………………
5 Schau dir das Bild an und schreib die richtigen Wörter aus 3.
[Image description: Two pirates and two monkeys. Numbers 1–6 point to different characters.]
1 …………………………
2 …………………………
3 small
4 …………………………
5 …………………………
6 …………………………
Page 24–25
UNDERSTANDING GRAMMAR
have got – haven’t got
6 Schau dir die Bilder an und kreise in jedem Satz die richtige Form ein.
[Image description: Six small pictures showing people, animals and objects.]
1 He hasn’t / haven’t got long hair.
2 She hasn’t / haven’t got a car.
3 It hasn’t / haven’t got legs.
4 I hasn’t / haven’t got a computer.
5 We hasn’t / haven’t got a big house.
6 He hasn’t / haven’t got apples. He’s got bananas.
USING GRAMMAR
have got – haven’t got
7 Schau dir die Bilder an und schreib die Sätze.
1 She / red hair
She’s got red hair.
2 They / new car
……………………………………
3 You / laptop
……………………………………
4 We / big feet
……………………………………
5 He / dog
……………………………………
6 I / a skateboard
……………………………………
8 Bring die Wörter in die richtige Reihenfolge und schreib die Fragen.
1 got / a / has / pen? / he
Has he got a pen?
2 they / laptop? / got / have / a
……………………………………
3 you / problem? / have / a / got
……………………………………
4 green / got / she / eyes? / has
……………………………………
5 you / have / a / dog? / big / got
……………………………………
6 he / hair? / long / got / has
……………………………………
7 she / hair? / got / red / has
……………………………………
8 house / your / garage? / a / got / has
……………………………………
9 Schreib die Antworten.
1 Has Ronald got black hair? (✗)
No, he hasn’t.
2 Have you got a dog? (✓)
Yes, I have.
3 Has Aileen got a cat? (✗)
……………………………………
4 Have they got a computer in their house? (✗)
……………………………………
5 Have they got hamburgers in this restaurant? (✓)
……………………………………
6 Has the house got a garage? (✓)
……………………………………
10 Schreib die Antworten.
1
A Has Peter got a cat?
B Yes, he has. It’s black and white.
2
A Have they got black hair?
B ………………………… It’s brown.
3
A Has Mary got a laptop?
B ………………………… – and it’s new!
4
A Have you got a new teacher?
B ………………………… – she’s great!
5
A Have we got apples?
B ………………………… . We’ve got bananas!
11 Wer hat was? Schreib die Sätze.
[Image description: Seven children named Sheila, Mary, Aylin, James, Ken, Julia, Marcus. Lines connect them to objects: a ship, a laptop, a hat, an apple, a cat, a ball, a crocodile.]
Sheila has got a cat.
……………………………………
……………………………………
……………………………………
……………………………………
……………………………………
12 Beantworte die Fragen zu deiner Person.
Have you got long hair? …………………………
Have you got short hair? …………………………
Have you got blue eyes? …………………………
Have you got brown eyes? …………………………
Have you got a sister? …………………………
Have you got a brother? …………………………
Have you got a cat? …………………………
Have you got a tablet? …………………………
13 Schreib einen kurzen Text über dich selbst.
Hello, my name is ……………………………………… .
I have got ……………………………………… .
I haven’t got ……………………………………… .
Page 26–27
14 Mal die Piraten an. Beschreibe Ruby und Ronald.
[Image description: Two black-and-white drawings. Ruby is a female pirate with a hat and a cat on her shoulder. Ronald is a male pirate with a beard, a pipe and a wooden leg.]
READING & WRITING
Understanding what other people have(n’t) got / Describing other people
15 Wer hat was? Hake T (True/richtig) oder F (False/falsch) an.
[Image description: Greybeard, Tamara, Fred and Frank with various objects connected by lines.]
1 Tamara has got a lot of books. T ☐ F ☐
2 Tamara has got a small crocodile. T ☐ F ☐
3 Tamara has got a laptop. T ☐ F ☐
4 Greybeard hasn’t got a bed. T ☐ F ☐
5 Greybeard has got a big ice cream. T ☐ F ☐
6 Fred and Frank have got two monkeys. T ☐ F ☐
7 Fred and Frank haven’t got a laptop. T ☐ F ☐
8 Fred and Frank have got lots of books. T ☐ F ☐
16 CHOICES
A Lies die Texte und ordne sie den Bildern zu. Mal dann die Bilder an.
1
2
3
Steve is 13 years old. He’s from Chicago.
He has got short brown hair and blue eyes.
He has got a small mouth and a small nose.
Sara is 13 years old. She’s from Berlin.
She has got short blonde hair and blue eyes.
She has got a big mouth and a small nose.
Mel is 12 years old. She is from London.
She has got long brown hair and green eyes.
She has got a small mouth and a big nose.
B Schreib über einen Freund / eine Freundin.
My friend ……………………………………… is ……………………………………… .
He/She is from ……………………………………… .
He/She has got ……………………………………… .
He/She has got a ……………………………………… .
17 Bring die Dialoge in die richtige Reihenfolge. Dann höre dir die Dialoge an und überprüfe deine Arbeit.
DIALOGUE 1
☐ A How old is he?
☐ A Have you got a brother?
☐ A What’s his name?
☐ B He’s 12.
☐ B Peter.
☐ B Yes, I have.
DIALOGUE 2
☐ A What’s its* name?
☐ A Have you got a dog?
☐ A Blackie, hmm. What colour is it?
☐ A And how old is it?
☐ B It is black.
☐ B Yes, we have.
☐ B Erm – eight.
☐ B Blackie.
Page 28–29
LISTENING
Understanding what other people have got
18 Höre dir die Gedichte an und ergänze die Namen.
Belinda
Pat
Lucinda
Ben
[Image description: Four pirates on a ship. Numbers 1–4 mark each character.]
1 …………………………
2 …………………………
3 …………………………
4 …………………………
DIALOGUE WORK
Making and responding to suggestions
19 Bring die Sätze in die richtige Reihenfolge. Dann höre dir den Dialog an und überprüfe deine Arbeit.
Ben No, I hate skateboarding. Let’s go bowling.
Ben No, I hate pirate films. We could go swimming.
Ben Let’s go shopping.
Ben OK, let’s go to the swimming pool then.
Ben Is there a good film on?
Mia Yes, a pirate film.
Mia No, I hate shopping. Let’s go skateboarding.
Mia Yes, swimming is a good idea.
Mia No, I hate bowling. Let’s go to the cinema.
20 Ordne jeweils zwei Sätze einander zu. Setze die Zahlen 1–6 ein.
1 I’m bored.
2 There’s a pirate film at the Roxy.
3 We could go shopping.
4 Let’s do something.
5 Let’s go to the cinema.
6 We could go swimming.
☐ Pirates are boring.
☐ OK, but what?
☐ Good idea. What film is on?
☐ Me too.
☐ Yes, I love swimming.
☐ Good idea. I like shopping.
Page 30
WORD FILE
The body
[Image description: A cartoon man with labels pointing to body parts.]
finger
ear
nose
hair
eye
mouth
beard
right arm
left arm
shoulder
leg
foot
feet
[Image description: A tooth and teeth.]
tooth
teeth
[Image description: Animals showing size and length.]
tall
short
big
small
short
long
MORE Words and Phrases
also – Tamara is also a pirate.
famous – Greybeard is a famous pirate.
him – Peter is nice. We like him.
his – His pirate name is Blackbeard.
ship – Greybeard has got a big ship.
to be scared (of) – The kids are scared of the ship.
very – They are very scared.
strong – Greybeard hasn’t got a strong left leg.
captain – The captain has got a blue ship.
have got / has got – I have got brown hair. Tamara has got red hair.
pretty – Polly is a pretty pirate.
purple – She has got purple hair.
a lot of / lots of – She has got a lot of books about pirates.
bed – Dana is in bed now.
dream – It’s a dream!
tired – Dana is in bed. She is tired.
to guess – Listen and guess the pirate.
It’s your turn.
brother – Fred is Frank’s brother.
blonde – He has got blonde hair.
real – His left leg isn’t real. It’s wooden.
short – Greybeard is short.
tall – Tamara is tall.
wrong – Say what’s wrong.
true – Is it true?

```

## Output contract

Write `content/corpus/units/g1-u03/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u03",
  "briefBank": "4c3046921b06",
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
