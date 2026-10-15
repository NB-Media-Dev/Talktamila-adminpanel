"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  FileText,
  Clock,
  BarChart3,
  TrendingUp,
  Landmark,
  BadgeCheckIcon,
  BanknoteArrowDown,
  PiggyBank,
  Repeat,
  MoveUpRight,
  ArrowRight,
  Video,
  Radio
} from "lucide-react";
import Hdfc from "@/components/admin/RightPanel/Withdrawbtn/Hdfc";
import Funds from "@/components/admin/RightPanel/Withdrawbtn/Withdrawfunds";
import State from "@/components/admin/RightPanel/Withdrawbtn/Statement";
import Image from "next/image";

export default function WithdrawPage() {
  const [transferAmount, setTransferAmount] = useState("12450");
  const [range, setRange] = useState("7 Days");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFundsModalOpen, setFundsModalOpen] = useState(false);
  const [isStatementModalOpen, setStatementModalOpen] = useState(false);

  const chartData = [
    { day: "Mon", impressions: 55, revenue: 40 },
    { day: "Tue", impressions: 64, revenue: 52 },
    { day: "Wed", impressions: 73, revenue: 65 },
    { day: "Thu", impressions: 48, revenue: 58 },
    { day: "Fri", impressions: 82, revenue: 76 },
    { day: "Sat", impressions: 68, revenue: 88 },
    { day: "Sun", impressions: 91, revenue: 72 },
  ];

  const topReposts = [
    {
      title: "Marina Beach Vibes • Sunday Sunset Reel",
      description: "Viral #1 • 88.4K Views • 94% Engagement",
      amount: "+₹1,200.00",
      label: "₹250/1k Views",
      image: "/images/marina.jpg",
    },
    {
      title: "CMRL Phase 2 Metro Tunnel Breakthrough",
      description: "Civic Beat • 54.1K Views • 15% Engagement",
      amount: "+₹850.00",
      label: "Community Bounty",
      image: "/images/cmrl.jpg",
    },
    {
      title: "Kollywood Box Office Weekend Analysis",
      description: "Cinema • 32.7K Views • 19% Engagement",
      amount: "+₹450.00",
      label: "Poll Synergy Share",
      image: "/images/kollywood.jpg",
    },
  ];

