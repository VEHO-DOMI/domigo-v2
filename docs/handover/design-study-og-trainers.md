# Design Study — The Four ORIGINAL DomiGo Trainers

Source-of-truth extraction for the DomiGo Design Language pack.
Extracted 2026-07-13 directly from the live single-file sources:

| Grade | Repo (`VEHO-DOMI/…`, branch `main`, file `index.html`) | File version header | Size |
|---|---|---|---|
| 1st | `1st-grade-vocab-trainer` | `v2.0 – 2026-03-29 · DomiGo + DomiGrammar 1st Grade` | 16,952 lines |
| 2nd | `2nd-grade-vocab-trainer` | `v3.1 – 2026-04-03 · DomiVocab 2nd Grade · Grammar Mode` | 15,367 lines |
| 3rd | `3rd-grade-vocab-trainer` | `v3.1 – 2026-04-01 · DomiVocab 3rd Grade · Grammar Mode` | 18,576 lines |
| 4th | `4th-grade-vocab-trainer` | `v3.1 – 2026-04-01 · DomiVocab 4th Grade · Grammar Mode` | 12,967 lines |

All four share one codebase skeleton (same class names, same variable names, same screen
architecture); each grade re-skins it via `:root` custom properties and swaps flavor copy.
Everything below is verbatim from source. Hexes are exact; arrays are exact.

---

## 1. CSS Palette (per trainer)

Every trainer defines the SAME set of custom properties on `:root, [data-theme="light"]`
and overrides them on `[data-theme="dark"]`. Shared structural tokens in every file:
`--radius: 16px; --radius-lg: 24px;`.

### Grade hue identities

| | 1st | 2nd | 3rd | 4th |
|---|---|---|---|---|
| Identity | **Green** (fresh/garden) | **Red** (warm/warmth) | **Blue** (school/club) | **Violet** (arcane/gamer) |
| `<meta theme-color>` | `#F0FFF4` (light) | `#FFF8F0` (light) | `#0b1120` (dark) | `#0e0b1a` (dark) |
| iOS status bar | `default` | `default` | `black-translucent` | `black-translucent` |

### Light theme (`:root, [data-theme="light"]`)

| Token | 1st (green) | 2nd (red) | 3rd (blue) | 4th (violet) |
|---|---|---|---|---|
| `--bg` | `#eefbf2` | `#fdf0f0` | `#edf4ff` | `#f6f0ff` |
| `--bg2` | `#d8f5e1` | `#fbe4e4` | `#e2edfc` | `#ece2fb` |
| `--card` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` |
| `--card-border` | `rgba(22,163,74,0.16)` | `rgba(200,40,40,0.14)` | `rgba(37,99,235,0.16)` | `rgba(124,58,237,0.18)` |
| `--card-hover` | `#f4fcf6` | `#fef6f6` | `#f5f8fd` | `#f8f4fd` |
| `--card-solid` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` |
| `--text` | `#14532d` | `#1c1917` | `#1e293b` | `#1e1b2e` |
| `--text-secondary` | `#2d4e36` | `#4a3f3a` | `#3d4f66` | `#4a4260` |
| `--muted` | `#5a8068` | `#8a7e78` | `#6b7d96` | `#736c8e` |
| `--accent` | `#16a34a` | `#dc2626` | `#2563eb` | `#7c3aed` |
| `--accent-light` | `#22c55e` | `#ef4444` | `#3b82f6` | `#8b5cf6` |
| `--accent-glow` | `rgba(22,163,74,0.15)` | `rgba(220,38,38,0.15)` | `rgba(37,99,235,0.15)` | `rgba(124,58,237,0.15)` |
| `--accent-deep` | `#15803d` | `#b91c1c` | `#1d4ed8` | `#6d28d9` |
| `--accent2` | `#15803d` | `#b91c1c` | `#1d4ed8` | `#6d28d9` |
| `--accent2-glow` | `rgba(21,128,61,0.15)` | `rgba(185,28,28,0.15)` | `rgba(29,78,216,0.15)` | `rgba(109,40,217,0.15)` |
| `--correct` | `#16a34a` | `#16a34a` | `#16a34a` | `#16a34a` |
| `--correct-glow` | `rgba(22,163,74,0.12)` | `rgba(22,163,74,0.12)` | `rgba(22,163,74,0.12)` | `rgba(22,163,74,0.12)` |
| `--wrong` | `#dc2626` | `#c2410c` ⚠ | `#dc2626` | `#dc2626` |
| `--wrong-glow` | `rgba(220,38,38,0.12)` | `rgba(194,65,12,0.12)` | `rgba(220,38,38,0.12)` | `rgba(220,38,38,0.12)` |
| `--context-color` | `#0d9488` | `#dc2626` | `#0284c7` | `#7c3aed` |
| `--def-color` | `#15803d` | `#b91c1c` | `#1d4ed8` | `#6d28d9` |
| `--trans-color` | `#0d9488` | `#9f1239` | `#6366f1` | `#7c3aed` |
| `--shadow-card` | `0 2px 8px rgba(20,100,50,0.07), 0 1px 3px rgba(0,0,0,0.05)` | `0 2px 8px rgba(160,30,30,0.07), 0 1px 3px rgba(0,0,0,0.05)` | `0 2px 8px rgba(30,70,180,0.07), 0 1px 3px rgba(0,0,0,0.05)` | `0 2px 8px rgba(100,50,200,0.07), 0 1px 3px rgba(0,0,0,0.06)` |
| `--shadow-elevated` | `0 6px 20px rgba(20,100,50,0.12)` | `0 6px 20px rgba(160,30,30,0.12)` | `0 6px 20px rgba(30,70,180,0.12)` | `0 6px 20px rgba(100,50,200,0.12)` |

