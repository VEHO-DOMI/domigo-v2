# Grammar generation brief — g2-u02 (MORE! 2, Unit 2)

<!-- domigo:gen grammar g2-u02 bank=ad9510a3c2c7 prompt=4b9164076103 -->

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

### `g2u02.s.irregular-verbs` — More irregular verbs (Weitere unregelmäßige Verben)

Additional irregular past simple forms (buy-bought, know-knew, make-made, write-wrote), expanding the grade-1 set; unit 8 adds more (take, come, run, break, win, lose ...).

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [learn-new-forms]: These irregular verbs do not follow the -ed pattern - their past forms must be learnt: buy-bought, know-knew, make-made, write-wrote.
  - DE: Diese unregelmäßigen Verben folgen nicht dem -ed-Muster. Ihre Vergangenheitsformen musst du auswendig lernen: buy-bought, know-knew, make-made, write-wrote.
  - "We bought a big box of chocolates." — "Wir kauften eine große Schachtel Pralinen."
  - "He knew it was wrong." — "Er wusste, dass es falsch war."
  - "Jacob made a terrible mistake." — "Jacob machte einen schrecklichen Fehler."
- rule [base-form-negatives-questions]: In negatives and questions, use the base form, not the past form: didn't buy, Did you write ...?
  - DE: In verneinten Sätzen und Fragen verwendest du die Grundform, nicht die Vergangenheitsform: didn't buy, Did you write ...?
  - "He didn't make any mistakes." — "Er hat keine Fehler gemacht."
  - "Did she write an email?" — "Hat sie eine E-Mail geschrieben?"
- rule [growing-set]: The set keeps growing through the year: take-took, come-came, run-ran, wake up-woke up, break-broke, can-could, sing-sang, win-won, lose-lost.
  - DE: Die Liste wächst im Laufe des Jahres weiter: take-took, come-came, run-ran, wake up-woke up, break-broke, can-could, sing-sang, win-won, lose-lost.
  - "Finally, they took him back to Earth." — "Schließlich brachten sie ihn zurück zur Erde."
  - "She won the game." — "Sie gewann das Spiel."

common errors:
- Adding -ed to irregular verbs: ✗ "She buyed a new jacket." → ✓ "She bought a new jacket."
- Using the past form after didn't: ✗ "I didn't knew the answer." → ✓ "I didn't know the answer."

SB box `g2/sb/More 2 SB Unit 2.txt#grammar-1` — ▶️ Past simple negation (revision):
```
I didn’t listen to a thing.
 I didn’t know Clare liked Joe.
Wichtig: Kein did oder didn’t mit was/were!
 The jacket wasn’t on the screen.
 The roses weren’t on the jacket.
▶️ Past simple questions
Did you like the dumplings?
 Did you have a good day at school?
Wichtig: Kein did oder didn’t mit was/were!
 Was Chloe embarrassed?
 Were there any dumplings left on the floor?
🔍 Complete. Write did or didn’t.
 So bildest du die Verneinung im Past simple: Person + 1. _______________ + Grundform des Verbs
 So bildest du Fragen im Past simple: 2. _______________ + Person + Grundform des Verbs
▶️ More irregular verbs
 buy – We bought a big box of chocolates.
 know – He knew it was wrong.
 make – Jacob made a terrible mistake.
 write – I wrote an email to the kids.
▶️ why – because
Why do you want another T-shirt? – Because I don’t like this one.
Why is that not possible? – Because I put it in the washing machine.
Why do you like PE? – Because sport is cool.
📘 Now go back to page 16. Check ✅ with a partner what you know / can do.
```

SB box `g2/sb/More 2 SB Unit 8.txt#grammar-1` — Past simple (revision):
```
Bei regelmäßigen Verben bildest du das Past simple, indem du -ed anhängst:
 | open – opened | laugh – laughed | look – looked |
Es gibt auch viele unregelmäßige Verben:
 | be – was/were | take – took | come – came | go – went | run – ran |
 | see – saw | wake up – woke up | break – broke | can – could | know – knew |
 | sing – sang | buy – bought | win – won | lose – lost |
Die Verneinung bildest du mit didn’t + Verb:
 They didn’t believe her.
 She didn’t take another photograph.
Was/were verneinst du mit wasn’t/weren’t.
Past time markers
 So kannst du ausdrücken, wann sich etwas in der Vergangenheit ereignet hat:
 Half an hour ago, we heard some funny noises.
 Then everything went black.
 After that, Benson went to the old Space Centre.
 After a minute, the chair stopped.
Finally, they took him back to Earth.
 One day, James was alone in a town.
 In 2013, there was a big investigation.
 Last night, a spaceship landed in our garden.
Image description (bottom right of grammar box): Mr Brown didn’t look before he opened the door. A surprised-looking man sees a robot-like figure behind the door.
```

