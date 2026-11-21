import { motion } from "framer-motion";

/** A chunky wall light-switch. Tap it (or the button beside it) to flip it on. */
export default function LightSwitch({ on = false, onToggle, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label="Light switch"
      aria-pressed={on}
      className="relative block outline-none focus-visible:ring-4 focus-visible:ring-white/70"
      style={{ width: 92, height: 134, borderRadius: 20 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          borderRadius: 20,
          background: "linear-gradient(160deg,#f6ecff 0%,#e3d3f5 100%)",
          border: "2px solid rgba(255,255,255,.7)",
        }}
        animate={{
          boxShadow: on
            ? "0 0 60px 14px rgba(255,214,120,.7), 0 14px 30px rgba(60,20,90,.35), inset 0 2px 0 rgba(255,255,255,.9)"
            : "0 0 26px 4px rgba(190,150,255,.35), 0 14px 30px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,255,255,.7)",
        }}
        transition={{ duration: 0.4 }}
      />
      {/* screws */}
      {[10, 118].map((top) => (
        <span key={top} className="absolute left-1/2 block h-2.5 w-2.5 -translate-x-1/2 rounded-full" style={{ top, background: "linear-gradient(135deg,#fff,#b9a6cf)", boxShadow: "inset 0 0 0 1px rgba(90,60,120,.35)" }}>
          <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-[#6a4f86]/70" />
        </span>
      ))}
      <span className="absolute left-1/2 top-[19px] -translate-x-1/2 text-[9px] font-extrabold tracking-widest text-[#7a5aa0]">ON</span>
      <span className="absolute bottom-[19px] left-1/2 -translate-x-1/2 text-[9px] font-extrabold tracking-widest text-[#7a5aa0]">OFF</span>
      {/* slot + lever */}
      <div
        className="absolute left-1/2 top-1/2 h-[76px] w-[38px] -translate-x-1/2 -translate-y-1/2"
        style={{ borderRadius: 10, background: "linear-gradient(180deg,#bba5d6,#d9c9ee)", boxShadow: "inset 0 4px 8px rgba(70,40,110,.45)", perspective: 200 }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[44px] w-[30px] -ml-[15px] -mt-[22px]"
          style={{
            borderRadius: 8,
            background: on ? "linear-gradient(180deg,#fff,#ffe2ee)" : "linear-gradient(180deg,#ffffff,#e2d4f2)",
            boxShadow: "0 6px 10px rgba(60,30,90,.4), inset 0 -4px 6px rgba(150,100,200,.3)",
          }}
          animate={{ y: on ? -15 : 15, rotateX: on ? 28 : -28 }}
          transition={{ type: "spring", stiffness: 520, damping: 22 }}
        />
      </div>
    </button>
  );
}
