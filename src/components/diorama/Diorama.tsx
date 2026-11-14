import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Assemble, AssembleScale } from "./assemble";
import { Ground, Plinth } from "./ground";
import { Props } from "./props";
import { Rain } from "./rain";
import { Store } from "./store";
import { TexProvider, createTextures } from "./textures";

function Glow({
  delay,
  position,
  color,
  intensity,
  distance,
}: {
  delay: number;
  position: [number, number, number];
  color: string;
  intensity: number;
  distance: number;
}) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const light = ref.current;
    if (!light) return;
    const k = Math.min(1, Math.max(0, (state.clock.elapsedTime - delay) / 0.5));
    light.intensity = intensity * k;
  });
  return (
    <pointLight
      ref={ref}
      position={position}
      color={color}
      intensity={0}
      distance={distance}
      decay={2}
    />
  );
}

function KeyLight() {
  const ref = useRef<THREE.DirectionalLight>(null);
  useLayoutEffect(() => {
    const light = ref.current;
    if (!light) return;
    light.target.position.set(-0.3, 0.6, -0.2);
    light.parent?.add(light.target);
  }, []);
  return (
    <directionalLight
      ref={ref}
      position={[9, 16, 11]}
      intensity={2.55}
      color="#d7e4ff"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-near={4}
      shadow-camera-far={46}
      shadow-camera-left={-13}
      shadow-camera-right={13}
      shadow-camera-top={13}
      shadow-camera-bottom={-13}
      shadow-bias={-0.0004}
      shadow-normalBias={0.05}
    />
  );
}

function Controls() {
  const ref = useRef<{ autoRotate: boolean } | null>(null);
  const idle = useRef(0);
  useEffect(() => () => window.clearTimeout(idle.current), []);
  return (
    <OrbitControls
      ref={ref as never}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={5.5}
      maxDistance={32}
      minPolarAngle={0.22}
      maxPolarAngle={Math.PI / 2 - 0.05}
      target={[-0.25, 1.45, -0.15]}
      autoRotate
      autoRotateSpeed={0.38}
      enablePan
      panSpeed={0.55}
      zoomSpeed={0.7}
      onStart={() => {
        if (ref.current) ref.current.autoRotate = false;
        window.clearTimeout(idle.current);
      }}
      onEnd={() => {
        window.clearTimeout(idle.current);
        idle.current = window.setTimeout(() => {
          if (ref.current) ref.current.autoRotate = true;
        }, 4800);
      }}
    />
  );
}

function Scene() {
  const textures = useMemo(() => createTextures(), []);
  return (
    <TexProvider value={textures}>
      <hemisphereLight args={["#8eafd4", "#2a211c", 0.38]} />
      <ambientLight intensity={0.22} color="#9eb4d8" />
      <KeyLight />
      <directionalLight position={[-8, 6, -6]} intensity={0.32} color="#7f97c4" />
      <Glow delay={2.05} position={[-0.4, 2.5, -1.1]} color="#fff1d4" intensity={58} distance={10} />
      <Glow delay={2.15} position={[-0.5, 1.6, 0.7]} color="#ffd2a8" intensity={30} distance={7} />
      <Glow delay={2.2} position={[-2.95, 1.15, 0.75]} color="#ff8a3d" intensity={9} distance={3.4} />
      <Glow delay={2.15} position={[-0.4, 1.5, -3.5]} color="#9fd6ff" intensity={8} distance={4.2} />
      <Glow delay={2.9} position={[-0.4, 3.4, 2.4]} color="#ff9eb6" intensity={12} distance={7} />
      <Glow delay={3.95} position={[5.7, 3.15, 4.35]} color="#ffc27a" intensity={26} distance={10} />
      <Glow delay={3.55} position={[3.8, 1.4, 2.85]} color="#ffd0a8" intensity={8} distance={4.2} />
      <Glow delay={3.7} position={[-6.35, 1.9, -2.5]} color="#ffd7a2" intensity={6} distance={4} />
      <mesh position={[-8, 14, -16]}>
        <sphereGeometry args={[2.1, 28, 28]} />
        <meshBasicMaterial color="#f4f0dc" />
      </mesh>
      <AssembleScale>
        <Plinth />
      </AssembleScale>
      <Assemble delay={0.22} duration={0.9} lift={0.85}>
        <Ground />
      </Assemble>
      <Store />
      <Props />
      <Rain />
      <Controls />
    </TexProvider>
  );
}

export function Diorama() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    const done = () => {
      if (live) setReady(true);
    };
    const timer = window.setTimeout(done, 2200);
    document.fonts
      .load("700 64px 'M PLUS Rounded 1c'")
      .then(() => document.fonts.ready)
      .then(done)
      .catch(done);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [11.6, 8.15, 13.8], fov: 34, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, localClippingEnabled: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.16;
      }}
    >
      {ready ? <Scene /> : null}
    </Canvas>
  );
}
