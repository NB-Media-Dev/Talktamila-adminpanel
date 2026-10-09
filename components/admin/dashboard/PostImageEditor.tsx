"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, RefreshCcw, RotateCw, X } from "lucide-react";
import { POST_LIMITS } from "@/types/Posts";

// ---------------------------------------------------------------------------
// Post photo editor: same popup style as the profile photo editor
// (AvatarEditor), but the frame is a rectangle (no circle) so the photo keeps
// its post shape.
//  - Crop: Original / 1:1 / 4:5 / 1.91:1, zoom, drag, rotate
//  - Filters: presets + intensity
//  - Adjust: brightness, contrast, color, warmth
// The preview and the final 1080 px JPEG are drawn by the same function, so
// the result always matches what you see.
// ---------------------------------------------------------------------------

type AspectId = "original" | "1:1" | "4:5" | "1.91:1";

const ASPECTS: { id: AspectId; label: string; hint: string; ratio: number | null }[] = [
  { id: "original", label: "Original", hint: "Keeps the photo's own shape (within 4:5 to 1.91:1)", ratio: null },
  { id: "1:1", label: "1:1", hint: "Square · 1080 × 1080", ratio: 1 },
  { id: "4:5", label: "4:5", hint: "Portrait · 1080 × 1350", ratio: 4 / 5 },
  { id: "1.91:1", label: "1.91:1", hint: "Landscape · 1080 × 566", ratio: 1.91 },
];

const MIN_RATIO = 4 / 5;
const MAX_RATIO = 1.91;

const FILTERS: { id: string; label: string; css: string }[] = [
  { id: "normal", label: "Normal", css: "" },
  { id: "clarendon", label: "Clarendon", css: "contrast(1.2) saturate(1.35)" },
  { id: "gingham", label: "Gingham", css: "brightness(1.05) hue-rotate(-10deg) saturate(0.9) contrast(0.95)" },
  { id: "moon", label: "Moon", css: "grayscale(1) contrast(1.1) brightness(1.1)" },
  { id: "lark", label: "Lark", css: "contrast(0.9) brightness(1.1) saturate(1.25)" },
  { id: "reyes", label: "Reyes", css: "sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)" },
  { id: "juno", label: "Juno", css: "saturate(1.4) contrast(1.1) hue-rotate(-5deg)" },
  { id: "slumber", label: "Slumber", css: "saturate(0.66) brightness(1.05) sepia(0.15)" },
];

interface EditState {
  aspect: AspectId;
  zoom: number; // 1 - 3
  rot: number; // 0 - 3 (quarter turns)
  fx: number; // drag offset as a fraction of the frame width
  fy: number; // drag offset as a fraction of the frame height
  filter: string;
  intensity: number; // 0 - 100
  brightness: number; // -100 - 100
  contrast: number;
  color: number;
  warmth: number;
}

