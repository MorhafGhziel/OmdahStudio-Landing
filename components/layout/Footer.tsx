"use client";

import Image from "next/image";
import Link from "next/link";
import { EditableText } from "@/components/admin/EditableText";
import { Reveal } from "@/components/motion/Reveal";
import { useSection } from "@/lib/content";

const SITEMAP = [
  { label: "من نحن", id: "about" },
  { label: "خدماتنا", id: "services" },
  { label: "أعمالنا", id: "works" },
  { label: "عملاؤنا", id: "clients" },
];

export function Footer() {
  const { copy, setField } = useSection("footer");

  return (
    <footer className="relative z-10 overflow-hidden border-t border-hairline">
      <div className="gutter pt-20 sm:pt-28">
        <div className="grid grid-cols-12 gap-y-12 border-b border-hairline pb-16">
          {/* Identity */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Image
              src="/icons/WhiteLogo.svg"
              alt="Omdah"
              width={140}
              height={73}
              className="h-9 w-auto"
            />
            <EditableText
              as="p"
              value={copy.tagline}
              onSave={(v) => setField("tagline", v)}
              className="t-h3 mt-6 max-w-xs font-normal text-ash"
            />
          </div>

          {/* Sitemap */}
          <nav className="col-span-6 lg:col-span-3 lg:col-start-6">
            <p className="t-label text-smoke">Index</p>
            <ul className="mt-5 space-y-3">
              {SITEMAP.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/#${item.id}`}
                    className="link-rule text-[0.9375rem] text-chalk"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-span-6 lg:col-span-3 lg:col-start-10">
            <EditableText
              value={copy.contactHeading}
              onSave={(v) => setField("contactHeading", v)}
              className="t-label-ar text-smoke"
            />
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href={copy.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-rule text-[0.9375rem] text-chalk"
                >
                  WhatsApp
                </Link>
              </li>
              <li>
                <Link
                  href={copy.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-rule text-[0.9375rem] text-chalk"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <EditableText
                  value={copy.email}
                  onSave={(v) => setField("email", v)}
                  className="block"
                >
                  <Link
                    href={`mailto:${copy.email}`}
                    dir="ltr"
                    className="link-rule text-[0.9375rem] text-chalk"
                  >
                    {copy.email}
                  </Link>
                </EditableText>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-7">
          {/* A Latin phrase inside an RTL row lays its words out
              right-to-left, which reads as "Morhaf Built by". Give the run
              its own direction. */}
          <p dir="ltr" className="t-meta flex items-center gap-1.5 text-smoke">
            Built by
            <Link
              href="https://inno.sa"
              target="_blank"
              rel="noopener noreferrer"
              className="link-rule font-medium text-chalk"
            >
              Inno
            </Link>
          </p>
          <p className="t-label text-smoke">Riyadh · Saudi Arabia</p>
        </div>
      </div>

      {/* The wordmark as architecture — set oversized and cropped by the
          bottom edge, so the page ends on the name rather than a rule. */}
      <Reveal duration={1.4} className="pointer-events-none select-none">
        <p
          aria-hidden
          className="t-serif -mb-[0.18em] block translate-y-[0.06em] whitespace-nowrap text-center text-[22vw] leading-[0.78] text-hairline"
        >
          OMDAH
        </p>
      </Reveal>
    </footer>
  );
}
