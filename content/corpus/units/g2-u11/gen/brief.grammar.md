# Grammar generation brief — g2-u11 (MORE! 2, Unit 11)

<!-- domigo:gen grammar g2-u11 bank=dbdedfccfbc4 prompt=4b9164076103 -->

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

### `g2u11.s.possessive-pronouns` — Possessive pronouns (Possessivpronomen (mine, yours, ...))

Possessive pronouns (mine, yours, his, hers, ours, theirs) as standalone forms, contrasted with possessive adjectives + noun.

v1 floor for this structure: **19 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [stand-alone]: Possessive pronouns stand alone, with no noun after them: mine, yours, his, hers, ours, theirs.
  - DE: Possessivpronomen stehen allein, ohne Nomen danach: mine, yours, his, hers, ours, theirs.
  - "It's mine." — "Es gehört mir."
  - "The laptop is ours." — "Der Laptop gehört uns."
  - "The book isn't theirs." — "Das Buch gehört ihnen nicht."
- rule [adjective-vs-pronoun]: Possessive adjective + noun vs possessive pronoun alone: my bed - mine, your basket - yours, her bag - hers.
  - DE: Begleiter + Nomen oder Pronomen allein: my bed - mine, your basket - yours, her bag - hers.
  - "This is my bed, and that's his." — "Das ist mein Bett, und das dort ist seins."
  - "The bag is hers." — "Die Tasche gehört ihr."
  - "Look Fido! A new basket. It's yours." — "Schau, Fido! Ein neues Körbchen. Es gehört dir."

common errors:
- Using the possessive adjective instead of the pronoun: ✗ "This book is my." → ✓ "This book is mine."
- Using the possessive pronoun before a noun: ✗ "This is mine book." → ✓ "This is my book."
- Wrong form for hers: ✗ "This is her's." → ✓ "This is hers."

SB box `g2/sb/More 2 SB Unit 11.txt#grammar-1` — ❓ Questions with “Who ... ?”:
```
Wenn du mit Who ...? nach dem Subjekt fragst, verwendest du kein do/does oder did:
 Who broke your bed?
 (Not: Who did break your bed?)
 Who wants an ice cream machine?
 (Not: Who does want an ice cream machine?)
❓ Whose ... ?
Wenn du fragen willst, wem etwas gehört, fragst du mit Whose ...?
 Whose school bag is this?
 (oder: Whose is this school bag?)
 Whose trainers are those?
 (oder: Whose are those trainers?)
’s – Possessive ’s
Wenn du sagen willst, wem etwas gehört, hängst du an den Namen der Person oder das Nomen ein ’s an:
 Whose bag is this? – It’s Joanna’s.
 They’re Mike’s trainers.
 This is my brother’s bed.
Wenn der Name oder das Nomen im Plural steht oder auf -s endet, setzt du das ’s an das Ende des Wortes ein:
 This is my parents’ room.
 It’s our neighbours’ dog.
 That’s Les’ mum.
Bei Wörtern mit unregelmäßigem Pluralform setzt du ’s ans Ende des Wortes:
 That’s the children’s school.
 Don’t take other people’s things!
🔍 Complete with he / I / it / they / she.
It’s mine.
... you ... Are they yours?
This is my bed, and that’s his.
The bag is hers.
The laptop is ours.
The book isn’t theirs.
Comic: MORE FUN WITH FIDO!
1st panel: Dog sits on a rug beside a dog basket.
 2nd panel: Girl says, “Look Fido! A new basket. It’s yours.”
 3rd panel: Dog happily lies in the new basket and says, “Home, sweet home!”
```

