"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "@/lib/settings";
import { DAYS, MONTHS, parseWedding } from "./shared";

function Calendar({ D }: { D: Date }) {
  const y = D.getFullYear(), m = D.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return (
    <div id="cal">
      <b style={{ fontFamily: "Cinzel,serif", fontSize: 20, color: "#8c1a2e", letterSpacing: ".15em" }}>
        {MONTHS[m].toUpperCase()} {y}
      </b>
      <table>
        <thead>
          <tr>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(cells.length / 7) }, (_, r) => (
            <tr key={r}>
              {cells.slice(r * 7, r * 7 + 7).map((c, i) => (
                <td key={i} className={c === D.getDate() ? "on" : ""}>
                  {c ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Countdown({ D }: { D: Date }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    const tick = () => setS(Math.max(0, Math.floor((D.getTime() - Date.now()) / 1000)));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [D]);
  const parts: [number, string][] = [
    [86400, "Days"],
    [3600, "Hours"],
    [60, "Mins"],
    [1, "Secs"],
  ];
  let rest = s;
  return (
    <div className="cd" id="cd">
      {parts.map(([k, l]) => {
        const x = Math.floor(rest / k);
        rest -= x * k;
        return (
          <div key={l}>
            <b>{x}</b>
            <small>{l}</small>
          </div>
        );
      })}
    </div>
  );
}

function FamilyColumn({ lines, name, align }: { lines: string[]; name: string; align: "left" | "right" }) {
  return (
    <div className="fam-col" style={{ textAlign: align }}>
      {lines.map((l, i) => (
        <p className="fam-line" key={i}>
          {l}
        </p>
      ))}
      {name && <div className="fam-name">{name}</div>}
    </div>
  );
}

export default function Invitation({ settings }: { settings: Settings }) {
  const D = parseWedding(settings);
  const mainRef = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState<number | null>(null);

  useEffect(() => {
    const papers = mainRef.current?.querySelectorAll(".paper");
    if (!papers) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 }
    );
    papers.forEach((p) => io.observe(p));
    papers[0]?.classList.add("in");
    return () => io.disconnect();
  }, [settings]);

  const hidden = (id: string) => settings.hidden_sections.includes(id);
  const galCount = Math.min(4, settings.gallery.length);

  // Auto-play the slideshow while it is open.
  useEffect(() => {
    if (slide === null || galCount === 0) return;
    const t = setInterval(() => setSlide((s) => (s === null ? null : ((s ?? 0) + 1) % galCount)), 3200);
    return () => clearInterval(t);
  }, [slide, galCount]);

  const mapQ = encodeURIComponent(settings.map_query);
  const mapHref = settings.map_link.trim() || `https://www.google.com/maps/search/?api=1&query=${mapQ}`;
  const mapEmbed = settings.map_link.trim() || `https://maps.google.com/maps?q=${mapQ}&output=embed`;
  const corners = ["a", "b", "c", "d"] as const;
  const showFamily = !hidden("family") && (settings.bride_lines.length > 0 || settings.groom_lines.length > 0);

  return (
    <main id="card" ref={mainRef}>
      <div className="paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/gold.png" className="gold-head" alt="මෙන්න මංගල්ලේ.." draggable={false} />
        <div className="cin" style={{ fontSize: 12, color: "#9a6a14" }}>
          Together with their families
        </div>
        <div className="script names foil" style={{ margin: "6px 0" }}>
          {settings.groom}
          <small>&amp;</small>
          {settings.bride}
        </div>
        <svg className="sep" viewBox="0 0 150 30" aria-hidden="true">
          <use href="#lotus" />
        </svg>
        <p>
          <i>{settings.invitation_message}</i>
        </p>
      </div>

      {showFamily && (
        <div className="paper fam-paper">
          {corners.map((k) => (
            <svg key={k} className={`cn ${k}`} viewBox="0 0 42 42" aria-hidden="true">
              <use href="#corner" />
            </svg>
          ))}
          <div className="fam-title">{settings.family_title}</div>
          <div className="fam-grid">
            <FamilyColumn lines={settings.bride_lines} name={settings.bride_family_name} align="left" />
            <div className="fam-divider" />
            <FamilyColumn lines={settings.groom_lines} name={settings.groom_family_name} align="right" />
          </div>
        </div>
      )}

      {!hidden("calendar") && (
        <div className="paper">
          {corners.map((k) => (
            <svg key={k} className={`cn ${k}`} viewBox="0 0 42 42" aria-hidden="true">
              <use href="#corner" />
            </svg>
          ))}
          <svg className="ic" viewBox="0 0 24 24">
            <use href="#i-cal" />
          </svg>
          <h2>The Wedding Day</h2>
          <Calendar D={D} />
          <Countdown D={D} />
        </div>
      )}

      {!hidden("time") && (
        <div className="paper">
          {corners.map((k) => (
            <svg key={k} className={`cn ${k}`} viewBox="0 0 42 42" aria-hidden="true">
              <use href="#corner" />
            </svg>
          ))}
          <svg className="ic" viewBox="0 0 24 24">
            <use href="#i-clock" />
          </svg>
          <h2>{settings.time_title}</h2>
          <div className="time">
            <div>
              <b>{settings.poruwa_time}</b>
              <span>{settings.poruwa_label}</span>
            </div>
            <div>
              <b>{settings.lunch_time}</b>
              <span>{settings.lunch_label}</span>
            </div>
            <div>
              <b>{settings.reception_time}</b>
              <span>{settings.reception_label}</span>
            </div>
          </div>
        </div>
      )}

      {!hidden("venue") && (
        <div className="paper">
          {corners.map((k) => (
            <svg key={k} className={`cn ${k}`} viewBox="0 0 42 42" aria-hidden="true">
              <use href="#corner" />
            </svg>
          ))}
          <svg className="ic" viewBox="0 0 24 24">
            <use href="#i-pin" />
          </svg>
          <h2>Venue</h2>
          <p>
            {settings.venue_name}
            <br />
            {settings.venue_address}
          </p>
          <iframe loading="lazy" src={mapEmbed} title="Map" />
          <a className="btn" target="_blank" rel="noopener noreferrer" href={mapHref}>
            <svg className="ic sm" viewBox="0 0 24 24">
              <use href="#i-pin" />
            </svg>
            Open in Google Maps
          </a>
        </div>
      )}

      {!hidden("timeline") && (
        <div className="paper">
          {corners.map((k) => (
            <svg key={k} className={`cn ${k}`} viewBox="0 0 42 42" aria-hidden="true">
              <use href="#corner" />
            </svg>
          ))}
          <svg className="ic" viewBox="0 0 24 24">
            <use href="#i-lamp" />
          </svg>
          <h2>Poruwa Ceremony</h2>
          <ul className="tl">
            {settings.timeline.map((item, i) => (
              <li key={i}>
                <em>{item.time}</em>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hidden("gallery") && settings.gallery.length > 0 && (
        <div className="paper">
          {corners.map((k) => (
            <svg key={k} className={`cn ${k}`} viewBox="0 0 42 42" aria-hidden="true">
              <use href="#corner" />
            </svg>
          ))}
          <svg className="ic" viewBox="0 0 24 24">
            <use href="#i-heart" />
          </svg>
          <h2>Our Moments</h2>
          <div className="gal-arc">
            {settings.gallery.slice(0, 4).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                className={`gal-img g${i}`}
                src={src}
                alt={`Wedding photo ${i + 1}`}
                loading="lazy"
                onClick={() => setSlide(i)}
              />
            ))}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ros.png" className="gal-ros" alt="" draggable={false} />
          </div>
        </div>
      )}

      {!hidden("details") && (
        <div className="paper">
          {corners.map((k) => (
            <svg key={k} className={`cn ${k}`} viewBox="0 0 42 42" aria-hidden="true">
              <use href="#corner" />
            </svg>
          ))}
          <svg className="ic" viewBox="0 0 24 24">
            <use href="#i-star" />
          </svg>
          <h2>Details</h2>
          <ul className="dl">
            {settings.details_lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <a className="btn" href={`tel:${settings.rsvp_phone}`}>
            <svg className="ic sm" viewBox="0 0 24 24">
              <use href="#i-phone" />
            </svg>
            RSVP
          </a>
          <a className="btn" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${settings.whatsapp_number}`}>
            <svg className="ic sm" viewBox="0 0 24 24">
              <use href="#i-chat" />
            </svg>
            WhatsApp
          </a>
          <div className="script foil" style={{ fontSize: 36, marginTop: 18 }}>
            Your presence is our blessing
          </div>
        </div>
      )}

      <div className="credit">
        {settings.about_by}
        <b>{settings.about_brand}</b>
        <a href={settings.about_web_url} target="_blank" rel="noopener noreferrer">
          {settings.about_web_text}
        </a>
      </div>

      {slide !== null && settings.gallery[slide] && (
        <div className="gal-overlay" onClick={() => setSlide(null)}>
          <div className="gal-frame" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={slide} src={settings.gallery[slide]} alt="Wedding photo" />
            <div className="gal-count">
              {slide + 1} / {settings.gallery.length}
            </div>
            <button
              className="gal-nav prev"
              aria-label="Previous"
              onClick={() => setSlide((s) => ((s ?? 0) - 1 + settings.gallery.length) % settings.gallery.length)}
            >
              ‹
            </button>
            <button
              className="gal-nav next"
              aria-label="Next"
              onClick={() => setSlide((s) => ((s ?? 0) + 1) % settings.gallery.length)}
            >
              ›
            </button>
            <button className="gal-x" aria-label="Close" onClick={() => setSlide(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
