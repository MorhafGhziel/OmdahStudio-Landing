"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
type SectionShape<K extends SectionName> = (typeof defaults)[K];

/* ============================================================
   Provider

   Four sections used to fetch /api/content independently, which
   meant four identical round-trips on every page load. One fetch,
   shared.
   ============================================================ */

interface ContentContextValue {
  content: typeof defaults;
  loading: boolean;
  save: <K extends SectionName>(
    section: K,
    data: SectionShape<K>
  ) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaults);
  const loading = false;

  const save = useCallback(
    async <K extends SectionName>(section: K, data: SectionShape<K>) => {
      try {
        const res = await fetch("/api/content", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken") ?? ""}`,
          },
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

function useContentContext() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useSection must be used within a ContentProvider");
  }
  return ctx;
}

/**
 * Read one section's copy plus a writer scoped to a single field.
 * `EditableText` is the only consumer of `setField`.
 */
export function useSection<K extends SectionName>(section: K) {
  const { content, loading, save } = useContentContext();

  const setField = useCallback(
    (field: keyof SectionShape<K>, value: string) =>
      save(section, { ...content[section], [field]: value }),
    [content, save, section]
  );

  return { copy: content[section] as SectionShape<K>, loading, setField };
}
