/** Stage-8 pure pieces: gloss-cell parsing + review-table diffing. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { diffItemTable, parseGlossCell } from "../ingest-items.ts";
import { grammarRow, vocabRow } from "../review-items.ts";
import { grammarItem, vocabItem } from "./item-fixtures.ts";

test("parseGlossCell round-trips the rendered format", () => {
  assert.deepEqual(parseGlossCell("—"), []);
  assert.deepEqual(parseGlossCell("carols (= Weihnachtslieder)"), [
    { word: "carols", de: "Weihnachtslieder", scope: null },
  ]);
  assert.deepEqual(parseGlossCell("a (= b) ; c d (= e f)"), [
    { word: "a", de: "b", scope: null },
    { word: "c d", de: "e f", scope: null },
  ]);
  assert.throws(() => parseGlossCell("broken gloss"), /word \(= deutsch\)/);
});

test("diffItemTable: editable-cell edits become patches; immutable cells throw", () => {
  const vItem = vocabItem();
  const rows = [vocabRow(vItem)];
  const idOfRef = new Map([["witch", vItem.id]]);

  const edited = { ...rows[0]!.cells, d: "A woman in stories with a magic broom", "⚑": "" };
  const { patches, editedCells } = diffItemTable("g2-u03", "vocab", [edited], rows, idOfRef);
  assert.equal(editedCells, 1);
  assert.deepEqual(patches[vItem.id], { d: "A woman in stories with a magic broom" });

  const enEdited = { ...rows[0]!.cells, en: "sorceress", "⚑": "" };
  assert.throws(() => diffItemTable("g2-u03", "vocab", [enEdited], rows, idOfRef), /immutable/);

  const unknownRef = { ...rows[0]!.cells, ref: "ghost", "⚑": "" };
  assert.throws(() => diffItemTable("g2-u03", "vocab", [unknownRef], rows, idOfRef), /unknown vocab ref/);
});

test("diffItemTable: vocab hintDe is a rendered, editable column", () => {
  const vItem = vocabItem();
  const row = vocabRow(vItem);
  // hintDe is now part of the rendered cells (and therefore the row hash)
  assert.equal(row.cells["hintDe"], vItem.hintDe);
  const rows = [row];
  const idOfRef = new Map([["witch", vItem.id]]);

  const edited = { ...row.cells, hintDe: "Sie fliegt durch die Nacht.", "⚑": "" };
  const { patches, editedCells } = diffItemTable("g2-u03", "vocab", [edited], rows, idOfRef);
  assert.equal(editedCells, 1);
  assert.deepEqual(patches[vItem.id], { hintDe: "Sie fliegt durch die Nacht." });
});

test("diffItemTable: grammar prompt edit strips the direction suffix; mc arity enforced", () => {
  const gItem = grammarItem({
    id: "g2u03.gi.should.tr.001",
    format: "translation",
    direction: "deToEn",
    prompt: { text: "Wir sollten nach Hause gehen.", lang: "de", blanks: 0 },
    answers: [{ text: "We should go home.", tier: "full" }],
  });
  const rows = [grammarRow(gItem)];
  const idOfRef = new Map([["should.tr.001", gItem.id]]);
  const edited = { ...rows[0]!.cells, prompt: "Wir sollten jetzt nach Hause gehen. [deToEn]", "⚑": "" };
  const { patches } = diffItemTable("g2-u03", "grammar", [edited], rows, idOfRef);
  assert.deepEqual(patches[gItem.id], { promptText: "Wir sollten jetzt nach Hause gehen." });

  const vItem = vocabItem();
  const vRows = [vocabRow(vItem)];
  const vRef = new Map([["witch", vItem.id]]);
  const badMc = { ...vRows[0]!.cells, mc: "ghost ; monster", "⚑": "" };
  assert.throws(() => diffItemTable("g2-u03", "vocab", [badMc], vRows, vRef), /exactly 3/);
});
