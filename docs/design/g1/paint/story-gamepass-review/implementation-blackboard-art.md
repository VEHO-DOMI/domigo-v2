# CODEX DRAFT — NOT CANON

State: 28 registered PNG files installed in the shared trial repo, source pack and evidence saved. No commit. Root owns scene, animation-coordinate tables, writing behaviour and full-level validation.

## Ground truth before repainting

Inventoried all 31 existing `tafel_*.png` files with SHA-256 file fingerprints, dimensions and alpha counts. Selected original files were viewed directly and also displayed unmodified in an isolated Chrome instance, so the browser's treatment of transparency was observed separately from the image tool.

The magenta visible in the image viewer is hidden RGB, not an opaque pink background. All 31 files have zero opaque pure-magenta and zero opaque magenta-family pixels. For example, the corner of `tafel_win` is `[255,0,255,0]`: the final zero means fully transparent. By contrast the blue-black diagonal hatching is real opaque colour: old `tafel_win` at x150/y110 is `[3,14,71,255]`. Runtime inspection found direct `load.image` loading; `greyTexOf` changes only RGB luminance and preserves alpha. It cannot turn this hatching into an uninterrupted green writing surface.

The old three Kritzelbilder repeat ABC, a sun and lower-edge doodles, with almost nothing in their centres. A fixed central 81×85-pixel region contains respectively 1, 0 and 12 pixels above alpha 16, out of 6,885. The corresponding weighted painted areas are 0.188, 0 and 5.259 pixels. This explains why the face remains exposed even when layers exist. Root had already removed the old ch01 face-hole mask; new art must cover the face rather than retaining these deliberately empty centres.

Evidence: `art-blackboard/existing-inventory.json`, `existing-scribble-measurements.json`, and `existing-browser.png`. The eight-image browser plate includes idle, resting, winning, banked and spiral body art, plus all three old overlays. The material defect extends to the flying poses, so changing only the last two poses would create a visible material change during the encounter.

## Commission and visual review

Used the built-in ImageGen tool, with the existing rest/win body as identity references and the project's own gouache style key. Read the imagegen skill and CODEX_METHOD read-only. Generated two original sheets, preserved without edits:

- `blackboard-rest-win-original.png`: two complete front-facing figures. Same oak frame, top peg, three brass screws and wooden feet; calm/tired and relieved/smiling expressions; readable chalk-cream eyes with pupils; continuous matte green slate. The entire lower half remains clear for engine-written text. No word, including Hello, is baked in.
- `blackboard-scribble-layers-original.png`: three genuinely distinct drawn clusters—turquoise crossing loops, coral-red diagonal strokes, golden-yellow loops. No board, people, words, digits, ABC or mathematical answers. Every layer crosses the middle. The first layer remains densest over the face.

Both originals and exact prompts are in the source pack. No corrective regeneration was needed. The generated scribble clusters were taller than the requested imaginary square. They were registered proportionally into equal square canvases with transparent margins; no individual line was cut and no independent x/y stretch was used during import.

## Import and state mapping

All body PNGs have the same **384×512** canvas and the same original-source registration rectangle. The complete body bounds plus six-pixel margin are declared before colour-key removal. `sourceCrop` retains the full figure; it is not a colour-selected pixel mask. Bounds detection is read-only and documented in the original manifest. Background-only magenta residuals outside the declared drawing do not become figure bounds.

The 20 active body names come from the current `GUARDIAN_RIG_CELLS` and `entPoseCell` consumers. The calm figure is used for:

`a`, `b`, `c`, `d`, `roll`, `bank_l1`, `bank_r0`, `bank_r1`, `spiral0`, `spiral1`, `spiral2`, `spiral3`, `windup0`, `windup1`, `windup`, `throw`, `land0`, `land1`, `rest`.

`win` uses the smiling figure. The four old fallback body names `sad`, `dazed`, `stagger`, `telegraph` also receive the calm figure, preventing an accidental return to the old material. These are explicitly static aliases, not a claim of separately painted movement frames. The existing pitch, roll compression, attack swelling and movement code continue to move the body. Parent authorized this mapping; the former baked-in perspective extremes are intentionally not preserved. This trade-off requires integrated motion review.

