"use client";

import React, { useState, useContext } from "react";
import {
  X,
  Sparkles,
  Languages,
  Image as ImageIcon,
  Mic,
  Video,
  Tv,
  Camera,
  Layout,
  FileText,
  Newspaper,
  BarChart2,
  Radio,
  Volume2,
  Play,
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Lightbulb
} from "lucide-react";
import { useContenthook } from "@/hooks/useContent";
import { FacebookIcon } from "@/public/Svgicons/svgicons";

interface FormatOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function QuickStudio() {
  const context = useContext(useContenthook);
  const [selectedFormat, setSelectedFormat] = useState<string>("Poster");
  const [prompt, setPrompt] = useState<string>(
    "A cinematic Chennai skyline sunset poster with 'சென்னை மெட்ரோ 2025' bold text and orange gradient overlay."
  );
  const [activeSocials, setActiveSocials] = useState<string[]>([
    "Talk Tamila",
    "Instagram",
    "Facebook"
  ]);

  const [imageUrl, setImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80"
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!context) {
    throw new Error("QuickStudio must be used within a UseContentProvider");
  }

  const { setActiveTab } = context;

  const handleClose = () => {
    setActiveTab("home");
  };

  const formats: FormatOption[] = [
    { id: "Poster", name: "Poster", icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: "Reel", name: "Reel", icon: <Video className="w-3.5 h-3.5" /> },
    { id: "Video", name: "Video", icon: <Tv className="w-3.5 h-3.5" /> },
    { id: "Story", name: "Story", icon: <Camera className="w-3.5 h-3.5" /> },
    { id: "Carousel", name: "Carousel", icon: <Layout className="w-3.5 h-3.5" /> },
    { id: "Blog", name: "Blog", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "News", name: "News", icon: <Newspaper className="w-3.5 h-3.5" /> },
    { id: "Thumbnail", name: "Thumbnail", icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: "Voice-over", name: "Voice-over", icon: <Mic className="w-3.5 h-3.5" /> },
    { id: "Poll", name: "Poll", icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { id: "Podcast", name: "Podcast", icon: <Radio className="w-3.5 h-3.5" /> },
    { id: "Live", name: "Live", icon: <Volume2 className="w-3.5 h-3.5" /> },
  ];

  const socialChannels = [
    "Talk Tamila",
    "Instagram",
    "Facebook",
    "YouTube",
    "Threads",
    "X",
    "LinkedIn",
    "Telegram"
  ];

  const toggleSocial = (social: string) => {
    if (activeSocials.includes(social)) {
      setActiveSocials(prev => prev.filter(s => s !== social));
    } else {
      setActiveSocials(prev => [...prev, social]);
    }
  };

  const isVideoFormat = ["Reel", "Video", "Podcast", "Live", "Voice-over"].includes(selectedFormat);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const lowerPrompt = prompt.toLowerCase();
      let selectedImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80";

      if (lowerPrompt.includes("chennai") || lowerPrompt.includes("sunset") || lowerPrompt.includes("skyline") || lowerPrompt.includes("metro")) {
        selectedImage = "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80";
      } else if (lowerPrompt.includes("food") || lowerPrompt.includes("dosa") || lowerPrompt.includes("biryani") || lowerPrompt.includes("eat") || lowerPrompt.includes("meals")) {
        selectedImage = "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80";
      } else if (lowerPrompt.includes("tech") || lowerPrompt.includes("future") || lowerPrompt.includes("code") || lowerPrompt.includes("ai") || lowerPrompt.includes("computer")) {
        selectedImage = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80";
      } else if (lowerPrompt.includes("festival") || lowerPrompt.includes("diwali") || lowerPrompt.includes("pongal") || lowerPrompt.includes("tamil") || lowerPrompt.includes("culture")) {
        selectedImage = "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=400&q=80";
      } else if (lowerPrompt.includes("people") || lowerPrompt.includes("crowd") || lowerPrompt.includes("celebration")) {
        selectedImage = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80";
      }

      setImageUrl(selectedImage);
      setIsGenerating(false);
    }, 1500);
  };



  return (
    <div className="fixed inset-0 top-[52px] xs:top-[56px] sm:top-[60px] md:top-0 bg-black/55 backdrop-blur-xs flex items-start md:items-center justify-center p-0 md:p-4 z-40 animate-fade-in select-none">
      <div className="w-full h-[calc(100vh-56px)] md:h-auto md:max-h-[85vh] md:max-w-[760px] rounded-none md:rounded-3xl bg-[#FAF3EC] shadow-2xl px-4 pt-4 sm:pt-5 pb-28 md:px-5 md:py-5 relative font-sans antialiased border-0 md:border border-orange-100/40 overflow-y-auto md:overflow-hidden flex flex-col gap-3">



        <div className="flex items-center justify-between border-b border-orange-100/60 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white shadow-md shadow-[#FF6B35]/20 shrink-0">
              <Lightbulb className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-extrabold text-gray-900 tracking-tight leading-none">
                Quick Create Studio
              </h1>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-none">
                Design, generate & Publish in one flow
              </p>
            </div>
          </div>

         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-grow mt-1">

          <div className="lg:col-span-3 flex flex-col justify-between gap-3">

            <div>
              <h2 className="text-[9px] font-bold text-[#8A5237] tracking-wider uppercase mb-1.5">
                Choose Format
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {formats.map((fmt) => {
                  const isActive = selectedFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => setSelectedFormat(fmt.id)}
                      className={`flex items-center justify-start py-1.5 px-2 rounded-xl border transition-all duration-200 cursor-pointer select-none gap-2 active:scale-95 ${isActive
                        ? "border-[#FF6B35] bg-white text-[#FF6B35] font-bold shadow-md shadow-orange-500/5"
                        : "border-orange-100/50 bg-white text-gray-600 hover:border-[#FF6B35]/40 hover:text-gray-800"
                        }`}
                    >
                      <div className={isActive ? "text-[#FF6B35]" : "text-gray-400"}>
                        {fmt.icon}
                      </div>
                      <span className="text-[9px] font-bold tracking-tight truncate">
                        {fmt.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-[9px] font-bold text-[#8A5237] tracking-wider uppercase mb-1.5">
                AI Prompt
              </h2>
              <div className="bg-white rounded-xl p-3 border border-orange-100/50 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col gap-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to generate in detail..."
                  className="w-full bg-transparent border-0 outline-none text-[11px] text-gray-700 placeholder-gray-400 resize-none h-10 focus:ring-0 leading-relaxed font-semibold p-0"
                />

                <div className="flex items-center justify-between border-t border-orange-50/50 pt-2">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <button className="p-1 hover:text-[#FF6B35] hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="Remix Prompt">
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 hover:text-[#FF6B35] hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="Translate Prompt">
                      <Languages className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 hover:text-[#FF6B35] hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="Add Image Style">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 hover:text-[#FF6B35] hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="Voice Input">
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-3.5 py-1 bg-[#FF6B35] text-white text-[10px] font-bold rounded-lg hover:bg-[#F27D42] active:scale-95 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5">
                {socialChannels.map((channel) => {
                  const isActive = activeSocials.includes(channel);
                  return (
                    <button
                      key={channel}
                      onClick={() => toggleSocial(channel)}
                      className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all border cursor-pointer active:scale-95 ${isActive
                        ? "bg-[#F27D42] border-[#F27D42] text-white shadow-md shadow-[#F27D42]/10"
                        : "bg-white border-orange-100/50 text-gray-600 hover:border-orange-200"
                        }`}
                    >
                      {channel}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="lg:col-span-2 flex flex-col gap-2 min-h-0 overflow-hidden mt-3 lg:mt-0">
            <h2 className="text-[9px] font-bold text-[#8A5237] tracking-wider uppercase select-none">
              Live Preview
            </h2>

            <div className="bg-[#F0F2F5] rounded-2xl p-2 border border-gray-200/40 flex-grow flex flex-col gap-1.5 w-full max-w-[270px] mx-auto overflow-hidden">

              <div className="flex items-center gap-1.5 px-0.5 select-none">

                <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-extrabold text-[9px] shrink-0 leading-none pb-[1px] shadow-xs">
                  <FacebookIcon />
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
                  {prompt ? prompt : "Your ad caption here..."}
                </p>

                <div className="w-full aspect-[4/3] bg-slate-950 relative group border border-gray-100 rounded-md overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`${selectedFormat} Preview`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isGenerating ? 'opacity-40' : 'opacity-95'}`}
                  />

                  {isGenerating && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 z-20">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-white text-[8px] font-bold tracking-wider uppercase">Generating...</p>
                    </div>
                  )}

                  {isVideoFormat && !isGenerating && (
                    <>
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
                    </>
                  )}

                  {!isVideoFormat && !isGenerating && (
                    <div className="absolute top-2 left-2 bg-[#1877F2]/90 text-white text-[8px] font-extrabold py-0.5 px-1.5 rounded shadow-xs backdrop-blur-xs z-10 uppercase tracking-wide select-none">
                      🖼️ {selectedFormat}
                    </div>
                  )}
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
                  <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#65676b]" /> Like
                  </button>
                  <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5 text-[#65676b]" /> Comment
                  </button>
                  <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <Share2 className="w-3.5 h-3.5 text-[#65676b]" /> Share
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-1 mt-1 shrink-0">
                <span className="w-3 h-1 rounded-full bg-[#FF6B35]" />
                <span className="w-1 h-1 rounded-full bg-orange-100" />
                <span className="w-1 h-1 rounded-full bg-orange-100" />
              </div>
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-end">
          <button
            type="button"
            className="px-4.5 py-1.5 bg-white border border-orange-200 text-[#FF6B35] text-[10px] md:text-[11px] font-bold rounded-full hover:bg-orange-50/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm min-w-[90px] cursor-pointer"
          >
            Schedule
          </button>
          <button
            type="button"
            className="px-6 py-1.5 bg-[#FF6B35] hover:bg-[#F27D42] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] md:text-[11px] font-bold rounded-full shadow-md transition-all min-w-[100px] cursor-pointer"
          >
            Publish
          </button>
        </div>
      </div>

    </div>

  );
}
