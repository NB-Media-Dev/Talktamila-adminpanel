"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface EventItem {
  id: number;
  day: string;
  month: string;
  title: string;
  type: string;
}

interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  isLive?: boolean;
  isActive?: boolean;
}

interface TodaysEventsProps {
  isInfluencer?: boolean;
}

export default function TodaysEvents({ isInfluencer: propIsInfluencer }: TodaysEventsProps = {}) {
  const pathname = usePathname();
  
  const isInfluencer = propIsInfluencer ?? pathname?.startsWith("/influencer");

  const events: EventItem[] = [
    {
      id: 1,
      day: "28",
      month: "JUL",
      title: "Aadi Perukku Special Live",
      type: "Live",
    },
    {
      id: 2,
      day: "02",
      month: "AUG",
      title: "Chennai Creator Meetup",
      type: "Event",
    },
    {
      id: 3,
      day: "09",
      month: "AUG",
      title: "Brand Campaign Deadline",
      type: "Campaign",
    },
  ];

  const influencerSchedule: ScheduleItem[] = [
    {
      id: 1,
      time: "8:00 PM",
      title: "Live: IPL Match Review",
      isLive: true,
      isActive: true,
    },
    {
      id: 2,
      time: "9:00 PM",
      title: "AI Workshop for Creators",
      isLive: false,
      isActive: false,
    },
  ];

  if (isInfluencer) {
    return (
      <div className="w-full bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4 select-none">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Today&apos;s Schedule
          </h2>
          <Link
            href="/influencer/assignments"
            className="text-xs sm:text-sm font-semibold text-[#FF6B35] hover:text-[#D9652B] transition-colors duration-200"
          >
            View Calendar
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {influencerSchedule.map((item) =>
            item.isActive ? (
              <div
                key={item.id}
                className="bg-[#FFF2EC] rounded-[22px] px-4 py-3 flex items-center justify-between transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-bold text-[#FF5A26] shrink-0">
                    {item.time}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    {item.title}
                  </span>
                </div>
                {item.isLive && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0 ml-2" />
                )}
              </div>
            ) : (
              <div
                key={item.id}
                className="px-4 py-2.5 flex items-center justify-between transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-gray-400 shrink-0">
                    {item.time}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#4A5568]">
                    {item.title}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FFF2EC] text-[#FF5A26]">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Upcomings Events
          </h2>
        </div>
       
        <Link
          href="/admin/content"
          className="text-xs sm:text-sm font-semibold text-[#FF6B35] hover:text-[#D9652B] transition-colors duration-200"
        >
          Calendar
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-3.5 group cursor-pointer hover:bg-gray-50/50 p-1 -mx-1 rounded-2xl transition-all duration-200"
          >
            <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-[#FFF2EC] text-[#FF5A26] shrink-0 transition-transform duration-200 group-hover:scale-105">
              <span className="text-base font-extrabold leading-none">
                {event.day}
              </span>
              <span className="text-[9px] font-extrabold tracking-wider mt-0.5 opacity-80">
                {event.month}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-800 group-hover:text-[#FF5A26] transition-colors duration-200">
                {event.title}
              </span>
              <span className="text-xs text-gray-400 mt-0.5 font-medium">
                {event.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