v1 seed items (UNTRUSTED):
- `m2-u2-irregular-verbs-expanded-gf-001` [gap-fill, d1]: p="My mum ___ (buy) a new jacket yesterday." c="bought" a=["bought"] ds=["buyed","buys","byed"]
- `m2-u2-irregular-verbs-expanded-gf-002` [gap-fill, d1]: p="She ___ (write) a letter to her pen pal last week." c="wrote" a=["wrote"] ds=["writed","written","writes"]
- `m2-u2-irregular-verbs-expanded-gf-003` [gap-fill, d2]: p="I ___ (know) the answer, but I was too shy to say it." c="knew" a=["knew"] ds=["knowed","knows","knewed"]
- `m2-u2-irregular-verbs-expanded-gf-004` [gap-fill, d2]: p="They ___ (make) a big sandcastle at the beach." c="made" a=["made"] ds=["maked","makes","maded"]
- `m2-u2-irregular-verbs-expanded-gf-005` [gap-fill, d3]: p="He didn't ___ (know) where the school was." c="know" a=["know"] ds=["knew","knowed","knows"]
- `m2-u2-irregular-verbs-expanded-gf-006` [gap-fill, d4]: p="We didn't ___ (buy) anything at the school fair." c="buy" a=["buy"] ds=["bought","buyed","buying"]
- `m2-u2-irregular-verbs-expanded-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="She wrote an email to her teacher." a=["She wrote an email to her teacher."] ds=["She writed an email to her teacher.","She write an email to her teacher.","She wroten an email to her teacher."]
- `m2-u2-irregular-verbs-expanded-mc-002` [multiple-choice, d3]: p="Which negative sentence is correct?" c="I didn't make any mistakes in the test." a=["I didn't make any mistakes in the test."] ds=["I didn't made any mistakes in the test.","I didn't maked any mistakes in the test.","I not made any mistakes in the test."]
- `m2-u2-irregular-verbs-expanded-mc-003` [multiple-choice, d4]: p="Choose the correct sentence:" c="My grandpa knew a lot about animals." a=["My grandpa knew a lot about animals."] ds=["My grandpa knowed a lot about animals.","My grandpa know a lot about animals.","My grandpa knew a lot about animal."]
- `m2-u2-irregular-verbs-expanded-ec-001` [error-correction, d3]: p="Find and fix the mistake: She buyed new trainers for PE." c="She bought new trainers for PE." a=["She bought new trainers for PE.","She bought new trainers for PE","bought"] ds=[]
- `m2-u2-irregular-verbs-expanded-ec-002` [error-correction, d3]: p="Find and fix the mistake: I didn't knew the answer to question five." c="I didn't know the answer to question five." a=["I didn't know the answer to question five.","I didn't know the answer to question five","know"] ds=[]
- `m2-u2-irregular-verbs-expanded-ec-003` [error-correction, d5]: p="Find and fix the mistake: Tom writed a really funny story in English class." c="Tom wrote a really funny story in English class." a=["Tom wrote a really funny story in English class.","Tom wrote a really funny story in English class","wrote"] ds=[]
- `m2-u2-irregular-verbs-expanded-tf-001` [gap-fill, d3]: p="You're telling your mum about lunch at school. Complete: 'Yesterday I ___ (buy) a sandwich at the canteen.'" c="bought" a=["bought"] ds=["buyed","buys","buying"]
- `m2-u2-irregular-verbs-expanded-tf-002` [gap-fill, d4]: p="Your sister wrote a poem for homework but it's gone now. Tell your dad: 'She ___ (not write) a new poem — she lost the old one.'" c="didn't write" a=["didn't write","did not write"] ds=["didn't wrote","hasn't written","don't write"]
- `m2-u2-irregular-verbs-expanded-tf-003` [gap-fill, d5]: p="It's Monday morning. Tell your friend about yesterday: 'We ___ (make) pancakes on Sunday morning.'" c="made" a=["made"] ds=["goed","sawed","drinked"]
- `m2-u2-irregular-verbs-expanded-tr-001` [translation, d3]: p="🇩🇪 Ich habe gestern ein neues Buch gekauft." c="I bought a new book yesterday." a=["I bought a new book yesterday.","I bought a new book yesterday","Yesterday I bought a new book.","Yesterday I bought a new book"] ds=[]
- `m2-u2-irregular-verbs-expanded-tr-002` [translation, d4]: p="🇩🇪 Er hat keinen Kuchen gemacht." c="He didn't make a cake." a=["He didn't make a cake.","He didn't make a cake","He did not make a cake.","He did not make a cake","He didn't make any cake.","He didn't make any cake"] ds=[]
- `m2-u2-irregular-verbs-expanded-sb-001` [sentence-building, d2]: p="Put the words in the correct order: wrote / she / a / long / email / yesterday" c="She wrote a long email yesterday." a=["She wrote a long email yesterday.","She wrote a long email yesterday","Yesterday she wrote a long email.","Yesterday she wrote a long email"] ds=[]
- `m2-u2-irregular-verbs-expanded-mt-001` [matching, d1]: p="Match each verb with its past form:\n1. buy\n2. know\n3. make\n4. write\n\na. made\nb. wrote\nc. bought\nd. knew" c="{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"b\"}"] ds=[]
- `m2-u2-irregular-verbs-expanded-cp-001` [context-picker, d2]: p="Your class made posters for the school project last week. Which sentence correctly describes what happened?" c="They made a big poster for the school project." a=["They made a big poster for the school project."] ds=["They maked a big poster for the school project.","They make a big poster for the school project.","They have made a big poster for the school project."]

### `g2u02.s.past-simple-negation` — Past simple negation (revision) (Verneinung im Past simple (Wiederholung))

Revision of past simple negatives: didn't + base form for most verbs, wasn't/weren't for be - never did/didn't with was/were.

v1 floor for this structure: **0 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [didnt-base-form]: Form past simple negatives with didn't + base form of the verb.
  - DE: So bildest du die Verneinung im Past simple: Person + didn't + Grundform des Verbs.
  - "I didn't listen to a thing." — "Ich habe überhaupt nicht zugehört."
  - "I didn't know Clare liked Joe." — "Ich wusste nicht, dass Clare Joe mag."
  - "They didn't believe her." — "Sie glaubten ihr nicht."
- rule [wasnt-werent]: Never use did or didn't with was/were - negate be with wasn't/weren't.
  - DE: Wichtig: Kein did oder didn't mit was/were! Was/were verneinst du mit wasn't/weren't.
  - "The jacket wasn't on the screen." — "Die Jacke war nicht auf dem Bildschirm."
  - "The roses weren't on the jacket." — "Die Rosen waren nicht auf der Jacke."

common errors:
- Using the past form after didn't: ✗ "I didn't listened to a thing." → ✓ "I didn't listen to a thing."
- Using didn't with was/were: ✗ "The jacket didn't was on the screen." → ✓ "The jacket wasn't on the screen."

SB box `g2/sb/More 2 SB Unit 2.txt#grammar-1` — ▶️ Past simple negation (revision):
```
I didn’t listen to a thing.
 I didn’t know Clare liked Joe.
Wichtig: Kein did oder didn’t mit was/were!
 The jacket wasn’t on the screen.
 The roses weren’t on the jacket.
▶️ Past simple questions
Did you like the dumplings?
 Did you have a good day at school?
Wichtig: Kein did oder didn’t mit was/were!
 Was Chloe embarrassed?
 Were there any dumplings left on the floor?
🔍 Complete. Write did or didn’t.
 So bildest du die Verneinung im Past simple: Person + 1. _______________ + Grundform des Verbs
 So bildest du Fragen im Past simple: 2. _______________ + Person + Grundform des Verbs
▶️ More irregular verbs
 buy – We bought a big box of chocolates.
 know – He knew it was wrong.
 make – Jacob made a terrible mistake.
 write – I wrote an email to the kids.
▶️ why – because
Why do you want another T-shirt? – Because I don’t like this one.
Why is that not possible? – Because I put it in the washing machine.
Why do you like PE? – Because sport is cool.
📘 Now go back to page 16. Check ✅ with a partner what you know / can do.
```

SB box `g2/sb/More 2 SB Unit 8.txt#grammar-1` — Past simple (revision):
```
Bei regelmäßigen Verben bildest du das Past simple, indem du -ed anhängst:
 | open – opened | laugh – laughed | look – looked |
Es gibt auch viele unregelmäßige Verben:
 | be – was/were | take – took | come – came | go – went | run – ran |
 | see – saw | wake up – woke up | break – broke | can – could | know – knew |
 | sing – sang | buy – bought | win – won | lose – lost |
Die Verneinung bildest du mit didn’t + Verb:
 They didn’t believe her.
 She didn’t take another photograph.
Was/were verneinst du mit wasn’t/weren’t.
Past time markers
 So kannst du ausdrücken, wann sich etwas in der Vergangenheit ereignet hat:
 Half an hour ago, we heard some funny noises.
 Then everything went black.
 After that, Benson went to the old Space Centre.
 After a minute, the chair stopped.
Finally, they took him back to Earth.
 One day, James was alone in a town.
 In 2013, there was a big investigation.
 Last night, a spaceship landed in our garden.
Image description (bottom right of grammar box): Mr Brown didn’t look before he opened the door. A surprised-looking man sees a robot-like figure behind the door.
```

### `g2u02.s.past-simple-questions` — Past simple questions (Fragen im Past simple)

Forming past simple questions with Did + subject + base form and with was/were for be, including short answers.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [did-base-form]: Form past simple questions with Did + subject + base form.
  - DE: So bildest du Fragen im Past simple: Did + Person + Grundform des Verbs.
  - "Did you like the dumplings?" — "Haben dir die Knödel geschmeckt?"
  - "Did you have a good day at school?" — "Hattest du einen guten Tag in der Schule?"
