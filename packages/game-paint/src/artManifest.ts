// PB-T2 · the ART MANIFEST: what painted stems a level REQUIRES to render
// without procedural placeholders. ONE source of truth, imported by BOTH the
// scene's fallback layer (conceptually — the fallbacks stay as dev safety)
// and scripts/check-paint-art.mjs (the CI gate): a used-but-missing stem
// FAILS the build unless it sits on the explicit dev allowlist. This kills
// the "pixelated brown thing shipped silently" class — the playtest's F13.

/** Terrain/prop stems demanded by grid glyphs (stem names, no pb- prefix). */
export const GLYPH_STEMS: Record<string, string[]> = {
  "#": ["strip_ground_loop", "strip_cap_l", "strip_cap_r", "pit_inner_tile"],
  "=": ["plank_loop", "plank_cap_l", "plank_cap_r"],
  "~": ["strip_ice_loop"],
  "z": ["strip_ice_loop", "slope45_down"], // D1: the slippery slide wears the blackboard art on a 45° fall
  "^": ["spikes_nibs_loop"],
  "w": ["pool_ink_loop"],
  "o": ["prop_ring"],
  // PB-C1: `*` no longer needs `prop_letter` — that stem is a painted capital
  // A, so it could only ever spell A. Trail letters are engine-drawn in its
  // key now (letters.ts + PaintScene.letterTex), one texture per character.
  "X": ["prop_exit"],
  "B": ["prop_exit"],
  "s": ["prop_spring"],
  "V": ["prop_vine"],
  // PB-F3: the checkpoint is KRAKEL at his easel — the being whose name the
  // game already says ("Krakel skizziert dich!") but whose art was never wired.
  "C": ["krakel_a", "krakel_active"],
};

/** Every entity skin needs at least its `_a` state cell (per-state renderer:
 *  pb-<skin>_<state> → pb-<skin>_a → procedural blob). */
export const entitySkinStems = (skin: string): string[] => [`${skin}_a`];

// ── PK-R6 · E · THE GUARDIAN FLIGHT RIG (doc 44 §3.2 · §4 ch01 C4) ───────────
// A boss is the one being whose missing cell does NOT read as a missing cell:
// the only-present fallback chain quietly lands on `_a`, so a deleted `spiral2`
// or `land0` would show a hovering board where the fight wants a barrel roll or
// a sinking wobble — and every gate would stay green. This list is exactly the
// set `anim.entPoseCell` can resolve to for a flying guardian, so the rig is
// required rather than hoped for.
export const GUARDIAN_RIG_CELLS = [
  "a", "b", "c", "d", // the hover idle
  "roll", "bank_l1", "bank_r0", "bank_r1", // the banked pairs (roll = bank_l0)
  "spiral0", "spiral1", "spiral2", "spiral3", // rolling through a turn
  "windup0", "windup1", "windup", "throw", // the ≥500 ms tell, and the release
  "land0", "land1", // the dip, the counter-window, the sinking
  "rest", "win", // beaten and resting · consoled (doc 40's `rest`/`joy` pair)
] as const;

/** What a GUARDIAN skin owes, as full stems. */
export const guardianSkinStems = (skin: string): string[] =>
  GUARDIAN_RIG_CELLS.map((c) => `${skin}_${c}`);

/** PK-R6 · H3 · the hero's FULL-POSE override cells (batch-ap hero_rig_v2,
 *  consumed by rigSpec.heroFullCell). Required: the core locomotion states
 *  read from these now, and a missing one would silently fall back to the
 *  composed rig mid-run — one frame in another body. */
export const HERO2_STEMS = [
  "hero2_run0", "hero2_run1", "hero2_run2", "hero2_run3",
  "hero2_jump", "hero2_apex", "hero2_fall", "hero2_land",
  "hero2_idle", "hero2_hit", "hero2_cheer",
  "hero2_teeter0", "hero2_teeter1",
];

/** The hero rig (rigSpec contract, 19 stems). */
export const HERO_STEMS = [
  "head_neutral", "head_blink", "head_determined", "head_hurt", "head_celebrate",
  "body_idle", "body_lean", "body_crouch",
  "hand_open", "hand_fist", "hand_grip",
  "shoe_neutral", "shoe_tucked",
  "hair_still", "hair_wind",
  "satchel",
  "rotor_a", "rotor_b", "rotor_c",
];
