"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { useAuthuser } from "@/hooks/useAuthuser";
import { buttonVariants } from "@/components/ui/Button";
import type { ProfileData } from "@/types/Auth";

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PICKED_FILE_BYTES = 8 * 1024 * 1024; // the picture is shrunk before upload
const AVATAR_SIZE = 256; // px, square
const NAME_MAX = 100;
const BIO_MAX = 300;
const LOCATION_MAX = 100;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MOBILE_RE = /^\+?[0-9\s-]{7,20}$/;
const PASSWORD_MIN = 6;

/** Crops the picture to a centred square, shrinks it, and returns a small JPEG file. */
async function shrinkAvatar(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not read that image."));
      image.src = objectUrl;
    });

    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2;
    const sy = (img.height - side) / 2;
    const target = Math.min(AVATAR_SIZE, side);

    const canvas = document.createElement("canvas");
    canvas.width = target;
    canvas.height = target;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process that image.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, target, target);
    ctx.drawImage(img, sx, sy, side, side, 0, 0, target, target);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    if (!blob) throw new Error("Could not process that image.");
    return new File([blob], "avatar.jpg", { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}

/** One Instagram-style settings row: label on the left, control on the right. */
function EditRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 py-4 border-b border-orange-100 last:border-b-0">
      <label className="text-sm font-semibold text-gray-500 sm:text-right sm:pt-2">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}

const inputClass =
  "w-full p-2.5 rounded-lg border border-orange-100 outline-none focus:border-brand transition-colors text-sm bg-orange-50/40";

export default function EditProfile() {
  const router = useRouter();
  const { user, setUser } = useAuthuser();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Change-password fields are kept separate: they hit their own endpoint
  // and shouldn't be blocked by (or block) the profile-fields save.
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fillForm = (data: ProfileData) => {
    setFirstName(data.first_name || "");
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

  // Push the saved values into the auth context so the navbar updates without a reload.
  const syncAuthUser = (updated: ProfileData) => {
    if (!user) return;
    const patch = {
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      setError(null);
      const small = await shrinkAvatar(file);
      setAvatarFile(small);
      setAvatarPreview(await readAsDataUrl(small));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process that image.");
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

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordSuccess("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const goBackToProfile = () => {
    if (profile) router.push(`/${profile.role}/profile`);
    else router.back();
  };

  const handleSave = async () => {
    setError(null);

    const first = firstName.trim();
    const last = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedMobile = mobileNo.trim();

    if (!first) return setError("First name is required.");
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
        bio: bio.trim(),
        location: location.trim(),
        email: trimmedEmail,
        mobile_no: trimmedMobile,
        avatar: avatarFile,
      });
      syncAuthUser(updated);
      router.push(`/${updated.role}/profile`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center text-gray-500">
        {error || "Profile not found."}
      </div>
    );
  }

  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() ||
    profile.username?.[0]?.toUpperCase() ||
    "?";

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={goBackToProfile}
          aria-label="Back to profile"
          className={`${buttonVariants({ variant: "outline" })} p-2`}
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6 sm:p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 pb-6 border-b border-orange-100">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-brand">{initials}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-semibold text-brand hover:underline"
          >
            Change profile photo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
          />
        </div>

        {/* Rows */}
        <EditRow label="Name">
          <div className="flex gap-3">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              maxLength={NAME_MAX}
              className={inputClass}
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              maxLength={NAME_MAX}
              className={inputClass}
            />
          </div>
        </EditRow>

        <EditRow label="Username">
          <input
            value={profile.username}
            disabled
            className={`${inputClass} opacity-60 cursor-not-allowed`}
          />
        </EditRow>

        <EditRow label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={BIO_MAX}
            rows={3}
            className={inputClass}
          />
          <p className="text-right text-[11px] text-gray-400 mt-1">
            {bio.length}/{BIO_MAX}
          </p>
        </EditRow>

        <EditRow label="Location">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={LOCATION_MAX}
            placeholder="City, Country"
            className={inputClass}
          />
        </EditRow>

        <EditRow label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </EditRow>

        <EditRow label="Phone number">
          <input
            type="tel"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </EditRow>
      </div>

      {error && (
        <div className="p-3 mt-4 bg-red-50 text-red-600 text-xs rounded-xl text-center border border-red-100">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={goBackToProfile}
          disabled={isSaving}
          className={`${buttonVariants({ variant: "outline" })} px-4 py-2 text-sm font-bold disabled:opacity-50`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={`${buttonVariants({ variant: "default" })} flex items-center gap-1.5 px-5 py-2 text-sm font-bold disabled:opacity-50`}
        >
          {isSaving && <Loader2 size={14} className="animate-spin" />}
          {isSaving ? "Saving..." : "Submit"}
        </button>
      </div>

      {/* ── Change password — separate card, separate endpoint/state ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6 sm:p-8 mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-gray-900">Change password</h2>
          <button
            type="button"
            onClick={() => setShowPasswords((v) => !v)}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            {showPasswords ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPasswords ? "Hide" : "Show"}
          </button>
        </div>

        <EditRow label="Current password">
          <input
            type={showPasswords ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoComplete="current-password"
            className={inputClass}
          />
        </EditRow>

        <EditRow label="New password">
          <input
            type={showPasswords ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
          />
        </EditRow>

        <EditRow label="Confirm password">
          <input
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
          />
        </EditRow>

        {passwordError && (
          <div className="p-3 mt-2 bg-red-50 text-red-600 text-xs rounded-xl text-center border border-red-100">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="p-3 mt-2 bg-emerald-50 text-emerald-600 text-xs rounded-xl text-center border border-emerald-100">
            {passwordSuccess}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className={`${buttonVariants({ variant: "default" })} flex items-center gap-1.5 px-5 py-2 text-sm font-bold disabled:opacity-50`}
          >
            {isChangingPassword && <Loader2 size={14} className="animate-spin" />}
            {isChangingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}