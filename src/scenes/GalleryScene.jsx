import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import config from "../config";
import Backdrop from "../components/Backdrop";
import Sparkles from "../components/Sparkles";
import FloatingHearts from "../components/FloatingHearts";
import Carousel3D from "../components/Carousel3D";
import GlowButton from "../components/GlowButton";
import AnimatedText from "../components/AnimatedText";
import { FlowerCorner } from "../components/Flower";
import { useConfetti } from "../components/Confetti";

/** SCENE 6 · The cute photo gallery 🐰 (photos come from birthdayConfig.galleryImages) */
export default function GalleryScene({ onNext }) {
  const { burst } = useConfetti();
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const go = () => {
    if (leaving) return;
    setLeaving(true);
    burst({ origin: { x: 0.5, y: 0.85 }, count: 70, spread: 360, power: 16, shapes: ["heart", "star"] });
    timer.current = window.setTimeout(onNext, 800);
  };

  return (
    <div className="absolute inset-0">
      <Backdrop tone="rose" bokeh={10} />
      <FloatingHearts count={18} seed={61} />
      <Sparkles count={26} seed={17} />
      <FlowerCorner position="tl" size={150} className="w-[26vw] max-w-[170px] h-auto" />
      <FlowerCorner position="tr" size={150} className="w-[26vw] max-w-[170px] h-auto" />
      <FlowerCorner position="bl" size={170} className="w-[28vw] max-w-[190px] h-auto" />
      <FlowerCorner position="br" size={170} className="w-[28vw] max-w-[190px] h-auto" />

      <motion.div
        className="safe-pad relative z-10 flex h-full flex-col items-center justify-between gap-1 pb-24 pt-12 text-center sm:pt-14"
        animate={leaving ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <h1 className="max-w-[18ch] text-balance font-script text-[clamp(2rem,8.4vw,3.6rem)] font-bold leading-[1.05] text-[#c42a74]" style={{ textShadow: "0 3px 16px rgba(255,255,255,.9)" }}>
            <AnimatedText text={config.texts.galleryTitle} delay={0.2} stagger={0.035} />
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 180, damping: 15 }}
            className="glass max-w-[22rem] rounded-[22px] px-4 py-2.5 text-[0.9rem] font-bold leading-snug text-[#5b2a4c] sm:max-w-[30rem] sm:text-base"
          >
            {config.galleryMessage}
          </motion.div>
        </div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Carousel3D items={config.galleryImages} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.8, type: "spring", stiffness: 220, damping: 15 }}
        >
          <GlowButton onClick={go}>{config.texts.galleryButton}</GlowButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
