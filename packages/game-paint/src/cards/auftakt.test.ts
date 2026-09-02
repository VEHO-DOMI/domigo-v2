// R5-W2 · J1-B — the opening's chain, proven from both ends.
//
// The five laws below are the ones that cannot be seen in a screenshot. The
// freeze law in particular is why this module exists as pure code at all: it
// used to be a comment inside a 480-line switch, and a comment is not a check.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { domArtStems } from "../artScope.ts";
import { AUFTAKT, auftaktChain, auftaktExit, auftaktPosition, auftaktStep, auftaktTasks, UNIFORM_DE, clothWordsDe, uniformLegend, uniformLegendLine } from "./auftakt.ts";

describe("R5-W2 · J1-B · the opening's chain", () => {
  it("is FIVE beats, and beat 1 is still called `goal`", () => {
    // not sentiment: `goal` is the value the boot state writes, the ceremony
    // beat sim.ts already carries, and the address the bench photographs.
    // R5-W3 · J2 · R29: four became five when the task beat split into
    // do-this / gather-this. Two blind didactics critics, blind to each other,
    // converged on »one card with five task lines is too much for a
    // six-year-old«; the standing ruling was split-on-convergence.
    expect(AUFTAKT).toEqual(["goal", "schatten", "aufgaben", "sammeln", "los"]);
  });

  it("EVERY beat is reachable from the first, forward, with nothing skipped", () => {
    const walk: string[] = ["goal"];
    for (let c: string | null = "goal", n = 0; c !== null && n < 20; n++) {
      c = auftaktStep(c, 1);
      if (c !== null) walk.push(c);
    }
    expect(walk).toEqual([...AUFTAKT]);
  });

  it("back-navigation TERMINATES — it cannot loop and it cannot leave the chain", () => {
    // the brief's own rule: „an opening must not be faster than reading", so a
    // child may go back. Termination is arithmetic (a strictly decreasing index)
    // rather than a promise, which is why there is no back-POINTER in the state.
    let c: string | null = "los";
    const seen: string[] = [];
    for (let n = 0; c !== null && n < 20; n++) { seen.push(c); c = auftaktStep(c, -1); }
    expect(seen).toEqual([...AUFTAKT].reverse());
    expect(auftaktStep("goal", -1), "beat 1 has nowhere to go back to").toBeNull();
    expect(auftaktStep("los", 1), "beat 4 has nowhere to go forward to").toBeNull();
  });

  it("THE FREEZE HOLDS ACROSS ALL FOUR BEATS — exactly one gives the world back", () => {
    // the law this whole packet turns on. Three hand-overs must NOT un-freeze;
    // one exit must. pickups.test.ts holds the sim's half of the same contract.
    expect(AUFTAKT.filter((c) => auftaktExit(c).unfreeze)).toEqual(["los"]);
    expect(AUFTAKT.filter((c) => auftaktExit(c).boot)).toEqual(["los"]);
    for (const c of AUFTAKT.slice(0, 3)) {
      expect(auftaktExit(c).next, `${c} must hand over, not close`).not.toBeNull();
    }
  });

  it("counts its own position — the foot never types a number", () => {
    expect(auftaktPosition("goal")).toEqual({ at: 1, of: 5 });
    expect(auftaktPosition("los")).toEqual({ at: 5, of: 5 });
    expect(auftaktPosition("task")).toBeNull();
  });

  it("no card OUTSIDE the opening can be walked into it", () => {
    for (const foreign of ["task", "score", "out", "tip", "regel", "merkseite", "ceremony", ""]) {
      expect(auftaktStep(foreign, 1)).toBeNull();
      expect(auftaktStep(foreign, -1)).toBeNull();
      expect(auftaktExit(foreign)).toEqual({ next: null, unfreeze: false, boot: false });
    }
  });
});

