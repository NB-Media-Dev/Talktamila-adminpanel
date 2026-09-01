"use client"
import { useContext, useState, useEffect } from "react";
import { Sparkle, UploadCloud, X, MoreHorizontal, Play, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useContenthook } from "@/hooks/useContent";
import { buttonVariants } from "@/components/ui/Button";
import { FacebookIcon } from "@/public/Svgicons/svgicons";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const platformList = [
  { id: "Talk Tamila", name: "Talk Tamila" },
  { id: "Instagram", name: "Instagram" },
  { id: "Threads", name: "Threads" },
  { id: "X", name: "X" },
  { id: "Facebook", name: "Facebook" },
  { id: "YouTube", name: "YouTube" },
  { id: "LinkedIn", name: "LinkedIn" },
  { id: "Telegram", name: "Telegram" },
];

export function CreatenewPost() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "Talk Tamila",
    "Instagram",
    "Facebook",
  ]);

  const router = useRouter();

  const [step, setStep] = useState<"edit" | "loading" | "preview">("edit");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const context = useContext(useContenthook);

  if (!context) {
    throw new Error("CreatenewPost must be used within a UseContentProvider");
  }
  const { setHandlestate } = context;

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("Write your thoughts here... Use #hashtags to trend!");

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((item) => item !== platformId)
        : [...prev, platformId]
    );
  };

  const handleNext = () => {
    setStep("loading");
    setTimeout(() => {
      setStep("preview");
    }, 800);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);



  const isPreviewLoading = isLoading || step === "loading";

  return (
    <div className="fixed inset-0 top-[52px] xs:top-[56px] sm:top-[60px] md:top-0 bg-black/50 backdrop-blur-xs flex items-start md:items-center justify-center p-0 md:p-4 z-40">
      <div className="w-full h-full md:max-h-[85vh] md:max-w-4xl rounded-none md:rounded-[28px] bg-[#fff0e7] shadow-2xl px-4 pt-[calc(2.5rem+env(safe-area-inset-top,0px))] pb-28 md:px-5 md:py-5 relative font-sans antialiased border-0 md:border border-orange-100 overflow-y-auto md:overflow-hidden">

      

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start mt-1">

        
          <div className={`flex flex-col gap-2.5 ${step === "edit" ? "block" : "hidden lg:flex"}`}>
            <div>
              <h1 className="text-2xl font-bold text-[#9b4811] tracking-tight">Create New Post</h1>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an eye-catching title..."
                  className="w-full h-9 px-3 rounded-xl bg-white border border-transparent outline-none text-xs transition-all shadow-sm focus:border-[#ef8b54] placeholder:text-gray-400 text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-gray-600">Description / Caption</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
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
                    className={`py-1.5 px-3 text-[11px] font-bold rounded-full border text-center transition-all duration-200 shadow-sm cursor-pointer ${
                      isSelected
                        ? `${buttonVariants({ variant: 'default' })} border-transparent transform scale-[1.02] shadow-orange-500/20`
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {platform.name}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="mt-5 w-full py-3 bg-[#ef8b54] hover:bg-[#d9723a] text-white text-[12px] font-extrabold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer lg:hidden uppercase tracking-wider select-none"
            >
              NEXT
            </button>
          </div>

          {/* Preview Section (Mobile preview/loading OR Desktop side preview) */}
          <div className={`flex flex-col gap-2 ${step !== "edit" ? "block" : "hidden lg:flex"}`}>
            <div className="flex items-center justify-between lg:block mb-1.5 select-none">
              <h3 className="text-xs font-extrabold text-gray-800 tracking-wide uppercase">Live Preview</h3>
              <button
                type="button"
                onClick={() => setStep("edit")}
                className="lg:hidden text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                ← Back to Edit
              </button>
            </div>

            {isPreviewLoading ? (
              /* Loading Skeleton View */
              <div className="bg-[#F0F2F5] mt-5 h-[480px] rounded-2xl p-2 border border-gray-200/40 flex-grow flex flex-col gap-2 w-full max-w-[340px] lg:max-w-[270px] mx-auto overflow-hidden shadow-xs">
                <div className="flex items-center gap-2 px-1 py-0.5">
                  <Skeleton className="w-4 h-4 rounded-full bg-orange-200/80" />
                  <Skeleton className="h-3 w-16 bg-orange-200/80" />
                </div>

                <div className="bg-white rounded-xl border border-gray-200/60 shadow-xs p-2.5 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full bg-orange-100/80 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-24 bg-orange-100/80" />
                        <Skeleton className="h-2 w-16 bg-orange-100/60" />
                      </div>
                    </div>
                    <Skeleton className="w-4 h-4 bg-orange-100/60 rounded" />
                  </div>

                  <div className="flex flex-col gap-1.5 my-1">
                    <Skeleton className="h-2.5 w-full bg-orange-100/70" />
                    <Skeleton className="h-2.5 w-3/4 bg-orange-100/60" />
                  </div>

                  <div className="w-full flex-1 min-h-[160px] bg-slate-900/5 rounded-lg flex items-center justify-center border border-gray-100 relative overflow-hidden">
                    <Skeleton className="w-full h-full bg-orange-100/40" />
                    <div className="absolute w-9 h-9 rounded-full bg-orange-200/60 flex items-center justify-center">
                      <Skeleton className="w-4 h-4 rounded-full bg-orange-300/80" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-0.5 pt-1">
                    <Skeleton className="h-3 w-20 bg-orange-100/70" 
                  />
                    
                    <Skeleton className="h-6 w-16 rounded-lg bg-orange-200/80" />
                  </div>

                  <div className="border-t border-gray-100 my-0.5"></div>

                  <div className="flex items-center justify-around">
                    <Skeleton className="h-3 w-12 bg-orange-100/70" />
                    <Skeleton className="h-3 w-14 bg-orange-100/70" />
                    <Skeleton className="h-3 w-12 bg-orange-100/70" />
                  </div>
                </div>
              </div>
            ) : (
              /* Actual Live Preview View */
              <div className="bg-[#F0F2F5] mt-5 h-[500px] sm:h-full rounded-2xl p-2 border border-gray-200/40 flex-grow flex flex-col gap-1.5 w-full max-w-[340px] lg:max-w-[270px] mx-auto overflow-hidden">

                <div className="flex items-center gap-1.5 px-0.5 select-none">
                  <FacebookIcon />
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

                  <p className="text-[10px] text-[#050505] font-normal leading-normal whitespace-pre-wrap px-0.5 break-words line-clamp-2">
                    {caption || "Write your thoughts here... Use #hashtags to trend!"}
                  </p>

                  <div className="w-full h-[300px] sm:h-full aspect-[4/3] bg-slate-950 relative group border border-gray-100 rounded-md overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80"
                      alt="Video Ad Preview"
                      className="w-full h-full object-cover opacity-95"
                    />

                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 text-center z-10 select-none">
                      <p className="text-white text-[9px] font-semibold leading-normal bg-black/40 py-1 px-2 rounded-md backdrop-blur-xs max-w-[90%] mx-auto shadow-sm">
                        {title ? title : "it can be really easy to over indulge"}
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
            )}

            <div className="flex flex-col items-center gap-2 mt-3">

              <div className="flex gap-1 justify-center mb-0.5">
                <span className="w-3.5 h-1 bg-orange-500 rounded-full"></span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              </div>

              <div className="flex items-center gap-2.5 w-full justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setHandlestate(false);
                    router.push("/admin/content");
                  }}
                  className={`${buttonVariants({ variant: 'outline' })} px-4 py-1.5 text-[11px] font-bold min-w-[90px] shadow-xs cursor-pointer`}
                >
                  Schedule
                </button>
                <button
                  type="button"
                  className={`${buttonVariants({ variant: 'default' })} px-6 py-1.5 text-white text-[11px] font-bold shadow-md transition-colors min-w-[100px] cursor-pointer`}
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

