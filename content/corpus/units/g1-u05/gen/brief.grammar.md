# Grammar generation brief — g1-u05 (MORE! 1, Unit 5)

<!-- domigo:gen grammar g1-u05 bank=22c58d7186e1 prompt=4b9164076103 -->

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

<!-- domigo:prompt gen-grammar v=1 -->
# Grammar item generation

Produce grammar items for the unit's structures (listed in the brief with their SB
grammar-box evidence and v1 seed items). Obligations per structure:

- **Volume:** at least the v1 floor stated in the brief; aim for the floor + ~20%.
- **Formats:** ≥3 distinct formats per structure; prefer ≥5 when the structure supports
  them. Match format to what the structure naturally exercises (the v1 format mix is a
  hint, not a law).
- **Difficulty spread:** items at difficulty 1, 2 AND 3 (recognition → guided → free).
- **Unit theme:** carriers should live in the unit's world (the transcript's topics,
  characters, situations) — items feel like the textbook, not like a worksheet from
  nowhere.

Per-format data contract (fields not listed stay empty/null):

- `gap-fill` (gf): prompt with 1–2 `___` blanks; answers = full fills (+ partial).
- `multiple-choice` (mc): prompt usually with one `___`; answers = the correct
  option(s); `distractors` = exactly 3 wrong in-bank options; `gameMeta` REQUIRED
  (pool ≥4).
- `context-picker` (cp): prompt = a short context; answers = the one correct SENTENCE;
  `distractors` = 3 wrong sentences (each flawed in exactly the structure under test);
  `gameMeta` REQUIRED.
- `translation` (tr): `direction` REQUIRED. deToEn: prompt German (du-form), answers
  English. enToDe: prompt English, answers German. Tiered both ways.
- `error-correction` (ec): prompt = one sentence containing exactly ONE error in the
  target structure; answers = the corrected sentence (full; also accept the corrected
  fragment alone as partial).
- `transformation` (tf): prompt = source sentence + trigger in parentheses; answers =
  transformed sentence.
- `question-formation` (qf): prompt = chips/statement; answers = the question.
- `free-form` (ff): prompt = a situation; answers = model answers (full) + looser
  acceptable ones (partial). Use sparingly — hardest to grade.
- `sentence-building` (sb): prompt = shuffled chips joined with " / "; answers = the
  sentence(s). Chip count (answer tokens + distractor chips) ≤ 12; `gameMeta` REQUIRED
  with `chipBudget`.
- `matching` (mt): 3–6 pairs (sentence halves, question↔answer) — English↔English;
  prompt = a one-line framing (no instructions).
- `anagram` (ag): answers = exactly one single word; prompt = a du-form German cue or
  English context line.
- `group-sort` (gs): ≥2 groups with ≥2 members each, label = category, members =
  English words/sentences; prompt = one-line framing.
- `matching-pairs` (mp): 4–8 pairs, English↔English.

Every item: `structureId` from the brief, honest `difficulty`, `hintDe` (du-form nudge,
light German grammar terms allowed), `explainDe` (1–2 sentence du-form explanation of
WHY, shown after a wrong answer), `seedV1` = the v1 item id you mined (or null),
`sbRef` = transcript evidence if the carrier comes from the book.

## Structures of this unit

### `g1u05.s.can` — can / can't (can / can't – können)

Expressing ability with the modal verb can / can't + base verb (same for all persons).

v1 floor for this structure: **21 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [can-affirmative]: Use can + base verb to say someone is able to do something. can is the same for all persons (no -s for he/she/it) and is always used with a main verb.
  - DE: Mit can + Grundform sagst du, dass jemand etwas kann. can ist für alle Personen gleich (kein -s bei he/she/it) und steht immer mit einem Vollverb.
  - "James can sing." — "James kann singen."
  - "She can play the guitar." — "Sie kann Gitarre spielen."
- rule [can-negative]: The negative is can't (cannot) + base verb.
  - DE: Die Verneinung lautet can't (cannot) + Grundform.
  - "The dog can't sing." — "Der Hund kann nicht singen."
  - "He can't ride a bike." — "Er kann nicht Rad fahren."

common errors:
- Adding -s to can for he/she/it.: ✗ "She cans swim very well." → ✓ "She can swim very well."
- Adding to after can.: ✗ "I can to swim." → ✓ "I can swim."
- Using don't can instead of can't.: ✗ "I don't can swim." → ✓ "I can't swim."

SB box `g1/sb/SB Unit 5- This is our band.txt#grammar-1` — ▶️ Possessives (besitzanzeigende Fürwörter):
```
Mithilfe der Wörter my, your, his, her usw. kannst du ausdrücken, zu wem etwas gehört.
I – my This is my sister Jessica. you – your What's your name? – I'm James. he – his His name's Jack. she – her Her name's Ellie. it – its This is a new band. Its name is Project 11. we – our We are Dan and Steve. And this is our dog. you – your Dan and Steve, your guitars are great! they – their Dan and Steve are brothers. Their dog is Bacon.
This elephant can wiggle its ears.
[Image description: Cartoon of an elephant wiggling its ears]
▶️ can – can't 🔍 Lies die Beispielsätze links. Setze dann can oder can't ein:
James can sing. The dog can't sing.
Mithilfe des Wortes ¹........................ sagst du, dass jemand etwas kann. Mithilfe des Wortes ²........................ sagst du, dass jemand etwas nicht kann.
```

