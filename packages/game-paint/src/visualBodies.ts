/**
 * R6 · EIN-BLOCK-WELT — deklarierte Sicht-Körper.
 *
 * Kokis Ruling (31.08., docs/n6-auftrag/KONZEPT_R5_KANON.md + der R6-Plan): jeder
 * zusammenhängende Terrain-Block wird als EIN durchgehend gemaltes Bild
 * ausgeliefert — Silhouette, Kanten, Unterseite und Innenleben in einem Wurf.
 * Dieses Modul ist die WAHRHEIT darüber, welcher Körper welche Zellen besitzt.
 *
 * Warum DEKLARIERT statt detektiert: die Zusammenhangs-Komponenten des Grids
 * verschmelzen visuell getrennte Dinge über 1-Zellen-Brücken (p2: Decke, Wand,
 * Pfeiler und Boden sind EINE Komponente mit 15 % Füllgrad), und ein Detektor,
 * der bei einer Grid-Änderung still nichts mehr findet, ist die Turm-Regression
 * von R4. Eine Deklaration, deren Maske nicht mehr zum Grid passt, wird ROT
 * (`bodyPartitionErrors`), nie still.
 */
import { glyphAt, isSolid } from "./collide.ts";

/** Ein Streifen eines groß gemalten Blattes (Slicer-Sicherheitsnetz, >2048 px).
 *  Streifen sind EIGENE PNGs, aus demselben Gemälde geschnitten, mit
 *  dupliziertem Überlapp — die Naht ist per Konstruktion unsichtbar. */
export interface BodySlice {
  stem: string;
  /** Quell-px-Ursprung dieses Streifens im ungeschnittenen Gemälde. */
  srcX: number;
  /** Breite des Streifens in Quell-px (inkl. Überlapp). */
  srcW: number;
}

export interface VisualBody {
  /** benennbar wie das Ding selbst (K1 des Craft-Kanons), z. B. "p2_regal_turm_boden" */
  id: string;
  /** Blatt-Stem (bei Slices: der Basisname; gemountet werden die Slices). */
  stem: string;
  /** Zell-Ursprung der Maske im Grid. */
  c0: number;
  r0: number;
  /** Maske relativ zu (c0,r0): '#' = Zelle gehört dem Körper. */
  rows: readonly string[];
  /** gemalte Quell-px je Zelle (64 große Massen · 96 Held-/Mittel-Körper). */
  pxPerCell: number;
  /** Quell-px, die das Gemälde über die Zell-Box hinausragen darf (Fransen,
   *  Kragen). Das Silhouetten-Tor misst Alpha außerhalb Maske+Overpaint. */
  overpaint: { l: number; r: number; t: number; b: number };
  /** Wirts-Körper, in den dieser Körper seinen gemalten Kragen hineinmalt —
   *  der Kragen liegt ein Tiefen-Epsilon ÜBER dem Wirt (K9: gewachsen, nie
   *  gestoßen). Reihenfolge in der Deklarationsliste = Wirt vor Anbau. */
  attachTo?: string;
  slices?: readonly BodySlice[];
}

/**
 * Ein Raum, wie das Level ihn traegt: die drei Phasen, die Arena (p4) und die
 * Bonus-Kammer (p9) — getrennte Container mit derselben Form.
 */
export interface PhaseGrid {
  id: string;
  rows: readonly string[];
}

export interface LevelGrids {
  phases: readonly PhaseGrid[];
  arena?: PhaseGrid;
  bonus?: PhaseGrid;
}

/**
 * DAS RASTER EINER PHASE — die EINE Auflösung, aus der jedes Werkzeug liest.
 *
 * Warum geteilt: `check-body-silhouette` las das Raster als `level.phases[idx]`
 * und wäre an jedem p4-/p9-Körper abgestürzt, weil diese beiden Räume gar nicht
 * in `phases` wohnen (p4 = `arena`, p9 = `bonus`). Ein Tor, das nur die Räume
 * kennt, für die es je gelaufen ist, ist ein Wunsch. Diese Funktion wirft lieber,
 * als still ein Nebengitter zu liefern — ein leises falsches Raster wäre der
 * teurere Fehler.
 */
export const gridOf = (level: LevelGrids, phaseId: string): readonly string[] => {
  const all = [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])];
  const phase = all.find((p) => p.id === phaseId);
  if (phase === undefined) {
    const known = all.map((p) => p.id).join(", ");
    throw new Error(`gridOf: Phase "${phaseId}" gibt es in diesem Level nicht (vorhanden: ${known})`);
  }
  return phase.rows;
};

export const bodyCells = (b: VisualBody): Array<{ c: number; r: number }> => {
  const out: Array<{ c: number; r: number }> = [];
  b.rows.forEach((row, dr) => {
    for (let dc = 0; dc < row.length; dc++) {
      if (row[dc] === "#") out.push({ c: b.c0 + dc, r: b.r0 + dr });
    }
  });
  return out;
};