describe("R5-W2 · J1-B · beat 3's task lines", () => {
  const base = { letters: 27, collectNounDe: "Buchstaben", drained: 6, cages: 5, kids: 1, tips: 3, books: 3 };

  it("prints the counts it is given — never a number of its own", () => {
    const t = auftaktTasks(base);
    expect(t.map((x) => x.askDe)).toEqual([
      "Sammle 27 Buchstaben.",
      "Gib 6 entfärbten Schulsachen die Farbe zurück.",
      "Mach 5 Käfige auf.",
      "Finde 3 Regel-Seiten.",
      "Nimm 3 Bonus-Bücher mit.",
    ]);
    // the promise and the world agree, or the promise is the thing that is wrong
    for (const [n, line] of [[27, t[0]!], [6, t[1]!], [5, t[2]!], [3, t[3]!], [3, t[4]!]] as const) {
      expect(line.askDe, `${line.key} must print ${n}`).toContain(String(n));
    }
  });

  it("SPEAKS GERMAN AT ONE — the singular is not the plural with a 1 in front", () => {
    // the defect this function exists for: `Nimm 1 Bonus-Bücher mit` was shipped
    // to the bench and read exactly as wrong as it looks. Latent for any chapter
    // whose counts all happen to exceed one, and wrong the day one does not.
    const one = auftaktTasks({ ...base, letters: 1, drained: 1, cages: 1, kids: 1, tips: 1, books: 1 });
    for (const t of one) {
      // no line may read as »1 <plural>« — the shape that shipped to the bench
      expect(t.askDe, `»${t.askDe}« still reads as »1 «+plural`).not.toMatch(/\b1 \S+(en|er)\b/);
      expect(t.whyDe.length, "every ask keeps its second line").toBeGreaterThan(0);
    }
    expect(one.find((t) => t.key === "books")!.askDe).toBe("Nimm das Bonus-Buch mit.");
    expect(one.find((t) => t.key === "cages")!.askDe).toBe("Mach den Käfig auf.");
    expect(one.find((t) => t.key === "books")!.whyDe).toBe("Es liegt versteckt.");
  });

  it("draws no line for a category the chapter does not have", () => {
    const none = auftaktTasks({ ...base, books: 0, tips: 0 });
    expect(none.map((t) => t.key)).toEqual(["letters", "drained", "cages"]);
    expect(auftaktTasks({ ...base, letters: 0, drained: 0, cages: 0, tips: 0, books: 0 })).toEqual([]);
  });

  it("keeps the classmate as the cage row's subline, never a sixth task", () => {
    // „ein Klassenkind" plus „fünf Käfige" is six things to a six-year-old when
    // the child is one OF the five
    const t = auftaktTasks(base);
    expect(t.map((x) => x.key)).not.toContain("kids");
    expect(t.find((x) => x.key === "cages")!.whyDe).toBe("In einem steckt ein Klassenkind.");
    expect(auftaktTasks({ ...base, kids: 0 }).find((x) => x.key === "cages")!.whyDe).toBe("Sie sind alle zu.");
    expect(auftaktTasks({ ...base, kids: 3 }).find((x) => x.key === "cages")!.whyDe).toBe("In 3 davon stecken Klassenkinder.");
  });
});

describe("R5-W2 · J1-B · the mechanic is named where the child acts", () => {
  it("says AUF ENGLISCH on the task line, not only in beat 1", () => {
    // the didactic critic's finding (80 %, high): the whole premise of the game
    // lived on beat 1 and was absent from beat 3, which is the page a child
    // reads to know what to DO. One mention, two taps before it matters.
    const t = auftaktTasks({ letters: 27, collectNounDe: "Buchstaben", drained: 6, cages: 5, kids: 1, tips: 3, books: 3 });
    expect(t.find((x) => x.key === "drained")!.whyDe).toContain("auf Englisch");
    expect(auftaktTasks({ letters: 1, collectNounDe: "Buchstaben", drained: 1, cages: 1, kids: 1, tips: 1, books: 1 })
      .find((x) => x.key === "drained")!.whyDe).toContain("auf Englisch");
  });
});

/** R5-W3 · J2 · R29 — THE SPLIT ITSELF.
 *
 *  Beat 3 became two beats. These are the laws that split needs and the old
 *  four-beat chain never had to answer: which line belongs to which beat, and
 *  what a chapter does when it has one kind of task and not the other. */
