import BottomNavigation from "@/components/layout/BottomNavigation";
import Navbar from "@/components/layout/Navbar";



export default function freelanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="w-full px-2 sm:px-4 md:px-6 py-2 pb-28 md:pb-28">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}

