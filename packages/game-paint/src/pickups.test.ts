// PK-R3b · R3-15/R3-16 — the colour wash, the collectible magnet, and the two
// static-state pickups. Everything here is driven through the REAL Sim on the
// REAL shipped level, because that is where each of these actually lives: a
// magnet that works in a synthetic room and not in ch01 has proved nothing.
//
// Every case is TAMPERED: the assertion is written so that removing the feature
// it describes turns it red (and each one was run in that state before being
// committed — see docs/handover/35_build_d_command_log.md).

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COLOUR_FLOOD_TICKS, WASHED_ROLES, WASH_ALPHA, washAlphaFor } from "./anim.ts";
import { MAGNET_FIELD_PX, Sim } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import { allPhases, checkLevelLaws, type EntitySpec, type PaintLevel } from "./level.ts";

const LEVEL = path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const level = JSON.parse(fs.readFileSync(LEVEL, "utf8")) as PaintLevel;
const phaseOf = (id: string) => allPhases(level).find((p) => p.id === id)!;
const newSim = (phaseId: string, picked: string[] = []) =>
  new Sim({
    level, phaseId,
    grantedAbilities: () => [...level.abilities],
    freedCageIds: () => [],
    collectedPickupIds: () => picked,
  });

// ── R3-15 · the desaturation grammar ─────────────────────────────────────────
describe("the colour wash (R3-15, doc 41 §2)", () => {
  it("drains every REDEEMABLE being and no furniture", () => {
    // the fiction is „OSWIN rained the colour out of the beings he bewitched" —
    // a door or a moving platform was never bewitched, and washing it would say
    // the child can befriend it.
    for (const role of ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm", "cage"]) {
      expect(WASHED_ROLES.has(role), `${role} should be drained`).toBe(true);
    }
    for (const role of ["door.trigger", "powerup", "platform.move", "platform.swing", "guardian", "tip", "book"]) {
      expect(WASHED_ROLES.has(role), `${role} is furniture — it was never drained`).toBe(false);
    }
  });

  it("an un-redeemed being is fully washed; the colour floods back on redemption", () => {
    const grey = { role: "chaser", redeemed: false, timer: 999 };
    expect(washAlphaFor(grey)).toBe(WASH_ALPHA);
    // the flood is driven by the sim's own timer, which redeemEntity resets to 0
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: 0 })).toBe(WASH_ALPHA);
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: COLOUR_FLOOD_TICKS / 2 })).toBeCloseTo(WASH_ALPHA / 2, 5);
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: COLOUR_FLOOD_TICKS })).toBe(0);
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: 9999 })).toBe(0); // never negative
  });

  it("reduced motion shows the END STATE — full colour, no flood", () => {
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: 0 }, true)).toBe(0);
    // …but a being that has NOT been befriended is still grey: the wash is
    // information, not decoration, so it survives the motion setting.
    expect(washAlphaFor({ role: "chaser", redeemed: false, timer: 0 }, true)).toBe(WASH_ALPHA);
  });

  it("a redeemed CAGE floods too — its timer keeps running (the R3-15 fix)", () => {
    // stepRedeemed used to return before incrementing the timer for anything
    // that does not fly a lap of joy, which left every knotted school bag
    // half-drained for the rest of the chapter. Two of ch01's restore cards are
    // about exactly those bags, so this is load-bearing, not cosmetic.
    // PK-R6 · B: p2 — the chapter's ONE cage is Merle's (doc 44 §2.3), and the
    // field restage retired the five anonymous satchel cages that used to make
    // any phase do here.
    const sim = newSim("p2");
    const cage = sim.world.entities.find((e) => e.role === "cage")!;
    cage.redeemed = true;
    cage.state = "burst";
    cage.timer = 0;
    for (let t = 0; t < COLOUR_FLOOD_TICKS + 5; t++) sim.step({ ...IDLE_PAD });
    expect(cage.timer).toBeGreaterThanOrEqual(COLOUR_FLOOD_TICKS);
    expect(washAlphaFor(cage)).toBe(0);
  });
});

