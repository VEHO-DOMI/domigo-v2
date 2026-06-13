# Verify lens — answers — g2-u11 (round 2)

<!-- domigo:verify answers g2-u11 items=0d6edd9ab760 prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (56)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u11.w.american | American | A man or woman from America is ___. | My mum is from America, so she is ___. | American (full) ; american (partial) | American (full) ; Americans (partial) | Mongolian ; moveable ; plain |
| g2u11.w.armchair | armchair | Grandpa likes to read in this big comfortable seat for just one. | Grandpa sits down in his big comfortable ___ and reads the newspaper. | armchair (full) ; armchairs (partial) | armchair (full) ; armchairs (full) | sofa ; chair ; bed |
| g2u11.w.bed | bed | At night you lie down on this and close your eyes. | I go to ___ at nine o'clock every night. | bed (full) ; beds (partial) | bed (full) ; beds (full) | chair ; sofa ; table |
| g2u11.w.bedside-table | bedside table | This small thing is next to where you lie down at night, for your lamp. | I put my book and my lamp on the ___ next to my bed. | bedside table (full) ; bedside tables (partial) | bedside table (full) ; bedside tables (full) | wardrobe ; cupboard ; radiator |
| g2u11.w.carpet | carpet | This big thing covers the ground of a room, and you walk on it. | There is a big red ___ on the ground in my living room. | carpet (full) ; carpets (partial) | carpet (full) ; carpets (full) | rug ; lamp ; curtain |
| g2u11.w.cellar | cellar | This dark room is under a building. | We keep old boxes down in the dark ___ under the building. | cellar (full) ; cellars (partial) | cellar (full) ; cellars (full) | roof ; staircase ; wall |
| g2u11.w.cellar-2 | cellar | This dark room is underneath a building. | There is a big ___ underneath our building, and it is dark and cold down there. | cellar (full) ; cellars (partial) | cellar (full) ; cellars (full) | staircase ; roof ; ground |
| g2u11.w.central-asia | Central Asia | This is a big area in the middle of the biggest land. | The Mongolian people in ___ move their homes a lot. | Central Asia (full) | Central Asia (full) | America ; Mongolian ; ground |
| g2u11.w.chair | chair | You sit down on this thing, and it has a back and four legs. | Sit down on this ___ and have your dinner. | chair (full) ; chairs (partial) | chair (full) ; chairs (full) | table ; bed ; sofa |
| g2u11.w.cooker | cooker | You make your hot dinner on this thing in the kitchen. | Mum makes hot food on the ___ in the kitchen. | cooker (full) ; cookers (partial) | cooker (full) ; cookers (full) | fridge ; sink ; table |
| g2u11.w.cotton | cotton | This white material is good for shirts and shoes. | My white shirt is made of ___, so it is good in hot weather. | cotton (full) | cotton (full) | leather ; metal ; plastic |
| g2u11.w.cupboard | cupboard | This thing in the kitchen has doors, and you keep plates and glasses in it. | We keep the plates and glasses in this ___ in the kitchen. | cupboard (full) ; cupboards (partial) | cupboard (full) ; cupboards (full) | wardrobe ; fridge ; sink |
| g2u11.w.curtain | curtain | You pull this in front of the window to keep the light out. | Close the ___ so the sun is not in my eyes. | curtain (full) ; curtains (full) | curtain (full) ; curtains (full) | carpet ; lamp ; window |
| g2u11.w.electricity | electricity | This power makes your lights and your fridge work. | We had no ___ in the storm, so the lights and the fridge did not work. | electricity (full) | electricity (full) | material ; furniture ; pattern |
| g2u11.w.fridge | fridge | This cold machine in the kitchen keeps your food cold. | We keep the milk and the cheese cold in the ___. | fridge (full) ; fridges (partial) | fridge (full) ; fridges (full) | cooker ; sink ; cupboard |
| g2u11.w.furniture | furniture | A sofa, a table, beds and chairs are all ___. | In our building, there is a lot of ___: a sofa, a table and chairs. | furniture (full) | furniture (full) | material ; electricity ; pattern |
| g2u11.w.ground | ground | This is what you walk on when you are outside. | Some homes are high up on stilts, not on the ___. | ground (full) | ground (full) | roof ; island ; wall |
| g2u11.w.hammock | hammock | You hang this up and lie in it in the garden. | I have a new ___. I like to lie in it in the garden. | hammock (full) ; hammocks (partial) | hammock (full) ; hammocks (full) | sofa ; armchair ; bed |
| g2u11.w.hers | hers | A thing that is a girl's or a woman's. | This is not my jacket. It is Mum's, so it is ___. | hers (full) | hers (full) | his ; mine ; yours |
| g2u11.w.his | his | A thing that is a boy's or a man's. | Tom has a green cap. This green cap is ___. | his (full) | his (full) | hers ; theirs ; ours |
| g2u11.w.island | island | This is land with water all around it. | There is a small ___ in the middle of the lake. | island (full) ; islands (partial) | island (full) ; islands (full) | ground ; reed ; stilts |
| g2u11.w.lamp | lamp | When it is dark, you put this on and it gives you light. | Put the ___ on so I can read my book in the dark. | lamp (full) ; lamps (partial) | lamp (full) ; lamps (full) | radiator ; curtain ; sink |
| g2u11.w.leather | leather | This material is from animal skin, and we make shoes from it. | She does not wear ___ shoes because she wants to help animals. | leather (full) | leather (full) | cotton ; metal ; plastic |
| g2u11.w.material | material | This is what a thing is made of, like cotton or metal. | What ___ is your school bag made of: cotton, metal or plastic? | material (full) ; materials (partial) | material (full) ; materials (full) | pattern ; furniture ; electricity |
| g2u11.w.metal | metal | Keys and a fridge are this heavy, cold material. | My keys and the fridge are this cold, heavy ___. | metal (full) ; metals (partial) | metal (full) ; metals (full) | plastic ; leather ; cotton |
| g2u11.w.mine | mine | It is my thing. | This pen is my pen, so it is ___. | mine (full) | mine (full) | yours ; hers ; his |
| g2u11.w.moveable | moveable | When a thing is ___, you can move it from place to place. | The desk has wheels, so you can move it. It is very ___. | moveable (full) ; movable (partial) | moveable (full) ; movable (partial) | plain ; heavy ; American |
| g2u11.w.ours | ours | A thing that is for us. | This is the dog of our family, so it is ___. | ours (full) | ours (full) | theirs ; yours ; mine |
| g2u11.w.pattern | pattern | This is the spots, the stripes or the shapes on a thing. | My new dress has a ___ of red spots on it. | pattern (full) ; patterns (partial) | pattern (full) ; patterns (full) | material ; metal ; seat |
| g2u11.w.plain | plain | It has nothing on it — no spots and no stripes. | It is ___ white, with no spots and no stripes on it. | plain (full) | plain (full) | striped ; spotted ; moveable |
| g2u11.w.plastic | plastic | Many bottles are this light material, and so are lots of toys. | This bottle is light because it is made of ___. | plastic (full) | plastic (full) | metal ; leather ; cotton |
| g2u11.w.pond | pond | Frogs live in this small water in a garden, smaller than a lake. | There are frogs in the small ___ in our garden. | pond (full) ; ponds (partial) | pond (full) ; ponds (full) | island ; ground ; reed |
| g2u11.w.radiator | radiator | This metal thing on the wall makes your room hot in the cold days. | My room is hot because the ___ on the wall is on. | radiator (full) ; radiators (partial) | radiator (full) ; radiators (full) | lamp ; fridge ; window |
| g2u11.w.reed | reed | The Uros people make their homes from this tall, strong grass. | Fifty homes of ___ float on the lake. | reed (full) ; reeds (full) | reed (full) ; reeds (full) | stilts ; island ; ground |
| g2u11.w.roof | roof | The ___ of a building keeps out the rain. | Our building has a ___, walls, windows and doors. | roof (full) ; roofs (partial) | roof (full) ; roofs (partial) | wall ; window ; staircase |
| g2u11.w.rug | rug | This small thing on the ground is smaller than a carpet, and you walk on it. | There is a small ___ on the ground in front of my bed. | rug (full) ; rugs (partial) | rug (full) ; rugs (full) | carpet ; curtain ; lamp |
| g2u11.w.seat | seat | This is a place where you sit down, like a chair. | There is one free ___ next to me on the sofa. | seat (full) ; seats (partial) | seat (full) ; seats (full) | pond ; ground ; pattern |
| g2u11.w.sink | sink | The place in the kitchen where you wash the plates and glasses. | We wash the dirty plates and glasses in the kitchen ___. | sink (full) ; sinks (partial) | sink (full) ; sinks (full) | fridge ; cooker ; cupboard |
| g2u11.w.sofa | sofa | A long seat for two or three people in the living room. | My family sits down on the big ___ to watch a film in the living room. | sofa (full) ; sofas (partial) | sofa (full) ; sofas (full) | armchair ; chair ; bed |
| g2u11.w.spotted | spotted | It has many small spots on it. | Her dress has small spots on it, so it is ___. | spotted (full) | spotted (full) | striped ; plain ; moveable |
| g2u11.w.staircase | staircase | You go up and down these steps inside a building. | Go up the ___ to the bedrooms. | staircase (full) ; staircases (partial) | staircase (full) ; staircases (full) | roof ; wall ; cellar |
| g2u11.w.stilts | stilts | These are long, strong legs that hold homes up high over the ground. | Some homes are high up on ___, over the water. | stilts (full) | stilts (full) | reed ; ground ; island |
| g2u11.w.strap | strap | This holds your watch on you, and it can be leather, plastic or metal. | I've got a watch with a green ___. | strap (full) ; straps (partial) | strap (full) ; straps (full) | pattern ; material ; seat |
| g2u11.w.striped | striped | It has long stripes on it. | His shirt has long stripes on it, so it is ___. | striped (full) | striped (full) | spotted ; plain ; moveable |
| g2u11.w.table | table | This thing has four legs, and you eat your dinner at it. | We have our dinner at the ___ in the kitchen. | table (full) ; tables (partial) | table (full) ; tables (full) | chair ; bed ; sofa |
| g2u11.w.theirs | theirs | A thing that is for them. | These books are for Mum and Dad, so they are ___. | theirs (full) | theirs (full) | ours ; yours ; hers |
| g2u11.w.to-float | to float | When a thing can ___, it stays on the water and does not go down. | Fifty islands of reed can ___ on the lake. | float (full) ; floats (partial) ; floated (partial) | float (full) ; to float (partial) ; floats (partial) | transport ; carry ; pull |
| g2u11.w.to-transport | to transport | To ___ a thing is to move it from one place to another. | They can ___ their homes to new places. | transport (full) ; transports (partial) ; transported (partial) | transport (full) ; to transport (partial) | float ; pull ; burn |
| g2u11.w.trailer | trailer (American English) | A car can pull this small home on wheels along the road. | Some people live in a ___ with wheels and pull it from park to park with a car. | trailer (full) ; trailers (partial) | trailer (full) ; trailers (full) ; caravan (partial) | tree house ; island ; hammock |
| g2u11.w.tree-house | tree house | Children play up high in this small room over the ground. | We read our books up in our ___ in the big tree. | tree house (full) ; tree houses (partial) ; treehouse (partial) | tree house (full) ; tree houses (full) ; treehouse (partial) | trailer ; island ; hammock |
| g2u11.w.underneath | underneath | When a thing is under another thing, it is ___ it. | Our dog likes to lie ___ the table. | underneath (full) | underneath (full) | underground ; opposite ; behind |
| g2u11.w.wall | wall | This is the side of a room, and you can put a picture on it. | There is a poster of my favourite singer on my bedroom ___. | wall (full) ; walls (partial) | wall (full) ; walls (full) | roof ; window ; ground |
| g2u11.w.wardrobe | wardrobe | A big thing in your bedroom where you keep your clothes. | I keep all my clothes in the big ___ in my bedroom. | wardrobe (full) ; wardrobes (partial) | wardrobe (full) ; wardrobes (full) | cupboard ; fridge ; curtain |
| g2u11.w.whose | whose | You ask this when you want to find who a thing is for. | ___ pen is this? Is it yours or mine? | whose (full) ; Whose (full) | whose (full) | mine ; yours ; ours |
| g2u11.w.window | window | You look out of this to look at the garden. | Open the ___, please. It is too hot in here. | window (full) ; windows (partial) | window (full) ; windows (full) | wall ; roof ; curtain |
| g2u11.w.yours | yours | A thing that is for you, not for me. | This book is for you, so it is ___. | yours (full) | yours (full) | mine ; ours ; theirs |

