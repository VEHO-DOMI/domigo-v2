import { describe, expect, it } from "vitest";
import {
  DX_BY_SKY,
  REACH_ENVELOPE,
  checkLevelLaws,
  findGlyph,
  type PaintLevel,
  parsePaintLevel,
  reachableCells,
  standable,
} from "./level.ts";
import { IDLE_PAD, type Pad, spawnPlayer, stepPlayer } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";

const phase = (rows: string[], over: Record<string, unknown> = {}) => ({
  id: "p1",
  nameDe: "Test",
  surface: "normal" as const,
  plates: {},
  rows,
  entities: [],
  links: [],
  exit: { to: "done" },
  // R5-W5 · B4b: seit Kokis Entscheid 2026-08-17 muss jede Phase mit einem `C`
  // SAGEN, welche Seite der Schwelle den Anker trägt (`checkpoint-placement`).
  // `"far"` steht hier, weil genau das die Doktrin ist, die die Fixtures dieser
  // Datei prüfen (Anti 3/6 v2: Anker hinter der Tinte) — die Prüfungen behalten
  // damit ihre Absicht Wort für Wort. Ein Test, der die andere Seite braucht,
  // überschreibt es über `over`; die Seiten-Spiegelung selbst liegt in
  // `checkpoint-silence.test.ts`.
  checkpointSide: "far" as const,
  ...over,
});

const level = (rows: string[], over: Partial<PaintLevel> = {}): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99",
  chapter: "ch99",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump", "hover"],
  phases: [phase(rows) as PaintLevel["phases"][number]],
  ...over,
});

// a LAWFUL minimal world: ≥20 rows, closed top, floor, exit on the path
const OK_ROWS = [
  "############",
  ...Array.from({ length: 16 }, () => "............"),
  "..S....*..X.",
  "############",
  "############",
];

describe("parsePaintLevel (loud semantics)", () => {
  it("accepts a well-formed level", () => {
    expect(() => parsePaintLevel(level(OK_ROWS))).not.toThrow();
  });

  it("rejects ragged rows", () => {
    const bad = [...OK_ROWS];
    bad[2] = "...........";
    expect(() => parsePaintLevel(level(bad))).toThrow(/ragged/);
  });

  it("rejects illegal glyphs", () => {
    const bad = [...OK_ROWS];
    bad[3] = "....Z.......";
    expect(() => parsePaintLevel(level(bad))).toThrow(/illegal glyph/);
  });

  it("demands exactly one start and one exit per phase", () => {
    const noStart = [...OK_ROWS];
    noStart[17] = ".......*..X.";
    expect(() => parsePaintLevel(level(noStart))).toThrow(/exactly one start/);
    const twoExits = [...OK_ROWS];
    twoExits[5] = "X...........";
    expect(() => parsePaintLevel(level(twoExits))).toThrow(/exactly one exit/);
  });

  it("rejects broken and looping exit chains", () => {
    const lvl = level(OK_ROWS);
    lvl.phases[0]!.exit.to = "p9";
    expect(() => parsePaintLevel(lvl)).toThrow(/unknown phase/);
    const loop = level(OK_ROWS);
    loop.phases[0]!.exit.to = "p1";
    expect(() => parsePaintLevel(loop)).toThrow(/loops/);
  });

  it("rejects off-grid entities and dangling links", () => {
    const lvl = level(OK_ROWS);
    lvl.phases[0]!.entities = [{ id: "c1", role: "cage", skin: "satchel", c: 99, r: 1, tier: "E" }];
    expect(() => parsePaintLevel(lvl)).toThrow(/off-grid/);
    const lnk = level(OK_ROWS);
    lnk.phases[0]!.entities = [{ id: "c1", role: "cage", skin: "satchel", c: 2, r: 6, tier: "E" }];
    lnk.phases[0]!.links = [{ trigger: "ghost", on: "opened", action: "open", targets: ["c1"] }];
    expect(() => parsePaintLevel(lnk)).toThrow(/trigger ghost unknown/);
  });
});

describe("reachability (the honest movement envelope)", () => {
  it("walks flats, climbs a one-tile step, and jumps small gaps", () => {
    const rows = [
      "............",
      "............",
      "............",
      "............",
      "............",
      "........####",
      "..S....#####",
      "####...#####",
      "############",
    ];
    const reach = reachableCells(rows, ["jump"]);
    expect(reach.has("2,6")).toBe(true); // the start deck
    expect(reach.has("8,4")).toBe(true); // up the step stack
  });

  it("cannot cross a wide gap without hover — and can with it", () => {
    const rows = [
      "..............",
      "..............",
      "..............",
      "..............",
      "..S...........",
      "###......#####",
      "###......#####",
      "###......#####",
      "###......#####",
      "###......#####",
      "###......#####",
      "##############",
    ];
    const without = reachableCells(rows, ["jump"]);
    expect(without.has("10,4")).toBe(false); // 6 columns of gap > the 3-tile jump
    const withHover = reachableCells(rows, ["jump", "hover"]);
    expect(withHover.has("10,4")).toBe(true);
  });

  it("climbs a ledge it could never jump — but only WITH the grip (L2-M-a · D-812)", () => {
    // Eine Mauer von SECHS Zeilen ueber der Lauflinie, mit begehbarer Krone.
    // Ohne den Griff verspricht das Modell JUMP_UP = 4 und die Krone liegt
    // ausserhalb; mit dem Griff JUMP_UP + HANG_ROWS = 6, und sie liegt drin.
    const rows = [
      "................",
      "................",
      "................",
      "................",
      "................",
      "..........######",   // Krone (r5); die Fuesse stehen auf r5 ⇒ Knoten r4
      "..........######",
      "..........######",
      "..........######",
      "..........######",
      "..........######",
      "..S.............",
      "################",
    ];
    const ohne = reachableCells(rows, ["jump", "run"]);
    expect(ohne.has("10,4"), "ohne den Griff ist die Krone sechs Zeilen weit weg").toBe(false);
    const mit = reachableCells(rows, ["jump", "run", "hang"]);
    expect(mit.has("10,4"), "mit dem Griff traegt die Kante das Kind hinauf").toBe(true);
  });

  it("…and the envelope still holds: a ledge too high stays out (L2-M-a)", () => {
    // NEUN Zeilen. Die Sonde misst, dass die Engine hoechstens acht traegt —
    // das Modell verspricht sechs und darf deshalb hier NICHTS segnen.
    const rows = [
      "................",
      "................",
      "..........######",   // Krone (r2) ⇒ Knoten r1, neun Zeilen ueber r10
      "..........######",
      "..........######",
      "..........######",
      "..........######",
      "..........######",
      "..........######",
      "..........######",
      "..S.............",
      "################",
    ];
    const mit = reachableCells(rows, ["jump", "run", "hang"]);
    expect(mit.has("10,1"), "das Modell darf nie eine unerreichbare Stelle segnen").toBe(false);
  });

  it("bridges an even wider gap with a ring", () => {
    const rows = [
      "................",
      "................",
      "................",
      ".......o........",
      "..S.............",
      "###..........###",
      "###..........###",
      "###..........###",
      "###..........###",
      "###..........###",
      "###..........###",
      "################",
    ];
    // R5-A7: col 13, not 14 — the screen box (sim W0-F7) walls off the last
    // two columns, and the model now knows it. And the ring bridges only for
    // a child who HOLDS the swing verb: sim.ts passes ringAt gated on the
    // ability, so an ability-less model reach was a lie.
    const noRing = reachableCells(rows.map((r) => r.replace("o", ".")), ["jump", "hover", "swing"]);
    expect(noRing.has("13,4")).toBe(false); // 10 columns > the hover envelope
    const withRing = reachableCells(rows, ["jump", "hover", "swing"]);
    expect(withRing.has("13,4")).toBe(true);
    const noVerb = reachableCells(rows, ["jump", "hover"]);
    expect(noVerb.has("13,4")).toBe(false); // the ring is scenery without swing
  });

  it("R5-A7 · path-honest edges: no fall through backing, no jump through walls, no ghost columns", () => {
    // a fully walled pocket under the start platform — the old fall edge
    // tunnelled straight through the floor underfoot (the shipped-p3 class
    // behind doc 45 A7's sealed G)
    const pocket = [
      "................",
      "..S.............",
      ".#####..........",
      "..#..#..........",
      "..#..#..........",
      "..#..#..........",
      "################",
    ];
    const sealed = reachableCells(pocket, ["jump"]);
    expect(sealed.has("3,5"), "the pocket floor is sealed — reaching it means tunnelling").toBe(false);
    expect(sealed.has("4,5")).toBe(false);

    // a full-height wall between start and a shelf within jump range: the old
    // jump edge tunnelled it
    const walled = [
      "....#...........",
      "....#...........",
      "..S.#...........",
      "....#..##.......",
      "....#...........",
      "################",
    ];
    const w2 = reachableCells(walled, ["jump"]);
    expect(w2.has("7,2"), "no jump through a full-height wall").toBe(false);
    expect(w2.has("8,2")).toBe(false);

    // column 0 and the last two columns: the screen box makes them
    // physically unenterable — a treasure there is a ghost
    const edges = [
      "................",
      "..S.............",
      "################",
    ];
    const e2 = reachableCells(edges, ["jump"]);
    expect(e2.has("0,1"), "column 0 is outside the screen box").toBe(false);
    expect(e2.has("14,1"), "the second-to-last column too").toBe(false);
    expect(e2.has("13,1")).toBe(true); // the box ends exactly there
  });

  it("R5-A7 (verify wave) · the fall sweeps a CONE — no horizontal tunnel, no head-slot", () => {
    // a full-height wall right of the start; a chamber floor behind it —
    // the old landing-column-only check let the drift tunnel THROUGH the wall
    const walled = [
      "................",
      "..S..#..........",
      ".....#..........",
      ".....#..........",
      ".....#..........",
      ".....#..........",
      "################",
    ];
    const w = reachableCells(walled, ["jump"]);
    expect(w.has("7,5"), "no fall-drift through a full wall").toBe(false);
    expect(w.has("9,5")).toBe(false);

    // a 1-tile slot at standing height: the body is TWO tiles — the old
    // foot-row-only crossing squeezed through it
    const slot = [
      "....##..........",
      "..S.............",
      "################",
    ];
    const s = reachableCells(slot, ["jump"]);
    expect(s.has("6,1"), "no crossing through a one-tile head slot").toBe(false);

    // …and drifting AROUND a ledge beside the drop stays legal (the cone
    // opens with depth — author-generous, physics-honest)
    const around = [
      "................",
      "..S.............",
      "####............",
      "................",
      "................",
      "################",
    ];
    const a = reachableCells(around, ["jump"]);
    expect(a.has("2,4"), "dropping around one's own ledge is legal").toBe(true);
  });

  it("standable respects support and headroom (the world edge is solid)", () => {
    const rows = ["....", "....", "..#.", "..#.", "####"];
    expect(standable(rows, 0, 3)).toBe(true); // floor top
    expect(standable(rows, 2, 1)).toBe(true); // atop the pillar
    expect(standable(rows, 2, 3)).toBe(false); // inside the pillar
    expect(standable(rows, 0, -1)).toBe(false); // above the world: no headroom
  });
});

