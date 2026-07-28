// PK-R3a · THE END-STATES LAW (doc 42 §1, mined from Lost-Pages `dg-bs-still`).
//
// Every overlay animation in this package is authored FROM an offset TO the
// natural state, and every base style is the FINISHED picture. A child whose
// system asks for reduced motion therefore sees a card that is COMPLETE, never
// one stuck mid-entrance. The CSS half of that law lives in overlay-css.ts;
// this module is the JS half — the same question, asked from code, for the
// behaviour that has no CSS to kill (smooth scrolling, timed beats).
//
// SSR-safe: `matchMedia` is read at call time, never at module load, so this
// file can be imported from a component that renders on the server.

/** Does this child's system ask for reduced motion right now? */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined"
  && typeof window.matchMedia === "function"
  && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A duration in ms, collapsed to 0 when motion is reduced — so a timed beat
 *  becomes instantaneous rather than disappearing. */
export const beat = (ms: number): number => (prefersReducedMotion() ? 0 : ms);

/** The scroll behaviour to use for a programmatic move. */
export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "auto" : "smooth");
