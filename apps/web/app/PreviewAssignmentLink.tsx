"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** No writes and no learning state: the destination validates every URL value. */
export default function PreviewAssignmentLink() {
  const path = usePathname();
  const unit = /^\/practice\/(g([1-4])-u\d{2})$/.exec(path);
  const story = /^\/play\/([1-4])\/(ch\d{2})$/.exec(path);
  const query = unit
    ? new URLSearchParams({ source: "unit", grade: unit[2], unit: unit[1] })
    : story ? new URLSearchParams({ source: "story", grade: story[1], chapter: story[2] }) : null;
  if (!query) return null;
  return <Link href={`/admin/assignments/new?${query}`} style={{ color: "var(--accent)", fontWeight: 700 }}>Chapter-Übungen zuweisen →</Link>;
}
