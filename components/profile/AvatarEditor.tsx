"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, RotateCcw, RotateCw, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

const STAGE = 260;
const OUTPUT = 256;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

type Look = {
  name: string;
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  gray: number;
  tint: [number, number, number];
};

const LOOKS: Look[] = [
  { name: "Original", brightness: 1, contrast: 1, saturate: 1, sepia: 0, gray: 0, tint: [1, 1, 1] },
  { name: "Warm", brightness: 1.03, contrast: 1.05, saturate: 1.25, sepia: 0.18, gray: 0, tint: [1.06, 1, 0.92] },
  { name: "Cool", brightness: 1.03, contrast: 1.05, saturate: 1.1, sepia: 0, gray: 0, tint: [0.93, 1, 1.08] },
  { name: "Vivid", brightness: 1.02, contrast: 1.12, saturate: 1.6, sepia: 0, gray: 0, tint: [1, 1, 1] },
  { name: "Vintage", brightness: 1.05, contrast: 0.9, saturate: 0.85, sepia: 0.55, gray: 0, tint: [1.03, 1, 0.95] },
  { name: "Fade", brightness: 1.1, contrast: 0.82, saturate: 0.8, sepia: 0, gray: 0, tint: [1, 1, 1] },
  { name: "B&W", brightness: 1, contrast: 1.05, saturate: 1, sepia: 0, gray: 1, tint: [1, 1, 1] },
  { name: "Noir", brightness: 0.95, contrast: 1.35, saturate: 1, sepia: 0, gray: 1, tint: [1, 1, 1] },
];

function applyLook(ctx: CanvasRenderingContext2D, px: number, look: Look, brightness: number, contrast: number) {
  const b = look.brightness * brightness;
  const c = look.contrast * contrast;
  const isIdentity =
    b === 1 && c === 1 && look.saturate === 1 && look.sepia === 0 && look.gray === 0 &&
    look.tint[0] === 1 && look.tint[1] === 1 && look.tint[2] === 1;
  if (isIdentity) return;

  const image = ctx.getImageData(0, 0, px, px);
  const d = image.data;
  const sat = look.gray > 0 ? look.saturate * (1 - look.gray) : look.saturate;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i] * b;
    let g = d[i + 1] * b;
    let bl = d[i + 2] * b;

    r = (r - 128) * c + 128;
    g = (g - 128) * c + 128;
    bl = (bl - 128) * c + 128;

    if (look.sepia > 0) {
      const sr = 0.393 * r + 0.769 * g + 0.189 * bl;
      const sg = 0.349 * r + 0.686 * g + 0.168 * bl;
      const sb = 0.272 * r + 0.534 * g + 0.131 * bl;
      r += (sr - r) * look.sepia;
      g += (sg - g) * look.sepia;
      bl += (sb - bl) * look.sepia;
    }

    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * bl;
    r = lum + (r - lum) * sat;
    g = lum + (g - lum) * sat;
    bl = lum + (bl - lum) * sat;

    d[i] = r * look.tint[0];
    d[i + 1] = g * look.tint[1];
    d[i + 2] = bl * look.tint[2];
  }
  ctx.putImageData(image, 0, 0);
}

type Props = {
  file: File;
  onCancel: () => void;
  onSave: (file: File) => void | Promise<void>;
};

