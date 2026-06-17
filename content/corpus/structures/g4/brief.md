# Grammar structures — g4 (stage-4 authoring brief)

<!-- domigo:structures g4 evidence=f91685ad630f -->

## Authoring contract

Write `content/corpus/structures/g4/structures.draft.json`:

```jsonc
{
  "schema": "grammar-structures-draft@1",
  "grade": 4,
  "briefEvidence": "f91685ad630f",
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
| 1 | g4-u01 | g4/sb/More 4 SB Unit 1.txt | 0 | 1 |
| 2 | g4-u02 | g4/sb/More 4 SB Unit 2.txt | 1 | 1 |
| 3 | g4-u03 | g4/sb/More 4 SB Unit 3.txt | 1 | 1 |
| 4 | g4-u04 | g4/sb/More 4 SB Unit 4.txt | 1 | 1 |
| 5 | g4-u05 | g4/sb/More 4 SB Unit 5.txt | 1 | 1 |
| 6 | g4-u06 | g4/sb/More 4 SB Unit 6.txt | 1 | 2 |
| 7 | g4-u07 | g4/sb/More 4 SB Unit 7.txt | 1 | 2 |
| 8 | g4-u08 | g4/sb/More 4 SB Unit 8.txt | 1 | 1 |
| 9 | g4-u09 | g4/sb/More 4 SB Unit 9.txt | 1 | 1 |
| 10 | g4-u10 | g4/sb/More 4 SB Unit 10.txt | 1 | 1 |
| 11 | g4-u11 | g4/sb/More 4 SB Unit 11.txt | 1 | 1 |
| 12 | g4-u12 | g4/sb/More 4 SB Unit 12.txt | 1 | 1 |
| 13 | g4-u13 | g4/sb/More 4 SB Unit 13.txt | 1 | 1 |

## SB grammar boxes (verbatim)

### g4/sb/More 4 SB Unit 10.txt (unit 10)

#### `g4/sb/More 4 SB Unit 10.txt#grammar-1` — 1st and 2nd Conditional (Revision) 1 If I get a good price, I will sell the farm. 2 If I got a good price, I would sell the farm.

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

### g4/sb/More 4 SB Unit 11.txt (unit 11)

#### `g4/sb/More 4 SB Unit 11.txt#grammar-1` — Reflexive pronouns

```
How to use it:
Wenn das Subjekt und das Objekt eines Verbs die gleiche Person sind, verwendest du ein Reflexivpronomen als Objekt.
Mithilfe des Reflexivpronomens kannst du betonen, dass die jeweilige Person etwas selbst getan hat / tun wird oder der Person selbst etwas zugestoßen ist.
Which kind of reflexive is it?
Write 1 or 2 after each example sentence:
He decides to enjoy himself by travelling with his wife.
1
I wrote the book myself. (= only me, no one helped me)
2
I’ll look after myself.
……
She asks herself a big question.
……
They’re free to have parties and enjoy themselves.
……
We bought the book ourselves.
……
We’re going to enjoy ourselves a lot.
……
Would you call yourself a reader?
……
You’ll have to read the book yourself.
……
[Image description: A cartoon of a person in a hospital bed fully bandaged, with one leg and both arms elevated, and their head wrapped in bandages. A visitor is standing next to the bed holding a bunch of colorful balloons. The visitor says: “I heard about your accident. Did you hurt yourself?”]
```

### g4/sb/More 4 SB Unit 12.txt (unit 12)

#### `g4/sb/More 4 SB Unit 12.txt#grammar-1` — Phrasal verbs

```
How to use it: Im Englischen stehen Präpositionen, die zu einem Verb gehören, häufig nach dem Verb: What are you waiting for?
She spent all her pocket money on paint and paper.
Gelegentlich gibt die Präposition dem Verb eine spezielle Bedeutung: Astronauts can choose from 100 different food items.
The Challenger broke up when it re-entered the Earth’s atmosphere.
When Emily’s mother looked at the paintings, she felt a little bit uncomfortable.
She picked up some of her paintings.
Manchmal erhält das Verb durch die Verwendung einer oder mehrerer Präposition(en) eine völlig andere Bedeutung: We already have the technology to take off from our planet.
She got on well with everyone.
She set off for the art shop.
She’d run out of paint, but she had no pocket money left.
He hadn’t come up with anything good for a long time.
The second option is to set up our new homes on other planets or moons.
Write the phrasal verbs above next to their meanings.
1 start (a journey, a trip)
.............................................................
2 leave the ground and go into the sky
.............................................................
3 to build/make/start a new life/business
.............................................................
4 think of an idea
.............................................................
5 have a relationship with
.............................................................
6 finished completely
.............................................................
Vorsicht: Wie im Deutschen sind Verben auch im Englischen oft mit einer Präposition verbunden. Die Präpositionen sind im Englischen aber häufig anders als im Deutschen, daher musst du die jeweilige Präposition immer mit dem Verb mitlernen.
warten auf / wait for
denken an / think of
[Image description: A cartoon image shows Mr Green dressed in a fur coat and hat, setting off to hunt for bears with binoculars and a large stick. His neighbors are watching from the window looking surprised. Caption: “When Mr Green set off to hunt for bears, his neighbours couldn’t believe their eyes.”]
```

### g4/sb/More 4 SB Unit 13.txt (unit 13)

#### `g4/sb/More 4 SB Unit 13.txt#grammar-1` — Prefixes (Vorsilben)

```
Die Vorsilben in-, il-, im-, ir- oder un- in Adjektiven bedeuten nicht oder das Gegenteil von:
correct – incorrect / legal – illegal / possible – impossible / regular – irregular / fair – unfair
Die Vorsilbe mini- in Nomen bedeutet klein:
skirt – miniskirt / bus – minibus / cam – minicam (cam = camera)
Die Vorsilben dis- in Verben bedeuten nicht oder das Gegenteil von, und mis- bedeutet schlecht:
agree – disagree / understand – misunderstand
Suffixes (Nachsilben)
Die Nachsilbe -ness verändert ein Adjektiv in ein Nomen:
happy – happiness / dark – darkness / blind – blindness
Die Nachsilbe -ful verändert ein Nomen in ein Adjektiv:
success – successful / care – careful / meaning – meaningful / beauty – beautiful
Die Nachsilbe -less verändert ein Nomen in ein Adjektiv und bedeutet ohne:
hope – hopeless / home – homeless / meaning – meaningless
(Image at the bottom shows a man reading a vocabulary list aloud to a dog. The list includes “hope → hopeless, home → homeless, meaning → meaningless.” The dog responds with: “I disagree!”)
```

### g4/sb/More 4 SB Unit 2.txt (unit 2)

#### `g4/sb/More 4 SB Unit 2.txt#grammar-1` — 🟦 Past perfect

```
Du verwendest das Past perfect, wenn du betonen möchtest, dass eine Handlung vor einem bestimmten Zeitpunkt in der Vergangenheit geschehen war.
Example sentence:
 Nobody was in the building. All the employees had left.
How to form it:
 Subject + had(n’t) + past participle of the verb
Instruction box:
 Look at the sentence below. Circle the verb in the past simple. Underline the verb in the past perfect.
 The murderer was an orang-utan. It had escaped from a sailor.
[Image description: Cartoon drawing of a tent in the forest next to a lake. A boy in yellow pajamas rubs his head in confusion.]
Caption under the image:
 When Harry got up in the morning, he realised that he had put his tent in the wrong place.
```

### g4/sb/More 4 SB Unit 3.txt (unit 3)

#### `g4/sb/More 4 SB Unit 3.txt#grammar-1` — Reported speech (statements)

