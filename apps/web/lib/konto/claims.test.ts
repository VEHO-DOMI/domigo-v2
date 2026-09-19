/**
 * dach-063 · SECRET_MIN — the length floor of the app's konto secret.
 *
 * `appSecret()` in claims.ts is fail-closed: a KONTO_APP_SECRET shorter than 24
 * characters counts as no secret, and no request leaves the app. Until this file
 * nothing held that line (GG review 18.09.): lowering the floor, or dropping the
 * check, stayed green. Two cases, one either side of the edge; the accepting case
 * is the counter-tamper — if it failed, the refusal would pass for the wrong reason.
 *
 * The secrets are generated here (a repeated letter), never real values.
 * node --test (apps/web has no vitest).
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { exchangeHandoff } from "./claims.ts";

describe("claims · SECRET_MIN (dach-063)", () => {
  const echtesFetch = globalThis.fetch;
  const echtesGeheimnis = process.env.KONTO_APP_SECRET;
  let rufe: { url: string; authorization: string | null }[] = [];

  beforeEach(() => {
    rufe = [];
    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      rufe.push({ url: String(url), authorization: headers.get("authorization") });
      return new Response("{}", { status: 401 });
    }) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = echtesFetch;
    if (echtesGeheimnis === undefined) delete process.env.KONTO_APP_SECRET;
    else process.env.KONTO_APP_SECRET = echtesGeheimnis;
  });

  it("weist ein 23-Zeichen-Geheimnis ab: null, und konto wird nie gefragt", async () => {
    process.env.KONTO_APP_SECRET = "x".repeat(23);
    assert.equal(await exchangeHandoff("einmal-token"), null);
    assert.equal(rufe.length, 0, "ein zu kurzes Geheimnis darf keinen Ruf an konto auslösen");
  });

  it("lässt ein 24-Zeichen-Geheimnis durch: genau ein Ruf mit diesem Geheimnis", async () => {
    const geheimnis = "y".repeat(24);
    process.env.KONTO_APP_SECRET = geheimnis;
    await exchangeHandoff("einmal-token");
    assert.equal(rufe.length, 1);
    assert.match(rufe[0].url, /\/api\/handoff\/exchange$/);
    assert.equal(rufe[0].authorization, `Bearer ${geheimnis}`);
  });

  it("zählt nach dem Kürzen: 23 Zeichen plus Leerraum bleiben zu kurz", async () => {
    process.env.KONTO_APP_SECRET = `  ${"z".repeat(23)}\n`;
    assert.equal(await exchangeHandoff("einmal-token"), null);
    assert.equal(rufe.length, 0);
  });
});
