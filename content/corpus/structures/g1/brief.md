# Grammar structures — g1 (stage-4 authoring brief)

<!-- domigo:structures g1 evidence=a0aa5ee3b087 -->

## Authoring contract

Write `content/corpus/structures/g1/structures.draft.json`:

```jsonc
{
  "schema": "grammar-structures-draft@1",
  "grade": 1,
  "briefEvidence": "a0aa5ee3b087",
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
| 1 | g1-u01 | g1/sb/SB Unit 1- Time for school.txt | 1 | 3 |
| 2 | g1-u02 | g1/sb/SB Unit 2- At the zoo.txt | 1 | 4 |
| 3 | g1-u03 | g1/sb/SB Unit 3- Pirates.txt | 1 | 2 |
| 4 | g1-u04 | g1/sb/SB Unit 4- Emotions.txt | 1 | 3 |
| 5 | g1-u05 | g1/sb/SB Unit 5- This is our band.txt | 1 | 2 |
| 6 | g1-u06 | g1/sb/SB Unit 6- The world's best detective.txt | 1 | 2 |
| 7 | g1-u07 | g1/sb/SB Unit 7- I love noodles.txt | 1 | 3 |
| 8 | g1-u08 | g1/sb/SB Unit 8- Clothes.txt | 1 | 1 |
| 9 | g1-u09 | g1/sb/SB Unit 9- Unusual pets.txt | 1 | 3 |
| 10 | g1-u10 | g1/sb/SB Unit 10- In a shop.txt | 1 | 2 |
| 11 | g1-u11 | g1/sb/SB Unit 11- What's the time?.txt | 1 | 1 |
| 12 | g1-u12 | g1/sb/SB Unit 12 The birthday cake.txt | 1 | 3 |
| 13 | g1-u13 | g1/sb/SB Unit 13 Help!.txt | 1 | 2 |
| 14 | g1-u14 | g1/sb/SB Unit 14 It's my favourite.txt | 1 | 2 |
| 15 | g1-u15 | g1/sb/SB Unit 15 What are you going to do?.txt | 1 | 1 |

## SB grammar boxes (verbatim)

### g1/sb/SB Intro MORE1.txt

#### `g1/sb/SB Intro MORE1.txt#grammar-1` — 122–128

```
```

### g1/sb/SB Unit 1- Time for school.txt (unit 1)

#### `g1/sb/SB Unit 1- Time for school.txt#grammar-1` — ▶️ Plural nouns (Mehrzahlformen) + irregular plurals (1)

```
Du bildest den Plural von Nomen üblicherweise, indem du ein -s an das Nomen hängst.
a dog – 4 dogs a bear – 7 bears
🔍 Kannst du im Text auf S. 11 (The wide-mouthed frog) drei unterschiedliche Nomen im Plural finden? Wie heißen sie?
Wenn ein Nomen auf einen Konsonanten + y endet (z. B. -by), schreibt man die Pluralendung so:
a baby – 8 babies (y → ies) Aber: a boy – 3 boys
Achtung: Es gibt auch Ausnahmen!
a child – five children a fish – three fish
▶️ Questions (Fragen)
So fragst du nach dem Namen, der E-Mail-Adresse und wie es jemandem geht:
What's your name? – I'm Sue. (I am ...) What's your email address? / Can you spell it, please? How are you? – I'm fine, thanks. And you?
▶️ Imperatives (Befehlsformen)
So sagst du, dass jemand etwas tun soll:
Stand up! Close the window! Open your books! Take out your books!
So sagst du, dass jemand etwas nicht tun soll:
Don't stand up! (Do not ...!) Don't open your books! Don't close the window! Don't take out your books!
🔍 Suche in Übung 16 einen weiteren Satz, in dem ausgedrückt wird, dass jemand etwas nicht tun soll.
Schreibe den Satz hier auf: ............................................................................ .......................................................................................
⏪ Now go back to page 8. Check ☑ with a partner what you know / can do.
🔵 WB p. 6, 7, 8 🌐 CYBER Homework 3
```

### g1/sb/SB Unit 10- In a shop.txt (unit 10)

#### `g1/sb/SB Unit 10- In a shop.txt#grammar-1` — ▶️ this/that – these/those

```
[Image description: Illustrations showing T-shirt, shoes, and trainers with numbered labels 1-4]
1 I'd like this T-shirt, Dad. 3 I'd like that red sweater. 2 I'd like these shoes. 4 I'd like those blue trainers.
🔍 Schreib "weiter weg" und "nahe" in die Lücken und bilde die Regel.
Du verwendest this/these, um auf etwas hinzuweisen, das ¹.................................................... ist. Du verwendest that/those, um auf etwas hinzuweisen, das ².................................................... ist.
How much is/are ...?
So fragst du nach dem Preis: How much is ...? wird mit der Einzahl (Singular) verwendet, How much are ...? mit der Mehrzahl (Plural). Achtung: jeans = Plural!
How much is this scooter? How much are the green T-shirts? How much are the jeans? How much is that scooter? How much are those green T-shirts? How much are the jeans?
⏪ Now go back to page 76. Check ☑ with a partner what you know / can do.
🔵 WB p. 87, 88, 89, 90 🌐 CYBER Homework 30
```

### g1/sb/SB Unit 11- What's the time?.txt (unit 11)

#### `g1/sb/SB Unit 11- What's the time?.txt#grammar-1` — ▶️ Present continuous

```
[THIS IS TABLE: Two-column table showing positive and negative forms of present continuous] + | – I'm (I am) helping my dad. | I'm (I am) not helping my mum. You're (You are) writing an email. | You aren't (You are not) writing a letter. Dana's (Dana is) watching TV. | Dana isn't (Dana is not) reading a book. He's (He is) looking at his mobile phone. | He isn't (He is not) playing football. We're (We are) cooking dinner. | We aren't (We are not) eating pizza. They're (They are) listening to music. | They aren't (They are not) watching TV.
[THIS IS TABLE: Question forms with positive and negative short answers] ? | + | – Are you playing a computer game?| Yes, I am. | No, I'm not. Is Peter doing his homework? | Yes, he is. | No, he isn't. Are Jennifer and Christine reading? | Yes, they are. | No, they aren't.
🔍 Was ist richtig? Mach ein Häkchen.
What are they doing now? They're having breakfast.
[Image description: Illustration showing people skiing with speech bubble "Mum and Dad are skiing."]
☐ Die Leute tun gerade etwas. ☐ Die Leute machen diese Handlungen jeden Tag.
⏪ Now go back to page 82. Check ☑ with a partner what you know / can do.
🔵 WB p. 95, 96, 97 🌐 CYBER Homework 33
```

### g1/sb/SB Unit 12 The birthday cake.txt (unit 12)

#### `g1/sb/SB Unit 12 The birthday cake.txt#grammar-1` — Ordinal numbers

```
Für Aufzählungen (der erste, der zweite, usw.) verwendest du die folgenden Wörter:
one → first | five → fifth | nine → ninth two → second | six → sixth | ten → tenth three → third | seven → seventh | eleven → eleventh four → fourth | eight → eighth | twelve → twelfth
Ordnungszahlen über 20 bildest du nach dem gleichen Prinzip:
→ twenty-first | 32. → thirty-second | 43. → forty-third | 54. → fifty-fourth (etc.)
Time prepositions
Du verwendest unterschiedliche Präpositionen (Vorwörter), um über Tage, das Datum und die Uhrzeit zu sprechen.
My birthday is on February 12th / May 28th / September 5th (etc.). The concert's on Thursday, July 15th. My sister's birthday is in December / April / June (etc.). The film starts at 7 o'clock / half past eight / 6:45 (etc.). I have maths in the morning / the afternoon. We go to bed late at night.
[IMAGE: Cartoon of person pointing at calendar showing dates 31 and 32]
Past simple (1) was – were
Du verwendest das Past simple, um etwas Vergangenes zu erzählen. Was / were werden gleich verwendet wie "ich war / du warst" usw. im Deutschen.
At 9 o'clock I was at school. Tom wasn't there. Peter and John were in their classroom. Sandra and Kate weren't there.
[IMAGE: Cartoon showing sharks with text bubble "They were not alone!"]
[TABLE: Conjugation table showing positive, negative, and question forms of was/were for all pronouns]
Now go back to page 92. Check ☑ with a partner what you know / can do.
```

### g1/sb/SB Unit 13 Help!.txt (unit 13)

#### `g1/sb/SB Unit 13 Help!.txt#grammar-1` — Past simple (2) regular verbs

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

### g1/sb/SB Unit 14 It's my favourite.txt (unit 14)

#### `g1/sb/SB Unit 14 It's my favourite.txt#grammar-1` — ▶️ Past simple (3) Verneinung mit didn't

```
Die Verneinung im Past simple ist für alle Personen gleich. So bildest du die Verneinung:
Person + didn't (did not) + Infinitiv (Nennform des Verbs)
I didn't read the book. She didn't read the Sherlock Holmes stories. We didn't like the film. You didn't tell me. It didn't catch the giraffe. You didn't listen to Mum. He didn't catch the snake. They didn't run away.
Past simple (4) irregular verbs
have – had I had milk and bread for breakfast. sell – sold The shop sold lots of things. go – went I went into the shop. say – said "Be careful," said the old woman.
pay – paid I paid and walked home. take – took I took out the control and pointed it at the TV.
do – did I did it again. freeze – froze Tom froze. hear – heard Then I heard a noise. hold – held The robber held a gun in his hand.
meet – met Yesterday I met Carol's sister.
[Image of alien saying "They held hands because they were scared."]
read – read When he was a child, his grandpa read to him. run – ran They ran out of the classroom. put – put I put on my blue cap. think – thought "What a lovely cat," she thought. see – saw She saw a remote control in the window.
Past simple (5) more irregular verbs
eat – ate become – became bend (down) – bent (down) come – came catch – caught die – died find – found fight – fought sit – sat give – gave tell – told get – got leave – left
⏪ Now go back to page 110. Check ☑️ with a partner what you know / can do.
```

### g1/sb/SB Unit 15 What are you going to do?.txt (unit 15)

#### `g1/sb/SB Unit 15 What are you going to do?.txt#grammar-1` — ▶️ (be) going to

```
Wenn du über Pläne für die Zukunft sprichst, verwendest du (be) going to.
What are you going to do in your holidays? Are you going to lie in the sun? I'm really going to enjoy my trip. We're going to swim in the sea a lot. She's going to show us the city. They're going to work all summer.
Bildung: Present simple von be + going to + Infinitiv:
They're going to visit their friends.
So bildest du die Verneinung: Present simple von be + not + going to + Infinitiv:
We are not (aren't) going to stay at home.
⏪ Now go back to page 118. Check ☑️ with a partner what you know / can do.
```

### g1/sb/SB Unit 2- At the zoo.txt (unit 2)

#### `g1/sb/SB Unit 2- At the zoo.txt#grammar-1` — ▶️ there is / there are

```
So kannst du ausdrücken, dass etwas vorhanden ist:
There is a train. | There are two trains. There is a penguin. | There are two penguins.
▶️ Prepositions of place
So fragst du, wo sich etwas befindet: So antwortest du:
Where's the frog? It's in the shoe.
[Image description: Illustrations of a frog in different positions relative to a shoe, labeled: behind, under, in, on, next to, in front of]
▶️ to be (affirmative)
Das Verb „sein" (ich bin, du bist, er ist, ...) hat im Englischen die folgenden Formen:
I'm fine. (I am fine.) | We're from York. (We are from York.) You're nice. (You are nice.) | You're happy. (You are happy.) He's in class 4A. (He is in class 4A.) | They're from London. (They are from London.) She's 11. (She is 11.) It's yellow. (It is yellow.)
⏪ Now go back to page 16. Check ☑ with a partner what you know / can do.
🔵 WB p. 16, 17, 19 🌐 CYBER Homework 6
```

### g1/sb/SB Unit 3- Pirates.txt (unit 3)

#### `g1/sb/SB Unit 3- Pirates.txt#grammar-1` — ▶️ have got – haven't got

```
[THIS IS TABLE: Three-column table showing positive, negative, and question forms of "have got"] + | – | ? I/You have got a cat. | I/You haven't got a cat. | Have I/you got ...? He/She/It has got a small nose. | He/She/It hasn't got a small nose. | Has he/she/it got ...? We/You/They have got a big ship. | We/You/They haven't got a big ship. | Have we/you/they got ...?
🔍 Setze I haven't got oder I've got ein:
Mithilfe von ¹...................................................... sagst du, dass du etwas hast. Mithilfe von ²...................................................... sagst du, dass du etwas nicht hast.
Note: He has got a cat. = He's got a cat. They have got strong arms. = They've got strong arms. I have not got blue eyes. = I haven't got blue eyes. He has not got a dog. = He hasn't got a dog.
Ooh! You've got strong arms!
[Image description: Cartoon of a pirate flexing muscles]
▶️ Irregular plurals (2)
one foot → two feet one tooth → five teeth
```

