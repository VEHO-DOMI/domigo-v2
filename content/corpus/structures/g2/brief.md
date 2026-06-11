# Grammar structures — g2 (stage-4 authoring brief)

<!-- domigo:structures g2 evidence=cc0f3f64437e -->

## Authoring contract

Write `content/corpus/structures/g2/structures.draft.json`:

```jsonc
{
  "schema": "grammar-structures-draft@1",
  "grade": 2,
  "briefEvidence": "cc0f3f64437e",
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
| 1 | g2-u01 | g2/sb/More 2 SB Unit 1.txt | 1 | 0 ⚠ hole — fill from the SB box |
| 2 | g2-u02 | g2/sb/More 2 SB Unit 2.txt | 1 | 2 |
| 3 | g2-u03 | g2/sb/More 2 SB Unit 3.txt | 1 | 1 |
| 4 | g2-u04 | g2/sb/More 2 SB Unit 4.txt | 1 | 3 |
| 5 | g2-u05 | g2/sb/More 2 SB Unit 5.txt | 1 | 1 |
| 6 | g2-u06 | g2/sb/More 2 SB Unit 6.txt | 1 | 1 |
| 7 | g2-u07 | g2/sb/More 2 SB Unit 7.txt | 1 | 1 |
| 8 | g2-u08 | g2/sb/More 2 SB Unit 8.txt | 1 | 1 |
| 9 | g2-u09 | g2/sb/More 2 SB Unit 9.txt | 1 | 2 |
| 10 | g2-u10 | g2/sb/More 2 SB Unit 10.txt | 1 | 2 |
| 11 | g2-u11 | g2/sb/More 2 SB Unit 11.txt | 1 | 3 |
| 12 | g2-u12 | g2/sb/More 2 SB Unit 12.txt | 1 | 1 |
| 13 | g2-u13 | g2/sb/More 2 SB Unit 13.txt | 1 | 2 |
| 14 | g2-u14 | g2/sb/More 2 SB Unit 14.txt | 2 | 1 |
| 15 | g2-u15 | g2/sb/More 2 SB Unit 15.txt | 1 | 1 |

## SB grammar boxes (verbatim)

### g2/sb/More 2 SB Unit 1.txt (unit 1)

#### `g2/sb/More 2 SB Unit 1.txt#grammar-1` — ▶️ Present simple (revision)

```
Du verwendest das Present simple, um über Tatsachen und Gewohnheiten zu sprechen.
The milk snake eats mice and rats.
 They have beautiful red, yellow and black skin.
 They sleep in the day and hunt at night.
I do my homework after supper.
 Our first lesson starts at 7.30 a.m.
 I don’t believe you.
▶️ Past simple (revision)
Mithilfe des Past simple berichtest du über Ereignisse und Situationen in der Vergangenheit.
Bei regelmäßigen Verben (regular verbs) hängst du ein -ed an das Verb:
 walk – On Monday, they walked to school.
 pick – He picked the snake up.
Einige Verben haben unregelmäßige Formen im Past simple:
 go – We went to Disneyland in Paris.
 sit – I sat down on a stone.
 say – They said hello and walked to school together.
 have – My family and I had a scary holiday.
 put – I picked the snake up and put it back in the forest.
 do – Tell me what you did.
 swim – I swam a lot.
📘 Now go back to page 8. Check ✅ with a partner what you know / can do.
```

### g2/sb/More 2 SB Unit 10.txt (unit 10)

#### `g2/sb/More 2 SB Unit 10.txt#grammar-1` — like + -ing

```
So sagst du, dass jemand etwas gerne macht:
 I like reading.
 She likes dancing.
 She doesn’t like going shopping.
🔎 Complete. Write in the right order: -ing / like / person.
 Bildung: 1. .................................................. + 2. .................................................. + 3. ..................................................
Image: A child has slipped and fallen on ice skates. Text in speech bubble: “I don’t like ice skating.”
must / mustn’t
Du verwendest must, um zu sagen, dass jemand etwas tun muss.
 ✔ You must be home by eight.
Achtung: mustn’t bedeutet im Deutschen „nicht dürfen“ und nicht „nicht müssen“.
 Bildung: Person + mustn’t (must not) + Grundform des Verbs
 ✘ You mustn’t print things out.
 ✘ You mustn’t be late. The film starts at 8!
Image: Two children on a beach. One child says to the other: “You mustn’t swim here.”
🔎 must = 1. .............................
 mustn’t = 2. .............................
 doesn’t/don’t have to = 3. ............................. nicht müssen
```

### g2/sb/More 2 SB Unit 11.txt (unit 11)

#### `g2/sb/More 2 SB Unit 11.txt#grammar-1` — ❓ Questions with “Who ... ?”

```
Wenn du mit Who ...? nach dem Subjekt fragst, verwendest du kein do/does oder did:
 Who broke your bed?
 (Not: Who did break your bed?)
 Who wants an ice cream machine?
 (Not: Who does want an ice cream machine?)
❓ Whose ... ?
Wenn du fragen willst, wem etwas gehört, fragst du mit Whose ...?
 Whose school bag is this?
 (oder: Whose is this school bag?)
 Whose trainers are those?
 (oder: Whose are those trainers?)
’s – Possessive ’s
Wenn du sagen willst, wem etwas gehört, hängst du an den Namen der Person oder das Nomen ein ’s an:
 Whose bag is this? – It’s Joanna’s.
 They’re Mike’s trainers.
 This is my brother’s bed.
Wenn der Name oder das Nomen im Plural steht oder auf -s endet, setzt du das ’s an das Ende des Wortes ein:
 This is my parents’ room.
 It’s our neighbours’ dog.
 That’s Les’ mum.
Bei Wörtern mit unregelmäßigem Pluralform setzt du ’s ans Ende des Wortes:
 That’s the children’s school.
 Don’t take other people’s things!
🔍 Complete with he / I / it / they / she.
It’s mine.
... you ... Are they yours?
This is my bed, and that’s his.
The bag is hers.
The laptop is ours.
The book isn’t theirs.
Comic: MORE FUN WITH FIDO!
1st panel: Dog sits on a rug beside a dog basket.
 2nd panel: Girl says, “Look Fido! A new basket. It’s yours.”
 3rd panel: Dog happily lies in the new basket and says, “Home, sweet home!”
```

### g2/sb/More 2 SB Unit 12.txt (unit 12)

#### `g2/sb/More 2 SB Unit 12.txt#grammar-1` — Present perfect

```
Du verwendest das Present perfect, um über Ereignisse/Handlungen zu berichten, die zu einem unbestimmten Zeitpunkt in der Vergangenheit stattgefunden haben und bis in die Gegenwart andauern bzw. Auswirkungen auf die Gegenwart haben.
Diagramm: Past (Ereignis) → Now (Folge)
Bildung: have/has + Past participle
(3. Form des Verbs)
Ereignis:
He has fallen off his bike.
I’ve lost my cat.
David has broken his leg.
We’ve bought a new car.
They’ve gone on holiday.
She’s cut her finger.
Folge:
es schmerzt
sie ist weg
er hat einen Gips
hier parkt es
sie sind weg
der Finger blutet
Wenn du betonen willst, dass etwas erst vor Kurzem geschehen ist, ergänzt du just zwischen have/has und dem Past participle (3. Form des Verbs).
Beispiele:
I’ve just passed my English test.
He’s just walked into a lamp post.
We’ve just moved house.
(Bildbeschreibung: Eine Gruppe jubelnder Fußballspieler auf dem Feld. Eine Spielerin hebt die Arme zum Jubel, während andere sie umarmen. Im Hintergrund ist ein Torwart zu sehen.)
Bildunterschrift: They’ve just scored a goal.
Past participles
Das Past participle findest du in der dritten Spalte der Verblisten. Bei regelmäßigen Verben hat das Past participle die gleiche Form wie das Past simple. Hänge einfach -ed (oder -d) an die Grundform an.
Beispiele regelmäßiger Verben:
pass – passed – passed
walk – walked – walked
move – moved – moved
Die Formen der unregelmäßigen Verben solltest du am besten auswendig lernen (siehe auch S. 125):
Grundform	Simple Past	Past Participle
go	went	gone
buy	bought	bought
fall	fell	fallen
break	broke	broken
find	found	found
lose	lost	lost
cut	cut	cut
hurt	hurt	hurt
win	won	won
see	saw	seen
be	was/were	been
meet	met	met
put	put	put
write	wrote	written
eat	ate	eaten
think	thought	thought
hit	hit	hit
ring	rang	rung
read	read	read
know	knew	known
tell	told	told
```

