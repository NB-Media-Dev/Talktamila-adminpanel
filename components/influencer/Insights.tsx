"use client";

import  { useState } from "react";
import { buttonVariants } from "../ui/Button";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useRouter } from "next/navigation";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { MetricsSkeleton } from "../ui/Skeletonloading";



interface InsightsProps {
  totalEarnings?: string;
  reposts?: string | number;
  repScore?: string;
}

export default function Insights({ totalEarnings = "₹86,200", reposts = "124", repScore = "92/100", }: InsightsProps) {

  const { isInfluencer } = useAuthRole()
  const router = useRouter();
   const [isLoading, setIsLoading] = useState( true);
  UsetimeoutLoader(setIsLoading);


  return (
    <div>
      {isInfluencer ? <div>
        
        <button className={`w-full py-2 px-3 rounded-2xl shadow-[0_4px_14px_rgba(240,90,36,0.3)] transition-all duration-200 hover:brightness-105 cursor-pointer ${buttonVariants({ variant: "default" })} text-xl sm:text-2xl font-semibold tracking-wide`} onClick={() => router.push("/influencer/analytics")}>
          Insights
        </button>
      </div>
        :
        <div className="w-full  max-w-full select-none flex flex-col gap-3 font-sans">
          <button
            className={`w-full ${buttonVariants({ variant: "default" })} py-3 px-6 rounded-2xl shadow-[0_4px_14px_rgba(240,90,36,0.3)] transition-all duration-200 hover:brightness-105 cursor-pointer`}
            onClick={() => router.push("/freelancer/content")}>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-wide">
              Insights
            </h2>
          </button >
          {isLoading ? <MetricsSkeleton count={3} columns={3} className="grid-cols-3 sm:grid-cols-3 md:grid-cols-3" /> : <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full ">
            <div className="bg-white rounded-xl p-2.5 sm:p-3 text-center border border-gray-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col justify-center items-center">
              <span className="text-[11px] sm:text-[12px] font-normal text-[#6E6E73] leading-tight block mb-1">
                Total Earnings
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#1C1C1E] tracking-tight">
                {totalEarnings}
              </span>
            </div>

            <div className="bg-white rounded-xl p-2.5 sm:p-3 text-center border border-gray-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col justify-center items-center">
              <span className="text-[11px] sm:text-[12px] font-normal text-[#6E6E73] leading-tight block mb-1">
                Reposts
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#1C1C1E] tracking-tight">
                {reposts}
              </span>
            </div>

            <div className="bg-white rounded-xl p-2.5 sm:p-3 text-center border border-gray-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col justify-center items-center">
              <span className="text-[11px] sm:text-[12px] font-normal text-[#6E6E73] leading-tight block mb-1">
                Rep Score
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#B2461D] tracking-tight">
                {repScore}
              </span>
            </div>
          </div>}
          
        </div>}
    </div>
  );
}