⚠ 2nd grade's `--wrong` is burnt-orange (`#c2410c`), not pure red, so error states stay
distinguishable from the red accent — a deliberate collision-avoidance move.

### Dark theme (`[data-theme="dark"]`)

| Token | 1st | 2nd | 3rd | 4th |
|---|---|---|---|---|
| `--bg` | `#0a0f10` | `#110b0e` | `#0b1120` | `#0e0b1a` |
| `--bg2` | `#101a14` | `#1a1014` | `#121d30` | `#16122c` |
| `--card` | `rgba(140,255,180,0.06)` | `rgba(255,160,160,0.07)` | `rgba(140,180,255,0.07)` | `rgba(180,150,255,0.08)` |
| `--card-border` | `rgba(100,220,140,0.14)` | `rgba(255,120,120,0.14)` | `rgba(100,160,255,0.14)` | `rgba(160,120,255,0.16)` |
| `--card-hover` | `rgba(140,255,180,0.09)` | `rgba(255,160,160,0.10)` | `rgba(140,180,255,0.10)` | `rgba(180,150,255,0.12)` |
| `--card-solid` | `#142218` | `#201418` | `#182640` | `#211a3d` |
| `--text` | `#edf2ee` | `#f2eded` | `#eef0f6` | `#eef0f6` |
| `--text-secondary` | `#b4ccba` | `#d0b8b8` | `#b0bdd4` | `#bfb0d8` |
| `--muted` | `#7a9a82` | `#a08888` | `#7e92ad` | `#8878a8` |
| `--accent` | `#22c55e` | `#ef4444` | `#3b82f6` | `#8B5CF6` |
| `--accent-light` | `#4ade80` | `#f87171` | `#60a5fa` | `#A78BFA` |
| `--accent-glow` | `rgba(34,197,94,0.25)` | `rgba(239,68,68,0.25)` | `rgba(59,130,246,0.25)` | `rgba(139,92,246,0.25)` |
| `--accent-deep` | `#15803d` | `#b91c1c` | `#004f9f` ⚠ | `#5B21B6` |
| `--accent2` | `#4ade80` | `#f87171` | `#60a5fa` | `#a78bfa` |
| `--correct` | `#22c55e` | `#22c55e` | `#22c55e` | `#22c55e` |
| `--wrong` | `#ef4444` | `#fb923c` | `#ef4444` | `#ef4444` |
| `--context-color` | `#2dd4bf` | `#f87171` | `#38bdf8` | `#A78BFA` |
| `--def-color` | `#4ade80` | `#f87171` | `#60a5fa` | `#a78bfa` |
| `--trans-color` | `#2dd4bf` | `#fb7185` | `#818cf8` | `#c4b5fd` |
| `--shadow-card` | `0 2px 16px rgba(0,0,0,0.35), 0 0 0 1px rgba(34,197,94,0.10)` | same pattern w/ `rgba(239,68,68,0.10)` | same w/ `rgba(59,130,246,0.10)` | same w/ `rgba(139,92,246,0.12)` |
| `--shadow-elevated` | `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,197,94,0.14)` | same w/ `rgba(239,68,68,0.14)` | same w/ `rgba(59,130,246,0.14)` | same w/ `rgba(139,92,246,0.16)` |

⚠ 3rd grade dark `--accent-deep: #004f9f` — a deep "club" blue outlier (not a Tailwind stop).

### Dark-mode body backdrop (radial aurora)

Every trainer paints the same 3-ellipse fixed radial-gradient aurora in dark mode; only the
tint changes:

```css
[data-theme="dark"] body {
  background-image:
    radial-gradient(ellipse 100% 60% at 50% -30%, <TINT-A>, transparent 70%),
    radial-gradient(ellipse 80% 50% at 100% 100%, <TINT-B>, transparent 70%),
    radial-gradient(ellipse 50% 40% at 0% 80%, <TINT-C>, transparent);
  background-attachment: fixed;
}
```

| | TINT-A (top halo) | TINT-B (bottom-right) | TINT-C (bottom-left) |
|---|---|---|---|
| 1st | `rgba(20,140,60,0.18)` | `rgba(34,197,94,0.06)` | `rgba(40,160,80,0.04)` |
| 2nd | `rgba(180,30,30,0.20)` | `rgba(239,68,68,0.06)` | `rgba(200,80,40,0.04)` |
| 3rd | `rgba(0,79,159,0.18)` | `rgba(59,130,246,0.08)` | `rgba(245,158,11,0.05)` ⚠ amber |
| 4th | `rgba(91,33,182,0.18)` | `rgba(139,92,246,0.08)` | `rgba(245,158,11,0.05)` ⚠ amber |

3rd and 4th sneak a warm amber ember into the bottom-left corner; 1st and 2nd stay monochrome.

### Card / button / pill recipe (identical across all four)

