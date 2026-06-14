# Grammar generation brief — g1-u01 (MORE! 1, Unit 1)

<!-- domigo:gen grammar g1-u01 bank=6b8c1ede4887 prompt=4b9164076103 -->

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

### `g1u01.s.contractions` — Basic contractions (Kurzformen (Kontraktionen))

Shortening two words into one with an apostrophe (I'm, it's, isn't, what's), and keeping it's apart from its.

v1 floor for this structure: **42 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [contractions-apostrophe]: A contraction joins two words into one. The apostrophe (') shows where letters are missing.
  - DE: Eine Kurzform verbindet zwei Wörter zu einem. Der Apostroph (') zeigt, wo Buchstaben fehlen.
  - "I am → I'm" — "I am → I'm"
  - "What is → What's" — "What is → What's"
  - "is not → isn't" — "is not → isn't"
- rule [contractions-its-vs-its]: Don't mix up it's (= it is) with its (= belonging to it).
  - DE: Verwechsle nicht it's (= it is) mit its (= sein/ihr, Besitz).
  - "It's a nice day. (= It is)" — "Es ist ein schöner Tag."
  - "The dog loves its ball. (= possession)" — "Der Hund liebt seinen Ball."

common errors:
- Leaving out the apostrophe in a contraction.: ✗ "Im from Vienna." → ✓ "I'm from Vienna."
- Confusing it's (it is) with its (possessive).: ✗ "The cat is eating it's food." → ✓ "The cat is eating its food."

SB box `g1/sb/SB Unit 1- Time for school.txt#grammar-1` — ▶️ Plural nouns (Mehrzahlformen) + irregular plurals (1):
```
Du bildest den Plural von Nomen üblicherweise, indem du ein -s an das Nomen hängst.
a dog – 4 dogs a bear – 7 bears
🔍 Kannst du im Text auf S. 11 (The wide-mouthed frog) drei unterschiedliche Nomen im Plural finden? Wie heißen sie?
Wenn ein Nomen auf einen Konsonanten + y endet (z. B. -by), schreibt man die Pluralendung so:
a baby – 8 babies (y → ies) Aber: a boy – 3 boys
Achtung: Es gibt auch Ausnahmen!
a child – five children a fish – three fish
▶️ Questions (Fragen)
So fragst du nach dem Namen, der E-Mail-Adresse und wie es jemandem geht:
What's your name? – I'm Sue. (I am ...) What's your email address? / Can you spell it, please? How are you? – I'm fine, thanks. And you?
▶️ Imperatives (Befehlsformen)
So sagst du, dass jemand etwas tun soll:
Stand up! Close the window! Open your books! Take out your books!
So sagst du, dass jemand etwas nicht tun soll:
Don't stand up! (Do not ...!) Don't open your books! Don't close the window! Don't take out your books!
🔍 Suche in Übung 16 einen weiteren Satz, in dem ausgedrückt wird, dass jemand etwas nicht tun soll.
Schreibe den Satz hier auf: ............................................................................ .......................................................................................
⏪ Now go back to page 8. Check ☑ with a partner what you know / can do.
🔵 WB p. 6, 7, 8 🌐 CYBER Homework 3
```

v1 seed items (UNTRUSTED):
- `m1-u1-contractions-gf-001` [gap-fill, d1]: p="___ from Vienna. (I am — use the short form)" c="I'm" a=["I'm"] ds=["Im","I,m","Iam"]
- `m1-u1-contractions-gf-002` [gap-fill, d1]: p="___ your name? (What is — use the short form)" c="What's" a=["What's"] ds=["Whats","What,s","What is"]
- `m1-u1-contractions-gf-003` [gap-fill, d2]: p="___ a sunny day today. (It is — use the short form)" c="It's" a=["It's"] ds=["Its","It,s","Is"]
- `m1-u1-contractions-gf-004` [gap-fill, d2]: p="That ___ right. (is not — use the short form)" c="isn't" a=["isn't","is not"] ds=["isnt","is'nt","not is"]
- `m1-u1-contractions-gf-005` [gap-fill, d3]: p="___ go to the park! (Let us — use the short form)" c="Let's" a=["Let's"] ds=["Lets","Let,s","Let us"]
- `m1-u1-contractions-gf-006` [gap-fill, d4]: p="The cat is eating ___ food. (belonging to it — NO apostrophe!)" c="its" a=["its"] ds=["it's","it is","his"]
- `m1-u1-contractions-mc-001` [multiple-choice, d1]: p="Choose the correct contraction for 'I am':" c="I'm" a=["I'm"] ds=["Im","I,m","Iam"]
- `m1-u1-contractions-mc-002` [multiple-choice, d3]: p="Which sentence uses 'it's' correctly?" c="It's a beautiful day." a=["It's a beautiful day."] ds=["The dog loves it's bone.","It's name is Buddy.","The cat wags it's tail."]
- `m1-u1-contractions-mc-003` [multiple-choice, d4]: p="Which is the correct contraction of 'is not'?" c="isn't" a=["isn't"] ds=["isnt","is'nt","is'not"]
- `m1-u1-contractions-ec-001` [error-correction, d2]: p="Find and fix the mistake: Im from Austria." c="I'm from Austria." a=["I'm from Austria.","i'm"] ds=[]
- `m1-u1-contractions-ec-002` [error-correction, d3]: p="Find and fix the mistake: The cat is eating it's food." c="The cat is eating its food." a=["The cat is eating its food.","its"] ds=[]
- `m1-u1-contractions-ec-003` [error-correction, d4]: p="Find and fix the mistake: Whats your favourite colour?" c="What's your favourite colour?" a=["What's your favourite colour?","what's"] ds=[]
- `m1-u1-contractions-tf-001` [transformation, d1]: p="You are texting your friend and want to be quick. Write the short form: I am happy. → ___" c="I'm happy." a=["I'm happy.","I am happy."] ds=[]
- `m1-u1-contractions-tf-002` [transformation, d2]: p="Your teacher wants the full sentence on the test. Write the long form: It isn't cold. → ___" c="It is not cold." a=["It is not cold.","It isn't cold.","it's not cold."] ds=[]
- `m1-u1-contractions-tr-001` [translation, d2]: p="🇩🇪 Ich bin aus Graz. (use the short form)" c="I'm from Graz." a=["I'm from Graz.","I am from Graz."] ds=[]
- `m1-u1-contractions-tr-002` [translation, d3]: p="🇩🇪 Es ist nicht kalt heute. (use contractions)" c="It isn't cold today." a=["It isn't cold today.","It's not cold today.","It is not cold today.","it'sn't cold today.","Today it isn't cold","Today it's not cold","Today it is not cold","Today it'sn't cold"] ds=[]
- `m1-u1-contractions-gf-007` [gap-fill, d3]: p="The dog is wagging ___ tail happily." c="its" a=["its"] ds=["it's","his","their"]
- `m1-u1-contractions-sb-001` [sentence-building, d2]: p="Put the words in the correct order: name / What's / your" c="What's your name?" a=["What's your name?","what is your name?"] ds=[]
- `m1-u1-contractions-mt-001` [matching, d1]: p="Match the long form to the short form: 1) I am 2) it is 3) is not 4) Let us — a) isn't b) Let's c) I'm d) it's" c="{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"b\"}"] ds=[]
- `m1-u1-contractions-ff-001` [free-form, d2]: p="You're writing a quick text to your friend. Use the short form. Write the short form: I am happy. → ___ happy." c="I'm" a=["I'm","I'm happy","I'm happy."] ds=[]
- `m1-u1-contractions-gf-008` [gap-fill, d1]: p="He ___ (is) a good student." c="'s" a=["'s","is"] ds=["s","are","am"]
- `m1-u1-contractions-gf-009` [gap-fill, d2]: p="We ___ (are not) going today." c="aren't" a=["aren't","are not"] ds=["isn't","don't","wasn't"]
- `m1-u1-contractions-gf-010` [gap-fill, d1]: p="I ___ (am) very happy!" c="'m" a=["'m","am"] ds=["m","is","are"]
- `m1-u1-contractions-gf-011` [gap-fill, d2]: p="She ___ (is not) at home." c="isn't" a=["isn't","is not"] ds=["aren't","don't","wasn't"]
- `m1-u1-contractions-gf-012` [gap-fill, d2]: p="They ___ (are) really friendly." c="'re" a=["'re","are"] ds=["re","is","am"]
- `m1-u1-contractions-gf-013` [gap-fill, d3]: p="___ (That is) a great idea!" c="That's" a=["That's"] ds=["Thats","That are","Thats'"]
- `m1-u1-contractions-mc-004` [multiple-choice, d2]: p="Short form of 'you are'?" c="you're" a=["you're"] ds=["your","you'r","youre"]
- `m1-u1-contractions-mc-005` [multiple-choice, d2]: p="Which is correct?" c="It's cold outside." a=["It's cold outside."] ds=["Its cold.","It is' cold.","Its' cold."]
- `m1-u1-contractions-mc-006` [multiple-choice, d1]: p="Short form of 'I am'?" c="I'm" a=["I'm"] ds=["Im","I'am","Iam"]
- `m1-u1-contractions-ec-004` [error-correction, d2]: p="Find and fix the mistake: Im happy!." c="I'm happy!" a=["I'm happy!","i'm"] ds=[]
- `m1-u1-contractions-ec-005` [error-correction, d2]: p="Find and fix the mistake: She isnt tired." c="She isn't tired." a=["She isn't tired.","She is not tired.","isn't"] ds=[]
- `m1-u1-contractions-ec-006` [error-correction, d3]: p="Find and fix the mistake: Their nice. (= They are nice)" c="They're nice." a=["They're nice."] ds=[]
- `m1-u1-contractions-tf-003` [transformation, d1]: p="Short form: She is my friend. → ___" c="She's my friend." a=["She's my friend.","She's my friend"] ds=[]
- `m1-u1-contractions-tf-004` [transformation, d2]: p="Long form: We aren't tired. → ___" c="We are not tired." a=["We are not tired.","We are not tired"] ds=[]
- `m1-u1-contractions-tr-003` [translation, d1]: p="Translate: Ich bin zwölf." c="I'm twelve." a=["I'm twelve.","I am twelve.","I'm twelve years old.","I am twelve years old."] ds=[]
- `m1-u1-contractions-tr-004` [translation, d2]: p="Translate: Er ist nicht hier." c="He isn't here." a=["He isn't here.","He's not here.","He is not here."] ds=[]
- `m1-u1-contractions-sb-002` [sentence-building, d1]: p="Put in order: I'm / Austria / from" c="I'm from Austria." a=["I'm from Austria."] ds=[]
- `m1-u1-contractions-sb-003` [sentence-building, d2]: p="Put in order: isn't / she / today / home / at" c="She isn't at home today." a=["She isn't at home today."] ds=[]
- `m1-u1-contractions-mt-002` [matching, d2]: p="Match: 1) I am 2) he is 3) we are 4) is not — a) he's b) I'm c) isn't d) we're" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"d\",\"4\":\"c\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"d\",\"4\":\"c\"}"] ds=[]
- `m1-u1-contractions-cp-001` [context-picker, d2]: p="Texting about weather. Correct contraction?" c="It's really warm!" a=["It's really warm!"] ds=["Its really warm!","It are warm!","Its' warm!"]
- `m1-u1-contractions-gs-001` [group-sort, d2]: p="Sort: full form or contraction?" c="{\"Full Form\":[\"I am|I am → I'm\",\"he is|he is → he's\",\"we are|we are → we're\",\"they have|they have → they've\",\"do not|do not → don't\"],\"Contraction\":[\"I'm|I'm = I am\",\"he's|he's = he is\",\"we're|we're = we are\",\"they've|they've = they have\",\"don't|don't = do not\"]}" a=[] ds=[]
- `m1-u1-contractions-mp-001` [matching-pairs, d1]: p="Find the pairs: full form ↔ contraction." c="[[\"I am\",\"I'm\"],[\"she is\",\"she's\"],[\"we are\",\"we're\"],[\"is not\",\"isn't\"],[\"do not\",\"don't\"],[\"cannot\",\"can't\"]]" a=[] ds=[]

