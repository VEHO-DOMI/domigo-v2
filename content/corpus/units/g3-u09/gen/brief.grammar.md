# Grammar generation brief — g3-u09 (MORE! 3, Unit 9)

<!-- domigo:gen grammar g3-u09 bank=d66ad0eea339 prompt=4b9164076103 -->

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

### `g3u09.s.be-allowed-to` — be (not) allowed to (be (not) allowed to (Erlaubnis und Verbot))

be (not) allowed to + verb for saying whether someone has permission to do something - typically rules and permissions from an authority such as parents or a school.

v1 floor for this structure: **39 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [form-be-allowed-to]: Form it with person + be (not) + allowed to + the base verb. Use be allowed to for permission and be not allowed to for a ban.
  - DE: Du bildest es mit Person + be (not) + allowed to + Grundform. be allowed to steht für Erlaubnis, be not allowed to für ein Verbot.
  - "We aren't allowed to play ballgames there." — "Wir dürfen dort nicht Ball spielen."
  - "I'm not allowed to go out when it's dark." — "Ich darf nicht rausgehen, wenn es dunkel ist."
- rule [questions-be-allowed-to]: Form questions by putting am/is/are in front: Am/Is/Are + person + allowed to ...?
  - DE: Fragen bildest du, indem du am/is/are nach vorne stellst: Am/Is/Are + Person + allowed to ...?
  - "Are you allowed to have parties at home?" — "Darfst du zu Hause Partys feiern?"

common errors:
- Omitting the form of be before allowed: ✗ "I not allowed to go out." → ✓ "I'm not allowed to go out."
- Wrong form of be (subject-verb agreement): ✗ "She are allowed to go." → ✓ "She is allowed to go."
- Confusing be allowed to (permission) with can (ability): ✗ "I'm allowed to swim very well." → ✓ "I can swim very well."

SB box `g3/sb/More 3 SB Unit 9.txt#grammar-1` — be allowed to / let:
```
You use be (not) allowed to to say someone has or doesn’t have permission to do something.
I’m not allowed to go out when it’s dark – my parents say it’s too dangerous.
 We aren’t allowed to play ballgames there.
 Are you allowed to have parties at home?
🔍 Match:
 1 You use be allowed to to say □
 2 You use be not allowed to to say □
a you don’t have permission to do something.
 b you have permission to do something.
How to form it: person + be (not) + allowed to + verb
You use (not) let to say that someone gives or doesn’t give permission to do something.
When there’s a good film on, my parents let me watch it.
 I think my parents might let me have a stud anyway.
Negation:
My parents don’t let me dye my hair.
 They don’t let me eat fast food every day.
```

