# Grammar structures — g3 (stage-4 authoring brief)

<!-- domigo:structures g3 evidence=e30966d57392 -->

## Authoring contract

Write `content/corpus/structures/g3/structures.draft.json`:

```jsonc
{
  "schema": "grammar-structures-draft@1",
  "grade": 3,
  "briefEvidence": "e30966d57392",
  "structures": [
    {
      "key": "should",                  // [a-z0-9-]+, GRADE-unique (item ids embed it)
      "unit": 3,                        // introducing (gate) unit
      "name": "should / shouldn't",     // teacher-facing EN
      "nameDe": "…",                    // teacher-facing DE
      "category": "modals",             // articles|comparison|conditionals|connectors|modals|other|passive|prepositions|pronouns|reported-speech|tenses|word-formation
      "description": "…",
      "rules": [{ "id": "…", "en": "…", "de": "…", "examples": [{ "en": "…", "de": "…" }] }],
      "commonErrors": [{ "description": "…", "wrong": "…", "correct": "…" }],
      "recursIn": [],                   // later same-grade units where it recurs (revision boxes)
      "sbRefs": ["…#grammar-1"],        // cite the box refs below (or …#appendix)
      "seedV1": ["m2-u3-should"]        // v1 ids this covers (many-to-one ok; [] = NEW)
    }
  ],
  "v1Waivers": [{ "v1Id": "…", "note": "…" }]   // v1 structures intentionally NOT carried
}
```

Rules:
- **The textbook is the source of truth.** One structure per SB GRAMMAR box; the v1 catalog is a FLOOR (untrusted seed): every v1 id below must land in exactly one `seedV1[]` or in `v1Waivers` with a reasoned note.
- Revision boxes become their own structure (name suffixed "(revision)") in their own unit; link via `recursIn` on the original.
- `rules` are teaching content (grammar intro cards): rewrite from the SB box + v1 `rules` seed; German in du-form; pedagogical German terms (Grundform, Vergangenheit …) are allowed here.
- Difficulty seed map for later stages (hint only): v1 1–2→1, 3→2, 4–5→3.
- Keys should match v1 key style where sensible (e.g. `should`, `past-simple-questions`) so seeds stay traceable.

## Units

| unit | slug | transcript | boxes | v1 structures |
|---|---|---|---|---|
| 1 | g3-u01 | g3/sb/More 3 SB Unit 1.txt | 1 | 0 ⚠ hole — fill from the SB box |
| 2 | g3-u02 | g3/sb/More 3 SB Unit 2.txt | 1 | 1 |
| 3 | g3-u03 | g3/sb/More 3 SB Unit 3.txt | 1 | 2 |
| 4 | g3-u04 | g3/sb/More 3 SB Unit 4.txt | 0 | 1 |
| 5 | g3-u05 | g3/sb/More 3 SB Unit 5.txt | 1 | 2 |
| 6 | g3-u06 | g3/sb/More 3 SB Unit 6.txt | 1 | 1 |
| 7 | g3-u07 | g3/sb/More 3 SB Unit 7.txt | 1 | 1 |
| 8 | g3-u08 | g3/sb/More 3 SB Unit 8.txt | 1 | 1 |
| 9 | g3-u09 | g3/sb/More 3 SB Unit 9.txt | 1 | 2 |
| 10 | g3-u10 | g3/sb/More 3 SB Unit 10.txt | 1 | 3 |
| 11 | g3-u11 | g3/sb/More 3 SB Unit 11.txt | 0 | 1 |
| 12 | g3-u12 | g3/sb/More 3 SB Unit 12.txt | 0 | 1 |
| 13 | g3-u13 | g3/sb/More 3 SB Unit 13.txt | 1 | 1 |
| 14 | g3-u14 | g3/sb/More 3 SB Unit 14.txt | 0 | 1 |

## SB grammar boxes (verbatim)

### g3/sb/More 3 SB Unit 1.txt (unit 1)

#### `g3/sb/More 3 SB Unit 1.txt#grammar-1` — Present simple (revision)

```
 How to use it: You use the present simple to give an opinion (1) or to talk about facts (2) and habits (3).
Write 1–3 to match the sentences with what you read above.
 ⬜ Every day, hundreds of tourists stand under the statue.
 ⬜ I usually buy two or three records a week.
 ⬜ I think Madonna is one of the greatest.
How to form it: person + verb (+ s for the 3rd person singular)
 I like ... He/She/It likes ...
Negation: person + don’t / doesn’t + verb
 I don’t like ... He/She/It doesn’t like ...
Examples:
 I like songs with a good tune.
 I don’t know why you came here.
 She writes some brilliant songs.
 She doesn’t seem to get old.
Past simple (revision)
 Examples:
 He bought a dog and sent them hair from the dog.
 Beyoncé fans didn’t buy CDs.
 He recorded all eleven songs in space and called the album Space Sessions: Songs for a Tin Can.
Complete:
 To make the negative of the present simple, use 1 ______________________ + the base form of the verb.
 To make the negative of the past simple, use 2 ______________________ + the base form of the verb.
 To form questions in the present simple, use 3 ______________________ + person + the base form of the verb.
 To form questions in the past simple, use 4 ______________________ + person + the base form of the verb.
Go now back to page 8. Check ✅ with a partner what you know / can do.
```

### g3/sb/More 3 SB Unit 10.txt (unit 10)

#### `g3/sb/More 3 SB Unit 10.txt#grammar-1` — Past ability and permission: could, was/were able to and was/were allowed to

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

### g3/sb/More 3 SB Unit 13.txt (unit 13)

#### `g3/sb/More 3 SB Unit 13.txt#grammar-1` — if-sentences (2nd conditional)

```
 You use the 2nd conditional if you want to talk about impossible or unlikely situations and their future results.
How to form it:
 If-clause
 If + person + past simple
 Main clause
 person + would + base form of the verb
Examples:
 If she wasn’t a good coach, I would find another team.
 If you cared about your friends, this wouldn’t be a difficult decision.
 Carla would give her brother an alibi if he told her why he needs one.
 If I needed the money, I’d keep it and leave the wallet.
Sometimes you also hear or see the forms If he/she/it were … However, these forms are rarely used in everyday English.
Choose the correct option.
 We use the 2nd conditional to talk about something that will / might happen.
(Image: A child holding a paper with the caption “If he wasn’t my friend, I wouldn’t read his poem.”)
```

### g3/sb/More 3 SB Unit 2.txt (unit 2)

#### `g3/sb/More 3 SB Unit 2.txt#grammar-1` — 🎧 Past continuous

```
How to use it:
 (1) You use the past continuous to talk or write about a longer action that happened at a certain time in the past.
What were you doing at 8 o’clock?
 I was walking my dog.
(Illustration description: A hunter is sitting in a tree, looking through binoculars. Below, forest animals gather and seem to be plotting a plan. A speech bubble says: “While the hunter was looking through his binoculars, the animals got an idea.”)
(2) You also use the past continuous to describe what happens at the beginning of a story (in the background). When the actual action begins, you often use the past simple.
It was a great day. The sun was shining and we were having a lot of fun. But then, we saw the people. Lots of them. They were all queuing up at the entrance of the Greenwich Museum.
The Titanic was crossing the Atlantic when it hit an iceberg.
📘 Look at the examples above. Then complete the rule with past simple and past continuous.
You often use the ’ ………………………………………’ for longer actions in the past, that are interrupted by a shorter action. You use the ’ ………………………………………’ for the shorter action.
How to form it:
 To form the past continuous, we use the past tense of be and the –ing form of the verb.
🖊️ Read and write (1) or (2).
☐ The children were sleeping. Mum and Dad were watching TV in the living room. Suddenly, Blackie the dog started to bark.
 ☐ The detective was driving down the street. It was raining. The wind was blowing hard. Nobody was walking in the street. Suddenly, he saw a man with a knife on the other side of the street.
 ☐ At 6 o’clock I was having a shower.
➡️ Now go back to page 16. ✔️ Check with a partner what you know / can do.
```

