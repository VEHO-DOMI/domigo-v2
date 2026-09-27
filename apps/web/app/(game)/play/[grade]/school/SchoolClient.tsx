"use client";
import dynamic from "next/dynamic";
import type { SchoolView } from "@domigo/game-2d/school-types";
const SchoolGame = dynamic(() => import("@domigo/game-2d/SchoolGame").then((m) => m.SchoolGame), { ssr: false });
export default function SchoolClient({ initial, playerKey }: { initial: SchoolView; playerKey: string }) {
  return <SchoolGame initial={initial} playerKey={playerKey} />;
}
