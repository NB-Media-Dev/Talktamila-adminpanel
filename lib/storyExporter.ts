// lib/storyExporter.ts
import type { StorySlide, StoryMentionItem } from "@/types/Stories";

/**
 * Downloads a Blob or URL to the user's local device.
 */
export function triggerDownload(blobOrUrl: Blob | string, filename: string) {
  const url = typeof blobOrUrl === "string" ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (typeof blobOrUrl !== "string") {
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}

/**
 * Helper to wrap text cleanly on an HTML5 canvas.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split("\n");

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push("");
      continue;
    }
    const words = para.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Draws rounded rectangle on canvas.
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draws mention pills on canvas at their proportional positions.
 */
function drawMentions(
  ctx: CanvasRenderingContext2D,
  mentions: StoryMentionItem[] | undefined,
  width: number,
  height: number
) {
  if (!mentions || !Array.isArray(mentions) || mentions.length === 0) return;

  for (const m of mentions) {
    const username = m.username ? `@${m.username}` : "";
    if (!username) continue;

    const posX = m.x != null ? m.x * width : width * 0.5;
    const posY = m.y != null ? m.y * height : height * 0.78;

    ctx.save();
    ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const textMetrics = ctx.measureText(username);
    const pillW = textMetrics.width + 70;
    const pillH = 64;
    const pillX = posX - pillW / 2;
    const pillY = posY - pillH / 2;

    // Pill background
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 12;
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 32);
    ctx.fill();

    // Pill border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 32);
    ctx.stroke();

    // Pill Text
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(username, posX, posY);
    ctx.restore();
  }
}

/**
 * Renders a Text Story to an HTML5 Canvas matching the Instagram/TalkTamila gradient style.
 */
