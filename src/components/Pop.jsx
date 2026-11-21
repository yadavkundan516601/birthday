import { motion } from "framer-motion";

/** Spring "pop in" wrapper – things bounce into the scene instead of fading. */
export default function Pop({
  show = true,
  delay = 0,
  from = { scale: 0, y: 60, opacity: 0 },
  origin = "50% 100%",
  stiffness = 240,
  damping = 13,
  className = "",
  style,
  children,
}) {
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: origin, ...style }}
      initial={from}
      animate={show ? { scale: 1, y: 0, x: 0, opacity: 1, rotate: 0 } : from}
      transition={{ type: "spring", stiffness, damping, delay: show ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}
