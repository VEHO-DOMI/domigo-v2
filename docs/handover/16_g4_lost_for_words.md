# 16 — G4 "Lost for Words" / "Sprachlos": the narrative gate pack (G4-N)

> **Status: G4-N GATE PACK — awaiting Koki's sign-off (2026-07-06).** This is the approved real-life replacement for the rejected Syntaxia fantasy options (see the superseded banner on `13_g4_syntaxia.md` — that doc's **mechanics layer** — flags/validators/bosses/hint-economy/build plan — carries forward verbatim via `docs/BLUEPRINT.md` Part III.4; THIS doc is the story). The pack = this outline + the register sheet (§8) + **chapter 1 authored in the bundle `content/corpus/stories/g4.st.lost-for-words/` (validate-story green, unreleased — invisible to students)** as the voice test. Approval unblocks the G4 build lane (PR-1/PR-2 engineering is narrative-agnostic and may run in parallel; content PRs 3+ wait here).

## 1. The one-liner

**On your class's England intensive week, your best friend Niko is quietly blamed for a ring that vanished from your host family's kitchen — and the worst sentence of the week is the one you didn't say.**

Why it's fresh against the other three games: G1 restored a magic book, G2 solved a crime, G3 watched the internet hurt a friend. G4 is the first game where the player's own English — produced under real social pressure, in a real place — is both the setting and the moral instrument. Abroad, every task is survival ("say it, or stand there"); and the harm in the story is done not by a villain but by retellings and a silence. The player's silence.

The Sprachwoche is lived reality for the exact cohort: many 4.-Klasse students play this the year they take the trip.

## 2. The conflict and the fair-play chain (no culprit exists)

Night two, the welcome dinner: **Nan's ring** — the "something old" Katie will wear at Saturday-week's wedding — disappears from the kitchen. Niko had admired it at dinner ("I'd rather guard this than wash up" — a joke, overheard). By the youth-club evening, "he was **holding** it" has become "the Austrian **took** it". Nobody accuses him outright. That's the point: the injury is administered in polite, deniable sentences, in a language the boys can barely fight back in.

The truth is a pure accident, reconstructable from **Fragments** planted before the turn:

| # | Fragment | Planted | What it shows |
|---|---|---|---|
| F1 | ch2, the first account | The ring **had come off** during the cooking |
| F2 | ch3, on record | Lewis's original sentence: "he was *holding* it" — technically true, never "took" |
| F3 | ch4, Niko's account | "I put it back **on the windowsill**." |
| F4 | ch5, the re-cooked dinner | The counters were cleared **into the charity bags** that same evening |
| F5 | ch6, the shop | One donation box never arrived — it went into Dev's **auction lot pile** by mistake (the mislabeled receipt) |
| F6 | ch9, overheard | Lewis: "I only said he was holding it. I should have shut up." |

**THE TURN (ch8):** the ring **turns up** in a bric-a-brac lot at the Saturday auction. Recovered, receipt matched, the truth an accident — whole and human. The rumor chain is ALSO fair-play: the player watches each retelling drift on screen in ch3. Every link is innocent-ish; the harm emerges from the system. G2 inverted: there, a theft turned out to be a correction; here, there is no theft at all — only sentences.

## 3. Cast (→ `cast.json` + `names.json`)

| id | Name | Role |
|---|---|---|
| `you` | You | the player; Austrian student, seen from behind (G3 convention) |
| `niko` | Niko | your best friend + roommate; quietly blamed; keeps agency throughout. Companion slot: **sniff-option** ("Not those two.") — his help keeps coming while suspected, only quieter |
| `sue` | Sue Harper | host mother; kind, and her hesitation is part of the hurt |
| `dev` | Dev Harper | host father; runs a small auction house |
| `callum` | Callum Harper | host brother, 15; true-crime-podcast nerd — comic until ch4, then he drops it himself. Companion slot: **reveal-letter** (+ speak-the-line when TTS lands) |
| `nan` | Nan | Sue's mother; biscuit tin, malaprops, unexpectedly sharp; the comic-relief vendor slot (Credit top-ups); owns the theme line: *"You can't unsay a thing, love. But you can say the next thing."* |
| `katie` | Katie | Sue's sister, the bride; the ring is her "something old" |
| `lewis` | Lewis | local teen; careless, not cruel — and owns it |
| `ash` | Ash | Katie's goth cousin; sits with Niko at the wedding: "People decided what I was before I said a word, too." |
| `frau-maier` | Frau Maier | the accompanying Austrian teacher; the German voice of the week. Companion slot: **force-gloss** ("Auf Deutsch heißt das …"). Never says "past perfect" — she says "sag es so: …" |
| `narrator` | Narrator | captions |

