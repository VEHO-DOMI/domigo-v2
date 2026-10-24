"use client";
import { useTrainerLanguage } from "@/lib/trainer/preferences";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { avatarPath, AVATARS } from "@/lib/avatar";

export default function AvatarPicker({ initialAvatar, ownerId, preview, grade }: { initialAvatar: number; ownerId: string | null; preview: boolean; grade: number }) {
  const de = useTrainerLanguage(grade) === "de";
  const [selected, setSelected] = useState(initialAvatar);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); dialog.current?.focus({ preventScroll: true }); if (dialog.current) dialog.current.scrollTop = 0; }, []);
  function close() { dialog.current?.close(); }
  async function choose(avatar: number) {
    if (busy.current) return;
    if (preview) { setSelected(avatar); setMessage(de ? "Vorschau — nichts gespeichert" : "Preview — nothing saved"); return; }
    if (!ownerId) return;
    busy.current = true; setPending(true); setMessage("");
    try {
      const response = await fetch("/api/profil", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar, ownerId }) });
      const reply = await response.json();
      if (!response.ok || response.redirected || reply.ok !== true || reply.avatar !== avatar) throw new Error("not_saved");
      setSelected(avatar); setMessage(de ? "Gespeichert." : "Saved."); router.refresh();
    } catch { setMessage(de ? "Nicht gespeichert. Bitte versuche es später erneut." : "Not saved. Please try again later."); }
    finally { busy.current = false; setPending(false); }
  }
  return <><button className="og-primary" type="button" onClick={() => { dialog.current?.showModal(); dialog.current?.focus({ preventScroll: true }); if (dialog.current) dialog.current.scrollTop = 0; }}>{de ? "Wähle deine Figur" : "Choose your avatar"}</button><dialog ref={dialog} tabIndex={-1} className="og-avatar-panel" aria-labelledby="avatar-title">
    <h1 id="avatar-title">{de ? "Wähle deine Figur" : "Choose your avatar"}</h1>
    <p>{de ? "Wähle deine Figur." : "Pick a character that represents you"}</p>
    <div className="og-avatar-grid">{AVATARS.map(({ id, de: german, en }) => <button key={id} type="button" disabled={pending} onClick={() => void choose(id)} aria-pressed={selected === id} aria-label={de ? german : en}>
      <Image src={avatarPath(id)} alt="" width={56} height={56} unoptimized /><span>{de ? german : en}</span>
    </button>)}</div>
    <button type="button" className="og-avatar-close" onClick={close}>{de ? "Fertig" : "Done"}</button>
    <p role="status" aria-live="polite">{message}</p>
  </dialog></>;
}
