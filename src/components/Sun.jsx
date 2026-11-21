import { useId } from "react";

/** A smiling, blushing kawaii sun with slowly turning rays. */
export default function Sun({ size = 260, className = "", style }) {
  const id = useId().replace(/:/g, "");
  const rays = Array.from({ length: 14 }, (_, i) => i);
  return (
    <svg viewBox="-150 -150 300 300" width={size} height={size} className={className} style={{ overflow: "visible", ...style }} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#fff6b8" stopOpacity=".95" />
          <stop offset="0.45" stopColor="#ffd9a0" stopOpacity=".5" />
          <stop offset="1" stopColor="#ffc2d8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-disc`} cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#fffbe3" />
          <stop offset="0.55" stopColor="#ffe28a" />
          <stop offset="1" stopColor="#ffb86b" />
        </radialGradient>
      </defs>
      <circle r="150" fill={`url(#${id}-halo)`} />
      <g style={{ animation: "spin-slow 26s linear infinite", transformOrigin: "0 0" }}>
        {rays.map((i) => (
          <path
            key={i}
            d={i % 2 ? "M-8 -84L0 -112 8 -84Z" : "M-10 -84L0 -126 10 -84Z"}
            fill={i % 2 ? "#ffd36b" : "#ffbf5e"}
            strokeLinejoin="round"
            stroke={i % 2 ? "#ffd36b" : "#ffbf5e"}
            strokeWidth="6"
            transform={`rotate(${(i * 360) / rays.length})`}
          />
        ))}
      </g>
      <circle r="78" fill={`url(#${id}-disc)`} />
      <ellipse cx="-26" cy="-40" rx="26" ry="13" fill="#fff" opacity=".4" transform="rotate(-28 -26 -40)" />
      {/* face */}
      <path d="M-36-6Q-27-20-18-6" stroke="#8a4a2e" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M18-6Q27-20 36-6" stroke="#8a4a2e" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="-44" cy="12" rx="13" ry="8" fill="#ff8fb4" opacity=".6" />
      <ellipse cx="44" cy="12" rx="13" ry="8" fill="#ff8fb4" opacity=".6" />
      <path d="M-14 14Q0 32 14 14" stroke="#8a4a2e" strokeWidth="5" strokeLinecap="round" fill="#ff8f9d" />
    </svg>
  );
}
