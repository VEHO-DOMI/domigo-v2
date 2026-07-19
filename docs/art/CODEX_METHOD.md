# THE CODEX METHOD — how this art lab works, so the output can be trusted

*This is the standing working method for EVERY commission you execute in this
lab. It is the image-production translation of the "fable method" used across
this project. Read it fully before card 1 of any batch. Where a batch's
master prompt and this file disagree, the master prompt wins (it is newer).*

## §1 · Ground truth before painting

1. **Study the references FIRST.** `~/Code/codex-art-lab/refs-t/` holds the
   craft bar: the `ref_keen_*` crops define the required dithering density,
   3–4-tone material ramps, and organic silhouettes for every GAMEPLAY card;
   `hero-v1.png` fixes the hero's canonical DESIGN (costume, proportions) —
   render the design at the craft bar, not at its simpler old rendering.
   An output that looks simpler than the reference crops is a FAIL.
2. **The style contracts are law, not mood.** Every card carries its class
   contract (painted CUTSCENE/BACKDROP vs pixel GAMEPLAY). Re-read the right
   contract before each image. Never mix classes in one image.
3. If something you need is missing (a reference folder, an unclear card),
   SAY SO in your output — precisely, once — and continue with the written
   contract. Never silently improvise around a gap.

## §2 · Calibrate, then replicate

The first card of a batch is always the anchor (a style key or the batch's
hardest sheet). Generate it, self-check it hard, and treat it as your own
exemplar: every later image must sit next to it without looking like a
different game. When a batch spans two classes, each class anchors on its own
key.

## §3 · Hostile self-review — every image, before moving on

Run the batch's per-card checklist as an ADVERSARY, not a fan: palette,
pixel crispness, format (true alpha / solid magenta / grid-cut), subject
completeness at game size, mood (friendly storybook, never scary), craft
(no flat areas; dithering + ramps + silhouettes at reference density),
and grid discipline on sheets (equal cells, same design every cell, nothing
touching borders). One FAIL line = regenerate ONCE with the failure named in
the prompt. Print the PASS/FAIL lines — the honest report IS the deliverable's
other half.

## §4 · The sandbox law (absolute)

Your ONE writable location is the batch folder named by the master prompt
(`~/Code/codex-art-lab/batch-*/`). Everywhere else — every repo, every other
folder — you are strictly read-only. A separate pipeline QA-checks, slices,
and imports your images; nothing you write reaches the game directly.

## §5 · State upkeep & the wrap contract

- Before each image print `NOW GENERATING: <filename>`; after saving print
  `SAVED: <full path>`. If you hit a limit, print `CONTINUE AT CARD <n>` —
  you will be restarted with the same document and resume there.
- End every batch with the full manifest: every filename in order, marked
  DONE or REGENERATED, plus any gaps or deviations — report failures plainly;
  never soften or omit them. The reviewer trusts the report only because it
  is complete.

## §6 · The pitfall registry (accumulated — do not relearn)

- CP-1 Image generators fake transparency: never paint a checkerboard;
  transparent cards need TRUE alpha, sheets need SOLID #FF00FF.
- CP-2 EGA magenta (#fc54fc) is a LEGAL palette color; only the pure key
  #FF00FF background is chroma-keyed — keep magenta-family paint OFF sprite
  edges (rims get eroded in QA).
- CP-3 Auto-tile sheets are MASKS: the named edges must carry the grass lip
  exactly, lipless edges run clean to the border (they are machine-verified).
- CP-4 Grid-cut sheets (tiles) are filled edge-to-edge with NO magenta;
  chroma sheets keep clear magenta gaps. Never mix the two in one sheet.
- CP-5 Poses on one sheet = ONE design, only the pose changes; a character
  drifting between cells fails the sheet.
- CP-6 Characters whose art IS the task prompt (antics, objects) must be
  readable in half a second at game size — test by squinting.
- CP-7 No text, watermarks, signatures, or borders — letterforms only where
  a card explicitly asks for them.
- CP-8 The generator accepts at most FIVE reference files per call: attach
  hero-v1 + four representative ref_keen_* crops to generations; ALL refs stay
  the visual review standard regardless (learned in the Batch V run).
- CP-9 (PAINT) Painterly soft edges feather into the magenta key: sheets keep
  HARD-EDGED silhouettes (the outline law makes this natural); soft glow and
  smoke go on TRUE-ALPHA cards, never magenta sheets.
- CP-10 (PAINT) Generators regress to pixel/vector style when prompts smell
  like "game asset": say "storybook gouache illustration", never "sprite
  sheet" or "pixel"; every batch gets a pixelation scan vs the style key.
- CP-11 (PAINT) Generators miss exact plate aspects: commission plates at the
  2048-class and let the import normalize to contract size — never hand-crop.
- CP-12 (PAINT) Loopable strips need matched ends: name "left and right edges
  must continue each other" in the prompt; the import seam check is machine-run
  and hard-fails.
- CP-13 (PAINT) Outline weight scales with the SUBJECT (~2.5% of sprite
  height), never a fixed pixel width — a guardian and a coin can't wear the
  same line.
- CP-14 (PAINT) Palette drift across a batch: the unit's palette card is
  embedded in EVERY commission card, not once per batch.
- CP-15 (IP, all batches) No Ubisoft names, designs, or words in prompts,
  reference folders, filenames, or any surface. For paint batches, references
  are OUR OWN art only (style key + hero parts + unit far plate) — the
  ref_keen_* attachment rule of CP-8 is retired for the paint register.
