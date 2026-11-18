"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Settings } from "@/lib/settings";
import { WeddingMusic } from "@/lib/music";
import { AboutButton, MuteButton, Particles, Petals, SecretButton, VideoBackground } from "./shared";
import SvgDefs from "./svg-defs";
import Welcome from "./welcome";
import Loading from "./loading";
import Invitation from "./invitation";

export default function Experience({ settings }: { settings: Settings }) {
  const [phase, setPhase] = useState<"welcome" | "loading" | "card">("welcome");
  const [welcomeFading, setWelcomeFading] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const genMusicRef = useRef<WeddingMusic | null>(null);

  // Count this visit once per browser session.
  useEffect(() => {
    if (sessionStorage.getItem("wed-visit")) return;
    sessionStorage.setItem("wed-visit", "1");
    fetch("/api/visit", { method: "POST" }).catch(() => {});
  }, []);

  // Welcome screen: play the original generative music (resumes on the first user gesture).
  useEffect(() => {
    const m = new WeddingMusic();
    genMusicRef.current = m;
    m.start();
    const wake = () => m.setMuted(false);
    window.addEventListener("pointerdown", wake, { once: true });
    return () => {
      window.removeEventListener("pointerdown", wake);
      m.stop();
    };
  }, []);

  const handleStart = useCallback(() => {
    if (welcomeFading) return;
    setWelcomeFading(true);
    try {
      genMusicRef.current?.stop();
    } catch {
      /* ignore */
    }
    try {
      const audio = new Audio("/music.mp3");
      audio.loop = true;
      audio.volume = 0.55;
      audio.preload = "auto";
      audio.play().catch(() => {});
      document.body.appendChild(audio);
      musicRef.current = audio;
    } catch {
      /* music is optional */
    }
    setTimeout(() => setPhase("loading"), 1000);
  }, [welcomeFading]);

  const handleLoadingDone = useCallback(() => {
    setPhase("card");
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SvgDefs />
      <VideoBackground />
      <Particles />
      <Petals />
      <AboutButton settings={settings} />
      <SecretButton />
      {phase !== "welcome" && <MuteButton musicRef={musicRef} />}
      {phase === "welcome" && <Welcome settings={settings} onStart={handleStart} fading={welcomeFading} />}
      {phase === "loading" && <Loading onDone={handleLoadingDone} />}
      {phase === "card" && <Invitation settings={settings} />}
    </>
  );
}
