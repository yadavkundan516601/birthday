import { Component, lazy, Suspense, useEffect, useState } from "react";
import config from "../config";
import { prefersReducedMotion } from "../lib/random";

// The three.js chunk is fetched lazily so the first screen paints instantly.
const Scene3D = lazy(() => import("./Scene3D"));
export const preload3D = () => import("./Scene3D");

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Real 3D hearts / stars behind the UI. Silently renders nothing if WebGL is off or unsupported. */
export default function Magic3D({ variant = "hearts", glow = false, className = "" }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(config.effects.threeD !== false && !prefersReducedMotion() && webglAvailable());
  }, []);
  if (!ok) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <Boundary>
        <Suspense fallback={null}>
          <Scene3D variant={variant} glow={glow} />
        </Suspense>
      </Boundary>
    </div>
  );
}
