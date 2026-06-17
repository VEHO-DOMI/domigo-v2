# Grammar generation brief — g1-u07 (MORE! 1, Unit 7)

<!-- domigo:gen grammar g1-u07 bank=629dca6525cf prompt=4b9164076103 -->

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

### `g1u07.s.adverbs-frequency` — Adverbs of frequency (Häufigkeitsadverbien)

Saying how often something happens (always, usually, often, sometimes, never) and where the adverb goes.

v1 floor for this structure: **21 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [adverbs-freq-position-main]: Frequency adverbs (always, usually, often, sometimes, never) go directly before the main verb.
  - DE: Häufigkeitsadverbien (always, usually, often, sometimes, never) stehen direkt vor dem Hauptverb.
  - "I never drink milk." — "Ich trinke nie Milch."
  - "I often read books." — "Ich lese oft Bücher."
- rule [adverbs-freq-position-be]: With the verb be (am/is/are), the frequency adverb goes after the verb.
  - DE: Beim Verb be (am/is/are) steht das Häufigkeitsadverb nach dem Verb.
  - "I'm always hungry." — "Ich bin immer hungrig."
  - "They're often late." — "Sie kommen oft zu spät."

common errors:
- Putting the adverb after the main verb (German word order).: ✗ "I eat always breakfast." → ✓ "I always eat breakfast."
- Putting the adverb before be instead of after it.: ✗ "She always is happy." → ✓ "She is always happy."

SB box `g1/sb/SB Unit 7- I love noodles.txt#grammar-1` — ▶️ Present simple negative:
```
So bildest du die Verneinung im Present simple:
I don't (do not) like vegetables. He/She/It doesn't (does not) like rice. We don't (do not) like carrots.
▶️ Articles a / an
Du verwendest an dann, wenn das folgende Wort mit einem Vokal (Selbstlaut) am Anfang ausgesprochen wird.
an old skateboard an egg an apple a banana a hot dog
Adverbs of frequency
I'm always hungry. 100% always Simon and I are usually tired. usually She often eats beef. often We sometimes have curry. sometimes I never drink milk. 0% ▼ never
🔍 Kreise die richtigen Wörter ein und bilde die Regel: Die Wörter always, usually, often, sometimes, never kommen ¹vor / nach dem Verb.
I never drink milk. I often read books.
Beim Verb to be (am/is/are) kommen die Wörter always, usually, often, sometimes, never ²vor / nach dem Verb.
I'm always hungry. They're often late.
[Image description: Cartoon of person watching TV with text "He always watches TV."]
⏪ Now go back to page 52. Check ☑ with a partner what you know / can do.
🔵 WB p. 60, 61, 62, 63 🌐 CYBER Homework 21
```

v1 seed items (UNTRUSTED):
- `m1-u7-adverbs-frequency-gf-001` [gap-fill, d1]: p="I ___ eat breakfast before school.." c="always" a=["always"] ds=["eat always","always am","am always"]
- `m1-u7-adverbs-frequency-gf-002` [gap-fill, d2]: p="She is ___ happy.." c="usually" a=["usually"] ds=["usually is","is usually","she usually"]
- `m1-u7-adverbs-frequency-gf-003` [gap-fill, d2]: p="He ___ drinks coffee.." c="never" a=["never"] ds=["drinks never","never doesn't","don't never"]
- `m1-u7-adverbs-frequency-gf-004` [gap-fill, d3]: p="We ___ go to the cinema on Saturdays.." c="sometimes" a=["sometimes"] ds=["go sometimes","sometimes goes","some times"]
- `m1-u7-adverbs-frequency-gf-005` [gap-fill, d4]: p="My parents are ___ tired after work.." c="often" a=["often"] ds=["often are","are often","tiredly often"]
- `m1-u7-adverbs-frequency-mc-001` [multiple-choice, d2]: p="Which sentence has the adverb in the correct position?" c="She always walks to school." a=["She always walks to school."] ds=["She walks always to school.","Always she walks to school.","She walks to school always."]
- `m1-u7-adverbs-frequency-mc-002` [multiple-choice, d3]: p="Which sentence is correct?" c="He is always late for school." a=["He is always late for school."] ds=["He always is late for school.","He late is always for school.","Always he is late for school."]
- `m1-u7-adverbs-frequency-mc-003` [multiple-choice, d5]: p="Choose the correct sentence with 'never':" c="I never eat fish." a=["I never eat fish."] ds=["I eat never fish.","I don't never eat fish.","I never don't eat fish."]
- `m1-u7-adverbs-frequency-sb-001` [sentence-building, d2]: p="Put the words in the correct order: always / I / eat / breakfast / at / seven" c="I always eat breakfast at seven." a=["I always eat breakfast at seven.","I always eat breakfast at seven"] ds=[]
- `m1-u7-adverbs-frequency-sb-002` [sentence-building, d3]: p="Put the words in the correct order: always / She / is / happy / in / the / morning" c="She is always happy in the morning." a=["She is always happy in the morning.","She is always happy in the morning"] ds=[]
- `m1-u7-adverbs-frequency-ec-003` [error-correction, d4]: p="Find and fix the mistake: He doesn't never drink milk." c="He never drinks milk." a=["He never drinks milk.","He doesn't ever drink milk.","never drinks","He does not ever drink milk."] ds=[]
- `m1-u7-adverbs-frequency-tf-001` [transformation, d2]: p="Rewrite with the correct word order: I walk to school. (+ usually)" c="usually" a=["usually","I usually walk to school.","I usually walk to school"] ds=[]
- `m1-u7-adverbs-frequency-tf-002` [transformation, d3]: p="Your brother is always tired in the morning. Add the word. Rewrite with the correct word order: He is tired. (+ often)" c="often" a=["often","He is often tired.","He is often tired"] ds=[]
- `m1-u7-adverbs-frequency-tr-001` [translation, d2]: p="🇩🇪 Ich esse immer Fruehstueck." c="I always eat breakfast." a=["I always eat breakfast.","I always have breakfast."] ds=[]
- `m1-u7-adverbs-frequency-tr-002` [translation, d4]: p="🇩🇪 Sie ist manchmal muede nach der Schule." c="She is sometimes tired after school." a=["She is sometimes tired after school.","Sometimes she is tired after school.","She's sometimes tired after school.","Sometimes she's tired after school."] ds=[]
- `m1-u7-adverbs-frequency-sb-003` [sentence-building, d3]: p="Put the words in the correct order: always / is / happy / she" c="She is always happy." a=["She is always happy.","She's always happy."] ds=[]
- `m1-u7-adverbs-frequency-mt-001` [matching, d1]: p="Match the adverb to its frequency: 1) always  2) never  3) sometimes  4) usually — a) 0%  b) 100%  c) about 50%  d) about 80%" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}"] ds=[]
- `m1-u7-adverbs-frequency-sb-004` [sentence-building, d5]: p="Put the words in the correct order: often / We / go / to / the / park / after / school" c="We often go to the park after school." a=["We often go to the park after school.","We often go to the park after school"] ds=[]
- `m1-u7-adverbs-frequency-gf-007` [gap-fill, d2]: p="She ___ does her homework on time. (100% of the time)" c="always" a=["always"] ds=["never","sometimes","often"]
- `m1-u7-adverbs-frequency-gf-008` [gap-fill, d3]: p="He is ___ late for school. (0% of the time)" c="never" a=["never"] ds=["always","sometimes","usually"]
- `m1-u7-adverbs-frequency-gs-001` [group-sort, d2]: p="Sort by meaning: how often?" c="{\"Always (100%)\":[\"always\",\"every day\"],\"Usually (80%)\":[\"usually\",\"normally\"],\"Sometimes (50%)\":[\"sometimes\",\"often\"],\"Never (0%)\":[\"never\"]}" a=[] ds=[]

