"use client";

import { buttonVariants } from "@/components/ui/Button";
import { ContentSkeleton } from "@/components/ui/Skeletonloading";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { Briefcase } from "lucide-react";
import { useState } from "react";

export default function CampaignMarketplace() {

     const [isLoading, setIsLoading] = useState(true);

  
 UsetimeoutLoader(setIsLoading)
  const campaigns = [
    {
      id:1,
      brand: "Swiggy",
      details: "2 Reels - Tamil - Due 5 Aug",
      price: "₹85,000",
    },
    {
      id:2,
      brand: "Samsung",
      details: "Unboxing Short - Due 12 Aug",
      price: "₹1,40,000",
    },
    {
      id:3,
      brand: "Netflix",
      details: "Review Carousel - Due 18 Aug",
      price: "₹95,000",
    },
  ];

  return (
    <div className="@container w-full max-w-full bg-white rounded-[32px] p-4 @xs:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4 select-none">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#FF5A26]" />
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Campaign Marketplace
          </h2>
        </div>
        <button className="text-xs font-bold text-[#FF5A26] hover:underline cursor-pointer">
          All
        </button>
      </div>
    {isLoading ? <ContentSkeleton/> : <div className="flex flex-col gap-3.5">
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-[#FFF9F5] border border-[#FFEFE0] rounded-[24px] p-4 flex justify-between items-start">
            <div className="flex flex-col gap-2.5">
              <div>
                <h3 className="text-xs text-gray-900">{camp.brand}</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">{camp.details}</p>
              </div>
              <button className={`px-5 py-1 border border-[#FF5A26] text-[#FF5A26] text-[10px] font-black rounded-full ${buttonVariants({ variant: 'hoverButton' })}`}>
                Apply
              </button>
            </div>
            <span className="text-xs font-black text-[#FF5A26] pt-0.5">{camp.price}</span>
          </div>
        ))}
      </div> }
     
    </div>
  );
}
