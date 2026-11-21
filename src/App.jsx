import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useBirthdayFlow } from "./hooks/useBirthdayFlow";
import { MusicProvider } from "./hooks/useMusic";
import { ConfettiProvider, useConfetti } from "./components/Confetti";
import LoadingScreen from "./components/LoadingScreen";
import MusicToggle from "./components/MusicToggle";
import PageTransition from "./components/PageTransition";
import ProgressHearts from "./components/ProgressHearts";

import WelcomeScene from "./scenes/WelcomeScene";
import LightsScene from "./scenes/LightsScene";
import BirthdayScene from "./scenes/BirthdayScene";
import CakeScene from "./scenes/CakeScene";
import WishScene from "./scenes/WishScene";
import GalleryScene from "./scenes/GalleryScene";
import FinalLetterScene from "./scenes/FinalLetterScene";

const SCENE_COMPONENTS = {
  welcome: WelcomeScene,
  lights: LightsScene,
  birthday: BirthdayScene,
  cake: CakeScene,
  wish: WishScene,
  gallery: GalleryScene,
  letter: FinalLetterScene,
};

function Story() {
  const flow = useBirthdayFlow();
  const { clear } = useConfetti();
  const [loaded, setLoaded] = useState(false);
  const onLoaded = useCallback(() => setLoaded(true), []);

  // leftover confetti never follows her into the next scene
  useEffect(() => clear(), [flow.scene, flow.runKey, clear]);

  const Scene = SCENE_COMPONENTS[flow.scene];
  const dark = flow.scene === "lights";

  return (
    <>
      <AnimatePresence>{!loaded && <LoadingScreen key="loader" onDone={onLoaded} />}</AnimatePresence>

      {loaded && (
        <>
          <AnimatePresence initial={false}>
            <PageTransition key={`${flow.runKey}-${flow.scene}`}>
              <Scene onNext={flow.next} onRestart={flow.restart} />
            </PageTransition>
          </AnimatePresence>
          <ProgressHearts index={flow.index} total={flow.total} dark={dark} />
        </>
      )}
      <MusicToggle visible={loaded} />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <ConfettiProvider>
          <Story />
        </ConfettiProvider>
      </MusicProvider>
    </MotionConfig>
  );
}
