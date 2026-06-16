# Verify lens — answers — g4-u03 (round 1)

<!-- domigo:verify answers g4-u03 items=369ba6e44c94 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (32)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u03.w.announcement | announcement | when a voice gives people the times at a station or an airport | An ___ at the airport gives people the times of every plane. | announcement (full) | announcement (full) ; announcements (full) | statement ; campaign ; treatment |
| g4u03.w.be-in-trouble | be in trouble | to be in a bad spot because you did a bad thing | If you do not do your homework, you will ___ with the teacher. | be in trouble (full) | be in trouble (full) ; in trouble (full) | collide ; evacuate ; explode |
| g4u03.w.become-desperate | become desperate | to feel that there is no help and a bad time will not end | After three days with no food, the people start to ___. | become desperate (full) | become desperate (full) ; became desperate (full) | collide ; evacuate ; blow up |
| g4u03.w.blow-up | blow up | to break into many pieces with great power and fire | The engine catches fire and could ___ at any time. | blow up (full) | blow up (full) ; blew up (full) | collide ; evacuate ; glide down |
| g4u03.w.bravery | bravery | the way a brave child is when there is a fire or a storm | The captain shows great ___ when he lands the plane on the river. | bravery (full) | bravery (full) ; courage (partial) | treatment ; miracle ; statement |
| g4u03.w.busy | busy | a place with many people and many cars | New York is one of the ___ cities in the world. | busy (full) ; busiest (full) | busy (full) | modern ; famous ; nearby |
| g4u03.w.campaign | campaign | a lot of work that many people do for one cause | Our school begins a ___ to raise money for children in need. | campaign (full) ; campaigns (partial) | campaign (full) | statement ; treatment ; origin |
| g4u03.w.charge | charge | to ask people for money for a thing | How much do they ___ for a ticket to the show? | charge (full) | charge (full) | evacuate ; collide ; reward sb |
| g4u03.w.collide | collide | to crash into a thing with great power | The two cars ___ because neither driver wants to stop. | collide (full) ; collided (partial) | collide (full) ; collided (full) | evacuate ; explode ; glide down |
| g4u03.w.critic | critic | a child who writes about books and shows and gives an opinion about them | A famous ___ writes that the new show is too long and not fun. | critic (full) ; critics (partial) | critic (full) ; critics (full) | immigrant ; native ; statement |
| g4u03.w.crowd-funding | crowd-funding | a way for a band to ask very many people for a little money online | The band uses ___ to raise the money for their first record. | crowd-funding (full) ; crowdfunding (full) | crowd-funding (full) ; crowdfunding (full) | campaign ; statement ; treatment |
| g4u03.w.cuisine | cuisine | the food and the way people cook in a country | This food is from Italy, and I love Italian ___. | cuisine (full) | cuisine (full) | origin ; treatment ; campaign |
| g4u03.w.elevator | elevator (AE) | a machine that brings people up and down in a tall building | We use the ___ to go up and down in a tall building. | elevator (full) ; elevators (partial) ; lift (partial) | elevator (full) ; elevators (full) ; lift (partial) | runway ; statement ; campaign |
| g4u03.w.emergency-landing | emergency landing | when a plane has to come down fast because the engine does not work | The engine does not work, so the plane has to make an ___. | emergency landing (full) | emergency landing (full) ; emergency landings (full) | rescue boat ; runway ; takeoff |
| g4u03.w.evacuate | evacuate | to bring all the people out of a building to a place where nothing can hurt them | The police have to ___ the building when there is a fire inside. | evacuate (full) | evacuate (full) ; evacuated (full) | collide ; explode ; blow up |
| g4u03.w.explode | explode | to break open fast and with great power | When there is too much fire inside the engine, it can ___. | explode (full) ; exploded (partial) | explode (full) ; exploded (full) | collide ; evacuate ; glide down |
| g4u03.w.flock-of-birds | flock of birds | a big group of them up in the sky | A huge ___ flies high across the sky over the city. | flock of birds (full) | flock of birds (full) ; flock (partial) | rescue boat ; runway ; wing |
| g4u03.w.glide-down | glide down | to move to the ground with no noise, like a plane with no power | We watch the plane ___ in a slow way towards the river. | glide down (full) | glide down (full) | collide ; evacuate ; blow up |
| g4u03.w.immigrant | immigrant | a man or a woman who comes to a new country to live there | Many people who came to America to live there were ___ from Europe. | immigrants (full) ; immigrant (partial) | immigrant (full) ; immigrants (full) | native ; critic ; origin |
| g4u03.w.miracle | miracle | a very amazing thing that you cannot understand | It would be a ___ for this hospital to find a cure so fast. | miracle (full) | miracle (full) ; miracles (full) | bravery ; statement ; treatment |
| g4u03.w.native | native | from the place where you are from at the start; from this place | The ___ Americans lived here a long time before the city was here. | native (full) | native (full) | busy ; famous ; nearby |
| g4u03.w.nearby | nearby | not far away; close to you | We were very hungry, so we were happy to find a restaurant ___. | nearby (full) | nearby (full) | busy ; native ; modern |
| g4u03.w.on-duty | on duty | at work right now and in charge of a job | The doctor is ___ at the hospital all night and cannot leave. | on duty (full) | on duty (full) | nearby ; busy ; native |
| g4u03.w.origin | origin | the place a thing is from at the start | This dish is from France, so it is of French ___. | origin (full) ; origins (partial) | origin (full) | cuisine ; treatment ; bravery |
| g4u03.w.politics | politics | the work of the government and the way a country is run | My uncle loves ___ and always watches the news about the government. | politics (full) | politics (full) | bravery ; cuisine ; origin |
| g4u03.w.rescue-boat | rescue boat | a small ship that comes to help people at sea | The people in the river wait for a ___ to reach them. | rescue boat (full) ; rescue boats (partial) | rescue boat (full) ; rescue boats (full) | runway ; wing ; takeoff |
| g4u03.w.reward-sb | reward sb | to give a child a present because they did good work | The teacher wants to ___ the children with a free day for their good work. | reward (full) | reward sb (full) ; reward (full) | evacuate ; collide ; explode |
| g4u03.w.runway | runway | a long road at an airport where planes go up and down | The plane waits on the ___ for a short time before takeoff. | runway (full) ; runways (partial) | runway (full) | takeoff ; wing ; rescue boat |
| g4u03.w.statement | statement | what you tell the police about what happened | The witness gives a ___ to the police about the crime. | statement (full) ; statements (partial) | statement (full) | announcement ; campaign ; treatment |
| g4u03.w.takeoff | takeoff | the start of a flight, when a plane leaves the ground | I always feel nervous during ___ because the plane shakes a little. | takeoff (full) ; take-off (full) ; take off (partial) | takeoff (full) ; take-off (full) | runway ; rescue boat ; emergency landing |
| g4u03.w.treatment | treatment | the help a doctor gives to a sick or hurt child | The doctor gives her ___ for the injury on her leg. | treatment (full) ; treatments (partial) | treatment (full) ; treatments (full) | bravery ; miracle ; statement |
| g4u03.w.wing | wing | a long thing on a plane that it uses to fly | One ___ of the plane was hurt in the crash. | wing (full) ; wings (partial) | wing (full) ; wings (full) | runway ; rescue boat ; takeoff |

