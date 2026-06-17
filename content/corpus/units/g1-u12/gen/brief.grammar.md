# Grammar generation brief — g1-u12 (MORE! 1, Unit 12)

<!-- domigo:gen grammar g1-u12 bank=7926349cf887 prompt=4b9164076103 -->

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

### `g1u12.s.ordinal-numbers` — Ordinal numbers (Ordnungszahlen)

Forming ordinal numbers (first, second, third …): -st/-nd/-rd for 1/2/3, otherwise -th, with spelling exceptions.

v1 floor for this structure: **21 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [ordinals-regular]: Most ordinals add -th to the number. Remember: 1 → -st, 2 → -nd, 3 → -rd, otherwise always -th.
  - DE: Die meisten Ordnungszahlen hängen -th an die Zahl. Merke: 1 → -st, 2 → -nd, 3 → -rd, sonst immer -th.
  - "one → first, two → second, three → third" — "one → first, two → second, three → third"
  - "four → fourth, seven → seventh, ten → tenth" — "four → fourth, seven → seventh, ten → tenth"
- rule [ordinals-exceptions]: Watch the spelling: five → fifth, eight → eighth, nine → ninth, twelve → twelfth. Ordinals above 20 follow the same pattern: twenty-first, thirty-second.
  - DE: Achte auf die Schreibweise: five → fifth, eight → eighth, nine → ninth, twelve → twelfth. Ordnungszahlen über 20 bildest du nach dem gleichen Prinzip: twenty-first, thirty-second.
  - "She lives on the fifth floor." — "Sie wohnt im fünften Stock."
  - "My birthday is on the twenty-third of May." — "Mein Geburtstag ist am dreiundzwanzigsten Mai."

common errors:
- Wrong spelling of an irregular ordinal.: ✗ "She was fiveth in the race." → ✓ "She was fifth in the race."
- Keeping the -e in ninth.: ✗ "His birthday is on the nineth." → ✓ "His birthday is on the ninth."

SB box `g1/sb/SB Unit 12 The birthday cake.txt#grammar-1` — Ordinal numbers:
```
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
```

