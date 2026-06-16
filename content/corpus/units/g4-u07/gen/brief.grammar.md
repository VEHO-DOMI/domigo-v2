# Grammar generation brief — g4-u07 (MORE! 4, Unit 7)

<!-- domigo:gen grammar g4-u07 bank=1e982a04bb64 prompt=4b9164076103 -->

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

### `g4u07.s.present-simple-future` — Present simple for future (Present simple für die Zukunft)

Using the present simple for fixed future arrangements such as timetables and schedules (trains, planes, events), where everything is officially agreed. there is/are and have got can be used the same way for fixed future plans. Taught in the unit-7 grammar box together with want someone to.

v1 floor for this structure: **39 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [timetables-schedules]: Use the present simple for future actions that are firmly agreed, such as timetables and schedules.
  - DE: Du verwendest das Present simple für zukünftige Handlungen, die fest vereinbart sind, etwa Fahrpläne und Flugpläne.
  - "Our plane to Alice Springs leaves at 8.30 tomorrow." — "Unser Flugzeug nach Alice Springs fliegt morgen um 8.30 ab."
  - "We leave London at about 9 p.m. on Friday." — "Wir verlassen London am Freitag gegen 21 Uhr."
- rule [there-is-have-got]: You can also use there is/are or have got to talk about firmly arranged future events.
  - DE: Du kannst auch there is/are oder have got verwenden, um über fest vereinbarte zukünftige Ereignisse zu sprechen.
  - "There's a beach party this Sunday." — "Diesen Sonntag gibt es eine Strandparty."
  - "We've got another plane trip tomorrow." — "Wir haben morgen noch einen Flug."

common errors:
- Using the present simple for any future event, not just timetables: ✗ "I go to the cinema tomorrow with my friends." → ✓ "I'm going to go to the cinema tomorrow with my friends."
- Using will for a timetabled event instead of the present simple: ✗ "The train will leave at 6 tomorrow." → ✓ "The train leaves at 6 tomorrow."

SB box `g4/sb/More 4 SB Unit 7.txt#grammar-1` — Present simple for future:
```
Du verwendest oft das Present simple für Handlungen, die in der Zukunft stattfinden, wenn etwas fest vereinbart ist (Fahrpläne, Flugpläne, usw.).
Zum Beispiel:
 We leave London at about 9 p.m. on Friday.
 Our plane to Alice Springs leaves at 8.30 tomorrow.
 Today we say goodbye to Broome and in the early afternoon fly to Sydney.
Du kannst auch there is/are oder have got verwenden, um über fix vereinbarte Handlungen in der Zukunft zu sprechen.
 There’s a beach party this Sunday. We’ve got another plane trip tomorrow.
Image description: A man with a suitcase stands outside a station. A clock shows 8:00. Caption: “The train leaves at eight. Bruce is worried he hasn’t got time for a cup of tea.”
want someone to do something
So drückst du aus, dass jemand möchte, dass eine andere Person etwas Bestimmtes (nicht) tut.
Form: want + Person + to-Infinitiv
 Mum and Dad want us to see Ayers Rock.
 They wanted Morgan to cross Australia on foot with them.
Andere Verben, die dieselbe Struktur haben (Verb + Person + to-Infinitiv):
 tell: I told Eve to get out of the tent and run to the car.
 ask: They asked her to come with them.
The Mag 4 Australia
1 Watch the story. Cross out the incorrect word(s) and correct them.
 1 Lucy’s family’s moving to Perth. → Sydney
 2 Liam has forgotten his old friends. → ………………
 3 Lucy doesn’t like Australian music. → ………………
 4 Lucy wants Stern to be the new editor. → ………………
 5 Liam gives Lucy a present. → ………………
2 Put the events in the order that they happen.
☐ Liam tells Lucy about his experiences of moving.
 ☐ Stern talks about all the great things there are in Australia.
 ☐ Lucy tells the team she’s not moving any more.
 ☐ Lucy decides she’s really looking forward to moving.
 ☐ Nick gives Lucy a goodbye present.
 ☐ Lucy tells the team that she’s moving to Australia.
 ☐ Jessica promises to look after the magazine.
Everyday English
3 Complete with the missing words. Then practise the dialogues.
Options:
 I know how you feel.
 How come?
 Not on your life!
 it’s not really my scene.
Image 1: A girl sits at a desk, looking sad. Three students are around her. Caption:
 “Yes, I just feel awful. Just the thought of leaving here … I don’t know.”
 → “………………………”
 → “Oh yeah? …………………………”
Image 2: A boy and girl walk outside. The boy is smiling. Caption:
 “And then you can go surfing every day.”
 → “Nice try, Stern, but …………………………”
Image 3: A student hands over a small gift. Caption:
 “It’s so you won’t forget us.”
 → “Forget you guys? …………………………”
```

