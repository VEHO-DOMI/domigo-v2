#!/usr/bin/env node
/**
 * T-2 deploy-truth: prove that what's live at --url is the code on origin/main.
 *
 *   node scripts/verify-deploy.mjs --url https://domigo-v2.vercel.app
 *
 * Exits non-zero (and says why) when:
 *   - the URL doesn't serve /api/version at all (a blank/placeholder deploy — the
 *     exact failure that hid the un-connected Vercel project for weeks), or
 *   - the live commit SHA differs from origin/main (prod is behind / ahead).
 * No credentials, no writes — just an HTTP GET plus a local `git rev-parse`.
 */
import { execSync } from "node:child_process";

const argv = process.argv.slice(2);
const i = argv.indexOf("--url");
const url = i >= 0 ? argv[i + 1] : null;
if (!url || url.startsWith("--")) {
  console.error("usage: node scripts/verify-deploy.mjs --url <prod-url>");
  process.exit(2);
}

let localSha;
try {
  localSha = execSync("git rev-parse origin/main", { encoding: "utf8" }).trim();
} catch {
  // origin/main not fetched locally — fall back to HEAD with a note.
  localSha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  console.warn("! origin/main not available locally; comparing against HEAD");
}

let live;
try {
  const res = await fetch(new URL("/api/version", url), { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error(`GET /api/version → HTTP ${res.status}`);
  live = await res.json();
} catch (e) {
  console.error(`✗ deploy-truth FAILED: ${e.message}`);
  console.error(`  ${url} did not serve /api/version — an empty or placeholder deploy looks exactly like this.`);
  console.error(`  (Is the Vercel project connected to the repo and building apps/web?)`);
  process.exit(1);
}

const ok = live.sha === localSha;
console.log(`  live:        ${live.sha}  (env=${live.env}, ref=${live.ref})`);
console.log(`  origin/main: ${localSha}`);
console.log(
  ok
    ? "✓ deploy-truth OK — production is exactly origin/main"
    : "✗ deploy-truth FAILED — production is a DIFFERENT commit than origin/main (redeploy, or a build is stuck)",
);
process.exit(ok ? 0 : 1);
