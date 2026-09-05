"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Field } from "@/components/admin/Field";
import {
  DeleteButton,
  List,
  Loading,
  Notice,
  PageHead,
  Panel,
  Row,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { authHeaders } from "@/lib/data";
import type { AllowedEmail } from "@/lib/types";

export default function AccessAdmin() {
  const [emails, setEmails] = useState<AllowedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Bumped after a write to re-run the fetch below. */
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/allowed-emails", { headers: authHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        setEmails(Array.isArray(json?.emails) ? json.emails : []);
        setLoading(false);
      })
      .catch(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [revision]);

  const reload = () => setRevision((n) => n + 1);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/auth/allowed-emails", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email: value.trim() }),
    });

    setBusy(false);

    if (res.ok) {
      setValue("");
      reload();
      return;
    }

    const body = await res.json().catch(() => null);
    setError(body?.error ?? "تعذّر الإضافة");
  };

  const remove = async (email: string) => {
    const res = await fetch(
      `/api/auth/allowed-emails?email=${encodeURIComponent(email)}`,
      { method: "DELETE", headers: authHeaders() }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "تعذّر الحذف");
      return;
    }

    setError(null);
    reload();
  };

  return (
    <>
      <PageHead
        title="الصلاحيات"
        description="العناوين التي يمكنها الدخول إلى لوحة التحكم"
      />

      <Panel className="p-6">
        <form onSubmit={add} className="flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <Field label="بريد جديد">
              {({ id, className }) => (
                <input
                  id={id}
                  className={className}
                  type="email"
                  dir="ltr"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="name@omdah.sa"
                  required
                />
              )}
            </Field>
          </div>
          <Button type="submit" size="sm" disabled={busy || !value.trim()}>
            <Plus className="ms-2 inline size-3.5" />
            إضافة
          </Button>
        </form>
        {error && (
          <div className="mt-3">
            <Notice kind="error">{error}</Notice>
          </div>
        )}
      </Panel>

      <Panel>
        {loading ? (
          <Loading />
        ) : (
          <List>
            {emails.map((row) => (
              <Row key={row.email}>
                <span className="min-w-0 flex-1 truncate text-chalk" dir="ltr">
                  {row.email}
                </span>
                {/* The API refuses to remove the last address; the button
                    stays enabled so the reason is stated rather than mimed. */}
                <DeleteButton onConfirm={() => remove(row.email)} />
              </Row>
            ))}
          </List>
        )}
      </Panel>
    </>
  );
}
