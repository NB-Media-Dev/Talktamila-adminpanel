"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Star,
  User as UserIcon,
  UserPlus,
  VolumeX,
} from "lucide-react";
import { userService, type SettingsPerson } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import type { ProfileData } from "@/types/Auth";
import { buttonVariants } from "@/components/ui/Button";
import LogoutConfirmDialog from "@/components/layout/LogoutConfirmDialog";

/* ───────────── small building blocks ───────────── */

function Avatar({ person }: { person: SettingsPerson }) {
  const initial = (person.full_name || person.username || "?").charAt(0).toUpperCase();
  return (
    <div className="w-11 h-11 rounded-full ring-1 ring-orange-200 overflow-hidden bg-orange-100 flex items-center justify-center shrink-0">
      {person.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={person.avatar_url}
          alt={person.full_name || person.username}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-bold text-brand">{initial}</span>
      )}
    </div>
  );
}

function PersonRow({
  person,
  actionLabel,
  variant,
  busy,
  onAction,
}: {
  person: SettingsPerson;
  actionLabel: string;
  variant: "default" | "secondary" | "outline";
  busy: boolean;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-orange-50/60">
      <Avatar person={person} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {person.full_name || `@${person.username}`}
        </p>
        <p className="text-xs text-gray-400 truncate">@{person.username}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        disabled={busy}
        className={`px-3 py-1.5 text-xs font-bold shrink-0 ${buttonVariants({
          variant,
        })} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {busy ? "…" : actionLabel}
      </button>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-orange-100 p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-orange-50 text-brand flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

/* ───────────── the Settings screen ───────────── */

export default function SettingsView() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [muted, setMuted] = useState<SettingsPerson[]>([]);
  const [closeFriends, setCloseFriends] = useState<SettingsPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  // "Add close friends" picker — lists people you follow who aren't close friends yet
  const [showPicker, setShowPicker] = useState(false);
  const [following, setFollowing] = useState<SettingsPerson[] | null>(null);
  const [isPickerLoading, setIsPickerLoading] = useState(false);

  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [p, m, c] = await Promise.all([
          userService.getProfile(),
          userService.getMutedCreators(),
          userService.getCloseFriends(),
        ]);
        setProfile(p);
        setMuted(m);
        setCloseFriends(c);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const markPending = (id: number, on: boolean) =>
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const handleUnmute = async (person: SettingsPerson) => {
    setError(null);
    markPending(person.user_id, true);
    try {
      await userService.unmuteCreator(person.user_id);
      setMuted((prev) => prev.filter((u) => u.user_id !== person.user_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unmute.");
    } finally {
      markPending(person.user_id, false);
    }
  };

  const handleRemoveCloseFriend = async (person: SettingsPerson) => {
    setError(null);
    markPending(person.user_id, true);
    try {
      await userService.removeCloseFriend(person.user_id);
      setCloseFriends((prev) => prev.filter((u) => u.user_id !== person.user_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove close friend.");
    } finally {
      markPending(person.user_id, false);
    }
  };

  const handleAddCloseFriend = async (person: SettingsPerson) => {
    setError(null);
    markPending(person.user_id, true);
    try {
      await userService.addCloseFriend(person.user_id);
      setCloseFriends((prev) => [person, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add close friend.");
    } finally {
      markPending(person.user_id, false);
    }
  };

  const togglePicker = async () => {
    const next = !showPicker;
    setShowPicker(next);
    if (!next || following !== null || !profile) return;

    setIsPickerLoading(true);
    try {
      const list = await userService.getFollowing(profile.user_id, 200);
      setFollowing(
        list.map((u) => ({
          user_id: u.user_id,
          username: u.username,
          full_name: u.full_name ?? null,
          avatar_url: u.avatar_url ?? null,
          bio: u.bio ?? null,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load people you follow.");
      setFollowing([]);
    } finally {
      setIsPickerLoading(false);
    }
  };

  const handleLogout = () => {
    authService.signOut();
    setLogoutOpen(false);
    // Hard navigation on purpose: resets all client state.
    window.location.href = "/login";
  };

  const goBack = () => {
    if (profile) router.push(`/${profile.role}/profile`);
    else router.back();
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
        {error || "Could not load settings."}
      </div>
    );
  }

  const closeIds = new Set(closeFriends.map((u) => u.user_id));
  const pickerCandidates = (following || []).filter((u) => !closeIds.has(u.user_id));

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back to profile"
          className={`${buttonVariants({ variant: "outline" })} p-2`}
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center border border-red-100">
          {error}
        </div>
      )}

      {/* Account */}
      <SectionCard
        icon={<UserIcon size={18} />}
        title="Account"
        subtitle="Your name, username, contact details and password"
      >
        <button
          type="button"
          onClick={() => router.push(`/${profile.role}/profile/edit`)}
          className="w-full flex items-center justify-between px-2 py-3 rounded-xl hover:bg-orange-50/60 text-left cursor-pointer"
        >
          <span>
            <span className="block text-sm font-semibold text-gray-900">
              Edit profile &amp; change password
            </span>
            <span className="block text-xs text-gray-400">@{profile.username}</span>
          </span>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </SectionCard>

      {/* Close friends */}
      <SectionCard
        icon={<Star size={18} />}
        title="Close friends"
        subtitle="Only these people can see stories you share with Close Friends"
      >
        {closeFriends.length === 0 ? (
          <p className="text-sm text-gray-500 py-3 px-2">No close friends yet.</p>
        ) : (
          <div>
            {closeFriends.map((person) => (
              <PersonRow
                key={person.user_id}
                person={person}
                actionLabel="Remove"
                variant="secondary"
                busy={pendingIds.has(person.user_id)}
                onAction={() => handleRemoveCloseFriend(person)}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={togglePicker}
          className={`${buttonVariants({ variant: "outline" })} mt-3 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold`}
        >
          <UserPlus size={14} />
          {showPicker ? "Hide" : "Add from people you follow"}
        </button>

        {showPicker && (
          <div className="mt-3 border-t border-orange-100 pt-3">
            {isPickerLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-brand animate-spin" />
              </div>
            ) : pickerCandidates.length === 0 ? (
              <p className="text-sm text-gray-500 py-3 px-2">
                {following && following.length === 0
                  ? "You're not following anyone yet."
                  : "Everyone you follow is already a close friend."}
              </p>
            ) : (
              pickerCandidates.map((person) => (
                <PersonRow
                  key={person.user_id}
                  person={person}
                  actionLabel="Add"
                  variant="default"
                  busy={pendingIds.has(person.user_id)}
                  onAction={() => handleAddCloseFriend(person)}
                />
              ))
            )}
          </div>
        )}
      </SectionCard>

      {/* Muted creators */}
      <SectionCard
        icon={<VolumeX size={18} />}
        title="Muted creators"
        subtitle="You won't see their stories in your feed"
      >
        {muted.length === 0 ? (
          <p className="text-sm text-gray-500 py-3 px-2">You haven&apos;t muted anyone.</p>
        ) : (
          <div>
            {muted.map((person) => (
              <PersonRow
                key={person.user_id}
                person={person}
                actionLabel="Unmute"
                variant="secondary"
                busy={pendingIds.has(person.user_id)}
                onAction={() => handleUnmute(person)}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* Log out */}
      <SectionCard
        icon={<LogOut size={18} />}
        title="Session"
        subtitle="Sign out of this device"
      >
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition cursor-pointer"
        >
          Log out
        </button>
      </SectionCard>

      <LogoutConfirmDialog
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}