// ── R3-16 · the collectible magnet ───────────────────────────────────────────
describe("the letter magnet (R3-16, doc 42 §4)", () => {
  /** Stand the child a given distance to the left of one real letter and run.
   *
   *  Two things this harness has to get right, both learned the hard way here:
   *  the WARP first, because the screen clamp boxes the player inside the camera
   *  and a teleport without one drags them straight back across the level; and
   *  the child is re-pinned every tick, so the only thing that moves in these
   *  cases is the letter — which is the whole point of the measurement. */
  const runNear = (phaseId: string, gapPx: number, ticks: number) => {
    const sim = newSim(phaseId);
    const key = [...sim.letterCells][0]!;
    sim.warp(...(key.split(",").map(Number) as [number, number]));
    // PARK the letter out of reach for the settle tick — the warp puts the child
    // right on top of it, and a letter collected during setup makes every
    // measurement afterwards a measurement of nothing (collectLetters walks
    // `letterCells`, so a taken key is simply skipped and looks like „it never
    // moved"). Both magnet cases failed on exactly this before it was parked.
    sim.letterPos.set(key, { x: 9_000 * SUBS, y: 9_000 * SUBS });
    // SETTLE, then measure. Pinning the child at a chosen y does not hold:
    // stepPlayer snaps them to the ground, and an early version of this harness
    // measured from a place the child never stood — it read a 23.6 px gap while
    // the real one was 26.5, i.e. just outside the field, and called the magnet
    // broken. So the LETTER is moved to the wanted gap from where the child
    // actually ends up, and only then does the clock start.
    for (let t = 0; t < 120 && !sim.player.grounded; t++) {
      for (const ev of sim.step({ ...IDLE_PAD })) if (ev.type === "tip" || ev.type === "cageHint") sim.setOverlay(false);
    }
    sim.step({ ...IDLE_PAD });
    expect(sim.player.grounded, "harness: the child must settle onto ground before measuring").toBe(true);
    expect(sim.letterCells.has(key), "harness: the letter was taken during setup").toBe(true);
    const anchorX = sim.player.x;
    const anchorY = sim.player.y - 10 * SUBS; // the chest, per COLLECT_ANCHOR_PX
    const start = { x: anchorX + Math.round(gapPx * SUBS), y: anchorY };
    sim.letterPos.set(key, { ...start });
    for (let t = 0; t < ticks; t++) {
      sim.player = { ...sim.player, x: anchorX, vx: 0 }; // the child holds still
      for (const ev of sim.step({ ...IDLE_PAD })) if (ev.type === "tip" || ev.type === "cageHint") sim.setOverlay(false);
    }
    return { sim, key, start, now: sim.letterPos.get(key) ?? null };
  };

  it("a letter INSIDE the field drifts to the child and is taken", () => {
    const { sim, key } = runNear("p1", MAGNET_FIELD_PX - 2, 30);
    expect(sim.letterCells.has(key), "the letter should have been magnetised in").toBe(false);
    expect(sim.lettersGot).toBe(1);
  });

  it("a letter OUTSIDE the field does not move — the magnet is a small field, not a vacuum", () => {
    const { start, now, sim } = runNear("p1", MAGNET_FIELD_PX + 6, 30);
    expect(now).not.toBeNull();
    expect(now!.x).toBe(start.x);
    expect(now!.y).toBe(start.y);
    expect(sim.lettersGot).toBe(0);
  });

  it("the DRAWN place and the TAKEN place are the same number", () => {
    // the whole reason the magnet lives in the sim: a letter that visibly flies
    // into the child but is only collected when their body reaches its original
    // cell would be a picture that lies about the rules.
    const { sim, key, start, now } = runNear("p1", MAGNET_FIELD_PX - 2, 1);
    if (now) expect(now.x).not.toBe(start.x); // it moved, and the renderer reads THIS map
    else expect(sim.lettersGot).toBe(1); // or it was close enough to be taken outright
  });

  it("lettersCollected counts what was FOUND, and paying Klecks does not un-find it", () => {
    const { sim } = runNear("p1", 0, 4);
    expect(sim.lettersCollected).toBe(1);
    expect(sim.spendLetters(1)).toBe(true);
    expect(sim.lettersGot).toBe(0);
    expect(sim.lettersCollected, "the Bilanz must not count DOWN when the bonus door is paid").toBe(1);
  });
});