/**
 * Das Partitions-Gesetz. Fehlerliste statt boolean, damit das Tor SAGT, was
 * driftet: (1) jede Masken-Zelle ist im Grid solide, (2) kein Körper besitzt
 * eine Zelle doppelt, (3) jede Maske ist 4er-zusammenhängend, (4) bei
 * `fullyPainted` bleibt keine unbeanspruchte Solid-Zelle übrig.
 */
export const bodyPartitionErrors = (
  grid: readonly string[],
  bodies: readonly VisualBody[],
  opts: { fullyPainted?: boolean; otherClaimed?: ReadonlySet<string> } = {},
): string[] => {
  const errors: string[] = [];
  const owned = new Map<string, string>();
  for (const b of bodies) {
    const cells = bodyCells(b);
    if (cells.length === 0) { errors.push(`${b.id}: leere Maske`); continue; }
    for (const { c, r } of cells) {
      if (!isSolid(glyphAt(grid, c, r))) errors.push(`${b.id}: (${c},${r}) ist im Grid nicht solide`);
      const key = `${c},${r}`;
      const prev = owned.get(key);
      if (prev !== undefined) errors.push(`${b.id}: (${c},${r}) gehört schon ${prev}`);
      owned.set(key, b.id);
    }
    // 4er-Zusammenhang: Flutfüllung von der ersten Zelle aus muss alle erreichen.
    const inBody = new Set(cells.map(({ c, r }) => `${c},${r}`));
    const first = cells[0];
    if (first !== undefined) {
      const seen = new Set([`${first.c},${first.r}`]);
      const queue = [first];
      for (let i = 0; i < queue.length; i++) {
        const cur = queue[i];
        if (cur === undefined) continue;
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const key = `${cur.c + dc},${cur.r + dr}`;
          if (inBody.has(key) && !seen.has(key)) { seen.add(key); queue.push({ c: cur.c + dc, r: cur.r + dr }); }
        }
      }
      if (seen.size !== inBody.size) errors.push(`${b.id}: Maske zerfällt in ${inBody.size - seen.size + 1}+ Teile`);
    }
    if (b.attachTo !== undefined && !bodies.some((h) => h.id === b.attachTo)) {
      errors.push(`${b.id}: attachTo "${b.attachTo}" existiert nicht`);
    }
  }
  if (opts.fullyPainted === true) {
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r] ?? "";
      for (let c = 0; c < row.length; c++) {
        const key = `${c},${r}`;
        if (isSolid(glyphAt(grid, c, r)) && !owned.has(key) && !(opts.otherClaimed?.has(key) ?? false)) {
          errors.push(`fullyPainted: Solid-Zelle (${c},${r}) gehört keinem Körper`);
        }
      }
    }
  }
  return errors;
};

/**
 * DAS KALIBRIER-EXEMPLAR (R6 Runde 1): Kokis markierter p2-Cluster — Regalbahn
 * (r9), der Turm, die zwei Tisch-Stummel und der linke Boden als EIN Körper.
 * Maske maschinell aus dem Grid abgeleitet (Flutfüllung, 185 Zellen, 32×17).
 * Erst mit der ANGENOMMENEN Lieferung wandert er in CH01_BODIES — vorher würde
 * `check-paint-art` zu Recht ein Blatt ohne PNG melden.
 */
export const P2_EXEMPLAR_BODY: VisualBody = {
  id: "p2_regal_turm_boden",
  stem: "body_p2_regal_turm_boden",
  c0: 0,
  r0: 9,
  rows: [
    "......................##########",
    "......................##........",
    "....................####........",
    "......................##........",
    "......................##........",
    "......................##........",
    "......................##........",
    "......................##........",
    "......................##........",
    "....####....###.......##........",
    ".......#......#.......##........",
    "########################........",
    "########################........",
    "########################........",
    "########################........",
    "########################........",
    "########################........",
  ],
  pxPerCell: 64,
  overpaint: { l: 0, r: 0, t: 12, b: 16 },
};


/**
 * DIE P2-WELLE (R7): die sechs übrigen Körper des Nacht-Klassenzimmers, Masken
 * maschinell aus dem Grid erzeugt (0 Partitions-Fehler, fullyPainted grün mit
 * Exemplar + Kleinst-Läufen). Absorption eingebaut: die Bücherstapel-Treppe der
 * Ostwand ersetzt die drei gekippten Säulen, die zwei Decken-Körper ersetzen die
 * hängenden Pfeiler. Ein Eintrag wandert erst MIT seinem angenommenen PNG in
 * CH01_BODIES.
 */
