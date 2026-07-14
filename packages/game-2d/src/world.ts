/**
 * W-1 WORLD-ALIVE — the pure world brain (the anim.ts/path.ts pattern: no
 * Phaser, no DOM, unit-tested hard because headless Phaser can't be).
 *
 * A zone's floor plan is DATA (map@1 `zone.layout`): rows of single-char
 * glyphs + a legend. This module parses it into what the engine needs
 * (dimensions, collision set, doors, encounter/NPC/start cells), decides
 * where a player entering through a door spawns, and owns the v2 save shape
 * (per-zone persistent progress, `cleared` as CELL KEYS — layout-stable where
 * the old node indices were not) including the tolerant v1 migration.
 */
import type { NodeStyle, ZoneLayout } from "@domigo/content-schema";
import type { Cell } from "./path.ts";

/** The stable cell key progress is stored under ("c,r"). */
export function cellKey(c: number, r: number): string {
  return `${c},${r}`;
}

/** The engine tile size in px (mirrors the scene's TILE — one source for callers). */
export const WORLD_TILE = 48;

/** A cell's centre in world pixels (where sprites stand and spawns land). */
export function cellCenterPx(cell: Cell): [number, number] {
  return [cell.c * WORLD_TILE + WORLD_TILE / 2, cell.r * WORLD_TILE + WORLD_TILE / 2];
}

export function parseCellKey(key: string): Cell | null {
  const m = /^(\d+),(\d+)$/.exec(key);
  return m ? { c: Number(m[1]), r: Number(m[2]) } : null;
}

export interface DoorCell extends Cell {
  /** Target zone short id ("z03"). */
  to: string;
}

export interface ParsedZone {
  w: number;
  h: number;
  rows: string[];
  /** The raw glyph legend (the scene paints props/doors straight from it). */
  legend: ZoneLayout["legend"];
  /** Walls + solid props, indexed r*w+c. Doors are NOT here — whether a door
   *  blocks (sealed) or walks (open) is a runtime fact the scene decides. */
  blocked: Set<number>;
  doors: DoorCell[];
  /** E cells in scan order — the node order battles + cleared keys refer to. */
  encounterCells: Cell[];
  npcCells: Cell[];
  start: Cell;
  nodeStyle: NodeStyle;
  /** Battles this zone offers (clamped to its E cells). */
  encounters: number;
}

/**
 * Parse a data layout. Runtime-TOLERANT (VS-18 is the strict authoring gate):
 * ragged short rows read as wall beyond their length; unknown glyphs read as
 * floor; a missing P falls back to the map centre.
 */
export function parseZoneLayout(layout: ZoneLayout): ParsedZone {
  const rows = layout.rows;
  const h = rows.length;
  const w = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const blocked = new Set<number>();
  const doors: DoorCell[] = [];
  const encounterCells: Cell[] = [];
  const npcCells: Cell[] = [];
  let start: Cell | null = null;

  for (let r = 0; r < h; r += 1) {
    const row = rows[r]!;
    for (let c = 0; c < w; c += 1) {
      const ch = c < row.length ? row[c]! : "#"; // short row ⇒ wall padding
      if (ch === "#") {
        blocked.add(r * w + c);
      } else if (ch === "E") {
        encounterCells.push({ c, r });
      } else if (ch === "F") {
        npcCells.push({ c, r });
      } else if (ch === "P") {
        start = { c, r };
      } else if (ch !== ".") {
        const entry = layout.legend[ch];
        if (entry && "door" in entry) doors.push({ c, r, to: entry.door });
        else if (entry && entry.solid) blocked.add(r * w + c);
        // unknown glyph / walkable prop ⇒ floor
      }
    }
  }

  return {
    w,
    h,
    rows,
    legend: layout.legend,
    blocked,
    doors,
    encounterCells,
    npcCells,
    start: start ?? { c: Math.floor(w / 2), r: Math.floor(h / 2) },
    nodeStyle: layout.nodeStyle ?? "sparkle",
    encounters: Math.min(layout.encounters ?? 4, encounterCells.length),
  };
}

/**
 * Where a player entering this zone spawns. Came through a door (`from` = the
 * zone they left): the walkable neighbour of the door back to that zone —
 * below first (doors usually sit in top walls), then above, right, left —
 * never ON the door (stepping on a door is what triggers travel). No matching
 * door, or no `from` (hub deep-link): the authored P start.
 */
