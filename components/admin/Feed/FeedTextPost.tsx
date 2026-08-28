"use client";

import { useContext } from "react";
import { useContenthook } from "@/hooks/useContent";
import Image from "next/image";
import { MessageSquare} from "lucide-react";
import avatar6 from "@/public/Images/avatar6.png";
import { buttonVariants } from "@/components/ui/Button";
import InfluencerPostAnalytics from "@/components/influencer/InfluencerPostAnalytics";
import { useAuthRole } from "@/hooks/useAuthRole";
import { Barcharticons, ClockIcons, HeartIcon, IndianrupeeIcons, LocationsIcons, MessageIcons, SavedIcons, SendIcon, SparkleIcons, TrendingIcons } from "@/public/Svgicons/svgicons";


export default function FeedTextPost() {
  const context = useContext(useContenthook);
  const setAnalyticsState = context?.setAnalyticsState;
  const { isInfluencer, isFreelancer } = useAuthRole();

  return (
    <div className="w-full bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full overflow-hidden relative border border-[#FFEFE0] bg-gray-50 shrink-0">
            <Image
              src={avatar6}
              alt="News Tamila Avatar"
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-gray-900 leading-none">News Tamila</span>

              <span className="text-[#8E8E93] text-xs font-normal">@news_tamil</span>
            </div>
            <div className="flex items-center gap-1 text-[#8E8E93] mt-0.5">
              <LocationsIcons/>
              <span className="text-[0.6875rem]">Chennai, India</span>
              <span className="text-[0.6875rem]">•</span>
              <span className="text-[0.6875rem]">12m</span>
            </div>
          </div>
        </div>

        <div className="text-[#E05D24] p-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors">
          <MessageSquare className="w-5 h-5 fill-current" />
        </div>
      </div>

      <div className="bg-[#FFFDFB] rounded-[20px] p-4.5 border border-[#FFEFE0] text-[0.84375rem] text-gray-800 leading-relaxed font-normal shadow-inner">
        சென்னை கடற்கரை சாலையில் புதிய மெட்ரோ வழித்தடப் பணிகள் வெற்றிகரமாக துவங்கப்பட்டுள்ளது. இதனால் போக்குவரத்து மாற்றங்கள் செய்யப்பட்டுள்ளது. பொதுமக்கள் ஒத்துழைக்குமாறு கேட்டுக்கொள்ளப்படுகிறது!
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[#FF6B35] font-semibold cursor-pointer">#Chennai</span>
          <span className="text-[#FF6B35] font-semibold cursor-pointer">#MetroUpdate</span>
          <span className="text-[#FF6B35] font-semibold cursor-pointer">#TrafficUpdate</span>
          <span className="text-[#FF6B35] font-semibold cursor-pointer">#TamilNews</span>
        </div>
      </div>

      {isInfluencer || isFreelancer ? (
        <InfluencerPostAnalytics
          igReach="15.1K"
          fbReach="9.4K"
          ytReach="3.8K"
          threadsReach="6.2K"
          earnedAmount="₹15,420"
          views="42.0K"
          likes="2.8K"
          comments="450"
          shares="1.2K"
          saves="1.8K"
          aiPerformanceScore="88"
          aiPerformanceLabel="Good"
          bestTime="Today, 8:00 PM"
          expectedReach="100K – 150K"
          trendingProb="High"
          seoScore="86"
          qualityScore="90"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
              <TrendingIcons/>
              <div className="flex flex-col">
                <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">1.1M</span>
                <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Views</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
              <IndianrupeeIcons />
              <div className="flex flex-col">
                <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">₹15,420</span>
                <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Revenue</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
              <SparkleIcons/>
              <div className="flex flex-col">
                <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">88/100</span>
                <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">AI Score</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
              <ClockIcons/>
              <div className="flex flex-col">
                <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">1:30 PM</span>
                <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Best Time</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#FFEFE0] pt-4 mt-1">
            <div className="flex items-center gap-2 sm:gap-3.5 text-[#8E8E93]">
              <button className="flex items-center gap-0.5 sm:gap-1 hover:text-red-500 transition-colors group cursor-pointer">
                <HeartIcon/>
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">42K</span>
              </button>
              <button className="flex items-center gap-0.5 sm:gap-1 hover:text-blue-500 transition-colors group cursor-pointer">
                <MessageIcons/>
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">2.8K</span>
              </button>
              <button className="flex items-center gap-0.5 sm:gap-1 hover:text-green-500 transition-colors group cursor-pointer">
                <SendIcon/>
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">450</span>
              </button>
              <button className="flex items-center gap-0.5 sm:gap-1 hover:text-yellow-500 transition-colors group cursor-pointer">
                <SavedIcons/>
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">1.8K</span>
              </button>
            </div>

            <button
              onClick={() => setAnalyticsState && setAnalyticsState(true)}
              className={`flex items-center gap-1.5 border border-[#FF6B35] text-[#FF6B35] rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[0.625rem] sm:text-[0.6875rem] font-bold ${buttonVariants({ variant: 'hoverButton' })} shadow-[0_2px_8px_rgba(255,107,53,0.1)] active:scale-95 shrink-0`}
            >
              <Barcharticons/>
              Analytics
            </button>
          </div>
        </>
      )}
    </div>
  );
}

