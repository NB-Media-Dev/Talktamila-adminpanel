"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getBaseUrl } from "@/services/api-client";
import { getAuthToken } from "@/lib/cookies";
import CallOverlay from "./CallOverlay";


export type CallMedia = "audio" | "video";

export interface CallPeer {
  user_id: number;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

export type CallPhase = "starting" | "ringing" | "incoming" | "connecting" | "active" | "ended";

export interface CallState {
  id: string | null;
  peer: CallPeer;
  media: CallMedia;
  direction: "out" | "in";
  phase: CallPhase;
  startedAt: number | null;
  muted: boolean;
  camOff: boolean;
  endText: string | null;
}

interface CallContextValue {
  ready: boolean;
  inCall: boolean;
  startCall: (peer: CallPeer, media: CallMedia) => Promise<string | null>;
}

const CallContext = createContext<CallContextValue>({
  ready: false,
  inCall: false,
  startCall: async () => "Calling isn't available on this page.",
});

export function useCall(): CallContextValue {
  return useContext(CallContext);
}

const DEFAULT_ICE: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

function iceServers(): RTCIceServer[] {
  const raw = process.env.NEXT_PUBLIC_ICE_SERVERS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed as RTCIceServer[];
    } catch {
      /* fall back to the defaults */
    }
  }
  return DEFAULT_ICE;
}

function signalingUrl(token: string): string {
  const base = getBaseUrl().replace(/^http/, "ws");
  return `${base}/api/v1/calls/ws?token=${encodeURIComponent(token)}`;
}

async function acquireMedia(media: CallMedia): Promise<MediaStream | string> {
  if (typeof window === "undefined" || !window.isSecureContext) {
    return "Can't Connect";
  }
  if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") {
    return "This browser doesn't support voice and video calls.";
  }
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true, video: media === "video" });
  } catch (err) {
    const name = err instanceof DOMException ? err.name : "";
    if (name === "NotAllowedError" || name === "SecurityError") {
      return media === "video"
        ? "Camera or microphone permission is blocked. Allow it in your browser's site settings and try again."
        : "Microphone permission is blocked. Allow it in your browser's site settings and try again.";
    }
    if (name === "NotFoundError" || name === "OverconstrainedError") {
      return media === "video" ? "No camera or microphone was found." : "No microphone was found.";
    }
    if (name === "NotReadableError") {
      return "Your microphone or camera is being used by another app.";
    }
    return "Couldn't access your microphone or camera.";
  }
}

/* ---------- tiny ringtone (no audio files needed) ---------- */
interface Ringer {
  start: (kind: "in" | "out") => void;
  stop: () => void;
}

function createRinger(): Ringer {
  let ctx: AudioContext | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;

  const beep = (c: AudioContext, freq: number, at: number, dur: number) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(0.15, at + 0.03);
    gain.gain.linearRampToValueAtTime(0, at + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
    if (ctx) {
      ctx.close().catch(() => {});
      ctx = null;
    }
  };

  return {
    start(kind) {
      stop();
      try {
        const c = new AudioContext();
        ctx = c;
        const tick = () => {
          const t = c.currentTime;
          if (kind === "in") {
            beep(c, 480, t, 0.4);
            beep(c, 480, t + 0.55, 0.4);
          } else {
            beep(c, 425, t, 1);
          }
        };
        tick();
        timer = setInterval(tick, kind === "in" ? 2200 : 3000);
      } catch {
      }
    },
    stop,
  };
}

function endedText(reason: unknown, direction: "out" | "in", wasActive: boolean): string | null {
  switch (reason) {
    case "declined":
      return direction === "out" ? "Call declined" : null;
    case "no_answer":
      return direction === "out" ? "No answer" : "Missed call";
    case "disconnected":
      return wasActive ? "Call ended - connection lost" : "Call ended";
    case "hangup":
      return wasActive ? "Call ended" : direction === "out" ? "Call cancelled" : "Missed call";
    default:
      return "Call ended";
  }
}