// ── R3-16 · Regel-Seiten and Bonus-Bücher ────────────────────────────────────
describe("the static-state collectibles (R3-16, doc 41 §5)", () => {
  const tipsOf = (phaseId: string) => phaseOf(phaseId).entities.filter((e) => e.role === "tip");

  it("the chapter places exactly the Regel-Seiten it declares, each with a rule", () => {
    const tips = level.phases.flatMap((p) => p.entities.filter((e) => e.role === "tip"));
    expect(tips.length).toBe(level.tipsTotal);
    for (const t of tips) {
      expect(String(t.params?.merksatzDe ?? "").length).toBeGreaterThan(0);
      expect(String(t.params?.topicDe ?? "").length).toBeGreaterThan(0);
    }
  });

  it("EVERY Regel-Seite can actually be walked into, and hands over its whole payload", () => {
    // the tapes prove some of them by execution; this proves ALL of them,
    // including the ones deliberately off the pilots' line. R5-W4 · I2: the
    // examples are matched too, because they are the half a child reads as
    // English and the half that changed shape this round — a payload that
    // arrives with the rule and without its examples is a card with a hole in
    // it, and the old assertion could not have seen that.
    for (const ph of level.phases) {
      for (const spec of ph.entities.filter((e) => e.role === "tip")) {
        const sim = newSim(ph.id);
        sim.warp(spec.c, spec.r);
        let got: { topicDe: string; erklaerungDe: string; merksatzDe: string; beispieleEn: readonly string[] } | null = null;
        for (let t = 0; t < 90 && got === null; t++) {
          for (const ev of sim.step({ ...IDLE_PAD })) if (ev.type === "tip") got = ev;
        }
        expect(got, `${ph.id}/${spec.id} was never picked up`).not.toBeNull();
        expect(got!.merksatzDe).toBe(spec.params!.merksatzDe);
        expect(got!.topicDe).toBe(spec.params!.topicDe);
        expect(got!.erklaerungDe).toBe(spec.params!.erklaerungDe);
        expect([...got!.beispieleEn], `${spec.id} lost its examples on the way to the card`)
          .toEqual(spec.params!.beispieleEn);
      }
    }
  });

  it("a Regel-Seite FREEZES the world — and the shell is what un-freezes it", () => {
    // the cagehint lesson (PB-R1 · R3-1), applied before this card can repeat
    // it: the sim freezes for a card, so the card must be one that opens, and
    // the shell must always give the world back.
    const spec = tipsOf("p1")[0]!;
    const sim = newSim("p1");
    sim.warp(spec.c, spec.r);
    for (let t = 0; t < 90 && !sim.overlayOpen; t++) sim.step({ ...IDLE_PAD });
    expect(sim.overlayOpen, "a rule page must stop the world so it can be read").toBe(true);
    sim.setOverlay(false);
    expect(sim.overlayOpen).toBe(false);
  });

  it("a page taken before the Kleckskammer is still taken when the phase remounts", () => {
    const spec = tipsOf("p1")[0]!;
    const sim = newSim("p1", [spec.id]);
    sim.warp(spec.c, spec.r);
    let fired = false;
    for (let t = 0; t < 90; t++) for (const ev of sim.step({ ...IDLE_PAD })) if (ev.type === "tip") fired = true;
    expect(fired, "a remounted phase must not re-serve a page the child already has").toBe(false);
  });

  // R5-W4 · I2 · THE BONUS-BÜCHER ARE GONE (R53, Koki's replay 2026-08-15:
  // „Bonusbücher: unerklärt, fehl am Platz"). Three `role: "book"` entities that
  // the chapter never introduced, counted by a HUD chip a child had no way to
  // read. Uniform collectibles take their place in a later wave.
  //
  // The old test walked into the FIRST book and proved it did not freeze the
  // world. What replaces it is not nothing: `booksTotal` is derived at runtime
  // from `chapterRoleCount(level, "book")` and is declared NOWHERE, so a book
  // that crept back in would silently raise the HUD total with no gate to see
  // it. This is that gate, and it is stated over every phase the chapter has.
  it("ch01 holds no Bonus-Buch at all, so nothing can count one", () => {
    for (const ph of allPhases(level)) {
      const books = ph.entities.filter((e) => e.role === "book");
      expect(books.map((e) => e.id), `${ph.id} still holds a Bonus-Buch`).toEqual([]);
    }
    // …and the counter the HUD chip and the Bilanz row read stays at zero for a
    // whole phase of play, which is what actually keeps both of them hidden.
    const sim = newSim("p1");
    for (let t = 0; t < 240; t++) {
      for (const ev of sim.step({ ...IDLE_PAD })) {
        expect(ev.type, "a book event fired in a chapter with no books").not.toBe("book");
      }
      if (sim.overlayOpen) sim.setOverlay(false);
    }
    expect(sim.booksGot).toBe(0);
  });
});