### g3/sb/More 3 SB Unit 3.txt (unit 3)

#### `g3/sb/More 3 SB Unit 3.txt#grammar-1` — when, before, after, while, during, until, by the time

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

### g3/sb/More 3 SB Unit 5.txt (unit 5)

#### `g3/sb/More 3 SB Unit 5.txt#grammar-1` — 🔹 1st conditional

```
 You use the 1st conditional to describe what consequences an action or a situation will have.
If you put your handbag on the floor, you’ll never have money.
 You’ll have bad luck if you walk on cracks in the pavement.
 If you don’t whistle, there won’t be any rain.
What will happen if you break a mirror?
Complete with will / present simple / verb:
If-clause: If + person + 1 …………………………………………
 Main clause: person + 2 ………………………………………… + 3 …………………………………………
🔹 unless
 How to use it: Unless means if … not.
I’ll go and look for him after breakfast, unless he comes here first. (= if he doesn’t come here first)
 Unless you put up a spirit screen, the ghosts can follow you into your home.
 (= if you don’t put up a spirit screen, …)
Image: A person walking on pavement cracks. Caption: “You’ll have bad luck if you walk on cracks in the pavement.”
```

### g3/sb/More 3 SB Unit 6.txt (unit 6)

#### `g3/sb/More 3 SB Unit 6.txt#grammar-1` — Relative pronouns

```
How to use them: You can use relative pronouns to add new information about a person or a thing.
The old theatre burnt down, but now there’s a new Globe Theatre which / that looks almost the same.
 A walk by the river brings you closer to the people who / that make London such a fascinating city.
Read the sentences above and complete the rule with who / which / that.
 We use 1 …………………………… or …………………………… for people.
 We use 2 …………………………… or …………………………… for things.
You use whose when you can use dessen or deren in German. Whose can refer to people, things or animals.
Check out the Beefeaters whose job is to protect the King’s Crown Jewels.
 Tate Modern is an art gallery whose collection of modern art is one of the best in the world.
(Caption under image of a cyclist riding through traffic in London)
 Cycling is great for people who like fresh air.
```

### g3/sb/More 3 SB Unit 7.txt (unit 7)

#### `g3/sb/More 3 SB Unit 7.txt#grammar-1` — Present perfect with for / since

```
Read the sentences and answer the questions.
I’ve been friends with Alessia for two years.
 1 Is the speaker still friends with Alessia?
 yes ⬜ no ⬜
I’ve had those books for years.
 2 Does the speaker still have the books?
 yes ⬜ no ⬜
(Image of a woman standing next to a knight in armor with caption: "He's been in the family for 800 years.")
How to use it:
 You use the present perfect to talk about actions and events that started in the past and continue in the present.
How to form it:
 Person + have/has + past participle
If you want to say how long something has been going on, you can use for or since. Use for when you can say lang in German.
You haven’t used it for years / for two months / for a week, etc.
 (jahrelang, zwei Monate lang, eine Woche lang)
I’ve had those toys since Christmas / since 2015 / since I was seven / since I was a baby, etc.
```

### g3/sb/More 3 SB Unit 8.txt (unit 8)

#### `g3/sb/More 3 SB Unit 8.txt#grammar-1` — Past simple and present perfect

```
You use the past simple to talk about something that happened in the past. You often use it in combination with time markers like a date, a time period, a time of day, or signal words such as last Monday/month/year,
 a week/year ago, yesterday.
 When Sadie was seven, she had operations on both hips.
You use the present perfect to talk about something that has happened recently. You are not interested in the exact time.
 In general, you want to know if something took place at all, and not when exactly something happened. Signal words are:
 ever, never, always, just.
Sadie has had two big operations.
 Sadie’s invention has won two more prizes.
 Sadie has always spent a lot of time in hospital.
Now circle the correct options.
 1 At the end of the school year, she won / has won first place in the Invention Convention.
 2 Not every young inventor was always / has always been successful.
1 Watch the video. What invention has Luke already made?
2 Watch again and answer the questions.
1 What kind of things does Luke’s grandpa tell him to dream of?
 2 What two hobbies does Luke talk about?
 3 What does Luke often do with his dad at the weekend?
 4 What subjects does he need to study to be an engineer?
 5 Where does he want to go to university?
 6 What’s so special about the cat flap?
3 Complete the sentences with the words in the box.
 in on with as for
1 My mum works …………… a lot of people – more than 100!
 2 I’m not sure exactly what I want to do but I’d like to work …………… the film industry.
 3 I’d like to work …………… a multinational company when I finish university.
 4 I’m working …………… a project for my science teacher.
 5 My dad works …………… a teacher in the local high school.
4 Read about the three people. In pairs, think of jobs that might be good for each one.
DAVE really likes history. It’s his favourite subject at school. He really likes sport and plays for the school football team. He is a very sociable person and likes talking to people. People always say they find him very interesting.
OLIVIA is really good at drawing. She spends a lot of her free time writing stories in her hand. At school, she is very good in science and maths and she finds school interesting. She works well in a team and has really good ideas. She also plays the violin in an orchestra.
SAM has an amazing imagination and his teacher says he writes the best stories. He has a few good friends but is quite shy and enjoys working on his own. He loves playing video games in his free time. His best subject at school is computer science.
[Image descriptions:
TV presenter: a person speaking into a microphone
teacher: a woman holding a book and gesturing to someone
architect: a person with drawings and a model of a building
computer game designer: a boy with headphones, using a computer]
5 Think of someone you know who is very good at their job. Think about:
what they work as/in
who they work with/for
why they are good at their job
Make a short presentation about this person. Produce a short video and show it to the class.
```

### g3/sb/More 3 SB Unit 9.txt (unit 9)

#### `g3/sb/More 3 SB Unit 9.txt#grammar-1` — be allowed to / let

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

## v1 floor catalog — m3 (UNTRUSTED seed: mine for ideas, map or waive every id)

### `m3-u2-past-continuous` — unit 2 · tenses

**Past Continuous** / Vergangenheit mit Verlaufsform (Past Continuous)

Describing ongoing past actions with was/were + -ing, including contrast with past simple for interrupted or simultaneous actions.

items: 40 — gap-fill 14 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · transformation 3 · context-picker 2 · matching 2 | d3 13 · d2 10 · d4 9 · d1 4 · d5 4

rules (seed):
- [pc-formation] Form the past continuous with was/were + verb-ing. Use 'was' with I/he/she/it and 'were' with you/we/they.
  - DE: Man bildet die Verlaufsform der Vergangenheit mit was/were + Verb-ing. 'was' steht bei I/he/she/it und 'were' bei you/we/they.
  - "I was watching TV at 8 o'clock." — "Ich sah um 8 Uhr fern."
  - "They were playing football in the park." — "Sie spielten im Park Fußball."
- [pc-negative-questions] Negative: wasn't/weren't + -ing. Questions: Was/Were + subject + -ing?
  - DE: Verneinung: wasn't/weren't + -ing. Fragen: Was/Were + Subjekt + -ing?
  - "She wasn't sleeping when I called." — "Sie schlief nicht, als ich anrief."
  - "Were you listening to music?" — "Hast du Musik gehört?"
- [pc-with-past-simple] Use the past continuous for a longer background action and the past simple for a short interrupting action. Connect them with 'when' or 'while'.
  - DE: Man verwendet die Verlaufsform für die längere Hintergrundhandlung und das Simple Past für die kurze, unterbrechende Handlung. Verbunden mit 'when' oder 'while'.
  - "I was walking to school when I saw a cat." — "Ich ging gerade zur Schule, als ich eine Katze sah."
  - "While she was sleeping, the phone rang." — "Während sie schlief, klingelte das Telefon."