### g1/sb/SB Unit 4- Emotions.txt (unit 4)

#### `g1/sb/SB Unit 4- Emotions.txt#grammar-1` — ▶️ to be (negative)

```
So bildest du die Verneinung mit to be:
I'm not (am not) happy. You aren't (are not) excited. He/She/It isn't (is not) cold. We aren't (are not) hungry. You aren't (are not) hot. They aren't (are not) angry.
[Image description: Illustration of a polar bear and penguin with speech bubble "Are you cold?"]
▶️ Questions with to be
So bildest du Fragen und Antworten mit den verschiedenen Formen von be:
?	+	–
Are you happy?	Yes, I am.	No, I'm not.
Is he happy?	Yes, he is.	No, he isn't.
Is she happy?	Yes, she is.	No, she isn't.
Is it happy?	Yes, it is.	No, it isn't.
Are you happy?	Yes, we are.	No, we aren't.
Are they happy?	Yes, they are.	No, they aren't.

⏪ Now go back to page 30. Check ☑ with a partner what you know / can do.
🔵 WB p. 33, 34, 35 🌐 CYBER Homework 12
```

### g1/sb/SB Unit 5- This is our band.txt (unit 5)

#### `g1/sb/SB Unit 5- This is our band.txt#grammar-1` — ▶️ Possessives (besitzanzeigende Fürwörter)

```
Mithilfe der Wörter my, your, his, her usw. kannst du ausdrücken, zu wem etwas gehört.
I – my This is my sister Jessica. you – your What's your name? – I'm James. he – his His name's Jack. she – her Her name's Ellie. it – its This is a new band. Its name is Project 11. we – our We are Dan and Steve. And this is our dog. you – your Dan and Steve, your guitars are great! they – their Dan and Steve are brothers. Their dog is Bacon.
This elephant can wiggle its ears.
[Image description: Cartoon of an elephant wiggling its ears]
▶️ can – can't 🔍 Lies die Beispielsätze links. Setze dann can oder can't ein:
James can sing. The dog can't sing.
Mithilfe des Wortes ¹........................ sagst du, dass jemand etwas kann. Mithilfe des Wortes ²........................ sagst du, dass jemand etwas nicht kann.
```

### g1/sb/SB Unit 6- The world's best detective.txt (unit 6)

#### `g1/sb/SB Unit 6- The world's best detective.txt#grammar-1` — ▶️ Present simple

```
Wenn du sagst I like ice cream, dann bedeutet das, dass du im Allgemeinen gern Eis magst. Diese Zeitform nennt man das Present simple.
Singular	Plural
I love dogs.	We love our cat.
You live in Vienna.	They live in Oxford.

Wenn du über eine Person, ein Tier oder ein Ding sprichst, dann musst du beim Verb ein -s anhängen.
He lives in London. My dog loves ice cream. She plays football.
Achtung:
go – goes carry – carries watch – watches catch – catches wash – washes
[Image description: Illustration of a dog playing football with text "Our dog plays football."]
Du verwendest das Present simple auch, um eine Geschichte oder einen Witz im Präsens zu erzählen.
I'm in bed. I hear something. I get up. I ... Sherlock Groans leaves his house. He goes to the park. He sees ...
a lot of / lots of
Für "viel/viele" kannst du im Englischen sowohl a lot of als auch lots of verwenden.
a lot of homework / lots of homework a lot of books / lots of books a lot of different colours / lots of different colours
⏪ Now go back to page 46. Check ☑ with a partner what you know / can do.
🔵 WB p. 51, 52, 55 🌐 CYBER Homework 18
```

### g1/sb/SB Unit 7- I love noodles.txt (unit 7)

#### `g1/sb/SB Unit 7- I love noodles.txt#grammar-1` — ▶️ Present simple negative

```
So bildest du die Verneinung im Present simple:
I don't (do not) like vegetables. He/She/It doesn't (does not) like rice. We don't (do not) like carrots.
▶️ Articles a / an
Du verwendest an dann, wenn das folgende Wort mit einem Vokal (Selbstlaut) am Anfang ausgesprochen wird.
an old skateboard an egg an apple a banana a hot dog
Adverbs of frequency
I'm always hungry. 100% always Simon and I are usually tired. usually She often eats beef. often We sometimes have curry. sometimes I never drink milk. 0% ▼ never
🔍 Kreise die richtigen Wörter ein und bilde die Regel: Die Wörter always, usually, often, sometimes, never kommen ¹vor / nach dem Verb.
I never drink milk. I often read books.
Beim Verb to be (am/is/are) kommen die Wörter always, usually, often, sometimes, never ²vor / nach dem Verb.
I'm always hungry. They're often late.
[Image description: Cartoon of person watching TV with text "He always watches TV."]
⏪ Now go back to page 52. Check ☑ with a partner what you know / can do.
🔵 WB p. 60, 61, 62, 63 🌐 CYBER Homework 21
```

### g1/sb/SB Unit 8- Clothes.txt (unit 8)

#### `g1/sb/SB Unit 8- Clothes.txt#grammar-1` — ▶️ Present simple | questions

```
So bildest du Ja/Nein-Fragen im Present simple:
Do you buy your own clothes? Yes, I do. No, I don't. Does he like T-shirts with animals? Yes, he does. No, he doesn't. Does she wear yellow trainers? Yes, she does. No, she doesn't. Do they wear blue jeans? Yes, they do. No, they don't.
[Image description: Cartoon of two people and a spotted dog with speech bubble "Do you buy your own clothes?"]
What colour is your dress? It's green. What colour is your new T-shirt? It's pink. What colour are your trainers? They're red and white. What colour are your jeans? They're blue.
⏪ Now go back to page 60. Check ☑ with a partner what you know / can do.
🔵 WB p. 68, 69, 70, 71, 73 🌐 CYBER Homework 24
```

### g1/sb/SB Unit 9- Unusual pets.txt (unit 9)

#### `g1/sb/SB Unit 9- Unusual pets.txt#grammar-1` — ▶️ Question words

```
So stellst du Fragen mithilfe der Fragewörter What / Where / How often:
What is your pet? is its name? does it eat?
Where is your dog? does she keep her hamster? do you live?
How often does he feed his pet? do you phone your friends?
[Image description: Cartoon showing two people on a couch with a crocodile, with speech bubble "Where do you keep your crocodile?"]
▶️ Object pronouns
Pronomen als Objekte:
I – me Do you like me? you – you Nice to meet you. he – him We don't like him. she – her We love her. it – it How often do you feed it? we – us She carries us to school. they – them We hate them.
Irregular plurals (3)
one mouse → two mice one pony → two ponies
▶️ Possessive 's
So sagst du, dass ein Ding, ein Tier oder eine Person zu jemandem gehört:
Mandy's brother is the problem. Mr White's pet is a shark. Mandy's school bag is big.
```

## Grammar appendix (verbatim) — `g1/sb/SB Grammar Appendix.txt#appendix`

