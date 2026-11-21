import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import config from "../config";
import { useViewport, fluid } from "../hooks/useViewport";
import { prefersReducedMotion } from "../lib/random";
import Backdrop from "../components/Backdrop";
import Balloons from "../components/Balloons";
import FairyLights from "../components/FairyLights";
import { FlowerCorner } from "../components/Flower";
import Sparkles from "../components/Sparkles";
import Fireflies from "../components/Fireflies";
import FloatingHearts from "../components/FloatingHearts";
import Sun from "../components/Sun";
import LightSwitch from "../components/LightSwitch";
import GlowButton from "../components/GlowButton";
import Panda from "../components/Panda";
import TeddyBear from "../components/TeddyBear";
import AnimatedText from "../components/AnimatedText";
import { useConfetti } from "../components/Confetti";

const SUN = "min(46vw, 230px)";

// The darkness is a night-sky layer with a soft circular hole that grows from the sun.
const maskImage =
  "radial-gradient(circle at var(--sx) var(--sy), transparent calc(var(--r) * 0.55), #000 var(--r))";

/** SCENE 2 · Turn on the magic 🌞 – a dark room that the sun floods with light (GSAP timeline). */
export default function LightsScene({ onNext }) {
  const nightRef = useRef(null);
  const sunRef = useRef(null);
  const introRef = useRef(null);
  const flashRef = useRef(null);
  const tlRef = useRef(null);
  const [lit, setLit] = useState(false);
  const [fairy, setFairy] = useState(false);
  const [room, setRoom] = useState(false);
  const [caption, setCaption] = useState(false);
  const { burst } = useConfetti();
  const { width } = useViewport();
  const mate = fluid(width, 21, 66, 130);

  useEffect(() => {
    gsap.set(nightRef.current, { "--r": "0vmax" });
    return () => tlRef.current?.kill();
  }, []);

  const switchOn = () => {
    if (lit) return;
    setLit(true);
    const radius = { r: 0 };
    const tl = gsap.timeline();
    tlRef.current = tl;

    // click flash + the intro text drifts away
    tl.fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.55, duration: 0.07, yoyo: true, repeat: 1 }, 0);
    tl.to(introRef.current, { opacity: 0, y: -40, scale: 0.94, duration: 0.7, ease: "power2.in" }, 0.25);

    // the sun rises in from the right-hand side of the screen
    tl.fromTo(
      sunRef.current,
      { xPercent: 150, yPercent: 90, scale: 0.55, opacity: 0 },
      { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, duration: 2.1, ease: "power3.out" },
      0.5,
    );

    // …and its light grows outwards, pushing the darkness back
    tl.to(
      radius,
      {
        r: 280,
        duration: 3.4,
        ease: "power2.in",
        onUpdate: () => nightRef.current?.style.setProperty("--r", `${radius.r}vmax`),
      },
      0.8,
    );

    // decorations switch on one after another
    tl.call(() => setFairy(true), null, 1.3);
    tl.call(() => setRoom(true), null, 3.0);
    tl.call(() => burst({ origin: { x: 0.85, y: 0.18 }, count: 60, spread: 360, power: 14, shapes: ["star", "circle"] }), null, 3.2);
    tl.to(nightRef.current, { opacity: 0, duration: 0.6 }, 4.1);
    tl.call(() => setCaption(true), null, 4.0);
    tl.call(() => burst({ origin: { x: 0.5, y: 0.55 }, count: 110, spread: 360, power: 18 }), null, 4.3);
    tl.call(onNext, null, 6.2);
    // keep the story moving for people who asked for less motion, just much faster
    if (prefersReducedMotion()) tl.timeScale(3);
  };

  return (
    <div className="absolute inset-0">
      {/* the lit room */}
      <Backdrop tone="pink" bokeh={8} />
      {/* floor + rug */}
      <div
        className="absolute inset-x-0 bottom-0 h-[16%]"
        style={{ background: "linear-gradient(180deg,#ffc2dc 0%,#ffa8cc 100%)", boxShadow: "inset 0 10px 30px rgba(255,255,255,.35)" }}
      />
      <div
        className="absolute bottom-[3%] left-1/2 h-[9%] w-[78%] max-w-[560px] -translate-x-1/2 rounded-[50%]"
        style={{ background: "radial-gradient(ellipse, #fff3f8 0%, #ffd0e3 70%)", boxShadow: "0 8px 24px rgba(190,50,110,.3)" }}
      />
      <FlowerCorner position="bl" size={200} className="w-[34vw] max-w-[210px] h-auto" />
      <FlowerCorner position="br" size={200} className="w-[34vw] max-w-[210px] h-auto" />

      {room && (
        <>
          <Balloons count={9} mode="rise" />
          <Sparkles count={24} />
          <FloatingHearts count={10} />
          <div className="absolute inset-x-0 bottom-[6%] flex items-end justify-center gap-[2vw]">
            <TeddyBear size={mate} item="balloon" popDelay={0.1} />
            <Panda size={mate * 1.1} mood="dance" popDelay={0.3} />
            <TeddyBear size={mate * 1.05} mood="wave" popDelay={0.5} flip />
            <Panda size={mate} item="balloon" itemColor={["#e6d6ff", "#b78bff"]} popDelay={0.7} flip />
          </div>
        </>
      )}

      {/* the darkness */}
      <div
        ref={nightRef}
        className="absolute inset-0"
        style={{
          WebkitMaskImage: maskImage,
          maskImage,
          "--sx": "calc(100% - 3% - min(23vw, 115px))",
          "--sy": "calc(6% + min(23vw, 115px))",
        }}
      >
        <Backdrop tone="night" bokeh={7} />
        <Sparkles count={36} seed={9} min={4} max={11} className="opacity-70" />
        <Fireflies count={14} />
      </div>

      <FairyLights on={fairy} className="z-20" />

      {/* the sun */}
      <div ref={sunRef} className="pointer-events-none absolute right-[3%] top-[6%] z-20 opacity-0" style={{ width: SUN, height: SUN }}>
        <Sun size="100%" style={{ width: "100%", height: "100%" }} />
      </div>

      {/* click flash */}
      <div ref={flashRef} className="pointer-events-none absolute inset-0 z-30 bg-white opacity-0" />

      {/* intro text + switch */}
      <div className="safe-pad absolute inset-0 z-30 flex flex-col items-center justify-center">
        <div ref={introRef} className="flex flex-col items-center gap-5 text-center sm:gap-6">
          <h1 className="font-script text-[clamp(2.8rem,12vw,5rem)] font-bold leading-none text-[#ffd7ec]" style={{ textShadow: "0 0 24px rgba(255,150,210,.75)" }}>
            <AnimatedText text={config.texts.lightsTitle} delay={0.3} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="max-w-[22ch] text-balance text-lg font-semibold text-[#e9d5ff] sm:text-xl"
          >
            {config.texts.lightsSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 15 }}
            className="mt-1"
          >
            <LightSwitch on={lit} onToggle={switchOn} disabled={lit} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.7 }}
          >
            <GlowButton variant="night" onClick={switchOn} disabled={lit}>
              {config.texts.lightsButton}
            </GlowButton>
          </motion.div>
        </div>

        <AnimatePresence>
          {caption && (
            <motion.h2
              key="reveal"
              className="absolute left-0 right-0 top-[17%] px-4 text-center font-script text-[clamp(3rem,13vw,5.5rem)] font-bold leading-none text-[#d62f80]"
              style={{ textShadow: "0 4px 22px rgba(255,255,255,.95)" }}
              initial={{ opacity: 0, scale: 0.4, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            >
              {config.texts.lightsReveal}
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
