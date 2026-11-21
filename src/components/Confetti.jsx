import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import config from "../config";
import { prefersReducedMotion } from "../lib/random";

const COLORS = ["#ff6fa5", "#ff9ec5", "#ffd1e3", "#ffe28a", "#c9a7ff", "#9fe3ff", "#ffb48f", "#ffffff", "#b5f0c8"];
const SHAPES = ["rect", "rect", "circle", "heart", "star", "ribbon"];
const MAX_PARTICLES = 700;

const ConfettiContext = createContext({ burst: () => {}, rain: () => {}, clear: () => {} });
export const useConfetti = () => useContext(ConfettiContext);

function drawHeart(ctx, s) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s * 0.9, -s * 0.2, -s * 0.5, -s * 0.9, 0, -s * 0.4);
  ctx.bezierCurveTo(s * 0.5, -s * 0.9, s * 0.9, -s * 0.2, 0, s * 0.35);
  ctx.fill();
}
function drawStar(ctx, s) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? s * 0.7 : s * 0.3;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Canvas confetti engine. Wrap the app once, then call `useConfetti()` anywhere:
 *   burst({ origin:{x:.5,y:.6}, count:100, spread:360, angle:270, ... })
 *   rain({ duration:3000, density:1 })
 * It draws nothing – and costs nothing – while there are no particles.
 */
export function ConfettiProvider({ children }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const raf = useRef(0);
  const rainTimer = useRef(0);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const enabled = config.effects.confetti && !prefersReducedMotion();

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;
    size.current = { w, h, dpr };
  }, []);

  const frame = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const { w, h, dpr } = size.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const list = particles.current;
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.cos(p.wobble) * p.sway;
      p.y += p.vy;
      p.rot += p.vr;
      p.tilt += p.tiltSpeed;
      p.life -= 1;

      if (p.life <= 0 || p.y > h + 40) {
        list.splice(i, 1);
        continue;
      }
      const alpha = Math.min(1, p.life / 28);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      const s = p.size;
      switch (p.shape) {
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "heart":
          drawHeart(ctx, s);
          break;
        case "star":
          drawStar(ctx, s);
          break;
        case "ribbon":
          ctx.scale(1, Math.cos(p.tilt));
          ctx.fillRect(-s * 0.9, -s * 0.15, s * 1.8, s * 0.3);
          break;
        default:
          ctx.scale(1, Math.cos(p.tilt));
          ctx.fillRect(-s * 0.5, -s * 0.3, s, s * 0.6);
      }
      ctx.restore();
    }

    if (list.length) raf.current = requestAnimationFrame(frame);
    else {
      raf.current = 0;
      ctx.clearRect(0, 0, w, h);
    }
  }, []);

  const spawn = useCallback(
    (list) => {
      const room = MAX_PARTICLES - particles.current.length;
      particles.current.push(...list.slice(0, Math.max(0, room)));
      if (!raf.current) raf.current = requestAnimationFrame(frame);
    },
    [frame],
  );

  const burst = useCallback(
    ({
      origin = { x: 0.5, y: 0.6 },
      count = 90,
      spread = 360,
      angle = 270, // degrees, 270 = straight up
      power = 15,
      gravity = 0.32,
      drag = 0.935,
      scalar = 1,
      colors = COLORS,
      shapes = SHAPES,
      life = 150,
    } = {}) => {
      if (!enabled) return;
      const { w, h } = size.current;
      const ox = origin.x * w;
      const oy = origin.y * h;
      const list = Array.from({ length: count }, () => {
        const a = ((angle + (Math.random() - 0.5) * spread) * Math.PI) / 180;
        const v = power * (0.45 + Math.random() * 0.75);
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          drag,
          gravity,
          size: (7 + Math.random() * 8) * scalar,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.35,
          tilt: Math.random() * Math.PI * 2,
          tiltSpeed: 0.08 + Math.random() * 0.2,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.05 + Math.random() * 0.1,
          sway: Math.random() * 1.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          life: life + Math.random() * 60,
        };
      });
      spawn(list);
    },
    [enabled, spawn],
  );

  /** A shower of confetti falling from the top of the screen. */
  const rain = useCallback(
    ({ duration = 3000, density = 1, colors = COLORS, shapes = SHAPES } = {}) => {
      if (!enabled) return;
      const end = performance.now() + duration;
      window.clearInterval(rainTimer.current);
      rainTimer.current = window.setInterval(() => {
        if (performance.now() > end) return window.clearInterval(rainTimer.current);
        const { w } = size.current;
        const n = Math.round(4 * density);
        spawn(
          Array.from({ length: n }, () => ({
            x: Math.random() * w,
            y: -20,
            vx: (Math.random() - 0.5) * 2.2,
            vy: 1.6 + Math.random() * 2.6,
            drag: 0.995,
            gravity: 0.025,
            size: 6 + Math.random() * 8,
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.22,
            tilt: Math.random() * Math.PI * 2,
            tiltSpeed: 0.06 + Math.random() * 0.14,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.04 + Math.random() * 0.06,
            sway: 0.6 + Math.random() * 1.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            life: 400,
          })),
        );
      }, 90);
    },
    [enabled, spawn],
  );

  const clear = useCallback(() => {
    window.clearInterval(rainTimer.current);
    particles.current = [];
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf.current);
      window.clearInterval(rainTimer.current);
    };
  }, [resize]);

  const value = useMemo(() => ({ burst, rain, clear }), [burst, rain, clear]);

  return (
    <ConfettiContext.Provider value={value}>
      {children}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />
    </ConfettiContext.Provider>
  );
}

/** Fire one burst when this mounts (or when `when` flips to true). */
export function ConfettiBurst({ when = true, delay = 0, ...options }) {
  const { burst } = useConfetti();
  const optionsRef = useRef(options);
  useEffect(() => {
    if (!when) return;
    const t = window.setTimeout(() => burst(optionsRef.current), delay);
    return () => window.clearTimeout(t);
  }, [when, delay, burst]);
  return null;
}

/** Keep showering confetti every `every` ms while mounted. */
export function ConfettiRain({ every = 7000, duration = 2400, first = 1200, density = 1, active = true }) {
  const { rain } = useConfetti();
  useEffect(() => {
    if (!active) return;
    const t0 = window.setTimeout(() => rain({ duration, density }), first);
    const t1 = window.setInterval(() => rain({ duration, density }), every);
    return () => {
      window.clearTimeout(t0);
      window.clearInterval(t1);
    };
  }, [active, every, duration, first, density, rain]);
  return null;
}

export default ConfettiBurst;
