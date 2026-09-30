// CODEX DRAFT — NOT CANON. Offline renderer adapter using installed TypeScript.
// No product file is copied or rewritten. React components remain the real ones.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire, registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(import.meta.dirname, '../..');
const webRequire = createRequire(path.join(root, 'apps/web/package.json'));
const ts = webRequire('typescript');
registerHooks({
  resolve(spec, context, next) {
    if (spec === 'server-only') return { url: 'data:text/javascript,export{}', shortCircuit: true };
    if (spec.startsWith('@domigo/')) {
      const [, name, ...subpath] = spec.split('/');
      const dir = path.join(root, 'packages', name);
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
      const entry = pkg.exports[subpath.length ? './' + subpath.join('/') : '.'];
      if (typeof entry !== 'string') throw new Error(`Unsupported workspace export: ${spec}`);
      return next(pathToFileURL(path.join(dir, entry)).href, context);
    }
    if (spec === 'react' || spec.startsWith('react/') || spec.startsWith('react-dom/')) {
      return next(spec, { ...context, parentURL: pathToFileURL(path.join(root, 'apps/web/package.json')).href });
    }
    if (spec.startsWith('.') && !path.extname(spec) && context.parentURL?.startsWith('file:')) {
      for (const ext of ['.ts', '.tsx']) {
        const url = new URL(spec + ext, context.parentURL);
        if (fs.existsSync(url)) return next(url.href, context);
      }
    }
    return next(spec, context);
  },
  load(url, context, next) {
    if (url.startsWith('file:') && /\.tsx$/.test(url)) {
      const source = ts.transpileModule(fs.readFileSync(fileURLToPath(url), 'utf8'), {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
        fileName: fileURLToPath(url),
      }).outputText;
      return { format: 'module', source, shortCircuit: true };
    }
    return next(url, context);
  },
});