```
Page 122 • GRAMMAR
TENSES (ZEITEN)
PRESENT TENSE
Present simple (Einfache Gegenwartsform)
Das Present simple verwendest du, wenn du über Gewohnheiten, Vorlieben und wiederholte Handlungen sprichst. Die Form des Present simple ist für alle Personen gleich.
Ausnahme: In der 3. Person Singular wird ein -s angehängt. Verneinung und Fragen werden mit dem Hilfsverb do (3. Person Singular does) gebildet.
Achtung: Bei einigen Wörtern ändert sich bei der 3. Person Singular die Schreibweise durch das Anhängen des -s: go – goes carry – carries watch – watches catch – catches wash – washes
Positive Aussagen	Negative Aussagen	Fragen	Kurzantworten
I like London.	I don't (do not) like London.	Do/Don't I like London?	Yes, I do.
You like London.	You don't (do not) like London.	Do/Don't you like London?	Yes, you do.
He likes London.	He doesn't (does not) like London.	Does/Doesn't he like London?	Yes, he does.
She likes London.	She doesn't (does not) like London.	Does/Doesn't she like London?	Yes, she does.
It likes fish.	It doesn't (does not) like fish.	Does/Doesn't it like fish?	Yes, it does.
We like London.	We don't (do not) like London.	Do/Don't we like London?	Yes, we do.
You like London.	You don't (do not) like London.	Do/Don't you like London?	Yes, you do.
They like London.	They don't (do not) like London.	Do/Don't they like London?	Yes, they do.

Present continuous (Verlaufsform, -ing-Form)
Wenn du beschreiben möchtest, was jemand gerade tut oder was gerade in diesem Augenblick passiert, verwendest du im Englischen die spezielle Continuous Form des Verbs. Das Present continuous wird mit der richtigen Form von be (am/is/are) und der -ing-Form des Vollverbs gebildet.
Positive Aussagen	Negative Aussagen	Fragen	Kurzantworten
I'm (I am) playing football.	I'm not (I am not) playing football.	Am I playing football?	Yes, I am.
You're (You are) playing football.	You aren't (You're not) playing football.	Are you playing football?	Yes, you are.
He's (He is) playing football.	He isn't (He's not) playing football.	Is he playing football?	Yes, he is.
She's (She is) playing football.	She isn't (She's not) playing football.	Is she playing football?	Yes, she is.
It's (It is) snowing.	It isn't (it's not) snowing.	Is it snowing?	Yes, it is.
We're (We are) playing football.	We aren't (We're not) playing football.	Are we playing football?	Yes, we are.
You're (You are) playing football.	You aren't (You're not) playing football.	Are you playing football?	Yes, you are.
They're (They are) playing football.	They aren't (They're not) playing football.	Are they playing football?	Yes, they are.

Page 123 • GRAMMAR
PAST TENSE
Past simple – was / were (Einfache Vergangenheitsform)
Wenn du sagen willst, was war (bzw. nicht war), verwendest du die Past simple Form von be. Diese wird folgendermaßen gebildet:
Positive Aussagen	Negative Aussagen	Fragen	Kurzantworten
I was tired.	I wasn't (was not) tired.	Was/Wasn't I tired?	Yes, I was.
You were tired.	You weren't (were not) tired.	Were/Weren't you tired?	Yes, you were.
He was tired.	He wasn't (was not) tired.	Was/Wasn't he tired?	Yes, he was.
She was tired.	She wasn't (was not) tired.	Was/Wasn't she tired?	Yes, she was.
It was blue.	It wasn't (was not) blue.	Was/Wasn't it blue?	Yes, it was.
We were tired.	We weren't (were not) tired.	Were/Weren't we tired?	Yes, we were.
You were tired.	You weren't (were not) tired.	Were/Weren't you tired?	Yes, you were.
They were tired.	They weren't (were not) tired.	Were/Weren't they tired?	Yes, they were.

Past simple – Regular verbs (Regelmäßige Verben)
• Das Past simple wird bei regelmäßigen Verben mit **-**ed gebildet. • Endet ein regelmäßiges Verb auf -e (z.B. like), fügst du nur ein -d an. • Endet das Verb auf -y (z.B. carry), verwandelt sich dieses in ein -i und du fügst **-**ed an.
Positive Aussagen	Negative Aussagen
I liked London.	I didn't (did not) like London.
You laughed a lot.	You didn't (did not) laugh a lot.
He walked home.	He didn't (did not) walk home.
She looked up.	She didn't (did not) look up.
It slipped.	It didn't (did not) slip.
We jumped into the water.	We didn't (did not) jump into the water.
You carried our books.	You didn't (did not) carry our books.
They loved the film.	They didn't (did not) love the film.

Past simple – Irregular verbs (Unregelmäßige Verben)
Es gibt auch Verben, deren Past simple Form nicht durch das Anhängen der Endung **-**ed gebildet werden kann. Diese Verben nennt man unregelmäßige Verben. Ihre Formen lernst du am besten auswendig.
Hier findest du eine Liste mit einer Auswahl der wichtigsten unregelmäßigen Verben.
Present tense	Past simple tense	Übersetzung	Present tense	Past simple tense	Übersetzung
be	was/were	sein	hear	heard	hören
become	became	werden	hold	held	halten
catch	caught	fangen	leave	left	verlassen
come	came	kommen	make	made	machen
die	died	sterben	pay	paid	(be-)zahlen
do	did	tun, machen	put	put	legen, setzen, stellen
drive	drove	fahren; treiben	read	read [red]	lesen
eat	ate	essen	run	ran	laufen
fight	fought	kämpfen	say	said	sagen
find	found	finden	see	saw	sehen
forget	forgot	vergessen	sell	sold	verkaufen
freeze	froze	erstarren	send	sent	senden, schicken
get	got	bekommen; werden	take	took	nehmen
give	gave	geben	tell	told	sagen, erzählen
go	went	gehen; fahren	think	thought	denken
have	had	haben	write	wrote	schreiben

Page 124 • GRAMMAR
FUTURE TENSE
going to-future (Zukunft mit going to)**
Wenn du ausdrücken möchtest, was jemand für die Zukunft plant oder vorhat, verwendest du eine Form von be und going to und die Grundform des Vollverbs.
Positive Aussagen	Negative Aussagen	Fragen	Kurzantworten
I'm	I'm not	Am I	Yes, I am. / No I'm not.
You're	You aren't (You're not)	Are/Aren't you	Yes, you are. / No, you aren't (you're not).
He's	He isn't (He's not)	Is/Isn't he	Yes, he is. / No, he isn't (he's not).
She's going to play football.	She isn't (She's not) going to play football.	Is/Isn't she going to play football?	Yes, she is. / No, she isn't (she's not).
We're	We aren't (We're not)	Are/Aren't we	Yes, we are. / No, we aren't (we're not).
You're	You aren't (You're not)	Are/Aren't you	Yes, you are. / No, you aren't (you're not).
They're	They aren't (They're not)	Are/Aren't they	Yes, they are. / No, they aren't (they're not).

Page 125 • GRAMMAR
BESONDERE VERBEN
to be – affirmative, negative
Das Verb be wird wie das deutsche Verb sein verwendet. Du kannst die Formen von to be in der Langform (I am) oder der Kurzform (I'm) schreiben. Beim Sprechen verwendest du fast immer die Kurzform.
Positive Aussagen	Negative Aussagen
I'm (I am) tired.	I'm not tired.
You're (You are) happy.	You aren't / You're not happy.
He's (He is) nice.	He isn't / He's not nice.
She's (She is) in class 3B.	She isn't / She's not in class 3B.
It's (It is) blue.	It isn't / It's not blue.
We're (We are) out.	We aren't / We're not out.
You're (You are) from York.	You aren't / You're not from York.
They're (They are) twelve.	They aren't / They're not twelve.

Questions with to be
Fragen	Kurzantworten
Am I tired?	Yes, I am.
Are/Aren't you happy?	Yes, you are.
Is/Isn't he nice?	Yes, he is.
Is/Isn't she in class 3B?	Yes, she is.
Is/Isn't it blue?	Yes, it is.
Are/Aren't we out?	Yes, we are.
Are/Aren't you from York?	Yes, you are.
Are/Aren't they twelve?	Yes, they are.

have got / haven't got
Have got wird wie das deutsche Verb haben (besitzen) verwendet. Die richtige Form für die 3. Person der Gegenwart (he/she/it) ist has got.
Positive Aussagen	Negative Aussagen	Fragen	Kurzantworten
I've got (I have got) a dog.	I haven't got (have not got) a dog.	Have/Haven't I got a dog?	Yes, I have.
You've got (You have got) a dog.	You haven't got (have not got) a dog.	Have/Haven't you got a dog?	Yes, you have.
He's got (He has got) a dog.	He hasn't got (has not got) a dog.	Has/Hasn't he got a dog?	Yes, he has.
She's got (She has got) a dog.	She hasn't got (has not got) a dog.	Has/Hasn't she got a dog?	Yes, she has.
It's got (It has got) big ears.	It hasn't got (has not got) big ears.	Has/Hasn't it got big ears?	Yes, it has.
We've got (We have got) a dog.	We haven't got (have not got) a dog.	Have/Haven't we got a dog?	Yes, we have.
You've got (You have got) a dog.	You haven't got (have not got) a dog.	Have/Haven't you got a dog?	Yes, you have.
They've got (They have got) a dog.	They haven't got (have not got) a dog.	Have/Haven't they got a dog?	Yes, they have.

there is / there are
There is / there are wird verwendet, um auszudrücken, dass etwas vorhanden ist oder dass es etwas gibt.
There's a parrot in the tree. (= There is a parrot in the tree.) There are three frogs on the desk.
can / can't
Wenn du ausdrücken möchtest, dass jemand etwas kann oder nicht kann verwendest du can / can't. Can ist ein Modalverb und wird deshalb immer in Verbindung mit einem Vollverb verwendet. Die Verneinung lautet cannot oder can't.
Positive Aussagen	Negative Aussagen	Fragen	Kurzantworten
I can speak French.	I can't (cannot) speak French.	Can/Can't I speak French?	Yes, I can.
You can speak French.	You can't (cannot) speak French.	Can/Can't you speak French?	Yes, you can.
He can speak French.	He can't (cannot) speak French.	Can/Can't he speak French?	Yes, he can.
She can speak French.	She can't (cannot) speak French.	Can/Can't she speak French?	Yes, she can.
It can run fast.	It can't (cannot) run fast.	Can/Can't it run fast?	Yes, it can.
We can speak French.	We can't (cannot) speak French.	Can/Can't we speak French?	Yes, we can.
You can speak French.	You can't (cannot) speak French.	Can/Can't you speak French?	Yes, you can.
They can speak French.	They can't (cannot) speak French.	Can/Can't they speak French?	Yes, they can.

ADVERBS (ADVERBIEN)
Adverbs of frequency (Häufigkeitsadverbien)
Mithilfe dieser Wörter kannst du sagen, wie oft jemand etwas macht oder wie oft etwas geschieht.
Achtung: Die Wortstellung im Englischen ist anders als im Deutschen. Im Englischen steht das Adverb of frequency immer direkt vor dem Verb.
| 0% | ✗✗✗✗✗ | never | | | ✓✗✗✗✗ | sometimes | | | ✓✓✗✗✗ | often | | | ✓✓✓✗✗ | usually | | 100% | ✓✓✓✓✓ | always |
We sometimes go to the cinema on Fridays.
Nur bei be steht es nach dem Verb.
She is always happy.
Page 126 • GRAMMAR
IMPERATIVES (IMPERATIV / BEFEHLSFORMEN)
Die Befehlsform ist immer gleich wie die Grundform des Verbs (ohne to). Die Verneinung wird mit do not (don't) + Grundform gebildet.
| Run! | Don't run! | | Sit down. | Don't sit down. | | Open the window. | Don't open the window. |
ARTICLES (ARTIKEL)
Indefinite article (Unbestimmter Artikel)
Der unbestimmte Artikel a (im Deutschen ein/eine) wird vor einem zählbaren Hauptwort verwendet, an wird vor jenen zählbaren Hauptwörtern verwendet, die mit einem Selbstlaut (a, e, i, o, u) beginnen.
| a bike | Vor den Vokalen (Selbstlauten): a, e, i, o, u | | a teacher | an egg [ən 'eg] | | a dog | an apple [ən 'æpl] |
Definite article (Bestimmter Artikel)
Der bestimmte Artikel, der wie der/die/das im Deutschen verwendet wird, ist im Englischen immer the.
the bike the teacher the dog
NOUNS (HAUPTWÖRTER)
Plural nouns – Irregular plurals (Mehrzahlformen)
Regelmäßige Mehrzahlformen werden gebildet, indem ein -s angehängt wird.
Regelmäßig
dog – dogs

Bei unregelmäßigen Formen wird am Wortende -y zu **-**ies (bei Vokal vor -y bleibt -y) und -f oder -fe zu **-ves. Aber es gibt auch Ausnahmen, die ganz andere Formen haben und keiner Regel folgen. Diese lernst du am besten auswendig, um sie dir gut zu merken.
Unregelmäßig
baby – babies

Possessive 's (Genitiv)
Das 's nach einem Namen oder einer Personenbezeichnung verwendest du, um auszudrücken, wem oder zu wem etwas gehört. Wenn das Wort auf -s endet, setzt du ans Ende des Wortes ein ' (Apostroph).
It's John's dog. James' mum is very nice. It's my brother's computer. The kids' school bags are green.
Page 127 • GRAMMAR
PRONOUNS (PRONOMEN)
Personal pronouns – Subject and object pronouns (Personalpronomen)
Personalpronomen haben zwei Formen, je nachdem wie sie in einem Satz gebraucht werden: – als Subjekt: Subject pronoun – als Objekt: Object pronoun
| Subject pronoun | I | you | he | she | it | we | you | they | | Object pronoun | me | you | him | her | it | us | you | them |
Das unpersönliche deutsche man kann im Englischen durch you, they oder one ausgedrückt werden.
Possessives
Possessives stehen immer vor dem Hauptwort und zeigen an, wem oder zu wem etwas gehört.
| Possessives | my | your | his | her | its | our | your | their |
this / that – these / those
This / that (Einzahl) und these / those (Mehrzahl) sind Demonstrativpronomen – sie weisen also auf eine spezielle Person, einen Gegenstand oder einen Satz hin.
This / these beschreibt etwas in der Nähe, that / those etwas weiter Entferntes.
I like this T-shirt here. I like that sweater over there. I like these shoes here. I like those shoes over there.
Question words (Fragewörter)
Wenn du eine Frage stellst, auf die du eine ausführlichere Antwort erwartest als nur ja oder nein, verwendest du z.B. folgende Fragewörter:
Who (Wer?)	What (Was?)	Where (Wo?)	How often (Wie oft?)	Why (Warum?)
Who is the best?	What's your name?	Where are you now?	How often do you feed your pet?	Why are you scared?
Who are you?	What eats insects?	Where do you live?		Why do you ask?
Who likes ice cream?	What does your dog eat?			Why does Harry like Mandy?
Who doesn't like her?	What's in your pencil case?			Why can't a helicopter land?

CONJUNCTIONS (KONJUNKTIONEN)
Linking words (and, but, because)
Konjunktionen (Bindewörter) verbinden Hauptsätze und Nebensätze miteinander.
| We went to the cinema | and watched a great film. | | | but it was closed. | | | because we had free tickets. |
Page 128 • GRAMMAR
PREPOSITIONS (PRÄPOSITIONEN)
Präpositionen stehen vor einem Hauptwort oder Pronomen und zeigen die Richtung, den Ort (siehe Prepositions of place), oder die Zeit (siehe Time prepositions) an.
Prepositions of place (Präpositionen des Ortes)
[Images showing spatial relationships:] on in behind next to in front of under
Time prepositions (Präpositionen der Zeit)
Wenn du sagen möchtest, wann etwas stattfindet, verwendest du die Präpositionen on, in oder at.
| My birthday is on February 12th / May 28th / September 5th. | Tage | | My sister's birthday is in December / April / June. | Monate | | The film starts at 7 o'clock / half past eight / six forty-five. | Uhrzeit | | We have maths in the morning / in the afternoon. | | | We go to bed late at night. | Tageszeit | | The concert is on Thursday. | Wochentag |
QUANTITY / MEASUREMENT (MENGENANGABEN)
How much is / are ...?
Mit how much wird nach der Menge (bei nicht zählbaren Hauptwörtern) oder nach dem Preis gefragt.
How much ice cream do you eat every day? How much is the ice cream? How much money have you got? How much are the trainers?
Ordinal numbers
Ordnungszahlen (der/die/das erste, zweite, dritte usw.) werden im Englischen durch spezielle Endungen gebildet. Merkrege: Hänge beim Schreiben an die Zahl 1 -st, an 2 -nd und an 3 -rd an, sonst immer -th!
Cardinal	Ordinal	Cardinal	Ordinal	Cardinal	Ordinal
1 one	1st first	11 eleven	11th eleventh	21 twenty-one	21st twenty-first
2 two	2nd second	12 twelve	12th twelfth	30 thirty	30th thirtieth
3 three	3rd third	13 thirteen	13th thirteenth	40 forty	40th fortieth
4 four	4th fourth	14 fourteen	14th fourteenth	50 fifty	50th fiftieth
5 five	5th fifth	15 fifteen	15th fifteenth	60 sixty	60th sixtieth
6 six	6th sixth	16 sixteen	16th sixteenth	70 seventy	70th seventieth
7 seven	7th seventh	17 seventeen	17th seventeenth	80 eighty	80th eightieth
8 eight	8th eighth	18 eighteen	18th eighteenth	90 ninety	90th ninetieth
9 nine	9th ninth	19 nineteen	19th nineteenth	100 hundred	100th hundredth
10 ten	10th tenth	20 twenty	20th twentieth	101 a/one hundred and one	101st the (one) hundred and first

Page 129 • CLASSROOM LANGUAGE
Can you understand your teacher?
We have plenty of time. Have a go. Have a guess. Don't worry about your pronunciation. Don't worry, it'll get better. Maybe this will help you. Can anybody correct this sentence? That's very good. Well done. That's nice. I like that. You did a great job. That's correct. That's quite right. Yes, you've got it. That's much better. That's a lot better. You didn't make a single mistake. Your pronunciation is very good. You're getting better all the time. Work in pairs/threes/fours/fives. Work in groups of two/three/four.
Stand up and find another partner. Have you finished? Do the next activity. Let's check the answers. Come out and write it on the board. Repeat after me. Again, please. Would you like to answer question 3? Right. Now we will go on to the next exercise. Next one, please. You have ten minutes to do this. Your time is up. Are you ready? Any questions? I'm afraid it's time to finish now. We'll have to stop here. Hang on a moment. Just a moment, please. One more thing before you go. This is your homework. Do exercise 11 on page 22 for your homework. There is no homework today.
When you have a problem, say this:
Sorry? / Pardon? Can you help me, please? Can you repeat that, please? What's … in English, please? I don't understand this. Sorry, I've forgotten my … Sorry, what's our homework?
Page 130 • ENGLISH SOUNDS
| [ ɑː ] | arm | [ eə ] | there | [ ŋ ] | song, long | | [ ʌ ] | fun | [ eɪ ] | take, they | [ p ] | present, top | | [ e ] | desk | [ ɪə ] | here | [ r ] | red, right | | [ ə ] | a, an | [ ɔɪ ] | boy | [ s ] | sister, class | | [ ɜː ] | girl, bird | [ əʊ ] | go, old | [ t ] | time, cat | | [ æ ] | apple | [ ʊə ] | tourist | [ z ] | nose, dogs | | [ ɪ ] | in, it | [ b ] | bag, club | [ ʒ ] | television | | [ iː ] | every | [ d ] | duck, card | [ dʒ ] | orange | | [ i: ] | easy, eat | [ f ] | fish, laugh | [ ʃ ] | sure, English | | [ ɒ ] | orange, sorry | [ g ] | get, dog | [ tʃ ] | child, cheese | | [ ɔː ] | all, call | [ h ] | hot | [ ð ] | these, mother | | [ ʊ ] | look | [ j ] | you | [ θ ] | think, mouth | | [ u ] | February | [ k ] | can, duck | [ v ] | very, have | | [ uː ] | food | [ l ] | lot, small | [ w ] | what, word | | [ aɪ ] | eye, buy | [ m ] | more, mum | | [ aʊ ] | our | [ n ] | now, sun |
The English alphabet:
| A [eɪ] | Q [kjuː] | | B [biː] | R [ɑː] | | C [siː] | S [es] | | D [diː] | T [tiː] | | E [iː] | U [juː] | | F [ef] | V [viː] | | G [dʒiː] | W ['dʌbəljuː] | | H [eɪtʃ] | X [eks] | | I [aɪ] | Y [waɪ] | | J [dʒeɪ] | Z [zed/ziː] | | K [keɪ] | | L [el] | | M [em] | | N [en] | | O [əʊ] | | P [piː] |

```

