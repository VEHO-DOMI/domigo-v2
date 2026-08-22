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

// ── R5-W8 · W7 · P7 §12.8 · DER STANDBILD-ZUSTAND ──────────────────────────
//
// P7 hat es an einer Stelle gemessen, an der es weh tat: die fuenf
// Torschluss-Meldungen werden auf die SPIELFLAECHE gemalt, nicht ins DOM, und
// es gab kein Instrument im Repo, das einen Augenblick fotografieren kann, in
// dem die Welt absichtlich stillsteht. Der Grund ist das Gesetz dieser Datei
// selbst: eine Reihe, die stillsteht, ist kein Beweis, also weist die Senke
// jedes byte-gleiche Folgebild ab. Fuer eine REIHE ist das richtig. Fuer EINEN
// Augenblick ist es die falsche Frage.
//
// Der Standbild-Zustand beantwortet deshalb eine andere: er nimmt GENAU EIN
// Bild an und sagt in seinem eigenen Zettel, dass es eines ist. Was er dabei
// NICHT tut, ist das Gesetz aufweichen — der normale Zustand bleibt Wort fuer
// Wort, wie er war (ohne Handschlag 425, byte-gleiches Folgebild 409 und
// vergiftet). Ein Standbild-Aufruf OHNE die Flagge bricht deshalb weiter ab.
export const STANDBILD_ZETTEL =
  "Standbild, keine Reihe: EIN Bild aus einem Augenblick, in dem die Welt absichtlich steht "
  + "(stehender Toast, offene Karte). Eine Reihe waere hier N-mal dasselbe Bild — deshalb nimmt "
  + "dieser Zustand genau EINES an und weist jedes weitere ab.";

/** Der Handschlag KONNTE gefahren werden — die Kamera hat in diesem Lauf
 *  bewiesen, dass sie lebt, und erst danach ist die Welt angehalten worden.
 *  Das ist der bessere der beiden Faelle und wird deshalb benannt, nicht
 *  stillschweigend genossen. */
export const STANDBILD_MIT_HANDSCHLAG =
  "Handschlag BESTANDEN, bevor die Welt angehalten wurde: die Kamera hat in diesem Lauf zwei "
  + "verschiedene Bilder geliefert. Dieses Standbild hat damit denselben Kamerabeweis wie eine Reihe.";

/** …und der andere, ehrlich benannt: stand die Welt schon, als der Lauf ankam,
 *  ist der Handschlag per Bauart nicht zu haben — er verlangt zwei Aufnahmen
 *  mit VERSCHIEDENEN Pruefsummen, und genau das kann ein Standbild nicht
 *  liefern. Was dann fehlt, fehlt sichtbar. */
export const STANDBILD_OHNE_HANDSCHLAG =
  "Handschlag ENTFALLEN: er verlangt zwei Aufnahmen mit verschiedenen Pruefsummen, und die Welt "
  + "stand schon, als dieser Lauf ankam. Dieses Bild traegt deshalb KEINEN Kamerabeweis (P-66) — "
  + "es ist ungeprueft dasselbe, was die Kamera zuletzt gemalt hat.";

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
export const createSink = (outDir, opts = {}) => {
  /** R5-W8 · W7: EIN Bild statt einer Reihe, erklaert. Siehe STANDBILD_ZETTEL. */
  const standbild = opts.standbild === true;
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
    // R5-W8 · W7: der Handschlag ist im Standbild-Zustand KEINE Vorbedingung —
    // dort ist gerade die Bewegung das, was fehlt. Er wird trotzdem angenommen,
    // wenn der Aufrufer ihn fahren konnte (siehe shoot-world: es geht, solange
    // die Welt vor dem Anhalten noch lief), und sein Ausgang steht im Zettel.
    if (!armed && !standbild) {
      return {
        code: 425,
        body: `${name} abgewiesen: der Handschlag fehlt.\n`
          + `Erst ${PROBE_A} / ${PROBE_B} mit einem step() dazwischen — die Senke schreibt`
          + " kein Bild, bevor die Kamera in DIESEM Lauf bewiesen hat, dass sie lebt.",
      };
    }
    if (standbild && accepted.length >= 1) {
      rejected.push({ name, reason: `Standbild, keine Reihe — angenommen ist schon ${accepted[0].name}` });
      return {
        code: 409,
        body: `${name} abgewiesen: STANDBILD, KEINE REIHE.\n`
          + `Angenommen ist bereits ${accepted[0].name}; dieser Zustand nimmt genau EIN Bild.\n`
          + "Fuer eine Reihe ist der normale Zustand da (ohne --standbild) — er bringt seinen\n"
          + "Handschlag mit und weist ein stillstehendes Folgebild ab, statt es zu schreiben.",
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
      `${JSON.stringify({
        ...meta,
        frame: `${name}.png`,
        md5: hash,
        index: accepted.length,
        // Der Zettel sagt, WAS dieses Bild ist. Ein Standbild, das aussieht wie
        // das erste Bild einer Reihe, waere genau die stille Sorte Beweis, gegen
        // die diese Datei gebaut ist.
        ...(standbild ? { modus: "standbild", standbild: standbildZettel() } : {}),
      }, null, 2)}\n`,
    );
    return { code: 200, body: `ok ${accepted.length}`, file };
  };

  /** Was im Zettel und im Verdikt ueber den Standbild-Zustand steht — EINE
   *  Quelle, damit Bild und Verdikt nie zweierlei behaupten. */
  const standbildZettel = () => ({
    was: STANDBILD_ZETTEL,
    handschlag: armed ? STANDBILD_MIT_HANDSCHLAG : STANDBILD_OHNE_HANDSCHLAG,
    kamerabeweis: armed,
  });

  const verdict = () => {
    const v = {
      modus: standbild ? "standbild" : "reihe",
      armed,
      deadCamera,
      accepted: accepted.length,
      rejected,
      tainted: rejected.length > 0,
      frames: accepted,
    };
    if (standbild) v.standbild = standbildZettel();
    return { ...v, brauchbar: laufBrauchbar(v) };
  };

  return { offer, verdict };
};

