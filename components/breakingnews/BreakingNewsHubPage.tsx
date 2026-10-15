
"use client";

import React, { useState } from "react";
import {
  Radio,
  Search,
  Send,
  Bookmark,
  Clock,
  Share2,
  Headphones,
  CheckCircle2,
  MapPin,
  Newspaper,
  X,
  AlertTriangle,
  TrendingUp,
  ShieldCheckIcon,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

const sport = "/Images/sportssection.jpg";
const train = "/Images/chennaitrain.jpg";
const kollywood = "/Images/kollywoodbox.jpg";
const tech = "/Images/technology.jpg";

const categories = [
  "All News(84)",
  "Politics & Governance",
  "Cinema & Kollywood",
  "Tech & Freelance",
  "Chennai City Hub",
  "Sports & Cricket",
  "Business & Economy",
];

type NewsItem = {
  category: string;
  title: string;
  description: string;
  author: string;
  time: string;
  image: string;
  tag: string;
  location?: string;
};

const news: NewsItem[] = [
  {
    category: "Tech & Freelance",
    title: "",
    // புதிய தொழில்நுட்ப வாய்ப்புகள் மற்றும் இன்றைய முக்கிய செய்திகள்
    description:
      "ஃப்ரீலான்ஸர்கள் மற்றும் தொடக்கநிலை மென்பொருள் உருவாக்குநர்களுக்கான தமிழ்நாடு அரசின் புதிய நிதி உதவி",
    author: "Coimbatore Desk",
    time: "24 mins ago",
    image: tech,
    tag: "₹50 Cr Corpus",
  },
  {
    category: "Cinema & Kollywood",
    title: "",
    // கோலிவுட்டில் புதிய படங்களின் வசூல் நிலவரம்
    description:
      "",
    //   திரையுலகின் தற்போதைய நிலவரம் மற்றும் ரசிகர்களின் எதிர்பார்ப்புகள் குறித்த முழுமையான தகவல்கள்.
    author: "Cinema Bureau",
    time: "42 mins ago",
    image: kollywood,
    tag: "Audience Poll",
  },
  {
    category: "Weather Advisory",
    title: "",
    // சென்னையில் இன்று வானிலை எப்படி இருக்கும்?
    description:
      "மீனவர்கள் அடுத்த 48 மணி நேரத்திற்கு கடலுக்குள் செல்ல வேண்டாம் என்று வானிலை ஆய்வு மையம் எச்சரிக்கை விடுத்துள்ளது.",
    author: "IMD Chennai",
    time: "1 hr ago",
    image: "",
    tag: "Track Cyclone Map",
    location: "Tuticorin, Nagapattinam & Ramanathapuram",
  },
  {
    category: "Sports & Cricket",
    title: "",
    // விளையாட்டுத் துறையில் இளம் வீரர்களின் சாதனை
    description: "கிராமப்புற மாணவர்களுக்கான சிறப்பு விளையாட்டு பயிற்சி முகாம்கள் மற்றும் சர்வதேச தரத்திலான விளையாட்டு…",
    //   "இளம் வீரர்களின் பயிற்சி, போட்டி முடிவுகள் மற்றும் விளையாட்டு உலகின் முக்கிய அப்டேட்கள்.",
    author: "Sports Hub",
    time: "2 hrs ago",
    image: sport,
    tag: "Sports Update",
  },
];

export default function BreakingNewsHubPage() {
  const [activeCategory, setActiveCategory] = useState("All News(84)");
  const [searchText, setSearchText] = useState("");
  const [submitOpen, setSubmitOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const featuredTitle =
    "சென்னையில் கடற்கரை வழியாக புதிய ரயில் பாதை திட்டம்";

  const toggleSave = (title: string) => {
    setSaved((previous) =>
      previous.includes(title)
        ? previous.filter((item) => item !== title)
        : [...previous, title]
    );
  };

  const filteredNews = news.filter((item) => {
    const matchesCategory =
      activeCategory === "All News(84)" ||
      item.category === activeCategory ||
      (activeCategory === "Cinema & Kollywood" &&
        item.category === "Kollywood Box Office") ||
      (activeCategory === "Sports & Cricket" &&
        item.category === "Sports & Cricket");

    const search = searchText.trim().toLowerCase();

    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.author.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  const shareStory = async (title: string) => {
    if (typeof navigator === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: "Breaking News Hub - Latest Tamil News",
          url: window.location.href,
        });
      } catch {
        
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(
          `${title} - ${window.location.href}`
        );
        alert("News link copied!");
      } catch {
        alert("Unable to copy the link.");
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const handleSubmitNews = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };


  const showFeatured =
    activeCategory === "All News(84)" && searchText.trim() === "";

  return (
    <div className="min-h-screen bg-[#fff0e4] px-3 pb-24 pt-3 font-sans text-[#302821]">
      <main className="mx-auto w-full max-w-3xl">
     
        <header className="mb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ff5722] px-2 py-1 text-[10px] font-extrabold text-white">
                <Radio size={12} />
                LIVE WIRE
              </span>

              <span className="text-[10px] font-semibold text-[#a65d3c]">
                <span className="text-[#ff5722]">14 new updates in the last hours</span> /  Updated 2 mins ago
              </span>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <h1 className="text-[25px] font-black tracking-tight">
              Breaking News Hub
            </h1>

            <div className="flex items-center gap-1.5">
                <div className="flex cursor-pointer items-center gap-1 rounded-full bg-[#EBE8E3] px-2.5 text-[#59413A] py-1.5 text-[10px]">
                    <ShieldCheckIcon size={12} className="text-[#FF5000]"/>
                   <p>Verified Sources Only</p>
                </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitOpen(true);
                  setSubmitted(false);
                }}
                className="flex cursor-pointer items-center gap-1 rounded-full bg-[#ff5722] px-2.5 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-[#e94b18]"
              >
                <Send size={12} />
                Submit News Wire
              </button>
            </div>
          </div>
        </header>

        <nav className="mb-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 cursor-pointer rounded-full px-2.5 py-1.5 text-[9px] font-bold transition ${
                activeCategory === category
                  ? "bg-[#ff5722] text-white shadow-sm"
                  : "border border-[#f0dfd0] bg-white/70 text-[#78685b] hover:bg-white"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>

  
        {showFeatured && (
          <article className="mb-3 overflow-hidden rounded-[17px] border border-[#edddcf] bg-white shadow-sm">
            <div className="relative h-[180px] sm:h-[300px]">
              <Image
                src={train}
                alt="Chennai coastal railway"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />

              <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#ff5722] px-2.5 py-1 text-[10px] text-white">
                  DEVELOPING
                </span>

                <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#40362f]">
                  Chennai Infrastructure
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h2 className="max-w-lg text-xl font-black leading-tight text-white sm:text-3xl">
                  {/* {featuredTitle} */}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#342d27] px-3 py-2.5 text-[9px] text-white">
              <div className="flex items-center gap-1.5">
                <Clock size={10} />
                <span>8 minutes ago</span>
                <div className="w-1 h-1 border-orange rounded-full bg-white"/>
                <span>By Karthikeyan Selvam</span>
              </div>

              <button
                type="button"
                onClick={() => setAudioPlaying(!audioPlaying)}
                className="flex cursor-pointer items-center gap-1 rounded-full bg-[#fff0e4] px-2.5 py-1 text-[13px] font-bold text-[#b74a25]"
              >
                <Headphones size={13} />
                {audioPlaying ? "Stop Audio" : "Listen in Tamil(3:45)"}
              </button>
            </div>

            <div className="p-3">
              <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px]">
                <span className="rounded-sm bg-[#ffe4d6] p-1 text-[#cf5124]">
                  <Newspaper size={13} />
                </span>

                <span className="font-extrabold">
                  News Tamil Bureau Special Report
                </span>

                <div className="w-2 h-2 border-orange rounded-full bg-orange-500"/>
                <span className="font-bold text-orange-500">
                  100% Fact Checked
                </span>
              </div>

              <p className="text-[12px] leading-[1.8] text-[#695a4e]">
                பெருநகர சென்னை போக்குவரத்து நெரிசலைக் குறைக்கும் நோக்கில் மெரினா முதல் திருவான்மியூர் வரையிலான
                உயர்மட்ட மற்றும் சுரங்க மெட்ரோ ரயில் பாதைகளுக்கான மண் பரிசோதனை மற்றும் தூண் அமைக்கும் பணிகள்
                இன்று காலை முறைப்படி தொடங்கப்பட்டன.
              </p>

              {audioPlaying && (
                <div className="mt-2 rounded-lg bg-[#fff0e4] p-2 text-[10px] text-[#9c4c2c]">
                  Audio preview selected. Connect a Tamil text-to-speech
                  service for actual audio playback.
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#f3e9e0] pt-2 text-[12px] text-[#857569]">
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  142 Live Debates
                </span>

                <button
                  type="button"
                  onClick={() => shareStory(featuredTitle)}
                  className="flex cursor-pointer items-center gap-1 hover:text-[#ff5722]"
                >
                  <Share2 size={12} />
                  2.4K Shares
                </button>

                <button
                  type="button"
                  onClick={() => toggleSave(featuredTitle)}
                  className={`flex cursor-pointer items-center gap-1 ${
                    saved.includes(featuredTitle)
                      ? "font-bold text-[#ff5722]"
                      : ""
                  }`}
                >
                  <Bookmark size={13} />
                  {saved.includes(featuredTitle) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </article>
        )}

       
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredNews.map((item) => {
            const isWeatherCard = item.category === "Weather Advisory";
            const isCinemaCard =
              item.category === "Cinema & Kollywood";

            return (
              <article
                key={item.category}
                className="overflow-hidden rounded-[16px]  border border-[#edddcf] bg-white shadow-sm"
              >
                {isWeatherCard ? (
                  
                  <div className="p-2.5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-[#ffe1dc] px-2 py-1 text-[12px] font-extrabold text-[#bd4c3a]">
                        <AlertTriangle size={10} />
                        Weather Advisory
                      </span>

                      <span className="text-[12px] text-[#897a6d]">
                        {item.time}
                      </span>
                    </div>

                    <div className="mb-2 rounded-xl bg-[#f5eee8] p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 40 40">  
                                <circle
                                cx="20"
                                cy="20"
                                r="18"
                                fill="none"
                                stroke="#e9d4c6"
                                strokeWidth="3.5" 
                                />
                                <circle
                                cx="20"
                                cy="20"
                                r="18"
                                fill="none"
                                stroke="#d94e25"
                                strokeWidth="3.5"
                                strokeDasharray="100"
                                strokeDashoffset="18" 
                                strokeLinecap="round"
                                />
                            </svg>

                            <span className="relative z-10 text-[12px] font-black text-[#d94e25]">
                                72%
                            </span>
                            </div>


                        <div className="min-w-0">
                          <p className="text-[15px] font-extrabold leading-relaxed">
                            Coastal Precipitation Probability
                          </p>

                          <p className="mt-1 flex items-start gap-1 text-[14px] leading-relaxed text-[#79695c]">
                            <MapPin
                              size={15}
                              className="mt-0.5 shrink-0"
                            />
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* <CloudSun
                        size={14}
                        className="shrink-0 text-[#ce7041]"
                      /> */}

                      <h3 className="text-[11px] font-extrabold">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-1.5 text-[15px] leading-[1.8] text-[#79695c]">
                      {item.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#f3e9e0] pt-2 text-[13px]">
                      <span className="text-[#897a6d]">
                        Source: {item.author}
                      </span>

                      <button
                        type="button"
                        onClick={() => shareStory(item.title)}
                        className="flex cursor-pointer items-center gap-1 font-bold text-[#b83d17] hover:underline"
                      >
                        Track Cyclone Map
                        <TrendingUp size={11} />
                      </button>
                    </div>
                  </div>
                ) : (
                  
                  <div className="p-2.5">
                    <div className="relative mb-2 h-[100px] overflow-hidden rounded-[10px] sm:h-[140px]">
                      <Image
                        src={item.image || tech}
                        alt={item.category}
                        fill
                        sizes="(max-width: 640px) 100vw, 360px"
                        className="object-cover transition duration-300 hover:scale-105"
                      />

                      <span className="absolute left-1.5 top-1.5 rounded-full bg-[#fff0e4] px-2 py-1 text-[11px] font-extrabold text-[#b74a25]">
                        {item.category}
                      </span>
                    </div>

                    <div className="mb-1 flex items-center justify-between gap-2 text-[12px] text-[#897a6d]">
                      <span>
                        {item.time} • {item.author}
                      </span>

                     
                    </div>

                    <h3 className="line-clamp-2 text-[12px] font-extrabold leading-relaxed">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 line-clamp-3 text-[15px] leading-[1.8] text-[#79695c]">
                      {item.description}
                    </p>

                    
                    {isCinemaCard && (
                      <div className="mt-2 rounded-lg bg-[#faf3ed] p-2">
                        <div className="mb-2 flex items-center justify-between gap-2 text-[15px] font-bold">
                          <span>Audience Poll</span>

                          <span className="font-medium text-[#897a6d]">
                            4,812 votes
                          </span>
                        </div>

                        {[
                          {
                            name: "Mega Blockbuster",
                            percent: 75,
                          },
                          {
                            name: "Average Run",
                            percent: 25,
                          },
                        ].map((option) => (
                          <button
                            type="button"
                            key={option.name}
                            onClick={() => {
                              setSelectedVote(option.name);
                              setShowResults(true);
                            }}
                            className={`mb-1 block w-full cursor-pointer text-left transition-colors ${
                              selectedVote === option.name
                                ? "text-[#d54c20]"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="mb-0.5 flex justify-between text-[13px]">
                              <span>{option.name}</span>
                              <span>{option.percent}%</span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-[#e8ddd4]">
                              <div
                                className="h-full rounded-full bg-[#f5bda5]"
                                style={{
                                  width: `${option.percent}%`,
                                }}
                              />
                            </div>
                          </button>
                        ))}

                        {showResults && selectedVote && (
                          <p className="mt-1 text-[9px] text-[#a65d3c]">
                            Selected: {selectedVote}. Demo poll only.
                          </p>
                        )}
                      </div>
                    )}
                    {isCinemaCard && (
                    <div className="mt-1 flex items-center justify-between text-[13px] text-[#897a6d]" >
                          <span>Poll closes in 6h</span>
                          <button
                                type="button"
                                aria-label="Save story"
                                onClick={() => toggleSave(item.title)}
                                className={`cursor-pointer ${
                                saved.includes(item.title)
                                    ? "text-[#ff5722]"
                                    : "text-[#897a6d]"
                                }`}
                                >
                                <Bookmark size={14} />
                            </button>
                        </div>
                    )}

                    <div className="mt-2 flex items-center justify-between border-t border-[#f3e9e0] pt-2">
                      <span className="text-[12px] font-bold bg-[#F2DFD1] border rounded-full border-[#faf3ed] p-1 pl-2 pr-2">
                        {item.tag}
                      </span>

                      <button
                        type="button"
                        onClick={() => shareStory(item.title)}
                        aria-label="Share news"
                        className="cursor-pointer text-[#e75a2a] hover:text-[#b83d17]"
                      >
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {filteredNews.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center sm:col-span-2">
              <Search
                size={28}
                className="mx-auto mb-2 text-[#c4a18b]"
              />

              <h3 className="text-sm font-bold">No news found</h3>

              <p className="mt-1 text-xs text-[#897a6d]">
                Try another search or select a different category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All News(84)");
                  setSearchText("");
                }}
                className="mt-3 cursor-pointer rounded-full bg-[#ff5722] px-4 py-2 text-xs font-bold text-white"
              >
                Show All News
              </button>
            </div>
          )}
        </section>

        
        {saved.length > 0 && (
          <section className="mt-4 rounded-xl border border-[#edddcf] bg-white p-3">
            <h2 className="mb-2 text-sm font-extrabold">
              Saved News ({saved.length})
            </h2>

            <div className="space-y-2">
              {saved.map((title) => (
                <div
                  key={title}
                  className="flex items-start justify-between gap-2 border-b border-[#f3e9e0] py-2"
                >
                  <p className="text-xs font-semibold">{title}</p>

                  <button
                    type="button"
                    onClick={() => toggleSave(title)}
                    className="shrink-0 text-[10px] font-bold text-[#b83d17]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {submitOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSubmitOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-news-title"
            className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="submit-news-title"
                className="text-lg font-extrabold"
              >
                Submit News
              </h2>

              <button
                type="button"
                aria-label="Close submit news"
                onClick={() => setSubmitOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center">
                <CheckCircle2
                  size={38}
                  className="mx-auto mb-3 text-emerald-600"
                />

                <h3 className="font-bold">Submission received</h3>

                <p className="mt-2 text-xs text-gray-500">
                  This is a demo confirmation. Connect a backend to
                  store and review submitted news.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitOpen(false)}
                  className="mt-4 cursor-pointer rounded-full bg-[#ff5722] px-5 py-2 text-sm font-bold text-white hover:bg-[#e94b18]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitNews} className="space-y-3">
                <label className="block text-xs font-bold">
                  News headline

                  <input
                    required
                    maxLength={160}
                    placeholder="Enter news headline"
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#ff5722]"
                  />
                </label>

                <label className="block text-xs font-bold">
                  Category

                  <select
                    required
                    defaultValue=""
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#ff5722]"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>

                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-bold">
                  News details

                  <textarea
                    required
                    rows={4}
                    maxLength={3000}
                    placeholder="Write the news details and source..."
                    className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#ff5722]"
                  />
                </label>

                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff5722] px-4 py-3 text-sm font-bold text-white hover:bg-[#e94b18]"
                >
                  <Send size={15} />
                  Submit for Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

