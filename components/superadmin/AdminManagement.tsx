"use client";

import { useState } from "react";
import { UserPlus, ShieldOff, ShieldCheck, MoreVertical } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { TableSkeleton } from "@/components/ui/Skeletonloading";

// Mock data — this is where a real GET /superadmin/admins call will plug in later.
type AdminRow = {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended";
  joinedOn: string;
};

const initialAdmins: AdminRow[] = [
  { id: "1", name: "Priya Raman", email: "priya@talktamila.com", status: "active", joinedOn: "12 Jan 2026" },
  { id: "2", name: "Arun Kumar", email: "arun@talktamila.com", status: "active", joinedOn: "03 Mar 2026" },
  { id: "3", name: "Divya S", email: "divya@talktamila.com", status: "suspended", joinedOn: "22 Jun 2026" },
];

export function AdminManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminRow[]>(initialAdmins);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  UsetimeoutLoader(setIsLoading);

  // Placeholder toggle — swap this for a real PATCH /superadmin/admins/{id}
  // call once the backend endpoint exists. Kept local-only for now so the
  // UI is demonstrable without a live API.
  const toggleStatus = (id: string) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === id
          ? { ...admin, status: admin.status === "active" ? "suspended" : "active" }
          : admin
      )
    );
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Admin Accounts
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Only Super Admin can create or suspend Admin accounts
          </p>
        </div>
        <button
          type="button"
          className={`flex items-center gap-1.5 ${buttonVariants({ variant: "default" })} text-white px-3.5 py-2 text-xs sm:text-sm font-semibold shadow-xs active:scale-95`}
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden xs:inline">New Admin</span>
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#1A3B5C] shrink-0 flex items-center justify-center text-white text-xs font-bold">
                  {admin.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {admin.name}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{admin.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    admin.status === "active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {admin.status === "active" ? "Active" : "Suspended"}
                </span>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(openMenuId === admin.id ? null : admin.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors cursor-pointer"
                    aria-label="Admin actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openMenuId === admin.id && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-orange-100 p-1.5 z-20">
                      <button
                        type="button"
                        onClick={() => toggleStatus(admin.id)}
                        className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50/80 rounded-lg w-full text-left cursor-pointer"
                      >
                        {admin.status === "active" ? (
                          <>
                            <ShieldOff className="w-3.5 h-3.5 text-red-500" />
                            Suspend account
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            Reactivate account
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