### `g1u07.s.articles-a-an` — Articles a / an (Artikel a / an – ein/eine)

The indefinite article: a before a consonant sound, an before a vowel sound.

v1 floor for this structure: **21 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [articles-a-consonant]: Use a before a word that begins with a consonant sound.
  - DE: Verwende a vor einem Wort, das mit einem Konsonantenlaut beginnt.
  - "a banana" — "eine Banane"
  - "a hot dog" — "ein Hotdog"
- rule [articles-an-vowel]: Use an before a word that begins with a vowel sound.
  - DE: Verwende an vor einem Wort, das mit einem Vokallaut beginnt.
  - "an apple" — "ein Apfel"
  - "an old skateboard" — "ein altes Skateboard"

common errors:
- Using a before a vowel sound.: ✗ "I eat a apple every day." → ✓ "I eat an apple every day."
- Using an before a consonant sound.: ✗ "She goes to an university." → ✓ "She goes to a university."

SB box `g1/sb/SB Unit 7- I love noodles.txt#grammar-1` — ▶️ Present simple negative:
```
So bildest du die Verneinung im Present simple:
I don't (do not) like vegetables. He/She/It doesn't (does not) like rice. We don't (do not) like carrots.
▶️ Articles a / an
Du verwendest an dann, wenn das folgende Wort mit einem Vokal (Selbstlaut) am Anfang ausgesprochen wird.
an old skateboard an egg an apple a banana a hot dog
Adverbs of frequency
I'm always hungry. 100% always Simon and I are usually tired. usually She often eats beef. often We sometimes have curry. sometimes I never drink milk. 0% ▼ never
🔍 Kreise die richtigen Wörter ein und bilde die Regel: Die Wörter always, usually, often, sometimes, never kommen ¹vor / nach dem Verb.
I never drink milk. I often read books.
Beim Verb to be (am/is/are) kommen die Wörter always, usually, often, sometimes, never ²vor / nach dem Verb.
I'm always hungry. They're often late.
[Image description: Cartoon of person watching TV with text "He always watches TV."]
⏪ Now go back to page 52. Check ☑ with a partner what you know / can do.
🔵 WB p. 60, 61, 62, 63 🌐 CYBER Homework 21
```

v1 seed items (UNTRUSTED):
- `m1-u7-articles-gf-001` [gap-fill, d1]: p="I want ___ banana." c="a" a=["a"] ds=["an","the","---"]
- `m1-u7-articles-gf-002` [gap-fill, d1]: p="She eats ___ apple every day." c="an" a=["an"] ds=["a","the","---"]
- `m1-u7-articles-gf-003` [gap-fill, d2]: p="He wants ___ egg for breakfast." c="an" a=["an"] ds=["a","one","---"]
- `m1-u7-articles-gf-004` [gap-fill, d3]: p="I want ___ orange and ___ banana." c="an ... a" a=["an ... a"] ds=["a ... an","a ... a","an ... an"]
- `m1-u7-articles-gf-005` [gap-fill, d4]: p="She is ___ honest girl. She goes to ___ university." c="an ... a" a=["an ... a"] ds=["a ... an","a ... a","an ... an"]
- `m1-u7-articles-mc-001` [gap-fill, d1]: p="She has got ___ orange cat." c="an" a=["an"] ds=["a","the","---"]
- `m1-u7-articles-mc-002` [gap-fill, d2]: p="My dad is ___ teacher." c="a" a=["a"] ds=["an","the","---"]
- `m1-u7-articles-mc-003` [multiple-choice, d4]: p="Which sentence is correct?" c="He is an actor." a=["He is an actor."] ds=["He is a actor.","He is actor.","He is the actor."]
- `m1-u7-articles-ec-001` [error-correction, d2]: p="Find and fix the mistake: He is a actor in a film." c="He is an actor in a film." a=["He is an actor in a film.","an","he's an actor in a film."] ds=[]
- `m1-u7-articles-ec-002` [error-correction, d3]: p="Find and fix the mistake: I have got dog at home." c="I have got a dog at home." a=["I have got a dog at home.","I've got a dog at home."] ds=[]
- `m1-u7-articles-ec-003` [error-correction, d5]: p="Find and fix the mistake: She goes to an university in Vienna." c="She goes to a university in Vienna." a=["She goes to a university in Vienna.","a"] ds=[]
- `m1-u7-articles-tf-001` [transformation, d2]: p="Add 'a' or 'an': I eat ___ ice cream. → I eat ___ ice cream." c="an" a=["an","I eat an ice cream.","I eat an ice cream"] ds=[]
- `m1-u7-articles-tf-002` [transformation, d4]: p="Fill in 'a' or 'an' for each: ___ umbrella, ___ European country, ___ hour." c="an umbrella, a European country, an hour" a=["an umbrella, a European country, an hour"] ds=[]
- `m1-u7-articles-tr-001` [translation, d2]: p="🇩🇪 Ich möchte einen Apfel und eine Banane." c="I want an apple and a banana." a=["I want an apple and a banana.","I would like an apple and a banana."] ds=[]
- `m1-u7-articles-tr-002` [translation, d4]: p="🇩🇪 Mein Vater ist Lehrer." c="My father is a teacher." a=["My father is a teacher.","My dad is a teacher."] ds=[]
- `m1-u7-articles-sb-001` [sentence-building, d2]: p="Put the words in the correct order: elephant / is / an / It" c="It is an elephant." a=["It is an elephant.","It's an elephant."] ds=[]
- `m1-u7-articles-mt-001` [matching, d2]: p="Match 'a' or 'an' to each word: 1) ___ dog  2) ___ elephant  3) ___ umbrella  4) ___ cat — a) a  b) an  c) an  d) a" c="{\"1\":\"a\",\"2\":\"b\",\"3\":\"c\",\"4\":\"d\"}" a=["{\"1\":\"a\",\"2\":\"b\",\"3\":\"c\",\"4\":\"d\"}"] ds=[]
- `m1-u7-articles-gf-006` [gap-fill, d5]: p="My mum is ___ nurse and my dad is ___ engineer." c="a ... an" a=["a ... an"] ds=["an ... a","a ... a","--- ... ---"]
- `m1-u7-articles-gf-007` [gap-fill, d2]: p="I want ___ apple from the fruit bowl." c="an" a=["an"] ds=["a","the","some"]
- `m1-u7-articles-gf-008` [gap-fill, d3]: p="She is ___ best student in the class." c="the" a=["the"] ds=["a","an","---"]
- `m1-u7-articles-gs-001` [group-sort, d2]: p="Sort: does it need \"a\" or \"an\"?" c="{\"a\":[\"dog|a dog\",\"cat|a cat\",\"school|a school\",\"big house|a big house\",\"university|a university\"],\"an\":[\"apple|an apple\",\"egg|an egg\",\"ice cream|an ice cream\",\"orange|an orange\",\"hour|an hour\"]}" a=[] ds=[]

