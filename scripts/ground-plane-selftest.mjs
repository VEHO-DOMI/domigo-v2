import assert from "node:assert/strict";
import { PNG } from "pngjs";
import { measureDeck, measureContacts } from "./ground-plane-geometry.mjs";

const table = () => {
  const p = new PNG({ width: 128, height: 100 });
  const rect = (l, t, r, b) => { for (let y = t; y <= b; y++) for (let x = l; x <= r; x++) p.data[(y * p.width + x) * 4 + 3] = 255; };
  rect(8, 20, 119, 31); rect(16, 32, 31, 99); rect(96, 32, 111, 99);
  return p;
};
const clear = (p, l, t, r, b) => {
  for (let y = Math.max(0, t); y <= Math.min(p.height - 1, b); y++) for (let x = l; x <= r; x++) p.data[(y * p.width + x) * 4 + 3] = 0;
};
const contract = { width: 128, height: 100, baseline: 99, spans: [[16, 31], [96, 111]], sha256: "fixture" };

export const geometrySelftest = ({ judgeBinding, activeGroundBindings, applyGroundPending }) => {
  const check = (p, deck = 0.2, c = contract) => judgeBinding("table", p, { role: "deck", deck }, "fixture", { table: c });
  assert.deepEqual(check(table()).errors, [], "frontaler Tisch mit zwei kurzen Füßen");
  const raised = table();
  for (let y = 0; y < 20; y++) for (let x = 50; x <= 77; x++) raised.data[(y * raised.width + x) * 4 + 3] = 255;
  assert.deepEqual(check(raised).errors, [], "Pultaufsatz oberhalb der Laufkante");
  const pinhole = table(); clear(pinhole, 60, 20, 60, 22);
  assert.deepEqual(check(pinhole).errors, [], "einzelnes Pigmentloch innerhalb der bestehenden räumlichen Toleranz");
  const cases = [
    ["oberes V", (p) => { for (let x = 8; x <= 119; x++) clear(p, x, 20, x, 20 + Math.round(Math.abs(x - 64) * 0.4)); }],
    ["obere 8°-Kante", (p) => { for (let x = 8; x <= 119; x++) clear(p, x, 20, x, 20 + Math.round((x - 8) * Math.tan(8 * Math.PI / 180))); }],
    ["durchbrochene Platte", (p) => clear(p, 60, 20, 67, 31)],
    ["nur ein gemalter Strich", (p) => clear(p, 8, 21, 119, 31)],
    ["ein Fuß schwebt", (p) => clear(p, 16, 88, 31, 99)],
    ["beide Füße schweben", (p) => { clear(p, 16, 88, 31, 99); clear(p, 96, 88, 111, 99); }],
    ["V-Fuß unter gerader Platte", (p) => { for (let x = 16; x <= 31; x++) clear(p, x, 100 - Math.round(Math.abs(x - 23.5) * 1.2), x, 99); }],
    ["8°-Fuß unter gerader Platte", (p) => { for (let x = 16; x <= 31; x++) clear(p, x, 100 - Math.round((x - 16) * Math.tan(8 * Math.PI / 180)), x, 99); }],
    ["nicht registrierter dritter Fuß", (p) => { for (let y = 32; y < 100; y++) for (let x = 60; x <= 67; x++) p.data[(y * p.width + x) * 4 + 3] = 255; }],
  ];
  for (const [name, mutate] of cases) {
    const p = table(); mutate(p);
    assert(check(p).errors.length > 0, `${name} blieb grün`);
    // These pixel cases deliberately retain a matching fixture hash, proving
    // geometric checks fail independently of the additional hash protection.
  }
  assert(measureDeck(table(), 0.3).errors.length > 0, "falsches deck");
  assert(measureDeck(table(), NaN).errors.length > 0, "ungültiges deck");
  const narrow = new PNG({ width: 128, height: 64 });
  for (let y = 8; y < 64; y++) for (let x = 56; x < 72; x++) narrow.data[(y * narrow.width + x) * 4 + 3] = 255;
  assert(judgeBinding("narrow", narrow, { role: "deck", deck: 8 / 64 }, "fixture", {}).errors.some((e) => e.includes("Bildrahmen")), "schmale Malerei darf keine breite unsichtbare Plattform freigeben");
  assert(measureContacts(table(), contract, "changed").errors.some((e) => e.includes("Bildhash")), "Hashdrift");
  assert(measureContacts(table(), { ...contract, spans: [[20, 27], [100, 107]] }, "fixture").errors.some((e) => e.includes("fehlt")), "herausgepickte Fußmitte");
  assert(measureContacts(table(), { ...contract, baseline: 80 }, "fixture").errors.length > 0, "tiefer ausgewählte Ersatzgrundlinie");
  assert(measureContacts(table(), { ...contract, spans: [[16, 31], [16, 31]] }, "fixture").errors.length > 0, "Doppelbesitz");
  const kit = { crust: ["c"], body: ["b"], fade: ["f"], sediment: "s", platObjects: [{ stem: "live", cells: 2, deck: 0.2 }, { stem: "unused", cells: 4, deck: 0 }] };
  const bindings = activeGroundBindings([{ id: "tiny", rows: ["....", ".##.", "...."] }], { tiny: { mass: kit } }, () => ({ w: 128, h: 100 }));
  assert.deepEqual(bindings.map((b) => b.stem), ["live"], "nur wirklich gezeichnete Möbelbindung");
  const failed = { groundErrors: ["foot"], deckErrors: ["deck"], errors: ["foot", "deck"] };
  assert.deepEqual(applyGroundPending(failed, { sha256: "old" }, "old"), { used: true, errors: ["deck"] }, "Fußduldung darf Deckfehler nicht verdecken");
  assert.deepEqual(applyGroundPending(failed, { sha256: "old" }, "new"), { used: false, errors: ["foot", "deck"] }, "Neubild erbt keine Duldung");
  assert.deepEqual(applyGroundPending({ ...failed, contactRegistered: true }, { sha256: "old" }, "old"), { used: false, errors: ["foot", "deck"] }, "Kontaktregisterfehler sind niemals historisch geduldet");
  assert.deepEqual(applyGroundPending({ ...failed, groundErrors: [], errors: ["deck"] }, { sha256: "old" }, "old"), { used: false, errors: ["deck"] }, "behobener Fuß verbraucht keine Duldung");
  console.log(`ground-plane geometry: 3 positive + ${cases.length + 7} negative checks OK; active-plan + 4 waiver-scope checks OK`);
};