// ── the tip-honesty law, proven in both directions ───────────────────────────
// R5-C1 · the timeout is stated for the WHOLE block, not inherited. Every case
// in here runs `checkLevelLaws` over the real shipped chapter — seconds of
// reachability work each — and the 5000 ms default left so little headroom that
// the suite timed out on this session's very first BASELINE run, before a line
// had been touched. Every law layered onto checkLevelLaws since makes that
// likelier, so the budget is written down rather than rediscovered.
describe("the tip-honesty law (doc 41 §7)", () => {
  const clone = (): PaintLevel => JSON.parse(JSON.stringify(level)) as PaintLevel;
  const lawsNamed = (l: PaintLevel) => checkLevelLaws(l).filter((f) => f.law === "tip-honesty").map((f) => f.detail);

// R5-W1 · E1: checkLevelLaws needs ~3 s on the shipped chapter — the
// trap-pocket law runs one reachability search per reachable cell (114 in p2
// alone), which is quadratic by design ("honesty beats cleverness", level.ts).
// Vitest's default 5 s timeout sat close enough to that to flip red or green
// with machine load: this suite was FLAKY, not broken. The timeout is raised
// deliberately rather than the law weakened; the quadratic law itself is filed
// as a follow-up, with the measurement, in the E1 report.
  // B2: KEIN Per-Test-Timeout mehr. Ein Timeout-Argument am it() ÜBERSCHREIBT
  // `testTimeout` aus vitest.config.ts — diese sechs Gesetz-Tests trugen 30 s und
  // machten die 120 s der Config, die genau FÜR sie geschrieben wurde, wirkungslos.
  // Unter Parallel-Last liefen sie damit weiter ins Limit (gemessen: allein 12,7 s,
  // im vollen Lauf rot). Die Config ist jetzt der einzige Ort, an dem die Zahl steht.
  it("the shipped chapter passes it", () => expect(lawsNamed(level)).toEqual([]));

  it("promising a page the chapter does not place turns it RED", () => {
    const l = clone();
    const placed = l.phases.flatMap((p) => p.entities.filter((e) => e.role === "tip")).length;
    l.tipsTotal = placed + 1;
    // written from what the chapter HOLDS rather than from two literals: the
    // old form said „declares 4 … places 3" and went red the moment the chapter
    // gained a page, which is a test that breaks on content instead of on code.
    expect(lawsNamed(l).join(" ")).toMatch(new RegExp(`declares ${placed + 1} Regel-Seiten but places ${placed}`));
  });

  it("a page with no Merksatz turns it RED (an empty rule page is a broken promise)", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    t.params!.merksatzDe = "";
    expect(lawsNamed(l).join(" ")).toMatch(/no Merksatz/);
  });

  it("two pages of the same rule turn it RED", () => {
    const l = clone();
    const tips = l.phases.flatMap((p) => p.entities.filter((e) => e.role === "tip"));
    tips[1]!.params!.topicDe = tips[0]!.params!.topicDe;
    expect(lawsNamed(l).join(" ")).toMatch(/one rule, one page/);
  });

  it("a Merksatz that breaks the register law turns it RED", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    t.params!.merksatzDe = "Das Monster im Buch sagt: I am.";
    expect(lawsNamed(l).join(" ")).toMatch(/register-law/);
  });

  // ── R5-W2 · I1 · the three fields that make a rule page teach ──────────────
  // Each of these is a failure class that shipped SILENTLY until this packet: a
  // page with no key set its whole Merksatz in bold (i.e. none of it, since every
  // shipped Merksatz is 60–72 chars and the card drops the stroke over 56), and a
  // page with no example taught a rule about nothing.

  it("a Schlüssel that is not IN the Merksatz turns it RED (a key that paraphrases is a second rule)", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    t.params!.schluesselDe = "merk dir den Apostroph"; // true, useful — and not the sentence
    expect(lawsNamed(l).join(" ")).toMatch(/steht nicht im Merksatz/);
  });

  it("a Schlüssel over the card's stroke cap turns it RED", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    // 57 chars: one past MAX_SCHLUESSEL, and a substring of the Merksatz it sits in
    t.params!.merksatzDe = `${"a".repeat(57)} — und so weiter.`;
    t.params!.schluesselDe = "a".repeat(57);
    expect(lawsNamed(l).join(" ")).toMatch(/Schlüssel is 57 chars/);
  });

  it("a page with no English examples turns it RED", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    delete t.params!.beispieleEn;
    expect(lawsNamed(l).join(" ")).toMatch(/no English examples/);
  });

  it("a single example turns it RED — a rule shown once is a rule asserted", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    t.params!.beispieleEn = [(t.params!.beispieleEn as string[])[0]!];
    expect(lawsNamed(l).join(" ")).toMatch(/carries 1 example\(s\)/);
  });

  it("German LETTERS in the English slot turn it RED", () => {
    // Why this guard is worth having even though it is cheap: downstream,
    // check-paint-copy grounds this field token-by-token against an ENGLISH
    // lexicon, so a German line here would be measured with the wrong ruler.
    //
    // What it does NOT catch, stated so nobody trusts it further than it goes:
    // German that happens to be pure ASCII („Der Apostroph zeigt, was fehlt.")
    // passes this test — a pure module cannot tell languages apart without a
    // word list, and level.ts has none by design. That case is caught one gate
    // later, where the lexicon lives: check-paint-copy reports „Apostroph",
    // „zeigt" and „fehlt" as un-grounded. Verified by tamper, not assumed.
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    t.params!.beispieleEn = ["Die Kurzform steht für zwei Wörter.", "It's my school bag."];
    expect(lawsNamed(l).join(" ")).toMatch(/is not English/);
  });

  it("a page with no Beleg turns it RED (the teacher's view and the register still need the unit page)", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    delete t.params!.belegDe;
    expect(lawsNamed(l).join(" ")).toMatch(/names no Beleg/);
  });

  // ── R5-W4 · I2 · the three laws that arrived with Koki's ruling K-1 ─────────
  // The examples are OURS now, not quotations, so the gate that proved they were
  // in the book is gone. These are what took its place — and between them they
  // catch a class the quotation gate never could.

  // ⚠ ONE CLONE, ONE SWEEP, FIVE TAMPERS — and the reason is measured, not
  // stylistic. `checkLevelLaws` costs 2–3 s on the shipped chapter (the
  // trap-pocket law is O(nodes × BFS), see the block header above), so five
  // tampers written as five `it()` blocks would add 10–15 s to every run of
  // this suite. It showed: the first draft of this round did exactly that, and
  // the extra pressure pushed `content-levels.test.ts` — a NEIGHBOURING file
  // with a 30 s cap — over its timeout on a loaded machine, i.e. this packet
  // would have handed the next session a red suite that had nothing to do with
  // its own change.
  //
  // The five tampers are independent BY CONSTRUCTION: each one breaks a
  // DIFFERENT rule page, so no two can mask each other and the single sweep
  // reports all five failures at once. The `notReported` list at the end is
  // what keeps that honest — it names the message each tamper must produce, so
  // a law that silently stops firing cannot hide behind its four neighbours.
  it("★ the five laws that arrived with Koki's ruling K-1, each proven RED", () => {
    const l = clone();
    const tips = l.phases.flatMap((p) => p.entities.filter((e) => e.role === "tip"));
    expect(tips.length, "this test needs one page per tamper").toBeGreaterThanOrEqual(5);
    const [a, b, c, d, e] = tips as [EntitySpec, EntitySpec, EntitySpec, EntitySpec, EntitySpec];

    // 1 · no Notion at all
    delete a.params!.erklaerungDe;
    // 2 · a Notion that is just the Merksatz again — the padding this round
    //     exists to remove may not grow back quietly
    b.params!.erklaerungDe = b.params!.merksatzDe;
    // 3 · THE DEFECT THIS ROUND EXISTS FOR: a form the title promises and no
    //     example shows. I1 shipped „Kurzformen — I'm · it's · isn't" and
    //     explained two of the three; every gate was green and a human teacher
    //     caught it by reading.
    const forms = c.params!.lehrtEn as string[];
    const dropped = forms[forms.length - 1]!;
    c.params!.beispieleEn = (c.params!.beispieleEn as string[])
      .filter((x) => !x.toLowerCase().includes(dropped.toLowerCase()));
    // 4 · an example that is grounded, well-formed, in register — and about a
    //     different rule entirely
    d.params!.beispieleEn = [(d.params!.beispieleEn as string[])[0]!, "Open the window!"];
    // 5 · a params field the schema does not know. Catches a TYPO
    //     (`beispieleEN` would vanish into an open record and reach the child as
    //     a card with no examples) and keeps J1-D's four retired fields retired.
    e.params!.ausspracheDe = "Sprich I'm wie das i in time.";

    const said = lawsNamed(l).join(" ");
    const notReported = ([
      ["Notion fehlt", /has no Erklärung/],
      ["Notion = Merksatz", /derselbe Satz/],
      ["Abdeckung", /aber kein Beispiel zeigt es/],
      ["Relevanz", /zeigt keine der Formen/],
      ["unbekanntes Feld", /unknown params field „ausspracheDe"/],
    ] as const).filter(([, re]) => !re.test(said)).map(([name]) => name);
    expect(notReported, `these tampers did NOT turn the law red:\n${said}`).toEqual([]);
  });

  it("a Regel-Seite placed where no child can reach it turns entity-reachable RED", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    t.c = 1;
    t.r = 1; // inside the canopy: hidden is fine, impossible is not
    expect(checkLevelLaws(l).some((f) => f.law === "entity-reachable" && f.detail.includes("tip"))).toBe(true);
  });
});

