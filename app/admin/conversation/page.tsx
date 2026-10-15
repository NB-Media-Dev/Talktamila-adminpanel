
"use client";

import { useState } from "react";
import {
  Users,
  Volume2,
  Mic2,
  UserPlus,
  FileText,
  Download,
  Clock,
  TrendingUp,
  CheckCircle2,
  FaceGrinning,
  Vote,
} from "lucide-react";

import Speek from "@/components/admin/TrendRadar/RequestToSpeek"; 
import DocDownload from "@/components/admin/TrendRadar/DocDownload";


interface Speaker {
  id: number;
  name: string;
  role: string;
  status: "Speaking..." | "Moderator" | "Panelist" | "Muted";
  avatar: string;
}

interface PollOption {
  id: string;
  text: string;
  percent: number;
  count: number;
}

const speakers: Speaker[] = [
  {
    id: 1,
    name: "Karthik Raja",
    role: "Influencer Pro",
    status: "Speaking...",
    avatar: "/Images/avatar1.png",
  },
  {
    id: 2,
    name: "Dr. S. Raman",
    role: "CMRL Chief Eng.",
    status: "Moderator",
    avatar: "/Images/avatar2.png",
  },
  {
    id: 3,
    name: "Aruna S.",
    role: "Urban Planner",
    status: "Panelist",
    avatar: "/Images/avatar6.png",
  },
  {
    id: 4,
    name: "Deepa Mohan",
    role: "The Hindu Infra",
    status: "Muted",
    avatar: "/Images/avatar6.png",
  },
  {
    id: 5,
    name: "Vijay Kumar",
    role: "Mylapore RWA",
    status: "Muted",
    avatar: "/Images/avatar4.png",
  },
  {
    id: 6,
    name: "Ananya R.",
    role: "Transit Analyst",
    status: "Muted",
    avatar: "/Images/avatar6.png",
  },
];

const pollOptions: PollOption[] = [
  { id: "A", text: "Yes, drastically", percent: 74, count: 2138 },
  { id: "B", text: "Marginally / Unsure", percent: 18, count: 520 },
  { id: "C", text: "No difference for my route", percent: 8, count: 232 },
];

const trendRooms = [
  {
    id: 1,
    status: "Live Now",
    listeners: "890 listening",
    title: "Tamil LLM Breakthroughs & Open Models",
    description:
      "New open-source models optimized for Tamil language.",
    color: "bg-[#F26435] text-white",
    // "bg-emerald-50 text-emerald-700"
  },
  {
    id: 2,
    status: "STAGE",
    listeners: "240 listening",
    title: "Pongal 2027 Campaign Strategies",
    description:
      "AI-driven marketing trends for the upcoming festive…",
    color: "bg-[#695C51] text-white",
    // bg-orange-50 text-orange-700
  },
  {
    id: 3,
    status: "Upcoming · 6:00 PM",
    listeners: "510 interested",
    title: "Coimbatore EV Hub vs Chennai Auto Cluster",
    description:
      "Local startups lead in sustainable mobility discussions.",
    color: "bg-[#F1EDE8] text-[#59413A]",
    // bg-blue-50 text-blue-700
  },
];

