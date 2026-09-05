"use client";

import { useState } from "react";
import { authHeaders } from "@/lib/data";
import type { WorkType } from "@/lib/types";
import { AdminButton, Field } from "./Field";
import { MediaField } from "./MediaField";
import { Modal } from "./Modal";
import { Notice } from "./ui";

interface WorkFormProps {
  open: boolean;
  work: WorkType | null;
  onClose: () => void;
  onSaved: () => void;
}

/** Mounted only while the dialog is open, so props seed the state directly. */
function Body({ work, onClose, onSaved }: Omit<WorkFormProps, "open">) {
  const [form, setForm] = useState(() => ({
    title: work?.title ?? "",
    category: work?.category ?? "",
    client: work?.client ?? "",
    year: work?.year ?? String(new Date().getFullYear()),
    description: work?.description ?? "",
    image: work?.image ?? "",
    video: work?.video ?? "",
    video2: work?.video2 ?? "",
    featured: work?.featured ?? false,
    position: work?.position ?? 0,
  }));
  const [servicesText, setServicesText] = useState(() =>
    (work?.services ?? []).join("\n")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type Form = typeof form;
  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      services: servicesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      image: form.image.trim() || null,
      video: form.video.trim() || null,
      video2: form.video2.trim() || null,
    };

    const res = await fetch("/api/works", {
      method: work ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(work ? { ...payload, id: work.id } : payload),
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="العنوان" required>
          {({ id, className }) => (
            <input
              id={id}
              className={className}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          )}
        </Field>

        <Field label="العميل" required>
          {({ id, className }) => (
            <input
              id={id}
              className={className}
              value={form.client}
              onChange={(e) => set("client", e.target.value)}
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
              onChange={(e) => set("category", e.target.value)}
              required
            />
          )}
        </Field>

        <Field label="السنة" required>
          {({ id, className }) => (
            <input
              id={id}
              className={className}
              value={form.year}
              dir="ltr"
              onChange={(e) => set("year", e.target.value)}
              required
            />
          )}
        </Field>
      </div>

      <Field label="الوصف">
        {({ id, className }) => (
          <textarea
            id={id}
            className={className}
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        )}
      </Field>

      <Field label="الخدمات" hint="خدمة في كل سطر">
        {({ id, className }) => (
          <textarea
            id={id}
            className={className}
            rows={4}
            value={servicesText}
            onChange={(e) => setServicesText(e.target.value)}
          />
        )}
      </Field>

      <MediaField
        label="صورة الغلاف"
        kind="image"
        value={form.image}
        onChange={(v) => set("image", v)}
      />

      <MediaField
        label="الفيديو"
        kind="video"
        value={form.video}
        onChange={(v) => set("video", v)}
        hint="ارفع MP4 بترميز H.264 — المتصفحات لا تفك ترميز HEVC"
      />

      <MediaField
        label="فيديو إضافي"
        kind="video"
        value={form.video2}
        onChange={(v) => set("video2", v)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="الترتيب" hint="الأصغر يظهر أولاً">
          {({ id, className }) => (
            <input
              id={id}
              className={className}
              type="number"
              dir="ltr"
              value={form.position}
              onChange={(e) => set("position", Number(e.target.value) || 0)}
            />
          )}
        </Field>

        <label className="flex cursor-pointer items-center gap-3 sm:mt-7">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="size-4 accent-clay"
          />
          <span className="t-meta text-ash">اعرضه كعمل رئيسي في الواجهة</span>
        </label>
      </div>

      {error && <Notice kind="error">{error}</Notice>}

      <div className="flex justify-end gap-3 pt-2">
        <AdminButton type="button" variant="ghost" onClick={onClose}>
          إلغاء
        </AdminButton>
        <AdminButton type="submit" disabled={saving}>
          {saving ? "..." : work ? "تحديث" : "إضافة"}
        </AdminButton>
      </div>
    </form>
  );
}

export function WorkForm({ open, work, onClose, onSaved }: WorkFormProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={work ? "تعديل العمل" : "عمل جديد"}
    >
      <Body work={work} onClose={onClose} onSaved={onSaved} />
    </Modal>
  );
}
