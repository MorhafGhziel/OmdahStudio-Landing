"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectDetail } from "@/components/works/ProjectDetail";
import { useWorks } from "@/lib/data";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { works, loading } = useWorks();

  const index = works.findIndex((work) => work.link === `/works/${slug}`);
  const project = index >= 0 ? works[index] : undefined;
  const next = works.length > 1 ? works[(index + 1) % works.length] : undefined;

  if (loading) {
    return (
      <div className="gutter pt-36 pb-24">
        <div className="sheen h-6 w-32 rounded-xs" />
        <div className="sheen mt-8 h-16 w-2/3 rounded-xs" />
        <div className="sheen mt-12 aspect-[16/9] w-full rounded-md" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="gutter flex min-h-[70svh] flex-col items-center justify-center text-center">
        <p className="t-label text-clay">404</p>
        <h1 className="t-h1 mt-4">ما لقينا هذا المشروع</h1>
        <Link
          href="/#works"
          className="link-rule mt-8 text-[0.9375rem] font-medium text-chalk"
        >
          ارجع للأعمال
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-28 sm:pt-32">
      <div className="gutter">
        {/* Wall label */}
        <Reveal className="flex items-center gap-6 border-b border-hairline pb-5">
          <Link
            href="/#works"
            className="t-label-ar flex shrink-0 items-center gap-2 text-smoke transition-colors hover:text-chalk"
          >
            <ArrowRight className="size-3.5" />
            الأعمال
          </Link>
          <span className="t-label-ar ms-auto text-smoke">{project.category}</span>
          <span className="t-serif text-xl text-smoke">{project.year}</span>
        </Reveal>

        {/* Title */}
        <div className="grid grid-cols-12 items-end gap-y-6 pt-12 pb-12 sm:pt-16 sm:pb-16">
          <h1 className="t-serif col-span-12 text-[clamp(3rem,10vw,8rem)] leading-[0.92] text-chalk lg:col-span-8">
            {project.title}
          </h1>
          <Reveal delay={0.2} className="col-span-12 lg:col-span-3 lg:col-start-10">
            <p className="t-label text-smoke">Client</p>
            <p className="mt-2 text-lg text-chalk">{project.client}</p>
          </Reveal>
        </div>
      </div>

      {/* Footage and notes are shared verbatim with the in-page dialog, so
          the two views of a project can never drift apart. */}
      <Reveal className="gutter pb-20 sm:pb-28">
        <ProjectDetail project={project} />
      </Reveal>

      {/* Next piece */}
      {next && (
        <Link href={next.link ?? "#"} className="group block border-t border-hairline">
          <div className="gutter flex flex-wrap items-center justify-between gap-6 py-16 sm:py-24">
            <div>
              <span className="t-label-ar text-clay">المشروع التالي</span>
              <p className="t-serif mt-3 text-[clamp(2.25rem,6vw,4.5rem)] leading-none text-chalk transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-3">
                {next.title}
              </p>
            </div>
            <span className="grid size-16 shrink-0 place-items-center rounded-full border border-chalk/25 text-chalk transition-colors duration-500 group-hover:border-clay group-hover:bg-clay">
              <ArrowRight className="size-5 rotate-180" />
            </span>
          </div>
        </Link>
      )}
    </article>
  );
}
