'use client';

import { useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { buttonVariants } from '../ui/Button';
import { useContenthook } from '@/hooks/useContent';
import { useAuthRole } from '@/hooks/useAuthRole';
import { CreatenewPost } from "@/components/admin/dashboard/CreatenewPost";
import { Adminreviewpanel } from "@/components/admin/dashboard/Adminreviewpanel";
import { Performanceacrossplatform } from "@/components/admin/dashboard/Performanceacrossplatform";

import { Radar } from 'lucide-react';
import { QuickStudio } from '../admin/dashboard/QuickStudio';

export default function BottomNavigation() {

  const context = useContext(useContenthook);
  const router = useRouter();
  const pathname = usePathname();
  const { isMounted: mounted, isInfluencer,isAdmin,isFreelancer  } = useAuthRole();

  
    
  if (!context) {
    throw new Error("BottomNavigation must be used within a UseContentProvider");
  }
  const { handlestate, setHandlestate, activeTab, setActiveTab, analyticsState, setAnalyticsState } = context;

  useEffect(() => {
    if (activeTab === 'wallet' || activeTab === 'quickstudio') return;
    if (pathname === '/admin' || pathname === '/influencer' || pathname === '/freelancer') {
      setActiveTab('home');
    } else if (pathname === '/admin/content' || pathname === '/influencer/content' || pathname === '/freelancer/content') {
      setActiveTab('content');
    } else if (pathname === '/admin/trendradar' || pathname === '/influencer/trendradar' || pathname === '/freelancer/trendradar') {
      setActiveTab('ai');
    }
  }, [pathname, setActiveTab]);

  const handlepostcard = () => {
    const newState = !handlestate;
    setHandlestate(newState);
    if (newState) {
      if (pathname === '/admin/content' || pathname === '/influencer/content' || pathname === '/freelancer/content') {
        setActiveTab('content');
      } else {
        setActiveTab('home');
      }
      setAnalyticsState(false);
    }
  }
  return (
    <>
      <div className="fixed bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 md:bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-auto md:min-w-[440px] md:max-w-sm select-none transform-gpu pb-[env(safe-area-inset-bottom,0px)] mx-auto">

        <nav className="w-full border-brand/60 backdrop-blur-lg rounded-2xl md:rounded-full px-1.5 xs:px-3 sm:px-6 md:px-4 py-1.5 md:py-1.5 flex items-center justify-around md:justify-between shadow-[0_8px_30px_rgba(0,0,0,0.1)] md:shadow-[0_8px_30px_rgb(242,125,66,0.12)] border border-[#FFEFE0] bg-white/90">

          <button
            onClick={() => {
              setActiveTab('home');
              setHandlestate(false);
              setAnalyticsState(false);
              router.push(isFreelancer ? '/freelancer' : isInfluencer ? '/influencer' : '/admin');
            }}
            type="button"
            aria-label="Home"
            className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${activeTab === 'home' ? `${buttonVariants({ variant: "default" })}` : `${buttonVariants({ variant: "secondary" })}`
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-4 md:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </button>

          <button
            onClick={() => {
              setActiveTab('content');
              setHandlestate(false);
              setAnalyticsState(false);
              router.push(isFreelancer ? '/freelancer/content' : isInfluencer ? '/influencer/content' : '/admin/content');
            }}
            type="button"
            aria-label="Content Schedule"
            className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${activeTab === 'content' ? `${buttonVariants({ variant: "default" })}` : `${buttonVariants({ variant: "secondary" })}`
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-4 md:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </button>

          <div className="relative -mt-4 xs:-mt-5 sm:-mt-7 md:-mt-5 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] rounded-full blur-md opacity-40 scale-105"></div>

            <button
              type="button"
              onClick={() => handlepostcard()}
              className={`relative w-10 h-10 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-12 md:h-12 rounded-full ${buttonVariants({ variant: "destructive" })} flex items-center justify-center font-bold text-lg xs:text-xl sm:text-2xl shadow-lg border-2 xs:border-4 border-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer z-10`}
              title="Create New"
              aria-label="Create New Post"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              if (isInfluencer) {
                router.push('/influencer/analytics')
              }else if(isFreelancer){
                 return null
              }
             
              setActiveTab('wallet');
              setHandlestate(false);
              setAnalyticsState(false);
            }}
            type="button"
            aria-label="Wallet"
            className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${activeTab === 'wallet' ? `${buttonVariants({ variant: "default" })}` : `${buttonVariants({ variant: "secondary" })}`
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-4 md:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </button>

          <button
            onClick={() => {
             
              if (isInfluencer) {
                router.push('/influencer/trendradar')
              }else if(isFreelancer){
                 return null
              }else{
                router.push("/admin/trendradar")
              }
               setActiveTab('ai');
              setHandlestate(false);
              setAnalyticsState(false);
            }}
            type="button"
            aria-label="AI Spark"
            className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${activeTab === 'ai' ? `${buttonVariants({ variant: "default" })}` : `${buttonVariants({ variant: "secondary" })}`
              }`}
          >
            <Radar className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-4 md:h-4" />
          </button>

        </nav>
      </div>

      {mounted && handlestate && createPortal(
        <div className="p-2">
          <CreatenewPost />
        </div>,
        document.body
      )}

      {mounted && !isInfluencer && activeTab === 'wallet' && createPortal(
        <div className="p-2">
          <Adminreviewpanel />
        </div>,
        document.body
      )}

      {mounted && activeTab === 'quickstudio' && createPortal(
        <div className="p-2">
          <QuickStudio />
        </div>,
        document.body
      )}

      {mounted && analyticsState && createPortal(
        <div className="p-2">
          <Performanceacrossplatform />
        </div>,
        document.body
      )}
    </>
  );
}

