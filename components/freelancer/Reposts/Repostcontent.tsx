"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { InstagramIcon, FacebookIcon, TreadsIcon, YoutubeIcon } from "@/public/Svgicons/svgicons";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { TableSkeleton } from "@/components/ui/Skeletonloading";
import Image, { StaticImageData } from "next/image";
import avatar1 from "@/public/Images/avatar1.png";

export interface RepostedItem {
  id: string;
  title: string;
  thumbnail: string | StaticImageData;
  platform: "Instagram" | "Facebook" | "YouTube" | "Threads";
  postedDate: string;
  postedTime: string;
  impressions: string;
  earnings: string;
  status: "PUBLISHED" | "PROCESSING" | "REJECTED";
}

export interface RepostContentProps {
  title?: string;
  items?: RepostedItem[];
  maxRows?: number;
  className?: string;
  onViewAll?: () => void;
  showBackButton?: boolean;
}

const RAW_REPOSTED_ITEMS: [string, string, RepostedItem["platform"], string, string, string, string, RepostedItem["status"]][] = [
  ["rc-1", "Rain Relief Camps Campaign", "Instagram", "26 May 2024", "10:30 PM", "45.6K", "₹156.80", "PUBLISHED"],
  ["rc-2", "Chennai Metro Phase 2 Updates", "Facebook", "25 May 2024", "08:15 PM", "32.1K", "₹98.60", "PROCESSING"],
  ["rc-3", "Green Tamil Nadu Mission Launch", "YouTube", "24 May 2024", "04:45 PM", "68.2K", "₹240.50", "PUBLISHED"],
  ["rc-4", "Smart City Transport Drive", "Threads", "23 May 2024", "02:10 PM", "18.4K", "₹64.20", "PROCESSING"],
  ["rc-5", "Youth Entrepreneurship Summit", "Instagram", "22 May 2024", "11:00 AM", "52.9K", "₹180.00", "PUBLISHED"],
  ["rc-6", "Rural Digital Literacy Program", "Facebook", "21 May 2024", "06:30 PM", "29.7K", "₹85.40", "PROCESSING"],
  ["rc-7", "Coastal Cleanliness Awareness", "YouTube", "20 May 2024", "09:20 AM", "74.1K", "₹310.00", "PUBLISHED"],
];

const defaultRepostedItems: RepostedItem[] = RAW_REPOSTED_ITEMS.map(
  ([id, title, platform, postedDate, postedTime, impressions, earnings, status]) => ({
    id,
    title,
    thumbnail: avatar1,
    platform,
    postedDate,
    postedTime,
    impressions,
    earnings,
    status,
  })
);

const PLATFORM_ICONS: Record<RepostedItem["platform"], React.ReactNode> = {
  Instagram: <InstagramIcon />,
  Facebook: <FacebookIcon />,
  YouTube: <YoutubeIcon />,
  Threads: <TreadsIcon />,
};

const STATUS_STYLES: Record<RepostedItem["status"], string> = {
  PUBLISHED: "bg-[#E8F8F0] text-[#10B981] border-[#D1F2E2]",
  PROCESSING: "bg-[#FFF8E6] text-[#D97706] border-[#FDE68A]",
  REJECTED: "bg-red-50 text-red-500 border-red-200",
};

const filterTabs = [
  { label: "All", key: "All" },
  { label: "Instagram", key: "Instagram" },
  { label: "Facebook", key: "Facebook" },
  { label: "YouTube", key: "YouTube" },
  { label: "Threads", key: "Threads" },
];

