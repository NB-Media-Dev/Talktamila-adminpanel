"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { goBack } from "@/lib/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { authService } from "@/services/auth.service";

const RESEND_SECONDS = 30;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = async () => {
    setError("");
    setInfo("");

    const identifier = email.trim();
    if (!identifier) return setError("Please enter your email address.");

    setIsSubmitting(true);
    try {
      await authService.forgotPassword({ identifier });
      setCodeSent(true);
      setOtp("");
      setCooldown(RESEND_SECONDS);
      setInfo(`We sent a 6-digit code to ${identifier}. It expires in 10 minutes.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async () => {
    setError("");
    setInfo("");

    const identifier = email.trim();
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit code from your email.");

    setIsSubmitting(true);
    try {
      await authService.verifyOtp({ identifier, otp });
      // The reset endpoint needs the code again, so keep it out of the URL.
      sessionStorage.setItem("reset_otp", otp);
      router.push(`/reset-password?identifier=${encodeURIComponent(identifier)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code didn't work. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    return codeSent ? verifyCode() : sendCode();
  };

  const inputClass =
    "w-full rounded-full bg-[#F3F4F6] px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:bg-[#EAECEF]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFEAE2] p-4 font-sans">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 sm:p-12 shadow-xl shadow-orange-900/5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => goBack(router, "/login")}
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
            {codeSent
              ? "Enter the code we emailed you to continue."
              : "Enter the email you signed up with and we'll send you a 6-digit code."}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-2.5 text-center text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {info && !error && (
          <div className="mt-4 rounded-xl bg-emerald-50 p-2.5 text-center text-xs text-emerald-700 border border-emerald-100">
            {info}
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
            disabled={codeSent}
            className={`${inputClass} disabled:opacity-70`}
            required
          />

          {codeSent && (
            <>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  if (error) setError("");
                }}
                className={`${inputClass} tracking-[0.4em] text-center`}
                autoFocus
                required
              />

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setOtp("");
                    setInfo("");
                  }}
                  className="text-gray-500 hover:underline"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={cooldown > 0 || isSubmitting}
                  className="text-[#FA7A22] font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#FA7A22] py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-[#E06412] transition disabled:opacity-60"
          >
            {codeSent
              ? isSubmitting ? "Verifying..." : "Verify code"
              : isSubmitting ? "Sending code..." : "Send code"}
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