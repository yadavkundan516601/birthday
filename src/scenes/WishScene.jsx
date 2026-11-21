import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import config from "../config";
import { useViewport, fluid } from "../hooks/useViewport";
import Backdrop from "../components/Backdrop";
import Sparkles from "../components/Sparkles";
import Fireflies from "../components/Fireflies";
import FloatingHearts from "../components/FloatingHearts";
import Magic3D from "../components/Magic3D";
import MiniCake from "../components/MiniCake";
import TeddyBear from "../components/TeddyBear";
import AnimatedText from "../components/AnimatedText";
import WordReveal from "../components/WordReveal";
import GlowButton from "../components/GlowButton";
import { FlowerCorner } from "../components/Flower";
import { useConfetti } from "../components/Confetti";

function ShootingStar({ delay = 0, top = "10%", left = "-10%", angle = 24, dx = "130vw", dy = "55vh" }) {
  return (
    <span
      className="pointer-events-none absolute z-20 block"
      style={{
        top,
        left,
        width: 150,
        height: 4,
        opacity: 0,
        animation: `shooting-star 1.7s cubic-bezier(.4,0,.8,.6) ${delay}s forwards`,
        "--angle": `${angle}deg`,
        "--dx": dx,
        "--dy": dy,
      }}
    >
      <span
        className="absolute inset-y-0 right-0 block rounded-full"
        style={{ width: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.95))" }}
      />
      <span
        className="absolute -right-1 -top-[5px] block h-[14px] w-[14px] rounded-full bg-white"
        style={{ boxShadow: "0 0 14px 6px rgba(255,240,170,.95), 0 0 34px 12px rgba(255,180,230,.6)" }}
      />
    </span>
  );
}

/** SCENE 5 · Close your eyes and make a wish 🌙 */
export default function WishScene({ onNext }) {
  const [phase, setPhase] = useState("ready"); // ready → wishing → sent → flying
  const { burst } = useConfetti();
  const { width } = useViewport();
  const bear = fluid(width, 40, 130, 200);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const wish = () => {
    if (phase !== "ready") return;
    setPhase("wishing");
    later(() => burst({ origin: { x: 0.5, y: 0.7 }, count: 50, spread: 360, power: 12, shapes: ["star", "heart"], scalar: 0.9 }), 400);
    later(() => setPhase("sent"), 2300);
    later(() => setPhase("flying"), 4300);
    later(onNext, 5900);
  };

  const wishing = phase !== "ready";

  return (
    <div className="absolute inset-0">
      <Backdrop tone="lavender" bokeh={8} />
      {/* the room slowly turns dreamy */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#2a1450 0%,#4a2670 55%,#7a3f8f 100%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: wishing ? 0.82 : 0 }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      />
      <Magic3D variant="stars" glow={wishing} />
      <Sparkles count={30} seed={12} />
      <Fireflies count={22} />
      <FloatingHearts count={8} seed={40} />
      <FlowerCorner position="bl" size={170} className="w-[30vw] max-w-[190px] h-auto" />
      <FlowerCorner position="br" size={170} className="w-[30vw] max-w-[190px] h-auto" />

      {phase === "wishing" && (
        <>
          <ShootingStar delay={0.6} />
          <ShootingStar delay={1.3} top="3%" left="-20%" angle={20} dy="40vh" />
        </>
      )}

      {/* bear + cake */}
      <motion.div
        className="absolute inset-x-0 bottom-[2%] flex items-end justify-center gap-3"
        animate={{ y: phase === "flying" ? 30 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <TeddyBear size={bear} mood="sit" eyes={wishing ? "happy" : "closed"} popDelay={0.5} />
        <div className="mb-1">
          <MiniCake size={bear * 0.86} lit />
        </div>
      </motion.div>

      <div className="safe-pad relative z-10 flex h-full flex-col items-center justify-start gap-3 pb-[34vh] pt-16 text-center sm:gap-5 sm:pt-20">
        <motion.div
          className="flex flex-col items-center gap-3 sm:gap-5"
          animate={{ opacity: wishing ? 0 : 1, y: wishing ? -24 : 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1 className="max-w-[14ch] text-balance font-script text-[clamp(2.6rem,11vw,4.8rem)] font-bold leading-[1.05] text-[#b02a78]" style={{ textShadow: "0 3px 16px rgba(255,255,255,.9)" }}>
            <AnimatedText text={config.texts.wishTitle} delay={0.3} wave />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="max-w-[24ch] text-balance text-lg font-bold text-[#7a3a78] sm:text-2xl"
          >
            {config.texts.wishPrompt}
          </motion.p>
          <div className="glass max-w-[24rem] rounded-[26px] px-5 py-4 sm:max-w-[30rem]">
            <WordReveal text={config.wishMessage} delay={2.6} stagger={0.07} className="text-[0.98rem] font-semibold leading-relaxed text-[#5b2a4c] sm:text-lg" />
          </div>
        </motion.div>

        <div className="h-16">
          <AnimatePresence>
            {!wishing && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.35, delay: 0 } }}
                transition={{ delay: 4.2, type: "spring", stiffness: 220, damping: 14 }}
              >
                <GlowButton variant="lilac" onClick={wish}>
                  {config.texts.wishButton}
                </GlowButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* "Your wish is on its way..." floats up and away */}
      <AnimatePresence>
        {(phase === "sent" || phase === "flying") && (
          <motion.div
            key="sent"
            className="pointer-events-none absolute inset-x-0 top-[34%] z-30 flex justify-center px-6"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={
              phase === "flying"
                ? { opacity: 0, scale: 0.7, y: -340 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={phase === "flying" ? { duration: 1.5, ease: "easeIn" } : { type: "spring", stiffness: 170, damping: 14 }}
          >
            <p
              className="max-w-[16ch] text-balance text-center font-script text-[clamp(2.6rem,11vw,4.6rem)] font-bold leading-[1.1] text-white"
              style={{ textShadow: "0 0 18px #ffb3e6, 0 0 42px #c58cff, 0 0 70px #ff7fd0" }}
            >
              {config.texts.wishSent}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