### `g1u01.s.imperatives` — Imperatives (Befehlsformen (Imperativ))

Telling someone to do or not to do something, using the base form of the verb and Don't for the negative.

v1 floor for this structure: **41 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [imperatives-positive]: To tell someone to do something, use the base form of the verb (without to) and no subject.
  - DE: Um jemandem zu sagen, dass er etwas tun soll, verwendest du die Grundform des Verbs (ohne to) und kein Subjekt.
  - "Stand up!" — "Steh auf!"
  - "Open your books!" — "Öffnet eure Bücher!"
- rule [imperatives-negative]: To tell someone not to do something, use Don't (Do not) + base form.
  - DE: Um zu sagen, dass jemand etwas nicht tun soll, verwendest du Don't (Do not) + Grundform.
  - "Don't stand up!" — "Steh nicht auf!"
  - "Don't open your books!" — "Öffnet eure Bücher nicht!"

common errors:
- Adding to before the verb.: ✗ "To sit down, please." → ✓ "Sit down, please."
- Including the subject you.: ✗ "You sit down!" → ✓ "Sit down!"
- Using not instead of don't for the negative.: ✗ "Not speak!" → ✓ "Don't speak!"

SB box `g1/sb/SB Unit 1- Time for school.txt#grammar-1` — ▶️ Plural nouns (Mehrzahlformen) + irregular plurals (1):
```
Du bildest den Plural von Nomen üblicherweise, indem du ein -s an das Nomen hängst.
a dog – 4 dogs a bear – 7 bears
🔍 Kannst du im Text auf S. 11 (The wide-mouthed frog) drei unterschiedliche Nomen im Plural finden? Wie heißen sie?
Wenn ein Nomen auf einen Konsonanten + y endet (z. B. -by), schreibt man die Pluralendung so:
a baby – 8 babies (y → ies) Aber: a boy – 3 boys
Achtung: Es gibt auch Ausnahmen!
a child – five children a fish – three fish
▶️ Questions (Fragen)
So fragst du nach dem Namen, der E-Mail-Adresse und wie es jemandem geht:
What's your name? – I'm Sue. (I am ...) What's your email address? / Can you spell it, please? How are you? – I'm fine, thanks. And you?
▶️ Imperatives (Befehlsformen)
So sagst du, dass jemand etwas tun soll:
Stand up! Close the window! Open your books! Take out your books!
So sagst du, dass jemand etwas nicht tun soll:
Don't stand up! (Do not ...!) Don't open your books! Don't close the window! Don't take out your books!
🔍 Suche in Übung 16 einen weiteren Satz, in dem ausgedrückt wird, dass jemand etwas nicht tun soll.
Schreibe den Satz hier auf: ............................................................................ .......................................................................................
⏪ Now go back to page 8. Check ☑ with a partner what you know / can do.
🔵 WB p. 6, 7, 8 🌐 CYBER Homework 3
```

