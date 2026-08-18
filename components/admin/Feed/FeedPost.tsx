"use client";


import FeedImagePost from "./FeedImagePost";
import FeedVideoPost from "./FeedVideoPost";
import FeedTextPost from "./FeedTextPost";
import FeedPollPost from "./FeedPollPost";

export default function FeedPost() {
  return (
    <div className="w-full max-w-[550px] gap-6 mx-auto flex flex-col select-none">

      <FeedImagePost />
      <FeedVideoPost />
      <FeedTextPost />
      <FeedPollPost />
    </div>
  );
}

//