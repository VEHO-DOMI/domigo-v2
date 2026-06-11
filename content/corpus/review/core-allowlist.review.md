# Core allowlist review — closed-class tokens (assumed known at every level)
<!-- domigo:review allowlist seed=882a11df4b8d -->

**163 tokens.** These never require a gloss; the V5 level gate consumes the approved list verbatim.

> Reviewer: delete a row to REJECT the token; add a row (token + category) to extend.
> `zero-freq` = token never occurs in any transcript (suspicious for a 'ubiquitous' word).
> `also-taught` = a unit word bank teaches the same headword (allowlist still fine — it just means the gate would pass it anyway).

| token | category | freq g1/g2/g3/g4 | taught in | issues |
|---|---|---|---|---|
| a | article | 2039 / 2773 / 2918 / 2140 |  |  |
| an | article | 220 / 217 / 258 / 238 |  |  |
| the | article | 2805 / 3680 / 4124 / 3987 |  |  |
| i | pronoun-subject | 869 / 1051 / 1094 / 1026 |  |  |
| you | pronoun-subject | 888 / 977 / 1422 / 1017 |  |  |
| he | pronoun-subject | 487 / 323 / 462 / 485 | g1-u02 | also-taught |
| she | pronoun-subject | 314 / 250 / 347 / 411 | g1-u02 | also-taught |
| it | pronoun-subject | 398 / 549 / 778 / 637 | g1-u01 | also-taught |
| we | pronoun-subject | 262 / 274 / 460 / 308 | g1-u02 | also-taught |
| they | pronoun-subject | 300 / 293 / 331 / 351 | g1-u02 | also-taught |
| me | pronoun-object | 182 / 176 / 229 / 230 |  |  |
| him | pronoun-object | 68 / 76 / 148 / 108 | g1-u03 | also-taught |
| her | pronoun-object | 176 / 242 / 342 / 322 |  |  |
| us | pronoun-object | 32 / 68 / 86 / 68 | g1-u02 | also-taught |
| them | pronoun-object | 66 / 118 / 160 / 170 |  |  |
| my | possessive | 397 / 402 / 379 / 279 |  |  |
| your | possessive | 363 / 370 / 461 / 373 | g1-u01 | also-taught |
| his | possessive | 220 / 175 / 253 / 246 | g1-u03 g2-u11 | also-taught |
| its | possessive | 31 / 10 / 41 / 35 | g1-u05 | also-taught |
| our | possessive | 91 / 92 / 110 / 92 | g1-u01 | also-taught |
| their | possessive | 58 / 86 / 123 / 144 | g1-u01 | also-taught |
| this | demonstrative | 144 / 141 / 158 / 198 |  |  |
| that | demonstrative | 99 / 198 / 458 / 469 |  |  |
| these | demonstrative | 65 / 60 / 99 / 90 | g1-u10 | also-taught |
| those | demonstrative | 39 / 13 / 17 / 16 | g1-u10 | also-taught |
| who | question | 57 / 122 / 151 / 162 |  |  |
| what | question | 313 / 416 / 555 / 537 |  |  |
| which | question | 5 / 40 / 97 / 77 |  |  |
| when | question | 60 / 167 / 238 / 258 |  |  |
| where | question | 102 / 88 / 113 / 91 | g1-u02 | also-taught |
| why | question | 48 / 196 / 174 / 223 |  |  |
| how | question | 213 / 175 / 301 / 246 |  |  |
| be | be | 132 / 157 / 276 / 293 |  |  |
| am | be | 78 / 16 / 14 / 25 |  |  |
| is | be | 984 / 706 / 681 / 658 |  |  |
| are | be | 570 / 397 / 449 / 458 |  |  |
| was | be | 239 / 397 / 655 / 570 |  |  |
| were | be | 86 / 92 / 234 / 161 |  |  |
| isn't | be | 98 / 47 / 22 / 18 |  |  |
| aren't | be | 61 / 26 / 32 / 15 |  |  |
| wasn't | be | 32 / 20 / 54 / 26 |  |  |
| weren't | be | 19 / 4 / 19 / 8 |  |  |
| i'm | be | 289 / 216 / 196 / 133 |  |  |
| you're | be | 46 / 31 / 53 / 45 |  |  |
| he's | be | 83 / 31 / 26 / 34 |  |  |
| she's | be | 46 / 48 / 23 / 38 |  |  |
| it's | be | 308 / 253 / 225 / 157 |  |  |
| we're | be | 59 / 27 / 44 / 18 |  |  |
| they're | be | 54 / 37 / 26 / 31 |  |  |
| do | do | 294 / 374 / 442 / 300 |  |  |
| does | do | 123 / 117 / 84 / 99 |  |  |
| did | do | 41 / 172 / 149 / 150 |  |  |
| done | do | 9 / 16 / 11 / 27 |  |  |
| doing | do | 25 / 28 / 33 / 33 |  |  |
| don't | do | 177 / 224 / 211 / 164 |  |  |
| doesn't | do | 79 / 52 / 50 / 53 |  |  |
| didn't | do | 57 / 106 / 126 / 108 |  |  |
| have | have | 226 / 352 / 331 / 335 |  |  |
| has | have | 178 / 125 / 108 / 146 |  |  |
| had | have | 14 / 77 / 189 / 210 |  |  |
| having | have | 11 / 4 / 25 / 12 |  |  |
| haven't | have | 48 / 29 / 30 / 20 |  |  |
| hasn't | have | 42 / 11 / 3 / 10 |  |  |
| i've | have | 20 / 109 / 80 / 44 |  |  |
| you've | have | 15 / 14 / 25 / 22 |  |  |
| we've | have | 7 / 22 / 24 / 22 |  |  |
| they've | have | 5 / 4 / 10 / 5 |  |  |
| can | modal | 352 / 261 / 291 / 241 | g1-u05 | also-taught |
| can't | modal | 140 / 46 / 53 / 51 |  |  |
| cannot | modal | 11 / 3 / 2 / 3 |  |  |
| let's | modal | 59 / 43 / 32 / 15 | g1-u01 | also-taught |
| and | conjunction | 1288 / 1486 / 1731 / 1408 |  |  |
| or | conjunction | 123 / 198 / 191 / 204 | g1-u01 | also-taught |
| but | conjunction | 140 / 256 / 358 / 269 | g1-u02 | also-taught |
| because | conjunction | 51 / 135 / 114 / 170 | g1-u04 | also-taught |
| so | conjunction | 102 / 223 / 228 / 210 |  |  |
| if | conjunction | 6 / 22 / 318 / 190 |  |  |
| than | conjunction | 3 / 85 / 114 / 77 |  |  |
| then | conjunction | 173 / 216 / 199 / 169 | g1-u01 | also-taught |
| in | preposition | 1017 / 1114 / 1360 / 1366 | g1-u02 | also-taught |
| on | preposition | 415 / 465 / 582 / 459 | g1-u02 | also-taught |
| at | preposition | 433 / 437 / 454 / 360 | g1-u02 | also-taught |
| to | preposition | 1409 / 1589 / 2572 / 1971 |  |  |
| of | preposition | 684 / 893 / 1267 / 1212 |  |  |
| for | preposition | 332 / 412 / 627 / 623 | g1-u02 | also-taught |
| with | preposition | 537 / 584 / 671 / 535 |  |  |
| from | preposition | 153 / 149 / 265 / 278 | g1-u02 | also-taught |
| up | preposition | 110 / 129 / 196 / 172 |  |  |
| down | preposition | 52 / 55 / 86 / 75 |  |  |
| about | preposition | 193 / 300 / 489 / 459 |  |  |
| into | preposition | 62 / 80 / 93 / 74 | g1-u04 | also-taught |
| out | preposition | 121 / 123 / 226 / 154 |  |  |
| over | preposition | 30 / 40 / 64 / 47 |  |  |
| under | preposition | 65 / 21 / 45 / 21 | g1-u02 g1-u02 | also-taught |
| after | preposition | 28 / 89 / 128 / 74 | g1-u04 | also-taught |
| before | preposition | 9 / 20 / 54 / 77 |  |  |
| not | polarity | 226 / 205 / 268 / 289 |  |  |
| no | polarity | 236 / 178 / 138 / 144 |  |  |
| yes | polarity | 232 / 124 / 71 / 46 |  |  |
| n't | polarity | 3 / 1 / 8 / 1 |  |  |
| some | quantifier | 24 / 121 / 155 / 122 | g1-u07 | also-taught |
| any | quantifier | 10 / 78 / 53 / 67 | g1-u07 | also-taught |
| all | quantifier | 59 / 109 / 203 / 203 |  |  |
| both | quantifier | 5 / 16 / 35 / 21 |  |  |
| many | quantifier | 42 / 94 / 134 / 103 |  |  |
| much | quantifier | 73 / 39 / 79 / 59 |  |  |
| more | quantifier | 119 / 104 / 167 / 163 | g1-u01 | also-taught |
| most | quantifier | 8 / 43 / 105 / 67 |  |  |
| one | quantifier | 113 / 187 / 266 / 222 |  |  |
| two | quantifier | 157 / 159 / 172 / 101 |  |  |
| three | quantifier | 109 / 58 / 74 / 67 |  |  |
| four | quantifier | 61 / 30 / 38 / 30 |  |  |
| five | quantifier | 73 / 28 / 21 / 35 |  |  |
| six | quantifier | 43 / 14 / 23 / 16 |  |  |
| seven | quantifier | 28 / 6 / 9 / 12 |  |  |
| eight | quantifier | 26 / 10 / 17 / 7 |  |  |
| nine | quantifier | 30 / 14 / 8 / 8 |  |  |
| ten | quantifier | 56 / 15 / 15 / 18 |  |  |
| here | adverb-core | 73 / 76 / 77 / 43 | g1-u01 | also-taught |
| there | adverb-core | 215 / 244 / 330 / 277 |  |  |
| now | adverb-core | 72 / 72 / 92 / 92 |  |  |
| today | adverb-core | 39 / 36 / 14 / 22 | g1-u04 | also-taught |
| very | adverb-core | 106 / 146 / 119 / 129 |  |  |
| too | adverb-core | 35 / 85 / 100 / 90 |  |  |
| also | adverb-core | 22 / 27 / 81 / 64 | g1-u03 | also-taught |
| there's | adverb-core | 77 / 64 / 49 / 47 |  |  |
| please | courtesy | 70 / 74 / 27 / 36 |  |  |
| sorry | courtesy | 30 / 47 / 26 / 27 | g1-u05 | also-taught |
| ok | courtesy | 77 / 62 / 46 / 30 |  |  |
| hello | courtesy | 20 / 15 / 8 / 4 |  |  |
| hi | courtesy | 48 / 30 / 23 / 11 |  |  |
| bye | courtesy | 28 / 4 / 4 / 3 |  |  |
| goodbye | courtesy | 5 / 5 / 3 / 4 | g1-u10 | also-taught |
| thanks | courtesy | 25 / 18 / 9 / 10 |  |  |
| thank | courtesy | 29 / 14 / 14 / 7 |  |  |

## List verdict
> unit: ok        (ok = approve the table above as THE allowlist · changes = re-present)
> note: 28 seed tokens REJECTED on frequency+curriculum evidence — a day-one allowlist must hold for a g1 beginner: possessive absolutes (mine/yours/hers/ours/theirs — 0× in g1, taught g2-u11), all 8 reflexives (taught g2+, myself is g2-u03 bank content), perfect forms (been/being/hadn't — g3+ grammar), whose/whom (g2-u11 / rare), future+conditional modals (will/won't/would/wouldn't/could/couldn't/i'll/you'll/we'll — g2/g3 grammar; couldn't is g2-u03 bank content), okay (0-freq variant of ok). Kept past simple of be/do/have (was 239×, did 41×, had 14× in g1 — the MORE!1 textbook itself uses them in stories) and 've-contractions (MORE!1 teaches "have got" early). V5 TODO: grade-tiered grammar allowances (e.g. "will" allowed g2+ via the future structure), so removed modals gate g1 correctly without flooding g2+ validation.
