import { useId } from "react";

const THEMES = {
  pink: ["#ffd1e3", "#ff8fb8", "#ffe9a8"],
  rose: ["#ffb3cf", "#ff5f9b", "#ffe28a"],
  lilac: ["#efe0ff", "#b78bff", "#fff1a8"],
  peach: ["#ffe6d6", "#ffa987", "#fff0a0"],
  white: ["#ffffff", "#ffd1e3", "#ffd86b"],
};

/** A flower drawn as SVG *children* (a <g>) so it can be reused inside any <svg>. */
export function FlowerG({ cx = 0, cy = 0, r = 30, petals = 6, theme = "pink", gid, spin = false, delay = 0 }) {
  const [light, dark, mid] = THEMES[theme] || THEMES.pink;
  const pr = r * 0.52; // petal radius
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: spin
            ? `spin-slow ${30 + delay * 3}s linear infinite`
            : `sway ${4 + delay}s ease-in-out ${-delay}s infinite`,
        }}
      >
        {Array.from({ length: petals }, (_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy={-r * 0.58}
            rx={pr * 0.82}
            ry={pr * 1.12}
            fill={`url(#${gid})`}
            transform={`rotate(${(i * 360) / petals})`}
          />
        ))}
        <circle r={r * 0.34} fill={mid} />
        <circle r={r * 0.34} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth={r * 0.05} />
        <circle cx={-r * 0.1} cy={-r * 0.1} r={r * 0.09} fill="#fff" opacity=".7" />
      </g>
    </g>
  );
}

export function FlowerGradient({ id, theme = "pink" }) {
  const [light, dark] = THEMES[theme] || THEMES.pink;
  return (
    <radialGradient id={id} cx="50%" cy="85%" r="95%">
      <stop offset="0" stopColor={dark} />
      <stop offset="0.75" stopColor={light} />
      <stop offset="1" stopColor="#fff" />
    </radialGradient>
  );
}

export function Flower({ size = 60, theme = "pink", petals = 6, spin = true, className, style }) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <defs>
        <FlowerGradient id={gid} theme={theme} />
      </defs>
      <FlowerG r={44} petals={petals} theme={theme} gid={gid} spin={spin} />
    </svg>
  );
}

const LEAF = "#bfe8cf";
const LEAF_DARK = "#8fd3ad";

/** A bouquet that hugs a corner of the screen. position: bl | br | tl | tr */
export function FlowerCorner({ position = "bl", size = 190, className = "" }) {
  const gid = useId().replace(/:/g, "");
  const flip = {
    bl: "",
    br: "scaleX(-1)",
    tl: "scaleY(-1)",
    tr: "scale(-1,-1)",
  }[position];
  const place = {
    bl: "left-0 bottom-0",
    br: "right-0 bottom-0",
    tl: "left-0 top-0",
    tr: "right-0 top-0",
  }[position];
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={`pointer-events-none absolute ${place} ${className}`}
      style={{ transform: flip, overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <FlowerGradient id={`${gid}a`} theme="pink" />
        <FlowerGradient id={`${gid}b`} theme="rose" />
        <FlowerGradient id={`${gid}c`} theme="lilac" />
        <FlowerGradient id={`${gid}d`} theme="peach" />
      </defs>
      {/* stems */}
      <g stroke="#8fd3ad" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M8 240C20 200 40 150 70 140" />
        <path d="M30 240C60 215 110 195 150 185" />
        <path d="M5 230C10 170 20 120 36 82" />
      </g>
      {/* leaves */}
      {[
        [38, 205, -30, 24, 11],
        [92, 200, 20, 26, 12],
        [22, 150, -60, 22, 10],
        [118, 215, 10, 22, 10],
        [52, 128, -20, 20, 9],
      ].map(([x, y, rot, rx, ry], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={i % 2 ? LEAF : LEAF_DARK} transform={`rotate(${rot} ${x} ${y})`} />
      ))}
      <FlowerG cx={70} cy={140} r={36} petals={7} theme="pink" gid={`${gid}a`} delay={0} />
      <FlowerG cx={150} cy={185} r={28} petals={6} theme="rose" gid={`${gid}b`} delay={1} />
      <FlowerG cx={36} cy={80} r={25} petals={6} theme="lilac" gid={`${gid}c`} delay={2} />
      <FlowerG cx={112} cy={108} r={19} petals={5} theme="peach" gid={`${gid}d`} delay={1.5} />
      <FlowerG cx={190} cy={225} r={15} petals={5} theme="pink" gid={`${gid}a`} delay={0.5} />
    </svg>
  );
}

export default Flower;
