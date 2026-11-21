import { useId } from "react";
import Pop from "./Pop";
import { Bow, Eyes, HeldItem, poseFor } from "./CharacterItems";

/**
 * An adorable panda. Same props as <TeddyBear />.
 *  mood: "idle" | "wave" | "dance" | "cheer" | "sit"
 *  item: null | "balloon" | "letter" | "heart"
 *  eyes: "open" | "closed" | "happy"
 */
export default function Panda({
  size = 150,
  mood = "idle",
  item = null,
  itemColor,
  eyes = "open",
  bow = "#ff7eb0",
  show = true,
  popDelay = 0,
  flip = false,
  className = "",
  style,
}) {
  const uid = useId().replace(/:/g, "");
  const pose = poseFor(mood, item);
  const white = `url(#${uid}-white)`;
  const black = `url(#${uid}-black)`;

  const Arm = ({ side }) => {
    const left = side === "l";
    return (
      <g transform={`translate(${left ? 48 : 152} 142)`}>
        <g className={`arm arm-${side}`}>
          <ellipse cx="0" cy="32" rx="18" ry="34" fill={black} />
          <ellipse cx="-3" cy="12" rx="5" ry="9" fill="#fff" opacity=".13" />
        </g>
      </g>
    );
  };

  return (
    <Pop show={show} delay={popDelay} className={`inline-block ${className}`} style={style}>
      <svg
        viewBox="0 0 200 250"
        width={size}
        height={size * 1.25}
        className={`buddy mood-${mood} ${item ? "has-item" : ""}`}
        style={{
          "--arm-l": `${pose.l}deg`,
          "--arm-r": `${pose.r}deg`,
          transform: flip ? "scaleX(-1)" : undefined,
          filter: "drop-shadow(0 10px 12px rgba(120,60,110,.24))",
        }}
        role="img"
        aria-label="A cute panda"
      >
        <defs>
          <radialGradient id={`${uid}-white`} cx="35%" cy="28%" r="85%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.7" stopColor="#fbf6fa" />
            <stop offset="1" stopColor="#e9deea" />
          </radialGradient>
          <radialGradient id={`${uid}-black`} cx="35%" cy="25%" r="90%">
            <stop offset="0" stopColor="#5b5266" />
            <stop offset="0.5" stopColor="#3a3244" />
            <stop offset="1" stopColor="#241d2c" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="240" rx="64" ry="9" fill="rgba(120,50,90,.16)" />

        <g className="buddy-body">
          {/* legs */}
          <ellipse cx="64" cy="218" rx="30" ry="23" fill={black} />
          <ellipse cx="136" cy="218" rx="30" ry="23" fill={black} />
          <ellipse cx="64" cy="222" rx="15" ry="11" fill="#ffb3c9" opacity=".92" />
          <ellipse cx="136" cy="222" rx="15" ry="11" fill="#ffb3c9" opacity=".92" />
          <ellipse cx="60" cy="214" rx="9" ry="4" fill="#fff" opacity=".12" />
          <ellipse cx="132" cy="214" rx="9" ry="4" fill="#fff" opacity=".12" />

          {/* body */}
          <ellipse cx="100" cy="170" rx="58" ry="62" fill={white} />
          <ellipse cx="86" cy="148" rx="18" ry="9" fill="#fff" opacity=".5" transform="rotate(-25 86 148)" />
          <ellipse cx="100" cy="190" rx="40" ry="34" fill="#f1e6f1" opacity=".5" />

          <Arm side="l" />
          <Arm side="r" />
          <HeldItem item={item} uid={uid} hand="#3a3244" color={itemColor} />

          {/* head */}
          <g className="buddy-head">
            <circle cx="52" cy="40" r="21" fill={black} />
            <circle cx="148" cy="40" r="21" fill={black} />
            <circle cx="53" cy="43" r="10" fill="#ffb3c9" opacity=".6" />
            <circle cx="147" cy="43" r="10" fill="#ffb3c9" opacity=".6" />
            <ellipse cx="100" cy="82" rx="60" ry="54" fill={white} />
            <ellipse cx="74" cy="50" rx="24" ry="11" fill="#fff" opacity=".7" transform="rotate(-24 74 50)" />

            {/* eye patches */}
            <ellipse cx="76" cy="80" rx="15" ry="19" fill={black} transform="rotate(24 76 80)" />
            <ellipse cx="124" cy="80" rx="15" ry="19" fill={black} transform="rotate(-24 124 80)" />
            <Eyes mode={eyes} y={78} dx={23} fill="#2a2132" />
            {eyes === "open" && (
              <>
                {/* eyes are black-on-black here, so give them a bright rim light */}
                <circle cx="76.4" cy="75" r="3.1" fill="#fff" />
                <circle cx="123.6" cy="75" r="3.1" fill="#fff" />
              </>
            )}

            {/* nose + mouth */}
            <path d="M91 94Q100 88 109 94 107 102.5 100 104.5 93 102.5 91 94Z" fill="#2a2132" />
            <ellipse cx="97" cy="94.5" rx="3.4" ry="1.8" fill="#fff" opacity=".45" />
            <path d="M100 104.5V109.5M100 109.5Q94 116.5 87 112M100 109.5Q106 116.5 113 112" stroke="#2a2132" strokeWidth="2.6" strokeLinecap="round" fill="none" />

            <ellipse cx="60" cy="102" rx="10.5" ry="6.4" fill="#ff8fb4" opacity=".6" />
            <ellipse cx="140" cy="102" rx="10.5" ry="6.4" fill="#ff8fb4" opacity=".6" />

            <Bow x={58} y={30} scale={0.62} color={bow} rotate={-18} />
          </g>
        </g>
      </svg>
    </Pop>
  );
}