v1 seed items (UNTRUSTED):
- `m1-u12-ordinal-numbers-gf-001` [gap-fill, d1]: p="January is the _____ month of the year." c="first" a=["first"] ds=["oneth","firth","one"]
- `m1-u12-ordinal-numbers-gf-002` [gap-fill, d1]: p="Wednesday is the _____ day of the school week." c="third" a=["third"] ds=["threeth","thrid","three"]
- `m1-u12-ordinal-numbers-gf-003` [gap-fill, d2]: p="She came _____ in the race. (5th place)" c="fifth" a=["fifth"] ds=["fiveth","fith","five"]
- `m1-u12-ordinal-numbers-gf-004` [gap-fill, d2]: p="Today is the _____ of March. (9)" c="ninth" a=["ninth"] ds=["nineth","ninith","nine"]
- `m1-u12-ordinal-numbers-gf-005` [gap-fill, d3]: p="Christmas is on the twenty-_____ of December." c="fifth" a=["fifth"] ds=["fiveth","five","fith"]
- `m1-u12-ordinal-numbers-mc-001` [multiple-choice, d2]: p="Which is the correct ordinal form of 12?" c="twelfth" a=["twelfth"] ds=["twelveth","twelvth","twelfeth"]
- `m1-u12-ordinal-numbers-mc-002` [multiple-choice, d2]: p="Which ordinal number is correct?" c="eighth" a=["eighth"] ds=["eigthth","eightth","eighteth"]
- `m1-u12-ordinal-numbers-mc-003` [multiple-choice, d1]: p="Which is the correct way to write 2nd as a word?" c="second" a=["second"] ds=["twoth","secend","twond"]
- `m1-u12-ordinal-numbers-ec-001` [error-correction, d2]: p="Find and fix the mistake: My birthday is on the nineth of June." c="My birthday is on the ninth of June." a=["My birthday is on the ninth of June.","ninth"] ds=[]
- `m1-u12-ordinal-numbers-ec-002` [error-correction, d2]: p="Find and fix the mistake: She was fiveth in the race." c="She was fifth in the race." a=["She was fifth in the race.","fifth"] ds=[]
- `m1-u12-ordinal-numbers-ec-003` [error-correction, d3]: p="Find and fix the mistake: December is the twelveth month." c="December is the twelfth month." a=["December is the twelfth month.","twelfth"] ds=[]
- `m1-u12-ordinal-numbers-tf-001` [transformation, d2]: p="Write the ordinal number as a word: 20th → _____" c="twentieth" a=["twentieth"] ds=[]
- `m1-u12-ordinal-numbers-tf-002` [transformation, d3]: p="It's the last day of the month and you need to write it on the board. Write the ordinal number as a word: 31st → _____" c="thirty-first" a=["thirty-first"] ds=[]
- `m1-u12-ordinal-numbers-tr-001` [translation, d2]: p="Translate into English: Mein Geburtstag ist am dritten Mai." c="My birthday is on the third of May." a=["My birthday is on the third of May.","My birthday is on the 3rd of May."] ds=[]
- `m1-u12-ordinal-numbers-tr-002` [translation, d3]: p="Translate into English: Heute ist der fuenfzehnte Dezember." c="Today is the fifteenth of December." a=["Today is the fifteenth of December.","Today is the 15th of December.","Is the fifteenth of december today","Is the 15th of december today"] ds=[]
- `m1-u12-ordinal-numbers-mt-001` [matching, d2]: p="Match the cardinal number with its ordinal form:" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}"] ds=["1: one|2: three|3: five|4: nine|5: twelve","a: third|b: ninth|c: twelfth|d: first|e: fifth"]
- `m1-u12-ordinal-numbers-gf-007` [gap-fill, d3]: p="Today is the ___ of June. (21)" c="twenty-first" a=["twenty-first","21st"] ds=["twenty-oneth","twentyfirst","twenty-one"]
- `m1-u12-ordinal-numbers-gf-008` [gap-fill, d3]: p="December has 31 days. The last day is the ___." c="thirty-first" a=["thirty-first","31st"] ds=["thirtieth-one","thirty-oneth","thirtyfirst"]
- `m1-u12-ordinal-numbers-mp-001` [matching-pairs, d2]: p="Find the pairs: cardinal ↔ ordinal number." c="[[\"one\",\"first\"],[\"two\",\"second\"],[\"three\",\"third\"],[\"five\",\"fifth\"],[\"eight\",\"eighth\"],[\"twelve\",\"twelfth\"]]" a=[] ds=[]
- `m1-u12-ordinal-numbers-ag-001` [anagram, d2]: p="Ordinal form of \"eight\":" c="eighth" a=["eighth"] ds=[]
- `m1-u12-ordinal-numbers-ag-002` [anagram, d3]: p="Ordinal form of \"twelve\":" c="twelfth" a=["twelfth"] ds=[]

### `g1u12.s.past-simple-was-were` — Past simple (1) was / were (Past simple (1) was / were – war/waren)

The past tense of be: was (I/he/she/it), were (you/we/they), in all forms.

v1 floor for this structure: **24 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [past-be-affirmative]: Use the past simple to talk about the past. I/he/she/it + was; you/we/they + were.
  - DE: Das Past simple verwendest du, um etwas Vergangenes zu erzählen. I/he/she/it + was; you/we/they + were.
  - "At 9 o'clock I was at school." — "Um 9 Uhr war ich in der Schule."
  - "Peter and John were in their classroom." — "Peter und John waren in ihrem Klassenzimmer."
- rule [past-be-negative]: Negative: wasn't (was not), weren't (were not).
  - DE: Verneinung: wasn't (was not), weren't (were not).
  - "Tom wasn't there." — "Tom war nicht da."
  - "Sandra and Kate weren't there." — "Sandra und Kate waren nicht da."
- rule [past-be-questions]: Questions: Was I/he/she/it …? Were you/we/they …? Short answers: Yes, I was. / No, they weren't.
  - DE: Fragen: Was I/he/she/it …? Were you/we/they …? Kurzantworten: Yes, I was. / No, they weren't.
  - "Was it cold? – Yes, it was." — "War es kalt? – Ja."
  - "Were you at the party? – No, I wasn't." — "Warst du auf der Party? – Nein."

common errors:
- Using were with I or was with they.: ✗ "I were at the cinema." → ✓ "I was at the cinema."
- Using was with a plural subject.: ✗ "They was very happy." → ✓ "They were very happy."

