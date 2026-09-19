/**
 * dach-018 · GET /api/cron/konto-sync — the 03:00 Vienna catch-up (SPEC §10.3).
 *
 * Pushes can be lost. Once a night DomiGo asks the account service for every
 * class change of the last 48 hours and applies them through the SAME function
 * the push uses, so a caught-up change and a pushed one cannot behave
 * differently.
 *
 * TWO CRON LINES, ONE RUN. Vercel schedules in UTC and has no notion of a time
 * zone, so `apps/web/vercel.json` asks at 01:30 and again at 02:30 UTC — one of
 * those is 03:30 in Vienna in summer, the other in winter — and this handler
 * checks the Vienna hour itself and does nothing at the wrong one. Exactly the
 * shape konto's own retention job uses.
 *
 * THE OTHER END DOES NOT EXIST YET. `GET konto/api/class-terms` is built by
 * dach-048; measured today, it is not in konto's routes. A 404 is therefore not
 * an error here: the handler says so in one server line and changes nothing.
 */
import { applyKontoClassTerm, getDb, type KontoKlassenEingang } from "@domigo/db";
import { kontoBaseUrl } from "@/lib/konto/basis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** The hour in Vienna, whatever the server thinks the time is. */
export function wienerStunde(now: Date): number {
  return Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Vienna", hour: "2-digit", hour12: false }).format(now));
}

function befugt(req: Request): boolean {
  const secret = (process.env.CRON_SECRET ?? "").trim();
  if (secret.length < 24) return false; // fail closed, like lib/ops.ts
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request): Promise<Response> {
  if (!befugt(req)) return Response.json({ error: "unauthorized" }, { status: 401 });

  const jetzt = new Date();
  const stunde = wienerStunde(jetzt);
  if (stunde !== 3) return Response.json({ ok: true, uebersprungen: true, wienerStunde: stunde });

  const secret = (process.env.KONTO_APP_SECRET ?? "").trim();
  if (secret.length < 24) {
    console.error("[konto] nightly sync: KONTO_APP_SECRET missing — nothing fetched");
    return Response.json({ ok: false, error: "unconfigured" }, { status: 500 });
  }

  let zeilen: KontoKlassenEingang[] = [];
  try {
    const u = new URL(`${kontoBaseUrl()}/api/class-terms`);
    u.searchParams.set("app", "go");
    u.searchParams.set("since", "-48h");
    const res = await fetch(u, { headers: { authorization: `Bearer ${secret}` }, cache: "no-store", signal: AbortSignal.timeout(10_000) });
    if (res.status === 404) {
      console.log("[konto] nightly sync: the class-terms endpoint does not exist yet (dach-048) — 0 changes");
      return Response.json({ ok: true, endpunktFehlt: true, geaendert: 0 });
    }
    if (!res.ok) {
      console.error(`[konto] nightly sync: konto answered ${res.status}`);
      return Response.json({ ok: false, error: "konto_unreachable" }, { status: 502 });
    }
    const body = (await res.json()) as { class_terms?: KontoKlassenEingang[] };
    zeilen = Array.isArray(body?.class_terms) ? body.class_terms : [];
  } catch {
    console.error("[konto] nightly sync: konto unreachable");
    return Response.json({ ok: false, error: "konto_unreachable" }, { status: 502 });
  }

  let geaendert = 0;
  let abgelehnt = 0;
  for (const z of zeilen) {
    // One bad row must not stop forty-nine good ones (nachtrag N-17).
    try {
      const r = await applyKontoClassTerm(getDb(), z);
      if (r.ok && r.geaendert) geaendert++;
      if (!r.ok) abgelehnt++;
    } catch {
      abgelehnt++;
    }
  }
  console.log(`[konto] nightly sync: ${zeilen.length} rows, ${geaendert} changed, ${abgelehnt} refused`);
  return Response.json({ ok: true, gelesen: zeilen.length, geaendert, abgelehnt });
}
