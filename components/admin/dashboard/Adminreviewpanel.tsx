"use client"
import { useContext, useState } from "react";
import { X, MoreHorizontal, Play, Share2, ClipboardCheck, Check, Ban } from "lucide-react";
import { useContenthook } from "@/hooks/useContent";
import { buttonVariants } from "@/components/ui/Button";
import { FacebookIcon } from "@/public/Svgicons/svgicons";

const initialReviews = [
  {
    id: 1,
    creatorName: "Mr.Vlogger",
    creatorUsername: "@mr_vlogger",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
    location: "Bengaluru, India",
    timeAgo: "6h",
    platform: "Facebook",
    type: "Podcast",
    title: "எபிசோட் 42 – தமிழ் கிரியேட்டர்கள் எப்படி வருமானம் ஈட்டுகிறார்கள்?",
    hashtags: ["#Podcast", "#CreatorEconomy"],
    mediaTitle: "Studio color grading — behind the scenes reel",
    mediaSubtitle: "Sofia Nakamura @sofia.nk - submitted 12m ago",
    mediaImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80",
    checks: ["Copyright OK", "Safe content", "Music match: licensed"],
    status: "pending"
  },
  {
    id: 2,
    creatorName: "Mr.Vlogger",
    creatorUsername: "@mr_vlogger",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
    location: "Bengaluru, India",
    timeAgo: "6h",
    platform: "Facebook",
    type: "Podcast",
    title: "எபிசோட் 42 – தமிழ் கிரியேட்டர்கள் எப்படி வருமானம் ஈட்டுகிறார்கள்?",
    hashtags: ["#Podcast", "#CreatorEconomy"],
    mediaTitle: "Studio color grading — behind the scenes reel",
    mediaSubtitle: "Sofia Nakamura @sofia.nk - submitted 12m ago",
    mediaImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80",
    checks: ["Copyright OK", "Safe content", "Music match: licensed"],
    status: "pending"
  },
  {
    id: 3,
    creatorName: "TechTamil",
    creatorUsername: "@techtamil",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80",
    location: "Chennai, India",
    timeAgo: "12h",
    platform: "YouTube",
    type: "Reel",
    title: "புதிய AI டூல்ஸ் – கிரியேட்டர்களுக்கு ஒரு வரப்பிரசாதம்!",
    hashtags: ["#Tech", "#ArtificialIntelligence"],
    mediaTitle: "AI editing workflow demo",
    mediaSubtitle: "Kathiravan @kathir.tech - submitted 45m ago",
    mediaImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    checks: ["Copyright OK", "Safe content", "Music match: licensed"],
    status: "pending"
  },
  {
    id: 4,
    creatorName: "TravelTamil",
    creatorUsername: "@traveltamil",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    location: "Madurai, India",
    timeAgo: "2d",
    platform: "YouTube",
    type: "Vlog",
    title: "கொடைக்கானல் ரகசிய இடங்கள் – ஒரு பயணம்!",
    hashtags: ["#Travel", "#Kodaikanal"],
    mediaTitle: "Hidden falls cinematic sequence",
    mediaSubtitle: "Rajesh @raj.travels - approved 1d ago",
    mediaImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    checks: ["Copyright OK", "Safe content", "Music match: licensed"],
    status: "approved"
  }
];

