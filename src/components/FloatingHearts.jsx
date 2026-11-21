import { useMemo } from "react";
import config from "../config";
import { makeRand } from "../lib/random";
import Heart from "./Heart";

const PALETTE = ["#ff8fb8", "#ffb3cf", "#ff6fa5", "#ffc9dd", "#e9b8ff", "#ffd0b5"];

/** Hearts that drift upwards and fade. Fills its (positioned) parent. */
export default function FloatingHearts({
  count = 14,
  seed = 7,
  colors = PALETTE,
  min = 14,
  max = 34,
  speed = 1,
  className = "",
}) {
  const items = useMemo(() => {
    const r = makeRand(seed);
    return Array.from({ length: count }, () => ({
      left: r.range(2, 98),
      size: r.range(min, max),
      dur: r.range(7, 13) / speed,
      delay: -r.range(0, 12),
      drift: r.range(-70, 70),
      rot: r.range(-40, 40),
      color: r.pick(colors),
    }));
  }, [count, seed, colors, min, max, speed]);

  if (!config.effects.floatingHearts) return null;

  return (
    <div className={`particles absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((h, i) => (
        <span
          key={i}
          className="float-heart absolute"
          style={{
            left: `${h.left}%`,
            bottom: -48,
            width: h.size,
            animationDuration: `${h.dur}s`,
            animationDelay: `${h.delay}s`,
            "--drift": `${h.drift}px`,
            "--rot": `${h.rot}deg`,
          }}
        >
          <Heart size={h.size} from={h.color} flat />
        </span>
      ))}
    </div>
  );
}
