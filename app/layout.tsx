import type { Metadata } from "next";
import { Geist, Geist_Mono, Kufam } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kufam = Kufam({
  subsets: ["arabic"],
  weight: ["400", "700", "900"],
  variable: "--font-kufam",
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
        className={`${geistSans.variable} ${geistMono.variable} ${kufam.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