### g2/sb/More 2 SB Unit 13.txt (unit 13)

#### `g2/sb/More 2 SB Unit 13.txt#grammar-1` — Will-future

```
(Image: A TV screen showing a weather forecast with a cartoon rain cloud and umbrella. Speech bubble says: “There’ll be some showers today.”)
Mithilfe der will-future drückst du Erwartungen, Vermutungen und Hoffnungen für die Zukunft aus:
It will never end. (It’ll never end.)
All this hard work will kill me.
Du verwendest die will-future auch dann, wenn du etwas vorhersagen willst:
Some heavy rain will come in from Northern Scotland.
The south of England will have quite a lot of fog near the coast.
The sun won’t come out for another few days.
Du verwendest die will-future auch dann, wenn du dich spontan entschließt oder spontan versprichst, etwas zu tun:
I’ll get an umbrella.
I’ll fly all around the world.
Box: Complete with ’ll / will / won’t. Bildung: Person + 1 _______ (not) + Grundform des Verbs
Kurzformen: I will = I’2 _______
I will not = I 3 _______
Adverbs of manner
Mit dem Adverb der Art und Weise drückst du aus, wie jemand etwas macht oder wie etwas geschieht.
Examples:
He walked slowly to the mountain.
He carefully broke the stone.
The old man shouted angrily at the sky.
Look at me, shining beautifully.
I can easily stop the sun.
Look at me, flying quickly.
Bildung: Adjektiv + ly
slow → slowly
quick → quickly
careful → carefully
Bei den Adjektiven, die auf y enden, wird das y zu einem i:
happy → happily
easy → easily
angry → angrily
Ausnahmen:
fast → fast
The weather changed so fast.
good → well
I speak English quite well.
Box: Complete with adverb or adjective. Mit einem 1 ____________ kannst du ein Nomen beschreiben.
Mit einem 2 ____________ kannst du ein Verb beschreiben.
```

### g2/sb/More 2 SB Unit 14.txt (unit 14)

#### `g2/sb/More 2 SB Unit 14.txt#grammar-1` — Present perfect with already / yet

```
Zur Erinnerung: Du verwendest das Present perfect dann, wenn du nicht über einen bestimmten Zeitpunkt in der Vergangenheit sprichst.
Examples:
I’ve tried lots of ball sports. (Ich habe viele Ballsportarten ausprobiert, es ist nicht wichtig, wann das war!)
I’ve given up volleyball. (Ich habe Volleyball aufgegeben, aber es ist unwichtig, wann das war.)
Wenn du sagen willst, dass jemand etwas schon gemacht hat bzw. etwas schon erledigt ist, kannst du das Present perfect mit dem Wort already verwenden. Das Wort already steht zwischen has/have und dem Past participle (3. Form des Verbs).
Examples:
She has already been to three competitions.
She has already won one.
Wenn du sagen willst, dass etwas noch nicht geschehen ist, verwendest du not yet mit Present perfect. Das Wort yet kommt dabei ans Satzende.
Examples:
They haven’t won a competition yet.
He hasn’t been to Europe yet.
```

#### `g2/sb/More 2 SB Unit 14.txt#grammar-2` — Present perfect with ever / never

```
Um über persönliche Erfahrungen zu sprechen oder danach zu fragen, ob jemand irgendwann in der Vergangenheit etwas getan oder erlebt hat, verwendest du das Present perfect mit ever und never.
Bildung: have/has + ever/never + Past participle (3. Form des Verbs)
Examples:
Have you ever seen a bear?
Have you ever won a competition?
I’ve never had an accident.
I’ve never met a famous person.
Footer: Now go back to page 108. Check ✔ with a partner what you know / can do.
WB p. 118, 119, 120, 122
CYBER Homework 42
My personal learning track
```

### g2/sb/More 2 SB Unit 15.txt (unit 15)

#### `g2/sb/More 2 SB Unit 15.txt#grammar-1` — So do/have I. – Neither do/have I.

```
Read the examples. A: Rats! No way. I’ve got a fear of rats.
B: So have I.
A: I haven’t thought of a name for her yet.
B: Neither have I.
A: I think we’re going to find something in here.
B: So do I.
A: I don’t really like cats.
B: Neither do I.
Complete the sentences with neither or so. Du verwendest ‘so … do/have …’ um einer positiven Aussage zuzustimmen.
Du verwendest ‘neither … do/have …’ um einer negativen Aussage zuzustimmen.
Comic strip – More fun with Fido! Dog 1: Why doesn’t she clean my bowl?
Dog 2: Why doesn’t he tidy up my basket?
Dog 3: I have to do everything myself.
```

### g2/sb/More 2 SB Unit 2.txt (unit 2)

#### `g2/sb/More 2 SB Unit 2.txt#grammar-1` — ▶️ Past simple negation (revision)

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

### g2/sb/More 2 SB Unit 3.txt (unit 3)

#### `g2/sb/More 2 SB Unit 3.txt#grammar-1` — should / shouldn’t

```
▶️ Lies die Beispielsätze.
We should go home – it’s late.
 We shouldn’t go in there – it’s dangerous.
 What should I do?
💡 Complete the sentences with should or shouldn’t.
Wenn du sagen willst, was jemand tun sollte, dann verwendest du “...................”
 Wenn du sagen willst, was jemand nicht tun sollte, dann verwendest du “...................”
 Wenn du um Rat fragst, dann verwendest du ebenfalls “...................”
Bildung: should / shouldn’t + Grundform des Verbs
```

### g2/sb/More 2 SB Unit 4.txt (unit 4)

#### `g2/sb/More 2 SB Unit 4.txt#grammar-1` — Comparatives

```
Wenn du zwei Dinge vergleichst, die verschieden sind, dann verwendest du das Wort than. An die Adjektive mit einer Silbe (fast, slow, deep, old, …) hängst du -er an.
He’s older than me.
She’s faster than me.
An die Adjektive mit zwei Silben, die auf -y, -le und -ow enden (happy, simple, …) hängst du ebenfalls -er an.
hot → It’s hotter today than yesterday.
big → The whale is bigger than a dolphin.
fat → A rhino is fatter than a cheetah.
heavy → An elephant is heavier than a mouse.
angry → My mum was angrier than my dad.
hungry → I was hungrier than my sister.
Wenn das Adjektiv mehr als zwei Silben hat (dangerous, difficult, interesting, …), dann verwendest du
 more + adjective + than.
The book is more interesting than the film.
Ausnahmen:
good → better
  He was better than Jeff.
bad → worse
  I’m bad at football, but he’s worse than me!
as … as
Wenn du sagen willst, dass sich zwei Dinge/Tiere/Personen in irgendeiner Weise gleichen (z. B. gleich groß, klein usw. sind), dann verwendest du as … as:
It was as small as a mouse.
It was as dangerous as a snake.
Wenn sie sich nicht gleichen, verwendest du not as … as:
The female golden toad is not as colourful as the male animal.
Superlatives
Wenn du ausdrücken willst, dass etwas am größten, schwersten, schnellsten usw. ist, verwendest du das the und hängst -est an das Adjektiv an:
fast, slow, deep, old, etc. → The cheetah is the fastest mammal in the world.
Bei einigen Adjektiven ändert sich die Schreibweise:
hot → This is the hottest day of the year.
big → The blue whale is the biggest animal in the world.
fat → This is the fattest snake in the zoo.
heavy → The blue whale is the heaviest animal in the world.
angry → He is the angriest person I know.
hungry → I was the hungriest one on our school trip.
Bei Adjektiven, die aus drei oder mehr Silben bestehen (dangerous, difficult, interesting, …) verwendest du
 the most + adjective:
The mosquito is the most dangerous animal in the world.
Ausnahmen:
good → the best
  She’s the best player in the team.
bad → the worst
  It’s the worst restaurant in town.
Now go back to page 32. Check ✅ with a partner what you know / can do.
```

### g2/sb/More 2 SB Unit 5.txt (unit 5)

#### `g2/sb/More 2 SB Unit 5.txt#grammar-1` — Directions (prepositions of place)

```
So sagst du jemandem, wie er/sie an ein bestimmtes Ziel gelangen kann:
 Go straight ahead.
 Take the first left / second right.
 Go past the post office.
 Turn left / right.
 Cross the bridge / street.
 Walk up the hill as far as the church.
So sagst du jemandem, wo ein bestimmtes Ziel zu finden ist:
 The cinema is behind the shopping centre.
 Next to the bank, there’s the post office.
 The restaurant is opposite the church.
 There’s a little park in front of you.
 On the corner of the next street, there’s a large bank.
 It’s just round the corner, beside the bank.
(Image: Three illustrations labeled “opposite,” “in front of,” and “round the corner.”)
```

