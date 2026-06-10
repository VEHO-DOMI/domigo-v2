# Runbook — Story/RPG mode tech spike (post-launch, P2)

Story mode is a **rework of the legacy trainers' story/adventure/quest modes** (v1 dropped them in
its migration), not greenfield. Scope + tech are decided WITH Koki after a spike — this file
carries what the spike starts from. The architecture already reserves the integration point:
`packages/engine` is pure TS and a story route can mount a canvas/WebGL client via
`next/dynamic({ ssr: false })`, consuming the same content engine + grading as everything else.

## What the legacy trainers actually shipped (explored 2026-06-10)

Trainers live at `…/Domi Gym/Claude/Cowork Space/Claude Code/{1,2,3,4}*-grade-vocab-trainer/index.html`.

| | G1 "The Lost Pages" | G2 "Watson Manor Case" | G3 "FOURTEEN" | G4 "Syntaxia" |
|---|---|---|---|---|
| Status | ✅ full, 15 levels | ⚠️ partial (~2 levels live) | ✅ full, 14 episodes | ❌ stub (2 of 15 chapters; mode hidden) |
| Theme | magic book restoration | detective mystery | YouTube-channel drama | fantasy school RPG |
| Data | inline, ~line 15919 | external `data/m2-campaign.js` (147KB) + `.json` (229KB) | inline, ~line 16273 | inline, ~line 12820 |
| Loop | story beats → 5 mixed tasks → beats → stars | prologue → levels (ext. data) | long narrative → tasks tied to plot → reading → comic | intro → 3 tasks → reading → **boss** → outro |
| RPG bits | none (XP+stars) | unknown | none | party members w/ stats + abilities (Penny the Pencil, Rex the Word-Hound), bosses |
| Story↔task coupling | loose | ? | **tight — story events drive the tasks** | minimal |

Engine references: G1 campaign code ~14508–15919; G2 engine ~13496; G3 map ~13910; G4
`campaignCharacters` ~12934. All DOM/CSS dialogue-beat scenes + JPG scene images — no canvas.

## Design seeds (synthesis)

1. **G3 is the design model**: tasks framed by plot beats (the grammar mistakes ARE the plot) —
   this is what made it work. Keep narrative-task coupling tight.
2. **G4 is the mechanics model**: party members with abilities (hint economy!), boss checkpoints —
   designed but never wired. Rework, don't copy.
3. Story content must obey the same guardrails as everything else: word-bank level gate + glosses
   in narrative text, du-form German, items through the validator. Story scripts become corpus
   artifacts (a `story.json` per chapter through the same gen→verify→validate→review pipeline).

## Spike questions (timebox ~2–3 days, decide with Koki)

- 2D scene engine (Phaser / DOM+motion like the legacy modes, much cheaper, proven with this age
  group) vs. lightweight 3D (React-Three-Fiber — "navigable world" ambition; perf on cheap phones?).
- Asset pipeline: AI-generated scene art? sprite packs? cost per chapter?
- One narrative per grade (like legacy) vs. one shared world with grade-leveled regions?
- How story progress maps to `study_path_progress`/XP (shared progression vs separate track).
- Offline behavior inside the PWA shell.

Exit criterion: a playable one-chapter prototype (G2 U3 content) on a cheap phone viewport + an
effort estimate per chapter, presented to Koki for the go/no-go and scope decision.
