import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flower } from "./Flower";
import { makeRand } from "../lib/random";

const THEMES = ["pink", "rose", "lilac", "peach", "white"];

/**
 * Flowers that burst outwards from the centre of the (positioned) parent, tumble
 * and drift down. Flip `active` to true to set it off.
 */
export default function FlowerBurst({ active = false, count = 16, seed = 8, reach = [90, 260] }) {
  const items = useMemo(() => {
    const r = makeRand(seed);
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 + r.range(-0.25, 0.25);
      const d = r.range(reach[0], reach[1]);
      return {
        tx: Math.cos(a) * d * 1.15,
        ty: Math.sin(a) * d * 0.9 - 40,
        fall: r.range(160, 300),
        size: r.range(34, 66),
        rot: r.range(-200, 200),
        delay: r.range(0, 0.35),
        theme: THEMES[i % THEMES.length],
        dur: r.range(2.4, 3.4),
      };
    });
  }, [count, seed, reach]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0" aria-hidden="true">
      {items.map((f, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ marginLeft: -f.size / 2, marginTop: -f.size / 2 }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
          animate={
            active
              ? {
                  x: [0, f.tx, f.tx * 1.08],
                  y: [0, f.ty, f.ty + f.fall],
                  scale: [0, 1.2, 0.9],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, f.rot * 0.6, f.rot],
                }
              : { x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }
          }
          transition={{
            duration: f.dur,
            delay: f.delay,
            times: [0, 0.32, 1],
            ease: "easeOut",
            opacity: { duration: f.dur, delay: f.delay, times: [0, 0.12, 0.7, 1] },
          }}
        >
          <Flower size={f.size} theme={f.theme} />
        </motion.div>
      ))}
    </div>
  );
}
