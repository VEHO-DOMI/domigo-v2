#!/usr/bin/env node
// R5-F2 · DIE BILD-SENKE — wie dieses Spiel sich selbst fotografiert.
// R5-W3 · W1 · …und wie sie beweist, dass sie dabei nicht lügt.
//
// Das Problem, das jede Session bis hierher aufgehalten hat: die Spielfläche
// ist ein WebGL-Canvas, und die Grafikkarte gibt ihren Inhalt an einen
// gewöhnlichen Screenshot NICHT heraus — man bekommt Schwarz oder eine leere
// Fläche. `scripts/check-composition.mjs` dokumentiert dieselbe Klasse ("Build-D
// banked exactly that"), und F1 ist genau daran gescheitert.
//
// Der Weg, der funktioniert, hat drei Teile. Dieses Skript ist Teil drei.
//
//   1. Phaser malt das Bild auf Anforderung NOCH EINMAL und reicht es als
//      Daten-URL heraus: `game.renderer.snapshot(img => …)`. Der Schnappschuss
//      wird am Ende des nächsten Render-Durchgangs fällig, also muss danach ein
//      Frame laufen — `__domigoPaint.rafStep()` zweimal genügt.
//   2. Die Seite schickt diese Daten-URL per POST hierher (CORS ist unten
//      offen, damit localhost:3000-und-Freunde sie erreichen).
//   3. Dieses Skript legt echte PNGs auf die Platte.
//
// ── WARUM DIESE DATEI EIN GESETZ BEKOMMEN HAT (W1, der P5-Blocker) ──────────
// Am 14.08. lieferte genau dieser Weg DREI BYTE-IDENTISCHE PNGs: das Spiel hatte
// sich zwischen den Aufnahmen nicht neu gemalt, die Reihe zeigte dreimal
// dasselbe Bild, und gefangen wurde es per Prüfsumme — nicht per Auge. Der
// Blindvergleich des Bosskampfs ist daran gestorben (P-66). Vorher hatte
// dieselbe Klasse F2 schon eine Stunde gekostet.
//
// Ein Werkzeug, dem man das nicht ansieht, ist schlimmer als keins: es liefert
// Bilder, die aussehen wie Beweise. Also gilt hier ab jetzt:
//
//   · KEIN Bild wird geschrieben, bevor die Kamera in DIESEM Lauf bewiesen hat,
//     dass sie lebt — zwei Probeaufnahmen mit einem `step()` dazwischen, deren
//     Prüfsummen sich unterscheiden MÜSSEN (der Handschlag).
//   · Ein Bild, das byte-gleich zu einem schon angenommenen ist, wird ABGEWIESEN
//     und der Lauf als vergiftet markiert — nicht still auf die Platte gelegt.
//   · Jedes Bild braucht seinen Beipackzettel (`<name>.meta.json`) mit dem TICK.
//     Ein Bild ohne seinen Tick ist eine Anekdote, kein Beweis: die halbe
//     Käfig-Debatte (»16 px« gegen »1 px«) war nur deshalb überhaupt möglich.
//
// Der Handschlag unterscheidet ZWEI Fehler, die gleich aussehen und verschiedene
// Ursachen haben: gleiche Ticks ⇒ der Aufrufer hat gar nicht gesteppt (sein
// Fehler); verschiedene Ticks bei gleicher Prüfsumme ⇒ die Kamera ist tot
// (unser Fehler).
//
// ── DIE DREI FALLEN, DIE MESSREIHEN WERTLOS MACHEN ─────────────────────────
//  1. DER VERBORGENE TAB (P-66). Automatisierungs-Browser halten ihren Tab
//     verborgen (`document.hidden === true`). Dort läuft kein rAF-Takt von
//     selbst, und `renderer.snapshot()` kann denselben Puffer zurückgeben wie
//     beim letzten Mal. Der Handschlag fängt das; `computer screenshot` bzw. ein
//     SICHTBARES Chrome-Fenster über die DevTools-Fernsteuerung sind die Wege,
//     die dann noch bleiben (siehe `scripts/shoot-world.mjs`).
//  2. DER CEREMONY-FREEZE. `Sim.step` kehrt bei offener Karte sofort zurück;
//     `tickCount` bewegt sich dann nicht, und eine Bildreihe ist N-mal DASSELBE
//     Bild. Kapitel 1 öffnet beim Start die Auftakt-Karte, und in Käfig-Nähe
//     kommt der Käfig-Hinweis dazu. Vor JEDER Aufnahme `overlay === false`
//     prüfen — und React rendert nur EINE Karten-Aktion pro javascript-Aufruf,
//     das braucht also einen eigenen Aufruf.
//  3. DIE UHR-NEUTRALITÄT. Der Schuss selbst KOSTET Ticks (`rafStep()` treibt
//     die Uhr mit; in F2 waren es 3 pro Bild, und die Reihe war gröber als ihr
//     Begleittext). Der Beipackzettel trägt deshalb `shotCostTicks` — gemessen,
//     nicht behauptet. Und REDUZIERTE BEWEGUNG (`prefers-reduced-motion`)
//     zeichnet die halbe Animation gar nicht: `reducedMotion` steht ebenfalls im
//     Zettel.
//
// ── Benutzung ───────────────────────────────────────────────────────────────
//   node scripts/frame-sink.mjs ./frames --port 3921   (eigener Port! P-65)
//   node scripts/frame-sink.mjs --selftest             (prüft sich selbst, CI)
//   node scripts/frame-sink.mjs --client               (druckt den Seiten-Code)
//
// Der Seiten-Code steht unten in CLIENT_SRC — EINE Quelle, statt eines
// Kommentars, den jede Session neu abtippt (so ist der Handschlag zuletzt
// verlorengegangen).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const PROBE_A = "__probe_a";
export const PROBE_B = "__probe_b";

