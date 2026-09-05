"use client";

import Image from "next/image";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { useSection } from "@/lib/content";
import { useClients } from "@/lib/data";
import { imageSrc } from "@/lib/media";
import type { ClientType } from "@/lib/types";

function LogoPlate({ client }: { client: ClientType }) {
  const src = imageSrc(client.logo);
  if (!src) return null;

  return (
    // Big, softly rounded, borderless plates — the card is a quiet surface
    // the mark sits on, not a frame drawn around it.
    <div className="mx-3 flex h-32 w-48 shrink-0 items-center justify-center rounded-[1.375rem] bg-ink-3 px-8 transition-colors duration-500 hover:bg-ink-2 sm:mx-4 sm:h-40 sm:w-60 sm:px-10">
      <Image
        src={src}
        alt={client.name}
        width={200}
        height={100}
        // Eager on purpose. Lazy loading keys off the viewport, but the
        // marquee is always carrying fresh cards across that boundary, so
        // logos popped in mid-drift. Optimised down to a few KB each, the
        // whole roster costs less than one of the source PNGs did.
        loading="eager"
        // The roster mixes wide wordmarks with padded squares, so cap both
        // axes and let object-contain decide — a height-only cap renders the
        // square logos at a fraction of the plate.
        //
        // Every logo here is transparent-background, and they split roughly
        // in half between dark marks and marks that are already white. Any
        // invert-based chain therefore erases one half or the other, which is
        // what left cards looking empty. brightness(0) crushes whatever the
        // source is to black, invert(1) flips that to white, and both leave
        // alpha alone — so any mark, light or dark, lands as the same flat
        // white silhouette. No blend mode required.
        className="max-h-16 w-auto max-w-[160px] object-contain opacity-80 [filter:brightness(0)_invert(1)] transition-opacity duration-500 hover:opacity-100 sm:max-h-20"
      />
    </div>
  );
}

export function Clients() {
  const { copy } = useSection("clients");
  const { clients, loading } = useClients();

  const half = Math.ceil(clients.length / 2);
  const rows = [clients.slice(0, half), clients.slice(half)];

  return (
    <section id="clients" className="border-t border-hairline">
      <div className="py-20 sm:py-24 lg:py-32">
        <div className="gutter">
          <Reveal className="flex items-center gap-6 border-b border-hairline pb-5">
            <span className="t-label shrink-0 text-clay">Trusted By</span>
            <span className="t-serif ms-auto text-2xl text-smoke">04</span>
          </Reveal>

          <div className="grid grid-cols-12 gap-y-8 pt-12 sm:pt-16">
            <div className="col-span-12 lg:col-span-6">
              <h2 className="t-h1 text-chalk">
                <WordReveal text={copy.title} />
              </h2>
            </div>
            <Reveal
              delay={0.15}
              className="col-span-12 self-end lg:col-span-4 lg:col-start-9"
            >
              <p className="t-lead text-ash">{copy.description}</p>
            </Reveal>
          </div>
        </div>

        {/* Two rows drifting against each other. */}
        <div className="mt-16 space-y-4 sm:mt-20 sm:space-y-6">
          {loading
            ? Array.from({ length: 2 }).map((_, row) => (
                <div key={row} className="flex gap-6 overflow-hidden px-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="sheen h-32 w-48 shrink-0 rounded-[1.375rem] sm:h-40 sm:w-60"
                    />
                  ))}
                </div>
              ))
            : rows.map((row, i) =>
                row.length ? (
                  <Marquee key={i} duration={i === 0 ? 55 : 68} reverse={i === 1}>
                    {row.map((client) => (
                      <LogoPlate key={client.name} client={client} />
                    ))}
                  </Marquee>
                ) : null
              )}
        </div>
      </div>
    </section>
  );
}