### g2/sb/More 2 SB Unit 6.txt (unit 6)

#### `g2/sb/More 2 SB Unit 6.txt#grammar-1` — have to / don’t have to

```
You have to wear a helmet!
 You have to wear a life jacket.
 You don’t have to wash up.
Complete the rule with have to or don’t have to.
 Mit 1 "" sagst du, dass etwas notwendig ist.
 Mit 2 "" sagst du, dass etwas nicht notwendig ist.
[Image description: A cartoon showing kids in helmets and life jackets at a camp. A character points at a sign saying “You have to wear a helmet!”]
🔁 Go back to page 48. Check ✓ with a partner what you know / can do.
```

### g2/sb/More 2 SB Unit 7.txt (unit 7)

#### `g2/sb/More 2 SB Unit 7.txt#grammar-1` — going to (negative)

```
Du verwendest going to, wenn du etwas planst oder beabsichtigst, etwas zu tun. Beim Verb go verwendest du normalerweise kein going to. Also: I’m going to a party.
So bildest du die Verneinung mit going to:
 Verneinung von be + going to + Grundform des Verbs
• I’m not going to play tennis tomorrow.
 • You aren’t going to like the film.
 • He/She isn’t going to do the shopping.
 • It isn’t going to rain this afternoon.
 • We aren’t going to do our homework.
 • They aren’t going to play volleyball on Sunday.
Image: A red square with a cartoon of a boy putting down a tennis racket and saying:
 “I’m not going to play tennis any more.”
might / might not
Wenn du sagen willst, dass etwas möglicherweise (nicht) eintreten wird, verwendest du:
 might (not) + Grundform des Verbs
• I might forget something.
 • I might not get it right.
 • The bags might break.
Image: A girl looking at a boy holding a present and saying:
 “He might not like chocolate!”
🡺 Now go back to page 54. Check ✅ with a partner what you know / can do.
```

### g2/sb/More 2 SB Unit 8.txt (unit 8)

#### `g2/sb/More 2 SB Unit 8.txt#grammar-1` — Past simple (revision)

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

### g2/sb/More 2 SB Unit 9.txt (unit 9)

#### `g2/sb/More 2 SB Unit 9.txt#grammar-1` — some – any

```
💬 I’ll get some new glasses for you.
 → Du verwendest in diesem Satz some, weil nicht angegeben wird, wie viele Gläser gebracht werden.
💬 Could we have some water, please?
 → In diesem Satz sagst du some, weil von etwas gesprochen wird, das man nicht zählen kann (Wasser).
💬 We haven’t got any pancakes left.
 → Hier verwendest du any, weil du ausdrücken willst, dass etwas nicht vorhanden ist.
💬 Have you got any sparkling apple juice?
 → In diesem Satz sagst du any, weil du wissen möchtest, ob noch etwas vorhanden/übrig ist.
Read the questions. Write some or any.
Have we got any beef?
 Can I have some ice cream?
Mit 1 _______ fragst du nach etwas, von dem du weißt, dass es vorhanden ist.
 Mit 2 _______ fragst du, ob etwas vorhanden ist.
one – ones
Wenn du über gleiche Dinge sprichst, aber das Nomen nicht immer wiederholen möchtest, dann kannst du das Nomen durch one oder ones ersetzen.
💬 Those are the glasses for the water. These are the ones for the apple juice.
 💬 I’d like the pizza with mushrooms, and for my friend the one with ham on it.
💬 Which one would you like?
Complete with one or ones.
Du verwendest 1 _______, wenn du ein Nomen im Singular nicht wiederholen willst.
 Du verwendest 2 _______, wenn du ein Nomen im Plural nicht wiederholen willst.
🔄 Now go back to page 68. Check ✅ with a partner what you know / can do.
```

## v1 floor catalog — m2 (UNTRUSTED seed: mine for ideas, map or waive every id)

### `m2-u2-irregular-verbs-expanded` — unit 2 · tenses

**Irregular Verbs** / Unregelmäßige Verben

Additional irregular past simple forms: buy-bought, know-knew, make-made, write-wrote, expanding the M1 set.

items: 20 — gap-fill 9 · error-correction 3 · multiple-choice 3 · translation 2 · context-picker 1 · matching 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [irreg-expanded-list] These irregular verbs do not follow the -ed pattern. Their past forms must be learnt: buy→bought, know→knew, make→made, write→wrote.
  - DE: Diese unregelmäßigen Verben folgen nicht dem -ed-Muster. Ihre Vergangenheitsformen muss man lernen: buy→bought, know→knew, make→made, write→wrote.
  - "She bought a new dress yesterday." — "Sie hat gestern ein neues Kleid gekauft."
  - "I knew the answer." — "Ich wusste die Antwort."
- [irreg-expanded-negative] In negative sentences and questions, use the base form (not the past form): didn't buy, didn't know.
  - DE: In verneinten Sätzen und Fragen verwendet man die Grundform (nicht die Vergangenheitsform): didn't buy, didn't know.
  - "He didn't make any mistakes." — "Er hat keine Fehler gemacht."
  - "Did she write an email?" — "Hat sie eine E-Mail geschrieben?"

key forms (seed):
- affirmative: She bought a dress. · He knew the answer. · They made a cake. · I wrote a letter.
- negative: She didn't buy anything. · He didn't know. · They didn't make it. · I didn't write.
- questions: Did she buy it? · Did he know? · Did they make it? · Did you write?

common errors (seed):
- Adding -ed to irregular verbs: ✗ "She buyed a new jacket." → ✓ "She bought a new jacket."
- Using past form after 'didn't': ✗ "I didn't knew the answer." → ✓ "I didn't know the answer."

### `m2-u2-past-simple-questions` — unit 2 · tenses

**Past Simple Questions** / Fragen in der einfachen Vergangenheit

Forming past simple questions with did + base form and was/were, including short answers.

items: 20 — gap-fill 10 · error-correction 3 · multiple-choice 2 · translation 2 · context-picker 1 · matching 1 · sentence-building 1 | d2 6 · d3 6 · d4 4 · d1 2 · d5 2

rules (seed):
- [past-q-did] For most verbs, form questions with Did + subject + base form. Did you enjoy the film?
  - DE: Bei den meisten Verben bildet man Fragen mit Did + Subjekt + Grundform. Did you enjoy the film?
  - "Did you like the party?" — "Hat dir die Party gefallen?"
  - "Did she buy a new jacket?" — "Hat sie eine neue Jacke gekauft?"
- [past-q-was-were] For 'be', put was/were before the subject. Do NOT use 'did' with was/were.
  - DE: Bei 'be' stellt man was/were vor das Subjekt. Man verwendet NICHT 'did' mit was/were.
  - "Was he happy?" — "War er glücklich?"
  - "Were they at school?" — "Waren sie in der Schule?"
- [past-q-short-answers] Short answers use the auxiliary: Yes, I did. / No, she didn't. / Yes, he was. / No, they weren't.
  - DE: Kurzantworten verwenden das Hilfsverb: Yes, I did. / No, she didn't. / Yes, he was. / No, they weren't.
  - "Did you go? — Yes, I did." — "Bist du gegangen? — Ja."
  - "Was she embarrassed? — No, she wasn't." — "War sie verlegen? — Nein, war sie nicht."

key forms (seed):
- affirmative: 
- negative: 
- questions: Did you like...? · Did she buy...? · Was he happy? · Were they at school?

common errors (seed):
- Using 'did' with was/were: ✗ "Did he was happy?" → ✓ "Was he happy?"
- Using past form after 'did' instead of base form: ✗ "Did you went to the cinema?" → ✓ "Did you go to the cinema?"
- Forming questions without 'did' (statement word order): ✗ "You liked the film?" → ✓ "Did you like the film?"

### `m2-u3-should` — unit 3 · modals

**should / shouldn't** / should / shouldn't (Ratschläge)

Using should/shouldn't to give advice and make suggestions. No 3rd person -s, no 'to' after should.

items: 20 — gap-fill 9 · error-correction 3 · multiple-choice 3 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [should-form] should/shouldn't + base form (infinitive without 'to'). The form is the same for all persons.
  - DE: should/shouldn't + Grundform (Infinitiv ohne 'to'). Die Form ist für alle Personen gleich.
  - "You should wear a helmet." — "Du solltest einen Helm tragen."
  - "He should study more." — "Er sollte mehr lernen."
