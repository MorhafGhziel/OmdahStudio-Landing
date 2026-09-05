import { Ambient } from "@/components/layout/Ambient";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

/** Everything a visitor sees wrapped around every public page. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* First in the DOM, so everything that follows paints over it. */}
      <Ambient />
      <Preloader />
      <ScrollProgress />
      <Header />
      {/* Positioned: scroll-linked animations measure offsets up the
          ancestor chain and warn on any static box along the way. */}
      <main className="relative">{children}</main>
      <Footer />

      {/* Paper grain, laid over everything and clickable through. */}
      <div className="grain" aria-hidden />
    </>
  );
}
