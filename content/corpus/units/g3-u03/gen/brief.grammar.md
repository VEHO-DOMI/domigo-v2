# Grammar generation brief — g3-u03 (MORE! 3, Unit 3)

<!-- domigo:gen grammar g3-u03 bank=92c8a1d10f8d prompt=4b9164076103 -->

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

### `g3u03.s.it-takes` — It takes ... to (take time to do) (It takes ... to (Zeitdauer ausdrücken))

The fixed pattern it + take + person + time + to + verb for saying how long an activity lasts. Taught in the same unit-3 box as the time connectors but as a separate construction.

v1 floor for this structure: **39 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [it-takes-present]: Say how long something lasts with it + take(s) + person + time + to + the base verb. The subject is always it, never a person.
  - DE: Wie lange etwas dauert, sagst du mit it + take(s) + Person + Zeit + to + Grundform. Das Subjekt ist immer it, nie eine Person.
  - "It takes me twenty minutes to cycle there." — "Ich brauche zwanzig Minuten, um dorthin zu radeln."
  - "It only took us an hour and a half to fly there." — "Wir brauchten nur eineinhalb Stunden, um dorthin zu fliegen."
- rule [it-takes-past-question]: For the past use it took; ask how long with How long does/did it take (you) to ...?
  - DE: In der Vergangenheit verwendest du it took; nach der Dauer fragst du mit How long does/did it take (you) to ...?
  - "How long does it take you to get to school?" — "Wie lange brauchst du zur Schule?"
  - "How long did it take to fly there?" — "Wie lange hat der Flug dorthin gedauert?"

common errors:
- Missing to before the verb: ✗ "It takes me 20 minutes walk to school." → ✓ "It takes me 20 minutes to walk to school."
- Using a person as the subject instead of it: ✗ "I take 20 minutes to walk to school." → ✓ "It takes me 20 minutes to walk to school."
- Wrong tense of take in a past context: ✗ "It takes me two hours to get there yesterday." → ✓ "It took me two hours to get there yesterday."

SB box `g3/sb/More 3 SB Unit 3.txt#grammar-1` — when, before, after, while, during, until, by the time:
```
How to use it: You use when, before, after, while, during, until, by the time to talk about actions or events that happened at a certain time.
When some hippos blocked her way, she hit them with her umbrella.
 Mary returned to Africa before the Second Boer War broke out.
 After her travels, Mary wrote two bestsellers.
 While she was resting in her tent, she heard a noise outside.
 He stayed in the Royal Navy until 1810.
 By the time he was 25, Holman was completely blind.
Note the difference between while and during. After while you use a verb. After during you use a noun.
 While looking after her mother, she studied physics, chemistry, biology and maths on her own.
 During his lifetime, he travelled more than 400,000 km.
(Image description: Cartoon-style drawing of tourists lying on a beach. Behind them, a group of monkeys are joyfully raiding their picnic. Caption: “While the tourists were lying on the beach, the monkeys were having a feast.”)
take time to do
How to use it: If you want to say how long an activity lasts, then you use take time to do.
How to form it: it + take + person + time + to do, for example:
 It takes me twenty minutes to cycle there.
 It only took us an hour and a half to fly there.
➡️ Now go back to page 24. ✔ Check with a partner what you know / can do.
```

v1 seed items (UNTRUSTED):
- `m3-u3-it-takes-gf-001` [gap-fill, d1]: p="It ___ me twenty minutes to walk to school every day." c="takes" a=["takes"] ds=["take","needs","is taking"]
- `m3-u3-it-takes-gf-002` [gap-fill, d1]: p="It ___ us two hours to drive to Vienna last weekend." c="took" a=["took"] ds=["takes","taked","was taking"]
- `m3-u3-it-takes-gf-003` [gap-fill, d2]: p="It takes her an hour ___ finish her homework." c="to" a=["to"] ds=["for","at","—"]
- `m3-u3-it-takes-gf-004` [gap-fill, d3]: p="How long does ___ take you to get to school?" c="it" a=["it"] ds=["that","this","you"]
- `m3-u3-it-takes-gf-005` [gap-fill, d4]: p="It doesn't ___ long to learn this game." c="take" a=["take"] ds=["takes","took","taking"]
- `m3-u3-it-takes-gf-006` [gap-fill, d5]: p="It ___ (take) my dad three years to learn English when he was young." c="took" a=["took"] ds=["takes","was taking","has taken"]
- `m3-u3-it-takes-mc-001` [multiple-choice, d2]: p="Which sentence correctly describes the time needed to get to school?" c="It takes me thirty minutes to get to school." a=["It takes me thirty minutes to get to school."] ds=["I take thirty minutes to get to school.","It takes me thirty minutes get to school.","It needs me thirty minutes to get to school."]
- `m3-u3-it-takes-mc-002` [multiple-choice, d3]: p="Which question is correct?" c="How long does it take you to get ready in the morning?" a=["How long does it take you to get ready in the morning?"] ds=["How long does it take you get ready in the morning?","How long do you take to get ready in the morning?","How long it takes you to get ready in the morning?"]
- `m3-u3-it-takes-mc-003` [multiple-choice, d4]: p="Choose the correct sentence about a past event." c="It took them an hour to clean the house." a=["It took them an hour to clean the house."] ds=["It took them an hour clean the house.","They took an hour to clean the house.","It taked them an hour to clean the house."]
- `m3-u3-it-takes-ec-001` [error-correction, d2]: p="Find and fix the mistake: I take twenty minutes to get to school." c="It takes me" a=["It takes me","It takes me twenty minutes to get to school.","It takes me twenty minutes to get to school"] ds=[]
- `m3-u3-it-takes-ec-002` [error-correction, d3]: p="Find and fix the mistake: It takes me ten minutes walk to the bus stop." c="to walk" a=["to walk","It takes me ten minutes to walk to the bus stop.","It takes me ten minutes to walk to the bus stop"] ds=[]
- `m3-u3-it-takes-ec-003` [error-correction, d4]: p="Find and fix the mistake: It takes me two hours to got to my grandma's house yesterday." c="took" a=["took","It took","It took me two hours to get to my grandma's house yesterday.","It took me two hours to get to my grandma's house yesterday"] ds=[]
- `m3-u3-it-takes-tf-001` [gap-fill, d3]: p="A new student asks how long the journey to school is. Answer them: 'It ________ me ________ to get to school.'" c="takes ... 30 minutes" a=["takes ... 30 minutes","takes ... about half an hour","takes, 30 minutes"] ds=["took ... 30 minutes","take ... 30 minutes","is taking ... 30 minutes"]
- `m3-u3-it-takes-tf-002` [gap-fill, d3]: p="Your friend complains that homework is quick for everyone else. You explain your sister's situation: 'It ________ her two hours ________ her homework every day.'" c="takes ... to do" a=["takes ... to do","takes ... to finish","takes, to do"] ds=["took ... to do","take ... to do","is taking ... to do"]
- `m3-u3-it-takes-tf-003` [gap-fill, d5]: p="You're planning a dinner party and your friend asks about preparation time. Tell them: 'It ________ us about an hour ________ dinner.'" c="takes ... to cook" a=["takes ... to cook","takes ... to prepare","takes ... to make","takes, to cook"] ds=["took ... to cook","take ... to cook","is taking ... to cook"]
- `m3-u3-it-takes-tr-001` [translation, d2]: p="🇩🇪 Ich brauche zehn Minuten, um zur Schule zu gehen." c="It takes me ten minutes to walk to school." a=["It takes me ten minutes to walk to school.","It takes me ten minutes to walk to school","It takes me 10 minutes to walk to school.","It takes me 10 minutes to walk to school","It takes me ten minutes to get to school.","It takes me 10 minutes to get to school."] ds=[]
- `m3-u3-it-takes-tr-002` [translation, d4]: p="🇩🇪 Wie lange hast du gebraucht, um das Buch zu lesen?" c="How long did it take you to read the book?" a=["How long did it take you to read the book?","How long did it take you to read the book","How long did it take to read the book?","How long did it take to read the book"] ds=[]
- `m3-u3-it-takes-sb-001` [sentence-building, d1]: p="Put the words in the correct order: takes / it / minutes / me / ten / to / school / walk / to" c="It takes me ten minutes to walk to school." a=["It takes me ten minutes to walk to school.","It takes me ten minutes to walk to school"] ds=[]
- `m3-u3-it-takes-mt-001` [matching, d3]: p="Match each sentence beginning with the correct ending. 1: It takes me five minutes 2: It took us all day 3: How long does it take you 4: It doesn't take long" c="{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"b\"}"] ds=["a: to get to school?","b: to learn this song.","c: to brush my teeth.","d: to climb the mountain."]
- `m3-u3-it-takes-qf-001` [question-formation, d2]: p="It takes Lisa thirty minutes to cycle to school. Ask about: how long it takes Lisa." c="How long does it take Lisa to cycle to school?" a=["How long does it take Lisa to cycle to school?","How long does it take Lisa to cycle to school","How long does it take her to cycle to school?","How long does it take her to cycle to school"] ds=[]
- `m3-u3-it-takes-gf-020` [gap-fill, d1]: p="It ___ her about fifteen minutes to get dressed in the morning." c="takes" a=["takes"] ds=["take","needs","has"]
- `m3-u3-it-takes-gf-021` [gap-fill, d2]: p="It ___ the whole class thirty minutes to finish the test yesterday." c="took" a=["took"] ds=["takes","taked","has taken"]
- `m3-u3-it-takes-gf-022` [gap-fill, d2]: p="It takes me an hour ___ do my homework every day." c="to" a=["to"] ds=["for","that","of"]
- `m3-u3-it-takes-gf-023` [gap-fill, d3]: p="How long does it ___ you to cycle to school?" c="take" a=["take"] ds=["takes","took","taking"]
- `m3-u3-it-takes-gf-024` [gap-fill, d4]: p="It will ___ us about three hours to drive to the seaside." c="take" a=["take"] ds=["takes","took","taking"]
- `m3-u3-it-takes-gf-025` [gap-fill, d5]: p="It didn't ___ them very long to learn the new dance." c="take" a=["take"] ds=["takes","took","taken"]
- `m3-u3-it-takes-mc-020` [multiple-choice, d2]: p="Which sentence is correct?" c="It takes me ten minutes to walk to the bus stop." a=["It takes me ten minutes to walk to the bus stop."] ds=["It takes me ten minutes for walk to the bus stop.","It takes I ten minutes to walk to the bus stop.","It takes to me ten minutes to walk to the bus stop."]
- `m3-u3-it-takes-mc-021` [multiple-choice, d3]: p="Which sentence correctly talks about the past?" c="It took us two hours to finish the project." a=["It took us two hours to finish the project."] ds=["It taked us two hours to finish the project.","It takes us two hours to finish the project yesterday.","It was taking us two hours to finish the project."]
- `m3-u3-it-takes-mc-022` [multiple-choice, d4]: p="Which question is correct?" c="How long does it take you to get to school?" a=["How long does it take you to get to school?"] ds=["How long does it takes you to get to school?","How long it takes you to get to school?","How long takes it you to get to school?"]
- `m3-u3-it-takes-ec-020` [error-correction, d2]: p="Find and fix the mistake: It needs me twenty minutes to walk to school." c="takes" a=["takes","It takes me","It takes me twenty minutes to walk to school.","It takes me twenty minutes to walk to school"] ds=[]
- `m3-u3-it-takes-ec-021` [error-correction, d3]: p="Find and fix the mistake: It taked us a long time to find the restaurant." c="took" a=["took","It took us","It took us a long time to find the restaurant.","It took us a long time to find the restaurant"] ds=[]
- `m3-u3-it-takes-ec-022` [error-correction, d4]: p="Find and fix the mistake: It takes me thirty minutes for getting to school." c="to get" a=["to get","to get to school","It takes me thirty minutes to get to school.","It takes me thirty minutes to get to school"] ds=[]
- `m3-u3-it-takes-tf-020` [gap-fill, d3]: p="You're telling your pen pal about your daily routine. Complete: 'It ________ (take) me about five minutes ________ (brush) my teeth and wash my face.'" c="takes ... to brush" a=["takes ... to brush","takes...to brush"] ds=["took ... to brush","take ... to brush","is taking ... to brush"]
- `m3-u3-it-takes-tf-021` [gap-fill, d4]: p="You're telling your friend about last weekend's hiking trip. Complete: 'It ________ (take) us four hours ________ (reach) the top of the mountain.'" c="took ... to reach" a=["took ... to reach","took...to reach"] ds=["takes ... to reach","take ... to reach","was taking ... to reach"]
- `m3-u3-it-takes-tr-021` [translation, d4]: p="🇩🇪 Wie lange hast du gebraucht, um den Aufsatz zu schreiben?" c="How long did it take you to write the essay?" a=["How long did it take you to write the essay?","How long did it take you to write the essay"] ds=[]
- `m3-u3-it-takes-sb-020` [sentence-building, d2]: p="Put the words in the correct order: takes / it / to / me / half an hour / homework / do / my" c="It takes me half an hour to do my homework." a=["It takes me half an hour to do my homework.","It takes me half an hour to do my homework"] ds=[]
- `m3-u3-it-takes-sb-021` [sentence-building, d3]: p="Put the words in the correct order: long / did / it / how / take / you / to / there / get / ?" c="How long did it take you to get there?" a=["How long did it take you to get there?","How long did it take you to get there"] ds=[]
- `m3-u3-it-takes-mt-020` [matching, d3]: p="Match each beginning with its correct ending. 1: It takes me ten minutes 2: It took her two hours 3: It will take us a whole day 4: How long does it take you 5: It doesn't take long" c="{\"1\":\"c\",\"2\":\"e\",\"3\":\"a\",\"4\":\"b\",\"5\":\"d\"}" a=["{\"1\":\"c\",\"2\":\"e\",\"3\":\"a\",\"4\":\"b\",\"5\":\"d\"}"] ds=["a: to drive to Salzburg.","b: to get ready in the morning?","c: to walk to the bus stop.","d: to make a sandwich.","e: to finish the puzzle yesterday."]
- `m3-u3-it-takes-qf-020` [question-formation, d4]: p="Your new classmate lives far away. Ask how long it takes them to get to school. Start with: 'How long...'" c="How long does it take you to get to school?" a=["How long does it take you to get to school?","How long does it take you to come to school?","How long does it take you to travel to school?"] ds=[]

