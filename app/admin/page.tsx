"use client"
import React, { useContext, useState } from "react";
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
import { CreatenewPost } from "@/components/admin/dashboard/CreatenewPost";
import { Adminreviewpanel } from "@/components/admin/dashboard/Adminreviewpanel";
import { Performanceacrossplatform } from "@/components/admin/dashboard/Performanceacrossplatform";
import { useContenthook } from "@/hooks/useContent";


export default function AdminPage() {

  const[dailog,setDailog]=useState(true)

   const context = useContext(useContenthook);

     if (!context) {
    throw new Error("BottomNavigation must be used within a UseContentProvider");
     }
  const { handlestate, setHandlestate, activeTab, analyticsState } = context;

  return (
    <div>
    <div className="w-full max-w-[1440px] 2xl:max-w-[1870px] mx-auto grid grid-cols-1 lg:grid-cols-8 gap-4 px-4 md:px-6 pb-24">

      <div className="hidden lg:flex lg:col-span-2 flex-col gap-4">
       <ShareThoughtCard />   
        <TodayStories />
        <TrendingTopics />
        <TrendingHashtags />
        <AITrendRadar />
        <BreakingNews />
        <ContentInspiration />
        <TodaysEvents />
        <SavedDrafts />
      </div>


      <div className="col-span-1 lg:col-span-4 flex flex-col gap-4 w-full max-w-[550px] mx-auto">
        <div className="lg:hidden w-full">
          <TodayStories />
        </div>
        <FeedPost />
      </div>


      <div className="hidden lg:flex lg:col-span-2 flex-col gap-4">
        <AICreatorStudio />
        <CreatorStats />
        <CreatorWallet />
        <AIContentWorkflow />
        <CampaignMarketplace />
        <UpcomingSchedule />
        <TopCreators />
      </div>
    
    </div>
   {handlestate && (
            <div className="p-2">
              <CreatenewPost />
            </div>

      )}
      
   {activeTab === 'wallet' && (
            <div className="p-2">
              <Adminreviewpanel />
            </div>
      )}

   {analyticsState && (
            <div className="p-2">
              <Performanceacrossplatform />
            </div>
      )}
     
</div>
  );
}

