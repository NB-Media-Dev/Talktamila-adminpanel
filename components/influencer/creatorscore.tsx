"use client";

import React from "react";

export interface ScoreMetric {
  label: string;
  score: number;
  maxScore: number;
}

interface CreatorScoreProps {
  score?: number;
  status?: string;
  metrics?: ScoreMetric[];
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
}: CreatorScoreProps) {
  // SVG gauge constants
  const radius = 46;
  const circumference = 2 * Math.PI * radius; // ~289
  const arcDegree = 240;
  const arcLength = (arcDegree / 360) * circumference; // ~192.7
  const filledArc = (score / 100) * arcLength;

  return (
    <div className="w-full bg-white rounded-[20px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] select-none">
     
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h3 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
          Creator Score
        </h3>
        <span className="px-3 sm:px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8F8F0] text-[#10B981] border border-[#BCECD2]">
          {status}
        </span>
      </div>

    
      <div className="flex flex-col xs:flex-row items-center justify-between gap-4 sm:gap-6">
     
        <div className="relative flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 shrink-0">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="creatorScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Background Arc */}
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

            {/* Filled Progress Arc */}
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
            <span className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-none tracking-tight">
              {score}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400 mt-0.5 sm:mt-1">
              /100
            </span>
          </div>
        </div>

       
        <div className="w-full xs:flex-1 flex flex-col gap-2.5 sm:gap-3 min-w-0">
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
    </div>
  );
}

