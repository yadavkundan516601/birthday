/* ============================================================================
 *  🎀  BIRTHDAY CONFIG  🎀
 * ----------------------------------------------------------------------------
 *  This is the ONE file you edit to personalise the whole experience.
 *  You never need to touch any component or scene.
 *
 *  QUICK GUIDE
 *  ───────────
 *  • Name / date ............ birthdayPerson, birthdayDate
 *  • Messages ............... heroMessage, mainBirthdayMessage, cakeMessage,
 *                             wishMessage, galleryMessage, finalLetter
 *  • Photos ................. galleryImages  (see "HOW TO ADD PHOTOS" below)
 *  • Music .................. music.src, music.volume, music.enabled
 *  • Effects on/off ......... effects.*
 *  • Button / headline text . texts.*  (optional – every label can be reworded)
 *
 *  TEXT TOKENS
 *  ───────────
 *  Inside ANY text below you can write {name} and {date}; they are replaced by
 *  birthdayPerson / birthdayDate automatically. Example: "Dear {name},"
 *
 *  HOW TO ADD PHOTOS  (Scene 6 – the gallery)
 *  ──────────────────
 *  1. Copy your photos into  public/images/gallery/
 *  2. List them in galleryImages below. Order here = order on screen.
 *       "/images/gallery/us-at-the-beach.jpg"                       ← simple
 *       { src: "/images/gallery/cake.jpg", caption: "Last year 🎂" } ← with caption
 *  3. Add, remove or re-order lines freely – the gallery adapts to any amount.
 *  Tip: portrait photos (4:5) look best; any size works.
 *
 *  HOW TO CHANGE THE MUSIC
 *  ───────────────────────
 *  1. Drop an .mp3 into  public/audio/
 *  2. Point music.src at it, e.g. "/audio/our-song.mp3"
 *  3. music.volume is 0 (silent) → 1 (full). 0.35 is a gentle background level.
 *  Music only starts after the first tap (browsers block autoplay) and she can
 *  mute it with the little 🔊 button in the corner.
 * ========================================================================== */

const birthdayConfig = {
  // ── Who & when ───────────────────────────────────────────────────────────
  birthdayPerson: "Akansha",
  birthdayDate: "25 November",

  // ── Scene 1 · the mysterious letter ──────────────────────────────────────
  heroMessage: "There is something for you...",

  // ── Scene 3 · main celebration ───────────────────────────────────────────
  mainBirthdayMessage:
    "Today is all about you, your smile, and all the happiness you deserve. May your day be as beautiful, adorable, and magical as you are!",

  // ── Scene 4 · the cake ───────────────────────────────────────────────────
  cakeMessage: "Every birthday deserves a cake...",

  // ── Scene 5 · the wish ───────────────────────────────────────────────────
  wishMessage:
    "Make a wish. You deserve all the beautiful things in this world.",

  // ── Scene 6 · the gallery ────────────────────────────────────────────────
  galleryMessage:
    "Well... you didn't give me your photos, so here's you for now! 😂💗",

  // These are placeholders (cute bunny + donkey!). Replace them with real
  // photos whenever you have them – see "HOW TO ADD PHOTOS" at the top.
  galleryImages: [
    "/images/donkey.jpg",
    "/images/donkey.jpg",
    "/images/donkey.jpg",
    "/images/donkey.jpg",
    // { src: "/images/gallery/photo-1.jpg", caption: "Us, being silly 💗" },
  ],

  // ── Scene 7 · the final love letter ──────────────────────────────────────
  // Typed out letter by letter. Blank lines become paragraph breaks.
  // Write it from the heart ✍️  (indentation is cleaned up automatically)
  finalLetter: `Dear {name},

  I know we've only interacted a few times, but I want you to always remember that I'm here for you My cutie pie.

  Your presence matters to me more than I can say, and I hope that someday, things turn out loving between us.

  Stay strong, stay happy, and never fade away that beautiful smile of yours. You deserve all the happiness in the world.

  Happy Birthday !💗`,

  // ── Music ────────────────────────────────────────────────────────────────
  music: {
    enabled: true,
    src: "/audio/birthday-music.mp3",
    volume: 0.35,
  },

  // ── Effects (set any to false to switch it off) ──────────────────────────
  effects: {
    floatingHearts: true, // hearts drifting upwards
    confetti: true, //       confetti bursts & showers
    sparkles: true, //       twinkling stars / sparkles
    backgroundMusic: true, // master switch for music (with music.enabled)
    threeD: true, //         the real 3D hearts & stars (WebGL). Turn off for older phones.
  },

  // ── Optional: reword any headline / button ───────────────────────────────
  // Delete this whole block to use the defaults. Every line is optional.
  texts: {
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
  },
};

export default birthdayConfig;