v1 seed items (UNTRUSTED):
- `m1-u1-imperatives-gf-001` [gap-fill, d1]: p="___ your books, please.." c="Open" a=["Open"] ds=["To open","Opens","Opening"]
- `m1-u1-imperatives-gf-002` [gap-fill, d1]: p="___ down, please.." c="Sit" a=["Sit"] ds=["To sit","Sits","You sit"]
- `m1-u1-imperatives-gf-003` [gap-fill, d2]: p="___ run in the corridor! (negative command)" c="Don't" a=["Don't","Do not"] ds=["Not","No","Doesn't"]
- `m1-u1-imperatives-gf-004` [gap-fill, d2]: p="___ to the teacher!." c="Listen" a=["Listen"] ds=["To listen","Listens","Listening"]
- `m1-u1-imperatives-gf-005` [gap-fill, d3]: p="___ speak German in English class! (negative command)" c="Don't" a=["Don't","Do not"] ds=["Not","Never not","Doesn't"]
- `m1-u1-imperatives-gf-006` [gap-fill, d4]: p="___ the door, please. It's very hot. (open — positive command)" c="Open" a=["Open"] ds=["You open","To open","Do open"]
- `m1-u1-imperatives-mc-001` [gap-fill, d1]: p="The teacher says: '___ your books to page 10.'" c="Open" a=["Open"] ds=["Opens","To open","Opened"]
- `m1-u1-imperatives-mc-002` [multiple-choice, d2]: p="Which is a correct negative command?" c="Don't touch that!" a=["Don't touch that!"] ds=["Not touch that!","No touch that!","Doesn't touch that!"]
- `m1-u1-imperatives-mc-003` [multiple-choice, d3]: p="Which sentence is an imperative (command)?" c="Close the window." a=["Close the window."] ds=["She closes the window.","He is closing the window.","They closed the window."]
- `m1-u1-imperatives-ec-001` [error-correction, d2]: p="Find and fix the mistake: Not speak in the library!" c="Don't speak in the library!" a=["Don't speak in the library!","Do not speak in the library!","don't","do not"] ds=[]
- `m1-u1-imperatives-ec-002` [error-correction, d3]: p="Find and fix the mistake: To sit down, please." c="Sit down, please." a=["Sit down, please."] ds=[]
- `m1-u1-imperatives-ec-003` [error-correction, d4]: p="Find and fix the mistake: You stand up now!" c="Stand up now!" a=["Stand up now!","Stand up!"] ds=[]
- `m1-u1-imperatives-tf-001` [transformation, d2]: p="Make this a negative command: Run in the corridor! → ___" c="Don't run in the corridor!" a=["Don't run in the corridor!","Do not run in the corridor!"] ds=[]
- `m1-u1-imperatives-tf-002` [transformation, d4]: p="Make this a positive command: You must not eat in class. → ___" c="Don't eat in class!" a=["Don't eat in class!","Don't eat in class.","Do not eat in class!"] ds=[]
- `m1-u1-imperatives-tr-001` [translation, d2]: p="🇩🇪 Öffne das Fenster!" c="Open the window!" a=["Open the window!","Open the window."] ds=[]
- `m1-u1-imperatives-tr-002` [translation, d3]: p="🇩🇪 Lauf nicht!" c="Don't run!" a=["Don't run!","Do not run!"] ds=[]
- `m1-u1-imperatives-sb-001` [sentence-building, d2]: p="Put the words in the correct order: the / don't / window / open" c="Don't open the window." a=["Don't open the window.","Don't open the window!","do not open the window."] ds=[]
- `m1-u1-imperatives-mt-001` [matching, d2]: p="Match the command to the correct situation: 1) Open the window. 2) Don't run! 3) Sit down. 4) Don't eat in class. — a) in the corridor b) it's hot in the room c) at the start of a lesson d) school canteen rule" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}"] ds=[]
- `m1-u1-imperatives-ff-001` [gap-fill, d2]: p="___ your books at page 12, please." c="Open" a=["Open"] ds=["You open","To open","Opens"]
- `m1-u1-imperatives-ff-002` [free-form, d3]: p="A student is eating in class. The teacher is not happy. Make it a negative command: Eat in class. → ___ in class." c="Don't eat" a=["Don't eat","Do not eat","Don't eat in class","Don't eat in class.","Do not eat in class","Do not eat in class."] ds=[]
- `m1-u1-imperatives-gf-007` [gap-fill, d1]: p="___ quiet, please!" c="Be" a=["Be"] ds=["Are","Is","Being"]
- `m1-u1-imperatives-gf-008` [gap-fill, d1]: p="___ the window. It's hot!" c="Open" a=["Open"] ds=["Opens","To open","You open"]
- `m1-u1-imperatives-gf-009` [gap-fill, d2]: p="___ eat too much chocolate!" c="Don't" a=["Don't","Do not"] ds=["Not","No","Doesn't"]
- `m1-u1-imperatives-gf-010` [gap-fill, d2]: p="___ your hands before lunch!" c="Wash" a=["Wash"] ds=["Washes","Washing","To wash"]
- `m1-u1-imperatives-gf-011` [gap-fill, d2]: p="___ forget your homework!" c="Don't" a=["Don't","Do not"] ds=["Not","Doesn't","Never"]
- `m1-u1-imperatives-gf-012` [gap-fill, d1]: p="___ at page 10, please." c="Look" a=["Look"] ds=["Looks","Looking","To look"]
- `m1-u1-imperatives-mc-004` [multiple-choice, d2]: p="Teacher wants class to stand. Which is correct?" c="Stand up, please!" a=["Stand up, please!"] ds=["Stands up, please!","You stand up!","To stand up!"]
- `m1-u1-imperatives-mc-005` [multiple-choice, d2]: p="Which negative command is correct?" c="Don't talk in the library!" a=["Don't talk in the library!"] ds=["Not talk!","Doesn't talk!","No talk!"]
- `m1-u1-imperatives-mc-006` [multiple-choice, d1]: p="PE teacher says:" c="Run faster!" a=["Run faster!"] ds=["Runs faster!","Running faster!","You run faster!"]
- `m1-u1-imperatives-ec-004` [error-correction, d2]: p="Find and fix the mistake: Not touch the hot pan!." c="Don't touch the hot pan!" a=["Don't touch the hot pan!","Do not touch the hot pan!","don't"] ds=[]
- `m1-u1-imperatives-ec-005` [error-correction, d2]: p="Find and fix the mistake: Closes the door, please." c="Close the door, please." a=["Close the door, please.","close"] ds=[]
- `m1-u1-imperatives-ec-006` [error-correction, d3]: p="Find and fix the mistake: To listen carefully!." c="Listen carefully!" a=["Listen carefully!"] ds=[]
- `m1-u1-imperatives-tf-003` [transformation, d2]: p="Make a command: 'You must be quiet.' → ___" c="Be quiet!" a=["Be quiet!","Be quiet"] ds=[]
- `m1-u1-imperatives-tf-004` [transformation, d3]: p="Negative: 'Touch my phone.' → ___" c="Don't touch my phone!" a=["Don't touch my phone!","Do not touch my phone!","Don't touch my phone"] ds=[]
- `m1-u1-imperatives-tr-003` [translation, d2]: p="Translate: Mach die Tür zu!" c="Close the door!" a=["Close the door!","Shut the door!"] ds=[]
- `m1-u1-imperatives-tr-004` [translation, d2]: p="Translate: Lauf nicht!" c="Don't run!" a=["Don't run!","Do not run!"] ds=[]
- `m1-u1-imperatives-sb-002` [sentence-building, d2]: p="Put in order: please / off / turn / phones / your" c="Turn off your phones, please." a=["Turn off your phones, please.","Please turn off your phones."] ds=[]
- `m1-u1-imperatives-sb-003` [sentence-building, d2]: p="Put in order: don't / classroom / in / eat / the" c="Don't eat in the classroom." a=["Don't eat in the classroom.","Don't eat in the classroom!"] ds=[]
- `m1-u1-imperatives-mt-002` [matching, d2]: p="Match: 1) Sit down! 2) Stand up! 3) Be quiet! 4) Listen! — a) Zuhören! b) Setzt euch! c) Steht auf! d) Leise!" c="{\"1\":\"b\",\"2\":\"c\",\"3\":\"d\",\"4\":\"a\"}" a=["{\"1\":\"b\",\"2\":\"c\",\"3\":\"d\",\"4\":\"a\"}"] ds=[]
- `m1-u1-imperatives-cp-001` [context-picker, d2]: p="Teacher wants class to listen. Correct command?" c="Listen to me, please!" a=["Listen to me, please!"] ds=["Listens to me!","To listen to me!","You listen to me!"]
- `m1-u1-imperatives-gs-001` [group-sort, d2]: p="Sort: positive or negative command?" c="{\"Positive\":[\"Sit down.\",\"Open your books.\",\"Listen carefully.\",\"Come here.\"],\"Negative\":[\"Don't run!\",\"Don't speak German.\",\"Don't touch that.\",\"Don't be late.\"]}" a=[] ds=[]

