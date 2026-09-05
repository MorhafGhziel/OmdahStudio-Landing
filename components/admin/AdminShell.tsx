"use client";

import { motion } from "framer-motion";
import {
  ArrowUpLeft,
  Film,
  KeyRound,
  LayoutDashboard,
  Layers,
  LogOut,
  Type,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { readToken, useAdmin } from "@/lib/admin-context";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/works", label: "الأعمال", icon: Film },
  { href: "/admin/services", label: "الخدمات", icon: Layers },
  { href: "/admin/clients", label: "العملاء", icon: Users },
  { href: "/admin/content", label: "النصوص", icon: Type },
  { href: "/admin/access", label: "الصلاحيات", icon: KeyRound },
] as const;

function NavLink({ href, label, icon: Icon, active }: {
  href: string;
  label: string;
  icon: typeof Film;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
        active ? "text-chalk" : "text-smoke hover:text-ash"
      )}
    >
      {active && (
        <motion.span
          layoutId="admin-nav-active"
          className="absolute inset-0 rounded-md border border-hairline bg-ink-3"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      <Icon className="relative size-4 shrink-0" />
      <span className="t-label-ar relative">{label}</span>
    </Link>
  );
}

/**
 * Auth gate and chrome for everything under /admin.
 *
 * The token lives in localStorage, which the server cannot see, so the gate
 * runs on the client.
 *
 * The redirect reads storage directly rather than trusting `isAdmin`: that
 * flag is false during the hydration render, because the server had to be
 * told something and it cannot know. Bouncing on it would send a signed-in
 * editor to the login screen every time they opened the panel.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const { isAdmin, logout } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!readToken()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAdmin, pathname, router]);

  if (!isAdmin) {
    return (
      <div className="grid min-h-svh place-items-center bg-ink">
        <p className="t-label text-smoke">Omdah Admin</p>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-ink lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-hairline lg:sticky lg:top-0 lg:h-svh lg:border-s lg:border-b-0 border-b">
        <div className="flex h-full flex-col gap-8 p-6">
          <div>
            <Link href="/admin" className="t-serif text-2xl text-chalk">
              عُمدة
            </Link>
            <p className="t-label mt-1 text-smoke">Control room</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)
                }
              />
            ))}
          </nav>

          <div className="flex flex-col gap-1 border-t border-hairline pt-4">
            <Link
              href="/"
              className="t-label-ar flex items-center gap-3 rounded-md px-3 py-2.5 text-smoke transition-colors hover:text-chalk"
            >
              <ArrowUpLeft className="size-4" />
              عرض الموقع
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="t-label-ar flex items-center gap-3 rounded-md px-3 py-2.5 text-smoke transition-colors hover:text-clay"
            >
              <LogOut className="size-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-6 py-10 sm:px-10 lg:py-14">
        <div className="mx-auto w-full max-w-5xl space-y-8">{children}</div>
      </main>
    </div>
  );
}
