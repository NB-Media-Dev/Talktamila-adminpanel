import Queue from "@/components/admin/Contentschedule/Queue";
import Calendar from "@/components/admin/Contentschedule/calendar";
import ActiveCampaigns from "@/components/admin/Contentschedule/rightsidecontentschedule/ActiveCampaigns";
import EstimatedRevenue from "@/components/admin/Contentschedule/rightsidecontentschedule/EstimatedRevenue";
import ActiveCollaboration from "@/components/admin/Contentschedule/rightsidecontentschedule/ActiveCollaboration";

export default function Page() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-9 w-full flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Content Schedule
          </h1>
          <p className="text-gray-600 mt-2 text-sm max-w-2xl leading-relaxed">
            Automate and manage your AI-driven content pipeline across all platforms from one place.
          </p>
          <Calendar />
        </div>

      </div>
      <div className=" lg:col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6 md:gap-6 lg:gap-8 w-full lg:mt-[78px]">
        
        <ActiveCampaigns />
        <EstimatedRevenue />
        <ActiveCollaboration />
      </div>
      <div className="lg:col-span-12 w-full">
        <Queue />
      </div> 
    </div>
  );
}

