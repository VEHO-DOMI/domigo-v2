/**
 * dach-018 · WHERE konto LIVES — and why the address is nowhere in this code.
 *
 * `scripts/check-umbrella-tokens.mjs` (check `hosts`) forbids every
 * `<sub>.lautereinser.at` address anywhere under apps/, packages/ and scripts/,
 * with exactly one home: app/le-werkzeuge.json — which is itself pinned by
 * sha256 in that same gate and therefore must not be edited here. So the
 * address is read, never typed: the variable KONTO_BASE_URL in production, and
 * the tool list as the fallback that keeps a preview deployment honest.
 *
 * Edge-safe on purpose: middleware.ts imports @/auth, auth.ts imports this, so
 * everything here must survive the Edge runtime. No node:crypto, no fs — a
 * JSON import and string work only (cf. lib/ops.ts:20-31, where a node:crypto
 * import in this very chain once 404'd every /admin route while typecheck,
 * lint and the tests all stayed green).
 */
import { werkzeugeFuer } from "../le-werkzeuge.ts";

/** The konto entry of the roof's tool list — the one place its address lives. */
function adresseAusWerkzeugen(): string {
  const konto = werkzeugeFuer("teacher").find((w) => w.id === "konto");
  if (!konto) throw new Error("[konto] no `konto` entry in le-werkzeuge.json");
  return konto.adresse;
}

/**
 * The origin of the account service, without a trailing slash. `KONTO_BASE_URL`
 * wins (production, and `http://localhost:3100` for the local lane); the tool
 * list is the fallback.
 */
export function kontoBaseUrl(env: string | undefined = process.env.KONTO_BASE_URL): string {
  const roh = (env ?? "").trim();
  return (roh.length > 0 ? roh : adresseAusWerkzeugen()).replace(/\/+$/, "");
}

/** `${konto}/login?app=go&return=…` — the button on both sign-in pages. */
export function kontoLoginUrl(rueckkehr: string, env?: string): string {
  const u = new URL(`${kontoBaseUrl(env)}/login`);
  u.searchParams.set("app", "go");
  u.searchParams.set("return", rueckkehr);
  return u.toString();
}

/** `${konto}/beitritt/<code>` — where a printed class code leads from now on. */
export function kontoBeitrittUrl(code: string, env?: string): string {
  return `${kontoBaseUrl(env)}/beitritt/${encodeURIComponent(code)}`;
}

/**
 * The app's own origin, for the `return` address konto redirects back to.
 * `AUTH_URL` is what NextAuth already uses; the Vercel production host is the
 * fallback, and the request's own origin the last resort.
 */
export function eigeneBasis(req?: { nextUrl?: { origin: string } }): string {
  const auth = (process.env.AUTH_URL ?? "").trim();
  if (auth) return auth.replace(/\/+$/, "");
  const vercel = (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "").trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return req?.nextUrl?.origin ?? "";
}

/** The one address konto is told to come back to after a sign-in. */
export const CALLBACK_PFAD = "/api/auth/callback-konto";