describe("R5-W3 · J2 · R29 · the task beat, split in two", () => {
  const base = { letters: 27, collectNounDe: "Buchstaben", drained: 6, cages: 5, kids: 1, tips: 3, books: 3 };

  it("puts the DOING on one beat and the GATHERING on the other, and loses no line", () => {
    const doing = auftaktTasks(base, "aufgaben").map((t) => t.key);
    const gathering = auftaktTasks(base, "sammeln").map((t) => t.key);
    expect(doing).toEqual(["drained", "cages"]);
    expect(gathering).toEqual(["letters", "tips", "books"]);
    // the split is a PARTITION: every line lands on exactly one beat, and the
    // union is still the whole contract. A split that quietly drops a task
    // would be the worst possible outcome of a readability fix.
    expect([...doing, ...gathering].sort()).toEqual(auftaktTasks(base).map((t) => t.key).sort());
  });

  it("names the mechanic on the FIRST of the two — it no longer shares a weight with the bonus book", () => {
    // both critics' second finding: with five identical rows, nothing said which
    // job was the chapter's. »drained« is the line that carries »sag auf
    // Englisch«, so it leads the beat a child acts on.
    expect(auftaktTasks(base, "aufgaben")[0]?.key).toBe("drained");
    expect(auftaktTasks(base, "aufgaben")[0]?.whyDe).toContain("auf Englisch");
  });

  it("neither beat carries more than three lines, at the shipped chapter's counts", () => {
    // the whole point of the round: five on one page was the finding
    expect(auftaktTasks(base, "aufgaben").length).toBeLessThanOrEqual(3);
    expect(auftaktTasks(base, "sammeln").length).toBeLessThanOrEqual(3);
  });

  it("a chapter with no gathering shows FOUR beats, not five with a blank one", () => {
    // ch02–15 inherit this grammar and will not all have both kinds
    const noGather = { ...base, letters: 0, tips: 0, books: 0 };
    expect(auftaktChain(noGather)).toEqual(["goal", "schatten", "aufgaben", "los"]);
    expect(auftaktPosition("los", auftaktChain(noGather))).toEqual({ at: 4, of: 4 });
    // and the skipped beat cannot be stepped into from either side
    expect(auftaktStep("aufgaben", 1, auftaktChain(noGather))).toBe("los");
    expect(auftaktStep("los", -1, auftaktChain(noGather))).toBe("aufgaben");
    expect(auftaktStep("sammeln", 1, auftaktChain(noGather))).toBeNull();
  });

  it("a chapter with no doing shows four beats the other way round", () => {
    const noDo = { ...base, drained: 0, cages: 0 };
    expect(auftaktChain(noDo)).toEqual(["goal", "schatten", "sammeln", "los"]);
    expect(auftaktStep("schatten", 1, auftaktChain(noDo))).toBe("sammeln");
  });

  it("a chapter with no tasks at all still opens and still closes", () => {
    const none = { ...base, letters: 0, drained: 0, cages: 0, tips: 0, books: 0 };
    expect(auftaktChain(none)).toEqual(["goal", "schatten", "los"]);
    // and the freeze law survives the shortening: exactly one beat gives the
    // world back, and it is still the last one
    expect(auftaktChain(none).filter((c) => auftaktExit(c, auftaktChain(none)).unfreeze)).toEqual(["los"]);
  });

  it("the freeze law holds on EVERY chain a chapter can produce", () => {
    // the split multiplied the number of possible chains; the law that exactly
    // one beat un-freezes must hold on all of them, or a chapter shape nobody
    // tested starts the world under a card a child is still reading
    for (const doing of [true, false]) for (const gathering of [true, false]) {
      const c = { ...base, drained: doing ? 6 : 0, cages: doing ? 5 : 0,
                  letters: gathering ? 27 : 0, tips: gathering ? 3 : 0, books: gathering ? 3 : 0 };
      const chain = auftaktChain(c);
      expect(chain.filter((b) => auftaktExit(b, chain).unfreeze), `chain ${chain.join("→")}`).toEqual(["los"]);
      expect(chain.filter((b) => auftaktExit(b, chain).boot), `chain ${chain.join("→")}`).toEqual(["los"]);
      expect(chain[0]).toBe("goal");
      expect(chain[chain.length - 1]).toBe("los");
    }
  });
});

