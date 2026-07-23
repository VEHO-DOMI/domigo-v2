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
  "^": ["spikes_nibs_loop"],
  "w": ["pool_ink_loop"],
  "o": ["prop_ring"],
  "*": ["prop_letter"],
  "X": ["prop_exit"],
  "B": ["prop_exit"],
  "s": ["prop_spring"],
  "V": ["prop_vine"],
  "C": ["checkpoint_easel"],
};

/** Every entity skin needs at least its `_a` state cell (per-state renderer:
 *  pb-<skin>_<state> → pb-<skin>_a → procedural blob). */
export const entitySkinStems = (skin: string): string[] => [`${skin}_a`];

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