### `g3u03.s.time-connectors` — when, before, after, while, during, until, by the time (Zeitliche Verbindungswörter (when, before, after, while, during, until, by the time))

Time connectors that link actions and events to a point in time. The key contrast is while (followed by a verb/clause) versus during (followed by a noun), plus when, before, after, until and by the time.

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [when-before-after]: Use when, before, after and until + a clause (subject + verb) to say at what time something happened. before = earlier than, after = later than, until = up to the moment when.
  - DE: Du verwendest when, before, after und until + einen Satz (Subjekt + Verb), um zu sagen, wann etwas geschah. before = früher als, after = später als, until = bis zu dem Moment.
  - "When some hippos blocked her way, she hit them with her umbrella." — "Als ihr einige Nilpferde den Weg versperrten, schlug sie sie mit ihrem Regenschirm."
  - "After her travels, Mary wrote two bestsellers." — "Nach ihren Reisen schrieb Mary zwei Bestseller."
- rule [while-vs-during]: After while you use a verb (a clause); after during you use a noun. They are not interchangeable.
  - DE: Nach while steht ein Verb (ein Satz), nach during steht ein Nomen. Sie sind nicht austauschbar.
  - "While she was resting in her tent, she heard a noise outside." — "Während sie in ihrem Zelt ruhte, hörte sie draußen ein Geräusch."
  - "During his lifetime, he travelled more than 400,000 km." — "Während seines Lebens reiste er mehr als 400.000 km."
- rule [by-the-time]: Use by the time + a clause to mean 'before/when' a later moment is reached - often suggesting something had already happened by then.
  - DE: Du verwendest by the time + einen Satz im Sinne von 'bis/als' ein späterer Zeitpunkt erreicht ist - oft mit der Bedeutung, dass bis dahin schon etwas geschehen war.
  - "By the time he was 25, Holman was completely blind." — "Als Holman 25 war, war er schon völlig blind."

common errors:
- Using during with a clause instead of while: ✗ "During I was sleeping, the phone rang." → ✓ "While I was sleeping, the phone rang."
- Using while before a noun instead of during: ✗ "While the storm, we stayed inside." → ✓ "During the storm, we stayed inside."
- Dropping parts of by the time: ✗ "By they arrived, it was dark." → ✓ "By the time they arrived, it was dark."

SB box `g3/sb/More 3 SB Unit 3.txt#grammar-1` — when, before, after, while, during, until, by the time:
```
How to use it: You use when, before, after, while, during, until, by the time to talk about actions or events that happened at a certain time.
When some hippos blocked her way, she hit them with her umbrella.
 Mary returned to Africa before the Second Boer War broke out.
 After her travels, Mary wrote two bestsellers.
 While she was resting in her tent, she heard a noise outside.
 He stayed in the Royal Navy until 1810.
 By the time he was 25, Holman was completely blind.
Note the difference between while and during. After while you use a verb. After during you use a noun.
 While looking after her mother, she studied physics, chemistry, biology and maths on her own.
 During his lifetime, he travelled more than 400,000 km.
(Image description: Cartoon-style drawing of tourists lying on a beach. Behind them, a group of monkeys are joyfully raiding their picnic. Caption: “While the tourists were lying on the beach, the monkeys were having a feast.”)
take time to do
How to use it: If you want to say how long an activity lasts, then you use take time to do.
How to form it: it + take + person + time + to do, for example:
 It takes me twenty minutes to cycle there.
 It only took us an hour and a half to fly there.
➡️ Now go back to page 24. ✔ Check with a partner what you know / can do.
```