v1 seed items (UNTRUSTED):
- `m1-u5-can-gf-001` [gap-fill, d1]: p="I ___ (can / swim) very well." c="can swim" a=["can swim"] ds=["can to swim","can swims","cans swim"]
- `m1-u5-can-gf-002` [gap-fill, d1]: p="She ___ play the guitar.." c="can" a=["can"] ds=["cans","can to","is can"]
- `m1-u5-can-gf-003` [gap-fill, d2]: p="My little brother ___ (not / can / ride) a bike yet." c="can't ride" a=["can't ride","cannot ride"] ds=["don't can ride","can't rides","doesn't can ride"]
- `m1-u5-can-gf-004` [gap-fill, d3]: p="___ your sister ___ (can / speak) French?" c="Can ... speak" a=["Can ... speak","Can your sister speak"] ds=["Does ... can speak","Can ... speaks","Is ... can speak"]
- `m1-u5-can-gf-005` [gap-fill, d4]: p="He ___ (can / run) fast, but he ___ (not / can / swim)." c="can run ... can't swim" a=["can run ... can't swim","can run ... cannot swim"] ds=["cans run ... can't swim","can runs ... don't can swim","can run ... doesn't can swim"]
- `m1-u5-can-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="She can play the piano." a=["She can play the piano."] ds=["She cans play the piano.","She can plays the piano.","She can to play the piano."]
- `m1-u5-can-mc-002` [multiple-choice, d3]: p="Which is the correct negative sentence?" c="I can't dance very well." a=["I can't dance very well."] ds=["I don't can dance very well.","I no can dance very well.","I can't to dance very well."]
- `m1-u5-can-mc-003` [multiple-choice, d4]: p="Which question is correct?" c="Can they speak English?" a=["Can they speak English?"] ds=["Do they can speak English?","Can they speaks English?","Are they can speak English?"]
- `m1-u5-can-ec-001` [error-correction, d2]: p="Find and fix the mistake: He cans ride a bike." c="He can ride a bike." a=["He can ride a bike.","can"] ds=[]
- `m1-u5-can-ec-002` [error-correction, d3]: p="Find and fix the mistake: I can to speak English and German." c="I can speak English and German." a=["I can speak English and German."] ds=[]
- `m1-u5-can-ec-003` [error-correction, d3]: p="Find and fix the mistake: She don't can cook." c="She can't cook." a=["She can't cook.","She cannot cook.","can't","cannot"] ds=[]
- `m1-u5-can-tf-001` [transformation, d2]: p="Your little brother says he can dance, but he really can't! Make this sentence negative: I can dance. → I ___." c="can't dance" a=["can't dance","cannot dance","I can't dance.","I can't dance","I cannot dance."] ds=[]
- `m1-u5-can-tf-002` [transformation, d3]: p="You want to find out if Tom can play chess for the school team. Make this a question: Tom can play chess. → ___ Tom ___?" c="Can Tom play chess?" a=["Can Tom play chess?","Can Tom play chess? Tom Can Tom play chess??","Can Tom play chess? Tom Can Tom play chess?","Can Tom play chess? Tom Can Tom play chess?","Can Tom play chess? Tom Can Tom play chess"] ds=[]
- `m1-u5-can-tr-001` [translation, d2]: p="🇩🇪 Mein Bruder kann gut Fussball spielen." c="My brother can play football well." a=["My brother can play football well.","My brother can play soccer well."] ds=[]
- `m1-u5-can-tr-002` [translation, d3]: p="🇩🇪 Kannst du Klavier spielen?" c="Can you play the piano?" a=["Can you play the piano?","Can you play piano?"] ds=[]
- `m1-u5-can-sb-001` [sentence-building, d2]: p="Put the words in the correct order: ride / she / a bike / can" c="She can ride a bike." a=["She can ride a bike."] ds=[]
- `m1-u5-can-mt-001` [matching, d2]: p="Match the sentence halves: 1) She can  2) Can you  3) They can't  4) I can't — a) play chess?  b) come tomorrow.  c) sing very well.  d) ride a horse." c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"b\",\"4\":\"d\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"b\",\"4\":\"d\"}"] ds=[]
- `m1-u5-can-qf-001` [question-formation, d3]: p="Your friend swims well. Ask about his/her ability: ___ ?" c="Can you swim?" a=["Can you swim?","Can you swim well?"] ds=[]
- `m1-u5-can-ff-001` [free-form, d2]: p="Your friend says she can swim, but you can't. Make it negative: I can swim. → I ___ swim." c="can't" a=["can't","cannot","can not","I can't swim","I can't swim.","I cannot swim","I cannot swim."] ds=[]
- `m1-u5-can-ff-002` [free-form, d3]: p="Make it a question: She can play the guitar. → ___ the guitar?" c="Can she play" a=["Can she play","Can she play the guitar","Can she play the guitar?"] ds=[]
- `m1-u5-can-gs-001` [group-sort, d2]: p="Sort: can (ability) or can't (no ability)?" c="{\"can\":[\"swim well\",\"speak English\",\"ride a bike\",\"play guitar\"],\"can't\":[\"fly\",\"drive a car\",\"speak Chinese\",\"cook\"]}" a=[] ds=[]

### `g1u05.s.possessives` — Possessives (possessive adjectives) (Possessivbegleiter (besitzanzeigende Begleiter))

Words that go before a noun to show who something belongs to: my, your, his, her, its, our, their.

v1 floor for this structure: **22 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [possessives-list]: Possessives go before a noun and show who something belongs to: my, your, his, her, its, our, their.
  - DE: Possessivbegleiter stehen vor dem Nomen und zeigen, wem etwas gehört: my, your, his, her, its, our, their.
  - "This is my sister Jessica." — "Das ist meine Schwester Jessica."
  - "Her name's Ellie." — "Ihr Name ist Ellie."
  - "Their dog is Bacon." — "Ihr Hund heißt Bacon."
- rule [possessives-its-vs-its]: its (no apostrophe) = belonging to it; it's (with apostrophe) = it is.
  - DE: its (ohne Apostroph) = sein/ihr (Besitz); it's (mit Apostroph) = it is.
  - "This elephant can wiggle its ears." — "Dieser Elefant kann mit seinen Ohren wackeln."
  - "It's a new band." — "Es ist eine neue Band."

common errors:
- Using a subject pronoun instead of a possessive.: ✗ "This is he book." → ✓ "This is his book."
- Writing it's when you mean the possessive its.: ✗ "The cat loves it's toy." → ✓ "The cat loves its toy."

SB box `g1/sb/SB Unit 5- This is our band.txt#grammar-1` — ▶️ Possessives (besitzanzeigende Fürwörter):
```
Mithilfe der Wörter my, your, his, her usw. kannst du ausdrücken, zu wem etwas gehört.
I – my This is my sister Jessica. you – your What's your name? – I'm James. he – his His name's Jack. she – her Her name's Ellie. it – its This is a new band. Its name is Project 11. we – our We are Dan and Steve. And this is our dog. you – your Dan and Steve, your guitars are great! they – their Dan and Steve are brothers. Their dog is Bacon.
This elephant can wiggle its ears.
[Image description: Cartoon of an elephant wiggling its ears]
▶️ can – can't 🔍 Lies die Beispielsätze links. Setze dann can oder can't ein:
James can sing. The dog can't sing.
Mithilfe des Wortes ¹........................ sagst du, dass jemand etwas kann. Mithilfe des Wortes ²........................ sagst du, dass jemand etwas nicht kann.
```