### `g1u01.s.plurals` — Plural nouns + irregular plurals (1) (Mehrzahlformen + unregelmäßige Plurale (1))

Forming the plural of nouns: regular -s, the consonant + y → -ies spelling change, and the first irregular plurals (child–children, fish–fish).

v1 floor for this structure: **45 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [plurals-regular-s]: Most nouns form the plural by adding -s.
  - DE: Den Plural von Nomen bildest du normalerweise, indem du ein -s anhängst.
  - "a dog – four dogs" — "ein Hund – vier Hunde"
  - "a bear – seven bears" — "ein Bär – sieben Bären"
- rule [plurals-consonant-y-ies]: When a noun ends in a consonant + y, the plural ending is -ies. But after a vowel + y, just add -s.
  - DE: Endet ein Nomen auf Konsonant + y, schreibst du die Pluralendung -ies. Steht ein Vokal vor dem -y, hängst du nur -s an.
  - "a baby – eight babies (y → ies)" — "ein Baby – acht Babys (y → ies)"
  - "a boy – three boys" — "ein Bub – drei Buben"
- rule [plurals-irregular-1]: Some nouns are exceptions: they have a special plural form you learn by heart.
  - DE: Manche Nomen sind Ausnahmen: Sie haben eine besondere Pluralform, die du auswendig lernst.
  - "a child – five children" — "ein Kind – fünf Kinder"
  - "a fish – three fish" — "ein Fisch – drei Fische"

common errors:
- Regularising an irregular plural.: ✗ "There are three childs in the garden." → ✓ "There are three children in the garden."
- Forgetting to change consonant + y to -ies.: ✗ "There are many babys here." → ✓ "There are many babies here."
- Capitalising nouns as in German.: ✗ "I have two Dogs." → ✓ "I have two dogs."

SB box `g1/sb/SB Unit 1- Time for school.txt#grammar-1` — ▶️ Plural nouns (Mehrzahlformen) + irregular plurals (1):
```
Du bildest den Plural von Nomen üblicherweise, indem du ein -s an das Nomen hängst.
a dog – 4 dogs a bear – 7 bears
🔍 Kannst du im Text auf S. 11 (The wide-mouthed frog) drei unterschiedliche Nomen im Plural finden? Wie heißen sie?
Wenn ein Nomen auf einen Konsonanten + y endet (z. B. -by), schreibt man die Pluralendung so:
a baby – 8 babies (y → ies) Aber: a boy – 3 boys
Achtung: Es gibt auch Ausnahmen!
a child – five children a fish – three fish
▶️ Questions (Fragen)
So fragst du nach dem Namen, der E-Mail-Adresse und wie es jemandem geht:
What's your name? – I'm Sue. (I am ...) What's your email address? / Can you spell it, please? How are you? – I'm fine, thanks. And you?
▶️ Imperatives (Befehlsformen)
So sagst du, dass jemand etwas tun soll:
Stand up! Close the window! Open your books! Take out your books!
So sagst du, dass jemand etwas nicht tun soll:
Don't stand up! (Do not ...!) Don't open your books! Don't close the window! Don't take out your books!
🔍 Suche in Übung 16 einen weiteren Satz, in dem ausgedrückt wird, dass jemand etwas nicht tun soll.
Schreibe den Satz hier auf: ............................................................................ .......................................................................................
⏪ Now go back to page 8. Check ☑ with a partner what you know / can do.
🔵 WB p. 6, 7, 8 🌐 CYBER Homework 3
```

