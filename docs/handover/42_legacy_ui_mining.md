# 42 · THE LEGACY MINE — what the parked builds still owe the Painted Book

**Extraction canon (Fable 5, 2026-07-28). Resolves the R3-8 mining mandate ("take
their best UI/UX — never regress to their look wholesale") + M-C (the design-thinking
mine). Both legacy builds live in the WORKING TREE on main — nothing here is
archaeology; every path below is checkable today.** Feeds PK-R3's briefs.

**The mining law:** we take MECHANICS, TIMINGS and STRUCTURE; every visual is
re-skinned to STYLE_PAINT_V1 (painted frames, gouache surfaces, book-world framing).
A pattern that arrives look-and-all is a regression, not a mine.

Where the builds are: the **Keen build** (parked at PR #211) = `packages/game-2d/` +
routes `apps/web/app/(game)/play/[grade]/run|world/` (teacher-gated, still boots).
**Old Lost-Pages** (the pre-Keen G1 game, PR #161) = the `BattleStage` layer of the
same package; cleanest read: `~/Code/domigo-v2-codex-rpg` branch
`codex/g1-rpg-sandbox`. (`~/Code/domigo-v1` contains no game — nothing to mine.)

---

## §1 · Battle overlays (→ R3-8, PK-R3)

**Keen: the phase-overlay system** — `packages/game-2d/src/ArcadeGame.tsx` ~L780–1180
(one `Phase` union drives ~10 full-frame overlays), trigger `ArcadeScene.ts`
`contact()` L1063–1090, CSS `apps/web/app/globals.css` L667–700.

TAKE: the scene freeze contract (physics pause + `tweens.timeScale ≈ 0` +
**camera `zoomTo(1.18×, 160 ms)` toward the encounter** — the single cheapest "this
is a BATTLE" signal we own) · the veil (radial dim `.dg-qf-veil`) · the spring-in
card (`.dg-qf-card`) · the **countdown ring** (`.dg-qf-ring` width-collapse — quickfire
urgency without a number) · the verdict beat (`.dg-qf-verdict`).

**Lost-Pages: the themed stage** — `BattleStage.tsx` (315 L; phases
`enter → fight → won/lost`, two skins on one stage), brain `battle.ts` (DOM-free,
unit-tested presentation decisions), CSS `globals.css` L558–640 (`dg-bs-swirl` ink
wipe, 420 ms delayed card entry, smudge wobble, word-absorb, letter-fly-out).

TAKE: the enter/exit CHOREOGRAPHY (wipe in → card lands a beat later → resolution
beat → fly-out) · the headless presentation-brain pattern (decisions unit-tested
outside the DOM) · **the reduced-motion end-states law: base styles are authored as
END STATES, so a motionless battle is complete rather than stuck** (`dg-bs-still`) —
this becomes a standing rule for every Paint overlay.

RE-SKIN: card face = the painted CardShell we already ship; veil = ink-wash dim;
ring = a chalk circle being erased; entrance = a page-turn/ink-bloom, not the glass
ink of Lost-Pages.

## §2 · The wheel (→ R3-9, PK-R3)

**Keen `NumberWheel`** — `ArcadeGame.tsx` L128–182, consumed at L991. The mechanism
Koki called "actually responsive": a **scroll-snap column over the FULL value scale**
(digits or words), 5-row window, centre lens + gradient masks, highlight driven by a
**native imperative `scroll` listener** (React onScroll was unreliable in-overlay and
25×/s must not re-render), tap-any-row smooth-scrolls it into the lens.

TAKE: the full mechanism verbatim (drag INSIDE the wheel = the ask; it already
works with thumb on mobile — scroll-snap is native touch) — **plus the one thing it
missed: AUTO-LOCK on release** (snap settles ⇒ value locks; no Einloggen press).
Buttons stay as fallback (accessibility + the current machine contract).
KEEP the machine: `wheelMachine` (cards/machines.ts:156–176) stays the brain —
`act(rotate)/act(lock)` unchanged; the skin dispatches `lock` on snap-settle.
RE-SKIN: slate face, chalk numerals, the lens = Fibel's magnifier.
REPLACES: the ▲▼ three-row ring (`WheelCard`, cards/skins.tsx:114–137).

## §3 · Ceremonies — boot AND resolution (→ R3-8/8b, PK-R3)

**Keen's four-stage chain** (`WorldClient.tsx` L159–190 · `cutscene.tsx` ·
`ArcadeGame.tsx` L808–838 GOAL CARD · `ArcadeScene.ts` L88–89 `startFrozen` +
240 ms fadeIn; boss intro card 2400 ms auto-advance, 900 ms reduced-motion).

TAKE for the LEVEL BOOT: the GOAL CARD grammar — „Dein Auftrag" → the chapter name
in the display face → the CLT *Warum* line → the collectible legend → „Los geht's!"
— over a frozen, fading-in world. The child never spawns mid-noise.
TAKE for the CHAPTER END (M-B): the RESTORE-beat pattern (the celebration is HELD
until the world visibly finishes its change — Keen held 1800 ms for the map flag) +
the `cutscene.tsx` plate player (one painted plate, one spoken line, tap-advance,
ZERO tasks by law) as the score-page presenter (doc 41 §5's beat 2).
RE-SKIN: the goal card is a painted book page; the boot fade is a page-turn.

## §4 · Collectible pull-ins (→ R3-8 + the §5 economy, PK-R3)

**Keen's magnet** — `ArcadeScene.ts` L1771–87: every untaken letter within
`TILE × 1.6` lerps **22 %/tick toward the player**, auto-collects under 30 px
(Koki's "only a small field that gets them"); collection = 8-particle burst +
rise-away (`y −26`, alpha→0, `Back.easeIn`, 320 ms); seals fly 60 px up at 1.6×
scale over 620 ms; guard-drops glide in on 420 ms `Sine`. Idle = bob + halo pulse.
Every branch has a reduced-motion path.

TAKE: the magnet numbers verbatim for Paint letters (they already bob+glint from
PK-F3 — the magnet completes the feel) · the collect burst + rise-away · the same
gesture scaled up for **Regel-Seiten** (the seal fly-up pattern) and Bonus-Bücher.
RE-SKIN: particles = chalk dust / ink droplets per phase palette.

## §5 · Typography (→ R3-8, PK-R3)

Keen's three-face system (`apps/web/app/layout.tsx` L2, L8–11): **Fredoka**
(display) · **Inter** (body) · **Quicksand** (labels) as `--font-display/-body/
-label`; overlay headlines 20–44 px weight 800; `sharpText.ts` patches Phaser text
to `setResolution(2)`.

TAKE: the faces are ALREADY LOADED app-wide — the Paint overlays simply start using
the variables (card headlines → display face, prompts → body, HUD chips → label).
The `sharpText` resolution patch applies to `game-paint`'s scene texts too (the
in-canvas „Knoten: 3" is currently soft at zoom).

## §6 · The design mine (M-C — thinking, not pixels)

Koki's sanction: "study how we envisioned task design and enemy and boss design in
the Commander Keen build — overlaps welcome." The mine: `docs/_archive/keen/design/`
ch01–ch15 + `docs/_archive/keen/study/` (14 docs incl. `keen-feel-and-look.md`,
`keen-metagame.md`). Standing status per the paint README: **idea-mines only** —
fictions and mechanics may be lifted and re-grounded; layouts/art never.

- **Already cashed:** the color-drain idea — Keen ch01's own spine („the classroom
  drained colorless … keine Farben mehr. Bring alles zurück", grey+colour asset
  pairs ×6; `_archive/keen/design/ch01.md:21,35,77`) — is now ch01's core mechanic
  by Koki's R3-15 ruling (doc 41 §2). The mine works.
- **Standing law:** every chapter build wave (AH–AJ era and beyond) consults its
  Keen-era sheet twin (`_archive/keen/design/chNN.md`) in its boot ritual and files
  what it takes as dated lines here — so the mine stays a ledger, not folklore.

## §7 · KEEP/DROP + packet map

| Pattern | Verdict | Lands in |
|---|---|---|
| scene-freeze + camera-zoom battle framing | KEEP (timings verbatim) | PK-R3 |
| countdown ring | KEEP re-skinned (chalk erase) | PK-R3 |
| Lost-Pages enter/exit choreography + end-states law | KEEP (law is standing) | PK-R3 |
| Keen scroll-dial wheel + auto-lock | KEEP + the missing auto-lock | PK-R3 |
| GOAL CARD boot ceremony + startFrozen/fadeIn | KEEP re-skinned (book page) | PK-R3 |
| RESTORE-hold + plate player for the score page | KEEP (M-B's beat 2) | PK-R3 |
| letter magnet + collect burst; seal fly-up for Regel-Seiten | KEEP (numbers verbatim) | PK-R3 |
| three-face typography + sharpText(2) | KEEP (already loaded) | PK-R3 |
| Lost-Pages glass-ink look, Keen flat-UI look | DROP (look-regression) | — |
| pelican-boat-class inventions | DROP (sheet fidelity, doc 40 §6) | — |
| Keen design-sheet fictions | MINE per-chapter (ledger above) | build waves |