v1 seed items (UNTRUSTED):
- `m4-u7-present-simple-future-gf-001` [gap-fill, d1]: p="The bus ___ (leave) at 7:30 every morning." c="leaves" a=["leaves"] ds=["will leave","is leaving","is going to leave"]
- `m4-u7-present-simple-future-gf-002` [gap-fill, d1]: p="The film ___ (start) at 8 p.m. tonight." c="starts" a=["starts"] ds=["will start","is starting","started"]
- `m4-u7-present-simple-future-gf-003` [gap-fill, d2]: p="Our plane to London ___ (depart) at 6:15 tomorrow morning." c="departs" a=["departs"] ds=["will depart","is going to depart","is departing"]
- `m4-u7-present-simple-future-gf-004` [gap-fill, d3]: p="Choose the correct form: I ___ (visit) my grandparents this weekend. It's my plan." c="am going to visit" a=["am going to visit","'m going to visit"] ds=["visit","will visit","visits"]
- `m4-u7-present-simple-future-gf-005` [gap-fill, d4]: p="The museum ___ (not / open) on Mondays." c="doesn't open" a=["doesn't open","does not open"] ds=["won't open","isn't opening","don't open"]
- `m4-u7-present-simple-future-gf-006` [gap-fill, d4]: p="What time ___ the concert ___ (begin) on Saturday?" c="does ... begin" a=["does ... begin","does...begin","does the concert begin"] ds=["will ... begin","is ... beginning","do ... begin"]
- `m4-u7-present-simple-future-mc-001` [multiple-choice, d2]: p="Which sentence correctly uses the present simple for a future event?" c="The shop closes at 9 p.m. today." a=["The shop closes at 9 p.m. today."] ds=["I close the door when I leave.","The shop will close at 9 p.m. today.","I go shopping tomorrow with friends."]
- `m4-u7-present-simple-future-mc-002` [multiple-choice, d3]: p="Your friend says 'The concert is going to start at 7pm.' You check the printed schedule. What should you tell them?" c="The concert starts at 7pm — it's on the schedule." a=["The concert starts at 7pm — it's on the schedule."] ds=["The concert will start at 7pm — I decided.","The concert is starting at 7pm — I arranged it.","The concert started at 7pm — it's in the past."]
- `m4-u7-present-simple-future-mc-003` [multiple-choice, d5]: p="Which sentence uses the WRONG future form?" c="The plane will depart at 14:30 tomorrow." a=["The plane will depart at 14:30 tomorrow."] ds=["I'm going to study medicine at university.","The exhibition opens next Friday.","It will probably rain tomorrow."]
- `m4-u7-present-simple-future-ec-001` [error-correction, d2]: p="Find and fix the mistake: The train will arrive at platform 3 at 10:15." c="The train arrives at platform 3 at 10:15." a=["The train arrives at platform 3 at 10:15.","The train arrives at platform 3 at 10:15","The train arrives at platform three at 10:15."] ds=[]
- `m4-u7-present-simple-future-ec-002` [error-correction, d3]: p="Find and fix the mistake: I play football with my friends tomorrow afternoon." c="I am going to play football with my friends tomorrow afternoon." a=["I am going to play football with my friends tomorrow afternoon.","I'm going to play football with my friends tomorrow afternoon.","I'm playing football with my friends tomorrow afternoon.","I am playing football with my friends tomorrow afternoon."] ds=[]
- `m4-u7-present-simple-future-ec-003` [error-correction, d4]: p="Find and fix the mistake: School is going to start at 8 o'clock every day." c="School starts at 8 o'clock every day." a=["School starts at 8 o'clock every day.","School starts at 8 o'clock every day","School starts at eight o'clock every day."] ds=[]
- `m4-u7-present-simple-future-tf-001` [transformation, d2]: p="You're at the airport checking your flight details. Tell your friend: 'Our plane ___ (depart) at 6:15 tomorrow morning.'" c="departs" a=["departs"] ds=[]
- `m4-u7-present-simple-future-tf-002` [transformation, d3]: p="Rewrite using the correct future form (personal plan): The party starts at 7. → I / go / to the party" c="I am going to go to the party." a=["I am going to go to the party.","I'm going to go to the party.","I am going to go to the party","I'm going to go to the party"] ds=[]
- `m4-u7-present-simple-future-tf-003` [transformation, d4]: p="Ask the hotel receptionist about the bus schedule: 'What time ___ the bus ___ (leave) for the city centre?'" c="does ... leave" a=["does ... leave","does the bus leave"] ds=[]
- `m4-u7-present-simple-future-tr-001` [translation, d2]: p="🇩🇪 Der Zug fährt um 9 Uhr ab." c="The train leaves at 9 o'clock." a=["The train leaves at 9 o'clock.","The train leaves at 9.","The train departs at 9 o'clock.","The train departs at 9."] ds=[]
- `m4-u7-present-simple-future-tr-002` [translation, d3]: p="🇩🇪 Wann beginnt die Vorstellung?" c="When does the show start?" a=["When does the show start?","When does the show begin?","What time does the show start?","What time does the show begin?"] ds=[]
- `m4-u7-present-simple-future-sb-001` [sentence-building, d1]: p="Put the words in the correct order: at / the / 3:15 / bus / leaves" c="The bus leaves at 3:15." a=["The bus leaves at 3:15.","The bus leaves at 3:15"] ds=[]
- `m4-u7-present-simple-future-mt-001` [matching, d3]: p="Match each situation with the correct future form. 1: The bus / leave / at 8 a.m. 2: I / visit / my aunt next week 3: Look at those clouds! It / rain 4: The concert / start / at 7 p.m. 5: I think they / win / the match" c="{\"1\":\"a\",\"2\":\"b\",\"3\":\"b\",\"4\":\"a\",\"5\":\"c\"}" a=["{\"1\":\"a\",\"2\":\"b\",\"3\":\"b\",\"4\":\"a\",\"5\":\"c\"}"] ds=["a: present simple","b: going to","c: will"]
- `m4-u7-present-simple-future-cp-001` [context-picker, d2]: p="You're looking at a cinema schedule. The 8:30 showing is the only evening option. Which sentence is correct?" c="The film starts at 8:30." a=["The film starts at 8:30."] ds=["The film is starting at 8:30.","The film will start at 8:30.","The film is going to start at 8:30."]
- `m4-u7-present-simple-future-gf-007` [gap-fill, d1]: p="The shop ___ (open) at 9 a.m. tomorrow." c="opens" a=["opens"] ds=["will open","is opening","is going to open"]
- `m4-u7-present-simple-future-gf-008` [gap-fill, d2]: p="School ___ (finish) at 1:30 on Fridays." c="finishes" a=["finishes"] ds=["will finish","is finishing","finish"]
- `m4-u7-present-simple-future-gf-009` [gap-fill, d3]: p="What time ___ the concert ___ (start) tonight?" c="does ... start" a=["does ... start","does the concert start"] ds=["will ... start","is ... starting","do ... start"]
- `m4-u7-present-simple-future-gf-010` [gap-fill, d3]: p="The last bus ___ (leave) at 11:45 p.m. Don't miss it!" c="leaves" a=["leaves"] ds=["will leave","is leaving","is going to leave"]
- `m4-u7-present-simple-future-gf-012` [gap-fill, d5]: p="Our exams ___ (begin) on the 15th of June and ___ (end) on the 22nd." c="begin ... end" a=["begin ... end"] ds=["will begin ... will end","begins ... ends","are beginning ... are ending"]
- `m4-u7-present-simple-future-mc-004` [multiple-choice, d2]: p="Which sentence correctly talks about a train timetable?" c="The train to Salzburg departs at 7:15." a=["The train to Salzburg departs at 7:15."] ds=["The train to Salzburg will depart at 7:15.","The train to Salzburg is departing at 7:15.","The train to Salzburg is going to depart at 7:15."]
- `m4-u7-present-simple-future-mc-005` [multiple-choice, d3]: p="Which situation uses present simple for the future?" c="The flight to London takes off at 6:30 a.m." a=["The flight to London takes off at 6:30 a.m."] ds=["I am visiting my grandma next weekend.","I think it will rain tomorrow.","She is going to study medicine."]
- `m4-u7-present-simple-future-mc-006` [multiple-choice, d4]: p="The library ___ at 5 p.m. on Saturdays." c="closes" a=["closes"] ds=["will close","is closing","close"]
- `m4-u7-present-simple-future-ec-004` [error-correction, d2]: p="Find and fix the mistake: The train will arrive at platform 3 at 10:15. (timetable)" c="The train arrives at platform 3 at 10:15." a=["The train arrives at platform 3 at 10:15.","The train arrives at platform 3 at 10:15"] ds=[]
- `m4-u7-present-simple-future-ec-005` [error-correction, d3]: p="Find and fix the mistake: The film is starting at 8 p.m. tonight. (cinema schedule)" c="The film starts at 8 p.m. tonight." a=["The film starts at 8 p.m. tonight.","The film starts at 8 p.m. tonight"] ds=[]
- `m4-u7-present-simple-future-ec-006` [error-correction, d5]: p="Find and fix the mistake: The lesson start at 8:00 a.m. every day." c="The lesson starts at 8:00 a.m. every day." a=["The lesson starts at 8:00 a.m. every day.","The lesson starts at 8:00 a.m. every day"] ds=[]
- `m4-u7-present-simple-future-tf-004` [transformation, d2]: p="Rewrite using present simple (timetable): The ferry will leave at 3:30 p.m. → The ferry ___." c="The ferry leaves at 3:30 p.m." a=["The ferry leaves at 3:30 p.m.","The ferry leaves at 3:30 p.m"] ds=[]
- `m4-u7-present-simple-future-tf-005` [transformation, d4]: p="Form a present simple question: You want to know what time the swimming pool closes. → What time ___?" c="What time does the swimming pool close?" a=["What time does the swimming pool close?","What time does the pool close?"] ds=[]
- `m4-u7-present-simple-future-tr-003` [translation, d3]: p="🇩🇪 Das Flugzeug landet um 14:30 Uhr." c="The plane lands at 2:30 p.m." a=["The plane lands at 2:30 p.m.","The plane lands at 14:30.","The plane arrives at 2:30 p.m.","The plane lands at half past two."] ds=[]
- `m4-u7-present-simple-future-tr-004` [translation, d4]: p="🇩🇪 Wann macht das Schwimmbad morgen auf?" c="When does the swimming pool open tomorrow?" a=["When does the swimming pool open tomorrow?","What time does the swimming pool open tomorrow?","When does the pool open tomorrow?"] ds=[]
- `m4-u7-present-simple-future-sb-002` [sentence-building, d2]: p="Put the words in the correct order: at / starts / the / match / 3 p.m." c="The match starts at 3 p.m." a=["The match starts at 3 p.m.","The match starts at 3 p.m"] ds=[]
- `m4-u7-present-simple-future-sb-003` [sentence-building, d3]: p="Put the words in the correct order: does / time / the / what / museum / close / ?" c="What time does the museum close?" a=["What time does the museum close?"] ds=[]
- `m4-u7-present-simple-future-mt-002` [matching, d4]: p="Match each situation with the correct verb form:" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}"] ds=["1: The shop ___ at 9 a.m.|2: I ___ my grandma tomorrow.|3: The plane ___ at 6:15.|4: Look! It ___ rain!|5: I think he ___ the test.","a: am visiting (arrangement)|b: is going to (evidence)|c: will pass (prediction)|d: opens (timetable)|e: takes off (timetable)"]
- `m4-u7-present-simple-future-cp-002` [context-picker, d3]: p="You're checking the bus schedule at the stop. The next bus is at 15:45. Which sentence is correct?" c="The next bus arrives at 15:45." a=["The next bus arrives at 15:45."] ds=["The next bus will arrive at 15:45.","The next bus is arriving at 15:45.","The next bus is going to arrive at 15:45."]

