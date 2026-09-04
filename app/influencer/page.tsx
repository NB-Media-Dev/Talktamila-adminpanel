"use client"

import TodayStories from "@/components/admin/dashboard/TodaysStories";
import FeedPost from "@/components/admin/Feed/FeedPost";
import TrendingTopics from "@/components/admin/dashboard/TrendingTopics";

import AITrendRadar from "@/components/admin/dashboard/AITrendRadar";

import TodaysEvents from "@/components/admin/dashboard/TodaysEvents";

import AICreatorStudio from "@/components/admin/RightPanel/AICreatorStudio";

import CreatorWallet from "@/components/admin/RightPanel/CreatorWallet";


import UpcomingSchedule from "@/components/admin/RightPanel/UpcomingSchedule";

import ShareThoughtCard from "@/components/admin/dashboard/ShareThoughtCard";
import CreatorReputationScore from "@/components/influencer/Creatorreputationscore";
import Insights from "@/components/influencer/Insights";


export default function InfluencerPage() {
  return (
    <div className="@container w-full max-w-full">
      <div className="w-full px-2 @xs:px-3 @sm:px-4 @3xl:px-6 pb-24">
        <div className="hidden sm:block @6xl:hidden mb-4">
          <TodayStories />
        </div>

        <div className="grid grid-cols-1 @3xl:grid-cols-12 @6xl:grid-cols-8 gap-3 @xs:gap-4 @3xl:gap-6">
          <div className="hidden @3xl:flex @3xl:col-span-5 @6xl:col-span-2 flex-col gap-4">
            <ShareThoughtCard />

            <div className="@6xl:hidden flex flex-col gap-4">
              <AITrendRadar />
              <TrendingTopics />
              <TodaysEvents />
            </div>

            <div className="hidden @6xl:flex flex-col gap-4">
              <TodayStories />
              <AITrendRadar />
              <TrendingTopics />
              <TodaysEvents />
            </div>
          </div>

          <div className="col-span-1 @3xl:col-span-7 @6xl:col-span-4 flex flex-col gap-4 w-full mx-auto">
          
            <div className="sm:hidden w-full flex gap-2 xs:gap-3 items-start relative">
              <div className="flex-1 min-w-0">
                <ShareThoughtCard />
              </div>
              <div className="relative w-[72px] shrink-0">
                <TodayStories />
              </div>
            </div>

            {/* Tablet View: ShareThoughtCard full width */}
            <div className="hidden sm:block @3xl:hidden w-full">
              <ShareThoughtCard />
            </div>

            <FeedPost />
          </div>

          <div className="hidden @6xl:flex @6xl:col-span-2 flex-col gap-4">
            <Insights />
            <AICreatorStudio />
            <CreatorWallet />
            <CreatorReputationScore />
            <UpcomingSchedule />
          </div>
        </div>
      </div>
    </div>
  );
}



