"use client";

import FeedImagePost from "./FeedImagePost";
import FeedVideoPost from "./FeedVideoPost";
import FeedTextPost from "./FeedTextPost";
import FeedPollPost from "./FeedPollPost";
import TopCreators from "../RightPanel/TopCreators";
import BreakingNews from "../dashboard/BreakingNews";
import TodaysEvents from "../dashboard/TodaysEvents";

interface FeedPostProps {
  isInfluencer?: boolean;
}

export default function FeedPost({ isInfluencer }: FeedPostProps = {}) {
  return (
    <div className="w-full max-w-[680px] gap-6 mx-auto flex flex-col select-none">

      <FeedImagePost isInfluencer={isInfluencer} />
      <div className="md:hidden w-full">
        <BreakingNews />
      </div>

      <FeedVideoPost isInfluencer={isInfluencer} />
      <div className="md:hidden w-full">
        <TopCreators />
      </div>

      <FeedTextPost isInfluencer={isInfluencer} />
      <div className="md:hidden w-full">
        <TodaysEvents isInfluencer={isInfluencer} />
      </div>

      <FeedPollPost isInfluencer={isInfluencer} />
    </div>
  );
}
