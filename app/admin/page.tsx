"use client";

import { AlertTriangle, Film, Layers, Users } from "lucide-react";
import Link from "next/link";
import { Loading, PageHead, Panel } from "@/components/admin/ui";
import { useClients, useServices, useWorks } from "@/lib/data";
import type { WorkType } from "@/lib/types";

function Stat({
  href,
  label,
  value,
  icon: Icon,
}: {
  href: string;
  label: string;
  value: number;
  icon: typeof Film;
}) {
  return (
    <Link href={href} className="group">
      <Panel className="flex items-center gap-4 p-5 transition-colors group-hover:border-chalk/20">
        <span className="grid size-11 place-items-center rounded-md border border-hairline bg-ink-3 text-clay">
          <Icon className="size-4" />
        </span>
        <span>
          <span className="t-serif block text-3xl leading-none text-chalk" dir="ltr">
            {value}
          </span>
          <span className="t-label-ar mt-1 block text-smoke">{label}</span>
        </span>
      </Panel>
    </Link>
  );
}

/**
 * Things that are technically valid but will look broken on the live site.
 *
 * A project row with no video still saves and still renders — as an empty
 * plate the visitor has no way to interpret. Surfacing it here is cheaper
 * than finding it by scrolling the homepage.
 */
function warnings(works: WorkType[]) {
  const out: string[] = [];

  const noVideo = works.filter((w) => !w.video).map((w) => w.title);
  if (noVideo.length) out.push(`بدون فيديو: ${noVideo.join("، ")}`);

  const noImage = works.filter((w) => !w.image).map((w) => w.title);
  if (noImage.length) out.push(`بدون صورة غلاف: ${noImage.join("، ")}`);

  if (!works.some((w) => w.featured)) {
    out.push("لا يوجد عمل رئيسي محدّد — الواجهة تعرض أول عمل بالترتيب");
  }

  const mov = works.filter((w) => w.video?.toLowerCase().endsWith(".mov"));
  if (mov.length) {
    out.push(
      `ملفات .mov قد لا تعمل في المتصفح: ${mov.map((w) => w.title).join("، ")}`
    );
  }

  return out;
}

export default function AdminOverview() {
  const { works, featured, loading: worksLoading } = useWorks();
  const { services, loading: servicesLoading } = useServices();
  const { clients, loading: clientsLoading } = useClients();

  const loading = worksLoading || servicesLoading || clientsLoading;
  const issues = loading ? [] : warnings(works);

  return (
    <>
      <PageHead
        title="نظرة عامة"
        description="حالة محتوى الموقع في لمحة واحدة"
      />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat href="/admin/works" label="عمل" value={works.length} icon={Film} />
            <Stat
              href="/admin/services"
              label="خدمة"
              value={services.length}
              icon={Layers}
            />
            <Stat
              href="/admin/clients"
              label="عميل"
              value={clients.length}
              icon={Users}
            />
          </div>

          <Panel className="p-6">
            <p className="t-label text-smoke">Featured</p>
            {featured ? (
              <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="t-h3 text-chalk">{featured.title}</h2>
                <span className="t-meta text-smoke">
                  {featured.client} · <span dir="ltr">{featured.year}</span>
                </span>
              </div>
            ) : (
              <p className="t-meta mt-3 text-smoke">لا يوجد أعمال بعد.</p>
            )}
          </Panel>

          {issues.length > 0 && (
            <Panel className="border-clay/30 p-6">
              <p className="t-label-ar flex items-center gap-2 text-clay">
                <AlertTriangle className="size-3.5" />
                تحتاج انتباه
              </p>
              <ul className="mt-3 space-y-2">
                {issues.map((issue) => (
                  <li key={issue} className="t-meta text-ash">
                    {issue}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </>
      )}
    </>
  );
}