describe("checkLevelLaws", () => {
  it("passes the draft toy shape and fails a floating exit (tamper)", () => {
    expect(checkLevelLaws(parsePaintLevel(level(OK_ROWS)))).toEqual([]);
    const gutted = [...OK_ROWS];
    gutted[17] = "..S....*...."; // exit moved unreachably high
    gutted[5] = "..........X.";
    const fails = checkLevelLaws(parsePaintLevel(level([...gutted])));
    expect(fails.some((f) => f.law === "exit-reachable")).toBe(true);
  });

  it("flags unreachable letters", () => {
    const rows = [
      "############",
      ...Array.from({ length: 7 }, () => "............"),
      "*...........",
      ...Array.from({ length: 8 }, () => "............"),
      "..S.......X.",
      "############",
      "############",
    ];
    const fails = checkLevelLaws(parsePaintLevel(level(rows)));
    expect(fails.some((f) => f.law === "collectible-reachable")).toBe(true);
  });

  it("enforces the chapter shape on non-drafts (3 phases, ≥1 cage, 1 classmate)", () => {
    const strict = level(OK_ROWS, { draft: false });
    const fails = checkLevelLaws(strict);
    expect(fails.some((f) => f.law === "phase-count")).toBe(true);
    expect(fails.some((f) => f.law === "cage-law")).toBe(true); // no cage at all
    expect(fails.some((f) => f.law === "classmate-cage")).toBe(true); // and so no classmate
  });

  // R4 · doc 44 §2.3 · THE CAGE LAW. The count is gone; what the law still holds
  // the chapter to is the classmate — exactly one, and findable by every child.
  describe("the cage law (doc 44 §2.3)", () => {
    /** A lawful non-draft chapter: 3 phases, one classmate cage in the field. */
    const chapter = (over: Partial<PaintLevel> = {}): PaintLevel => {
      const cage = (id: string, extra: Record<string, unknown> = {}) => ({
        id, role: "cage" as const, skin: "satchel", c: 3, r: 17, tier: "E" as const,
        // R5-C1: every cage names its captive, so the lawful fixture does too.
        params: { captiveDe: id }, ...extra,
      });
      // PK-R6 · D: a person-cage is only half of the rescue — the `classmate`
      // entity who steps out of it is the other half, and the `classmate-pair`
      // law now demands both. So the lawful fixture carries both.
      const mate = (id: string, cageId: string, extra: Record<string, unknown> = {}) => ({
        id, role: "classmate" as const, skin: "merle", c: 4, r: 17, tier: "E" as const,
        params: { cage: cageId, hidden: true }, ...extra,
      });
      return level(OK_ROWS, {
        draft: false,
        chapter: "ch01", // a chapter the cloak still covers — see the copy laws below
        phases: [
          phase(OK_ROWS, { id: "p1", exit: { to: "p2" }, entities: [cage("merle", { params: { classmate: "merle", captiveDe: "Merle" } }), mate("merle-kid", "merle")] }),
          phase(OK_ROWS, { id: "p2", exit: { to: "p3" } }),
          phase(OK_ROWS, { id: "p3", exit: { to: "boss" } }),
        ] as PaintLevel["phases"],
        ...over,
      });
    };
    const laws = (l: PaintLevel): string[] => checkLevelLaws(parsePaintLevel(l)).map((f) => f.law);

    it("passes a chapter with ONE cage — the count is no longer a law", () => {
      expect(laws(chapter())).toEqual([]);
    });

    it("passes any number of extra being-cages beside the classmate's", () => {
      const many = chapter();
      many.phases[1]!.entities = [
        { id: "bag1", role: "cage", skin: "satchel", c: 3, r: 17, tier: "E", params: { captiveDe: "das Tablet" } },
        { id: "bag2", role: "cage", skin: "satchel", c: 5, r: 17, tier: "E", params: { captiveDe: "der Stuhl" } },
        { id: "bag3", role: "cage", skin: "satchel", c: 7, r: 17, tier: "E", params: { captiveDe: "das Klassenfoto" } },
      ];
      expect(laws(many)).toEqual([]);
    });

    it("fails a chapter with no cage at all", () => {
      const none = chapter();
      none.phases[0]!.entities = [];
      expect(laws(none)).toContain("cage-law");
    });

    it("fails a SECOND classmate — including one hidden in the arena the old count never saw", () => {
      const twoInField = chapter();
      twoInField.phases[1]!.entities = [{ id: "fenn", role: "cage", skin: "satchel", c: 5, r: 17, tier: "E", params: { classmate: "fenn" } }];
      expect(laws(twoInField)).toContain("classmate-cage");

      const inArena = chapter({
        arena: phase(OK_ROWS, {
          id: "p4",
          entities: [{ id: "fenn", role: "cage", skin: "satchel", c: 5, r: 17, tier: "E", params: { classmate: "fenn" } }],
        }) as PaintLevel["phases"][number],
      });
      expect(laws(inArena)).toContain("classmate-cage");
    });

    it("fails a classmate who is not findable by everyone (hidden, or behind the paid bonus door)", () => {
      const hidden = chapter();
      hidden.phases[0]!.entities = [{ id: "merle", role: "cage", skin: "satchel", c: 3, r: 17, tier: "E", params: { classmate: "merle", hidden: true } }];
      expect(laws(hidden)).toContain("classmate-cage");

      const inBonus = chapter({
        bonus: phase(OK_ROWS, {
          id: "p9",
          exit: { to: "p1" },
          entities: [{ id: "merle", role: "cage", skin: "satchel", c: 3, r: 17, tier: "E", params: { classmate: "merle" } }],
        }) as PaintLevel["phases"][number],
      });
      inBonus.phases[0]!.entities = []; // the ONLY classmate now sits behind Klecks' door
      expect(laws(inBonus)).toContain("classmate-cage");
    });

    // ── PK-R6 · D · THE CLASSMATE PAIR (doc 44 §3.3) ────────────────────────
    // The cage and the person in it are one rescue in two entities. Every way
    // the pair can be half-declared is a level that loads, renders and lies:
    // the latch opens onto an empty spot, or a girl waits in a phase her cage
    // is not in, and the chapter's one rescue silently becomes a shrug.
    describe("the classmate pair", () => {
      it("fails a person-cage with nobody to step out of it", () => {
        const lonely = chapter();
        lonely.phases[0]!.entities = lonely.phases[0]!.entities.filter((e) => e.role !== "classmate");
        expect(laws(lonely)).toContain("classmate-pair");
      });

      it("fails TWO people pointing at the same cage", () => {
        const crowd = chapter();
        crowd.phases[0]!.entities.push({
          id: "merle-twin", role: "classmate", skin: "merle", c: 6, r: 17, tier: "E",
          params: { cage: "merle", hidden: true },
        });
        expect(laws(crowd)).toContain("classmate-pair");
      });

      it("fails a classmate who declares no cage, or one that is not a person-cage", () => {
        const orphan = chapter();
        orphan.phases[0]!.entities[1]!.params = { hidden: true };
        expect(laws(orphan)).toContain("classmate-pair");

        const wrong = chapter();
        wrong.phases[0]!.entities[1]!.params = { cage: "nobody", hidden: true };
        expect(laws(wrong)).toContain("classmate-pair");
      });

      it("fails a classmate standing in a different phase from her cage", () => {
        const apart = chapter();
        apart.phases[0]!.entities = [apart.phases[0]!.entities[0]!]; // cage stays in p1
        apart.phases[1]!.entities = [{
          id: "merle-kid", role: "classmate", skin: "merle", c: 4, r: 17, tier: "E",
          params: { cage: "merle", hidden: true },
        }];
        expect(laws(apart)).toContain("classmate-pair");
      });

      it("fails a classmate spawned in mid-air — she stands there all chapter", () => {
        const floating = chapter();
        floating.phases[0]!.entities[1]!.r = 10;
        expect(laws(floating)).toContain("spawn-standable");
      });
    });

    // ── R5-C1 · THE CAPTIVE LAW ────────────────────────────────────────────
    // Koki's replay, 07:26:19: the cage-hint card said „Da steckt JEMAND fest"
    // over a cage holding a sound system, and the liberation card called every
    // freed thing a „Buchstaben-Wesen". Both were possible because a cage
    // declared nothing but a shell: the ceremony had no way to know what it had
    // just opened. `captiveDe` is that missing datum, and this law is what stops
    // the next chapter from shipping the same silence.
    describe("the captive law", () => {
      it("fails a cage that declares no captive — the ceremony would have to guess", () => {
        const mute = chapter();
        mute.phases[1]!.entities = [
          { id: "bag1", role: "cage", skin: "satchel", c: 3, r: 17, tier: "E" },
        ];
        expect(laws(mute)).toContain("cage-captive");
      });

      it("fails a captive too long to sit inside a card line", () => {
        const windy = chapter();
        windy.phases[1]!.entities = [
          { id: "bag1", role: "cage", skin: "satchel", c: 3, r: 17, tier: "E", params: { captiveDe: "x".repeat(57) } },
        ];
        expect(laws(windy)).toContain("cage-captive");
      });

      it("fails a captive in the wrong register — it is read aloud to a six-year-old", () => {
        const scary = chapter();
        scary.phases[1]!.entities = [
          { id: "bag1", role: "cage", skin: "satchel", c: 3, r: 17, tier: "E", params: { captiveDe: "das Monster" } },
        ];
        expect(laws(scary)).toContain("cage-captive");
      });

      it("fails two cages holding the same captive — that is a census defect", () => {
        const twins = chapter();
        twins.phases[1]!.entities = [
          { id: "bag1", role: "cage", skin: "satchel", c: 3, r: 17, tier: "E", params: { captiveDe: "das Tablet" } },
          { id: "bag2", role: "cage", skin: "satchel", c: 5, r: 17, tier: "E", params: { captiveDe: "das Tablet" } },
        ];
        expect(laws(twins)).toContain("cage-captive");
      });

      it("fails a captive declared on something that is not a cage — a stray field is a typo", () => {
        const stray = chapter();
        stray.phases[1]!.entities = [
          { id: "run1", role: "chaser", skin: "pencil", c: 3, r: 17, tier: "E", params: { captiveDe: "der Stuhl" } },
        ];
        expect(laws(stray)).toContain("cage-captive");
      });
    });

    // ── R5-C1 · THE CHAPTER-COPY LAWS ──────────────────────────────────────
    // The goal card carried „OSWINs Tinte…" past every gate in the repo,
    // because the chapter's own German — its longest player-facing strings —
    // was policed by nothing at all. It is policed here now, beside the
    // Regel-Seite copy laws, on the same three axes: the cloak, the register,
    // and how long a line may be before a child stops listening.
    describe("the chapter-copy laws", () => {
      const CLOAKED = "OSWIN";
      // The fixture's own chapter matters here and nowhere else: the cloak is a
      // COMPARISON against ch15, so a test chapter numbered above it would lift
      // the cloak and every assertion below would pass for the wrong reason.
      // (It did, on the first run — the base fixture is „ch99".)

      it("fails the antagonist's name in ANY of the chapter's own German fields", () => {
        for (const patch of [
          { goalDe: `${CLOAKED}s Tinte nahm die Farben.` },
          { whyDe: `Sag es, und ${CLOAKED} verliert.` },
          { hintsDe: ["gut", `Pass auf ${CLOAKED} auf!`] },
          { name: `Das Haus von ${CLOAKED}` },
          { collectNounDe: `${CLOAKED}-Buchstaben` },
        ]) {
          expect(laws(chapter(patch)), `the cloak must hold for ${Object.keys(patch)[0]}`).toContain("chapter-copy");
        }
      });

      it("fails the antagonist's name in a PHASE name too", () => {
        const named = chapter();
        named.phases[1]!.nameDe = `${CLOAKED}s Flur`;
        expect(laws(named)).toContain("chapter-copy");
      });

      it("is a COMPARISON, not a whitelist — a chapter numbered past the unmask is not accidentally cloaked", () => {
        expect(laws(chapter({ chapter: "ch14", goalDe: `${CLOAKED} war hier.` }))).toContain("chapter-copy");
      });

      it("LETS the name through once the cloak lifts — this is a cloak, not a ban", () => {
        expect(laws(chapter({ chapter: "ch15", goalDe: `${CLOAKED} steht am Ende.` }))).toEqual([]);
      });

      it("fails a hint too long to read out in one breath", () => {
        expect(laws(chapter({ hintsDe: ["x".repeat(79)] }))).toContain("chapter-copy");
      });

      it("fails a goal card whose SENTENCE runs long, even when the card as a whole fits", () => {
        const oneBreath = "Das Haus ist grau.";
        const marathon = `${"Sag jedem Ding, wer es ist, und dann noch einmal, und weiter".padEnd(79, "!")}.`;
        expect(laws(chapter({ goalDe: `${oneBreath} ${marathon}` }))).toContain("chapter-copy");
      });

      it("fails threat vocabulary anywhere in the chapter's German", () => {
        expect(laws(chapter({ whyDe: "Ein böser Fleck frisst die Farbe." }))).toContain("chapter-copy");
      });

      it("passes the fields as the shipped chapters actually write them", () => {
        expect(laws(chapter({
          name: "Zeit für die Schule — Das Schulhaus ohne Farbe",
          goalDe: "Der Tinten-Schatten hat dem Schulhaus die Farben genommen. Fünf stecken in Käfigen — mach sie alle wieder frei.",
          whyDe: "Das Buch versteht Englisch: Wer es richtig sagt, holt die Farbe zurück.",
          hintsDe: ["Springen: SPACE — halten für höher!"],
        }))).toEqual([]);
      });
    });
  });

  it("W0-F3: flags a trap pocket (enterable, no way back to the exit)", () => {
    const F = "############";
    const W = "####....####"; // pit walls
    const deck = "..S......X..";
    const air = (n: number) => Array.from({ length: n }, () => "............");
    // a 7-deep pit: falling in = softlock (jump-out is 4 rows max)
    const trapped = [F, ...air(10), deck, W, W, W, W, W, W, W, F, F];
    const fails = checkLevelLaws(parsePaintLevel(level(trapped)));
    expect(fails.some((f) => f.law === "trap-pocket")).toBe(true);
    // a 3-deep pit is jump-out-able — lawful
    const shallow = [F, ...air(10), deck, W, W, W, F, F, F, F, F, F];
    const okFails = checkLevelLaws(parsePaintLevel(level(shallow)));
    expect(okFails.some((f) => f.law === "trap-pocket")).toBe(false);
  });

  it("W0-F7/F8: enforces the closed top and the minimum height", () => {
    const open = [...OK_ROWS];
    open[0] = "............";
    expect(checkLevelLaws(parsePaintLevel(level(open))).some((f) => f.law === "closed-top")).toBe(true);
    const short = OK_ROWS.slice(0, 8).concat(["..S....*..X.", "############"]);
    short[0] = "############";
    expect(checkLevelLaws(parsePaintLevel(level([...short]))).some((f) => f.law === "min-height")).toBe(true);
  });

  it("findGlyph locates markers", () => {
    expect(findGlyph(OK_ROWS, "S")).toEqual({ c: 2, r: 17 });
    expect(findGlyph(OK_ROWS, "B")).toBeNull();
  });
});

