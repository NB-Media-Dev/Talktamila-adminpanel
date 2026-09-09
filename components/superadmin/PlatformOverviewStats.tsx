"use client";

import { Users, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { StatsCardSkeleton } from "@/components/ui/Skeletonloading";

// Mock data — replace with a real API call once /superadmin endpoints exist.
// Each card answers one question a Super Admin needs at a glance.
const stats = [
  {
    label: "Total Users",
    value: "12,480",
    change: "+4.2%",
    icon: Users,
  },
  {
    label: "Admin Accounts",
    value: "6",
    change: "+1 this month",
    icon: ShieldCheck,
  },
  {
    label: "Platform Reach (30d)",
    value: "3.2M",
    change: "+18.6%",
    icon: TrendingUp,
  },
  {
    label: "Total Platform Revenue",
    value: "₹8,42,150",
    change: "+9.1%",
    icon: Wallet,
  },
];

export function PlatformOverviewStats() {
  const [isLoading, setIsLoading] = useState(true);
  UsetimeoutLoader(setIsLoading);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-[24px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-9 h-9 rounded-full bg-[#FFEFE0] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#FF6B35]" />
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 font-medium mt-0.5">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