export function spawnFor(zone: ParsedZone, from?: string | null): Cell {
  if (from) {
    const door = zone.doors.find((d) => d.to === from);
    if (door) {
      const isDoor = (c: number, r: number) => zone.doors.some((d) => d.c === c && d.r === r);
      const candidates: Cell[] = [
        { c: door.c, r: door.r + 1 },
        { c: door.c, r: door.r - 1 },
        { c: door.c + 1, r: door.r },
        { c: door.c - 1, r: door.r },
      ];
      for (const cand of candidates) {
        const inBounds = cand.c >= 0 && cand.c < zone.w && cand.r >= 0 && cand.r < zone.h;
        if (inBounds && !zone.blocked.has(cand.r * zone.w + cand.c) && !isDoor(cand.c, cand.r)) return cand;
      }
    }
  }
  return zone.start;
}

// ---------------------------------------------------------------------------
// Save v2 — per-zone persistent progress (cosmetic; server stores an opaque bag)
// ---------------------------------------------------------------------------

export interface ZoneProgress {
  /** Cleared node CELL KEYS ("c,r"). Legacy numbers (v1 node indices) are
   *  accepted transitionally — the scene matches them by node order and
   *  re-emits cell keys on the next checkpoint (self-healing migration). */
  cleared: Array<string | number>;
}

export interface WorldSaveV2 {
  v: 2;
  /** The zone the player was last in (position is only valid there). */
  zoneId: string;
  pos: [number, number];
  /** Progress per zone SHORT id ("z07") — persists across the whole world. */
  zones: Record<string, ZoneProgress>;
}

/** "g2.map.the-spill.z07" → "z07" (already-short ids pass through). */
export function zoneShort(zoneId: string): string {
  const m = /(z\d{2})$/.exec(zoneId);
  return m ? m[1]! : zoneId;
}

function cleanCleared(raw: unknown): Array<string | number> {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string | number => typeof x === "string" || typeof x === "number");
}

/**
 * Tolerant reader for whatever shape a save arrives in (localStorage, server,
 * v1, v2, garbage). v1's flat `{zoneId, pos, cleared}` becomes a v2 container
 * with that one zone's progress carried over. Anything unreadable ⇒ null
 * (fresh world) — saves are cosmetic by law, so dropping is always safe.
 */
export function migrateSave(raw: unknown): WorldSaveV2 | null {
  if (raw === null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const rawPos: unknown[] = Array.isArray(o.pos) ? o.pos : [];
  const posOk = rawPos.length === 2 && rawPos.every((n) => typeof n === "number" && Number.isFinite(n));
  if (typeof o.zoneId !== "string" || !posOk) return null;
  const pos: [number, number] = [rawPos[0] as number, rawPos[1] as number];

  if (o.v === 2 && typeof o.zones === "object" && o.zones !== null) {
    const zones: Record<string, ZoneProgress> = {};
    for (const [key, val] of Object.entries(o.zones as Record<string, unknown>)) {
      if (val !== null && typeof val === "object") zones[key] = { cleared: cleanCleared((val as Record<string, unknown>).cleared) };
    }
    return { v: 2, zoneId: o.zoneId, pos, zones };
  }

  // v1 flat shape — one zone's cleared indices ride along and self-heal.
  return {
    v: 2,
    zoneId: o.zoneId,
    pos,
    zones: { [zoneShort(o.zoneId)]: { cleared: cleanCleared(o.cleared) } },
  };
}

/** The slice of the save one zone's scene boots from. Position only counts in
 *  the zone the player actually left; progress counts everywhere. */
export function zoneResume(save: WorldSaveV2 | null, zoneId: string): { pos: [number, number] | null; cleared: Array<string | number> } {
  if (!save) return { pos: null, cleared: [] };
  return {
    pos: save.zoneId === zoneId ? save.pos : null,
    cleared: save.zones[zoneShort(zoneId)]?.cleared ?? [],
  };
}

/** Fold one zone's fresh scene report into the world container (immutable). */
export function mergeZoneState(
  save: WorldSaveV2 | null,
  report: { zoneId: string; pos: [number, number]; cleared: Array<string | number> },
): WorldSaveV2 {
  return {
    v: 2,
    zoneId: report.zoneId,
    pos: report.pos,
    zones: { ...(save?.zones ?? {}), [zoneShort(report.zoneId)]: { cleared: report.cleared } },
  };
}
