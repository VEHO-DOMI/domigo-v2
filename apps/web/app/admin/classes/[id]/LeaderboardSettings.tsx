"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ClassLeaderboardSettings } from "@/lib/leaderboard";
import "./leaderboard-settings.css";

export default function LeaderboardSettings({ classId, initial, testClass, readOnly = false }: {
  classId: string; initial: ClassLeaderboardSettings; testClass: boolean; readOnly?: boolean;
}) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const locked = testClass || readOnly || saving;
  async function save(next: ClassLeaderboardSettings) {
    if (locked) return;
    setSaving(true); setNotice("");
    try {
      const response = await fetch("/api/admin/class-leaderboard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ classId, ...next }) });
      const result = await response.json();
      if (!response.ok || response.redirected || result?.ok !== true) throw new Error("not_saved");
      setSettings(next); setNotice("Gespeichert."); router.refresh();
    } catch { setNotice("Nicht gespeichert. Bitte versuche es später erneut."); }
    finally { setSaving(false); }
  }
  return <section className="class-board-settings" aria-labelledby="class-board-title">
    <h2 id="class-board-title">Bestenliste</h2>
    <p>Kinder vergleichen ihre bestätigten Lernleistungen. Beide Freigaben sind anfangs aus.</p>
    <div className="class-board-switches">
      <button type="button" className="dg-chip" role="switch" aria-checked={settings.leaderboard} disabled={locked}
        onClick={() => save({ leaderboard: !settings.leaderboard, gradeBoardOptIn: false })}>Bestenliste in der Klasse: {settings.leaderboard ? "Ein" : "Aus"}</button>
      <button type="button" className="dg-chip" role="switch" aria-checked={settings.gradeBoardOptIn} disabled={locked || !settings.leaderboard}
        onClick={() => settings.gradeBoardOptIn ? save({ leaderboard: true, gradeBoardOptIn: false }) : dialog.current?.showModal()}>Jahrgangs-Bestenliste: {settings.gradeBoardOptIn ? "Ein" : "Aus"}</button>
    </div>
    {testClass && <p>Testklassen nehmen nicht an Bestenlisten teil. Beide Schalter sind gesperrt.</p>}
    {readOnly && <p>Großmeister-Übersicht: nur lesen. Änderungen sind auf der eigenen Klassenseite möglich.</p>}
    {saving && <p role="status">Speichert …</p>}{notice && <p role="status">{notice}</p>}
    <dialog ref={dialog} className="class-board-dialog" aria-labelledby="grade-board-question" aria-describedby="grade-board-explanation">
      <h2 id="grade-board-question">Jahrgangs-Bestenliste einschalten?</h2>
      <p id="grade-board-explanation">Damit sehen die Kinder deiner Klasse die Vornamen (mit Spitznamen), Avatare, Level, Lern-Serie, bestätigten Lernpunkte und den Klassennamen der Kinder aller anderen freigegebenen Klassen dieses Jahrgangs — und umgekehrt. Die Tages-Challenge bleibt in der eigenen Klasse. Du kannst die Freigabe jederzeit ausschalten.</p>
      <div><button type="button" autoFocus onClick={() => dialog.current?.close()}>Abbrechen</button><button type="button" onClick={() => { dialog.current?.close(); void save({ leaderboard: true, gradeBoardOptIn: true }); }}>Für meine Klasse einschalten</button></div>
    </dialog>
  </section>;
}