// ── the world's own arithmetic ───────────────────────────────────────────────
it("the chapter's letter total is the three phases plus the arena, never the Kleckskammer", () => {
  // the score page reports „z von M"; folding Klecks' twelve into M would tell a
  // child who never paid the door that they missed twelve letters.
  const main = [...level.phases, ...(level.arena ? [level.arena] : [])]
    .reduce((n, p) => n + p.rows.join("").split("*").length - 1, 0);
  const bonus = level.bonus ? level.bonus.rows.join("").split("*").length - 1 : 0;
  // R5-P1 (ch01-dossiers-v2, B21): 32 → 27. Jeder Trail IST jetzt ein Wort in
  // Läufen zu je 3: SCHOOLBAG (9) · PROJECTOR (9) · GLUESTICK (9); die Arena
  // trägt keine Buchstaben (ihr Dossier: der Kampf zahlt anders). The number is
  // asserted rather than derived on purpose — it is the one place a silent
  // re-scatter would show up.
  expect(main).toBe(27);
  expect(bonus).toBeGreaterThan(0);
  expect(main).not.toBe(main + bonus);
});

it("the magnet field is Keen's 1.6 tiles, in THIS world's tile", () => {
  expect(MAGNET_FIELD_PX).toBe(TILE * 1.6);
});

