"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import UserAvatar from "@/components/messages/UserAvatar";
import { formatDuration } from "@/components/messages/chatUtils";
import type { CallState } from "./CallProvider";

function useStream(stream: MediaStream | null) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.srcObject = stream;
    if (stream) el.play().catch(() => {});
  }, [stream]);
  return ref;
}

function Elapsed({ since }: { since: number }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const tick = () => setSeconds(Math.max(0, Math.floor((Date.now() - since) / 1000)));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [since]);
  return <>{formatDuration(seconds)}</>;
}

function RoundButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer ${className}`}
      >
        {children}
      </button>
      <span className="text-[11px] font-semibold text-white/90">{label}</span>
    </div>
  );
}

export default function CallOverlay({
  call,
  localStream,
  remoteStream,
  onAccept,
  onDecline,
  onHangup,
  onToggleMute,
  onToggleCamera,
}: {
  call: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onAccept: () => void;
  onDecline: () => void;
  onHangup: () => void;
  onToggleMute: () => void;
  onToggleCamera: () => void;
}) {
  const remoteRef = useStream(remoteStream);
  const localRef = useStream(localStream);

  const isVideo = call.media === "video";
  const showRemoteVideo = isVideo && call.phase === "active";
  const name = call.peer.full_name || `@${call.peer.username}`;

  let status: React.ReactNode;
  switch (call.phase) {
    case "starting":
      status = "Starting…";
      break;
    case "ringing":
      status = "Ringing…";
      break;
    case "incoming":
      status = isVideo ? "Incoming video call" : "Incoming voice call";
      break;
    case "connecting":
      status = "Connecting…";
      break;
    case "active":
      status = call.startedAt ? <Elapsed since={call.startedAt} /> : "Connected";
      break;
    default:
      status = call.endText ?? "Call ended";
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Call with ${name}`}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden text-white bg-[linear-gradient(160deg,#E6703A,#FFA663)]"
    >
      <video
        ref={remoteRef}
        autoPlay
        playsInline
        className={showRemoteVideo ? "absolute inset-0 h-full w-full object-cover bg-black" : "sr-only"}
      />
      {showRemoteVideo && <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />}

      {/* Who / status */}
      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-[max(3rem,env(safe-area-inset-top))]">
        {showRemoteVideo ? (
          <div className="text-center">
            <p className="text-base font-bold drop-shadow">{name}</p>
            <p className="text-sm font-semibold text-white/90 drop-shadow tabular-nums">{status}</p>
          </div>
        ) : (
          <div className="mt-[12vh] flex flex-col items-center text-center">
            <UserAvatar user={call.peer} size={120} className="ring-4 ring-white/50 !bg-[#FFF8F2]" />
            <p className="mt-5 text-2xl font-bold tracking-tight">{name}</p>
            <p className="mt-1 text-sm font-semibold text-white/90 tabular-nums">{status}</p>
          </div>
        )}
      </div>

      {/* My camera preview */}
      {isVideo && call.phase !== "incoming" && call.phase !== "ended" && localStream && !call.camOff && (
        <div className="absolute z-20 top-[max(1rem,env(safe-area-inset-top))] right-4 w-28 h-40 rounded-2xl overflow-hidden ring-2 ring-white/60 bg-black shadow-lg">
          <video ref={localRef} autoPlay playsInline muted className="h-full w-full object-cover -scale-x-100" />
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 flex items-end justify-center gap-6 px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-6">
        {call.phase === "incoming" && (
          <>
            <RoundButton label="Decline" onClick={onDecline} className="bg-red-500 text-white">
              <PhoneOff className="w-6 h-6" />
            </RoundButton>
            <RoundButton label="Accept" onClick={onAccept} className="bg-green-500 text-white">
              {isVideo ? <Video className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
            </RoundButton>
          </>
        )}

        {call.phase !== "incoming" && call.phase !== "ended" && (
          <>
            <RoundButton
              label={call.muted ? "Unmute" : "Mute"}
              onClick={onToggleMute}
              className={call.muted ? "bg-white text-[#E6703A]" : "bg-white/25 text-white"}
            >
              {call.muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </RoundButton>
            {isVideo && (
              <RoundButton
                label={call.camOff ? "Camera on" : "Camera off"}
                onClick={onToggleCamera}
                className={call.camOff ? "bg-white text-[#E6703A]" : "bg-white/25 text-white"}
              >
                {call.camOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              </RoundButton>
            )}
            <RoundButton
              label={call.phase === "active" || call.phase === "connecting" ? "End" : "Cancel"}
              onClick={onHangup}
              className="bg-red-500 text-white"
            >
              <PhoneOff className="w-6 h-6" />
            </RoundButton>
          </>
        )}
      </div>
    </div>
  );
}
