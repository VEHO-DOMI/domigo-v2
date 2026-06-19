import { readFileSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Load .env.local by hand (drizzle-kit doesn't). Ported from v1's drizzle.config.ts.
try {
  const env = readFileSync(".env.local", "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  // .env.local missing — fine if DATABASE_URL is injected another way (CI/Vercel).
}

export default defineConfig({
  schema: "./src/schema.ts", // ONLY v2 tables — src/v1.ts mirrors are never managed.
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["domigo_v2"], // introspection ignores `public` → can't touch v1.
  dbCredentials: {
    url: (process.env.DATABASE_URL ?? process.env.POSTGRES_URL),
  },
  verbose: true,
  strict: true,
});
