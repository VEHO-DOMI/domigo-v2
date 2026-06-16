# Grammar generation brief — g4-u10 (MORE! 4, Unit 10)

<!-- domigo:gen grammar g4-u10 bank=2e7bd10777c1 prompt=4b9164076103 -->

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

### `g4u10.s.third-conditional` — 3rd conditional (with 1st/2nd conditional revision) (Dritter Konditional (mit Wiederholung des 1./2. Konditionals))

The third conditional (If + past perfect, would (not) have + past participle) for an imaginary past situation that did not happen and can no longer be changed. The unit-10 box first revises the 1st conditional (real future) and 2nd conditional (unlikely present/future) before introducing the 3rd.

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [form-third-conditional]: Form the third conditional with If + past perfect (had + past participle) in the if-clause and would (not) have + past participle in the main clause.
  - DE: Du bildest den dritten Konditional mit If + Past perfect (had + Partizip Perfekt) im if-Satz und would (not) have + Partizip Perfekt im Hauptsatz.
  - "If Fair Trade had existed, he wouldn't have sold the farm." — "Wenn es Fair Trade gegeben hätte, hätte er die Farm nicht verkauft."
  - "If you had read the invitation, you would have known what to wear." — "Wenn du die Einladung gelesen hättest, hättest du gewusst, was du anziehen sollst."
- rule [use-impossible-past]: Use the third conditional for an imaginary situation in the past that did NOT happen - it is too late to change it.
  - DE: Du verwendest den dritten Konditional für eine vorgestellte Situation in der Vergangenheit, die NICHT passiert ist - es ist zu spät, sie zu ändern.
  - "If I had known, I would have helped." — "Wenn ich es gewusst hätte, hätte ich geholfen."
  - "If Vicente had known about Fair Trade, he would have joined earlier." — "Wenn Vicente von Fair Trade gewusst hätte, wäre er früher beigetreten."
