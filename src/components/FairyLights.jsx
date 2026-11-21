import { useEffect, useMemo, useState } from "react";

const BULBS = ["#ff8fb8", "#ffe28a", "#c9a7ff", "#ffb48f", "#9fe3ff", "#ff6fa5"];
const SAG = 40; // control point (in a 100x30 box) – how much the wire droops

function useSegments() {
  const calc = () => Math.max(3, Math.min(12, Math.round((typeof window === "undefined" ? 800 : window.innerWidth) / 140)));
  const [n, setN] = useState(calc);
  useEffect(() => {
    const onResize = () => setN(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return n;
}

/**
 * Strings of fairy lights draped across the top of the screen.
 * `on` flips them from dim glass to glowing – bulbs light up one after another.
 */
export default function FairyLights({ on = true, className = "", height = 58, stagger = 70 }) {
  const segments = useSegments();
  const bulbs = useMemo(() => {
    const out = [];
    const perSeg = 3;
    for (let s = 0; s < segments; s++) {
      for (let b = 0; b < perSeg; b++) {
        const t = (b + 0.5) / perSeg;
        const y = 4 * (1 - t) ** 2 + 2 * SAG * (1 - t) * t + 4 * t * t; // quadratic bezier y
        out.push({
          x: ((s + t) / segments) * 100,
          y: (y / 30) * 100,
          color: BULBS[(s * perSeg + b) % BULBS.length],
          idx: s * perSeg + b,
        });
      }
    }
    return out;
  }, [segments]);

  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 ${className}`} style={{ height }} aria-hidden="true">
      <div className="absolute inset-0 flex">
        {Array.from({ length: segments }, (_, i) => (
          <svg key={i} viewBox="0 0 100 30" preserveAspectRatio="none" className="h-full" style={{ width: `${100 / segments}%` }}>
            <path
              d={`M0 4Q50 ${SAG} 100 4`}
              fill="none"
              stroke="#8a5a7d"
              strokeOpacity=".8"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ))}
      </div>
      {bulbs.map((b) => (
        <span
          key={b.idx}
          className="absolute block"
          style={{ left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%, -2px)" }}
        >
          <span className="mx-auto block h-1.5 w-2 rounded-sm" style={{ background: "#6f4b66" }} />
          <span
            className="block rounded-[50%_50%_46%_46%]"
            style={{
              width: 11,
              height: 15,
              background: on ? b.color : "#9d8aa8",
              opacity: on ? 1 : 0.5,
              boxShadow: on ? `0 0 14px 4px ${b.color}, 0 0 28px 8px ${b.color}66` : "none",
              transition: `all .6s ease ${on ? b.idx * stagger : 0}ms`,
              animation: on ? `bulb-twinkle ${2 + (b.idx % 5) * 0.4}s ease-in-out ${b.idx * 0.13}s infinite` : "none",
            }}
          />
        </span>
      ))}
    </div>
  );
}