key forms (seed):
- affirmative: I was watching TV. · They were playing football. · She was reading a book.
- negative: I wasn't sleeping. · They weren't listening. · She wasn't working.
- questions: Were you watching TV? · Was she reading? · What were they doing?

common errors (seed):
- Using the wrong form of 'be' (was/were mismatch): ✗ "I were walking to school." → ✓ "I was walking to school."
- Missing the -ing ending on the main verb: ✗ "She was walk down the street." → ✓ "She was walking down the street."
- Using past continuous for habitual past actions instead of past simple: ✗ "I was going to school every day last year." → ✓ "I went to school every day last year."
- Using past continuous for both the background action and the interrupting event: ✗ "I was walking when I was seeing a cat." → ✓ "I was walking when I saw a cat."

### `m3-u3-it-takes` — unit 3 · other

**It takes ... to** / It takes... to (Zeitdauer ausdrücken)

Expressing how long something takes using the construction It + take(s) + person + time + to + infinitive.

items: 39 — gap-fill 17 · error-correction 6 · multiple-choice 6 · sentence-building 3 · translation 3 · matching 2 · question-formation 2 | d3 12 · d2 10 · d4 10 · d1 4 · d5 3

rules (seed):
- [it-takes-present] Present: It takes + person + time + to + base verb. The subject is always 'it'.
  - DE: Präsens: It takes + Person + Zeit + to + Grundform. Das Subjekt ist immer 'it'.
  - "It takes me twenty minutes to walk to school." — "Ich brauche zwanzig Minuten, um zur Schule zu gehen."
  - "It takes her an hour to do her homework." — "Sie braucht eine Stunde für ihre Hausaufgaben."
- [it-takes-past-question] Past: It took + person + time + to + base verb. Questions: How long does it take (you) to...? / How long did it take to...?
  - DE: Vergangenheit: It took + Person + Zeit + to + Grundform. Fragen: How long does it take (you) to...? / How long did it take to...?
  - "It took us two hours to drive there." — "Wir brauchten zwei Stunden, um dorthin zu fahren."
  - "How long does it take you to get to school?" — "Wie lange brauchst du zur Schule?"

key forms (seed):
- affirmative: It takes me 20 minutes to walk to school. · It took us two hours to drive there.
- negative: It doesn't take long to get there. · It didn't take me long to finish.
- questions: How long does it take you to get to school? · How long did it take to fly there?

common errors (seed):
- Missing 'to' before the infinitive: ✗ "It takes me 20 minutes walk to school." → ✓ "It takes me 20 minutes to walk to school."
- Using a person as the subject instead of 'it': ✗ "I take 20 minutes to walk to school." → ✓ "It takes me 20 minutes to walk to school."
- Using wrong tense of 'take' for past context: ✗ "It takes me two hours to get there yesterday." → ✓ "It took me two hours to get there yesterday."

### `m3-u3-time-connectors` — unit 3 · connectors

**Time Connectors** / Zeitliche Verbindungswörter

Using when, before, after, while, during, until, and by the time to connect clauses and express time relationships in narratives.

items: 40 — gap-fill 14 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · transformation 3 · matching 2 · question-formation 2 | d3 12 · d2 11 · d4 8 · d5 5 · d1 4

rules (seed):
- [tc-while-vs-during] 'While' is followed by a clause (subject + verb): While I was sleeping. 'During' is followed by a noun phrase: During the storm. They are NOT interchangeable.
  - DE: 'While' steht vor einem Satz (Subjekt + Verb): While I was sleeping. 'During' steht vor einer Nominalphrase: During the storm. Sie sind NICHT austauschbar.
  - "While they were climbing, it started to rain." — "Während sie kletterten, begann es zu regnen."
  - "During the storm, they stayed inside." — "Während des Sturms blieben sie drinnen."
- [tc-when-before-after] 'When' introduces a time clause. 'Before' means earlier than. 'After' means later than. All are followed by a clause.
  - DE: 'When' leitet einen Zeitsatz ein. 'Before' bedeutet früher als. 'After' bedeutet später als. Alle stehen vor einem Satz.
  - "When the storm started, we ran inside." — "Als der Sturm begann, liefen wir hinein."
  - "Before she left, she packed her bags." — "Bevor sie ging, packte sie ihre Taschen."
  - "After the rain stopped, they continued walking." — "Nachdem der Regen aufhörte, gingen sie weiter."
- [tc-until-by-the-time] 'Until' means up to the point when. 'By the time' means before or when (often implying something was too late).
  - DE: 'Until' bedeutet bis zu dem Zeitpunkt. 'By the time' bedeutet bis/als (oft mit der Bedeutung, dass etwas zu spät war).
  - "They waited until the rain stopped." — "Sie warteten, bis der Regen aufhörte."
  - "By the time they arrived, it was dark." — "Als sie ankamen, war es dunkel."

key forms (seed):
- affirmative: When the storm started, we ran inside. · While they were climbing, it rained. · During the storm, they stayed inside.
- negative: They didn't leave until the rain stopped. · Before she left, she didn't forget her bag.
- questions: What happened when the storm started? · What were you doing during the break?

common errors (seed):
- Using 'during' with a clause or 'while' with a noun phrase: ✗ "During I was sleeping, the phone rang." → ✓ "While I was sleeping, the phone rang."
- Using 'while' before a noun phrase instead of 'during': ✗ "While the storm, we stayed inside." → ✓ "During the storm, we stayed inside."
- Dropping parts of 'by the time' (writing just 'by' or 'by time'): ✗ "By they arrived, it was dark." → ✓ "By the time they arrived, it was dark."

### `m3-u4-comparative-intensifiers` — unit 4 · comparison

**Comparative and Superlative Intensifiers** / Verstärker bei Komparativ und Superlativ

Intensifying comparisons with much/a lot/a bit/a little + comparative, and using (not) nearly as...as for nuanced comparisons.

items: 39 — gap-fill 15 · error-correction 6 · multiple-choice 6 · sentence-building 3 · translation 3 · matching 2 · question-formation 2 · transformation 2 | d3 12 · d2 10 · d4 9 · d1 4 · d5 4

rules (seed):
- [ci-much-a-lot] Use 'much' or 'a lot' before a comparative to show a BIG difference. Use 'a bit' or 'a little' to show a SMALL difference.
  - DE: Man verwendet 'much' oder 'a lot' vor dem Komparativ für einen GROSSEN Unterschied. 'A bit' oder 'a little' zeigt einen KLEINEN Unterschied.
  - "Elephants are much bigger than dogs." — "Elefanten sind viel größer als Hunde."
  - "She is a bit taller than her sister." — "Sie ist ein bisschen größer als ihre Schwester."
- [ci-not-nearly-as] 'Not nearly as...as' means there is a big difference. 'Nearly as...as' means almost the same.
  - DE: 'Not nearly as...as' bedeutet, es gibt einen grossen Unterschied. 'Nearly as...as' bedeutet fast gleich.
  - "A cat is not nearly as dangerous as a lion." — "Eine Katze ist bei weitem nicht so gefährlich wie ein Löwe."
  - "He is nearly as tall as his father." — "Er ist fast so gross wie sein Vater."
- [ci-fewer-less] 'Fewer' is used with countable nouns (fewer people, fewer cars). 'Less' is used with uncountable nouns (less water, less time).
  - DE: 'Fewer' steht bei zählbaren Nomen (fewer people, fewer cars). 'Less' steht bei nicht zählbaren Nomen (less water, less time).
  - "There are fewer students in our class than in yours." — "Es gibt weniger Schüler in unserer Klasse als in eurer."
  - "I have less time than yesterday." — "Ich habe weniger Zeit als gestern."