```
Tense changes
 Wenn du etwas weiter erzählst, was eine andere Person zu einem früheren Zeitpunkt gesagt hat, und das reporting verb im past steht (He/She said … / He/She told me …), dann werden die Zeitformen in der reported speech wie folgt verändert:
present: “It looks like a war between architecture and painting,” said one critic.
 → One critic said that it looked like a war between architecture and painting.
past / present perfect: “You did something that no one else has ever done,” said Jeffery Skiles.
 Jeffery Skiles said that you had done something no one had ever done.
can: “We can’t make the runway,” said Sully.
 → Sully said that they couldn’t make the runway.
will: “We will land on the river,” said Sully.
 → Sully said that they would land on the river.
must: “I must land the plane on the river,” said Sully.
 → Sully said that he had to land the plane on the river.
Reporting time references
 Beim Berichten wirst du die Zeitangaben (yesterday, last year, tomorrow, …) anpassen müssen:
the day (week/month/year) before, 3 days before:
 She said John had phoned her the day before.
the next/following day (week/month/year), 3 days later:
 Tom told me he was leaving the following day.
Aber: Wenn am gleichen Tag berichtet wird, dann ändern sich die Zeitbezüge nicht!
 “John phoned me yesterday,” said Lisa. (She said it this morning.)
 Lisa said John had phoned her yesterday.
 Tom said, “I’m leaving tomorrow.” (Tom told me a few hours ago.)
 Tom said he was leaving tomorrow.
Pronouns
 Achtung: Passe alle Personenangaben an:
 “I like you,” he said to me. → He said that he liked me.
 “It’s mine,” she said. → She said that it was hers.
 “That’s my bike,” Jon said. → Jon said that it was his bike.
Other common changes
Direct speech	Reported speech
this (time): “I’m going there this week.”	that (time): He said he was going there that week.
this (referring to objects): “I want this sandwich.”	the: She said she wanted the sandwich.
here: “I live here.”	there: He said that he lived there.

Image description:
 In the top right corner, there is a comic-style image showing a man (Bill) sitting in front of a computer, speaking to himself. A caption says:
 “When the boss said people couldn’t write personal emails from the office, Bill decided to try a different kind of communication.”
say vs. tell
 Wenn du tell als Einleitverb verwendest, musst du die Person(en) nennen, zu denen etwas gesagt wird/wurde:
 Harten told Sully that runway 1 at Teterboro airport was free.
 Harten said (to Sully) that runway 1 at Teterboro airport was free.
```

### g4/sb/More 4 SB Unit 4.txt (unit 4)

#### `g4/sb/More 4 SB Unit 4.txt#grammar-1` — Questions in reported speech

```
Wenn du über Fragen berichtest, verwendest du kein do, does oder did.
 “Where do you live?” → She asked me where I lived.
Wenn du über Fragen berichtest, ändert sich die Zeit um eine Zeitstufe (z. B. present → past) so wie in der indirekten Rede (siehe Unit 3).
Außerdem behältst du dann das Fragewort (why / where / who / when / how etc.).
“Why do you have a dog with you?” → He asked me why I had a dog with me.
 “Where have you worked before?” → He asked me where I had worked before.
 “When can you start?” → They asked me when I could start.
Wenn du über eine Ja/Nein-Frage berichtest, verwendest du if und veränderst die Zeiten (…, ob …).
 “Do you like working with people?” → He asked me if I liked working with people.
Image description:
 A nervous-looking boy is standing outside a door labelled “INTERVIEWS HERE” holding a dog on a leash. He’s pulling at his collar.
 Caption:
 “I didn’t get the job – but they asked Rover if he could start tomorrow!”
```

### g4/sb/More 4 SB Unit 5.txt (unit 5)

#### `g4/sb/More 4 SB Unit 5.txt#grammar-1` — Past perfect (Revision)

```
1 Circle the correct option. Then complete the rule.
Du verwendest das Past perfect, wenn du unterstreichen möchtest, dass eine Handlung
 vor / nach einem bestimmten Zeitpunkt in der Vergangenheit geschehen war.
 Du bildest das Past perfect mit
 had + 3rd form / past form
 des Hauptverbs.
When I went home, I knew I had finally beaten my problem.
Wenn du before oder after im (Glied-)Satz verwendest, brauchst du meist das Past perfect nicht zu verwenden.
 My friends had left before I got there.
Past perfect with just / after
Mit just und after und dem Past perfect kannst du Ereignisse in die richtige Reihenfolge bringen.
 Für das erste Ereignis verwendest du past perfect tense. Für das zweite Ereignis verwendest du past.
For example:
 After James had eaten the two pizzas, the burger and chips, he felt very ill.
 First, James ate the two pizzas and the burger and chips.
 Then, he felt very ill.
Sally had just finished her meal when Tom came home.
 First, Sally finished her meal.
 Then, Tom came home.
Connecting ideas
So kannst du Sätze miteinander verknüpfen. Beispiele:
Cause/Result (Ursache/Ergebnis)
 Children will live shorter lives than their parents, because of the food they eat.
Contrast (Gegensatz)
 In the USA the average intake for adults is between 2,000 and 3,000 calories a day, although sometimes it’s much more.
 However, the problem is not just in Africa and Asia.
Purpose (Absicht)
 He did a TV programme called Jamie’s School Dinners in order to educate people about food.
 After the lesson my P.E. teacher told me to come to her room so that she could talk to me.
The Mag 3
 The meat debate
1 🎧 Watch the story. Complete the sentences with the words in the box. There are four you won’t use.
Word box:
 animal headmaster Maths teacher loves handbag sandwiches pizza pocket police hates
The school offers veggie burgers and veggie _________________.
Stern ________________ meat.
Vegans don’t eat any ________________ products at all.
Mr Davis nearly got into trouble with the _________________.
Mr Johnson is the _________________.
Miss Chappell put the steak in her ________________.
2 Match the people with what they think.
1 ⬜ Miss Chappell
 2 ⬜ Mr Davis
 3 ⬜ Nick
 4 ⬜ Jessica
a. ⬜ understands why the demonstrators are unhappy.
 b. ⬜ used to demonstrate for animal rights.
 c. ⬜ found it difficult to get good vegetarian food.
 d. ⬜ enjoys cooking vegetarian food.
 e. ⬜ thinks there’s enough vegetarian food on the menu.
 f. ⬜ feels healthier not eating meat.
Everyday English
3 Complete with the phrases in the box. Then practise the dialogues.
Phrase box:
 Beats me  Go right ahead  Between me and you  Not as far as I know
Image descriptions and captions:
Image 1
 Mr Davis, I’d like to talk to you a bit about being a vegetarian.
 “__________________________.”
Image 2
```

### g4/sb/More 4 SB Unit 6.txt (unit 6)

#### `g4/sb/More 4 SB Unit 6.txt#grammar-1` — Adverbs of manner (Revision)

```
Mit dem Adverb der Art und Weise drückst du aus, wie jemand etwas macht oder wie etwas geschieht.
Dream Boxes were successfully distributed to over 50,000 students.
 Dream Boxes are mainly distributed to elementary and middle schools.
Complete: Regelmäßige Adverbien werden mit dem Adjektiv + -ly gebildet.
Beachte die Ausnahmen:
 good – well  fast – fast  hard – hard (→ hardly = kaum, e.g. I hardly slept at all last night.)
 Everybody worked hard.
 The project did really well in its first year.
Bei einigen Zeitwörtern (look, sound, feel, taste, smell, find) werden Adjektive und nicht Adverbien verwendet.
 Things look really bad.  That doesn’t sound good.  This food tastes awful.
Question tags
Um die deutschen Fragen oder? bzw. nicht wahr? zu bilden, verwendest du im Englischen sogenannte question tags. Hierbei gelten folgende Regeln:
Bei bejahenden Sätzen verwendest du einen verneinenden tag, bei verneinenden einen bejahenden.
That’s easy, isn’t it?
 You have cleaned your room, haven’t you?
 You aren’t from here, are you?
Im question tag wiederholst du das Hilfsverb (be oder have) bzw. das modal verb (z. B. can / should / will / might).
 She is going to London tomorrow, isn’t she?
 They haven’t done their homework yet, have they?
 All kids should eat healthily, shouldn’t they?
 You can remember your favourite book in primary school, can’t you?
 It will be sunny tomorrow, won’t it?
Wenn im Satz kein Hilfsverb oder modal verb vorkommt, verwendest du eine Form von do im question tag.
 She started her healthy cooking channel, didn’t she?
Das Nomen wird durch ein Pronomen ersetzt.
 Amber was only 11 at the time, wasn’t she?
Image description:
 Bottom right: A girl kisses a boy on the cheek. He looks shocked. Caption:
 She kissed you again, didn’t she?
```

