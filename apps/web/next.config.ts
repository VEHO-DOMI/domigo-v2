import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages ship raw TS/TSX (exports → ./src/index.ts*); Next must transpile them.
  transpilePackages: [
    "@domigo/content-schema",
    "@domigo/content-loader",
    "@domigo/db",
    "@domigo/engine",
    "@domigo/task-ui",
  ],
};

export default nextConfig;