v1 seed items (UNTRUSTED):
- `m3-u3-time-connectors-gf-001` [gap-fill, d1]: p="___ they were eating breakfast, the postman arrived." c="While" a=["While"] ds=["During","When","Until"]
- `m3-u3-time-connectors-gf-002` [gap-fill, d1]: p="We stayed inside ___ the storm." c="during" a=["during"] ds=["while","when","before"]
- `m3-u3-time-connectors-gf-003` [gap-fill, d2]: p="___ she left the house, she checked that all the windows were closed." c="Before" a=["Before"] ds=["After","During","Until"]
- `m3-u3-time-connectors-gf-004` [gap-fill, d3]: p="I was doing my homework ___ my brother was playing a computer game." c="while" a=["while"] ds=["during","when","after"]
- `m3-u3-time-connectors-gf-005` [gap-fill, d4]: p="They waited at the bus stop ___ the bus came." c="until" a=["until","till"] ds=["while","during","by the time"]
- `m3-u3-time-connectors-gf-006` [gap-fill, d5]: p="I fell asleep ___ the film. I didn't see the ending." c="during" a=["during"] ds=["while","when","before"]
- `m3-u3-time-connectors-mc-001` [multiple-choice, d3]: p="Which sentence is correct?" c="We had lunch during the break." a=["We had lunch during the break."] ds=["We had lunch during we were on break.","We had lunch while the break.","We had lunch during were on break."]
- `m3-u3-time-connectors-mc-002` [multiple-choice, d4]: p="Choose the correct sentence." c="After the match finished, we went home." a=["After the match finished, we went home."] ds=["After the match finished, we were going home.","After the match was finishing, we went home.","During the match finished, we went home."]
- `m3-u3-time-connectors-mc-003` [multiple-choice, d3]: p="Which sentence uses 'while' correctly?" c="While Dad was cooking, I set the table." a=["While Dad was cooking, I set the table."] ds=["While the dinner, I set the table.","While Dad cooked, I was setting the table.","While Dad was cooking, I was setting the table."]
- `m3-u3-time-connectors-ec-001` [error-correction, d2]: p="Find and fix the mistake: During I was sleeping, someone rang the doorbell." c="While" a=["While","While I was sleeping, someone rang the doorbell.","While I was sleeping, someone rang the doorbell"] ds=[]
- `m3-u3-time-connectors-ec-002` [error-correction, d3]: p="Find and fix the mistake: We went swimming while the summer holidays." c="during" a=["during","during the summer holidays","We went swimming during the summer holidays.","We went swimming during the summer holidays"] ds=[]
- `m3-u3-time-connectors-ec-003` [error-correction, d4]: p="Find and fix the mistake: By they arrived at the cinema, the film had already started." c="By the time" a=["By the time","By the time they arrived at the cinema, the film had already started.","By the time they arrived at the cinema, the film had already started"] ds=[]
- `m3-u3-time-connectors-tf-001` [transformation, d3]: p="You're telling a classmate why you were late. Complete the sentence: 'When I ________ at school, the bell ________ already ________.'" c="arrived ... had already rung" a=["arrived ... had already rung","arrived ... was already ringing","arrived, had already rung"] ds=[]
- `m3-u3-time-connectors-tf-002` [transformation, d2]: p="Your friend asks what your evening was like. Describe what happened: 'While my sister ________ (study), my brother ________ (play) video games.'" c="was studying ... was playing" a=["was studying ... was playing","was studying, was playing"] ds=[]
- `m3-u3-time-connectors-tf-003` [transformation, d4]: p="You're writing about your bedtime routine in your English diary. Write one sentence using 'before':" c="Before I went to bed, I brushed my teeth." a=["Before I went to bed, I brushed my teeth.","I brushed my teeth before I went to bed.","Before I went to bed I brushed my teeth."] ds=[]
- `m3-u3-time-connectors-tr-001` [translation, d2]: p="🇩🇪 Während des Unterrichts darf man nicht telefonieren." c="During the lesson, you mustn't use your phone." a=["During the lesson, you mustn't use your phone.","During the lesson, you mustn't use your phone","You mustn't use your phone during the lesson.","You mustn't use your phone during the lesson","During class, you mustn't use your phone.","During the lesson you can't use your phone."] ds=[]
- `m3-u3-time-connectors-tr-002` [translation, d5]: p="🇩🇪 Während wir auf den Bus warteten, begann es zu schneien." c="While we were waiting for the bus, it started to snow." a=["While we were waiting for the bus, it started to snow.","While we were waiting for the bus, it started to snow","While we were waiting for the bus, it started snowing.","While we were waiting for the bus, it started snowing","It started to snow while we were waiting for the bus.","It started snowing while we were waiting for the bus."] ds=[]
- `m3-u3-time-connectors-sb-001` [sentence-building, d2]: p="Put the words in the correct order: the / stayed / we / rain / during / inside" c="We stayed inside during the rain." a=["We stayed inside during the rain.","We stayed inside during the rain","During the rain we stayed inside.","During the rain we stayed inside","During the rain, we stayed inside.","During the rain, we stayed inside"] ds=[]
- `m3-u3-time-connectors-mt-001` [matching, d3]: p="Match each connector with the correct completion. 1: While she was studying, 2: During the concert, 3: Before we left, 4: After the lesson, 5: Until the bus came," c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"d\",\"5\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"d\",\"5\":\"b\"}"] ds=["a: everyone clapped and cheered.","b: they waited at the stop.","c: the phone rang three times.","d: we went to the park.","e: we packed our bags."]
- `m3-u3-time-connectors-qf-001` [question-formation, d1]: p="Tom was sleeping during the lesson. Ask about: what Tom was doing during the lesson." c="What was Tom doing during the lesson?" a=["What was Tom doing during the lesson?","What was Tom doing during the lesson"] ds=[]
- `m3-u3-time-connectors-gf-020` [gap-fill, d1]: p="___ she finished her homework, she went outside to play." c="After" a=["After"] ds=["During","While","Until"]
- `m3-u3-time-connectors-gf-021` [gap-fill, d2]: p="The baby fell asleep ___ the car ride." c="during" a=["during"] ds=["while","when","after"]
- `m3-u3-time-connectors-gf-022` [gap-fill, d2]: p="___ the teacher was explaining the rules, some students were talking." c="While" a=["While"] ds=["During","Before","After"]
- `m3-u3-time-connectors-gf-023` [gap-fill, d3]: p="We always brush our teeth ___ we go to bed." c="before" a=["before"] ds=["after","during","while"]
- `m3-u3-time-connectors-gf-024` [gap-fill, d4]: p="I saw my favourite singer ___ the concert last Saturday." c="during" a=["during"] ds=["while","when","before"]
- `m3-u3-time-connectors-gf-025` [gap-fill, d5]: p="We didn't leave the cinema ___ the film was over." c="until" a=["until","till"] ds=["while","during","when"]
- `m3-u3-time-connectors-mc-020` [multiple-choice, d2]: p="Which sentence uses 'during' correctly?" c="I fell asleep during the maths lesson." a=["I fell asleep during the maths lesson."] ds=["I fell asleep during the teacher was talking.","I fell asleep during was the maths lesson.","I fell asleep during I was in class."]
- `m3-u3-time-connectors-mc-021` [multiple-choice, d3]: p="Choose the correct sentence." c="Before we left for school, we had breakfast." a=["Before we left for school, we had breakfast."] ds=["Before we left for school, we were having breakfast.","During we left for school, we had breakfast.","While the breakfast, we left for school."]
- `m3-u3-time-connectors-mc-022` [multiple-choice, d5]: p="Which sentence correctly uses 'when' and 'while'?" c="While she was reading, the lights went out when there was a storm." a=["While she was reading, the lights went out when there was a storm."] ds=["During she was reading, the lights went out when there was a storm.","While she was reading, the lights went out while there was a storm.","When she was reading, the lights went out during there was a storm."]
- `m3-u3-time-connectors-ec-020` [error-correction, d2]: p="Find and fix the mistake: While the lunch break, we played football." c="During" a=["During","During the lunch break","During the lunch break, we played football.","During the lunch break, we played football"] ds=[]
- `m3-u3-time-connectors-ec-021` [error-correction, d3]: p="Find and fix the mistake: During my mum was cooking, I watched a video." c="While" a=["While","While my mum was cooking","While my mum was cooking, I watched a video.","While my mum was cooking, I watched a video"] ds=[]
- `m3-u3-time-connectors-ec-022` [error-correction, d5]: p="Find and fix the mistake: I always eat an apple before I will go to training." c="go" a=["go","before I go","I always eat an apple before I go to training.","I always eat an apple before I go to training"] ds=[]
- `m3-u3-time-connectors-tf-020` [gap-fill, d3]: p="Your friend wants to know about your morning routine. Complete with the right connector: 'I have a shower ________ (before/after) I eat breakfast. Then ________ (during/while) I'm eating, I check my phone.'" c="before ... while" a=["before ... while","before...while"] ds=["after","during","when"]
- `m3-u3-time-connectors-tf-021` [gap-fill, d4]: p="You're writing an email about a school trip. Complete: '________ (During/While) the bus ride, we sang songs. ________ (When/During) we arrived at the museum, it was already closed.'" c="During ... When" a=["During ... When","During...When"] ds=["before","after","while"]
- `m3-u3-time-connectors-tr-020` [translation, d2]: p="🇩🇪 Bevor wir ins Kino gingen, haben wir Pizza gegessen." c="Before we went to the cinema, we ate pizza." a=["Before we went to the cinema, we ate pizza.","Before we went to the cinema, we ate pizza","Before we went to the cinema, we had pizza.","Before we went to the cinema, we had pizza","We ate pizza before we went to the cinema.","We had pizza before we went to the cinema."] ds=[]
- `m3-u3-time-connectors-tr-021` [translation, d4]: p="🇩🇪 Während der Pause hat es angefangen zu regnen." c="During the break, it started to rain." a=["During the break, it started to rain.","During the break, it started to rain","During the break, it started raining.","During the break, it started raining","It started to rain during the break.","It started raining during the break."] ds=[]
- `m3-u3-time-connectors-sb-020` [sentence-building, d2]: p="Put the words in the correct order: after / home / got / we / watched / we / TV" c="After we got home, we watched TV." a=["After we got home, we watched TV.","After we got home, we watched TV","After we got home we watched TV.","We watched TV after we got home.","We watched TV after we got home"] ds=[]
- `m3-u3-time-connectors-sb-021` [sentence-building, d3]: p="Put the words in the correct order: while / sleeping / was / I / alarm / the / rang" c="While I was sleeping, the alarm rang." a=["While I was sleeping, the alarm rang.","While I was sleeping, the alarm rang","While I was sleeping the alarm rang.","The alarm rang while I was sleeping.","The alarm rang while I was sleeping"] ds=[]
- `m3-u3-time-connectors-mt-020` [matching, d3]: p="Match each connector with the correct ending. 1: While I was doing my homework, 2: During the film, 3: Before the lesson started, 4: After we finished eating, 5: When the teacher arrived," c="{\"1\":\"d\",\"2\":\"c\",\"3\":\"e\",\"4\":\"a\",\"5\":\"b\"}" a=["{\"1\":\"d\",\"2\":\"c\",\"3\":\"e\",\"4\":\"a\",\"5\":\"b\"}"] ds=["a: we washed the dishes.","b: everyone sat down.","c: my phone vibrated three times.","d: my cat jumped on my desk.","e: I sharpened my pencils."]
- `m3-u3-time-connectors-qf-020` [question-formation, d4]: p="Your friend says: 'I saw a celebrity.' Ask them when it happened. Use 'while' or 'when' in your question. Start with: 'Did you see them while...' or 'When did you...'" c="Did you see them while you were shopping?" a=["Did you see them while you were shopping?","When did you see them?","Did you see them while you were walking?","Did you see them while you were in town?","When did you see the celebrity?"] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adrian, Adverbs, Africa, African, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amy, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Bacon, Baker, Balcony, Barcelona, Beatles, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brian, Bridge, Brown, Buckells, Buckingham, Buddy, Burgers, Butterfly, Caf, Cairn, California, Cambridge, Came, Cameroon, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Celia, Celsius, Central, Centre, Chamber, Changing, Checking, Chester, Chichen, Chile, China, Chito, Chloe, Chris, Christie, Christine, Chuck, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, Column, Come, Complimenting, Control, Costa, Croatia, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, During, Earthlings, East, Eddie, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fang, Faye, Feeling, Fido, Fluff, Food, Ford, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Hull, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Josh, Julia, Jun, Jupiter, Just, Justyna, Kansas, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Korea, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, London, Lord, Lucas, Lucy, Luigi, Lulu, Luna, Machu, Madonna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mr, Mrs, Ms, Mum, Munich, Musical, Natasha, Nathan, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nina, Nomen, Norman, North, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Oliver, Olivia, Olympic, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Patti, Paul, Paula, Paws, People, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Punta, Put, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Robert, Robertson, Rome, Ron, Ronald, Rose, Rosey, Rosie, Royal, Ruby, Sacks, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Seoul, Sessions, Shannon, Shelter, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, States, Station, Steve, Stirling, Stoke, Stradivarius, Style, Sue, Sunborn, Superstar, Susan, Suzy, Swaton, Sweet, Tag, Take, Tale, Tamar, Tamara, Tammy, Targon, Tasmania, Tell, Telling, Text, Think, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, Wallace, War, Waterloo, Watson, Way, Welcome, Well, White, Will, William, Willow, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 3 SB Unit 3.txt -----
Unit 3 What an adventure!
Pages 24–25
At the end of unit 3 …
 you know
 ☐ 21 words and phrases to talk about travelling
 ☐ how to use time linkers