describe("R5-W7 · D5 · R165 · die Sammel-Legende der Uniform", () => {
  const NEUN = [
    { skin: "cloth_hairband", wordEn: "hairband" },
    { skin: "cloth_hat", wordEn: "hat" },
    { skin: "cloth_sunglasses", wordEn: "sunglasses" },
    { skin: "cloth_shirt", wordEn: "shirt" },
    { skin: "cloth_school_tie", wordEn: "school tie" },
    { skin: "cloth_sweater", wordEn: "sweater" },
    { skin: "cloth_skirt", wordEn: "skirt" },
    { skin: "cloth_socks", wordEn: "socks" },
    { skin: "cloth_shoe", wordEn: "shoe" },
  ];

  it("hält die Reihenfolge des LEVELS — drei je Stockwerk, und das Raster ist die Verteilung", () => {
    // die Legende erfindet keine Ordnung: sie zeigt die Teile so, wie die Welt
    // sie trägt (p1 · p1 · p1 · p2 · p2 · p2 · p3 · p3 · p3), damit eine Zeile
    // des Rasters ein Stockwerk ist
    expect(uniformLegend(NEUN).map((c) => c.wordEn)).toEqual(NEUN.map((p) => p.wordEn));
  });

  it("sagt für JEDES ausgelieferte Teil ein deutsches Wort — keine Zelle bleibt stumm", () => {
    // die Falle, gegen die dieser Test steht: ein zehntes Teil wird ins Level
    // gelegt, die Legende zeichnet seine Zelle, und darunter steht nichts
    for (const cell of uniformLegend(NEUN)) {
      expect(cell.de, `${cell.wordEn} hat kein deutsches Wort`).not.toBeNull();
    }
    expect(Object.keys(UNIFORM_DE).sort()).toEqual(NEUN.map((p) => p.wordEn).sort());
  });

  it("wechselt NICHT die Sprache, wenn ein Wort fehlt", () => {
    // eine Legende, die ersatzweise das englische Wort zeigt, lehrt das Kind
    // genau das Wort, das es erst finden soll
    const [fremd] = uniformLegend([{ skin: "cloth_cape", wordEn: "cape" }]);
    expect(fremd?.de).toBeNull();
  });

  it("liest »gefunden« aus dem Ledger der WÖRTER, nicht aus einer Zahl", () => {
    const cells = uniformLegend(NEUN, ["hat", "shoe"]);
    expect(cells.filter((c) => c.found).map((c) => c.wordEn)).toEqual(["hat", "shoe"]);
    expect(cells.filter((c) => !c.found)).toHaveLength(7);
  });

  it("zählt seine Zeile und tippt keine Zahl — auch nicht bei eins", () => {
    expect(uniformLegendLine(9, 0)).toBe("Deine 9 Kleider sind über das Schulhaus verstreut.");
    expect(uniformLegendLine(9, 4)).toBe("Du hast 4 von 9 Kleidern.");
    expect(uniformLegendLine(9, 9)).toBe("Du hast alle 9 Kleider.");
    // der Singular ist nicht der Plural mit einer 1 davor
    expect(uniformLegendLine(1, 0)).not.toMatch(/1 Kleider/);
    expect(uniformLegendLine(1, 1)).toBe("Du hast es.");
  });
});

// ── Die Kette vom Level bis zum Blatt (R5-W7 · D5) ──────────────────────────
// Die Legende zeichnet neun Bilder. Damit sie das kann, müssen vier Dinge
// zusammenpassen, und drei davon liegen in FREMDEN Dateien: die Welt trägt die
// neun Teile, `artScope` reicht ihre Blätter auf die DOM-Seite, die Blätter
// liegen wirklich auf der Platte, und für jedes gibt es ein deutsches Wort.
// Der Auftrag dieser Runde verlangte ausdrücklich eine PRÜFUNG statt eines
// Eingriffs in `artScope` — hier ist sie, als Gesetz statt als Absatz im
// Bericht. Sie geht rot, sobald ein Teil dazukommt, umbenannt wird oder sein
// Blatt verliert.
describe("R5-W7 · D5 · die Legende und was sie zum Zeichnen braucht", () => {
  const level = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"), "utf8"),
  ) as Parameters<typeof domArtStems>[0] & { phases: { entities: { role?: string; skin: string; params?: Record<string, unknown> }[] }[]; arena?: { entities: { role?: string; skin: string; params?: Record<string, unknown> }[] } };
  const gespielt = [...level.phases, ...(level.arena ? [level.arena] : [])];
  const teile: { skin: string; wordEn: string }[] = [];
  for (const p of gespielt) {
    for (const e of p.entities) {
      if (e.role !== "cloth") continue;
      const w = typeof e.params?.wordEn === "string" ? e.params.wordEn : "";
      if (w !== "" && !teile.some((t) => t.wordEn === w)) teile.push({ skin: e.skin, wordEn: w });
    }
  }

  it("findet überhaupt Teile (Vakuität) — und es sind neun", () => {
    // ohne diese Zeile wäre alles darunter über einer leeren Liste wahr
    expect(teile).toHaveLength(9);
  });

  it("ALLE neun Blätter sind schon im DOM-Umfang — die Legende brauchte keine Zeile in artScope", () => {
    // `domArtStems` legt für JEDE cloth-Entität `<skin>_a` dazu (R5-W5 · G4).
    // Geprüft statt geglaubt: genau das war der Auftrag dieser Runde.
    const scope = domArtStems(level);
    for (const t of teile) {
      expect(scope.has(`${t.skin}_a`), `${t.skin}_a fehlt im DOM-Umfang — die Legende bekäme kein Bild`).toBe(true);
    }
  });

  it("…und alle neun liegen wirklich auf der Platte", () => {
    const dir = path.resolve(__dirname, "../../../../apps/web/public/art/g1/paint/ch01");
    for (const t of teile) {
      expect(fs.existsSync(path.join(dir, `${t.skin}_a.png`)), `${t.skin}_a.png fehlt`).toBe(true);
    }
  });

  it("…und jedes trägt ein deutsches Wort", () => {
    for (const t of teile) {
      expect(UNIFORM_DE[t.wordEn], `„${t.wordEn}" hat kein deutsches Wort`).toBeDefined();
    }
  });
});

