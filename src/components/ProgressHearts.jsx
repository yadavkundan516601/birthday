import Heart from "./Heart";

/** A tiny row of hearts showing how far into the story we are (not a menu). */
export default function ProgressHearts({ index, total, dark = false }) {
  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[55] flex -translate-x-1/2 items-center gap-1.5"
      style={{ top: "max(1rem, env(safe-area-inset-top))" }}
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            opacity: i <= index ? 1 : 0.3,
            transform: `scale(${i === index ? 1.25 : 1})`,
            transition: "all .6s cubic-bezier(.22,1,.36,1)",
            filter: dark && i > index ? "grayscale(.6) brightness(.8)" : undefined,
          }}
        >
          <Heart size={12} flat from={i <= index ? "#ff6fa5" : dark ? "#9d86b8" : "#ffffff"} />
        </span>
      ))}
    </div>
  );
}
