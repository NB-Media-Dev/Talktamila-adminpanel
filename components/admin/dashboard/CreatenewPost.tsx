"use client"
import { useContext, useEffect, useRef, useState } from "react";
import { Sparkle, UploadCloud, MoveLeft, X, Pencil, ChevronLeft } from "lucide-react";
import { useContenthook } from "@/hooks/useContent";
import { buttonVariants } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { LivePreviewloading } from "@/components/ui/Skeletonloading";
const avatar1 = "/Images/avatar1.png";
import { FacebookPostPreview } from "./FacebookPostPreview";
import PostImageEditor from "./PostImageEditor";
import { notifyPostsChanged, postService } from "@/services/post.service";
import { POST_LIMITS, type PostType } from "@/types/Posts";
import MusicsControl, { type MusicTrack } from "./MusicsControl";
import { trackToPostMusic } from "@/lib/postMusic";
import {
  errorMessage,
  localInputToIso,
  maxLocalInput,
  minLocalInput,
  validateLocalInput,
} from "@/lib/schedule";

const platformList = [
  { id: "Talk Tamila", name: "Talk Tamila" },
  { id: "Instagram", name: "Instagram" },
  { id: "Threads", name: "Threads" },
  { id: "X", name: "X" },
  { id: "Facebook", name: "Facebook" },
  { id: "YouTube", name: "YouTube" },
  { id: "LinkedIn", name: "LinkedIn" },
  { id: "Telegram", name: "Telegram" },
];

interface Slide {
  file: File;
  original: File;
  edited: boolean;
}

function fileProblem(file: File): string | null {
  const isImage = (POST_LIMITS.imageTypes as readonly string[]).includes(file.type);
  const isVideo = (POST_LIMITS.videoTypes as readonly string[]).includes(file.type);
  if (!isImage && !isVideo) return "Use a JPG, PNG, WEBP, GIF, MP4, WEBM or MOV file.";
  const limit = isImage ? POST_LIMITS.imageBytes : POST_LIMITS.videoBytes;
  if (file.size > limit) {
    return `That ${isImage ? "image" : "video"} is too large. Maximum size is ${limit / (1024 * 1024)} MB.`;
  }
  return null;
}

