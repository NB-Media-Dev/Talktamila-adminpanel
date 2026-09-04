"use client"
import { useContext, useState } from "react";
import { X, MoreHorizontal, Play, Share2, ClipboardCheck, Check, Ban, MoveLeft } from "lucide-react";
import { useContenthook } from "@/hooks/useContent";
import { buttonVariants } from "@/components/ui/Button";
import { FacebookIcon } from "@/public/Svgicons/svgicons";
import Image from "next/image";
import avatar1 from "@/public/Images/avatar1.png";

type FilterType = "all" | "pending" | "approved" | "rejected";

const initialReviews = [
  {
    id: 1,
    creatorName: "Mr.Vlogger",
    creatorUsername: "@mr_vlogger",
    avatar: avatar1,
    location: "Bengaluru, India",
    timeAgo: "6h",
    platform: "Facebook",
    type: "Podcast",
    title: "எபிசோட் 42 – தமிழ் கிரியேட்டர்கள் எப்படி வருமானம் ஈட்டுகிறார்கள்?",
    hashtags: ["#Podcast", "#CreatorEconomy"],
    mediaTitle: "Studio color grading — behind the scenes reel",
    mediaSubtitle: "Sofia Nakamura @sofia.nk - submitted 12m ago",
    mediaImage: avatar1,
    checks: ["Copyright OK", "Safe content", "Music match: licensed"],
    status: "pending"
  },
  {
    id: 2,
    creatorName: "CinemaTamil",
    creatorUsername: "@cinematamil",
    avatar: avatar1,
    location: "Chennai, India",
    timeAgo: "2h",
    platform: "Instagram",
    type: "Reel",
    title: "சினிமா அப்டேட்ஸ் – இந்த வார ட்ரெண்டிங் செய்திகள்!",
    hashtags: ["#Cinema", "#TamilCinema"],
    mediaTitle: "Weekly film news highlights",
    mediaSubtitle: "Vicky @vicky.cinema - submitted 30m ago",
    mediaImage: avatar1,
    checks: ["Copyright OK", "Safe content", "Music match: licensed"],
    status: "pending"
  },
  {
    id: 3,
    creatorName: "TechTamil",
    creatorUsername: "@techtamil",
    avatar: avatar1,
    location: "Chennai, India",
    timeAgo: "12h",
    platform: "YouTube",
    type: "Reel",
    title: "புதிய AI டூல்ஸ் – கிரியேட்டர்களுக்கு ஒரு வரப்பிரசாதம்!",
    hashtags: ["#Tech", "#ArtificialIntelligence"],
    mediaTitle: "AI editing workflow demo",
    mediaSubtitle: "Kathiravan @kathir.tech - submitted 45m ago",
    mediaImage: avatar1,
    checks: ["Copyright OK", "Safe content", "Music match: licensed"],
    status: "pending"
  },
  {
    id: 4,
    creatorName: "TravelTamil",
    creatorUsername: "@traveltamil",
    avatar: avatar1,
    location: "Madurai, India",
    timeAgo: "2d",
    platform: "YouTube",
    type: "Vlog",
    title: "கொடைக்கானல் ரகசிய இடங்கள் – ஒரு பயணம்!",
    hashtags: ["#Travel", "#Kodaikanal"],
    mediaTitle: "Hidden falls cinematic sequence",
    mediaSubtitle: "Rajesh @raj.travels - approved 1d ago",
    mediaImage: avatar1,
    checks: ["Copyright OK", "Safe content", "Music match: licensed"],
    status: "approved"
  }
];