### g4/sb/More 4 SB Unit 7.txt (unit 7)

#### `g4/sb/More 4 SB Unit 7.txt#grammar-1` — Present simple for future

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

### g4/sb/More 4 SB Unit 8.txt (unit 8)

#### `g4/sb/More 4 SB Unit 8.txt#grammar-1` — Present perfect vs. past simple (Revision)

```
Read the sentences. Then answer the questions.
I’ve collected between 18,000 and 19,000 different kinds of sand since I started my hobby.
Last year I got a wonderful collection from a geology professor in North Carolina.
A few hours later I started playing again with a new player.
It hasn’t turned up on the black market yet.
1 Which of these sentences talk about actions that:
 a. began in the past and are still going on?
 b. began in the past and are finished?
2 Which of the sentences are in the past simple and which are in the present perfect?
Time expressions
Look at the sentences. Then complete the rule with the correct tense.
You often use the following time expressions with the __________:
 yesterday / last year (month, weekend, Friday, …) / in 2013 / 2 months ago
You often use the following time expressions with the __________:
 just / already / never / recently / (not) yet
Image: Two cave people looking at a third person holding a phone, with the caption: “Haven’t you heard of modern technology?”
```

### g4/sb/More 4 SB Unit 9.txt (unit 9)

#### `g4/sb/More 4 SB Unit 9.txt#grammar-1` — might / may / could

```
 (possibility)
Circle the correct words:
 Wenn du über Möglichkeiten / Sicherheiten sprechen willst, kannst du die Modalverben might / may / could verwenden.
If you go to Greece or Bulgaria, you might be surprised.
It is a rude sign in some cultures and might insult people.
 Japanese people may smile when they are confused or angry.
 These questions may help you.
It could get you into trouble in some countries.
Nach einem Modalverb kommt immer die Nennform / -ing-Form.
There are also other ways of talking about possibility:
 There is a chance that a smile could get you into trouble.
You use likelihood + of + gerund:
 The likelihood of insulting someone is quite high.
You use likely + to + infinitive:
 You are likely to offend the Japanese if you blow your nose into a handkerchief.
 She’s not likely to win, if she doesn’t practise more.
Cartoon image description: Two boys are standing on a beach looking at a pair of seagulls. One boy says, “They might not be hungry!”
The Mag 5 A visitor abroad
1 🎥 Watch the story. Circle the correct words.
 1 Katia is Jessica’s / Lucy’s penfriend.
 2 Katia’s mum / dad is from Hungary.
 3 The headmaster didn’t like Katia’s shoes / boots.
 4 Lucy wants / doesn’t want to do a story on school uniforms.
 5 Most people at the school are / aren’t in favour of school uniforms.
 6 Nick / Liam wants to take photos of Katia.
2 Complete the sentences.
 1 Nick speaks slowly to Katia because …
 2 Katia speaks perfect English because …
 3 The headmaster objects* to Katia’s shoes because …
 4 Lucy doesn’t want to do an article on school uniforms because …
 5 Nick wants to take photos of Katia because …
*VOCABULARY: object = ablehnen
Everyday English
 3 Complete with the missing phrases. Then practise the dialogues.
 That’s settled  I’ll see what I can do  Pleased to meet you  Don’t mention it
1
 Man: Oh yes, Mrs Butler told me about you.
 Girl: “...................., Katia.”
 Image: Katia shaking hands with a smiling man behind a desk.
2
 Girl: It’s very kind of you to have me here. Thank you.
 Man: ?
 Girl: It’s our pleasure.
 Image: Katia and the man continuing the conversation.
3
 Man: They weren’t really made for schools, were they? So maybe you can find another pair of shoes. Can you do that?
 Girl: Well, “...................”
 Image: Katia nodding and smiling in reply.
4
 Man: I’ll ask Jessica. She might be the same size as me.
 Girl: “...................”
 Image: The man smiling confidently, arms on the table.
```

## v1 floor catalog — m4 (UNTRUSTED seed: mine for ideas, map or waive every id)

### `m4-u1-past-continuous-revision` — unit 1 · tenses

**Past Continuous** / Past Continuous (Vertiefende Wiederholung)

Deep revision of past continuous (was/were + -ing) for background actions, interrupted actions, and simultaneous past actions, contrasted with past simple.

items: 40 — gap-fill 12 · multiple-choice 7 · error-correction 6 · transformation 5 · translation 4 · sentence-building 3 · context-picker 2 · matching 1 | d3 12 · d4 9 · d2 8 · d1 6 · d5 5

rules (seed):
- [past-cont-interrupted] Use past continuous for a longer action interrupted by a shorter one (past simple). Pattern: While X was happening, Y happened.
  - DE: Verwende das Past Continuous für eine längere Handlung, die von einer kürzeren (Past Simple) unterbrochen wird. Muster: While X was happening, Y happened.
  - "While his mum was reading, Johnny gave her a surprise." — "Während seine Mutter las, überraschte Johnny sie."
  - "I was walking home when it started to rain." — "Ich ging gerade nach Hause, als es zu regnen begann."
- [past-cont-ongoing] Use past continuous for an ongoing action at a specific time in the past.
  - DE: Verwende das Past Continuous für eine andauernde Handlung zu einem bestimmten Zeitpunkt in der Vergangenheit.
  - "From 2014 onwards, everything was getting better for Ireland." — "Ab 2014 wurde alles besser für Irland."
  - "At 8 o'clock last night, I was doing my homework." — "Um 8 Uhr gestern Abend machte ich gerade meine Hausaufgaben."
- [past-cont-simultaneous] Use past continuous for two longer actions happening at the same time. Pattern: While X was doing..., Y was doing...
  - DE: Verwende das Past Continuous für zwei längere Handlungen, die gleichzeitig stattfanden. Muster: While X was doing..., Y was doing...
  - "While many people were starving, the landlords were sending grain to England." — "Während viele Menschen hungerten, schickten die Grundbesitzer Getreide nach England."
  - "She was cooking while he was cleaning the house." — "Sie kochte, während er das Haus putzte."

key forms (seed):
- affirmative: I was walking. · They were playing. · She was reading a book.
- negative: I wasn't walking. · They weren't playing. · She wasn't reading.
- questions: Was I walking? · Were they playing? · What was she reading?

common errors (seed):
- Using past simple for both actions instead of past continuous for the longer one: ✗ "While he walked, he saw a dog." → ✓ "While he was walking, he saw a dog."
- Using past continuous for the short/interrupting action as well: ✗ "While he was walking, he was seeing a dog." → ✓ "While he was walking, he saw a dog."
- Using continuous with stative verbs: ✗ "I was knowing the answer." → ✓ "I knew the answer."

### `m4-u2-past-perfect` — unit 2 · tenses

**Past Perfect** / Past Perfect (Vorvergangenheit)

Past perfect (had + past participle) for an action completed before another past action, establishing temporal sequence in narratives.

items: 40 — gap-fill 12 · multiple-choice 7 · error-correction 6 · transformation 5 · translation 4 · sentence-building 3 · context-picker 2 · matching 1 | d3 12 · d2 9 · d4 8 · d5 6 · d1 5

rules (seed):
- [past-perf-formation] Form: Subject + had (not) + past participle. Had is the same for all persons. Use it when one past event happened BEFORE another past event.
  - DE: Bildung: Subjekt + had (not) + Past Participle. Had ist für alle Personen gleich. Verwende es, wenn eine vergangene Handlung VOR einer anderen vergangenen Handlung geschah.
  - "When Harry got up, he realised that he had put his tent in the wrong place." — "Als Harry aufstand, merkte er, dass er sein Zelt am falschen Platz aufgestellt hatte."
  - "Nobody was in the building. All the employees had left." — "Niemand war im Gebäude. Alle Angestellten waren gegangen."
