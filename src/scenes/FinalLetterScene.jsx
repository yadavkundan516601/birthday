import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import config from "../config";
import { useViewport, fluid } from "../hooks/useViewport";
import Backdrop from "../components/Backdrop";
import Envelope from "../components/Envelope";
import LetterPaper from "../components/LetterPaper";
import Typewriter from "../components/Typewriter";
import Petals from "../components/Petals";
import FloatingHearts from "../components/FloatingHearts";
import Sparkles from "../components/Sparkles";
import Magic3D from "../components/Magic3D";
import GlowButton from "../components/GlowButton";
import Panda from "../components/Panda";
import TeddyBear from "../components/TeddyBear";
import AnimatedText from "../components/AnimatedText";
import { FlowerCorner } from "../components/Flower";
import { useConfetti } from "../components/Confetti";

/** SCENE 7 · The final animated love letter 💌 */
export default function FinalLetterScene({ onRestart }) {
  // intro → opening (envelope opens) → reading (paper unfolds) → typing → done
  const [phase, setPhase] = useState("intro");
  const { burst, rain } = useConfetti();
  const { width } = useViewport();
  const mate = fluid(width, 30, 92, 150);
  const paperRef = useRef(null);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const open = () => {
    if (phase !== "intro") return;
    setPhase("opening");
    burst({ origin: { x: 0.5, y: 0.5 }, count: 50, spread: 360, power: 13, shapes: ["heart"], scalar: 0.9 });
    later(() => setPhase("reading"), 2500);
  };

  const unfolded = useCallback(() => setPhase("typing"), []);
  const finished = useCallback(() => {
    setPhase("done");
    burst({ origin: { x: 0.5, y: 0.6 }, count: 160, spread: 360, power: 24, scalar: 1.15 });
    burst({ origin: { x: 0.05, y: 0.8 }, count: 60, spread: 55, angle: 320, power: 28 });
    burst({ origin: { x: 0.95, y: 0.8 }, count: 60, spread: 55, angle: 220, power: 28 });
    rain({ duration: 5000 });
  }, [burst, rain]);

  const reading = phase === "reading" || phase === "typing" || phase === "done";
  const done = phase === "done";

  return (
    <div className="absolute inset-0">
      <Backdrop tone="rose" bokeh={10} />
      <Magic3D variant="hearts" />
      <Petals count={18} />
      <FloatingHearts count={14} seed={77} />
      <Sparkles count={22} seed={31} />
      <FlowerCorner position="bl" size={180} className="w-[30vw] max-w-[200px] h-auto" />
      <FlowerCorner position="br" size={180} className="w-[30vw] max-w-[200px] h-auto" />

      {/* the crew – a teddy holding a little letter keeps her company */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-[2vw]">
        <TeddyBear size={mate} item="letter" mood="idle" popDelay={0.5} eyes={done ? "happy" : "open"} />
        <Panda size={mate} item="heart" mood={done ? "cheer" : "idle"} popDelay={0.7} flip eyes={done ? "happy" : "open"} />
      </div>
      {done && (
        <div className="absolute inset-x-0 bottom-0 hidden items-end justify-between px-[17vw] sm:flex">
          <TeddyBear size={mate * 0.85} mood="cheer" popDelay={0.4} bow="#b78bff" />
          <Panda size={mate * 0.85} mood="cheer" popDelay={0.6} flip />
        </div>
      )}

      <div className="safe-pad relative z-10 flex h-full flex-col items-center justify-center gap-4 pb-[15vh] pt-12 sm:gap-6 sm:pb-[18vh]">
        {/* intro */}
        <AnimatePresence>
          {phase === "intro" && (
            <motion.h1
              key="intro-title"
              className="max-w-[16ch] text-balance text-center font-script text-[clamp(2.4rem,10.5vw,4.4rem)] font-bold leading-[1.1] text-[#c42a74]"
              style={{ textShadow: "0 3px 18px rgba(255,255,255,.9)" }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.5 } }}
            >
              <AnimatedText text={config.texts.letterIntro} wave delay={0.3} stagger={0.045} />
            </motion.h1>
          )}
        </AnimatePresence>

        {/* one fixed stage: the envelope and the letter swap places inside it, so nothing jumps */}
        <div
          className="relative w-[min(92vw,560px)]"
          style={{
            height: reading ? (done ? "min(44dvh, 380px)" : "min(62dvh, 540px)") : "min(54vw, 222px)",
            transition: "height .9s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <AnimatePresence>
            {!reading && (
              <motion.div
                key="envelope"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.6, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: 160, transition: { duration: 0.8, ease: "easeIn" } }}
                transition={{ type: "spring", stiffness: 110, damping: 14, delay: 0.3 }}
              >
                <Envelope open={phase === "opening"} palette="rose" letterRise={0.62} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* the unfolding letter */}
          {reading && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.45, y: 80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <LetterPaper unfold onUnfolded={unfolded} ref={paperRef}>
                <p
                  className="relative font-script text-[1.45rem] font-semibold leading-[36px] text-[#6a2a58] sm:pl-3 sm:text-[1.7rem]"
                  style={{ textShadow: phase === "typing" ? "0 0 14px rgba(255,120,180,.45)" : "none", transition: "text-shadow .6s" }}
                >
                  <Typewriter
                    text={config.finalLetter}
                    active={phase === "typing" || done}
                    scrollRef={paperRef}
                    startDelay={500}
                    speed={46}
                    onDone={finished}
                  />
                </p>
              </LetterPaper>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {phase === "intro" && (
            <motion.div
              key="intro-btn"
              initial={{ opacity: 0, y: 20, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, y: 10, transition: { duration: 0.3, delay: 0 } }}
              transition={{ delay: 1.5, type: "spring", stiffness: 220, damping: 14 }}
            >
              <GlowButton onClick={open}>{config.texts.letterButton}</GlowButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* hearts drifting up while she reads */}
        {phase === "typing" && <FloatingHearts count={10} seed={5} speed={1.4} className="z-20" />}

        <AnimatePresence>
          {done && (
            <motion.div
              key="finale"
              className="flex flex-col items-center gap-3 text-center sm:gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="max-w-[16ch] text-balance font-script text-[clamp(2.2rem,9.5vw,3.8rem)] font-bold leading-[1.08] text-[#d62f80]" style={{ textShadow: "0 3px 18px rgba(255,255,255,.95)" }}>
                <AnimatedText text={config.texts.finalSmile} delay={0.7} stagger={0.045} />
              </h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, type: "spring", stiffness: 220, damping: 14 }}
              >
                <GlowButton variant="lilac" onClick={onRestart}>
                  {config.texts.replayButton}
                </GlowButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