- [should-negative] Negative: shouldn't + base form. Meaning: it is not a good idea.
  - DE: Verneinung: shouldn't + Grundform. Bedeutung: Es ist keine gute Idee.
  - "You shouldn't eat so many sweets." — "Du solltest nicht so viele Süsigkeiten essen."
  - "She shouldn't stay out late." — "Sie sollte nicht so lange draußen bleiben."
- [should-questions] Questions: Should + subject + base form?
  - DE: Fragen: Should + Subjekt + Grundform?
  - "Should I phone my parents?" — "Soll ich meine Eltern anrufen?"
  - "What should we do?" — "Was sollen wir tun?"

key forms (seed):
- affirmative: You should wear a helmet. · We should go home.
- negative: You shouldn't eat so many sweets. · She shouldn't stay out late.
- questions: Should I phone my parents? · What should we do?

common errors (seed):
- Adding 'to' after should: ✗ "You should to wear a costume." → ✓ "You should wear a costume."
- Adding 3rd person -s to should: ✗ "She shoulds go home." → ✓ "She should go home."
- Wrong negation pattern with should: ✗ "You don't should go." → ✓ "You shouldn't go."

### `m2-u4-as-as` — unit 4 · comparison

**as...as / not as...as** / as...as / not as...as (Gleichheit)

Expressing equality (as...as) and inequality (not as...as) between two things.

items: 20 — gap-fill 7 · error-correction 3 · transformation 3 · multiple-choice 2 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d3 5 · d4 5 · d2 4 · d1 3 · d5 3

rules (seed):
- [as-as-equal] as + adjective (base form) + as = two things are equal.
  - DE: as + Adjektiv (Grundform) + as = zwei Dinge sind gleich.
  - "A rhino is as dangerous as a hippo." — "Ein Nashorn ist so gefährlich wie ein Nilpferd."
  - "Tom is as tall as his brother." — "Tom ist so gross wie sein Bruder."
- [not-as-as] not as + adjective + as = the first thing has LESS of the quality than the second.
  - DE: not as + Adjektiv + as = das erste Ding hat WENIGER von der Eigenschaft als das zweite.
  - "A leopard is not as fast as a cheetah." — "Ein Leopard ist nicht so schnell wie ein Gepard."
  - "This hotel isn't as expensive as that one." — "Dieses Hotel ist nicht so teuer wie jenes."

key forms (seed):
- affirmative: She is as tall as her sister. · It's as cold as yesterday.
- negative: He isn't as fast as a cheetah. · This isn't as good as that.
- questions: Is she as tall as her brother?

common errors (seed):
- Using 'so...as' instead of 'as...as' (L1 transfer): ✗ "She is so fast as a cheetah." → ✓ "She is as fast as a cheetah."
- Using comparative form instead of base form between as...as: ✗ "He is as taller as his dad." → ✓ "He is as tall as his dad."
- Using 'like' instead of second 'as': ✗ "She is as fast like a cheetah." → ✓ "She is as fast as a cheetah."

### `m2-u4-comparatives` — unit 4 · comparison

**Comparatives** / Komparativ (Vergleichsstufe)

Comparing two things: short adjectives + -er, long adjectives with 'more', and irregular forms (better, worse).

items: 20 — gap-fill 9 · multiple-choice 4 · error-correction 3 · translation 2 · matching 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [comp-short] One-syllable adjectives: add -er (+ than). Spelling: CVC → double final consonant (big→bigger); -e → just add -r (nice→nicer).
  - DE: Einsilbige Adjektive: -er anhängen (+ than). Rechtschreibung: KVK → Verdopplung (big→bigger); -e → nur -r (nice→nicer).
  - "A cheetah is faster than a lion." — "Ein Gepard ist schneller als ein Löwe."
  - "This box is bigger than that one." — "Diese Schachtel ist größer als jene."
- [comp-long] Adjectives with three or more syllables use 'more' + adjective + than.
  - DE: Adjektive mit drei oder mehr Silben verwenden 'more' + Adjektiv + than.
  - "A snake is more dangerous than a mouse." — "Eine Schlange ist gefährlicher als eine Maus."
  - "This book is more interesting than that one." — "Dieses Buch ist interessanter als jenes."
- [comp-y] Two-syllable adjectives ending in -y: change -y to -ier (happy→happier, heavy→heavier).
  - DE: Zweisilbige Adjektive auf -y: -y wird zu -ier (happy→happier, heavy→heavier).
  - "She is happier than before." — "Sie ist glücklicher als vorher."
  - "This bag is heavier than that one." — "Diese Tasche ist schwerer als jene."
- [comp-irregular] Irregular comparatives: good→better, bad→worse. These must be learnt by heart.
  - DE: Unregelmäßige Komparativformen: good→better, bad→worse. Diese muss man auswendig lernen.
  - "She is better at maths than me." — "Sie ist besser in Mathe als ich."
  - "The weather is worse today." — "Das Wetter ist heute schlechter."

key forms (seed):
- affirmative: A cheetah is faster than a lion. · This is more dangerous than that. · She is better than me.
- negative: This isn't bigger than that. · It's not more expensive.
- questions: Is a cheetah faster than a lion? · Which one is more dangerous?

common errors (seed):
- Using 'more' with short adjectives: ✗ "A lion is more fast than a turtle." → ✓ "A lion is faster than a turtle."
- Double comparative (more + -er): ✗ "She is more bigger than her sister." → ✓ "She is bigger than her sister."
- Regularising irregular comparatives: ✗ "She is gooder at sports." → ✓ "She is better at sports."
- Forgetting to double the final consonant: ✗ "The elephant is biger than the horse." → ✓ "The elephant is bigger than the horse."

### `m2-u4-superlatives` — unit 4 · comparison

**Superlatives** / Superlativ (Höchststufe)

Expressing the highest degree: the + -est for short adjectives, the most for long adjectives, irregular forms (the best, the worst).

items: 20 — gap-fill 10 · multiple-choice 3 · error-correction 2 · sentence-building 2 · translation 2 · matching 1 | d3 7 · d2 5 · d4 4 · d1 2 · d5 2

rules (seed):
- [super-short] One-syllable adjectives: the + adjective-est. Spelling rules apply (big→the biggest, nice→the nicest).
  - DE: Einsilbige Adjektive: the + Adjektiv-est. Rechtschreibregeln beachten (big→the biggest, nice→the nicest).
  - "The cheetah is the fastest animal." — "Der Gepard ist das schnellste Tier."
  - "Mount Everest is the highest mountain." — "Der Mount Everest ist der höchste Berg."
- [super-long] Adjectives with three or more syllables: the most + adjective.
  - DE: Adjektive mit drei oder mehr Silben: the most + Adjektiv.
  - "It's the most dangerous animal in the world." — "Es ist das gefährlichste Tier der Welt."
  - "This is the most beautiful place." — "Das ist der schönste Ort."
- [super-irregular] Irregular superlatives: good→the best, bad→the worst.
  - DE: Unregelmäßige Superlativformen: good→the best, bad→the worst.
  - "She is the best student in the class." — "Sie ist die beste Schülerin der Klasse."
  - "That was the worst film ever." — "Das war der schlechteste Film aller Zeiten."

key forms (seed):
- affirmative: The cheetah is the fastest animal. · This is the most dangerous snake. · She is the best.
- negative: This isn't the biggest city.
- questions: What is the longest river? · Which is the most beautiful?

common errors (seed):
- Missing 'the' before superlative: ✗ "He is fastest runner in the school." → ✓ "He is the fastest runner in the school."
- Double superlative (most + -est): ✗ "The blue whale is the most biggest animal." → ✓ "The blue whale is the biggest animal."
- Regularising irregular superlatives: ✗ "She is the goodest student." → ✓ "She is the best student."

### `m2-u5-prepositions-directions` — unit 5 · prepositions

**Prepositions of Place & Directions** / Ortspräpositionen und Wegbeschreibungen

Expanded prepositions (opposite, beside, round the corner) combined with direction-giving language (go straight, turn left, cross).

items: 20 — gap-fill 9 · error-correction 3 · multiple-choice 2 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 · transformation 1 | d3 6 · d2 4 · d4 4 · d1 3 · d5 3