const DEFAULT_STATE: EditState = {
  aspect: "original",
  zoom: 1,
  rot: 0,
  fx: 0,
  fy: 0,
  filter: "normal",
  intensity: 100,
  brightness: 0,
  contrast: 0,
  color: 0,
  warmth: 0,
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function frameRatio(s: EditState, img: HTMLImageElement): number {
  const fixed = ASPECTS.find((a) => a.id === s.aspect)?.ratio;
  if (fixed) return fixed;
  const w = s.rot % 2 ? img.naturalHeight : img.naturalWidth;
  const h = s.rot % 2 ? img.naturalWidth : img.naturalHeight;
  return clamp(w / h, MIN_RATIO, MAX_RATIO);
}

function geometry(s: EditState, img: HTMLImageElement, W: number, H: number) {
  const rotW = s.rot % 2 ? img.naturalHeight : img.naturalWidth;
  const rotH = s.rot % 2 ? img.naturalWidth : img.naturalHeight;
  const scale = Math.max(W / rotW, H / rotH) * s.zoom;
  const maxX = Math.max(0, (rotW * scale - W) / 2);
  const maxY = Math.max(0, (rotH * scale - H) / 2);
  return { scale, maxX, maxY };
}

function draw(ctx: CanvasRenderingContext2D, img: HTMLImageElement, s: EditState, W: number, H: number) {
  const { scale, maxX, maxY } = geometry(s, img, W, H);
  const ox = clamp(s.fx * W, -maxX, maxX);
  const oy = clamp(s.fy * H, -maxY, maxY);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  const adjust = `brightness(${1 + s.brightness / 100}) contrast(${1 + s.contrast / 100}) saturate(${1 + s.color / 100})`;

  const paint = (filter: string, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.filter = filter;
    ctx.translate(W / 2 + ox, H / 2 + oy);
    ctx.rotate((s.rot * Math.PI) / 2);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      img,
      (-img.naturalWidth * scale) / 2,
      (-img.naturalHeight * scale) / 2,
      img.naturalWidth * scale,
      img.naturalHeight * scale
    );
    ctx.restore();
  };

  // 1) the photo with the adjustments
  paint(adjust, 1);

  // 2) the chosen filter on top, as strong as the intensity slider says
  const preset = FILTERS.find((f) => f.id === s.filter);
  if (preset && preset.css && s.intensity > 0) {
    paint(`${adjust} ${preset.css}`, s.intensity / 100);
  }

  // 3) warmth: a soft orange (warm) or blue (cool) wash
  if (s.warmth !== 0) {
    ctx.save();
    ctx.globalCompositeOperation = "soft-light";
    const a = (Math.abs(s.warmth) / 100) * 0.6;
    ctx.fillStyle = s.warmth > 0 ? `rgba(255,140,30,${a})` : `rgba(40,110,255,${a})`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

function supportsCanvasFilter(): boolean {
  if (typeof document === "undefined") return true;
  const ctx = document.createElement("canvas").getContext("2d");
  return !!ctx && typeof (ctx as CanvasRenderingContext2D & { filter?: string }).filter === "string";
}

const PREVIEW_W = 540; // canvas pixels (shown smaller on screen)

type Tab = "crop" | "filters" | "adjust";

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  showValue = true,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  showValue?: boolean;
}) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
        {label}
        {showValue && <span className="text-gray-400 font-medium">{Math.round(value * 100) / 100}</span>}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#ef8b54]"
      />
    </label>
  );
}

