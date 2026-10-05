import React from 'react';
import Navbar from '@/components/layout/Navbar';
import BottomNavigation from '@/components/layout/BottomNavigation';
import CallProvider from '@/components/calls/CallProvider';
import MessageNotifications from '@/components/messages/MessageNotifications';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CallProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="w-full px-2 sm:px-4 md:px-6 py-2 pb-28 md:pb-28">
          {children}
        </main>
        <BottomNavigation />
        <MessageNotifications />
      </div>
    </CallProvider>
  );
}