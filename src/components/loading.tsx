"use client";

import { useEffect, useState } from "react";
import { FloatingHearts, Mandala } from "./svg-defs";

export default function Loading({ onDone }: { onDone(): void }) {
  const [curtainsOpen, setCurtainsOpen] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainsOpen(true), 120);
    const t2 = setTimeout(onDone, 10500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <section id="hug" className="screen">
      <div className="rays" />
      <Mandala id="md2" />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, zIndex: 1 }} viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden="true">
        <g fill="#ffd77a" filter="url(#bl)">
          <circle className="bk" cx="60" cy="150" r="22" opacity=".4" />
          <circle className="bk" cx="340" cy="230" r="30" opacity=".35" style={{ animationDelay: "1s" }} />
          <circle className="bk" cx="90" cy="600" r="26" opacity=".35" style={{ animationDelay: "2s" }} />
          <circle className="bk" cx="320" cy="650" r="18" opacity=".45" style={{ animationDelay: "3s" }} />
        </g>
      </svg>
      <div className="stage">
        <div className="loc-wrap">
          <div className="loc-glow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/loc.png" className="loc" alt="The happy couple" draggable={false} />
          <div className="loc-shine" />
        </div>
        <FloatingHearts />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/gold.png" className="gold-title" alt="මෙන්න මංගල්ලේ.." draggable={false} />
      <div className="script foil" style={{ fontSize: 38 }}>
        Two hearts, one journey…
      </div>
      <div className="bar">
        <span />
      </div>
      <div className={`curt l${curtainsOpen ? " open" : ""}`} id="cl" />
      <div className={`curt r${curtainsOpen ? " open" : ""}`} id="cr" />
    </section>
  );
}