```css
.card { background: var(--card); border: 1px solid var(--card-border);
  border-radius: var(--radius-lg); padding: 1.2rem 1.1rem; margin-bottom: 0.8rem;
  backdrop-filter: blur(20px); box-shadow: var(--shadow-card); }
.card h3 { font-size: 0.68rem; color: var(--accent2); text-transform: uppercase;
  letter-spacing: 0.12em; font-weight: 700; }

.btn { padding: 0.75rem 1.4rem; border: none; border-radius: var(--radius);
  font-size: 0.88rem; font-weight: 700; letter-spacing: -0.01em;
  transition: all 0.2s cubic-bezier(0.22,1,0.36,1); }
.btn:hover { transform: translateY(-2px); }
.btn:active { transform: scale(0.97) translateY(0); }
.btn-primary { background: linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%);
  color: white; box-shadow: 0 4px 20px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.15);
  text-shadow: 0 1px 2px rgba(0,0,0,0.2); }

.profile-name .class-tag { font-size: 0.62rem; font-weight: 700; padding: 2px 8px;
  border-radius: 6px; background: var(--accent-glow); color: var(--accent);
  letter-spacing: 0.5px; border: 1px solid var(--card-border); }

.profile-rank-pill { font-size: 0.82rem; padding: 6px 16px; border-radius: 12px;
  font-weight: 800; letter-spacing: 0.3px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
```

Zone pills (identical everywhere):

```css
.profile-rank-pill.zone-bronze   { background: linear-gradient(135deg, #d4874a, #92572a); color: #fff; }
.profile-rank-pill.zone-silver   { background: linear-gradient(135deg, #b8b8b8, #6b6b6b); color: #fff; }
.profile-rank-pill.zone-gold     { background: linear-gradient(135deg, #f0c040, #a67c2e); color: #412402; }
.profile-rank-pill.zone-diamond  { background: linear-gradient(135deg, #b8a9f0, #6e5cbf); color: #fff; }
.profile-rank-pill.zone-prestige { background: linear-gradient(135deg, #a855f7, #6366f1); color: #fff; }
```

`ZONE_COLORS` JS constant (identical everywhere):

```js
const ZONE_COLORS = {
  bronze:{bg:'#92572a',light:'#f5c4a1',text:'#4a1b0c',accent:'#d4874a'},
  silver:{bg:'#6b6b6b',light:'#d3d1c7',text:'#2c2c2a',accent:'#9e9e9e'},
  gold:{bg:'#a67c2e',light:'#fac775',text:'#412402',accent:'#d4a43a'},
  diamond:{bg:'#6e5cbf',light:'#cecbf6',text:'#26215c',accent:'#8f83d8'},
  prestige:{bg:'linear-gradient(135deg, #a855f7, #6366f1)',text:'#e9d5ff',pill:'#a855f7'},
};
```

XP progress fill zone colors (rank bar): `{ bronze:'#d4874a', silver:'#9e9e9e', gold:'#f0c040', diamond:'#b8a9f0' }`.

Per-grade one-off surfaces: the battle modal background is `#FFF8F0` (cream) in 2nd,
`#161d2e` in 3rd, `#1a1528` in 4th; battle timer fill `#d97706` (2nd) / `#f59e0b` (3rd).
Daily-challenge card tint: 1st+2nd use `rgba(224,96,32,…)` orange, 3rd+4th use
`rgba(251,191,36,…)`→`rgba(245,158,11,…)` amber. Screens animate in with
`screenIn 0.3s cubic-bezier(0.22,1,0.36,1)` (fade + 12px rise).

---

## 2. Typography & Wordmark

Identical Google-Fonts stack in all four heads:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- **Body**: `font-family: 'Inter', system-ui, -apple-system, sans-serif;` line-height 1.5, antialiased.
- **Display** (`Fredoka`): wordmark, `.profile-name`, `.nav-title`, `h2`, `.card h3`, `.login-card h2`, `.lb-name`, mode/battle buttons.
- **Micro-labels** (`Quicksand`): header tagline + school line only.
- Weights actually used: Inter 400–900 (800 for names/headings); Fredoka 600/700.

**Wordmark** (`.header-title`): text "DomiGo", Fredoka 700, `font-size: 48px`,
`letter-spacing: -1px`, gradient-clipped text (`-webkit-background-clip: text`), with a
280×280px radial `header-glow` orb floating behind it. Gradient per grade:

| Grade | `.header-title` background-image | glow |
|---|---|---|
| 1st | `linear-gradient(140deg, #16A34A, #22C55E 40%, #15803D 80%)` | `rgba(22,163,74,0.06)` |
| 2nd | `linear-gradient(140deg, #d43a2a, #e8654a 40%, #b82e1e 80%)` | `rgba(200,60,40,0.09)` |
| 3rd | `linear-gradient(140deg, #3b82f6, #8ba4cc 50%, #d4943a 90%)` ⚠ ends in amber-gold | `rgba(37,99,235,0.12)` |
| 4th | `linear-gradient(140deg, #9b6dff, #c4a8f0 50%, #d4943a 90%)` ⚠ ends in amber-gold | `rgba(139,92,246,0.12)` |

Header stack (identical structure): wordmark → `.header-tagline` "English · Vocabulary & Grammar"
(Quicksand 600, uppercase, `letter-spacing: 3px`, 13px — **11px in 1st only**, opacity 0.7) →
`.header-grade` "1st Grade" / "2nd Grade" / "3rd Grade" / "4th Grade" (Fredoka 600, 16px,
`color: var(--accent)`) → `.header-school` (Quicksand 600, 9.5px). School line reads
"Orhan Vehabovic" in 1st–3rd; 4th spells out
"VEHO – Gymnasium und wirtschaftskundliches Realgymnasium der Dominikanerinnen".

