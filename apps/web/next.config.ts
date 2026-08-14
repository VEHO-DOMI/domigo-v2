import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel ships each serverless function with only the files STATIC analysis
  // can trace. The corpus is read at runtime via readdirSync/readFileSync
  // (content-loader walks up from cwd to find content/corpus/units), which is
  // invisible to tracing — without this include, PROD FUNCTIONS HAVE NO CORPUS
  // and every content-reading route fails silently behind its .catch()
  // (found 2026-07-13: the checkup builder's unit catalog came back empty on
  // prod). The glob is relative to this app dir; corpus + overlays cover every
  // runtime read; content/build is deliberately excluded (pipeline artifacts).
  outputFileTracingIncludes: {
    // corpus + overlays are read at runtime by content-loader (invisible to
    // static tracing); the S-2b sandbox gate reads the skill + runner off disk
    // and writes them into the Vercel Sandbox — trace those in too.
    "/**": ["../../content/corpus/**", "../../content/overlays/**", "skills/**", "scripts/sandbox/**"],
  },
  // Workspace packages ship raw TS/TSX (exports → ./src/index.ts*); Next must transpile them.
  transpilePackages: [
    "@domigo/content-schema",
    "@domigo/content-loader",
    "@domigo/content-pipeline",
    "@domigo/db",
    "@domigo/engine",
    "@domigo/task-ui",
    "@domigo/game-core",
    "@domigo/game-2d",
    "@domigo/game-paint",
    "@domigo/game-detective",
    "@domigo/game-novel",
    "@domigo/game-trip",
    "@domigo/game-feel",
    "@domigo/art-gen",
  ],
  // R5-W1 · E1 · THE PAINTED ART IS IMMUTABLE, SO SAY SO.
  // Files under public/ get Next's revalidating default: the browser asks the
  // CDN about every one of them on every visit. The painted chapter is ~190 MB
  // across ~620 files, so that is hundreds of round trips a child pays for on
  // a school connection before anything moves — for bytes that never change.
  //
  // Safe because every /art URL carries its own FILE's content fingerprint —
  // `lib/art-fingerprint.ts`, used by paint-art · keen-art · tile-art ·
  // story-art — so a repainted picture arrives under a new address and an
  // unchanged one keeps its cached copy. (R5-W3 · E5: this comment used to say
  // "?v=<commit sha>" from lib/paint-art.ts. Both halves had rotted — E4 had
  // already replaced the commit sha with a per-file hash, and three of the four
  // resolvers were emitting NO key at all while this header promised a year of
  // immutability over 66 MB of keen art.) Gated on VERCEL_ENV on purpose: an
  // immutable header locally would make the art lanes reload to see a repaint.
  ...(process.env.VERCEL_ENV
    ? {
        headers: async () => [
          {
            source: "/art/:path*",
            headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
          },
        ],
      }
    : {}),
};

export default nextConfig;
