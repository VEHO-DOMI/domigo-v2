/**
 * B-2 — the school floor plan behind a map-story's hub (doc 22 §1). PRESENTATION
 * ONLY: the plan arranges a map@1 story's zones into labelled bands (the three-
 * band school for "The Spill"); unlock stays the linear spine — a zone not in
 * any band simply falls back to the flat grid, so a map/plan drift can never
 * hide a zone. Excursion zones are drawn "outside the fence" (dashed card).
 */
export interface FloorPlanZoneRef {
  /** The zone short id ("z01") — matched against map.json's zone ids. */
  short: string;
  /** Drawn outside the school fence (the class-trip zones). */
  excursion?: boolean;
}

export interface FloorPlanBand {
  label: string;
  zones: FloorPlanZoneRef[];
}

/** storyId → the hub floor plan (only map-backed stories with a designed plan). */
export const FLOOR_PLANS: Record<string, FloorPlanBand[]> = {
  // Doc 22 §1 verbatim: DRAUSSEN (z05* z07 z13 / z10* z14) · ERDGESCHOSS
  // (z01 z02 z03 z04 z06 z09 z08) · OBEN / HINTEN (z11 z12 z15).
  "g2.st.the-spill": [
    {
      label: "Draußen",
      zones: [
        { short: "z05", excursion: true },
        { short: "z07" },
        { short: "z13" },
        { short: "z10", excursion: true },
        { short: "z14" },
      ],
    },
    {
      label: "Erdgeschoss",
      zones: [
        { short: "z01" }, { short: "z02" }, { short: "z03" }, { short: "z04" },
        { short: "z06" }, { short: "z09" }, { short: "z08" },
      ],
    },
    {
      label: "Oben / Hinten",
      zones: [{ short: "z11" }, { short: "z12" }, { short: "z15" }],
    },
  ],
};