## Grammar items (68)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u11.gi.possessive-pronouns.ag.001 | anagram | Es gehört mir. [de] | mine (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.ag.002 | anagram | Es gehört uns. [de] | ours (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.cp.001 | context-picker | Nick shares his room. He points to one bed for him and one bed for his sister. [en] | This is my bed, and that's hers. (full) | — | This is my bed, and that's her. ; This is my bed, and that's her bed hers. ; This is mine bed, and that's hers. | — | — | false |
| g2u11.gi.possessive-pronouns.cp.002 | context-picker | A camp guide holds up some books for Fred and Hannah. The books are for them. [en] | They're ours. (full) | — | They're our. ; They're ours books. ; They're our's. | — | — | false |
| g2u11.gi.possessive-pronouns.ec.001 | error-correction | This is mine pen. [en] | This is my pen. (full) ; my (partial) | — | — | — | — | true |
| g2u11.gi.possessive-pronouns.ec.002 | error-correction | This skateboard is her's. [en] | This skateboard is hers. (full) ; hers (partial) | — | — | — | — | true |
| g2u11.gi.possessive-pronouns.ec.003 | error-correction | That tablet is my, not your. [en] | That tablet is mine, not yours. (full) ; mine, not yours (partial) | — | — | — | — | true |
| g2u11.gi.possessive-pronouns.gf.001 | gap-fill | Is this your pen? — Yes, it's ___. [en, 1 blank(s)] | mine (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.gf.002 | gap-fill | That's not my rug. It's ___. [en, 1 blank(s)] | yours (full) | — | — | — | — | true |
| g2u11.gi.possessive-pronouns.gf.003 | gap-fill | Whose is it? Is it Mike's? — No, it isn't ___. Ask Lucy. [en, 1 blank(s)] | his (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.gf.004 | gap-fill | These books aren't mine. Whose is it? Is it Sue's? — Yes, it's ___. [en, 1 blank(s)] | hers (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.gf.005 | gap-fill | Mike and Sam have got books. We can't find ours, so can we borrow ___? [en, 1 blank(s)] | theirs (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.gf.006 | gap-fill | I like your painting, but I think ___ is nicer. We painted it. [en, 1 blank(s)] | ours (full) | — | — | — | — | true |
| g2u11.gi.possessive-pronouns.gs.001 | group-sort | my / mine / your / yours / our / ours / their / theirs [en] | — | — | — | — | my bed, your bed …: my, your, our, their \| It's mine, It's yours …: mine, yours, ours, theirs | false |
| g2u11.gi.possessive-pronouns.mc.001 | multiple-choice | This sofa is for me. — This sofa is ___. [en, 1 blank(s)] | mine (full) | — | my ; me ; I | — | — | false |
| g2u11.gi.possessive-pronouns.mc.002 | multiple-choice | This lamp is for me. [en] | This lamp is mine. (full) | — | This lamp is my. ; This is mine lamp. ; This lamp is mine's. | — | — | false |
| g2u11.gi.possessive-pronouns.mc.003 | multiple-choice | You ask if a pencil case is for you or for her. [en] | Is that pencil case yours or hers? (full) | — | Is that pencil case your or her? ; Is that pencil case yours or her's? ; Is that pencil case your's or hers? | — | — | false |
| g2u11.gi.possessive-pronouns.mp.001 | matching-pairs | my and mine, your and yours … [en] | — | — | — | my ↔ mine ; your ↔ yours ; his ↔ his ; her ↔ hers ; our ↔ ours ; their ↔ theirs | — | false |
| g2u11.gi.possessive-pronouns.qf.001 | question-formation | is / this / yours / ? [en] | Is this yours? (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.sb.001 | sentence-building | yours / is / or / this / mine / ? [en] | Is this yours or mine? (full) ; Is this mine or yours? (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.tf.001 | transformation | It's my rug. → This rug is ___. [en, 1 blank(s)] | This rug is mine. (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.tf.002 | transformation | Those are their trainers. → Are those ___? [en, 1 blank(s)] | Are those theirs? (full) | — | — | — | — | false |
| g2u11.gi.possessive-pronouns.tr.001 | translation | Dieses Bett gehört mir. [de] | This bed is mine. (full) ; This is my bed. (partial) | deToEn | — | — | — | false |
| g2u11.gi.possessive-pronouns.tr.002 | translation | Ist dieser Rucksack deiner oder ihrer? [de] | Is this backpack yours or hers? (full) ; Is that backpack yours or hers? (full) | deToEn | — | — | — | false |
| g2u11.gi.possessive-s.ag.001 | anagram | Es ist Mikes. (Antwort auf "Whose is it?") [de] | Mike's (full) | — | — | — | — | false |
| g2u11.gi.possessive-s.cp.001 | context-picker | Mum finds a school bag on the sofa. It is for your sister. [en] | It's my sister's. (full) | — | It's my sisters. ; It's my sister. ; It's my sisters'. | — | — | false |
| g2u11.gi.possessive-s.ec.001 | error-correction | This is my sisters bed. [en] | This is my sister's bed. (full) ; sister's (partial) | — | — | — | — | true |
| g2u11.gi.possessive-s.ec.002 | error-correction | The girls share a room. The girls room is very big. [en] | The girls' room is very big. (full) ; girls' (partial) | — | — | — | — | true |
| g2u11.gi.possessive-s.ec.003 | error-correction | The childrens room is here. [en] | The children's room is here. (full) ; children's (partial) | — | — | — | — | true |
| g2u11.gi.possessive-s.ff.001 | free-form | You find a hat. It is for Sam. Whose is it? [en] | It's Sam's. (full) ; It's Sam's hat. (full) ; This is Sam's hat. (partial) ; That's Sam's. (partial) ; Sam's. (partial) | — | — | — | — | false |
| g2u11.gi.possessive-s.gf.001 | gap-fill | Whose school bag is this? — It's ___. (Joanna) [en, 1 blank(s)] | Joanna's (full) | — | — | — | — | false |
| g2u11.gi.possessive-s.gf.002 | gap-fill | This is ___ bed. (my sister) [en, 1 blank(s)] | my sister's (full) ; sister's (partial) | — | — | — | — | false |
| g2u11.gi.possessive-s.gf.003 | gap-fill | Those are ___ trainers. (Mike) [en, 1 blank(s)] | Mike's (full) | — | — | — | — | false |
| g2u11.gi.possessive-s.gf.004 | gap-fill | This is my ___ room. (parents) [en, 1 blank(s)] | parents' (full) | — | — | — | — | false |
| g2u11.gi.possessive-s.gf.005 | gap-fill | It's our ___ dog. (neighbours) [en, 1 blank(s)] | neighbours' (full) | — | — | — | — | false |
| g2u11.gi.possessive-s.gf.006 | gap-fill | That's the ___ school. (children) [en, 1 blank(s)] | children's (full) | — | — | — | — | false |
| g2u11.gi.possessive-s.gs.001 | group-sort | my sister / Mike / my parents / the boys / the children / the men / the girls / our neighbours [en] | — | — | — | — | like sister's, Mike's: my sister, Mike, the children, the men \| like parents', boys': my parents, the boys, the girls, our neighbours | false |
| g2u11.gi.possessive-s.mc.001 | multiple-choice | My sister has got a new lamp. [en] | My sister's lamp is new. (full) | — | My sisters lamp is new. ; My sister lamp is new. ; My sisters' lamp is new. | — | — | false |
| g2u11.gi.possessive-s.mc.003 | multiple-choice | The women have got a room at school. [en] | The women's room is here. (full) | — | The womens room is here. ; The womens' room is here. ; The woman's room is here. | — | — | false |
| g2u11.gi.possessive-s.mc.005 | multiple-choice | Three boys share one room. [en] | The boys' room is very big. (full) | — | The boy's room is very big. ; The boys room's is very big. ; The boys' room are very big. | — | — | false |
| g2u11.gi.possessive-s.mt.001 | matching | the owner and the desk [en] | — | — | — | the teacher (one) ↔ the teacher's desk ; the teachers (two) ↔ the teachers' desk ; the children ↔ the children's desk ; my friend ↔ my friend's desk ; the men ↔ the men's desk | — | false |
| g2u11.gi.possessive-s.qf.001 | question-formation | the book / whose / is / it / ? [en] | Whose book is it? (full) | — | — | — | — | false |
| g2u11.gi.possessive-s.sb.001 | sentence-building | is / where / dad's / my / chair / ? [en] | Where is my dad's chair? (full) | — | — | — | — | false |
| g2u11.gi.possessive-s.tf.001 | transformation | the chair of my friend → [en] | my friend's chair (full) ; friend's chair (partial) | — | — | — | — | false |
| g2u11.gi.possessive-s.tf.002 | transformation | the room of the boys → [en] | the boys' room (full) ; boys' room (partial) | — | — | — | — | false |
| g2u11.gi.possessive-s.tr.001 | translation | Sams Bett ist neu. [de] | Sam's bed is new. (full) | deToEn | — | — | — | false |
| g2u11.gi.possessive-s.tr.002 | translation | Das ist das Zimmer der Kinder. [de] | This is the children's room. (full) ; It's the children's room. (partial) | deToEn | — | — | — | false |
| g2u11.gi.who-whose.ag.002 | anagram | Mit diesem Wort fragst du, wem etwas gehört. [de] | whose (full) | — | — | — | — | false |
| g2u11.gi.who-whose.cp.001 | context-picker | Robert's bed is in pieces. He can't find out who did it. [en] | Who broke my bed? (full) | — | Who did break my bed? ; Whose broke my bed? ; Who does break my bed? | — | — | false |
| g2u11.gi.who-whose.ec.001 | error-correction | Who does want ice cream? [en] | Who wants ice cream? (full) ; wants (partial) | — | — | — | — | true |
| g2u11.gi.who-whose.ec.002 | error-correction | Who's chair is that? [en] | Whose chair is that? (full) ; Whose (partial) | — | — | — | — | true |
| g2u11.gi.who-whose.ec.003 | error-correction | Who did break the lamp? [en] | Who broke the lamp? (full) ; broke (partial) | — | — | — | — | true |
| g2u11.gi.who-whose.gf.001 | gap-fill | ___ is your best friend? [en, 1 blank(s)] | Who (full) | — | — | — | — | false |
| g2u11.gi.who-whose.gf.002 | gap-fill | ___ lamp is this? [en, 1 blank(s)] | Whose (full) | — | — | — | — | true |
| g2u11.gi.who-whose.gf.003 | gap-fill | ___ has got a sofa in their bedroom? [en, 1 blank(s)] | Who (full) | — | — | — | — | false |
| g2u11.gi.who-whose.gf.004 | gap-fill | ___ trainers are those? [en, 1 blank(s)] | Whose (full) | — | — | — | — | true |
| g2u11.gi.who-whose.gf.005 | gap-fill | ___ broke your bed? [en, 1 blank(s)] | Who (full) | — | — | — | — | false |
| g2u11.gi.who-whose.gs.001 | group-sort | who did it, or whose it is [en] | — | — | — | — | Who did it?: Who broke the bed?, Who wants a hammock?, Who cleaned the room? \| Whose is it?: Whose lamp is this?, Whose trainers are those?, Whose is this? | false |
| g2u11.gi.who-whose.mc.001 | multiple-choice | ___ wants an ice cream machine? [en, 1 blank(s)] | Who (full) | — | Who does ; Whose ; Who do | — | — | false |
| g2u11.gi.who-whose.mc.002 | multiple-choice | You want to ask who lives here. [en] | Who lives here? (full) | — | Who does live here? ; Who do lives here? ; Whose lives here? | — | — | false |
| g2u11.gi.who-whose.mc.003 | multiple-choice | You want to ask whose chair this is. [en] | Whose chair is this? (full) | — | Who's chair is this? ; Who chair is this? ; Whose is chair this? | — | — | false |
| g2u11.gi.who-whose.mt.002 | matching | Who or Whose, and the ending [en] | — | — | — | Who broke the bed? ↔ Tom did. ; Whose trainers are those? ↔ They're Mike's. ; Who wants this lamp? ↔ I do. ; Whose room is this? ↔ It's my sister's. | — | false |
| g2u11.gi.who-whose.qf.001 | question-formation | the / painted / who / wall / ? [en] | Who painted the wall? (full) | — | — | — | — | false |
| g2u11.gi.who-whose.qf.002 | question-formation | Mike put the lamp on the sofa. → Ask who. [en] | Who put the lamp on the sofa? (full) | — | — | — | — | false |
| g2u11.gi.who-whose.sb.001 | sentence-building | is / whose / this / pen / ? [en] | Whose pen is this? (full) | — | — | — | — | false |
| g2u11.gi.who-whose.tf.001 | transformation | Lucy cleaned the kitchen. → Who ___? [en, 1 blank(s)] | Who cleaned the kitchen? (full) | — | — | — | — | false |
| g2u11.gi.who-whose.tr.001 | translation | Wessen Hund ist das? [de] | Whose dog is that? (full) ; Whose dog is this? (full) | deToEn | — | — | — | false |
| g2u11.gi.who-whose.tr.002 | translation | Wer hat die Vorhänge gewaschen? [de] | Who washed the curtains? (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u11/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u11",
  "lens": "answers",
  "itemsHash": "0d6edd9ab760",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 124, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
