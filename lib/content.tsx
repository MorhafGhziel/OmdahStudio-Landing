"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authHeaders } from "./data";
import type {
  ClientsContent,
  FooterContent,
  HeroContent,
  ServicesContent,
} from "./types";

/* ============================================================
   Defaults — what the site says before the database answers,
   and what it falls back to if the database never does.
   ============================================================ */

export const defaultHero: HeroContent = {
  title: "معك عُمدة",
  subtitle: "ما يعتمد عليه مشروعك",
  description:
    "شركة سعودية، نشتغل على المحتوى المرئي. نشتغل ببساطة، والبساطة هي قوتنا.",
  ctaText: "اكتشف خدماتنا",
  storyTitle: "قصتنا",
};

export const defaultServicesContent: ServicesContent = {
  badge: "خدماتنا",
  title: "عمدة، وش عنده؟",
  description:
    "عنده خدمات إنتاجية فنية رهيبة تليق بك، بعملائك، بمجتمعك. نسوق لك بطريقة ترفع مشوارك!",
  ctaText: "تواصل معنا الآن",
};

export const defaultClientsContent: ClientsContent = {
  title: "عملائنا",
  description: "نفخر بالعمل مع مجموعة من العملاء المميزين",
};

export const defaultFooter: FooterContent = {
  tagline: "ما يعتمد عليه مشروعك",
  contactHeading: "تواصل معنا",
  whatsappUrl: "https://wa.me/966558960098",
  instagramUrl: "https://www.instagram.com/omdah.sa",
  email: "Info@omdah.sa",
};

const defaults = {
  hero: defaultHero,
  services: defaultServicesContent,
  clients: defaultClientsContent,
  footer: defaultFooter,
};

export type SectionName = keyof typeof defaults;
export type SectionShape<K extends SectionName> = (typeof defaults)[K];
export type SiteContent = typeof defaults;

/**
 * Merge a stored section over its defaults.
 *
 * A saved row may predate a field that the design now reads, so spreading
 * over the default keeps every key present and typed rather than handing a
 * component `undefined` where it expects a string.
 */
function merge(stored: Record<string, unknown> | undefined): SiteContent {
  const out = { ...defaults };

  for (const name of Object.keys(defaults) as SectionName[]) {
    const row = stored?.[name];
    if (row && typeof row === "object") {
      out[name] = { ...defaults[name], ...(row as object) } as never;
    }
  }

  return out;
}

/* ============================================================
   Provider

   Four sections used to fetch /api/content independently, which
   meant four identical round-trips on every page load. One fetch,
   shared.
   ============================================================ */

interface ContentContextValue {
  content: SiteContent;
  loading: boolean;
  save: <K extends SectionName>(
    section: K,
    data: SectionShape<K>
  ) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        setContent(merge(json?.content));
        setLoading(false);
      })
      .catch(() => {
        // The defaults above are already on screen; a failed fetch just
        // means the site keeps showing them.
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(
    async <K extends SectionName>(section: K, data: SectionShape<K>) => {
      try {
        const res = await fetch("/api/content", {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ section, data }),
        });
        if (!res.ok) return false;
        setContent((prev) => ({ ...prev, [section]: data }));
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const value = useMemo(
    () => ({ content, loading, save }),
    [content, loading, save]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return ctx;
}

/** Read one section's copy. Writes go through the admin, not the page. */
export function useSection<K extends SectionName>(section: K) {
  const { content, loading } = useContent();
  return { copy: content[section] as SectionShape<K>, loading };
}
