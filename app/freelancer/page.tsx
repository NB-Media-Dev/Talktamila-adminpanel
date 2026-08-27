"use client"
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
    <div className="@container w-full max-w-full">
      <div className="w-full max-w-[1440px] @7xl:max-w-[1870px] mx-auto px-2 @xs:px-3 @sm:px-4 @3xl:px-6 pb-24">
        <div className="block @6xl:hidden mb-4">
          <TodayStories />
        </div>

        <div className="grid grid-cols-1 @3xl:grid-cols-12 @6xl:grid-cols-8 gap-3 @xs:gap-4 @3xl:gap-6">
          <div className="hidden @3xl:flex @3xl:col-span-5 @6xl:col-span-2 flex-col gap-4">
            <Insights />
            <ShareThoughtCard />

            <div className="@6xl:hidden flex flex-col gap-4">
              <Earningwallet />
              <Repostanalysis />
              <TodaysEvents />
              <Toprepostors />
              <Notifications />
            </div>

            <div className="hidden @6xl:flex flex-col gap-4">
              <TodayStories />
              <TodaysEvents />
              <Toprepostors />
              <Notifications />
            </div>
          </div>

          <div className="col-span-1 @3xl:col-span-7 @6xl:col-span-4 flex flex-col gap-4 w-full max-w-[680px] mx-auto">
            <div className="@3xl:hidden w-full flex flex-col gap-4">
              <Earningwallet />
              <Repostanalysis />
              <Insights />
              <ShareThoughtCard />
              <Toprepostors />
              <Notifications />
            </div>
            <FeedPost />
          </div>

          <div className="hidden @6xl:flex @6xl:col-span-2 flex-col gap-4">
            <AICreatorStudio />
            <Earningwallet />
            <Repostanalysis />
          </div>
        </div>
      </div>
    </div>
  );
}  