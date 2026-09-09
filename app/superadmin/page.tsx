import { PlatformOverviewStats } from "@/components/superadmin/PlatformOverviewStats";
import { AdminManagement } from "@/components/superadmin/AdminManagement";
import { PlatformRevenueOverview } from "@/components/superadmin/PlatformRevenueOverview";
import { PlatformSettings } from "@/components/superadmin/PlatformSettings";

export default function SuperAdminPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:gap-5 pt-2">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Super Admin Control Center
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Platform-wide oversight — admin management, revenue, and global settings
        </p>
      </div>

      <PlatformOverviewStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
          <AdminManagement />
          <PlatformSettings />
        </div>

        <div className="lg:col-span-1">
          <PlatformRevenueOverview />
        </div>
      </div>
    </div>
  );
}
