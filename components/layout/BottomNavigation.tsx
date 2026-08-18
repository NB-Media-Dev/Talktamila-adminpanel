'use client';

import { useContext, useState } from 'react';
import { buttonVariants } from '../ui/Button';
import { useContenthook } from '@/hooks/useContent';

export default function BottomNavigation() {

   const context = useContext(useContenthook);

     if (!context) {
    throw new Error("BottomNavigation must be used within a UseContentProvider");
  }
  const { handlestate, setHandlestate, activeTab, setActiveTab, setAnalyticsState } = context;

  const handlepostcard=()=>{
    const newState = !handlestate;
    setHandlestate(newState);
    if (newState) {
      setActiveTab('home');
      setAnalyticsState(false);
    }
  }

  return (
    <div className="fixed bottom-2 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4 md:bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] md:w-auto md:min-w-[340px] md:max-w-sm select-none transform-gpu pb-[env(safe-area-inset-bottom,0px)] mx-auto">
      
      <nav className="w-full border-brand/60 backdrop-blur-lg rounded-2xl md:rounded-full px-4 sm:px-6 md:px-4 py-2.5 md:py-1.5 flex items-center justify-around md:justify-between shadow-[0_8px_30px_rgba(0,0,0,0.1)] md:shadow-[0_8px_30px_rgb(242,125,66,0.12)] border border-[#FFEFE0]">
    
        <button 
          onClick={() => { setActiveTab('home'); setHandlestate(false); setAnalyticsState(false); }}
          type="button" 
          aria-label="Home"
          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
            activeTab === 'home' ? `${buttonVariants({variant:"default"})}` : `${buttonVariants({variant:"secondary"})}`
          }`}
        >
          <svg xmlns="http://w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </button>

     
        <button 
          onClick={() => { setActiveTab('upload'); setHandlestate(false); setAnalyticsState(false); }}
          type="button" 
          aria-label="Profile"
          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
            activeTab === 'upload' ?  `${buttonVariants({variant:"default"})}` : `${buttonVariants({variant:"secondary"})}`
          }`}
        >
          <svg
            xmlns="http://w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 21a8.25 8.25 0 0 1 15 0"
            />
          </svg>
        </button>

        <div className="relative -mt-6 sm:-mt-7 md:-mt-5 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] rounded-full blur-md opacity-40 scale-105"></div>
          
          <button 
            type="button"
            onClick={()=>handlepostcard()}
            className={`relative w-12 h-12 sm:w-13 sm:h-13 md:w-12 md:h-12 rounded-full ${buttonVariants({variant:"destructive"})} flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg border-4 border-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer z-10`}
            title="Create New"
            aria-label="Create New Post"
          >
            +
          </button>
        </div>

     
        <button 
          onClick={() => { setActiveTab('wallet'); setHandlestate(false); setAnalyticsState(false); }}
          type="button" 
          aria-label="Wallet"
          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
            activeTab === 'wallet' ?  `${buttonVariants({variant:"default"})}` : `${buttonVariants({variant:"secondary"})}`
          }`}
        >
          <svg xmlns="http://w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        </button>

       
        <button 
          onClick={() => { setActiveTab('ai'); setHandlestate(false); setAnalyticsState(false); }}
          type="button" 
          aria-label="AI Spark"
          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
            activeTab === 'ai' ?  `${buttonVariants({variant:"default"})}` : `${buttonVariants({variant:"secondary"})}`
          }`}
        >
          <svg xmlns="http://w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.904L9 9l.813 5.096L15 15l-5.187.904zM19.071 4.929l-.354 2.213-2.213.354 2.213.354.354 2.213.354-2.213 2.213-.354-2.213-.354-.354-2.213z" />
          </svg>
        </button>

      </nav>
    </div>
  );
}


