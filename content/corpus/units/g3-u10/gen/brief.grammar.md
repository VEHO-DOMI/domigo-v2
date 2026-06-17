# Grammar generation brief — g3-u10 (MORE! 3, Unit 10)

<!-- domigo:gen grammar g3-u10 bank=fa1519f49700 prompt=4b9164076103 -->

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

### `g3u10.s.be-allowed-to-tenses` — Permission in the past, future and present perfect (was/will be/has been allowed to) (Erlaubnis in Vergangenheit, Zukunft und Present perfect (was/will be/has been allowed to))

Extending be allowed to across the tenses for permission: was/were (not) allowed to for the past, will (not) be allowed to for the future, and have/has (not) been allowed to for the present perfect. Taught alongside past ability in the unit-10 box.

v1 floor for this structure: **22 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [past-permission]: Use was/were (not) allowed to + base verb for permission or a ban that existed in the past.
  - DE: Du verwendest was/were (not) allowed to + Grundform für eine Erlaubnis oder ein Verbot, das in der Vergangenheit galt.
  - "From 1897 onward, women were allowed to attend university." — "Ab 1897 durften Frauen die Universität besuchen."
  - "They weren't allowed to study all subjects." — "Sie durften nicht alle Fächer studieren."
- rule [future-permission]: Use will (not) be allowed to + base verb for permission or a ban in the future.
  - DE: Du verwendest will (not) be allowed to + Grundform für eine Erlaubnis oder ein Verbot in der Zukunft.
  - "They won't be allowed to have a supermarket there." — "Sie werden dort keinen Supermarkt haben dürfen."
  - "We won't be allowed to play football there any longer." — "Wir werden dort nicht mehr Fußball spielen dürfen."
- rule [present-perfect-permission]: Use have/has (not) been allowed to + base verb for permission with present relevance.
  - DE: Du verwendest have/has (not) been allowed to + Grundform für eine Erlaubnis mit Gegenwartsbezug.
  - "Even in Austria, women haven't always been allowed to do what men have." — "Sogar in Österreich durften Frauen nicht immer das tun, was Männer durften."

common errors:
- Omitting was/were from the past permission structure: ✗ "They allowed to go home early." → ✓ "They were allowed to go home early."
- Dropping be from will be allowed to: ✗ "We will allowed to stay out later." → ✓ "We will be allowed to stay out later."
- Wrong was/were agreement with a plural subject: ✗ "They was allowed to leave." → ✓ "They were allowed to leave."

SB box `g3/sb/More 3 SB Unit 10.txt#grammar-1` — Past ability and permission: could, was/were able to and was/were allowed to:
```
🔍 Read the examples. Complete the rules. Write could/couldn’t or was(n’t)/were(n’t) able to.
They couldn’t take the exam at their school.
 Finally, African-Americans could sit on a bus, the same as white people.
 We were able to stop them this time.
 They weren’t able to get their jobs back.
You use ‘………………’ to say that something was generally (not) possible or allowed in the past.
 You use ‘………………’ to say that someone didn’t have the ability to do something at a certain time in the past.
Was(n’t)/were(n’t) allowed to means someone didn’t have the permission to do something in the past.
 From 1897 onward, women were allowed to attend university, but they weren’t allowed to study all subjects.
Future and present perfect ability and permission
 They won’t be allowed to have a supermarket there.
 Even in Austria, women haven’t always been allowed to do what men have.
 My older brother will be able to print 1,500 leaflets for us.
 We won’t be allowed to play football there any longer.
 I still think we’ll be able to stop the project.
 We haven’t been able to discuss everything in detail yet.
How to form it:
 Future – will (won’t) be able to + base form of the verb
 Present perfect – have(n’t)/has(n’t) been able to + base form of the verb
(Image: A comic-style illustration of a red flying machine with angry passengers protesting. Caption: “We’ll be able to stop them next time.”)
🔁 Now go back to page 84. ✅ Tick with a partner what you know / can do.
▶ OUR YOUNG WORLD 5
 Ruby’s school spending dilemma
📺
 1 Watch the video. What did the school spend the money on?
 …………………………………………………………………………………………
2 Watch again and answer the questions.
 1 Who gave the money to the school? ............................................................
 2 Who did he say should be involved in the decision on spending it? ............
 3 How did the kids want to spend the money? ..............................................
 4 How did the parents want to spend the money? .........................................
 5 How did the teachers want to spend the money? .......................................
 6 Who made the final decision? .....................................................................
```

v1 seed items (UNTRUSTED):
- `m3-u10-past-permission-tf-003` [gap-fill, d5]: p="You're excited about turning 18. Tell your friend what will change: 'When I'm 18, I ________ (be allowed to) drive a car!'" c="will be allowed to" a=["will be allowed to","'ll be allowed to"] ds=["are allowed to","were allowed to","would be allowed to"]
- `m3-u10-past-permission-qf-001` [question-formation, d4]: p="Form a question: 'She was allowed to go to the concert.' → Ask a yes/no question." c="Was she allowed to go to the concert?" a=["Was she allowed to go to the concert?","Was she allowed to go to the concert"] ds=[]
- `m3-u10-past-permission-gf-020` [gap-fill, d1]: p="When I was little, I ___ (not allowed to / stay) up late." c="wasn't allowed to stay" a=["wasn't allowed to stay","was not allowed to stay"] ds=["weren't allowed to stay","didn't allowed to stay","wasn't allow to stay"]
- `m3-u10-past-permission-gf-021` [gap-fill, d1]: p="We ___ (allowed to / use) our phones in class last year." c="were allowed to use" a=["were allowed to use"] ds=["was allowed to use","are allowed to use","allowed to use"]
- `m3-u10-past-permission-gf-022` [gap-fill, d2]: p="Next year, students ___ (be allowed to / choose) their own topics." c="will be allowed to choose" a=["will be allowed to choose"] ds=["will allowed to choose","will be allow to choose","are allowed to choose"]
- `m3-u10-past-permission-gf-023` [gap-fill, d3]: p="She ___ (not allowed to / go) to the party because she was too young." c="wasn't allowed to go" a=["wasn't allowed to go","was not allowed to go"] ds=["weren't allowed to go","isn't allowed to go","didn't allowed to go"]
- `m3-u10-past-permission-gf-024` [gap-fill, d4]: p="In the old school, they ___ (not allowed to / wear) trainers, but in the new school they ___ (be allowed to / wear) whatever shoes they like." c="weren't allowed to wear ... will be allowed to wear" a=["weren't allowed to wear ... will be allowed to wear","were not allowed to wear ... will be allowed to wear"] ds=["wasn't allowed to wear ... will be allowed to wear","weren't allowed to wear ... are allowed to wear","didn't allowed to wear ... will allowed to wear"]
- `m3-u10-past-permission-gf-025` [gap-fill, d5]: p="___ you ___ (allowed to / bring) pets to school when you were in primary school?" c="Were ... allowed to bring" a=["Were ... allowed to bring","Were you allowed to bring"] ds=["Was ... allowed to bring","Did ... allowed to bring","Are ... allowed to bring"]
- `m3-u10-past-permission-mc-020` [multiple-choice, d2]: p="Which sentence correctly expresses that Tom had permission to leave early yesterday?" c="Tom was allowed to leave early yesterday." a=["Tom was allowed to leave early yesterday."] ds=["Tom were allowed to leave early yesterday.","Tom allowed to leave early yesterday.","Tom did allowed to leave early yesterday."]
- `m3-u10-past-permission-mc-021` [multiple-choice, d3]: p="Choose the correct sentence about future permission." c="We will be allowed to stay up late on New Year's Eve." a=["We will be allowed to stay up late on New Year's Eve."] ds=["We will allowed to stay up late on New Year's Eve.","We will be allow to stay up late on New Year's Eve.","We are allowed to stay up late on New Year's Eve."]
- `m3-u10-past-permission-mc-022` [multiple-choice, d4]: p="Which sentence correctly shows that the children did NOT have permission to swim in the lake?" c="The children weren't allowed to swim in the lake." a=["The children weren't allowed to swim in the lake."] ds=["The children wasn't allowed to swim in the lake.","The children didn't allowed to swim in the lake.","The children weren't allowed swimming in the lake."]
- `m3-u10-past-permission-ec-020` [error-correction, d2]: p="Find and fix the mistake: We was allowed to leave school early on Friday." c="were allowed" a=["were allowed","We were allowed to leave school early on Friday.","We were allowed to leave school early on Friday"] ds=[]
- `m3-u10-past-permission-ec-021` [error-correction, d3]: p="Find and fix the mistake: He didn't allowed to eat sweets before dinner." c="wasn't allowed" a=["wasn't allowed","was not allowed","He wasn't allowed to eat sweets before dinner.","He was not allowed to eat sweets before dinner."] ds=[]
- `m3-u10-past-permission-ec-022` [error-correction, d4]: p="Find and fix the mistake: Next summer, we will be allowed going camping on our own." c="allowed to go" a=["allowed to go","will be allowed to go","Next summer, we will be allowed to go camping on our own.","Next summer, we will be allowed to go camping on our own"] ds=[]
- `m3-u10-past-permission-tf-020` [transformation, d3]: p="Your teacher is explaining the old school rules. Rewrite using 'allowed to': 'Students could not run in the corridors.' → Students ___." c="weren't allowed to run in the corridors" a=["weren't allowed to run in the corridors","were not allowed to run in the corridors"] ds=[]
- `m3-u10-past-permission-tf-021` [transformation, d4]: p="A parent is talking about future changes at school. Rewrite: 'At the moment, children can't use the new playground. But from September, children ___.'" c="will be allowed to use the new playground" a=["will be allowed to use the new playground","will be allowed to use it"] ds=[]
- `m3-u10-past-permission-tr-020` [translation, d3]: p="Translate into English: 'Wir durften im Park Fußball spielen.'" c="We were allowed to play football in the park." a=["We were allowed to play football in the park.","We were allowed to play football in the park"] ds=[]
- `m3-u10-past-permission-tr-021` [translation, d4]: p="Translate into English: 'Er wird nächstes Jahr allein reisen dürfen.'" c="He will be allowed to travel alone next year." a=["He will be allowed to travel alone next year.","He will be allowed to travel on his own next year.","Next year, he will be allowed to travel alone."] ds=[]
- `m3-u10-past-permission-sb-020` [sentence-building, d2]: p="Put the words in order: allowed / wasn't / she / to / stay / out / late" c="She wasn't allowed to stay out late." a=["She wasn't allowed to stay out late.","She wasn't allowed to stay out late"] ds=[]
- `m3-u10-past-permission-sb-021` [sentence-building, d3]: p="Put the words in order: will / be / you / allowed / to / drive / when / you / are / 18" c="You will be allowed to drive when you are 18." a=["You will be allowed to drive when you are 18.","You will be allowed to drive when you are 18","When you are 18, you will be allowed to drive."] ds=[]
- `m3-u10-past-permission-mt-020` [matching, d3]: p="Match the sentence halves. 1: When I was five, I 2: Last summer, we 3: Next year, students 4: My little sister 5: In the future, everyone" c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"d\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"d\"}"] ds=["a: were allowed to camp by the river.","b: wasn't allowed to watch the scary film.","c: wasn't allowed to cross the street alone.","d: will be allowed to choose their own careers.","e: will be allowed to bring tablets to class."]
- `m3-u10-past-permission-cp-020` [context-picker, d2]: p="Your friend is talking about the rules at her old school. Which sentence fits?" c="We weren't allowed to eat in the classroom." a=["We weren't allowed to eat in the classroom."] ds=["We aren't allowed to eat in the classroom.","We won't be allowed to eat in the classroom.","We don't allowed to eat in the classroom."]

