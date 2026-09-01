import CreatorStats from "@/components/admin/RightPanel/CreatorStats";
import CreatorWallet from "@/components/admin/RightPanel/CreatorWallet";

export default function Page() {
  return (
    <div className="min-h-screen w-full  p-4 sm:p-6 md:p-8 flex justify-center">
      <div className="w-full max-w-md space-y-5">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Report Details
        </h1>
        <CreatorStats />
        <CreatorWallet />
      </div>
    </div>
  );
}
