// CODEX DRAFT — NOT CANON. Loopback-only teacher preview; no database.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { build, defaultOutput } from './build.mjs';

const arg = (name, fallback) => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback;
const port = Number(arg('--port', '4177'));
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Use a port between 1024 and 65535');
const out = path.resolve(arg('--out', defaultOutput));
if (!process.argv.includes('--no-build')) await build(out);
const { tasks, answers, explanations } = JSON.parse(await readFile(path.join(out, 'tasks.private.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(out, 'build.json'), 'utf8'));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8' };
function grade(task, choice) {
  const correct = answers[task].some((x) => x.tier === 'full' && x.text === choice);
  return { correct, explanation: explanations[task][correct ? 'correct' : 'wrong'] };
}
const server = createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  const json = (code, body) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(body)); };
  try {
    if (![`127.0.0.1:${port}`, `localhost:${port}`].includes(req.headers.host)) return json(403, { error: 'Local preview only' });
    if (req.headers.origin && ![`http://127.0.0.1:${port}`, `http://localhost:${port}`].includes(req.headers.origin)) return json(403, { error: 'Same origin only' });
    const pathname = new URL(req.url, `http://127.0.0.1:${port}`).pathname;
    if (req.method === 'GET' && pathname === '/api/tasks') return json(200, tasks);
    if (req.method === 'GET' && pathname === '/api/version') return json(200, { label: manifest.label, base: manifest.base, head: manifest.head, files: manifest.files });
    if (req.method === 'POST' && ['/api/answer', '/api/scenario'].includes(pathname)) {
      let raw = '';
      for await (const chunk of req) { raw += chunk; if (raw.length > 2048) return json(413, { error: 'Too large' }); }
      let data;
      try { data = JSON.parse(raw); } catch { return json(400, { error: 'Invalid JSON' }); }
      if (!Object.hasOwn(tasks, data.task)) return json(400, { error: 'Unknown task' });
      if (pathname === '/api/scenario') {
        if (typeof data.correct !== 'boolean') return json(400, { error: 'Choose a scenario' });
        const choice = tasks[data.task].options.find((x) => grade(data.task, x).correct === data.correct);
        return json(200, { choice, result: grade(data.task, choice) });
      }
      if (!tasks[data.task].options.includes(data.choice)) return json(400, { error: 'Choose an available answer' });
      return json(200, grade(data.task, data.choice));
    }
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (req.method !== 'GET' || !Object.hasOwn(manifest.files, file)) return json(404, { error: 'Not found' });
    const bytes = await readFile(path.join(out, file));
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(bytes);
  } catch { json(500, { error: 'Preview unavailable' }); }
});
server.listen(port, '127.0.0.1', () => console.log(`CODEX DRAFT — NOT CANON · http://127.0.0.1:${port} · ${out}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
