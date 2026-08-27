"use client";

import ProfileReach from "@/components/influencer/profilereach";
import RecentContent from "@/components/influencer/Recentcontent";
import Creator from "@/components/influencer/creator";
import EarningsOverview from "@/components/influencer/EarningsOverview";
import UpcomingPost from "@/components/influencer/upcomingpost";
import CreatorScore from "@/components/influencer/creatorscore";

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-6 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start w-full">
        
    
        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          <ProfileReach />
          <RecentContent />
          <Creator limit={2} />
        </div>

        
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 w-full min-w-0">
          <EarningsOverview />
          <UpcomingPost />
          <div className="md:col-span-2 lg:col-span-1">
            <CreatorScore />
          </div>
        </div>

      </div>
    </div>
  );
}

