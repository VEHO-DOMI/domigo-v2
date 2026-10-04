// CODEX DRAFT — NOT CANON. Test preload only; never imported by production.
const fixed = process.env.GG_GATE_TEST_DATE;
if (!/^\d{4}-\d{2}-\d{2}$/.test(fixed ?? '')) throw new Error('GG_GATE_TEST_DATE required');
const RealDate = Date, instant = RealDate.parse(`${fixed}T12:00:00Z`);
if (!Number.isFinite(instant)) throw new Error('invalid test date');
globalThis.Date = class extends RealDate {
  constructor(...args) { if (args.length) super(...args); else super(instant); }
  static now() { return instant; }
};
