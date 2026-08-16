// THE PAINTED BOOK — artScope.ts — WHICH STEMS A PHASE ACTUALLY NEEDS.
//
// R5-W1 · E1. Measured on the shipped chapter: entering phase 1 queued all
// 290 painted stems (329 MB of texture data, 529 MB resident on the GPU once
// fallbacks and canvas copies are counted) when that phase draws about eighty
// of them. Every phase paid for every other phase's art before its first frame.
//
// THE HAZARD THIS MODULE IS BUILT AROUND. Loading less is easy; loading less
// SAFELY is not. `PaintScene.tex()` falls back to a procedural `fb-` twin when
// a stem is missing — the keen-art law, which exists so art can land batch by
// batch without breaking the game. That same law means a scope that forgets a
// stem produces no error, no warning and no failing gate: it produces a grey
// blob where a painting belongs. So this module is deliberately a CEILING, not
// a guess:
//
//   * classes that can be enumerated exactly (hero rig, composition kit) are
//     taken WHOLE — never a subset;
//   * classes whose names the renderer BUILDS at run time (`${skin}_${state}`,
//     `chalk_${colour}`, `hero2_${cell}`) are closed over what exists on disk,
//     so a cell this module has never heard of is still in scope;
//   * the backdrop branches on `compositionFor(...) !== null` — the renderer's
//     OWN condition, read from the same function, so the two cannot drift.
//
// The floor and the ceiling live here together on purpose:
// `phaseRequiredStems` is what CI demands exist, `phaseArtScope` is what the
// loader loads, and scripts/check-paint-art.mjs asserts floor ⊆ ceiling. A
// stem the gate insists on that the loader would skip fails the build.

import { AUFTAKT_STEMS, GLYPH_STEMS, HERO2_STEMS, HERO_STEMS, PAINTED_ICON_NAMES, captiveStem, entitySkinStems, guardianSkinStems, isCaptiveKey } from "./artManifest.ts";
import { COMPOSITION, compositionStems } from "./composition.ts";
import { CHALK_PROJECTILE_STEMS } from "./entities.ts";

/** The shape this module needs. Structural on purpose: the CI gate hands it
 *  raw parsed JSON, the scene hands it a PaintLevel, and both must fit. */
export interface ScopePhase {
  id: string;
  rows: readonly string[];
  entities: ReadonlyArray<{ id?: string; role?: string; skin: string; params?: Record<string, unknown> | undefined }>;
  plates?: Record<string, string | undefined> | undefined;
}

export interface ScopeLevel {
  chapter: string;
  phases: readonly ScopePhase[];
  arena?: ScopePhase | null | undefined;
  bonus?: ScopePhase | null | undefined;
  goalPlate?: string | undefined;
  scorePlate?: string | undefined;
  doorPlate?: string | undefined;
  rulePlate?: string | undefined;
}

/** Every phase of a level, in one list (phases + arena + bonus room). */
export const allScopePhases = (level: ScopeLevel): ScopePhase[] => [
  ...level.phases,
  ...(level.arena ? [level.arena] : []),
  ...(level.bonus ? [level.bonus] : []),
];

/**
 * Glyph → the painted bank wedge the terrain builder lays over its fill.
 * Lifted out of PaintScene's terrain loop so the loader and the renderer read
 * ONE table; only `z` was ever declared in GLYPH_STEMS, so the other three
 * slopes were stems no manifest knew about.
 */
export const SLOPE_STEMS: Readonly<Record<string, string>> = {
  "/": "slope45_up",
  "\\": "slope45_down",
  z: "slope45_down",
  "1": "slope30_up",
  "3": "slope30_down",
};

/**
 * Stems the builders PROBE for beyond GLYPH_STEMS — present ⇒ drawn, absent ⇒
 * silently skipped. Being optional is exactly why they must be in scope: an
 * optional painting that is never loaded looks identical to one that was never
 * painted, and only one of those is intended.
 */
export const TERRAIN_PROBE_STEMS: Readonly<Record<string, readonly string[]>> = {
  "#": ["canopy_fringe_loop"],
  C: ["checkpoint_easel"],
};

