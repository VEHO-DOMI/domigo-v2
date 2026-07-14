import { createHmac, timingSafeEqual } from "node:crypto";
import { loadWorld } from "@domigo/content-loader";
import type { WorldDefinition } from "@domigo/content-schema";

export const SANDBOX_WORLD_ID = "g1.world.lost-pages-school";
export const SANDBOX_CLASS_ID = "11111111-1111-4111-8111-111111111111";
export const SANDBOX_TEACHER_ID = "22222222-2222-4222-8222-222222222222";

export const SANDBOX_PROFILES = {
  fresh: { userId: "33333333-3333-4333-8333-333333333333", classId: SANDBOX_CLASS_ID, displayName: "Veho Test — Fresh" },
  midway: { userId: "44444444-4444-4444-8444-444444444444", classId: SANDBOX_CLASS_ID, displayName: "Veho Test — Midway" },
  complete: { userId: "55555555-5555-4555-8555-555555555555", classId: SANDBOX_CLASS_ID, displayName: "Veho Test — Complete" },
} as const;
export type SandboxProfileKey = keyof typeof SANDBOX_PROFILES;

interface PreviewClaims {
  role: "student" | "teacher";
  profileKey: SandboxProfileKey | "teacher";
  userId: string;
  classId: string | null;
  worldId: string;
  exp: number;
}

export function sandboxEnabled(): boolean {
  return process.env.VERCEL_ENV !== "production" && process.env.DOMIGO_SANDBOX_ENABLED === "1";
}

function signingSecret(): string {
  const secret = process.env.DOMIGO_PREVIEW_SECRET ?? "";
  if (secret.length < 24) throw new Error("DOMIGO_PREVIEW_SECRET must contain at least 24 characters");
  return secret;
}

function encode(value: string): string { return Buffer.from(value, "utf8").toString("base64url"); }
function signature(body: string): string { return createHmac("sha256", signingSecret()).update(body).digest("base64url"); }

export function signStudentPreview(profileKey: SandboxProfileKey, ttlSeconds = 12 * 60 * 60): string {
  const profile = SANDBOX_PROFILES[profileKey];
  const claims: PreviewClaims = { role: "student", profileKey, userId: profile.userId, classId: profile.classId, worldId: SANDBOX_WORLD_ID, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = encode(JSON.stringify(claims));
  return `${body}.${signature(body)}`;
}

export function signTeacherPreview(ttlSeconds = 12 * 60 * 60): string {
  const claims: PreviewClaims = { role: "teacher", profileKey: "teacher", userId: SANDBOX_TEACHER_ID, classId: null, worldId: SANDBOX_WORLD_ID, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = encode(JSON.stringify(claims));
  return `${body}.${signature(body)}`;
}

export function verifyPreviewToken(token: string | null | undefined): PreviewClaims | null {
  if (!sandboxEnabled() || !token) return null;
  const [body, supplied] = token.split(".");
  if (!body || !supplied) return null;
  let expected: string;
  try { expected = signature(body); } catch { return null; }
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const claims = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as PreviewClaims;
    if (claims.exp < Math.floor(Date.now() / 1000) || claims.worldId !== SANDBOX_WORLD_ID) return null;
    if (claims.role === "teacher") return claims.userId === SANDBOX_TEACHER_ID ? claims : null;
    const profile = SANDBOX_PROFILES[claims.profileKey as SandboxProfileKey];
    return profile && profile.userId === claims.userId && profile.classId === claims.classId ? claims : null;
  } catch { return null; }
}

export function previewTokenFromRequest(req: Request): string | null {
  return req.headers.get("x-domigo-preview-token");
}

export function getPreviewStudent(req: Request): { userId: string; classId: string; profileKey: SandboxProfileKey } | null {
  const claims = verifyPreviewToken(previewTokenFromRequest(req));
  return claims?.role === "student" && claims.classId ? { userId: claims.userId, classId: claims.classId, profileKey: claims.profileKey as SandboxProfileKey } : null;
}

export function getPreviewTeacher(req: Request): { userId: string } | null {
  const claims = verifyPreviewToken(previewTokenFromRequest(req));
  return claims?.role === "teacher" ? { userId: claims.userId } : null;
}

export function sandboxWorld(): WorldDefinition {
  if (!sandboxEnabled()) throw new Error("sandbox world is disabled");
  const world = loadWorld("g1.st.lost-pages", "z01");
  if (!world || world.id !== SANDBOX_WORLD_ID) throw new Error("sandbox world content is missing");
  return world;
}
