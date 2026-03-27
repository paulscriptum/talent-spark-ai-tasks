import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Talent Spark AI - AI-Powered Task Generation",
  description:
    "Generate professional assessment tasks for talent evaluation using AI. Create coding challenges, design briefs, writing samples, and more.",
  keywords: [
    "AI",
    "task generation",
    "talent assessment",
    "hiring",
    "recruitment",
    "coding challenges",
  ],
  authors: [{ name: "Talent Spark AI" }],
  openGraph: {
    title: "Talent Spark AI - AI-Powered Task Generation",
    description:
      "Generate professional assessment tasks for talent evaluation using AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1715" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
