import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSansArabic = localFont({
  src: "../public/fonts/IBMPlexSansArabic-SemiBold.ttf",
  variable: "--font-ibm-plex-sans-arabic",
  weight: "600",
});

export const metadata: Metadata = {
  title: "Omdah",
  description: "شركة سعودية، نشتغل على المحتوى المرئي.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSansArabic.variable} antialiased bg-black`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