(Your **trip journal** is the fourth companion slot — glimpse-rule, "check your notes" — an object, not a cast member.)

## 4. The 13 chapters (unit/structure → beat → the diegetic task)

The unit vocabulary carries each chapter natively (verified against the g4 wordbanks — u01 fluent/foreigner/incident/shake hands, u05 cookery/trust/ashamed, u08 auction/precious/turn up/whisper/furious, u09 the full wedding lexicon, u10 fairness/helpless, u12 astronaut/crew, u13 apply/best wishes/last but not least). The task IS the story action in every chapter.

| Ch | Structure | Beat | Diegetic task moment |
|---|---|---|---|
| 1 | past continuous | **The Longest Day** — Vienna → the Harpers' doorstep. Nan shows the ring | Tell the journey at the dinner table: "We **were flying** over the sea when…" Big Moment 1: the doorstep hello |
| 2 | past perfect | **The Empty Box** — the box is empty; Callum goes full true-crime; the adults go quiet, which is worse | Reconstruct what **had happened** before anyone noticed; first journal entry. F1 |
| 3 | reported speech | **What They Said** — the youth club; one sentence mutates through three retellings, rendered on screen | Chronicle it properly: "Lewis **said that** Niko **had been holding** it." Backshift IS the rumor mechanism. F2 |
| 4 | reported questions | **Questions** — duty-of-care chats. **FORK 1** (`w04.said`/`w04.vague`): tell exactly what you saw vs stay vague | "She **asked me where I had been**." F3 |
| 5 | past perfect + connectors | **The Dinner, Again** — the family re-cooks the evening. Act-1 close | Rebuild the timeline: "**After** we **had eaten**, Sue cleared the counters…" Sue: "**Even though** I'm upset, I **trust** you both." F4 |
| 6 | adverbs + question tags | **The Shop** — charity-shop volunteering; the town gossips in tags | Serve customers (the shop rush); defend Niko: "He put it back **carefully**, **didn't he**?" F5 |
| 7 | pres. simple future + want-sb-to | **The Itinerary** — crisis meeting; the coordinator proposes moving Niko to another family. **FORK 2** (`w07.move`/`w07.stay`) | "The coach **leaves** at 8:15." Then literally: "Frau Maier **wants me to** accept the move. Niko **is asking me to** help him stay." |
| 8 | tense review | **The Auction** — **THE TURN**: the ring turns up in a bric-a-brac lot. Staged per the w07 flag; reconverges at the recovery | The clearing statement IS the tense contrast: "It **went** into the box on Monday. It **has been** here all week. Nothing **has been stolen**." |
| 9 | modals of possibility | **The Wedding** — Katie marries with the ring on her hand; Niko is welcomed back and hovers at the edges; Ash sits with him. Placed BEFORE the regret chapter deliberately | Help run the day: "You **might** want to sit on the left." "It **may** rain." Big Moment: the toast. F6 |
| 10 | **third conditional** | **If** — the regret chorus (Sue, Lewis, yours keyed to w04). Niko, quiet and devastating: "Everyone was kind. And nobody believed me." **FORK 3 — moral, NO right answer** (`w10.speak`/`w10.still`) | Write each person's if-only into the journal: "**If** I **had checked** the bags, none of this **would have happened**." |
| 11 | reflexive pronouns | **The True Account** — the class writes the week for the class anthology, in Dev's second-hand bookshop | "I keep asking **myself** why I waited." "Lewis couldn't forgive **himself** till he said it out loud." Your line varies by the w10 flag |
| 12 | phrasal verbs | **Mission Day** — the National Space Centre; the simulator rota puts you, Niko, Callum and Lewis on one crew. Repair through action *(the optional 3D set-piece slot — forfeit-first)* | Mission-control comms, all phrasal: "**Set up** the console. **Count down** from ten. Don't **give up**." |
| 13 | word formation | **Last But Not Least** — the farewell evening + the summer-program application. Endings by flags; final gauntlet = the certificate chat | The application form (apply → **application**, honest → **honestly**) and the farewell speech — **mis**understanding un-built into *understanding* |

## 5. Forks, flags, endings (→ the `flags@1` manifest, lands with G4 PR-1)

| Flag | Set | Consumed (VS-13 will enforce every consumption) |
|---|---|---|
| `w04.said` / `w04.vague` | ch4 choice | personalizes the ch10 regret line; Niko's plane line in the epilogue ("You told the truth that day. Next time, tell all of it, straight away." / "You never said a word against me. But next time — say one FOR me sooner.") |
| `w07.move` / `w07.stay` | ch7 choice | stages the ch8 turn (in the auction room live vs the phone call + counter scene); ch9 seating lines; the airport-epilogue composition; Dev's book inscription |
| `w10.speak` / `w10.still` | ch10 choice | selects the ending; the ch11 mirror line; the ch13 speech keystone word |

