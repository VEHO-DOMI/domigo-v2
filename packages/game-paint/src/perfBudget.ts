/**
 * R5-W3 · E5 · THE PERF BUDGETS — one place, so a number cannot drift.
 *
 * Koki's rule is that performance is paramount: the game "builds and falls"
 * with smoothness, and his trade is standing — rather a small loading screen
 * than ever a stutter at run time. That rule lived in a document
 * (`docs/PERF_WAECHTER.md`), and a rule that lives only in a document is a
 * habit. E2 already paid for that lesson once: two gates said in their own file
 * headers that they were part of the standing gates while no workflow ever ran
 * them, and every local run was green.
 *
 * So the numbers live HERE, once, and everything that enforces or quotes them
 * reads them from here:
 *   · `artScope.test.ts`          → PHASE_ART_MB
 *   · `scripts/check-game-bundle` → BUNDLE_PHASER_KB, BUNDLE_OTHER_KB
 *   · `scripts/check-paint-art`   → DEAD_ART_CEILING
 *   · `scripts/check-perf-budget` → all of them, against the guard document
 *
 * WHERE A BUDGET CAN HONESTLY BE ENFORCED. Three of these five are static
 * facts about the repository and are therefore real CI gates. Two are runtime
 * measurements that need a browser, and there is no browser in CI — so they are
 * declared here with the recipe that measures them, and the report says plainly
 * that they are not machine-enforced. A test that cannot fail is worse than no
 * test, because it reads like coverage.
 */

/** How a budget is actually policed. Read by `scripts/check-perf-budget.mjs`. */
export type Enforcement =
  /** a real CI gate: derived from the repository on every run */
  | "ci"
  /** measured in a browser by `scripts/measure-create.mjs`, run by hand */
  | "measured-by-hand"
  /** only a human on a visible screen can see it (P-56/P-57) */
  | "human-screen";

export interface Budget {
  readonly key: string;
  /** the ceiling itself */
  readonly limit: number;
  readonly unit: "ms" | "MB" | "KB" | "stems";
  /** plain German, the way it appears in the guard document */
  readonly de: string;
  readonly enforcement: Enforcement;
  /** the file that enforces or measures it — checked to exist and to mention the key */
  readonly enforcedIn: string;
  /** why this number and not another — every ceiling names its evidence */
  readonly because: string;
}

/**
 * The five ceilings of the guard document, verbatim in their numbers, plus the
 * dead-art ceiling this session added. Changing a number here is a deliberate,
 * reviewable act — and `check-perf-budget` makes the guard document disagree
 * loudly until it is changed there too.
 */
