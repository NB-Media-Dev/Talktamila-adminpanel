"use client";

import React, { useState, useContext } from "react";

import { buttonVariants } from "../ui/Button";
import Image from "next/image";
import { useContenthook } from "@/hooks/useContent";

export default function Navbar() {
  const context = useContext(useContenthook);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 md:px-6 py-2 backdrop-blur-md bg-[#FDEEE2]/90 transition-all duration-200">

      <div className="block md:hidden w-full bg-white rounded-2xl sm:rounded-3xl px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-orange-100/60">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-0.5 select-none shrink-0">
            <span className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">Talk</span>
            <span className="text-base sm:text-lg font-bold text-[#FF6B35] tracking-tight flex items-center gap-0.5">
              Tamila
              <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${buttonVariants({ variant: "default" })} flex items-center justify-center gap-[1px] shrink-0 shadow-xs ml-0.5`}>
                <span className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] rounded-full bg-white inline-block"></span>
                <span className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] rounded-full bg-white inline-block"></span>
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-gray-500 hover:text-[#FF6B35] active:bg-orange-50 transition-colors"
              aria-label="Toggle Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-[18px] sm:h-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                if (context) {
                  context.setActiveTab('quickstudio');
                  context.setHandlestate(false);
                  context.setAnalyticsState(false);
                }
              }}
              className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full ${buttonVariants({ variant: "default" })} text-white shadow-xs active:scale-95 transition-all cursor-pointer`}
              title="AI Assistant"
            >
             <svg xmlns="http://w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.904L9 9l.813 5.096L15 15l-5.187.904zM19.071 4.929l-.354 2.213-2.213.354 2.213.354.354 2.213.354-2.213 2.213-.354-2.213-.354-.354-2.213z" />
            </svg>
            </button>

            <button
              type="button"
              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-gray-500 hover:text-[#FF6B35] active:bg-orange-50 transition-colors relative"
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF6B35] rounded-full"></span>
            </button>

            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1A3B5C] border border-[#102A45] cursor-pointer shrink-0 relative overflow-hidden shadow-inner">
              <Image src="/Images/avatar4.png" alt="User Profile" fill sizes="32px" className="object-cover" priority />
            </div>
          </div>
        </div>

        {isMobileSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="mt-2.5 pt-2.5 border-t border-gray-100 animate-fadeIn">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search News, Topic..."
                className="w-full bg-[#fce6d4f6] text-gray-800 placeholder-gray-400 pl-9 pr-4 py-2 rounded-full outline-none border border-transparent focus:border-[#FF6B35]/40 text-xs sm:text-sm"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>

      <div className="hidden md:flex w-full max-w-7xl 2xl:max-w-[1770px] mt-0.5 rounded-full px-4 md:px-6 py-2 md:py-2.5 mx-auto items-center justify-between gap-3 md:gap-4 bg-white shadow-md border border-[#FFEFE0]">

        <div className="flex items-center gap-1 shrink-0 select-none">
          <span className="text-lg md:text-xl font-bold text-black tracking-tight">Talk</span>
          <span className="text-lg md:text-xl font-bold text-brand tracking-tight flex items-center gap-1.5">
            Tamila
            <span className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${buttonVariants({ variant: "default" })} flex items-center justify-center gap-0.5 shrink-0 shadow-xs`}>
              <span className="w-1 h-1 rounded-full bg-white inline-block"></span>
              <span className="w-1 h-1 rounded-full bg-white inline-block"></span>
            </span>
          </span>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3.5 md:left-4 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search News, Topic..."
              className="w-full bg-[#FDEEE2] text-gray-800 placeholder-gray-400 pl-9 md:pl-12 pr-4 py-2 md:py-2.5 rounded-full outline-none border border-transparent focus:border-brand/30 transition-all text-xs md:text-sm"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (context) {
                context.setActiveTab('quickstudio');
                context.setHandlestate(false);
                context.setAnalyticsState(false);
              }
            }}
            className={`flex items-center gap-1 ${buttonVariants({ variant: "default" })} text-white p-2 md:px-3.5 md:py-2 rounded-full text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer`}
            title="AI Assistant"
          >
           <svg xmlns="http://w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.904L9 9l.813 5.096L15 15l-5.187.904zM19.071 4.929l-.354 2.213-2.213.354 2.213.354.354 2.213.354-2.213 2.213-.354-2.213-.354-.354-2.213z" />
            </svg>
            <span className="hidden lg:inline">AI</span>
          </button>

          <button type="button" className={`p-2 rounded-full ${buttonVariants({ variant: "bgcolor" })} active:scale-95 transition-all cursor-pointer`} title="Messages">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M16.5 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M12 18.75c4.97 0 9-3.47 9-7.75s-4.03-7.75-9-7.75-9 3.47-9 7.75c0 1.63.58 3.14 1.55 4.35l-1.373 3.3a.75.75 0 0 0 .924.996l3.376-1.125a9.191 9.191 0 0 0 4.524 1.181Z" />
            </svg>
          </button>

          <button type="button" className={`p-2 rounded-full ${buttonVariants({ variant: "bgcolor" })} active:scale-95 transition-all relative cursor-pointer`} title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full"></span>
          </button>

          <div className="flex items-center gap-1 cursor-pointer group">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden relative border border-brand/20 group-hover:border-brand transition-colors">
              <Image src="/Images/avatar4.png" alt="User Profile" fill sizes="(max-width: 768px) 32px, 36px" className="object-cover" />
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-gray-500 group-hover:text-brand transition-colors hidden lg:block">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

      </div>
    </header>
  );
}