// ── PB-T1 · the slope laws + spawn law (red-first tamper block) ──────────────

describe("PB-T1 · slope laws", () => {
  const withRow = (r: number, row: string): string[] => {
    const rows = [...OK_ROWS];
    rows[r] = row;
    return rows;
  };

  it("a free-standing wedge fails slope-backing", () => {
    // `/` floating mid-air (nothing solid below it) — the escape-ramp class
    const rows = withRow(10, "..../.......");
    const f = checkLevelLaws(parsePaintLevel(level(rows)));
    expect(f.some((x) => x.law === "slope-backing")).toBe(true);
  });

  it("a ramp carved into mass passes", () => {
    const rows = withRow(16, "..../#######");
    rows[17] = "..S#####*.X.";
    const f = checkLevelLaws(parsePaintLevel(level(rows)));
    expect(f.some((x) => x.law === "slope-backing")).toBe(false);
    expect(f.some((x) => x.law === "slope-pairing")).toBe(false);
  });

  it("30° halves must come as adjacent pairs", () => {
    const rows = withRow(16, "....1.......");
    rows[17] = "..S.#..*..X.";
    const f = checkLevelLaws(parsePaintLevel(level(rows)));
    expect(f.some((x) => x.law === "slope-pairing")).toBe(true);
    const paired = withRow(16, "....12......");
    paired[17] = "..S.##.*..X.";
    const f2 = checkLevelLaws(parsePaintLevel(level(paired)));
    expect(f2.some((x) => x.law === "slope-pairing")).toBe(false);
  });

  it("walkers must spawn standing on solid", () => {
    const bad = level(OK_ROWS, {
      phases: [phase(OK_ROWS, {
        entities: [{ id: "e1", role: "chaser", skin: "pencil", c: 5, r: 8, tier: "E" }], // mid-air
      }) as PaintLevel["phases"][number]],
    });
    expect(checkLevelLaws(parsePaintLevel(bad)).some((x) => x.law === "spawn-standable")).toBe(true);
    const good = level(OK_ROWS, {
      phases: [phase(OK_ROWS, {
        entities: [{ id: "e1", role: "chaser", skin: "pencil", c: 5, r: 17, tier: "E" }], // on the floor
      }) as PaintLevel["phases"][number]],
    });
    expect(checkLevelLaws(parsePaintLevel(good)).some((x) => x.law === "spawn-standable")).toBe(false);
  });
});