- rule [was-were-questions]: Never use did with was/were - for be, put was/were before the subject.
  - DE: Wichtig: Kein did oder didn't mit was/were! Bei be stellst du was/were einfach vor das Subjekt.
  - "Was Chloe embarrassed?" — "War Chloe verlegen?"
  - "Were there any dumplings left on the floor?" — "Waren noch Knödel auf dem Boden übrig?"
- rule [short-answers]: Short answers repeat the auxiliary: Yes, I did. / No, she didn't. / Yes, he was. / No, they weren't.
  - DE: Kurzantworten verwenden das Hilfsverb: Yes, I did. / No, she didn't. / Yes, he was. / No, they weren't.
  - "Did you go? - Yes, I did." — "Bist du gegangen? - Ja."
  - "Was she embarrassed? - No, she wasn't." — "War sie verlegen? - Nein."

common errors:
- Using did with was/were: ✗ "Did he was happy?" → ✓ "Was he happy?"
- Using the past form after did instead of the base form: ✗ "Did you went to the cinema?" → ✓ "Did you go to the cinema?"
- Forming questions with statement word order, without did: ✗ "You liked the film?" → ✓ "Did you like the film?"

SB box `g2/sb/More 2 SB Unit 2.txt#grammar-1` — ▶️ Past simple negation (revision):
```
I didn’t listen to a thing.
 I didn’t know Clare liked Joe.
Wichtig: Kein did oder didn’t mit was/were!
 The jacket wasn’t on the screen.
 The roses weren’t on the jacket.
▶️ Past simple questions
Did you like the dumplings?
 Did you have a good day at school?
Wichtig: Kein did oder didn’t mit was/were!
 Was Chloe embarrassed?
 Were there any dumplings left on the floor?
🔍 Complete. Write did or didn’t.
 So bildest du die Verneinung im Past simple: Person + 1. _______________ + Grundform des Verbs
 So bildest du Fragen im Past simple: 2. _______________ + Person + Grundform des Verbs
▶️ More irregular verbs
 buy – We bought a big box of chocolates.
 know – He knew it was wrong.
 make – Jacob made a terrible mistake.
 write – I wrote an email to the kids.
▶️ why – because
Why do you want another T-shirt? – Because I don’t like this one.
Why is that not possible? – Because I put it in the washing machine.
Why do you like PE? – Because sport is cool.
📘 Now go back to page 16. Check ✅ with a partner what you know / can do.
```

v1 seed items (UNTRUSTED):
- `m2-u2-past-simple-questions-gf-001` [gap-fill, d1]: p="___ you enjoy the school trip? — Yes, I did." c="Did" a=["Did"] ds=["Do","Was","Were"]
- `m2-u2-past-simple-questions-gf-002` [gap-fill, d1]: p="___ she at the swimming pool yesterday?" c="Was" a=["Was"] ds=["Did","Were","Is"]
- `m2-u2-past-simple-questions-gf-003` [gap-fill, d2]: p="Did Tom ___ his homework last night?" c="finish" a=["finish"] ds=["finished","finishing","finishes"]
- `m2-u2-past-simple-questions-gf-004` [gap-fill, d2]: p="___ the children happy at the party?" c="Were" a=["Were"] ds=["Was","Did","Are"]
- `m2-u2-past-simple-questions-gf-005` [gap-fill, d3]: p="Did your brother ___ to the football match on Saturday?" c="go" a=["go"] ds=["went","goes","gone"]
- `m2-u2-past-simple-questions-gf-006` [gap-fill, d3]: p="Where ___ you last weekend? — I was at my grandma's house." c="were" a=["were"] ds=["was","did","are"]
- `m2-u2-past-simple-questions-mc-001` [multiple-choice, d2]: p="Which question is correct?" c="Did she visit her friend yesterday?" a=["Did she visit her friend yesterday?"] ds=["Did she visited her friend yesterday?","She did visit her friend yesterday?","Was she visit her friend yesterday?"]
- `m2-u2-past-simple-questions-mc-002` [multiple-choice, d3]: p="Which past question about a film is correct?" c="Was the film good?" a=["Was the film good?"] ds=["Did the film was good?","Did the film good?","Were the film good?"]
- `m2-u2-past-simple-questions-mc-003` [gap-fill, d4]: p="Choose the correct short answer: Were you and Emma at the park? — No, ___." c="we weren't" a=["we weren't"] ds=["we didn't","we wasn't","we not were"]
- `m2-u2-past-simple-questions-ec-001` [error-correction, d3]: p="Find and fix the mistake: Did you went to the cinema last Friday?" c="Did you go to the cinema last Friday?" a=["Did you go to the cinema last Friday?","Did you go to the cinema last Friday","go"] ds=[]
- `m2-u2-past-simple-questions-ec-002` [error-correction, d4]: p="Find and fix the mistake: Did he was tired after the match?" c="Was he tired after the match?" a=["Was he tired after the match?","Was he tired after the match","Was"] ds=[]
- `m2-u2-past-simple-questions-ec-003` [error-correction, d4]: p="Find and fix the mistake: You liked the new teacher?" c="Did you like the new teacher?" a=["Did you like the new teacher?","Did you like the new teacher","Did you like"] ds=[]
- `m2-u2-past-simple-questions-tf-001` [gap-fill, d3]: p="Your friend was away from school yesterday. Ask her about the trip: '___ you ___ the school trip?'" c="Did ... enjoy" a=["Did ... enjoy","Did you enjoy","Did you enjoy the school trip?","Did she enjoy"] ds=["Do ... enjoy","Was","Were"]
- `m2-u2-past-simple-questions-tf-002` [gap-fill, d4]: p="You want to know where your friend was after school. Ask: '___ they at the zoo yesterday?'" c="Were" a=["Were","Were they at the zoo yesterday?","Were they at the zoo yesterday"] ds=["Was","Did","Are"]
- `m2-u2-past-simple-questions-tf-003` [gap-fill, d5]: p="You're curious about your pen pal's holiday. Ask where he went: 'Where ___?'" c="did he go" a=["did he go","Where did he go?","Where did he go"] ds=["Do","Was","Were"]
- `m2-u2-past-simple-questions-tr-001` [translation, d2]: p="🇩🇪 Hast du den Film gesehen?" c="Did you see the film?" a=["Did you see the film?","Did you see the film","Did you see the movie?","Did you see the movie","Did you watch the film?","Did you watch the film","Did you watch the movie?","Did you watch the movie"] ds=[]
- `m2-u2-past-simple-questions-tr-002` [translation, d5]: p="🇩🇪 War dein Bruder gestern krank?" c="Was your brother ill yesterday?" a=["Was your brother ill yesterday?","Was your brother ill yesterday","Was your brother sick yesterday?","Was your brother sick yesterday"] ds=[]
- `m2-u2-past-simple-questions-sb-001` [sentence-building, d2]: p="Put the words in the correct order: you / did / for / what / have / lunch / ?" c="What did you have for lunch?" a=["What did you have for lunch?","What did you have for lunch"] ds=[]
- `m2-u2-past-simple-questions-mt-001` [matching, d3]: p="Match the question beginnings with the correct endings:\n1. Did you play\n2. Was she\n3. Were they\n4. Did he eat\n\na. at the party last night?\nb. football after school?\nc. his breakfast this morning?\nd. happy about the result?" c="{\"1\":\"b\",\"2\":\"d\",\"3\":\"a\",\"4\":\"c\"}" a=["{\"1\":\"b\",\"2\":\"d\",\"3\":\"a\",\"4\":\"c\"}"] ds=[]
- `m2-u2-past-simple-questions-cp-001` [context-picker, d2]: p="Your friend tells you about the weekend. Which sentence is a correct past simple question?" c="Did your brother play football on Saturday?" a=["Did your brother play football on Saturday?"] ds=["Does your brother played football on Saturday?","Did your brother played football on Saturday?","Your brother did play football on Saturday?"]

