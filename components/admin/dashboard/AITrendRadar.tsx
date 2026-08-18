"use client";


import { Radar } from "lucide-react";

interface TrendItem {
  id: number;
  title: string;
  score: number;
  status: string;
}

export default function AITrendRadar() {
  const trends: TrendItem[] = [
    { id: 1, title: "Metro Phase II", score: 94, status: "Peaks in 3h" },
    { id: 2, title: "Pongal Campaigns", score: 87, status: "Peaks in 2d" },
    { id: 3, title: "AI in Tamil", score: 79, status: "Rising" },
  ];

  return (
    <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
    
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-[#FFF2EC] text-[#FF5A26]">
          <Radar className="w-5 h-5 animate-pulse" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          AI Trend Radar
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {trends.map((item) => (
          <div key={item.id} className="flex flex-col group">
          
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm  text-gray-800 group-hover:text-[#FF5A26] transition-colors duration-200">
                {item.title}
              </span>
              <span className="text-sm  text-[#FF5A26]">
                {item.score}
              </span>
            </div>

       
            <div className="w-full h-2 bg-[#FFF6F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FFA07A] to-[#FF5A26] rounded-full transition-all duration-500 ease-out group-hover:brightness-105"
                style={{ width: `${item.score}%` }}
              />
            </div>

            <span className="text-xs text-gray-400 mt-1 font-medium pl-0.5">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