export function renderTextStoryToCanvas(
  caption: string,
  mentions?: StoryMentionItem[],
  width = 1080,
  height = 1920
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // 1. Background gradient (Instagram-style vibrant diagonal gradient)
  const grad = ctx.createLinearGradient(0, height, width, 0);
  grad.addColorStop(0, "#833ab4"); // Purple
  grad.addColorStop(0.5, "#fd1d1d"); // Coral red
  grad.addColorStop(1, "#fcb045"); // Orange/amber
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Story Text (Centered & Styled)
  const text = caption || "TalkTamila Story";
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  // Adaptive font size
  let fontSize = 68;
  if (text.length > 120) fontSize = 46;
  else if (text.length > 60) fontSize = 56;
  ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`;

  const maxWidth = width * 0.82;
  const lines = wrapText(ctx, text, maxWidth);
  const lineHeight = fontSize * 1.35;
  const totalTextHeight = lines.length * lineHeight;
  let startY = (height - totalTextHeight) / 2 + lineHeight / 2;

  // Shift text slightly up if there are mentions near the center/bottom
  if (mentions && mentions.length > 0) {
    startY -= 40;
  }

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], width / 2, startY + i * lineHeight);
  }
  ctx.restore();

  // 3. Mentions
  drawMentions(ctx, mentions, width, height);

  return canvas;
}

/**
 * Loads an image from URL into an HTMLImageElement (using Blob for CORS safety).
 */
export async function loadImageSafe(url: string): Promise<HTMLImageElement> {
  return new Promise(async (resolve, reject) => {
    let objectUrl: string | null = null;
    try {
      const res = await fetch(url, { mode: "cors" });
      if (res.ok) {
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
      }
    } catch {
      // Fallback to direct url with crossOrigin
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = (e) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(e);
    };
    img.src = objectUrl || url;
  });
}

/**
 * Renders an Image Story to an HTML5 Canvas with overlays and mentions.
 */
export async function renderImageStoryToCanvas(
  imageUrl: string,
  caption?: string,
  mentions?: StoryMentionItem[],
  width = 1080,
  height = 1920
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Fill black background first
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Load and draw image (object-fit: cover)
  try {
    const img = await loadImageSafe(imageUrl);
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let renderW = width;
    let renderH = height;
    let renderX = 0;
    let renderY = 0;

    if (imgRatio > canvasRatio) {
      renderH = height;
      renderW = height * imgRatio;
      renderX = (width - renderW) / 2;
    } else {
      renderW = width;
      renderH = width / imgRatio;
      renderY = (height - renderH) / 2;
    }

    ctx.drawImage(img, renderX, renderY, renderW, renderH);
  } catch (err) {
    console.warn("Failed to load image on canvas, drawing fallback:", err);
  }

  // Draw top & bottom vignette gradients for high contrast
  const topGrad = ctx.createLinearGradient(0, 0, 0, 300);
  topGrad.addColorStop(0, "rgba(0, 0, 0, 0.7)");
  topGrad.addColorStop(1, "transparent");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, 300);

  const botGrad = ctx.createLinearGradient(0, height - 350, 0, height);
  botGrad.addColorStop(0, "transparent");
  botGrad.addColorStop(1, "rgba(0, 0, 0, 0.75)");
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, height - 350, width, 350);

  // Optional Caption overlay
  if (caption && caption.trim()) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 14;
    ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const lines = wrapText(ctx, caption, width * 0.85);
    const startY = height - 180 - (lines.length - 1) * 55;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], width / 2, startY + i * 55);
    }
    ctx.restore();
  }

  // Draw mentions
  drawMentions(ctx, mentions, width, height);

  return canvas;
}

/**
 * Combines an HTML5 Canvas frame with an Audio URL and records it into a video file (MP4 or WebM).
 */
export async function exportStoryWithAudio(
  canvas: HTMLCanvasElement,
  audioUrl: string,
  startTime = 0,
  durationSec = 6,
  onProgress?: (status: string) => void
): Promise<Blob> {
  onProgress?.("Preparing audio & video...");

  // 1. Fetch audio as blob to avoid CORS taint in Web Audio
  let audioBlobUrl = audioUrl;
  try {
    const res = await fetch(audioUrl, { mode: "cors" });
    if (res.ok) {
      const b = await res.blob();
      audioBlobUrl = URL.createObjectURL(b);
    }
  } catch {
    // Keep audioUrl as fallback
  }

  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.src = audioBlobUrl;
  audio.currentTime = startTime;

  await new Promise<void>((resolve, reject) => {
    audio.oncanplay = () => resolve();
    audio.onerror = (e) => reject(e);
    // Timeout fallback in case canplay doesn't fire immediately
    setTimeout(() => resolve(), 2500);
  });

  // 2. Setup Web Audio API routing to MediaStreamDestination
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioCtx();
  const source = audioCtx.createMediaElementSource(audio);
  const dest = audioCtx.createMediaStreamDestination();
  source.connect(dest);

  // 3. Setup Canvas Stream
  const canvasStream = canvas.captureStream(30);

  // Keep re-drawing or ticking canvas so video stream stays active
  const ctx = canvas.getContext("2d");
  let animId: number;
  const redrawLoop = () => {
    // Minimal sub-pixel tick to keep stream active
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, 1, 1);
      ctx.putImageData(imgData, 0, 0);
    }
    animId = requestAnimationFrame(redrawLoop);
  };
  animId = requestAnimationFrame(redrawLoop);

  // 4. Combine Video + Audio tracks
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  // 5. Setup MediaRecorder with best supported mimeType
  let mimeType = "video/webm;codecs=vp8,opus";
  if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,mp4a.40.2")) {
    mimeType = "video/mp4;codecs=avc1,mp4a.40.2";
  } else if (MediaRecorder.isTypeSupported("video/mp4")) {
    mimeType = "video/mp4";
  } else if (MediaRecorder.isTypeSupported("video/webm")) {
    mimeType = "video/webm";
  }

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 3500000, // High quality 3.5 Mbps
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  return new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      cancelAnimationFrame(animId);
      audio.pause();
      if (audioBlobUrl !== audioUrl) URL.revokeObjectURL(audioBlobUrl);
      audioCtx.close();
      const outputBlob = new Blob(chunks, { type: mimeType.split(";")[0] });
      resolve(outputBlob);
    };

    recorder.onerror = (e) => {
      cancelAnimationFrame(animId);
      audio.pause();
      if (audioBlobUrl !== audioUrl) URL.revokeObjectURL(audioBlobUrl);
      audioCtx.close();
      reject(e);
    };

    // Start recording & audio playback
    onProgress?.("Recording story with music...");
    recorder.start(200);
    audio.play().catch(() => {});

    // Stop after duration
    setTimeout(() => {
      if (recorder.state === "recording") {
        recorder.stop();
      }
    }, durationSec * 1000);
  });
}

/**
 * Main Save Function:
 * Saves the story exactly as it is shown (image/text with song -> video, text -> rendered image, image -> image).
 */
export async function saveStoryToDevice(
  slide: StorySlide,
  effectiveAudioUrl?: string | null,
  onProgress?: (status: string | null) => void
): Promise<{ success: boolean; message: string }> {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const isVideo =
    slide.media_type === "video" ||
    (typeof slide.imageUrl === "string" && /\.(mp4|webm|mov|ogg)$/i.test(slide.imageUrl));
  const isTextStory =
    slide.media_type === "text" ||
    slide.imageUrl === "text-story" ||
    slide.imageUrl === "default-text-story" ||
    (!slide.imageUrl && Boolean(slide.caption));

  const audioUrl = effectiveAudioUrl || slide.music_url;
  const startTime = slide.music_start_time || 0;
  const durationSec = slide.duration ? Math.min(Math.max(slide.duration / 1000, 4), 15) : 6;

  try {
    // ── CASE 1: Video Story (already a video) ─────────────────────────
    if (isVideo) {
      onProgress?.("Downloading video story...");
      const videoUrl = typeof slide.imageUrl === "string" ? slide.imageUrl : slide.media_url || "";
      if (!videoUrl) throw new Error("Video URL not available");

      try {
        const res = await fetch(videoUrl, { mode: "cors" });
        if (res.ok) {
          const blob = await res.blob();
          triggerDownload(blob, `talktamila-story-${timestamp}.mp4`);
          return { success: true, message: "Video story saved to device!" };
        }
      } catch {
        // Fallback
      }
      triggerDownload(videoUrl, `talktamila-story-${timestamp}.mp4`);
      return { success: true, message: "Video story saved to device!" };
    }

    // ── CASE 2: Text Story with Background Music -> Video with Audio ──
    if (isTextStory && audioUrl) {
      try {
        onProgress?.("Generating story with music...");
        const canvas = renderTextStoryToCanvas(
          slide.caption || slide.content || "TalkTamila Story",
          slide.mentions
        );
        const videoBlob = await exportStoryWithAudio(
          canvas,
          audioUrl,
          startTime,
          durationSec,
          onProgress
        );
        const ext = videoBlob.type.includes("mp4") ? "mp4" : "webm";
        triggerDownload(videoBlob, `talktamila-story-${timestamp}.${ext}`);
        return { success: true, message: "Story with music saved to device!" };
      } catch (err) {
        console.warn("Audio merge failed, falling back to rendered image:", err);
        // Fallback to rendered image
        const canvas = renderTextStoryToCanvas(
          slide.caption || slide.content || "TalkTamila Story",
          slide.mentions
        );
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
        if (blob) triggerDownload(blob, `talktamila-story-${timestamp}.png`);
        return { success: true, message: "Story saved as image to device!" };
      }
    }

    // ── CASE 3: Text Story without Music -> Rendered Story Image (PNG) ─
    if (isTextStory) {
      onProgress?.("Rendering story image...");
      const canvas = renderTextStoryToCanvas(
        slide.caption || slide.content || "TalkTamila Story",
        slide.mentions
      );
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (blob) {
        triggerDownload(blob, `talktamila-story-${timestamp}.png`);
        return { success: true, message: "Story image saved to device!" };
      }
      throw new Error("Could not render story image");
    }

    // ── CASE 4: Image Story with Background Music -> Video with Audio ─
    const rawImageUrl =
      typeof slide.imageUrl === "string" ? slide.imageUrl : slide.media_url || "";

    if (rawImageUrl && audioUrl) {
      try {
        onProgress?.("Rendering story with music...");
        const canvas = await renderImageStoryToCanvas(
          rawImageUrl,
          slide.caption,
          slide.mentions
        );
        const videoBlob = await exportStoryWithAudio(
          canvas,
          audioUrl,
          startTime,
          durationSec,
          onProgress
        );
        const ext = videoBlob.type.includes("mp4") ? "mp4" : "webm";
        triggerDownload(videoBlob, `talktamila-story-${timestamp}.${ext}`);
        return { success: true, message: "Story with song saved to device!" };
      } catch (err) {
        console.warn("Merging image + music failed, downloading image:", err);
        // Fallback to image download
      }
    }

    // ── CASE 5: Image Story without Music -> High-res Image (PNG/JPG) ──
    onProgress?.("Saving story image...");
    if (rawImageUrl) {
      // If there are mentions or captions, render canvas with overlays
      if ((slide.mentions && slide.mentions.length > 0) || slide.caption) {
        try {
          const canvas = await renderImageStoryToCanvas(
            rawImageUrl,
            slide.caption,
            slide.mentions
          );
          const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
          if (blob) {
            triggerDownload(blob, `talktamila-story-${timestamp}.png`);
            return { success: true, message: "Story image saved to device!" };
          }
        } catch {
          // Fallback to direct file download
        }
      }

      // Direct image file fetch & download
      try {
        const res = await fetch(rawImageUrl, { mode: "cors" });
        if (res.ok) {
          const blob = await res.blob();
          const ext = rawImageUrl.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)?.[1] ?? "jpg";
          triggerDownload(blob, `talktamila-story-${timestamp}.${ext}`);
          return { success: true, message: "Story image saved to device!" };
        }
      } catch {
        // Fallback
      }
      triggerDownload(rawImageUrl, `talktamila-story-${timestamp}.jpg`);
      return { success: true, message: "Story image saved to device!" };
    }

    throw new Error("No story media found to save");
  } catch (err: any) {
    console.error("Save story to device failed:", err);
    return { success: false, message: err?.message || "Failed to save story." };
  }
}
