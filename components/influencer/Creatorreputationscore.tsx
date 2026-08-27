"use client";

import Link from "next/link";

interface ReputationMetric {
  label: string;
  score: number;
  maxScore: number;
}

const metrics: ReputationMetric[] = [
  { label: "Trust Score", score: 90, maxScore: 100 },
  { label: "Consistency", score: 85, maxScore: 100 },
  { label: "Engagement", score: 88, maxScore: 100 },
  { label: "Content Quality", score: 92, maxScore: 100 },
  { label: "Originality", score: 86, maxScore: 100 },
];

export default function CreatorReputationScore() {
  const overallScore = 87;
  const ratingText = "Excellent";

  return (
    <div className="w-[350px] bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col select-none">

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Creator Reputation Score
        </h2>
        <Link
          href="/influencer/analytics"
          className="text-xs sm:text-sm font-semibold text-[#FF6B35] hover:text-[#D9652B] transition-colors whitespace-nowrap"
        >
          View Details
        </Link>
      </div>


      <div className="flex items-center gap-3 mt-1">

        <div className="relative flex-shrink-0 flex items-center justify-center w-28 h-28">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="160 226.19"
              strokeDashoffset="0"
              transform="rotate(135 50 50)"
            />

            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="url(#scoreGaugeGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="160 226.19"
              strokeDashoffset={0 * (1 - overallScore / 100)}
              transform="rotate(190 50 50)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>


          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none">
              {overallScore}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 mt-1">
              {ratingText}
            </span>
          </div>
        </div>


        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
          {metrics.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 w-[82px] shrink-0 truncate">
                {item.label}
              </span>
              <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF6B35] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold whitespace-nowrap shrink-0">
                <span className="text-emerald-500">{item.score}</span>
                <span className="text-gray-400 font-normal">/{item.maxScore}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
