// CODEX DRAFT — NOT CANON · cgo-006. Pure checks; never writes a release state.
import { createHash } from 'node:crypto';

export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const digest = value => sha256(canonical(value));

/** Complete membership, not a count-only comparison: replacement and duplicates fail. */
export function compareIds(expected, actual) {
  const want = new Set(expected), got = new Set(actual);
  return [
    ...expected.filter(id => !got.has(id)).map(id => `MISSING: ${id}`),
    ...actual.filter(id => !want.has(id)).map(id => `UNEXPECTED: ${id}`),
    ...(got.size !== actual.length ? ['DUPLICATE: actual ids'] : []),
    ...(want.size !== expected.length ? ['DUPLICATE: expected ids'] : []),
  ];
}

/** The one item envelope binds every authored answer pool and every declared view. */
export function makeBinding({ itemId, source, content, answers, views, renderer }) {
  return {
    schema: 'domigo-revision-binding@1', itemId,
    sourceSha256: digest(source), contentSha256: digest(content),
    answersSha256: digest(answers), viewsSha256: digest(views), rendererSha256: digest(renderer),
  };
}
export function checkBinding(frozen, current) {
  const errors = [];
  for (const field of ['schema', 'itemId', 'sourceSha256', 'contentSha256', 'answersSha256', 'viewsSha256', 'rendererSha256']) {
    if (frozen[field] !== current[field]) errors.push(`DRIFT:${field}`);
  }
  return errors;
}

/** Ranking drift discards ranking; approval drift blocks. Neither grants publication. */
export function approvalErrors(seal, current, sourceVerified) {
  const errors = checkBinding(seal.binding, current);
  if (!sourceVerified) errors.push('SOURCE:UNVERIFIZIERT');
  if (seal.state !== 'draft') errors.push('W0:ONLY_DRAFT_ALLOWED');
  const currentDigest = digest(current);
  const readers = seal.solvers ?? [];
  if (readers.length !== 2 || new Set(readers.map(r => r.session)).size !== 2) errors.push('READERS:TWO_INDEPENDENT_REQUIRED');
  for (const r of readers) {
    if (!r.session || r.session === seal.author || r.verdict !== 'yes' || r.bindingSha256 !== currentDigest) errors.push('READERS:INVALID_OR_STALE');
  }
  if (seal.kokiVerdict?.verdict !== 'yes' || seal.kokiVerdict?.bindingSha256 !== currentDigest) errors.push('KOKI:REQUIRED_FOR_THIS_BINDING');
  return errors;
}
export const rankingStatus = (oldBinding, current) => checkBinding(oldBinding, current).length ? 'unranked' : 'current';

/** Frozen solver packets contain rendered HTML only, never scripts or item JSON. */
export function solverHtmlErrors(html) {
  const errors = [];
  if (/<script\b|\bon\w+\s*=|javascript:|data:application\/json/i.test(html)) errors.push('SOLVER:EXECUTABLE_OR_DATA_PAYLOAD');
  if (/\b(?:sAnswers|dAnswers|correctIndex|answerKey|taskSha256)\b/.test(html)) errors.push('SOLVER:KEY_METADATA');
  if (/<input\b[^>]*\bvalue=["'][^"']+/i.test(html)) errors.push('SOLVER:PREFILLED_INPUT');
  return errors;
}