const md5 = (buf) => crypto.createHash("md5").update(buf).digest("hex");

/** Die drei Ursachen, wörtlich, damit die Meldung selbst die Diagnose ist. */
export const DEAD_CAMERA_MESSAGE = [
  "DIE KAMERA IST TOT: zwei Probeaufnahmen mit einem step() dazwischen sind BYTE-GLEICH.",
  "Kein Bild dieses Laufs wäre ein Beweis. Die drei bekannten Ursachen:",
  "  1. VERBORGENER TAB (P-66) — renderer.snapshot() gibt im Automatisierungs-Tab",
  "     denselben Puffer zurück. Ausweg: sichtbares Fenster oder scripts/shoot-world.mjs.",
  "  2. CEREMONY-FREEZE — eine offene Karte hält die Welt an (overlay === true).",
  "     Karte wegklicken, DANN aufnehmen.",
  "  3. REDUZIERTE BEWEGUNG — prefers-reduced-motion zeichnet die Bewegung nicht.",
].join("\n");

/**
 * Der Kern, ohne HTTP: eine Senke nimmt Angebote an oder weist sie ab.
 *
 * Er ist absichtlich hier und nicht im Server-Callback, damit `--selftest` und
 * die Tests GENAU DIESEN Code fahren statt eines Modells davon (die G1-Lehre:
 * eine Prüfschicht, die die Ausgabe modelliert statt sie auszuführen, prüft
 * ihr Modell).
 */
