"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth.service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") ?? "";

  // The code was already verified on the forgot-password page.
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read the verified code saved by the forgot-password page.
  useEffect(() => {
    setOtp(sessionStorage.getItem("reset_otp") ?? "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier) return setError("Missing email. Please start again from 'Forgot password'.");
    if (!/^\d{6}$/.test(otp)) return setError("Your code is missing. Please start again from 'Forgot password'.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    setIsSubmitting(true);
    try {
      await authService.resetPassword({ identifier, otp, new_password: newPassword });
      sessionStorage.removeItem("reset_otp");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset the password. Please try again.");
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-full bg-[#F3F4F6] px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:bg-[#EAECEF]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFEAE2] p-4 font-sans">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 sm:p-12 shadow-xl shadow-orange-900/5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="p-1 -ml-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100/80"
            aria-label="Back"
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reset password</h1>
          <p className="mt-1 text-xs text-gray-500">
            {identifier ? (
              <>
                Code verified for <span className="font-medium text-gray-700">{identifier}</span>. Choose a new password.
              </>
            ) : (
              <>
                Start from <Link href="/forgot-password" className="text-[#FA7A22] hover:underline">Forgot password</Link> to get a code.
              </>
            )}
          </p>
        </div>

        {success && (
          <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-center text-xs text-emerald-700 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password updated! Redirecting to login...</span>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-2.5 text-center text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError("");
              }}
              autoComplete="new-password"
              className={`${inputClass} pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            autoComplete="new-password"
            className={inputClass}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full rounded-full bg-[#FA7A22] py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-[#E06412] transition disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Reset password"}
          </button>

          <p className="text-center text-xs text-gray-500">
            Need a new code?{" "}
            <Link href="/forgot-password" className="text-[#FA7A22] font-medium hover:underline">
              Start again
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  // useSearchParams() must sit under a Suspense boundary for static prerendering.
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}