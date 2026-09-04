"use client";



import { useState } from "react";
import { MessageSquare} from "lucide-react";
import avatar6 from "@/public/Images/avatar6.png";
import InfluencerPostAnalytics from "@/components/influencer/InfluencerPostAnalytics";
import { useAuthRole } from "@/hooks/useAuthRole";
import { FeedCardfooter } from "./FeedCardfooter";
import { FeedCardheader } from "./FeedCardheader";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { FeedPostSkeleton } from "@/components/ui/Skeletonloading";

interface FeedTextPostProps {
  isLoading?: boolean;
}

export default function FeedTextPost({ isLoading: propIsLoading }: FeedTextPostProps = {}) {
  const [isLoading, setIsLoading] = useState(propIsLoading ?? true);
  UsetimeoutLoader(setIsLoading);
  const { isInfluencer, isFreelancer } = useAuthRole();

  if (isLoading) {
    return <FeedPostSkeleton />;
  }
   const Fooderdetail={
      isViews:'1.2M',
    isRevenue:'18,250',
    isAIScore:'96/100',
    isNextTime:'8:32PM',
    isLike:'12.4K',
    isMessage:'3.20K',
    isSend:'5,810',
    isSaved:'12.4k',
  }
  return (
    <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-3.5 xs:p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-3.5 sm:gap-4">

      <FeedCardheader
        avatar={avatar6}
        name="News Tamila"
        username="@news_tamil"
        location="Chennai, India"
        time="12m"
        rightElement={
          <div className="text-[#E05D24] p-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
        }
      />

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
        <FeedCardfooter PostAnalysis={Fooderdetail}
       /> 
      )}
    </div>
  );
}

