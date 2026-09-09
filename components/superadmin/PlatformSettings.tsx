"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";

// Local-only toggle state for now — wire each of these to a real
// PATCH /superadmin/settings endpoint once it exists. These are the
// platform-wide switches only a Super Admin should be able to flip —
// a regular Admin approves/rejects individual posts, but shouldn't be
// able to change the rules everyone plays by.
const initialSettings = [
  {
    key: "require_approval",
    label: "Require admin approval before publishing",
    description: "Turning this off lets influencer posts go live immediately",
    enabled: true,
  },
  {
    key: "freelancer_eligibility",
    label: "Auto-enable freelancer sharing on stalled posts",
    description: "Uses the growth-rate check to open posts to freelancers",
    enabled: true,
  },
  {
    key: "maintenance_mode",
    label: "Maintenance mode",
    description: "Temporarily blocks all non-admin logins",
    enabled: false,
  },
];

export function PlatformSettings() {
  const [settings, setSettings] = useState(initialSettings);

  const toggle = (key: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-4 h-4 text-[#FF6B35]" />
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Platform Settings
        </h2>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">{setting.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{setting.description}</div>
            </div>

            <button
              type="button"
              onClick={() => toggle(setting.key)}
              aria-pressed={setting.enabled}
              aria-label={setting.label}
              className={`w-11 h-6 rounded-full shrink-0 relative transition-colors duration-200 cursor-pointer ${
                setting.enabled ? "bg-[#FF6B35]" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  setting.enabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
