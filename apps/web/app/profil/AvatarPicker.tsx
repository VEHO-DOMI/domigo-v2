"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { avatarPath, AVATAR_NAMES } from "@/lib/avatar";

export default function AvatarPicker({ initialAvatar, ownerId, preview, grade }: { initialAvatar: number; ownerId: string | null; preview: boolean; grade: number }) {
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
    if (preview) { setSelected(avatar); setMessage("Vorschau — nichts gespeichert"); return; }
    if (!ownerId) return;
    busy.current = true; setPending(true); setMessage("");
    try {
      const response = await fetch("/api/profil", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar, ownerId }) });
      const reply = await response.json();
      if (!response.ok || response.redirected || reply.ok !== true || reply.avatar !== avatar) throw new Error("not_saved");
      setSelected(avatar); setMessage("Gespeichert."); router.refresh();
    } catch { setMessage("Nicht gespeichert. Bitte versuche es später erneut."); }
    finally { busy.current = false; setPending(false); }
  }
  return <><button className="og-primary" type="button" onClick={() => { dialog.current?.showModal(); dialog.current?.focus({ preventScroll: true }); if (dialog.current) dialog.current.scrollTop = 0; }}>Choose your avatar</button><dialog ref={dialog} tabIndex={-1} className="og-avatar-panel" aria-labelledby="avatar-title">
    <h1 id="avatar-title">Choose your avatar</h1>
    <p>{grade === 1 ? "Wähle deine Figur." : "Pick a character that represents you"}</p>
    <div className="og-avatar-grid">{AVATAR_NAMES.map((name, i) => <button key={name} type="button" disabled={pending} onClick={() => void choose(i + 1)} aria-pressed={selected === i + 1} aria-label={name}>
      <Image src={avatarPath(i + 1)} alt="" width={56} height={56} unoptimized /><span>{name}</span>
    </button>)}</div>
    <button type="button" className="og-avatar-close" onClick={close}>Done</button>
    <p role="status" aria-live="polite">{message}</p>
  </dialog></>;
}