### `g2u02.s.why-because` — why - because (why - because (Gründe nennen))

Asking for reasons with why and giving reasons with because.

v1 floor for this structure: **0 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [why-asks-reason]: Use why to ask for a reason and answer with because + reason.
  - DE: Mit why fragst du nach dem Grund. Du antwortest mit because + Grund.
  - "Why do you want another T-shirt? - Because I don't like this one." — "Warum willst du noch ein T-Shirt? - Weil mir dieses nicht gefällt."
  - "Why do you like PE? - Because sport is cool." — "Warum magst du Turnen? - Weil Sport cool ist."
- rule [because-clause]: After because comes a full clause with subject + verb in normal word order.
  - DE: Nach because folgt ein ganzer Satz mit Subjekt + Verb in normaler Wortstellung.
  - "Why is that not possible? - Because I put it in the washing machine." — "Warum ist das nicht möglich? - Weil ich es in die Waschmaschine gesteckt habe."

common errors:
- German verb-final word order after because (L1 transfer): ✗ "Because sport cool is." → ✓ "Because sport is cool."
- Dropping the auxiliary do in why-questions: ✗ "Why you want another T-shirt?" → ✓ "Why do you want another T-shirt?"

SB box `g2/sb/More 2 SB Unit 2.txt#grammar-1` — ▶️ Past simple negation (revision):
```
I didn’t listen to a thing.
 I didn’t know Clare liked Joe.
Wichtig: Kein did oder didn’t mit was/were!
 The jacket wasn’t on the screen.
 The roses weren’t on the jacket.
▶️ Past simple questions
Did you like the dumplings?
 Did you have a good day at school?
Wichtig: Kein did oder didn’t mit was/were!
 Was Chloe embarrassed?
 Were there any dumplings left on the floor?
🔍 Complete. Write did or didn’t.
 So bildest du die Verneinung im Past simple: Person + 1. _______________ + Grundform des Verbs
 So bildest du Fragen im Past simple: 2. _______________ + Person + Grundform des Verbs
▶️ More irregular verbs
 buy – We bought a big box of chocolates.
 know – He knew it was wrong.
 make – Jacob made a terrible mistake.
 write – I wrote an email to the kids.
▶️ why – because
Why do you want another T-shirt? – Because I don’t like this one.
Why is that not possible? – Because I put it in the washing machine.
Why do you like PE? – Because sport is cool.
📘 Now go back to page 16. Check ✅ with a partner what you know / can do.
```

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Carla, Castle, Chester, Chichen, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Disneyland, Doctor, Doctors, Don, Dragon, Elisabeth, Ellie, Emergency, Emma, Encouraging, England, English, European, Every, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Grey, Greybeard, Groans, Guess, Hammond, Harris, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Leah, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Mayan, Mei, Mexico, Michael, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Nibbs, Nice, Nick, Nomen, North, Number, Numbers, Object, Objekte, Oliver, Olivia, Omar, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rose, Rosie, Sally, Sam, Samuel, Sandra, Sara, Saying, School, Scotland, Sean, Sherlock, Sicily, Smith, Sophia, Sophie, States, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, True, Turan, Uhr, Um, United, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 2.txt -----
Unit 2 How embarrassing!
Page 16–17
UNIT 2
 How embarrassing!
At the end of unit 2 …
you know
14 adjectives
how to use the past simple negation (revision)
how to form past simple questions
how to use why and because
you can
understand posts and stories about embarrassing situations
understand a leaflet
understand a webpage about online safety
express and give reasons for your opinion
ask and answer questions about the past
write a picture story
READING
1 CHOICES
A Read Alan’s story quickly. Who’s Mr Harris?
b Read again and match the answers to the questions. There is one extra answer.
What did Alan’s class plan for their teacher?
What did they want to give him?
What did Alan write in his email?
What mistake did he make?
☐ He sent the email to Mr Harris, too.
 ☐ A big box of chocolates.
 ☐ He made a mistake.
 ☐ He wrote, “The party is a surprise. So don’t tell him!”
 ☐ They planned a surprise party.
The party that wasn’t a surprise
 (by Alan S., 12)
At the end of the last school year, my friends and I wanted to organise a surprise party for Mr Harris, our English teacher. He had a job at a new school. So we wanted to say thank you and goodbye. We made a big cake and we bought a big box of chocolates, too.
Two days before the party, I wrote an email to the kids from my class. I said, “Don’t forget! The party for Mr Harris is a SURPRISE! So don’t tell him!” Then I pressed SEND.
 The next day at school my friends told me about my mistake. I had sent* the email to them and I had sent it to Mr Harris, too!
VOCABULARY: had sent – hatte geschickt
B Read Sophia’s story quickly. Who’s Mr Jefferson?
Online lessons
 (by Sophia M., 13)
It was another online lesson. For half an hour, my geography teacher talked on my computer. I didn’t listen to a thing. I was bored, so I switched on my mobile phone and called David. “Guess what, Sophia,” he said. “Clare and Joe went to the cinema together.” “No way!” I said. “When was that?” “Yesterday. In the evening,” David said. “I didn’t know Clare liked Joe,” I shouted.
Suddenly Mr Jefferson said, “Very interesting Sophia, but we’re talking about the Brazilian rainforest.”
 Oh no – my microphone was on. Everybody could hear my conversation with David. I could hear other kids say, “Come on, tell us more.” And the teacher said, “No, don’t. Turn off your phone and listen to the lesson.” I quickly said sorry, and switched off my mobile phone. How embarrassing!
b Read Sophia’s story again and answer the questions.
What lesson was Sophia in?
 ……………………………………………………………
Who is David?
 ……………………………………………………………
What was the lesson about?
 ……………………………………………………………
Why was Sophia embarrassed?
 ……………………………………………………………
2 Look at the leaflet and answer the questions.
(Image of sculpture covered in dark fabric, like a jacket, with text)
Anthony Parsons – My life
 An exhibition of work from the South African artist
 May 20th – June 20th
 Admission fee: £5 adults £3 children
Who is Anthony Parsons?
 ……………………………………………………………
How long is the exhibition on?
 ……………………………………………………………
How much does it cost for two adults and two children to see the exhibition?
 ……………………………………………………………
LISTENING
3 a Listen to the story Modern art. How much was the sculpture worth?
☐ £5,000  ☐ £50,000  ☐ £500,000
b Listen to the story again and circle T (True) or F (False).
Mrs Smith had a new job in a shop.    T / F
The director went to check on Mrs Smith’s work.    T / F
The floor was still dirty.    T / F
Part of the modern sculpture was missing.    T / F
The jacket with five roses was missing.    T / F
The jacket with the roses was part of a sculpture.    T / F
(Image description: Cartoon of a museum scene. A cleaner with a mop is standing next to a sculpture pedestal with part of the exhibit gone. A manager looks shocked while museum visitors look on.)
SPEAKING
 Expressing your opinion
