"use client";

import Image from "next/image";
import avatar4 from "@/public/Images/avatar4.png";
import avatar5 from "@/public/Images/avatar5.png";
import avatar6 from "@/public/Images/avatar6.png";
import { buttonVariants } from "@/components/ui/Button";

export default function TopCreators() {
  const creators = [
    { name: "Mr. Vlogger", followers: "545K Followers", avatar: avatar4 },
    { name: "Indhu Vlogs", followers: "152K Followers", avatar: avatar5 },
    { name: "Chennai Paiyan", followers: "278K Followers", avatar: avatar6 },
    { name: "News TamilA", followers: "185K Followers", avatar: avatar4 },
    { name: "Tech Tamizhan", followers: "125K Followers", avatar: avatar5 },
  ];

  return (
    <div className="w-full lg:w-[350px] bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4 select-none">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B35] lg:hidden" />
          <h2 className="text-xs sm:text-sm lg:text-base font-extrabold lg:font-bold text-gray-900 tracking-wider lg:tracking-tight uppercase lg:normal-case">
            Top Creators
          </h2>
        </div>
        <button className="text-xs font-extrabold lg:font-bold text-gray-400 lg:text-[#FF5A26] hover:text-[#FF6B35] lg:hover:underline cursor-pointer">
          View All
        </button>
      </div>

      <div className="flex lg:hidden items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {creators.map((creator, idx) => (
          <div
            key={idx}
            className="w-[140px] sm:w-[150px] bg-white rounded-[24px] border border-[#FFEFE0] p-4 flex flex-col items-center text-center gap-3 shrink-0 shadow-xs"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#FFEFE0] relative shrink-0">
              <Image
                src={creator.avatar}
                alt={creator.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xs font-extrabold text-gray-900 truncate max-w-[110px]">
                {creator.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold">
                {creator.followers}
              </p>
            </div>
            <button className="w-full py-1.5 border border-[#FF6B35]/30 text-[#FF6B35] text-[10px] font-extrabold rounded-full hover:bg-[#FF6B35] hover:text-white transition-all cursor-pointer bg-white active:scale-95">
              Follow
            </button>
          </div>
        ))}
      </div>

      <div className="hidden lg:flex flex-col gap-3.5">
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
                <h3 className="text-xs  text-gray-900">
                  {creator.name}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {creator.followers}
                </p>
              </div>
            </div>
            <button className={`px-4 py-1.5 border border-[#FF5A26]/30 text-[#FF5A26] text-[10px] font-black rounded-full ${buttonVariants({ variant: 'hoverButton' })} transition-all cursor-pointer`}>
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