you can
 ☐ understand a story about famous travellers
 ☐ understand an interview about an adventure journey
 ☐ understand and talk about a (bad) holiday experience
 ☐ write an email or a story for the school magazine about a past holiday
🎧 READING Understanding a story about famous travellers
1 Read the text about James Holman.
James Holman: THE RECORD TRAVELLER
 “He had eyes in his mouth, eyes in his nose, eyes in his ears, and eyes in his mind.”
 — William Jordan
(Image description: A black and white portrait of James Holman wearing formal 19th-century clothing. Below the image is a banner reading “The Record Traveller.” There is also an orange box with white text on the right and a stylized image of a ship at sea.)
James Holman lived more than a hundred and fifty years ago. During his lifetime, he travelled more than 400,000 km – further than anyone before him. And in those days travelling long distances was hard, even for fit people.
James Holman wasn’t fit. In fact, he was blind, and he suffered from rheumatism. He had so much pain that it was often difficult for him to get out of bed in the morning. But even on days when he suffered very badly, James grabbed his walking stick and started to move, in spite of his pain.
Born in Exeter in the south of England in 1786, James was a healthy boy with good eyesight*, and it was his dream to see the world. At the age of twelve, he joined the Royal Navy.
Soon he found himself working extremely hard on board a ship sailing across the Atlantic towards the coast of Canada. The sea air was brutal. The freezing, wet weather had a very bad effect on his health. He started to feel terrible pains in his bones. His heart hurt so badly that walking even a short distance was very difficult for him. He stayed in the Royal Navy until 1810 when they sent him back to England. He was disabled.
But things got worse. By the time he was 25, Holman was not only unable to walk, he was completely blind too.
In the early 19th century, blind people had extremely hard lives. Medical treatment* was poor. Most of them didn’t have jobs. They were usually ‘begging’ for money. Not Holman. He got himself a metal walking stick. Listening carefully to the tap-tap-tap that came from the stick, he started to explore the streets of London. At all alone, he was blind, but he learnt to ‘see’ using his ears.
A few years later, nothing could stop him any more. His first journey took him to France. The roads were awful and coaches were overcrowded with people. Holman didn’t speak a word of French. Nobody spoke English. The blind man was all alone – but starting to travel was the best decision in Holman’s life! His health improved. He felt great. He was becoming a man of adventure.
Holman became very good at finding his way around strange cities, tap-tap-tapping his way, noticing the sounds and smells of town squares and market places. People asked him how a blind man could enjoy sightseeing. He said, “Being blind doesn’t stop me from enjoying travelling. It makes me more curious. I take my time to explore everything deeply, using all my other senses.”
His next trip was to Italy. He became the first blind person to reach the top of Mount Vesuvius, an active volcano at that time. He took notes for his books to write. Two of his books became very successful and he became famous. Now he could set out on a journey around the world.
The adventures of the blind man were amazing. In India he received an invitation to a gold mine. In South Africa he taught himself to ride a horse and went off into the wild with a young African who didn’t speak English. In Ceylon he took part in an elephant hunt. He crossed Zanzibar and Tasmania on foot. And in China a swarm of wasps* attacked him – a very painful experience. But he never gave up. He lived his big dream: he dreamt to ‘see’ the world.
*VOCABULARY: eyesight – Sehkraft; treatment – Behandlung; beg – betteln; wasp – Wespe
2 How many of these tasks can you do?
Complete the sentences with no more than 4 words.
1 James used a ................................................................................................................... to help him walk.
 2 James ................................................................................................................... because he wanted to travel the world.
 3 Life was ................................................................................................................... for disabled people in the 19th century.
☐ Holman found his first journey to France
  ⬜ very difficult. ⬜ helped him feel better. ⬜ lonely.
☐ Holman said his blindness
  ⬜ helped him meet new people.
  ⬜ made him want to know more about the world.
  ⬜ made sightseeing more enjoyable.
☐ Holman used the money from his books to help
  ⬜ him travel further than Europe.
  ⬜ him live more comfortably.
  ⬜ others with disabilities.
7 What do you think he found most difficult about his travels?
 ....................................................................................................................
8 Why do you think people were so interested in travellers in those days?
 ....................................................................................................................