4 Work in pairs. Think of the stories in 1 and 3. Who do you think said these things?
“What an old jacket!”
“Oh no. I didn’t take out his address.”
“We can hear everything you are saying.”
“What’s the matter? You look upset.”
“There’s something missing here.”
“I thought she liked Joe.”
I think Alan / Sophia / Sophia’s teacher / the cleaning lady / the director of the museum said “…”.
(Image: A boy and girl sit at a table, discussing and pointing at something. Speech bubbles above them model sentence structures for the speaking task.)
Page 18–19
READING
5 Work in pairs. Read and write two more rules for staying safe online.
RULES FOR STAYING SAFE ONLINE
Don’t open attachments you don’t know.
.................................................................................................................
.................................................................................................................
6 Read the webpage. Does it mention any of your ideas?
ONLINE DOS AND DON’TS
Why was 14-year-old Jacob so upset when he opened the door of his house? Because there were about a hundred young people in the garden for his birthday party. Some of them he knew. Most of them he didn’t know.
Why were they there? Because Jacob posted his invitation online. But why did so many people turn up? Because Jacob didn’t check who could see his post. So not only his real friends turned up, but also friends of his friends.
Jacob was lucky because one of his neighbours called the police and the people went away. The garden was a mess, but the house was fine.
Jacob made a terrible mistake. Jacob isn’t the only one to make such a mistake. There are lots of stories about something going wrong because of wrong behaviour on the web. So here are some important tips for when you go online:
Think before you post something and check who can see it.
Think about what you write or what sort of pictures you send. You never know how many people can read your text or look at the picture. Your best friend could send it on to his or her best friend and so on. Do you really want that?
Don’t give your passwords to anyone. And don’t post your real name and home address online.
When you hear something bad about someone, don’t pass it on to other people. Maybe it isn’t true.
When someone bullies you online, talk to an adult.
7 Match the answers to the questions.
Why were there lots of people in Jacob’s garden?
Why was Jacob upset?
Why was Jacob lucky?
Why is it a good idea to check who can see your postings?
Why is it not a good idea to give your password to other people?
Why is it a good idea to talk to an adult?
☐ Because a neighbour called the police.
 ☐ Because you don’t want everyone to know your plans.
 ☐ Because they can help when someone bullies you.
 ☐ Because he posted his invitation online.
 ☐ Because you don’t want other people to use it.
 ☐ Because lots of people turned up for his birthday.
DIALOGUE WORK
8 Listen to the dialogue. Then act it out.
Ellie: Dad?
 Dad: Yes, what is it?
 Ellie: Can you get me another T-shirt?
 Dad: Another T-shirt? Why’s that?
 Ellie: Because I don’t like the one I’m wearing.
 I want my extra-large white T-shirt with the flower on it.
 Dad: Because I put it in the washing machine.
 Ellie: And?
 Dad: Umm. I’m sorry I can’t give you that one.
 Ellie: Really? Why’s that not possible?
 Dad: Well, now it’s extra small and pink.
 Ellie: Oh, Dad. Not again!
(Image description: Cartoon of Ellie, a girl wearing a pink shirt with a flower, looking frustrated, and her dad explaining with a sheepish smile.)
SOUNDS RIGHT /w/
9 Listen and repeat.
Why and why and why!
 Why is it always why?
 Why not ask me when,
 or where or what or who?
 It’s something you could do.
(Image description: Cartoon of a boy with wide eyes asking “Why?” to a surprised adult.)
VOCABULARY
 Adjectives
10 a Write an example for each of these categories.
a TV series / show – ..................................................
a school subject – ..................................................
a pop group / singer – ..................................................
a book – ..................................................
b Look at the adjectives in the box. What do they mean? You can also ask your teacher.
Box of adjectives:
 exciting interesting boring confusing silly
 fun funny great too long scary awesome
 cool difficult
Speech bubble:
 “What does ... mean?”
SPEAKING
 Giving reasons for your opinion
11 Work in pairs. Talk to your partner about the things in 10. Make short dialogues. Use words from the box in exercise b.
A: Do you like PE?
 B: Yes, I do.
 A: Why do you like it?
 B: Because sport is cool.
A: Do you like The Voice?
 B: No, I don’t.
 A: Why not?
 B: Because it’s boring.
A: Do you like ...
 B: ...
Page 20–21
TIME FOR A SKETCH
 Mrs Wu’s dumplings
12 Read the sketch. How many dumplings does Chloe get?
Scene 1
 Mei arrives home from school with her friend Chloe.
Mei
 Hi, Mum. I’m home.
Mrs Wu
 Hi, Mei. Did you have a good day at school?
Mei
 It was OK.
Mrs Wu
 And who’s this?
Mei
 Mum, this is my friend Chloe. We’re going to do our homework together.
Mrs Wu
 Hello, Chloe. I’m Mei’s mum.
Chloe
 Hello, Mrs Wu.
Mrs Wu
 Now, did you two eat on the way home from school?
Mei
 No, Mum.
Mrs Wu
 You go and start your homework. I’m going to make some dumplings.
Mei
 Thanks, Mum. Call us when they’re ready.
(Image description: Chloe and Mei arrive at a cozy living room. Mrs Wu is in the background preparing food in the kitchen.)
Scene 2
 The girls are sitting at the table. The mother is serving them two dumplings each on a plate.
Chloe
 These smell delicious, Mrs Wu. What are they?
Mrs Wu
 Meat dumplings.
Mei
 My favourite. Thanks, Mum.
 Chloe, you’re going to love these.
Chloe
 Umm … Did you say meat?
Mei
 Yes, meat. The best.
Chloe
 Um … OK. Can I have a glass of water, please?
Mei
 Of course you can. I’ll get you one.
While Mei is away, Chloe puts the dumplings in her jacket pocket.
Mei
 Here you are, Chloe … Wow! You were hungry. Did you like them?
 Do you want some more? What a silly question – Mum …
Chloe
 No really, it’s fine. I’m not …
Mrs Wu
 Yes, Mei?
Mei
 Any more dumplings for Chloe?
Mrs Wu
 Of course. Here are two more dumplings.
Mei
 Thanks, Mum.
Chloe
 Umm … thanks, Mrs Wu.
 Mei, could I have another glass of water?
(Image description: Chloe nervously places the dumplings into her jacket pocket while Mei walks away. Later, Mrs Wu brings another plate of dumplings.)
Scene 3
 The girls are upstairs in Mei’s bedroom.
Chloe
 So, let’s start with the homework, Mei.
 Oh, who’s this?
Mei
 That’s my dog, Rosie.
 Rosie, come here. Leave Chloe alone.
 Wow, she really likes you.
Chloe
 Yes, she does. Down Rosie. Down girl.
Mei
 I mean she REALLY likes you. Rosie! Rosie! Oh Chloe.
 I’m sorry. What did Rosie do to your jacket?
Chloe
 It’s OK. It doesn’t matter.
Mei
 And why are there dumplings on the floor?
Chloe
 Oh Mei. I’m so embarrassed. I’m a vegetarian. I don’t eat meat. I didn’t want to upset your mum, so I put the dumplings in my pocket.
Mei (laughing)
 That is so funny.
Chloe
 I’m so embarrassed. Please don’t say anything to your mum.
Mei
 Don’t worry. Your secret is safe with me – and Rosie. (laughing)
(Image description: Chloe and Mei are laughing in the bedroom. Rosie the dog is playing with Chloe’s jacket, and dumplings have fallen on the floor.)
13 How many of these tasks can you do?
Circle T (True) or F (False).
Mei had a bad day at school.    T / F
Mei and Chloe are school friends.    T / F
The girls had some food on the way home from school.    T / F
Complete the sentences with one word.
Mrs Wu gives the girls meat _____________.
Chloe asks for a glass of _____________.
Chloe doesn’t _____________ the dumplings.
Answer yes or no. Give reasons.
Was Chloe embarrassed?
 ………………………………………………………………………