v1 seed items (UNTRUSTED):
- `m1-u5-possessive-adjectives-gf-001` [gap-fill, d1]: p="Maria loves ___ (she) cat very much." c="her" a=["her"] ds=["she","his","hers"]
- `m1-u5-possessive-adjectives-gf-002` [gap-fill, d2]: p="Tom is in ___ (he) room." c="his" a=["his"] ds=["he","her","him"]
- `m1-u5-possessive-adjectives-gf-003` [gap-fill, d2]: p="We love ___ (we) school." c="our" a=["our"] ds=["we","their","us"]
- `m1-u5-possessive-adjectives-gf-004` [gap-fill, d3]: p="The cat is playing with ___ (it) ball." c="its" a=["its"] ds=["it's","his","it"]
- `m1-u5-possessive-adjectives-gf-005` [gap-fill, d3]: p="Anna and Ben walk to school with ___ (they) friends." c="their" a=["their"] ds=["they","there","them"]
- `m1-u5-possessive-adjectives-mc-001` [gap-fill, d1]: p="Choose the correct sentence: Tom has got a dog. ___ dog is brown." c="His dog is brown." a=["His dog is brown."] ds=["He dog is brown.","Him dog is brown.","Her dog is brown."]
- `m1-u5-possessive-adjectives-mc-002` [multiple-choice, d3]: p="Choose the correct sentence about a cat and a toy:" c="The cat likes its toy." a=["The cat likes its toy."] ds=["The cat likes it's toy.","The cat likes his toy.","The cat likes her toy."]
- `m1-u5-possessive-adjectives-mc-003` [multiple-choice, d4]: p="Lisa and Max are here. ___ mum is a teacher." c="Their mum is a teacher." a=["Their mum is a teacher."] ds=["There mum is a teacher.","They mum is a teacher.","Them mum is a teacher."]
- `m1-u5-possessive-adjectives-ec-001` [error-correction, d2]: p="Find and fix the mistake: She likes he dog very much." c="She likes his dog very much." a=["She likes his dog very much.","his"] ds=[]
- `m1-u5-possessive-adjectives-ec-002` [error-correction, d3]: p="Find and fix the mistake: The dog wags it's tail when it is happy." c="The dog wags its tail when it is happy." a=["The dog wags its tail when it is happy.","its","The dog wags its tail when it's happy."] ds=[]
- `m1-u5-possessive-adjectives-ec-003` [error-correction, d4]: p="Find and fix the mistake: The children are playing in there garden." c="The children are playing in their garden." a=["The children are playing in their garden.","their"] ds=[]
- `m1-u5-possessive-adjectives-tf-001` [transformation, d2]: p="You found a bag and want to return it. Use a possessive adjective. Rewrite: The bag belongs to Lisa. → It is ___ bag." c="her" a=["her","It is her bag.","It is her bag","it's her bag."] ds=[]
- `m1-u5-possessive-adjectives-tf-002` [transformation, d3]: p="Rewrite using a possessive adjective: The bikes belong to Tim and me. → They are ___ bikes." c="our" a=["our","They are our bikes.","They are our bikes","they're our bikes."] ds=[]
- `m1-u5-possessive-adjectives-tr-001` [translation, d2]: p="🇩🇪 Das ist mein Bruder." c="This is my brother." a=["This is my brother.","That is my brother.","that's my brother."] ds=[]
- `m1-u5-possessive-adjectives-tr-002` [translation, d4]: p="🇩🇪 Ihre Schwester spielt Klavier. (= die Schwester von Anna und Sophie)" c="Their sister plays the piano." a=["Their sister plays the piano.","Their sister plays piano."] ds=[]
- `m1-u5-possessive-adjectives-gf-007` [gap-fill, d2]: p="___ name is Tom. He is in my class." c="His" a=["His"] ds=["He","Him","Her"]
- `m1-u5-possessive-adjectives-sb-001` [sentence-building, d2]: p="Put the words in the correct order: is / her / This / bag" c="This is her bag." a=["This is her bag."] ds=[]
- `m1-u5-possessive-adjectives-mt-001` [matching, d1]: p="Match the subject pronoun to the correct possessive adjective: 1) I  2) he  3) she  4) they — a) their  b) my  c) her  d) his" c="{\"1\":\"b\",\"2\":\"d\",\"3\":\"c\",\"4\":\"a\"}" a=["{\"1\":\"b\",\"2\":\"d\",\"3\":\"c\",\"4\":\"a\"}"] ds=[]
- `m1-u5-possessive-adjectives-ec-004` [error-correction, d5]: p="Find and fix the mistake: We like we teacher very much." c="We like our teacher very much." a=["We like our teacher very much.","our"] ds=[]
- `m1-u5-possessive-adjectives-gf-008` [gap-fill, d2]: p="Lisa and Tom love ___ school. It's really great!" c="their" a=["their"] ds=["they","there","them"]
- `m1-u5-possessive-adjectives-mp-001` [matching-pairs, d1]: p="Find the pairs: subject pronoun ↔ possessive adjective." c="[[\"I\",\"my\"],[\"you\",\"your\"],[\"he\",\"his\"],[\"she\",\"her\"],[\"it\",\"its\"],[\"we\",\"our\"]]" a=[] ds=[]
- `m1-u5-possessive-adjectives-gs-001` [group-sort, d2]: p="Sort: subject pronoun or possessive adjective?" c="{\"Subject Pronoun\":[\"I\",\"he\",\"she\",\"we\",\"they\"],\"Possessive Adjective\":[\"my\",\"his\",\"her\",\"our\",\"their\"]}" a=[] ds=[]

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?
- **g1-u05**: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar, boyfriend, its, to play, sister, can, cannot / can't, concert, to dance, Don't worry., job, perfect, to carry, to stand on, tongue, to touch, to walk on, to wiggle, can, to drink, hundred, in one go, Is that so?, This is me., economy, hospital, to laugh, (pocket) money, pound, profit, school canteen, table, teacher, uncle, to wash, nothing, Sorry?

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Bacon, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Classroom, Clown, Dan, Dana, Dave, David, Davis, Dialog, Dialoge, Doctors, Don, Ellie, England, English, False, Fido, Frank, Fred, Freddy, Gina, Good, Gordon, Great, Greybeard, Guess, Harry, Homework, Hook, Imperatives, Irregular, Jack, James, Jamie, Jenny, Jessica, Jill, Julia, Kitty, Leah, Leo, London, Lucy, Mail, Manchester, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Project, Put, Rajit, Reihenfolge, Richard, Ronald, Saying, School, Steve, Sue, Tamara, Text, Tick, Toby, Tock, Tom, True, Welcome, Well, Work, Wortes, Wow, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 5- This is our band.txt -----
Page 38
Unit 5: This is our band
At the end of unit 5 ...
you know ☐ 5 words for musicians and 4 musical instruments ☐ 4 verbs for movement ☐ how to use can / can't ☐ how to use possessives (besitzanzeigende Fürwörter)
you can ☐ say what you can or can't do ☐ ask and understand what others can or can't do ☐ write about what you can or can't do
VOCABULARY Musicians and instruments
2/1 🔊 1 Listen and look at the pictures. Then number the words.
☐ drummer ☐ saxophone player ☐ singer ☐ guitarist ☐ keyboard player
[Image description: Silhouettes of five musicians numbered 1-5 showing a keyboard player, saxophone player, guitarist, bassist, and drummer]
2/2 🔊 2 Listen to James. Complete with the words from the box.
~~James~~ Ellie Bacon Steve Jessica Jack Dan
Hi, I'm ¹.................James............... . I'm the singer of our band. Its name is Project 11. This is ².................................. , our keyboard player. And this is her boyfriend, ³................................... . He's our saxophone player. This is ⁴................................... and his brother ⁵................................... . They play the guitar. And this is their dog. His name is ⁶................................... .
[Image description: Illustration of a band with six members performing with various instruments]
This is my sister, ⁷................................... . She's our drummer.
🔵 WB p. 40, 41 🌐 CYBER Homework 13 (Revision)
Page 39
READING
3 Read the story.
The perfect job
... It's time to move your body and to dance around the clock ...
[Image description: Series of illustrated panels showing a band performance and interactions between band members]
2
Pete Wow! Cool! You're a great band. James Thanks. I'm James. What's your name? Pete Hi, I'm Pete. James Nice to meet you, Pete. Meet my friends. This is Jessica. She plays the drums. Pete Hi, Jessica! Jessica Hi! James And there's Dan, Steve, Ellie and Jack. Pete Hi there. Band Hi!
3
Pete Erm ... Erm ... Can I play in your band? Jessica Can you play the guitar? Pete Yes, I can. Jessica No, he can't.
4
Ellie Can you play the keyboards? Pete I'm not sure. Let me try. Jessica No, you can't.
5
James Can you sing? Pete I'm not sure. Let me try. ... I love you so ... Jack Oooops! Pete No, I can't. James Oh, don't worry.
Ellie We've got the perfect job for you. Pete Really? Wow! Jessica Yes, come back tomorrow at five. We've got a concert at eight.
6
The next day at five o'clock.
Phew! Perfect job? I don't know
🔵 WB p. 46
Page 40
4 How many of these tasks can you do?
1 For Pete, the band is ☐ loud. ☐ OK. ☐ great. 2 They ask Pete: Can you play the ☐ keyboards? ☐ drums? ☐ saxophone? 3 They say to Pete, "Come back ☐ in five hours." ☐ tomorrow at five." ☐ at five in the morning." 4 Pete can play the guitar. T / F 5 Pete can't sing. T / F 6 Jessica says she has the perfect job for Pete. T / F 7 Who is the drummer in the band? ............................................................................................... 8 How many people are in the band? ............................................................................................... 9 Is Pete happy with his new job? ...............................................................................................
2/3+4 🔊 5 Check your answers with a partner. Then listen to the story.
A SONG 4 U
2/5+6 🔊 6 Listen and sing.
Music is our life
When the drummer gets going and the band starts to rock, it's time to move your body and dance around the clock. Yeah, music, music, music – Music is our life.
Hear the beat – it's so cool. There's music here at our school. Shake your arms and shake your feet. Swing in time with the beat!
When the drummer gets going ...
Forget the tests – have some fun. Enjoy the music, everyone! Move your body, left and right. Dance and sing, day and night!
When the drummer gets going ...
[Image description: Illustration of diverse band members playing various instruments]
7 Complete the sentences with can or can't.
1 .......Can........ you play the guitar, Pete? – Yes, I .................... . 2 ..................... you sing, Pete? – No, I ..................... . 3 Dan and Steve ................... play the guitar.
4 Bacon ................... sing. 5 Ellie ..................... play the keyboards. 6 Pete ................... carry their instruments.
2/7 🔊 8 Listen and write the words.
nose ears hands head
[Image description: Four illustrations showing different actions numbered 1-4]
1 wiggle your ............................. 2 stand on your ....................... 3 walk on your .......................... 4 touch your .............................. with your tongue
🔵 WB p. 40, 42, 44 🌐 CYBER Homework 14
Page 41
SOUNDS RIGHT can – can't
Note I can't = I cannot
2/8 🔊 9 Listen and repeat.
Can you carry fifteen cans? I can't carry fifteen cans. Can you drink them in one go? I can't drink them in one go. Can you eat a hundred apples? I can't eat a hundred apples. Can you really? Is that so? I'm not a hippo, no no no!
[Image description: Illustration of a hippo with cans and a girl]
SPEAKING Saying/Asking what you or others can or can't do
👥 10 Find out five things your partner can do and three things he/she can't do.
[Image description: Photo of students studying together]
A I can ... , but I can't ... Can you ... ?
B Yes, I can.
C No, I can't.
GRAMMAR CHANT Possessives
2/9 🔊 11 A chant. Listen and repeat.
[Image description: Comic strip showing various scenes with cats and people discussing ownership, with speech bubbles saying:
"This isn't my cat."
"It isn't your cat."
"It isn't his cat."
"Oh, no!"
"It's her cat."
"Yes, I'm her cat."
"This isn't our dog."
"It isn't your dog."
"Of course not. It's their dog."
"That's right, I'm their dog."]
🔵 WB p. 42, 43, 44
Page 42
WRITING
12 Read the text. Then write a text about yourself.
This is me. I can write with my left hand and my right hand. I can't touch my nose with my tongue, but I can wiggle my ears. I can walk on my hands. I'm Super Girl!
[Image description: Illustration of a girl doing a handstand]
GRAMMAR
▶️ Possessives (besitzanzeigende Fürwörter)
Mithilfe der Wörter my, your, his, her usw. kannst du ausdrücken, zu wem etwas gehört.
I – my This is my sister Jessica. you – your What's your name? – I'm James. he – his His name's Jack. she – her Her name's Ellie. it – its This is a new band. Its name is Project 11. we – our We are Dan and Steve. And this is our dog. you – your Dan and Steve, your guitars are great! they – their Dan and Steve are brothers. Their dog is Bacon.
This elephant can wiggle its ears.
[Image description: Cartoon of an elephant wiggling its ears]
▶️ can – can't 🔍 Lies die Beispielsätze links. Setze dann can oder can't ein:
James can sing. The dog can't sing.
Mithilfe des Wortes ¹........................ sagst du, dass jemand etwas kann. Mithilfe des Wortes ²........................ sagst du, dass jemand etwas nicht kann.
MORE FUN WITH FIDO!
[Image description: Comic strip showing a person with a guitar and a dog, with speech bubbles saying "Take me by the hand ..." and "Mmm. That's a good idea!"]
⏪ Now go back to page 38. Check ☑ with a partner what you know / can do.
🔵 WB p. 42, 43, 44, 45, 47 🌐 CYBER Homework 15
Page 43
OUR YOUNG WORLD 2
▶️ Jamie's money
▶️ 1 Watch the video and complete Jamie's sentence:
I get pocket money from ................................................................................................................. .
▶️ 2 Watch again. Put Jamie's sentences in the correct order.
☐ My profit is £120. ☐ But Mr Davis, my teacher, ☐ A cup of apple juice at the isn't happy! school canteen is £2.
☐ At the supermarket, a ☐ I give my profit to ☐ I get ten litres of apple juice litre of apple juice is £1. the Clown Doctors. from the supermarket.
FIND 🔍 OUT The economy
3 Match the questions with the answers.
1 What's the economy? ☐ When a lot of people have a job and get good money. 2 When is the economy good? ☐ When not a lot of people have a job. 3 When is the economy bad? ☐ It's the world of money.
Our money world
4 What are good ways to get money? What are bad ways? Write g (good) or b (bad).
1 go shopping for someone ☐ 3 help at home ☐ 2 wash the car for someone ☐ 4 ask a friend for money ☐
[Image description: Photos showing a stack of coins, a child shopping, a child helping in kitchen, and children washing a car]
CYBER PROJECT: Jamie's problem
5 Work in groups. ● Create a role play about Jamie's problem. ● Think of a good ending ● Make a video.
🌐 CYBER Project 2
Page 44
THE TWINS 2
▶️ Kitty isn't here
Developing speaking competencies
Language function | Speaking strategy ☐ I can ask for help (jemanden um Hilfe bitten) | ☐ I can ask for repetition (jemanden bitten, etwas zu wiederholen)
VOCABULARY Places
2/10 🔊 1 Look at the photos. Match the places with the photos. Then listen and check.
1 garage 3 downstairs 5 kitchen 2 bathroom 4 garden 6 upstairs
[Image description: Photos labeled A-F showing different areas of a house including cross-sections and rooms]
2/11 🔊 2 Watch or listen to the dialogue. Then read it. What places do Lucy and Leo mention?
▶️
Lucy Can you help me? Leo Sorry? Lucy Can you help me please, Leo? Leo Yes, of course. What's the problem? Lucy Kitty isn't here. Leo Pardon? Lucy Kitty isn't here. Leo Shhh. Kitty! Kitty! Lucy Nothing. Can you help me? Look in the garden, please. Leo OK. And you? Lucy I can look upstairs. Leo OK, let's go.
[Image description: Photo of two people in a room]
3 Read the dialogue in 2 again. Then circle T (True) or F (False).
1 Lucy asks Leo for help. T / F 3 Leo looks in the garden. T / F 2 Leo has got a problem. T / F 4 Lucy looks downstairs. T / F
Page 45
USEFUL PHRASES Asking for help
4 Write the words in the correct order to make sentences. Then check with the dialogue in 2 to find a good answer to the phrases.
1 you / can / me, / please / help / ? ............................................................................................... 2 garden, / in / look / the / please / . ............................................................................................... 3 Answer: Yes, o................................... c................................... .
? What do you think? Answer the questions.
• Where is Kitty? • Who finds her – Lucy or Leo?
MOBILE HOMEWORK
▶️ Watch part 2 of the video. Fill in Lucy or Leo. Then check your answers to the questions above.
1 ...................... looks under the bridge. 3 ...................... goes to the kitchen to get 2 ...................... looks behind the some orange juice. bushes. 4 ...................... sits down on the sofa.
SPEAKING STRATEGY Asking for repetition
5 Complete the dialogues with the correct words. Check with the dialogue in 2.
1 Lucy Can you help me? 2 Lucy Kitty isn't here. Leo S.................................................. ? Leo P.................................................. ? Lucy Can you help me please, Leo? Lucy Kitty isn't here.
6 C H O I C E S
👥 A Work in pairs. Student A asks for help. Student B doesn't understand and asks for repetition. Use the words from the box.
help / homework open / door for me get me / sandwich carry / school bag
A Can you help me with my homework, please? B Pardon?
A Can you help me with my homework, please? B Yes, of course.
👥 B ROLE PLAY: Work in pairs. Look at the situation and the roles. Think of a role play with a partner. Take two or three minutes to practise it. Don't write it down. Act it out in class.
Roles: You and your friend Situation: You are at home. You can't find your pen. Ask your friend for help. Ask your friend to look in different places before you find it. Language: Don't forget to ask for repetition.
🔵 WB p. 47


