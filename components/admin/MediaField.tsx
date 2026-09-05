"use client";

import { Check, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { videoSources } from "@/lib/media";
import { uploadImage, uploadVideo } from "@/lib/upload";
import { Field } from "./Field";

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

/**
 * Upload-or-paste control for a single asset.
 *
 * The text input stays editable on purpose: rows can point at a file that was
 * put in the bucket by other means, and being able to read and correct that
 * value is the difference between fixing a broken reel and re-uploading it.
 */
export function MediaField({
  label,
  kind,
  value,
  onChange,
  hint,
}: {
  label: string;
  kind: "image" | "video";
  value: string;
  onChange: (next: string) => void;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (kind === "video" && file.size > MAX_VIDEO_BYTES) {
      setError("الحد الأقصى ٥٠٠ ميجابايت");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      onChange(await (kind === "video" ? uploadVideo : uploadImage)(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الرفع");
    } finally {
      setBusy(false);
    }
  };

  const preview = value.trim();
  const videoUrl = kind === "video" ? videoSources(preview)[0]?.src : null;

  return (
    <Field label={label} hint={error ?? hint}>
      {({ id, className }) => (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              id={id}
              className={className}
              value={value}
              dir="ltr"
              placeholder={kind === "video" ? "reel.mp4" : "https://…"}
              onChange={(e) => onChange(e.target.value)}
            />
            {preview && (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="إزالة"
                className="grid size-11 shrink-0 place-items-center rounded-sm border border-hairline text-smoke transition-colors hover:border-clay/50 hover:text-clay"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="t-label-ar inline-flex cursor-pointer items-center gap-2 rounded-md border border-hairline px-4 py-2 text-smoke transition-colors hover:border-chalk/30 hover:text-chalk">
              {busy ? (
                <>
                  <Loader2 className="size-3 animate-spin" /> جارٍ الرفع…
                </>
              ) : preview ? (
                <>
                  <Check className="size-3 text-clay" /> استبدال
                </>
              ) : (
                <>
                  <Upload className="size-3" /> رفع ملف
                </>
              )}
              <input
                type="file"
                accept={kind === "video" ? "video/*" : "image/*"}
                onChange={handle}
                disabled={busy}
                className="sr-only"
              />
            </label>

            {preview && kind === "image" && (
              <span className="relative h-11 w-20 overflow-hidden rounded-sm border border-hairline bg-ink-3">
                <Image
                  src={preview}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </span>
            )}

            {videoUrl && (
              // Metadata only: an admin list should not pull megabytes of
              // reel just to prove the file resolves.
              <video
                src={videoUrl}
                muted
                playsInline
                preload="metadata"
                className="h-11 w-20 rounded-sm border border-hairline bg-ink-3 object-cover"
              />
            )}
          </div>
        </div>
      )}
    </Field>
  );
}