Type scale elsewhere: card section headers 0.68rem uppercase; buttons 0.88rem/700;
profile name 1.1rem/800; login h2 1.4rem/800; battle countdown 64px/900.

---

## 3. The XP System

### 3a. XP curve — identical thresholds in ALL ladders of ALL four trainers

Levels 1–20 + 5 prestige tiers. Cumulative XP thresholds (verbatim):

```
L1 0 · L2 50 · L3 120 · L4 220 · L5 350 · L6 500 · L7 700 · L8 950 · L9 1250 · L10 1600
L11 2000 · L12 2700 · L13 3500 · L14 5000 · L15 6500 · L16 8000 · L17 11000 · L18 15000
L19 20000 · L20 30000
Prestige: P1 30000 · P2 45000 · P3 65000 · P4 90000 · P5 120000  (name freezes at max title)
```

Zones: L1–5 **bronze**, L6–10 **silver**, L11–15 **gold**, L16–20 **diamond**, L21–25 **prestige**
(prestige shows ⭐ stars before the pill text, one per prestige rank).

### 3b. Vocab title ladder — TWO variants

**1st grade (unique, gentler "young learner" ladder):**

| Lv | Name | vibe |
|---|---|---|
| 1 | Wordling | just spawned in |
| 2 | Word Scout | exploring the map |
| 3 | Spelling Bee | letter by letter |
| 4 | Vocab Hunter | on the hunt |
| 5 | Word Collector | collecting words |
| 6 | Dictionary Diver | diving deep |
| 7 | Phrase Finder | finding the right words |
| 8 | Word Warrior | battle-tested |
| 9 | Vocab Viking | conquering word by word |
| 10 | Language Explorer | exploring new worlds |
| 11 | Word Wizard | casting word spells |
| 12 | Vocab Champion | unbeatable |
| 13 | Word Master | mastering words |
| 14 | Lexicon Legend | a living legend |
| 15 | Vocab Virtuoso | top-tier performance |
| 16 | Word Titan | a titan of words |
| 17 | Language Lord | ruling the language |
| 18 | Vocab Sovereign | sovereign in all situations |
| 19 | Word Emperor | nothing left to prove |
| 20 | Grandmaster | GG |
| 21–25 | Grandmaster (P1–P5) | prestige unlocked / rising legend / elite status / mythic tier / ultimate master |

**2nd, 3rd, 4th grade (identical "gamer" ladder):**

| Lv | Name | vibe |
|---|---|---|
| 1 | Wordling | just spawned in |
| 2 | Word Scout | exploring the map |
| 3 | Spell Rookie | learning the controls |
| 4 | Letter Looter | grabbing the first loot |
| 5 | Vocab Raider | raiding the word vault |
| 6 | Word Crafter | crafting with words now |
| 7 | Phrase Builder | building something real |
| 8 | Syntax Striker | landing clean hits |
| 9 | Word Warrior | battle-tested |
| 10 | Vocab Veteran | seen some things |
| 11 | Language Ninja | silent but deadly accurate |
| 12 | Word Wizard | spells are getting real |
| 13 | Grammar Ghost | moves through units unseen |
| 14 | Vocab Viking | conquering word by word |
| 15 | Lexicon Legend | people know your name |
| 16 | Word Warden | guarding the language |
| 17 | Sentence Sovereign | ruling the syntax realm |
| 18 | Vocab Titan | final boss energy |
| 19 | Language Overlord | nothing left to prove |
| 20 | Grandmaster | GG |
| 21–25 | Grandmaster (P1–P5) | prestige unlocked / rising legend / elite status / mythic tier / ultimate master |

### 3c. Grammar title ladder (separate `grammarXp` pool, same thresholds)

Identical in 2nd/3rd/4th; 1st differs ONLY at level 1 (`Rule Rookie` / vibe
"first rule learned" instead of `Rule Noob` / "just spawned in"):

```
1 Rule Noob (1st: Rule Rookie) · 2 Comma Kid · 3 Tense Cadet · 4 Sentence Slicer ·
5 Grammar Gremlin · 6 Clause Cruncher · 7 Syntax Sniper · 8 Rule Breaker ·
9 Grammar Gladiator · 10 Tense Titan · 11 Error Assassin · 12 Grammar Goat ·
13 Sentence Sorcerer · 14 Punctuation Pirate · 15 Rule Overlord · 16 Grammar Dragon ·
17 Clause Commander · 18 Grammar Galaxy · 19 Language Lich · 20 Grammar God ·
21–25 Grammar God (P1–P5)
```

Vibes verbatim: "finding the basics", "past, present, future...", "chopping up sentences",
"causing chaos with rules", "eating clauses for breakfast", "every shot hits",
"knows rules to break them", "arena-tested", "master of time", "hunts mistakes for fun",
"greatest of all time", "casting grammar spells", "stealing commas everywhere",
"all rules bow to you", "breathing grammar fire", "commanding the syntax fleet",
"a universe of rules", "undying grammar power", "GG".

### 3d. OVERALL ladder (vocab XP + grammar XP combined; identical in all four)

```
L1 0        First Steps          bronze   'every journey starts here'
L2 300      Listener             bronze   'tuning in to English'
L3 1000     Communicator         silver   'starting to get your point across'
L4 3000     Storyteller          silver   'finding your voice in English'
L5 6000     Translator           gold     'bridging two languages'
L6 12000    Globetrotter         gold     'English takes you places'
L7 20000    Polyglot             gold     'fluency is within reach'
L8 35000    Native Speaker       diamond  'sounds like you grew up with it'
L9 55000    Language Architect   diamond  'building English like a pro'
L10 80000   English GOAT         diamond  'greatest English learner of all time'
```

