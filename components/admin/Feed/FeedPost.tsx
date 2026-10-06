"use client";

import FeedTextPost from "./FeedTextPost";
import FeedImagePost from "./FeedImagePost";
import FeedVideoPost from "./FeedVideoPost";
import FeedPollPost from "./FeedPollPost";
import TopCreators from "../RightPanel/TopCreators";
import BreakingNews from "../dashboard/BreakingNews";
import TodaysEvents from "../dashboard/TodaysEvents";

// hard-coded sample feed
export default function FeedPost() {
  return (
    <div className="w-full gap-6 flex flex-col select-none">
      <FeedTextPost />

      <div className="md:hidden w-full">
        <BreakingNews />
      </div>

      <FeedImagePost />

      <div className="md:hidden w-full">
        <TopCreators />
      </div>

      <FeedVideoPost />

      <div className="md:hidden w-full">
        <TodaysEvents />
      </div>

      <FeedPollPost />
    </div>
  );
}