import React from 'react';
import Navbar from '@/components/layout/Navbar';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="w-full max-w-[1770px] mx-auto px-2 sm:px-4 md:px-6 py-2 pb-28 md:pb-28">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}