// ── PB-T2 · THE ENVELOPE LAW: the model may never out-promise the engine ─────
// The reachability constants are an UNDER-approximation of real physics: a
// too-small envelope only annoys authors; a too-big one blesses unreachable
// exits (the p3 class). These tests DERIVE the physics from the real player
// machine and assert the direction. A feel change that shrinks the engine
// below the model turns this red — exactly when the model must be retuned.

describe("PB-T2 · envelope law (derived from stepPlayer)", () => {
  const W = 60;
  const room = (floorRow: number, h = 30): string[] => [
    "#".repeat(W),
    ...Array.from({ length: floorRow - 1 }, () => ".".repeat(W)),
    "#".repeat(W),
    ...Array.from({ length: h - floorRow - 1 }, () => "#".repeat(W)),
  ];
  const pad = (over: Partial<Pad>): Pad => ({ ...IDLE_PAD, ...over });
  const opts = { canRun: true, canHover: false, canPunch: false, canHang: false, fistBusy: false, ringAt: null } as const;

  it("hold-jump rise ≥ JUMP_UP rows", () => {
    const grid = room(25);
    let st = spawnPlayer(20 * TILE, 25 * TILE);
    let prev = pad({});
    let minY = st.y;
    for (let t = 0; t < 120; t++) {
      const p = pad({ jump: true });
      st = stepPlayer(st, p, prev, grid, opts).st;
      prev = p;
      minY = Math.min(minY, st.y);
    }
    const riseRows = Math.floor((25 * TILE * SUBS - minY) / SUBS / TILE);
    expect(riseRows).toBeGreaterThanOrEqual(REACH_ENVELOPE.JUMP_UP);
  });

  it("running jump crosses ≥ JUMP_DX columns on the flat", () => {
    const grid = room(25);
    let st = spawnPlayer(10 * TILE, 25 * TILE);
    let prev = pad({});
    // build run momentum, then jump
    for (let t = 0; t < 40; t++) { const p = pad({ right: true }); st = stepPlayer(st, p, prev, grid, opts).st; prev = p; }
    const x0 = st.x;
    let airborne = false;
    for (let t = 0; t < 200; t++) {
      const p = pad({ right: true, jump: true });
      st = stepPlayer(st, p, prev, grid, opts).st;
      prev = p;
      if (!st.grounded) airborne = true;
      if (airborne && st.grounded) break;
    }
    const cols = Math.floor((st.x - x0) / SUBS / TILE);
    expect(cols).toBeGreaterThanOrEqual(REACH_ENVELOPE.JUMP_DX);
  });

  it("run-off fall drift ≥ the model's fallDx at each depth", () => {
    for (const depth of [2, 4, 6, 8]) {
      // a shelf ending mid-room, floor `depth` rows below its top
      const shelfRow = 12;
      const floorRow = shelfRow + depth;
      const grid = [
        "#".repeat(W),
        ...Array.from({ length: shelfRow - 1 }, () => ".".repeat(W)),
        "#".repeat(20) + ".".repeat(W - 20), // shelf ends at c19
        ...Array.from({ length: floorRow - shelfRow - 1 }, () => ".".repeat(W)),
        "#".repeat(W),
        "#".repeat(W),
      ];
      let st = spawnPlayer(10 * TILE, shelfRow * TILE);
      let prev = pad({});
      const lipX = 20 * TILE * SUBS;
      for (let t = 0; t < 600 && !(st.grounded && st.y >= floorRow * TILE * SUBS - SUBS); t++) {
        const p = pad({ right: true });
        st = stepPlayer(st, p, prev, grid, opts).st;
        prev = p;
      }
      const driftCols = Math.floor((st.x - lipX) / SUBS / TILE);
      const modelDx = Math.min(REACH_ENVELOPE.FALL_DX_CAP, 1 + Math.floor(depth * REACH_ENVELOPE.FALL_DRIFT_PER_ROW));
      expect(driftCols, `depth ${depth}: engine drifted ${driftCols} cols < model ${modelDx}`).toBeGreaterThanOrEqual(modelDx);
    }
  });

  it("hover crossing ≥ HOVER_DX columns", () => {
    const grid = room(25);
    let st = spawnPlayer(5 * TILE, 25 * TILE);
    let prev = pad({});
    for (let t = 0; t < 30; t++) { const p = pad({ right: true }); st = stepPlayer(st, p, prev, grid, { ...opts, canHover: true }).st; prev = p; }
    const x0 = st.x;
    let airborne = false;
    for (let t = 0; t < 600; t++) {
      const p = pad({ right: true, jump: true }); // hold = hover glide
      st = stepPlayer(st, p, prev, grid, { ...opts, canHover: true }).st;
      prev = p;
      if (!st.grounded) airborne = true;
      if (airborne && st.grounded) break;
    }
    const cols = Math.floor((st.x - x0) / SUBS / TILE);
    expect(cols).toBeGreaterThanOrEqual(REACH_ENVELOPE.HOVER_DX);
  });
});

  it("R5-P1 · Sweep-Zellen einer geboardeten Plattform sind seen-Knoten (Fahrt-Anker)", () => {
    // Plattform pendelt über einer Grube; ihre Sweep-Zellen müssen in `seen`
    // landen, damit Buchstaben ÜBER der Fahrt die Toleranz-Gesetze bestehen
    const rows = [
      "................",
      "..S.............",
      "####........####",
      "................",
      "................",
      "################",
    ];
    const ents = [{ id: "m1", role: "platform.move", skin: "ruler", c: 6, r: 2, tier: "E", params: { dxTiles: 4, periodTicks: 200 } }] as never;
    const seen = reachableCells(rows, ["jump"], ents);
    // Sweep-Reihe der Plattform (Deck-Steh-Zellen) muss enthalten sein
    const sweepHit = [...seen].some((k) => {
      const [c, r] = k.split(",").map(Number) as [number, number];
      return r === 2 && c >= 6 && c <= 10; // die Plattform-eigene Reihe — Toleranzen ankern von hier
    });
    expect(sweepHit, "mindestens eine Sweep-Zelle ist seen-Knoten").toBe(true);
  });

  it("R5-P1 · kein Eck-Clip durch eine Ein-Reihen-Platte in die Leere darunter", () => {
    // Stand AUF einer Ein-Reihen-Platte über einer versiegelten Grube: der
    // Abtritt ist horizontal (Gehreihe), eine Stütze direkt unter der ersten
    // Nachbar-Spalte fängt den Fall DORT — der alte Drift-Eintritt ließ den
    // Körper diagonal durch die Plattenkante in die Grube clippen (p3-Fund:
    // Spitzer-Tasche, trap-pocket (20,25))
    // exakt die p3-Form: Boden-Masse westlich, Ein-Reihen-Platte c3–4,
    // Auslauf einen Schritt tiefer östlich — die Leere unter der Platte ist
    // von ALLEN Seiten versiegelt (c2-Masse west, c5-Masse ost, Platte oben)
    const rows = [
      "............",
      "..S.........",
      "#####.......",
      "###..#######",
      "###..#######",
      "###..#######",
      "###..#######",
      "###..#######",
    ];
    const seen = reachableCells(rows, ["jump"]);
    expect(seen.has("3,1"), "auf der Platte stehen geht").toBe(true);
    expect(seen.has("5,2"), "der Δr1-Abstieg auf den Auslauf geht").toBe(true);
    expect(seen.has("3,7"), "Leere unterm Platten-West = Clip").toBe(false);
    expect(seen.has("4,7"), "Leere unterm Platten-Ost = Clip").toBe(false);
  });

  it("R5-P1 · Tinten-Becken ist KEIN trap-pocket — die Tinte selbst ist der Rückweg (sim-Warp)", () => {
    // p3-Klasse: ein Becken, dessen Wände zu hoch zum Herausspringen sind.
    // Mit Tinten-Boden legal (Kontakt mit »w« warpt zum Checkpoint,
    // sim.ts) — mit solidem Boden bleibt es der Softlock, den das Gesetz
    // fangen muss. Stacheln warpen NICHT und bleiben dem Gesetz unterworfen.
    const basin = (floor: string) => [
      "####################",
      ...Array.from({ length: 12 }, () => "...................."),
      // Der Checkpoint gehört auf das OSTUFER der Tinte (B1-Doktrin, c12 liegt
      // im Fenster c12–15) — sonst schlägt hier `checkpoint-count` an und
      // verrauscht einen Test, der von Taschen handelt. Ohne Tinte im Boden
      // gibt es keine Passage, also auch keinen Checkpoint.
      floor.includes("w") ? "..S.*.......C.X....." : "..S.*.........X.....",
      "######......########",
      "######......########",
      "######......########",
      "######......########",
      "######......########",
      `######${floor}########`,
      "####################",
    ];
    const inky = parsePaintLevel(level(basin("wwwwww")));
    expect(checkLevelLaws(inky).filter((f) => f.law === "trap-pocket"),
      "Tinten-Boden ist kein Softlock — die Tinte warpt zurück").toEqual([]);
    const solid = parsePaintLevel(level(basin("######")));
    expect(checkLevelLaws(solid).some((f) => f.law === "trap-pocket"),
      "solider Becken-Boden bleibt Softlock").toBe(true);
    // Stacheln warpen NICHT (sim.ts ist glyph-genau auf »w«) — ein
    // Stachel-Boden bleibt dem Gesetz unterworfen, egal wie tief
    const spiky = parsePaintLevel(level(basin("^^^^^^")));
    expect(checkLevelLaws(spiky).some((f) => f.law === "trap-pocket"),
      "Stacheln sind kein Rückweg").toBe(true);
  });

  // ── B1 · W0-F3 v2 · DIE TROCKENE TASCHE ────────────────────────────────────
  // Kokis Replay 2026-08-11 hat die R5-P1-Lesart am p1-Keller widerlegt: er
  // stand auf dem Buchdeckel, kam nur noch runter, und der EINZIGE Ausweg war,
  // in ein Hindernis zu laufen, dem man nicht ansieht, dass es ein Ausgang ist.
  // Seitdem trennt das Gesetz zwei Dinge, die R5-P1 in einen Topf warf:
  // eine Gefahr, in der man STEHT (der Warp feuert von selbst) und eine
  // Gefahr, die man WÄHLEN muss (Softlock, außer die Phase deklariert sie).
  describe("B1 · trockene Tasche vs. deklarierter Tinten-Dunk", () => {
    // Becken c6–11: Boden c6–9 solide (trockene Standzellen r19), c10–11 Tinte.
    // Exakt die p1-Keller-Form — trocken stehen, Tinte einen Schritt entfernt.
    const basin = (floor: string) => [
      "####################",
      ...Array.from({ length: 12 }, () => "...................."),
      // Der Checkpoint gehört auf das OSTUFER der Tinte (B1-Doktrin, c12 liegt
      // im Fenster c12–15) — sonst schlägt hier `checkpoint-count` an und
      // verrauscht einen Test, der von Taschen handelt. Ohne Tinte im Boden
      // gibt es keine Passage, also auch keinen Checkpoint.
      floor.includes("w") ? "..S.*.......C.X....." : "..S.*.........X.....",
      "######......########",
      "######......########",
      "######......########",
      "######......########",
      "######......########",
      `######${floor}########`,
      "####################",
    ];
    // Knoten = Füße AUF Reihe r+1 — der Becken-Boden liegt auf Reihe 19, die
    // trockenen Standzellen also auf r18; die Tinten-Zellen c10–11 tragen ihre
    // Knoten eine Reihe tiefer (Welt-Boden r20 stützt sie).
    const DRY = ["6,18", "7,18", "8,18", "9,18"] as const;
    const dive = (cells: readonly string[], whyDe = "Keller-Tasche: der Tinten-Dunk IST der Rückweg (Krakel).") =>
      cells.map((k) => {
        const [c, r] = k.split(",").map(Number) as [number, number];
        return { c, r, whyDe };
      });
    const withDives = (floor: string, cells: readonly string[], whyDe?: string) => {
      const lvl = level(basin(floor));
      lvl.phases[0]!.inkReturns = dive(cells, whyDe);
      return parsePaintLevel(lvl);
    };
    const laws = (l: PaintLevel) => checkLevelLaws(l).map((f) => f.law);

    it("DIE UMKEHR: trocken stehen mit Tinte in Reichweite ist wieder ein Softlock", () => {
      // Diese Zusicherung stand bis 2026-08-11 auf GRÜN („Becken mit
      // erreichbarer Tinte ist kein Softlock") und war der Freibrief, unter
      // dem die p1-Grube durch jedes Gate kam.
      const fails = checkLevelLaws(parsePaintLevel(level(basin("####ww"))));
      const pocket = fails.filter((f) => f.law === "trap-pocket");
      expect(pocket.length, "die trockene Tasche fällt jetzt durch").toBe(1);
      expect(pocket[0]!.detail, "und sagt WARUM, samt Reparatur-Weg").toMatch(/only way out is the ink.*inkReturns/);
    });

    it("der deklarierte Tinten-Dunk besteht — mit einer Zeile je trockener Standzelle", () => {
      expect(laws(withDives("####ww", DRY))).toEqual([]);
    });

    it("TAMPER: eine Deklaration, die eine Zelle daneben zeigt, rettet nichts", () => {
      // (5,18) liegt in der Beckenwand, nicht in der Tasche
      const off = laws(withDives("####ww", ["5,18", "7,18", "8,18", "9,18"]));
      expect(off, "die undeklarierte Zelle fällt weiter durch").toContain("trap-pocket");
      expect(off, "und die Fehl-Deklaration meldet sich selbst").toContain("ink-return");
    });

    it("TAMPER: eine Deklaration ohne Tinte in Reichweite ist keine Ausrede", () => {
      const dryFloor = laws(withDives("######", DRY));
      expect(dryFloor).toContain("trap-pocket");
      expect(dryFloor).toContain("ink-return");
    });

    it("TAMPER: eine veraltete Deklaration überlebt die Tasche nicht, die sie entschuldigt hat", () => {
      // Becken geheilt (Tinten-Boden = Gate A trägt), Deklaration blieb stehen
      const stale = checkLevelLaws(withDives("wwwwww", DRY));
      expect(stale.every((f) => f.law === "ink-return"), "nur noch die Ausrede ist übrig").toBe(true);
      expect(stale.length, "jede der vier toten Zeilen wird benannt").toBe(4);
    });

    it("parsePaintLevel wirft laut auf leerem whyDe, Doppel-Zelle und Off-Grid", () => {
      expect(() => withDives("####ww", DRY, "   ")).toThrow(/whyDe/);
      expect(() => withDives("####ww", ["7,18", "7,18"])).toThrow(/duplicate inkReturns/);
      expect(() => withDives("####ww", ["99,18"])).toThrow(/off-grid/);
    });
  });

  // ── B1 · DIE CHECKPOINT-DOKTRIN (Koki, 2026-08-11) ─────────────────────────
  // »Checkpoints gehören NACH schwere Abschnitte, nie davor.« Das dreht das
  // Kochbuch (§2, §8 Gebot 6) um — und weil nur TINTE warpt (sim.ts ist
  // glyph-genau auf »w«), ist die Tinten-Passage die einzige Schwierigkeit,
  // gegen die ein Checkpoint ehrlich gemessen werden kann.
  describe("B1 · Checkpoints stehen NACH der Tinten-Passage", () => {
    // Welt 20 breit: Boden r19/r20 mit Tinten-Lauf c8–10; Steh-Reihe 18;
    // Spawn c2, Exit c17 → Fenster für den Checkpoint = c11..c14.
    const cross = (cp: { c: number; r: number } | null, cp2: { c: number; r: number } | null = null): string[] => {
      const W = 20;
      const rows = [
        "#".repeat(W),
        ...Array.from({ length: 17 }, () => ".".repeat(W)),
        ".".repeat(W),
        `${"#".repeat(8)}www${"#".repeat(9)}`,
        `${"#".repeat(8)}www${"#".repeat(9)}`,
      ];
      const put = (r: number, c: number, g: string) => { rows[r] = rows[r]!.slice(0, c) + g + rows[r]!.slice(c + 1); };
      put(18, 2, "S");
      put(18, 17, "X");
      for (const k of [cp, cp2]) if (k) put(k.r, k.c, "C");
      return rows;
    };
    const laws = (rows: string[]): string[] => checkLevelLaws(parsePaintLevel(level(rows))).map((f) => f.law);

    it("der Checkpaint auf dem OSTUFER, dicht an der Landung, ist die Norm", () => {
      expect(laws(cross({ c: 11, r: 18 }))).toEqual([]);
      expect(laws(cross({ c: 14, r: 18 }))).toEqual([]); // die letzte erlaubte Spalte
    });

    it("DIE UMKEHR: ein Checkpoint VOR der Tinte fällt durch — wenn die Phase »far« sagt", () => {
      // R5-W5 · B4b: bis zum 17.08. war »vor der Tinte« IMMER ein Verstoß, und
      // die Meldung sagte das auch so („never before it"). Kokis Entscheid macht
      // die Seite zur Deklaration: dieselbe Zelle ist unter `"near"` richtig und
      // unter `"far"` falsch. Die Absicht dieser Prüfung bleibt damit erhalten —
      // sie prüft jetzt ausdrücklich den `"far"`-Fall (das Fixture sagt `"far"`),
      // und das Gegenstück (`"near"` grün, `"far"` rot an DERSELBEN Zelle) steht
      // als Paar in `checkpoint-silence.test.ts`.
      const f = checkLevelLaws(parsePaintLevel(level(cross({ c: 7, r: 18 }))));
      const p = f.find((x) => x.law === "checkpoint-placement");
      expect(p, "vor der Passage ist bei »far« ein Verstoß").toBeDefined();
      expect(p!.detail).toMatch(/declares checkpointSide "far".*not within \d+ columns of the landing bank/);
    });

    it("TAMPER: einen Schritt zu weit (5 statt 4 Spalten) fällt ebenfalls durch", () => {
      expect(laws(cross({ c: 14, r: 18 })), "c14 = genau am Rand").toEqual([]);
      const f = checkLevelLaws(parsePaintLevel(level(cross({ c: 15, r: 18 }))));
      // R5-W5 · B4b: die Entfernungs-Klausel ist unverändert (CHECKPOINT_AFTER_MAX),
      // nur der Wortlaut nennt jetzt die Seite mit, weil es zwei davon gibt.
      expect(f.find((x) => x.law === "checkpoint-placement")?.detail)
        .toMatch(/declares checkpointSide "far".*not within \d+ columns of the landing bank.*must stand NEXT to it, not a screen away/);
    });

    it("TAMPER: gar kein Checkpoint an einer gekreuzten Tinte fällt durch", () => {
      expect(laws(cross(null))).toContain("checkpoint-count");
    });

    it("TAMPER: zwei Checkpoints für EINE Passage fallen durch", () => {
      expect(laws(cross({ c: 11, r: 18 }, { c: 13, r: 18 }))).toContain("checkpoint-count");
    });

    it("TAMPER: ein Checkpoint in der Luft fällt durch (Krakel skizziert, wo man steht)", () => {
      const f = laws(cross({ c: 12, r: 10 }));
      expect(f).toContain("checkpoint-footing");
      expect(f, "die Spalte stimmt ja — nur der Boden fehlt").not.toContain("checkpoint-placement");
    });

    it("eine Phase ohne Tinte trägt KEINEN Checkpoint — sonst ist er Kulisse", () => {
      const noInk = [...OK_ROWS];
      noInk[17] = "..S..C.*..X.";
      const f = checkLevelLaws(parsePaintLevel(level(noInk)));
      expect(f.find((x) => x.law === "checkpoint-count")?.detail).toMatch(/crosses no ink.*scenery/);
      expect(laws([...OK_ROWS]), "und ohne Checkpoint ist sie sauber").toEqual([]);
    });
  });

