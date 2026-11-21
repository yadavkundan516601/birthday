import { useId, useMemo } from "react";
import { makeRand } from "../lib/random";

const CX = 200;
const SPRINKLES = ["#ff6fa5", "#ffd86b", "#9fe3ff", "#b78bff", "#7fe0a8", "#ffffff"];

/** y on the front lower rim of a cylinder (centre cx, radius rx, ry) at horizontal position x */
const rim = (x, cy, rx, ry) => cy + ry * Math.sqrt(Math.max(0, 1 - ((x - CX) / rx) ** 2));

function Strawberry({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 14C-12 8 -13 -6 -7 -10 -3 -12 3 -12 7 -10 13 -6 12 8 0 14Z" fill="url(#STRAW)" />
      <g fill="#ffe9b5" opacity=".9">
        <ellipse cx="-4" cy="-2" rx="1" ry="1.5" />
        <ellipse cx="3" cy="-3" rx="1" ry="1.5" />
        <ellipse cx="0" cy="3" rx="1" ry="1.5" />
        <ellipse cx="-5" cy="5" rx="1" ry="1.5" />
        <ellipse cx="5" cy="4" rx="1" ry="1.5" />
      </g>
      <path d="M0-10C-7-17 -11-12 -9-10 -6-8 -3-10 0-10 3-10 6-8 9-10 11-12 7-17 0-10ZM0-10 0-16" fill="#7fdba0" stroke="#5cc58a" strokeWidth="1" />
      <ellipse cx="-4.5" cy="-5" rx="2.2" ry="3.4" fill="#fff" opacity=".45" transform="rotate(20 -4.5 -5)" />
    </g>
  );
}

function Candle({ x, y, color, lit, smoke }) {
  return (
    <g>
      {/* flame (scales to nothing when blown out) */}
      <g style={{ transform: lit ? "scale(1)" : "scale(0)", transformOrigin: `${x}px ${y - 42}px`, transition: "transform .35s cubic-bezier(.5,0,.8,.4)" }}>
        <circle cx={x} cy={y - 51} r="15" fill="url(#GLOW)" style={{ animation: "flame-glow 1.6s ease-in-out infinite", transformOrigin: `${x}px ${y - 51}px` }} />
        <g style={{ animation: `flame ${0.9 + (x % 7) * 0.05}s ease-in-out infinite`, transformOrigin: `${x}px ${y - 42}px` }}>
          <path d={`M${x} ${y - 70}C${x + 8} ${y - 58} ${x + 9} ${y - 47} ${x} ${y - 43}C${x - 9} ${y - 47} ${x - 8} ${y - 58} ${x} ${y - 70}Z`} fill="url(#FLAME)" />
          <path d={`M${x} ${y - 58}C${x + 3} ${y - 53} ${x + 3} ${y - 48} ${x} ${y - 46}C${x - 3} ${y - 48} ${x - 3} ${y - 53} ${x} ${y - 58}Z`} fill="#fff8d6" />
        </g>
      </g>
      {/* little smoke wisps */}
      {smoke &&
        [0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={x}
            cy={y - 46}
            r={3 + i}
            fill="#fff"
            opacity="0"
            style={{ animation: `smoke 1.9s ease-out ${i * 0.35}s both`, "--sx": `${(i - 1) * 8}px` }}
          />
        ))}
    </g>
  );
}

/**
 * The big, pink, three-tier birthday cake.
 *  lit    – candle flames on/off
 *  knife  – "hidden" | "cutting" | "gone"
 *  split  – cake is cut in two and the halves slide apart
 */