v1 seed items (UNTRUSTED):
- `m1-u1-plurals-gf-001` [gap-fill, d1]: p="I have got three ___ (cat)." c="cats" a=["cats"] ds=["cates","cat","cats's"]
- `m1-u1-plurals-gf-002` [gap-fill, d2]: p="There are five ___ (bus) at the bus stop." c="buses" a=["buses"] ds=["buss","bus","bues"]
- `m1-u1-plurals-gf-003` [gap-fill, d2]: p="There are two ___ (baby) in the park." c="babies" a=["babies"] ds=["babys","babyes","babyies"]
- `m1-u1-plurals-gf-004` [gap-fill, d3]: p="I can see five ___ (child) in the playground." c="children" a=["children"] ds=["childs","childrens","childes"]
- `m1-u1-plurals-gf-005` [gap-fill, d3]: p="We need two ___ (box) for the books." c="boxes" a=["boxes"] ds=["boxs","boxies","box"]
- `m1-u1-plurals-gf-006` [gap-fill, d4]: p="The two ___ (woman) are my teachers." c="women" a=["women"] ds=["womans","womens","womanss"]
- `m1-u1-plurals-mc-001` [gap-fill, d1]: p="Choose the correct plural: Two ___" c="mice" a=["mice"] ds=["mouses","mices","mouse"]
- `m1-u1-plurals-mc-002` [multiple-choice, d2]: p="Which sentence is correct?" c="There are many cities in Austria." a=["There are many cities in Austria."] ds=["There are many citys in Austria.","There are many cityes in Austria.","There are many cityies in Austria."]
- `m1-u1-plurals-mc-003` [multiple-choice, d4]: p="Which plural is WRONG?" c="tooths" a=["tooths"] ds=["teeth","feet","children"]
- `m1-u1-plurals-ec-001` [error-correction, d2]: p="Find and fix the mistake: My foots are cold." c="My feet are cold." a=["My feet are cold.","feet"] ds=[]
- `m1-u1-plurals-ec-002` [error-correction, d3]: p="Find and fix the mistake: There are many babys in the hospital." c="There are many babies in the hospital." a=["There are many babies in the hospital.","babies"] ds=[]
- `m1-u1-plurals-ec-003` [error-correction, d2]: p="Find and fix the mistake: I have two Dogs at home." c="I have two dogs at home." a=["I have two dogs at home."] ds=[]
- `m1-u1-plurals-tf-001` [transformation, d2]: p="Your teacher asks you to say the plural. She says: 'one child, two...' Write the plural: one child → two ___" c="children" a=["children","two children"] ds=[]
- `m1-u1-plurals-tf-002` [transformation, d3]: p="You are ordering food at the school canteen. How many do you want? Write the plural: one sandwich → four ___" c="sandwiches" a=["sandwiches","four sandwiches"] ds=[]
- `m1-u1-plurals-tr-001` [translation, d3]: p="Translate into English: Ich habe drei Bücher." c="I have got three books." a=["I have got three books.","I've got three books.","I have three books.","I've three books."] ds=[]
- `m1-u1-plurals-tr-002` [translation, d4]: p="🇩🇪 Es gibt viele Kinder im Park." c="There are many children in the park." a=["There are many children in the park.","There are a lot of children in the park.","There are many kids in the park.","There are a lot of kids in the park.","There are lots of children in the park.","There are lots of kids in the park."] ds=[]
- `m1-u1-plurals-gf-007` [gap-fill, d3]: p="There are three ___ (man) in the garden." c="men" a=["men"] ds=["mans","man","mens"]
- `m1-u1-plurals-sb-001` [sentence-building, d2]: p="Put the words in the correct order: are / six / there / in / fish / the / pond" c="There are six fish in the pond." a=["There are six fish in the pond."] ds=[]
- `m1-u1-plurals-mt-001` [matching, d2]: p="Match the singular form to its correct plural: 1) foot 2) child 3) mouse 4) woman — a) women b) feet c) children d) mice" c="{\"1\":\"b\",\"2\":\"c\",\"3\":\"d\",\"4\":\"a\"}" a=["{\"1\":\"b\",\"2\":\"c\",\"3\":\"d\",\"4\":\"a\"}"] ds=[]
- `m1-u1-plurals-ff-002` [free-form, d3]: p="The dentist asks you to open wide. He's checking your... Write the plural: tooth → ___" c="teeth" a=["teeth"] ds=[]
- `m1-u1-plurals-gf-008` [gap-fill, d1]: p="I have two ___ (dog) at home." c="dogs" a=["dogs"] ds=["doges","dog","dogges"]
- `m1-u1-plurals-gf-009` [gap-fill, d2]: p="She has four ___ (class) today." c="classes" a=["classes"] ds=["classs","class","classis"]
- `m1-u1-plurals-gf-010` [gap-fill, d2]: p="There are six ___ (box) on the shelf." c="boxes" a=["boxes"] ds=["boxs","box","boxies"]
- `m1-u1-plurals-gf-011` [gap-fill, d3]: p="I can see three ___ (sheep) in the field." c="sheep" a=["sheep"] ds=["sheeps","sheepes","sheepen"]
- `m1-u1-plurals-gf-012` [gap-fill, d2]: p="We need five ___ (plate) for dinner." c="plates" a=["plates"] ds=["plats","plate","platees"]
- `m1-u1-plurals-gf-013` [gap-fill, d3]: p="The ___ (knife) are in the drawer." c="knives" a=["knives"] ds=["knifes","knifs","knifves"]
- `m1-u1-plurals-mc-004` [multiple-choice, d2]: p="Correct plural of 'watch'?" c="watches" a=["watches"] ds=["watchs","watchies","watchess"]
- `m1-u1-plurals-mc-005` [multiple-choice, d3]: p="Correct plural of 'person'?" c="people" a=["people"] ds=["persons","peoples","persones"]
- `m1-u1-plurals-mc-006` [multiple-choice, d1]: p="Correct plural of 'cat'?" c="cats" a=["cats"] ds=["cates","caties","catis"]
- `m1-u1-plurals-ec-004` [error-correction, d2]: p="Find and fix the mistake: I have three childs." c="I have three children." a=["I have three children.","children"] ds=[]
- `m1-u1-plurals-ec-005` [error-correction, d2]: p="Find and fix the mistake: Four dishs are on the table." c="Four dishes are on the table." a=["Four dishes are on the table.","dishes"] ds=[]
- `m1-u1-plurals-ec-006` [error-correction, d3]: p="Find and fix the mistake: Two mouses are here." c="Two mice are here." a=["Two mice are here.","mice"] ds=[]
- `m1-u1-plurals-tf-003` [transformation, d2]: p="Setting the table. Plural: one fork → three ___" c="forks" a=["forks"] ds=[]
- `m1-u1-plurals-tf-004` [transformation, d3]: p="At the farm. Plural: one goose → two ___" c="geese" a=["geese"] ds=[]
- `m1-u1-plurals-tr-003` [translation, d2]: p="Translate: Ich habe zwei Brüder." c="I have got two brothers." a=["I have got two brothers.","I have two brothers."] ds=[]
- `m1-u1-plurals-tr-004` [translation, d3]: p="Translate: Die Kinder spielen im Park." c="The children play in the park." a=["The children play in the park.","The children are playing in the park."] ds=[]
- `m1-u1-plurals-sb-002` [sentence-building, d2]: p="Put in order: five / are / there / apples / in / the / basket" c="There are five apples in the basket." a=["There are five apples in the basket."] ds=[]
- `m1-u1-plurals-sb-003` [sentence-building, d3]: p="Put in order: your / teeth / brush / twice / a / day" c="Brush your teeth twice a day." a=["Brush your teeth twice a day."] ds=[]
- `m1-u1-plurals-mt-002` [matching, d2]: p="Match: 1) leaf 2) wolf 3) wife 4) half — a) halves b) leaves c) wolves d) wives" c="{\"1\":\"b\",\"2\":\"c\",\"3\":\"d\",\"4\":\"a\"}" a=["{\"1\":\"b\",\"2\":\"c\",\"3\":\"d\",\"4\":\"a\"}"] ds=[]
- `m1-u1-plurals-cp-001` [context-picker, d2]: p="Your friend talks about pets. Which is correct?" c="She has two fish in her tank." a=["She has two fish in her tank."] ds=["She has two fishs.","She has two fishes.","She has two fishys."]
- `m1-u1-plurals-gs-001` [group-sort, d2]: p="Sort these nouns by their plural rule." c="{\"Add -s\":[\"cat|cats\",\"dog|dogs\",\"book|books\",\"pen|pens\"],\"Add -es\":[\"bus|buses\",\"box|boxes\",\"watch|watches\",\"dish|dishes\"],\"Irregular\":[\"child|children\",\"mouse|mice\",\"tooth|teeth\"]}" a=[] ds=[]
- `m1-u1-plurals-gs-002` [group-sort, d3]: p="Sort: which plural rule applies?" c="{\"Add -s\":[\"girl|girls\",\"table|tables\",\"friend|friends\"],\"Change -y to -ies\":[\"baby|babies\",\"city|cities\",\"story|stories\"],\"Add -es\":[\"glass|glasses\",\"fox|foxes\",\"potato|potatoes\"]}" a=[] ds=[]
- `m1-u1-plurals-mp-001` [matching-pairs, d2]: p="Find the pairs: singular ↔ plural." c="[[\"child\",\"children\"],[\"mouse\",\"mice\"],[\"tooth\",\"teeth\"],[\"foot\",\"feet\"],[\"man\",\"men\"],[\"woman\",\"women\"]]" a=[] ds=[]
- `m1-u1-plurals-ag-001` [anagram, d2]: p="Plural of \"child\":" c="children" a=["children"] ds=[]
- `m1-u1-plurals-ag-002` [anagram, d3]: p="Plural of \"woman\":" c="women" a=["women"] ds=[]

### `g1u01.s.questions-personal-info` — Questions (name, email, how are you) (Fragen (Name, E-Mail, wie geht's))

Asking for someone's name, email address and how they are, with the matching short answers.

v1 floor for this structure: **0 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [questions-name-email]: Ask for a name or email address with What's …?; ask someone to spell it with Can you spell it, please?
  - DE: Nach Namen oder E-Mail-Adresse fragst du mit What's …?; um das Buchstabieren bittest du mit Can you spell it, please?
  - "What's your name? – I'm Sue." — "Wie heißt du? – Ich bin Sue."
  - "What's your email address? Can you spell it, please?" — "Wie ist deine E-Mail-Adresse? Kannst du sie bitte buchstabieren?"
- rule [questions-how-are-you]: Ask how someone is with How are you? and answer with I'm fine, thanks. And you?
  - DE: Wie es jemandem geht, fragst du mit How are you?; du antwortest mit I'm fine, thanks. And you?
  - "How are you? – I'm fine, thanks. And you?" — "Wie geht es dir? – Mir geht es gut, danke. Und dir?"

common errors:
- Using the wrong question word for a name.: ✗ "Where is your name?" → ✓ "What is your name?"
- Answering How are you? with an age or name.: ✗ "How are you? – I'm eleven." → ✓ "How are you? – I'm fine, thanks."