export function Adminreviewpanel() {
  const context = useContext(useContenthook);
  const [reviews, setReviews] = useState(initialReviews);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [currentPage, setCurrentPage] = useState(1);

  if (!context) {
    throw new Error("Adminreviewpanel must be used within a UseContentProvider");
  }
  const { setActiveTab } = context;

  const handleClose = () => {
    setActiveTab("home");
  };

  const handleFilterChange = (filter: typeof activeFilter) => {
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

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;
  const totalCount = reviews.length;

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "all") return true;
    return r.status === activeFilter;
  });

  const POSTS_PER_PAGE = 2;
  const indexOfLastReview = currentPage * POSTS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - POSTS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / POSTS_PER_PAGE);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-0 md:p-4 md:pb-24 z-40">
      <div className="w-full h-full md:h-[480px] md:max-w-[820px] rounded-none md:rounded-[28px] bg-[#fff0e7] shadow-2xl px-4 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-28 md:px-4 md:py-4 relative font-sans antialiased border-0 md:border border-orange-100 overflow-y-auto">
        
        <button
          onClick={handleClose}
          className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top,0px))] md:top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-all duration-200 cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-orange-100 pb-2 pr-10 sm:pr-12">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 ${buttonVariants({variant:'default'})} rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-500/20`}>
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 tracking-tight">Admin review panel</h1>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Approve or reject submitted posts & reels before they go live.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeFilter === "pending"
                  ? `${buttonVariants({variant:'default'})} shadow-md shadow-red-500/10`
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Pending - {pendingCount}
            </button>
            <button
              onClick={() => handleFilterChange("approved")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeFilter === "approved"
                  ? `${buttonVariants({variant:'sucess'})} shadow-md shadow-emerald-500/10`
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Approved - {approvedCount}
            </button>
            <button
              onClick={() => handleFilterChange("rejected")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeFilter === "rejected"
                  ? `${buttonVariants({variant:'destructive'})} shadow-md shadow-rose-500/10`
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Rejected - {rejectedCount}
            </button>
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
       
            <div className="flex md:hidden items-center justify-between my-2.5 pb-2 border-b border-orange-100/60 w-full">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
              {paginatedReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-2.5 lg:p-3 border border-gray-100 shadow-xs flex flex-col gap-1.5 transition-all duration-200 hover:shadow-md"
                >
          
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={review.avatar}
                        alt={review.creatorName}
                        className="w-6.5 h-6.5 rounded-full object-cover border border-gray-100 shadow-inner"
                      />
                      <div>
                        <h4 className="text-[11px] font-extrabold text-gray-900 leading-none">
                          {review.creatorName}
                        </h4>
                        <span className="text-[8px] text-gray-400 font-medium mt-0.5 block leading-none">
                          {review.creatorUsername}
                        </span>
                        <span className="text-[8px] text-gray-400 font-medium mt-0.5 block leading-none">
                          {review.location} · {review.timeAgo}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* <span className="w-3 h-3 text-[7px] bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        f
                      </span> */}
                      <FacebookIcon className="w-3 h-3"/>
                      <span className="bg-orange-50 text-orange-600 text-[8px] font-bold py-0.5 px-1.5 rounded-full uppercase border border-orange-100 tracking-wide">
                        {review.type}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-0.5">
                        <MoreHorizontal size={12} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-gray-800 leading-snug">
                      {review.title}
                    </p>
                    <p className="text-[9px] font-bold text-orange-600 mt-0.5 flex gap-1">
                      {review.hashtags.join(" ")}
                    </p>
                  </div>

                  <div className="relative h-28 w-full bg-slate-900 rounded-xl overflow-hidden group shadow-inner">
                    <img
                      src={review.mediaImage}
                      alt={review.mediaTitle}
                      className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute right-2.5 top-2.5 w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs">
                      <Share2 size={10} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/60 transition-all cursor-pointer shadow-md hover:scale-105">
                        <Play size={12} className="fill-white ml-0.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h5 className="text-[10px] font-bold text-gray-900 truncate">
                      {review.mediaTitle}
                    </h5>
                    <span className="text-[8px] text-gray-400 font-medium block leading-none">
                      {review.mediaSubtitle}
                    </span>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {review.checks.map((check, idx) => (
                        <span
                          key={idx}
                          className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                        >
                          <Check size={8} className="stroke-[3]" />
                          {check}
                        </span>
                      ))}
                    </div>
                  </div>

                  {review.status === "pending" && (
                    <div className="flex gap-2 mt-1 border-t border-gray-50 pt-2 shadow-inner-xs">
                      <button
                        onClick={() => handleApprove(review.id)}
                        className={`flex-1 py-1 ${buttonVariants({variant:'default'})} text-[10px] font-bold rounded-full flex items-center justify-center gap-0.5 active:scale-98`}
                      >
                        <Check size={10} className="stroke-[2.5]" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex-1 py-1 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-[10px] font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-0.5 active:scale-98"
                      >
                        <X size={10} className="stroke-[2.5]" />
                        Reject
                      </button>
                    </div>
                  )}

                  {review.status === "approved" && (
                    <div className="text-center py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold rounded-full mt-1 flex items-center justify-center gap-0.5">
                      <Check size={10} /> Approved
                    </div>
                  )}

                  {review.status === "rejected" && (
                    <div className="text-center py-1 bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-bold rounded-full mt-1 flex items-center justify-center gap-0.5">
                      <Ban size={10} /> Rejected
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden md:flex items-center justify-between mt-2.5 pt-2 border-t border-orange-100/60 w-full">
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
          </div>
        )}
      </div>
    </div>
  );
}