### 3e. CLASS ladder (whole-class collective XP; identical in all four)

```
L1 0        Study Group     'just getting started together'
L2 2000     Book Club       'reading the same page'
L3 8000     Think Tank      'brains working together'
L4 20000    Dream Team      'unstoppable together'
L5 40000    Brain Squad     'collective genius'
L6 70000    Power Crew      'no challenge too big'
L7 110000   Super Class     'above and beyond'
L8 160000   Legend League   'the stuff of legends'
L9 220000   Hall of Famers  'every name remembered'
L10 300000  World Class     'the best class on the planet'
```

### 3f. What earns XP (identical `XP_TABLE` in all four)

```js
const XP_TABLE = { 'context': 8, 'context-hard': 8, 'definition': 10, 'definition-hard': 10,
                   'translation': 7, 'mc-context': 3, 'mc-definition': 4, 'mc-translation': 5 };
```

Session XP formula (`calculateSessionXP`): per correct answer
`base = XP_TABLE[type] × comboMult`, halved if "close" (typo-tolerant near-miss),
minus hint penalty, floor 1. **Perfect-session bonus**: +20 XP if ≥5 questions and all
correct with no "close". **Streak bonus**: `+ min(dayStreak, 7) × 5` XP per session.

Combo multipliers (per-answer, reset on wrong):

- 1st grade (gentler, emoji labels): `streak 2 → 1.5x 🔥 · 4 → 2x 🔥🔥 · 7 → 3x 🔥🔥🔥`
- 2nd/3rd/4th: `streak 3 → 1.5x · 5 → 2x · 10 → 3x`

Grammar mode adds graded credit (`TIER_XP_FACTOR = { correct: 1, partial: 0.25, close: 0.5, wrong: 0 }`
on a base of 10 × combo).

Mini-game XP (4th-grade calibration, labeled "G4" in source):
- **Memory Match**: 3 XP/pair; +12 efficiency bonus if moves ≤ pairs×1.4; +8 speed bonus if also ≤120s.
- **Spelling Bee**: 8 XP/word (4 with hint), +3 for ≥12-char targets without hint; session mastery bonus +10 (≥80%) / +5 (≥60%).
- **Word Hunt**: 6 XP/round + 10 streak bonus if ≥6/8 rounds net-positive.
- **Class Quiz**: quiz points converted to XP and saved via `xp: increment(xp)`; also feeds the weekly class goal.

Day-streak rule (`updateStreak`): same-day = no change; consecutive-day = streak+1; gap = reset to 1.
**Daily Challenge**: 10 seeded words per day (`dailySeed(dateStr, classId)` — same 10 for the whole
class), mixed typed types (`context`/`definition`/`translation`); logged to `dailyChallengeLog[date] = {score,total,pct}`.
**Weekly class goal**: `WEEKLY_GOAL_TARGET = 5000` XP per class per week (Monday-keyed Firestore doc
`weeklyGoals/<weekKey>`); every XP source calls `contributeToWeeklyGoal(xp)`.

### 3g. Badges (unlockables; vocab set = 28 in 4th, verbatim)

`First Steps 🌟 (1 session) · On Fire 🔥 (10 sessions) · Unstoppable 🚀 (50 sessions) ·
Quick Learner 🧠 (master 10 words) · Word Collector 📚 (50) · Vocabulary Champion 🏆 (100) ·
Master of All 👑 (every word) · Flawless 💯 (10/10 round) · 3-Day Streak 📅 · Weekly Warrior ⚡ (7-day) ·
Explorer 🎨 (all 5 exercise types) · Daily Challenger 🌅 · Daily Genius ✨ (100% daily) ·
Speed Demon 💨 (15+ in Speed Round) · Sprinter 🏃 (10 sprints) · Sharp Eye 👁️ (20+ MC) ·
Context Ace 🎯 (90%+ context) · Definition Master 📖 (90%+ definition) ·
Giant Killer 🗡️ (beat a higher-ranked player) · Variety Pack 🎪 (all 5 types in one day) ·
Comeback Kid 🔄 (100% retry-wrong) · Review Warrior 🛡️ (5 Smart Reviews) ·
Full Sweep 🧹 (every unit) · Flash Scholar 📇 (100 flashcards) · Duo Champion 🏅 (win 5 duels) ·
Prestige I ⭐ / II ⭐⭐ / III ⭐⭐⭐ (30k/45k/65k XP)`

Separate `GRAMMAR_BADGE_DEFS` ladder exists in every trainer (Grammar Rookie 🧠, Grammar
Grinder 🔥, Grammar Machine 🚀, Perfect 10 💯, 3-Day Grammar Streak, Grammar Week ⚡,
Rule Learner 🌟, Grammar Scholar 📚, Grammar Crown 👑 "Master all 34 grammar structures",
Sharpshooter 🎯 80%, Precision Master 💎 95%, Tense Tamer ⏰ …). Badge unlock = popup with
icon + name, 3s auto-dismiss, queued 3.5s apart.

---

## 4. Leaderboard

One leaderboard screen with three stacked sections (identical architecture in all four):

