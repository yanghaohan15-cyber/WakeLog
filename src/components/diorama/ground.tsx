import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GROUND_CLIP, getGradient } from "./materials";
import { B } from "./primitives";
import { sidewalkTexture, useTex } from "./textures";

const WET_VERT = /* glsl */ `
  varying vec3 vWorld;
  #include <clipping_planes_pars_vertex>
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;
    #include <clipping_planes_vertex>
  }
`;

const WET_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  #include <clipping_planes_pars_fragment>
  void main() {
    #include <clipping_planes_fragment>
    float grain = fract(sin(dot(vWorld.xz, vec2(12.9898, 78.233))) * 43758.5453);
    vec3 asphalt = vec3(0.15, 0.17, 0.22) * (0.92 + 0.1 * grain);

    float n = sin(vWorld.x * 0.72) * sin(vWorld.z * 0.66);
    n += sin(vWorld.x * 1.55 + vWorld.z * 1.05) * 0.55;
    float puddle = smoothstep(0.05, 0.85, n * 0.5 + 0.5);

    float nearFront = (1.0 - smoothstep(3.05, 8.4, vWorld.z))
      * (1.0 - smoothstep(0.2, 6.4, abs(vWorld.x + 0.35)));
    float nearVend = smoothstep(4.2, 5.0, vWorld.x)
      * (1.0 - smoothstep(5.2, 8.6, vWorld.x))
      * (1.0 - smoothstep(1.6, 4.8, abs(vWorld.z - 0.3)));

    vec3 warm = vec3(1.0, 0.74, 0.46);
    vec3 pink = vec3(1.0, 0.46, 0.6);
    vec3 teal = vec3(0.4, 0.82, 1.0);
    float wave = 0.5 + 0.5 * sin(vWorld.x * 1.15 + uTime * 0.55);
    vec3 neon = mix(warm, pink, wave);
    vec3 col = mix(asphalt, neon * 0.85, puddle * nearFront * 0.8);
    col = mix(col, mix(teal, pink, wave) * 0.8, puddle * nearVend * 0.75);

    float streak = sin(vWorld.x * 2.2 + vWorld.z * 0.4 + uTime * 1.35);
    streak = pow(max(streak, 0.0), 14.0);
    col += vec3(0.72, 0.84, 1.0) * streak * puddle * (0.18 + 0.4 * max(nearFront, nearVend));

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function useWetMaterial() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: WET_VERT,
        fragmentShader: WET_FRAG,
        clippingPlanes: GROUND_CLIP,
      }),
    [],
  );
  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return mat;
}

function Walk({
  w,
  d,
  x,
  z,
}: {
  w: number;
  d: number;
  x: number;
  z: number;
}) {
  const map = useMemo(() => {
    const tex = sidewalkTexture().clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(w / 1.15, d / 1.15);
    tex.needsUpdate = true;
    return tex;
  }, [w, d]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.18, z]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshToonMaterial
        map={map}
        color="#ffffff"
        gradientMap={getGradient()}
        clippingPlanes={GROUND_CLIP}
      />
    </mesh>
  );
}

function Asphalt({
  w,
  d,
  x,
  z,
  mat,
}: {
  w: number;
  d: number;
  x: number;
  z: number;
  mat: THREE.ShaderMaterial;
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.045, z]} material={mat} receiveShadow>
      <planeGeometry args={[w, d]} />
    </mesh>
  );
}

