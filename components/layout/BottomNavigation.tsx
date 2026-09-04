'use client';

import { useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { buttonVariants } from '../ui/Button';
import { useContenthook } from '@/hooks/useContent';
import { useAuthRole } from '@/hooks/useAuthRole';
import { CreatenewPost } from "@/components/admin/dashboard/CreatenewPost";
import { Adminreviewpanel } from "@/components/admin/dashboard/Adminreviewpanel";
import { Performanceacrossplatform } from "@/components/admin/dashboard/Performanceacrossplatform";

import {  TrendingUp, UploadCloud, ClipboardCheck } from 'lucide-react';
import { QuickStudio } from '../admin/dashboard/QuickStudio';


export default function BottomNavigation() {

  const context = useContext(useContenthook);
  const router = useRouter();
  const pathname = usePathname();
  const { isMounted: mounted, isInfluencer, isFreelancer } = useAuthRole();



  if (!context) {
    throw new Error("BottomNavigation must be used within a UseContentProvider");
  }
  const { handlestate, setHandlestate, activeTab, setActiveTab, analyticsState, setAnalyticsState } = context;

  useEffect(() => {
    if (pathname === '/admin' || pathname === '/influencer' || pathname === '/freelancer') {
      setActiveTab('home');
    } else if (pathname === '/admin/content' || pathname === '/influencer/content' || pathname === '/freelancer/content') {
      setActiveTab('content');
    } else if (pathname === '/admin/trendradar' || pathname === '/influencer/trendradar' || pathname === null) {
      setActiveTab('ai');
    } else if (pathname === '/influencer/analytics') {
      setActiveTab('wallet');
    } else {
      setActiveTab('home');
      setHandlestate(false);
      setAnalyticsState(false);
    }
  }, [pathname, setActiveTab, setHandlestate, setAnalyticsState]);

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
      <div className="fixed bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 md:bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] md:max-w-xl lg:w-[calc(50%-3rem)] 2xl:w-[calc(50%-3rem)] min-[2560px]:w-[calc(50%-3.5rem)] min-[3840px]:w-[calc(50%-3.5rem)] select-none transform-gpu pb-[env(safe-area-inset-bottom,0px)] mx-auto">

        <nav className="w-full border-brand/60 backdrop-blur-lg rounded-2xl md:rounded-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 2xl:px-12 min-[3840px]:px-16 py-1.5 md:py-2 min-[3840px]:py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.1)] md:shadow-[0_8px_30px_rgb(242,125,66,0.12)] border border-[#FFEFE0] bg-[#FDEEE2]">

          <button
            onClick={() => {

              if (isInfluencer) {
                router.push('/influencer/trendradar')
              } else if (isFreelancer) {
                return null
              } else {
                router.push("/admin/trendradar")
              }
              setActiveTab('ai');
              setHandlestate(false);
              setAnalyticsState(false);
            }}
            type="button"
            aria-label="Trend Radar"
            className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-9 md:h-9 2xl:w-11 2xl:h-11 min-[3840px]:w-14 min-[3840px]:h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${buttonVariants({ variant: "default" })}`
            }
          >
            <TrendingUp className="h-4 w-4 2xl:h-5 2xl:w-5 min-[3840px]:h-7 min-[3840px]:w-7" />
          </button>

          <button

            onClick={() => handlepostcard()}
            type="button"
            title="Create New"
            aria-label="Create New Post"
            className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-9 md:h-9 2xl:w-11 2xl:h-11 min-[3840px]:w-14 min-[3840px]:h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${buttonVariants({ variant: "default" })}`
            }
          >
            <UploadCloud className="h-4 w-4 sm:h-5 sm:w-5 2xl:h-5 2xl:w-5 min-[3840px]:h-7 min-[3840px]:w-7" />
          </button>

          <div className="relative -mt-4 xs:-mt-5 sm:-mt-7 md:-mt-5 2xl:-mt-6 min-[3840px]:-mt-8 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] rounded-full blur-md opacity-40 scale-105"></div>

            <button
              type="button"

              className={`relative w-10 h-10 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-12 md:h-12 2xl:w-14 2xl:h-14 min-[3840px]:w-18 min-[3840px]:h-18 rounded-full ${buttonVariants({ variant: "destructive" })} flex items-center justify-center font-bold text-lg xs:text-xl sm:text-2xl shadow-lg border-2 xs:border-4 border-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer z-10`}

              onClick={() => {
                setActiveTab('home');
                setHandlestate(false);
                setAnalyticsState(false);
                let homeRoute = '/admin';
                if (isFreelancer) {
                  homeRoute = '/freelancer';
                } else if (isInfluencer) {
                  homeRoute = '/influencer';
                }
                router.push(homeRoute);
              }}

              aria-label="Home"
            >
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 2xl:w-6 2xl:w-6 min-[3840px]:w-8 min-[3840px]:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => {
              if (isInfluencer) {
                router.push('/influencer/analytics')
              } else if (isFreelancer) {
                return null
              }

              setActiveTab('wallet');
              setHandlestate(false);
              setAnalyticsState(false);
            }}
            type="button"
            aria-label="Admin Review Panel"
            className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-9 md:h-9 2xl:w-11 2xl:h-11 min-[3840px]:w-14 min-[3840px]:h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${buttonVariants({ variant: "default" })}`
            }
          >
            <ClipboardCheck className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 2xl:w-5 2xl:w-5 min-[3840px]:w-7 min-[3840px]:w-7" />
          </button>

          <button
            onClick={() => {
              setActiveTab('quickstudio');
              setHandlestate(false);
              setAnalyticsState(false);
            }}
            type="button"
            aria-label="Quick Studio"
            className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-9 md:h-9 2xl:w-11 2xl:h-11 min-[3840px]:w-14 min-[3840px]:h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${buttonVariants({ variant: "default" })}`
            }
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 2xl:w-5 2xl:w-5 min-[3840px]:w-7 min-[3840px]:w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.904L9 9l.813 5.096L15 15l-5.187.904zM19.071 4.929l-.354 2.213-2.213.354 2.213.354.354 2.213.354-2.213 2.213-.354-2.213-.354-.354-2.213z" />
            </svg>
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

