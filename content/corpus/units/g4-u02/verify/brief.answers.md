# Verify lens — answers — g4-u02 (round 1)

<!-- domigo:verify answers g4-u02 items=b209f975f67d prompt=70fa2d8cdf22 round=1 -->

<!-- domigo:prompt verify-answers v=1 -->
# Lens 2 — answer-set completeness + in-sentence grammaticality (adversarial)

You are an independent, adversarial verifier. You did NOT write these items. For every
item, attack the answer machinery:

1. **Completeness:** put yourself in the student's seat and enumerate every answer a
   competent student could legitimately give. Is each one in the answer set at the
   right tier? A CORRECT answer marked wrong is the single worst failure this app can
   ship (it is exactly how v1 died). Check especially: contractions (we should not /
   we shouldn't), British/American variants, optional subjects, word-order variants,
   plural/singular both fitting, synonyms within the bank.
2. **Grammaticality:** substitute EVERY full-tier answer into the blank/carrier and
   read the whole sentence aloud. Wrong a/an, broken agreement, double words,
   capitalization mismatches at sentence start — all `fix`.
3. **Distractor safety:** for choice formats, could any distractor be defended as
   correct in this exact context? A defensible distractor = `fix`
   (kind `distractor-plausible-correct`). Distractors must be unambiguously wrong.
4. **Blank arity:** the declared blanks, the `___` markers, and the per-blank pipe
   segments in answers must agree (the machine checks counts; you check SENSE — does
   each segment actually fit its blank?).
5. **strict flag:** items where fuzzy matching would wrongly accept near-misses
   (minimal pairs like "should/shouldn't"!) need `strict: true` — flag if missing
   (kind `answer-incomplete`, say so in the note).

Flag kind menu: `answer-incomplete`, `answer-ungrammatical`,
`distractor-plausible-correct`. Severity `fix` for anything that would mis-grade a
real student; `warn` for defensible-but-improvable.

## Vocab items (46)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u02.w.attractive | attractive | nice and good to look at | Many people like the way she looks; she is very ___. | attractive (full) | attractive (full) | historical ; common ; excellent |
| g4u02.w.besides | besides | and also; too | I do not want to go out. ___, I have a lot of homework. | besides (full) | besides (full) | right away ; Never mind. ; likely |
| g4u02.w.blackmail | blackmail | the crime of making somebody pay money so you keep their secret | He had to pay money or the ___ would tell everyone his secret. | blackmail (full) | blackmail (full) | murder ; robbery ; mystery |
| g4u02.w.chest | chest | the place where your heart is | The dead man had blood on his ___. | chest (full) | chest (full) | nose ; ear ; shoulder |
| g4u02.w.commit | commit | to do a crime or a bad thing | People who ___ crimes go to prison. | commit (full) | commit (full) ; to commit (full) | prove ; escape ; consider |
| g4u02.w.common | common | that happens very often | Headaches are very ___ when you look at screens too long. | common (full) | common (full) | historical ; personal ; illegal |
| g4u02.w.conclusion | conclusion | a thing you think is true after you look at all the clues | After he looked at all the clues, the detective came to the ___. | conclusion (full) | conclusion (full) ; conclusions (full) | mystery ; suspicion ; report |
| g4u02.w.confusion | confusion | when people do not understand what is happening | There was a lot of ___ at the crime scene. | confusion (full) | confusion (full) | conclusion ; mystery ; suspicion |
| g4u02.w.consider | consider | to think well about a thing before a decision | Before you make a big decision, you must ___ all the clues with care. | consider (full) | consider (full) ; to consider (full) | mention ; prove ; retire |
| g4u02.w.crime-scene | crime scene | the place where a bad thing in the law happened | The police looked for clues at the ___ where the murder happened. | crime scene (full) | crime scene (full) ; crime scenes (full) | investigation ; conclusion ; suspicion |
| g4u02.w.criminal | criminal | a man or woman who does crimes | The ___ for the robbery did the crime at night. | criminal (full) ; criminals (partial) | criminal (full) ; criminals (full) | suspect ; witness ; victim |
| g4u02.w.employee | employee | a man or woman who has a job and money from a boss | Murdoch was at the office with four of his ___. | employees (full) ; employee (partial) | employee (full) ; employees (full) | relative ; criminal ; witness |
| g4u02.w.escape | escape | to get out of a place where you are not free | The thieves ___ from prison at night. | escaped (full) ; escape (partial) | escape (full) ; to escape (full) ; escaped (full) | commit ; prove ; mention |
| g4u02.w.evidence | evidence | a thing that shows what is true | The detective found new ___ at the crime scene: a knife. | evidence (full) | evidence (full) | mystery ; weapon ; conclusion |
| g4u02.w.excellent | excellent | very, very good | The food at the new restaurant was ___; we all loved it. | excellent (full) | excellent (full) | common ; historical ; personal |
| g4u02.w.expect | expect | to think that a thing will happen | We ___ a lot of rain tomorrow because of the forecast. | expect (full) | expect (full) ; to expect (full) | consider ; mention ; prove |
| g4u02.w.get-hold-of-sth | get hold of sth | to find a thing after a lot of work | The book is sold out, but I want to ___ one before school. | get hold of (full) ; get hold of sth (full) ; get hold of something (full) | get hold of sth (full) ; get hold of something (full) ; get hold of (full) | take over ; keep an eye on ; right away |
| g4u02.w.handkerchief | handkerchief | a thing you use to clean your nose | He pulled out a white ___ and cleaned his nose. | handkerchief (full) | handkerchief (full) ; handkerchiefs (full) | weapon ; report ; wastepaper bin |
| g4u02.w.historical | historical | about the past or about old times | We visited many ___ places in Rome, like the old castle. | historical (full) | historical (full) | personal ; common ; illegal |
| g4u02.w.illegal | illegal | not OK in the law; a crime to do | It is ___ to take money from a shop without paying. | illegal (full) | illegal (full) | historical ; personal ; common |
| g4u02.w.investigation | investigation | all the work the police do to find out about a crime | The police did a long ___ to find the thief. | investigation (full) | investigation (full) ; investigations (full) | conclusion ; confusion ; suspicion |
| g4u02.w.keep-an-eye-on | keep an eye on | to look after somebody or a thing with care | Can you ___ my little sister while I cook dinner? | keep an eye on (full) | keep an eye on (full) ; keep an eye on sb (full) ; keep an eye on something (full) | take over ; get hold of sth ; right away |
| g4u02.w.likely | likely | that will probably happen | It is very ___ that it will rain tomorrow. | likely (full) | likely (full) | common ; personal ; historical |
| g4u02.w.mention | mention | to talk or write about a thing for a short time | Did he ___ the witness when he talked to the police? | mention (full) | mention (full) ; to mention (full) | consider ; prove ; retire |
| g4u02.w.murder | murder | the crime of making somebody die | The detective came to the house to look at the ___ of John Murdoch. | murder (full) | murder (full) | blackmail ; robbery ; evidence |
| g4u02.w.mystery | mystery | a thing that nobody can understand | It is a ___ that nobody can understand. | mystery (full) | mystery (full) ; mysteries (full) | report ; conclusion ; evidence |
| g4u02.w.nephew | nephew | the boy in your family who is the child of your sister | My sister had a little boy, so now I have a young ___. | nephew (full) | nephew (full) ; nephews (full) | relative ; employee ; criminal |
| g4u02.w.never-mind | Never mind. | a way to tell somebody not to feel bad | You cannot find it? ___, it is OK. | Never mind (full) ; never mind (full) | Never mind (full) ; never mind (full) ; Never mind. (full) | right away ; besides ; keep an eye on |
| g4u02.w.office-clerk | office clerk | a man or woman who has a job at a desk in a big building | Jasper Ford has a desk job at the office; he is an ___. | office clerk (full) ; office clerks (partial) | office clerk (full) ; office clerks (full) | employee ; relative ; nephew |
| g4u02.w.personal | personal | about one man or woman, not for all | Please do not read my letters; they are ___. | personal (full) | personal (full) | historical ; common ; illegal |
| g4u02.w.prove | prove | to show that a thing is really true | He is the thief, but the police cannot ___ it. | prove (full) | prove (full) ; to prove (full) | mention ; consider ; commit |
| g4u02.w.realise | realise | to come to know or understand a thing for the first time | At last, the police ___ who the thief was. | realised (full) ; realise (partial) ; realized (full) | realise (full) ; to realise (full) ; realize (full) | consider ; mention ; prove |
| g4u02.w.relative | relative | a member of your family | I have a ___ who lives in America; she is my mum's aunt. | relative (full) ; relatives (partial) | relative (full) ; relatives (full) | employee ; nephew ; witness |
| g4u02.w.report | report | a letter or talk about what happened | The teacher asked us to write a ___ about our school day. | report (full) ; reports (partial) | report (full) ; reports (full) | mystery ; evidence ; conclusion |
| g4u02.w.retire | retire | to stop work for good because you are old | My uncle will ___ when he is 65. | retire (full) | retire (full) ; to retire (full) | mention ; consider ; prove |
| g4u02.w.right-away | right away | at once, with no wait | Bring me the report ___, please! | right away (full) | right away (full) | Never mind. ; take over ; keep an eye on |
| g4u02.w.suspect | suspect | a man or woman who the police think did a crime | The police think the ___ for the crime is a man. | suspect (full) ; suspects (partial) | suspect (full) ; suspects (full) | witness ; victim ; criminal |
| g4u02.w.suspicion | suspicion | a feeling that somebody did a bad thing | I have a ___ that John has my book, but I cannot prove it. | suspicion (full) | suspicion (full) ; suspicions (full) | conclusion ; mystery ; evidence |
| g4u02.w.take-over | take over | to begin to have control of a thing or job | When the old boss leaves, Isabel will ___ his job. | take over (full) | take over (full) ; to take over (full) | keep an eye on ; right away ; get hold of sth |
| g4u02.w.to-steal | to steal | to take a thing that is not yours, with no right to it | A thief came in the night to ___ money from the shop. | steal (full) ; to steal (partial) | steal (full) ; to steal (full) | prove ; escape ; mention |
| g4u02.w.unlock | unlock | to open a door or box with a key | Give me the key and I will ___ the door for you. | unlock (full) | unlock (full) ; to unlock (full) | escape ; prove ; commit |
| g4u02.w.upset | upset | sad because a bad thing has happened | When the dog died, the girl was very ___. | upset (full) | upset (full) | attractive ; historical ; common |
| g4u02.w.victim | victim | a man or woman who is hurt in a crime or accident | The ___ of the robbery was hurt in the crime. | victim (full) ; victims (partial) | victim (full) ; victims (full) | suspect ; witness ; criminal |
| g4u02.w.wastepaper-bin | wastepaper bin | a basket for old letters you do not want | He put all the old letters into the ___. | wastepaper bin (full) | wastepaper bin (full) ; wastepaper bins (full) | handkerchief ; weapon ; evidence |
| g4u02.w.weapon | weapon | a thing used to hurt or to make somebody die | The detective put the ___ knife away for the police. | weapon (full) ; weapons (partial) | weapon (full) ; weapons (full) | witness ; report ; conclusion |
| g4u02.w.witness | witness | a man or woman who watches a crime happen | A ___ can tell the police about a crime. | witness (full) ; witnesses (partial) | witness (full) ; witnesses (full) | suspect ; victim ; criminal |

## Grammar items (82)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u02.gi.past-perfect.cp.001 | context-picker | Sarah kam um 19:30 ins Kino. Der Film begann um 19:15. Welcher Satz ist richtig? [de] | When Sarah arrived, the film had already started. (full) | — | When Sarah arrived, the film already started. ; When Sarah arrived, the film has already started. ; When Sarah arrived, the film was already starting. | — | — | false |
| g4u02.gi.past-perfect.cp.002 | context-picker | Der Inspektor kommt ins Büro. Das Fenster ist kaputt und das Geld ist weg. Welcher Satz erklärt die Situation am besten? [de] | Someone had broken the window and stolen the money. (full) | — | Someone has broken the window and stolen the money. ; Someone broke the window and had stolen the money. ; Someone had broke the window and had stole the money. | — | — | false |
| g4u02.gi.past-perfect.cp.004 | context-picker | Du erzählst, was beim Konzert war: Um 20:00 kamt ihr an, das Konzert begann um 19:45. Welcher Satz stimmt? [de] | When we arrived, the concert had already begun. (full) | — | When we arrived, the concert already begun. ; When we had arrived, the concert already began. ; When we arrived, the concert has already begun. | — | — | false |
| g4u02.gi.past-perfect.ec.001 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ When she arrived, everyone already left the party. [de] | When she arrived, everyone had already left the party. (full) ; had already left (partial) | — | — | — | — | false |
| g4u02.gi.past-perfect.ec.002 | error-correction | Genau EIN Wort ist falsch. Verbessere es (had + 3. Form): ⏎  ⏎ He had went to the shop before it closed. [de] | He had gone to the shop before it closed. (full) ; gone (partial) | — | — | — | — | true |
| g4u02.gi.past-perfect.ec.003 | error-correction | Genau EIN Wort ist falsch. Verbessere es (had + 3. Form): ⏎  ⏎ The thief had steal the money before the police arrived. [de] | The thief had stolen the money before the police arrived. (full) ; stolen (partial) | — | — | — | — | true |
| g4u02.gi.past-perfect.ec.005 | error-correction | Ein Wort ist in der falschen Zeit. Verbessere es: ⏎  ⏎ After she has finished the test, she left the classroom. [de] | After she had finished the test, she left the classroom. (full) ; had (partial) | — | — | — | — | true |
| g4u02.gi.past-perfect.ec.006 | error-correction | Genau EIN Wort ist falsch. Verbessere es (had + 3. Form): ⏎  ⏎ She had wrote a long letter to her friend. [de] | She had written a long letter to her friend. (full) ; written (partial) | — | — | — | — | true |
| g4u02.gi.past-perfect.ec.009 | error-correction | Genau EIN Wort ist falsch. Verbessere es (had + 3. Form): ⏎  ⏎ The burglars had took everything from the room. [de] | The burglars had taken everything from the room. (full) ; taken (partial) | — | — | — | — | true |
| g4u02.gi.past-perfect.ec.010 | error-correction | Eine Handlung steht in der falschen Zeit. Nur das Frühere darf had + 3. Form sein: ⏎  ⏎ The police arrived quickly, but the criminal had escaped and had run away. [de] | The police arrived quickly, but the criminal had escaped and run away. (full) ; The police arrived quickly, but the criminal escaped and ran away. (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.ec.011 | error-correction | Genau EIN Wort ist falsch. Verbessere es (had + 3. Form): ⏎  ⏎ Nobody had drank the water before the test. [de] | Nobody had drunk the water before the test. (full) ; drunk (partial) | — | — | — | — | true |
| g4u02.gi.past-perfect.ec.013 | error-correction | Eine Handlung steht in der falschen Zeit. Nur das Frühere darf had + 3. Form sein: ⏎  ⏎ I had eaten breakfast and then I had walked to school. [de] | I had eaten breakfast and then I walked to school. (full) ; I had eaten breakfast and then I went to school. (full) ; walked (partial) | — | — | — | — | false |
| g4u02.gi.past-perfect.ec.014 | error-correction | Die falsche Handlung steht mit had + der 3. Form. Dreh es um, damit die Reihenfolge stimmt: ⏎  ⏎ When the concert had started, we arrived at the hall. [de] | When we arrived at the hall, the concert had already started. (full) ; The concert had already started when we arrived at the hall. (full) ; When we arrived at the hall, the concert had started. (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.ec.015 | error-correction | Die frühere Handlung fehlt mit had + der 3. Form. Verbessere den Satz: ⏎  ⏎ When I arrived, everyone left. [de] | When I arrived, everyone had left. (full) ; had left (partial) | — | — | — | — | true |
| g4u02.gi.past-perfect.ec.016 | error-correction | Die frühere Handlung fehlt mit had + der 3. Form. Verbessere den Satz: ⏎  ⏎ By the time we got there, the shop closed. [de] | By the time we got there, the shop had closed. (full) ; had closed (partial) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.001 | gap-fill | Setze die Handlung ein, die noch FRÜHER passiert war (had + die 3. Form): ⏎  ⏎ Nobody was in the building. All the employees ___ (leave). [de, 1 blank(s)] | had left (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.002 | gap-fill | Fülle die Lücke mit had + der 3. Form: ⏎  ⏎ When we arrived at the cinema, the film ___ (start). [de, 1 blank(s)] | had started (full) ; had already started (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.003 | gap-fill | Verneinte Form – setze had + not + die 3. Form ein: ⏎  ⏎ She was tired because she ___ (not / sleep) well the night before. [de, 1 blank(s)] | hadn't slept (full) ; had not slept (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.004 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ By the time we got to the station, the train ___ (leave). [de, 1 blank(s)] | had left (full) ; had already left (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.005 | gap-fill | Setze had + never + die 3. Form ein: ⏎  ⏎ I ___ never ___ (see) snow before I visited Austria. [de, 2 blank(s)] | had \| seen (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.006 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ After she ___ (finish) her homework, she went out to play. [de, 1 blank(s)] | had finished (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.008 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ When we got to the restaurant, our friends ___ already ___ (order). [de, 2 blank(s)] | had \| ordered (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.009 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ The thief couldn't get into the office because Mr Morris ___ (lock) the door. [de, 1 blank(s)] | had locked (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.010 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ The police were sure it was one of the suspects, because all the other employees ___ (leave) the building. [de, 1 blank(s)] | had left (full) ; had already left (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.011 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ The detective knew the criminal ___ (escape) through the window, because the glass ___ (be) broken. [de, 2 blank(s)] | had escaped \| was (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.012 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ When we arrived, the train ___ already ___ (leave). [de, 2 blank(s)] | had \| left (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.013 | gap-fill | Bilde eine Frage mit had: ⏎  ⏎ ___ she ___ (finish) the report before the office closed? [de, 2 blank(s)] | Had \| finished (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.015 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ Dad was angry because the dog ___ (eat) the chicken. [de, 1 blank(s)] | had eaten (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.016 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ He knew he ___ (see) her face before. [de, 1 blank(s)] | had seen (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.017 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ The party was a big surprise because no one ___ (tell) her about it. [de, 1 blank(s)] | had told (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.018 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ When the inspector came home, he saw that the thieves ___ (take) everything. [de, 1 blank(s)] | had taken (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.019 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ The match ___ already ___ (begin) when we came home. [de, 2 blank(s)] | had \| begun (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.020 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ She couldn't pay because she ___ (forget) her wallet at home. [de, 1 blank(s)] | had forgotten (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.024 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ I was really nervous because I ___ never ___ (fly) in a plane before. [de, 2 blank(s)] | had \| flown (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.025 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ Mr Davis had my phone because I ___ (leave) it in his classroom. [de, 1 blank(s)] | had left (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.027 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ The room was a mess. Someone ___ (break) the window during the night. [de, 1 blank(s)] | had broken (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.028 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ The detective was sure that the criminal ___ (hide) the weapon somewhere. [de, 1 blank(s)] | had hidden (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.030 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ The inspector was happy because he ___ (solve) the crime. [de, 1 blank(s)] | had solved (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.031 | gap-fill | Setze had + die 3. Form ein: ⏎  ⏎ The two women were found dead. Nobody ___ (take) any money. [de, 1 blank(s)] | had taken (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.034 | gap-fill | 2. Form oder had + 3. Form? Setze beide Verben richtig ein: ⏎  ⏎ I ___ (be) starving because I ___ (not / eat) since breakfast. [de, 2 blank(s)] | was \| hadn't eaten (full) ; was \| had not eaten (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.035 | gap-fill | 2. Form oder had + 3. Form? Setze beide Verben ein: ⏎  ⏎ We ___ (leave) early because we ___ (not / see) the film before. [de, 2 blank(s)] | left \| hadn't seen (full) ; left \| had not seen (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.036 | gap-fill | 2. Form oder had + 3. Form? Setze beide Verben ein: ⏎  ⏎ I ___ (not / recognise) her because she ___ (have) a haircut. [de, 2 blank(s)] | didn't recognise \| had had (full) ; did not recognise \| had had (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.037 | gap-fill | 2. Form oder had + 3. Form? Setze beide Verben ein: ⏎  ⏎ When I ___ (come) home, I ___ (see) that the burglars had taken everything. [de, 2 blank(s)] | came \| saw (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.038 | gap-fill | 2. Form oder had + 3. Form? Setze beide Verben ein: ⏎  ⏎ They ___ (be) upset with Emma because she ___ (forget) the meeting. [de, 2 blank(s)] | were \| had forgotten (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.039 | gap-fill | Frühere Handlung mit had + der 3. Form, spätere im 2. Form: ⏎  ⏎ He realised he ___ (leave) his keys at home, so he ___ (go) back. [de, 2 blank(s)] | had left \| went (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gf.040 | gap-fill | Frühere Handlung mit had + der 3. Form, spätere im 2. Form: ⏎  ⏎ The lights went out because the family ___ (not / pay) the electricity bill. [de, 1 blank(s)] | hadn't paid (full) ; had not paid (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.gs.003 | group-sort | Welche Sätze benutzen had + die 3. Form richtig, welche nicht? [de] | — | — | — | — | ✓: She had taken the keys., The thief had escaped., They had eaten dinner. \| ✗: She had took the keys., The thief had escape., They had ate dinner. | false |
| g4u02.gi.past-perfect.gs.005 | group-sort | In welchen Sätzen steht die FRÜHERE Handlung richtig mit had + der 3. Form, in welchen ist die Zeit falsch gewählt? [de] | — | — | — | — | ✓: When we arrived, the film had started., He was sad because he had lost his keys., After she had locked the door, she left. \| ✗: When we had arrived, the film started., He was sad because he has lost his keys., After she had locked the door, she had left. | false |
| g4u02.gi.past-perfect.mc.001 | multiple-choice | Welche Form passt? Es geht um die Handlung, die noch FRÜHER war: ⏎  ⏎ The detective came to the office. The thief ___. [de, 1 blank(s)] | had already left (full) | — | already left ; has already left ; was already leaving | — | — | false |
| g4u02.gi.past-perfect.mc.002 | multiple-choice | Detective Brown befragt einen Zeugen über letzte Nacht. Welcher Satz zeigt richtig, was ZUERST passiert ist? [de] | When I got home, my sister had already eaten dinner. (full) | — | When I got home, my sister already ate dinner. ; When I had got home, my sister already ate dinner. ; When I got home, my sister has already eaten dinner. | — | — | false |
| g4u02.gi.past-perfect.mc.003 | multiple-choice | In welchem Satz ist die 3. Form FALSCH gebildet? [de] | I had went to the office before it closed. (full) | — | She had written the report before the meeting. ; They had eaten breakfast before leaving. ; We had taken the wrong train. | — | — | false |
| g4u02.gi.past-perfect.mc.006 | multiple-choice | Ein Satz hat eine FALSCHE 3. Form. Welcher? [de] | She had drinked all the orange juice before breakfast. (full) | — | They had spoken to the teacher before the lesson. ; He had driven to the airport before the lesson. ; I had chosen my clothes the night before. | — | — | false |
| g4u02.gi.past-perfect.mc.007 | multiple-choice | Wähle die richtige Form für die frühere Handlung: ⏎  ⏎ After the rain ___, the children went outside. [de, 1 blank(s)] | had stopped (full) | — | stopped ; has stopped ; was stopping | — | — | false |
| g4u02.gi.past-perfect.mc.008 | multiple-choice | Welche 3. Form von steal ist richtig? ⏎  ⏎ The police were sure the thief ___ the money. [de, 1 blank(s)] | had stolen (full) | — | had stole ; had stealed ; has stolen | — | — | false |
| g4u02.gi.past-perfect.mc.009 | multiple-choice | Welche Form passt für die frühere Handlung? ⏎  ⏎ The room was empty. Everyone ___. [de, 1 blank(s)] | had gone (full) | — | had go ; had went ; has gone | — | — | false |
| g4u02.gi.past-perfect.mc.010 | multiple-choice | Wähle die richtige Form. Der Grund liegt FRÜHER als die Folge: ⏎  ⏎ The witness was nervous because she ___ a crime. [de, 1 blank(s)] | had seen (full) | — | had saw ; has seen ; had see | — | — | false |
| g4u02.gi.past-perfect.mc.011 | multiple-choice | Welche Form passt für die frühere Handlung? ⏎  ⏎ The inspector was happy because he ___ the report. [de, 1 blank(s)] | had read (full) | — | has read ; had reads ; was read | — | — | false |
| g4u02.gi.past-perfect.mc.014 | multiple-choice | Welche Reihenfolge stimmt? Wähle die richtige Mischung aus 2. Form und had + 3. Form: ⏎  ⏎ Before I ___ to bed, I ___ my teeth. [de, 2 blank(s)] | went \| had brushed (full) | — | had gone \| brushed ; went \| brushed ; had gone \| had brushed | — | — | false |
| g4u02.gi.past-perfect.mc.015 | multiple-choice | Welcher Satz macht am deutlichsten klar, dass Tom seine Schlüssel ZUERST verloren hat und DANN verärgert war? [de] | Tom was upset because he had lost his keys. (full) | — | Tom was upset because he lost his keys. ; Tom was upset because he has lost his keys. ; Tom had been upset because he lost his keys. | — | — | false |
| g4u02.gi.past-perfect.mc.016 | multiple-choice | Nur EIN Satz benutzt had + die 3. Form richtig für die frühere Handlung. Welcher? [de] | The victim had locked the door before he died. (full) | — | The victim locked the door before he had died. ; The victim had lock the door before he died. ; The victim has locked the door before he died. | — | — | false |
| g4u02.gi.past-perfect.mp.002 | matching-pairs | Finde zu jeder einfachen Form die richtige 3. Form. [de] | — | — | — | steal ↔ stolen ; take ↔ taken ; write ↔ written ; drink ↔ drunk ; see ↔ seen ; go ↔ gone | — | false |
| g4u02.gi.past-perfect.mt.001 | matching | Verbinde jeden Satzanfang mit dem passenden Ende. [de] | — | — | — | By the time the inspector arrived, ↔ the thief had already escaped. ; Mr Morris wasn't worried because ↔ he had locked the door of his office. ; She was happy because ↔ she had passed all her exams. ; The dog was hungry because ↔ nobody had given it any food. ; He couldn't pay because ↔ he had forgotten his wallet at home. | — | false |
| g4u02.gi.past-perfect.mt.002 | matching | Verbinde jeden Anfang mit dem passenden Ende. [de] | — | — | — | We were tired ↔ because we hadn't slept for hours. ; I couldn't buy the book ↔ because I had spent all my money on sweets. ; We missed the train ↔ because we had taken too long to get ready. ; Mum took us to a restaurant ↔ because she had got a new job. | — | false |
| g4u02.gi.past-perfect.qf.003 | question-formation | Bilde eine Frage mit had + der 3. Form aus den Stichwörtern: ⏎  ⏎ the suspect / leave / before the police arrived ? [de] | Had the suspect left before the police arrived? (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.qf.004 | question-formation | Bilde eine Frage mit had + der 3. Form aus den Stichwörtern: ⏎  ⏎ the employees / lock / the office / before they went home ? [de] | Had the employees locked the office before they went home? (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.sb.001 | sentence-building | Bring die Wörter in die richtige Reihenfolge: ⏎  ⏎ had / the / already / she / book / read / before / the / film / she / watched [de] | She had already read the book before she watched the film. (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.sb.002 | sentence-building | Bring die Wörter in die richtige Reihenfolge: ⏎  ⏎ the / train / had / when / left / we / arrived / at / the / station / already [de] | The train had already left when we arrived at the station. (full) ; When we arrived at the station, the train had already left. (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.sb.003 | sentence-building | Bring die Wörter in die richtige Reihenfolge: ⏎  ⏎ the / thief / had / before / escaped / the / police / arrived [de] | The thief had escaped before the police arrived. (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.sb.004 | sentence-building | Bring die Wörter in die richtige Reihenfolge: ⏎  ⏎ by / the / time / the / police / came / the / thief / had / gone [de] | By the time the police came, the thief had gone. (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.tf.003 | transformation | Zwei Dinge sind gestern passiert. Zuerst: deine Schwester kaufte ein. Danach: du kamst heim. Verbinde sie mit 'when': ⏎  ⏎ 'When I ___ (come) home, my sister ___ already ___ (do) the shopping.' [de, 3 blank(s)] | came \| had \| done (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.tf.004 | transformation | Du schreibst eine Geschichte. Zuerst: es hörte auf zu regnen. Danach: die Kinder gingen raus. Verbinde mit 'as soon as': ⏎  ⏎ 'As soon as it ___ (stop) raining, the children ___ (go) outside.' [de, 2 blank(s)] | had stopped \| went (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.tf.008 | transformation | Erzähl es dem Detektiv. Setze die Verben richtig ein (had + 3. Form bzw. 2. Form): ⏎  ⏎ 'When I ___ (arrive) at the station, the train ___ already ___ (leave).' [de, 3 blank(s)] | arrived \| had \| left (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.tf.009 | transformation | Beschreibe Emmas Abend. Setze die Verben ein (had + 3. Form bzw. 2. Form): ⏎  ⏎ 'After she ___ (finish) her homework, she ___ (go) out to meet her friends.' [de, 2 blank(s)] | had finished \| went (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.tf.010 | transformation | Setze die Verben richtig ein (had + 3. Form bzw. 2. Form): ⏎  ⏎ By the time we ___ (get) to the airport, the plane ___ already ___ (take off). [de, 3 blank(s)] | got \| had \| taken off (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.tf.011 | transformation | Forme den Satz um, sodass die frühere Handlung mit had + der 3. Form steht. Beginne mit 'Because': ⏎  ⏎ The dog was hungry. It did not eat all day. ⏎ → 'The dog was hungry because it ___ (not / eat) all day.' [de, 1 blank(s)] | hadn't eaten (full) ; had not eaten (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.tf.012 | transformation | Mach aus den zwei Sätzen einen. Die frühere Handlung kommt mit had + die 3. Form (had + 3. Form): ⏎  ⏎ First: The witness saw the thief. Then: she called the police. ⏎ → 'After the witness ___ (see) the thief, she ___ (call) the police.' [de, 2 blank(s)] | had seen \| called (full) | — | — | — | — | false |
| g4u02.gi.past-perfect.tr.001 | translation | Übersetze ins Englische: ⏎  ⏎ Als wir ankamen, hatte der Film schon angefangen. [de] | When we arrived, the film had already started. (full) ; When we arrived, the film had already begun. (full) ; The film had already started when we arrived. (full) ; When we arrived, the film had started. (partial) | deToEn | — | — | — | false |
| g4u02.gi.past-perfect.tr.002 | translation | Übersetze ins Englische: ⏎  ⏎ Er war müde, weil er nicht gut geschlafen hatte. [de] | He was tired because he hadn't slept well. (full) ; He was tired because he had not slept well. (full) | deToEn | — | — | — | false |
| g4u02.gi.past-perfect.tr.003 | translation | Übersetze ins Englische: ⏎  ⏎ Nachdem er seine Hausaufgaben gemacht hatte, ging er in den Park. [de] | After he had done his homework, he went to the park. (full) ; After he had finished his homework, he went to the park. (full) ; He went to the park after he had done his homework. (full) | deToEn | — | — | — | false |
| g4u02.gi.past-perfect.tr.004 | translation | Übersetze ins Englische: ⏎  ⏎ Die Polizei wusste, dass der Dieb durch das Fenster entkommen war. [de] | The police knew that the thief had escaped through the window. (full) ; The police knew the thief had escaped through the window. (full) | deToEn | — | — | — | false |
| g4u02.gi.past-perfect.tr.005 | translation | Übersetze ins Englische: ⏎  ⏎ Die Diebe hatten alles gestohlen. [de] | The thieves had stolen everything. (full) | deToEn | — | — | — | false |
| g4u02.gi.past-perfect.tr.006 | translation | Übersetze ins Englische: ⏎  ⏎ Der Zeuge war nervös, weil er ein Verbrechen gesehen hatte. [de] | The witness was nervous because he had seen a crime. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u02/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u02",
  "lens": "answers",
  "itemsHash": "b209f975f67d",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 128, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