key forms (seed):
- affirmative: Elephants are much bigger than dogs. · She is a lot more interesting than him. · He is a bit taller.
- negative: A cat is not nearly as dangerous as a lion. · This isn't much more expensive.
- questions: Is a cheetah much faster than a lion? · Are there fewer cars today?

common errors (seed):
- Using 'more' together with the -er form (double comparative): ✗ "She is much more bigger than her sister." → ✓ "She is much bigger than her sister."
- Putting the intensifier after the comparative instead of before: ✗ "He is taller much than me." → ✓ "He is much taller than me."
- Using 'less' with countable nouns instead of 'fewer': ✗ "There are less people in the park today." → ✓ "There are fewer people in the park today."

### `m3-u5-first-conditional` — unit 5 · conditionals

**First Conditional** / Erster Konditional (Bedingungssatz Typ 1)

Expressing real possibilities and likely outcomes with If + present simple, will + base verb.

items: 40 — gap-fill 15 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · context-picker 2 · matching 2 · transformation 2 | d3 13 · d2 10 · d4 9 · d1 4 · d5 4

rules (seed):
- [cond1-formation] Structure: If + present simple, ... will + base verb. The if-clause uses the PRESENT tense, NOT 'will'. Use a comma when the if-clause comes first.
  - DE: Struktur: If + Simple Present, ... will + Grundform. Der if-Satz verwendet die GEGENWART, NICHT 'will'. Beistrich, wenn der if-Satz zuerst kommt.
  - "If you study hard, you will pass the exam." — "Wenn du fleissig lernst, wirst du die Prüfung bestehen."
  - "You'll have bad luck if you walk under a ladder." — "Du wirst Pech haben, wenn du unter einer Leiter durchgehst."
- [cond1-negative] Negative forms: If you don't study, you won't pass. Both the if-clause and result clause can be negative.
  - DE: Verneinung: If you don't study, you won't pass. Sowohl der if-Satz als auch der Ergebnissatz können verneint sein.
  - "If it doesn't rain, we'll go to the park." — "Wenn es nicht regnet, gehen wir in den Park."
  - "If you don't hurry, you won't catch the bus." — "Wenn du dich nicht beeilst, wirst du den Bus nicht erwischen."
- [cond1-unless] 'Unless' means 'if...not'. Use unless + affirmative verb (NOT unless + negative — that would be a double negative).
  - DE: 'Unless' bedeutet 'wenn... nicht'. Man verwendet unless + bejahtes Verb (NICHT unless + Verneinung — das wäre eine doppelte Verneinung).
  - "Unless you hurry, you'll be late." — "Wenn du dich nicht beeilst, wirst du zu spät kommen."
  - "I'll go, unless it rains." — "Ich werde gehen, es sei denn, es regnet."

key forms (seed):
- affirmative: If you study hard, you'll pass. · If it rains, we'll stay inside. · You'll be late if you don't hurry.
- negative: If you don't study, you won't pass. · Unless you hurry, you won't catch the bus.
- questions: What will you do if it rains? · Will you come if I invite you?

common errors (seed):
- Using 'will' in the if-clause instead of present simple: ✗ "If I will go to London, I will visit Big Ben." → ✓ "If I go to London, I will visit Big Ben."
- Using present continuous instead of present simple in the if-clause: ✗ "If it is raining tomorrow, we'll stay inside." → ✓ "If it rains tomorrow, we'll stay inside."
- Using a negative verb after 'unless' (double negative): ✗ "Unless you don't hurry, you'll be late." → ✓ "Unless you hurry, you'll be late."

### `m3-u5-unless` — unit 5 · connectors

**unless** / unless (es sei denn)

Using 'unless' as a synonym for 'if...not' in conditional sentences, always followed by an affirmative verb.

items: 40 — gap-fill 17 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d3 14 · d2 9 · d4 9 · d1 4 · d5 4

rules (seed):
- [unless-meaning] 'Unless' = 'if...not'. Transform: 'If you don't hurry' = 'Unless you hurry'. The verb after 'unless' is ALWAYS affirmative.
  - DE: 'Unless' = 'wenn... nicht'. Umformung: 'If you don't hurry' = 'Unless you hurry'. Das Verb nach 'unless' ist IMMER bejahend.
  - "Unless it rains, we'll go to the park." — "Wenn es nicht regnet, gehen wir in den Park."
  - "I won't go unless you come with me." — "Ich gehe nicht, es sei denn, du kommst mit."
- [unless-transformation] To transform if...not to unless: remove 'not/don't/doesn't' and replace 'if' with 'unless'. The meaning stays the same.
  - DE: Umformung von if...not zu unless: 'not/don't/doesn't' entfernen und 'if' durch 'unless' ersetzen. Die Bedeutung bleibt gleich.
  - "If you don't study, you'll fail. = Unless you study, you'll fail." — "Wenn du nicht lernst, wirst du durchfallen. = Es sei denn, du lernst, wirst du durchfallen."
  - "If she doesn't come, we'll start without her. = Unless she comes, we'll start without her." — "Wenn sie nicht kommt, fangen wir ohne sie an."

key forms (seed):
- affirmative: Unless it rains, we'll go. · Unless you hurry, you'll be late.
- negative: 
- questions: 

common errors (seed):
- Adding a negative verb after 'unless': ✗ "Unless you don't come, we'll start without you." → ✓ "Unless you come, we'll start without you."
- Using 'unless' where simple 'if' is needed (positive condition): ✗ "Unless you study, you'll pass the exam." → ✓ "If you study, you'll pass the exam."

### `m3-u6-relative-clauses` — unit 6 · pronouns

**Defining Relative Clauses** / Bestimmende Relativsätze (who/which/that/whose)

Combining sentences using defining relative clauses with who (people), which (things/animals), that (both), and whose (possession).

items: 40 — gap-fill 15 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · matching 2 · transformation 2 · context-picker 1 · question-formation 1 | d3 14 · d2 10 · d4 9 · d1 5 · d5 2

rules (seed):
- [rc-who-which] Use 'who' or 'that' for people. Use 'which' or 'that' for things and animals. In defining relative clauses, 'that' can replace both.
  - DE: Man verwendet 'who' oder 'that' für Personen. 'Which' oder 'that' für Dinge und Tiere. In bestimmenden Relativsätzen kann 'that' beides ersetzen.
  - "The man who lives next door is a teacher." — "Der Mann, der nebenan wohnt, ist Lehrer."
  - "The book which I read was great." — "Das Buch, das ich gelesen habe, war toll."
- [rc-whose] 'Whose' shows possession. It replaces his/her/its/their in the relative clause.
  - DE: 'Whose' zeigt Besitz an. Es ersetzt his/her/its/their im Relativsatz.
  - "The girl whose dog ran away is sad." — "Das Mädchen, dessen Hund weggelaufen ist, ist traurig."
  - "That's the boy whose father is a pilot." — "Das ist der Junge, dessen Vater Pilot ist."
- [rc-defining-no-commas] Defining relative clauses give essential information about the noun. They have NO commas. Without the relative clause, we don't know which person/thing is meant.
  - DE: Bestimmende Relativsätze geben wesentliche Informationen über das Nomen. Sie haben KEINE Beistriche. Ohne den Relativsatz wüssten wir nicht, welche Person/Sache gemeint ist.
  - "The woman who called you is my aunt." — "Die Frau, die dich angerufen hat, ist meine Tante."
  - "I want the shirt that is in the window." — "Ich will das Hemd, das im Schaufenster ist."

