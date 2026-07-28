# 40 · THE HYBRID RIG — how every creature is animated and commissioned from now on

**Binding design canon (Fable 5, 2026-07-28). Resolves R3-7 (Koki's proposal, adopted
in the Replay-2 verdict). Extends the hero's rig architecture to the cast. Evidence
base: `docs/study/rayman/redemption-animation-metadata.md` §6 (the adopted study,
`redemption-deltas.md:92`) + the shipped hero rig (`packages/game-paint/src/rig.ts`,
`rigSpec.ts`) + doc 38 §2's stranded-art lesson. Supersedes the flat a/b sprite-swap
model for every creature commissioned after this date.**

---

## §1 · The ruling

A creature is **painted key cells + coded motion**, never a pure sprite swap and never
a fully procedural puppet.

- **The CODE owns:** position, physics, hitboxes, squash/stretch, turn/telegraph/land
  timing, state selection, tinting/ghosting, and every in-between. All thresholds are
  DERIVED from sim constants (the `anim.ts` law: `RUN_VX`, `SQUASH_VY`, `BANK_X` are
  imported, never retyped).
- **The ART owns:** the keys — a small, fixed set of painted cells per state whose
  **cell index is the contract** (study §6 rec 6: the remake's parts atlas is 150 cells
  at a fixed index layout, re-painted identically across 24 costumes; freeze the map
  and every future creature of that role is a drop-in re-paint).
- **Hitboxes are unchanged** by this law: the sim owns them, entities are never
  grid-solid (`collide.ts` knows only glyphs — doc 38 §3's premise correction).

Why now: `entStateCell` already emits 7 state names — our STATE COUNT matches the
studied remake's median. "Our gap is entirely frames-per-state (we have 1 cell where
they have ~16)" (study §6 rec 2). The fix is budgeted cells per state plus the coded
beats the study found missing, not more states.

## §2 · The timing laws (code side — ticks at 60 Hz)

