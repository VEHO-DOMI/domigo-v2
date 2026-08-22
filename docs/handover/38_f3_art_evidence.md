# 38 · PK-F3 · WHAT THE ART STILL OWES — evidence for the Codex mini-batch

> **★ HISTORISCHER STAND · die Faust in ch01** *(Kopfnotiz 2026-08-21, K6 — Schuld **D-445**)*.
> Dieses Dokument ist ein datiertes Protokoll und wird **nicht umgeschrieben**: was hier über
> „a cage the fist can open" steht, war am Tag der Aufzeichnung wahr. Der Stand von heute ist
> ein anderer — **ch01 vergibt KEINE Faust** (`abilities: ["jump","run"]`, kein `powerup`-Entity
> in keiner der fünf Flächen); der Wurf-Faust-Zuwachs liegt in **ch02**. Entschieden am
> 2026-08-19 durch die Level-Bahn (**D-422**), Kanon-Ort: `docs/handover/44_full_game_master_plan.md`
> §4 ch01 (Fußnote) und `docs/handover/31_the_painted_book.md` (Fähigkeits-Tabelle). Wer aus
> diesem Protokoll ein Verb ableitet, prüft ihn dort gegen.

**Written by Opus 5, 2026-07-27, inside PK-F3.** The F2 passover says the mini-batch
prompt is **Fable's to co-write at review time**. This file is the input to that: every
claim below is measured or grepped, with the number or the path that proves it. Nothing
here is a commission — it is the evidence a commission would be written from.

---

## 1 · The one waiver the law is still carrying

`check-composition` passes only because p4's L2↔L3 separation is explicitly waived
"until the F2 l2_p4 touch-up". Re-measured on this branch:

| plane | luminance | saturation | band (v1.1 @ K=28) | verdict |
|---|---|---|---|---|
| p4 L0 | 26.5 % | 21.2 % | 26.0–30.2 %, sat ≤20 % | lum in band · **sat over cap** |
| p4 L1 | 25.0 % | 26.9 % | 22.4–28.0 %, sat ≤35 % | in band |
| p4 L2 | 18.1 % | **69.6 %** | 14.0–21.0 %, sat ≤50 % | lum in band · **sat 19.6 points over cap** |
| p4 L3 | 27.3 % | 55.9 % | K-exempt | — |

For comparison, the three phases that need no waiver separate cleanly: p1 21.9 % lum,
p2 12.9 %, p3 14.6 %. **The measured ask:** darken and desaturate `l2_p4` until L2 sits
at ≥12 % luminance separation from L3 with saturation ≤50 %. That single sheet ends the
waiver.

## 2 · Art that was painted and is NEVER shown

`entPoseCell` (`packages/game-paint/src/anim.ts`) is the only thing that chooses an
entity's cell. These seven sheets exist on disk and no state maps to them:

| sheet | what it shows | why it never appears |
|---|---|---|
| `tafel_chalk` | a chalk stick | the thrown chalk is drawn as a **plain circle** in `PaintScene.render` |
| `tafel_hand` | a hand holding chalk | nothing draws the guardian's hand |
| `tafel_sad` | the board crying | `consoled` maps to `win`; the sad beat has no state |
| `moths_slate` | a wing-shaped slate | the moth's number lives on the CARD (PB-F1); no state asks for the slate |
| `moths_rest` | the moth settled | no rest state exists for a swarm |
| `door_open` | the door swung open | `doorSolved` is a Sim set, not an entity state |
| `fibel_gift` | Fibel handing the fist over | the grant is a card, not a pose |

This is not a bug list — it is **art already paid for**. Two of them are cheap wins the
batch does not need to redraw: a `sad → win` transition for the Tafel (which would also
soften F2-25's two-forms problem), and `door_open` on a solved door.

## 3 · The cage sheets the addendum asks for (F2-8/16/28)

Measured against the shipped sprites:

- **`satchel_a`** is a brown satchel bound with a green rope and a knot — read at the
  22-px display height it is a bag with a stripe. The evidence file's words: "a pouch
  on a crate corner, no cage reads at all". PK-F3 has given it MOTION (it rocks when
  the fist can open it) and a one-time hint card, but **the silhouette itself still says
  bag, not prison**.
- **`pencilcase_a`** is a green pencil case with a mesh window and one eye behind it.
  Merle is 1 eye at 40 px — at play size the eye is roughly 4 px. **The person inside
  has to read at play size**, not in the sheet.
- **Standability:** the addendum calls Merle's cage "standable" and asks for a collision
  fix. Checked in code — **entities are never grid-solid** (`collide.ts` knows only
  glyphs). What the film shows is the platform at p2 r16 cols 58–62, which the cage
  stands ON. So this is a placement/silhouette matter for the art, **not** a collision
  bug. Recorded so the batch is not commissioned against a wrong premise.

## 4 · The two Tafel forms (F2-25)

`tafel_a` is a GREEN board on a wooden easel; `tafel_roll/windup/stagger/win` are a
DARK board in a wheeled frame with arms. PB-F1 stopped the swap during the boss card
(`window` now maps to `stagger`), so the mid-fight identity change is gone — but the
two designs still coexist, and `tafel_a` is what the arena shows at rest. The batch
either unifies them or gives the green easel form a reason to exist.

## 5 · Where the world is still empty (F2-30 / F2-32)

- **p3's left page-half**: five consecutive frames in the evidence set show a full
  screen width holding two rings and one creature. The rings are now GONE (PK-F2,
  ruling 2), which makes that half emptier, not fuller. It needs content or a reason.
- **p1's upper region**: flat cream wall, one washed window, the ceiling brick strip —
  reachable by climbing, empty of content.

Both are level-design decisions before they are art ones, so they belong in the same
conversation as the batch, not in it.

## 6 · What PK-F3 fixed WITHOUT new art

For the record, so the batch is not asked to solve these twice: Krakel is wired
(`krakel_a` / `krakel_active` were on disk and unused, so F2-6's "who is there" needed
no new sheet); the letters bob and glint (engine-drawn); cages rock on approach and the
first one teaches the verb; the control bar stops advertising the fist before the grant;
the walk cycle's back hand swings on a lagged phase, measured 4.4–11.6 px → 3.6–9.4 px
of vertical spread.
