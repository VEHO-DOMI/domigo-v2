import assert from "node:assert/strict";
import { test } from "node:test";
import { tripCopyFor } from "../trip-copy.ts";

test("tripCopyFor: distinct skins per trip story; unknown falls back to the original", () => {
  const lfw = tripCopyFor("g4.st.lost-for-words");
  const live = tripCopyFor("g4.st.fourteen-live");

  // brand + economy differ (journal/lines vs rundown/takes)
  assert.equal(lfw.title, "LOST FOR WORDS");
  assert.equal(live.title, "FOURTEEN: LIVE");
  assert.equal(lfw.economyNoun, "lines");
  assert.equal(live.economyNoun, "takes");
  assert.equal(live.hubNoun, "Segment");
  assert.equal(live.boardStampedWord, "recorded");

  // each pack stamps its OWN chapters only (no cross-bleed)
  assert.ok(live.dayStamp["g4.st.fourteen-live.ch13"], "sequel has a ch13 stamp");
  assert.equal(live.dayStamp["g4.st.lost-for-words.ch01"], undefined);

  // the sequel's slot kinds (name-it/fix-it/recap) get newsroom prompts, not the fallback
  assert.match(live.slotPrompt("name-it"), /report/);
  assert.match(live.slotPrompt("fix-it"), /record/);
  assert.match(live.slotPrompt("recap"), /story/);

  // the economy re-labels the SAME hidden XP (Law 5) — the number is passed through
  assert.match(live.resultLine("correct", 30).text, /\+30 takes/);
  assert.match(lfw.resultLine("correct", 30).text, /\+30 lines/);

  // unknown story never throws — falls back to the original skin
  assert.equal(tripCopyFor("g9.st.unknown").title, "LOST FOR WORDS");
});