Is Mei going to tell her mum?
 ………………………………………………………………………
Were there any dumplings left on the floor in the end?
 ………………………………………………………………………
14 Now listen to the sketch. Then act it out in class.
SPEAKING
 Asking questions about the past
15 Ask your partner questions about the story.
 You can use the verbs in the box.
Verbs in the box:
 arrive eat do cook like say have
Page 22–23
WRITING
 16 CHOICES
A Look at the pictures. Write a story (30–40 words). You can use the words below to help you.
This morning, Tom was …
 He looked … and saw …
 He ran …
 His friends … because … slippers*.
VOCABULARY: slippers – Hausschuhe
(Image description for A:
 Picture 1: Tom is asleep in bed.
 Picture 2: Tom looks at the clock, then hurries out of the house in his pyjamas.
 Picture 3: He runs to school and sees a bus.
 Picture 4: His classmates laugh because he forgot to change out of his slippers.)
B Look at the pictures.
 Write a story (70–80 words). Add a good title.
(Image description for B:
 1: A girl is reading in bed with the lights on.
 2: She falls asleep.
 3: She dreams of riding a horse in a desert-like setting.
 4: She wakes up startled.)
GRAMMAR
▶️ Past simple negation (revision)
I didn’t listen to a thing.
 I didn’t know Clare liked Joe.
Wichtig: Kein did oder didn’t mit was/were!
 The jacket wasn’t on the screen.
 The roses weren’t on the jacket.
▶️ Past simple questions
Did you like the dumplings?
 Did you have a good day at school?
Wichtig: Kein did oder didn’t mit was/were!
 Was Chloe embarrassed?
 Were there any dumplings left on the floor?
🔍 Complete. Write did or didn’t.
 So bildest du die Verneinung im Past simple: Person + 1. _______________ + Grundform des Verbs
 So bildest du Fragen im Past simple: 2. _______________ + Person + Grundform des Verbs
▶️ More irregular verbs
 buy – We bought a big box of chocolates.
 know – He knew it was wrong.
 make – Jacob made a terrible mistake.
 write – I wrote an email to the kids.
▶️ why – because
Why do you want another T-shirt? – Because I don’t like this one.
Why is that not possible? – Because I put it in the washing machine.
Why do you like PE? – Because sport is cool.
📘 Now go back to page 16. Check ✅ with a partner what you know / can do.
THE STORY OF THE STONES 1
 ▶️ It’s only a dream
1 Match the names to the characters.
Darkman Sarah Sunborn Daniel Emma
(Images of five cartoon characters numbered 1–5)
2 Watch episode 1 and complete the sentences with the names from 1.
……………………………………… makes a promise.
……………………………………… has three dreams about Darkman.
……………………………………… dreams she is on a rope.
……………………………………… says they have to speak to Sunborn.
……………………………………… thinks Darkman is dead.
3 Write a message to Sunborn from the children.
.............................................................................................................................................
 .............................................................................................................................................
 .............................................................................................................................................
 .............................................................................................................................................
EVERYDAY ENGLISH
▶️ 4 Watch episode 1 again. Complete the sentences with the words in the box.
Box:
 I mean  Oh, come on  I promise
(Comic strip with three scenes)
Daniel: Yeah, let’s get in touch with her.
 Sarah: 1. “……………………………”
 They’re only dreams.
Darkman: I’ll get them.
 2. “…………………………….”
 ……………………………..
Daniel: It’s the third time this week.
 Sarah: Me too.
 3. “……………………………,”
 I have almost the same dream.


----- WB: More 2 WB Unit 2.txt -----
UNIT 2 How embarrassing!
Pages 12–13
UNDERSTANDING VOCABULARY
Adjectives
1 Find the adjectives in the word snake and write them in your exercise book.
Word snake (colorful text arranged in a winding shape):
 exciting | awesome | boring | interesting | funny | useful | cool | sad | poor | great | bad | long | confusing | scary | difficult | silly
(Surrounding images: Several emoji-style smiley faces with different expressions indicating emotions like happiness, boredom, confusion, etc.)
2 Read the dialogues and choose the correct words.
A Why don’t you play Mario Kart with me?
 B Because I think the game’s cool / silly.
A Do you like the new fantasy series?
 B Yes, I do. I think it’s awesome / too long.
A Can you help me with my science project?
 B No, I can’t. I think it’s too difficult / funny for me.
A Why don’t you like horror stories?
 B Because they are scary / interesting.
A What do you think of the new TV series on Monday?
 B I don’t really understand it. I think it’s great / confusing.
USING VOCABULARY
Adjectives
3 Complete the sentences with the correct words in the box.
Word box:
 difficult | confusing | boring | silly | scary | awesome
A Why don’t you come to the garden party with me?
 B Because those parties are always very boring.
  I don’t want to fall asleep there.
A Look at the twins. I never know who is Carina and who is Julie.
 B I know, I know. And they wear the same clothes, too. I think it’s very confusing.
A What do you think of the Hobbit movies?
 B I really like them. I think they’re awesome.
A Do you want to come to the cinema with me? They’re showing a horror film.
 B The one about the children in the house in the woods? No, thank you, that’s too scary for me.
A Why don’t we play that new computer game? It’s really exciting.
 B What? Shooting aliens all the time? I think it’s silly and I don’t want to play it.
A Do you like maths?
 B I do, but sometimes I find it very difficult.
UNDERSTANDING GRAMMAR
why – because
4 Match the questions and answers.
Why are you late?
Why did you tell her our secret?
Why did you get a cat?
Why is he so happy?
Why did you buy a new laptop?
Why are you taking a sweater?
Why is he so angry?
Why did the police visit him?
Answer options (random order):
 ☐ Because my mum also likes pets.
 ☐ Because I missed my bus.
 ☐ Because his football team didn’t win.
 ☐ Because my old one hasn’t got a webcam.
 ☐ Because he got an ‘A’ in the test.
 ☐ Because she’s my friend.
 ☐ Because they think he’s a thief.
 ☐ Because it’s going to be cold tonight.
VOCABULARY: thief (pl thieves) = Dieb/Diebin
USING GRAMMAR
why – because
5 Look at the pictures and write sentences with because. Use the words in the box.
Word box:
 phone him | go to the doctor | have a cold* | see a face at the window | have a cut knee | stay in bed | be happy | be scared
Image 1: A boy smiling in front of a girl holding a card.
 Sentence: 1. He was happy because …
Image 2: A frightened boy seeing something at the window.
 Sentence: 2. ........................................................................
Image 3: A boy in bed looking sick.
 Sentence: 3. ........................................................................
Image 4: A girl in hospital with an injured knee.
 Sentence: 4. ........................................................................
VOCABULARY: have a cold = eine Erkältung haben
6 Read and complete the answers.
Teacher: Why are you late?
 Student: Because 1. ........ I missed the school bus.
Teacher: Why did you miss the school bus?
 Student: Because 2. ...............................................
Teacher: Why did you get up late?
 Student: Because 3. ...............................................
Teacher: Why didn’t you hear your alarm clock?
 Student: Because 4. ...............................................
Teacher: Why were you so tired?
 Student: Because 5. ...............................................
