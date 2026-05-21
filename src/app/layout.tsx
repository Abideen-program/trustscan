import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Shield, ShieldAlert, Library, Info } from "lucide-react";
import Navbar from "@/components/molecules/Navbar";
import Footer from "@/components/molecules/Footer";
import { LanguageProvider } from "@/components/context/LanguageContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TrustScan — AI-Powered Scam & Phishing Detector",
  description:
    "Instantly analyze suspicious messages, phishing links, and screenshot attachments using Google Gemini 2.5 Flash AI. Stay safe from online fraud, bank scams, and identity theft.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "TrustScan — AI-Powered Scam & Phishing Detector",
    description:
      "Paste suspicious texts, links or screenshots to detect financial fraud, imposter brands and phishing attempts.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustScan — AI-Powered Scam & Phishing Detector",
    description:
      "Protect yourself from online scammers using real-time AI pattern analysis.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased text-slate-100 flex flex-col min-h-screen">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
