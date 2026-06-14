# Verify lens — answers — g2-u04 (round 2)

<!-- domigo:verify answers g2-u04 items=b34faed5561b prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (50)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u04.w.ago | (two days) ago | Before now; not happening now. | Long ___, there were many crocodiles in this river. | ago (full) | ago (full) | forever ; nobody ; less |
| g2u04.w.anaconda | anaconda | A very long heavy snake. It lives near rivers and can be as long as a car. | The ___ in the river was as long as a car. | anaconda (full) | anaconda (full) ; anacondas (full) | crocodile ; dolphin ; antelope |
| g2u04.w.antelope | antelope | A fast wild mammal with long legs. It lives in hot places and runs from lions. | The ___ has got long legs and runs very fast from lions. | antelope (full) | antelope (full) ; antelopes (full) | dolphin ; crocodile ; shark |
| g2u04.w.bat | bat | A small dark mammal that can fly at night. It is not a bird. | A ___ can fly in the dark at night. | bat (full) | bat (full) ; bats (full) | pigeon ; ostrich ; parrot |
| g2u04.w.centimetre | centimetre | A small unit for how long a thing is. | My pencil is about 15 ___ long. | centimetres (full) ; centimeters (partial) ; cm (partial) | centimetre (full) ; centimetres (full) ; centimeter (partial) ; centimeters (partial) | ton ; speed ; length |
| g2u04.w.cheetah | cheetah | A wild cat with spots. It is the fastest mammal on land. | The ___ can run faster than any car on land. | cheetah (full) | cheetah (full) ; cheetahs (full) | giraffe ; whale ; crocodile |
| g2u04.w.chimpanzee | chimpanzee | A very clever mammal, like a big monkey. | The ___ at the zoo is as clever as a small child. | chimpanzee (full) | chimpanzee (full) ; chimpanzees (full) ; chimp (partial) ; chimps (partial) | giraffe ; dolphin ; antelope |
| g2u04.w.climate-change | climate change | When the weather of the world becomes warmer. | Many animals die because of ___. | climate change (full) | climate change (full) | luck ; speed ; reason |
| g2u04.w.crocodile | crocodile | A big green reptile with long teeth. It lives near rivers in hot places. | The big green ___ was next to the river with its mouth open. | crocodile (full) | crocodile (full) ; crocodiles (full) ; croc (partial) | dolphin ; ostrich ; antelope |
| g2u04.w.dangerous | dangerous | This can hurt you or make you ill. | Playing on the road is very ___. | dangerous (full) | dangerous (full) | hairy ; intelligent ; female |
| g2u04.w.desert | desert | A very hot place with a lot of sand and almost no rain. | There are no ___ in England. | deserts (full) | desert (full) ; deserts (full) | centimetres ; tons ; trucks |
| g2u04.w.dolphin | dolphin | A clever sea mammal that jumps up out of the water. | The clever ___ jumped up out of the river. | dolphin (full) | dolphin (full) ; dolphins (full) | antelope ; giraffe ; rhino |
| g2u04.w.farmer | farmer | A man or a woman who keeps pigs and horses. | A ___ near the river had a big farm. | farmer (full) | farmer (full) ; farmers (full) | scientist ; human ; truck |
| g2u04.w.fast | fast | Going at a great speed. | Cheetahs can run very ___. They are faster than a car. | fast (full) | fast (full) | heavy ; hairy ; venomous |
| g2u04.w.female | female | A girl or a woman; the mother animal in a family. | The ___ toad is dark green; the male toad is golden red. | female (full) | female (full) ; females (full) | incredible ; hairy ; smart |
| g2u04.w.forever | forever | For all time; with no end. | We want to be best friends ___. | forever (full) | forever (full) | ago ; nobody ; less |
| g2u04.w.giraffe | giraffe | The tallest mammal on Earth. It has got a very long neck and spots. | The ___ is the tallest animal in the world. | giraffe (full) | giraffe (full) ; giraffes (full) | ostrich ; antelope ; rhino |
| g2u04.w.hairy | hairy | With a lot of hair or fur on it. | My dog has got lots of fur. It is very ___. | hairy (full) | hairy (full) | heavy ; venomous ; dangerous |
| g2u04.w.heavy | heavy | It weighs so much that you cannot carry it. | My school bag is too ___ to carry today. | heavy (full) | heavy (full) | hairy ; fast ; smart |
| g2u04.w.human | human | A man, a woman or a child. | I wanted to show the crocodile that not all ___ are bad. | humans (full) | human (full) ; humans (full) ; human being (partial) | mammals ; farmers ; scientists |
| g2u04.w.incredible | incredible | Very, very good or very surprising. | That's an ___ but true story. | incredible (full) | incredible (full) | dangerous ; hairy ; venomous |
| g2u04.w.intelligent | intelligent | Very good at thinking and learning. | Dolphins are very ___ animals. They can think very well. | intelligent (full) | intelligent (full) | hairy ; heavy ; venomous |
| g2u04.w.length | length | How long a thing is from end to end. | An anaconda can be six metres long. That is a very big ___. | length (full) | length (full) ; lengths (full) | speed ; ton ; reason |
| g2u04.w.less | less | A smaller number; not as much. | I eat ___ sugar now because I want to be healthy. | less (full) | less (full) | forever ; ago ; nobody |
| g2u04.w.luck | luck | When good things happen to you by chance. | What animal can bring us ___? | luck (full) | luck (full) | speed ; reason ; length |
| g2u04.w.male | male | A boy or a man; the father animal in a family. | The ___ toad is golden red; the female toad is dark green. | male (full) | male (full) ; males (full) | incredible ; venomous ; heavy |
| g2u04.w.mammal | mammal | An animal that drinks milk from its mother when it is a baby. | Elephants and lions are ___. They give milk to their young. | mammals (full) | mammal (full) ; mammals (full) | deserts ; tons ; trucks |
| g2u04.w.mosquito | mosquito | A tiny insect that bites you. It can carry malaria. | A tiny ___ can carry malaria when it bites you. | mosquito (full) | mosquito (full) ; mosquitos (full) ; mosquitoes (full) | bat ; pigeon ; parrot |
| g2u04.w.nobody | nobody | No one at all. | There was ___ in the park, so I played alone. | nobody (full) ; no one (full) | nobody (full) ; no one (full) | forever ; ago ; less |
| g2u04.w.ostrich | ostrich | A very big bird that cannot fly. It runs fast on its long legs. | An ___ is taller than a man. | ostrich (full) | ostrich (full) ; ostriches (full) | giraffe ; pigeon ; antelope |
| g2u04.w.parrot | parrot | A colourful bird that can talk like you. | The ___ at the zoo can talk just like us. | parrot (full) | parrot (full) ; parrots (full) | pigeon ; ostrich ; giraffe |
| g2u04.w.pigeon | pigeon | A small grey bird that lives in a city. There are many in the park. | There are many grey ___ in the city. | pigeons (full) | pigeon (full) ; pigeons (full) | parrot ; ostrich ; bat |
| g2u04.w.powerful | powerful | Very strong; you can push over a big tree. | Rhinos are very ___. They can push over a tree. | powerful (full) | powerful (full) | hairy ; venomous ; female |
| g2u04.w.reason | reason | Why a thing happens, or why you do a thing. | Is there a ___ why you don't want to come? | reason (full) | reason (full) ; reasons (full) | speed ; length ; luck |
| g2u04.w.rhino | rhino | A big strong grey mammal with a horn on its nose. | A ___ can be bigger than a truck. | rhino (full) | rhino (full) ; rhinos (full) | dolphin ; antelope ; bat |
| g2u04.w.scientist | scientist | A man or a woman who studies animals and nature. | I want to study animals one day, so I want to be a ___. | scientist (full) | scientist (full) ; scientists (full) | farmer ; human ; truck |
| g2u04.w.shark | shark | A big fish with long teeth that lives in the sea. | Some people are scared of swimming in the sea because of ___. | sharks (full) | shark (full) ; sharks (full) | dolphin ; antelope ; giraffe |
| g2u04.w.smart | smart | Good at learning and thinking quickly. | Our new dog is very ___. He understands every word I say. | smart (full) | smart (full) | hairy ; heavy ; venomous |
| g2u04.w.speed | speed | How fast a thing can go. | A cheetah can run at a very fast ___. | speed (full) | speed (full) ; speeds (full) | length ; ton ; reason |
| g2u04.w.strong | strong | With a lot of power; you can carry heavy boxes. | I'm not as ___ as my best friend. He can carry big boxes. | strong (full) | strong (full) | heavy ; hairy ; fast |
| g2u04.w.to-carry | to carry | To hold a thing and bring it to a new place. | Mosquitos can ___ malaria. | carry (full) | carry (full) ; to carry (full) ; carries (full) ; carried (full) | weigh ; protect ; share |
| g2u04.w.to-die | to die | To stop living; to come to the end of life. | Many people ___ from malaria every year. | die (full) | die (full) ; to die (full) ; dies (full) ; died (full) | carry ; weigh ; share |
| g2u04.w.to-die-out | to die out | When the last one of a kind is gone forever. | These crocodiles could ___ out one day if we don't help them. | die (full) | die out (full) ; to die out (full) ; died out (full) ; dies out (full) | carry ; weigh ; protect |
| g2u04.w.to-protect | to protect | To keep a friend or a thing safe from danger. | We must ___ wild animals and keep them safe. | protect (full) | protect (full) ; to protect (full) ; protects (full) ; protected (full) | carry ; weigh ; share |
| g2u04.w.to-share | to share | To give some of what you have to a friend. | Please ___ your sweets with your sister. | share (full) | share (full) ; to share (full) ; shares (full) ; shared (full) | carry ; weigh ; protect |
| g2u04.w.to-weigh | to weigh | To find out how heavy a thing is. | A big shark can ___ more than two tons. | weigh (full) | weigh (full) ; to weigh (full) ; weighs (full) ; weighed (full) | carry ; share ; protect |
| g2u04.w.ton | ton | A very heavy unit of weight: one thousand kilograms. | A whale can weigh 150 ___. | tons (full) ; tonnes (partial) | ton (full) ; tons (full) ; tonne (partial) ; tonnes (partial) | centimetres ; deserts ; lengths |
| g2u04.w.truck | truck | A very big thing for the road that can bring heavy boxes from place to place. | A rhino can be bigger than a ___. | truck (full) | truck (full) ; trucks (full) ; lorry (partial) | desert ; mammal ; scientist |
| g2u04.w.venomous | venomous | Having poison in its bite that can make you very ill. | A ___ snake has got poison in its bite. | venomous (full) | venomous (full) | hairy ; heavy ; female |
| g2u04.w.whale | whale | The biggest mammal on Earth. It lives in the sea. | The ___ is the biggest and heaviest mammal of all. | whale (full) | whale (full) ; whales (full) | antelope ; giraffe ; ostrich |