export default function BirthdayCake({ lit = true, knife = "hidden", split = false, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const r = useMemo(() => makeRand(9), []);

  const drips = useMemo(() => {
    const out = [];
    const tiers = [
      { cy: 232, rx: 150, ry: 30, from: 66, to: 334, gap: 36 },
      { cy: 162, rx: 105, ry: 23, from: 106, to: 294, gap: 31 },
      { cy: 118, rx: 62, ry: 15, from: 150, to: 250, gap: 25 },
    ];
    const rr = makeRand(4);
    tiers.forEach((t) => {
      for (let x = t.from; x <= t.to; x += t.gap) {
        if (Math.abs(x - CX) < 6) continue;
        const len = rr.range(10, 26);
        const w = rr.range(10, 14);
        const y1 = rim(x - w, t.cy, t.rx, t.ry);
        const y2 = rim(x + w, t.cy, t.rx, t.ry);
        const yb = Math.max(y1, y2) + len;
        out.push(`M${x - w} ${y1 - 3}L${x - w} ${yb - w}Q${x - w} ${yb + 4} ${x} ${yb + 4}Q${x + w} ${yb + 4} ${x + w} ${yb - w}L${x + w} ${y2 - 3}Z`);
      }
    });
    return out;
  }, []);

  const pearls = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        const th = (Math.PI * (i + 0.5)) / 15;
        const x = CX + 150 * Math.cos(th);
        return { x, y: 322 + 30 * Math.sin(th) - 1 };
      }).filter((p) => Math.abs(p.x - CX) > 6),
    [],
  );

  const sprinkles = useMemo(
    () =>
      Array.from({ length: 34 }, () => {
        const x = r.range(62, 338);
        return { x, y: r.range(rim(x, 232, 150, 30) + 10, rim(x, 322, 150, 30) - 12), rot: r.range(0, 180), c: r.pick(SPRINKLES) };
      }).filter((s) => Math.abs(s.x - CX) > 8),
    [r],
  );

  const bandHearts = useMemo(
    () =>
      [14, 36, 58, 122, 144, 166].map((deg) => {
        const th = (deg * Math.PI) / 180;
        return { x: CX + 98 * Math.cos(th), y: 198 + 21 * Math.sin(th) };
      }),
    [],
  );

  const berries = useMemo(
    () =>
      [-135, -95, -45, 45, 95, 135].map((dx) => ({
        x: CX + dx,
        y: rim(CX + dx, 322, 150, 30) - 5,
        s: 1.18,
      })),
    [],
  );

  const crumbs = useMemo(() => {
    const rr = makeRand(31);
    return Array.from({ length: 26 }, () => ({
      x: rr.range(165, 235),
      y: rr.range(236, 330),
      cx: rr.range(-70, 70),
      cy: rr.range(60, 130),
      cr: rr.range(-300, 300),
      d: rr.range(0, 0.7),
      size: rr.range(2.5, 5),
      c: rr.pick(["#ffe2b0", "#ffd0e0", "#fff5f8", "#ffb8d2", "#f6c98a"]),
    }));
  }, []);

  const half = (side) => {
    const dir = side === "l" ? -1 : 1;
    return {
      transform: split ? `translate(${dir * 50}px, 8px) rotate(${dir * 5}deg)` : "translate(0,0) rotate(0)",
      transformOrigin: `${side === "l" ? 50 : 350}px 350px`,
      transition: "transform 1.15s cubic-bezier(.3,1.5,.5,1)",
    };
  };

  const knifeStyle = {
    hidden: { transform: "translateY(0px)", opacity: 0 },
    cutting: { transform: "translateY(300px)", opacity: 1 },
    gone: { transform: "translateY(-30px) rotate(10deg)", opacity: 0 },
  }[knife];

  const candles = [
    { x: 158, c: ["#ffd1e3", "#ff8fb8"] },
    { x: 183, c: ["#e6d6ff", "#b78bff"] },
    { x: 217, c: ["#fff1b8", "#ffc94d"] },
    { x: 242, c: ["#d6f1ff", "#7fc6ee"] },
  ];

  /* the artwork is defined once and drawn twice (left / right half) */
  const art = (
    <g id={`${uid}-art`}>
      {/* tier 1 */}
      <path d="M50 232V322A150 30 0 0 0 350 322V232Z" fill={`url(#${uid}-t1)`} />
      <ellipse cx={CX} cy="232" rx="150" ry="30" fill={`url(#${uid}-top)`} />
      {sprinkles.map((s, i) => (
        <rect key={i} x={s.x - 3} y={s.y - 1.1} width="6" height="2.2" rx="1.1" fill={s.c} transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
      ))}
      <g fill="#fff9fb">
        {drips.slice(0, Math.ceil(drips.length * 0.55)).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {pearls.filter((p) => berries.every((b) => Math.abs(b.x - p.x) > 17)).map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6.5" fill="#fff" />
          <circle cx={p.x - 1.8} cy={p.y - 2} r="2" fill="#ffd9e7" />
        </g>
      ))}
      {berries.map((b, i) => (
        <Strawberry key={i} x={b.x} y={b.y} s={b.s} />
      ))}

      {/* tier 2 */}
      <path d="M95 162V236A105 23 0 0 0 305 236V162Z" fill={`url(#${uid}-t2)`} />
      <ellipse cx={CX} cy="162" rx="105" ry="23" fill={`url(#${uid}-top)`} />
      <path d="M95 190A105 23 0 0 0 305 190V204A105 23 0 0 1 95 204Z" fill="#e6d6ff" />
      <path d="M95 190A105 23 0 0 0 305 190" stroke="#fff" strokeWidth="2" fill="none" opacity=".8" />
      {bandHearts.map((h, i) => (
        <path key={i} d="M0 5C-5 1.5 -7 .2 -7 -2.2 -7 -4.2 -5.5 -5.6 -3.7 -5.6 -2 -5.6 -.7 -4.8 0 -3.6 .7 -4.8 2 -5.6 3.7 -5.6 5.5 -5.6 7 -4.2 7 -2.2 7 .2 5 1.5 0 5Z" fill="#fff" transform={`translate(${h.x} ${h.y + 0.5})`} />
      ))}
      <g fill="#fff9fb">
        {drips.slice(Math.ceil(drips.length * 0.55)).filter((_, i) => i % 1 === 0).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* tier 3 */}
      <path d="M138 118V166A62 15 0 0 0 262 166V118Z" fill={`url(#${uid}-t3)`} />
      <ellipse cx={CX} cy="118" rx="62" ry="15" fill={`url(#${uid}-top)`} />

      {/* whipped cream dollops around tier 2 & 3 rims */}
      {[22, 52, 128, 158].map((deg) => {
        const th = (deg * Math.PI) / 180;
        const x = CX + 90 * Math.cos(th);
        const y = 162 + 17 * Math.sin(th);
        return (
          <g key={deg}>
            <ellipse cx={x} cy={y + 2} rx="9" ry="6" fill="#fff" />
            <ellipse cx={x} cy={y - 3} rx="6" ry="5" fill="#fff" />
            <ellipse cx={x} cy={y - 7} rx="3.2" ry="3.2" fill="#fff" />
            <circle cx={x} cy={y - 4} r="1.6" fill="#ffd1e3" />
          </g>
        );
      })}
      {candles.map((c) => (
        <ellipse key={c.x} cx={c.x} cy="120" rx="8" ry="3.4" fill="#e9a8c5" opacity=".6" />
      ))}
      {candles.map((c) => (
        <g key={c.x}>
          <rect x={c.x - 4.5} y={82} width="9" height="40" rx="3" fill={c.c[0]} />
          <path d={`M${c.x - 4.5} 90l9 -5M${c.x - 4.5} 99l9 -5M${c.x - 4.5} 108l9 -5M${c.x - 4.5} 117l9 -5`} stroke={c.c[1]} strokeWidth="3.2" opacity=".85" />
          <rect x={c.x - 4.5} y={82} width="3" height="40" rx="1.5" fill="#fff" opacity=".35" />
          <path d={`M${c.x} 82v-4`} stroke="#6b4a5e" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );

  return (
    <svg viewBox="0 0 400 380" className={className} style={{ overflow: "visible" }} role="img" aria-label="A pink birthday cake">
      <defs>
        <linearGradient id={`${uid}-t1`} x1="0" x2="1">
          <stop offset="0" stopColor="#f59cc0" />
          <stop offset="0.3" stopColor="#ffc7dd" />
          <stop offset="0.55" stopColor="#ffd9e8" />
          <stop offset="0.82" stopColor="#ffb5d0" />
          <stop offset="1" stopColor="#f08db6" />
        </linearGradient>
        <linearGradient id={`${uid}-t2`} x1="0" x2="1">
          <stop offset="0" stopColor="#f3a6ff" stopOpacity="0" />
          <stop offset="0" stopColor="#ffa9c9" />
          <stop offset="0.3" stopColor="#ffd0e3" />
          <stop offset="0.55" stopColor="#ffe3ee" />
          <stop offset="0.82" stopColor="#ffc2d8" />
          <stop offset="1" stopColor="#f59cc0" />
        </linearGradient>
        <linearGradient id={`${uid}-t3`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffb4d0" />
          <stop offset="0.35" stopColor="#ffdbe9" />
          <stop offset="0.6" stopColor="#fff0f6" />
          <stop offset="1" stopColor="#ffb9d2" />
        </linearGradient>
        <radialGradient id={`${uid}-top`} cx="45%" cy="40%" r="75%">
          <stop offset="0" stopColor="#fffafc" />
          <stop offset="1" stopColor="#ffd3e4" />
        </radialGradient>
        <radialGradient id={`${uid}-plate`} cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffd6e6" />
        </radialGradient>
        <linearGradient id="STRAW" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6b8e" />
          <stop offset="1" stopColor="#d9254f" />
        </linearGradient>
        <linearGradient id="FLAME" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0a0" />
          <stop offset="0.5" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff6f9a" />
        </linearGradient>
        <radialGradient id="GLOW">
          <stop offset="0" stopColor="#ffe9a0" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffd0a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-heart`}>
          <stop offset="0" stopColor="#fff8c8" stopOpacity=".95" />
          <stop offset="0.5" stopColor="#ffc8e0" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffc8e0" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-cl`}>
          <rect x="-300" y="-300" width={CX + 300} height="900" />
        </clipPath>
        <clipPath id={`${uid}-cr`}>
          <rect x={CX} y="-300" width="500" height="900" />
        </clipPath>
        {art}
      </defs>

      {/* plate */}
      <ellipse cx={CX} cy="352" rx="176" ry="13" fill="rgba(150,50,100,.18)" />
      <ellipse cx={CX} cy="338" rx="192" ry="26" fill={`url(#${uid}-plate)`} stroke="#ffc1d9" strokeWidth="2" />
      <ellipse cx={CX} cy="334" rx="170" ry="21" fill="#fff" opacity=".85" />

      {/* glow revealed between the halves */}
      <ellipse
        cx={CX}
        cy="230"
        rx="90"
        ry="150"
        fill={`url(#${uid}-heart)`}
        style={{ opacity: split ? 1 : 0, transition: "opacity .6s ease .25s" }}
      />

      {/* LEFT half */}
      <g style={half("l")}>
        <g clipPath={`url(#${uid}-cl)`}>
          <use href={`#${uid}-art`} />
        </g>
        {/* the sponge cross-section, visible once it's open */}
        <g style={{ opacity: split ? 1 : 0, transition: "opacity .4s ease .35s" }}>
          <CutFace x={CX} side="l" uid={uid} />
        </g>
      </g>

      {/* RIGHT half */}
      <g style={half("r")}>
        <g clipPath={`url(#${uid}-cr)`}>
          <use href={`#${uid}-art`} />
        </g>
        <g style={{ opacity: split ? 1 : 0, transition: "opacity .4s ease .35s" }}>
          <CutFace x={CX} side="r" uid={uid} />
        </g>
      </g>

      {/* the seam drawn by the knife */}
      <line
        x1={CX}
        y1="108"
        x2={CX}
        y2="338"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        style={{
          strokeDasharray: 240,
          strokeDashoffset: knife === "hidden" ? 240 : 0,
          opacity: split ? 0 : 1,
          transition: knife === "cutting" ? "stroke-dashoffset .95s linear, opacity .2s" : "opacity .3s",
          filter: "drop-shadow(0 0 4px #ff9ec5)",
        }}
      />

      {/* flames + smoke (not part of the halves) */}
      {candles.map((c) => (
        <Candle key={c.x} x={c.x} y={122} color={c.c} lit={lit} smoke={!lit} />
      ))}

      {/* crumbs falling when it splits */}
      {split &&
        crumbs.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={c.size}
            fill={c.c}
            style={{ animation: `crumb-fall 1.7s ease-in ${c.d}s both`, "--cx": `${c.cx}px`, "--cy": `${c.cy}px`, "--cr": `${c.cr}deg` }}
          />
        ))}

      {/* the knife */}
      <g
        style={{
          ...knifeStyle,
          transition: knife === "cutting" ? "transform .95s cubic-bezier(.55,.05,.4,1), opacity .2s" : "transform .7s ease-in, opacity .5s",
          transformOrigin: `${CX}px 60px`,
        }}
      >
        <g transform={`translate(${CX} 60)`}>
          <path d="M-9 -112H9V-18Q9 -6 0 0Q-9 -6 -9 -18Z" fill="url(#KNIFE)" stroke="#d6dbe8" strokeWidth="1" />
          <rect x="-3" y="-108" width="2.4" height="84" rx="1.2" fill="#fff" opacity=".7" />
          <rect x="-14" y="-124" width="28" height="14" rx="6" fill="#ffc2da" />
          <rect x="-8" y="-186" width="16" height="66" rx="8" fill="#ff7fb0" />
          <rect x="-8" y="-186" width="5" height="66" rx="2.5" fill="#fff" opacity=".4" />
          <circle cy="-160" r="4" fill="#fff" opacity=".7" />
          <circle cy="-176" r="4" fill="#fff" opacity=".7" />
        </g>
        <defs>
          <linearGradient id="KNIFE" x1="0" x2="1">
            <stop offset="0" stopColor="#c9cfe0" />
            <stop offset="0.45" stopColor="#ffffff" />
            <stop offset="1" stopColor="#aab2c8" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
}

