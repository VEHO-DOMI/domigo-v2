/**
 * Deploy-truth (T-2): the live build advertises the git commit it was built from.
 * `scripts/verify-deploy.mjs` compares this to origin/main, so "what's live" is
 * provable rather than assumed. A blank/placeholder deploy — e.g. an un-connected
 * Vercel project serving the "Create Next App" scaffold — has no such route, so
 * the check fails loudly instead of a green-looking 404. No secrets, no DB
 * access, nothing to import: safe to expose, and can't itself be the thing that
 * breaks a build.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown",
    ref: process.env.VERCEL_GIT_COMMIT_REF ?? "unknown",
    env: process.env.VERCEL_ENV ?? "unknown",
  });
}
