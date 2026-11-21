import { useCallback, useRef, useState } from "react";

// The story, in order. Scenes can only ever move forward one step at a time.
export const SCENES = ["welcome", "lights", "birthday", "cake", "wish", "gallery", "letter"];

// Dev-only shortcut for designers: http://localhost:5173/?scene=cake jumps straight to a scene.
const devStart = () => {
  if (!import.meta.env.DEV || typeof window === "undefined") return 0;
  const i = SCENES.indexOf(new URLSearchParams(window.location.search).get("scene"));
  return i > 0 ? i : 0;
};

export function useBirthdayFlow() {
  const [index, setIndex] = useState(devStart);
  const [runKey, setRunKey] = useState(0); // bumps on replay so every scene remounts fresh
  const lockRef = useRef(false);

  const next = useCallback(() => {
    if (lockRef.current) return; // ignore double taps while a transition is running
    lockRef.current = true;
    setIndex((i) => Math.min(i + 1, SCENES.length - 1));
    window.setTimeout(() => (lockRef.current = false), 1100);
  }, []);

  const restart = useCallback(() => {
    lockRef.current = true;
    setIndex(0);
    setRunKey((k) => k + 1);
    window.setTimeout(() => (lockRef.current = false), 1100);
  }, []);

  return {
    scene: SCENES[index],
    index,
    total: SCENES.length,
    runKey,
    next,
    restart,
    isFirst: index === 0,
    isLast: index === SCENES.length - 1,
  };
}
