"use client"
import { useContext, useState, useEffect } from "react";
import { Sparkle, UploadCloud, MoveLeft, X } from "lucide-react";
import { useContenthook } from "@/hooks/useContent";
import { buttonVariants } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { LivePreviewloading } from "@/components/ui/Skeletonloading";
import avatar1 from "@/public/Images/avatar1.png";
import { FacebookPostPreview } from "./FacebookPostPreview";

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
        ? prev.filter((id) => id !== platformId)
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
    <div className="fixed inset-0 top-[52px] xs:top-[40px] sm:top-[20px] md:top-0 bg-black/50 backdrop-blur-xs flex items-start md:items-center justify-center p-0 md:p-4 z-40">
      <div className="w-full h-full xs:mt-5 md:h-auto md:max-h-[92vh] md:max-w-4xl min-[2560px]:max-w-[1250px] min-[3840px]:max-w-[1600px] rounded-none md:rounded-[28px] bg-[#fff0e7] shadow-2xl px-4 pt-3 pb-28 md:px-6 md:py-5 min-[2560px]:p-6 min-[3840px]:p-8 relative font-sans antialiased border-0 md:border border-orange-100 overflow-y-auto md:overflow-hidden flex flex-col justify-start">
        {/* Mobile Back Button */}
        <div className="block sm:hidden mb-2">
          <button 
            onClick={() => { setHandlestate(false) }}
            className="hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
            aria-label="Go back"
          >
            <MoveLeft size={30} className="text-brand w-10 h-9" />
          </button>
        </div>

        {/* Desktop and Tablet Cancel (X) Button */}
        <button
          onClick={() => { setHandlestate(false) }}
          className="hidden sm:flex absolute right-4 top-4 md:right-5 md:top-5 h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-all duration-200 cursor-pointer z-10"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] min-[2560px]:grid-cols-[1fr_380px] min-[3840px]:grid-cols-[1fr_450px] gap-6 min-[3840px]:gap-8 items-start mt-1">
          <div className={`flex flex-col gap-2.5 min-[3840px]:gap-3.5 ${step === "edit" ? "block" : "hidden lg:flex"}`}>
            <div>
              <h1 className="text-2xl min-[2560px]:text-3xl min-[3840px]:text-4xl font-bold text-[#9b4811] tracking-tight">Create New Post</h1>
              <p className="mt-0.5 text-sm min-[3840px]:text-base text-orange-900/60 font-medium">
                Share your thoughts or AI-generated content with the Tamil community.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 min-[3840px]:gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm min-[3840px]:text-base font-bold text-gray-800">Post Details</h2>
                <button className="flex items-center gap-1 text-xs min-[3840px]:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer">
                  <Sparkle size={12} className="fill-orange-600 min-[3840px]:w-3.5 min-[3840px]:h-3.5" />
                  Generate Caption
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="postTitle" className="text-[13px] min-[3840px]:text-sm font-semibold text-gray-600">Title / Headline</label>
                <input
                  id="postTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an eye-catching title..."
                  className="w-full h-9 min-[2560px]:h-10 min-[3840px]:h-11 px-3 min-[3840px]:px-4 rounded-xl bg-white border border-transparent outline-none text-xs min-[3840px]:text-sm transition-all shadow-sm focus:border-[#ef8b54] placeholder:text-gray-400 text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="postCaption" className="text-[13px] min-[3840px]:text-sm font-bold text-gray-600">Description / Caption</label>
                <textarea
                  id="postCaption"
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your thoughts here... Use #hashtags to trend!"
                  className="w-full p-2.5 min-[3840px]:p-3.5 rounded-xl bg-white border border-transparent outline-none text-xs min-[3840px]:text-sm resize-none transition-all shadow-sm focus:border-[#ef8b54] placeholder:text-gray-400 text-gray-800 leading-relaxed"
                />
              </div>
            </div>

            <div className="border-2 border-dashed border-orange-200 bg-white rounded-2xl p-2.5 min-[2560px]:p-3 min-[3840px]:p-4 text-center flex flex-col items-center justify-center gap-1 min-[3840px]:gap-1.5 shadow-sm transition-colors hover:border-orange-300">
              <div className="p-0.5 bg-[#fff0e7] rounded-full text-[#ef8b54]">
                <UploadCloud size={18} className="min-[3840px]:w-5 min-[3840px]:h-5" />
              </div>
              <p className="text-xs min-[3840px]:text-sm font-bold text-gray-800">Drag and drop files here</p>
              <p className="text-[10px] min-[3840px]:text-xs text-gray-400 max-w-[280px]">Support for PNG, JPG, MP4, and MOV (Max 50MB)</p>
              <button className="mt-0.5 px-4 py-1.5 min-[3840px]:px-5 min-[3840px]:py-2 bg-[#ef8b54] text-white text-[10px] min-[3840px]:text-xs font-bold rounded-xl hover:bg-[#d9723a] transition-all shadow-md active:scale-95 cursor-pointer">
                Browse Files
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-0.5">
              {platformList.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`py-1.5 min-[3840px]:py-2 px-3 min-[3840px]:px-4 text-[11px] min-[2560px]:text-xs min-[3840px]:text-sm font-bold rounded-full border text-center transition-all duration-200 shadow-sm cursor-pointer ${
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

          <div className={`flex flex-col gap-2 min-[3840px]:gap-3 ${step !== "edit" ? "block" : "hidden lg:flex"}`}>
            {/* <div className="flex items-center justify-between lg:block mb-1 select-none">
              <h3 className="text-xs min-[3840px]:text-sm font-extrabold text-gray-800 tracking-wide uppercase">Live Preview</h3>
              <button
                type="button"
                onClick={() => setStep("edit")}
                className="lg:hidden text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                ← Back to Edit
              </button>
            </div> */}

            {isPreviewLoading ? (
              <LivePreviewloading />
            ) : (
              <FacebookPostPreview
                title={title || "it can be really easy to over indulge"}
                caption={caption || "Write your thoughts here... Use #hashtags to trend!"}
                image={avatar1}
                isVideo={true}
                className="mt-1 min-[3840px]:mt-2"
              />
            )}

            <div className="flex flex-col items-center gap-2 mt-2">
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
                  className={`${buttonVariants({ variant: 'outline' })} px-4 py-1.5 min-[3840px]:px-5 min-[3840px]:py-2 text-[11px] min-[3840px]:text-xs font-bold min-w-[90px] shadow-xs cursor-pointer`}
                >
                  Schedule
                </button>
                <button
                  type="button"
                  className={`${buttonVariants({ variant: 'default' })} px-6 py-1.5 min-[3840px]:px-7 min-[3840px]:py-2 text-white text-[11px] min-[3840px]:text-xs font-bold shadow-md transition-colors min-w-[100px] cursor-pointer`}
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

