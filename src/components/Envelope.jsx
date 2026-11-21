import { motion } from "framer-motion";
import Heart from "./Heart";

const PALETTES = {
  pink: {
    back: "linear-gradient(180deg,#ff9cc4 0%,#ffb3d0 100%)",
    left: "linear-gradient(100deg,#ffc7de 0%,#ffb0cf 100%)",
    right: "linear-gradient(260deg,#ffc7de 0%,#ffa8c9 100%)",
    bottom: "linear-gradient(0deg,#ffd9e8 0%,#ffc1d9 100%)",
    flap: "#ffbdd6",
    flapBack: "#ff93bb",
  },
  rose: {
    back: "linear-gradient(180deg,#ff86b6 0%,#ffa3c6 100%)",
    left: "linear-gradient(100deg,#ffb4d1 0%,#ff9bc0 100%)",
    right: "linear-gradient(260deg,#ffb4d1 0%,#ff90ba 100%)",
    bottom: "linear-gradient(0deg,#ffcde0 0%,#ffb0cf 100%)",
    flap: "#ffaccb",
    flapBack: "#ff7fae",
  },
};

function DefaultLetter() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-[6%] rounded-[6px]"
      style={{
        background: "linear-gradient(180deg,#fffdfb,#fff2f7)",
        boxShadow: "0 2px 8px rgba(190,60,110,.25)",
      }}
    >
      <div className="h-[6%] w-[62%] rounded-full bg-[#ffc6dc]" />
      <div className="h-[6%] w-[48%] rounded-full bg-[#ffd9e7]" />
      <Heart size={22} />
    </div>
  );
}

/**
 * A 3D-feeling envelope. `open` swings the flap up and slides the letter out.
 * Everything inside is sized in % so it scales with `width`.
 */
export default function Envelope({
  open = false,
  width = "min(78vw, 320px)",
  palette = "pink",
  letter,
  letterRise = 0.58,
  floating = true,
  glow = true,
  seal = true,
  behind,
  className = "",
  style,
}) {
  const p = PALETTES[palette] || PALETTES.pink;
  const radius = 10;

  return (
    <div className={`relative ${className}`} style={{ width, aspectRatio: "1.46", ...style }}>
      {glow && (
        <div
          className="animate-breathe pointer-events-none absolute -inset-[34%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,190,220,.55) 36%, rgba(255,190,220,0) 68%)",
          }}
        />
      )}

      {behind && <div className="absolute inset-0">{behind}</div>}

      <motion.div
        className="absolute inset-0"
        animate={floating ? { y: [0, -14, 0], rotate: [-2.5, 2.5, -2.5] } : { y: 0, rotate: 0 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ground shadow */}
        <div
          className="absolute left-[8%] right-[8%] -bottom-[16%] h-[12%] rounded-[50%]"
          style={{ background: "rgba(150,40,95,.22)", filter: "blur(10px)" }}
        />

        {/* back panel */}
        <div
          className="absolute inset-0"
          style={{
            background: p.back,
            borderRadius: radius,
            boxShadow: "0 26px 44px -14px rgba(190,50,110,.5), inset 0 -8px 18px rgba(190,50,110,.18)",
          }}
        />

        {/* the letter inside */}
        <motion.div
          className="absolute"
          style={{ left: "6.5%", right: "6.5%", top: "7%", bottom: "9%", zIndex: 2 }}
          animate={{ y: open ? `${-letterRise * 100}%` : "0%" }}
          transition={{ type: "spring", stiffness: 70, damping: 15, delay: open ? 0.55 : 0 }}
        >
          {letter ?? <DefaultLetter />}
        </motion.div>

        {/* front pockets */}
        <div className="absolute inset-0" style={{ zIndex: 3, filter: "drop-shadow(0 -3px 5px rgba(160,40,95,.22))" }}>
          <div className="absolute inset-0" style={{ background: p.left, borderRadius: radius, clipPath: "polygon(0 0, 52% 57%, 0 100%)" }} />
          <div className="absolute inset-0" style={{ background: p.right, borderRadius: radius, clipPath: "polygon(100% 0, 48% 57%, 100% 100%)" }} />
          <div className="absolute inset-0" style={{ background: p.bottom, borderRadius: radius, clipPath: "polygon(0 100%, 50% 52%, 100% 100%)" }} />
        </div>

        {/* flap – swings up in 3D */}
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{ height: "63%", transformOrigin: "50% 0%", transformPerspective: 900 }}
          initial={false}
          animate={{ rotateX: open ? 180 : 0, zIndex: open ? 1 : 5 }}
          transition={{
            rotateX: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
            zIndex: { duration: 0, delay: 0.32 },
          }}
        >
          <div style={{ filter: "drop-shadow(0 4px 5px rgba(160,40,95,.28))", height: "100%" }}>
            <motion.div
              className="h-full w-full"
              style={{ borderRadius: `${radius}px ${radius}px 0 0`, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              initial={false}
              animate={{ backgroundColor: open ? p.flapBack : p.flap }}
              transition={{ duration: 0.01, delay: open ? 0.34 : 0.34 }}
            >
              <div
                className="h-full w-full"
                style={{ background: "linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0) 60%)" }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* heart wax seal */}
        {seal && (
          <motion.div
            className="absolute left-1/2 top-[53%] w-[15%]"
            style={{ x: "-50%", y: "-50%", zIndex: 6 }}
            initial={false}
            animate={{ opacity: open ? 0 : 1, scale: open ? 0.3 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart size={100} from="#ff7fb0" to="#e8337a" style={{ width: "100%", height: "auto", filter: "drop-shadow(0 3px 4px rgba(150,20,80,.4))" }} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
