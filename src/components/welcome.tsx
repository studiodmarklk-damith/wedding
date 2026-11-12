"use client";

import { Settings } from "@/lib/settings";
import { Mandala } from "./svg-defs";
import { DAYS, MONTHS, parseWedding } from "./shared";

export default function Welcome({ settings, onStart, fading }: { settings: Settings; onStart(): void; fading: boolean }) {
  const D = parseWedding(settings);
  return (
    <section id="welcome" className={`screen${fading ? " fade" : ""}`}>
      <div className="rays" />
      <Mandala id="md1" />
      <svg className="hearts rise" viewBox="0 0 250 200" aria-hidden="true">
        <g className="h1">
          <g transform="translate(95 100) scale(1.2)">
            <use href="#hp" fill="url(#hg)" filter="url(#emb)" />
            <path d="M-36-34C-52-14-30-52-4-30" stroke="url(#hl)" strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
        </g>
        <g className="h2">
          <g transform="translate(160 96) scale(.98)">
            <use href="#hp" fill="url(#hg)" filter="url(#emb)" />
            <path d="M-36-34C-52-14-30-52-4-30" stroke="url(#hl)" strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <div className="script names foil rise" style={{ animationDelay: ".5s" }}>
        {settings.groom}
        <small>&amp;</small>
        {settings.bride}
      </div>
      <div className="cin foil rise" style={{ animationDelay: ".9s", fontSize: 14 }}>
        Wedding Invitation
      </div>
      <svg className="line rise" viewBox="0 0 150 30" style={{ animationDelay: "1s" }} aria-hidden="true">
        <use href="#lotus" />
      </svg>
      <div className="leaf rise" style={{ animationDelay: "1.2s" }}>
        <i>{MONTHS[D.getMonth()].toUpperCase()} {D.getFullYear()}</i>
        <strong>{D.getDate()}</strong>
        <small>{DAYS[D.getDay()]}</small>
      </div>
      <button className="play" onClick={onStart} aria-label="Start">
        <svg viewBox="0 0 24 24">
          <path d="M6 3l15 9-15 9z" />
        </svg>
      </button>
      <div className="hint">Tap to open</div>
    </section>
  );
}
