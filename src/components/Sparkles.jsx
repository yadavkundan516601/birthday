import { useMemo } from "react";
import config from "../config";
import { makeRand } from "../lib/random";

const STAR = "M12 0C12.6 7 17 11.4 24 12 17 12.6 12.6 17 12 24 11.4 17 7 12.6 0 12 7 11.4 11.4 7 12 0Z";
const PALETTE = ["#ffffff", "#fff1a8", "#ffd1e8", "#e9d5ff", "#ffe0c2"];

/** Twinkling 4-point stars (or glowing dots). Fills its (positioned) parent. */
export default function Sparkles({
  count = 22,
  seed = 3,
  min = 7,
  max = 20,
  shape = "star",
  colors = PALETTE,
  className = "",
  area = { top: 0, bottom: 100 }, // vertical band, in %
}) {
  const items = useMemo(() => {
    const r = makeRand(seed);
    return Array.from({ length: count }, () => ({
      left: r.range(1, 99),
      top: r.range(area.top, area.bottom),
      size: r.range(min, max),
      dur: r.range(2.2, 4.8),
      delay: -r.range(0, 5),
      color: r.pick(colors),
    }));
  }, [count, seed, min, max, colors, area.top, area.bottom]);

  if (!config.effects.sparkles) return null;

  return (
    <div className={`particles absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((s, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {shape === "star" ? (
            <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ filter: `drop-shadow(0 0 4px ${s.color})` }}>
              <path d={STAR} fill={s.color} />
            </svg>
          ) : (
            <span
              className="block h-full w-full rounded-full"
              style={{ background: s.color, boxShadow: `0 0 ${s.size}px ${s.size / 3}px ${s.color}` }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
