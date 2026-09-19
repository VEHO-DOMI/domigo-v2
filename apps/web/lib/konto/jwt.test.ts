/**
 * dach-018 · test:konto-handoff, first half — the door konto knocks on.
 *
 * Every case is a REFUSAL the adapter must make, proved against a stand-in that
 * signs exactly what konto signs. The first case is the counter-tamper for all
 * the others: if the accepting path were broken, every refusal below would pass
 * for the wrong reason.
 *
 * node --test (apps/web has no vitest).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { neueSchluessel, neuerStub, signLogout, signPush, type StubSchluessel } from "../../scripts/lib/konto-stub.ts";
import { _setJwksFuerTest, koerperHash, pruefeLogout, pruefePush } from "./jwt.ts";

const SID = "sess-abcdefgh";

function ruf(token: string, koerper: string): Request {
  return new Request("https://example.invalid/api/konto/logout", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: koerper,
  });
}

async function mitSchluessel(): Promise<StubSchluessel> {
  const k = await neueSchluessel();
  _setJwksFuerTest(k.keySet);
  return k;
}

describe("the logout back-channel", () => {
  it("ACCEPTS what konto really signs — {sid}, no body hash", async () => {
    const k = await mitSchluessel();
    const koerper = JSON.stringify({ sid: SID });
    const t = await signLogout(k, SID);
    assert.deepEqual(await pruefeLogout(ruf(t, koerper), koerper), { sid: SID });
  });

  it("refuses when the body names a different session than the signature", async () => {
    const k = await mitSchluessel();
    const t = await signLogout(k, SID);
    const fremd = JSON.stringify({ sid: "sess-fremdfremd" });
    assert.equal(await pruefeLogout(ruf(t, fremd), fremd), null);
  });

  it("refuses a token for another app (aud)", async () => {
    const k = await mitSchluessel();
    const koerper = JSON.stringify({ sid: SID });
    const t = await signPush(k, "class-term", koerper); // richtige aud, falsche Sorte
    assert.equal(await pruefeLogout(ruf(t, koerper), koerper), null);
  });

  it("refuses a token that lived longer than konto ever issues (60 s)", async () => {
    const k = await mitSchluessel();
    const koerper = JSON.stringify({ sid: SID });
    const t = await signLogout(k, SID, { laufzeitS: 3600 });
    assert.equal(await pruefeLogout(ruf(t, koerper), koerper), null);
  });

  it("refuses a token signed by a key konto does not publish", async () => {
    await mitSchluessel();
    const fremd = await neueSchluessel("fremd-1"); // JWKS bleibt die des ersten
    const koerper = JSON.stringify({ sid: SID });
    const t = await signLogout(fremd, SID);
    assert.equal(await pruefeLogout(ruf(t, koerper), koerper), null);
  });

  it("refuses a missing or malformed header", async () => {
    await mitSchluessel();
    const koerper = JSON.stringify({ sid: SID });
    const ohne = new Request("https://example.invalid/x", { method: "POST", body: koerper });
    assert.equal(await pruefeLogout(ohne, koerper), null);
  });
});

describe("the signed pushes", () => {
  it("accepts a push bound to its route and to its exact bytes", async () => {
    const k = await mitSchluessel();
    const koerper = JSON.stringify({ class_id: "cls_1", name: "1A" });
    const t = await signPush(k, "class-term", koerper);
    const r = await pruefePush<{ name: string }>(ruf(t, koerper), koerper, "class-term");
    assert.equal(r?.koerper.name, "1A");
  });

  it("TAMPER: one byte changed after signing and the push is refused", async () => {
    const k = await mitSchluessel();
    const echt = JSON.stringify({ class_id: "cls_1", name: "1A" });
    const gefaelscht = JSON.stringify({ class_id: "cls_1", name: "1B" });
    const t = await signPush(k, "class-term", echt);
    assert.equal(await pruefePush(ruf(t, gefaelscht), gefaelscht, "class-term"), null);
  });

  it("refuses a push signed for a different route", async () => {
    const k = await mitSchluessel();
    const koerper = JSON.stringify({ app_user_id: "u1" });
    const t = await signPush(k, "account-deleted", koerper);
    assert.equal(await pruefePush(ruf(t, koerper), koerper, "class-term"), null);
  });

  it("refuses a logout token presented at a push route (no kind, no hash)", async () => {
    const k = await mitSchluessel();
    const koerper = JSON.stringify({ sid: SID });
    const t = await signLogout(k, SID);
    assert.equal(await pruefePush(ruf(t, koerper), koerper, "class-term"), null);
  });

  it("hashes the bytes, not the parsed object — key order matters", async () => {
    const a = await koerperHash(JSON.stringify({ a: 1, b: 2 }));
    const b = await koerperHash(JSON.stringify({ b: 2, a: 1 }));
    assert.notEqual(a, b);
  });
});

describe("the stand-in itself behaves like konto", () => {
  it("spends a handoff token exactly once — the second exchange is 409", async () => {
    const s = neuerStub();
    s.claims.set("tok-1", { sub: "acc_1" });
    const eins = await s.fetch("https://konto.invalid/api/handoff/exchange", {
      method: "POST",
      headers: { authorization: `Bearer ${s.secret}`, "content-type": "application/json" },
      body: JSON.stringify({ token: "tok-1" }),
    });
    const zwei = await s.fetch("https://konto.invalid/api/handoff/exchange", {
      method: "POST",
      headers: { authorization: `Bearer ${s.secret}`, "content-type": "application/json" },
      body: JSON.stringify({ token: "tok-1" }),
    });
    assert.equal(eins.status, 200);
    assert.equal(zwei.status, 409);
  });

  it("refuses a wrong app secret before it looks at anything else", async () => {
    const s = neuerStub();
    const res = await s.fetch("https://konto.invalid/api/claims?sid=x", { headers: { authorization: "Bearer falsch" } });
    assert.equal(res.status, 401);
  });
});