export default function AvatarEditor({ file, onCancel, onSave }: Props) {
  const stageRef = useRef<HTMLCanvasElement>(null);
  const previewRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const pinchStart = useRef<{ dist: number; zoom: number } | null>(null);

  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0 | 90 | 180 | 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [lookIdx, setLookIdx] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saving, setSaving] = useState(false);

  // Load the picked photo.
  useEffect(() => {
    let cancelled = false; // becomes true when this run is cleaned up
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (cancelled) return; // ignore old runs
      imgRef.current = img;
      setLoadError(null);
      setReady(true);
    };
    img.onerror = () => {
      if (cancelled) return; // ignore old runs
      setLoadError("Could not read that image.");
    };
    img.src = url;
    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file]);

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

  const clamp = useCallback((x: number, y: number, z: number, rot: number) => {
    const img = imgRef.current;
    if (!img) return { x, y };
    const sideways = rot % 180 !== 0;
    const ew = sideways ? img.height : img.width;
    const eh = sideways ? img.width : img.height;
    const base = Math.max(STAGE / ew, STAGE / eh);
    const maxX = Math.max(0, (ew * base * z - STAGE) / 2);
    const maxY = Math.max(0, (eh * base * z - STAGE) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }, []);

  const draw = useCallback(
    (canvas: HTMLCanvasElement | null, px: number) => {
      const img = imgRef.current;
      if (!canvas || !img) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      if (canvas.width !== px) {
        canvas.width = px;
        canvas.height = px;
      }
      const k = px / STAGE;
      const sideways = rotation % 180 !== 0;
      const ew = sideways ? img.height : img.width;
      const eh = sideways ? img.width : img.height;
      const scale = Math.max(STAGE / ew, STAGE / eh) * zoom * k;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, px, px);
      ctx.save();
      ctx.translate(px / 2 + offset.x * k, px / 2 + offset.y * k);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (-img.width * scale) / 2, (-img.height * scale) / 2, img.width * scale, img.height * scale);
      ctx.restore();

      applyLook(ctx, px, LOOKS[lookIdx], brightness, contrast);
    },
    [zoom, rotation, offset, lookIdx, brightness, contrast]
  );

  useEffect(() => {
    if (!ready) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    draw(stageRef.current, Math.round(STAGE * dpr));
    previewRefs.current.forEach((c) => {
      if (c) draw(c, Math.round(c.clientWidth * dpr) || 64);
    });
  }, [ready, draw]);

  const changeZoom = (next: number) => {
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    setZoom(z);
    setOffset((o) => clamp(o.x, o.y, z, rotation));
  };

  const rotate = (delta: number) => {
    const next = (rotation + delta + 360) % 360;
    setRotation(next);
    setOffset({ x: 0, y: 0 });
  };

  const reset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setLookIdx(0);
    setBrightness(1);
    setContrast(1);
  };

  const distance = () => {
    const [a, b] = Array.from(pointers.current.values());
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* pointer capture is optional */
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    } else if (pointers.current.size === 2) {
      dragStart.current = null;
      pinchStart.current = { dist: distance(), zoom };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current && pinchStart.current.dist > 0) {
      changeZoom(pinchStart.current.zoom * (distance() / pinchStart.current.dist));
      return;
    }
    if (dragStart.current) {
      const nx = dragStart.current.ox + (e.clientX - dragStart.current.x);
      const ny = dragStart.current.oy + (e.clientY - dragStart.current.y);
      setOffset(clamp(nx, ny, zoom, rotation));
    }
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    pinchStart.current = null;
    const remaining = Array.from(pointers.current.values())[0];
    dragStart.current = remaining ? { x: remaining.x, y: remaining.y, ox: offset.x, oy: offset.y } : null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* already released */
    }
  };

  const save = async () => {
    if (!ready || saving) return;
    setSaving(true);
    try {
      const out = document.createElement("canvas");
      draw(out, OUTPUT);
      const blob = await new Promise<Blob | null>((resolve) => out.toBlob(resolve, "image/jpeg", 0.85));
      if (!blob) throw new Error("Could not process that image.");
      await onSave(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not process that image.");
    } finally {
      setSaving(false);
    }
  };

  const previewSizes = [
    { px: 64, label: "Profile" },
    { px: 44, label: "Chats" },
    { px: 28, label: "Small" },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-[2px] p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile photo"
    >
      <div className="w-full sm:max-w-md max-h-[96dvh] overflow-y-auto bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-base font-bold text-gray-900">Edit profile photo</h2>
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

        <div className="px-5 pb-5">
          <div className="flex justify-center mt-2">
            <div
              className="relative touch-none select-none cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden bg-[#FDEEE2]"
              style={{ width: STAGE, height: STAGE }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
              onWheel={(e) => changeZoom(zoom - e.deltaY * 0.002)}
            >
              <canvas ref={stageRef} style={{ width: STAGE, height: STAGE }} className="block" />
              {!ready && !loadError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-brand animate-spin" />
                </div>
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle closest-side at 50% 50%, transparent 99%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-white/90" />
            </div>
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-2">
            Drag to reposition · pinch or scroll to zoom
          </p>

          {loadError && (
            <div className="p-3 mt-3 bg-red-50 text-red-600 text-xs rounded-xl text-center border border-red-100">
              {loadError}
            </div>
          )}

          {/* How others will see it */}
          <div className="mt-4 rounded-2xl bg-[#FFF8F2] border border-[#FFEFE0] px-4 py-3">
            <p className="text-[11px] font-semibold text-gray-500 mb-2">How others will see it</p>
            <div className="flex items-end justify-center gap-6">
              {previewSizes.map((s, i) => (
                <div key={s.px} className="flex flex-col items-center gap-1">
                  <div
                    className="rounded-full overflow-hidden ring-2 ring-orange-200 bg-orange-100"
                    style={{ width: s.px, height: s.px }}
                  >
                    <canvas
                      ref={(el) => {
                        previewRefs.current[i] = el;
                      }}
                      style={{ width: s.px, height: s.px }}
                      className="block"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="mt-4 space-y-3 text-xs font-semibold text-gray-600">
            <label className="flex items-center gap-3">
              <span className="w-20 shrink-0">Zoom</span>
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={(e) => changeZoom(parseFloat(e.target.value))}
                className="flex-1 accent-[#FF6B35]"
              />
            </label>
            <label className="flex items-center gap-3">
              <span className="w-20 shrink-0">Brightness</span>
              <input
                type="range"
                min={0.6}
                max={1.5}
                step={0.01}
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                className="flex-1 accent-[#FF6B35]"
              />
            </label>
            <label className="flex items-center gap-3">
              <span className="w-20 shrink-0">Contrast</span>
              <input
                type="range"
                min={0.6}
                max={1.5}
                step={0.01}
                value={contrast}
                onChange={(e) => setContrast(parseFloat(e.target.value))}
                className="flex-1 accent-[#FF6B35]"
              />
            </label>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-2 pb-1">
            {LOOKS.map((l, i) => (
              <button
                key={l.name}
                type="button"
                onClick={() => setLookIdx(i)}
                aria-pressed={i === lookIdx}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  i === lookIdx
                    ? "border-[#FF6B35] bg-orange-50 text-[#FF6B35]"
                    : "border-[#FFEFE0] bg-white text-gray-600 hover:bg-orange-50/60"
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>

          {/* Rotate / reset */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => rotate(-90)}
              aria-label="Rotate left"
              title="Rotate left"
              className={`w-9 h-9 ${buttonVariants({ variant: "bgcolor" })}`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => rotate(90)}
              aria-label="Rotate right"
              title="Rotate right"
              className={`w-9 h-9 ${buttonVariants({ variant: "bgcolor" })}`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={reset}
              className="ml-auto text-xs font-semibold text-[#FF6B35] hover:underline cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className={`${buttonVariants({ variant: "outline" })} px-4 py-2 text-sm font-bold disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!ready || saving}
              className={`${buttonVariants({ variant: "default" })} flex items-center gap-1.5 px-5 py-2 text-sm font-bold disabled:opacity-50`}
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Saving..." : "Use photo"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}