// ── B3 · DIE KOPFFREIHEITS-TABELLE, aus der echten Engine abgeleitet ─────────
// `DX_BY_SKY` ist der einzige Ort, an dem das Modell noch sagt, wie weit ein
// Sprung trägt. Diese Tests leiten für JEDE Stufe die Weite aus `stepPlayer`
// ab und verlangen Modell ≤ Engine. Ein Feel-Fix, der die Sprungkraft senkt,
// macht genau die Zeile rot, die dadurch zur Lüge würde.
describe("B3 · envelope law je Kopffreiheits-Stufe (aus stepPlayer abgeleitet)", () => {
  const W = 60;
  const pad2 = (over: Partial<Pad>): Pad => ({ ...IDLE_PAD, ...over });
  const o = { canRun: true, canHover: false, canPunch: false, canHang: false, fistBusy: false, ringAt: null } as const;
  /** weiteste Weite VOM STAND unter genau `sky` freien Reihen über den Füßen */
  const reachUnderSky = (sky: number | null): number => {
    const F = 20;
    const rows: string[] = [];
    for (let r = 0; r < 27; r++) rows.push(r === 0 ? "#".repeat(W) : r >= F ? "#".repeat(W) : ".".repeat(W));
    if (sky !== null) rows[F - 1 - sky] = "#".repeat(W);
    let best = 0;
    for (const hold of [1, 2, 4, 6, 8, 10, 14, 20]) {
      let st = spawnPlayer(10 * TILE, F * TILE);
      let prev = pad2({});
      let airborne = false;
      const x0 = st.x;
      for (let t = 0; t < 300; t++) {
        const p = pad2({ right: true, jump: t < hold });
        st = stepPlayer(st, p, prev, rows, o).st;
        prev = p;
        if (!st.grounded) airborne = true;
        else if (airborne) break;
      }
      best = Math.max(best, (st.x - x0) / SUBS / TILE);
    }
    return best;
  };

  it("jede Stufe der Tabelle unterbietet die Engine (Modell ≤ Engine, IMMER)", () => {
    for (let sky = 2; sky < DX_BY_SKY.length; sky++) {
      const engine = reachUnderSky(sky);
      expect(engine, `sky ${sky}: Modell verspricht ${DX_BY_SKY[sky]}, Engine schafft ${engine.toFixed(2)}`)
        .toBeGreaterThanOrEqual(DX_BY_SKY[sky]!);
    }
    const open = reachUnderSky(null);
    expect(open, "offener Himmel").toBeGreaterThanOrEqual(REACH_ENVELOPE.JUMP_DX);
  });

  it("die Tabelle ist monoton — mehr Himmel darf nie WENIGER Weite bedeuten", () => {
    for (let i = 1; i < DX_BY_SKY.length; i++) expect(DX_BY_SKY[i]!).toBeGreaterThanOrEqual(DX_BY_SKY[i - 1]!);
  });

  it("TAMPER: eine Stufe, die mehr verspricht als die Engine kann, wäre rot", () => {
    // sky 3 misst ~2,91 Kacheln — ein Modell-Wert 3 dort wäre genau die alte
    // flache JUMP_DX-Lüge, die B2 gefunden hat.
    expect(reachUnderSky(3)).toBeLessThan(3);
    expect(DX_BY_SKY[3], "…und darum steht dort 2").toBe(2);
  });

  // Hinweis (ehrlich): ein Mini-Welt-Test für „Decke deckelt / Himmel öffnet"
  // wurde VERWORFEN statt geschönt. In einer 16 Spalten breiten Spielwelt ist
  // der Weltrand-Boden selbst ein durchgehender Korridor, über den das Ziel auf
  // einem zweiten Weg erreichbar wird — der Test hätte also etwas anderes
  // gemessen als den Sprung-Rand. Dass die Regel BEIDE Richtungen wirklich
  // bindet, ist stattdessen am echten Kapitel belegt und im Report beziffert:
  // 51 Steh-Knoten werden STRENGER (5 auf Rand 1, 46 auf Rand 2 — vorher überall
  // 3 gesegnet), 291 werden GROSSZÜGIGER (Rand 4 unter offenem Himmel), 13
  // bleiben gleich.
});

