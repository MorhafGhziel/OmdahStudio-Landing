import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Readex_Pro } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/lib/admin-context";
import { ContentProvider } from "@/lib/content";

/*
 * Arabic carries the whole voice of the site.
 *
 * Readex Pro is variable across 160–700, so every weight the design asks for
 * comes out of one file rather than five static cuts. Its Latin is drawn
 * alongside the Arabic rather than bolted on, which is why it also serves as
 * the UI face below — the wall labels and the headlines now share a skeleton
 * instead of being two unrelated families sitting next to each other.
 */
const arabic = Readex_Pro({
  subsets: ["arabic", "latin"],
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
      className={`${arabic.variable} ${serif.variable}`}
    >
      <body className="antialiased">
        <AdminProvider>
          <ContentProvider>{children}</ContentProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