v1 seed items (UNTRUSTED):
- `m2-u11-possessive-pronouns-gf-001` [gap-fill, d1]: p="Is this your pen? — Yes, it's ___." c="mine" a=["mine"] ds=["my","me","I"]
- `m2-u11-possessive-pronouns-gf-002` [gap-fill, d1]: p="That's not my bag. It's ___." c="yours" a=["yours"] ds=["your","you","your's"]
- `m2-u11-possessive-pronouns-gf-003` [gap-fill, d2]: p="My phone is broken. Can I use ___?" c="yours" a=["yours"] ds=["your","your's","you"]
- `m2-u11-possessive-pronouns-gf-004` [gap-fill, d3]: p="We forgot our football. Can we borrow ___?" c="theirs" a=["theirs"] ds=["their","them","their's"]
- `m2-u11-possessive-pronouns-gf-005` [gap-fill, d3]: p="That bike isn't his. It's ___." c="hers" a=["hers"] ds=["her","she","her's"]
- `m2-u11-possessive-pronouns-gf-006` [gap-fill, d4]: p="I like your painting, but I think ___ is better." c="ours" a=["ours"] ds=["our","us","our's"]
- `m2-u11-possessive-pronouns-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="This book is mine." a=["This book is mine."] ds=["This book is my.","This is mine book.","This book is mine's."]
- `m2-u11-possessive-pronouns-mc-002` [multiple-choice, d4]: p="Choose the correct option:" c="Is that pencil case yours or hers?" a=["Is that pencil case yours or hers?"] ds=["Is that pencil case your or her?","Is that pencil case yours or her's?","Is that pencil case your's or hers?"]
- `m2-u11-possessive-pronouns-ec-001` [error-correction, d3]: p="Find and fix the mistake: This skateboard is her's." c="This skateboard is hers." a=["This skateboard is hers.","This skateboard is hers","hers"] ds=[]
- `m2-u11-possessive-pronouns-ec-002` [error-correction, d4]: p="Find and fix the mistake: Is this mine jacket?" c="Is this my jacket?" a=["Is this my jacket?","Is this my jacket","my"] ds=[]
- `m2-u11-possessive-pronouns-ec-003` [error-correction, d5]: p="Find and fix the mistake: That tablet is my, not your." c="That tablet is mine, not yours." a=["That tablet is mine, not yours.","That tablet is mine, not yours","mine, not yours"] ds=[]
- `m2-u11-possessive-pronouns-tf-001` [gap-fill, d2]: p="Someone found a book in the classroom. It's your book. Say: 'This book is ___.'" c="mine" a=["mine"] ds=["yours","his","hers"]
- `m2-u11-possessive-pronouns-tf-002` [gap-fill, d3]: p="Your friends left their sandwiches on the table. Point to them: 'Those sandwiches are ___.'" c="theirs" a=["theirs"] ds=["mine","yours","his"]
- `m2-u11-possessive-pronouns-tf-003` [gap-fill, d4]: p="Tom and Emma both have guitars. You want to know whose this one is. Ask: 'Is this his or ___?'" c="hers" a=["hers"] ds=["mine","yours","his"]
- `m2-u11-possessive-pronouns-tr-001` [translation, d2]: p="🇩🇪 Dieses Fahrrad gehört mir." c="This bike is mine." a=["This bike is mine.","This bike is mine","This bicycle is mine.","This bicycle is mine"] ds=[]
- `m2-u11-possessive-pronouns-tr-002` [translation, d5]: p="🇩🇪 Ist das dein Rucksack oder ihrer?" c="Is that your backpack or hers?" a=["Is that your backpack or hers?","Is that your backpack or hers","Is this your backpack or hers?","Is this your backpack or hers","Is that your rucksack or hers?","Is that your rucksack or hers"] ds=[]
- `m2-u11-possessive-pronouns-sb-001` [sentence-building, d2]: p="Put the words in the correct order: yours / is / or / this / mine / ?" c="Is this yours or mine?" a=["Is this yours or mine?","Is this yours or mine","Is this mine or yours?","Is this mine or yours"] ds=[]
- `m2-u11-possessive-pronouns-mt-001` [matching, d1]: p="Match the possessive adjective to its possessive pronoun:\n1. my\n2. your\n3. his\n4. her\n5. our\n6. their\n\na. theirs\nb. mine\nc. hers\nd. his\ne. yours\nf. ours" c="{\"1\":\"b\",\"2\":\"e\",\"3\":\"d\",\"4\":\"c\",\"5\":\"f\",\"6\":\"a\"}" a=["{\"1\":\"b\",\"2\":\"e\",\"3\":\"d\",\"4\":\"c\",\"5\":\"f\",\"6\":\"a\"}"] ds=[]
- `m2-u11-possessive-pronouns-qf-001` [question-formation, d3]: p="This is Lisa's pencil case. → Ask about ownership. Start with 'Whose'." c="Whose pencil case is this?" a=["Whose pencil case is this?","Whose pencil case is this","Whose is this pencil case?","Whose is this pencil case"] ds=[]

### `g2u11.s.possessive-s` — Possessive 's (Possessive 's (Genitiv-s))

Saying who something belongs to: 's for singular nouns, just the apostrophe for plurals and names ending in -s, and 's for irregular plurals (children's).

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [singular-s]: To say who something belongs to, add 's to the person's name or the noun.
  - DE: Wenn du sagen willst, wem etwas gehört, hängst du an den Namen der Person oder das Nomen ein 's an.
  - "Whose bag is this? - It's Joanna's." — "Wessen Tasche ist das? - Es ist Joannas."
  - "They're Mike's trainers." — "Das sind Mikes Turnschuhe."
  - "This is my brother's bed." — "Das ist das Bett meines Bruders."
- rule [plural-apostrophe]: If the name or noun is plural or ends in -s, put just the apostrophe at the end of the word.
  - DE: Wenn der Name oder das Nomen im Plural steht oder auf -s endet, setzt du nur den Apostroph ans Ende des Wortes.
  - "This is my parents' room." — "Das ist das Zimmer meiner Eltern."
  - "It's our neighbours' dog." — "Das ist der Hund unserer Nachbarn."
  - "That's Les' mum." — "Das ist Les' Mama."
- rule [irregular-plural-s]: Nouns with an irregular plural (children, people, women ...) take 's at the end.
  - DE: Bei Wörtern mit unregelmäßiger Pluralform setzt du 's ans Ende des Wortes.
  - "That's the children's school." — "Das ist die Schule der Kinder."
  - "Don't take other people's things!" — "Nimm nicht die Sachen anderer Leute!"

common errors:
- Missing apostrophe: ✗ "Toms bike is red." → ✓ "Tom's bike is red."
- Apostrophe before the -s for a plural possessive: ✗ "The boy's room. (meaning: the room of several boys)" → ✓ "The boys' room."

SB box `g2/sb/More 2 SB Unit 11.txt#grammar-1` — ❓ Questions with “Who ... ?”:
```
Wenn du mit Who ...? nach dem Subjekt fragst, verwendest du kein do/does oder did:
 Who broke your bed?
 (Not: Who did break your bed?)
 Who wants an ice cream machine?
 (Not: Who does want an ice cream machine?)
❓ Whose ... ?
Wenn du fragen willst, wem etwas gehört, fragst du mit Whose ...?
 Whose school bag is this?
 (oder: Whose is this school bag?)
 Whose trainers are those?
 (oder: Whose are those trainers?)
’s – Possessive ’s
Wenn du sagen willst, wem etwas gehört, hängst du an den Namen der Person oder das Nomen ein ’s an:
 Whose bag is this? – It’s Joanna’s.
 They’re Mike’s trainers.
 This is my brother’s bed.
Wenn der Name oder das Nomen im Plural steht oder auf -s endet, setzt du das ’s an das Ende des Wortes ein:
 This is my parents’ room.
 It’s our neighbours’ dog.
 That’s Les’ mum.
Bei Wörtern mit unregelmäßigem Pluralform setzt du ’s ans Ende des Wortes:
 That’s the children’s school.
 Don’t take other people’s things!
🔍 Complete with he / I / it / they / she.
It’s mine.
... you ... Are they yours?
This is my bed, and that’s his.
The bag is hers.
The laptop is ours.
The book isn’t theirs.
Comic: MORE FUN WITH FIDO!
1st panel: Dog sits on a rug beside a dog basket.
 2nd panel: Girl says, “Look Fido! A new basket. It’s yours.”
 3rd panel: Dog happily lies in the new basket and says, “Home, sweet home!”
```