SB box `g1/sb/SB Unit 12 The birthday cake.txt#grammar-1` — Ordinal numbers:
```
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
```

v1 seed items (UNTRUSTED):
- `m1-u12-past-simple-be-gf-001` [gap-fill, d1]: p="I _____ at home yesterday." c="was" a=["was"] ds=["were","am","is"]
- `m1-u12-past-simple-be-gf-002` [gap-fill, d1]: p="They _____ at school last Monday." c="were" a=["were"] ds=["was","are","is"]
- `m1-u12-past-simple-be-gf-003` [gap-fill, d2]: p="She _____ very tired after the party." c="was" a=["was"] ds=["were","wered","is"]
- `m1-u12-past-simple-be-gf-004` [gap-fill, d2]: p="We _____ in London last summer." c="were" a=["were"] ds=["was","are","been"]
- `m1-u12-past-simple-be-gf-005` [gap-fill, d2]: p="The film _____ really good!" c="was" a=["was"] ds=["were","is","wered"]
- `m1-u12-past-simple-be-gf-006` [gap-fill, d3]: p="She _____ happy because her cat _____ ill." c="wasn't, was" a=["wasn't, was","was not, was"] ds=["weren't, was","wasn't, were","isn't, is"]
- `m1-u12-past-simple-be-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="They were very happy yesterday." a=["They were very happy yesterday."] ds=["They was very happy yesterday.","They wered very happy yesterday.","They are very happy yesterday."]
- `m1-u12-past-simple-be-mc-002` [gap-fill, d3]: p="Choose the correct short answer: 'Were you at the party?' – 'No, _____.'" c="I wasn't" a=["I wasn't"] ds=["I weren't","I was","I'm not"]
- `m1-u12-past-simple-be-mc-003` [gap-fill, d2]: p="Choose the correct question: '_____ she at school yesterday?'" c="Was" a=["Was"] ds=["Were","Is","Did"]
- `m1-u12-past-simple-be-ec-001` [error-correction, d2]: p="Find and fix the mistake: They was at the zoo yesterday." c="They were at the zoo yesterday." a=["They were at the zoo yesterday.","were"] ds=[]
- `m1-u12-past-simple-be-ec-002` [error-correction, d2]: p="Find and fix the mistake: I were at the cinema last night." c="I was at the cinema last night." a=["I was at the cinema last night.","was"] ds=[]
- `m1-u12-past-simple-be-ec-003` [error-correction, d3]: p="Find and fix the mistake: I was been tired yesterday." c="I was tired yesterday." a=["I was tired yesterday."] ds=[]
- `m1-u12-past-simple-be-tf-001` [transformation, d2]: p="Today you are happy, but yesterday was different. Change from present to past: I am happy. → Yesterday I _____ happy." c="was" a=["was","Yesterday I was happy.","Yesterday I was happy"] ds=[]
- `m1-u12-past-simple-be-tf-002` [transformation, d3]: p="Your mum wants to know where your brother was. Help her ask. Make it a question: He was at home. → _____ he at home?" c="Was" a=["Was","Was he at home?","Was he at home"] ds=[]
- `m1-u12-past-simple-be-tr-001` [translation, d2]: p="Translate into English: Wir waren gestern im Kino." c="We were at the cinema yesterday." a=["We were at the cinema yesterday.","We were at the cinema yesterday","Yesterday we were at the cinema.","We were at the movies yesterday.","Yesterday we were at the movies."] ds=[]
- `m1-u12-past-simple-be-tr-002` [translation, d3]: p="Translate into English: Er war gestern nicht in der Schule." c="He wasn't at school yesterday." a=["He wasn't at school yesterday.","He was not at school yesterday.","Yesterday he wasn't at school.","Yesterday he was not at school."] ds=[]
- `m1-u12-past-simple-be-sb-001` [sentence-building, d2]: p="Put the words in the correct order: at / were / yesterday / the park / we" c="We were at the park yesterday." a=["We were at the park yesterday.","Yesterday we were at the park."] ds=[]
- `m1-u12-past-simple-be-cp-001` [context-picker, d2]: p="You are talking about last weekend. Which sentence about the past is correct?" c="We were at the zoo yesterday." a=["We were at the zoo yesterday."] ds=["We was at the zoo yesterday.","We are at the zoo yesterday.","We be at the zoo yesterday."]
- `m1-u12-past-simple-be-gf-007` [gap-fill, d2]: p="___ you at the birthday party last Saturday?" c="Were" a=["Were"] ds=["Was","Are","Did"]
- `m1-u12-past-simple-be-gf-008` [gap-fill, d3]: p="The children ___ (not / be) at home. They were at school." c="weren't" a=["weren't","were not"] ds=["wasn't","didn't be","aren't"]
- `m1-u12-past-simple-be-cp-002` [context-picker, d3]: p="Your teacher asks about the school trip last Friday. Which answer is correct?" c="It was really fun!" a=["It was really fun!"] ds=["It were really fun!","It is really fun!","It was really funny!"]
- `m1-u12-past-simple-be-qf-001` [question-formation, d2]: p="Statement: She was at home. Ask a YES/NO question." c="Was she at home?" a=["Was she at home?","Was she at home"] ds=[]
- `m1-u12-past-simple-be-gs-001` [group-sort, d1]: p="Sort: \"was\" or \"were\"?" c="{\"was\":[\"I\",\"he\",\"she\",\"it\"],\"were\":[\"you\",\"we\",\"they\"]}" a=[] ds=[]
- `m1-u12-past-simple-be-gs-002` [group-sort, d2]: p="Sort: affirmative or negative past of \"be\"?" c="{\"Affirmative\":[\"I was happy.\",\"She was at home.\",\"They were late.\"],\"Negative\":[\"I wasn't tired.\",\"She wasn't angry.\",\"They weren't ready.\"]}" a=[] ds=[]

### `g1u12.s.prepositions-time` — Time prepositions (Zeitpräpositionen)

Using on (days/dates), in (months/seasons/parts of the day) and at (clock times) to talk about time.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [prepositions-time-on]: Use on for days and dates.
  - DE: Verwende on für Tage und Daten.
  - "My birthday is on February 12th." — "Mein Geburtstag ist am 12. Februar."
  - "The concert's on Thursday, July 15th." — "Das Konzert ist am Donnerstag, dem 15. Juli."
- rule [prepositions-time-in]: Use in for months and parts of the day.
  - DE: Verwende in für Monate und Tageszeiten.
  - "My sister's birthday is in December." — "Der Geburtstag meiner Schwester ist im Dezember."
  - "I have maths in the morning." — "Ich habe am Vormittag Mathe."
- rule [prepositions-time-at]: Use at for clock times and for night.
  - DE: Verwende at für Uhrzeiten und für night.
  - "The film starts at 7 o'clock." — "Der Film beginnt um 7 Uhr."
  - "We go to bed late at night." — "Wir gehen spät in der Nacht ins Bett."

common errors:
- Using in instead of on with a day.: ✗ "I have sports in Monday." → ✓ "I have sports on Monday."
- Using on instead of in with a month.: ✗ "My birthday is on December." → ✓ "My birthday is in December."

SB box `g1/sb/SB Unit 12 The birthday cake.txt#grammar-1` — Ordinal numbers:
```
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
```

