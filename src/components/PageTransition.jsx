import { motion } from "framer-motion";

/**
 * Wraps one scene. Scenes cross-fade with a soft zoom so nothing ever snaps.
 * The incoming scene sits on top and fades in while the outgoing one lingers,
 * then fades away underneath.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { delay: 0.7, duration: 0.4 } }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}