/** What buildBackdropLegacy() reaches for — needed ONLY when a phase has no
 *  composition spec. Kept as data so the branch below can mirror the scene's. */
export const LEGACY_BACKDROP_STEMS: readonly string[] = [
  "plate_far",
  "plate_sky",
  "strip_mid_loop",
  "plate_near_loop",
];

/** Loaded in every phase: the hero is always on screen. */
export const ALWAYS_STEMS: readonly string[] = [...HERO_STEMS, ...HERO2_STEMS];

/**
 * Stems the DOM card layer reads straight out of the art map to build
 * `<img>` tags (the objective plate, the door plate, the score plate, the
 * ceremony hero). They are NOT Phaser textures and must never be loaded as
 * such — but they must stay in the art map, which is why the map itself is
 * left whole and the scoping happens at the loader.
 */
export const domArtStems = (level: ScopeLevel): Set<string> => {
  const out = new Set<string>();
  if (level.goalPlate !== undefined) out.add(level.goalPlate);
  if (level.scorePlate !== undefined) out.add(level.scorePlate);
  if (level.doorPlate !== undefined) out.add(level.doorPlate);
  if (level.rulePlate !== undefined) out.add(level.rulePlate);
  // R5-W2 · I1: the reading card opens the page it just found, so every tip skin
  // brings its `_open` cell to the DOM side. It is CLAIMED, not REQUIRED — the
  // card falls back (open → idle → painted icon) under the keen-art law, and a
  // hard requirement here would break a chapter whose art has not landed yet.
  for (const ph of allScopePhases(level)) {
    for (const e of ph.entities) if (e.role === "tip") out.add(`${e.skin}_open`);
  }
  // R5-W2 · J1-C: THE PAINTED ICONS. `PaintedIcon` reads `hud_<name>` straight
  // out of the art map and draws it instead of its code-drawn glyph whenever the
  // stem exists (PaintedIcons.tsx). Eight of those stems have been on disk for
  // packets and none of them was declared here — so every one of them has been
  // sitting in AUDIT B's »loaded by nothing« list while it was, in fact, being
  // rendered on every card. An audit that miscounts in the SAFE direction is
  // still an audit that miscounts, and the count is what tells us when art has
  // genuinely gone dead. Declared by NAME, from the icon set itself, so a new
  // icon cannot be forgotten here.
  for (const n of PAINTED_ICON_NAMES) out.add(`hud_${n}`);
  // R5-W2 · J1-B: the opening's four beats read these straight out of the map.
  for (const s of AUFTAKT_STEMS) out.add(s);
  // R5-W4 · I2: the Merkseite's own three cells. Same argument as the icons
  // above, one wave later: `merkseite_page`/`_stub`/`_seal` landed with AQ7,
  // were listed as DEAD_ART group A („bezahlt, unverdrahtet"), and are now
  // rendered — the archive card draws the stub for every page still missing and
  // the hub's Regelbuch is set on the page. Claimed, not required: the keen-art
  // chain degrades to the rule page and then to the drawn icon.
  // ⚠ OWNERSHIP: Rahmen §5 reserves this function for D3 this wave. Koki ruled
  // on 2026-08-15 that the hub gets real painted paper, which cannot be honest
  // without this claim, so I2 takes ONE additive line here — declared in the PR
  // and flagged to D3. Both edits append; a rebase resolves by keeping both.
  for (const s of ["merkseite_page", "merkseite_stub", "merkseite_seal"]) out.add(s);
  // R5-W4b · D3b · R54: the ceremony's own motif — the freed occupant, drawn
  // WITHOUT the cage (`freeCellsFor` in cards/CardShell.tsx). The first three
  // were DEAD_ART group A („bezahlt, unverdrahtet") since AQ6 and are rendered
  // now. `klassenfoto_a` is the class photo's DOM-side sheet, still at the
  // painter (AQ14 was sent back by a blind sheet check this session) — declared
  // anyway, because a claim on a stem that has not landed costs nothing and
  // says what this layer will draw. Until it does, the picture cage falls to
  // `obj_picture`, which the world's victory tract already claims; `merle_a` is
  // likewise a world skin. Neither adds art — both add honesty about who draws
  // them. Claimed, not required: the chain degrades to the caged sheet and then
  // to the drawn mark, so no card hangs on a file.
  for (const s of ["obj_soundsystem", "obj_tablet", "obj_chair", "klassenfoto_a", "obj_picture", "merle_a"]) out.add(s);
  for (const s of ALWAYS_STEMS) out.add(s);
  return out;
};