rules (seed):
- [prep-dir-location] New location prepositions: opposite (directly across from), beside (next to), round the corner, on the corner of.
  - DE: Neue Ortspräpositionen: opposite (gegenüber), beside (neben), round the corner (um die Ecke), on the corner of (an der Ecke von).
  - "The cinema is opposite the bank." — "Das Kino ist gegenüber der Bank."
  - "The shop is round the corner." — "Das Geschäft ist um die Ecke."
- [prep-dir-giving] Direction language uses imperatives + prepositions: Go straight ahead, Turn left/right, Go past the..., Cross the bridge, Walk as far as the church.
  - DE: Wegbeschreibungen verwenden Imperative + Präpositionen: Go straight ahead, Turn left/right, Go past the..., Cross the bridge, Walk as far as the church.
  - "Go straight ahead and turn left at the traffic lights." — "Geh geradeaus und biege bei der Ampel links ab."
  - "Go past the post office and it's on your right." — "Geh an der Post vorbei und es ist auf deiner rechten Seite."
- [prep-dir-polite] Polite phrases for asking directions: Excuse me, how do I get to...? / Excuse me, I'm trying to find...
  - DE: Höfliche Ausdrücke beim Wegfragen: Excuse me, how do I get to...? / Excuse me, I'm trying to find...
  - "Excuse me, how do I get to the station?" — "Entschuldigung, wie komme ich zum Bahnhof?"
  - "Excuse me, I'm trying to find the supermarket." — "Entschuldigung, ich suche den Supermarkt."

key forms (seed):
- affirmative: It's opposite the bank. · Go straight ahead. · Turn left at the corner.
- negative: Don't turn right.
- questions: How do I get to the station? · Where is the supermarket?

common errors (seed):
- Adding 'of' after 'opposite': ✗ "It's opposite of the bank." → ✓ "It's opposite the bank."
- Omitting 'the' after prepositions of place: ✗ "Go past post office." → ✓ "Go past the post office."
- L1 preposition transfer for directions: ✗ "Go in the left." → ✓ "Turn left."

### `m2-u6-have-to` — unit 6 · modals

**have to / don't have to** / have to / don't have to (Notwendigkeit)