**Endings** (identical content/items/XP — what differs is meaning): **"Said Out Loud"** (`w10.speak`) — the short true version to the room; Lewis stands and owns his sentence; one hard beat of silence, then Nan starts the applause. **"The Kitchen Table"** (`w10.still`) — last-morning apologies; the inscribed book; the handshake that becomes a hug. Completeness coda band-flavored per the standing doctrine; post-credit hook: the summer-program acceptance email. Fork rules: choices only (never task performance); reconverge in-chapter; branch-exclusive segments are dialogue-only (the spine-tasks rule).

## 6. Companion & economy re-skins (mechanics per BLUEPRINT III.4, all locked)

Ink → **Credit** (Handy-Guthaben; Nan's biscuit-tin vouchers on chapter-seal) · XP → **"Lines"** written into the journal · Chronicle → **the Trip Journal** (stamped days, Fragments as receipts/stubs/quoted sentences, choice-marginalia) · Seal Trials → **Big Moments** (doorstep hello · the first account · the record-correction · the office chat · the dinner retelling · the shop rush · the crisis meeting · stopping the sale · the toast · the talk with Niko · reading your account · mission control · the certificate chat + speech) — gauntlet mechanics verbatim (2 due + format ladder; smudge → receptive-first re-queue; the interlocutor waits and rephrases: Law 3 is how real conversation repairs) · Quickquill → small-talk sprints (mastered-only).

## 7. The register sheet (the standing rubric for every chapter-wave review)

1. **Nobody says "stolen" in narration** — only the rumor does, and the story visibly disowns it. No police, ever; this stays a family-and-program matter.
2. **No villains.** Adults are kind people who err (Sue's hesitation, the coordinator's clumsy fix); Lewis is careless, not cruel — and owns it (F6 before his ch10 line).
3. **Callum's parody converts to care** on an authored beat ("…this isn't an episode, is it."). Comic relief never lands on Niko's pain.
4. **Niko keeps agency**: he asks for things (ch7), sets the ch10 terms, forgives specifically ("You told the truth that day…"), never generically. The wedding re-welcomes him BEFORE the regret chapter — ch10 is about harm-that-outlives-truth, not suspense.
5. **A2+ discipline:** ≤2 sentences per panel, ≤200 words per scene; every above-bank word glossed `(= deutsches Wort)`; UK realia glossed once each (host family (= Gastfamilie), charity shop (= Secondhand-Laden)).
6. **scaffoldDe on every scene, collapsed** ("Auf Deutsch?" chip — diegetically motivated: Frau Maier IS the German voice of the week); du-form only; zero meta-talk (VS-8) — Frau Maier says "sag es so: …", never a grammar term.
7. **Scaffold fade from ch8** ("by now you live in English") — exactly when companion abilities become the earned replacement.
8. **Every heavy scene ends with one warm hand** (Nan, Callum, Ash).
9. **Accuracy colors flavor within the authored emotional band, never position, never flags, never endings** (the G3 precedent, restated).
10. **The theme line is Nan's and appears twice, verbatim**: ch10 and ch13 — "You can't unsay a thing, love. But you can say the next thing."

## 8. Chapter 1, the voice test (in the bundle, unreleased)

Ch1 "The Longest Day" demonstrates: the register at A2+ under the full level gate; diegetic taskSlots riding real g4-u01 items (past continuous + arrival vocab); the doorstep-hello Big Moment as an authored scene beat; Nan and the ring planted without a single suspicious note (the fair-play discipline: ch1 is pure warmth — the loss must land in ch2 on a happy world); glosses + scaffolds; the journal conceit opening ("Frau Maier says: write one line every day. In English."). No fork (fork 1 is ch4) — ch1 needs no schema additions and validates against today's `story@1`.

## 9. Decisions to sign (the gate)

1. **Destination:** England/Leicester (recommended — the National Space Centre is real and perfect for ch12) vs Ireland (nearly free swap; Irish Nan bridges u01's Ireland vocabulary through her stories either way — she does so already in ch1).
2. **Title:** "Lost for Words" (EN) / "Sprachlos" (DE display) — or your alternative.
3. **Package rename confirmed:** `@domigo/game-trip`, story id `g4.st.lost-for-words` (already the bundle path).
4. **3D intent:** keep the ch12 mission-simulator set-piece as forfeit-first (recommended) or drop now.

**On approval:** the register sheet (§7) becomes the rubric for every chapter-wave PR; the build proceeds per BLUEPRINT III.4 (PR-1 flags/validators → PR-2 package skeleton → PR-3+ chapter waves; September floor = ch1–5).
