"use client";

import { Pencil, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ClientForm } from "@/components/admin/ClientForm";
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
import { Button } from "@/components/ui/Button";
import { authHeaders, invalidateCollections, useClients } from "@/lib/data";
import type { ClientType } from "@/lib/types";

export default function ClientsAdmin() {
  const { clients, loading, refresh } = useClients();
  const [editing, setEditing] = useState<ClientType | null>(null);
  const [open, setOpen] = useState(false);

  const reload = () => {
    invalidateCollections();
    return refresh();
  };

  const remove = async (id: string) => {
    await fetch(`/api/clients?id=${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await reload();
  };

  const edit = (client: ClientType | null) => {
    setEditing(client);
    setOpen(true);
  };

  return (
    <>
      <PageHead title="العملاء" description="الشعارات في شريط العملاء">
        <Button size="sm" onClick={() => edit(null)}>
          <Plus className="ms-2 inline size-3.5" />
          عميل جديد
        </Button>
      </PageHead>

      <Panel>
        {loading ? (
          <Loading />
        ) : clients.length === 0 ? (
          <EmptyState title="لا يوجد عملاء" description="أضف أول شعار.">
            <Button size="sm" onClick={() => edit(null)}>
              عميل جديد
            </Button>
          </EmptyState>
        ) : (
          <List>
            {clients.map((client) => (
              <Row key={client.id}>
                {/* Logos arrive transparent and half of them are already
                    white, so they are shown on the same dark plate the site
                    uses rather than on the panel. */}
                <span className="relative h-12 w-20 shrink-0 rounded-sm border border-hairline bg-ink-3">
                  <Image
                    src={client.logo}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-2 [filter:brightness(0)_invert(1)]"
                  />
                </span>

                <span className="min-w-0 flex-1 truncate font-medium text-chalk">
                  {client.name}
                </span>

                <IconButton label="تعديل" onClick={() => edit(client)}>
                  <Pencil className="size-4" />
                </IconButton>
                <DeleteButton onConfirm={() => remove(client.id)} />
              </Row>
            ))}
          </List>
        )}
      </Panel>

      <ClientForm
        open={open}
        client={editing}
        onClose={() => setOpen(false)}
        onSaved={async () => {
          setOpen(false);
          await reload();
        }}
      />
    </>
  );
}
