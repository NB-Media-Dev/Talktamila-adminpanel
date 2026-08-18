"use client"
import { useContext } from "react";
import { X } from "lucide-react";
import { useContenthook } from "@/hooks/useContent";

export function Performanceacrossplatform() {
  const context = useContext(useContenthook);

  if (!context) {
    throw new Error("Performanceacrossplatform must be used within a UseContentProvider");
  }
  const { setAnalyticsState } = context;

  const handleClose = () => {
    setAnalyticsState(false);
  };

  const metrics = [
    { label: "CTR", value: "7.8%" },
    { label: "Watch Time", value: "2m 41s" },
    { label: "Retention", value: "62%" },
    { label: "SEO Score", value: "88" },
    { label: "Sentiment", value: "Positive" },
    { label: "Trending Score", value: "94" },
  ];

  const platforms = [
    { name: "Instagram", reach: "482K", growth: "8.4%", percentage: 90 },
    { name: "YouTube", reach: "356K", growth: "6.1%", percentage: 75 },
    { name: "Facebook", reach: "214K", growth: "4.9%", percentage: 65 },
    { name: "Threads", reach: "128K", growth: "5.6%", percentage: 55 },
    { name: "X", reach: "96K", growth: "3.2%", percentage: 45 },
    { name: "Telegram", reach: "74K", growth: "9.1%", percentage: 35 },
    { name: "WhatsApp", reach: "58K", growth: "11.3%", percentage: 25 },
    { name: "LinkedIn", reach: "31K", growth: "2.7%", percentage: 18 },
    { name: "Pinterest", reach: "22K", growth: "3.8%", percentage: 12 },
  ];

  const ages = [
    { range: "18-24", percentage: 34 },
    { range: "25-34", percentage: 41 },
    { range: "35-44", percentage: 17 },
    { range: "45+", percentage: 8 },
  ];

  const audienceMix = [
    { label: "Country", value: "India 82% - Sri Lanka 9%" },
    { label: "Language", value: "Tamil 91% - English 9%" },
    { label: "Gender", value: "M 54% - F 46%" },
    { label: "Best time", value: "9:00 PM" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-0 md:p-4 md:pb-24 z-40">
      <div className="w-full h-full md:h-[560px] md:max-w-[820px] rounded-none md:rounded-[28px] bg-white shadow-2xl relative font-sans antialiased border-0 md:border border-orange-100 flex flex-col overflow-hidden">
        
     
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-5 pb-6 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] md:pt-5 relative shrink-0">
   
          <button
            onClick={handleClose}
            className="absolute right-5 top-[calc(1.25rem+env(safe-area-inset-top,0px))] md:top-5 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white shadow-sm transition-all duration-200 cursor-pointer"
          >
            <X size={14} className="stroke-[3]" />
          </button>
          
          <h1 className="text-lg font-bold tracking-tight">Performance across platforms</h1>
          <p className="text-xs text-orange-50 font-medium mt-1">
            மதுரை இரவு உணவுத் தெரு – 5 இடங்கள், ஒரே ரீல்!
          </p>
        </div>

   
        <div className="flex-1 overflow-y-auto p-5 pt-4 pb-28 md:pb-5 flex flex-col gap-4.5 bg-[#FCFAF7]">
       
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-[#FFF6ED] border border-[#FFEFE0] rounded-xl p-2.5 flex flex-col shadow-2xs hover:scale-[1.01] transition-transform"
              >
                <span className="text-[9px] text-[#A67C52] font-extrabold tracking-wider uppercase leading-none">
                  {m.label}
                </span>
                <span className="text-sm font-extrabold text-gray-800 mt-1 leading-none">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-[9px] text-gray-400 font-extrabold tracking-wider uppercase mb-2">
              Platform Comparison
            </h3>
            <div className="flex flex-col gap-2.5">
              {platforms.map((p, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-gray-700 w-16 shrink-0 leading-none">
                    {p.name}
                  </span>
                  
          
                  <div className="flex-1 h-2 bg-[#FFF6ED] rounded-full overflow-hidden border border-[#FFEFE0] shrink-0">
                    <div
                      style={{ width: `${p.percentage}%` }}
                      className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-full h-full"
                    ></div>
                  </div>
                  
                  <span className="text-[10px] font-bold text-gray-400 w-10 text-right shrink-0 leading-none">
                    {p.reach}
                  </span>
                  <span className="text-[11px] font-extrabold text-orange-600 w-10 text-right shrink-0 leading-none">
                    {p.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>

      
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-t border-orange-100/50 pt-4">

            <div>
              <h3 className="text-[9px] text-gray-400 font-extrabold tracking-wider uppercase mb-2.5">
                Audience Age
              </h3>
              <div className="flex flex-col gap-2">
                {ages.map((a, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-600 w-10 shrink-0 leading-none">
                      {a.range}
                    </span>
                    
           
                    <div className="flex-1 h-1.5 bg-[#FFF6ED] rounded-full overflow-hidden border border-[#FFEFE0]">
                      <div
                        style={{ width: `${a.percentage}%` }}
                        className="bg-orange-500 rounded-full h-full"
                      ></div>
                    </div>
                    
                    <span className="text-[10px] font-extrabold text-gray-700 w-7 text-right shrink-0 leading-none">
                      {a.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

               <div>
              <h3 className="text-[9px] text-gray-400 font-extrabold tracking-wider uppercase mb-2.5">
                Audience Mix
              </h3>
              <div className="flex flex-col gap-2">
                {audienceMix.map((mix, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] leading-none">
                    <span className="font-bold text-gray-400">
                      {mix.label}
                    </span>
                    <span className="font-extrabold text-gray-700 text-right">
                      {mix.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

