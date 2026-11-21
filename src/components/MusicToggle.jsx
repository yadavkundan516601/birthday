import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import config from "../config";
import { useMusic } from "../hooks/useMusic";

/** The little speaker bubble in the corner. Hidden if music is switched off in the config. */
export default function MusicToggle({ visible = true }) {
  const { available, playing, toggle } = useMusic();
  if (!available) return null;
  const label = playing ? config.texts.musicOnLabel : config.texts.musicOffLabel;
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toggle}
          aria-label={label}
          title={label}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
          className="fixed z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/55 text-[#ff4f93] shadow-lg outline-none backdrop-blur-md focus-visible:ring-4 focus-visible:ring-white/80"
          style={{ top: "max(0.9rem, env(safe-area-inset-top))", right: "max(0.9rem, env(safe-area-inset-right))" }}
        >
          {playing ? <Volume2 size={22} strokeWidth={2.4} /> : <VolumeX size={22} strokeWidth={2.4} />}
          {playing && (
            <span className="absolute inset-0 rounded-full border-2 border-[#ff8fb8]/60" style={{ animation: "breathe 2.4s ease-in-out infinite" }} />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