### `g1u07.s.present-simple-negative` — Present simple (negative) (Present simple (verneinte Form))

Forming negatives in the present simple with don't / doesn't + base verb.

v1 floor for this structure: **21 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [present-simple-neg-dont]: I/you/we/they + don't (do not) + base verb.
  - DE: I/you/we/they + don't (do not) + Grundform.
  - "I don't like vegetables." — "Ich mag kein Gemüse."
  - "We don't like carrots." — "Wir mögen keine Karotten."
- rule [present-simple-neg-doesnt]: he/she/it + doesn't (does not) + base verb (no -s on the verb!).
  - DE: he/she/it + doesn't (does not) + Grundform (kein -s am Verb!).
  - "He doesn't like rice." — "Er mag keinen Reis."
  - "She doesn't eat meat." — "Sie isst kein Fleisch."

common errors:
- Keeping the -s on the verb after doesn't.: ✗ "She doesn't eats breakfast." → ✓ "She doesn't eat breakfast."
- Using don't with he/she/it instead of doesn't.: ✗ "He don't like football." → ✓ "He doesn't like football."

SB box `g1/sb/SB Unit 7- I love noodles.txt#grammar-1` — ▶️ Present simple negative:
```
So bildest du die Verneinung im Present simple:
I don't (do not) like vegetables. He/She/It doesn't (does not) like rice. We don't (do not) like carrots.
▶️ Articles a / an
Du verwendest an dann, wenn das folgende Wort mit einem Vokal (Selbstlaut) am Anfang ausgesprochen wird.
an old skateboard an egg an apple a banana a hot dog
Adverbs of frequency
I'm always hungry. 100% always Simon and I are usually tired. usually She often eats beef. often We sometimes have curry. sometimes I never drink milk. 0% ▼ never
🔍 Kreise die richtigen Wörter ein und bilde die Regel: Die Wörter always, usually, often, sometimes, never kommen ¹vor / nach dem Verb.
I never drink milk. I often read books.
Beim Verb to be (am/is/are) kommen die Wörter always, usually, often, sometimes, never ²vor / nach dem Verb.
I'm always hungry. They're often late.
[Image description: Cartoon of person watching TV with text "He always watches TV."]
⏪ Now go back to page 52. Check ☑ with a partner what you know / can do.
🔵 WB p. 60, 61, 62, 63 🌐 CYBER Homework 21
```

