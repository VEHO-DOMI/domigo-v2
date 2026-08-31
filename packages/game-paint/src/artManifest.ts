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

/** R5-W9 · N6 · the painted join that binds a platform object into the mass. */
export const TERRAIN_JOIN_STEMS = ["terrain_join_bookbinder"] as const;
export const TERRAIN_JOIN_STEM = TERRAIN_JOIN_STEMS[0];

/** Every entity skin needs at least its `_a` state cell (per-state renderer:
 *  pb-<skin>_<state> → pb-<skin>_a → procedural blob). */
export const entitySkinStems = (skin: string): string[] => [`${skin}_a`];

// ── R5-W3 · A5 · D-48 · WHO IS IN THE CAGE (batch AQ6) ───────────────────────
//
// All four cages in ch01 wear the `satchel` shell, and until now that shell was
// the whole picture: four different captives, one silhouette. The occupant is
// its own small layer, drawn behind the unchanged cage.
//
// THE PREFIX IS LOAD-BEARING. `artScope.phaseArtScope` closes over a skin name —
// every stem beginning `satchel_` joins the scope of every phase holding a
// satchel cage. Naming these `satchel_in_*` would therefore pull all four
// captives into all four phases, which is four times the texture for three
// pictures nobody can see. `captive_*` is invisible to that closure and is
// added per cage, by key.
export const CAPTIVE_KEYS = ["soundsystem", "tablet", "chair", "picture"] as const;
export type CaptiveKey = (typeof CAPTIVE_KEYS)[number];
export const captiveStem = (key: string): string => `captive_${key}`;
export const CAPTIVE_STEMS: readonly string[] = CAPTIVE_KEYS.map(captiveStem);
export const isCaptiveKey = (v: unknown): v is CaptiveKey =>
  typeof v === "string" && (CAPTIVE_KEYS as readonly string[]).includes(v);

/**
 * R5-W5 · C4 · D-228 · …AND WHO IS IN THE ONE CAGE THAT HOLDS A PERSON.
 *
 * A thing-cage carries one of the four captive keys above and its occupant is
 * painted on its own `captive_*` sheet. The chapter's ONE person-cage carries
 * the classmate's name instead (`params.classmate`), and her occupant cell is
 * the caged pose of her own skin — `merle_caged0`, painted in `import-batch-am`
 * / `import-batch-aq15` and posed by `anim.entPoseCell` (`caged: [caged0,
 * caged1]`).
 *
 * WHY THIS LIVES HERE rather than being typed where it is used. The convention
 * had exactly one written copy, in `cards/CardShell.tsx#cageCellFor`, and the
 * scene is going to need the same string the moment the person-cage grows its
 * occupant layer: C3 built that layer, measured it against the pencil case
 * (`syncOverlay` copies the SCALE, not the display height, so Merle came out
 * 47 px tall inside her own 34 px cage — R107) and took it back out until AQ15c
 * frees the window and fixes the geometry. When that session lands, React and
 * the scene must not each spell the convention out for themselves: two copies of
 * a naming law are two laws waiting to disagree — the same argument this file
 * already makes for the captive prefix, and the argument W3 proved the hard way
 * on `BANNED_DE` (D-123/D-251, two lists that had silently drifted apart).
 *
 * `portrait.test.ts` holds the guard: it reads CardShell's source and reddens if
 * a second `_caged0` literal ever reappears there.
 *
 * R5-W6b · D4 · D-285 — UND JETZT AUCH DIE FREIE ZELLE. Der Absatz oben endete
 * bis heute mit »die Spiegel-Konstante ist der offensichtlich nächste Schritt«:
 * die FREIE Zelle derselben Person (`<name>_a`, das Bild der Zeremonie) stand als
 * Literal in `CardShell#freeCellsFor`, also dieselbe Klasse eine Zeile weiter.
 * C4 hat sie gemeldet statt sie zu bewegen, weil die Karten-Bahn ihr nicht
 * gehörte; sie gehört ihr jetzt. Beide Zellen derselben Person kommen damit aus
 * derselben Datei, und wer die Namenskonvention ändert, ändert sie einmal.
 */
export const classmateStem = (name: string): string => `${name}_caged0`;

/**
 * R5-W6b · D4 · D-285 — die FREIE Zelle einer Person: ihre erste, ungefangene
 * Pose. Das `_a` ist die Stammkonvention dieses Kapitels (»die erste Zelle dieser
 * Kunst«, wie `satchel_a`, `regelseite_a`), und sie ist der Grund, warum die
 * Zeremonie nach der Befreiung ein Kind zeigt und keinen Käfig.
 */
export const classmateFreeStem = (name: string): string => `${name}_a`;

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
  // R5-W4 · F5 · R46: `hero2_teeter0/1` sind raus (Zellen gelöscht) — ein
  // Pflicht-Stem ohne Blatt liesse `check-paint-art` eine Datei fordern, die es
  // nicht mehr gibt.
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

/** R5-W2 · J1-B · THE CHAPTER OPENING'S OWN PICTURES.
 *
 *  The stems the four beats read straight out of the art map. Declared here —
 *  once — so the cards, the loader and the »loaded by nothing« audit read the
 *  same names, and a rename at import time is a one-line change.
 *
 *  CLAIMED, NOT REQUIRED: every one of them falls back (painted cell → the
 *  school-house cell → the scene cut → nothing at all), because art lands batch
 *  by batch and a card may never break on a missing file. A hard requirement
 *  here would fail the build for a chapter whose paint has not arrived.
 *
 *  Deliberately NOT listed, because nothing shows them: `auftakt_ch01_a` (the
 *  open book — beat 1 already carries the chapter's painted title plate, and two
 *  books on one card is one too many) and `schulhaus_ch01_c` (the façade detail,
 *  ordered as scenery rather than for a card). They stay in the audit's dead list
 *  ON PURPOSE — that list is only worth reading if it is honest.
 *
 *  `auftakt_ch01_c` WAS on that list and is not any more: the blind look critic
 *  called beat 3 »the one beat that reads as a plain checklist/settings dialog,
 *  not a story page« (90 %), and the note is the PAPER the tasks are written on
 *  rather than a form whose three rows must match five lines. */
export const AUFTAKT_STEMS: readonly string[] = [
  "auftakt_ch01_b", "auftakt_ch01_c", "auftakt_ch01_d",
  "auftakt_mark_letters", "auftakt_mark_cages", "auftakt_mark_tips",
  "schulhaus_ch01_a", "schulhaus_ch01_b",
];

/** R5-W2 · J1-C · THE PAINTED ICON STEMS.
 *
 *  `PaintedIcon` (cards/PaintedIcons.tsx) draws its code-built glyph unless a
 *  painted stem named `hud_<name>` exists in the art map, in which case it draws
 *  that instead. Those stems are therefore read by the DOM on every card — and
 *  none of them was ever declared to `artScope.domArtStems`, so the art audit
 *  has been reporting live art as »loaded by nothing«.
 *
 *  The names live HERE and not next to the icons because the audit runs in a
 *  plain node script: importing the .tsx would drag JSX into a file that only
 *  strips types. `PaintedIcons.test.ts` asserts this list and the icon set are
 *  the same set, in both directions — so the copy cannot rot silently. */
export const PAINTED_ICON_NAMES: readonly string[] = [
  "spark", "cage", "wisp", "rule", "book", "palette", "door",
  "knot", "inkwell", "blot", "brush", "slate", "rosette",
  "uniform", // R5-W5 · G4: the HUD's uniform counter (painted sheet hud_uniform, AQ10)
];
