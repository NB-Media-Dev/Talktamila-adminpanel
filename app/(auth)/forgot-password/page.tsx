"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const identifier = email.trim();
    if (!identifier) return setError("Please enter your email address.");

    setIsSubmitting(true);
    try {
      await authService.forgotPassword({ identifier });
      // The backend answers the same way whether or not the account exists,
      // so we always continue to the "enter code" step.
      router.push(`/reset-password?identifier=${encodeURIComponent(identifier)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFEAE2] p-4 font-sans">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 sm:p-12 shadow-xl shadow-orange-900/5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="p-1 -ml-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100/80"
            aria-label="Back to login"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-0.5 select-none">
            <span className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">Talk</span>
            <span className="text-base sm:text-lg font-bold text-[#FF6B35] tracking-tight">Tamila</span>
          </div>
          <div className="w-6" />
        </div>

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Forgot password?</h1>
          <p className="mt-1 text-xs text-gray-500">
            Enter the email you signed up with and we&apos;ll send you a 6-digit code.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-2.5 text-center text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            autoComplete="email"
            className="w-full rounded-full bg-[#F3F4F6] px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:bg-[#EAECEF]"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#FA7A22] py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-[#E06412] transition disabled:opacity-60"
          >
            {isSubmitting ? "Sending code..." : "Send code"}
          </button>

          <p className="text-center text-xs text-gray-500">
            Remembered it?{" "}
            <Link href="/login" className="text-[#FA7A22] font-medium hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}