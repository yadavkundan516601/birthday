import { motion } from "framer-motion";

/**
 * Splits text into letters that spring in one-by-one, then (optionally) keep
 * gently waving. Words never break mid-word. `as` lets you pick the tag.
 */
export default function AnimatedText({
  text,
  as: Tag = "span",
  delay = 0,
  stagger = 0.045,
  wave = false,
  className = "",
  letterClassName = "",
}) {
  const MotionTag = motion[Tag] || motion.span;
  const words = String(text).split(" ");
  let n = 0;
  return (
    <MotionTag className={className} aria-label={text} initial="hidden" animate="show">
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {Array.from(word).map((ch, ci) => {
            const i = n++;
            return (
              <motion.span
                key={ci}
                className={`inline-block ${letterClassName}`}
                variants={{
                  hidden: { opacity: 0, y: 36, scale: 0.4, rotate: -12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    transition: { type: "spring", stiffness: 260, damping: 12, delay: delay + i * stagger },
                  },
                }}
              >
                {wave ? (
                  <span
                    className="inline-block"
                    style={{ animation: `float-y 3.2s ease-in-out ${(i * 0.12).toFixed(2)}s infinite` }}
                  >
                    {ch}
                  </span>
                ) : (
                  ch
                )}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block w-[0.3em]">{" "}</span>}
        </span>
      ))}
    </MotionTag>
  );
}
