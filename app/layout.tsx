import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "testask - AI-Powered Recruitment Platform",
  description:
    "Create, share and check candidate assessments with testask — the AI-powered recruitment platform.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c9a87c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen bg-background antialiased`}>
        <QueryProvider>
          {children}
          <Toaster richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