/**
 * Ist dieser Lauf ein Beweis? EINE Funktion fuer beide Zustaende, weil es
 * vorher zwei Kopien derselben Bedingung an zwei Stellen gab (hier im CLI und
 * in shoot-world) — und zwei Kopien einer Bedingung driften.
 *
 *   Reihe     · der Handschlag MUSS bestanden sein (ohne ihn ist kein Bild ein
 *               Beweis), und kein Bild darf abgewiesen worden sein.
 *   Standbild · der Handschlag DARF fehlen (die Welt stand schon). Was nicht
 *               fehlen darf: eine TOTE Kamera — wurde der Handschlag gefahren
 *               und ist er an gleichen Bytes gescheitert, ist auch das Standbild
 *               wertlos. Und genau EIN Bild muss angekommen sein.
 */
export const laufBrauchbar = (v) => {
  if (v.tainted === true) return false;
  if (v.modus === "standbild") return v.deadCamera !== true && v.accepted === 1;
  return v.armed === true;
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

  // ── R5-W8 · W7 · 8 · DER STANDBILD-ZUSTAND ────────────────────────────────
  // Der Fall ist echt: EIN Bild aus einem Augenblick, in dem die Welt steht.
  // Geprueft werden beide Richtungen und der Zettel — eine Ausnahme, die man
  // dem Bild nicht ansieht, waere schlimmer als keine.
  {
    const s = createSink(dir, { standbild: true });
    const eins = s.offer("standbild_001", C, { tick: 44, phase: "p1" });
    if (eins.code !== 200) fails.push(`ein Standbild OHNE Handschlag wurde abgewiesen (${eins.code}: ${eins.body})`);
    if (!fs.existsSync(path.join(dir, "standbild_001.png"))) fails.push("das Standbild liegt nicht auf der Platte");
    const zettel = path.join(dir, "standbild_001.meta.json");
    if (!fs.existsSync(zettel)) fails.push("das Standbild hat keinen Beipackzettel");
    else {
      const m = JSON.parse(fs.readFileSync(zettel, "utf8"));
      if (m.modus !== "standbild") fails.push(`der Zettel nennt den Zustand »${m.modus}« statt »standbild«`);
      if (m.standbild?.was !== STANDBILD_ZETTEL) fails.push("der Zettel sagt nicht »Standbild, keine Reihe«");
      if (m.standbild?.handschlag !== STANDBILD_OHNE_HANDSCHLAG) fails.push("der Zettel verschweigt, dass der Kamerabeweis fehlt");
      if (m.standbild?.kamerabeweis !== false) fails.push("der Zettel behauptet einen Kamerabeweis, den es nicht gibt");
    }
    // …und das ZWEITE Bild ist kein zweites Standbild, sondern eine Reihe.
    const zwei = s.offer("standbild_002", A, { tick: 45 });
    if (zwei.code !== 409) fails.push(`ein zweites Standbild kam mit ${zwei.code} durch (erwartet 409)`);
    if (!zwei.body.includes("STANDBILD, KEINE REIHE")) fails.push("die Abweisung nennt den Grund nicht beim Namen");
    if (fs.existsSync(path.join(dir, "standbild_002.png"))) fails.push("…und es lag trotzdem auf der Platte");
    const v = s.verdict();
    if (v.modus !== "standbild") fails.push(`das Verdikt nennt den Zustand »${v.modus}«`);
    if (v.brauchbar !== false) fails.push("ein Standbild-Lauf, der eine Reihe versucht hat, gilt trotzdem als brauchbar");
  }

  // 8b · ein SAUBERES Standbild ist brauchbar — sonst prueft Fall 8 nur die rote
  //      Richtung, und eine Bedingung, die nie gruen wird, ist so wertlos wie
  //      eine, die nie rot wird.
  {
    const s = createSink(dir, { standbild: true });
    s.offer("nur_eins", url(Buffer.from("MMMMNNNNOOOOPPPP", "utf8")), { tick: 7, phase: "p4" });
    const v = s.verdict();
    if (v.brauchbar !== true) fails.push("ein Standbild-Lauf mit genau EINEM Bild gilt nicht als brauchbar");
    if (v.armed !== false) fails.push("ohne Handschlag darf die Senke nicht scharf heissen");
  }

  // 8c · der Handschlag ist im Standbild-Zustand NICHT verboten — konnte der
  //      Aufrufer ihn fahren (die Welt lief, bevor sie angehalten wurde), traegt
  //      das Bild denselben Kamerabeweis wie eine Reihe. Und eine TOTE Kamera
  //      macht auch ein Standbild wertlos.
  {
    const s = createSink(dir, { standbild: true });
    s.offer(PROBE_A, A, { tick: 1 });
    s.offer(PROBE_B, B, { tick: 2 });
    const ok = s.offer("mit_beweis", url(Buffer.from("RRRRSSSSTTTTUUUU", "utf8")), { tick: 3 });
    if (ok.code !== 200) fails.push(`ein Standbild NACH bestandenem Handschlag wurde abgewiesen (${ok.code})`);
    else {
      const m = JSON.parse(fs.readFileSync(path.join(dir, "mit_beweis.meta.json"), "utf8"));
      if (m.standbild?.kamerabeweis !== true) fails.push("der Zettel verschweigt den bestandenen Handschlag");
      if (m.standbild?.handschlag !== STANDBILD_MIT_HANDSCHLAG) fails.push("der Zettel nennt den bestandenen Handschlag nicht beim Namen");
    }

    const tot = createSink(dir, { standbild: true });
    tot.offer(PROBE_A, A, { tick: 10 });
    tot.offer(PROBE_B, A, { tick: 11 });          // gleiche Bytes, andere Ticks = tote Kamera
    tot.offer("aus_toter_kamera", url(Buffer.from("VVVVWWWWXXXXYYYY", "utf8")), { tick: 12 });
    if (tot.verdict().brauchbar !== false) fails.push("ein Standbild aus einer TOTEN Kamera gilt als brauchbar");
  }

  // ── 9 · DER TAMPER, DER AUF DEM FALL SITZT (P-82) ─────────────────────────
  // Dieselbe Aufruffolge wie Fall 8, nur OHNE die Flagge. Genau hier gehen
  // richtig und plausibel-falsch auseinander: wer den Standbild-Zustand baut,
  // indem er das Gesetz global aufweicht, bleibt hier gruen — und liefert
  // danach jede stillstehende Reihe als Beweis aus.
  {
    const s = createSink(dir);   // KEINE Flagge
    const r = s.offer("ohne_flagge_001", url(Buffer.from("1111222233334444", "utf8")), { tick: 44, phase: "p1" });
    if (r.code !== 425) fails.push(`TAMPER: derselbe Aufruf OHNE --standbild kam mit ${r.code} durch (erwartet 425)`);
    if (fs.existsSync(path.join(dir, "ohne_flagge_001.png"))) fails.push("TAMPER: …und das Bild lag trotzdem auf der Platte");
    if (s.verdict().modus !== "reihe") fails.push("TAMPER: eine Senke ohne Flagge haelt sich fuer ein Standbild");
    if (s.verdict().brauchbar !== false) fails.push("TAMPER: ein Lauf ohne Handschlag gilt als brauchbar");
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
  console.log("  Standbild: EIN Bild angenommen, das zweite abgewiesen, der Zettel nennt den fehlenden bzw. "
    + "bestandenen Kamerabeweis — und dieselbe Folge OHNE die Flagge bricht weiter mit 425 ab (P-82).");
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
  // R5-W8 · W7: EINE Quelle fuer beide Zustaende — zwei Kopien einer
  // Bedingung driften, und diese hier entscheidet ueber »Beweis oder nicht«.
  const bad = !laufBrauchbar(v);
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