- rule [three-conditionals-compared]: Compare the three types: 1st (If + present, will = a real future possibility), 2nd (If + past, would = unlikely/imaginary now), 3rd (If + past perfect, would have = it definitely didn't happen).
  - DE: Vergleiche die drei Typen: 1. (If + Präsens, will = reale Zukunftsmöglichkeit), 2. (If + Past, would = unwahrscheinlich/vorgestellt jetzt), 3. (If + Past perfect, would have = es ist definitiv nicht passiert).
  - "If I get a good price, I will sell the farm. (1st)" — "Wenn ich einen guten Preis bekomme, werde ich die Farm verkaufen. (1.)"
  - "If I got a good price, I would sell the farm. (2nd)" — "Wenn ich einen guten Preis bekäme, würde ich die Farm verkaufen. (2.)"

common errors:
- Using 'would' in the if-clause instead of the past perfect: ✗ "If I would have known, I would have helped." → ✓ "If I had known, I would have helped."
- Mixing the second and third conditional forms: ✗ "If I had money, I would have bought it." → ✓ "If I had had money, I would have bought it."
- Leaving out 'have' in the result clause: ✗ "If I had known, I would helped." → ✓ "If I had known, I would have helped."

SB box `g4/sb/More 4 SB Unit 10.txt#grammar-1` — 1st and 2nd Conditional (Revision) 1 If I get a good price, I will sell the farm. 2 If I got a good price, I would sell the farm.:
```
Write 1 or 2. How to use it:
……………… : Der/Die Sprecher/in würde die Farm verkaufen, wenn er/sie ein gutes Angebot erhielte. Es ist aber unwahrscheinlich, dass das passieren wird (z.B. weil die Farm sehr teuer ist).
……………… : Der/Die Sprecher/in wird die Farm verkaufen, wenn er/sie ein gutes Angebot erhält. Es ist wahrscheinlich, dass das passieren wird.
[Image description: A man wearing a feathered coat stands next to a woman in a white gown. They look out of place at a formal event where others are in tuxedos and ball gowns. Caption: “If you had read the invitation, you would have known what to wear.”]
3rd Conditional “If Fair Trade had existed when my dad still had the farm, he wouldn’t have sold it,” she says.
If Vicente had known that Fair Trade pays a fixed price, he would have joined earlier.
If black slaves hadn’t built America, it wouldn’t have become the country we know.
Tick the correct statement. How to use it: ☐ Der/Die Sprecher/in redet über etwas, das in der Vergangenheit liegt. Es ist nicht mehr zu ändern.
☐ Er/Sie redet über etwas, das in der Zukunft liegt. Er/Sie kann es vielleicht ändern.
How to form it: If-Satz: If + Person + past perfect (had + 3rd form)
Hauptsatz: Person + would (not) have + past participle (3rd form)
```

v1 seed items (UNTRUSTED):
- `m4-u10-third-conditional-gf-001` [gap-fill, d1]: p="If I ___ (study) harder, I would have passed the exam." c="had studied" a=["had studied"] ds=["would have studied","studied","have studied"]
- `m4-u10-third-conditional-gf-002` [gap-fill, d2]: p="If she had left earlier, she ___ (miss / not) the train." c="wouldn't have missed" a=["wouldn't have missed","would not have missed"] ds=["didn't miss","wouldn't miss","hadn't missed"]
- `m4-u10-third-conditional-gf-003` [gap-fill, d2]: p="If we had known about the concert, we ___ (go)." c="would have gone" a=["would have gone","would've gone"] ds=["would go","had gone","will have gone"]
- `m4-u10-third-conditional-gf-004` [gap-fill, d3]: p="If Tom ___ (not / break) his leg, he would have played in the final." c="hadn't broken" a=["hadn't broken","had not broken"] ds=["wouldn't have broken","didn't break","hasn't broken"]
- `m4-u10-third-conditional-gf-005` [gap-fill, d4]: p="If you ___ (read) the invitation, you would've known what to wear." c="had read" a=["had read"] ds=["would have read","read","were reading"]
- `m4-u10-third-conditional-gf-006` [gap-fill, d5]: p="We ___ (not / get) lost if we had taken a map with us." c="wouldn't have got" a=["wouldn't have got","would not have got","wouldn't have gotten","would not have gotten"] ds=["hadn't got","wouldn't get","didn't get"]
- `m4-u10-third-conditional-mc-001` [multiple-choice, d3]: p="Which sentence is correct?" c="If I had known about the party, I would have come." a=["If I had known about the party, I would have come."] ds=["If I would have known about the party, I would have come.","If I had known about the party, I would came.","If I knew about the party, I would have come."]
- `m4-u10-third-conditional-mc-002` [multiple-choice, d4]: p="Tom says: 'If I had more money, I'd buy a new phone.' Sarah says: 'If I had had more money last week, I would have bought that phone.' What's the difference?" c="Tom is imagining a present situation; Sarah is talking about a past regret." a=["Tom is imagining a present situation; Sarah is talking about a past regret."] ds=["Both are talking about the past.","Tom is talking about the future; Sarah about the past.","There is no difference — both sentences mean the same."]
- `m4-u10-third-conditional-mc-003` [multiple-choice, d2]: p="Which sentence correctly uses the third conditional?" c="If they had arrived on time, they wouldn't have missed the beginning of the film." a=["If they had arrived on time, they wouldn't have missed the beginning of the film."] ds=["If they arrived on time, they wouldn't have missed the beginning of the film.","If they had arrived on time, they wouldn't miss the beginning of the film.","If they would have arrived on time, they wouldn't have missed the beginning of the film."]
- `m4-u10-third-conditional-ec-001` [error-correction, d2]: p="Find and fix the mistake: If I would have studied, I would have passed the test." c="If I had studied, I would have passed the test." a=["If I had studied, I would have passed the test.","If I had studied, I would have passed the test","If I'd studied, I would have passed the test."] ds=[]
- `m4-u10-third-conditional-ec-002` [error-correction, d3]: p="Find and fix the mistake: If she had told me, I would helped her." c="If she had told me, I would have helped her." a=["If she had told me, I would have helped her.","If she had told me, I would have helped her","If she had told me, I would've helped her."] ds=[]
- `m4-u10-third-conditional-ec-003` [error-correction, d4]: p="Find and fix the mistake: If we had money, we would have bought the tickets." c="If we had had money, we would have bought the tickets." a=["If we had had money, we would have bought the tickets.","If we had had money, we would have bought the tickets","If we'd had money, we would have bought the tickets."] ds=[]
- `m4-u10-third-conditional-tf-001` [transformation, d3]: p="It rained on the school trip and you got wet. Express your regret: 'If we ___ (bring) an umbrella, we ___ (not / get) so wet.'" c="had brought ... wouldn't have got" a=["had brought ... wouldn't have got","had brought ... wouldn't have gotten","had brought, wouldn't have got"] ds=[]
- `m4-u10-third-conditional-tf-002` [transformation, d3]: p="Your friend missed the bus this morning. She says: 'If I ___ (leave) home earlier, I ___ (catch) the bus.'" c="had left ... would have caught" a=["had left ... would have caught","had left, would have caught"] ds=[]
- `m4-u10-third-conditional-tf-003` [transformation, d4]: p="Think about a regret: You ate too much cake and felt sick. 'If I ___ (not / eat) so much cake, I ___ (not / feel) sick.'" c="hadn't eaten ... wouldn't have felt" a=["hadn't eaten ... wouldn't have felt","had not eaten ... would not have felt"] ds=[]
- `m4-u10-third-conditional-tr-001` [translation, d1]: p="🇩🇪 Wenn ich das gewusst haette, haette ich dir geholfen." c="If I had known that, I would have helped you." a=["If I had known that, I would have helped you.","If I had known that, I would have helped you","If I'd known that, I would've helped you.","I would have helped you if I had known that."] ds=[]
- `m4-u10-third-conditional-tr-002` [translation, d5]: p="🇩🇪 Wenn sie frueher losgefahren waeren, haetten sie den Zug nicht verpasst." c="If they had left earlier, they wouldn't have missed the train." a=["If they had left earlier, they wouldn't have missed the train.","If they had left earlier, they would not have missed the train.","They wouldn't have missed the train if they had left earlier.","If they had set off earlier, they wouldn't have missed the train."] ds=[]
- `m4-u10-third-conditional-sb-001` [sentence-building, d2]: p="Put the words in the correct order: had / if / I / known / , / have / I / helped / would / you" c="If I had known, I would have helped you." a=["If I had known, I would have helped you.","If I had known, I would have helped you"] ds=[]
- `m4-u10-third-conditional-mt-001` [matching, d3]: p="Match each if-clause with the correct result clause. 1: If it rains tomorrow, 2: If I were you, 3: If she had studied harder, 4: If you heat water to 100°C," c="{\"1\":\"b\",\"2\":\"d\",\"3\":\"a\",\"4\":\"c\"}" a=["{\"1\":\"b\",\"2\":\"d\",\"3\":\"a\",\"4\":\"c\"}"] ds=["a: she would have passed the exam.","b: we'll stay at home.","c: it boils.","d: I would talk to him."]
- `m4-u10-third-conditional-cp-001` [context-picker, d2]: p="Tom didn't study and he failed the exam. He's talking about it now. Which sentence fits?" c="If I had studied harder, I would have passed." a=["If I had studied harder, I would have passed."] ds=["If I studied harder, I would pass.","If I study harder, I will pass.","If I would have studied, I passed."]
- `m4-u10-third-conditional-gf-007` [gap-fill, d1]: p="If they ___ (arrive) on time, they would have caught the bus." c="had arrived" a=["had arrived"] ds=["would have arrived","arrived","have arrived"]
- `m4-u10-third-conditional-gf-008` [gap-fill, d2]: p="If I hadn't set my alarm, I ___ (oversleep)." c="would have overslept" a=["would have overslept","would've overslept"] ds=["had overslept","overslept","would oversleep"]
- `m4-u10-third-conditional-gf-009` [gap-fill, d3]: p="If she ___ (not / eat) so much cake, she wouldn't have felt sick." c="hadn't eaten" a=["hadn't eaten","had not eaten"] ds=["wouldn't have eaten","didn't eat","hasn't eaten"]
- `m4-u10-third-conditional-gf-010` [gap-fill, d3]: p="If we ___ (take) a taxi, we would've arrived much earlier." c="had taken" a=["had taken"] ds=["would have taken","took","have taken"]
- `m4-u10-third-conditional-gf-011` [gap-fill, d4]: p="She would've called you if she ___ (know) your number." c="had known" a=["had known"] ds=["would have known","knew","has known"]
- `m4-u10-third-conditional-gf-012` [gap-fill, d5]: p="If I ___ (not / forget) my passport, I ___ (not / miss) the flight." c="hadn't forgotten ... wouldn't have missed" a=["hadn't forgotten ... wouldn't have missed","had not forgotten ... would not have missed","hadn't forgotten ... wouldn't've missed"] ds=["didn't forget ... wouldn't miss","hadn't forgot ... wouldn't have missed","wouldn't have forgotten ... hadn't missed"]
- `m4-u10-third-conditional-mc-004` [multiple-choice, d2]: p="If we had left earlier, we ___ on time." c="would have arrived" a=["would have arrived"] ds=["would arrive","had arrived","arrived"]
- `m4-u10-third-conditional-mc-005` [multiple-choice, d3]: p="Which sentence is a correct third conditional?" c="If I had known, I would have helped." a=["If I had known, I would have helped."] ds=["If I would have known, I had helped.","If I knew, I would have helped.","If I had known, I would help."]
- `m4-u10-third-conditional-mc-006` [multiple-choice, d4]: p="If she hadn't missed the bus, she ___." c="wouldn't have been late" a=["wouldn't have been late"] ds=["won't be late","wasn't late","wouldn't be late"]
- `m4-u10-third-conditional-ec-004` [error-correction, d2]: p="Find and fix the mistake: If I would have studied harder, I would have passed." c="If I had studied harder, I would have passed." a=["If I had studied harder, I would have passed.","If I had studied harder, I would have passed"] ds=[]
- `m4-u10-third-conditional-ec-005` [error-correction, d3]: p="Find and fix the mistake: If they had won the match, they would celebrate." c="If they had won the match, they would have celebrated." a=["If they had won the match, they would have celebrated.","If they had won the match, they would have celebrated"] ds=[]
- `m4-u10-third-conditional-ec-006` [error-correction, d5]: p="Find and fix the mistake: If he didn't break his arm, he would have played in the final." c="If he hadn't broken his arm, he would have played in the final." a=["If he hadn't broken his arm, he would have played in the final.","If he had not broken his arm, he would have played in the final."] ds=[]
- `m4-u10-third-conditional-tf-004` [transformation, d2]: p="She didn't bring an umbrella. She got wet. → If she ___, she ___." c="If she had brought an umbrella, she wouldn't have got wet." a=["If she had brought an umbrella, she wouldn't have got wet.","If she had brought an umbrella, she wouldn't have gotten wet.","If she'd brought an umbrella, she wouldn't have got wet."] ds=[]
- `m4-u10-third-conditional-tf-005` [transformation, d4]: p="He spent all his money. He couldn't buy the present. → If he ___." c="If he hadn't spent all his money, he would have been able to buy the present." a=["If he hadn't spent all his money, he would have been able to buy the present.","If he hadn't spent all his money, he could have bought the present.","If he had not spent all his money, he would have been able to buy the present."] ds=[]
- `m4-u10-third-conditional-tr-003` [translation, d3]: p="🇩🇪 Wenn ich das gewusst hätte, hätte ich dir geholfen." c="If I had known, I would have helped you." a=["If I had known, I would have helped you.","If I'd known, I would have helped you.","If I had known, I would've helped you.","If I had known that, I would have helped you."] ds=[]
- `m4-u10-third-conditional-tr-004` [translation, d5]: p="🇩🇪 Wenn es nicht geregnet hätte, wären wir wandern gegangen." c="If it hadn't rained, we would have gone hiking." a=["If it hadn't rained, we would have gone hiking.","If it had not rained, we would have gone hiking.","If it hadn't rained, we would've gone hiking."] ds=[]
- `m4-u10-third-conditional-sb-002` [sentence-building, d2]: p="Put the words in the correct order: studied / had / she / if / harder / , / have / would / she / passed" c="If she had studied harder, she would have passed." a=["If she had studied harder, she would have passed.","She would have passed if she had studied harder."] ds=[]
- `m4-u10-third-conditional-sb-003` [sentence-building, d4]: p="Put the words in the correct order: have / wouldn't / they / if / missed / hadn't / the / they / train / been / late / ," c="If they hadn't missed the train, they wouldn't have been late." a=["If they hadn't missed the train, they wouldn't have been late.","They wouldn't have been late if they hadn't missed the train."] ds=[]
- `m4-u10-third-conditional-mt-002` [matching, d3]: p="Match each if-clause with the correct result clause:" c="{\"1\":\"d\",\"2\":\"e\",\"3\":\"a\",\"4\":\"c\",\"5\":\"b\"}" a=["{\"1\":\"d\",\"2\":\"e\",\"3\":\"a\",\"4\":\"c\",\"5\":\"b\"}"] ds=["1: If I had woken up earlier, ...|2: If she hadn't forgotten the tickets, ...|3: If we had studied together, ...|4: If it hadn't snowed, ...|5: If he had listened to the teacher, ...","a: we would have passed the test.|b: he would have understood the lesson.|c: we would have gone to the park.|d: I wouldn't have been late for school.|e: they would have got into the concert."]
- `m4-u10-third-conditional-cp-002` [context-picker, d4]: p="Your friend missed the school trip yesterday because she was ill. You feel sorry. Which sentence is correct?" c="If she hadn't been ill, she would have come on the trip." a=["If she hadn't been ill, she would have come on the trip."] ds=["If she wasn't ill, she would come on the trip.","If she wouldn't have been ill, she had come on the trip.","If she isn't ill, she will come on the trip."]

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
- **g3-u11**: canyon, dirt road, ridge, headquarters (pl), to spot sth., a dry place, to have no signal, backpack, fabulous, height, capital, independent, innovation, state, to commute, connection, programmer, steep, to crack, four-wheel drive, gold digger, gold rush, lip, mountain range, shade (no pl), to be situated, thirst, criminal, cyclist, familiar, ferry, guided, to take over, to catch (the train), information office, railway, totally
- **g3-u12**: drought, earthquake, hurricane, volcanic eruption, mudslide, avalanche, forest fire, tsunami, flood, fire drill, escape route, smoke detector, meeting place, to check doors, to crawl low, to stop, drop & roll, research, to be trapped, pressure, surface, undersea, border, damage, to evacuate, to measure, region, violent, to keep away from, to fall down, to realise, survival, underneath, ash, castaway, to deliver, delivery company, flame, to get used to, hometown, joy, parcel, raft, shelter, to turn into, miracle, desert island, pleasure (no pl), in case of, lighter, to collapse
- **g3-u13**: to make up your mind, to sleep on it, to find a way out of a dilemma, to be in two minds about sth., to have second thoughts about sth., to be at a loss, dilemma, to reach a decision, to cancel, disappointment, granddad, to kick sb. off, to move, to rethink, to deserve, except, It's a shame., lift, alibi, ID (=identification), to keep quiet, to tell on sb., detention, to put up, to ask sb. out, accidentally, to argue, to look the other way, to pretend, to reject, homemade, neither of, voucher, to wrap
- **g3-u14**: to plan a trip, to book a holiday, to make a hotel reservation, to hire a car, to check the area out online, to buy a dictionary, to find out about good restaurants, to find information about the best beaches, to look at a map of the area, to find out what to do there, bug, to prefer, official language, balcony, crime, to dig, shocked, wild animal, wetland, otherwise, stuffed, wildlife, at once, branch, by the way, impolite, round a bend, bush, cut, to drive off, engine, front seat, park ranger, sunburn, to turn over, to whisper, crash
- **g4-u01**: be aware of sth, Catholic, fluent, independent, leading, member, primary school, cattle, cheer, crop, famine, found, free state, fungus, government, grain, incident, intention, interfere, landlord, majority, put down, shake hands, starve, Guess!, I'd rather, foreigner, improve, tax, hiking, proper, admire, be terrified, nonsense, thunder, unconscious
- **g4-u02**: illegal, suspect, criminal, to steal, evidence, victim, blackmail, murder, weapon, witness, chest, employee, mystery, report, attractive, nephew, office clerk, keep an eye on, confusion, relative, retire, right away, take over, unlock, upset, consider, mention, likely, besides, expect, handkerchief, Never mind., suspicion, wastepaper bin, excellent, conclusion, get hold of sth, prove, historical, commit, escape, investigation, common, personal, crime scene, realise
- **g4-u03**: busy, cuisine, immigrant, native, nearby, origin, politics, announcement, be in trouble, blow up, emergency landing, evacuate, flock of birds, glide down, miracle, on duty, rescue boat, runway, takeoff, treatment, wing, become desperate, collide, explode, bravery, reward sb, critic, elevator (AE), campaign, charge, crowd-funding, statement
- **g4-u04**: accountant, receptionist, mechanic, nurse, health care, marketing, finance, electrician, secretary, flight attendant, computing, computing, finance, health care, sales and marketing, deserve, female, male, satisfaction, unemployed, career, be keen on, be responsible for, bonus, deadline, develop, earn, launch, pros and cons, salary, think up, working hours, advice, ambition, casual, company, confidently, employer, enthusiastic, eye contact, (job) interview, memorise, naturally, skills, journalism
- **g4-u05**: artificial, fattening, filling, revolting, harmful, healthy, nutritious, fresh, tasty, vegetarian, afford, feed, hunger, intake, waste, contain, cookery, diet, even though, health, nutrition, overweight, regularly, dislike, habits, accept, afterwards, eating disorder, gain, gym, thin, throw up, (be) ashamed, trust
- **g4-u06**: achieve, donate, drop out (of school), goal, income, inspire, support, encouragement, community, exceed, frustrated, grateful, in particular, learn a lesson, range of, relate to, Small wonder, transmit
- **g4-u07**: Aborigine, cheque, envelope, airline, ancestor, bush trail, crawl, drag, excess weight, gorgeous, grab, headlight, heritage, jump-start, pressure, shade, string, reed, track, survival skills, walkabout, aircraft, ambulance, detailed, distance, drugs, first aid, landing, (the) outback, provide
- **g4-u08**: black market, collect, collection, fascination, rare, auction, burn to the ground, copy, execute, furious, judge, librarian, library, monastery, monk, precious, preserve, rob, sentence to death, shorten, addict, addiction, command, go crazy, miss out on sth, pale, turn up, whisper, sheet, confuse sb, kitschy
- **g4-u09**: border, communicate, fashionable, firstly, funeral, health risk, in common, needle, permanent, pierced, rebellious, religious, ceremony, bury, devil, confused, Far East, gesture, greet, index finger, insult, nod the head, palm, pass something on, thumb, victory, zero, decent-looking, embarrassed, giggle, goth, hastily, ignore, sigh, sitting room, scare off, sleeve, possibility, wedding dress, wedding suit, bride, bridegroom, bridesmaid
- **g4-u10**: oil, Fair Trade, farmer, make a living, pay rise, pesticide, select, agreement, increase, rate, brother-in-law, defeat, harmony, human being, hurtful, ignorance, overcome, painful, racism, racist, recognition, slavery, son-in-law, angry, annoy, helpless, hurt, misunderstood, proud, shocked, surprised, claim, bicycle, fairness, hell, introduction, pollution

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abigail, Aboriginal, Abraham, Adrian, Adverbs, Africa, African, Africans, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amber, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Augustino, Aussage, Australia, Australian, Australiens, Austria, Austrians, Award, Ayers, Aztecs, Bacon, Baker, Balcony, Barbie, Barcelona, Bartholdi, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Between, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bluetooth, Bob, Body, Boer, Bolt, Bond, Bondi, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Broome, Brown, Buckells, Buckingham, Buddy, Bulgaria, Burgers, Busy, Butterfly, Buy, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolina, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Chappell, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Conditional, Continuous, Control, Convention, Cooperative, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Dawn, Dean, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dias, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dracula, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Dutch, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Elizabethan, Ellen, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Ereignis, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, Fair, False, Fame, Fang, Far, Faye, Feeling, Felicity, Fell, Fidel, Fido, Fink, Fleming, Flicka, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Getty, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Greece, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Gulbenkian, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harbour, Harper, Harris, Harrison, Harry, Harten, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hilfsverb, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Iceman, Imagine, Imperatives, Inc, India, Indonesia, Indonesian, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Italian, Italians, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Japanese, Jasmine, Jason, Jasper, Jay, Jeff, Jefferson, Jeffery, Jenkins, Jennifer, Jenny, Jensen, Jeremy, Jessica, Jessie, Jewels, Jill, Jim, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Jr, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katia, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kids, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Kwame, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Lawrence, Leah, Leeds, Legion, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Luther, Machu, Madonna, Mail, Malala, Malaysia, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Manubay, Maple, Margaret, Marilyn, Mario, Mark, Marley, Marlo, Marple, Mars, Martello, Martin, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Maybe, Mead, Megan, Mei, Meridian, Message, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Millers, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgan, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Myers, Nancy, Napa, Natasha, Nathan, National, Natural, Navy, Neill, Neither, Nelson, New, Newman, Newtown, Next, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Noble, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Obsessed, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Opera, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patricia, Patti, Patxot, Paul, Paula, Paws, People, Pepys, Perth, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plants, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Potter, Prepositions, Present, President, Priestly, Princess, Pro, Professor, Project, Protestant, Pulitzer, Pump, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebecca, Rebellion, Recherche, Recyclers, Red, Redwood, Reihenfolge, Renato, Republic, Revision, Revolution, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Rottnest, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Sheila, Shelter, Sherlock, Shrek, Sicily, Sie, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Society, Sofia, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Sprecher, Square, St, Stallone, Star, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sydney, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Territory, Tesla, Teterboro, Text, Thailand, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trade, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Twain, Uhr, Uluru, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vicente, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Wars, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willow, Wilson, Wise, Wolf, Work, Workout, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe, Zukunft

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 4 SB Unit 10.txt -----
Unit 10 A fair world
Page 82–83
You learn
about Fair Trade
about racism
how to use conditional sentences
You can
talk about feelings
write a statement
design your own website
make excuses
talk about racism
Did you know ... ? Coffee is the most popular drink in the world. A coffee tree can produce up to 6 kilos of coffee a year. A third of the world’s coffee is produced in Brazil. Oil is the number 1 product that is bought and sold in the world. Coffee is number 2.
1 a Look at the pictures and guess the answers to these questions. 1 Who are the people? 2 Where do they live? 3 What are they doing?
b Read the text and check your answers.
2 In your exercise book, complete the fact sheet about Sofia and Vicente.
Sofia works for a ... in ... She works very ..., but ... She hasn’t got a car, a ..., a ..., or a ... She has heard about farmers who ... Her dad would never have sold ...
Vicente is not as worried about ... as ... Vicente joined ... Vicente gets a fixed ...
Hard work for little money
Sofia Gomez works for a large coffee company in the hills of Honduras. Her dad was a coffee farmer too, but he sold his farm to the company because he couldn’t make enough money to make a living. Sofia works very hard, getting up at daybreak and getting to bed very late, but she can never save any money. She has just enough to buy food and clothes for herself and for her two children and her mother. She hasn’t got a car, she hasn’t got a TV, she only has an old fridge and a small radio. From radio she’s heard about Fair Trade. They pay small coffee farmers a fair price for their coffee. This helps them to live without having to worry about food, clothes and medicine.
“If Fair Trade had existed when my dad still had the farm, he wouldn’t have sold it,” she says. “And my life would be better! Now all I can hope for is to keep my job and maybe a pay rise.”
Vicente Peres's farm is only three hours away from Sofia’s. Vicente is not as worried as Sofia. Vicente and twenty other farmers are part of a Fair Trade project. They get a fixed price for their coffee and they don’t use pesticides. On their small farms there are lots of trees that give shade to the coffee plants and there are also banana trees and avocado trees. This is good for the environment.
Vicente joined the project a year ago. If he had known that Fair Trade pays a fixed price, he would have joined earlier. Now he is happy because he doesn’t have to worry about feeding his children or buying them clothes or books for school.
Coffee beans are ...
picked
selected
dried
& roasted
3 Listen to a journalist talking to students and tick the correct answer. The journalist is explaining
4 Listen again and answer the questions. 1 Why did coffee prices never fall below a minimum until 1989?
2 When was the International Coffee Agreement stopped?
3 What was the minimum price for half a kilo of coffee before 1989?
4 What is the price now?
5 What does the concept of “fixed price” mean?
6 How much do the farmers get for a kilo of Fair Trade coffee?
Free flow
5 Work in groups. Discuss these questions and report your findings to the class. 1 Are there any shops that sell Fair Trade products where you live? 2 Why are Fair Trade products more expensive than "normal" products? 3 Do you buy Fair Trade products? Why / Why not?
Page 84–85
6 a Who is the man in the first picture? What do you know about him?
b Read the blog entries and put a X in the correct boxes.
This person 1 has a friend who has suffered from racism.
2 gets upset by racist comments made by a family member.
3 believes that black people don't get enough recognition.
4 isn’t trying to be a black person.
5 doesn’t understand how people can be so mean.
6 believes we can defeat racism if we work together.
This person	Martin	Amy	Jason
1	[ ]	[ ]	[ ]
2	[ ]	[ ]	[ ]
3	[ ]	[ ]	[ ]
4	[ ]	[ ]	[ ]
5	[ ]	[ ]	[ ]
6	[ ]	[ ]	[ ]

c Look at the underlined words in the text. What does each one refer to?
E.g.: they refers to white people
Diary Project - Living together in harmony
Racism Martin Luther King Jr., winner of the Nobel Peace Prize, said, “I want to be the white man’s brother, not his brother-in-law.”
Racism comes from fear and ignorance of other cultures. But you can make a difference. Because, in the end, we’re all the same – we’re just human beings. Write us an email in the form of a diary entry.
Why are black people always put down? (by Martin, 15, male) White people often believe they’re better than black people. But what about the positive things black people are doing? It’s painful that even in history books black people are not respected enough for their work. They have done great things in history that many people don’t know about. If black slaves hadn’t built America, it wouldn’t have become the country we know. Our grandfathers overcame slavery. Let’s all work together now – we can overcome racism!
Hurtful comments (by Amy, 14, female) Whenever my dad sees me watching TV shows or listening to music with a black actor or singer/rapper, he makes a comment like “Look at my little black girl.” I’m white. He also says he’s going to have a son-in-law who’s black. I don’t understand why he makes the comments. I hang out with a lot of black people. But I’m not trying to be them, I just love hanging out with my black friends. I have white friends, too, and I wish my dad would think before he makes comments that hurt my feelings.
Why???? (by Jason, 15, male) I can’t BELIEVE what happened today! Some idiots threw EGGS at K’s house because she’s Middle Eastern!!!! It was awful: the stink of half-rotten eggs and the foot-high letters in red spray paint on the garage door saying TERRORISTS GO HOME. Why would people attack my best friend just because of her religion and where she’s from????? I helped her clean it up ... she was crying. I’d never seen her cry before. I can’t see why people would do this when she’s just trying to be a normal 16-year-old!
Vocabulary - Feelings 7 Use a dictionary to find the meaning of the words below.
angry
helpless
proud
annoyed
hurt
shocked
frustrated
misunderstood
surprised
Get talking 8 Work with a partner. For each blog entry, say how the writers feel and what they believe and want to achieve.
Martin	feels: annoyed because …, hurt by … because …, shocked because …
Amy	angry because …, frustrated because …, surprised because …
Jason	proud of …, misunderstood by …

Martin	believes: it is wrong that …
Amy	thinks: most people … / whites/blacks …
Jason	wants: everybody/nobody should …
	claims: people / … father / … to …
	that people don’t …

9 Say what you think about racism.
In my opinion, …
I feel very strongly that …
I see what you mean. In my opinion …
I can/can’t understand that / why …
I think people should … because …
10 Do the ‘word sums’ to make the noun forms of the adjectives above.
Adjective	minus (–)	add (+)	= Noun
1 angry	ry	er	anger
2 annoyed	—	ance	annoyance
3 frustrated	—	ion	frustration
4 helpless	—	ness	helplessness
5 misunderstood	ood	anding	misunderstanding
6 proud	—	ide	pride
7 shocked	ed	—	shock
8 surprised	—	—	surprise

Page 86–87
11 CHOICES Writing for your Portfolio
A Look at the Diary Project in 6 again and then write your own statement about racism (40–70 words). Write about:
who is being treated unfairly
what you do about it
what people in general should do
B Work in groups. Look at the website below and then design your own website. Check on the internet for ideas you want to write about, e.g. Fair Trade, fair food, racial fairness, fairness to animals, fairness to the planet Earth, etc. Remember to use paragraphs.
Write your texts. Look at the text below for a model.
Write an introduction identifying the problem.
Give (at least) two examples.
Make suggestions about what could be done to improve the situation.
Don’t forget to give your text an interesting title!
Illustrate your text.
www. A Fair World .com
[Navigation buttons: Fair Trade | Fair food | Fair to planet Earth | Fair to animals | Racial fairness]
On the road to hell!
There are over 950 million cars in the world today. Experts say that the number of cars on Earth will double in the next 30 years. This creates a lot of problems.
Firstly, lots of cars mean a lot of pollution. The air in some of the big cities has become so bad that many people suffer from the smog. But it’s not only people who suffer – pollution is bad for trees, rivers and lakes.
Secondly, there are lots of accidents every year because there are so many cars. It is terrible that one million people every year die in road accidents.
So what can we do? I think there should be more buses and trains in big cities and people should use them more often. But there should also be more bicycle tracks so people can ride their bikes safely.
GRAMMAR
1st and 2nd Conditional (Revision) 1 If I get a good price, I will sell the farm. 2 If I got a good price, I would sell the farm.
Write 1 or 2. How to use it:
……………… : Der/Die Sprecher/in würde die Farm verkaufen, wenn er/sie ein gutes Angebot erhielte. Es ist aber unwahrscheinlich, dass das passieren wird (z.B. weil die Farm sehr teuer ist).
……………… : Der/Die Sprecher/in wird die Farm verkaufen, wenn er/sie ein gutes Angebot erhält. Es ist wahrscheinlich, dass das passieren wird.
[Image description: A man wearing a feathered coat stands next to a woman in a white gown. They look out of place at a formal event where others are in tuxedos and ball gowns. Caption: “If you had read the invitation, you would have known what to wear.”]
3rd Conditional “If Fair Trade had existed when my dad still had the farm, he wouldn’t have sold it,” she says.
If Vicente had known that Fair Trade pays a fixed price, he would have joined earlier.
If black slaves hadn’t built America, it wouldn’t have become the country we know.
Tick the correct statement. How to use it: ☐ Der/Die Sprecher/in redet über etwas, das in der Vergangenheit liegt. Es ist nicht mehr zu ändern.
☐ Er/Sie redet über etwas, das in der Zukunft liegt. Er/Sie kann es vielleicht ändern.
How to form it: If-Satz: If + Person + past perfect (had + 3rd form)
Hauptsatz: Person + would (not) have + past participle (3rd form)
Page 88–89
The Girl Next Door 5
DEVELOPING SPEAKING COMPETENCIES
 Language function
 • Making up excuses
 Speaking strategy
 • Expressing annoyance
The meeting
1 🎧 Watch or listen to the dialogue. Then read it.
Tom Hi, Kate.
 Kate Oh, it’s you. I didn’t recognise the number. Yeah, I’m on the house phone. Listen, about the meeting.
 Kate The meeting?
 Tom Yes, your meeting to organise a Fair Trade event.
 Kate Oh, that meeting. I’d forgotten. Like someone else …
 Tom I know. I know I wasn’t there. I was going to call …
 Kate No, no. You don’t need to say anything. It’s OK.
 Tom Kate. I feel really bad. I meant to call you. I really did, but …
 Kate But nothing, Tom. I organised a meeting for something that I really care about. I thought you cared about it too. You obviously don’t. There’s nothing really to talk about.
 Tom Come on, don’t be like that, Kate. Let me explain. Something happened and I didn’t want to worry you.
 Kate You didn’t want to worry me. That’s very kind. Tom, the meeting was yesterday. Why are you apologising now?
 Tom Well, I was going to call you last night but my phone’s broken. I know it’s no excuse but I think you’ll understand when you see me.
 Kate When I see you? I’m not really sure I want to see you at the moment.
 Tom Please, Kate. Let me come round.
 Kate Well, OK. But you’ll have to be quick. I’m meeting up with all the people who did come to the meeting. Luckily, I didn’t have to rely just on you.
 Tom I’ll be round in five. I think you’re going to forgive me.
(Image description: Close-up of two teenagers, Tom and Kate, in mid-conversation, framed in a video still with a white triangular play button overlaid.)
2 Decide if the sentences are T (True) or F (False).
 1 Tom doesn’t usually phone Kate on his house phone. T / F
 2 Tom is calling about the Fair Trade meeting. T / F
 3 Tom didn’t want to go to the meeting. T / F
 4 Kate is upset with Tom. T / F
 5 Kate thinks Tom is late with his apology. T / F
 6 Tom thinks he has a good excuse. T / F
 7 Not many people went to the meeting. T / F
 8 Kate doesn’t want to see him. T / F
3 Useful phrases Making up excuses
 a Put the words in order. Check in the dialogue in 1.
 1 call / I / was / to / going
 2 call / I / you / to / meant
 3 be / don’t / that / like /
 4 worry / want / I / to / you / didn’t
 5 excuse / It / is / no / know
b What do you think? Answer the questions.
 1 What is Tom’s excuse?
 2 Does Kate forgive him?
Mobile homework
 Watch the second part of the video and complete Tom’s diary entry with 1–4 words for each space.
Unbelievable! I’ve 1 .................................................... for the second time this year. And this time it was all my fault. I’d just collected 2 .................................................... from the shop. They were much 3 .................................................... than I’d expected. Anyway, I was ...
 I probably should have 5 ...................................................., so getting them home was going to be difficult.
 home I 6 ...................................................., and that’s how it all happened. At least Kate’s forgiven me for missing the meeting.
Speaking strategy Expressing annoyance
4 Complete. Then check with the dialogue in 1.
 Tom I know. I know I wasn’t there. I was going to call …
 Kate No, no. Y ……………………. d ……………………. t ……………………. a ……………………. It’s OK.
 Tom Kate. I feel really bad. I meant to call you. I really did, but …
 Kate B ……………………. n ……………………. , Tom. I organised a meeting for something that I really care about. I thought you cared about it too. You obviously don’t. There’s n ……………………. r ……………………. t …………………….
5 ROLE PLAY: Look at the role cards below. Take 4–5 minutes to practise your dialogue. Don’t write it down. Act it out for the rest of the class.
Student A
 You promised your partner to go over to his/her house and help him/her with their homework. But you didn’t. It’s the next day and you are trying to apologise. What is your excuse?
Student B
 Your partner promised to come and help you with your homework last night – and didn’t. You’re really annoyed. Try to forgive him/her after the apology.


----- WB: More 4 WB Unit 10.txt -----
UNIT 10 – A fair world
Page 76–77
Reading 1 Read the text. Cocoa farmer Kwame Agyeman talks about the changes Fair Trade has brought to lives in their community.
Fair Trade – Making a difference
In this part of Ghana, cocoa is all we have and everyone in our village works on cocoa farms. We depend on the money we get from cocoa to buy everything we need: food, clothes, books for school and medicine.
Without it we would not be able to survive here. It hasn’t always been easy. In the past we had to deal with some terrible companies that only thought about their profits and did not care about the people who worked for them. We never knew when we were going to get paid or how much we were going to get paid for our beans. Sometimes we didn’t get paid at all. Imagine that – working more than ten hours every day for six days a week and then getting nothing at the end of it. They were very difficult times for us. That all changed when Fair Trade arrived in our area about five years ago. Now, the company we work for pays all the farmers a fair price for their cocoa beans, and they always pay on time and in cash*.
We prefer that. Even if the price of cocoa beans drops, we still get our money and we can make plans for the future without worrying if we will be able to afford things. If it hadn’t been for Fair Trade, I wouldn’t have been able to send my children to school and give them the opportunity for a better life. They would have had to start working on the cocoa farms when they were 12, like I did. When my mother was sick, I wouldn’t have had the money to send her to the hospital in the next town. She would probably have died there without the medicine.
Fair Trade has saved her life – and has made life better for all of us. But it’s not just for my family that it has made a big difference. In our village we have used the extra money that Fair Trade has brought us to build new wells* for getting water. If this hadn’t been possible, we would have continued to walk for miles every day to collect water from the river. That water was often dirty and it made us ill. If we hadn’t been able to build wells, many lives would have been lost. We are all very happy that we have these wells. This is the first time our village has had clean water like this. It has made a big difference to everyone living here.
These days we sell about 60% of our beans to Fair Trade companies. Unfortunately we still have to sell the rest to companies that don’t treat us fairly. If we sold more of our cocoa beans to Fair Trade companies, we would be able to improve life in our village even more. One day we hope that this becomes a reality.
VOCABULARY “pay in cash” – bar bezahlen
well – Brunnen
2 How many of these tasks can you do? Check your answers with a partner.
1 Everyone in Kwame’s village depends on cocoa for an income. T / F
2 In the past, Kwame would sometimes not get paid for his work. T / F
3 Kwame usually knows when he will get paid these days. T / F
4 Fair Trade means Kwame’s children ………………………………………………………………..
5 Kwame started working on cocoa farms …………………………………………………………..
6 There is no ………………………………………………………………. in Kwame’s village.
7 What have the villagers spent their extra money on? …………………………………………………..
8 How did they get water in the past? ……………………………………………………….
9 What does Kwame want for the future? ……………………………………………………………….
Listening
3 Listen to the radio show and answer the questions.
1 Who came up with the idea for Buy Nothing Day?
2 When is Buy Nothing Day this year?
4 Listen again and choose the correct answer to the questions.
1 How much time does the average British person spend shopping?
☐ 18 hours a week
☐ 18 hours a month
☐ 18 days a year
2 How long has Buy Nothing Day been running for?
☐ about 10 years
☐ 15 years
☐ about 30 years
3 What is the main message of Buy Nothing Day?
☐ Think more about your family.
☐ Enjoy the things that are really important in life.
☐ Think carefully about what you spend your money on.
4 What does Miriam want companies to do?
☐ Stop trying to sell us things we don’t need.
☐ Encourage people to recycle.
☐ Be more fair in the ways they do things.
5 What can you do at a swap shop?
☐ Change your things for things from other people.
☐ Buy things from other people rather than from shops.
☐ Give things you don’t need to poor people who do need them.
6 What’s the ‘bravest’ thing you can do on Buy Nothing Day?
☐ play in a band at a concert
☐ protest outside the shops
☐ get rid of your credit card
Page 78–79
Grammar: Conditionals
5 Which conditional is it? Write 1, 2 or 3.
If I see Jim, I’ll tell him. [ ]
I’d be happier if I didn’t have so much homework. [ ]
If we’d left earlier, we wouldn’t have missed the bus. [ ]
She’ll be upset if you don’t invite her. [ ]
If you tried harder, you’d pass the exam easily. [ ]
I would have gone to your party if I hadn’t been ill. [ ]
6 Match the sentences and the pictures. (A to F with 1 to 6)
Pictures: A: Girl thinking of a dog and a garden gate B: Girl happy on the doorstep C: Girl sitting outside locked door D: Two people walking in the rain E: Girl unlocking door F: Girl dreaming in bed
Sentences:
If Peter had known the Millers have a new dog, he wouldn’t have opened the garden gate.
If Peter knew the Millers have a new dog, he wouldn’t open the garden gate.
If Jane finds her key, she’ll get into her house.
If Jane had found her key, she would have got into her house.
If it hadn’t rained, they wouldn’t have got wet.
If they didn’t have an umbrella, they would get wet.
7 Complete the sentences with the correct form of the verbs in brackets.
If you buy Fair Trade products, you __________________ farmers get a fair price for their goods. (help)
If I __________________ more time, I’d go and see that new designer shop in town. (have)
I __________________ that jacket if I had the money. (buy)
I wouldn’t do that if I __________________ you. (be)
How __________________ to school if there’s a bus strike tomorrow? (you / get)
The things we buy would be more expensive if labour __________________ so cheap in some countries. (not be)
If you had asked him, I’m sure he __________________ you. (help)
I wouldn’t have gone to her party even if she __________________ me. (invite)
8 Write questions about these things.
lose €100 What would you do if you lost €100?
win €1 million
be President of Austria
live in England
find a stray* dog
meet your favourite singer
*VOCABULARY: stray – streunend
9 Write a 3rd conditional sentence about each of these situations.
Kevin didn’t do his homework. He got into trouble. If Kevin had done his homework, he wouldn’t have got into trouble.
Olivia lost her phone. She couldn’t phone her mum.
Brian missed the bus. He had to walk home.
Lucy ate too much. She was ill.
James fell off his bike. He broke his arm.
Tracy lent me £5. I could go to the cinema.
10 Rewrite the two sentences to make a new one.
I didn’t hear the alarm clock. I woke up late. If I had heard the alarm clock, I wouldn’t have woken up late.
I haven’t got any money. I want to buy an ice cream. If ______________________________________
We want to go to the beach tomorrow. It depends on the weather. If ______________________________________
Paul didn’t watch the film. He had a headache. If ______________________________________
We got lost. We didn’t have a GPS with us. If ______________________________________
I want to buy a new computer. I hope I get some money for my birthday. If ______________________________________
Paulo doesn’t speak English. That’s why he doesn’t talk to you. If ______________________________________
Dad saw the other car coming. We didn’t have an accident. If ______________________________________
Page 80–81
Vocabulary
11 Read the situations and match them with the pictures.
1 A man with no job steals some food from a shop – he goes to prison for 6 months. A rock star is caught when he steals a pair of trousers from a shop – he pays a fine of €10,000.
 2 A girl studies very hard for a test and gets a mark of 62%. Another girl doesn’t study for the test at all, but gets 96%.
 3 Your teacher tells you off for talking. When you say you were helping your friend understand the lesson, she sends you out of the classroom for answering back.
 4 A racing driver is in a very bad crash. He goes to hospital, where two nurses help him. The racing driver earns €15 million a year. The nurses each earn €12,000 a year. He leaves without even saying thank you.
12 Read the comments and complete them with adjectives from p. 85 of your Student’s Book.
 Which of the comments above are these people talking about? Write the number in the box.
1 “He only took the food because he felt so h_ _ _ _ _ _ _ _ . Nothing to eat and no money. What could he do?”
 2 “Well, she can feel p _ _ _ because she did well, but more importantly, she was honest.”
 3 “I’d feel h_ _ _ _ _ _ _ _ because I expect people to be polite. It doesn’t matter who they are.”
 4 “She must feel f_ _ _ _ _ _ _ _ _ because she worked really hard for it.”
 5 “I would feel e_ _ _ _ _ _ _ _ _ _ _ _ _ not being able to make my teacher see what I was doing.”
 6 “I feel so a_ _ _ _ for the rich and the famous and one law for the rest of us.”
 7 “If I was looking after him, I’d feel s_ _ _ _ to learn how much he got paid.”
 8 “I would feel f_ _ _ _ _ _ _ _ _ _ _ _ _. Getting told off for trying to be helpful.”
13 Read Cindy’s diary entry about an unfair situation at school. Who do you think felt:
 • annoyance • anger • helplessness • pride • frustration • shock
 Explain your reasons.
 Example: The teacher probably felt annoyance because the students were messing around in his class.
I’ll never forget what happened today in Maths. Nick was throwing little balls of paper at Mr Twain, our teacher, when his back was turned. When he turned round, Nick stopped. Everyone laughed except for me. Mr Twain turned his back again and one of Nick’s paper balls landed on me. I was furious and I threw it back. Mr Twain turned round and saw me! He said, “Isn’t that a bit childish? Please pick up all the balls!” What should I have done? If I had said it wasn’t me, the teacher wouldn’t have believed me. If I had said it was Nick, Nick would have been angry. So I got up from my seat, and went to pick up all the paper balls. Nick was sitting there, smiling. I wanted to shout at him.
Developing speaking competencies
14 Put the words in order.
1 Helen / need to / You / don’t / anything / say
 2 talk / nothing / to / There’s / about / really
 3 was / I / you / call / going / to
 4 you / I / to / But / call / meant
 5 excuse / know / I / it’s / no
 6 Jim / be / Don’t / that / like
15 Use the phrases above to complete the dialogue.
Helen: What’s the matter with you, Jim? You look a bit angry.
 Jim: I’m not a bit angry. I’m very angry.
 Helen: Is it because I didn’t call you last night?
 Jim: …
 Helen: …
 Jim: But nothing Helen. I waited for three hours for you to call.
 Helen: …
 Jim: Then Ian rang and he said he couldn’t make it so I decided not to go.
 Helen: And you didn’t think it was important to let me know?
 Jim: I just forgot. …
 Helen: Listen, let’s go and get a coffee and talk about …
 Jim: You’ve obviously got more important things to do than think about me.
 Helen: I’m sorry. What can I say?
 Jim: …
 Next time I’ll know better than to trust you.
16 Now listen and check.
Page 82–83
Developing writing skills – Giving reasons
17 Read the task and what a student wrote. Where does the writer live?
Task
Write a blog comment (50–70 words). In it:
reply to the entry before which says there are too many foreigners in the country
say what you believe is wrong about it
tell the other readers your conclusion
In your latest blog entry you say that we can’t take in everybody who wants to come to our country. I believe you are mistaken. We’re NOT taking in everybody, in fact, it’s a tiny percentage. Consequently I feel that we’re not being overrun by foreigners and asylum seekers. In my village there are exactly TWO people from foreign countries. For this reason I would kindly ask you to study the facts before you post something that’s just not true.
18 Read the text again. Underline the words that introduce the writer’s reasons in one colour and the phrases that show this is the writer’s personal opinion in another.
Useful language Introducing a reason:
therefore / as a result / consequently / for this reason /
that’s why / because (of …) / since / so (less formal)
Offering a personal opinion:
I think / I suppose / I believe / I guess / I mean / I feel …
Writing tip:
When giving a reason (or showing a logical consequence), the conjunctions* above are extremely useful. When it is a personal opinion, you should use one of the verbs given above.
Make sure that your reader knows what you are referring to when you want to criticise or correct him/her. Try not to be rude even when you feel strongly about your opinion.
VOCABULARY: conjunction – Bindewort
19 Now write your own answer to the following task.
Task
Read the blog comment below and write an answer to it in which you criticise the comment (40–70 words). Say:
what you think is wrong about it
what you conclude from the ‘facts’ offered there
what your reasons are for a different view of Fair Trade products
I’m surprised people still believe in Fair Trade. I know for a fact that it’s just used to sell more goods and make you feel less guilty about buying things from abroad.
MORE Words and Phrases
No.	Word	Example Sentence	Translation
1	oil	Oil is very precious in our society.	Öl
2	Fair Trade	The Fair Trade project gives farmers more money for their products.	eine Organisation, die sich für fairen Handel einsetzt
3	farmer	My uncle is a farmer. He owns a farm with cows and horses.	Landwirt/in
4	make a living	He made a living by working as a cook.	den Lebensunterhalt verdienen
5	pay rise	She got a pay rise for her good work.	Gehaltserhöhung
6	pesticide	Pesticides are used to stop insects and fungus destroying crops.	Pestizid, Insektenbekämpfungsmittel
7	select	Only the best beans are selected.	auswählen
8	agreement	Fair Trade is an international agreement.	Vereinbarung
9	increase	The world’s population increases each year.	steigen, erhöhen
10	rate	The number of crimes is increasing at an alarming rate.	Rate
11	brother-in-law	The man who married my sister is my brother-in-law.	Schwager
12	defeat	He defeated the champion in three sets.	besiegen, überwältigen
13	harmony	Our dream is that all the peoples of the world should live in harmony.	Harmonie
14	human being	Human beings are the people on this planet Earth.	Mensch
15	hurtful	He was horrible. He said some hurtful things.	verletzend
16	ignorance	Their ignorance makes them do stupid things.	Ignoranz
17	overcome	I want to overcome my fear of flying.	besiegen, überwinden
18	painful	I hurt my ankle yesterday. It’s still very painful.	schmerzhaft
19	racism	Martin Luther King Jr. led the anti-racism movement for civil rights in America.	Rassismus
20	racist	He made racist comments about black people.	rassistisch
21	recognition	She got a lot of recognition for her work.	Anerkennung, Bestätigung
22	slavery	For two hundred years Africans were sold into slavery in America.	Sklaverei
23	son-in-law	Your son-in-law is your daughter’s husband.	Schwiegersohn
24	angry	The passengers were angry because of the delay.	wütend
25	annoy	Don’t phone at home. You’ll annoy my parents.	verärgern
26	helpless	The gang attacked a helpless victim in the park.	hilflos
27	hurt	It hurt me to think that he would lie.	verletzen
28	misunderstood	No one really believes me. I’m misunderstood by everyone.	missverstanden
29	proud	She was proud that her daughter had so much talent.	stolz
30	shocked	Many people were shocked by the nude scene in the film.	schockiert
31	surprised	She looked surprised when I told her the news.	überrascht
32	claim	She claims she saw an old friend on her train last night.	behaupten
33	bicycle	“Bike” is the short form of the word “bicycle”.	Fahrrad
34	fairness	We think other people should be fair to us, so we should show fairness to them, too.	Gerechtigkeit, Fairness
35	hell	Hell is the opposite of heaven.	Hölle
36	introduction	In a short introduction, he explains the background to his book.	Einleitung
37	pollution	Pollution of the environment is a big problem for everyone.	Verschmutzung

```

## Output contract

Write `content/corpus/units/g4-u10/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g4-u10",
  "briefBank": "2e7bd10777c1",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g4u10.s.third-conditional",
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
