"use client";

import { Pencil, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  DeleteButton,
  EmptyState,
  IconButton,
  List,
  Loading,
  PageHead,
  Panel,
  Row,
} from "@/components/admin/ui";
import { WorkForm } from "@/components/admin/WorkForm";
import { authHeaders, invalidateCollections } from "@/lib/data";
import { useWorks } from "@/lib/data";
import type { WorkType } from "@/lib/types";

export default function WorksAdmin() {
  const { works, loading, refresh } = useWorks();
  const [editing, setEditing] = useState<WorkType | null>(null);
  const [open, setOpen] = useState(false);

  const reload = () => {
    invalidateCollections();
    return refresh();
  };

  const remove = async (id: string) => {
    await fetch(`/api/works?id=${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await reload();
  };

  const edit = (work: WorkType | null) => {
    setEditing(work);
    setOpen(true);
  };

  return (
    <>
      <PageHead title="الأعمال" description="المشاريع المعروضة في الموقع">
        <Button size="sm" onClick={() => edit(null)}>
          <Plus className="ms-2 inline size-3.5" />
          عمل جديد
        </Button>
      </PageHead>

      <Panel>
        {loading ? (
          <Loading />
        ) : works.length === 0 ? (
          <EmptyState
            title="لا يوجد أعمال"
            description="أضف أول مشروع ليظهر في الواجهة."
          >
            <Button size="sm" onClick={() => edit(null)}>
              عمل جديد
            </Button>
          </EmptyState>
        ) : (
          <List>
            {works.map((work) => (
              <Row key={work.id}>
                <span className="relative hidden h-12 w-20 shrink-0 overflow-hidden rounded-sm border border-hairline bg-ink-3 sm:block">
                  {work.image && (
                    <Image
                      src={work.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium text-chalk">
                      {work.title}
                    </span>
                    {work.featured && (
                      <Star
                        className="size-3.5 shrink-0 fill-clay text-clay"
                        aria-label="العمل الرئيسي"
                      />
                    )}
                  </span>
                  <span className="t-meta mt-0.5 block truncate text-smoke">
                    {work.client} · {work.category} ·{" "}
                    <span dir="ltr">{work.year}</span>
                    {!work.video && " · بدون فيديو"}
                  </span>
                </span>

                <IconButton label="تعديل" onClick={() => edit(work)}>
                  <Pencil className="size-4" />
                </IconButton>
                <DeleteButton onConfirm={() => remove(work.id)} />
              </Row>
            ))}
          </List>
        )}
      </Panel>

      <WorkForm
        open={open}
        work={editing}
        onClose={() => setOpen(false)}
        onSaved={async () => {
          setOpen(false);
          await reload();
        }}
      />
    </>
  );
}
