"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheckIcon,
  ChevronRight,
  Edit3,
  Eye,
  LayoutGrid,
  Landmark,
  Loader2,
  LockKeyhole,
  MapPin,
  ScrollText,
  Settings,
  Share2,
  ShieldCheck,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";
import { userService } from "@/services/user.service";
import type { ProfileData } from "@/types/Auth";
import DiscoverPeople from "@/components/profile/DiscoverPeople";
import FollowListModal from "@/components/profile/FollowListModal";
import ProfilePosts from "@/components/profile/ProfilePosts";
import Changeaccount from "@/components/profile/Changeaccount";

const LIVE_COUNTS_POLL_MS = 8000;

// There is no wallet or payout backend yet, so these start at zero for every account.
// Replace with real values once an earnings endpoint exists.
const WALLET = { available: 0, pending: 0, monthlyInflow: 0, lifetime: 0 };

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatCount = (n: number) => new Intl.NumberFormat("en-IN").format(n);

function maskMobile(mobile: string | undefined) {
  if (!mobile) return "Not added";
  return `${"•".repeat(Math.max(mobile.length - 4, 0))}${mobile.slice(-4)}`;
}

export default function ProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listModalTab, setListModalTab] = useState<"followers" | "following" | null>(null);
  const [isPayoutOpen, setPayoutOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Silent refresh (no spinner) so the counts update after follow/unfollow.
  const refreshProfile = useCallback(async () => {
    try {
      const data = await userService.getProfile();
      setProfile((prev) => (prev && JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    } catch {
      // keep showing the last known profile
    }
  }, []);

  useEffect(() => {
    const check = () => {
      if (!document.hidden) refreshProfile();
    };
    const id = setInterval(check, LIVE_COUNTS_POLL_MS);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, [refreshProfile]);

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
    `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() ||
    profile.username?.[0]?.toUpperCase() ||
    "?";
  const fullName = `${profile.first_name} ${profile.last_name}`.trim();
  const base = `/${profile.role}`;

  const handleShare = async () => {
    const url = `${window.location.origin}${base}/u/${encodeURIComponent(profile.username)}`;
    const shareData = {
      title: `${fullName || profile.username} on Talk Tamila`,
      text: "View my creator profile.",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Profile link copied!");
      } else {
        alert("Sharing is not supported in this browser.");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        alert("Unable to share the profile.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 font-sans text-[#2B211B] antialiased md:px-8 md:py-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* ── top bar ── */}
        <header className="flex flex-wrap items-center border-gray-200 rounded-full p-1.5 pl-6 pr-6 bg-white justify-between gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-semibold transition-opacity"
          >
            <div className="border-[#F1EDE8] rounded-full w-8 h-8 flex items-center justify-center bg-[#F1EDE8] hover:opacity-70">
              <ArrowLeft size={17} />
            </div>
            My Profile
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => router.push(`${base}/u/${encodeURIComponent(profile.username)}`)}
              className="flex items-center gap-1.5 rounded-full border border-[#F1EDE8] bg-[#F1EDE8] px-3 py-2 text-xs font-semibold hover:bg-[#F9F5F0]"
            >
              <Eye size={14} />
              Public View
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-[#EFE6DC] bg-[#F1EDE8] px-3 py-2 text-xs font-semibold hover:bg-[#F9F5F0]"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              type="button"
              onClick={() => router.push(`${base}/profile/edit`)}
              className="flex items-center gap-1.5 rounded-full bg-[#FF5E13] px-4 py-2 text-xs font-semibold text-white hover:bg-[#E04D08]"
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          </div>
        </header>

        {/* ── banner ── */}
        <section className="relative flex min-h-[120px] w-full items-center overflow-hidden rounded-3xl bg-[#FF5E13] p-6 shadow-md md:p-8">
          <div className="pointer-events-none absolute right-5 select-none text-6xl uppercase text-white/25 sm:text-4xl md:text-8xl">
            {profile.role}
          </div>
        </section>

        {/* ── avatar + identity ── */}
        <section className="text-black">
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex -mt-20 ml-5 h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/40 bg-orange-100 text-5xl font-black text-[#FF5E13]">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="h-40 w-40 object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
              <div className="absolute bottom-2 right-2 rounded-full border-2 bg-[#FF5E13] p-1 text-white shadow-sm">
                <BadgeCheckIcon size={15} />
              </div>
            </div>

            <div className="text-black">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-wide md:text-3xl">
                  @{profile.username}
                </h1>
                <span className="flex items-center gap-1.5 rounded-full bg-[#FFDBD0] px-3 py-1 text-[11px] font-semibold capitalize">
                  {profile.role}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium opacity-90 md:text-sm">
                {fullName && <span>{fullName}</span>}
                {profile.location && (
                  <>
                    {fullName && <span>•</span>}
                    <MapPin size={15} className="text-[#AD3303]" />
                    <span>{profile.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── bio ── */}
        <section className="px-2">
          <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-[#2B211B] md:text-base">
            {profile.bio || "No bio added yet."}
          </p>
        </section>

        {/* ── metrics (real numbers) ── */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            icon={<Users size={16} />}
            label="Followers"
            value={formatCount(profile.followers_count)}
            note="View followers"
            highlighted
            onClick={() => setListModalTab("followers")}
          />
          <MetricCard
            icon={<Users size={16} />}
            label="Following"
            value={formatCount(profile.following_count)}
            note="View following"
            onClick={() => setListModalTab("following")}
          />
          <MetricCard
            icon={<LayoutGrid size={16} />}
            label="Posts"
            value={formatCount(profile.posts_count)}
            note="Published posts"
          />
          <MetricCard
            icon={<Wallet size={16} />}
            label="Lifetime Revenue"
            value={<span className="text-[#FF5E13]">{formatINR(WALLET.lifetime)}</span>}
            note="No earnings yet"
          />
        </section>

        {/* ── wallet + account ── */}
        <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className="flex min-w-0 flex-col gap-5 rounded-2xl border border-[#EFE6DC] bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#EFE6DC] pb-4">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Wallet size={19} className="text-[#FF5E13]" />
                Creator Wallet
              </h2>
            </div>

            <div className="rounded-2xl bg-[#FF5E13] p-5 text-white shadow-sm">
              <span className="text-xs font-semibold opacity-90">Available Balance</span>
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">
                {formatINR(WALLET.available)}
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                <div>
                  <span className="text-[11px] opacity-80">Pending Clearance</span>
                  <p className="mt-1 text-sm font-bold">{formatINR(WALLET.pending)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] opacity-80">This Month&apos;s Inflow</span>
                  <p className="mt-1 text-sm font-bold">{formatINR(WALLET.monthlyInflow)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => router.push(`${base}/withdraw`)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF5E13] bg-[#FFF0E8] px-3 py-3.5 text-center text-xs font-bold text-[#FF5E13] transition-colors hover:bg-[#FF5E13] hover:text-white"
              >
                <Landmark size={16} />
                Withdraw Funds
                <ArrowUpRight size={15} />
              </button>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#766960]">
                <span>No payout account added yet</span>
                <button
                  type="button"
                  onClick={() => setPayoutOpen(true)}
                  className="font-semibold text-[#FF5E13] hover:underline"
                >
                  Add A/C
                </button>
              </div>
            </div>

            <div className="mt-1">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold">Recent Inflows &amp; Payouts</h3>
                <button
                  type="button"
                  onClick={() => router.push(`${base}/withdraw`)}
                  className="text-xs font-semibold text-[#766960] hover:text-[#FF5E13] hover:underline"
                >
                  View All Ledger
                </button>
              </div>
              <p className="rounded-xl bg-[#F7F3EE] p-4 text-center text-xs text-[#8A7C70]">
                No transactions yet. Earnings and payouts will show up here.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push(`${base}/withdraw`)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EFE6DC] px-3 py-3 text-center text-xs font-semibold text-[#766960] transition-colors hover:bg-[#FAF6F0]"
            >
              <ScrollText size={15} />
              Statements &amp; Invoices
              <ChevronRight size={15} />
            </button>
          </section>

          <section className="flex min-w-0 flex-col gap-5 rounded-2xl border border-[#EFE6DC] bg-white p-4 sm:p-6">
            <div className="flex items-center gap-2 border-b border-[#EFE6DC] pb-4">
              <Settings size={19} className="text-[#FF5E13]" />
              <h2 className="text-base font-bold">Account &amp; Security</h2>
            </div>

            <div className="flex flex-col gap-3">
              <InfoRow
                icon={<ShieldCheck size={19} />}
                title="Email"
                value={profile.email}
              />
              <InfoRow
                icon={<Smartphone size={19} />}
                title="Mobile"
                value={maskMobile(profile.mobile_no)}
              />
              <InfoRow
                icon={<LockKeyhole size={19} />}
                title="Password"
                value="Change it from Settings"
              />
            </div>

            <button
              type="button"
              onClick={() => router.push(`${base}/profile/settings`)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EFE6DC] px-3 py-3 text-xs font-semibold text-[#766960] transition-colors hover:bg-[#FAF6F0]"
            >
              <Settings size={15} />
              Open Settings
              <ChevronRight size={15} />
            </button>
          </section>
        </main>

        {/* ── posts grid ── */}
        <div className="overflow-hidden rounded-2xl border border-[#EFE6DC] bg-white">
          <div className="flex border-b border-[#EFE6DC]">
            <div className="flex flex-1 items-center justify-center gap-1.5 border-b-2 border-[#FF5E13] py-3 text-xs font-bold uppercase tracking-wide text-gray-900">
              <LayoutGrid className="h-4 w-4" />
              Posts
            </div>
          </div>
          <ProfilePosts
            username={profile.username}
            refreshKey={profile.posts_count}
            isMe
            onChanged={refreshProfile}
          />
        </div>

        {/* ── follow suggestions ── */}
        <DiscoverPeople onFollowChange={refreshProfile} />
      </div>

      {listModalTab && (
        <FollowListModal
          userId={profile.user_id}
          initialTab={listModalTab}
          onClose={() => setListModalTab(null)}
          onChanged={refreshProfile}
        />
      )}

      <Changeaccount
        isOpen={isPayoutOpen}
        onClose={() => setPayoutOpen(false)}
        onSave={() => {
          // UI only for now: nothing is stored until a payout API exists.
        }}
      />
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  note,
  highlighted = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  note: React.ReactNode;
  highlighted?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className="flex min-w-0 flex-col rounded-2xl border border-[#EFE6DC] bg-white p-4 text-left sm:p-5"
    >
      <span className="flex items-center gap-2 text-xs font-semibold text-[#766960]">
        <span className="text-[#FF5E13]">{icon}</span>
        {label}
      </span>
      <span className="mt-3 break-words text-xl font-extrabold tracking-tight sm:text-2xl">
        {value}
      </span>
      <span
        className={`mt-2 text-[10px] font-semibold sm:text-xs ${
          highlighted ? "text-[#FF5E13]" : "text-[#766960]"
        }`}
      >
        {note}
      </span>
    </Tag>
  );
}

function InfoRow({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#EFE6DC] bg-[#F7F3EE] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#FF5E13]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 break-all text-[12px] text-[#8A7C70]">{value}</p>
      </div>
    </div>
  );
}