function StatusBadge({ status }: { status: RepostedItem["status"] }) {
  return (
    <span
      className={`inline-block text-[10px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full tracking-wider border shrink-0 ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function MobileItemCard({ item }: { item: RepostedItem }) {
  return (
    <div className="p-4 flex flex-col gap-3 hover:bg-gray-50/60 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src={item.thumbnail}
            alt={item.title}
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100 shadow-xs"
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
              {item.title}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              {PLATFORM_ICONS[item.platform]}
              <span className="text-[11px] text-gray-400 font-medium">
                {item.postedDate} • {item.postedTime}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-gray-400 font-medium">Impressions:</span>
          <span className="font-bold text-gray-900">{item.impressions}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-400 font-medium">Earnings:</span>
          <span className="font-bold text-[#C04808] text-sm">{item.earnings}</span>
        </div>
      </div>
    </div>
  );
}

function DesktopTableRow({ item }: { item: RepostedItem }) {
  return (
    <tr className="hover:bg-gray-50/60 transition-colors group">
      <td className="py-3.5 px-6">
        <div className="flex items-center gap-3">
          <Image
            src={item.thumbnail}
            alt={item.title}
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100 shadow-xs"
          />
          <span className="font-semibold text-gray-800 line-clamp-1 max-w-[220px]">
            {item.title}
          </span>
        </div>
      </td>
      <td className="py-3.5 px-4">{PLATFORM_ICONS[item.platform]}</td>
      <td className="py-3.5 px-4">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700 text-xs">{item.postedDate}</span>
          <span className="text-[11px] text-gray-400 font-medium mt-0.5">{item.postedTime}</span>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span className="font-bold text-gray-900 text-sm">{item.impressions}</span>
      </td>
      <td className="py-3.5 px-4">
        <span className="font-bold text-[#C04808] text-sm sm:text-base">{item.earnings}</span>
      </td>
      <td className="py-3.5 px-6 text-right">
        <StatusBadge status={item.status} />
      </td>
    </tr>
  );
}

export default function RepostContent({
  title = "My Reposted Content",
  items = defaultRepostedItems,
  maxRows,
  className = "",
  onViewAll,
  showBackButton,
}: RepostContentProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  UsetimeoutLoader(setIsLoading);

  const shouldShowBack = showBackButton ?? !maxRows;

  const filteredItems = items.filter((item) => {
    if (activeFilter === "All") return true;
    return item.platform.toLowerCase() === activeFilter.toLowerCase();
  });

  const displayItems = maxRows ? filteredItems.slice(0, maxRows) : filteredItems;

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push("/freelancer/submissions");
    }
  };

  return (
    <div>
      {shouldShowBack && (
        <button
          onClick={() => router.back()}
          className={`${buttonVariants({ variant: "link" })} outline-none cursor-pointer flex items-center gap-1 mb-3`}
        >
          <ArrowLeft className="w-8 h-6" /> Back
        </button>
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div
          className={`w-full bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col select-none ${className}`}
        >
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? buttonVariants({ variant: "default" })
                        : buttonVariants({ variant: "secondary" })
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

        
          <div className="block sm:hidden divide-y divide-gray-100/80">
            {displayItems.map((item, index) => (
              <MobileItemCard key={`mobile-${item.id}-${index}`} item={item} />
            ))}
          </div>

          <div className="hidden sm:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-y border-gray-100 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6 font-bold">Content</th>
                  <th className="py-3.5 px-4 font-bold">Platform</th>
                  <th className="py-3.5 px-4 font-bold">Posted On</th>
                  <th className="py-3.5 px-4 font-bold">Impressions</th>
                  <th className="py-3.5 px-4 font-bold">Earnings</th>
                  <th className="py-3.5 px-6 text-right font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80 text-xs sm:text-sm">
                {displayItems.map((item, index) => (
                  <DesktopTableRow key={`desktop-${item.id}-${index}`} item={item} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#F8FAFC]/80 border-t border-gray-100 p-4 flex items-center justify-center">
            <button
              type="button"
              onClick={handleViewAllClick}
              className="text-xs sm:text-sm font-bold text-[#C04808] hover:text-[#A33B05] flex items-center gap-2 transition-all cursor-pointer group"
            >
              <span>View All Reposted Content</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
