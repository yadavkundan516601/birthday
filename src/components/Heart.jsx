import { useId } from "react";

export const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

/** A glossy little heart. `flat` skips the gradient (cheaper for particle swarms). */
export default function Heart({ size = 24, from = "#ff9ec5", to = "#ff4f93", flat, className, style }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="1 2 22 20"
      width={size}
      height={(size * 20) / 22}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {!flat && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
      )}
      <path d={HEART_PATH} fill={flat ? from : `url(#${id})`} />
      <ellipse cx="7.6" cy="7.2" rx="2.3" ry="1.3" fill="#fff" opacity=".55" transform="rotate(-32 7.6 7.2)" />
    </svg>
  );
}
