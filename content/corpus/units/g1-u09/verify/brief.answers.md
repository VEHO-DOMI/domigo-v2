# Verify lens — answers — g1-u09 (round 1)

<!-- domigo:verify answers g1-u09 items=ba1d244426bd prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (57)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u09.w.a-day | (...) a day | It shows how often, like two times in the morning and the evening. | She gives her dog food three times ___ day. | a (full) | a day (full) ; per day (partial) | a week ; once ; twice |
| g1u09.w.a-week | (...) a week | It shows how often, like one time from Monday to Sunday. | I give my spider food once ___ week. | a (full) | a week (full) ; per week (partial) | a day ; once ; twice |
| g1u09.w.across | across (Britain) | It is in all of a big country. | There are many dogs ___ Britain. | across (full) | across (full) | near ; far away ; behind |
| g1u09.w.aunty | aunty | She is the sister of your mum or the sister of the man in your family. | My ___ Jane is my mum's sister. | aunty (full) | aunty (full) ; auntie (partial) ; aunt (partial) | mother ; daughter ; grandpa |
| g1u09.w.basket | basket | It is a thing you put food or things in to carry them. | She has two ___ for the food. | baskets (full) | basket (full) | box ; cage ; tank |
| g1u09.w.bat | bat | It flies at night and it sleeps in the day. | A ___ sleeps in the day and flies at night. | bat (full) | bat (full) | owl ; mouse ; rat |
| g1u09.w.beginning | beginning | It is the first part of a book or film. | The ___ of the book is very good. | beginning (full) | beginning (full) ; start (partial) | ending ; letter ; newspaper |
| g1u09.w.best-wishes | best wishes | You write these at the end of a letter to a friend. | I end my letter like this: Best ___, Tom. | wishes (full) | best wishes (full) | dear ; ending ; letter |
| g1u09.w.box | box | You put your school things in this. It is made of paper. | The spider lives in a ___ and you feed it once a week. | box (full) | box (full) | cage ; tank ; basket |
| g1u09.w.budgie | budgie | It is a small bird in a cage. It can talk. | The ___ in its cage can talk. | budgie (full) ; budgerigar (partial) | budgie (full) ; budgerigar (partial) | owl ; rabbit ; fish |
| g1u09.w.cage | cage | A bird lives in this. It has thin bars. | The budgie lives in its ___ all day. | cage (full) | cage (full) | tank ; box ; terrarium |
| g1u09.w.camel | camel | It is big with a long neck and lives where it is hot. | The big ___ at the zoo can go a long time with no milk or food. | camel (full) | camel (full) | zebra ; elephant ; pony |
| g1u09.w.cuddly-toy | cuddly toy | It is a soft thing like a bear that a child takes to bed. | He plays all day with his soft ___. | cuddly toy (full) ; cuddly toys (full) | cuddly toy (full) | basket ; letter ; newspaper |
| g1u09.w.dangerous | dangerous | It is not safe and it can hurt you. | Snakes can hurt you. They are ___. | dangerous (full) | dangerous (full) | unusual ; personal ; near |
| g1u09.w.daughter | daughter | It is a girl child in a family. | Clare is her ___. She is a girl. | daughter (full) | daughter (full) | mother ; aunty ; owner |
| g1u09.w.dear | dear | It is a nice word like Hello at the start of a letter. | ___ Aunty Olivia, thank you for your letter. | Dear (full) | dear (full) | best wishes ; letter ; ending |
| g1u09.w.elephant | elephant | It is very big and grey with big ears and a very long nose. | The ___ at the zoo is grey with big ears and a long nose. | elephant (full) | elephant (full) | zebra ; camel ; shark |
| g1u09.w.ending | ending | It is the last part of a book or film. | The ___ of the film is very sad. | ending (full) | ending (full) ; end (partial) | beginning ; letter ; newspaper |
| g1u09.w.everybody | everybody | It is all the children in the class, not one child. | There is no Archie, and ___ is very sad. | everybody (full) ; everyone (partial) | everybody (full) ; everyone (partial) | owner ; mother ; daughter |
| g1u09.w.far-away | far away | It is not near here. It is a long way from here. | Grandpa lives ___, so we go in the car. | far away (full) | far away (full) | near ; across ; dangerous |
| g1u09.w.farm | farm | Horses, pigs and cows live here in the woods. | She lives on a ___ with horses and pigs. | farm (full) | farm (full) | zoo ; park ; city |
| g1u09.w.fish | fish | It can swim and you can keep it in a tank. | My pet ___ swim in a big tank with water. | fish (full) | fish (full) | budgie ; rabbit ; lizard |
| g1u09.w.fur | fur | It is the soft hair on a cat or a dog. | My rabbit has ___ on its body, lots of it. | fur (full) | fur (full) | noise ; letter ; basket |
| g1u09.w.grandpa | grandpa | He is the old man in your family. He is your mum's father. | My ___ lives on a farm with horses. | grandpa (full) | grandpa (full) ; grandfather (partial) ; grandad (partial) | mother ; aunty ; owner |
| g1u09.w.guinea-pig | guinea pig | It is small with no long ears and eats carrots in its cage. | My ___ is small and eats carrots in its cage. | guinea pig (full) | guinea pig (full) | rabbit ; mouse ; budgie |
| g1u09.w.letter | letter | You write it and send it to a friend. | Thank you for your ___, Harry. | letter (full) | letter (full) | newspaper ; basket ; noise |
| g1u09.w.lizard | lizard | It is small and green and lives in a terrarium. | The ___ lives in a terrarium with rocks and a long tail. | lizard (full) | lizard (full) | spider ; rat ; tortoise |
| g1u09.w.man | man (pl men) | It is a boy when he is big. He is not a girl or a woman. | The ___ near Chester has a camel at his farm. | man (full) | man (full) ; men (full) | mother ; daughter ; owner |
| g1u09.w.mother | mother | It is the woman in your family. You are her child. | Clare and her ___ drive away in the car. | mother (full) | mother (full) ; mum (partial) | daughter ; aunty ; grandpa |
| g1u09.w.mouse | mouse | It is very small and grey and a cat runs after it. | A little grey ___ has big ears and a long tail. | mouse (full) | mouse (full) | rat ; spider ; budgie |
| g1u09.w.mouse-2 | mouse (pl mice) | It is very small and grey. | I have one ___ and my friend has four mice. | mouse (full) | mouse (full) ; mice (full) | rat ; spider ; budgie |
| g1u09.w.near | near | It is close to a place. It is not far. | The Smith family lives ___ London. | near (full) | near (full) | far away ; across ; dangerous |
| g1u09.w.newspaper | newspaper | You read it for the news. It is not a book. | Mum reads the ___ in the morning. | newspaper (full) | newspaper (full) | letter ; basket ; box |
| g1u09.w.noise | noise | It is a loud sound that is not nice to hear. | Clare can hear a ___ in the room. What is that? | noise (full) | noise (full) ; sound (partial) | letter ; newspaper ; basket |
| g1u09.w.once | once | It is one time. | He gives his dog food ___ a day, in the morning. | once (full) | once (full) | twice ; near ; dangerous |
| g1u09.w.owl | owl | It is a big bird with big eyes. At night it is not in bed. | An ___ can fly at night and has big eyes. | owl (full) | owl (full) | budgie ; bat ; fish |
| g1u09.w.owner | owner | It is the man or woman who has the dog. | Jamie is the ___ of an unusual pet. | owner (full) | owner (full) | mother ; daughter ; man |
| g1u09.w.personal | personal | It is about you. It is not for other people to see. | Where you live is your ___ thing, for you and your family. | personal (full) | personal (full) | unusual ; dangerous ; near |
| g1u09.w.pig | pig | It is a small farm one. It is pink and likes mud. | The ___ on the farm likes to play in the mud. | pig (full) | pig (full) | pony ; zebra ; camel |
| g1u09.w.pony | pony | It is a small horse for children. | The small ___ at the farm is a little horse for children. | pony (full) | pony (full) | zebra ; camel ; rabbit |
| g1u09.w.rabbit | rabbit | It is small with very long ears and can run and jump. | My ___ has soft fur and long ears. | rabbit (full) ; bunny (partial) | rabbit (full) ; bunny (partial) | guinea pig ; mouse ; budgie |
| g1u09.w.rat | rat | It looks like a big mouse and has a long tail. | The ___ is grey and looks like a big mouse. | rat (full) | rat (full) | mouse ; spider ; lizard |
| g1u09.w.shark | shark | It is a big grey fish in the sea with sharp teeth. | Mr White's ___ is big and eats fish in its tank. | shark (full) | shark (full) | pig ; zebra ; elephant |
| g1u09.w.spider | spider | It is very small and it has eight legs. | There is a big ___ with eight legs on the wall. | spider (full) | spider (full) | rat ; mouse ; lizard |
| g1u09.w.tank | tank | You keep fish in this. It is glass and has water in it. | My pet fish swim in a big glass ___ with water. | tank (full) | tank (full) | cage ; box ; basket |
| g1u09.w.terrarium | terrarium | You keep a lizard or a small snake in this glass box. | The lizard lives in a glass ___ with rocks. | terrarium (full) | terrarium (full) | basket ; cage ; box |
| g1u09.w.to-be-interested-in | to be interested in | You like a thing and you want to know more about it. | I am ___ in dogs and books. | interested (full) | interested (full) ; be interested in (full) ; interested in (full) | dangerous ; personal ; unusual |
| g1u09.w.to-begin | to begin | To start to do a thing. | He always ___ his letter with Hi. | begins (full) | begin (full) ; to begin (full) | drive ; stay ; visit |
| g1u09.w.to-bite | to bite | A dog does this with its teeth when it is angry. | That dog is angry. It can ___ you with its teeth! | bite (full) | bite (full) ; to bite (full) | drive ; stay ; visit |
| g1u09.w.to-drive | to drive | You do this when you go in a car to a city. | On Sunday they ___ to Grandpa in the car. | drive (full) | drive (full) ; to drive (full) | stay ; visit ; need |
| g1u09.w.to-need | to need | When you must have a thing, you do this. | I ___ more food for my rabbit. It is hungry. | need (full) | need (full) ; to need (full) | drive ; stay ; visit |
| g1u09.w.to-stay | to stay | To not leave. To be here and not go. | We can't ___ here, we must go now. | stay (full) | stay (full) ; to stay (full) | drive ; visit ; begin |
| g1u09.w.to-visit | to visit | You go to your grandpa and stay with him for a day. | On Sunday they ___ Grandpa and have tea. | visit (full) | visit (full) ; to visit (full) | drive ; stay ; begin |
| g1u09.w.tortoise | tortoise | It is slow and has a hard shell on its back. | My ___ is very slow and has a shell on its back. | tortoise (full) ; turtle (partial) | tortoise (full) ; turtle (partial) | rabbit ; lizard ; guinea pig |
| g1u09.w.twice | twice | It is two times in one day. | I give my spider food ___ a week. | twice (full) | twice (full) | once ; near ; dangerous |
| g1u09.w.unusual | unusual | It is not like other things. It is not normal. | A snake is a very ___ pet. | unusual (full) | unusual (full) | dangerous ; personal ; near |
| g1u09.w.zebra | zebra | It looks like a horse with black and white stripes. | The ___ looks like a horse and lives at the zoo. | zebra (full) | zebra (full) | camel ; elephant ; pony |