----- WB: WB Unit 5 This is our band.txt -----
Unit 5 This is our band
Page 40–41
UNDERSTANDING VOCABULARY
Musicians and instruments / Verbs for movement
1 Look at the picture and write the names of the instruments.
guitar
saxophone
drums
keyboard
[Image description: A music room. On the left, a glass cabinet with two shelves: on the top shelf there is a trumpet; on the bottom shelf there is a saxophone. On the right, a man is standing in the room holding a guitar. Behind him there is a drum kit. On the floor to the right there is a keyboard. Numbers 1, 2, 3, and 4 are shown next to the instruments to label them.]
1 ……………………………
2 ……………………………
3 ……………………………
4 ……………………………
2 Who plays the instruments? Write the words.
1 drums – drummer
2 saxophone – ……………………………
3 guitar – ……………………………
4 keyboard – ……………………………
3 Write the phrases from the box under the pictures.
walk on my hands
wiggle my ears
touch my nose with my tongue
stand on my head
write with my left and my right hand
[Image description: A girl saying “I can …”. Five pictures show different actions: walking on hands, standing on head, writing with both hands, wiggling ears, touching nose with tongue.]
1 walk on my hands
2 ……………………………
3 ……………………………
4 ……………………………
5 ……………………………
USING VOCABULARY
Musicians and instruments / Verbs for movement
4 Complete the sentences about Project 11.
Spotlight on PROJECT 11
1 James is the …………………………… of the band.
[Image description: James holding a microphone.]
2 Jessica is the …………………………… .
[Image description: Jessica next to a drum kit.]
3 Ellie is the …………………………… player.
[Image description: Ellie next to a keyboard.]
4 Dan and Steve play the …………………………… .
[Image description: Dan and Steve with guitars.]
5 Jack is the …………………………… player.
[Image description: Jack playing the saxophone.]
5 Complete the text with the missing letters.
Proj _ _ 11 ar_ a gre_ _ ba_ . Th sin_ _ o_ th_ ba_ _ i_ Jam_ . Jess _ _ i_ th_ drum_ _ . Sh i_ ve_ _ goo_ . Ell _ i_ th_ keyb_ _ _ pla_ _ _ an_ Ja_ _ i_ th_ saxop_ _ _ pla_ _ . Da an_ Ste_ _ pl_ _ th_ gui_ _ _.
6 Follow the lines and write about the band FourU.
[Image description: Five people labelled Mark, Tim and Kate, Joe, Sally, Emma. Curved lines connect each person to an instrument: drums, keyboard, saxophone, guitars, microphone.]
1 Mark is the singer.
2 ……………………………
3 ……………………………
4 ……………………………
5 ……………………………
Page 42–43
7 Match A with B and write the phrases under the pictures.
A
1 climb*
2 stand on
3 touch your nose
4 juggle*
5 walk on
6 wiggle
B
balls
with your tongue
a tree
your ears
your head
your hands
VOCABULARY
*climb – klettern
juggle – jonglieren
[Image descriptions:
1 A boy climbing a tree.
2 A boy standing on his head.
3 A boy touching his nose with his tongue.
4 A boy juggling balls.
5 A boy walking on his hands.
6 A boy wiggling his ears.]
1 climb a tree
2 ……………………………
3 ……………………………
4 ……………………………
5 ……………………………
6 ……………………………
UNDERSTANDING GRAMMAR
Possessives
8 Circle the correct word.
1 This is we / our dog.
2 Is Susie you / your sister?
3 Have you got he / his book?
4 He / His is very happy today.
5 Are they / their brothers?
6 That’s she / her saxophone.
7 It / Its is cold today.
8 What’s it / its name?
9 John is I / my brother.
10 We / Our are twins.
11 Mr Smith is they / their favourite teacher.
12 I / My am Paul.
9 Complete the table with the words in the box.
they
you
she
my
your
its
his
our
Subject pronoun | Possessives
I | 1 …………………
2 ………………… | your
he | 3 …………………
4 ………………… | her
it | 5 …………………
we | 6 …………………
you | 7 …………………
8 ………………… | their
[Image description: A band of animals playing instruments. A speech bubble says: “Our singer’s great.”]
Page 44–45
UNDERSTANDING GRAMMAR
can – can’t
10 Look at the pictures and number the sentences.
[Image descriptions:
1 A girl playing tennis.
2 A dog trying to climb a tree.
3 A boy singing into a microphone with people covering their ears.
4 A squirrel climbing a tree.
5 A girl standing on her head.
6 A boy singing with people clapping.
7 A girl playing tennis badly.
8 A girl walking on her hands.]
He can’t sing.
She can walk on her hands.
It can climb trees.
She can’t walk on her hands.
She can’t play tennis.
It can’t climb trees.
She can play tennis.
He can sing.
USING GRAMMAR
Possessives
11 Complete the sentences with the words from the box.
my
your
his
her
our
their
[Image descriptions accompany each sentence.]
1 Is that ………………… cat?
2 This is ………………… new school!
3 This is ………………… bag.
4 We’re Billy and Steve. And these are ………………… dogs!
5 What’s ………………… name?
6 They’re Jane and Melissa. And that’s ………………… mum.
12 Complete the sentences. Use his, her or their. Write short answers.
[Image descriptions show people with cats.]
1 Is it his cat?
Yes, it is.
2 …………………………… ?
No, …………………………… .
3 …………………………… ?
Yes, …………………………… .
4 …………………………… ?
No, …………………………… .
5 …………………………… ?
No, …………………………… .
6 …………………………… ?
Yes, …………………………… .
Page 46–47
USING GRAMMAR
can – can’t
13 Write the words in the correct order to make sentences.
1 you / stand / can / head / your / on / ?
Can you stand on your head?
2 can’t / they / sing / .
……………………………………
3 play / you / tennis / can / ?
……………………………………
4 climb / he / trees / can’t / .
……………………………………
5 count / I / can / from / you / 100 / to / ?
……………………………………
6 can’t / her / hands / she / walk / on / .
……………………………………
7 hands / walk / you / can / on / your / ?
……………………………………
8 brother / my / guitar / play / the / can / .
……………………………………
14 Look at the pictures. Write questions and short answers.
[Image descriptions:
1 A boy playing guitar.
2 A girl playing saxophone.
3 A girl playing drums.
4 Children covering their ears.]
1 Can he play the guitar?
Yes, he can.
2 ……………………………
……………………………
3 ……………………………
……………………………
4 ……………………………
……………………………
15 Write the sentences from the box under the pictures.
It’s their guitar.
It’s her guitar.
It’s our guitar.
It’s his guitar.
[Image descriptions show different people with guitars.]
1 ……………………………
2 ……………………………
3 ……………………………
4 ……………………………
16 Write questions and give answers that are true for you.
1 climb a tree
Can you climb a tree?
Yes, I can. / No, I can’t.
2 name 20 cities in Europe
……………………………………
3 say the names of ten British* singers
……………………………………
4 touch your nose with your tongue
……………………………………
5 play the guitar
……………………………………
6 juggle
……………………………………
7 play volleyball
……………………………………
VOCABULARY: *British – aus Großbritannien
LISTENING
Understanding what others can/can’t do
17 Listen and write the names from the box next to the pictures.
Bill
Sarah
Anne
Paul
Zizzi
[Image descriptions: A cat in a tree; a girl standing on her head; a boy playing guitar; a girl playing saxophone; a boy juggling.]
1 ……………………………
2 ……………………………
3 ……………………………
4 ……………………………
5 ……………………………
Page 48
18 Listen again and tick T (True) or F (False).
1 Bill has short hair. T ☐ F ☐
2 Bill can sing and play the guitar. T ☐ F ☐
3 Sarah can play the saxophone. T ☐ F ☐
4 Sarah can walk on her hands. T ☐ F ☐
5 Bill’s mum can’t stand on her head. T ☐ F ☐
6 Bill’s mum can play the guitar. T ☐ F ☐
7 Bill’s dad can touch his nose with his tongue. T ☐ F ☐
8 Bill’s dad can juggle. T ☐ F ☐
9 Zizzi can sing. T ☐ F ☐
10 Zizzi likes to climb trees. T ☐ F ☐
READING & WRITING
What you and others can or can’t do
19 Read the dialogue and complete it with the words from the box.
sing
I
play
am
can’t
Bye
you
their
Lisa Are you in Project 11?
Pete Yes, I 1 ………………… .
Lisa Wow, they’re great.
Pete Thanks.
Lisa Are 2 ………………… the singer?
Pete No, I’m not. I can’t 3 ………………… .
Lisa Are you the keyboard player?
Pete No. I 4 ………………… play the keyboard.
Lisa Are you the guitarist?
Pete No. 5 ………………… can’t play the guitar.
Lisa Are you the saxophone player?
Pete No. I can’t 6 ………………… the saxophone.
Lisa What are you?
Pete Me? I carry 7 ………………… instruments.
Lisa Oh! Oh, well … I must go. 8 ………………… .
21 Read the dialogue in 19 again and tick the correct sentences.
1 Pete is in Project 11. ☐
2 Lisa is in Project 11. ☐
3 Pete is the keyboard player. ☐
4 Pete can’t play the guitar. ☐
5 Pete can play the saxophone. ☐
6 Pete can carry their instruments. ☐
Page 49
22 CHOICES
A Look at the pictures and write short answers.
1 Can James touch his nose with his tongue?
Yes, he can.
2 Can Jessica juggle?
……………………………
3 Can Ellie wiggle her ears?
……………………………
4 Can Dan climb the tree?
……………………………
5 Can Steve walk on his hands?
……………………………
6 Can Jack stand on his head?
……………………………
B Read the text. Then write a text about yourself.
My talents
I can touch my nose with my tongue. I can juggle and I can stand on my head. But I can’t wiggle my ears, I can’t climb trees and I can’t walk on my hands.
DIALOGUE WORK
Asking for help and repetition
23 CHOICES
A Put the dialogue in the correct order. Then listen and check.
☐ Anna Can you help me?
☐ Anna I can’t find my cap.
☐ Dan It’s on your head.
☐ Dan Yes, of course. What’s the problem?
B Complete the dialogue with the sentences from the box. Then listen and check.
Look under the sofa.
My book. I can’t find it.
Can you help me?
Can you help me, Beth?
It’s missing.
Owen 1 ……………………………
Beth Sorry?
Owen 2 ……………………………
Beth Yes, of course. What’s the problem?
Owen 3 ……………………………
Beth Pardon?
Owen My book. 4 ……………………………
Beth OK. 5 ……………………………
Owen Ah, here it is.
24 Complete the dialogue with your own ideas.
Tim …………………………………………
Ruth Pardon?
Tim …………………………………………
Ruth Sorry?
Tim …………………………………………
Ruth Yes, of course. What’s the problem?
Tim …………………………………………
Ruth OK.
Tim …………………………………………
Ruth OK, but it’s not there.
Page 48
WORD FILE
 Musicians and instruments
