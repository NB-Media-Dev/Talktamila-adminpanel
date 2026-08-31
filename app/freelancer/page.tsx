"use client";

import TodayStories from "@/components/admin/dashboard/TodaysStories";
import FeedPost from "@/components/admin/Feed/FeedPost";
import TodaysEvents from "@/components/admin/dashboard/TodaysEvents";
import AICreatorStudio from "@/components/admin/RightPanel/AICreatorStudio";
import ShareThoughtCard from "@/components/admin/dashboard/ShareThoughtCard";
import Insights from "@/components/influencer/Insights";
import Notifications from "@/components/freelancer/Notifications";
import Earningwallet from "@/components/freelancer/Earningwallet";
import Repostanalysis from "@/components/freelancer/Repostanalysis";
import Toprepostors from "@/components/freelancer/Toprepostors";

export default function FreelancerPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 md:px-6 pb-24 select-none">
      {/* Stories Bar at Top for Tablet only (sm to lg) */}
      <div className="hidden sm:block lg:hidden mb-4">
        <TodayStories />
      </div>

      {/* Main Responsive Grid Layout (Activates at sm: 640px+ for tablet view) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-start">
        
        {/* Left Sidebar Column:
            - Mobile (< sm): Hidden in main grid, rendered in mobile stack below
            - Tablet (640px-1023px, sm): 5 cols out of 12 (col-span-5)
            - Desktop (>= 1024px, lg): 3 cols out of 12 (col-span-3)
        */}
        <div className="hidden sm:flex sm:col-span-5 lg:col-span-3 flex-col gap-4 sm:gap-5 w-full">
          <Insights />
          <ShareThoughtCard />
          
          {/* Tablet specific extra widgets */}
          <div className="flex lg:hidden flex-col gap-4 sm:gap-5">
            <Earningwallet />
            <Repostanalysis />
            <TodaysEvents />
            <Toprepostors />
            <Notifications />
          </div>

          {/* Desktop specific left widgets */}
          <div className="hidden lg:flex flex-col gap-4 sm:gap-5">
            <Toprepostors />
            <Notifications />
          </div>
        </div>

        {/* Center Main Feed Column:
            - Mobile (< sm): 1 col (full width)
            - Tablet (640px-1023px, sm): 7 cols out of 12 (col-span-7)
            - Desktop (>= 1024px, lg): 6 cols out of 12 (col-span-6)
        */}
        <div className="col-span-1 sm:col-span-7 lg:col-span-6 flex flex-col gap-4 sm:gap-5 w-full max-w-[680px] mx-auto">
          {/* Mobile Only Stack (< sm) */}
          <div className="block sm:hidden w-full flex flex-col gap-4">
            <Earningwallet />
            <Repostanalysis />
            <Insights />
            {/* Mobile View: ShareThoughtCard on left, TodayStories on right in a grid */}
            <div className="w-full flex gap-3 items-start relative">
              <div className="flex-1 min-w-0">
                <ShareThoughtCard />
              </div>
              <div className="relative w-[72px] shrink-0 h-[230px]">
                <TodayStories />
              </div>
            </div>
            <Toprepostors />
            <Notifications />
          </div>

          <FeedPost />
        </div>

        {/* Right Sidebar Column (Desktop Only >= 1024px, lg):
            - Desktop (lg): 3 cols out of 12 (col-span-3)
        */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 sm:gap-5 w-full">
          <AICreatorStudio />
          <Earningwallet />
          <Repostanalysis />
          <TodaysEvents />
        </div>

      </div>
    </div>
  );
}  