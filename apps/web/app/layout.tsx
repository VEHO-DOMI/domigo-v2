import type { Metadata } from "next";
import { Fredoka, Inter, Quicksand } from "next/font/google";
import { loadTrapRegistry } from "@domigo/content-loader";
import { TrapProvider, type TrapMap } from "@domigo/task-ui";
import BrandHeader from "./BrandHeader";
import "./globals.css";

// The DomiGo type system: Fredoka (display), Inter (body), Quicksand (labels).
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-inter", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-fredoka", display: "swap" });
const quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-quicksand", display: "swap" });

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
