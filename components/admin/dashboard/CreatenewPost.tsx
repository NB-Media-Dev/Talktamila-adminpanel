"use client"
import { useContext, useState } from "react";
import { Sparkle, UploadCloud, X, MoreHorizontal, Play, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
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
  const { handlestate, setHandlestate } = context

  const handlepostcard = () => {
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
      <div className="w-full h-full md:h-auto md:max-h-[85vh] md:max-w-4xl rounded-none md:rounded-[28px] bg-[#fff0e7] shadow-2xl px-4 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-28 md:px-5 md:py-5 relative font-sans antialiased border-0 md:border border-orange-100 overflow-y-auto md:overflow-hidden">

        <button
          onClick={() => { handlepostcard() }}
          className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top,0px))] md:top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-all duration-200 cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start mt-1">

          <div className="flex flex-col gap-2.5">

            <div>
              <h1 className="text-lg font-bold text-[#9b4811] tracking-tight">Create New Post</h1>
              <p className="mt-0.5 text-sm text-orange-900/60 font-medium">
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
                <label className="text-[13px] font-semibold text-gray-600">Title / Headline</label>
                <input
                  type="text"
                  placeholder="Enter an eye-catching title..."
                  className="w-full h-9 px-3 rounded-xl bg-white border border-transparent outline-none text-xs transition-all shadow-sm focus:border-[#ef8b54] placeholder:text-gray-400 text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-gray-600">Description / Caption</label>
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
                    className={`py-1.5 px-2 px-3 text-[11px] font-bold rounded-full border text-center transition-all duration-200 shadow-sm cursor-pointer ${isSelected
                        ? `${buttonVariants({ variant: 'default' })} border-transparent transform scale-[1.02] shadow-orange-500/20`
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
            <h3 className="text-xs font-extrabold text-gray-800 tracking-wide uppercase select-none">Live Preview</h3>

            <div className="bg-[#F0F2F5] rounded-2xl p-2 border border-gray-200/40 flex-grow flex flex-col gap-1.5 w-full max-w-[270px] mx-auto overflow-hidden">
              
              <div className="flex items-center gap-1.5 px-0.5 select-none">
                
                <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-extrabold text-[9px] shrink-0 leading-none pb-[1px] shadow-xs">
                  f
                </div>
                <span className="text-[10px] font-extrabold text-[#1c1e21] tracking-tight">Facebook</span>
              </div>

              <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-2 flex flex-col gap-1.5">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0 select-none">
                      Y
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[10px] font-bold text-[#050505] flex items-center gap-1 leading-none select-none">
                        Your Business Name
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[7px] font-black shrink-0">✓</span>
                      </h4>
                      <span className="text-[8px] text-[#65676b] font-medium leading-none mt-1 flex items-center gap-1 select-none">
                        Sponsored · <span className="text-[9px] -mt-[1px]">🌐</span>
                      </span>
                    </div>
                  </div>
                  <button className="text-[#65676b] hover:text-[#050505] transition-colors cursor-pointer p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[9px] text-[#050505] font-normal leading-normal whitespace-pre-wrap px-0.5 break-words line-clamp-2">
                  {caption || "Write your thoughts here... Use #hashtags to trend!"}
                </p>

                <div className="w-full aspect-[4/3] bg-slate-950 relative group border border-gray-100 rounded-md overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80"
                    alt="Video Ad Preview"
                    className="w-full h-full object-cover opacity-95"
                  />
                  
                  <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 text-center z-10 select-none">
                    <p className="text-white text-[9px] font-semibold leading-normal bg-black/40 py-1 px-2 rounded-md backdrop-blur-xs max-w-[90%] mx-auto shadow-sm">
                      it can be really easy to over indulge
                    </p>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-xs border border-white/20 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all">
                      <Play className="w-3.5 h-3.5 text-white fill-white translate-x-[1px]" />
                    </div>
                  </div>

                  <div className="absolute bottom-6.5 left-2.5 right-2.5 h-0.5 bg-white/30 rounded-full overflow-hidden z-10 select-none">
                    <div className="w-1/3 h-full bg-white rounded-full"></div>
                  </div>

                  <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between text-[8px] text-white select-none z-10 font-bold drop-shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="cursor-pointer hover:text-gray-200">▶</span>
                      <span>0:00 / 0:54</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-90 cursor-pointer">
                      <span>🔊</span>
                      <span>⛶</span>
                      <span>⋮</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center px-0.5 pt-0.5 select-none">
                  
                  <div className="flex items-center gap-1 text-[9px] text-[#65676b] font-medium">
                    <div className="flex items-center shrink-0">
                      
                      <div className="w-3.5 h-3.5 rounded-full bg-[#1877F2] flex items-center justify-center border border-white z-10 text-[8px] text-white">
                        👍
                      </div>
                      
                      <div className="w-3.5 h-3.5 rounded-full bg-[#F02849] flex items-center justify-center border border-white -ml-1.5 z-0 text-[8px] text-white">
                        ❤️
                      </div>
                    </div>
                    <span className="ml-0.5">20 · 1 comment</span>
                  </div>

                  <button className="px-3 py-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white text-[9px] font-bold rounded-lg transition-colors shadow-xs cursor-pointer">
                    Learn More
                  </button>
                </div>

                <div className="border-t border-gray-200/80 my-0.5"></div>

                <div className="flex items-center justify-around text-[9px] text-[#65676b] font-bold select-none">
                  <button type="button" className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#65676b]" /> Like
                  </button>
                  <button type="button" className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5 text-[#65676b]" /> Comment
                  </button>
                  <button type="button" className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <Share2 className="w-3.5 h-3.5 text-[#65676b]" /> Share
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
                  className={`${buttonVariants({ variant: 'default' })} px-6 py-1.5 text-white text-[11px] font-bold rounded-full shadow-md transition-colors min-w-[100px] cursor-pointer`}
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