key forms (seed):
- affirmative: The man who lives next door is a teacher. · The book which I read was great. · The girl whose dog ran away is sad.
- negative: That's not the person who called me. · This isn't the film that I wanted to see.
- questions: Is that the boy who won the race? · Which is the book that you read?

common errors (seed):
- Using 'what' as a relative pronoun instead of 'that' or 'which': ✗ "The thing what I saw was amazing." → ✓ "The thing that I saw was amazing."
- Confusing 'whose' (possessive) with 'who's' (who is): ✗ "The boy who's father is a pilot..." → ✓ "The boy whose father is a pilot..."
- Using 'which' for people or 'who' for things: ✗ "The teacher which helped me was nice." → ✓ "The teacher who helped me was nice."

### `m3-u7-present-perfect-for-since` — unit 7 · tenses

**Present Perfect with for/since** / Present Perfect mit for/since (Dauer und Zeitpunkt)

Using the present perfect with 'for' (duration) and 'since' (starting point) to talk about actions and states continuing to the present.

items: 40 — gap-fill 17 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · context-picker 2 · matching 2 | d3 14 · d2 11 · d4 9 · d1 4 · d5 2

rules (seed):
- [pp-for] 'For' is used with a DURATION — a period of time: for two years, for a long time, for ages, for six months.
  - DE: 'For' steht bei einer DAÜR — einem Zeitraum: for two years, for a long time, for ages, for six months.
  - "I've lived here for five years." — "Ich lebe seit fünf Jahren hier."
  - "She has been a teacher for a long time." — "Sie ist seit langem Lehrerin."
- [pp-since] 'Since' is used with a STARTING POINT — a specific point in time: since 2020, since last Friday, since Christmas, since I was seven.
  - DE: 'Since' steht bei einem ANFANGSPUNKT — einem bestimmten Zeitpunkt: since 2020, since last Friday, since Christmas, since I was seven.
  - "I've known her since 2015." — "Ich kenne sie seit 2015."
  - "We've been friends since we met at school." — "Wir sind Freunde, seit wir uns in der Schule kennengelernt haben."
- [pp-for-since-tense] With for/since, you MUST use the present perfect (not present simple). The action started in the past and continues NOW.
  - DE: Mit for/since MUSS man das Present Perfect verwenden (nicht das Simple Present). Die Handlung begann in der Vergangenheit und dauert JETZT noch an.
  - "I have lived here for three years." — "Ich wohne seit drei Jahren hier."
  - "How long have you had your phone?" — "Wie lange hast du schon dein Handy?"

key forms (seed):
- affirmative: I've lived here for five years. · She has known him since 2018. · We've been friends for ages.
- negative: I haven't seen her since Monday. · He hasn't played football for months.
- questions: How long have you lived here? · How long has she had that car?

common errors (seed):
- Confusing for (duration) and since (point in time): ✗ "I've lived here since three years." → ✓ "I've lived here for three years."
- Using present simple instead of present perfect with for/since: ✗ "I live here for five years." → ✓ "I've lived here for five years."
- Using 'for' with a specific point in time: ✗ "I've known her for 2015." → ✓ "I've known her since 2015."

### `m3-u8-past-simple-vs-present-perfect` — unit 8 · tenses

**Past Simple vs Present Perfect** / Simple Past vs Present Perfect (systematischer Vergleich)

Systematically contrasting past simple (finished actions at a specific time) with present perfect (present relevance, no specific time, for/since).

items: 40 — gap-fill 16 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · context-picker 2 · matching 2 · transformation 1 | d3 14 · d2 10 · d4 9 · d1 4 · d5 3

rules (seed):
- [ps-pp-time-markers] Past simple signals: yesterday, last week, ago, in 2010, when I was young. Present perfect signals: ever, never, just, already, yet, for, since, always.
  - DE: Simple Past Signalwörter: yesterday, last week, ago, in 2010, when I was young. Present Perfect Signalwörter: ever, never, just, already, yet, for, since, always.
  - "I went to London last year. (past simple — specific time)" — "Ich war letztes Jahr in London."
  - "I have been to London twice. (present perfect — no specific time)" — "Ich war zweimal in London."
- [ps-pp-decision-rule] Decision rule: Am I talking about WHEN something happened? Use past simple. Am I talking about THAT it happened or its relevance now? Use present perfect.
  - DE: Entscheidungsregel: Rede ich darüber, WANN etwas passiert ist? Simple Past. Rede ich darüber, DASS es passiert ist oder über die Relevanz jetzt? Present Perfect.
  - "When did you go there? — I went there in June. (PS)" — "Wann warst du dort? — Ich war im Juni dort."
  - "Have you ever been there? — Yes, I have. (PP)" — "Warst du schon mal dort? — Ja."
- [ps-pp-for-since-rule] for/since ALWAYS trigger present perfect (not past simple). These words indicate that the action continues to the present.
  - DE: for/since verlangen IMMER das Present Perfect (nicht Simple Past). Diese Wörter zeigen, dass die Handlung bis jetzt andauert.
  - "I've known her since 2020. (not: I knew her since 2020)" — "Ich kenne sie seit 2020."
  - "He has worked here for ten years. (not: He worked here for ten years — unless he left)" — "Er arbeitet seit zehn Jahren hier."

key forms (seed):
- affirmative: I went to London last year. · I have been to London twice. · She has lived here since 2018.
- negative: I didn't go yesterday. · I haven't been there yet. · She hasn't finished yet.
- questions: When did you go? · Have you ever been to London? · How long have you lived here?

common errors (seed):
- Using present perfect with a specific past time marker: ✗ "I have been there yesterday." → ✓ "I was there yesterday."
- Using past simple with ever/never (experience questions): ✗ "Did you ever go to London?" → ✓ "Have you ever been to London?"
- Using past simple with for/since: ✗ "I lived here since 2020." → ✓ "I've lived here since 2020."

### `m3-u9-be-allowed-to` — unit 9 · modals

**be (not) allowed to** / be (not) allowed to (Erlaubnis und Verbot)

Expressing permission and prohibition using be (not) allowed to + verb across present, past, and future tenses.

items: 39 — gap-fill 16 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d3 12 · d2 10 · d4 10 · d1 4 · d5 3

rules (seed):
- [allowed-present] Present: subject + am/is/are (not) allowed to + base verb. Used for rules and permissions from an authority.
  - DE: Präsens: Subjekt + am/is/are (not) allowed to + Grundform. Wird für Regeln und Erlaubnisse von einer Autorität verwendet.
  - "I'm not allowed to go out when it's dark." — "Ich darf nicht rausgehen, wenn es dunkel ist."
  - "We aren't allowed to use phones in class." — "Wir dürfen im Unterricht keine Handys benutzen."
- [allowed-past] Past: subject + was/were (not) allowed to + base verb. Used for past rules and permissions.
  - DE: Vergangenheit: Subjekt + was/were (not) allowed to + Grundform. Für vergangene Regeln und Erlaubnisse.
  - "I wasn't allowed to stay up late when I was young." — "Ich durfte nicht lange aufbleiben, als ich klein war."
  - "Women were allowed to attend university from 1897." — "Frauen durften ab 1897 an der Universität studieren."
- [allowed-questions] Questions: Am/Is/Are + subject + allowed to...? Was/Were + subject + allowed to...?
  - DE: Fragen: Am/Is/Are + Subjekt + allowed to...? Was/Were + Subjekt + allowed to...?
  - "Are you allowed to have parties at home?" — "Darfst du zuhause Partys machen?"
  - "Were they allowed to study all subjects?" — "Durften sie alle Faucher studieren?"

key forms (seed):
- affirmative: I'm allowed to go out. · She is allowed to use the computer. · They were allowed to leave early.
- negative: I'm not allowed to go out. · We aren't allowed to use phones. · She wasn't allowed to stay up late.
- questions: Are you allowed to have parties? · Were they allowed to vote? · Is he allowed to drive?