9 How is travelling easier these days for people with disabilities?
 ....................................................................................................................
3 🎧 Check your answers with a partner. Then listen to the text.
Pages 26–27
4 Read the text about another traveller, Mary Kingsley.
Mary Kingsley: A VICTORIAN LADY IN AFRICA
 (Image description: Portrait of Mary Kingsley at the top left corner in a circular frame. Decorative icons such as a compass rose and tribal design elements are included.)
Mary Kingsley was born in North London in 1862. When she was a girl, her mother became quite ill, and her father was never at home. So Mary had to look after her mother and had little time to go to school. But while looking after her mother, she studied physics, chemistry, biology and maths on her own. She learnt Latin and German too. Mary had a big dream. She wanted to see the world. She wanted to be an explorer. She wanted to travel to Africa. When both her parents died in 1891, she saw an opportunity to start travelling. That was not easy because in the 19th century women did not usually travel alone. But that didn’t stop Mary Kingsley. She began to make her dream come true and set out to Africa all on her own. Mary made two long African journeys, one in 1893 and one in 1895. There are many wild stories about her travels. On her first journey she went to Angola, Congo, Cameroon and Nigeria. She lived with the people in their huts and she ate their food. And Mary always dressed in black from head to toe. In the middle of the wilderness she looked like a lady going to a tea party! She collected rare* fish for the British Museum, and she had quite a few dangerous adventures. Once while she was resting in her tent, she heard a noise outside: it was a leopard. She threw a water jug at it and ran away. And when some Hippos blocked her way she hit them with her umbrella. The most famous adventure is probably when a crocodile tried to climb into her boat, and she hit it with her paddle so it gave up and went back into the water. In 1895, she went where no white woman had ever been before. She went to see the Fang people who were cannibals. First, she took a steamboat up the Ogouée River, and then she went on foot. The Fang turned out to be quite friendly, even though one night Mary found a bag with a human hand in it. She had four eyes, and two ears in her tent. She finished her second adventure by climbing Mount Cameroon (4,040 metres) alone, because the men with her were too weak to get to the top. After her travels, Mary wrote two bestsellers (Travels in West Africa and West African Studies), and back in England she gave many lectures and interviews. There she criticised the Europeans, especially the missionaries, for destroying so much of the African culture, which, she said, had its own rules. Mary returned to Africa (to South Africa actually) just before the Second Boer War broke out in 1899. She worked in a hospital that was full of typhoid* patients. She got typhoid and died on June 3rd, 1900. She is still seen as one of the great female explorers of the 19th century.
*VOCABULARY: rare – selten; typhoid – Typhus
5 How many of these tasks can you do? Check your answers with a partner.
 🎧 Then listen to the text.
☐ Mary’s father didn’t spend much time in the house. T / F
 ☐ Mary started travelling after her parents’ deaths. T / F
 ☐ Mary didn’t like to meet the local people when she travelled. T / F
Complete the sentences with no more than 4 words.
4 Mary wasn’t scared of .................................................
 5 Mary ................................................. and chased them away.
 6 Mary wasn’t ................................................. with what European missionaries were doing in Africa.
7 Why do you think Victorian women didn’t travel much?
 ....................................................................................................................
8 Which of her adventures do you think was the most amazing?
 ....................................................................................................................
9 How should we behave in other countries?
 ....................................................................................................................
🎧 READING & LISTENING Understanding an interview
6 Read and listen to the podcast interview. Would you like to go on an adventure like this? Why (not)?
Off on an adventure
 (Image description: Celia, a young woman wearing a red jacket, is sitting on her packed touring bike in front of a map showing her route across the USA. There are bicycle icons marking progress across the map from Kansas to the west coast.)
Interviewer: Hi, Celia, and thank you for talking to us on Radio Kansas One.
 Celia: It’s my pleasure, Lenny.
 Interviewer: Celia is cycling the TransAmerica Bicycle Trail and if I’m correct, you’ve nearly done half of it.
 Celia: That’s right Lenny. I’ve done about 3,200 km and I’ve got 3,580 km to go.
 Interviewer: So why did you decide to do this bike ride?
 Celia: Well, I really wanted to cross the States from east to west. I know some people rent a car and do it the easy way, but I wanted a challenge. I wanted to get close to nature and meet interesting people. For me, this only happens when you go by bike.
 Interviewer: Sounds like a lot of fun, but it must be hard too?
 Celia: Of course. When it’s raining heavily, and you’re not sleeping in a tent. When you can’t escape the midday heat. When you have to go up to 3,500 metres and get altitude sickness.
 Interviewer: Do you ever feel like stopping?
 Celia: No, of course not.
 Interviewer: How are you paying for your adventure?
 Celia: I’m an influencer, and a healthy and active lifestyle is my thing. Every evening, I work on my blog, I post pictures mostly, but I also write short texts. The last one was about crossing a river, carrying my bike. I got a lot of clicks for that. And clicks make me money.
 Interviewer: You are travelling on your own, do you ever get lonely?
 Celia: Not really. On this trip there always seems to be someone interesting to talk to. For the last bit in Oregon I’m meeting up with my boyfriend. I’m looking forward to that.
 Interviewer: Well, Celia, all the best for your adventure. I hope you make it and I hope you’ll have a good time.
 Celia: Thank you, Lenny. I’m sure I will.
VOCABULARY Travelling (1)
7 Write the verb phrases. Use a word or word group from box A and B each time.
A
 ⬜ rent  ⬜ go up to ⬜ sleep  ⬜ escape  ⬜ get close to
 ⬜ work on ⬜ meet up with
B
 ⬜ in a tent
 ⬜ my boyfriend
 ⬜ a river
 ⬜ 3,500 metres
 ⬜ the midday heat
 ⬜ a blog
 ⬜ interesting people
8 In pairs, talk about Celia. Use the phrases from 7.
Pages 28–29
VOCABULARY Travelling (2)
9 🎧 Read and match the sentences with the pictures. Then listen and check.
 Minnie is a pilot. Every day she flies from London Gatwick to Munich and back.
Image descriptions (left to right):
Minnie leaving her house with a bag, early morning.
Minnie getting into a green car.
Minnie driving her car towards the airport.
Minnie walking across the tarmac toward the plane.
A plane taking off.
A plane landing.
Minnie leaving the plane.
Minnie getting out of her car, returning home.
⬜ Minnie sets off for work at about 5.30 a.m.
 ⬜ She gets into her car.
 ⬜ She gets to the airport at about 6.10 a.m.
 ⬜ She gets on the plane at 6.50 a.m., half an hour before the passengers.
 ⬜ The plane takes off at 7.30 a.m.
 ⬜ The journey takes about an hour and a half. The plane lands at about 9 a.m.
 ⬜ After a rest in Munich, she flies back. She gets off the plane at about 3 p.m.
 ⬜ She drives home. She gets out of the car at about 5 p.m.
READING Understanding a text about a past holiday
10
 a Quickly read through the texts and answer the question.
 Who went swimming on their holiday?
 ………………………………………………………
b Now read the texts carefully.
MY BEST TRIP EVER
 A holiday at the lake
 by Tony Miller
Last summer, my friend Marty and I stayed at my grandparents’ house, which is in a small village about 80 kilometres from where I live. The house is close to some woods and a small river. There’s also a little lake. It takes me twenty minutes to cycle there. We planned to stay with my grandparents for a weekend, but in the end we stayed for more than a week.
Every day before breakfast, we cycled to the lake and went for a swim. The lake was pretty cold, but after a minute or so it wasn’t too bad. By the time we got back and sat down for Grandma’s big breakfast, we felt really awake.
There were two mornings we didn’t go swimming. On those days, we went out with Grandpa. One day, we went looking for mushrooms. We found loads and then we cooked them and had them on toast for breakfast. The other day, we went fishing with him. We cooked the fish we caught later that day on the barbeque.
We didn’t do much during the daytime. It was nice just to relax. But on two afternoons, we played football with some local kids. That was really fun.
All in all, we had a great time. We’re already making plans to go back next year.
MY BEST TRIP EVER
 Sightseeing in Barcelona
 by Amy Gallagher
My best holiday ever was to Barcelona with my parents and my two brothers, Josh and Freddie. It only took us an hour and a half to fly there – which was only half an hour longer than it took to get to the airport. We rented a great apartment with four bedrooms and a lovely verandah. The weather was fine all the time, very different to the UK.
We did a lot of sightseeing. We saw the Sagrada Familia church, hung out in the Güell Park, and walked down Las Ramblas. I quite enjoyed that, even though I’m not really into sightseeing. What I liked best were all the street artists. I loved sitting in one of the many street cafés, eating an ice cream and watching them do all those amazing things.
The other thing that was really great was the beach. It was in walking distance from our apartment and we went there nearly every day. The water was still a bit cold, but we didn’t mind. Only Dad didn’t go into the water.
We all loved the food. We had loads of ‘tapas’, which are small plates of food. We always ordered a lot of tapas so we could share them and try lots of new things. We ate late in the evening and always ended up full.
Unfortunately, all good things come to an end and after a week, we had to fly home to rainy England.
11 Read again and complete the sentences.
1 Tony planned to stay for two days, but …
 ………………………………………………………
 2 After Tony was in the lake for a minute or so, …
 ………………………………………………………
 3 They had a barbeque when …
 ………………………………………………………
 4 On a couple of afternoons, …
 ………………………………………………………
 5 Amy went on holiday with …
 ………………………………………………………
 6 One of Amy’s favourite things was to sit in a café and …
 ………………………………………………………
 7 They ate a lot of tapas because …
 ………………………………………………………
 8 The only bad thing about the holiday was …
 ………………………………………………………
