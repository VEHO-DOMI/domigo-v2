# Verify lens — answers — g4-u04 (round 1)

<!-- domigo:verify answers g4-u04 items=bd4bc1a2ccf2 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (45)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u04.w.accountant | accountant | Someone whose job is to keep and look after the money of a company. | She has a job in finance. She's an ___. | accountant (full) | accountant (full) ; an accountant (full) ; accountants (partial) | mechanic ; receptionist ; electrician |
| g4u04.w.advice | advice | What you tell somebody to help them do the right thing. | Take my ___. Don't do it. | advice (full) | advice (full) | ambition ; skills ; career |
| g4u04.w.ambition | ambition | A strong wish to do or become something great in your life. | Her ___ is to become a famous singer one day. | ambition (full) | ambition (full) ; ambitions (partial) | career ; advice ; satisfaction |
| g4u04.w.be-keen-on | be keen on | To like something very much or be very happy to do it. | I was very tired, so I wasn't ___ going out that evening. | keen on (full) ; keen (partial) | be keen on (full) ; keen on (full) | be responsible for ; deserve ; develop |
| g4u04.w.be-responsible-for | be responsible for | To be the one who has to look after something or make sure it happens. | In our team, Tom is ___ calling the customers every morning. | responsible for (full) | be responsible for (full) ; responsible for (full) | be keen on ; develop ; deserve |
| g4u04.w.bonus | bonus | Extra money for doing your job especially well. | Everyone in the office got a ___ for their great work this year. | bonus (full) | bonus (full) ; bonuses (partial) | salary ; deadline ; advice |
| g4u04.w.career | career | The jobs a person does in one kind of work over many years. | She started her ___ as a singer ten years ago. | career (full) | career (full) ; careers (partial) | ambition ; salary ; company |
| g4u04.w.casual | casual | Free and easy, not too smart or serious. | Don't be too ___ during an interview for a new job. | casual (full) | casual (full) | enthusiastic ; confidently ; female |
| g4u04.w.company | company | A business that makes or sells things and gives people jobs. | My dad has a job in a small ___ that makes furniture. | company (full) | company (full) ; companies (partial) | employer ; career ; salary |
| g4u04.w.computing | computing | The use of computers and the work people do with them. | She wants a job in ___ because she loves making apps on the computer. | computing (full) | computing (full) | finance ; marketing ; journalism |
| g4u04.w.computing-2 | computing | The use of computers for work, for example writing programmes. | I love programming, so I'm glad I found a job in ___. | computing (full) | computing (full) | finance ; marketing ; health care |
| g4u04.w.confidently | confidently | In a way that shows you believe in yourself. | Try to speak and act ___, but don't be cheeky. | confidently (full) | confidently (full) | naturally ; enthusiastic ; casual |
| g4u04.w.deadline | deadline | The last day or time when your work needs to be done. | We had to hurry to meet the ___. | deadline (full) | deadline (full) ; deadlines (partial) | bonus ; salary ; company |
| g4u04.w.deserve | deserve | To have a right to something good because of what you have done. | You studied so well for school — you ___ a great result. | deserve (full) | deserve (full) ; deserved (full) | earn ; develop ; launch |
| g4u04.w.develop | develop | To make something new over time, for example a new product. | The company ___ new apps for mobile phones. | develops (full) ; develop (partial) | develop (full) ; develops (full) | launch ; earn ; deserve |
| g4u04.w.earn | earn | To be paid money for the work that you do. | I need to ___ a lot of money if I want to go on holiday to Australia. | earn (full) | earn (full) ; earns (full) | deserve ; develop ; launch |
| g4u04.w.electrician | electrician | Someone whose job is to put in and repair the lights and electricity in a building. | We called an ___ to repair the broken lights in the kitchen. | electrician (full) | electrician (full) ; an electrician (full) ; electricians (partial) | mechanic ; nurse ; accountant |
| g4u04.w.employer | employer | A person or company that pays other people to work for them. | My new ___ is a big computer company. | employer (full) | employer (full) ; an employer (full) ; employers (partial) | company ; career ; salary |
| g4u04.w.enthusiastic | enthusiastic | Showing a lot of happy and excited feelings about something. | The boys and girls were very ___ about the school trip to London. | enthusiastic (full) | enthusiastic (full) | casual ; confidently ; unemployed |
| g4u04.w.eye-contact | eye contact | When you look right at somebody while you talk to them. | Look at your interviewer and try to keep ___. | eye contact (full) | eye contact (full) | working hours ; skills ; pros and cons |
| g4u04.w.female | female | A woman or a girl, not a man or a boy. | My dog's a girl, so it's ___, not male. | female (full) | female (full) | male ; casual ; enthusiastic |
| g4u04.w.finance | finance | The work of looking after money for people and companies. | He wants a job in ___ because he is good with money and numbers. | finance (full) | finance (full) | marketing ; computing ; journalism |
| g4u04.w.finance-2 | finance | The work of looking after money for a bank or a company. | She has a job in ___. She's an accountant. | finance (full) | finance (full) | computing ; marketing ; health care |
| g4u04.w.flight-attendant | flight attendant | Someone whose job is to look after the people on a plane. | The ___ showed us how to be safe on the plane. | flight attendant (full) | flight attendant (full) ; a flight attendant (full) ; flight attendants (partial) | receptionist ; mechanic ; accountant |
| g4u04.w.health-care | health care | The work of looking after people who are ill, for example in hospitals. | She wants a job in ___ because she likes looking after people. | health care (full) ; healthcare (full) | health care (full) ; healthcare (full) | finance ; computing ; marketing |
| g4u04.w.health-care-2 | health care | The work of helping people who are ill, for example as a nurse or doctor. | If you want to work in ___, you need to like helping people. | health care (full) ; healthcare (full) | health care (full) ; healthcare (full) | finance ; computing ; marketing |
| g4u04.w.interview | (job) interview | A meeting where somebody asks you things to find out if you are right for the work. | She has an ___ next week for a new job. | interview (full) | interview (full) ; job interview (full) ; an interview (full) | employer ; ambition ; salary |
| g4u04.w.journalism | journalism | The work of finding and writing the news for newspapers and TV programmes. | She can write well. She's looking for a career in ___. | journalism (full) | journalism (full) | finance ; computing ; marketing |
| g4u04.w.launch | launch | To bring out a new product and start selling it for the first time. | The new product will be ___ in July. | launched (full) ; launch (partial) | launch (full) ; launched (full) | develop ; earn ; memorise |
| g4u04.w.male | male | A man or a boy, not a woman or a girl. | My sister has a dog, and it's ___, not female. | male (full) | male (full) | female ; casual ; unemployed |
| g4u04.w.marketing | marketing | The work of showing people the things a company sells so that they want them. | She has a job in ___ and shows people why our new drink is so good. | marketing (full) | marketing (full) | finance ; computing ; journalism |
| g4u04.w.mechanic | mechanic | Someone whose job is to repair machines, especially cars. | I took my car to the ___ because the engine was making a strange noise. | mechanic (full) | mechanic (full) ; a mechanic (full) ; mechanics (partial) | electrician ; nurse ; secretary |
| g4u04.w.memorise | memorise | To keep something well in your head so that you can use it again later. | Read the text and try to ___ it all. | memorise (full) ; memorize (full) | memorise (full) ; memorize (full) | develop ; launch ; deserve |
| g4u04.w.naturally | naturally | In a normal and easy way, just like you really are. | During the interview, speak ___ and just be yourself. | naturally (full) | naturally (full) | confidently ; casual ; enthusiastic |
| g4u04.w.nurse | nurse | Someone whose job is to care for people who are ill, usually in a hospital. | The ___ looked after me in hospital and gave me my medicine. | nurse (full) | nurse (full) ; a nurse (full) ; nurses (partial) | accountant ; electrician ; mechanic |
| g4u04.w.pros-and-cons | pros and cons | The good and the bad sides of something. | Think about the ___ before you take a new job. | pros and cons (full) | pros and cons (full) | working hours ; eye contact ; skills |
| g4u04.w.receptionist | receptionist | Someone whose job is at the desk in a hotel, welcoming the people who come in. | The ___ at the hotel gave us our key and a map of the city. | receptionist (full) | receptionist (full) ; a receptionist (full) ; receptionists (partial) | secretary ; mechanic ; accountant |
| g4u04.w.salary | salary | The money you are paid for your job every month. | She earns a good ___. | salary (full) | salary (full) ; salaries (partial) | bonus ; deadline ; company |
| g4u04.w.sales-and-marketing | sales and marketing | The part of a company that sells things and shows people why they are good. | He is good with people. No wonder he has a job in ___. | sales and marketing (full) | sales and marketing (full) | finance ; computing ; health care |
| g4u04.w.satisfaction | satisfaction | The happy feeling you have when you do something well. | I love my job. It gives me a lot of ___. | satisfaction (full) | satisfaction (full) | ambition ; career ; advice |
| g4u04.w.secretary | secretary | Someone whose job in an office is writing letters, calling people and looking after meetings. | The ___ in our office writes the letters and looks after all the meetings. | secretary (full) | secretary (full) ; a secretary (full) ; secretaries (partial) | receptionist ; mechanic ; nurse |
| g4u04.w.skills | skills | The things you can do well because you have done them many times. | We need somebody with good people ___ for this job. | skills (full) | skills (full) ; skill (partial) | advice ; ambition ; working hours |
| g4u04.w.think-up | think up | To make a new idea or plan in your head. | We need to ___ a good name for our new school band. | think up (full) | think up (full) | develop ; memorise ; launch |
| g4u04.w.unemployed | unemployed | Not having a job that pays you money. | I lost my job last week. Now I'm ___. | unemployed (full) | unemployed (full) | casual ; enthusiastic ; female |
| g4u04.w.working-hours | working hours | The times of the day when a person is at their job. | Most people enjoy shorter ___ and more free time. | working hours (full) | working hours (full) | pros and cons ; eye contact ; skills |