Teacher: Why did you go to bed late?
 Student: Because 6. ...............................................
Teacher: Why did you have a lot of homework?
 Student: That’s a very good question. Why did you give us so much homework?
Pages 14–15
7 Use your own ideas to answer the questions.
Why did you buy me this present?
  Because I wanted to make you happy.
  .........................................................................................................................................
Why did you turn off the TV?
  .........................................................................................................................................
Why didn’t you go to school?
  .........................................................................................................................................
Why didn’t you eat breakfast?
  .........................................................................................................................................
Why are you so tired today?
  .........................................................................................................................................
Why haven’t you got any money?
  .........................................................................................................................................
8 Complete the why-questions.
........................................................... late for school? – Because our bus was late.
........................................................... finish your homework? – Because I was too tired.
........................................................... phone me? – Because my phone didn’t work.
........................................................... an email? – Because I forgot.
........................................................... by car? – Because it was too wet to walk.
........................................................... any water? – Because my sister drank it all.
UNDERSTANDING GRAMMAR
Past simple negation (revision)
9 Complete the text with the words in the box.
Word box:
 went | didn’t go | didn’t find | found | took | didn’t take | didn’t
Text:
 Bill Gunn and Tony Bull stole money from the bank last night.
 They went to the bank and broke a window.
 They found the money from the safe and put it in bags. Then they jumped out of a window. They didn’t go out through the door because they didn’t find the key. But Bill took the bags with him! The police found the thieves, but they didn’t take the money.
VOCABULARY: through – durch
Image description (right of the text):
 Two burglars wearing masks and hats are shown sneaking outside a bank at night. One holds a flashlight and a bag of money. The bank window is broken. A police car can be seen in the distance.
10 Rewrite the sentences. Make them negative.
I enjoyed the show.
  I didn’t enjoy the show.
Paul went to school today.
  .......................................................................................................................
The dogs chased the cat.
  .......................................................................................................................
Lana took Owen’s milk.
  .......................................................................................................................
The children played computer games all morning.
  .......................................................................................................................
USING GRAMMAR
Past simple negation (revision)
11 Complete the sentences with the past simple form of the verbs in brackets.
Sue went on holiday, but she didn’t send me a postcard. (go / not send)
We .......................................................... the film because we .......................................................... late at the cinema. (not see / arrive)
Billy .......................................................... anything because he .......................................................... hungry. (not eat / not be)
I .......................................................... you because I .......................................................... your number. (not phone / lose)
I .......................................................... the film, but I .......................................................... the book. (see / not read)
Jessie .......................................................... me to her party, but I .......................................................... . (invite / not go)
We .......................................................... anything because there .......................................................... nothing in the fridge. (not cook / be)
The band .......................................................... until midnight, but we .......................................................... to the end. (play / not stay)
12 Complete the message with the past simple form of the verbs in brackets.
Message in pink box:
Hi Simone,
 I 1 .......................................................... (not phone) you, because the phone 2 .......................................................... (not work).
 And I 3 .......................................................... (not send) you an email, because the internet 4 .......................................................... (not work).
 And I 5 .......................................................... (not buy) you a present, because I 6 .......................................................... (not have) any money.
 And I 7 .......................................................... (not get) you any chocolate, because I 8 .......................................................... (not know) which chocolate you like. So I 9 .......................................................... (not go) to your party and I 10 .......................................................... (not make) a birthday cake for you.
 But happy birthday anyway!
 Love,
  Rose
UNDERSTANDING GRAMMAR
Past simple questions
13 Match the questions and answers.
Did you go to Jim’s party?
Did you go away for your holidays?
Did it rain yesterday?
Did Ahmet like his present?
Did Leila ride her bike to school?
Did they say anything?
Did the teacher give us homework?
Did the dog break the vase?
Answer options (random order):
 ☐ Yes, it did and I’m not very happy with it.
 ☐ Yes, it did. All day!
 ☐ No, they didn’t. Not a word.
 ☐ Yes, she did. Lots of it.
 ☐ No, we didn’t. We stayed at home.
 ☐ Yes, I did. I danced a lot.
 ☐ No, she didn’t. Her dad took her in the car.
 ☐ Yes, he did. He loved it.
Pages 16–17
14 Choose the correct question words.
1 A Where / Why / Who did you go on holiday?
  B I went to New York.
2 A Where / Why / Who did you go there?
  B I wanted to visit all the famous places.
3 A Where / Why / Who did you go with?
  B My parents.
4 A Where / Why / Who did you stay?
  B In a hotel opposite Central Park.
5 A Where / Why / Who didn’t you send me a postcard?
  B I was too busy. Sorry.
Image (right of questions):
 A photo of a large city skyline (New York), with trees and a body of water in the foreground. Central Park is clearly visible.
USING GRAMMAR
Past simple questions
15 Complete the questions and the short answers.
1 A ______ Did ______ they ______ arrive ______ after midnight? (arrive)
  B Yes, ______ they did ______ .
2 A No, ................................................................. you ................................................................. your trip? (enjoy)
3 A No, ................................................................. your parents ................................................................. with you? (go)
4 A Yes, ................................................................. you ................................................................. a lot? (swim)
5 A Yes, ................................................................. you ................................................................. by bus? (go)
6 A No, ................................................................. she ................................................................. you a postcard? (write)
7 A No, ................................................................. they ................................................................. the hotel? (like)
8 A No, ................................................................. your mum ................................................................. a lot? (talk)
16 Answer the questions so they are true for you.
Who was the first person you saw yesterday?
  ...................................................................................................................
Did you go to school yesterday?
  ...................................................................................................................
What did you do in the evening?
  ...................................................................................................................
Did you phone any friends yesterday?
  ...................................................................................................................
Where did you spend most time yesterday?
  ...................................................................................................................
Did your best friend phone you yesterday?
  ...................................................................................................................
Did you watch TV last night?
  ...................................................................................................................
Was yesterday a good day?
  ...................................................................................................................
Why was it (not) good?
  ...................................................................................................................
READING
Understanding texts about embarrassing situations
17 CHOICES
A
Put the sentences in order to make a summary of the story Online lessons on page 16 in the Student’s Book.
Online lessons
 ☐ Sophia saw that her microphone was on.
 ☐ All the other students wanted to know more about Clare and Joe.
 ☐ She called her friend David.
 ☐ Mr Jefferson told her to turn off her phone.
 ☐ Sophia was doing an online lesson. She was bored.
 ☐ They talked about their friends Clare and Joe.
 ☐ Mr Jefferson interrupted* their conversation.
 VOCABULARY: interrupt – unterbrechen
Illustration: A girl sits in front of her laptop with earphones on during an online lesson. Multiple pop-up windows show her classmates and teacher. She looks surprised or embarrassed.
B
Separate the sentences and put them in order to make two summaries of the stories on pages 16 and 17 in the Student’s Book. Write both texts in your exercise book.
The party that wasn’t a surprise
 Illustration: A boy looks shocked as he reads something on his laptop, while holding a party invitation. A party banner and decorations are in the background.
Modern art
 Illustration: A man stands in a museum near a sculpture and cleaning supplies. A cleaning lady is nearby with a mop and bucket, looking confused.
