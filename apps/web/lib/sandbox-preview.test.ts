import assert from "node:assert/strict";
import test from "node:test";
import { SANDBOX_PROFILES, sandboxEnabled, signStudentPreview, signTeacherPreview, verifyPreviewToken } from "./sandbox-preview.ts";

test("signed preview tokens bind one tab/profile and reject tampering", () => {
  process.env.DOMIGO_SANDBOX_ENABLED = "1";
  process.env.DOMIGO_PREVIEW_SECRET = "test-secret-that-is-long-enough-for-hmac";
  const token = signStudentPreview("fresh", 60);
  const claims = verifyPreviewToken(token);
  assert.equal(claims?.userId, SANDBOX_PROFILES.fresh.userId);
  assert.equal(verifyPreviewToken(`${token.slice(0, -1)}x`), null);
});

test("teacher preview token cannot impersonate a student", () => {
  process.env.DOMIGO_SANDBOX_ENABLED = "1";
  process.env.DOMIGO_PREVIEW_SECRET = "test-secret-that-is-long-enough-for-hmac";
  assert.equal(verifyPreviewToken(signTeacherPreview(60))?.role, "teacher");
});

test("the sandbox switch cannot enable preview access in production", () => {
  process.env.DOMIGO_SANDBOX_ENABLED = "1";
  process.env.VERCEL_ENV = "production";
  assert.equal(sandboxEnabled(), false);
  assert.equal(verifyPreviewToken(signStudentPreview("fresh", 60)), null);
  delete process.env.VERCEL_ENV;
});
