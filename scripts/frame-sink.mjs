// R5-F2 · DIE BILD-SENKE — wie dieses Spiel sich selbst fotografiert.
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
// Damit ist ein Bild-Beweis reproduzierbar statt Glückssache — und weil die
// Simulation deterministisch ist (fester Tick, kein Math.random, keine
// Wanduhr), ist derselbe Warp plus dieselbe Anzahl `step()` derselbe Frame.
//
// ── Benutzung ───────────────────────────────────────────────────────────────
//   node scripts/frame-sink.mjs ./frames        (lauscht auf 3999)
//
// …und in der Seite, EINMAL, das Werkzeug anlegen:
//
//   window.__shoot = (name) => new Promise((res, rej) => {
//     const hp = window.__domigoPaint;
//     hp.game.renderer.snapshot((img) => {
//       fetch("http://localhost:3999/" + encodeURIComponent(name),
//             { method: "POST", body: img.src }).then(() => res(name)).catch(rej);
//     });
//     hp.rafStep(); hp.rafStep();
//   });
//
// ── Zwei Fallen, die BEIDE schon Messreihen wertlos gemacht haben ───────────
//  · DIE WELT STEHT STILL, WENN EINE KARTE OFFEN IST. `Sim.step` kehrt bei
//    offener Karte sofort zurück; `tickCount` bewegt sich dann nicht, und eine
//    Bildserie ist dann N-mal DASSELBE Bild. Kapitel 1 öffnet beim Start die
//    Auftragskarte, und in der Nähe des Käfigs kommt der Käfig-Hinweis dazu.
//    Vor JEDER Aufnahme also: `sim.overlayOpen === false` prüfen, sonst den
//    Knopf klicken — und React rendert nur EINE Karten-Aktion pro
//    javascript_exec-Aufruf, das braucht also einen eigenen Aufruf.
//  · REDUZIERTE BEWEGUNG kompiliert halb ohne Animation. Vor jeder Aufnahme
//    `matchMedia('(prefers-reduced-motion: reduce)').matches === false` prüfen,
//    sonst misst man das Standbild und nicht die Bewegung.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2] ?? "./frames";
const PORT = Number(process.argv[3] ?? 3999);
fs.mkdirSync(OUT, { recursive: true });
let n = 0;

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }
    if (req.method !== "POST") {
      res.writeHead(200);
      return res.end(`frame-sink · ${n} Bilder · ${path.resolve(OUT)}`);
    }
    const name = decodeURIComponent((req.url ?? "/frame").slice(1)) || `frame_${n}`;
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const body = Buffer.concat(chunks).toString("utf8");
      const comma = body.indexOf(",");
      if (!body.startsWith("data:image/") || comma < 0) {
        res.writeHead(400);
        return res.end("keine Bild-Daten-URL");
      }
      const file = path.join(OUT, name.endsWith(".png") ? name : `${name}.png`);
      fs.writeFileSync(file, Buffer.from(body.slice(comma + 1), "base64"));
      n++;
      res.writeHead(200);
      res.end(`ok ${n}`);
    });
  })
  .listen(PORT, () => console.log(`frame-sink lauscht auf ${PORT} → ${path.resolve(OUT)}`));