SB box `g1/sb/SB Unit 1- Time for school.txt#grammar-1` — ▶️ Plural nouns (Mehrzahlformen) + irregular plurals (1):
```
Du bildest den Plural von Nomen üblicherweise, indem du ein -s an das Nomen hängst.
a dog – 4 dogs a bear – 7 bears
🔍 Kannst du im Text auf S. 11 (The wide-mouthed frog) drei unterschiedliche Nomen im Plural finden? Wie heißen sie?
Wenn ein Nomen auf einen Konsonanten + y endet (z. B. -by), schreibt man die Pluralendung so:
a baby – 8 babies (y → ies) Aber: a boy – 3 boys
Achtung: Es gibt auch Ausnahmen!
a child – five children a fish – three fish
▶️ Questions (Fragen)
So fragst du nach dem Namen, der E-Mail-Adresse und wie es jemandem geht:
What's your name? – I'm Sue. (I am ...) What's your email address? / Can you spell it, please? How are you? – I'm fine, thanks. And you?
▶️ Imperatives (Befehlsformen)
So sagst du, dass jemand etwas tun soll:
Stand up! Close the window! Open your books! Take out your books!
So sagst du, dass jemand etwas nicht tun soll:
Don't stand up! (Do not ...!) Don't open your books! Don't close the window! Don't take out your books!
🔍 Suche in Übung 16 einen weiteren Satz, in dem ausgedrückt wird, dass jemand etwas nicht tun soll.
Schreibe den Satz hier auf: ............................................................................ .......................................................................................
⏪ Now go back to page 8. Check ☑ with a partner what you know / can do.
🔵 WB p. 6, 7, 8 🌐 CYBER Homework 3
```

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Befehlsformen, Betty, Box, Carina, Carl, Chloe, Classroom, Dave, Dialog, Don, English, Freddy, Gordon, Homework, Imperatives, Irregular, Jenny, Julia, Leah, Mail, Mike, Nice, Nomen, Number, Numbers, Plural, Reihenfolge, School, Sue, Well, Zahlen

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 1- Time for school.txt -----
Page 8
Unit 1: Time for school
At the end of unit 1 ...
you know ☐ the alphabet ☐ the numbers 1–25 ☐ plural nouns / irregular plurals ☐ 10 words for colours, 11 school things and 11 classroom objects ☐ how to use imperatives (Befehlsformen)
you can ☐ meet and greet people ☐ understand and spell names / email addresses ☐ read and understand a short story about animals ☐ understand a short video about school uniforms ☐ understand, ask and answer simple questions ☐ understand and give instructions (Anweisungen) ☐ write about you and your classroom
A SONG 4 U
1/1+2 🔊 1 Listen and sing.
I want MORE!
[Image description: A photograph showing five diverse children standing against a blackboard, raising their arms in celebration]
Don't be shy, it's fun to speak. Say it in English, speak all week. Come on, listen, read and write. English only – day and night.
Hey, give me more, more, more. Really more, more, more? Give me more every day. Give me MORE! – that's the way!
English words are really cool. Grammar isn't just for school. Hello, world – here we come. We speak English, play the drum.
Hey, give me more, more, more. Really more, more, more? Give me more every day. Give me MORE! – that's the way!
From north to south, from east to west. We love our English, we're the best.
Hey, give me more, more, more. Really more, more, more? Give me more every day. Give me MORE! – that's the way!
Meet young people everywhere. Talk to them – here and there. Enjoy it and communicate. Every day and that is great.
Hey, give me more, more, more. Really more, more, more? Give me more every day. Give me MORE! – that's the way!
Pages 9
LISTENING & SPEAKING Asking someone to spell their name / email address
1/3 🔊 2 Listen and repeat the alphabet.
[Image description: Colorful alphabet letters A through Z displayed in a decorative style across multiple rows]
1/4 🔊 3 Listen and circle the correct letters in 2.
4 C H O I C E S
1/5 🔊 Listen to the dialogues. Then read them out in pairs.
A DIALOGUE 1
[Image description: Illustration of a boy and girl in school uniforms having a conversation]
Boy Hi, I'm Ahmed. What's your name? Girl I'm Chloe. Boy Nice to meet you, Clara. Girl Erm ... my name's Chloe. C – h – l – o – e. Boy Oh, I'm sorry. Girl That's OK, Ahmed.
B DIALOGUE 2
[Image description: Illustration of a girl and boy having a conversation, with the girl holding a phone]
Girl Hi, Noah. What's your email address? Boy It's noah11@zpin.com. Girl Can you spell it, please? Boy Yes, sure. N – o – a – h – one – one – at – z – p – i – n – dot – c – o – m. Girl Thank you.
👥 5 Work with a partner. Create a dialogue and act it out.
🔵 WB p. 8, 10
Page 10
VOCABULARY Numbers
1/6 🔊 6 Listen. Then write the numbers.
six twenty-two seventeen eight twelve fifteen ~~two~~
[Image description: Circular badges with numbers 1-25 displayed in a creative, colorful design:
one, two (crossed out), three, four, five, six (space for answer), seven
eight (space for answer), nine, ten, eleven, twelve (space for answer), thirteen
fourteen, fifteen (space for answer), sixteen, seventeen (space for answer), eighteen, nineteen
twenty, twenty-one, twenty-two (space for answer), twenty-three, twenty-four, twenty-five]
1/7 🔊 7 Look and count. Tick or correct the numbers. Then listen and check.
☑ 8 babies ☐ 12 frogs ☐ 25 balls ☐ 1 cat ☐7☒ bears ☐ 17 apples ☐ 7 dogs ☐ 12 fish
[Image description: A detailed illustration showing multiple brown teddy bears arranged together with various small animals including babies, frogs, ducks, and cats interspersed among them]
🔵 WB p. 4, 6
Page 11
READING
📖 8 a Look. What's the frog's name? ..........................................
b Read the story.
Note I'm = I am What's = What is
The wide-mouthed frog
[Image description: Illustration of a frog character with speech bubble saying "Hi. I'm a wide-mouthed frog!"]
Frog Hi. How are you? Gorilla I'm fine, thanks. What's your name? Frog I'm Freddy. I'm a wide-mouthed frog and I eat insects. And you? Gorilla I'm Gordon. I'm a gorilla and I eat bananas. Frog Well, nice to meet you! Bye, gorilla! Gorilla Bye, frog!
[Image description: Illustration showing a frog talking to a bear]
Frog Hi. How are you? Bear I'm fine, thanks. What's your name? Frog I'm Freddy. I'm a wide-mouthed frog and I eat insects. And you? Bear I'm Betty. I'm a bear and I eat honey. Frog Well, nice to meet you! Bye, bear! Bear Bye, frog!
[Image description: Illustration showing a frog talking to a crocodile with speech bubble saying "Oh, oh, oh! Well. I must go. Bye!"]
Frog Hi. How are you? Crocodile I'm fine, thanks. What's your name? Frog I'm Freddy. I'm a wide-mouthed frog and I eat insects. And you? Crocodile I'm Carl. I'm a crocodile and I eat ... wide-mouthed frogs! Frog Oh, oh, oh! Well. I must go. Bye!
9 How many of these tasks can you do?
Choose the correct answer. 1 Freddy is a ☐ frog. ☐ bear. ☐ crocodile. 2 Frogs eat ☐ honey. ☐ insects. ☐ bananas.
Answer the questions. 3 What animal is Betty? ............................................................. 4 What animal is Carl? .............................................................
Circle T (True) or F (False). 5 Carl eats honey. T / F 6 The wide-mouthed frog is not happy. T / F
1/8+9 🔊 10 Check your answers with a partner. Then listen to the story.
🔵 WB p. 9 🌐 CYBER Homework 1
Page 12
VOCABULARY School things
1/10 🔊 11 Listen and point. Then number the words.
☐ glue stick ☐ rubber ☐ pencil sharpener ☐ pen ☐ exercise book ☐ watercolours ☐ ruler ☐ scissors ☐ pencil case ☐ paintbrush ☐ pencil
[Image description: Illustration of a desk with various school supplies numbered 1-11, including a pencil case, ruler, watercolors, scissors, rubber, pencil, paintbrush, and other items]
LISTENING
1/11 🔊 12 a Look. What's the problem? b Listen and colour.
Midnight in the classroom
[Image description: Illustration of a nighttime classroom scene with animated school supplies. A speech bubble says "I hate pink!"]
red yellow blue orange green brown pink white black grey
🔵 WB p. 4 🌐 CYBER Homework 2
Page 13
OUR YOUNG WORLD 1
▶️ Luna's school uniform
[Image description: Photo of a young girl in school uniform standing in a classroom]
▶️ 1 Watch the video. What colour is Luna's tie? What's on it? .................................................................................................................................................................
▶️ 2 Watch again. Read the words and number the pictures.
1 hairband [Letters A-L labeling various clothing items in images] 2 hat 3 jeans 4 shirt 5 skirt 6 socks 7 sunglasses 8 T-shirt 9 tie 10 sweater 11 blazer 12 shoes
VOCABULARY: *introduce – (sich/jdn.) vorstellen; dark – dunkel; light – hell
School ties
1/12 🔊 3 Listen. Then read the texts and number them 1–4. Then say.
[Image description: Photo of a smiling young girl with speech bubble saying "Leah's tie is number ..."]
Note it's = it is
Hello, I'm Leah. I go to West Moors Middle School. My school tie is green and white. Can you find it?
Hi, I'm Leo. My school is Chester Comprehensive. My school tie is orange and black. Can you find it?
Hi, I'm Ellen. I go to St. Peter's School in York. My school tie is red, white and blue. Can you find it?
I'm Freddie. My school is the City of London School. Can you find my school tie? It's yellow and grey.
[Image description: Four different school ties numbered 1-4 showing different color patterns]
CYBER PROJECT: Our school uniform
4 Create a school uniform for your school: ● Make a school tie. ● Make a video.
🌐 CYBER Project 1
Page 14
VOCABULARY Classroom objects
Note isn't = is not
1/13 🔊 13 Listen. Are the sentences correct? Write ☑ or ☒.
[Image description: Classroom scene with numbered items 1-11 and two student photos with speech bubbles saying "Number 10 is correct." and "Number 8 isn't correct."]
1 window ☐ 2 projector ☐ 3 door ☐ 4 board ☐ 5 sound system ☐ 6 desk ☐ 7 tablet ☐ 8 chair ☒ 9 English book ☐ 10 floor ☑ 11 school bag ☐
👥 14 Work in pairs. Cover up 13. Can you remember?
What colour is the chair? It's brown and red.
LISTENING Understanding and giving instructions
Note don't = do not
1/14 🔊 15 Listen and number the pictures.
[Image description: Ten small illustrations showing various classroom actions like using a tablet, standing, writing on board, sitting, opening window, etc.]
16 Match the speech bubbles with the pictures in 15. Write the numbers.
Switch on your tablets. ☐ Clean the board. ☐ Don't open your books. ☐
Open the window. ☐ Sit down, children. ☐ Don't speak. ☐ Don't stand up. ☐
Close the door. ☐ Take out your books. ☐ Switch off your tablets. ☐
🔵 WB p. 5, 7, 8
Page 15
SOUNDS RIGHT /z/
1/15 🔊 17 Listen and repeat.
[Image description: Illustrations showing children playing with balls and frogs]
A baby, a ball, a bear and a dog.
2 babies, 3 balls, 4 bears and 5 frogs.
WRITING
18 Read Mike's text. Then write your own text and draw a picture.
[Image description: Photo of a young boy with glasses]
I'm Mike. I'm ten. I'm in class 1A. My email address is mike@linkways.com. In my classroom, the floor is green. The desks and the chairs are brown and black. The door is light green and the board is white. My pencil case is blue and red. Red is my favourite colour.
GRAMMAR
▶️ Plural nouns (Mehrzahlformen) + irregular plurals (1)
Du bildest den Plural von Nomen üblicherweise, indem du ein -s an das Nomen hängst.
a dog – 4 dogs a bear – 7 bears
🔍 Kannst du im Text auf S. 11 (The wide-mouthed frog) drei unterschiedliche Nomen im Plural finden? Wie heißen sie?
Wenn ein Nomen auf einen Konsonanten + y endet (z. B. -by), schreibt man die Pluralendung so:
a baby – 8 babies (y → ies) Aber: a boy – 3 boys
Achtung: Es gibt auch Ausnahmen!
a child – five children a fish – three fish
▶️ Questions (Fragen)
So fragst du nach dem Namen, der E-Mail-Adresse und wie es jemandem geht:
What's your name? – I'm Sue. (I am ...) What's your email address? / Can you spell it, please? How are you? – I'm fine, thanks. And you?
▶️ Imperatives (Befehlsformen)
So sagst du, dass jemand etwas tun soll:
Stand up! Close the window! Open your books! Take out your books!
So sagst du, dass jemand etwas nicht tun soll:
Don't stand up! (Do not ...!) Don't open your books! Don't close the window! Don't take out your books!
🔍 Suche in Übung 16 einen weiteren Satz, in dem ausgedrückt wird, dass jemand etwas nicht tun soll.
Schreibe den Satz hier auf: ............................................................................ .......................................................................................
⏪ Now go back to page 8. Check ☑ with a partner what you know / can do.
🔵 WB p. 6, 7, 8 🌐 CYBER Homework 3


