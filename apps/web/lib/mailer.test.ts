/**
 * K2a · The mailer (node --test, like lib/grandmaster.test.ts — apps/web has no vitest).
 *
 * There is no module mocking here, which shaped the module: `mailerState` takes its
 * environment as an argument, `buildResetMail` is pure, and `sendMail` takes the state
 * it should use. So every branch is reachable without patching imports — the transport
 * is passed in, not intercepted.
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { buildResetMail, mailerState, sendMail, type MailerState } from "./mailer.ts";

const echterFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = echterFetch;
});

/** Collect what the dev transport writes, without letting it into the test output. */
function fangeLog(): { zeilen: string[]; zurueck: () => void } {
  const zeilen: string[] = [];
  const echt = console.log;
  console.log = (...args: unknown[]) => {
    zeilen.push(args.map(String).join(" "));
  };
  return { zeilen, zurueck: () => { console.log = echt; } };
}

describe("mailerState — fail-closed until it is actually configured", () => {
  it("is off with nothing set", () => {
    assert.deepEqual(mailerState({}), { kind: "off" });
  });

  it("is off with a key but no sender — half a configuration is not one", () => {
    assert.deepEqual(mailerState({ BREVO_API_KEY: "k" }), { kind: "off" });
    assert.deepEqual(mailerState({ MAIL_FROM_ADDRESS: "a@b.invalid" }), { kind: "off" });
  });

  it("is off when the values are only whitespace", () => {
    assert.deepEqual(mailerState({ BREVO_API_KEY: "  ", MAIL_FROM_ADDRESS: " " }), { kind: "off" });
  });

  it("uses Brevo once both are set, and falls back to a sender name", () => {
    const s = mailerState({ BREVO_API_KEY: "k", MAIL_FROM_ADDRESS: "a@b.invalid" });
    assert.equal(s.kind, "brevo");
    if (s.kind !== "brevo") return;
    assert.equal(s.config.fromName, "DomiGo");
    assert.equal(s.config.apiKey, "k");
  });
});

describe("the dev transport is inert on production", () => {
  it("writes to the log when the deployment is not production", () => {
    assert.deepEqual(mailerState({ MAIL_TRANSPORT: "console" }), { kind: "console" });
    assert.deepEqual(mailerState({ MAIL_TRANSPORT: "console", VERCEL_ENV: "preview" }), { kind: "console" });
  });

  it("is IGNORED on production, even if someone sets it there", () => {
    // The whole safety of the escape hatch: a recovery link must never be reducible
    // to a log line on a live deployment.
    const s = mailerState({ MAIL_TRANSPORT: "console", VERCEL_ENV: "production" });
    assert.equal(s.kind, "off");
    const mitSchluessel = mailerState({
      MAIL_TRANSPORT: "console",
      VERCEL_ENV: "production",
      BREVO_API_KEY: "k",
      MAIL_FROM_ADDRESS: "a@b.invalid",
    });
    assert.equal(mitSchluessel.kind, "brevo"); // real sending, not the log
  });
});

describe("buildResetMail", () => {
  const LINK = "https://domigo-v2.vercel.app/lehrkraft/pin-reset/AbC-123_xyz";

  it("carries the link and says how long it lives", () => {
    const m = buildResetMail(LINK, 60);
    assert.ok(m.text.includes(LINK));
    assert.ok(m.text.includes("60 Minuten"));
    assert.ok(m.subject.length > 0);
  });

  it("carries NO PIN — not the old one, not a new one, not any digit run that could be one", () => {
    const m = buildResetMail(LINK, 60);
    // Strip the link first: it legitimately contains random characters. What remains
    // is the prose, and no 4-to-6-digit run may survive there.
    const prosa = m.text.split(LINK).join(" ");
    assert.ok(!/(?<!\d)\d{4,6}(?!\d)/.test(prosa), `PIN-förmige Zahl im Text: ${prosa}`);
    assert.ok(!/\bPIN\b\s*[:=]/i.test(prosa));
  });

  it("tells someone who did not ask that ignoring it is enough", () => {
    const m = buildResetMail(LINK, 60);
    assert.ok(m.text.includes("nicht warst"));
    assert.ok(m.text.includes("bleibt gültig"));
  });

  it("is pure — same input, same bytes", () => {
    assert.deepEqual(buildResetMail(LINK, 60), buildResetMail(LINK, 60));
  });
});

describe("sendMail", () => {
  const mail = { to: "kollegin@example.invalid", subject: "s", text: "t" };

  it("sends nothing, and says so, when nothing is configured", async () => {
    let gerufen = false;
    globalThis.fetch = (async () => { gerufen = true; return new Response("", { status: 200 }); }) as typeof fetch;
    assert.equal(await sendMail(mail, { kind: "off" }), false);
    assert.equal(gerufen, false); // no network call at all
  });

  it("writes the whole message to the log on the dev transport, and touches no network", async () => {
    let gerufen = false;
    globalThis.fetch = (async () => { gerufen = true; return new Response("", { status: 200 }); }) as typeof fetch;
    const log = fangeLog();
    const ok = await sendMail({ ...mail, text: "HIER-STEHT-DER-LINK" }, { kind: "console" });
    log.zurueck();
    assert.equal(ok, true);
    assert.equal(gerufen, false);
    assert.ok(log.zeilen.join("\n").includes("HIER-STEHT-DER-LINK"));
    assert.ok(log.zeilen.join("\n").includes("kollegin@example.invalid"));
  });

  it("posts to Brevo with the key in the header and the text in the body", async () => {
    let url = "";
    let init: RequestInit | undefined;
    globalThis.fetch = (async (u: string, i: RequestInit) => {
      url = u;
      init = i;
      return new Response(JSON.stringify({ messageId: "1" }), { status: 201 });
    }) as unknown as typeof fetch;

    const state: MailerState = {
      kind: "brevo",
      config: { apiKey: "geheim", fromAddress: "koki@example.invalid", fromName: "DomiGo" },
    };
    assert.equal(await sendMail(mail, state), true);
    assert.equal(url, "https://api.brevo.com/v3/smtp/email");
    assert.equal((init?.headers as Record<string, string>)["api-key"], "geheim");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.to[0].email, "kollegin@example.invalid");
    assert.equal(body.sender.email, "koki@example.invalid");
    assert.equal(body.textContent, "t");
  });

  it("reports a refusal as false instead of throwing — the caller must answer either way", async () => {
    globalThis.fetch = (async () => new Response("nope", { status: 401 })) as typeof fetch;
    const state: MailerState = {
      kind: "brevo",
      config: { apiKey: "falsch", fromAddress: "koki@example.invalid", fromName: "DomiGo" },
    };
    const log = fangeLog();
    const echteFehler = console.error;
    console.error = () => {};
    const ok = await sendMail(mail, state);
    console.error = echteFehler;
    log.zurueck();
    assert.equal(ok, false);
  });

  it("survives a network throw the same way", async () => {
    globalThis.fetch = (async () => { throw new Error("getaddrinfo ENOTFOUND"); }) as typeof fetch;
    const state: MailerState = {
      kind: "brevo",
      config: { apiKey: "k", fromAddress: "koki@example.invalid", fromName: "DomiGo" },
    };
    const echteFehler = console.error;
    console.error = () => {};
    const ok = await sendMail(mail, state);
    console.error = echteFehler;
    assert.equal(ok, false);
  });
});