v1 seed items (UNTRUSTED):
- `m2-u11-possessive-s-expanded-gf-001` [gap-fill, d1]: p="This is ___ bag. (Tom)" c="Tom's" a=["Tom's"] ds=["Toms","Tom","Toms'"]
- `m2-u11-possessive-s-expanded-gf-002` [gap-fill, d1]: p="My ___ car is blue. (mum)" c="mum's" a=["mum's"] ds=["mums","mum","mums'"]
- `m2-u11-possessive-s-expanded-gf-003` [gap-fill, d2]: p="The ___ classroom is on the first floor. (girls)" c="girls'" a=["girls'"] ds=["girl's","girls","girls's"]
- `m2-u11-possessive-s-expanded-gf-004` [gap-fill, d3]: p="The ___ toys are all over the floor. (children)" c="children's" a=["children's"] ds=["childrens","childrens'","children"]
- `m2-u11-possessive-s-expanded-gf-005` [gap-fill, d4]: p="Both ___ bikes are in the garage. (my parents)" c="my parents'" a=["my parents'"] ds=["my parent's","my parents","my parents's"]
- `m2-u11-possessive-s-expanded-gf-006` [gap-fill, d4]: p="The ___ office is on the second floor. (women)" c="women's" a=["women's"] ds=["womens","womens'","woman's"]
- `m2-u11-possessive-s-expanded-mc-001` [multiple-choice, d3]: p="Three brothers share a room. Choose the correct sentence." c="The brothers' room is very big." a=["The brothers' room is very big."] ds=["The brother's room is very big.","The brothers room is very big.","The brothers's room is very big."]
- `m2-u11-possessive-s-expanded-mc-002` [multiple-choice, d3]: p="The people have a new park. Choose the correct sentence." c="The people's new park is beautiful." a=["The people's new park is beautiful."] ds=["The peoples' new park is beautiful.","The peoples new park is beautiful.","The people new park is beautiful."]
- `m2-u11-possessive-s-expanded-mc-003` [multiple-choice, d5]: p="James has a dog. Which sentence is correct?" c="James's dog is very friendly." a=["James's dog is very friendly."] ds=["James dog is very friendly.","Jame's dog is very friendly.","James' dog is very friendly."]
- `m2-u11-possessive-s-expanded-ec-001` [error-correction, d2]: p="Find and fix the mistake: Lisas cat is black and white." c="Lisa's" a=["Lisa's","Lisa's cat is black and white.","Lisa's cat is black and white"] ds=[]
- `m2-u11-possessive-s-expanded-ec-002` [error-correction, d3]: p="Find and fix the mistake: The student's lockers are in the corridor. (many students)" c="students'" a=["students'","The students' lockers are in the corridor.","The students' lockers are in the corridor"] ds=[]
- `m2-u11-possessive-s-expanded-ec-003` [error-correction, d4]: p="Find and fix the mistake: The mens' changing room is on the left." c="men's" a=["men's","The men's changing room is on the left.","The men's changing room is on the left"] ds=[]
- `m2-u11-possessive-s-expanded-tf-001` [gap-fill, d1]: p="You're introducing your family at school. Describe the bike: 'the bike of my sister' → 'my ___'" c="sister's bike" a=["sister's bike","my sister's bike"] ds=["sister  bike","sister's bike'","sisters bike"]
- `m2-u11-possessive-s-expanded-tf-002` [gap-fill, d3]: p="You're labelling things in the classroom. The boys share a room: 'the room of the boys' → 'the ___'" c="boys' room" a=["boys' room","the boys' room"] ds=["boys's room","boys room","boys room"]
- `m2-u11-possessive-s-expanded-tf-003` [gap-fill, d5]: p="You're describing the school library. The children have special books: 'the books of the children' → 'the ___'" c="children's books" a=["children's books","the children's books"] ds=["children  books","children's books'","childrens books"]
- `m2-u11-possessive-s-expanded-tr-001` [translation, d2]: p="🇩🇪 Annas Bruder spielt Fußball." c="Anna's brother plays football." a=["Anna's brother plays football.","Anna's brother plays football","Anna's brother plays soccer.","Anna's brother plays soccer"] ds=[]
- `m2-u11-possessive-s-expanded-tr-002` [translation, d4]: p="🇩🇪 Das Spielzeug der Kinder liegt überall herum." c="The children's toys are everywhere." a=["The children's toys are everywhere.","The children's toys are everywhere","The children's toys are all over the place.","The children's toys are all over the place"] ds=[]
- `m2-u11-possessive-s-expanded-sb-001` [sentence-building, d3]: p="Put the words in the correct order: is / my / phone / where / dad's / ?" c="Where is my dad's phone?" a=["Where is my dad's phone?","Where is my dad's phone"] ds=[]
- `m2-u11-possessive-s-expanded-mt-001` [matching, d2]: p="Match each owner with the correct possessive form. 1: the teacher (singular) 2: the teachers (plural) 3: the children 4: my friend 5: the men" c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"d\",\"5\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"d\",\"5\":\"b\"}"] ds=["a: teachers' desk","b: men's shoes","c: teacher's desk","d: friend's house","e: children's playground"]
- `m2-u11-possessive-s-expanded-qf-001` [question-formation, d2]: p="Form a question using 'whose': the book / it / whose / is → ..." c="Whose book is it?" a=["Whose book is it?","Whose book is it"] ds=[]

### `g2u11.s.who-whose` — Questions with Who ...? / Whose ...? (Fragen mit Who ...? / Whose ...?)

Who as subject of a question takes no do/does/did; Whose asks who something belongs to.

v1 floor for this structure: **19 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [who-subject]: When Who asks about the subject, use no do/does or did.
  - DE: Wenn du mit Who ...? nach dem Subjekt fragst, verwendest du kein do/does oder did.
  - "Who broke your bed?" — "Wer hat dein Bett kaputt gemacht?"
  - "Who wants an ice cream machine?" — "Wer will eine Eismaschine?"
- rule [whose-possession]: To ask who something belongs to, use Whose ...?
  - DE: Wenn du fragen willst, wem etwas gehört, fragst du mit Whose ...?
  - "Whose school bag is this?" — "Wessen Schultasche ist das?"
  - "Whose trainers are those?" — "Wessen Turnschuhe sind das?"

common errors:
- Adding an unnecessary auxiliary to a who-subject question: ✗ "Who did break your bed?" → ✓ "Who broke your bed?"
- Using who instead of whose for possession: ✗ "Who book is this?" → ✓ "Whose book is this?"
- Confusing whose with who's (who is): ✗ "Who's bag is this?" → ✓ "Whose bag is this?"

SB box `g2/sb/More 2 SB Unit 11.txt#grammar-1` — ❓ Questions with “Who ... ?”:
```
Wenn du mit Who ...? nach dem Subjekt fragst, verwendest du kein do/does oder did:
 Who broke your bed?
 (Not: Who did break your bed?)
 Who wants an ice cream machine?
 (Not: Who does want an ice cream machine?)
❓ Whose ... ?
Wenn du fragen willst, wem etwas gehört, fragst du mit Whose ...?
 Whose school bag is this?
 (oder: Whose is this school bag?)
 Whose trainers are those?
 (oder: Whose are those trainers?)
’s – Possessive ’s
Wenn du sagen willst, wem etwas gehört, hängst du an den Namen der Person oder das Nomen ein ’s an:
 Whose bag is this? – It’s Joanna’s.
 They’re Mike’s trainers.
 This is my brother’s bed.
Wenn der Name oder das Nomen im Plural steht oder auf -s endet, setzt du das ’s an das Ende des Wortes ein:
 This is my parents’ room.
 It’s our neighbours’ dog.
 That’s Les’ mum.
Bei Wörtern mit unregelmäßigem Pluralform setzt du ’s ans Ende des Wortes:
 That’s the children’s school.
 Don’t take other people’s things!
🔍 Complete with he / I / it / they / she.
It’s mine.
... you ... Are they yours?
This is my bed, and that’s his.
The bag is hers.
The laptop is ours.
The book isn’t theirs.
Comic: MORE FUN WITH FIDO!
1st panel: Dog sits on a rug beside a dog basket.
 2nd panel: Girl says, “Look Fido! A new basket. It’s yours.”
 3rd panel: Dog happily lies in the new basket and says, “Home, sweet home!”
```