[Image description: A cartoon band performing. Labels point to people and instruments: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar. A dog is lying on the floor to the left.]
MORE Words and Phrases
2
 boyfriend
 Jack is her boyfriend.
 fester Freund
its
 This is my band. Its name is Project 11.
 sein/e; ihr/e
to play
 They play the guitar.
 spielen
sister
 Jessica is my sister.
 Schwester
3
 can, cannot / can’t
 She can play the drums. He can’t sing.
 können, nicht können
concert
 Let’s go to the concert tomorrow.
 Konzert
to dance
 Let’s dance to the music!
 tanzen
Don’t worry.
 Keine Sorge.
job
 She has a good job.
 Arbeit; Aufgabe
perfect
 The job is perfect for you.
 perfekt
7
 to carry
 Can you carry my guitar?
 tragen
8
 to stand on
 I can stand on my head.
 auf etwas stehen
tongue
 He can touch his nose with his tongue.
 Zunge
to touch
 Please don’t touch my guitar.
 berühren
to walk on
 Can you walk on your hands?
 auf etwas gehen
to wiggle
 He can wiggle his ears.
 wackeln
9
 can
 Look, he carries fifteen cans.
 Dose
to drink
 I can’t drink fifteen cans.
 trinken
hundred
 Can you eat a hundred apples?
 hundert
