// THE CODEX COMMISSION — BATCH Z (THE PAINTED BOOK: the style-key gate).
// Doc 31 M1 (2026-07-19): the game pivots to the painted-platformer shape and
// EVERYTHING is judged on these FIVE images before any volume art exists. A
// wrong register caught here costs 5 images, not ~210 (the ch01 slice) or
// ~1,050 (year 1).
//
// STYLE_PAINT_V1 supersedes STYLE_PIXEL_V3 for the new game: there is ONE
// class now — everything is PAINTED (storybook gouache). No pixel art, no
// NEAREST filtering, no 48px-multiple law. Characters are LIMBLESS storybook
// mascots (floating hands/feet) — which is also the animation system: the
// engine poses PARTS, so the parts sheet (card 2) is the consistency anchor
// for the whole year.
//
// FRESH-EYES LAW (doc 31 §1.6): nothing here inherits the Keen build's cast
// or designs. The three refs in refs-z/ are OUR OWN painted images (register
// cousins) — attached for craft tier and book-world mood ONLY, never for cast
// or composition. CP-15: no Ubisoft names, designs, or words, anywhere.
//
// Rendered by build-commission-z.mjs → CODEX_COMMISSION_Z.html + CODEX_MASTER_PROMPT_Z.md.

// ── THE CONTRACT — STYLE_PAINT_V1 (doc 31 §2, promptable) ────────────────────
export const STYLE_PAINT_V1 = `STYLE (strict — THE PAINTED BOOK, one class for everything): a warmly hand-PAINTED children's storybook gouache illustration in the register of a lavish mid-90s hand-drawn platformer — dense, saturated, joyful. NOT pixel art (zero visible pixel grid, zero crunch), NOT vector-flat, NOT 3D-render. Visible soft brushwork, professional picture-book quality. This is a children's English game set INSIDE a magical book: paper, ink, and letters are the physics of the world.

THE BOOK-WORLD KEY (in every image): warm paper-cream base light; ink blue-black linework; grounds carry faint ruled exercise-book lines and soft paper grain; a GOLDEN GLOW is reserved for collectibles and hint objects ONLY — nothing else emits light.

CHARACTERS — LIMBLESS STORYBOOK MASCOTS: round bodies with FLOATING mitten-hands and floating shoes — no arms, no legs, no neck. Big expressive eyes, thick soft dark-ink outlines (outline weight ~2.5% of the character's height — a big creature wears a heavier line than a small pickup). Everyday objects are mascotized (a face, floating little hands). Bewitched things read melancholy-comic — tangled, grey-drained, grumpy — NEVER scary (no horror, no sharp teeth, no menace; players are 10). Freed things read bright and joyful.

THE THREE-VALUE DEPTH LAW (readability is law): the FOREGROUND play plane is full saturation with thick dark outlines and the strongest contrast; MID background planes are desaturated two-tone SILHOUETTE shapes with NO outlines; the FAR plane is lightest, haziest, almost monochrome. A screenshot squinted to a blur must still separate hero / enemies / ground / background instantly.

SILHOUETTES: every character and platform must read as a clean black fill. Grounds are organic painted banks with overhanging grass/paper lips — bezier curves, never straight machine edges (straight edges belong only to man-made objects). One consistent warm light from the top-left; soft ambient shadow where forms meet the ground.

MOOD: warm, curious, a little wistful where the world is bewitched grey — the emotional register of a beloved picture book. No text, no watermarks, no signatures, no borders.`;

// ── the unit-1 palette card (book-verified GREEN; embedded in EVERY card — CP-14)
export const PALETTE_U01 = `UNIT-1 PALETTE CARD (chapter 1 "Zeit für die Schule" — GREEN): dominant pair fresh leaf-green × warm sun-yellow; supports deep pine-green and pale meadow-cream. Plus the invariant book constants: warm paper-cream light, ink blue-black lines, faint ruled lines + paper grain in grounds, golden glow ONLY on collectibles/hints.`;

// ── the hero design (PROPOSAL for this gate — Koki judges; cheap to amend now)
export const HERO_PAINT = `THE HERO (identical design in every cell/appearance): a schoolkid of about 10 drawn as a limbless storybook mascot — round body in a cobalt-blue jumper with one cream-yellow zigzag band, floating cream mitten-hands, floating red-brown sneakers, warm-brown messy hair, big expressive dark eyes, a small brown cross-body satchel with a large white quill (gold nib) tucked into it. Friendly, quick, brave.`;

const PAINT_SHEET = "FORMAT: PNG sheet on SOLID magenta #FF00FF (no transparency — chroma-keyed later). Clean grid, equal cells, generous margins, nothing touching cell borders. CRITICAL (CP-9): every painted element keeps a HARD-EDGED silhouette against the magenta — no soft feathered edges, no glow bleeding into the key; soft effects stay INSIDE the silhouette.";
const PAINT_PLATE = "FORMAT: PNG, full-bleed painted plate (no transparency).";

