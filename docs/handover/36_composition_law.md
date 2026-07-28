# 36 · THE COMPOSITION LAW — one drawn world, not three fighting planes

**Binding design canon (Fable 5, 2026-07-26 — written from Koki's Build-D screenshot
verdict + a five-phase own-eyes review). Governs every painted phase from now on.
Sharpens `docs/study/rayman/visual-language-v2.md` §1.1–§1.3 into numbers, art
contracts, and renderer structure. Supersedes the AC-era model (one scene plate + one
band + strips-over-fill) — that model is retired; its craft survives as source material.**

## §0 · The verdict it answers (what is wrong today, phase by phase)

Koki: *"drei Ebenen, die nicht miteinander zusammenwirken"* — confirmed in all five
phases. The three failures, named:

1. **The plate is a photograph, not a room.** Each phase hangs ONE full-bleed painting
   behind the play space. p1's plate paints coats/basket/bench at ~5× player scale while
   the mid band shows lockers at 1× — two contradictory statements about the same room.
   p4's plate doesn't even cover the camera (cream void on the right). A painting you
   stand IN FRONT OF can never read as a place you are IN.
2. **No depth ramp.** Every layer ships at full saturation and contrast, so background
   furniture competes with (and camouflages) play elements — the p1 pencil chaser
   disappears against the locker band; p2's purple desks read as obstacles. Depth in the
   reference works is VALUE-managed: far = lifted + muted, mid = simplified silhouettes,
   play = the only full-contrast plane.
3. **Terrain is strips glued on rectangles.** Solids render as a thin painted strip laid
   over a flat tan fill — the strip doesn't cover the fill, caps float detached beside
   platforms, the p3 slide renders as stepped tan blocks with a thin green diagonal, and
   the mass below every floor is a SOIL texture (banned by the topic-material law:
   school = books/paper/wood, never earth). Nothing reads as "one carved drawn world".

## §1 · THE LAYER MODEL (five planes, each with scale, value, and parallax laws)

The reference stack (our own study, VL 1.1): a painted world is planes of
world-scaled architecture separated by a value ramp, never one backdrop image.

> **v1.1 AMENDMENT (2026-07-26, Fable — resolves the PK-C1 escalation).** The v1.0 value
> bands below were ABSOLUTE numbers calibrated on the daylight phases — a contradiction
> for the commissioned night/dusk/ink rooms (a night sky cannot sit at 82 % lightness;
> the executor was right to refuse to arm them). The bands are now **RELATIVE to the
> phase's declared KEY (K)** — the luminance of the phase's air, stated in its
> composition manifest. The multiplicative form reproduces v1.0 exactly at the daylight
> key and compresses naturally for dark rooms:
>
> **L0 ∈ [0.93·K, min(1.08·K, 96 %)] · L1 ∈ [0.80·K, 1.00·K] · L2 ∈ [0.50·K, 0.75·K] ·
> L4 ≤ 0.45·K · L3 exempt from K (always full range — lit figures against a dark room
> are the point).** Check at K=88 %: L0 82–95, L1 70–88, L2 44–66, L4 ≤40 — v1.0's
> numbers exactly. **ch01 keys: p1 K=88 · p3 K=86 · p2 K=30 · p4 K=28 · p9 K=14 (lowered from 16 at the PK-C2b review — the delivered ink-dream measures ~15 air / 11.6 wall; the declaration follows the truth).**
> Saturation caps stay absolute as tabled. Separation laws: **L2↔L3 stays ABSOLUTE**
> (≥12 % luminance or ≥25 % saturation — readability never scales down); L1↔L2 gap
> becomes relative (≥0.10·K — atmospheric dark phases may separate by silhouette).
> The §4 layer-value audit arms THESE bands, computed from the manifest's K.

