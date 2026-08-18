"use client";

import React from "react";
import Image from "next/image";
import avatar4 from "@/public/Images/avatar4.png";
import avatar5 from "@/public/Images/avatar5.png";
import avatar6 from "@/public/Images/avatar6.png";

export default function TopCreators() {
  const creators = [
    { name: "Mr Vlogger", followers: "345K Followers", avatar: avatar4 },
    { name: "Indhu Vlogs", followers: "162K Followers", avatar: avatar5 },
    { name: "Chennai Paiyan", followers: "278K Followers", avatar: avatar6 },
    { name: "News TamilA", followers: "185K Followers", avatar: avatar4 },
    { name: "Tech Tamizhan", followers: "125K Followers", avatar: avatar5 },
  ];

  return (
    <div className="w-[350px] bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Top Creators
        </h2>
        <button className="text-xs font-bold text-[#FF5A26] hover:underline cursor-pointer">
          View All
        </button>
      </div>

      {/* Creators List */}
      <div className="flex flex-col gap-3.5">
        {creators.map((creator, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FFEFE0] relative shrink-0">
                <Image
                  src={creator.avatar}
                  alt={creator.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900">
                  {creator.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  {creator.followers}
                </p>
              </div>
            </div>
            <button className="px-4 py-1.5 border border-[#FF5A26]/30 text-[#FF5A26] text-[10px] font-black rounded-full hover:bg-[#FF5A26] hover:text-white transition-all cursor-pointer">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
