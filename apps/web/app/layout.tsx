import type { Metadata } from "next";
import localFont from "next/font/local";
import { loadTrapRegistry } from "@domigo/content-loader";
import { TrapProvider, type TrapMap } from "@domigo/task-ui";
import BrandHeader from "./BrandHeader";
import "./globals.css";

// The DomiGo type system: Fredoka (display), Inter (body), Quicksand (labels).
//
// R5-W3 · E5 · THE BUILD NO LONGER PHONES OUT (debt D-33 (nach K1s Entdopplung: D-72)). These three came
// from `next/font/google`, which fetches the .woff2 files from fonts.gstatic.com
// AT BUILD TIME — so a green build depended on a third party being reachable.
// It was observed on PR #273 (the same commit run three times: twice red, once
// green) and it failed this session's own build once, with a wall of
// module-not-found lines out of an inter_*.module.css. A gate that can go red
// because someone else's server blinked is not a gate.
//
// The three files under ./fonts are the exact latin slices Google serves for the
// weight ranges below, downloaded once and committed (all three are SIL Open
// Font License 1.1 — redistribution is expressly granted; see fonts/LICENSE.md).
// They are VARIABLE fonts, which is what Google was already serving: one file
// covers the whole weight range, so every weight in use renders as before.
// `scripts/check-fonts.mjs` keeps the door shut.
const inter = localFont({
  src: "./fonts/inter-var-latin.woff2",
  weight: "400 900", // matches the 400…900 the type system asks for
  variable: "--font-inter",
  display: "swap",
});
const fredoka = localFont({
  src: "./fonts/fredoka-var-latin.woff2",
  weight: "300 700", // the family's own axis; 400/600/700 are the ones in use
  variable: "--font-fredoka",
  display: "swap",
});
const quicksand = localFont({
  src: "./fonts/quicksand-var-latin.woff2",
  weight: "300 700", // the family's own axis; 400…700 are the ones in use
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DomiGo",
  description: "English vocabulary & grammar trainer for AHS Klasse 1–4.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // D-1: the trap registry (trap-registry@1, server-loaded + cached) feeds every
  // task surface's Feedback Card via context — only the student-facing slice ships.
  const traps: TrapMap = Object.fromEntries(
    (loadTrapRegistry()?.traps ?? []).map((t) => [t.id, { nameDe: t.nameDe, icon: t.icon, oneLinerDe: t.oneLinerDe }]),
  );
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fredoka.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TrapProvider traps={traps}>
          <BrandHeader />
          {children}
        </TrapProvider>
      </body>
    </html>
  );
}
