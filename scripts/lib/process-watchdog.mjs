import { fork } from "node:child_process";
import { writeSync } from "node:fs";
import { constants } from "node:os";

// Keep the deadline outside the checked process: a synchronous decoder or
// native shutdown can block that process's own timers. Inherit file stdout
// directly in real runs, so the supervisor adds no output pipe/backpressure.
export function supervise({ file, args, timeoutMs, label, capture = false }) {
  return new Promise((resolve) => {
    const child = fork(file, [...args, "--watchdog-child"], {
      stdio: ["ignore", capture ? "pipe" : "inherit", capture ? "pipe" : "inherit", "ipc"],
      execArgv: [],
    });
    let stderr = "";
    let timedOut = false;
    let failedToStart = false;
    let status = "noch keine Ressourcenmeldung (Start oder synchroner Aufruf)";
    if (capture) {
      child.stdout.resume();
      child.stderr.on("data", (chunk) => { stderr += chunk; });
    }
    child.on("message", (message) => {
      if (message?.type === "watchdog-resources" && Array.isArray(message.resources)) {
        status = message.resources.join(", ") || "keine aktiven Ressourcen";
      }
    });
    const timer = setTimeout(() => {
      timedOut = true;
      const message = `${label} hängt — Handle: ${status} (letzte Meldung; Grenze ${timeoutMs / 1000} s)\n`;
      try {
        if (capture) stderr += message;
        else writeSync(2, message);
      } catch {
        // A closed diagnostic destination must not prevent the timeout exit.
      } finally {
        // Exact owned PID only. SIGKILL also covers a blocked event loop or
        // native exit; SIGTERM would allow a handler to postpone the deadline.
        child.kill("SIGKILL");
      }
    }, timeoutMs);
    timer.unref(); // A finished child must never wait for the deadline.
    child.on("error", () => { failedToStart = true; });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolve({
        code: timedOut ? 124 : failedToStart ? 1 : code ?? (128 + (constants.signals[signal] ?? 1)),
        stderr,
        timedOut,
      });
    });
  });
}
