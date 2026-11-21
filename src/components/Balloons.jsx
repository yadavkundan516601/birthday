import { useId, useMemo } from "react";
import { makeRand } from "../lib/random";

export const BALLOON_COLORS = [
  ["#ffd1e3", "#ff8fb8"],
  ["#ffb6d5", "#ff6fa5"],
  ["#e6d6ff", "#b78bff"],
  ["#ffe4d2", "#ffa987"],
  ["#d6f1ff", "#8fcdf0"],
  ["#fff4b8", "#ffd35e"],
];

/** One glossy balloon. */
export function Balloon({ width = 56, light = "#ffd1e3", dark = "#ff8fb8", string = true, className, style }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 60 118"
      width={width}
      height={(width * 118) / 60}
      className={className}
      style={{ overflow: "visible", ...style }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset="0.18" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      {string && (
        <path d="M30 78C22 90 38 98 30 108S26 116 30 118" stroke="#fff" strokeOpacity=".85" strokeWidth="1.4" fill="none" />
      )}
      <path d="M30 2C47 2 58 16 58 34c0 20-16 34-28 38C18 68 2 54 2 34 2 16 13 2 30 2Z" fill={`url(#${id})`} />
      <path d="M30 70 25.5 79h9Z" fill={dark} />
      <ellipse cx="20" cy="22" rx="6.5" ry="11" fill="#fff" opacity=".55" transform="rotate(24 20 22)" />
    </svg>
  );
}

/**
 * A field of balloons.
 *   mode="rise" – endlessly floating up from the bottom of the (positioned) parent
 *   mode="bob"  – hovering in place at random spots
 */
export default function Balloons({ count = 8, mode = "rise", seed = 21, size = [40, 72], className = "" }) {
  const items = useMemo(() => {
    const r = makeRand(seed);
    return Array.from({ length: count }, (_, i) => ({
      left: (i + r.range(0.1, 0.9)) * (100 / count),
      top: r.range(8, 55),
      width: r.range(size[0], size[1]),
      dur: r.range(11, 19),
      delay: -r.range(0, 16),
      drift: r.range(-60, 60),
      sway: r.range(3, 5.5),
      colors: r.pick(BALLOON_COLORS),
      bob: r.range(3.5, 6),
    }));
  }, [count, seed, size]);

  return (
    <div className={`particles absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((b, i) =>
        mode === "rise" ? (
          <span
            key={i}
            className="absolute block"
            style={{
              left: `${b.left}%`,
              bottom: -160,
              animation: `balloon-rise ${b.dur}s linear ${b.delay}s infinite`,
              "--drift": `${b.drift}px`,
              willChange: "transform",
            }}
          >
            <span className="block" style={{ animation: `balloon-sway ${b.sway}s ease-in-out infinite`, transformOrigin: "50% 100%" }}>
              <Balloon width={b.width} light={b.colors[0]} dark={b.colors[1]} />
            </span>
          </span>
        ) : (
          <span
            key={i}
            className="absolute block"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              animation: `balloon-bob ${b.bob}s ease-in-out ${b.delay}s infinite`,
            }}
          >
            <Balloon width={b.width} light={b.colors[0]} dark={b.colors[1]} />
          </span>
        ),
      )}
    </div>
  );
}