Pages 30–31
LISTENING & SPEAKING Talking about a (bad) holiday experience
12 🎧 Listen to the dialogues. Act them out in pairs.
DIALOGUE 1
 Woman: Yes, can I help you?
 Customer: We missed our flight to New York.
 Woman: Can I see your tickets, please? (pause) I see. Well, I can put you on the 3 o’clock flight, but there’s a charge.
 Customer: How much?
 Woman: It’s £90 per person, I’m afraid.
 Customer: OK.
 Woman: And please note that check-in is two hours before departure.
 Customer: Thanks.
DIALOGUE 2
 Man: Can I help you?
 Customer: Yes. I want to make a reservation for a sleeping compartment on the 8 p.m. train to Glasgow.
 Man: How many people, sir?
 Customer: Two.
 Man: One moment, please. I’ll see what we’ve got.
13 🎧
 a Listen to Dean and Lily talking about their worst journeys. Write their names under the photos. There is one extra photo.
Image descriptions:
A crowded airplane cabin.
A busy train station platform with sunset.
A warning triangle on the side of a road with a car parked nearby.
1 ___________________________
 2 ___________________________
 3 ___________________________
VOCABULARY: properly = richtig, ordnungsgemäß; nearby = nahegelegen
b Listen again and take notes.
	went to	went by	What problems did they encounter?
Dean			
Lily			

14 🎧
 In groups of four, tell each other about a journey that went wrong.
It was in the summer holidays last year / two years ago / last weekend.
 My ... and I went on a trip to ...
 We started from ... First, we went by train/car/plane/boat from ... to ... Then we ...
 Suddenly, we noticed ... / there was a problem with ... / someone ...
 We couldn’t ... / It was impossible to ... / We missed ... / We had a real problem with ...
 We were all very angry/frustrated/sad because ...
 The next day, we ...
WRITING
15 CHOICES
A Your family went for a short holiday recently that was the worst journey you ever made. You are back home now. Write an email to a friend in the USA (50–70 words). Tell him or her:
 • where you went and who was with you
 • how you travelled
 • what the problems were
B There’s a story-writing competition in your school magazine. Write 120–180 words about a journey you made. To help you, think about the questions and find a good title.
 • Where did you go? How long did it take?
 • Who was with you?
 • What was interesting/boring about it?
 • What did you see?
 • Did anything unusual happen?
 • Would you do the journey again? Why (not)?
GRAMMAR
when, before, after, while, during, until, by the time
How to use it: You use when, before, after, while, during, until, by the time to talk about actions or events that happened at a certain time.
When some hippos blocked her way, she hit them with her umbrella.
 Mary returned to Africa before the Second Boer War broke out.
 After her travels, Mary wrote two bestsellers.
 While she was resting in her tent, she heard a noise outside.
 He stayed in the Royal Navy until 1810.
 By the time he was 25, Holman was completely blind.
Note the difference between while and during. After while you use a verb. After during you use a noun.
 While looking after her mother, she studied physics, chemistry, biology and maths on her own.
 During his lifetime, he travelled more than 400,000 km.
(Image description: Cartoon-style drawing of tourists lying on a beach. Behind them, a group of monkeys are joyfully raiding their picnic. Caption: “While the tourists were lying on the beach, the monkeys were having a feast.”)
take time to do
How to use it: If you want to say how long an activity lasts, then you use take time to do.
How to form it: it + take + person + time + to do, for example:
 It takes me twenty minutes to cycle there.
 It only took us an hour and a half to fly there.
➡️ Now go back to page 24. ✔ Check with a partner what you know / can do.
Pages 32–33
1 🎧 Watch or listen to the dialogue. Then read it. What does Kate invite Tom to do?
Tom: Hello, Kate.
 Kate: Oh, hi, Tom. Come on in.
 Tom: Do you need a hand?
 Kate: No, I’m alright. I’m just checking over my bike. See if it’s still working OK after the move.
 Tom: You going anywhere special?
 Kate: I thought I’d do some exploring – get to know the countryside around my new hometown. Can you recommend anywhere?
 Tom: Oh, you have to go to Cuckmere Haven.
 Kate: Did you say Cuckmere Haven? What’s that exactly?
 Tom: Well, it’s where the river Cuckmere meets the sea. If you like countryside then you should definitely start there. And don’t forget to bring a camera. You’ll want to take photos, I promise.
 Kate: So how do I get to this Cuckmere Haven?
 Tom: Well, there’s the short way or the long way via the Long Man and the Big White Horse. I’d recommend the long way. It’s prettier.
 Kate: I’m not completely sure what you’re talking about, but it sounds fun. I’ll take the long way then. Which way is it?
 Tom: OK, so down to the bottom of the road, then take a right, then keep on going until you reach the King’s Head pub. Then it’s left and left again …
 Kate: So that’s right at the King’s Head …
 Tom: No, left.
 Kate: And then right. Is that correct?
 Tom: No, left. Or is it right? I’m getting confused. Let me start again.
 Kate: You know what. Why don’t you come with me? If you’re not doing anything, of course.
 Tom: No. Yes. I mean no, I’m not busy and yes, I’d love to come. I’ll just get my bike.
 Kate: OK. I’ll see you around the front.
2 Answer the questions.
1 What does Tom offer to do?
 ………………………………………………………………………………
 2 What is Kate doing?
 ………………………………………………………………………………
 3 Where does she want to go?
 ………………………………………………………………………………
 4 What is Cuckmere Haven?
 ………………………………………………………………………………
 5 Why is Tom confused?
 ………………………………………………………………………………
USEFUL PHRASES Recommending
3 Put the words in order to make recommendations. Check in the dialogue.
1 go / have / Cuckmere Haven / to / to / you
 …………………………………………………………………………………………………………………………
 2 there / should / you / start / definitely
 …………………………………………………………………………………………………………………………
 3 camera / bring / don’t / to / a / forget
 …………………………………………………………………………………………………………………………
 4 way / long / recommend / I’d / the
 …………………………………………………………………………………………………………………………
🔶 What do you think? Answer the questions.
 • Does Tom go with Kate?
 • Does Tom really know the way to Cuckmere Haven?
📱 MOBILE HOMEWORK
Watch part 2 of the video. Find four mistakes in Kate’s diary and correct them.
I was getting my bike ready to go on a ride when Tom asked if I needed help. He’s so sweet. He told me to go to a place called the Riverside, but he was confused about where it was. So I invited him along. He had to use his sister’s bike and it was too big for him. He looked really funny. We got lost on the way and it took us ages to get there. But it was great.
 It’s a really lovely place. I had to leave because I needed to get back by 6 p.m. Tom had a puncture so I had to leave him behind. I felt terrible. The weather was great when I left Tom.
SPEAKING STRATEGY Checking information
4 Complete, then check with the dialogue in 1.
1 Tom Oh, you have to go to Cuckmere Haven.
 Kate D............................. y............................. S............................. Cuckmere Haven?
 2 Kate S............................. right at the King’s Head …
 Tom No, left.
 3 Kate And then right. I............................. t............................. C............................. ?
 Tom No, then left.
5 🎭 ROLE PLAY: Work in pairs. Look at your role cards. Take 4–5 minutes to practise your dialogue. Don’t write it down. Act it out for the rest of the class.
Student A
 You are a tourist in town. You want to know where to find the following things (add two ideas of your own):
 ☐ a good restaurant
 ☐ a good cinema
 ☐ a swimming pool, etc.
 Go to the tourist office and ask for recommendations. Check you understand the correct information.
Student B
 You work in a local office.
 Listen to and make recommendations.


----- WB: More 3 WB Unit 3.txt -----
UNIT 3  What an adventure!
Pages 20–21
UNDERSTANDING VOCABULARY Travelling (1)
1 Match the sentence halves.
 1 □ We’re going to rent
 2 □ Last night, we slept
 3 □ I felt ill at the top of the mountain as I got
 4 □ I love getting close
 5 □ We met some really interesting
 6 □ The train goes up
 7 □ We stayed under a tree to escape
 8 □ We used a fallen tree to cross
 9 □ I really need to work
 10 □ I met up
a □ to nature. It helps me relax.
  b □ to the top of the mountain.
  c □ in a tent.
  d □ the midday heat.
  e □ on my blog tonight.
  f □ the river.
  g □ a car for the weekend.
  h □ with my best friend after school.
  i □ people on our holidays.
  j □ altitude sickness.
