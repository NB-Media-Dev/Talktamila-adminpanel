"use client";

import { useEffect, useState } from "react";
import AnimatedLogo from "./AnimatedLogo";

const SHOW_MS = 1800; // how long the logo stays before fading
const FADE_MS = 600; // must match the .tt-splash transition

/**
 * Full-screen Talk Tamila logo shown on every fresh page load - before the login page
 * and before a signed-in user's account - like the Instagram launch screen.
 * It is part of the server-rendered HTML, so the page underneath never flashes.
 */
export default function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "hide" | "gone">("show");

  useEffect(() => {
    const hide = setTimeout(() => setPhase("hide"), SHOW_MS);
    const gone = setTimeout(() => setPhase("gone"), SHOW_MS + FADE_MS);
    return () => {
      clearTimeout(hide);
      clearTimeout(gone);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`tt-splash ${phase === "hide" ? "tt-splash-out" : ""}`}
      role="status"
      aria-label="Loading Talk Tamila"
    >
      <div className="tt-splash-logo">
        <AnimatedLogo variant="splash" interactive={false} />
      </div>
      <div className="tt-load-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}