# Grammar generation brief — g1-u13 (MORE! 1, Unit 13)

<!-- domigo:gen grammar g1-u13 bank=e4abaa2bacfd prompt=4b9164076103 -->

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

### `g1u13.s.linking-words` — Linking words (and, but, because) (Bindewörter (and, but, because))

Joining ideas with and (addition), but (contrast) and because (reason). After because the word order is normal SVO.

v1 floor for this structure: **36 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [linking-and-but]: Use and to join two similar ideas and but to join two contrasting ideas.
  - DE: Verwende and, um zwei ähnliche Ideen zu verbinden, und but, um zwei gegensätzliche Ideen zu verbinden.
  - "The front of the spaceship opened and a big robot arm reached out." — "Die Vorderseite des Raumschiffs öffnete sich und ein großer Roboterarm streckte sich heraus."
  - ""Fly into the eye of the storm!" shouted Diana, but the pilot was not happy." — "„Flieg ins Auge des Sturms!", rief Diana, aber der Pilot war nicht glücklich."
- rule [linking-because]: Use because to give a reason. After because the word order is normal (subject + verb + object).
  - DE: Verwende because, um einen Grund anzugeben. Nach because steht die normale Wortstellung (Subjekt + Verb + Objekt).
  - "Diana wanted to rescue the spaceship because her friends were on it." — "Diana wollte das Raumschiff retten, weil ihre Freunde an Bord waren."
  - "I like summer because it is warm." — "Ich mag den Sommer, weil es warm ist."

common errors:
- Using German verb-final word order after because.: ✗ "I like summer because warm it is." → ✓ "I like summer because it is warm."
- Adding of after because before a clause.: ✗ "I'm happy because of I have a dog." → ✓ "I'm happy because I have a dog."

SB box `g1/sb/SB Unit 13 Help!.txt#grammar-1` — Past simple (2) regular verbs:
```
Du verwendest das Past simple, um über Vergangenes zu sprechen oder zu schreiben. Du verwendest für alle Personen in der Einzahl und Mehrzahl jeweils die gleiche Form des Verbs.
Bildung: Bei einem regelmäßigen Verb hängst du an den Infinitiv (Nennform) -ed an.
jump – I jumped wait – she waited shout – you shouted play – they played
start – he started happen – it happened help – we helped
Endet ein regelmäßiges Verb auf -e, fügst du nur ein -d an.
rescue – they rescued arrive – you arrived
Aber: carry – carried slip – slipped stop – stopped
[IMAGE: Illustration of person in phone booth on island with palm trees] Mary phoned for help.
Linking words (and, but, because)
So kannst du Sätze verbinden:
Diana wanted to rescue the spaceship because her friends were on it. "Fly into the eye of the storm!" shouted Diana, but the pilot was not happy. The front of the spaceship opened and a big robot arm reached out.
[IMAGE: Comic strip showing "MORE FUN WITH FIDO!" with dog character in three panels]
Now go back to page 100. Check ☑ with a partner what you know / can do.
```