export default function Conversation() {
  const [activePollVote, setActivePollVote] = useState<string | null>("A");
  const [isRequestedToSpeak, setIsRequestedToSpeak] = useState(false);
  const [isDocDownload, setIsDocDownload] = useState(false);
  const [isInviteSent, setIsInviteSent] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const formatVotes = (count: number) =>
    `${count.toLocaleString("en-IN")} votes`;

  const handleVote = (optionId: string) => {
    setActivePollVote(optionId);
    setShowResults(true);
  };

  const handleInvite = async () => {
    const inviteText =
      "Join the live Chennai Metro Phase II townhall discussion.";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Live Stage & Townhall",
          text: inviteText,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${inviteText} ${window.location.href}`
        );
        setIsInviteSent(true);
      } else {
        setIsInviteSent(true);
      }
    } catch {
    }
  };

  return (
    <div className="min-h-screen w-full p-4 font-sans text-[#2B211B] antialiased md:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
       
        <section className="rounded-[28px] border border-[#F4ECE4] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-[#FF5E13] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Live Stage & Townhall
                </span>

                <span className="flex items-center gap-1.5 rounded-full border border-[#EFE6DC] bg-[#FAF0E6] px-3 py-1 text-[11px] font-bold text-[#766960]">
                  <FaceGrinning size={15} className="text-[#AD3303]"/> 82% Positive Sentiment
                </span>

                <span className="flex items-center gap-1.5 rounded-full border border-[#EFE6DC] bg-[#FAF0E6] px-3 py-1 text-[11px] font-bold text-[#766960]">
                  <TrendingUp size={15}/> 14.2K Mentions Today
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-[#2B211B] sm:text-3xl">
                  Chennai Metro Phase II: Corridor 4 Expansion & Thousand
                  Lights Tunneling
                </h1>

                <p className="text-sm font-medium leading-relaxed text-[#766960]">
                  Live civil engineering debate and commuter forum with Chennai
                  Metro Rail Ltd (CMRL) technical advisors, urban planners,
                  transit journalists, and residents of Central Chennai.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-[#FF5E13]">
                <span>#ChennaiMetro</span>
                <span>#Corridor4</span>
                <span>#ThousandLights</span>
                <span>#UrbanMobilityTN</span>
                <span>#SmartChennai</span>
              </div>
    
              <p className="text-[11px] font-semibold text-[#A59990]">
                 Room Co-hosted by{" "}
                <span className="text-[#766960] underline">
                  CMRL Media Wing
                </span>{" "}
                &{" "}
                <span className="text-[#766960] underline">
                  Talk Tamila Urban Desk
                </span>
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-center justify-center gap-3  bg-[#F7F3EE] p-2 border-[#F7F3EE] rounded-2xl pt-4 ">
              <button
                type="button"
                onClick={() => setIsRequestedToSpeak((current) => !current)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold transition active:scale-[0.98] lg:w-48 ${
                  isRequestedToSpeak
                    ? "bg-[#00A86B] text-white shadow-sm"
                    : "bg-[#FF5E13] text-white shadow-sm hover:bg-[#E04D08]"
                }`}
              >
                {isRequestedToSpeak ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Mic2 size={15} />
                )}
                {isRequestedToSpeak ? "✓ Request Sent" : "Request to Speak"}
              </button>

              <button
                type="button"
                onClick={handleInvite}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EFE6DC] bg-[#FFFFFF] px-6 py-3 text-xs font-bold text-[#766960] transition hover:bg-[#F2EAE1] lg:w-48"
              >
                {isInviteSent ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <UserPlus size={15} />
                )}
                {isInviteSent ? "Invite Link Copied" : "Invite City Creators"}
              </button>

              <div className="mt-1 flex  items-center gap-3 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[#A59990]">
                  Audio Stream Latency
                </span>
                <span className="rounded-md  px-2 py-0.5 text-[10px] font-bold text-[#AD3303]">
                  Ultra-low (0.4s)
                </span>
              </div>
            </div>
          </div>
        </section>

        <main className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          
          <div className="space-y-6 lg:col-span-2">
            
            <section className="rounded-[24px] border border-[#F4ECE4] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#F7F3EE] pb-3">
                    <div className="flex items-center gap-2">
                    <Volume2 size={18} className="text-[#FF5E13]" />

                    <h2 className="text-sm font-extrabold text-[#2B211B]">
                        Live Stage Speakers
                    </h2>

                    <span className="rounded-full border border-[#FFD2BE] bg-[#FFF0E8] px-2 py-0.5 text-[10px] font-bold text-[#FF5E13]">
                        {speakers.length} on Stage
                    </span>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-700" />
                        Live Audio
                    </span>
                    
                </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
                {speakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="group flex min-w-0 flex-col items-center text-center"
                  >
                    <div className="relative mb-2 shrink-0">
                      <div
                        className={`h-16 w-16 overflow-hidden rounded-full border-[3px] bg-white p-0.5 shadow-sm transition-transform group-hover:scale-105 ${
                          speaker.status === "Speaking..."
                            ? "border-[#FF5E13]"
                            : speaker.status === "Moderator"
                              ? "border-amber-500"
                              : "border-[#EFE6DC]"
                        }`}
                      >
                        <img
                          src={speaker.avatar}
                          alt={`${speaker.name} avatar`}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>

                      {speaker.status === "Speaking..." && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#FF5E13] text-[9px] text-white">
                          <Mic2 size={10} />
                        </span>
                      )}
                    </div>

                    <span className="max-w-full truncate text-xs font-extrabold text-[#2B211B]">
                      {speaker.name}
                    </span>

                    <span className="mt-0.5 max-w-full truncate text-[10px] font-semibold text-[#A59990]">
                      {speaker.role}
                    </span>

                    <span
                      className={`mt-2 rounded-md px-2 py-0.5 text-[9px] font-bold ${
                        speaker.status === "Speaking..."
                          ? "animate-pulse bg-[#FFF0E8] text-[#FF5E13]"
                          : speaker.status === "Moderator"
                            ? "bg-amber-50 text-amber-700"
                            : speaker.status === "Panelist"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-[#FAF6F0] text-[#766960]"
                      }`}
                    >
                      {speaker.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

           
            <section className="rounded-[24px] border border-[#F4ECE4] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#FF5E13]">
                    <Vote size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold">
                      Pinned Citizen Poll
                    </h2>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-[#FAF6F0] px-3 py-1.5 text-[10px] font-bold text-[#766960]">
                  <Clock size={12} />
                  Closes in 45m
                </span>
              </div>

              <div className="mb-5">
                <p className="text-[11px] font-semibold text-[#A59990]">
                  2,890 verified votes
                </p>

                <h3 className="mt-2 text-base font-extrabold leading-relaxed text-[#2B211B] sm:text-lg">
                  Will Corridor 4 (Poonamallee – Lighthouse) cut your daily
                  travel time by more than 30 minutes?
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[#766960]">
                  கொரிடோர் 4 திட்டம் உங்கள் தினசரி பயண நேரத்தை 30 நிமிடங்களுக்கு
                  மேல் குறைக்குமா?
                </p>
              </div>

              <div className="space-y-3">
                {pollOptions.map((option) => {
                  const isSelected = activePollVote === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleVote(option.id)}
                      aria-pressed={isSelected}
                      className={`relative w-full overflow-hidden rounded-xl border p-3 text-left transition-all active:scale-[0.99] ${
                        isSelected
                          ? "border-[#FF5E13] bg-[#FFF8F4]"
                          : "border-[#EFE6DC] bg-white hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <div
                        className={`absolute inset-y-0 left-0  transition-all duration-500 ${
                          isSelected ? "bg-[#FF5E13]/10" : "bg-[#FAF6F0]"
                        }`}
                        style={{
                          width: showResults ? `${option.percent}%` : "0%",
                        }}
                      />

                        <div className="relative z-10 flex items-center gap-3">
                                <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                                    isSelected
                                    ? "border-[#FF5E13] bg-[#FF5E13] text-white"
                                    : "border-[#DCCABD] bg-white text-[#766960]"
                                }`}
                                    >
                                {option.id}
                                </span>

                                <span className="min-w-0 flex-1 flex gap-1.5 items-center text-xs font-bold text-[#2B211B] sm:text-sm">
                                  {option.text}
                                  {showResults && (
                                    <span
                                          className={`shrink-0 text-xs font-extrabold ${
                                          isSelected
                                              ? "text-[]"
                                              : "text-[#766960]"
                                          }`}
                                        >
                                          ({option.percent}%)
                                    </span>
                                      )}
                                </span>

                                {showResults && (
                                <div className={`relative z-10 mt-2 pl-8 text-[12px] font-bold 
                                ${
                                          isSelected
                                              ? "text-[#FF5E13]"
                                              : "text-[#766960]"
                                          }`}>
                                {formatVotes(option.count)}
                                </div>
                            )}

                            
                        </div>

                     
                    </button>
                  );
                })}
              </div>

            </section>
          </div>

          
          <aside className="space-y-6">
            <section className="rounded-[24px] border border-[#F4ECE4] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#FF5E13]">
                    <FileText size={18} />
                  </div>

                  <h2 className="text-sm font-extrabold">
                    Verified Documents
                  </h2>
                </div>

                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                  OFFICIAL
                </span>
              </div>

              <div className="rounded-xl border border-[#EFE6DC] bg-[#FFFCF9] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-extrabold leading-relaxed text-[#2B211B]">
                      Corridor 4 Detailed Project Report
                    </h3>

                    <p className="mt-1 text-[10px] font-medium text-[#A59990]">
                      PDF (12.4 MB) | CMRL Official DPR
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#766960]">
                      
                    </p>
                  </div>
                </div>

                <button
                type="button"
                onClick={() => setIsDocDownload((current) => !current)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF5E13] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#E04D08]"
                >
                  <Download size={14} />
                  Download Document
                </button>
              </div>
            </section>

           
            <section className="rounded-[24px] border border-[#F4ECE4] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#FF5E13]">
                    <TrendingUp size={18} />
                  </div>

                  <h2 className="text-sm font-extrabold">
                    Other Live Trend Rooms
                  </h2>
                </div>

                {/* <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="text-[10px] font-bold text-[#FF5E13] hover:underline"
                >
                  View all
                </button> */}
              </div>

              <div className="space-y-3">
                {trendRooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() =>
                      setSelectedRoom((current) =>
                        current === room.id ? null : room.id
                      )
                    }
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedRoom === room.id
                        ? "border-[#FF5E13] bg-[#F7F3EE]"
                        : "border-[#EFE6DC] bg-[#F7F3EE] hover:bg-[#FFFCF9]"
                    }`}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                          room.color
                        }`}
                      >
                        {room.id === 1 && (
                          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                        {room.status}
                      </span>

                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[#A59990]">
                        <Users size={11} />
                        {room.listeners}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold leading-relaxed text-[#2B211B]">
                      {room.title}
                    </h3>

                    <p className="mt-1.5 text-[11px] leading-relaxed text-[#766960]">
                      {room.description}
                    </p>

                    {/* {selectedRoom === room.id && (
                      <span className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#FF5E13]">
                        Selected room
                        <CheckCircle2 size={12} />
                      </span>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-[#F7F3EE] pt-3">
                      <span className="text-[10px] font-semibold text-[#A59990]">
                        {room.id === 3 ? "Scheduled discussion" : "Audio room"}
                      </span>

                      <ChevronRight size={15} className="text-[#FF5E13]" />
                    </div> */}
                  </button>
                ))}
              </div>
            </section>
          
            
          </aside>
        </main>
        <Speek
            isOpen={isRequestedToSpeak}
            onClose={() => setIsRequestedToSpeak(false)}
            onWithdraw={() => {
              setIsRequestedToSpeak(false);
              alert("Your voice queue slot reservation has been withdrawn.");
            }}
          />
          <DocDownload
            isVisible={isDocDownload}
            onClose={() => setIsDocDownload(false)}
            onDownload={() => {setIsDocDownload(false);}}
          />
      </div>
    </div>
  );
}

