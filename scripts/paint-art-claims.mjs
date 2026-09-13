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