| Plane | Content | Scale law | Value band (v1.1: relative to K) | Sat cap | Parallax |
|---|---|---|---|---|---|
| **L0 AIR** | a soft vertical wash (2–3 colors per phase: the room's light) | — | 0.93–1.08 · K (≤96 %) | ≤ 20 % | 0.05 |
| **L1 FAR SHELL** | the room's architecture: wall fields, windows, door frames, high shelf lines — REPEATABLE segments + one anchor motif per phase | elements 3–6 H* | 0.80–1.00 · K | ≤ 35 % | 0.25 |
| **L2 MID FURNITURE** | simplified furniture/prop silhouettes (lockers, desks, yard rails) — shape-first, minimal interior detail, NO black outlines, soft top rim-light | 1.5–3 H | 0.50–0.75 · K | ≤ 50 % | 0.5 |
| **L3 PLAY** | terrain masses (§2), entities, interactive props — the ONLY full-contrast plane, crisp STYLE_PAINT_V1 outlines | 1 H reference | full range (K-exempt) | full | 1.0 |
| **L4 FOREGROUND** | sparse occluders: plant fringes, beam shadows, lamp chains | 0.5–2 H | ≤ 0.45 · K | ≤ 45 % | 1.15–1.3 |

*H = one player height. Every commissioned piece states its size in H.*

**The scale law.** ch01's fiction (children drawn INTO the book) licenses a
larger-than-life world — but each phase picks ONE scale statement and every plane obeys
it with a smooth ramp. No more 5×-scale benches behind 1×-scale lockers. The plate-era
"scene with its own internal perspective" is banned: L1 segments are drawn FLAT-ON
(parallel to the picture plane), perspective lives only in lighting and overlap.

**The separation law (machine-checked, §4).** Between L2 and L3 there must be a mean-
luminance separation ≥ 12 % OR a saturation separation ≥ 25 % — measured, not felt.
Enemies must pass the pop test: an enemy at rest against any L2 stretch keeps a visible
silhouette boundary (the pencil-in-front-of-lockers failure class).

**The affordance quarantine (VL 1.3).** Nothing in L1/L2 may look operable at play
scale: no benches at standable height, no doors with handles at player height, no
climbable-looking frames — unless deliberately echoed by a REAL L3 object in front of
it. Background versions of interactive things are allowed only ghosted/faded per the
transparency grammar (redemption-deltas row 2).

## §2 · THE TERRAIN MASS MODEL (strips-over-fill is retired)

Terrain is a CARVED MASS with painted anatomy. The kit per material family:

```
        crust_cap_l  crust_loop ×2var   crust_cap_r
              ┌────────────────────────────┐
   edge_l │   BODY TILE (seamless, ≥2var)   │ edge_r
              │  … body …  … body …          │
   corner_bl └── fade_tile → sediment_tile ──┘ corner_br
```

- **Crust** = the walk surface (p1/p2 floorboards, p3 paving, p4 stage boards, p9 ink
  shore), with true end caps that CONNECT flush (no floating bookends).
- **Body** = the interior mass: for the school book-press strata — compressed page
  edges, book spines side-on, wood shelf lines — top-lit, darkening downward. The body
  must TILE seamlessly in both axes and read at 100 % opacity (the 27.7 %-alpha cell
  class is a commissioning defect, listed in the reject rules).
- **Edges/corners** = carved painted borders wherever mass meets air, left/right/bottom.
- **Fade + sediment** = below ~3 cells deep the body fades into dark paper-sediment
  (ink-dark page strata). **The soil texture is banned on sight** (G1 topic-material law).
- **Floating platforms are COMPLETE OBJECTS**, drawn whole with their own silhouette
  (book-stack plank, wall shelf, garden bench) in 2/3/4-cell widths — never a strip on a
  filler box. Their undersides are drawn (shadowed board, dangling page corners).
- **Slopes are drawn ramp masses.** 45° pieces carry the crust diagonally with a carved
  under-mass. **The p3 slide is its own object**: a wide blackboard-green chalk-slide
  surface (top module / mid module ×n / foot module with run-out curve) mounted on a
  drawn under-structure, 2 cells wide of visual surface so the `z` line reads as a real
  slide, chalk-dust verb-debris at the foot.
- **★ v1.2 AMENDMENT (2026-07-28, Fable — resolves R3-19): SET-PIECE MASSES.** Where a
  formation is SPECIAL — the slide with its run-out zone, a landmark block cluster, an
  arena podest group — it is commissioned and imported as **ONE drawn piece**: a single
  full painting sized rows×cols of 512-px cells, its mass anatomy (crust, edges,
  sediment) painted INSIDE the piece, anchored at a declared top-left grid cell. The
  glyph grid keeps collision authority unchanged — a set-piece is visual mass only.
  Tiled assembly for such formations is RETIRED (it is what produced the residue edges
  and unattached end pieces of 11.45.43 / 11.43.59). The p3 slide sub-clause above is
  this category's founding precedent, promoted. Engine seam: a `setpiece` mass kind
  with per-piece stem + span (wired in PK-R4 when its art lands); commissioning shape
  lives in the chapter prompts.
- **The renderer places anatomy, not rectangles**: crust + caps on every exposed top,
  edge trims on every exposed side, corners at every convex/concave turn, body fill
  from the tile, fade band at depth. A visible flat-color fill pixel with the kit
  present is a HARD FAIL (extends the art-honesty gate).

## §3 · WHAT BECOMES OF THE EXISTING ART

Nothing is wasted: the four plates are harvested — their motifs (coat rows, window
light, chalk murals, shelf walls) return as L1 segments and L2 silhouettes at the
correct scale and value; the current bands are VALUE-CORRECTED source material for L2;
the strip sets become crusts within the mass kits; all props/entities/cards are
untouched. The two mechanical fixes that need no art: letters render their REAL glyphs
(engine-drawn gold letters — today every trail letter draws as "A"), and any full-bleed
piece (p9, the arena) obeys **cover-fit**: scaled to cover the camera's full travel
box, bottom-anchored, never letterboxed against the page.

## §4 · TASTE, MADE MACHINE-CHECKABLE (the new gates)

1. **Layer-value audit**: render each plane in isolation (dev harness), sample mean
   luminance + saturation, assert each plane sits inside its §1 band and the L2↔L3
   separation ≥ the law. Runs on every phase in CI (headless canvas sampling).
2. **Coverage audit**: for every phase, the union of L0+L1 must cover the camera's
   travel rectangle at both extremes — no page-background pixel may ever show through.
3. **No-naked-fill audit**: with a mass kit present, zero rendered pixels of the
   fallback fill palette (EARTH tones) — sampled over the full world, not one screen.
4. **Glyph audit**: every letter entity renders its own character.
5. **The composition checklist** (executor-run, every visual packet): scale statement
   obeyed per plane · silhouette pop test at 3 enemy positions · caps flush · slide
   reads as slide · set-pieces show NO tile residue at their borders (v1.2) ·
   screenshots of every phase attached. Mechanical honesty is not
   enough; the checklist answers "does it LOOK like one world?" — and the executor
   self-bounces before handing over anything that fails it.

## §5 · POINTERS

Consumers of this law: `CODEX_MASTER_PROMPT_AF_COMPOSITION.md` (the art commission
implementing §1–§3 as sheets) · `PASSOVER_PB_COMPOSITION_2026-07-26.md` (the engine
rework: layer compositor, mass renderer, audits) · the ch02–05 sheets at their build
time (every future world is commissioned per THIS law, never per the retired model) ·
**v1.2:** `41_r3_design_pass.md` §6 (the design ruling) + PK-R4 of
`PASSOVER_PB_R3_2026-07-28.md` (the `setpiece` engine wiring when its art lands).
