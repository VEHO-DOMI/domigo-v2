/** Conservative gross-cycle estimate. Missing measurements never mean zero.
 * Rates, plan and region come from the deploy owner's current bill, not defaults. */
export function liveCycleCost(input) {
  const quantities = ['quizHoursPerCycle', 'invocationsPerQuizHour', 'activeCpuHoursPerQuizHour', 'memoryGbHoursPerQuizHour', 'transferGbPerQuizHour', 'otherCycleUsd', 'headroomMultiplier'];
  const rates = ['invocationsPerMillionUsd', 'activeCpuHourUsd', 'memoryGbHourUsd', 'transferGbUsd'];
  const missing = [];
  for (const field of quantities) if (typeof input?.[field] !== 'number' || !Number.isFinite(input[field]) || input[field] < 0) missing.push(field);
  for (const field of rates) if (typeof input?.rates?.[field] !== 'number' || !Number.isFinite(input.rates[field]) || input.rates[field] < 0) missing.push(`rates.${field}`);
  for (const field of ['measuredAt', 'cycleDefinition', 'plan', 'region', 'measurementEvidence', 'rateEvidence']) if (typeof input?.[field] !== 'string' || !input[field].trim()) missing.push(field);
  if (input?.headroomMultiplier < 1) missing.push('headroomMultiplier>=1');
  if (!Number.isFinite(Date.parse(input?.measuredAt))) missing.push('measuredAt ISO date');
  if (missing.length) return { status: 'UNVERIFIZIERT', allowed: false, missing };
  const r = input.rates;
  const hourly = input.invocationsPerQuizHour / 1e6 * r.invocationsPerMillionUsd
    + input.activeCpuHoursPerQuizHour * r.activeCpuHourUsd
    + input.memoryGbHoursPerQuizHour * r.memoryGbHourUsd
    + input.transferGbPerQuizHour * r.transferGbUsd;
  const rawCycleUsd = input.otherCycleUsd + hourly * input.quizHoursPerCycle * input.headroomMultiplier;
  const cycleUsd = Math.ceil(rawCycleUsd * 100) / 100; // conservative rounding to a billed cent
  if (!Number.isFinite(cycleUsd)) return { status: 'UNVERIFIZIERT', allowed: false, missing: ['finite total'] };
  // Strictly below the cap. Exactly USD 20 already triggers Word Duel fallback.
  return { status: cycleUsd < 20 ? 'UNDER_LIMIT' : 'WORD_DUEL_ONLY', allowed: cycleUsd < 20, hourlyUsd: hourly, cycleUsd, limitUsd: 20 };
}