const phaseById = (level: ScopeLevel, phaseId: string): ScopePhase | null =>
  allScopePhases(level).find((p) => p.id === phaseId) ?? null;

const hasComposition = (level: ScopeLevel, phaseId: string): boolean =>
  (COMPOSITION[level.chapter]?.[phaseId] ?? null) !== null;

// ── THE FLOOR — what CI demands exists on disk ───────────────────────────────

/** stem → why it is needed, for one phase. Mirrors the gate's own wording. */
export const phaseRequiredStems = (level: ScopeLevel, phaseId: string, label = ""): Map<string, string> => {
  const out = new Map<string, string>();
  const need = (stem: string, where: string): void => {
    if (!out.has(stem)) out.set(stem, where);
  };
  const ph = phaseById(level, phaseId);
  if (ph === null) return out;
  for (const g of new Set(ph.rows.join(""))) {
    for (const stem of GLYPH_STEMS[g] ?? []) need(stem, `${label} ${ph.id} glyph '${g}'`);
  }
  for (const e of ph.entities) {
    const stems = e.role === "guardian" ? guardianSkinStems(e.skin) : entitySkinStems(e.skin);
    for (const stem of stems) need(stem, `${label} ${ph.id} ${e.role ?? "entity"} ${e.id ?? e.skin}`);
  }
  // The plates belong to the LEGACY backdrop only. buildBackdrop() returns
  // early whenever the phase has a composition spec, so on a composed phase
  // `plates` names art the renderer can never reach — and the gate was
  // demanding it be painted anyway (17.0 MB of it, downloaded and uploaded to
  // the GPU every session, drawn never). Branching here on the SCENE'S own
  // condition keeps the gate honest in both directions: drop a phase's spec
  // and its plates become required again in the same change.
  if (!hasComposition(level, ph.id)) {
    for (const plate of Object.values(ph.plates ?? {})) {
      if (plate !== undefined) need(String(plate), `${label} ${ph.id} plate (legacy backdrop)`);
    }
  }
  const spec = COMPOSITION[level.chapter]?.[ph.id];
  if (spec) for (const stem of compositionStems(spec)) need(stem, `${label} ${ph.id} composition`);
  return out;
};

/** The whole level's floor: every phase, plus the chapter plates and the rig. */
export const levelRequiredStems = (level: ScopeLevel, label = ""): Map<string, string> => {
  const out = new Map<string, string>();
  const need = (stem: string, where: string): void => {
    if (!out.has(stem)) out.set(stem, where);
  };
  if (level.goalPlate !== undefined) need(String(level.goalPlate), `${label} goalPlate`);
  if (level.scorePlate !== undefined) need(String(level.scorePlate), `${label} scorePlate`);
  if (level.doorPlate !== undefined) need(String(level.doorPlate), `${label} doorPlate`);
  if (level.rulePlate !== undefined) need(String(level.rulePlate), `${label} rulePlate`);
  for (const ph of allScopePhases(level)) {
    for (const [stem, where] of phaseRequiredStems(level, ph.id, label)) need(stem, where);
  }
  for (const stem of HERO_STEMS) need(stem, "hero rig");
  for (const stem of HERO2_STEMS) need(stem, "hero v2 override (PK-R6 H3)");
  return out;
};

// ── THE CEILING — what the loader loads ──────────────────────────────────────

