import Queue from "@/components/admin/Contentschedule/Queue";
import Calendar from "@/components/admin/Contentschedule/calendar";
import ActiveCampaigns from "@/components/admin/Contentschedule/rightsidecontentschedule/ActiveCampaigns";
import EstimatedRevenue from "@/components/admin/Contentschedule/rightsidecontentschedule/EstimatedRevenue";
import ActiveCollaboration from "@/components/admin/Contentschedule/rightsidecontentschedule/ActiveCollaboration";

export default function Page() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 select-none">
      
    
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Content Schedule
        </h1>
        <p className="text-gray-500 mt-1.5 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
          Automate and manage your AI-driven content pipeline across all platforms from one place.
        </p>
      </div>

    
      <div className="block md:hidden flex flex-col gap-5 w-full">
       
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
          <ActiveCampaigns />
          <EstimatedRevenue />
        </div>

        
        <Calendar />

      
        <button
          type="button"
          className="bg-[#F27D42] hover:bg-[#E35420] active:scale-95 text-white font-extrabold text-sm sm:text-base py-3 sm:py-3.5 px-10 rounded-full shadow-md transition-all cursor-pointer w-full max-w-xs mx-auto block text-center my-2"
        >
          Publish
        </button>
        <Queue />
      </div>

     
      <div className="hidden md:grid grid-cols-12 gap-5 sm:gap-6 items-start w-full">
        <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9 flex flex-col gap-5 sm:gap-6 w-full">
          <Calendar />
        </div>

        <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 flex flex-col gap-5 sm:gap-6 w-full">
          <ActiveCampaigns />
          <EstimatedRevenue />
          <ActiveCollaboration />
        </div>

        <div className="col-span-12 w-full">
          <Queue />
        </div>
      </div>

    </div>
  );
}

