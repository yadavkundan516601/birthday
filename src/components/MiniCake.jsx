import { useId } from "react";

/** A small, sweet single-candle cake (used beside the teddy in the wish scene). */
export default function MiniCake({ size = 130, lit = true, className = "" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 140 130" width={size} height={(size * 130) / 140} className={className} style={{ overflow: "visible" }} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-b`} x1="0" x2="1">
          <stop offset="0" stopColor="#f59cc0" />
          <stop offset="0.35" stopColor="#ffd3e4" />
          <stop offset="0.7" stopColor="#ffc1d8" />
          <stop offset="1" stopColor="#f08db6" />
        </linearGradient>
        <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7a8" />
          <stop offset="0.55" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff6f9a" />
        </linearGradient>
        <radialGradient id={`${id}-g`}>
          <stop offset="0" stopColor="#fff2b0" stopOpacity=".95" />
          <stop offset="1" stopColor="#ffd0a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="118" rx="62" ry="9" fill="rgba(150,50,100,.18)" />
      <ellipse cx="70" cy="108" rx="64" ry="14" fill="#fff" stroke="#ffc1d9" strokeWidth="1.5" />
      <path d="M16 62V100A54 14 0 0 0 124 100V62Z" fill={`url(#${id}-b)`} />
      <ellipse cx="70" cy="62" rx="54" ry="14" fill="#fff6fa" />
      <path d="M16 70q9 14 16 0q9 16 17 0q9 16 17 0q9 16 17 0q9 16 17 0q8 14 16 0V62H16Z" fill="#fff" />
      <g fill="#ff7fb0">
        {[28, 50, 90, 112].map((x) => (
          <circle key={x} cx={x} cy={96 - (x > 60 ? 0 : 0)} r="3.4" />
        ))}
      </g>
      <g transform="translate(70 62)">
        <path d="M-12 -4C-14 -14 -3 -16 0 -9 3 -16 14 -14 12 -4 10 4 0 8 0 8S-10 4 -12 -4Z" fill="#ff5c9a" transform="translate(0 -4) scale(.9)" />
      </g>
      <rect x="66" y="22" width="8" height="40" rx="3" fill="#fff1b8" />
      <path d="M66 31l8-4M66 40l8-4M66 49l8-4M66 58l8-4" stroke="#ffc94d" strokeWidth="3" opacity=".9" />
      {lit && (
        <g>
          <circle cx="70" cy="9" r="19" fill={`url(#${id}-g)`} style={{ animation: "flame-glow 1.8s ease-in-out infinite", transformOrigin: "70px 9px" }} />
          <g style={{ animation: "flame 1.1s ease-in-out infinite", transformOrigin: "70px 20px" }}>
            <path d="M70 -6C79 6 80 17 70 21 60 17 61 6 70 -6Z" fill={`url(#${id}-f)`} />
            <path d="M70 6C73 11 73 16 70 18 67 16 67 11 70 6Z" fill="#fff9dc" />
          </g>
        </g>
      )}
    </svg>
  );
}
