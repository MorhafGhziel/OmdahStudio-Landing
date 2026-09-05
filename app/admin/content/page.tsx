"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Field } from "@/components/admin/Field";
import { Loading, Notice, PageHead, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import {
  useContent,
  type SectionName,
  type SiteContent,
} from "@/lib/content";

/**
 * The shape of the copy, described once.
 *
 * Every field on the site used to be edited in place, which meant the editor
 * had to hunt down a sentence by scrolling to wherever it happened to render.
 * Listing them here makes the whole voice of the site readable in one screen.
 */
type FieldSpec = { key: string; label: string; multiline?: boolean; ltr?: boolean };

const SECTIONS: { name: SectionName; title: string; fields: FieldSpec[] }[] = [
  {
    name: "hero",
    title: "الواجهة",
    fields: [
      { key: "title", label: "العنوان" },
      { key: "subtitle", label: "العنوان الفرعي" },
      { key: "description", label: "الوصف", multiline: true },
      { key: "ctaText", label: "نص الزر" },
      { key: "storyTitle", label: "عنوان القصة" },
    ],
  },
  {
    name: "services",
    title: "الخدمات",
    fields: [
      { key: "badge", label: "التسمية" },
      { key: "title", label: "العنوان" },
      { key: "description", label: "الوصف", multiline: true },
      { key: "ctaText", label: "نص الزر" },
    ],
  },
  {
    name: "clients",
    title: "العملاء",
    fields: [
      { key: "title", label: "العنوان" },
      { key: "description", label: "الوصف", multiline: true },
    ],
  },
  {
    name: "footer",
    title: "التذييل والتواصل",
    fields: [
      { key: "tagline", label: "الشعار" },
      { key: "contactHeading", label: "عنوان التواصل" },
      { key: "whatsappUrl", label: "رابط واتساب", ltr: true },
      { key: "instagramUrl", label: "رابط إنستقرام", ltr: true },
      { key: "email", label: "البريد", ltr: true },
    ],
  },
];

function SectionEditor({
  spec,
  initial,
  onSave,
}: {
  spec: (typeof SECTIONS)[number];
  initial: Record<string, string>;
  onSave: (data: Record<string, string>) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);

  const dirty = spec.fields.some((f) => draft[f.key] !== initial[f.key]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFailed(false);

    const ok = await onSave(draft);

    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setFailed(true);
    }
  };

  return (
    <Panel className="p-6">
      <form onSubmit={submit} className="space-y-5">
        <h2 className="t-h3 text-chalk">{spec.title}</h2>

        {spec.fields.map((field) => (
          <Field key={field.key} label={field.label}>
            {({ id, className }) =>
              field.multiline ? (
                <textarea
                  id={id}
                  className={className}
                  rows={3}
                  value={draft[field.key] ?? ""}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, [field.key]: e.target.value }))
                  }
                />
              ) : (
                <input
                  id={id}
                  className={className}
                  dir={field.ltr ? "ltr" : undefined}
                  value={draft[field.key] ?? ""}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, [field.key]: e.target.value }))
                  }
                />
              )
            }
          </Field>
        ))}

        <div className="flex items-center justify-end gap-4">
          {failed && <Notice kind="error">تعذّر الحفظ</Notice>}
          {saved && (
            <span className="t-meta flex items-center gap-1.5 text-clay">
              <Check className="size-3.5" /> تم الحفظ
            </span>
          )}
          <Button type="submit" size="sm" disabled={!dirty || saving}>
            {saving ? "..." : "حفظ"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}

export default function ContentAdmin() {
  const { content, loading, save } = useContent();

  return (
    <>
      <PageHead title="النصوص" description="كل ما يُقرأ على الموقع" />

      {loading ? (
        <Loading />
      ) : (
        // Only rendered once the fetch has settled, so each editor seeds its
        // draft from the real copy at mount and never has to sync props into
        // state afterwards.
        SECTIONS.map((spec) => (
          <SectionEditor
            key={spec.name}
            spec={spec}
            initial={content[spec.name] as unknown as Record<string, string>}
            onSave={(data) =>
              save(spec.name, data as unknown as SiteContent[SectionName])
            }
          />
        ))
      )}
    </>
  );
}
