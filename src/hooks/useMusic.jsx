import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import config from "../config";

const MusicContext = createContext({
  available: false,
  playing: false,
  start: () => {},
  toggle: () => {},
});

const musicAllowed = config.music.enabled && config.effects.backgroundMusic;

// Background music provider. Browsers block autoplay, so nothing plays until
// start() is called from a real tap/click (the first "Open Your Surprise" button).
export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const fadeRef = useRef(0);
  const wantedRef = useRef(false); // does the user want music right now?
  const startedRef = useRef(false);
  const mutedByUserRef = useRef(false); // she turned it off herself – never auto-start again
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(musicAllowed);

  const fadeTo = useCallback((target, ms = 900, done) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      audio.volume = Math.min(1, Math.max(0, from + (target - from) * p));
      if (p < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    wantedRef.current = true;
    audio.volume = 0;
    const p = audio.play();
    const onStarted = () => {
      setPlaying(true);
      fadeTo(config.music.volume, 1400);
    };
    if (p && typeof p.then === "function") p.then(onStarted).catch(() => {
        // autoplay was blocked: forget the attempt so the next tap/key can start it
        wantedRef.current = false;
        startedRef.current = false;
        setPlaying(false);
      });
    else onStarted();
  }, [fadeTo]);

  const pause = useCallback(() => {
    wantedRef.current = false;
    setPlaying(false);
    fadeTo(0, 500, () => audioRef.current?.pause());
  }, [fadeTo]);

  const ensureAudio = useCallback(() => {
    if (audioRef.current || !musicAllowed) return;
    const audio = new Audio(config.music.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.addEventListener("error", () => {
      setAvailable(false);
      setPlaying(false);
    });
    audioRef.current = audio;
  }, []);

  const start = useCallback(() => {
    if (!musicAllowed || startedRef.current) return;
    startedRef.current = true;
    ensureAudio();
    play();
  }, [ensureAudio, play]);

  const toggle = useCallback(() => {
    if (!musicAllowed) return;
    ensureAudio();
    startedRef.current = true;
    if (wantedRef.current) {
      mutedByUserRef.current = true;
      pause();
    } else {
      mutedByUserRef.current = false;
      play();
    }
  }, [ensureAudio, pause, play]);

  // Music is ON by default. Browsers only allow sound after a gesture, so try
  // straight away and, if that is blocked, start on her very first tap/key.
  // It never overrides her if she switched it off herself.
  useEffect(() => {
    if (!musicAllowed) return;
    const events = ["pointerdown", "touchend", "keydown", "click"];
    const ensurePlaying = () => {
      if (mutedByUserRef.current) return;
      const audio = audioRef.current;
      if (!audio || audio.paused) {
        startedRef.current = false;
        start();
      }
    };
    ensurePlaying();
    events.forEach((e) => window.addEventListener(e, ensurePlaying, true));
    return () => events.forEach((e) => window.removeEventListener(e, ensurePlaying, true));
  }, [start]);

  // Be polite: pause when the tab is hidden, resume when she comes back.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) audio.pause();
      else if (wantedRef.current) audio.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(fadeRef.current);
      audioRef.current?.pause();
    };
  }, []);

  const value = useMemo(
    () => ({ available, playing, start, toggle }),
    [available, playing, start, toggle],
  );
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export const useMusic = () => useContext(MusicContext);
