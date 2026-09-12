// CODEX DRAFT — NOT CANON · fixed-endpoint shuttle with a witnessed full ride.
import type { EntityState, WorldInput, EntityEvent } from "./entities.ts";
import type { ZooRideSpec } from "../../content-schema/src/paint-zoo.ts";
import { SUBS, TILE } from "./paint.ts";

export interface ShuttleState { valid: boolean; completed: boolean }
export const shuttleSpec = (e: EntityState): ZooRideSpec | undefined => {
  const ride = e.params.ride as ZooRideSpec | undefined;
  return ride?.mode === "shuttle" ? ride : undefined;
};
export const boardShuttle = (e: EntityState): void => {
  if (!shuttleSpec(e) || e.state !== "shuttle-wait") return;
  e.shuttle = { valid: true, completed: false }; e.state = "shuttle-out"; e.timer = 0;
};
export const abandonShuttle = (e: EntityState): void => {
  if (e.shuttle && e.state === "shuttle-out") e.shuttle.valid = false;
};
export const stepShuttle = (e: EntityState, inp: WorldInput, events: EntityEvent[]): void => {
  const r = shuttleSpec(e)!;
  const s = e.shuttle ??= { valid: false, completed: false };
  const riding = inp.ridingId === e.id;
  e.vx = 0; e.vy = 0;
  if (e.state === "shuttle-wait") return;
  if (e.state === "shuttle-target") {
    if (!riding) { e.state = "shuttle-dwell"; e.timer = 0; }
    return;
  }
  if (e.state === "shuttle-dwell") {
    if (e.timer >= r.dwellTicks) { e.state = "shuttle-back"; e.timer = 0; }
    return;
  }
  if (e.state !== "shuttle-out" && e.state !== "shuttle-back") return;
  const outbound = e.state === "shuttle-out";
  if (outbound && !riding) s.valid = false;
  const target = outbound ? r.to : r.from;
  const x = (target.c + .5) * TILE * SUBS; const y = (target.r + 1) * TILE * SUBS;
  const dx = x - e.x, dy = y - e.y, distance = Math.hypot(dx, dy);
  const speed = r.speedPxPerTick * SUBS;
  e.vx = distance <= speed ? dx : Math.round(dx / distance * speed);
  e.vy = distance <= speed ? dy : Math.round(dy / distance * speed);
  e.x += e.vx; e.y += e.vy;
  if (distance <= speed) {
    if (outbound && s.valid && riding && !s.completed) {
      s.completed = true;
      events.push({ type: "rideComplete", id: e.id });
    }
    e.state = outbound ? s.valid && riding ? "shuttle-target" : "shuttle-dwell" : "shuttle-wait";
    e.timer = 0;
  }
};
