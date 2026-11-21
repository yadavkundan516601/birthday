// Shared bits for the teddy bears and pandas: arm poses and the things they hold.
// Everything is drawn in the characters' own 200 x 250 coordinate space.

export const LIMB_ANGLES = {
  rest: { l: 14, r: -14 },
  wave: { l: 14, r: -150 },
  hug: { l: -38, r: 38 },
  up: { l: 150, r: -150 },
};

/** Arm angles (degrees, clockwise from "hanging down") for a mood + held item. */
export function poseFor(mood, item) {
  if (item === "balloon") return { l: 14, r: -150 };
  if (item === "letter" || item === "heart") return LIMB_ANGLES.hug;
  if (mood === "wave") return LIMB_ANGLES.wave;
  if (mood === "sit") return { l: 10, r: -10 };
  return LIMB_ANGLES.rest;
}

/** Things a character can hold: "balloon" | "letter" | "heart". `hand` = fur colour for the mitts. */
export function HeldItem({ item, uid, hand = "#e8b184", color = ["#ffd1e3", "#ff8fb8"] }) {
  if (item === "balloon") {
    return (
      <g className="held-sway">
        <defs>
          <radialGradient id={`${uid}-bal`} cx="35%" cy="28%" r="80%">
            <stop offset="0" stopColor="#fff" stopOpacity=".95" />
            <stop offset="0.18" stopColor={color[0]} />
            <stop offset="1" stopColor={color[1]} />
          </radialGradient>
        </defs>
        <path d="M185 86C177 62 197 44 192 22" stroke="#fff" strokeOpacity=".9" strokeWidth="1.8" fill="none" />
        <ellipse cx="194" cy="-8" rx="27" ry="32" fill={`url(#${uid}-bal)`} />
        <path d="M194 23 188.5 32h11Z" fill={color[1]} />
        <ellipse cx="183" cy="-21" rx="6" ry="10.5" fill="#fff" opacity=".55" transform="rotate(24 183 -21)" />
      </g>
    );
  }

  if (item === "letter") {
    return (
      <g>
        <g transform="translate(100 186) rotate(-4)">
          <rect x="-32" y="-22" width="64" height="44" rx="6" fill="#fffafc" stroke="#ffb3cf" strokeWidth="2.2" />
          <path d="M-31 -20 0 4 31 -20" fill="none" stroke="#ffb3cf" strokeWidth="2.2" strokeLinejoin="round" />
          <path
            d="M0 16c-7-5.5-10-8.5-10-12.5C-10-0 -6-2 0 2.5 6-2 10 0 10 3.5 10 7.5 7 10.5 0 16Z"
            transform="translate(0 -3) scale(.9)"
            fill="#ff6fa5"
          />
        </g>
        <circle cx="74" cy="199" r="11.5" fill={hand} />
        <circle cx="126" cy="199" r="11.5" fill={hand} />
      </g>
    );
  }

  if (item === "heart") {
    return (
      <g>
        <defs>
          <linearGradient id={`${uid}-hrt`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff9ec5" />
            <stop offset="1" stopColor="#ff4f93" />
          </linearGradient>
        </defs>
        <g transform="translate(100 186) scale(2.7)">
          <path
            d="M0 9.5C-8 3.5 -11 .5 -11 -3.5 -11 -7 -8.5 -9.5 -5.5 -9.5 -3 -9.5 -1 -8.3 0 -6.5 1 -8.3 3 -9.5 5.5 -9.5 8.5 -9.5 11 -7 11 -3.5 11 .5 8 3.5 0 9.5Z"
            fill={`url(#${uid}-hrt)`}
          />
          <ellipse cx="-5.5" cy="-5.5" rx="2.4" ry="1.4" fill="#fff" opacity=".6" transform="rotate(-30 -5.5 -5.5)" />
        </g>
        <circle cx="72" cy="196" r="11.5" fill={hand} />
        <circle cx="128" cy="196" r="11.5" fill={hand} />
      </g>
    );
  }
  return null;
}

/** Eyes: "open" (blinking, shiny), "closed" (sleepy ◡) or "happy" (^ ^). */
export function Eyes({ mode = "open", y = 78, dx = 22, fill = "#3b2330" }) {
  const xs = [100 - dx, 100 + dx];
  if (mode === "closed" || mode === "happy") {
    const dip = mode === "closed" ? 6 : -6;
    return (
      <g stroke={fill} strokeWidth="3.2" strokeLinecap="round" fill="none">
        {xs.map((x) => (
          <path key={x} d={`M${x - 8} ${y} Q${x} ${y + dip * 1.7} ${x + 8} ${y}`} />
        ))}
        {/* lashes */}
        <path d={`M${xs[0] - 9} ${y - 1} l-5 -3`} strokeWidth="2.2" />
        <path d={`M${xs[1] + 9} ${y - 1} l5 -3`} strokeWidth="2.2" />
      </g>
    );
  }
  return (
    <g>
      {xs.map((x, i) => (
        <g key={x} className="blink">
          <ellipse cx={x} cy={y} rx="6.6" ry="7.4" fill={fill} />
          <circle cx={x - 2.4} cy={y - 2.8} r="2.7" fill="#fff" />
          <circle cx={x + 2.4} cy={y + 2.6} r="1.3" fill="#fff" opacity=".85" />
          <path
            d={i === 0 ? `M${x - 7} ${y - 4} l-5.5 -3.2` : `M${x + 7} ${y - 4} l5.5 -3.2`}
            stroke={fill}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
}

/** A little ribbon bow. */
export function Bow({ x, y, scale = 1, color = "#ff7eb0", dark = "#ee4d8a", rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0C-10-14 -26-12 -26 0 -26 12 -10 14 0 0Z" fill={color} />
      <path d="M0 0C10-14 26-12 26 0 26 12 10 14 0 0Z" fill={color} />
      <path d="M-14-6C-18-3 -18 3 -14 6M14-6C18-3 18 3 14 6" stroke={dark} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".55" />
      <circle r="6" fill={dark} />
      <ellipse cx="-1.5" cy="-2" rx="2.4" ry="1.6" fill="#fff" opacity=".55" />
    </g>
  );
}