// ── R5-W5 · G4 · THE SCATTERED UNIFORM ───────────────────────────────────────
// Its own block, on purpose: the three cloth laws live in their own exported
// function (`clothLawFailures`) and are tested through `checkLevelLaws`, i.e. the
// way the gate actually calls them. Every case is a PAIR — the same world twice,
// with exactly the one property under test moved — because a case that also
// fires when the logic is wrong has proven nothing.
describe("R5-W5 · G4 · cloth laws (die verstreute Uniform)", () => {
  // a floor with a run line at r17, a bench at r16 c4-5 (so a piece on it sits
  // 2 tiles up), and an ink pocket at c10-11 so the reach law has something to bite
  const FLOOR = [
    "################",
    ...Array.from({ length: 14 }, () => "................"),
    "........##......", // r15 — the bench: a piece here sits 2 tiles above the run line
    "..S.........X...", // r16
    "................", // r17 — the run line
    "##########ww####", // r18: ink at c10-11
    "################",
  ];
  const piece = (id: string, c: number, r: number, over: Record<string, unknown> = {}) => ({
    id, role: "cloth" as const, skin: `cloth_${id}`, c, r, tier: "E" as const,
    params: { wordEn: id, ...over },
  });
  const world = (entities: unknown[], bonus?: unknown[]): PaintLevel =>
    level(FLOOR, {
      phases: [phase(FLOOR, { entities }) as PaintLevel["phases"][number]],
      ...(bonus ? { bonus: phase(FLOOR, { id: "p9", entities: bonus }) as PaintLevel["phases"][number] } : {}),
    });
  const lawsOn = (lvl: PaintLevel, law: string) =>
    checkLevelLaws(lvl).filter((f) => f.law === law).map((f) => f.detail);

  // three pieces that satisfy spacing, the jump band and the run line
  // spaced ≥6 apart, one in the jump band (the bench), one on the run line, and
  // none of them within a tile of the ink at c10-11
  const THREE = [piece("shoe", 2, 17), piece("hairband", 9, 15), piece("shirt", 15, 17)];

  it("a lawful floor is silent", () => {
    const f = checkLevelLaws(world(THREE)).filter((x) => x.law.startsWith("cloth-"));
    expect(f).toEqual([]);
  });

  it("cloth-honesty · a piece without its word is red — the toast would be empty", () => {
    const broken = [{ ...piece("shirt", 12, 17), params: {} }, piece("hairband", 4, 15), piece("shoe", 2, 17)];
    expect(lawsOn(world(broken), "cloth-honesty").join(" ")).toMatch(/carries no params.wordEn/);
  });

  it("cloth-honesty · the same word twice on the floors is red (the third-find card would ask a banked word)", () => {
    const twice = [piece("shirt", 12, 17), { ...piece("shirt", 4, 15), id: "shirt2" }, piece("shoe", 2, 17)];
    expect(lawsOn(world(twice), "cloth-honesty").join(" ")).toMatch(/lies on the floors twice/);
  });

  it("cloth-honesty · a typo in a params key is red (it reaches the child as a missing word)", () => {
    const typo = [piece("shirt", 12, 17, { wordDe: "Hemd" }), piece("hairband", 4, 15), piece("shoe", 2, 17)];
    expect(lawsOn(world(typo), "cloth-honesty").join(" ")).toMatch(/unknown params field/);
  });

  // ── the Nachlese pair: the SAME twin, once pointing home and once not ───────
  it("cloth-honesty · a p9 twin that names its original is silent", () => {
    const twin = [{ ...piece("shirt", 6, 17, { repeatOf: "shirt" }), id: "p9-shirt" }];
    expect(lawsOn(world(THREE, twin), "cloth-honesty")).toEqual([]);
  });

  it("cloth-honesty · …and the same twin pointing at nothing is red (the ledger could never silence it)", () => {
    const twin = [{ ...piece("shirt", 6, 17, { repeatOf: "nicht-da" }), id: "p9-shirt" }];
    expect(lawsOn(world(THREE, twin), "cloth-honesty").join(" ")).toMatch(/which is no uniform piece on any floor/);
  });

  it("cloth-honesty · a twin that repeats one piece but says another word is red", () => {
    const twin = [{ ...piece("shoe", 6, 17, { repeatOf: "shirt" }), id: "p9-shoe" }];
    expect(lawsOn(world(THREE, twin), "cloth-honesty").join(" ")).toMatch(/must be the same word/);
  });

  it("cloth-reach · a piece standing IN the ink is red", () => {
    const wet = [piece("hairband", 4, 15), piece("shirt", 10, 17), piece("shoe", 2, 17)];
    expect(lawsOn(world(wet), "cloth-reach").join(" ")).toMatch(/stands IN the ink|on the very brink/);
  });

  it("cloth-reach · …and one tile of firm ground further along is fine (visible beside the danger IS wanted)", () => {
    const dry = [piece("hairband", 4, 15), piece("shirt", 8, 17), piece("shoe", 2, 17)];
    expect(lawsOn(world(dry), "cloth-reach")).toEqual([]);
  });

  // the case the shipped chapter found: `standable` says yes to the SURFACE of an
  // ink pool, so a piece lying flat beside one used to measure as a jump target
  it("cloth-spacing · the surface of an ink pool is not a run line", () => {
    // c8 is one tile from the pool at c10-11; the piece lies flat on r17
    const beside = [piece("shoe", 2, 17), piece("shirt", 8, 17), piece("hairband", 15, 15)];
    const heights = lawsOn(world(beside), "cloth-spacing").join(" ");
    // it must NOT be reported as „nothing on the run line": the piece at c8 IS on it
    expect(heights).not.toMatch(/lies ON the run line/);
  });

  it("cloth-spacing · two pieces on one screen are one find, not two", () => {
    const tight = [piece("hairband", 4, 15), piece("shirt", 6, 17), piece("shoe", 2, 17)];
    expect(lawsOn(world(tight), "cloth-spacing").join(" ")).toMatch(/columns apart/);
  });

  it("cloth-spacing · a floor whose pieces all lie underfoot never asks for a jump", () => {
    const flat = [piece("hairband", 2, 17), piece("shirt", 9, 17), piece("shoe", 15, 17)];
    expect(lawsOn(world(flat), "cloth-spacing").join(" ")).toMatch(/tiles above its run line/);
  });

  it("cloth-spacing · …and a floor with nothing on the run line loses the word for the child who cannot jump", () => {
    const high = [piece("hairband", 4, 15), piece("shirt", 12, 15), piece("shoe", 2, 15)];
    expect(lawsOn(world(high), "cloth-spacing").join(" ")).toMatch(/lies ON the run line/);
  });
});