Sentences (for both stories):
Two days before the party he wrote to his friends.
One day, the director told her to clean a room on the first floor.
He had sent the email to Mr Harris, too.
“Those old roses?” she answered. “I threw them away.”
The email said: “Don’t forget! The party for Mr Harris is a SURPRISE.”
“Where are the roses from the sculpture?” asked the director.
The next day, Alan’s friends told him about his mistake.
Alan and his friends wanted to organise a surprise party for their teacher Mr Harris.
Two hours later, the director went upstairs to check on her work.
The windows were clean, but part of a modern sculpture was missing.
Caroline Smith was a cleaning lady in a museum of modern art.
He pressed “Send”.
Pages 18–19
18 a Read the dialogue. Then match the underlined words to the pictures.
Leonie: Charles, have you got the plane tickets?
 Charles: Of course I’ve got them.
 Leonie: And have you got your passport?
 Charles: Of course I’ve got it. Have you got your passport?
 Leonie: Yes. Did you call a taxi?
 Charles: Of course I did. It’s going to pick us up in ten minutes.
 Leonie: And did you pack your warm clothes?
 Charles: No, Leonie, I didn’t. We’re going to Sicily. It’s hot there.
 Leonie: Maybe the nights are cold.
 Charles: Maybe. But I’m not going to the airport in my sweater.
 Leonie: OK. Let’s go, the taxi’s waiting.
(An hour later at the airport.)
 Leonie: Charles, can you check in our luggage?
 Charles: Of course.
 Leonie: And Charles? I want a window seat.
 Charles: Sure. There’s only one problem, Leonie.
 Leonie: What is it?
 Charles: I’m looking at our tickets.
 Leonie: And?
 Charles: And — our flight is tomorrow!
Match underlined words to the pictures:
A – plane tickets
 B – taxi
 C – luggage
 D – window seat
 E – warm clothes
 F – Sicily
 G – passport
 H – sweater
 I – airport
 J – airport window showing the wing of a plane
b Read the dialogue again. Circle T (True) or F (False).
Charles can’t find the tickets. T / F
Charles has got his passport. T / F
Leonie can’t find her passport. T / F
Charles called a taxi. T / F
They are going to Sicily. T / F
It’s always cold there. T / F
Leonie wants a window seat. T / F
They are too late for their flight. T / F
WRITING
Writing about an embarrassing situation
19 Write a dialogue (80–120 words) between two children who are dressed up for a fancy dress party.
Think about the following:
What kind of party is it really?
Who is invited?
When is it?
Why is it an embarrassing situation?
Image below: Two children in fancy dress — one in a pink astronaut costume with a helmet, the other as a blue alien with antennas, big round eyes, and a shiny jumpsuit. They look confused.
LISTENING & DIALOGUE WORK
Asking/Answering questions about the past
20 a Listen and write the names under the postcards.
Names: Rohan, Carla, Oliver
🇬🇧 (Postcard with Big Ben, double-decker bus, and London Eye)
🇫🇷 (Postcard with Eiffel Tower and French flags)
🇪🇬 (Postcard with the Pyramids of Giza and camel riders)
b Listen again and complete the table.
	Rohan	Carla	Oliver
How long did you stay?	……………………..	……………………..	……………………..
How did you get there?	……………………..	……………………..	……………………..
Who did you go with?	……………………..	……………………..	……………………..

21 CHOICES
A Match the questions and answers. Then listen and check.
Did you have a good holiday, Ruth?
Did you go to New York?
What did you do there?
Who did you go with?
How did you get there?
And how long did you stay there?
a. No, we went to San Francisco.
 b. Mum and Dad and my two sisters.
 c. By plane.
 d. A month.
 e. Yes, I had a great time. I went to America.
 f. The usual things. We saw the sights, ate some great food and walked a lot.
B Complete the questions.
Interviewer: Did 1. ……………………, David?
 David: I really liked the museums and walking around in Brooklyn.
 Interviewer: Did 2. ……………………, too?
 David: Yes, I had a great time. I went to New York.
 Interviewer: Did 3. ……………………, anything interesting?
 David: Yes, I saw a lot.
 Interviewer: What 4. ……………………, best?
 David: I liked it a lot.
 Interviewer: And what about 5. ……………………,?
 David: Mum and my two sisters.
 Interviewer: What about 6. ……………………,?
 David: Dad couldn’t go, he had to work.
 Interviewer: How long 7. ……………………,?
 David: Not long enough.
Page 20
MORE Words and Phrases
English	Example sentence	German
online safety	You can find helpful tips for online safety on this website.	Internetsicherheit
opinion	I always say my opinion.	Meinung
webpage	Go online and read the webpage.	Internetseite

🔵 1
 | to organise | I want to organise a surprise party for her birthday. | organisieren |
 | surprise party | They planned a surprise party. | Überraschungsparty |
🔵 2
 | admission fee | The admission fee to enter the museum is 5 pounds. | Eintritt, Eintrittspreis |
 | artist | He made this painting. He’s a great artist. | Künstler/Künstlerin |
 | exhibition | I’m going to see the new exhibition at the museum. | Ausstellung |
🔵 3
 | dirty | The floor was very dirty after the party. | dreckig, schmutzig |
 | modern | The modern sculpture was missing. | modern |
 | museum | She works in a museum. | Museum |
 | to be part of | The jacket was part of a sculpture. | Teil von etw. sein |
 | sculpture | The sculpture is huge. | Skulptur |
 | to be worth | The sculpture was worth a lot of money. | wert sein |
🔵 4
 | What’s the matter? | What’s the matter? You look upset. | Was ist los? |
🔵 6
 | anyone | Don’t give your computer password to anyone. | irgendjemand |
 | behaviour | There is a lot of wrong behaviour on the web. | Verhalten |
 | to contact | Please contact us if you have any questions. | kontaktieren |
 | mess | The garden was a mess. | Unordnung, Durcheinander |
 | to pass on | Please pass on the message to your mum. | weitergeben |
 | password | Don’t give your computer password to other people. | Passwort |
 | to post | Think before you post something. | posten, einen Beitrag verfassen (online) |
 | posting | Check who can see your posting. | Posting, Beitrag (online) |
 | such | He isn’t the only one to make such a mistake. | solch, so (ein) |
 | tip | Here is an important tip for when you go online. | Hinweis, Tipp |
🔵 8
 | possible | I can’t finish all this homework. It’s not possible. | möglich |
🔵 10
 | awesome | Sport is awesome! | großartig, beeindruckend |
 | boring | This film is very boring. I don’t want to watch it any more. | langweilig |
 | confusing | I don’t understand this exercise. It’s very confusing. | verwirrend |
 | difficult | I don’t think the text is difficult. It’s easy. | schwierig |
 | exciting | There’s an exciting film on TV this evening. | spannend, aufregend |
 | funny | That was funny. I laughed a lot. | lustig, komisch |
🔵 12
 | embarrassed | I was so embarrassed. I didn’t know what to say. | verlegen, beschämt |
 | plate | The waiter puts the plate down. | Teller |
 | secret | Your secret is safe with me. | Geheimnis |
 | upset | The little girl looked upset because she couldn’t have her favourite toy. | verärgert, aufgebracht |
🔵 16
 | to add | You should add a good title to the story. | hinzufügen |
🔵 S1
 | to fail | I didn’t want to fail the test, so I studied very hard. | scheitern; durchfallen |
 | I promise. | I’ll help you. I promise. | Ich verspreche es. |

```

## Output contract

Write `content/corpus/units/g2-u02/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u02",
  "briefBank": "ad9510a3c2c7",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u02.s.irregular-verbs",
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