// [top, bottom, width] of each tier's cross-section – wider towards the base, like a real cut
const FACE_TIERS = [
  [118, 168, 17],
  [164, 238, 26],
  [234, 324, 35],
];

/** The layered sponge you see inside the cut cake – a stepped strip, drawn in perspective. */
function CutFace({ x, side, uid }) {
  const left = side === "l"; // the left half shows its face on its right-hand edge
  const shade = `${uid}-cs${side}`;
  return (
    <g>
      <defs>
        <linearGradient id={shade} x1={left ? 0 : 1} x2={left ? 1 : 0}>
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor="#7a2a55" stopOpacity=".2" />
        </linearGradient>
      </defs>
      {FACE_TIERS.map(([top, bottom, w], i) => {
        const x0 = left ? x : x - w;
        const h = bottom - top;
        return (
          <g key={i}>
            <rect x={x0} y={top} width={w} height={h} rx="3" fill="#ffe6bb" />
            <rect x={x0} y={top} width={w} height="7" rx="3" fill="#fffafc" />
            <rect x={x0} y={top + h * 0.33} width={w} height="6" fill="#fff7fb" />
            <rect x={x0} y={top + h * 0.6} width={w} height="4" fill="#ff9fbd" />
            <rect x={x0} y={bottom - 7} width={w} height="7" rx="3" fill="#ffb8d2" />
            <circle cx={x0 + w * 0.3} cy={top + h * 0.47} r="1.8" fill="#ff7d9f" opacity=".85" />
            <circle cx={x0 + w * 0.68} cy={top + h * 0.78} r="1.6" fill="#ff7d9f" opacity=".8" />
            <rect x={x0} y={top} width={w} height={h} rx="3" fill={`url(#${shade})`} />
          </g>
        );
      })}
    </g>
  );
}