// ── L0 · DIE ZWEI NEUEN GESETZE DER LEVEL-WELLE ──────────────────────────────
//
// Beide sind Gesetze, die es erst gibt, seit ein Kapitel Dinge DEKLARIEREN darf,
// die vorher aus einer ch01-Tabelle im Code kamen. Eine Deklaration ohne Prüfung
// wäre der schlechteste der drei Zustände: nicht mehr hart verdrahtet, aber auch
// nicht nachgerechnet.
describe("L0 · D5 · trail-words — ein deklariertes Wort ist eine Zusage", () => {
  // acht Buchstaben für neun Sterne: das Wort finge auf dem neunten Stern von
  // vorne an. Im Spiel sieht das aus wie ein Wort und ist keines.
  const NINE_STARS = [
    "############",
    ...Array.from({ length: 16 }, () => "............"),
    "..S*******X.",
    "############",
    "############",
  ];
  const withStars = (rows: string[], words?: readonly string[]) =>
    level(rows, { phases: [{ ...phase(rows), words } as PaintLevel["phases"][number]] });

  it("acht Buchstaben für neun Sterne werden rot", () => {
    const rows = [...NINE_STARS];
    rows[17] = "..S*******X."; // sieben Sterne
    const nine = [...NINE_STARS];
    nine[17] = ".S*********X"; // neun Sterne
    const f = checkLevelLaws(withStars(nine, ["notebook"])); // NOTEBOOK = 8
    expect(f.some((x) => x.law === "trail-words" && /8 letter\(s\) but the grid carries 9/.test(x.detail))).toBe(true);
  });

  it("die passende Zahl schweigt — und der Tamper beweist, dass die Zeile lebt", () => {
    const nine = [...NINE_STARS];
    nine[17] = ".S*********X";
    // NOTEBOOKS = 9 · exakt so viele Buchstaben wie Sterne
    expect(checkLevelLaws(withStars(nine, ["notebooks"])).some((x) => x.law === "trail-words")).toBe(false);
    // …und ohne Deklaration schweigt das Gesetz ganz: ch01 holt seine Wörter
    // aus dem Kunst-Manifest und darf davon nicht berührt werden.
    expect(checkLevelLaws(withStars(nine)).some((x) => x.law === "trail-words")).toBe(false);
  });

  it("eine Deklaration, die gar keinen Buchstaben buchstabiert, wird rot", () => {
    const nine = [...NINE_STARS];
    nine[17] = ".S*********X";
    const f = checkLevelLaws(withStars(nine, ["123", "-"]));
    expect(f.some((x) => x.law === "trail-words" && /spells no letter at all/.test(x.detail))).toBe(true);
  });
});