2 Match four of the sentences in 1 with the pictures.
A – a train going up a mountain
 B – a person lying in a tent at night
 C – two people under a tree in the sun
 D – two people crossing a river on a log
USING VOCABULARY Travelling (1)
3 Read Shireen’s postcard and complete it with the words in the box.
Box: slept, got, rented, went, met, meet, got
Dear Ahmed,
 We’re having a really great time here in Peru. It’s such an amazing place and it’s so good to 1 _____________ on my blog for a while. The local people are really friendly and we’ve 2 _____________ some lovely people here. We spent the first week in Lima and then we 3 _____________ a car to see a bit more of the country. We’ve spent some nights in hotels but we’ve also 4 _____________ in tents.
 Yesterday we 5 _____________ up to Machu Picchu – it’s fantastic. It’s an ancient city high up in the Andes. Unfortunately, Mum 6 _____________ a bit of altitude sickness, so we couldn’t stay too long. Guess what we saw when we came down? A snake! We 7 _____________ really close to it. It was amazing. Tomorrow we’re going to 8 _____________ up with an old friend of Mum’s. It should be fun.
 See you soon.
 Love,
 Shireen
Image description: A scenic postcard photo of Machu Picchu, Peru, with clear blue skies and ancient stone structures in the mountains.
UNDERSTANDING VOCABULARY Travelling (2)
4 Put the sentences in order to describe Isaac’s journey to school.
□ Then his dad drives him to the station.
 □ He gets off the train at 8 a.m.
 □ Isaac sets off for school at 6.30 a.m.
 □ He walks from the station to the school.
 □ He gets to the station at 7 a.m.
 □ He gets to school at 8.10 a.m.
 □ He gets into his dad’s car.
 □ He gets on the train at 7.10 a.m.
5 How long do each of these parts of Isaac’s journey take?
Image 1: Isaac riding in a car with his dad (smiling, chatting)
 Image 2: Isaac sitting on the train with his schoolbag, looking out the window
 Image 3: Isaac walking to school with a city in the background
1 ....................................................
 2 ....................................................
 3 ....................................................
USING VOCABULARY Travelling (2)
6 Complete the sentences with the missing words. Use the words on page 28 of your Student’s Book to help you.
1 Frank ................................................................................................... for work at 8.00 a.m.
 2 He ........................................................................................................ his bike.
 3 He .................................................................. the underground station at 8.10 a.m.
 4 He ............................................................................................. the train at 8.15 a.m.
 5 His train journey .................................................... about 50 minutes.
 6 He ................................................................ the train at around 9.05 a.m.
 7 His walk to the office ..................................................................... 10 minutes.
 8 He .................................................................................. work at 9.15 a.m.
7 Write a short paragraph about your journey to school.
(Lines provided for student to write their paragraph.)
Pages 22–23
UNDERSTANDING GRAMMAR Time linkers
8 Match the pictures and the sentences.
1 □ Before we had breakfast, we watched some TV.
 2 □ I lost my keys before I got off the bus.
 3 □ I lost my keys while I was getting off the bus.
 4 □ While we were having breakfast, we were watching TV.
 5 □ I lost my keys after I got off the bus.
 6 □ After we had breakfast, we watched some TV.
Image descriptions:
 – A boy getting ready to eat breakfast while TV is on (images 1 and 4)
 – A boy getting off a bus and looking around (images 2, 3, 5)
 – A boy watching TV after eating (image 6)
9 Circle the correct word to complete the sentences.
A terrible flight
 1 While / During I was shutting my suitcase, it broke.
 2 While / During the trip to the airport, we got lost.
 3 There was lots of turbulence* while / during the flight.
 4 While / During I was reading my book, the lights went out.
 5 I dropped my cola while / during the meal and got my trousers all wet.
 6 A baby kept crying while / during the film and I couldn’t hear anything.
 7 The man in front started talking loudly while / during I was trying to get to sleep.
 8 While / During I was waiting at passport control, I discovered my passport was still on the plane.
VOCABULARY: turbulence – Turbulenzen
USING GRAMMAR Time linkers
10 Complete with the words from the box. Sometimes there is more than one possible answer.
Box: when, by the time, before, while, during, until, after
1 _____________ we travel to Brazil, we always watch the movie Rio _____________ we leave. We stay up _____________ the film is finished. _____________ the movie is over, my dad is always asleep.
2 _____________ the last day of term, my brother and I go to our grandparents’ place in the country for two weeks. _____________ this time, we have a lot of fun riding our bikes, swimming in the lake and helping out at our grandparents’ farm. My brother is lazier than me. _____________ I help grandpa, he sleeps in the grass behind the house.
3 We didn’t go into the swimming pool _____________ the storm. _____________ we were watching the storm, the lights suddenly went out. _____________ the lights came on again, the storm was finished.
4 _____________ our safari we hoped to see a tiger. We waited in our jeep _____________ it was dark. _____________ we went home, Dad wanted to walk a bit. _____________ the driver heard that, he only said: “Crazy man!”
UNDERSTANDING GRAMMAR Take time to do something
11 Complete the sentences with the correct time.
1 I started looking for my keys at 8 p.m. It took me 20 minutes to find them. I found them at _____________.
 2 Lucy went to bed at 10 p.m. It took her ten minutes to fall asleep. She was asleep at _____________.
 3 Ben started his model on Friday. It took him three days to make it. He finished on _____________.
 4 My mum started to cook dinner at 5 p.m. It took her an hour to cook it. We ate at _____________.
 5 I started this painting in March. It took me three months to paint it. I finished in _____________.
 6 We started the race at 12 p.m. It took us four hours. We finished at _____________.
USING GRAMMAR Take time to do something
12 Write sentences. How long does it take you to …
1 get to school?
 It takes me .................................................................................................................
2 do your homework each night?
 ..................................................................................................................................
3 fall asleep at night?
 ..................................................................................................................................
4 decide what to wear to go to a party?
 ..................................................................................................................................
5 eat your breakfast?
 ..................................................................................................................................
6 answer a text from your best friend?
 ..................................................................................................................................
7 answer a text from your parents?
 ..................................................................................................................................
8 get out of bed in the mornings?
 ..................................................................................................................................
13 Complete the sentences with the correct form of the verb take.
Image description: A cheerful child tending to a garden, surrounded by potted plants, sunshine, and a watering can.
I love my garden.
 So far it 1 ‘’ me years to find all the plants for my garden.
 Last year, it 2 ‘’ me two months to plant some rare flowers.
 Now it 3 ‘’ me half a day to water them all once a week.
 A storm is coming and it 4 ‘’ the storm ten minutes to destroy them all.
Pages 24–25
READING
 14 Read the story. How long did Will stay with his new friend?
An Argentinian adventure
When my cousin Will finished university, he wasn’t sure what he wanted to do. He knew that he had to get a job one day, but he wanted a bit of adventure before starting his working life. He loved cycling and dreamed of seeing the world from his bike. So one day, he decided he would take a year off and make his dream come true. He spent a few weeks preparing and then he left. His plan? To cycle from the south of South America up to Colombia in the north. Just him, his bike and a tent.
He flew down to Punta Arenas in the south of Chile and started his adventure. Each day, he cycled for 15 hours, then found a spot to put up his tent, cook a simple meal and go to sleep. Each morning, he woke up early, got back on his bike and set off again.
He rode through all types of weather, strong winds, freezing rain and occasionally* got to a beautiful beach in the sunshine. The roads had very few cars on them and he met very few people. Once a week, he had to find a shop or a town where he could buy food for the week, but most days it was just him and nature.
It was peaceful but also challenging. He found it difficult to find a place to sleep. One evening, he found a nice flat place in the middle of nowhere. He put up his tent, ate and went to sleep. About two hours later, he heard a loud sound and woke up. And then another.
It sounded like a gun. Then he heard another sound. It was a gun. He heard a voice speaking Spanish, it was getting closer.
He was scared. Really scared. He wasn’t sure what to do, but he got out of the tent slowly with his arms in the air. It was really dark, but he could see a man with a torch walking towards him. The man had a gun pointing right at him. Will stood still and using one of the few words of Spanish he knew he shouted out, “Amigo, amigo!”
The man lowered the gun and walked up to him. He could see Will wasn’t dangerous. A big smile appeared on his face. “Friend,” he said.
He spoke very little English, Will spoke almost no Spanish, but somehow Will managed to make the man understand why he was there. He understood that the man was a farmer and lived close by. The man had had problems with people taking his sheep.
The man took Will back to his house where he met his wife who cooked him a delicious meal. They then showed him a bedroom where he had his first good sleep in almost a month. Will stayed with the couple for a few days before continuing his journey. These days, he says he’s better friends with the man who almost shot him.
VOCABULARY: occasionally – gelegentlich; had had – hatte (past perfect form of have)
Image description (left): A man riding a bicycle with panniers through mountainous terrain.
 Map of South America in the center shows country names (Chile, Argentina, Peru, etc.) and flags. A red star marks Punta Arenas in the south of Chile.
