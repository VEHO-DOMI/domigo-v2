import type { Metadata } from "next";
import { Fredoka, Inter, Quicksand } from "next/font/google";
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
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fredoka.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BrandHeader />
        {children}
      </body>
    </html>
  );
}