export const createSink = (outDir) => {
  const seen = new Map(); // md5 → name des zuerst angenommenen Bildes
  const rejected = [];
  const accepted = [];
  let probeA = null;
  let armed = false;
  let deadCamera = false;

  /** @returns {{code:number, body:string, file?:string}} */
  const offer = (rawName, body, meta) => {
    const comma = body.indexOf(",");
    if (!body.startsWith("data:image/") || comma < 0) {
      return { code: 400, body: "keine Bild-Daten-URL" };
    }
    const bytes = Buffer.from(body.slice(comma + 1), "base64");
    const hash = md5(bytes);
    const name = rawName.replace(/\.png$/, "");

    if (meta === null || typeof meta !== "object" || typeof meta.tick !== "number") {
      return {
        code: 400,
        body: `${name}: kein Beipackzettel mit tick (Kopfzeile x-domigo-meta).\n`
          + "Ein Bild ohne seinen Tick ist eine Anekdote, kein Beweis.",
      };
    }

    // ── der Handschlag ──────────────────────────────────────────────────────
    if (name === PROBE_A) {
      probeA = { hash, tick: meta.tick };
      armed = false;
      return { code: 200, body: "probe a" };
    }
    if (name === PROBE_B) {
      if (probeA === null) return { code: 409, body: `${PROBE_B} ohne ${PROBE_A}` };
      if (probeA.tick === meta.tick) {
        return {
          code: 409,
          body: `Die beiden Probeaufnahmen stehen auf demselben Tick (${meta.tick}).\n`
            + "Zwischen ihnen muss ein step() liegen — sonst beweist der Handschlag nichts.\n"
            + "Häufigste Ursache: eine offene Karte friert die Welt ein (overlay === true).",
        };
      }
      if (probeA.hash === hash) {
        deadCamera = true;
        return { code: 409, body: DEAD_CAMERA_MESSAGE };
      }
      armed = true;
      return { code: 200, body: `Kamera lebt · Ticks ${probeA.tick} → ${meta.tick}` };
    }

    // ── ab hier: echte Bilder ───────────────────────────────────────────────
    if (!armed) {
      return {
        code: 425,
        body: `${name} abgewiesen: der Handschlag fehlt.\n`
          + `Erst ${PROBE_A} / ${PROBE_B} mit einem step() dazwischen — die Senke schreibt`
          + " kein Bild, bevor die Kamera in DIESEM Lauf bewiesen hat, dass sie lebt.",
      };
    }
    if (seen.has(hash)) {
      const twin = seen.get(hash);
      rejected.push({ name, reason: `byte-gleich zu ${twin}` });
      return {
        code: 409,
        body: `${name} abgewiesen: BYTE-GLEICH zu ${twin} — die Reihe steht still.\n`
          + "Ist das ein echter Schleifenpunkt (dieselbe Weltlage, absichtlich), dann\n"
          + "gehört er in einen eigenen Lauf; hier wäre er ein stillschweigendes Standbild.",
      };
    }

    seen.set(hash, name);
    accepted.push({ name, hash, tick: meta.tick });
    const file = path.join(outDir, `${name}.png`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, bytes);
    fs.writeFileSync(
      path.join(outDir, `${name}.meta.json`),
      `${JSON.stringify({ ...meta, frame: `${name}.png`, md5: hash, index: accepted.length }, null, 2)}\n`,
    );
    return { code: 200, body: `ok ${accepted.length}`, file };
  };

  const verdict = () => ({
    armed,
    deadCamera,
    accepted: accepted.length,
    rejected,
    tainted: rejected.length > 0,
    frames: accepted,
  });

  return { offer, verdict };
};