const z = (o) => ({ batch: "Z", cls: "paint", gateOnly: true, ...o });

export const cardsZ = [
  // ── Z·1 — THE STYLE KEY (the whole verdict in one image) ───────────────────
  z({
    stem: "_style_key_paint", file: "_style_key_paint.png", folder: "root",
    size: "2048×1152", format: "fullbleed",
    usage: "THE cohesion anchor of the entire painted game — judged by eye, never sliced or shipped; every later image is checked against it. Generate FIRST; use it as a reference for cards 2–5.",
    prompt: `${STYLE_PAINT_V1}\n\n${PALETTE_U01}\n\n${HERO_PAINT}\n\nSUBJECT: one wide GAMEPLAY vignette that IS the game's look — a side-scrolling platformer moment inside the book, chapter-1 green:\n- DEPTH (the three-value law, visibly): FAR plane = hazy, almost-monochrome paper hills with faint ruled lines; MID plane = desaturated two-tone silhouettes of giant page-leaf trees and ink bushes, NO outlines; FOREGROUND play plane = full saturation, thick soft ink outlines.\n- GROUND: a painted rolling paper-earth bank (an organic STRIP, not tiles) with an overhanging fresh-green grass lip, soft tufts, ruled exercise-book lines and paper grain in the soil, gentle ambient shadow under the lip.\n- THE HERO mid-run toward the right, floating hands trailing.\n- ONE BEWITCHED ENEMY ahead of him: a living PENCIL as a limbless mascot — grey-drained, tangled in a soft ink-knot thread, grumpy-comic expression, patrolling.\n- A CAGE half-hidden on a higher ledge: a knotted school satchel, softly pulsing, a small warm face peeking through a gap — clearly a friend to free, never ominous.\n- A trail of FIVE GLOWING GOLDEN LETTERS arcing up toward the cage (the only glow in the image).\n- One glowing letter-O SWING RING hanging in the gap between two banks.\nWarm late-afternoon light from the top-left. This single image must sell the whole pivot: painted storybook, limbless mascots, figure-ground pop under a squint. 2048×1152, full-bleed.`,
  }),

  // ── Z·2 — THE HERO PARTS SHEET (the rig = the animation system) ────────────
  z({
    stem: "hero_parts_sheet", file: "hero_parts_sheet.png", folder: "hero",
    size: "1920×1536 (5×4 grid, 384px cells)", format: "sheet",
    usage: "The limbless composite RIG parts — the engine assembles and animates these; part consistency here = character consistency for the whole year. Gate: do the parts read as ONE character?",
    prompt: `${STYLE_PAINT_V1}\n\n${PALETTE_U01}\n\n${HERO_PAINT}\n\nSUBJECT: a 5×4 parts sheet (19 used cells, 1 blank, reading order) of the hero's SEPARATE rig parts, every part drawn to ONE consistent scale so they assemble into a hero ~620px tall (head+body together ≈ 480px; a hand ≈ 110px; a shoe ≈ 130px):\n1-5 HEAD ×5 (with hair): neutral · blinking · determined · hurt (dizzy, small stars) · celebrating (beaming) — same head, only the face changes.\n6-8 BODY (torso, jumper + satchel, NO head/hands/feet) ×3: idle upright · run-lean (tilted forward) · charge-crouch (compressed).\n9-11 MITTEN-HAND ×3: open · closed fist · gripping (curled as if holding a bar).\n12-13 SHOE ×2: neutral · tucked (mid-jump).\n14-15 HAIR TUFT ×2 (separate small piece for wind): still · windblown.\n16 SATCHEL alone (for cutscene dressing).\n17-19 QUILL-ROTOR ×3: the white quill spinning as a propeller blur — three rotation frames (vertical · diagonal · horizontal blur disc), gold nib visible.\nEach part centered in its cell with a hard-edged silhouette. ${PAINT_SHEET}`,
  }),

  // ── Z·3 — THE POSE ATLAS (how assembled poses must READ) ──────────────────
  z({
    stem: "hero_pose_atlas", file: "hero_pose_atlas.png", folder: "hero",
    size: "2048×2048 (4×4 grid, 512px cells)", format: "sheet",
    usage: "The assembled hero in all 13 gameplay poses — the LOOK reference the engine's procedural part-animation must match (and the source of dedicated keyframe cells later). Gate: does the limbless body language sing?",
    prompt: `${STYLE_PAINT_V1}\n\n${PALETTE_U01}\n\n${HERO_PAINT}\n\nSUBJECT: a 4×4 sheet (13 used cells, 3 blank, reading order), the ASSEMBLED hero ~440px tall, side-on facing RIGHT unless noted, hands and shoes floating free of the body:\n1 IDLE (relaxed, gentle bob) · 2 RUN A (mid-stride, hands trailing behind, shoes scissored) · 3 RUN B (opposite stride) · 4 JUMP (rising, hands up, shoes tucked) · 5 FALL (hands out wide, shoes dangling) · 6 HOVER (the white quill spinning as a rotor ABOVE his head, gold nib glinting, body hanging relaxed beneath) · 7 PUNCH WIND-UP (fist hand pulled back, glowing faintly with effort) · 8 PUNCH THROW (the fist hand DETACHED and flying ahead mid-air, motion streaks, body leaning into it) · 9 CHARGE (crouched, fist hand orbiting him in a tight circle) · 10 HANG (both hands gripping a ledge edge above, body dangling) · 11 SWING (both hands on a glowing letter-O ring, body mid-arc) · 12 HURT (knocked back, dizzy small stars, comic not painful) · 13 CELEBRATE (arms-up cheer, confetti letters). ${PAINT_SHEET}`,
  }),

  // ── Z·4 — THE PHASE VIGNETTE (a real level screen, painted) ────────────────
  z({
    stem: "ch01_phase_vignette", file: "ch01_phase_vignette.png", folder: "ch01",
    size: "2048×1152", format: "fullbleed",
    usage: "One chapter-1 phase screen as a painted mock — the LEVEL look gate: parallax planes, strip terrain, platforms, hazards, a checkpoint, an exit sign, all under the readability laws. What the game will actually look like in play.",
    prompt: `${STYLE_PAINT_V1}\n\n${PALETTE_U01}\n\n${HERO_PAINT}\n\nSUBJECT: a complete side-scrolling PHASE SCREEN of chapter 1 (the bewitched first school lesson), painted as the real game will look — hero standing left-of-center on the ground strip:\n- PARALLAX: far hazy paper-hill plane; mid silhouette plane of huge closed books standing like standing stones + page-leaf trees; foreground play plane full-color.\n- TERRAIN: painted paper-earth ground strips at two heights connected by a 45° grassy slope; an overhanging lip; ruled lines + grain in the soil.\n- PLATFORMS (mascot-free objects, from the unit's own school things): a stack of BOOKS as a static platform · a LOOSE PAPER SHEET drifting as a falling platform (slightly tilted, fragile) · a SCHOOL SATCHEL hanging from a hook as a swinging platform.\n- HAZARDS: a low row of INK-NIB SPIKES (dark sharp nibs, clearly do-not-touch) on the lower ground · a small SPILLED-INK POOL, glossy and deep blue-black.\n- A CHECKPOINT: a small easel with a half-finished ink sketch of the hero, a tiny stool, inviting.\n- An EXIT SIGN at the far right: a wooden signpost with a painted arrow and a small ink flourish.\n- Scattered GOLDEN LETTER collectibles in a gentle arc (the only glow).\n- One more bewitched school-thing far right: a living RULER mascot, grey-drained, pacing.\nNO interface elements, no text. Warm top-left light, chapter-1 green palette. 2048×1152, full-bleed.`,
  }),

  // ── Z·5 — THE ENEMY PAIR (the two-skin law at the painted bar) ─────────────
  z({
    stem: "enemy_pair_sheet", file: "enemy_pair_sheet.png", folder: "ch01",
    size: "1536×512 (3×1, 512px cells)", format: "sheet",
    usage: "One chapter-1 enemy, bewitched ×2 poses + freed ×1 — the gate for the wild→calm redemption look every enemy in the game will use.",
    prompt: `${STYLE_PAINT_V1}\n\n${PALETTE_U01}\n\nSUBJECT: a 3×1 sheet of ONE living PENCIL character (a yellow wooden pencil as a limbless mascot — face on the shaft, floating mitten-hands, floating little shoes, big readable eyes), ~440px tall in each cell:\n1 BEWITCHED PATROL — grey-drained colour, tangled in a soft ink-knot thread, grumpy-comic scowl, mid-march.\n2 BEWITCHED LUNGE — the telegraph pose: reared up, thread taut, eyes wide, about to dash — readable in half a second, still comic, never scary.\n3 FREED — full warm colour restored, threads gone, beaming, mid-happy-hop, a tiny sparkle of golden dust.\nSame character in all three cells; only state and pose change. ${PAINT_SHEET}`,
  }),
];

export const futureSectionsZ = [
  { title: "Batch AA — the hero rig (production) + the twelve classmates", note: "After the Z look gate: the production parts/pose art + the 12 fictional classmates (Fenn · Veit · Piet · Tammo · Quirin · Lenz · Merle · Ilvy · Enna · Juno · Smilla · Edda — naming law, doc 31 §5), caged-sad + freed-celebrate + portraits, all rig-compatible. Plus the girl avatar right after the template freeze." },
  { title: "Batch AB — the chapter-1 world", note: "Ground strips + parallax plates (far/mid/near/arena) + the full bewitched school-thing cast + the guardian + cages + collectibles, per the frozen sheet." },
  { title: "Batch AC — cutscenes + UI", note: "The opening 'class falls in' picture-book shots, avatar-select page, HUD set — after ch01's world holds the bar." },
];