export function Plinth() {
  const tex = useTex();
  return (
    <group>
      <mesh position={[0, -0.74, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[12.2, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.38} depthWrite={false} />
      </mesh>
      <B a={[20, 0.74, 20]} p={[0, -0.37, 0]} c="#3a2a22" clip={false} recv />
      <B a={[20.06, 0.045, 20.06]} p={[0, -0.1, 0]} c="#d7b56a" e="#e6c98a" ei={0.18} clip={false} />
      <B a={[20, 0.05, 0.14]} p={[0, 0.025, 9.93]} c="#e6c98a" e="#e6c98a" ei={0.22} clip={false} />
      <B a={[20, 0.05, 0.14]} p={[0, 0.025, -9.93]} c="#e6c98a" e="#e6c98a" ei={0.12} clip={false} />
      <B a={[0.14, 0.05, 19.72]} p={[9.93, 0.025, 0]} c="#e6c98a" e="#e6c98a" ei={0.12} clip={false} />
      <B a={[0.14, 0.05, 19.72]} p={[-9.93, 0.025, 0]} c="#e6c98a" e="#e6c98a" ei={0.12} clip={false} />
      <B a={[2.15, 0.42, 0.06]} p={[0, -0.34, 10.02]} c="#6a5030" clip={false} />
      <mesh position={[0, -0.34, 10.055]}>
        <planeGeometry args={[1.95, 0.34]} />
        <meshBasicMaterial map={tex.plaque} toneMapped />
      </mesh>
    </group>
  );
}

export function Ground() {
  const mat = useWetMaterial();
  const tex = useTex();
  const tactile = useMemo(() => {
    const t = tex.tactile.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3.2, 1);
    t.needsUpdate = true;
    return t;
  }, [tex.tactile]);

  return (
    <group>
      <Asphalt mat={mat} w={18.1} d={6.05} x={0} z={5.98} />
      <Asphalt mat={mat} w={4.55} d={11.85} x={6.78} z={-2.95} />
      <Asphalt mat={mat} w={4.45} d={10.35} x={-6.72} z={-3.67} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.04, -6.52]} receiveShadow>
        <planeGeometry args={[8.2, 4.65]} />
        <meshToonMaterial color="#6a6e76" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>

      <Walk w={13.5} d={1.5} x={-2.2} z={2.24} />
      <Walk w={0.84} d={5.75} x={4.12} z={-1.32} />

      <B a={[13.5, 0.15, 0.16]} p={[-2.2, 0.1, 2.99]} c="#e4e0d6" cast recv />
      <B a={[0.16, 0.15, 7.2]} p={[4.54, 0.1, -0.6]} c="#e4e0d6" cast recv />
      <B a={[4.45, 0.14, 0.14]} p={[-6.72, 0.1, 1.5]} c="#d5d1c8" />

      <B a={[13.4, 0.02, 0.18]} p={[-2.2, 0.055, 3.16]} c="#1a1e28" />
      <B a={[0.16, 0.02, 7.0]} p={[4.7, 0.055, -0.55]} c="#1a1e28" />
      {[ -1.2, 0.6, 2.4, 4.0 ].map((x) => (
        <B key={x} a={[0.46, 0.012, 0.16]} p={[x, 0.062, 3.16]} c="#2a303c" />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.55, 0.192, 2.62]} receiveShadow>
        <planeGeometry args={[2.4, 0.55]} />
        <meshToonMaterial map={tactile} color="#ffffff" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <B key={`cx${i}`} a={[0.4, 0.018, 2.35]} p={[1.35 + i * 0.62, 0.058, 4.55]} c="#f4f7fb" e="#d5e2f5" ei={0.35} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <B key={`cz${i}`} a={[2.15, 0.018, 0.4]} p={[6.35, 0.058, 0.55 + i * 0.62]} c="#f4f7fb" e="#d5e2f5" ei={0.35} />
      ))}

      <B a={[3.4, 0.016, 0.08]} p={[-5.4, 0.06, 3.85]} c="#f7f8fb" e="#e7eef8" ei={0.25} />
      <B a={[3.4, 0.016, 0.08]} p={[-5.4, 0.06, 6.15]} c="#f7f8fb" e="#e7eef8" ei={0.25} />
      <B a={[0.08, 0.016, 2.3]} p={[-7.1, 0.06, 5.0]} c="#f7f8fb" e="#e7eef8" ei={0.25} />
      <B a={[0.08, 0.016, 2.3]} p={[-3.7, 0.06, 5.0]} c="#f7f8fb" e="#e7eef8" ei={0.25} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.4, 0.062, 5.0]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial map={tex.parking} transparent toneMapped />
      </mesh>
      <B a={[1.5, 0.08, 0.12]} p={[-5.4, 0.08, 3.95]} c="#c7c2b6" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.15, 0.055, 5.15]}>
        <ringGeometry args={[0.32, 0.46, 24]} />
        <meshToonMaterial color="#3c4454" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.15, 0.056, 5.15]}>
        <circleGeometry args={[0.32, 20]} />
        <meshToonMaterial color="#2a3140" gradientMap={getGradient()} clippingPlanes={GROUND_CLIP} />
      </mesh>

      {[-2.2, 0.4, 3.2, 5.6, 7.4].map((x) => (
        <B key={`dash${x}`} a={[0.7, 0.012, 0.08]} p={[x, 0.058, 7.15]} c="#f3f5f8" e="#dce6f4" ei={0.2} />
      ))}
      {[-6.4, -4.2, -1.6, 0.6].map((z) => (
        <B key={`vdash${z}`} a={[0.08, 0.012, 0.7]} p={[8.15, 0.058, z]} c="#f3f5f8" e="#dce6f4" ei={0.2} />
      ))}

      <Reflection />
    </group>
  );
}

function Reflection() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.068, 4.35]} renderOrder={2}>
      <planeGeometry args={[6.8, 3.6]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        clippingPlanes={GROUND_CLIP}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          #include <clipping_planes_pars_vertex>
          void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            #include <clipping_planes_vertex>
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec2 vUv;
          uniform float uTime;
          #include <clipping_planes_pars_fragment>
          void main() {
            #include <clipping_planes_fragment>
            float along = smoothstep(0.0, 0.18, vUv.y) * (1.0 - smoothstep(0.35, 0.95, vUv.y));
            float side = smoothstep(0.0, 0.16, vUv.x) * (1.0 - smoothstep(0.84, 1.0, vUv.x));
            float shimmer = 0.78 + 0.22 * sin(vUv.x * 28.0 + vUv.y * 8.0 + uTime * 1.4);
            vec3 col = mix(vec3(1.0, 0.72, 0.48), vec3(1.0, 0.5, 0.66), vUv.x);
            gl_FragColor = vec4(col, along * side * 0.34 * shimmer);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `}
      />
    </mesh>
  );
}