Expressing necessity (have to) and absence of necessity (don't have to). 3rd person: has to / doesn't have to. CRITICAL: don't have to is NOT mustn't.

items: 20 — gap-fill 7 · error-correction 3 · transformation 3 · multiple-choice 2 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d3 6 · d4 5 · d1 3 · d2 3 · d5 3

rules (seed):
- [have-to-form] have to / has to + base form = it is necessary. 3rd person singular: has to.
  - DE: have to / has to + Grundform = es ist notwendig. 3. Person Einzahl: has to.
  - "You have to wear a helmet." — "Du musst einen Helm tragen."
  - "She has to get up early." — "Sie muss früh aufstehen."
- [dont-have-to] don't have to / doesn't have to = it is NOT necessary (but you can if you want). This is NOT the same as mustn't!
  - DE: don't have to / doesn't have to = es ist NICHT notwendig (aber du darfst). Das ist NICHT dasselbe wie mustn't!
  - "You don't have to bring food. (= not necessary)" — "Du musst kein Essen mitbringen. (= nicht notwendig)"
  - "He doesn't have to wear a uniform." — "Er muss keine Uniform tragen."
- [have-to-questions] Questions: Do/Does + subject + have to + base form?
  - DE: Fragen: Do/Does + Subjekt + have to + Grundform?
  - "Do you have to wear a uniform?" — "Musst du eine Uniform tragen?"
  - "Does she have to get up early?" — "Muss sie früh aufstehen?"

key forms (seed):
- affirmative: I have to go. · She has to wear a helmet.
- negative: You don't have to bring food. · He doesn't have to wash up.
- questions: Do I have to bring food? · Does she have to wear a uniform?

common errors (seed):
- Wrong 3rd person form: ✗ "She have to go early." → ✓ "She has to go early."
- Wrong negation pattern: ✗ "She hasn't to go." → ✓ "She doesn't have to go."
- Omitting 'to' from 'have to': ✗ "You have wear a helmet." → ✓ "You have to wear a helmet."

### `m2-u7-might` — unit 7 · modals

**might / might not** / might / might not (Möglichkeit)

Expressing possibility and uncertainty with might/might not. No 3rd person -s, no 'to'. Same form for all persons.

items: 20 — gap-fill 7 · transformation 3 · error-correction 2 · multiple-choice 2 · sentence-building 2 · translation 2 · context-picker 1 · matching 1 | d2 6 · d3 6 · d4 4 · d1 2 · d5 2

rules (seed):
- [might-form] might + base form (no 'to', no -s). Same form for all persons: I might, he might, they might.
  - DE: might + Grundform (kein 'to', kein -s). Gleiche Form für alle Personen: I might, he might, they might.
  - "I might go to the cinema tonight." — "Ich gehe vielleicht heute Abend ins Kino."
  - "She might come later." — "Sie kommt vielleicht später."
- [might-not] might not + base form = something is possibly not going to happen. 'might not' is more common than 'mightn't' at A2.
  - DE: might not + Grundform = etwas wird möglicherweise nicht passieren.
  - "I might not finish in time." — "Ich werde es vielleicht nicht rechtzeitig schaffen."
  - "It might not rain tomorrow." — "Es regnet morgen vielleicht nicht."

key forms (seed):
- affirmative: I might go. · She might come later. · It might rain.
- negative: I might not finish. · He might not come.
- questions: 

common errors (seed):
- Adding 'to' after might: ✗ "I might to go to the cinema." → ✓ "I might go to the cinema."
- Adding -s for 3rd person: ✗ "She mights come later." → ✓ "She might come later."
- Using past form after might: ✗ "I might went to the party." → ✓ "I might go to the party."

### `m2-u8-past-time-markers` — unit 8 · connectors

**Past Time Markers & Narrative Sequencing** / Zeitangaben in der Vergangenheit und Erzählstruktur

Using time markers (then, after that, finally, suddenly) and time expressions to sequence past narratives.

items: 20 — gap-fill 6 · multiple-choice 3 · sentence-building 3 · transformation 3 · translation 2 · context-picker 1 · error-correction 1 · matching 1 | d2 6 · d3 6 · d4 4 · d1 2 · d5 2

rules (seed):
- [time-markers-sequence] Use time markers to structure narratives in order: First, ... Then, ... After that, ... Finally, ...
  - DE: Verwende Zeitwörter, um Erzählungen zu ordnen: First, ... Then, ... After that, ... Finally, ...
  - "First, we went to the museum. Then, we had lunch." — "Zuerst gingen wir ins Museum. Dann assen wir zu Mittag."
  - "After that, we walked home. Finally, we watched TV." — "Danach gingen wir nach Hause. Schließlich sahen wir fern."
- [time-markers-expressions] Common time expressions for past narratives: yesterday, last week, two days ago, in 2013, one day, suddenly, half an hour ago.
  - DE: Häufige Zeitangaben für Vergangenheitserzählungen: yesterday, last week, two days ago, in 2013, one day, suddenly, half an hour ago.
  - "Suddenly, a strange light appeared." — "Plötzlich erschien ein seltsames Licht."
  - "One day, an astronaut found something amazing." — "Eines Tages fand ein Astronaut etwas Erstaunliches."
- [time-markers-position] Time markers usually go at the beginning of a sentence, followed by a comma. Time expressions can go at the beginning or end.
  - DE: Zeitwörter stehen meist am Satzanfang, gefolgt von einem Komma. Zeitangaben können am Anfang oder Ende stehen.
  - "Then, he ran to the door." — "Dann rannte er zur Tür."
  - "He ran to the door two hours ago." — "Er rannte vor zwei Stunden zur Tür."

key forms (seed):
- affirmative: First, ... Then, ... After that, ... Finally, ... · Suddenly, the door opened.
- negative: 
- questions: 

common errors (seed):
- Incorrect order of time markers in narrative: ✗ "Finally, we left. Then, we arrived." → ✓ "First, we left. Then, we arrived."
- Mixing tenses within a past narrative: ✗ "First, we went to the park. Then we play football." → ✓ "First, we went to the park. Then we played football."
- V2 word order after time marker (L1 transfer): ✗ "Then went he to school." → ✓ "Then he went to school."

### `m2-u9-one-ones` — unit 9 · pronouns

**one / ones** / one / ones (Ersatzpronomen)

Using one (singular) and ones (plural) as pronoun substitutes to avoid repeating a noun.

items: 20 — gap-fill 9 · error-correction 3 · multiple-choice 3 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [one-singular] 'one' replaces a singular countable noun to avoid repetition.
  - DE: 'one' ersetzt ein zäliges Nomen im Singular, um Wiederholung zu vermeiden.
  - "Which pizza do you want? — The big one." — "Welche Pizza möchtest du? — Die grosse."
  - "I don't like this hat. I prefer the blue one." — "Ich mag diesen Hut nicht. Ich bevorzuge den blauen."
- [ones-plural] 'ones' replaces a plural countable noun.
  - DE: 'ones' ersetzt ein zäliges Nomen im Plural.
  - "Which shoes do you want? — The red ones." — "Welche Schuhe möchtest du? — Die roten."
  - "These cakes are nice, but I prefer those ones." — "Diese Kuchen sind gut, aber ich bevorzuge jene."

key forms (seed):
- affirmative: I'll take the big one. · I like the red ones.
- negative: I don't want this one. · Not those ones.
- questions: Which one do you want? · Which ones are yours?

common errors (seed):
- Using 'one' for plural nouns or 'ones' for singular: ✗ "I like the red one. (referring to plural shoes)" → ✓ "I like the red ones."
- Omitting one/ones entirely: ✗ "I like the big." → ✓ "I like the big one."

### `m2-u9-some-any` — unit 9 · articles

**some / any** / some / any (Mengenangaben)

Using some in positive sentences and offers, any in negative sentences and questions.

items: 20 — gap-fill 10 · error-correction 3 · multiple-choice 2 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [some-positive] Use 'some' in positive sentences: There are some apples. I'd like some water.
  - DE: Verwende 'some' in positiven Sätzen: There are some apples. I'd like some water.
  - "There are some tomatoes in the fridge." — "Es sind ein paar Tomaten im Kühlschrank."
  - "I need some help." — "Ich brauche etwas Hilfe."
- [any-neg-q] Use 'any' in negative sentences and questions: There aren't any onions. Are there any mushrooms?
  - DE: Verwende 'any' in verneinten Sätzen und Fragen: There aren't any onions. Are there any mushrooms?
  - "I haven't got any money." — "Ich habe kein Geld."
  - "Are there any seats left?" — "Sind noch Plätze frei?"
- [some-offers] EXCEPTION: Use 'some' in offers and requests (not 'any'): Would you like some tea?
  - DE: AUSNAHME: Verwende 'some' bei Angeboten und Bitten (nicht 'any'): Would you like some tea?
  - "Would you like some cake?" — "Möchtest du etwas Kuchen?"
  - "Can I have some water, please?" — "Kann ich bitte etwas Wasser haben?"

key forms (seed):
- affirmative: I have some apples. · There are some books on the table.
- negative: I haven't got any money. · There aren't any seats left.
- questions: Are there any tomatoes? · Would you like some tea?

common errors (seed):
- Using 'some' in negative sentences: ✗ "I haven't got some friends." → ✓ "I haven't got any friends."
- Using 'any' in positive sentences: ✗ "I have any apples." → ✓ "I have some apples."
- Using 'any' in offers instead of 'some': ✗ "Would you like any tea?" → ✓ "Would you like some tea?"

### `m2-u10-like-ing` — unit 10 · other

**like + verb-ing** / like + verb-ing (Gerundium nach like)

Expressing enjoyment of activities using like/likes + verb-ing (gerund).

items: 20 — gap-fill 6 · multiple-choice 4 · error-correction 3 · transformation 3 · translation 2 · matching 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [like-ing-form] like + verb-ing to talk about activities you enjoy: I like reading. She likes dancing.
  - DE: like + verb-ing um über Aktivitäten zu sprechen, die man gerne macht: I like reading. She likes dancing.
  - "I like swimming in the lake." — "Ich schwimme gerne im See."
  - "She likes playing the guitar." — "Sie spielt gerne Gitarre."
- [like-ing-spelling] Spelling rules for -ing: run→running (double consonant), dance→dancing (drop -e), swim→swimming, write→writing.
  - DE: Rechtschreibregeln für -ing: run→running (Verdopplung), dance→dancing (-e fällt weg), swim→swimming, write→writing.
  - "He likes running in the park." — "Er läuft gerne im Park."
  - "We don't like getting up early." — "Wir stehen nicht gerne früh auf."
- [like-ing-negative] Negative: don't like / doesn't like + verb-ing.
  - DE: Verneinung: don't like / doesn't like + verb-ing.
  - "I don't like cooking." — "Ich koche nicht gerne."
  - "She doesn't like going shopping." — "Sie geht nicht gerne einkaufen."

key forms (seed):
- affirmative: I like swimming. · She likes reading. · They like playing football.
- negative: I don't like cooking. · She doesn't like getting up early.
- questions: Do you like swimming? · Does she like reading?

common errors (seed):
- Using base form instead of -ing after like: ✗ "I like swim." → ✓ "I like swimming."
- Mixing 'to' and -ing: ✗ "I like to swimming." → ✓ "I like swimming."
- Spelling error in -ing form: ✗ "She likes runing every day." → ✓ "She likes running every day."

### `m2-u10-must` — unit 10 · modals

**must / mustn't** / must / mustn't (Verpflichtung und Verbot)

must for strong obligation, mustn't for prohibition. CRITICAL: mustn't (nicht dürfen) is NOT the same as don't have to (nicht müssen).

items: 20 — gap-fill 8 · error-correction 3 · multiple-choice 3 · translation 2 · context-picker 1 · matching 1 · sentence-building 1 · transformation 1 | d2 6 · d3 6 · d4 4 · d1 2 · d5 2

rules (seed):
- [must-obligation] must + base form = strong obligation. No -s for 3rd person, no 'to'. Same form for all persons.
  - DE: must + Grundform = starke Verpflichtung. Kein -s in der 3. Person, kein 'to'. Gleiche Form für alle Personen.
  - "You must wear a seatbelt." — "Du musst einen Sicherheitsgurt tragen."
  - "She must be home by eight." — "Sie muss um acht zu Hause sein."
- [mustnt-prohibition] mustn't + base form = prohibition (it is forbidden). mustn't = nicht duerfen in German.
  - DE: mustn't + Grundform = Verbot (es ist verboten). mustn't = nicht dürfen.
  - "You mustn't use your phone in class." — "Du darfst dein Handy im Unterricht nicht verwenden."
  - "He mustn't be late." — "Er darf nicht zu spät kommen."
- [mustnt-vs-dont-have-to] CRITICAL DISTINCTION: mustn't = forbidden (nicht duerfen). don't have to = not necessary (nicht muessen). These are NOT interchangeable!
  - DE: WICHTIGE UNTERSCHEIDUNG: mustn't = verboten (nicht dürfen). don't have to = nicht notwendig (nicht müssen). Diese sind NICHT austauschbar!
  - "You mustn't run in the corridor. (= forbidden!)" — "Du darfst nicht im Gang laufen. (= verboten!)"
  - "You don't have to bring lunch. (= not necessary)" — "Du musst kein Mittagessen mitbringen. (= nicht notwendig)"

key forms (seed):
- affirmative: You must wear a uniform. · She must do her homework.
- negative: You mustn't run in the corridor. · He mustn't be late.
- questions: Must I do it now?

common errors (seed):
- Adding 'to' after must: ✗ "You must to go home now." → ✓ "You must go home now."
- Confusing mustn't with don't have to: ✗ "You mustn't bring lunch. (meaning: not necessary)" → ✓ "You don't have to bring lunch."
- Adding -s for 3rd person: ✗ "She musts go home." → ✓ "She must go home."
- Wrong negation pattern: ✗ "You don't must go." → ✓ "You mustn't go."

### `m2-u11-possessive-pronouns` — unit 11 · pronouns

**Possessive Pronouns** / Possessivpronomen

Possessive pronouns (mine, yours, his, hers, ours, theirs) as standalone forms, contrasted with possessive adjectives.

items: 19 — gap-fill 9 · error-correction 3 · multiple-choice 2 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d2 5 · d3 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [poss-pron-forms] Possessive pronouns stand alone (no noun after them): mine, yours, his, hers, ours, theirs.
  - DE: Possessivpronomen stehen allein (kein Nomen danach): mine, yours, his, hers, ours, theirs.
  - "This bag is mine." — "Diese Tasche gehört mir."
  - "Is this yours?" — "Ist das deins?"
- [poss-pron-vs-adj] Possessive adjective + noun vs possessive pronoun alone: my book → mine, your pen → yours, her bag → hers.
  - DE: Possessives Adjektiv + Nomen vs Possessivpronomen allein: my book → mine, your pen → yours, her bag → hers.
  - "That is my book. → That book is mine." — "Das ist mein Buch. → Das Buch gehört mir."
  - "Is this her phone? → Is this phone hers?" — "Ist das ihr Handy? → Gehört dieses Handy ihr?"

key forms (seed):
- affirmative: It's mine. · That's yours. · This is hers. · The car is ours. · These are theirs.
- negative: It isn't mine. · This isn't yours.
- questions: Is this yours? · Whose is this? — It's mine.

common errors (seed):
- Using possessive adjective instead of pronoun: ✗ "This book is my." → ✓ "This book is mine."
- Using possessive pronoun before a noun: ✗ "This is mine book." → ✓ "This is my book."
- Wrong form for 'hers' (adding apostrophe or using 'her'): ✗ "This is her's. / This is her." → ✓ "This is hers."

### `m2-u11-possessive-s-expanded` — unit 11 · other

**Possessive 's** / Genitiv-s

Expanded possessive 's including singular possessive ('s), plural possessive (s'), and irregular plural possessive (children's).

