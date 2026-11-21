import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import config from "../config";
import { useMusic } from "../hooks/useMusic";
import { useViewport, fluid } from "../hooks/useViewport";
import Backdrop from "../components/Backdrop";
import Envelope from "../components/Envelope";
import FloatingHearts from "../components/FloatingHearts";
import Sparkles from "../components/Sparkles";
import Magic3D from "../components/Magic3D";
import AnimatedText from "../components/AnimatedText";
import GlowButton from "../components/GlowButton";
import Panda from "../components/Panda";
import TeddyBear from "../components/TeddyBear";
import FlowerBurst from "../components/FlowerBurst";
import { useConfetti } from "../components/Confetti";

/** SCENE 1 · The mysterious birthday letter 💌 */
export default function WelcomeScene({ onNext }) {
  const [phase, setPhase] = useState("idle"); // idle → opening → leaving
  const [bloom, setBloom] = useState(false);
  const { burst } = useConfetti();
  const music = useMusic();
  const { width } = useViewport();
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const open = () => {
    if (phase !== "idle") return;
    music.start(); // first tap = permission to play music
    setPhase("opening");
    later(() => setBloom(true), 650);
    later(() => {
      burst({ origin: { x: 0.5, y: 0.52 }, count: 130, spread: 360, power: 21, scalar: 1.1 });
      burst({ origin: { x: 0, y: 0.75 }, count: 60, spread: 60, angle: 315, power: 26 });
      burst({ origin: { x: 1, y: 0.75 }, count: 60, spread: 60, angle: 225, power: 26 });
    }, 750);
    later(() => burst({ origin: { x: 0.5, y: 0.4 }, count: 70, spread: 360, power: 15, shapes: ["heart", "star"] }), 1900);
    later(() => setPhase("leaving"), 3700);
    later(() => onNext(), 4800);
  };

  const mate = fluid(width, 30, 92, 140);
  const opened = phase !== "idle";

  const popOut = (side) => ({
    initial: { left: "50%", top: "22%", scale: 0.15, opacity: 0, rotate: 0 },
    animate: opened
      ? {
          left: side === "l" ? "13%" : "87%",
          top: "-40%",
          scale: 1,
          opacity: 1,
          rotate: side === "l" ? -10 : 10,
        }
      : { left: "50%", top: "22%", scale: 0.15, opacity: 0, rotate: 0 },
    transition: { type: "spring", stiffness: 120, damping: 11, delay: side === "l" ? 0.75 : 0.9 },
  });

  return (
    <div className="absolute inset-0">
      <Backdrop tone="pink" />
      <Magic3D variant="hearts" />
      <FloatingHearts count={16} />
      <Sparkles count={26} />

      <div className="safe-pad relative z-10 flex h-full flex-col items-center justify-center gap-6 sm:gap-9">
        <motion.h1
          className="max-w-[20ch] text-balance px-2 text-center font-script text-[clamp(2.4rem,10.5vw,4.6rem)] font-bold leading-[1.1] text-[#c42a74]"
          style={{ textShadow: "0 3px 18px rgba(255,255,255,.9)" }}
          animate={{ opacity: opened ? 0 : 1, y: opened ? -28 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedText text={config.heroMessage} wave delay={0.35} stagger={0.05} />
        </motion.h1>

        <div className="relative mt-4 sm:mt-8">
          <Envelope
            open={opened}
            behind={
              <>
                <motion.div
                  className="absolute"
                  style={{ x: "-50%", y: "-50%" }}
                  {...popOut("l")}
                >
                  <Panda size={mate} mood="wave" popDelay={0} show={opened} />
                </motion.div>
                <motion.div
                  className="absolute"
                  style={{ x: "-50%", y: "-50%" }}
                  {...popOut("r")}
                >
                  <TeddyBear size={mate} mood="dance" popDelay={0} show={opened} />
                </motion.div>
              </>
            }
          />
          <FlowerBurst active={bloom} />
        </div>

        <div className="h-16">
          <AnimatePresence>
            {!opened && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 24, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6, y: 20, transition: { duration: 0.35, delay: 0 } }}
                transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 16 }}
              >
                <GlowButton onClick={open}>{config.texts.welcomeButton}</GlowButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* magical flood into the next scene */}
      {phase === "leaving" && (
        <motion.div
          className="absolute inset-0 z-40"
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{ duration: 1.05, ease: [0.6, 0, 0.3, 1] }}
          style={{ background: "radial-gradient(circle at 50% 50%, #ffffff 0%, #fff0f7 45%, #ffd6e8 100%)" }}
        />
      )}
    </div>
  );
}
