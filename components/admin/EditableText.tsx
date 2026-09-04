"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { cn } from "@/lib/utils";

type Save = (next: string) => Promise<boolean>;

/** Edit state shared by the inline and detached editors. */
function useInlineEdit(value: string, onSave: Save) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const begin = () => {
    setDraft(value);
    setEditing(true);
  };

  const commit = async () => {
    setSaving(true);
    const ok = await onSave(draft.trim());
    setSaving(false);
    if (ok) setEditing(false);
    else window.alert("تعذّر حفظ التعديل");
  };

  return {
    editing,
    setEditing,
    draft,
    setDraft,
    saving,
    inputRef,
    begin,
    commit,
  };
}

function SaveBar({
  onCommit,
  onCancel,
  saving,
}: {
  onCommit: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <span className="absolute -bottom-11 end-0 z-30 flex gap-1.5">
      <button
        type="button"
        onClick={onCommit}
        disabled={saving}
        className="t-label-ar flex items-center gap-1.5 rounded-full bg-clay px-3 py-1.5 text-ink disabled:opacity-50"
      >
        <Check className="size-3" />
        {saving ? "..." : "حفظ"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        aria-label="إلغاء"
        className="t-label-ar flex items-center gap-1.5 rounded-full bg-chalk px-3 py-1.5 text-ink"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

const pencilStyles =
  "grid size-7 place-items-center rounded-full border border-clay/40 bg-ink-3 text-clay";

interface EditableTextProps {
  value: string;
  onSave: Save;
  /** Rendered element when not editing. */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  multiline?: boolean;
  /** Shown instead of the raw value — e.g. a headline split into words. */
  children?: React.ReactNode;
}

/**
 * Click-to-edit copy.
 *
 * Five sections used to carry their own copy of this — edit state, temp value,
 * save handler, and a row of coloured buttons baked into the markup, which is
 * why admin controls used to shift the layout of the live page. Here the
 * affordance is an overlay: signed-out visitors get clean markup, and signed-in
 * editors get a control that costs the design nothing.
 */
export function EditableText({
  value,
  onSave,
  as: Tag = "span",
  className,
  multiline = false,
  children,
}: EditableTextProps) {
  const { isAdmin } = useAdmin();
  // Destructured rather than kept as one object: the lint rule that tracks
  // ref access cannot see through a bag that also carries inputRef.
  const { editing, setEditing, draft, setDraft, saving, inputRef, begin, commit } =
    useInlineEdit(value, onSave);

  if (!isAdmin) {
    return <Tag className={className}>{children ?? value}</Tag>;
  }

  if (editing) {
    const shared = {
      ref: inputRef as never,
      value: draft,
      dir: "rtl" as const,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") setEditing(false);
        if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          void commit();
        }
      },
      className: cn(
        className,
        "w-full resize-none rounded-sm border border-clay/40 bg-clay/5 px-3 py-2 outline-none"
      ),
    };

    return (
      <span className="relative block">
        {multiline ? (
          <textarea {...shared} rows={3} />
        ) : (
          <input {...shared} type="text" />
        )}
        <SaveBar
          onCommit={commit}
          onCancel={() => setEditing(false)}
          saving={saving}
        />
      </span>
    );
  }

  return (
    <Tag className={cn(className, "group/edit relative")}>
      {children ?? value}
      <button
        type="button"
        onClick={begin}
        aria-label="تعديل النص"
        className={cn(
          pencilStyles,
          "absolute -top-2 -end-9 z-30 opacity-0 transition-opacity duration-200 group-hover/edit:opacity-100"
        )}
      >
        <Pencil className="size-3" />
      </button>
    </Tag>
  );
}

/**
 * The same editor, detached from the text it edits.
 *
 * For copy that lives inside an interactive element — the label on a CTA
 * button — the overlay form is not an option: a <button> inside a <button> is
 * invalid HTML and React refuses to hydrate it. The caller renders the value
 * itself and drops this alongside.
 */
export function EditControl({
  value,
  onSave,
  label = "تعديل النص",
}: {
  value: string;
  onSave: Save;
  label?: string;
}) {
  const { isAdmin } = useAdmin();
  const { editing, setEditing, draft, setDraft, saving, inputRef, begin, commit } =
    useInlineEdit(value, onSave);

  if (!isAdmin) return null;

  if (editing) {
    return (
      <span className="relative inline-block">
        <input
          ref={inputRef as never}
          type="text"
          dir="rtl"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setEditing(false);
            if (e.key === "Enter") {
              e.preventDefault();
              void commit();
            }
          }}
          className="w-48 rounded-sm border border-clay/40 bg-clay/5 px-3 py-2 outline-none"
        />
        <SaveBar
          onCommit={commit}
          onCancel={() => setEditing(false)}
          saving={saving}
        />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={begin}
      aria-label={label}
      className={pencilStyles}
    >
      <Pencil className="size-3" />
    </button>
  );
}
