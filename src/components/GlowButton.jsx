import { motion } from "framer-motion";
import { useConfetti } from "./Confetti";

const VARIANTS = {
  pink: "bg-[linear-gradient(135deg,#ff7eb3_0%,#ff5c9a_55%,#ff8fb8_100%)] text-white",
  lilac: "bg-[linear-gradient(135deg,#b78bff_0%,#e08bff_55%,#ff8fd0_100%)] text-white",
  peach: "bg-[linear-gradient(135deg,#ff9f7a_0%,#ff7aa8_100%)] text-white",
  night: "bg-[linear-gradient(135deg,#ffd479_0%,#ff9fb8_60%,#ff7ab3_100%)] text-[#4a1d3d]",
};

/**
 * The big, glowing, touch-friendly story button. It pops a little cloud of
 * hearts/sparkles from itself on every tap.
 */
export default function GlowButton({
  children,
  onClick,
  variant = "pink",
  disabled = false,
  burst = true,
  className = "",
  ...rest
}) {
  const { burst: fire } = useConfetti();

  const handleClick = (e) => {
    if (disabled) return;
    if (burst) {
      const r = e.currentTarget.getBoundingClientRect();
      fire({
        origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
        count: 26,
        spread: 150,
        angle: 270,
        power: 11,
        scalar: 0.8,
        shapes: ["heart", "star", "circle"],
        life: 90,
      });
    }
    onClick?.(e);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className={`glow-btn relative inline-flex min-h-14 select-none items-center justify-center gap-2 overflow-hidden rounded-full border border-white/60 px-8 py-3.5 text-[1.05rem] font-bold tracking-wide shadow-xl outline-none focus-visible:ring-4 focus-visible:ring-white/80 sm:px-10 sm:text-lg ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(120,20,70,0.25)]">{children}</span>
    </motion.button>
  );
}