- [past-perf-sequence] The past perfect marks the EARLIER event; the past simple marks the LATER event. Pattern: When X happened (simple), Y had already happened (perfect).
  - DE: Das Past Perfect markiert das FRÜHERE Ereignis; das Past Simple markiert das SPÄTERE. Muster: When X happened (simple), Y had already happened (perfect).
  - "When we arrived, the film had already started." — "Als wir ankamen, hatte der Film schon begonnen."
  - "She was tired because she hadn't slept well." — "Sie war müde, weil sie nicht gut geschlafen hatte."
- [past-perf-time-markers] Common time markers with past perfect: already, just, by the time, before, after, when, never (before).
  - DE: Häufige Zeitausdrücke mit dem Past Perfect: already, just, by the time, before, after, when, never (before).
  - "I had never seen snow before I went to Austria." — "Ich hatte noch nie Schnee gesehen, bevor ich nach Österreich fuhr."
  - "By the time we got there, the shop had closed." — "Als wir dort ankamen, hatte der Laden schon geschlossen."

key forms (seed):
- affirmative: She had left. · They had already eaten. · I had finished the homework.
- negative: She hadn't seen anything. · They hadn't arrived yet. · I hadn't finished.
- questions: Had anyone heard a noise? · Had you eaten before you came? · Had she already left?

common errors (seed):
- Using past perfect for ALL past events, not just the earlier one: ✗ "I had eaten breakfast and then I had gone to school." → ✓ "I had eaten breakfast and then I went to school."
- Missing past perfect when temporal sequence matters: ✗ "When I arrived, everyone left." → ✓ "When I arrived, everyone had left."
- Using wrong past participle form after had: ✗ "I had went to the shop." → ✓ "I had gone to the shop."

### `m4-u3-reported-speech-statements` — unit 3 · reported-speech

**Reported Speech — Statements** / Indirekte Rede — Aussagesätze

Reported/indirect speech for statements with systematic tense backshift, pronoun shifts, and time/place expression shifts.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · matching 2 · context-picker 1 · question-formation 1 | d3 13 · d2 10 · d4 8 · d5 6 · d1 3

rules (seed):
- [reported-backshift] When reporting what someone said, shift the tense one step back: present simple -> past simple, present continuous -> past continuous, past simple -> past perfect, present perfect -> past perfect, will -> would, can -> could, must -> had to.
  - DE: Wenn man wiedergibt, was jemand gesagt hat, verschiebt man die Zeitform um eine Stufe zurück: Present Simple -> Past Simple, Present Continuous -> Past Continuous, Past Simple -> Past Perfect, Present Perfect -> Past Perfect, will -> would, can -> could, must -> had to.
  - ""I like jazz." -> He said (that) he liked jazz." — ""Ich mag Jazz." -> Er sagte, dass er Jazz mochte."
  - ""I'll help you." -> He said he would help me." — ""Ich werde dir helfen." -> Er sagte, er würde mir helfen."
- [reported-pronoun-shift] Shift pronouns to match the new perspective: I -> he/she, my -> his/her, you -> I/me (or the person addressed), we -> they.
  - DE: Passe die Pronomen an die neue Perspektive an: I -> he/she, my -> his/her, you -> I/me (oder die angesprochene Person), we -> they.
  - ""I love my dog." -> She said she loved her dog." — ""Ich liebe meinen Hund." -> Sie sagte, sie liebte ihren Hund."
  - ""We are going to win." -> They said they were going to win." — ""Wir werden gewinnen." -> Sie sagten, sie würden gewinnen."
- [reported-time-place-shift] Shift time and place expressions: here -> there, today -> that day, now -> then, yesterday -> the day before, tomorrow -> the next day, this week -> that week, ago -> before.
  - DE: Passe Zeit- und Ortsausdrücke an: here -> there, today -> that day, now -> then, yesterday -> the day before, tomorrow -> the next day, this week -> that week, ago -> before.
  - ""I'm leaving tomorrow." -> She said she was leaving the next day." — ""Ich fahre morgen ab." -> Sie sagte, sie würde am nauchsten Tag abfahren."
  - ""I was here yesterday." -> He said he had been there the day before." — ""Ich war gestern hier." -> Er sagte, er sei am Tag davor dort gewesen."
- [reported-say-tell] Use 'said' without a personal object: He said (that)... Use 'told' WITH a personal object: He told me (that)... Never say 'He said me' or 'He told that'.
  - DE: Verwende 'said' OHNE Personalobjekt: He said (that)... Verwende 'told' MIT Personalobjekt: He told me (that)... Nie 'He said me' oder 'He told that'.
  - "He said that he was tired." — "Er sagte, dass er müde war."
  - "He told me that he was tired." — "Er sagte mir, dass er müde war."

key forms (seed):
- affirmative: He said (that) he liked jazz. · She told me (that) she was leaving. · They said they had seen the film.
- negative: He said he didn't like jazz. · She told me she wasn't coming. · They said they hadn't seen the film.
- questions: 

common errors (seed):
- No tense backshift — keeping the original tense in reported speech: ✗ "He said he likes jazz." → ✓ "He said he liked jazz."
- Confusing said and told — using 'said me' or 'told that' without object: ✗ "He said me that he was tired." → ✓ "He told me that he was tired."
- Failing to shift pronouns when reporting: ✗ "He said I like jazz." → ✓ "He said he liked jazz."

### `m4-u4-reported-questions` — unit 4 · reported-speech

**Reported Questions** / Indirekte Fragen

Reported/indirect questions: yes/no questions with if/whether and wh-questions with statement word order, no inversion, and tense backshift.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d3 12 · d4 10 · d2 9 · d5 5 · d1 4

rules (seed):
- [reported-q-yesno] For yes/no questions, use 'if' or 'whether' + subject + verb (backshifted). No question mark. No do/does/did.
  - DE: Bei Ja/Nein-Fragen verwende 'if' oder 'whether' + Subjekt + Verb (zurückverschoben). Kein Fragezeichen. Kein do/does/did.
  - ""Do you like pizza?" -> She asked me if I liked pizza." — ""Magst du Pizza?" -> Sie fragte mich, ob ich Pizza möchte."
  - ""Can you start on Monday?" -> They asked me if I could start on Monday." — ""Kannst du am Montag anfangen?" -> Sie fragten mich, ob ich am Montag anfangen könnte."
- [reported-q-wh] For wh-questions, keep the question word + subject + verb (backshifted). Statement word order — NO inversion. No question mark.
  - DE: Bei W-Fragen behalte das Fragewort + Subjekt + Verb (zurückverschoben). Aussagesatz-Wortstellung — KEINE Inversion. Kein Fragezeichen.
  - ""Where do you live?" -> She asked me where I lived." — ""Wo wohnst du?" -> Sie fragte mich, wo ich wohnte."
  - ""Where have you worked before?" -> He asked me where I had worked before." — ""Wo hast du vorher gearbeitet?" -> Er fragte mich, wo ich vorher gearbeitet hatte."
- [reported-q-no-inversion] In reported questions, use STATEMENT word order (subject before verb). Never keep question inversion or do/does/did.
  - DE: In indirekten Fragen verwende AUSSAGESATZ-Wortstellung (Subjekt vor Verb). Behalte nie die Fragestellung-Inversion oder do/does/did bei.
  - ""Why do you have a dog?" -> He asked me why I had a dog." — ""Warum hast du einen Hund?" -> Er fragte mich, warum ich einen Hund hatte."
  - ""What time does the train leave?" -> She asked what time the train left." — ""Wann fährt der Zug ab?" -> Sie fragte, wann der Zug abfuhr."

key forms (seed):
- affirmative: He asked me where I lived. · She asked if I liked pizza. · They wanted to know whether I could start.
- negative: He asked me why I hadn't called. · She asked if I didn't like pizza. · They wanted to know whether I couldn't come earlier.
- questions: 

common errors (seed):
- Keeping question word order (inversion) in reported questions: ✗ "He asked where did I work." → ✓ "He asked where I worked."
- Keeping do/does/did in reported questions: ✗ "She asked me did I like pizza." → ✓ "She asked me if I liked pizza."
- Adding 'that' before if/whether: ✗ "He asked that if I was ready." → ✓ "He asked if I was ready."

