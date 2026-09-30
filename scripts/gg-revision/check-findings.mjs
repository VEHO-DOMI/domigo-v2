// CODEX DRAFT — NOT CANON. Read only; stdout is an evidence receipt, not approval.
import fs from 'node:fs';
import { readFindingsEvidence, findingsErrors, renderFindings } from './findings.mjs';
const [registerPath, evidenceRoot, mode] = process.argv.slice(2);
if (!registerPath || !evidenceRoot || (mode && !['--require-release', '--markdown'].includes(mode))) throw new Error('Usage: check-findings.mjs REGISTER_JSON EXTERNAL_EVIDENCE_ROOT [--require-release|--markdown]');
const register = JSON.parse(fs.readFileSync(registerPath));
const errors = findingsErrors(register, readFindingsEvidence(evidenceRoot), mode === '--require-release');
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else if (mode === '--markdown') process.stdout.write(renderFindings(register));
else {
  const actual = fs.readFileSync(new URL('../../docs/gg/revision/BEFUNDE.md', import.meta.url), 'utf8');
  if (actual !== renderFindings(register)) throw new Error('READER_VISIBLE_REGISTER_DRIFT');
  console.log(JSON.stringify({ rows: register.rows.length, completeReaderSpaces: 40, contentRelease: false, historicalReaderVerdicts: register.readerVerdicts }));
}