v1 seed items (UNTRUSTED):
- `m2-u11-who-whose-gf-001` [gap-fill, d1]: p="___ is your best friend?" c="Who" a=["Who"] ds=["Whose","Who's","Whom"]
- `m2-u11-who-whose-gf-002` [gap-fill, d1]: p="___ bag is on the floor?" c="Whose" a=["Whose"] ds=["Who","Who's","Which"]
- `m2-u11-who-whose-gf-003` [gap-fill, d2]: p="___ plays the guitar in your class?" c="Who" a=["Who"] ds=["Who does","Whose","Who do"]
- `m2-u11-who-whose-gf-004` [gap-fill, d1]: p="___ phone keeps ringing?" c="Whose" a=["Whose"] ds=["Who","Who's","Whom"]
- `m2-u11-who-whose-gf-005` [gap-fill, d2]: p="___ won the race yesterday?" c="Who" a=["Who"] ds=["Who did","Whose","Who was"]
- `m2-u11-who-whose-gf-006` [gap-fill, d5]: p="___ idea was it to go to the park?" c="Whose" a=["Whose"] ds=["Who's","Who","Which"]
- `m2-u11-who-whose-mc-001` [multiple-choice, d2]: p="Which question is correct?" c="Who lives next door?" a=["Who lives next door?"] ds=["Who does live next door?","Who do lives next door?","Whose lives next door?"]
- `m2-u11-who-whose-mc-002` [multiple-choice, d3]: p="Choose the correct option:" c="Whose turn is it?" a=["Whose turn is it?"] ds=["Who's turn is it?","Who turn is it?","Whom turn is it?"]
- `m2-u11-who-whose-ec-001` [error-correction, d3]: p="Find and fix the mistake: Who does want ice cream?" c="Who wants ice cream?" a=["Who wants ice cream?","Who wants ice cream","wants"] ds=[]
- `m2-u11-who-whose-ec-002` [error-correction, d4]: p="Find and fix the mistake: Who's jacket is that?" c="Whose jacket is that?" a=["Whose jacket is that?","Whose jacket is that","Whose"] ds=[]
- `m2-u11-who-whose-ec-003` [error-correction, d5]: p="Find and fix the mistake: Who did break the window?" c="Who broke the window?" a=["Who broke the window?","Who broke the window","broke"] ds=[]
- `m2-u11-who-whose-tf-001` [gap-fill, d2]: p="Someone ate your sandwich from the fridge! You're annoyed. Ask: 'Who ___?'" c="ate my sandwich" a=["ate my sandwich","Who ate my sandwich?","Who ate my sandwich"] ds=["What my sandwich","Whose my sandwich","Where"]
- `m2-u11-who-whose-tf-002` [gap-fill, d3]: p="You find a cute cat in the school yard. You want to know who owns it. Ask: 'Whose ___?'" c="cat is this" a=["cat is this","Whose cat is this?","Whose cat is this"] ds=["Who is this","What","Which"]
- `m2-u11-who-whose-tf-003` [gap-fill, d4]: p="A new student in your class speaks Japanese. You're curious. Ask: 'Who ___ in your class?'" c="speaks Japanese" a=["speaks Japanese","Who speaks Japanese in your class?","Who speaks Japanese"] ds=["Who is this","What is this","Where is this"]
- `m2-u11-who-whose-tr-001` [translation, d3]: p="🇩🇪 Wer hat das Spiel gewonnen?" c="Who won the game?" a=["Who won the game?","Who won the game","Who won the match?","Who won the match"] ds=[]
- `m2-u11-who-whose-tr-002` [translation, d4]: p="🇩🇪 Wessen Hund ist das?" c="Whose dog is that?" a=["Whose dog is that?","Whose dog is that","Whose dog is this?","Whose dog is this"] ds=[]
- `m2-u11-who-whose-sb-001` [sentence-building, d2]: p="Put the words in the correct order: the / won / who / competition / ?" c="Who won the competition?" a=["Who won the competition?","Who won the competition"] ds=[]
- `m2-u11-who-whose-mt-001` [matching, d3]: p="Match the question words with the correct endings:\n1. Who\n2. Whose\n3. Who\n4. Whose\n\na. car is parked outside?\nb. made this cake?\nc. books are these?\nd. wants to come along?" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"d\",\"4\":\"c\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"d\",\"4\":\"c\"}"] ds=[]
- `m2-u11-who-whose-qf-001` [question-formation, d3]: p="Emma taught us the dance. → Ask about the person. Start with 'Who'." c="Who taught you the dance?" a=["Who taught you the dance?","Who taught you the dance","Who taught us the dance?","Who taught us the dance"] ds=[]

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
- **g2-u05**: cinema, church, bank, restaurant, railway station, chemist's, tourist office, music shop, post office, supermarket, hospital, police station, to go past, to go straight ahead, to cross the street, to turn left, to take the second right, round the corner, as far as, opposite, next to, to cross, map, second, to go straight on, airport, to change trains, most of the time, pocket, slow, somewhere, underground, market square, simply, comment, to comment, feedback, guest, to offer, opening, positive, review, the worst, to bother, bus stop, fountain, to interrupt, politely, traffic lights
- **g2-u06**: sun, sea, beach, town, motorway, road, river, village, field, hill, valley, lake, forest, mountains, stars, moon, to build a tree house, camp, life jacket, guide, campfire, picnic, canoe, canoeing, waterfall, rock climbing, bottom, left-hand, middle, right-hand, anorak, hard hat, absolutely, actually, adventure camp, to be afraid (of), although, to care, drive, gate, to be good at sth., once upon a time, sheep (pl sheep), shepherd, to trust, while, to wash up, alive, cry, I'm off now., Poor you!
- **g2-u07**: to do nothing, to play basketball, to stay at a friend's house, to tidy your room, to have a party, to do the shopping, to do your homework, to watch a film, honestly, instead, to take it easy, to be ashamed, to come over, communication, excuse, group chat, social media, to tell a lie, truth, to be worried, to crash, to get into trouble, fancy dress party, disappointment, German, row, sold out, That's a pity., ticket, What a shame!
- **g2-u08**: spaceship, commander, spacesuit, alien, UFO, space centre, planet, boss, cable, capital, to connect, hero, heroine, machine, to repair, space, statue, to take over, traveller, visitor, key, crew, aeroplane, expert, hoax, investigation, photograph, to destroy, to kidnap, nonsense, comfortable, Calm down!, in that case
- **g2-u09**: grapes, plums, pumpkin pie, rice pudding, chocolate ice cream, turkey, ham, beef, chicken, apple juice, cheesecake, pancakes, mineral water, tomato (pl tomatoes), cabbage, sausages, lamb, pears, peppers, onions, olives, mushrooms, potato (pl potatoes), peaches, strawberries, chef, recipe, waiter, cloche, menu, slice, actor, actress, main course, to pour, soup, starter, straightaway, completely, crane, to drop, to entertain, glasses (pl), platform, to serve, several, stew, fridge, to complain, consumer, delivery, to download, refund, certain, to change one's mind, gym, to miss
- **g2-u10**: auntie, calm, girlfriend, to be proud of, sense of humour, ugly, virus, to breathe, to burn, foreign language, to panic, tractor, tool, divorced, to be related to, to delete, file, to print out, public, ice skating, fault, hopefully
- **g2-u11**: wardrobe, bed, bedside table, carpet, fridge, cooker, curtain, sink, cupboard, table, chair, sofa, armchair, lamp, radiator, rug, roof, wall, window, staircase, cellar, trailer (American English), tree house, stilts, reed, island, ground, ours, theirs, mine, hers, his, yours, furniture, whose, American, cellar, Central Asia, electricity, to float, moveable, underneath, to transport, hammock, cotton, leather, material, metal, pattern, plain, plastic, pond, seat, spotted, strap, striped

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Albu, Alison, Alphabet, Alps, America, Americans, Amherst, Anderson, Andrew, Andy, Anger, Annie, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Asia, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Claire, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, East, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Hanna, Hannah, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homes, Homework, Hook, Hoople, Hotel, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Mott, Mr, Mrs, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Ola, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Rick, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salzburg, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Square, States, Station, Steve, Sue, Sunborn, Susan, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 11.txt -----
Unit 11 Homes
Pages 84–85
At the end of unit 11 ...
you know
 ☐ 16 words for furniture inside a room
 ☐ how to form questions with who and whose
 ☐ how to use possessive pronouns
 ☐ how to use the possessive ’s
you can
 ☐ understand a text about different types of houses and homes
 ☐ understand a group interview
 ☐ talk about your bedroom
 ☐ talk about rooms and furniture
 ☐ talk and ask about possessions
 ☐ write a text about the best place in your home