### `g3u10.s.could-was-able-to` — Past ability: could / was able to (Fähigkeit in der Vergangenheit: could / was able to)

Talking about ability in the past: could for general ability over a period of time, was/were able to for managing one particular thing on one occasion, and the be able to chain extended into the future (will be able to) and present perfect (have been able to) because can has no such forms.

v1 floor for this structure: **62 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [could-general]: Use could (or couldn't) for general ability in the past - things you were able to do over a period of time.
  - DE: Du verwendest could (oder couldn't) für allgemeine Fähigkeiten in der Vergangenheit - Dinge, die man über einen Zeitraum konnte.
  - "Finally, African-Americans could sit on a bus, the same as white people." — "Endlich durften Afroamerikaner im Bus sitzen, genau wie weiße Menschen."
  - "I could swim when I was five." — "Ich konnte schwimmen, als ich fünf war."
- rule [was-able-to-specific]: Use was/were able to for one specific achievement - something you managed to do on a particular occasion.
  - DE: Du verwendest was/were able to für eine bestimmte einmalige Leistung - etwas, das man bei einer bestimmten Gelegenheit geschafft hat.
  - "We were able to stop them this time." — "Wir konnten sie diesmal aufhalten."
  - "They weren't able to get their jobs back." — "Sie konnten ihre Jobs nicht zurückbekommen."
- rule [be-able-to-future-pp]: Because can has no future or perfect form, use be able to: will (won't) be able to + base verb for the future, and have(n't)/has(n't) been able to + base verb for the present perfect.
  - DE: Weil can keine Zukunfts- oder Perfektform hat, verwendest du be able to: will (won't) be able to + Grundform für die Zukunft und have(n't)/has(n't) been able to + Grundform für das Present perfect.
  - "My older brother will be able to print 1,500 leaflets for us." — "Mein älterer Bruder wird uns 1.500 Flugblätter drucken können."
  - "We haven't been able to discuss everything in detail yet." — "Wir konnten noch nicht alles im Detail besprechen."

common errors:
- Using could for one specific achievement (affirmative): ✗ "I could pass the exam yesterday." → ✓ "I was able to pass the exam yesterday."
- Dropping be from the be able to chain: ✗ "I will able to come tomorrow." → ✓ "I will be able to come tomorrow."
- Using will can instead of will be able to: ✗ "I will can come tomorrow." → ✓ "I will be able to come tomorrow."

SB box `g3/sb/More 3 SB Unit 10.txt#grammar-1` — Past ability and permission: could, was/were able to and was/were allowed to:
```
🔍 Read the examples. Complete the rules. Write could/couldn’t or was(n’t)/were(n’t) able to.
They couldn’t take the exam at their school.
 Finally, African-Americans could sit on a bus, the same as white people.
 We were able to stop them this time.
 They weren’t able to get their jobs back.
You use ‘………………’ to say that something was generally (not) possible or allowed in the past.
 You use ‘………………’ to say that someone didn’t have the ability to do something at a certain time in the past.
Was(n’t)/were(n’t) allowed to means someone didn’t have the permission to do something in the past.
 From 1897 onward, women were allowed to attend university, but they weren’t allowed to study all subjects.
Future and present perfect ability and permission
 They won’t be allowed to have a supermarket there.
 Even in Austria, women haven’t always been allowed to do what men have.
 My older brother will be able to print 1,500 leaflets for us.
 We won’t be allowed to play football there any longer.
 I still think we’ll be able to stop the project.
 We haven’t been able to discuss everything in detail yet.
How to form it:
 Future – will (won’t) be able to + base form of the verb
 Present perfect – have(n’t)/has(n’t) been able to + base form of the verb
(Image: A comic-style illustration of a red flying machine with angry passengers protesting. Caption: “We’ll be able to stop them next time.”)
🔁 Now go back to page 84. ✅ Tick with a partner what you know / can do.
▶ OUR YOUNG WORLD 5
 Ruby’s school spending dilemma
📺
 1 Watch the video. What did the school spend the money on?
 …………………………………………………………………………………………
2 Watch again and answer the questions.
 1 Who gave the money to the school? ............................................................
 2 Who did he say should be involved in the decision on spending it? ............
 3 How did the kids want to spend the money? ..............................................
 4 How did the parents want to spend the money? .........................................
 5 How did the teachers want to spend the money? .......................................
 6 Who made the final decision? .....................................................................
```

v1 seed items (UNTRUSTED):
- `m3-u10-could-was-able-to-gf-001` [gap-fill, d1]: p="I ___ swim when I was five years old." c="could" a=["could"] ds=["can","was able to","could to"]
- `m3-u10-could-was-able-to-gf-002` [gap-fill, d1]: p="She ___ ride a bike until she was eight." c="couldn't" a=["couldn't","could not"] ds=["can't","wasn't able","didn't could"]
- `m3-u10-could-was-able-to-gf-003` [gap-fill, d2]: p="After practising for weeks, she ___ finally pass the maths test." c="was able to" a=["was able to"] ds=["could","was able","can"]
- `m3-u10-could-was-able-to-gf-004` [gap-fill, d3]: p="My grandmother ___ speak three languages when she was young." c="could" a=["could"] ds=["was able to","can","could to"]
- `m3-u10-could-was-able-to-gf-005` [gap-fill, d4]: p="The fire was very dangerous, but the firefighters ___ rescue everyone." c="were able to" a=["were able to"] ds=["could","were able","could to"]
- `m3-u10-could-was-able-to-gf-006` [gap-fill, d5]: p="Next year, she ___ to join the school basketball team." c="will be able" a=["will be able"] ds=["will can","will able","could"]
- `m3-u10-could-was-able-to-mc-001` [multiple-choice, d3]: p="Which sentence is correct?" c="After running for two hours, he was able to finish the marathon." a=["After running for two hours, he was able to finish the marathon."] ds=["After running for two hours, he could finish the marathon.","After running for two hours, he was able finish the marathon.","After running for two hours, he could to finish the marathon."]
- `m3-u10-could-was-able-to-mc-002` [multiple-choice, d2]: p="Which sentence correctly expresses GENERAL past ability?" c="When I was a child, I could climb trees really well." a=["When I was a child, I could climb trees really well."] ds=["When I was a child, I was able to climb trees really well.","When I was a child, I can climb trees really well.","When I was a child, I could to climb trees really well."]
- `m3-u10-could-was-able-to-mc-003` [multiple-choice, d2]: p="Choose the correct option: She ___ to come to the party tomorrow." c="will be able" a=["will be able"] ds=["will can","could","will able"]
- `m3-u10-could-was-able-to-ec-001` [error-correction, d2]: p="Find and fix the mistake: I was able swim across the lake last summer." c="I was able to swim across the lake last summer." a=["I was able to swim across the lake last summer.","I was able to swim across the lake last summer","was able to swim"] ds=[]
- `m3-u10-could-was-able-to-ec-002` [error-correction, d3]: p="Find and fix the mistake: I will able to come to your party next Saturday." c="I will be able to come to your party next Saturday." a=["I will be able to come to your party next Saturday.","I will be able to come to your party next Saturday","I'll be able to come to your party next Saturday."] ds=[]
- `m3-u10-could-was-able-to-ec-003` [error-correction, d4]: p="Find and fix the mistake: She was able to swimming really fast when she was ten." c="She was able to swim really fast when she was ten." a=["She was able to swim really fast when she was ten.","She could swim really fast when she was ten.","She was able to swim really fast when she was ten"] ds=[]
- `m3-u10-could-was-able-to-tf-001` [gap-fill, d3]: p="Tell a story about what you could do as a child. Complete: 'When I was five, I ________ already swim.'" c="could" a=["could"] ds=["couldn't","was able to","wasn't able to"]
- `m3-u10-could-was-able-to-tf-002` [gap-fill, d4]: p="You're writing about a famous person for a school project. Complete: 'Beethoven ________ hear later in his life, but he still composed amazing music.'" c="couldn't" a=["couldn't","could not"] ds=["could","was able to","wasn't able to"]
- `m3-u10-could-was-able-to-tf-003` [gap-fill, d5]: p="You're telling your friend about something difficult you managed to do. Complete: 'The maths test was really hard, but I ________ finish it in time.'" c="was able to" a=["was able to","managed to"] ds=["could","couldn't","wasn't able to"]
- `m3-u10-could-was-able-to-tr-001` [translation, d2]: p="🇩🇪 Ich konnte schwimmen, als ich fünf war." c="I could swim when I was five." a=["I could swim when I was five.","I could swim when I was five years old.","I could swim when I was 5.","I could swim when I was five"] ds=[]
- `m3-u10-could-was-able-to-tr-002` [translation, d4]: p="🇩🇪 Nach vielen Versuchen konnte er die Prüfung bestehen." c="After many attempts, he was able to pass the exam." a=["After many attempts, he was able to pass the exam.","After many attempts he was able to pass the exam.","After many tries, he was able to pass the exam.","After many attempts, he was able to pass the test."] ds=[]
- `m3-u10-could-was-able-to-sb-001` [sentence-building, d1]: p="Put the words in the correct order: could / when / I / read / was / I / six" c="I could read when I was six." a=["I could read when I was six.","I could read when I was six","When I was six I could read.","When I was six, I could read."] ds=[]
- `m3-u10-could-was-able-to-mt-001` [matching, d3]: p="Match each sentence with the correct form. 1: I ___ play the piano as a child. (general ability) 2: After lots of practice, I ___ play the difficult piece. (specific achievement) 3: Next year, I ___ play in the school band. (future) 4: She ___ cook when she was a teenager. (general ability) 5: He ___ fix the computer yesterday. (specific achievement)" c="{\"1\":\"a\",\"2\":\"b\",\"3\":\"c\",\"4\":\"a\",\"5\":\"d\"}" a=["{\"1\":\"a\",\"2\":\"b\",\"3\":\"c\",\"4\":\"a\",\"5\":\"d\"}"] ds=["a: could","b: was able to","c: will be able to","d: was able to"]
- `m3-u10-could-was-able-to-qf-001` [question-formation, d3]: p="Tom could play the guitar when he was eight. Ask about: what Tom could play when he was eight." c="What could Tom play when he was eight?" a=["What could Tom play when he was eight?","What could Tom play when he was eight","What could Tom play when he was 8?"] ds=[]
- `m3-u10-could-was-able-to-gf-020` [gap-fill, d1]: p="When I was five, I ___ ride a bike." c="could" a=["could"] ds=["was able to","can","could to"]
- `m3-u10-could-was-able-to-gf-021` [gap-fill, d1]: p="My grandmother ___ speak four languages when she was young." c="could" a=["could"] ds=["was able to","can","could to"]
- `m3-u10-could-was-able-to-gf-022` [gap-fill, d2]: p="The exam was hard, but I ___ pass it." c="was able to" a=["was able to","managed to"] ds=["could","can","was able"]
- `m3-u10-could-was-able-to-gf-023` [gap-fill, d3]: p="After trying for hours, she ___ fix the computer." c="was able to" a=["was able to","managed to"] ds=["could","could to","can"]
- `m3-u10-could-was-able-to-gf-024` [gap-fill, d4]: p="He ___ swim when he was a child, but yesterday he ___ swim across the lake for the first time." c="could ... was able to" a=["could ... was able to","could...was able to"] ds=["could ... could","was able to ... was able to","can ... was able to"]
- `m3-u10-could-was-able-to-gf-025` [gap-fill, d5]: p="I ___ (not) hear what the teacher said because the class was so noisy, but I ___ read the instructions on the board." c="couldn't ... was able to" a=["couldn't ... was able to","could not ... was able to","couldn't...was able to"] ds=["couldn't ... could","wasn't able to ... could","can't ... was able to"]
- `m3-u10-could-was-able-to-mc-020` [multiple-choice, d2]: p="Which sentence correctly describes a general past ability?" c="She could play the piano when she was six." a=["She could play the piano when she was six."] ds=["She was able to play the piano when she was six.","She could to play the piano when she was six.","She can play the piano when she was six."]
- `m3-u10-could-was-able-to-mc-021` [multiple-choice, d3]: p="The fire alarm went off. Which sentence is correct?" c="Everyone was able to get out safely." a=["Everyone was able to get out safely."] ds=["Everyone could get out safely.","Everyone was able get out safely.","Everyone could to get out safely."]
- `m3-u10-could-was-able-to-mc-022` [multiple-choice, d4]: p="Which pair of sentences uses 'could' and 'was able to' correctly?" c="He could run fast as a child. / He was able to win the race last Saturday." a=["He could run fast as a child. / He was able to win the race last Saturday."] ds=["He was able to run fast as a child. / He could win the race last Saturday.","He could run fast as a child. / He could win the race last Saturday.","He was able to run fast as a child. / He was able to win the race last Saturday."]
- `m3-u10-could-was-able-to-ec-020` [error-correction, d2]: p="Find and fix the mistake: She could to swim very well as a child." c="could swim" a=["could swim","She could swim very well as a child.","She could swim very well as a child"] ds=[]
- `m3-u10-could-was-able-to-ec-021` [error-correction, d3]: p="Find and fix the mistake: The test was very difficult, but I could pass it." c="was able to pass" a=["was able to pass","I was able to pass it.","I was able to pass it","managed to pass"] ds=[]
- `m3-u10-could-was-able-to-ec-022` [error-correction, d4]: p="Find and fix the mistake: The door was locked, but my brother could open it with a hairpin." c="was able to open" a=["was able to open","My brother was able to open it with a hairpin.","managed to open"] ds=[]
- `m3-u10-could-was-able-to-tf-020` [transformation, d3]: p="You're describing your childhood to a friend. Complete: 'When I was eight, I ________ (ride) a horse, but I ________ (not / ski).'" c="could ride ... couldn't ski" a=["could ride ... couldn't ski","could ride...couldn't ski","could ride ... could not ski"] ds=[]
- `m3-u10-could-was-able-to-tf-021` [gap-fill, d5]: p="You're telling a story about last week. Rewrite using 'was/were able to': 'We managed to finish the project on time.' → 'We ________ the project on time.'" c="were able to finish" a=["were able to finish"] ds=["could","couldn't","was able to"]
- `m3-u10-could-was-able-to-tr-020` [translation, d3]: p="Translate: Als Kind konnte ich gut zeichnen." c="When I was a child, I could draw well." a=["When I was a child, I could draw well.","When I was a child, I could draw well","As a child, I could draw well.","As a child I could draw well.","I could draw well when I was a child."] ds=[]
- `m3-u10-could-was-able-to-tr-021` [translation, d4]: p="Translate: Trotz des Regens konnten wir das Fussballspiel gewinnen." c="Despite the rain, we were able to win the football match." a=["Despite the rain, we were able to win the football match.","Despite the rain, we were able to win the football match","Despite the rain we were able to win the football match.","Despite the rain, we managed to win the football match.","Despite the rain, we were able to win the football game."] ds=[]
- `m3-u10-could-was-able-to-sb-020` [sentence-building, d2]: p="Put the words in the correct order: play / my / could / when / chess / grandfather / was / he / young" c="My grandfather could play chess when he was young." a=["My grandfather could play chess when he was young.","My grandfather could play chess when he was young","When he was young, my grandfather could play chess.","When he was young my grandfather could play chess."] ds=[]
- `m3-u10-could-was-able-to-sb-021` [sentence-building, d3]: p="Put the words in the correct order: to / able / was / finish / the / she / race" c="She was able to finish the race." a=["She was able to finish the race.","She was able to finish the race"] ds=[]
- `m3-u10-could-was-able-to-mt-020` [matching, d4]: p="Match each sentence with 'could' or 'was/were able to'. 1: She ___ read when she was four. 2: He ___ escape from the burning building. 3: As a child, I ___ run very fast. 4: After two hours, we ___ find the lost dog. 5: My mum ___ speak French fluently when she lived in Paris." c="{\"1\":\"a\",\"2\":\"b\",\"3\":\"a\",\"4\":\"b\",\"5\":\"a\"}" a=["{\"1\":\"a\",\"2\":\"b\",\"3\":\"a\",\"4\":\"b\",\"5\":\"a\"}"] ds=["a: could","b: was/were able to"]
- `m3-u10-could-was-able-to-qf-020` [question-formation, d3]: p="Your friend is talking about their childhood. Ask if they could play an instrument. Start with 'Could...'" c="Could you play an instrument when you were a child?" a=["Could you play an instrument when you were a child?","Could you play an instrument when you were a child","Could you play an instrument as a child?","Could you play a musical instrument when you were young?"] ds=["Could you to play an instrument when you were a child?","Did you could play an instrument when you were a child?","Were you able play an instrument when you were a child?"]
- `m3-u10-future-pp-ability-tf-003` [transformation, d5]: p="You're texting your friend about weekend plans. The weather forecast says it will stop raining by Saturday. Write: 'Don't worry! We ________ to the park on Saturday.'" c="will be able to go" a=["will be able to go"] ds=[]
- `m3-u10-future-pp-ability-qf-001` [question-formation, d3]: p="Form a question: 'He will be able to help us tomorrow.' → Ask a yes/no question." c="Will he be able to help us tomorrow?" a=["Will he be able to help us tomorrow?","Will he be able to help us tomorrow"] ds=[]
- `m3-u10-future-pp-ability-gf-020` [gap-fill, d1]: p="After the operation, he ___ (be able to / walk) again." c="will be able to walk" a=["will be able to walk"] ds=["will can walk","will able to walk","will be able walk"]
- `m3-u10-future-pp-ability-gf-021` [gap-fill, d1]: p="I ___ (be able to / speak) three languages since I was a child." c="have been able to speak" a=["have been able to speak","'ve been able to speak"] ds=["has been able to speak","have been able speak","could speak"]
- `m3-u10-future-pp-ability-gf-022` [gap-fill, d2]: p="She ___ (not / be able to / find) her keys for two hours." c="hasn't been able to find" a=["hasn't been able to find","has not been able to find"] ds=["haven't been able to find","hasn't been able find","wasn't able to find"]
- `m3-u10-future-pp-ability-gf-023` [gap-fill, d3]: p="With this new app, you ___ (be able to / learn) vocabulary faster." c="will be able to learn" a=["will be able to learn","'ll be able to learn"] ds=["will can learn","will be able learn","are able to learn"]
- `m3-u10-future-pp-ability-gf-024` [gap-fill, d4]: p="They ___ (not / be able to / finish) the project yet, but they ___ (be able to / present) it next Monday." c="haven't been able to finish ... will be able to present" a=["haven't been able to finish ... will be able to present"] ds=["hasn't been able to finish ... will be able to present","haven't been able to finish ... can present","weren't able to finish ... will be able to present"]
- `m3-u10-future-pp-ability-gf-025` [gap-fill, d5]: p="___ you ___ (be able to / solve) the maths problem? You've been working on it for ages!" c="Have ... been able to solve" a=["Have ... been able to solve","Have you been able to solve"] ds=["Has ... been able to solve","Were ... able to solve","Will ... be able to solve"]
- `m3-u10-future-pp-ability-mc-020` [multiple-choice, d2]: p="Which sentence correctly talks about a future ability?" c="Robots will be able to cook meals for us." a=["Robots will be able to cook meals for us."] ds=["Robots will can cook meals for us.","Robots will be able cook meals for us.","Robots are able to cook meals for us."]
- `m3-u10-future-pp-ability-mc-021` [multiple-choice, d3]: p="Maria started learning guitar two years ago. Which sentence is correct?" c="She has been able to play simple songs since last year." a=["She has been able to play simple songs since last year."] ds=["She have been able to play simple songs since last year.","She has been able play simple songs since last year.","She could play simple songs since last year."]
- `m3-u10-future-pp-ability-mc-022` [multiple-choice, d5]: p="Which sentence is grammatically WRONG?" c="I will can swim after the lessons." a=["I will can swim after the lessons."] ds=["I will be able to swim after the lessons.","I have been able to swim since I was six.","She hasn't been able to come to practice for weeks."]
- `m3-u10-future-pp-ability-ec-020` [error-correction, d2]: p="Find and fix the mistake: She will can drive a car when she is 18." c="will be able to drive" a=["will be able to drive","She will be able to drive a car when she is 18.","She will be able to drive a car when she is 18"] ds=[]
- `m3-u10-future-pp-ability-ec-021` [error-correction, d3]: p="Find and fix the mistake: He have been able to read since he was five." c="has been able" a=["has been able","He has been able to read since he was five.","He has been able to read since he was five"] ds=[]
- `m3-u10-future-pp-ability-ec-022` [error-correction, d4]: p="Find and fix the mistake: I haven't been able finishing my homework yet." c="able to finish" a=["able to finish","I haven't been able to finish my homework yet.","I haven't been able to finish my homework yet"] ds=[]
- `m3-u10-future-pp-ability-tf-020` [transformation, d3]: p="You are explaining that your baby brother learned to walk recently. Rewrite using 'be able to': 'My brother can walk now. He learned last month.' → My brother ___." c="has been able to walk since last month" a=["has been able to walk since last month"] ds=[]
- `m3-u10-future-pp-ability-tf-021` [transformation, d4]: p="Your friend asks about your plans after school. Rewrite: 'I can't travel now because I have exams, but after the exams, I ___.'" c="will be able to travel" a=["will be able to travel"] ds=[]
- `m3-u10-future-pp-ability-tr-020` [translation, d3]: p="Translate into English: 'Sie kann seit drei Jahren Klavier spielen.'" c="She has been able to play the piano for three years." a=["She has been able to play the piano for three years.","She has been able to play piano for three years."] ds=[]
- `m3-u10-future-pp-ability-tr-021` [translation, d4]: p="Translate into English: 'Nächstes Jahr werde ich allein mit dem Zug fahren können.'" c="Next year, I will be able to travel by train alone." a=["Next year, I will be able to travel by train alone.","Next year I will be able to travel by train alone.","I will be able to travel by train alone next year.","Next year, I will be able to take the train alone."] ds=[]
- `m3-u10-future-pp-ability-sb-020` [sentence-building, d2]: p="Put the words in order: will / able / be / she / to / speak / French / fluently" c="She will be able to speak French fluently." a=["She will be able to speak French fluently.","She will be able to speak French fluently"] ds=[]
- `m3-u10-future-pp-ability-sb-021` [sentence-building, d3]: p="Put the words in order: has / he / swim / been / to / able / since / July" c="He has been able to swim since July." a=["He has been able to swim since July.","He has been able to swim since July"] ds=[]
- `m3-u10-future-pp-ability-mt-020` [matching, d3]: p="Match each sentence beginning with the correct ending. 1: With more practice, you 2: She has been able to 3: In ten years, people 4: I haven't been able to 5: After the course, we" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"e\",\"5\":\"b\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"e\",\"5\":\"b\"}"] ds=["a: ride a bike since she was seven.","b: will be able to speak Italian.","c: will be able to fly to Mars.","d: will be able to play the song.","e: sleep well for a week."]
- `m3-u10-future-pp-ability-cp-020` [context-picker, d2]: p="Your friend broke her leg last month. She just told you she walked without crutches today for the first time. Which response fits?" c="That's great! So you've been able to walk without crutches since today!" a=["That's great! So you've been able to walk without crutches since today!"] ds=["That's great! So you will can walk without crutches!","That's great! So you will be able to walking without crutches!","That's great! So you could walk without crutches since today!"]

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
- **g3-u10**: to hand out leaflets, to sign a petition, to go on a protest march, to organise a meeting, to send out emails, to recycle paper, glass, plastic and cans, to save water and energy, to buy locally produced food, Don't drop litter., Don't drive short distances., Don't leave bottles or cans on the beach., Don't buy a new bag. Bring your own., ability, to exist, right(s), in general, quality, to be able to do, cottage, compromise, Good point., to take action, town hall, way out, majority, argument, to protest, city council, cloth bag, hardly ever, lazy, wrapping, to stand up for, suffrage, suffragette, to vote, to attend, to be equal, law, nowadays, to treat, to arrest, education, to speak out, to refuse, to close down, non-violent, businessman (pl businessmen), concern, debate, headteacher, to involve, organisation

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Alan, Albu, Alessia, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Cambridge, Came, Cameroon, Candyman, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chile, China, Chito, Chloe, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, College, Columbus, Column, Come, Complimenting, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fang, Faye, Feeling, Fido, Fleming, Fluff, Food, Ford, France, Frank, Fred, Freddy, Fund, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lamarr, Lane, Language, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murray, Musical, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ranjit, Rashmi, Raukani, Really, Red, Reihenfolge, Renato, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Royal, Ruby, Russell, Ryan, Sacks, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Shelter, Sherlock, Shrek, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Sylvester, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wise, Work, World, Wortes, Would, Wow, Wu, Wyoming, Yeah, Yellowstone, York, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 3 SB Unit 10.txt -----
Unit 10 Know your rights!
Pages 84–85
At the end of unit 10 ...
 you know
 5 verb phrases for getting your message across
 8 words and phrases for being green
 how to talk about past and future ability and permission
you can
 understand a documentary
 understand a play
 discuss a problem and get organised
 make suggestions
 understand a radio show and a text about equal rights
 understand an interview about children’s heroes and heroines
 design a leaflet
▶ Teen Talk 5
1 a Watch the video. How much of this information did you already know?
 b Watch again. Which of these topics are mentioned?
 ☐ family  ☐ education  ☐ work  ☐ friends
 ☐ sport  ☐ opinions  ☐ play and rest  ☐ pets
 (Image: A group of children being interviewed by a boy with a microphone and headphones, suggesting a street-style or school interview.)
2 Which of the rights in the video do you think are most important? What other children’s rights do you think there are (or should be)? Tell a partner.
VOCABULARY
 Getting the message across
3 Match the expressions with the pictures.
 (Image A: Children holding a STOP sign and protest banners)
 (Image B: A woman holding a megaphone and children with signs saying “Meet Us!”)
 (Image C: A woman placing paper leaflets into mailboxes)
 (Image D: A laptop displaying a mail icon)
 (Image E: A man signing a paper on a table)
1 to go on a protest march
 2 to send out emails
 3 to hand out leaflets
 4 to sign a petition
 5 to organise a meeting
READING & LISTENING
 4 Read part 1 of the play.
 Let’s take some action!
Scene 1 – Going for a picnic
Elif: Why don’t we go to the fields?
 Nick: Good idea. Let me just get my bike and something to drink.
 Elif: Hurry up. We wanted to leave 20 minutes ago!
 Nick: I know. I couldn’t leave earlier. I’m sorry.
 Elif: That’s OK.
Scene 2 – In the fields
Elif: Really? That can’t be true.
 May: 40 cottages here in the fields? Do you know anything about it, Nick?
 Nick: No, I don’t.
 May: But your dad’s on the council. Are you sure you don’t know anything?
 Nick: Believe me, I don’t. I haven’t been able to talk to him for a few days. He’s been so busy recently.
 Elif: Go and talk to him, Nick!
 Nick: Sure. As soon as we get home.
 (Image: The children stand by a field with a sign reading “Field for Sale – Housing Project”. A girl points toward the sign while another looks surprised.)
Scene 3 – Nick talks to his dad
 ▶
 5 What do you think Nick’s dad will say? Listen to scene 3 and check. Then answer the questions.
 1 What does Dad say about the 40 cottages?
 2 What does he say will happen to the trees?
 3 What are the problems Nick says the project will cause?
 4 What does Dad think about the project?
6 Read part 2 of the play.
Scene 4 – Taking action
Nick: So that’s what my dad said.
 Elif: We’ve got to take some action.
 May: Right. We’ve got to send out emails and organise a meeting with people from the town.
 Let’s ask people to sign a petition. And we can hand out leaflets in town, and post some pictures and comments on social media. And we should ask everyone to go on a protest march with us.
 Elif: Do you guys think we’ll be allowed to do all that?
 Nick: Well, let’s start with the kids at school. We can ask for a school council meeting to explain to them first what our plans are.
 May: Good point. Let’s do that.
 (Image: Three children stand determinedly around a table, working together with a laptop and papers.)
Scene 5 – After the meeting at school
Jack: That meeting at school was great.
 Elif: Yeah. I think most kids will support us.
 Jack: And I spoke to my older brother. He’ll be able to print 1,500 leaflets for us, so we can inform people about our protest.
 Elif: Great. And let’s organise a protest march for next Friday. Let’s use the leaflet to tell people about that, too.
 (Image: Children hand out leaflets to people in front of a school building.)
Scene 6 – After the protest march
Nick: There were more than 200 people at the march. Now my dad says they’re going to be a public meeting in the town hall next week. The investor will be there as well.
 May: I’ve heard they’re working on some kind of compromise.
 Elif: Oh, really? Well, quite a lot of the people are against the project. Now the politicians are trying to find a way out of the dilemma.
 Elif: I’m not sure a
 Nick: compromise is what we want. I think we should take more action. Who knows? I still think we’ll be able to stop the project.
 (Image: Children with protest signs celebrating after the march. A large banner reads “SAVE OUR FIELD”.)
Scene 7 – The compromise
 ▶
 7 What do you think? Will there be a compromise? If so, what will it be like? Listen to scene 7 and check.
Pages 86–87
8 How many of these tasks can you do?
Complete the sentences with no more than 4 words.
1 The group of friends go to the fields to …
………………………………………………………………………………………………………………
 2 They see a poster and learn that there are plans to …
 ……………………………………………………………………………………………………………..
 3 Nick promises to talk to his dad who …
………………………………………………………………………………………………………………
 4 When the kids hear about the cottage project, they
 ☐ take action straightaway to protest against the building plans.
 ☐ decide to start by informing the students at their school first.
 ☐ decide to talk to the members of the town council.
 5 After the meeting at their school, the young people
 ☐ are optimistic about what most other students think.
 ☐ don’t know how they’ll manage to get some leaflets printed.
 ☐ start the preparations for a protest march.
 6 The group of friends believe that after the protest march,
 ☐ all the problems will be solved through a compromise.
 ☐ the politicians are looking for a solution to the problem.
 ☐ the investor will say they’re giving up the project.
 7 Which side of the argument do you agree with? Give reasons.
 8 How realistic is it that in real life a group of teens would act like this? Give reasons.
 9 Do you think a good compromise was achieved? Why (not)?
9 Check your answers with a partner.
▶ SPEAKING
 Discussing a problem and making suggestions
10 Listen to the dialogues. Act them out in pairs.
 DIALOGUE 1
 Lisa Have you heard the latest?
 John No, what is it?
 Lisa They want to cut down the old tree in front of the school.
 John But that’s where we hang out after school.
 Lisa We’ve got to do something.
 John Let’s organise a meeting.
DIALOGUE 2
 Anna There’s been another accident in our street.
 Jerry Not again! We need traffic lights there. It’s not safe for the kids.
 Anna Let’s organise a petition.
 Jerry Right. And how about writing hundreds of emails to the city council?
 Anna Good idea.
 Jerry And if that doesn’t help, we can organise a protest march.
 Anna Great!
11 Work in pairs. Make similar dialogues. Here are some ideas:
 • There have been several car accidents in front of the school.
 • All the school computers are old and they don’t work very well.
 • The school library is not open any more in the afternoon.
▶ SOUNDS RIGHT /p/
12 Practise the sound ‘p’. Listen, then say the sentence as fast as you can!
 If people have a protest march, and if parents put pen to paper
 and sign the petition, and if Presley’s brother Paul prints leaflets
 for the public meeting, then they can save part of the place for
 playing, peace and quiet and picnics.
 (Image: A smiling girl with brown hair and a red sweater sits at a table pointing at a paper as she speaks.)
VOCABULARY
 How green are you?
13 Match the sentences and the pictures.
 (Image 1: A hand turning off a running tap)
 (Image 2: A red X over a car and a person walking)
 (Image 3: A girl holding a bottle and a can with an unhappy expression)
 (Image 4: A woman carrying a basket and standing in front of a stand labeled “Farmer’s Market”)
 (Image 5: A girl throwing a can into a bin labeled “Recycle”)
 (Image 6: A boy and a girl leaving a beach, surrounded by bottles and cans)
 (Image 7: A girl placing paper into a container labeled “Paper”)
 (Image 8: A boy holding a bag of rubbish looking worried as wrappers fall into the street)
☐ Don’t drop litter in the streets.
 ☐ Recycle paper, glass, plastic and cans.
 ☐ Save water.
 ☐ Save energy.
 ☐ Don’t buy a new bag at your supermarket. Bring your own.
 ☐ Don’t ask your parents to drive short distances. Ride your bike or walk.
 ☐ Buy locally produced food.
 ☐ Don’t leave bottles or cans on the beach.
14 Read the questionnaire and tick your answers. Then check how ‘green’ you are.
How ‘green’ are you?
1 I … save water.
 ☐ a always    ☐ b sometimes
 ☐ c hardly ever ☐ d never
2 We … buy locally produced food.
 ☐ a always    ☐ b sometimes
 ☐ c hardly ever ☐ d never
3 I … take a basket or cloth bag when shopping.
 ☐ a always    ☐ b sometimes
 ☐ c hardly ever ☐ d never
4 I … take glass bottles to the bottle bank.
 ☐ a always    ☐ b sometimes
 ☐ c hardly ever ☐ d never
5 I … leave litter behind when leaving the beach.
 ☐ a never     ☐ b sometimes
 ☐ c hardly ever ☐ d always
6 I … throw paper, wrappings, plastic bottles into the street.
 ☐ a never     ☐ b sometimes
 ☐ c hardly ever ☐ d always
7 I … put paper into special containers to be recycled.
 ☐ a always    ☐ b sometimes
 ☐ c hardly ever ☐ d never
8 I … ask my parents to drive me short distances.
 ☐ a never     ☐ b sometimes
 ☐ c hardly ever ☐ d always
Pages 88–89
▶ 15 Listen to a radio show in which a reporter interviews a teacher about a project on women’s suffrage.
 Answer the questions.
1 What does ‘suffrage’ mean?
 2 What did the girls and their teacher research first?
 3 What did they find out about women’s suffrage in
 – the UK? – the US? – Switzerland? – Kuwait?
 4 Why did they like the project?
 5 What is their next project about?
DID YOU KNOW ... ?
 In the early 20th century, women in Britain, Australia and the United States demanded the right to vote. These women were called ‘suffragettes’ and they had their own newspaper, called The Suffragette.
16 Read about the history of women’s rights in Austria. Get together in groups and underline the three facts that are most surprising for you.
MEN AND WOMEN = equal rights?
 Did you know that there are countries where men are still very much against women driving cars? It may sound like a joke, but for women in some parts of the world it isn’t. It’s real, and it’s hard to believe.
At least in Europe, you might say, men and women have the same rights. Well, statistics show that this is not always the case. For example, women do not always get the same amount of money for doing the same kind of work. And often a job goes to a man although there is a woman who is better qualified for it.
In many countries, women have had to fight for their rights over the years. Even in Austria, women haven’t always been allowed to do what men have. See for yourself:
🔸Until 1869, girls were only allowed to go to school for a maximum of five years. From the age of ten, they could go to a “Bürgerschule”, but they had to do different things from boys (they had to do cooking and learn to sew and to clean, for example).
 🔸In 1872, girls were allowed to pass the final exams, but only “extern” for the first time, because they couldn’t take the exam at their school. “Extern” had a history: it stands for “externisten” – a boy school. However, girls were still not allowed to attend university.
 🔸1892 saw the first “Gymnasium” for girls in Vienna. At the same time, there were 77 “Gymnasien” for boys. It was only in 1908 that girls could take their final exams at a school for girls.
 🔸1893 saw the Allgemeine Österreichische Frauenverein open. Its goal was to help women as they still did not have the right to vote.
 🔸From 1897 onward, women were allowed to attend university, but they were not allowed to study all subjects. The first Austrian female medical doctor (1897) had to study in Switzerland.
(Image: In 1897, Gabriele Possanner von Ehrenthal became Austria’s first female medical doctor.)
🔸In 1918, women were allowed to vote for the first time.
 🔸Until 1949, female teachers were not allowed to marry. (They also earned 10% less than men and had to pay more taxes.)
 🔸Until 1975, women were not allowed to have a job unless their husbands gave them permission.
 🔸In 1993, a law was passed that said that men and women have to be treated as equals.
The situation is much better nowadays, but will men and women ever have the same rights completely? Here is some food for thought:
“Human rights are women’s rights, and women’s rights are human rights.”
 —Hillary Clinton
17 In groups, discuss the questions below. Come up with three suggestions. Present your ideas to the class.
• What rights should girls have that they have not got yet?
 • Are there any rights boys should have that they have not got yet?
Useful Language:
 We believe that ...
 Girls should have the right to ...
 Girls (also) must be allowed to ...
 It should be forbidden to ...
18 Read about two famous women who stood up for their rights. Summarise what they each did in one sentence.
ROSA PARKS
 When Rosa Parks (1913–2005) refused to give up her seat on the bus to a white man on December 1st, 1955, she wasn’t just tired from work. She was also tired of getting up again and again for white men who wanted her seat. The rest is American history – her arrest, a 381-day bus boycott, and, finally, in November 1956, the decision that it was illegal to have different seats for white people and African-Americans. Finally, African-Americans could sit on a bus, the same as white people.
 (Image: Black and white photo of Rosa Parks seated, smiling; a smaller photo shows a city bus.)
MALALA YOUSAFZAI
 While 15-year-old Malala was walking home from school one day in Pakistan, she was attacked and nearly killed by a gunman*. Her ‘crime’ was speaking out for girls’ rights to go to school in her country.
 She survived the attack and her family found safety in the UK. She started the Malala Fund which continues her fight for education for women all over the world. In 2014, when she was 17, she was given the Nobel Peace Prize for her work.
 VOCABULARY: *gunman = Bewaffneter, Schütze
 (Image: Malala in front of a UN logo, speaking and smiling.)
▶ 19 Listen to three interviews about children’s favourite heroes and heroines. Fill in the grid.
	Who?	Why?
Hannah	.......................................	.............................................
John	.......................................	.............................................
Natasha	.......................................	.............................................

Pages 90–91
WRITING
 20 CHOICES
A A friend has shown you the “Make cycling safe” leaflet.
 She has asked you to design another leaflet about safety.
 In your leaflet say:
 • how important regular checks of your bike are
 • how important good brakes are
 • how important what you are wearing is
B Design a leaflet for something you want to stand up for. Make sure you:
 • find a good slogan
 • say what it is all about
 • say what you are planning to do
 • use a size A4 leaflet
 • come up with a good layout
MAKE CYCLING SAFE
 Say YES to a new cycling path!!
 Ride to the next meeting and join our protest ride!
 Saturday, 3 p.m.
 in front of the old school.
(Image: A poster with the title "MAKE CYCLING SAFE" features a bicycle symbol and a call to action encouraging children to ride to a meeting. The background is light blue with cartoon design elements, and a purple speech bubble says "Say YES to a new cycling path!!")
GRAMMAR
 Past ability and permission: could, was/were able to and was/were allowed to
🔍 Read the examples. Complete the rules. Write could/couldn’t or was(n’t)/were(n’t) able to.
They couldn’t take the exam at their school.
 Finally, African-Americans could sit on a bus, the same as white people.
 We were able to stop them this time.
 They weren’t able to get their jobs back.
You use ‘………………’ to say that something was generally (not) possible or allowed in the past.
 You use ‘………………’ to say that someone didn’t have the ability to do something at a certain time in the past.
Was(n’t)/were(n’t) allowed to means someone didn’t have the permission to do something in the past.
 From 1897 onward, women were allowed to attend university, but they weren’t allowed to study all subjects.
Future and present perfect ability and permission
 They won’t be allowed to have a supermarket there.
 Even in Austria, women haven’t always been allowed to do what men have.
 My older brother will be able to print 1,500 leaflets for us.
 We won’t be allowed to play football there any longer.
 I still think we’ll be able to stop the project.
 We haven’t been able to discuss everything in detail yet.
How to form it:
 Future – will (won’t) be able to + base form of the verb
 Present perfect – have(n’t)/has(n’t) been able to + base form of the verb
(Image: A comic-style illustration of a red flying machine with angry passengers protesting. Caption: “We’ll be able to stop them next time.”)
🔁 Now go back to page 84. ✅ Tick with a partner what you know / can do.
▶ OUR YOUNG WORLD 5
 Ruby’s school spending dilemma
📺
 1 Watch the video. What did the school spend the money on?
 …………………………………………………………………………………………
2 Watch again and answer the questions.
 1 Who gave the money to the school? ............................................................
 2 Who did he say should be involved in the decision on spending it? ............
 3 How did the kids want to spend the money? ..............................................
 4 How did the parents want to spend the money? .........................................
 5 How did the teachers want to spend the money? .......................................
 6 Who made the final decision? .....................................................................
FIND OUT
 Social groups
3 Answer the questions.
 1 There were three different social groups involved in Ruby’s story. What were they?
 a ................................................................................................................................................
 b ................................................................................................................................................
 c ................................................................................................................................................
 2 Why do you think they all had different ideas on how to spend the money?
 3 Why did the headteacher find it difficult to make a final decision?
Different ideas
 4 Work in pairs. For each of the situations below, think of the different social groups that might be involved. Say how they might feel about the plan.
• A local businessman wants to build a golf course on some beautiful green fields outside a small town.
 • A football club wants to sell its top player to a rival football team.
 • The town council wants to put all the homeless people in a local hotel.
CYBER PROJECT: A debate
5 Choose one of the situations in 4 and prepare for a debate.
 • Divide into groups, one for each of the social groups involved.
 • Each group plans its argument in support of their concerns.
 • Take turns to present your arguments.
 • Listen to what other groups have to say.
 • Video the debate.
(Image: A screenshot of a girl wearing an orange jumper in a classroom setting, smiling. A play button overlay indicates this is from a video segment titled "Ruby’s school spending dilemma.")


----- WB: More 3 WB Unit 10.txt -----
UNIT 10 Know your rights!
Page 83
UNDERSTANDING VOCABULARY
 Getting the message across
1 Match the sentence halves.
Would you like to sign
We’re going
Can you help us hand
Have you thought about sending
We need to organise
☐ a meeting to see how people feel about this.
 ☐ out leaflets in High Street on Friday?
 ☐ out emails telling people about the problem?
 ☐ on a protest march against the war tomorrow.
 ☐ this petition against animal cruelty?
USING VOCABULARY
 Getting the message across
2 Look at 1 again. Fill in the missing verbs in the correct form.
Yesterday, my sister and I had a lot of work to do. First, we 1 …………………………………………………… a meeting to discuss the new shopping centre in the fields behind the town. We talked about
 2 …………………………………………………… emails and later 3 …………………………………………………… leaflets. And we also talked about asking people to 4 …………………………………………………… a petition against the shopping centre. Next week, we want to 5 …………………………………………………… a protest march. Quite a lot of things to do.
UNDERSTANDING VOCABULARY
 How green are you?
3 Match the sentence halves.
Don’t drop
Don’t drive
Recycle
Buy locally
Don’t buy
Save
☐ glass bottles, cans and paper.
 ☐ produced food.
 ☐ energy and water.
 ☐ litter in the street.
 ☐ a new bag at your supermarket.
 ☐ short distances.
USING VOCABULARY
 How green are you?
4 Complete the sentences with the words in the box.
distances
 bring
 recycle
 locally produced
 bottles
 save
It’s very important to ........................................................... water.
You should really buy ........................................................... food.
I never buy a new bag at my food store. I always ........................................................... my own.
We always ........................................................... glass bottles and take them to the bottle bank.
Only litterbugs leave ........................................................... and cans on the beach.
People shouldn’t drive short ........................................................... , they should use their bikes or walk.
Page 84–85
5 Look at the pictures. Write sentences about what these people should/shouldn’t do.
Image descriptions:
A man buys food in a supermarket.
A woman is putting groceries in a plastic bag.
A girl is dropping litter on the ground.
A boy is recycling glass bottles.
A girl and a woman are looking at fruit together.
A girl and a boy are using a lot of electricity with many devices.
He should buy locally produced apples.
....................................................................................................................
....................................................................................................................
....................................................................................................................
....................................................................................................................
....................................................................................................................
6 Look at what happened yesterday. Write the children’s names under the pictures.
Yesterday, ...
 • Jill couldn’t go to school.
 • Joanna wasn’t able to buy the dress.
 • James couldn’t phone his friend.
 • Sue wasn’t able to get into the garden.
 • Lucy and Andy couldn’t ride their bikes.
 • Mark and Ron weren’t able to play.
Image descriptions:
A girl standing at a locked school gate.
A girl looking at a dress in a shop window.
A boy at a telephone with an out-of-order sign.
A girl at a locked garden gate.
Two kids with bikes and helmets looking at a closed sign.
Two boys sitting indoors looking bored.
7 Underline the correct form of be able to.
I won’t be able / wasn’t able to do my homework tonight. I haven’t got time.
He spoke so fast. I won’t be able / wasn’t able to understand anything he said.
They got the visa. They were able / will be able to visit us next month.
She was able / has been able to stop the man and the police arrested him last night.
We won’t be able / weren’t able to come to your party next Friday. I’m sorry.
We weren’t able / won’t be able to go to the cinema because we didn’t have enough money.
I’m sorry I wasn’t able / haven’t been able to write to you for such a long time.
8 What do they want for tomorrow? Write six sentences in your exercise book using be able to.
Illustrations show:
Sue
Jill
James
Mark
Ron
Lucy
Andy
Joanna
Tomorrow ...
 Sue: I’ll be able to …
9 Complete with the correct forms of be able to / be allowed to.
1 A Did you go and see the new cottages?
 B I wanted to, but I ............................................................
 get into the field. A sign there said ‘Private’.
2 A Did you print 1,000 leaflets?
 B Not quite. We ............................................................
 print 800 because we ran out of paper.
3 A Why did you get sent home from school?
 B Because I had green hair and we ............................................................
 dye our hair.
4 A Did you talk to the headmaster about the party?
 B Sorry, no. I ............................................................
 talk to him since Monday. He’s away.
10 Fill in the correct forms of be (not) allowed to.
1 Rosa Parks ............................................................ sit down on the bus.
 2 The company ............................................................ build 40 houses next year.
 3 So far, we ............................................................ vote, but in the next election we will.
 4 Sorry, I can’t come. I ............................................................ take part in the protest march.
 5 All of us ............................................................ attend the meeting.
 6 We ............................................................ print leaflets next Monday.
11 Complete the sentences so they are true for you. Write them in your exercise book.
1 So far this year, I have been able to ...
 2 Last night, I was able to ...
 3 One day, I hope I’ll be able to ...
 4 My best friend isn’t able to ...
 5 I’m very lucky because I’m able to ...
 6 Today I haven’t been able to ...
 7 This weekend, I won’t be able to ...
 8 When I was five, I wasn’t able to ...
12 Put the dialogue in the correct order.
☐ A Exactly! Work’s going to start next month.
 ☐ B That’s a brilliant idea.
 ☐ C That’s why I need you to help me.
 ☐ D Through the village? That’s stupid!
 ☐ E We want to start a petition and hand out leaflets to all the people in the village.
 ☐ F Help you with what?
 ☐ G A Will you help us?
 ☐ H Of course.
 ☐ I They’re planning to build a motorway through our village.
13 Choose one of the situations and write a short dialogue. Use the dialogue in 12 to help you.
☐ There are plans to build a supermarket where the tennis court is.
 ☐ The school library is not open any more in the afternoon.
VOCABULARY: court = Platz
Page 86–87
14 Read the story.
 The computer lab protest
We’ve got this brilliant new computer lab.
 New computers, high-speed internet,
 good printers – anything you could wish
 for. And sometimes we even go there.
A teacher takes out our group (far too large), and
 we do a bit of writing or maths or project work.
 The problem is, however, this doesn’t happen
 very often. The lab is totally booked out until
 lunchtime, and after lunch, only a handful of older
 pupils use it, probably to play some online games
 because they can do what they want in there. But
 the thing is, the younger ones are not allowed in
 without a teacher. And this is really unfair!
Of course, we talked to the
 headmaster about it. All he
 said was, “Sorry guys.
 You know the rules.” Yes,
 we know them, but we
 want different rules. “Talk
 to the computer education teachers about it,”
 the headmaster said. “Then come back to me.”
So we went and talked
 to the teachers. “Sorry
 guys,” they said. “You
 know the rules. Talk to the
 headmaster about it.” By
 the way, we think their rules
 are good. Funny, isn’t it?
So I organised a meeting of all the 13-year-olds in
 our school. Only half of them came, but that was
 OK.
“What we want is to use the computer lab in
 the afternoons too. We could work on our projects,
 we could do some writing, we could do some
 research.” “But we can only use it when a
 teacher is there,” someone said. “Exactly!” I said,
 “And that is totally unfair. Who says we play
 around and break things? Why do some of the
 older pupils behave better than we do? They
 don’t need a teacher to work there.”
In the end, we had this plan: One of us is a ‘labbie’ who
 checks that everything is in order and nobody fools
 around. Or we find one of the older kids to be a labbie.
 We took the plan to the headmaster and he said, “I’ll
 think about it. And talk to the teachers about it.” After
 two weeks, we went to see him again, and again he
 said, “I’ll think about it.”
So we had another meeting. “We must show everybody
 that we are serious about this,” I said. “Let’s have a little
 protest meeting in front of the computer lab.” About 30
 people went there, standing in front of the lab, holding
 up signs saying: “Let us into the lab!” and “Computer
 time is not a crime.”
Ten minutes later, the head* was there. “I must ask you
 to leave,” he said. “This is not helping.” We didn’t leave.
 “OK,” he said, “I promise a meeting for next Friday.
 Then we can sort it out.”
“Hoopray!” everybody shouted, and the head shouted,
 “Quiet, please!” And then we all left.
Next Friday, there was a meeting with the head. There
 were five of us and there were two computer education
 teachers. “No young labbies,” the head said. “But we’ll
 try it. Some of the older kids will be computer
 labbies for three hours every afternoon. And Mr Pringle
 and Miss Johnson will check
 on them. And I will, too, of
 course.”
We agreed. And next week
 we’ll start using the computer
 lab in the afternoons. I’m
 really looking forward to it.
VOCABULARY: head – short for headmaster
Image description: Several cartoon-style signs are held by students protesting. Some signs say: “LET US INTO THE LAB!”, “COMPUTER TIME IS NOT A CRIME!”, and “COMPUTER LAB = LEARNING!”
15 How many of these tasks can you do?
1 The writer never gets to use the computer lab.
 ☐ T / ☐ F
2 Students can only use the computer room for learning.
 ☐ T / ☐ F
3 The writer spoke to the headmaster first about the problem.
 ☐ T / ☐ F
4 At the first meeting, the students
 ☐ organised a protest.
 ☐ discussed reasons why the situation was unfair.
 ☐ played about and broke things.
5 A labbie is someone who
 ☐ uses a lab a lot.
 ☐ works in a lab.
 ☐ looks after a lab.
6 At the second meeting, the students
 ☐ organised a protest.
 ☐ invited the headmaster along to discuss things.
 ☐ made protest signs.
7 Why did the headmaster promise the kids a meeting on Friday?
 ............................................................................................................................................
8 How many people went to the final meeting?
 ............................................................................................................................................
9 What’s one thing you would like most to change in your school and why?
 ............................................................................................................................................
16 Listen and check your answers.
17 Read the letter to the headmaster and then listen to the conversation. Find four differences in the letter and underline them.
Dear Mr Owens,
 We are writing to ask you to think again about the end-of-year party. As you
 know, this is a very popular event. All the school leavers* love it. We understand
 that last year there was some trouble and some of the boys did not behave
 very well. We know that three windows were broken and we understand that
 you don’t want this to happen again. But you don’t have to stop our party. That
 was last year’s school leavers, not us. We are asking you to change your mind,
 please. If you say that we can’t have our party, then we will have to organise a
 protest march. We are sure that all the students in all the years will join. Please
 remember that two years ago my brother organised a protest in the school
 library and it worked. We are sure that you don’t want something like that to
 happen again.
 Thank you for your attention.
 Julian Harvey
VOCABULARY: school leaver – Schulabgänger/in
Page 88–89
18 CHOICES
 A Complete the dialogue with the sentences from the box. There are two extra sentences.
 Then listen and check.
a But you can walk on the pavement.
 b Why aren’t you at school?
 c Why do you want that?
 d Why don’t you go away?
 e And I want the right to drive my car here, too.
 f So what’s this protest march about?
Man 1 ...............................................................................................
 Stephanie We want to keep this street a
 traffic-free zone.
 Man 2 ...............................................................................................
 Stephanie We want to be able to walk here safely.
 Man 3 ...............................................................................................
 Stephanie There isn’t much room on the
 pavement. We want more space for
 people, not cars.
 Man 4 ...............................................................................................
 Stephanie Well, maybe you need to organise your own protest march.
Image description: Stephanie is talking assertively to an older man on the street. She is holding a leaflet and pointing as she explains something.
B Put the dialogue in the correct order. Then listen and check.
1 ☐ Mum What are you working on?
 ☐ Mum Very funny, Harry.
 ☐ Mum Very good. Did you learn about your rights in school?
 ☐ Mum Like what?
 ☐ Mum What is it about?
 ☐ Harry I’m doing a poster for school.
 ☐ Harry The right to work in peace and quiet.
 ☐ Harry We did. But I’m adding some new ones.
 ☐ Harry It’s about the rights of children.
Image description: Harry is sitting at a table with a red marker, working on a protest-style poster that reads “THE RIGHT TO WORK IN PEACE AND QUIET.” His mum stands beside him, smiling.
19 Read the task and what a student wrote. How much is it to go to the party?
Task
 Someone asked you to design a leaflet for a school party.
 On your leaflet say:
 ✔ where and when the party is
 ✔ who is invited
 ✔ what the entertainment is
 ✔ what food and drink there is
 ✔ how much it is to go
Trentdale Comprehensive School
 End of Year Party
 Where: schoolyard
 When: 6 p.m. to 8 p.m.
Parents, teachers, school children are all invited.
 There will be games!
 There will be a band!
 There will be singing and dancing!
 Sandwiches, cakes and beverages are free.
 Free entry – but we are happy for donations!
 See you at our party!
Language tip: Layout
 For a leaflet a good layout is important because it needs to attract the attention of the reader.
 ● Use a full page. Think how to best spread your text/pictures over it.
 ● Try not to leave large blank spaces at the bottom or the top of the page.
 ● Think how you can use different fonts and font sizes to highlight important information
   and to draw attention to your leaflet.
Page 90–91
20 Look at the leaflet in 19 and write on it where and how you would improve it. (For example:
 Make “See you at our party” larger and bold it.)
Writing tip: Writing a leaflet
 • Write your leaflet by hand first.
 • Use short sentences.
 • Use good slogans (e.g. SOS – Save Our Seals).
 • Use words and phrases that are easy to remember (e.g. words starting with the same letter – Help with Homework?).
 • If possible, design your leaflet on a computer.
21 Now write your own answer to the following task.
Task
 Someone asked you to design a leaflet for a school play.
 On your leaflet say:
 ✔ what the title of the play is
 ✔ where and when the play takes place
 ✔ who is invited
 ✔ how to get tickets
 ✔ how much it is to go
WORD FILE
Getting the message across
 • to hand out leaflets
 • to sign a petition
 • to go on a protest march
 • to organise a meeting
 • to send out emails
How green are you?
 • to recycle paper, glass, plastic and cans
 • to save water and energy
 • to buy locally produced food
 • Don’t drop litter.
 • Don’t drive short distances.
 • Don’t leave bottles or cans on the beach.
 • Don’t buy a new bag. Bring your own.
MORE Words and Phrases
English	Example Sentence	Deutsch
ability	You have the ability to make a lot of people happy.	Fähigkeit
to exist	In fact, the Convention on the Rights of the Child didn’t exist until 1990.	existieren
right(s)	The UN lists the rights that all people around the world must have.	Recht(e)
in general	In general, kids these days are lucky.	im Allgemeinen
quality	You have the right to a good quality education.	Qualität
to be able to do	I haven’t been able to talk to him for a few days.	fähig sein, etw. zu tun
cottage	40 cottages here in the fields?	kleines Landhaus, Ferienhaus
compromise	I’ve heard they’re working on some kind of compromise.	Kompromiss

English word	Example Sentence	German
Good point.	—	Da ist was dran., Gutes Argument.
to take action	They take action straightaway to protest against the building plans.	etw. unternehmen, aktiv werden
town hall	There’s going to be a public meeting in the town hall next week.	Rathaus, Gemeindeamt
way out	The politicians are trying to find a way out of the dilemma.	Ausweg
majority	Well, 40% is not a majority.	Mehrheit
argument	Which side of the argument do you agree with?	Argument; hier: Streit
to protest	We have to protest against the building plans.	protestieren
city council	We could write an email to the city council.	Stadtrat
cloth bag	I always take a basket or a cloth bag when shopping.	Stofftasche
hardly ever	I hardly ever waste water.	fast nie
lazy	You probably know what you should do, but you are too lazy.	faul
wrapping	Don’t throw paper, wrappings or bottles into the street.	Verpackung
to stand up for	You have to stand up for your rights.	für etw. eintreten
suffrage	It’s about suffrage, which is the right of women to vote.	Wahlrecht
suffragette	The suffragettes fought for their right to vote.	Frauenrechtlerin
to vote	In the early 20th century, women wanted the right to vote.	wählen
to attend	However, girls were still not allowed to attend university.	besuchen (Universität, Veranstaltung)
to be equal	Men and women should be equal.	gleichberechtigt sein
law	In 1993, a law was passed that said men and women should be treated as equals.	Gesetz
nowadays	The situation is much better nowadays.	heutzutage
to treat	Men and women should be treated as equals.	behandeln
to arrest	After Rosa Parks’ arrest, there was a 381-day bus boycott.	Verhaftung, Festnahme
education	The Malala Fund fights for education for women all over the world.	(Aus-)Bildung
to speak out	Malala speaks out for girls’ right to go to school.	sich für etw./jdn. aussprechen, seine Meinung sagen
to refuse	Rosa Parks refused to give up her seat on the bus.	(ver-)weigern
to close down	They didn’t get their jobs back, because the company closed down.	schließen
non-violent	Ghandi taught his people how to protest in a non-violent way.	gewaltlos
businessman (pl businessmen)	A rich local businessman gave the school some money.	Geschäftsmann
concern	Each group plans its argument in support of their concerns.	Anliegen, Sorge
debate	All social groups should be part of the debate.	Debatte
headteacher	The headteacher could make the decision.	Schulleiter/Schulleiterin
to involve	We want to involve children, teachers and parents in the decision.	involvieren, einbeziehen
organisation	The school council is an organisation for the students.	Organisation

```

## Output contract

Write `content/corpus/units/g3-u10/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g3-u10",
  "briefBank": "fa1519f49700",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g3u10.s.be-allowed-to-tenses",
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
