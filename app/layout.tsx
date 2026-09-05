import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
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

/**
 * Document shell only.
 *
 * The gallery chrome — ambient light, header, footer — lives in the (site)
 * group so the admin can sit on the same fonts and providers without
 * inheriting a marketing header it has no use for.
 */
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
          <ContentProvider>{children}</ContentProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
