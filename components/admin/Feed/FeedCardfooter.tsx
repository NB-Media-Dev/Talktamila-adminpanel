import { buttonVariants } from "@/components/ui/Button";
import { useContenthook } from "@/hooks/useContent";
import { Barcharticons, ClockIcons, HeartIcon, IndianrupeeIcons, LocationsIcons, MessageIcons, SavedIcons, SendIcon, SparkleIcons, TreadsIcon, TrendingIcons } from "@/public/Svgicons/svgicons";
import { useContext } from "react";

export interface Footercard {
    isViews?: string;
    isRevenue?: string;
    isAIScore?: string;
    isNextTime?: string;
    isLike?: string;
    isMessage?: string;
    isSend?: string;
    isSaved?: string;
}

export interface FeedCardfooterProps {
    PostAnalysis: Footercard;
}

export function FeedCardfooter({PostAnalysis}: FeedCardfooterProps){

      const context = useContext(useContenthook);
    const setAnalyticsState = context?.setAnalyticsState;
    return(
        <div>
             
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="flex items-center gap-2 bg-[#FFF6ED]  rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
                          <TrendingIcons/>
                          <div className="flex flex-col">
                            <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">{PostAnalysis.isViews}</span>
                            <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Views</span>
                          </div>
                        </div>
            
                        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
                          <IndianrupeeIcons />
                          <div className="flex flex-col">
                            <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">{PostAnalysis.isRevenue}</span>
                            <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Revenue</span>
                          </div>
                        </div>
            
                        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
                          <SparkleIcons />
                          <div className="flex flex-col">
                            <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">{PostAnalysis.isAIScore}</span>
                            <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">AI Score</span>
                          </div>
                        </div>
            
                        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
                          <ClockIcons />
                          <div className="flex flex-col">
                            <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">{PostAnalysis.isNextTime}</span>
                            <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Next Time</span>
                          </div>
                        </div>
                      </div>
            
                      <div className="flex items-center justify-between border-t border-[#FFEFE0] pt-4 mt-1">
                        <div className="flex items-center gap-2 sm:gap-3.5 text-[#8E8E93]">
                          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-red-500 transition-colors group cursor-pointer">
                            <HeartIcon/>
                            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">{PostAnalysis.isLike}</span>
                          </button>
                          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-blue-500 transition-colors group cursor-pointer">
                       <MessageIcons/>
                            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">{PostAnalysis.isMessage}</span>
                          </button>
                          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-green-500 transition-colors group cursor-pointer">
                           <SendIcon/>
                            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">{PostAnalysis.isSend}</span>
                          </button>
                          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-yellow-500 transition-colors group cursor-pointer">
                          <SavedIcons/>
                            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">{PostAnalysis.isSaved}</span>
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
                   
        </div>
    )
}