import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Heart from "./Heart";

function FallbackArt({ label }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 text-center"
      style={{ background: "linear-gradient(160deg,#ffe4ee,#e9d9ff)" }}
    >
      <span className="text-6xl">🐰</span>
      <span className="px-4 text-sm font-semibold text-[#8a4a73]">{label || "Your photo goes here"}</span>
    </div>
  );
}

/** One polaroid-style card. The active one tilts in 3D towards the finger / cursor. */
function Card({ item, offset, onSelect }) {
  const [broken, setBroken] = useState(false);
  const active = offset === 0;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 20 });
  const sy = useSpring(my, { stiffness: 220, damping: 20 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const glare = useMotionTemplate`radial-gradient(circle at ${useTransform(sx, [-0.5, 0.5], [0, 100])}% ${useTransform(sy, [-0.5, 0.5], [0, 100])}%, rgba(255,255,255,.55), transparent 55%)`;

  const onMove = (e) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const abs = Math.abs(offset);
  return (
    <motion.div
      className="absolute left-1/2 top-0"
      style={{
        width: "var(--cw)",
        marginLeft: "calc(var(--cw) / -2)",
        zIndex: 30 - abs * 3,
        transformPerspective: 1100,
        pointerEvents: abs > 2 ? "none" : "auto",
      }}
      initial={false}
      animate={{
        x: `${offset * 60}%`,
        scale: 1 - Math.min(abs, 3) * 0.16,
        rotateY: offset * -34,
        opacity: abs > 2 ? 0 : 1 - abs * 0.2,
        y: abs * 14,
      }}
      transition={{ type: "spring", stiffness: 170, damping: 22 }}
      onClick={() => !active && onSelect()}
    >
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative cursor-pointer rounded-[28px] bg-white/92 p-2.5"
        style={{
          rotateX: active ? rotX : 0,
          rotateY: active ? rotY : 0,
          transformStyle: "preserve-3d",
          border: "3.5px solid #ffb6d5",
          boxShadow: active
            ? "0 30px 60px -18px rgba(230,60,130,.55), 0 0 0 6px rgba(255,255,255,.55)"
            : "0 16px 30px -14px rgba(230,60,130,.4)",
        }}
        whileHover={active ? { scale: 1.02 } : undefined}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[19px]">
          {broken ? (
            <FallbackArt label={item.alt} />
          ) : (
            <img
              src={item.src}
              alt={item.alt}
              draggable={false}
              onError={() => setBroken(true)}
              className="h-full w-full select-none object-cover"
            />
          )}
          {active && <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: glare }} />}
          {item.caption && (
            <div
              className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-10 text-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(0deg, rgba(190,40,110,.7), transparent)" }}
            >
              {item.caption}
            </div>
          )}
        </div>
        <div style={{ transform: "translateZ(40px)" }} className="pointer-events-none absolute -right-3 -top-3">
          <span className="block" style={{ animation: "float-tilt 3.6s ease-in-out infinite" }}>
            <Heart size={34} />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * A swipeable 3D "cover-flow" of photos. Works with any number of images.
 * Swipe, tap a side card, use the arrows/dots or the keyboard. Auto-advances
 * until the viewer takes over.
 */
export default function Carousel3D({ items, autoPlay = true, interval = 3600 }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const userTookOver = useRef(false);

  const go = useCallback(
    (dir, manual = true) => {
      if (manual) userTookOver.current = true;
      setActive((a) => (a + dir + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (!autoPlay || n < 2) return;
    const t = window.setInterval(() => {
      if (!userTookOver.current) go(1, false);
    }, interval);
    return () => window.clearInterval(t);
  }, [autoPlay, interval, n, go]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!n) return null;

  const offsetOf = (i) => {
    let o = i - active;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
  };

  return (
    <div className="w-full select-none" style={{ "--cw": "min(64vw, 300px, 33dvh)" }}>
      <motion.div
        className="relative mx-auto w-full max-w-[720px] touch-pan-y"
        style={{ height: "calc(var(--cw) * 1.25 + 64px)", perspective: 1400 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => {
          if (info.offset.x < -45 || info.velocity.x < -380) go(1);
          else if (info.offset.x > 45 || info.velocity.x > 380) go(-1);
        }}
      >
        <div className="absolute inset-x-0 top-6">
          <div className="relative mx-auto" style={{ height: "calc(var(--cw) * 1.25 + 24px)" }}>
            {items.map((item, i) => (
              <Card key={`${item.src}-${i}`} item={item} offset={offsetOf(i)} onSelect={() => {
                  userTookOver.current = true;
                  setActive(i);
                }} />
            ))}
          </div>
        </div>
      </motion.div>

      {n > 1 && (
        <div className="mt-1 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/60 text-[#ff4f93] shadow-md backdrop-blur-md transition active:scale-90"
          >
            <ChevronLeft size={22} strokeWidth={2.8} />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Photos">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Photo ${i + 1}`}
                onClick={() => {
                  userTookOver.current = true;
                  setActive(i);
                }}
                className="h-2.5 rounded-full transition-all"
                style={{ width: i === active ? 26 : 10, background: i === active ? "#ff6fa5" : "rgba(255,255,255,.85)" }}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/60 text-[#ff4f93] shadow-md backdrop-blur-md transition active:scale-90"
          >
            <ChevronRight size={22} strokeWidth={2.8} />
          </button>
        </div>
      )}
    </div>
  );
}
