import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import config from "../config";
import { useViewport, fluid } from "../hooks/useViewport";
import Backdrop from "../components/Backdrop";
import Balloons from "../components/Balloons";
import BirthdayCake from "../components/BirthdayCake";
import FairyLights from "../components/FairyLights";
import { FlowerCorner } from "../components/Flower";
import Sparkles from "../components/Sparkles";
import FloatingHearts from "../components/FloatingHearts";
import GlowButton from "../components/GlowButton";
import Panda from "../components/Panda";
import TeddyBear from "../components/TeddyBear";
import AnimatedText from "../components/AnimatedText";
import { useConfetti } from "../components/Confetti";

/** SCENE 4 · The birthday cake surprise 🎂 */
export default function CakeScene({ onNext }) {
  const [lit, setLit] = useState(true);
  const [knife, setKnife] = useState("hidden"); // hidden → cutting → gone
  const [split, setSplit] = useState(false);
  const [cheer, setCheer] = useState(false);
  const [wishReady, setWishReady] = useState(false);
  const [started, setStarted] = useState(false);
  const { burst, rain } = useConfetti();
  const { width } = useViewport();
  const mate = fluid(width, 22, 78, 130);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const cut = () => {
    if (started) return;
    setStarted(true);
    setKnife("cutting"); //                                knife glides down the middle
    later(() => setLit(false), 480); //                     the candles go out as it passes
    later(() => {
      setSplit(true); //                                    the cake opens
      setKnife("gone");
      burst({ origin: { x: 0.5, y: 0.58 }, count: 150, spread: 360, power: 22, scalar: 1.1 });
      burst({ origin: { x: 0.05, y: 0.8 }, count: 55, spread: 55, angle: 320, power: 26 });
      burst({ origin: { x: 0.95, y: 0.8 }, count: 55, spread: 55, angle: 220, power: 26 });
    }, 1050);
    later(() => {
      setCheer(true);
      rain({ duration: 3200 });
    }, 1500);
    later(() => burst({ origin: { x: 0.5, y: 0.45 }, count: 80, spread: 360, power: 15, shapes: ["heart", "star"] }), 2300);
    later(() => setWishReady(true), 2900);
  };

  const wish = () => {
    burst({ origin: { x: 0.5, y: 0.8 }, count: 60, spread: 360, power: 15, shapes: ["star"] });
    later(onNext, 700);
  };

  return (
    <div className="absolute inset-0">
      <Backdrop tone="pink" bokeh={9} />
      <Balloons count={6} mode="bob" seed={14} size={[34, 56]} />
      <FloatingHearts count={10} seed={21} />
      <Sparkles count={24} seed={4} />
      <FairyLights on />
      <FlowerCorner position="bl" size={200} className="w-[34vw] max-w-[220px] h-auto" />
      <FlowerCorner position="br" size={200} className="w-[34vw] max-w-[220px] h-auto" />

      {/* bears by the cake */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-[2vw]">
        <TeddyBear size={mate} mood={cheer ? "cheer" : "wave"} popDelay={0.6} />
        <Panda size={mate} mood={cheer ? "cheer" : "idle"} popDelay={0.8} flip />
      </div>

      <div className="safe-pad relative z-10 flex h-full flex-col items-center justify-between gap-2 pb-[13vh] pt-14 text-center sm:pb-[16vh] sm:pt-16">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <h1 className="max-w-[18ch] text-balance font-script text-[clamp(2rem,8.6vw,3.6rem)] font-bold leading-[1.08] text-[#c42a74]" style={{ textShadow: "0 3px 16px rgba(255,255,255,.9)" }}>
            <AnimatedText text={config.cakeMessage} delay={0.3} stagger={0.04} />
          </h1>
          <AnimatePresence mode="wait">
            {!cheer ? (
              <motion.p
                key="q"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.25, delay: 0 } }}
                transition={{ delay: 1.6, duration: 0.7 }}
                className="text-lg font-bold text-[#8a3a6c] sm:text-xl"
              >
                {config.texts.cakeQuestion}
              </motion.p>
            ) : (
              <motion.p
                key="y"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 11 }}
                className="font-script text-4xl font-bold text-[#e0306f] sm:text-5xl"
              >
                {config.texts.cakeCelebration}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="relative"
          style={{ width: "min(98vw, 470px, 48dvh)" }}
          initial={{ opacity: 0, scale: 0.6, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120, damping: 14 }}
        >
          <div style={{ animation: started ? "none" : "float-y 5s ease-in-out infinite" }}>
            <BirthdayCake lit={lit} knife={knife} split={split} />
          </div>
        </motion.div>

        <div className="h-16">
          <AnimatePresence mode="wait">
            {!started && (
              <motion.div
                key="cut"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7, y: 10, transition: { duration: 0.3, delay: 0 } }}
                transition={{ delay: 2.0, type: "spring", stiffness: 220, damping: 15 }}
              >
                <GlowButton onClick={cut}>{config.texts.cakeCutButton}</GlowButton>
              </motion.div>
            )}
            {wishReady && (
              <motion.div
                key="wish"
                initial={{ opacity: 0, y: 24, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 13 }}
              >
                <GlowButton variant="lilac" onClick={wish}>
                  {config.texts.cakeWishButton}
                </GlowButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
