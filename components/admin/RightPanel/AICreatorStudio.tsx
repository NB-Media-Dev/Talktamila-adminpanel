"use client";

import  { useState } from "react";
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, Send, Eye, } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export default function AICreatorStudio() {
  const router = useRouter();
  const formats = [
    "Poster",
    "Reel",
    "Shorts",
    "Caption",
    "Blog",
    "Carousel",
    "Thumbnail",
    "Voice-Over",
    "AI News",
    "Script",
  ];

  const styles = ["Editorial", "Cinematic", "Minimal", "Bold"];
  const aspectRatios = ["1:1", "4:5", "9:16", "16:9"];

  const [selectedFormat, setSelectedFormat] = useState("Poster");
  const [selectedStyle, setSelectedStyle] = useState("Editorial");
  const [selectedRatio, setSelectedRatio] = useState("4:5");

  const [isGenerating, setIsGenerating] = useState(false);


  const handleGenerate = () => {
    setIsGenerating(true);
  };



  return (
    <div className="w-[350px] bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] relative overflow-hidden flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-lg bg-[#FFF2EC] text-[#FF5A26]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 ">
            AI Creator Studio
          </h2>
        </div>
        <span className="text-[8px] font-extrabold uppercase tracking-wider text-[#FF5A26] bg-[#FFF2EC] px-2.5 py-1 rounded-full">
          Tamil-first
        </span>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {formats.map((format) => {
          const isSelected = selectedFormat === format;
          return (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`py-2 px-3 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${isSelected
                  ? `${buttonVariants({variant:'default'})} text-white shadow-[0_4px_12px_rgba(255,90,38,0.2)]`
                  : "bg-[#FFEFE5] text-gray-900"
                }`}
            >
              {format}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
          Style
        </span>
        <div className="flex flex-row gap-1 w-full justify-between">
          {styles.map((style) => {
            const isSelected = selectedStyle === style;
            return (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`py-1 px-1.5 rounded-full text-[8px] sm:text-xs font-semibold text-center whitespace-nowrap transition-all duration-200 cursor-pointer flex-1 ${isSelected
                    ? `${buttonVariants({variant:'default'})}`
                    : "bg-[#FFEFE5] text-gray-800"
                  }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>


      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
          Aspect Ratio
        </span>
        <div className="flex flex-row gap-1 w-full justify-between">
          {aspectRatios.map((ratio) => {
            const isSelected = selectedRatio === ratio;
            return (
              <button
                key={ratio}
                onClick={() => setSelectedRatio(ratio)}
                className={`py-1 px-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-center whitespace-nowrap transition-all duration-200 cursor-pointer flex-1 ${isSelected
                    ? `${buttonVariants({variant:'default'})}`
                    : "bg-[#FFEFE5] text-gray-800"
                  }`}
              >
                {ratio}
              </button>
            );
          })}
        </div>
      </div>


      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center gap-2">

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`flex-1 ${buttonVariants({variant:'default'})} text-sm font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,90,38,0.25)] cursor-pointer`}
          >
            <span>Generate {selectedFormat}</span>

          </button>


          <button

            className="py-3 px-4 border border-[#FFEFE0] hover:bg-[#FFF9F5] text-[#FF5A26] text-sm font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => router.push('/admin/content')}
            className="py-2.5 px-4 bg-[#FFEFE5] active:scale-[0.98] text-gray-700 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FF5A26]" />
            <span>Schedule</span>
          </button>
          <button
            className="py-2.5 px-4 bg-[#FFEFE5] active:scale-[0.98] text-gray-700 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#FF5A26]" />
            <span>Publish</span>
          </button>
        </div>
      </div>

    </div>
  );
}

