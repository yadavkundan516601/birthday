import { forwardRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PAPER = "linear-gradient(180deg,#fffdfa 0%,#fff6f1 100%)";

/**
 * A tri-fold letter that unfolds in 3D (bottom flap, then top flap) and then
 * becomes a scrollable sheet of ruled paper holding `children`.
 * Fills its parent – give the parent a width and a height.
 */
const LetterPaper = forwardRef(function LetterPaper({ unfold = false, onUnfolded, children, className = "" }, scrollRef) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!unfold) return;
    const t = window.setTimeout(() => {
      setReady(true);
      onUnfolded?.();
    }, 2150);
    return () => window.clearTimeout(t);
  }, [unfold, onUnfolded]);

  const panel = {
    position: "absolute",
    left: 0,
    right: 0,
    height: "33.4%",
    background: PAPER,
  };

  return (
    <div className={`relative h-full w-full ${className}`} style={{ perspective: 1600 }}>
      {/* the finished sheet */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto overscroll-contain rounded-[20px]"
        style={{
          background: PAPER,
          opacity: ready ? 1 : 0,
          transition: "opacity .45s ease",
          boxShadow: "0 30px 70px -20px rgba(190,40,110,.55), 0 0 0 1px rgba(255,170,205,.5)",
          scrollbarWidth: "thin",
          scrollbarColor: "#ffb3d0 transparent",
        }}
      >
        <div
          className="relative min-h-full px-6 pb-8 pt-8 sm:px-9"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 35px, rgba(255,150,190,.3) 36px)",
            backgroundPosition: "0 29px",
            backgroundAttachment: "local",
          }}
        >
          <div className="pointer-events-none absolute bottom-0 left-4 top-0 w-px bg-[rgba(255,120,170,.35)] sm:left-6" />
          {children}
        </div>
      </div>

      {/* the folded stack */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
          >
            <div
              style={{
                ...panel,
                top: "33.3%",
                borderRadius: 4,
                boxShadow: "0 18px 40px -14px rgba(190,40,110,.55)",
              }}
            />
            {/* bottom third folds up over the middle, then unfolds */}
            <motion.div
              style={{ ...panel, top: "66.6%", transformOrigin: "50% 0%", borderRadius: "0 0 20px 20px", boxShadow: "0 6px 14px rgba(150,40,90,.18)" }}
              initial={{ rotateX: 180 }}
              animate={{ rotateX: unfold ? 0 : 180 }}
              transition={{ duration: 0.95, delay: 0.1, ease: [0.45, 0.05, 0.25, 1] }}
            />
            {/* top third folds down over the middle, then unfolds */}
            <motion.div
              style={{ ...panel, top: 0, transformOrigin: "50% 100%", borderRadius: "20px 20px 0 0", boxShadow: "0 -6px 14px rgba(150,40,90,.14)" }}
              initial={{ rotateX: -180 }}
              animate={{ rotateX: unfold ? 0 : -180 }}
              transition={{ duration: 0.95, delay: 1.05, ease: [0.45, 0.05, 0.25, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default LetterPaper;