v1 seed items (UNTRUSTED):
- `m3-u9-be-allowed-to-gf-001` [gap-fill, d1]: p="We ___ allowed to use our phones in class." c="aren't" a=["aren't","are not"] ds=["isn't","don't","not"]
- `m3-u9-be-allowed-to-gf-002` [gap-fill, d1]: p="___ you allowed to stay up late on Fridays?" c="Are" a=["Are"] ds=["Do","Is","Can"]
- `m3-u9-be-allowed-to-gf-003` [gap-fill, d2]: p="She ___ allowed to go to the concert last weekend." c="wasn't" a=["wasn't","was not"] ds=["weren't","didn't","isn't"]
- `m3-u9-be-allowed-to-gf-004` [gap-fill, d3]: p="At my old school, we ___ allowed to wear jeans." c="were" a=["were"] ds=["was","are","been"]
- `m3-u9-be-allowed-to-gf-005` [gap-fill, d4]: p="Tom ___ allowed to borrow the car because he passed his driving test." c="is" a=["is","'s"] ds=["are","can","does"]
- `m3-u9-be-allowed-to-gf-006` [gap-fill, d5]: p="When I was little, I ___ allowed to watch TV after 9 pm, but now I ___ ." c="wasn't ... am" a=["wasn't ... am","was not ... am"] ds=["wasn't ... do","didn't ... am","weren't ... is"]
- `m3-u9-be-allowed-to-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="We aren't allowed to run in the corridor." a=["We aren't allowed to run in the corridor."] ds=["We don't allowed to run in the corridor.","We not allowed to run in the corridor.","We aren't allowed run in the corridor."]
- `m3-u9-be-allowed-to-mc-002` [multiple-choice, d3]: p="Choose the correct option: My little brother ___ to play with matches." c="isn't allowed" a=["isn't allowed"] ds=["doesn't allowed","not allowed","don't allowed"]
- `m3-u9-be-allowed-to-mc-003` [multiple-choice, d4]: p="Which sentence correctly uses 'be allowed to' for permission?" c="You're not allowed to take photos in the museum." a=["You're not allowed to take photos in the museum."] ds=["You're not allowed taking photos in the museum.","You don't allow to take photos in the museum.","You not allowed to take photos in the museum."]
- `m3-u9-be-allowed-to-ec-001` [error-correction, d2]: p="Find and fix the mistake: I not allowed to eat sweets before dinner." c="I'm not allowed to eat sweets before dinner." a=["I'm not allowed to eat sweets before dinner.","I am not allowed to eat sweets before dinner.","I'm not allowed to eat sweets before dinner"] ds=[]
- `m3-u9-be-allowed-to-ec-002` [error-correction, d3]: p="Find and fix the mistake: She are allowed to go to the party on Saturday." c="She is allowed to go to the party on Saturday." a=["She is allowed to go to the party on Saturday.","She's allowed to go to the party on Saturday.","She is allowed to go to the party on Saturday"] ds=[]
- `m3-u9-be-allowed-to-ec-003` [error-correction, d2]: p="Find and fix the mistake: We aren't allowed go swimming after dark." c="We aren't allowed to go swimming after dark." a=["We aren't allowed to go swimming after dark.","We are not allowed to go swimming after dark.","We aren't allowed to go swimming after dark"] ds=[]
- `m3-u9-be-allowed-to-tf-001` [gap-fill, d3]: p="Your exchange student asks about school rules. Explain: 'We ________ (not / be allowed to) use phones in class.'" c="aren't allowed to" a=["aren't allowed to","are not allowed to"] ds=["are allowed to","weren't allowed to","isn't allowed to"]
- `m3-u9-be-allowed-to-tf-002` [gap-fill, d4]: p="A new student asks where they can eat. Tell them: 'You ________ (be allowed to) eat in the canteen.'" c="are allowed to" a=["are allowed to"] ds=["aren't allowed to","were allowed to","is allowed to"]
- `m3-u9-be-allowed-to-tf-003` [gap-fill, d4]: p="Describe the rules at your school for a project: 'Students ________ (not / be allowed to) run in the corridors.'" c="aren't allowed to" a=["aren't allowed to","are not allowed to"] ds=["are allowed to","weren't allowed to","isn't allowed to"]
- `m3-u9-be-allowed-to-tr-001` [translation, d2]: p="🇩🇪 Wir dürfen im Unterricht keine Handys benutzen." c="We aren't allowed to use phones in class." a=["We aren't allowed to use phones in class.","We are not allowed to use phones in class.","We aren't allowed to use our phones in class.","We are not allowed to use our phones in class."] ds=[]
- `m3-u9-be-allowed-to-tr-002` [translation, d5]: p="🇩🇪 Darf ich hier Fotos machen?" c="Am I allowed to take photos here?" a=["Am I allowed to take photos here?","Am I allowed to take pictures here?","Am I allowed to take photos here","Am I allowed to take pictures here"] ds=[]
- `m3-u9-be-allowed-to-sb-001` [sentence-building, d1]: p="Put the words in the correct order: not / you / are / to / allowed / run / here" c="You are not allowed to run here." a=["You are not allowed to run here.","You are not allowed to run here"] ds=[]
- `m3-u9-be-allowed-to-mt-001` [matching, d3]: p="Match each subject with the correct form to complete 'be allowed to go out'. 1: I 2: She 3: We 4: They 5: He" c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"b\",\"4\":\"b\",\"5\":\"a\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"b\",\"4\":\"b\",\"5\":\"a\"}"] ds=["a: is allowed to go out","b: are allowed to go out","c: am allowed to go out"]
- `m3-u9-be-allowed-to-qf-001` [question-formation, d3]: p="Lisa is allowed to stay out until 9 pm. Ask about: what time Lisa is allowed to stay out until." c="What time is Lisa allowed to stay out until?" a=["What time is Lisa allowed to stay out until?","Until what time is Lisa allowed to stay out?","What time is Lisa allowed to stay out until"] ds=[]
- `m3-u9-be-allowed-to-gf-021` [gap-fill, d1]: p="She ___ allowed to stay up until 10 pm." c="is" a=["is","'s"] ds=["are","am","do"]
- `m3-u9-be-allowed-to-gf-022` [gap-fill, d2]: p="___ you allowed to eat in the library?" c="Are" a=["Are"] ds=["Do","Is","Have"]
- `m3-u9-be-allowed-to-gf-023` [gap-fill, d3]: p="At our school, students ___ allowed to wear hats in the classroom." c="aren't" a=["aren't","are not"] ds=["isn't","don't","can't"]
- `m3-u9-be-allowed-to-gf-024` [gap-fill, d4]: p="My little brother ___ allowed to cross the road alone yet." c="isn't" a=["isn't","is not"] ds=["aren't","doesn't","don't"]
- `m3-u9-be-allowed-to-gf-025` [gap-fill, d5]: p="When I was younger, I ___ allowed to stay up late." c="wasn't" a=["wasn't","was not"] ds=["isn't","aren't","didn't"]
- `m3-u9-be-allowed-to-mc-020` [multiple-choice, d2]: p="Choose the correct sentence about a school rule:" c="We are not allowed to run in the corridors." a=["We are not allowed to run in the corridors."] ds=["We do not allowed to run in the corridors.","We are not allowed run in the corridors.","We are not allow to run in the corridors."]
- `m3-u9-be-allowed-to-mc-021` [multiple-choice, d3]: p="Which sentence correctly asks about permission?" c="Are we allowed to use a dictionary in the test?" a=["Are we allowed to use a dictionary in the test?"] ds=["Do we allowed to use a dictionary in the test?","Are we allowed use a dictionary in the test?","Is we allowed to use a dictionary in the test?"]
- `m3-u9-be-allowed-to-mc-022` [multiple-choice, d4]: p="Which sentence about home rules is correct?" c="I'm not allowed to play video games on school nights." a=["I'm not allowed to play video games on school nights."] ds=["I don't allowed to play video games on school nights.","I'm not allowed to playing video games on school nights.","I'm not allowed playing video games on school nights."]
- `m3-u9-be-allowed-to-ec-020` [error-correction, d2]: p="Find and fix the mistake: We don't allowed to chew gum at school." c="aren't allowed" a=["aren't allowed","are not allowed","We aren't allowed to chew gum at school.","We are not allowed to chew gum at school."] ds=[]
- `m3-u9-be-allowed-to-ec-021` [error-correction, d3]: p="Find and fix the mistake: He is allowed to goes out after 8 pm." c="go out" a=["go out","go","He is allowed to go out after 8 pm.","He is allowed to go out after 8 pm"] ds=[]
- `m3-u9-be-allowed-to-ec-022` [error-correction, d4]: p="Find and fix the mistake: Is they allowed to park here?" c="Are they" a=["Are they","Are they allowed to park here?","Are they allowed to park here"] ds=[]
- `m3-u9-be-allowed-to-tf-020` [gap-fill, d3]: p="A new student asks about school rules. Rewrite using 'be allowed to': 'You can't eat in class.' → 'You ________ eat in class.'" c="aren't allowed to" a=["aren't allowed to","are not allowed to"] ds=["are allowed to","weren't allowed to","isn't allowed to"]
- `m3-u9-be-allowed-to-tf-021` [gap-fill, d4]: p="You're explaining home rules to your friend. Rewrite using 'be allowed to': 'My parents say I can go to the park after school.' → 'I ________ go to the park after school.'" c="am allowed to" a=["am allowed to","'m allowed to"] ds=["isn't allowed to","wasn't allowed to","aren't allowed to"]
- `m3-u9-be-allowed-to-tr-020` [translation, d2]: p="Translate: Wir duerfen im Klassenzimmer nicht essen." c="We aren't allowed to eat in the classroom." a=["We aren't allowed to eat in the classroom.","We aren't allowed to eat in the classroom","We are not allowed to eat in the classroom.","We are not allowed to eat in class.","We aren't allowed to eat in class."] ds=[]
- `m3-u9-be-allowed-to-tr-021` [translation, d4]: p="Translate: Darf er nach 22 Uhr noch draussen bleiben?" c="Is he allowed to stay out after 10 pm?" a=["Is he allowed to stay out after 10 pm?","Is he allowed to stay out after 10 pm","Is he allowed to stay outside after 10 pm?","Is he allowed to be outside after 10 pm?"] ds=[]
- `m3-u9-be-allowed-to-sb-020` [sentence-building, d2]: p="Put the words in the correct order: to / allowed / aren't / talk / we / in / the / library" c="We aren't allowed to talk in the library." a=["We aren't allowed to talk in the library.","We aren't allowed to talk in the library"] ds=[]
- `m3-u9-be-allowed-to-sb-021` [sentence-building, d3]: p="Put the words in the correct order: allowed / is / to / she / ride / her / bike / to / school" c="She is allowed to ride her bike to school." a=["She is allowed to ride her bike to school.","She is allowed to ride her bike to school"] ds=[]
- `m3-u9-be-allowed-to-mt-020` [matching, d3]: p="Match each subject with the correct form. 1: I 2: She 3: We 4: They 5: He" c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"b\",\"4\":\"b\",\"5\":\"a\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"b\",\"4\":\"b\",\"5\":\"a\"}"] ds=["a: is allowed to","b: are allowed to","c: am allowed to"]
- `m3-u9-be-allowed-to-qf-020` [question-formation, d4]: p="Form a question: Your friend tells you 'I'm allowed to have a pet.' Ask what kind of pet. Start with 'What kind of pet...'" c="What kind of pet are you allowed to have?" a=["What kind of pet are you allowed to have?","What kind of pet are you allowed to have"] ds=["What kind of pet do you allowed to have?","What kind of pet you are allowed to have?","What kind of pet is you allowed to have?"]

### `g3u09.s.let` — let / don't let (let / don't let (Erlaubnis geben oder verweigern))

let + object + base verb (without to) for saying that someone gives or refuses permission. Here the person who gives permission is the subject, the mirror image of be allowed to. Taught in the same unit-9 box.

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [form-let-base-verb]: Form it with person + let + object + the base verb, with no to. The person who gives the permission is the subject.
  - DE: Du bildest es mit Person + let + Objekt + Grundform, ohne to. Die Person, die die Erlaubnis gibt, ist das Subjekt.
  - "When there's a good film on, my parents let me watch it." — "Wenn ein guter Film läuft, lassen mich meine Eltern ihn ansehen."
  - "I think my parents might let me have a stud anyway." — "Ich glaube, meine Eltern lassen mich vielleicht trotzdem einen Stecker tragen."
- rule [negation-dont-let]: Make the negative with don't/doesn't let + object + base verb.
  - DE: Die Verneinung bildest du mit don't/doesn't let + Objekt + Grundform.
  - "My parents don't let me dye my hair." — "Meine Eltern lassen mich meine Haare nicht färben."
  - "They don't let me eat fast food every day." — "Sie lassen mich nicht jeden Tag Fast Food essen."

common errors:
- Adding to after let + object: ✗ "My parents let me to go out." → ✓ "My parents let me go out."
- Forgetting the -s in the third person present: ✗ "She let us go every Friday." → ✓ "She lets us go every Friday."
- Mixing up let (no to) and allow (with to): ✗ "They don't let me to go." → ✓ "They don't let me go."

SB box `g3/sb/More 3 SB Unit 9.txt#grammar-1` — be allowed to / let:
```
You use be (not) allowed to to say someone has or doesn’t have permission to do something.
I’m not allowed to go out when it’s dark – my parents say it’s too dangerous.
 We aren’t allowed to play ballgames there.
 Are you allowed to have parties at home?
🔍 Match:
 1 You use be allowed to to say □
 2 You use be not allowed to to say □
a you don’t have permission to do something.
 b you have permission to do something.
How to form it: person + be (not) + allowed to + verb
You use (not) let to say that someone gives or doesn’t give permission to do something.
When there’s a good film on, my parents let me watch it.
 I think my parents might let me have a stud anyway.
Negation:
My parents don’t let me dye my hair.
 They don’t let me eat fast food every day.
```

