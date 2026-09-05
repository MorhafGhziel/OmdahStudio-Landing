"use client";

import Link from "next/link";
import { Reel } from "@/components/graphics/Reel";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { useSection } from "@/lib/content";

function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

/** Read the number back out of a wa.me link so the two can never disagree. */
function phoneFrom(url: string): string {
  const digits = url.match(/(\d{8,15})/)?.[1];
  if (!digits) return "WhatsApp";
  return `+${digits.replace(/^(\d{3})(\d{2})(\d{3})(\d+)$/, "$1 $2 $3 $4")}`;
}

/** Last path segment of a profile URL, as a handle. */
function handleFrom(url: string): string {
  const slug = url.replace(/\/+$/, "").split("/").pop();
  return slug ? `@${slug}` : url;
}

/**
 * The way in.
 *
 * This used to be a centred headline with a button under it, which left two
 * thirds of a full-height band empty and pushed everything against one edge.
 * It is now a pair: the ask on the reading side, the slate on the other, so
 * the section carries weight across its whole width instead of a void.
 */
export function Contact() {
  const { copy } = useSection("footer");

  const channels = [
    {
      label: "WhatsApp",
      href: copy.whatsappUrl,
      value: phoneFrom(copy.whatsappUrl),
    },
    {
      label: "Instagram",
      href: copy.instagramUrl,
      value: handleFrom(copy.instagramUrl),
    },
    { label: "Email", href: `mailto:${copy.email}`, value: copy.email },
  ];

  return (
    <section id="contact" className="border-t border-hairline">
      <div className="gutter py-20 sm:py-24 lg:py-28">
        <Reveal className="flex items-center gap-6 border-b border-hairline pb-5">
          <span className="t-label-ar shrink-0 text-clay">تواصل معنا</span>
          <span className="t-label text-chalk/40">Start a Project</span>
          <span className="t-serif ms-auto text-2xl text-chalk/40">05</span>
        </Reveal>

        <div className="grid grid-cols-12 items-center gap-y-12 pt-12 sm:pt-14">
          {/*
           * The ask.
           *
           * Centred until the reel can sit beside it. Left aligned to the
           * reading edge, a single narrow column of copy hugged the right of
           * a full-width band and left the other half empty — the same void
           * the desktop layout was built to close, just moved to tablet.
           */}
          <div className="col-span-12 text-center lg:col-span-5 lg:text-start">
            {/* .t-h1, not .t-display: the hero owns the display size, and two
                of them on one page is two things shouting. */}
            <h2 className="t-h1">
              <WordReveal text="عندك فكرة؟" />
            </h2>
            <p className="t-h3 mt-3 font-normal text-ash">
              <WordReveal text="خلنا نحولها لواقع" delay={0.15} />
            </p>

            <Reveal delay={0.25} className="mt-8 sm:mt-10">
              {/* No geometry overrides. This is the same button as everywhere
                  else on the site; the padding and type size it had bolted on
                  made it read as a different component. */}
              <ButtonLink
                href={copy.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
              >
                <WhatsAppMark className="me-3 size-4" />
                راسلنا الحين
                <ButtonArrow />
              </ButtonLink>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="t-meta-ar mt-5 text-smoke">
                نرد خلال ساعات العمل · الرياض
              </p>
            </Reveal>
          </div>

          {/* ---- The reel ----
              Hidden from assistive tech: it says nothing the copy beside it
              has not already said, and its own label would only interrupt. */}
          <Reveal
            delay={0.15}
            duration={1.2}
            aria-hidden
            className="col-span-12 lg:col-span-7 lg:col-start-6"
          >
            <Reel />
          </Reveal>
        </div>

        {/* ---- Channel index ---- */}
        <div className="mt-16 grid gap-px border-t border-hairline sm:mt-20 sm:grid-cols-3">
          {channels.map((channel, i) => (
            <Reveal
              key={channel.label}
              delay={i * 0.08}
              className="border-b border-hairline py-6 sm:border-b-0"
            >
              <Link
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group block"
              >
                <span className="t-label block text-chalk/40">
                  {channel.label}
                </span>
                {/* Latin runs need their own direction inside an RTL page, or
                    bidi reordering throws the leading + and @ to the far end
                    and the number reads backwards. */}
                <span
                  dir="ltr"
                  className="link-rule mt-2 inline-block text-lg text-chalk/85 group-hover:text-chalk"
                >
                  {channel.value}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