## Grammar items (73)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u03.gi.reported-speech-statements.ag.001 | anagram | Du gibst wieder, was jemand gesagt hat — MIT einer Person danach (… me). Lösungswort aus t-o-l-d. [de] | told (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.ag.002 | anagram | Du gibst wieder, was jemand gesagt hat — OHNE Person danach (… that …). Lösungswort aus s-a-i-d. [de] | said (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.ec.001 | error-correction | He said that he likes music. [en] | He said that he liked music. (full) ; He said he liked music. (full) ; liked (partial) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.ec.002 | error-correction | She said me that she was hungry. [en] | She told me that she was hungry. (full) ; She told me she was hungry. (full) ; She said that she was hungry. (partial) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.ec.003 | error-correction | She told that she was going home. [en] | She said that she was going home. (full) ; She told me that she was going home. (full) ; She told us that she was going home. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.ec.004 | error-correction | He said he can't come to the concert. [en] | He said he couldn't come to the concert. (full) ; He said he could not come to the concert. (full) ; He said that he couldn't come to the concert. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.ec.005 | error-correction | He said he will visit us the day after. [en] | He said he would visit us the day after. (full) ; He said that he would visit us the day after. (full) ; would (partial) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.ec.006 | error-correction | She said she is reading a book. [en] | She said she was reading a book. (full) ; She said that she was reading a book. (full) ; was (partial) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.ec.007 | error-correction | Harten said Sully that runway 1 was free. [en] | Harten told Sully that runway 1 was free. (full) ; Harten said to Sully that runway 1 was free. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.ec.008 | error-correction | They said they are waiting for the train. [en] | They said they were waiting for the train. (full) ; They said that they were waiting for the train. (full) ; were (partial) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.001 | gap-fill | "I am tired." — He said that he ___ tired. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.002 | gap-fill | "I am hungry." — She said that she ___ hungry. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.003 | gap-fill | "I am busy." — He said that he ___ busy. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.004 | gap-fill | "I like pizza, but I don't eat it very often." — He said that he ___ pizza, but he ___ it very often. [en, 2 blank(s)] | liked \| didn't eat (full) ; liked \| did not eat (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.005 | gap-fill | "I am reading a great book." — She said that she ___ reading a great book. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.006 | gap-fill | "We don't want to leave." — They said that they ___ want to leave. [en, 1 blank(s)] | didn't (full) ; did not (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.007 | gap-fill | "We can't make the runway." — Sully said that they ___ make the runway. [en, 1 blank(s)] | couldn't (full) ; could not (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.008 | gap-fill | "We will land on the river." — Sully said that they ___ land on the river. [en, 1 blank(s)] | would (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.009 | gap-fill | "I must land the plane on the river." — Sully said that he ___ ___ land the plane on the river. [en, 2 blank(s)] | had \| to (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.010 | gap-fill | "I can swim very well." — She said that she ___ swim very well. [en, 1 blank(s)] | could (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.011 | gap-fill | "I saw a good film yesterday." — He ___ me that he ___ a good film the day before. [en, 2 blank(s)] | told \| had seen (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.012 | gap-fill | "We can come to your party tomorrow." — They said that they ___ come to ___ party the day after. [en, 2 blank(s)] | could \| my (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.013 | gap-fill | "I'm going to visit my grandmother tomorrow." — She said that she ___ going to visit ___ grandmother the day after. [en, 2 blank(s)] | was \| her (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.014 | gap-fill | "I have already eaten lunch." — He told me that he ___ already ___ lunch. [en, 2 blank(s)] | had \| eaten (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.015 | gap-fill | "I have never been to London." — She said that she ___ never ___ to London. [en, 2 blank(s)] | had \| been (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.016 | gap-fill | "I bought this book here last week." — She said that she had bought ___ book ___ the week before. [en, 2 blank(s)] | that \| there (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.017 | gap-fill | "We were waiting for the train yesterday." — They said that they ___ been waiting for the train the day ___. [en, 2 blank(s)] | had \| before (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.018 | gap-fill | (said / told?) He ___ me that he was at the airport. — She ___ that she was busy. [en, 2 blank(s)] | told \| said (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.019 | gap-fill | "We have lost power in both engines." — Sully ___ Harten that they ___ ___ power in both engines. [en, 3 blank(s)] | told \| had \| lost (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.020 | gap-fill | (said / told?) She ___ me that the museum was closed. [en, 1 blank(s)] | told (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.021 | gap-fill | "I can't come." — He said that he ___ come. [en, 1 blank(s)] | couldn't (full) ; could not (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.022 | gap-fill | "I will be there before nine." — Olivia said that she ___ be there before nine. [en, 1 blank(s)] | would (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.023 | gap-fill | "I gave the keys to the teacher." — Ron said that he ___ given the keys to the teacher. [en, 1 blank(s)] | had (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.024 | gap-fill | "I want an ice cream." — He said that he ___ an ice cream. [en, 1 blank(s)] | wanted (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.025 | gap-fill | "I am going there this week." — He said that he was going there ___ week. [en, 1 blank(s)] | that (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.026 | gap-fill | (said / told?) Mary ___ us that she was going to New York. [en, 1 blank(s)] | told (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gf.027 | gap-fill | (said / told?) Peter ___ that he would be busy. [en, 1 blank(s)] | said (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.gs.003 | group-sort | Sortiere: Ist die Zeit richtig nach hinten verschoben? [de] | — | — | — | — | ✓: He said that he was tired., She said that she lived there., They said that they could come. \| ✗: He said that he is tired., She said that she lives there., They said that they can come. | false |
| g4u03.gi.reported-speech-statements.gs.004 | group-sort | Sortiere: Ist das Wort für "sagen" (said/told) richtig verwendet? [de] | — | — | — | — | ✓: He said that he was busy., She told me that she was busy., They said that they were tired. \| ✗: He said me that he was busy., She told that she was busy., They said me that they were tired. | false |
| g4u03.gi.reported-speech-statements.gs.005 | group-sort | Sortiere die Sätze nach dem passenden Wort für "sagen" (said/told). [de] | — | — | — | — | said: He said that he was tired., She said that she lived there., They said that they were busy. \| told: He told me that he was tired., She told us that she lived there., They told me that they were busy. | false |
| g4u03.gi.reported-speech-statements.mc.001 | multiple-choice | "I'm tired." — He said that he ___ tired. [en, 1 blank(s)] | was (full) | — | is ; were ; are | — | — | false |
| g4u03.gi.reported-speech-statements.mc.002 | multiple-choice | "I can drive a car." — She said that she ___ drive a car. [en, 1 blank(s)] | could (full) | — | can ; would ; did | — | — | false |
| g4u03.gi.reported-speech-statements.mc.003 | multiple-choice | "I will help you." — She told me that she ___ help me. [en, 1 blank(s)] | would (full) | — | will ; could ; can | — | — | false |
| g4u03.gi.reported-speech-statements.mc.005 | multiple-choice | "I am studying." — She said that she ___ studying. [en, 1 blank(s)] | was (full) | — | is ; were ; are | — | — | false |
| g4u03.gi.reported-speech-statements.mc.006 | multiple-choice | "I am leaving now." — She said that she ___ leaving ___. [en, 2 blank(s)] | was \| then (full) | — | is \| then ; was \| now ; were \| then | — | — | false |
| g4u03.gi.reported-speech-statements.mc.007 | multiple-choice | "I am reading this book here." — He said that he was reading ___ book ___. [en, 2 blank(s)] | that \| there (full) | — | this \| here ; that \| here ; this \| there | — | — | false |
| g4u03.gi.reported-speech-statements.mc.008 | multiple-choice | "We have visited New York." — They said that they ___ visited New York. [en, 1 blank(s)] | had (full) | — | have ; has ; were | — | — | false |
| g4u03.gi.reported-speech-statements.mc.009 | multiple-choice | "I live here." — He said that he lived ___. [en, 1 blank(s)] | there (full) | — | here ; that ; then | — | — | false |
| g4u03.gi.reported-speech-statements.mc.010 | multiple-choice | "I must go now." — He said that he ___ go then. [en, 1 blank(s)] | had to (full) | — | could ; had ; has to | — | — | false |
| g4u03.gi.reported-speech-statements.mp.001 | matching-pairs | Ordne jeder Gegenwartsform die Form zu, die sie beim Wiedergeben bekommt. [de] | — | — | — | like ↔ liked ; want ↔ wanted ; can ↔ could ; will ↔ would ; must ↔ had to ; is ↔ was | — | false |
| g4u03.gi.reported-speech-statements.mt.001 | matching | Ordne jedem Wort die Form zu, die es beim Wiedergeben bekommt. [de] | — | — | — | like ↔ liked ; will ↔ would ; can ↔ could ; is ↔ was | — | false |
| g4u03.gi.reported-speech-statements.mt.002 | matching | Ordne jedem Zeit- oder Ortswort die Form zu, die es beim Wiedergeben bekommt. [de] | — | — | — | today ↔ that day ; yesterday ↔ the day before ; tomorrow ↔ the day after ; last week ↔ the week before ; here ↔ there | — | false |
| g4u03.gi.reported-speech-statements.qf.001 | question-formation | Gib den ganzen Satz wieder. Beginne mit: He told me ... — "I have lost my book." [de] | He told me that he had lost his book. (full) ; He told me he had lost his book. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.qf.002 | question-formation | Gib den ganzen Satz wieder. Beginne mit: Sully told Harten ... — "We will land on the Hudson." [de] | Sully told Harten that they would land on the Hudson. (full) ; Sully told Harten they would land on the Hudson. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.sb.001 | sentence-building | said / he / liked / that / she / chocolate [en] | He said that she liked chocolate. (full) ; He said she liked chocolate. (partial) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.sb.003 | sentence-building | the / teacher / said / that / had / we / to / study / more [en] | The teacher said that we had to study more. (full) ; The teacher said we had to study more. (partial) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.sb.004 | sentence-building | told / me / would / she / help / that / she / me [en] | She told me that she would help me. (full) ; She told me she would help me. (partial) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.001 | transformation | "I am tired." → Anna said that she ___ (be) tired. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.002 | transformation | "Sarah is studying English at a new school." → Tom told me that Sarah ___ (study) English at a new school. [en, 1 blank(s)] | was studying (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.003 | transformation | "We can't come to the party." → They said that they ___ (can / not) come to the party. [en, 1 blank(s)] | couldn't (full) ; could not (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.004 | transformation | "You must do your homework." → The teacher told us that we ___ (must) do our homework. [en, 1 blank(s)] | had to (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.005 | transformation | "We will land on the river." → Sully said that they ___ (will) land on the river. [en, 1 blank(s)] | would (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.006 | transformation | Gib den ganzen Satz wieder. Beginne mit: She said ... — "I live here." [de] | She said that she lived there. (full) ; She said she lived there. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.007 | transformation | Gib den ganzen Satz wieder. Beginne mit: He told me ... — "I saw a good film yesterday." [de] | He told me that he had seen a good film the day before. (full) ; He told me he had seen a good film the day before. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.008 | transformation | Gib den ganzen Satz wieder. Beginne mit: Lisa said ... — "I don't have any homework today." [de] | Lisa said that she didn't have any homework that day. (full) ; Lisa said she didn't have any homework that day. (full) ; Lisa said that she did not have any homework that day. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.009 | transformation | Gib den ganzen Satz wieder. Beginne mit: Sully told Harten ... — "We can't make runway 1." [de] | Sully told Harten that they couldn't make runway 1. (full) ; Sully told Harten they couldn't make runway 1. (full) ; Sully told Harten that they could not make runway 1. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.010 | transformation | Gib den ganzen Satz wieder. Beginne mit: Skiles told Sully ... — "You have done something special." [de] | Skiles told Sully that he had done something special. (full) ; Skiles told Sully he had done something special. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tf.011 | transformation | Gib den ganzen Satz wieder. Beginne mit: Mum said ... — "You are going to miss the train." [de] | Mum said that I was going to miss the train. (full) ; Mum said I was going to miss the train. (full) | — | — | — | — | false |
| g4u03.gi.reported-speech-statements.tr.001 | translation | Er sagte, dass er müde war. [de] | He said that he was tired. (full) ; He said he was tired. (full) | deToEn | — | — | — | false |
| g4u03.gi.reported-speech-statements.tr.004 | translation | Er erzählte uns, dass er am Tag davor sein Buch verloren hatte. [de] | He told us that he had lost his book the day before. (full) ; He told us he had lost his book the day before. (full) | deToEn | — | — | — | false |
| g4u03.gi.reported-speech-statements.tr.005 | translation | Er sagte mir, dass er die Hausübung gemacht hatte. [de] | He told me that he had done his homework. (full) ; He told me he had done his homework. (full) | deToEn | — | — | — | false |
| g4u03.gi.reported-speech-statements.tr.006 | translation | Sue sagte, dass sie Kopfschmerzen hatte. [de] | Sue said that she had a headache. (full) ; Sue said she had a headache. (full) | deToEn | — | — | — | false |
| g4u03.gi.reported-speech-statements.tr.007 | translation | Mia erzählte mir, dass sie am Tag danach nach Wien fahren würde. [de] | Mia told me that she would go to Vienna the day after. (full) ; Mia told me she would go to Vienna the day after. (full) ; Mia told me that she would travel to Vienna the day after. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u03/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u03",
  "lens": "answers",
  "itemsHash": "369ba6e44c94",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 105, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