1. **XP leaderboard** — ranks **all-time XP of the current mode** (`xp` field, or `grammarXp`
   in grammar mode). Two lists: "My Class (4A)" (own section only), then "All Classes"
   (every section in `SECTIONS`, each row tagged with a class chip
   `section-tag section-tag-4a` etc.).
2. **⚡ Today's Challenge** — today's daily-challenge scores, own class only, ranked by
   `score` (`score/total` display).
3. **⚔️ Battle Leaderboard** — cross-class, only students with ≥1 battle, ranked by
   `battlesWon`; row shows `<wins>W · <winrate>%`.

Row anatomy (XP list): rank (🥇🥈🥉 medals for top 3, then "4.") → avatar (`avatar-sm`
34×34px rounded-10px img) → name → **level pill** (`rank-pill zone-<zone>` with prestige ⭐
stars + level TITLE, e.g. "Vocab Raider") → optional class tag → `← you` marker on own row
(row also gets `.me` highlight class) → right-aligned `1,234 XP`.

Privacy handling: **none beyond first-name display** — real student names (as registered)
are shown to the whole grade; no opt-out, no anonymization. Class filtering is structural
(My Class vs All Classes lists), not user-toggleable.

Class identity: `SECTIONS` per file, e.g. 1st: `1st-grade→1A, 1b→1B, 1c→1C`;
4th: `4a→4A, 4th-grade→4B, 4c→4C` (legacy ids kept as first-created section).

---

## 5. Battle Arena (fullest in 4th grade)

Entry: home "⚔️ Battle Arena" full-width card, subtitle "Duels, Class Quiz & battle history".
Backend: Firebase Realtime DB (presence, invites, rooms, class quiz) + Firestore (async
duels, stats, history). Three systems:

### 5a. Live Battle (synchronous 1v1, RTDB)
- Lobby lists **online** classmates via `presenceRef` (slug = lowercased-hyphenated name).
- Challenger picks a mode: `🌍 Translation Duel · 📖 Definition Duel · 📝 Context Clash`.
- Room shape: `{ players:{p1,p2}, playerNames, status: waiting|countdown|active|round-result|done,
  round, words[5], mode, answers:{[round]:{p1:{answer,correct,time},p2:…,winner}}, scores:{p1,p2}, winner }`.
- Invite flow: push to `invites` (`pending → accepted/declined/expired/cancelled`),
  30s challenger timeout, 25s invitee popup timeout.
- **5 rounds**, typed answers, per-round winner: correct beats wrong; both correct → **faster
  timestamp wins**; both wrong → draw. Early termination: lead > rounds remaining, or
  lead ≥3 after round 3.
- XP: **win 120 / draw 60 / loss 30, + 15 × your round wins** (`renderBattleResults`).
- Result emojis: win 🏆 "Victory!", draw 🤝, loss 💪. Stats written: `battlesPlayed`,
  `battlesWon`, `battleXpEarned`, `lastBattle`, and `giantKills` when beating a player with
  more XP.

### 5b. Word Duel (asynchronous turn-based, Firestore `duels` collection)
- Doc shape: `{ p1, p2, p1Name, p2Name, p1Avatar, p2Avatar, status: active|complete, mode: vocab|grammar,
  rounds: [{unitKey, questions[3], p1Answers[], p2Answers[]}], p1Score, p2Score, winner, createdAt, updatedAt }`.
- Duplicate-duel prevention (one active duel per pair). Turn logic: answer any rounds the
  opponent has opened, then **pick a unit** and open the next round (5 rounds × 3 MC
  questions, 4 options, distractors from the word's `mc` list or global pool; grammar duels
  filter `gap-fill|multiple-choice|context-picker` items with ≥3 distractors).
- Completion (both answered all 5 rounds): score = total correct (max 15).
  XP: **win 100 / draw 50 / loss 25, + 8 × your correct answers**; increments
  `duelWins`, `battlesPlayed`, `battleXpEarned`, `giantKills`; grammar duels write to
  `grammarXp`/`grammarBattlesWon` instead.
- Duel hub shows whose-turn state and a notification count of duels awaiting your move.

### 5c. Class Quiz (teacher-hosted live quiz, Kahoot-style, RTDB)
- Teacher creates room with generated 4-6-char room code; students join by code.
- Room: `{ classId, status: lobby|active|…, currentQuestion, questionRevealed, questionRevealedAt,
  questions[], players:{slug:{score,answers}}, settings:{ timeLimit: 15, questionCount } }`.
- Questions auto-generated from chosen units: types `mc-translation` (prompt "🇩🇪 <german>"),
  `mc-definition` ("📖 <definition>"), `mc-context` ("✏️ <gap sentence>"), 4 options.
- Scoring: **correct = 1000 − time penalty, floor 500; wrong = 0**
  (`points = max(500, 1000 − (timeMs/timeLimit·1000)·500)`); server-offset-corrected timing.
- Quiz points convert to student XP via `saveClassQuizXP` and feed the weekly goal.

### 5d. Battle history
Per-student Firestore subcollection `battleHistory` (last 20, newest first):
`{ opponent, result: win|loss|draw, date ISO, mode, myScore, theirScore, xpEarned }`.
Rendered with result emoji `win 🏆 · loss 💪 · draw 🤝`, mode label, date ("Jul 13"),
score "3–2" colored by result, "+xx XP". Stats card above: Played / Won / Win rate % /
Battle XP. History screen has tabs (Live Battles / Duels) in 2nd–4th.

---

## 6. Practice Modes

