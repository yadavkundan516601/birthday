import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Dev-only: add ?fast to the URL to type 10x quicker while testing. Compiled out of production builds.
const TURBO = import.meta.env.DEV && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("fast");

/**
 * A natural typewriter: variable key speed, a breath at punctuation, a longer
 * pause at paragraph breaks. Unwritten text is kept in the layout (invisible)
 * so lines never re-wrap while typing.
 *
 * `scrollRef` – optional scroll container to keep the cursor in view.
 */
export default function Typewriter({
  text,
  speed = 42,
  startDelay = 500,
  active = true,
  onDone,
  onProgress,
  scrollRef,
  className = "",
}) {
  const chars = useRef(Array.from(text));
  const [count, setCount] = useState(0);
  const caretRef = useRef(null);
  const reduce = useReducedMotion();
  const doneRef = useRef(onDone);
  const progressRef = useRef(onProgress);
  doneRef.current = onDone;
  progressRef.current = onProgress;

  useEffect(() => {
    chars.current = Array.from(text);
    setCount(0);
  }, [text]);

  useEffect(() => {
    if (!active) return;
    const all = chars.current;
    if (reduce) {
      setCount(all.length);
      doneRef.current?.();
      return;
    }
    let i = 0;
    let timer;
    const tick = () => {
      i += 1;
      setCount(i);
      progressRef.current?.(i, all.length);
      if (i >= all.length) {
        doneRef.current?.();
        return;
      }
      const ch = all[i - 1];
      let d = speed * (0.55 + Math.random() * 0.95);
      if (".!?".includes(ch)) d += 460;
      else if (",;:".includes(ch)) d += 210;
      else if (ch === "\n") d += 420;
      timer = window.setTimeout(tick, TURBO ? d / 10 : d);
    };
    timer = window.setTimeout(tick, startDelay);
    return () => window.clearTimeout(timer);
  }, [active, speed, startDelay, reduce, text]);

  // keep the cursor comfortably in view inside the scroll container
  useEffect(() => {
    const box = scrollRef?.current;
    const caret = caretRef.current;
    if (!box || !caret || count === 0) return;
    const target = caret.offsetTop - box.clientHeight * 0.6;
    if (target > box.scrollTop) box.scrollTop = target;
  }, [count, scrollRef]);

  const all = chars.current;
  const typed = all.slice(0, count).join("");
  const rest = all.slice(count).join("");

  return (
    <span className={`whitespace-pre-wrap ${className}`} style={{ position: "relative" }}>
      <span>{typed}</span>
      <span ref={caretRef} className="tw-caret" aria-hidden="true" style={{ opacity: count >= all.length ? 0 : undefined }} />
      <span style={{ opacity: 0 }} aria-hidden="true">
        {rest}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
