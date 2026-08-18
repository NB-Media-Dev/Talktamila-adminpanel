import React from 'react';
import Navbar from '@/components/layout/Navbar';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl 2xl:max-w-[1770px] ms-5 px-2 sm:px-4 py-2 pb-16">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}