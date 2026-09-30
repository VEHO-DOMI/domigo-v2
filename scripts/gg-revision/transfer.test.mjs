// CODEX DRAFT — NOT CANON. Real grader; semantic cases are individually motivated.
import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeGrammar } from '../../packages/engine/src/index.ts';
import { pilotData } from './pilot-data.mjs';
const item = pilotData().find(e => e.itemId === 'g1u01.gi.imperatives.tr.900').item;
const grade = value => gradeGrammar(item, { kind: 'text', value }).tier;
test('negative imperative accepts speak/talk, expansion and politeness', () => {
  for (const answer of ["Don't speak!", 'Do not speak!', "Don't speak, please.", "Please don't speak.", 'Do not speak, please.', 'Please do not speak.', "Don't talk!", 'Do not talk!', "Don't talk, please.", "Please don't talk.", 'Do not talk, please.', 'Please do not talk.']) assert.equal(grade(answer), 'correct', answer);
});
test('communicative alternatives and plausible errors do not become correct rule demonstrations', () => {
  for (const answer of ['Stop talking!', 'Be quiet!', 'Speak!', 'Talk!', 'Not talk!', "Don't talks!", "Don't speaking!", "Doesn't talk!", "Don't listen!", "Don't write!"]) assert.notEqual(grade(answer), 'correct', answer);
});
