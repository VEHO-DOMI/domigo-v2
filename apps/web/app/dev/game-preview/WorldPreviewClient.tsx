"use client";
import dynamic from "next/dynamic";
import type { WorldGameProps } from "@domigo/game-2d";
import { sendAttempt } from "@/lib/attempt-outbox";

const WorldGame = dynamic(() => import("@domigo/game-2d").then((module) => module.WorldGame), { ssr: false });

export default function WorldPreviewClient(props: Omit<WorldGameProps, "onAttempt">) {
  return <WorldGame {...props} onAttempt={(attempt) => sendAttempt(attempt)} />;
}
