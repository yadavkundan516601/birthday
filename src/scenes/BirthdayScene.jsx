import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import config from "../config";
import { useViewport, fluid } from "../hooks/useViewport";
import Backdrop from "../components/Backdrop";
import Balloons from "../components/Balloons";
import FairyLights from "../components/FairyLights";
import { FlowerCorner } from "../components/Flower";
import Sparkles from "../components/Sparkles";
import FloatingHearts from "../components/FloatingHearts";
import GlowButton from "../components/GlowButton";
import Panda from "../components/Panda";
import TeddyBear from "../components/TeddyBear";
import AnimatedText from "../components/AnimatedText";
import WordReveal from "../components/WordReveal";
import { ConfettiBurst, ConfettiRain, useConfetti } from "../components/Confetti";

/** SCENE 3 · The main birthday celebration 🎂 */
export default function BirthdayScene({ onNext }) {
  const [showButton, setShowButton] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { burst } = useConfetti();
  const { width } = useViewport();
  const big = fluid(width, 22, 66, 150);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => {
    // the message reads for a few seconds, then the button appears
    later(() => setShowButton(true), 4200 + config.mainBirthdayMessage.split(/\s+/).length * 55);
    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  const more = () => {
    if (leaving) return;
    setLeaving(true);
    burst({ origin: { x: 0.5, y: 0.75 }, count: 90, spread: 360, power: 17, shapes: ["heart", "star", "circle"] });
    later(onNext, 900);
  };

  return (
    <div className="absolute inset-0">
      <Backdrop tone="dawn" className="bg-pan" bokeh={10} />
      <Balloons count={10} mode="rise" seed={5} />
      <FloatingHearts count={12} seed={3} />
      <Sparkles count={28} seed={8} />
      <FairyLights on />
      <FlowerCorner position="bl" size={210} className="w-[36vw] max-w-[230px] h-auto" />
      <FlowerCorner position="br" size={210} className="w-[36vw] max-w-[230px] h-auto" />
      <FlowerCorner position="tl" size={140} className="z-0 w-[24vw] max-w-[150px] h-auto" />
      <FlowerCorner position="tr" size={140} className="z-0 w-[24vw] max-w-[150px] h-auto" />

      <ConfettiBurst delay={500} origin={{ x: 0.5, y: 0.35 }} count={90} power={18} />
      <ConfettiRain first={2200} every={7000} />

      {/* dancing crew */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-[1vw] pb-1">
        <TeddyBear size={big} item="balloon" popDelay={0.5} />
        <Panda size={big * 1.12} mood="dance" popDelay={0.7} />
        <TeddyBear size={big * 1.05} mood="dance" popDelay={0.9} flip bow="#b78bff" />
        <Panda size={big} item="balloon" itemColor={["#fff4b8", "#ffd35e"]} popDelay={1.1} flip />
      </div>

      <motion.div
        className="safe-pad relative z-10 flex h-full flex-col items-center justify-center gap-3 pb-[22vh] pt-14 text-center sm:gap-5 sm:pb-[26vh]"
        animate={leaving ? { opacity: 0, scale: 1.08, y: -20 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeIn" }}
      >
        {config.birthdayDate && (
          <motion.span
            initial={{ opacity: 0, y: -14, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 14 }}
            className="rounded-full border border-white/80 bg-white/55 px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#c42a74] backdrop-blur-md"
          >
            ✨ {config.birthdayDate.toUpperCase()} ✨
          </motion.span>
        )}

        <h1 className="max-w-[14ch] text-balance font-script text-[clamp(3rem,14vw,6.4rem)] font-bold leading-[1.02]" style={{ filter: "drop-shadow(0 4px 14px rgba(255,255,255,.8))" }}>
          <AnimatedText text={config.texts.birthdayTitle} delay={0.5} stagger={0.055} letterClassName="text-shine" />
        </h1>

        <motion.div
          className="glass max-w-[26rem] rounded-[28px] px-5 py-4 sm:max-w-[34rem] sm:px-8 sm:py-6"
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <WordReveal
            text={config.mainBirthdayMessage}
            delay={2.2}
            stagger={0.055}
            className="text-[0.98rem] font-semibold leading-relaxed text-[#5b2a4c] sm:text-lg"
          />
        </motion.div>

        <div className="h-16">
          <AnimatePresence>
            {showButton && !leaving && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3, delay: 0 } }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
              >
                <GlowButton onClick={more}>{config.texts.birthdayButton}</GlowButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