// ── R5-A2 · the Kleckskammer round-trip (doc 45): the letter ledger ──────────
describe("R5-A2 · spawnCell + letterLedger (the bonus trip loses nothing)", () => {
  const collectAt = (sim: Sim, c: number, r: number, taken: string[]): void => {
    sim.warp(c, r);
    const before = sim.lettersGot;
    for (let t = 0; t < 120 && sim.lettersGot === before; t++) {
      for (const ev of sim.step(IDLE_PAD)) if (ev.type === "letterTaken") taken.push(`${ev.c},${ev.r}`);
    }
    expect(sim.lettersGot, `a letter near (${c},${r}) should have been magneted in`).toBe(before + 1);
  };

  it("taken cells stay taken, purse and found survive, the spawn is the door", () => {
    // live run A: collect two letters on the real p1, pay Klecks one
    const a = newSim("p1");
    const taken: string[] = [];
    collectAt(a, 11, 14, taken);
    collectAt(a, 46, 16, taken);
    expect(a.spendLetters(1)).toBe(true);
    expect(a.lettersGot).toBe(1);
    expect(a.lettersCollected).toBe(2); // found is monotone — paying un-finds nothing

    // remount B with the ledger, returning AT the first letter's cell: if the
    // consumed cell respawned, the magnet would re-collect it instantly
    const b = new Sim({
      level, phaseId: "p1",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
      spawnCell: { c: 11, r: 14 },
      letterLedger: () => ({ takenCells: taken, purse: a.lettersGot, found: a.lettersCollected }),
    });
    expect(b.player.x).toBe((11 * TILE + TILE / 2) * SUBS); // the spawnCell, not the S
    expect(b.lettersGot).toBe(1);
    expect(b.lettersCollected).toBe(2);
    expect(b.lettersTotal).toBe(a.lettersTotal); // consumed cells still COUNT
    let reTaken = 0;
    for (let t = 0; t < 90; t++) for (const ev of b.step(IDLE_PAD)) if (ev.type === "letterTaken") reTaken++;
    expect(reTaken, "a consumed letter cell must not be re-collectable").toBe(0);
  });

  it("…but the KLECKSKAMMER serves its letters again (D-5 = Option A, Koki 2026-08-11)", () => {
    // The mirror of the case above, and the reason the ledger filter had to grow
    // a seam: in a FIELD phase a consumed cell must stay consumed, but the bonus
    // room is BOUGHT. A second purchase costs the full price (DEBT_REGISTER D-5;
    // the price question itself stays PK-R7), so it must not buy an emptied room.
    const fresh = new Sim({
      level, phaseId: "p9",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
    });
    const all = [...fresh.letterCells];
    expect(all.length, "the Kleckskammer must actually place letters").toBeGreaterThan(0);

    // the first visit was the PERFEKT run — the child cleared the whole wave
    // (proof tape p9: 12/12). That is the hardest case: under the old filter the
    // second visit was a room with nothing in it.
    const second = new Sim({
      level, phaseId: "p9",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
      letterLedger: () => ({ takenCells: all, purse: 3, found: 9 }),
    });
    expect(second.letterCells.size, "every bought letter must be back in the room").toBe(all.length);
    for (const key of all) {
      expect(second.letterCells.has(key), `${key} must be collectable again`).toBe(true);
      expect(second.letterPos.has(key), `${key} must be DRAWN again, not merely counted`).toBe(true);
    }
    // …and the tally stays honest: the room promises exactly its own letters,
    // no more (a respawn that inflated the total would lie in the HUD).
    expect(second.lettersTotal).toBe(fresh.lettersTotal);
    expect(second.lettersTotal).toBe(second.letterCells.size);
    // the REST of the ledger is untouched by the exception — the purse the child
    // walked in with and the monotone Bilanz still cross the door.
    expect(second.lettersGot).toBe(3);
    expect(second.lettersCollected).toBe(9);

    // live proof, not bookkeeping: pick a respawned letter the child can simply
    // drop onto (ground within three rows below it — most of the wave's letters
    // are flown to, and this case is about the respawn, not about the route) and
    // take it off the map for real.
    const rows = phaseOf("p9").rows;
    const dropKey = all.find((k) => {
      const [c, r] = k.split(",").map(Number) as [number, number];
      for (let dr = 1; dr <= 3; dr++) if (rows[r + dr]?.[c] === "#") return true;
      return false;
    });
    expect(dropKey, "harness: no respawned letter has ground under it").toBeDefined();
    const [c, r] = dropKey!.split(",").map(Number) as [number, number];
    second.warp(c, r);
    const reTaken: string[] = [];
    for (let t = 0; t < 120 && reTaken.length === 0; t++) {
      for (const ev of second.step(IDLE_PAD)) if (ev.type === "letterTaken") reTaken.push(`${ev.c},${ev.r}`);
    }
    expect(reTaken, "a respawned letter must be collectable a second time").toContain(dropKey);
    expect(second.lettersGot, "and it pays into the purse it walked in with").toBe(4);
  });

  // R5-C1 · THE CUMULATIVE TRAP. The bonus room's end card lays its catches out
  // as the phrase they spell, and that layout is about the RUN. Two nearby sets
  // both look like "what the child just caught" and neither is: the shell's own
  // ledger accumulates across visits, and `letterCells`' complement counts the
  // ledger's suppressed cells as if this run had taken them. On a second paid
  // visit either one would light up letters the child never touched.
  it("R5-C1 · runTakenCells is THIS run's catches — never the ledger's", () => {
    const first = new Sim({
      level, phaseId: "p1",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
    });
    const taken: string[] = [];
    collectAt(first, 11, 14, taken);
    expect([...first.runTakenCells]).toEqual(taken);

    // come back with that cell already on the ledger and catch a DIFFERENT one
    const second = new Sim({
      level, phaseId: "p1",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
      letterLedger: () => ({ takenCells: taken, purse: 1, found: 1 }),
    });
    const secondTaken: string[] = [];
    collectAt(second, 46, 16, secondTaken);

    expect([...second.runTakenCells], "the previous visit's cell must not be in this run's set").toEqual(secondTaken);
    expect(second.runTakenCells.has(taken[0]!)).toBe(false);
    // NOTE the invariant that does NOT hold here: `lettersGot` is a purse and
    // this remount seeded it with 1, so size ≠ got in a host phase. It holds in
    // the Kleckskammer, which is the only room the card describes — below.
  });

  // …and there it is the honesty clause itself: the card prints `got` beside a
  // row of filled slots, so the two may never disagree.
  it("R5-C1 · in the Kleckskammer the filled slots ARE the printed number", () => {
    const p9 = new Sim({
      level, phaseId: "p9",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
    });
    expect(p9.lettersGot, "the bonus room starts with an empty purse").toBe(0);
    const got: string[] = [];
    collectAt(p9, 11, 12, got);
    collectAt(p9, 13, 10, got);
    expect(p9.runTakenCells.size).toBe(p9.lettersGot);
    expect([...p9.runTakenCells]).toEqual(got);
  });

  it("spawning ON a door seeds its cooldown — and standing there NEVER re-fires it", () => {
    const c = new Sim({
      level, phaseId: "p1",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
      spawnCell: { c: 61, r: 16 }, // p1-door stands at c61 on the floor
      letterLedger: () => ({ takenCells: [], purse: 0, found: 0 }),
    });
    expect(c.world.entities.find((e) => e.id === "p1-door")!.state).toBe("cooling");
    // R5 verify wave: the timer-only re-arm fired again at tick 92 with the
    // child still standing on the door — held contact must never re-ask
    const evs: string[] = [];
    for (let t = 0; t < 300; t++) for (const ev of c.step(IDLE_PAD)) evs.push(ev.type);
    expect(evs).not.toContain("doorTouched");
    // …but stepping off and coming back asks again (the door still works)
    c.warp(57, 16);
    for (let t = 0; t < 5; t++) c.step(IDLE_PAD);
    c.warp(61, 16);
    const back: string[] = [];
    for (let t = 0; t < 30; t++) for (const ev of c.step(IDLE_PAD)) back.push(ev.type);
    // the exit door re-asks as its door-series TASK (doorTouched is consumed
    // sim-internally there) — either event proves the door re-armed
    expect(back.some((t) => t === "doorTouched" || t === "task")).toBe(true);
  });
});