// ── der Seiten-Code, EINE Quelle ────────────────────────────────────────────
// Wird von scripts/shoot-world.mjs injiziert und von `--client` gedruckt, damit
// niemand ihn mehr aus einem Kommentar abtippt. `pure` friert den Weltschritt
// ein (die Szene wird für die Render-Frames deaktiviert), damit der Schuss die
// Uhr nicht mittreibt — was das kostet, steht als `shotCostTicks` im Zettel.
export const CLIENT_SRC = String.raw`
(() => {
  const SINK = "__SINK_URL__";
  const h = () => window.__domigoPaint;
  const st = () => h()?.state?.() ?? null;

  const meta = (extra) => {
    const s = st() ?? {};
    return {
      tick: typeof s.tick === "number" ? s.tick : -1,
      phase: s.phase ?? "?",
      overlay: s.overlay === true,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      visibility: document.visibilityState,
      hidden: document.hidden,
      hero: { x: s.x, y: s.y, pose: s.pose, grounded: s.grounded },
      camX: s.camX,
      camY: s.camY,
      canvas: (() => { const c = document.querySelector("canvas");
        return c ? { w: c.width, h: c.height, cssW: c.clientWidth, cssH: c.clientHeight } : null; })(),
      entities: (s.entities ?? []).map((e) => ({
        id: e.id, role: e.role, skin: e.skin, state: e.state, redeemed: e.redeemed,
        x: e.x, y: e.y, breath: e.breath ?? null,
      })),
      ...(extra ?? {}),
    };
  };

  const post = (name, dataUrl, m) =>
    fetch(SINK + "/" + encodeURIComponent(name), {
      method: "POST",
      headers: { "content-type": "text/plain", "x-domigo-meta": encodeURIComponent(JSON.stringify(m)) },
      body: dataUrl,
    }).then(async (r) => {
      const text = await r.text();
      if (!r.ok) throw new Error("frame-sink " + r.status + ": " + text);
      return text;
    });

  const shoot = (name, opts) => new Promise((res, rej) => {
    const hp = h();
    if (!hp) return rej(new Error("kein __domigoPaint — falscher Port oder Produktions-Build?"));
    const pure = opts?.pure === true;
    const before = st()?.tick ?? -1;
    hp.game.renderer.snapshot((img) => {
      const after = st()?.tick ?? -1;
      post(name, img.src, meta({ shotCostTicks: after - before, pure, ...(opts?.extra ?? {}) }))
        .then(res, rej);
    });
    // UHR-NEUTRALITÄT. rafStep() ist die Spielschleife: sie rechnet die Zeit
    // seit dem letzten Aufruf in Sim-Ticks um (gedeckelt, geglättet) — gemessen
    // 1 bis 12 Ticks pro Bild, je nach Pause davor. Eine Reihe „alle 6 Ticks"
    // rückt damit in Wahrheit irgendetwas zwischen 8 und 30 weiter.
    // Der reine Render-Dreiklang malt die Anzeigeliste noch einmal, ohne die
    // Simulation anzufassen — gemessen 0 Ticks. Genau das braucht eine Messreihe.
    if (pure) {
      const g = hp.game;
      for (let i = 0; i < 2; i++) { g.renderer.preRender(); g.scene.render(g.renderer); g.renderer.postRender(); }
    } else {
      hp.rafStep(); hp.rafStep();
    }
  });

  /** DIE WELT ANHALTEN. In einem SICHTBAREN Tab (auch headless) läuft Phasers
   *  eigene Schleife weiter, während der Fernsteuerer zwischen zwei Aufrufen
   *  wartet: eine Reihe „alle 3 Ticks" rückte gemessen 31 Ticks weiter. Wer eine
   *  Kadenz behaupten will, muss die Uhr besitzen. »h.step()« weckt die Schleife
   *  jedes Mal — deshalb wird im selben synchronen Block wieder eingeschläfert,
   *  bevor ein rAF-Takt dazwischenkommen kann. */
  const freeze = () => { h()?.game?.loop?.sleep(); return st()?.tick ?? -1; };
  // …und der Antrieb geht an der Spielschleife VORBEI. »h.step()« weckt sie
  // (Phasers wake() fährt selbst einen Schritt), also kostete eine Bitte um
  // 3 Ticks gemessen 4–5. Die Szene direkt zu steppen ist derselbe feste
  // Zeitschritt ohne diesen Nebeneffekt.
  const drive = (n) => {
    const hp = h();
    const scene = hp.game.scene.scenes[0];
    hp.game.loop.sleep();
    for (let i = 0; i < (n ?? 1); i++) scene.sys.step(performance.now(), 1000 / 60);
    hp.game.loop.sleep();
    return st()?.tick ?? -1;
  };

  /** Der Pflicht-Handschlag: zwei Aufnahmen, ein step() dazwischen. */
  const probe = async (opts) => {
    const hp = h();
    if (!hp) throw new Error("kein __domigoPaint");
    if (st()?.overlay === true) throw new Error("eine Karte ist offen — die Welt steht still (Falle 2)");
    await shoot("__probe_a", opts);
    drive(1);
    return shoot("__probe_b", opts);
  };

  window.__frameSink = { shoot, probe, meta, freeze, drive, url: SINK };
  return "bereit";
})();
`;