common errors (seed):
- Omitting the form of 'be' before 'allowed': ✗ "I not allowed to go out." → ✓ "I'm not allowed to go out."
- Wrong form of 'be' (subject-verb agreement error): ✗ "She are allowed to go." → ✓ "She is allowed to go."
- Confusing 'be allowed to' (permission) with 'can' (ability): ✗ "I'm allowed to swim very well." → ✓ "I can swim very well."

### `m3-u9-let` — unit 9 · modals

**let / don't let** / let / don't let (Erlaubnis geben/verweigern)

Using let/don't let + object + base verb (without 'to') to express giving or withholding permission.

items: 40 — gap-fill 18 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · matching 2 · question-formation 1 | d3 12 · d2 10 · d4 9 · d1 5 · d5 4

rules (seed):
- [let-formation] Structure: subject + let(s) / don't/doesn't let + object + BASE VERB (no 'to'!). The person giving permission is the subject.
  - DE: Struktur: Subjekt + let(s) / don't/doesn't let + Objekt + GRUNDFORM (ohne 'to'!). Die Person, die die Erlaubnis gibt, ist das Subjekt.
  - "My parents let me go out." — "Meine Eltern lassen mich ausgehen."
  - "The teacher doesn't let us eat in class." — "Der Lehrer lässt uns nicht im Unterricht essen."
- [let-past] Past: let stays the same (irregular — let/let/let). Negative past: didn't let + object + base verb.
  - DE: Vergangenheit: let bleibt gleich (unregelmaussig — let/let/let). Verneinte Vergangenheit: didn't let + Objekt + Grundform.
  - "She let me borrow her book yesterday." — "Sie hat mir gestern ihr Buch geliehen."
  - "They didn't let me go to the party." — "Sie haben mich nicht zur Party gehen lassen."
- [let-vs-allowed] let + object + base verb (no 'to') = be allowed to + base verb. 'They let me go' = 'I'm allowed to go.' Note: 'allow' takes 'to', but 'let' does NOT.
  - DE: let + Objekt + Grundform (ohne 'to') = be allowed to + Grundform. 'They let me go' = 'I'm allowed to go.' Achtung: 'allow' braucht 'to', aber 'let' NICHT.
  - "They let me stay. = I'm allowed to stay." — "Sie lassen mich bleiben. = Ich darf bleiben."
  - "She allows me to go. / She lets me go. (NOT: lets me to go)" — "Sie erlaubt mir zu gehen. / Sie lässt mich gehen."

key forms (seed):
- affirmative: My parents let me go out. · The teacher lets us use dictionaries. · She let me borrow it.
- negative: They don't let me stay up late. · She doesn't let us eat in class. · They didn't let me go.
- questions: Do your parents let you go out? · Did the teacher let you use your phone?

common errors (seed):
- Adding 'to' after let + object: ✗ "My parents let me to go out." → ✓ "My parents let me go out."
- Forgetting the -s in third person present (lets vs let): ✗ "She let us go every Friday. (meaning present habitual)" → ✓ "She lets us go every Friday."
- Mixing up let (no 'to') and allow (with 'to') structures: ✗ "They don't let me to go. / They don't allow me go." → ✓ "They don't let me go. / They don't allow me to go."

### `m3-u10-could-was-able-to` — unit 10 · modals

**could / was able to (Past Ability)** / could / was able to (Fähigkeit in der Vergangenheit)

Expressing past ability with could (general ability) and was/were able to (specific one-time achievement), including the full tense paradigm of be able to.

items: 40 — gap-fill 16 · error-correction 6 · multiple-choice 6 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 · transformation 1 | d3 13 · d2 9 · d4 9 · d1 5 · d5 4

rules (seed):
- [could-general] 'Could' is used for GENERAL past ability — things you were able to do over a period of time. 'Couldn't' works for both general and specific inability.
  - DE: 'Could' wird für ALLGEMEINE vergangene Fähigkeiten verwendet — Dinge, die man über einen Zeitraum konnte. 'Couldn't' funktioniert für allgemeine und spezifische Unfähigkeit.
  - "I could swim when I was five." — "Ich konnte schwimmen, als ich fünf war."
  - "She couldn't ride a bike until she was eight." — "Sie konnte nicht Rad fahren, bis sie acht war."
- [was-able-to-specific] 'Was/were able to' is used for SPECIFIC one-time achievements — something you managed to do on a particular occasion.
  - DE: 'Was/were able to' wird für SPEZIFISCHE einmalige Leistungen verwendet — etwas, das man bei einer bestimmten Gelegenheit geschafft hat.
  - "After trying many times, I was able to pass the exam." — "Nach vielen Versuchen konnte ich die Prüfung bestehen."
  - "The firefighters were able to rescue everyone." — "Die Feuerwehr konnte alle retten."
- [be-able-to-all-tenses] 'Be able to' works in ALL tenses: present (am/is/are able to), past (was/were able to), future (will be able to), present perfect (have/has been able to).
  - DE: 'Be able to' funktioniert in ALLEN Zeiten: Präsens (am/is/are able to), Vergangenheit (was/were able to), Zukunft (will be able to), Present Perfect (have/has been able to).
  - "I will be able to come tomorrow." — "Ich werde morgen kommen können."
  - "She hasn't been able to finish yet." — "Sie hat es noch nicht fertigmachen können."

key forms (seed):
- affirmative: I could swim when I was five. · She was able to pass the test. · He will be able to come.
- negative: I couldn't open the door. · She wasn't able to finish. · They won't be able to help.
- questions: Could you swim as a child? · Were you able to find it? · Will she be able to come?

common errors (seed):
- Using 'could' for a specific one-time achievement (affirmative only): ✗ "I could pass the exam yesterday." → ✓ "I was able to pass the exam yesterday."
- Dropping 'be' from the 'be able to' construction: ✗ "I will able to come tomorrow." → ✓ "I will be able to come tomorrow."
- Using a non-base form after 'able to': ✗ "She was able to swimming." → ✓ "She was able to swim."

### `m3-u10-future-pp-ability` — unit 10 · modals

**Future and Present Perfect Ability/Permission** / Zukunft und Present Perfect bei Fähigkeit/Erlaubnis

Completing the ability and permission system across all tenses: will be able to, will be allowed to, have been able to, have been allowed to.

items: 22 — gap-fill 6 · error-correction 3 · multiple-choice 3 · transformation 3 · sentence-building 2 · translation 2 · context-picker 1 · matching 1 · question-formation 1 | d3 8 · d2 5 · d4 4 · d5 3 · d1 2

rules (seed):
- [future-ability] Future ability: will (not) be able to + base verb. Used because 'can' has no future form.
  - DE: Zukünftige Fähigkeit: will (not) be able to + Grundform. Wird verwendet, weil 'can' keine Zukunftsform hat.
  - "I will be able to drive when I'm 18." — "Ich werde Auto fahren können, wenn ich 18 bin."
  - "She won't be able to come to the party." — "Sie wird nicht zur Party kommen können."
- [pp-ability] Present perfect ability: have/has (not) been able to + base verb. For ability with present relevance.
  - DE: Present Perfect Fähigkeit: have/has (not) been able to + Grundform. Für Fähigkeit mit Gegenwartsrelevanz.
  - "I haven't been able to finish my homework yet." — "Ich habe meine Hausaufgaben noch nicht fertigmachen können."
  - "She has been able to speak English since she was six." — "Sie kann seit ihrem sechsten Lebensjahr Englisch sprechen."

key forms (seed):
- affirmative: I will be able to come. · She has been able to help. · They will be allowed to enter.
- negative: He won't be able to finish. · I haven't been able to reach her. · We won't be allowed to go.
- questions: Will you be able to come? · Have you been able to find it? · Will they be allowed to stay?

