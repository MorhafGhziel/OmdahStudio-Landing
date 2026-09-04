import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { Ambient } from "@/components/layout/Ambient";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { AdminProvider } from "@/lib/admin-context";
import { ContentProvider } from "@/lib/content";

/* Arabic carries the whole voice of the site, so it gets the full weight range. */
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--f-ar",
  display: "swap",
});

/* Latin display: index numerals, English titles, the footer wordmark. */
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-display",
  display: "swap",
});

/* Latin UI: wall labels and metadata only. */
const ui = Inter({
  subsets: ["latin"],
  variable: "--f-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "عُمدة | إنتاج مرئي",
    template: "%s — عُمدة",
  },
  description:
    "شركة سعودية، نشتغل على المحتوى المرئي. تصوير، موشن جرافيك، ثري دي، وحملات ترويجية.",
  keywords: [
    "عمدة",
    "إنتاج مرئي",
    "تصوير",
    "موشن جرافيك",
    "الرياض",
    "السعودية",
  ],
  openGraph: {
    title: "عُمدة | إنتاج مرئي",
    description: "ما يعتمد عليه مشروعك. إنتاج مرئي من الرياض.",
    locale: "ar_SA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabic.variable} ${serif.variable} ${ui.variable}`}
    >
      <body className="antialiased">
        <AdminProvider>
          <ContentProvider>
            {/* First in the DOM, so everything that follows paints over it. */}
            <Ambient />
            <Preloader />
            <ScrollProgress />
            <Header />
            {/* Positioned: scroll-linked animations measure offsets up the
                ancestor chain and warn on any static box along the way. */}
            <main className="relative">{children}</main>
            <Footer />
          </ContentProvider>
        </AdminProvider>

        {/* Paper grain, laid over everything and clickable through. */}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