READING
1 Read the text.
Houses and Homes
We all know what a house is. It has a roof, walls, rooms, windows and doors. There might be a staircase. There might be a cellar underneath it or a garden around it. But not all houses are like this. Take a look around the world and see how different houses can be.
Image 1 (top left):
 Photo of trailer homes in a green park.
 Text:
 Around twenty million Americans live in trailer homes. They usually keep them in special parks. They are like little villages. In the park the owners connect their trailers to electricity and water. Trailers are a cheap way of living in your own home and, if you get tired of one place, you can always move your home to another park.
Image 2 (middle left):
 Photo of a yurt and people riding camels in a dry, grassy area.
 Text:
 The Americans aren’t the only people who have moveable houses. Traditionally, the Mongolian people in Central Asia move their houses a lot. Their houses are “Yurts”. When there isn’t enough grass for their sheep any more, they take down their houses. They put the parts on the backs of their camels and horses. They then carry the parts to other places where there is enough food for the animals.
Image 3 (bottom left):
 Photo of floating reed houses on a lake.
 Text:
 Other people actually live on the water. The Uros people live on Lake Titicaca in Peru. There are about two thousand of them on fifty floating islands of reeds. Reeds are long, strong grasses. They use the reeds to build their houses. When the Uros want to visit a neighbour, they move from island to island by boat.
Image 4 (top centre):
 Photo of a stilt house in Southeast Asia.
 Text:
 In some parts of the world, people live in houses that are not on the ground. For example, some people in South East Asia build their houses on stilts*. They do this because their houses are near water. The stilts keep their homes high above the water and out of danger.
 VOCABULARY: stilt – Pfahl
Image 5 (bottom right):
 Photo of a wooden treehouse in the jungle.
 Text:
 Finally, in the jungle of Costa Rica some people live in tree houses. There is even a tree house hotel. There are wooden bridges between the houses so that people can visit their neighbours easily.
2 How many of these tasks can you do?
Trailer home parks are like little villages. T / F
Trailer homes cannot be moved to other parks. T / F
Only Mongolian people move their homes. T / F
Why do Mongolian people transport their homes? .........................................................
How do they transport their homes? .........................................................
Why do people build their houses on stilts? .........................................................
The Uros people use .........................................................
The Uros people visit .........................................................
To visit your neighbours in a special hotel in Costa Rica, you .........................................................
VOCABULARY
Inside a room
3 🎧 Listen and look at the picture. Then number the words.
Word list (to be matched with numbers in the image):
 ☐ wardrobe
 ☐ bed
 ☐ table
 ☐ chair
 ☐ fridge
 ☐ cooker
 ☐ bedside table
 ☐ armchair
 ☐ sink
 ☐ cupboard
 ☐ carpet
 ☐ rug
 ☐ radiator
 ☐ sofa
 ☐ curtains
 ☐ lamp
Image Description:
 Illustration of a colourful bedroom/living room and kitchen scene with each item clearly numbered 1–16. Furniture and items are scattered across the room and labeled for identification (e.g., sofa, bed, fridge, etc.).
4 Work in pairs. One of you closes the book. Test each other.
Student A: What colour’s the table?
 Student B: It’s ...
 Student A: That’s right. / No, it’s ...
SOUNDS RIGHT
/ʊə/ /ʌ/
5 🎧 Listen and repeat.
New curtains for the window,
 new cupboards for my books.
 A wardrobe for my clothes,
 and how nice my bedroom looks!
Image: A girl smiling in her bedroom, surrounded by curtains, cupboards, and a wardrobe.
Pages 86–87
READING & SPEAKING
Talking about your bedroom
6 Look at the results of the group interview. Work in pairs. Ask questions with Who has got a ...? and Who hasn’t got a ...?
What’s in your bedroom?
	bed	computer	armchair	sofa	TV	ice cream machine
Robert	no	yes	no	yes	yes	no
Julia	yes	no	yes	yes	no	no
Sean	yes	yes	no	no	no	no

7 Read the text. Then answer the questions.
Robert: Hey Julia! Hi Sean! OK, here are the results of the interview.
 Julia: Hi Robert, wow. Why don’t you have a bed?
 Robert: I did have a bed. But it broke. Now I have a hammock!
 Sean: That’s cool.
 Julia: Who broke your bed?
 Robert: Umm ... I broke my bed!
 Sean: Oh no!
Sean: Well, I want a big bed and a big TV.
 Julia: You had a big TV!
 Sean: I did. But someone took it.
 Robert: Who took your TV?
 Sean: My mum! She thinks I watch too many cartoons.
Julia: So what’s the last one?
 Robert: You don’t remember? That’s the one thing we all want, but don’t have!
 Julia: Oh! I remember! A fridge for food!
 Robert: No, that’s not it. What we all want is ... an ice cream machine!
 Julia: Ha! Yes, that’s even better.
Questions:
What does Robert sleep in?
 ............................................................
Who wants a TV?
 ............................................................
Who wants a fridge?
 ............................................................
Who wants an ice cream machine?
 ............................................................
8 Work in pairs. Talk about your perfect bedroom.
A What’s in your perfect bedroom?
 B In my perfect bedroom, there’s a ... and a ... What about you?
A In my perfect bedroom, there’s a special machine! It does my homework!
 B Wow! My special machine ...
SPEAKING
Talking about rooms and furniture
9 Work in pairs. Look at the plan of the house. Close your book. Say what’s in each room.
Speech bubbles:
 In the living room, there’s a television, and ...
 In the kitchen, there are ...
Image Description: Floor plan of a house divided into labeled rooms: “Joanna’s room”, “bathroom”, “Mike and Nick’s room”, “living room”, “kitchen”. Each room is drawn in isometric view, showing furniture and everyday objects inside (e.g., beds, sofas, TV, chairs, table, shower, etc.).
LISTENING & SPEAKING
Talking/Asking about possessions
10
a 🎧 Listen. Which room in 9 are the people in?
 Conversation 1: .................................................
 Conversation 2: .................................................
 Conversation 3: .................................................
 Conversation 4: .................................................
b Listen again and complete with the words in the box.
Words in the box:
 mine
 yours
 hers
 his
 whose
 ours
 theirs
Dialogue 1
 Mum: 1 ‘................................... school bag is this?’
 Mike: It’s Joanna’s.
 Mum: Well, it shouldn’t be on the sofa. Take it to her room, please.
 Mike: Why me? It’s 2 ‘...................................’, not 3 ‘...................................’!
Dialogue 2
 Simon: I like your room.
 Nick: Thanks. I share it with my brother. This is my bed, and that’s 4 ‘...................................’.
 Simon: Right. Is this your laptop?
 Nick: Yes and no – I mean, it’s 5 ‘...................................’!
Dialogue 3
 Mum: 6 ‘................................... trainers are those? Are they 7 ‘...................................’?
 Joanna: No, they’re Mike’s! I borrowed them, and they got dirty – so now I’m cleaning them.
 Mum: OK, but don’t clean them here! Wash them in the kitchen!
Dialogue 4
 Mike: Dad, why is there a book here on top of the fridge?
 Dad: Oh, that – yes, can you take it to Mr and Mrs Smith next door, please?
 Mike: OK. Is it 8 ‘...................................’?
 Dad: No, it’s ours, but they want to borrow it.
Pages 88–89
🎧 11 Listen to the dialogue. Then act out similar dialogues using the things in the pictures.
Susan: Whose pen is this? Is it yours?
 Mark: No. It’s hers.
