"use client";

import Image, { StaticImageData } from "next/image";
import { LocationsIcons } from "@/public/Svgicons/svgicons";
import React from "react";

export interface FeedCardheaderProps {
  avatar: string | StaticImageData;
  name: string;
  username: string;
  location: string;
  time: string;
  rightElement?: React.ReactNode;
}

export function FeedCardheader({
  avatar,
  name,
  username,
  location,
  time,
  rightElement,
}: FeedCardheaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full overflow-hidden relative border border-[#FFEFE0] bg-gray-50 shrink-0">
          <Image
            src={avatar}
            alt={`${name} Avatar`}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-gray-900 leading-none">{name}</span>
            <span className="text-[#8E8E93] text-xs font-normal">{username}</span>
          </div>
          <div className="flex items-center gap-1 text-[#8E8E93] mt-0.5">
            <LocationsIcons />
            <span className="text-[0.6875rem]">{location}</span>
            <span className="text-[0.6875rem]">•</span>
            <span className="text-[0.6875rem]">{time}</span>
          </div>
        </div>
      </div>

      {rightElement}
    </div>
  );
}
