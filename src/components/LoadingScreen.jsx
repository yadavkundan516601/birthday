import { useEffect } from "react";
import { motion } from "framer-motion";
import config from "../config";
import Backdrop from "./Backdrop";
import Heart from "./Heart";
import Panda from "./Panda";
import TeddyBear from "./TeddyBear";
import { preload3D } from "./Magic3D";

/** Cute first screen while fonts, photos and the 3D chunk finish loading. */
export default function LoadingScreen({ onDone }) {
  useEffect(() => {
    let cancelled = false;
    const photos = config.galleryImages.map(
      (i) =>
        new Promise((res) => {
          const im = new Image();
          im.onload = im.onerror = res;
          im.src = i.src;
        }),
    );
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const warm = config.effects.threeD !== false ? preload3D().catch(() => {}) : Promise.resolve();
    const minimum = new Promise((r) => setTimeout(r, 2100));
    const ceiling = new Promise((r) => setTimeout(r, 6500));

    Promise.race([Promise.all([...photos, fonts, warm, minimum]), ceiling]).then(() => {
      if (!cancelled) onDone();
    });
    return () => {
      cancelled = true;
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.7, ease: "easeInOut" } }}
    >
      <Backdrop tone="pink" />
      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <div className="flex items-end gap-2">
          <Panda size={112} mood="dance" popDelay={0.1} />
          <TeddyBear size={112} mood="dance" popDelay={0.25} />
        </div>
        <p className="font-script text-3xl font-semibold text-[#c42a74] sm:text-4xl">{config.texts.loadingMessage}</p>
        <div className="flex items-center gap-2.5" role="progressbar" aria-label="Loading">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ animation: `float-y 1.1s ease-in-out ${i * 0.15}s infinite` }}>
              <Heart size={24} />
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
