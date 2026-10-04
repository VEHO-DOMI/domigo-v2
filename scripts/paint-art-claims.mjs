// CODEX DRAFT — NOT CANON. File identity follows resolvePaintArt: hero first, own chapter wins.
import { allScopePhases, domArtStems, phaseArtScope } from '../packages/game-paint/src/artScope.ts';

/** Relative PNG paths under paint/, not a flattened union of unrelated chapters. */
export const chapterArtFiles = (files, chapter) => {
  const disk = [...files], resolved = new Map();
  for (const dir of ['hero', chapter]) for (const file of disk) {
    const slash = file.lastIndexOf('/');
    if (file.slice(0, slash) !== dir || !file.endsWith('.png')) continue;
    resolved.set(file.slice(slash + 1, -4), file);
  }
  return resolved;
};

/** Drafts may own present loaded art; this does not impose missing-art requirements. */
export const loadedArtClaims = (levels, files) => {
  const disk = [...files], byChapter = new Map(), claimed = new Map();
  for (const { file: levelFile, level, tasks = [] } of levels) {
    let resolved = byChapter.get(level.chapter);
    if (!resolved) { resolved = chapterArtFiles(disk, level.chapter); byChapter.set(level.chapter, resolved); }
    const present = new Set(resolved.keys());
    const claim = (stem, where) => {
      const file = resolved.get(stem);
      if (!file) return;
      const owners = claimed.get(file) ?? new Set();
      owners.add(`${levelFile} ${where}`); claimed.set(file, owners);
    };
    for (const ph of allScopePhases(level)) {
      for (const stem of phaseArtScope(level, ph.id, present)) claim(stem, ph.id);
    }
    for (const stem of domArtStems(level)) claim(stem, 'DOM');
    // These are HTML card images, even when a scene uses a different observation view.
    for (const task of tasks) {
      const stimulus = task.stimulus;
      const stem = stimulus?.type === 'entity' ? stimulus.art : stimulus?.type === 'image' ? stimulus.stem : undefined;
      if (typeof stem === 'string') claim(stem, `task ${task.id} DOM`);
    }
  }
  return { byChapter, claimed, dead: disk.filter(file => !claimed.has(file)) };
};

/** cgo-017: a finding is an exact source binding, never a general waiver.
 * Closed/historical rows cannot authorize anything. Duplicate IDs fail closed.
 * This parser is pure; each caller explicitly supplies the register text. */
export const findingRows = text => text.split('\n').flatMap((line, index) => {
  const cells = line.split(/(?<!\\)\|/).slice(1, -1).map(s => s.trim().replace(/\\\|/g, '|'));
  if (cells.length !== 7 || !/^D-\d+$/.test(cells[0])) return [];
  const [id, status, scope, reason, resolution, owner, proof] = cells;
  if (!/^(?:content\/.*\.policy\.json#\/vocabLedger\/|docs\/.*\/claims\.json#\/claims\/|scripts\/paint-art-allowlist\.json#\/|scripts\/check-ground-plane\.mjs#\/GROUND_PLANE_PENDING\/)/.test(scope)) return [];
  return [{ id, status, scope, reason, resolution, owner, proof, line: index + 1 }];
});
export const openFindingMap = text => {
  const ids = text.split('\n').flatMap(line => [...line.matchAll(/^\| (?:~~)?(D-\d+)(?:~~)? \|/g)].map(m => m[1]));
  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  return new Map(findingRows(text)
    .filter(r => counts.get(r.id) === 1 && r.status === 'offen' && r.reason && r.resolution && r.owner && r.proof)
    .map(r => [r.id, r.scope]));
};
export const findingError = (id, scope, findings) =>
  typeof id !== 'string' || !/^D-\d+$/.test(id) || findings.get(id) !== scope
    ? `Befund ${String(id)} fehlt, ist geschlossen oder passt nicht exakt zu ${scope}` : null;
export const vocabFindingScope = (chapter, id) => `content/corpus/stories/g1.st.lost-pages/paint/${chapter}.policy.json#/vocabLedger/${id}`;
export const claimFindingScope = (chapter, word) => `docs/design/g1/paint/${chapter}-dossiers-v2/claims.json#/claims/${word}`;
export const artFindingScope = stem => `scripts/paint-art-allowlist.json#/${stem}`;
export const groundFindingScope = stem => `scripts/check-ground-plane.mjs#/GROUND_PLANE_PENDING/${stem}`;
