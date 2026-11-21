# 🎀 A Magical Birthday Surprise

A dreamy, interactive, story-style birthday website — seven full-screen scenes, each one
leading to the next surprise. Built with **React + Vite**, **Tailwind CSS**, **Framer Motion**,
**GSAP**, **React Three Fiber (three.js)** and **Lucide** icons. Mobile-first.

Everything personal (name, messages, photos, music, effects) lives in **one file**:
[`src/config/birthdayConfig.js`](src/config/birthdayConfig.js). You never need to touch a component.

---

## ▶️ Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install        # once
npm run dev        # starts http://localhost:5173  (open it on your phone via your Wi-Fi IP too)
```

```bash
npm run build      # production build into /dist
npm run preview    # serve /dist locally to test the real build
```

### Deploy

`npm run build` creates a fully static `dist/` folder (all asset paths are relative), so you can
drop it on **Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3**… or any plain web server, in the
root or in a sub-folder. No server code, no API keys.

---

## 🌸 The story

| # | Scene | What happens |
|---|-------|--------------|
| 1 | **The Mysterious Letter** | A floating 3D envelope. Tap → it opens, a panda & teddy pop out, flowers burst, confetti explodes. |
| 2 | **Turn On the Magic** | A dark, whispering room. Tap the switch → a smiling sun rises, light floods the room, fairy lights switch on one by one. |
| 3 | **The Celebration** | Fairy lights, balloons, dancing bears, flowers, falling confetti and the big “Happy Birthday” message. |
| 4 | **The Cake** | A three-tier cake. Tap → a knife cuts it, candles blow out, it splits in two with crumbs & confetti. |
| 5 | **Make a Wish** | A calm, dreamy scene. Tap → the room glows, a shooting star crosses, the wish floats away. |
| 6 | **The Gallery** | A swipeable 3D cover-flow of photos (cute bunny & donkey placeholders for now). |
| 7 | **The Love Letter** | An envelope opens, a letter unfolds and is typed out letter by letter. Then confetti, a replay button. |

---

## ✏️ Make it hers — customise everything

Open **`src/config/birthdayConfig.js`**. It is fully commented. The essentials:

### Name & date
```js
birthdayPerson: "Nidhi",
birthdayDate: "25 November",
```
Use `{name}` and `{date}` inside *any* text and they are filled in automatically.

### Messages
`heroMessage`, `mainBirthdayMessage`, `cakeMessage`, `wishMessage`, `galleryMessage`, and the big one:

```js
finalLetter: `Dear {name},

  Write your heart out here…

  Happy Birthday! 💗`,
```
Blank lines become paragraph breaks. Emoji work. Leading indentation is cleaned up for you.
(The placeholder text `[WRITE YOUR PERSONAL BIRTHDAY MESSAGE HERE]` is still in there — replace it!)

### Button & headline wording
The optional `texts: { … }` block lets you re-word every button and headline
(`welcomeButton`, `cakeCutButton`, `wishButton`, …). Delete the block to use the defaults.

### 📸 Photos (the gallery)
1. Copy photos into `public/images/gallery/`
2. List them — order here is the order on screen:

```js
galleryImages: [
  "/images/gallery/beach.jpg",
  { src: "/images/gallery/cake.jpg", caption: "Last year 🎂" },   // optional caption
],
```
Add, remove or re-order freely; the 3D gallery adapts to any number. A photo that fails to load
shows a cute fallback instead of an empty box. Portrait (4:5) photos look best.
The funny line shown above the gallery is `galleryMessage`.

### 🎵 Music
1. Put an `.mp3` in `public/audio/`
2. Point at it and set the level:

```js
music: { enabled: true, src: "/audio/our-song.mp3", volume: 0.35 },   // volume 0 → 1
```
Music only starts after the first tap (browsers block autoplay) and fades in. A little speaker
button in the corner mutes/unmutes. The included track is a soft music-box “Happy Birthday”
with a lullaby; set `music.enabled: false` to remove the button entirely.

### ✨ Effects on/off
```js
effects: {
  floatingHearts: true,
  confetti: true,
  sparkles: true,
  backgroundMusic: true,
  threeD: true,      // the real WebGL hearts & stars — switch off for very old phones
},
```

---

## 🗂 Project structure

```
src/
├── config/
│   ├── birthdayConfig.js   ← THE file you edit
│   └── index.js            ← normalises the config (tokens, defaults, asset paths)
├── scenes/                 ← the 7 scenes (WelcomeScene … FinalLetterScene)
├── components/             ← reusable pieces: Envelope, TeddyBear, Panda, BirthdayCake,
│                             Balloons, FairyLights, FloatingHearts, Confetti, Typewriter,
│                             Carousel3D, PageTransition, GlowButton, Magic3D/Scene3D (WebGL) …
├── hooks/
│   ├── useBirthdayFlow.js  ← scene order, next / replay
│   ├── useMusic.jsx        ← music provider (starts on first tap)
│   └── useViewport.js
├── styles/animations.css   ← shared keyframes (floating, twinkling, dancing bears …)
├── App.jsx · main.jsx · index.css
public/
├── images/                 ← placeholder-*.png (+ editable SVG sources in images/source/)
└── audio/birthday-music.mp3
```

**Add another scene?** Create `src/scenes/MyScene.jsx` (it receives `onNext`), then add its
name to `SCENES` in `hooks/useBirthdayFlow.js` and to `SCENE_COMPONENTS` in `App.jsx`.

---

## 🛠 Handy while testing

In `npm run dev` only (these shortcuts don't exist in the production build):

* `http://localhost:5173/?scene=cake` — jump straight to a scene
  (`welcome`, `lights`, `birthday`, `cake`, `wish`, `gallery`, `letter`)
* add `&fast` — types the final letter 10× faster, e.g. `/?scene=letter&fast`

## ♿ Accessibility & performance

* Respects **“reduce motion”**: transforms are skipped, particles are hidden, confetti is off and the
  story still moves along.
* Large touch targets, readable contrast, keyboard-focusable buttons, `aria` labels, no pinch-zoom lock.
* Animations use only transforms/opacity. The three.js chunk loads lazily while the cute loading
  screen plays; if WebGL isn't available the 3D layer silently disappears and everything else works.
* No heavy 3D models: the hearts and stars are generated in code. Characters, cake and flowers are
  lightweight SVG.

Made with 💗
