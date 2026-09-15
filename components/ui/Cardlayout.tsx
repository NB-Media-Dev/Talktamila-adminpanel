// components/SidebarCard.tsx
import * as React from "react";

interface SidebarCardProps {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  skeleton?: React.ReactNode;
  className?: string;
}

export function Cardlayout({
  title,
  icon,
  action,
  children,
  isLoading = false,
  skeleton,
  className = "",
}: SidebarCardProps) {
  return (
    <div
      className={`w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>

          {!isLoading && action && (
            <div className="text-xs sm:text-sm font-medium text-orange-600 cursor-pointer">
              {action}
            </div>
          )}
        </div>

        <div className="flex flex-col">{isLoading ? skeleton : children}</div>
      </div>
    </div>
  );
}
