"use client";

import { useState } from "react";
import { Check, Upload } from "lucide-react";
import { authHeaders } from "@/lib/data";
import type { WorkType } from "@/lib/types";
import { uploadImage, uploadVideo } from "@/lib/upload";
import { AdminButton, Field } from "./Field";
import { Modal } from "./Modal";

interface WorkFormProps {
  open: boolean;
  work: WorkType | null;
  onClose: () => void;
  onSaved: () => void;
}

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

/** File picker that uploads on selection and reports the resulting URL. */
function AssetInput({
  label,
  value,
  accept,
  maxBytes,
  onUpload,
  onChange,
}: {
  label: string;
  value: string;
  accept: string;
  maxBytes?: number;
  onUpload: (file: File) => Promise<string>;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (maxBytes && file.size > maxBytes) {
      setError(`الحد الأقصى ${Math.round(maxBytes / 1024 / 1024)} ميجابايت`);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      onChange(await onUpload(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الرفع");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field label={label} hint={error ?? undefined}>
      {({ id, className }) => (
        <div className="space-y-2">
          <input
            id={id}
            className={className}
            value={value}
            dir="ltr"
            placeholder="https://…"
            onChange={(e) => onChange(e.target.value)}
          />
          <label className="t-label-ar inline-flex cursor-pointer items-center gap-2 rounded-full border border-hairline px-4 py-2 text-smoke transition-colors hover:border-chalk hover:text-chalk">
            {busy ? (
              "جارٍ الرفع…"
            ) : value ? (
              <>
                <Check className="size-3 text-clay" /> استبدال الملف
              </>
            ) : (
              <>
                <Upload className="size-3" /> رفع ملف
              </>
            )}
            <input
              type="file"
              accept={accept}
              onChange={handle}
              disabled={busy}
              className="sr-only"
            />
          </label>
        </div>
      )}
    </Field>
  );
}

/** Mounted only while the dialog is open, so props seed the state directly. */
function Body({ work, onClose, onSaved }: Omit<WorkFormProps, "open">) {
  const [form, setForm] = useState<WorkType>(() => ({
    title: work?.title ?? "",
    category: work?.category ?? "",
    client: work?.client ?? "",
    year: work?.year ?? String(new Date().getFullYear()),
    description: work?.description ?? "",
    image: work?.image ?? "",
    video: work?.video ?? "",
    video2: work?.video2 ?? "",
    featured: work?.featured ?? false,
  }));
  const [servicesText, setServicesText] = useState(() =>
    (work?.services ?? []).join("\n")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof WorkType>(key: K, value: WorkType[K]) =>
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
      image: form.image?.trim() || undefined,
      video: form.video?.trim() || undefined,
      video2: form.video2?.trim() || undefined,
    };

    const res = await fetch("/api/works", {
      method: work ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(work ? { ...payload, _id: work._id } : payload),
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
              onChange={(e) => set("year", e.target.value)}
              required
            />
          )}
        </Field>
      </div>

      <Field label="الوصف" required>
        {({ id, className }) => (
          <textarea
            id={id}
            className={className}
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
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

      <AssetInput
        label="صورة الغلاف"
        value={form.image ?? ""}
        accept="image/*"
        onUpload={uploadImage}
        onChange={(url) => set("image", url)}
      />

      <AssetInput
        label="الفيديو"
        value={form.video ?? ""}
        accept="video/*"
        maxBytes={MAX_VIDEO_BYTES}
        onUpload={uploadVideo}
        onChange={(url) => set("video", url)}
      />

      <AssetInput
        label="فيديو إضافي"
        value={form.video2 ?? ""}
        accept="video/*"
        maxBytes={MAX_VIDEO_BYTES}
        onUpload={uploadVideo}
        onChange={(url) => set("video2", url)}
      />

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={Boolean(form.featured)}
          onChange={(e) => set("featured", e.target.checked)}
          className="size-4 accent-clay"
        />
        <span className="t-meta text-ash">
          اعرضه كعمل رئيسي في الواجهة
        </span>
      </label>

      {error && <p className="t-meta text-clay">{error}</p>}

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