### `m4-u5-past-perfect-connectors` — unit 5 · tenses

**Past Perfect with Time Connectors** / Past Perfect mit Zeitkonnektoren (after, before, just)

Extension of past perfect with time connectors after, before, just, and by the time, plus connecting ideas with because, although, however, in order to, so that.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · context-picker 2 · matching 2 | d3 13 · d2 10 · d4 8 · d5 5 · d1 4

rules (seed):
- [past-perf-after] Pattern: After + subject + had + past participle, subject + past simple. The past perfect marks the first event; past simple marks the second.
  - DE: Muster: After + Subjekt + had + Past Participle, Subjekt + Past Simple. Das Past Perfect markiert das erste Ereignis; Past Simple das zweite.
  - "After James had eaten two pizzas, he felt very ill." — "Nachdem James zwei Pizzen gegessen hatte, fühlte er sich sehr schlecht."
  - "After they had finished dinner, they went for a walk." — "Nachdem sie das Abendessen beendet hatten, gingen sie spazieren."
- [past-perf-just] Use 'had just + past participle' for an event that happened very shortly before another past event. 'Just' goes between 'had' and the past participle.
  - DE: Verwende 'had just + Past Participle' für ein Ereignis, das kurz vor einem anderen vergangenen Ereignis stattfand. 'Just' steht zwischen 'had' und dem Past Participle.
  - "Sally had just finished her meal when Tom came home." — "Sally hatte gerade ihr Essen beendet, als Tom nach Hause kam."
  - "I had just left the house when it started raining." — "Ich hatte gerade das Haus verlassen, als es zu regnen begann."
- [past-perf-by-the-time] Pattern: By the time + past simple, subject + had + past participle. 'By the time' introduces the later event.
  - DE: Muster: By the time + Past Simple, Subjekt + had + Past Participle. 'By the time' leitet das spätere Ereignis ein.
  - "By the time the police arrived, the criminal had fled." — "Als die Polizei eintraf, war der Verbrecher bereits geflohen."
  - "By the time we got to the cinema, the film had started." — "Als wir im Kino ankamen, hatte der Film schon begonnen."

key forms (seed):
- affirmative: After she had eaten, she left. · He had just arrived when it started raining. · By the time I got there, they had finished.
- negative: After she hadn't eaten for hours, she was very hungry. · He hadn't finished before the bell rang.
- questions: Had they already left by the time you arrived? · Had she just finished when you called?

common errors (seed):
- Using past simple instead of past perfect after 'after': ✗ "After I ate dinner, I went to bed." → ✓ "After I had eaten dinner, I went to bed."
- Placing 'just' in the wrong position: ✗ "I had finished just my meal when she arrived." → ✓ "I had just finished my meal when she arrived."
- Using double connectors (although...but): ✗ "Although it was raining, but we went out." → ✓ "Although it was raining, we went out."

### `m4-u6-adverbs-of-manner` — unit 6 · other

**Adverbs of Manner** / Adverbien der Art und Weise (Wiederholung + Erweiterung)

Formation of adverbs from adjectives (adjective + -ly), irregular adverbs (well, fast, hard/hardly), and the linking verb rule (adjective after look, sound, feel, taste, smell).

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d3 12 · d2 10 · d4 9 · d5 5 · d1 4

rules (seed):
- [adverbs-formation] Regular adverbs are formed by adding -ly to the adjective: careful -> carefully, quick -> quickly. Spelling changes: -y -> -ily (happy -> happily), -le -> -ly (terrible -> terribly), -ic -> -ically (dramatic -> dramatically).
  - DE: Regelmäßige Adverbien werden gebildet, indem man -ly an das Adjektiv anhängt: careful -> carefully, quick -> quickly. Schreibänderungen: -y -> -ily (happy -> happily), -le -> -ly (terrible -> terribly), -ic -> -ically (dramatic -> dramatically).
  - "She spoke clearly and carefully." — "Sie sprach klar und sorgfältig."
  - "He drove slowly through the village." — "Er fuhr langsam durch das Dorf."
- [adverbs-irregular] Some adverbs are irregular: good -> well, fast -> fast, hard -> hard, late -> late, early -> early. Important: hard means 'with effort'; hardly means 'almost not at all'.
  - DE: Einige Adverbien sind unregelmaussig: good -> well, fast -> fast, hard -> hard, late -> late, early -> early. Wichtig: hard bedeutet 'mit Anstrengung'; hardly bedeutet 'kaum'.
  - "She plays the piano well." — "Sie spielt Klavier gut."
  - "He works hard. / He hardly works." — "Er arbeitet hart. / Er arbeitet kaum."
- [adverbs-linking-verbs] After linking verbs (look, sound, feel, taste, smell, seem, appear, become), use an ADJECTIVE, not an adverb. These verbs describe a state, not an action.
  - DE: Nach Bindungsverben (look, sound, feel, taste, smell, seem, appear, become) verwende ein ADJEKTIV, kein Adverb. Diese Verben beschreiben einen Zustand, keine Handlung.
  - "That sounds good." — "Das klingt gut."
  - "This food tastes awful." — "Dieses Essen schmeckt schrecklich."

key forms (seed):
- affirmative: She sings beautifully. · He runs fast. · It tastes good.
- negative: She doesn't speak quietly. · He hardly works. · It doesn't taste bad.
- questions: Does she play well? · How quickly can you run? · Does this smell good?

common errors (seed):
- Using adjective form where an adverb is needed: ✗ "She sings beautiful." → ✓ "She sings beautifully."
- Using adverb after linking verbs instead of adjective: ✗ "It tastes badly." → ✓ "It tastes bad."
- Confusing 'hard' (with effort) and 'hardly' (almost not): ✗ "He hardly works. (meaning: He works a lot.)" → ✓ "He works hard."

### `m4-u6-question-tags` — unit 6 · other

**Question Tags** / Frageanhängsel (Question Tags)

Question tags with opposite polarity: positive sentence -> negative tag, negative sentence -> positive tag. Matching the auxiliary/modal or using do/does/did.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d2 11 · d3 11 · d4 9 · d5 5 · d1 4

rules (seed):
- [qtag-polarity] Positive sentence -> negative tag: 'She is nice, isn't she?' Negative sentence -> positive tag: 'You aren't coming, are you?' The tag always has OPPOSITE polarity to the main sentence.
  - DE: Positiver Satz -> negativer Anhang: 'She is nice, isn't she?' Negativer Satz -> positiver Anhang: 'You aren't coming, are you?' Der Anhang hat immer die GEGENTEILIGE Polarität zum Hauptsatz.
  - "That's easy, isn't it?" — "Das ist einfach, oder?"
  - "You aren't from here, are you?" — "Du bist nicht von hier, oder?"
- [qtag-auxiliary-matching] Repeat the auxiliary/modal from the main sentence in the tag: be -> isn't/aren't, have -> haven't/hasn't, can -> can't, will -> won't, should -> shouldn't. If there is NO auxiliary, use do/does/did.
  - DE: Wiederhole das Hilfsverb/Modalverb aus dem Hauptsatz im Anhang: be -> isn't/aren't, have -> haven't/hasn't, can -> can't, will -> won't, should -> shouldn't. Wenn es KEIN Hilfsverb gibt, verwende do/does/did.
  - "She can swim, can't she?" — "Sie kann schwimmen, oder?"
  - "She started her channel, didn't she?" — "Sie hat ihren Kanal gestartet, oder?"
- [qtag-pronoun] The tag always uses a PRONOUN (never a noun). Replace any noun subject with the correct pronoun. Special case: 'I am..., aren't I?' (NOT 'amn't I?').
  - DE: Der Anhang verwendet immer ein PRONOMEN (nie ein Nomen). Ersetze jedes Nomen-Subjekt durch das richtige Pronomen. Sonderfall: 'I am..., aren't I?' (NICHT 'amn't I?').
  - "Amber was only 11, wasn't she?" — "Amber war erst 11, oder?"
  - "I am late, aren't I?" — "Ich bin spät dran, oder?"