Image description:
 A girl and a boy talking at a desk. Below are five objects: a black cap, a pair of blue and white trainers, a blue ruler, a red backpack, and a pink notebook.
🎧 12 Listen and complete. Then repeat.
Whose is it? Is it yours?
 No, it isn’t 1 ______.
Whose is it? Is it Mike’s?
 No, it isn’t 2 ______.
Whose is it? Is it Sue’s?
 No, it isn’t 3 ______.
Whose is it? Jane and Paul’s?
 No, it isn’t 4 ______.
Whose is it? Whose is it?
 Give it to us.
 It’s ours!
 And it’s so good!
 Mmm!
Image description:
 A group of children sit and stand around a yellow table with snacks, laughing and talking.
WRITING
✏️ 13 Read Emily’s text and answer the questions.
Which is her favourite room?
Why does Emily like this room best?
Text box: The best place in my house
 The best place in my house is the kitchen. There’s a big table and four chairs where we have breakfast and dinner. There’s a big window and we can look into the garden. There’s a sink and a fridge, but no washing machine (that’s in the garage). Our cat’s basket is in the kitchen, too, and she sleeps there at night.
 I like the kitchen because it’s a place for all the family. It’s always warm in there, too!
Image description:
 A girl smiling at the camera, with a group of people eating at a kitchen table in the background.
✏️ 14 Write a text about the best place in your house or flat. Write 60–80 words.
Think about:
where the place is
what you do there
what it looks like
why it is your special place
GRAMMAR
❓ Questions with “Who ... ?”
Wenn du mit Who ...? nach dem Subjekt fragst, verwendest du kein do/does oder did:
 Who broke your bed?
 (Not: Who did break your bed?)
 Who wants an ice cream machine?
 (Not: Who does want an ice cream machine?)
❓ Whose ... ?
Wenn du fragen willst, wem etwas gehört, fragst du mit Whose ...?
 Whose school bag is this?
 (oder: Whose is this school bag?)
 Whose trainers are those?
 (oder: Whose are those trainers?)
’s – Possessive ’s
Wenn du sagen willst, wem etwas gehört, hängst du an den Namen der Person oder das Nomen ein ’s an:
 Whose bag is this? – It’s Joanna’s.
 They’re Mike’s trainers.
 This is my brother’s bed.
Wenn der Name oder das Nomen im Plural steht oder auf -s endet, setzt du das ’s an das Ende des Wortes ein:
 This is my parents’ room.
 It’s our neighbours’ dog.
 That’s Les’ mum.
Bei Wörtern mit unregelmäßigem Pluralform setzt du ’s ans Ende des Wortes:
 That’s the children’s school.
 Don’t take other people’s things!
🔍 Complete with he / I / it / they / she.
It’s mine.
... you ... Are they yours?
This is my bed, and that’s his.
The bag is hers.
The laptop is ours.
The book isn’t theirs.
Comic: MORE FUN WITH FIDO!
1st panel: Dog sits on a rug beside a dog basket.
 2nd panel: Girl says, “Look Fido! A new basket. It’s yours.”
 3rd panel: Dog happily lies in the new basket and says, “Home, sweet home!”
Pages 90–91
THE TWINS 5
Leo’s watch
 🔴 ▶️
Developing speaking competencies
Language function
 ☑️ I can describe an object (einen Gegenstand beschreiben)
Speaking strategy
 ☑️ I can check what someone says (bei jemandem nochmal nachhaken)
VOCABULARY
Materials and patterns
1 Match the materials and the patterns with the pictures.
MATERIALS:
 1 made of leather
 2 made of plastic
 3 made of cotton
PATTERNS:
 A spotted
 B plain
 C striped
Image descriptions (with numbers matching objects):
 1: Pink and yellow striped cotton T-shirt
 2: Black jacket with white stripes
 3: Blue plain armchair
 Also shown: sunglasses (with plastic frame), a brown leather watch strap
🎧 2 Watch or listen to the dialogue. Then read it. What’s Leo’s problem?
Leo: Hello. I’m looking for my watch. I think I lost it at school this morning.
 Assistant: OK, let’s see what we can do. What’s it like?
 Leo: Well, it’s white. It’s made of plastic.
 Assistant: OK, so it’s plain white, is it?
 Leo: No, sorry. The watch face is white with some orange on it, but the strap is different.
 Assistant: OK. So what’s the strap like?
 Leo: It’s striped. Orange, green, purple and … erm … red.
 Assistant: Are you certain?
 Leo: Yes, it’s orange, green, purple and red.
 Assistant: And what’s the strap made of?
 Leo: It’s made of metal. No, sorry. It’s made of plastic.
 Assistant: Are you sure?
 Leo: Yes, yes. It’s made of plastic, and it’s striped orange, green, purple and red.
 Assistant: OK, so let’s see what we’ve got.
Image description:
 Leo and the assistant are talking at a school’s lost-and-found desk. There are various items on the counter including a pink box.
3 Cover up the dialogue in 2. Try to answer the questions. Then check.
Where does Leo think he lost his watch?
 ………………………………………………………………………..
What’s the watch face like?
 ………………………………………………………………………..
What’s the watch strap like?
 ………………………………………………………………………..
USEFUL PHRASES
Describing an object
4 Write two sentences to describe each object.
Images:
Striped pink and yellow cotton T-shirt
Spotted black and pink sock
Blue plain armchair
It’s made of plastic.
 It’s ..........................................................................
..................................................................................
..................................................................................
❓ What do you think? Answer the questions.
Where did Leo lose his watch?
How does he find it?
📱 MOBILE HOMEWORK
Watch part 2 of the video. Read the sentences and correct them.
The assistant hasn’t got any lost and found watches.
The librarian shows Leo a watch, but it’s not his.
Leo goes to the gym to do some exercise there.
Leo talks to his friends. They don’t want to help him.
In the end, Leo finds the watch. He is wearing it.
SPEAKING STRATEGY
Checking what someone says
5 Fill in the correct words. Then check with the dialogue in 2.
1
 Leo: It’s striped. Orange, green, purple and … erm … red.
 Assistant: A…………………… you C……………………… ?
2
 Leo: It’s made of metal. No, sorry. It’s made of plastic.
 Assistant: A…………………… you S……………………… ?
6 🟥 CHOICES
A Work in pairs. A says what he/she can’t find and describes it. B checks what A says.
A: I can’t find my T-shirt. It’s … erm … blue.
 B: Are you sure?
 A: Yes, I am. It’s blue.
B ROLE PLAY: You are in a lost and found office. One of you is the assistant in the office. The other one lost something a few days ago (a watch, a phone, a pen, etc.). Work in pairs and extend it into a longer dialogue. Take 2 or 3 minutes to practise it. Don’t write it down. Act it out in class.


----- WB: More 2 WB Unit 11.txt -----
UNIT 11 – Homes
Page 87
UNDERSTANDING VOCABULARY
Inside a room
1 Match the words with the pictures. Then listen and check. 🔊
armchair
bed
bedside table
carpet
chair
cooker
cupboard
curtains
fridge
lamp
radiator
rug
sink
sofa
table
wardrobe
Image Description:
 Illustration of a room with furniture labeled A to P.
