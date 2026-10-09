"use client";

import { useContext, useState } from "react";
import { Plus } from "lucide-react";
import Queue from "@/components/admin/Contentschedule/Queue";
import Calendar from "@/components/admin/Contentschedule/calendar";
import ActiveCampaigns from "@/components/admin/Contentschedule/rightsidecontentschedule/ActiveCampaigns";
import EstimatedRevenue from "@/components/admin/Contentschedule/rightsidecontentschedule/EstimatedRevenue";
import ActiveCollaboration from "@/components/admin/Contentschedule/rightsidecontentschedule/ActiveCollaboration";
import { useContenthook } from "@/hooks/useContent";
import { startOfDay } from "@/lib/schedule";

export default function ContentScheduleView() {
  // The day picked on the calendar. null = show every scheduled post in the Queue.
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const context = useContext(useContenthook);

  const openNewPost = () => context?.setHandlestate(true);
  const clearFilter = () => setFilterDate(null);
  // Changing the day remounts the Queue so it starts again on page 1.
  const filterKey = filterDate ? startOfDay(filterDate).getTime() : "all";

  const newPostButton = (
    <button
      type="button"
      onClick={openNewPost}
      className="bg-[#F27D42] hover:bg-[#E35420] active:scale-95 text-white font-extrabold text-sm sm:text-base py-3 sm:py-3.5 px-8 rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto"
    >
      <Plus size={18} />
      New post
    </button>
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 select-none">
      <div className="mb-4 sm:mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Content Schedule</h1>
          <p className="text-gray-500 mt-1.5 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
            Schedule posts for later and manage everything waiting to go live.
          </p>
        </div>
        <div className="hidden md:block">{newPostButton}</div>
      </div>

      {/* One layout for every screen size, so each part loads its data only once. */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6 items-start w-full">
        <div className="order-2 md:order-none col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9 md:row-start-1">
          <Calendar selectedDate={filterDate} onSelectDate={setFilterDate} />
        </div>

        <div className="order-1 md:order-none col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 md:row-start-1 flex flex-col gap-5 sm:gap-6">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 sm:gap-4 md:gap-6">
            <ActiveCampaigns />
            <EstimatedRevenue />
          </div>
          <div className="hidden md:block">
            <ActiveCollaboration />
          </div>
        </div>

        <div className="order-3 md:hidden col-span-12 w-full max-w-xs mx-auto">{newPostButton}</div>

        <div className="order-3 md:hidden col-span-12 w-full">
          <ActiveCollaboration />
        </div>

        <div className="order-4 md:order-none col-span-12 w-full">
          <Queue key={filterKey} filterDate={filterDate} onClearFilter={clearFilter} />
        </div>
      </div>
    </div>
  );
}