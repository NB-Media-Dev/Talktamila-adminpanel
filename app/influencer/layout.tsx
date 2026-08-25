import BottomNavigation from '@/components/layout/BottomNavigation';
import Navbar from '@/components/layout/Navbar';
import React from 'react';


export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="max-w-7xl 2xl:max-w-[1770px]  px-2 sm:px-4 py-2 pb-16">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}

