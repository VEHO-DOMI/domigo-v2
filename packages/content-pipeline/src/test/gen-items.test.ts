/** Stage-5 pure pieces: fingerprints, id minting, fingerprint re-keying. */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  itemFingerprint,
  mintGrammarItemIds,
  readUnitItems,
  regenerateUnitItems,
  rekeyFingerprint,
  type ItemsLock,
  type UnitItems,
} from "../gen-items.ts";

const BASE = {
  structureId: "g2u03.s.should",
  format: "gap-fill",
  prompt: { text: "We ___ go home – it's late.", blanks: 1 },
  answers: [{ text: "should", tier: "full" as const }],
  pairs: [],
  groups: [],
  distractors: [],
};

test("fingerprint: gloss/punctuation-stable, content-sensitive", () => {
  const fp = itemFingerprint(BASE);
  // punctuation + added gloss keep identity
  assert.equal(itemFingerprint({ ...BASE, prompt: { text: "We ___ go home — it's late!", blanks: 1 } }), fp);
  assert.equal(itemFingerprint({ ...BASE, prompt: { text: "We ___ go home (= nach Hause) – it's late.", blanks: 1 } }), fp);
  // carrier / answers / format / structure / blanks changes mint new identity
  assert.notEqual(itemFingerprint({ ...BASE, prompt: { text: "We ___ go to school – it's late.", blanks: 1 } }), fp);
  assert.notEqual(itemFingerprint({ ...BASE, answers: [{ text: "shouldn't", tier: "full" }] }), fp);
  assert.notEqual(itemFingerprint({ ...BASE, format: "multiple-choice" }), fp);
  assert.notEqual(itemFingerprint({ ...BASE, structureId: "g2u03.s.other" }), fp);
  // pair content is identity for pair formats
  const mt = { ...BASE, format: "matching", answers: [], pairs: [{ left: "We should", right: "go home." }, { left: "You shouldn't", right: "shout." }, { left: "Should I", right: "ask?" }] };
  assert.notEqual(itemFingerprint(mt), itemFingerprint({ ...mt, pairs: [...mt.pairs.slice(0, 2), { left: "Should I", right: "go?" }] }));
  // pair ORDER does not matter (sorted)
  assert.equal(itemFingerprint(mt), itemFingerprint({ ...mt, pairs: [...mt.pairs].reverse() }));
});

test("minting: serials per structure+format, reuse by fingerprint, tombstones", () => {
  const d1 = { fingerprint: itemFingerprint(BASE), structureKey: "should", format: "gap-fill" as const };
  const d2 = { fingerprint: itemFingerprint({ ...BASE, answers: [{ text: "shouldn't", tier: "full" }] }), structureKey: "should", format: "gap-fill" as const };
  const first = mintGrammarItemIds("g2-u03", "g2u03", [d1, d2], null, "aaaaaaaaaaaa");
  assert.deepEqual(first.ids, ["g2u03.gi.should.gf.001", "g2u03.gi.should.gf.002"]);

  // re-ingest of a cosmetically reshuffled draft → identical ids, no lock change
  const second = mintGrammarItemIds("g2-u03", "g2u03", [d2, d1], first.lock, "bbbbbbbbbbbb");
  assert.deepEqual(second.ids, ["g2u03.gi.should.gf.002", "g2u03.gi.should.gf.001"]);
  assert.equal(second.lockChanged, false);

  // changed carrier → new id; old fingerprint tombstoned; serial never reused
  const d1changed = { ...d1, fingerprint: itemFingerprint({ ...BASE, prompt: { text: "You ___ sleep more.", blanks: 1 } }) };
  const third = mintGrammarItemIds("g2-u03", "g2u03", [d1changed, d2], first.lock, "cccccccccccc");
  assert.deepEqual(third.ids, ["g2u03.gi.should.gf.003", "g2u03.gi.should.gf.002"]);
  assert.ok(third.lock.tombstones.some((t) => t.id === "g2u03.gi.should.gf.001" && t.removedWith === "cccccccccccc"));

  // duplicate fingerprints in one draft are rejected
  assert.throws(() => mintGrammarItemIds("g2-u03", "g2u03", [d1, d1], null, "dddddddddddd"), /share fingerprint/);
});

test("rekeyFingerprint: review edits keep the id, move the pin", () => {
  const lock: ItemsLock = {
    schema: "items-lock@1",
    slug: "g2-u03",
    items: { aaaaaaaaaaaa: "g2u03.gi.should.gf.001", bbbbbbbbbbbb: "g2u03.gi.should.gf.002" },
    tombstones: [],
  };
  assert.equal(rekeyFingerprint(lock, "g2u03.gi.should.gf.001", "cccccccccccc"), true);
  assert.equal(lock.items["cccccccccccc"], "g2u03.gi.should.gf.001");
  assert.ok(!("aaaaaaaaaaaa" in lock.items));
  // no-op when unchanged
  assert.equal(rekeyFingerprint(lock, "g2u03.gi.should.gf.001", "cccccccccccc"), false);
  // collision with another id is refused
  assert.throws(() => rekeyFingerprint(lock, "g2u03.gi.should.gf.001", "bbbbbbbbbbbb"), /collision/);
});

// Regenerability (design principle 10): the committed g2-u03 unit went through
// several fix rounds (validator fixes, w.sick, w.shall, trick-or-treat hyphens)
// plus 3 stage-8 reviewer cell-edits. `draft + item-fixes + lock` must still
// reproduce the approved corpus — proving fix-rounds keep the drafts in sync.
const stripRev = (items: UnitItems["vocab"] | UnitItems["grammar"]): unknown[] =>
  items.map(({ rev, ...rest }) => rest);

test("regenerateUnitItems: committed g2-u03 round-trips from draft + item-fixes", () => {
  const committed = readUnitItems("g2-u03");
  assert.ok(committed.vocab.length === 34 && committed.grammar.length === 27, "fixture corpus present");

  // byte-reproduction with rev continuity (prev = committed)
  assert.deepEqual(regenerateUnitItems("g2-u03"), committed);

  // content fully determined by draft + item-fixes + lock alone (empty prev → all rev=1)
  const fresh = regenerateUnitItems("g2-u03", { vocab: [], grammar: [] });
  assert.deepEqual(stripRev(fresh.vocab), stripRev(committed.vocab));
  assert.deepEqual(stripRev(fresh.grammar), stripRev(committed.grammar));
  assert.ok(
    fresh.vocab.every((i) => i.rev === 1) && fresh.grammar.every((i) => i.rev === 1),
    "an empty prev yields rev=1 everywhere",
  );
});
