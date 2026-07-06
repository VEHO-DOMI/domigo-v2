# 14 · The Feedback Register (G-D) + the Trap Names (D-2)

_The standing rubric for every feedback string the app ever shows a student — embedded verbatim
in every enrichment-wave prompt, and the sheet Koki signs at the **G-D gate (~30min)**. §7 is the
**D-2 names-gate (~20min)**: the 18 trap names his classes will say aloud._

Status: **DRAFT — awaiting the G-D + D-2 gates.** The trap registry itself is live in
`content/corpus/traps/traps.json` (`trap-registry@1`, validated by V-TR in `pnpm content
validate`); the engine classifier (`classifyWrong`, `@domigo/engine`) tags wrong typed answers
with these ids into `practice_attempts.context.trap`. Nothing student-facing renders these
strings yet — D-1 (the Feedback Card) is the consumer.

---

## 1. The three laws of the register

1. **Failure changes pace, never tone** (Law 3). A wrong answer earns the same warm, workshop
   voice as a right one. No verdict-shaming, no "schon wieder", no sad sounds, no red X.
2. **The kid can act on it in one breath.** Every feedback line names ONE thing and points ONE
   way forward. If a line teaches two things, it teaches nothing.
3. **du-form German, zero jargon, zero meta-talk.** No "Präteritum", no "Verlaufsform", no
   "unregelmäßiges Verb" — the registry's kid names ARE the vocabulary ("ein wildes Verb").
   No "Aufgabe", "Übung", "Lektion", "Level" inside feedback text.

## 2. The fixed verdict words (never randomized, never synonymized)

| Tier | Verdict | Never |
|---|---|---|
| correct | **Stark!** | "Perfekt!!", "Genie!", rotating praise |
| partial | **Fast!** | "Fast richtig, aber…" (the *aber* undoes the *Fast*) |
| close | **Knapp!** | "Tippfehler!" (names the person, not the string) |
| wrong | **Schau her:** | "Falsch.", "Leider nein", any ✗/red icon |

The verdict word is the FIRST token of every feedback line. A kid who reads nothing else still
gets the honest temperature.

## 3. The word budget (German words per feedback line, verdict word included)

| Grade | Budget | Why |
|---|---|---|
| G1 | ≤ 10 | reads at listening speed; every extra word costs the point |
| G2 | ≤ 12 | one clause of explanation fits |
| G3 | ≤ 14 | contrast pair + cue fits |
| G4 | ≤ 16 | full contrast + a forward pointer fits |

