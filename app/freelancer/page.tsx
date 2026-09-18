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
      
      {/* MOBILE & TABLET LAYOUT: Share Thought on top, Stories underneath */}
      <div className="block lg:hidden mb-4 flex flex-col gap-4">
        <ShareThoughtCard />
      
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="hidden sm:flex sm:col-span-5 lg:col-span-3 flex-col gap-4 sm:gap-5 w-full">
          <Insights />
               <ShareThoughtCard />
          <TodayStories /> 
          {/* Tablet only view */}
          <div className="flex lg:hidden flex-col gap-4 sm:gap-5">
            <Earningwallet />
            <Repostanalysis />
            <TodaysEvents />
            <Toprepostors />
            <Notifications />
          </div>
          
          {/* Desktop Left view */}
          <div className="hidden lg:flex flex-col gap-4 sm:gap-5">
            <Toprepostors />
            <Notifications />
          </div>
        </div>

        {/* MIDDLE COLUMN (Feed) */}
        <div className="col-span-1 sm:col-span-7 lg:col-span-6 flex flex-col gap-4 sm:gap-5 w-full mx-auto">
          {/* Strict Mobile only view */}
          <div className="block sm:hidden w-full flex flex-col gap-4">
            <Insights />
            <Earningwallet />
            <Repostanalysis />
            <Toprepostors />
            <Notifications />
          </div>
          <FeedPost />
        </div>

        {/* RIGHT COLUMN (Desktop Right) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 sm:gap-5 w-full">
          {/* ShareThoughtCard is now on top, TodayStories is directly below it */}
     
          <AICreatorStudio />
          <Earningwallet />
          <Repostanalysis />
          <TodaysEvents />
        </div>

      </div>
    </div>
  );
}
