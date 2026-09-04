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
    <div className="w-full px-2 sm:px-4 md:px-6 pb-24 select-none">

      <div className="hidden sm:block lg:hidden mb-4">
        <TodayStories />
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-12 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-start">
        
     
        <div className="hidden sm:flex sm:col-span-5 lg:col-span-3 flex-col gap-4 sm:gap-5 w-full">
          <Insights />
          <ShareThoughtCard />
          
     
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

        <div className="col-span-1 sm:col-span-7 lg:col-span-6 flex flex-col gap-4 sm:gap-5 w-full mx-auto">
          {/* Mobile View */}
          <div className="block sm:hidden w-full flex flex-col gap-4">
            <Insights />

            <div className="w-full flex gap-2 xs:gap-3 items-start relative">
              <div className="flex-1 min-w-0">
                <ShareThoughtCard />
              </div>
              <div className="relative w-[72px] shrink-0">
                <TodayStories />
              </div>
            </div>

            <Earningwallet />
            <Repostanalysis />
            <Toprepostors />
            <Notifications />
          </div>


          <FeedPost />
        </div>

    
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