----- WB: WB Unit 1 Time for school.txt -----
Unit 1: Time for school
Page 4
UNDERSTANDING VOCABULARY Numbers / Colours / School things
1 Verbinde die Wörter mit den Zahlen.
two seventeen
twenty-five twenty twelve
eight twenty-four eleven
five fifteen three
2 Schreib die Zahlwörter.
A 21
B 23
C 2
D 17
E 5
F 25
G 9
H 18
I 13
J 7
K 4
L 14
A ........................................................
B ........................................................
C ........................................................
D ........................................................
E ........................................................
F ........................................................
G ........................................................
H ........................................................
I ........................................................
J ........................................................
K ........................................................
L ........................................................
3 Lies die Sätze und mal die Gegenstände an.
Colour the pencil sharpener blue.
Colour the paintbrush red and brown.
Colour the rubber green and yellow.
Colour the pencil grey and blue.
Colour the glue stick yellow.
Colour the exercise book orange and blue.
Colour the scissors pink and brown.
Colour the watercolours green and orange.
Colour the pen blue and yellow.
Colour the ruler grey.
Colour the pencil case green, red and yellow.
Page 5
USING VOCABULARY Classroom objects
4 Schreib die richtigen Wörter.
[Image description: A classroom scene with desks, chairs, bags and classroom equipment. Numbered labels (1–11) point to objects in the picture for naming.]
1 ........................................................
2 ........................................................
3 ........................................................
4 ........................................................
5 ........................................................
6 ........................................................
7 ........................................................
8 ........................................................
9 ........................................................
10 ........................................................
11 ........................................................
5 Erkenne die Wörter aus 4 und schreib sie in die Liste.
board tablet chair door
floor window desk
sound system school bag projector English book
........................................................
........................................................
........................................................
........................................................
........................................................
........................................................
Page 6
UNDERSTANDING GRAMMAR Plural nouns / Irregular plurals
6 Hake an, was richtig ist. Kreuze an und bessere aus, was falsch ist.
[Image description: A large illustration showing many animals: gorillas, bears, frogs, cats, dogs, insects, crocodiles and fish in different quantities.]
☑ 8 gorillas
☒ 6 bears
☐ 11 frogs
☐ 19 insects
☐ 9 cats
☐ 7 dogs
☐ 1 fish
☐ 6 crocodiles
USING GRAMMAR Plural nouns / Irregular plurals
7 Schreib die Wörter aus der Box im Plural unter das richtige Bild.
fish
gorilla
crocodile
bear
insect
cat
frog
dog
1 ................. frogs
2 ....................................................
3 ....................................................
4 ....................................................
5 ....................................................
6 ....................................................
7 ....................................................
8 ....................................................
8 Schreib die Pluralformen und die Zahlwörter.
book (4) four books
desk (7) ....................................................
baby (2) ....................................................
boy (21) ....................................................
ball (25) ....................................................
banana (13) ....................................................
fish (12) ....................................................
child (19) ....................................................
tablet (11) ....................................................
pencil case (5) ....................................................
Page 7
UNDERSTANDING GRAMMAR Imperatives (Befehlsformen)
9 Ordne die Sätze den Bildern zu. Setze die Zahlen 1–6 ein.
[Image description: Six small pictures showing classroom actions such as taking scissors out, standing up, opening a window, and speaking.]
☐ Don’t speak.
☐ Take out your scissors.
☐ Open the window.
☐ Don’t sit down.
☐ Stand up.
☐ Don’t take out your books.
10 Kreuze die Bilder an, in denen die Anweisungen der Lehrerin nicht richtig befolgt werden.
1 Don’t write on the desk.
2 Close the window.
3 Don’t sing.
4 Take out your pencil case.
5 Don’t stand up.
6 Open the pencil case.
USING GRAMMAR Imperatives (Befehlsformen)
11 Vervollständige die Sätze.
1 ................................................ down.
2 ................................................ up.
3 ................................................ your books.
4 ................................................ your books.
Page 8
12 Bring die Wörter in die richtige Reihenfolge und schreib die Sätze.
1 green. / blue / colour / numbers / the / and
........................................................
2 the / close / don’t / door.
........................................................
3 pencil case / open / out / and / take / a / green pencil. / your
........................................................
4 your / don’t / school bags. / open
........................................................
13 Schreib die Anweisungen.
[Image description: Six pictures showing actions such as keeping quiet, sitting down, standing up, opening a door, closing a door, and not writing on the board.]
1 Don’t speak.
2 ....................................................
3 ....................................................
4 ....................................................
5 ....................................................
6 ....................................................
USING GRAMMAR Questions (Fragen)
14 Schreib die Fragen. Beantworte sie dann.
1 your / What’s / name / ?
........................................................
........................................................
2 email / your / address / What’s / ?
........................................................
........................................................
3 spell / please? / Can / it, / you
........................................................
........................................................
4 How / you / are / ?
........................................................
........................................................
Page 9
READING & WRITING Meeting and greeting people
15 Ergänze die Sätze in den Sprechblasen.
I’m fine
crocodile
I’m a wide-mouthed frog
I’m Gordon
I eat honey
are you
bear
eat bananas
name
eat
eat insects
Bye
[Image description: A cartoon scene with animals (frog, gorilla, bear, crocodile) talking to each other using speech bubbles.]
1 ....................................................
What’s your 2 .................................................... ?
Hi, 3 .................................................... .
I’m a gorilla.
I 4 .................................................... .
And you?
Hi, how 6 .................................................... ?
7 .................................................... thanks. What’s your name?
I’m Freddy. And you?
I’m Betty,
the 8 .................................................... , and
9 .................................................... .
I’m a 10 .................................................... ,
and I 11 .................................................... wide-mouthed frogs.
I must go. 12 .................................................... .
16 Höre dir die Dialoge an und überprüfe deine Arbeit.
Page 10
LISTENING & DIALOGUE WORK Asking/Answering simple questions
17 Höre dir den Dialog an und ergänze ihn.
Sebastian Hi, I’m Sebastian. And what’s your name?
Carina I’m Carina.
Sebastian Hi, Carina. What’s your 1 .................................................... ?
Carina It’s 2 .................................................... .
Sebastian Can you spell it, please?
Carina 3 ... – ... – ... – ... – ... – ... – 9 – @ – ... – ... – ... – ... – ... – ... – ... – ...
... – c – o – ... – ... – ...
Sebastian Thank you.
18 Bring den Dialog in die richtige Reihenfolge. Setze die Zahlen 1–5 ein. Höre dir ihn dann an und überprüfe deine Arbeit.
☐ Dave Hello, Jenny. I’m fine, thanks. And you?
☐ Dave Oh, I must go, Jenny. Bye!
☐ Jenny Bye, Dave.
☑ Jenny Hi, Dave. How are you?
☐ Jenny Great, thanks.
19 CHOICES
A Ergänze den Dialog mit den Wörtern aus der Box. Höre dir ihn dann an und überprüfe deine Arbeit.
is
How
meet
you
Andy Hi, Julia. 1 .................................................... are you?
Julia I’m fine, thanks, Andy. And 2 .................................................... ?
Andy I’m OK, thanks. Julia, this 3 .................................................... Tim.
Tim Hello, Julia.
Julia Hi, Tim. Nice to 4 .................................................... you.
Tim Nice to meet you too.
B Ergänze den Dialog.
Hi, I’m Tony. What’s your name?
1 ....................................................
Nice to meet you, Sue. How are you?
2 ....................................................
I’m great, thanks. Sue, this is Rick.
3 ....................................................
Hi, Sue.
Sorry. I must go. Bye-bye.
4 ....................................................
Bye-bye, Sue!
Page 11
20 Höre dir die Wörter an. Welche dieser Wörter kennst du bereits? Hake sie an.
a
the
and
yes
not
I
you
please
thank you
to say
to sing
boy
girl
school
apple
ball
cat
dog
bear
fish
frog
crocodile
gorilla
insect
honey
T-shirt
Hello!
Bye!
What’s your name?
My name is John.
I’m Joanna.
I’m sorry.
Numbers
1 one
2 two
3 three
4 four
5 five
6 six
7 seven
8 eight
9 nine
10 ten
11 eleven
12 twelve
13 thirteen
14 fourteen
15 fifteen
16 sixteen
17 seventeen
18 eighteen
19 nineteen
20 twenty
21 twenty-one
22 twenty-two
23 twenty-three
24 twenty-four
25 twenty-five
Colours
red
yellow
blue
green
orange
brown
pink
white
black
grey
Page 12
WORD FILE
In the classroom
[Image description: A labelled classroom illustration with yellow tags naming objects such as sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, watercolours, paintbrush, glue stick, pencil sharpener, rubber, pencil, floor.]
Cool clothes
[Image description: Two students in school uniforms walking outside a school building, with labels for hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe.]
Page 13
MORE Words and Phrases
to give Give me your school bag. geben
time It’s time for school. Zeit
to understand I understand the question. verstehen
to write Write the numbers. schreiben
1 to enjoy Enjoy the music. genießen
to listen Listen to the song. zuhören
to love I love blue. It’s my favourite colour. lieben
more I want more! mehr
to read Read the text. lesen
2 their What’s their address? ihr/e
4 to ask Can I ask you a question? fragen
(email) address My email address is sara@linkways.com. (E-Mail-)Adresse
How are you? Wie geht es dir/Ihnen/euch?
I am (= I’m) fine. Es geht mir gut.
to meet Nice to meet you! kennenlernen; sich treffen
then Listen to the dialogue. Then read it. dann, danach
your What’s your email address? dein/e; Ihr/e; euer/eure
7 to look Look at the animals. sehen, schauen; Schau mal.
or Tick or correct the numbers. oder
8 to eat I eat insects. essen; fressen
to go I must go. Bye. gehen
must I must go. müssen
9 how many How many frogs can you see? wie viele
12 to hate I hate pink. hassen, nicht ausstehen können
here Here’s your pencil case. hier
it It’s yellow. es
Let’s … Let’s sing a song! Lass(t) …
midnight It’s twelve o’clock – midnight. Mitternacht
our This is our school. unser/e
OWN
favourite Green is my favourite colour. Lieblings-
to find Can you find my school tie? finden
light My favourite colour is light blue. hell
15 child The child is in class 1A. Kind
to clean Clean the board. sauber machen, putzen
to close Close the door. schließen, zumachen
to open Open the window. öffnen, aufmachen
picture Look at the pictures. Bild
to sit down Sit down, children. sich (hin-)setzen
to speak Don’t speak. Listen. sprechen
to stand up Don’t stand up. Sit down. aufstehen
to take out Take out your books. herausnehmen
18 class I’m in class 1A. (Schul-)Klasse

```

## Output contract

Write `content/corpus/units/g1-u01/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u01",
  "briefBank": "6b8c1ede4887",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u01.s.contractions",
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
