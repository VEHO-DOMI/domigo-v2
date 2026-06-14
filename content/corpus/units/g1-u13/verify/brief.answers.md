# Verify lens — answers — g1-u13 (round 1)

<!-- domigo:verify answers g1-u13 items=8c52fe76eab1 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (58)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u13.w.accident | accident | a bad thing that you do not want, like when one car hits another car. | One car hits another car on the road. There is an ___ in Bolt Street. | accident (full) | accident (full) | crime ; adventure ; fire |
| g1u13.w.adventure | adventure | an exciting time when something new and a little dangerous is there for you. | Diana and the pilot are in space. That is a great ___! | adventure (full) | adventure (full) | accident ; crime ; introduction |
| g1u13.w.alone | alone | with no people around you. | There were no people on the mountain with me. I was all ___. | alone (full) | alone (full) | young ; wet ; dark |
| g1u13.w.ambulance | ambulance | the car that takes an ill or hurt person to hospital. | I think my leg is broken. Call an ___! | ambulance (full) | ambulance (full) | police ; fire brigade ; coastguard |
| g1u13.w.backpack | backpack | a bag that you carry on your back. | My phone was not in my hand. It was in my ___. | backpack (full) | backpack (full) | jetpack ; button ; screen |
| g1u13.w.button | button | a small round part that you press to make a machine work. | Diana has to press the ___ to make the robot arm go. | button (full) | button (full) | screen ; rock ; backpack |
| g1u13.w.character | character | a man, woman or child in a story or a film. | In the space story, the ___ I like best is Captain Diana. | character (full) | character (full) | adventure ; introduction ; mayor |
| g1u13.w.class-speaker | class speaker | A child the others pick to talk to the teacher. | At the beginning of the school year, all of us want Emma to be our ___. | class speaker (full) | class speaker (full) | mayor ; democracy ; character |
| g1u13.w.cloud | cloud | a white or grey thing in the sky that can bring rain. | The sky is dark because a big grey ___ is in front of the sun. | cloud (full) | cloud (full) | rock ; sky ; screen |
| g1u13.w.coastguard | coastguard | the people who help you when your boat is in danger on the sea. | Their boat is in danger on the sea, so they call the ___ for help. | coastguard (full) | coastguard (full) | police ; fire brigade ; ambulance |
| g1u13.w.country | country | a big place with its own name, like Austria or England. | Austria is a ___ in Europe, and Vienna is its big city. | country (full) | country (full) | forest ; space ; crime |
| g1u13.w.crime | crime | something very bad that you are not allowed to do. | A robbery is a ___, so you have to call the police. | crime (full) | crime (full) | accident ; adventure ; storm |
| g1u13.w.dark | dark | with no light, so you cannot see. | It is night and there is no light, so the forest is very ___. | dark (full) | dark (full) | sunny ; wet ; windy |
| g1u13.w.democracy | democracy | a country where the people pick who is the leader. | In a ___ like Austria, the people vote for a leader. | democracy (full) | democracy (full) | crime ; country ; adventure |
| g1u13.w.earth | Earth | the place in space where all people live. | There are no more trees, and the ___ is dying in the year 3231. | Earth (full) | Earth (full) | space ; forest ; sky |
| g1u13.w.fire | fire | the hot, bright, red and orange light that can burn a building. | Help! There is a ___ in Hammond Street, and the building is very hot! | fire (full) | fire (full) | storm ; accident ; rock |
| g1u13.w.fire-brigade | fire brigade | the people you call when a building is hot and red with flames. | Help! There is a fire in our school. Call the ___! | fire brigade (full) | fire brigade (full) | coastguard ; ambulance ; police |
| g1u13.w.forest | forest | a big place with a lot of trees. | We go for a long walk in the dark ___ with all its tall trees. | forest (full) | forest (full) | country ; space ; sky |
| g1u13.w.guess-what | Guess what? | you say this before you tell people surprising news. | ___ An amazing thing happened to me on my way to school today! | Guess what? (full) | Guess what? (full) | Tell me more. ; adventure ; crime |
| g1u13.w.helicopter | helicopter | a flying machine that can go up and come down on a small place. | It is too windy, so the ___ from mountain rescue cannot land on the mountain. | helicopter (full) | helicopter (full) | jetpack ; ambulance ; backpack |
| g1u13.w.introduction | introduction | the first short part of a story or a book. | Read the ___ to the radio story before you read all of it. | introduction (full) | introduction (full) | adventure ; character ; crime |
| g1u13.w.jetpack | jetpack | a machine you wear on your back so you can fly up into the sky. | The man from the rescue team can put on a ___ and fly up the mountain. | jetpack (full) | jetpack (full) | backpack ; helicopter ; screen |
| g1u13.w.mayor | mayor | the leader of a town or a city. | The ___ of our town can open the new park on Saturday. | mayor (full) | mayor (full) | class speaker ; character ; democracy |
| g1u13.w.medicine | medicine | something you take when you are ill so that you get well. | On the mountain the rescue team can give you ___ and keep you warm. | medicine (full) | medicine (full) | backpack ; button ; screen |
| g1u13.w.mountain-rescue | mountain rescue | the team you call to help people who are in danger high up on a hill. | Two climbers are in danger on the mountain and cannot get down. Call ___! | mountain rescue (full) | mountain rescue (full) | coastguard ; fire brigade ; ambulance |
| g1u13.w.police | police | the people you call when there is a crime. | There is a crime in our street. Call the ___! | police (full) | police (full) | ambulance ; fire brigade ; coastguard |
| g1u13.w.political | political | about how leaders run a country or a town. | In class today we talk about voting and other ___ things. | political (full) | political (full) | young ; wet ; alone |
| g1u13.w.rescue-team | rescue team | a group of people who help others in danger. | The ___ can come in a helicopter and help the girl on the mountain. | rescue team (full) | rescue team (full) | coastguard ; backpack ; screen |
| g1u13.w.rock | rock | a big, hard, heavy stone on a mountain. | It is wet on the mountain because there is a lot of rain on the big ___. | rock (full) | rock (full) | cloud ; backpack ; forest |
| g1u13.w.screen | screen | the flat part of a computer or a TV that you look at. | Diana and the pilot are in front of a big ___ in the spaceship. | screen (full) | screen (full) | button ; rock ; backpack |
| g1u13.w.sky | sky | the big space over you when you look up outside. | It is night on the mountain, and the ___ is very dark. | sky (full) | sky (full) | forest ; rock ; screen |
| g1u13.w.space | space | the dark place far over the sky where the Earth and the stars are. | People are living on big spaceships in ___, far away from Earth. | space (full) | space (full) | forest ; country ; sky |
| g1u13.w.storm | storm | very bad weather with a lot of strong wind and rain. | There is a big ___ tonight, so the sky is dark and it is very windy. | storm (full) | storm (full) | fire ; cloud ; accident |
| g1u13.w.storm-2 | storm | a time of bad weather when the wind is very strong and dangerous. | There is a big ___ with very strong wind, and a tree is now on the ground. | storm (full) | storm (full) | accident ; fire ; adventure |
| g1u13.w.sunny | sunny | when there is a lot of light and no cloud in the sky. | There was no cloud in the sky in the morning. It was a ___ day. | sunny (full) | sunny (full) | windy ; wet ; dark |
| g1u13.w.tell-me-more | Tell me more. | you say this when you want to hear more. | That is so exciting! ___ I want to hear all of it! | Tell me more. (full) | Tell me more. (full) | Guess what? ; adventure ; crime |
| g1u13.w.to-arrive | to arrive | to come to a place at the end of your way. | We wait on the mountain for an hour, and then the rescue team ___. | arrives (full) ; arrive (partial) ; to arrive (partial) | arrive (full) ; to arrive (full) | to slip ; to dream ; to die |
| g1u13.w.to-be-in-danger | to be in danger | when you are not safe and something bad can happen to you. | Their boat is on the sea in the storm. The people on it ___. | are in danger (full) ; be in danger (partial) | to be in danger (full) ; be in danger (full) ; in danger (partial) | to be safe ; to be lucky ; to dream |
| g1u13.w.to-be-lucky | to be lucky | when something good is there for you, so you are very happy. | You fall on the mountain, but you ___ because you have a phone with you. | are lucky (full) ; be lucky (partial) | to be lucky (full) ; be lucky (full) ; lucky (partial) | to be safe ; to be in danger ; to die |
| g1u13.w.to-be-safe | to be safe | when you are away from danger and nothing bad can happen to you. | The helicopter can take you home, away from the storm. Now you ___! | are safe (full) ; be safe (partial) | to be safe (full) ; be safe (full) ; safe (partial) | to be in danger ; to be lucky ; to slip |
| g1u13.w.to-break | to break | to fall on a bone so that it is in two pieces and you cannot walk. | Be careful on the wet rock or you can fall and ___ your leg. | break (full) ; to break (partial) | break (full) ; to break (full) | to slip ; to chase ; to vote |
| g1u13.w.to-chase | to chase | to run fast after a person or an animal to catch them. | My dog can run fast and ___ the cat all around our garden. | chase (full) ; to chase (partial) | chase (full) ; to chase (full) | to slip ; to land ; to vote |
| g1u13.w.to-die | to die | to stop living. | If you do not give the flower water, it will ___. | die (full) ; to die (partial) | die (full) ; to die (full) | to chase ; to vote ; to land |
| g1u13.w.to-dream | to dream | to see a picture in your head when you are asleep at night. | A man is flying up to you with a jetpack! Are you ill, or do you ___? | dream (full) ; to dream (partial) | dream (full) ; to dream (full) | to slip ; to radio ; to land |
| g1u13.w.to-fall-down | to fall down | to go down to the ground all of a sudden, often when you slip. | Be careful on the wet rock! You can slip and ___ and hurt your leg. | fall down (full) ; to fall down (partial) | fall down (full) ; to fall down (full) | to land ; to arrive ; to vote |
| g1u13.w.to-fly-up-the-mountain | to fly up the mountain | to go up high to the top of a hill in the air, not on your feet. | The man has a jetpack, so he can ___ in only a minute. | fly up the mountain (full) ; to fly up the mountain (partial) | fly up the mountain (full) ; to fly up the mountain (full) | to fall down ; to slip ; to radio |
| g1u13.w.to-happen | to happen | when a new thing is there, and it is a big surprise. | Guess what! An amazing thing did ___ to me on my way to school. | happen (full) ; to happen (partial) | happen (full) ; to happen (full) | to chase ; to vote ; to radio |
| g1u13.w.to-land | to land | to come down from the sky to the ground. | It is too windy, so it is hard for the helicopter to ___ on the mountain. | land (full) ; to land (partial) | land (full) ; to land (full) | to slip ; to chase ; to die |
| g1u13.w.to-notice | to notice | to see something new for the first time. | All of a sudden, Diana and the pilot can ___ a small spaceship. | notice (full) ; to notice (partial) | notice (full) ; to notice (full) | to press ; to radio ; to chase |
| g1u13.w.to-press | to press | to put your finger on a button to make a machine work. | Diana has to ___ the button to make the robot arm go. | press (full) ; to press (partial) | press (full) ; to press (full) | to notice ; to land ; to chase |
| g1u13.w.to-radio | to radio | to send your voice to a team that is far away with a small box. | The man can find the girl, and then he has to ___ his team for help. | radio (full) ; to radio (partial) | radio (full) ; to radio (full) | to land ; to slip ; to dream |
| g1u13.w.to-shout-for-help | to shout for help | to call out very loud because you are in danger and you need people. | She is alone on the mountain and very scared, so she has to ___. | shout for help (full) ; to shout for help (partial) | shout for help (full) ; to shout for help (full) | to slip ; to dream ; to land |
| g1u13.w.to-shout-for-help-2 | to shout for help | to use a very loud voice so that people come to you in danger. | She has not got a phone, so all she can do is ___. | shout for help (full) ; to shout for help (partial) | shout for help (full) ; to shout for help (full) | to notice ; to press ; to die |
| g1u13.w.to-slip | to slip | to fall down because the ground under your feet is wet. | The rock is wet. Be careful or you can ___ and fall down. | slip (full) ; to slip (partial) | slip (full) ; to slip (full) | to land ; to dream ; to vote |
| g1u13.w.to-vote | to vote | to pick a person from a list with your hand or a card. | All the children in our class ___ for a new class speaker. | vote (full) ; to vote (partial) | vote (full) ; to vote (full) | to chase ; to slip ; to radio |
| g1u13.w.wet | wet | covered in water, not dry. | There is a lot of rain on the mountain, so the rock is ___. | wet (full) | wet (full) | dark ; sunny ; young |
| g1u13.w.windy | windy | when there is a lot of strong wind outside. | There is a storm on the mountain, so it is very ___. | windy (full) | windy (full) | sunny ; wet ; dark |
| g1u13.w.young | young | not old. | She is a teenager of 15. She is still very ___. | young (full) | young (full) | dark ; wet ; alone |

