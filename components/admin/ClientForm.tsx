"use client";

import { useState } from "react";
import { authHeaders } from "@/lib/data";
import type { ClientType } from "@/lib/types";
import { AdminButton, Field } from "./Field";
import { MediaField } from "./MediaField";
import { Modal } from "./Modal";
import { Notice } from "./ui";

interface ClientFormProps {
  open: boolean;
  client: ClientType | null;
  onClose: () => void;
  onSaved: () => void;
}

function Body({ client, onClose, onSaved }: Omit<ClientFormProps, "open">) {
  const [name, setName] = useState(client?.name ?? "");
  const [logo, setLogo] = useState(client?.logo ?? "");
  const [position, setPosition] = useState(client?.position ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { name: name.trim(), logo: logo.trim(), position };

    const res = await fetch("/api/clients", {
      method: client ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(client ? { ...payload, id: client.id } : payload),
    });

    setSaving(false);

    if (res.ok) {
      onSaved();
      return;
    }

    const body = await res.json().catch(() => null);
    setError(body?.error ?? "تعذّر الحفظ");
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="الاسم" required>
        {({ id, className }) => (
          <input
            id={id}
            className={className}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
      </Field>

      <MediaField
        label="الشعار"
        kind="image"
        value={logo}
        onChange={setLogo}
        hint="PNG بخلفية شفافة — الشعارات تُعرض بالأبيض"
      />

      <Field label="الترتيب" hint="الأصغر يظهر أولاً">
        {({ id, className }) => (
          <input
            id={id}
            className={className}
            type="number"
            dir="ltr"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value) || 0)}
          />
        )}
      </Field>

      {error && <Notice kind="error">{error}</Notice>}

      <div className="flex justify-end gap-3 pt-2">
        <AdminButton type="button" variant="ghost" onClick={onClose}>
          إلغاء
        </AdminButton>
        <AdminButton
          type="submit"
          disabled={saving || !name.trim() || !logo.trim()}
        >
          {saving ? "..." : client ? "تحديث" : "إضافة"}
        </AdminButton>
      </div>
    </form>
  );
}

export function ClientForm({ open, client, onClose, onSaved }: ClientFormProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={client ? "تعديل العميل" : "عميل جديد"}
    >
      <Body client={client} onClose={onClose} onSaved={onSaved} />
    </Modal>
  );
}