| Law | Value | Source |
|---|---|---|
| **Idle resolution** | keep the 400 ms cycle, spend the art: **4 cells × 6 t/frame (10 fps)**; `bobFrame` takes a frame count, default dwell 12 t → 6 t | §6 rec 1 |
| **Turn state — the biggest missing beat** | **18 t (300 ms), 2–3 cells**, entered on EVERY patrol reversal; sprite flip happens at the midpoint, never on tick 1 | §6 rec 4 (we currently flip in one tick, `entities.ts:203`) |
| **Telegraph band** | small enemy **30–48 t**, guardian **60–80 t**; current values stand (guardian 60/45/32, gunner 30, crusher 28); **raise flyer 20 → 30 t and chaser 24 → 30 t** (both under the remake's shortest telegraph) | §6 rec 3 |
| **State budget** | ≥5 states per hostile role, **8 for recurring ones (guardians)** | §6 rec 2 |
| **Hero landing (pose-program rider, not enemy scope)** | `landRecoverTicks` 6 → **12–18 t**; add **skid-stop 20 t** and **air-to-fall 20 t** | §6 rec 5 |

## §3 · The role grammars (frozen cell-index maps)

Cells are 512 px, sheets 2048 wide (4 cells per row), row-major index, keyed on pure
`#FF00FF`, matte finish, eyes on everything that acts (the standing AC laws). Stem
naming: idle cells are `_a _b _c _d` (extends the shipped `a/b`); every other state is
`_<state>0 _<state>1 …`, and the un-indexed `_<state>` name is an alias of `_<state>0`
so every shipped ch01 stem stays valid. Resolution order (engine):
`exact frame → state base → _a → placeholder`.

| Role grammar | Cell families (index order) | ≈cells |
|---|---|---|
| **WALKER** (patrols ground) | idle 4 · walk 4 · turn 3 · telegraph 2–4 · act 2–3 · dazed 2 · **joy 2** | 19–22 |
| **FLYER** | fly 4 · bank 2 · telegraph 2 · act/dive 2 · dazed 2 · perch 2 · joy 2 | 16 |
| **BOUNCER** | idle 2 · squash 2 · rise 2 · telegraph 2 · act 2 · dazed 2 · joy 2 | 14 |
| **CHASER / CRUSHER / GUNNER / SWARM** | per §4's casting, same families minus what the role lacks (a swarm has no turn; a crusher no walk) | 10–16 |
| **MOVER (living platform)** | move 2–4 · turn 3 (if it reverses) · ridden-react 2 · idle 2 · joy 2 | 9–13 |
| **AMBIENT / WATCHER** | idle 2 · notice 2 · joy 2 | 6 |
| **GUARDIAN (recurring)** | the chapter's own state grammar (ch01 Tafel = exemplar) at 2–3 cells per motion state, ≥8 states | 19–24 |
| **STATIC-STATE (exempt)** | cages, doors, letters, consoles, props: state sheets exactly as today — no locomotion, no rig. AF3 stays generate-now under this exemption. | — |

**The redeemed-presence family is mandatory (R3-5 ⇄ doc 31's kindness economy):**
every redeemable creature's commission includes `joy` (2-cell Freudenrunde loop) and
guardians additionally `rest`. Law: **redemption changes STATE, never removes
presence** — the coded side plays the joy loop as a home-orbit, then settles the
friend near its home cell. `moths_rest` (painted-unused, doc 38 §2) is the precedent
this law retro-legitimizes.

## §4 · No cell without a state — the anti-stranding contract

Doc 38 §2 lists seven sheets that were painted and are shown by no state. That class
is now illegal at commissioning time: **an entity cell may only be commissioned when
this table names its engine state and the packet that wires it.**

| Cell family | Engine state (selector) | Wired by |
|---|---|---|
| turn cells | new `turn` state in `stepEntities` + `entPoseCell` | PK-R2 (guardian + R3-4/5 cast first), waves after |
| idle `_c _d` + dwell 6 t | `bobFrame(frameCount)` upgrade | PK-R2 |
| joy / rest | post-`redeemed` state pair (orbit → settle) replacing terminal `dazed`/despawn | PK-R2 (R3-5) |
| guardian chalk/hand | the duel rework draws `tafel_chalk` as the projectile, `tafel_hand` on the windup | PK-R2 (R3-4) |
| `tafel_sad` | the `consoled` beat gets its own state before `win` | PK-R2 (R3-5, cheap win named in doc 38) |
| mini-scene move-sets (ch02) | the show-pen program (walk/climb/jump around a prop) | the ch02 build packet, post-AG review — commissioned now because generation+review has lead time, wired only then |

## §5 · Pose-program riders (hero side, same law, later packet)

Banked here so they stay visible: R3-21 walk personality (determined-face + clenched
fist always — expression variety per the source material) · M-D platform-stand pose
(11:44:59) · §2's landing/skid/air-to-fall triple · study rec 7: ~20 % of the hero
budget goes to idle personality (the remake's most generous category). Hero total
stays ~150 cells with a frozen index map (rec 6). These ride the pose-program wave,
not an R3 packet.

## §6 · AG-ENT v2 — the first commission under this law

The held Group 5 (4 flat sheets) is **retired**. Its replacement is
`~/Code/codex-art-lab/CODEX_MASTER_PROMPT_AG_ENT_V2.md`, authored from the ch02
design sheet (`docs/design/g1/paint/ch02.md` §4 casting + §8 asset list), which is
the authority the v1 group under-covered ("Animal rigs ×7 EACH with the mini-scene
move-set" vs four 2-cell sheets). Fidelity corrections banked:

- **The pelican-boat is DROPPED** — it appears in no design sheet; the sheet's deep-
  water crossing is tortoise-back rides (G3). Inventions don't survive contact with
  the gated sheet.
- The giraffe keeps v1's vertical-flush stacking contract (tower segments tile
  flush, red-ground check) and gains its sheet-mandated blink/kind-react + mini-scene
  cells.
- The retired `batch-ae/entities/` twins (incl. a same-named `ent_giraffe_turm.png`)
  are law-non-compliant and **must never be imported**; the AG import script gets an
  explicit exclusion when it is written.

Scope: 13 sheets, ~171 cells (§8 roster: dog · penguin · monkey · parrot · giraffe ·
tortoise · meerkats · wheelbarrow · elephant-trunk · turnstile guardian · rotten
signs · branch swings · flamingo pond). That is the full ch02 cast at roughly half
the study's per-creature budget ceiling — under, not over.

## §7 · Pointers

- The replication passover (`PLATFORM MASTER/SESSION-PROMPTS/
  PASSOVER_PB_ART_UNITS_2026-07-28.md`) carries this law's rider: waves author their
  entity groups per THIS doc, AG-ENT v2 is the exemplar — never the flat 2-cell form.
- Doc 36's format/finish laws apply unchanged to every rig sheet.
- ch01 retrofit (pencil/eraser/heft/moths/ranzen to full grammars) is a LATER
  commission wave — only what R3-4/R3-5 touches (tafel, moth, heft, eraser states)
  moves in PK-R2, using cells that already exist on disk.