export function CreatenewPost() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Talk Tamila"]);
  const router = useRouter();

  const [step, setStep] = useState<"edit" | "loading" | "preview">("edit");

  const context = useContext(useContenthook);

  if (!context) {
    throw new Error("CreatenewPost must be used within a UseContentProvider");
  }
  const { setHandlestate } = context;

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  // Up to 10 photos (a carousel) or one video. The first slide is the cover.
  // `original` is the photo exactly as it was chosen, so the editor can always start again from it.
  const [slides, setSlides] = useState<Slide[]>([]);
  const [active, setActive] = useState(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [scheduleAt, setScheduleAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"schedule" | "publish" | null>(null);
  const [track, setTrack] = useState<MusicTrack | null>(null);
  const [musicStart, setMusicStart] = useState(0);
  const [commentsOff, setCommentsOff] = useState(false);
  const [hideLikes, setHideLikes] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const current = slides[active] ?? null;
  const file = slides[0]?.file ?? null;
  const originalFile = current?.original ?? null;
  const edited = !!current?.edited;
  const previewUrl = thumbs[active] || null;
  const isVideoFile = !!file && file.type.startsWith("video/");
  const photoCount = isVideoFile ? 0 : slides.length;
  // Photos can be edited (GIFs can't: editing would flatten the animation).
  const canEditPhoto = !!current && current.file.type.startsWith("image/") && current.original.type !== "image/gif";

  // Small pictures for the preview and the slide strip. Freed again when the slides change.
  useEffect(() => {
    const urls = slides.map((s) => (s.file.type.startsWith("image/") ? URL.createObjectURL(s.file) : ""));
    setThumbs(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [slides]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId]
    );
  };

  const chooseFiles = (picked: FileList | File[] | null | undefined) => {
    const list = Array.from(picked ?? []);
    if (list.length === 0) return;
    for (const f of list) {
      const problem = fileProblem(f);
      if (problem) {
        setError(problem);
        return;
      }
    }
    const video = list.find((f) => f.type.startsWith("video/"));
    if (video) {
      if (list.length > 1) {
        setError("A video has to be posted on its own. Choose one video, or several photos.");
        return;
      }
      setError(null);
      setSlides([{ file: video, original: video, edited: false }]);
      setActive(0);
      setEditorOpen(false);
      return;
    }
    // Photos are added after the ones already chosen (a video is replaced).
    const keep = isVideoFile ? [] : slides;
    const room = POST_LIMITS.maxCarousel - keep.length;
    if (room <= 0) {
      setError(`A post can have at most ${POST_LIMITS.maxCarousel} photos.`);
      return;
    }
    const added: Slide[] = list.slice(0, room).map((f) => ({ file: f, original: f, edited: false }));
    setError(
      list.length > room
        ? `Only ${POST_LIMITS.maxCarousel} photos fit in one post, so the extra ones were left out.`
        : null,
    );
    setSlides([...keep, ...added]);
    setActive(keep.length);
    setEditorOpen(false);
  };

  const removeFile = () => {
    setSlides([]);
    setActive(0);
    setEditorOpen(false);
  };

  const removeSlide = (index: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
    setActive((prev) => Math.max(0, Math.min(index < prev ? prev - 1 : prev, slides.length - 2)));
    setEditorOpen(false);
  };

  // Move a photo one place earlier (moving it to place 1 makes it the cover).
  const moveSlideEarlier = (index: number) => {
    if (index <= 0) return;
    setSlides((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setActive(index - 1);
  };

  const handleNext = () => {
    setStep("loading");
    setTimeout(() => setStep("preview"), 300);
  };

  const submit = async (mode: "schedule" | "publish") => {
    setError(null);

    const text = [title.trim(), caption.trim()].filter(Boolean).join("\n\n");

    // If Schedule is clicked with no content at all → go straight to the schedule page
    if (mode === "schedule" && !text && !file) {
      setHandlestate(false);
      router.push("/admin/content");
      return;
    }

    // If Publish is clicked with no content → show error
    if (mode === "publish" && !text && !file) {
      setError("Write something or add a photo or video first.");
      return;
    }

    let scheduledAt: string | undefined;
    if (mode === "schedule") {
      const problem = validateLocalInput(scheduleAt);
      if (problem) {
        setError(problem);
        return;
      }
      scheduledAt = localInputToIso(scheduleAt);
    }

    const postType: PostType = file ? (file.type.startsWith("video/") ? "video" : "image") : "text";

    // Videos keep their own sound, so the song only goes on photos and text posts.
    if (track && postType !== "video" && !track.previewUrl) {
      setError("That song has no playable preview. Pick another one.");
      return;
    }
    const music = track && postType !== "video" ? trackToPostMusic(track, musicStart) : undefined;

    setBusy(mode);
    try {
      await postService.create({
        postType,
        content: text || undefined,
        media: file ?? undefined,
        extraMedia: postType === "image" ? slides.slice(1).map((s) => s.file) : undefined,
        scheduledAt,
        music,
        commentsDisabled: commentsOff,
        hideLikeCount: hideLikes,
      });
      notifyPostsChanged();
      setHandlestate(false);
      if (mode === "schedule") router.push("/admin/content");
    } catch (e) {
      setError(errorMessage(e));
      setBusy(null);
    }
  };

  const isPreviewLoading = step === "loading";

  // The row of small pictures: tap to choose, X to remove, arrow to move earlier.
  const slideStrip =
    slides.length > 1 ? (
      <div className="flex gap-2 overflow-x-auto py-1 max-w-full">
        {slides.map((slide, i) => (
          <div key={`${slide.original.name}-${slide.original.lastModified}-${slide.original.size}-${i}`} className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setActive(i);
                setEditorOpen(false);
              }}
              aria-label={`Photo ${i + 1}`}
              className={`block h-14 w-14 overflow-hidden rounded-lg border-2 bg-[#fff0e7] cursor-pointer ${
                i === active ? "border-[#ef8b54]" : "border-transparent"
              }`}
            >
              {thumbs[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbs[i]} alt="" className="h-full w-full object-cover" />
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => removeSlide(i)}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-800 text-white cursor-pointer"
            >
              <X size={10} />
            </button>
            {i > 0 && (
              <button
                type="button"
                onClick={() => moveSlideEarlier(i)}
                aria-label={`Move photo ${i + 1} earlier`}
                className="absolute -bottom-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-800 shadow cursor-pointer"
              >
                <ChevronLeft size={10} />
              </button>
            )}
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-black/55 text-center text-[8px] font-bold text-white rounded-b-lg">
                Cover
              </span>
            )}
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 top-[52px] xs:top-[40px] sm:top-[20px] md:top-0 bg-black/50 backdrop-blur-xs flex items-start md:items-center justify-center p-0 md:p-4 z-40">
      <div className="w-full h-full xs:mt-5 md:h-auto md:max-h-[92vh] md:max-w-4xl min-[2560px]:max-w-[1250px] min-[3840px]:max-w-[1600px] rounded-none md:rounded-[28px] bg-[#fff0e7] shadow-2xl px-4 pt-3 pb-28 md:px-6 md:py-5 min-[2560px]:p-6 min-[3840px]:p-8 relative font-sans antialiased border-0 md:border border-orange-100 overflow-y-auto flex flex-col justify-start">

        <div className="block sm:hidden mb-2">
          <button
            onClick={() => { setHandlestate(false) }}
            className="hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
            aria-label="Go back"
          >
            <MoveLeft size={30} className="text-brand w-10 h-9" />
          </button>
        </div>

        <button
          onClick={() => { setHandlestate(false) }}
          className="hidden sm:flex absolute right-4 top-4 md:right-5 md:top-5 h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 shadow-sm transition-all duration-200 cursor-pointer z-10"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] min-[2560px]:grid-cols-[1fr_380px] min-[3840px]:grid-cols-[1fr_450px] gap-6 min-[3840px]:gap-8 items-start mt-1">
          <div className={`flex flex-col gap-2.5 min-[3840px]:gap-3.5 ${step === "edit" ? "block" : "hidden lg:flex"}`}>
            <div>
              <h1 className="text-2xl min-[2560px]:text-3xl min-[3840px]:text-4xl font-bold text-[#9b4811] tracking-tight">Create New Post</h1>
              <p className="mt-0.5 text-sm min-[3840px]:text-base text-orange-900/60 font-medium">
                Share your thoughts or AI-generated content with the Tamil community.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 min-[3840px]:gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm min-[3840px]:text-base font-bold text-gray-800">Post Details</h2>
                <button type="button" className="flex items-center gap-1 text-xs min-[3840px]:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer">
                  <Sparkle size={12} className="fill-orange-600 min-[3840px]:w-3.5 min-[3840px]:h-3.5" />
                  Generate Caption
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="postTitle" className="text-[13px] min-[3840px]:text-sm font-semibold text-gray-600">Title / Headline</label>
                <input
                  id="postTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an eye-catching title..."
                  className="w-full h-9 min-[2560px]:h-10 min-[3840px]:h-11 px-3 min-[3840px]:px-4 rounded-xl bg-white border border-transparent outline-none text-xs min-[3840px]:text-sm transition-all shadow-sm focus:border-[#ef8b54] placeholder:text-gray-400 text-gray-800"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="postCaption" className="text-[13px] min-[3840px]:text-sm font-bold text-gray-600">Description / Caption</label>
                <textarea
                  id="postCaption"
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={POST_LIMITS.contentLength}
                  placeholder="Write your thoughts here... Use #hashtags to trend!"
                  className="w-full p-2.5 min-[3840px]:p-3.5 rounded-xl bg-white border border-transparent outline-none text-xs min-[3840px]:text-sm resize-none transition-all shadow-sm focus:border-[#ef8b54] placeholder:text-gray-400 text-gray-800 leading-relaxed"
                />
              </div>
            </div>

            <input
              ref={fileInput}
              type="file"
              accept={[...POST_LIMITS.imageTypes, ...POST_LIMITS.videoTypes].join(",")}
              className="hidden"
              multiple
              onChange={(e) => {
                chooseFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                chooseFiles(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-orange-200 bg-white rounded-2xl p-2.5 min-[2560px]:p-3 min-[3840px]:p-4 text-center flex flex-col items-center justify-center gap-1 min-[3840px]:gap-1.5 shadow-sm transition-colors hover:border-orange-300"
            >
              <div className="p-0.5 bg-[#fff0e7] rounded-full text-[#ef8b54]">
                <UploadCloud size={18} className="min-[3840px]:w-5 min-[3840px]:h-5" />
              </div>
              {file ? (
                <>
                  <p className="text-xs min-[3840px]:text-sm font-bold text-gray-800 max-w-[260px] truncate">
                    {isVideoFile ? file.name : photoCount === 1 ? file.name : `${photoCount} photos (carousel)`}
                  </p>
                  {slideStrip}
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-[10px] font-bold text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    {photoCount > 1 ? "Remove all" : "Remove file"}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs min-[3840px]:text-sm font-bold text-gray-800">Drag and drop files here</p>
                  <p className="text-[10px] min-[3840px]:text-xs text-gray-400 max-w-[280px]">
                    Up to {POST_LIMITS.maxCarousel} photos for a carousel (JPG, PNG, WEBP, GIF, max 5 MB each) or one MP4, WEBM, MOV video (max 25 MB)
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="mt-0.5 px-4 py-1.5 min-[3840px]:px-5 min-[3840px]:py-2 bg-[#ef8b54] text-white text-[10px] min-[3840px]:text-xs font-bold rounded-xl hover:bg-[#d9723a] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {!file ? "Browse Files" : isVideoFile ? "Change file" : photoCount >= POST_LIMITS.maxCarousel ? "Add more (full)" : "Add more photos"}
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-0.5">
              {isVideoFile ? (
                <p className="text-[11px] text-gray-500">Videos keep their own sound, so a song can&apos;t be added.</p>
              ) : (
                <MusicsControl
                  selectedTrack={track}
                  musicStartTime={musicStart}
                  onTrackChange={setTrack}
                  onStartTimeChange={setMusicStart}
                />
              )}

              <div className="flex flex-col gap-2.5 rounded-2xl bg-white p-3 shadow-sm">
                <span className="text-[12px] font-bold text-gray-700">Advanced settings</span>
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="text-[12px] text-gray-700">Hide like count on this post</span>
                  <input
                    type="checkbox"
                    checked={hideLikes}
                    onChange={(e) => setHideLikes(e.target.checked)}
                    className="h-4 w-4 accent-[#ef8b54]"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="text-[12px] text-gray-700">Turn off commenting</span>
                  <input
                    type="checkbox"
                    checked={commentsOff}
                    onChange={(e) => setCommentsOff(e.target.checked)}
                    className="h-4 w-4 accent-[#ef8b54]"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-0.5">
              {platformList.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={`py-1.5 min-[3840px]:py-2 px-3 min-[3840px]:px-4 text-[11px] min-[2560px]:text-xs min-[3840px]:text-sm font-bold rounded-full border text-center transition-all duration-200 shadow-sm cursor-pointer ${
                      isSelected
                        ? `${buttonVariants({ variant: 'default' })} border-transparent transform scale-[1.02] shadow-orange-500/20`
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {platform.name}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="mt-5 w-full py-3 bg-[#ef8b54] hover:bg-[#d9723a] text-white text-[12px] font-extrabold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer lg:hidden uppercase tracking-wider select-none"
            >
              NEXT
            </button>
          </div>

          <div className={`flex flex-col gap-2 min-[3840px]:gap-3 ${step !== "edit" ? "block" : "hidden lg:flex"}`}>

            {photoCount > 1 && (
              <div className="rounded-xl bg-white p-2 shadow-sm">
                <p className="text-[11px] font-bold text-gray-700 mb-1">
                  Photo {active + 1} of {photoCount}. Tap one to preview or edit it.
                </p>
                {slideStrip}
              </div>
            )}

            {/* Edit button: sits right above the preview */}
            <button
              type="button"
              disabled={!canEditPhoto}
              onClick={() => setEditorOpen(true)}
              title={canEditPhoto ? "Edit photo" : "Add a photo (not a GIF or video) to edit it"}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white shadow-sm text-[12px] font-bold text-gray-800 hover:bg-orange-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pencil className="w-3.5 h-3.5 text-[#ef8b54]" />
              Edit photo
              {edited && <span className="text-[10px] font-bold text-emerald-600">· Edited</span>}
            </button>

            {editorOpen && canEditPhoto && originalFile && (
              <PostImageEditor
                key={`${originalFile.name}-${originalFile.lastModified}-${originalFile.size}`}
                file={originalFile}
                onCancel={() => setEditorOpen(false)}
                onApply={(next) => {
                  setSlides((prev) =>
                    prev.map((slide, i) => (i === active ? { ...slide, file: next, edited: true } : slide)),
                  );
                  setEditorOpen(false);
                }}
              />
            )}

            {isPreviewLoading ? (
              <LivePreviewloading />
            ) : (
              <FacebookPostPreview
                title={title || "Your headline appears here"}
                caption={caption || "Your caption appears here"}
                image={previewUrl || avatar1}
                isVideo={isVideoFile}
                className="mt-1 min-[3840px]:mt-2"
              />
            )}

            <div className="flex flex-col gap-1.5 mt-2">
              <label htmlFor="scheduleAt" className="text-[12px] font-bold text-gray-600">
                Schedule for (leave empty to publish now)
              </label>
              <input
                id="scheduleAt"
                type="datetime-local"
                value={scheduleAt}
                min={minLocalInput()}
                max={maxLocalInput()}
                onChange={(e) => setScheduleAt(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-white border border-transparent outline-none text-xs shadow-sm focus:border-[#ef8b54] text-gray-800"
              />
              <p className="text-[10px] text-gray-500">Dates and times that have already passed can&apos;t be chosen.</p>
            </div>

            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="flex items-center gap-2.5 w-full justify-center">
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => submit("schedule")}
                  className={`${buttonVariants({ variant: 'outline' })} px-4 py-1.5 min-[3840px]:px-5 min-[3840px]:py-2 text-[11px] min-[3840px]:text-xs font-bold min-w-[90px] shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {busy === "schedule" ? "Scheduling…" : "Schedule"}
                </button>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => submit("publish")}
                  className={`${buttonVariants({ variant: 'default' })} px-6 py-1.5 min-[3840px]:px-7 min-[3840px]:py-2 text-white text-[11px] min-[3840px]:text-xs font-bold shadow-md transition-colors min-w-[100px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {busy === "publish" ? "Publishing…" : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}