## Grammar items (80)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u13.gi.linking-words.cp.001 | context-picker | Du sagst, warum du Hunde magst. Welcher Satz ist richtig? [de] | I like dogs because they are friendly. (full) | — | I like dogs because friendly they are. ; I like dogs because of they are friendly. ; I like dogs because are they friendly. | — | — | false |
| g1u13.gi.linking-words.cp.002 | context-picker | Du erzählst von dem Sturm. Welcher Satz ist richtig? [de] | The sky was dark and it was windy. (full) | — | The sky was dark because it was windy. ; The sky was dark but it was windy. ; The sky was dark or it was windy. | — | — | false |
| g1u13.gi.linking-words.cp.003 | context-picker | Du erklärst, warum Sophia das Handy nehmen konnte. Welcher Satz ist richtig? [de] | She was lucky because her phone was in her backpack. (full) | — | She was lucky because of her phone was in her backpack. ; She was lucky because her phone in her backpack was. ; She was lucky but her phone was in her backpack. | — | — | false |
| g1u13.gi.linking-words.ec.001 | error-correction | He wanted to climb because it was too windy. [en] | He wanted to climb but it was too windy. (full) ; but (partial) | — | — | — | — | false |
| g1u13.gi.linking-words.ec.002 | error-correction | I like pizza because is delicious. [en] | I like pizza because it is delicious. (full) ; it (partial) | — | — | — | — | false |
| g1u13.gi.linking-words.ec.003 | error-correction | I like summer because sunny it is. [en] | I like summer because it is sunny. (full) ; because it is sunny (partial) | — | — | — | — | false |
| g1u13.gi.linking-words.ec.004 | error-correction | I am happy because of I have a dog. [en] | I am happy because I have a dog. (full) ; I'm happy because I have a dog. (full) ; because I have a dog (partial) | — | — | — | — | false |
| g1u13.gi.linking-words.ec.005 | error-correction | I stayed in my room but I was ill. [en] | I stayed in my room because I was ill. (full) ; I stayed in my room so I was ill. (partial) ; because (partial) | — | — | — | — | false |
| g1u13.gi.linking-words.ff.001 | free-form | Schreib den Satz fertig: I like summer ___. [de, 1 blank(s)] | because it is sunny (full) ; because it is hot (full) ; but I do not like winter (partial) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.001 | gap-fill | I was hungry ___ I wanted a sandwich. [en, 1 blank(s)] | and (full) ; so (partial) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.002 | gap-fill | He was scared ___ it was dark. [en, 1 blank(s)] | because (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.003 | gap-fill | She was tired ___ she was happy. [en, 1 blank(s)] | but (full) ; and (partial) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.004 | gap-fill | The rocks are wet ___ there was a storm. [en, 1 blank(s)] | because (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.005 | gap-fill | He falls down ___ breaks his leg. [en, 1 blank(s)] | and (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.006 | gap-fill | You are lucky ___ you have a phone with you. [en, 1 blank(s)] | because (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.007 | gap-fill | We wanted to go to the park ___ it was windy. [en, 1 blank(s)] | but (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.008 | gap-fill | She did not go to school ___ she was ill. [en, 1 blank(s)] | because (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.009 | gap-fill | I like dogs ___ my sister likes rabbits. [en, 1 blank(s)] | but (full) ; and (partial) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.010 | gap-fill | The man gives you medicine ___ helps you. [en, 1 blank(s)] | and (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.011 | gap-fill | I like my school ___ my friends are there. [en, 1 blank(s)] | because (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.012 | gap-fill | Diana wanted to help ___ her friends were in danger. [en, 1 blank(s)] | because (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.013 | gap-fill | It is too windy for a helicopter, ___ the rescue team can help. [en, 1 blank(s)] | but (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gf.014 | gap-fill | Sophia was alone ___ scared on the mountain. [en, 1 blank(s)] | and (full) | — | — | — | — | false |
| g1u13.gi.linking-words.gs.001 | group-sort | Sortiere die Sätze: Passt and, but oder because? [de] | — | — | — | — | and: Tom and Lisa are friends., She slips and falls down., We climbed and played football. \| but: It is old but nice., She is tired but happy., I like dogs but not rabbits. \| because: I stayed in my room because I was ill., She is happy because it is sunny., We were scared because it was dark. | false |
| g1u13.gi.linking-words.gs.002 | group-sort | Sortiere: Welches Bindewort verbindet die beiden Teile? [de] | — | — | — | — | and: He radios his team and lands next to you., We climbed up and looked down. \| but: We wanted to climb but it was windy., She was scared but she was safe. \| because: You are lucky because you have a phone., He was scared because it was dark. | false |
| g1u13.gi.linking-words.mc.001 | multiple-choice | Welches Wort nennt einen Grund? [de] | because (full) | — | but ; and ; or | — | — | false |
| g1u13.gi.linking-words.mc.003 | multiple-choice | She slips ___ falls down. [en, 1 blank(s)] | and (full) | — | but ; because ; or | — | — | false |
| g1u13.gi.linking-words.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | I stayed in my room because I was tired. (full) | — | I stayed in my room because tired I was. ; I stayed in my room because of I was tired. ; I stayed in my room because was I tired. | — | — | false |
| g1u13.gi.linking-words.mc.005 | multiple-choice | She is happy ___. [en, 1 blank(s)] | because it is sunny (full) | — | because of it is sunny ; because sunny it is ; because is it sunny | — | — | false |
| g1u13.gi.linking-words.mc.006 | multiple-choice | I like dogs ___ I do not like rabbits. [en, 1 blank(s)] | but (full) | — | so ; because ; or | — | — | false |
| g1u13.gi.linking-words.mp.001 | matching-pairs | Was passt zusammen? Satzanfang und Grund. [de] | — | — | — | She stayed in her room because ↔ she was ill. ; He was scared because ↔ it was dark. ; You are lucky because ↔ you have a phone. ; We were happy because ↔ we were safe. | — | false |
| g1u13.gi.linking-words.mt.001 | matching | Welcher Grund passt zu welchem Gefühl? [de] | — | — | — | I am tired because ↔ I played all day. ; I am happy because ↔ it is my birthday. ; I am sad because ↔ my dog is ill. ; I am hungry because ↔ I did not eat lunch. | — | false |
| g1u13.gi.linking-words.mt.002 | matching | Welcher zweite Teil passt zum ersten? [de] | — | — | — | It was too windy for a helicopter, but ↔ the rescue team helped you. ; Diana wanted to help because ↔ her friends were in danger. ; He landed next to me and ↔ radioed his team. ; The rocks were wet because ↔ there was a storm. | — | false |
| g1u13.gi.linking-words.qf.001 | question-formation | Schreib den Grund als Antwort. Frage: Why is she happy? (it / be / sunny) [de] | Because it is sunny. (full) ; Because it's sunny. (full) | — | — | — | — | false |
| g1u13.gi.linking-words.sb.001 | sentence-building | I / like / summer / because / sunny / it / is [en] | I like summer because it is sunny. (full) | — | — | — | — | false |
| g1u13.gi.linking-words.sb.002 | sentence-building | I'm / happy / because / is / it / sunny [en] | I'm happy because it is sunny. (full) | — | — | — | — | false |
| g1u13.gi.linking-words.sb.003 | sentence-building | She / shouted / for / help / but / was / she / alone [en] | She shouted for help but she was alone. (full) | — | — | — | — | false |
| g1u13.gi.linking-words.tf.001 | transformation | Verbinde die Sätze mit because: I am tired. I played football. [de] | I am tired because I played football. (full) ; I'm tired because I played football. (full) | — | — | — | — | false |
| g1u13.gi.linking-words.tf.002 | transformation | Verbinde die Sätze mit because: She is happy. It is sunny. [de] | She is happy because it is sunny. (full) ; She's happy because it's sunny. (full) | — | — | — | — | false |
| g1u13.gi.linking-words.tf.003 | transformation | Verbinde die Sätze mit but: I wanted an ice cream. The shop was closed. [de] | I wanted an ice cream but the shop was closed. (full) | — | — | — | — | false |
| g1u13.gi.linking-words.tf.004 | transformation | Verbinde die Sätze mit and: He lands next to me. He gives me medicine. [de] | He lands next to me and gives me medicine. (full) ; He lands next to me and he gives me medicine. (full) | — | — | — | — | false |
| g1u13.gi.linking-words.tr.001 | translation | Er war müde, aber er spielte weiter. [de] | He was tired but he played on. (full) ; He was tired but he played football. (partial) | deToEn | — | — | — | false |
| g1u13.gi.linking-words.tr.002 | translation | Ich bin traurig, weil mein Hund krank ist. [de] | I am sad because my dog is ill. (full) ; I'm sad because my dog is ill. (full) | deToEn | — | — | — | false |
| g1u13.gi.linking-words.tr.003 | translation | Ich mag den Sommer, weil es sonnig ist. [de] | I like summer because it is sunny. (full) ; I like summer because it's sunny. (full) | deToEn | — | — | — | false |
| g1u13.gi.past-simple-regular.ag.001 | anagram | Die Vergangenheitsform von 'play': [de] | played (full) | — | — | — | — | true |
| g1u13.gi.past-simple-regular.ag.002 | anagram | Die Vergangenheitsform von 'stop': [de] | stopped (full) | — | — | — | — | true |
| g1u13.gi.past-simple-regular.ag.003 | anagram | Die Vergangenheitsform von 'carry': [de] | carried (full) | — | — | — | — | true |
| g1u13.gi.past-simple-regular.cp.001 | context-picker | Sophia erzählt von gestern am Berg. Welcher Satz ist richtig? [de] | I slipped on the wet rocks. (full) | — | I slip on the wet rocks. ; I sliped on the wet rocks. ; I did slipped on the wet rocks. | — | — | false |
| g1u13.gi.past-simple-regular.cp.002 | context-picker | Du erzählst, was der Rettungsmann gemacht hat. Welcher Satz ist richtig? [de] | He radioed his team and helped me. (full) | — | He radio his team and help me. ; He radioed his team and helps me. ; He did radio his team and helped me. | — | — | false |
| g1u13.gi.past-simple-regular.ec.001 | error-correction | Yesterday I watch a great film. [en] | Yesterday I watched a great film. (full) ; watched (partial) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.ec.002 | error-correction | He stoped the car. [en] | He stopped the car. (full) ; stopped (partial) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.ec.003 | error-correction | The helicopter arriveed an hour later. [en] | The helicopter arrived an hour later. (full) ; arrived (partial) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.ec.004 | error-correction | I did walked to the park yesterday. [en] | I walked to the park yesterday. (full) ; walked (partial) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.001 | gap-fill | Yesterday Sophia ___ (want) to go up a mountain. [en, 1 blank(s)] | wanted (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.002 | gap-fill | We ___ (play) football after school. [en, 1 blank(s)] | played (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.003 | gap-fill | Yesterday I ___ (walk) to the park. [en, 1 blank(s)] | walked (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.004 | gap-fill | The man with the jetpack ___ (land) next to me. [en, 1 blank(s)] | landed (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.005 | gap-fill | Diana ___ (press) a button and the front of the spaceship opened. [en, 1 blank(s)] | pressed (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.006 | gap-fill | The mountain rescue team ___ (arrive) an hour later. [en, 1 blank(s)] | arrived (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.007 | gap-fill | Suddenly they ___ (notice) a little spaceship. [en, 1 blank(s)] | noticed (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.008 | gap-fill | The bus ___ (stop) at the corner. [en, 1 blank(s)] | stopped (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.009 | gap-fill | They ___ (carry) the bags home. [en, 1 blank(s)] | carried (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.010 | gap-fill | She ___ (slip) on the wet rocks and ___ (shout) for help. [en, 2 blank(s)] | slipped \| shouted (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.011 | gap-fill | Yesterday my dog ___ (chase) our cat and the cat ___ (jump) into a tree. [en, 2 blank(s)] | chased \| jumped (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gf.012 | gap-fill | Then I ___ (notice) my phone and ___ (radio) the rescue team. [en, 2 blank(s)] | noticed \| radioed (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.gs.003 | group-sort | Wird der Konsonant verdoppelt oder nicht? Sortiere die Verben. [de] | — | — | — | — | like walked: walk, play, want, shout, open, happen \| like stopped: stop, slip, plan, drop | false |
| g1u13.gi.past-simple-regular.gs.004 | group-sort | Nur -d oder y wird zu -ied? Sortiere die Verben. [de] | — | — | — | — | like arrived: arrive, notice, chase, like, close \| like carried: carry, study | false |
| g1u13.gi.past-simple-regular.mc.001 | multiple-choice | Welche Form ist richtig geschrieben? [de] | stopped (full) | — | stoped ; stopd ; stoppd | — | — | false |
| g1u13.gi.past-simple-regular.mc.002 | multiple-choice | Welche Form ist richtig geschrieben? [de] | arrived (full) | — | arriveed ; arrivd ; arryved | — | — | false |
| g1u13.gi.past-simple-regular.mc.003 | multiple-choice | Welche Form ist richtig geschrieben? [de] | carried (full) | — | carryed ; carryd ; carrd | — | — | false |
| g1u13.gi.past-simple-regular.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | Yesterday I walked to school. (full) | — | Yesterday I walk to school. ; Yesterday I was walked to school. ; Yesterday I did walked to school. | — | — | false |
| g1u13.gi.past-simple-regular.mp.001 | matching-pairs | Was passt zusammen? [de] | — | — | — | walk ↔ walked ; play ↔ played ; arrive ↔ arrived ; stop ↔ stopped ; carry ↔ carried ; shout ↔ shouted | — | false |
| g1u13.gi.past-simple-regular.mp.003 | matching-pairs | Was passt zusammen? [de] | — | — | — | land ↔ landed ; slip ↔ slipped ; notice ↔ noticed ; press ↔ pressed ; chase ↔ chased ; happen ↔ happened | — | false |
| g1u13.gi.past-simple-regular.sb.001 | sentence-building | I / helped / my / mum / yesterday [en] | I helped my mum yesterday. (full) ; Yesterday I helped my mum. (partial) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.sb.002 | sentence-building | the / helicopter / arrived / an / hour / later [en] | The helicopter arrived an hour later. (full) | — | — | — | — | false |
| g1u13.gi.past-simple-regular.tf.001 | transformation | Schreib die Vergangenheitsform: play → ___ [de, 1 blank(s)] | played (full) | — | — | — | — | true |
| g1u13.gi.past-simple-regular.tf.002 | transformation | Schreib die Vergangenheitsform: arrive → ___ [de, 1 blank(s)] | arrived (full) | — | — | — | — | true |
| g1u13.gi.past-simple-regular.tf.003 | transformation | Schreib die Vergangenheitsform: slip → ___ [de, 1 blank(s)] | slipped (full) | — | — | — | — | true |
| g1u13.gi.past-simple-regular.tr.001 | translation | Gestern hat sie ihre Oma besucht. [de] | Yesterday she visited her grandma. (full) ; She visited her grandma yesterday. (full) | deToEn | — | — | — | false |
| g1u13.gi.past-simple-regular.tr.002 | translation | Der Rettungsmann landete neben mir und half mir. [de] | The rescue man landed next to me and helped me. (full) ; The man landed next to me and helped me. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u13/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u13",
  "lens": "answers",
  "itemsHash": "8c52fe76eab1",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 138, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