// ── der Selbsttest ──────────────────────────────────────────────────────────
// Nach dem Muster von measure-presence.mjs: er fährt den ECHTEN Kern, er bricht
// hart ab, und seine Fälle sind so gewählt, dass ein plausibler Pfusch auffällt.
//
// Die wichtigste Wahl darin: die beiden „verschiedenen" Nutzlasten sind GLEICH
// LANG. Ein Hash, den jemand aus Bequemlichkeit durch die Dateigröße ersetzt,
// hielte sie sonst für verschieden und der Tamper bliebe grün — genau der
// Fehler, an dem der measure-presence-Selbsttest zuerst gescheitert ist (Grau,
// wo beide Formeln dasselbe ergeben).
const selftest = () => {
  const fails = [];
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR ?? "/tmp", "frame-sink-selftest-"));
  const url = (b) => `data:image/png;base64,${b.toString("base64")}`;
  const A = url(Buffer.from("AAAABBBBCCCCDDDD", "utf8"));
  const B = url(Buffer.from("AAAABBBBCCCCDDDX", "utf8")); // gleich lang, ein Byte anders
  const C = url(Buffer.from("ZZZZYYYYXXXXWWWW", "utf8"));
  if (A.length !== B.length) fails.push("die beiden Probe-Nutzlasten sind verschieden LANG — der Größen-Tamper würde nicht fallen");

  // 1 · ohne Handschlag wird nichts geschrieben
  {
    const s = createSink(dir);
    const r = s.offer("erstes", A, { tick: 1 });
    if (r.code !== 425) fails.push(`ein Bild vor dem Handschlag kam mit ${r.code} durch (erwartet 425)`);
    if (fs.existsSync(path.join(dir, "erstes.png"))) fails.push("…und es lag trotzdem auf der Platte");
  }

  // 2 · gleiche Prüfsumme bei verschiedenen Ticks = tote Kamera
  {
    const s = createSink(dir);
    s.offer(PROBE_A, A, { tick: 10 });
    const r = s.offer(PROBE_B, A, { tick: 11 });
    if (r.code !== 409) fails.push(`byte-gleiche Proben wurden angenommen (${r.code})`);
    if (!r.body.includes("DIE KAMERA IST TOT")) fails.push("die Meldung nennt die tote Kamera nicht beim Namen");
    if (!s.verdict().deadCamera) fails.push("das Verdikt merkt sich die tote Kamera nicht");
    if (s.verdict().armed) fails.push("die Senke ist nach einer toten Probe trotzdem scharf");
  }

  // 3 · verschiedene Bilder auf DEMSELBEN Tick = der Aufrufer hat nicht gesteppt
  {
    const s = createSink(dir);
    s.offer(PROBE_A, A, { tick: 7 });
    const r = s.offer(PROBE_B, B, { tick: 7 });
    if (r.code !== 409) fails.push(`zwei Proben auf demselben Tick wurden angenommen (${r.code})`);
    if (!r.body.includes("demselben Tick")) fails.push("die Meldung unterscheidet den Aufrufer-Fehler nicht");
  }

  // 4 · ein gültiger Handschlag schärft; danach wird geschrieben, mit Zettel
  {
    const s = createSink(dir);
    s.offer(PROBE_A, A, { tick: 20 });
    const armed = s.offer(PROBE_B, B, { tick: 21 });
    if (armed.code !== 200) fails.push(`ein gültiger Handschlag wurde abgewiesen (${armed.code}: ${armed.body})`);
    const ok = s.offer("gut_001", C, { tick: 22, phase: "p1" });
    if (ok.code !== 200) fails.push(`ein frisches Bild wurde abgewiesen (${ok.code}: ${ok.body})`);
    if (!fs.existsSync(path.join(dir, "gut_001.png"))) fails.push("das angenommene Bild liegt nicht auf der Platte");
    const side = path.join(dir, "gut_001.meta.json");
    if (!fs.existsSync(side)) fails.push("der Beipackzettel fehlt");
    else {
      const m = JSON.parse(fs.readFileSync(side, "utf8"));
      if (m.tick !== 22) fails.push(`der Zettel trägt tick ${m.tick} statt 22`);
      if (typeof m.md5 !== "string" || m.md5.length !== 32) fails.push("der Zettel trägt keine md5");
    }

    // 5 · dasselbe Bild ein zweites Mal = Standbild, abgewiesen und vergiftet
    const dup = s.offer("gut_002", C, { tick: 23 });
    if (dup.code !== 409) fails.push(`ein byte-gleiches Folgebild kam mit ${dup.code} durch`);
    if (fs.existsSync(path.join(dir, "gut_002.png"))) fails.push("…und es lag trotzdem auf der Platte");
    if (!s.verdict().tainted) fails.push("das Verdikt hält den Lauf nicht für vergiftet");
    if (s.verdict().accepted !== 1) fails.push(`das Verdikt zählt ${s.verdict().accepted} angenommene Bilder statt 1`);

    // 6 · ein Bild ohne Tick ist kein Beweis
    const noMeta = s.offer("ohne_zettel", url(Buffer.from("QQQQQQQQQQQQQQQQ", "utf8")), { phase: "p1" });
    if (noMeta.code !== 400) fails.push(`ein Bild ohne tick kam mit ${noMeta.code} durch`);
  }

  // 7 · der Seiten-Code ist TEXT — niemand kompiliert ihn, bis er in der Seite
  //     landet. Ein einziges Gravis-Zeichen darin beendet das Template-Literal
  //     und zerlegt dieses Modul (genau so passiert, 14.08.); ein Tippfehler
  //     darin fällt sonst erst mitten in einem Live-Lauf auf.
  {
    if (CLIENT_SRC.includes("`")) fails.push("CLIENT_SRC enthält ein Gravis-Zeichen — es beendet das Template-Literal");
    if (!CLIENT_SRC.includes("__SINK_URL__")) fails.push("CLIENT_SRC hat keinen Platzhalter für die Senken-Adresse");
    try {
      // eslint-disable-next-line no-new-func
      new Function(CLIENT_SRC.replace("__SINK_URL__", "http://localhost:1"));
    } catch (e) {
      fails.push(`CLIENT_SRC ist kein gültiges JavaScript: ${e.message}`);
    }
    for (const name of ["shoot", "probe", "freeze", "drive"]) {
      if (!CLIENT_SRC.includes(`${name},`) && !CLIENT_SRC.includes(`${name} }`)) {
        fails.push(`CLIENT_SRC reicht »${name}« nicht heraus`);
      }
    }
  }

  fs.rmSync(dir, { recursive: true, force: true });

  if (fails.length > 0) {
    for (const f of fails) console.error(`✗ ${f}`);
    console.error("\nframe-sink --selftest: FEHLGESCHLAGEN — keinem Bild dieses Werkzeugs ist zu trauen");
    process.exit(1);
  }
  console.log("frame-sink --selftest: OK");
  console.log("  Handschlag Pflicht · tote Kamera erkannt · Aufrufer-Fehler getrennt · Dubletten abgewiesen · Zettel mit Tick");
};

