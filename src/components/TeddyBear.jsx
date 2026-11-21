import { useId } from "react";
import Pop from "./Pop";
import { Bow, Eyes, HeldItem, poseFor } from "./CharacterItems";

/**
 * An adorable teddy bear.
 *  mood: "idle" | "wave" | "dance" | "cheer" | "sit"
 *  item: null | "balloon" | "letter" | "heart"
 *  eyes: "open" | "closed" | "happy"
 */
export default function TeddyBear({
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
  const fur = `url(#${uid}-fur)`;

  const Arm = ({ side }) => {
    const left = side === "l";
    return (
      <g transform={`translate(${left ? 48 : 152} 142)`}>
        <g className={`arm arm-${side}`}>
          <ellipse cx="0" cy="32" rx="18" ry="34" fill={fur} />
          <ellipse cx="0" cy="55" rx="9" ry="8" fill={`url(#${uid}-belly)`} opacity=".9" />
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
          filter: "drop-shadow(0 10px 12px rgba(150,60,100,.22))",
        }}
        role="img"
        aria-label="A cute teddy bear"
      >
        <defs>
          <radialGradient id={`${uid}-fur`} cx="35%" cy="28%" r="85%">
            <stop offset="0" stopColor="#fbdcbc" />
            <stop offset="0.55" stopColor="#eab88c" />
            <stop offset="1" stopColor="#d49567" />
          </radialGradient>
          <radialGradient id={`${uid}-belly`} cx="50%" cy="35%" r="75%">
            <stop offset="0" stopColor="#fffaf3" />
            <stop offset="1" stopColor="#fbdcc2" />
          </radialGradient>
          <radialGradient id={`${uid}-ear`} cx="50%" cy="40%" r="70%">
            <stop offset="0" stopColor="#ffc9da" />
            <stop offset="1" stopColor="#ff9fbd" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="240" rx="64" ry="9" fill="rgba(120,50,90,.16)" />

        <g className="buddy-body">
          {/* legs */}
          <ellipse cx="64" cy="218" rx="30" ry="23" fill={fur} />
          <ellipse cx="136" cy="218" rx="30" ry="23" fill={fur} />
          <ellipse cx="64" cy="221" rx="17" ry="13" fill={`url(#${uid}-belly)`} />
          <ellipse cx="136" cy="221" rx="17" ry="13" fill={`url(#${uid}-belly)`} />
          <g fill="#ffb3c9">
            <circle cx="64" cy="224" r="5" />
            <circle cx="55" cy="217" r="2.6" />
            <circle cx="64" cy="214" r="2.6" />
            <circle cx="73" cy="217" r="2.6" />
            <circle cx="136" cy="224" r="5" />
            <circle cx="127" cy="217" r="2.6" />
            <circle cx="136" cy="214" r="2.6" />
            <circle cx="145" cy="217" r="2.6" />
          </g>

          {/* body + belly */}
          <ellipse cx="100" cy="170" rx="58" ry="62" fill={fur} />
          <ellipse cx="100" cy="178" rx="37" ry="42" fill={`url(#${uid}-belly)`} />
          <ellipse cx="86" cy="150" rx="16" ry="9" fill="#fff" opacity=".18" transform="rotate(-25 86 150)" />

          <Arm side="l" />
          <Arm side="r" />
          <HeldItem item={item} uid={uid} hand="#eab88c" color={itemColor} />

          {/* head */}
          <g className="buddy-head">
            <circle cx="54" cy="40" r="20" fill={fur} />
            <circle cx="146" cy="40" r="20" fill={fur} />
            <circle cx="55" cy="42" r="11" fill={`url(#${uid}-ear)`} />
            <circle cx="145" cy="42" r="11" fill={`url(#${uid}-ear)`} />
            <ellipse cx="100" cy="82" rx="58" ry="54" fill={fur} />
            <ellipse cx="76" cy="52" rx="24" ry="12" fill="#fff" opacity=".24" transform="rotate(-24 76 52)" />

            {/* muzzle */}
            <ellipse cx="100" cy="99" rx="25" ry="19" fill={`url(#${uid}-belly)`} />
            <path d="M91.5 90Q100 85 108.5 90 107 98.5 100 100.5 93 98.5 91.5 90Z" fill="#5b3a3a" />
            <ellipse cx="97" cy="90" rx="3.4" ry="1.8" fill="#fff" opacity=".5" />
            <path d="M100 100.5V106M100 106Q94 113 86.5 108M100 106Q106 113 113.5 108" stroke="#5b3a3a" strokeWidth="2.6" strokeLinecap="round" fill="none" />

            <Eyes mode={eyes} y={77} dx={23} />
            <ellipse cx="62" cy="98" rx="10.5" ry="6.6" fill="#ff8fb4" opacity=".55" />
            <ellipse cx="138" cy="98" rx="10.5" ry="6.6" fill="#ff8fb4" opacity=".55" />

            <Bow x={142} y={36} scale={0.62} color={bow} rotate={18} />
          </g>
        </g>
      </svg>
    </Pop>
  );
}