key forms (seed):
- affirmative: 
- negative: 
- questions: She's nice, isn't she? · He can swim, can't he? · They went home, didn't they? · You aren't coming, are you? · I am late, aren't I?

common errors (seed):
- Using the wrong auxiliary in the tag (e.g. is instead of does): ✗ "She likes music, isn't she?" → ✓ "She likes music, doesn't she?"
- Using same polarity (positive + positive) instead of opposite: ✗ "She likes music, does she?" → ✓ "She likes music, doesn't she?"
- Using wrong pronoun or noun in the tag: ✗ "The children are coming, isn't it?" → ✓ "The children are coming, aren't they?"

### `m4-u7-present-simple-future` — unit 7 · tenses

**Present Simple for Future (Timetables)** / Present Simple für die Zukunft (Fahrplaune und feste Termine)

Using present simple for timetabled or scheduled future events (transport, events, fixed schedules), contrasted with going to, will, and first conditional.

items: 39 — gap-fill 11 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · context-picker 2 · matching 2 | d3 13 · d2 11 · d4 8 · d1 4 · d5 3

rules (seed):
- [pres-simple-future-timetable] Use present simple for fixed timetables, schedules, and official events in the future. Common verbs: leave, arrive, start, finish, begin, end, open, close, depart.
  - DE: Verwende das Present Simple für feste Fahrplaune, Zeitplaune und offizielle Veranstaltungen in der Zukunft. Häufige Verben: leave, arrive, start, finish, begin, end, open, close, depart.
  - "Our plane to Alice Springs leaves at 8.30 tomorrow." — "Unser Flugzeug nach Alice Springs fliegt morgen um 8.30 ab."
  - "The film starts at 7 p.m." — "Der Film beginnt um 19 Uhr."
- [pres-simple-future-contrast] Distinguish from other future forms: Present simple = fixed schedule. Going to = personal plans/intentions. Will = predictions, offers, promises. First conditional = future possibility after 'if'.
  - DE: Unterscheide von anderen Zukunftsformen: Present Simple = fester Fahrplan. Going to = persönliche Plaune/Absichten. Will = Vorhersagen, Angebote, Versprechen. First Conditional = Zukunftsmöglichkeit nach 'if'.
  - "The train leaves at 6. (schedule)" — "Der Zug fährt um 6 ab. (Fahrplan)"
  - "I'm going to visit my grandma. (plan)" — "Ich werde meine Oma besuchen. (Plan)"

key forms (seed):
- affirmative: The bus leaves at 3:15. · School starts at 8 tomorrow. · The shop opens at 9 a.m.
- negative: The train doesn't arrive until 6. · The museum doesn't open on Mondays.
- questions: What time does the plane leave? · When does the concert start?

common errors (seed):
- Using present simple for ALL future events, not just timetables: ✗ "I go to the cinema tomorrow with my friends." → ✓ "I'm going to go to the cinema tomorrow with my friends."
- Using will for timetabled events instead of present simple: ✗ "The train will leave at 6 tomorrow." → ✓ "The train leaves at 6 tomorrow."

### `m4-u7-want-someone-to` — unit 7 · other

**want / tell / ask + object + to-infinitive** / want / tell / ask + Person + to-Infinitiv

The pattern want/tell/ask + object (person) + to + infinitive for expressing wishes, commands, and requests involving another person.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d3 12 · d2 10 · d4 10 · d1 4 · d5 4

rules (seed):
- [want-person-to] Pattern: want + person + to + base verb. NOT: want + that + clause. This is the English way to express 'Ich will, dass jemand etwas tut'.
  - DE: Muster: want + Person + to + Grundform. NICHT: want + that + Satz. So drückt man im Englischen 'Ich will, dass jemand etwas tut' aus.
  - "Mum and Dad want us to see Ayers Rock." — "Mama und Papa wollen, dass wir den Ayers Rock sehen."
  - "I want you to help me." — "Ich will, dass du mir hilfst."
- [tell-ask-person-to] The same pattern works with tell and ask: tell + person + to + base verb (command), ask + person + to + base verb (request). Negative: verb + person + not to + base verb.
  - DE: Das gleiche Muster funktioniert mit tell und ask: tell + Person + to + Grundform (Befehl), ask + Person + to + Grundform (Bitte). Verneinung: Verb + Person + not to + Grundform.
  - "She told him to sit down." — "Sie sagte ihm, er solle sich hinsetzen."
  - "He asked me to wait." — "Er bat mich zu warten."
- [want-vs-let] Do not confuse with 'let': let + person + BARE verb (no 'to'). 'My parents let me go' (NOT 'let me to go'). But: 'My parents want me to go.'
  - DE: Nicht verwechseln mit 'let': let + Person + Grundform OHNE 'to'. 'My parents let me go' (NICHT 'let me to go'). Aber: 'My parents want me to go.'
  - "My parents let me stay up late. (bare infinitive)" — "Meine Eltern lassen mich lange aufbleiben."
  - "My parents want me to go to bed early. (to-infinitive)" — "Meine Eltern wollen, dass ich früh ins Bett gehe."

key forms (seed):
- affirmative: I want you to come. · She told him to sit down. · He asked me to wait.
- negative: I want you not to worry. · She told him not to shout. · He asked me not to be late.
- questions: Do you want me to help? · Did she tell you to leave? · Did he ask you to come?

common errors (seed):
- Using 'want that + clause' instead of 'want + person + to': ✗ "I want that you come." → ✓ "I want you to come."
- Missing 'to' before the infinitive: ✗ "I want you come." → ✓ "I want you to come."
- Adding 'to' after let (mixing up the patterns): ✗ "My parents let me to go out." → ✓ "My parents let me go out."

### `m4-u8-tense-time-expression-review` — unit 8 · tenses

**Present Perfect vs Past Simple** / Present Perfect vs Past Simple — Systematische Wiederholung

Systematic review making explicit the connection between tenses and their time expressions: past simple with yesterday/ago/last, present perfect with ever/never/already/yet/just/for/since.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · context-picker 2 · matching 2 | d3 13 · d2 11 · d4 8 · d5 5 · d1 3

rules (seed):
- [tense-review-past-simple] Use past simple for finished actions with a finished time expression: yesterday, last week/month/year, in 2020, two months ago, when I was young.
  - DE: Verwende Past Simple für abgeschlossene Handlungen mit einem abgeschlossenen Zeitausdruck: yesterday, last week/month/year, in 2020, two months ago, when I was young.
  - "Last year I got a wonderful collection from a professor." — "Letztes Jahr bekam ich eine wunderbare Sammlung von einem Professor."
  - "A few hours later I started playing again." — "Ein paar Stunden später begann ich wieder zu spielen."
- [tense-review-present-perfect] Use present perfect for actions connected to the present: ever, never, already, yet, just, recently, so far, today, this week. Also with for (duration) and since (point in time).
  - DE: Verwende Present Perfect für Handlungen, die mit der Gegenwart verbunden sind: ever, never, already, yet, just, recently, so far, today, this week. Auch mit for (Dauer) und since (Zeitpunkt).
  - "I've collected between 18,000 and 19,000 kinds of sand since I started." — "Ich habe zwischen 18.000 und 19.000 Arten von Sand gesammelt, seit ich angefangen habe."
  - "It hasn't turned up on the market yet." — "Es ist noch nicht auf dem Markt aufgetaucht."
- [tense-review-for-since] Use 'for' with a period of time (for two years, for a long time). Use 'since' with a point in time (since 2015, since Monday, since I was a child). Both require present perfect.
  - DE: Verwende 'for' mit einer Zeitspanne (for two years, for a long time). Verwende 'since' mit einem Zeitpunkt (since 2015, since Monday, since I was a child). Beide erfordern Present Perfect.
  - "I've lived here for ten years." — "Ich lebe seit zehn Jahren hier."
  - "She's been a teacher since 2010." — "Sie ist seit 2010 Lehrerin."

