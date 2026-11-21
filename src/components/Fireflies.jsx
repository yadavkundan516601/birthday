import { useMemo } from "react";
import config from "../config";
import { makeRand } from "../lib/random";

/** Softly glowing fireflies drifting about. Fills its (positioned) parent. */
export default function Fireflies({ count = 16, seed = 5, color = "#fff3b0", className = "" }) {
  const items = useMemo(() => {
    const r = makeRand(seed);
    const off = () => `${r.range(-70, 70)}px`;
    return Array.from({ length: count }, () => ({
      left: r.range(3, 97),
      top: r.range(8, 92),
      size: r.range(5, 10),
      move: r.range(11, 20),
      glow: r.range(2.2, 4.4),
      delay: -r.range(0, 12),
      v: { "--x1": off(), "--y1": off(), "--x2": off(), "--y2": off(), "--x3": off(), "--y3": off() },
    }));
  }, [count, seed]);

  if (!config.effects.sparkles) return null;

  return (
    <div className={`particles absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((f, i) => (
        <span
          key={i}
          className="absolute block"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            animation: `firefly-move ${f.move}s ease-in-out ${f.delay}s infinite`,
            ...f.v,
          }}
        >
          <span
            className="block h-full w-full rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 ${f.size * 2}px ${f.size * 0.8}px ${color}`,
              animation: `glow-pulse ${f.glow}s ease-in-out ${f.delay}s infinite`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