common errors (seed):
- Dropping 'be' from the complex verb chain: ✗ "I will able to come tomorrow." → ✓ "I will be able to come tomorrow."
- Confusing 'been' and 'be' in different tenses: ✗ "I have be able to finish." → ✓ "I have been able to finish."
- Using 'will can' instead of 'will be able to': ✗ "I will can come tomorrow." → ✓ "I will be able to come tomorrow."

### `m3-u10-past-permission` — unit 10 · modals

**Past and Future Permission (was allowed to / will be allowed to)** / Erlaubnis in Vergangenheit und Zukunft (was allowed to / will be allowed to)

Expressing permission across all tenses using was/were (not) allowed to (past), will (not) be allowed to (future), and have/has (not) been allowed to (present perfect).

items: 22 — gap-fill 7 · error-correction 3 · multiple-choice 3 · sentence-building 2 · transformation 2 · translation 2 · context-picker 1 · matching 1 · question-formation 1 | d3 7 · d4 6 · d2 5 · d1 2 · d5 2

rules (seed):
- [past-permission] Past permission: was/were (not) allowed to + base verb. Used for rules and permissions that existed in the past.
  - DE: Vergangene Erlaubnis: was/were (not) allowed to + Grundform. Für Regeln und Erlaubnisse, die in der Vergangenheit galten.
  - "Women weren't allowed to vote until 1918." — "Frauen durften bis 1918 nicht wählen."
  - "We were allowed to leave early yesterday." — "Wir durften gestern früher gehen."
- [future-permission] Future permission: will (not) be allowed to + base verb. For rules and permissions in the future.
  - DE: Zukünftige Erlaubnis: will (not) be allowed to + Grundform. Für Regeln und Erlaubnisse in der Zukunft.
  - "Next year, we'll be allowed to stay out later." — "Nauchstes Jahr werden wir länger draußen bleiben dürfen."
  - "They won't be allowed to have a supermarket there." — "Sie werden dort kein Supermarkt haben dürfen."
- [pp-permission] Present perfect permission: have/has (not) been allowed to + base verb. For permission relevant to the present.
  - DE: Present Perfect Erlaubnis: have/has (not) been allowed to + Grundform. Für Erlaubnis mit Gegenwartsrelevanz.
  - "Women haven't always been allowed to do what men have." — "Frauen durften nicht immer das tun, was Männer durften."
  - "I've never been allowed to have a pet." — "Ich durfte noch nie ein Haustier haben."

key forms (seed):
- affirmative: They were allowed to leave. · She will be allowed to drive. · He has been allowed to stay.
- negative: They weren't allowed to vote. · She won't be allowed to go. · I haven't been allowed to do that.
- questions: Were you allowed to go? · Will we be allowed to stay? · Has she been allowed to leave?

common errors (seed):
- Omitting was/were from the past permission structure: ✗ "They allowed to go home early." → ✓ "They were allowed to go home early."
- Dropping 'be' from 'will be allowed to': ✗ "We will allowed to stay out later." → ✓ "We will be allowed to stay out later."
- Wrong was/were agreement with plural subject: ✗ "They was allowed to leave." → ✓ "They were allowed to leave."

### `m3-u11-present-perfect-continuous` — unit 11 · tenses

**Present Perfect Continuous** / Present Perfect Continuous (Verlaufsform des Present Perfect)

Expressing ongoing activities with duration using have/has + been + -ing form, often with for/since, and contrasting with present perfect simple.

items: 21 — gap-fill 8 · error-correction 3 · multiple-choice 3 · sentence-building 2 · translation 2 · context-picker 1 · matching 1 · transformation 1 | d3 7 · d2 5 · d4 5 · d1 2 · d5 2

rules (seed):
- [ppc-formation] Form: subject + have/has + been + verb-ing. Used for activities that have been going on for some time and are still continuing.
  - DE: Form: Subjekt + have/has + been + Verb-ing. Wird für Aktivitäten verwendet, die seit einiger Zeit andauern und noch weitergehen.
  - "I've been living here for six weeks." — "Ich wohne seit sechs Wochen hier."
  - "She has been working all morning." — "Sie arbeitet schon den ganzen Morgen."
- [ppc-vs-pp-simple] Present perfect continuous = focus on the ONGOING ACTIVITY. Present perfect simple = focus on the RESULT or completion. 'I've been reading all morning' (activity) vs 'I've read three books' (result).
  - DE: Present Perfect Continuous = Fokus auf die LAUFENDE AKTIVITÄT. Present Perfect Simple = Fokus auf das ERGEBNIS oder den Abschluss. 'I've been reading all morning' (Aktivität) vs 'I've read three books' (Ergebnis).
  - "I've been reading all morning. (emphasis on activity)" — "Ich lese schon den ganzen Morgen. (Betonung auf Aktivität)"
  - "I've read three books this month. (emphasis on result)" — "Ich habe diesen Monat drei Bücher gelesen. (Betonung auf Ergebnis)"
- [ppc-stative-verbs] Stative verbs (know, like, want, be, have) do NOT take the continuous form. Use present perfect simple: I've known her for years (NOT: I've been knowing her).
  - DE: Zustandsverben (know, like, want, be, have) verwenden NICHT die Verlaufsform. Present Perfect Simple: I've known her for years (NICHT: I've been knowing her).
  - "I've known her since primary school. (NOT: I've been knowing)" — "Ich kenne sie seit der Volksschule."
  - "She has liked chocolate since she was a child. (NOT: has been liking)" — "Sie mag Schokolade, seit sie ein Kind war."

key forms (seed):
- affirmative: I've been living here for six weeks. · She has been studying all day. · We've been waiting for an hour.
- negative: I haven't been sleeping well. · She hasn't been feeling well. · They haven't been practising enough.
- questions: How long have you been living here? · Has she been working all day? · What have you been doing?

common errors (seed):
- Missing the -ing form after 'been': ✗ "I have been live here for six weeks." → ✓ "I have been living here for six weeks."
- Omitting 'been' from the construction: ✗ "I have living here for six weeks." → ✓ "I have been living here for six weeks."
- Using present perfect continuous with stative verbs: ✗ "I've been knowing her for years." → ✓ "I've known her for years."

### `m3-u12-passive-voice` — unit 12 · passive

**Passive Voice (Present and Past Simple)** / Passiv (Gegenwartspassiv und Vergangenheitspassiv)

Forming the present simple passive (am/is/are + past participle) and past simple passive (was/were + past participle), with optional agent (by).

items: 21 — gap-fill 7 · error-correction 3 · multiple-choice 3 · sentence-building 2 · transformation 2 · translation 2 · context-picker 1 · matching 1 | d3 7 · d2 5 · d4 5 · d1 2 · d5 2

rules (seed):
- [pass-present] Present simple passive: subject + am/is/are + past participle. Used when the action or object is more important than the doer.
  - DE: Präsens Passiv: Subjekt + am/is/are + Partizip Perfekt. Wird verwendet, wenn die Handlung oder das Objekt wichtiger ist als der Handelnde.
  - "English is spoken in many countries." — "Englisch wird in vielen Ländern gesprochen."
  - "The letters are delivered every morning." — "Die Briefe werden jeden Morgen zugestellt."
- [pass-past] Past simple passive: subject + was/were + past participle. Used for completed passive events in the past.
  - DE: Vergangenheitspassiv: Subjekt + was/were + Partizip Perfekt. Für abgeschlossene passive Ereignisse in der Vergangenheit.
  - "The city was destroyed by an earthquake." — "Die Stadt wurde durch ein Erdbeben zerstört."
  - "Hundreds of people were rescued." — "Hunderte Menschen wurden gerettet."