// ── CLI ─────────────────────────────────────────────────────────────────────
// Nur wenn diese Datei DIREKT gestartet wird. Sonst würde ein `import` aus
// einem Test den Server hochfahren — ein Prüfstand, der nebenbei einen Port
// belegt, ist die Port-Falle P-65 mit Anlauf.
const RUN_AS_CLI = process.argv[1] !== undefined
  && import.meta.url === new URL(`file://${path.resolve(process.argv[1])}`).href;
if (!RUN_AS_CLI) { /* als Modul geladen — nichts starten */ }
else {

const argv = process.argv.slice(2);
if (argv.includes("--selftest")) { selftest(); process.exit(0); }

const flagAt = argv.indexOf("--port");
const PORT = Number(flagAt === -1 ? 3999 : argv[flagAt + 1]);
const OUT = argv.filter((a, i) => !a.startsWith("--") && i !== flagAt + 1)[0] ?? "./frames";

if (argv.includes("--client")) {
  console.log(CLIENT_SRC.replace("__SINK_URL__", `http://localhost:${PORT}`));
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });
const sink = createSink(OUT);

const finish = () => {
  const v = sink.verdict();
  fs.writeFileSync(path.join(OUT, "_verdict.json"), `${JSON.stringify(v, null, 2)}\n`);
  console.log(`\nframe-sink · Verdikt für ${path.resolve(OUT)}`);
  console.log(`  Handschlag: ${v.armed ? "bestanden" : v.deadCamera ? "TOTE KAMERA" : "nie gefahren"}`);
  console.log(`  angenommen: ${v.accepted} · abgewiesen: ${v.rejected.length}`);
  for (const r of v.rejected) console.log(`    ✗ ${r.name} — ${r.reason}`);
  const bad = !v.armed || v.tainted;
  console.log(bad ? "  ⇒ DIESE REIHE IST KEIN BEWEIS." : "  ⇒ Reihe brauchbar.");
  process.exit(bad ? 1 : 0);
};
process.on("SIGINT", finish);
process.on("SIGTERM", finish);

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }
    if (req.method === "GET" && (req.url ?? "/") === "/__verdict") {
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify(sink.verdict()));
    }
    if (req.method !== "POST") {
      const v = sink.verdict();
      res.writeHead(200);
      return res.end(`frame-sink · ${v.accepted} Bilder · scharf: ${v.armed} · ${path.resolve(OUT)}`);
    }
    const name = decodeURIComponent((req.url ?? "/frame").slice(1)) || "frame";
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = req.headers["x-domigo-meta"];
      let meta = null;
      try { meta = raw === undefined ? null : JSON.parse(decodeURIComponent(String(raw))); } catch { meta = null; }
      const r = sink.offer(name, Buffer.concat(chunks).toString("utf8"), meta);
      if (r.code !== 200) console.error(`\n✗ ${r.body}\n`);
      res.writeHead(r.code);
      res.end(r.body);
    });
  })
  .listen(PORT, () => {
    console.log(`frame-sink lauscht auf ${PORT} → ${path.resolve(OUT)}`);
    console.log(`Handschlag ist Pflicht: ${PROBE_A}/${PROBE_B} mit einem step() dazwischen.`);
  });

}
