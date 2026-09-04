"use client";

import { SmartImage } from "@/components/media/SmartImage";
import { SmartVideo } from "@/components/media/SmartVideo";
import type { WorkType } from "@/lib/types";

interface ProjectDetailProps {
  project: WorkType;
  /** Start the first reel playing. Set when opened from a click. */
  autoPlay?: boolean;
}

/**
 * The body of a project: its footage, then the notes beside it.
 *
 * Shared verbatim by the in-page detail dialog and the /works/[slug] route,
 * so the two can never drift. Neither the heading for the project's name nor
 * the surrounding chrome lives here — each caller owns that, which keeps the
 * heading levels correct in both contexts.
 */
export function ProjectDetail({ project, autoPlay }: ProjectDetailProps) {
  const reels = [project.video, project.video2].filter(Boolean) as string[];

  const facts = [
    { label: "Client", value: project.client },
    { label: "Category", value: project.category },
    { label: "Year", value: project.year },
  ];

  return (
    <div>
      {/* ---- Footage ---- */}
      <div className="space-y-4">
        {reels.length > 0 ? (
          reels.map((src, i) => (
            <div
              key={src}
              className="overflow-hidden rounded-md bg-ink ring-hairline"
            >
              <SmartVideo
                src={src}
                poster={project.image}
                mode="player"
                autoPlay={autoPlay && i === 0}
                className="aspect-video w-full"
              />
            </div>
          ))
        ) : (
          <div className="relative aspect-video overflow-hidden rounded-md ring-hairline">
            <SmartImage
              src={project.image}
              alt={project.title}
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* ---- Notes ---- */}
      <div className="grid grid-cols-12 gap-y-10 pt-10 sm:pt-12">
        <div className="col-span-12 lg:col-span-7">
          <p className="t-label-ar text-clay">عن المشروع</p>
          <p className="t-h3 mt-4 text-chalk">{project.description}</p>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <dl className="border-t border-hairline">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between border-b border-hairline py-3.5"
              >
                <dt className="t-label text-smoke">{fact.label}</dt>
                <dd className="text-[0.9375rem] text-chalk">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {project.services?.length ? (
            <div className="mt-8">
              <p className="t-label-ar text-smoke">الخدمات المقدمة</p>
              <ul className="mt-4 space-y-2.5">
                {project.services.map((service) => (
                  <li
                    key={service}
                    className="flex items-baseline gap-3 text-[0.9375rem] text-ash"
                  >
                    <span className="size-1 shrink-0 rounded-full bg-clay" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
