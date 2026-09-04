"use client";

import  { useState } from "react";
import { buttonVariants } from "../ui/Button";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import {  ContentSkeleton } from "@/components/ui/Skeletonloading";

export interface ScoreMetric {
  label: string;
  score: number;
  maxScore: number;
}

interface CreatorScoreProps {
  score?: number;
  status?: string;
  metrics?: ScoreMetric[];
  isLoading?: boolean;
}

const defaultMetrics: ScoreMetric[] = [
  { label: "Content Quality", score: 90, maxScore: 100 },
  { label: "Engagement", score: 85, maxScore: 100 },
  { label: "Consistency", score: 88, maxScore: 100 },
  { label: "Growth", score: 89, maxScore: 100 },
];

export default function CreatorScore({
  score = 87,
  status = "Good",
  metrics = defaultMetrics,
  isLoading: propIsLoading,
}: CreatorScoreProps) {
  const [isLoading, setIsLoading] = useState(propIsLoading ?? true);
  UsetimeoutLoader(setIsLoading);

 

  const radius = 46;
  const circumference = 2 * Math.PI * radius; 
  const arcDegree = 240;
  const arcLength = (arcDegree / 360) * circumference; 
  const filledArc = (score / 100) * arcLength;

  return (
    <div className="w-full bg-white rounded-[20px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] select-none">
     
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h3 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
          Creator Score
        </h3>
        
        <span className={` ${buttonVariants({variant:'sucess'})} px-2 text-xs sm:text-sm `}>
          {status}
        </span>
      </div>

    {isLoading ? <ContentSkeleton count={3} height="h-[50px]" width="w-full"/> :
     <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-between gap-4 sm:gap-5">
       
        <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 md:w-28 md:h-28 lg:w-36 lg:h-36 shrink-0">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="creatorScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

           
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
              transform="rotate(150 60 60)"
            />

            
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#creatorScoreGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${filledArc} ${circumference}`}
              transform="rotate(150 60 60)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

         
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-none tracking-tight">
              {score}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400 mt-0.5 sm:mt-1">
              /100
            </span>
          </div>
        </div>

      
        <div className="w-full sm:flex-1 md:w-full lg:flex-1 flex flex-col gap-2.5 sm:gap-3 min-w-0">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-xs sm:text-sm font-medium"
            >
              <span className="text-gray-700 truncate pr-2">
                {item.label}
              </span>
              <div className="whitespace-nowrap">
                <span className="text-[#10B981] font-bold">{item.score}</span>
                <span className="text-gray-400 font-medium">/{item.maxScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    }
     
    </div>
  );
}

