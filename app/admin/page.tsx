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
    <div className="@container w-full max-w-full">
      <div className="w-full max-w-[1440px] @7xl:max-w-[1870px] mx-auto px-2 @xs:px-3 @sm:px-4 @3xl:px-6 pb-24">
        <div className="hidden sm:block @6xl:hidden mb-4">
          <TodayStories />
        </div>

        <div className="grid grid-cols-1 @3xl:grid-cols-12 @6xl:grid-cols-8 gap-3 @xs:gap-4 @3xl:gap-6">
          <div className="hidden @3xl:flex @3xl:col-span-5 @6xl:col-span-2 flex-col gap-4">
            <ShareThoughtCard />

            <div className="@6xl:hidden flex flex-col gap-4">
              <BreakingNews />
              <AITrendRadar />
              <TopCreators />
              <TrendingTopics />
              <TrendingHashtags />
              <ContentInspiration />
              <TodaysEvents />
              <SavedDrafts />
            </div>

            <div className="hidden @6xl:flex flex-col gap-4">
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

          <div className="col-span-1 @3xl:col-span-7 @6xl:col-span-4 flex flex-col gap-4 w-full max-w-[680px] mx-auto">
          
            <div className="sm:hidden w-full flex gap-3 items-start relative">
              <div className="flex-1 min-w-0">
                <ShareThoughtCard />
              </div>
              <div className="relative w-[72px] shrink-0">
                <TodayStories />
              </div>
            </div>

           
            <div className="hidden sm:block @3xl:hidden w-full">
              <ShareThoughtCard />
            </div>

            <FeedPost />
          </div>

          <div className="hidden @6xl:flex @6xl:col-span-2 flex-col gap-4">
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