## Grammar items (89)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u09.gi.irregular-plurals-3.ag.002 | anagram | Eine mouse, zwei …? Schreibe das Wort (es wird nicht mit -s gebildet). [de] | mice (full) | — | — | — | — | true |
| g1u09.gi.irregular-plurals-3.cp.001 | context-picker | Du zeigst auf einen Korb mit vielen kleinen Mäusen. Welcher Satz ist richtig? [de] | There are six mice in the basket. (full) | — | There are six mouses in the basket. ; There are six mouse in the basket. ; There is six mice in the basket. | — | — | true |
| g1u09.gi.irregular-plurals-3.ec.001 | error-correction | I have got two mouses. [en] | I have got two mice. (full) ; mice (partial) | — | — | — | — | true |
| g1u09.gi.irregular-plurals-3.ec.002 | error-correction | My friend has got two ponys. [de] | My friend has got two ponies. (full) ; ponies (partial) | — | — | — | — | true |
| g1u09.gi.irregular-plurals-3.gf.001 | gap-fill | one mouse → two ___ [en, 1 blank(s)] | mice (full) | — | — | — | — | true |
| g1u09.gi.irregular-plurals-3.gf.002 | gap-fill | one pony → two ___ [en, 1 blank(s)] | ponies (full) | — | — | — | — | true |
| g1u09.gi.irregular-plurals-3.gf.003 | gap-fill | I have got one mouse and one pony. My friend has got two ___ and two ___. [en, 2 blank(s)] | mice \| ponies (full) | — | — | — | — | true |
| g1u09.gi.irregular-plurals-3.mc.001 | multiple-choice | I have got one mouse. Now I have got two ___. [en, 1 blank(s)] | mice (full) | — | mouses ; rats ; rabbits | — | — | true |
| g1u09.gi.irregular-plurals-3.mc.002 | multiple-choice | Tom has got one pony. Now Tom has got two ___. [en, 1 blank(s)] | ponies (full) | — | dogs ; budgies ; rabbits | — | — | true |
| g1u09.gi.irregular-plurals-3.sb.001 | sentence-building | My friend / has got / two / ponies / . [en] | My friend has got two ponies. (full) | — | — | — | — | false |
| g1u09.gi.irregular-plurals-3.tf.001 | transformation | There is one mouse in the box. (two) [en] | There are two mice in the box. (full) | — | — | — | — | true |
| g1u09.gi.irregular-plurals-3.tf.002 | transformation | There is one pony on the farm. (three) [en] | There are three ponies on the farm. (full) | — | — | — | — | true |
| g1u09.gi.irregular-plurals-3.tr.001 | translation | Ich habe zwei Mäuse. [de] | I have got two mice. (full) ; I have two mice. (partial) | deToEn | — | — | — | false |
| g1u09.gi.object-pronouns.ag.003 | anagram | Ordne die Buchstaben: Look at …! (they) [de] | them (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.ag.004 | anagram | Ordne die Buchstaben: Look at …! (he) [de] | him (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.cp.001 | context-picker | Du sprichst über Mandy. Welcher Satz ist richtig? [de] | We love her. (full) | — | We love she. ; We love them. ; We love him. | — | — | false |
| g1u09.gi.object-pronouns.cp.002 | context-picker | Dein Freund möchte mit euch in den Park kommen. Welcher Satz ist richtig? [de] | Come with us to the park! (full) | — | Come with we to the park! ; Come with they to the park! ; Come with our to the park! | — | — | false |
| g1u09.gi.object-pronouns.ec.001 | error-correction | I like he very much. [en] | I like him very much. (full) ; him (partial) | — | — | — | — | true |
| g1u09.gi.object-pronouns.ec.002 | error-correction | This present is for she. [en] | This present is for her. (full) ; her (partial) | — | — | — | — | true |
| g1u09.gi.object-pronouns.ec.003 | error-correction | Give the basket to they, please. [en] | Give the basket to them, please. (full) ; them (partial) | — | — | — | — | true |
| g1u09.gi.object-pronouns.gf.001 | gap-fill | I like Tom. I like ___. [en, 1 blank(s)] | him (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.gf.003 | gap-fill | Mandy is nice. We like ___. [en, 1 blank(s)] | her (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.gf.004 | gap-fill | The present is for ___. (we) [en, 1 blank(s)] | us (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.gf.005 | gap-fill | Tom and Sam are my friends. I play with ___ on Sunday. [en, 1 blank(s)] | them (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.gf.006 | gap-fill | My friends are great. I love ___ and they love ___. [en, 2 blank(s)] | them \| me (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.gf.007 | gap-fill | Can you find ___? (I) [en, 1 blank(s)] | me (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.gs.002 | group-sort | Sortiere die Fürwörter. [de] | — | — | — | — | He runs.: I, she, we, they \| Look at him.: me, her, us, them | false |
| g1u09.gi.object-pronouns.mc.001 | multiple-choice | There's Steve. Let's talk to ___! [en, 1 blank(s)] | him (full) | — | he ; his ; they | — | — | true |
| g1u09.gi.object-pronouns.mc.002 | multiple-choice | Betty is in my class. Do you like ___? [en, 1 blank(s)] | her (full) | — | she ; him ; hers | — | — | true |
| g1u09.gi.object-pronouns.mc.003 | multiple-choice | We don't like spiders. We hate ___! [en, 1 blank(s)] | them (full) | — | they ; their ; it | — | — | false |
| g1u09.gi.object-pronouns.mt.002 | matching | Welche Antwort passt zur Frage? [de] | — | — | — | Do you like Tom? ↔ Yes, I like him. ; Do you like Mandy? ↔ Yes, I like her. ; Do you like the spiders? ↔ No, I hate them. ; Do you like me? ↔ Yes, I love you. | — | false |
| g1u09.gi.object-pronouns.mt.003 | matching | Verbinde die Wörter mit der passenden Form. [de] | — | — | — | I ↔ me ; he ↔ him ; she ↔ her ; we ↔ us ; they ↔ them | — | false |
| g1u09.gi.object-pronouns.sb.001 | sentence-building | Can / you / help / me / ? [en] | Can you help me? (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.sb.002 | sentence-building | carries / She / to / us / school [en] | She carries us to school. (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.tf.001 | transformation | I love the girls. → I love ___. [en, 1 blank(s)] | them (full) ; I love them. (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.tf.002 | transformation | Give the present to my sister and me. → Give it to ___. [en, 1 blank(s)] | us (full) ; Give it to us. (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.tf.003 | transformation | I love my dog. → I love ___. [en, 1 blank(s)] | it (full) ; I love it. (full) | — | — | — | — | false |
| g1u09.gi.object-pronouns.tr.001 | translation | Kannst du mir helfen? [de] | Can you help me? (full) | deToEn | — | — | — | false |
| g1u09.gi.object-pronouns.tr.002 | translation | Wir mögen sie nicht. (= Bob) [de] | We don't like him. (full) | deToEn | — | — | — | false |
| g1u09.gi.possessive-s.ag.004 | anagram | Wie schreibt man „Toms“ auf Englisch? (mit 's) [de] | Tom's (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.ag.005 | anagram | Wie schreibt man „Mikes“ auf Englisch? (mit 's) [de] | Mike's (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.cp.001 | context-picker | Du zeigst auf einen Hund, der Tom gehört. Welcher Satz ist richtig? [de] | This is Tom's dog. (full) | — | This is Tom dog. ; This is dog Tom. ; This is Tom is dog. | — | — | false |
| g1u09.gi.possessive-s.ec.001 | error-correction | This is Tom dog. [en] | This is Tom's dog. (full) ; Tom's (partial) | — | — | — | — | true |
| g1u09.gi.possessive-s.ec.003 | error-correction | This is the rabbit of Dan. [en] | This is Dan's rabbit. (full) ; Dan's rabbit (partial) | — | — | — | — | false |
| g1u09.gi.possessive-s.ec.004 | error-correction | Toms rabbit is in the cage. [en] | Tom's rabbit is in the cage. (full) ; Tom's (partial) | — | — | — | — | true |
| g1u09.gi.possessive-s.gf.001 | gap-fill | This is ___ dog. (Tom) [en, 1 blank(s)] | Tom's (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.gf.002 | gap-fill | Where is ___ rabbit? (Sue) [en, 1 blank(s)] | Sue's (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.gf.003 | gap-fill | My ___ pony is grey. (sister) [en, 1 blank(s)] | sister's (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.gf.004 | gap-fill | The ___ basket is here. (dog) [en, 1 blank(s)] | dog's (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.gf.005 | gap-fill | ___ shark eats fish and chips. (Mr White) [en, 1 blank(s)] | Mr White's (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.gf.006 | gap-fill | ___ tortoise eats carrots. (Pete) [en, 1 blank(s)] | Pete's (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.gf.007 | gap-fill | The ___ name is Harry. (rat) [en, 1 blank(s)] | rat's (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.gs.002 | group-sort | Was bedeutet das s hier? [de] | — | — | — | — | his dog: Tom's dog, Sue's rabbit, Mike's pony \| he is: Tom's happy., Sue's at school., Mike's nice. | false |
| g1u09.gi.possessive-s.mc.001 | multiple-choice | ___ is red. [en, 1 blank(s)] | Sam's car (full) | — | Sam car ; Sam is car ; car Sam | — | — | false |
| g1u09.gi.possessive-s.mc.002 | multiple-choice | ___ pony eats carrots. [en, 1 blank(s)] | Mike's (full) | — | Mike ; Mike is ; Mike has | — | — | false |
| g1u09.gi.possessive-s.mc.004 | multiple-choice | In welchem Satz gehört etwas jemandem? (Das 's ist hier nicht kurz für is.) [de] | My mum's car is red. (full) | — | Tom's happy today. ; Sue's at school. ; Mike's my friend. | — | — | false |
| g1u09.gi.possessive-s.mp.001 | matching-pairs | Verbinde jeden Besitzer mit seinem Tier oder Ding. [de] | — | — | — | Tom's ↔ owl ; Sue's ↔ rabbit ; Mike's ↔ pony ; Sam's ↔ car | — | false |
| g1u09.gi.possessive-s.mt.001 | matching | Verbinde die lange Form mit „of“ mit der kurzen Form mit 's. [de] | — | — | — | the dog of Sue ↔ Sue's dog ; the car of my mum ↔ my mum's car ; the pony of Mike ↔ Mike's pony ; the rabbit of Dan ↔ Dan's rabbit | — | false |
| g1u09.gi.possessive-s.sb.001 | sentence-building | Sam's / car / is / red [en] | Sam's car is red. (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.sb.002 | sentence-building | lives / Tom's / in a box / spider [en] | Tom's spider lives in a box. (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.tf.001 | transformation | Das Pony gehört Mike. → It's ___ pony. [de, 1 blank(s)] | Mike's (full) ; It's Mike's pony. (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.tf.002 | transformation | the cage of my budgie → my ___ [en, 1 blank(s)] | budgie's cage (full) ; my budgie's cage (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.tf.003 | transformation | Sue has a budgie. → It's ___ budgie. [en, 1 blank(s)] | Sue's (full) ; It's Sue's budgie. (full) | — | — | — | — | false |
| g1u09.gi.possessive-s.tr.002 | translation | Das Auto meiner Mutter ist rot. [de] | My mother's car is red. (full) ; My mum's car is red. (full) | deToEn | — | — | — | false |
| g1u09.gi.possessive-s.tr.003 | translation | Toms Kaninchen ist im Käfig. [de] | Tom's rabbit is in the cage. (full) ; Tom's rabbit is in a cage. (full) | deToEn | — | — | — | false |
| g1u09.gi.question-words.ag.001 | anagram | Es geht um den Ort (Wo?): ___ do you live? [de, 1 blank(s)] | Where (full) | — | — | — | — | false |
| g1u09.gi.question-words.cp.001 | context-picker | Du willst wissen, wo Mandy ihren Hund hält. Was ist richtig? [de] | Where does she keep her dog? (full) | — | Where she keep her dog? ; Where does she keeps her dog? ; Where she does keep her dog? | — | — | true |
| g1u09.gi.question-words.cp.002 | context-picker | Du willst wissen, wer Pizza mag. Was ist richtig? [de] | Who likes pizza? (full) | — | Who does like pizza? ; Who do like pizza? ; Who like pizza? | — | — | true |
| g1u09.gi.question-words.ec.001 | error-correction | Where you live? [en] | Where do you live? (full) ; do (partial) | — | — | — | — | false |
| g1u09.gi.question-words.ec.002 | error-correction | What does she likes? [en] | What does she like? (full) ; like (partial) | — | — | — | — | true |
| g1u09.gi.question-words.ec.003 | error-correction | Where is it? — It is a spider. [en] | What is it? (full) ; What (partial) | — | — | — | — | true |
| g1u09.gi.question-words.gf.001 | gap-fill | ___ do you live? — I live in London. [en, 1 blank(s)] | Where (full) | — | — | — | — | false |
| g1u09.gi.question-words.gf.002 | gap-fill | ___ does it eat? — It eats fish. [en, 1 blank(s)] | What (full) | — | — | — | — | false |
| g1u09.gi.question-words.gf.003 | gap-fill | ___ ___ do you feed it? — Twice a day. [en, 2 blank(s)] | How \| often (full) | — | — | — | — | false |
| g1u09.gi.question-words.gf.004 | gap-fill | ___ do you keep your spider? — In a box. [en, 1 blank(s)] | Where (full) | — | — | — | — | false |
| g1u09.gi.question-words.gs.001 | group-sort | Sortiere: Beginnt es mit What oder mit Where? [de] | — | — | — | — | What: What does it eat?, What is it?, What does your rabbit eat? \| Where: Where do you live?, Where do you keep it?, Where does Bob live? | false |
| g1u09.gi.question-words.mc.001 | multiple-choice | ___ do you live? — In London. [en, 1 blank(s)] | Where (full) | — | What ; Who ; How many | — | — | false |
| g1u09.gi.question-words.mc.002 | multiple-choice | ___ does your rabbit eat? — Fish and carrots. [en, 1 blank(s)] | What (full) | — | Where ; Who ; How often | — | — | false |
| g1u09.gi.question-words.mc.003 | multiple-choice | Tom lives in London. ___ does Tom live? [en, 1 blank(s)] | Where (full) | — | What ; How often ; Who | — | — | false |
| g1u09.gi.question-words.mp.001 | matching-pairs | Finde die Paare, die zusammenpassen. [de] | — | — | — | Where do you keep it? ↔ In a box. ; What does it eat? ↔ Meat. ; How often do you feed it? ↔ Once a day. ; What is it? ↔ A rabbit. ; Where does Bob live? ↔ On a farm. | — | false |
| g1u09.gi.question-words.mt.001 | matching | Was passt zusammen? [de] | — | — | — | Where do you live? ↔ In London. ; What does it eat? ↔ Fish and meat. ; How often do you feed it? ↔ Twice a day. ; What is it? ↔ A spider. | — | false |
| g1u09.gi.question-words.qf.001 | question-formation | Tom lives in London. Frag nach dem Ort: ___ does Tom live? [de, 1 blank(s)] | Where (full) ; Where does Tom live? (full) ; Where does he live? (full) | — | — | — | — | false |
| g1u09.gi.question-words.qf.002 | question-formation | It eats fish. Frag nach dem Futter: ___ does it eat? [de, 1 blank(s)] | What (full) ; What does it eat? (full) | — | — | — | — | false |
| g1u09.gi.question-words.sb.001 | sentence-building | does / What / eat / it / ? [en] | What does it eat? (full) | — | — | — | — | false |
| g1u09.gi.question-words.sb.002 | sentence-building | do / Where / live / you / ? [en] | Where do you live? (full) | — | — | — | — | false |
| g1u09.gi.question-words.tf.001 | transformation | I live in London. (mit Where, bitte) → ___ do you live? [de, 1 blank(s)] | Where (full) ; Where do you live? (full) | — | — | — | — | false |
| g1u09.gi.question-words.tf.003 | transformation | I feed my dog twice a day. (wie oft?) → ___ ___ do you feed your dog? [de, 2 blank(s)] | How \| often (full) | — | — | — | — | false |
| g1u09.gi.question-words.tr.001 | translation | Wo wohnst du? [de] | Where do you live? (full) | deToEn | — | — | — | false |
| g1u09.gi.question-words.tr.002 | translation | Wie oft fütterst du deinen Hund? [de] | How often do you feed your dog? (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u09/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u09",
  "lens": "answers",
  "itemsHash": "ba1d244426bd",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 146, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
