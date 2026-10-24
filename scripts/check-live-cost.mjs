#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { liveCycleCost } from './lib/live-cost.mjs';
const args = process.argv.slice(2);
if (args.includes('--selftest')) {
  const fixture = { measuredAt: '2026-10-24T00:00:00Z', cycleDefinition: 'synthetic bounded cycle', plan: 'synthetic', region: 'synthetic', measurementEvidence: 'synthetic-test', rateEvidence: 'synthetic-test', quizHoursPerCycle: 1, invocationsPerQuizHour: 46800, activeCpuHoursPerQuizHour: 0, memoryGbHoursPerQuizHour: 0, transferGbPerQuizHour: 0, otherCycleUsd: 0, headroomMultiplier: 1, rates: { invocationsPerMillionUsd: 1, activeCpuHourUsd: 1, memoryGbHourUsd: 1, transferGbUsd: 1 } };
  assert.equal(liveCycleCost(fixture).cycleUsd, .05);
  const cases = [
    [{ ...fixture, otherCycleUsd: 19.9532 }, 'WORD_DUEL_ONLY'],
    [{ ...fixture, otherCycleUsd: 20 }, 'WORD_DUEL_ONLY'],
    [{ ...fixture, otherCycleUsd: 19.95 }, 'WORD_DUEL_ONLY'],
    [{ ...fixture, otherCycleUsd: 19 }, 'UNDER_LIMIT'],
    [{ ...fixture, memoryGbHoursPerQuizHour: 21 }, 'WORD_DUEL_ONLY'],
    [{ ...fixture, activeCpuHoursPerQuizHour: undefined }, 'UNVERIFIZIERT'],
    [{ ...fixture, rates: {} }, 'UNVERIFIZIERT'],
    [{ ...fixture, headroomMultiplier: .5 }, 'UNVERIFIZIERT'],
    [{ ...fixture, invocationsPerQuizHour: NaN }, 'UNVERIFIZIERT'],
    [{ ...fixture, rateEvidence: '' }, 'UNVERIFIZIERT'],
    [{ ...fixture, cycleDefinition: '' }, 'UNVERIFIZIERT'],
    [{ ...fixture, quizHoursPerCycle: Infinity }, 'UNVERIFIZIERT'],
    [{ ...fixture, measuredAt: 'unknown' }, 'UNVERIFIZIERT'],
  ];
  for (const [value, expected] of cases) assert.equal(liveCycleCost(value).status, expected);
  console.log(`live-cost: 14 cases passed; missing evidence and USD 20 close the gate`);
} else {
  const i = args.indexOf('--measurement');
  if (i < 0 || !args[i + 1]) throw Error('Use --measurement /path/to/anonymized-measurement.json or --selftest');
  const result = liveCycleCost(JSON.parse(fs.readFileSync(args[i + 1], 'utf8')));
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.allowed ? 0 : result.status === 'UNVERIFIZIERT' ? 2 : 1;
}