/**
 * Every stem this phase's render path may ask for.
 *
 * @param present the art map's key set — i.e. what exists on disk. The
 *   run-time-constructed name classes are closed over THIS, which is what
 *   makes under-scoping structurally impossible for them: the scene can only
 *   ask for `${skin}_${something}` that exists, and every such stem is here.
 */
export const phaseArtScope = (level: ScopeLevel, phaseId: string, present: Iterable<string>): Set<string> => {
  const disk = present instanceof Set ? present : new Set(present);
  const out = new Set<string>();
  const add = (s: string): void => {
    out.add(s);
  };
  /** every existing stem that is `base` or begins `base_` */
  const closure = (base: string): void => {
    add(base);
    const pre = `${base}_`;
    for (const s of disk) if (s === base || s.startsWith(pre)) add(s);
  };

  // 1 · the hero, always
  for (const s of ALWAYS_STEMS) add(s);
  closure("hero2"); // heroFullCell builds cell names by index

  const ph = phaseById(level, phaseId);
  if (ph === null) return out;

  // 2 · THE WHOLE TERRAIN KIT, in every phase — 17 stems, 4.4 MB.
  // Not by glyph, deliberately. buildTerrain() probes `pb-plank_loop`,
  // `pb-spikes_nibs_loop` and `pb-strip_ice_loop` UNCONDITIONALLY (they gate
  // the kit's own fallback shapes, not a glyph), so a by-glyph scope dropped
  // three stems a phase without those glyphs still asks for — caught by the
  // fallback ledger on p2 the first time this ran. Taking the kit whole costs
  // 4.4 MB against 111 MB saved and closes the class: an unconditional probe
  // added later cannot silently fall out of scope.
  for (const stems of Object.values(GLYPH_STEMS)) for (const s of stems) add(s);
  for (const g of new Set(ph.rows.join(""))) {
    for (const s of TERRAIN_PROBE_STEMS[g] ?? []) add(s);
    const slope = SLOPE_STEMS[g];
    if (slope !== undefined) add(slope);
  }

  // 3 · beings — the WHOLE cell family of every skin present in this phase
  let guardianHere = false;
  for (const e of ph.entities) {
    closure(e.skin);
    for (const s of entitySkinStems(e.skin)) add(s);
    if (e.role === "guardian") {
      guardianHere = true;
      for (const s of guardianSkinStems(e.skin)) add(s);
    }
    // R5-W3 · A5 · D-48: the captive is scoped BY KEY, one layer per cage, and
    // deliberately not through `closure` — see the prefix note in artManifest.
    if (e.role === "cage" && isCaptiveKey(e.params?.captive)) add(captiveStem(e.params.captive));
  }

  // 4 · chalk, only where something throws it
  if (guardianHere) {
    for (const s of CHALK_PROJECTILE_STEMS) add(s);
    closure("chalk");
    // R5-W4 · H2 (D-39): …und das Klassenfoto in FARBE, das der Sieg-Trakt an
    // die Stelle der grauen Silhouette hängt. Es steht nur hier, weil nur ein
    // Raum mit Boss einen Sieg-Trakt hat — ein Blatt, das jede Phase lädt und
    // nur eine zeigt, ist genau die Sorte Budget, die niemand bemerkt.
    add("obj_picture");
  }

  // 5 · the backdrop — branching on the SCENE'S OWN condition
  if (hasComposition(level, ph.id)) {
    const spec = COMPOSITION[level.chapter]?.[ph.id];
    if (spec) for (const s of compositionStems(spec)) add(s);
  } else {
    for (const s of Object.values(ph.plates ?? {})) if (s !== undefined) add(String(s));
    for (const s of LEGACY_BACKDROP_STEMS) add(s);
  }

  return out;
};

/** Every phase's scope at once — for prefetch planning and the budget test. */
export const levelArtScopes = (level: ScopeLevel, present: Iterable<string>): Map<string, Set<string>> => {
  const disk = present instanceof Set ? present : new Set(present);
  const out = new Map<string, Set<string>>();
  for (const ph of allScopePhases(level)) out.set(ph.id, phaseArtScope(level, ph.id, disk));
  return out;
};
