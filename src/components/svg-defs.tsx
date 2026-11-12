/** Shared SVG defs (gradients, filters, symbols) used across the experience. */
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="gd" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#9a6a18" />
          <stop offset=".5" stopColor="#ffe9a0" />
          <stop offset="1" stopColor="#b98a2c" />
        </linearGradient>
        <radialGradient id="hg" cx="35%" cy="25%" r="85%">
          <stop offset="0" stopColor="#ff8a9a" />
          <stop offset=".45" stopColor="#d1132f" />
          <stop offset="1" stopColor="#500312" />
        </radialGradient>
        <linearGradient id="hl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".8" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="emb" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="b" />
          <feSpecularLighting in="b" surfaceScale="7" specularConstant="1" specularExponent="24" lightingColor="#fff" result="s">
            <fePointLight x="-60" y="-80" z="120" />
          </feSpecularLighting>
          <feComposite in="s" in2="SourceAlpha" operator="in" result="s2" />
          <feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".9" k4="0" />
        </filter>
        <filter id="bl">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <path id="hp" d="M0 34C-70-12-34-66 0-28 34-66 70-12 0 34Z" />
        <g id="corner" fill="none" stroke="url(#gd)" strokeWidth="2">
          <path d="M4 4H38M4 4V38" />
          <path d="M10 10Q34 10 34 34Q34 18 18 18Q18 34 10 34Z" />
          <circle cx="10" cy="10" r="4" fill="url(#gd)" />
        </g>
        <g id="lotus" fill="none" stroke="url(#gd)" strokeWidth="1.6">
          <path d="M75 4Q60 14 75 26Q90 14 75 4ZM75 26Q50 22 52 8Q64 10 75 26ZM75 26Q100 22 98 8Q86 10 75 26Z" />
          <path d="M0 16H46M104 16H150" />
        </g>
        <symbol id="i-cal" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10H21M8 3V7M16 3V7M12 18l-3-2.6a1.8 1.8 0 0 1 3-2 1.8 1.8 0 0 1 3 2z" />
        </symbol>
        <symbol id="i-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </symbol>
        <symbol id="i-pin" viewBox="0 0 24 24">
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </symbol>
        <symbol id="i-lamp" viewBox="0 0 24 24">
          <path d="M4 14h16c0 3-3 5-8 5s-8-2-8-5zM12 3c2 2.5 2 4.5 0 7-2-2.5-2-4.5 0-7zM20 14l2-2" />
        </symbol>
        <symbol id="i-star" viewBox="0 0 24 24">
          <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
        </symbol>
        <symbol id="i-phone" viewBox="0 0 24 24">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </symbol>
        <symbol id="i-chat" viewBox="0 0 24 24">
          <path d="M4 5h16v11H9l-5 4z" />
        </symbol>
        <symbol id="i-vol" viewBox="0 0 24 24">
          <path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6" />
        </symbol>
        <symbol id="i-mute" viewBox="0 0 24 24">
          <path d="M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6" />
        </symbol>
        <symbol id="i-heart" viewBox="0 0 24 24">
          <path d="M12 21C3 14 3 7 7.5 6 10 5.6 11.5 7 12 8.4 12.5 7 14 5.6 16.5 6 21 7 21 14 12 21z" />
        </symbol>
        <symbol id="i-wa" viewBox="0 0 32 32">
          <path d="M16 3C9.4 3 4 8.4 4 15c0 2.6.8 5 2.3 7L4.5 28.5l6.8-1.8c1.5.8 3.1 1.2 4.7 1.2 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.9c-1.5 0-2.9-.4-4.2-1.1l-.3-.2-4 1.1 1.1-3.9-.2-.3c-1.3-2.1-2-4.5-2-6.9 0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6zm5.4-7.2c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.5-.3z" />
        </symbol>
      </defs>
    </svg>
  );
}

/** Spinning mandala SVG mark. */
export function Mandala({ id }: { id: string }) {
  const petals: React.ReactNode[] = [];
  for (let i = 0; i < 24; i++) {
    petals.push(
      <g key={i} transform={`rotate(${i * 15})`}>
        <path d="M0-30Q8-62 0-96Q-8-62 0-30Z" fill="none" stroke="#e2b95c" strokeWidth=".8" />
      </g>
    );
  }
  return (
    <svg className="mandala" id={id} viewBox="-100 -100 200 200" aria-hidden="true">
      {petals}
      {[30, 45, 60].map((r) => (
        <circle key={r} r={r} fill="none" stroke="#e2b95c" strokeWidth=".6" strokeDasharray="2 3" />
      ))}
    </svg>
  );
}

/** Golden heart icon path used by floating hearts. */
export function FloatingHearts() {
  const heart =
    "M12 21C3 14 3 7 7.5 6 10 5.6 11.5 7 12 8.4 12.5 7 14 5.6 16.5 6 21 7 21 14 12 21z";
  const items = [
    { left: "10%", top: "28%", fill: "#ff4b63", delay: 0 },
    { left: "48%", top: "14%", fill: "#ffd77a", delay: 1.1 },
    { left: "82%", top: "32%", fill: "#ff4b63", delay: 2.2 },
  ];
  return (
    <>
      {items.map((it, i) => (
        <svg
          key={i}
          className="fh"
          style={{ left: it.left, top: it.top, fill: it.fill, animationDelay: `${it.delay}s` }}
          viewBox="0 0 24 24"
        >
          <path d={heart} />
        </svg>
      ))}
    </>
  );
}
