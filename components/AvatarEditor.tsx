"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STAGE = 280; // on-screen crop circle size (px)
const OUTPUT = 512; // exported avatar size (px)

const FILTERS: { name: string; css: string }[] = [
  { name: "Original", css: "" },
  { name: "Warm", css: "sepia(0.3) saturate(1.3) hue-rotate(-10deg)" },
  { name: "Cool", css: "saturate(1.1) hue-rotate(15deg) brightness(1.05)" },
  { name: "B&W", css: "grayscale(1)" },
  { name: "Vintage", css: "sepia(0.6) contrast(0.9) brightness(1.05)" },
  { name: "Vivid", css: "saturate(1.6) contrast(1.1)" },
  { name: "Fade", css: "contrast(0.85) brightness(1.1) saturate(0.8)" },
];

type Props = {
  file: File;
  onCancel: () => void;
  onSave: (file: File) => void | Promise<void>;
};

export default function AvatarEditor({ file, onCancel, onSave }: Props) {
  const stageRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [filterIdx, setFilterIdx] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saving, setSaving] = useState(false);

  const filterCss = `${FILTERS[filterIdx].css} brightness(${brightness}%) contrast(${contrast}%)`.trim();

  // Load the image
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setReady(true);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clamp = useCallback(
    (x: number, y: number, z: number) => {
      const img = imgRef.current;
      if (!img) return { x, y };
      const base = Math.max(STAGE / img.width, STAGE / img.height);
      const maxX = Math.max(0, (img.width * base * z - STAGE) / 2);
      const maxY = Math.max(0, (img.height * base * z - STAGE) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      };
    },
    []
  );

  const draw = useCallback(
    (canvas: HTMLCanvasElement | null, size: number) => {
      const img = imgRef.current;
      if (!canvas || !img) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = size;
      canvas.height = size;
      const k = size / STAGE;
      const base = Math.max(STAGE / img.width, STAGE / img.height);
      const w = img.width * base * zoom * k;
      const h = img.height * base * zoom * k;
      ctx.clearRect(0, 0, size, size);
      ctx.filter = filterCss || "none";
      ctx.drawImage(img, size / 2 + offset.x * k - w / 2, size / 2 + offset.y * k - h / 2, w, h);
      ctx.filter = "none";
    },
    [zoom, offset, filterCss]
  );

  useEffect(() => {
    if (!ready) return;
    draw(stageRef.current, STAGE);
    draw(previewRef.current, 56);
  }, [ready, draw]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const nx = drag.current.ox + (e.clientX - drag.current.x);
    const ny = drag.current.oy + (e.clientY - drag.current.y);
    setOffset(clamp(nx, ny, zoom));
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
  };

  const changeZoom = (z: number) => {
    const nz = Math.min(3, Math.max(1, z));
    setZoom(nz);
    setOffset((o) => clamp(o.x, o.y, nz));
  };

  const reset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setFilterIdx(0);
    setBrightness(100);
    setContrast(100);
  };

  const save = async () => {
    setSaving(true);
    try {
      const out = document.createElement("canvas");
      draw(out, OUTPUT);
      const blob: Blob | null = await new Promise((res) => out.toBlob(res, "image/jpeg", 0.9));
      if (!blob) return;
      await onSave(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-5 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={onCancel} className="text-sm text-neutral-300 hover:text-white">
            Cancel
          </button>
          <h2 className="font-semibold">Edit profile photo</h2>
          <button
            onClick={save}
            disabled={!ready || saving}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Done"}
          </button>
        </div>

        {/* Crop stage: circular, exactly how others will see it */}
        <div className="flex justify-center">
          <div
            className="relative touch-none cursor-grab overflow-hidden rounded-full ring-2 ring-white/40 active:cursor-grabbing"
            style={{ width: STAGE, height: STAGE }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={(e) => changeZoom(zoom - e.deltaY * 0.002)}
          >
            <canvas ref={stageRef} style={{ width: STAGE, height: STAGE }} />
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-neutral-400">Drag to reposition · scroll or use the slider to zoom</p>

        {/* Small preview */}
        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-neutral-400">
          <span>Preview</span>
          <div className="h-14 w-14 overflow-hidden rounded-full ring-1 ring-white/20">
            <canvas ref={previewRef} className="h-full w-full" />
          </div>
          <div className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/20">
            <canvas
              ref={(c) => {
                if (c && ready) draw(c, 32);
              }}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 space-y-3 text-sm">
          <label className="flex items-center gap-3">
            <span className="w-20 text-neutral-300">Zoom</span>
            <input type="range" min={1} max={3} step={0.01} value={zoom}
              onChange={(e) => changeZoom(parseFloat(e.target.value))} className="flex-1" />
          </label>
          <label className="flex items-center gap-3">
            <span className="w-20 text-neutral-300">Brightness</span>
            <input type="range" min={60} max={150} value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))} className="flex-1" />
          </label>
          <label className="flex items-center gap-3">
            <span className="w-20 text-neutral-300">Contrast</span>
            <input type="range" min={60} max={150} value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))} className="flex-1" />
          </label>
        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setFilterIdx(i)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                i === filterIdx ? "border-blue-400 bg-blue-500/20 text-blue-300" : "border-white/20 text-neutral-300"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        <button onClick={reset} className="mt-3 text-xs text-neutral-400 hover:text-white">
          Reset
        </button>
      </div>
    </div>
  );
}