describe("L0 · D7 · cage-captive-key — die Form des Insassen-Schlüssels", () => {
  const cage = (captive: unknown) => {
    const rows = [...OK_ROWS];
    const lvl = level(rows);
    lvl.phases[0]!.entities = [
      // `as string` mit Absicht: der Fall füttert das Gesetz mit dem, was ein
      // Tippfehler in einer JSON-Datei WIRKLICH liefert — eine Zeichenkette in
      // falscher Form. Ohne die Zusicherung könnte der Typ die Prüfung
      // beweisen, die hier zur Laufzeit bewiesen werden soll.
      { id: "c1", role: "cage", skin: "satchel", c: 3, r: 16, tier: "E", params: { captive: captive as string, captiveDe: "die Musikanlage" } },
    ];
    return checkLevelLaws(lvl);
  };

  it("»Sound System« wird rot — Grossbuchstabe und Leerzeichen ergeben keinen Blattnamen", () => {
    expect(cage("Sound System").some((x) => x.law === "cage-captive-key")).toBe(true);
  });

  it("»soundsystem« schweigt, und »zoo2« auch — die Liste ist offen, die Form nicht", () => {
    expect(cage("soundsystem").some((x) => x.law === "cage-captive-key")).toBe(false);
    expect(cage("zoo2").some((x) => x.law === "cage-captive-key")).toBe(false);
  });
});