- [pass-by-agent] The doer (agent) is introduced with 'by'. Only include the agent when it adds important information. If the doer is unknown or unimportant, omit it.
  - DE: Der Handelnde (Agent) wird mit 'by' eingeführt. Der Agent wird nur erwähnt, wenn er wichtige Information hinzufügt. Wenn der Handelnde unbekannt oder unwichtig ist, lässt man ihn weg.
  - "The book was written by J.K. Rowling." — "Das Buch wurde von J.K. Rowling geschrieben."
  - "The window was broken. (agent unknown)" — "Das Fenster wurde zerbrochen. (Handelnder unbekannt)"

key forms (seed):
- affirmative: English is spoken here. · The city was destroyed. · The book was written by Rowling.
- negative: The letters aren't delivered on Sundays. · The house wasn't damaged.
- questions: Is English spoken here? · Was the city destroyed? · Were the people rescued?

common errors (seed):
- Using the wrong past participle form (often the base form or past simple): ✗ "The house was build in 1960." → ✓ "The house was built in 1960."
- Omitting the form of 'be' from the passive construction: ✗ "The city destroyed by an earthquake." → ✓ "The city was destroyed by an earthquake."
- Wrong form of 'be' (was/were or is/are) for the subject: ✗ "The people was rescued." → ✓ "The people were rescued."
- Using 'from' instead of 'by' to introduce the agent: ✗ "The city was hit from an earthquake." → ✓ "The city was hit by an earthquake."

### `m3-u13-second-conditional` — unit 13 · conditionals

**Second Conditional** / Zweiter Konditional (Bedingungssatz Typ 2)

Expressing hypothetical, unlikely, or imaginary situations with If + past simple, would + base verb, and contrasting with the first conditional.

items: 21 — gap-fill 8 · error-correction 3 · multiple-choice 3 · sentence-building 2 · translation 2 · context-picker 1 · matching 1 · transformation 1 | d3 7 · d2 5 · d4 4 · d5 3 · d1 2

rules (seed):
- [cond2-formation] Structure: If + past simple, ... would + base verb. The past simple does NOT refer to the past — it signals that the situation is hypothetical. 'Would' can be contracted to 'd.
  - DE: Struktur: If + Simple Past, ... would + Grundform. Das Simple Past bezieht sich NICHT auf die Vergangenheit — es zeigt, dass die Situation hypothetisch ist. 'Would' kann zu 'd verkürzt werden.
  - "If I had a million euros, I'd travel the world." — "Wenn ich eine Million Euro hätte, würde ich die Welt bereisen."
  - "If she lived closer, we would see each other more." — "Wenn sie näher wohnen würde, würden wir uns öfter sehen."
- [cond2-negative] Negative: If I didn't have..., I wouldn't... Both clauses can be negative.
  - DE: Verneinung: If I didn't have..., I wouldn't... Beide Sätze können verneint sein.
  - "If I didn't have homework, I would go out." — "Wenn ich keine Hausaufgaben hätte, würde ich ausgehen."
  - "She wouldn't be happy if she knew the truth." — "Sie wäre nicht glücklich, wenn sie die Wahrheit wüsste."
- [cond2-vs-cond1] First conditional = real possibility (If + present, will). Second conditional = hypothetical/unlikely (If + past, would). 'If I find your wallet, I'll give it back' (possible) vs 'If I found a million euros, I'd buy a house' (unlikely).
  - DE: Erster Konditional = reale Möglichkeit (If + Präsens, will). Zweiter Konditional = hypothetisch/unwahrscheinlich (If + Vergangenheit, would). 'If I find your wallet, I'll give it back' (möglich) vs 'If I found a million euros, I'd buy a house' (unwahrscheinlich).
  - "If it rains, we'll stay inside. (1st — real)" — "Wenn es regnet, bleiben wir drinnen. (1. — real)"
  - "If I were a bird, I would fly to Africa. (2nd — imaginary)" — "Wenn ich ein Vogel wäre, würde ich nach Afrika fliegen. (2. — imaginär)"

key forms (seed):
- affirmative: If I had money, I'd buy a car. · If she were here, she would help us. · I'd travel the world if I could.
- negative: If I didn't have homework, I'd go out. · She wouldn't be happy if she knew. · I wouldn't do that if I were you.
- questions: What would you do if you won the lottery? · Would you move if you could? · If I were you, what would you do?

common errors (seed):
- Using 'would' in the if-clause instead of past simple: ✗ "If I would have more money, I would buy a car." → ✓ "If I had more money, I would buy a car."
- Using present simple (1st conditional) where past simple (2nd conditional) is needed: ✗ "If I have a million euros, I would travel the world." → ✓ "If I had a million euros, I would travel the world."
- Using 'would' in both the if-clause and the result clause: ✗ "If I would be rich, I would buy a big house." → ✓ "If I were/was rich, I would buy a big house."

### `m3-u14-going-to-evidence` — unit 14 · tenses

**Going to for Evidence-Based Predictions** / Going to für Vorhersagen aufgrund von Beweisen

Expanding the going to future to include evidence-based predictions alongside planned actions, and contrasting with will for opinions and spontaneous decisions.

items: 22 — gap-fill 9 · error-correction 3 · multiple-choice 3 · sentence-building 2 · translation 2 · context-picker 1 · matching 1 · question-formation 1 | d3 8 · d2 5 · d4 5 · d1 2 · d5 2

rules (seed):
- [going-to-evidence] Use 'going to' for predictions based on EVIDENCE you can see or know about right now. Something is clearly about to happen.
  - DE: Man verwendet 'going to' für Vorhersagen, die auf BEWEISEN basieren, die man gerade sehen oder wissen kann. Etwas wird offensichtlich gleich passieren.
  - "Look at those clouds — it's going to rain." — "Schau dir die Wolken an — es wird regnen."
  - "The car is out of control — it's going to crash!" — "Das Auto ist ausser Kontrolle — es wird zusammenstossen!"
- [going-to-vs-will] 'Going to' = evidence-based predictions and plans. 'Will' = opinions, general predictions (no specific evidence), spontaneous decisions, offers, promises.
  - DE: 'Going to' = Vorhersagen aufgrund von Beweisen und Plaune. 'Will' = Meinungen, allgemeine Vorhersagen (ohne spezifischen Beweis), spontane Entscheidungen, Angebote, Versprechen.
  - "It's going to rain. (I can see dark clouds)" — "Es wird regnen. (Ich sehe dunkle Wolken)"
  - "I think it will rain tomorrow. (my opinion, no evidence)" — "Ich glaube, es wird morgen regnen. (meine Meinung, kein Beweis)"
- [going-to-plans-revision] Revision: 'going to' is also used for planned future actions — intentions that were made before the moment of speaking.
  - DE: Wiederholung: 'going to' wird auch für geplante zukünftige Handlungen verwendet — Absichten, die vor dem Sprechmoment gefasst wurden.
  - "I'm going to visit London next summer. (plan)" — "Ich werde nauchsten Sommer London besuchen. (Plan)"
  - "Are you going to book a hotel?" — "Wirst du ein Hotel buchen?"

key forms (seed):
- affirmative: It's going to rain. · I'm going to visit London. · She's going to be a doctor.
- negative: It's not going to work. · I'm not going to tell anyone. · They aren't going to come.
- questions: Is it going to rain? · Are you going to call her? · What are you going to do?

common errors (seed):
- Using 'will' for evidence-based predictions instead of 'going to': ✗ "Look at those clouds — it will rain!" → ✓ "Look at those clouds — it's going to rain!"
- Omitting the 'be' verb from the going to construction: ✗ "I going to go to the cinema." → ✓ "I'm going to go to the cinema."
- Writing 'gonna' in formal contexts: ✗ "I'm gonna visit London next summer." → ✓ "I'm going to visit London next summer."
