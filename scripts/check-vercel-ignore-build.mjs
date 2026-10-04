// cgo-075: --selftest runs the nine branch cases; without it, check the real
// Vercel configuration and script from the project's Root Directory (apps/web).
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(new URL('../apps/web/', import.meta.url));
const config = JSON.parse(readFileSync(new URL('../apps/web/vercel.json', import.meta.url)));
assert.equal(config.ignoreCommand, 'sh scripts/vercel-ignore-build.sh');
assert.ok(statSync(new URL('../apps/web/scripts/vercel-ignore-build.sh', import.meta.url)).isFile(),
  'Vercel ignore-build script must exist');
const selftest = process.argv.includes('--selftest');
const cases = selftest ? [
  ['main', 1], ['codex/main', 0], ['codex/beispiel', 0],
  ['feature/beispiel', 0], [undefined, 0], ['', 0],
  ['main-extra', 0], ['codex/main/extra', 0], [' main', 0],
] : [['main', 1], ['codex/beispiel', 0]];
let failures = 0;
for (const [ref, expected] of cases) {
  const env = { ...process.env };
  delete env.VERCEL_GIT_COMMIT_REF;
  if (ref !== undefined) env.VERCEL_GIT_COMMIT_REF = ref;
  const result = spawnSync('sh', ['-c', config.ignoreCommand], { cwd, env, encoding: 'utf8' });
  const ok = !result.error && !result.signal && result.status === expected;
  console.log(`${ok ? 'PASS' : 'FAIL'} ref=${JSON.stringify(ref) ?? '<missing>'}: exit ${result.status}, expected ${expected}`);
  if (!ok) failures++;
}
// Manual Redeploy bypass is owned by Vercel, not this script. See the rule's
// source links; a local test cannot verify the hosted Redeploy implementation.
process.exitCode = failures ? 1 : 0;
