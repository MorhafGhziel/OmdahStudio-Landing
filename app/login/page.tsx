"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { loginWithCode } = useAdmin();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if code was actually sent (not just a security message)
        if (data.message && data.message.includes("If the email is registered")) {
          // Email not in allowed list - show error
          setError("This email is not authorized to access the admin panel. Please contact the administrator.");
        } else if (data.error) {
          // API returned an error even with 200 status
          setError(data.error || "Failed to send code");
          if (data.details) {
            console.error("Error details:", data.details);
          }
        } else {
          // Code was actually sent
          setSuccessMessage("Verification code sent to your email");
          setStep("code");
        }
      } else {
        // Non-200 status code
        setError(data.error || "Failed to send code");
        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (error) {
      console.error("Send code error:", error);
      setError("Failed to send verification code. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const success = await loginWithCode(email, code);
    
    if (success) {
      router.push("/"); // Redirect to main page after login
    } else {
      setError("Invalid or expired code");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white font-ibm-plex-sans-arabic mb-2">
              Admin Login
            </h1>
            <p className="text-white/60 font-ibm-plex-sans-arabic">
              تسجيل دخول الإدارة
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-300 text-sm">{successMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-ibm-plex-sans-arabic cursor-pointer"
              >
                {loading ? "Sending code..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2 font-ibm-plex-sans-arabic">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-white/50 mt-2 text-center font-ibm-plex-sans-arabic">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all font-ibm-plex-sans-arabic cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="flex-1 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-ibm-plex-sans-arabic cursor-pointer"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
}