English inside a feedback line: **only the corrected form itself** (and at G1, gloss any English
word that isn't the answer). The correct form is always shown exactly as the student should have
typed it — canonical case, no quotes-within-quotes.

## 4. The shape of a wrong-answer line

**Schau her: + [trap name or cue] + [the contrast] + [the rule in kid words].**
When `classifyWrong` returned a trap id, the line SPEAKS THE TRAP NAME — that's what the names
are for: the same lion shows up in practice, in review, and in the kid's head at the Schularbeit.

> Schau her: go ist ein wildes Verb 🦁 — gestern → **went**. Kein -ed.

When there is no trap id (most wrong answers), the line shows the correct form with the changed
part highlighted and ONE orienting cue — never a lecture.

## 5. The ten calibration pairs (the G-D sheet itself)

Gap-fill: _"Yesterday I ___ to school."_ — student typed **goed** (G1 unless stated).

| # | Case | GOOD | BAD — and why it fails |
|---|---|---|---|
| 1 | The canonical trap (wilde-verben) | **Fast! go ist ein wildes Verb: gestern → went. Kein -ed.** | "Falsch. Das Präteritum von 'go' lautet 'went', da 'go' ein unregelmäßiges Verb ist und daher keine -ed-Endung erhält." — jargon, lecture, verdict-shaming, 2× budget |
| 2 | Guilt (3rd wrong in a row) | **Schau her: gestern → went. Das kommt gleich nochmal!** | "Schade, schon wieder falsch. Denk doch mal nach!" — names the kid, not the trap; guilt is not a strategy |
| 3 | Meta-talk leak | **Stark! went — genau so.** | "Super, du hast die Aufgabe zum Präteritum gelöst!" — "Aufgabe" + jargon; the story world has no Aufgaben |
| 4 | Unglossed English at G1 | **Fast! Schau: yesterday (= gestern) → went.** | "Fast! Remember: yesterday needs the past form." — a G1 kid who just failed the English gets MORE unglossed English |
| 5 | Praise calibration | **Stark! went — das wilde Verb sitzt.** | "Wow, du bist ein Genie!!" — praises the person, not the work; inflates, then deflates on the next wrong |
| 6 | Sie-leak | **Schau her: gestern → went. Merk dir das wilde Verb.** | "Schauen Sie: 'went' ist hier korrekt." — Sie-form; the app speaks to a kid, not a parent |
| 7 | Partial tier (half right) | **Fast! I went ist stark — schau noch auf to school.** | "Teilweise korrekt (50%)." — a percentage is a verdict, not a direction; name what WAS right first |
| 8 | Close tier (one letter off) | **Knapp! beautiful — nur ein Buchstabe. Tipp es einmal richtig.** | "Fast richtig, achte auf die Rechtschreibung!" — "Rechtschreibung" is a school-subject word; the fix is showing the word |
| 9 | Reveal at G1 | **Schau her: went. Das kommt gleich nochmal!** | "Die richtige Antwort war 'went'. Nächste Frage." — "war" closes the door; the re-encounter is a promise, not a burial |
| 10 | Trap name as teaching (falsche-freunde, G3) | **Schau her: become heißt werden 🎭 — bekommen heißt get.** | "Vorsicht, 'become' ist ein sogenannter 'falscher Freund' (false friend) im Englischen." — explains the label instead of the words; "sogenannter" is teacher-desk voice |

**The test for any new line:** read it aloud in the voice of a good friend who's one year older.
If it sounds like a teacher's desk, rewrite it.

## 6. Where the register applies

Every string in: D-1 Feedback Cards · `hintDe`/`explainDe` on items · `trickDe`/`distractorMeta.whyDe`
(listening/test waves — already validator-enforced du-form) · trap `oneLinerDe`/`contrast.de`
(V-TR-enforced) · retry nudges · review-queue copy. The validators catch Sie-leaks mechanically;
this sheet is the judgment layer the validators can't check.

## 7. THE TRAP NAMES — the D-2 names-gate (Koki, ~20min)

_These names are said aloud in class. Rename freely — the `id` stays stable (code + data key),
only `nameDe` changes. Icon = the one stable semantic anchor app-wide._

| id | nameDe | icon | One-liner (as shipped) | Machine-detected? |
|---|---|---|---|---|
| `wilde-verben` | Wilde Verben | 🦁 | Wilde Verben folgen keiner Regel: go → went. | ✓ |
| `gestern-falle` | Gestern-Falle | 🕰️ | gestern / last / ago = vorbei → Vergangenheits-Form. | ✓ |
| `do-falle` | Do-Falle | ❓ | Im Deutschen drehst du um — im Englischen fragt do/does zuerst. | ✓ |
| `not-allein` | Not-allein-Falle | 🚫 | not steht nie allein: don't, doesn't, isn't. | ✓ |
| `wann-ans-ende` | Wann-ans-Ende-Falle | 📦 | Im Deutschen mittendrin — im Englischen: Zeit ans Ende. | — (authored only) |
| `he-she-it-s` | He-She-It-s | 🐍 | he/she/it → das s muss mit: she plays. | ✓ |
| `jetzt-oder-immer` | Jetzt-oder-immer-Falle | ⏯️ | jetzt gerade → am/is/are + -ing · immer → einfache Form. | ✓ |
| `mischmasch` | Mischmasch-Falle | 🥣 | Entweder I play oder I am playing — nie halb-halb. | ✓ |
| `falsche-freunde` | Falsche Freunde | 🎭 | become heißt werden — bekommen heißt get! | ✓ (8 sub-entries) |
| `wem-gehoerts` | Wem-gehört's-Falle | 🔑 | his/her fragt: WEM gehört es? — nicht der/die/das. | ✓ |
| `zaehl-falle` | Zähl-Falle | 🧮 | Zwei oder mehr → s: two cats. Aber: information bleibt allein. | ✓ |
| `a-oder-an` | a-oder-an-Falle | 🍎 | an vor Vokal-KLANG: an apple — aber a university. | ✓ |
| `nackte-adjektive` | Nackte-Adjektive-Falle | 🧥 | Englische Adjektive bleiben nackt: the blue cars. | — (authored only) |
| `wie-ly` | Wie?-ly-Falle | 🐌 | WIE macht er es? → -ly: carefully. | ✓ |
| `groesser-falle` | Größer-Falle | 📏 | Kurz + -er: bigger. Lang mit more. good → better! | ✓ |
| `seit-falle` | Seit-Falle | 📅 | seit einem PUNKT → since 2023 · seit einer DAUER → for three years. | ✓ |
| `wenn-falle` | Wenn-Falle | 🔮 | Nach if kein will: If it rains, … | ✓ |
| `halb-neun` | Halb-Neun-Falle | 🕤 | halb neun = 8:30 — aber half past nine = 9:30! | — (listening clinic) |

**What the classifier promises (and what it doesn't):** `classifyWrong` fires only on a
confident single match — a wrong trap name mis-teaches, so null is the default and the common
case. It never changes the tier or the XP; it's a label on an already-graded wrong answer.
Choice-format traps are authored per distractor (`distractorMeta` in the wave schema), not
machine-guessed.

**Downstream (after the gates):** D-1 Feedback Cards speak the trap names · review queue can
group by `context.trap` ("Deine Löwen-Woche: 4× wilde Verben") · the 246 `commonErrors[]`
entries in the structures catalogs get `trapRef` mapping (separate PR) · the Schularbeit-trainer
surfaces each kid's top-3 traps.
