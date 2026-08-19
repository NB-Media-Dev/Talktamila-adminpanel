"use client";

import { Calendar } from "lucide-react";

export default function UpcomingSchedule() {
  const events = [
    {
      time: "09:30",
      title: "Morning news drop",
      platform: "TalkTamila - Instagram",
    },
    {
      time: "13:00",
      title: "Metro explainer reel",
      platform: "YouTube - Threads",
    },
    {
      time: "19:45",
      title: "Live Q&A",
      platform: "TalkTamila Live",
    },
  ];

  return (
    <div className="w-[350px] bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4 select-none">
    
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#FF5A26]" />
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Upcoming Schedule
        </h2>
      </div>

      <div className="flex flex-col gap-4.5 py-1">
        {events.map((event, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <span className="text-xs font-black text-[#FF5A26] min-w-[42px]">
              {event.time}
            </span>
            <div className="flex-grow">
              <h3 className="text-xs font-black text-gray-900">
                {event.title}
              </h3>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                {event.platform}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