export const P2_WAVE_BODIES: readonly VisualBody[] = [
  {
    id: "p2_deckenbahn_west",
    stem: "body_p2_deckenbahn_west",
    c0: 0, r0: 0,
    rows: [
      "########################",
      "......................##",
      "......................##",
      "......................##",
      "......................##",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
  {
    id: "p2_deckenbahn_mitte",
    stem: "body_p2_deckenbahn_mitte",
    c0: 24, r0: 0,
    rows: [
      "###############################",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
  {
    id: "p2_tafelgeruest",
    stem: "body_p2_tafelgeruest",
    c0: 24, r0: 1,
    rows: [
      "......#....#...................",
      "......######...................",
      "......#....#...................",
      "......#....#...................",
      "#######....####################",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
  {
    id: "p2_deckenbahn_ost",
    stem: "body_p2_deckenbahn_ost",
    c0: 55, r0: 0,
    rows: [
      "#################",
      "##...............",
      "##...............",
      "##...............",
      "##...............",
      "##...............",
      "##...............",
      "##...............",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
  {
    id: "p2_pultreihe_r9",
    stem: "body_p2_pultreihe_r9",
    c0: 34, r0: 9,
    rows: [
      "####################",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
  {
    id: "p2_ostwand_treppe_boden",
    stem: "body_p2_ostwand_treppe_boden",
    c0: 55, r0: 1,
    rows: [
      "................#",
      "................#",
      "................#",
      "................#",
      "................#",
      "................#",
      "................#",
      "................#",
      "................#",
      "................#",
      "................#",
      "##..............#",
      "##..............#",
      "##..............#",
      "####............#",
      "####............#",
      "####............#",
      "######........###",
      "######..........#",
      "#################",
      "#################",
      "#################",
      "#################",
      "#################",
      "#################",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
];

/**
 * DIE P1-WELLE (N7A1): die fünf Körper der Eingangshalle, Masken maschinell aus
 * dem Raster erzeugt (`scripts/make-body-stencils.mjs` liest dieselben Fenster).
 * 548 Zellen, 0 Partitions-Fehler, fullyPainted grün — die 21 übrigen soliden
 * Zellen gehören den Möbel-Läufen (`floatingPlatformRuns`), nicht einer Handliste.
 *
 * Der Boden ist EIN Blatt: Kokis „ein Guss" vom 01.09. hält, weil seine 336
 * Zellen 4-zusammenhängend sind (gemessen, nicht angenommen). Das Ostpodest hat
 * das alte `terrain_atlas_podest_p1` ABSORBIERT — die 2×2-Zellen auf r16/r17
 * sind jetzt Teil des Körpers, und das Blatt wächst dafür von 540 auf 668 px.
 */
export const P1_WAVE_BODIES: readonly VisualBody[] = [
  {
    id: "p1_deckenbahn_west",
    stem: "body_p1_deckenbahn_west",
    c0: 0, r0: 0,
    rows: [
      "######################",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
  {
    id: "p1_deckenbahn_mitte",
    stem: "body_p1_deckenbahn_mitte",
    c0: 22, r0: 0,
    rows: [
      "######################",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
  {
    id: "p1_deckenbahn_ost",
    stem: "body_p1_deckenbahn_ost",
    c0: 44, r0: 0,
    rows: [
      "####################",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
  {
    id: "p1_hallenboden",
    stem: "body_p1_hallenboden",
    c0: 0, r0: 18,
    rows: [
      "########################################....",
      "########################################....",
      "########################################....",
      "########################################....",
      "############################################",
      "############################################",
      "############################################",
      "############################################",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
  {
    id: "p1_ostpodest",
    stem: "body_p1_ostpodest",
    c0: 46, r0: 16,
    rows: [
      ".....##...........",
      ".....##...........",
      "##################",
      "##################",
      "##################",
      "##################",
      "##################",
      "##################",
      "##################",
      "##################",
    ],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 12, b: 16 },
  },
];

/**
 * JEDER DEKLARIERTE KÖRPER MIT SEINEM RAUM — auch die, die noch nicht montiert
 * sind. Der Wareneingang misst ein geliefertes Blatt, BEVOR es in `CH01_BODIES`
 * wandert (dort landet ein Eintrag erst mit seinem angenommenen PNG), und er
 * braucht dabei das Raster des richtigen Raums. Vorher kannte der Wareneingang
 * nur die p2-Welle und stempelte die Phase hart auf "p2" — ein p1-Körper war
 * damit gar nicht messbar.
 */
export const DECLARED_BODIES: ReadonlyArray<{ phase: string; body: VisualBody }> = [
  { phase: "p2", body: P2_EXEMPLAR_BODY },
  ...P2_WAVE_BODIES.map((body) => ({ phase: "p2", body })),
  ...P1_WAVE_BODIES.map((body) => ({ phase: "p1", body })),
];

/** Die live montierten Körper je Phase. Ein Eintrag kommt erst MIT seinem PNG. */
export const CH01_BODIES: Record<string, readonly VisualBody[]> = {
  // R7: das Nacht-Klassenzimmer ist VOLLSTÄNDIG gemalt — Exemplar + Welle.
  p2: [P2_EXEMPLAR_BODY, ...P2_WAVE_BODIES],
};
