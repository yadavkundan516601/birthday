// Real WebGL, kept deliberately small: a handful of glossy extruded hearts, or a
// twinkling star field. Loaded lazily (see Magic3D.jsx) so it never delays first paint.
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeRand } from "../lib/random";

const PINKS = ["#ff7eb0", "#ffa3c8", "#ff5c9a", "#ffb8d4", "#d9a6ff", "#ffc2a8"];

function heartGeometry() {
  const pts = [];
  for (let i = 0; i <= 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    pts.push(
      new THREE.Vector2(
        (16 * Math.sin(t) ** 3) / 17,
        (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17,
      ),
    );
  }
  const shape = new THREE.Shape();
  shape.setFromPoints(pts);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.12,
    bevelSegments: 5,
    curveSegments: 28,
  });
  geo.center();
  return geo;
}

function starGeometry() {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 1 : 0.46;
    const a = (Math.PI / 5) * i + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 3,
  });
  geo.center();
  return geo;
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function Floaters({ geometry, count, seed, palette, emissive = 0.14, spinRange = [0.3, 0.9], size = [0.3, 0.62] }) {
  const viewport = useThree((s) => s.viewport);
  const pointer = useThree((s) => s.pointer);
  const group = useRef();
  const refs = useRef([]);
  const items = useMemo(() => {
    const r = makeRand(seed);
    return Array.from({ length: count }, (_, i) => ({
      fx: r.range(-0.92, 0.92),
      fy: r.range(-0.85, 0.85),
      z: r.range(-2.6, 0.8),
      s: r.range(size[0], size[1]),
      speed: r.range(0.45, 1),
      phase: r.range(0, 6.28),
      spin: r.range(spinRange[0], spinRange[1]),
      color: palette[i % palette.length],
    }));
  }, [count, seed, palette, size, spinRange]);

  const k = Math.min(1, viewport.width / 6.5);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      const it = items[i];
      if (!m) return;
      m.rotation.y += dt * it.spin;
      m.rotation.x = Math.sin(t * it.speed + it.phase) * 0.3;
      m.position.y = (it.fy * viewport.height) / 2 + Math.sin(t * it.speed + it.phase) * 0.22;
    });
    if (group.current) {
      group.current.rotation.y += (pointer.x * 0.16 - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-pointer.y * 0.1 - group.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          geometry={geometry}
          position={[(it.fx * viewport.width) / 2, (it.fy * viewport.height) / 2, it.z]}
          scale={it.s * k}
        >
          <meshPhysicalMaterial
            color={it.color}
            roughness={0.26}
            clearcoat={1}
            clearcoatRoughness={0.12}
            emissive={it.color}
            emissiveIntensity={emissive}
          />
        </mesh>
      ))}
    </group>
  );
}

function StarField({ glow }) {
  const viewport = useThree((s) => s.viewport);
  const pts = useRef();
  const mat = useRef();
  const tex = useMemo(glowTexture, []);
  const positions = useMemo(() => {
    const r = makeRand(5);
    const n = 280;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = r.range(-1, 1) * viewport.width * 0.8;
      arr[i * 3 + 1] = r.range(-1, 1) * viewport.height * 0.75;
      arr[i * 3 + 2] = r.range(-5, 1);
    }
    return arr;
  }, [viewport.width, viewport.height]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (pts.current) pts.current.rotation.z = t * 0.012;
    if (mat.current) {
      const targetSize = glow ? 0.34 : 0.2;
      mat.current.size += (targetSize - mat.current.size) * 0.03;
      mat.current.opacity = (glow ? 0.95 : 0.7) + Math.sin(t * 1.7) * 0.15;
    }
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        map={tex}
        color="#ffffff"
        size={0.2}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const STAR_COLORS = ["#fff0a8", "#ffd1e8", "#e9d5ff", "#ffe2b8"];

export default function Scene3D({ variant = "hearts", glow = false }) {
  const hearts = useMemo(heartGeometry, []);
  const stars = useMemo(starGeometry, []);
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      eventSource={typeof document !== "undefined" ? document.getElementById("root") : undefined}
      eventPrefix="client"
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <pointLight position={[-4, -2, 3]} intensity={38} distance={22} decay={2} color="#ffb3d9" />
      {variant === "hearts" && <Floaters geometry={hearts} count={9} seed={12} palette={PINKS} />}
      {variant === "stars" && (
        <>
          <StarField glow={glow} />
          <Floaters
            geometry={stars}
            count={6}
            seed={29}
            palette={STAR_COLORS}
            emissive={glow ? 1.3 : 0.9}
            size={[0.16, 0.3]}
            spinRange={[0.4, 1.1]}
          />
        </>
      )}
    </Canvas>
  );
}