Mode picker = "Step 2 of 2" in practice setup (after unit + exercise-type selection).
All four trainers share the same 8-mode card list (1st renders it through its i18n `t()`
layer; icons identical):

| Mode | Icon | Verbatim description (4th) | Mechanics/scoring notes |
|---|---|---|---|
| Full Run | 📚 | "All selected words, mixed types" | typed answers, XP_TABLE + combo |
| Sprint | 🏃 | "10 random words, quick round" | 10 words; "🏃 Another Sprint" replay button |
| Speed Round | ⚡ | "60 seconds, answer fast!" | countdown timer; results trimmed to answered; best feeds Speed Demon badge |
| Multiple Choice | 🎯 | "Choose from 4 options" | mc-XP rates (3/4/5) |
| Flashcards | 📇 | "Study mode, no pressure" | direction picker 🇬🇧→🇩🇪 / 🇩🇪→🇬🇧, swipe gestures, "Got it"/"Again", saves per-word status |
| Memory Match | 🧠 | "12 pairs — match EN ↔ DE, move-efficient wins bonus XP" (3rd: "10 pairs…"; 2nd: "Match word-translation pairs") | pair-count and XP tuned per grade; 1st also has a **Grammar Memory Match** variant with topic picker |
| Spelling Bee | 🐝 | "Spell B1 words & phrases — up to 18 rounds" (3rd: "Unscramble letters — also handles phrases"; 2nd: "Unscramble letters to spell the word") | letter-tile unscramble, hint halves XP; phrase-aware normalisation (strips "to/a/the", "(…)", "sth./sb.") |
| Word Hunt | 🔍 | "Pick every B1 word that fits the theme — 8 rounds" | theme-sorting rounds, 6 XP/round + streak bonus |

Beyond the picker: **Smart Review** (spaced-repetition queue: overdue `dueDate` +15 priority,
not-seen-in-14+-days, wrong-rate weighting, "Almost mastered" nudges; home hint chip
"🔄 Smart Review (n)"), **Daily Challenge** (10 seeded words), **Word of the Day** card
(word + German + definition + source unit, same for the class each day), Dictionary/Word
reference with per-word flashcard launch, and **Story Mode / Campaign** (separate screen tree,
see §8). Grammar mode swaps in structure-based exercises (gap-fill, multiple-choice,
context-picker etc. — 34 structures in 1st).

---

## 7. Avatar / Profile

- **Avatar system**: 50 numbered PNGs (`TOTAL_AVATARS = 50`, `avatars/01.png` … `50.png`)
  in every trainer. New students get the first avatar not already taken in their class
  (`getAvailableAvatar`), tap-to-open picker grid (56×56 `avatar-pick-item`, 3px accent
  border on selection), all 50 preloaded.
- Avatar CSS: base 44×44, `border-radius: 12px`, `background: var(--accent-glow)`,
  2px `--card-border` border. Sizes: `avatar-xs` 28 / `avatar-sm` 34 / `avatar-lg` 64px —
  the large home avatar goes **circular** (`border-radius: 50%`) with 2.5px accent border +
  `0 0 16px var(--accent-glow)` halo.
- **Profile card composition** (top of home, in order):
  1. 3px gradient top-strip (`accent-deep → accent → accent-light`);
  2. `avatar-lg` (click = avatar picker);
  3. name row: `Welcome <Name>` (Fredoka 800) + **class chip** (`class-tag`, e.g. "4A") +
     **level pill** (`profile-rank-pill zone-*`: "⭐ Lv 12 · Word Wizard");
  4. XP line (`0 XP`, accent, 700);
  5. **vibe line** — the current level's flavor text, italic muted 0.72rem: this is where
     "just spawned in" appears for new players;
  6. mode XP bar (zone-colored fill, labels `Lv 12 → 1,234 XP to next → Lv 13`,
     "✨ Max level!" at cap);
  7. overall-level bar ("🌍 Lv 1 · First Steps", teal gradient `#0d9488 → #14b8a6`);
  8. logout + "↩️ Switch to Grammar or Story Mode" pill.
- Below the card: badge row (30×30 emoji chips, hover-scale, popup modal with locked/unlocked
  list), stats bar (Sessions / Accuracy / Mastered / Streak), level **roadmap** screen
  (zone icons 🥉🥈🥇💎, future levels masked as "?? ??" with vibe hidden).
- Class-level card on home: "🏫 Class 4A · Study Group" + collective XP bar (CLASS ladder).
- **Cosmetics/unlockables**: avatars are free-choice (not unlocked); the actual unlockables
  are badges, level titles, prestige stars, and zone pill colors. No purchasable cosmetics.

---

## 8. Per-Grade Differences (beyond the accent hue)

