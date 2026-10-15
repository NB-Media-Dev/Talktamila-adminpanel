"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { goBack as historyBack } from "@/lib/navigation";
import {
  X,
  Camera,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  Pencil,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  KeyRound,
} from "lucide-react";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { useAuthuser } from "@/hooks/useAuthuser";
import AvatarEditor from "@/components/profile/AvatarEditor";
import type { ProfileData } from "@/types/Auth";

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PICKED_FILE_BYTES = 8 * 1024 * 1024; // the photo editor shrinks it before upload
const NAME_MAX = 100;
const BIO_MAX = 300;
const LOCATION_MAX = 100;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MOBILE_RE = /^\+?[0-9\s-]{7,20}$/;
const PASSWORD_MIN = 6;
const USERNAME_RE = /^[A-Za-z0-9_.]{3,30}$/;
const OTP_RESEND_SECONDS = 30;

const fieldClass =
  "w-full rounded-xl border border-[#EFE6DC] bg-[#FAF6F0]/60 px-3.5 py-2.5 text-xs font-semibold outline-none transition focus:border-[#FF5E13] focus:bg-white disabled:opacity-60";
const labelClass = "mb-1.5 block text-xs font-bold text-[#766960]";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}

export default function EditProfile() {
  const router = useRouter();
  const { user, setUser } = useAuthuser();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);

  // Change-password fields are kept separate: they hit their own endpoint
  // and shouldn't be blocked by (or block) the profile-fields save.
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fillForm = (data: ProfileData) => {
    setFirstName(data.first_name || "");
    setUsername(data.username || "");
    setLastName(data.last_name || "");
    setBio(data.bio || "");
    setLocation(data.location || "");
    setEmail(data.email || "");
    setMobileNo(data.mobile_no || "");
    setAvatarFile(null);
    setAvatarPreview(data.avatar_url);
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await userService.getProfile();
        setProfile(data);
        fillForm(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Resend cooldown ticker for the password-change code.
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setTimeout(() => setOtpCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCooldown]);

  const syncAuthUser = (updated: ProfileData) => {
    if (!user) return;
    const patch = {
      username: updated.username,
      first_name: updated.first_name,
      last_name: updated.last_name,
      full_name: updated.full_name,
      avatar_url: updated.avatar_url,
    };
    const current = user as any;
    setUser(
      current.user
        ? { ...current, user: { ...current.user, ...patch } }
        : { ...current, ...patch }
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the same file be picked again later
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > MAX_PICKED_FILE_BYTES) {
      setError("That image is too large. Please choose one under 8 MB.");
      return;
    }

    setError(null);
    setPendingAvatar(file); // opens the photo editor
  };

  // The editor hands back the finished, cropped square photo.
  const handleAvatarEdited = async (edited: File) => {
    try {
      setAvatarFile(edited);
      setAvatarPreview(await readAsDataUrl(edited));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process that image.");
    } finally {
      setPendingAvatar(null);
    }
  };

  const handleSendOtp = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsSendingOtp(true);
    try {
      const res = await authService.requestChangePasswordOtp();
      setOtpSent(true);
      setOtp("");
      setOtpCooldown(OTP_RESEND_SECONDS);
      setPasswordSuccess(res.message || "We sent a 6-digit code to your registered email.");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Could not send the code. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword) return setPasswordError("Enter your current password.");
    if (newPassword.length < PASSWORD_MIN)
      return setPasswordError(`New password must be at least ${PASSWORD_MIN} characters.`);
    if (newPassword !== confirmPassword)
      return setPasswordError("New password and confirmation don't match.");
    if (newPassword === oldPassword)
      return setPasswordError("New password must be different from the current one.");
    if (!/^\d{6}$/.test(otp))
      return setPasswordError("Enter the 6-digit code we emailed you. Use \"Send code\" to get one.");

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        otp,
      });
      setPasswordSuccess("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setOtpSent(false);
      setOtpCooldown(0);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const goBackToProfile = () => {
    historyBack(router, profile ? `/${profile.role}/profile` : "/");
  };

  const handleSave = async () => {
    setError(null);

    const first = firstName.trim();
    const last = lastName.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedMobile = mobileNo.trim();

    if (!first) return setError("First name is required.");
    if (!USERNAME_RE.test(trimmedUsername))
      return setError("Username must be 3-30 characters: letters, numbers, dots and underscores only.");
    if (first.length > NAME_MAX || last.length > NAME_MAX)
      return setError(`Names must be ${NAME_MAX} characters or less.`);
    if (bio.length > BIO_MAX) return setError(`Bio must be ${BIO_MAX} characters or less.`);
    if (location.length > LOCATION_MAX)
      return setError(`Location must be ${LOCATION_MAX} characters or less.`);
    if (!EMAIL_RE.test(trimmedEmail)) return setError("Please enter a valid email address.");
    if (!MOBILE_RE.test(trimmedMobile)) return setError("Please enter a valid phone number.");

    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({
        first_name: first,
        last_name: last,
        // Only send the username when it actually changed.
        username: trimmedUsername !== profile?.username ? trimmedUsername : undefined,
        bio: bio.trim(),
        location: location.trim(),
        email: trimmedEmail,
        mobile_no: trimmedMobile,
        avatar: avatarFile,
      });
      syncAuthUser(updated);
      router.replace(`/${updated.role}/profile`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5E13]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
        <div className="rounded-3xl bg-white p-8 text-center text-sm text-[#766960]">
          {error || "Profile not found."}
        </div>
      </div>
    );
  }

  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() ||
    profile.username?.[0]?.toUpperCase() ||
    "?";

  const hasUnsavedChanges =
    avatarFile !== null ||
    firstName !== (profile.first_name || "") ||
    lastName !== (profile.last_name || "") ||
    username !== (profile.username || "") ||
    bio !== (profile.bio || "") ||
    location !== (profile.location || "") ||
    email !== (profile.email || "") ||
    mobileNo !== (profile.mobile_no || "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 sm:p-5"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !pendingAvatar) goBackToProfile();
      }}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={goBackToProfile}
        aria-label="Close profile editor"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-[#EFE6DC] bg-white text-[#2B211B] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#EFE6DC] bg-[#FAF6F0] px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFDBD0] text-[#FF5000]">
                <Pencil size={18} />
              </div>
              <h2
                id="edit-profile-title"
                className="text-lg font-bold tracking-tight"
              >
                Edit Profile
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#766960]">
              Update your public profile, contact details, and bio.
            </p>
          </div>

          <button
            type="button"
            onClick={goBackToProfile}
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EFE6DC] bg-white text-[#766960] transition hover:bg-[#FFF0E8] hover:text-[#FF5E13]"
          >
            <X size={17} />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Banner + avatar */}
          <div className="overflow-hidden rounded-[24px] border border-[#EFE6DC] shadow-sm">
            <div className="h-24 bg-gradient-to-r from-[#FF5E13] to-[#FFAB7C]" />

            <div className="bg-[#F7F3EE] px-4 pb-5 pt-3">
              <div className="relative -mt-12 flex flex-wrap items-end justify-between gap-3 px-2">
                <div className="flex items-end gap-3.5">
                  <div className="relative h-[80px] w-[80px] shrink-0">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-orange-100 shadow-md">
                      {avatarPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarPreview}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-[#FF5E13]">
                          {initials}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Change profile photo"
                      className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#FF5E13] text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
                    >
                      <Camera size={13} />
                    </button>
                  </div>

                  <div className="mb-0.5 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="self-start rounded-lg border border-[#EFE6DC] bg-[#E6E2DD] px-3 py-1 text-xs font-bold text-[#2B211B] shadow-sm transition hover:bg-[#FAF6F0]"
                    >
                      Upload Photo
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />

                    <span className="text-[10px] font-medium text-[#766960] opacity-90">
                      JPG, PNG or WEBP, up to 8 MB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={NAME_MAX}
                placeholder="First name"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={NAME_MAX}
                placeholder="Last name"
                className={fieldClass}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className={labelClass}>
              Username *
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.replace(/\s/g, ""));
                if (error) setError(null);
              }}
              maxLength={30}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="your_username"
              className={fieldClass}
            />
            <p className="mt-1 text-[10px] text-[#A59990]">
              3-30 characters: letters, numbers, dots and underscores.
            </p>
          </div>

          {/* Bio */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label
                htmlFor="bio"
                className="text-xs font-bold text-[#766960]"
              >
                Bio / Summary
              </label>
              <span
                className={`rounded-full bg-[#F1EDE8] px-2 py-0.5 text-[10px] font-semibold ${
                  bio.length >= BIO_MAX ? "text-red-600" : "text-[#695C51]"
                }`}
              >
                {bio.length} / {BIO_MAX}
              </span>
            </div>

            <textarea
              id="bio"
              rows={4}
              maxLength={BIO_MAX}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short introduction about yourself..."
              className="w-full resize-none rounded-xl border border-[#EFE6DC] bg-[#FAF6F0]/60 px-3.5 py-3 text-xs font-medium leading-relaxed outline-none transition focus:border-[#FF5E13] focus:bg-white"
            />

            <button
              type="button"
              onClick={() => setBio(bio.trim().replace(/\s+/g, " "))}
              className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#FFD2BE] bg-[#FFF0E8] px-3 py-1.5 text-[10px] font-bold text-[#FF5E13] transition hover:bg-[#FFE5D8]"
            >
              <Sparkles size={12} />
              Clean Up Bio
            </button>
          </div>

          {/* Contact + location */}
          <div className="border-t border-[#EFE6DC] pt-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="location" className={labelClass}>
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59990]"
                  />
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    maxLength={LOCATION_MAX}
                    placeholder="City, State, Country"
                    className={`${fieldClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59990]"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`${fieldClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobileNo" className={labelClass}>
                  Phone number
                </label>
                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59990]"
                  />
                  <input
                    id="mobileNo"
                    type="tel"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`${fieldClass} pl-9`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Change password (own endpoint + state) */}
          <div className="border-t border-[#EFE6DC] pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-xs font-bold text-[#766960]">
                <KeyRound size={14} className="text-[#FF5E13]" />
                Change Password
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswords((v) => !v)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#FF5E13] hover:underline"
              >
                {showPasswords ? <EyeOff size={13} /> : <Eye size={13} />}
                {showPasswords ? "Hide" : "Show"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="oldPassword" className={labelClass}>
                  Current password
                </label>
                <input
                  id="oldPassword"
                  type={showPasswords ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className={labelClass}>
                  New password
                </label>
                <input
                  id="newPassword"
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="otp" className={labelClass}>
                  Email code
                </label>
                <div className="flex gap-2">
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit code"
                    disabled={!otpSent}
                    className={`${fieldClass} tracking-[0.3em]`}
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || otpCooldown > 0}
                    className="shrink-0 rounded-xl border border-[#E5D9CD] bg-white px-4 py-2 text-xs font-bold text-[#766960] transition hover:bg-[#F3EBE3] disabled:opacity-50"
                  >
                    {isSendingOtp
                      ? "Sending..."
                      : otpCooldown > 0
                        ? `Resend in ${otpCooldown}s`
                        : otpSent
                          ? "Resend code"
                          : "Send code"}
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-[#A59990]">
                  We email a code to the address registered on your account.
                </p>
              </div>
            </div>

            {passwordError && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div
                role="status"
                className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700"
              >
                <CheckCircle2 size={16} />
                {passwordSuccess}
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="flex items-center gap-1.5 rounded-full bg-[#FF5E13] px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#E94E0D] active:scale-[0.98] disabled:opacity-50"
              >
                {isChangingPassword && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFE6DC] bg-[#FAF6F0] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges ? (
              <>
                <span className="h-2 w-2 rounded-full bg-[#FF5E13]" />
                <span className="text-[13px] font-semibold text-[#766960]">
                  Unsaved changes
                </span>
              </>
            ) : (
              <span className="text-[13px] text-[#A59990]">
                Your profile settings
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBackToProfile}
              disabled={isSaving}
              className="rounded-full border border-[#E5D9CD] bg-white px-4 py-2 text-sm font-bold text-[#766960] transition hover:bg-[#F3EBE3] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-full bg-[#FF5E13] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#E94E0D] active:scale-[0.98] disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </footer>
      </section>

      {pendingAvatar && (
        <AvatarEditor
          file={pendingAvatar}
          onCancel={() => setPendingAvatar(null)}
          onSave={handleAvatarEdited}
        />
      )}
    </div>
  );
}