The three scribbles use **256×256** canvases and equal 618-pixel square source-space spans. `tafel_scribble3b` is a byte-identical third-layer fallback, not a newly claimed shaking pose. Existing `tafel_hand`, `tafel_chalk` and `tafel_clean` are not part of the body replacement. Root was asked to suppress the old clean-film overlay on ch01 because it was authored for the older blue slate; no scene code was changed here.

## Measured slate and writing rectangle

The existing `guardian-flight.test.ts` slate detector was copied read-only into the lab and transpiled without changing its logic. Its island threshold remains 12 pixels and the existing table tolerance remains 0.002. The exact copied source slice and full source file are fingerprinted in `slate-detector-provenance.json`.

| Body | Slate rectangle, PNG pixels | Normalized cx / cy / w / h | Dominant hue |
| --- | --- | --- | --- |
| Calm and all its aliases | x64,y108,w263,h269 | .5091145833333334 / .4736328125 / .6848958333333334 / .525390625 | 144° green |
| Win | x63,y108,w264,h269 | .5078125 / .4736328125 / .6875 / .525390625 | 145° green |

The common clear **Hello/name rectangle is x80,y264,width230,height96** on the 384×512 canvas. Every one of its 22,080 pixels is opaque and satisfies the existing green-material rule in both rest and win. This is a deliberately inset writing box below the face, not the entire slate bounding box. Exact measurements: `new-slate-measurements.json`, `writing-window.json`.

The new overlays touch 75.67%, 55.46% and 54.36% of the actual cream-coloured face pixels respectively before the scene's transparency factor. The detector selects cream paint inside the upper 55% of the measured slate and excludes its outer edge; the full method and weighted opacity values are recorded. Unlike the old empty centres, each layer now materially crosses the face.

## Import failures, correction and gate evidence

First complete import was stopped atomically: the yellow overlay had 148 remaining output fringe pixels and zero specks. Declaring only output `chromaMatte` did not help, because the normal output fringe check runs before that later mode is invoked. This second result is retained separately. No images were installed on either failed attempt, no thresholds were weakened, and no importer code changed.

With Root's explicit instruction, the yellow layer alone received the existing `sourceChromaMatte: "no-violet"` contract. This is justified by the authored yellow-only palette; it removes background contamination before scaling. It recoloured 9,623 source edge/grain pixels from nearby existing non-violet paint, maximum neighbour distance five pixels. Before and after alpha fingerprints match exactly. The complete 28-image import then passed with **zero source/output fringe pixels and zero source/output specks** for every asset. All original and output hashes were verified before installation, and installed bytes were rechecked.

Importer selftest: **17 groups passed**, exit 0. This lane adds import definitions, not gate code. Its independent manifest tamper narrows the first source crop to 20 pixels, cutting the declared complete board. The real importer exits **1** with `sourceCrop: cuts declared complete foreground`; an existing target PNG remains byte-identical. Evidence: `cropped-body-tamper.log`. The source-matte and existing alpha-one tests remain part of the unchanged importer selftest.

## Browser evidence and remaining integration

`layers-browser.png` was rendered and visually inspected in Chrome using the registered PNGs, measured slate placement and the existing layer opacities 0.72/0.95. It shows three, two, one and zero layers. The face remains substantially tangled with one turquoise layer; the zero-layer smiling state shows it clearly. This is a composition proof, not a claim that the complete running boss encounter has been played.

Root must update the per-frame slate-coordinate table from these measurements and replace the old explicit night-blue expectation in its test with the new green-art contract while retaining both colour-family controls. Root also owns Hello/name text fitting, the runtime wipe, legacy clean-film suppression and motion review. No TypeScript, scene or test gate was edited by this art lane.

## Files and next step

Repository source pack: `docs/art/ch01-story-gamepass/blackboard/`. It contains exact originals and prompts, manifests, original/registered/installed fingerprints, complete import report, slate and writing-window measurements, before/after browser proofs, and separate red/correction/tamper logs. Installed assets: `apps/web/public/art/g1/paint/ch01/tafel_*.png` as listed in `installed-stems.json`.

Lab: `CH01_STORY_SPIELPASS/art-blackboard/` and `imported-blackboard/`. Parent completes the integrated scene and full PR battery. Nothing is needed from Koki for this bounded lane.