export default function PostImageEditor({
  file,
  onCancel,
  onApply,
}: {
  /** The photo exactly as it was chosen. */
  file: File;
  onCancel: () => void;
  /** Called with the finished 1080 px JPEG. */
  onApply: (edited: File) => void;
}) {
  const [state, setState] = useState<EditState>(DEFAULT_STATE);
  const [tab, setTab] = useState<Tab>("crop");
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const filtersOk = useMemo(() => supportsCanvasFilter(), []);

  const patch = useCallback((p: Partial<EditState>) => setState((prev) => ({ ...prev, ...p })), []);

  useEffect(() => setMounted(true), []);

  // Load the picture from the chosen file.
  useEffect(() => {
    let cancelled = false;
    const url = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => {
      if (cancelled) return;
      setImg(el);
      setState(DEFAULT_STATE);
      setLoadError(null);
    };
    el.onerror = () => {
      if (!cancelled) setLoadError("Could not open this picture for editing.");
    };
    el.src = url;
    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Lock page scroll behind the popup, and close on Escape.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel, saving]);

  const ratio = img ? frameRatio(state, img) : 1;
  const previewH = Math.round(PREVIEW_W / ratio);

  // Draw the preview whenever anything changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const raf = requestAnimationFrame(() => {
      canvas.width = PREVIEW_W;
      canvas.height = previewH;
      const ctx = canvas.getContext("2d");
      if (ctx) draw(ctx, img, state, PREVIEW_W, previewH);
    });
    return () => cancelAnimationFrame(raf);
  }, [img, state, previewH, mounted]);

  // Drag the photo inside the frame.
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* pointer capture is optional */
    }
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const last = dragRef.current;
    if (!last || !img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - last.x) / rect.width;
    const dy = (e.clientY - last.y) / rect.height;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setState((prev) => {
      const { maxX, maxY } = geometry(prev, img, PREVIEW_W, previewH);
      return {
        ...prev,
        fx: clamp(prev.fx + dx, -maxX / PREVIEW_W, maxX / PREVIEW_W),
        fy: clamp(prev.fy + dy, -maxY / previewH, maxY / previewH),
      };
    });
  };
  const endDrag = () => {
    dragRef.current = null;
  };
  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    setState((prev) => ({ ...prev, zoom: clamp(prev.zoom - e.deltaY * 0.002, 1, 3) }));
  };

  const changeAspect = (aspect: AspectId) => patch({ aspect, fx: 0, fy: 0 });
  const rotate = () => patch({ rot: (state.rot + 1) % 4, fx: 0, fy: 0 });
  const reset = () => setState(DEFAULT_STATE);

  const apply = async () => {
    if (!img || saving) return;
    setSaving(true);
    try {
      const W = 1080;
      const H = Math.round(W / frameRatio(state, img));
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas");
      draw(ctx, img, state, W, H);

      // JPEG, and shrink the quality a little if it is over the upload limit.
      let quality = 0.92;
      let blob: Blob | null = null;
      for (let i = 0; i < 5; i++) {
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
        if (blob && blob.size <= POST_LIMITS.imageBytes) break;
        quality -= 0.12;
      }
      if (!blob) throw new Error("no blob");
      const base = file.name.replace(/\.[^.]+$/, "") || "photo";
      onApply(new File([blob], `${base}-edited.jpg`, { type: "image/jpeg", lastModified: Date.now() }));
    } catch {
      setLoadError("Could not save your edits. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wide border-b-2 cursor-pointer transition-colors ${
        tab === id ? "border-[#ef8b54] text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
      }`}
    >
      {label}
    </button>
  );

  const chip = (active: boolean) =>
    `px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer transition-colors ${
      active ? "bg-[#ef8b54] text-white border-transparent" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
    }`;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-[2px] p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit post photo"
    >
      <div className="w-full sm:max-w-md max-h-[96dvh] overflow-y-auto bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-base font-bold text-gray-900">Edit post photo</h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-[#FF6B35] cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-3">
          {/* Live preview: a plain rectangle, drag to move, scroll to zoom */}
          {!img && !loadError && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#ef8b54]" />
            </div>
          )}
          {img && (
            <>
              <div className="w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden border border-orange-100 bg-[#FDEEE2]">
                <canvas
                  ref={canvasRef}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onWheel={onWheel}
                  style={{ aspectRatio: ratio }}
                  className="w-full block touch-none select-none cursor-grab active:cursor-grabbing"
                />
              </div>
              <p className="text-[10px] text-center text-gray-400 -mt-1">
                Drag the photo to move it. Scroll or use the slider to zoom.
              </p>

              <div className="flex">
                {tabBtn("crop", "Crop")}
                {tabBtn("filters", "Filters")}
                {tabBtn("adjust", "Adjust")}
              </div>

              {tab === "crop" && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {ASPECTS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        title={a.hint}
                        onClick={() => changeAspect(a.id)}
                        className={chip(state.aspect === a.id)}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400">{ASPECTS.find((a) => a.id === state.aspect)?.hint}</p>
                  <Slider
                    label="Zoom"
                    value={state.zoom}
                    min={1}
                    max={3}
                    step={0.01}
                    onChange={(zoom) => patch({ zoom })}
                    showValue={false}
                  />
                  <button
                    type="button"
                    onClick={rotate}
                    className="self-start flex items-center gap-1.5 text-[12px] font-bold text-[#E05D24] hover:underline cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" /> Rotate
                  </button>
                </div>
              )}

              {tab === "filters" && (
                <div className="flex flex-col gap-2.5">
                  {!filtersOk && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                      This browser can&apos;t apply filters to pictures. Cropping still works; use Chrome or Edge for filters.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        disabled={!filtersOk}
                        onClick={() => patch({ filter: f.id })}
                        className={`${chip(state.filter === f.id)} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  {state.filter !== "normal" && (
                    <Slider
                      label="Filter intensity"
                      value={state.intensity}
                      min={0}
                      max={100}
                      onChange={(intensity) => patch({ intensity })}
                    />
                  )}
                </div>
              )}

              {tab === "adjust" && (
                <div className="flex flex-col gap-2">
                  <Slider label="Brightness" value={state.brightness} min={-100} max={100} onChange={(brightness) => patch({ brightness })} />
                  <Slider label="Contrast" value={state.contrast} min={-100} max={100} onChange={(contrast) => patch({ contrast })} />
                  <Slider label="Color" value={state.color} min={-100} max={100} onChange={(color) => patch({ color })} />
                  <Slider label="Warmth" value={state.warmth} min={-100} max={100} onChange={(warmth) => patch({ warmth })} />
                </div>
              )}
            </>
          )}

          {loadError && <p className="text-xs text-red-600">{loadError}</p>}

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={reset}
              disabled={!img || saving}
              className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-gray-800 cursor-pointer disabled:opacity-50"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="px-4 py-1.5 rounded-xl border border-gray-200 text-[12px] font-bold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={!img || saving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#ef8b54] hover:bg-[#d9723a] text-white text-[12px] font-bold shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Apply edits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}