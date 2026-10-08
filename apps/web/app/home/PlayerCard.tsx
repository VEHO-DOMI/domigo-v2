import Link from "next/link";
import Image from "next/image";
import { abmelden } from "../le/konto-aktion";
import { avatarPath, AVATAR_NAMES } from "@/lib/avatar";
import { levelFor, vocabTitle, grammarTitle, registerFor, barFraction, formatXp, prestigeStars } from "@/lib/levels";
import type { TrainerProfile } from "./trainer-data";

export default function PlayerCard({ profile, grade, preview }: { profile: TrainerProfile; grade: number; preview: boolean }) {
  const level = levelFor(profile.xp ?? 0);
  const title = vocabTitle(level.level, level.prestige, registerFor(grade));
  const grammar = levelFor(profile.grammarXp ?? 0);
  const grammarName = grammarTitle(grammar.level, grammar.prestige, registerFor(grade));
  const suffix = preview ? `?jahrgang=${grade}` : "";
  async function logOut() { "use server"; await abmelden(); }
  return <section className="og-player" aria-label="Profil">
    <div className="og-player-top">
      <Link href={`/profil${suffix}`} aria-label="Profil und Avatar öffnen"><Image className="og-avatar" src={avatarPath(profile.avatar)} alt={AVATAR_NAMES[profile.avatar - 1]} width={64} height={64} unoptimized /></Link>
      <div className="og-player-info">
        <div className="og-player-name"><Link href={`/profil${suffix}`}>{profile.name}</Link>
          {profile.xp !== null && <span className={`og-rank zone-${level.zone}`}>{prestigeStars(level.prestige)} Lv {level.level} · {title.name}</span>}
        </div>
        <div className="og-player-xp">⭐ {profile.xp === null ? "—" : formatXp(profile.xp)} XP</div>
        {profile.xp !== null && <p className="og-vibe">{title.vibe}</p>}
      </div>
    </div>
    {profile.xp !== null && <div className="og-xp-bar">
      <div className="og-track"><span className={`og-fill zone-${level.zone}`} style={{ width: `${barFraction(level.xpIntoLevel, level.xpToNext) * 100}%` }} /></div>
      <div className="og-xp-labels"><span>Lv {level.level}</span><span>{level.xpToNext === null ? "Max level" : `${formatXp(level.xpToNext)} XP to next`}</span><span>{level.prestige ? `P ${level.prestige}` : `Lv ${Math.min(20, level.level + 1)}`}</span></div>
    </div>}
    <div className="og-grammar-bar">
      <div><span>🧠 Grammar{profile.grammarXp !== null ? ` · Lv ${grammar.level} · ${grammarName.name}` : ""}</span><span>{profile.grammarXp === null ? "—" : formatXp(profile.grammarXp)} XP</span></div>
      {profile.grammarXp !== null && <div className="og-track"><span className="og-fill" style={{ width: `${barFraction(grammar.xpIntoLevel, grammar.xpToNext) * 100}%` }} /></div>}
    </div>
    <div className="og-player-actions">
      {!preview && <form action={logOut}><button className="og-logout" type="submit">Log Out</button></form>}
      <Link className="og-switch" href={`/modi${suffix}${suffix ? "&" : "?"}bereich=1`}>🔄 Switch to Grammar or Story Mode</Link>
    </div>
  </section>;
}
