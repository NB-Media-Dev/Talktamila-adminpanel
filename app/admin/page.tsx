"use client"
import { useContext, useState } from "react";
import TodayStories from "@/components/admin/dashboard/TodaysStories";
import FeedPost from "@/components/admin/Feed/FeedPost";
import TrendingTopics from "@/components/admin/dashboard/TrendingTopics";
import TrendingHashtags from "@/components/admin/dashboard/TrendingHashtags";
import AITrendRadar from "@/components/admin/dashboard/AITrendRadar";
import BreakingNews from "@/components/admin/dashboard/BreakingNews";
import ContentInspiration from "@/components/admin/dashboard/ContentInspiration";
import TodaysEvents from "@/components/admin/dashboard/TodaysEvents";
import SavedDrafts from "@/components/admin/dashboard/SavedDrafts";
import AICreatorStudio from "@/components/admin/RightPanel/AICreatorStudio";
import CreatorStats from "@/components/admin/RightPanel/CreatorStats";
import CreatorWallet from "@/components/admin/RightPanel/CreatorWallet";
import AIContentWorkflow from "@/components/admin/RightPanel/AIContentWorkflow";
import CampaignMarketplace from "@/components/admin/RightPanel/CampaignMarketplace";
import UpcomingSchedule from "@/components/admin/RightPanel/UpcomingSchedule";
import TopCreators from "@/components/admin/RightPanel/TopCreators";
import ShareThoughtCard from "@/components/admin/dashboard/ShareThoughtCard";


export default function AdminPage() {

  return (
    <div className="w-full max-w-full ">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1870px] mx-auto px-2.5 sm:px-4 md:px-6 pb-24">


        <div className="block xl:hidden mb-4">
          <TodayStories />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 xl:grid-cols-8 gap-4">


          <div className="hidden md:flex md:col-span-5 xl:col-span-2 flex-col gap-4">
            <ShareThoughtCard />


            <div className="xl:hidden flex flex-col gap-4">
              <BreakingNews />
              <AITrendRadar />
              <TopCreators />
              <TrendingTopics />
              <TrendingHashtags />
              <ContentInspiration />
              <TodaysEvents />
              <SavedDrafts />
            </div>


            <div className="hidden xl:flex flex-col gap-4">
              <TodayStories />
              <TrendingTopics />
              <TrendingHashtags />
              <AITrendRadar />
              <BreakingNews />
              <ContentInspiration />
              <TodaysEvents />
              <SavedDrafts />
            </div>
          </div>


          <div className="col-span-1 md:col-span-7 xl:col-span-4 flex flex-col gap-4 w-full max-w-[680px] mx-auto">
            <div className="md:hidden w-full flex flex-col gap-4">
              <ShareThoughtCard />
            </div>
            <FeedPost />
          </div>

          <div className="hidden xl:flex xl:col-span-2 flex-col gap-4">
            <AICreatorStudio />
            <CreatorStats />
            <CreatorWallet />
            <AIContentWorkflow />
            <CampaignMarketplace />
            <UpcomingSchedule />
            <TopCreators />
          </div>

        </div>
      </div>
    </div>
  );
}