v1 seed items (UNTRUSTED):
- `m1-u13-linking-words-gf-001` [gap-fill, d1]: p="I was hungry _____ I ate a sandwich." c="and" a=["and","so"] ds=["but","because","or"]
- `m1-u13-linking-words-gf-002` [gap-fill, d1]: p="She was tired _____ she didn't stop running." c="but" a=["but"] ds=["and","because","or"]
- `m1-u13-linking-words-gf-003` [gap-fill, d1]: p="He was scared _____ it was dark." c="because" a=["because"] ds=["and","but","or"]
- `m1-u13-linking-words-gf-004` [gap-fill, d2]: p="We wanted to go to the park _____ it was raining." c="but" a=["but"] ds=["and","because","or"]
- `m1-u13-linking-words-gf-005` [gap-fill, d3]: p="She didn't go to school _____ she was ill." c="because" a=["because"] ds=["but","and","or"]
- `m1-u13-linking-words-mc-001` [gap-fill, d2]: p="Choose the correct linking word: 'I like cats _____ I don't like dogs.'" c="but" a=["but"] ds=["and","because","or"]
- `m1-u13-linking-words-mc-002` [multiple-choice, d3]: p="Which sentence uses 'because' correctly?" c="I stayed at home because I was tired." a=["I stayed at home because I was tired."] ds=["Because I stayed at home I was tired.","I stayed at home because tired.","I because stayed at home was tired."]
- `m1-u13-linking-words-mc-003` [gap-fill, d2]: p="Choose the correct linking word: 'She slipped _____ fell down.'" c="and" a=["and"] ds=["but","because","or"]
- `m1-u13-linking-words-ec-001` [error-correction, d3]: p="Find and fix the mistake: I like pizza because is delicious." c="I like pizza because it is delicious." a=["I like pizza because it is delicious.","I like pizza because it's delicious.","it"] ds=[]
- `m1-u13-linking-words-ec-002` [error-correction, d2]: p="Find and fix the mistake: She studied hard because she failed the test." c="She studied hard but she failed the test." a=["She studied hard but she failed the test.","She studied hard but failed the test.","but"] ds=[]
- `m1-u13-linking-words-ec-003` [error-correction, d3]: p="Find and fix the mistake: I was tired but I didn't sleep well." c="I was tired because I didn't sleep well." a=["I was tired because I didn't sleep well.","I was tired because I did not sleep well.","because"] ds=[]
- `m1-u13-linking-words-tr-001` [translation, d2]: p="Translate into English: Er war muede, aber er spielte weiter." c="He was tired but he kept playing." a=["He was tired but he kept playing.","He was tired, but he kept playing.","He was tired but he continued playing."] ds=[]
- `m1-u13-linking-words-gf-007` [gap-fill, d2]: p="I wanted an ice cream ___ the shop was closed." c="but" a=["but"] ds=["and","because","so"]
- `m1-u13-linking-words-gf-008` [gap-fill, d2]: p="We stayed inside ___ it was raining." c="because" a=["because"] ds=["but","and","so"]
- `m1-u13-linking-words-gf-009` [gap-fill, d3]: p="I like cats ___ my brother likes dogs." c="but" a=["but","and"] ds=["because","so","or"]
- `m1-u13-linking-words-gs-001` [group-sort, d2]: p="Sort: which linking word completes the sentence?" c="{\"and\":[\"I like pizza ___ pasta.|I like pizza and pasta.\",\"She sings ___ dances.|She sings and dances.\",\"Tom ___ Lisa are friends.|Tom and Lisa are friends.\"],\"but\":[\"I like dogs ___ not cats.|I like dogs but not cats.\",\"She is tired ___ happy.|She is tired but happy.\",\"It's old ___ nice.|It's old but nice.\"],\"because\":[\"I stayed home ___ I was ill.|I stayed home because I was ill.\",\"She's happy ___ it's Friday.|She's happy because it's Friday.\",\"We ran ___ it rained.|We ran because it rained.\"]}" a=[] ds=[]
- `m1-u4-because-gf-001` [gap-fill, d1]: p="I'm happy ___ it's the weekend. (because / but)" c="because" a=["because"] ds=["but","and","because of"]
- `m1-u4-because-gf-002` [gap-fill, d1]: p="She is sad ___ her cat is sick." c="because" a=["because"] ds=["because of","but","so"]
- `m1-u4-because-gf-003` [gap-fill, d2]: p="I like summer because ___ is warm. (it / is it)" c="it" a=["it"] ds=["is it","warm it","it warm"]
- `m1-u4-because-gf-004` [gap-fill, d3]: p="He is tired because he ___ up early. (get — past)" c="got" a=["got"] ds=["get","gets","getting"]
- `m1-u4-because-gf-005` [gap-fill, d4]: p="I'm happy ___ I have a dog. (because / because of)" c="because" a=["because"] ds=["because of","because for","cause"]
- `m1-u4-because-gf-006` [gap-fill, d4]: p="I don't like winter because it ___ cold. (be)" c="is" a=["is"] ds=["cold is","be","are"]
- `m1-u4-because-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="I like dogs because they are friendly." a=["I like dogs because they are friendly."] ds=["I like dogs because friendly they are.","I like dogs because of they are friendly.","I like dogs because are they friendly."]
- `m1-u4-because-mc-002` [multiple-choice, d2]: p="She is excited ___." c="because she has a new bike" a=["because she has a new bike"] ds=["because of she has a new bike","because has she a new bike","because a new bike she has"]
- `m1-u4-because-mc-003` [multiple-choice, d4]: p="Which word introduces a REASON?" c="because" a=["because"] ds=["but","and","or"]
- `m1-u4-because-sb-001` [sentence-building, d2]: p="Put the words in the correct order: I / summer / like / because / warm / it / is" c="I like summer because it is warm." a=["I like summer because it is warm.","I like summer because it is warm"] ds=[]
- `m1-u4-because-ec-002` [error-correction, d3]: p="Find and fix the mistake: I'm happy because of I have a dog." c="I'm happy because I have a dog." a=["I'm happy because I have a dog."] ds=[]
- `m1-u4-because-sb-003` [sentence-building, d5]: p="Put the words in the correct order: I / like / don't / maths / because / it / difficult / is" c="I don't like maths because it is difficult." a=["I don't like maths because it is difficult.","I don't like maths because it is difficult"] ds=[]
- `m1-u4-because-tf-001` [transformation, d2]: p="Join the sentences: I'm tired. I got up early. → I'm tired because ___." c="I got up early" a=["I got up early","I got up early.","I'm tired because I got up early.","I'm tired because I got up early","I am tired because I got up early."] ds=[]
- `m1-u4-because-tf-002` [transformation, d3]: p="Join the sentences: He likes football. It is fun. → He likes football because ___." c="it is fun" a=["it is fun","it's fun","it is fun.","He likes football because it is fun.","He likes football because it is fun","He likes football because it's fun."] ds=[]
- `m1-u4-because-tr-001` [translation, d2]: p="🇩🇪 Ich bin traurig, weil mein Hund krank ist." c="I am sad because my dog is sick." a=["I am sad because my dog is sick.","I'm sad because my dog is sick."] ds=[]
- `m1-u4-because-tr-002` [translation, d4]: p="🇩🇪 Ich mag Englisch, weil es interessant ist." c="I like English because it is interesting." a=["I like English because it is interesting.","I like English because it's interesting."] ds=[]
- `m1-u4-because-gf-007` [gap-fill, d2]: p="I like my school ___ my friends are there." c="because" a=["because"] ds=["but","and","so"]
- `m1-u4-because-ff-002` [free-form, d5]: p="Complete: I like English _____ it is fun." c="because" a=["because","Because","Complete: I like English because it is fun.","Complete: I like English because it is fun","Complete: I like English because it is fun","Complete: I like English because it's fun."] ds=[]
- `m1-u4-because-sb-002` [sentence-building, d2]: p="Put the words in the correct order: happy / I'm / because / is / it / sunny" c="I'm happy because it is sunny." a=["I'm happy because it is sunny.","I'm happy because it's sunny.","I am happy because it is sunny.","I am happy because it's sunny."] ds=[]
- `m1-u4-because-mt-001` [matching, d2]: p="Match the feeling to the reason: 1) I'm tired because 2) I'm happy because 3) I'm sad because 4) I'm hungry because — a) I didn't eat lunch b) it's my birthday c) my cat is sick d) I got up at 5 am" c="{\"1\":\"d\",\"2\":\"b\",\"3\":\"c\",\"4\":\"a\"}" a=["{\"1\":\"d\",\"2\":\"b\",\"3\":\"c\",\"4\":\"a\"}"] ds=[]

### `g1u13.s.past-simple-regular` — Past simple (2) regular verbs (Past simple (2) regelmäßige Verben)

Forming the past simple of regular verbs with -ed, plus spelling rules (-d, -ied, doubled consonant). Same form for all persons.

v1 floor for this structure: **25 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [past-regular-ed]: For a regular verb, add -ed to the base form. The form is the same for all persons.
  - DE: Bei einem regelmäßigen Verb hängst du -ed an die Grundform. Die Form ist für alle Personen gleich.
  - "jump – jumped, play – played, help – helped" — "jump – jumped, play – played, help – helped"
  - "Mary phoned for help." — "Mary rief um Hilfe."
- rule [past-regular-spelling]: Spelling: verbs ending in -e add only -d (arrive → arrived); consonant + y changes to -ied (carry → carried); a short vowel + consonant doubles the consonant (stop → stopped).
  - DE: Schreibweise: Verben auf -e bekommen nur -d (arrive → arrived); Konsonant + y wird zu -ied (carry → carried); kurzer Vokal + Konsonant verdoppelt den Konsonanten (stop → stopped).
  - "rescue – rescued, arrive – arrived" — "rescue – rescued, arrive – arrived"
  - "carry – carried, stop – stopped" — "carry – carried, stop – stopped"

common errors:
- Forgetting to add -ed.: ✗ "I walk to school yesterday." → ✓ "I walked to school yesterday."
- Forgetting to double the consonant.: ✗ "The bus stoped at the corner." → ✓ "The bus stopped at the corner."

SB box `g1/sb/SB Unit 13 Help!.txt#grammar-1` — Past simple (2) regular verbs:
```
Du verwendest das Past simple, um über Vergangenes zu sprechen oder zu schreiben. Du verwendest für alle Personen in der Einzahl und Mehrzahl jeweils die gleiche Form des Verbs.
Bildung: Bei einem regelmäßigen Verb hängst du an den Infinitiv (Nennform) -ed an.
jump – I jumped wait – she waited shout – you shouted play – they played
start – he started happen – it happened help – we helped
Endet ein regelmäßiges Verb auf -e, fügst du nur ein -d an.
rescue – they rescued arrive – you arrived
Aber: carry – carried slip – slipped stop – stopped
[IMAGE: Illustration of person in phone booth on island with palm trees] Mary phoned for help.
Linking words (and, but, because)
So kannst du Sätze verbinden:
Diana wanted to rescue the spaceship because her friends were on it. "Fly into the eye of the storm!" shouted Diana, but the pilot was not happy. The front of the spaceship opened and a big robot arm reached out.
[IMAGE: Comic strip showing "MORE FUN WITH FIDO!" with dog character in three panels]
Now go back to page 100. Check ☑ with a partner what you know / can do.
```

