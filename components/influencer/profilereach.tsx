"use client";

import { useState } from "react";
import { Users, Eye, Heart, User, Wallet, ChevronDown, TrendingUp, MoveUp } from "lucide-react";

interface StatItem {
  id: string;
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const stats: StatItem[] = [
  {
    id: "followers",
    label: "Total Followers",
    value: "245.8K",
    change: "12.4%",
    icon: Users,
    iconBg: "bg-orange-50",
    iconColor: "text-[#FF6B35]",
  },
  {
    id: "views",
    label: "Content Views",
    value: "1.25M",
    change: "18.7%",
    icon: Eye,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    id: "engagement",
    label: "Engagement Rate",
    value: "8.52%",
    change: "2.3%",
    icon: Heart,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    id: "visits",
    label: "Profile Visits",
    value: "42.6K",
    change: "9.1%",
    icon: User,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    id: "earnings",
    label: "Total Earnings",
    value: "₹1,25,430",
    change: "16.8%",
    icon: Wallet,
    iconBg: "bg-orange-50",
    iconColor: "text-[#FF6B35]",
  },
];

export default function ProfileReach() {
  const [workspace, setWorkspace] = useState("Influencer");
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  return (
    <div className="w-full bg-white border border-gray-100 rounded-[20px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] select-none">
    
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Welcome back, Indhu! <span>👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Create amazing content, grow your audience and earn more.
          </p>
        </div>

      
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-xs text-gray-400">Workspace</span>
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-gray-800 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>{workspace}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isWorkspaceOpen ? "rotate-180" : ""}`} />
            </button>

            {isWorkspaceOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-2xl shadow-lg py-1.5 z-20">
                {["Influencer", "Creator", "Brand"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setWorkspace(option);
                      setIsWorkspaceOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6B35] transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="bg-[#FAFAFA] border border-gray-100/80 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-xs transition-all duration-200"
            >
              {/* Header: Icon + Label */}
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${item.iconBg} ${item.iconColor} shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700 leading-snug">
                  {item.label}
                </span>
              </div>

              {/* Value & Change */}
              <div className="mt-2.5 sm:mt-3">
                <div className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
                  {item.value}
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#10B981] mt-1 whitespace-nowrap">
                  <MoveUp className="w-3 h-3 stroke-[2.5] shrink-0" />
                  <span>{item.change}</span>
                  <span className="text-gray-400 font-normal">this week</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