### `g4u07.s.want-someone-to` — want / tell / ask + someone + to (want / tell / ask + Person + to-Infinitiv)

The pattern want + person + to-infinitive for saying that you want someone (not) to do something - the English way of saying 'Ich will, dass jemand etwas tut'. tell and ask follow the same pattern. Contrast with let, which takes the bare infinitive. Taught in the unit-7 grammar box together with present simple for future.

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [want-person-to]: Use want + person + to + the base verb. NOT want + that + clause. This is how English says 'Ich will, dass jemand etwas tut'.
  - DE: Du verwendest want + Person + to + Grundform. NICHT want + that + Satz. So sagt man im Englischen 'Ich will, dass jemand etwas tut'.
  - "Mum and Dad want us to see Ayers Rock." — "Mama und Papa wollen, dass wir den Ayers Rock sehen."
  - "They wanted Morgan to cross Australia on foot." — "Sie wollten, dass Morgan Australien zu Fuß durchquert."
- rule [tell-ask-same-pattern]: tell and ask use the same pattern: tell + person + to (a command), ask + person + to (a request). The negative is verb + person + not to + base verb.
  - DE: tell und ask verwenden dasselbe Muster: tell + Person + to (Befehl), ask + Person + to (Bitte). Die Verneinung ist Verb + Person + not to + Grundform.
  - "I told Eve to get out of the tent and run to the car." — "Ich sagte Eve, sie solle aus dem Zelt kommen und zum Auto laufen."
  - "They asked her to come with them." — "Sie baten sie mitzukommen."
- rule [want-vs-let]: Do not confuse this with let, which takes the bare infinitive (no 'to'): My parents let me go - but: My parents want me to go.
  - DE: Verwechsle das nicht mit let, das die Grundform ohne 'to' nimmt: My parents let me go - aber: My parents want me to go.
  - "My parents let me stay up late." — "Meine Eltern lassen mich lange aufbleiben."
  - "My parents want me to go to bed early." — "Meine Eltern wollen, dass ich früh ins Bett gehe."

common errors:
- Using 'want that + clause' instead of 'want + person + to': ✗ "I want that you come." → ✓ "I want you to come."
- Leaving out 'to' before the infinitive: ✗ "I want you come." → ✓ "I want you to come."
- Adding 'to' after let (mixing up the patterns): ✗ "My parents let me to go out." → ✓ "My parents let me go out."

SB box `g4/sb/More 4 SB Unit 7.txt#grammar-1` — Present simple for future:
```
Du verwendest oft das Present simple für Handlungen, die in der Zukunft stattfinden, wenn etwas fest vereinbart ist (Fahrpläne, Flugpläne, usw.).
Zum Beispiel:
 We leave London at about 9 p.m. on Friday.
 Our plane to Alice Springs leaves at 8.30 tomorrow.
 Today we say goodbye to Broome and in the early afternoon fly to Sydney.
Du kannst auch there is/are oder have got verwenden, um über fix vereinbarte Handlungen in der Zukunft zu sprechen.
 There’s a beach party this Sunday. We’ve got another plane trip tomorrow.
Image description: A man with a suitcase stands outside a station. A clock shows 8:00. Caption: “The train leaves at eight. Bruce is worried he hasn’t got time for a cup of tea.”
want someone to do something
So drückst du aus, dass jemand möchte, dass eine andere Person etwas Bestimmtes (nicht) tut.
Form: want + Person + to-Infinitiv
 Mum and Dad want us to see Ayers Rock.
 They wanted Morgan to cross Australia on foot with them.
Andere Verben, die dieselbe Struktur haben (Verb + Person + to-Infinitiv):
 tell: I told Eve to get out of the tent and run to the car.
 ask: They asked her to come with them.
The Mag 4 Australia
1 Watch the story. Cross out the incorrect word(s) and correct them.
 1 Lucy’s family’s moving to Perth. → Sydney
 2 Liam has forgotten his old friends. → ………………
 3 Lucy doesn’t like Australian music. → ………………
 4 Lucy wants Stern to be the new editor. → ………………
 5 Liam gives Lucy a present. → ………………
2 Put the events in the order that they happen.
☐ Liam tells Lucy about his experiences of moving.
 ☐ Stern talks about all the great things there are in Australia.
 ☐ Lucy tells the team she’s not moving any more.
 ☐ Lucy decides she’s really looking forward to moving.
 ☐ Nick gives Lucy a goodbye present.
 ☐ Lucy tells the team that she’s moving to Australia.
 ☐ Jessica promises to look after the magazine.
Everyday English
3 Complete with the missing words. Then practise the dialogues.
Options:
 I know how you feel.
 How come?
 Not on your life!
 it’s not really my scene.
Image 1: A girl sits at a desk, looking sad. Three students are around her. Caption:
 “Yes, I just feel awful. Just the thought of leaving here … I don’t know.”
 → “………………………”
 → “Oh yeah? …………………………”
Image 2: A boy and girl walk outside. The boy is smiling. Caption:
 “And then you can go surfing every day.”
 → “Nice try, Stern, but …………………………”
Image 3: A student hands over a small gift. Caption:
 “It’s so you won’t forget us.”
 → “Forget you guys? …………………………”
```

