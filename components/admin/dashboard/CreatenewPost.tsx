
"use client"
import { useContext, useState } from "react";
import { Sparkle, UploadCloud, X, MoreHorizontal } from "lucide-react";
import { useContenthook } from "@/hooks/useContent";
import { buttonVariants } from "@/components/ui/Button";


const platformList = [
  { id: "Talk Tamila", name: "Talk Tamila" },
  { id: "Instagram", name: "Instagram" },
  { id: "Facebook", name: "Facebook" },
  { id: "YouTube", name: "YouTube" },
  { id: "Threads", name: "Threads" },
  { id: "X", name: "X" },
];

export function CreatenewPost() {

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "Talk Tamila",
    "Instagram",
    "Facebook",
  ]);

  const context = useContext(useContenthook);
 
      if (!context) {
     throw new Error("BottomNavigation must be used within a UseContentProvider");
   }
   const{handlestate, setHandlestate}=context
 
   const handlepostcard=()=>{
     setHandlestate(!handlestate)
   }

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("Write your thoughts here... Use #hashtags to trend!");

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((item) => item !== platformId)
        : [...prev, platformId]
    );
  };

  return (

  <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-0 md:p-4 z-40">
      <div className="w-full h-full md:h-auto md:max-h-[85vh] md:max-w-4xl rounded-none md:rounded-[28px] bg-[#fff0e7] shadow-2xl px-4 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-28 md:px-5 md:py-5 relative font-sans antialiased border-0 md:border border-orange-100 overflow-y-auto">
        

        <button 
          onClick={()=>{handlepostcard()}}
          className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top,0px))] md:top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-all duration-200 cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start mt-1">

          <div className="flex flex-col gap-2.5">
            

            <div>
              <h1 className="text-lg font-bold text-[#9b4811] tracking-tight">Create New Post</h1>
              <p className="mt-0.5 text-xs text-orange-900/60 font-medium">
                Share your thoughts or AI-generated content with the Tamil community.
              </p>
            </div>


            <div className="flex flex-col gap-3">
              

              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-800">Post Details</h2>
                <button className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer">
                  <Sparkle size={12} className="fill-orange-600" />
                  Generate Caption
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600">Title / Headline</label>
                <input
                  type="text"
                  placeholder="Enter an eye-catching title..."
                  className="w-full h-9 px-3 rounded-xl bg-white border border-transparent outline-none text-xs transition-all shadow-sm focus:border-[#ef8b54] placeholder:text-gray-400 text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-600">Description / Caption</label>
                <textarea
                  rows={2}
               placeholder="Write your thoughts here... Use #hashtags to trend!"
                  className="w-full p-3 rounded-xl bg-white border border-transparent outline-none text-xs resize-none transition-all shadow-sm focus:border-[#ef8b54] placeholder:text-gray-400 text-gray-800 leading-relaxed"
                />
              </div>
            </div>


            <div className="border-2 border-dashed border-orange-200 bg-white rounded-2xl p-3 text-center flex flex-col items-center justify-center gap-1.5 shadow-sm transition-colors hover:border-orange-300">
              <div className="p-0.5 bg-[#fff0e7] rounded-full text-[#ef8b54]">
                <UploadCloud size={18} />
              </div>
              <p className="text-xs font-bold text-gray-800">Drag and drop files here</p>
              <p className="text-[10px] text-gray-400 max-w-[280px]">Support for PNG, JPG, MP4, and MOV (Max 50MB)</p>
              <button className="mt-1 px-5 py-1.5 bg-[#ef8b54] text-white text-[10px] font-bold rounded-xl hover:bg-[#d9723a] transition-all shadow-md active:scale-95 cursor-pointer">
                Browse Files
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
              {platformList.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`py-1.5 px-2 px-3 text-[11px] font-bold rounded-full border text-center transition-all duration-200 shadow-sm cursor-pointer ${
                      isSelected
                        ? `${buttonVariants({variant:'default'})} border-transparent transform scale-[1.02] shadow-orange-500/20`
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {platform.name}
                  </button>
                );
              })}
            </div>
          </div>


          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-extrabold text-gray-800 tracking-wide uppercase">Live Preview</h3>
            
              <div className="border-[6px] border-white rounded-2xl">
                
            <div className="bg-white p-1.5 shadow-xl border-[3px] border-gray-100 flex flex-col gap-2 rounded-xl">
              
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[10px] shadow-sm">
                    Y
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-gray-900 flex items-center gap-1 leading-none">
                      Your Business Name <span className="text-[8px] text-blue-500">✔</span>
                    </h4>
                    <span className="text-[8px] text-gray-400 block mt-0.5 font-medium">Sponsored · 🌐</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  <MoreHorizontal size={14} />
                </button>
              </div>

       
              <p className="text-[10px] text-gray-700 px-1 font-normal line-clamp-3 leading-relaxed whitespace-pre-wrap">
                {caption || "Your ad caption here..."}
              </p>

     
              <div className="relative aspect-[6/3] w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center group shadow-inner">
                <img 
                  src="https://unsplash.com" 
                  alt="Live Streaming Simulated Broadcast Frame" 
                  className="w-full h-full object-cover opacity-75"
                />
                
   
                <div className="absolute inset-0 flex items-end justify-center pb-6 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                  <p className="text-white text-[10px] font-semibold tracking-wide text-center px-4 leading-snug drop-shadow-md">
                    it can be really easy to over indulge.
                  </p>
                </div>
                 <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between z-10 w-[calc(100%-1rem)] text-[9px] text-gray-300 px-1">
          <div className="flex items-center gap-1.5">
            <span className="cursor-pointer">▶</span>
            <span>0:00 / 0:54</span>
          </div>
          <div className="flex items-center gap-1 opacity-90 cursor-pointer">
            <span>🔊</span> <span>⚙️</span> <span>⛶</span>
          </div>
        </div>
      </div>

      <div className="px-1 py-0.5 flex justify-between items-center border-b border-gray-100 text-[9px] text-gray-400 font-medium">
        <div className="flex items-center gap-1">
          <span>👍❤️</span> <span>23</span>
        </div>
        <div>1 comment</div>
      </div>


      <div className="px-1 py-0.5 flex items-center justify-around border-b border-gray-100 text-[9px] text-gray-500 font-bold">
        <button type="button" className="flex items-center gap-1 hover:bg-gray-50 px-1.5 py-0.5 rounded cursor-pointer">👍 Like</button>
        <button type="button" className="flex items-center gap-1 hover:bg-gray-50 px-1.5 py-0.5 rounded cursor-pointer">💬 Comment</button>
        <button type="button" className="flex items-center gap-1 hover:bg-gray-50 px-1.5 py-0.5 rounded cursor-pointer">↪ Share</button>
      </div>


      <div className="p-2 bg-gray-50 rounded-xl flex justify-between items-center mt-0.5">
        <div className="overflow-hidden pr-2">
          <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Facebook</p>
          <p className="text-[10px] font-bold text-gray-800 truncate max-w-[140px] mt-0.5">
            {title || 'Headline'}
          </p>
        </div>
        <button type="button" className="bg-[#1877F2] hover:bg-blue-700 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap transition-colors shadow-xs cursor-pointer">
          Learn More
        </button>
      </div>
    </div>
    </div>

    <div className="flex flex-col items-center gap-2 mt-3">

      <div className="flex gap-1 justify-center mb-0.5">
        <span className="w-3.5 h-1 bg-orange-500 rounded-full"></span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
      </div>


      <div className="flex items-center gap-2.5 w-full justify-center">
        <button 
          type="button" 
          className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold rounded-full hover:bg-gray-50 transition-colors shadow-xs min-w-[90px] cursor-pointer"
        >
          Schedule
        </button>
        <button 
          type="button" 
          className={`${buttonVariants({variant:'default'})} px-6 py-1.5 text-white text-[11px] font-bold rounded-full shadow-md transition-colors min-w-[100px] cursor-pointer`}
        >
          Publish
        </button>
      </div>
      

      
    </div>
    </div>
    </div>
    </div>
    </div>
  );
}