// ── L0 · N2 · DAS WORT DER FUNDSTÜCKE GEHÖRT DEM KAPITEL (D-921) ─────────────
//
// „Kleider" stand an vier Stellen hart im Code. Die `cloth`-Maschine selbst ist
// kapitel-neutral — ch06 sammelt mit ihr Hinweis-Schnipsel, und „Kleider 3/9"
// wäre dort einfach falsch. Beide Richtungen stehen hier: dass Kapitel 1 sich
// UNVERÄNDERT liest, und dass ein anderes Wort wirklich durchkommt.
describe("L0 · N2 · clothWordsDe", () => {
  it("ohne Deklaration sind es Kapitel 1s eigene Wörter — Zeichen für Zeichen", () => {
    expect(clothWordsDe({})).toEqual({
      pl: "Kleider", plDat: "Kleidern", sg: "Kleidungsstück", ort: "Schulhaus",
    });
  });

  it("und die fünf Sätze lesen sich unverändert", () => {
    const w = clothWordsDe({});
    expect(uniformLegendLine(1, 0, w)).toBe("Ein Kleidungsstück liegt irgendwo im Schulhaus.");
    expect(uniformLegendLine(1, 1, w)).toBe("Du hast es.");
    expect(uniformLegendLine(9, 0, w)).toBe("Deine 9 Kleider sind über das Schulhaus verstreut.");
    expect(uniformLegendLine(9, 4, w)).toBe("Du hast 4 von 9 Kleidern.");
    expect(uniformLegendLine(9, 9, w)).toBe("Du hast alle 9 Kleider.");
  });

  it("ein Kapitel deklariert alle vier Wörter und bekommt sie", () => {
    const w = clothWordsDe({
      clothNounDe: "Schnipsel", clothNounDatDe: "Schnipseln",
      clothNounSgDe: "Schnipsel", clothPlaceDe: "Büro",
    });
    expect(uniformLegendLine(9, 4, w)).toBe("Du hast 4 von 9 Schnipseln.");
    expect(uniformLegendLine(9, 0, w)).toBe("Deine 9 Schnipsel sind über das Büro verstreut.");
    expect(uniformLegendLine(1, 0, w)).toBe("Ein Schnipsel liegt irgendwo im Büro.");
  });

  it("★ DER GRUND FÜR DIE VIER FELDER: der Dativ ist nicht der Nominativ", () => {
    // Wer nur das eine Wort deklariert, bekommt es überall — für „Federn" ist
    // das richtig, für „Schnipsel" nicht. Genau deshalb ist jede Form
    // deklarierbar und keine wird aus einer Endungs-Regel geraten.
    expect(uniformLegendLine(9, 4, clothWordsDe({ clothNounDe: "Federn" })))
      .toBe("Du hast 4 von 9 Federn.");
    expect(uniformLegendLine(9, 4, clothWordsDe({ clothNounDe: "Schnipsel" })))
      .toBe("Du hast 4 von 9 Schnipsel."); // grammatisch zu wenig ⇒ clothNounDatDe
  });
});
