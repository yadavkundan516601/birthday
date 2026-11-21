import { useEffect, useState } from "react";

/** Live viewport size – used to scale illustrations (characters, flowers) on small phones. */
export function useViewport() {
  const read = () => ({
    width: typeof window === "undefined" ? 800 : window.innerWidth,
    height: typeof window === "undefined" ? 800 : window.innerHeight,
  });
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  return size;
}

/** Character size that scales with the screen: `vw` % of width, clamped to [min, max]. */
export const fluid = (width, vw, min, max) => Math.round(Math.min(max, Math.max(min, (width * vw) / 100)));