export function Adminreviewpanel() {
  const context = useContext(useContenthook);
  const [reviews, setReviews] = useState(initialReviews);
  const [activeFilter, setActiveFilter] = useState<FilterType>("pending");
  const [currentPage, setCurrentPage] = useState(1);

  if (!context) {
    throw new Error("Adminreviewpanel must be used within a UseContentProvider");
  }
  const { setActiveTab } = context;

  const handleClose = () => {
    setActiveTab("home");
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleApprove = (id: number) => {
    setReviews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item))
    );
  };

  const handleReject = (id: number) => {
    setReviews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" } : item))
    );
  };

  const counts = {
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "all") return true;
    return r.status === activeFilter;
  });

  const POSTS_PER_PAGE = 2;
  const indexOfLastReview = currentPage * POSTS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - POSTS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / POSTS_PER_PAGE);

  const filterButtons: { id: FilterType; label: string; activeClass: string }[] = [
    { id: "all", label: "All", activeClass: "bg-orange-500 text-white shadow-md shadow-orange-500/10" },
    { id: "pending", label: `Pending - ${counts.pending}`, activeClass: `${buttonVariants({ variant: 'default' })} shadow-md shadow-red-500/10` },
    { id: "approved", label: `Approved - ${counts.approved}`, activeClass: `${buttonVariants({ variant: 'sucess' })} shadow-md shadow-emerald-500/10` },
    { id: "rejected", label: `Rejected - ${counts.rejected}`, activeClass: `${buttonVariants({ variant: 'destructive' })} shadow-md shadow-rose-500/10` },
  ];

  const renderPaginationControls = (isTopMobile: boolean) => (
    <div
      className={
        isTopMobile
          ? "flex md:hidden items-center justify-between my-2.5 pb-2 border-b border-orange-100/60 w-full"
          : "hidden md:flex items-center justify-between mt-2.5 pt-2 border-t border-orange-100/60 w-full"
      }
    >
      <span className="text-[10px] text-gray-500 font-bold">
        Showing {indexOfFirstReview + 1} to {Math.min(indexOfLastReview, filteredReviews.length)} of {filteredReviews.length}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
          >
            Previous
          </button>
          <span className="text-[10px] font-bold text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-0 md:p-4 md:pb-24 min-[2560px]:pb-6 min-[3840px]:pb-6 z-40">
      <div className="w-full h-full mt-10 md:mt-0 md:h-auto md:max-h-[90vh] md:max-w-[820px] min-[2560px]:max-w-[1200px] min-[3840px]:max-w-[1550px] rounded-none md:rounded-[28px] bg-[#fff0e7] shadow-2xl px-4 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-28 md:px-5 md:py-5 min-[2560px]:p-6 min-[3840px]:p-7 relative font-sans antialiased border-0 md:border border-orange-100 overflow-y-auto md:overflow-y-auto min-[2560px]:overflow-hidden min-[3840px]:overflow-hidden">

        <div className="block sm:hidden">
          <button
            onClick={handleClose}
            className="hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
            aria-label="Go back"
          >
            <MoveLeft size={30} className="text-brand w-10 h-9" />
          </button>
        </div>

    
        <button
          onClick={handleClose}
          className="hidden sm:flex absolute right-4 top-4 md:right-5 md:top-5 h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-all duration-200 cursor-pointer z-10"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-orange-100 pb-2.5 pr-10 sm:pr-12">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 min-[2560px]:w-12 min-[2560px]:h-12 min-[3840px]:w-14 min-[3840px]:h-14 ${buttonVariants({ variant: 'default' })} rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0`}>
              <ClipboardCheck size={20} className="min-[2560px]:w-6 min-[2560px]:h-6 min-[3840px]:w-7 min-[3840px]:h-7" />
            </div>
            <div>
              <h1 className="text-base min-[2560px]:text-lg min-[3840px]:text-xl font-bold text-gray-900 tracking-tight">Admin review panel</h1>
              <p className="text-[11px] min-[2560px]:text-xs min-[3840px]:text-sm text-gray-500 font-medium mt-0.5">
                Approve or reject submitted posts & reels before they go live.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 min-[3840px]:gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleFilterChange(btn.id)}
                className={`px-3 py-1 min-[3840px]:px-4 min-[3840px]:py-1.5 text-xs min-[3840px]:text-sm font-bold rounded-full transition-all cursor-pointer ${
                  activeFilter === btn.id
                    ? btn.activeClass
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-dashed border-orange-200 mt-4">
            <Ban className="text-gray-300 mb-1.5" size={32} />
            <p className="text-xs font-bold text-gray-600">No submissions found</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Try switching filter status tags.</p>
          </div>
        ) : (
          <div>
            {renderPaginationControls(true)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 min-[2560px]:gap-4.5 min-[3840px]:gap-5 mt-2.5">
              {paginatedReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-2.5 lg:p-3 min-[2560px]:p-3.5 min-[3840px]:p-4 border border-gray-100 shadow-xs flex flex-col gap-1.5 min-[3840px]:gap-2 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-[3840px]:gap-2">
                      <Image
                        src={review.avatar}
                        alt={review.creatorName}
                        className="w-6.5 h-6.5 min-[2560px]:w-8 min-[2560px]:h-8 min-[3840px]:w-9 min-[3840px]:h-9 rounded-full object-cover border border-gray-100 shadow-inner shrink-0"
                      />
                      <div>
                        <h4 className="text-[11px] min-[2560px]:text-xs min-[3840px]:text-sm font-extrabold text-gray-900 leading-none">
                          {review.creatorName}
                        </h4>
                        <span className="text-[8px] min-[2560px]:text-[9px] min-[3840px]:text-[10px] text-gray-400 font-medium mt-0.5 block leading-none">
                          {review.creatorUsername}
                        </span>
                        <span className="text-[8px] min-[2560px]:text-[9px] min-[3840px]:text-[10px] text-gray-400 font-medium mt-0.5 block leading-none">
                          {review.location} · {review.timeAgo}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 min-[3840px]:gap-1.5">
                      <FacebookIcon className="w-3 h-3 min-[3840px]:w-4 min-[3840px]:h-4"/>
                      <span className="bg-orange-50 text-orange-600 text-[8px] min-[2560px]:text-[9px] min-[3840px]:text-[10px] font-bold py-0.5 px-1.5 min-[3840px]:px-2 rounded-full uppercase border border-orange-100 tracking-wide">
                        {review.type}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-0.5">
                        <MoreHorizontal size={12} className="min-[3840px]:w-4 min-[3840px]:h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] min-[2560px]:text-xs min-[3840px]:text-sm font-semibold text-gray-800 leading-snug">
                      {review.title}
                    </p>
                    <p className="text-[9px] min-[2560px]:text-[10px] min-[3840px]:text-xs font-bold text-orange-600 mt-0.5 flex gap-1">
                      {review.hashtags.join(" ")}
                    </p>
                  </div>

                  <div className="relative h-28 min-[2560px]:h-32 min-[3840px]:h-36 w-full bg-slate-900 rounded-xl overflow-hidden group shadow-inner">
                    <Image
                      src={review.mediaImage}
                      alt={review.mediaTitle}
                      className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute right-2.5 top-2.5 w-5 h-5 min-[3840px]:w-6 min-[3840px]:h-6 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs">
                      <Share2 size={10} className="min-[3840px]:w-3 min-[3840px]:h-3" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-8 h-8 min-[3840px]:w-10 min-[3840px]:h-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/60 transition-all cursor-pointer shadow-md hover:scale-105">
                        <Play size={12} className="fill-white ml-0.5 min-[3840px]:w-4 min-[3840px]:h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h5 className="text-[10px] min-[2560px]:text-[11px] min-[3840px]:text-xs font-bold text-gray-900 truncate">
                      {review.mediaTitle}
                    </h5>
                    <span className="text-[8px] min-[2560px]:text-[9px] min-[3840px]:text-[10px] text-gray-400 font-medium block leading-none">
                      {review.mediaSubtitle}
                    </span>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {review.checks.map((check) => (
                        <span
                          key={`${review.id}-${check}`}
                          className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] min-[2560px]:text-[9px] min-[3840px]:text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                        >
                          <Check size={8} className="stroke-[3] min-[3840px]:w-2.5 min-[3840px]:h-2.5" />
                          {check}
                        </span>
                      ))}
                    </div>
                  </div>

                  {review.status === "pending" && (
                    <div className="flex gap-2 mt-1 border-t border-gray-50 pt-2 shadow-inner-xs">
                      <button
                        onClick={() => handleApprove(review.id)}
                        className={`flex-1 py-1 min-[3840px]:py-1.5 ${buttonVariants({ variant: 'default' })} text-[10px] min-[2560px]:text-[11px] min-[3840px]:text-xs font-bold rounded-full flex items-center justify-center gap-0.5 active:scale-98`}
                      >
                        <Check size={10} className="stroke-[2.5]" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex-1 py-1 min-[3840px]:py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-[10px] min-[2560px]:text-[11px] min-[3840px]:text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-0.5 active:scale-98"
                      >
                        <X size={10} className="stroke-[2.5]" />
                        Reject
                      </button>
                    </div>
                  )}

                  {review.status === "approved" && (
                    <div className="text-center py-1 min-[3840px]:py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] min-[2560px]:text-[10px] min-[3840px]:text-xs font-bold rounded-full mt-1 flex items-center justify-center gap-0.5">
                      <Check size={10} /> Approved
                    </div>
                  )}

                  {review.status === "rejected" && (
                    <div className="text-center py-1 min-[3840px]:py-1.5 bg-rose-50 text-rose-700 border border-rose-100 text-[9px] min-[2560px]:text-[10px] min-[3840px]:text-xs font-bold rounded-full mt-1 flex items-center justify-center gap-0.5">
                      <Ban size={10} /> Rejected
                    </div>
                  )}
                </div>
              ))}
            </div>

            {renderPaginationControls(false)}
          </div>
        )}
      </div>
    </div>
  );
}

