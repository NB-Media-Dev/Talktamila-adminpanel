
"use client";

import React, { useRef, useState } from "react";
import {
  X,
  BarChart2,
  Video,
  FileText,
  Camera,
  Volume2,
  MapPin,
  Heart,
  MessageCircle,
  Share2,
  Upload,
  Plus,
  Sparkles,
  Calendar,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Radio,
  Landmark,
  Bookmark,
  Send,
  Users,
  TrendingUp,
  MoreHorizontal,
  Globe,
  PencilSparkles,
  Paperclip,
  Vote,
  CircleQuestionMark,
  MessageSquare,
  ArrowLeftRight,
} from "lucide-react";
import Image from "next/image";

const train = "/Images/chennaitrain.jpg";
const avatar4 = "/Images/avatar4.png";

type StudioTab =
  | "Standard Post"
  | "Interactive Poll"
  | "Story / Reel"
  | "Breaking Alert";

type MediaItem = {
  name: string;
  url: string;
  type: string;
};

export default function CreatorStudioPollPage() {
  const [activeTab, setActiveTab] =
    useState<StudioTab>("Interactive Poll");

  const [pollDuration, setPollDuration] = useState("3d");
  const [pollRule, setPollRule] = useState("Single Pick Only");
  const [liveTally, setLiveTally] = useState(true);
  const [monetization, setMonetization] = useState(true);
  const [caption, setCaption] = useState(
    "சென்னை மெட்ரோ ரயில் இரண்டாம் கட்ட விரிவாக்கப் பணிகள் மெரினா மற்றும் வழித்தடங்களில் முழுவீச்சில் நடைபெற்று வருகின்றன. உங்கள் ஏரியாவில் இத்திட்டத்தால் ஏற்படப்போகும் நன்மைகள் என்ன? உங்கள் கருத்துக்களை கீழே பதிவு செய்யுங்கள்!"
  );

  const [pollQuestion, setPollQuestion] = useState(
    "சென்னை மெட்ரோ விரிவாக்கம் உங்கள் பகுதியில் மெட்ரோ சேவை உடனே தேவையா?"
  );

  const [choices, setChoices] = useState([
    "ஆம், உடனே தேவை (Yes, immediately)",
    "ஏற்கனவே உள்ளது (Already connected)",
    "பேருந்து சேவையே போதுமானது (Buses are sufficient)",
  ]);

  const [selectedPreview, setSelectedPreview] =
    useState("Feed Card");

  const [selectedVote, setSelectedVote] = useState<number | null>(
    null
  );

  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [earliestScheduleInput] = useState(() =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  );
  const [showSchedule, setShowSchedule] = useState(false);
  const [audience, setAudience] = useState("Public");
  const [showMore, setShowMore] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    {
      id: "Standard Post" as const,
      name: "Standard Post",
      icon: <FileText size={13} />,
    },
    {
      id: "Interactive Poll" as const,
      name: "Interactive Poll",
      icon: <BarChart2 size={13} />,
    },
    {
      id: "Story / Reel" as const,
      name: "Story / Reel",
      icon: <Video size={13} />,
    },
    {
      id: "Breaking Alert" as const,
      name: "Breaking Alert",
      icon: <Radio size={13} />,
    },
  ];

  const updateChoice = (index: number, value: string) => {
    setChoices((previous) =>
      previous.map((choice, i) => (i === index ? value : choice))
    );
  };

  const addChoice = () => {
    if (choices.length >= 4) return;

    setChoices((previous) => [...previous, ""]);
  };

  const removeChoice = (index: number) => {
    if (choices.length <= 2) {
      setStatusMessage("A poll needs at least two choices.");
      return;
    }

    setChoices((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setSelectedVote(null);
    setStatusMessage("");
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setStatusMessage("Please select an image or video file.");
      event.target.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setStatusMessage("File size must be 50 MB or less.");
      event.target.value = "";
      return;
    }

    if (media?.url.startsWith("blob:")) {
      URL.revokeObjectURL(media.url);
    }

    setMedia({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    });

    setStatusMessage("Media attached successfully.");
    event.target.value = "";
  };

  const removeMedia = () => {
    if (media?.url.startsWith("blob:")) {
      URL.revokeObjectURL(media.url);
    }

    setMedia(null);
    setStatusMessage("Media removed.");
  };

  const handleSaveDraft = () => {
    const draft = {
      activeTab,
      caption,
      pollQuestion,
      choices,
      pollDuration,
      pollRule,
      liveTally,
      audience,
    };

    try {
      localStorage.setItem(
        "creator-studio-draft",
        JSON.stringify(draft)
      );

      setStatusMessage("Draft saved in this browser.");
    } catch {
      setStatusMessage(
        "Unable to save draft in browser storage."
      );
    }
  };

  const handlePublish = () => {
    if (!caption.trim()) {
      setStatusMessage("Please enter your post content.");
      return;
    }

    if (
      activeTab === "Interactive Poll" &&
      (!pollQuestion.trim() ||
        choices.length < 2 ||
        choices.some((choice) => !choice.trim()))
    ) {
      setStatusMessage(
        "Enter the poll question and complete all choices."
      );
      return;
    }

    setStatusMessage(
      "Preview is ready. Connect your backend to publish this post."
    );
  };

  const handleSchedule = () => {
    if (!scheduledAt) {
      setStatusMessage("Select a date and time to schedule.");
      return;
    }

    if (new Date(scheduledAt).getTime() <= Date.now()) {
      setStatusMessage("Choose a future date and time.");
      return;
    }

    setShowSchedule(false);

    setStatusMessage(
      `Schedule selected: ${new Date(scheduledAt).toLocaleString()}. Connect your backend to queue this post.`
    );
  };

  const renderMedia = () => {
    if (media) {
      if (media.type.startsWith("video/")) {
        return (
          <video
            src={media.url}
            controls
            className="h-full max-h-[350px] w-full rounded-xl object-cover"
          />
        );
      }

      return (
        <img
          src={media.url}
          alt="Selected post media"
          className="h-full max-h-[350px] w-full rounded-xl object-cover"
        />
      );
    }

    return (
      <div className="relative h-full min-h-[160px] w-full overflow-hidden rounded-xl">
        <Image
          src={train}
          alt="Chennai metro news visual"
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover"
        />

        <div className="absolute bottom-2 left-2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-gray-800">
          Official Community Survey
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full  p-4 font-sans text-gray-800 antialiased selection:bg-orange-100 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        
        <header className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
                <PencilSparkles size={10} />
              <h1 className="text-xl font-black tracking-tight text-gray-950 sm:text-2xl">
                Creator Studio
              </h1>

              <span className="rounded-md border border-orange-200 bg-orange-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#E05319]">
                V2.4 Editorial
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-400">
              Craft multi-lingual updates, community polls, and
              verified broadcasts.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-start rounded-full pl-4 pr-4 border-gray-50 bg-gray-50 p-2 shadow-sm sm:self-auto">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200">
              <Image
                src={avatar4}
                alt="Creator avatar"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold leading-tight text-gray-900">
                Posting as Influencer
              </span>

              <span className="mt-0.5 text-[10px] font-bold leading-none text-[#695C51]">
                Verified Media Partner
              </span>
            </div>
            <ArrowLeftRight size={18}/>
          </div>
        </header>

        
        <div className="flex items-center gap-1.5 overflow-x-auto border-b bg-white rounded-full border-gray-200 p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setStatusMessage("");
              }}
              className={`relative top-px flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs  ${
                activeTab === tab.id
                  ? "border-x border  bg-orange-500 font-black text-white shadow-sm "
                  : "border-transparent bg-transparent font-bold text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

      
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
         
          <section className="flex flex-col gap-5 lg:col-span-7 bg-white p-4 border-gray-200 rounded-2xl ">
           
            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed pb-2 text-xs font-bold text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="font-serif font-black">B</span>
                  <span className="font-serif italic">I</span>
                  <span><Paperclip size={12} /></span>
                  <span className="font-mono">“ ”</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setStatusMessage(
                      "Headline helper selected. Connect an AI service to generate suggestions."
                    )
                  }
                  className="flex cursor-pointer items-center gap-1 rounded-md border border-orange-100 bg-[#FFDBD0] px-2 py-1 text-[10px] tracking-wide text-[#3A0B00] "
                >
                  <Sparkles size={11} />
                  AI Tamil Headline Polish
                </button>
              </div>

              <textarea
                rows={4}
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Write your announcement or description..."
                className="w-full resize-y border-none bg-transparent text-sm font-semibold leading-relaxed text-gray-900 outline-none placeholder:opacity-50"
              />

              <div className="text-right text-[10px] text-gray-400">
                {caption.length} characters
              </div>
            </div>

          
            {activeTab === "Interactive Poll" && (
              <div className="flex flex-col gap-4 rounded-2xl border border-white bg-[#F7F3EE] p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b pb-2">
                  <h3 className="flex items-center gap-1.5 text-[15px] font-black  tracking-wider ">
                    <Vote size={18} className="text-orange-500"/>
                    Poll Configuration
                  </h3>

                  <span className="text-[10px] font-bold text-[#695C51]">
                    {choices.length} of 4 Choices Active
                  </span>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#695C51]">
                    Poll Main Prompt
                  </span>

                  <div className="flex items-center gap-2 rounded-xl border-gray-200 bg-gray-50 p-3 shadow-sm transition-colors">
                    <span className="text-sm"><CircleQuestionMark size={18}  className="text-[#FF5000]"/> </span>

                    <input
                      value={pollQuestion}
                      onChange={(event) =>
                        setPollQuestion(event.target.value)
                      }
                      className="w-full bg-transparent text-xs font-bold text-gray-900 outline-none sm:text-sm"
                    />
                  </div>
                </label>

               
                <div className="flex flex-col gap-2">
                  {choices.map((choice, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition-colors hover:border-gray-300"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border bg-gray-50 text-[10px]  font-black">
                        {index + 1}
                      </span>

                      <input
                        value={choice}
                        onChange={(event) =>
                          updateChoice(index, event.target.value)
                        }
                        aria-label={`Poll choice ${index + 1}`}
                        className="w-full min-w-0 bg-transparent text-xs font-semibold text-gray-800 outline-none"
                        placeholder={`Enter option ${index + 1}`}
                      />

                      <button
                        type="button"
                        aria-label={`Remove choice ${index + 1}`}
                        onClick={() => removeChoice(index)}
                        className="shrink-0 cursor-pointer text-gray-300 transition-colors hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    disabled={choices.length >= 4}
                    onClick={addChoice}
                    className="mt-0.5 flex w-fit cursor-pointer items-center gap-1.5 px-1 py-1 text-[13px] font-bold text-[#FF5000] border-white rounded-full bg-[#FFFFFF] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={14} />
                    Add Choice
                    <span className="ml-1 text-[12px] font-medium ">
                      (Up to 4 options)
                    </span>
                  </button>
                </div>

                
                <div className="mt-1 grid grid-cols-1 gap-4 border-t pt-4 text-xs font-bold text-[#695C51] md:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      Poll Duration
                    </span>

                    <div className="flex gap-1 rounded-lg bg-gray-50 p-1">
                      {["24h", "3 Days", "7 Days"].map((duration) => (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => setPollDuration(duration)}
                          className={`flex-1 cursor-pointer rounded-md px-1 py-1.5 text-[10px] text-[#59413A] transition-all ${
                            pollDuration === duration
                              ? "border   text-white bg-orange-500 shadow-sm"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {duration}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      Choice Rules
                    </span>

                    <select
                      value={pollRule}
                      onChange={(event) =>
                        setPollRule(event.target.value)
                      }
                      className="w-full rounded-lg border-gray-200 bg-white px-2 py-2 text-[10px] outline-none focus:border-orange-400"
                    >
                      <option>Single Pick Only</option>
                      <option>Multiple Picks</option>
                    </select>
                  </label>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      Live Tally
                    </span>

                    <button
                      type="button"
                      onClick={() => setLiveTally(!liveTally)}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      {liveTally ? (
                        <ToggleRight
                          size={23}
                          className="text-[#E05319]"
                        />
                      ) : (
                        <ToggleLeft
                          size={23}
                          className="text-gray-400"
                        />
                      )}

                      <span className="text-[10px]">
                        {liveTally
                          ? "Visible to voters"
                          : "Hidden from voters"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Standard Post" && (
              <div className="rounded-2xl border bg-white p-4">
                <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">
                  Standard Post Settings
                </h3>

                <p className="text-xs leading-relaxed text-gray-500">
                  Create a regular news post with a caption and optional
                  media attachment. The preview updates as you type.
                </p>
              </div>
            )}

            {activeTab === "Story / Reel" && (
              <div className="rounded-2xl border bg-white p-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400">
                  <Video size={14} />
                  Story / Reel Settings
                </h3>

                <p className="text-xs leading-relaxed text-gray-500">
                  Attach an image or video and add a short caption for
                  your story or reel.
                </p>
              </div>
            )}

            {activeTab === "Breaking Alert" && (
              <div className="rounded-2xl border border-red-100 bg-white p-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-500">
                  <Radio size={14} />
                  Breaking Alert
                </h3>

                <p className="text-xs leading-relaxed text-gray-500">
                  Prepare an urgent news alert. Verify the source and
                  details before publishing.
                </p>
              </div>
            )}

            
            <div className="flex flex-col gap-4  p-4 ">
              <div className="flex flex-wrap items-center justify-between gap-2  pb-2">
                <h3 className="flex items-center gap-2 text-[20px] text-black font-bold tracking-wider ">
                  <Camera size={18} className="text-[#FF5000]" />
                  Attached Visual Media
                </h3>

                <span className="text-[10px] font-bold text-gray-400">
                  {media ? "1 of 4 slots attached" : "0 of 4 slots attached"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="relative min-h-[110px] overflow-hidden rounded-xl border border-gray-300 bg-gray-50 p-2">
                  {media ? (
                    <>
                      {media.type.startsWith("image/") ? (
                        <img
                          src={media.url}
                          alt="Attached media"
                          className="h-24 w-full rounded-lg object-cover"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="h-24 w-full rounded-lg object-cover"
                          controls
                        />
                      )}

                      <button
                        type="button"
                        onClick={removeMedia}
                        aria-label="Remove attached media"
                        className="absolute right-3 top-3 rounded-full bg-white p-1 text-red-500 shadow"
                      >
                        <X size={12} />
                      </button>

                      <p className="mt-2 truncate text-[10px] font-bold">
                        {media.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="relative h-20 overflow-hidden rounded-lg">
                        <Image
                          src={train}
                          alt="Default hero visual"
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                        
                      <p className="mt-2 text-[10px] font-bold">
                        Hero Visual
                      </p>
                     
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-[#F7F3EE] p-3 text-center transition-colors hover:border-orange-400 hover:bg-orange-50"
                >
                  <Upload size={20} className="text-[#E05319]" />

                  <span className="text-[10px] font-black">
                    Upload Media
                  </span>

                  <span className="text-[9px] text-gray-400">
                    Image or video · Max 50 MB
                  </span>
                </button>

                <div className="flex min-h-[110px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-[#F7F3EE] p-3 text-center">
                  <Volume2 size={20} className="text-gray-400" />

                  <span className="text-[10px] font-black">
                    Tamil Audio Note
                  </span>

                  <span className="text-[9px] text-gray-400">
                    Voice recording integration needed
                  </span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>

            
            <div className="flex flex-col gap-4 rounded-2xl bg-[#F7F3EE] p-4 ">
              <label className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[20px] font-bold text-gray-600">
                  <Globe size={20} className="text-[#E05319]" />
                  Audience
                </span>

                <select
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  className="rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold outline-none focus:border-orange-400"
                >
                  <option>Public</option>
                  <option>Followers</option>
                  <option>Private</option>
                </select>
              </label>

              <p className="text-[15px] font-bold">
                Audience: {audience}
                {audience === "Public"
                  ? " (Everyone can view)"
                  : audience === "Followers"
                    ? " (Followers only)"
                    : " (Private preview)"}
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  <Bookmark size={14} />
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs font-bold text-[#E05319] hover:bg-orange-100"
                >
                  <Calendar size={14} />
                  Schedule
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E05319] px-4 py-3 text-xs font-black text-white hover:bg-[#c94713]"
                >
                  <Send size={14} />
                  Publish Now
                </button>
              </div>

              {showSchedule && (
                <div className="flex flex-col gap-3 rounded-xl border border-orange-100 bg-orange-50 p-3 sm:flex-row sm:items-end">
                  <label className="flex-1 text-xs font-bold">
                    Schedule date and time

                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(event) =>
                        setScheduledAt(event.target.value)
                      }
                      min={earliestScheduleInput}
                      className="mt-1.5 w-full rounded-lg border bg-white p-2 text-xs outline-none focus:border-orange-400"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSchedule}
                    className="rounded-lg bg-[#E05319] px-4 py-2.5 text-xs font-bold text-white"
                  >
                    Confirm Schedule
                  </button>
                </div>
              )}

              {statusMessage && (
                <div
                  role="status"
                  className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-xs leading-relaxed text-[#A3411B]"
                >
                  {statusMessage}
                </div>
              )}
            </div>
          </section>

         
          <aside className="flex flex-col gap-4 lg:col-span-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[20px] ml-[40px] font-black text-gray-900">
                  Real-time Feed Preview
                </h2>

              </div>

              <div className="flex rounded-full border-gray-100 bg-white p-1">
                {["Feed Card", "Full Story"].map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setSelectedPreview(view)}
                    className={`cursor-pointer rounded-full px-2.5 py-1.5 text-[10px] font-bold ${
                      selectedPreview === view
                        ? "bg-orange-100 text-[#E05319]"
                        : "text-gray-500"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                    <Image
                      src={avatar4}
                      alt="News Tamila profile"
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-xs font-black text-gray-900">
                        News Tamila
                      </span>

                      <span className="rounded-full bg-[#FFDBD0] px-2 py-1 text-[9px] font-bold ">
                        Influencer
                      </span>
                    </div>

                    <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">
                      <MapPin size={10} />
                      Chennai, India · Just now
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    aria-label="More post actions"
                    onClick={() => setShowMore(!showMore)}
                    className="cursor-pointer rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                  >
                    <MoreHorizontal size={19} />
                  </button>

                  {showMore && (
                    <div className="absolute right-0 top-8 z-20 w-36 rounded-xl border bg-white p-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setSaved(!saved);
                          setShowMore(false);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-gray-50"
                      >
                        {saved ? "Remove Bookmark" : "Save Post"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStatusMessage(
                            "Report option selected. Connect a moderation API to submit a report."
                          );
                          setShowMore(false);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-gray-50"
                      >
                        Report Post
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-3 pb-3">
                <p
                  className={`whitespace-pre-wrap text-xs leading-[1.8] text-gray-800 ${
                    selectedPreview === "Feed Card" ? "line-clamp-5" : ""
                  }`}
                >
                  {caption}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-[#E05319]">
                  <span>#ChennaiMetro</span>
                  <span>#TamilNaduInfras</span>
                  <span>#CityPoll</span>
                </div>
              </div>

              <div className="px-3 pb-3">{renderMedia()}</div>

              {activeTab === "Interactive Poll" && (
                <div className="px-3 pb-3">
                  <div className="rounded-xl border border-orange-100 bg-[#FFFAF6] p-3">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-gray-900">
                        {pollQuestion}
                      </span>

                      <span className="text-[10px] font-bold">LIVE VOTER STATUS PREVIEW : </span>

                      <span className="flex items-center gap-1 rounded-full bg-[#FFDBD0] px-2 py-1 text-[10px] font-bold ">
                        
                        Active : 
                        {pollDuration} left
                      </span>
                    </div>

                    {choices.map((choice, index) => {
                      const percentages =
                        choices.length === 2
                          ? [64, 36]
                          : choices.length === 3
                            ? [64, 22, 14]
                            : [50, 25, 15, 10];

                      const percent = percentages[index] ?? 0;
                      const isSelected = selectedVote === index;

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedVote(index)}
                          className={`mb-2 w-full cursor-pointer rounded-lg border p-2.5 text-left transition-colors ${
                            isSelected
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-200 bg-white hover:border-orange-200"
                          }`}
                        >
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <span className="flex items-start gap-2 text-[10px] font-semibold leading-relaxed text-gray-700">
                              <span className="mt-0.5">
                               
                              </span>
                              {choice || `Option ${index + 1}`}
                            </span>

                            {liveTally && (
                              <span className="shrink-0 text-[10px] font-black text-gray-600">
                                {percent}%
                              </span>
                            )}
                          </div>

                          {liveTally && (
                            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full ${
                                  index === 0
                                    ? "bg-[#E05319]"
                                    : "bg-gray-300"
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() =>
                        setStatusMessage(
                          "Demo vote selected. Connect a backend to record and count real votes."
                        )
                      }
                      className="w-full cursor-pointer rounded-lg bg-[#E05319] py-2.5 text-xs font-black text-white hover:bg-[#c94713]"
                    >
                      Submit Vote
                    </button>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-orange-100 pt-3 text-[12px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users size={13} />
                        Projected: ~12,450 votes
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setStatusMessage(
                            "Live analytics require real vote data from your backend."
                          )
                        }
                        className="flex cursor-pointer items-center gap-1 font-bold text-[#E05319]"
                      >
                        <TrendingUp size={11} />
                        Live Analytics
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mx-3 border-t border-gray-100 py-2">
                <div className="flex items-center text-[13px] gap-2 text-gray-400">
                    <div className="flex gap-0.5 items-center">
                        <Heart size={15} />
                        <span> 2.6k </span>
                    </div>
                   <div className="flex gap-0.5 items-center">
                        <MessageSquare size={15} />
                        <span>492 </span>
                    </div>
                    <div className="flex gap-0.5 items-center">
                        <Share2 size={15} />
                        <span>1.1k </span>
                    </div>
                    <div className="flex gap-0.5 items-center ml-60 hover:text-orange-500">
                       <Bookmark size={18} />
                    </div>
                </div>
              </div>

              <div className="mx-3 flex items-center justify-around border-t border-gray-100 py-2.5">
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className={`flex cursor-pointer items-center gap-1.5 text-[10px] font-bold ${
                    liked ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  <Heart
                    size={15}
                    fill={liked ? "currentColor" : "none"}
                  />
                  {liked ? "Liked" : "Like"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStatusMessage(
                      "Comments preview selected. Connect a comments service to continue."
                    )
                  }
                  className="flex cursor-pointer items-center gap-1.5 text-[10px] font-bold text-gray-500"
                >
                  <MessageCircle size={15} />
                  Comment
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStatusMessage(
                      "Use your browser share menu to share the post URL."
                    )
                  }
                  className="flex cursor-pointer items-center gap-1.5 text-[10px] font-bold text-gray-500"
                >
                  <Share2 size={15} />
                  Share
                </button>
              </div>
            </div>

          
           <div className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-3.5 select-none font-sans">
            
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-xs font-black text-gray-900 tracking-tight">
                <TrendingUp size={14} className="text-[#E05319]" />
                <span>Reach Predictor</span>
                </h3>

                <span className="rounded-full bg-[#FFF2EC] border border-[#FFD2BE] text-[#D45113] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide shadow-2xs">
                High Demand
                </span>
            </div>

           
            <div className="flex justify-between items-start w-full">
              
                <div className="flex flex-col tracking-tight text-gray-950 font-black">
                <span className="text-2xl leading-none sm:text-3xl">45K–68K</span>
                {/* <span className="text-2xl leading-none sm:text-3xl mt-1"></span> */}
                </div>

                
                <div className="flex flex-col text-left justify-center min-w-0 pr-4 mt-1 font-medium text-gray-400 text-[11px] leading-snug">
                <span>Est.</span>
                <span>Impressions</span>
                </div>
            </div>

            <div className="w-full h-16 relative overflow-hidden mt-1">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
               
                <polygon
                    points="0,30 100,15 100,40 0,40"
                    fill="#FFF2EC"
                    opacity="0.6"
                />
                
                <line
                    x1="0"
                    y1="30"
                    x2="100"
                    y2="15"
                    stroke="#E05319"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                </svg>
            </div>

          
            <p className="text-[11px] leading-relaxed font-semibold text-gray-500/90 px-0.5 mt-1">
                Transit & infrastructure hashtags are trending{" "}
                <span className="text-[#E05319] font-black">+34%</span> in Chennai metro
                zone this week.
            </p>
            </div>


           
            <div className="rounded-2xl  bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-xs font-black text-gray-900">
                  <DollarSign size={15} className="text-[#E05319]" />
                  Monetization
                </h3>

                <button
                  type="button"
                  onClick={() => setMonetization(!monetization)}
                  aria-label="Toggle monetization"
                  className="cursor-pointer text-[#E05319]"
                >
                  {monetization ? (
                    <ToggleRight size={25} />
                  ) : (
                    <ToggleLeft size={25} className="text-gray-400" />
                  )}
                </button>
              </div>

              <p className="mt-2 text-[13px] font-bold text-gray-700">
                {monetization
                  ? "Enable Tips & Gifting"
                  : "Tips & Gifting Disabled"}
              </p>

              <p className="mt-1 text-[12px] leading-relaxed text-[#695C51]">
                {monetization
                  ? "Allows audience to tip directly via UPI / Card on this poll thread."
                  : "Audience tipping is switched off in this preview."}
              </p>

              <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <Landmark size={20} className="text-gray-500" />

                  <div>
                    <p className="text-[12px]">Payout Target</p>
                    <p className="text-[11px] font-bold text-gray-800">
                      HDFC •••• 4092
                    </p>

                  </div>
                </div>

                <span className="text-xs font-bold border-[#F1EDE8] rounded-full p-2 bg-[#F1EDE8] text-[#AD3303]">
                  ₹48,200 Avail
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