export const BUDGETS: readonly Budget[] = [
  {
    key: "SETTLED_GPU_MS",
    limit: 4,
    unit: "ms",
    de: "eingeschwungen ≤ 4 ms GPU",
    enforcement: "measured-by-hand",
    enforcedIn: "scripts/measure-create.mjs",
    because:
      "E4 measured 1.7–1.9 ms settled in all four cells of its 2×2 experiment; 4 ms leaves headroom for a weaker machine and still keeps a 60 Hz frame.",
  },
  {
    key: "FIRST_FRAME_GPU_MS",
    limit: 35,
    unit: "ms",
    de: "Erstbild ≤ 35 ms",
    enforcement: "human-screen",
    enforcedIn: "docs/PERF_WAECHTER.md",
    because:
      "Two 60 Hz frames. E4's lab run reached 11.7 ms with both warmers on, but the delivered figure swings 36–236 ms in an automated tab (P-57), so only a visible screen can confirm it.",
  },
  {
    key: "CREATE_MS",
    limit: 100,
    unit: "ms",
    de: "create() ≤ 100 ms",
    enforcement: "measured-by-hand",
    enforcedIn: "scripts/measure-create.mjs",
    because:
      "create() runs in the same step that draws the first frame (P-54), so its cost is a still picture. 100 ms is the threshold above which a start reads as a hitch rather than a beat.",
  },
  {
    key: "PHASE_ART_MB",
    limit: 35,
    unit: "MB",
    de: "Phase-Assets ≤ 35 MB (artScope)",
    enforcement: "ci",
    enforcedIn: "packages/game-paint/src/artScope.test.ts",
    because:
      "E1 cut a phase from 111.1 MB to 17–28 MB by loading per phase instead of per chapter; 35 MB is that landing plus room for one wave of art.",
  },
  {
    key: "BUNDLE_OTHER_KB",
    limit: 150,
    unit: "KB",
    de: "Bundle ≤ 150 KB",
    enforcement: "ci",
    enforcedIn: "scripts/check-game-bundle.mjs",
    because:
      "Gzipped ceiling for every client chunk that is not the lazy Phaser chunk — the tripwire for a leak that pulls the engine into a commonly loaded chunk.",
  },
  {
    key: "BUNDLE_PHASER_KB",
    limit: 400,
    unit: "KB",
    de: "Phaser bleibt in EINEM faulen Brocken",
    enforcement: "ci",
    enforcedIn: "scripts/check-game-bundle.mjs",
    because: "Phaser core is ≈310 KB gzipped today; 400 KB catches a second copy or a merge.",
  },
  {
    key: "DEAD_ART_CEILING",
    limit: 58,
    unit: "stems",
    de: "Kunst, die niemand lädt, wächst nicht unbemerkt",
    enforcement: "ci",
    enforcedIn: "scripts/check-paint-art.mjs",
    because:
      "The keen-art law lets a batch land before its wiring, and that freedom accumulated 53 → 57 → 59 → 61 → 53 stems / 44.9 → 36.2 MB across four sessions and one merge train (Stand 2026-08-19), under a warning nobody had to act on. Set to today's count with no headroom: the freedom stays, the silence goes — adding sheets means raising this number in the same PR, with a reason. Full annotated list: docs/design/g1/paint/DEAD_ART_2026-08-14.md. R5-W4b · W3 (R90): four wave-4 reports each named a different figure (61/60/58) because every lane that wires or deletes art lowers the pile without touching the ceiling, so nobody knew what it WAS. The ceiling now has ONE owner and sits on a measurement, not on a memory. A ceiling above reality loses exactly the warning it was built for (D-193), so the slack is printed on every run. R5-W4b · HOTFIX after the merge train (R104): W3 measured 57 stems / 37.2 MB on ITS base 3daaf47, but the five PRs merged before it moved the pile — A6b deleted krakel_b, D3b wired obj_chair/obj_soundsystem/obj_tablet — so main measured 53 stems / 36.2 MB on ae0dd42 and W3's selftest (bend the ceiling by one, expect the reality check to fire) could no longer fire. The number now stands on the post-train measurement, and the owner of this ceiling sets it AFTER the last merge of a wave, never in parallel with it. ★ R5-W9 · M1 (2026-08-22): 53 → 54, und das eine Blatt ist `canopy_fringe_loop`. Es ist NICHT neu geliefert — es war verdrahtet und ist es nicht mehr: die Hecke hing kit-unabhaengig an jeder Solid-Zelle der obersten Reihe, also in allen fuenf Raeumen von ch01, darunter das Nacht-Klassenzimmer (gemessen in der laufenden p3: EIN TileSprite ueber die volle Weltbreite, 1024 x 26 px). R4-W9 · Der aktuelle Checkout misst 58 tote Stems; die 17 neuen R4-Blaetter sind geladen, die vier zusätzlichen Altstände sind nicht Teil dieser Lieferung. Die Decke folgt diesem Ist-Stand mit 0 Luft und bleibt durch dieses Tor überwacht.",
  },
] as const;

const lookup = (key: string): number => {
  const b = BUDGETS.find((x) => x.key === key);
  if (b === undefined) throw new Error(`perfBudget: no budget named ${key}`);
  return b.limit;
};

/** No single phase may queue more than this much art before its first frame. */
export const PHASE_ART_MB = lookup("PHASE_ART_MB");
/** Gzipped ceiling for the one lazy chunk that carries Phaser. */
export const BUNDLE_PHASER_KB = lookup("BUNDLE_PHASER_KB");
/** Gzipped ceiling for every other client chunk. */
export const BUNDLE_OTHER_KB = lookup("BUNDLE_OTHER_KB");
/** create() alone, in the step that draws the first frame. */
export const CREATE_MS = lookup("CREATE_MS");
/** GPU work of the first drawn frame of a phase. */
export const FIRST_FRAME_GPU_MS = lookup("FIRST_FRAME_GPU_MS");
/** GPU work of every frame after it. */
export const SETTLED_GPU_MS = lookup("SETTLED_GPU_MS");
/** How many painted stems may sit on disk that no phase and no card loads. */
export const DEAD_ART_CEILING = lookup("DEAD_ART_CEILING");
