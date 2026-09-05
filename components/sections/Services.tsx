"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { useSection } from "@/lib/content";
import { useServices } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { arabicIndex, cn } from "@/lib/utils";

export function Services() {
  const { copy } = useSection("services");
  const { services, loading } = useServices();

  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="services" className="border-t border-hairline">
      <div className="gutter py-20 sm:py-24 lg:py-32">
        {/* Wall label */}
        <Reveal className="flex items-center gap-6 border-b border-hairline pb-5">
          <span className="t-label-ar shrink-0 text-clay">{copy.badge}</span>
          <span className="t-label text-smoke">What We Do</span>
          <span className="t-serif ms-auto text-2xl text-smoke">02</span>
        </Reveal>

        {/* Heading */}
        <div className="grid grid-cols-12 gap-y-8 pt-12 sm:pt-16">
          <div className="col-span-12 lg:col-span-6">
            <h2 className="t-h1 text-chalk">
              <WordReveal text={copy.title} />
            </h2>
          </div>
          <Reveal delay={0.15} className="col-span-12 lg:col-span-5 lg:col-start-8">
            <p className="t-lead text-ash">{copy.description}</p>
          </Reveal>
        </div>

        {/* The index */}
        <div className="mt-14 border-t border-hairline sm:mt-20">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-b border-hairline py-7">
                  <div className="sheen h-7 w-2/3 rounded-xs" />
                </div>
              ))
            : services.map((service, i) => {
                const isOpen = openId === service.id;

                return (
                  <Reveal
                    key={service.id}
                    delay={Math.min(i, 6) * 0.04}
                    className="border-b border-hairline"
                  >
                    <div
                      className={cn(
                        "group relative transition-colors duration-500",
                        isOpen && "bg-ink-3"
                      )}
                    >
                      <button
                        onClick={() => setOpenId(isOpen ? null : service.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 px-2 py-6 text-start sm:gap-8 sm:py-8"
                      >
                        {/* Position in the list, not the row's identity — an
                            id is a uuid here and would print as one. */}
                        <span className="t-serif w-10 shrink-0 text-xl text-smoke sm:text-2xl">
                          {arabicIndex(i + 1)}
                        </span>

                        <span className="t-h3 flex-1 text-chalk transition-transform duration-500 group-hover:-translate-x-1">
                          {service.title}
                        </span>

                        <span className="t-label-ar hidden shrink-0 text-smoke sm:block">
                          {service.category}
                        </span>

                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                            isOpen
                              ? "border-clay bg-clay text-chalk"
                              : "border-hairline text-smoke group-hover:border-chalk group-hover:text-chalk"
                          )}
                        >
                          {isOpen ? (
                            <Minus className="size-4" />
                          ) : (
                            <Plus className="size-4" />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.55, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-12 gap-y-6 px-2 pb-9 sm:ps-[4.5rem]">
                              <p className="t-body col-span-12 measure text-ash lg:col-span-7">
                                {service.description}
                              </p>

                              <ul className="col-span-12 flex flex-wrap content-start gap-2 lg:col-span-4 lg:col-start-9">
                                {service.features.map((feature) => (
                                  <li
                                    key={feature}
                                    className="rounded-full border border-hairline bg-ink-3 px-3.5 py-1.5 text-[0.8125rem] text-ash"
                                  >
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
        </div>

        <Reveal delay={0.1} className="mt-14 flex justify-center sm:mt-20">
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {copy.ctaText}
            <ButtonArrow />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
