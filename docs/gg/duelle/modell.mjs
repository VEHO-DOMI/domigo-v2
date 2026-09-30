// CODEX DRAFT — NOT CANON. Local specification model; no product scoring/storage.
import { text } from './texte.mjs';
export const revision = 'cgo-018-textmodell-2';
export function admission(config) {
  if (!config.consentA || !config.consentB) return { ok: false, reason: text('noConsent') };
  if (!config.knownA || !config.knownB) return { ok: false, reason: text('notKnown') };
  if (config.timeScoring !== false) return { ok: false, reason: text('timeForbidden') };
  if (config.abortPenalty !== 0) return { ok: false, reason: text('penaltyForbidden') };
  if (!config.deckA || config.deckA !== config.deckB || !config.helpA || config.helpA !== config.helpB) return { ok: false, reason: text('mismatch') };
  return { ok: true, reason: '' };
}
export function initial() { return { stage: 'welcome', mode: 'pair', round: 0, answers: ['', ''], revealed: [false, false], returnStage: null, endReturnStage: null, consentA: false, consentB: false, knownA: false, knownB: false }; }
export function reduce(state, action) {
  if (action.type === 'pause' && ['question', 'feedback', 'handover'].includes(state.stage)) return { ...state, returnStage: state.stage, stage: 'paused' };
  if (action.type === 'resume' && state.stage === 'paused') return { ...state, stage: state.returnStage, returnStage: null };
  if (action.type === 'ask-end' && state.stage !== 'ended') return { ...state, endReturnStage: state.stage, stage: 'end-confirm' };
  if (action.type === 'keep' && state.stage === 'end-confirm') return { ...state, stage: state.endReturnStage, endReturnStage: null };
  if (action.type === 'end' && state.stage === 'end-confirm') return { ...initial(), stage: 'ended' };
  if (action.type === 'restart') return initial();
  if (action.type === 'prepare' && ['welcome', 'ready'].includes(state.stage)) return { ...initial(), mode: action.mode === 'solo' ? 'solo' : 'pair', stage: 'prepare' };
  if (action.type === 'ready' && state.stage === 'prepare') return { ...state, stage: 'ready' };
  if (action.type === 'confirm' && state.stage === 'ready' && ['consentA','consentB','knownA','knownB'].includes(action.field)) return { ...state, [action.field]: action.value === true };
  if (action.type === 'practice' && state.stage === 'ready') return { ...state, stage: 'prepare', knownA: false, knownB: false };
  if (action.type === 'start' && state.stage === 'ready' && admission({ ...action.config, consentA: state.consentA, consentB: state.mode === 'solo' || state.consentB, knownA: state.knownA, knownB: state.mode === 'solo' || state.knownB }).ok) return { ...state, stage: 'question' };
  if (action.type === 'choose' && state.stage === 'question' && typeof action.value === 'string') return { ...state, answers: state.answers.map((x,i) => i === state.round ? action.value : x) };
  if (action.type === 'reveal' && state.stage === 'question' && state.answers[state.round]) return { ...state, stage: 'feedback', revealed: state.revealed.map((x,i) => i === state.round ? true : x) };
  if (action.type === 'retry' && state.stage === 'feedback') return { ...state, stage: 'question' };
  if (action.type === 'next' && state.stage === 'feedback') return { ...state, stage: state.round === 0 ? 'handover' : 'summary' };
  if (action.type === 'handover' && state.stage === 'handover') return { ...state, round: 1, stage: 'question' };
  return state;
}