v1 seed items (UNTRUSTED):
- `m3-u9-let-gf-001` [gap-fill, d1]: p="My parents ___ me go to the cinema on Saturdays." c="let" a=["let"] ds=["lets","let to","are let"]
- `m3-u9-let-gf-002` [gap-fill, d1]: p="The teacher ___ us use dictionaries during the test." c="lets" a=["lets"] ds=["let","lets to","letting"]
- `m3-u9-let-gf-003` [gap-fill, d2]: p="My mum doesn't ___ me play video games on school nights." c="let" a=["let"] ds=["lets","let to","letting"]
- `m3-u9-let-gf-004` [gap-fill, d3]: p="My parents ___ me stay at my friend's house last weekend." c="let" a=["let"] ds=["letted","lets","were let"]
- `m3-u9-let-gf-005` [gap-fill, d4]: p="My dad doesn't let me ___ his computer without asking." c="use" a=["use"] ds=["to use","using","used"]
- `m3-u9-let-gf-006` [gap-fill, d5]: p="The coach ___ (not / let) us leave practice early yesterday." c="didn't let" a=["didn't let","did not let"] ds=["doesn't let","not let","didn't letted"]
- `m3-u9-let-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="My sister lets me borrow her clothes." a=["My sister lets me borrow her clothes."] ds=["My sister lets me to borrow her clothes.","My sister let me to borrow her clothes.","My sister is let me borrow her clothes."]
- `m3-u9-let-mc-002` [multiple-choice, d3]: p="Choose the correct option: They didn't ___ us play outside." c="let" a=["let"] ds=["letted","let to","lets"]
- `m3-u9-let-mc-003` [multiple-choice, d5]: p="Which pair of sentences mean the same thing?" c="They let us go. = We are allowed to go." a=["They let us go. = We are allowed to go."] ds=["They let us go. = We can go. (ability)","They let us to go. = We are allowed to go.","They let us go. = We allowed to go."]
- `m3-u9-let-ec-001` [error-correction, d2]: p="Find and fix the mistake: My parents let me to go to the park." c="My parents let me go to the park." a=["My parents let me go to the park.","My parents let me go to the park","let me go"] ds=[]
- `m3-u9-let-ec-002` [error-correction, d3]: p="Find and fix the mistake: The coach didn't letted us go home early." c="The coach didn't let us go home early." a=["The coach didn't let us go home early.","The coach didn't let us go home early","The coach did not let us go home early.","didn't let"] ds=[]
- `m3-u9-let-ec-003` [error-correction, d4]: p="Find and fix the mistake: My dad let me to drive his car yesterday." c="My dad let me drive his car yesterday." a=["My dad let me drive his car yesterday.","My dad let me drive his car yesterday","let me drive"] ds=[]
- `m3-u9-let-tf-001` [gap-fill, d3]: p="You're telling your friend about your parents' rules. Complete: 'My parents ________ (let) me go to the party.'" c="let" a=["let"] ds=["lets","doesn't let","don't let"]
- `m3-u9-let-tf-002` [gap-fill, d2]: p="Your pen pal asks about your classroom rules. Explain: 'Our teacher ________ (not / let) us chew gum in class.'" c="doesn't let" a=["doesn't let","does not let"] ds=["don't let","lets","let"]
- `m3-u9-let-tf-003` [gap-fill, d4]: p="You're chatting with a friend about bedtime rules at home. Tell them: 'My mum ________ (not / let) my brother stay up late.'" c="doesn't let" a=["doesn't let","does not let"] ds=["don't let","lets","let"]
- `m3-u9-let-tr-001` [translation, d2]: p="🇩🇪 Meine Eltern lassen mich am Wochenende länger aufbleiben." c="My parents let me stay up longer at the weekend." a=["My parents let me stay up longer at the weekend.","My parents let me stay up later at the weekend.","My parents let me stay up longer on the weekend.","My parents let me stay up later at weekends.","My parents let me stay up longer at weekends."] ds=[]
- `m3-u9-let-tr-002` [translation, d3]: p="🇩🇪 Der Lehrer lässt uns nicht im Unterricht essen." c="The teacher doesn't let us eat in class." a=["The teacher doesn't let us eat in class.","The teacher does not let us eat in class.","The teacher doesn't let us eat during class.","The teacher doesn't let us eat in lessons."] ds=[]
- `m3-u9-let-sb-001` [sentence-building, d1]: p="Put the words in the correct order: doesn't / the teacher / talk / let / in class / us" c="The teacher doesn't let us talk in class." a=["The teacher doesn't let us talk in class.","The teacher doesn't let us talk in class"] ds=[]
- `m3-u9-let-mt-001` [matching, d4]: p="Match each sentence with the correct verb pattern. 1: My parents let me 2: My parents allow me 3: My parents don't let me 4: I'm not allowed" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"b\",\"4\":\"a\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"b\",\"4\":\"a\"}"] ds=["a: to go out.","b: go out."]
- `m3-u9-let-qf-001` [question-formation, d3]: p="My parents let me go out on Saturdays. Ask about: whether your parents let you go out on Saturdays." c="Do your parents let you go out on Saturdays?" a=["Do your parents let you go out on Saturdays?","Do your parents let you go out on Saturdays"] ds=[]
- `m3-u9-let-gf-020` [gap-fill, d1]: p="My mum ___ me watch TV after dinner." c="lets" a=["lets"] ds=["let","let's","letting"]
- `m3-u9-let-gf-021` [gap-fill, d1]: p="Our teacher doesn't ___ us use our phones." c="let" a=["let"] ds=["lets","letting","to let"]
- `m3-u9-let-gf-022` [gap-fill, d2]: p="My parents don't ___ me stay out after 9 pm." c="let" a=["let"] ds=["lets","to let","allowed"]
- `m3-u9-let-gf-023` [gap-fill, d3]: p="Dad ___ my sister drive his car. She's only 14!" c="doesn't let" a=["doesn't let","does not let"] ds=["don't let","doesn't lets","not lets"]
- `m3-u9-let-gf-024` [gap-fill, d4]: p="My parents ___ me ___ (go) to the concert last weekend." c="let ... go" a=["let ... go","let...go"] ds=["let ... to go","letted ... go","let ... going"]
- `m3-u9-let-gf-025` [gap-fill, d5]: p="My older sister never ___ me ___ (borrow) her clothes." c="lets ... borrow" a=["lets ... borrow","lets...borrow"] ds=["lets ... to borrow","let ... borrows","lets ... borrowing"]
- `m3-u9-let-mc-020` [multiple-choice, d2]: p="Choose the correct sentence:" c="My teacher lets us work in pairs." a=["My teacher lets us work in pairs."] ds=["My teacher lets us to work in pairs.","My teacher let us to work in pairs.","My teacher lets us working in pairs."]
- `m3-u9-let-mc-021` [multiple-choice, d3]: p="Which sentence correctly uses 'don't let'?" c="My parents don't let me play video games on weekdays." a=["My parents don't let me play video games on weekdays."] ds=["My parents don't let me to play video games on weekdays.","My parents don't let me playing video games on weekdays.","My parents doesn't let me play video games on weekdays."]
- `m3-u9-let-mc-022` [multiple-choice, d4]: p="Which sentence about permission is correct?" c="The coach doesn't let us leave training early." a=["The coach doesn't let us leave training early."] ds=["The coach doesn't let us to leave training early.","The coach doesn't lets us leave training early.","The coach don't let us leave training early."]
- `m3-u9-let-ec-020` [error-correction, d2]: p="Find and fix the mistake: She lets me to use her computer." c="lets me use" a=["lets me use","She lets me use her computer.","She lets me use her computer"] ds=[]
- `m3-u9-let-ec-021` [error-correction, d3]: p="Find and fix the mistake: My dad doesn't lets me drive his car." c="doesn't let" a=["doesn't let","My dad doesn't let me drive his car.","My dad doesn't let me drive his car"] ds=[]
- `m3-u9-let-ec-022` [error-correction, d4]: p="Find and fix the mistake: My parents didn't letted me go to the party." c="didn't let" a=["didn't let","My parents didn't let me go to the party.","My parents didn't let me go to the party"] ds=[]
- `m3-u9-let-tf-020` [gap-fill, d3]: p="You're telling a friend about your school rules. Rewrite using 'let': 'Our teacher allows us to listen to music during art.' → 'Our teacher ________ to music during art.'" c="lets us listen" a=["lets us listen"] ds=["lets","don't let","letting"]
- `m3-u9-let-tf-021` [gap-fill, d5]: p="You're telling a friend about home rules. Rewrite using 'let': 'I'm not allowed to have a dog.' → 'My parents ________ a dog.'" c="don't let me have" a=["don't let me have"] ds=["doesn't let","let","lets"]
- `m3-u9-let-tr-020` [translation, d2]: p="Translate: Meine Eltern lassen mich am Wochenende laenger aufbleiben." c="My parents let me stay up longer at the weekend." a=["My parents let me stay up longer at the weekend.","My parents let me stay up longer at the weekend","My parents let me stay up later at the weekend.","My parents let me stay up later at weekends.","My parents let me stay up longer on weekends."] ds=[]
- `m3-u9-let-tr-021` [translation, d4]: p="Translate: Der Lehrer laesst uns nicht waehrend des Unterrichts reden." c="The teacher doesn't let us talk during class." a=["The teacher doesn't let us talk during class.","The teacher doesn't let us talk during class","The teacher doesn't let us talk in class.","The teacher does not let us talk during class.","The teacher doesn't let us talk during lessons."] ds=[]
- `m3-u9-let-sb-020` [sentence-building, d2]: p="Put the words in the correct order: let / mum / me / my / doesn't / sweets / eat / before / dinner" c="My mum doesn't let me eat sweets before dinner." a=["My mum doesn't let me eat sweets before dinner.","My mum doesn't let me eat sweets before dinner"] ds=[]
- `m3-u9-let-sb-021` [sentence-building, d3]: p="Put the words in the correct order: play / the / lets / outside / us / teacher" c="The teacher lets us play outside." a=["The teacher lets us play outside.","The teacher lets us play outside"] ds=[]
- `m3-u9-let-mt-020` [matching, d3]: p="Match each sentence beginning with the correct ending. 1: My dad lets me 2: The teacher doesn't let us 3: My parents let me 4: She doesn't let her brother 5: Our coach lets us" c="{\"1\":\"c\",\"2\":\"e\",\"3\":\"a\",\"4\":\"b\",\"5\":\"d\"}" a=["{\"1\":\"c\",\"2\":\"e\",\"3\":\"a\",\"4\":\"b\",\"5\":\"d\"}"] ds=["a: stay up until 11 on Fridays.","b: use her phone.","c: ride my bike to school.","d: choose the warm-up exercises.","e: chew gum in class."]
- `m3-u9-let-qf-020` [gap-fill, d4]: p="Your friend says their parents are strict. Form a question: 'Do your parents ________ (let) you ________ (go) out on school nights?'" c="let ... go" a=["let ... go","let...go","Do your parents let you go out on school nights?"] ds=["let ... to go","lets ... go","let ... going"]

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
- **g2-u12**: headache, toothache, earache, stomach ache, pain in ankle, knee, backache, throat, bath, medicine, memory, patient, spoon, blood, lamp post, cure, to cure, dentist, to mash, to mix, taste, toothpaste, worm, smell, first aid, helpful, horrible, pupil, since, Believe me!, to injure, It doesn't matter., writer
- **g2-u13**: snowy, thunderstorm, cloudy, windy, rainy, sunny, foggy, hot, cold, weather presenter / meteorologist, coast, to continue, cool, degree, dry, formula, to give way, scale, sunshine, temperature, to clear up, fog, forecast, hope, outlook, small talk, thick, towards, Have a nice day!, to make sure, to rise, axe, bright, flash of light, to shine, average, below, generally, inch (pl inches), mild, mile, rainfall, to record, sea level, throughout the year, western, wet, heavy rain, tan, binoculars, career, to earn, to be mad about sth.
- **g2-u14**: roller-skating, sportsman and sportswoman, ice skating, snowboarding, skiing, surfing, mountain climbing, windsurfing, swimming, mountain biking, cycling, skateboarding, to grow up, member, professional, race, serious, to appear, competition, challenge, distance, extreme, flood, to manage, official, rather, to snorkel, to take part (in), without, world record, nil, on one's own, to score, to tackle, waste of time, equipment, success
- **g2-u15**: to feed your pet, to clean out the litter tray, to clean out your pet's cage, to play with your pet, to dry your pet, to stroke, to brush, to walk your pet, to take your pet to the vet, to give your pet a bath, cage, litter tray, vet (veterinarian), to have got a fear of, to keep sb. company, Neither do I., So do I., space, Antarctic Ocean, emperor penguin, to release, sand, pyjamas, to tidy (up)
- **g3-u01**: to give sth. a try, to give up, audition, to have got what it takes, to make it, to be on the way up, to get back to sb., to agree, to belong to, to celebrate, extremely, flute, singer, successful, talented, to spill, whole, critic, brave, not even, suit, unhappy, to waste, to feel, to get tired of sth., lyrics, to make up, record, to seem, to sing along, tune, I can't stand it., I don't mind (it)., to come along, to take place, afterwards, apart from, in my opinion, to be interested in, Me neither.
- **g3-u02**: to buy sth., to listen to music, to try on sunglasses, to pay the bill, to drink/eat sth., to look at sth., to talk on the mobile, coincidence, married, similar, to return, What a ...!, author, member, passenger, to sink, to survive, careless, handbag, I beg your pardon., to steal, thief (pl thieves), North Pole, South Pole, awful, entrance, to hand sth. in, Hold on!, to leave sb. alone, to look forward to sth., queue, to queue (up), to wave, date of birth, Hang on a minute., to achieve (a goal), laugh, note, per cent, speech, stage, to try out
- **g3-u03**: to get to (the airport), to take off, to get on (a plane), to fly (back), to get off (the plane), to suffer from altitude sickness, to land, it takes (an hour), to get into (a car), to rent (a car), to get out of (the car), to drive (home), to set off (for work), to work on (a blog), to get close to (nature), to sleep in a tent, to escape (the midday heat), to cross (a river), to meet up with (people), to become, curious, decision, experience, to explore, journey, on foot, painful, to reach, to sail, traveller, lonely, to criticise, explorer, even though, hut, to turn out, wilderness, to behave, all in all, awake, pretty, unfortunately, departure, flight, to make a reservation, to note, to fix sth., thirsty, impossible, recently, to get lost, to get to know sb./sth., to promise, to recommend
- **g3-u04**: poisonous, aggressive, dangerous, deadly, elegant, stunning, cute, furry, cuddly, cub, Good luck!, polar bear, adorable, bite, to cause, poison, rabies, seal, swan, to bite (off), lizard, to chase away, to complain, injury, to lift, to pull down, to accept, immediately, to advise (sb.) against sth., to bleed, death, to defend, to mistake sth. for sth., on average, scuba diver, shape, to suppose, to take care, victim, to communicate, audience, environment, Hands off!, to inform, to lock sb. up, politician
- **g3-u05**: to be unlucky, to make a wish, to wish for sth., to bring (good/bad) luck, to come true, spooky, to have (good/bad) luck, to believe in superstitions, alarm clock, Any luck?, beside, Do you mind ...?, evil, I'm joking., to ignore, satisfied, to scream, sleeping bag, spirit, superstition, to attract, to enter, haircut, obvious, traditional, to trick, unlucky, to whistle, crack, cuckoo, pavement, rich, to shake, superstitious, to catch a cold, toothbrush, to arrange, I'm sure., lucky charm, salt, seriously
- **g3-u06**: bridge, river, art gallery, square, park, tower, district, building, street, shop, shopping centre, stadium, to burn down, collection, government, the Houses of Parliament, in advance, to photograph, play, prison, to raise, raven, to take a walk, theatre, view, visitor, thrilling, approximately, to cough (up), cruel, empty, fever, to report, path, spectacular, tourist attraction, to experience, traffic, multicultural, contract, to lead, sugar, to earn (money), to save up for, to sign
- **g3-u07**: to fall out with sb., to storm out of, to break up with sb., to mind your own business, to make up with sb., to get on well with sb., It's none of my business., to laugh at sb., to make up one's mind, to make fun of sb., to move, soft toy, to step in, relationship, to own, childhood (no pl), earring, jealous, to keep (a) secret, questionnaire, to tell sb. off, to solve, beloved, nowhere, script, to struggle, to lie to sb., to admit, to blackmail, clumsy, honest, a pile of, rash, unwell
- **g3-u08**: to invent, to experiment, to improve, to discover, to work sth. out, to design, to try out, to produce, bacon, to decorate, dish, fat, invention, crowd, current, to develop, electric (motor), energy, influence, inventor, to invest, perhaps, to be responsible for, to shoot, confident, to impress, soap, device, product, remarkable, to research, wrist, crutches, illness, ramp, wheelchair, to adapt, to attach, glove, housework, automatically, collar, computer science, engineer, inspiration, to repair, to support
- **g3-u09**: to dye your hair, to get a tattoo, to hang out in shopping centres, to go roller-skating without pads, to get a nose stud, to scroll through your phone, to have a party at home, to buy your own clothes, to eat too many sweets, to wear earrings, to ride your bike without a helmet, to come home after ten, to turn your music up loud, to go to the disco, to play video games all day, to watch TV after 10 o'clock, to be allowed to do sth., It's a pity., strict, to adopt, community, conservative, modern technology, plenty, to pray, to punish, It depends., to stay up, to invite sb. over, for a change, journalist, litter-picking, rude, unbelievable, to freeze, to lend, Never mind!, to remind sb., to sort out

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Alan, Albu, Alessia, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Cambridge, Came, Cameroon, Candyman, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chile, China, Chito, Chloe, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, College, Columbus, Column, Come, Complimenting, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fang, Faye, Feeling, Fido, Fleming, Fluff, Food, Ford, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Korea, Kukulkan, Lamarr, Lane, Language, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malverns, Manchester, Mandy, Mangano, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murray, Musical, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ranjit, Rashmi, Raukani, Really, Red, Reihenfolge, Renato, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rose, Rosey, Rosie, Roundstone, Royal, Ruby, Russell, Ryan, Sacks, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Shelter, Sherlock, Shrek, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Sylvester, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wise, Work, World, Wortes, Would, Wow, Wu, Wyoming, Yeah, Yellowstone, York, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 3 SB Unit 9.txt -----
Unit 9 My world
Pages 74–75
At the end of unit 9 …
 you know
 ☑ 16 words and phrases for teen activities
 ☑ how to use be allowed to and let
you can
 ☑ understand a text about the world of different teenagers
 ☑ understand a text about the Amish
 ☑ understand an interview with two Amish teenagers
 ☑ talk about permission and take part in a group discussion
 ☑ write a short report
 ☑ understand and write messages in a group chat
1 Read the texts quickly. How do Amy and Sean help their local communities?
A helping hand
 Teenagers trying to make a difference
I'm Amy. I'm 13 and I live near Adelaide, which is the capital of South Australia. My parents run a small farm with a difference. It’s a farm for children. They can come with their families or with their school and see what life on an animal farm is like.
 They’re allowed to hold and feed the animals – and it’s all very safe. My parents look after everything.
We let children milk a cow or bottle-feed baby lambs or hold baby chicks. But they aren’t allowed to do these activities without help from someone on the farm. I often help out, but I also spend a lot of my free time on another project: the Murray River.
Adelaide is one of the driest areas in the world so everybody needs a lot of water. Most of that water comes from the Murray River. The farmers want water for their fields, the people want water for their homes, the government wants water for the dams* to produce electricity. The problem is, there is less and less water in the river each year.
So I’ve organised a group to make people aware of this problem. We have a list of rules we want the politicians to make:
 • Don’t let farmers take out so much water from the river.
 • People aren’t allowed to take long showers.
 • People aren’t allowed to waste electricity.
One of the things we do is to take young children to see the river, so they can learn how important it is to protect it.
VOCABULARY: dam = Damm
I'm Sean. I’m 14 and I live in Roundstone. Roundstone is a small village in the west of Ireland and we get lots of tourists because it’s very beautiful. I live there with my mum and my dad and two brothers and one sister. My dad runs a ceramics shop, and many tourists buy presents there. Dad lets us help in the shop sometimes.
And Mum sometimes works for film companies, because Roundstone is a great place for filming nature scenes. It’s a pity we’re never allowed to hang around the film sets. Mum doesn’t let us do that. She’s very strict about it.
My brothers and I are often busy with other things anyway. We help our tourist office by taking tourists on tours of the village and the countryside around it.
 We aren’t allowed to charge money for it, but sometimes tourists give us a tip or buy us an ice cream.
The other thing we do is help the older people of the village. When you’re 75 in Ireland, you have to take a regular driving test every three years, and not everybody passes. Those who aren’t allowed to drive their cars any longer still need food and stuff from the shops, so we ride our bikes to a town called Clifden, which has got more shops, and get the things they need for them.
2 Read the texts again. How many of these tasks can you do?
1 Amy’s parents’ farm only has sheep. T / F
 2 At the farm, kids are always allowed to milk cows. T / F
 3 Adelaide is a very dry area. T / F
 4 The problem with the Murray River is .................................................................
 5 Amy takes children to the river so .................................................................
 6 Sean lives in Roundstone with .................................................................
 7 What are Sean and his brothers and his sister not allowed to do? .................................................................
 8 How do they help tourists? .................................................................
 9 Why do they help old people with shopping? .................................................................
3 Check your answers with a partner. Then listen to the texts.
4 Get together in groups of three or four. Think of three questions you would like to ask Amy and Sean.
Pages 76–77
5 Read the text about the Amish. Where do the biggest groups live?
The Old Order Amish
The Amish are a group of Christian people that ___________________ to 1693. There are many different groups, but the ___________________ community is the Old Order Amish.
 In 2022, there were over 370,000 Old Order Amish in the United States.
 They ___________________ separate from non-Amish people who they call “the English”.
The Amish are known for simple living, plain dress, pacifism and for being slow to adopt modern ___________________.
What is most important for the Amish are the ___________________ of the Church (often called ‘Ordnung’) and family life.
The largest groups live in Pennsylvania, Indiana, and Ohio.
 The most conservative Amish groups don’t allow the use of machines such as ___________________. They believe in hard work using only your hands.
 Of course, there are also groups of Amish people that are not so strict.
6 Read again and fill in the missing words from the box.
keep tractors strongest technology go back rules
LISTENING
7 Listen to the interviews and circle T (True) or F (False).
1 Linda is happy with her life. T / F
 2 Linda doesn’t use a mobile phone very often. T / F
 3 The families in her church group often pray together. T / F
 4 At the time of ‘rumspringa’ you’re allowed to be a bit wild. T / F
 5 Linda met her future husband during ‘rumspringa’. T / F
 6 Jacob likes very big cities. T / F
 7 Jacob followed all the rules during ‘rumspringa’. T / F
 8 Jacob’s family doesn’t use electricity. T / F
 9 Jacob never wants to see his family any more. T / F
 10 Jacob likes a quiet life best. T / F
VOCABULARY Teen activities
8 Look, read and match.
(Images 1–16 depict various teen activities such as shopping, roller-skating, partying, and using smartphones. Each number matches with one of the activities in the list below.)
☐ dye your hair (purple)
 ☐ get a tattoo
 ☐ go roller-skating without pads
 ☐ buy your own clothes
 ☐ have a party at home
 ☐ scroll through your phone
 ☐ go to the disco
 ☐ ride your bike without a helmet
 ☐ come home after ten at the weekend
 ☐ turn your music up really loud
 ☐ eat too many sweets
 ☐ get a nose stud
 ☐ play video games all day
 ☐ watch TV after 10 o’clock
 ☐ wear earrings
 ☐ hang out in shopping centres
Pages 78–79
9 Read the dialogues. Then act them out.
DIALOGUE 1
 A Are you allowed to stay up late and watch TV?
 B It depends.
 A What do you mean?
 B Well, I can stay up, but only on Saturdays.
 A Really? Until when?
 B Until eleven. What about you?
 A When there’s a good film on, my parents let me watch it.
 B Even if it’s a late-night film?
 A Well, if it’s a really good film ... yes!
DIALOGUE 2
 A That’s a beautiful tattoo.
 B Yeah, do you like it?
 A Yes, I do. I’m not allowed to have one. Did it hurt?
 B No, it didn’t hurt at all. It’s fake!
 A Really? Where did you get it? I think I’m going to get one too.
 To scare my mum.
10 Work in pairs. Use the prompts to make short conversations.
🗨️ A Are you allowed to ...?
 🗨️ B Yes, but I’m not allowed to ...
🗨️ A Do your parents let you ...?
 🗨️ B Yes, but they don’t let me ...
✅ go to parties
 ❌ come home very late
✅ invite friends over
 ❌ make a lot of noise
✅ surf the internet
 ❌ use your phone in bed
✅ buy your own clothes
 ❌ dye my hair
✅ go to fast food restaurants
 ❌ eat fast food every day
11 Work in groups. Look at the pictures in 8. Choose three questions. Ask your partners.
(Image shows a group of students talking around a table. Speech bubbles say:
 "Are you allowed to have parties at home?"
 "No, my mum doesn’t allow parties in our flat."
 "It’s OK with my parents, but we aren’t allowed to have the music too loud."
 "We have a garden. I can have parties there.")
A Are you allowed to get a nose stud?
 B No way!
 C Really? Why’s that?
 B My parents hate them! They’ve already said no!
 A Well, I think my parents might let me, but I don’t want to have a stud anyway.
 C Why not?
 A I don’t think studs look cool. What about you?
 C I’m not sure really. My older sister has a nose stud and I think it looks nice, but I don’t want one for myself.
12 Write a group report and read it out to the class.
In our group, one student isn’t allowed to have a nose stud. His parents hate them. One student thinks her parents might allow it, but she doesn’t think studs look cool and so she doesn’t want to have one. Another student doesn’t know if he wants to have a stud or not.
Pages 80–81
13 Read the thread from a group chat.
 Draw the emojis in the spaces.
(Image of a phone screen showing a group chat named “Chat group online”)
Robbie
 Have you heard the news? They aren’t allowing kids in the park after 8 p.m. any more.
Ronja
 What! They can’t do that!
Celina
 😮
Robbie
 The mayor says young people are causing too much trouble there. There was some trouble there last weekend. A group of teenagers were having a party and making a lot of noise, and when some people asked them to stop, they were rude. And then somebody called the police. And when they finally left the park, there was loads of rubbish all over the place.
Conny
 It’s unbelievable. Just because of the behaviour of some kids, none of us are allowed to go there any more. The problem is people are too quick to judge teenagers. I think some people want to believe we’re all the same. They forget there were kids once too!
Celina
 The problem is that those kids who were making trouble will just go and find a new place to do it. They’ll probably start hanging out in the town centre instead.
Robbie
 So what should we do? Any ideas?
Ronja
 I think we should all write to the mayor and let him know what we think of his plans. Let’s send him 100 emails a day!!!
Conny
 😠 Good idea!
Robbie
 No, he’ll just say we’re troublemakers and that’s exactly why he’s closing the park. We need to do something that shows him that we aren’t all the same and that most teenagers are responsible and can be trusted. How about we organise a litter-picking day? We can all meet at the park and clear up all the rubbish.
Ronja
 Yeah – and then we can leave all the bags of rubbish outside of his house. That’s a great idea! I love it!
Celina
 I like it, but maybe not the bit about leaving the rubbish outside the mayor’s house. Hope you were joking, Ronja.
Ronja
 🙂
Robbie
 Brilliant. How about this Saturday? Let’s meet in the park at 9 a.m. My dad’s got a friend who’s a journalist at the local paper. I’ll see if he can come along and do an article on us – something positive about young people for a change.
Celina
 Can’t make it until 10, but I’ll be there.
Ronja
 👍
Conny
 See you there!
14 Imagine you are part of the group chat. Write three entries for the discussion. Write an * in the thread above to show where they go.
15 Listen and repeat. Pay attention to the weak sound of the underlined parts.
1 We aren’t allowed to play in the street.
 2 I’m not allowed to get a tattoo.
 3 My brother and sister aren’t allowed to go out.
 4 We can’t watch television after eleven.
 5 We’re leaving to go and live in another town.
16
 A You have been asked to hand in a short report on what you are (not) allowed to do at school. Write a text of 60–80 words. In your text, write down:
three things that you are not allowed to do
two things you are allowed to do
one sentence about what you think of the rules
B Read the beginning of a chat thread and write five more responses. Consider the following:
Each reply should be short (max. 60 words).
Each reply should refer to the one before it.
One of the replies can be an emoji.
Have you heard the news? The headmaster says we aren’t allowed to take our phones into school as from Monday!!! 😡📵
GRAMMAR
 be allowed to / let
You use be (not) allowed to to say someone has or doesn’t have permission to do something.
I’m not allowed to go out when it’s dark – my parents say it’s too dangerous.
 We aren’t allowed to play ballgames there.
 Are you allowed to have parties at home?
🔍 Match:
 1 You use be allowed to to say □
 2 You use be not allowed to to say □
a you don’t have permission to do something.
 b you have permission to do something.
How to form it: person + be (not) + allowed to + verb
You use (not) let to say that someone gives or doesn’t give permission to do something.
When there’s a good film on, my parents let me watch it.
 I think my parents might let me have a stud anyway.
Negation:
My parents don’t let me dye my hair.
 They don’t let me eat fast food every day.
Pages 82–83
1 Watch or listen to the dialogue. Then read it.
 What is the final thing that Kate offers to do?
Kate So, why did you want to see me, Tom?
 What’s up? You look worried.
 Tom I am. Mum’s just told me.
 Kate Told you what?
 Tom We’ve got a visitor next week. And I’ve got to look after her.
 Kate So? What’s the problem?
 Tom Did you hear what I said. Her – I’ve got to look after her. It’s a girl. Bianca!
 Kate Oh don’t be so silly. Who is she anyway?
 Tom Remember I told you my mum lived in Brazil for a few years when she was younger. Well, she’s the daughter of one of my mum’s Brazilian friends.
 Kate Would you like me to help you?
 Tom Would you? That would be great.
 Kate So what are you so worried about?
 Tom Well, she’s from a hot country. She’ll freeze over here.
 Kate I’m sure she’s thought of that, Tom. But, if not, then I could lend her some of my clothes if you like.
 Tom What if they don’t fit?
 Kate Tom!
 Tom Sorry. That would really help. But another thing. What if her English isn’t very good? How am I going to talk to her?
 Kate I’m sure her English will be fine. But, listen. Why don’t I talk to Laura from school. She’s from Portugal.
 Tom Really? Thanks, Kate. That’s a great idea.
 Kate It’s no trouble. I’m sure you’ll have a great time.
 Tom Yeah, but the worst thing is she’s going to stay in my bedroom. That means I’ve got to sleep on the sofa.
 Kate Do you want me to ask my parents if she can stay with us? She could sleep in my room with me.
 Tom Kate, what would I do without you?
2 Complete the sentences.
Tom is worried because …
Their visitor is from …
Tom’s worried she’ll think the UK is …
Kate says she can borrow …
Tom is also worried he won’t be able …
Kate reminds him that Laura …
Tom is worried because he has to …
Kate is going to talk with …
3 Complete with the verbs in the box.
 ask help talk lend
Kate Would you like me to 1. ………………… you?
 Kate I could 2. ………………… her some of my clothes if you like.
 Kate Why don’t I 3. ………………… to Laura from school.
 Kate Do you want me to 4. ………………… my parents if she can stay with us?
What do you think? Answer the questions.
How will Kate and Bianca get on?
Will the visit be a success?
Watch part 2 of the video and complete Kate’s diary entry.
 TO DO:
Go to book shop and buy a 1. ............................................................
 → Done – Pick up on 2. ............................................................
Sort clothes out for Bianca – 3. ............................................................ and ............................................................
Get Brazilian snacks from shop in 4. ............................................................
UPDATE:
 Don’t believe it! Bianca is 5. ............................................................ because “ ............................................................ ”
4 Complete the sentences. Then check with the dialogue in 1.
Kate Would you like me to help you?
  Tom W……………… y……………… ? That would be great.
Kate I could lend her some of my clothes.
  Tom T……………… . W……………… b……………… . I d……………… w……………… a……………… .
Kate Why don’t I talk to Laura from school. She’s from Portugal.
  Tom R……………… ? T……………… , Kate.
Kate Do you want me to ask my parents if she can stay with us?
  Tom Kate, w……………… w……………… I d……………… w……………… y……………… ?
5 ROLE PLAY: Work in pairs. Look at your role cards. Take 4–5 minutes to practise your dialogue. Don’t write it down. Act it out for the rest of the class.
Student A
 You are going to spend a month with your Spanish penfriend next week. Make a list of all your worries and of all the things you still need to do before you go. Tell your partner about these things.
Student B
 Listen to your partner’s worries. Offer to help.


----- WB: More 3 WB Unit 9.txt -----
UNIT 9 My world
Page 74–75
UNDERSTANDING VOCABULARY Teen activities
 1 Find 13 activities in the word snake.
dyeyourhairgetatattoogorollerskatingwithoutpads
 uyourclotheshangout
 uyourhomeworksendtextmessages
 endturnyour
 mweekendthe
 atterhome
 omehomea
 rgotothedisco
 urphone
 tooclockeattoomanysweets
USING VOCABULARY Teen activities
 2 Look at the picture. Which of the activities in 1 are these people doing?
They’re having a party at home.
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
[Image description: A cartoon-style picture shows a group of teenagers at home. There are colorful party decorations like bunting, a speaker playing music, snacks on the table, one boy dancing, one girl sitting with a mobile phone, and another girl preparing drinks in the background. It’s a casual teen party scene.]
3 Complete the text with the words from the box.
earrings tattoo bike stud video games dyed computer hang out music
Arguments with parents
 Last week, I had a lot of arguments with my parents. After getting a small
 1 _______________ a month ago, I now wanted a nose 2 _______________ . “No way,” Dad said. “You’ve already got these weird 3 _______________ and you’ve already
 4 _______________ your hair. That’s enough!” So I decided to talk to Mum.
Later, when Mum came into my room, she asked me to turn off the 5 _______________ .
 “You play 6 _______________ all day, or you play loud 7 _______________ all day. Why don’t you get out of the house for a while?”
“OK,” I said and rode my 8 _______________ to the shopping centre. There I could
 9 _______________ with my friends in peace.
UNDERSTANDING GRAMMAR be allowed to / let
 4 Match the signs and the sentences.
[Image description: Six circular red signs with diagonal red lines across them, indicating prohibition.]
 1 – camera with flash
 2 – parked car
 3 – person swimming
 4 – hat
 5 – burger
 6 – person walking on grass
A You aren’t allowed to park here.
 B You aren’t allowed to swim here.
 C You aren’t allowed to walk on the grass.
 D You aren’t allowed to go in here.
 E You aren’t allowed to eat food in here.
 F You aren’t allowed to take photographs.
5 Draw two signs for your bedroom door and write a sentence under each one to explain what they mean.
1
 ……………………………………………………………………
 2
 ……………………………………………………………………
6 Match the questions and answers.
1 Are you allowed to invite your friends over?
 2 Do your parents let you come home late?
 3 Are you allowed to get your hair dyed?
 4 Are you allowed to get a tattoo?
 5 Do your parents let you surf the internet?
 6 Are you allowed to have a pet at home?
 7 Do your parents let you have parties at home?
 8 Does your mum let you drive her car?
☐ Maybe if I choose a nice colour.
 ☐ Yes, but I’m not allowed to go into chat rooms.
 ☐ No, because my dad hates animals.
 ☐ Yes, but I have to be back by 9 p.m. on weeknights.
 ☐ Yes, but we aren’t allowed to make too much noise.
 ☐ No. My dad would kill me.
 ☐ Of course she doesn’t. I’m only 12.
 ☐ Yes, they do if I promise to tidy up after.
Page 76–77
USING GRAMMAR be allowed to / let
7 Look at the sentences in 6 again. Write your own answers to the questions.
 1 ...............................................................................................................
 2 ...............................................................................................................
 3 ...............................................................................................................
 4 ...............................................................................................................
 5 ...............................................................................................................
 6 ...............................................................................................................
 7 ...............................................................................................................
 8 ...............................................................................................................
8 Fill in the correct forms of be allowed to.
“On the school trip, you 1 ____________________________ (not allow) to stay up later than 10 o’clock,” our teacher said. “And you 2 ____________________________ (not allow) to get together in one room and make a lot of noise.” That was before the trip, but during the trip it was even worse.
 We 3 ____________________________ (not allow) to use our mobile phones for games and we
 4 ____________________________ (not allow) to listen to music during meals. “Is there anything we 5 ____________________________ (allow) to do?” I asked the teacher. “I’ll think about it,” he said. “Ask me again next week.” I think teachers like him shouldn’t 6 ____________________________ (allow) to go on school trips.
9 Write sentences using the correct form of be (not) allowed to.
 1 James ✔ watch TV / ✘ not watch TV after 10 o’clock.
 James is allowed to watch TV, but he isn’t allowed to watch TV after 10 o’clock.
2 Sarah ✔ go to bed late / ✘ not get up late.
 ...............................................................................................................
3 We ✔ wear jeans to school / ✘ not wear shorts.
 ...............................................................................................................
4 They ✔ listen to music / ✘ not listen without headphones.
 ...............................................................................................................
5 I ✔ go to my friend’s house / ✘ not stay for the night.
 ...............................................................................................................
6 She ✔ have parties at home / ✘ not play loud music.
 ...............................................................................................................
10 Rewrite the sentences in 9 using let.
 1 James’ parents let him watch TV, but they don’t let him watch it after 10 o’clock.
 2 Sarah’s dad ............................................................................................
 3 The headmaster .....................................................................................
 4 Mum ........................................................................................................
 5 Dad ..........................................................................................................
 6 Her parents ............................................................................................
DIALOGUE WORK Talking about permission
 11 CHOICES
 A Complete the dialogue with the sentences from the box. There are two extra sentences.
 Then listen and check.
a Like what?
 b And are you allowed to spend as much money as you want to?
 c I never go shopping at the weekend.
 d So do you often spend your own money on clothes?
 e Unless what?
 f Are you allowed to buy your own clothes?
 g Me? I spend all my money on clothes.
 h I don’t have enough money.
Amy 1 Are you allowed to buy your own clothes?
 Fred Yes, of course.
 Amy 2 .........................................................................................
 Fred Of course not. Dad gives me some money, and I can’t spend more. Unless ...
 Amy 3 .........................................................................................
 Fred Unless I pay for it myself.
 Amy 4 .........................................................................................
 Fred Never. I’ve got better things to spend my money on.
 Amy 5 .........................................................................................
 Fred Video games, books, music. What about you?
 Amy 6 .........................................................................................
 Fred That’s why you always look so good.
[Image description: A smiling boy is trying on a jacket in a clothing store, with mirrors and hangers in the background. He holds a shopping bag and looks pleased.]
B Put the dialogue in the correct order. Then listen and check.
☐ Sandra Are you allowed to stay out late during the week?
 ☐ Sandra Yeah, I’m allowed to go out till 10 during the week.
 ☐ Sandra Well, say, 10 p.m.
 ☐ Sandra So what time do you have to be back at the weekends?
 ☐ Sandra Wow, it sounds like your parents are pretty strict.
 ☐ Sandra On Saturdays and Sundays I’m allowed out until midnight. What about you?
 ☐ Alison No, I’m not allowed out that late. Are you?
 ☐ Alison What do you mean by late?
 ☐ Alison 11. And Dad always picks me up.
 ☐ Alison And at the weekend?
 ☐ Alison I’m allowed out at the weekend, but not until midnight.
Page 78–79
READING Understanding a text about a teenager
 12 Read the text about a 15-year-old teenager from Wyoming.
MY BLOG
Welcome to JACKSON
Hi, I’m Lisa and I live in Jackson, Wyoming. Jackson is in a valley that is called Jackson Hole. The valley is about 88 km long, and there are a lot of beautiful mountains which are good for skiing.
Anyway, I live in Jackson with my parents and my brother Will. Will is a park ranger like my dad, and they both work in Yellowstone National Park. The entrance to the park is a 45-minute drive away, and Dad and Will often stay there for two or three days because they don’t want to drive too much. They stay at a cabin, and sometimes I’m allowed to go with them.
I really enjoy Yellowstone. There’s so much to do and so much to see. For example, there is the Yellowstone River, which is really impressive. Unfortunately, we don’t often go there because it’s a three-hour drive to a good spot on the river.
When Dad and Will take me to the park, I spend my time watching animals. There’s a large number of birds, and I’ve become quite an expert on them.
But there are also a lot of large animals, like mountain lions, wolves, black bears, grizzly bears – and bison. Many people believe it’s dangerous to meet bears, but they are usually not interested in contact with people. Actually, bison are more dangerous. If they want to protect their young, they will attack you. And they can run pretty fast!
Dad and Will drive around the park and check on the wildlife. But they also check on the people who visit. For example, they make very loud noises outside. Bears hear them and run off. Sometimes tourists come when looking for food. This can be quite dangerous. If people follow the animals, they can come too close.
What else can I tell you about my life here? Well, I still go to school and much of my time I help Mum – or she’s a “mum’s chick” learner, I’m no longer fine. I go skateboarding with my friends. People around me often ski. In winter, we also go skiing and snowboarding. Jackson is a great place to do that. I wouldn’t want to live anywhere else.
VOCABULARY: run – hier: leiten
[Image descriptions:
A photo of a teenage girl with a cap sitting on a skateboard smiling (Lisa).
A “Welcome to Jackson” sign.
Four small photos: A bison, a snow-covered mountain range, a bluebird perched on a fence, and a river in winter.]
13 How many of these tasks can you do?
1 Lisa lives in a valley.                    T / F
 2 Both her parents work as park rangers.             T / F
 3 Her dad and her brother drive to Yellowstone Park every day.  T / F
Complete with no more than 4 words.
 4 They don’t often go to the Yellowstone River because it’s .................................................. .
 5 Bears are usually too .................................................. .
 6 Bison can run .................................................. .
Answer the questions in one sentence.
 7 What is the problem with some tourists?
 ....................................................................................................................
 8 What does Lisa help her mum with?
 ....................................................................................................................
 9 What does she do in her free time?
 ....................................................................................................................
14 Listen and check your answers.
LISTENING
 15 a Listen and write the countries under the photos.
[Image descriptions:
A boy with short hair and a green shirt says: Hi, I’m José and I’m from ________.
A boy with a surfboard in the background says: Hey. My name’s Renato and I’m from ________.
A girl in red with mountains behind her says: My name’s Agripina and I’m from ________.
A girl with dark hair in the forest says: My name’s Raukani and I’m from ________.]
b Write Raukani, Renato, Agripina or José.
1 Who doesn’t go to school? .............................................................
 2 Who lives at a high altitude? .............................................................
 3 Who helps his father grow things to eat? .............................................................
 4 Who likes water sports? .............................................................
 5 Who travels by water? .............................................................
 6 Who gets angry about pollution? .............................................................
 7 Who doesn’t live with his/her sister? .............................................................
 8 Who looks after animals? .............................................................
VOCABULARY: pollution – Umweltverschmutzung
Page 80–81
16
 A Listen again. Write a short report about one of the kids in 15.
 .........................................................................................................................................................
 .........................................................................................................................................................
 .........................................................................................................................................................
B Work in pairs. Ask your partner questions about his/her life using the interviews as a model. Then write a short report about your partner.
 .........................................................................................................................................................
 .........................................................................................................................................................
 .........................................................................................................................................................
17 Put the words in order to make offers.
 1 some / I / lend / could / you / .
 2 I / brother / his / ask / my / Why / to / don’t / you / lend / .
 3 you / like / Would / you / me / with / to / come / ?
 4 want / you / here / me / have / you / can / to / ask / my / Do / mum / if / it / ?
18 Write the offers from 17 into the correct mini-dialogues.
1 Fred: I want to get a nose stud, but I’m a bit afraid.
   Donna: .................................................................................................................
   Fred: Would you? I’d feel much braver.
2 Jack: I want to go roller-skating, but I can’t find my pads.
   Lana: .................................................................................................................
   Jack: Really? That’s so kind of you.
3 May: Mum won’t let me have a birthday party at home.
   James: .................................................................................................................
   May: That would be really nice. Thank you.
4 Liz: Mum said I can buy my own clothes for the party, but she didn’t give me any money.
   Andy: .................................................................................................................
   Liz: Really? What would I do without you?
19 Listen and check.
20 Read the task and what a student wrote. When can Martin meet?
Task
 Your friend David asked you to get together with a few others for a maths study group. You send him an email (60–80 words) about the idea.
 In your email:
 ✔ say when you have time
 ✔ say where you could meet
 ✔ offer to organise a few things
Email:
FROM: martin_h@mailconnect.com
 SUBJECT: Maths study group
Hi David,
 About that study group for maths: I could meet tomorrow afternoon with you all. Why don’t we use one of the empty classrooms? Would you like me to bring the books or will you? And do you want me to check out if it’s OK to use a classroom? Looking forward to our first meeting.
 See you,
 Martin
Useful Language: Making offers
 • I could …
 • Why don’t I … ?
 • Let me …
 • If you want me to …, I can …
 • It’s no problem for me to …
 • Can I get you … ?
21 Now write your own answer to the following task.
Task
 Your friend Carla asked you to help her with moving her things to her new flat. Write her an email (60–80 words).
 In your email:
 ✔ say when you have time
 ✔ say who else you/she could ask for help
 ✔ offer to organise a few things
.........................................................................................................................................................
 .........................................................................................................................................................
 .........................................................................................................................................................
 .........................................................................................................................................................
Page 82
UNIT 9
WORD FILE
 Teen activities
to dye your hair
 to get a tattoo
 to hang out in shopping centres
 to go roller-skating without pads
 to get a nose stud
 to scroll through your phone
 to have a party at home
 to buy your own clothes
 to eat too many sweets
 to wear earrings
 to ride your bike without a helmet
 to come home after ten
 to turn your music up loud
 to go to the disco
 to play video games all day
 to watch TV after 10 o’clock
MORE Words and Phrases
#	Phrase/Word	Example Sentence	German Translation
1	to be allowed to do sth.	They are allowed to hold and feed the animals.	etw. tun dürfen
	It's a pity.		Das ist schade.
	strict	Mum’s very strict about that.	streng
5	to adopt	The Amish are known for being slow to adopt modern technology.	hier: annehmen
	community	There are many different groups, but the strongest community is the Old Order Amish.	Gemeinschaft, Gemeinde
	conservative	The most conservative Amish groups don’t allow the use of machines.	konservativ
	modern technology	Most Amish groups don’t use modern technology.	moderne Technologie
7	plenty	We’re a church group of 35 families, and we’ve got plenty to do.	reichlich
	to pray	We often get together and pray.	beten
	to punish	You can go to parties and your parents don’t punish you for it.	bestrafen
9	It depends.		Es kommt darauf an.
	to stay up	Well, I can stay up, but only on Saturdays.	aufbleiben
10	to invite sb. over	Are you allowed to invite friends over?	jdn. zu sich einladen
13	for a change	I’ll write something positive about young people for a change.	zur Abwechslung
	journalist	My dad’s friend works as a journalist at the local paper.	Journalist/Journalistin
	litter-picking	How about we organise a litter-picking day?	Müllsammeln
	rude	When some people asked them to stop, they were rude.	unhöflich, unverschämt
	unbelievable	They left their rubbish all over the place. It’s unbelievable.	unglaublich
	to freeze	She’s from a hot country. She’ll freeze over here.	(er-)frieren
	to lend	I could lend her some of my clothes if you like.	(ver-)leihen
	Never mind!		Egal!, Schon gut!
	to remind sb.	Kate reminds him that Laura is from Portugal.	jdn. erinnern
	to sort out	I’m going to sort out my clothes for Bianca.	aussortieren

Image Description:
 A teenage girl with red headphones is sitting cross-legged in a blue chair, smiling and looking at her phone. She wears a blue T-shirt and black trousers. Around her, yellow and orange speech bubbles display the vocabulary phrases from the “Teen activities” section.

```

## Output contract

Write `content/corpus/units/g3-u09/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g3-u09",
  "briefBank": "d66ad0eea339",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g3u09.s.be-allowed-to",
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
