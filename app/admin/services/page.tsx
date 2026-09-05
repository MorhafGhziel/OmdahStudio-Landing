"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
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
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Button } from "@/components/ui/Button";
import { authHeaders, invalidateCollections, useServices } from "@/lib/data";
import type { ServiceType } from "@/lib/types";

export default function ServicesAdmin() {
  const { services, loading, refresh } = useServices();
  const [editing, setEditing] = useState<ServiceType | null>(null);
  const [open, setOpen] = useState(false);

  const reload = () => {
    invalidateCollections();
    return refresh();
  };

  const remove = async (id: string) => {
    await fetch(`/api/services?id=${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await reload();
  };

  const edit = (service: ServiceType | null) => {
    setEditing(service);
    setOpen(true);
  };

  return (
    <>
      <PageHead title="الخدمات" description="ما تقدّمه عُمدة">
        <Button size="sm" onClick={() => edit(null)}>
          <Plus className="ms-2 inline size-3.5" />
          خدمة جديدة
        </Button>
      </PageHead>

      <Panel>
        {loading ? (
          <Loading />
        ) : services.length === 0 ? (
          <EmptyState title="لا يوجد خدمات" description="أضف أول خدمة.">
            <Button size="sm" onClick={() => edit(null)}>
              خدمة جديدة
            </Button>
          </EmptyState>
        ) : (
          <List>
            {services.map((service) => (
              <Row key={service.id}>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-chalk">
                    {service.title}
                  </span>
                  <span className="t-meta mt-0.5 block truncate text-smoke">
                    {service.category} · {service.features.join("، ")}
                  </span>
                </span>

                <IconButton label="تعديل" onClick={() => edit(service)}>
                  <Pencil className="size-4" />
                </IconButton>
                <DeleteButton onConfirm={() => remove(service.id)} />
              </Row>
            ))}
          </List>
        )}
      </Panel>

      <ServiceForm
        open={open}
        service={editing}
        onClose={() => setOpen(false)}
        onSaved={async () => {
          setOpen(false);
          await reload();
        }}
      />
    </>
  );
}
