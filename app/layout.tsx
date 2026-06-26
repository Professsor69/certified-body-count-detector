import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Certified Body Count Detector — 100% Fake, 1000% Accurate",
  description:
    "The world's most advanced AI body count scanner. Let us scan your face and reveal the truth. For entertainment purposes only.",
  keywords: [
    "body count detector",
    "meme personality quiz",
    "funny face scan",
    "entertainment",
    "body count meme",
    "rizz level",
  ],
  openGraph: {
    title: "Certified Body Count Detector — 100% Fake, 1000% Accurate",
    description: "How many? Let the AI decide. Scan your face now.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}>
      <body className="font-sans bg-dark-bg text-white antialiased">
        {children}
      </body>
    </html>
  );
}