A = wardrobe
B = curtains
C = radiator
D = sofa
E = cupboard
F = sink
G = fridge
H = bedside table
I = lamp
J = armchair
K = rug
L = table
M = bed
N = carpet
O = chair
P = cooker
2 Do the puzzle and find the secret word.
Image Description:
 Pictures of furniture items numbered 1 to 8 next to a crossword puzzle. The central column of the puzzle is highlighted in pink.
Image clues:
chair
curtains
rug
wardrobe
cooker
radiator
fridge
bed
The secret word is ………………………………………… .
Page 88–89
USING VOCABULARY
Inside a room
3 There are 14 more household objects in the word search (→↓). Some of them are repeated.
 Find them and write sentences about how many objects are in the room.
Word search grid (letters in 13x13 block):
mathematica
KopierenBearbeiten
B E D P W F T O L G
E D P T A B L E Z
D R F R I D G E R
S Y R A D I A T O R
Z X H Y A Z I D
L B A X E S B E D H
E E T T Y J O M A
T S O F A U I P N I
T F R I D G E W Y R
Sample sentence prompts:
There are two fridges.
There’s one …
(Lines for student to continue writing more sentences.)
4 a Draw these items of furniture in the room below.
Items to draw (each with icon):
cupboard
rug
sofa
armchair
radiator
TV
Grid:
 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
 1
 2
 3
 4
 5
 6
 7
 8
 9
4 b Work with a partner. Take turns to guess where your partner’s furniture is.
 The person who finds all the furniture first wins the game.
Dialogue sample:
 A: Is there anything on B9?
 B: Yes, my sofa. Have another guess.
 B: No, there isn’t. It’s my turn now.
UNDERSTANDING GRAMMAR
Possessive ’s
5 Here are some inventions* from the Ideas Office. Are the sentences T (True) or F (False)?
Characters shown above inventions (from left to right):
Professor Albu
Professor Grape
Professor Spallanzani
Doctor Hoople
Doctor Mott
Machines shown (each connected to a professor with a line):
homework machine
pizza machine
reading machine
automatic flower picker
breakfast machine
Sentences to evaluate (T / F):
Dr Mott’s machine is the breakfast machine.
Professor Albu’s invention is the pizza machine.
Professor Grape’s invention is the homework machine.
Professor Spallanzani’s invention is the automatic flower picker.
Doctor Hoople’s invention is the reading machine.
Vocabulary box:
 *invention = Erfindung
 picker = Pflücker(in)
USING GRAMMAR
Whose … ? / Possessive ’s
6 Write the questions for the answers.
Whose idea was the .................................................. ?
 → The automatic vegetable picker was Professor Newt’s idea.
.................................................................................................
 → The automatic vegetable cooker was Professor Toad’s idea.
.................................................................................................
 → The automatic vegetable feeder was my idea.
.................................................................................................
 → The reading machine was Professor Grape’s idea.
.................................................................................................
 → The homework machine was Professor Albu’s idea.
Page 90–91
7 Write the questions and answers.
[Photos of 8 children left to right:]
 Nick, Simon, Ben, James, Monica, Janet, Sue, Annabel
[Images of objects numbered 1–8:]
 1 – ear pods
 2 – pen
 3 – backpack
 4 – phone
 5 – red cap
 6 – jeans
 7 – table
 8 – guitar
1
 A Whose are those ear pods?
 B They’re Monica’s.
2
 A Whose is ............................................................
 B It’s ........................................................................
3
 A ....................................................................................
 B ....................................................................................
4
 A ....................................................................................
 B ....................................................................................
5
 A ....................................................................................
 B ....................................................................................
6
 A ....................................................................................
 B ....................................................................................
7
 A ....................................................................................
 B ....................................................................................
8
 A ....................................................................................
 B ....................................................................................
UNDERSTANDING GRAMMAR
Possessive pronouns
8 Complete the table with the possessive pronouns in the box.
 Box:
 theirs, hers, their, his, yours, his, our, her, ours, your
Subject	It’s ... cat.	The cat is ...
I	1 my	7 mine
you	2 ___________	8 ___________
he	3 ___________	9 ___________
she	4 ___________	10 ___________
we	5 ___________	11 ___________
they	6 ___________	12 ___________

USING GRAMMAR
Possessive pronouns
9 Complete the dialogue with the possessive pronouns in the box.
 Box: hers, yours, mine
Dimitri: I hate this!
 Ron: Well, whose idea was it to go for a walk?
 Dimitri: It certainly wasn’t 1 ____________.
 Ron: No? I thought it was 2 ____________.
 Dimitri: Never. Check with Anna, I think it was 3 ____________.
 Ron: I can’t, she’s too far ahead already.
10 Complete with the possessive pronouns in the box.
 Box: mine, theirs, ours, his, mine, theirs
Camp guide: Fred and Hannah, is this your key?
 Fred and Hannah: Yes, it’s 1 ____________.
 Camp guide: And is this your cap, Samir?
 Samir: No, it isn’t 2 ____________. Ask Marco. I think it’s 3 ____________.
 Camp guide: And what about these trainers?
 Maria: They’re 4 ____________, sir.
 Camp guide: Right, here you go, Maria. And these books belong to the Hart twins, right?
 Samir: No, they aren’t 5 ____________. They’re Anita’s, 6 ____________ are in their bag.
UNDERSTANDING GRAMMAR
Questions with “Who … ?”
11 Do the quiz. Match the questions and answers.
Who discovered America?
Who plays Harry Potter in the films?
Who painted the Mona Lisa?
Who sings “Born this way”?
Who wrote Romeo and Juliet?
Who invented the telephone?
Who found Tutankhamun’s tomb?
Who wrote Harry Potter?
Answers (match with numbers):
 A. Leonardo da Vinci
 B. Christopher Columbus
 C. Lady Gaga
 D. J.K. Rowling
 E. Alexander Graham Bell
 F. Howard Carter
 G. William Shakespeare
 H. Daniel Radcliffe
USING GRAMMAR
Questions with “Who … ?”
12 Write the questions.
Someone phoned me last night!
 Who phoned you ................................................................................... ?
Someone stayed at our home yesterday.
 ............................................................................................................................. ?
Someone cleaned the kitchen.
 ............................................................................................................................. ?
Someone put the lamp on the sofa.
 ............................................................................................................................. ?
I’ve got a lot of friends – one of them lives in that house.
 ............................................................................................................................. ?
Someone made a hole in the carpet.
 ............................................................................................................................. ?
Someone bought the old armchair.
 ............................................................................................................................. ?
One of you left all the cupboards open.
 ............................................................................................................................. ?
Page 92–93
READING & WRITING
Understanding/Writing a text about houses and homes
13 Read the text Houses and Homes on Student’s Book page 84 again. Match the type of home with the part of the world where they are found.
1 trailer
 2 yurt
 3 stilt house
 4 tree house
 5 reed house
☐ Mongolia
 ☐ Costa Rica
 ☐ Peru
 ☐ the USA
 ☐ South East Asia
14 CHOICES
A 1 Match the sentence halves.
1 Joanna’s favourite room
 2 When she gets home from work, she lies
 3 She can look out of the big
 4 Sometimes she also watches her favourite
 5 After her rest, she gets
☐ in her
 ☐ window and see the lake.
 ☐ up and makes dinner.
 ☐ series on the TV in the bedroom.
 ☐ house is her bedroom.
 ☐ down on the bed for half an hour.
