import { useId, useMemo } from "react";
import { makeRand } from "../lib/random";

const PALETTE = [
  ["#ffc2d6", "#ff7fae"],
  ["#ffb0cb", "#ff5f9b"],
  ["#ffd3e0", "#ff94b8"],
  ["#ffa6c4", "#f0508d"],
];

/** Rose petals tumbling down in 3D. Fills its (positioned) parent. */
export default function Petals({ count = 16, seed = 11, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const items = useMemo(() => {
    const r = makeRand(seed);
    return Array.from({ length: count }, () => ({
      left: r.range(0, 98),
      size: r.range(14, 28),
      fall: r.range(9, 17),
      spin: r.range(3.5, 7),
      delay: -r.range(0, 16),
      drift: r.range(-120, 120),
      tone: r.int(0, PALETTE.length - 1),
    }));
  }, [count, seed]);

  return (
    <div
      className={`particles absolute inset-0 overflow-hidden ${className}`}
      style={{ perspective: 600 }}
      aria-hidden="true"
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          {PALETTE.map(([a, b], i) => (
            <linearGradient key={i} id={`${uid}-p${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={a} />
              <stop offset="1" stopColor={b} />
            </linearGradient>
          ))}
        </defs>
      </svg>
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            animation: `petal-fall ${p.fall}s linear ${p.delay}s infinite`,
            "--drift": `${p.drift}px`,
            willChange: "transform",
          }}
        >
          <span
            className="block h-full w-full"
            style={{ animation: `petal-spin ${p.spin}s linear ${p.delay}s infinite`, transformStyle: "preserve-3d" }}
          >
            <svg viewBox="0 0 20 28" width="100%" height="100%">
              <path d="M10 1C17 6 19.5 15 10 27 .5 15 3 6 10 1Z" fill={`url(#${uid}-p${p.tone})`} />
              <path d="M10 5C10 11 10 18 10 24" stroke="#fff" strokeOpacity=".35" strokeWidth=".8" fill="none" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
