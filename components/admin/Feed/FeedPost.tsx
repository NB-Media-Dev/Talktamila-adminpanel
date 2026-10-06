"use client";

import FeedTextPost from "./FeedTextPost";
import FeedImagePost from "./FeedImagePost";
import FeedVideoPost from "./FeedVideoPost";
import FeedPollPost from "./FeedPollPost";
import TopCreators from "../RightPanel/TopCreators";
import BreakingNews from "../dashboard/BreakingNews";
import TodaysEvents from "../dashboard/TodaysEvents";

/**
 * The sample feed (hard-coded posts). Posts the user writes in the "Share Your Thoughts" card
 * stay in that card and are not added here. The three small widgets show only on mobile.
 */
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