2 Put the sentences in the correct order.
☐ laptop. He uses the laptop to watch films and listen to
 ☐ can see a big garden with lots of trees. Max spends most
 ☐ Max’s favourite room is made of wood only. From it he
 ☐ tree house. And it’s all his.
 ☐ music. But most of the time he sits there in an armchair
 ☐ of his time in his room. He has his books there and a
 ☐ and reads. It’s the only room in this house because it’s a
B Choose one of the following people. Write about the favourite room in their house.
[Image with four illustrated characters:]
Natasha Black, computer expert
Anita Snicket, teacher
Tony Galore, music fan
Rufus Rumbleodore, hypnotist
Example:
 Natasha Black lives in London. She’s a computer expert. Her favourite room is her study. There, she has got a very powerful computer with a large flat screen. She loves working on her computer. She also uses it to write emails to her friends and make phone calls to her sister in New York.
......................................................................................................................
 ......................................................................................................................
 ......................................................................................................................
 ......................................................................................................................
VOCABULARY: study = Arbeitszimmer
READING
Understanding a text about different types of houses and homes
15 a Read the blog post. What is the house made of?
 .......................................................................................................................
[Image: Blog-style interface with sections: ABOUT ME, MY POSTS (My hobbies, My bedroom, My favourite food, My holiday stone house), WRITE TO ME, FOLLOW ME]
 [Top right photo: A wooden bench in front of a scenic mountain view]
 [Below: A photo of a stone house in a mountainous area]
Blog Title: My holiday stone house
Hi, I’m Jonathan, and this is our holiday house. We don’t live there, but we spend a lot of our holidays there. The house belonged to my grandparents and they bought it from somebody else. The house is really really old. The people who built it used stones they found in the mountains.
In winter, it is very cold up there in the mountains. My grandparents moved to the village below when it got cold. We only use it in summer and then the house is wonderful. Mum, Dad, my brother and I love walking and climbing, and the house is a great starting point. Downstairs we’ve got a kitchen and a living room (all in one room) with a large open fire, because even in summer it can get pretty cold in the evenings. At the back there’s a little room with a shower and a toilet. Upstairs there are two small bedrooms. That’s enough for us, because we spend most of the day outside. We walk, climb, look for animals, read books (the internet doesn’t really work there) or play games. And it’s really quiet up there. My parents like that a lot. And my brother and I always listen to music.
b Read again. How many of these tasks can you do?
1 The house belonged to Jonathan’s grandparents.
   T / F
2 People transported the stones up the mountain.
   T / F
3 You can’t live in that house in winter.
   T / F
4 Why do they like the house so much?
   ..........................................................................................................
5 How many rooms are there?
   ..........................................................................................................
6 What rooms are they?
   ..........................................................................................................
7 When they’re there, they spend a lot of time
   ..........................................................................................................
8 They read books because
   ..........................................................................................................
9 Jonathan’s parents really like
   ..........................................................................................................
Page 94–95
LISTENING
Talking about your bedroom
17 a Listen to Chris and Ola talking about their rooms. Tick the rooms they are talking about.
[Images: Two cartoon-style bedroom illustrations for each speaker.]
Chris: Room A and Room B
Ola: Room A and Room B
VOCABULARY:
 bookshelf = Bücherregal
b Listen again and write Chris’ or Ola’s.
1 There’s a gaming computer in the room. – It’s ____________________________ room.
 2 The bed is huge. – It’s ____________________________ room.
 3 There are two armchairs. – It’s ____________________________ room.
 4 There are no curtains. – It’s ____________________________ room.
 5 There are lots of books. – It’s ____________________________ room.
 6 There are two large windows. – It’s ____________________________ room.
DIALOGUE WORK
Describing an object / Checking what someone says
18 Match the pictures and the sentences.
[Images A–F: Illustrations of various items made of different materials, including a red T-shirt, a blue plastic cup, black leather jacket, spotted bag, striped socks, and spotted coin purse.]
1 It’s made of leather. It’s plain.
 2 It’s made of leather. It’s spotted.
 3 It’s made of plastic. It’s striped.
 4 It’s made of plastic. It’s plain.
 5 It’s made of cotton. It’s plain.
 6 It’s made of cotton. It’s striped.
19 Put the words in order to make dialogues. Then listen and check.
1 A made / your / what’s / of / bag / ?
     What’s your bag made of?
   B made / it’s / leather / of / .
     It’s made of leather.
2 C tie / your / what’s / like / ?
     What’s your tie like?
   D blue / it’s / white spots / with / .
     It’s blue with white spots.
3 E sure / you / are / ?
     Are you sure?
   F am / yes, / I / was it / expensive / really / .
     Yes, I am. It was really expensive.
4 G certain / are / you / ?
     Are you certain?
   H not / no, / I / ’m / with / blue spots / it’s / white / .
     No, I’m not. It’s white with blue spots.
WORD FILE
Inside a room
[Image: Cross-section view of a modern apartment interior, labelled with vocabulary items]
wardrobe
bed
bedside table
carpet
fridge
cooker
curtain
sink
cupboard
table
chair
sofa
armchair
lamp
radiator
rug
Houses and homes
[Image: House exterior with garden and trailer. A separate inset shows a stilt house on an island.]
roof
wall
window
staircase
cellar
trailer (American English)
tree house
stilts
reed
island
ground
Page 96
Possessive pronouns
[Illustration description: A colorful park scene with different people and animals. Each person is associated with a possessive pronoun using yellow speech bubbles:]
A woman and man walking two dogs → “ours”
A woman on a bench reaching out → “theirs”
A boy sitting on grass holding a cat → “mine”
A woman pointing at something → “hers”
A boy with a bird on his shoulder → “his”
A girl handing a star-shaped object to a boy → “yours”
MORE Words and Phrases
English	Example Sentence	Deutsch
furniture	In our house, there’s lots of furniture.	Möbel
whose	Whose pen is this?	wessen
American	My mom is American.	Amerikaner/in; amerikanisch
cellar	There’s a big cellar underneath our house.	Keller
Central Asia	The Mongolian people in Central Asia move their houses a lot.	Zentralasien
electricity	The trailers can be connected to electricity and water.	Elektrizität
to float	Fifty islands of reed float on the water.	treiben; schweben
moveable	The Mongolian people have moveable houses.	beweglich
underneath	There might be a cellar underneath the house.	unterhalb
to transport	They can transport their homes.	transportieren
hammock	I have a new hammock. I like sleeping in it.	Hängematte
cotton	My jacket is made of cotton.	Baumwolle
leather	She doesn’t wear leather shoes because she wants to protect animals.	Leder
material	What material did they use to build this house?	Material
metal	It’s made of metal.	Metall
pattern	The shirt has a striped pattern.	Muster
plain	It’s plain white.	einfarbig
plastic	This bottle is made of plastic.	Plastik
pond	She falls in the pond.	Teich
seat	Take a seat.	(Sitz-)Platz
spotted	I can’t find my spotted sunglasses.	gepunktet
strap	I’ve got a watch with a blue strap.	Band
striped	My T-shirt is striped.	gestreift

```

## Output contract

Write `content/corpus/units/g2-u11/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u11",
  "briefBank": "dbdedfccfbc4",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u11.s.possessive-pronouns",
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
