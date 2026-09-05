import { describe, expect, it } from "vitest";
import { PAINT, SUBS } from "./paint.ts";
import { attachSwing, releaseSwing, stepSwing, swingPos, swingStep, type SwingState } from "./swing.ts";

const ANCHOR_X = 200 * SUBS;
const ANCHOR_Y = 50 * SUBS;

describe("the pendulum", () => {
  it("is fastest at the arc bottom and slowest at the extremes (D shape)", () => {
    expect(swingStep(256)).toBe(5); // bottom
    expect(swingStep(128)).toBe(1); // extreme
    expect(swingStep(384)).toBe(1);
    expect(swingStep(340)).toBeLessThan(swingStep(256)); // across speed bands
  });

  it("hangs straight down at the bottom of the arc", () => {
    const s: SwingState = { anchorX: ANCHOR_X, anchorY: ANCHOR_Y, angle: 256, dir: 1, dwell: 0, ropePx: PAINT.swingRopePx };
    const pos = swingPos(s);
    expect(pos.xSubs).toBe(ANCHOR_X);
    expect(pos.ySubs).toBe(ANCHOR_Y + (PAINT.swingRopePx + 22) * SUBS);
  });

  it("oscillates forever inside [128, 384] with dwells at the extremes", () => {
    let s = attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X - 40 * SUBS);
    expect(s.angle).toBeLessThan(256); // grabbed from the left
    expect(s.dir).toBe(1);
    let hitMax = false;
    let hitMin = false;
    let dwellRun = 0;
    let maxDwellRun = 0;
    let prevAngle = s.angle;
    for (let t = 0; t < 400; t++) {
      s = stepSwing(s).swing;
      expect(s.angle).toBeGreaterThanOrEqual(128);
      expect(s.angle).toBeLessThanOrEqual(384);
      if (s.angle === 384) hitMax = true;
      if (s.angle === 128) hitMin = true;
      if (s.angle === prevAngle) dwellRun++;
      else dwellRun = 0;
      maxDwellRun = Math.max(maxDwellRun, dwellRun);
      prevAngle = s.angle;
    }
    expect(hitMax).toBe(true);
    expect(hitMin).toBe(true);
    expect(maxDwellRun).toBe(PAINT.swingDwellTicks); // the studied 5-tick hold
  });

  it("is fully deterministic", () => {
    let a = attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X + 30 * SUBS);
    let b = attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X + 30 * SUBS);
    for (let t = 0; t < 100; t++) {
      const ra = stepSwing(a);
      const rb = stepSwing(b);
      a = ra.swing;
      b = rb.swing;
      expect(ra.xSubs).toBe(rb.xSubs);
      expect(ra.ySubs).toBe(rb.ySubs);
    }
  });

  it("releases the tangential speed as a jump (+ the studied −2 lift)", () => {
    const bottom: SwingState = { anchorX: ANCHOR_X, anchorY: ANCHOR_Y, angle: 256, dir: 1, dwell: 0, ropePx: PAINT.swingRopePx };
    const rel = releaseSwing(bottom);
    expect(rel.vxSubs).toBe(5 * SUBS); // max speed at the bottom, rightward
    expect(rel.vySubs).toBe(-2 * SUBS);
    const extreme: SwingState = { ...bottom, angle: 384, dir: -1 };
    expect(Math.abs(releaseSwing(extreme).vxSubs)).toBe(1 * SUBS); // slowest at the top
  });

  // ── L3-M-a · E1 · DIE SEILLÄNGE IST EIN PHASEN-WERT ────────────────────────
  it("hängt an dem Seil, das der Griff mitbringt — nicht an der Konstante", () => {
    for (const ropePx of [32, 48, 96, 128]) {
      const s: SwingState = { anchorX: ANCHOR_X, anchorY: ANCHOR_Y, angle: 256, dir: 1, dwell: 0, ropePx };
      const pos = swingPos(s);
      expect(pos.xSubs).toBe(ANCHOR_X);
      expect(pos.ySubs).toBe(ANCHOR_Y + (ropePx + 22) * SUBS);
    }
  });

  it("trägt am Scheitel etwa eine Seillänge weit zur Seite — das ist die Untergrenze der Kette", () => {
    // die Zahl, aus der `level.ts#ringChainSpan` ihre Untergrenze zieht: steht
    // der nächste Ring NÄHER als der Scheitel, ist er beim Loslassen schon hinter
    // dem Kind (Sonde §7 — bei jeder der vier gemessenen Seillängen exakt so)
    for (const ropePx of [32, 48, 64, 96]) {
      const s: SwingState = { anchorX: ANCHOR_X, anchorY: ANCHOR_Y, angle: 384, dir: 1, dwell: 0, ropePx };
      const dx = Math.abs(swingPos(s).xSubs - ANCHOR_X) / SUBS;
      expect(dx).toBeGreaterThan(ropePx * 0.9);
      expect(dx).toBeLessThanOrEqual(ropePx);
    }
  });

  it("ohne Angabe ist alles genau wie ausgeliefert — die Paritäts-Zusage", () => {
    // Seil: die Konstante
    expect(attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X - 40 * SUBS).ropePx).toBe(PAINT.swingRopePx);
    // Eintrittswinkel: die studierten 210 / 302, solange kein Fangpunkt kommt
    expect(attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X - 40 * SUBS).angle).toBe(210);
    expect(attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X + 40 * SUBS).angle).toBe(302);
    // Lift: die studierten −2 px/t
    const bottom: SwingState = { anchorX: ANCHOR_X, anchorY: ANCHOR_Y, angle: 256, dir: 1, dwell: 0, ropePx: PAINT.swingRopePx };
    expect(releaseSwing(bottom).vySubs).toBe(-2 * SUBS);
  });

  it("nimmt den Loslass-Lift als Parameter — er ist der zweite Grund, warum eine Kette geht", () => {
    const bottom: SwingState = { anchorX: ANCHOR_X, anchorY: ANCHOR_Y, angle: 256, dir: 1, dwell: 0, ropePx: 48 };
    for (const lift of [0, 2, 4, 8]) {
      expect(releaseSwing(bottom, lift).vySubs).toBe(-lift * SUBS);
    }
    // …und die waagrechte Geschwindigkeit rührt er nicht an
    expect(releaseSwing(bottom, 8).vxSubs).toBe(releaseSwing(bottom, 0).vxSubs);
  });

  it("setzt die Figur auf den Fangpunkt, wenn einer gereicht wird — sonst auf den festen Bogen", () => {
    // rechts unter dem Ring gefangen: der Bogen beginnt rechts unten, nicht bei 302
    const feetY = ANCHOR_Y + (48 + 22) * SUBS;
    const rechts = attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X + 10 * SUBS, 48, { x: ANCHOR_X + 10 * SUBS, feetY });
    expect(rechts.angle).toBeGreaterThan(256);
    expect(rechts.angle).toBeLessThan(302);
    const links = attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X - 10 * SUBS, 48, { x: ANCHOR_X - 10 * SUBS, feetY });
    expect(links.angle).toBeLessThan(256);
    expect(links.angle).toBeGreaterThan(210);
    // senkrecht darunter gefangen = die Bogen-Unterkante
    expect(attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X, 48, { x: ANCHOR_X, feetY }).angle).toBe(256);
    // und der Winkel bleibt im Pendelbogen, auch wenn das Kind ÜBER dem Ring fasst
    const oben = attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X + 10 * SUBS, 48, { x: ANCHOR_X + 40 * SUBS, feetY: ANCHOR_Y - 40 * SUBS });
    expect(oben.angle).toBeLessThanOrEqual(384);
    expect(oben.angle).toBeGreaterThanOrEqual(128);
  });
});