items: 20 — gap-fill 9 · error-correction 3 · multiple-choice 3 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [poss-s-singular] Singular nouns: add 's — the boy's book, Tom's bike, my sister's room.
  - DE: Nomen im Singular: 's anhängen — the boy's book, Tom's bike, my sister's room.
  - "This is Tom's bike." — "Das ist Toms Fahrrad."
  - "My sister's room is very tidy." — "Das Zimmer meiner Schwester ist sehr ordentlich."
- [poss-s-plural] Regular plural nouns (ending in -s): add only an apostrophe — the boys' room, my parents' car.
  - DE: Regelmäßige Pluralnomen (auf -s endend): nur Apostroph — the boys' room, my parents' car.
  - "The boys' room is messy." — "Das Zimmer der Jungen ist unordentlich."
  - "My parents' car is new." — "Das Auto meiner Eltern ist neu."
- [poss-s-irregular-plural] Irregular plural nouns (not ending in -s): add 's — the children's toys, the women's team.
  - DE: Unregelmäßige Pluralnomen (nicht auf -s endend): 's anhängen — the children's toys, the women's team.
  - "The children's toys are everywhere." — "Das Spielzeug der Kinder ist überall."
  - "The women's team won the match." — "Die Frauenmannschaft hat das Spiel gewonnen."

key forms (seed):
- affirmative: Tom's bike · my sister's room · the boys' room · the children's toys
- negative: 
- questions: Whose bike is this? — It's Tom's.

common errors (seed):
- Missing apostrophe: ✗ "Toms bike is red." → ✓ "Tom's bike is red."
- Wrong apostrophe placement for plural possessive: ✗ "The boy's room. (meaning multiple boys)" → ✓ "The boys' room."

### `m2-u11-who-whose` — unit 11 · other

**who / whose** / who / whose (Fragepronomen)

who for subject questions (no auxiliary needed) and whose for possession questions.

items: 19 — gap-fill 9 · error-correction 3 · multiple-choice 2 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d3 6 · d2 5 · d1 3 · d4 3 · d5 2

rules (seed):
- [who-subject] who as subject = no auxiliary needed. 'Who plays football?' (NOT 'Who does play football?').
  - DE: who als Subjekt = kein Hilfsverb nötig. 'Who plays football?' (NICHT 'Who does play football?').
  - "Who discovered America?" — "Wer hat Amerika entdeckt?"
  - "Who lives next door?" — "Wer wohnt nebenan?"
- [whose-possession] whose asks about possession: Whose + noun + be? or Whose + be + this?
  - DE: whose fragt nach dem Besitz: Whose + Nomen + be? oder Whose + be + this?
  - "Whose book is this?" — "Wessen Buch ist das?"
  - "Whose are these shoes?" — "Wem gehören diese Schuhe?"

key forms (seed):
- affirmative: 
- negative: 
- questions: Who plays football? · Who discovered America? · Whose book is this? · Whose are these?

common errors (seed):
- Using 'who' instead of 'whose' for possession: ✗ "Who book is this?" → ✓ "Whose book is this?"
- Adding unnecessary auxiliary with who-subject questions: ✗ "Who does play football?" → ✓ "Who plays football?"
- Confusing whose with who's (who is): ✗ "Who's bag is this?" → ✓ "Whose bag is this?"

### `m2-u12-present-perfect` — unit 12 · tenses

**Present Perfect (+ just)** / Present Perfect (+ just)

have/has + past participle for recent events with present relevance. Includes 'just' for very recent completion.

items: 26 — gap-fill 6 · error-correction 5 · matching 3 · sentence-building 3 · multiple-choice 2 · transformation 2 · translation 2 · verb-table 2 · context-picker 1 | d2 10 · d3 10 · d4 3 · d1 2 · d5 1

rules (seed):
- [pres-perf-form] have/has + past participle (3rd form). I/you/we/they have ('ve); he/she/it has ('s).
  - DE: have/has + Partizip Perfekt (3. Form). I/you/we/they have ('ve); he/she/it has ('s).
  - "I've broken my arm." — "Ich habe mir den Arm gebrochen."
  - "She has hurt her knee." — "Sie hat sich das Knie verletzt."
- [pres-perf-just] 'just' goes between have/has and the past participle. Meaning: very recently completed.
  - DE: 'just' steht zwischen have/has und dem Partizip Perfekt. Bedeutung: gerade eben abgeschlossen.
  - "I've just finished my homework." — "Ich habe gerade meine Hausaufgabe fertig gemacht."
  - "She has just arrived." — "Sie ist gerade angekommen."
- [pres-perf-neg-q] Negative: haven't/hasn't + past participle. Questions: Have/Has + subject + past participle?
  - DE: Verneinung: haven't/hasn't + Partizip Perfekt. Fragen: Have/Has + Subjekt + Partizip Perfekt?
  - "I haven't eaten yet." — "Ich habe noch nicht gegessen."
  - "Have you seen the doctor?" — "Warst du beim Arzt?"
- [pres-perf-vs-past] Present perfect = result relevant NOW (no specific past time). Past simple = completed past with specific time (yesterday, last week).
  - DE: Present Perfect = Ergebnis jetzt relevant (keine bestimmte Vergangenheitszeit). Past Simple = abgeschlossene Vergangenheit mit Zeitangabe (yesterday, last week).
  - "I've broken my arm. (result visible now)" — "Ich habe mir den Arm gebrochen. (Ergebnis jetzt sichtbar)"
  - "I broke my arm last week. (specific time)" — "Ich habe mir letzte Woche den Arm gebrochen. (bestimmte Zeit)"

key forms (seed):
- affirmative: I've broken my arm. · She has just arrived. · He's done his homework.
- negative: I haven't eaten. · She hasn't finished.
- questions: Have you seen the doctor? · Has he done his homework?

common errors (seed):
- Using past simple form instead of past participle: ✗ "I have broke my arm." → ✓ "I have broken my arm."
- Using present perfect with specific past time markers: ✗ "I have been there yesterday." → ✓ "I was there yesterday."
- Missing have/has auxiliary: ✗ "She broken her leg." → ✓ "She has broken her leg."
- Wrong auxiliary (have instead of has or vice versa): ✗ "She have broken her leg." → ✓ "She has broken her leg."

### `m2-u13-adverbs-manner` — unit 13 · other

**Adverbs of Manner** / Adverbien der Art und Weise

Forming adverbs from adjectives with -ly (slowly, carefully) and irregular adverbs (well, fast). Position: usually after the verb or object.

items: 20 — gap-fill 9 · error-correction 3 · multiple-choice 3 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [adv-manner-ly] Most adverbs of manner: adjective + -ly. Two-syllable adjectives ending in -y: change -y to -ily (happy→happily).
  - DE: Die meisten Adverbien der Art und Weise: Adjektiv + -ly. Zweisilbige Adjektive auf -y: -y wird zu -ily (happy→happily).
  - "She drives carefully." — "Sie fährt vorsichtig."
  - "He spoke quietly." — "Er sprach leise."
- [adv-manner-irregular] Irregular adverbs: good→well, fast→fast (NO -ly!). These must be learnt by heart.
  - DE: Unregelmäßige Adverbien: good→well, fast→fast (KEIN -ly!). Diese muss man auswendig lernen.
  - "She sings well." — "Sie singt gut."
  - "He runs fast." — "Er läuft schnell."
