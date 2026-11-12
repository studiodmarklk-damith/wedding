"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "@/lib/settings";

/** Fixed background video — p.mp4 on mobile devices, l.mp4 on desktop, smooth autoplay. */
export function VideoBackground() {
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        id="video-bg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onPlaying={(e) => e.currentTarget.classList.add("on")}
      >
        {/* Mobile → portrait video, Desktop → landscape video (selected natively by the browser) */}
        <source src="/p.mp4" media="(max-width: 820px)" />
        <source src="/l.mp4" />
      </video>
      <div className="shadow-overlay" aria-hidden="true" />
    </>
  );
}

/** Rising golden particles canvas. */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;
    let W = 0, H = 0, raf = 0;
    const rs = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    };
    rs();
    window.addEventListener("resize", rs);
    const ps = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      v: Math.random() * 0.4 + 0.1,
      a: Math.random() * 6,
    }));
    const draw = () => {
      cx.clearRect(0, 0, W, H);
      ps.forEach((p) => {
        p.y -= p.v;
        p.a += 0.04;
        if (p.y < -5) {
          p.y = H + 5;
          p.x = Math.random() * W;
        }
        cx.globalAlpha = 0.4 + 0.4 * Math.sin(p.a);
        cx.fillStyle = "#ffd77a";
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, 7);
        cx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", rs);
    };
  }, []);
  return <canvas id="fx" ref={ref} aria-hidden="true" />;
}

/** Falling rose petals. */
export function Petals() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const P = ref.current;
    if (!P) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const iv = setInterval(() => {
      const e = document.createElement("i");
      e.className = "petal";
      e.style.left = Math.random() * 100 + "%";
      e.style.animationDuration = 6 + Math.random() * 6 + "s";
      P.appendChild(e);
      timers.push(setTimeout(() => e.remove(), 12000));
    }, 450);
    return () => {
      clearInterval(iv);
      timers.forEach(clearTimeout);
      P.innerHTML = "";
    };
  }, []);
  return <div id="petals" ref={ref} aria-hidden="true" />;
}

/** Small floating "About" button that opens the credit popup. */
export function AboutButton() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button className="about-btn" onClick={() => setOpen(true)}>
        About
      </button>
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="pop" onClick={(e) => e.stopPropagation()}>
            <button className="pop-x" aria-label="Close" onClick={() => setOpen(false)}>
              ✕
            </button>
            <svg className="ic" viewBox="0 0 24 24" style={{ width: 34, height: 34 }}>
              <use href="#i-heart" />
            </svg>
            <div className="by">Design By</div>
            <div className="brand">JGS Lanka Co.</div>
            <svg className="divider" viewBox="0 0 150 30">
              <use href="#lotus" />
            </svg>
            <div style={{ fontSize: 17, lineHeight: 1.6 }}>
              Beautiful wedding invitations,
              <br />
              crafted with love.
            </div>
            <a
              className="wa-btn"
              href="https://wa.me/94702001859"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 32 32">
                <use href="#i-wa" />
              </svg>
              WhatsApp · +94 70 200 1859
            </a>
            <br />
            <a className="web-link" href="https://www.jgslanka.com" target="_blank" rel="noopener noreferrer">
              www.jgslanka.com
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/** Hidden "get act" test button → PIN modal → Admin dashboard. */
export function SecretButton() {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = async () => {
    if (!pin.trim() || busy) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        window.location.href = "/admin";
        return;
      }
      setErr("Incorrect PIN — try again");
      setShake(true);
      setTimeout(() => setShake(false), 450);
    } catch {
      setErr("Connection error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button className="secret-btn" onClick={() => setOpen(true)} aria-label="get act">
        get act
      </button>
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className={`pin-card${shake ? " shake" : ""}`} onClick={(e) => e.stopPropagation()}>
            <button className="pop-x" aria-label="Close" onClick={() => setOpen(false)}>
              ✕
            </button>
            <h3>Access Key</h3>
            <div className="ad-note" style={{ textAlign: "center" }}>
              Enter the admin PIN to continue
            </div>
            <input
              type="password"
              value={pin}
              autoFocus
              placeholder="• • • • • •"
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <div className="pin-err">{err}</div>
            <button className="ad-save" style={{ width: "100%" }} disabled={busy} onClick={submit}>
              {busy ? "Checking…" : "Unlock Dashboard"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Music mute/unmute floating button. */
export function MuteButton({ musicRef }: { musicRef: React.RefObject<HTMLAudioElement | null> }) {
  const [muted, setMuted] = useState(false);
  return (
    <button
      id="mute"
      className={muted ? "off" : ""}
      aria-label="Music"
      onClick={() => {
        const next = !muted;
        setMuted(next);
        const audio = musicRef.current;
        if (audio) {
          audio.muted = next;
          if (!next && audio.paused) audio.play().catch(() => {});
        }
      }}
    >
      <svg className="ic von" viewBox="0 0 24 24">
        <use href="#i-vol" />
      </svg>
      <svg className="ic voff" viewBox="0 0 24 24">
        <use href="#i-mute" />
      </svg>
    </button>
  );
}

export function useWeddingDate(settings: Settings): Date {
  // wedding_date "YYYY-MM-DD" at poruwa time; parse poruwa_time like "9:12 AM"
  const [date, setDate] = useState<Date>(() => parseWedding(settings));
  useEffect(() => setDate(parseWedding(settings)), [settings]);
  return date;
}

export function parseWedding(settings: Settings): Date {
  const [y, m, d] = settings.wedding_date.split("-").map((n) => parseInt(n, 10));
  const match = settings.poruwa_time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  let hh = 9, mm = 12;
  if (match) {
    hh = parseInt(match[1], 10);
    mm = parseInt(match[2], 10);
    const ap = match[3]?.toUpperCase();
    if (ap === "PM" && hh !== 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;
  }
  return new Date(y || 2027, (m || 3) - 1, d || 6, hh, mm);
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