15 How many of these tasks can you do?
1 Will didn’t want to get a job straight after university. T / F
 2 Will went on his adventure with a friend. T / F
 3 Will took a plane to the top of South America. T / F
4 There weren’t many ................................................................................. on the road.
 5 Every week, he .......................................................................................... to get food.
 6 Finding somewhere to sleep each night was ..............................................
 7 What woke Will up in the middle of the night?
 ...........................................................................................................................................................
 8 What did Will do when he heard the noise?
 ...........................................................................................................................................................
 9 Why was the man suspicious of* Will?
 ...........................................................................................................................................................
VOCABULARY: be suspicious of – misstrauisch sein
16 Listen and check your answers.
LISTENING
 17 Listen to Adrian’s travel story. Find 6 mistakes in the summary. Underline them and write the correct words underneath.
A TERRIBLE TRIP
Adrian and his sister often go on holiday with their parents. Last year, they were in Scotland. Adrian’s dad is a big fan of Scotland. He thinks that everything there is great. During their trip, they were in Stirling. Dad told them all kinds of stories about Jeremy Wallace and pointed out the mistakes in the books featured about them.
It was difficult to find a bed and breakfast for the night. Eventually, they found one with two rooms. In Mum and Dad’s room the sofa was wet and parts of the carpet were wet as well as the children’s fourth. But Adrian saw that water was dripping from the roof. They couldn’t get anyone to come. So Dad slept in the wet room. Mum slept with the kids in the other room.
In the morning Dad came to see them. He was very cold, because there was only cold water in the shower. After a quick breakfast, they had to pay for one room only. Dad was very angry about it.
Image description (bottom right): A cartoon-style summary banner titled “A TERRIBLE TRIP,” a ruined Scottish castle and a map highlighting Stirling, Scotland, with a red dot. A dramatic photo of the Wallace Monument is shown.
Answer lines:
 1 ___________________________
 2 ___________________________
 3 ___________________________
 4 ___________________________
 5 ___________________________
 6 ___________________________
Pages 26–27
DIALOGUE WORK Recommending / Checking information
 18 CHOICES
A Complete the dialogue with the words in the box. Then listen and check.
 Box:
 forget, got, that’s, say, going, correct, should, recommend
Sally: So, Liam. I hear you’re going to Brazil for your holidays. Anywhere nice?
 Liam: Yes, we’re 1 _____________________ to Salvador in the State of Bahia.
 Sally: Salvador. It’s a wonderful city. I was 2 _____________________ there a few years ago.
 Liam: Really? So what should I do there?
 Sally: You 3 _____________________ definitely try some of the local food. I loved it.
 Liam: For example?
 Sally: Well, you’ve 4 _____________________ to try Moqueca.
 Liam: Did you 5 _____________________ Moqueca?
 Sally: Yes, it’s a fish stew. It’s delicious and don’t 6 _____________________ to put some chilli sauce in it. But not too much. It’s hot.
 Liam: OK, Moqueca with chilli sauce, is that 7 _____________________?
 Sally: Yes, and then there’s Vapata. That’s also seafood.
 Liam: I 8 _____________________ you get that from the street sellers. It’s the best.
 Sally: So 9 _____________________ Moqueca and Vapata. I think I should write this down before I forget.
Image description: Colorful colonial buildings line a cobbled street in Salvador, Brazil. The sun is shining and the street is quiet.
B Put the dialogue in the correct order. Then listen and check.
□ Kai Yes, I want to see the palace. Do you think we might get to see the King?
 ☑ 7 Kai And what about after the palace?
 □ Kai Well, I’m not sure. Have you got any ideas what we should do?
 □ Kai We’re going to London for the weekend.
 □ Kai Fantastic idea. I really want to see London from above.
 □ Kai Good idea. I’m sure we’ll be hungry by then.
 □ Isra If you’re lucky. But he isn’t always there.
 □ Isra After the palace you should definitely go on the London Eye. The views are great from there.
 □ Isra Well, the first thing you have to do is visit Buckingham Palace.
 □ Isra And after the wheel, I recommend lunch at one of the food stalls next to it.
 □ Isra London! Lucky you. What are you going to do there?
19 Imagine someone is visiting your town. Write four recommendations of what they should do.
1 You have to ......................................................................................................................................................
 2 You should definitely ....................................................................................................................................
 3 Don’t forget to ................................................................................................................................................
 4 I’d recommend ................................................................................................................................................
DEVELOPING WRITING SKILLS Making a recommendation
 20 Read the task and what a student wrote. Why is Amy sending her friend a link to a website?
Task
 You’ve just come back from a holiday in a nice hotel. Write an email (60–80 words) to your friend recommending the hotel.
In your email:
 ✔ say where you were
 ✔ say what was great about the hotel
 ✔ recommend it to your friend
Email example:
FROM: amyparks@mailconnect.com
 SUBJECT: I’m back!
Hi Tony,
 We’ve just come back from Italy. We stayed at the Amorosa Hotel in Bettolle and it was absolutely beautiful. The rooms are large and have beautiful windows, the view is excellent and it wasn’t expensive.
I really recommend the hotel to you and your family. I’m sending you a link to their website because you should book soon. It’s very popular.
Ciao,
 Amy
Useful Language:
 Making a recommendation
 • I (really) recommend …
 • You should …
 • What you should do is …
 • Let me tell you what …
 • I suggest …
 • It’s a must!
 • You (really) have to …
 • Try the …
21 Now write your own answer to the following task.
Task
 You’ve just read a book you really liked. Write an email (60–80 words) to your friend recommending the book.
In your email:
 ✔ say what you read
 ✔ recommend it to your friend
 ✔ say what was great about the story
[Blank lines provided for student to write their email.]
Page 28
WORD FILE
 Travelling
to get to (the airport)
 to take off
 to get on (a plane)
 to fly (back)
 to get off (the plane)
 to suffer from altitude sickness
 to land
 it takes (an hour)
 to get into (a car)
 to rent (a car)
 to get out of (the car)
 to drive (home)
 to set off (for work)
 to work on (a blog)
 to get close to (nature)
 to sleep in a tent
 to escape (the midday heat)
 to cross (a river)
 to meet up with (people)
Image description: A cheerful girl with medium brown skin tone, wearing a green jacket, wide blue trousers, and a tan hat. She’s carrying a pink backpack and rolling a purple suitcase. The verbs listed above float around her on yellow sticky notes.
MORE Words and Phrases
Word or Phrase	Example Sentence	German Translation
1 to become	His feet hurt so badly that walking became difficult.	werden
curious	Reading about all these places makes me curious.	neugierig
decision	Starting to travel was the best decision in his life.	Entscheidung
experience	And in China he had a very painful experience.	Erfahrung
to explore	He started to explore the streets of London.	erkunden, erforschen
journey	His first journey took him to France.	Reise
on foot	He crossed Zanzibar and Tasmania on foot.	zu Fuß
painful	Getting attacked by wasps can be very painful.	schmerzhaft
to reach	He became the first blind person to reach the top of Mount Vesuvius.	(er-)reichen
to sail	He got on board of a ship to sail across the Atlantic.	segeln
traveller	James Holman was a record traveller.	Reisender/Reisende
2 lonely	Holman found his first journey to France lonely.	einsam
4 to criticise	She criticised the Europeans.	kritisieren
explorer	She was a great female explorer in the 19th century.	Entdecker/Entdeckerin
even though	Even though my bike is old, I still like it.	obwohl
hut	She lived with the people in their huts.	Hütte
to turn out	The Fang turned out to be quite friendly.	sich herausstellen
wilderness	In the wilderness she looked like a lady.	Wildnis
5 to behave	You should behave well in other countries.	verhalten
10 all in all	All in all, we had a great time.	alles in allem
awake	By the time we got back, we felt really awake.	wach
pretty	The lake was pretty cold.	hier: ziemlich
unfortunately	Unfortunately, all good things come to an end.	leider
12 departure	The check-in is two hours before departure.	Abflug; Abfahrt
flight	There’s another flight to London at 3 p.m.	Flug
to make a reservation	I want to make a reservation for dinner tonight.	eine Reservierung vornehmen
to note	Please note that you have to check in early.	beachten, feststellen
13 to fix sth.	It took him exactly one minute to fix the problem.	etw. beheben, reparieren
thirsty	I felt really thirsty so I asked for a glass of water.	durstig
14 impossible	It was impossible to get some sleep.	unmöglich
15 recently	Your family went for a short holiday recently.	vor Kurzem, letztens
to get lost	We got lost on the way.	sich verirren
TGNID2 to get to know sb./sth.	I want to get to know the countryside.	jdn./etw. näher kennenlernen
to promise	I’ll call you tomorrow, I promise.	versprechen
to recommend	I can recommend some very interesting books.	empfehlen

```

## Output contract

Write `content/corpus/units/g3-u03/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g3-u03",
  "briefBank": "92c8a1d10f8d",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g3u03.s.it-takes",
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