## Grammar items (66)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u04.gi.as-as.cp.001 | context-picker | You and a friend look at two rats. They are both very big. [en] | My rat is as big as your rat. (full) | — | My rat is so big as your rat. ; My rat is as bigger as your rat. ; My rat is as big like your rat. | — | — | false |
| g2u04.gi.as-as.ec.001 | error-correction | An anaconda is so long as a crocodile. [en] | An anaconda is as long as a crocodile. (full) ; as long as (partial) | — | — | — | — | false |
| g2u04.gi.as-as.ec.002 | error-correction | A rhino is as stronger as a hippo. [en] | A rhino is as strong as a hippo. (full) ; as strong as (partial) | — | — | — | — | false |
| g2u04.gi.as-as.ec.003 | error-correction | A dolphin is as smart like a chimpanzee. [en] | A dolphin is as smart as a chimpanzee. (full) ; as smart as (partial) | — | — | — | — | false |
| g2u04.gi.as-as.gf.001 | gap-fill | A chimpanzee is ___ a child. They are both clever. [en, 1 blank(s)] | as clever as (full) | — | so clever as ; as cleverer as ; as clever like | — | — | false |
| g2u04.gi.as-as.gf.002 | gap-fill | The boy is ___ the chimpanzee. They are both very big. [en, 1 blank(s)] | as big as (full) | — | so big as ; as bigger as ; as big like | — | — | false |
| g2u04.gi.as-as.gf.003 | gap-fill | An anaconda is ___ a crocodile. They are both very long. [en, 1 blank(s)] | as long as (full) | — | so long as ; as longer as ; as long like | — | — | false |
| g2u04.gi.as-as.gf.004 | gap-fill | An antelope is fast, but it is ___ a cheetah. The cheetah is faster. [en, 1 blank(s)] | not as fast as (full) | — | not so fast as ; not as faster as ; as not fast as | — | — | false |
| g2u04.gi.as-as.gf.005 | gap-fill | A dolphin is ___ a shark. The shark is more dangerous. [en, 1 blank(s)] | not as dangerous as (full) | — | not so dangerous as ; as not dangerous as ; not as more dangerous as | — | — | false |
| g2u04.gi.as-as.gf.006 | gap-fill | A pigeon is ___ a parrot. They are both quite small. [en, 1 blank(s)] | as small as (full) | — | so small as ; as smaller as ; as small like | — | — | false |
| g2u04.gi.as-as.gf.007 | gap-fill | I am ___ my best friend. We are both quite strong. [en, 1 blank(s)] | as strong as (full) | — | so strong as ; as stronger as ; as strong like | — | — | false |
| g2u04.gi.as-as.gs.002 | group-sort | How big? How fast? [en] | — | — | — | — | as … as: An anaconda is as long as a crocodile., A chimpanzee is as clever as a dolphin. \| not as … as: An antelope is not as fast as a cheetah., A dolphin is not as dangerous as a shark. | false |
| g2u04.gi.as-as.mc.001 | multiple-choice | A chimpanzee and a dolphin are both clever. [en] | A chimpanzee is as clever as a dolphin. (full) | — | A chimpanzee is so clever as a dolphin. ; A chimpanzee is as cleverer as a dolphin. ; A chimpanzee is as clever like a dolphin. | — | — | false |
| g2u04.gi.as-as.mc.002 | multiple-choice | An elephant weighs much more than an antelope. [en] | An antelope is not as heavy as an elephant. (full) | — | An antelope is not so heavy as an elephant. ; An antelope is as not heavy as an elephant. ; An antelope is not as heavier as an elephant. | — | — | false |
| g2u04.gi.as-as.mt.001 | matching | as ... as [en] | — | — | — | A chimpanzee is as clever ↔ as a dolphin. ; A pigeon is not as big ↔ as an ostrich. ; An anaconda is as long ↔ as a crocodile. ; An antelope is not as fast ↔ as a cheetah. | — | false |
| g2u04.gi.as-as.qf.001 | question-formation | a cheetah / fast / an antelope [en] | Is a cheetah as fast as an antelope? (full) ; Is a cheetah as fast as an antelope (full) ; Is an antelope as fast as a cheetah? (partial) | — | — | — | — | false |
| g2u04.gi.as-as.sb.001 | sentence-building | as / is / a / dolphin / as / a / chimpanzee / smart [en] | A dolphin is as smart as a chimpanzee. (full) ; A dolphin is as smart as a chimpanzee (full) | — | like | — | — | false |
| g2u04.gi.as-as.tf.001 | transformation | A dog is faster than a tortoise. (not as ... as) A tortoise is ___. [en, 1 blank(s)] | not as fast as a dog (full) ; a tortoise is not as fast as a dog (partial) | — | — | — | — | false |
| g2u04.gi.as-as.tf.002 | transformation | Your room is smaller than my room. (not as ... as) Your room is ___. [en, 1 blank(s)] | not as big as my room (full) ; your room is not as big as my room (partial) | — | — | — | — | false |
| g2u04.gi.as-as.tr.001 | translation | Ich bin so groß wie mein Papa. [de] | I am as tall as my dad. (full) ; I am as tall as my dad (full) ; I'm as tall as my dad. (full) ; I'm as tall as my dad (full) | deToEn | — | — | — | false |
| g2u04.gi.as-as.tr.002 | translation | Ein Delfin ist nicht so gefährlich wie ein Hai. [de] | A dolphin is not as dangerous as a shark. (full) ; A dolphin is not as dangerous as a shark (full) ; A dolphin isn't as dangerous as a shark. (full) ; A dolphin isn't as dangerous as a shark (full) | deToEn | — | — | — | false |
| g2u04.gi.comparatives.ag.001 | anagram | An antelope is ___ than an elephant. [en, 1 blank(s)] | faster (full) | — | — | — | — | false |
| g2u04.gi.comparatives.ag.002 | anagram | An elephant is ___ than a mouse. [en, 1 blank(s)] | heavier (full) | — | — | — | — | false |
| g2u04.gi.comparatives.cp.001 | context-picker | A cheetah's speed is 110. A rhino's speed is 55. [en] | The cheetah is faster than the rhino. (full) | — | The cheetah is more fast than the rhino. ; The cheetah is faster as the rhino. ; The cheetah is more faster than the rhino. | — | — | false |
| g2u04.gi.comparatives.ec.001 | error-correction | A cheetah is more fast than a tortoise. [en] | A cheetah is faster than a tortoise. (full) ; faster (partial) | — | — | — | — | false |
| g2u04.gi.comparatives.ec.002 | error-correction | A giraffe is more bigger than a chimpanzee. [en] | A giraffe is bigger than a chimpanzee. (full) ; bigger (partial) | — | — | — | — | false |
| g2u04.gi.comparatives.ec.003 | error-correction | An ostrich is more good at running than a pigeon. [en] | An ostrich is better at running than a pigeon. (full) ; better (partial) | — | — | — | — | false |
| g2u04.gi.comparatives.gf.001 | gap-fill | A cheetah is ___ (fast) than a rhino. [en, 1 blank(s)] | faster (full) | — | more fast ; fastest ; more faster | — | — | false |
| g2u04.gi.comparatives.gf.002 | gap-fill | A giraffe is ___ (tall) than an ostrich. [en, 1 blank(s)] | taller (full) | — | more tall ; tallest ; more taller | — | — | false |
| g2u04.gi.comparatives.gf.003 | gap-fill | An anaconda is ___ (heavy) than a crocodile. [en, 1 blank(s)] | heavier (full) | — | more heavy ; the most heavy ; more heavier | — | — | false |
| g2u04.gi.comparatives.gf.004 | gap-fill | An elephant is ___ (big) than a rhino. [en, 1 blank(s)] | bigger (full) | — | biger ; more big ; more bigger | — | — | false |
| g2u04.gi.comparatives.gf.005 | gap-fill | A dolphin is ___ (intelligent) than a pigeon. [en, 1 blank(s)] | more intelligent (full) | — | intelligenter ; most intelligent ; more intelligenter | — | — | false |
| g2u04.gi.comparatives.gf.006 | gap-fill | A rabbit is bad at climbing, but a pig is ___ (bad) than a rabbit. [en, 1 blank(s)] | worse (full) | — | badder ; more bad ; the worst | — | — | false |
| g2u04.gi.comparatives.gf.007 | gap-fill | My rat is ___ (hairy) than your dog, and it is ___ (small) too. [en, 2 blank(s)] | hairier \| smaller (full) | — | — | — | — | false |
| g2u04.gi.comparatives.gs.002 | group-sort | Which is bigger? [en] | — | — | — | — | big → bigger: fast, tall, strong, small \| difficult → more difficult: dangerous, intelligent, powerful, beautiful | false |
| g2u04.gi.comparatives.mc.001 | multiple-choice | Look at a dog and a mouse. [en] | A dog is bigger than a mouse. (full) | — | A dog is more bigger than a mouse. ; A dog is biger than a mouse. ; A dog is big than a mouse. | — | — | false |
| g2u04.gi.comparatives.mc.002 | multiple-choice | It is a cold, wet morning. [en] | The weather is worse today than yesterday. (full) | — | The weather is more bad today than yesterday. ; The weather is more worse today than yesterday. ; The weather is the worse today than yesterday. | — | — | false |
| g2u04.gi.comparatives.mc.003 | multiple-choice | A mosquito is ___ (small) than a bat. [en, 1 blank(s)] | smaller (full) | — | more small ; smallest ; more smaller | — | — | false |
| g2u04.gi.comparatives.mt.001 | matching | big, bigger, biggest [en] | — | — | — | good ↔ better ; big ↔ bigger ; happy ↔ happier ; dangerous ↔ more dangerous ; bad ↔ worse | — | false |
| g2u04.gi.comparatives.qf.001 | question-formation | a rhino / heavy / a hippo [en] | Is a rhino heavier than a hippo? (full) ; Is a rhino heavier than a hippo (full) | — | — | — | — | false |
| g2u04.gi.comparatives.sb.002 | sentence-building | is / a / shark / than / dolphin / a / more dangerous [en] | A shark is more dangerous than a dolphin. (full) ; A shark is more dangerous than a dolphin (full) | — | as ; the | — | — | false |
| g2u04.gi.comparatives.tf.001 | transformation | An elephant is heavy. A mouse is light. (heavy) An elephant is ___. [en, 1 blank(s)] | heavier than a mouse (full) ; an elephant is heavier than a mouse (partial) | — | — | — | — | false |
| g2u04.gi.comparatives.tf.002 | transformation | Maths is difficult. English is not. (difficult) Maths is ___. [en, 1 blank(s)] | more difficult than English (full) ; maths is more difficult than English (partial) | — | — | — | — | false |
| g2u04.gi.comparatives.tr.001 | translation | Mein Hund ist größer als deine Maus. [de] | My dog is bigger than your mouse. (full) ; My dog is bigger than your mouse (full) | deToEn | — | — | — | false |
| g2u04.gi.comparatives.tr.002 | translation | Ein Wal ist schwerer als ein Delfin. [de] | A whale is heavier than a dolphin. (full) ; A whale is heavier than a dolphin (full) | deToEn | — | — | — | false |
| g2u04.gi.superlatives.ag.001 | anagram | The whale is the ___ mammal. [en, 1 blank(s)] | heaviest (full) | — | — | — | — | false |
| g2u04.gi.superlatives.cp.001 | context-picker | The giraffe is taller than the ostrich and the elephant. [en] | The giraffe is the tallest. (full) | — | The giraffe is tallest. ; The giraffe is the most tall. ; The giraffe is the most tallest. | — | — | false |
| g2u04.gi.superlatives.ec.001 | error-correction | The whale is the most biggest mammal. [en] | The whale is the biggest mammal. (full) ; the biggest (partial) | — | — | — | — | false |
| g2u04.gi.superlatives.ec.002 | error-correction | The cheetah is fastest land mammal. [en] | The cheetah is the fastest land mammal. (full) ; the fastest (partial) | — | — | — | — | false |
| g2u04.gi.superlatives.ec.003 | error-correction | This is the most good book about mammals I have read. [en] | This is the best book about mammals I have read. (full) ; the best (partial) | — | — | — | — | false |
| g2u04.gi.superlatives.gf.001 | gap-fill | The cheetah is ___ (fast) land mammal. [en, 1 blank(s)] | the fastest (full) | — | fastest ; the most fast ; the faster | — | — | false |
| g2u04.gi.superlatives.gf.002 | gap-fill | The whale is ___ (heavy) mammal of all. [en, 1 blank(s)] | the heaviest (full) | — | the most heavy ; heaviest ; the more heavy | — | — | false |
| g2u04.gi.superlatives.gf.003 | gap-fill | A crocodile can be ___ (long) of all crocodiles. [en, 1 blank(s)] | the longest (full) | — | the most long ; longest ; the longer | — | — | false |
| g2u04.gi.superlatives.gf.004 | gap-fill | The mosquito is ___ (dangerous) for people of all. [en, 1 blank(s)] | the most dangerous (full) | — | the dangerousest ; most dangerous ; the more dangerous | — | — | false |
| g2u04.gi.superlatives.gf.005 | gap-fill | I think the dolphin is ___ (intelligent) mammal of all. [en, 1 blank(s)] | the most intelligent (full) | — | the intelligentest ; most intelligent ; the more intelligent | — | — | false |
| g2u04.gi.superlatives.gf.006 | gap-fill | A pig is bad at climbing, but a hippo is ___ (bad) at it. [en, 1 blank(s)] | the worst (full) | — | the baddest ; the most bad ; worst | — | — | false |
| g2u04.gi.superlatives.gf.007 | gap-fill | The anaconda is one of ___ (long) of all. [en, 1 blank(s)] | the longest (full) | — | the longer ; longest ; the most long | — | — | false |
| g2u04.gi.superlatives.gs.002 | group-sort | Which is the biggest? [en] | — | — | — | — | the biggest: tall, long, heavy, fast \| the most difficult: dangerous, intelligent, venomous, powerful | false |
| g2u04.gi.superlatives.mc.001 | multiple-choice | Sam runs faster than anyone in the class. [en] | Sam is the fastest runner in our class. (full) | — | Sam is the most fastest runner in our class. ; Sam is the faster runner in our class. ; Sam is fastest runner in our class. | — | — | false |
| g2u04.gi.superlatives.mc.002 | multiple-choice | No mammal is more powerful than the whale. [en] | The whale is the most powerful mammal of all. (full) | — | The whale is the powerfulest mammal of all. ; The whale is most powerful mammal of all. ; The whale is the more powerful mammal of all. | — | — | false |
| g2u04.gi.superlatives.mt.001 | matching | big and the biggest [en] | — | — | — | good ↔ the best ; bad ↔ the worst ; happy ↔ the happiest ; beautiful ↔ the most beautiful ; big ↔ the biggest | — | false |
| g2u04.gi.superlatives.qf.001 | question-formation | which / tall / a giraffe / an ostrich / an elephant [en] | Which is the tallest? (full) ; Which is the tallest (full) ; Which is the tallest, a giraffe, an ostrich or an elephant? (partial) | — | — | — | — | false |
| g2u04.gi.superlatives.sb.001 | sentence-building | the / is / cheetah / land mammal / the / fastest [en] | The cheetah is the fastest land mammal. (full) ; The cheetah is the fastest land mammal (full) | — | most | — | — | false |
| g2u04.gi.superlatives.tf.001 | transformation | The bat is small. No mammal is smaller. (small) The bat is ___. [en, 1 blank(s)] | the smallest mammal (full) ; the bat is the smallest mammal (partial) ; the smallest (partial) | — | — | — | — | false |
| g2u04.gi.superlatives.tr.001 | translation | Der Wal ist das größte Säugetier. [de] | The whale is the biggest mammal. (full) ; The whale is the biggest mammal (full) | deToEn | — | — | — | false |
| g2u04.gi.superlatives.tr.002 | translation | Mathe ist das schwierigste Fach. [de] | Maths is the most difficult subject. (full) ; Maths is the most difficult subject (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u04/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u04",
  "lens": "answers",
  "itemsHash": "b34faed5561b",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 116, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
