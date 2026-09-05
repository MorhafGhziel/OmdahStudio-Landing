"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AdminButton, Field } from "@/components/admin/Field";
import { Lens } from "@/components/graphics/Lens";
import { Reveal } from "@/components/motion/Reveal";
import { useAdmin } from "@/lib/admin-context";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCode } = useAdmin();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "تعذّر إرسال الرمز");
        return;
      }

      /*
       * The endpoint answers registered and unknown addresses identically, so
       * that it cannot be used to find out who has access. That means the
       * client cannot tell either — and must not pretend to. An earlier
       * version read that neutral reply as a refusal, which told every
       * allowlisted editor their address was not allowed while the code was
       * already in their inbox.
       */
      setNotice("إذا كان البريد مصرّحًا له، وصله رمز الدخول الآن");
      setStep("code");
    } catch {
      setError("تعذّر الاتصال. تحقق من الشبكة وحاول مرة ثانية");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    const ok = await loginWithCode(email, code);
    setBusy(false);

    if (!ok) {
      setError("الرمز غير صحيح أو منتهي");
      return;
    }

    // Read straight off the URL rather than through useSearchParams, which
    // would force this page under a Suspense boundary for a single string.
    // Only same-site paths are honoured, so ?next cannot become an open
    // redirect to another host.
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(next?.startsWith("/") && !next.startsWith("//") ? next : "/admin");
  };

  return (
    <div className="grid min-h-svh grid-cols-12 items-center gutter py-28">
      <Reveal className="col-span-12 lg:col-span-5">
        <p className="t-label text-clay">Admin</p>
        <h1 className="t-h1 mt-4">لوحة التحكم</h1>
        <p className="t-lead mt-4 text-ash">
          {step === "email"
            ? "أدخل بريدك المصرّح له وبنرسل لك رمز دخول."
            : `أدخل الرمز المكوّن من ٦ أرقام المرسل إلى ${email}`}
        </p>

        <form
          onSubmit={step === "email" ? sendCode : verify}
          className="mt-10 space-y-6"
        >
          {step === "email" ? (
            <Field label="Email">
              {({ id, className }) => (
                <input
                  id={id}
                  className={className}
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@omdah.sa"
                  autoComplete="email"
                  required
                />
              )}
            </Field>
          ) : (
            <Field label="Verification code">
              {({ id, className }) => (
                <input
                  id={id}
                  className={`${className} t-serif text-center text-3xl tracking-[0.5em]`}
                  dir="ltr"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  required
                />
              )}
            </Field>
          )}

          {error && <p className="t-meta text-clay">{error}</p>}
          {notice && !error && <p className="t-meta text-ash">{notice}</p>}

          <div className="flex items-center gap-3">
            <AdminButton
              type="submit"
              disabled={busy || (step === "code" && code.length !== 6)}
            >
              {busy
                ? "..."
                : step === "email"
                  ? "أرسل الرمز"
                  : "تأكيد الدخول"}
              <ArrowRight className="ms-2 inline size-3" />
            </AdminButton>

            {step === "code" && (
              <AdminButton
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                }}
              >
                رجوع
              </AdminButton>
            )}
          </div>
        </form>
      </Reveal>

      <div className="col-span-12 mt-16 flex justify-center text-chalk lg:col-span-5 lg:col-start-8 lg:mt-0">
        <div className="w-64 sm:w-80">
          <Lens />
        </div>
      </div>
    </div>
  );
}
