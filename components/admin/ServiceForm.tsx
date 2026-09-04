"use client";

import { useState } from "react";
import { authHeaders } from "@/lib/data";
import type { ServiceType } from "@/lib/types";
import { AdminButton, Field } from "./Field";
import { Modal } from "./Modal";

interface ServiceFormProps {
  open: boolean;
  service: ServiceType | null;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * The body mounts only while the dialog is open, so its initial state comes
 * straight from props — no effect syncing props into state on every open.
 */
function Body({
  service,
  onClose,
  onSaved,
}: Omit<ServiceFormProps, "open">) {
  const [form, setForm] = useState(() => ({
    title: service?.title ?? "",
    category: service?.category ?? "",
    description: service?.description ?? "",
    features: service?.features.join("، ") ?? "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Accept either comma — the Arabic one is what an Arabic keyboard makes.
    const features = form.features
      .split(/[,،]/)
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = { ...form, features };

    const res = await fetch("/api/services", {
      method: service ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(service ? { id: service.id, ...payload } : payload),
    });

    setSaving(false);

    if (res.ok) {
      onSaved();
      return;
    }

    const body = await res.json().catch(() => null);
    setError(
      body?.details?.map((d: { message: string }) => d.message).join(" · ") ??
        body?.error ??
        "تعذّر الحفظ"
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="العنوان" required>
        {({ id, className }) => (
          <input
            id={id}
            className={className}
            value={form.title}
            onChange={(e) => set("title")(e.target.value)}
            required
          />
        )}
      </Field>

      <Field label="الفئة" required>
        {({ id, className }) => (
          <input
            id={id}
            className={className}
            value={form.category}
            onChange={(e) => set("category")(e.target.value)}
            required
          />
        )}
      </Field>

      <Field
        label="الوصف"
        required
        hint={`${form.description.length} حرف — الحد الأدنى ١٠`}
      >
        {({ id, className }) => (
          <textarea
            id={id}
            className={className}
            rows={4}
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
            minLength={10}
            required
          />
        )}
      </Field>

      <Field label="المميزات" required hint="افصل بينها بفاصلة">
        {({ id, className }) => (
          <input
            id={id}
            className={className}
            value={form.features}
            onChange={(e) => set("features")(e.target.value)}
            placeholder="ميزة، ميزة، ميزة"
            required
          />
        )}
      </Field>

      {error && <p className="t-meta text-clay">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <AdminButton type="button" variant="ghost" onClick={onClose}>
          إلغاء
        </AdminButton>
        <AdminButton type="submit" disabled={saving}>
          {saving ? "..." : service ? "تحديث" : "إضافة"}
        </AdminButton>
      </div>
    </form>
  );
}

export function ServiceForm({
  open,
  service,
  onClose,
  onSaved,
}: ServiceFormProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={service ? "تعديل الخدمة" : "خدمة جديدة"}
    >
      <Body service={service} onClose={onClose} onSaved={onSaved} />
    </Modal>
  );
}