v1 seed items (UNTRUSTED):
- `m1-u7-present-simple-negative-gf-002` [gap-fill, d2]: p="She ___ (not / eat) meat." c="doesn't eat" a=["doesn't eat","does not eat"] ds=["don't eat","doesn't eats","not eats"]
- `m1-u7-present-simple-negative-gf-003` [gap-fill, d2]: p="They ___ (not / play) tennis on Sundays." c="don't play" a=["don't play","do not play"] ds=["doesn't play","don't plays","not play"]
- `m1-u7-present-simple-negative-gf-004` [gap-fill, d3]: p="My brother ___ (not / watch) TV in the morning." c="doesn't watch" a=["doesn't watch","does not watch"] ds=["don't watch","doesn't watches","not watches"]
- `m1-u7-present-simple-negative-gf-005` [gap-fill, d4]: p="Tom ___ (not / go) to school on Saturdays and his sisters ___ (not / go) either." c="doesn't go ... don't go" a=["doesn't go ... don't go","does not go ... do not go"] ds=["don't go ... doesn't go","doesn't goes ... don't goes","doesn't go ... doesn't go"]
- `m1-u7-present-simple-negative-mc-001` [gap-fill, d2]: p="Tom ___ coffee." c="doesn't drink" a=["doesn't drink"] ds=["don't drink","doesn't drinks","not drinks"]
- `m1-u7-present-simple-negative-mc-002` [multiple-choice, d3]: p="Which sentence is correct?" c="She doesn't play football." a=["She doesn't play football."] ds=["She doesn't plays football.","She don't play football.","She no play football."]
- `m1-u7-present-simple-negative-mc-003` [multiple-choice, d4]: p="Choose the correct negative sentence about 'we':" c="We don't live in London." a=["We don't live in London."] ds=["We doesn't live in London.","We don't lives in London.","We no live in London."]
- `m1-u7-present-simple-negative-ec-001` [error-correction, d2]: p="Find and fix the mistake: He don't like vegetables." c="He doesn't like vegetables." a=["He doesn't like vegetables.","He does not like vegetables.","doesn't","does not"] ds=[]
- `m1-u7-present-simple-negative-ec-002` [error-correction, d3]: p="Find and fix the mistake: She doesn't plays the guitar." c="She doesn't play the guitar." a=["She doesn't play the guitar.","She does not play the guitar.","play"] ds=[]
- `m1-u7-present-simple-negative-ec-003` [error-correction, d5]: p="Find and fix the mistake: My cat doesn't likes milk." c="My cat doesn't like milk." a=["My cat doesn't like milk.","My cat does not like milk.","like"] ds=[]
- `m1-u7-present-simple-negative-tf-001` [transformation, d2]: p="Your friend thinks you like spinach, but you don't! Make this sentence negative: I like spinach. → I ___ spinach." c="don't like" a=["don't like","do not like","I don't like spinach.","I don't like spinach","I do not like spinach."] ds=[]
- `m1-u7-present-simple-negative-tf-002` [transformation, d3]: p="Tom used to play tennis but not any more. Make this sentence negative: He plays tennis. → He ___ tennis." c="doesn't play" a=["doesn't play","does not play","He doesn't play tennis.","He doesn't play tennis","He does not play tennis."] ds=[]
- `m1-u7-present-simple-negative-tr-001` [translation, d2]: p="🇩🇪 Ich mag keinen Fisch." c="I don't like fish." a=["I don't like fish.","I do not like fish."] ds=[]
- `m1-u7-present-simple-negative-tr-002` [translation, d4]: p="🇩🇪 Sie spielt nicht gerne Fussball. (= ein Mädchen)" c="She doesn't like playing football." a=["She doesn't like playing football.","She doesn't like to play football.","She does not like playing football.","She does not like to play football."] ds=[]
- `m1-u7-present-simple-negative-sb-001` [sentence-building, d3]: p="Put the words in the correct order: eat / doesn't / she / breakfast" c="She doesn't eat breakfast." a=["She doesn't eat breakfast.","She does not eat breakfast."] ds=[]
- `m1-u7-present-simple-negative-mt-001` [matching, d2]: p="Match the subject to the correct negative form: 1) I  2) She  3) They  4) He — a) doesn't like  b) don't like  c) doesn't eat  d) don't eat" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"d\",\"4\":\"c\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"d\",\"4\":\"c\"}"] ds=[]
- `m1-u7-present-simple-negative-gf-006` [gap-fill, d5]: p="Lisa ___ (not / study) French. She ___ (not / want) to learn it." c="doesn't study ... doesn't want" a=["doesn't study ... doesn't want","does not study ... does not want"] ds=["don't study ... don't want","doesn't studies ... doesn't wants","doesn't study ... don't want"]
- `m1-u7-present-simple-negative-ff-001` [free-form, d2]: p="Your sister says she likes pizza, but you're different. Make it negative: She likes pizza. → She ___ pizza." c="doesn't like" a=["doesn't like","does not like","She doesn't like pizza","She doesn't like pizza.","She does not like pizza."] ds=[]
- `m1-u7-present-simple-negative-ff-002` [free-form, d2]: p="Everyone thinks you like spiders, but you don't. Make it negative: I like spiders. → I ___ spiders." c="don't like" a=["don't like","do not like","I don't like spiders","I don't like spiders.","I do not like spiders."] ds=[]
- `m1-u7-present-simple-negative-cp-001` [gap-fill, d1]: p="I ___ (not / like) fish." c="don't like" a=["don't like","do not like"] ds=["doesn't like","not like","no like"]
- `m1-u7-present-simple-negative-gs-001` [group-sort, d2]: p="Sort: \"don't\" or \"doesn't\"?" c="{\"don't\":[\"I ___ like fish.|I don't like fish.\",\"We ___ have homework.|We don't have homework.\",\"They ___ play tennis.|They don't play tennis.\"],\"doesn't\":[\"She ___ eat meat.|She doesn't eat meat.\",\"He ___ like maths.|He doesn't like maths.\",\"It ___ work.|It doesn't work.\"]}" a=[] ds=[]

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?
- **g1-u05**: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar, boyfriend, its, to play, sister, can, cannot / can't, concert, to dance, Don't worry., job, perfect, to carry, to stand on, tongue, to touch, to walk on, to wiggle, can, to drink, hundred, in one go, Is that so?, This is me., economy, hospital, to laugh, (pocket) money, pound, profit, school canteen, table, teacher, uncle, to wash, nothing, Sorry?
- **g1-u06**: city, park, street, market, supermarket, river, woods, tree, to jump into the river, to look out the window, to pick something up, to sit in a tree, to fall out of the tree, to bump into a tree, to go to the park, to pull, to climb up a tree, to leave the office, to look in the mirror, to climb, to jump, to leave, mirror, to put on, away, (world's) best, detective, Help me!, office, to run, to find, to pull, to catch, clever, to come to, to live, nice, a lot of / lots of, to call, Come on!, to solve, to wait, to watch, street, to get up, to become, But it's true!, Go on., Well done.
- **g1-u07**: ice cream, chillies, fish, chicken, milk, butter, cheese, orange juice, tea, cucumber, sausages, beans, broccoli, carrot, onion, peas, an apple, mineral water, grapes, an orange, tomato (pl tomatoes), red pepper, kiwi, spinach, strawberry, sugar, bread, rice, egg, pasta, pizza, fries, chips, hamburger, chocolate, cake, breakfast, lunch, dinner, restaurant, always, usually, often, sometimes, never, meat, ham, healthy, to like, That's nice., any, to drink, to make, money, sandwich, some, vegetable, waiter, Have you got …?, I've got …, junk food, menu, Mum, plate, salad, soup, glass

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Annie, Arbeit, Articles, Bacon, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chloe, Christie, Classroom, Clown, Dan, Dana, Daniel, Dave, David, Davis, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Hmm, Holmes, Homework, Hook, Imperatives, Irregular, Jack, Jacob, James, Jamie, Jenny, Jessica, Jill, Julia, Jun, Kitty, Leah, Leo, Lethabo, Lewis, London, Lucy, Mail, Manchester, Mark, Marple, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Paws, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Present, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Sally, Saying, School, Sherlock, Steve, Sue, Tamar, Tamara, Text, Tick, Toby, Tock, Tom, True, Watson, Welcome, Well, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 7- I love noodles.txt -----
Page 52
Unit 7: I love noodles
At the end of unit 7 ...
you know ☐ 17 words for food ☐ how to use the present simple negative ☐ how to use the articles a and an ☐ how to use adverbs of frequency
you can ☐ say what food you and your family like or don't like ☐ say what food is healthy / not so healthy ☐ talk and write about your eating habits ☐ understand what other children around the world like or don't like ☐ understand a short sketch ☐ write an email
VOCABULARY Food
2/20 🔊 1 Listen. Then number the words.
☐ ham ☐ an apple ☐ an egg ☐ an orange ☐ cheese ☐ grapes ☐ brown bread ☐ nuts ☐ fish ☐ mineral water ☐ cucumbers ☐ ice cream ☐ red peppers ☐ meat ☐ sausages ☐ pumpkin ☐ milk ☐ corn
[Image description: 18 numbered food items including bread, carrots, cheese, egg, orange, glass of water, grapes, ice cream, fish, cucumber, nuts, red pepper, meat, apple, milk, pumpkin, lemon, meat, and corn]
SPEAKING Saying what you (don't) like / Saying what food is (not) healthy
👥 2 Work in groups. Say five things that are true for you.
I like orange juice. I don't like milk. Nuts are healthy. Sausages are not so healthy.
[Image description: Photo of students working together]
I like ... I don't like ... ... is/are healthy. ... is/are not so healthy.
SOUNDS RIGHT /t∫/
2/21 🔊 3 A chant. Listen and repeat.
Chicken, chicken, Lots of chicken, eggs and cheese. lots of cheese, Some more rice? and some rice. Oh, yes, please! Oh, that's nice!
[Image description: Cartoon of characters running with food]
🔵 WB p. 58, 59 🌐 CYBER Homework 19 (Revision)
Page 53
READING
4 Read about the children.
Kids around the world
[Image description: Three sections with photos and text about children from different countries]
⏵ I'm Linh.
I live in Saigon in Vietnam. In my family we often eat rice and noodles.
I really like noodles. In the morning, we usually have a soup with meat and noodles. My mum and my dad always put extra chillies into the soup, but I don't like chillies.
I love spring rolls*. You take rice paper and put meat or fish and vegetables on the rice paper. Then you roll it. I always put fish sauce on it. I love fish sauce.
For dessert I like rice pudding*. We also have a lot of fruit. My favourite fruit is papaya.
We all usually eat with chopsticks* – but not the rice pudding.
[Image description: Photo of spring rolls with sauce]
⏵ I'm Lethabo.
I live in Cape Town in South Africa. In our family meat is very important. My favourite is a sausage. We all like it, only my sister doesn't – she's a vegetarian. She never eats meat or sausages. She loves animals and she says it's bad for the climate to eat meat. She really likes pumpkins. And sometimes she eats a vegetable curry (when we have a fish or meat curry).
In the morning, we usually have tea and corn bread. My grandparents live in the country and they eat a lot of corn.
We sometimes have stew* and rice, and we often have meat. My family often comes together and grills lots of meat and sausages – and vegetables for my sister. There is music and food and we have a lot of fun.
[Image description: Photo of grilled meat and corn]
⏵ I'm Tamar.
I'm from Batumi in Georgia. For breakfast we often have bread and eggs and tomatoes – and bread, of course. My brother and I usually get up and buy the bread. It's still warm when we eat it.
For lunch or dinner we have soups, stews and kebabs and a lot of rice and potatoes. We also have very good salads and we like walnuts on a lot of our food. They're good for you.
We always drink tea.
My favourite food is bread with cheese in it. You can also put an egg on it. It's fantastic!
[Image description: Photo of cheese bread with egg]
VOCABULARY: *spring roll – Frühlingsrolle; rice pudding – Milchreis; chopstick – Essstäbchen; climate – Klima; stew – Eintopf
5 How many of these tasks can you do?
1 Linh likes / doesn't like chillies. 2 Linh always / sometimes puts fish sauce on her spring roll. 3 Linh uses chopsticks for most* / all meals. 4 Lethabo often eats vegetable curry. T / F 5 Lethabo has tea with corn bread. T / F 6 Lethabo's family enjoys music with their food. T / F 7 In the morning, Tamar and her brother often .................................................................................. . 8 Tamar says that salads in Georgia .................................................................................................. . 9 Tamar loves ........................................................................................................... very much.
VOCABULARY: *most – die meisten
6 Check your answers with a partner.
🔵 WB p. 63
Page 54
SPEAKING Talking about food and eating habits
2/22 🔊 7 Listen and complete the sentences with the words from the box.
always usually often sometimes never
[Image description: Four photos of people with speech bubbles containing sentences about eating habits]
I ¹................................. drink tea for breakfast. I ².................................. have soup for lunch.
I ³................................. drink milk. I ⁴.................................. have an egg for breakfast.
I ⁵.................................. eat rice and curry. We ⁶................................. have a pizza for lunch or dinner.
We ⁷................................. have fish on Friday. I ⁸.................................. have cereal* and an apple for breakfast.
VOCABULARY: *cereal – Müsli
👤 8 Say five sentences that are true for you. Write them down.
[Image description: Photo of a smiling person in kitchen]
I never eat rice and curry.
Note You can say: I sometimes drink milk for breakfast. I often eat cheese for lunch. Or: I sometimes have milk for breakfast. I often have cheese for lunch.
LISTENING & SPEAKING Saying what people like / don't like
2/23 🔊 9 Listen and tick. Then say four sentences about Kate and Mark.
👤
[Image description: Two profile cards]
Kate likes doesn't like ☐ apples ☐ apples ☐ oranges ☐ oranges ☐ bananas ☐ bananas ☐ kiwis ☐ kiwis
Mark likes doesn't like ☐ hamburgers ☐ hamburgers ☐ rice ☐ rice ☐ pizza ☐ pizza ☐ noodles ☐ noodles
🔵 WB p. 60, 61, 62 🌐 CYBER Homework 20
Page 55
👤 10 Look at the picture and say three things people in your family like and three things they don't like.
[Image description: Illustration of a vegetable market with labeled sections for SPINACH, ONIONS, TOMATOES, CARROTS, POTATOES, BROCCOLI, PEPPERS, PEAS, and BEANS. Two shoppers are shown with speech bubbles]
My mum/dad/sister/brother ... My best friend ...
My mum likes potatoes, but she doesn't like broccoli.
My mum likes carrots, but she doesn't like beans.
11 Two puzzles. Read and think. Find out why they like the food.
Nella
What they LIKE ☺ and DON'T LIKE ☹
Nella likes apples, but she doesn't like oranges. She likes cheese, but she doesn't like milk. She likes eggs, but she doesn't like chicken. She likes peppers, but she doesn't like cucumbers. She likes carrots, but she doesn't like tomatoes. She likes noodles, but she doesn't like rice. She likes spaghetti, but she doesn't like bread.
[Image description: Photos of orange, cucumber, carrots, and noodles]
Shu-hui
Shu-hui likes fish sauce, but he doesn't like fish. He likes spring rolls, but he doesn't like meat. He likes mineral water, but he doesn't like tea. He likes red peppers, but he doesn't like carrots. He likes brown bread, but he doesn't like cheese. He likes ice cream, but he doesn't like oranges.
[Image description: Photos of spring rolls, red pepper, bread, and ice cream sundae]
12 Work in pairs. Write your own puzzle. Then present your puzzle to another pair.
🔵 WB p. 60
Page 56
TIME FOR A SKETCH Burgers
2/24 🔊 13 Listen and complete the sketch with the words from the box.
funny really hungry week vegetable chips
Scene 1
Oliver Boy, I'm so ¹.............................. . Mary Yes, me too. Miss B (dinner lady) Hello, kids. What ...? Oliver Two burgers, please. Mary And chips*. Lots of chips, please. Oliver And ketchup. Lots of ketchup. Miss B We've also got a nice ²........................................... stew. Mary Uh, uh, no stew. Oliver And no veggies, I mean vegetables. Miss B (sighs) OK, OK.
[Image description: Photo of school lunch service with workers serving students]
Scene 2
Miss B And today? A vegetable stew? Oliver Very ³........................................ , Miss B. Mary Two burgers, please. Oliver And chips, please. Miss B Here you are. Two super burgers. And ⁴.............................. . No ketchup? Mary No, thank you. Not today.
[Image description: Photo of burgers on a platter]
Scene 3
Oliver (chewing) Mmmm, Miss B. This is a great burger. Miss B Is it? Oliver Yes, I really like it. Miss B And you, Mary? Mary (chewing) Fantastic. Miss B Burgers again for the rest of the ⁵........................................... ? Mary Yes, please. Oliver Why are they so good today? Miss B Well, one is a tofu burger and one is a veggie burger. Oliver Awww! No meat? Mary But they are ⁶........................................ good. Miss B I also think they are. So burgers tomorrow? Mary Yes, please. Oliver Yeah, OK. Miss B With some carrot cake*? Mary Errr ... Oliver Not really! No, thank you.
VOCABULARY: *chips – Pommes frites; cake – Kuchen
14 Read and act out the sketch. Who eats healthy food?
👥 15 In groups, plan and create your own role play. Act it out in class.
🔵 WB p. 64
Page 57
WRITING
16 C H O I C E S
Jacob is from Dublin. Read his email to you.
A Write an email to Jacob (30–35 words).
Tell him what you usually have for breakfast, lunch and dinner.
B Write your answer to Jacob (50–60 words). Use the words always, sometimes, often, usually, never.
Tell him: • what your family has for breakfast, lunch and dinner • what your family likes • what your family doesn't like
FROM: jacobl1@mailconnect.com SUBJECT: What I eat ...
Hi, How are you? Here are my answers to your question about my family and food. I always have tea for breakfast. I sometimes have an egg. My little brother doesn't like eggs. He has milk, bread and butter. For lunch we often have noodles. We sometimes have pizza. We sometimes go to a restaurant on Sunday. Then I have beef. My brother doesn't like beef. He has potatoes or rice or noodles. Bye, Jacob
GRAMMAR
▶️ Present simple negative
So bildest du die Verneinung im Present simple:
I don't (do not) like vegetables. He/She/It doesn't (does not) like rice. We don't (do not) like carrots.
▶️ Articles a / an
Du verwendest an dann, wenn das folgende Wort mit einem Vokal (Selbstlaut) am Anfang ausgesprochen wird.
an old skateboard an egg an apple a banana a hot dog
Adverbs of frequency
I'm always hungry. 100% always Simon and I are usually tired. usually She often eats beef. often We sometimes have curry. sometimes I never drink milk. 0% ▼ never
🔍 Kreise die richtigen Wörter ein und bilde die Regel: Die Wörter always, usually, often, sometimes, never kommen ¹vor / nach dem Verb.
I never drink milk. I often read books.
Beim Verb to be (am/is/are) kommen die Wörter always, usually, often, sometimes, never ²vor / nach dem Verb.
I'm always hungry. They're often late.
[Image description: Cartoon of person watching TV with text "He always watches TV."]
⏪ Now go back to page 52. Check ☑ with a partner what you know / can do.
🔵 WB p. 60, 61, 62, 63 🌐 CYBER Homework 21
Page 58
THE TWINS 3
▶️ The birthday present
Developing speaking competencies
Language function | Speaking strategy ☐ I can ask for something in a shop | ☐ I can express uncertainty (Unsicherheit) (beim Einkaufen nach etwas fragen) | ausdrücken)
VOCABULARY Presents for Mum
2/25 🔊 1 Match the words with the pictures. Then listen and check.
a book a purse a scarf a vase a bottle of perfume a necklace
[Image description: 6 numbered items - purse, vase, necklace, perfume bottle, scarf, and book]
2/26 🔊 2 Watch or listen to the dialogue. Then read it. What present do Lucy and Leo buy?
▶️
Assistant Can I help you? Lucy Yes. Can I see that vase, please? Assistant Here you are. Be careful. Lucy Thank you. Look, Leo. This is perfect for Mum. Leo Hmm. I don't know. How much is it? Assistant It's £23. Leo I'm not sure. That's nearly all our money. Lucy But it's perfect. Let's buy it. Assistant Would you like it in a bag? Lucy Yes, please.
[Image description: Photo of people in a shop]
Assistant Here you are ... and here's your change. £7. Lucy Thank you. Bye.
Page 59
3 Read the sentences and circle T (True) or F (False).
1 Lucy thinks the vase is a good present for Mum. T / F 3 Lucy wants the vase in a bag. T / F 2 Leo thinks the vase is cheap. T / F 4 Lucy gives the man £30. T / F
USEFUL PHRASES In a shop
4 Who says what? Write C (Customer) or S (Shop assistant).
1 Can I help you? ☐ 3 Let's buy it. ☐ 5 Can I see that vase, please? ☐ 2 Would you like it in a bag? ☐ 4 How much is it? ☐ 6 Here's your change. ☐
? What do you think? Answer the question.
• Is it the perfect present for Mum?
MOBILE HOMEWORK
▶️ Watch part 2 of the video and complete each sentence with one word.
1 ............................................ drops the bag. 2 They've only got ............................................ to buy a present. 3 Mum's birthday is on ............................................ . 4 They decide to make Mum a ............................................ . 5 The twins get a ............................................ from the library. 6 Dad gets Mum a ............................................ for her birthday.
SPEAKING STRATEGY Expressing uncertainty
5 Complete the dialogue with the words from the box. Then check with the dialogue in 2.
sure Lucy Thank you. Look, Leo. This is perfect for Mum. don't Leo Hmm. I ¹.............................. .............................. . How much is it? not Assistant It's £23. know Leo I'm ².............................. .............................. . That's nearly all our money.
6 C H O I C E S
👥 A Work in pairs.
A Suggest a present from 1 to buy. → B Express uncertainty.
Example: A Let's buy a bottle of perfume. B I don't know. How much is it?
👥 B ROLE PLAY: Work in pairs. You are in a shop. Student A wants to buy a present for his/her mum and dad. Student B is the shop assistant. Think of a role play. Take two or three minutes to practise it. Then act it out in class.
🔵 WB p. 64


----- WB: WB Unit 7 I love noodles.txt -----
Unit 7 I love noodles
Page 58–59
UNDERSTANDING VOCABULARY Food
1 Write the words from the box under the pictures.
brown bread
an orange
an egg
peppers
an apple
cucumber
mineral water
nuts
ham
cheese
fish
grapes
sausages
ice cream
corn
meat
pumpkin
milk
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
15 ........................................
16 ........................................
17 ........................................
18 ........................................
2 Tick the sentences that are true for you.
1 I love milk. ☐
2 I don’t like soup. ☐
3 I hate corn bread. ☐
4 I like fish. ☐
5 I love pizza. ☐
6 I don’t like tea. ☐
7 I like spinach. ☐
8 I hate oranges. ☐
9 I like mineral water. ☐
10 I don’t like ice cream. ☐
11 I like nuts. ☐
12 I don’t like tofu. ☐
3 Find and circle 14 more food words in the wordsearch and write them in the table (→↓).
Drinks | Vegetables | Fruit | Meat | Others
........................................
........................................
........................................
........................................
........................................
USING VOCABULARY Food
4 Complete the text with the correct words.
My favourite food is 1 ................................ with 2 ................................,
3 ................................ and 4 ................................ . I love it. I always
eat it on Fridays. My mum sometimes makes it for us at home. And we
sometimes go to a pizza restaurant. I also like 5 ................................,
6 ................................ and 7 ................................ . But not on pizza!
5 Write about your favourite food. Say:
• what your favourite food is: .................................................................
• how often you eat it: ........................................................................
• what other food you like: ....................................................................
Page 60
6 Follow the lines. Write the sentences and use the verb like.
Janie  monkeys  Oiana and Mark  Susie  Bill  my sister
1 Janie likes yogurt.
2 .........................................................................................
3 .........................................................................................
4 .........................................................................................
5 .........................................................................................
6 .........................................................................................
UNDERSTANDING GRAMMAR Articles a / an
7 Circle the correct word.
1 I’ve got a / an sister and three brothers.
2 I don’t want a / an apple, thanks.
3 We live in a / an big city.
4 Have you got a / an computer?
5 Take a / an umbrella with you.
6 Sue has got a / an orange bike.
7 Bob’s in a / an band.
8 Let’s watch a / an film.
UNDERSTANDING GRAMMAR Present simple negative
8 Complete the sentences with don’t or doesn’t.
1 He ................ like spinach.
2 They ................ live in a big house.
3 I ................ know the answer.
4 She ................ go to our school.
5 We ................ understand!
6 It ................ eat meat.
7 He ................ speak English.
8 You ................ play very well.
Page 61
UNDERSTANDING GRAMMAR Adverbs of frequency
9 Tick the sentences that are true for you.
1 I sometimes have chicken for dinner. ☐
2 I always have eggs for breakfast. ☐
3 I never have chocolate for lunch. ☐
4 I usually have soup for dinner. ☐
5 I sometimes have potatoes for lunch. ☐
6 I often have orange juice for breakfast. ☐
7 I usually have hot dogs for dinner. ☐
8 I never have fish for breakfast. ☐
9 I often have bread for breakfast. ☐
10 I always have pizza for lunch. ☐
USING GRAMMAR Articles a / an
10 Complete the text with a or an. Then colour the pictures.
Spoilt* Sally has got lots of
things. She has got 1 .................
parrot and 2 ................. angry
cat, 3 ................. orange laptop
and 4 ................. blue tablet,
5 ................. pink saxophone
and 6 ................. red keyboard.
Yes, spoilt Sally has got
everything!
VOCABULARY: *spoilt – verwöhnt; everything – alles
USING GRAMMAR Present simple negative
11 Complete the sentences with the negative form of the verb.
1 He likes apples, but he ................................ oranges.
2 She speaks Italian, but she ................................ English.
3 I like yogurt, but I ................................ milk.
4 He eats chicken, but he ................................ eggs.
5 I collect* lots of things, but I ................................ garden gnomes.
6 He plays football, but he ................................ volleyball.
7 You watch films on your laptop, but you ................................ television.
8 We go shopping on Saturdays, but we ................................ on Sundays.
VOCABULARY: *collect – sammeln
12 Write sentences that are true for you.
1 I / not like .................................................................
2 I / like .......................................................................
3 My friend / not speak .......................................................
4 My friends at school / not live .............................................
5 I / not play .................................................................
6 My mum and dad / not like ...................................................
7 I / not watch .................................................................
Page 62
USING GRAMMAR Adverbs of frequency
13 Look at the table. Write sentences. Put the verbs in the correct forms.
XXXXX = never  ✓✓XXX = sometimes  ✓✓✓XX = often  ✓✓✓✓X = usually  ✓✓✓✓✓ = always
1 My cat Jasper / ✓✓✓✓✓ / break / things.
.........................................................................................
2 He / be / ✓✓✓XX / happy.
.........................................................................................
3 He / ✓✓✓XX / watch / TV.
.........................................................................................
4 He / ✓✓✓✓X / go / out all day.
.........................................................................................
5 He / be / ✓✓✓✓✓ / hungry.
.........................................................................................
6 He / XXXXX / sleep / at night.
.........................................................................................
7 He / ✓✓✓✓X / play / with my dog.
.........................................................................................
14 Write the words in the correct order to make sentences.
1 never / Hammond / watches / TV. / Miss
.........................................................................................
2 at / always / football / play / school. / I
.........................................................................................
3 for / to / sometimes / Italy / we / holidays*. / go / our
.........................................................................................
4 friends. / plays / his / he / with / never / football
.........................................................................................
5 school / on / usually / they / bikes. / go / to / their
.........................................................................................
6 eggs / have / breakfast. / we / for / often
.........................................................................................
7 at / always / it / the / rains* / weekend.
.........................................................................................
8 late / school. / arrive* / sometimes / I / at
.........................................................................................
VOCABULARY: *holidays – Ferien; rain – regnen; arrive – (an-)kommen
15 Complete the sentences so they are true for you.
1 I sometimes ................................................................. .
2 I never ................................................................. .
3 I often ................................................................. .
4 My mum usually ................................................................. .
5 My dad always ................................................................. .
6 My best friend never ................................................................. .
Page 63
READING & WRITING Understanding what children (don’t) like / Writing an email
16 Read the texts. How many of the tasks below can you do?
FOOD and the BRITISH TEENAGER
Two teenagers talk about what they usually eat.
Harry (14, Manchester)
My favourite food is fish and chips! It’s delicious*.
My mum often does fish and chips at home on Fridays and I sometimes
go to the fish and chip shop with my friends on Saturday, too!
But I like other things, too. I love spaghetti – spaghetti bolognese is
one of my favourite things, with Parmesan cheese – mmmh! In my town
there’s a really good pizza restaurant and they make great spaghetti, too.
Jenny (15, Dorset)
I love fish, but not fish and chips. I like fish with rice or vegetables – tomatoes,
spinach or potatoes. It’s delicious!
I like fast food, too. I sometimes go to the pizza restaurant with my friends.
There’s a great hamburger restaurant here too and we often go there for lunch
on Saturday or Sunday.
I love oranges and kiwis, too – kiwis and ice cream is great! I eat it in the summer,
it’s wonderful*.
VOCABULARY: *delicious – köstlich; wonderful – wunderbar
Choose the correct answer.
1 Harry says, “My favourite food is
☐ spaghetti bolognese. ☐ fish and chips. ☐ pizza.”
2 Jenny doesn’t like
☐ fish and rice. ☐ fish and chips. ☐ fish and vegetables.
3 Jenny goes to the pizza restaurant with her
☐ best friend. ☐ friends. ☐ family.
Circle T (True) or F (False).
4 Harry sometimes has fish and chips at the weekend. T / F
5 Harry doesn’t like the pizza at the restaurant in his town. T / F
6 Jenny’s favourite vegetables are carrots and beans. T / F
Answer the questions.
7 Where does Harry eat fish and chips? ........................................
8 What does Harry like on his spaghetti? ........................................
9 What fruit does Jenny like? ........................................
17 Listen and check your answers.
18 Look at the texts in 16 again. Write a short email (30–35 words) about what your friend likes / doesn’t like to eat.
Page 64
LISTENING & DIALOGUE WORK Talking about food and eating habits
19 Listen to the children and tick the food words you hear. There are six extra words.
☐ kiwi  ☐ grapes  ☐ water  ☐ toast  ☐ apples  ☐ butter  ☐ pizza
☐ tea  ☐ cheese  ☐ beef  ☐ fish and chips  ☐ onion  ☐ vegetable stew
☐ Scotch egg  ☐ meat  ☐ sandwich  ☐ soup  ☐ sausage meat  ☐ milk  ☐ oranges
20 Listen again and circle the words Jamie says in red and the words Alissa says in blue.
21 CHOICES
A Complete the dialogue with the words from the box. Then listen and check.
chicken
favourite
always
loves
apple
hate
love
Billy  It’s Friday! Great. I 1 ................................ Fridays.
Annabel Really?
Billy  Yeah. We 2 ................................ have vegetable stew for dinner on
    Fridays. I think it’s my 3 ................................ food.
Annabel What – vegetable stew?
Billy  Yes. And then 4 ................................ strudel and ice cream. Mmmh!
Annabel Well, that isn’t my favourite food. My favourite food is curry.
Billy  Curry! Oh no! I 5 ................................ curry. It’s terrible!
Annabel No, it isn’t! I love it and my brother 6 ................................ it, too.
    7 ................................ curry – wonderful!
Billy  I really don’t like it.
Annabel Bye, Billy. Go home and eat your vegetable stew.
B Put the dialogue in the correct order. Then listen and check.
☐ Paul Well, come to my school on Tuesdays. You’ll love it.
☐ Clare You hate pizza? Are you crazy?
1 Paul It’s Tuesday. Oh no! I hate Tuesdays.
☐ Paul No, I’m not. And after the pizza we get ice cream.
☐ Paul We have pizza at school on Tuesdays. I hate pizza.
☐ Clare I’d love to come. We always have fish and chips on Tuesday. I hate it.
☐ Clare Why? What’s the problem with Tuesdays?
☐ Clare Pizza and ice cream. That’s my perfect lunch.
DIALOGUE WORK Asking for something in a shop
22 Put the dialogue in the correct order. Then listen and check.
☐ Assistant Here you are and here’s your change.
☐ Assistant Sure, here you are.
☐ Assistant It’s £30.
☐ Assistant Would you like it in a bag?
1 Assistant Can I help you?
☐ Carla No, thanks. It’s OK.
☐ Carla How much is it?
☐ Carla I’ll take it.
☐ Carla Yes, can I see that scarf, please?
Page 65–66
WORD FILE
Food
ice cream
chillies
fish
chicken
milk
butter
cheese
orange juice
tea
cucumber
sausages
beans
broccoli
carrot
onion
peas
an apple
mineral water
grapes
an orange
tomato (pl tomatoes)
red pepper
kiwi
spinach
pumpkin
potato (pl potatoes)
corn
brown bread
nuts
chips
rice
noodles
soup
Eating
breakfast  lunch  dinner  restaurant
Adverbs of frequency
always
usually
often
sometimes
never
MORE Words and Phrases
1 meat – I am vegetarian. I never eat meat. – Fleisch
2 ham – On the weekend, I sometimes have ham and eggs for breakfast. – Schinken
3 healthy – A lot of junk food isn’t healthy. – gesund
4 to like – I like orange juice. – mögen
5 That’s nice. – Das ist nett.
6 always – They always have pizza for dinner. – immer
7 breakfast – We have eggs for breakfast. – Frühstück
8 country – My grandparents live in the country, but I live in the city. – Land
9 dessert – For dessert, I like rice pudding. – Nachtisch
10 family – My family and I live in Austria. – Familie
11 fruit – He likes lots of fruit for breakfast. – Obst; Frucht
12 grandparents – My grandparents live in the country. – Großeltern
13 lunch – We often have curry for lunch. – Mittagessen
14 never – She never eats meat. She’s a vegetarian. – nie, niemals
15 often – They often have bread for breakfast. – oft, häufig
16 to put – We put fish and vegetables on the rice paper. – setzen, legen, stellen
17 sometimes – We sometimes have fish for lunch. – manchmal
18 stew – When we have vegetables (and meat) at home, my mum cooks a stew. – Eintopf
19 usually – She usually has bread for breakfast. – gewöhnlich, normalerweise
20 vegetables (veggies) – I like veggies, I mean vegetables. – Gemüse
21 best friend – I like John best. He’s my best friend. – bester Freund / beste Freundin
22 tofu – I like meat, but sometimes I also eat tofu. – Tofu
23 beef – I often eat chicken, but I really don’t like beef. – Rindfleisch
24 I don’t know. – Ich weiß es nicht.
25 I’m not sure. – Ich bin mir nicht sicher.
26 present – The vase is a good present for Mum. – Geschenk

```

## Output contract

Write `content/corpus/units/g1-u07/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u07",
  "briefBank": "629dca6525cf",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u07.s.adverbs-frequency",
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