- [adv-manner-position] Adverbs of manner usually go AFTER the verb or after the object: She sings beautifully. He ate his lunch quickly.
  - DE: Adverbien der Art und Weise stehen meist NACH dem Verb oder nach dem Objekt: She sings beautifully. He ate his lunch quickly.
  - "She played the piano beautifully." — "Sie spielte wunderschön Klavier."
  - "He read the book quickly." — "Er las das Buch schnell."

key forms (seed):
- affirmative: She drives carefully. · He runs fast. · She sings well.
- negative: She doesn't drive carefully.
- questions: Does she sing well?

common errors (seed):
- Using adjective instead of adverb after a verb: ✗ "She sings beautiful." → ✓ "She sings beautifully."
- Adding -ly to irregular adverbs: ✗ "He runs fastly." → ✓ "He runs fast."
- Forming adverb of 'good' with -ly: ✗ "She speaks English goodly." → ✓ "She speaks English well."

### `m2-u13-will-future` — unit 13 · tenses

**will / won't (Future)** / will / won't (Zukunft)

will/won't + base form for spontaneous decisions, offers, promises, and predictions. Contrasted with going to for planned actions.

items: 20 — gap-fill 7 · error-correction 3 · multiple-choice 3 · transformation 2 · translation 2 · context-picker 1 · matching 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [will-form] will ('ll) + base form. Same form for all persons. No -s, no 'to'.
  - DE: will ('ll) + Grundform. Gleiche Form für alle Personen. Kein -s, kein 'to'.
  - "I'll help you carry those bags." — "Ich helfe dir, die Taschen zu tragen."
  - "I think it'll rain later." — "Ich glaube, es wird später regnen."
- [wont-form] won't (will not) + base form for negative predictions, refusals, promises not to do something.
  - DE: won't (will not) + Grundform für negative Vorhersagen, Ablehnungen, Versprechen etwas nicht zu tun.
  - "It won't rain tomorrow." — "Es wird morgen nicht regnen."
  - "I won't be late, I promise." — "Ich werde nicht zu spät kommen, versprochen."
- [will-vs-going-to] will = spontaneous decisions, offers, predictions. going to = planned intentions decided BEFORE speaking.
  - DE: will = spontane Entscheidungen, Angebote, Vorhersagen. going to = geplante Absichten, die VOR dem Sprechen beschlossen wurden.
  - "I'm going to visit London next summer. (planned)" — "Ich werde nauchsten Sommer London besuchen. (geplant)"
  - "Oh, you need help? I'll carry your bags! (spontaneous)" — "Oh, du brauchst Hilfe? Ich trage deine Taschen! (spontan)"

key forms (seed):
- affirmative: I'll help you. · She'll be happy. · It'll rain.
- negative: I won't be late. · It won't rain. · She won't come.
- questions: Will it rain? · Will you help me?

common errors (seed):
- Using will for clearly planned future: ✗ "I will visit London next summer. (already planned)" → ✓ "I'm going to visit London next summer."
- Adding -s to will for 3rd person: ✗ "She wills come tomorrow." → ✓ "She will come tomorrow."
- Wrong negative form of will: ✗ "She willn't come." → ✓ "She won't come."

### `m2-u14-present-perfect-signals` — unit 14 · tenses

**Present Perfect: already, yet, ever, never** / Present Perfect: already, yet, ever, never (Signalwörter)

Present perfect signal words: already (completed, positive), yet (not completed / asking, negative/questions), ever (lifetime experience, questions), never (no experience, statements).

items: 18 — gap-fill 6 · transformation 3 · error-correction 2 · sentence-building 2 · translation 2 · context-picker 1 · matching 1 · multiple-choice 1 | d2 6 · d3 5 · d4 3 · d1 2 · d5 2

rules (seed):
- [pp-already] already = action completed. Position: between have/has and past participle. Used in positive sentences.
  - DE: already = Handlung abgeschlossen. Position: zwischen have/has und Partizip Perfekt. In positiven Sätzen verwendet.
  - "I've already done my homework." — "Ich habe meine Hausaufgabe schon gemacht."
  - "She has already left." — "Sie ist schon gegangen."
- [pp-yet] yet = still waiting. Position: at the END of the sentence. Used in negatives and questions.
  - DE: yet = noch (nicht). Position: am ENDE des Satzes. In verneinten Sätzen und Fragen verwendet.
  - "I haven't finished yet." — "Ich habe noch nicht fertig gemacht."
  - "Have you eaten yet?" — "Hast du schon gegessen?"
- [pp-ever] ever = at any time in your life. Position: between have/has and past participle. Used in questions.
  - DE: ever = jemals in deinem Leben. Position: zwischen have/has und Partizip Perfekt. In Fragen verwendet.
  - "Have you ever been to London?" — "Warst du jemals in London?"
  - "Has she ever played tennis?" — "Hat sie jemals Tennis gespielt?"
- [pp-never] never = at no time / not ever. Position: between have/has and past participle. Used in positive sentence structure (no 'not'!).
  - DE: never = niemals. Position: zwischen have/has und Partizip Perfekt. In positiver Satzstruktur (kein 'not'!).
  - "I've never been to London." — "Ich war noch nie in London."
  - "She has never tried sushi." — "Sie hat noch nie Sushi probiert."

key forms (seed):
- affirmative: I've already finished. · She has already left. · I've never been there.
- negative: I haven't finished yet. · He hasn't arrived yet.
- questions: Have you finished yet? · Have you ever been to London?

common errors (seed):
- Wrong position of 'already': ✗ "I already have done it." → ✓ "I've already done it."
- Wrong position of 'yet': ✗ "I haven't yet finished." → ✓ "I haven't finished yet."
- Double negative with never: ✗ "I haven't never been to London." → ✓ "I've never been to London."
- Using 'ever' in positive statements instead of questions: ✗ "I have ever been to London." → ✓ "I have been to London."

### `m2-u15-so-do-i` — unit 15 · other

**So do I / Neither do I** / So do I / Neither do I (Übereinstimmung)

Expressing positive agreement (So do I / So have I) and negative agreement (Neither do I / Neither have I) with inverted word order.

items: 20 — gap-fill 6 · error-correction 3 · multiple-choice 3 · transformation 3 · translation 2 · matching 1 · question-formation 1 · sentence-building 1 | d3 6 · d2 5 · d4 4 · d1 3 · d5 2

rules (seed):
- [so-do-i] Positive agreement: So + auxiliary + I. Match the auxiliary of the original statement: present simple → do/does; have got/present perfect → have/has.
  - DE: Positive Übereinstimmung: So + Hilfsverb + I. Das Hilfsverb muss zum Originalsatz passen: Present Simple → do/does; have got/Present Perfect → have/has.
  - ""I like pizza." — "So do I."" — ""Ich mag Pizza." — "Ich auch.""
  - ""I've been to London." — "So have I."" — ""Ich war in London." — "Ich auch.""
- [neither-do-i] Negative agreement: Neither + auxiliary + I. Use 'neither' when agreeing with a negative statement.
  - DE: Negative Übereinstimmung: Neither + Hilfsverb + I. Verwende 'neither' bei Zustimmung zu einer verneinten Aussage.
  - ""I don't like spiders." — "Neither do I."" — ""Ich mag keine Spinnen." — "Ich auch nicht.""
  - ""I haven't got a pet." — "Neither have I."" — ""Ich habe kein Haustier." — "Ich auch nicht.""
- [so-neither-aux-match] The auxiliary must match: do/does with present simple, have/has with present perfect and have got, can with can, will with will.
  - DE: Das Hilfsverb muss passen: do/does bei Present Simple, have/has bei Present Perfect und have got, can bei can, will bei will.
  - ""She likes music." — "So does he."" — ""Sie mag Musik." — "Er auch.""
  - ""I can swim." — "So can I."" — ""Ich kann schwimmen." — "Ich auch.""

key forms (seed):
- affirmative: So do I. · So does she. · So have I. · So can I.
- negative: Neither do I. · Neither does he. · Neither have I. · Neither can I.
- questions: 

common errors (seed):
- Using wrong auxiliary: ✗ ""I've been to Paris." — "So do I."" → ✓ ""I've been to Paris." — "So have I.""
- Missing inversion (So I do instead of So do I): ✗ ""I like pizza." — "So I do."" → ✓ ""I like pizza." — "So do I.""
- Using 'So' with negative statements or 'Neither' with positive: ✗ ""I don't like spiders." — "So don't I."" → ✓ ""I don't like spiders." — "Neither do I.""
