"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "من نحن", id: "about" },
  { label: "خدماتنا", id: "services" },
  { label: "أعمالنا", id: "works" },
  { label: "عملاؤنا", id: "clients" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  // Empty until a section actually claims the viewport, so the hero doesn't
  // light up a nav item that isn't on screen yet.
  const [active, setActive] = useState<string>("");
  const [lifted, setLifted] = useState(false);
  const { isAdmin, logout } = useAdmin();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const onHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (y) => setLifted(y > 40));

  /**
   * Active-section tracking. An IntersectionObserver reports only when a
   * boundary is crossed, where the old scroll listener re-measured every
   * section's offset on every frame of every scroll.
   */
  useEffect(() => {
    if (!onHome) return;

    const sections = NAV.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goTo = useCallback(
    (id: string) => {
      setOpen(false);
      if (!onHome) {
        window.location.href = `/#${id}`;
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    },
    [onHome]
  );

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
      >
        <nav
          className={cn(
            "flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-hairline bg-ink-2/80 py-2 ps-2 pe-2 backdrop-blur-xl transition-[box-shadow,background-color] duration-500",
            lifted && "bg-ink-2/95 ring-hairline"
          )}
        >
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="عمدة — الصفحة الرئيسية"
            className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5"
          >
            <Image
              src="/icons/WhiteLogo.svg"
              alt="Omdah"
              width={96}
              height={50}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const isActive = onHome && active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-300",
                    isActive ? "text-chalk" : "text-smoke hover:text-chalk"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      transition={{ duration: 0.5, ease: EASE }}
                      className="absolute inset-x-4 -bottom-0.5 h-px bg-clay"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isAdmin && (
              <button
                onClick={logout}
                className="t-label-ar hidden items-center gap-1.5 rounded-full border border-clay/30 px-3 py-2 text-clay transition-colors hover:bg-clay/10 sm:flex"
              >
                <LogOut className="size-3" />
                خروج
              </button>
            )}

            <Button
              size="sm"
              onClick={() => goTo("contact")}
              className="hidden md:inline-flex"
            >
              تواصل معنا
              <ButtonArrow />
            </Button>

            {/* Mobile trigger — two rules that fold into an X */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full md:hidden"
            >
              <span className="relative block h-3 w-5">
                <motion.span
                  animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute inset-x-0 top-0 h-px origin-center bg-chalk"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute inset-x-0 bottom-0 h-px origin-center bg-chalk"
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink gutter md:hidden"
          >
            <ul className="space-y-2">
              {[...NAV, { label: "تواصل معنا", id: "contact" }].map(
                (item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: EASE }}
                    className="border-b border-hairline"
                  >
                    <button
                      onClick={() => goTo(item.id)}
                      className="flex w-full items-baseline justify-between py-5 text-start"
                    >
                      <span className="t-h2 text-chalk">{item.label}</span>
                      <span className="t-serif text-2xl text-smoke">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </button>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
