"use client";

import React, { useState, useContext, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Wallet, Settings, LogOut, ChevronDown } from "lucide-react";
import { buttonVariants } from "../ui/Button";
import Image from "next/image";
import { useContenthook } from "@/hooks/useContent";
import { useAuthRole } from "@/hooks/useAuthRole";
import avatar2 from "@/public/Images/profile2.jpg";

export default function Navbar() {
  const context = useContext(useContenthook);
  const router = useRouter();
  const { isInfluencer, isFreelancer, isAdmin } = useAuthRole();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node) &&
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleProfileNavigation = (path: string, tab?: string) => {
    setIsProfileOpen(false);
    if (context) {
      context.setActiveTab(tab || 'home');
      context.setHandlestate(false);
      context.setAnalyticsState(false);
    }
    if (path) {
      return router.push(path);
    }
  };

  const getProfilePath = () => {
    if (isInfluencer) {
                return '/influencer'
              } else if (isFreelancer) {
                return '/freelancer'
              } else {
                return "/admin"
              }
  };

  const getWalletPath = () => {
    if (isInfluencer) {
                return '/influencer'
              } else if (isFreelancer) {
                return '/freelancer'
              } else {
                return "/admin/reports"
              }
  };

  const getSettingsPath = () => {
     if (isInfluencer) {
                return '/influencer'
              } else if (isFreelancer) {
                return '/freelancer'
              } else {
                return "/admin"
              }
  };

  const renderDropdownMenu = () => (
    <div className="absolute right-0 top-full mt-2 w-56 sm:w-60 bg-white rounded-2xl shadow-xl border border-orange-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">

      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FDEEE2]/60 mb-1 border border-orange-100/40">
        <div className="w-9 h-9 rounded-full overflow-hidden relative border border-[#FF6B35]/30 shrink-0">
          <Image src={avatar2} alt="User Profile" fill sizes="36px" className="object-cover" loading="lazy"/>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-bold text-gray-900 truncate">
            {isAdmin ? "Admin User" : isFreelancer ? "Freelancer Creator" : "Influencer Profile"}
          </span>
          <span className="text-[11px] text-gray-500 truncate">user@talktamila.com</span>
        </div>
      </div>

      <div className="h-[1px] bg-gray-100 my-1" />


      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => handleProfileNavigation(getProfilePath())}
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#FF6B35] hover:bg-orange-50/80 rounded-xl transition-colors w-full text-left cursor-pointer"
        >
          <User className="w-4 h-4 text-[#FF6B35]" />
          <span>My Profile</span>
        </button>

        <button
          type="button"
          onClick={() => handleProfileNavigation(getWalletPath())}
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#FF6B35] hover:bg-orange-50/80 rounded-xl transition-colors w-full text-left cursor-pointer"
        >
          <Wallet className="w-4 h-4 text-[#FF6B35]" />
          <span>Wallet</span>
        </button>

        <button
          type="button"
          onClick={() => handleProfileNavigation(getSettingsPath())}
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#FF6B35] hover:bg-orange-50/80 rounded-xl transition-colors w-full text-left cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#FF6B35]" />
          <span>Settings</span>
        </button>
      </div>

      <div className="h-[1px] bg-gray-100 my-1" />

      <button
        type="button"
        onClick={() => {
          setIsProfileOpen(false);
          try {
            localStorage.removeItem("user");
          } catch (e) { }
          router.push("/login");
        }}
        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left cursor-pointer"
      >
        <LogOut className="w-4 h-4 text-red-500" />
        <span>Log Out</span>
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 sm:z-40 z-50 w-full px-1.5 xs:px-2 sm:px-4 md:px-6 py-2 backdrop-blur-md bg-[#FDEEE2]/90 transition-all duration-200">


      <div className="block md:hidden w-full bg-white rounded-2xl sm:rounded-3xl px-2.5 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-orange-100/60">

        <div className="flex items-center justify-between gap-1">

          <div className="flex items-center gap-0.5 select-none shrink-0">
            <span className="text-sm xs:text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">Talk</span>
            <span className="text-sm xs:text-base sm:text-lg font-bold text-[#FF6B35] tracking-tight flex items-center gap-0.5">
              Tamila
              <span className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 rounded-full ${buttonVariants({ variant: "default" })} flex items-center justify-center gap-[1px] shrink-0 shadow-xs ml-0.5`}>
                <span className="w-[1.5px] h-[1.5px] xs:w-[2px] xs:h-[2px] sm:w-[2.5px] sm:h-[2.5px] rounded-full bg-white inline-block"></span>
                <span className="w-[1.5px] h-[1.5px] xs:w-[2px] xs:h-[2px] sm:w-[2.5px] sm:h-[2.5px] rounded-full bg-white inline-block"></span>
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 shrink-0">



            <button
              type="button"
              onClick={() => {
                if (context) {
                  context.setActiveTab('quickstudio');
                  context.setHandlestate(false);
                  context.setAnalyticsState(false);
                }
              }}
              className={`p-1.5 min-w-[32px] min-h-[32px] xs:p-2 xs:min-w-[36px] xs:min-h-[36px] flex items-center justify-center rounded-full ${buttonVariants({ variant: "default" })} text-white shadow-xs active:scale-95 transition-all cursor-pointer`}
              title="AI Assistant"
            >
              <svg xmlns="http://w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-4 md:h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.904L9 9l.813 5.096L15 15l-5.187.904zM19.071 4.929l-.354 2.213-2.213.354 2.213.354.354 2.213.354-2.213 2.213-.354-2.213-.354-.354-2.213z" />
              </svg>
            </button>

            <button
              type="button"
              className="p-1.5 min-w-[32px] min-h-[32px] xs:p-2 xs:min-w-[36px] xs:min-h-[36px] flex items-center justify-center rounded-full text-gray-500 hover:text-[#FF6B35] active:bg-orange-50 transition-colors relative"
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-[19px] sm:h-[19px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              <span className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 w-1.5 h-1.5 bg-[#FF6B35] rounded-full"></span>
            </button>

            <div className="relative" ref={mobileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-[#1A3B5C] border border-[#102A45] cursor-pointer shrink-0 relative overflow-hidden shadow-inner focus:outline-none block"
                aria-label="User Profile"
              >
                <Image src={avatar2} alt="User Profile" fill sizes="32px" className="object-cover" priority />
              </button>
              {isProfileOpen && renderDropdownMenu()}
            </div>
          </div>
        </div>


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


          <div className="relative" ref={desktopDropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 cursor-pointer group focus:outline-none"
              aria-label="User Profile Menu"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden relative border border-brand/20 group-hover:border-brand transition-colors">
                <Image src={avatar2} alt="User Profile" fill sizes="(max-width: 768px) 32px, 36px" className="object-cover" />
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 group-hover:text-brand transition-transform duration-200 hidden lg:block ${isProfileOpen ? "rotate-180 text-brand" : ""}`} />
            </button>
            {isProfileOpen && renderDropdownMenu()}
          </div>
        </div>

      </div>
    </header>
  );
}