key forms (seed):
- affirmative: I visited London last year. · I've already finished. · She's lived here since 2015.
- negative: I didn't visit London last year. · I haven't finished yet. · She hasn't called since Monday.
- questions: Did you visit London? · Have you ever been to London? · How long have you lived here?

common errors (seed):
- Using present perfect with a past time marker: ✗ "I have been there yesterday." → ✓ "I was there yesterday."
- Using past simple with a present perfect marker: ✗ "Did you ever eat sushi?" → ✓ "Have you ever eaten sushi?"
- Confusing for and since: ✗ "I live here since ten years." → ✓ "I've lived here for ten years."

### `m4-u9-modals-possibility` — unit 9 · modals

**Modals of Possibility: might / may / could** / Modalverben der Möglichkeit: might / may / could

Expanding the modal possibility system with might, may, and could for expressing different degrees of certainty. Includes the certainty scale: must > may/might/could > can't.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d3 13 · d2 9 · d4 8 · d1 5 · d5 5

rules (seed):
- [modals-poss-formation] might / may / could + base verb (bare infinitive, no 'to'). Same form for all persons. Negatives: might not, may not (NO contraction 'mayn't'), couldn't.
  - DE: might / may / could + Grundform (Infinitiv ohne 'to'). Gleiche Form für alle Personen. Verneinung: might not, may not (KEINE Kurzform 'mayn't'), couldn't.
  - "It might rain later." — "Es könnte später regnen."
  - "She may be right." — "Sie könnte recht haben."
- [modals-poss-certainty-scale] Certainty scale from most to least certain: must (almost certain, logical deduction) > may (possible, more formal) > might (possible, less sure) > could (possible in theory) > can't (logically impossible).
  - DE: Sicherheitsskala von am sichersten bis am unsichersten: must (fast sicher, logische Schlussfolgerung) > may (möglich, formeller) > might (möglich, weniger sicher) > could (theoretisch möglich) > can't (logisch unmöglich).
  - "He must be at home — his car is in the driveway." — "Er muss zu Hause sein — sein Auto steht in der Einfahrt."
  - "That can't be true — I saw him this morning." — "Das kann nicht stimmen — ich habe ihn heute Morgen gesehen."
- [modals-poss-alternatives] Alternative expressions for possibility: 'There is a chance that...', 'It's possible that...', 'X is likely to...', 'The likelihood of + -ing...'.
  - DE: Alternative Ausdrücke für Möglichkeit: 'There is a chance that...', 'It's possible that...', 'X is likely to...', 'The likelihood of + -ing...'.
  - "There is a chance that a smile could get you into trouble." — "Es besteht die Möglichkeit, dass ein Laucheln dich in Schwierigkeiten bringen könnte."
  - "You are likely to offend someone if you blow your nose loudly." — "Es ist wahrscheinlich, dass du jemanden beleidigst, wenn du dir laut die Nase putzt."

key forms (seed):
- affirmative: It might rain. · He may be right. · That could be the answer. · She must be tired.
- negative: She might not come. · They may not agree. · It can't be true.
- questions: Could this be the answer? · Might she be at home?

common errors (seed):
- Adding 'to' after the modal verb: ✗ "She might to come later." → ✓ "She might come later."
- Using 'can' for specific-situation possibility instead of might/may/could: ✗ "It can rain tomorrow." → ✓ "It might rain tomorrow."
- Confusing 'could' for present possibility with 'could' for past ability: ✗ "She could swim as a child. (intended: She might be able to swim.)" → ✓ "She could be at the pool. (present possibility) / She could swim as a child. (past ability)"

### `m4-u10-third-conditional` — unit 10 · conditionals

**Third Conditional** / Third Conditional (+ 1./2. Conditional Wiederholung)

Third conditional (If + past perfect, would have + past participle) for hypothetical past situations, combined with systematic revision of all three conditional types.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · context-picker 2 · matching 2 | d3 12 · d2 11 · d4 9 · d5 5 · d1 3

rules (seed):
- [third-cond-formation] Third conditional: If + past perfect (had + pp), would (not) have + past participle. It talks about a past situation that did NOT happen — it is too late to change it.
  - DE: Third Conditional: If + Past Perfect (had + pp), would (not) have + Past Participle. Es geht um eine vergangene Situation, die NICHT passiert ist — es ist zu spät, sie zu ändern.
  - "If I had known, I would have helped." — "Wenn ich es gewusst hätte, hätte ich geholfen."
  - "If Fair Trade had existed, he wouldn't have sold the farm." — "Wenn es Fair Trade gegeben hätte, hätte er die Farm nicht verkauft."
- [cond-three-types] Three conditional types: 1st (If + present, will + base = real future possibility), 2nd (If + past, would + base = hypothetical present/future), 3rd (If + past perfect, would have + pp = hypothetical past). Key: 1st = might happen, 2nd = probably won't, 3rd = definitely didn't.
  - DE: Drei Conditional-Typen: 1. (If + Present, will + Grundform = reale Zukunftsmöglichkeit), 2. (If + Past, would + Grundform = hypothetische Gegenwart/Zukunft), 3. (If + Past Perfect, would have + pp = hypothetische Vergangenheit). 1. = könnte passieren, 2. = passiert wahrscheinlich nicht, 3. = ist definitiv nicht passiert.
  - "If you study, you'll pass. (1st)" — "Wenn du lernst, wirst du bestehen. (1.)"
  - "If I were rich, I'd travel. (2nd)" — "Wenn ich reich wäre, würde ich reisen. (2.)"
- [third-cond-contractions] Common contractions: would have -> would've / 'd have, would not have -> wouldn't have. These are very common in spoken English.
  - DE: Häufige Kurzformen: would have -> would've / 'd have, would not have -> wouldn't have. Diese sind im gesprochenen Englisch sehr gebräuchlich.
  - "If you had read the invitation, you would've known what to wear." — "Wenn du die Einladung gelesen hättest, hättest du gewusst, was du anziehen sollst."
  - "I wouldn't have gone if I'd known." — "Ich wäre nicht gegangen, wenn ich es gewusst hätte."

key forms (seed):
- affirmative: If I had studied, I would have passed. · If she had known, she would have called.
- negative: If I hadn't studied, I wouldn't have passed. · If she hadn't told me, I wouldn't have known.
- questions: What would you have done if you had been there? · Would you have helped if you had known?

common errors (seed):
- Using 'would' in the if-clause instead of past perfect: ✗ "If I would have known, I would have helped." → ✓ "If I had known, I would have helped."
- Mixing second and third conditional forms: ✗ "If I had money, I would have bought it." → ✓ "If I had had money, I would have bought it. (3rd) / If I had money, I would buy it. (2nd)"
- Missing 'have' in the result clause: ✗ "If I had known, I would helped." → ✓ "If I had known, I would have helped."

### `m4-u11-reflexive-pronouns` — unit 11 · pronouns

**Reflexive Pronouns** / Reflexivpronomen

Reflexive pronouns (myself, yourself, himself, herself, itself, ourselves, yourselves, themselves) for reflexive and emphatic use, including verbs that do NOT take reflexives in English.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d3 13 · d2 9 · d4 8 · d1 5 · d5 5

rules (seed):
- [reflex-formation] Reflexive pronouns: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves. Use when the subject and object are the same person.
  - DE: Reflexivpronomen: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves. Verwende sie, wenn Subjekt und Objekt dieselbe Person sind.
  - "He hurt himself." — "Er hat sich verletzt."
  - "She asked herself a big question." — "Sie stellte sich eine grosse Frage."
- [reflex-emphatic] Emphatic use: The reflexive pronoun can mean 'without help / personally'. Also: by + reflexive = alone.
  - DE: Emphatische Verwendung: Das Reflexivpronomen kann 'ohne Hilfe / persönlich' bedeuten. Auch: by + Reflexivpronomen = allein.
  - "I wrote the book myself." — "Ich habe das Buch selbst geschrieben."
  - "She lives by herself." — "Sie lebt allein."
- [reflex-no-reflexive] Some verbs that are reflexive in German do NOT take reflexive pronouns in English: enjoy (NOT 'enjoy myself the party'), decide, feel, concentrate, remember, meet, hurry, complain.
  - DE: Einige Verben, die im Deutschen reflexiv sind, haben im Englischen KEIN Reflexivpronomen: enjoy (NICHT 'enjoy myself the party'), decide, feel, concentrate, remember, meet, hurry, complain.
  - "I enjoyed the party. (NOT: I enjoyed myself the party.)" — "Ich habe die Party genossen. (Deutsch reflexiv: Ich habe mich über die Party gefreut.)"
  - "She decided to leave. (NOT: She decided herself to leave.)" — "Sie entschied sich zu gehen. (Deutsch reflexiv: sich entscheiden)"

key forms (seed):
- affirmative: He hurt himself. · I did it myself. · They enjoyed themselves.
- negative: He didn't hurt himself. · She can't look after herself. · Don't blame yourself.
- questions: Did you hurt yourself? · Can she look after herself? · Did you do it yourself?

common errors (seed):
- Using reflexive pronouns where English does not require them (German reflexive verb transfer): ✗ "I enjoyed myself the party." → ✓ "I enjoyed the party."
- Using wrong reflexive pronoun form: ✗ "He hurt hisself." → ✓ "He hurt himself."
- Missing reflexive pronoun where one is needed: ✗ "He hurt when he fell." → ✓ "He hurt himself when he fell."

### `m4-u12-phrasal-verbs` — unit 12 · other

**Phrasal Verbs** / Phrasal Verbs (Verben mit Partikeln)

Phrasal verbs (verb + particle combinations) with changed meanings, separable vs inseparable types, and the critical pronoun placement rule.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d3 12 · d2 10 · d4 9 · d5 5 · d1 4

rules (seed):
- [phrasal-meaning] Phrasal verbs are verb + particle combinations where the particle changes the verb's meaning. They must be learned as vocabulary items. Core M4 phrasal verbs: take off, set off, set up, come up with, get on (with), run out (of), pick up.
  - DE: Phrasal Verbs sind Verb + Partikel-Kombinationen, bei denen die Partikel die Bedeutung des Verbs ändert. Sie müssen als Vokabeln gelernt werden. M4 Phrasal Verbs: take off, set off, set up, come up with, get on (with), run out (of), pick up.
  - "The plane took off at 6 a.m. (= left the ground)" — "Das Flugzeug hob um 6 Uhr ab."
  - "She came up with a great idea. (= thought of)" — "Sie hatte eine grossartige Idee. (= sich ausdenken)"
- [phrasal-separable] Separable phrasal verbs: With noun objects, the particle can go before or after the object. With PRONOUN objects, the particle MUST go AFTER the pronoun: 'Pick it up' (NOT 'Pick up it').
  - DE: Trennbare Phrasal Verbs: Mit Nomen-Objekten kann die Partikel vor oder nach dem Objekt stehen. Mit PRONOMEN-Objekten MUSS die Partikel NACH dem Pronomen stehen: 'Pick it up' (NICHT 'Pick up it').
  - "Take off your coat. / Take your coat off. (both correct with noun)" — "Zieh deinen Mantel aus."
  - "Take it off. (NOT: Take off it.)" — "Zieh ihn aus."
- [phrasal-inseparable] Inseparable phrasal verbs: The particle ALWAYS stays with the verb, even with pronoun objects: 'Look at this' (NOT 'Look this at'). 'Get on with her' (NOT 'Get her on with').
  - DE: Untrennbare Phrasal Verbs: Die Partikel bleibt IMMER beim Verb, auch mit Pronomen-Objekten: 'Look at this' (NICHT 'Look this at'). 'Get on with her' (NICHT 'Get her on with').
  - "She got on well with everyone." — "Sie kam gut mit allen aus."
  - "Look at this picture. / Look at it." — "Schau dir dieses Bild an. / Schau es dir an."

key forms (seed):
- affirmative: She picked up the book. · She picked it up. · He set off early. · They ran out of milk.
- negative: She didn't pick it up. · He didn't set off on time. · They haven't run out of milk yet.
- questions: Did she pick it up? · When did he set off? · Have they run out of milk?

common errors (seed):
- Placing the pronoun after the particle in separable phrasal verbs: ✗ "He picked up it." → ✓ "He picked it up."
- Using the wrong particle with a phrasal verb: ✗ "She set off a new business. (intended: established)" → ✓ "She set up a new business."
- Trying to separate an inseparable phrasal verb: ✗ "She looked this at carefully." → ✓ "She looked at this carefully."

### `m4-u13-word-formation` — unit 13 · word-formation

**Word Formation — Prefixes and Suffixes** / Wortbildung — Vorsilben und Nachsilben

Word formation using negative prefixes (un-, in-, il-, im-, ir-, dis-, mis-) and suffixes (-ness, -ful, -less) to build new words and understand unfamiliar vocabulary.

items: 40 — gap-fill 12 · error-correction 6 · multiple-choice 6 · transformation 5 · translation 4 · sentence-building 3 · matching 2 · question-formation 2 | d3 14 · d2 8 · d4 8 · d1 5 · d5 5

rules (seed):
- [wf-negative-prefixes] Negative prefixes for adjectives follow phonological rules: il- before l (illegal, illogical), im- before m/p (impossible, impatient), ir- before r (irregular, irresponsible), in- for most others (incorrect, invisible), un- (most common: unhappy, unfair, unusual).
  - DE: Negative Vorsilben für Adjektive folgen phonologischen Regeln: il- vor l (illegal, illogical), im- vor m/p (impossible, impatient), ir- vor r (irregular, irresponsible), in- für die meisten anderen (incorrect, invisible), un- (am häufigsten: unhappy, unfair, unusual).
  - "It's impossible to finish this today." — "Es ist unmöglich, das heute fertigzustellen."
  - "His behaviour was irresponsible." — "Sein Verhalten war unverantwortlich."
- [wf-verb-prefixes] Negative prefixes for verbs: dis- means 'not/opposite' (agree -> disagree, appear -> disappear). mis- means 'badly/wrongly' (understand -> misunderstand, behave -> misbehave, spell -> misspell).
  - DE: Negative Vorsilben für Verben: dis- bedeutet 'nicht/Gegenteil' (agree -> disagree, appear -> disappear). mis- bedeutet 'schlecht/falsch' (understand -> misunderstand, behave -> misbehave, spell -> misspell).
  - "I completely disagree with you." — "Ich bin völlig anderer Meinung als du."
  - "Don't misunderstand me." — "Missversteh mich nicht."
- [wf-suffixes] Key suffixes: -ness turns adjectives into nouns (happy -> happiness, dark -> darkness). -ful turns nouns into adjectives meaning 'full of' (care -> careful, beauty -> beautiful). -less turns nouns into adjectives meaning 'without' (hope -> hopeless, home -> homeless). Note: -ful has only one 'l'.
  - DE: Wichtige Nachsilben: -ness macht aus Adjektiven Nomen (happy -> happiness, dark -> darkness). -ful macht aus Nomen Adjektive mit der Bedeutung 'voll von' (care -> careful, beauty -> beautiful). -less macht aus Nomen Adjektive mit der Bedeutung 'ohne' (hope -> hopeless, home -> homeless). Beachte: -ful hat nur ein 'l'.
  - "Her kindness surprised everyone." — "Ihre Freundlichkeit überraschte alle."
  - "The situation seemed hopeless, but she remained hopeful." — "Die Situation schien hoffnungslos, aber sie blieb hoffnungsvoll."

key forms (seed):
- affirmative: That's impossible. · She disappeared. · He was very careful. · Her happiness was obvious.
- negative: That's not impossible. · Don't misbehave! · He wasn't careless.
- questions: Is it really impossible? · Why did she disappear? · Was he being irresponsible?

common errors (seed):
- Using the wrong negative prefix: ✗ "That's inpossible." → ✓ "That's impossible."
- Spelling -ful with double l: ✗ "She was beautifull." → ✓ "She was beautiful."
- Confusing -ful (full of) and -less (without): ✗ "Be careless when you cross the road! (intended: Be careful)" → ✓ "Be careful when you cross the road!"
