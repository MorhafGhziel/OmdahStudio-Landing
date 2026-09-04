"use client";

import Image from "next/image";
import { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { authHeaders } from "@/lib/data";
import { imageSrc } from "@/lib/media";
import type { ClientType } from "@/lib/types";
import { uploadImage } from "@/lib/upload";
import { AdminButton, Field } from "./Field";
import { Modal } from "./Modal";

interface ClientManagerProps {
  open: boolean;
  clients: ClientType[];
  onClose: () => void;
  onChanged: () => void;
}

/** Add and remove client logos. The whole roster in one dialog. */
export function ClientManager({
  open,
  clients,
  onClose,
  onChanged,
}: ClientManagerProps) {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name, logo }),
    });

    setBusy(false);

    if (!res.ok) {
      setError("تعذّرت الإضافة");
      return;
    }

    setName("");
    setLogo("");
    onChanged();
  };

  const remove = async (client: ClientType) => {
    if (!window.confirm(`حذف ${client.name}؟`)) return;
    await fetch(`/api/clients?id=${client._id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    onChanged();
  };

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      setLogo(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الرفع");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="إدارة العملاء">
      <form onSubmit={add} className="space-y-5 border-b border-hairline pb-6">
        <Field label="اسم العميل" required>
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

        <Field label="الشعار" required>
          {({ id, className }) => (
            <div className="space-y-2">
              <input
                id={id}
                className={className}
                value={logo}
                dir="ltr"
                placeholder="/images/logo.png"
                onChange={(e) => setLogo(e.target.value)}
                required
              />
              <label className="t-label-ar inline-flex cursor-pointer items-center gap-2 rounded-full border border-hairline px-4 py-2 text-smoke transition-colors hover:border-chalk hover:text-chalk">
                <Upload className="size-3" />
                {busy ? "جارٍ الرفع…" : "رفع شعار"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={pick}
                  disabled={busy}
                  className="sr-only"
                />
              </label>
            </div>
          )}
        </Field>

        {error && <p className="t-meta text-clay">{error}</p>}

        <AdminButton type="submit" disabled={busy || !name || !logo}>
          إضافة
        </AdminButton>
      </form>

      <ul className="mt-6 max-h-80 space-y-2 overflow-y-auto">
        {clients.map((client) => {
          const src = imageSrc(client.logo);
          return (
            <li
              key={client._id}
              className="flex items-center gap-4 rounded-sm border border-hairline bg-ink-3 px-3 py-2"
            >
              {src && (
                <Image
                  src={src}
                  alt=""
                  width={64}
                  height={32}
                  className="h-8 w-16 object-contain [filter:brightness(0)_invert(1)]"
                />
              )}
              <span className="t-meta flex-1 text-ash">{client.name}</span>
              <button
                type="button"
                onClick={() => remove(client)}
                aria-label={`حذف ${client.name}`}
                className="grid size-8 place-items-center rounded-full text-smoke transition-colors hover:bg-clay/10 hover:text-clay"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