v1 seed items (UNTRUSTED):
- `m1-u13-past-simple-regular-gf-001` [gap-fill, d1]: p="Yesterday she _____ (walk) to school." c="walked" a=["walked"] ds=["walk","walks","walking"]
- `m1-u13-past-simple-regular-gf-002` [gap-fill, d1]: p="We _____ (play) football after school." c="played" a=["played"] ds=["play","plaied","playing"]
- `m1-u13-past-simple-regular-gf-003` [gap-fill, d2]: p="She _____ (like) the film very much." c="liked" a=["liked"] ds=["likeed","liking","likes"]
- `m1-u13-past-simple-regular-gf-004` [gap-fill, d2]: p="He _____ (stop) the car quickly." c="stopped" a=["stopped"] ds=["stoped","stoping","stops"]
- `m1-u13-past-simple-regular-gf-005` [gap-fill, d2]: p="They _____ (carry) the bags home." c="carried" a=["carried"] ds=["carryed","carryd","carry"]
- `m1-u13-past-simple-regular-gf-006` [gap-fill, d3]: p="The hikers _____ (slip) on the ice and _____ (shout) for help." c="slipped, shouted" a=["slipped, shouted"] ds=["sliped, shouted","slipped, shoutted","slip, shout"]
- `m1-u13-past-simple-regular-mc-001` [multiple-choice, d2]: p="Which past tense form is spelled correctly?" c="stopped" a=["stopped"] ds=["stoped","stopd","stoppd"]
- `m1-u13-past-simple-regular-mc-003` [multiple-choice, d3]: p="Which sentence is correct?" c="Yesterday I walked to school." a=["Yesterday I walked to school."] ds=["Yesterday I walk to school.","Yesterday I was walked to school.","Yesterday I goed to school."]
- `m1-u13-past-simple-regular-ec-001` [error-correction, d2]: p="Find and fix the mistake: He stoped the car." c="He stopped the car." a=["He stopped the car.","stopped"] ds=[]
- `m1-u13-past-simple-regular-ec-002` [error-correction, d2]: p="Find and fix the mistake: She cryed when her cat ran away." c="She cried when her cat ran away." a=["She cried when her cat ran away.","cried"] ds=[]
- `m1-u13-past-simple-regular-ec-003` [error-correction, d1]: p="Find and fix the mistake: Yesterday I watch a great film." c="Yesterday I watched a great film." a=["Yesterday I watched a great film.","watched"] ds=[]
- `m1-u13-past-simple-regular-tf-001` [transformation, d2]: p="Write the past simple form: arrive → _____" c="arrived" a=["arrived"] ds=[]
- `m1-u13-past-simple-regular-tf-002` [transformation, d3]: p="You planned a surprise party for your mum last week. How do you write it? Write the past simple form: plan → _____" c="planned" a=["planned"] ds=[]
- `m1-u13-past-simple-regular-tr-001` [translation, d2]: p="Translate into English: Gestern hat sie ihre Oma besucht." c="Yesterday she visited her grandma." a=["Yesterday she visited her grandma.","She visited her grandma yesterday."] ds=[]
- `m1-u13-past-simple-regular-tr-002` [translation, d3]: p="Translate into English: Wir haben letztes Wochenende im Park Fussball gespielt." c="We played football in the park last weekend." a=["We played football in the park last weekend.","Last weekend we played football in the park.","End we played football in the park last week"] ds=[]
- `m1-u13-past-simple-regular-sb-001` [sentence-building, d2]: p="Put the words in the correct order: yesterday / helped / I / mum / my" c="I helped my mum yesterday." a=["I helped my mum yesterday.","Yesterday I helped my mum."] ds=[]
- `m1-u13-past-simple-regular-gf-007` [gap-fill, d2]: p="Last night we ___ (watch) a film with our family." c="watched" a=["watched"] ds=["watchd","watch","watches"]
- `m1-u13-past-simple-regular-gf-008` [gap-fill, d3]: p="She ___ (study) hard for the test last week." c="studied" a=["studied"] ds=["studyed","studyied","studies"]
- `m1-u13-past-simple-regular-cp-001` [context-picker, d2]: p="Your friend tells you about last weekend. Which sentence is correct?" c="I watched a film with my family last Saturday." a=["I watched a film with my family last Saturday."] ds=["I watch a film with my family last Saturday.","I was watched a film with my family last Saturday.","I watchd a film with my family last Saturday."]
- `m1-u13-past-simple-regular-gs-001` [group-sort, d2]: p="How does each verb form the past tense?" c="{\"Add -ed\":[\"walk|walked\",\"play|played\",\"want|wanted\",\"open|opened\"],\"Add -d (ends in -e)\":[\"like|liked\",\"live|lived\",\"close|closed\",\"move|moved\"],\"Double + -ed\":[\"stop|stopped\",\"plan|planned\",\"drop|dropped\"]}" a=[] ds=[]
- `m1-u13-past-simple-regular-gs-002` [group-sort, d3]: p="Sort: the -ed ending sounds like /t/, /d/, or /ɪd/?" c="{\"/t/ sound\":[\"walked\",\"watched\",\"stopped\",\"washed\"],\"/d/ sound\":[\"played\",\"opened\",\"lived\",\"called\"],\"/ɪd/ sound\":[\"wanted\",\"needed\",\"started\",\"visited\"]}" a=[] ds=[]
- `m1-u13-past-simple-regular-mp-001` [matching-pairs, d1]: p="Find the pairs: base form ↔ regular past form." c="[[\"walk\",\"walked\"],[\"play\",\"played\"],[\"like\",\"liked\"],[\"stop\",\"stopped\"],[\"study\",\"studied\"],[\"open\",\"opened\"]]" a=[] ds=[]
- `m1-u13-past-simple-regular-ag-001` [anagram, d1]: p="Past form of \"play\":" c="played" a=["played"] ds=[]
- `m1-u13-past-simple-regular-ag-002` [anagram, d2]: p="Past form of \"stop\":" c="stopped" a=["stopped"] ds=[]
- `m1-u13-past-simple-regular-ag-003` [anagram, d2]: p="Past form of \"study\":" c="studied" a=["studied"] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alphabet, Alps, Anderson, Anger, Annie, Arbeit, Archie, Arousing, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Come, Complimenting, Dad, Dan, Dana, Daniel, Darkman, Dave, David, Davis, Debbie, Dialog, Dialoge, Diana, Doctor, Doctors, Don, Dragon, Ellie, Emergency, Emma, Encouraging, England, English, European, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Hammond, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hunt, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Janet, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Kate, Ken, Kitty, Leah, Leo, Lethabo, Leute, Lewis, Li, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Mike, Miss, Mr, Mrs, Mum, New, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Past, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Prepositions, Present, Priestly, Project, Put, Rajit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Sophie, Steve, Sue, Suzy, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, True, Uhr, Um, Vienna, Walker, Wall, Watson, Welcome, Well, White, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 13 Help!.txt -----
UNIT 13 Help!
Page 100
At the end of unit 13 ...
you know
who to call in an emergency
7 words for emergency services and 8 for accidents
how to use the past simple (regular verbs)
how to use linking words
you can
talk about emergency situations
call the emergency services and spell names
understand a short magazine article about a rescue operation
understand a short video about helping out
write and tell a story in the past
1 Read the article and answer the questions. Tell your partner.
[IMAGE: Magazine-style layout showing "Rescue!" with photos of coastguard helicopter, bomb disposal, cave rescue, and mountain rescue operations]
Rescue!
[IMAGE: Coastguard helicopter rescuing from sea] Coastguard
[IMAGE: Bomb disposal expert] Bomb disposal
[IMAGE: Cave rescue operation] Cave rescue
[IMAGE: Mountain rescue operation] Mountain rescue
In Australia it's 000. In New Zealand it's 111. In the US and Canada it's 911 and in the UK and many other countries around the world it's 999. That's the number to call in an emergency.
And of course, we all know that • when there's a crime, you ask for the police. • when you need medical help, you ask for an ambulance. • when there's a fire, you ask for the fire brigade.
But these aren't the only emergency services to help you.
1 You are climbing in the mountains. You fall and break a leg. You're lucky because you've got a phone with you. You dial 999. Who do you ask for? 📱
2 You are sailing at sea. The weather gets bad. The waves get really big and your boat is in trouble. You've got a radio on the boat. You call 999. Who do you ask for? 📱
3 You are exploring a deep cave. Some rocks fall and you can't get out. You're lucky because you've still got a phone signal. You dial 999. Who do you ask for? 📱
4 You are walking in the park. You see a strange parcel on the park bench. You pick it up. It's ticking. You put it down and phone 999. Who do you ask for? 📱
• Which number do you call in an emergency situation in Austria?
[IMAGE: Phone icon] [IMAGE: Ambulance icon] Ambulance: ............................. [IMAGE: Fire truck icon] Fire brigade: ............................. [IMAGE: Police car icon] Police: .............................
• Which number do you call in an emergency from a mobile? (the number works in all European countries) .............................
Page 101
2 Read the article in 1 again and write the emergency services under the pictures.
[IMAGE: Six cartoon illustrations showing different emergency situations:
Person climbing on mountain
Cat stuck in tree
Person stealing with money bag
Group of people with luggage at station
Person fallen on street
Person drowning in water]
1 ............................................... 2 ............................................... 3 ............................................... 4 ............................................... 5 ............................................... 6 ...............................................
SPEAKING Calling the emergency services and spelling names
3 Listen. Write the names of the streets. Then ask and answer.
1 An accident in ................................................................... Street. 2 A fire in ................................................................... Street. 3 A robbery in ................................................................ Street.
[SPEECH BUBBLE: A Can you spell the street, please?] [SPEECH BUBBLE: B Yes, it's ...]
4 CHOICES
A Listen. Then act out the dialogue.
A Hello. There's a fire in Harrod Street. B Can you spell the street, please? A Yes. It's H – A – double R – O – D. B OK.
B Make dialogues. Use this information.
1 fire / Jerry Street 2 accident / Mungo Street 3 robbery / Hardy Street
VOCABULARY An accident in the mountain
5 Listen and look at the picture. Then number the words.
□ jetpack □ slip on wet rocks □ storm □ radio the rescue team □ helicopter □ shout for help □ fly up the mountain 2 be in danger
[IMAGE: Detailed illustration showing mountain rescue scene with helicopters, rescue workers, and various emergency situations numbered 1-8]
Page 102
READING
6 Read the magazine article quickly. In the UK, what number do you need to call the mountain rescue team?
7 Read the article again.
[IMAGE: Magazine article layout with photo of person wearing jetpack]
MOUNTAIN DANGER
Imagine ... you are climbing in the mountains. There are no roads and no people. Yesterday there was a storm. The rocks are wet. You fall down and break your leg. You can't move. The sky is dark and it is very windy.
You are lucky because you've got a phone with you. You dial 999 and speak to mountain rescue. They tell you it is too windy for a helicopter, but they have an idea.
There is a noise. You look up. There is a man flying up to you! He is wearing a jetpack. Are you dreaming? No. He is from the mountain rescue team. He lands next to you, then checks your leg, gives you medicine and keeps you warm. Then, he radios his team and tells them where they can find you. One hour later the mountain rescue team arrives. You're safe!
This is not science fiction – it's real. In England they are testing a new jetpack to help people on mountains.
It is difficult for helicopters to land on a mountain. The mountain rescue team can take a long time to find people in danger. The jetpack is fast and easy to use. It is easy to land on a mountain with a jetpack!
What do you think? Do you want to fly a jetpack and help people?
8 How many of these tasks can you do?
1 There was a storm, so the rocks are wet. T / F 2 The weather is not very good. T / F 3 There is no phone signal. T / F
4 The young person in the article breaks a leg, but □ it is cold and windy. □ he/she can call for help. □ the sky is dark.
5 A man from the rescue team flies up the mountain and □ lands a helicopter. □ takes some photos. □ finds the young person in trouble.
6 The man calls the mountain rescue team because the young person □ is hungry. □ is very tired. □ can't walk.
7 Why can't a helicopter land? ............................................................................................................... 8 What is the job of the man with the jetpack? ..................................................................................... 9 Why are jetpacks good? .....................................................................................................................
9 Check your answers with a partner. Then listen to the text.
10 Complete the sentences with and, but or because.
1 The rocks are wet .............................. there was a storm yesterday. 2 He falls down .............................. breaks his leg. 3 You are lucky .............................. you have a phone with you. 4 It's too windy for a helicopter, .............................. mountain rescue have an idea. 5 The man gives you medicine .............................. keeps you warm. 6 It is difficult for helicopters to land on the mountain, .............................. easy with a jetpack!
Page 103
LISTENING & SPEAKING
11 The person in trouble was a fifteen-year-old girl, Sophia. Listen to her phone call with a friend.
12 Complete Sophia's diary with the verbs from the box. Then listen to the phone call again and check.
helped shouted arrived radioed called wanted happened looked slipped landed rescued remembered started
[IMAGE: Photo of person with leg in cast]
Dear Diary,
I'm in hospital! Yesterday was a very bad day for me. I 1............................................. to go up a mountain, but that wasn't a good idea.
First, everything was OK. But then I 2............................................. to climb on some rocks. They were all very wet. Then I 3............................................. !
I 4............................................. . It was terrible. I 5.............................................
for help. But I was alone in the mountains, and it was windy and cold.
Then I 6............................................. that my phone was in my backpack.
I 7............................................. 999 – the mountain rescue team. But it was difficult for a helicopter to land in this weather.
Suddenly there was a noise. I 8............................................. up! There was a man with a jetpack. He 9............................................. next to me. The man
10............................................. me and then he 11............................................. the mountain rescue team. They 12............................................. an hour later and
13............................................. me.
13 Look at these pictures. Use language from 5 to tell the story. Use and, but, because.
[IMAGE: Three illustrations showing mountain rescue scenario]
SOUNDS RIGHT /t/ /d/ /ɪd/
14 Listen and repeat.
/t/ 1 She jumped into the river. 2 My dog chased a cat. 3 We watched a film.
/d/ 4 She phoned at 5 o'clock. 5 He arrived on Monday. 6 We carried our books.
/ɪd/ 7 I waited an hour. 8 They shouted at me. 9 She wanted an ice cream.
Page 104
SPEAKING Telling a story in the past
15 CHOICES
A Complete the two stories. Use the verbs from the box in the past simple. Then tell one of the stories to a partner.
be arrive jump rescue phone be chase shout
[IMAGE: Two sets of illustrations showing different rescue scenarios]
1 There .......was....... a boy in the river. 2 He ............................................ "Help!". 3 I ............................................ into the river. 4 I ............................................ the boy.
1 There ................................ a robbery. 2 We ............................................ the police. 3 The police ............................................ . 4 They ............................................ the woman.
B Work with a partner. Tell the story. Start like this:
Yesterday was a sunny day. I ...
[IMAGE: Series of 10 small illustrations showing various daily activities with captions:] be / sunny day walk / to the park phone / friends wait / 10 minutes friends / arrive play / football stop / 7 o'clock walk / my house Dad / cook dinner watch TV / until midnight
Page 105
OUR YOUNG WORLD 4 Luna's helping out
1 Watch the video. What does Luna do in her free time?
.....................................................................................................................................................................
2 Watch again. Circle T (True) or F (False).
1 In her free time, Luna helps at an animal shelter*. T / F 2 She gets money for her work. T / F 3 The shelter has a big problem – there's not enough money. T / F 4 Luna decided to write an email to the mayor. T / F 5 Luna is now feeling very pessimistic. T / F 6 In her programme, Luna asks people to help the animal shelter. T / F
VOCABULARY: *animal shelter – Tierheim
FIND OUT Political education
3 Match the words with their definitions.
1 class speaker □ In a ... the people have the power. They vote for their parliament. 2 vote □ The leader of the town council*. 3 mayor □ choose a person from a list of people 4 democracy □ At the beginning of the school year, all the boys and girls in a class choose this person.
VOCABULARY: *town council – Gemeinderat
Our local politics world
4 Discuss in pairs.
1 Would you like to be the class speaker? Why (not)? 2 Who is the mayor in your town? 3 What would you like to talk to him/her about?
[IMAGE: Three photos showing children protesting for environmental causes, a child cleaning outdoors, and a "GO VOTE!" sign]
CYBER PROJECT: A role play
5 Imagine you have got a meeting with your mayor: • Plan a role play. • Make a video.
Page 106
LISTENING & READING
16 Look at the picture. Where can you see:
• a small spaceship? • gas clouds? • a button? • the eye of a storm? • a robot arm? • planet Jupiter?
[IMAGE: Detailed illustration of spaceship interior with "SPACE RESCUE" text]
17 Read the title and the introduction to the radio play. In pairs, guess words from the story. Write a list. Then make a story.
The year is 3231 and the Earth is dying. There are no trees and no forests. People are living on very big spaceships. The spaceships need gas from the planet Jupiter. But it is very dangerous ...
18 Listen to the story. Then read the text and circle the correct words.
Captain Diana was above Jupiter. She was in her spaceship. Diana and the pilot were in front of a big screen. Suddenly, there was a big storm and they 1happened / noticed a little spaceship.
"Fly into the eye of the storm!" 2shouted / landed Diana, but the pilot was not happy.
"We can't," he said, "because it's too dangerous!" Diana 3wanted / waited to rescue the spaceship because her friends were on it.
The pilot 4walked / moved the spaceship into the eye of the storm. Then Diana 5pressed / helped a button. The front of the spaceship 6opened / arrived and a big robot arm 7reached / walked out. The robot hand 8closed / opened around the spaceship.
After that, the two spaceships 9moved / stopped out of the storm. Finally, Diana's friends were safe!
WRITING
Useful language It was the year (2099). Suddenly ... Then ... Later ... After that Finally ...
Check on p. 123 for the past tense forms of many verbs.
19 Now write your own story in the past tense (80–100 words) about an adventure in space. Write three paragraphs.
• Paragraph 1: Write where the character(s) was (were). • Paragraph 2: Write about something dramatic. • Paragraph 3: Say how the story ended. • Find a good title for your story.
Page 107
GRAMMAR
Past simple (2) regular verbs
Du verwendest das Past simple, um über Vergangenes zu sprechen oder zu schreiben. Du verwendest für alle Personen in der Einzahl und Mehrzahl jeweils die gleiche Form des Verbs.
Bildung: Bei einem regelmäßigen Verb hängst du an den Infinitiv (Nennform) -ed an.
jump – I jumped wait – she waited shout – you shouted play – they played
start – he started happen – it happened help – we helped
Endet ein regelmäßiges Verb auf -e, fügst du nur ein -d an.
rescue – they rescued arrive – you arrived
Aber: carry – carried slip – slipped stop – stopped
[IMAGE: Illustration of person in phone booth on island with palm trees] Mary phoned for help.
Linking words (and, but, because)
So kannst du Sätze verbinden:
Diana wanted to rescue the spaceship because her friends were on it. "Fly into the eye of the storm!" shouted Diana, but the pilot was not happy. The front of the spaceship opened and a big robot arm reached out.
[IMAGE: Comic strip showing "MORE FUN WITH FIDO!" with dog character in three panels]
Now go back to page 100. Check ☑ with a partner what you know / can do.
Page 108
THE TWINS 6 The black eye
Developing speaking competencies
Language function | Speaking strategy □ I can arouse interest (Interesse wecken) | □ I can encourage someone to say what happened (jemanden zum Erzählen ermutigen)
VOCABULARY Injuries
1 Look at the photos. Match the injuries with the photos. Then listen and check.
1 a cut knee 2 a swollen ankle 3 a broken leg 4 a black eye
[IMAGE: Four medical photos labeled A, B, C, D showing different injuries]
2 Watch or listen to the dialogue. Then read it. Who did Leo meet on his way home?
Leo Hi. Lucy You're late. Leo I know. Look. Lucy Oh, dear. What happened? Leo Well, I was on my way home. I was in the park ... and guess what? Lucy What? Leo There were these kids. Very young kids. About seven or eight years old. Lucy I see. Leo They had a football. And you won't believe what happened.
[IMAGE: Photo showing two students talking in what appears to be a classroom]
Lucy Tell me. Leo One of the boys kicked it. High up in the sky. And an amazing thing happened. Lucy Really? Tell me more.
3 Read the dialogue in 2 again. Then write the answers to the questions.
1 Who's late? ........................................................................ 2 Why does Lucy ask what happened? ........................................................................ 3 Something happened to Leo. Where did it happen? ........................................................................ 4 What did one of the boys do with the football? ........................................................................
Page 109
USEFUL PHRASES Arousing interest
4 Complete the sentences with the words from the box. Then check with the dialogue in 2.
believe amazing what
1 I was on my way home. I was in the park and guess .................................... ? 2 You won't .................................... what happened. 3 An .................................... thing happened.
? What do you think? Answer the questions.
• What happened with the football? • How did Leo get his black eye?
MOBILE HOMEWORK
Watch part 2 of the video and put the events in the correct order.
□ Finally, Leo started to play football with them. □ The ball got stuck in a tree and the kids were very unhappy. □ Leo tried to help. He started throwing stones at the ball, but that didn't work.
□ One of the boys kicked the football high up in the sky. □ Leo climbed up and got the ball back. □ The kids were very happy and thanked Leo. □ One of the boys passed Leo the ball, and he ran into the ladder. □ They got a ladder and put it against the tree with the ball in it.
SPEAKING STRATEGY Encouraging someone to say what happened
5 Complete the dialogues with the words from the box. Then check with the dialogue in 2.
me more what
1 Leo I know. Look. Lucy Oh, dear. ..................................... happened?
2 Leo You won't believe what happened. Lucy Tell .................................... .
3 Leo An amazing thing happened. Lucy Really? Tell me .................................... .
6 CHOICES
A Work in pairs. A tells B that something happened. B wants to know more.
in class (this morning) on the way home (yesterday afternoon) at the market (last Saturday) at the concert (on Sunday)
[SPEECH BUBBLES: A I was in class this morning. An amazing thing happened. B Tell me more.]
B ROLE PLAY: Work in pairs. Look at the situation and the roles. Think of a role play with a partner. Take 2 or 3 minutes to practise it. Act it out in class.
Roles: You and your friend
Situation: You want to meet up with a friend, but your friend is late. You notice that your friend has got a problem (see 1). You want to know what happened. Encourage your friend to tell you the story. Use the language from 4 and 5.


----- WB: WB Unit 13 Help.txt -----
Unit 13 Help!
Pages 110-111
UNDERSTANDING VOCABULARY Emergency services
1 Write the words from the box under the pictures.
mountain rescue bomb disposal police ambulance coastguard fire brigade
[Six images showing emergency services:
Mountain rescue team with people and ambulance
Police officers in a car
Fire brigade truck with firefighters
Bomb disposal team in protective gear
Helicopter rescue over mountains
Coastguard boat at sea]
1 ................................................ 2 ................................................ 3 ................................................ 4 ................................................ 5 ................................................ 6 ................................................
USING VOCABULARY Emergency services
2 Find the words in the word snake and write them in the correct gaps.
[Word snake containing: slipbeshoutradiohelicopterjetpackfly]
1 .................................................. on wet rocks 5 .......................................................................... 2 ......................................................... in danger 6 .......................................................................... 3 ........................................................... for help 7 .......................................... up the mountain 4 ............................................. the rescue team
Pages 111-112
3 Write the names of the emergency services from 1 in the speech bubbles.
Don't touch it! It's going to explode*. Call the ¹.......................................... !
There are two climbers at the top. They can't get down. Call the ².......................................... !
Three bank robbers are in the bank. Call the ³.......................................... !
The house is on fire. Call the ⁴.......................................... !
I think my leg's broken. Call an ⁵.......................................... !
The boat is sinking*. Call the ⁶.......................................... !
*VOCABULARY: explode – explodieren; sink – (ver-)sinken
UNDERSTANDING GRAMMAR Linking words (and, but, because)
4 Circle the correct word.
1 Sally was in bed and / because she was tired. 2 I picked up my school bag and / because opened the door. 3 I phoned Angus, but / and he wasn't at home. 4 I invited Janice to my party because / but she's my best friend. 5 I was tired, because / but happy too. 6 I switched off the TV because / but the film was boring. 7 I wanted to do my homework, but / because it was too difficult. 8 Dad cooked dinner and / but waited for us in the kitchen.
UNDERSTANDING GRAMMAR Past simple (2) regular verbs
5 Write the verbs in the correct box.
shouted push change slip wait looked started walk want carried jump arrive landed rescued remembered happen stopped cooked play phoned
Present simple Past simple
.................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... .................................................................... ....................................................................
Pages 112-113
6 Write the verbs in the past tense.
1 jump ..................... jumped ..................... 8 phone ....................................................... 2 change ....................................................... 9 stop ....................................................... 3 wait ....................................................... 10 call ....................................................... 4 play ....................................................... 11 help ....................................................... 5 walk ....................................................... 12 collect ....................................................... 6 carry ....................................................... 13 happen ....................................................... 7 arrive ....................................................... 14 slip .......................................................
USING GRAMMAR Linking words (but, because)
7 Complete the sentences with but or because.
1 They wanted to play football, .......................................... it was too hot. 2 I sit next to Priya in class .......................................... she is my best friend. 3 We walked to the park .......................................... we wanted to play football. 4 Hannah was excited, .......................................... she was also very happy. 5 We watched a film in the evening, .......................................... it wasn't good. 6 He opened the window .......................................... it was hot. 7 I knocked at the door, .......................................... there was no answer.
USING GRAMMAR Past simple (2) regular verbs
8 Complete the sentences with the past tense of the verbs in the box.
want shout rescue wait sail arrive chase watch
1 The police .................................................. at Grafton Street. 2 Pam .................................................. an ice cream. 3 Chris was angry. He .................................................. at me. 4 On Monday we .................................................. a boat. 5 Yesterday my dog .................................................. our cat. 6 We .................................................. a great film at school. 7 I .................................................. for ten minutes. 8 The helicopter .................................................. the people on the mountain.
[Illustration of a dog chasing a cat]
Pages 113-114
9 Put the verbs in brackets in the past tense and write the sentences from the box under the correct picture to make a story.
Suddenly, the big boy (push) the small boy into the river. Helen (walk) to the park. Manju (phone) for the ambulance and the police. Helen (wait) for 15 minutes. Then Manju (arrive). In the park she (phone) her friend Manju. It (be) a sunny day.
The girls (walk) to the river. The police (interview) the girls. Helen (jump) into the river. There (be) two boys there. Helen (rescue) the boy. The ambulance (arrive).
[12 numbered illustrations showing the sequence of events described in the story]
1 ............................................................................................................................................................... 2 ............................................................................................................................................................... 3 ............................................................................................................................................................... 4 ............................................................................................................................................................... 5 ............................................................................................................................................................... 6 ............................................................................................................................................................... 7 ............................................................................................................................................................... 8 ............................................................................................................................................................... 9 ............................................................................................................................................................... 10 ............................................................................................................................................................... 11 ............................................................................................................................................................... 12 ...............................................................................................................................................................
Pages 114-115
WRITING Writing a story in the past
10 Look at the pictures. Write the story in the past. Use the words in brackets to help you.
[8 sequential images showing a mountain rescue story]
1 It was a sunny day. A man was in his car in the mountains. (be / car / mountain) 2 ......................................................................... ......................................................................... (storm / start / road / wet)
3 ......................................................................... 4 ......................................................................... ......................................................................... ......................................................................... (slip / wet road) (crash into / big rock)
5 ......................................................................... 6 ......................................................................... ......................................................................... ......................................................................... (phone / mountain rescue) (arrive / jetpack / help)
7 ......................................................................... 8 ......................................................................... ......................................................................... ......................................................................... (radio / helicopter) (arrive / rescue)
Pages 115-116
11 Choose five verbs from the box and write about what you did yesterday.
play walk 1 I helped my dad in the kitchen. carry arrive 2 ......................................................................................................................................... phone wash 3 ......................................................................................................................................... watch help 4 ......................................................................................................................................... cook listen 5 ......................................................................................................................................... be play 6 .........................................................................................................................................
DIALOGUE WORK Arousing interest / Encouraging so. to say what happened
12 CHOICES
1/42
A Complete the sentences. Then listen and check.
[Image 1: Two people with bicycles] 1 Dave G...................... w...................... happened to me on the way to school! Paul T...................... m...................... . Dave Someone pushed me off my bike. Paul That's terrible!
[Image 2: Two people talking] 2 Susie You w...................... b...................... what happened to me last week! Emily W...................... h...................... ? Susie I met* my favourite singer. Emily No way!
[Image 3: Person with test results] 3 Olivia An a...................... t...................... happened to me yesterday. Liam R...................... ? T...................... m...................... m...................... . Olivia I passed* my maths test with 99%. Liam Well done. That's great!
VOCABULARY: *met – past form of meet; pass – hier: bestehen
B Complete the dialogues with your own ideas.
1 Jim Guess what happened to me at school today. Tina ................................................................................................................................. Jim ................................................................................................................................. Tina .................................................................................................................................
2 Bob You won't believe what happened to my sister yesterday. Laura ................................................................................................................................. Bob ................................................................................................................................. Laura .................................................................................................................................
3 Max An amazing thing happened to me on holiday. Kate ................................................................................................................................. Max ................................................................................................................................. Kate .................................................................................................................................
Pages 116-117
LISTENING & DIALOGUE WORK Talking about emergency situations
1/43
13 Listen and complete the sentences.
1 Alan and Jennifer are .................................... and .................................... . 2 The .................................... pushed their boat onto an island. 3 A helicopter .................................... them.
1/43
14 Listen again and tick T (True) or F (False).
1 Jennifer and Alan were in a boat in the afternoon. T ☐ F ☐ 2 It was very windy in the afternoon. T ☐ F ☐ 3 The coastguard called Jennifer. T ☐ F ☐ 4 The boat was on fire. T ☐ F ☐ 5 Jennifer and Alan jumped into the boat. T ☐ F ☐ 6 The helicopter pilot noticed the fire. T ☐ F ☐
[Illustration showing a fire on an island with people]
1/44
15 Complete the dialogue with the words from the box. Then listen and check.
Street minute car accident police spell course ambulance
Operator* Emergency. Fire brigade, police or ¹.................................... ? Woman ².................................... , please. Operator Just a ³.................................... , please. Man Hello? Woman Hello. There's an ⁴.................................... . Man Where? Woman In Bolt ⁵.................................... . Man Sorry, I can't hear you. Woman There's an accident. In Bolt Street. Man Can you ⁶.................................... the name of the street, please? Woman Of ⁷.................................... . It's B – O – L – T. Man OK. A police ⁸.................................... is coming now.
[Illustration of a car accident scene]
VOCABULARY: *operator – Telefonist/Telefonistin
16 Complete the dialogue.
[Illustration of a cat stuck in a tree]
Operator ¹............................................................................................... ? Man Fire brigade, please. Operator ²............................................................................................... ? Man There's a cat stuck up a tree. Operator ³............................................................................................... ? Man No, it's not my cat. Operator ⁴............................................................................................... ? Man In Cambrian Street. Operator ⁵............................................................................................... ? Man Sure. It's C – A – M – B – R – I – A – N. Operator Thank you. A fire engine* is coming now.
VOCABULARY: *fire engine – Löschfahrzeug
Pages 117-118
WORD FILE
Accident/Emergency
[Large illustration showing various emergency services and situations: storm, jetpack, helicopter, coastguard, fire brigade, ambulance, police, mountain rescue, and a person shouting for help]
MORE Words and Phrases
Number	English	Example	German
1	to be lucky	They were lucky. The helicopter rescued them.	Glück haben
	to break	She falls and breaks her leg.	brechen
	country	Austria is a European country.	Land; Staat
	crime	Robbery is a crime.	Verbrechen
	fire	Help! There's a fire in Hammond Street.	Feuer
3	accident	There was an accident on the rocks.	Unfall
5	to be in danger	The police can help you when you are in danger.	in Gefahr sein
	to fly up the mountain	The man with the jetpack flies up the mountain.	den Berg hinauffliegen

Page 118
	to radio	He finds her and radios the rescue team.	(an-)funken
	rescue team	The rescue team arrives in the helicopter.	Rettungsteam
	rock	The rock is wet.	Stein
	to shout for help	She hasn't got a phone and shouts for help.	um Hilfe rufen
	to slip	He slips on wet rocks.	ausrutschen
	storm	Yesterday, there was a storm with strong winds.	Sturm
	wet	It rained. The rocks are wet.	nass
6	to arrive	The mountain rescue team arrives.	(an-)kommen
	to be safe	The helicopter arrives. You're safe!	in Sicherheit sein
	to dream	Are you dreaming? No – the man has a jetpack.	träumen
	to fall down	You fall down and break your leg.	(hinunter-)fallen
	to land	It is difficult for a helicopter to land on a mountain.	landen
	medicine	The rescue team gives you medicine and keeps you warm.	Medikament; Medizin
	sky	It's night-time. The sky is dark.	Himmel
	windy	There's a storm. It's very windy.	windig
8	dark	I can't see anything. It's very dark.	dunkel
	young	She's fifteen. She's a young teenager.	jung
12	alone	I was alone in the mountains.	allein
	backpack	My phone was in my backpack.	Rucksack
	to happen	What happened? The helicopter came back.	passieren
14	to chase	My dog chased a cat in our garden.	verfolgen, jagen
15	sunny	The weather was sunny in the morning.	sonnig
OWM	class speaker	At the beginning of the school year, we choose a class speaker.	Klassensprecher/Klassensprecherin
	democracy	In a democracy, the people have the power.	Demokratie
	mayor	The mayor is the leader of the town council.	Bürgermeister/Bürgermeisterin
	political	Political education is important.	politisch
	to vote	People vote for their parliament.	wählen
16	button	Diana pressed the button.	Schalter; Knopf
	cloud	There were dark clouds in the sky.	Wolke
17	Earth	We live on Earth.	Erde
	to die	The Earth is dying.	sterben
	forest	There are a lot of trees in the forest.	Wald
	introduction	Read the introduction to the radio play.	Einleitung
	space	People are living in spaceships in space.	Weltall
18	to notice	Suddenly, they noticed a little spaceship.	bemerken
	to press	You have to press the button.	drücken
	screen	They were in front of a big screen.	Bildschirm
19	adventure	That was a great adventure!	Abenteuer, Erlebnis
	character	In the story, the characters are in space.	Figur; Person
T6	Guess what?		Du wirst es nicht glauben.
	Tell me more.		Erzähl mir mehr.

```

## Output contract

Write `content/corpus/units/g1-u13/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u13",
  "briefBank": "e4abaa2bacfd",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u13.s.linking-words",
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