v1 seed items (UNTRUSTED):
- `m4-u7-want-someone-to-gf-001` [gap-fill, d1]: p="I want you ___ help me with my homework." c="to" a=["to"] ds=["that","for","---"]
- `m4-u7-want-someone-to-gf-002` [gap-fill, d1]: p="She told ___ to sit down and be quiet." c="him" a=["him"] ds=["he","his","that he"]
- `m4-u7-want-someone-to-gf-003` [gap-fill, d2]: p="My parents want me ___ (come) home before nine." c="to come" a=["to come"] ds=["come","coming","that I come"]
- `m4-u7-want-someone-to-gf-004` [gap-fill, d3]: p="The teacher asked us ___ (not / talk) during the test." c="not to talk" a=["not to talk"] ds=["to not talk","don't talk","that we don't talk"]
- `m4-u7-want-someone-to-gf-005` [gap-fill, d4]: p="Do you want ___ (I / carry) your bag for you?" c="me to carry" a=["me to carry"] ds=["that I carry","I to carry","me carry"]
- `m4-u7-want-someone-to-gf-006` [gap-fill, d5]: p="My mum doesn't want ___ (we / stay) out late, but my dad ___ (let / we / go) to the party." c="us to stay ... lets us go" a=["us to stay ... lets us go"] ds=["us stay ... lets us go","us to stay ... lets us to go","that we stay ... lets us go"]
- `m4-u7-want-someone-to-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="The coach told them to run faster." a=["The coach told them to run faster."] ds=["The coach told that they run faster.","The coach told them run faster.","The coach told to them to run faster."]
- `m4-u7-want-someone-to-mc-002` [multiple-choice, d3]: p="Which sentence correctly uses the negative form?" c="She asked him not to be late." a=["She asked him not to be late."] ds=["She asked him to not be late.","She asked him don't be late.","She asked that he not be late."]
- `m4-u7-want-someone-to-mc-003` [multiple-choice, d4]: p="Which sentence is NOT correct?" c="I want that she comes to my party." a=["I want that she comes to my party."] ds=["I want her to come to my party.","I asked her to come to my party.","I told her to come to my party."]
- `m4-u7-want-someone-to-ec-001` [error-correction, d2]: p="Find and fix the mistake: I want that you help me with this project." c="I want you to help me with this project." a=["I want you to help me with this project.","I want you to help me with this project","I'd like you to help me with this project."] ds=[]
- `m4-u7-want-someone-to-ec-002` [error-correction, d3]: p="Find and fix the mistake: My parents let me to go out on Saturday evenings." c="My parents let me go out on Saturday evenings." a=["My parents let me go out on Saturday evenings.","My parents let me go out on Saturday evenings","My parents let me go out on Saturdays."] ds=[]
- `m4-u7-want-someone-to-ec-003` [error-correction, d4]: p="Find and fix the mistake: She told to him not leave early." c="She told him not to leave early." a=["She told him not to leave early.","She told him not to leave early","She told him to not leave early."] ds=[]
- `m4-u7-want-someone-to-tf-001` [transformation, d3]: p="Your little brother is noisy. Tell your mum what you want: 'I want him ___ (be) quiet!'" c="to be" a=["to be"] ds=[]
- `m4-u7-want-someone-to-tf-002` [transformation, d3]: p="The teacher gave instructions. Tell your friend: 'She told us ___ (not / use) our phones in class.'" c="not to use" a=["not to use"] ds=[]
- `m4-u7-want-someone-to-tf-003` [transformation, d5]: p="You missed a message from your mum. Your friend says: 'Your mum asked you ___ (not / be) late for dinner.'" c="not to be" a=["not to be"] ds=[]
- `m4-u7-want-someone-to-tr-001` [translation, d2]: p="🇩🇪 Ich will, dass du mir zuhoerst." c="I want you to listen to me." a=["I want you to listen to me.","I want you to listen to me","I'd like you to listen to me.","I want you to listen."] ds=[]
- `m4-u7-want-someone-to-tr-002` [translation, d4]: p="🇩🇪 Er bat mich, ihm bei den Hausaufgaben zu helfen." c="He asked me to help him with his homework." a=["He asked me to help him with his homework.","He asked me to help him with his homework","He asked me to help him with the homework.","He asked me to help with his homework."] ds=[]
- `m4-u7-want-someone-to-sb-001` [sentence-building, d2]: p="Put the words in the correct order: wants / me / to / mum / tidy / my / my / room" c="My mum wants me to tidy my room." a=["My mum wants me to tidy my room.","My mum wants me to tidy my room"] ds=[]
- `m4-u7-want-someone-to-mt-001` [matching, d1]: p="Match the sentence beginnings with the correct endings. 1: I want you 2: She told him 3: They asked us 4: My parents let me 5: He wants her" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}"] ds=["a: to wait outside.","b: stay up late on Fridays.","c: to join the team.","d: to help me move.","e: not to make noise."]
- `m4-u7-want-someone-to-qf-001` [question-formation, d3]: p="Your friend wants to know if you need help. Form the question starting with: Do you want..." c="Do you want me to help you?" a=["Do you want me to help you?","Do you want me to help you","Do you want me to help?"] ds=[]
- `m4-u7-want-someone-to-gf-007` [gap-fill, d1]: p="My parents ___ me to clean my room every Saturday. (want)" c="want" a=["want"] ds=["want that","wants","wanting"]
- `m4-u7-want-someone-to-gf-008` [gap-fill, d2]: p="The teacher wants us ___ quietly during the test." c="to work" a=["to work"] ds=["work","working","that we work"]
- `m4-u7-want-someone-to-gf-009` [gap-fill, d2]: p="She doesn't want ___ to go to the party without her." c="them" a=["them"] ds=["they","their","theirs"]
- `m4-u7-want-someone-to-gf-010` [gap-fill, d3]: p="I wanted my brother ___ me with my homework, but he was busy." c="to help" a=["to help"] ds=["help","helping","that he helps"]
- `m4-u7-want-someone-to-gf-011` [gap-fill, d4]: p="Our coach doesn't want ___ to eat junk food before the match." c="us" a=["us"] ds=["we","our","that we"]
- `m4-u7-want-someone-to-gf-012` [gap-fill, d5]: p="Do you want ___ to pick you up from the station, or would you rather take a taxi?" c="me" a=["me"] ds=["I","my","that I"]
- `m4-u7-want-someone-to-mc-004` [multiple-choice, d2]: p="Which sentence correctly uses 'want someone to do something'?" c="Mum wants me to tidy up my room." a=["Mum wants me to tidy up my room."] ds=["Mum wants that I tidy up my room.","Mum wants I to tidy up my room.","Mum wants me tidy up my room."]
- `m4-u7-want-someone-to-mc-005` [multiple-choice, d3]: p="Which sentence is correct?" c="I don't want you to be late for dinner." a=["I don't want you to be late for dinner."] ds=["I don't want that you are late for dinner.","I don't want you be late for dinner.","I don't want you to being late for dinner."]
- `m4-u7-want-someone-to-mc-006` [multiple-choice, d4]: p="Choose the correct question form:" c="Does your dad want you to study medicine?" a=["Does your dad want you to study medicine?"] ds=["Does your dad want that you study medicine?","Does your dad wants you to study medicine?","Does your dad want you study medicine?"]
- `m4-u7-want-someone-to-ec-004` [error-correction, d2]: p="Find and fix the mistake: My mum wants that I come home before 9 o'clock." c="My mum wants me to come home before 9 o'clock." a=["My mum wants me to come home before 9 o'clock.","My mum wants me to come home before 9 o'clock"] ds=[]
- `m4-u7-want-someone-to-ec-005` [error-correction, d3]: p="Find and fix the mistake: The doctor wants he to take the medicine three times a day." c="The doctor wants him to take the medicine three times a day." a=["The doctor wants him to take the medicine three times a day.","The doctor wants him to take the medicine three times a day"] ds=[]
- `m4-u7-want-someone-to-ec-006` [error-correction, d4]: p="Find and fix the mistake: Do you want me helping you with the project?" c="Do you want me to help you with the project?" a=["Do you want me to help you with the project?","Do you want me to help you with the project"] ds=[]
- `m4-u7-want-someone-to-tf-004` [transformation, d3]: p="Rewrite using 'want someone to': My dad says to my sister: 'Please wash the dishes.' → My dad wants ___." c="my sister to wash the dishes" a=["my sister to wash the dishes","her to wash the dishes","My dad wants my sister to wash the dishes.","My dad wants her to wash the dishes."] ds=[]
- `m4-u7-want-someone-to-tf-005` [transformation, d4]: p="Rewrite using 'not want someone to': The sign says: 'Students: Don't use your phones in class.' → The school doesn't want ___." c="students to use their phones in class" a=["students to use their phones in class","the students to use their phones in class","The school doesn't want students to use their phones in class.","The school doesn't want the students to use their phones in class."] ds=[]
- `m4-u7-want-someone-to-tr-003` [translation, d3]: p="🇩🇪 Meine Eltern wollen, dass ich mehr lese." c="My parents want me to read more." a=["My parents want me to read more.","My parents want me to read more"] ds=[]
- `m4-u7-want-someone-to-tr-004` [translation, d5]: p="🇩🇪 Willst du, dass ich dir bei den Hausaufgaben helfe?" c="Do you want me to help you with your homework?" a=["Do you want me to help you with your homework?","Do you want me to help you with your homework","Do you want me to help you with the homework?"] ds=[]
- `m4-u7-want-someone-to-sb-002` [sentence-building, d2]: p="Put the words in the correct order: wants / the coach / to / train / us / harder" c="The coach wants us to train harder." a=["The coach wants us to train harder.","The coach wants us to train harder"] ds=[]
- `m4-u7-want-someone-to-sb-003` [sentence-building, d4]: p="Put the words in the correct order: doesn't / her / to / want / go / she / alone / him" c="She doesn't want him to go alone." a=["She doesn't want him to go alone.","She doesn't want him to go alone"] ds=[]
- `m4-u7-want-someone-to-mt-002` [matching, d3]: p="Match each sentence beginning with the correct ending. 1: My mum wants me 2: The teacher doesn't want us 3: Do you want her 4: Dad wanted them 5: She wants you" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}"] ds=["a: to be late.","b: to come home early.","c: to call her back.","d: to tidy my room.","e: to help you?"]
- `m4-u7-want-someone-to-qf-002` [question-formation, d4]: p="Your friend's parents want her to become a doctor. Ask about this: What / parents / want / do?" c="What do her parents want her to do?" a=["What do her parents want her to do?","What do her parents want her to do","What do your parents want you to do?"] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abigail, Aboriginal, Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amber, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Aussage, Australia, Australian, Australiens, Austria, Austrians, Award, Ayers, Bacon, Baker, Balcony, Barbie, Barcelona, Bartholdi, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Between, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bluetooth, Bob, Boer, Bolt, Bond, Bondi, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Broome, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Chappell, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Continuous, Control, Convention, Cooperative, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Dawn, Dean, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dias, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Dutch, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellen, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Ereignis, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fell, Fidel, Fido, Fink, Fleming, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harbour, Harper, Harris, Harrison, Harry, Harten, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hilfsverb, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Italian, Italians, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jasper, Jay, Jeff, Jefferson, Jeffery, Jenkins, Jennifer, Jenny, Jensen, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kids, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Leah, Leeds, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Manubay, Maple, Margaret, Marilyn, Mario, Mark, Marley, Marlo, Marple, Mars, Martello, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Maybe, Mead, Megan, Mei, Meridian, Message, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgan, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Myers, Napa, Natasha, Nathan, National, Natural, Navy, Neill, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Noble, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Opera, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patricia, Patti, Paul, Paula, Paws, People, Pepys, Perth, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Potter, Prepositions, Present, President, Priestly, Princess, Pro, Professor, Project, Protestant, Pulitzer, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebecca, Rebellion, Recherche, Recyclers, Red, Redwood, Reihenfolge, Renato, Republic, Revision, Revolution, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Rottnest, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Sheila, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Square, St, Stallone, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sydney, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Territory, Tesla, Teterboro, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Uhr, Uluru, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe, Zukunft

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 4 SB Unit 7.txt -----
Unit 7 Travelling Down Under
Page 58–59
You learn
about Australia
about Aboriginal customs
how to use present simple for future
to say you want someone to do something
You can
ask and answer questions about travel
write a description of an animal
write about a holiday adventure
Get talking
1 Work in pairs. Look at the questions below and take a guess at the answers.
(Speech bubbles above the map say:)
"I’ve no idea. I haven’t got a clue. What do you think? Have you got any idea?"
"I know that … I’m pretty sure the answer’s … I’m not 100% sure, but I think … I’ve got a feeling the answer’s …"
(Map of Australia is shown, colour-coded by states: Western Australia, Northern Territory, South Australia, Queensland, New South Wales, Victoria, Tasmania, and the Capital Territory. Cities such as Broome, Perth, Darwin, Alice Springs, Adelaide, Melbourne, Sydney, and Brisbane are labeled.)
Questions:
When did people first come to Australia?
Where did the Aborigines come from?
How big is Australia?
How many people live in Australia?
What is the capital of Australia?
Name three animals that we can only find in Australia.
Name the three biggest cities in Australia.
What time is it in Sydney when it is 3 p.m. in Vienna?
How many states are there? And how many territories are there?
Who is the head of state?
🎧 2 Listen to the quiz programme and check your answers.
3 Read the text quickly and find the answers to the questions.
Where were they flying on the second day?
What was the instrument Simon was playing?
How long is the beach at Broome?
What was the last stop on their trip?
How long did the bridge climb take in the end?
www.travelblog.org
 Travel Blog
(Photos on left side show:)
Ryan and Amy (two smiling children)
Heathrow Airport (airplane taking off)
Rottnest Island (beach and trees)
Quokka (small animal)
Perth (modern skyline)
Ayers Rock (Uluru)
Aboriginal man (close-up portrait)
The surprise of the century! Yesterday Dad came home with airline tickets. Next Friday we’re off to Australia! We leave London at about 9 p.m. and arrive in Perth at 00.30 on SUNDAY. What a long flight! We’ll watch all the films they have on the plane.
Days 1 and 2: Perth
It’s winter here, but it’s not cold. Perth is a great city with lots of parks. We went by boat to Rottnest Island off the coast. Hired bikes there and went round the island. Saw some funny animals called quokkas.
In the information centre we got a brochure. It said, “On the island you can relax from the pressures of modern city life.” How can you relax when you have to cycle twenty kilometres on a bike without gears?
Our plane to Alice Springs leaves at 8.30 tomorrow morning. That means getting up at 6. I hate getting up so early. Mum and Dad said we have to see Ayers Rock. So we’re flying into the centre of Australia.
Days 3–5: Alice Springs
Dad rented a car and we went to the famous rock. We were driving for hours and suddenly there was this big red mountain there, like a huge birthday cake.
Ayers Rock is very important to the Aborigines. They call it Uluru and they believe the spirits of their ancestors live there. This is why it is forbidden to climb the mountain.
So we just took photos. In the evening there are lots of people with cameras there waiting for the sun to go down. At that moment the colour of the rock changes to a deep red.
Page 60–61
www.travelblog.org
We went to an Aboriginal heritage centre. A guy called Simon led us around a bush trail telling us about how his ancestors used the land for everything they needed. We saw examples of tents made of small trees, tree bark and leaves. We also saw how they made traps to catch big goannas. They took a little rock and attached a piece of string to it. Then they put a bigger rock on top of the little one. They waited until a goanna went under the big rock for the shade. Then they pulled on the string! (I’m sure you can imagine the rest of the story.)
At the end of the bush walk we all sat and watched Simon playing the didgeridoo. Simon told us that most Aborigines live in or near cities now and that a lot of them have forgotten how to hunt.
Tomorrow we’ve got another plane trip. We leave Alice Springs at 10 o’clock. Back to Perth. Two boring hours at the airport and then we fly off to Broome.
Days 6 and 7: Broome
Broome has got the most gorgeous beach. It’s 22 km long. Mum, Ryan and I wanted to swim and lie on the beach, but Dad wanted to rent another car and drive into the Kimberley Wilderness to camp there. But we got lucky. In the evening we talked to two tourists, Eve and Jeremy, at the hotel. When they told us their story, Dad was happy to stay in Broome!
Here’s Jeremy’s story:
My girlfriend Eve and I were camping at this campsite on the Pentecost River. During the second night something started shaking our tent really violently. We were in a panic and we crawled out of the tent and ran to the car. Fortunately, it wasn’t locked and the key was in the car. I started the car and put the headlights on – and I saw a big crocodile. It was trying to drag the tent into the river. We were so lucky that the crocodile hadn’t grabbed our legs. After a while, the crocodile gave up and went back into the water. We watched it for a long time, but suddenly our headlights went out. It was the battery – it was flat. We were too scared to go back to the tent so we slept in the car. In the morning we could still see the crocodile near the river bank.
I tried to start the car, but no luck. So I left Eve and walked to the Gibb River Road, to wait for a car. After three hours a car came and took me back to our campsite. We jump-started the car and left.
Days 8–10
We’ve got a nice tan. Three days on the beach, swimming, snorkelling and playing Frisbee. No surfing at Broome because there aren’t any good waves. Later today we say goodbye to Broome and in the early afternoon fly to Sydney, the last stop on our trip.
VOCABULARY: jump-start = Starthilfe geben
www.travelblog.org
Days 11–13: Sydney
View of the harbour
 Three days in Sydney. Everyone wants to go to the aquarium. Mum wants to do a harbour cruise. Dad wants to see the opera house. I want to go shopping for presents for my friends and my silly brother wants to do the 3-hour tour to the top of the Sydney Harbour Bridge.
Day 11
 We did the harbour cruise, a tour through the opera house and did some shopping. Bought three presents and six T-shirts. I saw a poster when I was shopping. There’s a beach party this Sunday. I really want to go. Mum and Dad said they would think about it.
Day 12
 We spent the morning at the aquarium. I liked watching the sharks best. In the afternoon we did some more shopping. Bought four presents and a cheap bag to put them in. And guess what? In the evening we all went to the beach party. It was awesome!
Day 13
 To keep Ryan happy, we did the bridge climb – 3 ½ hours!!! First a guy told us what to do, e.g. not jump off the bridge (just kidding!) and then we climbed to the highest point of the bridge. There’s a wonderful view from there, but if you’re scared of heights, don’t do the climb. Some more shopping afterwards. More presents. My new bag is full. Dad says I’ll have to pay the excess weight* from my pocket money. ;-)
Tomorrow we fly back to London at 5 p.m. A great holiday.
VOCABULARY: excess weight = Übergewicht
4 Look at the map on p. 58. Draw the route of the trip there.
5 How many of these tasks can you do? Check your answers with a partner. Then listen to the text.
Circle T (True) or F (False).
The writer thinks that Rottnest Island is a good place to relax. T / F
Uluru looks like a big birthday cake. T / F
Even today almost all Aborigines are very good at hunting. T / F
Complete the sentences.
 4. Dad didn’t want to stay in Broome because he wanted ...
 5. Jeremy and Eve couldn’t leave the campsite because ...
 6. Broome is not good for ...
Answer the questions.
 7. What did they want to do in Sydney?
 8. Why did Amy buy a bag?
 9. Who shouldn’t climb Sydney Harbour Bridge?
(Images included on the pages: Didgeridoo, Broome beach, Goanna, Eve and Jeremy, Saltwater crocodile, Harbour Cruise, Sydney Opera House, The Harbour Bridge, View from the Harbour Bridge.)
Pages 62–63
Vocabulary
6 Match the words with their meanings. Use a dictionary to help you.
Aborigine – ☐ a native Australian
walkabout – ☐ a long journey taken by Aborigines
outback – ☐ the Australian wilderness
track – ☐ follow animals by looking at their footprints
reed – ☐ a type of tall grass
survival skills – ☐ what you need to know so you do not die in the wilderness
7 Read the text and match the paragraph titles with the paragraphs. Write the numbers.
 There is one extra title you do not need to use.
☐ Knowing your environment
 ☐ What is a mutant?
 ☐ Unprepared
 ☐ Help from the insects
 ☐ The first meal
 ☐ Danger everywhere
BOOK REVIEW
Mutant Message Down Under
 Mutant Message Down Under was written in 1990 by an American doctor called Marlo Morgan. In this book she describes her fictional* ‘walkabout’ with a group of Aborigines. These Aborigines called themselves “The Real People” and they wanted Morgan (the mutant!) to cross Australia on foot with them. Here are some of my favourite scenes from the book:
🟦 Marlo was invited to meet a group of Aborigines. Dressed in high heels and normal clothes she was picked up by a driver from her hotel. When she met the group, they told her they were ready to leave. She was invited to come with them. It would take about three months. Amazingly, she decided to go. After a few hours her feet were swollen and cut. But she didn’t give up, just took her shoes off.
🟧 Marlo’s first meal came as quite a shock. The women stopped to gather some large leaves. Then they started looking under dead trees. Every now and then they found something and wrapped it in a leaf. When Marlo looked closer she saw that each leaf contained a large, white worm. She would never eat it, but when they cooked the food on a fire and served it, it didn’t look like a worm any longer. Marlo tried it and it tasted good.
🟥 Marlo was amazed by the group’s survival skills. They could find water where there was absolutely no sign of it. Marlo says they could actually hear the water under the sand and then they would suck water from the ground with long hollow reeds.
🟨 Marlo was also impressed by the Aborigines’ tracking skills. They could tell what creatures were nearby from footprints in the ground. They could even tell how fast the animals were travelling.
🟫 One part I really liked was when Marlo complained about bush flies. The flies were crawling in everybody’s ears and noses. The leader of the group told her that she shouldn’t think bush flies are bad. They crawl down the ears and noses and clean out the wax and the sand. This is why Aborigines have perfect hearing. And they find it easier to breathe in the heat because they have big noses. He told Marlo that her nose was too small.
⬛ At the end of the book the Aborigines tell Marlo about the difference between mutants and real people. The Aborigines believe that mutants are all the people who have no idea how to live in the wild. Most mutants spend their time in buildings, and can’t digest* real food. All mutants have fear. Real people have no fear because they know that the universe has a plan for them. I really like the idea that real people believe that there is a plan, so they don’t worry as much as we do.
VOCABULARY: fictional = erfunden; digest = verdauen
8 Answer the questions.
What was Marlo’s problem with walking through the desert?
Why did she eat the worm in the end?
How did the Aborigines drink the water?
What could they tell from the footprints in the sand?
Why are bush flies important for the Aborigines?
What do the Aborigines say about breathing in hot weather?
Why do mutants have fear?
9 Get together in groups of four and discuss the review of Marlo’s text. Use the following points:
Would you just walk off into the desert? Why (not)?
Would you eat worms when on such a walkabout?
What did Marlo think of the bush flies? What did she learn about them?
You are, of course, mutants. What do you think of the Aborigines’ description of mutants?
10 Pauline works as a pilot for Australia’s Flying Doctors. Match the sentence halves, then listen and check.
The problem with illnesses in Australia ☐
The Royal Flying Doctor Service provides important ☐
On a typical day they make ☐
There are about 450 people ☐
There are farms that are more than ☐
A hundred years ago, doctors had to travel ☐
Most people living far away from towns ☐
In 1917, a young man had an idea ☐
a. by horse or by camel to get to their patients.
 b. 500 km away from the nearest town.
 c. have a box with drugs, bandages and other first aid material.
 d. medical services for people who live far away from towns.
 e. about how to solve the problem of the enormous distances.
 f. is that there are often great distances between doctors and patients.
 g. who work for the Royal Flying Doctors.
 h. about a hundred landings.
Free flow
11 Work in pairs. One of you will play the role of a travel agent (A), the other will play the role of a tourist (B). Take 1 minute to prepare your discussion. Use the prompt cards to help you. Talk for 4–5 minutes.
Prompt Card A
 You are a travel agent. You are going to talk to someone interested in going to Australia.
• Give some general information about the country. (Use the information in this unit to help you.)
 • Find out what kind of holiday he/she is looking for.
 • Think about the different places you can recommend. (Use the information in this unit to help you.)
Prompt Card B
 You are interested in a holiday in Australia. You are going to talk to a travel agent.
• Say what kind of holiday you are looking for.
 • Think about the different places you want to visit.
 • Ask for recommendations on places to go.
 • Ask for recommendations on places to stay.
 • Ask for recommendations on food.
 • Ask for recommendations on travel.
 • Ask for recommendations on sports.
 (Use the information in this unit to help you.)
Pages 64–65
12 CHOICES
Writing for your Portfolio
A
 Select an animal that is typical of Australia (e.g. the koala, the wallaby, the dingo, the kookaburra, …).
 Research the animal on the internet and write a brief description (40–70 words). In your text, say:
 • what the animal is and what it looks like (size, …)
 • where exactly it lives and what it eats
 • whether it is dangerous, shy, hard to find, etc.
B
 Your English teacher is organising a story writing competition about a holiday adventure. Write 120–180 words, and take about 20 minutes for it. Do not forget to use paragraphs! Write about:
 • the place and why people go there
 • the people in the story
 • what happened, and to whom
 • how other people reacted
 • how the adventure ended
 • if you / the person in the story would like to go there again and why (not)
GRAMMAR
Present simple for future
Du verwendest oft das Present simple für Handlungen, die in der Zukunft stattfinden, wenn etwas fest vereinbart ist (Fahrpläne, Flugpläne, usw.).
Zum Beispiel:
 We leave London at about 9 p.m. on Friday.
 Our plane to Alice Springs leaves at 8.30 tomorrow.
 Today we say goodbye to Broome and in the early afternoon fly to Sydney.
Du kannst auch there is/are oder have got verwenden, um über fix vereinbarte Handlungen in der Zukunft zu sprechen.
 There’s a beach party this Sunday. We’ve got another plane trip tomorrow.
Image description: A man with a suitcase stands outside a station. A clock shows 8:00. Caption: “The train leaves at eight. Bruce is worried he hasn’t got time for a cup of tea.”
want someone to do something
So drückst du aus, dass jemand möchte, dass eine andere Person etwas Bestimmtes (nicht) tut.
Form: want + Person + to-Infinitiv
 Mum and Dad want us to see Ayers Rock.
 They wanted Morgan to cross Australia on foot with them.
Andere Verben, die dieselbe Struktur haben (Verb + Person + to-Infinitiv):
 tell: I told Eve to get out of the tent and run to the car.
 ask: They asked her to come with them.
The Mag 4 Australia
1 Watch the story. Cross out the incorrect word(s) and correct them.
 1 Lucy’s family’s moving to Perth. → Sydney
 2 Liam has forgotten his old friends. → ………………
 3 Lucy doesn’t like Australian music. → ………………
 4 Lucy wants Stern to be the new editor. → ………………
 5 Liam gives Lucy a present. → ………………
2 Put the events in the order that they happen.
☐ Liam tells Lucy about his experiences of moving.
 ☐ Stern talks about all the great things there are in Australia.
 ☐ Lucy tells the team she’s not moving any more.
 ☐ Lucy decides she’s really looking forward to moving.
 ☐ Nick gives Lucy a goodbye present.
 ☐ Lucy tells the team that she’s moving to Australia.
 ☐ Jessica promises to look after the magazine.
Everyday English
3 Complete with the missing words. Then practise the dialogues.
Options:
 I know how you feel.
 How come?
 Not on your life!
 it’s not really my scene.
Image 1: A girl sits at a desk, looking sad. Three students are around her. Caption:
 “Yes, I just feel awful. Just the thought of leaving here … I don’t know.”
 → “………………………”
 → “Oh yeah? …………………………”
Image 2: A boy and girl walk outside. The boy is smiling. Caption:
 “And then you can go surfing every day.”
 → “Nice try, Stern, but …………………………”
Image 3: A student hands over a small gift. Caption:
 “It’s so you won’t forget us.”
 → “Forget you guys? …………………………”


----- WB: More 4 WB Unit 7.txt -----
UNIT 7 Travelling Down Under
Page 53
Reading
 1️⃣ Read the page from Anne’s travel blog. What is the name of the animal in the picture below?
Anne’s Travels
 (HOME) (TRAVEL BLOG) (CONTACT ME)
ROTTNEST ISLAND
 My Australian adventure continues. Yesterday we went to an island called Rottnest. It’s off the coast of Western Australia and we had to take a ferry from Perth. It took about an hour and a half to get there but the sea was calm and the crossing was really enjoyable. We saw some amazing seabirds. That kept Dad happy. He told me all the names of them but I’ve already forgotten them. I probably wasn’t listening very carefully.
Before I went I did a bit of research. You know me – I always like to know where I’m going. Rottnest is quite a small island – its total area is 19 km² and you can visit most of it by bike. In fact, bikes are the only type of transport allowed on the island, except for one bus and emergency vehicles. There are actually about 100 people living on the island, but it’s visited each year by around 500,000 people. At times there can be 15,000 tourists all on the island at the same time. Luckily, we didn’t get such big crowds. In fact, there weren’t many tourists there at all, which was good because we got the island all to ourselves.
I was interested by the name of the island. Rottnest – it’s quite unusual. So I did some research and found out all about it. Before I tell you about that I should say that the local Noongar Aboriginal people actually call the island Wadjemup, but most people know it as Rottnest, or just Rotto. The name came from a small animal that lives on the island. When early Dutch settlers* arrived and saw them they decided to call the island Rattenest, which I think means rat nest in English. Anyway, the Dutch were wrong because these animals aren’t rats at all. They’re actually marsupials* called quokkas and they’re found in very few other places. We saw quite a few of them and they are really cute.
The island itself is very sandy but it also has trees and some lakes in the middle of it. It’s important for many types of birds and some animals. For this reason it is very protected. In fact, it is an A-class reserve – that means it has the highest level of protection from the Australian government.
Most tourists just go for a day, which is what we did, but there are hotels if you want to stay. When we got there we hired bikes and spent the day exploring. It’s a really beautiful and interesting place. And it’s very different to any other island I’ve ever been to. We had a really good meal in a restaurant on the water front. There seem to be a few places to eat to choose from. We took the last ferry home and I was sad to say goodbye. I don’t expect I’ll ever be there again. But if I am, I’ll certainly stay for the night.
VOCABULARY: Dutch settlers – niederländische Siedler; marsupial – Beuteltier
Image descriptions:
Large landscape header image showing a coastal island with rocky shores. In the center foreground, a quokka is visible standing on a rock, looking towards the camera.
Inset photo near the bottom right shows a close-up of a quokka with fur, long tail, small round ears, and a short snout. The animal is standing in sand.
Pages 54–55
2️⃣ How many of these tasks can you do? Check your answers with a partner.
Anne flew to the island.
  T / F
The journey there and back is about three hours.
  T / F
Anne is very interested in bird watching.
  T / F
The population of the island is ..........................................................................................
Around half a million ............................................................................................................. each year.
Two other names for the island are ................................................................................
 .............................................................................................................................................
How did the island get its name? ..................................................................................
Why is the island protected? .........................................................................................
What did Anne do on the island? ..................................................................................
Listening
3️⃣ Listen to the telephone information file. Match the sentences with the pictures.
Three ways to enjoy.
There’s 100 to choose from.
There’s something for everyone.
(Three images below, left to right:
Left image: Sydney Opera House.
Middle image: Harbour Bridge.
Right image: Bondi Beach.)
⚪ ⚪ ⚪
4️⃣ Listen again and choose the correct answers.
What sort of shows can you see at the opera house?
  ◻ Only opera.
  ◻ There is a big variety of entertainment.
  ◻ Pop shows for children.
Why should you book early for a tour of the opera house?
  ◻ You can get a cheaper ticket.
  ◻ Lots of people want to go on these tours.
  ◻ There aren’t many tours every day.
How long does it take to cross the harbour bridge?
  ◻ Less than 30 minutes
  ◻ Half an hour to an hour
  ◻ About two hours
Why are there different ticket prices for the bridge climb?
  ◻ You can choose to go with or without a guide.
  ◻ It depends how high you want to go.
  ◻ Different times are different amounts.
How far is Bondi beach from the centre of Sydney?
  ◻ 1 km ◻ 5 km ◻ 7 km
What should you be careful to do on Bondi beach?
  ◻ Watch out for shark warnings.
  ◻ Wear sun cream.
  ◻ Check the water conditions.
Grammar Present simple for future
5️⃣ Write the sentences.
(There are six blue-tinted illustrations, each labelled with the following prompts below them:)
plane / leave / Saturday / 8.15 a.m.
train / arrive / Waterloo Station / 4.50 p.m.
Bob and Harriet / leave / 8 o’clock / in the morning
parents / arrive / Heathrow Airport / Sunday / 2.15 p.m.
we / have / football match / Saturday afternoon
there be / party / Friday night
The plane leaves on Saturday at 8.15 a.m.
 2 ..............................................................................................................................
 3 ..............................................................................................................................
 4 ..............................................................................................................................
 5 ..............................................................................................................................
 6 ..............................................................................................................................
6️⃣ Look at the diary and write sentences.
Friday
 Morning: ¹ Maths test – 1st lesson
 Afternoon: ² piano lesson after school
 Evening: ³ parents’ evening at school
Saturday
 Morning: ⁴ tennis match 10 a.m.
 Afternoon: ⁵ Lunch with Mum
 Evening: ⁶ Dave party!
There’s a Maths test in the first lesson on Friday morning.
 2 ..............................................................................................................................
 3 ..............................................................................................................................
 4 ..............................................................................................................................
 5 ..............................................................................................................................
 6 ..............................................................................................................................
Pages 56–57
7️⃣ Write four more sentences about your arrangements for the week. (You can make them up if you like.)
There’s an English test on Friday.
 ...................................................................................................................................................................................
 ...................................................................................................................................................................................
 ...................................................................................................................................................................................
 ...................................................................................................................................................................................
Grammar want someone to do something
8️⃣ Look at the pictures and complete the sentences. Use the verbs in the box.
say feed stop swim let save
(There are six blue-tinted pictures illustrating the situations.)
She wants him to stop crying.
She wants him to ......................................................................................
He wants her to .........................................................................................
She wants them to ....................................................................................
He wants them to ......................................................................................
They want her to .......................................................................................
9️⃣ Put the words in order to make sentences.
to / She / her / call / wanted / me
us / leave / to / told / He
their / asked / They / photo / us / take / to
I / a bike. / them / buy me / to / wanted
buy / asked / to / drink / her / me / I / a
told / leave / me / to / alone. / him / He
me / to / kitchen. / in / help / him / Dad / asked / the
her / party. / me / to / invite / told / to / Nigel / my
🔟 Read the poem and then use it to write another verse.
She told me to leave her alone.
 She wanted me to get up and go.
 She asked me to take all my things.
 She asked me to give back her rings.
She told me to go and drop dead.
 She wanted me out of her head.
 She asked me to stop calling her phone.
 She told me to leave her alone.
I asked her "Is it over?"
      I asked her ".........................................................."
      I told her "............................................................"
      I wanted her "....................................................."
      I told her "............................................................"
But she said "no"!
Vocabulary
1️⃣1️⃣ Unscramble the letters to make words.
baignoire ..........................................................................
lubatowka ........................................................................
tacuokbo ..........................................................................
cgktrain ............................................................................
edrca ..................................................................................
uvivralsl lsksil ...................................................................
1️⃣2️⃣ Use the words above to complete the sentences.
A ......................................................... would be a great way to see wild Australia.
.......................................................... are tall grasses often found by water.
The hunter spent several hours ..................................................... the animal.
The .................................................’s name for Ayers Rock is Uluru.
We spent three weeks camping in the Australian ......................................................
I’ve got no ................................................... . I wouldn’t last a day in the jungle.
Everyday English Australia
🎥 Complete with the phrases from the box.
Box:
 I know how you feel
 How come
 Not on your life
 It’s not really my scene
1 A We need a goalie for the match against class 8c. Can you play?
   B .............................................................................. I hate football.
2 A I’m still angry at Linda.
   B .............................................................................. I’m angry with her, too.
3 A You didn’t do your Maths homework?
   B Sorry, I simply had no time.
    A ............................................................................
4 A We’re going to the football match with Jeff and Peter. Are you coming?
   B No, I don’t think so. ............................................................................
Pages 58–59
1️⃣3️⃣ Read the task and what a student wrote in 14. What makes quokkas sick?
Task
 Write a brief description of an Australian animal (50–70 words).
 Write about:
what it looks like (size, colour)
what it eats
what it does
how (not) to treat them
1️⃣4️⃣ Read the text and complete it with the words in the box.
 Box: size weighs long
(The image shows a quokka standing on a rock, looking toward the camera.)
The quokka is a kangaroo-like animal, but it is only
 the 1. size of a housecat.
 It 2. weighs 2.5 to 5 kilograms and is
 40 to 54 centimetres 3. long.
 It can climb small trees. Its fur is brown, it has
 rounded ears and a broad head.
 Quokkas eat plants and leaves; they have little fear of humans, but one
 should never feed them 'human food' because it makes them sick.
Language tip:
 Talking about size and weight
 When we talk about the size or weight of something, it is not always easy to be exact, so we can use words like approximately, about, roughly and around. It can be a good idea also to compare with a more familiar object.
It’s (approximately) the size of a ...
 It weighs (around) ...
 It’s (roughly) ... tall/long.
It’s (more or less) as big as a ...
 It’s (about) as heavy as a ...
 It’s (about) as tall/long as a ...
1️⃣5️⃣ Think of an animal and describe it for your partner to guess. Use the writing tip below to help you.
Writing tip
 Describing an animal
 When writing a description of an animal think carefully about:
 • any special vocabulary you might need
 • the size and weight of the animal
 • its appearance (fur, teeth, etc.)
 • where it lives
 • what it eats
 • what the dangers the animal faces are
 • how large its population is
 • which of these facts and details you want to include in your word limit
1️⃣6️⃣ Now write your own answer to the following task.
Task
 Pick an animal from your country and write a description of that animal (120–180 words). Write about:
its appearance
its habitat*
the food it eats
how it reacts to other animals / to people
its natural enemies
steps to protect/control it
VOCABULARY
 *habitat – Lebensraum
MORE Words and Phrases
Aborigine – The Aborigines were the first people to live in Australia thousands of years ago. – Ureinwohner/in Australiens
cheque – I don’t have any money with me. I’ll have to pay by cheque. – Scheck
envelope – When you write a letter, you put it in an envelope before you send it. – Kuvert, Briefumschlag
airline – Lufthansa is a famous German airline. – Fluglinie
ancestor – The ancestors of the Aborigines came to Australia over 40,000 years ago. – Vorfahr/in, Ahne, Ahnin
bush trail – There was a bush trail from our camp to the rock. – Buschpfad
crawl – They crawled out of the tent on their hands and knees. – kriechen
drag – The crocodile tried to drag them off into the water. – schleppen
excess weight – My suitcase was too heavy. I had to pay for the excess weight. – Übergewicht (bei Gepäck)
gorgeous – The weather is gorgeous today. Blue skies and lots of sun. – wunderschön, herrlich
grab – I grabbed my school bag and ran home. – packen, schnappen
headlight – As soon as it was dark, I turned on the car’s headlights. – Scheinwerfer
heritage – The Aborigines have a heritage that goes back thousands of years. – Erbe, Tradition
jump-start – If your car battery is weak, you can jump-start your car with help from another car. – Starthilfe geben
pressure – You need to take a holiday to get away from the pressure of work. – Druck
shade – We sat down in the shade to get some rest. – Schatten
string – Pull the string and the track will fall. – Schnur, Bindfaden
reed – You can find reeds around a pond or a lake. – Schilfrohr
track – We followed the bear’s tracks in the snow. – (Tier)Fährte, Spur
survival skills – You need good survival skills to survive in the jungle. – Überlebenstechniken
walkabout – On their walkabout, Aborigines cross Australia on foot. – Buschwanderung
aircraft – The Flying Doctors often travel very long distances in their aircraft. – Flugzeug
ambulance – The man’s just had a heart attack! Call an ambulance! – Krankenwagen
detailed – Check ask people detailed questions to find out what’s wrong. – ausführlich
distance – Paul has to drive long distances to get to his job. – Entfernung
drugs – You have to take drugs if you have this illness. – Medikamente
first aid – If someone is injured, you have to give them first aid before the doctor arrives. – Erste Hilfe
landing – The aircraft made a perfect landing and stopped next to the house. – Landung
(the) outback – It’s very hot and dry in the Australian outback. – Hinterland Australiens
provide – The trees provide shade for the animals in the summer. – versorgen, verschaffen

```

## Output contract

Write `content/corpus/units/g4-u07/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g4-u07",
  "briefBank": "1e982a04bb64",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g4u07.s.present-simple-future",
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
