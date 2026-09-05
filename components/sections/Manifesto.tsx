"use client";

import { Lens } from "@/components/graphics/Lens";
import { Reveal } from "@/components/motion/Reveal";
import { Button, ButtonArrow } from "@/components/ui/Button";
import { WordReveal } from "@/components/motion/WordReveal";
import { useSection } from "@/lib/content";

export function Manifesto() {
  const { copy } = useSection("hero");

  return (
    <section id="about" className="border-t border-hairline">
      <div className="gutter py-20 sm:py-24 lg:py-32">
        {/* Wall label */}
        <Reveal className="flex items-center gap-6 border-b border-hairline pb-5">
          <span className="t-label-ar shrink-0 text-clay">
            {copy.storyTitle}
          </span>
          <span className="t-label text-smoke">Our Story</span>
          <span className="t-serif ms-auto text-2xl text-smoke">01</span>
        </Reveal>

        <div className="grid grid-cols-12 items-start gap-y-14 pt-12 sm:pt-16">
          {/* The statement */}
          <div className="col-span-12 lg:col-span-8">
            <h2 className="t-h1 font-normal text-chalk">
              <WordReveal text={copy.description} />
            </h2>

            <Reveal delay={0.25} className="mt-10 sm:mt-12">
              <Button
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                وش نقدر نسوي لك
                <ButtonArrow />
              </Button>
            </Reveal>
          </div>

          {/* The mark */}
          <Reveal
            delay={0.2}
            className="col-span-12 mx-auto w-48 text-chalk sm:w-56 lg:col-span-3 lg:col-start-10 lg:mx-0 lg:w-full"
          >
            <Lens />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
