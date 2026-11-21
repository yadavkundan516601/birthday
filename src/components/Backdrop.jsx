import { useMemo } from "react";
import { makeRand } from "../lib/random";

export const TONES = {
  pink: "linear-gradient(160deg,#ffeaf2 0%,#ffd1e3 42%,#ffc4de 68%,#f1d8ff 100%)",
  dawn: "linear-gradient(165deg,#fff1e8 0%,#ffdce9 45%,#ffc3dd 100%)",
  lavender: "linear-gradient(170deg,#f3e4ff 0%,#ffd7ec 52%,#e3d3ff 100%)",
  rose: "linear-gradient(165deg,#ffe6ef 0%,#ffc5dc 48%,#f4c9ff 100%)",
  night: "linear-gradient(180deg,#140a28 0%,#2a1448 55%,#46225f 100%)",
  dusk: "linear-gradient(175deg,#e9d4ff 0%,#ffcfe6 55%,#ffc6d9 100%)",
};

/**
 * A full-bleed gradient with big soft "bokeh" lights drifting slowly.
 * Fills its (positioned) parent. Pure CSS gradients – no blur filters – so it
 * stays smooth on phones.
 */
export default function Backdrop({ tone = "pink", bokeh = 9, seed = 2, className = "", children }) {
  const lights = useMemo(() => {
    const r = makeRand(seed);
    return Array.from({ length: bokeh }, () => ({
      left: r.range(-5, 95),
      top: r.range(-5, 95),
      size: r.range(110, 320),
      dur: r.range(14, 26),
      delay: -r.range(0, 20),
      alpha: r.range(0.25, 0.5),
    }));
  }, [bokeh, seed]);
  const night = tone === "night";

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ background: TONES[tone] || TONES.pink }}>
      <div className="particles absolute inset-0" aria-hidden="true">
        {lights.map((l, i) => (
          <span
            key={i}
            className="absolute block rounded-full"
            style={{
              left: `${l.left}%`,
              top: `${l.top}%`,
              width: l.size,
              height: l.size,
              background: `radial-gradient(circle, ${night ? "rgba(190,150,255," : "rgba(255,255,255,"}${l.alpha}) 0%, transparent 68%)`,
              animation: `float-y ${l.dur}s ease-in-out ${l.delay}s infinite`,
            }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
