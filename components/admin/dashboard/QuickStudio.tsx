"use client";

import React, { useState, useContext } from "react";
import {
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
  Lightbulb,
  MoveLeft,
  X
} from "lucide-react";
import { useContenthook } from "@/hooks/useContent";
import { LivePreviewloading } from "@/components/ui/Skeletonloading";

import { StaticImageData } from "next/image";
import avatar1 from "@/public/Images/avatar1.png";
import { FacebookPostPreview } from "./FacebookPostPreview";

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

  const [imageUrl, setImageUrl] = useState<string | StaticImageData>(
    avatar1
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
    setActiveSocials((prev) =>
      prev.includes(social)
        ? prev.filter((s) => s !== social)
        : [...prev, social]
    );
  };

  const isVideoFormat = ["Reel", "Video", "Podcast", "Live", "Voice-over"].includes(selectedFormat);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const selectedImage = avatar1;
      setImageUrl(selectedImage);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 top-[52px] xs:top-[60px] sm:top-[20px] md:top-0 bg-black/55 backdrop-blur-xs flex items-start md:items-center justify-center p-0 md:p-4 z-40 animate-fade-in select-none">
      <div className="w-full h-full  md:h-auto md:max-h-[86vh] md:max-w-[750px] lg:max-w-[780px] min-[2560px]:max-w-[1050px] min-[3840px]:max-w-[1350px] rounded-none md:rounded-3xl bg-[#FAF3EC] shadow-2xl px-4 pt-3 pb-32 sm:px-4 sm:py-3 md:px-5 md:py-3.5 min-[2560px]:p-5 min-[3840px]:p-6 relative font-sans antialiased border-0 md:border border-orange-100/40 overflow-y-auto flex flex-col justify-between gap-2.5">

        {/* Mobile Back Button */}
        <div className="block sm:hidden">
          <button
            onClick={handleClose}
            className="hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-start"
            aria-label="Go back"
            title="Close Studio"
          >
            <MoveLeft size={26} className="text-brand w-8 h-7" />
          </button>
        </div>

        {/* Desktop and Tablet Cancel (X) Button */}
        <button
          onClick={handleClose}
          className="hidden sm:flex absolute right-3.5 top-3 md:right-4 md:top-3.5 h-7 w-7 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-all duration-200 cursor-pointer z-10"
          aria-label="Close Studio"
        >
          <X size={15} />
        </button>

        <div className="flex items-center justify-between border-b border-orange-100/60 pb-1.5 sm:pr-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 min-[2560px]:w-9 min-[2560px]:h-9 rounded-full bg-[#FF6B35] flex items-center justify-center text-white shadow-sm shadow-[#FF6B35]/20 shrink-0">
              <Lightbulb className="w-3.5 h-3.5 min-[2560px]:w-4.5 min-[2560px]:h-4.5" />
            </div>

            <div>
              <h1 className="text-base md:text-sm min-[2560px]:text-base min-[3840px]:text-lg font-extrabold text-gray-900 tracking-tight leading-tight">
                Quick Create Studio
              </h1>
              <p className="text-[9.5px] min-[2560px]:text-xs text-gray-500 font-medium leading-tight">
                Design, generate & Publish in one flow
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 min-[2560px]:grid-cols-12 min-[3840px]:grid-cols-12 gap-3 min-[3840px]:gap-5 flex-grow">
          <div className="lg:col-span-3 min-[2560px]:col-span-7 min-[3840px]:col-span-7 flex flex-col justify-between gap-2 min-[3840px]:gap-3">
            <div>
              <h2 className="text-[8.5px] min-[2560px]:text-[9.5px] min-[3840px]:text-xs font-bold text-[#8A5237] tracking-wider uppercase mb-1">
                Choose Format
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 min-[2560px]:grid-cols-4 min-[3840px]:grid-cols-6 gap-1 min-[3840px]:gap-1.5">
                {formats.map((fmt) => {
                  const isActive = selectedFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => setSelectedFormat(fmt.id)}
                      className={`flex items-center justify-start py-1 px-1.5 min-[3840px]:py-1.5 min-[3840px]:px-2 rounded-lg border transition-all duration-200 cursor-pointer select-none gap-1.5 active:scale-95 ${
                        isActive
                          ? "border-[#FF6B35] bg-white text-[#FF6B35] font-bold shadow-xs shadow-orange-500/5"
                          : "border-orange-100/50 bg-white text-gray-600 hover:border-[#FF6B35]/40 hover:text-gray-800"
                      }`}
                    >
                      <div className={isActive ? "text-[#FF6B35]" : "text-gray-400"}>
                        {fmt.icon}
                      </div>
                      <span className="text-[8.5px] min-[2560px]:text-[9.5px] min-[3840px]:text-xs font-bold tracking-tight truncate">
                        {fmt.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Prompt */}
            <div>
              <h2 className="text-[8.5px] min-[2560px]:text-[9.5px] min-[3840px]:text-xs font-bold text-[#8A5237] tracking-wider uppercase mb-1">
                AI Prompt
              </h2>
              <div className="bg-white rounded-xl p-2 min-[3840px]:p-3 border border-orange-100/50 shadow-xs flex flex-col gap-1.5">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to generate in detail..."
                  className="w-full bg-transparent border-0 outline-none text-[10.5px] min-[2560px]:text-xs min-[3840px]:text-sm text-gray-700 placeholder-gray-400 resize-none h-8 min-[2560px]:h-11 focus:ring-0 leading-snug font-semibold p-0"
                />

                <div className="flex items-center justify-between border-t border-orange-50/50 pt-1.5">
                  <div className="flex items-center gap-1 text-gray-400">
                    <button className="p-1 hover:text-[#FF6B35] hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="Remix Prompt">
                      <Sparkles className="w-3 h-3 min-[3840px]:w-3.5 min-[3840px]:h-3.5" />
                    </button>
                    <button className="p-1 hover:text-[#FF6B35] hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="Translate Prompt">
                      <Languages className="w-3 h-3 min-[3840px]:w-3.5 min-[3840px]:h-3.5" />
                    </button>
                    <button className="p-1 hover:text-[#FF6B35] hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="Add Image Style">
                      <ImageIcon className="w-3 h-3 min-[3840px]:w-3.5 min-[3840px]:h-3.5" />
                    </button>
                    <button className="p-1 hover:text-[#FF6B35] hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="Voice Input">
                      <Mic className="w-3 h-3 min-[3840px]:w-3.5 min-[3840px]:h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-3 py-1 min-[3840px]:px-3.5 min-[3840px]:py-1.5 bg-[#FF6B35] text-white text-[9.5px] min-[2560px]:text-[10.5px] min-[3840px]:text-xs font-bold rounded-lg hover:bg-[#F27D42] active:scale-95 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-2.5 h-2.5 min-[3840px]:w-3.5 min-[3840px]:h-3.5" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Target Social Channels */}
            <div>
              <h2 className="text-[8.5px] min-[2560px]:text-[9.5px] min-[3840px]:text-xs font-bold text-[#8A5237] tracking-wider uppercase mb-1">
                Publish Channels
              </h2>
              <div className="flex flex-wrap gap-1 min-[3840px]:gap-1.5">
                {socialChannels.map((channel) => {
                  const isActive = activeSocials.includes(channel);
                  return (
                    <button
                      key={channel}
                      onClick={() => toggleSocial(channel)}
                      className={`px-2.5 py-0.5 min-[3840px]:px-3 min-[3840px]:py-1 rounded-full text-[8.5px] min-[2560px]:text-[9.5px] min-[3840px]:text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                        isActive
                          ? "bg-[#F27D42] border-[#F27D42] text-white shadow-xs shadow-[#F27D42]/10"
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

          <div className="lg:col-span-2 min-[2560px]:col-span-5 min-[3840px]:col-span-5 flex flex-col gap-1 min-h-0 overflow-hidden mt-1 lg:mt-0">
            <h2 className="text-[8.5px] min-[2560px]:text-[9.5px] min-[3840px]:text-xs font-bold text-[#8A5237] tracking-wider uppercase select-none">
              Live Preview
            </h2>

            {isGenerating ? (
              <LivePreviewloading />
            ) : (
              <div>
                <FacebookPostPreview
                  caption={prompt || "Your ad caption here..."}
                  image={imageUrl || avatar1}
                  isVideo={isVideoFormat}
                  formatBadge={selectedFormat}
                  className="mt-0.5"
                />
                <div className="flex justify-center gap-1 mt-1 shrink-0">
                  <span className="w-2.5 h-0.5 rounded-full bg-[#FF6B35]" />
                  <span className="w-1 h-0.5 rounded-full bg-orange-100" />
                  <span className="w-1 h-0.5 rounded-full bg-orange-100" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 w-full xs:justify-center sm:justify-end sm:-ml-15 pt-2 border-t border-orange-100/60">
          <button
            type="button"
            className="px-3.5 py-1 min-[3840px]:px-4.5 min-[3840px]:py-1.5 bg-white border border-orange-200 text-[#FF6B35] text-[9.5px] md:text-[10.5px] min-[3840px]:text-xs font-bold rounded-full hover:bg-orange-50/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs min-w-[80px] cursor-pointer"
          >
            Schedule
          </button>
          <button
            type="button"
            className="px-5 py-1 min-[3840px]:px-6 min-[3840px]:py-1.5 bg-[#FF6B35] hover:bg-[#F27D42] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[9.5px] md:text-[10.5px] min-[3840px]:text-xs font-bold rounded-full shadow-xs transition-all min-w-[90px] cursor-pointer"
          >
            Publish
          </button>
        </div>

      </div>
    </div>
  );
}