v1 seed items (UNTRUSTED):
- `m1-u12-prepositions-time-gf-001` [gap-fill, d1]: p="I have English _____ Monday." c="on" a=["on"] ds=["in","at","to"]
- `m1-u12-prepositions-time-gf-002` [gap-fill, d1]: p="My birthday is _____ March." c="in" a=["in"] ds=["on","at","to"]
- `m1-u12-prepositions-time-gf-003` [gap-fill, d1]: p="School starts _____ 8 o'clock." c="at" a=["at"] ds=["on","in","to"]
- `m1-u12-prepositions-time-gf-004` [gap-fill, d2]: p="We go skiing _____ winter." c="in" a=["in"] ds=["on","at","during"]
- `m1-u12-prepositions-time-gf-005` [gap-fill, d2]: p="Her birthday is _____ the 15th of May." c="on" a=["on"] ds=["in","at","to"]
- `m1-u12-prepositions-time-gf-006` [gap-fill, d3]: p="I wake up early _____ the morning." c="in" a=["in"] ds=["at","on","to"]
- `m1-u12-prepositions-time-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="The concert is on Saturday at 7 o'clock." a=["The concert is on Saturday at 7 o'clock."] ds=["The concert is in Saturday at 7 o'clock.","The concert is at Saturday on 7 o'clock.","The concert is on Saturday in 7 o'clock."]
- `m1-u12-prepositions-time-mc-003` [gap-fill, d2]: p="Choose the correct preposition: 'We have a test _____ Friday.'" c="on" a=["on"] ds=["in","at","by"]
- `m1-u12-prepositions-time-ec-001` [error-correction, d2]: p="Find and fix the mistake: I have sports in Monday." c="I have sports on Monday." a=["I have sports on Monday.","on"] ds=[]
- `m1-u12-prepositions-time-ec-002` [error-correction, d2]: p="Find and fix the mistake: My birthday is on December." c="My birthday is in December." a=["My birthday is in December.","in"] ds=[]
- `m1-u12-prepositions-time-ec-003` [error-correction, d3]: p="Find and fix the mistake: I was born in 15th March." c="I was born on 15th March." a=["I was born on 15th March.","I was born on the 15th of March.","on"] ds=[]
- `m1-u12-prepositions-time-tf-001` [transformation, d3]: p="Add the correct preposition: The party is _____ Saturday _____ the afternoon _____ 3 o'clock." c="on, in, at" a=["on, in, at","Add the correct preposition: The party is on, in, at Saturday on, in, at the afternoon on, in, at 3 o'clock.","Add the correct preposition: The party is on, in, at Saturday on, in, at the afternoon on, in, at 3 o'clock","Add the correct preposition: The party is on, in, at Saturday on, in, at the afternoon on, in, at 3 o'clock"] ds=[]
- `m1-u12-prepositions-time-tf-002` [transformation, d2]: p="Fill in: I go swimming _____ Thursdays _____ summer." c="on, in" a=["on, in","Fill in: I go swimming on, in Thursdays on, in summer.","Fill in: I go swimming on, in Thursdays on, in summer","Fill in: I go swimming on, in Thursdays on, in summer"] ds=[]
- `m1-u12-prepositions-time-tr-001` [translation, d2]: p="Translate into English: Ich habe am Freitag einen Test." c="I have a test on Friday." a=["I have a test on Friday.","I have a test on Friday","I've got a test on Friday.","I've a test on Friday.","I have got a test on Friday."] ds=[]
- `m1-u12-prepositions-time-tr-002` [translation, d3]: p="Translate into English: Die Schule beginnt um 8 Uhr im September." c="School starts at 8 o'clock in September." a=["School starts at 8 o'clock in September.","School starts at 8 in September."] ds=[]
- `m1-u12-prepositions-time-sb-001` [sentence-building, d2]: p="Put the words in the correct order: on / party / the / Saturday / is" c="The party is on Saturday." a=["The party is on Saturday."] ds=[]
- `m1-u12-prepositions-time-mt-001` [matching, d2]: p="Match the time expression with the correct preposition:" c="{\"1\":\"b\",\"2\":\"c\",\"3\":\"a\",\"4\":\"b\",\"5\":\"c\",\"6\":\"a\"}" a=["{\"1\":\"b\",\"2\":\"c\",\"3\":\"a\",\"4\":\"b\",\"5\":\"c\",\"6\":\"a\"}"] ds=["1: Monday|2: 8 o'clock|3: summer|4: my birthday|5: night|6: January","a: in|b: on|c: at"]
- `m1-u12-prepositions-time-gf-007` [gap-fill, d2]: p="I play football ___ Saturdays." c="on" a=["on"] ds=["in","at","every"]
- `m1-u12-prepositions-time-gf-008` [gap-fill, d3]: p="My birthday is ___ the 21st of March." c="on" a=["on"] ds=["in","at","to"]
- `m1-u12-prepositions-time-gs-001` [group-sort, d2]: p="Sort: which preposition — at, in, or on?" c="{\"at\":[\"5 o'clock|at 5 o'clock\",\"night|at night\",\"the weekend|at the weekend\",\"noon|at noon\"],\"in\":[\"March|in March\",\"summer|in summer\",\"the morning|in the morning\",\"2024|in 2024\"],\"on\":[\"Monday|on Monday\",\"my birthday|on my birthday\",\"the 5th of May|on the 5th of May\",\"Fridays|on Fridays\"]}" a=[] ds=[]

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

## Unit transcripts (carrier material — the unit's world)

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

Write `content/corpus/units/g1-u12/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u12",
  "briefBank": "7926349cf887",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u12.s.ordinal-numbers",
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
