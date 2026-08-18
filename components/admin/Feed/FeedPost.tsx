"use client";


import FeedImagePost from "./FeedImagePost";
import FeedVideoPost from "./FeedVideoPost";
import FeedTextPost from "./FeedTextPost";
import FeedPollPost from "./FeedPollPost";
import TopCreators from "../RightPanel/TopCreators";
import BreakingNews from "../dashboard/BreakingNews";
import TodaysEvents from "../dashboard/TodaysEvents";

export default function FeedPost() {
  return (
    <div className="w-full max-w-[550px] gap-6 mx-auto flex flex-col select-none">

      <FeedImagePost />
      <div className="lg:hidden w-full">
        <BreakingNews />
      </div>
      
      <FeedVideoPost />
      <div className="lg:hidden w-full">
        <TopCreators />
      </div>
      
      <FeedTextPost />
      <div className="lg:hidden w-full">
        <TodaysEvents />
      </div>
      
      <FeedPollPost />
    </div>
  );
}

//