const settlements = [
  {
    title: "Repost Bounty Payout",
    date: "Today, 2:15 PM • Automated",
    amount: "+₹250.00",
    status: "Completed",
    icon: <Repeat size={14} className="text-[#E05319]" />,
    positive: true,
  },
  {
    title: "Sponsored Video Revenue",
    date: "Yesterday • Brand Tagged",
    amount: "+₹1,200.00",
    status: "Completed",
    icon: <Video size={14} className="text-[#E05319]" />,
    positive: true,
  },
  {
    title: "Bank Withdrawal",
    date: "May 12, 2025 • HDFC Bank",
    amount: "-₹10,000.00",
    status: "Settled",
    icon: <ArrowUpRight size={14} className="text-[#6E6E6A]" />,
    positive: false,
  },
  {
    title: "Live Townhall Speaker Fee",
    date: "May 10, 2025 • Tamil News Desk",
    amount: "+₹3,500.00" ,
    status: "In Escrow",
    icon: <Radio size={14} className="text-[#E05319]" />,
    positive: true,
  },
];



  return (
    <div className="w-full min-h-screen bg-[#AD330314] px-4 py-4 font-sans text-gray-800 md:px-6 md:py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

        <div className="flex w-full flex-col gap-6 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-col gap-3">

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60">
              <div className="flex items-center gap-1 border border-gray-200 bg-[#FFE3D5] text-black border-[#FFD2BE] px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-orange-500" />

                <span>Live Creator Wallet</span>
              </div>

              <span className="opacity-40">|</span>

              <span>Tamil Nadu Payment Gatway</span>
            </div>


            <div className="flex flex-wrap items-baseline gap-3 ">
              <p className="font-medium opacity-60">Available Balance:</p>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                ₹12,450.00
              </h1>

              <span className="rounded-md border bg-gray-50 px-2.5 py-0.5 text-sm font-semibold opacity-60">
                ≈ $150.00 USD
              </span>
            </div>


            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1 border border-gray-200 bg-[#FFF4E6] px-2 py-1 rounded-full ">
                <Landmark size={15} className="text-orange-500" />

                <span className="font-bold">HDFC Bank</span>

                <span className="opacity-40">••••1287(TDN/Karthick)</span>

                <span className="rounded-sm px-1.5 py-0.5 text-[12px] underline font-bold tracking-wide text-orange-500 cursor-pointer">
                  Change
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                <BadgeCheckIcon size={15} />

                <span>PAN & GST Verified</span>
              </div>
            </div>


            <p className="mt-1 text-[13px] font-medium opacity-50">
              • Next automated settlement: Tomorrow, 06:00 AM IST
            </p>
          </div>


          <div className="mt-auto flex items-center gap-3 sm:mt-0">
            {isFundsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <button
                    type="button"
                    className="absolute inset-0"
                    aria-label="Close transfer modal"
                    onClick={() => setFundsModalOpen(false)}
                  />

                  <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                    <Funds onClose={() => setFundsModalOpen(false)} />
                  </div>
                </div>
              )}
            <button
              type="button"
              onClick={() => setFundsModalOpen(true)}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-[0.98] sm:flex-initial sm:text-sm"
            >
              <BanknoteArrowDown size={16} />

              <span>Withdraw Funds</span>
            </button>

              {isStatementModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <button
                      type="button"
                      className="absolute inset-0"
                      aria-label="Close transfer modal"
                      onClick={() => setStatementModalOpen(false)}
                    />

                    <div className="relative z-10 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-200">
                      <State onClose={() => setStatementModalOpen(false)} />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setStatementModalOpen(true)}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-xs font-bold transition-all hover:bg-gray-50 sm:flex-initial sm:text-sm"
                >
                  <FileText size={16} className="opacity-60" />
                  <span>Statements</span>
                </button>

          </div>
        </div>


        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between text-[10px] font-bold uppercase tracking-wider opacity-60 sm:text-xs">
              <span>Pending Clearance</span>
              <div className="border border-orange-200 rounded-full w-8 h-8 bg-[#FFEFE6]  items-center justify-center flex">
                <Clock size={18} className="text-[#E05319]" />
              </div>
            </div>

            <h2 className="text-xl font-extrabold sm:text-2xl">
              ₹5,230.00
            </h2>

            <p className="mt-1 truncate text-[13px] font-medium opacity-50">
              • 3 board controls pending sign-off
            </p>
          </div>


          <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between text-[10px] font-bold uppercase tracking-wider opacity-60 sm:text-xs">
              <span>This Month&apos;s Income</span>
              <div className="border border-orange-200 rounded-full w-8 h-8 bg-[#FFEFE6]  items-center justify-center flex">
                <TrendingUp size={18} className="text-[#E05319]" />
              </div>
            </div>

            <h2 className="text-xl font-extrabold sm:text-2xl">
              ₹18,450.00
            </h2>

            <div className="mt-1 flex w-fit items-center gap-1 rounded-md bg-orange-50 px-1.5 py-0.5 text-[13px] font-bold ">

              <TrendingUp size={13} className="text-orange-600" />
              <span> <span className="text-orange-600">+24.2%</span> vs last 30 days</span>
            </div>
          </div>


          <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between text-[10px] font-bold uppercase tracking-wider opacity-60 sm:text-xs">
              <span>Lifetime Earnings</span>

              <div className="border border-gray-200 rounded-full w-8 h-8 bg-gray-200  items-center justify-center flex">
                <PiggyBank size={18} className="text-black" />
              </div>
            </div>

            <h2 className="text-xl font-extrabold sm:text-2xl">
              ₹84,200.00
            </h2>

            <p className="mt-1 text-[13px] font-medium opacity-50">
              Since joined Aug 2024 • Tier 3 Creator
            </p>
          </div>


          <div className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between text-[10px] font-bold uppercase tracking-wider opacity-60 sm:text-xs">
              <span>Active Repost Pool</span>
              <div className="border border-orange-200 rounded-full w-8 h-8 bg-[#FFEFE6]  items-center justify-center flex">
                <Repeat size={18} className="text-[#E05319]" />
              </div>
            </div>

            <h2 className="text-xl font-extrabold sm:text-2xl">
              ₹2,150.00
            </h2>

            <p className="mt-1 text-[13px] ">
              <span className="font-bold"> 8 viral stories</span>  currently accuring bounties
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="flex flex-col gap-6 lg:col-span-2">

            <div className="flex w-full flex-col gap-5 rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className="flex items-center gap-1.5 text-[25px] font-extrabold ">
                    <BarChart3 size={25} className="text-orange-500" />

                    <span>Repost Analytics</span>
                  </h3>

                  <p className="text-md font-medium opacity-50 pl-6">
                    Weekly performance on syndicated community content
                  </p>
                </div>

                <div className="flex items-center rounded-lg border bg-[#FFF4E6] border-[#FFD2BE] p-0.5 text-[10px] font-bold sm:text-xs">
                  {["7 Days", "30 Days", "All Time"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRange(item)}
                      className={`rounded-md px-2.5 py-1 transition ${range === item
                          ? "border bg-white text-orange-600 shadow-sm"
                          : "opacity-60 hover:bg-white"
                        }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-1 grid grid-cols-2 border border-gray-200 rounded-lg p-4 py-3 bg-[#FFF4E6] border-[#FFD2BE]">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold uppercase tracking-wider opacity-50">
                    Total Impressions
                  </span>

                  <div className="flex items-baseline gap-1">
                    <span className="text-[25px] font-extrabold">245K</span>

                    <MoveUpRight size={13} className="text-orange-500" />
                    <span className="text-[13px] font-bold text-orange-500">
                      +26.5%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col  pl-4">
                  <span className="text-[14px] font-bold uppercase tracking-wider opacity-50">
                    Earned Revenue
                  </span>

                  <div className="flex items-baseline gap-1">
                    <span className="text-[25px] font-extrabold  text-orange-600">
                      ₹4,850
                    </span>
                    <MoveUpRight size={13} className="text-orange-500" />
                    <span className="text-[13px] font-bold text-orange-500">
                      +18.4%
                    </span>
                  </div>
                </div>
              </div>


              <div className="relative h-56 w-full border-b pt-4">

                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-gray-100" />

                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-gray-100" />

                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-gray-100" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between px-2 text-[10px] font-bold opacity-60 sm:text-xs">
                  <h3>Earnings(₹) vs Impressions(K)</h3>
                  <div className="flex items-center gap-3">
                    <h4><span className="h-2.5 w-2.5 rounded-sm bg-orange-200 inline-block mr-1" /> Impressions</h4>
                    <h4><span className="h-2.5 w-2.5 rounded-sm bg-orange-600 inline-block mr-1" /> Revenue</h4>
                  </div>
                </div>

                <div className="relative z-10 flex h-full items-end justify-between gap-2 px-2">
                  {chartData.map((item) => (
                    <div
                      key={item.day}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div className="flex h-full w-full items-end justify-center gap-1 px-1">

                        <div
                          className="w-2.5 rounded-t-sm bg-orange-200 sm:w-4"
                          style={{
                            height: `${item.impressions}%`,
                          }}
                          title={`${item.day} impressions`}
                        />

                        <div
                          className="w-2.5 rounded-t-sm bg-orange-600 sm:w-4"
                          style={{
                            height: `${item.revenue}%`,
                          }}
                          title={`${item.day} revenue`}
                        />
                      </div>

                      <span className="text-[10px] font-semibold opacity-60">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>


              <div className="flex flex-wrap items-center justify-center gap-5 text-[10px] font-semibold opacity-60">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-orange-200" />
                  <span>Impressions</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-orange-600" />
                  <span>Revenue</span>
                </div>
              </div>
            </div>


            <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[25px] font-extrabold ">
                    Top Performing Reposts
                  </h3>

                  <p className="mt-0.5 text-[14px] font-medium opacity-50">
                    Stories Generating automated audience revenue sharing
                  </p>
                </div>

                <button
                  type="button"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer sm:text-sm"
                >
                  View All (28)
                </button>
              </div>

              <div className="flex flex-col ">
                {topReposts.map((item, index) => (
                  <div
                    key={item.title}
                    className={`flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between ${index !== topReposts.length - 1
                        ? "border-b border-gray-100"
                        : ""
                      }`}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={10}
                          height={10}
                          className="h-full w-full rounded-xl"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold">
                          {item.title}
                        </h4>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] w-fit tracking-wide shadow-xs transition-colors ${index === 0
                            ? "bg-[#FFE3D5] text-[#A23F16]"
                            : "bg-gray-100 text-gray-600 border border-gray-200/40"
                          }`}>
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-sm font-extrabold text-orange-600">
                        {item.amount}
                      </p>

                      <p className="mt-0.5 text-[10px] font-semibold opacity-50">
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="flex flex-col gap-6">

            <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold">
                    Instant Bank Transfer
                  </h3>
                </div>

                <div className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  100% Eligible
                </div>
              </div>


              <div className="mb-5 rounded-2xl bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
                    Threshold Reached(₹1,000 min)
                  </span>

                  <span className="text-xs font-extrabold">
                    ₹12,450 / ₹1,000
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-full rounded-full bg-orange-600" />
                </div>
              </div>

              <div className="mb-5 rounded-2xl border border-orange-100 bg-orange-50 p-4 flex justify-between items-center">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-extrabold">
                      IMPS / UPI 24x7 Express
                    </p>
                  </div>
                </div>

                <div className=" inline-flex rounded-md bg-white px-2 py-1 text-[10px] font-bold text-emerald-600">
                  Zero Processing Fees
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="transferAmount"
                    className="text-xs font-bold"
                  >
                    Enter Amount to Transfer (₹)
                  </label>

                  <button
                    type="button"
                    onClick={() => setTransferAmount("12450")}
                    className="text-[10px] font-bold text-orange-600 hover:text-orange-700"
                  >
                    Max
                  </button>
                </div>

                <div className="flex items-center rounded-xl border bg-white px-3 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                  <span className="mr-2 text-sm font-bold">₹</span>

                  <input
                    id="transferAmount"
                    type="number"
                    min="1"
                    max="12450"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold outline-none"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <button
                    type="button"
                    className="absolute inset-0"
                    aria-label="Close transfer modal"
                    onClick={() => setIsModalOpen(false)}
                  />

                  <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                    <Hdfc onClose={() => setIsModalOpen(false)} />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-700 active:scale-[0.99]"
              >
                <span>Transfer to HDFC</span>
                <ArrowRight size={16} />
              </button>

            </div>


            <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-xs">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-gray-900">Recent Settlements</h3>
              </div>

              <div className="flex flex-col">
                {settlements.map((item, index) => {
                  const isInEscrow = item.status === "In Escrow";

                  return (
                    <div
                      key={`${item.title}-${index}`}
                      className={`flex items-start justify-between gap-3 py-4 ${index !== settlements.length - 1 ? " border-gray-150 " : ""
                        }`}
                    >
                      <div className="flex min-w-0 items-start gap-3">

                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.positive ? "bg-[#FFEFE6]" : "bg-[#F1F1EE]"
                            }`}
                        >
                          {item.icon}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900 leading-tight">
                            {item.title}
                          </p>
                          <p className="mt-1 truncate text-[12px] font-medium opacity-50">
                            {item.date}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">

                        <p
                          className={`text-xs font-extrabold ${item.positive ? "text-orange-600" : "text-gray-900"
                            }`}
                        >
                          {item.amount}
                        </p>


                        <div className="mt-0.5">
                          {isInEscrow ? (
                            <span className="text-[10px] font-bold text-gray-400">
                              In Escrow
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-gray-400 capitalize">
                              {item.status.toLowerCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