| Axis | 1st | 2nd | 3rd | 4th |
|---|---|---|---|---|
| Default vibe | light pastel green; light `theme-color` | light pastel red; light `theme-color` | **dark-first** (`#0b1120` theme-color, translucent status bar) | **dark-first** (`#0e0b1a`) |
| UI language | **Fully bilingual UI** — `uiLang` toggle "Deutsch/English", default **German** (134 refs, full `UI_TEXT` dictionary) | Partial German copy (65 refs — e.g. "Karteikarten", "Schwache Wörter wiederholen", "Starten") | English UI | English UI |
| Vocab title ladder | Unique gentle ladder (Spelling Bee, Word Collector, Dictionary Diver…) | Gamer ladder | Gamer ladder | Gamer ladder |
| Combo tiers | 2/4/7 answers with 🔥 emoji labels | 3/5/10 plain | 3/5/10 plain | 3/5/10 plain |
| Grammar L1 title | "Rule Rookie" / "first rule learned" | "Rule Noob" / "just spawned in" | Rule Noob | Rule Noob |
| Campaign/story | "Time for School" — classroom-repair adventure with guide **Finn**, teacher cameo **Frau Berger**, bilingual story text (`text` + `textDe`), scene JPGs, star thresholds per level (e.g. maxXP 190 → ★95/★★152/★★★190) | Campaign engine present, G2 level data pending ("G1 campaignLevels removed — G2 levels defined in campaign data block below") | **YouTuber frame**: levels are "Episodes" (L01 "Sound On", "Episode 1: Music"), progress counted in **subscribers** | **"Syntaxia"** portal-fantasy: Professor Syntax, "The Portal in the Classroom", Pages-of-Naming quest, acts + comic panels ("View Comic" button), story intro/outro paragraphs |
| Memory Match | word pairs + separate **Grammar Memory Match** with topic picker | 10-ish pairs, DE copy | "10 pairs — match EN ↔ DE from memory" | "12 pairs — … move-efficient wins bonus XP" |
| Spelling Bee copy | (via t()) | "Unscramble letters to spell the word" | "Unscramble letters — also handles phrases" | "Spell B1 words & phrases — up to 18 rounds" (30-char targets) |
| Header tagline size | 11px | 13px | 13px | 13px |
| School line | "Orhan Vehabovic" | "Orhan Vehabovic" | "Orhan Vehabovic" | full VEHO school name, 2 lines |
| Battle modal bg | theme card | cream `#FFF8F0`, text `#4a3520`, timer `#d97706` | navy `#161d2e`, timer `#f59e0b` | dark violet `#1a1528` |
| Dark aurora extra | mono green | mono red | amber ember `rgba(245,158,11,0.05)` | amber ember `rgba(245,158,11,0.05)` |
| Wordmark gradient | pure greens | pure reds | blue → silver-blue → **gold** | violet → lilac → **gold** |
| Daily card tint | orange `rgba(224,96,32,…)` | orange | amber `rgba(251,191,36,…)` | amber |
| Difficulty labels | "MC" era, gentler | standard | B-level copy appears | explicit "B1" copy in modes |

Copy-tone gradient: 1st reads like a picture-book companion (German-first, story guide,
softer titles); 2nd is the transition (German labels, gamer ladder); 3rd/4th are
English-first, dark-mode, meme-literate ("final boss energy", "GG", subscriber counts,
portal fantasy).

## 9. Shared Brand DNA (the "master" layer)

Identical across all four trainers — this is the DomiGo design language:

1. **One-file PWA-ish app**: viewport locked (`user-scalable=no`), safe-area padding,
   `max-width: 480px` single-column screens, `overscroll-behavior: none`, Firebase
   compat SDK 10.12.0 (Firestore + RTDB).
2. **Token architecture**: the exact same ~30 CSS custom properties re-colored per grade;
   light theme = pastel wash + white cards; dark theme = near-black bg + translucent
   accent-tinted glass cards (`backdrop-filter: blur(20px)`) + fixed radial aurora +
   accent-ring shadows. Theme toggle persisted in `localStorage('theme-mode')`, applied
   pre-paint in `<head>`.
3. **Geometry**: radius 16 (controls) / 24 (cards); pill-shaped chips; 3px gradient
   accent strip on the profile card; gradient `btn-primary` (accent → accent-deep, 135deg)
   with glow shadow + inner top highlight; hover = lift 2px, active = scale 0.97.
4. **Type system**: Inter body / Fredoka display / Quicksand micro-caps; 48px
   gradient-clipped "DomiGo" wordmark over a radial glow, tagline
   "ENGLISH · VOCABULARY & GRAMMAR" letter-spaced 3px.
5. **Progression spine**: 25-level XP ladder (identical thresholds), 4 metal zones +
   purple prestige (⭐ stars), level TITLES as social currency in pills everywhere
   (profile, leaderboard rows), "vibe" flavor line per level, separate vocab/grammar XP
   pools, 10-level OVERALL ladder, 10-level collective CLASS ladder, 28+ badges,
   day streaks, combo multipliers ending at 3x.
6. **Same XP economy**: XP_TABLE 3–10 XP per answer; typed > multiple-choice; definition >
   context > translation; perfect-session +20; streak bonus ≤35; weekly class goal 5000.
7. **Social layer**: class-scoped Firestore (`classes/<id>/students`), first-come name
   login (+ optional PIN per section), 50 shared avatars, three-part leaderboard
   (all-time XP / today's daily / battles), live battles + async duels + class quiz,
   giant-kill tracking.
8. **Daily ritual furniture**: Word of the Day + Daily Challenge in one "today card",
   class-seeded so everyone gets the same items; weekly goal card; smart-review nudge chip.
9. **Voice**: emoji-fronted labels (⚔️ 🏆 ⚡ 📚 🐝), lowercase-cool flavor lines
   ("just spawned in", "GG"), encouragement over punishment (loss emoji is 💪, wrong
   answers earn "waiting..." not shame), German scaffolding where the age needs it.
10. **Screen transitions**: `screenIn` 0.3s rise-fade with `cubic-bezier(0.22,1,0.36,1)`;
    countdowns at 64px/900; medals 🥇🥈🥉 for top-3 everywhere.
