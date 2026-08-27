import ApprovedContent from "@/components/freelancer/ApprovedContent";


import RepostContent from "@/components/freelancer/Reposts/Repostcontent";
import Announcement from "@/components/freelancer/insights/announcements";
import MyCampaign from "@/components/freelancer/insights/mycampaign";
import Todaytask from "@/components/freelancer/insights/todaytasks";
import TrendingRepost from "@/components/freelancer/insights/trendingrepost";
import VerifiedReposter from "@/components/freelancer/insights/verifiedreposter";

export default function ContentPage() {
  return (
    <div className="w-full min-h-screen px-2.5 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
       
        <div className="lg:col-span-7 xl:col-span-8 w-full flex flex-col gap-6">
          <ApprovedContent />
          <RepostContent maxRows={2} />
        </div>

      
        <div className="lg:col-span-5 xl:col-span-4 w-full flex flex-col gap-5 mt-10">
          <VerifiedReposter />
          <MyCampaign />
          <TrendingRepost />
          <Todaytask />
          <Announcement />
        </div>
      </div>
    </div>
  );
}
