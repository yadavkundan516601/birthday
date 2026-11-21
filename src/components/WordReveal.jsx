import { motion } from "framer-motion";

/** Reveals text word by word (soft blur → sharp). */
export default function WordReveal({ text, delay = 0, stagger = 0.07, className = "" }) {
  const words = String(text).split(/\s+/);
  return (
    <motion.p className={className} initial="hidden" animate="show" aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
            show: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.55, delay: delay + i * stagger, ease: "easeOut" },
            },
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}
