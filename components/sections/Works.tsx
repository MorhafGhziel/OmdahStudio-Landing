"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ProjectModal } from "@/components/works/ProjectModal";
import { SmartVideo } from "@/components/media/SmartVideo";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { useWorks } from "@/lib/data";
import type { WorkType } from "@/lib/types";
import { arabicIndex, cn } from "@/lib/utils";

function WorkTile({
  work,
  index,
  onOpen,
}: {
  work: WorkType;
  index: number;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);

  // The "watch" disc trails the pointer inside the tile.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });

  const track = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <Reveal
      delay={(index % 2) * 0.1}
      className={cn("group", index % 2 === 1 && "md:mt-28")}
    >
      {/*
        * A real anchor, so the project page stays crawlable and
        * cmd/middle-click still opens it in a tab. Only a plain left click is
        * taken over, to show the work in place instead of navigating.
        */}
      <Link
        href={work.link ?? "#"}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
            return;
          }
          e.preventDefault();
          onOpen();
        }}
        className="block"
      >
        <div
          onMouseEnter={setHover.bind(null, true)}
          onMouseLeave={setHover.bind(null, false)}
          onMouseMove={track}
          className="relative aspect-[4/3] overflow-hidden rounded-md bg-ink-3"
        >
          {/* One element: the still holds the frame and the clip fades over
              it while the pointer is inside the tile. */}
          <SmartVideo
            src={work.video}
            poster={work.image}
            alt={work.title}
            active={hover}
            sizes="(min-width: 768px) 45vw, 92vw"
            className="size-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />

          {/* Index mark */}
          <span className="t-serif absolute start-5 top-4 z-10 text-xl text-chalk/70 mix-blend-difference">
            {arabicIndex(index + 1)}
          </span>

          {/* Pointer disc — desktop only, where there is a pointer to follow. */}
          <motion.span
            style={{ x: springX, y: springY }}
            animate={{ scale: hover ? 1 : 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute -left-11 -top-11 z-20 hidden size-22 place-items-center rounded-full bg-clay text-ink md:grid"
          >
            <span className="t-label-ar">شاهد</span>
          </motion.span>
        </div>

        {/* Caption — a museum label under the piece. */}
        <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-hairline pt-4">
          <h3 className="t-serif text-2xl text-chalk sm:text-3xl">
            {work.title}
          </h3>
          <span className="t-label shrink-0 text-chalk/45">{work.year}</span>
        </div>
        <p className="mt-1.5 text-[0.9375rem] text-chalk/50">
          {work.category}
          <span className="mx-2 text-clay">/</span>
          {work.client}
        </p>
      </Link>
    </Reveal>
  );
}

export function Works() {
  // `rest` excludes the featured piece, which is already playing as the hero
  // showreel further up the page.
  const { rest, loading } = useWorks();
  const [opened, setOpened] = useState<WorkType | null>(null);

  return (
    <section id="works" className="border-t border-hairline">
      <div className="gutter py-20 sm:py-24 lg:py-32">
        <Reveal className="flex items-center gap-6 border-b border-hairline pb-5">
          <span className="t-label-ar shrink-0 text-clay">أعمالنا</span>
          <span className="t-label text-chalk/40">Selected Work</span>
          <span className="t-serif ms-auto text-2xl text-chalk/40">03</span>
        </Reveal>

        <div className="grid grid-cols-12 gap-y-8 pt-12 sm:pt-16">
          <h2 className="t-h1 col-span-12 lg:col-span-7">
            <WordReveal text="مشاريع نفتخر فيها" />
          </h2>
          <Reveal
            delay={0.15}
            className="col-span-12 self-end lg:col-span-4 lg:col-start-9"
          >
            <p className="t-lead text-chalk/60">
              كل مشروع هنا بدأ بفكرة، وانتهى بشيء يشتغل على أرض الواقع.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-16 sm:mt-20 md:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn("space-y-5", i % 2 === 1 && "md:mt-28")}
                >
                  <div className="aspect-[4/3] rounded-md bg-ink-3" />
                  <div className="h-6 w-1/2 rounded-xs bg-ink-3" />
                </div>
              ))
            : rest.map((work, i) => (
                <WorkTile
                  key={work.id}
                  work={work}
                  index={i}
                  onOpen={() => setOpened(work)}
                />
              ))}
        </div>
      </div>

      <ProjectModal project={opened} onClose={() => setOpened(null)} />
    </section>
  );
}