in one go
 Can you drink five cans in one go?
 in einem Zug, auf einmal
Is that so?
 Ach wirklich?
12
 This is me.
 Das bin ich.
economy
 The economy is the world of money.
 Wirtschaft
hospital
 The Clown Doctors go to hospitals and help children.
 Krankenhaus
to laugh
 They make children laugh.
 lachen
(pocket) money
 I get my pocket money from my mum and dad.
 (Taschen-)Geld
pound
 A cup of apple juice is 2 pounds.
 Pfund
profit
 It’s 120 pounds. That’s my profit.
 Gewinn, Profit
school canteen
 We have apple juice in our school canteen.
 Schulkantine
table
 I put a table in our playground.
 Tisch
teacher
 Mr Davis is my teacher at school.
 Lehrer/Lehrerin
uncle
 My uncle is my dad’s brother.
 Onkel
to wash
 I wash my mum’s car.
 waschen
nothing
 There’s nothing in the garden.
 nichts
Sorry?
 Entschuldigung?, Wie bitte?

```

## Output contract

Write `content/corpus/units/g1-u05/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u05",
  "briefBank": "22c58d7186e1",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u05.s.can",
      "format": "gap-fill",             // gap-fill|multiple-choice|context-picker|translation|error-correction|transformation|question-formation|free-form|sentence-building|matching|anagram|group-sort|matching-pairs
      "difficulty": 1,
      "prompt": { "text": "…", "lang": "en", "blanks": 1 },
      "answers": [{ "text": "…", "tier": "full" }],
      "direction": null,                 // REQUIRED ("deToEn"|"enToDe") iff format=translation
      "distractors": ["plain string", "another"],   // ARRAY OF PLAIN STRINGS — never {"text":…} objects; [] for non-choice formats
      "pairs": [],                       // [{ "left": "…", "right": "…" }] for matching/matching-pairs, else []
      "groups": [],                      // [{ "label": "…", "members": ["…","…"] }] for group-sort, else []
      "hintDe": "…", "hintEn": null,
      "explainDe": "…", "explainEn": null,
      "strict": false,                   // true for minimal pairs (should/shouldn't, study/studies!)
      "gloss": [],
      "gameMeta": null,                  // null, OR for mc/context-picker/sentence-building: { "distractorPool": ["…","…","…","…"], "chipBudget": null, "minOptions": 4 } — the key is "distractorPool" (NOT "pool"), ≥4 in-bank entries
      "seedV1": null, "sbRef": null, "note": null
    }
  ]
}
```

Field shapes are STRICT: `distractors` is an array of plain strings (not objects); `gameMeta` uses the key `distractorPool` (not `pool`). Do NOT include ids — the pipeline mints them. No two items may share the same carrier+answers (duplicates are rejected).
