"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { EditControl, EditableText } from "@/components/admin/EditableText";
import { SmartVideo } from "@/components/media/SmartVideo";
import { WordReveal } from "@/components/motion/WordReveal";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { useSection } from "@/lib/content";
import { useWorks } from "@/lib/data";
import { EASE } from "@/lib/motion";

export function Hero() {
  const { copy, setField } = useSection("hero");
  const { featured } = useWorks();
  const [soundOn, setSoundOn] = useState(false);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="overflow-hidden pt-32 sm:pt-40">
      {/*
       * Centred, and carrying only three things: the name, the promise, and
       * the way in. An earlier version split this into an asymmetric grid
       * with live project counts bolted onto one side — the counts read as
       * filler and the split left a hole down the middle of the page.
       */}
      <div className="gutter-tight text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="t-label text-smoke"
        >
          Omdah&nbsp;— Visual Production · Riyadh
        </motion.p>

        <EditableText
          as="h1"
          value={copy.title}
          onSave={(v) => setField("title", v)}
          className="t-display mt-7 text-chalk"
        >
          <WordReveal text={copy.title} immediate delay={0.25} />
        </EditableText>

        <EditableText
          as="p"
          value={copy.subtitle}
          onSave={(v) => setField("subtitle", v)}
          className="t-lead mx-auto mt-6 max-w-xl text-ash"
        >
          <WordReveal text={copy.subtitle} immediate delay={0.5} />
        </EditableText>

        {/* Two buttons of equal weight: one filled, one outlined. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="mt-11 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" onClick={() => scrollTo("contact")}>
            {copy.ctaText}
            <ButtonArrow />
          </Button>

          <EditControl
            value={copy.ctaText}
            onSave={(v) => setField("ctaText", v)}
            label="تعديل نص الزر"
          />

          <Button variant="outline" size="lg" onClick={() => scrollTo("works")}>
            شاهد أعمالنا
          </Button>
        </motion.div>
      </div>

      {/* ---- Showreel ---- */}
      <div className="relative mt-16 pb-20 sm:mt-24 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1, ease: EASE }}
          className="gutter relative"
        >
          <div className="relative overflow-hidden rounded-lg bg-ink ring-hairline">
            <SmartVideo
              src={featured?.video}
              poster={featured?.image}
              soundOn={soundOn}
              priority
              sizes="(min-width: 1248px) 1200px, 100vw"
              className="aspect-[16/10] w-full sm:aspect-[2.2/1]"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/70 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
              <div>
                <p className="t-label text-chalk/55">Showreel</p>
                <p className="mt-1.5 text-lg font-medium text-chalk">
                  {featured?.title ?? "Omdah Production"}
                </p>
              </div>

              <button
                onClick={() => setSoundOn((v) => !v)}
                aria-label={soundOn ? "كتم الصوت" : "تشغيل الصوت"}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-chalk/25 text-chalk backdrop-blur-sm transition-colors hover:bg-chalk hover:text-ink"
              >
                {soundOn ? (
                  <Volume2 className="size-4" />
                ) : (
                  <VolumeX className="size-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
