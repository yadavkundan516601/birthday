// Normalises src/config/birthdayConfig.js so the rest of the app never has to
// worry about missing keys, text tokens, indentation or asset base paths.
// You normally do NOT need to edit this file – edit birthdayConfig.js instead.
import raw from "./birthdayConfig.js";

const DEFAULT_TEXTS = {
  loadingMessage: "Loading your surprise... 🎁",
  welcomeButton: "Open Your Surprise ✨",
  lightsTitle: "Shhh... 🤫",
  lightsSubtitle: "The room is waiting for you...",
  lightsButton: "Turn On The Lights 💡",
  lightsReveal: "Surprise! 🎉",
  birthdayTitle: "Happy Birthday, {name}! 🎀",
  birthdayButton: "There's More... 💗",
  cakeQuestion: "Ready to cut your birthday cake?",
  cakeCutButton: "Cut the Cake 🔪",
  cakeCelebration: "Yaaay! 🎉",
  cakeWishButton: "Make a Wish ✨",
  wishTitle: "Close Your Eyes... 🌸",
  wishPrompt: "Think of something that makes your heart happy.",
  wishButton: "I Made a Wish 💗",
  wishSent: "Your wish is on its way... ✨",
  galleryTitle: "A Little Gallery of Happiness 📸",
  galleryButton: "One Last Surprise... 💌",
  letterIntro: "One Last Thing For You...",
  letterButton: "Open My Letter 💗",
  finalSmile: "Keep Smiling, Birthday Girl! 💗",
  replayButton: "Experience the Magic Again ↻",
  musicOnLabel: "Turn music off",
  musicOffLabel: "Turn music on",
};

const DEFAULTS = {
  birthdayPerson: "Birthday Star",
  birthdayDate: "",
  heroMessage: "There is something for you...",
  mainBirthdayMessage: "Today is all about you. Happy Birthday!",
  cakeMessage: "Every birthday deserves a cake...",
  wishMessage: "Make a wish. You deserve all the beautiful things in this world.",
  galleryMessage: "Here's to you! 💗",
  finalLetter: "Happy Birthday, {name}! 💗",
  galleryImages: [],
  music: { enabled: true, src: "/audio/birthday-music.mp3", volume: 0.35 },
  effects: {
    floatingHearts: true,
    confetti: true,
    sparkles: true,
    backgroundMusic: true,
    threeD: true,
  },
};

/** Turn "/images/a.png" into a path that also works when the site is hosted in a sub-folder. */
export function asset(path = "") {
  if (!path || /^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const base = import.meta.env.BASE_URL || "/";
  return base.replace(/\/?$/, "/") + path.replace(/^\.?\//, "");
}

/** Remove the common leading indentation of a multi-line template string. */
function dedent(text) {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  const indents = lines
    .slice(1)
    .filter((l) => l.trim().length > 0)
    .map((l) => l.match(/^[ \t]*/)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines
    .map((l, i) => (i === 0 ? l.trimEnd() : l.slice(Math.min(cut, l.match(/^[ \t]*/)[0].length)).trimEnd()))
    .join("\n")
    .trim();
}

const merged = {
  ...DEFAULTS,
  ...raw,
  music: { ...DEFAULTS.music, ...(raw.music || {}) },
  effects: { ...DEFAULTS.effects, ...(raw.effects || {}) },
  texts: { ...DEFAULT_TEXTS, ...(raw.texts || {}) },
};

const fill = (s) =>
  typeof s === "string"
    ? s.replace(/\{name\}/gi, merged.birthdayPerson).replace(/\{date\}/gi, merged.birthdayDate)
    : s;

const galleryImages = (merged.galleryImages || [])
  .map((item) => (typeof item === "string" ? { src: item } : item))
  .filter((item) => item && item.src)
  .map((item, i) => ({
    src: asset(item.src),
    caption: fill(item.caption || ""),
    alt: fill(item.alt || item.caption || `${merged.birthdayPerson} photo ${i + 1}`),
  }));

const texts = Object.fromEntries(
  Object.entries(merged.texts).map(([k, v]) => [k, fill(v)]),
);

const config = {
  birthdayPerson: merged.birthdayPerson,
  birthdayDate: merged.birthdayDate,
  heroMessage: fill(merged.heroMessage),
  mainBirthdayMessage: fill(merged.mainBirthdayMessage),
  cakeMessage: fill(merged.cakeMessage),
  wishMessage: fill(merged.wishMessage),
  galleryMessage: fill(merged.galleryMessage),
  finalLetter: fill(dedent(merged.finalLetter)),
  galleryImages,
  music: {
    enabled: !!merged.music.enabled,
    src: asset(merged.music.src),
    volume: Math.min(1, Math.max(0, Number(merged.music.volume) || 0)),
  },
  effects: merged.effects,
  texts,
};

export default config;