export function CallProvider({ children }: { children: ReactNode }) {
  const [call, setCallState] = useState<CallState | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(false);

  const callRef = useRef<CallState | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ringerRef = useRef<Ringer | null>(null);
  const connectRef = useRef<() => void>(() => {});

  const setCall = useCallback((next: CallState | null) => {
    callRef.current = next;
    setCallState(next);
  }, []);

  const patchCall = useCallback(
    (patch: Partial<CallState>) => {
      const cur = callRef.current;
      if (cur) setCall({ ...cur, ...patch });
    },
    [setCall]
  );

  const send = useCallback((payload: Record<string, unknown>): boolean => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }, []);

  const ringer = useCallback((): Ringer => {
    if (!ringerRef.current) ringerRef.current = createRinger();
    return ringerRef.current;
  }, []);

  const teardownMedia = useCallback(() => {
    ringerRef.current?.stop();
    const pc = pcRef.current;
    pcRef.current = null;
    if (pc) {
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onconnectionstatechange = null;
      pc.close();
    }
    localRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    pendingIceRef.current = [];
    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  const finish = useCallback(
    (text: string | null) => {
      teardownMedia();
      const cur = callRef.current;
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
      if (!cur || !text) {
        setCall(null);
        return;
      }
      setCall({ ...cur, phase: "ended", endText: text });
      endTimerRef.current = setTimeout(() => {
        if (callRef.current?.phase === "ended") setCall(null);
      }, 2200);
    },
    [teardownMedia, setCall]
  );

  const createPc = useCallback(
    (callId: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection({ iceServers: iceServers() });
      pcRef.current = pc;

      const local = localRef.current;
      if (local) local.getTracks().forEach((t) => pc.addTrack(t, local));

      const remote = new MediaStream();
      setRemoteStream(remote);

      pc.onicecandidate = (e) => {
        if (e.candidate) send({ type: "ice", call_id: callId, candidate: e.candidate.toJSON() });
      };
      pc.ontrack = (e) => {
        remote.addTrack(e.track);
      };
      pc.onconnectionstatechange = () => {
        if (pcRef.current !== pc) return;
        if (pc.connectionState === "connected") {
          ringerRef.current?.stop();
          const cur = callRef.current;
          if (cur && cur.phase !== "active") patchCall({ phase: "active", startedAt: Date.now() });
        } else if (pc.connectionState === "failed") {
          send({ type: "hangup", call_id: callId });
          finish("Couldn't connect the call. Check your network - a TURN server may be needed.");
        }
      };
      return pc;
    },
    [send, patchCall, finish]
  );

  const flushIce = useCallback(async (pc: RTCPeerConnection) => {
    const queued = pendingIceRef.current;
    pendingIceRef.current = [];
    for (const c of queued) {
      try {
        await pc.addIceCandidate(c);
      } catch {
        /* a stale candidate is harmless */
      }
    }
  }, []);

  const handle = useCallback(
    async (m: Record<string, unknown>) => {
      const cur = callRef.current;
      const callId = typeof m.call_id === "string" ? m.call_id : null;

      try {
        switch (m.type) {
          case "ringing": {
            if (!cur || cur.direction !== "out" || cur.phase === "ended" || !callId) {
              if (callId) send({ type: "hangup", call_id: callId });
              break;
            }
            patchCall({ id: callId, phase: "ringing" });
            ringer().start("out");
            break;
          }

          case "incoming": {
            if (!callId) break;
            if (cur && cur.phase !== "ended") {
              send({ type: "decline", call_id: callId });
              break;
            }
            if (endTimerRef.current) clearTimeout(endTimerRef.current);
            const from = m.from as CallPeer | undefined;
            if (!from) break;
            setCall({
              id: callId,
              peer: from,
              media: m.media === "video" ? "video" : "audio",
              direction: "in",
              phase: "incoming",
              startedAt: null,
              muted: false,
              camOff: false,
              endText: null,
            });
            ringer().start("in");
            break;
          }

          case "accepted": {
            if (!cur || cur.direction !== "out" || cur.id !== callId) break;
            ringerRef.current?.stop();
            patchCall({ phase: "connecting" });
            const pc = createPc(cur.id as string);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            send({
              type: "offer",
              call_id: cur.id,
              sdp: pc.localDescription ? pc.localDescription.toJSON() : offer,
            });
            break;
          }

          case "offer": {
            const pc = pcRef.current;
            if (!cur || cur.direction !== "in" || cur.id !== callId || !pc) break;
            await pc.setRemoteDescription(m.sdp as RTCSessionDescriptionInit);
            await flushIce(pc);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            send({
              type: "answer",
              call_id: cur.id,
              sdp: pc.localDescription ? pc.localDescription.toJSON() : answer,
            });
            break;
          }

          case "answer": {
            const pc = pcRef.current;
            if (!cur || cur.id !== callId || !pc) break;
            await pc.setRemoteDescription(m.sdp as RTCSessionDescriptionInit);
            await flushIce(pc);
            break;
          }

          case "ice": {
            if (!cur || cur.id !== callId || !m.candidate) break;
            const pc = pcRef.current;
            const candidate = m.candidate as RTCIceCandidateInit;
            if (pc && pc.remoteDescription) {
              await pc.addIceCandidate(candidate).catch(() => {});
            } else {
              pendingIceRef.current.push(candidate);
            }
            break;
          }

          case "busy":
            if (cur?.direction === "out" && cur.phase === "starting") finish("Line busy");
            break;

          case "unavailable":
            if (cur?.direction === "out" && cur.phase === "starting") finish("Not available - they're offline right now");
            break;

          case "error":
            if (cur?.direction === "out" && cur.phase === "starting") {
              finish(m.reason === "already_in_call" ? "You're already in a call" : "Couldn't place the call");
            }
            break;

          case "ended": {
            if (!cur || cur.id !== callId) break;
            finish(endedText(m.reason, cur.direction, cur.phase === "active"));
            break;
          }

          default:
            break;
        }
      } catch (err) {
        console.error("[calls] signaling error", err);
        const id = callRef.current?.id;
        if (id) send({ type: "hangup", call_id: id });
        finish("The call failed");
      }
    },
    [send, patchCall, ringer, setCall, createPc, flushIce, finish]
  );

  // Always call the newest handlers from the long-lived socket callbacks.
  const latest = useRef({ handle, finish });
  useEffect(() => {
    latest.current = { handle, finish };
  });

  useEffect(() => {
    let stopped = false;
    let retry = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let pingTimer: ReturnType<typeof setInterval> | undefined;

    const connect = () => {
      if (stopped) return;
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = undefined;
      }
      const existing = wsRef.current;
      if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) {
        return;
      }
      const token = getAuthToken();
      if (!token) {
        retryTimer = setTimeout(connect, 10000);
        return;
      }
      let ws: WebSocket;
      try {
        ws = new WebSocket(signalingUrl(token));
      } catch {
        retryTimer = setTimeout(connect, 10000);
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        retry = 0;
        setConnected(true);
        pingTimer = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "ping" }));
        }, 25000);
      };
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(String(ev.data));
          if (data && typeof data === "object") void latest.current.handle(data as Record<string, unknown>);
        } catch {
          /* ignore malformed messages */
        }
      };
      ws.onclose = (ev) => {
        if (pingTimer) clearInterval(pingTimer);
        if (wsRef.current === ws) wsRef.current = null;
        setConnected(false);
        if (callRef.current && callRef.current.phase !== "ended") latest.current.finish("Connection lost");
        if (stopped) return;
        if (ev.code === 1000) return;
        const delay = ev.code === 4401 ? 30000 : Math.min(15000, 1000 * 2 ** retry++);
        retryTimer = setTimeout(connect, delay);
      };
    };

    connectRef.current = connect;
    connect();

    const wake = () => {
      if (document.visibilityState === "visible") connect();
    };
    window.addEventListener("focus", wake);
    document.addEventListener("visibilitychange", wake);

    return () => {
      stopped = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (pingTimer) clearInterval(pingTimer);
      window.removeEventListener("focus", wake);
      document.removeEventListener("visibilitychange", wake);
      const ws = wsRef.current;
      wsRef.current = null;
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
      teardownMedia();
      ringerRef.current?.stop();
    };
  }, [teardownMedia]);

  /* ---------- actions ---------- */

  const startCall = useCallback(
    async (peer: CallPeer, media: CallMedia): Promise<string | null> => {
      const cur = callRef.current;
      if (cur && cur.phase !== "ended") return "You're already in a call.";

      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        connectRef.current();
        return "Calling is reconnecting. Please try again in a moment.";
      }

      const got = await acquireMedia(media);
      if (typeof got === "string") return got;

      if (endTimerRef.current) clearTimeout(endTimerRef.current);
      localRef.current = got;
      setLocalStream(got);
      setCall({
        id: null,
        peer,
        media,
        direction: "out",
        phase: "starting",
        startedAt: null,
        muted: false,
        camOff: false,
        endText: null,
      });
      if (!send({ type: "invite", to: peer.user_id, media })) {
        finish("Couldn't reach the call server");
      }
      return null;
    },
    [send, setCall, finish]
  );

  const accept = useCallback(async () => {
    const cur = callRef.current;
    if (!cur || cur.phase !== "incoming" || !cur.id) return;
    const callId = cur.id;
    ringerRef.current?.stop();

    const got = await acquireMedia(cur.media);
    const now = callRef.current;
    if (!now || now.id !== callId || now.phase !== "incoming") {
      // The caller hung up while the permission prompt was open.
      if (typeof got !== "string") got.getTracks().forEach((t) => t.stop());
      return;
    }
    if (typeof got === "string") {
      send({ type: "decline", call_id: callId });
      finish(got);
      return;
    }

    localRef.current = got;
    setLocalStream(got);
    patchCall({ phase: "connecting" });
    createPc(callId);
    send({ type: "accept", call_id: callId });
  }, [send, finish, patchCall, createPc]);

  const decline = useCallback(() => {
    const cur = callRef.current;
    if (!cur) return;
    if (cur.id) send({ type: "decline", call_id: cur.id });
    finish(null);
  }, [send, finish]);

  const hangup = useCallback(() => {
    const cur = callRef.current;
    if (!cur) return;
    if (cur.phase === "ended") {
      finish(null);
      return;
    }
    if (cur.id) send({ type: "hangup", call_id: cur.id });
    finish(null);
  }, [send, finish]);

  const toggleMute = useCallback(() => {
    const cur = callRef.current;
    if (!cur) return;
    const next = !cur.muted;
    localRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !next;
    });
    patchCall({ muted: next });
  }, [patchCall]);

  const toggleCamera = useCallback(() => {
    const cur = callRef.current;
    if (!cur) return;
    const next = !cur.camOff;
    localRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !next;
    });
    patchCall({ camOff: next });
  }, [patchCall]);

  const value = useMemo<CallContextValue>(
    () => ({
      ready: connected,
      inCall: call !== null && call.phase !== "ended",
      startCall,
    }),
    [connected, call, startCall]
  );

  return (
    <CallContext.Provider value={value}>
      {children}
      {call && (
        <CallOverlay
          call={call}
          localStream={localStream}
          remoteStream={remoteStream}
          onAccept={accept}
          onDecline={decline}
          onHangup={hangup}
          onToggleMute={toggleMute}
          onToggleCamera={toggleCamera}
        />
      )}
    </CallContext.Provider>
  );
}

export default CallProvider;