## v1 floor catalog — m1 (UNTRUSTED seed: mine for ideas, map or waive every id)

### `m1-u1-contractions` — unit 1 · other

**Basic Contractions** / Kurzformen (Kontraktionen)

Common contractions used in spoken and informal written English: I'm, What's, it's, isn't, Let's.

items: 42 — gap-fill 13 · error-correction 6 · multiple-choice 6 · transformation 4 · translation 4 · sentence-building 3 · matching 2 · context-picker 1 · free-form 1 · group-sort 1 · matching-pairs 1 | d2 20 · d1 12 · d3 7 · d4 3

rules (seed):
- [contractions-apostrophe] Contractions shorten two words into one using an apostrophe (') where letters are missing.
  - DE: Kurzformen verkürzen zwei Wörter zu einem Wort. Der Apostroph (') zeigt, wo Buchstaben fehlen.
  - "I am → I'm" — "I am → I'm"
  - "What is → What's" — "What is → What's"
  - "it is → it's" — "it is → it's"
  - "is not → isn't" — "is not → isn't"
  - "Let us → Let's" — "Let us → Let's"
- [contractions-its-vs-its] Don't confuse 'it's' (= it is) with 'its' (= possessive, belonging to it).
  - DE: Verwechsle nicht 'it's' (= it is) mit 'its' (= sein/ihr, Besitz).
  - "It's a nice day. (= It is)" — "Es ist ein schoener Tag."
  - "The dog loves its ball. (= possession)" — "Der Hund liebt seinen Ball."

key forms (seed):
- affirmative: I'm from Austria. · It's a big school. · Let's go!
- negative: It isn't cold today. · That's not right.
- questions: What's your name?

common errors (seed):
- Omitting the apostrophe in contractions: ✗ "Im from Vienna." → ✓ "I'm from Vienna."
- Confusing it's (it is) with its (possessive): ✗ "The cat is eating it's food." → ✓ "The cat is eating its food."

### `m1-u1-imperatives` — unit 1 · other

**Imperatives** / Befehlsform (Imperativ)

Positive and negative commands using the base form of the verb.

items: 41 — gap-fill 14 · error-correction 6 · multiple-choice 5 · transformation 4 · translation 4 · sentence-building 3 · matching 2 · context-picker 1 · free-form 1 · group-sort 1 | d2 24 · d1 7 · d3 7 · d4 3

rules (seed):
- [imperatives-positive] Use the base form of the verb (without 'to') to give a command.
  - DE: Verwende die Grundform des Verbs (ohne 'to') für einen Befehl.
  - "Sit down." — "Setz dich hin."
  - "Open your books." — "Öffnet eure Bücher."
- [imperatives-negative] Use 'Don't' + base form for negative commands.
  - DE: Verwende 'Don't' + Grundform für negative Befehle.
  - "Don't run!" — "Lauf nicht!"
  - "Don't speak German." — "Sprich nicht Deutsch."

key forms (seed):
- affirmative: Sit down. · Open your books. · Listen to the teacher.
- negative: Don't run! · Don't speak German. · Don't touch that.
- questions: 

common errors (seed):
- Adding 'to' before the imperative verb: ✗ "To sit down, please." → ✓ "Sit down, please."
- Including the subject 'you' in the imperative: ✗ "You sit down!" → ✓ "Sit down!"
- Using 'not' instead of 'don't' for negative imperatives: ✗ "Not speak!" → ✓ "Don't speak!"

### `m1-u1-plurals` — unit 1 · other

**Plurals** / Mehrzahl (Plural)

Regular plural endings (-s, -es, -ies) and common irregular plurals.

items: 45 — gap-fill 14 · error-correction 6 · multiple-choice 5 · transformation 4 · translation 4 · sentence-building 3 · anagram 2 · group-sort 2 · matching 2 · context-picker 1 · free-form 1 · matching-pairs 1 | d2 22 · d3 16 · d1 4 · d4 3

rules (seed):
- [plurals-regular-s] Most nouns form the plural by adding -s.
  - DE: Die meisten Nomen bilden die Mehrzahl mit -s.
  - "one cat – two cats" — "eine Katze – zwei Katzen"
  - "one book – three books" — "ein Buch – drei Bücher"
- [plurals-es] Nouns ending in -s, -ss, -sh, -ch, -x, -o add -es.
  - DE: Nomen, die auf -s, -ss, -sh, -ch, -x oder -o enden, bekommen -es.
  - "one bus – two buses" — "ein Bus – zwei Busse"
  - "one box – two boxes" — "eine Schachtel – zwei Schachteln"
  - "one tomato – two tomatoes" — "eine Tomate – zwei Tomaten"
- [plurals-ies] Nouns ending in consonant + -y change -y to -ies.
  - DE: Nomen, die auf Konsonant + -y enden, werden zu -ies.
  - "one baby – two babies" — "ein Baby – zwei Babys"
  - "one city – two cities" — "eine Stadt – zwei Städte"
- [plurals-irregular] Some nouns have irregular plural forms that must be learnt by heart.
  - DE: Manche Nomen haben unregelmäßige Mehrzahlformen, die man auswendig lernen muss.
  - "one child – two children" — "ein Kind – zwei Kinder"
  - "one man – two men" — "ein Mann – zwei Männer"
  - "one woman – two women" — "eine Frau – zwei Frauen"
  - "one foot – two feet" — "ein Fuß – zwei Füße"
  - "one tooth – two teeth" — "ein Zahn – zwei Zähne"
  - "one mouse – two mice" — "eine Maus – zwei Mäuse"
  - "one fish – two fish" — "ein Fisch – zwei Fische"

key forms (seed):
- affirmative: I have two cats. · There are three children in the park.
- negative: 
- questions: 

common errors (seed):
- Regularising irregular plurals: ✗ "There are three childs in the garden." → ✓ "There are three children in the garden."
- Regularising vowel-change plurals: ✗ "My foots are cold." → ✓ "My feet are cold."
- Capitalising nouns as in German: ✗ "I have two Dogs." → ✓ "I have two dogs."
- Forgetting to change -y to -ies: ✗ "There are many babys here." → ✓ "There are many babies here."

### `m1-u2-prepositions-place` — unit 2 · prepositions

**Prepositions of Place** / Ortspräpositionen

Basic prepositions showing where something is: in, on, under, behind, next to, in front of.

items: 41 — gap-fill 16 · error-correction 6 · multiple-choice 4 · transformation 4 · translation 4 · sentence-building 3 · matching 2 · context-picker 1 · group-sort 1 | d2 18 · d1 11 · d3 8 · d4 4

rules (seed):
- [prepositions-place-basic] Use 'in' (inside), 'on' (on a surface), 'under' (below), 'behind' (at the back), 'next to' (beside), 'in front of' (facing).
  - DE: Verwende 'in' (drinnen), 'on' (auf einer Oberflaeche), 'under' (darunter), 'behind' (dahinter), 'next to' (daneben), 'in front of' (davor).
  - "The book is on the table." — "Das Buch ist auf dem Tisch."
  - "The cat is under the bed." — "Die Katze ist unter dem Bett."
  - "The school is next to the park." — "Die Schule ist neben dem Park."
  - "The car is in front of the house." — "Das Auto ist vor dem Haus."

key forms (seed):
- affirmative: The pen is in my bag. · The picture is on the wall. · She is behind the door.
- negative: The keys aren't on the table.
- questions: Where is the cat? · Is it under the chair?

common errors (seed):
- Using 'in' instead of 'at' for locations: ✗ "I am in school. (meaning 'at school')" → ✓ "I am at school."
- Forgetting 'of' in 'in front of': ✗ "The tree is in front the house." → ✓ "The tree is in front of the house."

### `m1-u2-subject-pronouns` — unit 2 · pronouns

**Subject Pronouns** / Subjektpronomen (Personalpronomen im Nominativ)

The personal pronouns used as the subject of a sentence: I, you, he, she, it, we, they.

items: 22 — gap-fill 10 · error-correction 3 · transformation 2 · translation 2 · group-sort 1 · matching 1 · matching-pairs 1 · multiple-choice 1 · sentence-building 1 | d2 7 · d1 6 · d3 5 · d4 4

rules (seed):
- [subject-pronouns-list] Subject pronouns replace a noun as the subject: I, you, he, she, it, we, they.
  - DE: Subjektpronomen ersetzen ein Nomen als Subjekt: I, you, he, she, it, we, they.
  - "Tom is my friend. He is twelve." — "Tom ist mein Freund. Er ist zwoelf."
  - "The book is new. It is interesting." — "Das Buch ist neu. Es ist interessant."
- [subject-pronouns-it] Use 'it' for animals (when gender is unknown) and things, never for people.
  - DE: Verwende 'it' für Tiere (wenn das Geschlecht unbekannt ist) und Dinge, nie für Menschen.
  - "Where is the dog? It is in the garden." — "Wo ist der Hund? Er ist im Garten."
  - "This is my sister. She is nice." — "Das ist meine Schwester. Sie ist nett."

key forms (seed):
- affirmative: I am from Austria. · He is tall. · They are my friends.
- negative: She isn't here. · We aren't ready.
- questions: Is he your brother? · Are they at school?

common errors (seed):
- Using 'he' or 'she' for objects: ✗ "The table is big. He is brown." → ✓ "The table is big. It is brown."
- Using 'it' for people: ✗ "This is my teacher. It is very nice." → ✓ "This is my teacher. She is very nice."

### `m1-u2-there-is-are` — unit 2 · other

**there is / there are** / there is / there are – es gibt

Using 'there is' for singular and 'there are' for plural to say that something exists.

items: 41 — gap-fill 15 · error-correction 6 · multiple-choice 5 · transformation 4 · translation 4 · sentence-building 3 · matching 2 · context-picker 1 · group-sort 1 | d2 24 · d1 9 · d3 4 · d4 4

rules (seed):
- [there-is-singular] Use 'there is' (there's) for singular or uncountable nouns.
  - DE: Verwende 'there is' (there's) für Einzahl oder unzaehlbare Nomen.
  - "There is a park near my house." — "Es gibt einen Park in der Nähe meines Hauses."
  - "There's a cat on the roof." — "Es gibt eine Katze auf dem Dach."
- [there-are-plural] Use 'there are' for plural nouns.
  - DE: Verwende 'there are' für Mehrzahl-Nomen.
  - "There are three bedrooms in my flat." — "Es gibt drei Schlafzimmer in meiner Wohnung."
  - "There are many students in our class." — "Es gibt viele Schueler in unserer Klasse."

key forms (seed):
- affirmative: There is a museum in our town. · There are twenty students in our class.
- negative: There isn't a swimming pool. · There aren't any shops.
- questions: Is there a cinema? · Are there any parks?

common errors (seed):
- Using 'there is' with plural nouns: ✗ "There is three monkeys in the zoo." → ✓ "There are three monkeys in the zoo."
- Using 'it has' instead of 'there is': ✗ "It has a park in our town." → ✓ "There is a park in our town."

### `m1-u2-to-be` — unit 2 · tenses

**to be (Present Simple)** / to be – sein (Gegenwart)

The verb 'to be' in affirmative, negative and question forms: am/is/are.

items: 43 — gap-fill 15 · error-correction 6 · transformation 4 · translation 4 · multiple-choice 3 · sentence-building 3 · group-sort 2 · matching 2 · context-picker 1 · free-form 1 · matching-pairs 1 · question-formation 1 | d2 19 · d1 16 · d3 4 · d4 4

rules (seed):
- [to-be-affirmative] I am / you are / he-she-it is / we are / they are.
  - DE: I am / you are / he-she-it is / we are / they are.
  - "I am twelve years old." — "Ich bin zwoelf Jahre alt."
  - "She is from Vienna." — "Sie ist aus Wien."
  - "We are in class 1A." — "Wir sind in der 1A."
- [to-be-negative] Negative: am not / isn't (is not) / aren't (are not). Note: 'I'm not' (no contraction 'amn't').
  - DE: Verneinung: am not / isn't (is not) / aren't (are not). Beachte: 'I'm not' (keine Kurzform 'amn't').
  - "I'm not hungry." — "Ich bin nicht hungrig."
  - "He isn't at home." — "Er ist nicht zu Hause."
  - "They aren't ready." — "Sie sind nicht fertig."
- [to-be-questions] Questions: swap subject and 'be'. Am I? / Is he? / Are they? Short answers: Yes, I am. / No, he isn't.
  - DE: Fragen: Tausche Subjekt und 'be'. Am I? / Is he? / Are they? Kurzantworten: Yes, I am. / No, he isn't.
  - "Are you happy? – Yes, I am." — "Bist du glücklich? – Ja, bin ich."
  - "Is she your sister? – No, she isn't." — "Ist sie deine Schwester? – Nein, ist sie nicht."

key forms (seed):
- affirmative: I am a student. · She is tall. · They are my friends.
- negative: I'm not tired. · He isn't here. · We aren't late.
- questions: Am I right? · Is he your brother? · Are they from Graz?

common errors (seed):
- Omitting the verb 'be' (copula omission): ✗ "She very nice." → ✓ "She is very nice."
- Using the wrong form of 'be' for the subject: ✗ "I are happy." → ✓ "I am happy."
- Adding 'do' to make questions with 'be': ✗ "Do you are happy?" → ✓ "Are you happy?"
- Using a contraction in affirmative short answers: ✗ "Yes, I'm." → ✓ "Yes, I am."

### `m1-u3-have-got` — unit 3 · other

**have got** / have got – haben

Expressing possession with 'have got' in affirmative, negative and question forms.

items: 22 — gap-fill 8 · error-correction 3 · multiple-choice 2 · transformation 2 · translation 2 · free-form 1 · group-sort 1 · matching 1 · matching-pairs 1 · sentence-building 1 | d2 10 · d3 6 · d4 4 · d1 2

rules (seed):
- [have-got-affirmative] I/you/we/they have got … He/she/it has got …
  - DE: I/you/we/they have got … He/she/it has got …
  - "I have got a brother." — "Ich habe einen Bruder."
  - "She has got long hair." — "Sie hat lange Haare."
- [have-got-negative] Negative: haven't got / hasn't got.
  - DE: Verneinung: haven't got / hasn't got.
  - "I haven't got a pet." — "Ich habe kein Haustier."
  - "He hasn't got a sister." — "Er hat keine Schwester."
- [have-got-questions] Questions: Have you got …? / Has she got …? Short answers: Yes, I have. / No, she hasn't.
  - DE: Fragen: Have you got …? / Has she got …? Kurzantworten: Yes, I have. / No, she hasn't.
  - "Have you got a bike? – Yes, I have." — "Hast du ein Fahrrad? – Ja, habe ich."
  - "Has he got a dog? – No, he hasn't." — "Hat er einen Hund? – Nein, hat er nicht."

key forms (seed):
- affirmative: I've got a new phone. · She's got blue eyes. · They've got two cats.
- negative: I haven't got any money. · He hasn't got a computer.
- questions: Have you got a pen? · Has she got a sister?

common errors (seed):
- Using 'have' instead of 'has' with he/she/it: ✗ "He have got a new bike." → ✓ "He has got a new bike."
- Using 'do/does' for have-got questions: ✗ "Does he has got a cat?" → ✓ "Has he got a cat?"
- Double negation with have got: ✗ "I haven't got no money." → ✓ "I haven't got any money."

### `m1-u3-possessive-s` — unit 3 · other

**Possessive 's** / Genitiv-s (Besitz mit 's)

Showing possession by adding 's to a name or noun: Tom's book, my sister's room.

items: 21 — gap-fill 8 · error-correction 2 · multiple-choice 2 · sentence-building 2 · transformation 2 · translation 2 · free-form 1 · matching 1 · matching-pairs 1 | d2 8 · d3 5 · d1 3 · d4 3 · d5 2

rules (seed):
- [possessive-s-formation] Add 's to the owner's name or noun: Name + 's + thing owned.
  - DE: Hänge 's an den Namen oder das Nomen des Besitzers: Name + 's + Besitz.
  - "Tom's bag is blue." — "Toms Tasche ist blau."
  - "My sister's name is Anna." — "Der Name meiner Schwester ist Anna."
- [possessive-s-vs-is] Don't confuse possessive 's with the 'is' contraction. Context helps you decide.
  - DE: Verwechsle das Besitz-'s nicht mit der Kurzform von 'is'. Der Kontext hilft dir.
  - "Tom's happy. (= Tom is happy)" — "Tom ist glücklich."
  - "Tom's book is new. (= the book belonging to Tom)" — "Toms Buch ist neu."

key forms (seed):
- affirmative: Lisa's cat is cute. · My mum's birthday is in May.
- negative: 
- questions: Where is Sarah's phone?

common errors (seed):
- Omitting the possessive 's: ✗ "This is Tom bag." → ✓ "This is Tom's bag."
- Confusing possessive 's with 'is' contraction: ✗ "Tom's is nice. (meaning: Tom's bag is nice)" → ✓ "Tom's bag is nice."

### `m1-u4-adjectives-be` — unit 4 · other

**Adjectives with be** / Adjektive mit be

Using adjectives after the verb 'be': Subject + be + adjective.

items: 20 — gap-fill 9 · error-correction 2 · sentence-building 2 · transformation 2 · translation 2 · group-sort 1 · matching 1 · multiple-choice 1 | d2 11 · d4 4 · d3 3 · d1 2

rules (seed):
- [adjectives-be-position] Adjectives come after the verb 'be': Subject + am/is/are + adjective.
  - DE: Adjektive stehen nach dem Verb 'be': Subjekt + am/is/are + Adjektiv.
  - "I am tired." — "Ich bin muede."
  - "The film is interesting." — "Der Film ist interessant."
  - "They are happy." — "Sie sind glücklich."
- [adjectives-be-no-change] English adjectives do not change for singular/plural or gender.
  - DE: Englische Adjektive verändern sich nicht für Einzahl/Mehrzahl oder Geschlecht.
  - "The boy is tall. The girls are tall." — "Der Bub ist gross. Die Mädchen sind gross."

key forms (seed):
- affirmative: She is hungry. · The dogs are loud. · I am very happy.
- negative: He isn't angry. · They aren't sad.
- questions: Are you tired? · Is it cold outside?

common errors (seed):
- Placing the adverb 'very' before 'be' instead of before the adjective: ✗ "I very am tired." → ✓ "I am very tired."
- Omitting the verb 'be' before an adjective: ✗ "She very nice." → ✓ "She is very nice."

### `m1-u4-because` — unit 4 · connectors

**because** / because – weil

Using 'because' to give a reason: statement + because + reason (SVO word order).

items: 20 — gap-fill 7 · multiple-choice 3 · sentence-building 3 · transformation 2 · translation 2 · error-correction 1 · free-form 1 · matching 1 | d2 9 · d4 4 · d3 3 · d1 2 · d5 2

rules (seed):
- [because-structure] Use 'because' to give a reason. The word order after 'because' is normal SVO (subject + verb + object).
  - DE: Verwende 'because' für eine Begründung. Die Wortstellung nach 'because' ist normal SVO (Subjekt + Verb + Objekt).
  - "I like summer because it is warm." — "Ich mag den Sommer, weil es warm ist."
  - "She is happy because she has a new bike." — "Sie ist glücklich, weil sie ein neues Fahrrad hat."

key forms (seed):
- affirmative: I'm tired because I got up early. · He likes dogs because they are friendly.
- negative: I don't like winter because it is cold.
- questions: 

common errors (seed):
- Using German V-final word order after 'because': ✗ "I like summer because warm it is." → ✓ "I like summer because it is warm."
- Adding 'of' after 'because' before a clause: ✗ "I'm happy because of I have a dog." → ✓ "I'm happy because I have a dog."

### `m1-u4-days-of-week` — unit 4 · other

**Days of the Week** / Wochentage

The seven days of the week, always capitalised in English, used with the preposition 'on'.

items: 23 — gap-fill 8 · error-correction 3 · multiple-choice 3 · anagram 2 · transformation 2 · translation 2 · group-sort 1 · matching 1 · sentence-building 1 | d2 11 · d1 6 · d3 4 · d4 2

rules (seed):
- [days-capitalisation] Days of the week always start with a capital letter in English: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
  - DE: Wochentage werden im Englischen immer grossgeschrieben: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
  - "Today is Monday." — "Heute ist Montag."
  - "I have English on Wednesday." — "Ich habe am Mittwoch Englisch."
- [days-preposition-on] Use the preposition 'on' with days: on Monday, on Fridays.
  - DE: Verwende die Präposition 'on' mit Wochentagen: on Monday, on Fridays.
  - "We have PE on Tuesday." — "Wir haben am Dienstag Turnen."
  - "She goes swimming on Saturdays." — "Sie geht samstags schwimmen."

key forms (seed):
- affirmative: I play football on Mondays. · The test is on Friday.
- negative: We don't have school on Sunday.
- questions: What day is it today? · Do you have music on Thursday?

common errors (seed):
- Not capitalising days of the week: ✗ "I have sports on tuesday." → ✓ "I have sports on Tuesday."
- Using 'at' or 'in' instead of 'on' with days: ✗ "I have music at Monday." → ✓ "I have music on Monday."
- Spelling days with German-influenced errors: ✗ "Wendsday, Thirsday" → ✓ "Wednesday, Thursday"

### `m1-u5-can` — unit 5 · modals

**can / can't** / can / can't – können

Expressing ability and permission with 'can' and 'can't': can + base verb (no -s, no 'to').

items: 21 — gap-fill 5 · error-correction 3 · multiple-choice 3 · free-form 2 · transformation 2 · translation 2 · group-sort 1 · matching 1 · question-formation 1 · sentence-building 1 | d2 9 · d3 8 · d1 2 · d4 2

rules (seed):
- [can-affirmative] Subject + can + base verb (infinitive without 'to'). 'Can' is the same for all persons (no -s for he/she/it).
  - DE: Subjekt + can + Grundform (Infinitiv ohne 'to'). 'Can' ist für alle Personen gleich (kein -s bei he/she/it).
  - "I can swim." — "Ich kann schwimmen."
  - "She can play the guitar." — "Sie kann Gitarre spielen."
- [can-negative] Negative: can't (cannot) + base verb.
  - DE: Verneinung: can't (cannot) + Grundform.
  - "He can't ride a bike." — "Er kann nicht Rad fahren."
  - "We can't come tomorrow." — "Wir können morgen nicht kommen."
- [can-questions] Questions: Can + subject + base verb? Short answers: Yes, I can. / No, I can't.
  - DE: Fragen: Can + Subjekt + Grundform? Kurzantworten: Yes, I can. / No, I can't.
  - "Can you speak English? – Yes, I can." — "Kannst du Englisch sprechen? – Ja, kann ich."
  - "Can he cook? – No, he can't." — "Kann er kochen? – Nein, kann er nicht."

key forms (seed):
- affirmative: I can run fast. · She can speak three languages.
- negative: I can't drive a car. · They can't come today.
- questions: Can you help me? · Can she play tennis?

common errors (seed):
- Adding -s to 'can' for he/she/it: ✗ "She cans swim very well." → ✓ "She can swim very well."
- Adding 'to' after 'can': ✗ "I can to swim." → ✓ "I can swim."
- Using 'don't can' instead of 'can't': ✗ "I don't can swim." → ✓ "I can't swim."

### `m1-u5-possessive-adjectives` — unit 5 · pronouns

**Possessive Adjectives** / Possessivbegleiter (besitzanzeigende Begleiter)

Words that show who something belongs to: my, your, his, her, its, our, their.

items: 22 — gap-fill 8 · error-correction 4 · multiple-choice 2 · transformation 2 · translation 2 · group-sort 1 · matching 1 · matching-pairs 1 · sentence-building 1 | d2 9 · d3 5 · d1 4 · d4 3 · d5 1

rules (seed):
- [possessive-adj-list] Possessive adjectives go before a noun: my, your, his, her, its, our, their.
  - DE: Possessivbegleiter stehen vor dem Nomen: my, your, his, her, its, our, their.
  - "This is my book." — "Das ist mein Buch."
  - "Her name is Lisa." — "Ihr Name ist Lisa."
  - "Their house is big." — "Ihr Haus ist gross."
- [possessive-adj-its-its] 'its' (no apostrophe) = possessive; 'it's' (with apostrophe) = it is.
  - DE: 'its' (ohne Apostroph) = Besitz; 'it's' (mit Apostroph) = it is.
  - "The dog wags its tail." — "Der Hund wedelt mit seinem Schwanz."
  - "It's a sunny day." — "Es ist ein sonniger Tag."

key forms (seed):
- affirmative: My name is Tom. · His sister is in our class. · Their dog is friendly.
- negative: 
- questions: Is this your pen? · Where is her bag?

common errors (seed):
- Using subject pronouns instead of possessive adjectives: ✗ "This is he book." → ✓ "This is his book."
- Writing 'it's' when meaning the possessive 'its': ✗ "The cat loves it's toy." → ✓ "The cat loves its toy."

### `m1-u6-a-lot-of` — unit 6 · other

**a lot of / lots of** / a lot of / lots of – viel(e)

Using 'a lot of' and 'lots of' with countable and uncountable nouns to express a large quantity.

items: 20 — gap-fill 8 · error-correction 3 · multiple-choice 2 · transformation 2 · translation 2 · group-sort 1 · matching 1 · sentence-building 1 | d2 9 · d4 5 · d3 3 · d1 2 · d5 1

rules (seed):
- [a-lot-of-usage] 'A lot of' and 'lots of' mean 'many/much' and can be used with both countable and uncountable nouns.
  - DE: 'A lot of' und 'lots of' bedeuten 'viel/viele' und können mit zaehlbaren und unzaehlbaren Nomen verwendet werden.
  - "I have a lot of friends." — "Ich habe viele Freunde."
  - "There is lots of water." — "Es gibt viel Wasser."

key forms (seed):
- affirmative: She has a lot of homework. · We eat lots of fruit. · There are a lot of students.
- negative: I don't have a lot of time.
- questions: Do you have a lot of friends?

common errors (seed):
- Writing 'a lots of' instead of 'a lot of': ✗ "I have a lots of books." → ✓ "I have a lot of books."
- Omitting 'of' before the noun: ✗ "She has a lot friends." → ✓ "She has a lot of friends."

### `m1-u6-present-simple-affirmative` — unit 6 · tenses

**Present Simple (Affirmative)** / Present Simple (bejahte Form)

Describing habits and facts using the present simple affirmative: I/you/we/they + base verb, he/she/it + verb-s.

items: 26 — gap-fill 9 · error-correction 3 · context-picker 2 · group-sort 2 · sentence-building 2 · transformation 2 · translation 2 · matching 1 · matching-pairs 1 · multiple-choice 1 · question-formation 1 | d2 11 · d3 9 · d4 3 · d1 2 · d5 1

rules (seed):
- [present-simple-aff-base] I/you/we/they use the base form of the verb.
  - DE: I/you/we/they verwenden die Grundform des Verbs.
  - "I play football every day." — "Ich spiele jeden Tag Fussball."
  - "They live in Salzburg." — "Sie wohnen in Salzburg."
- [present-simple-aff-third-person] He/she/it adds -s (or -es/-ies) to the verb.
  - DE: He/she/it bekommt -s (oder -es/-ies) ans Verb.
  - "He plays football." — "Er spielt Fussball."
  - "She watches TV." — "Sie schaut fern."
  - "He studies every evening." — "Er lernt jeden Abend."
- [present-simple-aff-spelling] Spelling rules for 3rd person: verbs ending in -s, -sh, -ch, -x, -o add -es; verbs ending in consonant + -y change to -ies.
  - DE: Rechtschreibregeln für die 3. Person: Verben auf -s, -sh, -ch, -x, -o bekommen -es; Verben auf Konsonant + -y werden zu -ies.
  - "go → goes, wash → washes, try → tries" — "go → goes, wash → washes, try → tries"

key forms (seed):
- affirmative: I eat breakfast at seven. · She goes to school by bus. · We like pizza.
- negative: 
- questions: 

common errors (seed):
- Forgetting the -s for he/she/it (THE #1 learner error): ✗ "She play tennis every day." → ✓ "She plays tennis every day."
- Wrong spelling of 3rd person forms: ✗ "He playes football." → ✓ "He plays football."
- Using German V2 word order with time adverbs: ✗ "Every day play I football." → ✓ "Every day I play football."

### `m1-u7-adverbs-frequency` — unit 7 · other

**Adverbs of Frequency** / Häufigkeitsadverbien

Frequency adverbs (always, usually, often, sometimes, never) and their position in the sentence.

items: 21 — gap-fill 7 · sentence-building 4 · multiple-choice 3 · transformation 2 · translation 2 · error-correction 1 · group-sort 1 · matching 1 | d2 8 · d3 6 · d4 3 · d1 2 · d5 2

rules (seed):
- [adverbs-freq-position-main] Frequency adverbs come before the main verb: Subject + adverb + verb.
  - DE: Häufigkeitsadverbien stehen vor dem Hauptverb: Subjekt + Adverb + Verb.
  - "I always eat breakfast." — "Ich esse immer Fruehstueck."
  - "She never watches TV." — "Sie schaut nie fern."
- [adverbs-freq-position-be] Frequency adverbs come after the verb 'be': Subject + be + adverb.
  - DE: Häufigkeitsadverbien stehen nach dem Verb 'be': Subjekt + be + Adverb.
  - "She is always happy." — "Sie ist immer glücklich."
  - "They are usually late." — "Sie kommen normalerweise zu spaet."

key forms (seed):
- affirmative: I always walk to school. · She usually gets up at seven. · He is often tired.
- negative: I never eat fish. · She doesn't usually watch TV.
- questions: Do you always have breakfast? · Are you usually on time?

common errors (seed):
- Placing the adverb after the main verb (German word order): ✗ "I eat always breakfast." → ✓ "I always eat breakfast."
- Placing the adverb before 'be' instead of after it: ✗ "She always is happy." → ✓ "She is always happy."

### `m1-u7-articles` — unit 7 · articles

**Articles: a / an** / Artikel: a / an – ein/eine

The indefinite articles 'a' (before consonant sounds) and 'an' (before vowel sounds).

items: 21 — gap-fill 10 · error-correction 3 · transformation 2 · translation 2 · group-sort 1 · matching 1 · multiple-choice 1 · sentence-building 1 | d2 9 · d4 4 · d1 3 · d3 3 · d5 2

rules (seed):
- [articles-a-consonant] Use 'a' before words that start with a consonant sound.
  - DE: Verwende 'a' vor Wörtern, die mit einem Konsonantenlaut beginnen.
  - "a book, a cat, a university" — "ein Buch, eine Katze, eine Universitaet"
- [articles-an-vowel] Use 'an' before words that start with a vowel sound.
  - DE: Verwende 'an' vor Wörtern, die mit einem Vokallaut beginnen.
  - "an apple, an elephant, an hour" — "ein Apfel, ein Elefant, eine Stunde"

key forms (seed):
- affirmative: I have a dog. · She is an artist. · It's a nice day.
- negative: 
- questions: Is it a cat or a dog?

common errors (seed):
- Using 'a' before a vowel sound: ✗ "I eat a apple every day." → ✓ "I eat an apple every day."
- Using 'an' before words starting with a consonant sound despite vowel spelling: ✗ "She goes to an university." → ✓ "She goes to a university."

### `m1-u7-present-simple-negative` — unit 7 · tenses

**Present Simple (Negative)** / Present Simple (verneinte Form)

Forming negative sentences in the present simple with don't / doesn't + base verb.

items: 21 — gap-fill 7 · error-correction 3 · free-form 2 · multiple-choice 2 · transformation 2 · translation 2 · group-sort 1 · matching 1 · sentence-building 1 | d2 10 · d3 5 · d4 3 · d5 2 · d1 1

rules (seed):
- [present-simple-neg-dont] I/you/we/they + don't (do not) + base verb.
  - DE: I/you/we/they + don't (do not) + Grundform.
  - "I don't like coffee." — "Ich mag keinen Kaffee."
  - "They don't live here." — "Sie wohnen nicht hier."
- [present-simple-neg-doesnt] He/she/it + doesn't (does not) + base verb (no -s on the verb!).
  - DE: He/she/it + doesn't (does not) + Grundform (kein -s am Verb!).
  - "She doesn't eat meat." — "Sie isst kein Fleisch."
  - "He doesn't play tennis." — "Er spielt nicht Tennis."

key forms (seed):
- affirmative: 
- negative: I don't want pizza. · She doesn't speak French. · We don't have homework today.
- questions: 

common errors (seed):
- Keeping the -s on the verb after 'doesn't' (double marking): ✗ "She doesn't eats breakfast." → ✓ "She doesn't eat breakfast."
- Using 'don't' with he/she/it instead of 'doesn't': ✗ "He don't like football." → ✓ "He doesn't like football."

### `m1-u8-present-simple-questions` — unit 8 · tenses

**Present Simple (Questions)** / Present Simple (Frageform)

Forming yes/no questions and short answers in the present simple with Do/Does + subject + base verb.

items: 21 — gap-fill 6 · error-correction 3 · free-form 2 · multiple-choice 2 · transformation 2 · translation 2 · group-sort 1 · matching 1 · question-formation 1 · sentence-building 1 | d2 9 · d3 7 · d4 4 · d1 1

rules (seed):
- [present-simple-q-do] Do + I/you/we/they + base verb?
  - DE: Do + I/you/we/they + Grundform?
  - "Do you like pizza? – Yes, I do." — "Magst du Pizza? – Ja."
  - "Do they play football? – No, they don't." — "Spielen sie Fussball? – Nein."
- [present-simple-q-does] Does + he/she/it + base verb? (no -s on the verb!)
  - DE: Does + he/she/it + Grundform? (kein -s am Verb!)
  - "Does she like music? – Yes, she does." — "Mag sie Musik? – Ja."
  - "Does he play the piano? – No, he doesn't." — "Spielt er Klavier? – Nein."

key forms (seed):
- affirmative: 
- negative: 
- questions: Do you have a pet? · Does she walk to school? · Do they live in Vienna?

common errors (seed):
- Keeping the -s on the main verb in 'does' questions: ✗ "Does she likes chocolate?" → ✓ "Does she like chocolate?"
- Using 'do' instead of 'does' with he/she/it: ✗ "Do he play football?" → ✓ "Does he play football?"

### `m1-u9-frequency-expressions` — unit 9 · other

**Frequency Expressions** / Häufigkeitsausdrücke

Time expressions for frequency: once a week, twice a day, three times a month, every day.

items: 21 — gap-fill 9 · error-correction 3 · multiple-choice 2 · transformation 2 · translation 2 · group-sort 1 · matching 1 · sentence-building 1 | d2 8 · d4 5 · d3 4 · d1 3 · d5 1

rules (seed):
- [frequency-expressions-once-twice] Use 'once' (= one time), 'twice' (= two times), 'three times', etc. + a day/week/month/year.
  - DE: Verwende 'once' (= einmal), 'twice' (= zweimal), 'three times' usw. + a day/week/month/year.
  - "I brush my teeth twice a day." — "Ich putze mir zweimal am Tag die Zähne."
  - "We have English three times a week." — "Wir haben dreimal pro Woche Englisch."
- [frequency-expressions-every] 'Every' + singular noun: every day, every week, every Monday.
  - DE: 'Every' + Nomen in der Einzahl: every day, every week, every Monday.
  - "She goes running every morning." — "Sie geht jeden Morgen laufen."
  - "I play football every Saturday." — "Ich spiele jeden Samstag Fussball."

key forms (seed):
- affirmative: I play tennis once a week. · She goes swimming twice a week. · We have tests every month.
- negative: 
- questions: How often do you go to the cinema?

common errors (seed):
- Saying 'one time' instead of 'once': ✗ "I go swimming one time a week." → ✓ "I go swimming once a week."
- Saying 'two times' instead of 'twice': ✗ "I eat fruit two times a day." → ✓ "I eat fruit twice a day."

### `m1-u9-object-pronouns` — unit 9 · pronouns

**Object Pronouns** / Objektpronomen

Personal pronouns used as the object of a verb or after a preposition: me, you, him, her, it, us, them.

items: 22 — gap-fill 10 · error-correction 3 · transformation 2 · translation 2 · group-sort 1 · matching 1 · matching-pairs 1 · multiple-choice 1 · sentence-building 1 | d2 8 · d4 5 · d1 4 · d3 4 · d5 1

rules (seed):
- [object-pronouns-list] Object pronouns replace a noun as the object: me, you, him, her, it, us, them.
  - DE: Objektpronomen ersetzen ein Nomen als Objekt: me, you, him, her, it, us, them.
  - "I like him. (not: I like he)" — "Ich mag ihn."
  - "Can you help us?" — "Kannst du uns helfen?"
  - "Give it to them." — "Gib es ihnen."
- [object-pronouns-after-prep] After prepositions, always use object pronouns.
  - DE: Nach Präpositionen verwendet man immer Objektpronomen.
  - "This present is for her." — "Dieses Geschenk ist für sie."
  - "Come with me." — "Komm mit mir."

key forms (seed):
- affirmative: I know her. · She likes him. · Tell them the answer. · Listen to me.
- negative: I don't know them.
- questions: Can you see us? · Do you like it?

common errors (seed):
- Using subject pronouns as objects: ✗ "I like he." → ✓ "I like him."
- Using subject pronouns after prepositions: ✗ "This is for she." → ✓ "This is for her."

### `m1-u9-question-words` — unit 9 · other

**Question Words** / Fragewörter (W-Fragen)

Using question words (who, what, where, how often, why) to ask open questions.

items: 20 — gap-fill 7 · error-correction 3 · multiple-choice 2 · transformation 2 · translation 2 · matching 1 · matching-pairs 1 · question-formation 1 · sentence-building 1 | d2 7 · d3 6 · d4 4 · d1 2 · d5 1

rules (seed):
- [question-words-list] Common question words: who (person), what (thing), where (place), why (reason), how often (frequency). Structure: Question word + do/does + subject + base verb?
  - DE: Wichtige Fragewörter: who (Person), what (Sache), where (Ort), why (Grund), how often (Häufigkeit). Struktur: Fragewort + do/does + Subjekt + Grundform?
  - "Where do you live?" — "Wo wohnst du?"
  - "What does she like?" — "Was mag sie?"
  - "Why are you sad?" — "Warum bist du traurig?"
  - "How often do you play football?" — "Wie oft spielst du Fussball?"
- [question-words-who-subject] When 'who' is the subject, don't use do/does: Who likes pizza? (not: Who does like pizza?)
  - DE: Wenn 'who' das Subjekt ist, kein do/does: Who likes pizza? (nicht: Who does like pizza?)
  - "Who speaks French in your class?" — "Wer spricht Franzoesisch in deiner Klasse?"

key forms (seed):
- affirmative: 
- negative: 
- questions: What do you eat for breakfast? · Where does he live? · Why do they like it? · Who is your best friend?

common errors (seed):
- Using the wrong question word: ✗ "Where is your name?" → ✓ "What is your name?"
- Omitting do-support in Wh-questions: ✗ "Where you live?" → ✓ "Where do you live?"

### `m1-u10-demonstratives` — unit 10 · pronouns

**Demonstratives: this/that/these/those** / Demonstrativpronomen: this/that/these/those

Pointing words: this/these (near) and that/those (far), matching singular and plural.

items: 21 — gap-fill 9 · error-correction 3 · group-sort 2 · transformation 2 · translation 2 · matching 1 · multiple-choice 1 · sentence-building 1 | d2 13 · d3 6 · d1 2

rules (seed):
- [demonstratives-near] Use 'this' (singular) and 'these' (plural) for things near you.
  - DE: Verwende 'this' (Einzahl) und 'these' (Mehrzahl) für Dinge in deiner Nähe.
  - "This is my pen." — "Das ist mein Stift."
  - "These are my books." — "Das sind meine Bücher."
- [demonstratives-far] Use 'that' (singular) and 'those' (plural) for things far from you.
  - DE: Verwende 'that' (Einzahl) und 'those' (Mehrzahl) für Dinge, die weiter weg sind.
  - "That is her house." — "Das ist ihr Haus."
  - "Those are his friends." — "Das sind seine Freunde."

key forms (seed):
- affirmative: This is great! · These shoes are new. · That dog is big. · Those children are loud.
- negative: This isn't mine. · Those aren't my keys.
- questions: Is this your bag? · Are those your shoes?

common errors (seed):
- Using singular demonstrative with plural noun: ✗ "This shoes are nice." → ✓ "These shoes are nice."
- Using 'that' with plural nouns: ✗ "That books are interesting." → ✓ "Those books are interesting."

### `m1-u10-how-much` — unit 10 · other

**How much is / are …?** / How much is / are …? – Wie viel kostet …?

Asking about prices with 'How much is …?' (singular) and 'How much are …?' (plural).

items: 19 — gap-fill 9 · error-correction 3 · question-formation 2 · translation 2 · group-sort 1 · multiple-choice 1 · transformation 1 | d2 11 · d3 6 · d1 2

rules (seed):
- [how-much-singular] How much is + singular noun? Use 'is' for one thing.
  - DE: How much is + Nomen (Einzahl)? Verwende 'is' für eine Sache.
  - "How much is this T-shirt? – It's fifteen euros." — "Wie viel kostet dieses T-Shirt? – Es kostet fünfzehn Euro."
- [how-much-plural] How much are + plural noun? Use 'are' for more than one thing.
  - DE: How much are + Nomen (Mehrzahl)? Verwende 'are' für mehrere Sachen.
  - "How much are the shoes? – They're forty euros." — "Wie viel kosten die Schuhe? – Sie kosten vierzig Euro."

key forms (seed):
- affirmative: It's ten euros. · They're twenty-five euros.
- negative: 
- questions: How much is this bag? · How much are the trainers?

common errors (seed):
- Using 'is' with plural nouns: ✗ "How much is the shoes?" → ✓ "How much are the shoes?"
- Using 'costs' instead of the 'be' structure: ✗ "How much costs it?" → ✓ "How much is it?"

### `m1-u11-present-continuous` — unit 11 · tenses

**Present Continuous** / Present Continuous (Verlaufsform der Gegenwart)

Actions happening now: am/is/are + verb-ing in affirmative, negative and question forms.

items: 27 — gap-fill 8 · anagram 3 · context-picker 3 · error-correction 3 · multiple-choice 2 · transformation 2 · translation 2 · group-sort 1 · matching-pairs 1 · question-formation 1 · sentence-building 1 | d2 15 · d3 10 · d1 2

rules (seed):
- [present-continuous-aff] Subject + am/is/are + verb-ing. Used for actions happening right now.
  - DE: Subjekt + am/is/are + Verb-ing. Wird für Handlungen verwendet, die gerade jetzt passieren.
  - "I am reading a book." — "Ich lese gerade ein Buch."
  - "She is playing tennis." — "Sie spielt gerade Tennis."
  - "They are watching TV." — "Sie schauen gerade fern."
- [present-continuous-neg] Negative: Subject + am not / isn't / aren't + verb-ing.
  - DE: Verneinung: Subjekt + am not / isn't / aren't + Verb-ing.
  - "I'm not sleeping." — "Ich schlafe nicht."
  - "He isn't working today." — "Er arbeitet heute nicht."
- [present-continuous-questions] Questions: Am/Is/Are + subject + verb-ing? Short answers: Yes, I am. / No, she isn't.
  - DE: Fragen: Am/Is/Are + Subjekt + Verb-ing? Kurzantworten: Yes, I am. / No, she isn't.
  - "Are you listening? – Yes, I am." — "Hörst du zu? – Ja."
  - "Is he sleeping? – No, he isn't." — "Schlaeft er? – Nein."
- [present-continuous-spelling] Spelling rules: drop final -e before -ing (make → making); double the final consonant after a short vowel (sit → sitting, run → running).
  - DE: Rechtschreibregeln: -e am Ende faellt weg vor -ing (make → making); Verdopplung des Endkonsonanten nach kurzem Vokal (sit → sitting, run → running).
  - "write → writing, swim → swimming, dance → dancing" — "write → writing, swim → swimming, dance → dancing"

key forms (seed):
- affirmative: I'm doing my homework. · She's reading a book. · We're having lunch.
- negative: I'm not watching TV. · He isn't listening. · They aren't playing.
- questions: Are you coming? · Is she studying? · What are you doing?

common errors (seed):
- Omitting the 'be' auxiliary: ✗ "She playing football right now." → ✓ "She is playing football right now."
- Using do-support for present continuous questions: ✗ "Do you playing football?" → ✓ "Are you playing football?"
- Not dropping the -e before -ing: ✗ "She is rideing a bike." → ✓ "She is riding a bike."
- Forgetting to double the consonant before -ing: ✗ "He is siting on the chair." → ✓ "He is sitting on the chair."

### `m1-u12-ordinal-numbers` — unit 12 · other

**Ordinal Numbers** / Ordnungszahlen

Ordinal numbers (1st–31st) with spelling rules: most add -th, with exceptions for 1st, 2nd, 3rd.

items: 21 — gap-fill 7 · error-correction 3 · multiple-choice 3 · anagram 2 · transformation 2 · translation 2 · matching 1 · matching-pairs 1 | d2 11 · d3 7 · d1 3

rules (seed):
- [ordinals-regular] Most ordinal numbers add -th to the cardinal number: four → fourth, six → sixth, seven → seventh.
  - DE: Die meisten Ordnungszahlen hängen -th an die Grundzahl: four → fourth, six → sixth, seven → seventh.
  - "She is in the fourth grade." — "Sie ist in der vierten Klasse."
  - "Today is the seventh of March." — "Heute ist der siebte Maerz."
- [ordinals-exceptions] Exceptions: first (1st), second (2nd), third (3rd). Spelling changes: five → fifth, eight → eighth, nine → ninth, twelve → twelfth.
  - DE: Ausnahmen: first (1st), second (2nd), third (3rd). Rechtschreibaenderungen: five → fifth, eight → eighth, nine → ninth, twelve → twelfth.
  - "He came first in the race." — "Er wurde Erster im Rennen."
  - "My birthday is on the twenty-third of May." — "Mein Geburtstag ist am dreiundzwanzigsten Mai."

key forms (seed):
- affirmative: It's my first day. · She lives on the third floor. · Today is the fifteenth of December.
- negative: 
- questions: What's the date today? – It's the twenty-first of June.

common errors (seed):
- Wrong spelling of irregular ordinals: ✗ "She was fiveth in the race." → ✓ "She was fifth in the race."
- Keeping the -e in ninth: ✗ "His birthday is on the nineth." → ✓ "His birthday is on the ninth."

### `m1-u12-past-simple-be` — unit 12 · tenses

**Past Simple: was / were** / Past Simple: was / were – war/waren

The past tense of 'be': was (I/he/she/it), were (you/we/they) in all forms.

items: 24 — gap-fill 10 · error-correction 3 · context-picker 2 · group-sort 2 · transformation 2 · translation 2 · multiple-choice 1 · question-formation 1 · sentence-building 1 | d2 14 · d3 7 · d1 3

rules (seed):
- [past-be-affirmative] I/he/she/it + was. You/we/they + were.
  - DE: I/he/she/it + was. You/we/they + were.
  - "I was at home yesterday." — "Ich war gestern zu Hause."
  - "They were in London last summer." — "Sie waren letzten Sommer in London."
- [past-be-negative] Negative: wasn't (was not), weren't (were not).
  - DE: Verneinung: wasn't (was not), weren't (were not).
  - "She wasn't happy." — "Sie war nicht glücklich."
  - "We weren't at school." — "Wir waren nicht in der Schule."
- [past-be-questions] Questions: Was I/he/she/it …? Were you/we/they …? Short answers: Yes, I was. / No, they weren't.
  - DE: Fragen: Was I/he/she/it …? Were you/we/they …? Kurzantworten: Yes, I was. / No, they weren't.
  - "Was it cold? – Yes, it was." — "War es kalt? – Ja, war es."
  - "Were you at the party? – No, I wasn't." — "Warst du bei der Party? – Nein, war ich nicht."

key forms (seed):
- affirmative: I was tired. · She was in Graz. · We were late.
- negative: He wasn't angry. · They weren't at home.
- questions: Was she at school? · Were you happy?

common errors (seed):
- Using 'were' with I or 'was' with they: ✗ "I were at the cinema." → ✓ "I was at the cinema."
- Using 'was' with plural subjects: ✗ "They was very happy." → ✓ "They were very happy."
- Adding -ed to was/were: ✗ "I wered at school." → ✓ "I was at school."

### `m1-u12-prepositions-time` — unit 12 · prepositions

**Prepositions of Time** / Zeitpräpositionen

Prepositions used with time expressions: on (days/dates), in (months/seasons), at (times).

items: 20 — gap-fill 9 · error-correction 3 · transformation 2 · translation 2 · group-sort 1 · matching 1 · multiple-choice 1 · sentence-building 1 | d2 12 · d3 5 · d1 3

rules (seed):
- [prepositions-time-on] Use 'on' for days and dates: on Monday, on the 5th of May, on my birthday.
  - DE: Verwende 'on' für Tage und Daten: on Monday, on the 5th of May, on my birthday.
  - "I have a test on Friday." — "Ich habe am Freitag einen Test."
  - "Her birthday is on the 3rd of April." — "Ihr Geburtstag ist am 3. April."
- [prepositions-time-in] Use 'in' for months, seasons, and longer periods: in January, in summer, in the morning.
  - DE: Verwende 'in' für Monate, Jahreszeiten und längere Zeitraeume: in January, in summer, in the morning.
  - "School starts in September." — "Die Schule beginnt im September."
  - "I wake up early in the morning." — "Ich wache frueh am Morgen auf."
- [prepositions-time-at] Use 'at' for clock times and fixed time points: at 7 o'clock, at night, at the weekend.
  - DE: Verwende 'at' für Uhrzeiten und feste Zeitpunkte: at 7 o'clock, at night, at the weekend.
  - "School starts at 8 o'clock." — "Die Schule beginnt um 8 Uhr."
  - "I read at night." — "Ich lese in der Nacht."

key forms (seed):
- affirmative: I go to bed at ten. · We have PE on Tuesdays. · It's hot in summer.
- negative: I don't study at night.
- questions: When is the party? – On Saturday at seven.

common errors (seed):
- Using 'in' instead of 'on' with days: ✗ "I have sports in Monday." → ✓ "I have sports on Monday."
- Using 'on' instead of 'in' with months: ✗ "My birthday is on December." → ✓ "My birthday is in December."

### `m1-u13-linking-words` — unit 13 · connectors

**Linking Words: and, but, because** / Bindewörter: and, but, because

Basic linking words to join ideas: and (addition), but (contrast), because (reason).

items: 16 — gap-fill 10 · error-correction 3 · group-sort 1 · multiple-choice 1 · translation 1 | d2 8 · d3 5 · d1 3

rules (seed):
- [linking-and] 'And' joins two similar ideas (addition).
  - DE: 'And' verbindet zwei aehnliche Ideen (Hinzufuegung).
  - "I like pizza and pasta." — "Ich mag Pizza und Pasta."
  - "She is clever and funny." — "Sie ist klug und lustig."
- [linking-but] 'But' joins two contrasting ideas.
  - DE: 'But' verbindet zwei gegensätzliche Ideen.
  - "I like cats but I don't like dogs." — "Ich mag Katzen, aber ich mag keine Hunde."
  - "He is tall but he can't play basketball." — "Er ist gross, aber er kann nicht Basketball spielen."
- [linking-because] 'Because' gives a reason. Normal SVO word order follows.
  - DE: 'Because' gibt einen Grund an. Normale SVO-Wortstellung folgt.
  - "I stayed at home because I was ill." — "Ich blieb zu Hause, weil ich krank war."

key forms (seed):
- affirmative: I played football and I watched TV. · She was tired but she didn't go to bed. · We stayed inside because it rained.
- negative: 
- questions: 

common errors (seed):
- Overusing 'and' to connect everything: ✗ "I woke up and I had breakfast and I went to school and I played football." → ✓ "I woke up and had breakfast. Then I went to school. After school, I played football."
- Using German V-final word order after 'because': ✗ "I was happy because a good mark I got." → ✓ "I was happy because I got a good mark."

### `m1-u13-past-simple-regular` — unit 13 · tenses

**Past Simple: Regular Verbs** / Past Simple: regelmäßige Verben

Forming the past simple of regular verbs by adding -ed, with spelling rules for -d, -ied, and doubled consonants.

items: 25 — gap-fill 8 · anagram 3 · error-correction 3 · group-sort 2 · multiple-choice 2 · transformation 2 · translation 2 · context-picker 1 · matching-pairs 1 · sentence-building 1 | d2 14 · d3 6 · d1 5

rules (seed):
- [past-regular-ed] Add -ed to most verbs: play → played, walk → walked, want → wanted.
  - DE: Hänge -ed an die meisten Verben: play → played, walk → walked, want → wanted.
  - "I played football yesterday." — "Ich habe gestern Fussball gespielt."
  - "She walked to school." — "Sie ist zu Fuß in die Schule gegangen."
- [past-regular-spelling] Spelling rules: verbs ending in -e add -d (like → liked); consonant + y changes to -ied (study → studied); short vowel + consonant doubles the consonant (stop → stopped).
  - DE: Rechtschreibregeln: Verben auf -e bekommen nur -d (like → liked); Konsonant + y wird zu -ied (study → studied); kurzer Vokal + Konsonant verdoppelt den Konsonanten (stop → stopped).
  - "She liked the film." — "Der Film hat ihr gefallen."
  - "He studied for the test." — "Er hat für den Test gelernt."
  - "The bus stopped." — "Der Bus hielt an."

key forms (seed):
- affirmative: I watched TV last night. · She visited her grandma. · They played in the park.
- negative: 
- questions: 

common errors (seed):
- Forgetting to add -ed: ✗ "I walk to school yesterday." → ✓ "I walked to school yesterday."
- Forgetting to double the consonant: ✗ "The bus stoped at the corner." → ✓ "The bus stopped at the corner."
- Adding -ed to irregular verbs: ✗ "I goed to school." → ✓ "I went to school."

### `m1-u14-irregular-verbs` — unit 14 · tenses

**Irregular Verbs (Past Simple)** / unregelmäßige Verben (Past Simple)

Common irregular verbs that do not follow the -ed pattern in the past simple.

items: 27 — gap-fill 9 · anagram 4 · error-correction 3 · matching-pairs 2 · multiple-choice 2 · transformation 2 · translation 2 · context-picker 1 · group-sort 1 · matching 1 | d2 14 · d3 10 · d1 2 · d4 1

rules (seed):
- [irregular-verbs-concept] Irregular verbs have special past forms that must be learnt by heart. They do NOT add -ed.
  - DE: unregelmäßige Verben haben besondere Vergangenheitsformen, die man auswendig lernen muss. Sie bekommen KEIN -ed.
  - "go → went" — "gehen → ging"
  - "see → saw" — "sehen → sah"
  - "have → had" — "haben → hatte"
  - "make → made" — "machen → machte"
  - "get → got" — "bekommen → bekam"
  - "come → came" — "kommen → kam"
  - "eat → ate" — "essen → ass"
  - "drink → drank" — "trinken → trank"
  - "take → took" — "nehmen → nahm"
  - "give → gave" — "geben → gab"
  - "run → ran" — "laufen → lief"
  - "swim → swam" — "schwimmen → schwamm"
  - "write → wrote" — "schreiben → schrieb"
  - "read → read" — "lesen → las"
  - "say → said" — "sagen → sagte"
  - "think → thought" — "denken → dachte"
  - "buy → bought" — "kaufen → kaufte"
  - "bring → brought" — "bringen → brachte"
  - "find → found" — "finden → fand"
  - "know → knew" — "wissen → wusste"
  - "put → put" — "legen/stellen → legte/stellte"
  - "sit → sat" — "sitzen → sass"
  - "stand → stood" — "stehen → stand"
  - "tell → told" — "erzaehlen → erzaehlte"
  - "win → won" — "gewinnen → gewann"

key forms (seed):
- affirmative: I went to the park. · She saw a film. · We had pizza for dinner.
- negative: I didn't go to the park. · She didn't see the film.
- questions: Did you go to the party? · Did she see the film?

common errors (seed):
- Adding -ed to irregular verbs: ✗ "I goed to the cinema yesterday." → ✓ "I went to the cinema yesterday."
- Regularising irregular verbs that change vowels: ✗ "He runned very fast." → ✓ "He ran very fast."
- Regularising thought-pattern irregular verbs: ✗ "She thinked about it." → ✓ "She thought about it."

### `m1-u14-past-simple-negative` — unit 14 · tenses

**Past Simple (Negative)** / Past Simple (verneinte Form)

Forming negative sentences in the past simple with didn't + base verb.

items: 16 — gap-fill 7 · error-correction 3 · transformation 2 · group-sort 1 · multiple-choice 1 · question-formation 1 · translation 1 | d2 9 · d3 5 · d1 2

rules (seed):
- [past-neg-didnt] Subject + didn't (did not) + base verb (not the past form!).
  - DE: Subjekt + didn't (did not) + Grundform (nicht die Vergangenheitsform!).
  - "I didn't go to school yesterday." — "Ich bin gestern nicht in die Schule gegangen."
  - "She didn't watch TV." — "Sie hat nicht ferngesehen."

key forms (seed):
- affirmative: 
- negative: I didn't see the film. · He didn't play football. · We didn't have homework.
- questions: 

common errors (seed):
- Using the past form after 'didn't' (double past marking — THE classic error): ✗ "I didn't went to school." → ✓ "I didn't go to school."
- Keeping -ed on the verb after 'didn't': ✗ "She didn't liked the food." → ✓ "She didn't like the food."

### `m1-u15-going-to` — unit 15 · tenses

**going to (Future)** / going to – Zukunft (geplante Handlungen)

Talking about future plans and intentions with be + going to + base verb.

items: 25 — gap-fill 8 · error-correction 3 · multiple-choice 3 · context-picker 2 · group-sort 2 · question-formation 2 · transformation 2 · translation 2 · sentence-building 1 | d2 13 · d3 10 · d1 2

rules (seed):
- [going-to-affirmative] Subject + am/is/are + going to + base verb.
  - DE: Subjekt + am/is/are + going to + Grundform.
  - "I'm going to visit my grandma." — "Ich werde meine Oma besuchen."
  - "She's going to travel to London." — "Sie wird nach London reisen."
- [going-to-negative] Negative: Subject + am not / isn't / aren't + going to + base verb.
  - DE: Verneinung: Subjekt + am not / isn't / aren't + going to + Grundform.
  - "I'm not going to watch TV." — "Ich werde nicht fernsehen."
  - "They aren't going to play football." — "Sie werden nicht Fussball spielen."
- [going-to-questions] Questions: Am/Is/Are + subject + going to + base verb? Short answers: Yes, I am. / No, she isn't.
  - DE: Fragen: Am/Is/Are + Subjekt + going to + Grundform? Kurzantworten: Yes, I am. / No, she isn't.
  - "Are you going to come to the party? – Yes, I am." — "Wirst du zur Party kommen? – Ja."
  - "Is he going to study medicine? – No, he isn't." — "Wird er Medizin studieren? – Nein."

key forms (seed):
- affirmative: I'm going to buy a new phone. · She's going to read a book. · We're going to have a picnic.
- negative: I'm not going to eat pizza. · He isn't going to come.
- questions: Are you going to help me? · Is she going to call us?

common errors (seed):
- Omitting the 'be' auxiliary before 'going to': ✗ "I going to play football tomorrow." → ✓ "I'm going to play football tomorrow."
- Using do-support for going-to questions: ✗ "Do you going to come?" → ✓ "Are you going to come?"
- Adding -ing to the main verb after 'going to': ✗ "She is going to swimming." → ✓ "She is going to swim."