## Grammar items (75)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u04.gi.reported-questions.ag.001 | anagram | Bei einer berichteten Ja/Nein-Frage steht dieses kleine Wort (= ob): ___ [de, 1 blank(s)] | whether (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.cp.001 | context-picker | Nach dem Vorstellungsgespräch erzählst du einer Freundin, wann du anfangen kannst. Welcher Satz ist richtig? [de] | She asked me when I could start. (full) | — | She asked me when could I start. ; She asked me when can I start. ; She asked me when I can start. | — | — | false |
| g4u04.gi.reported-questions.cp.002 | context-picker | Im Vorstellungsgespräch wollte der Chef etwas über deine Erfahrung wissen. Welche Wiedergabe ist richtig? [de] | He asked me if I had any experience. (full) | — | He asked me did I have any experience. ; He asked me if did I have any experience. ; He asked me that I had any experience. | — | — | false |
| g4u04.gi.reported-questions.cp.003 | context-picker | Deine Mutter wollte wissen, was du nach der Schule vorhast. Welcher Satz ist richtig? [de] | Mum asked me where I was going after school. (full) | — | Mum asked me where was I going after school. ; Mum asked me where am I going after school. ; Mum asked me where I am going after school. | — | — | false |
| g4u04.gi.reported-questions.ec.001 | error-correction | He asked where did I live. [en] | He asked where I lived. (full) ; where I lived (partial) | — | — | — | — | true |
| g4u04.gi.reported-questions.ec.002 | error-correction | She asked me that I was hungry. [en] | She asked me if I was hungry. (full) ; She asked me whether I was hungry. (full) ; if I was hungry (partial) | — | — | — | — | false |
| g4u04.gi.reported-questions.ec.003 | error-correction | The interviewer asked me where did I work. [en] | The interviewer asked me where I worked. (full) ; where I worked (partial) | — | — | — | — | false |
| g4u04.gi.reported-questions.ec.004 | error-correction | The teacher asked us what were we doing. [en] | The teacher asked us what we were doing. (full) ; what we were doing (partial) | — | — | — | — | false |
| g4u04.gi.reported-questions.ec.005 | error-correction | She asked me did I like the job. [en] | She asked me if I liked the job. (full) ; She asked me whether I liked the job. (full) ; if I liked the job (partial) | — | — | — | — | false |
| g4u04.gi.reported-questions.ec.006 | error-correction | The doctor asked if was I feeling OK. [en] | The doctor asked if I was feeling OK. (full) ; if I was feeling OK (partial) | — | — | — | — | false |
| g4u04.gi.reported-questions.ec.007 | error-correction | He asked that if I was ready. [en] | He asked if I was ready. (full) ; He asked whether I was ready. (full) ; if I was ready (partial) | — | — | — | — | true |
| g4u04.gi.reported-questions.ec.008 | error-correction | He asked me what did I want to do. [en] | He asked me what I wanted to do. (full) ; what I wanted to do (partial) | — | — | — | — | false |
| g4u04.gi.reported-questions.ec.009 | error-correction | She asked me whether did I have any homework. [en] | She asked me whether I had any homework. (full) ; She asked me if I had any homework. (full) ; whether I had any homework (partial) | — | — | — | — | false |
| g4u04.gi.reported-questions.ec.010 | error-correction | He asked when can I start. [en] | He asked when I could start. (full) ; when I could start (partial) | — | — | — | — | true |
| g4u04.gi.reported-questions.gf.001 | gap-fill | "Where do you live?" — She asked me where I ___. [en, 1 blank(s)] | lived (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.002 | gap-fill | "Do you have any experience?" — The interviewer asked me ___ I had any experience. [en, 1 blank(s)] | if (full) ; whether (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.003 | gap-fill | "Why do you want this job?" — She asked me why I ___ the job. [en, 1 blank(s)] | wanted (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.004 | gap-fill | "Where is the library?" — She asked me where the library ___. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.005 | gap-fill | "When can you start?" — They asked me when I ___ start. [en, 1 blank(s)] | could (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.006 | gap-fill | "What is your ambition?" — He asked me what my ambition ___. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.007 | gap-fill | "Will you come on Saturday?" — She asked me if I ___ come on Saturday. [en, 1 blank(s)] | would (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.008 | gap-fill | "Do you play football?" — He asked me ___ I played football. [en, 1 blank(s)] | if (full) ; whether (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.009 | gap-fill | "What are you doing?" — My mum asked me what I ___ doing. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.010 | gap-fill | "How much do you want to earn?" — She asked me how much I ___ to earn. [en, 1 blank(s)] | wanted (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.011 | gap-fill | "Have you studied English?" — She asked me ___ I ___ studied English. [en, 2 blank(s)] | if \| had (full) ; whether \| had (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.012 | gap-fill | "Are you nervous?" — He asked me if I ___ nervous. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.013 | gap-fill | "Who is your employer?" — She asked me who my employer ___. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.014 | gap-fill | "Can you help me?" — She asked me ___ I could help her. [en, 1 blank(s)] | if (full) ; whether (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.015 | gap-fill | "Where have you worked before?" — He asked me where I ___ ___ before. [en, 2 blank(s)] | had \| worked (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.016 | gap-fill | "Why did you want to work there?" — She asked me why I ___ wanted to work there. [en, 1 blank(s)] | had (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.017 | gap-fill | "Do you enjoy your job?" — They asked me if I ___ my job. [en, 1 blank(s)] | enjoyed (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.018 | gap-fill | "Can you speak English?" — The employer asked me if I ___ speak English. [en, 1 blank(s)] | could (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.019 | gap-fill | "Where do you work?" — He asked me ___ I worked. [en, 1 blank(s)] | where (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.020 | gap-fill | "Are you hungry?" — She asked me ___ I was hungry. [en, 1 blank(s)] | if (full) ; whether (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gf.021 | gap-fill | "Will you be late?" — He asked me if I ___ be late. [en, 1 blank(s)] | would (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.gs.001 | group-sort | Welche Wiedergaben beginnen mit „if“ und welche mit einem Fragewort? [de] | — | — | — | — | if: She asked if I liked pizza., He asked if I could cook., They asked if I had a job. \| wh-word: She asked where I lived., He asked when I could start., They asked what I wanted. | false |
| g4u04.gi.reported-questions.gs.002 | group-sort | Sortiere: richtig wiedergegeben oder mit Fehler? [de] | — | — | — | — | ✓: He asked where I lived., She asked if I was ready., They asked when I could start. \| ✗: He asked where did I live., She asked if was I ready., They asked did I want the job. | false |
| g4u04.gi.reported-questions.gs.003 | group-sort | Sortiere die Sätze danach, wie sich can, will und is/are beim Wiedergeben verändern. [de] | — | — | — | — | can → could: She asked if I could cook., He asked when I could start. \| will → would: She asked if I would help., He asked if I would work weekends. \| is/are → was/were: She asked if I was ready., He asked what my skills were. | false |
| g4u04.gi.reported-questions.mc.001 | multiple-choice | "Do you like pizza?" — She asked me ___ I liked pizza. [en, 1 blank(s)] | if (full) | — | that ; do ; what | — | — | false |
| g4u04.gi.reported-questions.mc.002 | multiple-choice | Welche Wiedergabe von „Where do you live?“ ist richtig? [de] | She asked me where I lived. (full) | — | She asked me where did I live. ; She asked me where do I live. ; She asked me where I did live. | — | — | false |
| g4u04.gi.reported-questions.mc.003 | multiple-choice | „Do you have a dog?“, fragte sie ihn. Welche Wiedergabe ist richtig? [de] | She asked him if he had a dog. (full) | — | She asked him did he have a dog. ; She asked him that he had a dog. ; She asked him if did he have a dog. | — | — | false |
| g4u04.gi.reported-questions.mc.004 | multiple-choice | „Can I borrow your pen?“ Welche Wiedergabe ist richtig? [de] | He asked if he could borrow my pen. (full) | — | He asked if could he borrow my pen. ; He asked that he could borrow my pen. ; He asked if he can borrow my pen. | — | — | false |
| g4u04.gi.reported-questions.mc.005 | multiple-choice | „When can you start?“, fragte der Chef. Welche Wiedergabe ist richtig? [de] | The boss asked me when I could start. (full) | — | The boss asked me when could I start. ; The boss asked me when can I start. ; The boss asked me that I could start. | — | — | false |
| g4u04.gi.reported-questions.mc.006 | multiple-choice | „Do you like your job?“ Welche Wiedergabe ist richtig? [de] | He asked me if I liked my job. (full) | — | He asked me do I like my job. ; He asked me that I liked my job. ; He asked me if did I like my job. | — | — | false |
| g4u04.gi.reported-questions.mc.007 | multiple-choice | Welche Wiedergabe von „Are you happy?“ ist richtig? [de] | He asked me if I was happy. (full) | — | He asked me if was I happy. ; He asked me are you happy. ; He asked me that I was happy. | — | — | false |
| g4u04.gi.reported-questions.mc.008 | multiple-choice | „Why did you want the job?“ Welche Wiedergabe ist richtig? [de] | She asked me why I had wanted the job. (full) | — | She asked me why did I want the job. ; She asked me why I did want the job. ; She asked me why had I wanted the job. | — | — | false |
| g4u04.gi.reported-questions.mt.001 | matching | Ordne jeder direkten Frage ihre Wiedergabe zu. [de] | — | — | — | "Do you like music?" ↔ She asked if I liked music. ; "Where is the station?" ↔ He asked where the station was. ; "Can you cook?" ↔ They asked if I could cook. ; "What time is it?" ↔ She asked what time it was. ; "Are you happy?" ↔ He asked if I was happy. | — | false |
| g4u04.gi.reported-questions.mt.002 | matching | Ordne jeder Frage aus dem Vorstellungsgespräch ihre Wiedergabe zu. [de] | — | — | — | "Do you have any experience?" ↔ She asked if I had any experience. ; "When can you start?" ↔ He asked when I could start. ; "What is your ambition?" ↔ She asked what my ambition was. ; "Will you work at weekends?" ↔ He asked if I would work at weekends. ; "Why do you want this job?" ↔ She asked why I wanted the job. | — | false |
| g4u04.gi.reported-questions.qf.001 | question-formation | Schreib die direkte Frage, die dahintersteckt: She asked me if I could work Saturdays. [de] | Can you work Saturdays? (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.qf.002 | question-formation | Schreib die direkte Frage, die dahintersteckt: She asked me where I had worked before. [de] | Where have you worked before? (full) ; Where did you work before? (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.qf.003 | question-formation | Schreib die direkte Frage, die dahintersteckt: She asked me what my ambition was. [de] | What is your ambition? (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.sb.001 | sentence-building | she / asked / me / if / I / was / tired [en] | She asked me if I was tired. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.sb.002 | sentence-building | asked / he / me / where / I / lived / before [en] | He asked me where I lived before. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.sb.003 | sentence-building | they / asked / me / when / I / could / start [en] | They asked me when I could start. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.sb.004 | sentence-building | asked / she / me / if / I / had / any / experience [en] | She asked me if I had any experience. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.sb.005 | sentence-building | asked / she / me / why / I / wanted / the / job [en] | She asked me why I wanted the job. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.001 | transformation | „Do you like pizza?“ Gib die Frage so wieder, wie sie gestellt wurde. Beginne mit: She asked me ... [de] | She asked me if I liked pizza. (full) ; She asked me whether I liked pizza. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.002 | transformation | „Where do you live?“ Gib die Frage so wieder, wie sie gestellt wurde. Beginne mit: He asked me ... [de] | He asked me where I lived. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.003 | transformation | Beim Vorstellungsgespräch: „Can you start on Monday?“ Gib die Frage so wieder, wie sie gestellt wurde. Beginne mit: They asked me ... [de] | They asked me if I could start on Monday. (full) ; They asked me whether I could start on Monday. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.004 | transformation | Beim Vorstellungsgespräch: „How much do you want to earn?“ Gib die Frage so wieder, wie sie gestellt wurde. Beginne mit: She asked me ... [de] | She asked me how much I wanted to earn. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.005 | transformation | Beim Vorstellungsgespräch: „Will you work at weekends?“ Gib die Frage so wieder, wie sie gestellt wurde. Beginne mit: He asked me ... [de] | He asked me if I would work at weekends. (full) ; He asked me whether I would work at weekends. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.006 | transformation | „Why do you want this job?“ Gib die Frage so wieder, wie sie gestellt wurde. Beginne mit: The employer asked me ... [de] | The employer asked me why I wanted the job. (full) ; The employer asked me why I wanted this job. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.007 | transformation | Erzähle deiner Freundin, was im Vorstellungsgespräch gefragt wurde: „What is your ambition?“ — He asked me what my ambition ___ (be). [de, 1 blank(s)] | was (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.008 | transformation | Später erzählst du deinem Vater: „How many languages can you speak?“ — She asked me how many languages I ___ (can) speak. [de, 1 blank(s)] | could (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.009 | transformation | Beim Arzt: „Do you feel OK?“ Erzähle es deiner Mutter: She asked me ___ I ___ (feel) OK. [de, 2 blank(s)] | if \| felt (full) ; whether \| felt (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.010 | transformation | „Are you ready?“ Gib die Frage so wieder, wie sie gestellt wurde. Beginne mit: She asked me ... [de] | She asked me if I was ready. (full) ; She asked me whether I was ready. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.011 | transformation | Gib wieder, was im Vorstellungsgespräch gefragt wurde: „Have you worked before?“ Beginne mit: He asked me ... [de] | He asked me if I had worked before. (full) ; He asked me whether I had worked before. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.012 | transformation | „Do you have a dog?“ Gib die Frage so wieder, wie sie gestellt wurde. Beginne mit: He asked Rover ... [de] | He asked Rover if he had a dog. (full) ; He asked Rover whether he had a dog. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tf.013 | transformation | „What do you do at the weekend?“ Gib die Frage so wieder, wie sie gestellt wurde. Beginne mit: She asked me ... [de] | She asked me what I did at the weekend. (full) | — | — | — | — | false |
| g4u04.gi.reported-questions.tr.002 | translation | Er fragte mich, wo ich wohnte. [de] | He asked me where I lived. (full) | deToEn | — | — | — | false |
| g4u04.gi.reported-questions.tr.004 | translation | Er fragte mich, was meine Fähigkeiten waren. [de] | He asked me what my skills were. (full) | deToEn | — | — | — | false |
| g4u04.gi.reported-questions.tr.007 | translation | Mia fragte mich, ob ich einen Hund hatte. [de] | Mia asked me if I had a dog. (full) ; Mia asked me whether I had a dog. (full) | deToEn | — | — | — | false |
| g4u04.gi.reported-questions.tr.008 | translation | Sue fragte mich, ob ich am Montag anfangen könnte. [de] | Sue asked me if I could start on Monday. (full) ; Sue asked me whether I could start on Monday. (full) | deToEn | — | — | — | false |
| g4u04.gi.reported-questions.tr.009 | translation | Mia asked me if I liked my job. [en] | Mia fragte mich, ob ich meinen Job mochte. (full) ; Mia fragte mich, ob ich meine Arbeit mochte. (full) ; Mia fragte mich, ob mir mein Job gefiel. (partial) | enToDe | — | — | — | false |
| g4u04.gi.reported-questions.tr.010 | translation | Sue fragte mich, ob ich Erfahrung hatte. [de] | Sue asked me if I had any experience. (full) ; Sue asked me whether I had any experience. (full) ; Sue asked me if I had experience. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u04/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u04",
  "lens": "answers",
  "itemsHash": "bd4bc1a2ccf2",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 120, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
