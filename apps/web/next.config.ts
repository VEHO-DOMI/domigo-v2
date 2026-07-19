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
};

export default nextConfig;
