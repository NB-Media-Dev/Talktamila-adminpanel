import { useContenthook } from "@/hooks/useContent";
import { Barcharticons, ClockIcons, HeartIcon, IndianrupeeIcons, MessageIcons, SavedIcons, SendIcon, SparkleIcons, TrendingIcons } from "@/public/Svgicons/svgicons";
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

    return (
        <div className="w-full select-none">
            <div className="grid grid-cols-2 gap-1.5 xs:gap-2 mt-1">
                <div className="flex items-center gap-1.5 xs:gap-2 bg-[#FFF6ED] rounded-full px-2.5 xs:px-3 py-1 xs:py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02] min-w-0">
                    <TrendingIcons/>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[0.625rem] xs:text-[0.6875rem] font-bold text-gray-900 leading-none truncate">{PostAnalysis.isViews}</span>
                        <span className="text-[0.45rem] xs:text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5 truncate">Views</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 xs:gap-2 bg-[#FFF6ED] rounded-full px-2.5 xs:px-3 py-1 xs:py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02] min-w-0">
                    <IndianrupeeIcons />
                    <div className="flex flex-col min-w-0">
                        <span className="text-[0.625rem] xs:text-[0.6875rem] font-bold text-gray-900 leading-none truncate">{PostAnalysis.isRevenue}</span>
                        <span className="text-[0.45rem] xs:text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5 truncate">Revenue</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 xs:gap-2 bg-[#FFF6ED] rounded-full px-2.5 xs:px-3 py-1 xs:py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02] min-w-0">
                    <SparkleIcons />
                    <div className="flex flex-col min-w-0">
                        <span className="text-[0.625rem] xs:text-[0.6875rem] font-bold text-gray-900 leading-none truncate">{PostAnalysis.isAIScore}</span>
                        <span className="text-[0.45rem] xs:text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5 truncate">AI Score</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 xs:gap-2 bg-[#FFF6ED] rounded-full px-2.5 xs:px-3 py-1 xs:py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02] min-w-0">
                    <ClockIcons />
                    <div className="flex flex-col min-w-0">
                        <span className="text-[0.625rem] xs:text-[0.6875rem] font-bold text-gray-900 leading-none truncate">{PostAnalysis.isNextTime}</span>
                        <span className="text-[0.45rem] xs:text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5 truncate">Next Time</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[#FFEFE0] pt-3 sm:pt-4 mt-2 sm:mt-1">
                <div className="flex items-center gap-2 xs:gap-3 sm:gap-3.5 text-[#8E8E93] shrink-0">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors group cursor-pointer shrink-0">
                        <HeartIcon/>
                        <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">{PostAnalysis.isLike}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors group cursor-pointer shrink-0">
                        <MessageIcons/>
                        <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">{PostAnalysis.isMessage}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition-colors group cursor-pointer shrink-0" title="Share">
                        <SendIcon/>
                        <span className="hidden xs:inline text-[0.625rem] sm:text-[0.6875rem] font-semibold">{PostAnalysis.isSend}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-yellow-500 transition-colors group cursor-pointer shrink-0" title="Save">
                        <SavedIcons/>
                        <span className="hidden sm:inline text-[0.625rem] sm:text-[0.6875rem] font-semibold">{PostAnalysis.isSaved}</span>
                    </button>
                </div>

                <button
                    onClick={() => setAnalyticsState?.(true)}
                    className="flex items-center gap-1 sm:gap-1.5 border border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white rounded-full px-0.6 py-1 sm:px-3.5 sm:py-1.5 text-[0.625rem] sm:text-[0.6875rem] font-bold shadow-[0_2px_8px_rgba(255,107,53,0.1)] active:scale-95 shrink-0 whitespace-nowrap transition-colors cursor-pointer"
                >
                    <Barcharticons/>
                    <span>Analytics</span>
                </button>
            </div>
        </div>
    );
}